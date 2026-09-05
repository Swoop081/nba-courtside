/* NBA Courtside v0.10.7 — safe card sizing + hard left rail reset */
(()=>{
  if(window.__courtsideGameCardSizeV0107)return;
  window.__courtsideGameCardSizeV0107=true;

  const apply=()=>{
    const mobile=window.matchMedia('(max-width:430px)').matches;
    const size=mobile?'36vw':'min(34.4vw,168px)';
    const max=mobile?'148px':'168px';
    document.querySelectorAll('#game .card-row > .player-card').forEach(card=>{
      card.style.setProperty('flex','0 0 '+size,'important');
      card.style.setProperty('flex-basis',size,'important');
      card.style.setProperty('width',size,'important');
      card.style.setProperty('max-width',max,'important');
      card.style.setProperty('min-width','0','important');
    });
  };

  const resetRail=()=>{
    const lineup=document.getElementById('lineup');
    if(!lineup)return;
    lineup.scrollLeft=0;
    requestAnimationFrame(()=>{lineup.scrollLeft=0;});
  };

  const start=()=>{
    apply();resetRail();
    const lineup=document.getElementById('lineup');
    if(lineup){
      new MutationObserver(()=>requestAnimationFrame(()=>{apply();resetRail();})).observe(lineup,{childList:true});
    }
    window.addEventListener('resize',()=>requestAnimationFrame(apply),{passive:true});
    setTimeout(()=>{apply();resetRail();},0);
    setTimeout(()=>{apply();resetRail();},150);
    setTimeout(()=>{apply();resetRail();},500);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
