/* NBA Courtside v0.10.55 — Dallas Mavericks 2011 Classic Team + duplicate-player season identity */
(()=>{
  if(window.__courtsideDallas2011V01055)return;
  window.__courtsideDallas2011V01055=true;

  const TEAM_ID='classic-dal-2011';
  const LOGO='https://content.sportslogos.net/logos/6/228/full/ifk08eam05rwxr3yhol3whdcm.png';
  const theme={a:'#00538C',b:'#B8C4CA',c:'#002B5E'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* Kidd and Marion now have multiple Classic Team cards. Keep their visible player names
     unchanged, but use season-specific internal card IDs/slugs for the new variants. Existing
     older variants also receive season-specific playerId values so saves/inspectors can
     distinguish the cards without breaking their already-installed artwork paths. */
  const allPools=[];
  try{allPools.push(players)}catch{}
  if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))allPools.push(window.COURTSIDE_CLASSIC_PLAYERS);
  if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))allPools.push(window.COURTSIDE_FOUNDATION_PLAYERS);
  const seen=new Set();
  allPools.forEach(pool=>pool.forEach(p=>{
    if(!p||seen.has(p))return;seen.add(p);
    if(p.teamId==='classic-dal-1995'&&p.name==='Jason Kidd')p.playerId='classic-jason-kidd-1995';
    if(p.teamId==='classic-phx-2007'&&p.name==='Shawn Marion')p.playerId='classic-shawn-marion-2007';
  }));

  /* 2010-11 regular-season statistical basis. Approved Courtside transforms are used for
     scoring/rebounding/passing/blocks/steals, with era/volume-aware 3PT and subjective dunking. */
  const rows=[
    ['Jason Kidd','PG',[8,6,24,10,25,11,27],24,'jason-kidd-2011'],
    ['Jason Terry','SG',[16,8,26,4,15,8,21],22,'jason-terry'],
    ['Shawn Marion','SF',[13,22,6,16,7,13,19],23,'shawn-marion-2011'],
    ['Dirk Nowitzki','PF',[23,11,26,16,11,13,13],29,'dirk-nowitzki'],
    ['Tyson Chandler','C',[10,27,5,22,3,18,13],25,'tyson-chandler']
  ];

  const added=rows.map(([name,position,ratings,overall,slug])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {id:`${TEAM_ID}-${position.toLowerCase()}`,name,team:'Dallas Mavericks 2011',teamShort:'Mavericks 2011',season:'2011',teamId:TEAM_ID,
      playerId:`classic-${slug}`,stats,position,artSlug:slug,art:{x:'50%',y:'100%',s:.78,r:0},theme:{...theme},set:'Classic Teams',
      classicTeam:true,classicLogo:LOGO,overall};
  });
  const team={id:TEAM_ID,team:'Dallas Mavericks 2011',short:'Mavericks 2011',season:'2011',logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])};

  try{players.push(...added);}catch{}
  if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))window.COURTSIDE_CLASSIC_PLAYERS.push(...added);else window.COURTSIDE_CLASSIC_PLAYERS=[...added];
  if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.push(team);else window.COURTSIDE_CLASSIC_TEAMS=[team];
  if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))window.COURTSIDE_FOUNDATION_PLAYERS.push(...added);

  const overallMap=new Map(added.map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const previousOverall=window.courtsideOverall;
  window.courtsideOverall=function(p){
    const v=overallMap.get(`${p?.teamId||''}|${p?.name||''}`);
    if(Number.isFinite(v))return v;
    return typeof previousOverall==='function'?previousOverall(p):p?.overall||0;
  };

  const previousLogo=window.logoUrl;
  const resolveLogo=p=>p?.teamId===TEAM_ID?LOGO:(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_DALLAS_2011_PLAYERS=added;
  window.COURTSIDE_DALLAS_2011_TEAM=team;
})();
