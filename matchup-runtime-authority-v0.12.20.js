/* NBA Starting5 v0.12.20 — single live-match authority using pure dynamic ratings. */
(()=>{
  if(window.__starting5RuntimeAuthorityV01220)return;
  window.__starting5RuntimeAuthorityV01220=true;

  const ROW_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const idOf=p=>String(p?.id||p?.playerId||'');
  const roster=name=>{try{const r=eval(name);return Array.isArray(r)?r:[]}catch{return []}};
  const hist=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const inSeason=()=>{try{return !!dyn()?.isSeasonGameplay?.()}catch{return false}};
  const category=()=>{try{return String(state?.category||'')}catch{return ''}};
  let transactionActive=false;

  const effective=(p,k)=>{
    if(!p||!k)return 0;
    if(transactionActive)return Number(p?.stats?.[k]??0)||0;
    try{if(inSeason()&&dyn()?.getEffectiveStat)return Number(dyn().getEffectiveStat(p,k))||0}catch{}
    return Number(p?.stats?.[k]??0)||0;
  };
  const allPlayers=()=>[...roster('userTeam'),...roster('cpuTeam')];
  const usedCpu=id=>{try{return !!state?.usedCpu?.has?.(id)}catch{return false}};

  function bestCpu(){
    const k=category(),available=roster('cpuTeam').filter(p=>!usedCpu(p.id));
    if(!available.length)return null;
    let best=available[0],bestVal=effective(best,k);
    for(let i=1;i<available.length;i++){
      const v=effective(available[i],k);
      if(v>bestVal){best=available[i];bestVal=v}
    }
    return best;
  }

  function installCpuPicker(){
    const picker=function(){return bestCpu()};
    picker.__s5CpuAuthorityV01220=true;
    window.pickCpu=picker;try{eval('pickCpu=window.pickCpu')}catch{}
  }

  function playedFor(id,side){
    const s=String(id||''),a=hist();
    for(let i=a.length-1;i>=0;i--){const h=a[i],p=side==='cpu'?h?.cpu:h?.user;if(idOf(p)===s)return h}
    return null;
  }
  function playerById(id){const s=String(id||'');return allPlayers().find(p=>idOf(p)===s)||null}

  function syncCard(card,side){
    const id=String(card?.dataset?.id||'');if(!id)return;
    const p=playerById(id);if(!p)return;
    const h=playedFor(id,side),active=h?String(h.category||''):category();
    const playedValue=h?Number(side==='cpu'?h.cpuPts:h.userPts):NaN;
    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=ROW_TO_KEY[label]||row.dataset.s5Stat||'';if(!key)continue;
      row.dataset.s5Stat=key;
      row.classList.toggle('active',key===active);
      const b=row.querySelector('.stat-circle b');if(!b)continue;
      if(h&&key===active&&Number.isFinite(playedValue))b.textContent=String(playedValue);
      else if(!h)b.textContent=String(effective(p,key));
    }
    card.classList.toggle('used',!!h);
  }

  function syncTotals(){
    let u=0,c=0;
    for(const h of hist()){
      const up=Number(h?.userPts),cp=Number(h?.cpuPts);
      if(Number.isFinite(up))u+=up;if(Number.isFinite(cp))c+=cp;
    }
    try{state.userScore=u;state.cpuScore=c}catch{}
    const ue=document.getElementById('userScore'),ce=document.getElementById('cpuScore');
    if(ue)ue.textContent=String(u);if(ce)ce.textContent=String(c);
  }

  function syncDisplay(){
    const game=document.querySelector('#game.active');if(!game)return;
    syncTotals();
    try{window.STARTING5_SYNC_USER_RAIL?.()}catch{}
    game.querySelectorAll('.player-card[data-id]').forEach(card=>{if(!card.closest('#lineup'))syncCard(card,'cpu')});
  }

  function beginTransaction(){
    const k=category();if(!k||!inSeason())return ()=>{};
    const saved=[];
    for(const p of allPlayers()){
      if(!p?.stats)continue;
      saved.push([p,p.stats[k]]);
      p.stats[k]=Number(dyn()?.getEffectiveStat?.(p,k)??p.stats[k])||0;
    }
    transactionActive=true;
    return ()=>{transactionActive=false;for(const [p,v] of saved)if(p?.stats)p.stats[k]=v};
  }

  function installPlay(){
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5RuntimeAuthorityV01220)return;
    const base=fn;
    const wrapped=function(id){
      const k=category();
      const user=roster('userTeam').find(p=>String(p.id)===String(id));
      const cpu=bestCpu();
      const userValue=user?effective(user,k):NaN;
      const cpuValue=cpu?effective(cpu,k):NaN;
      const before=hist().length;
      const restore=beginTransaction();
      let out;
      try{out=base.apply(this,arguments)}finally{restore()}
      const a=hist();
      if(a.length>before){
        const h=a[a.length-1];
        if(Number.isFinite(userValue))h.userPts=userValue;
        if(Number.isFinite(cpuValue))h.cpuPts=cpuValue;
      }
      syncDisplay();requestAnimationFrame(syncDisplay);
      return out;
    };
    wrapped.__s5RuntimeAuthorityV01220=true;
    window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}
  }

  function installTransition(name){
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5RuntimeAuthorityV01220)return;
    const base=fn;
    const wrapped=function(){const out=base.apply(this,arguments);syncDisplay();requestAnimationFrame(syncDisplay);return out};
    wrapped.__s5RuntimeAuthorityV01220=true;
    window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
  }

  function install(){
    installCpuPicker();installPlay();
    ['beginQuarter','nextQuarter','startOvertime','renderLineup'].forEach(installTransition);
    syncDisplay();
  }
  install();setTimeout(install,120);setTimeout(install,400);
  window.addEventListener('pageshow',()=>setTimeout(install,30));
  window.STARTING5_MATCHUP_AUTHORITY={pickCpu:bestCpu,sync:syncDisplay,effective};
})();
