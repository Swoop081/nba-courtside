# NBA Courtside — v0.57 Casual-First Information Hierarchy + Advance Clarity

**v0.57 supersedes v0.56 as the working development baseline.** It retains the full v0.56 continuous real draft pipeline. The unfinished v0.53 long-save certification branch remains separate and is not folded into this release.


## v0.57 presentation / progression pass

- Home now follows a **casual-first hierarchy**: primary progression action → essential team/day context → broad league context → optional deep-dive systems.
- On off days, a compact **Next Game** card sits near the top so the player immediately understands what they are advancing toward.
- **Advance 1 Day** is now a large, high-contrast full-width CTA on mobile. It remains disabled only for real blocking GM decisions.
- Off-day training is explicitly labelled **optional**. A player can advance without choosing a training plan.
- Development Watch, GM/career detail, G League, draft watch, staff and other specialist systems are deliberately demoted below the casual information layer.
- The Home screen now records the presentation contract `primary-action-essential-context-broad-context-deep-dive` for regression testing.

## Headline change

A career beginning at **2018–19 Opening Night** can now progress through a real incoming-player pool in **every draft from 2019 through 2026**. The historical player identities are real; their alternate NBA destinations and careers remain determined entirely by the save.

Loaded full real-entry draft pools:

- 2019 — 60 real drafted identities
- 2020 — 60 real drafted identities
- 2021 — 60 real drafted identities
- 2022 — 58 official drafted identities + 2 real undrafted entrants
- 2023 — 58 official drafted identities + 2 real undrafted entrants
- 2024 — 58 official drafted identities + 2 real undrafted entrants
- 2025 — 59 official drafted identities + 1 real undrafted entrant
- 2026 — 60 real drafted identities

The existing source-backed 2027 watch class remains in place. Generated future classes currently begin in 2028.

## History still diverges

Real-world draft result/order/team is preserved only as historical metadata. The game never forces the real destination after the selected historical divergence point.

Examples verified in runtime:

- Zion Williamson retains New Orleans / No. 1 as historical metadata but can begin his alternate career with Boston.
- Victor Wembanyama retains San Antonio / No. 1 as historical metadata but can begin his alternate career with Boston.

The same rule applies to every player in the 2019–2026 pipeline.

## Forfeited picks after divergence

The real NBA had fewer than 60 official selections in 2022, 2023, 2024 and 2025 because of later pick forfeitures. A save that diverges in October 2018 does **not** automatically inherit sanctions imposed by future real-world events.

NBA Courtside therefore keeps a 60-selection alternate draft in those years and fills the otherwise empty slots with real undrafted entrants from that same entry year:

- **2022:** Keon Ellis, AJ Green
- **2023:** Craig Porter Jr., Colin Castleton
- **2024:** Trey Alexander, N'Faly Dante
- **2025:** Dink Pate

These players are explicitly stored with `officialHistoricalPick: null` and `officialHistoricalTeam: null`; their v0.56 draft slot is an alternate-timeline slot, not a claim that they were drafted in reality.

## No-hindsight ratings

The new classes use historical draft order/identity and position as pre-NBA evidence. Their initial skill translation and hidden upside remain uncertainty-first. Current/future NBA success is not copied backward to guarantee that stars become stars again.

## Existing historical starts

- **2018–19 Opening Night** — October 16, 2018 before Game 1; 494 opening-roster identities and all 1,230 real schedule matchups/dates.
- **2025–26 Postseason** — retained historical foundation start.
- **Current 2026–27** — retained current NBA Courtside start.

Historical contract-year continuity, pre-divergence traded future picks, exact opening injury durations and historical staff identities remain explicitly modeled where a dedicated certification pack has not yet replaced them.

## Architecture

The pipeline is data-driven through `data/historical-universes-v0.56.js`. Each entry separates:

- alternate-timeline `slot`;
- real `official_pick` (nullable);
- `entry_type` (`drafted` or `undrafted`);
- real historical destination metadata;
- simulated pre-career ratings/potential and scouting uncertainty.

Formal save schema remains **25** (`nbaCourtsideSaveV25`). Existing v0.55 historical saves remain compatible because v0.56 is additive and the historical state retains the same `state.historicalUniverseV54` namespace.

See `docs/REAL_DRAFT_PIPELINE_V56.md` and `docs/VALIDATION_V56.md`.
