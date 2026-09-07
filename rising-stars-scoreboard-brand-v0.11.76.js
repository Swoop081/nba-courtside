/* NBA Starting5 v0.11.77 — stable Rising Stars conference scoreboard branding without mutation-observer re-entry. */
(()=>{
  if(window.__starting5RisingStarsScoreboardBrandV01176)return;
  window.__starting5RisingStarsScoreboardBrandV01176=true;

  const EAST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png';
  const WEST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png';
  let active=false;

  const logoFor=label=>String(label||'').trim().toUpperCase()==='WEST'?WEST_LOGO:EAST_LOGO;
  const altFor=label=>String(label||'').trim().toUpperCase()==='WEST'?'Western Conference':'Eastern Conference';

  const paint=()=>{
    const game=document.getElementById('game');
    if(!active||!game?.classList.contains('active'))return;
    if(!game.classList.contains('s5-rising-stars-game'))game.classList.add('s5-rising-stars-game');
    const sides=game.querySelectorAll('.score-side');
    if(sides.length<2)return;
    sides.forEach(side=>{
      const span=side.querySelector(':scope > span');
      if(!span||span.querySelector('.s5-rs-score-conf-logo'))return;
      const label=span.textContent||'';
      span.dataset.s5RsConference=label.trim().toUpperCase();
      span.innerHTML=`<img class="s5-rs-score-conf-logo" src="${logoFor(label)}" alt="${altFor(label)}">`;
      span.setAttribute('aria-label',altFor(label));
    });
  };

  const clear=()=>{
    active=false;
    document.getElementById('game')?.classList.remove('s5-rising-stars-game');
  };

  document.addEventListener('click',e=>{
    if(e.target.closest('#seasonRisingStars [data-rs-start]')){
      active=true;
      // Let the standard Rising Stars startGame() finish first, then decorate once.
      setTimeout(paint,0);
      setTimeout(paint,80);
      setTimeout(paint,240);
      return;
    }
    if(active&&e.target.closest('#final #compactPlayAgain,#final #playAgainBtn,#seasonHub [data-season-home],#newGameBtn'))clear();
  },true);

  const style=document.createElement('style');
  style.textContent=`
    #game.s5-rising-stars-game .score-side>span{display:flex!important;align-items:center!important;justify-content:center!important;min-width:104px!important;height:58px!important;font-size:0!important;line-height:0!important;overflow:visible!important}
    #game.s5-rising-stars-game .score-side>span .s5-rs-score-conf-logo{display:block!important;width:100px!important;height:56px!important;object-fit:contain!important;margin:0!important}
    #game.s5-rising-stars-game .score-side.away>span{justify-content:center!important}
    @media(max-width:430px){#game.s5-rising-stars-game .score-side>span{min-width:94px!important;height:54px!important}#game.s5-rising-stars-game .score-side>span .s5-rs-score-conf-logo{width:92px!important;height:52px!important}}
  `;
  document.head.appendChild(style);
})();
