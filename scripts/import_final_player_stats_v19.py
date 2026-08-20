#!/usr/bin/env python3
"""NBA Courtside v0.19 — import season-final 2025-26 player data and regenerate ratings.

Primary snapshot: Basketball-Reference Player Per Game 2025-26 table mirrored in raw/.
The import chooses each player's multi-team aggregate row (2TM/3TM/4TM) when present.
All rating percentiles are recomputed on the complete 2025-26 NBA population.
"""
from pathlib import Path
import json, re, unicodedata
import numpy as np
import pandas as pd

ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'raw/bref_player_per_game_2025_26_final.csv'
PLAYERS=ROOT/'data/players-2026-08-19.json'
DATAJS=ROOT/'data/data.js'
MODEL=ROOT/'model/rating-model.json'
QUALITY=ROOT/'data/data-quality.json'
OUT_AUDIT=ROOT/'data/player-stat-certification-v0.19.json'

FIELDS=['gp','gs','mpg','pts','reb','ast','stl','blk','tov','fg_pct','three_pct','ft_pct','fga','three_pa','fta','oreb','dreb','pf']
MULTI={'2TM','3TM','4TM','5TM','6TM'}
K3,K2,KFT=100,150,75

ALIASES={
    'alexandre sarr':'alex sarr',
    'cameron christie':'cam christie',
    'nicolas claxton':'nic claxton',
    'lu dort':'luguentz dort',
    'carlton carrington':'bub carrington',
    'egor dmin':'egor demin',   # source uses Cyrillic ё; ASCII decomposition drops it
    'hansen yang':'yang hansen',
}

def norm_name(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower()
    s=s.replace('’',"'").replace('.','').replace('-',' ')
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s)
    s=re.sub(r'[^a-z0-9 ]','',s)
    s=re.sub(r'\s+',' ',s).strip()
    return ALIASES.get(s,s)

def pct_rank(s): return s.rank(method='average',pct=True).fillna(.5)
def rating_from_score(x): return int(np.clip(round(50+49*float(x)),35,99))
def val(x, default=0.0): return default if pd.isna(x) else float(x)
def r1(x): return round(float(x),1)
def r2(x): return round(float(x),2)
def r3(x): return round(float(x),3)

df=pd.read_csv(RAW)
df=df[(df['season']==2026)&(df['lg']=='NBA')].copy()
if len(df)<700: raise SystemExit(f'expected full season table, got {len(df)} rows')

# One season-total row per player. Multi-team aggregate rows are authoritative when present.
canon=[]
for pid,g in df.groupby('player_id',sort=False):
    agg=g[g['team'].isin(MULTI)]
    canon.append((agg.iloc[0] if len(agg) else g.iloc[0]).copy())
S=pd.DataFrame(canon).copy()
S['norm']=S['player'].map(norm_name)
if S['norm'].duplicated().any():
    raise SystemExit('duplicate normalized player names in canonical final table: '+str(S[S['norm'].duplicated(False)]['player'].tolist()))
S=S.set_index('norm',drop=False)

# Normalize numeric inputs and derive per-36 / season-level rating features.
num=['g','gs','mp_per_game','fg_per_game','fga_per_game','x3p_per_game','x3pa_per_game','x2p_per_game','x2pa_per_game','ft_per_game','fta_per_game','orb_per_game','drb_per_game','trb_per_game','ast_per_game','stl_per_game','blk_per_game','tov_per_game','pf_per_game','pts_per_game']
for c in num:S[c]=pd.to_numeric(S[c],errors='coerce').fillna(0.0)

def weighted_rate(made,att):
    den=(S[att]*S['g']).sum(); return float((S[made]*S['g']).sum()/den) if den else 0.0
lg3=weighted_rate('x3p_per_game','x3pa_per_game')
lg2=weighted_rate('x2p_per_game','x2pa_per_game')
lgft=weighted_rate('ft_per_game','fta_per_game')
for src,key in [('fga_per_game','FGA'),('x3pa_per_game','3PA'),('x2pa_per_game','2PA'),('fta_per_game','FTA'),('orb_per_game','ORB'),('drb_per_game','DRB'),('trb_per_game','TRB'),('ast_per_game','AST'),('stl_per_game','STL'),('blk_per_game','BLK'),('tov_per_game','TOV'),('pf_per_game','PF'),('pts_per_game','PTS')]:
    S[key+'36']=np.where(S['mp_per_game']>0,S[src]*36/S['mp_per_game'],0)
