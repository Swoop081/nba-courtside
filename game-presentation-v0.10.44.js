/* NBA Courtside v0.10.44 — category bar directly below scoreboard */
(()=>{
  if(window.__courtsideGamePresentationV01044)return;
  window.__courtsideGamePresentationV01044=true;

  const ensureCategoryHost=()=>{
    const game=document.getElementById('game');
    const scoreboard=game?.querySelector('.scoreboard');
    if(!game||!scoreboard)return null;
    let host=document.getElementById('gameCategoryBarHost');
    if(!host){
      host=document.createElement('div');
      host.id='gameCategoryBarHost';
      host.className='game-category-bar-host';
      scoreboard.insertAdjacentElement('afterend',host);
    }
    const btn=document.getElementById('nextQuarterBtn');
    if(btn&&btn.parentElement!==host)host.appendChild(btn);
    return host;
  };

  const sync=()=>{
    const host=ensureCategoryHost();
    const btn=document.getElementById('nextQuarterBtn');
    if(!host||!btn)return;
    const visible=getComputedStyle(btn).display!=='none';
    host.classList.toggle('hidden',!visible);
  };

  const wrap=name=>{
    const original=window[name];
    if(typeof original!=='function'||original.__categoryBarWrapped)return;
    const wrapped=function(){
      const out=original.apply(this,arguments);
      requestAnimationFrame(()=>{ensureCategoryHost();sync();});
      setTimeout(sync,0);
      return out;
    };
    wrapped.__categoryBarWrapped=true;
    window[name]=wrapped;
    try{eval(`${name}=window[name]`);}catch{}
  };

  const start=()=>{
    ensureCategoryHost();sync();
    ['beginQuarter','playQuarter','resetGame'].forEach(wrap);
    new MutationObserver(()=>sync()).observe(document.body,{subtree:true,attributes:true,attributeFilter:['style','class']});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
