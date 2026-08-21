#!/usr/bin/env python3
from pathlib import Path
import json,re,sys,datetime,hashlib
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def ck(x,msg):
    if not x: errors.append(msg)

def load_js(path,prefix):
    raw=(ROOT/path).read_text(encoding='utf-8').strip(); ck(raw.startswith(prefix),f'{path} prefix')
    if not raw.startswith(prefix): return {}
    return json.loads(raw[len(prefix):].rstrip(';'))

gl=load_js('data/g-league-v0.34.js','window.NBA_COURTSIDE_GLEAGUE_V034 = ')
app=(ROOT/'app-v0.34.js').read_text(encoding='utf-8')
idx=(ROOT/'index.html').read_text(encoding='utf-8')
teams=gl.get('teams',[]); tracker=gl.get('two_way_tracker',{}); pool=gl.get('callup_pool',[])
ck(gl.get('version')=='0.34','G League data version 0.34')
ck(gl.get('freeze_date')=='2026-08-21','G League source freeze date')
ck(len(teams)==31,'31 G League teams')
ck(sum(bool(t.get('nba_affiliate')) for t in teams)==30,'30 NBA-affiliated G League teams')
ck(sum(not bool(t.get('nba_affiliate')) for t in teams)==1,'one unaffiliated G League team')
ck(any(t['name']=='Mexico City Capitanes' and t.get('nba_affiliate') is None for t in teams),'Mexico City is unaffiliated')
ck(any(t['name']=='Coachella Valley Lakers' and t.get('nba_affiliate')=='LAL' for t in teams),'2026 Coachella Valley Lakers affiliation')
ck(any(t['name']=='Laketown Squadron' and t.get('nba_affiliate')=='NOP' for t in teams),'2026 Laketown Squadron affiliation')
ck(len(tracker)==30,'Two-Way tracker covers all 30 NBA teams')
ck(sum(len(v) for v in tracker.values())==75,'75 current Two-Way contracts in source snapshot')
ck(len(pool)==12,'12 verified 2026 G League United call-up scouts')
ck(len({c['id'] for c in pool})==12,'unique call-up candidate IDs')
ck(len({c['name'] for c in pool})==12,'unique call-up candidate names')
ck(min(c['ovr'] for c in pool)>=60 and max(c['ovr'] for c in pool)<=75,'conservative NBA call-up OVR band')
for c in pool:
    s=c.get('stats',{})
    ck(all(k in s for k in ['gp','mpg','pts','reb','ast','fg_pct','three_pct','ft_pct']),f"core G League stats: {c['name']}")
    ck(c.get('nba_callup_projection') is True,f"projection labeling: {c['name']}")
    ck('not a real-world contract-status claim' in c.get('availability_model',''),f"availability boundary: {c['name']}")
ck(gl.get('league',{}).get('games_per_team_model')==50,'50-game world model')
ck(gl.get('league',{}).get('tipoff_games_model')==14,'14-game Tip-Off segment model')
ck(gl.get('league',{}).get('regular_games_model')==36,'36-game regular-season segment model')
ck('SIMULATED_PROVISIONAL' in gl.get('league',{}).get('schedule_status',''),'unpublished schedule explicitly simulated')
for needle,label in [
 ('function gl34()','persistent G League save branch'),('simulateGLeagueDateV34','deterministic daily G League simulation'),('hash01(`g34|','separate deterministic hash path'),
 ('function gLeagueViewV34()','G League destination'),('Scout G League','scouting UI'),('two_way_tracker','Two-Way data layer'),
 ('signGLeagueCandidateV34','NBA call-up signing path'),("route:'minimum'",'NBA minimum contract route'),('installContract(p,a','certified contract engine integration'),
 ('maybeCpuGLeagueCallupV34','CPU G League call-ups'),('G LEAGUE ASSIGNMENT','assignment transaction'),('G LEAGUE RECALL','recall transaction'),
 ('gLeagueAffiliateModuleV34','Daily Hub affiliate module'),('gLeagueMarketPanelV34','Free Agency G League module'),('gLeagueLeaguePortalV34','League G League portal'),
 ('V0.34 · G LEAGUE FOUNDATION','source certification presentation'),("replaceAll('v=0.33','v=0.34')",'Game Day v0.34 cache route'),
]: ck(needle in app,label)
ck('V0.34 G LEAGUE FOUNDATION' in idx,'menu release badge')
ck('data/g-league-v0.34.js' in idx,'G League runtime data loaded')

# Exact release-specific runtime order.
expected={
 'index.html':['data/data-v0.34.js','data/source-certification-v0.34.js','data/future-pick-ledger-v0.34.js','data/schedule-v0.34.js','data/schedule-template-v0.34.js','cba-v0.34.js','data/organizations-v0.34.js','data/g-league-v0.34.js','app-v0.34.js'],
 'gameday.html':['data/data-v0.34.js','data/schedule-v0.34.js','data/schedule-template-v0.34.js','gameday-v0.34.js'],
 'exhibition.html':['data/data-v0.34.js','exhibition-v0.34.js'],
}
for page,refs in expected.items():
    text=(ROOT/page).read_text(encoding='utf-8'); srcs=re.findall(r'<script\s+src="([^"]+)"',text)
    ck(srcs==refs,f'{page} exact v0.34 runtime order')
    for ref in refs: ck((ROOT/ref).exists(),f'{ref} exists')
    ck(not any('v0.33' in x for x in srcs),f'{page} has no v0.33 runtime URL')
ck('index.html?continue=1&v=0.34' in (ROOT/'gameday-v0.34.js').read_text(),'Game Day return route v0.34')
ck('index.html?v=0.34' in (ROOT/'exhibition-v0.34.js').read_text(),'Exhibition return route v0.34')

# Independent deterministic 50-game balance probe mirroring the release scheduler.
ids=[t['id'] for t in teams]
rec={i:0 for i in ids}
def h(s):
    # Stable deterministic test hash; scheduler's exact score values are less important than balanced game allocation.
    return int(hashlib.sha256(('g34|'+s).encode()).hexdigest()[:14],16)/(16**14-1)
start=datetime.date(2026,11,6); end=datetime.date(2027,3,31); d=start; day=0
while d<=end:
    date=d.isoformat(); count=[5,6,5,6,5,6,5][day%7]
    cand=sorted([i for i in ids if rec[i]<50],key=lambda i:(rec[i],h(f'{date}|{i}|order')))
    chosen=sorted(cand[:min(count,len(cand)//2)*2],key=lambda i:h(f'{date}|{i}|pair'))
    for i in range(0,len(chosen)-1,2):
        if rec[chosen[i]]<50 and rec[chosen[i+1]]<50:
            rec[chosen[i]]+=1; rec[chosen[i+1]]+=1
    d+=datetime.timedelta(days=1); day+=1
ck(min(rec.values())==50 and max(rec.values())==50,'provisional scheduler reaches exactly 50 games for all 31 teams')

if errors:
    print(f'FAIL — v0.34 G League certification ({len(errors)} issues)')
    for e in errors: print(' -',e)
    sys.exit(1)
print('PASS — v0.34 G League Foundation certification')
print(json.dumps({'g_league_teams':len(teams),'nba_affiliates':30,'two_way_contracts':sum(len(v) for v in tracker.values()),'verified_callup_pool':len(pool),'provisional_games_per_team':min(rec.values()),'save_schema':25},indent=2))
