/* NBA Starting5 v0.11.84 — authoritative Rising Stars final -> All-Star Weekend handoff. */
(()=>{
  if(window.__starting5RisingStarsFinalHandoffV01184)return;
  window.__starting5RisingStarsFinalHandoffV01184=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const ACTIVE_KEY='nbaStarting5RisingStarsActiveV1';
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}};
  const isActive=()=>{try{return sessionStorage.getItem(ACTIVE_KEY)==='1'}catch{return false}};
  const setActive=v=>{try{v?sessionStorage.setItem(ACTIVE_KEY,'1'):sessionStorage.removeItem(ACTIVE_KEY)}catch{}};
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId||''}|${p?.name||''}|${p?.position||''}`);

  document.addEventListener('click',e=>{
    if(e.target.closest('#seasonRisingStars [data-rs-start]'))setActive(true);
  },true);

  const normalizedHistory=()=>{
    const out=[];
    try{
      for(const h of state?.history||[]){
        if(!h?.user||!h?.cpu)continue;
        const uv=Number(h.userPts)||0,cv=Number(h.cpuPts)||0,d=uv-cv;
        out.push({
          round:h.quarter==='OT'?'OT':Number(h.quarter)||out.length+1,
          category:h.category,
          user:h.user.name,userKey:key(h.user),userTeamId:String(h.user.teamId||''),
          cpu:h.cpu.name,cpuKey:key(h.cpu),cpuTeamId:String(h.cpu.teamId||''),
          uv,cv,userDiff:d,cpuDiff:-d
        });
      }
    }catch{}
    return out;
  };

  const mvpFrom=history=>{
    let best=null;
    for(const h of history){
      const a={name:h.user,key:h.userKey,teamId:h.userTeamId,diff:h.userDiff};
      const b={name:h.cpu,key:h.cpuKey,teamId:h.cpuTeamId,diff:h.cpuDiff};
      if(!best||a.diff>best.diff)best=a;
      if(!best||b.diff>best.diff)best=b;
    }
    return best||{name:'—',teamId:'',diff:0};
  };

  const persistResult=()=>{
    const s=read();if(!s)return;
    s.allStarWeekend=s.allStarWeekend||{};
    if(s.allStarWeekend.risingStars?.complete)return;
    let us=0,cs=0;try{us=Number(state?.userScore)||0;cs=Number(state?.cpuScore)||0}catch{}
    const userEast=EAST.has(String(s.teamId));
    const userName=userEast?'EAST':'WEST',cpuName=userEast?'WEST':'EAST';
    const history=normalizedHistory();
    s.allStarWeekend.risingStars={
      complete:true,
      winner:us===cs?'TIE':us>cs?userName:cpuName,
      score:`${us}-${cs}`,
      mvp:mvpFrom(history),
      playedAfterGame:41,
      completedAt:new Date().toISOString(),
      history,
      engine:'standard-starting5'
    };
    write(s);
  };

  const decorateFinal=()=>{
    if(!isActive())return;
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    persistResult();
    const btn=final.querySelector('#compactPlayAgain,#playAgainBtn')||[...final.querySelectorAll('button')].find(b=>/play again/i.test(b.textContent||''));
    if(btn){
      btn.textContent='Continue All-Star Weekend';
      btn.dataset.s5RisingStarsContinue='1';
    }
    const kicker=final.querySelector('.compact-final-kicker,.kicker');
    if(kicker)kicker.textContent='RISING STARS FINAL';
  };

  document.addEventListener('click',e=>{
    if(!isActive())return;
    const final=document.getElementById('final');if(!final?.classList.contains('active'))return;
    const btn=e.target.closest('#compactPlayAgain,#playAgainBtn,[data-s5-rising-stars-continue]')||e.target.closest('button');
    if(!btn||(!btn.dataset.s5RisingStarsContinue&&!/play again|continue all-star weekend/i.test(btn.textContent||'')))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    persistResult();
    setActive(false);
    if(typeof window.STARTING5_ALLSTAR_WEEKEND?.openChampions==='function')window.STARTING5_ALLSTAR_WEEKEND.openChampions();
    else{
      document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));
      document.getElementById('seasonHub')?.classList.add('active');
      window.scrollTo(0,0);
    }
  },true);

  const final=document.getElementById('final');
  if(final)new MutationObserver(()=>{if(final.classList.contains('active')){requestAnimationFrame(decorateFinal);setTimeout(decorateFinal,50)}}).observe(final,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  setTimeout(decorateFinal,0);
})();
