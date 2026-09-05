/* NBA Courtside v0.9.31 — keep current 30 first, then Classic Teams alphabetically */
(()=>{
  const POS={PG:0,SG:1,SF:2,PF:3,C:4};
  const current=players.filter(p=>!p.classicTeam);
  const classic=players.filter(p=>p.classicTeam).sort((a,b)=>{
    const teamCmp=String(a.team).localeCompare(String(b.team));
    if(teamCmp)return teamCmp;
    return (POS[a.position]??99)-(POS[b.position]??99);
  });
  players.splice(0,players.length,...current,...classic);

  if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS)){
    window.COURTSIDE_CLASSIC_PLAYERS.splice(0,window.COURTSIDE_CLASSIC_PLAYERS.length,...classic);
  }
  if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)){
    window.COURTSIDE_CLASSIC_TEAMS.sort((a,b)=>String(a.team).localeCompare(String(b.team)));
  }
  if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS)){
    const base=window.COURTSIDE_FOUNDATION_PLAYERS.filter(p=>!p.classicTeam);
    window.COURTSIDE_FOUNDATION_PLAYERS.splice(0,window.COURTSIDE_FOUNDATION_PLAYERS.length,...base,...classic);
  }
})();
