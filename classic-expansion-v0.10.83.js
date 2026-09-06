/* NBA Starting5 v0.10.83 — Orlando 1995, Charlotte Bobcats 2007, LA Clippers 2014 Classic Teams */
(()=>{
  if(window.__starting5ClassicExpansionV01083)return;
  window.__starting5ClassicExpansionV01083=true;
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
  const orlando=makeTeam({id:'classic-orl-1995',team:'Orlando Magic 1995',short:'Magic 1995',season:'1995',logo:'assets/team-logos/classic/orlando-magic-1995.png',theme:{a:'#0077C0',b:'#C4CED4',c:'#000000'},rows:[
    ['Penny Hardaway','PG',[21,24,12,10,24,11,25],27,'penny-hardaway'],
    ['Nick Anderson','SG',[16,18,25,11,11,8,24],23,'nick-anderson'],
    ['Dennis Scott','SF',[13,9,30,8,9,7,14],20,'dennis-scott'],
    ['Horace Grant','PF',[13,18,2,22,9,18,18],22,'horace-grant'],
    ["Shaquille O'Neal",'C',[29,30,0,29,11,27,16],30,'shaquille-oneal']
  ]});
  const bobcats=makeTeam({id:'classic-cha-2007',team:'Charlotte Bobcats 2007',short:'Bobcats 2007',season:'2007',logo:'assets/team-logos/classic/charlotte-bobcats-2007.png',theme:{a:'#F26522',b:'#1D428A',c:'#A1A1A4'},rows:[
    ['Raymond Felton','PG',[14,15,17,7,19,5,18],20,'raymond-felton'],
    ['Brevin Knight','SG',[10,4,5,8,23,4,25],18,'brevin-knight'],
    ['Adam Morrison','SF',[12,8,17,6,7,6,8],16,'adam-morrison'],
    ['Gerald Wallace','PF',[18,27,14,17,9,21,30],26,'gerald-wallace'],
    ['Emeka Okafor','C',[15,22,0,26,5,28,12],24,'emeka-okafor']
  ]});
  const clippers=makeTeam({id:'classic-lac-2014',team:'Los Angeles Clippers 2014',short:'Clippers 2014',season:'2014',logo:'assets/team-logos/classic/los-angeles-clippers-2014.png',theme:{a:'#ED174C',b:'#006BB6',c:'#FFFFFF'},rows:[
    ['Chris Paul','PG',[19,11,26,10,30,5,30],29,'chris-paul'],
    ['JJ Redick','SG',[15,5,29,5,9,4,9],21,'jj-redick'],
    ['Matt Barnes','SF',[10,17,17,10,7,10,15],18,'matt-barnes'],
    ['Blake Griffin','PF',[24,30,4,22,15,14,17],28,'blake-griffin'],
    ['DeAndre Jordan','C',[10,30,0,30,4,30,15],26,'deandre-jordan']
  ]});
  const all=[...orlando.added,...bobcats.added,...clippers.added];
  const overallMap=new Map(all.map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const prevOverall=window.courtsideOverall;
  window.courtsideOverall=p=>overallMap.get(`${p?.teamId||''}|${p?.name||''}`) ?? (typeof prevOverall==='function'?prevOverall(p):p?.overall||0);
  const logoMap=new Map([[orlando.team.id,orlando.team.logo],[bobcats.team.id,bobcats.team.logo],[clippers.team.id,clippers.team.logo]]);
  const prevLogo=window.logoUrl;
  const resolveLogo=p=>logoMap.get(p?.teamId)||(typeof prevLogo==='function'?prevLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo}catch{} window.logoUrl=resolveLogo;
  window.COURTSIDE_CLASSIC_EXPANSION_V01083={teams:[orlando.team,bobcats.team,clippers.team],players:all};
})();
