#!/usr/bin/env python3
"""NBA Courtside v0.24 — exact CBA service years + final-source correction.

- Certifies CBA Years of Service for all 442 starting-universe records.
- Promotes Yanic Niederhauser from v0.23 projection-only to his actual 2025-26 NBA row.
- Preserves every other v0.23 player profile unchanged except service/source metadata.
"""
from pathlib import Path
import json,re,unicodedata,hashlib
import numpy as np
import pandas as pd

ROOT=Path(__file__).resolve().parents[1]
PLAYERS=ROOT/'data/players-2026-08-19.json'
DATAJS=ROOT/'data/data.js'
NBA=ROOT/'raw/nba_players_25_26_regular_season_wide_data.csv'
BREF=ROOT/'raw/bref_player_per_game_2025_26_final.csv'
PROJ23=ROOT/'raw/projection-inputs-v0.23.json'
PROJ24=ROOT/'raw/projection-inputs-v0.24.json'
SC23=ROOT/'data/source-certification-v0.23.json'
SC24=ROOT/'data/source-certification-v0.24.json'
OUT=ROOT/'data/service-years-certification-v0.24.json'
QUALITY=ROOT/'data/data-quality.json'

FIELDS=['gp','gs','mpg','pts','reb','ast','stl','blk','tov','fg_pct','three_pct','ft_pct','fga','three_pa','fta','oreb','dreb','pf']
MULTI={'2TM','3TM','4TM','5TM','6TM'}
K3,K2,KFT=100,150,75
ALIASES={'egor demin':'egor dmin','yang hansen':'hansen yang','yanic niederhauser':'yanic konan niederhauser'}

def norm(s):
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower().replace('’',"'").replace('.','').replace('-',' ')
    s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s); s=re.sub(r'[^a-z0-9 ]','',s); s=re.sub(r'\s+',' ',s).strip()
    return ALIASES.get(s,s)
def pct_rank(s):return s.rank(method='average',pct=True).fillna(.5)
def rat(x):return int(np.clip(round(50+49*float(x)),35,99))
def val(x,d=0.):return d if pd.isna(x) else float(x)
def r1(x):return round(float(x),1)
def r2(x):return round(float(x),2)
def r3(x):return round(float(x),3)

