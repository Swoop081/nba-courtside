/* NBA Courtside v0.10.35 — Phoenix Suns 2007 + Dallas Mavericks 1995 Classic Teams */
(()=>{
  if(window.__courtsidePhoenix2007Dallas1995V01035)return;
  window.__courtsidePhoenix2007Dallas1995V01035=true;

  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const makeTeam=(cfg)=>{
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

  /* 2006-07 Phoenix. Ratings use the approved Courtside systems: nearest-integer PPG,
     rebounding round(RPG*30/13), passing round(30*(APG/10.5)^.75), blocks
     round(30*sqrt(BPG/3)), steals round(30*(SPG/2)^.60), era-relative 3PT,
     and subjective dunking based on athleticism/role/reputation. */
  const phoenix=makeTeam({
    id:'classic-phx-2007',team:'Phoenix Suns 2007',short:'Suns 2007',season:'2007',
    logo:'assets/team-logos/classic/phoenix-suns-2007.svg',theme:{a:'#1D1160',b:'#E56020',c:'#F9A01B'},
    slugs:{'Steve Nash':'steve-nash','Raja Bell':'raja-bell','Shawn Marion':'shawn-marion','Boris Diaw':'boris-diaw',"Amar'e Stoudemire":'amare-stoudemire'},
    rows:[
      ['Steve Nash','PG',[19,4,30,8,30,5,17],27],
      ['Raja Bell','SG',[15,8,27,7,10,9,15],20],
      ['Shawn Marion','SF',[18,27,14,23,8,21,30],27],
      ['Boris Diaw','PF',[10,14,18,10,17,12,11],19],
      ["Amar'e Stoudemire",'C',[20,30,7,22,5,20,20],26]
    ]
  });

  /* 1994-95 Dallas. Same approved systems; 3PT values are era-relative and dunking is subjective. */
  const dallas=makeTeam({
    id:'classic-dal-1995',team:'Dallas Mavericks 1995',short:'Mavericks 1995',season:'1995',
    logo:'assets/team-logos/classic/dallas-mavericks-1995.svg',theme:{a:'#0B60AD',b:'#1F9B48',c:'#FFFFFF'},
    slugs:{'Jason Kidd':'jason-kidd','Jim Jackson':'jim-jackson','Jamal Mashburn':'jamal-mashburn','Popeye Jones':'popeye-jones','Lorenzo Williams':'lorenzo-williams'},
    rows:[
      ['Jason Kidd','PG',[12,18,17,12,24,9,29],25],
      ['Jim Jackson','SG',[26,18,24,12,14,8,13],25],
      ['Jamal Mashburn','SF',[24,22,25,9,15,8,20],26],
      ['Popeye Jones','PF',[10,16,7,24,9,9,15],18],
      ['Lorenzo Williams','C',[4,18,6,15,4,23,13],16]
    ]
  });

  const overallMap=new Map([...phoenix.added,...dallas.added].map(p=>[`${p.teamId}|${p.name}`,p.overall]));
  const previousOverall=window.courtsideOverall;
  window.courtsideOverall=function(p){
    const v=overallMap.get(`${p?.teamId||''}|${p?.name||''}`);
    if(Number.isFinite(v))return v;
    return typeof previousOverall==='function'?previousOverall(p):p?.overall||0;
  };

  const previousLogo=window.logoUrl;
  const logoMap=new Map([[phoenix.team.id,phoenix.team.logo],[dallas.team.id,dallas.team.logo]]);
  const resolveLogo=p=>logoMap.get(p?.teamId)||(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_PHOENIX_2007_PLAYERS=phoenix.added;
  window.COURTSIDE_PHOENIX_2007_TEAM=phoenix.team;
  window.COURTSIDE_DALLAS_1995_PLAYERS=dallas.added;
  window.COURTSIDE_DALLAS_1995_TEAM=dallas.team;
})();
