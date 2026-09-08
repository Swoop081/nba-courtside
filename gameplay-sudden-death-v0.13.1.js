/* NBA Starting5 v0.13.1 — rare post-overtime sudden death, event-driven and non-polling. */
(()=>{
  if(window.__starting5SuddenDeathV0131)return;
  window.__starting5SuddenDeathV0131=true;

  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  let active=false,attempt=0,originalUser=null,originalCpu=null;

  const baseOverall=p=>{
    try{if(typeof window.courtsideOverall==='function')return Number(window.courtsideOverall(p))||0}catch{}
    const vals=CATS.map(k=>Number(p?.stats?.[k])||0);
    if(!vals.length)return 0;
    const copy=[...vals],min=Math.min(...copy),i=copy.indexOf(min);if(i>=0)copy.splice(i,1);
    return copy.length?Math.ceil(copy.reduce((a,b)=>a+b,0)/copy.length):0;
  };
  const ranked=team=>(Array.isArray(team)?team:[]).map((p,i)=>({p,i,ovr:baseOverall(p)})).sort((a,b)=>b.ovr-a.ovr||a.i-b.i).map(x=>x.p);
  const originalFor=(team,origId)=>team?.find(p=>String(p?.id||p?.playerId||'')===String(origId))||null;
  const cloneFor=(p,side,n)=>Object.assign({},p,{id:`${p.id||p.playerId}__sd_${side}_${n}`,s5SuddenDeathOriginalId:String(p.id||p.playerId||'')});

  function normalizeHistory(){
    if(!state||!Array.isArray(state.history))return;
    for(const h of state.history){
      if(h?.user?.s5SuddenDeathOriginalId){const p=originalFor(originalUser,h.user.s5SuddenDeathOriginalId);if(p)h.user=p}
      if(h?.cpu?.s5SuddenDeathOriginalId){const p=originalFor(originalCpu,h.cpu.s5SuddenDeathOriginalId);if(p)h.cpu=p}
    }
  }
  function restoreTeams(){
    if(originalUser)userTeam=[...originalUser];
    if(originalCpu)cpuTeam=[...originalCpu];
    normalizeHistory();
    if(state){state.s5SuddenDeath=false;state.s5SuddenDeathRank=null;state.s5SuddenDeathAttempt=null}
  }
  function reset(){active=false;attempt=0;originalUser=null;originalCpu=null}

  function beginSuddenDeath(){
    if(!originalUser)originalUser=[...(Array.isArray(userTeam)?userTeam:[])];
    if(!originalCpu)originalCpu=[...(Array.isArray(cpuTeam)?cpuTeam:[])];
    const ur=ranked(originalUser),cr=ranked(originalCpu);if(!ur.length||!cr.length)return false;
    const rank=attempt%Math.min(ur.length,cr.length),uBase=ur[rank],cBase=cr[rank];
    attempt++;
    const u=cloneFor(uBase,'u',attempt),c=cloneFor(cBase,'c',attempt);
    userTeam=originalUser.map(p=>p===uBase?u:p);
    cpuTeam=originalCpu.map(p=>p===cBase?c:p);
    state.usedUser=new Set(userTeam.filter(p=>p!==u).map(p=>p.id));
    state.usedCpu=new Set(cpuTeam.filter(p=>p!==c).map(p=>p.id));
    state.overtime=true;
    state.s5SuddenDeath=true;
    state.s5SuddenDeathRank=rank;
    state.s5SuddenDeathAttempt=attempt;
    state.quarter=(Number(state.maxRounds)||4)+1+attempt;
    try{showScreen('game')}catch{}
    try{beginQuarter()}catch{return false}
    try{window.scrollTo({top:0,behavior:'instant'})}catch{}
    return true;
  }

  /* Registered before the gameplay core's presentation/season listeners. If a five-card
     overtime game is still tied, stop the normal final handoff and reopen gameplay. */
  window.addEventListener('s5:game-finished',e=>{
    if(!state)return;
    const tied=Number(state.userScore)===Number(state.cpuScore);
    const eligible=!state.noOvertime&&!!state.overtime;
    if(tied&&eligible){
      e.stopImmediatePropagation();
      active=true;
      if(!beginSuddenDeath()){restoreTeams();reset()}
      return;
    }
    if(active){restoreTeams();reset()}
  });

  window.addEventListener('s5:matchup-start',()=>{
    if(!state?.s5SuddenDeath)return;
    const q=document.getElementById('quarterLabel'),inst=document.getElementById('instruction');
    if(q)q.textContent='SUDDEN DEATH';
    const ur=ranked(originalUser),rank=Number(state.s5SuddenDeathRank)||0,p=ur[rank];
    if(inst)inst.textContent=`Sudden death — ${p?.name||'your player'} returns. Tap to play.`;
  });

  window.addEventListener('s5:game-start',()=>reset());
})();
