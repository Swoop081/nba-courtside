/* NBA Starting5 v0.12.09 — tap-only selection acknowledgement; swiping the rail never highlights a card. */
(()=>{
  if(window.__starting5SelectedCardHighlightV01209)return;
  window.__starting5SelectedCardHighlightV01209=true;

  /* Neutralise any earlier selection-highlight stylesheet if it was injected first. */
  ['s5-selected-card-highlight-v01205','s5-selected-card-highlight-v01207'].forEach(id=>document.getElementById(id)?.remove());

  const style=document.createElement('style');
  style.id='s5-selected-card-highlight-v01209';
  style.textContent=`
    #game #lineup .player-card.s5-selected-choice,
    #game #cpuReveal .player-card.s5-active-opponent,
    #game .s5-active-opponent.player-card{
      outline:4px solid #35d05b!important;
      outline-offset:-4px!important;
      box-shadow:0 0 0 2px rgba(53,208,91,.35),0 0 18px rgba(53,208,91,.9)!important;
      z-index:55!important;
    }
    #game #lineup .player-card.s5-selected-choice::after,
    #game #cpuReveal .player-card.s5-active-opponent::after,
    #game .s5-active-opponent.player-card::after{
      content:'';position:absolute;inset:0;border:2px solid rgba(179,255,195,.95);pointer-events:none;z-index:70;box-sizing:border-box;
    }
  `;
  document.head.appendChild(style);

  const clearUser=()=>document.querySelectorAll('#lineup .player-card.s5-selected-choice').forEach(x=>x.classList.remove('s5-selected-choice'));
  const clearCpu=()=>document.querySelectorAll('#game .player-card.s5-active-opponent').forEach(x=>x.classList.remove('s5-active-opponent'));
  const clearAll=()=>{clearUser();clearCpu()};

  let gesture=null;
  let manualChoice=false;
  const TAP_MOVE_LIMIT=10;
  const TAP_TIME_LIMIT=650;

  document.addEventListener('pointerdown',e=>{
    const card=e.target?.closest?.('#game.active #lineup .player-card');
    if(!card||card.classList.contains('used')||document.getElementById('lineup')?.classList.contains('result-open')){gesture=null;return;}
    gesture={card,pointerId:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),moved:false};
  },true);

  document.addEventListener('pointermove',e=>{
    if(!gesture||e.pointerId!==gesture.pointerId)return;
    if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>TAP_MOVE_LIMIT)gesture.moved=true;
  },true);

  const finishGesture=e=>{
    if(!gesture||e.pointerId!==gesture.pointerId)return;
    const g=gesture;gesture=null;
    const elapsed=performance.now()-g.t;
    const moved=g.moved||Math.hypot(e.clientX-g.x,e.clientY-g.y)>TAP_MOVE_LIMIT;
    if(moved||elapsed>TAP_TIME_LIMIT)return;
    if(!g.card.isConnected||g.card.classList.contains('used')||document.getElementById('lineup')?.classList.contains('result-open'))return;
    manualChoice=true;
    clearUser();
    g.card.classList.add('s5-selected-choice');
  };
  document.addEventListener('pointerup',finishGesture,true);
  document.addEventListener('pointercancel',()=>{gesture=null},true);

  const markCpu=()=>{
    clearCpu();
    const reveal=document.querySelector('#game.active #cpuReveal .player-card');
    if(reveal)reveal.classList.add('s5-active-opponent');
  };

  const wrapBegin=()=>{
    let fn=null;try{fn=window.beginQuarter||eval('beginQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5SelectionBeginV01209)return false;
    const wrapped=function(){gesture=null;manualChoice=false;clearAll();const out=fn.apply(this,arguments);setTimeout(clearAll,0);return out};
    wrapped.__s5SelectionBeginV01209=true;window.beginQuarter=wrapped;try{eval('beginQuarter=window.beginQuarter')}catch{}return true;
  };

  const wrapPlay=()=>{
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5SelectionPlayV01209)return false;
    const wrapped=function(){
      if(!manualChoice)clearUser();
      const out=fn.apply(this,arguments);
      [0,25,70,140,260].forEach(ms=>setTimeout(markCpu,ms));
      return out;
    };
    wrapped.__s5SelectionPlayV01209=true;window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}return true;
  };

  const install=()=>{wrapBegin();wrapPlay()};
  install();setTimeout(install,0);setTimeout(install,100);setTimeout(install,300);
})();
