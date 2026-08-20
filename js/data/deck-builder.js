import { decks } from "./decks.js?v=0.13.72";
import { collectionCards } from "./collection.js?v=0.13.72";
import { superstars } from "./superstars.js?v=0.13.72";
import { evaluateDeckHealth, deckBucket } from "./deck-health.js?v=0.13.72";
import { isPlayerReleasedSetId } from "./release.js?v=0.13.72";
import { applyFoilGameplay } from "./foil.js?v=0.13.72";

const byId = new Map(collectionCards.map(c => [c.id, c]));
const starById = new Map(Object.values(superstars).map(s => [s.id, s]));
const DEFAULT_PLAYER_ENTRANCE_ID = "entrance-amazing";

export const DECK_LAB_CATEGORIES = Object.freeze([
  { id: "signature", label: "Finishers & Trademarks" },
  { id: "high", label: "High-Level Moves" },
  { id: "mid", label: "Mid-Level Moves" },
  { id: "low", label: "Low-Level Moves" },
  { id: "utility", label: "Actions" },
  { id: "momentum", label: "Momentum" }
]);

export function leadOffIds(sid) { return (decks[sid] ?? []).slice(0, 5).map(c => c.id); }
export function recommendedDeckDraft(sid) { return (decks[sid] ?? []).map(c => ({ id: c.id, foil: false })); }
export function materializeDraft(d = []) { return d.map(e => { const entry = typeof e === "string" ? { id: e, foil: false } : e; const card = byId.get(entry?.id); return card ? applyFoilGameplay(card, !!entry?.foil) : null; }).filter(Boolean); }
export function usedCount(d, id) { return d.filter(e => (e.id ?? e) === id).length; }
export function usedCopyFamilyCount(d, card) {
  if (!card?.copyFamily) return usedCount(d, card?.id);
  return d.reduce((n, e) => { const c = byId.get(e.id ?? e); return n + (c?.copyFamily === card.copyFamily ? 1 : 0); }, 0);
}
export function ownedTotal(p, id) { const o = p?.ownedCards?.[id] ?? {}; return (o.normal ?? 0) + (o.foil ?? 0); }
export function ownedNormal(p, id) { return Math.max(0, Number(p?.ownedCards?.[id]?.normal) || 0); }
export function ownedFoil(p, id) { return Math.max(0, Number(p?.ownedCards?.[id]?.foil) || 0); }
function usedFinishCount(draft, id, foil) { return draft.reduce((n,e)=>{ const x=typeof e === "string" ? { id:e, foil:false } : e; return n + (x?.id===id && !!x?.foil===!!foil ? 1 : 0); },0); }

export function cardEligibilityForSuperstar(star, card) {
  if (!star || !card) return { legal: false, reason: "Card unavailable" };
  if (["superstar", "entrance"].includes(card.kind)) return { legal: false, reason: "Not a 60-page deck card" };
  if (card.superstarId && card.superstarId !== star.id) {
    const owner = starById.get(card.superstarId)?.name ?? "another Superstar";
    return { legal: false, reason: `${owner}-exclusive` };
  }
  if (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length && !card.allowedSuperstarIds.includes(star.id)) {
    return { legal: false, reason: "Family / Superstar restriction" };
  }
  if (Array.isArray(card.allowedFactionTags) && card.allowedFactionTags.length && !(star.factionTags ?? []).some(tag => card.allowedFactionTags.includes(tag))) {
    return { legal: false, reason: "Faction restriction" };
  }
  for (const [method, requirement] of Object.entries(card.finisher ? {} : (card.requirements ?? {}))) {
    const limit = star.methodLimits?.[method];
    if (limit === 0) return { legal: false, reason: `${star.name} cannot use ${method[0].toUpperCase() + method.slice(1)} cards` };
    if (Number.isFinite(limit) && requirement > limit) {
      return { legal: false, reason: `Requires ${requirement} ${method[0].toUpperCase() + method.slice(1)} · ${star.name} limit ${limit}` };
    }
  }
  return { legal: true, reason: "Valid" };
}

