# NBA Courtside — v0.27 Main Menu + Boot Recovery Hotfix

**Frozen:** 20 August 2026  
**Baseline:** v0.26 Presentation Polish + Device QA  
**Save schema:** 25 (`nbaCourtsideSaveV25`)

## v0.27 hotfix

- Boots to a real **Main Menu** instead of dropping directly into team selection.
- Main Menu routes: **Continue Franchise**, **New Franchise**, and **Exhibition**.
- Team selection is now a separate screen with a Back action.
- The in-franchise top-right button now returns to Main Menu without deleting the save.
- Starting a new franchise only replaces the current save after a team is chosen and confirmed.
- Repairs the literal escaped `\n` markup that was visible above the app on iPhone Safari and could prematurely terminate the document head.
- Storage reads/writes are guarded; unavailable local storage no longer aborts franchise boot, with session storage used where available.
- Game Day now reads/writes schema-25 saves first; Exhibition also reads the current v25 franchise universe first.
- No basketball data, ratings, simulation calibration, schedule, CBA, Bird-right, future-pick, or schema changes.

## Retained v0.26 release notes


NBA Courtside is an iPhone-first NBA franchise/GM simulator. **v0.25 supersedes v0.24 as the current working baseline.** This pass freezes the certified basketball/CBA model and hardens the app for a current-day 1.0 release candidate: accessibility, rendering performance, save migration and multi-season durability.

## v0.25 headline changes

- **Formal save schema 25** under `nbaCourtsideSaveV25`, with migration from supported legacy saves and per-key corruption fallback so a damaged newest save does not block recovery from a healthy older save.
- **Accessibility hardening:** skip links, visible keyboard focus, dialog semantics, Escape-to-close, `aria-current` navigation, polite live-region toasts, larger primary touch targets, reduced-motion support and increased-contrast support.
- **Mobile/rendering performance:** lazy player images, async image decoding, franchise-script preload hints, CSS containment on large repeated rows and scroll-snap containment for horizontal rails.
- **Free-agency scaling:** each CPU market round caches team roster/direction/need/cap context and pending-offer counts instead of rebuilding those structures inside every player/team evaluation.
- **Long-horizon durability:** an ten-season durability gate reaches 2036 with ten full 60-pick drafts, 600 generated prospects, future-pick horizon expansion to 1,020 cells, legal standard/Two-Way roster limits, unique player IDs and a JSON save round-trip after every season. Final serialized stress save: 2,915,788 bytes.
- The retained full offseason regression continues to certify the complete seven-day free-agency / training-camp bridge; the long-horizon gate adds repeated state-growth and migration pressure rather than replacing that behavioral test.

## Certified basketball/source foundation retained

- 442 player/right records.
- 393 season-final 2025–26 NBA evidence rows + 49 separate source-backed projections.
- 442/442 certified NBA Years of Service and first actionable Bird-right outcomes.
- 420/420 2027–2033 draft-origin cells, with executable claims and unresolved/pending rights safely locked.
- v0.22/v0.24 transaction engine: TPEs, sign-and-trade/BYC, waiting periods, apron restrictions, waiver claims, DPE, Two-Way/Exhibit 10, Team Salary / Apron Team Salary and related CBA long-tail mechanics.

## Source-safety boundary

v0.25 does not reinterpret or fabricate unresolved real-world inputs. The seven source-locked/pending future-pick cells and unsourced historical incentive/bonus/guarantee/signing-date details retain their existing safe boundaries.

## Validation

See `docs/VALIDATION_V25.md`, `docs/RELEASE_READINESS_V25.md` and `data/source-certification-v0.25.json`. The release gate includes save migration, accessibility/static interaction checks, ten-season durability, CBA/Bird/pick-tree regressions, Draft Night/offseason, NBA Cup, Game Day, postseason, official schedule and JavaScript syntax.

## Save compatibility

v0.25 writes **`nbaCourtsideSaveV25` / schema 25**. Supported legacy saves are migrated into a fully initialized v0.25 state. The loader attempts keys independently, so unreadable newer JSON can fall back to the next healthy supported save instead of destroying the franchise.


## v0.26 presentation release pass

- Retains the v0.25 schema-25, basketball, source, CBA and simulation foundation.
- Adds all-edge safe-area handling and dynamic viewport units for modern mobile browser chrome.
- Adds compact-phone reflow at 430/390/350 px and short-landscape handling.
- Improves dense text legibility without expanding the general mobile hierarchy.
- Modal sheets are inert/hidden to assistive tech when closed, trap keyboard focus while open, and restore focus to the invoking control when dismissed.
- Game Day and Exhibition receive compact scoreboard, controls, rotation, box-score and matchup scaling.
- New static device-layout and modal-focus audits are included in `scripts/`.
