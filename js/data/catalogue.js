import { decks } from "./decks.js?v=0.13.72";
import { superstars } from "./superstars.js?v=0.13.72";
import { sets } from "./sets.js?v=0.13.72";
import { isPlayerReleasedSetId } from "./release.js?v=0.13.72";
import { MOVE_TYPE_LABELS } from "./move-types.js?v=0.13.72";

export const CATALOGUE_PAGE_SIZE = 48;
export const CATALOGUE_NUMERIC_OPERATORS = ["any", "eq", "lte", "gte"];
export const CATALOGUE_REQUIREMENT_METHODS = ["strength", "strike", "technical", "agility"];

const starList = Object.values(superstars).filter(star => !star.developmentOnly && isPlayerReleasedSetId(star.setId));
const starById = Object.fromEntries(starList.map(star => [star.id, star]));
const setOrder = Object.keys(sets);
const setRank = Object.fromEntries(setOrder.map((id, index) => [id, index]));

const usageByCardId = new Map();
for (const [starId, deck] of Object.entries(decks)) {
  for (const card of deck ?? []) {
    if (!card?.id) continue;
    if (!usageByCardId.has(card.id)) usageByCardId.set(card.id, new Set());
    usageByCardId.get(card.id).add(starId);
  }
}
for (const star of starList) {
  for (const id of [`superstar-${star.id}`, star.entranceId].filter(Boolean)) {
    if (!usageByCardId.has(id)) usageByCardId.set(id, new Set());
    usageByCardId.get(id).add(star.id);
  }
}

export function defaultCatalogueFilters() {
  return {
    search: "",
    setId: "all",
    superstarId: "all",
    superstarScope: "usage",
    ownership: "all",
    kind: "all",
    rarity: "all",
    method: "all",
    moveType: "all",
    moveFamily: "all",
    moveClass: "all",
    costOp: "any",
    costValue: "",
    damageOp: "any",
    damageValue: "",
    strengthReq: "any",
    strikeReq: "any",
    technicalReq: "any",
    agilityReq: "any",
    sortBy: "collector",
    sortDir: "asc",
  };
}

export function superstarIdsForCard(card) {
  const ids = new Set(usageByCardId.get(card?.id) ?? []);
  if (card?.superstarId) ids.add(card.superstarId);
  for (const id of card?.allowedSuperstarIds ?? []) ids.add(id);
  for (const tag of card?.allowedFactionTags ?? []) for (const star of starList) if ((star.factionTags ?? []).includes(tag)) ids.add(star.id);
  if (card?.kind === "superstar" && card.superstarId) ids.add(card.superstarId);
  return [...ids];
}

export function exclusiveSuperstarIdsForCard(card) {
  const ids = new Set();
  if (card?.superstarId) ids.add(card.superstarId);
  for (const id of card?.allowedSuperstarIds ?? []) ids.add(id);
  for (const tag of card?.allowedFactionTags ?? []) for (const star of starList) if ((star.factionTags ?? []).includes(tag)) ids.add(star.id);
  if (card?.kind === "superstar" && card.superstarId) ids.add(card.superstarId);
  return [...ids];
}

export function isSharedCard(card) {
  return card?.kind !== "superstar" && exclusiveSuperstarIdsForCard(card).length === 0;
}

