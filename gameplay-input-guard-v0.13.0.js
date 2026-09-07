/* NBA Starting5 v0.13.0-dev.7 — tap-vs-swipe input guard. Presentation/input only; no gameplay authority. */
(()=>{
  if(window.__starting5GameplayInputGuardV01307)return;
  window.__starting5GameplayInputGuardV01307=true;

  const MOVE_LIMIT=10;
  let gesture=null,suppressClick=false;
  const cardFrom=e=>e.target?.closest?.('#game.active #lineup .player-card')||null;

  document.addEventListener('pointerdown',e=>{
    const card=cardFrom(e);
    if(!card||card.classList.contains('used')||card.classList.contains('s5-position-locked')){gesture=null;return;}
    gesture={id:e.pointerId,x:e.clientX,y:e.clientY,card,moved:false};
    suppressClick=false;
  },true);

  document.addEventListener('pointermove',e=>{
    if(!gesture||gesture.id!==e.pointerId)return;
    if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>MOVE_LIMIT)gesture.moved=true;
  },true);

  document.addEventListener('pointerup',e=>{
    if(!gesture||gesture.id!==e.pointerId)return;
    const g=gesture;gesture=null;
    const moved=g.moved||Math.hypot(e.clientX-g.x,e.clientY-g.y)>MOVE_LIMIT;
    suppressClick=moved;
    if(!moved&&g.card.isConnected&&!g.card.classList.contains('used')){
      document.querySelectorAll('#game .player-card.s5-selected-choice').forEach(x=>x.classList.remove('s5-selected-choice'));
      g.card.classList.add('s5-selected-choice');
    }
  },true);

  document.addEventListener('pointercancel',()=>{gesture=null;suppressClick=false},true);

  /* Registered before the gameplay core so a swipe-generated click never reaches playQuarter. */
  document.addEventListener('click',e=>{
    const card=cardFrom(e);
    if(!card||!suppressClick)return;
    suppressClick=false;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  },true);

  window.addEventListener('s5:matchup-start',()=>{
    suppressClick=false;gesture=null;
    document.querySelectorAll('#game .player-card.s5-selected-choice,#game .player-card.s5-active-opponent').forEach(x=>x.classList.remove('s5-selected-choice','s5-active-opponent'));
  });

  window.addEventListener('s5:matchup-resolved',e=>{
    const entry=e.detail?.entry;if(!entry)return;
    requestAnimationFrame(()=>{
      const esc=v=>(window.CSS&&CSS.escape)?CSS.escape(String(v)):String(v).replace(/"/g,'\\"');
      const u=document.querySelector(`#game.active #lineup .player-card[data-id="${esc(entry.user?.id||entry.user?.playerId||'')}"]`);
      const cpu=[...document.querySelectorAll(`#game.active .player-card[data-id="${esc(entry.cpu?.id||entry.cpu?.playerId||'')}"]`)].find(c=>!c.closest('#lineup'));
      u?.classList.add('s5-selected-choice');cpu?.classList.add('s5-active-opponent');
    });
  });

  const style=document.createElement('style');style.id='s5-gameplay-selection-v01307';style.textContent=`#game .player-card.s5-selected-choice,#game .player-card.s5-active-opponent{outline:4px solid #35d05b!important;outline-offset:-4px!important;box-shadow:0 0 0 2px rgba(53,208,91,.35),0 0 18px rgba(53,208,91,.9)!important;z-index:55!important}#game .player-card.s5-selected-choice::after,#game .player-card.s5-active-opponent::after{content:'';position:absolute;inset:0;border:2px solid rgba(179,255,195,.95);pointer-events:none;z-index:70;box-sizing:border-box}`;document.head.appendChild(style);
})();
