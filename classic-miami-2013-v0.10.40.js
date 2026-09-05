/* NBA Courtside v0.10.40 — Miami Heat 2013 Classic Team */
(()=>{
  if(window.__courtsideMiami2013V01040)return;
  window.__courtsideMiami2013V01040=true;

  const TEAM_ID='classic-mia-2013';
  const LOGO='assets/team-logos/classic/miami-heat-2013.svg';
  const theme={a:'#98002E',b:'#F9A01B',c:'#000000'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* 2012-13 Miami. Ratings follow the approved Courtside systems:
     scoring = nearest whole PPG; rebounding = round(RPG*30/13);
     passing = round(30*(APG/10.5)^.75), capped 30;
     blocks = round(30*sqrt(BPG/3)); steals = round(30*(SPG/2)^.60);
     3PT uses the approved efficiency/makes/attempts blend and dunking is subjective by athleticism/role/reputation. */
  const rows=[
    ['Mario Chalmers','PG',[9,8,24,5,13,8,25],21],
    ['Dwyane Wade','SG',[21,28,8,12,17,15,29],28],
    ['Shane Battier','SF',[7,10,27,5,5,15,15],19],
    ['LeBron James','PF',[27,30,25,18,23,16,27],30],
    ['Chris Bosh','C',[17,22,12,16,8,20,19],25]
  ];
  const slugs={
    'Mario Chalmers':'mario-chalmers',
    'Dwyane Wade':'dwyane-wade',
    'Shane Battier':'shane-battier',
    'LeBron James':'lebron-james-2013',
    'Chris Bosh':'chris-bosh'
  };

  const team={id:TEAM_ID,team:'Miami Heat 2013',short:'Heat 2013',season:'2013',logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])};
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {id:`${TEAM_ID}-${position.toLowerCase()}`,name,team:'Miami Heat 2013',teamShort:'Heat 2013',season:'2013',teamId:TEAM_ID,
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

  window.COURTSIDE_MIAMI_2013_PLAYERS=added;
  window.COURTSIDE_MIAMI_2013_TEAM=team;
})();
