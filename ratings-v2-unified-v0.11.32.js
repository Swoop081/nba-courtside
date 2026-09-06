/* NBA Starting5 v0.11.32 — unified full-pool V2 rating authority for all current + Classic cards. */
(()=>{
  if(window.__starting5UnifiedRatingsV01132)return;
  window.__starting5UnifiedRatingsV01132=true;

  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
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

  function apply(){
    const ps=collect();if(ps.length<10)return false;
    const base=new Map();
    ps.forEach(p=>base.set(keyOf(p),Object.fromEntries(CATS.map(k=>[k,stat(p,k)]))));
    const global={};const byPos={};
    for(const k of CATS){
      global[k]=ps.map(p=>base.get(keyOf(p))?.[k]).filter(Number.isFinite);
      byPos[k]={};
      for(const p of ps){const pk=posKey(p),v=base.get(keyOf(p))?.[k];if(!Number.isFinite(v))continue;(byPos[k][pk]||(byPos[k][pk]=[])).push(v)}
    }
    const next=new Map();
    for(const p of ps){
      const b=base.get(keyOf(p)),pk=posKey(p),r={};
      for(const k of CATS){
        const v=b[k];if(!Number.isFinite(v)){r[k]=15;continue;}
        const g=anchor(pct(v,global[k])),q=anchor(pct(v,byPos[k][pk]||global[k]));
        let n=v;
        if(k==='scoring')n=.80*v+.20*g;
        else if(k==='three')n=.82*v+.18*g;
        else if(k==='rebounding')n=.68*v+.17*g+.15*q;
        else if(k==='passing')n=.68*v+.17*g+.15*q;
        else if(k==='blocks')n=.72*v+.18*g+.10*q;
        else if(k==='steals')n=.72*v+.18*g+.10*q;
        else if(k==='dunks')n=.78*v+.14*g+.08*q;
        /* Preserve genuine absence while reducing accidental floor/ceiling compression. */
        if(v===0)n=0;
        if(v===30&&n>=28.5)n=30;
        r[k]=clamp(n);
      }
      next.set(keyOf(p),r);
    }

    /* Overall: broad quality, star impact and versatility, then full-pool anchoring. */
    const raw=[];
    for(const p of ps){
      const r=next.get(keyOf(p)),vals=CATS.map(k=>r[k]),sorted=[...vals].sort((a,b)=>b-a);
      const broad=.24*r.scoring+.15*r.passing+.14*r.rebounding+.13*r.three+.11*r.steals+.11*r.blocks+.07*r.dunks+.05*mean(sorted.slice(0,5));
      const star=mean(sorted.slice(0,3)),vers=mean(sorted.slice(0,5));
      const prior=num(p.overall)??20;
      raw.push({p,r,value:.48*broad+.24*star+.13*vers+.15*prior});
    }
    const rawVals=raw.map(x=>x.value);
    const overallMap=new Map();
    for(const x of raw){
      const rankAnchor=13+17*Math.pow(Math.max(0,Math.min(1,pct(x.value,rawVals))),.78);
      const ov=Math.max(13,Math.min(30,Math.round(.55*x.value+.45*rankAnchor)));
      overallMap.set(keyOf(x.p),ov);
    }

    const patch=(p,r,ov)=>{
      if(!p||!r)return;
      if(p.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))for(const k of CATS)p.stats[k]=r[k];
      if(Array.isArray(p.stats))CATS.forEach((k,i)=>p.stats[i]=r[k]);
      if(p.ratings&&typeof p.ratings==='object')for(const k of CATS)p.ratings[k]=r[k];
      for(const k of CATS)p[k]=r[k];
      p.threePoint=r.three;
      p.overall=ov;
    };
    const allPools=[];
    try{if(Array.isArray(players))allPools.push(players)}catch{}
    ['COURTSIDE_CLASSIC_PLAYERS','COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers'].forEach(k=>{if(Array.isArray(window[k]))allPools.push(window[k])});
    const seenObj=new WeakSet();
    for(const pool of allPools)for(const p of pool||[]){
      if(!p||typeof p!=='object'||seenObj.has(p))continue;seenObj.add(p);
      const k=keyOf(p),r=next.get(k),ov=overallMap.get(k);if(r&&Number.isFinite(ov))patch(p,r,ov);
    }

    const lookup=new Map();
    for(const p of ps)lookup.set(keyOf(p),overallMap.get(keyOf(p)));
    const priorOverall=window.courtsideOverall;
    window.courtsideOverall=function(p){
      if(p){const v=lookup.get(keyOf(p));if(Number.isFinite(v))return v;}
      return typeof priorOverall==='function'?priorOverall(p):(num(p?.overall)??0);
    };

    const distribution={};for(let i=13;i<=30;i++)distribution[i]=0;for(const v of overallMap.values())distribution[v]=(distribution[v]||0)+1;
    window.STARTING5_RATING_AUTHORITY_V2={
      version:'0.11.32',mode:'ACTIVE',players:ps.length,
      methodology:{
        scoring:'80% researched production baseline + 20% full-pool strength anchoring',
        three:'82% existing era/volume-aware shooting baseline + 18% full-pool anchoring',
        rebounding:'68% production baseline + 17% global + 15% position-context anchoring',
        passing:'68% creation baseline + 17% global + 15% position-context anchoring',
        blocks:'72% production baseline + 18% global + 10% position-context anchoring',
        steals:'72% production baseline + 18% global + 10% position-context anchoring',
        dunks:'78% dunk-threat baseline + 14% global + 8% position-context anchoring',
        overall:'Broad quality + top-three impact + top-five versatility + prior quality signal, re-anchored against the complete player pool.'
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
