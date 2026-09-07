/* NBA Starting5 v0.13.0-dev.6 — Foundation art scale sync without DOM mutation polling. */
(()=>{
  if(window.__starting5FoundationArtScaleV01306)return;
  window.__starting5FoundationArtScaleV01306=true;
  const KEY='nbaCourtsideArtEditorV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const configFor=slug=>read()[slug]||window.COURTSIDE_FOUNDATION_ART_LAYOUT?.[slug]||null;
  const canonicalWidth=()=>Math.min(window.innerWidth*.72,290);
  function applyCard(card){if(!card?.classList?.contains('foundation-card')||card.closest('.art-editor-preview'))return;const slug=card.dataset.artSlug,c=configFor(slug);if(!slug||!c)return;const img=card.querySelector('.cutout-art,.foundation-art img,.photo');if(!img)return;const w=card.getBoundingClientRect().width;if(!w)return;const factor=w/canonicalWidth(),y=Number(c.y||0)*factor;img.style.setProperty('top',`${y}px`,'important');img.style.setProperty('left',`${Number(c.x)}%`,'important');img.style.setProperty('transform',`translateX(-50%) scale(${Number(c.scale)})`,'important');img.style.setProperty('transform-origin','center top','important')}
  function applyAll(root=document){if(root?.matches?.('.foundation-card'))applyCard(root);root?.querySelectorAll?.('.foundation-card').forEach(applyCard)}
  const observed=new WeakSet(),ro=new ResizeObserver(entries=>entries.forEach(e=>applyCard(e.target)));
  function observeCurrent(){document.querySelectorAll('.foundation-card').forEach(card=>{if(!observed.has(card)){observed.add(card);ro.observe(card)}})}
  const refresh=()=>requestAnimationFrame(()=>{applyAll();observeCurrent()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
  ['s5:game-start','s5:matchup-start','s5:matchup-resolved','s5:season-hub-opened','s5:allstar-champions-open','s5:rising-stars-intro-open','s5:allstar-intro-open'].forEach(name=>window.addEventListener(name,refresh));
  document.addEventListener('click',refresh,true);
  window.addEventListener('resize',refresh,{passive:true});
  window.__courtsideFoundationArtScaleApply=applyAll;
})();