export function legalForSuperstar(star, card) { return cardEligibilityForSuperstar(star, card).legal; }

export function entranceEligibilityForSuperstar(star, card) {
  if (!star || !card || card.kind !== "entrance") return { legal: false, reason: "Not an Entrance" };
  if (card.superstarId && card.superstarId !== star.id) {
    const owner = starById.get(card.superstarId)?.name ?? "another Superstar";
    return { legal: false, reason: `${owner}-exclusive Entrance` };
  }
  if (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length && !card.allowedSuperstarIds.includes(star.id)) {
    return { legal: false, reason: "Entrance is not compatible with this Superstar" };
  }
  if (Array.isArray(card.allowedFactionTags) && card.allowedFactionTags.length && !(star.factionTags ?? []).some(tag => card.allowedFactionTags.includes(tag))) {
    return { legal: false, reason: "Entrance is not compatible with this Superstar's faction" };
  }
  return { legal: true, reason: card.superstarId ? "Superstar-specific Entrance" : "Shared Entrance" };
}

export function categoryForCard(card) {
  if (!card) return "other";
  return deckBucket(card);
}
export function cardsInCategory(cards = [], category) { return cards.filter(c => categoryForCard(c) === category); }

export function recommendedCategoryCounts(sid) {
  const out = Object.fromEntries(DECK_LAB_CATEGORIES.map(c => [c.id, 0]));
  for (const card of decks[sid] ?? []) {
    const key = categoryForCard(card);
    if (key in out) out[key] += 1;
  }
  return out;
}

export function currentCategoryCounts(draft = []) {
  const out = Object.fromEntries(DECK_LAB_CATEGORIES.map(c => [c.id, 0]));
  for (const card of materializeDraft(draft)) {
    const key = categoryForCard(card);
    if (key in out) out[key] += 1;
  }
  return out;
}

export function allOwnedDeckCards(profile) {
  return collectionCards.filter(card => isPlayerReleasedSetId(card.setId) && !["superstar", "entrance"].includes(card.kind) && ownedTotal(profile, card.id) > 0);
}
export function allOwnedEntrances(profile) { return collectionCards.filter(card => isPlayerReleasedSetId(card.setId) && card.kind === "entrance" && ownedTotal(profile, card.id) > 0); }
export function ownedCardsForCategory(profile, category) { return cardsInCategory(allOwnedDeckCards(profile), category); }
export function eligibleOwnedCards(profile, sid) {
  const star = starById.get(sid);
  return allOwnedDeckCards(profile).filter(card => legalForSuperstar(star, card));
}

export function createDeckDraft(profile, sid) {
  const saved = profile?.savedDecks?.[sid];
  return Array.isArray(saved) ? normalizeDeckFinishes(profile, sid, saved) : buildOwnedRecommendedDraft(profile, sid);
}

export function aggregateDeck(d, { tailOnly = false } = {}) {
  const arr = tailOnly ? d.slice(5) : d, map = new Map();
  for (const e of arr) {
    const id = e.id ?? e, row = map.get(id) ?? { id, count: 0, foil: 0, indices: [] };
    row.count += 1;
    row.indices.push(d.indexOf(e));
    if (e.foil) row.foil += 1;
    map.set(id, row);
  }
  return [...map.values()].map(row => ({ ...row, normal: row.count - row.foil, card: byId.get(row.id) }));
}

function preferredOwnedFinish(profile, draft, id) {
  if (usedFinishCount(draft,id,true) < ownedFoil(profile,id)) return true;
  if (usedFinishCount(draft,id,false) < ownedNormal(profile,id)) return false;
  return null;
}

