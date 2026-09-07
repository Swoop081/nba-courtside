/* NBA Starting5 v0.13.0-dev.5 — event-driven CPU season simulation and dynamic-rating replay. */
(()=>{
  if(window.__starting5CpuAuthenticSimV01305)return;
  window.__starting5CpuAuthenticSimV01305=true;

  const SAVE_KEY='nbaStarting5SeasonV2',ACTIVE_KEY='nbaStarting5SeasonGameUiV1',PENDING_KEY='nbaStarting5SeasonPendingGameV1';
  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const pool=()=>{try{return Array.isArray(players)?players.filter(p=>!p.classicTeam):[]}catch{return []}};
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const byKey=(k,n,t)=>pool().find(p=>key(p)===String(k))||pool().find(p=>p.name===n&&String(p.teamId)===String(t))||null;
  const teamPlayers=id=>pool().filter(p=>String(p.teamId)===String(id)).slice(0,5);
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const stat=(p,c)=>{try{return dyn()?.getSeasonEffectiveStat?dyn().getSeasonEffectiveStat(p,c):(Number(p?.stats?.[c])||0)}catch{return Number(p?.stats?.[c])||0}};
  function hash(str){let h=2166136261>>>0;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  const bestUnused=(roster,used,cat)=>{const a=roster.filter(p=>!used.has(key(p)));if(!a.length)return null;return a.reduce((b,p)=>stat(p,cat)>stat(b,cat)?p:b)};
  const side=(p,v,d)=>({key:key(p),name:p.name,teamId:String(p.teamId),value:v,diff:d,dynamicDelta:Number(dyn()?.getDelta?.(p)||0)});
  const record=(a,b,av,bv)=>{if(av>bv)dyn()?.recordMatchupResult?.(a,b);else if(bv>av)dyn()?.recordMatchupResult?.(b,a);else dyn()?.recordTie?.(a,b)};

  function simulateCpuGame(g){
    const home=teamPlayers(g.home),away=teamPlayers(g.away);if(home.length<5||away.length<5)return[];
    const r=rng(hash(`v01305|${g.id}`)),hu=new Set(),au=new Set(),out=[];let hs=0,as=0;
    const play=(isOt=false)=>{const cat=CATS[Math.floor(r()*CATS.length)],h=bestUnused(home,hu,cat),a=bestUnused(away,au,cat);if(!h||!a)return false;const av=stat(h,cat),bv=stat(a,cat),d=av-bv;out.push({category:cat,overtime:!!isOt,a:side(h,av,d),b:side(a,bv,-d)});hu.add(key(h));au.add(key(a));if(d>0)hs++;else if(d<0)as++;record(h,a,av,bv);return true};
    for(let i=0;i<4;i++)play(false);
    if(hs===as)play(true);
    return out;
  }
  function replayStoredMatchups(res){for(const m of res?.matchups||[]){if(!m?.a||!m?.b)continue;const a=byKey(m.a.key,m.a.name,m.a.teamId),b=byKey(m.b.key,m.b.name,m.b.teamId);if(!a||!b)continue;const av=Number(m.a.value),bv=Number(m.b.value);if(Number.isFinite(av)&&Number.isFinite(bv))record(a,b,av,bv)}}
  function normalizeActual(history){const out=[];for(const h of history||[]){if(!h?.user||!h?.cpu||!CATS.includes(h.category))continue;const av=Number(h.userPts)||0,bv=Number(h.cpuPts)||0,d=av-bv;out.push({category:h.category,overtime:h.quarter==='OT',a:side(h.user,av,d),b:side(h.cpu,bv,-d)})}return out}
  function refreshAwards(s){try{return window.STARTING5_MATCHUP_PLUS?.calculate?.(s)||null}catch(err){console.error('[Starting5 CPU awards refresh]',err);return null}}

  function processIncremental(s){
    if(!s?.results||!Array.isArray(s.schedule))return false;let changed=false,simCount=0;
    for(const round of s.schedule){for(const g of round||[]){const res=s.results?.[g.id];if(!res||res.userPlayed||res.cpuSimulationVersion===4)continue;res.matchups=simulateCpuGame(g);res.matchupLedgerSource='cpu-authentic-dynamic-v4';res.cpuSimulationVersion=4;res.dynamicRatingsApplied=true;simCount++;changed=true}}
    if(changed){s.matchupLedgerVersion=4;s.cpuAuthenticSimulationVersion=4;s.cpuAuthenticSimulation={incremental:true,gamesProcessed:simCount,updatedAt:Date.now()};refreshAwards(s)}
    return changed;
  }
  function rebuildFromSave(s){
    if(!s?.results||!Array.isArray(s.schedule)||!dyn()?.resetAll)return false;dyn().resetAll();let changed=false,simCount=0,matchupCount=0;
    for(const round of s.schedule){for(const g of round||[]){const res=s.results?.[g.id];if(!res)continue;if(res.userPlayed){replayStoredMatchups(res);res.dynamicRatingsApplied=true;matchupCount+=(res.matchups||[]).length;continue}res.matchups=simulateCpuGame(g);res.matchupLedgerSource='cpu-authentic-dynamic-v4';res.cpuSimulationVersion=4;res.dynamicRatingsApplied=true;simCount++;matchupCount+=res.matchups.length;changed=true}}
    s.matchupLedgerVersion=4;s.cpuAuthenticSimulationVersion=4;s.cpuAuthenticSimulation={games:simCount,matchups:matchupCount,rebuiltAt:Date.now()};refreshAwards(s);return changed;
  }
  function readSeason(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}}
  function writeSeason(s){try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}}
  function pending(){try{return JSON.parse(sessionStorage.getItem(PENDING_KEY)||'null')}catch{return null}}

  window.addEventListener('s5:game-finished',e=>{
    try{if(sessionStorage.getItem(ACTIVE_KEY)!=='1')return}catch{return}
    const s=readSeason(),p=pending();if(!s||!p)return;const res=s.results?.[p.gameId];if(!res)return;
    const actual=normalizeActual(e.detail?.history||[]);if(actual.length){res.matchups=actual;res.matchupLedgerSource='actual';res.dynamicRatingsApplied=true}
    processIncremental(s);refreshAwards(s);writeSeason(s);
  });

  const boot=()=>{const s=readSeason();if(!s)return;rebuildFromSave(s);writeSeason(s)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.STARTING5_CPU_AUTHENTIC_SIM={simulateGame:simulateCpuGame,processIncremental,rebuild:rebuildFromSave,refreshAwards};
})();