S['adj3p']=((S['x3p_per_game']*S['g'])+K3*lg3)/((S['x3pa_per_game']*S['g'])+K3)
S['adj2p']=((S['x2p_per_game']*S['g'])+K2*lg2)/((S['x2pa_per_game']*S['g'])+K2)
S['adjft']=((S['ft_per_game']*S['g'])+KFT*lgft)/((S['fta_per_game']*S['g'])+KFT)
S['ast_to']=S['AST36']/(S['TOV36']+.65)
S['responsibility']=S['FGA36']+2*S['AST36']+.44*S['FTA36']
S['tov_resp']=S['TOV36']/(S['responsibility']+2.0)
S['low_pf36']=-S['PF36']
S['ts_proxy']=S['pts_per_game']/(2*(S['fga_per_game']+.44*S['fta_per_game'])).replace(0,np.nan)

rank_cols=['adj3p','adj2p','adjft','3PA36','2PA36','FTA36','FGA36','PTS36','AST36','ast_to','ORB36','DRB36','TRB36','STL36','BLK36','low_pf36','mp_per_game','g','ts_proxy']
P={c:pct_rank(S[c]) for c in rank_cols}
P['security']=pct_rank(-S['tov_resp'])
R=pd.DataFrame(index=S.index)
R['three_pt']=[rating_from_score(x) for x in .75*P['adj3p']+.25*P['3PA36']]
R['finishing']=[rating_from_score(x) for x in .65*P['adj2p']+.25*P['2PA36']+.10*P['FTA36']]
R['free_throw']=[rating_from_score(x) for x in P['adjft']]
R['shot_creation']=[rating_from_score(x) for x in .55*P['FGA36']+.25*P['FTA36']+.20*P['PTS36']]
R['playmaking']=[rating_from_score(x) for x in .70*P['AST36']+.30*P['ast_to']]
R['ball_security']=[rating_from_score(x) for x in P['security']]
R['offensive_rebounding']=[rating_from_score(x) for x in P['ORB36']]
R['defensive_rebounding']=[rating_from_score(x) for x in P['DRB36']]
R['stamina']=[rating_from_score(x) for x in .65*P['mp_per_game']+.35*P['g']]
# v0.2 impact blend recovered exactly from the calibrated population.
impact_score=.36*P['PTS36']+.19*P['AST36']+.13*P['TRB36']+.08*P['STL36']+.08*P['BLK36']+.16*P['ts_proxy']
R['impact']=[rating_from_score(x) for x in impact_score]

WGTS={
'guard':{'finishing':.15,'three_pt':.20,'free_throw':.04,'shot_creation':.15,'playmaking':.18,'ball_security':.10,'offensive_rebounding':.01,'defensive_rebounding':.03,'perimeter_defense':.08,'interior_defense':0,'stamina':.06},
'wing': {'finishing':.18,'three_pt':.17,'free_throw':.04,'shot_creation':.14,'playmaking':.12,'ball_security':.08,'offensive_rebounding':.03,'defensive_rebounding':.06,'perimeter_defense':.10,'interior_defense':.02,'stamina':.06},
'big':  {'finishing':.22,'three_pt':.08,'free_throw':.04,'shot_creation':.08,'playmaking':.08,'ball_security':.05,'offensive_rebounding':.10,'defensive_rebounding':.12,'perimeter_defense':.03,'interior_defense':.12,'stamina':.08}}

