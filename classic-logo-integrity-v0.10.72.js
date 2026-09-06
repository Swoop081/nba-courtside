/* NBA Starting5 v0.10.72 — Classic Team logo integrity: card background uses the exact plaque logo */
(()=>{
  if(window.__starting5ClassicLogoIntegrityV01072)return;
  window.__starting5ClassicLogoIntegrityV01072=true;

  const isClassicCard=card=>card?.classList?.contains('classic-team-card')||!!card?.querySelector?.('.foundation-team-logo[src*="/classic/"]');
  const syncCard=card=>{
    if(!card||!isClassicCard(card))return;
    const plaque=card.querySelector('.foundation-team-logo,.team-logo');
    const bg=card.querySelector('.foundation-bg-team-logo');
    if(!plaque?.src||!bg)return;
    if(bg.src!==plaque.src)bg.src=plaque.src;
  };
  const scan=root=>{
    if(root?.matches?.('.foundation-card,.player-card'))syncCard(root);
    root?.querySelectorAll?.('.foundation-card,.player-card').forEach(syncCard);
  };
  const start=()=>{
    scan(document);
    new MutationObserver(ms=>{
      for(const m of ms){
        if(m.type==='attributes')syncCard(m.target.closest?.('.foundation-card,.player-card'));
        m.addedNodes?.forEach?.(n=>{if(n.nodeType===1)scan(n)});
      }
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
