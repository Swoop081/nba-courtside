import json, re, unicodedata, math
from pathlib import Path
import pandas as pd

root=Path(__file__).resolve().parents[1]
s=(root/'data/data-v0.44.js').read_text().strip(); prefix='window.NBA_COURTSIDE_DATA = '
D=json.loads(s[len(prefix):].rstrip(';'))
base=D['players']

# Official 2026 draft results from NBA.com (pick order + school/club). Destination is historical metadata only.
draft_rows = [
(1,'AJ Dybantsa','F','BYU','WAS'),(2,'Darryn Peterson','G','Kansas','UTA'),(3,'Cameron Boozer','F/C','Duke','MEM'),(4,'Caleb Wilson','F','North Carolina','CHI'),(5,'Keaton Wagler','G','Illinois','LAC'),(6,'Mikel Brown Jr.','G','Louisville','BKN'),(7,'Darius Acuff Jr.','G','Arkansas','SAC'),(8,'Kingston Flemings','G','Houston','ATL'),(9,'Morez Johnson Jr.','F/C','Michigan','DAL'),(10,'Brayden Burries','G','Arizona','MIL'),(11,'Yaxel Lendeborg','F','Michigan','GSW'),(12,'Aday Mara','C','Michigan','OKC'),(13,'Nate Ament','F','Tennessee','MIA'),(14,'Hannes Steinbach','F/C','Washington','CHA'),(15,'Dailyn Swain','F','Texas','CHI'),(16,'Bennett Stirtz','G','Iowa','MEM'),(17,'Ebuka Okorie','G','Stanford','OKC'),(18,'Christian Anderson','G','Texas Tech','CHA'),(19,'Allen Graves','F','Santa Clara','TOR'),(20,'Jayden Quaintance','F/C','Kentucky','SAS'),(21,'Karim Lopez','F','New Zealand Breakers','DET'),(22,'Labaron Philon Jr.','G','Alabama','PHI'),(23,'Zuby Ejiofor','F/C',"St. John's",'ATL'),(24,'Cameron Carr','G','Baylor','NYK'),(25,'Sergio De Larrea','G','Valencia','LAL'),(26,'Tarris Reed Jr.','C','Connecticut','DEN'),(27,'Chris Cenac Jr.','F/C','Houston','BOS'),(28,'Joshua Jefferson','F','Iowa State','MIN'),(29,'Alex Karaban','F','Connecticut','CLE'),(30,'Koa Peat','F','Arizona','DAL'),
(31,'Bruce Thornton','G','Ohio State','NYK'),(32,'Richie Saunders','G/F','BYU','MEM'),(33,'Isaiah Evans','G/F','Duke','BKN'),(34,'Meleek Thomas','G','Arkansas','SAC'),(35,'Trevon Brazile','F/C','Arkansas','SAS'),(36,'Baba Miller','F/C','Cincinnati','LAC'),(37,'Ryan Conwell','G','Louisville','OKC'),(38,'Braden Smith','G','Purdue','CHI'),(39,'Jack Kayil','G','Alba Berlin','HOU'),(40,'Dillon Mitchell','F','St. John\'s','BOS'),(41,'Otega Oweh','G/F','Kentucky','MIA'),(42,"Ja'Kobi Gillespie",'G','Tennessee','SAS'),(43,'Tyler Bilodeau','F','UCLA','BKN'),(44,'Maliq Brown','F/C','Duke','SAS'),(45,'Emanuel Sharp','G','Houston','SAC'),(46,'Felix Okpara','C','Tennessee','ORL'),(47,'Tyler Nickel','F','Vanderbilt','PHX'),(48,'Tobi Lawal','F','Virginia Tech','DAL'),(49,'Bryce Hopkins','F','St. John\'s','DEN'),(50,'Jaden Bradley','G','Arizona','TOR'),(51,'Izaiyah Nelson','C','South Florida','WAS'),(52,'Henri Veesaar','C','North Carolina','LAC'),(53,'Ugonna Onyenso','C','Virginia','HOU'),(54,'Lajae Jones','F','Florida State','GSW'),(55,'Nick Martinelli','F','Northwestern','NYK'),(56,'Vsevolod Ishchenko','F/C','Lokomotiv Kuban','CHI'),(57,'Narcisse Ngoy','C','Poitiers','ATL'),(58,'Jaron Pierre Jr.','G','Southern Methodist','NOP'),(59,'Trey Kaufman-Renn','F/C','Purdue','MIN'),(60,'Malique Lewis','F','South East Melbourne','WAS')]

