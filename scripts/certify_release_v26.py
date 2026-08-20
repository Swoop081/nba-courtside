#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parents[1]
errors=[]
def check(cond,msg):
    if not cond: errors.append(msg)
sc=json.loads((root/'data/source-certification-v0.26.json').read_text())
check(sc.get('version')=='v0.26','source certification version')
check(sc.get('player_stats',{}).get('season_complete_verified')==393,'393 final NBA rows retained')
check(sc.get('player_stats',{}).get('source_backed_projection')==49,'49 projections retained')
check(sc.get('contracts',{}).get('years_of_service',{}).get('certified')==442,'442 YOS retained')
check(sc.get('draft_assets',{}).get('origin_cells')==420,'420 pick cells retained')
check(sc.get('release_readiness',{}).get('save_schema')==25,'schema 25 retained')
pr=sc.get('presentation_readiness',{})
for k in ['dynamic_viewport_units','safe_area_all_edges','modal_focus_trap','modal_focus_restore','modal_inert_when_closed']:
    check(pr.get(k) is True,f'presentation flag {k}')
js=(root/'app.js').read_text()
html=(root/'index.html').read_text()
check("const SAVE_KEY='nbaCourtsideSaveV25'" in js,'v25 save key retained')
check('V0.26 · PRESENTATION CERTIFICATION' in js,'v26 in-game certification copy')
check('aria-hidden="true" inert' in html,'closed sheet inert/aria hidden')
check((root/'docs/PRESENTATION_POLISH_V26.md').exists(),'presentation docs')
check((root/'scripts/test_device_layout_v26.py').exists(),'device QA script')
if errors:
    print('FAIL — v0.26 release certification')
    [print(' -',e) for e in errors]
    sys.exit(1)
print('PASS — v0.26 release certification')
print('  data/CBA/simulation foundation retained from v0.25')
print('  save schema: 25 / nbaCourtsideSaveV25')
print('  player split: 393 final NBA + 49 projections')
print('  presentation: compact-phone + safe-area + modal focus hardening')
