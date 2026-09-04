/* NBA Courtside v0.8.8 — local Tip-Off 27 artwork authority */
const artUrlBeforeV088=artUrl;
artUrl=function(p){
  return `assets/player-art/${p.artSlug}.png?v=0.8.8`;
};
/* app.js renders the intro lineup before this override loads, so refresh it once. */
if(typeof renderStarterFive==='function') renderStarterFive();
