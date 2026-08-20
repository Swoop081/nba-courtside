# WWE Legacy v0.13.72 — Superstar Nameplate Identity Pass

Frozen 20 August 2026. This build supersedes v0.13.71.

## Locked changes

- Every currently implemented Superstar now has an authored **signature nameplate identity**. Coverage is complete across all **62 Superstars** in the current roster and internal/future-set pool.
- Superstar names are deliberately **big, colourful and bold**. Each identity can vary its system-safe font stack, weight, slant, horizontal scale, tracking, outer stroke, accent stroke, glow and three-stop text gradient.
- The containing set remains the visual anchor. SummerSlam uses cyan/orange broadcast energy; Hall of Fame uses gold/black prestige; Evolution uses pink/violet/cyan; RAW uses red/silver; Worlds Collide uses green/gold; Money in the Bank uses green/purple/gold; SmackDown uses blue/white; Survivor Series uses orange/silver; New Generation uses yellow/cyan/magenta/purple; reward identities retain their own established palettes.
- Superstar-specific personality is layered on top of those set themes. Examples include **Diesel — Big Daddy Cool**, **Bret Hart — Hitman Neon**, **CM Punk — Straight Edge Slash**, **Gunther — Ring General Serif**, **Hulk Hogan — Hulkamania Poster**, **Rhea Ripley — Mami Heavy**, **Jey Uso — YEET Strike**, and **The Rock — Final Boss Gold**.
- Live Superstar card presentation now draws a dedicated signature nameplate layer over the lower card plate. This works with layered Superstar plates and also keeps generated/fallback Superstar previews aligned to the same identity system.
- Long Superstar names receive authored condensed/size treatment without abandoning the larger nameplate direction.
- Card Art Studio serializes all 62 nameplate identities into its generated database. Selecting a Superstar card immediately renders that Superstar’s authored name treatment in the canvas preview.
- Card Art Studio adds a visible **SUPERSTAR NAMEPLATE** identity panel showing the selected style name, primary type treatment and three-colour story.
- Layered v1 Superstar exports continue to save reusable artwork/plate data while the game supplies the live personalized nameplate. Legacy Flat exports bake the same selected Superstar identity into the finished front.
- The system does **not bundle or redistribute font files**. It uses curated system-safe font stacks plus authored transform/stroke/colour treatment so the package remains self-contained and portable.

## Data / gameplay impact

- No card values, card identities, collector numbers, deck lists, pack odds, rewards, economy values, progression requirements, release dates or match rules changed.
- v0.13.71 Live Event UI + Counter Integrity behavior remains authoritative.
