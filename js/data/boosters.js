import { cardsForSet, collectionCards } from "./collection.js?v=0.13.72";
import { addOwnedCard, addUniversePoints, cardOwnershipCap, grantSuperstarUnlockPackage, totalOwnedCopies, underFinishOwnershipCap } from "./profile.js?v=0.13.72";
import { duplicateUniversePointsFor } from "./store.js?v=0.13.72";
import { sets } from "./sets.js?v=0.13.72";
import { isPlayerReleasedSetId } from "./release.js?v=0.13.72";

export const BOOSTER_SIZE = 5;
export const GUARANTEED_FOILS = 1;
export const MAX_VERY_RARE_PULLS = 1;
export const RARITY_WEIGHTS = Object.freeze({ 1: .5, 2: .3, 3: .15, 4: .05 });
export const SUPER_PACK_RARITY_WEIGHTS = Object.freeze({ 1: .25, 2: .40, 3: .27, 4: .08 });
export const SUPER_PACK_GUARANTEED_MIN_RARITY = 3;
export const SUPER_PACK_MAX_VERY_RARE_PULLS = 2;
export const SUPERSTAR_PITY_PACKS = 100;
export const SUPERSTAR_CHASE_CHANCE = .02;
export const DEFAULT_BOOSTER_SET_ID = "summerslam-series-1";

export function boosterCreditsFor(p, setId = DEFAULT_BOOSTER_SET_ID) {
  const bySet = p?.boosterCreditsBySet?.[setId];
  if (bySet != null) return Math.max(0, Number(bySet) || 0);
  // `boosterCredits` is the legacy mirror for SummerSlam Series 1 only. It must
  // never leak into another set that happens not to have an explicit bucket.
  if (setId === DEFAULT_BOOSTER_SET_ID) return Math.max(0, Number(p?.boosterCredits) || 0);
  return 0;
}
export function superPackCreditsFor(p, setId = DEFAULT_BOOSTER_SET_ID) {
  return Math.max(0, Number(p?.superPackCreditsBySet?.[setId]) || 0);
}
export function boosterEligible(card, now = new Date()) { return !!card && isPlayerReleasedSetId(card.setId, now) && sets[card.setId]?.type !== "season-exclusive" && card.boosterEligible !== false; }
export function underOwnershipCap(profile, card, foil = null) {
  if (!card) return false;
  if (foil === true || foil === false) return underFinishOwnershipCap(profile, card, foil);
  return underFinishOwnershipCap(profile, card, false) || underFinishOwnershipCap(profile, card, true);
}

function availableRarityWeights(pool, rarityWeights = RARITY_WEIGHTS) {
  const rarities = [...new Set(pool.map(card => Number(card.rarity) || 1))].sort((a,b)=>a-b);
  return rarities.map(rarity => [rarity, rarityWeights[rarity] ?? .01]);
}

