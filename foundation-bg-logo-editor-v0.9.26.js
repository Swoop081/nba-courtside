/* NBA Courtside v0.9.26 — Card Art Editor controls for Foundation background team-logo size + X/Y position */
(()=>{
  const SIZE_KEY='nbaCourtsideBgLogoSizeV1';
  const POS_KEY='nbaCourtsideBgLogoPositionV1';
  const players=()=>window.COURTSIDE_FOUNDATION_PLAYERS||[];
  const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};
  const write=(key,v)=>localStorage.setItem(key,JSON.stringify(v));
  const playerBySlug=slug=>players().find(p=>p.artSlug===slug)||null;
  const playerForCard=card=>players().find(p=>p.id===card?.dataset?.id)||null;
  const factorFor=p=>Number(read(SIZE_KEY)[p?.teamId])||1;
  const posFor=p=>{const v=read(POS_KEY)[p?.teamId]||{};return {x:Number(v.x)||0,y:Number(v.y)||0};};
  const baseWidthFor=card=>card.closest('.catalogue-grid')?118:112;
  const BASE_TOP=-23, BASE_RIGHT=-23;
  const applyCard=card=>{
    const p=playerForCard(card); if(!p)return;
    const logo=card.querySelector('.foundation-bg-team-logo'); if(!logo)return;
    const f=factorFor(p), w=baseWidthFor(card)*f, pos=posFor(p);
    logo.style.setProperty('width',`${w}%`,'important');
    logo.style.setProperty('height',`${w}%`,'important');
    logo.style.setProperty('right',`${BASE_RIGHT-pos.x}%`,'important');
    logo.style.setProperty('top',`${BASE_TOP+pos.y}%`,'important');
  };
  const applyAll=()=>document.querySelectorAll('.foundation-card').forEach(applyCard);

  function installControls(){
    const ed=document.getElementById('cardArtEditor');
    const controls=ed?.querySelector('.art-editor-controls');
    const select=ed?.querySelector('#artPlayerSelect');
    if(!ed||!controls||!select)return false;
    if(ed.querySelector('#artBgLogoScale'))return true;

    const make=(label,id,min,max,step,value,suffix)=>{
      const row=document.createElement('div');row.className='art-control';
      row.innerHTML=`<label>${label} <output id="${id}Out">${value}${suffix}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
      controls.appendChild(row);return row.querySelector(`#${id}`);
    };
    const size=make('Background logo size','artBgLogoScale',50,220,1,100,'%');
    const x=make('Background logo X','artBgLogoX',-100,100,1,0,'%');
    const y=make('Background logo Y','artBgLogoY',-100,100,1,0,'%');
    const sizeOut=ed.querySelector('#artBgLogoScaleOut'),xOut=ed.querySelector('#artBgLogoXOut'),yOut=ed.querySelector('#artBgLogoYOut');
    const current=()=>playerBySlug(select.value);
    const sync=()=>{
      const p=current();if(!p)return;
      const pct=Math.round(factorFor(p)*100),pos=posFor(p);
      size.value=pct;x.value=pos.x;y.value=pos.y;
      sizeOut.textContent=`${pct}%`;xOut.textContent=`${pos.x}%`;yOut.textContent=`${pos.y}%`;
      requestAnimationFrame(applyAll);
    };
    size.addEventListener('input',()=>{
      const p=current();if(!p)return;const pct=Number(size.value)||100,store=read(SIZE_KEY);
      store[p.teamId]=pct/100;write(SIZE_KEY,store);sizeOut.textContent=`${pct}%`;applyAll();
    });
    const savePos=()=>{
      const p=current();if(!p)return;const store=read(POS_KEY),px=Number(x.value)||0,py=Number(y.value)||0;
      store[p.teamId]={x:px,y:py};write(POS_KEY,store);xOut.textContent=`${px}%`;yOut.textContent=`${py}%`;applyAll();
    };
    x.addEventListener('input',savePos);y.addEventListener('input',savePos);
    select.addEventListener('change',()=>setTimeout(sync,0));
    ed.querySelector('#artPrev')?.addEventListener('click',()=>setTimeout(sync,0));
    ed.querySelector('#artNext')?.addEventListener('click',()=>setTimeout(sync,0));
    ed.querySelector('#artReset')?.addEventListener('click',()=>setTimeout(sync,0));
    new MutationObserver(()=>sync()).observe(ed.querySelector('#artPreview'),{childList:true,subtree:true});
    sync();return true;
  }

  const start=()=>{
    applyAll();let tries=0;const timer=setInterval(()=>{if(installControls()||++tries>80)clearInterval(timer)},100);
    new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.foundation-card'))applyCard(n);n.querySelectorAll?.('.foundation-card').forEach(applyCard)}}));installControls();}).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
