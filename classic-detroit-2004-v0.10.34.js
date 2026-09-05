/* NBA Courtside v0.10.34 — Detroit Pistons 2004 Classic Team */
(()=>{
  if(window.__courtsideDetroit2004V01034)return;
  window.__courtsideDetroit2004V01034=true;

  const TEAM_ID='classic-det-2004';
  const LOGO='assets/team-logos/classic/detroit-pistons-2004.svg';
  const theme={a:'#1D428A',b:'#C8102E',c:'#B3B2B1'};

  /*
    2003-04 regular-season source basis:
    Billups 16.9 PPG / 3.5 RPG / 5.7 APG / 1.1 SPG / 0.1 BPG / 1.7 3PM on 4.3 3PA (.388)
    Hamilton 17.6 / 3.6 / 4.0 / 1.3 / 0.2 / 0.2 on 0.9 (.265)
    Prince 10.3 / 4.8 / 2.3 / 0.8 / 0.8 / 0.7 on 1.9 (.363)
    Rasheed Wallace uses his Detroit-only 22-game regular-season segment: 13.7 / 7.0 / 1.8 / 1.1 / 2.0 / 1.0 on 3.1 (.319)
    Ben Wallace 9.5 / 12.4 / 1.7 / 1.8 / 3.0 / 0.0 on 0.1 (.125)

    Ratings follow the approved Courtside systems:
    scoring = nearest whole PPG; rebounding = round(RPG*30/13);
    passing = round(30*(APG/10.5)^.75); blocks = round(30*sqrt(BPG/3));
    steals = round(30*(SPG/2)^.60); 3PT uses the approved era-relative model;
    dunking remains subjective using reputation/athleticism/role.
  */
  const rows=[
    ['Chauncey Billups','PG',[17,12,26,8,19,5,21],23],
    ['Richard Hamilton','SG',[18,14,10,8,15,8,23],21],
    ['Tayshaun Prince','SF',[10,18,20,11,10,15,17],20],
    ['Rasheed Wallace','PF',[14,24,18,16,8,24,21],24],
    ['Ben Wallace','C',[10,25,7,29,8,30,28],27]
  ];
  const slugs={
    'Chauncey Billups':'chauncey-billups',
    'Richard Hamilton':'richard-hamilton',
    'Tayshaun Prince':'tayshaun-prince',
    'Rasheed Wallace':'rasheed-wallace',
    'Ben Wallace':'ben-wallace'
  };
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  const team={id:TEAM_ID,team:'Detroit Pistons 2004',short:'Pistons 2004',season:'2004',logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])};
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};
    keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {
      id:`${TEAM_ID}-${position.toLowerCase()}`,
      name,
      team:'Detroit Pistons 2004',
      teamShort:'Pistons 2004',
      season:'2004',
      teamId:TEAM_ID,
      playerId:`classic-${slugs[name]}`,
      stats,
      position,
      artSlug:slugs[name],
      art:{x:'50%',y:'100%',s:.78,r:0},
      theme:{...theme},
      set:'Classic Teams',
      classicTeam:true,
      classicLogo:LOGO,
      overall
    };
  });

  try{players.push(...added);}catch{}
  if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))window.COURTSIDE_CLASSIC_PLAYERS.push(...added);
  else window.COURTSIDE_CLASSIC_PLAYERS=[...added];
  if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.push(team);
  else window.COURTSIDE_CLASSIC_TEAMS=[team];
  if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))window.COURTSIDE_FOUNDATION_PLAYERS.push(...added);

  /* Preserve the approved overall hierarchy for the new five cards. */
  const overallByName=new Map(added.map(p=>[p.name,p.overall]));
  const previousOverall=window.courtsideOverall;
  window.courtsideOverall=function(p){
    if(p?.teamId===TEAM_ID){const v=overallByName.get(p.name);if(Number.isFinite(v))return v;}
    return typeof previousOverall==='function'?previousOverall(p):p?.overall||0;
  };

  /* Make the local 2004 logo available to every scoreboard/card path immediately. */
  const previousLogo=window.logoUrl;
  const resolveLogo=p=>p?.teamId===TEAM_ID?LOGO:(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_DETROIT_2004_PLAYERS=added;
  window.COURTSIDE_DETROIT_2004_TEAM=team;
})();
