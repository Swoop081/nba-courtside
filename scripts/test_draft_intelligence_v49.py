from pathlib import Path
import re, subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.49.js').read_text(); index=(ROOT/'index.html').read_text(); gd=(ROOT/'gameday.html').read_text(); ex=(ROOT/'exhibition.html').read_text()
checks=[]
def ck(n,c): checks.append((n,bool(c)))
ck('index pins v049 app','app-v0.49.js' in index)
ck('gameday pins v049','gameday-v0.49.js' in gd)
ck('exhibition pins v049','exhibition-v0.49.js' in ex)
ck('schema 25 retained',"const SAVE_KEY='nbaCourtsideSaveV25'" in app)
ck('v049 marker',"const V49='0.49'" in app)
ck('additive intelligence state','draftIntelligenceV49' in app)
ck('confidence model','function v49Confidence(' in app and "confidenceLabel" in app)
ck('uncertainty estimator','function v49Estimate(' in app and 'ou=Math.max(2' in app)
ck('full scouting remains ranged','Exact OVR and potential remain hidden from the GM.' in app)
ck('season scouting carryover','collegeCarryover' in app and 'seasonCarryover:true' in app)
ck('simulated interviews','function v49InterviewProspect' in app and 'SIMULATED INTERVIEW' in app)
ck('private workout retained','data-workout-one' in app)
ck('scouting plans','data-v49-scout-plan' in app and 'TOP BOARD' in app and 'TEAM NEED' in app and 'UPSIDE' in app and 'VALUE' in app)
ck('fit model','function v49SchemeFit' in app and 'TEAM FIT' in app)
ck('development volatility','v49ProspectRisk' in app and 'VOLATILITY' in app)
ck('consensus range','function v49ConsensusRank' in app and 'CONSENSUS' in app)
ck('market intelligence','function v49InterestTeams' in app and 'SIMULATED LEAGUE INTEL.' in app)
ck('front office recommendation','function v49RecommendationList' in app and 'FRONT OFFICE RECOMMENDATION' in app)
ck('draft action zone first','v441ActionZone v49DraftDecision' in app)
ck('no legacy exact OVR on v049 draft cards','<span>OVR</span>' not in app[app.rfind('draftHome=function()'):app.find('const v49UserDraftPrev',app.rfind('draftHome=function()'))])
ck('draft decision snapshots','selectionSnapshots' in app and 'ovrRange:[r.ovrLow,r.ovrHigh]' in app)
ck('college intelligence tab','data-college-tab="intel"' in app and 'FRONT OFFICE DRAFT INTELLIGENCE' in app)
ck('simulation boundary','Source-backed prospect identity data remains separate' in app)
ck('v048 presentation retained','function v48AuditView()' in app and 'presentationOrder=\'action-context-supporting-detail\'' in app)
ck('v047 history retained','leagueHistoryV47' in app)
ck('v046 career retained','gmCareerV46' in app)
ck('v045 offseason retained','offseasonV45' in app)
ck('v044 deadline retained','tradeDeadlineV44' in app)
for html in [index,gd,ex]:
    for src in re.findall(r'<script[^>]+src="([^"]+)"',html):
        if not src.startswith(('http:','https:')): ck(f'asset exists {src}',(ROOT/src.split('?')[0]).exists())
for f in ['app-v0.49.js','gameday-v0.49.js','exhibition-v0.49.js']:
    r=subprocess.run(['node','--check',str(ROOT/f)],capture_output=True,text=True); ck(f'js syntax {f}',r.returncode==0)
bad=[n for n,v in checks if not v]
print(f'{len(checks)-len(bad)}/{len(checks)} v0.49 focused checks passed')
for n,v in checks: print(('PASS' if v else 'FAIL'),n)
if bad: sys.exit(1)
