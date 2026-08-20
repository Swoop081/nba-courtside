#!/usr/bin/env python3
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[1]; errors=[]
def ck(x,m):
    if not x: errors.append(m)
sc=json.loads((R/'data/source-certification-v0.29.json').read_text(encoding='utf-8'))
ra=json.loads((R/'data/ratings-certification-v0.29.json').read_text(encoding='utf-8'))
model=json.loads((R/'model/rating-model.json').read_text(encoding='utf-8'))
players=json.loads((R/'data/players-2026-08-19.json').read_text(encoding='utf-8'))
html=(R/'index.html').read_text(encoding='utf-8'); js=(R/'app.js').read_text(encoding='utf-8'); gd=(R/'gameday.js').read_text(encoding='utf-8')
ck(sc.get('version')=='v0.29','source certification version')
ck(sc.get('ratings_foundation',{}).get('status')=='PASS','ratings source certification status')
ck(ra.get('status')=='PASS' and ra.get('players')==442,'ratings certification status')
ck(model.get('version')=='0.29','rating model version')
ck(len(players)==442 and sum(bool(p.get('stats_2025_26')) for p in players)==393,'player population')
ck(ra['distribution']['80_plus']==75 and ra['distribution']['86_plus']==29 and ra['distribution']['90_plus']==8,'certified rating distribution')
ck('V0.29 RATINGS FOUNDATION' in html,'v0.29 main-menu build pill')
ck('V0.29 · RATINGS FOUNDATION + SOURCE CERTIFICATION' in js,'v0.29 in-game certification label')
ck("route.get('continue')==='1'&&userTeam" in js,'v0.28 direct continue retained')
ck('v17SimCpuCupFinal()\n}\nensureNBAProgress();refreshSeasonConfig();' in js,'season-started NBA progress boot call is not safely outside ensureNBAProgress')
ck('href="index.html?continue=1"' in gd,'v0.28 Game Day return retained')
ck("const SAVE_KEY='nbaCourtsideSaveV25'" in js,'save schema key changed')
ck((R/'docs/RATINGS_FOUNDATION_V29.md').exists(),'ratings design doc missing')
ck((R/'docs/VALIDATION_V29.md').exists(),'validation doc missing')
ck((R/'scripts/test_ratings_v29.py').exists(),'ratings regression missing')
ck((R/'scripts/test_projection_runtime_v29.js').exists(),'v0.29 projection runtime regression missing')
ck((R/'data/source-certification.js').read_text(encoding='utf-8').startswith('window.NBA_COURTSIDE_SOURCE_CERT = '),'source certification runtime variable mismatch')
ck((R/'data/v028-nonrating-core-hashes.json').exists(),'non-rating core hash manifest missing')
if errors:
    print('FAIL — v0.29 release certification'); [print(' -',e) for e in errors]; sys.exit(1)
print('PASS — v0.29 release certification')
