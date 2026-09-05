/* NBA Courtside v0.9.15 — PNG-only Foundation artwork with dynamic cache busting during 150-card art pass */
(()=>{
  const token=()=>window.COURTSIDE_ASSET_TOKEN||Date.now();
  const pngFor=p=>`assets/player-art/${p.artSlug}.png?t=${token()}`;
  window.artUrl=function(p){
    if(p?.set==='2026–27 Foundation'||p?.playerId?.startsWith('foundation-')) return pngFor(p);
    const c=typeof artConfig==='function'?artConfig(p):{url:''};
    if(c?.url){
      const clean=String(c.url).replace(/\.webp(?=([?#]|$))/i,'.png');
      return clean.replace(/[?&]v=[^&#]*/i,'')+(clean.includes('?')?'&':'?')+'t='+token();
    }
    return pngFor(p);
  };

  const repair=()=>document.querySelectorAll('.foundation-card[data-art-slug],.foundation-card').forEach(card=>{
    const id=card.dataset.id;
    const p=(window.COURTSIDE_FOUNDATION_PLAYERS||[]).find(x=>x.id===id);
    const img=card.querySelector('.foundation-art img,.cutout-art');
    if(p&&img){
      const src=pngFor(p);
      img.style.display='';
      if(img.getAttribute('src')!==src) img.src=src;
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair);else repair();
})();
