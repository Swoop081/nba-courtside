/* NBA Courtside v0.10.48 — season picker polish, Awards tab, correct season scoreboard identity, Continue-to-hub final */
(()=>{
  if(window.__courtsideSeasonUiPolishV01048)return;
  window.__courtsideSeasonUiPolishV01048=true;
  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const RETURN_KEY='nbaCourtsideSeasonReturnPendingV1';

  const readSave=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const logoFor=p=>{
    try{if(typeof window.logoUrl==='function'){const u=window.logoUrl(p);if(u)return u;}}catch{}
    return p?.teamId?`https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg`:'';
  };
  const short=p=>p?.teamShort||p?.team||'Team';

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
    if(!home||!away)return;
    const sides=[...game.querySelectorAll('.score-side')];
    [home,away].forEach((p,i)=>{
      const side=sides[i];if(!side)return;
      const span=side.querySelector('span');if(span)span.textContent=short(p).replace(/^Toronto /,'').replace(/^Brooklyn /,'');
      const imgs=[...side.querySelectorAll('img')];
      imgs.forEach(img=>{const u=logoFor(p);if(u&&img.getAttribute('src')!==u)img.src=u;});
      const a=p.theme?.a||'#18202c',b=p.theme?.b||'#313b49';
      side.style.background=`linear-gradient(135deg,${a},${b})`;
      side.style.setProperty('--team-a',a);side.style.setProperty('--team-b',b);
    });
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
      setTimeout(repairSeasonScoreboard,120);
    }
  },true);

  const sync=()=>{renameAwards();repairSeasonScoreboard();polishFinal();};
  const observer=new MutationObserver(()=>requestAnimationFrame(sync));
  const start=()=>{observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','src']});sync();setInterval(sync,180);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
