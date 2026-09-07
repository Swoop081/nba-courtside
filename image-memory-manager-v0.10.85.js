/* NBA Starting5 v0.13.0-dev.6 — lightweight player-art loading policy; no global observer, interval, or retained IntersectionObserver targets. */
(()=>{
  if(window.__starting5ImageMemoryManagerV01306)return;
  window.__starting5ImageMemoryManagerV01306=true;
  const SELECTOR='.foundation-card .foundation-art img,.foundation-card img.cutout-art,.player-card .foundation-art img,.player-card img.cutout-art';
  const protectedImage=img=>!!img.closest('#game,#final,#foundationInspectBack,.modal,.sheet,.overlay,[role="dialog"]');
  const isPlayerArt=src=>/assets\/player-art\//i.test(String(src||''));
  const recent=[];
  const bind=img=>{if(!img)return;const src=img.getAttribute('src')||'';if(!isPlayerArt(src))return;img.loading=protectedImage(img)?'eager':'lazy';img.decoding='async';try{img.fetchPriority=protectedImage(img)?'high':'low'}catch{}const i=recent.indexOf(src);if(i>=0)recent.splice(i,1);recent.push(src);while(recent.length>20)recent.shift()};
  const scan=(root=document)=>{if(root?.matches?.(SELECTOR))bind(root);root?.querySelectorAll?.(SELECTOR).forEach(bind)};
  const refresh=()=>requestAnimationFrame(()=>scan(document));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
  ['s5:game-start','s5:matchup-start','s5:matchup-resolved','s5:season-hub-opened','s5:allstar-champions-open','s5:rising-stars-intro-open','s5:allstar-intro-open'].forEach(name=>window.addEventListener(name,refresh));
  document.addEventListener('click',refresh,true);
  window.STARTING5_IMAGE_MEMORY={recent,scan,restore:bind,release:()=>{}};
})();