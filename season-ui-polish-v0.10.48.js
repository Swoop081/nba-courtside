/* NBA Starting5 v0.10.87 — season UI polish without continuous game-DOM polling */
(()=>{
  if(window.__courtsideSeasonUiPolishV01087)return;
  window.__courtsideSeasonUiPolishV01087=true;
  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const RETURN_KEY='nbaCourtsideSeasonReturnPendingV1';

  const readSave=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const logoFor=p=>{
    try{if(typeof window.logoUrl==='function'){const u=window.logoUrl(p);if(u)return u;}}catch{}
    return p?.teamId?`assets/team-logos/current/${p.teamId}.svg`:'';
  };
  const short=p=>p?.teamShort||p?.team||'Team';
  const currentState=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};

  const renameAwards=()=>{
    document.querySelectorAll('#seasonTabs .season-tab').forEach(b=>{
      if(b.dataset.tab==='history'||b.textContent.trim()==='History')b.textContent='Awards';
    });
  };

  // IMPORTANT: this is intentionally one-shot. The previous implementation rebuilt
  // both scoreboard sides every 140ms for the entire Season game, which caused the
  // season-only tap/input lag on iPhone and also generated a mutation feedback loop.
  const repairSeasonScoreboard=()=>{
    if(sessionStorage.getItem(RETURN_KEY)!=='1')return;
    const game=document.getElementById('game');
    if(!game?.classList.contains('active'))return;
    let home=null,away=null;
    try{home=userTeam?.[0]||null;away=cpuTeam?.[0]||null}catch{}
    const gs=currentState();
    if(!home||!away||!gs)return;
    const sides=[...game.querySelectorAll('.score-side')];
    if(sides.length<2)return;

    const renderSide=(side,p,score,isAway)=>{
      const a=p.theme?.a||'#18202c',b=p.theme?.b||'#f7b928',c=p.theme?.c||'#080b10';
      side.style.setProperty('--score-primary',a);
      side.style.setProperty('--score-secondary',b);
      side.style.setProperty('--score-dark',c);
      const name=short(p).toUpperCase(),logo=logoFor(p);
      const key=`${p.teamId||name}|${isAway?'A':'H'}`;
      if(side.dataset.seasonIdentity===key)return;
      side.dataset.seasonIdentity=key;
      side.innerHTML=isAway
        ?`<div class="score-team away-team"><div class="score-number"><strong id="cpuScore">${score}</strong></div><div class="score-logo-wrap"><img src="${logo}" alt="${name}"></div><div class="score-name">${name}</div></div>`
        :`<div class="score-team"><div class="score-logo-wrap"><img src="${logo}" alt="${name}"></div><div class="score-number"><strong id="userScore">${score}</strong></div><div class="score-name">${name}</div></div>`;
    };

    renderSide(sides[0],home,gs.userScore||0,false);
    renderSide(sides[1],away,gs.cpuScore||0,true);
  };

  const goSeasonHub=e=>{
    e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
    sessionStorage.removeItem(RETURN_KEY);
    try{if(typeof renderSeasonHub==='function')renderSeasonHub();}catch{}
    try{if(typeof showScreen==='function')showScreen('seasonHub');}catch{}
    window.scrollTo({top:0,behavior:'instant'});
  };

  const polishFinal=()=>{
    if(sessionStorage.getItem(RETURN_KEY)!=='1')return;
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const s=readSave();
    if(s?.completed&&String(s?.champion)===String(s?.teamId))return;
    const buttons=[document.getElementById('compactPlayAgain'),document.getElementById('playAgainBtn')].filter(Boolean);
    buttons.forEach(btn=>{
      btn.textContent='Continue';
      if(btn.dataset.seasonContinueBound==='1')return;
      btn.dataset.seasonContinueBound='1';
      btn.addEventListener('click',goSeasonHub,true);
    });
  };

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-play-season],.season-play-btn')){
      sessionStorage.setItem(RETURN_KEY,'1');
      requestAnimationFrame(()=>requestAnimationFrame(repairSeasonScoreboard));
    }
  },true);

  const start=()=>{
    renameAwards();
    const final=document.getElementById('final');
    if(final)new MutationObserver(()=>{if(final.classList.contains('active'))requestAnimationFrame(polishFinal)}).observe(final,{attributes:true,attributeFilter:['class']});
    const hub=document.getElementById('seasonHub');
    if(hub)new MutationObserver(renameAwards).observe(hub,{childList:true,subtree:true});
    if(document.getElementById('game')?.classList.contains('active'))repairSeasonScoreboard();
    if(final?.classList.contains('active'))polishFinal();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
