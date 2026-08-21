#!/usr/bin/env python3
from pathlib import Path
import re,sys,json
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.38.js').read_text(encoding='utf-8'); idx=(ROOT/'index.html').read_text(encoding='utf-8')
errors=[]
def ck(v,msg):
    if not v: errors.append(msg)
markers=['state.staffCareers','version:38','function staff38','function teamStaffV38','function staffSecurityV38','function coachFitV38','function fireStaffV38','function hireStaffV38','function staffCandidatePoolV38','function interviewStaffV38','function evaluateStaffV38','function processStaffOffseasonV38','function staffViewV38','BUILD THE<br>ORGANIZATION.','COACHING MARKET','FRONT-OFFICE MARKET','SIMULATED ORGANIZATION MODEL','const v38MetricsBase=metrics','const v38AdvancePrev=advanceTo','const v38OffseasonPrev=beginOffseason']
for x in markers: ck(x in app,'missing marker: '+x)
ck((ROOT/'data/staff-careers-v0.38.js').exists(),'missing staff careers config')
ck('V0.38 STAFF CAREERS' in idx,'menu v0.38 badge missing')
expected={
'index.html':['data/data-v0.38.js','data/source-certification-v0.38.js','data/future-pick-ledger-v0.38.js','data/schedule-v0.38.js','data/schedule-template-v0.38.js','cba-v0.38.js','data/organizations-v0.38.js','data/staff-careers-v0.38.js','data/g-league-v0.38.js','data/college-draft-v0.38.js','app-v0.38.js'],
'gameday.html':['data/data-v0.38.js','data/schedule-v0.38.js','data/schedule-template-v0.38.js','gameday-v0.38.js'],
'exhibition.html':['data/data-v0.38.js','exhibition-v0.38.js']}
for page,refs in expected.items():
    text=(ROOT/page).read_text(encoding='utf-8'); srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    ck(srcs==refs,f'{page} exact v0.38 runtime order: {srcs}')
    ck(not any('v0.37' in x for x in srcs),f'{page} stale v0.37 runtime URL')
    for ref in refs: ck((ROOT/ref).exists(),f'missing runtime asset {ref}')
ck('index.html?continue=1&v=0.38' in (ROOT/'gameday-v0.38.js').read_text(),'Game Day return route v0.38')
ck('index.html?v=0.38' in (ROOT/'exhibition-v0.38.js').read_text(),'Exhibition return route v0.38')
if errors:
    print(f'FAIL — v0.38 Staff Careers certification ({len(errors)} issues)')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PASS — v0.38 Staff Careers + Coaching Market static certification')
print(json.dumps({'release':'v0.38','save_schema':25,'staff_state_version':38,'organizations':30,'coach_rating_dimensions':7,'executive_rating_dimensions':7,'staff_contracts':'simulated_gameplay','real_identity_seed':'organizations-v0.38'},indent=2))
