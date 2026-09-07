/* NBA Starting5 v0.11.96 — authentic CPU-vs-CPU season matchup simulation feeding ledgers, awards and dynamic ratings. */
(()=>{
  if(window.__starting5CpuAuthenticSimV01196)return;
  window.__starting5CpuAuthenticSimV01196=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const pool=()=>{try{return Array.isArray(players)?players.filter(p=>!p.classicTeam):[]}catch{return []}};
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const byKey=(k,n,t)=>pool().find(p=>key(p)===String(k))||pool().find(p=>p.name===n&&String(p.teamId)===String(t))||null;
  const teamPlayers=id=>pool().filter(p=>String(p.teamId)===String(id)).slice(0,5);
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const stat=(p,c)=>{try{return dyn()?.getEffectiveStat?dyn().getEffectiveStat(p,c):(Number(p?.stats?.[c])||0)}catch{return Number(p?.stats?.[c])||0}};
  const gameMap=s=>{const m=new Map();for(const round of s?.schedule||[])for(const g of round||[])m.set(g.id,g);return m};
  function hash(str){let h=2166136261>>>0;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  const bestUnused=(roster,used,cat)=>{const a=roster.filter(p=>!used.has(key(p)));if(!a.length)return null;return a.reduce((b,p)=>stat(p,cat)>stat(b,cat)?p:b)};
  const side=(p,v,d)=>({key:key(p),name:p.name,teamId:String(p.teamId),value:v,diff:d,dynamicDelta:Number(dyn()?.getDelta?.(p)||0)});
  const record=(a,b,av,bv)=>{if(av>bv)dyn()?.recordMatchupResult?.(a,b);else if(bv>av)dyn()?.recordMatchupResult?.(b,a);else dyn()?.recordTie?.(a,b)};

  function simulateCpuGame(g){
    const home=teamPlayers(g.home),away=teamPlayers(g.away);if(home.length<5||away.length<5)return[];
    const r=rng(hash(`v01196|${g.id}`)),hu=new Set(),au=new Set(),out=[];let hs=0,as=0;
    const play=(isOt=false)=>{
      const cat=CATS[Math.floor(r()*CATS.length)],h=bestUnused(home,hu,cat),a=bestUnused(away,au,cat);if(!h||!a)return false;
      const av=stat(h,cat),bv=stat(a,cat),d=av-bv;
      out.push({category:cat,overtime:!!isOt,a:side(h,av,d),b:side(a,bv,-d)});
      hu.add(key(h));au.add(key(a));if(d>0)hs++;else if(d<0)as++;record(h,a,av,bv);return true;
    };
    for(let i=0;i<5;i++)play(false);
    let guard=0;
    while(hs===as&&guard++<5){hu.clear();au.clear();play(true)}
    return out;
  }

  function replayStoredMatchups(res){
    for(const m of res?.matchups||[]){
      if(!m?.a||!m?.b)continue;const a=byKey(m.a.key,m.a.name,m.a.teamId),b=byKey(m.b.key,m.b.name,m.b.teamId);if(!a||!b)continue;
      const av=Number(m.a.value),bv=Number(m.b.value);if(Number.isFinite(av)&&Number.isFinite(bv))record(a,b,av,bv);
    }
  }

  function rebuild(s){
    if(!s?.results||!Array.isArray(s.schedule)||!dyn()?.resetAll)return false;
    dyn().resetAll();let changed=false,simCount=0,matchupCount=0;
    for(const round of s.schedule){
      for(const g of round||[]){
        const res=s.results?.[g.id];if(!res)continue;
        if(res.userPlayed){replayStoredMatchups(res);matchupCount+=(res.matchups||[]).length;continue}
        res.matchups=simulateCpuGame(g);
        res.matchupLedgerSource='cpu-authentic-dynamic-v2';
        res.cpuSimulationVersion=2;
        res.dynamicRatingsApplied=true;
        simCount++;matchupCount+=res.matchups.length;changed=true;
      }
    }
    s.matchupLedgerVersion=2;s.cpuAuthenticSimulationVersion=2;
    s.cpuAuthenticSimulation={games:simCount,matchups:matchupCount,rebuiltAt:Date.now()};
    return changed;
  }

  function refreshAwards(s){
    try{
      if(window.STARTING5_MATCHUP_PLUS?.calculate){
        const calc=window.STARTING5_MATCHUP_PLUS.calculate(s);
        if(window.STARTING5_SEASON_AWARDS)window.STARTING5_SEASON_AWARDS.calculate=window.STARTING5_MATCHUP_PLUS.calculate;
        return calc;
      }
    }catch(err){console.error('[Starting5 CPU awards refresh]',err)}
    return null;
  }

  const rawSet=Storage.prototype.setItem;
  let busy=false,lastCount=-1;
  Storage.prototype.setItem=function(k,v){
    if(!busy&&this===localStorage&&k===SAVE_KEY){
      try{
        const s=JSON.parse(v),count=Object.keys(s?.results||{}).length;
        if(count!==lastCount){busy=true;rebuild(s);refreshAwards(s);v=JSON.stringify(s);lastCount=count;busy=false}
      }catch(err){busy=false;console.error('[Starting5 CPU authentic sim save]',err)}
    }
    return rawSet.call(this,k,v);
  };

  const boot=()=>{
    try{
      const raw=localStorage.getItem(SAVE_KEY),s=JSON.parse(raw||'null');if(!s)return;
      const count=Object.keys(s.results||{}).length;rebuild(s);refreshAwards(s);lastCount=count;busy=true;rawSet.call(localStorage,SAVE_KEY,JSON.stringify(s));busy=false;
    }catch(err){busy=false;console.error('[Starting5 CPU authentic sim boot]',err)}
  };
  setTimeout(boot,260);

  window.STARTING5_CPU_AUTHENTIC_SIM={simulateGame:simulateCpuGame,rebuild,refreshAwards};
})();
