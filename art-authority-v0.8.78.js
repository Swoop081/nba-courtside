/* NBA Courtside v0.8.78 — normalized art positioning across gameplay/catalogue/editor */
(()=>{
  const KEY='nbaCourtsideArtEditorV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const base=()=>window.COURTSIDE_BASE_ART_LAYOUT||{};
  const editorReferenceWidth=()=>window.innerWidth<=430?Math.min(window.innerWidth*.45,185):Math.min(window.innerWidth*.43,210);
  const slugFromCard=(card)=>{
    if(card?.dataset?.artSlug)return card.dataset.artSlug;
    const img=card?.querySelector('.cutout-art');
    if(!img)return null;
    const src=(img.getAttribute('src')||'').split('?')[0];
    const file=src.split('/').pop()||'';
    return file.replace(/\.(png|webp|jpe?g)$/i,'')||null;
  };
  const configFor=(slug)=>read()[slug]||base()[slug]||null;
  const scaledY=(card,y)=>{
    const w=card?.getBoundingClientRect?.().width||card?.clientWidth||0;
    const ref=editorReferenceWidth();
    if(!w||w<20||!ref)return null;
    return Number(y||0)*(w/ref);
  };
  const applyCard=(card)=>{
    if(!card)return;
    const slug=slugFromCard(card),c=slug&&configFor(slug),img=card.querySelector('.cutout-art');
    if(!slug||!c||!img)return;
    const y=scaledY(card,c.y);
    if(y===null)return;
    card.dataset.artSlug=slug;
    img.style.setProperty('top',`${y}px`,'important');
    img.style.setProperty('left',`${c.x}%`,'important');
    img.style.setProperty('transform',`translateX(-50%) scale(${c.scale})`,'important');
    img.style.setProperty('transform-origin','center top','important');
  };
  const applyAll=(root=document)=>root.querySelectorAll?.('.player-card')?.forEach(applyCard);
  const schedule=()=>{requestAnimationFrame(()=>applyAll());setTimeout(()=>applyAll(),40);};

  applyAll();schedule();setTimeout(()=>applyAll(),150);setTimeout(()=>applyAll(),500);

  const observer=new MutationObserver(muts=>{
    for(const m of muts){for(const n of m.addedNodes){if(!(n instanceof Element))continue;if(n.matches?.('.player-card'))applyCard(n);applyAll(n);}}
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  // Any screen/navigation change can reveal cards that were width:0 while hidden.
  document.addEventListener('click',schedule,true);
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',()=>setTimeout(schedule,120),{passive:true});

  window.COURTSIDE_APPLY_ART_LAYOUT=applyAll;
  window.COURTSIDE_APPLY_ART_CARD=applyCard;
  window.COURTSIDE_ART_REFERENCE_WIDTH=editorReferenceWidth;
})();
