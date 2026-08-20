# v0.15 — Draft + Offseason Experience

## Goal
The offseason should feel like a sequence of major front-office events, not a menu between seasons. v0.15 makes the GM responsible for the complete transition from the championship to the next Opening Night.

## 1. Lottery Night
`beginOffseason()` now transitions into `phase: lottery` instead of jumping directly to the draft.

The save stores the already-resolved draft order, but the player-facing screen reveals the lottery from No. 16 to No. 1. Original slot and current owner are separated so traded/protected pick rights remain understandable.

Player actions:
- Reveal next pick.
- Reveal all.
- Enter Scouting Hub after the board is complete.

## 2. Scouting Hub
Each generated future class starts with 18 scouting points.

Prospects begin with a broad current-ability estimate and ceiling range. The true internal development ceiling remains hidden.

Scouting levels:
- Initial file.
- Basic report.
- Advanced report.
- Full report.

Higher levels narrow the current-OVR uncertainty range and the ceiling range. Advanced/full reports reveal strengths and concerns.

Private workout:
- Costs 3 points.
- Guarantees at least an advanced report.
- Reveals the prospect archetype and deeper traits.

The GM can:
- reorder the draft board with up/down controls;
- mark up to eight target prospects;
- inspect a dedicated prospect sheet;
- preserve unused scouting points into Draft Night for last-minute work.

## 3. Draft Night
The draft no longer silently jumps through every CPU selection until the user's next pick.

Every pick can be followed live:
- `SIM PICK` advances one CPU selection;
- `SIM TO MY PICK` jumps to the next user-owned slot;
- user selections come directly from the user board;
- the 60-pick tracker shows selection owner and drafted player;
- recent selections remain visible as a live feed.

CPU selection logic considers underlying talent plus positional need, with controlled variance.

## 4. Draft-night trades
Two functional paths are included.

### Trade down
When the user is on the clock, `GET OFFERS` can produce packages from CPU teams with later current selections. Packages can contain:
- a later current draft slot;
- future first/second-round assets as needed to bridge value.

Accepting a package changes the live owner of both draft slots and transfers the future assets in the persistent draft ledger. The new CPU owner immediately makes the acquired selection.

### Trade up
When a CPU team is on the clock and the user owns a viable later selection, NBA Courtside can build a trade-up proposal using:
- the user's later current selection;
- future pick capital when necessary.

Accepting the proposal swaps the live selection ownership and puts the user on the clock immediately.

All accepted draft-night deals are stored in `draftExperience.tradeHistory` and added to the transaction log.

## 5. Rookie contracts
Drafted players are activated immediately and written into the existing contract engine.

The prototype uses:
- four contract years;
- first two years guaranteed;
- Years 3 and 4 as team options;
- rookie-scale source/route tags in the contract override ledger.

The user draft class is surfaced again on the Free Agency hub.

## 6. Free Agency
The v0.13 competitive market remains unchanged underneath:
- seven-day main market;
- competing CPU offers;
- player preferences;
- RFA offer sheets and match decisions;
- cap/CBA route checks.

v0.15 changes the flow: finishing Free Agency leads to Training Camp rather than directly to the next season.

## 7. Training Camp
Training Camp is a dedicated phase two weeks before the deterministic Opening Night date.

The screen shows:
- exact roster count;
- Opening Night date;
- current rookie class;
- roster locks;
- rotation battles;
- bubble players;
- links to late free agency, Trade Center and Rotation management.

The user must finish with **exactly 15 players** before the Start Season button is enabled.

CPU teams are automatically trimmed/filled through the existing roster-management logic.

## Save additions
v0.15 adds:
- `draftExperience`
- `trainingCamp`

Primary save key:
`nbaCourtsideSaveV15`

Older supported saves migrate forward.
