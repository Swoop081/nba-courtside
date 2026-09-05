/* NBA Courtside v0.10.32 — Play Again must start with a clean game presentation */
(()=>{
  if(window.__courtsidePlayAgainResetV01032)return;
  window.__courtsidePlayAgainResetV01032=true;

  const clearPresentation=()=>{
    const strip=document.getElementById('quarterHistoryStrip');
    if(strip){strip.innerHTML='';strip.classList.add('empty');}
    const reveal=document.getElementById('revealPanel');
    if(reveal)reveal.classList.add('hidden');
    const result=document.getElementById('quarterResult');
    if(result)result.innerHTML='';
    const transition=document.getElementById('quarterTransition');
    if(transition){transition.classList.add('hidden');transition.classList.remove('in','out');}
    const next=document.getElementById('nextQuarterBtn');
    if(next){next.style.removeProperty('display');next.classList.remove('category-only');}
    const u=document.getElementById('userScore');
    const c=document.getElementById('cpuScore');
    if(u)u.textContent='0';
    if(c)c.textContent='0';
  };

  const originalReset=window.resetGame;
  if(typeof originalReset==='function'){
    window.resetGame=function(){
      clearPresentation();
      const out=originalReset.apply(this,arguments);
      requestAnimationFrame(()=>{
        clearPresentation();
        const strip=document.getElementById('quarterHistoryStrip');
        if(strip){strip.innerHTML='';strip.classList.add('empty');}
      });
      return out;
    };
  }

  document.addEventListener('click',e=>{
    if(e.target?.closest?.('#compactPlayAgain')) clearPresentation();
  },true);
})();
