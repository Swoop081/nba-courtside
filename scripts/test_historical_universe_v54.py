from pathlib import Path
import json,re,subprocess,sys
root=Path(__file__).resolve().parents[1]
checks=[]
def ck(name,cond):
    checks.append((name,bool(cond)))
    if not cond: print('FAIL',name)
idx=(root/'index.html').read_text()
app=(root/'app-v0.54.js').read_text()
raw=(root/'data/historical-universes-v0.54.js').read_text().strip()
prefix='window.NBA_COURTSIDE_HISTORICAL_V54 = '
H=json.loads(raw[len(prefix):].rstrip(';'))
h=H['historical_2025_26']; d=H['realDraftClasses']['2026']['prospects']
ck('universe selector panel', 'universeSelectPanel' in idx)
ck('current universe card', 'current-2026-27' in idx)
ck('historical universe card', 'historical-2025-26-postseason' in idx)
ck('history diverges copy', 'HISTORY DIVERGES FROM HERE' in idx)
ck('historical data script loaded', 'data/historical-universes-v0.54.js' in idx)
ck('v054 app loaded', 'app-v0.54.js' in idx)
ck('v054 app preload', 'href="app-v0.54.js"' in idx)
ck('schema remains 25', "const SAVE_SCHEMA=25" in app)
ck('save key remains v25', 'nbaCourtsideSaveV25' in app)
ck('historical constructor', 'function createHistoricalStateV54' in app)
ck('historical schedule override', "state.seasonYear===2025" in app and "scheduleMode='historical_v54'" in app)
ck('real draft generator wrapper', 'real-2026-' in app and 'realDraftClassV54' in app)
ck('historical destination metadata', 'officialHistoricalTeam' in app)
ck('historical banner', 'historyBannerV54' in app)
ck('official historical cutoff 2026', H.get('officialHistoricalDraftThrough')==2026)
ck('source backed watch cutoff 2027', H.get('sourceBackedFutureWatchThrough')==2027)
ck('generated future begins 2028', H.get('futureGeneratedFrom')==2028)
ck('one historical foundation start', len([x for x in H['starts'] if x['kind']=='historical'])==1)
ck('historical date', h['date']=='2026-04-13')
ck('historical season complete', h['seasonComplete'] is True)
ck('historical CBA ruleset', h['cbaRuleset']=='CBA_2023')
ck('salary cap', h['cap']['salary_cap']==154647000)
ck('first apron', h['cap']['first_apron']==195945000)
ck('second apron', h['cap']['second_apron']==207824000)
ck('1230 games', len(h['seedGames'])==1230)
ck('unique game ids', len({g['id'] for g in h['seedGames']})==1230)
counts={}
for g in h['seedGames']:
    counts[g['home']]=counts.get(g['home'],0)+1;counts[g['away']]=counts.get(g['away'],0)+1
ck('30 teams in schedule', len(counts)==30)
ck('all teams 82 games', all(x==82 for x in counts.values()))
ck('historical player pool', len(h['assignments'])>=550)
ck('historical-only players', len(h['historicalPlayers'])>=150)
ck('historical stats coverage', len(h['seasonStats'])>=540)
ck('60 official draft identities', len(d)==60)
ck('unique draft picks', sorted(x['pick'] for x in d)==list(range(1,61)))
ck('unique draft names', len({x['name'] for x in d})==60)
ck('top 3 identities', [x['name'] for x in d[:3]]==['AJ Dybantsa','Darryn Peterson','Cameron Boozer'])
ck('historical no1 destination metadata', d[0]['historical_drafted_by']=='WAS')
ck('source boundary surfaced', all(k in h['sourceBoundary'] for k in ['rosters','contracts','results','start_point']))
ck('pick rights limitation explicit', 'pickOwnershipBoundary' in app)
# all local script refs from index exist
scripts=re.findall(r'<script src="([^"]+)"',idx)
ck('all index scripts resolve', all((root/x).exists() for x in scripts))
# syntax
r=subprocess.run(['node','--check',str(root/'app-v0.54.js')],capture_output=True,text=True)
ck('app syntax', r.returncode==0)
failed=[n for n,v in checks if not v]
print(f'{len(checks)-len(failed)}/{len(checks)} checks passed')
if failed:
    print('\n'.join(' - '+x for x in failed));sys.exit(1)
