/* NBA Starting5 v0.11.76 — use the same Eastern/Western Conference logos on the Rising Stars scoreboard. */
(()=>{
  if(window.__starting5RisingStarsScoreboardBrandV01176)return;
  window.__starting5RisingStarsScoreboardBrandV01176=true;

  const EAST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png';
  const WEST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png';
  let active=false;

  const paint=()=>{
    const game=document.getElementById('game');
    if(!active||!game?.classList.contains('active'))return;
    game.classList.add('s5-rising-stars-game');
    const sides=game.querySelectorAll('.score-side');
    if(sides.length<2)return;
    const set=(side,src,label)=>{
      const span=side.querySelector('span');
      if(!span)return;
      if(span.querySelector('.s5-rs-score-conf-logo'))return;
      span.innerHTML=`<img class="s5-rs-score-conf-logo" src="${src}" alt="${label} Conference">`;
      span.setAttribute('aria-label',`${label} Conference`);
    };
    set(sides[0],EAST_LOGO,'Eastern');
    set(sides[1],WEST_LOGO,'Western');
  };

  const clear=()=>{
    active=false;
    document.getElementById('game')?.classList.remove('s5-rising-stars-game');
  };

  document.addEventListener('click',e=>{
    if(e.target.closest('#seasonRisingStars [data-rs-start]')){
      active=true;
      setTimeout(paint,0);setTimeout(paint,60);setTimeout(paint,220);
      return;
    }
    if(active&&e.target.closest('#final #compactPlayAgain,#final #playAgainBtn,#seasonHub [data-season-home],#newGameBtn'))clear();
  },true);

  const observer=new MutationObserver(()=>{if(active)paint()});
  const start=()=>{
    const game=document.getElementById('game');
    if(game)observer.observe(game,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  const style=document.createElement('style');
  style.textContent=`
    #game.s5-rising-stars-game .score-side>span{display:flex!important;align-items:center!important;justify-content:center!important;min-width:104px!important;height:58px!important;font-size:0!important;line-height:0!important;overflow:visible!important}
    #game.s5-rising-stars-game .score-side>span .s5-rs-score-conf-logo{display:block!important;width:100px!important;height:56px!important;object-fit:contain!important;margin:0!important}
    #game.s5-rising-stars-game .score-side.away>span{justify-content:center!important}
    @media(max-width:430px){#game.s5-rising-stars-game .score-side>span{min-width:94px!important;height:54px!important}#game.s5-rising-stars-game .score-side>span .s5-rs-score-conf-logo{width:92px!important;height:52px!important}}
  `;
  document.head.appendChild(style);
})();
