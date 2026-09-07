/* NBA Starting5 v0.12.20 — season-only dynamic ratings. PURE: never mutates player base stats. */
(()=>{
  if(window.__starting5DynamicRatingsV01220)return;
  window.__starting5DynamicRatingsV01220=true;

  const STORE_KEY='nbaStarting5DynamicRatingsV1';
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
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
  const baseStat=(p,k)=>Number(p?.stats?.[k]??0)||0;
  const effectiveStat=(p,k)=>clamp(baseStat(p,k)+deltaFor(p),0,33);

  const recordResult=(winner,loser)=>{
    if(!winner||!loser)return;
    const wk=playerKey(winner),lk=playerKey(loser),wr=row(winner),lr=row(loser);
    streaks[wk]={wins:wr.wins+1,losses:0};
    streaks[lk]={wins:0,losses:lr.losses+1};
    write(streaks);
  };
  const recordTie=()=>{};

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

  const chevronMarkup=p=>{
    if(!isSeasonGameplay())return '';
    const d=deltaFor(p),n=Math.abs(d),dir=d<0?'down':'up';if(!d)return '';
    const items=Array.from({length:3},(_,i)=>`<i class="${i<n?'active':''}"></i>`).join('');
    return `<div class="s5-dynamic-rating s5-dynamic-rating-${dir}" aria-label="${d>0?'+':''}${d} all stats">${items}</div>`;
  };

  const installCardMarkup=()=>{
    let fn=null;try{fn=window.cardMarkup||eval('cardMarkup')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsV01220Wrapped)return false;
    const base=fn;
    const wrapped=function(p){
      const html=base.apply(this,arguments),badge=chevronMarkup(p);
      if(typeof html!=='string'||!badge)return html;
      return html.replace(/(<article\b[^>]*class="[^"]*player-card[^"]*"[^>]*>)/i,`$1${badge}`);
    };
    wrapped.__s5DynamicRatingsV01220Wrapped=true;
    window.cardMarkup=wrapped;try{eval('cardMarkup=window.cardMarkup')}catch{};
    return true;
  };

  const installPlayQuarter=()=>{
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsV01220Wrapped)return false;
    const base=fn;
    const wrapped=function(){
      let before=0;try{before=Array.isArray(state?.history)?state.history.length:0}catch{}
      const seasonAtPlay=isSeasonGameplay();
      const out=base.apply(this,arguments);
      if(seasonAtPlay){
        try{const hist=Array.isArray(state?.history)?state.history:[];for(let i=before;i<hist.length;i++)processHistoryEntry(hist[i])}catch(err){console.error('[Starting5 dynamic ratings]',err)}
      }
      return out;
    };
    wrapped.__s5DynamicRatingsV01220Wrapped=true;
    window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{};
    return true;
  };

  const install=()=>{installCardMarkup();installPlayQuarter()};
  install();setTimeout(install,100);setTimeout(install,350);
  window.addEventListener('pageshow',()=>setTimeout(install,30));

  window.STARTING5_DYNAMIC_RATINGS={
    getDelta:deltaFor,getStreak:row,
    getBaseStat:baseStat,getEffectiveStat:effectiveStat,
    recordMatchupResult:recordResult,recordTie,
    resetAll:()=>{streaks={};write(streaks)},
    snapshot:()=>JSON.parse(JSON.stringify(streaks)),isSeasonGameplay,
    /* Compatibility shims. Deliberately do not touch p.stats. */
    apply:()=>{},applyAll:()=>{},restoreAll:()=>{},refreshBase:()=>{}
  };
})();