def norm(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower()
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s)
    return re.sub(r'[^a-z0-9]','',s)

name_to_base={}
for p in base:
    name_to_base.setdefault(norm(p['name']),[]).append(p)
# targeted aliases
aliases={norm('Labaron Philon Jr.'):'labaronphilon',norm('Darius Acuff Jr.'):'dariusacuff',norm('Morez Johnson Jr.'):'morezjohnson',norm('Luguentz Dort'):norm('Lu Dort'),norm('Nic Claxton'):norm('Nicolas Claxton'),norm('Alex Sarr'):norm('Alexandre Sarr'),norm('Bub Carrington'):norm('Carlton Carrington'),norm('Cam Christie'):norm('Cameron Christie')}

def find_base(name):
    k=norm(name); k=aliases.get(k,k)
    c=name_to_base.get(k,[])
    return c[0] if c else None

# 2025-26 final per-game table. For multi-team players, last team row is treated as end-of-regular-season club;
# TOT rows are used only for player totals.
bref=pd.read_csv(root/'raw/bref_player_per_game_2025_26_final.csv')
TEAM={'BRK':'BKN','CHO':'CHA','PHO':'PHX','GS':'GSW','NO':'NOP'}
def tm(x): return TEAM.get(str(x),str(x))

# final team row & total row
final_rows={}; total_rows={}
for pid,g in bref.groupby('player_id',sort=False):
    gt=g[g['team'].astype(str).str.endswith('TM')]
    total_rows[pid]=(gt.iloc[0] if len(gt) else g.iloc[-1])
    specific=g[~g['team'].astype(str).str.endswith('TM')]
    final_rows[pid]=(specific.iloc[-1] if len(specific) else None)

# Match BRef rows to current-player identities by normalized names.
base_by_norm={norm(p['name']):p for p in base}
assignments={}
season_stats={}
hist_only=[]
base_seen=set()

def pos_list(pos):
    raw=str(pos or 'SF').split('-')
    out=[]
    for x in raw:
        x=x.strip()
        if x in ('PG','SG','SF','PF','C'): out.append(x)
        elif x=='G': out += ['PG','SG']
        elif x=='F': out += ['SF','PF']
    return list(dict.fromkeys(out)) or ['SF']

def clamp(x,a,b): return max(a,min(b,x))

def hist_rating(row,positions):
    pts=float(row.get('pts_per_game') or 0); reb=float(row.get('trb_per_game') or 0); ast=float(row.get('ast_per_game') or 0); stl=float(row.get('stl_per_game') or 0); blk=float(row.get('blk_per_game') or 0); tov=float(row.get('tov_per_game') or 0); mpg=float(row.get('mp_per_game') or 0)
    prod=pts*.48+reb*.29+ast*.38+stl*1.05+blk*.95-tov*.20
    o=int(round(clamp(58+prod*.72+mpg*.08,58,85)))
    tp=float(row.get('x3p_percent') or 0) if not pd.isna(row.get('x3p_percent')) else 0
    ft=float(row.get('ft_percent') or 0) if not pd.isna(row.get('ft_percent')) else .72
    isbig='C' in positions
    return {'overall':o,'skill_overall':o,'impact':o,'offense':clamp(o+int((pts-10)/6),45,90),'defense':clamp(o+int((stl+blk-1)*3),45,90),'finishing':clamp(o+(4 if isbig else 1),45,92),'three_pt':clamp(round(45+tp*55),40,94),'free_throw':clamp(round(42+ft*55),45,94),'shot_creation':clamp(o+(3 if pts>=18 else -2),45,90),'playmaking':clamp(o+(5 if 'PG' in positions else int(ast/2)-2),42,92),'ball_security':clamp(o-int(tov),42,92),'offensive_rebounding':clamp(o+(6 if isbig else -5),40,94),'defensive_rebounding':clamp(o+(6 if isbig else int(reb/2)-3),40,94),'stamina':clamp(round(55+mpg),50,95),'perimeter_defense':clamp(o+(-5 if isbig else 1),40,92),'interior_defense':clamp(o+(7 if isbig else -5),40,94)}

