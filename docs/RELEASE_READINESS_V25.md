# NBA Courtside — Release Readiness v0.25

## Scope

v0.25 is a release-hardening pass. Player evidence, ratings, simulation calibration, Bird rights, draft-right logic and specialist CBA behavior are retained from v0.19–v0.24 unless a release test exposed an integration defect.

## Accessibility / interaction

- Skip-to-content links on Franchise, Game Day and Exhibition surfaces.
- Visible `:focus-visible` treatment for keyboard users.
- Bottom navigation reports the active view with `aria-current="page"`.
- Modal sheet has dialog semantics, an accessible label and Escape-to-close behavior.
- Toast/status feedback uses a polite live region.
- Primary navigation is at least 46 px high; close control is 44×44 px; repeated action controls use a 40 px floor.
- `prefers-reduced-motion` removes nonessential motion and smooth scrolling.
- `prefers-contrast: more` strengthens muted text/borders.
- Small-screen metadata receives a minimum readability bump without changing the compact iPhone-first hierarchy.

The static checks target practical WCAG 2.2 AA release hardening; they are regression checks, not a claim that automated checks alone constitute a complete conformance audit.

## Performance

- Player imagery is lazy-loaded except priority hero portraits and decoded asynchronously.
- Franchise data/CBA/app scripts are preloaded on the main shell.
- Large repeated roster/contract/transaction/depth rows use CSS containment where safe.
- CPU free agency caches team context once per round: roster, needs, direction, signed count, previous record, market profile, aggression and cap.
- Pending CPU offers are counted once per round instead of repeatedly flattening the growing offer book in the innermost market loop.

## Save migration

- New primary key: `nbaCourtsideSaveV25`.
- New schema: 25.
- Migration fully initializes all v0.24 transaction-state structures.
- Supported older keys are attempted independently. A malformed v0.25 payload can therefore fall back to a healthy v0.18 or other supported save.
- `migratedFrom` and `lastSavedAt` provide basic migration/audit metadata.

## Long-horizon gate

The durability harness executes ten consecutive franchise transitions through 2036. Each cycle includes retirement/development, lottery, a full 60-pick Draft Night, compressed market completion (the complete seven-day market is separately covered by the offseason bridge), training camp, roster validation, future-pick-horizon expansion, next-season start and JSON save round-trip.

Frozen stress result:

- End year: **2036**
- Seasons: **10**
- Generated prospects: **600**
- Player objects: **1,042** (including retired/historical player objects retained for league history)
- Draft-asset cells: **1,020**
- Serialized v0.25 save: **2,915,788 bytes**
- Safety gate: **< 4.5 MB**
- Standard roster maximum violations: **0**
- Two-Way maximum violations: **0**
- Duplicate player IDs: **0**

## Remaining non-blocking boundaries

- Seven current source-locked/pending future-pick origin cells remain intentionally non-executable where the public transaction chain is unresolved.
- Unsourced historical incentive/bonus/guarantee and original-signing-date fields remain zero/locked.
- Cash is accounted for but still not a primary trade-builder asset.
- Claim-level draft-right trading and deeper Two-Way/G League logistics are optional post-1.0 depth.
- Historical-season universes remain a later expansion track.

## Free-agency scaling gate

A separate production-path test executes five consecutive real opening CPU free-agency rounds while the pool grows from 143 to 480 players. Round times in the release environment were 848 ms, 1,057 ms, 1,048 ms, 1,630 ms and 2,176 ms. The release threshold is intentionally loose at 8 seconds: it is a regression alarm for accidental pathological scaling, not a claim about end-user device speed.
