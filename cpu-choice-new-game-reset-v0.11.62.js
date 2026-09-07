/* NBA Starting5 v0.11.62 — hard reset stale CPU played cards when a new game starts. */
(()=>{
  if(window.__s5CpuNewGameResetV01162)return;
  window.__s5CpuNewGameResetV01162=true;

  const stage=()=>document.getElementById('s5CpuChoiceStage');
  const freshGame=()=>{
    try{
      return (state?.history?.length||0)===0 && Number(state?.quarter||1)<=1 && Number(state?.userScore||0)===0 && Number(state?.cpuScore||0)===0;
    }catch{return false}
  };

  const clearIfFresh=()=>{
    if(!freshGame())return;
    const s=stage();if(!s)return;
    const ticker=s.querySelector('.s5-cpu-choice-ticker');
    const host=s.querySelector('.s5-cpu-choice-card');
    const text=(ticker?.textContent||'').trim().toUpperCase();
    // Only clear while actually waiting. Once the first CPU reveal of the new game begins,
    // CPU CHOOSES is authoritative and must remain visible until that matchup resolves.
    if(text && text!=='WAITING FOR PLAYER CHOICE')return;
    if(ticker){ticker.textContent='WAITING FOR PLAYER CHOICE';ticker.classList.remove('is-result');}
    if(host&&host.children.length)host.replaceChildren();
  };

  const run=()=>{clearIfFresh();requestAnimationFrame(clearIfFresh);setTimeout(clearIfFresh,80);setTimeout(clearIfFresh,300)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();

  const observer=new MutationObserver(()=>clearIfFresh());
  const attach=()=>{
    const s=stage();
    if(s){observer.observe(s,{subtree:true,childList:true,characterData:true});clearIfFresh();}
    else setTimeout(attach,100);
  };
  attach();

  // New season games can reuse the same SPA DOM, so keep a lightweight guard active.
  const timer=setInterval(clearIfFresh,150);
  window.addEventListener('pagehide',()=>{clearInterval(timer);observer.disconnect();},{once:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)run()});
})();
