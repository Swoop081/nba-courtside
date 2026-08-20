#!/usr/bin/env python3
import json,hashlib,re,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]; errors=[]
def ck(x,m):
    if not x: errors.append(m)
def canonical_core(p):
    raw=json.dumps({'stats':p.get('stats_2025_26'),'ratings':p.get('ratings'),'simulation_profile':p.get('simulation_profile')},sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()
    return hashlib.sha256(raw).hexdigest()
players=json.load(open(R/'data/players-2026-08-19.json',encoding='utf-8'))
sc=json.load(open(R/'data/source-certification-v0.24.json',encoding='utf-8'))
svc=json.load(open(R/'data/service-years-certification-v0.24.json',encoding='utf-8'))
quality=json.load(open(R/'data/data-quality.json',encoding='utf-8'))
hashes=json.load(open(R/'data/v019-evidence-core-hashes.json',encoding='utf-8'))['players']
byid={p['id']:p for p in players}
ck(len(players)==442,'442 player/right rows')
ck(sc.get('version')=='v0.24','source cert version')
ck(quality.get('version') in {'v0.24','v0.25'},'quality version')
ck(svc.get('status')=='PASS' and svc.get('certified')==442,'442 YOS certification')
ck(all(isinstance(p.get('years_service'),int) and p['years_service']>=0 for p in players),'every player exact integer YOS')
ck(sum(p.get('stats_2025_26') is not None for p in players)==393,'393 final NBA rows')
ck(sum(p.get('stats_2025_26') is None for p in players)==49,'49 projection rows')
y=byid.get('yanic-niederhauser'); ck(y and y.get('stats_2025_26',{}).get('gp')==41 and y.get('rating_source')=='2025-26_final_box_score_model_v19','Yanic final evidence promotion')
d=byid.get('dillon-mitchell'); ck(d and d.get('roster_status')=='two_way' and d.get('years_service')==0,'Dillon Two-Way certification')
for pid,h in hashes.items():
    ck(pid in byid and canonical_core(byid[pid])==h,f'v0.19 core drift: {pid}')
# Browser parity
sj=(R/'data/source-certification.js').read_text(encoding='utf-8').strip(); pre='window.NBA_COURTSIDE_SOURCE_CERT = '
ck(sj.startswith(pre) and sj.endswith(';'),'source-cert JS wrapper')
active_sc=json.loads(sj[len(pre):-1]) if sj.startswith(pre) and sj.endswith(';') else {}; ck(active_sc.get('version') in {'v0.24','v0.25'},'active source-cert version');
for key in ['player_stats','contracts','draft_assets','transaction_rules','projection_model']:
    ck(active_sc.get(key)==sc.get(key),f'v0.24 retained source section: {key}')
dj=(R/'data/data.js').read_text(encoding='utf-8').strip(); dp='window.NBA_COURTSIDE_DATA = '
ck(dj.startswith(dp),'data JS wrapper')
if dj.startswith(dp):
    payload=json.loads(dj[len(dp):].rstrip(';')); ck(payload.get('players')==players,'player JSON/browser parity'); ck(payload.get('source_certification')==active_sc,'embedded active source cert parity')
# Runtime/source hooks must be present.
cba=(R/'cba.js').read_text(encoding='utf-8'); app=(R/'app.js').read_text(encoding='utf-8'); gd=(R/'gameday.js').read_text(encoding='utf-8')
for token in ['oneYearMinimumTeamSalaryCharge','cashTradeLimit','twoWayContract','exhibit10Contract','disabledPlayerExceptionAmount','stretchSchedule','setOffReduction','veteranExtensionEligibility']:
    ck(token in cba,token+' CBA helper')
for token in ['apronTeamSalary','submitWaiverClaim','waiverPriorityCompare','applyDisabledPlayerException','signTwoWay','signExhibit10','convertExhibit10ToTwoWay','recordCashTrade']:
    ck(token in app,token+' runtime')
ck("currentStatus(p)==='two_way'" in gd and 'twoWayGames' in gd,'Game Day Two-Way limit/ineligibility')
ck("nbaCourtsideSaveV25" in app and 'nbaCourtsideSaveV18' in app,'v0.25 save key with v0.18 migration retained')
ck('age-1' not in cba and 'p.age-1' not in cba,'age proxy absent from CBA service helper')
res={'version':'v0.24-retained','status':'PASS' if not errors else 'FAIL','players':442,'final_nba':393,'projection':49,'yos_certified':442,'v019_core_hashes_retained':len(hashes),'yanic_gp':y.get('stats_2025_26',{}).get('gp') if y else None,'two_way_certified':['Dillon Mitchell'],'errors':errors}
print(json.dumps(res,indent=2)); sys.exit(1 if errors else 0)
