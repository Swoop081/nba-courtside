/* NBA Starting5 v0.12.13 — one authoritative matchup ledger. The scoreboard and every played-card value are derived from the exact same state.history entries, so cumulative totals cannot drift apart. */
(()=>{
  if(window.__starting5MatchupLedgerIntegrityV01213)return;
  window.__starting5MatchupLedgerIntegrityV01213=true;

  const LABEL_TO_KEY={SCO:'scoring',DNK:'dunks','3PT':'three',FT:'freeThrows',REB:'rebounding',PAS:'passing',BLK:'blocks',STL:'steals'};
  const idOf=p=>String(p?.id||p?.playerId||'');
  const history=()=>{try{return Array.isArray(state?.history)?state.history:[]}catch{return []}};

  const exactEntry=(id,side)=>{
    const hist=history();
    for(let i=hist.length-1;i>=0;i--){
      const h=hist[i];
      if(side==='user'&&idOf(h?.user)===id)return h;
      if(side==='cpu'&&idOf(h?.cpu)===id)return h;
    }
    return null;
  };

  const totals=()=>history().reduce((a,h)=>{
    const u=Number(h?.userPts),c=Number(h?.cpuPts);
    if(Number.isFinite(u))a.user+=u;
    if(Number.isFinite(c))a.cpu+=c;
    return a;
  },{user:0,cpu:0});

  function bindPlayedCard(card,side){
    const id=String(card?.dataset?.id||'');if(!id)return;
    const h=exactEntry(id,side);
    const used=!!h;
    card.classList.toggle('used',used);
    if(!h)return;

    const category=String(h.category||'');
    const pts=Number(side==='user'?h.userPts:h.cpuPts);
    if(!category||!Number.isFinite(pts))return;

    for(const row of card.querySelectorAll('.stats .stat')){
      const label=(row.querySelector('.stat-label')?.textContent||'').trim().toUpperCase();
      const key=row.dataset.s5Stat||LABEL_TO_KEY[label]||'';
      if(!key)continue;
      row.dataset.s5Stat=key;
      row.classList.toggle('active',key===category);
      if(key===category){
        const b=row.querySelector('.stat-circle b');
        if(b)b.textContent=String(pts);
      }
    }
    card.dataset.s5PlayedCategory=category;
    card.dataset.s5PlayedPoints=String(pts);
  }

  function sync(){
    const game=document.querySelector('#game.active');
    if(!game)return;
    const hist=history();
    if(!hist.length)return;

    const t=totals();
    try{state.userScore=t.user;state.cpuScore=t.cpu}catch{}
    const us=document.getElementById('userScore'),cs=document.getElementById('cpuScore');
    if(us)us.textContent=String(t.user);
    if(cs)cs.textContent=String(t.cpu);

    document.querySelectorAll('#game.active #lineup .player-card[data-id]').forEach(card=>bindPlayedCard(card,'user'));
    document.querySelectorAll('#game.active .player-card[data-id]').forEach(card=>{
      if(card.closest('#lineup'))return;
      const id=String(card.dataset.id||'');
      if(exactEntry(id,'cpu'))bindPlayedCard(card,'cpu');
    });
  }

  const schedule=()=>[0,16,45,100,220,450].forEach(ms=>setTimeout(sync,ms));
  const wrap=name=>{
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5LedgerIntegrityV01213)return false;
    const wrapped=function(){const out=fn.apply(this,arguments);schedule();return out};
    wrapped.__s5LedgerIntegrityV01213=true;
    window[name]=wrapped;try{eval(`${name}=window[name]`)}catch{}
    return true;
  };
  const install=()=>{['playQuarter','beginQuarter','renderLineup','nextQuarter','startOvertime'].forEach(wrap);schedule()};
  install();setTimeout(install,0);setTimeout(install,120);setTimeout(install,350);setTimeout(install,800);
  window.STARTING5_SYNC_MATCHUP_LEDGER=sync;
})();
