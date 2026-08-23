from pathlib import Path
import re, subprocess
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.52.js').read_text(); idx=(ROOT/'index.html').read_text(); gd=(ROOT/'gameday.html').read_text(); ex=(ROOT/'exhibition.html').read_text()
checks=[]
def ck(name, cond): checks.append((name,bool(cond)))
ck('index pins app-v0.52','app-v0.52.js' in idx)
ck('main menu identifies v0.52','V0.52 LEAGUE AI ROSTER-BUILDING' in idx)
ck('gameday v0.52 pin','gameday-v0.52.js' in gd)
ck('exhibition v0.52 pin','exhibition-v0.52.js' in ex)
ck('schema remains 25',"const SAVE_SCHEMA=25" in app and "nbaCourtsideSaveV25" in app)
ck('additive v52 state','state.leagueAiV52' in app and 'version:52' in app)
for token in ['contender','cap_contender','aging_contender','emerging','fringe','retool','rebuild','early_rebuild']:
    ck('state '+token, token+':' in app)
for token in ['BALL HANDLING','SHOOTING','WING DEPTH','RIM PROTECTION','SECONDARY CREATION','CENTER DEPTH']:
    ck('balance '+token, token in app)
for fn in ['teamPlanV52','franchiseStateV52','rosterBalanceV52','cpuCoreScoreV52','cpuFitV52','prospectScoreV52','cpuExtensionSweepV52','leagueAuditV52']:
    ck('function '+fn, ('function '+fn) in app)
ck('draft override','cpuDraftOne=function()' in app and 'prospectScoreV52' in app)
ck('free agency candidates override','faCandidateTeams=function(p)' in app and 'cpuFitV52' in app)
ck('free agency offer gate','faCpuOfferFor=function(p,a,round=1)' in app and 'cpuCanAddSalaryV52' in app)
ck('RFA match intelligence','faCpuMatchRfa=function' in app and 'P.core.includes' in app)
ck('waiver protection','autoTrimCpu=function()' in app and '!P.core.includes' in app)
ck('roster-fill intelligence','autoFillCpu=function()' in app and 'roster-balance addition' in app)
ck('trade plan integration','maybeCpuTrade=function(d)' in app and 'pickPosture' in app and 'cpuTradeCbaCheck' in app)
ck('extension history','extensionHistory' in app and 'cpu_extension_v52' in app)
ck('league audit flags','DEVELOPMENT PATH' in app and 'Second-apron payroll' in app)
ck('front-office UI','LEAGUE AI · MULTI-YEAR PLANS' in app and 'v0.52 CPU ROSTER PLAN' in app)
ck('v51 retained','playerDevelopmentV51' in app and 'developmentFactorsV51' in app)
ck('v50 retained','staffCoachingV50' in app)
ck('v49 retained','draftIntelligenceV49' in app)
for f in ['app-v0.52.js','gameday-v0.52.js','exhibition-v0.52.js','cba-v0.44.js']:
    r=subprocess.run(['node','--check',str(ROOT/f)],capture_output=True,text=True)
    ck('syntax '+f,r.returncode==0)
failed=[n for n,v in checks if not v]
print(f'{len(checks)-len(failed)}/{len(checks)} checks passed')
if failed:
    print('\n'.join('FAIL '+x for x in failed)); raise SystemExit(1)
