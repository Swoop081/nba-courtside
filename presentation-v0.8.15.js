/* NBA Courtside v0.8.51 — scoreboard recovery + current-game final recap */
(() => {
  logoUrl=function(p){return `https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg`;};

  const originalResetGame=resetGame;
  const originalBeginQuarter=beginQuarter;
  let homeTeam=null,awayTeam=null;

  function teamFromCard(p){
    if(!p)return null;
    const t=TEAM_DATA[p.teamId]||['Team','#384154','#f5f7fb','#0f131b'];
    return {name:p.teamShort,full:p.team,id:p.teamId,logo:logoUrl(p),primary:t[1],secondary:t[2],dark:t[3]};
  }
  function ensureScoreboardTeams(){
    const board=document.querySelector('.scoreboard'),sides=board?.querySelectorAll('.score-side');
    if(!board||!sides||sides.length<2||!homeTeam||!awayTeam)return;
    [[sides[0],homeTeam],[sides[1],awayTeam]].forEach(([side,team])=>{
      side.style.setProperty('--score-primary',team.primary);
      side.style.setProperty('--score-secondary',team.secondary);
      side.style.setProperty('--score-dark',team.dark);
    });
    sides[0].innerHTML=`<div class="score-team"><div class="score-logo-wrap"><img src="${homeTeam.logo}" alt="${homeTeam.name}"></div><div class="score-number"><strong id="userScore">${state?.userScore||0}</strong></div><div class="score-name">${homeTeam.name.toUpperCase()}</div></div>`;
    sides[1].innerHTML=`<div class="score-team away-team"><div class="score-number"><strong id="cpuScore">${state?.cpuScore||0}</strong></div><div class="score-logo-wrap"><img src="${awayTeam.logo}" alt="${awayTeam.name}"></div><div class="score-name">${awayTeam.name.toUpperCase()}</div></div>`;
  }
  function categoryVerb(h){
    const winner=h.userPts>=h.cpuPts?h.user:h.cpu,loser=h.userPts>=h.cpuPts?h.cpu:h.user,diff=Math.abs(h.userPts-h.cpuPts);
    switch(h.category){
      case'rebounding':return`${winner.name} outrebounded ${loser.name}`;
      case'passing':return`${winner.name} found the better passing lanes against ${loser.name}`;
      case'blocks':return`${winner.name} protected the rim against ${loser.name}`;
      case'steals':return`${winner.name} stole the ball away from ${loser.name}`;
      case'dunks':return`${winner.name} dominated above the rim against ${loser.name}`;
      case'three':return`${winner.name} beat ${loser.name} from beyond the arc`;
      case'scoring':return diff<=2?`${winner.name} hit the decisive bucket over ${loser.name}`:`${winner.name} took over as a scorer against ${loser.name}`;
      default:return`${winner.name} won the matchup against ${loser.name}`;
    }
  }
  function finalQuarterLine(h,margin){
    const winner=h.userPts>=h.cpuPts?h.user:h.cpu,loser=h.userPts>=h.cpuPts?h.cpu:h.user;
    if(margin<=2&&h.category==='scoring')return`${winner.name} wins it at the buzzer over ${loser.name}`;
    if(h.category==='three')return margin<=3?`${winner.name} wins it from downtown against ${loser.name}`:`${winner.name} decided it from beyond the arc against ${loser.name}`;
    if(h.category==='steals')return`${winner.name} sealed it with a crucial steal from ${loser.name}`;
    if(h.category==='blocks')return`${winner.name} shut the door at the rim against ${loser.name}`;
    if(h.category==='rebounding')return`${winner.name} secured the game on the glass against ${loser.name}`;
    if(h.category==='passing')return`${winner.name} made the winning play against ${loser.name}`;
    if(h.category==='dunks')return`${winner.name} finished the game above the rim against ${loser.name}`;
    return categoryVerb(h);
  }
  function renderFinalPresentation(){
    if(!state)return;
    homeTeam=teamFromCard(userTeam[0]);
    awayTeam=teamFromCard(cpuTeam[0]);
    if(!homeTeam||!awayTeam)return;
    const userWon=state.userScore>state.cpuScore,tied=state.userScore===state.cpuScore,winner=userWon?homeTeam:awayTeam,margin=Math.abs(state.userScore-state.cpuScore),final=document.querySelector('.final-card');
    if(!final)return;
    const title=tied?'Deadlocked':`${winner.name} Win!`;
    const rows=state.history.map((h,i)=>`<div class="story-row"><span class="story-q">${h.quarter==='OT'?'OT':'Q'+h.quarter}</span><div><strong>${i===state.history.length-1?finalQuarterLine(h,margin):categoryVerb(h)}</strong><small>${STAT_LABELS[h.category]} · ${h.user.name} ${h.userPts}–${h.cpuPts} ${h.cpu.name}</small></div></div>`).join('');
    final.innerHTML=`<span class="kicker">FINAL</span><div class="final-matchup"><div class="final-team"><img src="${homeTeam.logo}" alt="${homeTeam.name}"><span>${homeTeam.name}</span><strong>${state.userScore}</strong></div><div class="final-center"><b>FINAL</b><span>—</span></div><div class="final-team"><img src="${awayTeam.logo}" alt="${awayTeam.name}"><span>${awayTeam.name}</span><strong>${state.cpuScore}</strong></div></div><h2 class="final-winner">${title}</h2><div class="story-summary">${rows}</div><button id="playAgainBtn" class="primary-btn" type="button">Play Again</button>`;
    const again=document.getElementById('playAgainBtn');
    if(again)again.onclick=()=>resetGame();
  }

  function resetActionPanel(){
    const panel=document.getElementById('revealPanel'),result=document.getElementById('quarterResult'),next=document.getElementById('nextQuarterBtn');
    if(!panel||!result||!next||typeof state==='undefined'||!state)return;
    panel.classList.remove('hidden');
    const label=STAT_LABELS[state.category]||'Player';
    result.innerHTML=`<span class="big">${state.userScore} – ${state.cpuScore}</span>${state.overtime?'Overtime':'Q'+state.quarter} · ${label}`;
    next.textContent=state.overtime?'Playing Final Card…':`Choose a ${label} Player`;
    next.disabled=true;
  }

  resetGame=function(){
    if(window.__courtsideResetLock)return;
    window.__courtsideResetLock=true;
    originalResetGame();
    state.finished=false;
    homeTeam=teamFromCard(userTeam[0]);awayTeam=teamFromCard(cpuTeam[0]);
    ensureScoreboardTeams();
    resetActionPanel();
    setTimeout(()=>{window.__courtsideResetLock=false;},300);
  };
  beginQuarter=function(){
    if(state?.finished)return;
    originalBeginQuarter();
    ensureScoreboardTeams();
    resetActionPanel();
  };
  finishGame=function(){
    if(state?.finished)return;
    state.finished=true;
    showScreen('final');
    renderFinalPresentation();
    window.scrollTo({top:0});
  };

  const originalPlayQuarter=playQuarter;
  playQuarter=function(id){if(state?.finished)return;originalPlayQuarter(id);};
  const originalNextQuarter=nextQuarter;
  nextQuarter=function(){if(state?.finished)return;originalNextQuarter();};
})();

