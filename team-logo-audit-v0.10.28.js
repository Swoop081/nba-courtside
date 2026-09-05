/* NBA Courtside v0.10.41 — deterministic local team logos + fourteen-team classic logo audit repair */
(()=>{
  if(window.__courtsideTeamLogoAuditV01028)return;
  window.__courtsideTeamLogoAuditV01028=true;

  const CLASSIC={
    'classic-tor-2003':'assets/team-logos/classic/toronto-raptors-2003.svg',
    'classic-sas-2005':'assets/team-logos/classic/san-antonio-spurs-2005.svg',
    'classic-chi-1998':'assets/team-logos/classic/chicago-bulls-1998.svg',
    'classic-lal-1987':'assets/team-logos/classic/los-angeles-lakers-1987.svg',
    'classic-lal-2002':'assets/team-logos/classic/los-angeles-lakers-2002.svg',
    'classic-hou-1995':'assets/team-logos/classic/houston-rockets-1995.svg',
    'classic-det-2004':'assets/team-logos/classic/detroit-pistons-2004.svg',
    'classic-phx-2007':'assets/team-logos/classic/phoenix-suns-2007.svg',
    'classic-dal-1995':'assets/team-logos/classic/dallas-mavericks-1995.svg',
    'classic-bos-1986':'assets/team-logos/classic/boston-celtics-1986.svg',
    'classic-cha-1993':'assets/team-logos/classic/charlotte-hornets-1993.svg',
    'classic-uta-1997':'assets/team-logos/classic/utah-jazz-1997.svg',
    'classic-mia-2013':'assets/team-logos/classic/miami-heat-2013.svg',
    'classic-sea-1996':'assets/team-logos/classic/seattle-supersonics-1996.svg'
  };
  const CURRENT_IDS=new Set([
    '1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744',
    '1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752',
    '1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'
  ]);
  const localLogo=p=>{
    if(!p)return '';
    if(CLASSIC[p.teamId])return CLASSIC[p.teamId];
    if(CURRENT_IDS.has(String(p.teamId)))return `assets/team-logos/current/${p.teamId}.svg`;
    return p.classicLogo||'';
  };
  const fallbackLogo=p=>{
    if(!p)return '';
    if(p.teamId==='classic-chi-1998')return 'https://cdn.nba.com/logos/nba/1610612741/global/L/logo.svg';
    if(p.teamId==='classic-lal-1987'||p.teamId==='classic-lal-2002')return 'https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg';
    if(p.teamId==='classic-bos-1986')return 'https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg';
    if(p.teamId==='classic-cha-1993')return 'https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg';
    if(p.teamId==='classic-uta-1997')return 'https://cdn.nba.com/logos/nba/1610612762/global/L/logo.svg';
    if(p.teamId==='classic-mia-2013')return 'https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg';
    if(p.teamId==='classic-sea-1996')return 'https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg';
    if(p.teamId==='classic-det-2004')return 'https://content.sportslogos.net/logos/6/223/full/detroit_pistons_logo_primary_20029975.png';
    if(CURRENT_IDS.has(String(p.teamId)))return `https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg`;
    return p.classicLogo||'';
  };

  const allPlayers=()=>window.COURTSIDE_FOUNDATION_PLAYERS||[];
  allPlayers().forEach(p=>{if(CLASSIC[p.teamId])p.classicLogo=CLASSIC[p.teamId];});
  if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.forEach(t=>{if(CLASSIC[t.id])t.logo=CLASSIC[t.id];});

  const resolved=p=>localLogo(p)||fallbackLogo(p);
  try{logoUrl=resolved;}catch{}
  window.logoUrl=resolved;

  const installFallback=(img,p)=>{
    if(!img||!p)return;
    const local=localLogo(p),fallback=fallbackLogo(p);
    if(local&&img.getAttribute('src')!==local)img.src=local;
    if(!img.dataset.logoFallbackInstalled){
      img.dataset.logoFallbackInstalled='1';
      img.addEventListener('error',()=>{
        if(fallback&&img.src!==fallback)img.src=fallback;
      });
    }
  };

  const playerForCard=card=>allPlayers().find(p=>p.id===card?.dataset?.id)||null;
  const repairCard=card=>{
    const p=playerForCard(card);if(!p)return;
    installFallback(card.querySelector('.foundation-team-logo'),p);
    const bg=card.querySelector('.foundation-bg-team-logo');
    if(bg)installFallback(bg,p);
  };
  const repairAll=()=>document.querySelectorAll('.foundation-card').forEach(repairCard);

  try{
    const marker='nbaCourtsideLogoAuditV01028';
    if(localStorage.getItem(marker)!=='1'){
      ['nbaCourtsideBgLogoSizeV1','nbaCourtsideBgLogoPositionV1','nbaCourtsideBgLogoRotationV1'].forEach(key=>{
        let v={};try{v=JSON.parse(localStorage.getItem(key)||'{}')}catch{}
        delete v['1610612759'];
        delete v['1610612762'];
        localStorage.setItem(key,JSON.stringify(v));
      });
      localStorage.setItem(marker,'1');
    }
  }catch{}

  const repairInspector=()=>{
    const front=document.querySelector('#foundationInspectFront .foundation-card');
    const p=playerForCard(front);if(!p)return;
    const back=document.querySelector('#foundationInspectBack .foundation-back-head img');
    if(back)installFallback(back,p);
  };

  const start=()=>{
    repairAll();repairInspector();
    new MutationObserver(ms=>{
      ms.forEach(m=>m.addedNodes.forEach(n=>{
        if(n.nodeType!==1)return;
        if(n.matches?.('.foundation-card'))repairCard(n);
        n.querySelectorAll?.('.foundation-card').forEach(repairCard);
      }));
      repairInspector();
    }).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
