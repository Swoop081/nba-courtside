/* NBA Starting5 v0.11.33 — permanently remove Free Throws from matchup rotation. */
(()=>{
  if(window.__starting5MatchupCategoryHotfixV01133)return;
  window.__starting5MatchupCategoryHotfixV01133=true;
  const ALLOWED=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const LABELS={scoring:'Scoring',dunks:'Dunking',three:'3PT',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
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