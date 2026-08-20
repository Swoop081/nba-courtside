# NBA Courtside — Current Data Status

**Build:** v0.24  
**Freeze date:** 20 August 2026  
**Starting season:** 2026–27

## Current universe

- 30 NBA teams.
- 442 current player/right records.
- 393 players with season-final 2025–26 NBA evidence.
- 49 source-backed 2026–27 projection records with separate confidence/provenance and null historical 2025–26 NBA stat rows.
- 442/442 players rated; 0 projection-pending and 0 bootstrap-hybrid rows.
- 442/442 certified NBA Years of Service inputs; the former age proxy is removed.
- 442/442 audited contract structures and first actionable Bird-right outcomes.
- One current source-certified Two-Way record: Dillon Mitchell (BOS).
- 420/420 2027–2033 draft origin cells source-mapped.
- Official 2026–27 80-game assigned schedule plus dynamic NBA Cup completion to 82 games.

## Player evidence policy

The original 392-player v0.19 final-NBA evidence/rating/simulation core remains hash-identical. v0.24 repairs Yanic Niederhauser from projection-only to a verified 41-game 2025–26 NBA row, producing 393 final-NBA players. The other 49 retain `stats_2025_26 = null` and use the distinct source-backed projection layer rather than fabricated NBA history.

Projection inputs now comprise 36 NCAA 2025–26, 2 NCAA bridge 2024–25, 6 international 2025–26 and 5 prior-NBA 2024–25 records. Projection confidence remains separate from NBA evidence confidence.

## CBA source status

- Exact/explicit `years_service` now exists for 442/442 starting records.
- Bird continuity remains separate from Years of Service and team loyalty/tenure.
- Team Salary and Apron Team Salary are distinct runtime ledgers.
- Prospectively created contracts can carry likely/unlikely incentives, signing-bonus allocation and protected salary.
- Historical incentive/bonus/guarantee-trigger values remain zero when the frozen source cannot prove them.
- Starting veteran extension anniversaries remain locked when an original signing date is not safely certified.

## Special roster / transaction systems

- 48-hour waiver wire with competing claims and league priority.
- Protected-salary dead cap, set-off relief and qualifying stretch elections.
- Disabled Player Exception applications/use.
- Up to three Two-Way slots; 50-game NBA eligibility counter; postseason exclusion.
- Exhibit 10 signings and eligible Two-Way conversions during preseason.
- Annual cash-paid/cash-received accounting; cash is not yet a selectable primary trade-builder asset.
- v0.22 TPE, sign-and-trade/BYC, exception-acquisition, trade-wait, aggregation, one-year Bird-consent, reacquisition, SRPE and CPU CBA-parity mechanics remain active.

## Restricted free agents

Jalen Duren (DET), Bennedict Mathurin (LAC) and Peyton Watson (DEN) remain unsigned RFA rights cases with qualifying-offer/cap-hold treatment rather than fabricated signed 2026–27 salaries.

## Draft rights

v0.21 remains active: 175 executable linked conditional cells, 4 executable protected cells, 230 atomic tradeable cells, 4 CBA-frozen cells and 7 source-locked origin cells. Linked claims resolve at Draft Night but are not falsely severed into ordinary whole-pick trade assets.

## Remaining current-day priorities

1. Presentation/accessibility/performance/save-migration and long-horizon franchise QA.
2. Resolve remaining public-source pick ambiguities/pending transfers when authoritative detail becomes available.
3. Incrementally source historical incentive/bonus/guarantee and extension-date details where they materially improve gameplay; keep unresolved inputs explicit rather than guessed.
4. Optional future transaction-depth work such as primary trade-builder cash assets and claim-level draft-right trading.

Historical season universes remain a separate expansion track.
