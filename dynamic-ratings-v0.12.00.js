/* NBA Starting5 v0.12.00 — season-only dynamic ratings with authoritative delayed matchup-result processing. */
(()=>{
  if(window.__starting5DynamicRatingsV01200)return;
  window.__starting5DynamicRatingsV01200=true;

  const STORE_KEY='nbaStarting5DynamicRatingsV1';
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const STAT_KEYS=['scoring','dunks','three','rebounding','passing','blocks','steals','freeThrows'];
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const pool=()=>{try{return Array.isArray(players)?players:[]}catch{return []}};
  const playerKey=p=>String(p?.playerId||p?.id||`${p?.name||''}|${p?.teamId||''}|${p?.classicTeam||''}`);
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(v))}catch{}};
  let streaks=read();
  const processedHistory=new WeakSet();

  const isSeasonGameplay=()=>{
    try{
      const game=document.getElementById('game');
      if(!game?.classList.contains('active'))return false;
      if(sessionStorage.getItem(ACTIVE_KEY)==='1')return true;
      return game.classList.contains('s5-rising-stars-game')||game.classList.contains('s5-all-star-game');
    }catch{return false}
  };

  const row=p=>{const v=streaks[playerKey(p)]||{};return{wins:Math.max(0,Number(v.wins)||0),losses:Math.max(0,Number(v.losses)||0)}};
  const deltaFrom=r=>r.wins>=9?3:r.wins>=6?2:r.wins>=3?1:r.losses>=9?-3:r.losses>=6?-2:r.losses>=3?-1:0;
  const deltaFor=p=>deltaFrom(row(p));

  const ensureBase=p=>{
    if(!p||!p.stats)return;
    if(!p.__s5DynamicBaseStats){
      Object.defineProperty(p,'__s5DynamicBaseStats',{value:{},writable:true,configurable:true,enumerable:false});
      for(const k of STAT_KEYS)if(Number.isFinite(+p.stats[k]))p.__s5DynamicBaseStats[k]=+p.stats[k];
    }
  };
  const restorePlayer=p=>{
    ensureBase(p);if(!p?.stats||!p.__s5DynamicBaseStats)return;
    for(const k of STAT_KEYS){const base=p.__s5DynamicBaseStats[k];if(Number.isFinite(base))p.stats[k]=base}
    p.__s5DynamicRatingDelta=0;
  };
  const applyPlayer=p=>{
    ensureBase(p);if(!p?.stats||!p.__s5DynamicBaseStats)return;
    const d=deltaFor(p);
    for(const k of STAT_KEYS){const base=p.__s5DynamicBaseStats[k];if(Number.isFinite(base))p.stats[k]=clamp(base+d,0,33)}
    p.__s5DynamicRatingDelta=d;
  };
  const restoreAll=()=>pool().forEach(restorePlayer);
  const applyAll=()=>{if(isSeasonGameplay())pool().forEach(applyPlayer);else restoreAll()};
  const resetAll=()=>{streaks={};write(streaks);restoreAll()};

  const recordResult=(winner,loser)=>{
    if(!winner||!loser)return;
    const wk=playerKey(winner),lk=playerKey(loser),wr=row(winner),lr=row(loser);
    streaks[wk]={wins:wr.wins+1,losses:0};
    streaks[lk]={wins:0,losses:lr.losses+1};
    write(streaks);
    if(isSeasonGameplay()){applyPlayer(winner);applyPlayer(loser)}else{restorePlayer(winner);restorePlayer(loser)}
  };
  const recordTie=(a,b)=>{if(isSeasonGameplay()){if(a)applyPlayer(a);if(b)applyPlayer(b)}else{if(a)restorePlayer(a);if(b)restorePlayer(b)}};

  const processHistoryEntry=h=>{
    if(!h||typeof h!=='object'||processedHistory.has(h))return false;
    const u=Number(h.userPts),c=Number(h.cpuPts);
    if(!h.user||!h.cpu||!Number.isFinite(u)||!Number.isFinite(c))return false;
    processedHistory.add(h);
    if(u>c)recordResult(h.user,h.cpu);
    else if(c>u)recordResult(h.cpu,h.user);
    else recordTie(h.user,h.cpu);
    return true;
  };
  const processNewHistory=(fromIndex,seasonAtPlay)=>{
    if(!seasonAtPlay)return;
    try{
      const hist=Array.isArray(state?.history)?state.history:[];
      for(let i=Math.max(0,fromIndex);i<hist.length;i++)processHistoryEntry(hist[i]);
    }catch(err){console.error('[Starting5 dynamic ratings history]',err)}
  };
  const scheduleHistoryProcessing=(fromIndex,seasonAtPlay)=>{
    [0,25,80,180,400,850,1400].forEach(ms=>setTimeout(()=>processNewHistory(fromIndex,seasonAtPlay),ms));
  };

  const chevronMarkup=p=>{
    if(!isSeasonGameplay())return '';
    const d=deltaFor(p),n=Math.abs(d),dir=d<0?'down':'up';
    if(d===0)return '';
    const items=Array.from({length:3},(_,i)=>`<i class="${i<n?'active':''}"></i>`).join('');
    return `<div class="s5-dynamic-rating s5-dynamic-rating-${dir}" aria-label="${d>0?'+':''}${d} all stats">${items}</div>`;
  };

  const installCardMarkup=()=>{
    let fn=null;try{fn=window.cardMarkup||eval('cardMarkup')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsV01200Wrapped)return false;
    const wrapped=function(p){
      if(isSeasonGameplay())applyPlayer(p);else restorePlayer(p);
      const html=fn.apply(this,arguments),badge=chevronMarkup(p);
      if(typeof html!=='string'||!badge)return html;
      return html.replace(/(<article\b[^>]*class="[^"]*player-card[^"]*"[^>]*>)/i,`$1${badge}`);
    };
    wrapped.__s5DynamicRatingsV01200Wrapped=true;window.cardMarkup=wrapped;try{eval('cardMarkup=window.cardMarkup')}catch{}return true;
  };

  const installPlayQuarter=()=>{
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsV01200Wrapped)return false;
    const wrapped=function(){
      let before=0;try{before=Array.isArray(state?.history)?state.history.length:0}catch{}
      const seasonAtPlay=isSeasonGameplay();
      const out=fn.apply(this,arguments);
      scheduleHistoryProcessing(before,seasonAtPlay);
      return out;
    };
    wrapped.__s5DynamicRatingsV01200Wrapped=true;window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}return true;
  };

  restoreAll();
  const install=()=>{applyAll();installCardMarkup();installPlayQuarter()};
  install();setTimeout(install,0);setTimeout(install,80);setTimeout(install,220);
  document.addEventListener('click',()=>setTimeout(applyAll,0),true);
  window.addEventListener('pageshow',applyAll);

  window.STARTING5_DYNAMIC_RATINGS={
    getDelta:deltaFor,getStreak:row,apply:p=>{if(isSeasonGameplay())applyPlayer(p);else restorePlayer(p)},applyAll,restoreAll,resetAll,
    recordMatchupResult:recordResult,recordTie,
    getBaseStat:(p,k)=>{ensureBase(p);return Number(p?.__s5DynamicBaseStats?.[k]??p?.stats?.[k]??0)||0},
    getEffectiveStat:(p,k)=>{ensureBase(p);const base=Number(p?.__s5DynamicBaseStats?.[k]??p?.stats?.[k]??0)||0;return clamp(base+deltaFor(p),0,33)},
    snapshot:()=>JSON.parse(JSON.stringify(streaks)),isSeasonGameplay
  };
})();
