# NBA Courtside v0.33 — Validation

## Active Front Offices certification

`python scripts/test_active_front_offices_v33.py`

Result: **PASS** — schema 25 retained; Living League version 33; 30 organizations; six simulated GM models; five Find Me Trades goals; deadline/rumor/negotiation/pick-protection surfaces; release-specific runtime assets; certified rating smoke values.

## Front-office runtime

`node scripts/test_front_office_runtime_v33.js`

Result: **PASS** — Living League migrates to 33; all five Find Me Trades goals return five CBA-legal CPU-acceptable frameworks in the Boston test universe; a multi-asset player+pick shop also returns five; a forced incoming proposal is valid; daily rumor generation runs; and a seeded January market probe completes a legal CPU-to-CPU trade. GM/coach models resolve.

## Ratings / source retention

`python scripts/test_ratings_v33.py`

Result: **PASS** — 442 players; 393 exact-source 2025–26 NBA evidence rows; 49 explicit projection-only players; median OVR 72; 75 players 80+; 29 players 86+; 8 players 90+. The certified v0.29 ratings and non-rating player core remain intact.

## Cache coherence

`python scripts/test_cache_coherence_v33.py`

Result: **PASS** — Franchise, Game Day and Exhibition use release-specific v0.33 runtime URLs and certified Boston rating smoke values are present in the shipped browser bundle.

## Postgame resume

`node scripts/test_postgame_resume_v33.js`

Result: **PASS** — a completed Game Day serializes into the franchise save, Continue/New Franchise remain bound and Game Day returns through the v0.33 cache key.

## CBA source long-tail

`node scripts/test_cba_source_long_tail_v33.js`

Result: **PASS** — 442 players, 393 NBA evidence rows, 49 projection rows; Years of Service, waivers, DPE, Two-Way salary, cash limits and related retained CBA helpers remain certified.

## NBA Cup integration

`node scripts/test_cup_integration_v33.js`

Result: **PASS** — 1,230 regular-season results, complete Cup progression, 67 Cup competition games and no player above 82 regular-season GP.

## Save / transaction / postseason / offseason retention

The following retained gates pass after the v0.33 document-head compatibility hardening:

- `node scripts/test_save_migration_v25.js`
- `node scripts/test_transaction_edges_v22.js`
- `node scripts/test_offseason_bridge_v24.js`
- `node scripts/test_postseason_v21.js`

They certify schema-25 migration/corrupt fallback, transaction edge cases, the full offseason bridge and postseason completion.

## Mobile / menu / accessibility

- `python scripts/test_main_menu_v28.py` — **PASS**
- `python scripts/test_device_layout_v26.py` — **PASS**
- `python scripts/test_modal_accessibility_v26.py` — **PASS**

## Long-horizon durability

`node scripts/test_long_horizon_v25.js`

Result: **PASS** — 10 seasons through 2036, 600 generated players, final 1,042-player universe, 1,020 draft assets and 2,915,141-byte final save (below the retained 4.5 MB safety gate).

## JavaScript syntax

The release checks syntax for `app-v0.33.js`, `app.js`, `gameday-v0.33.js`, `exhibition-v0.33.js`, `cba-v0.33.js` and `data/organizations-v0.33.js`.

All pass.
