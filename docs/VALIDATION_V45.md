# NBA Courtside v0.45 Validation

## Release-specific validation

- `scripts/test_offseason_command_center_v45.js` — full postseason-to-next-season runtime flow, including Options → Lottery → Scout/Combine → Draft → Rights/QO → Free Agency → Summer League → Training Camp → Opening Night.
- `scripts/test_offseason_command_center_v45.py` — **74/74** structural/runtime integration checks.
- `scripts/test_trade_deadline_on_v45.py` — **66/66** retained v0.44 deadline/transaction checks against the v0.45 runtime.

## Retained regression probes

Passed:

- save migration / corruption fallback (`test_save_migration_v25.js`);
- contract/agent market runtime (`test_contract_market_runtime_v39.js`);
- long-tail CBA runtime (`test_cba_source_long_tail_on_v40.js`);
- Game Day coaching runtime (`test_gameday_coaching_v41.js`).

## Syntax / packaging

- `app-v0.45.js`: Node syntax pass.
- `gameday-v0.45.js`: Node syntax pass.
- `exhibition-v0.45.js`: Node syntax pass.
- `cba-v0.44.js`: Node syntax pass.
- Formal save schema remains 25 / `nbaCourtsideSaveV25`.

The legacy `test_draft_offseason_v21.js` expects the pre-v0.45 direct Champion → Lottery transition and is therefore superseded for offseason-flow certification by the v0.45-aware runtime test.

A physical iPhone Safari smoke test is still recommended for final touch/layout feel.
