/* NBA Starting5 v0.11.29 — Classic expansion through Bulls 2011 + Magic 2009 */
(()=>{
  if(window.__starting5ClassicExpansionV01084)return;
  window.__starting5ClassicExpansionV01084=true;
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
  const knicks=makeTeam({id:'classic-nyk-1994',team:'New York Knicks 1994',short:'Knicks 1994',season:'1994',logo:'assets/team-logos/classic/new-york-knicks-1994.png',theme:{a:'#006BB6',b:'#F58426',c:'#BEC0C2'},rows:[
    ['Derek Harper','PG',[15,8,19,5,24,8,28],21,'derek-harper'],
    ['John Starks','SG',[21,18,21,10,25,10,28],24,'john-starks'],
    ['Charles Smith','SF',[18,15,16,21,12,27,17],18,'charles-smith'],
    ['Charles Oakley','PF',[14,16,11,27,19,16,25],23,'charles-oakley'],
    ['Patrick Ewing','C',[24,24,16,26,17,29,21],29,'patrick-ewing']
  ]});
  const hawks=makeTeam({id:'classic-atl-1993',team:'Atlanta Hawks 1993',short:'Hawks 1993',season:'1993',logo:'assets/team-logos/classic/atlanta-hawks-1993.png',theme:{a:'#E03A3E',b:'#FFFFFF',c:'#FDB927'},rows:[
    ['Mookie Blaylock','PG',[16,8,19,15,28,20,29],24,'mookie-blaylock'],
    ['Stacey Augmon','SG',[20,22,11,20,19,17,27],20,'stacey-augmon'],
    ['Dominique Wilkins','SF',[28,30,20,22,20,20,20],29,'dominique-wilkins'],
    ['Kevin Willis','PF',[20,21,16,27,16,21,19],25,'kevin-willis'],
    ['Jon Koncak','C',[5,12,16,24,18,27,25],17,'jon-koncak']
  ]});
  const sixers=makeTeam({id:'classic-phi-2001',team:'Philadelphia 76ers 2001',short:'76ers 2001',season:'2001',logo:'https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg',theme:{a:'#006BB6',b:'#ED174C',c:'#FFFFFF'},rows:[
    ['Eric Snow','PG',[8,6,16,15,27,10,27],21,'eric-snow','727'],
    ['Allen Iverson','SG',[27,25,19,12,22,16,29],30,'allen-iverson','947'],
    ['George Lynch','SF',[5,13,16,24,15,20,25],19,'george-lynch','779'],
    ['Tyrone Hill','PF',[10,16,11,26,5,20,10],22,'tyrone-hill','238'],
    ['Dikembe Mutombo','C',[8,19,11,28,5,30,5],28,'dikembe-mutombo','87']
  ]});
  const knicks2012=makeTeam({id:'classic-nyk-2012',team:'New York Knicks 2012',short:'Knicks 2012',season:'2012',logo:'https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg',theme:{a:'#006BB6',b:'#F58426',c:'#BEC0C2'},rows:[
    ['Jeremy Lin','PG',[22,17,18,17,28,18,28],24,'jeremy-lin','202391'],
    ['Landry Fields','SG',[12,14,18,21,20,17,25],19,'landry-fields','202361'],
    ['Carmelo Anthony','SF',[25,21,19,23,20,21,22],29,'carmelo-anthony','2546'],
    ["Amar'e Stoudemire",'PF',[21,28,16,25,8,25,20],27,'amare-stoudemire','2405'],
    ['Tyson Chandler','C',[12,28,11,26,5,27,21],27,'tyson-chandler','2199']
  ]});
  const cavs=makeTeam({id:'classic-cle-2004',team:'Cleveland Cavaliers 2004',short:'Cavaliers 2004',season:'2004',logo:'https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg',theme:{a:'#860038',b:'#FDBB30',c:'#041E42'},rows:[
    ['Jeff McInnis','PG',[15,10,18,5,25,10,21],21,'jeff-mcinnis','686'],
    ['LeBron James','SG',[21,30,18,20,24,23,26],30,'lebron-james','2544'],
    ['Eric Williams','SF',[16,11,18,21,18,16,24],18,'eric-williams','726'],
    ['Carlos Boozer','PF',[19,21,11,27,16,24,20],25,'carlos-boozer','2430'],
    ['Zydrunas Ilgauskas','C',[20,18,11,25,11,30,10],25,'zydrunas-ilgauskas','980']
  ]});
  const bulls2011=makeTeam({id:'classic-chi-2011',team:'Chicago Bulls 2011',short:'Bulls 2011',season:'2011',logo:'assets/team-logos/classic/chicago-bulls-1998-alpha-v3.png',theme:{a:'#CE1141',b:'#000000',c:'#FFFFFF'},rows:[
    ['Derrick Rose','PG',[25,28,19,16,27,22,20],30,'derrick-rose','201565'],
    ['Keith Bogans','SG',[5,7,23,15,18,17,19],18,'keith-bogans','1903'],
    ['Luol Deng','SF',[19,19,19,21,18,22,20],25,'luol-deng','2736'],
    ['Carlos Boozer','PF',[21,20,11,26,19,19,19],25,'carlos-boozer','2430'],
    ['Joakim Noah','C',[15,20,11,27,18,27,21],27,'joakim-noah','201149']
  ]});
  const magic2009=makeTeam({id:'classic-orl-2009',team:'Orlando Magic 2009',short:'Magic 2009',season:'2009',logo:'assets/team-logos/classic/orlando-magic-2009-transparent.png',theme:{a:'#0077C0',b:'#C4CED4',c:'#000000'},rows:[
    ['Jameer Nelson','PG',[21,9,22,16,25,8,24],24,'jameer-nelson','2749'],
    ['Courtney Lee','SG',[14,16,19,11,14,17,25],20,'courtney-lee','201584'],
    ['Hedo Turkoglu','SF',[19,11,20,20,23,16,17],25,'hedo-turkoglu','2045'],
    ['Rashard Lewis','PF',[20,16,24,21,18,22,20],26,'rashard-lewis','1740'],
    ['Dwight Howard','C',[23,30,11,28,10,30,20],30,'dwight-howard','2730']
  ]});

  const all=[...knicks.added,...hawks.added,...sixers.added,...knicks2012.added,...cavs.added,...bulls2011.added,...magic2009.added];
  const overallMap=new Map(all.map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const prevOverall=window.courtsideOverall;
  window.courtsideOverall=p=>overallMap.get(`${p?.teamId||''}|${p?.name||''}`) ?? (typeof prevOverall==='function'?prevOverall(p):p?.overall||0);
  const logoMap=new Map([knicks,hawks,sixers,knicks2012,cavs,bulls2011,magic2009].map(x=>[x.team.id,x.team.logo]));
  const prevLogo=window.logoUrl;
  const resolveLogo=p=>logoMap.get(p?.teamId)||(typeof prevLogo==='function'?prevLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo}catch{} window.logoUrl=resolveLogo;

  const newPlayers=[...sixers.added,...knicks2012.added,...cavs.added,...bulls2011.added,...magic2009.added];
  const artMap=new Map(newPlayers.map(p=>[p.artSlug,`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.playerId}.png`]));
  const previousArt=window.artUrl;
  const resolveArt=p=>artMap.get(p?.artSlug)||(typeof previousArt==='function'?previousArt(p):'');
  window.artUrl=resolveArt;try{artUrl=resolveArt}catch{}

  window.COURTSIDE_CLASSIC_EXPANSION_V01084={teams:[knicks.team,hawks.team,sixers.team,knicks2012.team,cavs.team,bulls2011.team,magic2009.team],players:all};
})();
