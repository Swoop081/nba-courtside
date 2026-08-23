from pathlib import Path
root=Path(__file__).resolve().parents[1]
app=(root/'app-v0.57.js').read_text()
idx=(root/'index.html').read_text()
checks=[]
def ck(name,cond):
    checks.append((name,bool(cond)))
ck('index loads v57', 'app-v0.57.js' in idx)
ck('advance CTA promoted', 'ADVANCE 1 DAY' in app and 'v57PrimaryAdvance' in app)
ck('advance stays on simDay handler', 'id="simDay" aria-label="Advance the league one day"' in app)
ck('off-day training explicitly optional', 'Training never blocks the calendar.' in app and '>OPTIONAL PLAN</b>' in app)
ck('next game essential card', 'function v57NextGameCard()' in app and 'class="v57NextGame"' in app)
ck('casual-first order contract', "primary-action-essential-context-broad-context-deep-dive" in app)
ck('development demoted', "'.v51DevelopmentWatch'" in app and 'FRANCHISE DEEP DIVE' in app)
ck('mobile high contrast CTA', 'background:#c8ff16!important' in app and 'min-height:54px' in app)
# Daily activity must remain optional: simNextDay blocker path is GM-decision based, not activeDailyAction based.
sim=app[app.find('const oldSimDay=simNextDay'):app.find('const oldSimWeek=simWeek') if app.find('const oldSimWeek=simWeek')!=-1 else app.find('const oldInjuryRisk=injuryRisk')]
ck('daily training is not an advance blocker', 'activeDailyAction' not in sim and 'formalPending' in sim)
failed=[n for n,v in checks if not v]
for n,v in checks: print(('PASS' if v else 'FAIL'),n)
if failed: raise SystemExit('Failed: '+', '.join(failed))
print(f'PASS {len(checks)}/{len(checks)} v0.57 hierarchy checks')
