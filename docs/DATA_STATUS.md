# NBA Courtside — 2026 Data Status

**Build:** v0.2  
**Freeze date:** 19 August 2026  
**Starting season:** 2026–27

## Current snapshot

- 30 NBA teams
- 442 player/rights records in the current GM pool
- 439 signed standard/disabled/inactive player records
- 3 unsigned restricted free agents retained as team-rights cases
- 392 players joined to a 2025–26 statistical profile and given current ratings
- 50 records without a current NBA-derived rating
- 44 projection-pending rookies/newcomers
- 393 records with a matched headshot reference
- 0 duplicate player identities in the structural audit

Two missed statistical name joins from v0.1 are repaired:

- Egor Demin
- Yang Hansen

## Restricted free-agent treatment

The following players are intentionally **not** represented as having a signed 2026–27 salary:

| Player | Rights team | Qualifying offer | Cap hold |
|---|---:|---:|---:|
| Jalen Duren | DET | $9,615,600 | $19,449,432 |
| Bennedict Mathurin | LAC | $8,774,590 | $27,562,719 |
| Peyton Watson | DEN | $6,534,714 | $13,069,428 |

The GM engine should carry the cap hold until the player signs, accepts the qualifying offer, or the team renounces rights.

## Statistical status

The bundled `raw/nba_stats_2025_2026_bootstrap.csv` is a **near-final 2025–26 bootstrap**, not the exact season-complete NBA.com export. It is retained to develop and validate the importer, ratings formulas, simulation-rate profiles and UI while the exact canonical bulk replacement is prepared.

Because the seed is not final, v0.2 must not be treated as the canonical launch ratings database. The import architecture is deliberately source-agnostic at this layer: replacing the seed with the completed NBA.com traditional-stat export should not require changing the player schema or formulas.

## Still required before a canonical current-day v1.0

1. Replace the near-final statistical seed with the exact completed 2025–26 NBA.com bulk season export.
2. Populate the rookie/pre-NBA projection importer for all 2026 rookies and overseas/newcomer players with no NBA sample.
3. Add prior-season carryover for established players with zero or tiny 2025–26 samples caused by injury or absence.
4. Finish two-way, camp, free-agent-pool and roster-cut classifications for the opening offseason state.
5. Add date of birth, exact height/weight, NBA experience and draft metadata as first-class player fields.
6. Extend the financial layer beyond salary rows to cap holds, dead money, exceptions and draft-pick ownership where the eventual CBA simulation needs them.
7. Verify all remaining year-by-year option/guarantee details against the final contract source set.

## Defensive-rating limitation

The historical-portable ratings model deliberately uses traditional box-score evidence as its required common denominator. This makes the model portable to early historical seasons, but it cannot fully isolate individual defense. Modern tracking/on-off data may later be used as an optional confidence-enhancing layer for modern seasons; it should never become a required input that breaks historical portability.
