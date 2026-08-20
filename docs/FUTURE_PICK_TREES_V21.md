# NBA Courtside v0.21 — Executable Future Pick Trees

Freeze: 20 August 2026.

## What changed

The 2027–2033 future-pick layer no longer treats a generic `complex` or `source_locked` flag as the end state. Draft Night now resolves source-certified protections, favorable/less-favorable swaps, linked second-round fallbacks, and multi-year conveyance conditions from the generated **origin order** plus prior conveyance history.

The ledger still contains exactly **420 origin cells**: 30 teams × 2 rounds × 7 draft years.

Final v0.21 source state:

- 175 conditional origin cells — certified executable at Draft Night, but non-severable in the normal trade UI.
- 4 explicitly protected origin cells — protection executes from pick position; kept nontradeable as whole origin picks while the obligation is live.
- 4 CBA-frozen firsts — source-certified but unavailable for trade while frozen.
- 7 source-locked origin cells — retained safely rather than guessed.
- 230 atomic own/outgoing cells remain ordinarily tradeable.
- 190 total cells are deliberately nontradeable because they are linked, protected, frozen or unresolved.

## Non-severable rights policy

A right such as “better of A/B,” a swap entitlement, or a protected rollover is a **claim**, not ownership of an entire origin pick. Courtside therefore executes the claim when the draft order exists but does not let a GM re-trade that ledger cell as though it were an atomic pick. Direct unprotected ownership remains tradeable.

This is intentional. Claim-level trading can be added later, but v0.21 does not create fictitious whole-pick ownership merely to make every right movable.

## Source

Primary source: RealGM NBA Future Drafts by Year and detailed team future-draft ledgers, reviewed 20 August 2026. The seven year URLs are frozen in `data/future-pick-rules-v0.21.json`.

Secondary source checks are also frozen there for branches where a second current description materially improves confidence, including the exact 2030 Charlotte/Minnesota/San Antonio/Dallas swap condition.

## Important executable branches

The resolver includes, among others:

- 2027 Dallas top-2, Lakers top-4, Miami lottery and San Antonio split protections.
- 2027 Cleveland/Minnesota/Utah favorable ordering and the Denver/OKC/Clippers/Toronto chain.
- 2027 Milwaukee/New Orleans/Atlanta favorable/less-favorable assignment.
- 2027 second-round fallbacks tied to first-round protection outcomes.
- 2028 Denver and Miami rollover protections plus multi-team swap/second-round chains.
- 2029 Houston/Dallas/Phoenix two-best distribution; Boston/Portland/Milwaukee best-middle-worst distribution; Denver serial obligation; Orlando top-2-linked Memphis rights.
- 2030 Golden State first/second linkage and the exact Charlotte/Minnesota/San Antonio/Dallas conditional swap.
- 2031 San Antonio/Sacramento swap and current direct ownership corrections.
- 2032–2033 direct transfers, frozen firsts and current second-round ownership.

## Source corrections caught during v0.21

The live audit corrected several mappings before release:

- Cleveland's 2031 first remains at its last finalized owner (CLE) and is source-locked because the current Denver transfer is explicitly marked pending.
- Sacramento's 2032 second remains at its last finalized owner (CLE) and is source-locked because the onward Denver transfer is explicitly marked pending.
- Sacramento's 2027 second-round fallback correctly routes to OKC or Charlotte based on San Antonio's 2027 first-round branch.
- Detroit's 2028 second stays with Detroit at 31–55 and routes to Philadelphia at 56–60 before the separate Utah least-favorable claim is evaluated.

## Safety exceptions

### Pending Cleveland–Denver–L.A. Clippers transaction

RealGM currently lists CLE 2031 R1 to Denver and SAC 2032 R2 to Denver via Cleveland, but both entries explicitly cite the Cleveland–Denver–L.A. Clippers transaction as **pending**. Courtside therefore keeps the last finalized ownership state (CLE for both), marks both cells source-locked/nontradeable, and records Denver as the pending target. They can be promoted to executable Denver ownership only after the transaction is finalized.


### 2029 layered first-round claim

Four origin cells remain source-locked:

- CHA 2029 R1
- CLE 2029 R1
- MIN 2029 R1
- UTA 2029 R1

Public sources document the Utah conveyance, Charlotte swap and Phoenix downstream incoming claim, but do not express the overlapping final ordering safely enough to guarantee every branch of the combined structure. Courtside retains safe origin ownership for those four cells instead of guessing.

**Phoenix's own 2029 origin is not frozen by this exception.** It separately participates in the well-defined Houston/Dallas/Phoenix chain and remains executable. The unresolved piece is Phoenix's *incoming* claim from the layered Charlotte/Cleveland/Minnesota/Utah structure.

### Detroit 2033 second

DET 2033 R2 remains source-locked. The current source identifies a heavily protected obligation to the Clippers but does not publish an exact protection range. Courtside retains Detroit as the executable owner unless and until the condition can be safely certified.

### CBA-frozen firsts

These are certified restrictions rather than unknown data:

- BOS 2032 R1
- MIN 2032 R1
- PHX 2032 R1
- CLE 2033 R1

They remain unavailable in the ordinary trade picker while frozen.

## Engine and save behavior

- `pickHistory` stores **origin order**, not post-conveyance owner order, so future serial protections evaluate the correct historical draft position.
- Current-year first-round resolution is held in an in-memory preview for linked second-round branches; it is not persisted into the franchise save.
- Existing save key remains `nbaCourtsideSaveV18`. v0.21 upgrades static pick metadata/rules without a save-schema churn.
- Existing user-transferred atomic picks are preserved during migration; untouched legacy origin ownership is refreshed to the certified current source owner.

## Certification

Run:

- `python scripts/certify_future_pick_trees_v21.py`
- `node scripts/test_future_pick_trees_v21.js`
- `node scripts/test_draft_asset_safety_v21.js`

The randomized resolver suite exercises 3,500 year/round scenarios and requires every resolution to return exactly 30 valid NBA team owners.
