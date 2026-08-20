#!/usr/bin/env python3
import json, pathlib, collections, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
S=json.loads((ROOT/'data/schedule-2026-27.json').read_text())
games=S['games']
assert S['season']=='2026-27'
assert S['official_schedule_exact'] is True
assert S['assigned_games']==1200 and S['unassigned_games']==30
assert len(games)==1200
assert sorted(g['official_game_no'] for g in games)==list(range(1,1201))

team_games=collections.Counter(); home=collections.Counter(); away=collections.Counter()
for g in games:
    team_games[g['home']]+=1; team_games[g['away']]+=1
    home[g['home']]+=1; away[g['away']]+=1
assert len(team_games)==30
assert set(team_games.values())=={80}, sorted(team_games.items(), key=lambda x:x[1])[:5]
assert set(home.values())=={40}, collections.Counter(home.values())
assert set(away.values())=={40}, collections.Counter(away.values())

cup=[g for g in games if g.get('nba_cup_group')]
assert len(cup)==60
cup_games=collections.Counter(); cup_home=collections.Counter(); cup_away=collections.Counter()
for g in cup:
    cup_games[g['home']]+=1; cup_games[g['away']]+=1
    cup_home[g['home']]+=1; cup_away[g['away']]+=1
assert set(cup_games.values())=={4}
assert set(cup_home.values())=={2}
assert set(cup_away.values())=={2}

opening=[g for g in games if g['date']=='2026-10-20']
assert [(g['away'],g['home']) for g in opening]==[('BOS','DET'),('PHI','NYK'),('OKC','SAS')]
final=[g for g in games if g['date']=='2027-04-11']
assert len(final)==15
assert len({t for g in final for t in (g['away'],g['home'])})==30
assert min(g['date'] for g in games)=='2026-10-20'
assert max(g['date'] for g in games)=='2027-04-11'

expected={
 'WEST A':{'DEN','HOU','PHX','DAL','UTA'},
 'WEST B':{'OKC','MIN','LAC','NOP','MEM'},
 'WEST C':{'SAS','LAL','POR','GSW','SAC'},
 'EAST A':{'DET','TOR','ORL','MIL','BKN'},
 'EAST B':{'NYK','CLE','PHI','MIA','IND'},
 'EAST C':{'BOS','ATL','CHA','CHI','WAS'},
}
assert {k:set(v) for k,v in S['cup_groups'].items()}==expected
for g in cup:
    assert g.get('cup_group') in expected
    assert g['home'] in expected[g['cup_group']] and g['away'] in expected[g['cup_group']]

# Imported source metadata should survive for schedule UI.
assert all(g.get('official') is True for g in games)
assert all(g.get('source') for g in games)
assert any(g.get('national_tv') for g in games)
assert any(g.get('neutral_site') for g in games)

print('PASS official schedule v0.17')
print(f'  assigned games: {len(games)}')
print('  teams: 30 x 80 assigned (40 home / 40 away)')
print(f'  Cup Group Play: {len(cup)} games; 4/team (2 home / 2 away)')
print('  opening night: BOS@DET, PHI@NYK, OKC@SAS')
print('  final day: 15 games / all 30 teams')
print('  date span: 2026-10-20 -> 2027-04-11')
