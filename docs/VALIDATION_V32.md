# NBA Courtside v0.32 — Validation

## Daily Broadcast certification

`python scripts/test_daily_broadcast_v32.py`

Certifies the 30-team organization/media seed, release-specific runtime assets, ratings smoke values, schema-25 save compatibility, Living League version-32 migration, the NBA Courtside Live masthead, League Wire, day-change digest, Training Center, program-specific media modules, social feed, Performance of the Night treatment and structured Advance the League control. It also rejects a return to the legacy `hero()` dashboard on the Living League Home.

Result: **PASS**.

## Cache coherence

`python scripts/test_cache_coherence_v32.py`

Result: **PASS** — Franchise, Game Day and Exhibition use release-specific v0.32 runtime URLs and the certified ratings values are unchanged.

## Postgame resume

`node scripts/test_postgame_resume_v32.js`

Result: **PASS** — a real Game Day result serializes, Franchise boots the save, Continue/New Franchise remain bound and Game Day returns through the v0.32 cache key.

## NBA Cup integration

`node scripts/test_cup_integration_v32.js`

Result: **PASS** — 1,230 regular-season results, complete Cup progression and no player exceeds 82 regular-season GP.

## CBA long-tail

`node scripts/test_cba_source_long_tail_v32.js`

Result: **PASS** — service years, Two-Way accounting, waivers, DPE, Exhibit 10, cash ledgers and extension/stretch helpers retain certified behavior.

## JavaScript syntax

`node --check app-v0.32.js`
`node --check gameday-v0.32.js`
`node --check exhibition-v0.32.js`
`node --check cba-v0.32.js`
`node --check data/organizations-v0.32.js`

All pass.

## Scope

v0.32 is a presentation layer on top of v0.31. Ratings, rosters, contracts, schedule, CBA, future-pick logic, granular Game Day profiles and save schema are unchanged.
