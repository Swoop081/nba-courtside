/* NBA Courtside v0.10.42 — Vancouver Grizzlies 1997 Classic Team */
(()=>{
  if(window.__courtsideVancouver1997V01042)return;
  window.__courtsideVancouver1997V01042=true;

  const TEAM_ID='classic-van-1997';
  const LOGO='assets/team-logos/classic/vancouver-grizzlies-1997.svg';
  const theme={a:'#00A6B2',b:'#2E1A47',c:'#B7A57A'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* 1996-97 Vancouver. Ratings follow the approved Courtside systems:
     scoring = nearest whole PPG; rebounding = round(RPG*30/13);
     passing = round(30*(APG/10.5)^.75), capped 30;
     blocks = round(30*sqrt(BPG/3)); steals = round(30*(SPG/2)^.60);
     3PT is era-relative and dunking is subjective by athleticism/role/reputation. */
  const rows=[
    ['Greg Anthony','PG',[10,7,22,5,21,8,27],22],
    ['Anthony Peeler','SG',[14,16,27,8,14,8,25],22],
    ['Shareef Abdur-Rahim','SF',[19,26,17,16,10,17,20],26],
    ['George Lynch','PF',[8,20,11,15,8,12,24],19],
    ['Bryant Reeves','C',[16,18,6,19,9,17,13],23]
  ];
  const slugs={
    'Greg Anthony':'greg-anthony',
    'Anthony Peeler':'anthony-peeler',
    'Shareef Abdur-Rahim':'shareef-abdur-rahim',
    'George Lynch':'george-lynch',
    'Bryant Reeves':'bryant-reeves'
  };

  const team={id:TEAM_ID,team:'Vancouver Grizzlies 1997',short:'Grizzlies 1997',season:'1997',logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])};
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {id:`${TEAM_ID}-${position.toLowerCase()}`,name,team:'Vancouver Grizzlies 1997',teamShort:'Grizzlies 1997',season:'1997',teamId:TEAM_ID,
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

  window.COURTSIDE_VANCOUVER_1997_PLAYERS=added;
  window.COURTSIDE_VANCOUVER_1997_TEAM=team;
})();
