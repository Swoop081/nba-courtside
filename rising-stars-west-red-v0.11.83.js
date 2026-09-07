/* NBA Starting5 v0.13.0-dev.3 — deterministic special-game adapters and auxiliary loader. */
(()=>{
  if(window.__starting5RisingStarsWestRedV01303)return;
  window.__starting5RisingStarsWestRedV01303=true;

  const WEST_PRIMARY='#c8102e',WEST_DARK='#7a0b1d';
  const paint=()=>{
    const game=document.getElementById('game');if(!game?.classList.contains('active')||!game.classList.contains('s5-rising-stars-game'))return;
    const sides=[...game.querySelectorAll('.scoreboard .score-side')];
    sides.forEach(side=>{const name=(side.querySelector('.score-name')?.textContent||'').trim().toUpperCase(),alt=(side.querySelector('.score-logo-wrap img')?.alt||'').trim().toUpperCase();if(name!=='WEST'&&!alt.includes('WESTERN'))return;side.style.setProperty('--score-primary',WEST_PRIMARY);side.style.setProperty('--score-dark',WEST_DARK);side.style.setProperty('background',`linear-gradient(180deg,${WEST_PRIMARY},${WEST_DARK})`,'important');const team=side.querySelector('.score-team');if(team)team.style.setProperty('background','transparent','important')});
  };

  window.addEventListener('s5:special-game-start',e=>{if(e.detail?.type==='rising-stars')requestAnimationFrame(paint)});
  window.addEventListener('s5:matchup-start',()=>requestAnimationFrame(paint));

  const files=[
    ['data-s5-rs-final-handoff','rising-stars-final-handoff-v0.11.84.js'],
    ['data-s5-all-star-standard','all-star-standard-game-v0.11.85.js'],
    ['data-s5-all-star-final-handoff','all-star-final-handoff-v0.11.86.js'],
    ['data-s5-all-star-champion-cards','all-star-champions-potw-layout-v0.11.87.js'],
    ['data-s5-special-final-conference-brand','special-game-final-conference-brand-v0.11.88.js'],
    ['data-s5-dynamic-rating-image-style-v01195','dynamic-rating-image-style-v0.11.95.js'],
    ['data-s5-cpu-authentic-sim-v01196','season-cpu-authentic-sim-v0.11.96.js'],
    ['data-s5-whos-hot-not-v01201','season-whos-hot-not-v0.12.01.js'],
    ['data-s5-stat-editor-v01203','stat-editor-v0.12.03.js'],
    ['data-s5-home-continue-order-v01206','home-continue-season-order-v0.12.06.js']
  ];
  const loadOne=([attr,src])=>new Promise(resolve=>{if(document.querySelector(`script[${attr}]`)){resolve();return}const s=document.createElement('script');s.setAttribute(attr,'1');s.async=false;s.src=src+'?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());s.onload=resolve;s.onerror=resolve;document.head.appendChild(s)});
  (async()=>{for(const item of files)await loadOne(item);requestAnimationFrame(paint)})();
})();