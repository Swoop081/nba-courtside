/* NBA Courtside v0.9.8 — PNG-only Foundation artwork during 150-card art pass */
(()=>{
  const pngFor=p=>`assets/player-art/${p.artSlug}.png?v=0.9.8`;
  window.artUrl=function(p){
    if(p?.set==='2026–27 Foundation'||p?.playerId?.startsWith('foundation-')) return pngFor(p);
    const c=typeof artConfig==='function'?artConfig(p):{url:''};
    if(c?.url){
      const clean=String(c.url).replace(/\.webp(?=([?#]|$))/i,'.png');
      return clean;
    }
    return `assets/player-art/${p.artSlug}.png?v=0.9.8`;
  };

  // Existing cardMarkup resolves artUrl at render time. This also repairs any
  // already-mounted Foundation images created before this override loaded.
  const repair=()=>document.querySelectorAll('.foundation-card[data-art-slug],.foundation-card').forEach(card=>{
    const id=card.dataset.id;
    const p=(window.COURTSIDE_FOUNDATION_PLAYERS||[]).find(x=>x.id===id);
    const img=card.querySelector('.foundation-art img,.cutout-art');
    if(p&&img){
      const src=pngFor(p);
      if(img.getAttribute('src')!==src){img.style.display='';img.src=src;}
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repair);else repair();
})();
