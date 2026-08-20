import { allGameplayCards } from "./content.js?v=0.13.72"; export const evolutionCards=Object.fromEntries(allGameplayCards.filter(c=>c.setId==="evolution-series-1").map(c=>[c.id,c]));
