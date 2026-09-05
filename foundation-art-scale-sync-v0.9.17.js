/* NBA Courtside v0.9.17 — scale saved editor Y offsets to each rendered card size */
(()=>{
  const KEY='nbaCourtsideArtEditorV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const canonicalWidth=()=>Math.min(window.innerWidth*.72,290);

  function applyCard(card){
    if(!card?.classList?.contains('foundation-card'))return;
    if(card.closest('.art-editor-preview'))return; // editor stays in its native coordinate system
    const slug=card.dataset.artSlug;
    if(!slug)return;
    const c=read()[slug];
    if(!c)return;
    const img=card.querySelector('.cutout-art,.foundation-art img,.photo');
    if(!img)return;
    const w=card.getBoundingClientRect().width;
    if(!w)return;
    const factor=w/canonicalWidth();
    const y=Number(c.y||0)*factor;
    const expectedTop=`${y}px`;
    const expectedLeft=`${Number(c.x)}%`;
    const expectedTransform=`translateX(-50%) scale(${Number(c.scale)})`;
    if(img.style.getPropertyValue('top')!==expectedTop) img.style.setProperty('top',expectedTop,'important');
    if(img.style.getPropertyValue('left')!==expectedLeft) img.style.setProperty('left',expectedLeft,'important');
    if(img.style.getPropertyValue('transform')!==expectedTransform) img.style.setProperty('transform',expectedTransform,'important');
    img.style.setProperty('transform-origin','center top','important');
  }

  function applyAll(root=document){
    if(root?.matches?.('.foundation-card'))applyCard(root);
    root?.querySelectorAll?.('.foundation-card').forEach(applyCard);
  }

  const ro=new ResizeObserver(entries=>entries.forEach(e=>applyCard(e.target)));
  const observeCards=root=>{
    if(root?.matches?.('.foundation-card'))ro.observe(root);
    root?.querySelectorAll?.('.foundation-card').forEach(c=>ro.observe(c));
  };

  const start=()=>{
    applyAll();observeCards(document);
    const mo=new MutationObserver(muts=>{
      for(const m of muts){
        if(m.type==='childList')m.addedNodes.forEach(n=>{if(n.nodeType===1){applyAll(n);observeCards(n)}});
        if(m.type==='attributes'){
          const card=m.target.closest?.('.foundation-card');
          if(card)requestAnimationFrame(()=>applyCard(card));
        }
      }
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
    addEventListener('resize',()=>requestAnimationFrame(()=>applyAll()));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
