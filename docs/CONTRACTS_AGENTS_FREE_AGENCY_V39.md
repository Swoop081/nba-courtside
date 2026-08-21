# v0.39 — Contracts, Agents + Free Agency Overhaul

## Goal

v0.39 turns the offseason contract market into a living negotiation system while leaving the existing CBA implementation in charge of legality. The player should negotiate with a market, not buy free agents from a list.

## Simulation boundary

NBA Courtside does **not** claim to know or reproduce real players' actual agents, private priorities, negotiation positions or private conversations. The v0.39 agent names, agencies, archetypes, priorities, counters and generated comments are fictional gameplay simulation. Real-player contract structure, rights and CBA rules continue to use the existing certified/source-bounded data model.

## Persistent contract market

`state.contractMarket.version = 39` stores:

- stable fictional agent links and agent-relationship scores;
- active free-agent negotiations and counteroffers;
- extension talks;
- signed-agreement history;
- RFA offer-sheet/match history;
- market snapshots; and
- sign-and-trade negotiation hooks.

This is additive. The formal save key/schema remains `nbaCourtsideSaveV25` / schema 25.

## Player and agent decision model

The retained free-agent model already evaluates money, role, winning, loyalty, market appeal, basketball fit and stability. v0.39 adds a bounded simulated agent emphasis using six archetypes:

- Money First
- Security First
- Winning First
- Role First
- Flexible
- Market Maker

The archetype changes weighting; it does not bypass CBA rules or make a player ignore the rest of his context.

## Free-agent negotiation

Opening a player now shows:

- simulated agent / fictional agency;
- relationship score;
- top three current priorities;
- contract expectation tier;
- current market ask and market heat;
- user Bird-rights/cap-hold context;
- legal signing routes;
- live competing offers; and
- quick legal contract frameworks.

A weak offer can generate a persistent counter. The user may accept it, decline it, or return later. Accepted counters become ordinary pending offers and are resolved by the retained market/CBA flow.

## Asking-price movement

The original market ask remains the anchor. Once the first two free-agency days pass, an unsigned player's ask may cool when he lacks a strong offer market. The reduction is bounded to 22%, cannot fall below 78% of the base ask or the modeled minimum, and does not apply to 88+ OVR stars or players with two or more active offers.

This is intended to create late-market value without turning July 1 stars into bargain contracts.

## Offer structures

The UI can generate Prove It, Balanced, Market, Long Term, Player Flex and Team Control frameworks. Bird Security can appear when five years are legally available. These are suggestions only; final submission rechecks the current route, salary and term legality.

## Extensions

v0.39 replaces the instant-extension action with a negotiation sheet driven by:

- existing CBA extension eligibility;
- current player extension outlook from Player Relations;
- maximum first-year salary;
- maximum new years;
- option structure;
- simulated agent relationship; and
- negotiated counteroffers.

The existing source boundary is deliberately retained. The frozen starting database does not fabricate historical original signing dates, so a starting veteran whose anniversary cannot be certified remains locked out of a date-dependent extension. Prospective contracts signed inside the save contain the necessary date and can use the full system. Rookie-scale and other windows remain governed by the CBA helper.

## Restricted free agency

The retained RFA engine remains authoritative for qualifying offers, offer sheets, rights and match decisions. v0.39 layers the contract-market UI, competing offers and persistent history on top; it does not replace the RFA rules with a simplified negotiation shortcut.

## Sign-and-trade

The existing legal sign-and-trade transaction engine remains intact. When the user's rights support an available sign-and-trade framework, the v0.39 negotiation sheet exposes a direct route to Trade Center. The actual trade still must satisfy the existing CBA, apron, salary-matching and CPU-acceptance rules.

## Free Agency Live

During the free-agency phase, the offseason Home becomes Free Agency Live with:

- available-player count;
- user's active talks;
- pending market offers;
- current cap room;
- simulated Free Agency Wire;
- RFA match decisions;
- top available players;
- roster-count warnings; and
- links to the full market, Trade Center and Cap + Rights.

## What v0.39 deliberately does not claim

- Real player-agent identities or agencies.
- Real private player priorities or agent tactics.
- Real future free-agent decisions.
- Historical starting-veteran signing dates that were not source-certified.
- A separate staged NBA moratorium simulation; signed agreements are persisted when the existing CBA signing flow completes.

The purpose of the pass is negotiation depth without weakening the project's existing source-safety policy.
