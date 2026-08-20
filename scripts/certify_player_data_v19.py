#!/usr/bin/env python3
from pathlib import Path
import json, re, unicodedata, math
import pandas as pd
ROOT=Path(__file__).resolve().parents[1]
players=json.load(open(ROOT/'data/players-2026-08-19.json',encoding='utf-8'))
quality=json.load(open(ROOT/'data/data-quality.json',encoding='utf-8'))
model=json.load(open(ROOT/'model/rating-model.json',encoding='utf-8'))
bref=pd.read_csv(ROOT/'raw/bref_player_per_game_2025_26_final.csv')
glogs=pd.read_csv(ROOT/'raw/nba_game_logs_2025_26_regular_validation.csv')
checks=[];errors=[]
def ok(name,cond,detail=''):
 checks.append({'name':name,'status':'PASS' if cond else 'FAIL','detail':detail})
 if not cond:errors.append(name+(': '+detail if detail else ''))

def norm(s):
 s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode().lower();s=s.replace('.','').replace('-',' ');s=re.sub(r'\b(jr|sr|ii|iii|iv)\b','',s);s=re.sub(r'[^a-z0-9 ]','',s);s=re.sub(r'\s+',' ',s).strip()
 a={'alexandre sarr':'alex sarr','cameron christie':'cam christie','nicolas claxton':'nic claxton','lu dort':'luguentz dort','carlton carrington':'bub carrington','egor dmin':'egor demin','hansen yang':'yang hansen'}
 return a.get(s,s)

bref=bref[(bref.season==2026)&(bref.lg=='NBA')].copy(); multi={'2TM','3TM','4TM','5TM','6TM'}; rows=[]
for pid,g in bref.groupby('player_id',sort=False):
 x=g[g.team.isin(multi)];rows.append((x.iloc[0] if len(x) else g.iloc[0]).copy())
C=pd.DataFrame(rows);C['norm']=C.player.map(norm);C=C.set_index('norm')
statp=[p for p in players if p.get('stats_2025_26')]; proj=[p for p in players if not p.get('stats_2025_26')]
ok('442 current player/right rows',len(players)==442,str(len(players)))
ok('392 season-final evidence players',len(statp)==392,str(len(statp)))
ok('50 projection/no-baseline players',len(proj)==50,str(len(proj)))
ok('zero bootstrap-hybrid players',sum(p.get('stat_source_status')=='bootstrap_hybrid' for p in players)==0,'')
ok('all evidence rows season-complete verified',all(p.get('stat_source_status')=='season_complete_verified' for p in statp),'')
ok('all 18 stat fields verified',all(len(p.get('stat_verified_fields',[]))==18 and not p.get('stat_bootstrap_fields') for p in statp),'')
missing=[p['name'] for p in statp if norm(p['name']) not in C.index]
ok('392/392 final source joins',not missing,', '.join(missing))
# Direct source parity for principal fields.
issues=[]
for p in statp:
 if norm(p['name']) not in C.index:continue
 r=C.loc[norm(p['name'])];s=p['stats_2025_26']
 exp={'gp':int(r.g),'gs':int(0 if pd.isna(r.gs) else r.gs),'mpg':round(float(r.mp_per_game),1),'pts':round(float(r.pts_per_game),1),'reb':round(float(r.trb_per_game),1),'ast':round(float(r.ast_per_game),1),'stl':round(float(r.stl_per_game),1),'blk':round(float(r.blk_per_game),1),'tov':round(float(r.tov_per_game),1),'fga':round(float(r.fga_per_game),1),'three_pa':round(float(r.x3pa_per_game),1),'fta':round(float(r.fta_per_game),1),'oreb':round(float(r.orb_per_game),1),'dreb':round(float(r.drb_per_game),1),'pf':round(float(r.pf_per_game),1)}
 for k,v in exp.items():
  if s.get(k)!=v:issues.append(f"{p['name']} {k}: {s.get(k)} != {v}")
ok('final table field parity',not issues,'; '.join(issues[:5]))
h=next(p for p in players if p['name']=='Kevin Huerter')
ok('Kevin Huerter full-season correction',h['stats_2025_26']['gp']==69 and h['stats_2025_26']['pts']==10.0,str(h['stats_2025_26']))
# rating schema and population
ok('v0.19 rating foundation retained',float(model.get('version','0'))>=0.19,model.get('version',''))
ok('all evidence players rerated',all((p.get('rating_source')=='2025-26_final_box_score_model_v19' and p.get('ratings')) for p in statp),'')
ok('display overall blend fields',all(all(k in p['ratings'] for k in ['skill_overall','impact','overall']) and p['ratings']['overall']==round(.72*p['ratings']['skill_overall']+.28*p['ratings']['impact']) for p in statp),'')
# Independent game-log regular-season universe and final league targets.
for c in ['FG','FGA','3P','3PA','FT','FTA','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS']:glogs[c]=pd.to_numeric(glogs[c],errors='coerce').fillna(0)
tg=glogs.groupby(['Date','Tm','Opp'])[['FG','FGA','3P','3PA','FT','FTA','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS']].sum()
ok('independent validator has 1,230 regular-season games',len(tg)==2460,f'{len(tg)//2} games / {len(tg)} team-games')
avg=tg.mean();targets={'fgm':avg.FG,'fga':avg.FGA,'three_pm':avg['3P'],'three_pa':avg['3PA'],'ftm':avg.FT,'fta':avg.FTA,'oreb':avg.ORB,'dreb':avg.DRB,'reb':avg.TRB,'ast':avg.AST,'stl':avg.STL,'blk':avg.BLK,'tov':avg.TOV,'pf':avg.PF,'pts':avg.PTS,'fg_pct':tg.FG.sum()/tg.FGA.sum(),'three_pct':tg['3P'].sum()/tg['3PA'].sum(),'ft_pct':tg.FT.sum()/tg.FTA.sum()}
targets={k:round(float(v),4) for k,v in targets.items()}
# browser payload parity
text=(ROOT/'data/data.js').read_text(encoding='utf-8').strip();payload=json.loads(text[len('window.NBA_COURTSIDE_DATA = '):].rstrip(';'))
ok('browser/player JSON parity',payload['players']==players,'')
ok('browser/model JSON parity',payload['model']==model,'')
ok('v0.19 quality foundation retained',quality.get('season_complete_verified')==392 and quality.get('bootstrap_hybrid')==0,json.dumps({k:quality.get(k) for k in ['version','season_complete_verified','bootstrap_hybrid']}))
out={'version':'v0.19','freeze_date':'2026-08-20','status':'PASS' if not errors else 'FAIL','counts':{'teams':30,'player_records':len(players),'season_complete_verified':len(statp),'projection_or_no_baseline':len(proj),'source_stint_rows':len(bref),'source_canonical_players':len(C)},'final_2025_26_team_targets':targets,'checks':checks,'errors':errors}
(ROOT/'data/certification-v0.19.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps(out,indent=2,ensure_ascii=False))
raise SystemExit(1 if errors else 0)
