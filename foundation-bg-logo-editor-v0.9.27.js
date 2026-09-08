/* NBA Starting5 v0.13.0-dev.17 — locked background team-logo layout; editor controls retired. */
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
  const playerForCard=card=>players().find(p=>String(p.id)===String(card?.dataset?.id))||null;
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

  const start=()=>{
    normalizeEveryTeam();
    applyAll();
    new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes||[]){
        if(n.nodeType!==1)continue;
        if(n.matches?.('.foundation-card'))applyCard(n);
        n.querySelectorAll?.('.foundation-card').forEach(applyCard);
      }
    }).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