def stat_totals(row,pid):
    gp=int(row.get('g') or 0); gs=int(row.get('gs') or 0) if not pd.isna(row.get('gs')) else 0; mpg=float(row.get('mp_per_game') or 0)
    def v(k):
        z=row.get(k); return 0.0 if pd.isna(z) else float(z)
    return {'gp':gp,'gs':gs,'min':round(mpg*gp,1),'pts':round(v('pts_per_game')*gp,1),'reb':round(v('trb_per_game')*gp,1),'ast':round(v('ast_per_game')*gp,1),'stl':round(v('stl_per_game')*gp,1),'blk':round(v('blk_per_game')*gp,1),'tov':round(v('tov_per_game')*gp,1),'fgm':round(v('fg_per_game')*gp,1),'fga':round(v('fga_per_game')*gp,1),'tpm':round(v('x3p_per_game')*gp,1),'tpa':round(v('x3pa_per_game')*gp,1),'ftm':round(v('ft_per_game')*gp,1),'fta':round(v('fta_per_game')*gp,1),'pf':round(v('pf_per_game')*gp,1)}

# Keep max 18 end-of-season players per team ranked by games on that final team.
candidates=[]
for pid,row in final_rows.items():
    if row is None: continue
    t=tm(row['team'])
    if t not in {x['abbr'] for x in D['league']['teams']}: continue
    candidates.append((t,int(row['g']),pid,row))
selected=set()
for t in {x['abbr'] for x in D['league']['teams']}:
    rows=sorted([x for x in candidates if x[0]==t],key=lambda x:(x[1],float(x[3].get('mp_per_game') or 0)),reverse=True)[:18]
    selected.update(x[2] for x in rows)
# Preserve matched established current identities even when injury/low-games evidence pushes them outside the top-18 approximation.
for t,g,pid,row in candidates:
    bp=find_base(str(total_rows[pid]['player']))
    if bp and bp.get('career_status') not in ('rookie_2026_projected','pre_nba_or_no_nba_sample_projected'):
        selected.add(pid)

for pid in selected:
    row=final_rows[pid]; total=total_rows[pid]; name=str(total['player']); t=tm(row['team']); bp=find_base(name)
    if bp and bp.get('career_status')!='rookie_2026_projected':
        assignments[bp['id']]=t; base_seen.add(bp['id']); season_stats[bp['id']]=stat_totals(total,pid)
    elif not bp:
        ps=pos_list(total.get('pos'))
        ratings=hist_rating(total,ps)
        hid=f'hist-2025-{pid}'
        age=int(total['age']) if not pd.isna(total['age']) else 26
        hist_only.append({'id':hid,'name':name,'team':t,'age':age,'positions':ps,'position_group':'big' if 'C' in ps else ('guard' if ('PG' in ps or 'SG' in ps) else 'wing'),'roster_status':'active','contract':{'years':[{'season_start':2025,'season':'2025-26','amount':1800000,'option':'guaranteed'}],'expiry':'UFA','qualifying_offer':None,'cap_hold':None},'headshot_url':None,'stats_2025_26':None,'ratings':ratings,'tendencies':None,'rating_source':'historical_2025_26_stat_translation_v0.54','data_confidence':0.68,'career_status':'historical_2025_26_player','data_quality':['source_backed_2025_26_stats','modeled_contract_continuity'],'simulation_profile':None,'development_profile':{'career_stage':'prime' if 25<=age<=30 else ('development' if age<25 else 'decline'),'trend':'stable','prime_age_range':[25,29],'baseline_next_year_overall_delta':0,'note':'Historical 2025-26 player translated from final regular-season evidence.'},'rights_team':None,'years_service':max(0,age-20),'historical_identity':{'bref_id':pid,'season':'2025-26'}})
        assignments[hid]=t; season_stats[hid]=stat_totals(total,pid)

