# NBA Courtside — Contracts + CBA (v0.22)

## Financial baseline

Official 2026-27 starting values:
- Salary cap: $164.961M
- Minimum team salary: $148.465M
- Luxury tax: $200.428M
- First Apron: $209.015M
- Second Apron: $221.686M
- Non-Taxpayer MLE: $15.044M
- Taxpayer MLE: $6.064M
- Room MLE: $9.366M

Future unpublished cap years remain an explicit 8% game projection.

## Contract / rights engine

The franchise state stores year-by-year salary, guarantee/option type, signing route, rights, cap holds, exception history, hard caps, Bird continuity, dead salary, transaction waiting periods, TPEs and reacquisition locks.

Bird continuity is independent of team loyalty tenure. Ordinary trades preserve it; waiver/renunciation and external free-agent signing reset it. v0.20's 442/442 first-actionable rights certification remains the starting authority.

Contract raises use a linear percentage of first-year salary rather than compounding. The general maximum salary calculation also honors 105% of prior salary when that amount exceeds the ordinary service-tier maximum.

Current signing routes: cap room, Bird, Early Bird, Non-Bird, NTMLE, Taxpayer MLE, Room MLE, Bi-Annual, Minimum, qualifying offer, offer sheet, Rookie Scale, Second Round Pick Exception and sign-and-trade.

## Trade mechanics

The v0.22 engine supports cap room, Standard/Aggregated/Expanded TPE matching, persistent one-year TPEs, partial use, apron transaction triggers, BYC, sign-and-trade receiver hard caps, second-apron aggregation limits, Stepien protection, contract waiting periods, the two-month recently-acquired salary-aggregation rule, one-year Bird consent and free-agent reacquisition locks. NTMLE, Room MLE and Bi-Annual Exception balances can acquire by trade; prospectively generated one-/two-year minimum contracts can be acquired through the Minimum Salary Exception. The Taxpayer MLE is not a trade-acquisition route.

See `CBA_TRANSACTION_EDGE_CASES_V22.md` for exact scope and source-safety boundaries.

## Waivers / dead salary

Guaranteed salary continues on the year-by-year dead-cap ledger. Regular-season high-salary waived-player signings now carry the First Apron transaction gate.

Guarantee triggers, set-off and stretch elections remain future specialist work rather than being approximated.

## Rookie / service rules

First-round generated rookies: 120% Rookie Scale, two guaranteed years + Years 3/4 team options.

Second-round generated rookies: four-year Second Round Pick Exception structure; pre-July-31 SRPE contracts are deferred from Team Salary until July 31.

The official minimum salary table is cap-scaled, and two-year minimum contracts use the table for both seasons rather than a generic raise. Generated players accrue exact service time in-save; exact historical YOS for current players remains uncatalogued in the starting dataset and is not claimed as certified.

## Apron accounting boundary

Transaction hard-cap tests currently use Courtside's modeled Team Salary as the apron proxy. The engine does not yet claim exact Apron Team Salary adjustments for all incentives, first-round holds and other specialist items because those starting inputs are not fully certified. This is an explicit 1.0 long-tail item rather than an invisible approximation.

CPU-to-CPU transactions use the same v0.22 salary-match, transaction-lock, consent, hard-cap and exception checks as user trades; this prevents the simulation from bypassing CBA rules that the user must obey.
