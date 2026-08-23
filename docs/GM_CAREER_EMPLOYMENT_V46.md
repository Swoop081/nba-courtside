# NBA Courtside v0.46 — GM Career + Employment System

v0.46 turns the user from a permanently attached franchise controller into a persistent general-manager career inside the same NBA universe.

## Career contract and job security

Each new career starts with a modeled three-year GM contract. Job security is calculated from the existing v0.43 GM evaluation, ownership confidence, and recent career trajectory. The visible states are Excellent, Safe, Watch, Hot Seat and Critical.

Season-end ownership reviews now happen before the v0.45 Offseason Command Center. Depending on performance and contract timing, ownership can retain the GM, offer an early extension, offer a new contract, decline to renew, or dismiss the GM. An in-season dismissal is possible only under an extreme late-season Critical state.

## Reputation

GM reputation is not an XP level. It persists across teams in six dimensions:

- Winning
- Team Building
- Drafting + Development
- Negotiation
- Player Relations
- Financial Management

The v0.43 evaluation pillars and season objectives feed those dimensions over time.

## Job market

Dismissed or out-of-contract GMs enter a simulated NBA vacancy market. Vacancies are generated from the persistent league state using recent record, roster power, payroll pressure and contract-cycle logic. The user selects an executive philosophy, interviews with clubs, can be rejected, and can receive multiple job offers.

The selectable philosophies are Win Now, Patient Build, Draft + Develop and Flexible / Best Opportunity. Interview fit combines career reputation, simulated ownership style, franchise direction and philosophy fit.

## Persistent universe when changing teams

Accepting a new job changes only the franchise controlled by the user. It does not call `newState()` or reset the save. Player assignments, contracts, draft assets, injuries, standings, transactions, staff, league history and the former franchise remain in the same world. The former club becomes CPU-controlled.

## Career presentation

The Main Menu now says Continue Career and shows employment status. More includes a dedicated GM Career screen with contract, security, reputation, résumé, ownership meetings and employment history. Franchise Direction also links the current employment status back to the career screen.

## Compatibility

The formal save schema remains 25 and the save key remains `nbaCourtsideSaveV25`. v0.46 adds state under `state.gmCareerV46`; it does not require a destructive migration.
