import json,re,unicodedata,math,copy
from pathlib import Path
import pandas as pd
root=Path(__file__).resolve().parents[1]
# load v0.54 historical dataset
raw=(root/'data/historical-universes-v0.54.js').read_text().strip()
prefix='window.NBA_COURTSIDE_HISTORICAL_V54 = '
H54=json.loads(raw[len(prefix):].rstrip(';'))
rawD=(root/'data/data-v0.44.js').read_text().strip(); D=json.loads(rawD[len('window.NBA_COURTSIDE_DATA = '):].rstrip(';'))
base=D['players']; teams={t['abbr']:t for t in D['league']['teams']}
R=json.load(open(root/'raw/rosters_2018_opening.json'))
darko=pd.read_csv(root/'raw/player_ratings_day1_2018_19.csv')
prevstats=pd.read_csv(root/'raw/player_stats_2017_18.csv')
prevplayers=pd.read_csv(root/'raw/players_2017_18.csv')
salaries=pd.read_csv(root/'raw/nba_salaries_2000_2020.csv')
fixtures=pd.read_csv(root/'raw/nba_2018_fixtures.csv')

def norm(s):
 s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower(); s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s); return re.sub(r'[^a-z0-9]','',s)
def clamp(x,a,b): return max(a,min(b,x))
def pos_list(pos):
 out=[]
 for x in str(pos or 'SF').replace('–','-').split('-'):
  x=x.strip().upper()
  if x in ['PG','SG','SF','PF','C']: out.append(x)
  elif x=='G': out+=['PG','SG']
  elif x=='F': out+=['SF','PF']
 return list(dict.fromkeys(out)) or ['SF']
base_by={norm(p['name']):p for p in base}
darko_by={norm(r.player_name):r for _,r in darko.iterrows()}
prevpos={norm(r.Name):r for _,r in prevplayers.iterrows()}
# total-team stats preference
prevstats['_n']=prevstats.Player.map(norm)
prevstat_by={}
for k,g in prevstats.groupby('_n'):
 row=g[g.Tm=='TOT'].iloc[0] if (g.Tm=='TOT').any() else g.sort_values('Gms',ascending=False).iloc[0]
 prevstat_by[k]=row
sal19={norm(r['name']):r for _,r in salaries[salaries.season==2019].iterrows()}
sal20={norm(r['name']):r for _,r in salaries[salaries.season==2020].iterrows()}
# targeted naming aliases
aliases={norm('Mohamed Bamba'):norm('Mo Bamba'),norm('Nene'):norm('Nene Hilario'),norm('JJ Redick'):norm('J.J. Redick'),norm('TJ Warren'):norm('T.J. Warren'),norm('TJ Leaf'):norm('T.J. Leaf'),norm('CJ McCollum'):norm('C.J. McCollum'),norm('CJ Miles'):norm('C.J. Miles'),norm('CJ Wilcox'):norm('C.J. Wilcox'),norm('JR Smith'):norm('J.R. Smith')}
def lookup(d,name):
 k=norm(name)
 if k in d: return d[k]
 ak=aliases.get(k)
 return d.get(ak) if ak in d else None

