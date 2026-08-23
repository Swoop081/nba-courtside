# v0.48 — Full Playability + Mobile Presentation Audit

## Design rule

Every major screen is now audited against this hierarchy:

1. **Action** — what the GM can or must do now.
2. **Decision context** — the minimum information required to make that action.
3. **Supporting information** — roster, cap, news, scouting, health and league context.
4. **History/detail** — logs, archives, explanatory depth and secondary presentation.

## Scope

This is a presentation/interaction consolidation. It intentionally does not alter ratings, simulation, CBA legality, transaction value, career outcomes, league history or save schema. Existing interactive nodes are moved rather than duplicated so IDs, event listeners, disabled states and blocking logic remain authoritative.

### Franchise Home
- Primary Action Zone is first.
- The redundant broadcast masthead is hidden because the persistent franchise context bar already carries team/date/record state.
- Active Deadline Day, team alerts, Game/Team Today, Franchise Direction and Offseason Command context appear before editorial modules.

### Team / Deals / specialist screens
- Team and Deals destination controls precede snapshots.
- Roster rotation controls are first on Roster + Rotation.
- Pending Player Relations conversations are promoted as decisions.
- Medical, Staff and College tab controls precede large presentation heroes.
- Cap DPE/stretch elections are promoted when present.

### Offseason
- Team Options and Rights/QO decision lists are physically moved into the action zone.
- Draft Night promotes the top three selectable prospects to the first action viewport while retaining the rest of Best Available below.
- Free Agency advancement and pending offers precede spending-tool exposition.

### Transactions
- Trade Center keeps partner selection, current deal math and Propose Trade together at the top.
- Player profile transaction/contract actions appear immediately under the profile hero.

### Game Day / Exhibition
- Pregame Watch/Sim or Tip Off follows the matchup immediately.
- Live controls follow the scoreboard immediately; scoreboard remains sticky on compact phones.
- Coaching, availability, rotations, feed and box score follow the live controls.

### Mobile density
- Workspace and broadcast heroes are shorter.
- Secondary body copy may collapse visually on very small devices while labels and actions remain readable.
- Destination cards collapse to one-column on iPhone.
- Major controls have larger touch targets and safe-area behavior is preserved.
