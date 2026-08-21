#!/usr/bin/env python3
from pathlib import Path
import json,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def ck(x,msg):
    if not x: errors.append(msg)

app=(ROOT/'app-v0.33.js').read_text(encoding='utf-8')
idx=(ROOT/'index.html').read_text(encoding='utf-8')
ck(re.search(r'const\s+SAVE_SCHEMA\s*=\s*25',app) is not None,'save schema remains 25')
for needle,label in [
    ("state.livingLeague={",'Living League migration exists'),('version:33','Living League v33'),
    ('V33_FO_ARCHETYPES','front-office archetypes'),('AGGRESSIVE TRADER','aggressive GM model'),('PICK HOARDER','pick-hoarder GM model'),('CAP CONSCIOUS','cap-conscious GM model'),('DEVELOPMENT FIRST','development GM model'),
    ("label='CONTENDER'",'contender direction'),("label='PLAYOFF PUSH'",'playoff-push direction'),("label='COMPETITIVE'",'competitive direction'),("label='RETOOLING'",'retool direction'),("label='REBUILDING'",'rebuild direction'),("label='DEVELOPMENT'",'development direction'),
    ('OWNER DIRECTIVE','owner directive presentation'),('COACH MODEL · SIMULATED','coach model presentation'),('syncCpuCoachPlanV33','coach rotation integration'),
    ('TRADE DEADLINE DESK · SIMULATED','deadline desk'),('leagueRumors','league rumors'),('maybeCpuTrade=function','active CPU trade routine'),('teamTradeDates','per-team trade cooldowns'),
    ('FIND ME TRADES 2.0','Find Me Trades 2.0'),('draft_capital','draft-capital search goal'),('young_talent','young-talent search goal'),('cap_relief','cap-relief search goal'),
    ('CPU COUNTER OFFER','CPU counter offer'),('ASKING FOR','ask-for-pick negotiation'),('PROTECT 1ST','pick protection negotiation'),('MODIFY / COUNTER','incoming offer modification'),
    ('LEAGUE TRANSACTION LOG','trade history'),('30 FRONT OFFICES · LIVE DIRECTION','league front-office board'),('Shams Charania','insider rumor feed'),
]: ck(needle in app,label)

# Runtime coherence.
expected={
 'index.html':['data/data-v0.33.js','data/source-certification-v0.33.js','data/future-pick-ledger-v0.33.js','data/schedule-v0.33.js','data/schedule-template-v0.33.js','cba-v0.33.js','data/organizations-v0.33.js','app-v0.33.js'],
 'gameday.html':['data/data-v0.33.js','data/schedule-v0.33.js','data/schedule-template-v0.33.js','gameday-v0.33.js'],
 'exhibition.html':['data/data-v0.33.js','exhibition-v0.33.js'],
}
for page,refs in expected.items():
    text=(ROOT/page).read_text(encoding='utf-8')
    srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    ck(srcs==refs,f'{page} exact v0.33 runtime order')
    for ref in refs: ck((ROOT/ref).exists(),f'{ref} exists')
ck('V0.33 ACTIVE FRONT OFFICES' in idx,'menu release badge')
ck('exhibition.html?v=0.33' in idx,'versioned Exhibition navigation')
ck('index.html?continue=1&v=0.33' in (ROOT/'gameday-v0.33.js').read_text(),'Game Day back route v0.33')
ck('index.html?v=0.33' in (ROOT/'exhibition-v0.33.js').read_text(),'Exhibition back route v0.33')

# Organization bundle stays the sourced v0.32 personnel snapshot, promoted only as a release-unique runtime asset.
js="""global.window={};require('./data/organizations-v0.33.js');console.log(JSON.stringify(window.NBA_COURTSIDE_ORGS_V033));"""
try:
    org=json.loads(subprocess.check_output(['node','-e',js],cwd=ROOT,text=True))
except Exception as e:
    org={}; errors.append(f'organizations bundle evaluates: {e}')
ck(org.get('version')=='0.33','organization runtime version 0.33')
ck(org.get('frozen_as_of')=='2026-08-21','organization personnel freeze unchanged')
ck(len(org.get('teams',{}))==30,'30 organization records retained')
ck(org.get('commissioner',{}).get('name')=='Adam Silver','commissioner retained')

# Ratings smoke remains v0.29 certified.
raw=(ROOT/'data/data-v0.33.js').read_text().strip();pre='window.NBA_COURTSIDE_DATA = '
ck(raw.startswith(pre),'data bundle prefix')
if raw.startswith(pre):
    data=json.loads(raw[len(pre):].rstrip(';')); by={p['name']:p for p in data['players']}
    for name,want in {'Payton Pritchard':79,'Paul George':79,'Jayson Tatum':89,'Neemias Queta':76}.items():
        ck(by.get(name,{}).get('ratings',{}).get('overall')==want,f'rating smoke {name}')

if errors:
    print(f'FAIL — v0.33 Active Front Offices certification ({len(errors)} issues)')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PASS — v0.33 Active Front Offices certification')
print(json.dumps({'save_schema':25,'organizations':len(org.get('teams',{})),'find_trade_goals':5,'gm_models':6,'rating_smoke':True},indent=2))
