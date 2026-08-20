# WWE Legacy v0.13.72 — Build Certification

**Build:** v0.13.72 — Superstar Nameplate Identity Pass  
**Frozen:** 20 August 2026

## Automated regression
- **691/691 tests pass**.
- v0.13.72-specific regression coverage confirms all **62/62 current Superstars** have authored nameplate identities, all 62 style labels are unique, runtime CSS variables are HTML-safe, runtime/generated Superstar cards share the same nameplate system, and Card Studio serializes/previews the full identity map.

## Structural validation
- **62 Superstars / 62 decks / 562 gameplay cards**.
- **0 orphans / 0 validation issues**.
- Flow audit: **62 Superstars / 0 issues**.
- Card-ID audit: **624/624 collector cards / 0 issues**; all collector ranges remain gap-free.
- Counter-State audit: **562 gameplay cards / 62 decks / 0 issues**.
- Card-effect audit: **45 internal-test Superstars / 443 scoped gameplay cards / 281 effect-bearing cards / 0 issues**.

## Nameplate identity certification
- **62/62 current Superstars** have an explicitly authored nameplate treatment.
- **62 unique style labels**; no Superstar falls through to the generic fallback in the current roster.
- Nameplates are intentionally **big, colourful and bold**, with Superstar-specific type treatment, gradient colour, outline/glow, spacing/slant and scale while remaining anchored to each card set's visual palette.
- The same identity system is used by live/generated Superstar cards and **Card Studio preview/export**.
- No external/bundled font files are required; treatments use system-safe font stacks plus authored styling/transforms.

## Card Studio
- Generated Studio database: **624 cards / 62 Superstars**.
- All **62 Superstar nameplate identities** are serialized into the Studio dataset.
- Studio preview exposes the selected Superstar's nameplate identity, type treatment and colour story.

## Artwork audit
- **624 collector cards / 584 custom fronts missing**.
- Missing-front count is unchanged from v0.13.71 and continues to use canonical fallback presentation; this is not a v0.13.72 validation failure.

## Gameplay / balance
v0.13.72 is presentation-only. No card values, deck composition, rules, AI, economy, progression, pack odds, collector numbering or release gating changed, so the accepted v0.13.71 simulation certification carries forward unchanged:
- Released-roster launch balance: **6,000 matches / 0 stalls / 26.95 average turns**.
- Internal/pre-release balance: **19,800 matches / 0 stalls / 25.12 average turns**.
- Diesel internal/pre-release cross-field: **880 matches / 59.4% win rate / 0 stalls / 24.4 average turns**.

## Result
**PASS — v0.13.72 is certified for handoff.**
