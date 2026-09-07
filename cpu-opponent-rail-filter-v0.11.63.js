/* NBA Starting5 v0.11.63 — keep CPU played-card rail scoped to the current opponent only. */
(()=>{
  if(window.__s5CpuOpponentRailFilterV01163)return;
  window.__s5CpuOpponentRailFilterV01163=true;

  let lastSignature='';

  const idOf=p=>String(p?.id||p?.playerId||'');
  const currentIds=()=>{
    try{return new Set((Array.isArray(cpuTeam)?cpuTeam:[]).map(idOf).filter(Boolean))}catch{return new Set()}
  };
  const signature=()=>[...currentIds()].sort().join('|');

  const resetVisual=()=>{
    const stage=document.getElementById('s5CpuChoiceStage');
    const host=stage?.querySelector('.s5-cpu-choice-card');
    const ticker=stage?.querySelector('.s5-cpu-choice-ticker');
    if(host)host.innerHTML='';
    if(ticker){ticker.textContent='WAITING FOR PLAYER CHOICE';ticker.classList.remove('is-result')}
  };

  const filterRail=()=>{
    const ids=currentIds();
    const sig=[...ids].sort().join('|');
    if(sig&&lastSignature&&sig!==lastSignature)resetVisual();
    if(sig)lastSignature=sig;

    const stage=document.getElementById('s5CpuChoiceStage');
    const host=stage?.querySelector('.s5-cpu-choice-card');
    if(!host)return;
    host.querySelectorAll('.s5-cpu-history-card').forEach(w=>{
      if(!ids.has(String(w.dataset.cpuId||'')))w.remove();
    });
  };

  const installObserver=()=>{
    const host=document.querySelector('#s5CpuChoiceStage .s5-cpu-choice-card');
    if(!host||host.__s5OpponentFilterObserved)return false;
    host.__s5OpponentFilterObserved=true;
    new MutationObserver(()=>queueMicrotask(filterRail)).observe(host,{childList:true,subtree:false});
    return true;
  };

  const tick=()=>{
    filterRail();
    installObserver();
  };

  const timer=setInterval(tick,100);
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
})();