# Keep injured/zero-sample established current players if they are not incoming 2026 rookies, using current team as a modeled continuity fallback.
for p in base:
    if p['id'] in assignments: continue
    if p.get('career_status') in ('rookie_2026_projected','pre_nba_or_no_nba_sample_projected'): continue
    if p.get('team') and (p.get('stats_2025_26') is None or p.get('career_status') in ('nba_established','low_sample_established')):
        # Only used when the retained BRef extract cannot resolve a current established identity; marked as modeled continuity.
        assignments[p['id']]=p['team']
        if p.get('stats_2025_26') and p['id'] not in season_stats:
            st=p['stats_2025_26']; gp=int(st.get('gp') or 0)
            season_stats[p['id']]={'gp':gp,'gs':int(st.get('gs') or 0),'min':round(float(st.get('mpg') or 0)*gp,1),'pts':round(float(st.get('pts') or 0)*gp,1),'reb':round(float(st.get('reb') or 0)*gp,1),'ast':round(float(st.get('ast') or 0)*gp,1),'stl':round(float(st.get('stl') or 0)*gp,1),'blk':round(float(st.get('blk') or 0)*gp,1),'tov':round(float(st.get('tov') or 0)*gp,1),'fgm':0,'fga':0,'tpm':0,'tpa':0,'ftm':0,'fta':0,'pf':0}

# Reconstruct the 2025-26 regular-season game ledger from retained player game logs.
# Summing player points by club/date recovers actual team scores, so standings/tiebreakers are not based on synthetic margins.
gl=pd.read_csv(root/'raw/nba_game_logs_2025_26_regular_validation.csv')
valid_teams={x['abbr'] for x in D['league']['teams']}
gl['team_v54']=gl['Tm'].map(tm); gl['opp_v54']=gl['Opp'].map(tm)
gl=gl[gl['team_v54'].isin(valid_teams) & gl['opp_v54'].isin(valid_teams)].copy()
gl['PTS_num']=pd.to_numeric(gl['PTS'],errors='coerce').fillna(0)
team_game=gl.groupby(['Date','team_v54','opp_v54'],as_index=False).agg(score=('PTS_num','sum'), result=('Result','first'))
by_key={};
for _,r in team_game.iterrows():
    date=str(r['Date']); a=r['team_v54']; b=r['opp_v54']; key=(date,tuple(sorted((a,b))))
    by_key.setdefault(key,{})[a]={'score':int(r['score']),'result':str(r['result'])}
seed_games=[]
for (date,pair),sides in sorted(by_key.items()):
    if len(sides)!=2: continue
    a,b=pair
    # Home/away is not encoded in the retained validation extract. Preserve a deterministic orientation; only scores/results matter to standings.
    home,away=a,b
    hs=sides[home]['score']; aw=sides[away]['score']
    seed_games.append({'id':f'H25-{date}-{home}-{away}','date':date,'home':home,'away':away,'official':True,'source':'2025_26_player_game_log_team_score_reconstruction','result':{'home_score':hs,'away_score':aw}})

# Build real 2026 prospect source. Use existing v0.52 current-player ratings when the player is in the 2026-27 data; otherwise use a deterministic pick-band scouting seed.
real2026=[]
for pick,name,pos,school,hist_team in draft_rows:
    bp=find_base(name)
    if bp:
        age=max(18,int(bp['age']))
        ratings=dict(bp['ratings'])
        o=int(ratings['overall'])
        # Keep current-day 2026 projection as ability evidence, but do not copy current team/contract into the historical draft pool.
        pot=max(o+3, min(97, o + (10 if pick<=5 else 8 if pick<=14 else 6 if pick<=30 else 5)))
        positions=bp['positions']
        head=bp.get('headshot_url')
        source_id=bp['id']
    else:
        age=22 if pick>=31 else 20
        if pick<=5:o=79-pick//2
        elif pick<=14:o=76-(pick-6)//5
        elif pick<=30:o=73-(pick-15)//8
        else:o=69-(pick-31)//15
        o=int(clamp(o,64,80));pot=int(clamp(o+(12 if pick<=10 else 9 if pick<=30 else 7),72,94))
        positions={'G':['PG','SG'],'F':['SF','PF'],'C':['C'],'F/C':['PF','C'],'G/F':['SG','SF']}.get(pos,['SF'])
        ratings={'overall':o,'skill_overall':o,'impact':o,'offense':o,'defense':o,'finishing':o,'three_pt':clamp(o-1,40,95),'free_throw':clamp(o,45,95),'shot_creation':o,'playmaking':clamp(o+(3 if 'PG' in positions else -2),42,94),'ball_security':o,'offensive_rebounding':clamp(o+(5 if 'C' in positions else -4),40,94),'defensive_rebounding':clamp(o+(5 if 'C' in positions else -2),40,94),'stamina':clamp(o+5,50,95),'perimeter_defense':clamp(o+(-4 if 'C' in positions else 1),40,94),'interior_defense':clamp(o+(6 if 'C' in positions else -4),40,94)}
        head=None;source_id=None
    real2026.append({'pick':pick,'name':name,'school':school,'positions':positions,'historical_drafted_by':hist_team,'source_player_id':source_id,'age':age,'ratings':ratings,'potential_seed':pot,'headshot_url':head})

