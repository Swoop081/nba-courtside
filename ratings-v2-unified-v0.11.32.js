/* NBA Starting5 v0.11.51 — full 330-player unified ratings recalibration. */
(()=>{
  if(window.__starting5UnifiedRatingsV01151)return;
  window.__starting5UnifiedRatingsV01151=true;

  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const BASELINE_KEY='__starting5RatingsBaselineV01151';
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
  const posKey=p=>String(p?.position||'').toUpperCase()||'UNK';
  const keyOf=p=>String(p.id||`${p.teamId||p.team||''}|${norm(p.name)}|${p.season||'current'}|${posKey(p)}`);

  function ensureBaseline(ps){
    let base=window[BASELINE_KEY];
    if(!(base instanceof Map)){base=new Map();window[BASELINE_KEY]=base;}
    for(const p of ps){
      const key=keyOf(p);if(base.has(key))continue;
      base.set(key,{stats:Object.fromEntries(CATS.map(k=>[k,stat(p,k)])),overall:num(p.overall)??20,classic:!!p.classicTeam,name:p.name});
    }
    return base;
  }

  /* Common meaning across every category:
     30 elite/historic, 25 major All-Star-level strength, 20 clearly above average,
     15 normal starter/rotation ability, 10 below average, 5 major weakness, 0 absent.
     Legacy category authorities were built independently, so these monotonic curves
     bring all seven onto the same practical 0–30 language without reordering equal-source skills. */
  const CURVES={
    scoring:[[0,0],[5,5],[10,10],[15,15],[20,20],[25,25],[30,30]],
    three:[[0,0],[5,4],[10,9],[15,14],[20,19],[25,24],[30,30]],
    rebounding:[[0,0],[5,4],[10,8],[15,13],[20,18],[25,24],[30,30]],
    passing:[[0,0],[5,4],[10,9],[15,14],[20,19],[25,24],[30,30]],
    blocks:[[0,0],[5,3],[10,7],[15,12],[20,17],[25,23],[30,30]],
    steals:[[0,0],[5,4],[10,8],[15,13],[20,18],[25,24],[30,30]],
    dunks:[[0,0],[5,4],[10,8],[15,13],[20,18],[25,24],[30,30]]
  };
  const curve=(k,v)=>{
    if(!Number.isFinite(v))return 15;
    const pts=CURVES[k]||CURVES.scoring;
    if(v<=pts[0][0])return pts[0][1];if(v>=pts.at(-1)[0])return pts.at(-1)[1];
    for(let i=1;i<pts.length;i++){
      const [x1,y1]=pts[i-1],[x2,y2]=pts[i];
      if(v<=x2){const t=(v-x1)/(x2-x1);return y1+t*(y2-y1);}
    }
    return v;
  };

  /* Current-card dunking must describe the player now, not his athletic prime.
     These caps only affect the live Foundation identity; Classic cards keep depicted-season ability. */
  const CURRENT_DUNK_CAPS={
    'lebron james':21,'zach lavine':25,'kevin durant':16,'jimmy butler':14,
    'paul george':13,'kawhi leonard':15,'damian lillard':12,'demar derozan':10,
    'james harden':8,'stephen curry':4,'klay thompson':6,'cj mccollum':5,
    'brook lopez':11,'draymond green':10,'kyrie irving':9
  };

  function apply(){
    const ps=collect();if(ps.length<10)return false;
    const base=ensureBaseline(ps);
    const next=new Map();

    for(const p of ps){
      const b=base.get(keyOf(p))?.stats||{},r={};
      for(const k of CATS)r[k]=clamp(curve(k,b[k]));
      if(!p.classicTeam){const cap=CURRENT_DUNK_CAPS[norm(p.name)];if(Number.isFinite(cap))r.dunks=Math.min(r.dunks,cap);}
      next.set(keyOf(p),r);
    }

    /* Overall is deliberately broad: scoring matters most, but no single counting stat can dominate.
       Top-three strengths reward stars/specialists while the five-category mean rewards versatility. */
    const overallMap=new Map();
    const raw=[];
    for(const p of ps){
      const r=next.get(keyOf(p)),vals=CATS.map(k=>r[k]),sorted=[...vals].sort((a,b)=>b-a);
      const broad=.27*r.scoring+.15*r.passing+.14*r.rebounding+.13*r.three+.10*r.steals+.10*r.blocks+.06*r.dunks+.05*mean(sorted.slice(0,5));
      const star=mean(sorted.slice(0,3)),vers=mean(sorted.slice(0,5));
      const prior=base.get(keyOf(p))?.overall??20;
      raw.push({p,value:.57*broad+.20*star+.13*vers+.10*prior});
    }
    const values=raw.map(x=>x.value).sort((a,b)=>a-b);
    const pct=v=>{let lo=0,hi=values.length;while(lo<hi){const m=(lo+hi)>>1;if(values[m]<=v)lo=m+1;else hi=m}return values.length?(lo-.5)/values.length:.5;};
    for(const x of raw){
      const rank=13+17*Math.pow(Math.max(0,Math.min(1,pct(x.value))),.80);
      overallMap.set(keyOf(x.p),Math.max(13,Math.min(30,Math.round(.70*x.value+.30*rank))));
    }

    const patch=(p,r,ov)=>{
      if(!p||!r)return;
      if(p.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))for(const k of CATS)p.stats[k]=r[k];
      if(Array.isArray(p.stats))CATS.forEach((k,i)=>p.stats[i]=r[k]);
      if(p.ratings&&typeof p.ratings==='object')for(const k of CATS)p.ratings[k]=r[k];
      for(const k of CATS)p[k]=r[k];
      p.threePoint=r.three;p.overall=ov;
    };
    const pools=[];
    try{if(Array.isArray(players))pools.push(players)}catch{}
    ['COURTSIDE_CLASSIC_PLAYERS','COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
    const seenObj=new WeakSet();
    for(const pool of pools)for(const p of pool||[]){
      if(!p||typeof p!=='object'||seenObj.has(p))continue;seenObj.add(p);
      const r=next.get(keyOf(p)),ov=overallMap.get(keyOf(p));if(r&&Number.isFinite(ov))patch(p,r,ov);
    }

    const lookup=new Map();for(const p of ps)lookup.set(keyOf(p),overallMap.get(keyOf(p)));
    if(!window.__starting5OverallFallbackV01151)window.__starting5OverallFallbackV01151=window.courtsideOverall;
    const fallback=window.__starting5OverallFallbackV01151;
    window.courtsideOverall=function(p){
      if(p){const v=lookup.get(keyOf(p));if(Number.isFinite(v))return v;}
      return typeof fallback==='function'?fallback(p):(num(p?.overall)??0);
    };

    const distribution={};for(let i=13;i<=30;i++)distribution[i]=0;for(const v of overallMap.values())distribution[v]=(distribution[v]||0)+1;
    window.STARTING5_RATING_AUTHORITY_V3={
      version:'0.11.51',mode:'ACTIVE',players:ps.length,idempotent:true,positionAnchoring:false,
      anchors:{30:'historic/league-leading elite',25:'major All-Star-level strength',20:'clearly above average',15:'normal NBA starter/rotation ability',10:'below average',5:'major weakness',0:'effectively absent'},
      methodology:{
        scoring:'Production-led source retained on a direct 0–30 scale.',
        three:'Source shooting grade recalibrated to common strength anchors.',
        rebounding:'Source RPG grade compressed so ordinary rebound totals no longer read as star-level skills.',
        passing:'Source APG/creation grade compressed to the same common anchors; no position-based inflation.',
        blocks:'Low/moderate BPG compressed strongly; elite rim protection remains separated at the top.',
        steals:'Uses the v0.11.50 corrected source scale, then common-anchor calibration.',
        dunks:'Source dunk-threat grade recalibrated; current veteran cards receive present-day athletic caps while Classics preserve depicted-season ability.',
        overall:'Recomputed after all seven categories; no single defensive counting stat can dominate.'
      },
      currentDunkCaps:{...CURRENT_DUNK_CAPS},overallDistribution:distribution
    };
    window.COURTSIDE_OVERALL_RATINGS_COUNT=ps.length;
    try{window.runStarting5StatAudit?.()}catch{}
    return true;
  }

  window.applyStarting5RatingsV3=apply;
  window.applyStarting5RatingsV2=apply;
  apply();setTimeout(apply,0);setTimeout(apply,250);setTimeout(apply,900);
})();
