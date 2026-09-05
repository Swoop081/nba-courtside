/* NBA Courtside v0.10.5 — enforce gameplay card footprint 20% smaller at runtime */
(()=>{
  if(window.__courtsideGameCardSizeV0105)return;
  window.__courtsideGameCardSizeV0105=true;

  const apply=()=>{
    document.querySelectorAll('#game .card-row > .player-card').forEach(card=>{
      const mobile=window.matchMedia('(max-width:430px)').matches;
      const size=mobile?'36vw':'min(34.4vw,168px)';
      const max=mobile?'148px':'168px';
      card.style.setProperty('flex','0 0 '+size,'important');
      card.style.setProperty('flex-basis',size,'important');
      card.style.setProperty('width',size,'important');
      card.style.setProperty('max-width',max,'important');
      card.style.setProperty('min-width','0','important');
    });
  };

  const start=()=>{
    apply();
    const lineup=document.getElementById('lineup');
    if(lineup)new MutationObserver(apply).observe(lineup,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});
    window.addEventListener('resize',apply,{passive:true});
    document.addEventListener('click',()=>requestAnimationFrame(apply),true);
    setTimeout(apply,0);setTimeout(apply,150);setTimeout(apply,500);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
