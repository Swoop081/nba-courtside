/* NBA Starting5 v0.12.11 — played cards permanently display the exact matchup value they contributed to the scoreboard. */
(()=>{
  if(window.__starting5PlayedCardScoreLockV01211)return;
  window.__starting5PlayedCardScoreLockV01211=true;

  const LABEL_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const playerId=p=>String(p?.id||p?.playerId||'');

  function historyFor(id){
    try{
      const hist=Array.isArray(state?.history)?state.history:[];
      for(let i=hist.length-1;i>=0;i--){
        const h=hist[i];
        if(playerId(h?.user)===id)return {h,pts:Number(h.userPts)||0};
        if(playerId(h?.cpu)===id)return {h,pts:Number(h.cpuPts)||0};
      }
    }catch{}
    return null;
  }

  function lockCard(card){
    if(!card?.classList?.contains('used'))return;
    const id=String(card.dataset.id||'');
    if(!id)return;
    const found=historyFor(id);if(!found)return;
    const category=String(found.h?.category||'');
    const rows=[...card.querySelectorAll('.stats .stat')];
    let target=null;
    rows.forEach(row=>{
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=row.dataset.s5Stat||LABEL_TO_KEY[label]||'';
      row.classList.toggle('active',key===category);
      if(key===category)target=row;
    });
    const b=target?.querySelector('.stat-circle b');
    if(b)b.textContent=String(found.pts);
    card.dataset.s5PlayedCategory=category;
    card.dataset.s5PlayedPoints=String(found.pts);
  }

  function sync(){
    const game=document.querySelector('#game.active');if(!game)return;
    game.querySelectorAll('.player-card.used').forEach(lockCard);
  }
  const schedule=()=>[0,20,70,160,320].forEach(ms=>setTimeout(sync,ms));

  const wrap=name=>{
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5PlayedScoreLockV01211)return false;
    const wrapped=function(){const out=fn.apply(this,arguments);schedule();return out};
    wrapped.__s5PlayedScoreLockV01211=true;
    window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
    return true;
  };
  const install=()=>{['renderLineup','beginQuarter','playQuarter'].forEach(wrap);schedule()};
  install();setTimeout(install,0);setTimeout(install,100);setTimeout(install,300);
})();
