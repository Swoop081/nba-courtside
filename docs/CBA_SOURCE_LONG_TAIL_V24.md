# v0.24 — CBA Source Long-Tail

## Years of Service

Courtside now stores `years_service` separately from age, team tenure and Bird continuity. The 2025–26 NBA population is matched to a frozen NBA Stats API-derived source by NBA player ID where available. No-game rookies/new entrants and established players absent from the 2025–26 NBA stat population are resolved from draft/profile/roster history rather than an age formula.

`CBA.serviceYears(player)` no longer estimates service from age.

## Team Salary vs Apron Team Salary

The runtime now maintains two calculations:

- **Team Salary:** contract salary, prospective likely incentives, allocated signing/trade bonuses, dead salary, other modeled Team Salary and applicable incomplete-roster charges/cap holds.
- **Apron Team Salary:** player Team Salary charges plus prospective unlikely incentives and explicit apron adjustments; free-agent cap holds are not included in the Apron Team Salary calculation used for transaction tests.

For a qualifying one-year minimum contract signed by a veteran with 3+ Years of Service, the player is paid his service-year minimum while the team’s modeled Team Salary charge is limited to the two-YOS minimum.

## Waivers

A standard player remains the assigning team’s financial/contract responsibility during the 48-hour waiver period. Claims are submitted rather than executed immediately.

If more than one legal claim exists when the period closes, priority is:

1. Lowest previous-season winning percentage for waivers requested through Nov. 30.
2. Lowest current-season winning percentage afterward.
3. Current-season head-to-head result when available for tied clubs.
4. A deterministic league draw if the documented competitive tiebreaks still do not separate them.

A successful claim transfers the existing contract and preserves continuity. Clearing waivers moves the player to free agency, resets the special Bird continuity and books protected salary to the former team. Set-off and qualifying stretch treatment can then modify that dead salary.

## Disabled Player Exception

The modeled DPE application window is July 1 through Jan. 15. The injury must project beyond the following June 15. The amount is the lesser of 50% of the disabled player’s salary and the Non-Taxpayer MLE. Granted DPEs expire Mar. 10 and can be consumed by one qualifying signing/claim/acquisition rather than split among multiple players.

## Two-Way contracts

- Up to 3 per team in addition to the 15 standard contracts.
- Player must have no more than 3 NBA Years of Service.
- Salary is modeled as 50% of the zero-YOS minimum.
- Excluded from Team Salary.
- Up to 50 NBA regular-season games in the modeled eligibility counter.
- Not available in Courtside postseason rotations.
- New Two-Way signings/conversions receive the 30-day trade waiting period.

The frozen starting roster includes a current source-certified Two-Way case: **Dillon Mitchell — Boston**.

## Exhibit 10

Prospective Exhibit 10 contracts are one-year minimum contracts with no starting salary protection and a scaled Exhibit 10 bonus. The salary uses the player’s own service-year minimum. Courtside allows up to six Exhibit 10 contracts for a team during the preseason and can convert an eligible deal into a Two-Way contract before the regular season.

The game does not pretend to know affiliate-bonus vesting facts after an unsourced real-world waiver.

## Cash, guarantees and incentives

The engine now has annual cash-paid/cash-received ledgers and applies the Second-Apron transaction consequence when a team sends cash. The primary trade-builder does not yet expose cash as a selectable asset.

Contracts created inside a save may carry explicit likely/unlikely incentives, protected amounts and signing-bonus allocation. The starting August 2026 database does not invent those values where the source snapshot lacks reliable detail.

## Extensions

Ordinary veteran extension timing is modeled prospectively from certified in-save signing dates: 3–4 year contracts after the second anniversary and 5–6 year contracts after the third anniversary. One-/two-year veteran contracts cannot be extended. The ordinary first-year extension ceiling uses 140% of the greater of the final original-term salary or estimated average player salary, with 8% raises.

Rookie-scale extensions can be offered in the fourth-season window. Designated-veteran/supermax award-history qualification remains a deliberate source boundary.