function rollRarity(pool, rng = Math.random, rarityWeights = RARITY_WEIGHTS) {
  if (!pool.length) return null;
  const weights = availableRarityWeights(pool, rarityWeights);
  const total = weights.reduce((sum, [,weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [rarity, weight] of weights) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }
  return weights.at(-1)?.[0] ?? null;
}

function rarityFirstPick(pool, rng = Math.random, rarityWeights = RARITY_WEIGHTS) {
  if (!pool.length) return null;
  const rarity = rollRarity(pool, rng, rarityWeights);
  const bucket = pool.filter(card => (Number(card.rarity) || 1) === rarity);
  if (!bucket.length) return null;
  return bucket[Math.min(bucket.length - 1, Math.floor(rng() * bucket.length))];
}

function superstarPity(profile) {
  return Math.max(0, Number(profile.packsSinceSuperstarUnlock) || 0);
}

function recordSuperstarChase(profile, hit) {
  // One global pity track spans every eligible booster set. A Superstar hit
  // clears the consecutive-miss count; the next opened pack begins the new
  // cycle at Pack 1. If pity is armed while the current set is complete, the
  // miss count keeps climbing so the guarantee remains armed for the next pack
  // belonging to a set that still has an unowned Superstar.
  profile.packsSinceSuperstarUnlock = hit ? 0 : superstarPity(profile) + 1;
}

function normalizeArgs(rngOrSetId, maybeSetId) {
  if (typeof rngOrSetId === "function") return { rng: rngOrSetId, setId: maybeSetId ?? DEFAULT_BOOSTER_SET_ID };
  return { rng: Math.random, setId: typeof rngOrSetId === "string" ? rngOrSetId : (maybeSetId ?? DEFAULT_BOOSTER_SET_ID) };
}

export function grantBooster(p, n = 1, setId = DEFAULT_BOOSTER_SET_ID) {
  p.boosterCreditsBySet ??= {};
  p.boosterCreditsBySet[setId] = (p.boosterCreditsBySet[setId] ?? 0) + n;
  if (setId === DEFAULT_BOOSTER_SET_ID) p.boosterCredits = p.boosterCreditsBySet[setId];
  return p.boosterCreditsBySet[setId];
}
export function grantVictoryBooster(p, result, setId = DEFAULT_BOOSTER_SET_ID) {
  if (result !== "win") return 0;
  grantBooster(p, 1, setId);
  return 1;
}
export function grantSuperPack(p, n = 1, setId = DEFAULT_BOOSTER_SET_ID) {
  p.superPackCreditsBySet ??= {};
  p.superPackCreditsBySet[setId] = (p.superPackCreditsBySet[setId] ?? 0) + Math.max(0, Number(n) || 0);
  return p.superPackCreditsBySet[setId];
}

function buildPack(profile, rng, setId, now = new Date(), options = {}) {
  const rarityWeights = options.rarityWeights ?? RARITY_WEIGHTS;
  const guaranteedMinRarity = Math.max(1, Number(options.guaranteedMinRarity) || 1);
  const maxVeryRarePulls = Math.max(1, Number(options.maxVeryRarePulls) || MAX_VERY_RARE_PULLS);
  // Universal booster cards retain one collector identity but may appear in
  // any currently released set booster. This lets shared rules staples such
  // as Once Too Often remain collectible without cloning them across sets.
  const universal = collectionCards.filter(card => card.universalBooster === true && card.setId !== setId);
  const base = [...cardsForSet(setId), ...universal].filter(card => boosterEligible(card, now));
  if (!base.length) throw new Error("No active cards for this set");

  // Superstar cards are a separate pack-level chase. They never distort the
  // normal Common/Uncommon/Rare/Very Rare slot distribution. Natural chase is
  // 2% on every pack whose set still has an unowned Superstar. Pity is global:
  // after 100 consecutive packs without a Superstar, the next pack from a set
  // with an unowned Superstar guarantees one. Complete-set packs do not consume
  // or reset the armed guarantee; they simply advance the global miss count.
  const unownedSuperstars = base.filter(card => card.kind === "superstar" && underOwnershipCap(profile, card, true));
  const pityBefore = superstarPity(profile);
  const pityArmed = pityBefore >= SUPERSTAR_PITY_PACKS;
  const superstarHit = unownedSuperstars.length > 0 && (pityArmed || rng() < SUPERSTAR_CHASE_CHANCE);
  const superstarCard = superstarHit
    ? unownedSuperstars[Math.min(unownedSuperstars.length - 1, Math.floor(rng() * unownedSuperstars.length))]
    : null;

  const normalBase = base.filter(card => card.kind !== "superstar" && (card.kind !== "entrance" || underOwnershipCap(profile, card, true)));
  const pack = [];
  let superstarAdded = false;
  let pendingSuperstarUnlockId = null;
  // Standard packs allow at most one 4★ Very Rare; Super Packs allow up to
  // two. A chase Superstar counts toward the active pack's Very Rare ceiling.
  let veryRarePulls = superstarCard?.rarity === 4 ? 1 : 0;

  for (let i = 0; i < BOOSTER_SIZE; i += 1) {
    const guaranteedFoil = i < GUARANTEED_FOILS;
    let card = null;
    let pullFoil = guaranteedFoil;

    if (i === 0 && superstarCard) {
      card = superstarCard;
      pullFoil = true;
    } else {
      // Preserve the guaranteed-progress first ordinary slot when possible,
      // but roll rarity first and only then choose uniformly inside that bucket.
      let slotPool = normalBase.filter(c => c.kind !== "entrance" || underOwnershipCap(profile, c, true));
      if (i === 0) {
        const progressPool = slotPool.filter(c => underOwnershipCap(profile, c, guaranteedFoil || c.kind === "entrance"));
        if (progressPool.length) slotPool = progressPool;
      }
      if (i === 0 && guaranteedMinRarity > 1) {
        const guaranteedProgress = slotPool.filter(c => (Number(c.rarity) || 1) >= guaranteedMinRarity);
        const guaranteedAny = normalBase.filter(c => (c.kind !== "entrance" || underOwnershipCap(profile, c, true)) && (Number(c.rarity) || 1) >= guaranteedMinRarity);
        slotPool = guaranteedProgress.length ? guaranteedProgress : guaranteedAny;
      }
      if (veryRarePulls >= maxVeryRarePulls) slotPool = slotPool.filter(c => Number(c.rarity) !== 4);
      card = rarityFirstPick(slotPool, rng, rarityWeights);
      if (card?.rarity === 4) veryRarePulls += 1;
      if (card?.kind === "entrance") pullFoil = true;
    }

    if (!card) continue;
    const beforeTotal = totalOwnedCopies(profile, card.id);
    const wasUnlocked = card.kind === "superstar" && profile.unlockedSuperstars?.includes(card.superstarId);
    const result = addOwnedCard(profile, card.id, { foil: pullFoil, amount: 1 });
    let superstarUnlocked = false;
    if (card.kind === "superstar" && result.added > 0) {
      superstarAdded = true;
      if (!wasUnlocked) {
        // Defer the starter-package grant until all five pack cards have been
        // selected/owned. Otherwise the Superstar unlock itself can seed cards
        // that are still waiting to be rolled later in this same booster.
        pendingSuperstarUnlockId = card.superstarId;
        superstarUnlocked = true;
      }
    }
    pack.push({
      card,
      foil: pullFoil,
      isNewCard: beforeTotal === 0 && result.added > 0,
      replacedNormal: result.replacedNormal > 0,
      superstarUnlocked,
      overflowCopies: result.overflowed,
      duplicateUnitValue: duplicateUniversePointsFor(card),
      universePointsValue: result.overflowed * duplicateUniversePointsFor(card),
      universePointsCredited: false,
      ownershipBefore: beforeTotal,
      ownershipCap: result.cap
    });
  }

  if (pendingSuperstarUnlockId) grantSuperstarUnlockPackage(profile, pendingSuperstarUnlockId);
  recordSuperstarChase(profile, superstarAdded);
  return pack;
}

function recordOpenedPack(p, setId) {
  p.packsOpened = (p.packsOpened ?? 0) + 1;
  p.packsOpenedBySet ??= {};
  p.packsOpenedBySet[setId] = (p.packsOpenedBySet[setId] ?? 0) + 1;
}

export function openBooster(p, rngOrSetId = DEFAULT_BOOSTER_SET_ID, maybeSetId, now = new Date()) {
  const { rng, setId } = normalizeArgs(rngOrSetId, maybeSetId);
  if (boosterCreditsFor(p, setId) < 1) throw new Error("No booster available for this set.");
  const pack = buildPack(p, rng, setId, now);
  p.boosterCreditsBySet ??= {};
  p.boosterCreditsBySet[setId] = Math.max(0, (p.boosterCreditsBySet[setId] ?? 0) - 1);
  if (setId === DEFAULT_BOOSTER_SET_ID) p.boosterCredits = p.boosterCreditsBySet[setId];
  recordOpenedPack(p, setId);
  return pack;
}

export function openSuperPack(p, rngOrSetId = DEFAULT_BOOSTER_SET_ID, maybeSetId, now = new Date()) {
  const { rng, setId } = normalizeArgs(rngOrSetId, maybeSetId);
  if (superPackCreditsFor(p, setId) < 1) throw new Error("No Super Pack available for this set.");
  const pack = buildPack(p, rng, setId, now, { rarityWeights: SUPER_PACK_RARITY_WEIGHTS, guaranteedMinRarity: SUPER_PACK_GUARANTEED_MIN_RARITY, maxVeryRarePulls: SUPER_PACK_MAX_VERY_RARE_PULLS });
  p.superPackCreditsBySet[setId] = Math.max(0, (p.superPackCreditsBySet[setId] ?? 0) - 1);
  recordOpenedPack(p, setId);
  return pack;
}

export function openLadderCompletionPack(p, rngOrSetId = DEFAULT_BOOSTER_SET_ID, maybeSetId, now = new Date()) {
  const { rng, setId } = normalizeArgs(rngOrSetId, maybeSetId);
  const pool = p?.ladder?.completionPackCreditsBySet ?? {};
  if ((pool[setId] ?? 0) < 1) throw new Error("No Money in the Bank Completion Pack available for this set.");
  const pack = buildPack(p, rng, setId, now, { rarityWeights: SUPER_PACK_RARITY_WEIGHTS, guaranteedMinRarity: SUPER_PACK_GUARANTEED_MIN_RARITY, maxVeryRarePulls: SUPER_PACK_MAX_VERY_RARE_PULLS });
  pool[setId] = Math.max(0, (pool[setId] ?? 0) - 1);
  recordOpenedPack(p, setId);
  return pack;
}

export function openChampionshipPack(p, rngOrSetId = DEFAULT_BOOSTER_SET_ID, maybeSetId, now = new Date()) {
  const { rng, setId } = normalizeArgs(rngOrSetId, maybeSetId);
  const pool = p?.championshipRoad?.championshipPackCreditsBySet ?? {};
  if ((pool[setId] ?? 0) < 1) throw new Error("No Championship Pack available for this set.");
  const pack = buildPack(p, rng, setId, now, { rarityWeights: SUPER_PACK_RARITY_WEIGHTS, guaranteedMinRarity: SUPER_PACK_GUARANTEED_MIN_RARITY, maxVeryRarePulls: SUPER_PACK_MAX_VERY_RARE_PULLS });
  pool[setId] = Math.max(0, (pool[setId] ?? 0) - 1);
  recordOpenedPack(p, setId);
  return pack;
}

export function finalizePackUniversePoints(profile, pack = []) {
  let credited = 0;
  for (const pull of pack) {
    if (!pull || pull.universePointsCredited || !pull.universePointsValue) continue;
    credited += pull.universePointsValue;
    pull.universePointsCredited = true;
  }
  if (credited) addUniversePoints(profile, credited);
  return credited;
}
