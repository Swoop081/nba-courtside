# NBA Courtside — Validation v0.25

## Release gates

- `python scripts/certify_release_v25.py`
- `python scripts/test_accessibility_v25.py`
- `node scripts/test_save_migration_v25.js`
- `node scripts/test_long_horizon_v25.js`
- `node scripts/test_free_agency_scaling_v25.js`
- retained CBA/Bird/future-pick/draft/offseason/Cup/Game Day/postseason/schedule regressions
- `node --check` for shipped JavaScript entry points

## Frozen long-horizon result

Ten repeated seasons reach 2036 with ten complete 60-pick drafts, 600 generated prospects, 1,020 future-pick cells, legal 15-man standard and three-player Two-Way roster caps, unique IDs and a successful schema-25 JSON save round-trip after every transition. The final stress save is 2,915,788 bytes (<4.5 MB release gate).

## Behavioral split

The long-horizon harness intentionally compresses free agency so it can pressure repeated state growth. `test_offseason_bridge_v24.js` remains the behavioral certification for a complete seven-day free-agency market, RFA handling, Training Camp and next-season transition.

## Retained source/data invariants

- 442 player/right records.
- 393 final-NBA evidence rows; 49 separate projections.
- 442 exact/certified service-year inputs.
- v0.19 392-player evidence core retained.
- 420-cell source-safe pick ledger retained.
- v0.20 Bird continuity, v0.21 pick resolver and v0.22/v0.24 CBA systems retained.

A complete extracted-ZIP rerun is required before release.

## Free-agency scaling

Five consecutive production opening-market rounds pass with a pool growing to 480 free agents; maximum measured opening round is 2,176 ms under the release test environment, below the 8,000 ms pathological-scaling gate.
