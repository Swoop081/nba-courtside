/* NBA Starting5 v0.11.5 — Season game presentation reset + single post-match screen */
(()=>{
  if(window.__starting5SeasonPresentationResetV0115)return;
  window.__starting5SeasonPresentationResetV0115=true;
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';

  const style=document.createElement('style');
  style.textContent=`
    body.s5-season-game-active #final.active{visibility:hidden!important}
    body.s5-season-game-active #final.active:has(.compact-final-card){visibility:visible!important}
  `;
  document.head.appendChild(style);

  function clearPreviousGame(){
    const strip=document.getElementById('quarterHistoryStrip');
    if(strip){strip.innerHTML='';strip.classList.add('empty');}
    const rail=document.getElementById('lineup');
    if(rail)rail.classList.remove('result-open');
    const reveal=document.getElementById('revealPanel');
    if(reveal)reveal.classList.add('hidden');
    const result=document.getElementById('quarterResult');
    if(result)result.innerHTML='';
    const transition=document.getElementById('quarterTransition');
    if(transition){transition.classList.add('hidden');transition.classList.remove('in','out');}
    const u=document.getElementById('userScore');
    const c=document.getElementById('cpuScore');
    if(u)u.textContent='0';
    if(c)c.textContent='0';
    const final=document.getElementById('final');
    if(final){final.classList.remove('active','compact-final-screen');final.innerHTML='';}
  }

  window.addEventListener('click',e=>{
    if(e.target?.closest?.('#s5PlaySeasonGame')){
      document.body.classList.add('s5-season-game-active');
      clearPreviousGame();
      return;
    }
    if(e.target?.closest?.('#playAgainBtn,#compactPlayAgain')&&sessionStorage.getItem(ACTIVE_KEY)==='1'){
      setTimeout(()=>document.body.classList.remove('s5-season-game-active'),0);
    }
  },true);

  const start=()=>{
    if(sessionStorage.getItem(ACTIVE_KEY)==='1'&&document.getElementById('game')?.classList.contains('active')){
      document.body.classList.add('s5-season-game-active');
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
