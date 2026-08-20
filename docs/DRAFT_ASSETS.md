# Draft Assets — v0.21

## Persistent asset ledger

NBA Courtside stores 2027–2033 first- and second-round origin rights independently from players. The current certified ledger contains **420 origin cells** (30 teams × 2 rounds × 7 years).

Each cell records origin, current source owner, status, protection/condition metadata, whether it is tradeable as an atomic pick, and its source-safety state.

## Executable rights

Draft Night resolves source-certified:

- direct transfers,
- top-N protections,
- favorable/less-favorable swaps,
- multi-team ordering rights,
- rollover protections that depend on prior draft outcomes,
- first/second-round fallback linkage,
- current CBA-frozen pick restrictions.

Resolution uses the generated **origin draft order**. Historical serial conditions use `pickHistory`, which stores origin order rather than post-conveyance owners.

## Trade representation

Conditional rights are intentionally **non-severable** in the standard trade UI. A swap claim or “better of” entitlement is not represented as ownership of an entire origin pick. The claim executes at Draft Night, but its ledger cell cannot be re-traded as an atomic pick until Courtside gains a dedicated claim-level trade object.

Current v0.21 totals:

- 230 atomic tradeable cells.
- 175 executable conditional, non-severable cells.
- 4 executable protected cells.
- 4 CBA-frozen cells.
- 7 source-locked origin cells.

## Remaining source locks

Four 2029 first-round origin cells — CHA, CLE, MIN and UTA — remain source-locked because the combined Utah/Charlotte/Phoenix layered ordering cannot be safely reduced from the available public descriptions for every possible branch. Phoenix's **own** 2029 origin is separately executable in the certified HOU/DAL/PHX chain; only its downstream incoming claim from the layered structure remains unresolved.

Detroit's 2033 second also remains source-locked because the public source states that it is heavily protected to the Clippers without publishing the exact protection range.

Two current cells are source-locked for a different reason: CLE 2031 R1 and SAC 2032 R2. RealGM currently lists Denver as their destination only through a Cleveland–Denver–L.A. Clippers transaction explicitly marked pending. Courtside therefore keeps the last finalized owner (CLE for both), records Denver as the pending target, and prevents ordinary trading until the transaction closes.

Courtside retains safe finalized ownership in unresolved or pending branches rather than inventing a condition or treating an unclosed transaction as settled.

## CBA-frozen firsts

- BOS 2032 R1
- MIN 2032 R1
- PHX 2032 R1
- CLE 2033 R1

These are known restrictions, not missing source data, and remain unavailable in ordinary pick trading while frozen.

## Stepien layer

The trade engine continues to enforce the core consecutive-future-first rule against atomic first-round assets. Linked claims remain outside ordinary trade proposals, preventing the Stepien check from treating conditional rights as guaranteed whole picks.

See `docs/FUTURE_PICK_TREES_V21.md` for the detailed resolver and certification boundary.
