#!/usr/bin/env python3
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
sc=json.load(open(ROOT/'data/source-certification-v0.19.json'))
pc=json.load(open(ROOT/'data/certification-v0.19.json'))
gd=json.load(open(ROOT/'data/gameday-calibration-v0.19.json'))
qs=json.load(open(ROOT/'data/simulation-calibration-v0.19.json'))
app=(ROOT/'app.js').read_text(encoding='utf-8'); game=(ROOT/'gameday.js').read_text(encoding='utf-8')
checks=[];errors=[]
def ok(name,c,detail=''):
 checks.append({'name':name,'status':'PASS' if c else 'FAIL','detail':detail})
 if not c: errors.append(name+(': '+detail if detail else ''))
ps=sc.get('player_stats',{});ct=sc.get('contracts',{});da=sc.get('draft_assets',{})
ok('v0.19 source certification manifest',sc.get('version')=='v0.19',str(sc.get('version')))
ok('392 final player rows',ps.get('season_complete_verified')==392,str(ps))
ok('zero bootstrap-hybrid rows',ps.get('bootstrap_hybrid')==0,str(ps.get('bootstrap_hybrid')))
ok('50 projection rows',ps.get('projection')==50,str(ps.get('projection')))
ok('442 contract structures retained',ct.get('structure_certified')==442,str(ct.get('structure_certified')))
ok('420 future-pick cells retained',da.get('origin_cells')==420,str(da.get('origin_cells')))
ok('complex pick lock count retained',da.get('complex_or_locked')==223,str(da.get('complex_or_locked')))
ok('v0.18 save schema intentionally retained',"nbaCourtsideSaveV18" in app and "nbaCourtsideSaveV18" in game,'static-data pass; no franchise-state schema change')
ok('v0.19 source panel', 'V0.19 · FINAL PLAYER DATA' in app,'')
ok('obsolete bootstrap UI notice removed','Ratings still use the calibrated full bootstrap population' not in app,'')
ok('player data certification pass',pc.get('status')=='PASS','')
mx=max(abs(x['delta_pct']) for x in gd['comparison_to_final_2025_26'].values())
ok('detailed Game Day calibration <= 2.5% max category delta',mx<=2.5,f'{mx:.2f}%')
ok('detailed scoring within 0.5% target',abs(gd['comparison_to_final_2025_26']['pts']['delta_pct'])<=.5,str(gd['comparison_to_final_2025_26']['pts']))
ok('detailed box/minute integrity',gd['box_score_point_errors']==0 and gd['rotation_minute_errors']==0,'')
ok('quick sim scoring within 1% final target',abs(qs['metrics']['team_ppg']-pc['final_2025_26_team_targets']['pts'])/pc['final_2025_26_team_targets']['pts']<=.01,f"{qs['metrics']['team_ppg']:.3f} vs {pc['final_2025_26_team_targets']['pts']:.3f}")
out={'version':'v0.19','date':'2026-08-20','status':'PASS' if not errors else 'FAIL','checks':checks,'errors':errors}
(ROOT/'data/source-certification-v0.19-audit.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
raise SystemExit(1 if errors else 0)
