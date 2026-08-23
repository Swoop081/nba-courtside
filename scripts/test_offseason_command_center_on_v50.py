from pathlib import Path
import json, re, subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.50.js').read_text()
index=(ROOT/'index.html').read_text()
game=(ROOT/'gameday.html').read_text()
ex=(ROOT/'exhibition.html').read_text()
checks=[]
def ck(name, cond): checks.append((name,bool(cond)))

# Release/runtime pins
ck('v45 branding', 'V0.50 STAFF, COACHING + ORGANIZATIONAL IDENTITY' in index)
ck('v45 app pin', 'app-v0.50.js' in index)
ck('v45 gameday pin', 'gameday-v0.50.js' in game)
ck('v45 exhibition pin', 'exhibition-v0.50.js' in ex)
ck('exhibition query v45', "exhibition.html?v=0.50" in index)
ck('formal save key retained', 'nbaCourtsideSaveV25' in app)
ck('formal schema remains 25', 'const SAVE_SCHEMA=25;' in app)
ck('v45 additive state', 'state.offseasonV45' in app)
ck('v45 history archive', 'state.offseasonHistoryV45' in app)

# Guided offseason phases
for phase in ['offseason_options','lottery','scouting','draft','qualifying_offers','free_agency','summer_league','training_camp']:
    ck('phase '+phase, phase in app)
for label in ['OPTIONS','LOTTERY','SCOUT + COMBINE','DRAFT','RIGHTS + QO','FREE AGENCY','SUMMER LEAGUE','TRAINING CAMP']:
    ck('timeline '+label, label in app)
ck('eight step timeline', 'n+1}</i><span>${s}</span>' in app and '/8</small>' in app)
ck('command center', 'function offseasonCommandCenterV45' in app)
ck('next checkpoint', 'Next checkpoint' in app)
ck('roster metric', '<span>ROSTER</span>' in app)
ck('cap metric', '<span>CAP STATUS</span>' in app)
ck('draft capital metric', '<span>TRADEABLE 1STS</span>' in app)
ck('team needs metric', '<span>TEAM NEEDS</span>' in app)

# Options / rights gates
ck('team option setup', 'function setupOptionGateV45' in app)
ck('team option resolution', 'function resolveTeamOptionV45' in app)
ck('team option pending list', 'function pendingOptionsV45' in app)
ck('player option outcomes', 'playerOptionOutcomes' in app)
ck('continue to lottery', 'CONTINUE TO LOTTERY NIGHT' in app)
ck('rights seeds', 'rightsSeeds' in app)
ck('qo decisions', 'qoDecisions' in app)
ck('qo gate', 'function qualifyingOffersViewV45' in app)
ck('qo resolve', 'function resolveQOV45' in app)
ck('open free agency', 'function openFreeAgencyV45' in app and 'OPEN FREE AGENCY' in app)
ck('retained UFA rights', 'Retained UFA Rights' in app)
ck('draft routes to rights gate', "state.phase='qualifying_offers'" in app)

# FA / Summer League / Camp
ck('fa completion routes to summer', 'ENTER SUMMER LEAGUE' in app)
ck('summer league view', 'function summerLeagueViewV45' in app)
ck('summer league bridge retained', 'runSummerLeagueV37' in app)
ck('training camp handoff', 'function enterTrainingCampV45' in app)
ck('opening night next checkpoint', 'Opening Night' in app)
ck('offseason recap', 'function offseasonRecapV45' in app)
ck('recap drafted', 'DRAFTED' in app)
ck('recap added', 'ADDED' in app)
ck('recap lost', 'LOST' in app)
ck('recap payroll', 'PAYROLL' in app)
ck('history archived on next season', 'completedDate=state.date' in app and 'state.offseasonHistoryV45.unshift' in app)

# Action-first hierarchy integration
ck('v441 primary action zone retained', 'v441ActionZone' in app)
ck('v441 promoter retained', 'function promotePrimaryActionsV441' in app)
ck('option CTA promoted', "'continueOffseasonV45'" in app)
ck('FA CTA promoted', "'openFreeAgencyV45'" in app)
ck('summer CTA promoted', "'runSummerLeagueV37'" in app)
ck('camp CTA promoted', "'enterTrainingCampV45'" in app)
ck('option blockers in action center', 'v45-option-' in app and 'blocking:true' in app)
ck('qo blockers in action center', 'v45-qo-' in app)

# Retained systems
ck('v44 deadline state retained', 'state.tradeDeadlineV44' in app)
ck('v44 deadline command center retained', 'function deadlineCommandCenter44' in app)
ck('v44 four deadline windows retained', all(x in app for x in ['MORNING CALLS','MIDDAY MARKET','FINAL CALLS','CLOSING BELL']))
ck('v43 franchise direction retained', 'state.franchiseDirection' in app and 'franchiseDirectionViewV43' in app)
ck('v43 GM evaluation retained', 'syncGMEvaluationV43' in app)
ck('v42 action center retained', 'v42ActionItems' in app)
ck('schema migration machinery retained', 'saveMigration' in app or 'migrate' in app.lower())

# Runtime assets exist
for f in ['app-v0.50.js','gameday-v0.50.js','exhibition-v0.50.js','cba-v0.44.js']:
    ck('asset exists '+f, (ROOT/f).exists())

passed=sum(v for _,v in checks)
for n,v in checks: print(('PASS' if v else 'FAIL')+' | '+n)
print(f'\nRESULT: {passed}/{len(checks)} checks passed')
if passed!=len(checks):
    print('FAILED:')
    for n,v in checks:
        if not v: print('- '+n)
    sys.exit(1)
