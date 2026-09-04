/* NBA Courtside v0.8.77 — authoritative art positioning across gameplay/catalogue/editor */
(()=>{
  const KEY='nbaCourtsideArtEditorV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const base=()=>window.COURTSIDE_BASE_ART_LAYOUT||{};
  const slugFromCard=(card)=>{
    if(card?.dataset?.artSlug)return card.dataset.artSlug;
    const img=card?.querySelector('.cutout-art');
    if(!img)return null;
    const src=(img.getAttribute('src')||'').split('?')[0];
    const file=src.split('/').pop()||'';
    return file.replace(/\.(png|webp|jpe?g)$/i,'')||null;
  };
  const configFor=(slug)=>read()[slug]||base()[slug]||null;
  const applyCard=(card)=>{
    if(!card)return;
    const slug=slugFromCard(card),c=slug&&configFor(slug);
    const img=card.querySelector('.cutout-art');
    if(!slug||!c||!img)return;
    card.dataset.artSlug=slug;
    img.style.setProperty('top',`${c.y}px`,'important');
    img.style.setProperty('left',`${c.x}%`,'important');
    img.style.setProperty('transform',`translateX(-50%) scale(${c.scale})`,'important');
    img.style.setProperty('transform-origin','center top','important');
  };
  const applyAll=(root=document)=>root.querySelectorAll?.('.player-card')?.forEach(applyCard);

  // Existing cards may have rendered before the editor/baked-layout wrappers loaded.
  applyAll();
  requestAnimationFrame(()=>applyAll());
  setTimeout(()=>applyAll(),100);
  setTimeout(()=>applyAll(),500);

  // Every newly rendered gameplay/catalogue/editor card gets the same saved coordinates.
  const observer=new MutationObserver(muts=>{
    for(const m of muts){
      for(const n of m.addedNodes){
        if(!(n instanceof Element))continue;
        if(n.matches?.('.player-card'))applyCard(n);
        applyAll(n);
      }
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  // Re-apply the complete saved layout when leaving the editor, not just the last edited card.
  document.addEventListener('click',e=>{
    if(e.target?.id==='artEditorClose')requestAnimationFrame(()=>applyAll());
  },true);

  // Expose one authority helper for any future renderer.
  window.COURTSIDE_APPLY_ART_LAYOUT=applyAll;
})();
