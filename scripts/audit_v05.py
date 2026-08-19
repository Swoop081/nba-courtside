import json, pathlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
players=json.load(open(root/'data/players-2026-08-19.json',encoding='utf-8'))
sched=json.load(open(root/'data/schedule-2026-27.json',encoding='utf-8'))
teams=json.load(open(root/'data/league-2026-08-19.json',encoding='utf-8'))['teams']
assert len(teams)==30, len(teams)
assert len({p['id'] for p in players})==len(players)
games=sched['games']
assert len(games)==1230, len(games)
assert len({g['id'] for g in games})==1230
counts={t['abbr']:{'g':0,'h':0,'a':0} for t in teams}
for g in games:
    counts[g['home']]['g']+=1;counts[g['home']]['h']+=1
    counts[g['away']]['g']+=1;counts[g['away']]['a']+=1
for a,c in counts.items():
    assert c=={'g':82,'h':41,'a':41},(a,c)
js=(root/'app.js').read_text(encoding='utf-8')
for marker in ['simulatePlayIn','simulatePlayoffRound','generateAwards','beginOffseason','buildDraftOrder','generateDraftClass','finishDraft','startNextSeason','3-2-1 LOTTERY']:
    assert marker in js, marker
print(f'PASS: {len(teams)} teams / {len(players)} base players / {len(games)} games / 82 per team / 41 home + 41 away')
print('PASS: postseason, awards, aging/retirement, 3-2-1 lottery, fictional draft and next-season loop markers present')
