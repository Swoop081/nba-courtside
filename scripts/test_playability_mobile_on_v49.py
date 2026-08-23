from pathlib import Path
import re, subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.49.js').read_text()
gd=(ROOT/'gameday-v0.49.js').read_text()
ex=(ROOT/'exhibition-v0.49.js').read_text()
index=(ROOT/'index.html').read_text()
ghtml=(ROOT/'gameday.html').read_text()
ehtml=(ROOT/'exhibition.html').read_text()
checks=[]
def ck(name, cond): checks.append((name,bool(cond)))

# Runtime wiring / compatibility
ck('index loads app-v0.48', 'app-v0.49.js' in index)
ck('gameday loads gameday-v0.48', 'gameday-v0.49.js' in ghtml)
ck('exhibition loads exhibition-v0.48', 'exhibition-v0.49.js' in ehtml)
for html in [index,ghtml,ehtml]:
    for src in re.findall(r'<script[^>]+src="([^"]+)"', html):
        if not src.startswith(('http:','https:')): ck(f'asset exists {src}', (ROOT/src.split('?')[0]).exists())
ck('schema-25 save key retained', "const SAVE_KEY='nbaCourtsideSaveV25'" in app)
ck('v47 history retained', 'leagueHistoryV47' in app)
ck('v46 career retained', 'gmCareerV46' in app)
ck('v45 offseason retained', 'offseasonV45' in app)
ck('v44 deadline retained', 'tradeDeadlineV44' in app)

# Global hierarchy
ck('v48 version marker', "const V48='0.48'" in app)
ck('hierarchy audit exists', 'function v48AuditView()' in app)
ck('explicit hierarchy marker', "presentationOrder='action-context-supporting-detail'" in app)
ck('existing action zone moved first', "root.firstElementChild!==existing)root.prepend(existing)" in app)
ck('home duplicate masthead hidden', 'v48RedundantHomeMasthead' in app and 'display:none!important' in app)
ck('team workspace action destinations precede snapshot', "['team','transactions'].includes(currentView)" in app and 'v42DestinationGrid' in app)
ck('roster rotation promoted', "currentView==='roster'" in app and '.rotationManager' in app)
ck('relations inbox promoted', "currentView==='relations'" in app and '.v36Inbox' in app and "label:'PLAYER DECISION'" in app)
ck('specialist tabs promoted', "['.v40MedTabs','.v40MedicalHero']" in app and "['.v35Tabs','.v35DraftHero']" in app)
ck('trade partner + math promoted', "currentView==='trade'" in app and "#tradeCalc" in app and '.partnerStrip' in app)
ck('free-agent offers prioritized', "currentView==='market'" in app and '.faYourOffers' in app)

# Phase decisions / player actions
ck('option/QO list promoted', '.v45DecisionList' in app and "'CONTRACT OPTIONS':'RIGHTS + QUALIFYING OFFERS'" in app)
ck('cap contract commit actions promoted', '[data-apply-dpe]' in app and '[data-stretch-waiver]' in app)
ck('scouting assignments promoted', '.v35GroupScout' in app and "label:'SCOUTING ASSIGNMENTS'" in app)
ck('draft top choices promoted', 'v48DraftChoices' in app and ".slice(0,3)" in app and 'TOP AVAILABLE · TAP TO DRAFT' in app)
ck('player action block at top', 'v48SheetActions' in app and ':scope > #offerExtension' in app and ':scope > #waivePlayer' in app)
ck('player trade action promoted', ':scope > .profileTradeBoard' in app)
ck('player FA actions promoted', ':scope > #openOffer' in app and ':scope > #renounceRights' in app)

# Mobile/touch rules
ck('primary action touch target 44', '.v441ActionZone button,.v48Audit .v441ActionZone a{min-height:44px}' in app)
ck('mobile one-column destination grid', '@media(max-width:430px)' in app and '.v42DestinationGrid{grid-template-columns:1fr}' in app)
ck('specialist nav sticky', 'position:sticky;top:61px' in app)
ck('mobile workspace explainer compacted', '.v42WorkspaceHead p{display:none}' in app)
ck('player sheet mobile padding', '.sheetContent{padding-left:10px;padding-right:10px}' in app)

# Game Day order
pg=gd[gd.index('function pregameScreen()'):gd.index('function momentCard()')]
ck('gameday Watch before Availability', pg.find('id="watchGame"') < pg.find('Availability'))
ck('gameday Sim before Availability', pg.find('id="simNow"') < pg.find('Availability'))
game=gd[gd.index('function gameScreen()'):]
ck('live controls immediately after scoreboard', game.find('gameDayPrimaryZone livePrimary') < game.find('${momentCard()}'))
ck('live Sim Final present top', 'id="finishGame"' in game[:game.find('${momentCard()}')])
ck('gameday compact mobile hero', '@media(max-width:430px)' in gd and '.gameDayHero' in gd)
ck('gameday sticky live scoreboard', 'position:sticky' in gd and '.scoreboard' in gd)

# Exhibition order
pre=ex[ex.index('function pregameScreen()'):ex.index('function momentCard()')]
ck('exhibition Tip Off before Depth Charts', pre.find('id="tipOff"') < pre.find('Depth Charts'))
exgame=ex[ex.index('function gameScreen()'):]
ck('exhibition live controls before moment', exgame.find('ex48LiveZone') < exgame.find('${momentCard()}'))
ck('exhibition Sim Final in live control zone', exgame.find('id="finishGame"') < exgame.find('${momentCard()}'))
ck('exhibition touch targets', 'min-height:44px' in ex)

# Syntax
for fname in ['app-v0.49.js','gameday-v0.49.js','exhibition-v0.49.js']:
    r=subprocess.run(['node','--check',str(ROOT/fname)],capture_output=True,text=True)
    ck(f'javascript syntax {fname}', r.returncode==0)

bad=[n for n,ok in checks if not ok]
print(f'{len(checks)-len(bad)}/{len(checks)} v0.48 focused checks passed')
for n,ok in checks: print(('PASS' if ok else 'FAIL'), n)
if bad:
    sys.exit(1)
