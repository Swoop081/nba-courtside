/* NBA Starting5 v0.11.90 — dynamic matchup-streak ratings (+/-1 at 3, +/-2 at 6, +/-3 at 9). */
(()=>{
  if(window.__starting5DynamicRatingsV01190)return;
  window.__starting5DynamicRatingsV01190=true;

  const STORE_KEY='nbaStarting5DynamicRatingsV1';
  const STAT_KEYS=['scoring','dunks','three','rebounding','passing','blocks','steals','freeThrows'];
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const pool=()=>{try{return Array.isArray(players)?players:[]}catch{return []}};
  const playerKey=p=>String(p?.playerId||p?.id||`${p?.name||''}|${p?.teamId||''}|${p?.classicTeam||''}`);
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(v))}catch{}};
  let streaks=read();

  const row=p=>{
    const k=playerKey(p);
    const v=streaks[k]||{};
    return {wins:Math.max(0,Number(v.wins)||0),losses:Math.max(0,Number(v.losses)||0)};
  };
  const deltaFrom=r=>r.wins>=9?3:r.wins>=6?2:r.wins>=3?1:r.losses>=9?-3:r.losses>=6?-2:r.losses>=3?-1:0;
  const deltaFor=p=>deltaFrom(row(p));

  const ensureBase=p=>{
    if(!p||!p.stats)return;
    if(!p.__s5DynamicBaseStats){
      Object.defineProperty(p,'__s5DynamicBaseStats',{value:{},writable:true,configurable:true,enumerable:false});
      for(const k of STAT_KEYS){if(Number.isFinite(+p.stats[k]))p.__s5DynamicBaseStats[k]=+p.stats[k]}
    }
  };
  const applyPlayer=p=>{
    ensureBase(p);if(!p?.stats||!p.__s5DynamicBaseStats)return;
    const d=deltaFor(p);
    for(const k of STAT_KEYS){
      const base=p.__s5DynamicBaseStats[k];
      if(Number.isFinite(base))p.stats[k]=clamp(base+d,0,33);
    }
    p.__s5DynamicRatingDelta=d;
  };
  const applyAll=()=>pool().forEach(applyPlayer);

  const recordResult=(winner,loser)=>{
    if(!winner||!loser)return;
    const wk=playerKey(winner),lk=playerKey(loser);
    const wr=row(winner),lr=row(loser);
    streaks[wk]={wins:wr.wins+1,losses:0};
    streaks[lk]={wins:0,losses:lr.losses+1};
    write(streaks);
    applyPlayer(winner);applyPlayer(loser);
  };

  const arrowMarkup=p=>{
    const d=deltaFor(p);if(!d)return '';
    const n=Math.abs(d),dir=d>0?'up':'down';
    return `<div class="s5-dynamic-rating s5-dynamic-rating-${dir}" aria-label="${d>0?'+':''}${d} all stats">${Array.from({length:n},()=>'<i></i>').join('')}</div>`;
  };

  const installCardMarkup=()=>{
    let fn=null;try{fn=window.cardMarkup||eval('cardMarkup')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsWrapped)return false;
    const wrapped=function(p,o){
      applyPlayer(p);
      const html=fn.apply(this,arguments),badge=arrowMarkup(p);
      if(!badge||typeof html!=='string')return html;
      return html.replace(/(<article\b[^>]*class="[^"]*player-card[^"]*"[^>]*>)/i,`$1${badge}`);
    };
    wrapped.__s5DynamicRatingsWrapped=true;
    window.cardMarkup=wrapped;try{eval('cardMarkup=window.cardMarkup')}catch{}
    return true;
  };

  const installPlayQuarter=()=>{
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5DynamicRatingsWrapped)return false;
    const wrapped=function(){
      let before=0;try{before=Array.isArray(state?.history)?state.history.length:0}catch{}
      const out=fn.apply(this,arguments);
      try{
        const hist=Array.isArray(state?.history)?state.history:[];
        if(hist.length>before){
          const h=hist[hist.length-1],u=Number(h?.userPts),c=Number(h?.cpuPts);
          if(Number.isFinite(u)&&Number.isFinite(c)&&u!==c)recordResult(u>c?h.user:h.cpu,u>c?h.cpu:h.user);
        }
      }catch(err){console.error('[Starting5 dynamic ratings]',err)}
      return out;
    };
    wrapped.__s5DynamicRatingsWrapped=true;
    window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}
    return true;
  };

  const css=document.createElement('style');
  css.id='s5-dynamic-ratings-style-v01190';
  css.textContent=`
    .player-card .s5-dynamic-rating{position:absolute;z-index:28;top:8px;right:8px;width:28px;display:flex;flex-direction:column;align-items:center;gap:1px;pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.7))}
    .player-card .s5-dynamic-rating i{display:block;width:26px;height:12px;background:#28c856;clip-path:polygon(50% 0,100% 58%,78% 58%,50% 28%,22% 58%,0 58%);box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
    .player-card .s5-dynamic-rating-down i{background:#ef3340;transform:rotate(180deg)}
    .player-card .s5-dynamic-rating-up i{background:#28c856}
    @media(max-width:430px){.player-card .s5-dynamic-rating{top:7px;right:7px;width:25px}.player-card .s5-dynamic-rating i{width:23px;height:11px}}
  `;
  document.head.appendChild(css);

  applyAll();
  const install=()=>{applyAll();installCardMarkup();installPlayQuarter()};
  install();
  setTimeout(install,0);setTimeout(install,80);setTimeout(install,220);

  window.STARTING5_DYNAMIC_RATINGS={
    getDelta:p=>deltaFor(p),
    getStreak:p=>row(p),
    apply:applyPlayer,
    resetAll:()=>{streaks={};write(streaks);applyAll()}
  };
})();
