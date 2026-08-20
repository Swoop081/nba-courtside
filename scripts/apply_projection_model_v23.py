#!/usr/bin/env python3
"""NBA Courtside v0.23 — source-backed projection translation for players without 2025-26 NBA evidence.

This script never writes historical stats into stats_2025_26. It creates a separate
projection_2026_27 layer, NBA-like synthetic simulation rates, and ratings translated
against the unchanged v0.19 final-NBA population.
"""
from pathlib import Path
import json, math, statistics
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
PLAYERS=ROOT/'data/players-2026-08-19.json'
INPUTS=ROOT/'raw/projection-inputs-v0.23.json'
DATAJS=ROOT/'data/data.js'
MODEL=ROOT/'model/rating-model.json'
QUALITY=ROOT/'data/data-quality.json'
OUT=ROOT/'data/projection-certification-v0.23.json'

LG3=.3596; LG2=.5508; LGFT=.7831
K3,K2,KFT=100,150,75
WGTS={
'guard':{'finishing':.15,'three_pt':.20,'free_throw':.04,'shot_creation':.15,'playmaking':.18,'ball_security':.10,'offensive_rebounding':.01,'defensive_rebounding':.03,'perimeter_defense':.08,'interior_defense':0,'stamina':.06},
'wing': {'finishing':.18,'three_pt':.17,'free_throw':.04,'shot_creation':.14,'playmaking':.12,'ball_security':.08,'offensive_rebounding':.03,'defensive_rebounding':.06,'perimeter_defense':.10,'interior_defense':.02,'stamina':.06},
'big':  {'finishing':.22,'three_pt':.08,'free_throw':.04,'shot_creation':.08,'playmaking':.08,'ball_security':.05,'offensive_rebounding':.10,'defensive_rebounding':.12,'perimeter_defense':.03,'interior_defense':.12,'stamina':.08}}

players=json.loads(PLAYERS.read_text(encoding='utf-8'))
manifest=json.loads(INPUTS.read_text(encoding='utf-8'))['records']
inputs={r['id']:r for r in manifest}
verified=[p for p in players if p.get('stat_source_status')=='season_complete_verified' and p.get('ratings') and p.get('simulation_profile')]
if len(verified)!=392: raise SystemExit(f'expected unchanged 392-player NBA reference population, got {len(verified)}')
projection=[p for p in players if p.get('stat_source_status')=='projection']
if len(projection)!=50 or set(inputs)!={p['id'] for p in projection}: raise SystemExit('projection manifest/population mismatch')

# Reference arrays from the v0.19 final NBA population.
features={k:[] for k in ['adj3','adj2','adjft','3PA36','2PA36','FTA36','FGA36','PTS36','AST36','ast_to','ORB36','DRB36','TRB36','STL36','BLK36','low_pf36','mpg','gp','ts','security']}
pos_rates={g:{k:[] for k in ['pts_per36','fga_per36','three_pa_per36','fta_per36','reb_per36','ast_per36','stl_per36','blk_per36','tov_per36','pf_per36','oreb_per36','dreb_per36','three_point_rate','free_throw_rate']} for g in WGTS}
pos_ratings={g:{k:[] for k in next(iter(verified))['ratings']} for g in WGTS}
for p in verified:
    st=p['stats_2025_26']; sp=p['simulation_profile']; gp=max(1,float(st['gp'])); mpg=max(.1,float(st['mpg']))
    three_pa=max(0,float(st.get('three_pa') or 0)); fga=max(.01,float(st.get('fga') or 0)); fta=max(0,float(st.get('fta') or 0))
    three_pct=float(st.get('three_pct')) if st.get('three_pct') is not None else LG3
    ft_pct=float(st.get('ft_pct')) if st.get('ft_pct') is not None else LGFT
    fg_pct=float(st.get('fg_pct') or .45)
    two_pa=max(.05,fga-three_pa); fgm=fg_pct*fga; three_pm=three_pct*three_pa; two_pm=max(0,fgm-three_pm); two_pct=min(.95,max(.20,two_pm/two_pa))
    adj3=(three_pct*three_pa*gp+K3*LG3)/(three_pa*gp+K3)
    adj2=(two_pct*two_pa*gp+K2*LG2)/(two_pa*gp+K2)
    adjft=(ft_pct*fta*gp+KFT*LGFT)/(fta*gp+KFT)
    pf36=float(st.get('pf') or 0)*36/mpg
    ast=float(sp['ast_per36']); tov=float(sp['tov_per36']); resp=float(sp['fga_per36'])+2*ast+.44*float(sp['fta_per36'])
    vals={'adj3':adj3,'adj2':adj2,'adjft':adjft,'3PA36':float(sp['three_pa_per36']),'2PA36':max(0,float(sp['fga_per36'])-float(sp['three_pa_per36'])),'FTA36':float(sp['fta_per36']),'FGA36':float(sp['fga_per36']),'PTS36':float(sp['pts_per36']),'AST36':ast,'ast_to':ast/(tov+.65),'ORB36':float(st.get('oreb') or 0)*36/mpg,'DRB36':float(st.get('dreb') or 0)*36/mpg,'TRB36':float(sp['reb_per36']),'STL36':float(sp['stl_per36']),'BLK36':float(sp['blk_per36']),'low_pf36':-pf36,'mpg':mpg,'gp':gp,'ts':float(sp.get('true_shooting_proxy') or .55),'security':-(tov/(resp+2.0))}
    for k,v in vals.items(): features[k].append(v)
    g=p['position_group']
    for k in ['pts_per36','fga_per36','three_pa_per36','fta_per36','reb_per36','ast_per36','stl_per36','blk_per36','tov_per36']:
        pos_rates[g][k].append(float(sp[k]))
    pos_rates[g]['pf_per36'].append(pf36)
    pos_rates[g]['oreb_per36'].append(float(st.get('oreb') or 0)*36/mpg)
    pos_rates[g]['dreb_per36'].append(float(st.get('dreb') or 0)*36/mpg)
    pos_rates[g]['three_point_rate'].append(float(sp['three_point_rate']))
    pos_rates[g]['free_throw_rate'].append(float(sp['free_throw_rate']))
    for k,v in p['ratings'].items(): pos_ratings[g][k].append(float(v))

