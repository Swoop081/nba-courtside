/* NBA Courtside v0.10.58 — Boston Celtics 2008 Classic Team */
(()=>{
  if(window.__courtsideBoston2008V01058)return;
  window.__courtsideBoston2008V01058=true;

  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const cfg={
    id:'classic-bos-2008',team:'Boston Celtics 2008',short:'Celtics 2008',season:'2008',
    logo:'https://content.sportslogos.net/logos/6/213/full/boston_celtics_logo_primary_19979720.png',
    theme:{a:'#007A33',b:'#FFFFFF',c:'#BA9653'},
    rows:[
      ['Rajon Rondo','PG',[11,18,8,10,17,8,27],23,'rajon-rondo'],
      ['Ray Allen','SG',[17,10,30,9,12,8,19],24,'ray-allen'],
      ['Paul Pierce','SF',[20,19,27,12,16,12,23],27,'paul-pierce'],
      ['Kevin Garnett','PF',[19,23,5,21,13,20,24],28,'kevin-garnett'],
      ['Kendrick Perkins','C',[7,20,1,14,6,21,11],20,'kendrick-perkins']
    ]
  };

  const added=cfg.rows.map(([name,position,ratings,overall,slug])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {
      id:`${cfg.id}-${position.toLowerCase()}`,
      name,team:cfg.team,teamShort:cfg.short,season:cfg.season,teamId:cfg.id,
      playerId:`classic-${slug}`,stats,position,artSlug:slug,
      art:{x:'50%',y:'100%',s:.78,r:0},theme:{...cfg.theme},set:'Classic Teams',
      classicTeam:true,classicLogo:cfg.logo,overall
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
  const resolveLogo=p=>p?.teamId===cfg.id?cfg.logo:(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_BOSTON_2008_PLAYERS=added;
  window.COURTSIDE_BOSTON_2008_TEAM=team;
})();