export function canAddCard(profile, sid, draft, id) {
  const card = byId.get(id), star = starById.get(sid);
  if (!card || !legalForSuperstar(star, card) || draft.length >= 60) return false;
  const defaultCap = card.kind === "momentum" ? 12 : 5;
  const cap = Math.min(defaultCap, Number.isFinite(card.maxCopies) ? card.maxCopies : defaultCap);
  const ownRoom = usedCount(draft, id) < Math.min(cap, ownedTotal(profile, id));
  const finishRoom = preferredOwnedFinish(profile,draft,id) !== null;
  const familyRoom = !card.copyFamily || usedCopyFamilyCount(draft, card) < 5;
  return ownRoom && finishRoom && familyRoom;
}
export function addCardToDraft(profile, sid, draft, id) {
  if (!canAddCard(profile, sid, draft, id)) return draft;
  const foil = preferredOwnedFinish(profile,draft,id);
  if (foil === null) return draft;
  return [...draft, { id, foil }];
}
export function removeCardFromDraft(_profile, _sid, draft, index) { return draft.filter((_, i) => i !== index); }

export function replaceLeadOffSlot(profile, sid, draft, slot, id) {
  const index = Number(slot);
  if (!Number.isInteger(index) || index < 0 || index > 4 || index >= draft.length) return draft;
  const card = byId.get(id), star = starById.get(sid);
  if (!card || !["move", "momentum"].includes(card.kind) || !legalForSuperstar(star, card)) return draft;
  const oldId = draft[index]?.id ?? draft[index];
  if (oldId === id) return draft;
  const cap = card.kind === "momentum" ? 12 : 5;
  const current = usedCount(draft, id);
  const familyCurrent = usedCopyFamilyCount(draft, card);
  const owned = ownedTotal(profile, id);
  const out = draft.map(e => ({ ...(typeof e === "string" ? { id: e, foil: false } : e) }));
  if (current < Math.min(cap, owned) && (!card.copyFamily || familyCurrent < 5)) {
    const withoutSlot = out.filter((_,i)=>i!==index);
    const foil = preferredOwnedFinish(profile, withoutSlot, id);
    if (foil === null) return draft;
    out[index] = { id, foil };
    return out;
  }
  const swapIndex = out.findIndex((entry, i) => i >= 5 && entry.id === id);
  if (swapIndex >= 5) {
    const tmp = out[index]; out[index] = out[swapIndex]; out[swapIndex] = tmp;
    return out;
  }
  return draft;
}

export function selectedEntranceId(profile, sid) {
  const star = starById.get(sid);
  const saved = profile?.selectedEntrances?.[sid];
  const card = saved ? byId.get(saved) : null;
  if (card && ownedTotal(profile, saved) > 0 && entranceEligibilityForSuperstar(star, card).legal) return saved;
  const baseline = byId.get(DEFAULT_PLAYER_ENTRANCE_ID);
  if (baseline && ownedTotal(profile, DEFAULT_PLAYER_ENTRANCE_ID) > 0 && entranceEligibilityForSuperstar(star, baseline).legal) return DEFAULT_PLAYER_ENTRANCE_ID;
  return null;
}
export function setSelectedEntrance(profile, sid, entranceId) {
  const star = starById.get(sid), card = byId.get(entranceId);
  if (!card || ownedTotal(profile, entranceId) < 1) return false;
  if (!entranceEligibilityForSuperstar(star, card).legal) return false;
  profile.selectedEntrances ??= {};
  profile.selectedEntrances[sid] = entranceId;
  return true;
}

