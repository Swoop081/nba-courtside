import json
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
league=json.load(open(ROOT/'data/league-2026-08-19.json',encoding='utf-8'))
players=json.load(open(ROOT/'data/players-2026-08-19.json',encoding='utf-8'))
s=json.load(open(ROOT/'data/schedule-2026-27.json',encoding='utf-8'))
teams={t['abbr'] for t in league['teams']}
g=s['games']
assert len(teams)==30, len(teams)
assert len(players)==442, len(players)
assert len({p['id'] for p in players})==len(players)
assert len(g)==1230, len(g)
assert len({x['id'] for x in g})==len(g)
assert min(x['date'] for x in g)=='2026-10-20'
assert max(x['date'] for x in g)=='2027-04-11'
counts=Counter(); home=Counter(); away=Counter()
for x in g:
    assert x['home'] in teams and x['away'] in teams and x['home']!=x['away']
    counts[x['home']]+=1; counts[x['away']]+=1
    home[x['home']]+=1; away[x['away']]+=1
for t in teams:
    assert counts[t]==82,(t,counts[t])
    assert home[t]==41,(t,home[t])
    assert away[t]==41,(t,away[t])
assert s['official_schedule_exact'] is False
for f in ['index.html','app.js','data/data.js','data/schedule.js']:
    assert (ROOT/f).exists(),f
idx=(ROOT/'index.html').read_text(encoding='utf-8')
assert 'data/schedule.js' in idx
assert 'data-view="league"' in idx
app=(ROOT/'app.js').read_text(encoding='utf-8')
for token in ['startSeason','simulateGame','completeTrade','waivePlayer','signPlayer','standingsView']:
    assert token in app,token
print('LIVE AUDIT PASS')
print(f'{len(teams)} teams / {len(players)} player records / {len(g)} games')
print('82 games + 41 home/41 away for every team / 0 duplicate game IDs')
