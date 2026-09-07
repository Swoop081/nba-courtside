/* NBA Starting5 v0.13.0-dev.4 — category bar presentation driven by gameplay events. */
(()=>{
  if(window.__starting5CategoryBarV01304)return;
  window.__starting5CategoryBarV01304=true;
  const ensure=()=>{const game=document.getElementById('game'),scoreboard=game?.querySelector('.scoreboard');if(!game||!scoreboard)return null;let host=document.getElementById('gameCategoryBarHost');if(!host){host=document.createElement('div');host.id='gameCategoryBarHost';host.className='game-category-bar-host';scoreboard.insertAdjacentElement('afterend',host)}const btn=document.getElementById('nextQuarterBtn');if(btn&&btn.parentElement!==host)host.appendChild(btn);return host};
  const setHidden=hidden=>{const host=ensure();if(host)host.classList.toggle('hidden',!!hidden)};
  window.addEventListener('s5:game-start',()=>setHidden(false));
  window.addEventListener('s5:matchup-start',()=>setHidden(false));
  window.addEventListener('s5:matchup-resolved',()=>setHidden(true));
  window.addEventListener('s5:game-finished',()=>setHidden(true));
  const start=()=>ensure();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();