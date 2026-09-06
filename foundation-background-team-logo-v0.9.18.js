/* NBA Starting5 v0.11.48 — robust background team-logo creation for every Foundation card */
(()=>{
  if(window.__starting5BgLogoCreateV01148)return;
  window.__starting5BgLogoCreateV01148=true;

  const playerPool=()=>{
    const pools=[];
    ['COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers','COURTSIDE_CLASSIC_PLAYERS'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
    const out=[],seen=new Set();
    for(const pool of pools)for(const p of pool||[]){
      if(!p)continue;
      const key=String(p.id||`${p.teamId||p.team||''}|${p.name||''}|${p.season||''}`);
      if(seen.has(key))continue;seen.add(key);out.push(p);
    }
    return out;
  };

  const playerForCard=card=>{
    const id=card?.dataset?.id;
    if(id){const p=playerPool().find(x=>String(x.id)===String(id));if(p)return p;}
    const name=card?.querySelector?.('.foundation-name,.identity h3')?.textContent?.trim();
    return name?playerPool().find(x=>String(x.name||'').trim()===name)||null:null;
  };

  const sourceFor=(card,p)=>{
    const plaque=card.querySelector('.foundation-team-logo');
    if(plaque?.src)return plaque.src;
    try{if(p&&typeof window.logoUrl==='function'){const u=window.logoUrl(p);if(u)return u;}}catch{}
    const imgs=[...card.querySelectorAll('img')];
    const candidate=imgs.find(img=>!img.classList.contains('cutout-art')&&!img.classList.contains('photo')&&!img.closest('.foundation-art')&&!img.classList.contains('foundation-bg-team-logo'));
    return candidate?.src||'';
  };

  const decorate=card=>{
    if(!card?.classList?.contains('foundation-card'))return;
    const p=playerForCard(card),src=sourceFor(card,p);
    let mark=card.querySelector('.foundation-bg-team-logo');
    if(!mark){
      mark=document.createElement('img');
      mark.className='foundation-bg-team-logo';
      mark.alt='';
      mark.setAttribute('aria-hidden','true');
      mark.decoding='async';
      card.insertBefore(mark,card.querySelector('.foundation-art')||card.firstChild);
    }
    if(src&&mark.src!==src)mark.src=src;
    mark.style.setProperty('display','block','important');
    mark.style.setProperty('visibility','visible','important');
    // If a team logo becomes available after the card mounts, refresh from the plaque.
    if(!src)setTimeout(()=>{const later=sourceFor(card,playerForCard(card));if(later)mark.src=later;},80);
  };

  const scan=root=>{
    if(root?.matches?.('.foundation-card'))decorate(root);
    root?.querySelectorAll?.('.foundation-card').forEach(decorate);
  };
  const start=()=>{
    scan(document);
    [0,80,250,700].forEach(ms=>setTimeout(()=>scan(document),ms));
    new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)}))).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
