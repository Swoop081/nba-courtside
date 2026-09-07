/* NBA Starting5 v0.12.17 — transactional matchup authority.
   The exact effective values used to choose/resolve a matchup are the values written to history,
   scoreboard and played cards. Category changes are rebound synchronously; no polling/timer cascade. */
(()=>{
  if(window.__starting5RuntimeAuthorityV01217)return;
  window.__starting5RuntimeAuthorityV01217=true;

  const ROW_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const idOf=p=>String(p?.id||p?.playerId||'');
  const roster=name=>{try{const r=eval(name);return Array.isArray(r)?r:[]}catch{return []}};
  const history=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const api=()=>window.STARTING5_DYNAMIC_RATINGS;
  const inSeason=()=>{try{return !!api()?.isSeasonGameplay?.()}catch{return false}};
  const category=()=>{try{return String(state?.category||'')}catch{return ''}};
  const effective=(p,k)=>{
    if(!p||!k)return 0;
    try{if(inSeason()&&api()?.getEffectiveStat)return Number(api().getEffectiveStat(p,k))||0}catch{}
    return Number(p?.stats?.[k]??0)||0;
  };
  const allGamePlayers=()=>[...roster('userTeam'),...roster('cpuTeam')];

  function playedEntry(id,side){
    const s=String(id||''),a=history();
    for(let i=a.length-1;i>=0;i--){const h=a[i],p=side==='cpu'?h?.cpu:h?.user;if(idOf(p)===s)return h}
    return null;
  }

  /* Temporarily expose the pre-match effective rating through p.stats for the legacy core resolver.
     This makes the existing CPU picker and playQuarter use the exact same dynamic value without
     permanently mutating baseline data. */
  function beginTransaction(){
    const k=category();if(!k||!inSeason())return ()=>{};
    const saved=[];
    for(const p of allGamePlayers()){
      if(!p?.stats)continue;
      saved.push([p,p.stats[k]]);
      p.stats[k]=effective(p,k);
    }
    return ()=>{for(const [p,v] of saved)if(p?.stats)p.stats[k]=v};
  }

  function lockScoreToHistory(){
    const a=history();let u=0,c=0;
    for(const h of a){const up=Number(h?.userPts),cp=Number(h?.cpuPts);if(Number.isFinite(up))u+=up;if(Number.isFinite(cp))c+=cp}
    try{state.userScore=u;state.cpuScore=c}catch{}
    const us=document.getElementById('userScore'),cs=document.getElementById('cpuScore');
    if(us)us.textContent=String(u);if(cs)cs.textContent=String(c);
  }

  function playerById(id){const s=String(id||'');return allGamePlayers().find(p=>idOf(p)===s)||null}

  function syncCpuCard(card){
    const id=String(card?.dataset?.id||'');if(!id)return;
    const p=playerById(id);if(!p)return;
    const played=playedEntry(id,'cpu');
    const active=played?String(played.category||''):category();
    const pts=played?Number(played.cpuPts):NaN;
    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=row.dataset.s5Stat||ROW_TO_KEY[label]||'';if(!key)continue;
      row.dataset.s5Stat=key;row.classList.toggle('active',key===active);
      const b=row.querySelector('.stat-circle b');if(!b)continue;
      if(played&&key===active&&Number.isFinite(pts))b.textContent=String(pts);
      else if(!played)b.textContent=String(effective(p,key));
    }
    card.classList.toggle('used',!!played);
  }

  function syncDisplay(){
    const game=document.querySelector('#game.active');if(!game)return;
    lockScoreToHistory();
    try{window.STARTING5_SYNC_USER_RAIL?.()}catch{}
    game.querySelectorAll('.player-card[data-id]').forEach(card=>{if(!card.closest('#lineup'))syncCpuCard(card)});
  }

  let raf=0;
  function syncNowAndFrame(){
    syncDisplay();
    if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{raf=0;syncDisplay()});
  }

  function wrapPlayQuarter(){
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5RuntimeAuthorityV01217)return false;
    const base=fn;
    const wrapped=function(){
      const restore=beginTransaction();
      let out;
      try{out=base.apply(this,arguments)}finally{restore()}
      /* Core history was written while the transactional effective values were installed. */
      syncNowAndFrame();
      return out;
    };
    wrapped.__s5RuntimeAuthorityV01217=true;
    window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}
    return true;
  }

  function wrapTransition(name){
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5RuntimeAuthorityV01217)return false;
    const base=fn;
    const wrapped=function(){const out=base.apply(this,arguments);syncNowAndFrame();return out};
    wrapped.__s5RuntimeAuthorityV01217=true;
    window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
    return true;
  }

  function install(){
    wrapPlayQuarter();
    ['beginQuarter','nextQuarter','startOvertime','renderLineup'].forEach(wrapTransition);
    syncNowAndFrame();
  }

  /* Install after legacy feature wrappers settle so this stays the outermost authority. */
  setTimeout(install,900);
  window.addEventListener('pageshow',()=>setTimeout(install,60));
  window.STARTING5_SYNC_MATCHUP_RUNTIME=syncNowAndFrame;
})();
