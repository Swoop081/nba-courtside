/* NBA Starting5 v0.13.0-dev.5 — pure season dynamic-rating state. No renderer/playQuarter wrappers and no player-stat mutation. */
(()=>{
  if(window.__starting5DynamicRatingsV01305)return;
  window.__starting5DynamicRatingsV01305=true;

  const STORE_KEY='nbaStarting5DynamicRatingsV1';
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const key=p=>String(p?.playerId||p?.id||`${p?.name||''}|${p?.teamId||''}|${p?.classicTeam||''}`);
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(v))}catch{}};
  let streaks=read();

  const isSeasonGameplay=()=>{
    try{
      const game=document.getElementById('game');
      if(!game?.classList.contains('active'))return false;
      if(sessionStorage.getItem(ACTIVE_KEY)==='1')return true;
      return game.classList.contains('s5-rising-stars-game')||game.classList.contains('s5-all-star-game');
    }catch{return false}
  };

  const streak=p=>{const v=streaks[key(p)]||{};return{wins:Math.max(0,+v.wins||0),losses:Math.max(0,+v.losses||0)}};
  const deltaFrom=s=>s.wins>=9?3:s.wins>=6?2:s.wins>=3?1:s.losses>=9?-3:s.losses>=6?-2:s.losses>=3?-1:0;
  const getDelta=p=>deltaFrom(streak(p));
  const getBaseStat=(p,k)=>Number(p?.stats?.[k]??0)||0;
  const getSeasonEffectiveStat=(p,k)=>clamp(getBaseStat(p,k)+getDelta(p),0,33);
  const getEffectiveStat=(p,k)=>isSeasonGameplay()?getSeasonEffectiveStat(p,k):getBaseStat(p,k);

  const recordMatchupResult=(winner,loser)=>{
    if(!winner||!loser)return;
    const w=streak(winner),l=streak(loser);
    streaks[key(winner)]={wins:w.wins+1,losses:0};
    streaks[key(loser)]={wins:0,losses:l.losses+1};
    write(streaks);
  };
  const recordTie=()=>{};

  window.STARTING5_DYNAMIC_RATINGS={
    getDelta,getStreak:streak,getBaseStat,getEffectiveStat,getSeasonEffectiveStat,isSeasonGameplay,
    recordMatchupResult,recordTie,
    resetAll:()=>{streaks={};write(streaks)},
    snapshot:()=>JSON.parse(JSON.stringify(streaks)),
    apply:()=>{},applyAll:()=>{},restoreAll:()=>{},refreshBase:()=>{}
  };
})();