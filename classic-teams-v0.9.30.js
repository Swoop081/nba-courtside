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
      ['Alvin Williams','PG',[5,7,11,5,5,5,5]],['Vince Carter','SG',[5,30,11,5,5,5,5]],['Morris Peterson','SF',[5,18,11,5,5,5,5]],['Jerome Williams','PF',[5,24,11,5,5,5,5]],['Antonio Davis','C',[5,24,11,5,5,5,5]]
    ]},
    {id:'classic-sas-2005',team:'San Antonio Spurs 2005',short:'Spurs 2005',season:'2005',logo:LOGOS.sas2005,theme:{a:'#000000',b:'#C4CED4',c:'#6F7275'},rows:[
      ['Tony Parker','PG',[5,22,11,5,5,5,5]],['Manu Ginóbili','SG',[5,25,11,5,5,5,5]],['Bruce Bowen','SF',[5,8,11,5,5,5,5]],['Tim Duncan','PF',[5,25,11,5,5,5,5]],['Rasho Nesterović','C',[5,16,11,5,5,5,5]]
    ]},
    {id:'classic-chi-1998',team:'Chicago Bulls 1998',short:'Bulls 1998',season:'1998',logo:LOGOS.chi1998,theme:{a:'#CE1141',b:'#FFFFFF',c:'#111111'},rows:[
      ['Ron Harper','PG',[5,19,11,5,5,5,5]],['Michael Jordan','SG',[5,29,11,5,5,5,5]],['Scottie Pippen','SF',[5,27,11,5,5,5,5]],['Dennis Rodman','PF',[5,15,11,5,5,5,5]],['Luc Longley','C',[5,15,11,5,5,5,5]]
    ]},
    {id:'classic-lal-2002',team:'Los Angeles Lakers 2002',short:'Lakers 2002',season:'2002',logo:LOGOS.lal2002,theme:{a:'#552583',b:'#FDB927',c:'#111111'},rows:[
      ['Derek Fisher','PG',[5,8,11,5,5,5,5]],['Kobe Bryant','SG',[5,30,11,5,5,5,5]],['Rick Fox','SF',[5,13,11,5,5,5,5]],['Robert Horry','PF',[5,20,11,5,5,5,5]],["Shaquille O'Neal",'C',[30,30,1,30,14,28,8]]
    ]},
    {id:'classic-hou-1995',team:'Houston Rockets 1995',short:'Rockets 1995',season:'1995',logo:LOGOS.hou1995,theme:{a:'#CE1141',b:'#FDB927',c:'#111111'},rows:[
      ['Kenny Smith','PG',[5,9,11,5,5,5,5]],['Clyde Drexler','SG',[5,29,11,5,5,5,5]],['Robert Horry','SF',[5,23,11,5,5,5,5]],['Carl Herrera','PF',[5,18,11,5,5,5,5]],['Hakeem Olajuwon','C',[5,28,11,5,5,5,5]]
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
