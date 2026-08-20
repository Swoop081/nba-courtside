# NBA Courtside v0.20 Validation

## Bird-rights certification

`python scripts/certify_bird_rights_v20.py`

- 442 player/right rows: PASS
- 392 exact post-2026–27 continuity seeds: PASS
- 50 future-safe long-horizon floors: PASS
- 442 first actionable exits certified: PASS
- all long-horizon floor cases first become actionable in 2029 or later: PASS
- all floor cases reach Bird before their first decision under uninterrupted continuity: PASS
- Duren / Mathurin / Watson current unsigned-RFA Bird status retained: PASS

## Runtime CBA test

`node scripts/test_bird_rights_v20.js`

- Dean Wade Non-Bird seed: PASS
- Jaylen Brown Bird continuity seed: PASS
- Ty Jerome option-decline → Early Bird: PASS
- waiver into free agency resets `birdClock`: PASS
- Early Bird route = 2–4 years: PASS
- Early Bird raise = 8% / Non-Bird raise = 5%: PASS

## Existing game regression

The self-contained v0.19 regression scripts resolve their package root dynamically and were rerun against the v0.20 files. The following passed after the continuity-engine change:

- NBA Cup integration
- draft-asset safety
- full draft/offseason bridge
- draft-night trades
- regular Game Day
- NBA Cup Final Game Day
- postseason

The final Early Bird term-option refinement affects only free-agency contract validation; the full draft/offseason bridge was rerun after that refinement.

## Simulation

No player ratings, rate profiles or Game Day simulation coefficients changed in v0.20. The v0.19 calibration remains the active simulation baseline.
