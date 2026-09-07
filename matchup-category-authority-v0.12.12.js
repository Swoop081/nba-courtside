/* NBA Starting5 v0.12.12 — authoritative current-category card sync. Unused cards always show the current matchup stat; played cards stay locked to the exact scoreboard contribution. */
(()=>{
  if(window.__starting5MatchupCategoryAuthorityV01212)return;
  window.__starting5MatchupCategoryAuthorityV01212=true;

  const LABEL_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const pid=p=>String(p?.id||p?.playerId||'');
  const currentCategory=()=>{try{return String(state?.category||'')}catch{return ''}};
  const effective=(p,k)=>{
    const api=window.STARTING5_DYNAMIC_RATINGS;
    try{
      if(api&&typeof api.isSeasonGameplay==='function'&&api.isSeasonGameplay()&&typeof api.getEffectiveStat==='function')return Number(api.getEffectiveStat(p,k))||0;
    }catch{}
    return Number(p?.stats?.[k]??0)||0;
  };
  const roster=(name)=>{try{return Array.isArray(eval(name))?eval(name):[]}catch{return []}};
  const playerById=id=>[...roster('userTeam'),...roster('cpuTeam')].find(p=>pid(p)===id)||null;
  const historyFor=id=>{
    try{
      const hist=Array.isArray(state?.history)?state.history:[];
      for(let i=hist.length-1;i>=0;i--){
        const h=hist[i];
        if(pid(h?.user)===id)return {category:String(h.category||''),pts:Number(h.userPts)||0,side:'user'};
        if(pid(h?.cpu)===id)return {category:String(h.category||''),pts:Number(h.cpuPts)||0,side:'cpu'};
      }
    }catch{}
    return null;
  };
  const isUsed=(id,side)=>{
    try{
      if(side==='user')return !!state?.usedUser?.has?.(id);
      if(side==='cpu')return !!state?.usedCpu?.has?.(id);
      return !!state?.usedUser?.has?.(id)||!!state?.usedCpu?.has?.(id);
    }catch{return false}
  };

  function syncCard(card){
    const id=String(card?.dataset?.id||'');if(!id)return;
    const p=playerById(id);if(!p)return;
    const inUserRail=!!card.closest('#lineup');
    const side=inUserRail?'user':(roster('cpuTeam').some(x=>pid(x)===id)?'cpu':'');
    const used=card.classList.contains('used')||isUsed(id,side);
    const played=used?historyFor(id):null;
    const activeKey=played?.category||currentCategory();

    card.classList.toggle('used',used);
    const rows=[...card.querySelectorAll('.stats .stat')];
    rows.forEach(row=>{
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=row.dataset.s5Stat||LABEL_TO_KEY[label]||'';if(!key)return;
      row.dataset.s5Stat=key;
      row.classList.toggle('active',key===activeKey);
      const b=row.querySelector('.stat-circle b');if(!b)return;
      if(played&&key===played.category)b.textContent=String(played.pts);
      else if(!played)b.textContent=String(effective(p,key));
    });
    if(played){card.dataset.s5PlayedCategory=played.category;card.dataset.s5PlayedPoints=String(played.pts)}
  }

  function syncAll(){
    const game=document.querySelector('#game.active');if(!game)return;
    game.querySelectorAll('.player-card[data-id]').forEach(syncCard);
  }
  const schedule=()=>[0,16,45,100,220].forEach(ms=>setTimeout(syncAll,ms));

  function wrap(name){
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5CategoryAuthorityV01212)return false;
    const wrapped=function(){const out=fn.apply(this,arguments);schedule();return out};
    wrapped.__s5CategoryAuthorityV01212=true;
    window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
    return true;
  }
  const install=()=>{['renderLineup','beginQuarter','playQuarter'].forEach(wrap);schedule()};
  install();setTimeout(install,0);setTimeout(install,120);setTimeout(install,350);
  window.STARTING5_SYNC_MATCHUP_CATEGORY=syncAll;
})();
