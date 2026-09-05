/* NBA Courtside v0.10.38 — Charlotte Hornets 1993 Classic Team */
(()=>{
  if(window.__courtsideCharlotte1993V01038)return;
  window.__courtsideCharlotte1993V01038=true;

  const TEAM_ID='classic-cha-1993';
  const LOGO='assets/team-logos/classic/charlotte-hornets-1993.svg';
  const theme={a:'#00788C',b:'#6A2C91',c:'#FFFFFF'};
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  /* 1992-93 Charlotte. Regular-season source basis:
     Muggsy Bogues 10.0 PPG / 3.7 RPG / 8.8 APG / 2.0 SPG / 0.1 BPG / 0.1 3PM on 0.3 3PA (.231)
     Kendall Gill 16.9 / 4.9 / 3.9 / 1.4 / 0.5 / 0.2 on 0.9 (.274)
     Johnny Newman ~12.0 / 2.2 / 1.9 / 0.7 / 0.3 / 0.2 on ~0.7 (.267)
     Larry Johnson 22.1 / 10.5 / 4.3 / 0.6 / 0.3 / 0.2 on 0.9 (.254)
     Alonzo Mourning 21.0 / 10.3 / 1.0 / 0.3 / 3.5 / 0.0 on 0.0 (.000)

     Ratings follow the approved Courtside systems: nearest-integer PPG; rebounding
     round(RPG*30/13); passing round(30*(APG/10.5)^.75); blocks
     round(30*sqrt(BPG/3)); steals round(30*(SPG/2)^.60); era-relative 3PT;
     dunking remains subjective using athleticism, role and reputation. */
  const rows=[
    ['Muggsy Bogues','PG',[10,1,7,9,26,5,30],24],
    ['Kendall Gill','SG',[17,23,10,11,14,12,24],22],
    ['Johnny Newman','SF',[12,18,10,5,8,10,16],18],
    ['Larry Johnson','PF',[22,28,9,24,15,9,15],27],
    ['Alonzo Mourning','C',[21,27,1,24,5,30,10],28]
  ];
  const slugs={
    'Muggsy Bogues':'muggsy-bogues',
    'Kendall Gill':'kendall-gill',
    'Johnny Newman':'johnny-newman',
    'Larry Johnson':'larry-johnson',
    'Alonzo Mourning':'alonzo-mourning'
  };

  const team={id:TEAM_ID,team:'Charlotte Hornets 1993',short:'Hornets 1993',season:'1993',logo:LOGO,theme:{...theme},rows:rows.map(r=>[r[0],r[1],r[2]])};
  const added=rows.map(([name,position,ratings,overall])=>{
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=ratings[i]);
    return {
      id:`${TEAM_ID}-${position.toLowerCase()}`,
      name,team:'Charlotte Hornets 1993',teamShort:'Hornets 1993',season:'1993',teamId:TEAM_ID,
      playerId:`classic-${slugs[name]}`,stats,position,artSlug:slugs[name],
      art:{x:'50%',y:'100%',s:.78,r:0},theme:{...theme},set:'Classic Teams',classicTeam:true,
      classicLogo:LOGO,overall
    };
  });

  try{players.push(...added);}catch{}
  if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))window.COURTSIDE_CLASSIC_PLAYERS.push(...added);else window.COURTSIDE_CLASSIC_PLAYERS=[...added];
  if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.push(team);else window.COURTSIDE_CLASSIC_TEAMS=[team];
  if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))window.COURTSIDE_FOUNDATION_PLAYERS.push(...added);

  const overallMap=new Map(added.map(p=>[p.name,p.overall]));
  const previousOverall=window.courtsideOverall;
  window.courtsideOverall=function(p){
    if(p?.teamId===TEAM_ID){const v=overallMap.get(p.name);if(Number.isFinite(v))return v;}
    return typeof previousOverall==='function'?previousOverall(p):p?.overall||0;
  };

  const previousLogo=window.logoUrl;
  const resolveLogo=p=>p?.teamId===TEAM_ID?LOGO:(typeof previousLogo==='function'?previousLogo(p):(p?.classicLogo||''));
  try{logoUrl=resolveLogo;}catch{}
  window.logoUrl=resolveLogo;

  window.COURTSIDE_CHARLOTTE_1993_PLAYERS=added;
  window.COURTSIDE_CHARLOTTE_1993_TEAM=team;
})();
