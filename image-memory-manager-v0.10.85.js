/* NBA Starting5 v0.10.85 — bounded player-art image memory for long iPhone sessions */
(()=>{
  if(window.__starting5ImageMemoryManagerV01085)return;
  window.__starting5ImageMemoryManagerV01085=true;

  const BLANK='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  const SELECTOR='.foundation-card .foundation-art img,.foundation-card img.cutout-art,.player-card .foundation-art img,.player-card img.cutout-art';
  const protectedImage=img=>!!img.closest('#game,#final,#foundationInspectBack,.modal,.sheet,.overlay,[role="dialog"]');
  const isPlayerArt=src=>/assets\/player-art\//i.test(String(src||''));

  // Keep only URL strings for recently seen artwork. This does not retain decoded bitmaps;
  // the browser HTTP cache can still make a return visit fast without growing JS image memory.
  const recent=[];
  const remember=src=>{
    if(!src||!isPlayerArt(src))return;
    const i=recent.indexOf(src);if(i>=0)recent.splice(i,1);
    recent.push(src);while(recent.length>20)recent.shift();
  };

  const release=img=>{
    if(!img||protectedImage(img))return;
    const src=img.getAttribute('src')||'';
    if(!isPlayerArt(src))return;
    img.dataset.starting5ArtSrc=src;
    remember(src);
    img.removeAttribute('srcset');
    img.src=BLANK;
    img.dataset.starting5Released='1';
  };

  const restore=img=>{
    if(!img)return;
    img.loading='lazy';
    img.decoding='async';
    img.fetchPriority='low';
    const saved=img.dataset.starting5ArtSrc;
    if(saved&&img.dataset.starting5Released==='1'){
      img.dataset.starting5Released='0';
      img.src=saved;
    }
  };

  const io='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    for(const e of entries){
      const img=e.target;
      if(e.isIntersecting)restore(img);else release(img);
    }
  },{root:null,rootMargin:'700px 500px',threshold:0.001}):null;

  const bind=img=>{
    if(!img||img.dataset.starting5Mem85==='1')return;
    const src=img.getAttribute('src')||'';
    if(!isPlayerArt(src))return;
    img.dataset.starting5Mem85='1';
    img.dataset.starting5ArtSrc=src;
    img.loading='lazy';
    img.decoding='async';
    img.fetchPriority=protectedImage(img)?'high':'low';
    if(io&&!protectedImage(img))io.observe(img);
  };

  const scan=root=>{
    if(root?.matches?.(SELECTOR))bind(root);
    root?.querySelectorAll?.(SELECTOR).forEach(bind);
  };

  const cleanupDetached=()=>{
    // Remove stale bookkeeping from nodes no longer in the document. The DOM itself can then be collected.
    document.querySelectorAll(`${SELECTOR}[data-starting5-released="1"]`).forEach(img=>{
      if(protectedImage(img))restore(img);
    });
  };

  const start=()=>{
    scan(document);
    new MutationObserver(muts=>{
      for(const m of muts)for(const n of m.addedNodes)if(n.nodeType===1)scan(n);
    }).observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)scan(document)},{passive:true});
    window.addEventListener('pageshow',()=>scan(document),{passive:true});
    setInterval(cleanupDetached,10000);
  };

  window.STARTING5_IMAGE_MEMORY={recent,scan,restore,release};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
