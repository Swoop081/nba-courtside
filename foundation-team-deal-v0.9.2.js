/* NBA Courtside v0.9.2 — random full-team matchups from all 30 foundation teams */
(()=>{
  const POS_ORDER={PG:0,SG:1,SF:2,PF:3,C:4};
  const teamIds=()=>[...new Set(players.map(p=>p.teamId))];
  const lineupFor=id=>players.filter(p=>p.teamId===id).sort((a,b)=>(POS_ORDER[a.position]??99)-(POS_ORDER[b.position]??99));
  const randomIndex=n=>Math.floor(Math.random()*n);

  dealTeams=function(){
    const ids=teamIds();
    if(ids.length<2){userTeam=[];cpuTeam=[];return;}
    const userIndex=randomIndex(ids.length);
    let cpuIndex=randomIndex(ids.length-1);
    if(cpuIndex>=userIndex)cpuIndex++;
    userTeam=lineupFor(ids[userIndex]);
    cpuTeam=lineupFor(ids[cpuIndex]);
  };

  /* Seed the menu/starter preview with one genuine team rather than five mixed cards. */
  dealTeams();
  if(typeof renderStarterFive==='function'){
    try{renderStarterFive();}catch{}
  }
})();
