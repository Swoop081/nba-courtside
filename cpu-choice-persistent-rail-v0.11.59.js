/* NBA Starting5 v0.11.59 — persistent CPU choice bar + newest-first CPU played-card rail. */
(()=>{
  if(window.__starting5CpuPersistentRailV01159)return;
  window.__starting5CpuPersistentRailV01159=true;

  let picks=[];
  let pendingId='';
  let lastHistoryLength=0;
  let muting=false;

  const pid=p=>String(p?.id||p?.playerId||'');
  const findCpu=id=>{try{return (Array.isArray(cpuTeam)?cpuTeam:[]).find(p=>pid(p)===String(id))||null}catch{return null}};
  const stage=()=>document.getElementById('cpuChoiceStage');
  const ticker=()=>stage()?.querySelector('.s5-cpu-choice-ticker');
  const host=()=>stage()?.querySelector('.s5-cpu-choice-card');

  const css=document.createElement('style');
  css.id='s5-cpu-persistent-rail-v01159';
  css.textContent=`
    #cpuChoiceStage,#cpuChoiceStage.hidden{display:flex!important;width:100%!important;min-height:0!important;margin:10px 0 2px!important;flex-direction:column!important;align-items:stretch!important;gap:10px!important}
    #cpuChoiceStage .s5-cpu-choice-ticker{display:flex!important;width:100%!important;min-height:46px!important;margin:0!important;align-items:center!important;justify-content:center!important}
    #cpuChoiceStage .s5-cpu-choice-card{width:100%!important;height:auto!important;aspect-ratio:auto!important;display:flex!important;align-items:flex-start!important;justify-content:flex-start!important;gap:var(--s5-cpu-gap,10px)!important;overflow-x:auto!important;overflow-y:hidden!important;padding:0!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch}
    #cpuChoiceStage .s5-cpu-choice-card::-webkit-scrollbar{display:none!important}
    #cpuChoiceStage .s5-cpu-rail-card{flex:0 0 var(--s5-cpu-card-w,34vw)!important;width:var(--s5-cpu-card-w,34vw)!important;min-width:0!important;aspect-ratio:2.5/3.5!important;transition:opacity .2s ease,filter .2s ease,transform .2s ease}
    #cpuChoiceStage .s5-cpu-rail-card>.player-card{width:100%!important;height:100%!important;max-width:none!important;margin:0!important}
    #cpuChoiceStage .s5-cpu-rail-card .stats{display:none!important}
    #cpuChoiceStage .s5-cpu-rail-card.previous{opacity:.34!important;filter:grayscale(.45) saturate(.55)!important;pointer-events:none!important}
    #cpuChoiceStage .s5-cpu-choice-result{display:none!important}
    #cpuChoiceStage .s5-cpu-choice-card:empty{display:none!important}
  `;
  document.head.appendChild(css);

  function syncSize(){
    const h=host(),lineup=document.getElementById('lineup'),first=lineup?.querySelector('.player-card');
    if(!h||!lineup||!first)return;
    const r=first.getBoundingClientRect();
    if(r.width>0)h.style.setProperty('--s5-cpu-card-w',r.width+'px');
    const cs=getComputedStyle(lineup);let gap=parseFloat(cs.columnGap||cs.gap||'0');if(!Number.isFinite(gap))gap=10;
    h.style.setProperty('--s5-cpu-gap',gap+'px');
  }

  function markup(p,previous){
    if(!p)return '';
    const card=typeof cardMarkup==='function'?cardMarkup(p,{eager:true}):`<article class="player-card" data-id="${pid(p)}"><div class="identity"><h3>${String(p.name||'Player')}</h3></div></article>`;
    return `<div class="s5-cpu-rail-card${previous?' previous':''}" data-s5-cpu-id="${pid(p)}">${card}</div>`;
  }

  function render(){
    const s=stage(),h=host(),t=ticker();if(!s||!h||!t)return;
    syncSize();
    muting=true;
    s.classList.remove('hidden');
    s.querySelectorAll('.s5-cpu-choice-result').forEach(x=>x.remove());
    t.textContent=pendingId?'CPU CHOOSES':'WAITING FOR PLAYER CHOICE';
    h.innerHTML=picks.map((p,i)=>markup(p,!pendingId||i>0)).join('');
    h.querySelectorAll('.stats').forEach(x=>x.style.display='none');
    h.querySelectorAll('.stat-circle b').forEach(x=>x.style.visibility='hidden');
    h.scrollLeft=0;
    muting=false;
  }

  function resetIfNewGame(){
    let len=0,q=0,us=0,cs=0;try{len=state?.history?.length||0;q=Number(state?.quarter)||0;us=Number(state?.userScore)||0;cs=Number(state?.cpuScore)||0}catch{}
    if(len===0&&lastHistoryLength>0){picks=[];pendingId='';}
    if(len===0&&q<=1&&us===0&&cs===0&&lastHistoryLength===0&&!document.getElementById('game')?.classList.contains('active')){picks=[];pendingId='';}
    lastHistoryLength=len;
  }

  function captureOldHost(){
    if(muting)return;
    const h=host();if(!h)return;
    const raw=[...h.children].find(x=>x.classList?.contains('player-card'))||h.querySelector(':scope > .player-card');
    if(!raw)return;
    const id=String(raw.dataset?.id||raw.getAttribute('data-id')||'');
    const p=findCpu(id);if(!p)return;
    pendingId=id;
    picks=picks.filter(x=>pid(x)!==id);
    picks.unshift(p);
    render();
  }

  function onQuarterBegin(){
    resetIfNewGame();
    pendingId='';
    requestAnimationFrame(()=>requestAnimationFrame(render));
  }

  function wrapBegin(){
    let fn=null;try{fn=window.beginQuarter||beginQuarter}catch{}
    if(typeof fn!=='function'||fn.__s5CpuPersistentWrapped)return;
    const wrapped=function(){const r=fn.apply(this,arguments);onQuarterBegin();return r;};
    wrapped.__s5CpuPersistentWrapped=true;window.beginQuarter=wrapped;try{beginQuarter=wrapped}catch{}
  }

  function installObserver(){
    const s=stage();if(!s||s.__s5PersistentObserved)return false;s.__s5PersistentObserved=true;
    new MutationObserver(()=>{if(muting)return;captureOldHost();if(!pendingId)render();}).observe(s,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    render();return true;
  }

  function start(){
    wrapBegin();
    let n=0;const timer=setInterval(()=>{wrapBegin();if(installObserver()||++n>100)clearInterval(timer)},50);
    window.addEventListener('resize',()=>requestAnimationFrame(syncSize),{passive:true});
    new MutationObserver(()=>{wrapBegin();installObserver();resetIfNewGame();}).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
