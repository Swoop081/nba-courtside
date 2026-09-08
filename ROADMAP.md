# NBA Starting5 — Product Roadmap

Last updated: 8 September 2026
Status: Proposed/approved roadmap scope. These features are tabled for future development and are not implemented unless explicitly stated otherwise.

## Core mode structure

The long-term main game modes are:

1. **Quick Play** — rename the current Play mode to Quick Play. Immediate Starting5 matches using the existing gameplay system.
2. **Season** — long-form NBA season with standings, evolving rosters, free agency, draft/offseason systems and future multi-season continuity.
3. **Dream Team** — MyTeam-style lineup-building mode using the complete current and classic player-card pool.

---

# Season — Free Agency / Roster Movement

## Roster model

- NBA teams continue to have exactly five active Starting5 players.
- Introduce a shared free-agent pool.
- Initial implementation can begin with **30 free agents: one additional player from each NBA team who is not currently part of that team's Starting5**.
- A team may sign only one player during one free-agency opportunity.
- Signing a free agent requires removing one player from that team's active Starting5.
- The dropped player immediately enters the shared free-agent pool and can later be signed by another team.
- This means roster talent moves through the league rather than disappearing.
- A team's entire Starting5 must never be overhauled in one transaction window.

## Two free-agency cycles per season

There are only **two free-agency opportunities per team per season**. Each league-wide cycle is split into three waves so struggling teams receive earlier access to the pool.

### Cycle 1

- After Game 10: the **current 10 worst eligible teams** receive their free-agency opportunity, ordered from worst record upward.
- After Game 15: re-rank the current standings and give the opportunity to the **next 10 worst teams that have not already acted in Cycle 1**.
- After Game 20: the **remaining 10 teams that have not acted in Cycle 1** receive their opportunity.
- Each team can appear only once across Games 10/15/20, regardless of how its record changes between checkpoints.

### Cycle 2

Cycle eligibility resets after every team has received its first opportunity.

- After Game 30: the **current 10 worst eligible teams** receive their second opportunity, ordered from worst record upward.
- After Game 35: re-rank standings and process the **next 10 worst teams that have not already acted in Cycle 2**.
- After Game 40: process the **remaining 10 teams that have not acted in Cycle 2**.
- Each team can appear only once across Games 30/35/40.

### Free-agency deadline

- Free agency closes completely after the Game 40 wave.
- There are no further free-agent opportunities for the remainder of that season.
- This intentionally ends roster movement around the arrival of the All-Star portion of the season.
- Free agency reopens under the next season's cycle.

## User-team behaviour

- When the user's team becomes eligible at one of the six checkpoints, present a dedicated **Free Agency Window** in Season.
- The user may make **one add/drop swap or skip the opportunity**.
- Signing or skipping marks that team's opportunity as used for that cycle.
- The user cannot act again until their next league-wide cycle.

## CPU-team behaviour

CPU roster decisions must be driven strongly by team performance rather than every team automatically trying to make a move.

- Poor/worst-record teams should actively search for upgrades.
- Top teams that are winning should generally prefer roster stability.
- Middle-of-the-standings teams should be selective and may need only one or two upgrades across the season.
- CPU teams may also stand pat if there is no worthwhile improvement.
- The free-agent candidate should be compared with the team's weakest/most replaceable starter, considering overall quality and positional/roster fit.
- A marginal improvement should not automatically trigger a transaction, particularly for a successful team.
- Because lower-ranked teams act first, they naturally receive first access to the strongest available free agents.

Suggested initial shopping likelihood, subject to balancing:

- Top 5 in conference: approximately 5–15% chance to seriously pursue a move.
- Upper-middle/playoff-level teams: approximately 15–30%.
- Middle teams: approximately 30–50%.
- Bottom 10 overall: approximately 55–75%.
- Bottom 3 overall: approximately 75–90%.

These percentages are starting balance targets, not a requirement to complete a transaction. A team still needs an acceptable upgrade.

---

