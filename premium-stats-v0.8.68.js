/* NBA Courtside v0.8.69 — one premium stat rail at every card size */
(()=>{
  if(document.getElementById('courtside-premium-stats-v0869'))return;
  document.getElementById('courtside-premium-stats-v0868')?.remove();
  const style=document.createElement('style');
  style.id='courtside-premium-stats-v0869';
  style.textContent=`
    /* Use one proportional stat system everywhere: gameplay, catalogue and Card Art Editor. */
    .player-card .stats{
      left:2.15%!important;
      top:2.1%!important;
      bottom:12.7%!important;
      width:31.5%!important;
      gap:0!important;
    }
    .player-card .stat{gap:1.15%!important}
    .player-card .stat-circle{
      width:18.2%!important;
      height:auto!important;
      aspect-ratio:1!important;
      flex:0 0 auto!important;
      min-width:0!important;
      border:max(1px,.42cqw) solid rgba(255,225,135,.88)!important;
      background:radial-gradient(circle at 31% 23%,rgba(255,255,255,.22) 0 13%,rgba(63,68,78,.94) 31%,#171b23 56%,#080b10 79%)!important;
      box-shadow:inset 0 0 0 max(1px,.22cqw) rgba(255,255,255,.08),inset 0 -1.8cqw 2.8cqw rgba(0,0,0,.48),0 .8cqw 1.8cqw rgba(0,0,0,.68),0 0 2.3cqw rgba(232,190,72,.22)!important;
      backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    .player-card .stat-circle b{
      font-size:clamp(10px,7.15cqw,20px)!important;
      line-height:1!important;font-weight:1000!important;letter-spacing:-.035em!important;
      text-shadow:0 1px 2px rgba(0,0,0,.75)!important;
    }
    .player-card .stat-label{
      font-size:clamp(6px,4.15cqw,12px)!important;
      line-height:1!important;max-width:none!important;font-weight:1000!important;
      letter-spacing:.035em!important;color:rgba(255,255,255,.94)!important;
      text-shadow:0 1px 3px rgba(0,0,0,.92)!important;
    }
    .player-card .stat.active .stat-circle{
      background:radial-gradient(circle at 31% 22%,#fffdf0 0 10%,#ffe773 27%,#f8b928 55%,#a96700 100%)!important;
      color:#07090d!important;border-color:#fff3b0!important;
      box-shadow:inset 0 0 0 max(1px,.3cqw) rgba(255,255,255,.72),0 0 3cqw rgba(255,225,108,.9),0 0 6cqw rgba(247,185,40,.58)!important;
      transform:scale(1.08)!important;
    }
    .player-card .stat.active .stat-circle b{color:#07090d!important;text-shadow:0 1px 0 rgba(255,255,255,.45)!important}

    /* Card itself establishes the sizing context, so the exact same proportions scale cleanly. */
    .player-card{container-type:inline-size}

    /* Remove the old catalogue-only mini-stat treatment. */
    .catalogue-grid .player-card .stats{left:2.15%!important;top:2.1%!important;bottom:12.7%!important;width:31.5%!important}
    .catalogue-grid .player-card .stat{gap:1.15%!important}
    .catalogue-grid .player-card .stat-circle{width:18.2%!important;height:auto!important;aspect-ratio:1!important;flex:0 0 auto!important;border-width:max(1px,.42cqw)!important}
    .catalogue-grid .player-card .stat-circle b{font-size:clamp(8px,7.15cqw,15px)!important}
    .catalogue-grid .player-card .stat-label{font-size:clamp(5px,4.15cqw,9px)!important;max-width:none!important;letter-spacing:.035em!important}
  `;
  document.head.appendChild(style);
})();