export function validateDeckDraft(profile, sid, draft, entranceId = selectedEntranceId(profile, sid)) {
  const star = starById.get(sid);
  const cards = materializeDraft(draft);
  const base = evaluateDeckHealth(cards);
  const violations = [...base.violations];
  if (cards.length !== draft.length) violations.push("Deck contains a card that is no longer active.");

  const counts = new Map();
  for (const card of cards) {
    counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
    const eligibility = cardEligibilityForSuperstar(star, card);
    if (!eligibility.legal) violations.push(`${card.name}: ${eligibility.reason}.`);
  }
  for (const [id, count] of counts) {
    const owned = ownedTotal(profile, id);
    if (count > owned) violations.push(`${byId.get(id)?.name ?? id}: deck uses ${count}, Collection owns ${owned}.`);
    const foilUsed = usedFinishCount(draft,id,true);
    const normalUsed = usedFinishCount(draft,id,false);
    if (foilUsed > ownedFoil(profile,id)) violations.push(`${byId.get(id)?.name ?? id}: deck uses ${foilUsed} Foil, Collection owns ${ownedFoil(profile,id)} Foil.`);
    if (normalUsed > ownedNormal(profile,id)) violations.push(`${byId.get(id)?.name ?? id}: deck uses ${normalUsed} Normal, Collection owns ${ownedNormal(profile,id)} Normal.`);
  }

  const lead = cards.slice(0, 5);
  if (lead.length !== 5) violations.push(`Lead Off must contain 5 pages (${lead.length}/5).`);
  if (lead.some(card => !["move", "momentum"].includes(card.kind))) violations.push("Lead Off 5 may contain only Moves and Momentum.");
  if (lead.length === 5 && !lead.some(card => card.kind === "momentum")) violations.push("Lead Off 5 needs at least one Momentum page.");
  if (lead.length === 5 && !lead.some(card => card.kind === "move")) violations.push("Lead Off 5 needs at least one Move.");

  const entrance = entranceId ? byId.get(entranceId) : null;
  if (!entrance) violations.push("Choose an Entrance.");
  else {
    const e = entranceEligibilityForSuperstar(star, entrance);
    if (!e.legal) violations.push(`${entrance.name}: ${e.reason}.`);
    if (ownedTotal(profile, entrance.id) < 1) violations.push(`${entrance.name}: Entrance is not owned.`);
  }

  const unique = [...new Set(violations)];
  return { ...base, healthy: unique.length === 0, score: Math.max(0, 100 - unique.length * 12), violations: unique };
}

export function normalizeDeckFinishes(profile, _sid, entries = []) { return preferOwnedDraftFoils(profile, entries.map(e => typeof e === "string" ? { id:e, foil:false } : { ...e })); }
export function optimizeDeck(profile, sid) { return enforceOwnedDraft(profile, sid, buildBestOwnedRecommendedDraft(profile, sid)); }

// Recommended decks are blueprints, not free cards. Build only copies the
// player actually owns, preserving authored order and Lead Off order.
export function buildOwnedRecommendedDraft(profile, sid) {
  const wanted = recommendedDeckDraft(sid), used = new Map(), out = [];
  for (const entry of wanted) {
    const id = entry.id ?? entry, count = used.get(id) ?? 0, owned = ownedTotal(profile, id);
    if (count < owned) { out.push({ id, foil: false }); used.set(id, count + 1); }
  }
  return enforceOwnedDraft(profile, sid, out);
}


function maxDeckCopies(card) {
  const defaultCap = card?.kind === "momentum" ? 12 : 5;
  return Math.min(defaultCap, Number.isFinite(card?.maxCopies) ? card.maxCopies : defaultCap);
}

// Hard inventory guard for player-facing automatic deck builders. Even if an
// authored blueprint or legacy saved deck references unavailable pages, an
// automatic rebuild may only emit copies that physically exist in Collection.
export function enforceOwnedDraft(profile, sid, draft = []) {
  const star = starById.get(sid);
  if (!star) return [];
  const out = [];
  for (const raw of draft) {
    const id = raw?.id ?? raw, card = byId.get(id);
    if (!card || !legalForSuperstar(star, card)) continue;
    const ownedCap = Math.min(maxDeckCopies(card), ownedTotal(profile, id));
    if (usedCount(out, id) >= ownedCap) continue;
    if (card.copyFamily && usedCopyFamilyCount(out, card) >= 5) continue;
    out.push({ id, foil: false });
  }
  return preferOwnedDraftFoils(profile, out);
}

function canUseOwnedCandidate(profile, draft, card) {
  if (!card || usedCount(draft, card.id) >= Math.min(maxDeckCopies(card), ownedTotal(profile, card.id))) return false;
  return !card.copyFamily || usedCopyFamilyCount(draft, card) < 5;
}

