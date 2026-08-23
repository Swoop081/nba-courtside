# NBA Courtside v0.56 Validation

## Focused data/integration certification

- 80/80 `test_real_draft_pipeline_v56.py` checks passed.
- All eight real-entry years (2019–2026) contain exactly 60 alternate-timeline entrants.
- Official selection counts are preserved separately: 60 / 60 / 60 / 58 / 58 / 58 / 59 / 60.
- Undrafted fill entries have null official pick/team metadata.
- App and Game Day runtime references resolve to v0.56 assets.
- Formal save schema remains 25 / `nbaCourtsideSaveV25`.
- JavaScript syntax passed for `app-v0.56.js` and `gameday-v0.56.js`.

## Draft-pipeline runtime

`test_real_draft_pipeline_runtime_v56.js` generated all eight classes through the live `generateDraftClass()` path:

- 2019 Zion Williamson → 60 entrants
- 2020 Anthony Edwards → 60 entrants
- 2021 Cade Cunningham → 60 entrants
- 2022 Paolo Banchero → 60 entrants
- 2023 Victor Wembanyama → 60 entrants
- 2024 Zaccharie Risacher → 60 entrants
- 2025 Cooper Flagg → 60 entrants
- 2026 AJ Dybantsa → 60 entrants

The runtime also moved Victor Wembanyama to Boston while retaining San Antonio as historical destination metadata.

## Retained historical runtime

The v0.55 full 2018–19 historical runtime was rerun against v0.56:

- 494 opening players loaded.
- all 1,230 regular-season games simulated.
- alternate postseason completed.
- offseason advanced to 2019.
- 60 real 2019 entrants generated.
- Zion Williamson was assigned to Boston while New Orleans remained historical metadata.

Historical standalone Game Day also passed: `H18-0001` resolves as Philadelphia at Boston on October 16, 2018.

## Retained systems

- v0.52 30-team League AI planning/draft/extension runtime passed against `app-v0.56.js`.
- save migration/corrupt-save fallback passed against `app-v0.56.js`.
- The attempted full current-era offseason regression exceeded the build harness timeout before completion; v0.56 does not modify the current-era offseason path, and the focused/current League AI + save-migration probes pass. The v0.55 current-era full offseason certification therefore remains the retained evidence for that unchanged path.
