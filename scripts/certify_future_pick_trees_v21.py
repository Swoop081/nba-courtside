#!/usr/bin/env python3
import json, pathlib, collections, sys
root=pathlib.Path(__file__).resolve().parents[1]
ledger=json.loads((root/'data/future-pick-ledger-2026-08-20.json').read_text())
rules=json.loads((root/'data/future-pick-rules-v0.21.json').read_text())
cert=json.loads((root/'data/source-certification-v0.21.json').read_text())
app=(root/'app.js').read_text()
cells=ledger['cells']
errors=[]
def check(cond,msg):
    if not cond: errors.append(msg)
counts=collections.Counter(c['status'] for c in cells)
check(len(cells)==420,f'expected 420 cells, got {len(cells)}')
check(counts==collections.Counter({'conditional':175,'own':139,'outgoing':91,'source_locked':7,'protected':4,'frozen':4}),f'unexpected status counts {dict(counts)}')
locked={(c['year'],c['round'],c['origin']) for c in cells if c['status']=='source_locked'}
expected={(2029,1,'CHA'),(2029,1,'CLE'),(2029,1,'MIN'),(2029,1,'UTA'),(2031,1,'CLE'),(2032,2,'SAC'),(2033,2,'DET')}
check(locked==expected,f'unexpected source-locked set {sorted(locked)}')
check(sum(c.get('tradeable',True) for c in cells)==230,'expected 230 atomic tradeable cells')
check(sum(not c.get('tradeable',True) for c in cells)==190,'expected 190 nontradeable cells')
for c in cells:
    if c['status'] in {'conditional','protected','frozen','source_locked'}:
        check(c.get('tradeable') is False,f"{c['year']} R{c['round']} {c['origin']} must be nontradeable")
phx=next(c for c in cells if (c['year'],c['round'],c['origin'])==(2029,1,'PHX'))
check(phx['status']=='conditional' and phx.get('data_status')=='certified_executable','PHX 2029 own origin must remain executable')
check(len(rules.get('source_urls',[]))==7,'expected seven RealGM year source URLs')
check(len(rules.get('pending_transactions',[]))==1,'pending Cleveland-Denver-L.A. Clippers transaction disclosure missing')
cle31=next(c for c in cells if (c['year'],c['round'],c['origin'])==(2031,1,'CLE'))
sac32=next(c for c in cells if (c['year'],c['round'],c['origin'])==(2032,2,'SAC'))
check(cle31.get('owner')=='CLE' and cle31.get('pending_target')=='DEN' and cle31.get('tradeable') is False,'CLE 2031 pending-transfer lock is incorrect')
check(sac32.get('owner')=='CLE' and sac32.get('pending_target')=='DEN' and sac32.get('tradeable') is False,'SAC 2032 pending-transfer lock is incorrect')
check('https://www.salaryswish.com/draft/2030' in rules.get('secondary_sources',[]),'missing 2030 secondary source')
check(any(x.get('downstream_claim_owner')=='PHX' for x in rules.get('known_unresolved',[])),'missing claim-level PHX 2029 unresolved disclosure')
check('function resolve2027FirstOwners' in app and 'function resolve2033FirstOwners' in app and 'function resolveSecondOwners' in app,'resolver functions missing')
check('state.draftRightsPreview' not in app,'temporary draft rights preview leaked into persistent state')
check("state.draft.originOrder?.slice(0,30)" in app,'draft pick history must preserve origin order')
check(cert['draft_assets']['status_counts']==dict(counts),'source certification status counts are stale')
result={'version':'v0.21','status':'PASS' if not errors else 'FAIL','cells':len(cells),'status_counts':dict(counts),'tradeable_atomic':230,'nontradeable':190,'source_locked':sorted([f'{y}-R{r}-{o}' for y,r,o in locked]),'errors':errors}
print(json.dumps(result,indent=2))
sys.exit(1 if errors else 0)
