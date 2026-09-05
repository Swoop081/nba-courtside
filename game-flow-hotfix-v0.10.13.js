/* NBA Courtside v0.10.13 — lexical-state quarter flow hotfix */
(()=>{
  if(window.__courtsideGameFlowHotfixV01013)return;
  window.__courtsideGameFlowHotfixV01013=true;

  const labels={scoring:'Scoring',dunks:'Dunking',three:'3PT',freeThrows:'Free Throws',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
  const label=k=>labels[k]||k||'Matchup';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const logo=p=>p?.teamId?`https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg`:'';
  const name=p=>p?.name||'Player';
  const team=p=>p?.teamShort||p?.team||'Team';

  let handledHistory=0;
  let advancing=false;
  let finalRendered=false;
  let lastQuarterKey='';

  const ensureTransition=()=>{
    let t=document.getElementById('quarterTransition');
    if(!t){
      t=document.createElement('div');
      t.id='quarterTransition';t.className='quarter-transition hidden';
      t.innerHTML='<div class="quarter-transition-inner"><span>NBA COURTSIDE</span><strong></strong></div>';
      document.body.appendChild(t);
    }
    return t;
  };

  const showTransition=(text,done)=>{
    const t=ensureTransition(),strong=t.querySelector('strong');
    if(!strong){done();return;}
    strong.textContent=text;
    t.classList.remove('hidden','out');
    requestAnimationFrame(()=>t.classList.add('in'));
    setTimeout(()=>t.classList.add('out'),460);
    setTimeout(()=>{t.classList.add('hidden');t.classList.remove('in','out');done();},680);
  };

  const ensureLedger=()=>{
    const rail=document.getElementById('lineup');
    if(!rail)return null;
    let strip=document.getElementById('quarterHistoryStrip');
    if(!strip){strip=document.createElement('section');strip.id='quarterHistoryStrip';strip.className='quarter-history-strip';rail.insertAdjacentElement('afterend',strip);}
    return strip;
  };

  const renderLedger=()=>{
    if(typeof state==='undefined'||!state)return;
    const strip=ensureLedger();if(!strip)return;
    const hist=(state.history||[]).filter(h=>h.quarter!=='OT');
    strip.innerHTML=hist.map(h=>`<article class="quarter-history-item"><div class="quarter-history-q">Q${h.quarter}</div><div class="quarter-history-side"><img src="${logo(h.user)}" alt=""><span>${esc(name(h.user))}</span><b>${h.userPts}</b></div><div class="quarter-history-vs">${esc(label(h.category))}</div><div class="quarter-history-side away"><b>${h.cpuPts}</b><span>${esc(name(h.cpu))}</span><img src="${logo(h.cpu)}" alt=""></div></article>`).join('');
    strip.classList.toggle('empty',!hist.length);
  };

  const syncCategoryPrompt=()=>{
    if(typeof state==='undefined'||!state)return;
    const rail=document.getElementById('lineup');
    const btn=document.getElementById('nextQuarterBtn');
    if(!btn||!rail)return;
    const inResult=rail.classList.contains('result-open');
    if(inResult){btn.style.setProperty('display','none','important');return;}
    btn.style.removeProperty('display');
    btn.disabled=true;
    btn.classList.add('category-only');
    btn.textContent=state.overtime?'Overtime':label(state.category);
  };

  const bestPlayer=()=>{
    if(typeof state==='undefined'||!state)return null;
    let best=null;
    (state.history||[]).forEach(h=>{
      if(h.userPts===h.cpuPts)return;
      const winner=h.userPts>h.cpuPts?h.user:h.cpu;
      const margin=Math.abs(h.userPts-h.cpuPts);
      const winningScore=Math.max(h.userPts,h.cpuPts);
      if(!best||margin>best.margin||(margin===best.margin&&winningScore>best.winningScore))best={player:winner,margin,winningScore};
    });
    return best?.player||(state.history?.[0]?.user)||null;
  };

  const renderFinal=()=>{
    if(finalRendered||typeof state==='undefined'||!state)return;
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    finalRendered=true;
    const home=state.history?.[0]?.user||userTeam?.[0];
    const away=state.history?.[0]?.cpu||cpuTeam?.[0];
    const potg=bestPlayer();
    const result=state.userScore===state.cpuScore?'Game Tied':(state.userScore>state.cpuScore?team(home):team(away))+' Win!';
    let card='';try{if(potg&&typeof cardMarkup==='function')card=cardMarkup(potg,{eager:true});}catch{}
    final.classList.add('compact-final-screen');
    final.innerHTML=`<section class="compact-final-card"><div class="compact-final-kicker">FINAL</div><div class="compact-final-scoreboard"><div class="compact-final-team"><img src="${logo(home)}" alt=""><strong>${state.userScore}</strong><span>${esc(team(home))}</span></div><div class="compact-final-dash">–</div><div class="compact-final-team"><img src="${logo(away)}" alt=""><strong>${state.cpuScore}</strong><span>${esc(team(away))}</span></div></div><h2>${esc(result)}</h2><div class="potg-label">PLAYER OF THE GAME</div><div class="potg-card-wrap">${card}</div><div class="potg-name">${esc(name(potg))}</div><div class="compact-final-actions"><button type="button" class="primary-btn" id="compactPlayAgain">Play Again</button><button type="button" class="ghost-btn" id="compactMenu">Menu</button></div></section>`;
    document.getElementById('compactPlayAgain')?.addEventListener('click',()=>{finalRendered=false;handledHistory=0;advancing=false;resetGame();});
    document.getElementById('compactMenu')?.addEventListener('click',()=>{finalRendered=false;handledHistory=0;advancing=false;dealTeams();renderStarterFive();showScreen('intro');});
    window.scrollTo({top:0,behavior:'instant'});
  };

  const advanceAfterResult=()=>{
    if(advancing||typeof state==='undefined'||!state)return;
    advancing=true;
    const q=state.quarter;
    setTimeout(()=>{
      if(typeof state==='undefined'||!state){advancing=false;return;}
      if(q>=4&&!state.overtime){
        if(state.userScore===state.cpuScore){showTransition('OVERTIME',()=>{nextQuarter();advancing=false;});}
        else {nextQuarter();advancing=false;}
        return;
      }
      if(state.overtime){nextQuarter();advancing=false;return;}
      showTransition(`QUARTER ${q+1}`,()=>{nextQuarter();advancing=false;setTimeout(syncCategoryPrompt,0);});
    },720);
  };

  const tick=()=>{
    if(typeof state==='undefined'||!state){renderFinal();return;}
    const histLen=state.history?.length||0;
    if(histLen<handledHistory){handledHistory=histLen;finalRendered=false;}
    const qKey=`${state.quarter}:${state.category}:${histLen}`;
    if(qKey!==lastQuarterKey){lastQuarterKey=qKey;syncCategoryPrompt();}
    if(histLen>handledHistory){handledHistory=histLen;renderLedger();syncCategoryPrompt();advanceAfterResult();}
    renderFinal();
  };

  document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{handledHistory=(typeof state!=='undefined'&&state?.history?.length)||0;renderLedger();syncCategoryPrompt();},0);});
  setInterval(tick,90);
})();
