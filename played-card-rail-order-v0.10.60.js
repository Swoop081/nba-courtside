/* NBA Courtside v0.10.60 — keep unused cards first; move played cards to the end of the game rail */
(()=>{
  if(window.__courtsidePlayedCardRailOrderV01060)return;
  window.__courtsidePlayedCardRailOrderV01060=true;

  const originalRenderLineup=window.renderLineup;
  if(typeof originalRenderLineup!=='function')return;

  window.renderLineup=function(){
    if(typeof state!=='undefined'&&state&&Array.isArray(userTeam)&&state.usedUser){
      const unused=userTeam.filter(p=>!state.usedUser.has(p.id));
      const used=userTeam.filter(p=>state.usedUser.has(p.id));
      userTeam.splice(0,userTeam.length,...unused,...used);
    }
    return originalRenderLineup.apply(this,arguments);
  };

  /* renderLineup is also a top-level lexical function in app.js. Rebind it where allowed
     so beginQuarter() and the existing game flow use the same unused-first ordering. */
  try{renderLineup=window.renderLineup;}catch{}
})();
