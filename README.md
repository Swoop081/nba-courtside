# NBA Courtside — v0.18 Source Certification + Asset Safety

NBA Courtside is an iPhone-first NBA franchise/GM simulator. You run one franchise; games play themselves from the roster, rotations, ratings, fatigue and availability while every GM decision persists in an alternate-history league.

v0.18 is a **source-certification and safety pass**. It closes the parts of the current-day database we can audit safely, exposes the parts that still rely on calibrated bootstrap/inference, and prevents unresolved real-world draft rights from becoming fake tradeable assets.

## v0.18 headline systems

- **Exact 2025–26 final team records** — all 30 prior-season records are loaded and reconcile to 1,230 wins / 1,230 losses.
- **NBA Cup deep tiebreak fixed** — v0.17's pot-tier proxy is removed. After the primary Cup tiebreaks, the simulator now uses the actual prior-season record, then a deterministic draw if required.
- **442/442 contract-structure audit** — frozen current rows are checked for identity, age, position, expiry, listed salary years and player/team option markers.
- **RFA rights preserved** — Jalen Duren, Bennedict Mathurin and Peyton Watson remain frozen as unsigned restricted-free-agent rights cases rather than invented signed contracts.
- **420-cell future-pick origin ledger** — every team × 2027–2033 × both rounds has a safety cell.
- **Source-lock policy** — complex/frozen/unresolved pick rights are visible but nontradeable instead of being flattened into guessed ownership.
- **Safe pick migration** — untouched old ownership is repaired to the certified starting owner, while trades already made inside the user's universe are preserved.
- **Player-stat provenance** — 34 season-complete verified current rows, 358 bootstrap-hybrid rows and 50 projection rows are now explicitly labeled.
- **Player-facing source status** — Home and Player Profile surfaces show what is verified, bootstrap-derived or engine-inferred.
- **v0.18 save migration** — prior saves migrate into `nbaCourtsideSaveV18` without resetting the franchise universe.

## Full playable loop

`GM HOME → OFFICIAL REGULAR SEASON → NBA CUP → GAME DAY → LEAGUE PULSE → TRADE DEADLINE → PLAY-IN → PLAYOFFS → FINALS → LOTTERY → SCOUTING → DRAFT → FREE AGENCY → TRAINING CAMP → NEXT SEASON`

All v0.17 official-schedule/Cup systems, v0.16 simulation calibration, injuries, morale, smart front offices, draft assets, contracts/CBA routes, competitive free agency and postseason/offseason systems remain active.

## Save

Primary save key: `nbaCourtsideSaveV18`.

Fresh 2026–27 franchises use `scheduleMode: official_2026`. Existing v0.17/v0.16 and earlier saves are migrated. An already-in-progress legacy 2026 save still keeps its original schedule scaffold rather than having completed games silently remapped.

## Source-certification boundary

v0.18 deliberately does **not** claim that the entire current-day data layer is canonical-final.

Still explicit:
- **358** stat-backed player rows remain `bootstrap_hybrid` pending a complete season-final import and full-population rating regeneration/recalibration.
- Initial individual **Bird / Early Bird / Non-Bird clocks remain engine-inferred** rather than source-certified.
- The future-pick ledger is a complete **origin-right safety ledger**, not a fully executable graph for every nested swap and second-round conveyance.
- Specialist CBA edge cases remain part of the ongoing certification roadmap.

See `docs/SOURCE_CERTIFICATION_V18.md` and `docs/ONE_POINT_ZERO_READINESS.md`.

## Validation

See `docs/VALIDATION_V18.md`.

Open `index.html` to play.
