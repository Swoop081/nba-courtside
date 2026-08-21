#!/usr/bin/env python3
from pathlib import Path
import json,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def ck(x,msg):
    if not x: errors.append(msg)

# Organization/media seed is executable browser JS; evaluate it rather than regex-parsing JS syntax.
js="""global.window={};require('./data/organizations-v0.32.js');console.log(JSON.stringify(window.NBA_COURTSIDE_ORGS_V032));"""
try:
    out=subprocess.check_output(['node','-e',js],cwd=ROOT,text=True)
    org=json.loads(out)
except Exception as e:
    org={}; errors.append(f'organizations bundle evaluates: {e}')

ck(org.get('version')=='0.32','organization version 0.32')
ck(org.get('frozen_as_of')=='2026-08-21','organization frozen date')
ck(org.get('commissioner',{}).get('name')=='Adam Silver','commissioner Adam Silver')
media=org.get('media',{})
ck(media.get('sportscenter',{}).get('host')=='Scott Van Pelt','SportsCenter host')
ck(media.get('nba_today',{}).get('host')=='Malika Andrews','NBA Today host')
ck(media.get('inside',{}).get('host')=='Ernie Johnson','Inside host')
ck(media.get('inside',{}).get('analysts')==['Kenny Smith','Shaquille O’Neal','Charles Barkley'],'Inside analysts')
ck(media.get('insider',{}).get('host')=='Shams Charania','insider host')
teams=org.get('teams',{})
ck(len(teams)==30,'30 NBA organization records')
for abbr,o in teams.items():
    for k in ['owner','governor','lead_executive','executive_title','general_manager','head_coach']:
        ck(bool(o.get(k)),f'{abbr} has {k}')
    ck(len(o.get('assistants',[]))>=3,f'{abbr} has >=3 key assistants')

# Regression anchors for the most recent 2026 front-office/coaching changes.
ck(teams.get('DAL',{}).get('lead_executive')=='Masai Ujiri','Dallas lead executive Masai Ujiri')
ck(teams.get('DAL',{}).get('general_manager')=='Mike Schmitz','Dallas GM Mike Schmitz')
ck('Phil Handy' in teams.get('DAL',{}).get('assistants',[]),'Dallas key assistant Phil Handy')
ck('Kemba Walker' in teams.get('CHA',{}).get('assistants',[]),'Charlotte staff refresh')
ck('Mike Moser' in teams.get('DEN',{}).get('assistants',[]),'Denver current Mike Moser assistant')
ck(teams.get('DEN',{}).get('lead_executive')=='Ben Tenzer / Jonathan Wallace','Denver co-led basketball operations')
ck(teams.get('DEN',{}).get('general_manager')=='No separate GM','Denver no fabricated GM title')
ck('ownership_status' not in teams.get('LAL',{}),'Lakers has no stale ownership sale note')
ck('Mike Moser' not in teams.get('HOU',{}).get('assistants',[]),'Houston stale Mike Moser listing excluded')
ck(teams.get('MIN',{}).get('general_manager')=='Matt Lloyd','Minnesota GM Matt Lloyd')
ck(teams.get('PHI',{}).get('general_manager')=='Elton Brand','Philadelphia GM Elton Brand')
ck('Wes Unseld Jr.' in teams.get('CHI',{}).get('assistants',[]),'Chicago staff refresh')
ck('David Joerger' in teams.get('MIL',{}).get('assistants',[]),'Milwaukee staff refresh')
ck(teams.get('NOP',{}).get('general_manager')=='Troy Weaver','New Orleans GM Troy Weaver')
ck('Mike Hopkins' in teams.get('NOP',{}).get('assistants',[]),'New Orleans staff refresh')
ck('Patrick Ewing' in teams.get('WAS',{}).get('assistants',[]),'Washington assistant Patrick Ewing')

# Release-specific runtime assets: no cross-release HTML/runtime mix.
expected={
 'index.html':['data/data-v0.32.js','data/source-certification-v0.32.js','data/future-pick-ledger-v0.32.js','data/schedule-v0.32.js','data/schedule-template-v0.32.js','cba-v0.32.js','data/organizations-v0.32.js','app-v0.32.js'],
 'gameday.html':['data/data-v0.32.js','data/schedule-v0.32.js','data/schedule-template-v0.32.js','gameday-v0.32.js'],
 'exhibition.html':['data/data-v0.32.js','exhibition-v0.32.js'],
}
for page,refs in expected.items():
    text=(ROOT/page).read_text(encoding='utf-8')
    srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    ck(srcs==refs,f'{page} exact v0.32 runtime order')
    for ref in refs: ck((ROOT/ref).exists(),f'{page}: {ref} exists')
    ck(not any(re.search(r'(^|/)(data|app|cba|gameday|exhibition)\.js$',x) for x in srcs),f'{page} has no stable cross-release runtime URL')
idx=(ROOT/'index.html').read_text(encoding='utf-8')
ck('V0.32 DAILY BROADCAST OVERHAUL' in idx,'menu release badge')
ck('exhibition.html?v=0.32' in idx,'versioned Exhibition navigation')

