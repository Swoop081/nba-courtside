# NBA Courtside v0.40 Validation

## New v0.40 gates

### Health runtime

`node scripts/test_health_runtime_v40.js`

Pass criteria include:

- additive health state version 40,
- 30 team medical departments / 90 simulated staff,
- persistent fatigue,
- fatigue-sensitive injury risk,
- body-area injury metadata,
- staged return-to-play with minute recommendation,
- explicit load-management controls,
- physical Training Center consequences,
- Health + Performance UI rendering.

### Game Day health integration

`node scripts/test_gameday_health_v40.js`

Pass criteria include:

- rest removes a player from that game's rotation,
- medical minute caps preserve a 240-minute team rotation,
- a 24-minute return restriction is not exceeded in the final box score,
- persistent fatigue lowers starting Game Day energy,
- fatigue raises live injury risk,
- Game Day injuries persist body-area metadata,
- postgame workload returns to the shared health state,
- regular Game Day results use the v0.40 health possession engine.

### Full-season health calibration

`node scripts/test_health_season_calibration_v40.js`

Frozen certification result:

- 1,230 regular-season games,
- 83 reportable injury events,
- 4 major injuries,
- 19 moderate injuries,
- peak 11 simultaneous active injuries,
- 434 rostered health entries observed,
- 17.7 average fatigue at the final sampled date,
- 13 players in Heavy Load or above at the final sampled date,
- no player above 82 regular-season games.

This is a gameplay calibration, not a prediction of real 2026–27 injury totals.

## Retained gates

The v0.40 runtime also re-runs the retained foundations on the v0.40 assets:

- v0.39 Contracts/Agents/Free Agency runtime,
- v0.38 Staff Careers runtime,
- v0.37 League Events runtime,
- v0.36 Player Relations runtime,
- v0.35 College + Draft runtime,
- v0.34 G League call-up runtime,
- v0.33 Active Front Offices / Find Me Trades runtime,
- v0.28 postgame-resume regression,
- CBA source long-tail regression,
- v0.29 ratings/source certification,
- full NBA Cup / 1,230-game regular-season integration,
- release-specific cache-coherence checks,
- JavaScript syntax.

The unchanged whole-franchise long-horizon certification inherited from the earlier foundation is not presented as a newly executed v0.40 gate unless separately rerun.
