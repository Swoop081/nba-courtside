/* NBA Courtside v0.10.33 — five Classic Teams with deterministic local logos */
(()=>{
  if(window.__courtsideClassicTeamsV0930)return;
  window.__courtsideClassicTeamsV0930=true;
  const keys=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const LOGOS={
    tor2003:'assets/team-logos/classic/toronto-raptors-2003.svg',
    sas2005:'assets/team-logos/classic/san-antonio-spurs-2005.svg',
    chi1998:'assets/team-logos/classic/chicago-bulls-1998.svg',
    lal2002:'assets/team-logos/classic/los-angeles-lakers-2002.svg',
    hou1995:'assets/team-logos/classic/houston-rockets-1995.svg'
  };
  const teams=[
    {id:'classic-tor-2003',team:'Toronto Raptors 2003',short:'Raptors 2003',season:'2003',logo:LOGOS.tor2003,theme:{a:'#753BBD',b:'#CE1141',c:'#111111'},rows:[
      ['Alvin Williams','PG',[16,7,18,8,23,2,14]],['Vince Carter','SG',[28,30,24,18,20,10,18]],['Morris Peterson','SF',[20,18,23,15,14,7,16]],['Jerome Williams','PF',[14,24,4,28,10,12,20]],['Antonio Davis','C',[20,24,4,27,10,24,12]]
    ]},
    {id:'classic-sas-2005',team:'San Antonio Spurs 2005',short:'Spurs 2005',season:'2005',logo:LOGOS.sas2005,theme:{a:'#000000',b:'#C4CED4',c:'#6F7275'},rows:[
      ['Tony Parker','PG',[25,22,13,10,27,2,15]],['Manu Ginóbili','SG',[24,25,24,14,24,6,24]],['Bruce Bowen','SF',[13,8,23,10,9,4,28]],['Tim Duncan','PF',[28,25,8,30,22,30,16]],['Rasho Nesterović','C',[14,16,2,24,8,24,8]]
    ]},
    {id:'classic-chi-1998',team:'Chicago Bulls 1998',short:'Bulls 1998',season:'1998',logo:LOGOS.chi1998,theme:{a:'#CE1141',b:'#FFFFFF',c:'#111111'},rows:[
      ['Ron Harper','PG',[16,19,12,13,18,8,24]],['Michael Jordan','SG',[30,29,20,19,23,12,27]],['Scottie Pippen','SF',[27,27,20,24,26,16,29]],['Dennis Rodman','PF',[10,15,2,30,16,16,20]],['Luc Longley','C',[14,15,3,22,10,18,8]]
    ]},
    {id:'classic-lal-2002',team:'Los Angeles Lakers 2002',short:'Lakers 2002',season:'2002',logo:LOGOS.lal2002,theme:{a:'#552583',b:'#FDB927',c:'#111111'},rows:[
      ['Derek Fisher','PG',[18,8,25,7,20,2,18]],['Kobe Bryant','SG',[29,30,24,18,23,10,24]],['Rick Fox','SF',[16,13,21,13,14,7,20]],['Robert Horry','PF',[17,20,24,19,16,17,18]],["Shaquille O'Neal",'C',[30,30,1,30,14,28,8]]
    ]},
    {id:'classic-hou-1995',team:'Houston Rockets 1995',short:'Rockets 1995',season:'1995',logo:LOGOS.hou1995,theme:{a:'#CE1141',b:'#FDB927',c:'#111111'},rows:[
      ['Kenny Smith','PG',[19,9,26,7,23,2,12]],['Clyde Drexler','SG',[27,29,20,21,23,9,23]],['Robert Horry','SF',[19,23,23,22,14,24,20]],['Carl Herrera','PF',[13,18,2,21,8,15,10]],['Hakeem Olajuwon','C',[30,28,10,30,20,30,25]]
    ]}
  ];
  const nameCounts={};
  (players||[]).forEach(p=>{nameCounts[p.name]=(nameCounts[p.name]||0)+1;});
  teams.forEach(t=>t.rows.forEach(([name])=>{nameCounts[name]=(nameCounts[name]||0)+1;}));
  const classic=[];
  teams.forEach(t=>t.rows.forEach(([name,position,r])=>{
    const baseSlug=slug(name);
    const uniqueSlug=nameCounts[name]>1?`${baseSlug}-${t.season}`:baseSlug;
    const stats={freeThrows:1};keys.forEach((k,i)=>stats[k]=r[i]);
    classic.push({id:`${t.id}-${position.toLowerCase()}`,name,team:t.team,teamShort:t.short,season:t.season,teamId:t.id,playerId:`classic-${uniqueSlug}`,stats,position,artSlug:uniqueSlug,art:{x:'50%',y:'100%',s:.78,r:0},theme:{...t.theme},set:'Classic Teams',classicTeam:true,classicLogo:t.logo});
  }));
  players.push(...classic);
  window.COURTSIDE_CLASSIC_PLAYERS=classic;
  window.COURTSIDE_CLASSIC_TEAMS=teams;
  if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))window.COURTSIDE_FOUNDATION_PLAYERS.push(...classic);
  const fallbackLogo=typeof logoUrl==='function'?logoUrl:null;
  const classicLogoUrl=p=>p?.classicLogo||(fallbackLogo?fallbackLogo(p):'');
  try{logoUrl=classicLogoUrl;}catch{}
  window.logoUrl=classicLogoUrl;
  if(typeof cardMarkup==='function'){
    const before=cardMarkup;
    cardMarkup=function(p,o={}){
      let html=before(p,o);
      if(!p?.classicTeam)return html;
      const esc=p.classicLogo.replace(/&/g,'&amp;');
      html=html.replace(/(<img class="foundation-team-logo" src=")[^"]*(")/i,`$1${esc}$2`);
      html=html.replace('class="player-card foundation-card ','class="player-card foundation-card classic-team-card ');
      return html;
    };
  }
  const fixInspector=()=>{
    const front=document.querySelector('#foundationInspectFront .foundation-card');if(!front)return;
    const p=classic.find(x=>x.id===front.dataset.id);if(!p)return;
    const back=document.getElementById('foundationInspectBack');if(!back)return;
    const small=back.querySelector('.foundation-back-head small');if(small)small.textContent=`${p.position} · ${p.teamShort} · ${p.season}`;
    const logo=back.querySelector('.foundation-back-head img');if(logo)logo.src=p.classicLogo;
    const foot=back.querySelector('.foundation-back-foot span');if(foot)foot.textContent='CLASSIC TEAMS';
  };
  const start=()=>{fixInspector();const root=document.getElementById('foundationInspector')||document.body;new MutationObserver(()=>fixInspector()).observe(root,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
