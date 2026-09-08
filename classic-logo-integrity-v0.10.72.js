/* NBA Starting5 v0.13.0-dev.18 — Classic Team logo integrity + presentation audit loader */
(()=>{
  if(window.__starting5ClassicLogoIntegrityV01072)return;
  window.__starting5ClassicLogoIntegrityV01072=true;

  const isClassicCard=card=>card?.classList?.contains('classic-team-card')||!!card?.querySelector?.('.foundation-team-logo[src*="/classic/"]');
  const syncCard=card=>{
    if(!card||!isClassicCard(card))return;
    const plaque=card.querySelector('.foundation-team-logo,.team-logo,.team-mark img');
    const bg=card.querySelector('.foundation-bg-team-logo');
    if(!plaque?.src||!bg)return;
    if(bg.src!==plaque.src)bg.src=plaque.src;
  };
  const scan=root=>{
    if(root?.matches?.('.foundation-card,.player-card'))syncCard(root);
    root?.querySelectorAll?.('.foundation-card,.player-card').forEach(syncCard);
  };
  const loadScript=(src,key)=>{
    if(document.querySelector(`script[data-${key}]`))return;
    const s=document.createElement('script');
    s.dataset[key]='1';
    s.src=src+'?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  };
  const loadPersistence=()=>{
    if(!window.__starting5BgLayoutPersistenceV01073)loadScript('art-layout-bg-persistence-v0.10.73.js','starting5BgLayoutV01073');
  };
  const loadClassicAudit=()=>{
    if(!window.__starting5ClassicIntegrityV0130)loadScript('classic-team-integrity-v0.13.0.js','starting5ClassicIntegrityV0130');
  };
  const start=()=>{
    scan(document);loadPersistence();loadClassicAudit();
    new MutationObserver(ms=>{
      for(const m of ms){
        if(m.type==='attributes')syncCard(m.target.closest?.('.foundation-card,.player-card'));
        m.addedNodes?.forEach?.(n=>{if(n.nodeType===1)scan(n)});
      }
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
