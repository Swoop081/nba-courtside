# NBA Courtside v0.12 — Contracts + CBA

## Goal
v0.12 replaces the earlier one-year/prototype transaction layer with an operational salary-cap and contract system built around the July 2023 NBA-NBPA Collective Bargaining Agreement and the published 2026-27 NBA cap thresholds.

The design rule is unchanged: **the CBA can be complicated underneath, but the player-facing GM interface should remain visual and understandable.**

## 2026-27 financial baseline
The starting universe uses the published 2026-27 values:
- Salary cap: **$164,961,000**
- Minimum team salary: **$148,465,000**
- Luxury-tax level: **$200,428,000**
- First apron: **$209,015,000**
- Second apron: **$221,686,000**
- Non-taxpayer MLE: **$15,044,000**
- Taxpayer MLE: **$6,064,000**
- Room MLE: **$9,366,000**
- Bi-annual Exception: modeled from the CBA at **3.32% of the cap** ($5,476,705 for this cap year)

## Multi-year contracts
Players can now carry true year-by-year contract structures rather than a single current salary.

A contract record can contain:
- salary by season
- guaranteed seasons
- player options
- team options
- signing route / exception
- originating team
- contract history

Normal free-agent offers support two-, three- and four-year structures. A team with qualifying Bird rights may offer up to five years in the current model. Bird deals use the larger modeled annual raise allowance; non-Bird routes use the smaller allowance.

## Bird / Early Bird / Non-Bird rights
Free agents can retain team rights when a contract expires. Those rights determine which re-signing routes are available even when the club is above the cap.

The current prototype tracks a persistent tenure/Bird clock:
- Bird
- Early Bird
- Non-Bird

A player's Bird clock survives a normal trade and resets when he signs with a different team as an unrestricted free agent.

**Current-data boundary:** the August 2026 snapshot does not yet contain a certified historical Bird-rights/service-time record for every player, so some starting rights are inferred/modelled from the available contract/tenure data. Future seasons generated inside NBA Courtside are then tracked exactly by the save.

## Cap holds and renouncing rights
Unsigned players whose prior team retains rights create a cap hold. The hold counts in Team Salary while the club keeps those rights.

The GM can **Renounce Rights**, which:
- removes the cap hold,
- removes the team's special re-signing right,
- turns an RFA into an unrestricted free agent where appropriate.

Incomplete-roster charges are also included during the offseason/free-agency phases so a team cannot create artificial cap room simply by carrying too few players.

## Restricted free agency
RFA support now includes:
- qualifying offers
- prior-team right of first refusal
- outside offer sheets
- matching by the prior team
- renouncing RFA rights
- qualifying-offer acceptance followed by future unrestricted free agency

Outside offer sheets are required to use actual cap room in the current implementation and must be multi-year offers. The prior team can match using its applicable re-signing rights.

The three unresolved RFAs in the frozen 19 August 2026 starting database continue to enter the game as rights cases rather than fake signed contracts.

## Salary-cap exceptions
The Market / Cap screens now expose the team's available spending tools and the transaction engine selects a legal route when a player is signed.

Implemented routes:
- Cap Room
- Bird
- Early Bird
- Non-Bird
- Non-Taxpayer MLE
- Taxpayer MLE
- Room MLE
- Bi-annual Exception
- Minimum Salary Exception

Exception use persists during the cap year. The Bi-annual Exception is prevented in consecutive cap years. Transactions that invoke an apron-triggering exception apply the relevant hard cap for the remainder of the season.

## Apron hard caps
The state now tracks hard caps separately from ordinary team salary.

Examples in the operational model:
- Non-Taxpayer MLE / Bi-annual / Expanded TPE routes can invoke a **First Apron** hard cap.
- Taxpayer MLE and salary aggregation through the Standard TPE route are constrained by the **Second Apron** where applicable.
- An existing hard cap is checked before any later signing or trade.

The Cap screen makes the active hard cap visible instead of silently rejecting a transaction.

## Trade salary matching
The old generic salary-matching check has been replaced by route-based checks.

Implemented trade routes include:
- cap-room acquisition route
- Standard Traded Player Exception
- Aggregated Standard Traded Player Exception
- Expanded Traded Player Exception

The Expanded TPE uses the current CBA formula rather than a fixed percentage. Second-apron clubs use the conservative current-rule model: no salary aggregation and no taking back more salary than is sent out.

These checks run in addition to the existing v0.11 player/pick valuation, Stepien guard, team direction and CPU front-office logic.

## Extensions
Eligible veterans can now be extended before reaching free agency. The first extended-season salary is bounded by the CBA veteran-extension framework (up to the greater of 140% of the last original-term salary or 140% of estimated average player salary, subject to the applicable max salary), with modeled 8% raises for the extension route.

The current v0.12 interface offers a practical three-year extension action rather than every possible extension structure and renegotiation edge case.

## Player and team options
Option decisions now survive season rollover.

- Player options are evaluated as player decisions.
- Team options are evaluated as team decisions.
- Exercised options become the next guaranteed contract season.
- Declined options send the player into the appropriate free-agent process.

First-round fictional rookie contracts generated by NBA Courtside use a four-year rookie-scale structure with team options in years three and four.

## Waivers and dead salary
Waiving a player now creates a **year-by-year dead-cap ledger** for guaranteed remaining salary. Option seasons are not automatically treated as guaranteed.

This means a bad multi-year contract can continue affecting the franchise after the player is gone.

**Not yet modeled exactly:** guarantee trigger dates, set-off calculations, stretch-provision elections and every partial-guarantee clause.

## Second-apron draft-pick consequence
At the end of each cap year, NBA Courtside records whether each franchise finished as a Second Apron Team.

Beginning with the current CBA framework:
- the relevant far-future first-round pick can be frozen from trade,
- repeated second-apron seasons during the four-year review window can move that pick to the end of the first round,
- sufficient consecutive non-second-apron years can release the frozen pick.

The draft-order resolver now understands the end-of-first-round penalty.

## Future cap years
The exact 2026-27 thresholds are official. Future unpublished cap years continue to use NBA Courtside's explicit **8% projection** until an official value exists. When building historical/current snapshots later, a published cap table can replace those projections without changing the contract engine.

## Deliberate v0.12 boundaries
v0.12 is a substantial operational CBA layer, but it is not a claim that every edge case in the 676-page agreement is mathematically complete.

Still future work:
- certified minimum-salary table by exact NBA service years
- certified historical Bird-rights/service-time seeds for every current player
- full traded-player-exception ledger / non-simultaneous TPE expiry handling
- base-year compensation edge cases
- sign-and-trade-specific restrictions and hard caps
- every bonus/incentive cap treatment
- partial guarantees, set-off and stretch elections
- cash considerations
- two-way and Exhibit 10 contract machinery
- Disabled Player Exception
- Second Round Pick Exception details
- every designated-veteran / rookie-extension eligibility edge case
- every first/second-apron acquisition restriction

Those are intentionally listed rather than hidden behind a false “100% CBA accurate” claim.
