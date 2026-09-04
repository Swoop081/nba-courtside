/* NBA Courtside v0.8.3 — team scoreboard + narrative recap layer */
(() => {
  const originalResetGame = resetGame;
  const originalBeginQuarter = beginQuarter;
  const originalFinishGame = finishGame;

  let homeTeam = null;
  let awayTeam = null;

  function teamFromCard(p){
    return p ? {name:p.teamShort, full:p.team, id:p.teamId, logo:logoUrl(p)} : null;
  }

  function ensureScoreboardTeams(){
    const board=document.querySelector('.scoreboard');
    if(!board) return;
    const sides=board.querySelectorAll('.score-side');
    if(sides.length<2 || !homeTeam || !awayTeam) return;
    sides[0].innerHTML=`<div class="score-team"><img src="${homeTeam.logo}" alt="${homeTeam.name}"><div><span>YOU · ${homeTeam.name.toUpperCase()}</span><strong id="userScore">${state?.userScore||0}</strong></div></div>`;
    sides[1].innerHTML=`<div class="score-team away-team"><div><span>CPU · ${awayTeam.name.toUpperCase()}</span><strong id="cpuScore">${state?.cpuScore||0}</strong></div><img src="${awayTeam.logo}" alt="${awayTeam.name}"></div>`;
  }

  function categoryVerb(h){
    const winner=h.userPts>=h.cpuPts?h.user:h.cpu;
    const loser=h.userPts>=h.cpuPts?h.cpu:h.user;
    const diff=Math.abs(h.userPts-h.cpuPts);
    switch(h.category){
      case 'rebounding': return `${winner.name} outrebounded ${loser.name}`;
      case 'passing': return `${winner.name} controlled the game with the better passing display`;
      case 'blocks': return `${winner.name} protected the rim against ${loser.name}`;
      case 'steals': return `${winner.name} stole the ball at a crucial time`;
      case 'dunks': return `${winner.name} finished above the rim against ${loser.name}`;
      case 'three': return `${winner.name} won the quarter from beyond the arc`;
      case 'freeThrows': return `${winner.name} was steadier at the free throw line`;
      case 'scoring': return diff<=2?`${winner.name} delivered the decisive bucket`:`${winner.name} took over as a scorer`;
      default: return `${winner.name} won the matchup`;
    }
  }

  function finalQuarterLine(h,margin){
    const winner=h.userPts>=h.cpuPts?h.user:h.cpu;
    if(margin<=2 && h.category==='scoring') return `${winner.name} wins it at the buzzer`;
    if(h.category==='freeThrows') return `The game was won at the free throw line`;
    if(h.category==='three') return `The game was decided from beyond the arc`;
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
    const resultSub=tied?'Nothing separated the two sides':`${winner.name} win, ${loser.name} lose!`;
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
})();
