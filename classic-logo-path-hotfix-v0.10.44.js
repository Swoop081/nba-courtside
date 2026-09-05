/* NBA Courtside v0.10.44 — rooted classic logo paths + reliable logo resolution */
(()=>{
  if(window.__courtsideClassicLogoPathHotfixV01044)return;
  window.__courtsideClassicLogoPathHotfixV01044=true;

  const ROOT='/nba-courtside/';
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
    'classic-sea-1996':'assets/team-logos/classic/seattle-supersonics-1996.svg',
    'classic-van-1997':'assets/team-logos/classic/vancouver-grizzlies-1997.svg'
  };
  const CURRENT_IDS=new Set([
    '1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744',
    '1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752',
    '1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'
  ]);
  const rooted=path=>ROOT+String(path||'').replace(/^\/+/, '');
  const fallback=p=>{
    if(!p)return '';
    const currentMap={
      'classic-chi-1998':'1610612741','classic-lal-1987':'1610612747','classic-lal-2002':'1610612747',
      'classic-bos-1986':'1610612738','classic-cha-1993':'1610612766','classic-uta-1997':'1610612762',
      'classic-mia-2013':'1610612748','classic-sea-1996':'1610612760','classic-van-1997':'1610612763',
      'classic-phx-2007':'1610612756','classic-dal-1995':'1610612742','classic-sas-2005':'1610612759',
      'classic-tor-2003':'1610612761','classic-hou-1995':'1610612745','classic-det-2004':'1610612765'
    };
    const id=currentMap[p.teamId];
    if(id)return `https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
    if(CURRENT_IDS.has(String(p.teamId)))return `https://cdn.nba.com/logos/nba/${p.teamId}/global/L/logo.svg`;
    return '';
  };
  const resolve=p=>{
    if(!p)return '';
    if(CLASSIC[p.teamId])return rooted(CLASSIC[p.teamId]);
    if(CURRENT_IDS.has(String(p.teamId)))return rooted(`assets/team-logos/current/${p.teamId}.svg`);
    return p.classicLogo||'';
  };

  try{players.forEach(p=>{if(CLASSIC[p.teamId])p.classicLogo=rooted(CLASSIC[p.teamId]);});}catch{}
  (window.COURTSIDE_FOUNDATION_PLAYERS||[]).forEach(p=>{if(CLASSIC[p.teamId])p.classicLogo=rooted(CLASSIC[p.teamId]);});
  (window.COURTSIDE_CLASSIC_PLAYERS||[]).forEach(p=>{if(CLASSIC[p.teamId])p.classicLogo=rooted(CLASSIC[p.teamId]);});
  (window.COURTSIDE_CLASSIC_TEAMS||[]).forEach(t=>{if(CLASSIC[t.id])t.logo=rooted(CLASSIC[t.id]);});

  window.courtsideLogoFallback=fallback;
  try{logoUrl=resolve;}catch{}
  window.logoUrl=resolve;

  const patchImg=(img,p)=>{
    if(!img||!p)return;
    const src=resolve(p),fb=fallback(p);
    if(src&&img.getAttribute('src')!==src)img.src=src;
    if(!img.dataset.courtsideRootLogoFallback){
      img.dataset.courtsideRootLogoFallback='1';
      img.addEventListener('error',()=>{if(fb&&img.src!==fb)img.src=fb;});
    }
  };
  const byId=id=>(window.COURTSIDE_FOUNDATION_PLAYERS||[]).find(p=>p.id===id)||null;
  const repair=()=>{
    document.querySelectorAll('.foundation-card').forEach(card=>{
      const p=byId(card.dataset.id);if(!p)return;
      patchImg(card.querySelector('.foundation-team-logo'),p);
      patchImg(card.querySelector('.foundation-bg-team-logo'),p);
    });
  };
  const start=()=>{
    repair();
    new MutationObserver(repair).observe(document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
