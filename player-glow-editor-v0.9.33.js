/* NBA Courtside v0.9.33 — per-player PNG edge glow, ON by default with per-card opt-out */
(()=>{
  const KEY='nbaCourtsidePlayerGlowV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const players=()=>window.COURTSIDE_FOUNDATION_PLAYERS||[];
  const playerBySlug=slug=>players().find(p=>p.artSlug===slug)||null;
  const playerForCard=card=>players().find(p=>p.id===card?.dataset?.id)||null;
  const enabledFor=p=>read()[p?.artSlug]!==false;
  const GLOW='drop-shadow(0 0 2px rgba(255,255,255,.95)) drop-shadow(0 0 5px rgba(255,255,255,.85)) drop-shadow(0 0 8px rgba(255,255,255,.55))';

  const applyCard=card=>{
    const p=playerForCard(card);if(!p)return;
    const img=card.querySelector('.foundation-art img,.cutout-art,.photo');if(!img)return;
    if(enabledFor(p)){
      img.style.setProperty('filter',GLOW,'important');
      img.dataset.playerGlow='on';
    }else{
      if(img.dataset.playerGlow==='on')img.style.removeProperty('filter');
      delete img.dataset.playerGlow;
    }
  };
  const applyAll=()=>document.querySelectorAll('.foundation-card').forEach(applyCard);

  function installControl(){
    const ed=document.getElementById('cardArtEditor');
    const controls=ed?.querySelector('.art-editor-controls');
    const select=ed?.querySelector('#artPlayerSelect');
    if(!ed||!controls||!select)return false;
    if(ed.querySelector('#artPlayerGlow'))return true;

    const row=document.createElement('div');
    row.className='art-control art-glow-toggle';
    row.innerHTML='<label style="align-items:center"><span>Player glow</span><input id="artPlayerGlow" type="checkbox" style="width:24px;height:24px;accent-color:#f7b928"></label><div style="font-size:11px;color:#9da6b4;line-height:1.35">On by default. Adds a soft white halo around the transparent PNG edge and follows the player as artwork is resized or moved.</div>';
    controls.appendChild(row);
    const toggle=row.querySelector('#artPlayerGlow');
    const current=()=>playerBySlug(select.value);
    const sync=()=>{const p=current();if(!p)return;toggle.checked=enabledFor(p);requestAnimationFrame(applyAll);};
    toggle.addEventListener('change',()=>{
      const p=current();if(!p)return;const store=read();
      if(toggle.checked)delete store[p.artSlug];else store[p.artSlug]=false;
      write(store);applyAll();
    });
    select.addEventListener('change',()=>setTimeout(sync,0));
    ed.querySelector('#artPrev')?.addEventListener('click',()=>setTimeout(sync,0));
    ed.querySelector('#artNext')?.addEventListener('click',()=>setTimeout(sync,0));
    new MutationObserver(()=>sync()).observe(ed.querySelector('#artPreview'),{childList:true,subtree:true});
    sync();return true;
  }

  const start=()=>{
    applyAll();let tries=0;const timer=setInterval(()=>{if(installControl()||++tries>80)clearInterval(timer)},100);
    new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.foundation-card'))applyCard(n);n.querySelectorAll?.('.foundation-card').forEach(applyCard)}}));installControl();}).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
