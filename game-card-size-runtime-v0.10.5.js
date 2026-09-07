/* NBA Starting5 v0.13.0-dev.6 — deterministic game-card sizing; no MutationObserver or startup timer cascade. */
(()=>{
  if(window.__courtsideGameCardSizeV01306)return;
  window.__courtsideGameCardSizeV01306=true;
  const apply=()=>{
    const mobile=window.matchMedia('(max-width:430px)').matches,size=mobile?'36vw':'min(34.4vw,168px)',max=mobile?'148px':'168px';
    document.querySelectorAll('#game #lineup > .player-card').forEach(card=>{card.style.setProperty('flex','0 0 '+size,'important');card.style.setProperty('flex-basis',size,'important');card.style.setProperty('width',size,'important');card.style.setProperty('max-width',max,'important');card.style.setProperty('min-width','0','important')});
  };
  const resetRail=()=>{const lineup=document.getElementById('lineup');if(lineup)lineup.scrollLeft=0};
  const onRound=()=>requestAnimationFrame(()=>{apply();resetRail()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onRound,{once:true});else onRound();
  window.addEventListener('s5:game-start',onRound);
  window.addEventListener('s5:matchup-start',onRound);
  window.addEventListener('s5:matchup-resolved',()=>requestAnimationFrame(apply));
  window.addEventListener('resize',()=>requestAnimationFrame(apply),{passive:true});
})();