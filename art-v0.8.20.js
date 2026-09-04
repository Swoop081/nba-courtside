/* NBA Courtside v0.8.25 — artwork authority + Home Screen icon correction */
const artUrlBeforeV088=artUrl;
artUrl=function(p){
  return `assets/player-art/${p.artSlug}.png?v=0.8.25`;
};

(function applyCourtsideHomeIcon(){
  const iconHref='assets/brand/nba-courtside-icon-v0.8.25.svg?v=0.8.25';
  document.querySelectorAll('link[rel="apple-touch-icon"],link[rel="icon"]').forEach(link=>{
    link.setAttribute('href',iconHref);
    link.setAttribute('type','image/svg+xml');
    link.removeAttribute('sizes');
  });
  const manifest=document.querySelector('link[rel="manifest"]');
  if(manifest) manifest.setAttribute('href','manifest.json?v=0.8.25');
  const version=document.querySelector('.brand-version');
  if(version) version.textContent='v0.8.25';
})();

if(typeof renderStarterFive==='function') renderStarterFive();
