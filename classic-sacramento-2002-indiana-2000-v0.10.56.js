/* NBA Courtside v0.10.56 — Sacramento Kings 2002 + Indiana Pacers 2000 Classic Teams */
(()=>{
  if(window.__courtsideSacramento2002Indiana2000V01056)return;
  window.__courtsideSacramento2002Indiana2000V01056=true;

  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const makeTeam=cfg=>{
    const added=cfg.rows.map(([name,position,ratings,overall])=>{
      const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
      const slug=cfg.slugs[name];
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
    return {team,added};
  };

  /* 2001-02 Sacramento Kings. Ratings use the approved Courtside seven-category systems. */
  const sacramento=makeTeam({
    id:'classic-sac-2002',team:'Sacramento Kings 2002',short:'Kings 2002',season:'2002',
    logo:'https://content.sportslogos.net/logos/6/240/full/832.png',
    theme:{a:'#5A2D81',b:'#63727A',c:'#111111'},
    slugs:{
      'Mike Bibby':'mike-bibby','Doug Christie':'doug-christie','Peja Stojakovic':'peja-stojakovic',
      'Chris Webber':'chris-webber','Vlade Divac':'vlade-divac'
    },
    rows:[
      ['Mike Bibby','PG',[14,12,24,6,17,8,21],22],
      ['Doug Christie','SG',[12,17,22,11,15,9,30],24],
      ['Peja Stojakovic','SF',[21,13,29,12,10,8,21],26],
      ['Chris Webber','PF',[25,27,9,23,17,20,27],29],
      ['Vlade Divac','C',[11,18,7,19,14,19,20],24]
    ]
  });

  /* 1999-00 Indiana Pacers. Eastern Conference champions; same approved rating systems. */
  const indiana=makeTeam({
    id:'classic-ind-2000',team:'Indiana Pacers 2000',short:'Pacers 2000',season:'2000',
    logo:'https://content.sportslogos.net/logos/6/224/full/oj83q73haoquhxqfiurpfhsgf.png',
    theme:{a:'#002D62',b:'#FDBB30',c:'#BEC0C2'},
    slugs:{
      'Mark Jackson':'mark-jackson','Reggie Miller':'reggie-miller','Jalen Rose':'jalen-rose',
      'Dale Davis':'dale-davis','Rik Smits':'rik-smits'
    },
    rows:[
      ['Mark Jackson','PG',[8,8,23,9,24,5,20],23],
      ['Reggie Miller','SG',[18,10,29,7,10,9,20],25],
      ['Jalen Rose','SF',[18,17,25,11,15,13,21],25],
      ['Dale Davis','PF',[10,24,4,23,5,20,16],24],
      ['Rik Smits','C',[13,19,5,12,6,20,10],21]
    ]
  });

  const overallMap=new Map([...sacramento.added,...indiana.added].map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const previousOverall=window.courtsideOverall;
  window.courtsideOverall=function(p){
    const v=overallMap.get(`${p?.teamId||''}|${p?.name||''}`);
    if(Number.isFinite(v))return v;
    return typeof previousOverall==='function'?previousOverall(p):p?.overall||0;
  };

  const previousLogo=window.logoUrl;
  const logoMap=new Map([[sacramento.team.id,sacramento.team.logo],[indiana.team.id,indiana.team.logo]]);
  const resolveLogo=p=>logoMap.get(p?.teamId)||(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_SACRAMENTO_2002_PLAYERS=sacramento.added;
  window.COURTSIDE_SACRAMENTO_2002_TEAM=sacramento.team;
  window.COURTSIDE_INDIANA_2000_PLAYERS=indiana.added;
  window.COURTSIDE_INDIANA_2000_TEAM=indiana.team;
})();
