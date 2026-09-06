/* NBA Starting5 v0.11.50 — full-pool Steals semantic rebalance.
   The legacy SPG conversion made ordinary ~1.0 SPG production rate around 20/30,
   causing steals to read as a defining strength for many average defenders.
   This authority compresses ordinary steal production into the 10–15 range while
   preserving real separation for disruptive/league-leading steal producers. */
(()=>{
  if(window.__starting5StealsScaleV01150)return;
  window.__starting5StealsScaleV01150=true;

  const num=v=>Number.isFinite(Number(v))?Number(v):null;
  const clamp=v=>Math.max(0,Math.min(30,Math.round(v)));

  /* Semantic anchors for the old 0–30 steals scale.
     old 20 (~1.0 SPG in the legacy table) -> 13
     old 25 (~1.5 SPG) -> 22
     old 30 (~2.0+ SPG) -> 30 */
  const remap=v=>{
    v=num(v);if(v===null)return null;
    if(v<=0)return 0;
    if(v<=10)return clamp(v*.7);
    if(v<=20)return clamp(7+(v-10)*.6);
    return clamp(13+(v-20)*1.7);
  };

  const get=p=>{
    if(p?.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))return num(p.stats.steals);
    if(p?.ratings&&typeof p.ratings==='object')return num(p.ratings.steals);
    if(Array.isArray(p?.stats))return num(p.stats[6]);
    return num(p?.steals);
  };
  const set=(p,v)=>{
    if(!p||!Number.isFinite(v))return;
    if(p.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))p.stats.steals=v;
    if(Array.isArray(p.stats))p.stats[6]=v;
    if(p.ratings&&typeof p.ratings==='object')p.ratings.steals=v;
    p.steals=v;
  };

  function apply(){
    const pools=[];
    try{if(Array.isArray(players))pools.push(players)}catch{}
    ['COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers','COURTSIDE_CLASSIC_PLAYERS','CLASSIC_CARDS','classicCards'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
    const seen=new WeakSet();let changed=0;
    for(const pool of pools)for(const p of pool||[]){
      if(!p||typeof p!=='object'||seen.has(p))continue;seen.add(p);
      const before=get(p);if(before===null)continue;
      const after=remap(before);set(p,after);changed++;
    }
    window.STARTING5_STEALS_SCALE_V01150={
      version:'0.11.50',players:changed,
      anchors:{0:0,10:7,15:10,20:13,21:15,22:16,23:18,24:20,25:22,26:23,27:25,28:27,29:28,30:30},
      description:'Ordinary steal production no longer grades as a signature strength; elite steal production retains top-end separation.'
    };
    return changed>0;
  }

  window.applyStarting5StealsScale=apply;
  apply();
})();