def med(a): return float(statistics.median(a)) if a else 0.0
PRI={g:{k:med(v) for k,v in d.items()} for g,d in pos_rates.items()}
RPRI={g:{k:med(v) for k,v in d.items()} for g,d in pos_ratings.items()}
def pct(arr,x):
    a=np.asarray(arr,dtype=float); return float((np.sum(a<x)+.5*np.sum(a==x))/len(a))
def rr(score): return int(np.clip(round(50+49*score),35,99))
def clamp(x,a,b): return min(b,max(a,x))
def round2(x): return round(float(x),2)
def round3(x): return round(float(x),3)

# Rookie investment is only a current-ability prior; it is not treated as historical statistical evidence.
rookies=[p for p in projection if p.get('career_status')=='rookie_2026_projection_pending']
sal=sorted((p['contract']['years'][0]['amount'] if p.get('contract',{}).get('years') else 0) for p in rookies)
def salary_percentile(p):
    s=p['contract']['years'][0]['amount'] if p.get('contract',{}).get('years') else 0
    if len(sal)<=1:return .5
    return sum(1 for x in sal if x<s)/(len(sal)-1)

def source_default_mpg(inp):
    st=inp['source_stats'];
    if st.get('mpg'): return float(st['mpg']),False
    typ=inp['source_type']
    if typ.startswith('ncaa'): return 30.0,True
    if typ=='international_2025_26': return 24.0,True
    return 28.0,True

def intl_factor(league):
    s=league.lower()
    if 'euroleague' in s and ('acb' in s or 'bsl' in s): return .93
    if 'euroleague' in s:return .94
    if 'acb' in s:return .91
    if 'nbl' in s:return .88
    if 'aba' in s:return .86
    return .89

def age_factor(age):
    # One/two-season staleness curve for prior NBA evidence; no injury-specific rating guess is embedded.
    return clamp(1.0-max(0,age-28)*.018,.84,1.0)

def translated_rate(inp, key, per36, age):
    typ=inp['source_type']
    if typ=='prior_nba_2024_25':
        af=age_factor(age)
        if key in ('ast_per36','tov_per36'): af=clamp(.985-max(0,age-31)*.008,.90,.985)
        if key in ('stl_per36','blk_per36','reb_per36'): af=clamp(1.0-max(0,age-29)*.014,.86,1.0)
        return per36*af
    if typ=='international_2025_26':
        f=intl_factor(inp['source_league'])
        fac={'pts_per36':f,'fga_per36':f,'three_pa_per36':f,'fta_per36':f*.96,'reb_per36':min(.97,f+0.02),'ast_per36':f,'stl_per36':f*.94,'blk_per36':f*.94,'tov_per36':.96}.get(key,f)
        return per36*fac
    bridge=typ=='ncaa_bridge_2024_25'
    fac={'pts_per36':.69 if bridge else .72,'fga_per36':.75 if bridge else .78,'three_pa_per36':.79 if bridge else .82,'fta_per36':.70 if bridge else .74,'reb_per36':.76 if bridge else .79,'ast_per36':.76 if bridge else .80,'stl_per36':.70 if bridge else .74,'blk_per36':.72 if bridge else .76,'tov_per36':.92}.get(key,.75)
    return per36*fac

