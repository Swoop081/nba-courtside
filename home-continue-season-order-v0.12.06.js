/* NBA Starting5 v0.13.0-dev.5 — place Continue Season directly under Play without observers. */
(()=>{
  if(window.__starting5HomeContinueOrderV01305)return;
  window.__starting5HomeContinueOrderV01305=true;

  function move(){
    const intro=document.getElementById('intro'),play=document.getElementById('startBtn'),season=document.getElementById('seasonModeBtn');
    if(!intro||!play||!season)return;
    if(play.nextElementSibling!==season)play.insertAdjacentElement('afterend',season);
    season.style.setProperty('width','100%','important');
    season.style.setProperty('margin-top','8px','important');
    season.style.setProperty('margin-bottom','0','important');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(move),{once:true});else requestAnimationFrame(move);
  document.addEventListener('click',e=>{if(e.target.closest('#seasonModeBtn,#newGameBtn,#compactMenu'))requestAnimationFrame(move)},false);
})();