/* NBA Starting5 v0.12.16 — single lightweight matchup authority. Replaces overlapping stat/score sync patches. */
(()=>{
  if(window.__starting5RuntimeAuthorityV01216)return;
  window.__starting5RuntimeAuthorityV01216=true;

  const ROW_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const idOf=p=>String(p?.id||p?.playerId||'');
  const roster=name=>{try{const r=eval(name);return Array.isArray(r)?r:[]}catch{return []}};
  const hist=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const api=()=>window.STARTING5_DYNAMIC_RATINGS;
  const inSeason=()=>{try{return !!api()?.isSeasonGameplay?.()}catch{return false}};
  const currentCategory=()=>{try{return String(state?.category||'')}catch{return ''}};
  const effective=(p,k)=>{
    if(!p||!k)return 0;
    try{if(inSeason()&&api()?.getEffectiveStat)return Number(api().getEffectiveStat(p,k))||0}catch{}
    return Number(p?.stats?.[k])||0;
  };

  function playerById(id){
    const s=String(id||'');
    return [...roster('userTeam'),...roster('cpuTeam')].find(p=>idOf(p)===s)||null;
  }

  function lastEntryFor(id,side){
    const s=String(id||''),a=hist();
    for(let i=a.length-1;i>=0;i--){
      const h=a[i],p=side==='cpu'?h?.cpu:h?.user;
      if(idOf(p)===s)return h;
    }
    return null;
  }

  function primeGameplayCategory(){
    const k=currentCategory();if(!k)return;
    if(!inSeason())return;
    for(const p of [...roster('userTeam'),...roster('cpuTeam')]){
      if(p?.stats)p.stats[k]=effective(p,k);
    }
  }

  function updateCard(card,side){
    const id=String(card?.dataset?.id||'');if(!id)return;
    const p=playerById(id);if(!p)return;
    const played=lastEntryFor(id,side);
    const activeKey=played?String(played.category||''):currentCategory();
    const pts=played?Number(side==='cpu'?played.cpuPts:played.userPts):NaN;

    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=row.dataset.s5Stat||ROW_TO_KEY[label]||'';if(!key)continue;
      row.dataset.s5Stat=key;
      row.classList.toggle('active',key===activeKey);
      const b=row.querySelector('.stat-circle b');if(!b)continue;
      if(played){if(key===activeKey&&Number.isFinite(pts))b.textContent=String(pts)}
      else b.textContent=String(effective(p,key));
    }
    card.classList.toggle('used',!!played);
  }

  function syncDisplay(){
    const game=document.querySelector('#game.active');if(!game)return;
    const history=hist();
    if(history.length){
      let u=0,c=0;
      for(const h of history){const a=Number(h?.userPts),b=Number(h?.cpuPts);if(Number.isFinite(a))u+=a;if(Number.isFinite(b))c+=b}
      try{state.userScore=u;state.cpuScore=c}catch{}
      const us=document.getElementById('userScore'),cs=document.getElementById('cpuScore');
      if(us)us.textContent=String(u);if(cs)cs.textContent=String(c);
    }
    game.querySelectorAll('#lineup .player-card[data-id]').forEach(c=>updateCard(c,'user'));
    game.querySelectorAll('.player-card[data-id]').forEach(c=>{if(!c.closest('#lineup'))updateCard(c,'cpu')});
  }

  let raf=0,timer=0;
  function scheduleSync(){
    if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{raf=0;syncDisplay()});
    clearTimeout(timer);timer=setTimeout(syncDisplay,70);
  }

  function install(){
    let pq=null;try{pq=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof pq==='function'&&!pq.__s5RuntimeAuthorityV01216){
      const base=pq;
      const wrapped=function(){
        primeGameplayCategory();
        const out=base.apply(this,arguments);
        scheduleSync();
        return out;
      };
      wrapped.__s5RuntimeAuthorityV01216=true;
      window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}
    }

    for(const name of ['beginQuarter','nextQuarter','startOvertime','renderLineup']){
      let fn=null;try{fn=window[name]||eval(name)}catch{}
      if(typeof fn!=='function'||fn.__s5RuntimeAuthorityV01216)continue;
      const base=fn;
      const wrapped=function(){const out=base.apply(this,arguments);scheduleSync();return out};
      wrapped.__s5RuntimeAuthorityV01216=true;
      window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
    }
    scheduleSync();
  }

  /* Install once after the other feature wrappers have settled. Avoid the repeated wrapper/timer cascade
     that caused long-session slowdown in v0.12.15. */
  setTimeout(install,950);
  window.addEventListener('pageshow',()=>setTimeout(()=>{install();scheduleSync()},50));
  window.STARTING5_SYNC_MATCHUP_RUNTIME=scheduleSync;
})();
