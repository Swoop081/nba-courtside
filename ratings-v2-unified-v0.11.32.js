/* NBA Starting5 v0.11.40 — stable full-pool V2 ratings: immutable baseline + monotonic category anchoring. */
(()=>{
  if(window.__starting5UnifiedRatingsV01132)return;
  window.__starting5UnifiedRatingsV01132=true;

  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const BASELINE_KEY='__starting5RatingsBaselineV01140';
  const clamp=v=>Math.max(0,Math.min(30,Math.round(v)));
  const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:0;
  const num=v=>Number.isFinite(Number(v))?Number(v):null;
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,' ').trim().toLowerCase();
  const stat=(p,k)=>{
    if(p?.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))return num(p.stats[k]);
    if(p?.ratings&&typeof p.ratings==='object')return num(p.ratings[k]);
    if(Array.isArray(p?.stats)){const i=CATS.indexOf(k);return i>=0?num(p.stats[i]):null;}
    return num(p?.[k]);
  };
  const collect=()=>{
    const pools=[];
    try{if(Array.isArray(players))pools.push(players)}catch{}
    ['COURTSIDE_CLASSIC_PLAYERS','COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
    const out=[],seen=new Set();
    for(const pool of pools)for(const p of pool||[]){
      if(!p||!p.name)continue;
      const key=String(p.id||`${p.teamId||p.team||''}|${p.name}|${p.season||'current'}|${p.position||''}`);
      if(seen.has(key))continue;seen.add(key);out.push(p);
    }
    return out;
  };
  const pct=(v,arr)=>{
    const xs=arr.filter(Number.isFinite).sort((a,b)=>a-b);if(!xs.length||!Number.isFinite(v))return .5;
    let lo=0,hi=xs.length;while(lo<hi){const m=(lo+hi)>>1;if(xs[m]<=v)lo=m+1;else hi=m}
    return (lo-.5)/xs.length;
  };
  const anchor=p=>4+26*Math.pow(Math.max(0,Math.min(1,p)),.88);
  const posKey=p=>String(p?.position||'').toUpperCase()||'UNK';
  const keyOf=p=>String(p.id||`${p.teamId||p.team||''}|${norm(p.name)}|${p.season||'current'}|${posKey(p)}`);

  function ensureBaseline(ps){
    let base=window[BASELINE_KEY];
    if(!(base instanceof Map)){base=new Map();window[BASELINE_KEY]=base;}
    for(const p of ps){
      const key=keyOf(p);if(base.has(key))continue;
      base.set(key,{stats:Object.fromEntries(CATS.map(k=>[k,stat(p,k)])),overall:num(p.overall)??20});
    }
    return base;
  }

  function apply(){
    const ps=collect();if(ps.length<10)return false;
    const base=ensureBaseline(ps);
    const global={};
    for(const k of CATS)global[k]=ps.map(p=>base.get(keyOf(p))?.stats?.[k]).filter(Number.isFinite);

    /* Every category is a monotonic function of its frozen researched baseline.
       No position percentile is allowed to make a weaker raw rating leapfrog a stronger one. */
    const weights={scoring:.90,three:.90,rebounding:.88,passing:.90,blocks:.88,steals:.88,dunks:.90};
    const next=new Map();
    for(const p of ps){
      const b=base.get(keyOf(p))?.stats||{},r={};
      for(const k of CATS){
        const v=b[k];if(!Number.isFinite(v)){r[k]=15;continue;}
        const w=weights[k]??.90,g=anchor(pct(v,global[k]));
        let n=w*v+(1-w)*g;
        if(v===0)n=0;
        if(v===30)n=30;
        r[k]=clamp(n);
      }
      next.set(keyOf(p),r);
    }

    /* Overall is recalculated from the stable category results and the frozen pre-V2 quality signal. */
    const raw=[];
    for(const p of ps){
      const r=next.get(keyOf(p)),vals=CATS.map(k=>r[k]),sorted=[...vals].sort((a,b)=>b-a);
      const broad=.24*r.scoring+.15*r.passing+.14*r.rebounding+.13*r.three+.11*r.steals+.11*r.blocks+.07*r.dunks+.05*mean(sorted.slice(0,5));
      const star=mean(sorted.slice(0,3)),vers=mean(sorted.slice(0,5));
      const prior=base.get(keyOf(p))?.overall??20;
      raw.push({p,r,value:.52*broad+.22*star+.11*vers+.15*prior});
    }
    const rawVals=raw.map(x=>x.value),overallMap=new Map();
    for(const x of raw){
      const rankAnchor=13+17*Math.pow(Math.max(0,Math.min(1,pct(x.value,rawVals))),.78);
      overallMap.set(keyOf(x.p),Math.max(13,Math.min(30,Math.round(.62*x.value+.38*rankAnchor))));
    }

    const patch=(p,r,ov)=>{
      if(!p||!r)return;
      if(p.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))for(const k of CATS)p.stats[k]=r[k];
      if(Array.isArray(p.stats))CATS.forEach((k,i)=>p.stats[i]=r[k]);
      if(p.ratings&&typeof p.ratings==='object')for(const k of CATS)p.ratings[k]=r[k];
      for(const k of CATS)p[k]=r[k];
      p.threePoint=r.three;p.overall=ov;
    };
    const allPools=[];
    try{if(Array.isArray(players))allPools.push(players)}catch{}
    ['COURTSIDE_CLASSIC_PLAYERS','COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers'].forEach(k=>{if(Array.isArray(window[k]))allPools.push(window[k])});
    const seenObj=new WeakSet();
    for(const pool of allPools)for(const p of pool||[]){
      if(!p||typeof p!=='object'||seenObj.has(p))continue;seenObj.add(p);
      const k=keyOf(p),r=next.get(k),ov=overallMap.get(k);if(r&&Number.isFinite(ov))patch(p,r,ov);
    }

    const lookup=new Map();for(const p of ps)lookup.set(keyOf(p),overallMap.get(keyOf(p)));
    if(!window.__starting5OverallFallbackV01140)window.__starting5OverallFallbackV01140=window.courtsideOverall;
    const fallback=window.__starting5OverallFallbackV01140;
    window.courtsideOverall=function(p){
      if(p){const v=lookup.get(keyOf(p));if(Number.isFinite(v))return v;}
      return typeof fallback==='function'?fallback(p):(num(p?.overall)??0);
    };

    const distribution={};for(let i=13;i<=30;i++)distribution[i]=0;for(const v of overallMap.values())distribution[v]=(distribution[v]||0)+1;
    window.STARTING5_RATING_AUTHORITY_V2={
      version:'0.11.40',mode:'ACTIVE',players:ps.length,idempotent:true,manualOverrides:0,positionAnchoring:false,
      methodology:{
        scoring:'90% frozen researched baseline + 10% monotonic full-pool anchor',
        three:'90% frozen researched baseline + 10% monotonic full-pool anchor',
        rebounding:'88% frozen researched baseline + 12% monotonic full-pool anchor',
        passing:'90% frozen researched baseline + 10% monotonic full-pool anchor; no player-specific overrides',
        blocks:'88% frozen researched baseline + 12% monotonic full-pool anchor',
        steals:'88% frozen researched baseline + 12% monotonic full-pool anchor',
        dunks:'90% frozen dunk-threat baseline + 10% monotonic full-pool anchor',
        overall:'Stable broad quality + star impact + versatility + frozen pre-V2 quality signal.'
      },
      anchors:{30:'historic/league-leading elite',25:'All-Star calibre strength',20:'clearly above average',15:'roughly average starter/rotation ability',10:'below average',5:'major weakness',0:'effectively absent'},
      overallDistribution:distribution
    };
    window.COURTSIDE_OVERALL_RATINGS_COUNT=ps.length;
    try{window.runStarting5StatAudit?.()}catch{}
    return true;
  }

  window.applyStarting5RatingsV2=apply;
  apply();setTimeout(apply,0);setTimeout(apply,250);
})();
