/* NBA Courtside v0.9.16 — final runtime PNG authority for Foundation artwork */
(()=>{
  const bust=()=>window.COURTSIDE_ASSET_TOKEN||Date.now();
  const pngFor=p=>`assets/player-art/${p.artSlug}.png?t=${bust()}`;

  window.artUrl=function(p){
    if(p?.set==='2026–27 Foundation'||p?.playerId?.startsWith('foundation-')) return pngFor(p);
    const c=typeof artConfig==='function'?artConfig(p):{url:''};
    if(c?.url)return String(c.url).replace(/\.webp(?=([?#]|$))/i,'.png');
    return `assets/player-art/${p.artSlug}.png?t=${bust()}`;
  };

  const playerForCard=card=>{
    const id=card?.dataset?.id;
    if(!id)return null;
    return (window.COURTSIDE_FOUNDATION_PLAYERS||[]).find(p=>p.id===id)||null;
  };

  const repairCard=card=>{
    const p=playerForCard(card);
    if(!p)return;
    card.dataset.artSlug=p.artSlug;
    const img=card.querySelector('.foundation-art img,.cutout-art,.photo');
    if(!img)return;
    const wanted=pngFor(p);
    const current=img.getAttribute('src')||'';
    if(!current.includes(`assets/player-art/${p.artSlug}.png`)){
      img.style.display='';
      img.removeAttribute('hidden');
      img.src=wanted;
    }else if(img.style.display==='none'){
      img.style.display='';
      img.src=wanted;
    }
    img.addEventListener('load',()=>{
      img.style.display='';
      card.querySelector('.foundation-art')?.classList.remove('no-art');
    },{once:true});
  };

  const repairAll=root=>{
    if(root?.matches?.('.foundation-card'))repairCard(root);
    root?.querySelectorAll?.('.foundation-card').forEach(repairCard);
  };

  const original=window.cardMarkup;
  if(typeof original==='function'){
    window.cardMarkup=function(p,o={}){
      let html=original(p,o);
      if(p?.set==='2026–27 Foundation'||p?.playerId?.startsWith('foundation-')){
        const src=pngFor(p).replace(/&/g,'&amp;');
        html=html.replace(/(<div class="foundation-art(?: art-stage)?">\s*<img[^>]*?src=")[^"]*(")/i,`$1${src}$2`);
      }
      return html;
    };
  }

  const start=()=>{
    repairAll(document);
    const mo=new MutationObserver(muts=>muts.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)repairAll(n)})));
    mo.observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