players=json.load(open(PLAYERS,encoding='utf-8'))
matched=[]; missing=[]; changed=[]
for p in players:
    # Preserve the intentionally projection-only universe; v0.19 only finalizes existing 2025-26 evidence players.
    if not p.get('stats_2025_26'):
        p['stat_source_status']='projection'
        p['stat_source']='No 2025-26 NBA baseline; projection model.'
        p['stat_verified_fields']=[];p['stat_bootstrap_fields']=[]
        continue
    n=norm_name(p['name'])
    if n not in S.index:
        missing.append(p['name']); continue
    s=S.loc[n]; old_stats=p['stats_2025_26']; old_ov=(p.get('ratings') or {}).get('overall')
    # exact season-final display fields from the source aggregate
    three_pa=val(s['x3pa_per_game']); fta=val(s['fta_per_game'])
    p['stats_2025_26']={
      'gp':int(round(s['g'])),'gs':int(round(s['gs'])),'mpg':r1(s['mp_per_game']),
      'pts':r1(s['pts_per_game']),'reb':r1(s['trb_per_game']),'ast':r1(s['ast_per_game']),
      'stl':r1(s['stl_per_game']),'blk':r1(s['blk_per_game']),'tov':r1(s['tov_per_game']),
      'fg_pct':r3(s['fg_percent']) if not pd.isna(s['fg_percent']) else None,
      'three_pct':r3(s['x3p_percent']) if three_pa>0 and not pd.isna(s['x3p_percent']) else None,
      'ft_pct':r3(s['ft_percent']) if fta>0 and not pd.isna(s['ft_percent']) else None,
      'fga':r1(s['fga_per_game']),'three_pa':r1(three_pa),'fta':r1(fta),
      'oreb':r1(s['orb_per_game']),'dreb':r1(s['drb_per_game']),'pf':r1(s['pf_per_game'])}
    total_minutes=float(s['g']*s['mp_per_game']); conf=min(1.0,total_minutes/1200.0)
    p['data_confidence']=round(conf,3)
    p['career_status']='nba_established' if conf>=.25 else 'low_sample_established'
    rt=R.loc[n]
    group=p['position_group']
    perim_proxy={'guard':.85,'wing':.70,'big':.40}[group]
    int_proxy={'guard':.20,'wing':.45,'big':.90}[group]
    perim=rating_from_score(.65*P['STL36'].loc[n]+.20*P['low_pf36'].loc[n]+.15*perim_proxy)
    interior=rating_from_score(.55*P['BLK36'].loc[n]+.25*P['DRB36'].loc[n]+.20*int_proxy)
    ratings={k:int(rt[k]) for k in ['finishing','three_pt','free_throw','shot_creation','playmaking','ball_security','offensive_rebounding','defensive_rebounding','stamina']}
    ratings['perimeter_defense']=perim;ratings['interior_defense']=interior
    if conf<1.0:
        for k in list(ratings):ratings[k]=int(round(75+conf*(ratings[k]-75)))
    ratings['offense']=int(round(.24*ratings['finishing']+.17*ratings['three_pt']+.05*ratings['free_throw']+.20*ratings['shot_creation']+.20*ratings['playmaking']+.14*ratings['ball_security']))
    ratings['defense']=int(round(.40*ratings['perimeter_defense']+.35*ratings['interior_defense']+.10*ratings['offensive_rebounding']+.15*ratings['defensive_rebounding']))
    skill=int(round(sum(ratings[k]*w for k,w in WGTS[group].items())))
    impact=int(rt['impact'])
    ratings['skill_overall']=skill;ratings['impact']=impact;ratings['overall']=int(round(.72*skill+.28*impact))
    p['ratings']=ratings
    p['tendencies']={
      'three_point_rate':r3(three_pa/(val(s['fga_per_game'])+1e-9)),
      'free_throw_rate':r3(fta/(val(s['fga_per_game'])+1e-9)),
      'shot_volume_per36':r2(s['FGA36']),'assist_per36':r2(s['AST36']),'turnover_per36':r2(s['TOV36'])}
    p['simulation_profile']={
      'pts_per36':r2(s['PTS36']),'fga_per36':r2(s['FGA36']),'three_pa_per36':r2(s['3PA36']),'fta_per36':r2(s['FTA36']),
      'reb_per36':r2(s['TRB36']),'ast_per36':r2(s['AST36']),'stl_per36':r2(s['STL36']),'blk_per36':r2(s['BLK36']),'tov_per36':r2(s['TOV36']),
      'true_shooting_proxy':r3(s['ts_proxy']) if not pd.isna(s['ts_proxy']) else None,
      'three_point_rate':r3(three_pa/(val(s['fga_per_game'])+1e-9)),'free_throw_rate':r3(fta/(val(s['fga_per_game'])+1e-9))}
    p['rating_source']='2025-26_final_box_score_model_v19'
    p['stat_source_status']='season_complete_verified'
    p['stat_source']='Basketball-Reference 2025-26 final regular-season per-game table (public dataset mirror), season-total row.'
    p['stat_verified_date']='2026-08-20'
    p['stat_verified_fields']=FIELDS.copy();p['stat_bootstrap_fields']=[]
    matched.append(p['name'])
    if old_stats!=p['stats_2025_26'] or old_ov!=ratings['overall']:
        changed.append({'player':p['name'],'old_gp':old_stats.get('gp'),'new_gp':p['stats_2025_26']['gp'],'old_overall':old_ov,'new_overall':ratings['overall']})

