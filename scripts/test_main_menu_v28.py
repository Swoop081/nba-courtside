#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
errors=[]
def check(cond,msg):
    if not cond: errors.append(msg)
html=(root/'index.html').read_text(encoding='utf-8')
js=(root/'app.js').read_text(encoding='utf-8')
gd=(root/'gameday.js').read_text(encoding='utf-8')
ex=(root/'exhibition.js').read_text(encoding='utf-8')
check('id="mainMenuPanel"' in html,'main menu panel missing')
check('id="continueFranchise"' in html,'continue route missing')
check('id="newFranchise"' in html,'new franchise route missing')
check('href="exhibition.html"' in html,'exhibition route missing')
check('id="teamSelectPanel" class="hidden"' in html,'team selection is not a separate hidden screen')
check('\\n<style id="v14-postseason">' not in html,'literal escaped newline remains before v14 style')
check('</style>\\n' not in html,'literal escaped newline remains after style')
check(html.index('</head>') < html.index('<body>'),'document head/body order invalid')
check('function showMainMenu()' in js and 'function showTeamSelect()' in js,'main-menu routing helpers missing')
check("$('#changeTeam').onclick=leaveGameToMenu" in js,'franchise header does not return to menu')
check("route.get('continue')==='1'&&userTeam" in js,'direct postgame continue route missing')
check("route.get('new')==='1'" in js,'direct new-franchise route missing')
check("const SAVE_KEY='nbaCourtsideSaveV25'" in js,'franchise save key changed')
check("const SAVE_KEY='nbaCourtsideSaveV25',SAVE_SCHEMA=25" in gd,'Game Day does not use schema-25 save')
check("'nbaCourtsideSaveV25'" in ex,'Exhibition does not prefer v25 saves')
# Direct storage use should be confined to guarded helper implementations.
check('localStorage.getItem(' not in js,'unguarded localStorage.getItem remains in franchise app')
check('localStorage.setItem(' not in js,'unguarded localStorage.setItem remains in franchise app')
if errors:
    print('FAIL — v0.28 main-menu/boot audit')
    [print(' -',e) for e in errors]
    sys.exit(1)
print('PASS — v0.28 main-menu/boot audit')
