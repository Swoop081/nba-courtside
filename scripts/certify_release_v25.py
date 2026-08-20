#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parents[1]
errors=[]
def check(cond,msg):
    if not cond: errors.append(msg)
sc=json.loads((root/'data/source-certification-v0.25.json').read_text())
q=json.loads((root/'data/data-quality.json').read_text())
check(sc.get('version')=='v0.25','source certification version')
check(q.get('version')=='v0.25','data quality version')
check(sc.get('player_stats',{}).get('season_complete_verified')==393,'393 final NBA rows')
check(sc.get('player_stats',{}).get('source_backed_projection')==49,'49 projections')
check(sc.get('contracts',{}).get('years_of_service',{}).get('certified')==442,'442 YOS')
check(sc.get('draft_assets',{}).get('origin_cells')==420,'420 pick origin cells')
rr=sc.get('release_readiness',{})
check(rr.get('save_schema')==25,'schema 25')
check(rr.get('save_key')=='nbaCourtsideSaveV25','v25 save key')
check(rr.get('long_horizon',{}).get('seasons_tested')==10,'10-season horizon')
check(rr.get('long_horizon',{}).get('serialized_save_bytes',99_000_000)<4_500_000,'save size gate')
app=(root/'app.js').read_text()
check("const SAVE_KEY='nbaCourtsideSaveV25'" in app,'app v25 key')
check('const SAVE_SCHEMA=25' in app,'app v25 schema')
check('nbaCourtsideSaveV18' in app,'legacy v18 migration')
check('faRoundContext' in app,'FA context cache')
check('pendingByTeam' in app,'FA offer counter cache')
check('DBG_FA' not in app,'no FA debug logging')
for f in ['docs/RELEASE_READINESS_V25.md','docs/VALIDATION_V25.md','scripts/test_save_migration_v25.js','scripts/test_long_horizon_v25.js','scripts/test_free_agency_scaling_v25.js','scripts/test_accessibility_v25.py']:
    check((root/f).exists(),f+' exists')
# Wrapper parity.
wrap=(root/'data/source-certification.js').read_text().strip()
check(wrap.startswith('window.NBA_COURTSIDE_SOURCE_CERT = '),'source wrapper prefix')
if wrap.startswith('window.NBA_COURTSIDE_SOURCE_CERT = '):
    w=json.loads(wrap[len('window.NBA_COURTSIDE_SOURCE_CERT = '):].rstrip(';'))
    check(w==sc,'source wrapper parity')
# Embedded data parity.
d=(root/'data/data.js').read_text().strip(); pre='window.NBA_COURTSIDE_DATA = '
check(d.startswith(pre),'data wrapper prefix')
if d.startswith(pre):
    obj=json.loads(d[len(pre):].rstrip(';'))
    check(obj.get('quality')==q,'embedded quality parity')
    check(obj.get('source_certification')==sc,'embedded source certification parity')
if errors:
    print('FAIL')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PASS — NBA Courtside v0.25 release certification')