function replacementScore(target, candidate, inLeadOff = false) {
  if (!candidate) return -Infinity;
  if (inLeadOff && !["move","momentum"].includes(candidate.kind)) return -Infinity;
  let score = 0;
  const targetBucket = categoryForCard(target), candidateBucket = categoryForCard(candidate);
  if (targetBucket === candidateBucket) score += 120;
  if (target?.kind === candidate.kind) score += 45;
  if (target?.method && target.method === candidate.method) score += 30;
  if (target?.moveType && target.moveType === candidate.moveType) score += 18;
  if (!!target?.finisher === !!candidate.finisher) score += 12;
  if (!!target?.trademark === !!candidate.trademark) score += 10;
  if (Number.isFinite(target?.cost) && Number.isFinite(candidate.cost)) score -= Math.abs(target.cost - candidate.cost) * 3;
  score += Math.min(4, Number(candidate.rarity ?? 1)) * 2;
  return score;
}

function preferOwnedDraftFoils(profile, draft = []) {
  const usedFoils = new Map();
  return draft.map(raw => {
    const entry = typeof raw === "string" ? { id: raw, foil: false } : { ...raw };
    const ownedFoils = Math.max(0, Number(profile?.ownedCards?.[entry.id]?.foil) || 0);
    const used = usedFoils.get(entry.id) ?? 0;
    entry.foil = used < ownedFoils;
    if (entry.foil) usedFoils.set(entry.id, used + 1);
    return entry;
  });
}

// Build as close to the authored 60-page blueprint as the Collection permits,
// then fill every unavailable recommended slot with the best legal owned
// substitute. This is the canonical player-facing "build what I can" routine.
export function buildBestOwnedRecommendedDraft(profile, sid) {
  const star = starById.get(sid), wantedCards = decks[sid] ?? [];
  if (!star || wantedCards.length !== 60) return [];
  const candidates = eligibleOwnedCards(profile, sid);
  const out = [];
  const remainingNeed = new Map();
  for (const card of wantedCards) remainingNeed.set(card.id, (remainingNeed.get(card.id) ?? 0) + 1);

  for (let index = 0; index < wantedCards.length; index += 1) {
    const target = wantedCards[index];
    remainingNeed.set(target.id, Math.max(0, (remainingNeed.get(target.id) ?? 0) - 1));
    if (canUseOwnedCandidate(profile, out, target)) {
      out.push({ id: target.id, foil: false });
      continue;
    }

    const inLeadOff = index < 5;
    const choose = allowReserved => candidates
      .filter(card => {
        if (!canUseOwnedCandidate(profile, out, card)) return false;
        if (inLeadOff && !["move","momentum"].includes(card.kind)) return false;
        if (!allowReserved) {
          const availableAfterUse = ownedTotal(profile, card.id) - usedCount(out, card.id) - 1;
          if (availableAfterUse < (remainingNeed.get(card.id) ?? 0)) return false;
        }
        return true;
      })
      .sort((a,b) => replacementScore(target,b,inLeadOff) - replacementScore(target,a,inLeadOff) || a.name.localeCompare(b.name))[0];

    const replacement = choose(false) ?? choose(true);
    if (replacement) out.push({ id: replacement.id, foil: false });
  }
  return enforceOwnedDraft(profile, sid, out);
}

export function recommendedDeckMissingCount(sid, draft = []) {
  const recommended = new Map(), current = new Map();
  for (const card of decks[sid] ?? []) recommended.set(card.id, (recommended.get(card.id) ?? 0) + 1);
  for (const raw of draft) {
    const id = raw?.id ?? raw;
    if (id) current.set(id, (current.get(id) ?? 0) + 1);
  }
  let missing = 0;
  for (const [id, wanted] of recommended) missing += Math.max(0, wanted - (current.get(id) ?? 0));
  return missing;
}

export function recommendedEntranceId(profile, sid) {
  const star = starById.get(sid);
  if (!star) return selectedEntranceId(profile, sid);
  const authored = star.entranceId ? byId.get(star.entranceId) : null;
  if (authored && ownedTotal(profile, authored.id) > 0 && entranceEligibilityForSuperstar(star, authored).legal) return authored.id;
  return selectedEntranceId(profile, sid);
}