# Build historical season metadata with source boundaries explicit.
H={
 'version':'v0.54',
 'starts':[
   {'id':'current-2026-27','label':'2026–27 Current NBA','seasonYear':2026,'kind':'current','status':'certified','startLabel':'AUGUST 2026','description':'Current NBA Courtside universe and all existing v0.52 systems.'},
   {'id':'historical-2025-26-postseason','label':'2025–26 Postseason','seasonYear':2025,'kind':'historical','status':'foundation_playable','startLabel':'APRIL 2026 · REGULAR SEASON COMPLETE','description':'Replay the 2026 postseason, then take the real 2026 rookie class into an alternate draft and future.'}
 ],
 'historical_2025_26':{
   'startId':'historical-2025-26-postseason','seasonYear':2025,'date':'2026-04-13','phase':'regular_season','seasonStarted':True,'seasonComplete':True,
   'cbaRuleset':'CBA_2023','cap':{'season':'2025-26','salary_floor':139182000,'salary_cap':154647000,'luxury_tax':187895000,'first_apron':195945000,'second_apron':207824000},
   'assignments':assignments,'historicalPlayers':hist_only,'seasonStats':season_stats,'seedGames':seed_games,
   'sourceBoundary':{'rosters':'End-of-regular-season team assignment reconstructed from the project 2025-26 Basketball-Reference final player table; capped to an 18-player final-team pool per club. Historical-only players are stat translated.','contracts':'Historical contract continuity is modeled in this foundation build; exact 2025-26 contract/rights certification is a separate data-pack task.','results':'Actual 2025-26 team scores reconstructed by summing retained player-game points for each club/date; used to preserve records and point-differential tiebreak context.','start_point':'Regular season complete, immediately before the 2026 postseason. No future real transaction is scripted after divergence.'}
 },
 'realDraftClasses':{'2026':{'year':2026,'source':'NBA.com 2026 NBA Draft Results / Draft Board','identityStatus':'official_60_pick_class','careerMode':'authentic_uncertainty','prospects':real2026},'2027':{'year':2027,'source':'Existing NBA Courtside v0.35/v0.49 source-backed watch class','identityStatus':'source_backed_first_round_watch','careerMode':'authentic_uncertainty'}},
 'officialHistoricalDraftThrough':2026,
 'sourceBackedFutureWatchThrough':2027,
 'realDraftThrough':2026,
 'futureGeneratedFrom':2028
}
out=root/'data/historical-universes-v0.54.js'
out.write_text('window.NBA_COURTSIDE_HISTORICAL_V54 = '+json.dumps(H,separators=(',',':'),ensure_ascii=False)+';\n')
print('wrote',out,'size',out.stat().st_size)
print('assignments',len(assignments),'historical-only',len(hist_only),'seed games',len(seed_games),'real2026',len(real2026))
# verify team records
from collections import defaultdict
rec=defaultdict(lambda:[0,0])
for g in seed_games:
    r=g['result'];w=g['home'] if r['home_score']>r['away_score'] else g['away'];l=g['away'] if w==g['home'] else g['home'];rec[w][0]+=1;rec[l][1]+=1
print('games',len(seed_games),'teams82',sum(1 for x in rec.values() if sum(x)==82),'range',min(w for w,l in rec.values()),max(w for w,l in rec.values()))
