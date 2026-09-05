/* NBA Courtside v0.10.36 — Los Angeles Lakers 1987 Classic Team */
(()=>{
  if(window.__courtsideLakers1987V01036)return;
  window.__courtsideLakers1987V01036=true;

  const TEAM_ID='classic-lal-1987';
  const LOGO='assets/team-logos/classic/los-angeles-lakers-1987.svg';
  const theme={a:'#552583',b:'#FDB927',c:'#FFFFFF'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* 1986-87 Lakers. Ratings follow the approved Courtside systems:
     scoring = nearest whole PPG; rebounding = round(RPG*30/13);
     passing = round(30*(APG/10.5)^.75), capped 30;
     blocks = round(30*sqrt(BPG/3)); steals = round(30*(SPG/2)^.60);
     3PT is era-relative and dunking is subjective by athleticism/role/reputation. */
  const rows=[
    ['Magic Johnson','PG',[24,18,10,15,30,12,27],30],
    ['Byron Scott','SG',[17,20,20,8,13,8,25],23],
    ['James Worthy','SF',[19,27,8,13,11,17,23],26],
    ['A.C. Green','PF',[11,22,6,18,6,17,19],21],
    ['Kareem Abdul-Jabbar','C',[18,20,5,15,10,19,17],25]
  ];
  const slugs={
    'Magic Johnson':'magic-johnson',
    'Byron Scott':'byron-scott',
    'James Worthy':'james-worthy',
    'A.C. Green':'ac-green',
    'Kareem Abdul-Jabbar':'kareem-abdul-jabbar'
  };

  const team={
    id:TEAM_ID,team:'Los Angeles Lakers 1987',short:'Lakers 1987',season:'1987',
    logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])
  };
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {
      id:`${TEAM_ID}-${position.toLowerCase()}`,
      name,team:'Los Angeles Lakers 1987',teamShort:'Lakers 1987',season:'1987',teamId:TEAM_ID,
      playerId:`classic-${slugs[name]}`,stats,position,artSlug:slugs[name],
      art:{x:'50%',y:'100%',s:.78,r:0},theme:{...theme},set:'Classic Teams',classicTeam:true,
      classicLogo:LOGO,overall
    };
  });

  try{players.push(...added);}catch{}
  if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))window.COURTSIDE_CLASSIC_PLAYERS.push(...added);else window.COURTSIDE_CLASSIC_PLAYERS=[...added];
  if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.push(team);else window.COURTSIDE_CLASSIC_TEAMS=[team];
  if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))window.COURTSIDE_FOUNDATION_PLAYERS.push(...added);

  const overallMap=new Map(added.map(p=>[p.name,p.overall]));
  const previousOverall=window.courtsideOverall;
  window.courtsideOverall=function(p){
    if(p?.teamId===TEAM_ID){const v=overallMap.get(p.name);if(Number.isFinite(v))return v;}
    return typeof previousOverall==='function'?previousOverall(p):p?.overall||0;
  };

  const previousLogo=window.logoUrl;
  const resolveLogo=p=>p?.teamId===TEAM_ID?LOGO:(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_LAKERS_1987_PLAYERS=added;
  window.COURTSIDE_LAKERS_1987_TEAM=team;
})();