# Season — Draft and Multi-Season Offseason

## Draft structure

- Add an NBA Draft after completion of each Season.
- Each draft contains **30 draftable players**.
- All 30 teams receive one pick.
- Draft order is based on reverse regular-season record: **worst record receives Pick #1**, then upward through the standings.
- Initial scope does not require lottery odds; the intended roadmap rule is worst-to-best record order unless later redesigned.

## Draft classes

- Season 1 offseason: use players/prospects from the upcoming **2027 draft class**, with game-appropriate projected/estimated Starting5 ratings.
- Season 2 offseason: use **2028** prospects with projected ratings.
- Season 3 offseason: use **2029** prospects with projected ratings.
- From subsequent seasons onward, generate fictional new draft prospects so Season can continue indefinitely.
- Generated players should have believable basketball identities: name, position, archetype/physical profile as appropriate, seven Starting5 category ratings and an overall rating rather than arbitrary unstructured values.

## Drafted-player roster resolution

- A drafted player does not create a sixth active roster slot.
- After a team drafts a player, determine whether the rookie is good enough/useful enough to enter that team's five-player active lineup.
- If the rookie enters the Starting5, one incumbent is removed and that incumbent enters the shared free-agent pool.
- If the drafted player does **not** earn a Starting5 place, the drafted player enters the shared free-agent pool instead.
- Therefore every team remains at five active players and both draft and free agency feed the same persistent roster ecosystem.
- CPU decisions should consider quality and roster/position fit rather than OVR alone.

## Long-term objective

The combination of draft classes, generated prospects, roster replacement and free agency should allow Season to continue across many years while league Starting5s gradually evolve.

---

# Dream Team

## Mode identity

- Add a third major mode called **Dream Team**.
- Dream Team is the NBA Starting5 equivalent of a MyTeam-style mode: build a five-player lineup over repeated match blocks.
- Players/cards are **not exclusive to one Dream Team roster**. The CPU/opposing Dream Team can own/use the same player as the user, just as duplicate player cards can appear on different MyTeam rosters.
- The available player pool includes **every eligible player card in the game, including current NBA teams and Classic Teams**.

## Starting a Dream Team

1. User selects a current NBA team as the starting team identity.
2. Randomly award **3 of that team's 5 Starting5 players**.
3. Determine the two positions still missing from the lineup.
4. For the first missing position, randomly draw an eligible player for that position from the complete available game card pool, including Classic Teams.
5. Repeat for the second missing position.
6. The result is the user's first complete five-player Dream Team lineup.

The two random additions do not need to belong to the selected franchise.

## Core progression loop

- Dream Team is played in **blocks of 5 matches**.
- Clearing/winning the five-match block earns a roster-choice reward.
- Present **3 random player cards** as the reward choices.
- The user may select one of those three players to replace somebody in the active five, or decline all three and keep the existing lineup unchanged.
- Continue into another five-match block and repeat the upgrade loop.
- Player replacement must preserve a valid five-player lineup/position structure unless Dream Team roster rules are deliberately expanded later.

## Future expansion possibilities

The base five-game-block loop should be built so it can later support difficulty progression, themed reward pools, Classic-player rewards, rarity/progression systems, streak rewards and other collectible-game systems without changing the fundamental Dream Team structure.

---

# Recommended implementation sequence

1. Preserve/stabilise the authoritative Starting5 gameplay core.
2. Build persistent mutable Season rosters and the 30-player initial free-agent pool.
3. Implement Cycle 1/Cycle 2 free-agency eligibility and CPU/user transactions.
4. Implement offseason/draft state and 2027–2029 draft-class data.
5. Implement generated future draft classes and multi-season roster continuity.
6. Rename Play to Quick Play and introduce the three-mode top-level structure.
7. Build Dream Team onboarding, persistent lineup state, five-game blocks and three-player upgrade rewards.

This file is the canonical roadmap reference for the approved/tabled Free Agency, Draft and Dream Team scope unless a later project decision explicitly supersedes it.
