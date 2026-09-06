/* NBA Starting5 v0.10.86 — progression-first Season Mode + compact results + reset protection */
(()=>{
  if(window.__starting5SeasonProgressionV01086)return;
  window.__starting5SeasonProgressionV01086=true;
  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const style=document.createElement('style');
  style.textContent=`
    #final.screen{min-height:0!important;padding-bottom:calc(10px + env(safe-area-inset-bottom))!important}
    #final .final-score{margin-top:4px!important;margin-bottom:5px!important}
    #final .final-score strong{font-size:42px!important;line-height:.9!important}
    #final #finalResult{margin:4px 0 6px!important}
    #final .final-mvp,#final .player-of-game{margin-top:4px!important;margin-bottom:5px!important}
    #final .foundation-card,#final .player-card{transform:scale(.78);transform-origin:top center;margin-bottom:-70px!important}
    #final .actions,#final .final-actions{margin-top:6px!important}
    .season-date{display:none!important}
    .season-danger[data-season-new],button[data-new-season]{display:none!important}
    .season-note{display:none!important}
  `;
  document.head.appendChild(style);

  const progress=()=>{
    const s=read();if(!s||!Array.isArray(s.schedule))return;
    const userGames=s.schedule.filter(g=>g.home===s.teamId||g.away===s.teamId);
    const played=userGames.filter(g=>s.results&&s.results[g.id]).length;
    const next=userGames.find(g=>!(s.results&&s.results[g.id]));
    const label=document.querySelector('.season-next-label');
    if(label){
      if(s.phase==='regular')label.textContent=next?`GAME ${Math.min(played+1,82)} OF 82`:'REGULAR SEASON COMPLETE';
      else label.textContent='PLAYOFF PROGRESSION';
    }
    const heroLabels=document.querySelectorAll('.season-progress-label span');
    if(heroLabels[0])heroLabels[0].textContent=`${played} GAMES PLAYED`;
    if(heroLabels[1])heroLabels[1].textContent=s.phase==='regular'?`${Math.max(0,82-played)} REMAINING`:'PLAYOFFS';
    const play=document.querySelector('[data-play-season]');
    if(play&&s.phase==='regular')play.textContent=next?`Play Game ${Math.min(played+1,82)}`:'Continue to Playoffs';
    document.querySelectorAll('[data-new-season]').forEach(b=>{b.style.display=s.completed?'':'none'});
  };

  const mo=new MutationObserver(()=>requestAnimationFrame(progress));
  const start=()=>{progress();mo.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('click',e=>{
      if(e.target?.closest?.('#playAgainBtn'))setTimeout(progress,0);
    },true);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
