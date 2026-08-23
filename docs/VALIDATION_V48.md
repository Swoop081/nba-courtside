# NBA Courtside v0.48 Validation

## Release target

**v0.48 — Full Playability + Mobile Presentation Audit**

This release is intentionally presentation/interaction-only. Formal franchise saves remain schema **25** under `nbaCourtsideSaveV25`; no ratings, CBA, trade valuation, simulation, career-outcome or league-history rules were changed.

## Focused v0.48 checks

`python3 scripts/test_playability_mobile_v48.py`

**64/64 passed.** Coverage includes:

- v0.48 HTML/runtime pinning and local script resolution;
- schema-25/save-key retention;
- v0.44 Trade Deadline, v0.45 Offseason, v0.46 GM Career and v0.47 League History state retention;
- Primary Action Zone ordering;
- Home duplicate-context removal;
- Team/Deals workspace ordering;
- Roster + Rotation action priority;
- Player Relations pending-decision priority;
- Medical/Staff/College specialist navigation priority;
- Trade partner + live deal math placement;
- Free Agency pending-offer priority;
- Team Option and Rights/QO decision promotion;
- Draft Night top-three selectable prospects in the first action viewport;
- Player-profile transaction/contract actions directly below the player hero;
- compact-phone touch targets and one-column destination layout;
- Game Day Watch/Sim before availability/depth context;
- live Game Day controls immediately below the scoreboard;
- Exhibition Tip Off before depth charts and live controls immediately below the scoreboard;
- JavaScript syntax for all three v0.48 runtime files.

## Retained structural/integration suites on the v0.48 runtime

- **League History:** 30/30 passed (`test_league_history_on_v48.py`).
- **GM Career + Employment:** 48/48 passed (`test_gm_career_on_v48.py`).
- **Trade Deadline + Transaction Presentation:** 66/66 passed (`test_trade_deadline_on_v48.py`).
- **Offseason Command Center:** 74/74 passed (`test_offseason_command_center_on_v48.py`).

## Runtime regression probes

- **League history runtime:** passed. A completed season archived champion, Finals MVP, all 30 standings rows and player totals; retirement and draft records persisted; changing the controlled team did not mutate history.
- **GM career runtime:** passed. Dismissal → vacancy → interview → offer → new-team transition completed without resetting assignments or draft assets.
- **Offseason runtime:** passed. Options → Lottery → Scout/Combine → Draft → Rights/QO → Free Agency → Summer League → Training Camp → next season completed with a **15-player Opening Night roster** and **240 rotation minutes**.
- **Save migration:** passed. Schema 25 remained authoritative, v18 migration remained supported, corrupt-save fallback remained functional and the active legacy schedule boundary remained handled.
- **Game Day coaching runtime:** passed. Assisted coaching completed with an eight-player rotation totaling **240 minutes**, timeout/manual-sub/matchup/halftime paths intact.

## Packaging/runtime integrity

- `node --check app-v0.48.js` — pass.
- `node --check gameday-v0.48.js` — pass.
- `node --check exhibition-v0.48.js` — pass.
- All runtime script references in `index.html`, `gameday.html` and `exhibition.html` resolve locally.
- Main Menu and Exhibition cache/query presentation are pinned to v0.48.

## Device limitation

A physical iPhone Safari touch/layout smoke test was not performed inside the build environment. The release uses static hierarchy checks and runtime regression coverage for the mobile presentation changes; final physical-device feel should still be verified during playtesting, especially sticky specialist tabs, compact first-viewport density and sheet scrolling.
