#!/usr/bin/env python3
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parents[1]; errors=[]
def check(x,m):
    if not x: errors.append(m)
sc=json.loads((root/'data/source-certification-v0.28.json').read_text())
js=(root/'app.js').read_text(); gd=(root/'gameday.js').read_text(); html=(root/'index.html').read_text()
check(sc.get('version')=='v0.28','source certification version')
check('V0.28 · POSTGAME RESUME + BOOT CERTIFICATION' in js,'in-game v0.28 certification copy')
check('V0.28 POSTGAME RESUME' in html,'main menu v0.28 build pill')
check('ensureNBAProgress();refreshSeasonConfig();' in js,'deferred NBA progress initialization missing')
check(js.index('const V17_CUP_GROUP_GAMES') < js.index('ensureNBAProgress();refreshSeasonConfig();'),'NBA progress still initializes before Cup constants')
check("route.get('continue')==='1'&&userTeam" in js,'direct continue route missing')
check('href="index.html?continue=1"' in gd,'Game Day direct GM-office return missing')
check((root/'scripts/test_postgame_resume_v28.js').exists(),'postgame regression missing')
check((root/'docs/POSTGAME_RESUME_V28.md').exists(),'v0.28 root-cause doc missing')
if errors:
    print('FAIL — v0.28 release certification'); [print(' -',e) for e in errors]; sys.exit(1)
print('PASS — v0.28 release certification')
