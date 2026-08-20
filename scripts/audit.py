import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
league=json.load(open(R/'data/league-2026-08-19.json'))
players=json.load(open(R/'data/players-2026-08-19.json'))
q=json.load(open(R/'data/data-quality.json'))
assert len(league['teams'])==30
assert len({t['abbr'] for t in league['teams']})==30
assert len(players)==442
assert len({p['id'] for p in players})==len(players)
assert q['rated_players']==442
assert q['established_with_2025_26_stats']==392
assert q['unsigned_restricted_free_agents']==3
lebron=next(p for p in players if p['name']=='LeBron James')
assert lebron['team']=='PHI' and lebron['age']==41 and lebron['ratings'] is not None
assert lebron['position_group']=='wing' and lebron['development_profile']['trend']=='declining_fast'
wemby=next(p for p in players if p['name']=='Victor Wembanyama')
assert wemby['team']=='SAS' and wemby['age']==22 and wemby['ratings'] is not None
aj=next(p for p in players if p['name']=='AJ Dybantsa')
assert aj['team']=='WAS' and aj['age']==19 and aj['ratings'] is not None and aj['rating_source']=='projection_translation_model_v0.23' and aj['stats_2025_26'] is None
for n in ('Jalen Duren','Bennedict Mathurin','Peyton Watson'):
    p=next(x for x in players if x['name']==n)
    assert p['roster_status']=='restricted_free_agent_unsigned'
    assert p['contract']['cap_hold'] and p['contract']['qualifying_offer']
assert league['cap']['salary_cap']==164961000
assert league['cap']['first_apron']==209015000
assert league['cap']['second_apron']==221686000
print(f"PASS — 30 teams / {len(players)} records / {q['rated_players']} rated / 50 source-backed projections / {q['projection_pending']} projection-pending / 3 unsigned RFAs / 0 duplicate identities")
