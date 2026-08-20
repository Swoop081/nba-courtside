#!/usr/bin/env python3
import csv,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
players=json.loads((ROOT/'data/players-2026-08-19.json').read_text())
ledger=json.loads((ROOT/'data/future-pick-ledger-2026-08-20.json').read_text())
sc=json.loads((ROOT/'data/source-certification-v0.18.json').read_text())
with (ROOT/'raw/rosters_contracts_2026-08-19.tsv').open(encoding='utf-8-sig') as f:
    frozen=list(csv.DictReader(f,delimiter='\t'))

errors=[]; checks=[]
def ok(name,cond,detail=''):
    checks.append({'check':name,'pass':bool(cond),'detail':detail})
    if not cond: errors.append(f'{name}: {detail}')

def parse_contract(s):
    out=[]
    for tok in (s or '').split(';'):
        if not tok: continue
        y,val=tok.split(':',1); y=int(y)
        if val=='PENDING': out.append({'year':y,'amount':None,'option':'pending'}); continue
        option='guaranteed'
        if val.startswith('P'): option='player_option'; val=val[1:]
        elif val.startswith('T'): option='team_option'; val=val[1:]
        out.append({'year':y,'amount':int(val),'option':option})
    return out

bykey={(p['team'],p['name']):p for p in players}
rows={(r['team'],r['name']):r for r in frozen}
ok('442 frozen contract rows',len(frozen)==442,str(len(frozen)))
ok('442 player records',len(players)==442,str(len(players)))
ok('contract identity parity',set(rows)==set(bykey),f'missing-json={len(set(rows)-set(bykey))}, extra-json={len(set(bykey)-set(rows))}')

contract_mismatch=[]; expiry_mismatch=[]; pos_mismatch=[]; age_mismatch=[]; pending=[]
for k,r in rows.items():
    p=bykey[k]
    if int(r['age'])!=int(p['age']): age_mismatch.append(k)
    if set(filter(None,r['positions'].split(',')))!=set(p.get('positions') or []): pos_mismatch.append(k)
    if (r['expiry'] or None)!=(p.get('contract') or {}).get('expiry'): expiry_mismatch.append((k,r['expiry'],(p.get('contract') or {}).get('expiry')))
    src=parse_contract(r['contract']); yrs=(p.get('contract') or {}).get('years') or []
    if src and src[0]['option']=='pending':
        pending.append(k)
        good=(not yrs and p.get('roster_status')=='restricted_free_agent_unsigned' and p.get('rights_team')==p.get('team') and (p.get('contract') or {}).get('expiry')=='RFA' and (p.get('contract') or {}).get('qualifying_offer') and (p.get('contract') or {}).get('cap_hold'))
        if not good: contract_mismatch.append((k,'pending-rights-normalization'))
        continue
    got={(int(y['season_start']),int(y['amount']),y.get('option','guaranteed')) for y in yrs}
    exp={(x['year'],x['amount'],x['option']) for x in src}
    if got!=exp: contract_mismatch.append((k,sorted(exp),sorted(got)))
    if len({y['season_start'] for y in yrs})!=len(yrs): contract_mismatch.append((k,'duplicate-season'))

ok('age parity',not age_mismatch,f'{len(age_mismatch)} mismatches')
ok('position parity',not pos_mismatch,f'{len(pos_mismatch)} mismatches')
ok('expiry parity',not expiry_mismatch,f'{len(expiry_mismatch)} mismatches')
ok('contract year/amount/option parity',not contract_mismatch,f'{len(contract_mismatch)} mismatches')
ok('3 pending RFA rights cases',len(pending)==3 and {n for _,n in pending}=={'Jalen Duren','Bennedict Mathurin','Peyton Watson'},str(pending))

records=sc['prior_season_records']
ok('30 final prior-season records',len(records)==30,str(len(records)))
ok('all prior records are 82 games',all(r['w']+r['l']==82 for r in records.values()),'')
w=sum(r['w'] for r in records.values()); l=sum(r['l'] for r in records.values())
ok('league record reconciliation',w==1230 and l==1230,f'{w}-{l}')

