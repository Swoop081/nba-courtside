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
    ['Penny Hardaway','PG',[22,24,19,17,26,18,27],27,'penny-hardaway'],
    ['Nick Anderson','SG',[19,18,23,19,22,19,28],23,'nick-anderson'],
    ['Dennis Scott','SF',[21,9,28,15,19,18,21],20,'dennis-scott'],
    ['Horace Grant','PF',[15,18,11,25,17,25,20],22,'horace-grant'],
    ["Shaquille O'Neal",'C',[28,30,11,26,19,29,19],30,'shaquille-oneal']
  ]});
  const bobcats=makeTeam({id:'classic-cha-2007',team:'Charlotte Bobcats 2007',short:'Bobcats 2007',season:'2007',logo:'assets/team-logos/classic/charlotte-bobcats-2007.png',theme:{a:'#F26522',b:'#1D428A',c:'#A1A1A4'},rows:[
    ['Raymond Felton','PG',[16,15,19,14,26,10,26],20,'raymond-felton'],
    ['Brevin Knight','SG',[12,4,11,12,28,10,28],18,'brevin-knight'],
    ['Adam Morrison','SF',[17,8,19,15,18,10,5],16,'adam-morrison'],
    ['Gerald Wallace','PF',[20,27,18,23,18,24,28],26,'gerald-wallace'],
    ['Emeka Okafor','C',[18,22,11,27,8,29,19],24,'emeka-okafor']
  ]});
  const clippers=makeTeam({id:'classic-lac-2014',team:'Los Angeles Clippers 2014',short:'Clippers 2014',season:'2014',logo:'assets/team-logos/classic/los-angeles-clippers-2014.png',theme:{a:'#ED174C',b:'#006BB6',c:'#FFFFFF'},rows:[
    ['Chris Paul','PG',[22,11,19,18,30,8,29],29,'chris-paul'],
    ['JJ Redick','SG',[21,5,24,5,19,8,20],21,'jj-redick'],
    ['Matt Barnes','SF',[15,17,21,22,18,22,22],18,'matt-barnes'],
    ['Blake Griffin','PF',[25,30,16,25,21,23,22],28,'blake-griffin'],
    ['DeAndre Jordan','C',[10,30,11,28,5,29,20],26,'deandre-jordan']
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
