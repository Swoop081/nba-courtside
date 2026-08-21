# v0.39 Validation

Frozen 21 August 2026.

## New v0.39 gates

### Contract-market static / cache test

`python scripts/test_contract_market_v39.py`

PASS:
- v0.39 Franchise badge and contract-market config present;
- simulated-agent disclosure present;
- v0.39 Free Agency Live / counter / extension / sign-and-trade hooks present;
- Franchise, Game Day and Exhibition execute release-specific v0.39 runtime assets;
- canonical and release-specific app/Game Day/Exhibition runtime files match.

### Contract-market runtime test

`node scripts/test_contract_market_runtime_v39.js`

PASS representative negotiation probe:
- persistent `contractMarket.version = 39`;
- deterministic fictional simulated agent identity;
- three player priorities returned;
- isolated unsigned-player ask cooled from $18.000M on Day 1 to $15.030M on Day 6 with no competing offers;
- deliberately weak legal offer generated an agent counter rather than silently signing;
- accepting that counter created a formal pending offer;
- forced market resolution signed through the retained free-agency engine;
- agreement history persisted;
- Free Agency Live rendered required market/inbox/wire surfaces;
- a prospective in-save three-year contract exposed a legal four-year extension framework with a $24,249,267 maximum first-year amount.

## Retained v0.39 runtime gates

PASS:
- `test_ratings_v39.py`: 442 players / 393 NBA-evidence / 49 projection-only; median 72; 75 at 80+; 29 at 86+; 8 at 90+.
- `test_cba_source_long_tail_on_v39.js`: exact service years, Team Salary vs Apron Team Salary, Two-Way status, waivers/claims, DPE, Exhibit 10, cash ledger and extension helpers.
- `test_postgame_resume_on_v39.js`: real Game Day completion reloads safely; Continue/New Franchise bindings survive; Game Day returns via v0.39 route.
- `test_front_office_runtime_on_v39.js`: five CPU-acceptable legal Find Me Trades results for all five search goals, multi-asset search, incoming proposal, rumours and seeded CPU-to-CPU deal.
- `test_g_league_runtime_on_v39.js`: G League layer, affiliate, Two-Way status, call-up and deterministic schedule.
- `test_college_draft_runtime_on_v39.js`: persistent College/Draft world, 30-player board/mock, scouting confidence and 60-player draft-class bridge.
- `test_league_events_runtime_on_v39.js`: All-Star, contests, playoff race, awards, Combine and Summer League bridge.
- `test_player_relations_runtime_on_v39.js`: roles, morale, coach trust, chemistry, promises and no-trade restriction.
- `test_staff_careers_runtime_on_v39.js`: 30 staff organizations, market, job security and bounded coaching impact.
- `test_free_agency_scaling_v25.js`: five-season market scaling through 2031; largest measured free-agent pool 476 and maximum opening CPU round 2.342s in the release environment, under the retained 8s pathology gate.
- `test_transaction_edges_v22.js`: TPE/minimum/sign-and-trade/reacquisition/rookie/aggregation edge cases.
- `test_save_migration_v25.js`: schema-25 migration and corrupt-save fallback.
- `test_cup_integration_on_v39.js`: full 1,230-game regular season, NBA Cup progression, Cup champion, max player GP 82.
- JavaScript syntax checks for `app.js`, `app-v0.39.js`, `gameday-v0.39.js` and `exhibition-v0.39.js`.

## Source-safety boundary

No new factual real-world agent identities or private negotiation preferences were added. All v0.39 agent/agency/personality content is fictional gameplay simulation. Existing contract/CBA source boundaries remain in force, including the intentional refusal to fabricate historical original signing dates needed for some starting-veteran extension anniversaries.
