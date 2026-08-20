# NBA Courtside — Validation v0.23

**Result: PASS**  
**Freeze date:** 20 August 2026

## Projection certification

- 442 total current player/right records.
- 392 season-final 2025–26 NBA evidence players.
- 50 source-backed projection players.
- 442/442 rated with simulation profiles.
- 50/50 projection players retain `stats_2025_26 = null`.
- 392/392 v0.19 NBA evidence/rating/profile cores match their frozen SHA-256 hashes.
- Projection confidence: 0.58–0.86.
- Projected Overall range: 68–86.
- Source manifest: 50/50 IDs, each with an explicit source URL/type/season/team/league.

## Runtime integration

- Source-certification browser payload reports v0.23.
- Projection status is recognized by the player UI.
- Franchise rotation priors consume `projection_2026_27.projected_mpg` with a lower cap than NBA MPG.
- Detailed Game Day sees the same projection-minute prior.
- No projection player receives fabricated 2025–26 NBA history.

## Simulation calibration

### Quick sim

10 complete assigned-schedule simulations / 24,000 team-games:

- Team PPG: 116.306
- Home win rate: 55.36%
- Average margin: 11.004
- Box-score point errors: 0
- Rotation-minute errors: 0

### Detailed Game Day

96 games / 192 team-games:

- Team PPG: 116.505 vs 115.608 final 2025–26 target (+0.78%)
- Rebounds: +0.30%
- Assists: +1.28%
- Steals: -0.60%
- Blocks: -4.03%
- Turnovers: -1.65%
- FGM: +0.40%
- FGA: -0.39%
- 3PM: -2.61%
- 3PA: -1.42%
- FTM: +4.94%
- FTA: +4.60%
- Fouls: +1.75%
- Box-score point errors: 0
- Rotation-minute errors: 0

No global engine constant was retuned solely to make the projected 2026–27 roster reproduce the exact 2025–26 league composition.

## Retained regressions

PASS against the v0.23 files:

- v0.22 CBA unit/runtime behavior.
- v0.20/v0.21 Bird-right runtime.
- 420-cell / 3,500-scenario future-pick resolver.
- Draft-asset safety.
- Full draft/offseason/training-camp bridge.
- Draft Night trades.
- NBA Cup completion.
- Regular Game Day.
- Cup Final Game Day.
- Postseason.
- Official 2026–27 schedule.
- JavaScript syntax.

## Known boundaries

The v0.22 long-tail CBA/source boundaries remain. v0.23 is a projection-input release and does not assert exact current-player YOS, unsourced historical transaction dates, incentives/bonuses, complete Apron Team Salary adjustments, detailed guarantees, cash, full waiver assignment, Two-Way/Exhibit 10 or DPE machinery.
