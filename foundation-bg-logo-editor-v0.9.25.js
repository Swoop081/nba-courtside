/* NBA Courtside v0.9.25 — Card Art Editor control for Foundation background team-logo size */
(()=>{
  const KEY='nbaCourtsideBgLogoSizeV1';
  const players=()=>window.COURTSIDE_FOUNDATION_PLAYERS||[];
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const playerBySlug=slug=>players().find(p=>p.artSlug===slug)||null;
  const playerForCard=card=>players().find(p=>p.id===card?.dataset?.id)||null;
  const factorFor=p=>Number(read()[p?.teamId])||1;
  const baseWidthFor=card=>card.closest('.catalogue-grid')?118:112;
  const applyCard=card=>{
    const p=playerForCard(card); if(!p)return;
    const logo=card.querySelector('.foundation-bg-team-logo'); if(!logo)return;
    const f=factorFor(p), w=baseWidthFor(card)*f;
    logo.style.setProperty('width',`${w}%`,'important');
    logo.style.setProperty('height',`${w}%`,'important');
  };
  const applyAll=()=>document.querySelectorAll('.foundation-card').forEach(applyCard);

  function installControl(){
    const ed=document.getElementById('cardArtEditor');
    const controls=ed?.querySelector('.art-editor-controls');
    const select=ed?.querySelector('#artPlayerSelect');
    if(!ed||!controls||!select||ed.querySelector('#artBgLogoScale'))return false;

    const row=document.createElement('div');
    row.className='art-control';
    row.innerHTML='<label>Background logo size <output id="artBgLogoScaleOut">100%</output></label><input id="artBgLogoScale" type="range" min="50" max="220" step="1" value="100">';
    controls.appendChild(row);
    const slider=row.querySelector('#artBgLogoScale'),out=row.querySelector('#artBgLogoScaleOut');

    const current=()=>playerBySlug(select.value);
    const sync=()=>{
      const p=current(); if(!p)return;
      const pct=Math.round(factorFor(p)*100);
      slider.value=pct; out.textContent=`${pct}%`;
      requestAnimationFrame(applyAll);
    };
    slider.addEventListener('input',()=>{
      const p=current(); if(!p)return;
      const pct=Number(slider.value)||100, store=read();
      store[p.teamId]=pct/100; write(store); out.textContent=`${pct}%`;
      applyAll();
    });
    select.addEventListener('change',()=>setTimeout(sync,0));
    ed.querySelector('#artPrev')?.addEventListener('click',()=>setTimeout(sync,0));
    ed.querySelector('#artNext')?.addEventListener('click',()=>setTimeout(sync,0));
    ed.querySelector('#artReset')?.addEventListener('click',()=>setTimeout(sync,0));
    new MutationObserver(()=>sync()).observe(ed.querySelector('#artPreview'),{childList:true,subtree:true});
    sync();
    return true;
  }

  const start=()=>{
    applyAll();
    let tries=0; const timer=setInterval(()=>{if(installControl()||++tries>80)clearInterval(timer)},100);
    new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.foundation-card'))applyCard(n);n.querySelectorAll?.('.foundation-card').forEach(applyCard)}}));installControl();}).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
