# v0.49 — Advanced Scouting + Draft Intelligence

## Design goal

The NBA draft should be a decision under uncertainty, not a menu that exposes the simulator's hidden truth. v0.49 keeps v0.48's action-first mobile hierarchy and makes scouting evidence, confidence, fit and market context the inputs to the GM's draft decision.

## Scouting evidence

Each generated draft prospect now has a front-office evaluation file with:

- estimated current-ability range;
- estimated ceiling range;
- scouting confidence;
- archetype, once sufficiently scouted;
- strengths and concerns, once sufficiently scouted;
- roster/scheme fit score and label;
- projected early NBA role;
- development-volatility band;
- simulated consensus draft range;
- modeled team-interest context near that range.

A full scouting report deliberately remains a range. The user never receives an exact hidden potential number as a reward for maxing scouting.

## Three evidence channels

### Standard scouting
Uses the existing escalating scouting-point cost and narrows the evaluation range over three report levels.

### Private workout
Uses the existing three-point cost. It raises the evidence quality and guarantees at least an advanced report, but still does not expose exact hidden ratings.

### Simulated interview
Costs one scouting point and adds an explicitly simulated front-office interview read. Interview copy is gameplay simulation and is not presented as a factual claim about a real prospect.

## Season-long carryover

For the source-backed 2027 watch class, scouting completed during the regular-season College + Draft world now carries into the June pre-draft file. Confidence thresholds translate accumulated college scouting into pre-draft report depth instead of resetting the user to zero knowledge.

## Scouting plans

The pre-draft Primary Action Zone offers four optional allocation plans:

- **Top Board** — prioritize the user's existing board order.
- **Team Need** — prioritize positions of greatest current roster need.
- **Upside** — prioritize the highest currently estimated ceiling.
- **Value** — prioritize prospects whose user-board position looks favorable relative to simulated consensus.

A plan can spend at most six currently available scouting points and uses only information already visible/derivable by the user's front office.

## Draft Night intelligence

When the user's team is on the clock, the first action viewport contains:

1. three front-office recommendations based on scouted ranges, fit and confidence;
2. **Auto Pick Your #1**, which still respects the user's own board rather than hidden simulator talent;
3. **Shop This Pick** and any resulting trade-down offers.

The broader board follows below. Draft cards no longer display the old exact OVR number.

## Market intelligence

Consensus range and likely interested teams are simulated. Team-interest context is derived from the current draft order, roster needs and the prospect's modeled consensus area. It is deliberately probabilistic and never promises that a club will make the selection.

## Draft decision history

Every user selection records the information available at pick time:

- pick number;
- player;
- user-board rank;
- simulated consensus rank;
- OVR range;
- ceiling range;
- confidence;
- fit score;
- volatility label.

This is stored in `state.draftIntelligenceV49.selectionSnapshots` and is intended to support future retrospective draft analysis without rewriting what the GM knew at the time.

## College + Draft hub

A new **Intel** tab summarizes current 2027 first-round ownership, roster needs, watchlist volume and priority prospect files. Source-backed identity/program information and simulated scouting output remain explicitly separated.

## Compatibility

v0.49 is additive. Formal save schema remains 25 under `nbaCourtsideSaveV25`. v0.48 presentation, v0.47 league history, v0.46 GM career, v0.45 offseason, v0.44 deadline/transactions, CBA, Game Day and all retained simulation systems remain authoritative.
