/* NBA Starting5 v0.13.0-dev.2 — All-Star final handoff adapter using canonical gameplay events. */
(()=>{
  if(window.__starting5AllStarFinalHandoffV01302)return;
  window.__starting5AllStarFinalHandoffV01302=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}};
  const active=()=>!!document.getElementById('game')?.classList.contains('s5-all-star-standard-game');
  const normalizeHistory=history=>{const out=[];for(const h of history||[]){if(!h?.user||!h?.cpu)continue;const uv=Number(h.userPts)||0,cv=Number(h.cpuPts)||0,d=uv-cv;out.push({round:h.quarter==='OT'?5:Number(h.quarter)||out.length+1,position:h.user.position||'',category:h.category,user:h.user.name,userKey:key(h.user),userTeamId:String(h.user.teamId||''),cpu:h.cpu.name,cpuKey:key(h.cpu),cpuTeamId:String(h.cpu.teamId||''),uv,cv,userDiff:d,cpuDiff:-d})}return out};
  const mvp=history=>{let best=null;for(const h of history){for(const p of [{name:h.user,key:h.userKey,teamId:h.userTeamId,diff:h.userDiff},{name:h.cpu,key:h.cpuKey,teamId:h.cpuTeamId,diff:h.cpuDiff}])if(p.diff>0&&(!best||p.diff>best.diff))best=p}return best||{name:history[0]?.user||'—',teamId:history[0]?.userTeamId||'',diff:0}};
  const ensureSaved=detail=>{
    if(!active())return;const s=read();if(!s)return;s.allStarWeekend=s.allStarWeekend||{};if(s.allStarWeekend.allStarGame?.complete)return;
    const history=normalizeHistory(detail?.history||state?.history||[]),u=Number(detail?.userScore??state?.userScore)||0,c=Number(detail?.cpuScore??state?.cpuScore)||0,userEast=String(document.querySelector('#game .score-side:first-child .score-name')?.textContent||'').trim().toUpperCase()==='EAST',userName=userEast?'EAST':'WEST',cpuName=userEast?'WEST':'EAST';
    s.allStarWeekend.allStarGame={complete:true,winner:u===c?'TIE':u>c?userName:cpuName,score:`${u}-${c}`,mvp:mvp(history),history,completedAt:new Date().toISOString(),engine:'starting5-gameplay-core'};write(s);
  };
  const decorate=()=>{if(!active())return;const final=document.getElementById('final');if(!final?.classList.contains('active'))return;const kicker=final.querySelector('.compact-final-kicker,.kicker');if(kicker)kicker.textContent='ALL-STAR GAME FINAL';const btn=final.querySelector('#compactPlayAgain,#playAgainBtn');if(btn){btn.textContent='Continue';btn.dataset.s5AllStarContinue='1'}};
  const goSeason=()=>{const game=document.getElementById('game');game?.classList.remove('s5-all-star-standard-game','s5-all-star-game');document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById('seasonHub')?.classList.add('active');window.scrollTo(0,0);const seasonModeBtn=document.getElementById('seasonModeBtn');if(seasonModeBtn)setTimeout(()=>seasonModeBtn.click(),0)};

  window.addEventListener('s5:game-finished',e=>{if(!active())return;ensureSaved(e.detail);requestAnimationFrame(decorate)});
  document.addEventListener('click',e=>{const btn=e.target.closest('#final [data-s5-all-star-continue],#final #compactPlayAgain,#final #playAgainBtn');if(!btn||!active())return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();ensureSaved();goSeason()},true);
})();