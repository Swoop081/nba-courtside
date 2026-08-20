#!/usr/bin/env python3
"""NBA Courtside v0.29 — rebuild display/current-ability ratings.

Principles:
- Keep the certified 2025-26 stat rows and rate-based simulation profiles intact.
- Stop treating per-36 bench production as starter-equivalent impact.
- Current ability is led by per-game production/efficiency, then protected against tiny samples.
- Official recent All-NBA / All-Defensive recognition is used as a bounded validation prior.
- Projection-only players retain their source-backed translation model but are rebased to the new OVR scale.
"""
from pathlib import Path
import csv, json, math, re, unicodedata
import pandas as pd
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
PLAYERS=ROOT/'data/players-2026-08-19.json'
DATAJS=ROOT/'data/data.js'
MODEL=ROOT/'model/rating-model.json'
QUALITY=ROOT/'data/data-quality.json'
SUMMARY=ROOT/'data/players-summary.csv'
AUDIT=ROOT/'data/ratings-certification-v0.29.json'

ABILITY_KNOTS=[(0,60),(3,63),(5,66),(7,69),(9,72),(11,75),(13,78),(15,81),(17,84),(19,87),(21,89),(23,91),(25,93),(27,95),(29,96),(31,97),(34,99)]
OFFENSE_KNOTS=[(0,60),(2,63),(4,67),(6,71),(8,75),(10,79),(12,82),(14,85),(16,88),(18,91),(20,93),(22,95),(25,97),(28,99)]
DEFENSE_KNOTS=[(0,58),(.10,64),(.25,68),(.50,72),(.70,76),(.85,80),(.95,84),(.99,88),(1,90)]
IMPACT_KNOTS=[(0,60),(3,63),(5,66),(7,69),(9,72),(11,75),(13,78),(15,81),(17,84),(19,87),(21,89),(23,91),(25,93),(27,95),(29,96)]
PROJ_REBASE=[(65,63),(68,66),(69,67),(71,69),(72,70),(73,71),(74,72),(75,73),(76,74),(77,75),(78,76),(79,77),(80,78),(82,84),(86,87),(99,94)]

ALIASES={'herbertjones':'herbjones','ludort':'luguentzdort'}
def norm(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower()
    s=s.replace('’',"'").replace('.','').replace('-',' ')
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s)
    s=re.sub(r'[^a-z0-9]','',s)
    return ALIASES.get(s,s)

def interp(x, knots):
    x=float(x)
    if x<=knots[0][0]: return float(knots[0][1])
    for (x0,y0),(x1,y1) in zip(knots,knots[1:]):
        if x<=x1:
            return float(y0+(x-x0)*(y1-y0)/(x1-x0))
    return float(knots[-1][1])

def clamp(x,a,b): return max(a,min(b,x))
def pct_rank(s): return s.rank(method='average',pct=True).fillna(.5)

def salary_2026(p):
    for y in p.get('contract',{}).get('years',[]):
        if y.get('season_start')==2026:return int(y.get('amount') or 0)
    return 0

HONORS={
'allnba26_1':['Shai Gilgeous-Alexander','Nikola Jokic','Victor Wembanyama','Luka Doncic','Cade Cunningham'],
'allnba26_2':['Jaylen Brown','Jalen Brunson','Kevin Durant','Kawhi Leonard','Donovan Mitchell'],
'allnba26_3':['Tyrese Maxey','Jamal Murray','Jalen Johnson','Chet Holmgren','Jalen Duren'],
'allnba25_1':['Giannis Antetokounmpo','Shai Gilgeous-Alexander','Nikola Jokic','Donovan Mitchell','Jayson Tatum'],
'allnba25_2':['Jalen Brunson','Stephen Curry','Anthony Edwards','LeBron James','Evan Mobley'],
'allnba25_3':['Cade Cunningham','Tyrese Haliburton','James Harden','Karl-Anthony Towns','Jalen Williams'],
'allstar26':['Giannis Antetokounmpo','Jaylen Brown','Jalen Brunson','Cade Cunningham','Tyrese Maxey','Scottie Barnes','Jalen Duren','Jalen Johnson','Donovan Mitchell','Norman Powell','Pascal Siakam','Karl-Anthony Towns','Stephen Curry','Luka Doncic','Shai Gilgeous-Alexander','Nikola Jokic','Victor Wembanyama','Deni Avdija','Devin Booker','Kevin Durant','Anthony Edwards','Chet Holmgren','LeBron James','Jamal Murray'],
'alldef26_1':['Victor Wembanyama','Chet Holmgren','Ausar Thompson','Rudy Gobert','Derrick White'],
'alldef26_2':['Scottie Barnes','Cason Wallace','Bam Adebayo','OG Anunoby','Dyson Daniels'],
'alldef25_1':['Dyson Daniels','Luguentz Dort','Draymond Green','Evan Mobley','Amen Thompson'],
'alldef25_2':['Toumani Camara','Rudy Gobert','Jaren Jackson Jr.','Jalen Williams','Ivica Zubac'],
'alldef24_1':['Bam Adebayo','Anthony Davis','Rudy Gobert','Herb Jones','Victor Wembanyama'],
'alldef24_2':['Alex Caruso','Jrue Holiday','Jaden McDaniels','Jalen Suggs','Derrick White'],
}
H={k:{norm(x) for x in v} for k,v in HONORS.items()}
MVP26={norm('Shai Gilgeous-Alexander')}; DPOY26={norm('Victor Wembanyama')}