export function catalogueOptions(cards) {
  const unique = key => [...new Set(cards.map(card => card?.[key]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
  return {
    methods: unique("method"),
    moveTypes: unique("moveType"),
    moveFamilies: unique("moveFamily"),
    superstars: starList.map(star => ({ id: star.id, name: star.name, setId: star.setId })),
  };
}

function numberMatches(value, op, target) {
  if (!op || op === "any" || target === "" || target === null || target === undefined) return true;
  const actual = Number(value);
  const wanted = Number(target);
  if (!Number.isFinite(actual) || !Number.isFinite(wanted)) return false;
  if (op === "eq") return actual === wanted;
  if (op === "lte") return actual <= wanted;
  if (op === "gte") return actual >= wanted;
  return true;
}

function requirementMatches(card, method, wanted) {
  if (wanted === "any" || wanted === "" || wanted === null || wanted === undefined) return true;
  if (card?.kind !== "move") return false;
  return Number(card.requirements?.[method] ?? 0) === Number(wanted);
}

function moveClassFor(card) {
  if (card?.finisher) return "finisher";
  if (card?.trademark) return "trademark";
  if (card?.signature) return "signature";
  return "standard";
}

function searchText(card) {
  const starNames = superstarIdsForCard(card).map(id => starById[id]?.name ?? id).join(" ");
  const req = Object.entries(card.requirements ?? {}).map(([method, amount]) => `${amount} ${method}`).join(" ");
  return [
    card.name,
    card.subtitle,
    card.kind,
    card.cardCode,
    sets[card.setId]?.displayName,
    card.method,
    MOVE_TYPE_LABELS[card.moveType] ?? card.moveType,
    card.moveFamily,
    card.effectText,
    card.abilityText,
    req,
    starNames,
  ].filter(Boolean).join(" ").toLowerCase();
}

function primarySuperstarName(card) {
  const ids = superstarIdsForCard(card);
  if (!ids.length) return "zzzz shared";
  return ids.map(id => starById[id]?.name ?? id).sort((a, b) => a.localeCompare(b))[0];
}

function compareCards(a, b, sortBy, ownershipFor) {
  const number = (left, right) => (Number(left) || 0) - (Number(right) || 0);
  if (sortBy === "alpha") return String(a.name).localeCompare(String(b.name));
  if (sortBy === "set") return (setRank[a.setId] ?? 999) - (setRank[b.setId] ?? 999) || number(a.cardNumber, b.cardNumber);
  if (sortBy === "superstar") return primarySuperstarName(a).localeCompare(primarySuperstarName(b)) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "kind") return String(a.kind).localeCompare(String(b.kind)) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "rarity") return number(a.rarity, b.rarity) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "cost") return number(a.cost, b.cost) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "damage") return number(a.damage, b.damage) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "strength") return number(a.requirements?.strength, b.requirements?.strength) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "strike") return number(a.requirements?.strike, b.requirements?.strike) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "technical") return number(a.requirements?.technical, b.requirements?.technical) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "agility") return number(a.requirements?.agility, b.requirements?.agility) || String(a.name).localeCompare(String(b.name));
  if (sortBy === "owned") return number(ownershipFor?.(a)?.total, ownershipFor?.(b)?.total) || String(a.name).localeCompare(String(b.name));
  return (setRank[a.setId] ?? 999) - (setRank[b.setId] ?? 999) || number(a.cardNumber, b.cardNumber) || String(a.name).localeCompare(String(b.name));
}

export function filterAndSortCatalogue(cards, filters = defaultCatalogueFilters(), ownershipFor = () => ({ total: 0 }), now = new Date()) {
  const query = String(filters.search ?? "").trim().toLowerCase();
  const out = cards.filter(card => {
    if (!isPlayerReleasedSetId(card?.setId, now)) return false;
    if (filters.setId && filters.setId !== "all" && card.setId !== filters.setId) return false;
    if (filters.kind && filters.kind !== "all" && card.kind !== filters.kind) return false;
    if (filters.rarity && filters.rarity !== "all" && String(card.rarity) !== String(filters.rarity)) return false;
    if (filters.method && filters.method !== "all" && card.method !== filters.method) return false;
    if (filters.moveType && filters.moveType !== "all" && card.moveType !== filters.moveType) return false;
    if (filters.moveFamily && filters.moveFamily !== "all" && card.moveFamily !== filters.moveFamily) return false;
    if (filters.moveClass && filters.moveClass !== "all" && (card.kind !== "move" || moveClassFor(card) !== filters.moveClass)) return false;

    const ownership = ownershipFor(card) ?? { total: 0 };
    if (filters.ownership === "owned" && !(ownership.total > 0)) return false;
    if (filters.ownership === "unowned" && ownership.total > 0) return false;

    if (filters.superstarId && filters.superstarId !== "all") {
      if (filters.superstarId === "shared") {
        if (!isSharedCard(card)) return false;
      } else {
        const ids = filters.superstarScope === "exclusive" ? exclusiveSuperstarIdsForCard(card) : superstarIdsForCard(card);
        if (!ids.includes(filters.superstarId)) return false;
      }
    }

    if (!numberMatches(card.cost ?? 0, filters.costOp, filters.costValue)) return false;
    if (!numberMatches(card.damage ?? 0, filters.damageOp, filters.damageValue)) return false;
    if (!requirementMatches(card, "strength", filters.strengthReq)) return false;
    if (!requirementMatches(card, "strike", filters.strikeReq)) return false;
    if (!requirementMatches(card, "technical", filters.technicalReq)) return false;
    if (!requirementMatches(card, "agility", filters.agilityReq)) return false;
    if (query && !searchText(card).includes(query)) return false;
    return true;
  });

  const direction = filters.sortDir === "desc" ? -1 : 1;
  return out.sort((a, b) => direction * compareCards(a, b, filters.sortBy ?? "collector", ownershipFor));
}
