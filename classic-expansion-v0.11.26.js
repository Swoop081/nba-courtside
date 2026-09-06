/* NBA Starting5 v0.11.26 — Philadelphia 2001, New York 2012, Cleveland 2004 Classic Teams */
(()=>{
  if(window.__starting5ClassicExpansionV01126)return;
  window.__starting5ClassicExpansionV01126=true;
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const makeTeam=cfg=>{
    const added=cfg.rows.map(([name,position,ratings,overall,slug,pid])=>{
      const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
      return {id:`${cfg.id}-${position.toLowerCase()}`,name,team:cfg.team,teamShort:cfg.short,season:cfg.season,teamId:cfg.id,
        playerId:pid||`classic-${slug}-${cfg.season}`,stats,position,artSlug:`${slug}-${cfg.season}`,
        art:{x:'50%',y:'100%',s:.78,r:0},theme:{...cfg.theme},set:'Classic Teams',classicTeam:true,classicLogo:cfg.logo,overall};
    });
    const team={id:cfg.id,team:cfg.team,short:cfg.short,season:cfg.season,logo:cfg.logo,theme:{...cfg.theme},rows:cfg.rows.map(r=>[r[0],r[1],r[2]])};
    try{players.push(...added)}catch{}
    if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))window.COURTSIDE_CLASSIC_PLAYERS.push(...added);else window.COURTSIDE_CLASSIC_PLAYERS=[...added];
    if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.push(team);else window.COURTSIDE_CLASSIC_TEAMS=[team];
    if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))window.COURTSIDE_FOUNDATION_PLAYERS.push(...added);
    return {team,added};
  };

  const sixers=makeTeam({id:'classic-phi-2001',team:'Philadelphia 76ers 2001',short:'76ers 2001',season:'2001',logo:'https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg',theme:{a:'#006BB6',b:'#ED174C',c:'#FFFFFF'},rows:[
    ['Eric Snow','PG',[11,6,10,6,24,4,24],21,'eric-snow','727'],
    ['Allen Iverson','SG',[30,25,18,9,22,5,30],30,'allen-iverson','947'],
    ['George Lynch','SF',[10,13,8,18,8,9,20],19,'george-lynch','779'],
    ['Tyrone Hill','PF',[12,16,1,27,6,13,14],22,'tyrone-hill','238'],
    ['Dikembe Mutombo','C',[14,19,0,30,5,30,14],28,'dikembe-mutombo','87']
  ]});

  const knicks=makeTeam({id:'classic-nyk-2012',team:'New York Knicks 2012',short:'Knicks 2012',season:'2012',logo:'https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg',theme:{a:'#006BB6',b:'#F58426',c:'#BEC0C2'},rows:[
    ['Jeremy Lin','PG',[20,17,19,7,25,4,19],24,'jeremy-lin','202391'],
    ['Landry Fields','SG',[11,14,14,14,10,6,13],19,'landry-fields','202361'],
    ['Carmelo Anthony','SF',[28,21,24,14,12,7,15],29,'carmelo-anthony','2546'],
    ["Amar'e Stoudemire",'PF',[23,28,3,21,8,16,12],27,'amare-stoudemire','2405'],
    ['Tyson Chandler','C',[14,28,0,29,5,28,14],27,'tyson-chandler','2199']
  ]});

  const cavs=makeTeam({id:'classic-cle-2004',team:'Cleveland Cavaliers 2004',short:'Cavaliers 2004',season:'2004',logo:'https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg',theme:{a:'#860038',b:'#FDBB30',c:'#041E42'},rows:[
    ['Jeff McInnis','PG',[14,10,17,5,22,3,16],21,'jeff-mcinnis','686'],
    ['LeBron James','SG',[27,30,18,18,23,18,26],30,'lebron-james','2544'],
    ['Eric Williams','SF',[10,11,14,9,8,7,13],18,'eric-williams','726'],
    ['Carlos Boozer','PF',[19,21,2,28,10,14,13],25,'carlos-boozer','2430'],
    ['Zydrunas Ilgauskas','C',[19,18,2,24,8,27,10],25,'zydrunas-ilgauskas','980']
  ]});

  const all=[...sixers.added,...knicks.added,...cavs.added];
  const overallMap=new Map(all.map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const prevOverall=window.courtsideOverall;
  window.courtsideOverall=p=>overallMap.get(`${p?.teamId||''}|${p?.name||''}`) ?? (typeof prevOverall==='function'?prevOverall(p):p?.overall||0);

  const logoMap=new Map([[sixers.team.id,sixers.team.logo],[knicks.team.id,knicks.team.logo],[cavs.team.id,cavs.team.logo]]);
  const prevLogo=window.logoUrl;
  const resolveLogo=p=>logoMap.get(p?.teamId)||(typeof prevLogo==='function'?prevLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo}catch{} window.logoUrl=resolveLogo;

  const artMap=new Map(all.map(p=>[p.artSlug,`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.playerId}.png`]));
  const prevArt=window.artUrl;
  window.artUrl=function(p){
    const u=artMap.get(p?.artSlug);if(u)return u;
    return typeof prevArt==='function'?prevArt(p):'';
  };
  try{artUrl=window.artUrl}catch{}

  window.COURTSIDE_CLASSIC_EXPANSION_V01126={teams:[sixers.team,knicks.team,cavs.team],players:all};
})();
