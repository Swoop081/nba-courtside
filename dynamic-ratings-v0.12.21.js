/* NBA Starting5 v0.13.0-dev.15 — persistent Season dynamic ratings with tie reset. */
(()=>{
  if(window.__starting5DynamicRatingsV01315)return;
  window.__starting5DynamicRatingsV01315=true;

  const STORE_KEY='nbaStarting5DynamicRatingsV1';
  const META_KEY='nbaStarting5DynamicRatingsSeasonV1';
  const SEASON_KEY='nbaStarting5SeasonV2';
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const PENDING_KEY='nbaStarting5SeasonPendingGameV1';
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const key=p=>String(p?.playerId||p?.id||`${p?.name||''}|${p?.teamId||''}|${p?.classicTeam||''}`);
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(v))}catch{}};
  const readSeason=()=>{try{return JSON.parse(localStorage.getItem(SEASON_KEY)||'null')}catch{return null}};
  let streaks=read();

  const ensureSeasonIdentity=()=>{
    const s=readSeason();if(!s?.createdAt||!s?.teamId)return;
    const id=`${s.createdAt}|${s.teamId}`;
    let previous='';try{previous=localStorage.getItem(META_KEY)||''}catch{}
    if(previous===id)return;
    const fresh=Number(s.roundIndex||0)===0&&Object.keys(s.results||{}).length===0;
    /* Only a genuinely brand-new Season may reset ratings. Never clear an in-progress
       save merely because its serialized identity changed during reload/re-entry. */
    if(fresh){streaks={};write(streaks)}
    try{localStorage.setItem(META_KEY,id)}catch{}
  };

  const seasonLineupMatchesSave=()=>{
    try{
      const s=readSeason();if(!s?.teamId)return false;
      const team=Array.isArray(userTeam)?userTeam:[];
      if(!team.length)return false;
      return team.every(p=>String(p?.teamId||'')===String(s.teamId));
    }catch{return false}
  };

  const isSeasonGameplay=()=>{
    try{
      const game=document.getElementById('game');
      if(!game?.classList.contains('active'))return false;
      if(sessionStorage.getItem(ACTIVE_KEY)==='1')return true;
      if(sessionStorage.getItem(PENDING_KEY))return true;
      if(game.classList.contains('s5-rising-stars-game')||game.classList.contains('s5-all-star-game'))return true;
      return seasonLineupMatchesSave();
    }catch{return false}
  };

  const streak=p=>{ensureSeasonIdentity();const v=streaks[key(p)]||{};return{wins:Math.max(0,+v.wins||0),losses:Math.max(0,+v.losses||0)}};
  const deltaFrom=s=>s.wins>=9?3:s.wins>=6?2:s.wins>=3?1:s.losses>=9?-3:s.losses>=6?-2:s.losses>=3?-1:0;
  const getDelta=p=>deltaFrom(streak(p));
  const getBaseStat=(p,k)=>Number(p?.stats?.[k]??0)||0;
  const getSeasonEffectiveStat=(p,k)=>clamp(getBaseStat(p,k)+getDelta(p),0,33);
  const getEffectiveStat=(p,k)=>isSeasonGameplay()?getSeasonEffectiveStat(p,k):getBaseStat(p,k);

  const recordMatchupResult=(winner,loser)=>{
    if(!winner||!loser)return;ensureSeasonIdentity();
    const w=streak(winner),l=streak(loser);
    streaks[key(winner)]={wins:w.wins+1,losses:0};
    streaks[key(loser)]={wins:0,losses:l.losses+1};
    write(streaks);
  };
  const recordTie=(a,b)=>{
    if(!a||!b)return;ensureSeasonIdentity();
    streaks[key(a)]={wins:0,losses:0};
    streaks[key(b)]={wins:0,losses:0};
    write(streaks);
  };

  window.STARTING5_DYNAMIC_RATINGS={
    getDelta,getStreak:streak,getBaseStat,getEffectiveStat,getSeasonEffectiveStat,isSeasonGameplay,
    recordMatchupResult,recordTie,
    resetAll:()=>{streaks={};write(streaks)},
    snapshot:()=>JSON.parse(JSON.stringify(streaks)),
    apply:()=>{},applyAll:()=>{},restoreAll:()=>{},refreshBase:()=>{}
  };
  ensureSeasonIdentity();
})();