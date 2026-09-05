/* NBA Courtside v0.10.29 — automatic quarter flow, live matchup ledger, larger POTG final */
(()=>{
  if(window.__courtsideGameFlowV01012)return;
  window.__courtsideGameFlowV01012=true;

  const label=k=>(window.STAT_LABELS&&STAT_LABELS[k])||({scoring:'Scoring',dunks:'Dunking',three:'3PT',freeThrows:'Free Throws',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'}[k]||k||'Matchup');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const playerLogo=p=>p?.teamId?`https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg`:'';
  const playerName=p=>p?.name||'Player';
  const teamName=p=>p?.teamShort||p?.team||'Team';

  const ensureUI=()=>{
    const game=document.getElementById('game');
    const rail=document.getElementById('lineup');
    if(game&&rail&&!document.getElementById('quarterHistoryStrip')){
      const strip=document.createElement('section');
      strip.id='quarterHistoryStrip';strip.className='quarter-history-strip';
      rail.insertAdjacentElement('afterend',strip);
    }
    if(!document.getElementById('quarterTransition')){
      const t=document.createElement('div');
      t.id='quarterTransition';t.className='quarter-transition hidden';
      t.innerHTML='<div class="quarter-transition-inner"><span>NBA COURTSIDE</span><strong></strong></div>';
      document.body.appendChild(t);
    }
  };

  const renderHistory=()=>{
    ensureUI();
    const strip=document.getElementById('quarterHistoryStrip');
    if(!strip||!window.state)return;
    const hist=(state.history||[]).filter(h=>h.quarter!=='OT');
    strip.innerHTML=hist.map(h=>{
      const u=h.user,c=h.cpu;
      return `<article class="quarter-history-item">
        <div class="quarter-history-q">Q${h.quarter}</div>
        <div class="quarter-history-side"><img src="${playerLogo(u)}" alt=""><span>${esc(playerName(u))}</span><b>${h.userPts}</b></div>
        <div class="quarter-history-vs">${esc(label(h.category))}</div>
        <div class="quarter-history-side away"><b>${h.cpuPts}</b><span>${esc(playerName(c))}</span><img src="${playerLogo(c)}" alt=""></div>
      </article>`;
    }).join('');
    strip.classList.toggle('empty',!hist.length);
  };

  const showTransition=(text,done)=>{
    ensureUI();
    const t=document.getElementById('quarterTransition');
    const strong=t?.querySelector('strong');
    if(!t||!strong){done?.();return;}
    strong.textContent=text;
    t.classList.remove('hidden','out');
    requestAnimationFrame(()=>t.classList.add('in'));
    setTimeout(()=>t.classList.add('out'),520);
    setTimeout(()=>{t.classList.add('hidden');t.classList.remove('in','out');done?.();},760);
  };

  const originalBegin=window.beginQuarter;
  const originalPlay=window.playQuarter;
  const originalFinish=window.finishGame;
  if(typeof originalBegin!=='function'||typeof originalPlay!=='function'||typeof originalFinish!=='function')return;

  window.beginQuarter=function(){
    originalBegin.apply(this,arguments);
    ensureUI();renderHistory();
    const next=document.getElementById('nextQuarterBtn');
    const result=document.getElementById('quarterResult');
    if(next){next.style.removeProperty('display');next.disabled=true;next.textContent=state?.overtime?'Overtime':label(state?.category);next.classList.add('category-only');}
    if(result){result.innerHTML=`<span class="matchup-category-only">${esc(state?.overtime?'Overtime':label(state?.category))}</span>`;}
  };

  let advanceTimer=0;
  const autoAdvance=()=>{
    clearTimeout(advanceTimer);
    advanceTimer=setTimeout(()=>{
      if(!window.state)return;
      if(state.overtime){window.finishGame();return;}
      if(state.quarter===4){
        if(state.userScore===state.cpuScore){
          showTransition('OVERTIME',()=>window.startOvertime());
        }else window.finishGame();
        return;
      }
      const nextQ=state.quarter+1;
      showTransition(`QUARTER ${nextQ}`,()=>{state.quarter=nextQ;window.beginQuarter();window.scrollTo({top:0,behavior:'instant'});});
    },780);
  };

  window.playQuarter=function(id){
    const before=state?.history?.length||0;
    originalPlay.apply(this,arguments);
    if((state?.history?.length||0)===before)return;
    renderHistory();
    const next=document.getElementById('nextQuarterBtn');
    if(next){next.style.setProperty('display','none','important');next.classList.remove('category-only');}
    autoAdvance();
  };

  const bestPlayer=()=>{
    const hist=state?.history||[];
    let best=null;
    hist.forEach(h=>{
      const diff=Math.abs((h.userPts||0)-(h.cpuPts||0));
      const winner=h.userPts===h.cpuPts?null:(h.userPts>h.cpuPts?h.user:h.cpu);
      if(!winner)return;
      const score=Math.max(h.userPts||0,h.cpuPts||0);
      if(!best||diff>best.diff||(diff===best.diff&&score>best.score))best={player:winner,diff,score,category:h.category};
    });
    return best?.player||hist[0]?.user||userTeam?.[0]||null;
  };

  window.finishGame=function(){
    clearTimeout(advanceTimer);
    const final=document.getElementById('final');
    if(!final)return originalFinish.apply(this,arguments);
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    final.classList.add('active','compact-final-screen');
    const home=state?.history?.[0]?.user||userTeam?.[0];
    const away=state?.history?.[0]?.cpu||cpuTeam?.[0];
    const potg=bestPlayer();
    const winner=state.userScore===state.cpuScore?'TIE':state.userScore>state.cpuScore?teamName(home):teamName(away);
    let card='';
    try{card=potg&&typeof cardMarkup==='function'?cardMarkup(potg,{eager:true}):'';}catch{}
    final.innerHTML=`<section class="compact-final-card">
      <div class="compact-final-kicker">FINAL</div>
      <div class="compact-final-scoreboard">
        <div class="compact-final-team"><img src="${playerLogo(home)}" alt=""><strong>${state.userScore}</strong><span>${esc(teamName(home))}</span></div>
        <div class="compact-final-dash">–</div>
        <div class="compact-final-team"><img src="${playerLogo(away)}" alt=""><strong>${state.cpuScore}</strong><span>${esc(teamName(away))}</span></div>
      </div>
      <h2>${esc(winner==='TIE'?'Game Tied':winner+' Win!')}</h2>
      <div class="potg-label">PLAYER OF THE GAME</div>
      <div class="potg-card-wrap">${card}</div>
      <div class="compact-final-actions"><button type="button" class="primary-btn" id="compactPlayAgain">Play Again</button><button type="button" class="ghost-btn" id="compactMenu">Menu</button></div>
    </section>`;

    const shell=final.querySelector('.compact-final-card');
    const wrap=final.querySelector('.potg-card-wrap');
    const actions=final.querySelector('.compact-final-actions');
    if(shell&&wrap&&actions){
      [...shell.childNodes].forEach(n=>{
        if(n===wrap||n===actions)return;
        if(n.nodeType===3&&n.textContent.trim()===playerName(potg))n.remove();
        if(n.nodeType===1&&n!==wrap&&n!==actions&&n.textContent?.trim()===playerName(potg))n.remove();
      });
    }

    const again=document.getElementById('compactPlayAgain');
    const menu=document.getElementById('compactMenu');
    if(again)again.onclick=()=>window.resetGame();
    if(menu)menu.onclick=()=>{if(typeof dealTeams==='function')dealTeams();if(typeof renderStarterFive==='function')renderStarterFive();if(typeof showScreen==='function')showScreen('intro');};
    if(typeof window.__courtsideFoundationRatingApply==='function')requestAnimationFrame(window.__courtsideFoundationRatingApply);
    window.scrollTo({top:0,behavior:'instant'});
  };

  window.nextQuarter=window.nextQuarter||nextQuarter;
  window.startOvertime=window.startOvertime||startOvertime;
  window.resetGame=window.resetGame||resetGame;

  ensureUI();renderHistory();
})();
