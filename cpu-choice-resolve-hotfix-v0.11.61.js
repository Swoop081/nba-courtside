/* NBA Starting5 v0.11.63 — resolve CPU choice rail, lock card size, hard-reset between games, and scope rail to current opponent. */
(()=>{
  if(window.__s5CpuChoiceResolveV01161)return;
  window.__s5CpuChoiceResolveV01161=true;

  let awaitingResult=false;
  let lastHistoryLength=0;
  try{lastHistoryLength=state?.history?.length||0}catch{}

  const stage=()=>document.getElementById('s5CpuChoiceStage');
  const historyLength=()=>{try{return state?.history?.length||0}catch{return 0}};
  const freshGame=()=>{
    try{return historyLength()===0&&Number(state?.quarter||1)<=1&&Number(state?.userScore||0)===0&&Number(state?.cpuScore||0)===0}catch{return false}
  };

  const lockCpuCardSize=()=>{
    const first=document.querySelector('#lineup .player-card');
    const host=stage()?.querySelector('.s5-cpu-choice-card');
    if(!first||!host)return;
    const r=first.getBoundingClientRect();
    if(!(r.width>0&&r.height>0))return;
    host.style.setProperty('--s5-cpu-card-w',r.width+'px');
    host.querySelectorAll('.s5-cpu-history-card').forEach(w=>{
      w.style.setProperty('width',r.width+'px','important');
      w.style.setProperty('min-width',r.width+'px','important');
      w.style.setProperty('max-width',r.width+'px','important');
      w.style.setProperty('flex-basis',r.width+'px','important');
      w.style.setProperty('height',r.height+'px','important');
      w.style.setProperty('aspect-ratio','auto','important');
      const card=w.querySelector('.player-card');
      if(card){
        card.style.setProperty('width',r.width+'px','important');
        card.style.setProperty('height',r.height+'px','important');
        card.style.setProperty('min-width','0','important');
        card.style.setProperty('max-width','none','important');
      }
    });
  };

  const clearFreshGameRail=()=>{
    if(!freshGame())return false;
    const s=stage();if(!s)return false;
    const ticker=s.querySelector('.s5-cpu-choice-ticker');
    const host=s.querySelector('.s5-cpu-choice-card');
    const text=(ticker?.textContent||'').trim().toUpperCase();
    if(text&&text!=='WAITING FOR PLAYER CHOICE')return false;
    if(ticker){ticker.textContent='WAITING FOR PLAYER CHOICE';ticker.classList.remove('is-result');}
    if(host&&host.children.length)host.replaceChildren();
    awaitingResult=false;
    lastHistoryLength=0;
    return true;
  };

  const resolveVisual=()=>{
    const s=stage();if(!s)return;
    const ticker=s.querySelector('.s5-cpu-choice-ticker');
    if(ticker){
      ticker.textContent='WAITING FOR PLAYER CHOICE';
      ticker.classList.remove('is-result');
    }
    s.querySelectorAll('.s5-cpu-history-card').forEach(w=>w.classList.add('previous'));
    lockCpuCardSize();
  };

  document.addEventListener('pointerdown',e=>{
    const card=e.target.closest?.('#lineup .player-card');
    if(!card||card.classList.contains('used'))return;
    const game=document.getElementById('game');
    if(!game?.classList.contains('active'))return;
    awaitingResult=true;
    requestAnimationFrame(lockCpuCardSize);
  },true);

  const tick=()=>{
    if(clearFreshGameRail())return;
    const len=historyLength();
    if(len>lastHistoryLength){
      lastHistoryLength=len;
      awaitingResult=false;
      resolveVisual();
      setTimeout(resolveVisual,0);
      setTimeout(resolveVisual,1600);
    }else if(!awaitingResult&&len===lastHistoryLength&&len>0){
      const s=stage();
      const ticker=s?.querySelector('.s5-cpu-choice-ticker');
      if(ticker&&ticker.textContent.trim().toUpperCase()==='CPU CHOOSES')resolveVisual();
      else lockCpuCardSize();
    }else lockCpuCardSize();
  };

  const timer=setInterval(tick,120);
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
  window.addEventListener('resize',()=>requestAnimationFrame(()=>{clearFreshGameRail();lockCpuCardSize()}),{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){clearFreshGameRail();lockCpuCardSize()}});

  if(!window.__s5CpuOpponentRailFilterLoadV01163){
    window.__s5CpuOpponentRailFilterLoadV01163=true;
    const s=document.createElement('script');
    s.src='cpu-opponent-rail-filter-v0.11.63.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  }
})();
