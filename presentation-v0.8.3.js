/* NBA Courtside v0.8.14 — team-colour broadcast scoreboard + narrative recap layer */
(() => {
  const originalResetGame = resetGame;
  const originalBeginQuarter = beginQuarter;
  const originalFinishGame = finishGame;

  let homeTeam = null;
  let awayTeam = null;

  function teamFromCard(p){
    return p ? {name:p.teamShort, full:p.team, id:p.teamId, logo:logoUrl(p), primary:p.theme.a, secondary:p.theme.b, dark:p.theme.c} : null;
  }

  function ensureScoreboardTeams(){
    const board=document.querySelector('.scoreboard');
    if(!board) return;
    const sides=board.querySelectorAll('.score-side');
    if(sides.length<2 || !homeTeam || !awayTeam) return;
    sides[0].style.setProperty('--score-primary',homeTeam.primary);
    sides[0].style.setProperty('--score-secondary',homeTeam.secondary);
    sides[0].style.setProperty('--score-dark',homeTeam.dark);
    sides[1].style.setProperty('--score-primary',awayTeam.primary);
    sides[1].style.setProperty('--score-secondary',awayTeam.secondary);
    sides[1].style.setProperty('--score-dark',awayTeam.dark);
    sides[0].innerHTML=`<div class="score-team"><div class="score-logo-wrap"><img src="${homeTeam.logo}" alt="${homeTeam.name}"></div><div class="score-number"><strong id="userScore">${state?.userScore||0}</strong></div><div class="score-name">${homeTeam.name.toUpperCase()}</div></div>`;
    sides[1].innerHTML=`<div class="score-team away-team"><div class="score-number"><strong id="cpuScore">${state?.cpuScore||0}</strong></div><div class="score-logo-wrap"><img src="${awayTeam.logo}" alt="${awayTeam.name}"></div><div class="score-name">${awayTeam.name.toUpperCase()}</div></div>`;
  }

  function categoryVerb(h){
    const winner=h.userPts>=h.cpuPts?h.user:h.cpu;
    const loser=h.userPts>=h.cpuPts?h.cpu:h.user;
    const diff=Math.abs(h.userPts-h.cpuPts);
    switch(h.category){
      case 'rebounding': return `${winner.name} outrebounded ${loser.name}`;
      case 'passing': return `${winner.name} found the better passing lanes against ${loser.name}`;
      case 'blocks': return `${winner.name} protected the rim against ${loser.name}`;
      case 'steals': return `${winner.name} stole the ball at a crucial time`;
      case 'dunks': return `${winner.name} dominated above the rim against ${loser.name}`;
      case 'three': return `${winner.name} won the battle from beyond the arc`;
      case 'freeThrows': return `${winner.name} was steadier at the free throw line`;
      case 'scoring': return diff<=2?`${winner.name} hit the decisive bucket`:`${winner.name} took over as a scorer`;
      default: return `${winner.name} won the matchup`;
    }
  }

  function finalQuarterLine(h,margin){
    const winner=h.userPts>=h.cpuPts?h.user:h.cpu;
    if(margin<=2 && h.category==='scoring') return `${winner.name} wins it at the buzzer`;
    if(h.category==='freeThrows') return `The game was won at the free throw line`;
    if(h.category==='three') return margin<=3?`${winner.name} wins it from downtown`:`The game was decided from beyond the arc`;
    if(h.category==='steals') return `${winner.name} sealed it with a crucial steal`;
    if(h.category==='blocks') return `${winner.name} shut the door at the rim`;
    if(h.category==='rebounding') return `${winner.name} secured the game on the glass`;
    if(h.category==='passing') return `${winner.name} made the winning play`;
    if(h.category==='dunks') return `${winner.name} finished the game above the rim`;
    return categoryVerb(h);
  }

  function renderFinalPresentation(){
    if(!homeTeam || !awayTeam || !state) return;
    const userWon=state.userScore>state.cpuScore;
    const tied=state.userScore===state.cpuScore;
    const winner=userWon?homeTeam:awayTeam;
    const loser=userWon?awayTeam:homeTeam;
    const margin=Math.abs(state.userScore-state.cpuScore);
    const final=document.querySelector('.final-card');
    if(!final) return;

    const resultTitle=tied?'Deadlocked':`${winner.name} Win!`;
    const resultSub=tied?'Nothing separated the two teams':`${winner.name} win, ${loser.name} lose!`;
    const rows=state.history.map((h,i)=>{
      const line=i===state.history.length-1?finalQuarterLine(h,margin):categoryVerb(h);
      return `<div class="story-row"><span class="story-q">Q${h.quarter}</span><div><strong>${line}</strong><small>${STAT_LABELS[h.category]} · ${h.userPts}–${h.cpuPts}</small></div></div>`;
    }).join('');

    final.innerHTML=`
      <span class="kicker">FINAL</span>
      <div class="final-matchup">
        <div class="final-team"><img src="${homeTeam.logo}" alt="${homeTeam.name}"><span>${homeTeam.name}</span><strong>${state.userScore}</strong></div>
        <div class="final-center"><b>FINAL</b><span>—</span></div>
        <div class="final-team"><img src="${awayTeam.logo}" alt="${awayTeam.name}"><span>${awayTeam.name}</span><strong>${state.cpuScore}</strong></div>
      </div>
      <h2 class="final-winner">${resultTitle}</h2>
      <p class="final-subline">${resultSub}</p>
      <div class="story-summary">${rows}</div>
      <button id="playAgainBtn" class="primary-btn">Play Again</button>`;
    document.querySelector('#playAgainBtn').onclick=resetGame;
  }

  resetGame=function(){
    originalResetGame();
    homeTeam=teamFromCard(userTeam[0]);
    awayTeam=teamFromCard(cpuTeam[0]);
    ensureScoreboardTeams();
    const q=document.querySelector('#quarterLabel');
    const cat=document.querySelector('#categoryLabel');
    if(q) q.textContent='Q'+state.quarter;
    if(cat) cat.textContent=STAT_LABELS[state.category].toUpperCase();
  };

  beginQuarter=function(){
    originalBeginQuarter();
    ensureScoreboardTeams();
    const q=document.querySelector('#quarterLabel');
    const cat=document.querySelector('#categoryLabel');
    if(q) q.textContent='Q'+state.quarter;
    if(cat) cat.textContent=STAT_LABELS[state.category].toUpperCase();
  };

  finishGame=function(){
    originalFinishGame();
    renderFinalPresentation();
  };

  const start=document.querySelector('#startBtn');
  const replay=document.querySelector('#playAgainBtn');
  if(start) start.onclick=resetGame;
  if(replay) replay.onclick=resetGame;
})();