if missing: raise SystemExit('unmatched current evidence players: '+', '.join(missing))
if len(matched)!=392: raise SystemExit(f'expected 392 matched evidence players, got {len(matched)}')

# Persist players.
PLAYERS.write_text(json.dumps(players,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

model=json.load(open(MODEL,encoding='utf-8'))
model['version']='0.19'
model['bayesian_shrinkage'].update({'league_3p_pct':round(lg3,4),'league_2p_pct':round(lg2,4),'league_ft_pct':round(lgft,4)})
model['overall']='72% position-weighted skill overall + 28% season-relative impact summary'
model['impact']='36% PTS/36 + 19% AST/36 + 13% REB/36 + 8% STL/36 + 8% BLK/36 + 16% true-shooting proxy, all season-relative percentile scores'
model['population']='Complete 2025-26 NBA regular-season player population; multi-team players use season-total aggregate rows.'
MODEL.write_text(json.dumps(model,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

quality=json.load(open(QUALITY,encoding='utf-8'))
quality.update({'freeze_date':'2026-08-20','version':'v0.19','season_complete_verified':392,'bootstrap_hybrid':0,'established_with_2025_26_stats':392,'rated_players':392,'no_current_rating':50})
quality['source_population_rows']=len(S)
quality['source_stint_rows']=len(df)
quality['source']='Basketball-Reference 2025-26 final regular-season Player Per Game table via frozen public dataset mirror.'
quality['warnings']=[
  'Historical-portable box-score ratings intentionally do not claim to capture every component of defense.',
  'Rookies/newcomers without 2025-26 NBA evidence remain projection-pending until the pre-NBA translation layer is populated.'
]
QUALITY.write_text(json.dumps(quality,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

# Update browser payload without rebuilding contracts/source-safety data from older raw snapshots.
s=DATAJS.read_text(encoding='utf-8').strip(); prefix='window.NBA_COURTSIDE_DATA = '
if not s.startswith(prefix):raise SystemExit('unexpected data.js prefix')
payload=json.loads(s[len(prefix):].rstrip(';'))
payload['players']=players;payload['quality']=quality;payload['model']=model
payload['league']['freeze_date']='2026-08-20'
payload['league']['version']='2026-live-league-v0.5'
DATAJS.write_text(prefix+json.dumps(payload,separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')

audit={
 'version':'v0.19','freeze_date':'2026-08-20','source_rows':len(df),'canonical_player_rows':len(S),
 'current_evidence_players':len(matched),'projection_no_2025_26_evidence':sum(1 for p in players if not p.get('stats_2025_26')),
 'bootstrap_hybrid_remaining':sum(1 for p in players if p.get('stat_source_status')=='bootstrap_hybrid'),
 'league_priors':{'three_pct':round(lg3,4),'two_pct':round(lg2,4),'ft_pct':round(lgft,4)},
 'changed_player_records':len(changed),'notable_correction':next((x for x in changed if x['player']=='Kevin Huerter'),None),
 'top_overalls':sorted([{'player':p['name'],'overall':p['ratings']['overall'],'impact':p['ratings']['impact']} for p in players if p.get('ratings')],key=lambda x:(-x['overall'],x['player']))[:20],
 'status':'PASS'}
OUT_AUDIT.write_text(json.dumps(audit,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps(audit,indent=2,ensure_ascii=False))