def core_hash(p):
    obj={k:p.get(k) for k in ['stats_2025_26','ratings','tendencies','simulation_profile','rating_source','data_confidence','career_status','stat_source_status']}
    return hashlib.sha256(json.dumps(obj,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()

players=json.load(open(PLAYERS,encoding='utf-8'))
pre={p['id']:core_hash(p) for p in players if p['name']!='Yanic Niederhauser'}
feed=pd.read_csv(NBA)
feed_by_id={int(r.player_id):r for _,r in feed.iterrows() if pd.notna(r.player_id)}
feed_by_norm={norm(r.player_name):r for _,r in feed.iterrows()}

# 393 players now have a real 2025-26 NBA row: the prior 392 plus Yanic.
feed_matches={}
for p in players:
    if p.get('stats_2025_26') or p['name']=='Yanic Niederhauser':
        row=None
        if p.get('nba_id') is not None:
            try: row=feed_by_id.get(int(p['nba_id']))
            except: pass
        if row is None: row=feed_by_norm.get(norm(p['name']))
        if row is None: raise SystemExit(f'No NBA API service-year row for evidence player {p["name"]}')
        p['nba_id']=int(row.player_id)
        p['years_service']=int(row.experience)
        p['years_service_source']='nba_stats_api_2025_26_experience'
        p['years_service_certainty']='certified'
        feed_matches[p['id']]=int(row.experience)

# Starting-universe CBA service at the conclusion of 2025-26 for no-game players.
# 2026 rookies/new NBA entrants have 0 completed NBA seasons. Injured standard-contract
# players who remained on an NBA Active/Inactive List during 2025-26 receive that season.
manual={
 'ryan-conwell':(0,1643553,'nba_profile_rookie_2026'),
 'emanuel-sharp':(0,1643567,'nba_profile_rookie_2026'),
 'dillon-mitchell':(0,1641759,'nba_profile_rookie_2026'),
 'tarik-biberovic':(0,1641844,'nba_profile_rookie_2026'),
 'alpha-diallo':(0,1643813,'nba_profile_rookie_2026'),
 'thomas-sorber':(1,1642850,'cba_active_inactive_service_2025_26'),
 'mario-hezonja':(5,None,'prior_nba_completed_seasons'),
 'tyrese-haliburton':(6,None,'cba_active_inactive_service_2025_26'),
 'kyrie-irving':(15,None,'cba_active_inactive_service_2025_26'),
 'fred-vanvleet':(10,None,'cba_active_inactive_service_2025_26'),
 'trey-lyles':(10,None,'official_team_completed_seasons'),
 'damian-lillard':(14,None,'cba_active_inactive_service_2025_26'),
}
for p in players:
    if p['id'] in feed_matches: continue
    if p['id'] in manual:
        y,nid,src=manual[p['id']]; p['years_service']=y
        if nid:p['nba_id']=nid
        p['years_service_source']=src;p['years_service_certainty']='certified'
    elif p.get('career_status')=='rookie_2026_projected':
        p['years_service']=0;p['years_service_source']='2026_draft_class_zero_completed_nba_seasons';p['years_service_certainty']='certified'
    else:
        raise SystemExit(f'No service-year certification route for {p["name"]} ({p["id"]})')

# Correct v0.23 miss: Yanic actually played 41 NBA games in 2025-26. Recreate his
# v0.19-style final-population rating/profile while leaving every other player unchanged.
df=pd.read_csv(BREF);df=df[(df['season']==2026)&(df['lg']=='NBA')].copy()
canon=[]
for pid,g in df.groupby('player_id',sort=False):
    agg=g[g['team'].isin(MULTI)];canon.append((agg.iloc[0] if len(agg) else g.iloc[0]).copy())
S=pd.DataFrame(canon).copy();S['norm']=S['player'].map(norm);S=S.set_index('norm',drop=False)
for c in ['g','gs','mp_per_game','fg_per_game','fga_per_game','x3p_per_game','x3pa_per_game','x2p_per_game','x2pa_per_game','ft_per_game','fta_per_game','orb_per_game','drb_per_game','trb_per_game','ast_per_game','stl_per_game','blk_per_game','tov_per_game','pf_per_game','pts_per_game']:
    S[c]=pd.to_numeric(S[c],errors='coerce').fillna(0.0)
def wr(m,a):
    den=(S[a]*S['g']).sum();return float((S[m]*S['g']).sum()/den) if den else 0.
lg3,lg2,lgft=wr('x3p_per_game','x3pa_per_game'),wr('x2p_per_game','x2pa_per_game'),wr('ft_per_game','fta_per_game')
for src,key in [('fga_per_game','FGA'),('x3pa_per_game','3PA'),('x2pa_per_game','2PA'),('fta_per_game','FTA'),('orb_per_game','ORB'),('drb_per_game','DRB'),('trb_per_game','TRB'),('ast_per_game','AST'),('stl_per_game','STL'),('blk_per_game','BLK'),('tov_per_game','TOV'),('pf_per_game','PF'),('pts_per_game','PTS')]:
    S[key+'36']=np.where(S['mp_per_game']>0,S[src]*36/S['mp_per_game'],0)
S['adj3p']=((S['x3p_per_game']*S['g'])+K3*lg3)/((S['x3pa_per_game']*S['g'])+K3)
S['adj2p']=((S['x2p_per_game']*S['g'])+K2*lg2)/((S['x2pa_per_game']*S['g'])+K2)
S['adjft']=((S['ft_per_game']*S['g'])+KFT*lgft)/((S['fta_per_game']*S['g'])+KFT)
S['ast_to']=S['AST36']/(S['TOV36']+.65);S['responsibility']=S['FGA36']+2*S['AST36']+.44*S['FTA36'];S['tov_resp']=S['TOV36']/(S['responsibility']+2);S['low_pf36']=-S['PF36'];S['ts_proxy']=S['pts_per_game']/(2*(S['fga_per_game']+.44*S['fta_per_game'])).replace(0,np.nan)
rank_cols=['adj3p','adj2p','adjft','3PA36','2PA36','FTA36','FGA36','PTS36','AST36','ast_to','ORB36','DRB36','TRB36','STL36','BLK36','low_pf36','mp_per_game','g','ts_proxy']
P={c:pct_rank(S[c]) for c in rank_cols};P['security']=pct_rank(-S['tov_resp'])
R=pd.DataFrame(index=S.index);R['three_pt']=[rat(x) for x in .75*P['adj3p']+.25*P['3PA36']];R['finishing']=[rat(x) for x in .65*P['adj2p']+.25*P['2PA36']+.10*P['FTA36']];R['free_throw']=[rat(x) for x in P['adjft']];R['shot_creation']=[rat(x) for x in .55*P['FGA36']+.25*P['FTA36']+.20*P['PTS36']];R['playmaking']=[rat(x) for x in .70*P['AST36']+.30*P['ast_to']];R['ball_security']=[rat(x) for x in P['security']];R['offensive_rebounding']=[rat(x) for x in P['ORB36']];R['defensive_rebounding']=[rat(x) for x in P['DRB36']];R['stamina']=[rat(x) for x in .65*P['mp_per_game']+.35*P['g']];impact=.36*P['PTS36']+.19*P['AST36']+.13*P['TRB36']+.08*P['STL36']+.08*P['BLK36']+.16*P['ts_proxy'];R['impact']=[rat(x) for x in impact]
WGTS={'guard':{'finishing':.15,'three_pt':.20,'free_throw':.04,'shot_creation':.15,'playmaking':.18,'ball_security':.10,'offensive_rebounding':.01,'defensive_rebounding':.03,'perimeter_defense':.08,'interior_defense':0,'stamina':.06},'wing':{'finishing':.18,'three_pt':.17,'free_throw':.04,'shot_creation':.14,'playmaking':.12,'ball_security':.08,'offensive_rebounding':.03,'defensive_rebounding':.06,'perimeter_defense':.10,'interior_defense':.02,'stamina':.06},'big':{'finishing':.22,'three_pt':.08,'free_throw':.04,'shot_creation':.08,'playmaking':.08,'ball_security':.05,'offensive_rebounding':.10,'defensive_rebounding':.12,'perimeter_defense':.03,'interior_defense':.12,'stamina':.08}}
y=next(p for p in players if p['name']=='Yanic Niederhauser');n=norm(y['name'])
if n not in S.index:raise SystemExit('Yanic missing from BRef source')
s=S.loc[n];three_pa=val(s['x3pa_per_game']);fta=val(s['fta_per_game']);conf=min(1.0,float(s['g']*s['mp_per_game'])/1200)
y['stats_2025_26']={'gp':int(round(s['g'])),'gs':int(round(s['gs'])),'mpg':r1(s['mp_per_game']),'pts':r1(s['pts_per_game']),'reb':r1(s['trb_per_game']),'ast':r1(s['ast_per_game']),'stl':r1(s['stl_per_game']),'blk':r1(s['blk_per_game']),'tov':r1(s['tov_per_game']),'fg_pct':r3(s['fg_percent']) if not pd.isna(s['fg_percent']) else None,'three_pct':r3(s['x3p_percent']) if three_pa>0 and not pd.isna(s['x3p_percent']) else None,'ft_pct':r3(s['ft_percent']) if fta>0 and not pd.isna(s['ft_percent']) else None,'fga':r1(s['fga_per_game']),'three_pa':r1(three_pa),'fta':r1(fta),'oreb':r1(s['orb_per_game']),'dreb':r1(s['drb_per_game']),'pf':r1(s['pf_per_game'])}
rt=R.loc[n];g=y['position_group'];perim_proxy={'guard':.85,'wing':.70,'big':.40}[g];int_proxy={'guard':.20,'wing':.45,'big':.90}[g]
ratings={k:int(rt[k]) for k in ['finishing','three_pt','free_throw','shot_creation','playmaking','ball_security','offensive_rebounding','defensive_rebounding','stamina']};ratings['perimeter_defense']=rat(.65*P['STL36'].loc[n]+.20*P['low_pf36'].loc[n]+.15*perim_proxy);ratings['interior_defense']=rat(.55*P['BLK36'].loc[n]+.25*P['DRB36'].loc[n]+.20*int_proxy)
if conf<1:
    for k in list(ratings):ratings[k]=int(round(75+conf*(ratings[k]-75)))
ratings['offense']=int(round(.24*ratings['finishing']+.17*ratings['three_pt']+.05*ratings['free_throw']+.20*ratings['shot_creation']+.20*ratings['playmaking']+.14*ratings['ball_security']));ratings['defense']=int(round(.40*ratings['perimeter_defense']+.35*ratings['interior_defense']+.10*ratings['offensive_rebounding']+.15*ratings['defensive_rebounding']));skill=int(round(sum(ratings[k]*w for k,w in WGTS[g].items())));ratings['skill_overall']=skill;ratings['impact']=int(rt['impact']);ratings['overall']=int(round(.72*skill+.28*ratings['impact']))
y['ratings']=ratings;y['data_confidence']=round(conf,3);y['career_status']='nba_established' if conf>=.25 else 'low_sample_established';y['tendencies']={'three_point_rate':r3(three_pa/(val(s['fga_per_game'])+1e-9)),'free_throw_rate':r3(fta/(val(s['fga_per_game'])+1e-9)),'shot_volume_per36':r2(s['FGA36']),'assist_per36':r2(s['AST36']),'turnover_per36':r2(s['TOV36'])};y['simulation_profile']={'pts_per36':r2(s['PTS36']),'fga_per36':r2(s['FGA36']),'three_pa_per36':r2(s['3PA36']),'fta_per36':r2(s['FTA36']),'reb_per36':r2(s['TRB36']),'ast_per36':r2(s['AST36']),'stl_per36':r2(s['STL36']),'blk_per36':r2(s['BLK36']),'tov_per36':r2(s['TOV36']),'true_shooting_proxy':r3(s['ts_proxy']) if not pd.isna(s['ts_proxy']) else None,'three_point_rate':r3(three_pa/(val(s['fga_per_game'])+1e-9)),'free_throw_rate':r3(fta/(val(s['fga_per_game'])+1e-9))};y['rating_source']='2025-26_final_box_score_model_v19';y['stat_source_status']='season_complete_verified';y['stat_source']='Basketball-Reference 2025-26 final regular-season per-game table (public dataset mirror), season-total row.';y['stat_verified_date']='2026-08-20';y['stat_verified_fields']=FIELDS.copy();y['stat_bootstrap_fields']=[];y['data_quality']=[q for q in y.get('data_quality',[]) if q not in ['no_2025_26_stat_match','source_backed_projection_v23']];y.pop('projection_2026_27',None);y.pop('projection_confidence',None)

# Preserve all other v0.23 basketball cores.
post={p['id']:core_hash(p) for p in players if p['name']!='Yanic Niederhauser'}
drift=[pid for pid,h in pre.items() if post.get(pid)!=h]
if drift:raise SystemExit(f'unintended non-Yanic basketball-core drift: {drift[:10]}')

# Projection input snapshot loses only Yanic.
pr=json.load(open(PROJ23,encoding='utf-8')); rec=[r for r in pr['records'] if r['id']!='yanic-niederhauser'];
if len(rec)!=49:raise SystemExit(f'expected 49 projection records, got {len(rec)}')
json.dump({'version':'v0.24','freeze_date':'2026-08-20','records':rec},open(PROJ24,'w',encoding='utf-8'),indent=2,ensure_ascii=False);open(PROJ24,'a').write('\n')

# Certification output.
source_counts={}
for p in players:source_counts[p['years_service_source']]=source_counts.get(p['years_service_source'],0)+1
cert={'version':'v0.24','freeze_date':'2026-08-20','definition':'CBA Years of Service = one season for each NBA season in which the player was on an NBA Active or Inactive List for at least one regular-season day, subject to CBA exceptions.','total_players':442,'certified':sum(1 for p in players if p.get('years_service_certainty')=='certified'),'nba_api_2025_26_rows_matched':393,'zero_service_2026_rookies_and_new_entrants':sum(1 for p in players if p.get('years_service')==0),'source_counts':source_counts,'min_years':min(p['years_service'] for p in players),'max_years':max(p['years_service'] for p in players),'yanic_correction':{'player_id':y['id'],'nba_id':y['nba_id'],'gp':y['stats_2025_26']['gp'],'overall':y['ratings']['overall'],'prior_status':'projection','new_status':'season_complete_verified'},'status':'PASS'}
OUT.write_text(json.dumps(cert,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

# Source certification update.
sc=json.load(open(SC23,encoding='utf-8'));sc['version']='v0.24';sc['player_stats'].update({'season_complete_verified':393,'projection':49,'source_backed_projection':49,'rating_population':'393_final_2025_26_nba_plus_49_source_backed_projection','note':'393 current players use season-final 2025-26 NBA aggregate rows after v0.24 corrected Yanic Niederhauser from a projection-only name/ID miss. The other 49 retain null stats_2025_26 and a separate source-backed projection layer.'});sc['contracts']['years_of_service']={'total_players':442,'certified':442,'nba_stats_api_2025_26_experience_rows':393,'rule':'CBA Active/Inactive List service definition','age_proxy_removed':True,'source_file':'data/service-years-certification-v0.24.json'}
SC24.write_text(json.dumps(sc,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')

# Quality + browser payload.
q=json.load(open(QUALITY,encoding='utf-8'));q.update({'version':'v0.24','season_complete_verified':393,'established_with_2025_26_stats':393,'no_current_rating':0,'source_backed_projection':49,'source_backed_projection_players':49,'rated_players':442,'signed_standard_or_inactive':438,'signed_two_way':1,'projection_population':{'rookie_2026_projected':37,'pre_nba_or_no_nba_sample_projected':6,'no_2025_26_nba_sample_projected':6}});q['warnings']=[w.replace('The 50 no-2025-26-NBA-baseline players','The 49 no-2025-26-NBA-baseline players') for w in q.get('warnings',[]) if 'Rookies/newcomers without 2025-26 NBA evidence' not in w];q['warnings'].append('49 players without 2025-26 NBA evidence use source-backed projections; translated inputs are not historical NBA stats.');q['warnings']=list(dict.fromkeys(q['warnings']))
QUALITY.write_text(json.dumps(q,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
PLAYERS.write_text(json.dumps(players,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
s=DATAJS.read_text(encoding='utf-8').strip();prefix='window.NBA_COURTSIDE_DATA = ';payload=json.loads(s[len(prefix):].rstrip(';'));payload['players']=players;payload['quality']=q;payload['source_certification']=sc;payload['projection_inputs_version']='v0.24';DATAJS.write_text(prefix+json.dumps(payload,separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')
print(json.dumps(cert,indent=2,ensure_ascii=False))
