/* NBA Starting5 v0.13.0-dev.13 — presentation only, driven by canonical gameplay events. */
(()=>{
  const SEASON_ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const teamFromCard=p=>{if(!p)return null;const t=TEAM_DATA[p.teamId]||['Team','#384154','#f5f7fb','#0f131b'];return{name:p.teamShort,full:p.team,id:p.teamId,logo:`https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg`,primary:t[1],secondary:t[2],dark:t[3]}};
  const seasonActive=()=>{try{return sessionStorage.getItem(SEASON_ACTIVE_KEY)==='1'}catch{return false}};
  function ensureScoreboardTeams(){
    if(seasonActive()||!Array.isArray(userTeam)||!Array.isArray(cpuTeam)||!userTeam[0]||!cpuTeam[0])return;
    const game=document.getElementById('game');if(!game?.classList.contains('active'))return;if(game.classList.contains('s5-all-star-standard-game')||game.classList.contains('s5-rising-stars-game'))return;
    const board=game.querySelector('.scoreboard'),sides=board?.querySelectorAll('.score-side');if(!board||!sides||sides.length<2)return;const home=teamFromCard(userTeam[0]),away=teamFromCard(cpuTeam[0]);if(!home||!away)return;
    [[sides[0],home],[sides[1],away]].forEach(([side,team])=>{side.style.setProperty('--score-primary',team.primary);side.style.setProperty('--score-secondary',team.secondary);side.style.setProperty('--score-dark',team.dark)});
    sides[0].innerHTML=`<div class="score-team"><div class="score-logo-wrap"><img src="${home.logo}" alt="${home.name}"></div><div class="score-number"><strong id="userScore">${Number(state?.userScore)||0}</strong></div><div class="score-name">${home.name.toUpperCase()}</div></div>`;
    sides[1].innerHTML=`<div class="score-team away-team"><div class="score-number"><strong id="cpuScore">${Number(state?.cpuScore)||0}</strong></div><div class="score-logo-wrap"><img src="${away.logo}" alt="${away.name}"></div><div class="score-name">${away.name.toUpperCase()}</div></div>`;
  }
  function bestPlayer(){
    let best=null;
    for(const h of state?.history||[]){
      if(Number(h.userPts)===Number(h.cpuPts))continue;
      const winner=Number(h.userPts)>Number(h.cpuPts)?h.user:h.cpu;
      const margin=Math.abs((Number(h.userPts)||0)-(Number(h.cpuPts)||0));
      const score=Math.max(Number(h.userPts)||0,Number(h.cpuPts)||0);
      if(!best||margin>best.margin||(margin===best.margin&&score>best.score))best={player:winner,margin,score};
    }
    return best?.player||state?.history?.[0]?.user||userTeam?.[0]||null;
  }
  function exactPlayedCard(p){
    if(!p)return '';
    const pid=String(p.id||p.playerId||'');
    try{
      const esc=(window.CSS&&CSS.escape)?CSS.escape(pid):pid.replace(/"/g,'\\"');
      const live=document.querySelector(`#game #lineup .player-card[data-id="${esc}"]`);
      if(live){const clone=live.cloneNode(true);clone.classList.remove('used','s5-selected-card','s5-selected-choice','s5-position-locked');clone.removeAttribute('aria-disabled');return clone.outerHTML}
    }catch{}
    try{return typeof cardMarkup==='function'?cardMarkup(p,{eager:true}):''}catch{return ''}
  }
  function renderFinalPresentation(){
    const final=document.getElementById('final');if(!final?.classList.contains('active')||!state||!Array.isArray(userTeam)||!Array.isArray(cpuTeam)||!userTeam[0]||!cpuTeam[0])return;
    const game=document.getElementById('game');if(game?.classList.contains('s5-all-star-standard-game')||game?.classList.contains('s5-rising-stars-game'))return;
    const home=teamFromCard(userTeam[0]),away=teamFromCard(cpuTeam[0]);if(!home||!away)return;const tied=state.userScore===state.cpuScore,winner=state.userScore>state.cpuScore?home:away,potg=bestPlayer();
    const potgCard=exactPlayedCard(potg);
    const actionLabel=seasonActive()?'Continue':'Play Again';
    final.classList.add('compact-final-screen','s5-branded-final');
    final.innerHTML=`<section class="compact-final-card s5-branded-final-card"><div class="compact-final-kicker">FINAL</div><div class="compact-final-scoreboard"><div class="compact-final-team"><img src="${home.logo}" alt="${home.name}"><strong>${state.userScore}</strong><span>${home.name}</span></div><div class="compact-final-dash">–</div><div class="compact-final-team"><img src="${away.logo}" alt="${away.name}"><strong>${state.cpuScore}</strong><span>${away.name}</span></div></div><h2>${tied?'GAME TIED':winner.name.toUpperCase()+' WIN'}</h2><div class="potg-label">PLAYER OF THE GAME</div><div class="potg-card-wrap">${potgCard}</div><div class="potg-name">${potg?.name||''}</div><div class="compact-final-actions"><button type="button" class="primary-btn" id="playAgainBtn">${actionLabel}</button></div></section>`;
    const btn=document.getElementById('playAgainBtn');if(btn&&!seasonActive())btn.addEventListener('click',()=>resetGame(),{once:true});
  }

  ['s5:game-start','s5:matchup-start','s5:matchup-resolved','s5:overtime-start'].forEach(name=>window.addEventListener(name,()=>requestAnimationFrame(ensureScoreboardTeams)));
  window.addEventListener('s5:game-finished',renderFinalPresentation);

  window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
    const screen=document.getElementById('catalogue'),launch=document.getElementById('catalogueBtn'),back=document.getElementById('closeCatalogueBtn'),filter=document.getElementById('catalogueSetFilter'),browser=document.querySelector('.catalogue-team-browser'),grid=document.getElementById('catalogueGrid');if(!screen||!launch||!filter||!browser||!grid)return;
    const prev=document.getElementById('cataloguePrevTeam'),next=document.getElementById('catalogueNextTeam'),logo=document.getElementById('catalogueTeamLogo'),name=document.getElementById('catalogueTeamName'),meta=document.getElementById('catalogueTeamMeta');
    const teams=[...new Map(players.map(p=>[p.teamId,{id:p.teamId,name:p.teamShort}])).values()].sort((a,b)=>a.name.localeCompare(b.name));const sets=[...new Set(players.map(p=>p.set))];let teamIndex=0,activeSet='ALL';
    const renderFilters=()=>{filter.innerHTML=['ALL',...sets].map(s=>`<button class="catalogue-set-btn ${activeSet===s?'active':''}" data-set="${s}">${s==='ALL'?'All Sets':s}</button>`).join('');filter.querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>{activeSet=b.dataset.set;renderFilters();render()})};
    const render=()=>{const cards=activeSet==='ALL'?players.filter(p=>p.teamId===teams[teamIndex].id):players.filter(p=>p.set===activeSet);if(activeSet==='ALL'){const team=teams[teamIndex];if(logo){logo.style.display='block';logo.src=`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`;logo.alt=team.name}name.textContent=team.name;meta.textContent=`${cards.length} ${cards.length===1?'CARD':'CARDS'} · ALL SETS`}else{if(logo)logo.style.display='none';name.textContent=activeSet;meta.textContent=`${cards.length} CARDS · COMPLETE SET`}grid.innerHTML=cards.map(p=>cardMarkup(p,{})).join('');window.scrollTo({top:0})};
    if(prev)prev.onclick=()=>{if(activeSet==='ALL'){teamIndex=(teamIndex-1+teams.length)%teams.length;render()}};if(next)next.onclick=()=>{if(activeSet==='ALL'){teamIndex=(teamIndex+1)%teams.length;render()}};launch.onclick=()=>{showScreen('catalogue');renderFilters();render()};if(back)back.onclick=()=>{showScreen('intro');window.scrollTo({top:0})};renderFilters();render();
  },0));

  window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
    const intro=document.getElementById('intro'),actions=intro?.querySelector('.brand-launch-actions'),play=document.getElementById('startBtn'),catalogue=document.getElementById('catalogueBtn'),topOptions=document.getElementById('optionsBtn'),topNewGame=document.getElementById('newGameBtn');if(!intro||!actions||!play||!catalogue)return;
    play.textContent='Play';play.classList.add('main-menu-btn','main-menu-play');catalogue.classList.add('main-menu-btn');let menuOptions=document.getElementById('mainMenuOptionsBtn');if(!menuOptions){menuOptions=document.createElement('button');menuOptions.id='mainMenuOptionsBtn';menuOptions.type='button';menuOptions.className='catalogue-launch-btn main-menu-btn';menuOptions.textContent='Options';catalogue.insertAdjacentElement('afterend',menuOptions)}menuOptions.onclick=()=>topOptions?.click();if(topNewGame){topNewGame.textContent='Menu';topNewGame.onclick=()=>{showScreen('intro');window.scrollTo({top:0})}}
    const style=document.createElement('style');style.id='starting5-main-menu-v01300';style.textContent=`#intro.brand-intro{min-height:calc(100dvh - 96px);display:none;flex-direction:column;justify-content:center;padding:16px 0 28px}#intro.brand-intro.active{display:flex}#intro .brand-launch-wordmark{margin-bottom:34px}#intro .brand-launch-actions{width:min(100%,420px);margin:0 auto;display:grid!important;grid-template-columns:1fr;gap:12px}#intro .main-menu-btn{width:100%;min-height:58px;margin:0!important;border-radius:17px!important;font-size:17px!important;font-weight:1000!important;letter-spacing:.035em!important}#intro .main-menu-play{background:linear-gradient(180deg,#ffd45c,#f7b928)!important;color:#080a0d!important;border-color:#ffe287!important;box-shadow:0 12px 28px rgba(247,185,40,.18)}#intro .brand-version{margin-top:10px;text-align:center}body.starting5-main-menu .topbar{display:none!important}body.starting5-main-menu .app-shell{padding-top:max(18px,env(safe-area-inset-top))}#final.s5-branded-final .compact-final-actions{display:flex!important;justify-content:center!important;width:100%!important}#final.s5-branded-final .compact-final-actions #playAgainBtn{margin-left:auto!important;margin-right:auto!important}`;document.head.appendChild(style);const sync=()=>document.body.classList.toggle('starting5-main-menu',intro.classList.contains('active'));sync();new MutationObserver(sync).observe(intro,{attributes:true,attributeFilter:['class']});
  },0));
})();