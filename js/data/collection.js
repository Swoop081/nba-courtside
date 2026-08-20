import { superstars } from "./superstars.js?v=0.13.72";
import { sets } from "./sets.js?v=0.13.72";
import { allGameplayCards } from "./content.js?v=0.13.72";
import { CARD_NUMBER_MANIFEST, CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from "./card-number-manifest.js?v=0.13.72";

const rarityLabels = { 1: "Common", 2: "Uncommon", 3: "Rare", 4: "Very Rare" };
const orderedStars = Object.values(superstars);
const starCards = orderedStars.map(s => ({
  id: `superstar-${s.id}`,
  name: s.name,
  kind: "superstar",
  superstarId: s.id,
  subtitle: s.nickname,
  rarity: 4,
  setId: s.setId,
  era: s.era ?? null,
}));

const base = [...allGameplayCards, ...starCards];
const baseById = new Map(base.map(card => [card.id, card]));

if (baseById.size !== base.length) {
  throw new Error("WWE Legacy collection contains duplicate active card IDs.");
}
if (CARD_NUMBER_MANIFEST.length !== base.length) {
  throw new Error(`Canonical card manifest has ${CARD_NUMBER_MANIFEST.length} entries for ${base.length} active cards.`);
}
for (const card of base) {
  const manifest = CARD_NUMBER_BY_ID[card.id];
  if (!manifest) throw new Error(`Active card ${card.id} is missing from the canonical card-number manifest.`);
  if (manifest.setId !== card.setId) throw new Error(`Canonical manifest set mismatch for ${card.id}: ${manifest.setId} != ${card.setId}.`);
  // Preserve the existing shared card objects used by decks/gameplay, but stamp
  // their collector identity from the one authoritative manifest.
  card.cardNumber = manifest.cardNumber;
  card.cardCode = manifest.cardCode;
}
for (const manifest of CARD_NUMBER_MANIFEST) {
  if (!baseById.has(manifest.id)) throw new Error(`Canonical manifest contains inactive card ${manifest.id}.`);
}

export const collectionCardsBySet = {};
for (const setId of Object.keys(sets)) {
  const ids = CARD_IDS_BY_SET[setId] ?? [];
  const list = ids.map(id => baseById.get(id)).filter(Boolean);
  collectionCardsBySet[setId] = list;
}

export const collectionCards = Object.values(collectionCardsBySet).flat();
export const setCollections = Object.fromEntries(
  Object.entries(collectionCardsBySet).map(([setId, list]) => [setId, {
    ...sets[setId],
    cardCount: list.length,
    superstarCount: list.filter(c => c.kind === "superstar").length,
    rarityLabels,
  }])
);
export const setCollection = setCollections["summerslam-series-1"];
export function cardsForSet(setId) { return collectionCardsBySet[setId] ?? []; }
export function setCollectionFor(setId) { return setCollections[setId] ?? null; }
