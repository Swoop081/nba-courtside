/* NBA Starting5 v0.13.0-dev.7 — runtime parity/integrity diagnostics. Read-only; never changes gameplay state. */
(()=>{
  if(window.__starting5GameplayIntegrityV01307)return;
  window.__starting5GameplayIntegrityV01307=true;

  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const CARD_KEYS={scoring:'SCO',dunks:'DNK',three:'3PT',rebounding:'REB',passing:'PAS',blocks:'BLK',steals:'STL'};
  const failures=[];
  let snapshot=null;
  const id=p=>String(p?.id||p?.playerId||'');
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const effective=(p,k)=>{try{return dyn()?.isSeasonGameplay?.()&&dyn()?.getEffectiveStat?Number(dyn().getEffectiveStat(p,k))||0:Number(p?.stats?.[k]??0)||0}catch{return Number(p?.stats?.[k]??0)||0}};
  const used=(set,p)=>{try{return set?.has?.(p.id)||set?.has?.(p.playerId)}catch{return false}};
  const fail=(code,detail={})=>{const row={time:Date.now(),code,...detail};failures.push(row);console.error('[Starting5 Integrity]',code,detail)};
  const scoreFromHistory=()=>{let u=0,c=0;for(const h of state?.history||[]){u+=Number(h.userPts)||0;c+=Number(h.cpuPts)||0}return{u,c}};

  function cardValue(card,cat){if(!card)return null;const want=CARD_KEYS[cat];for(const row of card.querySelectorAll('.stats .stat')){const lab=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();if(lab===want){const n=Number(row.querySelector('.stat-circle b')?.textContent);return Number.isFinite(n)?n:null}}return null}

  function capture(e){
    const d=e.detail||{},cat=d.category;if(!CATS.includes(cat))return;
    const req=d.requiredPosition||null;
    const user=(Array.isArray(userTeam)?userTeam:[]).filter(p=>!used(state?.usedUser,p)&&(!req||String(p.position)===String(req)));
    const cpu=(Array.isArray(cpuTeam)?cpuTeam:[]).filter(p=>!used(state?.usedCpu,p)&&(!req||String(p.position)===String(req)));
    snapshot={cat,req,user:new Map(user.map(p=>[id(p),effective(p,cat)])),cpu:new Map(cpu.map(p=>[id(p),effective(p,cat)]))};
    requestAnimationFrame(()=>{
      for(const p of user){const card=document.querySelector(`#game.active #lineup .player-card[data-id="${(window.CSS&&CSS.escape)?CSS.escape(id(p)):id(p)}"]`),shown=cardValue(card,cat),expect=snapshot?.user.get(id(p));if(shown!==null&&shown!==expect)fail('USER_CARD_ACTIVE_VALUE_MISMATCH',{player:p.name,cat,shown,expect})}
      for(const p of user){const delta=Number(dyn()?.getDelta?.(p)||0);if(delta!==0&&dyn()?.isSeasonGameplay?.()){const card=document.querySelector(`#game.active #lineup .player-card[data-id="${(window.CSS&&CSS.escape)?CSS.escape(id(p)):id(p)}"]`);if(card&&!card.querySelector('.s5-dynamic-rating'))fail('FIRST_TURN_DYNAMIC_ARROW_MISSING',{player:p.name,delta})}}
      if(!document.getElementById('s5CpuChoiceStage'))fail('OPPONENT_STAGE_MISSING');
      if(!document.getElementById('s5LineupPrev')||!document.getElementById('s5LineupNext'))fail('RAIL_ARROWS_MISSING');
    });
  }

  function verify(e){
    const entry=e.detail?.entry;if(!entry||!snapshot)return;
    const uid=id(entry.user),cid=id(entry.cpu),uv=Number(entry.userPts)||0,cv=Number(entry.cpuPts)||0;
    const expectU=snapshot.user.get(uid),expectC=snapshot.cpu.get(cid);
    if(expectU!==undefined&&uv!==expectU)fail('USER_RESOLVED_VALUE_MISMATCH',{player:entry.user?.name,cat:entry.category,actual:uv,expect:expectU});
    if(expectC!==undefined&&cv!==expectC)fail('CPU_RESOLVED_VALUE_MISMATCH',{player:entry.cpu?.name,cat:entry.category,actual:cv,expect:expectC});
    if(snapshot.cpu.size){const max=Math.max(...snapshot.cpu.values());if(cv!==max)fail('CPU_NOT_HIGHEST_UNUSED_EFFECTIVE',{player:entry.cpu?.name,cat:entry.category,actual:cv,max})}
    const sums=scoreFromHistory();if(Number(state?.userScore)!==sums.u||Number(state?.cpuScore)!==sums.c)fail('STATE_SCORE_HISTORY_MISMATCH',{stateUser:state?.userScore,stateCpu:state?.cpuScore,historyUser:sums.u,historyCpu:sums.c});
    requestAnimationFrame(()=>{
      const du=Number(document.getElementById('userScore')?.textContent),dc=Number(document.getElementById('cpuScore')?.textContent);if(du!==sums.u||dc!==sums.c)fail('DOM_SCORE_HISTORY_MISMATCH',{domUser:du,domCpu:dc,historyUser:sums.u,historyCpu:sums.c});
      const esc=v=>(window.CSS&&CSS.escape)?CSS.escape(String(v)):String(v);
      const uc=document.querySelector(`#game .player-card[data-id="${esc(uid)}"]`),cc=[...document.querySelectorAll(`#game .player-card[data-id="${esc(cid)}"]`)].find(x=>!x.closest('#lineup'));
      const uShown=cardValue(uc,entry.category),cShown=cardValue(cc,entry.category);if(uShown!==null&&uShown!==uv)fail('USER_PLAYED_CARD_HISTORY_MISMATCH',{shown:uShown,history:uv,player:entry.user?.name});if(cShown!==null&&cShown!==cv)fail('CPU_PLAYED_CARD_HISTORY_MISMATCH',{shown:cShown,history:cv,player:entry.cpu?.name});
    });
  }

  window.addEventListener('s5:matchup-start',capture);
  window.addEventListener('s5:matchup-resolved',verify);
  window.addEventListener('s5:game-finished',()=>{const sums=scoreFromHistory();if(Number(state?.userScore)!==sums.u||Number(state?.cpuScore)!==sums.c)fail('FINAL_SCORE_HISTORY_MISMATCH',{stateUser:state?.userScore,stateCpu:state?.cpuScore,historyUser:sums.u,historyCpu:sums.c})});

  window.STARTING5_GAMEPLAY_INTEGRITY={failures,report:()=>({ok:failures.length===0,failures:[...failures]})};
})();
