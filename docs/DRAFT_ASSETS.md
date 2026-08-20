# Draft Assets — v0.11

## Persistent asset ledger
First- and second-round draft assets exist independently from players. Each asset stores year, round, origin, current owner, protection metadata and whether the right is a complex linked entitlement.

The trade window covers seven future drafts. When a future year enters the horizon, the engine creates that franchise's own future first and second so the universe can continue indefinitely.

## 2027 starting rights
The build seeds current publicly documented 2027 first-round rights, including simple protections such as Dallas 1–2 / Charlotte 3–30, Lakers 1–4 / Memphis 5–30, Miami lottery protection, San Antonio's Sacramento/Oklahoma City split, the Houston/Brooklyn swap, the Milwaukee/New Orleans chain, the Utah/Cleveland/Minnesota chain and the OKC/Clippers/Denver/Toronto chain.

Complex linked 2027 rights are displayed but cannot be re-traded in v0.11. They resolve automatically after draft positions are known.

## Stepien layer
The prototype enforces the core consecutive-future-first concept: a proposed deal is blocked when trading the selected first-round assets would leave that team without any first-round pick in two consecutive future drafts. Full CBA exceptions and second-apron frozen-pick rules are reserved for the dedicated CBA pass.

## Known data limitation
2027 second-round chains and the full 2028–2033 inherited real-world pick ledger are not yet certified. Those years currently use a functional own-pick scaffold unless a right is explicitly seeded. This is marked in `data/draft-assets-2026-08-19.json` rather than being presented as exact.
