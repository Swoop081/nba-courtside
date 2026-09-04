/* NBA Courtside v0.8.28 — local Tip-Off 27 artwork authority */
const artUrlBeforeV088=artUrl;
artUrl=function(p){
  return `assets/player-art/${p.artSlug}.png?v=0.8.28`;
};

if(typeof renderStarterFive==='function') renderStarterFive();
