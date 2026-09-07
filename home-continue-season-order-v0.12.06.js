/* NBA Starting5 v0.12.06 — move Continue Season directly under Play on the home screen. */
(()=>{
  if(window.__starting5HomeContinueOrderV01206)return;
  window.__starting5HomeContinueOrderV01206=true;

  function isContinueSeason(el){
    if(!el)return false;
    const text=(el.textContent||'').trim().replace(/\s+/g,' ').toLowerCase();
    return text==='continue season';
  }

  function move(){
    const intro=document.getElementById('intro');
    const actions=intro?.querySelector('.brand-launch-actions');
    const play=document.getElementById('startBtn');
    if(!intro||!actions||!play)return false;

    let btn=[...intro.querySelectorAll('button,a')].find(isContinueSeason);
    if(!btn)btn=[...document.querySelectorAll('button,a')].find(isContinueSeason);
    if(!btn)return false;

    if(play.nextElementSibling!==btn)play.insertAdjacentElement('afterend',btn);
    btn.style.setProperty('width','100%','important');
    btn.style.setProperty('margin-top','8px','important');
    btn.style.setProperty('margin-bottom','0','important');
    return true;
  }

  let scheduled=false;
  const schedule=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;move()});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  window.addEventListener('pageshow',schedule);
  const intro=document.getElementById('intro');
  if(intro)new MutationObserver(schedule).observe(intro,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  else new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
})();
