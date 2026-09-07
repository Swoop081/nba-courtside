/* NBA Starting5 v0.12.19 — single authoritative live-match resolver.
   CPU always chooses the highest EFFECTIVE current-category rating among unused cards.
   The exact effective values are then written to history, score and played-card display. */
(()=>{
  if(window.__starting5RuntimeAuthorityV01219)return;
  window.__starting5RuntimeAuthorityV01219=true;

  const ROW_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const idOf=p=>String(p?.id||p?.playerId||'');
  const getRoster=name=>{try{const r=eval(name);return Array.isArray(r)?r:[]}catch{return []}};
  const getHistory=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const isSeason=()=>{try{return !!dyn()?.isSeasonGameplay?.()}catch{return false}};
  const cat=()=>{try{return String(state?.category||'')}catch{return ''}};
  const effective=(p,k)=>{
    if(!p||!k)return 0;
    try{if(isSeason()&&dyn()?.getEffectiveStat)return Number(dyn().getEffectiveStat(p,k))||0}catch{}
    return Number(p?.stats?.[k]??0)||0;
  };
  const usedCpu=id=>{try{return !!state?.usedCpu?.has?.(id)}catch{return false}};
  const allPlayers=()=>[...getRoster('userTeam'),...getRoster('cpuTeam')];

  function authoritativeCpuPick(){
    const k=cat();
    const available=getRoster('cpuTeam').filter(p=>!usedCpu(p.id));
    if(!available.length)return null;
    let best=available[0],bestValue=effective(best,k);
    for(let i=1;i<available.length;i++){
      const p=available[i],v=effective(p,k);
      if(v>bestValue){best=p;bestValue=v}
    }
    return best;
  }

  function installCpuPicker(){
    const picker=function(){return authoritativeCpuPick()};
    picker.__s5CpuAuthorityV01219=true;
    window.pickCpu=picker;
    try{eval('pickCpu=window.pickCpu')}catch{}
  }

  function totalsFromHistory(){
    let user=0,cpu=0;
    for(const h of getHistory()){
      const u=Number(h?.userPts),c=Number(h?.cpuPts);
      if(Number.isFinite(u))user+=u;
      if(Number.isFinite(c))cpu+=c;
    }
    try{state.userScore=user;state.cpuScore=cpu}catch{}
    const ue=document.getElementById('userScore'),ce=document.getElementById('cpuScore');
    if(ue)ue.textContent=String(user);if(ce)ce.textContent=String(cpu);
  }

  function playerById(id){const s=String(id||'');return allPlayers().find(p=>idOf(p)===s)||null}
  function playedFor(id,side){
    const s=String(id||''),a=getHistory();
    for(let i=a.length-1;i>=0;i--){const h=a[i],p=side==='cpu'?h?.cpu:h?.user;if(idOf(p)===s)return h}
    return null;
  }
  function syncCard(card,side){
    const id=String(card?.dataset?.id||'');if(!id)return;
    const p=playerById(id);if(!p)return;
    const h=playedFor(id,side),active=h?String(h.category||''):cat();
    const playedValue=h?Number(side==='cpu'?h.cpuPts:h.userPts):NaN;
    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=row.dataset.s5Stat||ROW_TO_KEY[label]||'';if(!key)continue;
      row.dataset.s5Stat=key;row.classList.toggle('active',key===active);
      const b=row.querySelector('.stat-circle b');if(!b)continue;
      if(h&&key===active&&Number.isFinite(playedValue))b.textContent=String(playedValue);
      else if(!h)b.textContent=String(effective(p,key));
    }
    card.classList.toggle('used',!!h);
  }
  function syncDisplay(){
    totalsFromHistory();
    try{window.STARTING5_SYNC_USER_RAIL?.()}catch{}
    const game=document.querySelector('#game.active');if(!game)return;
    game.querySelectorAll('.player-card[data-id]').forEach(card=>{if(!card.closest('#lineup'))syncCard(card,'cpu')});
  }

  function installPlay(){
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5RuntimeAuthorityV01219)return;
    const base=fn;
    const wrapped=function(id){
      const k=cat();
      const u=getRoster('userTeam').find(p=>String(p.id)===String(id));
      const c=authoritativeCpuPick();
      const uValue=u?effective(u,k):NaN,cValue=c?effective(c,k):NaN;

      /* Legacy playQuarter and pickCpu now see the same exact values. */
      const saved=[];
      if(k){for(const p of allPlayers()){if(!p?.stats)continue;saved.push([p,p.stats[k]]);p.stats[k]=effective(p,k)}}
      const before=getHistory().length;
      let out;
      try{out=base.apply(this,arguments)}finally{for(const [p,v] of saved)if(p?.stats)p.stats[k]=v}

      const a=getHistory();
      if(a.length>before){
        const h=a[a.length-1];
        /* Force the ledger to the exact values visible/used for this matchup. */
        if(Number.isFinite(uValue))h.userPts=uValue;
        const actualCpu=h?.cpu||c;
        const exactCpu=actualCpu?effective(actualCpu,k):cValue;
        if(Number.isFinite(exactCpu))h.cpuPts=exactCpu;
      }
      totalsFromHistory();
      syncDisplay();
      requestAnimationFrame(syncDisplay);
      return out;
    };
    wrapped.__s5RuntimeAuthorityV01219=true;
    window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}
  }

  function installTransition(name){
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5RuntimeAuthorityV01219)return;
    const base=fn;
    const wrapped=function(){const out=base.apply(this,arguments);syncDisplay();requestAnimationFrame(syncDisplay);return out};
    wrapped.__s5RuntimeAuthorityV01219=true;window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
  }

  function install(){
    installCpuPicker();
    installPlay();
    ['beginQuarter','nextQuarter','startOvertime','renderLineup'].forEach(installTransition);
    syncDisplay();
  }

  install();
  setTimeout(install,120);
  window.addEventListener('pageshow',()=>setTimeout(install,30));
  window.STARTING5_MATCHUP_AUTHORITY={pickCpu:authoritativeCpuPick,sync:syncDisplay,effective};
})();
