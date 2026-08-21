# NBA Courtside v0.34 — Validation

## New v0.34 gates

- `scripts/test_g_league_v34.py`
  - 31 G League teams / 30 NBA affiliates / 1 unaffiliated club
  - Coachella Valley Lakers and Laketown Squadron 2026–27 identity checks
  - all 30 NBA teams represented in Two-Way tracker
  - 75 filled Two-Way slots in frozen snapshot
  - 12 unique verified G League United call-up candidates
  - conservative 60–75 NBA call-up projection safety band
  - no false NBA-stat claim in call-up data
  - 50-game / 14+36 provisional world-model structure
  - deterministic independent scheduling probe reaches exactly 50 games for all 31 clubs
  - Daily Hub, League, Market, call-up, assignment and CPU call-up integration checks
- `scripts/test_cache_coherence_v34.py`
  - exact v0.34 runtime asset order on Franchise, Game Day and Exhibition
  - no v0.33 runtime URL leaks
  - retained Boston v0.29 ratings smoke values
  - v0.34 navigation return routes

## Retained gates executed for this release

- postgame-resume integration
- full NBA Cup integration: 1,230 regular-season results; max player GP 82
- CBA long-tail/source test
- v0.29 ratings/source exact-field certification
- Main Menu/boot audit
- iPhone device-layout audit
- modal accessibility/focus audit
- save-schema 25 migration/corruption fallback
- transaction-edge regression
- offseason bridge / full 60-pick draft / free-agency completion
- active-front-office runtime: five accepted Find Me Trades results for all five goals, multi-asset search, incoming offer/rumour generation and seeded CPU trade
- JavaScript syntax checks for Franchise, Game Day, Exhibition, CBA and the G League data bundle
- 10-season durability through 2036: 600 generated players, 1,020 future-pick cells, 2,915,432-byte final save

## Data safety conclusion

v0.34 adds a new league layer without changing the certified NBA player source rows, player ratings, NBA schedule, CBA constants, future-pick ledger or save schema. The G League schedule is explicitly simulated while unpublished. Current G League affiliations and Two-Way status are source snapshots; incomplete 2026–27 club rosters are not fabricated.
