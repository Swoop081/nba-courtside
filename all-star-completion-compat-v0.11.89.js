/* NBA Starting5 v0.11.89 — normalize All-Star completion state and restore Game 42 after All-Star Weekend. */
(()=>{
  if(window.__starting5AllStarCompletionCompatV01189)return;
  window.__starting5AllStarCompletionCompatV01189=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return Number(r.w||0)+Number(r.l||0)};

  function syncCompletion(){
    const s=read();if(!s?.allStarWeekend?.allStarGame?.complete)return false;
    if(s.allStarWeekend.allStar?.complete)return true;
    const g=s.allStarWeekend.allStarGame;
    s.allStarWeekend.allStar={
      complete:true,
      winner:g.winner,
      score:g.score,
      mvp:g.mvp,
      history:g.history,
      completedAt:g.completedAt,
      engine:g.engine||'standard-starting5'
    };
    write(s);
    return true;
  }

  function refreshHub(){
    const s=read();
    if(!s||played(s)!==41||!s?.allStarWeekend?.allStarGame?.complete)return;
    syncCompletion();
    const hub=document.getElementById('seasonHub');
    if(!hub?.classList.contains('active'))return;
    const btn=document.getElementById('seasonModeBtn');
    if(btn){
      btn.click();
      return;
    }
    const card=hub.querySelector('.s5-next');
    card?.removeAttribute('data-s5-allstar-stage');
  }

  const start=()=>{syncCompletion();setTimeout(refreshHub,0)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('pageshow',()=>{syncCompletion();setTimeout(refreshHub,40)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncCompletion();setTimeout(refreshHub,40)}});
})();
