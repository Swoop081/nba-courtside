# v0.27 — Main Menu + Boot Recovery Hotfix

v0.27 is a release-blocking UX/boot hotfix on top of v0.26. It does not alter basketball simulation, data, CBA, contracts, draft rights, schedule, or the schema-25 franchise model.

## Main Menu

The franchise page now boots to a persistent Main Menu with three explicit routes:

- Continue Franchise — shown only when the loaded save has a valid user team.
- New Franchise — opens team selection as a separate screen.
- Exhibition — opens the standalone matchup mode without requiring a franchise save.

The franchise header menu button returns to Main Menu non-destructively. A new save is only created after a team is selected; when a franchise already exists, replacement requires confirmation.

## Boot repair

v0.26 contained literal escaped `\\n` characters around an inherited postseason style block. In Safari these characters were rendered above the app and caused the HTML parser to leave the document head early. v0.27 replaces those escaped markers with real newlines and keeps the style blocks inside the head.

Storage access is also wrapped. If localStorage is unavailable, boot continues instead of throwing before the menu/team grid renders. sessionStorage is used as a fallback when the browser permits it; otherwise the current tab remains playable but cannot persist a franchise.

## Cross-mode save handoff

Game Day now prefers `nbaCourtsideSaveV25` and writes schema 25. Exhibition now reads v25 first before older supported saves. This keeps both routes aligned with the v0.25/v0.26 franchise save baseline.
