/* NBA Starting5 v0.11.96 — dynamic matchup-streak ratings with CPU simulation API. */
(()=>{
  if(window.__starting5DynamicRatingsV01196)return;
  window.__starting5DynamicRatingsV01196=true;

  const STORE_KEY='nbaStarting5DynamicRatingsV1';
  const STAT_KEYS=['scoring','dunks','three','rebounding','passing','blocks','steals','freeThrows'];
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const pool=()=>{try{return Array.isArray(players)?players:[]}catch{return []}};
  const playerKey=p=>String(p?.playerId||p?.id||`${p?.name||''}|${p?.teamId||''}|${p?.classicTeam||''}`);
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(v))}catch{}};
  let streaks=read();

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
  const applyPlayer=p=>{
    ensureBase(p);if(!p?.stats||!p.__s5DynamicBaseStats)return;
    const d=deltaFor(p);
    for(const k of STAT_KEYS){const base=p.__s5DynamicBaseStats[k];if(Number.isFinite(base))p.stats[k]=clamp(base+d,0,33)}
    p.__s5DynamicRatingDelta=d;
  };
  const applyAll=()=>pool().forEach(applyPlayer);
  const resetAll=()=>{streaks={};write(streaks);applyAll()};

  const recordResult=(winner,loser)=>{
    if(!winner||!loser)return;
    const wk=playerKey(winner),lk=playerKey(loser),wr=row(winner),lr=row(loser);
    streaks[wk]={wins:wr.wins+1,losses:0};
    streaks[lk]={wins:0,losses:lr.losses+1};
    write(streaks);applyPlayer(winner);applyPlayer(loser);
  };
  const recordTie=(a,b)=>{if(a)applyPlayer(a);if(b)applyPlayer(b)};

  const chevronMarkup=p=>{
    const d=deltaFor(p),n=Math.abs(d),dir=d<0?'down':'up';
    const items=Array.from({length:3},(_,i)=>`<i class="${i<n?'active':''}"></i>`).join('');
    return `<div class="s5-dynamic-rating s5-dynamic-rating-${dir} ${d===0?'s5-dynamic-rating-neutral':''}" aria-label="${d===0?'No active rating streak':`${d>0?'+':''}${d} all stats`}">${items}</div>`;
  };

  const installCardMarkup=()=>{
    let fn=null;try{fn=window.cardMarkup||eval('cardMarkup')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsV01196Wrapped)return false;
    const wrapped=function(p){applyPlayer(p);const html=fn.apply(this,arguments),badge=chevronMarkup(p);if(typeof html!=='string')return html;return html.replace(/(<article\b[^>]*class="[^"]*player-card[^"]*"[^>]*>)/i,`$1${badge}`)};
    wrapped.__s5DynamicRatingsV01196Wrapped=true;window.cardMarkup=wrapped;try{eval('cardMarkup=window.cardMarkup')}catch{}return true;
  };
  const installPlayQuarter=()=>{
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsV01196Wrapped)return false;
    const wrapped=function(){let before=0;try{before=Array.isArray(state?.history)?state.history.length:0}catch{}const out=fn.apply(this,arguments);try{const hist=Array.isArray(state?.history)?state.history:[];if(hist.length>before){const h=hist[hist.length-1],u=Number(h?.userPts),c=Number(h?.cpuPts);if(Number.isFinite(u)&&Number.isFinite(c)&&u!==c)recordResult(u>c?h.user:h.cpu,u>c?h.cpu:h.user)}}catch(err){console.error('[Starting5 dynamic ratings]',err)}return out};
    wrapped.__s5DynamicRatingsV01196Wrapped=true;window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}return true;
  };

  applyAll();const install=()=>{applyAll();installCardMarkup();installPlayQuarter()};install();setTimeout(install,0);setTimeout(install,80);setTimeout(install,220);

  window.STARTING5_DYNAMIC_RATINGS={
    getDelta:deltaFor,getStreak:row,apply:applyPlayer,applyAll,resetAll,
    recordMatchupResult:recordResult,recordTie,
    getBaseStat:(p,k)=>{ensureBase(p);return Number(p?.__s5DynamicBaseStats?.[k]??p?.stats?.[k]??0)||0},
    getEffectiveStat:(p,k)=>{applyPlayer(p);return Number(p?.stats?.[k]??0)||0},
    snapshot:()=>JSON.parse(JSON.stringify(streaks))
  };
})();
