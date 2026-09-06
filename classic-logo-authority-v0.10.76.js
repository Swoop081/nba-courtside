/* NBA Starting5 v0.10.77 — single authority for authentic transparent Classic Team logos */
(()=>{
  if(window.__starting5ClassicLogoAuthorityV01077)return;
  window.__starting5ClassicLogoAuthorityV01077=true;

  const LOGOS={
    'classic-bos-1986':'assets/team-logos/classic/boston-celtics-1986-alpha-v3.png',
    'classic-bos-2008':'assets/team-logos/classic/boston-celtics-2008-alpha-v3.png',
    'classic-cha-1993':'assets/team-logos/classic/charlotte-hornets-1993-alpha-v3.png',
    'classic-chi-1998':'assets/team-logos/classic/chicago-bulls-1998-alpha-v3.png',
    'classic-dal-1995':'assets/team-logos/classic/dallas-mavericks-1995-alpha-v3.png',
    'classic-dal-2011':'assets/team-logos/classic/dallas-mavericks-2011-alpha-v3.png',
    'classic-det-1989':'assets/team-logos/classic/detroit-pistons-1989-alpha-v3.png',
    'classic-det-2004':'assets/team-logos/classic/detroit-pistons-2004-alpha-v3.png',
    'classic-hou-1995':'assets/team-logos/classic/houston-rockets-1995-alpha-v3.png',
    'classic-ind-2000':'assets/team-logos/classic/indiana-pacers-2000-alpha-v3.png',
    'classic-lal-1987':'assets/team-logos/classic/los-angeles-lakers-1987-alpha-v3.png',
    'classic-lal-2002':'assets/team-logos/classic/los-angeles-lakers-2002-alpha-v3.png',
    'classic-mia-2013':'assets/team-logos/classic/miami-heat-2013-alpha-v3.png',
    'classic-phx-2007':'assets/team-logos/classic/phoenix-suns-2007-alpha-v3.png',
    'classic-sac-2002':'assets/team-logos/classic/sacramento-kings-2002-alpha-v3.png',
    'classic-sas-2005':'assets/team-logos/classic/san-antonio-spurs-2005-alpha-v3.png',
    'classic-sea-1996':'assets/team-logos/classic/seattle-supersonics-1996-alpha-v3.png',
    'classic-tor-2003':'assets/team-logos/classic/toronto-raptors-2003-alpha-v3.png',
    'classic-uta-1997':'assets/team-logos/classic/utah-jazz-1997-alpha-v3.png',
    'classic-van-1997':'assets/team-logos/classic/vancouver-grizzlies-1997-alpha-v3.png'
  };

  const pools=()=>{
    const out=[];
    try{if(Array.isArray(players))out.push(players)}catch{}
    if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);
    if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);
    return out;
  };
  const allPlayers=()=>{const seen=new Set(),out=[];for(const pool of pools())for(const p of pool||[])if(p&&!seen.has(p)){seen.add(p);out.push(p)}return out;};
  const classicTeams=()=>Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)?window.COURTSIDE_CLASSIC_TEAMS:[];
  const norm=s=>String(s||'').trim().toLowerCase();
  const playerForCard=card=>{
    const ps=allPlayers();
    const id=card?.dataset?.id, slug=card?.dataset?.artSlug;
    if(id){const p=ps.find(x=>String(x.id)===String(id));if(p)return p;}
    if(slug){const p=ps.find(x=>x.artSlug===slug);if(p)return p;}
    const name=norm(card?.querySelector?.('.identity h3,.foundation-name,.player-name')?.textContent);
    if(name)return ps.find(x=>norm(x.name)===name)||null;
    return null;
  };
  const setSrc=(img,src)=>{if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src);};
  const logoFor=p=>p&&LOGOS[p.teamId]||'';

  const syncData=()=>{
    for(const p of allPlayers()){const src=logoFor(p);if(src)p.classicLogo=src;}
    for(const t of classicTeams()){const src=LOGOS[t.id];if(src)t.logo=src;}
  };

  const prior=window.logoUrl;
  const resolver=p=>logoFor(p)||(typeof prior==='function'?prior(p):p?.classicLogo||'');
  try{logoUrl=resolver}catch{}
  window.logoUrl=resolver;
  window.STARTING5_CLASSIC_LOGOS={...LOGOS};

  const fixCard=card=>{
    const p=playerForCard(card),src=logoFor(p);if(!src)return;
    card.classList.add('classic-team-card');
    const plaque=card.querySelector('.foundation-team-logo,.team-logo,.team-mark img');
    const bg=card.querySelector('.foundation-bg-team-logo');
    setSrc(plaque,src);
    setSrc(bg,src);
    if(bg)bg.dataset.classicLogoAuthority='1';
  };

  const findTeamFromText=text=>{
    const s=norm(text);if(!s)return null;
    return classicTeams().find(t=>[t.short,t.team,t.name].filter(Boolean).some(v=>s.includes(norm(v))))||null;
  };
  const fixCatalogueHeader=()=>{
    const img=document.getElementById('catalogueTeamLogo');if(!img)return;
    const team=findTeamFromText((document.getElementById('catalogueTeamName')?.textContent||'')+' '+(img.alt||''));
    if(team&&LOGOS[team.id])setSrc(img,LOGOS[team.id]);
  };
  const fixOtherTeamImages=()=>{
    document.querySelectorAll('.classic-team-selector img,.classic-team-header img,#foundationInspectBack img,#game .score-side img,#final img').forEach(img=>{
      const box=img.closest('[data-team-id],[data-team],.score-side,section,article,div');
      const explicit=box?.dataset?.teamId||box?.dataset?.team||'';
      let team=classicTeams().find(t=>t.id===explicit)||findTeamFromText((box?.textContent||'')+' '+(img.alt||''));
      if(team&&LOGOS[team.id])setSrc(img,LOGOS[team.id]);
    });
  };
  const scan=root=>{
    syncData();
    if(root?.matches?.('.foundation-card,.player-card'))fixCard(root);
    root?.querySelectorAll?.('.foundation-card,.player-card').forEach(fixCard);
    fixCatalogueHeader();fixOtherTeamImages();
  };
  const start=()=>{
    scan(document);
    new MutationObserver(ms=>{
      let changed=false;
      for(const m of ms)for(const n of m.addedNodes||[])if(n.nodeType===1){scan(n);changed=true;}
      if(changed){fixCatalogueHeader();fixOtherTeamImages();}
    }).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
