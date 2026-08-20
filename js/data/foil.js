// Foil gameplay policy.
// Normal cards remain the authored baseline. A Foil Move with positive printed
// Damage gets +1 Damage. Zero-Damage Moves, Submissions with D0, Momentum,
// Actions, Entrances, Supports, Managers and Superstar cards do not gain Damage.
export const FOIL_DAMAGE_BONUS = 1;

export function foilDamageBonusFor(card) {
  if (!card || card.kind !== "move") return 0;
  const base = Number(card.normalDamage ?? card.damage ?? 0);
  return base > 0 ? FOIL_DAMAGE_BONUS : 0;
}

export function applyFoilGameplay(card, foil = false) {
  if (!card) return card;
  const wantsFoil = Boolean(foil || card.foil);
  if (!wantsFoil) return card;

  // Idempotent: a runtime card that has already had the Foil bonus applied can
  // safely pass through UI/materialization layers again without stacking +1s.
  if (card.foil && Number(card.foilDamageBonus ?? 0) === FOIL_DAMAGE_BONUS && Number.isFinite(card.normalDamage)) return card;

  const normalDamage = Number(card.normalDamage ?? card.damage ?? 0);
  const bonus = foilDamageBonusFor({ ...card, damage: normalDamage, normalDamage });
  return {
    ...card,
    foil: true,
    ...(bonus ? { normalDamage, foilDamageBonus: bonus, damage: normalDamage + bonus } : {})
  };
}