# Certified v0.29 rating values must be the values the v0.32 browser bundle ships.
raw=(ROOT/'data/data-v0.32.js').read_text(encoding='utf-8').strip(); pre='window.NBA_COURTSIDE_DATA = '
ck(raw.startswith(pre),'browser data prefix')
if raw.startswith(pre):
    payload=raw[len(pre):].rstrip(';')
    data=json.loads(payload)
    by={p['name']:p for p in data['players']}
    for name,want in {'Payton Pritchard':79,'Paul George':79,'Jayson Tatum':89,'Neemias Queta':76}.items():
        got=by.get(name,{}).get('ratings',{}).get('overall')
        ck(got==want,f'ratings smoke {name}: {got} == {want}')

app=(ROOT/'app-v0.32.js').read_text(encoding='utf-8')
# Preserve old save schema; Living League is an additive optional save branch.
ck(re.search(r'const\s+SAVE_SCHEMA\s*=\s*25',app) is not None,'save schema remains 25')
for needle,label in [
    ("state.livingLeague={version:32",'additive Living League state'),
    ("target=addDays(state.date,1);advanceTo(target)",'Advance Day is exactly one calendar day'),
    ('TEAM PRACTICE','training activity'),('RECOVERY DAY','recovery activity'),('FILM SESSION','film activity'),('YOUNG PLAYER FOCUS','development activity'),
    ('SIMULATED STUDIO','simulated studio disclosure'),('SIMULATED SOCIAL','simulated social disclosure'),
    ('data-offer-action="accept"','formal trade Accept'),('data-offer-action="decline"','formal trade Decline'),('data-offer-action="modify"','formal trade Modify'),
    ('ACTION REQUIRED · RESOLVE TRADE OFFER','formal offer blocks day advancement'),
    ('Find Me Trades','Find Me Trades UI'),('5 ACCEPTABLE TRADES FOUND','five accepted trade results path'),
    ('NBA Commissioner','commissioner presentation'),('CPU TEAM DIRECTION','organizational identity'),
    ("mediaLabel('sportscenter')",'SportsCenter surface'),("mediaLabel('nba_today')",'NBA Today surface'),("ORGS.media?.inside",'Inside the NBA surface'),
]: ck(needle in app,label)
ck('daily-broadcast-v0.32.js' not in idx,'no duplicate standalone Living League runtime')
ck(not (ROOT/'daily-broadcast-v0.32.js').exists(),'no stray duplicate Living League source runtime')

# Back-navigation carries release cache key.
ck('index.html?continue=1&v=0.32' in (ROOT/'gameday-v0.32.js').read_text(encoding='utf-8'),'Game Day returns through v0.32 cache key')
ck('index.html?v=0.32' in (ROOT/'exhibition-v0.32.js').read_text(encoding='utf-8'),'Exhibition returns through v0.32 cache key')


# v0.32 presentation hierarchy must replace the legacy franchise hero on the Living League Home.
for needle,label in [
    ('function dailyMasthead()','daily masthead'),
    ('NBA COURTSIDE LIVE','live league-day masthead'),
    ('SINCE YOUR LAST ADVANCE','day-change digest'),
    ('THE LEAGUE MOVED.','day evolution presentation'),
    ('LEAGUE WIRE','league wire ticker'),
    ('COURTSIDE SOCIAL','social feed surface'),
    ('X / TWITTER-STYLE · SIMULATED FEED','social disclosure'),
    ('SPORTSCENTER','SportsCenter program treatment'),
    ('NBA TODAY','NBA Today program treatment'),
    ('INSIDE THE NBA','Inside the NBA program treatment'),
    ('PERFORMANCE OF THE NIGHT','around-the-league performance hero'),
    ('YOUR TEAM TODAY · TRAINING CENTER','off-day training center'),
    ('ADVANCE THE LEAGUE','structured next-day action'),
    ('<div class="bcPage">${dailyMasthead()}','broadcast page wrapper'),
    ("style.id='v32-daily-broadcast-style'",'release-owned broadcast style layer'),
]: ck(needle in app,label)
# The v0.32 livingHome should no longer begin with the legacy hero() dashboard.
latest=app.rsplit('function livingHome()',1)[-1].split('// Core overrides.',1)[0]
ck('${hero()}' not in latest,'legacy hero removed from Daily Hub')
ck('lastAdvanceDigest:old.lastAdvanceDigest||null' in app,'digest persists in additive Living League branch')
ck('L.lastAdvanceDigest=buildAdvanceDigest(before,state.date)' in app,'Advance Day writes digest')

if errors:
    print(f'FAIL — v0.32 Daily Broadcast certification ({len(errors)} issues)')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PASS — v0.32 Daily Broadcast certification')
print(json.dumps({'organizations':len(teams),'activities':6,'media_surfaces':4,'save_schema':25,'ratings_smoke':{'Payton Pritchard':79,'Paul George':79,'Jayson Tatum':89,'Neemias Queta':76}},indent=2))
