import { allGameplayCards } from "./content.js?v=0.13.72"; export const cards=Object.fromEntries(allGameplayCards.filter(c=>c.setId==="summerslam-series-1").map(c=>[c.id,c]));
