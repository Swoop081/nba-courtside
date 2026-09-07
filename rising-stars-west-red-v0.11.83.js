/* NBA Starting5 v0.12.00 — authoritative red Western Conference scoreboard override + All-Star/Rising Stars special-game loaders + season-only dynamic ratings + authentic CPU simulation. */
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

  const load=(attr,src)=>{
    if(document.querySelector(`script[${attr}]`))return;
    const s=document.createElement('script');s.setAttribute(attr,'1');s.src=src+'?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());document.head.appendChild(s);
  };
  load('data-s5-rs-final-handoff','rising-stars-final-handoff-v0.11.84.js');
  load('data-s5-all-star-standard','all-star-standard-game-v0.11.85.js');
  load('data-s5-all-star-final-handoff','all-star-final-handoff-v0.11.86.js');
  load('data-s5-all-star-champion-cards','all-star-champions-potw-layout-v0.11.87.js');
  load('data-s5-special-final-conference-brand','special-game-final-conference-brand-v0.11.88.js');
  load('data-s5-all-star-completion-compat','all-star-completion-compat-v0.11.89.js');
  load('data-s5-dynamic-ratings-v01200','dynamic-ratings-v0.12.00.js');
  load('data-s5-dynamic-rating-image-style-v01195','dynamic-rating-image-style-v0.11.95.js');
  load('data-s5-cpu-authentic-sim-v01196','season-cpu-authentic-sim-v0.11.96.js');
})();
