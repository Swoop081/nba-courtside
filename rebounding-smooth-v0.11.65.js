/* NBA Starting5 v0.11.65 — smooth direct rebounding scale; no unified post-curve. */
(()=>{
  if(window.__starting5ReboundingSmoothV01165)return;
  window.__starting5ReboundingSmoothV01165=true;

  const anchors=[[0,0],[5,5],[10,10],[12,13],[14,15],[16,16],[18,18],[20,20],[23,23],[27,27],[30,30]];
  const smooth=v=>{
    v=Math.max(0,Math.min(30,Number(v)||0));
    if(v<=anchors[0][0])return anchors[0][1];
    if(v>=anchors.at(-1)[0])return anchors.at(-1)[1];
    for(let i=1;i<anchors.length;i++){
      const [x1,y1]=anchors[i-1],[x2,y2]=anchors[i];
      if(v<=x2){
        const t=(v-x1)/(x2-x1);
        return Math.max(0,Math.min(30,Math.floor(y1+t*(y2-y1)+1e-9)));
      }
    }
    return Math.round(v);
  };

  const patch=p=>{
    if(!p||typeof p!=='object')return;
    let source=null;
    if(Number.isFinite(Number(p.__s5ReboundingSourceV01165)))source=Number(p.__s5ReboundingSourceV01165);
    else if(p.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats)&&Number.isFinite(Number(p.stats.rebounding))){
      source=Number(p.stats.rebounding);
      try{Object.defineProperty(p,'__s5ReboundingSourceV01165',{value:source,writable:false,configurable:true})}catch{p.__s5ReboundingSourceV01165=source}
    }else if(p.ratings&&typeof p.ratings==='object'&&Number.isFinite(Number(p.ratings.rebounding))){
      source=Number(p.ratings.rebounding);
      try{Object.defineProperty(p,'__s5ReboundingSourceV01165',{value:source,writable:false,configurable:true})}catch{p.__s5ReboundingSourceV01165=source}
    }
    if(!Number.isFinite(source))return;
    const rating=smooth(source);
    if(p.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))p.stats.rebounding=rating;
    if(p.ratings&&typeof p.ratings==='object')p.ratings.rebounding=rating;
    p.rebounding=rating;
  };

  const collectPools=()=>{
    const pools=[];
    try{if(Array.isArray(players))pools.push(players)}catch{}
    ['COURTSIDE_CLASSIC_PLAYERS','COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
    return pools;
  };

  const apply=()=>{
    const seen=new WeakSet();
    for(const pool of collectPools())for(const p of pool||[]){if(p&&typeof p==='object'&&!seen.has(p)){seen.add(p);patch(p)}}
    window.STARTING5_REBOUNDING_SCALE_V01165={
      mode:'DIRECT_SMOOTH',
      unifiedCurve:false,
      anchors:anchors.map(x=>[...x]),
      examples:{'LeBron James':{source:14,rating:smooth(14)},'Jaylen Brown':{source:16,rating:smooth(16)},'Joel Embiid':{source:18,rating:smooth(18)}}
    };
  };

  apply();
  [0,100,300,900].forEach(ms=>setTimeout(apply,ms));
})();
