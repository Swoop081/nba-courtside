/* NBA Starting5 v0.11.13 — authoritative matchup ticker + team-colour scoreboard */
(()=>{
  if(window.__courtsideGameInfoBarV01113)return;
  window.__courtsideGameInfoBarV01113=true;

  const labels={
    scoring:'SCORING',
    dunks:'DUNKS',
    three:'3PT',
    freeThrows:'FREE THROWS',
    rebounding:'REBOUNDS',
    passing:'ASSISTS',
    blocks:'BLOCKS',
    steals:'STEALS'
  };
  const label=k=>labels[k]||String(k||'MATCHUP').toUpperCase();
  const gameState=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};

  const ensureBar=()=>{
    const game=document.getElementById('game');
    const board=game?.querySelector('.scoreboard');
    if(!game||!board)return null;
    let bar=document.getElementById('gameInfoBar');
    if(!bar){
      bar=document.createElement('section');
      bar.id='gameInfoBar';
      bar.className='game-info-bar is-category';
      bar.setAttribute('aria-live','polite');
      bar.innerHTML='<strong></strong>';
      board.insertAdjacentElement('afterend',bar);
    }
    return bar;
  };

  const currentText=()=>{
    const s=gameState();
    if(!s)return 'MATCHUP';
    if(s.overtime)return `OVERTIME · ${label(s.category)}`;
    return `MATCHUP IS ${label(s.category)}`;
  };

  const showCurrent=()=>{
    const bar=ensureBar();if(!bar)return;
    bar.classList.remove('is-transition');
    bar.classList.add('is-category');
    const strong=bar.querySelector('strong');
    if(strong)strong.textContent=currentText();
  };

  const showTransition=text=>{
    const raw=String(text||'').trim().toUpperCase();
    if(!raw||raw==='MATCHUP'||raw==='NEXT MATCHUP'){
      showCurrent();
      return;
    }
    const bar=ensureBar();if(!bar)return;
    const strong=bar.querySelector('strong');
    bar.classList.remove('is-category');
    bar.classList.add('is-transition');
    if(strong){
      strong.style.animation='none';
      void strong.offsetWidth;
      strong.style.animation='';
      strong.textContent=text;
    }
  };

  const mirrorQuarterTransition=()=>{
    const transition=document.getElementById('quarterTransition');
    if(!transition)return;
    const strong=transition.querySelector('strong');
    let wasHidden=true;
    const sync=()=>{
      const hidden=transition.classList.contains('hidden');
      if(!hidden){
        const text=(strong?.textContent||'').trim();
        if(text)showTransition(text);
      }else if(!wasHidden){
        requestAnimationFrame(showCurrent);
      }
      wasHidden=hidden;
    };
    new MutationObserver(sync).observe(transition,{attributes:true,attributeFilter:['class'],childList:true,subtree:true,characterData:true});
    sync();
  };

  const teamPlayer=side=>{
    try{
      const arr=side==='home'?userTeam:cpuTeam;
      return Array.isArray(arr)&&arr.length?arr[0]:null;
    }catch{return null}
  };

  const paintScoreboard=()=>{
    const sb=document.querySelector('#game .scoreboard');
    if(!sb)return;
    let sides=[...sb.querySelectorAll('.score-side')];
    if(sides.length<2){
      sides=[...sb.children].filter(el=>!el.classList.contains('quarter-badge'));
    }
    if(sides.length<2)return;
    const apply=(el,p)=>{
      if(!el||!p)return;
      const a=p?.theme?.a||'#1d428a';
      const b=p?.theme?.b||'#ffffff';
      const c=p?.theme?.c||'#07111d';
      el.style.setProperty('background',`linear-gradient(135deg, ${a} 0%, ${a} 58%, ${c} 100%)`,'important');
      el.style.setProperty('border-color',b,'important');
    };
    apply(sides[0],teamPlayer('home'));
    apply(sides[sides.length-1],teamPlayer('away'));
  };

  const wrap=name=>{
    let original=null;try{original=window[name]||eval(name)}catch{}
    if(typeof original!=='function'||original.__gameInfoV01113)return;
    const wrapped=function(){
      const r=original.apply(this,arguments);
      requestAnimationFrame(()=>{showCurrent();paintScoreboard();});
      setTimeout(()=>{showCurrent();paintScoreboard();},40);
      return r;
    };
    wrapped.__gameInfoV01113=true;
    window[name]=wrapped;
    try{eval(`${name}=window[name]`);}catch{}
  };

  const start=()=>{
    ensureBar();showCurrent();mirrorQuarterTransition();paintScoreboard();
    ['beginQuarter','playQuarter','resetGame','nextQuarter','startOvertime'].forEach(wrap);
    const cat=document.getElementById('categoryLabel');
    if(cat)new MutationObserver(showCurrent).observe(cat,{childList:true,subtree:true,characterData:true});
    const sb=document.querySelector('#game .scoreboard');
    if(sb)new MutationObserver(()=>requestAnimationFrame(paintScoreboard)).observe(sb,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
