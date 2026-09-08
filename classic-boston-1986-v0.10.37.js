/* NBA Courtside v0.10.37 — Boston Celtics 1986 Classic Team */
(()=>{
  if(window.__courtsideBoston1986V01037)return;
  window.__courtsideBoston1986V01037=true;

  const TEAM_ID='classic-bos-1986';
  const LOGO='assets/team-logos/classic/boston-celtics-1986.svg';
  const theme={a:'#007A33',b:'#FFFFFF',c:'#BA9653'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* 1985-86 Boston. Ratings use the approved Courtside systems:
     scoring = nearest whole PPG; rebounding = round(RPG*30/13);
     passing = round(30*(APG/10.5)^.75), capped 30;
     blocks = round(30*sqrt(BPG/3)); steals = round(30*(SPG/2)^.60);
     3PT is era-relative and dunking is subjective by athleticism/role/reputation. */
  const rows=[
    ['Dennis Johnson','PG',[19,14,16,15,25,21,26],23],
    ['Danny Ainge','SG',[16,8,17,15,25,10,27],20],
    ['Larry Bird','SF',[25,16,18,25,25,22,28],30],
    ['Kevin McHale','PF',[23,22,11,25,19,28,5],27],
    ['Robert Parish','C',[21,21,11,26,15,27,18],24]
  ];
  const slugs={
    'Dennis Johnson':'dennis-johnson',
    'Danny Ainge':'danny-ainge',
    'Larry Bird':'larry-bird',
    'Kevin McHale':'kevin-mchale',
    'Robert Parish':'robert-parish'
  };

  const team={
    id:TEAM_ID,team:'Boston Celtics 1986',short:'Celtics 1986',season:'1986',
    logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])
  };
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {
      id:`${TEAM_ID}-${position.toLowerCase()}`,
      name,team:'Boston Celtics 1986',teamShort:'Celtics 1986',season:'1986',teamId:TEAM_ID,
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

  window.COURTSIDE_BOSTON_1986_PLAYERS=added;
  window.COURTSIDE_BOSTON_1986_TEAM=team;
})();
