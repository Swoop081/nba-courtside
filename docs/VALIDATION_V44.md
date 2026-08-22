# NBA Courtside v0.44 Validation

## Scope
Trade Deadline + Transaction Presentation expansion only. Existing roster data, ratings, certified source rows, CBA legality, schedule source, Game Day possession model and formal save schema are retained.

## Structural gates
- Formal save key/schema retained: `nbaCourtsideSaveV25`, schema 25.
- v0.44 runtime filenames exist for Franchise, Game Day, Exhibition, CBA and every version-pinned data dependency.
- Franchise, Game Day, Exhibition and CBA JavaScript pass `node --check`.
- Main Menu and all HTML runtime references resolve to v0.44 files.
- The v0.43 Franchise Direction and v0.42 GM Action Center feature hooks remain present.

## Deadline-state gates
- Starting-universe trade deadline resolves to 2027-02-11 from the retained official schedule dataset.
- Additive `state.tradeDeadlineV44.version = 44` stores market-window history, activity, negotiations and user deadline trades.
- Deadline Day exposes four windows: Morning Calls / Midday Market / Final Calls / Closing Bell.
- Advance Day holds the league date during the first three transitions and closes the market after Closing Bell.
- Existing blocking GM actions are checked before deadline-window advancement.
- Sim 7 Days stops on the deadline when its normal target would cross it.
- Sim To Next Game stops on the deadline when the next game lies beyond it.
- The post-deadline report is available for the following seven days.

## Trade-market gates
- User and CPU teams derive live Buyer / Seller / Re-tooling / Standing Pat stances.
- CPU teams derive Contender / Asset Collector / Cap Manager / Core Protector trade philosophies.
- Trade interest exposes Cold / Exploratory / Interested / Motivated / Aggressive bands.
- Final-14-day valuation pressure is bounded and never bypasses trade legality.
- Incoming formal offers expose rationale, asset context, resistance, modeled value and interest state.
- User proposals retain same-day negotiation rounds; repeated rejected frameworks can cool talks until the next league day.
- Existing formal offers still route through the unified GM Action Center.

## Presentation gates
- Deadline Command Center appears in the final 30 days and takes over on the deadline date.
- Deals workspace receives compact deadline context without replacing its existing v0.42 workspace content.
- Trade Center receives CPU philosophy/context presentation while retaining the existing CBA trade builder.
- Transaction ticker is backed by the existing transaction ledger plus v0.44 market activity.
- Successful user trades display a transaction-official sheet with cap, roster and draft-asset before/after context.
- Trade impact uses Immediate / Long-Term / Financial / Franchise Direction Fit rather than letter grades.
- League intelligence and front-office behavioral copy are visibly presented as simulated gameplay context.

## Compatibility
Existing schema-25 v0.43 franchises migrate lazily with no reset. v0.43 Franchise Direction, v0.42 navigation/GM Action Center, v0.41 Game Day coaching and all earlier retained simulation systems remain authoritative outside this additive transaction layer.

## Release result
Automated structural/runtime certification: **66/66 checks passed** via `scripts/test_trade_deadline_v44.py` on 21 August 2026. ZIP integrity is checked separately after packaging.

A physical iPhone/Safari visual smoke test is still recommended for final touch/layout feel; automated structural validation does not substitute for real-device browser chrome, font rasterization or touch behavior.
