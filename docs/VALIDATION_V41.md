# NBA Courtside v0.41 — Validation

Frozen 21 August 2026.

## New v0.41 gates

- `scripts/test_gameday_coaching_v41.js` — PASS. Assisted mode, shortened rotation, 240 planned minutes, timeout bank, More Threes shot-profile response, manual substitution, primary matchup effect, foul-trouble decision, six-foul removal, halftime pause and persisted v0.41 result metadata.
- `scripts/test_gameday_health_on_v41.js` — PASS. Rest exclusion, fatigue-energy effect, injury-risk response, body-area injury persistence and exact 24.0-minute return-to-play cap.
- `scripts/test_gameday_coaching_calibration_v41.js` — PASS. 100 Full Auto live games: 114.89 team PPG, 14.92 average margin, 2 overtime games, 79 minimum team score, 151 maximum team score.
- `scripts/test_postgame_resume_on_v41.js` — PASS. Completed Game Day result reloads into a season-started franchise with Continue/New Franchise bindings and direct-return behavior intact.
- `scripts/test_cache_coherence_v41.py` — PASS. Franchise, Game Day and Exhibition entry points use release-specific v0.41 runtime URLs; canonical and versioned runtime files match.
- JavaScript syntax — PASS for canonical and versioned Franchise/CBA/Exhibition/Game Day runtime files.

## Retained regression gates

- Ratings/source integrity — PASS: 442 players, 393 NBA-evidence players, 49 projection-only, median OVR 72, 75 players 80+, 29 players 86+, 8 players 90+.
- Contracts/Agents runtime — PASS.
- Staff Careers runtime — PASS.
- Player Relations runtime — PASS.
- League Events runtime — PASS.
- College + Draft runtime — PASS.
- G League runtime/call-up — PASS.
- Active Front Offices / Find Me Trades runtime — PASS, including the five search goals, multi-asset search and seeded CPU-to-CPU trade path.
- CBA source long-tail — PASS.
- Full NBA Cup / regular-season integration — PASS: 1,230 regular-season results and no player above 82 GP.
- Save migration — PASS.
- Transaction edges — PASS.
- Offseason bridge — PASS.
- Postseason v21 regression — PASS.
- iPhone device-layout gate — PASS.
- Modal accessibility gate — PASS.

The inherited long-horizon whole-franchise durability foundation remains unchanged; v0.41 does not claim a newly completed full 10-season whole-franchise durability run.