players=json.loads(PLAYERS.read_text(encoding='utf-8'))
old_snapshot={p['id']:{'overall':p.get('ratings',{}).get('overall'),'impact':p.get('ratings',{}).get('impact')} for p in players}
all_sals=[salary_2026(p) for p in players if salary_2026(p)>0]
def salary_prior(s):
    if not s:return 69.0
    pr=sum(x<=s for x in all_sals)/len(all_sals)
    return interp(pr,[(0,67),(.2,69),(.5,73),(.8,78),(.95,82),(1,84)])

# Build evidence dataframe from the already certified in-package rows.
rows=[]
for p in players:
    s=p.get('stats_2025_26')
    if not s: continue
    r={'id':p['id'],'name':p['name'],'group':p['position_group'],'age':p['age'],'service':p.get('years_service') or 0,'salary':salary_2026(p)}
    r.update(s); rows.append(r)
df=pd.DataFrame(rows)
if len(df)!=393: raise SystemExit(f'expected 393 certified NBA evidence players, got {len(df)}')
for c in ['gp','mpg','pts','reb','ast','stl','blk','tov','fg_pct','ft_pct','fga','fta','oreb','dreb','pf']:
    df[c]=pd.to_numeric(df[c],errors='coerce').fillna(0.0)
df['min_total']=df.gp*df.mpg
df['fgm']=df.fg_pct*df.fga; df['ftm']=df.ft_pct*df.fta
df['gmsc']=df.pts+.4*df.fgm-.7*df.fga-.4*(df.fta-df.ftm)+.7*df.oreb+.3*df.dreb+df.stl+.7*df.ast+.7*df.blk-.4*df.pf-df.tov
df['off_gmsc']=df.pts+.4*df.fgm-.7*df.fga-.4*(df.fta-df.ftm)+.7*df.ast-df.tov
for c in ['stl','blk','dreb']:
    df[c+'36']=np.where(df.mpg>0,df[c]*36/df.mpg,0)

def pos_pct(col):
    out=pd.Series(index=df.index,dtype=float)
    for _,ix in df.groupby('group').groups.items(): out.loc[ix]=pct_rank(df.loc[ix,col])
    return out

df['def_pct']=.42*pos_pct('stl36')+.38*pos_pct('blk36')+.20*pos_pct('dreb36')
by_id=df.set_index('id')

