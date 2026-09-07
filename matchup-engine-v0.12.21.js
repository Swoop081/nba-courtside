/* NBA Starting5 v0.12.21 — clean live matchup engine.
   Owns category, rail values, CPU choice, matchup ledger and scoreboard from one source of truth. */
(()=>{
  if(window.__starting5MatchupEngineV01221)return;
  window.__starting5MatchupEngineV01221=true;

  const ROW_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const LABELS={scoring:'SCORING',dunks:'DUNKS',three:'3PT',freeThrows:'FREE THROWS',rebounding:'REBOUNDS',passing:'ASSISTS',blocks:'BLOCKS',steals:'STEALS'};
  const idOf=p=>String(p?.id||p?.playerId||'');
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const roster=name=>{try{const r=eval(name);return Array.isArray(r)?r:[]}catch{return []}};
  const hist=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const currentCategory=()=>{try{return String(state?.category||'')}catch{return ''}};
  const effective=(p,k)=>{try{return Number(dyn()?.getEffectiveStat?.(p,k)??p?.stats?.[k]??0)||0}catch{return Number(p?.stats?.[k]??0)||0}};
  const isUsed=(p,side)=>{try{return side==='cpu'?state.usedCpu.has(p.id):state.usedUser.has(p.id)}catch{return false}};

  function lastPlayed(p,side){
    const id=idOf(p),a=hist();
    for(let i=a.length-1;i>=0;i--){const h=a[i],x=side==='cpu'?h?.cpu:h?.user;if(idOf(x)===id)return h}
    return null;
  }

  function badge(card,p){
    card.querySelector(':scope > .s5-dynamic-rating')?.remove();
    const d=Number(dyn()?.getDelta?.(p))||0;if(!d||!dyn()?.isSeasonGameplay?.())return;
    const b=document.createElement('div');b.className=`s5-dynamic-rating s5-dynamic-rating-${d<0?'down':'up'}`;
    for(let i=0;i<3;i++){const x=document.createElement('i');if(i<Math.abs(d))x.className='active';b.appendChild(x)}
    card.insertBefore(b,card.firstChild);
  }

  function bindCard(card,p,side){
    const played=lastPlayed(p,side),active=played?String(played.category||''):currentCategory();
    const playedValue=played?Number(side==='cpu'?played.cpuPts:played.userPts):NaN;
    card.classList.toggle('used',!!played||isUsed(p,side));
    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=ROW_TO_KEY[label]||row.dataset.s5Stat||'';if(!key)continue;
      row.dataset.s5Stat=key;
      row.classList.toggle('active',key===active);
      const out=row.querySelector('.stat-circle b');if(!out)continue;
      if(played&&key===active&&Number.isFinite(playedValue))out.textContent=String(playedValue);
      else if(!played)out.textContent=String(effective(p,key));
    }
    badge(card,p);
  }

  function ordered(team,side){return [...team].sort((a,b)=>Number(isUsed(a,side))-Number(isUsed(b,side)))}

  function renderUserRail(){
    const rail=document.getElementById('lineup');const team=roster('userTeam');if(!rail||!team.length)return;
    rail.classList.remove('result-open');
    const order=ordered(team,'user'),key=team.map(idOf).join('|');
    const cards=[...rail.querySelectorAll(':scope > .player-card')];
    if(rail.dataset.s5EngineRoster!==key||cards.length!==team.length){
      rail.innerHTML=order.map((p,i)=>cardMarkup(p,{activeStat:currentCategory(),used:isUsed(p,'user'),eager:i<2})).join('');
      rail.dataset.s5EngineRoster=key;
    }
    const byId=new Map([...rail.querySelectorAll(':scope > .player-card')].map(c=>[String(c.dataset.id||''),c]));
    for(const p of order){const c=byId.get(String(p.id));if(!c)continue;bindCard(c,p,'user');rail.appendChild(c)}
  }

  function renderCpuCards(){
    const game=document.querySelector('#game.active');if(!game)return;
    const team=roster('cpuTeam');
    game.querySelectorAll('.player-card[data-id]').forEach(card=>{
      if(card.closest('#lineup'))return;
      const p=team.find(x=>String(x.id)===String(card.dataset.id));
      if(p)bindCard(card,p,'cpu');
    });
  }

  function syncScore(){
    let u=0,c=0;for(const h of hist()){u+=Number(h?.userPts)||0;c+=Number(h?.cpuPts)||0}
    try{state.userScore=u;state.cpuScore=c}catch{}
    const ue=document.getElementById('userScore'),ce=document.getElementById('cpuScore');if(ue)ue.textContent=String(u);if(ce)ce.textContent=String(c);
  }

  function syncAll(){syncScore();renderUserRail();renderCpuCards()}

  function pickCpu(){
    const k=currentCategory(),available=roster('cpuTeam').filter(p=>!isUsed(p,'cpu'));
    if(!available.length)return null;
    return available.reduce((best,p)=>effective(p,k)>effective(best,k)?p:best);
  }

  function renderCategory(){
    const el=document.getElementById('categoryLabel');if(el)el.textContent=LABELS[currentCategory()]||String(currentCategory()).toUpperCase();
  }

  function beginQuarter(){
    if(!state)return;
    state.category=STAT_KEYS[Math.floor(Math.random()*STAT_KEYS.length)];
    const q=document.getElementById('quarterLabel');if(q)q.textContent=state.overtime?'OT':'Q'+state.quarter;
    renderCategory();
    document.getElementById('revealPanel')?.classList.add('hidden');
    const instruction=document.getElementById('instruction');if(instruction)instruction.textContent=state.overtime?'Overtime — choose your last player':`Choose one unused player for ${LABELS[state.category]||state.category}`;
    renderUserRail();syncScore();
    requestAnimationFrame(()=>{renderCategory();renderUserRail()});
  }

  function playQuarter(id){
    const rail=document.getElementById('lineup');
    const u=roster('userTeam').find(p=>String(p.id)===String(id));
    if(!u||isUsed(u,'user')||rail?.classList.contains('result-open'))return;
    const c=pickCpu();if(!c)return;
    const k=currentCategory(),uv=effective(u,k),cv=effective(c,k);
    state.usedUser.add(u.id);state.usedCpu.add(c.id);
    state.history.push({quarter:state.overtime?'OT':state.quarter,category:k,user:u,cpu:c,userPts:uv,cpuPts:cv});
    if(uv>cv)dyn()?.recordMatchupResult?.(u,c);else if(cv>uv)dyn()?.recordMatchupResult?.(c,u);else dyn()?.recordTie?.(u,c);
    syncScore();renderUserRail();renderCpuCards();
    rail?.classList.add('result-open');
    const qr=document.getElementById('quarterResult');if(qr)qr.innerHTML=`<span class="big">${uv} – ${cv}</span>${uv===cv?'Matchup tied':uv>cv?u.name+' wins the matchup':c.name+' wins the matchup'}`;
    const next=document.getElementById('nextQuarterBtn');if(next)next.textContent=state.overtime?'Final Score':state.quarter===4?(state.userScore===state.cpuScore?'Overtime':'Final Score'):'Start Q'+(state.quarter+1);
    document.getElementById('revealPanel')?.classList.remove('hidden');
    const ins=document.getElementById('instruction');if(ins)ins.textContent=(state.overtime?'Overtime ':LABELS[k]+' ')+'result';
    requestAnimationFrame(()=>{syncScore();renderUserRail();renderCpuCards()});
  }

  function nextQuarter(){
    if(state.overtime)return finishGame();
    if(state.quarter===4){if(state.userScore===state.cpuScore)return startOvertime();return finishGame()}
    state.quarter++;beginQuarter();window.scrollTo({top:0});
  }

  function startOvertime(){state.overtime=true;state.quarter=5;beginQuarter();window.scrollTo({top:0})}

  function install(){
    window.renderLineup=renderUserRail;window.pickCpu=pickCpu;window.beginQuarter=beginQuarter;window.playQuarter=playQuarter;window.nextQuarter=nextQuarter;window.startOvertime=startOvertime;
    try{eval('renderLineup=window.renderLineup;pickCpu=window.pickCpu;beginQuarter=window.beginQuarter;playQuarter=window.playQuarter;nextQuarter=window.nextQuarter;startOvertime=window.startOvertime')}catch{}
    syncAll();
  }

  install();setTimeout(install,0);setTimeout(install,150);
  window.addEventListener('pageshow',()=>setTimeout(install,20));
  window.STARTING5_MATCHUP_ENGINE={sync:syncAll,effective,pickCpu};
})();
