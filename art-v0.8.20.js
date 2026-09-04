/* NBA Courtside v0.8.31 — seven-stat spacing + local Tip-Off 27 artwork authority */
const artUrlBeforeV088=artUrl;
artUrl=function(p){
  return `assets/player-art/${p.artSlug}.png?v=0.8.31`;
};

/* Free Throws retired: gameplay now draws from seven categories only. */
const COURTSIDE_STAT_KEYS_7=['scoring','dunks','three','rebounding','passing','blocks','steals'];
beginQuarter=function(){
  state.category=COURTSIDE_STAT_KEYS_7[Math.floor(Math.random()*COURTSIDE_STAT_KEYS_7.length)];
  $('#quarterLabel').textContent=state.overtime?'OT':'Q'+state.quarter;
  $('#categoryLabel').textContent=STAT_LABELS[state.category].toUpperCase();
  $('#userScore').textContent=state.userScore;
  $('#cpuScore').textContent=state.cpuScore;
  $('#instruction').textContent=state.overtime?'Overtime — your final player is in':('Choose one unused player for '+STAT_LABELS[state.category]);
  $('#revealPanel').classList.add('hidden');
  renderLineup();
  if(state.overtime){
    const uP=userTeam.find(p=>!state.usedUser.has(p.id));
    if(uP)setTimeout(()=>playQuarter(uP.id),350);
  }
};

/* Exactly seven equal-height stat rows from the top of the rail to the bottom. */
(function applySevenStatCardLayout(){
  const style=document.createElement('style');
  style.id='courtside-seven-stat-layout';
  style.textContent=`
    .player-card .stats .stat:nth-child(4){display:none!important}
    .player-card .stats{
      display:grid!important;
      grid-template-rows:repeat(7,minmax(0,1fr))!important;
      align-items:center!important;
      justify-content:stretch!important;
      gap:0!important;
    }
    .player-card .stats .stat{
      min-height:0!important;
      align-self:center!important;
    }
  `;
  document.head.appendChild(style);
})();

if(typeof renderStarterFive==='function') renderStarterFive();
