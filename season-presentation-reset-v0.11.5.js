/* NBA Starting5 v0.13.0-dev.4 — Season presentation state only. No gameplay/final DOM resets. */
(()=>{
  if(window.__starting5SeasonPresentationResetV01304)return;
  window.__starting5SeasonPresentationResetV01304=true;
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const active=()=>{try{return sessionStorage.getItem(ACTIVE_KEY)==='1'}catch{return false}};
  const sync=()=>document.body.classList.toggle('s5-season-game-active',active()&&!!document.getElementById('game')?.classList.contains('active'));
  window.addEventListener('s5:game-start',()=>requestAnimationFrame(sync));
  window.addEventListener('s5:game-finished',()=>requestAnimationFrame(sync));
  window.addEventListener('s5:season-continue-request',()=>requestAnimationFrame(()=>document.body.classList.remove('s5-season-game-active')));
  document.addEventListener('click',e=>{if(e.target.closest('#seasonHub [data-season-home],#newGameBtn'))document.body.classList.remove('s5-season-game-active')},true);
  const start=()=>sync();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();