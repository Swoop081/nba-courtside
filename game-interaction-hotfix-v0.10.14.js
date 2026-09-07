/* NBA Starting5 v0.11.59 — persistent CPU choice ticker + played-card rail. */
(()=>{
  if(window.__courtsideGameInteractionHotfixV01114)return;
  window.__courtsideGameInteractionHotfixV01114=true;

  let busy=false,choiceTimer=0,resultTimer=0;
  let cpuPlayed=[],pendingCpuId='',lastHistoryLength=0;
  const CPU_REVEAL_MS=1500;
  const RESULT_REVEAL_MS=1500;

  const idOf=p=>String(p?.id||p?.playerId||'');
  const canPick=card=>{
    if(busy||!card||card.classList.contains('used'))return false;
    if(typeof state==='undefined'||!state)return false;
    const game=document.getElementById('game');
    if(!game?.classList.contains('active'))return false;
    if(state.overtime)return false;
    return true;
  };

  const cpuChoice=()=>{
    try{
      const available=(Array.isArray(cpuTeam)?cpuTeam:[]).filter(p=>!state.usedCpu.has(p.id));
      if(!available.length)return null;
      return available.reduce((best,p)=>(+p.stats?.[state.category]||0)>(+best.stats?.[state.category]||0)?p:best);
    }catch{return null}
  };

  const ensureStage=()=>{
    const rail=document.getElementById('lineup');
    if(!rail)return null;
    let stage=document.getElementById('s5CpuChoiceStage');
    if(!stage){
      stage=document.createElement('section');
      stage.id='s5CpuChoiceStage';
      stage.className='s5-cpu-choice-stage';
      stage.innerHTML='<div class="s5-cpu-choice-ticker">WAITING FOR PLAYER CHOICE</div><div class="s5-cpu-choice-card"></div>';
      rail.insertAdjacentElement('afterend',stage);
    }else stage.querySelector('.s5-cpu-result-ticker')?.remove();
    stage.classList.remove('hidden');
    return stage;
  };

  const setTicker=text=>{
    const ticker=ensureStage()?.querySelector('.s5-cpu-choice-ticker');
    if(!ticker)return;
    ticker.textContent=String(text||'').toUpperCase();
    ticker.classList.remove('is-result');
  };

  const syncRailGeometry=()=>{
    const stage=ensureStage(),host=stage?.querySelector('.s5-cpu-choice-card'),rail=document.getElementById('lineup'),first=rail?.querySelector('.player-card');
    if(!host||!rail||!first)return;
    const rect=first.getBoundingClientRect();
    if(rect.width>0)host.style.setProperty('--s5-cpu-card-w',rect.width+'px');
    const cs=getComputedStyle(rail);let gap=parseFloat(cs.columnGap||cs.gap||'');if(!Number.isFinite(gap))gap=10;
    host.style.setProperty('--s5-cpu-gap',gap+'px');
  };

  const cpuCardMarkup=(p,previous)=>{
    let html='';try{html=typeof cardMarkup==='function'?cardMarkup(p,{activeStat:state?.category||null,eager:true}):''}catch{}
    return `<div class="s5-cpu-history-card${previous?' previous':''}" data-cpu-id="${idOf(p)}">${html}</div>`;
  };

  const renderCpuRail=()=>{
    const stage=ensureStage(),host=stage?.querySelector('.s5-cpu-choice-card');if(!host)return;
    syncRailGeometry();
    host.innerHTML=cpuPlayed.map((p,i)=>cpuCardMarkup(p,!pendingCpuId||i>0)).join('');
    host.querySelectorAll('.stat-circle b').forEach(x=>x.style.visibility='hidden');
    host.scrollLeft=0;
    stage.classList.remove('hidden');
  };

  const resetForNewGameIfNeeded=()=>{
    let len=0,q=0,us=0,cs=0;try{len=state?.history?.length||0;q=Number(state?.quarter)||0;us=Number(state?.userScore)||0;cs=Number(state?.cpuScore)||0}catch{}
    if(len===0&&q<=1&&us===0&&cs===0&&(lastHistoryLength>0||cpuPlayed.length)){cpuPlayed=[];pendingCpuId='';}
    lastHistoryLength=len;
  };

  const clearStage=()=>{
    clearTimeout(choiceTimer);clearTimeout(resultTimer);busy=false;
    resetForNewGameIfNeeded();
    pendingCpuId='';
    const stage=ensureStage();if(!stage)return;
    stage.classList.remove('hidden');
    setTicker('WAITING FOR PLAYER CHOICE');
    renderCpuRail();
  };

  const setMatchupLabel=()=>{
    const q=document.getElementById('quarterLabel');
    if(!q||typeof state==='undefined'||!state)return;
    q.textContent=state.overtime?'OVERTIME':'MATCHUP IS';
  };

  const showCpuChoice=p=>{
    const stage=ensureStage();if(!stage||!p)return;
    pendingCpuId=idOf(p);
    cpuPlayed=cpuPlayed.filter(x=>idOf(x)!==pendingCpuId);
    cpuPlayed.unshift(p);
    stage.classList.remove('hidden');
    setTicker('CPU CHOOSES');
    renderCpuRail();
  };

  const showResult=()=>{
    // The normal game result presentation remains authoritative. Keep this bar
    // as CPU CHOOSES so the opponent card stays visible until the next matchup.
    setTicker('CPU CHOOSES');
    renderCpuRail();
  };

  const unlockFreshQuarter=()=>{
    if(typeof state==='undefined'||!state)return;
    const rail=document.getElementById('lineup');if(!rail)return;
    const last=state.history?.[state.history.length-1];
    const hasResultForCurrent=!!last&&last.quarter===state.quarter;
    if(!hasResultForCurrent)rail.classList.remove('result-open');
    rail.querySelectorAll('.player-card:not(.used)').forEach(card=>{
      card.style.setProperty('pointer-events','auto','important');
      card.style.setProperty('cursor','pointer','important');
    });
  };

  document.addEventListener('click',e=>{
    const card=e.target.closest('#lineup .player-card');
    if(!canPick(card))return;
    if(e.target.closest('.identity'))return;

    const rail=document.getElementById('lineup');if(!rail)return;
    const last=state.history?.[state.history.length-1];
    const hasResultForCurrent=!!last&&last.quarter===state.quarter;
    if(rail.classList.contains('result-open')&&!hasResultForCurrent)rail.classList.remove('result-open');
    if(rail.classList.contains('result-open'))return;

    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    busy=true;
    const pick=cpuChoice();
    if(pick)showCpuChoice(pick);

    choiceTimer=setTimeout(()=>{
      const before=state?.history?.length||0;
      try{playQuarter(card.dataset.id)}catch(err){console.error('Starting5 v0.11.59 pick failed',err);busy=false;return}
      const after=state?.history?.length||0;
      lastHistoryLength=after;
      if(after>before){
        showResult();
        resultTimer=setTimeout(()=>{busy=false;renderCpuRail();},RESULT_REVEAL_MS);
      }else busy=false;
    },CPU_REVEAL_MS);
  },true);

  const wrapBegin=()=>{
    let fn=null;try{fn=window.beginQuarter||beginQuarter}catch{}
    if(typeof fn!=='function'||fn.__s5CpuRevealWrapped)return;
    const wrapped=function(){
      clearStage();
      const r=fn.apply(this,arguments);
      setMatchupLabel();
      requestAnimationFrame(()=>requestAnimationFrame(()=>{setMatchupLabel();unlockFreshQuarter();syncRailGeometry();renderCpuRail();}));
      return r
    };
    wrapped.__s5CpuRevealWrapped=true;window.beginQuarter=wrapped;try{beginQuarter=wrapped}catch{}
  };

  const style=document.createElement('style');
  style.textContent=`
    #quarterHistoryStrip,.quarter-history-strip{display:none!important}
    .s5-cpu-choice-stage,.s5-cpu-choice-stage.hidden{margin:14px 0 0;display:flex!important;flex-direction:column;align-items:stretch;gap:12px}
    .s5-cpu-choice-ticker{width:100%;min-height:64px;box-sizing:border-box;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:linear-gradient(180deg,#171f2b,#0d1219);display:flex;align-items:center;justify-content:center;padding:12px 16px;font-size:24px;font-weight:1000;letter-spacing:.02em;color:#f7b928;text-align:center}
    .s5-cpu-result-ticker{display:none!important}
    .s5-cpu-choice-card{width:100%!important;height:auto!important;aspect-ratio:auto!important;display:flex;align-items:flex-start;justify-content:flex-start;gap:var(--s5-cpu-gap,10px);overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .s5-cpu-choice-card:empty{display:none!important}.s5-cpu-choice-card::-webkit-scrollbar{display:none}
    .s5-cpu-history-card{flex:0 0 var(--s5-cpu-card-w,34.4vw);width:var(--s5-cpu-card-w,34.4vw);min-width:0;aspect-ratio:2.5/3.5;transition:opacity .2s ease,filter .2s ease}
    .s5-cpu-history-card>.player-card{width:100%!important;height:100%!important;min-width:0!important;max-width:none!important;margin:0!important;transform:none!important;pointer-events:none!important}
    .s5-cpu-history-card.previous{opacity:.34!important;filter:grayscale(.48) saturate(.55)!important;pointer-events:none!important}
    .s5-cpu-choice-card .stat-circle{position:relative!important}.s5-cpu-choice-card .stat-circle b{visibility:hidden!important}.s5-cpu-choice-card .stat-circle:after{content:'?';position:absolute;inset:0;display:grid;place-items:center;font:1000 1em/1 inherit;color:#fff}
    @media(max-width:430px){.s5-cpu-choice-ticker{min-height:60px;font-size:22px}}
  `;
  document.head.appendChild(style);

  const start=()=>{ensureStage();wrapBegin();resetForNewGameIfNeeded();setMatchupLabel();unlockFreshQuarter();setTicker('WAITING FOR PLAYER CHOICE');renderCpuRail();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){setMatchupLabel();unlockFreshQuarter();syncRailGeometry();renderCpuRail()}});
  window.addEventListener('resize',()=>requestAnimationFrame(()=>{syncRailGeometry();renderCpuRail()}),{passive:true});
})();
