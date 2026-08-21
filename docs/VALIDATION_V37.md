# Validation — v0.37 League Events, Awards + Season Moments

## New v0.37 gates
- additive `state.leagueEvents.version = 37` without formal save-schema bump
- existing v0.36 saves have a catch-up path for eligible passed event dates
- 24-player simulated All-Star roster: 12 East / 12 West, five starters + seven reserves each
- Three-Point Contest, Dunk Contest, Rising Stars and All-Star Game complete and persist
- All-Star MVP generated without touching regular-season statistics
- live MVP / DPOY / ROY / Sixth Man / Most Improved / Coach of the Year ladders
- final six major award winners
- simulated top-five voting-share breakdowns
- All-NBA First / Second / Third Teams, five players each
- All-Defensive First / Second Teams, five players each
- All-Rookie First / Second Teams when the rookie pool supports them
- 30-team playoff-race snapshot and persistent clinch/elimination moments
- deadline desk driven by the existing Active Front Offices rumor/deal state
- official 2027 3-2-1 lottery foundation retained: 16 participants, 3/2/1 allocation, draft relegation, No. 12 relegation floor and repeat-pick restrictions
- commissioner-led Lottery presentation with all 16 first-draw shares
- Combine runtime with persistent simulated measurement/testing evidence
- Draft Night commissioner/deputy presentation and draft grades
- five-game Summer League bridge with persistent MVP/standout state
- Daily Hub / League portals and simulated social-event reactions
- release-unique v0.37 Franchise / Game Day / Exhibition runtime URLs
- JavaScript syntax checks for canonical and release-specific runtime assets

## Representative v0.37 runtime probe
The deterministic certification universe verifies:
- event state version 37
- 12 East + 12 West All-Stars
- contest winners and All-Star MVP
- 30-team playoff-race state
- MVP / DPOY / ROY / Sixth Man / Most Improved / Coach of Year generation
- 5 / 5 / 5 All-NBA teams
- 20-player Combine test pool
- five-game Summer League bridge and MVP
- League Events, All-Star and Awards Show rendering

Winner names from this synthetic certification universe are test outputs only and are not intended as real-world predictions.

## Retained gates re-run on v0.37
- `test_league_events_v37.py`
- `test_league_events_runtime_v37.js`
- `test_cache_coherence_v37.py`
- `test_ratings_v37.py`
- `test_projection_runtime_v29.js`
- `test_college_draft_runtime_on_v37.js`
- `test_g_league_runtime_on_v37.js`
- `test_front_office_runtime_on_v37.js`
- `test_player_relations_runtime_on_v37.js`
- `test_postgame_resume_on_v37.js`
- `test_cba_source_long_tail_on_v37.js`
- `test_cup_integration_on_v37.js`
- `test_save_migration_v25.js`
- `test_transaction_edges_v22.js`
- `test_offseason_bridge_v24.js`
- `test_draft_offseason_v21.js`
- `test_postseason_v21.js`
- `test_main_menu_v28.py`
- `test_device_layout_v26.py`
- `test_modal_accessibility_v26.py`

## Retained certification anchors
- ratings/source: 442 players; 393 final-NBA evidence rows; 49 projection-only; median OVR 72; 75 rated 80+; 29 rated 86+; 8 rated 90+
- College + Draft: 44 tracked programs; 30 source-backed watch prospects; 30-player Big Board; 30-pick mock; 60-player draft persistence with explicit fictional second-round boundary
- G League: 31 teams; 30 NBA affiliates; deterministic scheduling/call-up path retained
- Active Front Offices: five CPU-acceptable Find Me Trades results for every search goal in the representative test; multi-asset search; seeded CPU-to-CPU legal trade
- Player Relations: roles, morale, coach trust, chemistry, conversations, promises, extension outlook and enforced no-trade commitment remain operational
- NBA Cup: 1,230 regular-season results; max player GP 82 in the integration test
- save migration: formal schema remains 25 / `nbaCourtsideSaveV25`
- transaction/CBA/postseason/offseason/mobile/cache regressions remain green

## Long-horizon note
The inherited v0.35 10-season durability certification remains part of the unchanged foundation. A fresh v0.37 run of the same heavy durability harness exceeded the local five-minute command timeout rather than returning a product assertion failure, so v0.37 does **not** claim a newly completed 10-season durability gate.
