/* NBA Starting5 v0.11.10 — CPU choice reveal flow + matchup label + nameplate inspection split */
(()=>{
  if(window.__courtsideGameInteractionHotfixV01110)return;
  window.__courtsideGameInteractionHotfixV01110=true;

  let busy=false,choiceTimer=0,resultTimer=0;
  const CPU_REVEAL_MS=1500;
  const RESULT_REVEAL_MS=1500;

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
      stage.className='s5-cpu-choice-stage hidden';
      stage.innerHTML='<div class="s5-cpu-choice-ticker">CPU CHOOSES</div><div class="s5-cpu-choice-card"></div><div class="s5-cpu-result-ticker hidden"></div>';
      rail.insertAdjacentElement('afterend',stage);
    }
    return stage;
  };

  const clearStage=()=>{
    clearTimeout(choiceTimer);clearTimeout(resultTimer);busy=false;
    const stage=ensureStage();if(!stage)return;
    stage.classList.add('hidden');
    stage.querySelector('.s5-cpu-choice-ticker')?.classList.remove('hidden');
    stage.querySelector('.s5-cpu-result-ticker')?.classList.add('hidden');
    const host=stage.querySelector('.s5-cpu-choice-card');if(host)host.innerHTML='';
  };

  const setMatchupLabel=()=>{
    const q=document.getElementById('quarterLabel');
    if(!q||typeof state==='undefined'||!state)return;
    q.textContent=state.overtime?'OVERTIME':'MATCHUP IS';
  };

  const showCpuChoice=p=>{
    const stage=ensureStage();if(!stage||!p)return;
    stage.classList.remove('hidden');
    stage.querySelector('.s5-cpu-choice-ticker')?.classList.remove('hidden');
    stage.querySelector('.s5-cpu-result-ticker')?.classList.add('hidden');
    let html='';
    try{html=typeof cardMarkup==='function'?cardMarkup(p,{activeStat:state?.category||null,eager:true}):''}catch{}
    const host=stage.querySelector('.s5-cpu-choice-card');if(host)host.innerHTML=html;
  };

  const showResult=()=>{
    const stage=ensureStage();if(!stage)return;
    const h=state?.history?.[state.history.length-1];if(!h)return;
    const u=Number(h.userPts)||0,c=Number(h.cpuPts)||0;
    let text=`TIE · ${u}–${c}`;
    if(u>c)text=`${h.user?.name||'YOU'} WINS · ${u}–${c}`;
    else if(c>u)text=`${h.cpu?.name||'CPU'} WINS · ${c}–${u}`;
    stage.querySelector('.s5-cpu-choice-ticker')?.classList.add('hidden');
    const result=stage.querySelector('.s5-cpu-result-ticker');
    if(result){result.textContent=text.toUpperCase();result.classList.remove('hidden');}
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
      try{playQuarter(card.dataset.id)}catch(err){console.error('Starting5 v0.11.10 pick failed',err);busy=false;return}
      const after=state?.history?.length||0;
      if(after>before){
        showResult();
        resultTimer=setTimeout(()=>{const s=ensureStage();if(s)s.classList.add('hidden');busy=false;},RESULT_REVEAL_MS);
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
      requestAnimationFrame(()=>{setMatchupLabel();unlockFreshQuarter();});
      return r
    };
    wrapped.__s5CpuRevealWrapped=true;window.beginQuarter=wrapped;try{beginQuarter=wrapped}catch{}
  };

  const style=document.createElement('style');
  style.textContent=`
    #quarterHistoryStrip,.quarter-history-strip{display:none!important}
    .s5-cpu-choice-stage{margin:14px 0 0;display:flex;flex-direction:column;align-items:center;gap:12px}.s5-cpu-choice-stage.hidden{display:none!important}
    .s5-cpu-choice-ticker,.s5-cpu-result-ticker{width:100%;min-height:64px;box-sizing:border-box;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:linear-gradient(180deg,#171f2b,#0d1219);display:flex;align-items:center;justify-content:center;padding:12px 16px;font-size:24px;font-weight:1000;letter-spacing:.02em;color:#f7b928;text-align:center}
    .s5-cpu-result-ticker{color:#fff}.s5-cpu-choice-ticker.hidden,.s5-cpu-result-ticker.hidden{display:none!important}
    .s5-cpu-choice-card{width:min(34.4vw,168px);aspect-ratio:2.5/3.5;display:flex;align-items:stretch;justify-content:center}
    .s5-cpu-choice-card>.player-card{width:100%!important;height:100%!important;min-width:0!important;max-width:none!important;margin:0!important;transform:none!important;pointer-events:none!important}
    .s5-cpu-choice-card .stat-circle{position:relative!important}.s5-cpu-choice-card .stat-circle b{visibility:hidden!important}.s5-cpu-choice-card .stat-circle:after{content:'?';position:absolute;inset:0;display:grid;place-items:center;font:1000 1em/1 inherit;color:#fff}
    @media(max-width:430px){.s5-cpu-choice-ticker,.s5-cpu-result-ticker{min-height:60px;font-size:22px}.s5-cpu-choice-card{width:36vw;max-width:148px}}
  `;
  document.head.appendChild(style);

  const start=()=>{ensureStage();wrapBegin();setMatchupLabel();unlockFreshQuarter();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){setMatchupLabel();unlockFreshQuarter()}});
})();
