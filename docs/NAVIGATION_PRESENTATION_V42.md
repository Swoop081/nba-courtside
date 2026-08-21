# NBA Courtside v0.42 — Navigation + Presentation Consolidation

## Purpose

v0.42 is a whole-product information-architecture pass on top of v0.41. It does not add another basketball simulation subsystem. It makes the existing Living League easier to understand and operate on an iPhone.

## Primary navigation

The bottom bar is reduced to five worlds: **Home / Team / League / Deals / More**. Detailed systems live inside those worlds instead of competing for permanent navigation space.

- **Home:** Daily Hub / league day.
- **Team:** roster + rotation, Player Relations, Health + Performance, Staff + Organization, Contracts + Cap.
- **League:** NBA Pulse, standings/schedule/leaders plus League Events, College + Draft and G League portals.
- **Deals:** Trade Center, Free Agency Live, cap/rights and G League talent pipeline.
- **More:** global search and specialist destinations.

## Universal GM inbox

One Action Center aggregates decisions that require the GM rather than making the user discover blockers on unrelated pages. Formal trade offers, blocking player conversations, staff vacancies and user RFA match decisions are marked **Required**. Return-to-play recommendations appear as non-blocking medical review items. Existing underlying legality/decision systems remain authoritative.

## Persistent context

The compact sticky header keeps franchise, record, league date, current day state and required-action count visible across destinations. Bottom-nav highlighting follows the current world even when the user is inside a detail destination such as Medical Center or Player Relations.

## Global search

Search is intentionally lazy and only builds results after two typed characters. It searches NBA players, NBA teams, the current College + Draft prospect pool and the frozen organization/staff directory. Player/team/prospect results open in context instead of changing the league day.

## Mobile rules

- Five primary destinations only.
- Compact sticky context header.
- Team and Deals use portal-style workspaces rather than rendering every subsystem at once.
- Two-column workspace cards collapse to one column on compact phones.
- Search results are scroll-contained.
- Existing safe-area and bottom-nav spacing remain preserved.

## Compatibility

Formal save schema remains **25** (`nbaCourtsideSaveV25`). v0.42 adds only `state.ui42.version = 42` preferences. v0.41 Game Day coaching, v0.40 Health, v0.39 contract market, v0.38 staff careers and all earlier simulation/data foundations remain unchanged.