export function recommendedDeckComparison(profile, sid, draft = [], entranceId = selectedEntranceId(profile, sid)) {
  const recommended = new Map(), current = new Map();
  for (const card of decks[sid] ?? []) recommended.set(card.id, (recommended.get(card.id) ?? 0) + 1);
  for (const raw of draft) {
    const id = raw?.id ?? raw;
    if (id) current.set(id, (current.get(id) ?? 0) + 1);
  }
  const missingRows = [];
  const extras = [];
  let matched = 0;
  for (const [id, wanted] of recommended) {
    const have = current.get(id) ?? 0;
    matched += Math.min(wanted, have);
    const count = Math.max(0, wanted - have);
    if (!count) continue;
    const ownedReady = Math.min(count, Math.max(0, ownedTotal(profile, id) - have));
    missingRows.push({ id, card: byId.get(id), count, ownedReady, toCollect: count - ownedReady });
  }
  for (const [id, have] of current) {
    const excess = Math.max(0, have - (recommended.get(id) ?? 0));
    if (excess) extras.push({ id, card: byId.get(id), count: excess });
  }

  const extraPool = extras.map(row => ({ ...row }));
  const replacements = [];
  for (const row of missingRows) {
    let remaining = row.count;
    while (remaining-- > 0) {
      const targetBucket = categoryForCard(row.card);
      let index = extraPool.findIndex(extra => extra.count > 0 && categoryForCard(extra.card) === targetBucket);
      if (index < 0) index = extraPool.findIndex(extra => extra.count > 0);
      if (index < 0) break;
      const extra = extraPool[index];
      extra.count -= 1;
      const existing = replacements.find(x => x.targetId === row.id && x.replacementId === extra.id && x.ownedReady === (row.ownedReady > 0));
      if (existing) existing.count += 1;
      else replacements.push({ targetId: row.id, target: row.card, replacementId: extra.id, replacement: extra.card, count: 1, ownedReady: row.ownedReady > 0 });
    }
  }
  const authoredEntrance = starById.get(sid)?.entranceId ?? null;
  const entranceReady = !!authoredEntrance && authoredEntrance !== entranceId && ownedTotal(profile, authoredEntrance) > 0 && entranceEligibilityForSuperstar(starById.get(sid), byId.get(authoredEntrance)).legal;
  return {
    matched,
    missing: Math.max(0, 60 - matched),
    coverage: Math.round((matched / Math.max(1, (decks[sid] ?? []).length)) * 100),
    missingRows,
    replacements,
    authoredEntranceId: authoredEntrance,
    entranceUpgradeReady: entranceReady
  };
}

export function autoFillOwnedDraft(profile, sid, draft = []) {
  const star = starById.get(sid); if (!star) return [...draft];
  const out = [...draft.map(e => typeof e === "string" ? { id: e, foil: false } : { ...e })];
  const target = (decks[sid] ?? []).length || 60;
  const candidates = eligibleOwnedCards(profile, sid).sort((a, b) => {
    const ar = a.rarity ?? 0, br = b.rarity ?? 0; if (br !== ar) return br - ar;
    return (a.cost ?? 0) - (b.cost ?? 0) || a.name.localeCompare(b.name);
  });
  let guard = 0;
  while (out.length < target && guard++ < target * 20) {
    let added = false;
    for (const card of candidates) {
      const defaultCap = card.kind === "momentum" ? 12 : 5;
      const cap = Math.min(defaultCap, Number.isFinite(card.maxCopies) ? card.maxCopies : defaultCap);
      if (usedCount(out, card.id) >= Math.min(cap, ownedTotal(profile, card.id))) continue;
      if (card.copyFamily && usedCopyFamilyCount(out, card) >= 5) continue;
      out.push({ id: card.id, foil: false }); added = true;
      if (out.length >= target) break;
    }
    if (!added) break;
  }
  return enforceOwnedDraft(profile, sid, out);
}
