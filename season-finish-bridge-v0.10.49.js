/* NBA Courtside v0.10.49 — preserve Season Mode result handler before presentation layers replace finishGame */
(()=>{
  if(window.__courtsideSeasonFinishBridgeV01049)return;
  window.__courtsideSeasonFinishBridgeV01049=true;
  try{
    if(typeof finishGame==='function')window.__courtsideSeasonFinishGameV01049=finishGame;
    else if(typeof window.finishGame==='function')window.__courtsideSeasonFinishGameV01049=window.finishGame;
  }catch{}
})();
