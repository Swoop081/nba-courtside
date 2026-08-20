import { superstars } from "./superstars.js?v=0.13.72";
import { collectionCards } from "./collection.js?v=0.13.72";
import { grantStoreSuperstarUnlockPackage, hasSuperstar, spendUniversePoints } from "./profile.js?v=0.13.72";
import { isPlayerReleasedSetId } from "./release.js?v=0.13.72";

export const STORE_SET_ROTATION = [
  "summerslam-series-1", "hall-of-fame-series-1", "evolution-series-1",
  "raw-series-1", "worlds-collide-series-1", "money-in-the-bank-series-1",
  "smackdown-series-1", "survivor-series-series-1"
];
export function releasedStoreSetIds(now = new Date()) { return STORE_SET_ROTATION.filter(setId => isPlayerReleasedSetId(setId, now)); }
export const STORE_BOOSTER_PRICE = 300;
export const STORE_SUPERSTAR_PRICE = 2500;
export const DUPLICATE_UP_BY_RARITY = Object.freeze({ 1: 1, 2: 2, 3: 3, 4: 4 });
export function duplicateUniversePointsFor(cardOrRarity) {
  const rarity = typeof cardOrRarity === "object" ? Number(cardOrRarity?.rarity) : Number(cardOrRarity);
  return DUPLICATE_UP_BY_RARITY[rarity] ?? 1;
}
// Compatibility aliases now represent the 1★ floor only; actual overflow value
// is rarity-scaled through duplicateUniversePointsFor(). Foils use the same rate.
export const DUPLICATE_UNIVERSE_POINTS = 1;
export const FOIL_DUPLICATE_UNIVERSE_POINTS = 1;
export const STORE_REFRESH_MS = 24 * 60 * 60 * 1000;
export const STORE_EPOCH_MS = Date.UTC(2026, 7, 13, 0, 0, 0);

const roster = Object.values(superstars);
const collectionById = new Map(collectionCards.map(card => [card.id, card]));

export function storeRotation(now = new Date()) {
  const nowMs = now instanceof Date ? now.getTime() : Number(now);
  const elapsed = Math.max(0, nowMs - STORE_EPOCH_MS);
  const slot = Math.floor(elapsed / STORE_REFRESH_MS);
  const available = releasedStoreSetIds(now);
  const setId = available[slot % available.length] ?? STORE_SET_ROTATION[0];
  const nextAt = new Date(STORE_EPOCH_MS + (slot + 1) * STORE_REFRESH_MS);
  return { slot, setId, nextAt, msRemaining: Math.max(0, nextAt.getTime() - nowMs) };
}

export function storeSuperstars(setId, now = new Date()) {
  if (!isPlayerReleasedSetId(setId, now)) return [];
  return roster.filter(star => star.setId === setId && !star.developmentOnly);
}

export function storeLeadOffCards(starId) {
  const star = roster.find(item => item.id === starId);
  return (star?.leadOffIds ?? []).map(id => collectionById.get(id)).filter(Boolean);
}

function requireCurrentStoreSet(setId, now) {
  const rotation = storeRotation(now);
  if (rotation.setId !== setId) throw new Error("That Store set has refreshed.");
  return rotation;
}

export function purchaseStoreBooster(profile, setId, now = new Date()) {
  requireCurrentStoreSet(setId, now);
  spendUniversePoints(profile, STORE_BOOSTER_PRICE);
  profile.boosterCreditsBySet ??= {};
  profile.boosterCreditsBySet[setId] = (profile.boosterCreditsBySet[setId] ?? 0) + 1;
  if (setId === "summerslam-series-1") profile.boosterCredits = profile.boosterCreditsBySet[setId];
  profile.storePurchases ??= [];
  profile.storePurchases.push({ type: "booster", setId, price: STORE_BOOSTER_PRICE, at: now.toISOString() });
  return { type: "booster", setId, price: STORE_BOOSTER_PRICE, balance: profile.universePoints };
}

export function purchaseStoreSuperstar(profile, superstarId, now = new Date()) {
  const star = roster.find(item => item.id === superstarId);
  if (!star) throw new Error("That Superstar is not available.");
  requireCurrentStoreSet(star.setId, now);
  if (hasSuperstar(profile, superstarId)) throw new Error(`${star.name} is already owned.`);
  spendUniversePoints(profile, STORE_SUPERSTAR_PRICE);
  const unlock = grantStoreSuperstarUnlockPackage(profile, superstarId);
  profile.storePurchases ??= [];
  profile.storePurchases.push({ type: "superstar", superstarId, setId: star.setId, price: STORE_SUPERSTAR_PRICE, at: now.toISOString() });
  return { type: "superstar", superstarId, setId: star.setId, price: STORE_SUPERSTAR_PRICE, balance: profile.universePoints, unlock };
}
