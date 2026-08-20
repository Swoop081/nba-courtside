#!/usr/bin/env python3
import json,re,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
players=json.load(open(root/'data/players-2026-08-19.json',encoding='utf-8'))
cert=json.load(open(root/'data/bird-rights-certification-v0.20.json',encoding='utf-8'))
sc=json.load(open(root/'data/source-certification-v0.20.json',encoding='utf-8'))
app=(root/'app.js').read_text(encoding='utf-8')
cba=(root/'cba.js').read_text(encoding='utf-8')
errs=[]
def check(ok,msg):
    if not ok: errs.append(msg)
check(len(players)==442,'player count')
check(len(cert.get('ledger',[]))==442,'ledger count')
check(sum(p.get('bird_rights_seed_certainty')=='exact_2027_seed' for p in players)==392,'exact seed count')
check(sum(p.get('bird_rights_seed_certainty')=='future_safe_floor' for p in players)==50,'floor count')
check(all(p.get('bird_rights_source_status') in {'continuity_certified','first_exit_certified'} for p in players),'source status')
check(all(p.get('bird_rights_first_actionable_level') in {'non_bird','early_bird','bird'} for p in players),'first exit level')
check(all(p.get('bird_rights_first_actionable_year',0)>=2029 for p in players if p.get('bird_rights_seed_certainty')=='future_safe_floor'),'floor horizon')
check(all(p.get('bird_rights_first_actionable_level')=='bird' for p in players if p.get('bird_rights_seed_certainty')=='future_safe_floor'),'floor reaches Bird')
by={p['id']:p for p in players}
expected={'tolu-smith':'bird','tarik-biberovic':'non_bird','marcus-smart':'non_bird','dean-wade':'non_bird','jaylen-brown':'bird','ty-jerome':'early_bird','keon-ellis':'non_bird','damian-lillard':'early_bird','jalen-duren':'bird','bennedict-mathurin':'bird','peyton-watson':'bird'}
for pid,lev in expected.items():
    key='bird_rights_initial_2026_level' if pid in {'jalen-duren','bennedict-mathurin','peyton-watson'} else ('bird_rights_first_actionable_level' if pid in {'tolu-smith','tarik-biberovic','marcus-smart','ty-jerome','keon-ellis','damian-lillard'} else 'bird_rights_2027_seed_level')
    check(by.get(pid,{}).get(key)==lev,f'{pid} {key}')
check('state.birdClock' in app,'birdClock runtime')
active=app[app.rfind('function processContractsForNextSeason'):]
check('birdLevelFor(p)' in active,'contract process uses bird clock')
check('teamTenure[p.id]||1,level' not in active,'no team tenure rights inference')
check('state.birdClock[p.id]=0' in app,'continuity reset exists')
check("route==='bird'||route==='early_bird'" in app,'8 percent Bird/Early raise selection')
check("add('early_bird','EARLY BIRD'" in cba and ',4,null,2)' in cba,'Early Bird 2-4 years')
check('minYears' in cba,'term floor metadata')
br=sc.get('contracts',{}).get('bird_rights',{})
check(br.get('exact_2027_seeds')==392,'source cert exact count')
check(br.get('future_safe_floor_seeds')==50,'source cert floor count')
check(br.get('first_actionable_exit_certified')==442,'source cert exit count')
status='PASS' if not errs else 'FAIL'
out={'version':'v0.20','status':status,'counts':{'players':len(players),'exact_2027_seeds':392,'future_safe_floors':50,'first_actionable_exits':442},'errors':errs}
json.dump(out,open(root/'data/bird-rights-certification-v0.20-audit.json','w',encoding='utf-8'),indent=2);open(root/'data/bird-rights-certification-v0.20-audit.json','a').write('\n')
print(json.dumps(out,indent=2))
sys.exit(0 if not errs else 1)
