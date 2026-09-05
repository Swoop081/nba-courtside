/* NBA Courtside v0.10.43 — move active category bar below scoreboard and above cards */
(()=>{
  if(window.__courtsideCategoryPlacementV01043)return;
  window.__courtsideCategoryPlacementV01043=true;
  const place=()=>{
    const game=document.getElementById('game');
    const scoreboard=game?.querySelector('.scoreboard');
    const btn=document.getElementById('nextQuarterBtn');
    if(!game||!scoreboard||!btn)return;
    scoreboard.insertAdjacentElement('afterend',btn);
  };
  const apply=()=>requestAnimationFrame(()=>{place();requestAnimationFrame(place);});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  const oldBegin=window.beginQuarter;
  if(typeof oldBegin==='function')window.beginQuarter=function(){const r=oldBegin.apply(this,arguments);apply();return r;};
})();
