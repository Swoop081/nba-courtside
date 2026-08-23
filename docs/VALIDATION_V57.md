# NBA Courtside v0.57 Validation

## Targeted hierarchy / progression checks

- `node --check app-v0.57.js` — PASS
- `python scripts/test_home_hierarchy_v57.py` — PASS 9/9
- `node scripts/test_offday_progression_runtime_v57.js` — PASS
  - historical Toronto save advances from 2018-10-16 to 2018-10-17 with no training plan selected;
  - league games are processed during the advance;
  - the off-day Next Game card exists before advancing.

## Retained-system runtime regression

- `node scripts/test_historical_opening_night_runtime_v57.js` — PASS
  - 494 opening-night players;
  - all 1,230 2018-19 regular-season games simulated;
  - postseason completed;
  - advanced into the real 2019 60-player draft pool;
  - historical draft destination metadata remains non-forcing.
- `node scripts/test_league_ai_runtime_on_v57.js` — PASS
  - all 30 front-office plans retained and multi-year stress audit completed.
- `node scripts/test_offseason_runtime_on_v57.js` — PASS
  - option gate, lottery, scouting, 60-pick draft, qualifying offers, free agency, summer league, training camp and next-season start retained.

## Presentation contract

Home now reports:

`primary-action-essential-context-broad-context-deep-dive`

Off-day training is optional and is not included in the calendar-blocker path.
