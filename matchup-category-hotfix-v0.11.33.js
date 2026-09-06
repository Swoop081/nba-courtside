/* NBA Starting5 v0.11.34 — matchup category lock + direct overtime card play. */
(()=>{
  if(window.__starting5MatchupCategoryHotfixV01134)return;
  window.__starting5MatchupCategoryHotfixV01134=true;
  const ALLOWED=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const LABELS={scoring:'Scoring',dunks:'Dunking',three:'3PT',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};

  // Register before the inspector runtime loads. In overtime every tap on the final
  // unused card is a direct play; no nameplate/enlarge/flip inspector is allowed.
  document.addEventListener('click',e=>{
    try{
      if(typeof state==='undefined'||!state?.overtime)return;
      const game=document.getElementById('game');
      if(!game?.classList.contains('active'))return;
      const card=e.target.closest('#lineup .player-card:not(.used)');
      if(!card)return;
      const rail=document.getElementById('lineup');
      if(rail?.classList.contains('result-open'))return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      playQuarter(card.dataset.id);
    }catch(err){console.warn('[Starting5 overtime direct play]',err)}
  },true);

  const start=()=>{
    try{
      window.beginQuarter=function(){
        state.category=ALLOWED[Math.floor(Math.random()*ALLOWED.length)];
        $('#quarterLabel').textContent=state.overtime?'OT':'Q'+state.quarter;
        $('#categoryLabel').textContent=LABELS[state.category].toUpperCase();
        $('#userScore').textContent=state.userScore;
        $('#cpuScore').textContent=state.cpuScore;
        $('#instruction').textContent=state.overtime?'Overtime — tap your final card when ready':('Choose one unused player for '+LABELS[state.category]);
        $('#revealPanel').classList.add('hidden');
        renderLineup();
      };
      try{beginQuarter=window.beginQuarter}catch{}
    }catch(e){console.warn('[Starting5 matchup hotfix]',e)}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();