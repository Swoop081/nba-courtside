# NBA Courtside — Presentation Polish v0.26

## Scope

v0.26 is a presentation-only release pass on top of v0.25. It does not retune player ratings, simulation constants, contracts, Bird rights, draft-right resolution, the official schedule, NBA Cup logic or CBA legality.

## Mobile layout

- Franchise, Game Day and Exhibition now use dynamic viewport height where supported.
- Safe-area insets are respected on all four edges, including landscape notch/island layouts.
- 430 px, 390 px and 350 px responsive gates progressively compress dense surfaces instead of shrinking text indefinitely.
- Five-across starter/live-lineup views remain intact on normal iPhone widths; the smallest fallback becomes a horizontal snap rail rather than illegible cards.
- Offseason progress and League tabs switch to horizontal snap rails on compact phones instead of forcing five/four equal columns.
- Player profile stat blocks, CBA trade bands, free-agent offers, trade summaries and prospect actions reflow where necessary.

## Game Day / Exhibition

- Compact scoreboards reduce logo/score/clock widths before text clips.
- Three live-game controls reflow to a two-column layout with the primary live control full-width on compact phones.
- Rotation rows and moment cards reduce image footprints while protecting player names.
- Box-score columns tighten proportionally at 390/350 px rather than overflowing the viewport.
- Short landscape viewports receive shallower matchup heroes and safe top spacing.

## Accessibility interaction

The Franchise detail sheet is now truly modal from a keyboard/assistive-technology perspective:

- `aria-hidden=true` + `inert` while closed.
- `aria-hidden=false` and `inert` removed while open.
- Focus moves into the dialog when it opens.
- Tab/Shift+Tab are contained inside the open sheet.
- Closing via Escape, backdrop or close button restores focus to the invoking control when it still exists.

The existing v0.25 reduced-motion, increased-contrast, visible-focus, skip-link, touch-target and live-region work remains intact.

## Physical-device boundary

The included QA is deterministic static/runtime regression coverage. It cannot reproduce Safari/Chrome browser chrome, font rasterization, GPU compositing, VoiceOver gesture feel or physical touch accuracy. A final physical iPhone smoke test is still a release recommendation, not a missing game-system dependency.
