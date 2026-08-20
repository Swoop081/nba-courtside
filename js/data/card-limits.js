export const DEFAULT_CARD_OWNERSHIP_CAP = 5;
export const UNIQUE_CARD_OWNERSHIP_CAP = 1;
export const MOMENTUM_CARD_OWNERSHIP_CAP = 15;

export function ownershipCapFor(cardOrId) {
  const id = typeof cardOrId === "string" ? cardOrId : cardOrId?.id ?? "";
  const kind = typeof cardOrId === "object" ? cardOrId?.kind : null;
  if (kind === "entrance" || id.startsWith("entrance-")) return UNIQUE_CARD_OWNERSHIP_CAP;
  if (kind === "superstar" || id.startsWith("superstar-")) return UNIQUE_CARD_OWNERSHIP_CAP;
  if (kind === "manager" || id.startsWith("hof1-manager-")) return UNIQUE_CARD_OWNERSHIP_CAP;
  if (kind === "momentum" || id.startsWith("momentum-")) return MOMENTUM_CARD_OWNERSHIP_CAP;
  return DEFAULT_CARD_OWNERSHIP_CAP;
}