def source_weight(inp):
    c=float(inp['projection_confidence']); typ=inp['source_type']
    mult=.96 if typ=='prior_nba_2024_25' else .88 if typ=='international_2025_26' else .80 if typ=='ncaa_2025_26' else .72
    return clamp(c*mult,.34,.86)

def projected_role(p,inp):
    c=float(inp['projection_confidence']); st=inp['source_stats']; typ=inp['source_type']
    if inp['career_bucket']=='rookie_2026':
        invest=salary_percentile(p)
        mpg=11.5+20.5*(invest**.78)
        return round(clamp(mpg,10,32),1), int(round(65+7*c))
    if typ=='prior_nba_2024_25':
        base=float(st.get('mpg') or 26); role=base*clamp(.96-max(0,p['age']-29)*.035,.64,.96)
        return round(clamp(role,14,34),1), int(round(clamp(72-max(0,p['age']-30)*1.6,54,72)))
    if typ=='international_2025_26':
        base=float(st.get('mpg') or 24); return round(clamp(14+base*.28,16,24),1), int(round(62+8*c))
    return round(clamp(13+7*c,14,20),1), int(round(62+8*c))

before_verified={p['id']:json.dumps({'stats':p['stats_2025_26'],'ratings':p['ratings'],'simulation_profile':p['simulation_profile']},sort_keys=True) for p in verified}
changed=[]
for p in projection:
    inp=inputs[p['id']]; st=inp['source_stats']; g=p['position_group']; pri=PRI[g]; conf=float(inp['projection_confidence']); sw=source_weight(inp); src_mpg,mpg_assumed=source_default_mpg(inp)
    def src36(field):
        if st.get(field) is None:return None
        return float(st[field])*36/src_mpg
    # Direct translated rates where available, then shrink toward NBA position priors.
    rate={}
    field_map={'pts_per36':'pts','fga_per36':'fga','three_pa_per36':'three_pa','fta_per36':'fta','reb_per36':'reb','ast_per36':'ast','stl_per36':'stl','blk_per36':'blk','tov_per36':'tov'}
    for key,field in field_map.items():
        v=src36(field)
        if v is None:
            rate[key]=pri[key]
        else:
            tv=translated_rate(inp,key,v,p['age'])
            rate[key]=tv*sw+pri[key]*(1-sw)
    # If source attempts are missing, use scoring evidence to move volume away from the positional prior without inventing an input FGA.
    if st.get('fga') is None and st.get('pts') is not None:
        pts_target=translated_rate(inp,'pts_per36',src36('pts'),p['age'])*sw+pri['pts_per36']*(1-sw)
        ratio=med([float(v['simulation_profile']['pts_per36'])/max(1,float(v['simulation_profile']['fga_per36'])) for v in verified if v['position_group']==g])
        implied=pts_target/max(.9,ratio)
        rate['fga_per36']=implied*.55+pri['fga_per36']*.45
    if st.get('three_pa') is None:
        skill=(float(st.get('three_pct'))-LG3) if st.get('three_pct') is not None else 0
        rate['three_pa_per36']=clamp(pri['three_point_rate']*(1+skill*2.2),.08,.68)*rate['fga_per36']
    if st.get('fta') is None:
        rate['fta_per36']=pri['free_throw_rate']*rate['fga_per36']
    # Keep rate geometry valid.
    rate['three_pa_per36']=clamp(rate['three_pa_per36'],0,rate['fga_per36']*.78)
    rate['fta_per36']=clamp(rate['fta_per36'],.4,rate['fga_per36']*.65)
    # Rebound split and PF are priors unless the source explicitly supplies them.
    reb=rate['reb_per36']
    if st.get('oreb') is not None and st.get('dreb') is not None:
        so=translated_rate(inp,'reb_per36',src36('oreb'),p['age']); sd=translated_rate(inp,'reb_per36',src36('dreb'),p['age'])
        oreb=so*sw+pri['oreb_per36']*(1-sw); dreb=sd*sw+pri['dreb_per36']*(1-sw)
        scale=reb/max(.1,oreb+dreb); oreb*=scale; dreb*=scale
    else:
        frac=pri['oreb_per36']/max(.1,pri['oreb_per36']+pri['dreb_per36']); oreb=reb*frac; dreb=reb-oreb
    pf36=(src36('pf') if st.get('pf') is not None else pri['pf_per36'])
    if st.get('pf') is not None: pf36=pf36*sw+pri['pf_per36']*(1-sw)
    # Shooting translation: explicit source percentages are shrunk toward NBA priors; no missing split is fabricated as historical data.
    shot_mult=.88 if inp['source_type']=='prior_nba_2024_25' else .72 if inp['source_type']=='international_2025_26' else .62 if inp['source_type']=='ncaa_2025_26' else .54
    shotw=clamp(conf*shot_mult,.28,.78)
    three_pct=LG3 if st.get('three_pct') is None else LG3*(1-shotw)+float(st['three_pct'])*shotw
    ft_pct=LGFT if st.get('ft_pct') is None else LGFT*(1-shotw)+float(st['ft_pct'])*shotw
    # Estimate source 2P percentage only inside the projection transform when the aggregate makes/attempts permit it.
    src2=None
    if st.get('fg_pct') is not None:
        if st.get('fga') is not None and st.get('three_pa') is not None and float(st['fga'])>float(st['three_pa'])+.05 and st.get('three_pct') is not None:
            src2=(float(st['fg_pct'])*float(st['fga'])-float(st['three_pct'])*float(st['three_pa']))/(float(st['fga'])-float(st['three_pa']))
        else:
            q=pri['three_point_rate']; src2=(float(st['fg_pct'])-three_pct*q)/max(.2,1-q)
    src2=LG2 if src2 is None else clamp(src2,.35,.78)
    two_pct=LG2*(1-shotw)+src2*shotw
    fga36=rate['fga_per36']; tpa36=rate['three_pa_per36']; fta36=rate['fta_per36']; two_pa36=max(.1,fga36-tpa36)
    # Projected effective sample sizes are deliberately capped; confidence already encodes source quality.
    att3=max(30,tpa36*28*conf); att2=max(50,two_pa36*28*conf); attft=max(25,fta36*28*conf)
    adj3=(three_pct*att3+K3*LG3)/(att3+K3); adj2=(two_pct*att2+K2*LG2)/(att2+K2); adjft=(ft_pct*attft+KFT*LGFT)/(attft+KFT)
    ast=rate['ast_per36']; tov=rate['tov_per36']; resp=fga36+2*ast+.44*fta36
    projected_mpg,expected_gp=projected_role(p,inp)
    # Synthetic points remain source-translated but are reconciled with projected efficiency enough to prevent impossible profiles.
    efficiency_pts=2*((two_pa36*two_pct)+(tpa36*three_pct*1.5))+fta36*ft_pct
    pts36=clamp(rate['pts_per36']*.72+efficiency_pts*.28,5,36)
    ts=clamp(pts36/(2*(fga36+.44*fta36)),.43,.70)
    v={'adj3':adj3,'adj2':adj2,'adjft':adjft,'3PA36':tpa36,'2PA36':two_pa36,'FTA36':fta36,'FGA36':fga36,'PTS36':pts36,'AST36':ast,'ast_to':ast/(tov+.65),'ORB36':oreb,'DRB36':dreb,'TRB36':reb,'STL36':rate['stl_per36'],'BLK36':rate['blk_per36'],'low_pf36':-pf36,'mpg':projected_mpg,'gp':expected_gp,'ts':ts,'security':-(tov/(resp+2.0))}
    P={k:pct(features[k],x) for k,x in v.items()}
    raw={}
    raw['three_pt']=rr(.75*P['adj3']+.25*P['3PA36'])
    raw['finishing']=rr(.65*P['adj2']+.25*P['2PA36']+.10*P['FTA36'])
    raw['free_throw']=rr(P['adjft'])
    raw['shot_creation']=rr(.55*P['FGA36']+.25*P['FTA36']+.20*P['PTS36'])
    raw['playmaking']=rr(.70*P['AST36']+.30*P['ast_to'])
    raw['ball_security']=rr(P['security'])
    raw['offensive_rebounding']=rr(P['ORB36']); raw['defensive_rebounding']=rr(P['DRB36'])
    raw['stamina']=rr(.65*P['mpg']+.35*P['gp'])
    perim_proxy={'guard':.85,'wing':.70,'big':.40}[g]; int_proxy={'guard':.20,'wing':.45,'big':.90}[g]
    raw['perimeter_defense']=rr(.65*P['STL36']+.20*P['low_pf36']+.15*perim_proxy)
    raw['interior_defense']=rr(.55*P['BLK36']+.25*P['DRB36']+.20*int_proxy)
    impact_raw=rr(.36*P['PTS36']+.19*P['AST36']+.13*P['TRB36']+.08*P['STL36']+.08*P['BLK36']+.16*P['ts'])
    # Projection uncertainty shrinks attributes toward the NBA positional median after translation.
    if inp['source_type']=='prior_nba_2024_25': attrw=.86+.10*conf
    elif inp['source_type']=='international_2025_26': attrw=.68+.18*conf
    else: attrw=.60+.20*conf
    ratings={k:int(round(RPRI[g][k]+attrw*(raw[k]-RPRI[g][k]))) for k in raw}
    # Draft/contract investment is a modest current-ability prior for actual 2026 rookies, never a substitute for source evidence.
    if inp['career_bucket']=='rookie_2026':
        invest=salary_percentile(p); anchor=66+14*(invest**.78)
        skill0=sum(ratings[k]*w for k,w in WGTS[g].items()); delta=(anchor-skill0)*.28
        for k in ratings: ratings[k]=int(round(clamp(ratings[k]+delta,45,97)))
    ratings['offense']=int(round(.24*ratings['finishing']+.17*ratings['three_pt']+.05*ratings['free_throw']+.20*ratings['shot_creation']+.20*ratings['playmaking']+.14*ratings['ball_security']))
    ratings['defense']=int(round(.40*ratings['perimeter_defense']+.35*ratings['interior_defense']+.10*ratings['offensive_rebounding']+.15*ratings['defensive_rebounding']))
    skill=int(round(sum(ratings[k]*w for k,w in WGTS[g].items())))
    impact=int(round(RPRI[g]['impact']+attrw*(impact_raw-RPRI[g]['impact'])))
    if inp['career_bucket']=='rookie_2026':
        invest=salary_percentile(p); impact=int(round(clamp(impact+(66+14*(invest**.78)-skill)*.18,55,94)))
    ratings['skill_overall']=skill; ratings['impact']=impact; ratings['overall']=int(round(.72*skill+.28*impact))
    # Synthetic NBA-like rates are already uncertainty-shrunk; detailed Game Day can consume them directly.
    sim={'pts_per36':round2(pts36),'fga_per36':round2(fga36),'three_pa_per36':round2(tpa36),'fta_per36':round2(fta36),'reb_per36':round2(reb),'ast_per36':round2(ast),'stl_per36':round2(rate['stl_per36']),'blk_per36':round2(rate['blk_per36']),'tov_per36':round2(tov),'true_shooting_proxy':round3(ts),'three_point_rate':round3(tpa36/max(.1,fga36)),'free_throw_rate':round3(fta36/max(.1,fga36))}
    tend={'three_point_rate':sim['three_point_rate'],'free_throw_rate':sim['free_throw_rate'],'shot_volume_per36':sim['fga_per36'],'assist_per36':sim['ast_per36'],'turnover_per36':sim['tov_per36']}
    old_status=p['career_status']
    if old_status=='rookie_2026_projection_pending': new_status='rookie_2026_projected'
    elif old_status=='pre_nba_or_no_nba_sample_projection_pending': new_status='pre_nba_or_no_nba_sample_projected'
    else:new_status='no_2025_26_nba_sample_projected'
    p['ratings']=ratings; p['tendencies']=tend; p['simulation_profile']=sim
    p['rating_source']='projection_translation_model_v0.23'
    p['projection_confidence']=round3(conf)
    p['projection_2026_27']={'status':'source_backed_projection','model_version':'v0.23','source_type':inp['source_type'],'source_season':inp['source_season'],'source_team':inp['source_team'],'source_league':inp['source_league'],'source_url':inp['source_url'],'projected_mpg':projected_mpg,'expected_games':expected_gp,'source_mpg_assumed_for_translation':mpg_assumed,'source_mpg_used':round2(src_mpg),'confidence':round3(conf),'note':inp.get('note','')}
    p['career_status']=new_status
    p['stat_source']='No 2025-26 NBA baseline. v0.23 uses a separate source-backed 2026-27 projection layer; stats_2025_26 remains null.'
    p['data_quality']=[q for q in (p.get('data_quality') or []) if q not in ('projection_pending','pre_nba_projection_pending')]
    if 'source_backed_projection_v23' not in p['data_quality']: p['data_quality'].append('source_backed_projection_v23')
    changed.append({'id':p['id'],'name':p['name'],'bucket':inp['career_bucket'],'source_type':inp['source_type'],'confidence':round3(conf),'overall':ratings['overall'],'skill_overall':skill,'impact':impact,'projected_mpg':projected_mpg})

