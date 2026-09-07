/* NBA Starting5 v0.13.0 — category bar presentation only. */
(()=>{
  if(window.__starting5CategoryBarV01300)return;
  window.__starting5CategoryBarV01300=true;
  const ensure=()=>{
    const game=document.getElementById('game'),scoreboard=game?.querySelector('.scoreboard');if(!game||!scoreboard)return null;
    let host=document.getElementById('gameCategoryBarHost');if(!host){host=document.createElement('div');host.id='gameCategoryBarHost';host.className='game-category-bar-host';scoreboard.insertAdjacentElement('afterend',host)}
    const btn=document.getElementById('nextQuarterBtn');if(btn&&btn.parentElement!==host)host.appendChild(btn);return host;
  };
  const sync=()=>{const host=ensure(),btn=document.getElementById('nextQuarterBtn');if(!host||!btn)return;host.classList.toggle('hidden',getComputedStyle(btn).display==='none')};
  const start=()=>{ensure();sync();const btn=document.getElementById('nextQuarterBtn');if(btn)new MutationObserver(sync).observe(btn,{attributes:true,attributeFilter:['style','class','disabled'],childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();