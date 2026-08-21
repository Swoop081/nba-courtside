#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
idx=(root/'index.html').read_text()
app=(root/'app-v0.42.js').read_text()
assert 'V0.42 NAVIGATION + PRESENTATION' in idx
for label,view in [('HOME','home'),('TEAM','team'),('LEAGUE','league'),('DEALS','transactions'),('MORE','more')]:
    needle=f'data-view="{view}"'
    assert needle in idx,(label,needle)
for old in ['data-view="roster"><b>◉</b>ROSTER','data-view="market"><b>＋</b>MARKET','data-view="trade"><b>⇄</b>TRADE']:
    assert old not in idx,old
for fn in ['v42TeamHub','v42TransactionsHub','v42MoreView','v42ActionItems','v42BlockingActions','v42SearchIndex','v42PrimaryFor','updateNavigationV42']:
    assert f'function {fn}' in app,fn
for route in ['relations','medical','staff','cap','trade','market','gleague','events','college']:
    assert f'data-jump="{route}"' in app,route
assert 'UNIVERSAL GM INBOX' in app
assert 'GLOBAL SEARCH' in app
assert "replace(/v=0\\.\\d+/g,'v=0.42')" in app
assert 'state.ui42' in app and 'version:42' in app
# Core save schema intentionally unchanged.
assert "const SAVE_KEY='nbaCourtsideSaveV25'" in app
assert 'const SAVE_SCHEMA=25' in app
# Mobile consolidation / safe-area requirements.
for token in ['@media(max-width:430px)','env(safe-area-inset-left)','env(safe-area-inset-right)','max-height:48svh']:
    assert token in app,token
# Release-specific cache URLs at every entry point.
checks={
 'index.html':['data/data-v0.42.js','cba-v0.42.js','data/organizations-v0.42.js','data/staff-careers-v0.42.js','app-v0.42.js'],
 'gameday.html':['data/data-v0.42.js','data/schedule-v0.42.js','data/organizations-v0.42.js','data/staff-careers-v0.42.js','gameday-v0.42.js'],
 'exhibition.html':['data/data-v0.42.js','exhibition-v0.42.js'],
}
for f,needles in checks.items():
    text=(root/f).read_text()
    for n in needles: assert n in text,(f,n)
    assert 'v0.41.js' not in text,f
for f in ['app','cba','exhibition','gameday']:
    assert (root/f'{f}-v0.42.js').exists(),f
    assert (root/f'{f}.js').read_bytes()==(root/f'{f}-v0.42.js').read_bytes(),f
print({'status':'PASS','release':'v0.42','primary_nav':['HOME','TEAM','LEAGUE','DEALS','MORE'],'action_center':True,'global_search':True,'save_schema':25})
