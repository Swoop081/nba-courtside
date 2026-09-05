/* NBA Courtside v0.10.39 — Utah Jazz 1997 Classic Team */
(()=>{
  if(window.__courtsideUtah1997V01039)return;
  window.__courtsideUtah1997V01039=true;

  const TEAM_ID='classic-uta-1997';
  const LOGO='assets/team-logos/classic/utah-jazz-1997.svg';
  const theme={a:'#002B5C',b:'#6A2C91',c:'#00A9E0'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* 1996-97 Utah. Ratings follow the approved Courtside systems:
     scoring = nearest whole PPG; rebounding = round(RPG*30/13);
     passing = round(30*(APG/10.5)^.75), capped 30;
     blocks = round(30*sqrt(BPG/3)); steals = round(30*(SPG/2)^.60);
     3PT is era-relative and dunking is subjective by athleticism/role/reputation. */
  const rows=[
    ['John Stockton','PG',[14,5,24,6,30,8,30],29],
    ['Jeff Hornacek','SG',[15,8,27,7,16,8,25],23],
    ['Bryon Russell','SF',[11,18,24,9,7,11,26],21],
    ['Karl Malone','PF',[27,26,8,23,16,13,23],30],
    ['Greg Ostertag','C',[7,20,5,17,4,24,13],19]
  ];
  const slugs={
    'John Stockton':'john-stockton',
    'Jeff Hornacek':'jeff-hornacek',
    'Bryon Russell':'bryon-russell',
    'Karl Malone':'karl-malone',
    'Greg Ostertag':'greg-ostertag'
  };

  const team={id:TEAM_ID,team:'Utah Jazz 1997',short:'Jazz 1997',season:'1997',logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])};
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {id:`${TEAM_ID}-${position.toLowerCase()}`,name,team:'Utah Jazz 1997',teamShort:'Jazz 1997',season:'1997',teamId:TEAM_ID,
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

  window.COURTSIDE_UTAH_1997_PLAYERS=added;
  window.COURTSIDE_UTAH_1997_TEAM=team;
})();
