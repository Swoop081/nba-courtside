/* NBA Courtside v0.10.14 — restore reliable gameplay card selection */
(()=>{
  if(window.__courtsideGameInteractionHotfixV01014)return;
  window.__courtsideGameInteractionHotfixV01014=true;

  const canPick=card=>{
    if(!card||card.classList.contains('used'))return false;
    if(typeof state==='undefined'||!state)return false;
    const game=document.getElementById('game');
    if(!game?.classList.contains('active'))return false;
    if(state.overtime)return false;
    return true;
  };

  const unlockFreshQuarter=()=>{
    if(typeof state==='undefined'||!state)return;
    const rail=document.getElementById('lineup');
    if(!rail)return;
    const last=state.history?.[state.history.length-1];
    const hasResultForCurrent=!!last && last.quarter===state.quarter;
    if(!hasResultForCurrent)rail.classList.remove('result-open');
    rail.querySelectorAll('.player-card:not(.used)').forEach(card=>{
      card.style.setProperty('pointer-events','auto','important');
      card.style.setProperty('cursor','pointer','important');
    });
  };

  document.addEventListener('click',e=>{
    const card=e.target.closest('#lineup .player-card');
    if(!canPick(card))return;
    const rail=document.getElementById('lineup');
    if(!rail)return;

    const last=state.history?.[state.history.length-1];
    const hasResultForCurrent=!!last && last.quarter===state.quarter;
    if(rail.classList.contains('result-open')&&!hasResultForCurrent){
      rail.classList.remove('result-open');
    }
    if(rail.classList.contains('result-open'))return;

    const before=state.history?.length||0;
    try{playQuarter(card.dataset.id);}catch(err){console.error('Courtside v0.10.14 pick failed',err);return;}
    const after=state.history?.length||0;
    if(after>before){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);

  const sync=()=>{
    unlockFreshQuarter();
    requestAnimationFrame(unlockFreshQuarter);
  };
  document.addEventListener('DOMContentLoaded',sync,{once:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
  setInterval(unlockFreshQuarter,150);
})();