def rating(name, positions):
 d=lookup(darko_by,name); st=lookup(prevstat_by,name)
 # Day-one DARKO is the no-hindsight backbone. Total DPM drives overall; prior-year box score shapes skills.
 if d is not None:
  total=float(d.o_dpm)+float(d.d_dpm); mins=float(d.minutes)
  ovr=int(round(clamp(76+2.65*total + .018*(mins-22),61,96)))
  off=int(round(clamp(ovr + float(d.o_dpm)*2.1 - total*1.0,45,97)))
  de=int(round(clamp(ovr + float(d.d_dpm)*2.2 - total*1.0,45,97)))
 else:
  ovr=67; off=67; de=67; mins=8
 if st is not None:
  def sv(v,default=0): return default if pd.isna(v) else float(v)
  g=max(1,sv(st.Gms,1)); pts=sv(st.PTS)/g; reb=sv(st.TRB)/g; ast=sv(st.AST)/g; stl=sv(st.STL)/g; blk=sv(st.BLK)/g
  tp=sv(st.ThreePP,.30); ft=sv(st.FTP,.72)
 else:
  pts=8;reb=3.5;ast=1.8;stl=.6;blk=.35;tp=.33;ft=.72
 isbig='C' in positions; guard=any(x in positions for x in ['PG','SG'])
 return {
  'overall':ovr,'skill_overall':ovr,'impact':ovr,
  'offense':off,'defense':de,'finishing':int(clamp(round(ovr+(4 if isbig else 1)+(pts-10)*.12),45,96)),
  'three_pt':int(clamp(round(44+tp*72),40,96)),'free_throw':int(clamp(round(38+ft*65),45,96)),
  'shot_creation':int(clamp(round(off+(4 if pts>=18 else -1)),44,96)),
  'playmaking':int(clamp(round(off+(5 if 'PG' in positions else ast*.8-3)),42,96)),
  'ball_security':int(clamp(round(off+2-(2.5 if ast<2 else 0)),42,95)),
  'offensive_rebounding':int(clamp(round(ovr+(7 if isbig else reb*.5-5)),40,96)),
  'defensive_rebounding':int(clamp(round(ovr+(7 if isbig else reb*.55-4)),40,96)),
  'stamina':int(clamp(round(57+mins*1.1),50,96)),
  'perimeter_defense':int(clamp(round(de+(-7 if isbig else 2)+stl),40,96)),
  'interior_defense':int(clamp(round(de+(8 if isbig else -5)+blk),40,96))}

def player_age(name):
 b=lookup(base_by,name)
 if b: return int(clamp(int(b.get('age',27))-8,18,42))
 pp=lookup(prevpos,name)
 if pp is not None: return int(clamp(int(pp.Age)+1,18,43))
 return 21

def player_positions(name):
 b=lookup(base_by,name)
 if b: return list(b.get('positions') or ['SF'])
 pp=lookup(prevpos,name)
 if pp is not None: return pos_list(pp.Pos)
 # fallback from salary position when available
 s=lookup(sal19,name)
 return pos_list(s['position']) if s is not None else ['SF']

def contract(name,team,status,age):
 s=lookup(sal19,name); amount=int(s.salary) if s is not None else (770000 if status=='two_way' else 1350000)
 rows=[{'season_start':2018,'season':'2018-19','amount':amount,'option':'guaranteed','source':'espn_2018_19_salary' if s is not None else 'v0.55_modeled_opening_salary'}]
 # Source-informed continuity only when the player remained with the same team in ESPN's next salary season.
 s2=lookup(sal20,name)
 if s2 is not None and s is not None and str(s2.team)==str(s.team):
  rows.append({'season_start':2019,'season':'2019-20','amount':int(s2.salary),'option':'guaranteed','source':'espn_2019_20_same_team_salary_continuity'})
 elif age<=23 and status!='two_way':
  rows.append({'season_start':2019,'season':'2019-20','amount':int(round(amount*1.05)),'option':'guaranteed','source':'v0.55_modeled_rookie_continuity'})
 return {'years':rows,'expiry':'RFA' if age<=24 else 'UFA','signed':'2018-07-01','route':'historical_v55_opening_contract','team':team,'historical_modeled':len(rows)>1 and rows[-1]['source'].startswith('v0.55')}

