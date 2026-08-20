import json, math, hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1]
players=json.load(open(R/'data/players-2026-08-19.json',encoding='utf-8'))
raw_doc=json.load(open(R/'raw/projection-inputs-v0.23.json',encoding='utf-8')); raw=raw_doc['records']
cert=json.load(open(R/'data/projection-certification-v0.23.json',encoding='utf-8'))
sc=json.load(open(R/'data/source-certification-v0.23.json',encoding='utf-8'))
hashes=json.load(open(R/'data/v019-evidence-core-hashes.json',encoding='utf-8'))['players']
assert len(players)==442 and len({p['id'] for p in players})==442
verified=[p for p in players if p.get('stat_source_status')=='season_complete_verified']
projected=[p for p in players if p.get('rating_source')=='projection_translation_model_v0.23']
assert len(verified)==392, len(verified)
assert len(projected)==50, len(projected)
assert len(raw)==50 and len({r['id'] for r in raw})==50
raw_ids={r['id'] for r in raw}; proj_ids={p['id'] for p in projected}
assert raw_ids==proj_ids
# Projection evidence never becomes fake 2025-26 NBA history.
for p in projected:
    assert p.get('stats_2025_26') is None, p['name']
    assert p.get('ratings') and p.get('tendencies') and p.get('simulation_profile'), p['name']
    q=p.get('projection_2026_27') or {}; c=p.get('projection_confidence')
    assert 0.50 <= float(c) <= 0.90, (p['name'],c)
    assert q.get('source_type') in {'ncaa_2025_26','ncaa_bridge_2024_25','international_2025_26','prior_nba_2024_25'}
    assert q.get('source_url','').startswith('http')
    assert math.isfinite(float(q.get('projected_mpg'))) and 8 <= float(q['projected_mpg']) <= 36
    r=p['ratings']; assert 60 <= r['overall'] <= 90, (p['name'],r['overall'])
    sp=p['simulation_profile']
    for k in ('pts_per36','fga_per36','three_pa_per36','fta_per36','reb_per36','ast_per36','stl_per36','blk_per36','tov_per36'):
        assert math.isfinite(float(sp[k])), (p['name'],k)
    assert 3 <= sp['pts_per36'] <= 38
    assert 3 <= sp['fga_per36'] <= 28
    assert 0 <= sp['three_pa_per36'] <= sp['fga_per36']
    assert 0 <= sp['fta_per36'] <= 14
# v0.19 NBA population stays byte-for-byte unchanged in core evidence/rating/profile fields.
for p in verified:
    assert p.get('rating_source')=='2025-26_final_box_score_model_v19', (p['name'],p.get('rating_source'))
    assert p.get('stats_2025_26') is not None
    payload={'stats':p.get('stats_2025_26'),'ratings':p.get('ratings'),'simulation_profile':p.get('simulation_profile')}
    digest=hashlib.sha256(json.dumps(payload,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    assert digest==hashes.get(p['id']), 'v0.19 core drift: '+p['name']
# Every source row is explicit about provenance.
for r in raw:
    assert str(r.get('source_url','')).startswith('http'), r['id']
    assert r.get('source_type') in {'ncaa_2025_26','ncaa_bridge_2024_25','international_2025_26','prior_nba_2024_25'}
    assert r.get('source_season') and r.get('source_team') and r.get('source_league')
assert cert['status']=='PASS' and cert['projection_players']==50 and cert['rated_players_total']==442
assert sc['version']=='v0.23' and sc['player_stats']['source_backed_projection']==50 and sc['projection_model']['source_backed_players']==50
print('PASS — v0.23 projection certification: 392 final NBA + 50 source-backed projections / 442 rated / 0 fabricated 2025-26 projection stat rows')
