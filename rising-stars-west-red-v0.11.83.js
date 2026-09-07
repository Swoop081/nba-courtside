/* NBA Starting5 v0.11.89 — authoritative red Western Conference scoreboard override + All-Star/Rising Stars special-game loaders. */
(()=>{
  if(window.__starting5RisingStarsWestRedV01183)return;
  window.__starting5RisingStarsWestRedV01183=true;

  const WEST_PRIMARY='#c8102e';
  const WEST_DARK='#7a0b1d';

  const paint=()=>{
    const game=document.getElementById('game');
    if(!game?.classList.contains('active')||!game.classList.contains('s5-rising-stars-game'))return;
    const sides=[...game.querySelectorAll('.scoreboard .score-side')];
    sides.forEach(side=>{
      const name=(side.querySelector('.score-name')?.textContent||'').trim().toUpperCase();
      const alt=(side.querySelector('.score-logo-wrap img')?.alt||'').trim().toUpperCase();
      if(name!=='WEST'&&!alt.includes('WESTERN'))return;
      side.style.setProperty('--score-primary',WEST_PRIMARY);
      side.style.setProperty('--score-dark',WEST_DARK);
      side.style.setProperty('background',`linear-gradient(180deg,${WEST_PRIMARY},${WEST_DARK})`,'important');
      const team=side.querySelector('.score-team');
      if(team)team.style.setProperty('background','transparent','important');
    });
  };

  const schedule=()=>{setTimeout(paint,0);setTimeout(paint,40);setTimeout(paint,120);setTimeout(paint,260)};

  document.addEventListener('click',e=>{
    if(e.target.closest('#seasonRisingStars [data-rs-start]'))schedule();
  },true);

  const wrap=name=>{
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5WestRedV01183)return;
    const wrapped=function(){const out=fn.apply(this,arguments);schedule();return out};
    wrapped.__s5WestRedV01183=true;
    window[name]=wrapped;
    try{eval(`${name}=window[name]`)}catch{}
  };
  ['beginQuarter','playQuarter','startOvertime'].forEach(wrap);

  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});

  if(!document.querySelector('script[data-s5-rs-final-handoff]')){
    const s=document.createElement('script');
    s.dataset.s5RsFinalHandoff='1';
    s.src='rising-stars-final-handoff-v0.11.84.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-s5-all-star-standard]')){
    const s=document.createElement('script');
    s.dataset.s5AllStarStandard='1';
    s.src='all-star-standard-game-v0.11.85.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-s5-all-star-final-handoff]')){
    const s=document.createElement('script');
    s.dataset.s5AllStarFinalHandoff='1';
    s.src='all-star-final-handoff-v0.11.86.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-s5-all-star-champion-cards]')){
    const s=document.createElement('script');
    s.dataset.s5AllStarChampionCards='1';
    s.src='all-star-champions-potw-layout-v0.11.87.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-s5-special-final-conference-brand]')){
    const s=document.createElement('script');
    s.dataset.s5SpecialFinalConferenceBrand='1';
    s.src='special-game-final-conference-brand-v0.11.88.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-s5-all-star-completion-compat]')){
    const s=document.createElement('script');
    s.dataset.s5AllStarCompletionCompat='1';
    s.src='all-star-completion-compat-v0.11.89.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    document.head.appendChild(s);
  }
})();
