/* NBA Starting5 v0.12.22 — authoritative live matchup core.
   No DOM reuse, no stat mutation, no polling. Every category transition rebuilds the user rail from current state. */
(()=>{
  if(window.__starting5MatchupCoreV01222)return;
  window.__starting5MatchupCoreV01222=true;

  const idOf=p=>String(p?.id||p?.playerId||'');
  const dyn=()=>window.STARTING5_DYNAMIC_RATINGS;
  const category=()=>{try{return String(state?.category||'')}catch{return ''}};
  const history=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};
  const isSeason=()=>{try{return !!dyn()?.isSeasonGameplay?.()}catch{return false}};
  const effective=(p,k)=>{
    if(!p||!k)return 0;
    try{if(isSeason()&&dyn()?.getEffectiveStat)return Number(dyn().getEffectiveStat(p,k))||0}catch{}
    return Number(p?.stats?.[k]??0)||0;
  };
  const isUsed=(p,side)=>{try{return side==='cpu'?state.usedCpu.has(p.id):state.usedUser.has(p.id)}catch{return false}};
  const lastPlayed=(p,side)=>{
    const id=idOf(p),a=history();
    for(let i=a.length-1;i>=0;i--){const x=side==='cpu'?a[i]?.cpu:a[i]?.user;if(idOf(x)===id)return a[i]}
    return null;
  };
  const badge=(card,p)=>{
    card.querySelector(':scope > .s5-dynamic-rating')?.remove();
    const d=Number(dyn()?.getDelta?.(p))||0;
    if(!d||!isSeason())return;
    const el=document.createElement('div');
    el.className=`s5-dynamic-rating s5-dynamic-rating-${d<0?'down':'up'}`;
    el.setAttribute('aria-label',`${d>0?'+':''}${d} all stats`);
    for(let i=0;i<3;i++){const x=document.createElement('i');if(i<Math.abs(d))x.className='active';el.appendChild(x)}
    card.insertBefore(el,card.firstChild);
  };
  const buildCard=(p,side,eager=false)=>{
    const played=lastPlayed(p,side),active=played?String(played.category||''):category();
    const used=!!played||isUsed(p,side);
    const value=played?Number(side==='cpu'?played.cpuPts:played.userPts):effective(p,active);
    const t=document.createElement('template');
    t.innerHTML=cardMarkup(p,{activeStat:active,used,eager}).trim();
    const card=t.content.firstElementChild;
    if(!card)return '';
    const activeRow=card.querySelector('.stats .stat.active .stat-circle b');
    if(activeRow&&Number.isFinite(value))activeRow.textContent=String(value);
    badge(card,p);
    return card.outerHTML;
  };

  function renderLineup(){
    const rail=document.getElementById('lineup');
    if(!rail||!Array.isArray(userTeam)||!state)return;
    rail.classList.remove('result-open');
    const ordered=[...userTeam.filter(p=>!isUsed(p,'user')),...userTeam.filter(p=>isUsed(p,'user'))];
    rail.innerHTML=ordered.map((p,i)=>buildCard(p,'user',i<2)).join('');
  }

  function pickCpu(){
    if(!Array.isArray(cpuTeam)||!state)return null;
    const k=category(),available=cpuTeam.filter(p=>!isUsed(p,'cpu'));
    if(!available.length)return null;
    return available.reduce((best,p)=>effective(p,k)>effective(best,k)?p:best);
  }

  function syncScore(){
    let u=0,c=0;
    for(const h of history()){u+=Number(h?.userPts)||0;c+=Number(h?.cpuPts)||0}
    state.userScore=u;state.cpuScore=c;
    const ue=document.getElementById('userScore'),ce=document.getElementById('cpuScore');
    if(ue)ue.textContent=String(u);if(ce)ce.textContent=String(c);
  }

  function syncCpuVisible(){
    if(!Array.isArray(cpuTeam))return;
    const game=document.querySelector('#game.active');if(!game)return;
    game.querySelectorAll('.player-card[data-id]').forEach(card=>{
      if(card.closest('#lineup'))return;
      const p=cpuTeam.find(x=>String(x.id)===String(card.dataset.id));if(!p)return;
      const played=lastPlayed(p,'cpu'),active=played?String(played.category||''):category();
      const value=played?Number(played.cpuPts):effective(p,active);
      const rows=[...card.querySelectorAll('.stats .stat')];
      rows.forEach(r=>r.classList.toggle('active',(r.querySelector('.stat-label')?.textContent||'').trim().toUpperCase()===({scoring:'SCO',dunks:'DNK',three:'3PT',freeThrows:'FT',rebounding:'REB',passing:'PAS',blocks:'BLK',steals:'STL'}[active]||'')));
      const out=card.querySelector('.stats .stat.active .stat-circle b');if(out&&Number.isFinite(value))out.textContent=String(value);
      card.classList.toggle('used',!!played||isUsed(p,'cpu'));badge(card,p);
    });
  }

  function playQuarter(id){
    const rail=document.getElementById('lineup');
    const u=Array.isArray(userTeam)?userTeam.find(p=>String(p.id)===String(id)):null;
    if(!u||isUsed(u,'user')||rail?.classList.contains('result-open'))return;
    const c=pickCpu();if(!c)return;
    const k=category(),uv=effective(u,k),cv=effective(c,k);
    state.usedUser.add(u.id);state.usedCpu.add(c.id);
    state.history.push({quarter:state.overtime?'OT':state.quarter,category:k,user:u,cpu:c,userPts:uv,cpuPts:cv});
    if(uv>cv)dyn()?.recordMatchupResult?.(u,c);else if(cv>uv)dyn()?.recordMatchupResult?.(c,u);else dyn()?.recordTie?.(u,c);
    syncScore();renderLineup();syncCpuVisible();
    rail?.classList.add('result-open');
    const qr=document.getElementById('quarterResult');
    if(qr)qr.innerHTML=`<span class="big">${uv} – ${cv}</span>${uv===cv?'Matchup tied':uv>cv?u.name+' wins the matchup':c.name+' wins the matchup'}`;
    const next=document.getElementById('nextQuarterBtn');
    if(next){next.disabled=false;next.textContent=state.overtime?'Final Score':state.quarter===4?(state.userScore===state.cpuScore?'Overtime':'Final Score'):'Start Q'+(state.quarter+1)}
    document.getElementById('revealPanel')?.classList.remove('hidden');
  }

  window.renderLineup=renderLineup;
  window.pickCpu=pickCpu;
  window.playQuarter=playQuarter;
  try{eval('renderLineup=window.renderLineup;pickCpu=window.pickCpu;playQuarter=window.playQuarter')}catch{}

  /* One tiny observer only for category changes. It performs a single full rebuild and cannot loop. */
  const label=document.getElementById('categoryLabel');
  if(label){let last=label.textContent;new MutationObserver(()=>{const now=label.textContent;if(now===last)return;last=now;renderLineup();syncCpuVisible()}).observe(label,{childList:true,characterData:true,subtree:true})}

  renderLineup();syncScore();syncCpuVisible();
  window.STARTING5_MATCHUP_CORE={effective,pickCpu,render:renderLineup,syncScore};
})();
