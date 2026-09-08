/* NBA Courtside v0.10.57 — Detroit Pistons 1989 Classic Team */
(()=>{
  if(window.__courtsideDetroit1989V01057)return;
  window.__courtsideDetroit1989V01057=true;

  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const cfg={
    id:'classic-det-1989',team:'Detroit Pistons 1989',short:'Pistons 1989',season:'1989',
    logo:'https://content.sportslogos.net/logos/6/223/full/lgv5ssjmmchyoe66kkvh0tlzd.png',
    theme:{a:'#C8102E',b:'#1D42BA',c:'#FFFFFF'},
    slugs:{
      'Isiah Thomas':'isiah-thomas','Joe Dumars':'joe-dumars','Mark Aguirre':'mark-aguirre',
      'Rick Mahorn':'rick-mahorn','Bill Laimbeer':'bill-laimbeer'
    },
    rows:[
      ['Isiah Thomas','PG',[20,16,17,15,28,16,27],27],
      ['Joe Dumars','SG',[20,14,16,5,24,10,19],25],
      ['Mark Aguirre','SF',[23,20,18,21,21,21,10],22],
      ['Rick Mahorn','PF',[8,18,11,26,5,26,17],19],
      ['Bill Laimbeer','C',[18,10,18,26,18,26,10],23]
    ]
  };

  const added=cfg.rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    const slug=cfg.slugs[name];
    return {
      id:`${cfg.id}-${position.toLowerCase()}`,name,team:cfg.team,teamShort:cfg.short,season:cfg.season,teamId:cfg.id,
      playerId:`classic-${slug}`,stats,position,artSlug:slug,art:{x:'50%',y:'100%',s:.78,r:0},
      theme:{...cfg.theme},set:'Classic Teams',classicTeam:true,classicLogo:cfg.logo,overall
    };
  });
  const team={id:cfg.id,team:cfg.team,short:cfg.short,season:cfg.season,logo:cfg.logo,theme:{...cfg.theme},rows:cfg.rows.map(r=>[r[0],r[1],r[2]])};

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
  const resolveLogo=p=>p?.teamId===team.id?team.logo:(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_DETROIT_1989_PLAYERS=added;
  window.COURTSIDE_DETROIT_1989_TEAM=team;
})();
