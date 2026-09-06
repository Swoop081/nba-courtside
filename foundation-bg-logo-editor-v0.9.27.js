/* NBA Starting5 v0.11.47 — true top-anchored full-width background team-logo layout */
(()=>{
  const SIZE_KEY='nbaCourtsideBgLogoSizeV1';
  const POS_KEY='nbaCourtsideBgLogoPositionV1';
  const ROT_KEY='nbaCourtsideBgLogoRotationV1';
  const MIGRATION_KEY='nbaStarting5BgLogoUniversalV01147';
  const players=()=>{
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
  const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};
  const write=(key,v)=>localStorage.setItem(key,JSON.stringify(v));
  const playerBySlug=slug=>players().find(p=>p.artSlug===slug)||null;
  const playerForCard=card=>players().find(p=>String(p.id)===String(card?.dataset?.id))||null;

  /* The image element itself is lifted by 32% of its own rendered height. This removes
     the visual dead space that kept tall logos like Chicago's centred too low even when
     CSS top was 0. Width is deliberately oversized so the visible mark reaches both sides. */
  const STANDARD={scale:1.60,x:0,y:0,rotation:0};
  const VISUAL_TOP_LIFT=32;
  const factorFor=p=>{const v=read(SIZE_KEY)[p?.teamId];return Number.isFinite(Number(v))?Number(v):STANDARD.scale;};
  const posFor=p=>{const v=read(POS_KEY)[p?.teamId]||{};return{x:Number.isFinite(Number(v.x))?Number(v.x):STANDARD.x,y:Number.isFinite(Number(v.y))?Number(v.y):STANDARD.y};};
  const rotFor=p=>{const v=read(ROT_KEY)[p?.teamId];return Number.isFinite(Number(v))?Number(v):STANDARD.rotation;};

  function normalizeEveryTeam(){
    try{if(localStorage.getItem(MIGRATION_KEY)==='1')return;}catch{}
    const size=read(SIZE_KEY),pos=read(POS_KEY),rot=read(ROT_KEY);
    const ids=new Set(players().map(p=>String(p.teamId||'')).filter(Boolean));
    ids.forEach(id=>{size[id]=STANDARD.scale;pos[id]={x:0,y:0};rot[id]=0;});
    write(SIZE_KEY,size);write(POS_KEY,pos);write(ROT_KEY,rot);
    try{localStorage.setItem(MIGRATION_KEY,'1')}catch{}
  }

  const applyCard=card=>{
    const p=playerForCard(card);if(!p)return;
    const logo=card.querySelector('.foundation-bg-team-logo');if(!logo)return;
    const f=factorFor(p),pos=posFor(p),rot=rotFor(p),w=100*f;
    logo.style.setProperty('width',`${w}%`,'important');
    logo.style.setProperty('height','auto','important');
    logo.style.setProperty('max-width','none','important');
    logo.style.setProperty('max-height','none','important');
    logo.style.setProperty('left',`calc(50% + ${pos.x}%)`,'important');
    logo.style.setProperty('right','auto','important');
    logo.style.setProperty('top',`${pos.y}%`,'important');
    logo.style.setProperty('bottom','auto','important');
    logo.style.setProperty('transform',`translate(-50%,-${VISUAL_TOP_LIFT}%) rotate(${rot}deg)`,'important');
    logo.style.setProperty('transform-origin','center top','important');
    logo.style.setProperty('object-fit','contain','important');
    logo.style.setProperty('object-position','center top','important');
  };
  const applyAll=()=>document.querySelectorAll('.foundation-card').forEach(applyCard);

  function installControls(){
    const ed=document.getElementById('cardArtEditor');
    const controls=ed?.querySelector('.art-editor-controls');
    const select=ed?.querySelector('#artPlayerSelect');
    if(!ed||!controls||!select)return false;
    if(ed.querySelector('#artBgLogoRotate'))return true;
    const make=(label,id,min,max,step,value,suffix)=>{const row=document.createElement('div');row.className='art-control';row.innerHTML=`<label>${label} <output id="${id}Out">${value}${suffix}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;controls.appendChild(row);return row.querySelector(`#${id}`);};
    const size=ed.querySelector('#artBgLogoScale')||make('Background logo size','artBgLogoScale',80,220,1,160,'%');
    const x=ed.querySelector('#artBgLogoX')||make('Background logo X','artBgLogoX',-100,100,1,0,'%');
    const y=ed.querySelector('#artBgLogoY')||make('Background logo Y','artBgLogoY',-100,100,1,0,'%');
    const rot=make('Background logo rotate','artBgLogoRotate',-180,180,1,0,'°');
    const sizeOut=ed.querySelector('#artBgLogoScaleOut'),xOut=ed.querySelector('#artBgLogoXOut'),yOut=ed.querySelector('#artBgLogoYOut'),rotOut=ed.querySelector('#artBgLogoRotateOut');
    const current=()=>playerBySlug(select.value);
    const sync=()=>{const p=current();if(!p)return;const pct=Math.round(factorFor(p)*100),pos=posFor(p),r=rotFor(p);size.value=pct;x.value=pos.x;y.value=pos.y;rot.value=r;sizeOut.textContent=`${pct}%`;xOut.textContent=`${pos.x}%`;yOut.textContent=`${pos.y}%`;rotOut.textContent=`${r}°`;requestAnimationFrame(applyAll);};
    size.addEventListener('input',()=>{const p=current();if(!p)return;const pct=Number(size.value)||160,store=read(SIZE_KEY);store[p.teamId]=pct/100;write(SIZE_KEY,store);sizeOut.textContent=`${pct}%`;applyAll();});
    const savePos=()=>{const p=current();if(!p)return;const store=read(POS_KEY),px=Number(x.value)||0,py=Number(y.value)||0;store[p.teamId]={x:px,y:py};write(POS_KEY,store);xOut.textContent=`${px}%`;yOut.textContent=`${py}%`;applyAll();};
    x.addEventListener('input',savePos);y.addEventListener('input',savePos);
    rot.addEventListener('input',()=>{const p=current();if(!p)return;const r=Number(rot.value)||0,store=read(ROT_KEY);store[p.teamId]=r;write(ROT_KEY,store);rotOut.textContent=`${r}°`;applyAll();});
    select.addEventListener('change',()=>setTimeout(sync,0));
    ed.querySelector('#artTeamSelect')?.addEventListener('change',()=>setTimeout(sync,0));
    ed.querySelector('#artSetSelect')?.addEventListener('change',()=>setTimeout(sync,0));
    ed.querySelector('#artPrev')?.addEventListener('click',()=>setTimeout(sync,0));
    ed.querySelector('#artNext')?.addEventListener('click',()=>setTimeout(sync,0));
    ed.querySelector('#artReset')?.addEventListener('click',()=>setTimeout(sync,0));
    new MutationObserver(()=>sync()).observe(ed.querySelector('#artPreview'),{childList:true,subtree:true});
    sync();return true;
  }

  const start=()=>{
    normalizeEveryTeam();applyAll();
    let tries=0;const timer=setInterval(()=>{normalizeEveryTeam();applyAll();if(installControls()||++tries>80)clearInterval(timer)},100);
    new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){if(n.matches?.('.foundation-card'))applyCard(n);n.querySelectorAll?.('.foundation-card').forEach(applyCard)}}));installControls();}).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
