#!/usr/bin/env python3
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]
errors=[]
def check(cond,msg):
    if not cond: errors.append(msg)
sc=json.loads((root/'data/source-certification-v0.27.json').read_text())
check(sc.get('version')=='v0.27','source certification version')
check(sc.get('player_stats',{}).get('season_complete_verified')==393,'393 final NBA rows retained')
check(sc.get('player_stats',{}).get('source_backed_projection')==49,'49 projections retained')
check(sc.get('contracts',{}).get('years_of_service',{}).get('certified')==442,'442 YOS retained')
check(sc.get('draft_assets',{}).get('origin_cells')==420,'420 pick cells retained')
check(sc.get('release_readiness',{}).get('save_schema')==25,'schema 25 retained')
pr=sc.get('presentation_readiness',{})
for k in ['dynamic_viewport_units','safe_area_all_edges','modal_focus_trap','modal_focus_restore','modal_inert_when_closed','main_menu','team_select_separate_screen','non_destructive_menu_return','boot_markup_escape_repair','storage_access_fallback','gameday_schema25_handoff']:
    check(pr.get(k) is True,f'presentation flag {k}')
html=(root/'index.html').read_text(); js=(root/'app.js').read_text(); gd=(root/'gameday.js').read_text()
check('V0.27 · MAIN MENU + BOOT CERTIFICATION' in js,'v0.27 in-game certification copy')
check('id="mainMenuPanel"' in html,'main menu markup')
check('\\n<style' not in html,'escaped-newline style artifact removed')
check("const SAVE_KEY='nbaCourtsideSaveV25'" in js,'schema-25 franchise save key retained')
check("const SAVE_KEY='nbaCourtsideSaveV25',SAVE_SCHEMA=25" in gd,'schema-25 Game Day handoff')
check((root/'docs/MAIN_MENU_BOOT_V27.md').exists(),'v0.27 docs')
check((root/'scripts/test_main_menu_v27.py').exists(),'v0.27 boot test')
if errors:
    print('FAIL — v0.27 release certification')
    [print(' -',e) for e in errors]
    sys.exit(1)
print('PASS — v0.27 release certification')
print('  real Main Menu + separate team selection')
print('  escaped-newline boot artifact removed')
print('  storage boot guard + schema-25 cross-mode handoff')
print('  v0.26 basketball/data/CBA baseline retained')
