/* NBA Starting5 v0.10.84 — New York Knicks 1994 + Atlanta Hawks 1993 Classic Teams */
(()=>{
  if(window.__starting5ClassicExpansionV01084)return;
  window.__starting5ClassicExpansionV01084=true;
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const makeTeam=cfg=>{
    const added=cfg.rows.map(([name,position,ratings,overall,slug])=>{
      const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
      return {id:`${cfg.id}-${position.toLowerCase()}`,name,team:cfg.team,teamShort:cfg.short,season:cfg.season,teamId:cfg.id,
        playerId:`classic-${slug}-${cfg.season}`,stats,position,artSlug:`${slug}-${cfg.season}`,
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
    ['Derek Harper','PG',[13,8,18,6,21,5,24],21,'derek-harper'],
    ['John Starks','SG',[18,18,24,7,16,6,25],24,'john-starks'],
    ['Charles Smith','SF',[12,15,4,12,7,12,11],18,'charles-smith'],
    ['Charles Oakley','PF',[11,16,1,28,8,14,20],23,'charles-oakley'],
    ['Patrick Ewing','C',[24,24,1,27,9,29,17],29,'patrick-ewing']
  ]});
  const hawks=makeTeam({id:'classic-atl-1993',team:'Atlanta Hawks 1993',short:'Hawks 1993',season:'1993',logo:'assets/team-logos/classic/atlanta-hawks-1993.png',theme:{a:'#E03A3E',b:'#FFFFFF',c:'#FDB927'},rows:[
    ['Mookie Blaylock','PG',[13,8,20,8,24,5,30],24,'mookie-blaylock'],
    ['Stacey Augmon','SG',[13,22,5,12,8,11,20],20,'stacey-augmon'],
    ['Dominique Wilkins','SF',[27,30,16,18,10,11,18],29,'dominique-wilkins'],
    ['Kevin Willis','PF',[17,21,1,29,7,15,12],25,'kevin-willis'],
    ['Jon Koncak','C',[7,12,0,16,4,20,8],17,'jon-koncak']
  ]});
  const all=[...knicks.added,...hawks.added];
  const overallMap=new Map(all.map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const prevOverall=window.courtsideOverall;
  window.courtsideOverall=p=>overallMap.get(`${p?.teamId||''}|${p?.name||''}`) ?? (typeof prevOverall==='function'?prevOverall(p):p?.overall||0);
  const logoMap=new Map([[knicks.team.id,knicks.team.logo],[hawks.team.id,hawks.team.logo]]);
  const prevLogo=window.logoUrl;
  const resolveLogo=p=>logoMap.get(p?.teamId)||(typeof prevLogo==='function'?prevLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo}catch{} window.logoUrl=resolveLogo;
  window.COURTSIDE_CLASSIC_EXPANSION_V01084={teams:[knicks.team,hawks.team],players:all};
})();
