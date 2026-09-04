/* NBA Courtside v0.8.7 — user-approved Tip-Off 27 artwork */
const APPROVED_USER_ART_V087=new Set([
  'brandin-podziemski','jakobe-walter','jalen-johnson','jeremiah-fears',
  'kon-knueppel','michael-porter-jr','reed-sheppard','rudy-gobert','victor-wembanyama'
]);
const artUrlBeforeV087=artUrl;
artUrl=function(p){
  if(APPROVED_USER_ART_V087.has(p.artSlug)) return `assets/player-art/${p.artSlug}.webp?v=0.8.7`;
  return artUrlBeforeV087(p);
};
/* app.js renders the intro lineup before this override loads, so refresh it once. */
if(typeof renderStarterFive==='function') renderStarterFive();