# Strong invariant: final-NBA population must be byte-for-byte unchanged in its core evidence/rating/profile fields.
for p in verified:
    now=json.dumps({'stats':p['stats_2025_26'],'ratings':p['ratings'],'simulation_profile':p['simulation_profile']},sort_keys=True)
    if now!=before_verified[p['id']]: raise SystemExit('v0.19 evidence player changed: '+p['name'])

PLAYERS.write_text(json.dumps(players,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
model=json.loads(MODEL.read_text(encoding='utf-8'))
model['version']='0.23'
model['rookies']={'no_nba_stats':'keep stats_2025_26 null; generate a distinct source-backed projection_2026_27 layer','projection_inputs':['pre-NBA or prior-NBA/international source sample','age','position','competition translation class','current rookie-scale/contract investment prior for true 2026 rookies'],'translation':'source rates are competition-adjusted, then shrunk toward 2025-26 NBA position priors according to projection confidence','draft_position_rule':'rookie-scale investment is a modest current-ability prior; development profile still carries most future upside','nba_takeover':'future NBA evidence should replace projection influence as real career NBA minutes accumulate'}
model['projection_v0_23']={'reference_population':'392 unchanged v0.19 season-complete NBA players','source_backed_players':50,'historical_stat_policy':'projection inputs never populate stats_2025_26','confidence_range':[min(x['confidence'] for x in changed),max(x['confidence'] for x in changed)],'simulation_policy':'synthetic NBA-like rates are uncertainty-shrunk before Game Day use','role_policy':'projected minutes are stored separately from historical MPG'}
MODEL.write_text(json.dumps(model,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
quality=json.loads(QUALITY.read_text(encoding='utf-8'))
quality.update({'freeze_date':'2026-08-20','version':'v0.23','rated_players':442,'no_current_rating':0,'projection_pending':0,'source_backed_projection_players':50,'season_complete_verified':392,'bootstrap_hybrid':0})
quality['projection_population']={'rookie_2026':sum(x['bucket']=='rookie_2026' for x in changed),'newcomer':sum(x['bucket']=='newcomer' for x in changed),'veteran_prior_nba':sum(x['bucket']=='veteran_prior_nba' for x in changed),'veteran_external':sum(x['bucket']=='veteran_external' for x in changed)}
quality['warnings']=['Historical-portable box-score ratings intentionally do not claim to capture every component of defense.','The 50 no-2025-26-NBA-baseline players use source-backed projections, not fabricated 2025-26 NBA statistics.','Projection confidence reflects source/sample/translation uncertainty; missing source fields fall back to NBA position priors and are not asserted as historical facts.']
QUALITY.write_text(json.dumps(quality,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
# Browser payload sync.
s=DATAJS.read_text(encoding='utf-8').strip();prefix='window.NBA_COURTSIDE_DATA = '
payload=json.loads(s[len(prefix):].rstrip(';'))
payload['players']=players;payload['quality']=quality;payload['model']=model;payload['league']['freeze_date']='2026-08-20';payload['league']['version']='2026-live-league-v0.9'
DATAJS.write_text(prefix+json.dumps(payload,separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')
# Certification summary.
changed=sorted(changed,key=lambda x:(-x['overall'],x['name']))
audit={'version':'v0.23','freeze_date':'2026-08-20','status':'PASS','reference_nba_players_unchanged':392,'projection_players':50,'stats_2025_26_null_for_projection':sum(1 for p in players if p.get('stat_source_status')=='projection' and p.get('stats_2025_26') is None),'rated_players_total':sum(1 for p in players if p.get('ratings')),'projection_population':quality['projection_population'],'confidence_min':min(x['confidence'] for x in changed),'confidence_max':max(x['confidence'] for x in changed),'overall_min':min(x['overall'] for x in changed),'overall_max':max(x['overall'] for x in changed),'top_projected_overalls':changed[:15],'all_projection_outputs':changed}
OUT.write_text(json.dumps(audit,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in audit.items() if k!='all_projection_outputs'},indent=2,ensure_ascii=False))