hist=[];assign={}; roster_meta={}; canonical_matches=0; darko_matches=0; salary_matches=0
for tm,rows in R.items():
 for j,r in enumerate(rows):
  name=r['name']; n=norm(name); positions=player_positions(name); age=player_age(name); d=lookup(darko_by,name); b=lookup(base_by,name); s=lookup(sal19,name)
  if d is not None: darko_matches+=1
  if b: canonical_matches+=1
  if s is not None: salary_matches+=1
  nid=int(d.nba_id) if d is not None else None; hid=f"hist-2018-{nid if nid else n}"
  status='two_way' if r['two_way'] else 'active'
  rat=rating(name,positions); con=contract(name,tm,status,age)
  hist.append({'id':hid,'name':name,'team':tm,'age':age,'positions':positions,'position_group':'big' if 'C' in positions else ('guard' if any(x in positions for x in ['PG','SG']) else 'wing'),'roster_status':status,'contract':con,'headshot_url':b.get('headshot_url') if b else None,'stats_2025_26':None,'ratings':rat,'tendencies':None,'rating_source':'historical_2018_19_day_one_darko_v0.55' if d is not None else 'historical_2018_19_prior_evidence_modeled_v0.55','data_confidence':.84 if d is not None else .58,'career_status':'historical_2018_19_player','data_quality':['official_2018_19_opening_roster','day_one_2018_19_rating_evidence' if d is not None else 'modeled_rating_fallback','source_backed_2018_19_salary' if s is not None else 'modeled_salary'],'simulation_profile':None,'development_profile':{'career_stage':'development' if age<=23 else ('prime' if age<=30 else 'decline'),'trend':'stable','prime_age_range':[24,29],'baseline_next_year_overall_delta':0,'note':'2018-19 opening-night player. Career outcome diverges with the save.'},'rights_team':None,'years_service':max(0,age-20),'historical_identity':{'nba_id':nid,'canonical_player_id':b.get('id') if b else None,'season':'2018-19','opening_status':r['status'],'two_way':r['two_way']}})
  assign[hid]=tm; roster_meta[hid]={'opening_status':r['status'],'two_way':r['two_way']}

# Actual 2018-19 schedule dates/matchups. Historical scores are intentionally NOT seeded: history diverges before Game 1.
full_to_abbr={
'Atlanta Hawks':'ATL','Boston Celtics':'BOS','Brooklyn Nets':'BKN','Charlotte Hornets':'CHA','Chicago Bulls':'CHI','Cleveland Cavaliers':'CLE','Dallas Mavericks':'DAL','Denver Nuggets':'DEN','Detroit Pistons':'DET','Golden State Warriors':'GSW','Houston Rockets':'HOU','Indiana Pacers':'IND','LA Clippers':'LAC','Los Angeles Lakers':'LAL','Memphis Grizzlies':'MEM','Miami Heat':'MIA','Milwaukee Bucks':'MIL','Minnesota Timberwolves':'MIN','New Orleans Pelicans':'NOP','New York Knicks':'NYK','Oklahoma City Thunder':'OKC','Orlando Magic':'ORL','Philadelphia 76ers':'PHI','Phoenix Suns':'PHX','Portland Trail Blazers':'POR','Sacramento Kings':'SAC','San Antonio Spurs':'SAS','Toronto Raptors':'TOR','Utah Jazz':'UTA','Washington Wizards':'WAS'}
schedule=[]
for i,r in fixtures.iterrows():
 dt=pd.to_datetime(r['Date'],dayfirst=True); h=full_to_abbr[str(r['Home Team'])]; a=full_to_abbr[str(r['Away Team'])]
 schedule.append({'id':f'H18-{int(r["Match Number"]):04d}','date':dt.strftime('%Y-%m-%d'),'time_et':dt.strftime('%H:%M'),'home':h,'away':a,'official':True,'source':'2018_19_fixture_export_crosschecked_nba_release'})