window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
  const screen=document.getElementById('catalogue'),launch=document.getElementById('catalogueBtn'),back=document.getElementById('closeCatalogueBtn'),filter=document.getElementById('catalogueSetFilter'),browser=document.querySelector('.catalogue-team-browser'),grid=document.getElementById('catalogueGrid');
  if(!screen||!launch||!filter||!browser||!grid)return;
  const oldPrev=document.getElementById('cataloguePrevTeam'),oldNext=document.getElementById('catalogueNextTeam');
  if(oldPrev)oldPrev.replaceWith(oldPrev.cloneNode(true));if(oldNext)oldNext.replaceWith(oldNext.cloneNode(true));
  const prev=document.getElementById('cataloguePrevTeam'),next=document.getElementById('catalogueNextTeam'),logo=document.getElementById('catalogueTeamLogo'),name=document.getElementById('catalogueTeamName'),meta=document.getElementById('catalogueTeamMeta'),focus=document.querySelector('.catalogue-team-focus');
  const teams=[...new Map(players.map(p=>[p.teamId,{id:p.teamId,name:p.teamShort}])).values()].sort((a,b)=>a.name.localeCompare(b.name));
  const sets=[...new Set(players.map(p=>p.set))];let teamIndex=0,activeSet='ALL';
  let badge=focus?.querySelector('.catalogue-set-logo');if(focus&&!badge){badge=document.createElement('div');badge.className='catalogue-set-logo';focus.prepend(badge);}
  const style=document.createElement('style');style.id='courtside-catalogue-set-mode-v0846';style.textContent=`.catalogue-set-logo{display:none;width:104px;height:104px;margin:0 auto 9px;border-radius:50%;position:relative;place-items:center;background:radial-gradient(circle at 36% 28%,#fff6be 0 5%,#f7b928 6% 31%,#121821 32% 66%,#05070a 67%);border:3px solid #f7b928;box-shadow:0 0 0 3px #111821,0 10px 24px rgba(0,0,0,.48),inset 0 0 20px rgba(247,185,40,.24);text-align:center;color:#fff;line-height:.82}.catalogue-set-logo span{position:absolute;top:18px;font-size:9px;font-weight:1000;letter-spacing:.24em;color:#f7b928}.catalogue-set-logo strong{font-size:18px;letter-spacing:-.05em;font-weight:1000}.catalogue-set-logo b{position:absolute;bottom:15px;font-size:15px;color:#f7b928}.catalogue-set-logo.thunder-set-logo{background:radial-gradient(circle at 35% 25%,#fff 0 3%,#ffe853 4% 20%,#164b8f 21% 58%,#07182f 59% 100%);border-color:#ffe24f;box-shadow:0 0 0 3px #0a2142,0 10px 24px rgba(0,0,0,.55),0 0 22px rgba(73,154,255,.35)}.catalogue-set-logo.thunder-set-logo strong{font-size:14px}.catalogue-set-logo.thunder-set-logo b{font-size:10px;color:#ffe24f}.catalogue-team-browser.set-mode{grid-template-columns:1fr;padding:14px 8px 16px}.catalogue-team-browser.set-mode .catalogue-arrow,.catalogue-team-browser.set-mode .catalogue-team-logo{display:none!important}.catalogue-team-browser.set-mode .catalogue-set-logo{display:grid}.catalogue-grid.set-mode{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}`;document.head.appendChild(style);
  const setBadge=()=>{if(!badge)return;if(activeSet==='Thunder & Lightning'){badge.className='catalogue-set-logo thunder-set-logo';badge.innerHTML='<span>NBA</span><strong>THUNDER</strong><b>& LIGHTNING</b>';}else{badge.className='catalogue-set-logo';badge.innerHTML='<span>NBA</span><strong>TIP-OFF</strong><b>27</b>';}};
  const renderFilters=()=>{filter.innerHTML=['ALL',...sets].map(s=>`<button class="catalogue-set-btn ${activeSet===s?'active':''}" data-set="${s}">${s==='ALL'?'All Sets':s}</button>`).join('');filter.querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>{activeSet=b.dataset.set;renderFilters();render();});};
  const render=()=>{if(activeSet!=='ALL'){const cards=players.filter(p=>p.set===activeSet);browser.classList.add('set-mode');grid.classList.add('set-mode');if(logo)logo.style.display='none';setBadge();name.textContent=activeSet;meta.textContent=`${cards.length} CARDS · COMPLETE SET`;grid.innerHTML=cards.map(p=>cardMarkup(p,{})).join('');}else{browser.classList.remove('set-mode');grid.classList.remove('set-mode');if(logo)logo.style.display='block';const team=teams[teamIndex],cards=players.filter(p=>p.teamId===team.id);logo.src=`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`;logo.alt=team.name;name.textContent=team.name;meta.textContent=`${cards.length} ${cards.length===1?'CARD':'CARDS'} · ALL SETS`;grid.innerHTML=Array.from({length:Math.max(9,cards.length)},(_,i)=>cards[i]?cardMarkup(cards[i],{}):`<div class="catalogue-empty"><img src="https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg" alt=""></div>`).join('');}window.scrollTo({top:0});};
  prev.onclick=()=>{if(activeSet==='ALL'){teamIndex=(teamIndex-1+teams.length)%teams.length;render();}};next.onclick=()=>{if(activeSet==='ALL'){teamIndex=(teamIndex+1)%teams.length;render();}};
  const openClone=launch.cloneNode(true);launch.replaceWith(openClone);openClone.onclick=()=>{showScreen('catalogue');renderFilters();render();};
  if(back){const backClone=back.cloneNode(true);back.replaceWith(backClone);backClone.onclick=()=>{showScreen('intro');window.scrollTo({top:0});};}
  renderFilters();render();
},0));

