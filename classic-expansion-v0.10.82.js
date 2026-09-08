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
      ['Kevin Johnson','PG',[20,15,11,5,28,20,28],25,'kevin-johnson'],
      ['Dan Majerle','SG',[18,18,21,18,20,21,26],24,'dan-majerle'],
      ['Richard Dumas','SF',[23,22,11,21,12,25,29],21,'richard-dumas'],
      ['Charles Barkley','PF',[25,28,18,27,23,24,26],29,'charles-barkley'],
      ['Mark West','C',[8,16,11,26,5,29,5],18,'mark-west']
    ]
  });

  const okc=makeTeam({
    id:'classic-okc-2012',team:'Oklahoma City Thunder 2012',short:'Thunder 2012',season:'2012',
    logo:'assets/team-logos/classic/oklahoma-city-thunder-2012-v1.png',theme:{a:'#007AC1',b:'#EF3B24',c:'#FDBB30'},
    rows:[
      ['Russell Westbrook','PG',[25,28,18,19,24,18,28],28,'russell-westbrook'],
      ['James Harden','SG',[21,21,21,20,22,17,23],25,'james-harden-2012'],
      ['Kevin Durant','SF',[27,24,21,24,20,25,23],30,'kevin-durant-2012'],
      ['Serge Ibaka','PF',[15,24,15,26,5,30,15],24,'serge-ibaka'],
      ['Kendrick Perkins','C',[5,14,11,25,11,27,8],17,'kendrick-perkins-2012']
    ]
  });

  const houston=makeTeam({
    id:'classic-hou-2009',team:'Houston Rockets 2009',short:'Rockets 2009',season:'2009',
    logo:'assets/team-logos/classic/houston-rockets-2009-v1.png',theme:{a:'#CE1141',b:'#000000',c:'#C4CED4'},
    rows:[
      ['Aaron Brooks','PG',[19,16,21,5,22,10,16],20,'aaron-brooks'],
      ['Tracy McGrady','SG',[19,18,19,20,24,22,24],24,'tracy-mcgrady'],
      ['Ron Artest','SF',[20,18,22,21,20,20,26],24,'ron-artest'],
      ['Luis Scola','PF',[18,15,11,26,15,16,19],21,'luis-scola'],
      ['Yao Ming','C',[23,22,11,26,14,28,5],27,'yao-ming']
    ]
  });

  const detroit=makeTeam({
    id:'classic-det-1999',team:'Detroit Pistons 1999',short:'Pistons 1999',season:'1999',
    logo:'assets/team-logos/classic/detroit-pistons-1999-v1.png',theme:{a:'#006A6A',b:'#9D2235',c:'#F4A261'},
    rows:[
      ['Lindsey Hunter','PG',[12,15,19,12,21,14,28],20,'lindsey-hunter'],
      ['Jerry Stackhouse','SG',[20,22,18,10,20,22,20],22,'jerry-stackhouse'],
      ['Grant Hill','SF',[23,27,11,23,25,21,27],29,'grant-hill'],
      ['Christian Laettner','PF',[16,13,16,21,19,25,27],19,'christian-laettner'],
      ['Mikki Moore','C',[25,12,11,22,5,5,5],14,'mikki-moore']
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
