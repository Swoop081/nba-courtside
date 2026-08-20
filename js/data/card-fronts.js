// WWE Legacy Layered Card Front compatibility helper — v0.13.31
//
// Layered v1 is now automatic. There is no per-card activation registry.
// Supported non-Superstar collectible cards always try their canonical layered
// asset first; the live renderer falls back to the existing flat/custom front
// when that layered asset is absent or fails to load.
const AUTO_LAYERED_KINDS = new Set(["move", "entrance", "manager", "action", "support"]);

export function usesLayeredFront(card) {
  return Boolean(card?.id && AUTO_LAYERED_KINDS.has(card.kind));
}
