from pathlib import Path
import json, re, subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.49.js').read_text()
index=(ROOT/'index.html').read_text()
gameday=(ROOT/'gameday.html').read_text()
exhibition=(ROOT/'exhibition.html').read_text()
schedule=(ROOT/'data/schedule-v0.44.js').read_text()
checks=[]
def check(name, ok):
    checks.append((name,bool(ok)))

def has(s): return s in app

check('save key retained', "nbaCourtsideSaveV25" in app)
check('save schema retained', re.search(r"SAVE_SCHEMA\s*=\s*25", app))
check('v44 additive state', 'tradeDeadlineV44' in app and 'version:44' in app)
check('schedule deadline retained', 'trade_deadline":"2027-02-11"' in schedule)
check('four deadline windows', all(x in app for x in ['MORNING CALLS','MIDDAY MARKET','FINAL CALLS','CLOSING BELL']))
check('deadline command center', has('function deadlineCommandCenter44'))
check('deadline heat', has('function deadlineHeat44'))
check('trade stance model', has('function tradeStance44'))
check('buyer stance', "label='BUYER'" in app)
check('seller stance', "label='SELLER'" in app)
check('retool stance', "label='RE-TOOLING'" in app)
check('standing pat stance', "label='STANDING PAT'" in app)
check('trade philosophy model', has('function tradePhilosophy44'))
check('contender philosophy', "label='CONTENDER'" in app)
check('asset collector philosophy', "label='ASSET COLLECTOR'" in app)
check('cap manager philosophy', "label='CAP MANAGER'" in app)
check('core protector philosophy', "label='CORE PROTECTOR'" in app)
check('interest bands', all(x in app for x in ['COLD','EXPLORATORY','INTERESTED','MOTIVATED','AGGRESSIVE']))
check('simulated market disclosure', 'SIMULATED MARKET' in app)
check('incoming GM call context', all(x in app for x in ['WHY THEY CALLED','WHY THESE ASSETS','BIGGEST RESISTANCE','THEIR VALUE READ']))
check('negotiation round state', has('function negotiation44') and 'TALKS COOLED' in app)
check('trade completion screen', 'TRADE<br>COMPLETED.' in app)
check('four trade impact dimensions', all(x in app for x in ['IMMEDIATE VALUE','LONG-TERM VALUE','FINANCIAL IMPACT','FRANCHISE DIRECTION FIT']))
check('transaction ticker', has('function transactionTicker44'))
check('post deadline report', has('function deadlineRecap44') and 'POST-DEADLINE REPORT' in app)
check('advance uses unified blockers', 'v42BlockingActions' in app and 'TRADE DEADLINE DAY' in app)
check('sim week stops at deadline', 'const v44SimWeekPrev=simWeek' in app and 'state.date===DATES.trade_deadline){simNextDay();return}' in app)
check('sim to game stops at deadline', 'const v44SimGamePrev=simToNextGame' in app and 'ng.date>DATES.trade_deadline' in app)
check('deadline windows can move CPU market', 'idx>=1)maybeCpuTrade(state.date)' in app)
check('legacy deadline closure deferred', 'if(date>DATES.trade_deadline&&!S.deadline)' in app and 'if(target>DATES.trade_deadline&&!S.deadline)' in app)
check('v42 action center retained', 'function v42ActionCenter' in app or 'v42ActionCenter=' in app)
check('v43 franchise direction retained', 'function gmEvaluationV43' in app and 'function franchiseDirectionViewV43' in app)
check('trade completion re-syncs gm evaluation', 'syncGMEvaluationV43' in app)
check('no eager v44 init before Initialise', '\ndeadline44();\n\n// Initialise.' not in app)
check('v44 docs exist', (ROOT/'docs/TRADE_DEADLINE_TRANSACTION_PRESENTATION_V44.md').exists() and (ROOT/'docs/VALIDATION_V44.md').exists())
check('v44 cert valid', json.loads((ROOT/'data/trade-deadline-certification-v0.44.json').read_text())['save_schema']==25)
check('main menu v48 branding', 'V0.49 ADVANCED SCOUTING + DRAFT INTELLIGENCE' in index)
check('no stale pinned v43 html', all('v0.43.js' not in x for x in [index,gameday,exhibition]))

for html in [index,gameday,exhibition]:
    for ref in re.findall(r'(?:src|href)="([^"]+)"',html):
        if ref.startswith(('http:','https:','#')): continue
        path=ref.split('?',1)[0]
        if path.endswith(('.js','.css','.html')):
            check(f'asset resolves: {path}', (ROOT/path).exists())

for js in ['app-v0.49.js','cba-v0.44.js','gameday-v0.49.js','exhibition-v0.49.js']:
    r=subprocess.run(['node','--check',str(ROOT/js)],capture_output=True,text=True)
    check(f'node syntax: {js}', r.returncode==0)

failed=[n for n,o in checks if not o]
for n,o in checks: print(('PASS' if o else 'FAIL')+' | '+n)
print(f'\nRESULT: {len(checks)-len(failed)}/{len(checks)} checks passed')
if failed:
    print('FAILED:', *failed, sep='\n- ')
    sys.exit(1)
