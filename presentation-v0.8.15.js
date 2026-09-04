/* NBA Courtside v0.8.15 — team-colour broadcast scoreboard + narrative recap layer */
(() => {
  const originalResetGame = resetGame;
  const originalBeginQuarter = beginQuarter;
  const originalFinishGame = finishGame;
  let homeTeam = null;
  let awayTeam = null;
  function teamFromCard(p){return p ? {name:p.teamShort, full:p.team, id:p.teamId, logo:logoUrl(p), primary:p.theme.a, secondary:p.theme.b, dark:p.theme.c} : null;}
  function ensureScoreboardTeams(){
    const board=document.querySelector('.scoreboard'); if(!board) return;
    const sides=board.querySelectorAll('.score-side'); if(sides.length<2 || !homeTeam || !awayTeam) return;
    [[sides[0],homeTeam],[sides[1],awayTeam]].forEach(([side,team])=>{
      side.style.setProperty('--score-primary',team.primary); side.style.setProperty('--score-secondary',team.secondary); side.style.setProperty('--score-dark',team.dark);
    });
    sides[0].innerHTML=`<div class="score-team"><div class="score-logo-wrap"><img src="${homeTeam.logo}" alt="${homeTeam.name}"></div><div class="score-number"><strong id="userScore">${state?.userScore||0}</strong></div><div class="score-name">${homeTeam.name.toUpperCase()}</div></div>`;
    sides[1].innerHTML=`<div class="score-team away-team"><div class="score-number"><strong id="cpuScore">${state?.cpuScore||0}</strong></div><div class="score-logo-wrap"><img src="${awayTeam.logo}" alt="${awayTeam.name}"></div><div class="score-name">${awayTeam.name.toUpperCase()}</div></div>`;
  }
  function categoryVerb(h){const winner=h.userPts>=h.cpuPts?h.user:h.cpu,loser=h.userPts>=h.cpuPts?h.cpu:h.user,diff=Math.abs(h.userPts-h.cpuPts);switch(h.category){case'rebounding':return`${winner.name} outrebounded ${loser.name}`;case'passing':return`${winner.name} found the better passing lanes against ${loser.name}`;case'blocks':return`${winner.name} protected the rim against ${loser.name}`;case'steals':return`${winner.name} stole the ball at a crucial time`;case'dunks':return`${winner.name} dominated above the rim against ${loser.name}`;case'three':return`${winner.name} won the battle from beyond the arc`;case'freeThrows':return`${winner.name} was steadier at the free throw line`;case'scoring':return diff<=2?`${winner.name} hit the decisive bucket`:`${winner.name} took over as a scorer`;default:return`${winner.name} won the matchup`;}}
  function finalQuarterLine(h,margin){const winner=h.userPts>=h.cpuPts?h.user:h.cpu;if(margin<=2&&h.category==='scoring')return`${winner.name} wins it at the buzzer`;if(h.category==='freeThrows')return`The game was won at the free throw line`;if(h.category==='three')return margin<=3?`${winner.name} wins it from downtown`:`The game was decided from beyond the arc`;if(h.category==='steals')return`${winner.name} sealed it with a crucial steal`;if(h.category==='blocks')return`${winner.name} shut the door at the rim`;if(h.category==='rebounding')return`${winner.name} secured the game on the glass`;if(h.category==='passing')return`${winner.name} made the winning play`;if(h.category==='dunks')return`${winner.name} finished the game above the rim`;return categoryVerb(h);}
  function renderFinalPresentation(){if(!homeTeam||!awayTeam||!state)return;const userWon=state.userScore>state.cpuScore,tied=state.userScore===state.cpuScore,winner=userWon?homeTeam:awayTeam,loser=userWon?awayTeam:homeTeam,margin=Math.abs(state.userScore-state.cpuScore),final=document.querySelector('.final-card');if(!final)return;const resultTitle=tied?'Deadlocked':`${winner.name} Win!`,resultSub=tied?'Nothing separated the two teams':`${winner.name} win, ${loser.name} lose!`,rows=state.history.map((h,i)=>{const line=i===state.history.length-1?finalQuarterLine(h,margin):categoryVerb(h);return`<div class="story-row"><span class="story-q">${h.quarter==='OT'?'OT':'Q'+h.quarter}</span><div><strong>${line}</strong><small>${STAT_LABELS[h.category]} · ${h.userPts}–${h.cpuPts}</small></div></div>`;}).join('');final.innerHTML=`<span class="kicker">FINAL</span><div class="final-matchup"><div class="final-team"><img src="${homeTeam.logo}" alt="${homeTeam.name}"><span>${homeTeam.name}</span><strong>${state.userScore}</strong></div><div class="final-center"><b>FINAL</b><span>—</span></div><div class="final-team"><img src="${awayTeam.logo}" alt="${awayTeam.name}"><span>${awayTeam.name}</span><strong>${state.cpuScore}</strong></div></div><h2 class="final-winner">${resultTitle}</h2><p class="final-subline">${resultSub}</p><div class="story-summary">${rows}</div><button id="playAgainBtn" class="primary-btn">Play Again</button>`;document.querySelector('#playAgainBtn').onclick=resetGame;}
  resetGame=function(){originalResetGame();homeTeam=teamFromCard(userTeam[0]);awayTeam=teamFromCard(cpuTeam[0]);ensureScoreboardTeams();const q=document.querySelector('#quarterLabel'),cat=document.querySelector('#categoryLabel');if(q)q.textContent=state.overtime?'OT':'Q'+state.quarter;if(cat)cat.textContent=STAT_LABELS[state.category].toUpperCase();};
  beginQuarter=function(){originalBeginQuarter();ensureScoreboardTeams();const q=document.querySelector('#quarterLabel'),cat=document.querySelector('#categoryLabel');if(q)q.textContent=state.overtime?'OT':'Q'+state.quarter;if(cat)cat.textContent=STAT_LABELS[state.category].toUpperCase();};
  finishGame=function(){originalFinishGame();renderFinalPresentation();};
  const start=document.querySelector('#startBtn'),replay=document.querySelector('#playAgainBtn');if(start)start.onclick=resetGame;if(replay)replay.onclick=resetGame;

  const CURRENT_BUILD='0.8.36';
  function installUpdateButton(){
    const host=document.querySelector('.brand-launch-actions')||document.querySelector('.topbar');
    if(!host||document.querySelector('#checkUpdateBtn'))return;
    const btn=document.createElement('button');
    btn.id='checkUpdateBtn';
    btn.className='ghost-btn';
    btn.textContent='Check for Updates';
    btn.addEventListener('click',async()=>{
      const original=btn.textContent;
      btn.disabled=true;btn.textContent='Checking GitHub…';
      try{
        const url='https://raw.githubusercontent.com/Swoop081/nba-courtside/main/build.json?t='+Date.now();
        const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('update check failed');
        const build=await r.json();
        if(build.version&&build.version!==CURRENT_BUILD){
          btn.textContent='Update '+build.version;
          setTimeout(()=>location.replace('./?update='+encodeURIComponent(build.version)+'&t='+Date.now()),250);
        }else{
          btn.textContent='Up to Date · v'+CURRENT_BUILD;
          setTimeout(()=>{btn.textContent=original;btn.disabled=false},1800);
        }
      }catch(e){
        btn.textContent='Try Again';btn.disabled=false;
      }
    });
    host.appendChild(btn);
  }
  installUpdateButton();
})();

