/* NBA Courtside v0.10.46 — category + quarter transition information bar */
(()=>{
  if(window.__courtsideGameInfoBarV01046)return;
  window.__courtsideGameInfoBarV01046=true;

  const statLabel=k=>(window.STAT_LABELS&&STAT_LABELS[k])||({scoring:'Scoring',dunks:'Dunking',three:'3PT',freeThrows:'Free Throws',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'}[k]||k||'Matchup');

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

  const showCategory=()=>{
    const bar=ensureBar();
    if(!bar)return;
    bar.classList.remove('is-transition');
    bar.classList.add('is-category');
    const strong=bar.querySelector('strong');
    if(strong)strong.textContent=window.state?.overtime?'OVERTIME':statLabel(window.state?.category);
  };

  const showTransition=text=>{
    const bar=ensureBar();
    if(!bar)return;
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
    let lastHidden=true;
    const sync=()=>{
      const hidden=transition.classList.contains('hidden');
      if(!hidden){
        const text=(strong?.textContent||'').trim();
        if(text)showTransition(text);
      }else if(!lastHidden){
        setTimeout(showCategory,40);
      }
      lastHidden=hidden;
    };
    const mo=new MutationObserver(sync);
    mo.observe(transition,{attributes:true,attributeFilter:['class'],childList:true,subtree:true,characterData:true});
    sync();
  };

  const wrap=(name,after)=>{
    const fn=window[name];
    if(typeof fn!=='function'||fn.__gameInfoWrapped)return;
    const wrapped=function(){const r=fn.apply(this,arguments);after();return r;};
    wrapped.__gameInfoWrapped=true;
    window[name]=wrapped;
  };

  const start=()=>{
    ensureBar();
    showCategory();
    mirrorQuarterTransition();
    wrap('beginQuarter',()=>requestAnimationFrame(showCategory));
    wrap('playQuarter',()=>requestAnimationFrame(showCategory));
    wrap('resetGame',()=>requestAnimationFrame(showCategory));
    const cat=document.getElementById('categoryLabel');
    if(cat)new MutationObserver(()=>showCategory()).observe(cat,{childList:true,subtree:true,characterData:true});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
