/* NBA Starting5 v0.12.05 — immediate green selection confirmation on chosen matchup card. */
(()=>{
  if(window.__starting5SelectedCardHighlightV01205)return;
  window.__starting5SelectedCardHighlightV01205=true;

  const style=document.createElement('style');
  style.id='s5-selected-card-highlight-v01205';
  style.textContent=`
    #game #lineup .player-card.s5-selected-choice{
      outline:4px solid #35d05b!important;
      outline-offset:-4px!important;
      box-shadow:0 0 0 2px rgba(53,208,91,.35),0 0 18px rgba(53,208,91,.9)!important;
      z-index:55!important;
    }
    #game #lineup .player-card.s5-selected-choice::after{
      content:'';position:absolute;inset:0;border:2px solid rgba(179,255,195,.95);pointer-events:none;z-index:70;box-sizing:border-box;
    }
  `;
  document.head.appendChild(style);

  const clear=()=>document.querySelectorAll('#lineup .player-card.s5-selected-choice').forEach(x=>x.classList.remove('s5-selected-choice'));

  document.addEventListener('pointerdown',e=>{
    const card=e.target?.closest?.('#game.active #lineup .player-card');
    if(!card||card.classList.contains('used'))return;
    clear();
    card.classList.add('s5-selected-choice');
  },true);

  const wrap=name=>{
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5SelectionHighlightWrapped)return;
    const wrapped=function(){clear();return fn.apply(this,arguments)};
    wrapped.__s5SelectionHighlightWrapped=true;
    window[name]=wrapped;
    try{eval(`${name}=window[name]`)}catch{}
  };
  wrap('beginQuarter');
})();
