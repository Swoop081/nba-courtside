/* NBA Starting5 v0.10.74 — authoritative Classic logo binding for plaque + background */
(()=>{
  if(window.__starting5ClassicLogoRuntimeV01074)return;
  window.__starting5ClassicLogoRuntimeV01074=true;
  const LOGOS=window.STARTING5_CLASSIC_LOCAL_PNG_LOGOS||{};
  const pools=()=>{
    const out=[];
    try{if(Array.isArray(players))out.push(players)}catch{}
    if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);
    if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);
    return out;
  };
  const allPlayers=()=>{const seen=new Set(),out=[];for(const pool of pools())for(const p of pool||[]){if(p&&!seen.has(p)){seen.add(p);out.push(p)}}return out;};
  const bySlug=slug=>allPlayers().find(p=>p?.artSlug===slug)||null;
  const byId=id=>allPlayers().find(p=>String(p?.id)===String(id))||null;
  const byName=name=>{const n=String(name||'').trim().toLowerCase();return n?allPlayers().find(p=>String(p?.name||'').trim().toLowerCase()===n)||null:null;};
  const playerForCard=card=>{
    if(!card)return null;
    const slug=card.dataset?.artSlug;
    if(slug){const p=bySlug(slug);if(p)return p;}
    const id=card.dataset?.id;
    if(id){const p=byId(id);if(p)return p;}
    const name=card.querySelector('.identity h3,.player-name,h3')?.textContent;
    return byName(name);
  };
  const setSrc=(img,src)=>{if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src);};
  const fixCard=card=>{
    const p=playerForCard(card); const src=p&&LOGOS[p.teamId]; if(!src)return;
    card.classList.add('classic-team-card');
    card.querySelectorAll('.foundation-team-logo,.team-logo,.foundation-bg-team-logo,.team-mark img').forEach(img=>setSrc(img,src));
    const bg=card.querySelector('.foundation-bg-team-logo');
    const plaque=card.querySelector('.foundation-team-logo,.team-logo');
    if(bg&&plaque?.src&&bg.src!==plaque.src)bg.src=plaque.src;
  };
  const scan=root=>{
    if(root?.matches?.('.foundation-card,.player-card'))fixCard(root);
    root?.querySelectorAll?.('.foundation-card,.player-card').forEach(fixCard);
  };
  const start=()=>{
    scan(document);
    new MutationObserver(ms=>{
      for(const m of ms){
        if(m.type==='attributes'){const card=m.target.closest?.('.foundation-card,.player-card');if(card)fixCard(card);}
        m.addedNodes?.forEach?.(n=>{if(n.nodeType===1)scan(n)});
      }
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','data-id','data-art-slug']});
    setInterval(()=>scan(document),500);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
