/* NBA Starting5 v0.11.86 — authoritative All-Star final handoff to Season hub. */
(()=>{
  if(window.__starting5AllStarFinalHandoffV01186)return;
  window.__starting5AllStarFinalHandoffV01186=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));

  const isAllStarFinal=()=>{
    const final=document.getElementById('final');
    const game=document.getElementById('game');
    return !!final?.classList.contains('active')&&!!game?.classList.contains('s5-all-star-standard-game');
  };

  const normalizeHistory=()=>{
    const out=[];
    try{
      for(const h of state?.history||[]){
        if(!h?.user||!h?.cpu)continue;
        const uv=Number(h.userPts)||0,cv=Number(h.cpuPts)||0,d=uv-cv;
        out.push({round:h.quarter==='OT'?5:Number(h.quarter)||out.length+1,position:h.user.position||'',category:h.category,user:h.user.name,userKey:key(h.user),userTeamId:String(h.user.teamId||''),cpu:h.cpu.name,cpuKey:key(h.cpu),cpuTeamId:String(h.cpu.teamId||''),uv,cv,userDiff:d,cpuDiff:-d});
      }
    }catch{}
    return out;
  };

  const mvp=history=>{
    let best=null;
    for(const h of history){
      for(const p of [{name:h.user,key:h.userKey,teamId:h.userTeamId,diff:h.userDiff},{name:h.cpu,key:h.cpuKey,teamId:h.cpuTeamId,diff:h.cpuDiff}]){
        if(p.diff>0&&(!best||p.diff>best.diff))best=p;
      }
    }
    return best||{name:history[0]?.user||'—',teamId:history[0]?.userTeamId||'',diff:0};
  };

  const ensureSaved=()=>{
    if(!isAllStarFinal())return;
    const s=read();if(!s)return;
    s.allStarWeekend=s.allStarWeekend||{};
    if(s.allStarWeekend.allStarGame?.complete)return;
    const history=normalizeHistory();
    const u=Number(state?.userScore)||0,c=Number(state?.cpuScore)||0;
    const userEast=(()=>{try{return String(document.querySelector('#game .score-side:first-child .score-name')?.textContent||'').trim().toUpperCase()==='EAST'}catch{return true}})();
    const userName=userEast?'EAST':'WEST',cpuName=userEast?'WEST':'EAST';
    const winner=u===c?'TIE':u>c?userName:cpuName;
    s.allStarWeekend.allStarGame={complete:true,winner,score:`${u}-${c}`,mvp:mvp(history),history,completedAt:new Date().toISOString(),engine:'standard-starting5'};
    write(s);
  };

  const decorate=()=>{
    if(!isAllStarFinal())return;
    ensureSaved();
    const kicker=document.querySelector('#final .compact-final-kicker');
    if(kicker)kicker.textContent='ALL-STAR GAME FINAL';
    const btn=document.querySelector('#final #compactPlayAgain,#final #playAgainBtn');
    if(btn){btn.textContent='Continue';btn.dataset.s5AllStarContinue='1';}
  };

  const goSeason=()=>{
    const game=document.getElementById('game');
    game?.classList.remove('s5-all-star-standard-game');
    document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
    document.getElementById('seasonHub')?.classList.add('active');
    window.scrollTo(0,0);
    // Re-open Season mode without auto-starting the next matchup so Game 42 is shown as Next Up.
    const seasonModeBtn=document.getElementById('seasonModeBtn');
    if(seasonModeBtn)setTimeout(()=>seasonModeBtn.click(),0);
  };

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#final [data-s5-all-star-continue],#final #compactPlayAgain,#final #playAgainBtn');
    if(!btn||!isAllStarFinal())return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    ensureSaved();
    goSeason();
  },true);

  const final=document.getElementById('final');
  if(final)new MutationObserver(()=>requestAnimationFrame(decorate)).observe(final,{attributes:true,attributeFilter:['class'],childList:true,subtree:true,characterData:true});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(decorate,0),{once:true});
  window.addEventListener('pageshow',decorate);
})();