/* v0.8.36 — catalogue mode correction: selected set = whole set; All Sets = team browser. */
window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
  const screen=document.getElementById('catalogue'),launch=document.getElementById('catalogueBtn'),back=document.getElementById('closeCatalogueBtn'),filter=document.getElementById('catalogueSetFilter'),browser=document.querySelector('.catalogue-team-browser'),grid=document.getElementById('catalogueGrid');
  if(!screen||!launch||!filter||!browser||!grid)return;
  const oldPrev=document.getElementById('cataloguePrevTeam'),oldNext=document.getElementById('catalogueNextTeam');
  if(oldPrev)oldPrev.replaceWith(oldPrev.cloneNode(true));
  if(oldNext)oldNext.replaceWith(oldNext.cloneNode(true));
  const prev=document.getElementById('cataloguePrevTeam'),next=document.getElementById('catalogueNextTeam');
  const logo=document.getElementById('catalogueTeamLogo'),name=document.getElementById('catalogueTeamName'),meta=document.getElementById('catalogueTeamMeta'),focus=document.querySelector('.catalogue-team-focus');
  const teams=[...new Map(players.map(p=>[p.teamId,{id:p.teamId,name:p.teamShort}])).values()].sort((a,b)=>a.name.localeCompare(b.name));
  const sets=[...new Set(players.map(p=>p.set))];
  let teamIndex=0,activeSet='ALL';
  let badge=focus.querySelector('.catalogue-set-logo');
  if(!badge){badge=document.createElement('div');badge.className='catalogue-set-logo';badge.innerHTML='<span>NBA</span><strong>TIP-OFF</strong><b>27</b>';focus.prepend(badge);}
  const style=document.createElement('style');
  style.textContent=`
    .catalogue-set-logo{display:none;width:104px;height:104px;margin:0 auto 9px;border-radius:50%;position:relative;place-items:center;background:radial-gradient(circle at 36% 28%,#fff6be 0 5%,#f7b928 6% 31%,#121821 32% 66%,#05070a 67%);border:3px solid #f7b928;box-shadow:0 0 0 3px #111821,0 10px 24px rgba(0,0,0,.48),inset 0 0 20px rgba(247,185,40,.24);text-align:center;color:#fff;line-height:.82}
    .catalogue-set-logo span{position:absolute;top:18px;font-size:9px;font-weight:1000;letter-spacing:.24em;color:#f7b928}
    .catalogue-set-logo strong{font-size:18px;letter-spacing:-.05em;font-weight:1000}
    .catalogue-set-logo b{position:absolute;bottom:15px;font-size:15px;color:#f7b928}
    .catalogue-team-browser.set-mode{grid-template-columns:1fr;padding:14px 8px 16px}
    .catalogue-team-browser.set-mode .catalogue-arrow,.catalogue-team-browser.set-mode .catalogue-team-logo{display:none!important}
    .catalogue-team-browser.set-mode .catalogue-set-logo{display:grid}
    .catalogue-grid.set-mode{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
  `;
  document.head.appendChild(style);
  function renderFilters(){filter.innerHTML=['ALL',...sets].map(s=>`<button class="catalogue-set-btn ${activeSet===s?'active':''}" data-set="${s}">${s==='ALL'?'All Sets':s}</button>`).join('');filter.querySelectorAll('[data-set]').forEach(b=>b.addEventListener('click',()=>{activeSet=b.dataset.set;renderFilters();render();}));}
  function render(){
    if(activeSet!=='ALL'){
      const cards=players.filter(p=>p.set===activeSet);
      browser.classList.add('set-mode');grid.classList.add('set-mode');
      if(logo)logo.style.display='none';
      name.textContent=activeSet;
      meta.textContent=`${cards.length} CARDS · COMPLETE SET`;
      grid.innerHTML=cards.map(p=>cardMarkup(p,{})).join('');
    }else{
      browser.classList.remove('set-mode');grid.classList.remove('set-mode');
      if(logo)logo.style.display='block';
      const team=teams[teamIndex],cards=players.filter(p=>p.teamId===team.id);
      logo.src=`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`;logo.alt=team.name;name.textContent=team.name;meta.textContent=`${cards.length} ${cards.length===1?'CARD':'CARDS'} · ALL SETS`;
      const slots=Math.max(9,cards.length);
      grid.innerHTML=Array.from({length:slots},(_,i)=>cards[i]?cardMarkup(cards[i],{}):`<div class="catalogue-empty"><img src="https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg" alt=""></div>`).join('');
    }
    window.scrollTo({top:0});
  }
  prev?.addEventListener('click',()=>{if(activeSet!=='ALL')return;teamIndex=(teamIndex-1+teams.length)%teams.length;render();});
  next?.addEventListener('click',()=>{if(activeSet!=='ALL')return;teamIndex=(teamIndex+1)%teams.length;render();});
  const openClone=launch.cloneNode(true);launch.replaceWith(openClone);openClone.addEventListener('click',()=>{showScreen('catalogue');renderFilters();render();window.scrollTo({top:0});});
  if(back){const backClone=back.cloneNode(true);back.replaceWith(backClone);backClone.addEventListener('click',()=>{showScreen('intro');window.scrollTo({top:0});});}
  renderFilters();render();
},0));
