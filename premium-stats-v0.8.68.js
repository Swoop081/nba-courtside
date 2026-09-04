/* NBA Courtside v0.8.74 — full-size premium stat rail + larger abbreviations */
(()=>{
  document.getElementById('courtside-premium-stats-v0869')?.remove();
  document.getElementById('courtside-premium-stats-v0873')?.remove();
  document.getElementById('courtside-premium-stats-v0874')?.remove();
  const style=document.createElement('style');
  style.id='courtside-premium-stats-v0874';
  style.textContent=`
    .player-card .stats{left:4px!important;width:68px!important;top:7px!important;gap:0!important}
    .player-card .stat{gap:2px!important}
    .player-card .stat-circle{
      width:30px!important;height:30px!important;flex:0 0 30px!important;aspect-ratio:1!important;
      border:1.5px solid rgba(255,225,135,.88)!important;
      background:radial-gradient(circle at 31% 23%,rgba(255,255,255,.22) 0 13%,rgba(63,68,78,.94) 31%,#171b23 56%,#080b10 79%)!important;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),inset 0 -5px 8px rgba(0,0,0,.48),0 2px 5px rgba(0,0,0,.68),0 0 7px rgba(232,190,72,.22)!important;
      backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    .player-card .stat-circle b{font-size:12px!important;line-height:1!important;font-weight:1000!important;letter-spacing:-.035em!important;text-shadow:0 1px 2px rgba(0,0,0,.75)!important}
    .player-card .stat-label{font-size:8.5px!important;line-height:1!important;max-width:34px!important;font-weight:1000!important;letter-spacing:.025em!important;color:rgba(255,255,255,.98)!important;text-shadow:0 1px 3px rgba(0,0,0,.92)!important}
    .player-card .stat.active .stat-circle{background:radial-gradient(circle at 31% 22%,#fffdf0 0 10%,#ffe773 27%,#f8b928 55%,#a96700 100%)!important;color:#07090d!important;border-color:#fff3b0!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.72),0 0 9px rgba(255,225,108,.9),0 0 18px rgba(247,185,40,.58)!important;transform:scale(1.08)!important}
    .player-card .stat.active .stat-circle b{color:#07090d!important;text-shadow:0 1px 0 rgba(255,255,255,.45)!important}
    .catalogue-grid .player-card .stats{left:3px!important;top:4px!important;bottom:35px!important;width:57px!important}
    .catalogue-grid .player-card .stat{gap:1px!important}
    .catalogue-grid .player-card .stat-circle{width:24px!important;height:24px!important;flex:0 0 24px!important;border-width:1px!important}
    .catalogue-grid .player-card .stat-circle b{font-size:9.7px!important}
    .catalogue-grid .player-card .stat-label{font-size:6.5px!important;max-width:28px!important;letter-spacing:.02em!important}
  `;
  document.head.appendChild(style);
})();