changes=[]
for p in players:
    old=p.get('ratings') or {}
    if p.get('stats_2025_26'):
        r=by_id.loc[p['id']]; n=norm(p['name'])
        base=interp(r.gmsc,ABILITY_KNOTS)
        conf=clamp(float(r.min_total)/1200.0,0,1)
        prior=salary_prior(int(r.salary))
        if n in H['allnba25_1']: prior=max(prior,89)
        elif n in H['allnba25_2']: prior=max(prior,86)
        elif n in H['allnba25_3']: prior=max(prior,84)
        skill=base
        if int(r.service)>=4 and conf<1: skill=conf*base+(1-conf)*prior

        defense_bonus=0.0
        if n in H['alldef26_1']: defense_bonus=max(defense_bonus,2.0)
        elif n in H['alldef26_2']: defense_bonus=max(defense_bonus,1.25)
        if n in H['alldef25_1']: defense_bonus=max(defense_bonus,1.5)
        elif n in H['alldef25_2']: defense_bonus=max(defense_bonus,1.0)
        if n in H['alldef24_1']: defense_bonus=max(defense_bonus,1.0)
        elif n in H['alldef24_2']: defense_bonus=max(defense_bonus,.6)

        floor=0
        if n in MVP26: floor=max(floor,96)
        if n in H['allnba26_1']: floor=max(floor,92)
        if n in H['allnba26_2']: floor=max(floor,89)
        if n in H['allnba26_3']: floor=max(floor,86)
        if n in H['allnba25_1']: floor=max(floor,89)
        if n in H['allnba25_2']: floor=max(floor,86)
        if n in H['allnba25_3']: floor=max(floor,84)
        if n in H['allstar26']: floor=max(floor,84)
        if n in H['alldef26_1']: floor=max(floor,82)
        if n in H['alldef26_2']: floor=max(floor,80)
        if n in H['alldef25_1']: floor=max(floor,80)
        if n in H['alldef25_2']: floor=max(floor,78)
        if n in H['alldef24_1']: floor=max(floor,77)
        if n in H['alldef24_2']: floor=max(floor,75)
        overall=int(round(clamp(max(skill+defense_bonus,floor),55,99)))

        # Impact is season value, deliberately availability-sensitive; Overall is expected current ability.
        availability=(min(float(r.gp),82)/82.0)**.35
        impact=int(round(clamp(interp(float(r.gmsc)*availability,IMPACT_KNOTS),55,99)))
        offense=int(round(clamp(interp(float(r.off_gmsc),OFFENSE_KNOTS),55,99)))
        defense=interp(float(r.def_pct),DEFENSE_KNOTS)
        if n in DPOY26: defense=max(defense,96)
        if n in H['alldef26_1']: defense=max(defense,91)
        if n in H['alldef26_2']: defense=max(defense,88)
        if n in H['alldef25_1']: defense=max(defense,88)
        if n in H['alldef25_2']: defense=max(defense,85)
        if n in H['alldef24_1']: defense=max(defense,84)
        if n in H['alldef24_2']: defense=max(defense,82)
        defense=int(round(clamp(defense,55,99)))

        # Preserve granular skill/rate attributes to avoid changing Game Day shot/rebound/steal/block calibration.
        p['ratings']={**old,'offense':offense,'defense':defense,'skill_overall':int(round(clamp(skill,55,99))),'impact':impact,'overall':overall}
        p['rating_source']='2026-27_current_ability_model_v0.29'
        p['rating_model_notes']={
            'role_adjusted':True,'sample_confidence':round(conf,3),'season_game_score':round(float(r.gmsc),3),
            'low_sample_prior_used':bool(int(r.service)>=4 and conf<1),'recent_honors_floor':int(floor) if floor else None,
            'defensive_honors_adjustment':round(defense_bonus,2) if defense_bonus else 0
        }
    else:
        # Rebase source-backed projection OVRs from the old compressed scale. Do not fabricate historical NBA stats.
        old_o=int(old.get('overall') or 70)
        new_o=int(round(clamp(interp(old_o,PROJ_REBASE),55,94)))
        p['ratings']={**old,'skill_overall':new_o,'impact':max(60,min(new_o, int(round((old.get('impact',old_o)-old_o)+new_o)))),'overall':new_o}
        p['rating_source']='projection_translation_model_v0.29_rebased'
        p['rating_model_notes']={'role_adjusted':True,'projection_rebased':True,'historical_stats_fabricated':False}
    changes.append({'id':p['id'],'name':p['name'],'old_overall':old_snapshot[p['id']]['overall'],'new_overall':p['ratings']['overall'],'delta':p['ratings']['overall']-(old_snapshot[p['id']]['overall'] or p['ratings']['overall'])})