cells=ledger['cells']; key=[(c['origin'],c['year'],c['round']) for c in cells]
ok('420 future-pick origin cells',len(cells)==420,str(len(cells)))
ok('future-pick cells unique',len(set(key))==420,str(len(set(key))))
ok('30x7x2 coverage',all((t,y,r) in set(key) for t in records for y in range(2027,2034) for r in [1,2]),'')
locked=[c for c in cells if c['status'] in {'complex','frozen','source_locked'}]
ok('complex/frozen/locked picks not tradeable',all(c['tradeable'] is False for c in locked),f'{len(locked)} locked cells')
lookup={(c['origin'],c['year'],c['round']):c for c in cells}
obligations={('ATL',2027,1):'SAS',('NYK',2029,1):'BKN',('LAL',2029,1):'DAL',('TOR',2031,1):'LAC',('PHI',2031,1):'BOS',('DEN',2032,1):'BKN',('PHX',2033,1):'CHA'}
ok('key direct future first obligations',all(lookup[k]['owner']==v for k,v in obligations.items()),str({k:lookup[k]['owner'] for k in obligations}))

statuses={x:sum(1 for p in players if p.get('stat_source_status')==x) for x in ['season_complete_verified','bootstrap_hybrid','projection']}
ok('player source statuses sum to 442',sum(statuses.values())==442,str(statuses))
ok('34 season-complete verified overlays',statuses['season_complete_verified']==34,str(statuses['season_complete_verified']))
ok('verified rows carry field provenance',all(p.get('stat_verified_fields') and p.get('stat_bootstrap_fields')==['gs','oreb','dreb','pf'] for p in players if p.get('stat_source_status')=='season_complete_verified'),'')

app=(ROOT/'app.js').read_text(); gd=(ROOT/'gameday.js').read_text(); idx=(ROOT/'index.html').read_text()
ok('v18 app save key',"nbaCourtsideSaveV18" in app and 'version:18' in app,'')
ok('v17 save migration retained',"'nbaCourtsideSaveV17'" in app and "'nbaCourtsideSaveV17'" in gd,'')
ok('v18 gameday save key',"nbaCourtsideSaveV18" in gd and 'version:18' in gd,'')
ok('Cup pot proxy removed','V17_PRIOR_POT' not in app,'')
ok('exact prior-record Cup tiebreak wired','V18_PRIOR_RECORDS' in app and 'v18CupTie' in app,'')
ok('source certification scripts loaded','data/source-certification.js' in idx and 'data/future-pick-ledger.js' in idx,'')

player_contracts=[]
for k,r in sorted(rows.items()):
    p=bykey[k]; src=parse_contract(r['contract'])
    player_contracts.append({'team':r['team'],'name':r['name'],'age':int(r['age']),'positions':r['positions'].split(','),'expiry':r['expiry'],'contract_tokens':src,'json_roster_status':p.get('roster_status'),'rights_team':p.get('rights_team'),'qualifying_offer':(p.get('contract') or {}).get('qualifying_offer'),'cap_hold':(p.get('contract') or {}).get('cap_hold'),'structure_status':'certified','bird_rights_status':'engine_inferred'})

report={
 'version':'v0.18','date':'2026-08-20','status':'PASS' if not errors else 'FAIL','checks':checks,
 'contract_snapshot':{'rows':len(frozen),'exact_structure_matches':len(frozen)-len(contract_mismatch),'pending_rfa_normalizations':[name for _,name in pending],'bird_rights_status':'engine_inferred'},
 'player_stats':statuses,
 'future_pick_ledger':{'cells':len(cells),'locked_cells':len([c for c in cells if not c['tradeable']]),'executable_scope':'simple direct/protected rights; complex chains source-locked'},
 'player_contracts':player_contracts,
 'errors':errors
}
(ROOT/'data/contract-certification-2026-08-20.json').write_text(json.dumps(report,indent=2)+'\n')
print('SOURCE CERTIFICATION v0.18:',report['status'])
for c in checks: print(('PASS' if c['pass'] else 'FAIL'),'-',c['check'],('- '+c['detail']) if c['detail'] else '')
if errors:
    print('\nERRORS:'); [print(' -',e) for e in errors]
    sys.exit(1)
