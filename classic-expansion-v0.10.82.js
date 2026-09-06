/* NBA Starting5 v0.10.82 — Phoenix '93, Oklahoma City '12, Houston '09, Detroit '99 Classic Teams */
(()=>{
  if(window.__starting5ClassicExpansionV01082)return;
  window.__starting5ClassicExpansionV01082=true;

  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const makeTeam=(cfg)=>{
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
    return {team,added};
  };

  const phoenix=makeTeam({
    id:'classic-phx-1993',team:'Phoenix Suns 1993',short:'Suns 1993',season:'1993',
    logo:'assets/team-logos/classic/phoenix-suns-1993-v1.png',theme:{a:'#1D1160',b:'#E56020',c:'#F9A01B'},
    rows:[
      ['Kevin Johnson','PG',[16,15,15,7,27,5,18],25,'kevin-johnson'],
      ['Dan Majerle','SG',[17,18,27,10,13,7,18],24,'dan-majerle'],
      ['Richard Dumas','SF',[16,22,8,9,7,10,16],21,'richard-dumas'],
      ['Charles Barkley','PF',[26,28,13,27,15,11,22],29,'charles-barkley'],
      ['Mark West','C',[6,16,1,17,3,23,8],18,'mark-west']
    ]
  });

  const okc=makeTeam({
    id:'classic-okc-2012',team:'Oklahoma City Thunder 2012',short:'Thunder 2012',season:'2012',
    logo:'assets/team-logos/classic/oklahoma-city-thunder-2012-v1.png',theme:{a:'#007AC1',b:'#EF3B24',c:'#FDBB30'},
    rows:[
      ['Russell Westbrook','PG',[24,28,13,12,24,6,25],28,'russell-westbrook'],
      ['James Harden','SG',[17,21,24,10,16,8,20],25,'james-harden-2012'],
      ['Kevin Durant','SF',[28,24,26,18,16,18,18],30,'kevin-durant-2012'],
      ['Serge Ibaka','PF',[10,24,2,20,4,30,13],24,'serge-ibaka'],
      ['Kendrick Perkins','C',[5,14,1,15,4,19,9],17,'kendrick-perkins-2012']
    ]
  });

  const houston=makeTeam({
    id:'classic-hou-2009',team:'Houston Rockets 2009',short:'Rockets 2009',season:'2009',
    logo:'assets/team-logos/classic/houston-rockets-2009-v1.png',theme:{a:'#CE1141',b:'#000000',c:'#C4CED4'},
    rows:[
      ['Aaron Brooks','PG',[11,16,21,5,17,4,12],20,'aaron-brooks'],
      ['Tracy McGrady','SG',[16,18,18,11,19,10,18],24,'tracy-mcgrady'],
      ['Ron Artest','SF',[17,18,21,12,12,13,24],24,'ron-artest'],
      ['Luis Scola','PF',[13,15,2,20,8,8,13],21,'luis-scola'],
      ['Yao Ming','C',[20,22,2,23,6,24,10],27,'yao-ming']
    ]
  });

  const detroit=makeTeam({
    id:'classic-det-1999',team:'Detroit Pistons 1999',short:'Pistons 1999',season:'1999',
    logo:'assets/team-logos/classic/detroit-pistons-1999-v1.png',theme:{a:'#006A6A',b:'#9D2235',c:'#F4A261'},
    rows:[
      ['Lindsey Hunter','PG',[11,15,20,6,14,5,20],20,'lindsey-hunter'],
      ['Jerry Stackhouse','SG',[15,22,18,8,14,9,16],22,'jerry-stackhouse'],
      ['Grant Hill','SF',[21,27,12,19,22,16,24],29,'grant-hill'],
      ['Christian Laettner','PF',[12,13,10,14,10,9,12],19,'christian-laettner'],
      ['Mikki Moore','C',[3,12,1,10,3,14,7],14,'mikki-moore']
    ]
  });

  const all=[...phoenix.added,...okc.added,...houston.added,...detroit.added];
  const overallMap=new Map(all.map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const previousOverall=window.courtsideOverall;
  window.courtsideOverall=function(p){
    const v=overallMap.get(`${p?.teamId||''}|${p?.name||''}`);
    if(Number.isFinite(v))return v;
    return typeof previousOverall==='function'?previousOverall(p):p?.overall||0;
  };

  window.COURTSIDE_PHOENIX_1993_PLAYERS=phoenix.added;
  window.COURTSIDE_PHOENIX_1993_TEAM=phoenix.team;
  window.COURTSIDE_OKC_2012_PLAYERS=okc.added;
  window.COURTSIDE_OKC_2012_TEAM=okc.team;
  window.COURTSIDE_HOUSTON_2009_PLAYERS=houston.added;
  window.COURTSIDE_HOUSTON_2009_TEAM=houston.team;
  window.COURTSIDE_DETROIT_1999_PLAYERS=detroit.added;
  window.COURTSIDE_DETROIT_1999_TEAM=detroit.team;
})();
