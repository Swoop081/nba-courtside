#!/usr/bin/env python3
import csv, json, re, unicodedata, hashlib
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'data'/'historical-universes-v0.55.js'
OUT=ROOT/'data'/'historical-universes-v0.56.js'
DATA=ROOT/'data'/'data-v0.44.js'
MODERN=ROOT/'raw'/'modern_index.csv'

def norm(s):
    s=unicodedata.normalize('NFKD',str(s or '')).encode('ascii','ignore').decode().lower()
    s=s.replace('jr.','').replace('jr','').replace('iii','').replace('ii','').replace('sr.','').replace('sr','')
    return re.sub(r'[^a-z0-9]','',s)

def slug(s):
    s=unicodedata.normalize('NFKD',str(s or '')).encode('ascii','ignore').decode().lower()
    return re.sub(r'(^-|-$)','',re.sub(r'[^a-z0-9]+','-',s))

def load_js(path, var):
    t=path.read_text()
    m=re.search(rf'window\.{re.escape(var)}\s*=\s*(\{{.*\}});',t,re.S)
    if not m: raise RuntimeError(f'Could not parse {path}')
    return json.loads(m.group(1))

H=load_js(SRC,'NBA_COURTSIDE_HISTORICAL_V55')
D=load_js(DATA,'NBA_COURTSIDE_DATA')
base_by_name={norm(p['name']):p for p in D.get('players',[])}
modern={}
with MODERN.open(newline='',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        k=norm(r.get('player'))
        y=int(float(r.get('year') or 0)) if r.get('year') else 0
        if k and (k not in modern or y>modern[k][0]): modern[k]=(y,r)

# Destination after draft-night trade where NBA.com reports one; metadata only in alternate history.
CLASSES={
2020:[
('Anthony Edwards','MIN'),('James Wiseman','GSW'),('LaMelo Ball','CHA'),('Patrick Williams','CHI'),('Isaac Okoro','CLE'),('Onyeka Okongwu','ATL'),('Killian Hayes','DET'),('Obi Toppin','NYK'),('Deni Avdija','WAS'),('Jalen Smith','PHX'),('Devin Vassell','SAS'),('Tyrese Haliburton','SAC'),('Kira Lewis Jr.','NOP'),('Aaron Nesmith','BOS'),('Cole Anthony','ORL'),('Isaiah Stewart','DET'),('Aleksej Pokusevski','OKC'),('Josh Green','DAL'),('Saddiq Bey','DET'),('Precious Achiuwa','MIA'),('Tyrese Maxey','PHI'),('Zeke Nnaji','DEN'),('Leandro Bolmaro','MIN'),('RJ Hampton','DEN'),('Immanuel Quickley','NYK'),('Payton Pritchard','BOS'),('Udoka Azubuike','UTA'),('Jaden McDaniels','MIN'),('Malachi Flynn','TOR'),('Desmond Bane','MEM'),('Tyrell Terry','DAL'),('Vernon Carey Jr.','CHA'),('Daniel Oturu','LAC'),('Theo Maledon','OKC'),('Xavier Tillman Sr.','MEM'),('Tyler Bey','DAL'),('Vit Krejci','OKC'),('Saben Lee','DET'),('Elijah Hughes','UTA'),('Robert Woodard II','SAC'),('Tre Jones','SAS'),('Nick Richards','CHA'),("Jahmi'us Ramsey",'SAC'),('Marko Simonovic','CHI'),('Jordan Nwora','MIL'),('CJ Elleby','POR'),('Yam Madar','BOS'),('Nico Mannion','GSW'),('Isaiah Joe','PHI'),('Skylar Mays','ATL'),('Justinian Jessup','GSW'),('Kenyon Martin Jr.','HOU'),('Cassius Winston','WAS'),('Cassius Stanley','IND'),('Jay Scrubb','LAC'),('Grant Riller','CHA'),('Reggie Perry','BKN'),('Paul Reed','PHI'),('Jalen Harris','TOR'),('Sam Merrill','MIL')],
2021:[
('Cade Cunningham','DET'),('Jalen Green','HOU'),('Evan Mobley','CLE'),('Scottie Barnes','TOR'),('Jalen Suggs','ORL'),('Josh Giddey','OKC'),('Jonathan Kuminga','GSW'),('Franz Wagner','ORL'),('Davion Mitchell','SAC'),('Ziaire Williams','MEM'),('James Bouknight','CHA'),('Joshua Primo','SAS'),('Chris Duarte','IND'),('Moses Moody','GSW'),('Corey Kispert','WAS'),('Alperen Sengun','HOU'),('Trey Murphy III','NOP'),('Tre Mann','OKC'),('Kai Jones','CHA'),('Jalen Johnson','ATL'),('Keon Johnson','LAC'),('Isaiah Jackson','IND'),('Usman Garuba','HOU'),('Josh Christopher','HOU'),('Quentin Grimes','NYK'),("Nah'Shon Hyland",'DEN'),('Cameron Thomas','BKN'),('Jaden Springer','PHI'),("Day'Ron Sharpe",'BKN'),('Santi Aldama','MEM'),('Isaiah Todd','WAS'),('Jeremiah Robinson-Earl','OKC'),('Jason Preston','LAC'),('Rokas Jokubaitis','NYK'),('Herbert Jones','NOP'),('Miles McBride','NYK'),('JT Thor','CHA'),('Ayo Dosunmu','CHI'),('Neemias Queta','SAC'),('Jared Butler','UTA'),('Joe Wieskamp','SAS'),('Isaiah Livers','DET'),('Greg Brown III','POR'),('Kessler Edwards','BKN'),('Juhann Begarin','BOS'),('Dalano Banton','TOR'),('David Johnson','TOR'),('Sharife Cooper','ATL'),('Marcus Zegarowski','BKN'),('Filip Petrusev','PHI'),('BJ Boston','LAC'),('Luka Garza','DET'),('Charles Bassey','PHI'),('Sandro Mamukelashvili','MIL'),('Aaron Wiggins','OKC'),('Scottie Lewis','CHA'),('Balsa Koprivica','DET'),('Jericho Sims','NYK'),('RaiQuan Gray','BKN'),('Georgios Kalaitzakis','MIL')],
2022:[
('Paolo Banchero','ORL'),('Chet Holmgren','OKC'),('Jabari Smith Jr.','HOU'),('Keegan Murray','SAC'),('Jaden Ivey','DET'),('Bennedict Mathurin','IND'),('Shaedon Sharpe','POR'),('Dyson Daniels','NOP'),('Jeremy Sochan','SAS'),('Johnny Davis','WAS'),('Ousmane Dieng','OKC'),('Jalen Williams','OKC'),('Jalen Duren','DET'),('Ochai Agbaji','CLE'),('Mark Williams','CHA'),('AJ Griffin','ATL'),('Tari Eason','HOU'),('Dalen Terry','CHI'),('Jake LaRavia','MEM'),('Malaki Branham','SAS'),('Christian Braun','DEN'),('Walker Kessler','MIN'),('David Roddy','MEM'),('MarJon Beauchamp','MIL'),('Blake Wesley','SAS'),('Wendell Moore Jr.','MIN'),('Nikola Jovic','MIA'),('Patrick Baldwin Jr.','GSW'),('TyTy Washington Jr.','HOU'),('Peyton Watson','DEN'),('Andrew Nembhard','IND'),('Caleb Houstan','ORL'),('Christian Koloko','TOR'),('Jaylin Williams','OKC'),('Max Christie','LAL'),('Gabriele Procida','DET'),('Jaden Hardy','DAL'),('Kennedy Chandler','MEM'),('Khalifa Diop','CLE'),('Bryce McGowens','CHA'),('EJ Liddell','NOP'),('Trevor Keels','NYK'),('Moussa Diabate','LAC'),('Ryan Rollins','GSW'),('Josh Minott','MIN'),('Ismael Kamagate','POR'),('Vince Williams Jr.','MEM'),('Kendall Brown','IND'),('Isaiah Mobley','CLE'),('Matteo Spagnolo','MIN'),('Tyrese Martin','ATL'),('Karlo Matkovic','NOP'),('JD Davison','BOS'),('Yannick Nzosa','WAS'),('Gui Santos','GSW'),('Luke Travers','CLE'),('Jabari Walker','POR'),('Hugo Besson','MIL'),('Keon Ellis',None),('AJ Green',None)],
2023:[
('Victor Wembanyama','SAS'),('Brandon Miller','CHA'),('Scoot Henderson','POR'),('Amen Thompson','HOU'),('Ausar Thompson','DET'),('Anthony Black','ORL'),('Bilal Coulibaly','WAS'),('Jarace Walker','IND'),('Taylor Hendricks','UTA'),('Cason Wallace','OKC'),('Jett Howard','ORL'),('Dereck Lively II','DAL'),('Gradey Dick','TOR'),('Jordan Hawkins','NOP'),('Kobe Bufkin','ATL'),('Keyonte George','UTA'),("Jalen Hood-Schifino",'LAL'),('Jaime Jaquez Jr.','MIA'),('Brandin Podziemski','GSW'),('Cam Whitmore','HOU'),('Noah Clowney','BKN'),('Dariq Whitehead','BKN'),('Kris Murray','POR'),('Olivier-Maxence Prosper','DAL'),('Marcus Sasser','DET'),('Ben Sheppard','IND'),('Nick Smith Jr.','CHA'),('Brice Sensabaugh','UTA'),('Julian Strawther','DEN'),('Kobe Brown','LAC'),('James Nnaji','CHA'),('Jalen Pickett','DEN'),('Leonard Miller','MIN'),('Colby Jones','SAC'),('Julian Phillips','CHI'),('Andre Jackson Jr.','MIL'),('Hunter Tyson','DEN'),('Jordan Walsh','BOS'),('Mouhamed Gueye','ATL'),('Maxwell Lewis','LAL'),('Amari Bailey','CHA'),('Tristan Vukcevic','WAS'),('Rayan Rupert','POR'),('Sidy Cissoko','SAS'),('GG Jackson II','MEM'),('Seth Lundy','ATL'),('Mojave King','IND'),('Jordan Miller','LAC'),('Emoni Bates','CLE'),('Keyontae Johnson','OKC'),('Jalen Wilson','BKN'),('Toumani Camara','PHX'),('Jaylen Clark','MIN'),('Jalen Slawson','SAC'),('Isaiah Wong','IND'),('Tarik Biberovic','MEM'),('Trayce Jackson-Davis','GSW'),('Chris Livingston','MIL'),('Craig Porter Jr.',None),('Colin Castleton',None)],
2024:[
('Zaccharie Risacher','ATL'),('Alex Sarr','WAS'),('Reed Sheppard','HOU'),('Stephon Castle','SAS'),('Ron Holland II','DET'),('Tidjane Salaun','CHA'),('Donovan Clingan','POR'),('Rob Dillingham','MIN'),('Zach Edey','MEM'),('Cody Williams','UTA'),('Matas Buzelis','CHI'),('Nikola Topic','OKC'),('Devin Carter','SAC'),('Bub Carrington','WAS'),("Kel'el Ware",'MIA'),('Jared McCain','PHI'),('Dalton Knecht','LAL'),('Tristan da Silva','ORL'),("Ja'Kobe Walter",'TOR'),('Jaylon Tyson','CLE'),('Yves Missi','NOP'),('DaRon Holmes II','DEN'),('AJ Johnson','MIL'),('Kyshawn George','WAS'),('Pacome Dadiet','NYK'),('Dillon Jones','OKC'),('Terrence Shannon Jr.','MIN'),('Ryan Dunn','PHX'),('Isaiah Collier','UTA'),('Baylor Scheierman','BOS'),('Jonathan Mogbo','TOR'),('Kyle Filipowski','UTA'),('Tyler Smith','MIL'),('Tyler Kolek','NYK'),('Johnny Furphy','IND'),('Juan Nunez','SAS'),('Bobi Klintman','DET'),('Ajay Mitchell','OKC'),('Jaylen Wells','MEM'),('Oso Ighodaro','PHX'),('Adem Bona','PHI'),('KJ Simpson','CHA'),('Nikola Djurisic','ATL'),('Pelle Larsson','MIA'),('Jamal Shead','TOR'),('Cam Christie','LAC'),('Antonio Reeves','NOP'),('Harrison Ingram','SAS'),('Tristen Newton','IND'),('Enrique Freeman','IND'),('Melvin Ajinca','DAL'),('Quinten Post','GSW'),('Cam Spencer','MEM'),('Anton Watson','BOS'),('Bronny James','LAL'),('Kevin McCullar Jr.','NYK'),('Ulrich Chomche','TOR'),('Ariel Hukporti','NYK'),('Trey Alexander',None),("N'Faly Dante",None)],
2025:[
('Cooper Flagg','DAL'),('Dylan Harper','SAS'),('VJ Edgecombe','PHI'),('Kon Knueppel','CHA'),('Ace Bailey','UTA'),('Tre Johnson','WAS'),('Jeremiah Fears','NOP'),('Egor Demin','BKN'),('Collin Murray-Boyles','TOR'),('Khaman Maluach','PHX'),('Cedric Coward','MEM'),('Noa Essengue','CHI'),('Derik Queen','NOP'),('Carter Bryant','SAS'),('Thomas Sorber','OKC'),('Yang Hansen','POR'),('Joan Beringer','MIN'),('Walter Clayton Jr.','UTA'),('Nolan Traore','BKN'),('Kasparas Jakucionis','MIA'),('Will Riley','WAS'),('Drake Powell','BKN'),('Asa Newell','ATL'),('Nique Clifford','SAC'),('Jase Richardson','ORL'),('Ben Saraf','BKN'),('Danny Wolf','BKN'),('Hugo Gonzalez','BOS'),('Liam McNeeley','CHA'),('Yanic Konan Niederhauser','LAC'),('Rasheer Fleming','PHX'),('Noah Penda','ORL'),('Sion James','CHA'),('Ryan Kalkbrenner','CHA'),('Johni Broome','PHI'),('Adou Thiero','LAL'),('Chaz Lanier','DET'),('Kam Jones','IND'),('Alijah Martin','TOR'),('Micah Peavy','NOP'),('Koby Brea','PHX'),('Maxime Raynaud','SAC'),('Jamir Watkins','WAS'),('Brooks Barnhizer','OKC'),('Rocco Zikarsky','MIN'),('Amari Williams','BOS'),('Bogoljub Markovic','MIL'),('Javon Small','MEM'),('Tyrese Proctor','CLE'),('Kobe Sanders','LAC'),('Mohamed Diawara','NYK'),('Alex Toohey','GSW'),('John Tonje','UTA'),('Taelon Peter','IND'),('Lachlan Olbrich','CHI'),('Will Richard','GSW'),('Max Shulga','BOS'),('Saliou Niang','CLE'),('Jahmai Mashack','MEM'),('Dink Pate',None)]
}
OFFICIAL_COUNTS={2020:60,2021:60,2022:58,2023:58,2024:58,2025:59}
SOURCES={
2020:'https://www.nba.com/news/2020-nba-draft-results-picks-1-60',
2021:'https://www.nba.com/news/2021-nba-draft-results-picks-1-60',
2022:'https://www.nba.com/news/2022-nba-draft-order/',
2023:'https://www.nba.com/news/2023-nba-draft-order',
2024:'https://www.nba.com/news/2024-nba-draft-order',
2025:'https://www.nba.com/news/2025-nba-draft-order'
}

# Explicit aliases for identity matching only.
ALIASES={
 'gregoryjacksonii':'ggjackson', 'cameronthomas':'camthomas', 'treymurphyiii':'treymurphy',
 'robertwoodardii':'robertwoodard', 'gregbrowniii':'gregbrown', 'bjboston':'brandonboston',
 'jabari smith jr':'jabari smith', 'vernon carey jr':'vernon carey', 'xavier tillman sr':'xavier tillman',
}

def lookup(name):
    k=norm(name)
    p=base_by_name.get(k)
    if p: return p, modern.get(k,(None,None))[1]
    for a,b in ALIASES.items():
        if k==norm(a):
            kk=norm(b); return base_by_name.get(kk), modern.get(kk,(None,None))[1]
    return None, modern.get(k,(None,None))[1]

def pos_for(name):
    p,m=lookup(name)
    if p and p.get('positions'): return list(p['positions'])[:2]
    pos=(m or {}).get('Pos') if m else None
    if not pos: return ['SG','SF']
    # Basketball-reference style positions; normalize to game positions.
    vals=[]
    for q in re.split(r'[-/]',pos):
        q=q.strip().upper()
        q={'G':'SG','F':'SF'}.get(q,q)
        if q in ['PG','SG','SF','PF','C'] and q not in vals: vals.append(q)
    return vals[:2] or ['SG','SF']

def age_for(name,year,slot):
    p,_=lookup(name)
    if p and isinstance(p.get('age'),(int,float)):
        # Current dataset age is 2026-27 season age; draft age approximation is identity data, not talent hindsight.
        return max(18,min(24,int(round(p['age']-(2026-year)))))
    # deterministic typical draft age, mostly 20/21
    h=int(hashlib.sha1(f'{year}:{name}:age'.encode()).hexdigest()[:8],16)
    return 19 + (1 if h%100<48 else 2 if h%100<78 else 3 if h%100<94 else 4)

def rating_seed(name,slot,positions):
    # Pick/order is used as pre-NBA evidence; later NBA career performance is deliberately ignored.
    if slot<=3: base=76
    elif slot<=5: base=74
    elif slot<=10: base=72
    elif slot<=14: base=71
    elif slot<=20: base=70
    elif slot<=30: base=69
    elif slot<=45: base=67
    else: base=65
    h=int(hashlib.sha1(f'{name}:v056'.encode()).hexdigest()[:8],16)
    wiggle=[-1,0,0,0,1][h%5]
    o=max(63,min(79,base+wiggle))
    pot_bonus=13 if slot<=5 else 11 if slot<=14 else 9 if slot<=30 else 8 if slot<=45 else 7
    pot=max(o+4,min(92,o+pot_bonus+([-1,0,0,1][(h//7)%4])))
    r={'overall':o,'skill_overall':o,'impact':o,'offense':o,'defense':o,
       'finishing':o,'three_pt':o,'free_throw':min(99,o+1),'shot_creation':o,
       'playmaking':max(55,o-2),'ball_security':o,'offensive_rebounding':max(50,o-4),
       'defensive_rebounding':max(50,o-2),'stamina':min(92,o+5),
       'perimeter_defense':min(95,o+1),'interior_defense':max(50,o-4)}
    if 'PG' in positions:
        r['playmaking']=min(95,o+5); r['ball_security']=min(94,o+3); r['interior_defense']=max(48,o-8)
    if 'C' in positions:
        r['offensive_rebounding']=min(95,o+5); r['defensive_rebounding']=min(95,o+7); r['interior_defense']=min(95,o+6); r['playmaking']=max(48,o-7); r['perimeter_defense']=max(48,o-5)
    elif 'PF' in positions:
        r['offensive_rebounding']=min(92,o+2); r['defensive_rebounding']=min(94,o+4); r['interior_defense']=min(94,o+2)
    return r,pot

def prospect(year,slot,name,team):
    official_count=OFFICIAL_COUNTS[year]
    drafted=slot<=official_count
    positions=pos_for(name)
    p,m=lookup(name)
    ratings,pot=rating_seed(name,slot,positions)
    nba_id=(p or {}).get('nba_id') if p else None
    if not nba_id and m:
        try: nba_id=int(float(m.get('nba_id'))) if m.get('nba_id') else None
        except: nba_id=None
    return {
        'slot':slot,
        'pick':slot if drafted else None, # legacy-compatible; generator v0.56 uses slot separately.
        'official_pick':slot if drafted else None,
        'entry_type':'drafted' if drafted else 'undrafted',
        'name':name,
        'school':None,
        'positions':positions,
        'historical_drafted_by':team if drafted else None,
        'source_player_id':(p or {}).get('id') if p else None,
        'source_nba_id':nba_id,
        'age':age_for(name,year,slot),
        'ratings':ratings,
        'potential_seed':pot,
        'headshot_url':(p or {}).get('headshot_url') if p else (f'https://cdn.nba.com/headshots/nba/latest/1040x760/{nba_id}.png' if nba_id else None),
    }

# Normalize already-certified full classes to the same v0.56 metadata shape.
for _y in (2019,2026):
    _c=H['realDraftClasses'].get(str(_y),{})
    if _c.get('prospects'):
        _c['officialDraftedCount']=60
        _c['undraftedEntrantCount']=0
        _c['alternateTimelineSlots']=60
        for _i,_p in enumerate(_c['prospects'],1):
            _p.setdefault('slot',_i); _p.setdefault('official_pick',_p.get('pick',_i)); _p.setdefault('entry_type','drafted')

for year, rows in CLASSES.items():
    assert len(rows)==60,(year,len(rows))
    arr=[prospect(year,i+1,n,t) for i,(n,t) in enumerate(rows)]
    H['realDraftClasses'][str(year)]={
        'year':year,
        'source':SOURCES[year],
        'identityStatus':'official_draft_results_plus_real_undrafted_entry_fill' if OFFICIAL_COUNTS[year]<60 else 'official_draft_results',
        'careerMode':'authentic_uncertainty',
        'officialDraftedCount':OFFICIAL_COUNTS[year],
        'undraftedEntrantCount':60-OFFICIAL_COUNTS[year],
        'alternateTimelineSlots':60,
        'forfeitureRule':'Real-world forfeited second-round selections after the 2018 divergence point are not scripted into alternate history; open slots are populated by real undrafted entrants from the same entry year.' if OFFICIAL_COUNTS[year]<60 else None,
        'prospects':arr
    }

H['version']='v0.56'
H['officialHistoricalDraftYears']=list(range(2019,2027))
H['realDraftYears']=list(range(2019,2027))
H['officialHistoricalDraftThrough']=2026
H['realDraftThrough']=2026
H['futureGeneratedFrom']=2028
H['pipelineBoundary']='Continuous real-entry rookie pipeline is loaded for every draft from 2019 through 2026. Official drafted identities/order/destinations remain historical metadata only. In 2022–2025, later real-world forfeited picks are not forced into a save that diverged in 2018; real undrafted entrants fill the alternate timeline to 60 selections. The existing source-backed 2027 watch class follows, and generated classes begin in 2028 until further source-backed packs are added.'
# Keep start copy honest.
for s in H.get('starts',[]):
    if s.get('id')=='historical-2018-19-opening-night':
        s['description']='Begin before Game 1 with the official opening-night rosters and schedule. Real incoming rookie pools are loaded for every draft from 2019 through 2026.'

OUT.write_text('window.NBA_COURTSIDE_HISTORICAL_V56 = '+json.dumps(H,separators=(',',':'),ensure_ascii=False)+';\nwindow.NBA_COURTSIDE_HISTORICAL_V55 = window.NBA_COURTSIDE_HISTORICAL_V56;\nwindow.NBA_COURTSIDE_HISTORICAL_V54 = window.NBA_COURTSIDE_HISTORICAL_V56;\n',encoding='utf-8')

cert={
 'version':'v0.56','feature':'Continuous Real Draft Pipeline 2019-2026','years':{},
 'historical_rule':'History diverges in 2018. Official real-world draft destination/order is metadata only; alternate lottery/trades/selections control actual destination.',
 'forfeiture_rule':'Real-world forfeitures occurring after the divergence point are not scripted. Missing official selections are filled with real undrafted entrants from the same year so the alternate NBA retains 60 draft slots.',
 'sources':SOURCES
}
for y in range(2019,2027):
    c=H['realDraftClasses'][str(y)]
    if 'prospects' not in c: continue
    cert['years'][str(y)]={'pool':len(c['prospects']),'official_drafted':c.get('officialDraftedCount',len(c['prospects'])),'real_undrafted_fill':c.get('undraftedEntrantCount',0),'first':c['prospects'][0]['name'],'last':c['prospects'][-1]['name']}
(ROOT/'data'/'real-draft-pipeline-certification-v0.56.json').write_text(json.dumps(cert,indent=2,ensure_ascii=False)+'\n')
print('WROTE',OUT)
for y in range(2019,2027):
    c=H['realDraftClasses'].get(str(y),{}); print(y,len(c.get('prospects',[])),c.get('officialDraftedCount'),c.get('undraftedEntrantCount'),c.get('prospects',[{}])[0].get('name'))
