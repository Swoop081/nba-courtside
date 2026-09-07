/* NBA Starting5 v0.12.15 — gameplay + display authority for dynamic ratings and matchup transitions. */
(()=>{
  if(window.__starting5EffectiveStatAuthorityV01215)return;
  window.__starting5EffectiveStatAuthorityV01215=true;

  const LABEL_TO_KEY={SCORING:'scoring',DUNKS:'dunks',DUNKING:'dunks','3PT':'three','3-POINT':'three','3 POINT':'three','FREE THROWS':'freeThrows',REBOUNDS:'rebounding',REBOUNDING:'rebounding',ASSISTS:'passing',PASSING:'passing',BLOCKS:'blocks',STEALS:'steals'};
  const ROW_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const roster=name=>{try{const x=eval(name);return Array.isArray(x)?x:[]}catch{return []}};
  const api=()=>window.STARTING5_DYNAMIC_RATINGS;
  const season=()=>{try{return !!api()?.isSeasonGameplay?.()}catch{return false}};
  const currentCategory=()=>{try{return String(state?.category||'')}catch{return ''}};
  const effective=(p,k)=>{try{if(season()&&api()?.getEffectiveStat)return Number(api().getEffectiveStat(p,k))||0}catch{}return Number(p?.stats?.[k]??0)||0};

  function primeEffectiveCategory(){
    if(!season())return;
    const k=currentCategory();if(!k)return;
    for(const p of [...roster('userTeam'),...roster('cpuTeam')]){
      if(!p?.stats)continue;
      p.stats[k]=effective(p,k);
    }
  }

  function historyEntryFor(id,side){
    try{
      const hist=Array.isArray(state?.history)?state.history:[];
      for(let i=hist.length-1;i>=0;i--){const h=hist[i];const p=side==='cpu'?h?.cpu:h?.user;if(String(p?.id||p?.playerId||'')===id)return h;}
    }catch{}
    return null;
  }

  function syncCard(card,side){
    const id=String(card?.dataset?.id||'');if(!id)return;
    const p=[...roster('userTeam'),...roster('cpuTeam')].find(x=>String(x?.id||x?.playerId||'')===id);if(!p)return;
    const played=historyEntryFor(id,side);
    const activeKey=played?String(played.category||''):currentCategory();
    const playedPts=played?Number(side==='cpu'?played.cpuPts:played.userPts):NaN;

    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=row.dataset.s5Stat||ROW_TO_KEY[label]||'';if(!key)continue;
      row.dataset.s5Stat=key;
      row.classList.toggle('active',key===activeKey);
      const b=row.querySelector('.stat-circle b');if(!b)continue;
      if(played&&key===activeKey&&Number.isFinite(playedPts))b.textContent=String(playedPts);
      else if(!played)b.textContent=String(effective(p,key));
    }
  }

  function syncDisplay(){
    const game=document.querySelector('#game.active');if(!game)return;
    document.querySelectorAll('#game.active #lineup .player-card[data-id]').forEach(c=>syncCard(c,'user'));
    document.querySelectorAll('#game.active .player-card[data-id]').forEach(c=>{if(!c.closest('#lineup'))syncCard(c,'cpu')});
  }
  const schedule=()=>[0,16,40,80,140,240].forEach(ms=>setTimeout(syncDisplay,ms));

  function wrapPlay(){
    let fn=null;try{fn=window.playQuarter||eval('playQuarter')}catch{}
    if(typeof fn!=='function'||fn.__s5EffectiveAuthorityV01215)return false;
    const wrapped=function(){
      primeEffectiveCategory();
      const out=fn.apply(this,arguments);
      schedule();
      return out;
    };
    wrapped.__s5EffectiveAuthorityV01215=true;
    window.playQuarter=wrapped;try{eval('playQuarter=window.playQuarter')}catch{}
    return true;
  }
  function wrapTransition(name){
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5EffectiveTransitionV01215)return false;
    const wrapped=function(){const out=fn.apply(this,arguments);primeEffectiveCategory();schedule();return out};
    wrapped.__s5EffectiveTransitionV01215=true;window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}return true;
  }

  const install=()=>{wrapPlay();['beginQuarter','nextQuarter','renderLineup','startOvertime'].forEach(wrapTransition);primeEffectiveCategory();schedule()};
  install();setTimeout(install,0);setTimeout(install,120);setTimeout(install,350);setTimeout(install,800);

  const label=document.getElementById('categoryLabel');
  if(label){
    new MutationObserver(()=>{primeEffectiveCategory();schedule()}).observe(label,{subtree:true,childList:true,characterData:true});
  }
  document.addEventListener('click',e=>{if(e.target.closest('#game.active'))setTimeout(()=>{primeEffectiveCategory();syncDisplay()},0)},true);
  window.STARTING5_SYNC_EFFECTIVE_MATCHUP_STATS=()=>{primeEffectiveCategory();syncDisplay()};
})();