# Official 2019 NBA Draft identity order; final NBA destination is metadata only and never forced in alternate history.
draft2019=[
('Zion Williamson','NOP'),('Ja Morant','MEM'),('RJ Barrett','NYK'),("De'Andre Hunter",'ATL'),('Darius Garland','CLE'),('Jarrett Culver','MIN'),('Coby White','CHI'),('Jaxson Hayes','NOP'),('Rui Hachimura','WAS'),('Cam Reddish','ATL'),('Cameron Johnson','PHX'),('P.J. Washington','CHA'),('Tyler Herro','MIA'),('Romeo Langford','BOS'),('Sekou Doumbouya','DET'),('Chuma Okeke','ORL'),('Nickeil Alexander-Walker','NOP'),('Goga Bitadze','IND'),('Luka Samanic','SAS'),('Matisse Thybulle','PHI'),('Brandon Clarke','MEM'),('Grant Williams','BOS'),('Darius Bazley','OKC'),('Ty Jerome','PHX'),('Nassir Little','POR'),('Dylan Windler','CLE'),('Mfiondu Kabengele','LAC'),('Jordan Poole','GSW'),('Keldon Johnson','SAS'),('Kevin Porter Jr.','CLE'),('Nicolas Claxton','BKN'),('KZ Okpala','MIA'),('Carsen Edwards','BOS'),('Bruno Fernando','ATL'),('Didi Louzada','NOP'),('Cody Martin','CHA'),('Deividas Sirvydis','DET'),('Daniel Gafford','CHI'),('Alen Smailagic','GSW'),('Justin James','SAC'),('Eric Paschall','GSW'),('Admiral Schofield','WAS'),('Jaylen Nowell','MIN'),('Bol Bol','DEN'),('Isaiah Roby','DAL'),('Talen Horton-Tucker','LAL'),('Ignas Brazdeikis','NYK'),('Terance Mann','LAC'),('Quinndary Weatherspoon','SAS'),('Jarrell Brantley','UTA'),('Tremont Waters','BOS'),('Jalen McDaniels','CHA'),('Justin Wright-Foreman','UTA'),('Marial Shayok','PHI'),('Kyle Guy','SAC'),('Jaylen Hands','BKN'),('Jordan Bone','DET'),('Miye Oni','UTA'),('Dewan Hernandez','TOR'),('Vanja Marinkovic','SAC')]
real19=[]
for pick,(name,hteam) in enumerate(draft2019,1):
 b=lookup(base_by,name); positions=list(b.get('positions') or ['SF']) if b else ['PG','SG'] if any(k in name for k in ['Morant','Garland','White','Jerome','Edwards','Waters','Hands','Bone']) else ['SF','PF']
 age=int(clamp((b.get('age',28)-7) if b else 21,18,24)) if b else 21
 # Pre-career uncertainty: order band sets only a broad readiness seed. No 2026 rating is used.
 if pick<=3: o=77
 elif pick<=10:o=74
 elif pick<=20:o=72
 elif pick<=30:o=70
 elif pick<=45:o=68
 else:o=66
 # Deterministic modest variation that does not encode real career outcome.
 wiggle=((sum(ord(c) for c in name)%5)-2); o=int(clamp(o+wiggle,63,79)); pot=int(clamp(o+(13 if pick<=5 else 11 if pick<=14 else 9 if pick<=30 else 8),75,95))
 rat={'overall':o,'skill_overall':o,'impact':o,'offense':o,'defense':o,'finishing':o,'three_pt':clamp(o,45,91),'free_throw':clamp(o+1,50,92),'shot_creation':o,'playmaking':clamp(o+(3 if 'PG' in positions else -2),44,92),'ball_security':o,'offensive_rebounding':clamp(o+(5 if 'C' in positions else -4),42,92),'defensive_rebounding':clamp(o+(5 if 'C' in positions else -2),42,92),'stamina':clamp(o+5,52,94),'perimeter_defense':clamp(o+(-4 if 'C' in positions else 1),42,92),'interior_defense':clamp(o+(6 if 'C' in positions else -4),42,92)}
 real19.append({'pick':pick,'name':name,'school':None,'positions':positions,'historical_drafted_by':hteam,'source_player_id':b.get('id') if b else None,'age':age,'ratings':rat,'potential_seed':pot,'headshot_url':b.get('headshot_url') if b else None})

