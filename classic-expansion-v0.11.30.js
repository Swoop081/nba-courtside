/* NBA Starting5 v0.11.30 — Cavaliers 1993 + Spurs 1999 Classic Teams */
(()=>{
  if(window.__starting5ClassicExpansionV01130)return;
  window.__starting5ClassicExpansionV01130=true;
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const makeTeam=cfg=>{
    const added=cfg.rows.map(([name,position,ratings,overall,slug,pid])=>{
      const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
      return {id:`${cfg.id}-${position.toLowerCase()}`,name,team:cfg.team,teamShort:cfg.short,season:cfg.season,teamId:cfg.id,
        playerId:String(pid),stats,position,artSlug:`${slug}-${cfg.season}`,
        art:{x:'50%',y:'100%',s:.78,r:0},theme:{...cfg.theme},set:'Classic Teams',classicTeam:true,classicLogo:cfg.logo,overall};
    });
    const team={id:cfg.id,team:cfg.team,short:cfg.short,season:cfg.season,logo:cfg.logo,theme:{...cfg.theme},rows:cfg.rows.map(r=>[r[0],r[1],r[2]])};
    try{players.push(...added)}catch{}
    if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))window.COURTSIDE_CLASSIC_PLAYERS.push(...added);else window.COURTSIDE_CLASSIC_PLAYERS=[...added];
    if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.push(team);else window.COURTSIDE_CLASSIC_TEAMS=[team];
    if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))window.COURTSIDE_FOUNDATION_PLAYERS.push(...added);
    return {team,added};
  };

  const cavs1993=makeTeam({
    id:'classic-cle-1993',team:'Cleveland Cavaliers 1993',short:'Cavaliers 1993',season:'1993',
    logo:'assets/team-logos/classic/cleveland-cavaliers-1993-transparent.png',
    theme:{a:'#E35205',b:'#003DA5',c:'#FFFFFF'},
    rows:[
      ['Mark Price','PG',[22,7,20,8,28,14,25],28,'mark-price','899'],
      ['Craig Ehlo','SG',[16,14,19,21,20,19,26],19,'craig-ehlo','378'],
      ['Gerald Wilkins','SF',[18,23,17,15,20,18,25],22,'gerald-wilkins','786'],
      ['Larry Nance','PF',[19,28,11,25,19,29,15],25,'larry-nance','77685'],
      ['Brad Daugherty','C',[21,22,11,26,22,23,12],27,'brad-daugherty','921']
    ]
  });

  const spurs1999=makeTeam({
    id:'classic-sas-1999',team:'San Antonio Spurs 1999',short:'Spurs 1999',season:'1999',
    logo:'assets/team-logos/classic/san-antonio-spurs-1999-transparent.png',
    theme:{a:'#000000',b:'#C4CED4',c:'#EF426F'},
    rows:[
      ['Avery Johnson','PG',[10,8,15,5,27,15,21],22,'avery-johnson','422'],
      ['Mario Elie','SG',[15,10,18,16,19,17,24],21,'mario-elie','53'],
      ['Sean Elliott','SF',[16,16,18,20,19,19,8],23,'sean-elliott','251'],
      ['Tim Duncan','PF',[22,27,11,26,17,28,16],30,'tim-duncan','1495'],
      ['David Robinson','C',[20,28,11,27,18,29,27],29,'david-robinson','764']
    ]
  });

  const all=[...cavs1993.added,...spurs1999.added];
  const overallMap=new Map(all.map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const prevOverall=window.courtsideOverall;
  window.courtsideOverall=p=>overallMap.get(`${p?.teamId||''}|${p?.name||''}`) ?? (typeof prevOverall==='function'?prevOverall(p):p?.overall||0);

  const logoMap=new Map([[cavs1993.team.id,cavs1993.team.logo],[spurs1999.team.id,spurs1999.team.logo]]);
  const prevLogo=window.logoUrl;
  const resolveLogo=p=>logoMap.get(p?.teamId)||(typeof prevLogo==='function'?prevLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo}catch{} window.logoUrl=resolveLogo;

  const artMap=new Map(all.map(p=>[p.artSlug,`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.playerId}.png`]));
  const previousArt=window.artUrl;
  const resolveArt=p=>artMap.get(p?.artSlug)||(typeof previousArt==='function'?previousArt(p):'');
  window.artUrl=resolveArt;try{artUrl=resolveArt}catch{}

  window.COURTSIDE_CLASSIC_EXPANSION_V01130={teams:[cavs1993.team,spurs1999.team],players:all};
})();
