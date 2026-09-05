/* NBA Courtside v0.10.47 — persistent quarter + category information ticker */
(()=>{
  if(window.__courtsideGameInfoBarV01047)return;
  window.__courtsideGameInfoBarV01047=true;

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
    if(!window.state)return 'MATCHUP';
    if(state.overtime)return `OT ${label(state.category)}`;
    return `Q${state.quarter} ${label(state.category)}`;
  };

  const showCurrent=()=>{
    const bar=ensureBar();if(!bar)return;
    bar.classList.remove('is-transition');
    bar.classList.add('is-category');
    const strong=bar.querySelector('strong');
    if(strong)strong.textContent=currentText();
  };

  const showTransition=text=>{
    const bar=ensureBar();if(!bar)return;
    const strong=bar.querySelector('strong');
    bar.classList.remove('is-category');
    bar.classList.add('is-transition');
    if(strong){
      strong.style.animation='none';
      void strong.offsetWidth;
      strong.style.animation='';
      strong.textContent=text||'';
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
        setTimeout(showCurrent,30);
      }
      wasHidden=hidden;
    };
    new MutationObserver(sync).observe(transition,{attributes:true,attributeFilter:['class'],childList:true,subtree:true,characterData:true});
    sync();
  };

  const wrap=name=>{
    const original=window[name];
    if(typeof original!=='function'||original.__gameInfoV01047)return;
    const wrapped=function(){const r=original.apply(this,arguments);requestAnimationFrame(showCurrent);return r;};
    wrapped.__gameInfoV01047=true;
    window[name]=wrapped;
    try{eval(`${name}=window[name]`);}catch{}
  };

  const start=()=>{
    ensureBar();showCurrent();mirrorQuarterTransition();
    ['beginQuarter','playQuarter','resetGame','nextQuarter','startOvertime'].forEach(wrap);
    const cat=document.getElementById('categoryLabel');
    if(cat)new MutationObserver(showCurrent).observe(cat,{childList:true,subtree:true,characterData:true});
    setInterval(()=>{
      const bar=document.getElementById('gameInfoBar');
      if(bar&&!bar.classList.contains('is-transition'))showCurrent();
    },180);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
