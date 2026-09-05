/* NBA Courtside v0.10.41 — Seattle SuperSonics 1996 Classic Team */
(()=>{
  if(window.__courtsideSeattle1996V01041)return;
  window.__courtsideSeattle1996V01041=true;

  const TEAM_ID='classic-sea-1996';
  const LOGO='assets/team-logos/classic/seattle-supersonics-1996.svg';
  const theme={a:'#00653A',b:'#FFC200',c:'#D31245'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* 1995-96 Seattle. Ratings follow the approved Courtside systems:
     scoring = nearest whole PPG; rebounding = round(RPG*30/13);
     passing = round(30*(APG/10.5)^.75), capped 30;
     blocks = round(30*sqrt(BPG/3)); steals = round(30*(SPG/2)^.60);
     3PT is era-relative and dunking is subjective by athleticism/role/reputation. */
  const rows=[
    ['Gary Payton','PG',[19,18,25,9,24,9,30],29],
    ['Hersey Hawkins','SG',[16,12,28,8,11,8,26],23],
    ['Detlef Schrempf','SF',[17,16,27,12,13,8,19],24],
    ['Shawn Kemp','PF',[20,30,8,26,9,22,22],29],
    ['Ervin Johnson','C',[5,19,5,12,4,18,13],17]
  ];
  const slugs={
    'Gary Payton':'gary-payton',
    'Hersey Hawkins':'hersey-hawkins',
    'Detlef Schrempf':'detlef-schrempf',
    'Shawn Kemp':'shawn-kemp',
    'Ervin Johnson':'ervin-johnson'
  };

  const team={id:TEAM_ID,team:'Seattle SuperSonics 1996',short:'SuperSonics 1996',season:'1996',logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])};
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {id:`${TEAM_ID}-${position.toLowerCase()}`,name,team:'Seattle SuperSonics 1996',teamShort:'SuperSonics 1996',season:'1996',teamId:TEAM_ID,
      playerId:`classic-${slugs[name]}`,stats,position,artSlug:slugs[name],art:{x:'50%',y:'100%',s:.78,r:0},theme:{...theme},set:'Classic Teams',
      classicTeam:true,classicLogo:LOGO,overall};
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

  window.COURTSIDE_SEATTLE_1996_PLAYERS=added;
  window.COURTSIDE_SEATTLE_1996_TEAM=team;
})();