window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
  const intro=document.getElementById('intro'),actions=intro?.querySelector('.brand-launch-actions'),oldPlay=document.getElementById('startBtn'),catalogue=document.getElementById('catalogueBtn'),topOptions=document.getElementById('optionsBtn'),topNewGame=document.getElementById('newGameBtn');
  if(!intro||!actions||!oldPlay||!catalogue)return;
  const play=oldPlay.cloneNode(true);oldPlay.replaceWith(play);play.textContent='Play';play.classList.add('main-menu-btn','main-menu-play');play.onclick=()=>resetGame();
  catalogue.classList.add('main-menu-btn');
  let menuOptions=document.getElementById('mainMenuOptionsBtn');if(!menuOptions){menuOptions=document.createElement('button');menuOptions.id='mainMenuOptionsBtn';menuOptions.type='button';menuOptions.className='catalogue-launch-btn main-menu-btn';menuOptions.textContent='Options';catalogue.insertAdjacentElement('afterend',menuOptions);}menuOptions.onclick=()=>topOptions?.click();
  if(topNewGame){topNewGame.textContent='Menu';topNewGame.onclick=()=>{showScreen('intro');window.scrollTo({top:0});};}
  const style=document.createElement('style');style.id='courtside-main-menu-v0846';style.textContent=`#intro.brand-intro{min-height:calc(100dvh - 96px);display:none;flex-direction:column;justify-content:center;padding:16px 0 28px}#intro.brand-intro.active{display:flex}#intro .brand-launch-wordmark{margin-bottom:34px}#intro .brand-launch-actions{width:min(100%,420px);margin:0 auto;display:grid!important;grid-template-columns:1fr;gap:12px}#intro .main-menu-btn{width:100%;min-height:58px;margin:0!important;border-radius:17px!important;font-size:17px!important;font-weight:1000!important;letter-spacing:.035em!important}#intro .main-menu-play{background:linear-gradient(180deg,#ffd45c,#f7b928)!important;color:#080a0d!important;border-color:#ffe287!important;box-shadow:0 12px 28px rgba(247,185,40,.18)}#intro .brand-version{margin-top:10px;text-align:center}body.courtside-main-menu .topbar{display:none!important}body.courtside-main-menu .app-shell{padding-top:max(18px,env(safe-area-inset-top))}`;document.head.appendChild(style);
  const sync=()=>document.body.classList.toggle('courtside-main-menu',intro.classList.contains('active'));sync();new MutationObserver(sync).observe(intro,{attributes:true,attributeFilter:['class']});
},0));

window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
  document.querySelectorAll('#checkUpdateBtn').forEach(el=>el.remove());
  const keep=document.getElementById('checkUpdatesBtn'),actions=document.querySelector('.brand-launch-actions');if(actions&&keep){actions.querySelectorAll('button').forEach(b=>{if(b!==keep&&b.id!=='startBtn'&&b.id!=='catalogueBtn'&&b.id!=='mainMenuOptionsBtn'&&/update/i.test(b.textContent||''))b.remove();});}
},180));