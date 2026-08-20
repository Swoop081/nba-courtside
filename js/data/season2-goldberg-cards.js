import { allGameplayCards } from "./content.js?v=0.13.72";

// Canonical Season 2 prestige-reward package. Kept as a focused export so
// reward/store/collection surfaces can reference Goldberg without duplicating
// card definitions from the gameplay pool.
export const season2GoldbergCards = Object.fromEntries(
  allGameplayCards
    .filter(card => card.setId === "season-2-whos-next")
    .map(card => [card.id, card])
);
