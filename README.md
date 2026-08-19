# NBA Courtside — Franchise Shell v0.3

Frozen data baseline: 19 August 2026. This build sits directly on top of the 2026 Data Foundation v0.2 and is the first GM-mode interface prototype.

## What this build proves

- 30-team franchise selection screen.
- iPhone-first, portrait-heavy visual identity built around team colours, team logos and player photography.
- Franchise Home/GM Office with roster-size and cap-pressure warnings.
- Automatic five-position depth-chart projection and full signed roster display.
- Player profiles with 2025-26 statistical line, generated ratings, contract years, data confidence and age/development trajectory.
- Salary-cap dashboard using the frozen 2026-27 salary-cap/tax/apron thresholds.
- Future contract commitments by season.
- Free-agency screen that exposes only genuinely represented unsigned RFA cases in the current snapshot; it does not fabricate free agents.
- Trade Center prototype with team selection, up-to-three-player packages and a first-pass CPU trade-interest evaluator based on player quality, age, career trend and salary value.

## Deliberately not implemented yet

This is a GM shell, not the final transaction engine. It does not yet execute trades or signings. Exact 2026 CBA trade matching, exceptions, hard-cap triggers, dead money, guarantees, waivers, draft picks and offer-sheet rules are not enforced yet.

The next implementation layer should turn these screens into persistent league transactions and introduce the 2026-27 season/calendar/simulation loop.