H=copy.deepcopy(H54); H['version']='v0.55'
# Put the dramatic opening-night start first in Historical choices, after current.
starts=[s for s in H['starts'] if s['id']=='current-2026-27']
starts.append({'id':'historical-2018-19-opening-night','label':'2018–19 Opening Night','seasonYear':2018,'kind':'historical','status':'certified_roster_schedule_foundation','startLabel':'OCTOBER 16, 2018 · OPENING NIGHT','description':'Begin before Game 1 with the official opening-night rosters and schedule. The real 2019 rookie class waits next summer.'})
starts += [s for s in H['starts'] if s['id']!='current-2026-27']
H['starts']=starts
H['historical_2018_19']={'startId':'historical-2018-19-opening-night','seasonYear':2018,'date':'2018-10-16','phase':'regular_season','seasonStarted':True,'seasonComplete':False,'cbaRuleset':'CBA_2017','dates':{'opening_day':'2018-10-16','trade_deadline':'2019-02-07','regular_season_end':'2019-04-10'},'cap':{'season':'2018-19','salary_floor':91682000,'salary_cap':101869000,'luxury_tax':123733000,'first_apron':129817000,'second_apron':999999999,'apron_label':'TAX APRON','modern_second_apron':False},'capTimeline':{'2018':{'season':'2018-19','salary_floor':91682000,'salary_cap':101869000,'luxury_tax':123733000,'first_apron':129817000,'second_apron':999999999,'modern_second_apron':False},'2019':{'season':'2019-20','salary_floor':98226000,'salary_cap':109140000,'luxury_tax':132627000,'first_apron':138928000,'second_apron':999999999,'modern_second_apron':False}},'assignments':assign,'historicalPlayers':hist,'scheduleGames':schedule,'seasonStats':{},'seedGames':[],'rosterMeta':roster_meta,'sourceBoundary':{'rosters':'Official NBA opening-night roster release dated Oct. 15, 2018. Active, inactive, suspended and two-way listings are retained for all 30 clubs.','ratings':'Day-one 2018-19 DARKO player estimates are used as the no-hindsight rating backbone where available (478 of 494 opening-roster players); unmatched players use prior-season evidence/model fallback.','schedule':'All 1,230 2018-19 regular-season matchups/dates are loaded from a fixture export and cross-checked against the official NBA schedule release. Historical scores are not seeded because history diverges before Game 1.','results':'No 2018-19 regular-season results are preloaded. Every result after October 16, 2018 is created by this save.','contracts':'2018-19 salary amounts are source-backed where matched; unresolved multi-year contract continuity remains modeled until a dedicated contract certification pack.','picks':'Pre-divergence traded future-pick ownership is not yet certified; future origin picks begin as modeled own-team assets and then diverge normally inside the save.','staff':'Historical 2018-19 staff identities are not yet certified in this pack; the retained staff engine supplies modeled coaching/front-office state.','availability':'Opening roster active/inactive/suspended/two-way designations are retained as source metadata, but exact opening-day injury durations are not reconstructed; playable availability begins clean unless the simulation creates an injury.','cba':'2018-19 cap, tax, salary floor and exception-era context use the 2017 CBA. Modern second-apron restrictions are disabled; some deep transaction-rule edge cases remain modeled by the retained CBA engine.','start_point':'October 16, 2018 before the first regular-season game. No future real transaction, result, award, playoff outcome or draft destination is scripted.'},'coverage':{'openingRosterPlayers':len(hist),'dayOneRatingMatches':darko_matches,'salaryMatches':salary_matches,'canonicalIdentityMatches':canonical_matches,'scheduleGames':len(schedule)}}
H['realDraftClasses']['2019']={'year':2019,'source':'NBA.com 2019 NBA Draft Results / Picks 1-60','identityStatus':'official_60_pick_class','careerMode':'authentic_uncertainty','prospects':real19}
H['officialHistoricalDraftYears']=sorted(set([2019,2026]))
H['realDraftYears']=sorted(set([2019,2026]))
# Discontinuous coverage is explicit. Uncovered years still generated until separately certified.
H['pipelineBoundary']='Certified full real draft-result classes currently exist for 2019 and 2026; 2027 retains the source-backed watch class. Uncovered historical years use generated classes until added as certified data packs.'
out=root/'data/historical-universes-v0.55.js'; out.write_text('window.NBA_COURTSIDE_HISTORICAL_V55 = '+json.dumps(H,separators=(',',':'),ensure_ascii=False)+';\nwindow.NBA_COURTSIDE_HISTORICAL_V54 = window.NBA_COURTSIDE_HISTORICAL_V55;\n')
print('wrote',out,out.stat().st_size)
print('roster',len(hist),'darko',darko_matches,'salary',salary_matches,'schedule',len(schedule),'draft2019',len(real19))
from collections import Counter
print('team counts',dict(sorted(Counter(assign.values()).items())))
print('schedule dates',schedule[0],schedule[-1])
