/* NBA Starting5 v0.10.66 — force all Classic Teams to local era-specific PNG logos */
(()=>{
  if(window.__starting5ClassicLocalPngV01066)return;
  window.__starting5ClassicLocalPngV01066=true;

  const LOGOS={
    'classic-bos-1986':'assets/team-logos/classic/boston-celtics-1986.png',
    'classic-bos-2008':'assets/team-logos/classic/boston-celtics-2008.png',
    'classic-cha-1993':'assets/team-logos/classic/charlotte-hornets-1993.png',
    'classic-chi-1998':'assets/team-logos/classic/chicago-bulls-1998.png',
    'classic-dal-1995':'assets/team-logos/classic/dallas-mavericks-1995.png',
    'classic-dal-2011':'assets/team-logos/classic/dallas-mavericks-2011.png',
    'classic-det-1989':'assets/team-logos/classic/detroit-pistons-1989.png',
    'classic-det-2004':'assets/team-logos/classic/detroit-pistons-2004.png',
    'classic-hou-1995':'assets/team-logos/classic/houston-rockets-1995.png',
    'classic-ind-2000':'assets/team-logos/classic/indiana-pacers-2000.png',
    'classic-lal-1987':'assets/team-logos/classic/los-angeles-lakers-1987.png',
    'classic-lal-2002':'assets/team-logos/classic/los-angeles-lakers-2002.png',
    'classic-mia-2013':'assets/team-logos/classic/miami-heat-2013.png',
    'classic-phx-2007':'assets/team-logos/classic/phoenix-suns-2007.png',
    'classic-sac-2002':'assets/team-logos/classic/sacramento-kings-2002.png',
    'classic-sas-2005':'assets/team-logos/classic/san-antonio-spurs-2005.png',
    'classic-sea-1996':'assets/team-logos/classic/seattle-supersonics-1996.png',
    'classic-tor-2003':'assets/team-logos/classic/toronto-raptors-2003.png',
    'classic-uta-1997':'assets/team-logos/classic/utah-jazz-1997.png',
    'classic-van-1997':'assets/team-logos/classic/vancouver-grizzlies-1997.png'
  };

  const pools=()=>{
    const out=[];
    try{if(Array.isArray(players))out.push(players)}catch{}
    if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);
    if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);
    return out;
  };
  const allPlayers=()=>{const seen=new Set(),out=[];pools().forEach(pool=>pool.forEach(p=>{if(p&&!seen.has(p)){seen.add(p);out.push(p)}}));return out;};
  const syncData=()=>{
    allPlayers().forEach(p=>{if(LOGOS[p.teamId])p.classicLogo=LOGOS[p.teamId];});
    if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.forEach(t=>{if(LOGOS[t.id])t.logo=LOGOS[t.id];});
  };
  syncData();

  const prior=window.logoUrl;
  const resolver=p=>LOGOS[p?.teamId]||(typeof prior==='function'?prior(p):p?.classicLogo||'');
  try{logoUrl=resolver}catch{}
  window.logoUrl=resolver;
  window.STARTING5_CLASSIC_LOCAL_PNG_LOGOS={...LOGOS};

  const playerById=id=>allPlayers().find(p=>String(p.id)===String(id));
  const setImg=(img,src)=>{if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src);};
  const fixCard=card=>{
    const p=playerById(card?.dataset?.id); if(!p||!LOGOS[p.teamId])return;
    card.querySelectorAll('.foundation-team-logo,.foundation-bg-team-logo,.team-logo,.team-mark img').forEach(img=>setImg(img,LOGOS[p.teamId]));
  };
  const findTeamByText=txt=>{
    const s=String(txt||'').toLowerCase();
    return (window.COURTSIDE_CLASSIC_TEAMS||[]).find(t=>s.includes(String(t.short||'').toLowerCase())||s.includes(String(t.team||'').toLowerCase()));
  };
  const fixTeamImage=img=>{
    const box=img.closest('[data-team-id],[data-team],.classic-team-selector,.classic-team-header,.team-card,.score-side,section,article,div');
    const explicit=box?.dataset?.teamId||box?.dataset?.team||'';
    let team=(window.COURTSIDE_CLASSIC_TEAMS||[]).find(t=>t.id===explicit);
    if(!team)team=findTeamByText(box?.textContent||img.alt||'');
    if(team&&LOGOS[team.id])setImg(img,LOGOS[team.id]);
  };
  const syncDom=()=>{
    syncData();
    document.querySelectorAll('.foundation-card,.player-card').forEach(fixCard);
    document.querySelectorAll('#foundationInspectBack img,.classic-team-selector img,.classic-team-header img,.team-card img,#game .score-side img,#final img').forEach(fixTeamImage);
  };
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;syncDom();});};
  const start=()=>{syncDom();new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
