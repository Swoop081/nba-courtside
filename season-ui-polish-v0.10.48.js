/* NBA Courtside v0.10.53 — season picker polish, Awards tab, authoritative season scoreboard identity, Continue-to-hub final */
(()=>{
  if(window.__courtsideSeasonUiPolishV01053)return;
  window.__courtsideSeasonUiPolishV01053=true;
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
      const name=short(p).toUpperCase();
      const logo=logoFor(p);
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
      setTimeout(repairSeasonScoreboard,0);
      setTimeout(repairSeasonScoreboard,80);
      setTimeout(repairSeasonScoreboard,220);
    }
  },true);

  const sync=()=>{renameAwards();repairSeasonScoreboard();polishFinal();};
  const observer=new MutationObserver(()=>requestAnimationFrame(sync));
  const start=()=>{observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','src']});sync();setInterval(sync,140);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
