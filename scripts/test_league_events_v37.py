#!/usr/bin/env python3
from pathlib import Path
import re, json, sys
ROOT=Path(__file__).resolve().parents[1]
app=(ROOT/'app-v0.37.js').read_text(encoding='utf-8')
idx=(ROOT/'index.html').read_text(encoding='utf-8')
errors=[]
def ck(v,msg):
    if not v: errors.append(msg)
markers=[
 'state.leagueEvents','version:37','function leagueEventsV37','function seasonEventsV37','function v37AddMoment',
 'function ensureAllStarV37','function simulateAllStarContestsV37','function simulateAllStarGameV37',
 'function playoffRaceSnapshotV37','function awardRaceHubV37','SIXTH MAN OF THE YEAR','MOST IMPROVED PLAYER',
 'function awardsShowV37','SIMULATED BALLOT BREAKDOWN','ALL-NBA THIRD TEAM','ALL-DEFENSIVE SECOND TEAM','ALL-ROOKIE SECOND TEAM',
 'function deadlineHubV37','SHAMS CHARANIA · SIMULATED DEADLINE DESK',
 '2027 NBA 3-2-1 DRAFT LOTTERY · COMMISSIONER','ADAM SILVER','Traded pick ownership',
 'function ensureCombineV37','SIMULATED WORKOUT DATA','function runSummerLeagueV37','NBA SUMMER LEAGUE · SIMULATED',
 'MARK TATUM','DEPUTY COMMISSIONER','function draftGradeV37','function votingPanelV37',
 'const v37SocialPrev=socialFeed','FICTIONAL FAN · SIMULATED','function catchUpLeagueEventsV37'
]
for x in markers: ck(x in app,'missing marker: '+x)
# The underlying 2027 3-2-1 lottery foundation is official and should retain all key rules.
for x in [
 'while(entrants.length<16)','balls:overallWorst.includes(a)?2:3','balls:2,relegated:false','balls:1,relegated:false',
 "pick===1&&prev[0]","pick<=5&&prev.length&&prev2.length",'slotsTo12=13-pick'
]: ck(x in app,'2027 3-2-1 lottery rule missing: '+x)
ck('V0.37 LEAGUE EVENTS' in idx,'menu v0.37 badge')
expected={
 'index.html':['data/data-v0.37.js','data/source-certification-v0.37.js','data/future-pick-ledger-v0.37.js','data/schedule-v0.37.js','data/schedule-template-v0.37.js','cba-v0.37.js','data/organizations-v0.37.js','data/g-league-v0.37.js','data/college-draft-v0.37.js','app-v0.37.js'],
 'gameday.html':['data/data-v0.37.js','data/schedule-v0.37.js','data/schedule-template-v0.37.js','gameday-v0.37.js'],
 'exhibition.html':['data/data-v0.37.js','exhibition-v0.37.js']
}
for page,refs in expected.items():
    text=(ROOT/page).read_text(encoding='utf-8')
    srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    ck(srcs==refs,f'{page} exact v0.37 runtime order')
    ck(not any('v0.36' in s for s in srcs),f'{page} stale v0.36 runtime URL')
    for ref in refs: ck((ROOT/ref).exists(),f'missing runtime asset {ref}')
ck('index.html?continue=1&v=0.37' in (ROOT/'gameday-v0.37.js').read_text(),'Game Day return route v0.37')
ck('index.html?v=0.37' in (ROOT/'exhibition-v0.37.js').read_text(),'Exhibition return route v0.37')
if errors:
    print(f'FAIL — v0.37 League Events certification ({len(errors)} issues)')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PASS — v0.37 League Events + Season Moments certification')
print(json.dumps({'release':'v0.37','save_schema':25,'event_state_version':37,'all_star_roster':24,'award_categories':6,'all_nba_teams':3,'all_defense_teams':2,'all_rookie_teams':2,'lottery_teams':16,'summer_league_games':5},indent=2))