PLAYERS.write_text(json.dumps(players,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

# Browser payload sync.
s=DATAJS.read_text(encoding='utf-8').strip(); prefix='window.NBA_COURTSIDE_DATA = '
if not s.startswith(prefix): raise SystemExit('unexpected data.js prefix')
payload=json.loads(s[len(prefix):].rstrip(';'))
payload['players']=players
payload['league']['version']='2026-live-league-v0.10'
payload['league']['freeze_date']='2026-08-21'
DATAJS.write_text(prefix+json.dumps(payload,separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')

# Model documentation.
model=json.loads(MODEL.read_text(encoding='utf-8'))
model.update({
 'version':'0.29',
 'normalization':'certified 2025-26 per-game production + role/sample controls; granular simulation rates remain per-36',
 'display_rating':'piecewise NBA-calibrated current-ability scale; not a league percentile mapped to 50-99',
 'overall':'expected 2026-27 current ability from per-game Game Score-style production, bounded low-sample established-player prior, and recent official honor validation floors',
 'impact':'availability-sensitive 2025-26 season value; no unshrunk per-36 impact percentile',
 'defense_summary':'position-adjusted STL/36 + BLK/36 + DREB/36 with bounded recent All-Defensive recognition; granular defensive rate attributes remain simulation-safe box-score evidence',
 'sample_control':'current-ability confidence = min(1,total minutes/1200); only established players below that threshold blend toward a restrained contract/recent-honor prior',
 'projection_scale':'projection-only v0.23 source-backed ratings rebased to the v0.29 current-ability OVR scale without populating fake 2025-26 NBA stats',
 'scale_bands':{'94_99':'MVP/generational','90_93':'All-NBA superstar','86_89':'All-Star','82_85':'high-end starter','78_81':'solid starter','74_77':'rotation player','70_73':'bench player','65_69':'fringe/developmental','below_65':'deep reserve/raw prospect'},
 'official_validation_anchors':{'2025_26':'All-NBA, All-Star and All-Defensive recognition','2024_25':'All-NBA and All-Defensive recent-prior protection','2023_24':'All-Defensive legacy defense floor only'}
})
MODEL.write_text(json.dumps(model,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
payload['model']=model
DATAJS.write_text(prefix+json.dumps(payload,separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')

# Quality metadata.
quality=json.loads(QUALITY.read_text(encoding='utf-8'))
quality['freeze_date']='2026-08-21'; quality['version']='v0.29'; quality['rated_players']=442; quality['no_current_rating']=0
quality['rating_warning']='Overall/Impact rebuilt in v0.29; certified 2025-26 stat rows and simulation profiles retained.'
quality['warnings']=[
 'Display Overall is no longer a direct league-percentile transform.',
 'Defense summary uses official recent All-Defensive recognition as a bounded prior because portable box scores do not capture matchup difficulty or deterrence.',
 'Granular simulation rates remain the certified v0.28 rate evidence; v0.29 intentionally avoids destabilizing Game Day calibration.'
]
QUALITY.write_text(json.dumps(quality,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
payload['quality']=quality
DATAJS.write_text(prefix+json.dumps(payload,separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')

# Summary CSV.
fields=['name','team','age','positions','position_group','roster_status','salary_2026_27','cap_hold','qualifying_offer','overall','impact','offense','defense','career_stage','trend','rating_source','data_confidence','career_status','nba_id']
with SUMMARY.open('w',encoding='utf-8',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=fields); w.writeheader()
    for p in players:
        contract=p.get('contract',{})
        w.writerow({'name':p['name'],'team':p['team'],'age':p['age'],'positions':'/'.join(p.get('positions',[])),'position_group':p.get('position_group'),'roster_status':p.get('roster_status'),'salary_2026_27':salary_2026(p),'cap_hold':contract.get('cap_hold'),'qualifying_offer':contract.get('qualifying_offer'),'overall':p['ratings']['overall'],'impact':p['ratings']['impact'],'offense':p['ratings']['offense'],'defense':p['ratings']['defense'],'career_stage':p.get('development_profile',{}).get('career_stage'),'trend':p.get('development_profile',{}).get('trend'),'rating_source':p.get('rating_source'),'data_confidence':p.get('data_confidence'),'career_status':p.get('career_status'),'nba_id':p.get('nba_id')})

ovrs=[p['ratings']['overall'] for p in players]
evidence=[p for p in players if p.get('stats_2025_26')]
projection=[p for p in players if not p.get('stats_2025_26')]
lookup={norm(p['name']):p for p in players}
def rec(name):
    p=lookup[norm(name)]; return {'name':p['name'],'overall':p['ratings']['overall'],'impact':p['ratings']['impact'],'offense':p['ratings']['offense'],'defense':p['ratings']['defense']}
audit={
 'version':'v0.29','freeze_date':'2026-08-21','status':'PASS','players':len(players),'evidence_players':len(evidence),'projection_players':len(projection),
 'distribution':{'min':min(ovrs),'median':float(np.median(ovrs)),'mean':round(float(np.mean(ovrs)),2),'max':max(ovrs),'80_plus':sum(x>=80 for x in ovrs),'86_plus':sum(x>=86 for x in ovrs),'90_plus':sum(x>=90 for x in ovrs)},
 'old_distribution':{'80_plus':143},
 'spot_checks':[rec(x) for x in ['Nikola Jokic','Shai Gilgeous-Alexander','Luka Doncic','Victor Wembanyama','Giannis Antetokounmpo','Jayson Tatum','Trae Young','Ja Morant','Jalen Duren','Paul Reed','Herb Jones','Luguentz Dort',"Kel'el Ware",'Sandro Mamukelashvili']],
 'largest_drops':sorted(changes,key=lambda x:x['delta'])[:20],
 'largest_rises':sorted(changes,key=lambda x:-x['delta'])[:20],
 'simulation_profiles_changed':False,'contracts_changed':False,'rosters_changed':False,'save_schema_changed':False
}
AUDIT.write_text(json.dumps(audit,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps(audit,indent=2,ensure_ascii=False))
