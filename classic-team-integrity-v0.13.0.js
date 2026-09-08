/* NBA Starting5 v0.13.0-dev.18 — Classic Teams presentation integrity.
   Locks each Classic Team to its period logo authority and guarantees the exact
   same transparent logo source is used on the card plaque and card background. */
(()=>{
  if(window.__starting5ClassicIntegrityV0130)return;
  window.__starting5ClassicIntegrityV0130=true;

  const PERIOD_LOGOS={
    'classic-bos-1986':'assets/team-logos/classic/boston-celtics-1986-alpha-v3.png',
    'classic-bos-2008':'assets/team-logos/classic/boston-celtics-2008-alpha-v3.png',
    'classic-cha-1993':'assets/team-logos/classic/charlotte-hornets-1993-alpha-v3.png',
    'classic-chi-1998':'assets/team-logos/classic/chicago-bulls-1998-alpha-v3.png',
    'classic-chi-2011':'assets/team-logos/classic/chicago-bulls-1998-alpha-v3.png',
    'classic-cle-1993':'https://content.sportslogos.net/logos/6/222/full/cleveland_cavaliers_logo_primary_19846739.png',
    'classic-cle-2004':'https://content.sportslogos.net/logos/6/222/full/cleveland_cavaliers_logo_primary_20046125.png',
    'classic-dal-1995':'assets/team-logos/classic/dallas-mavericks-1995-alpha-v3.png',
    'classic-dal-2011':'assets/team-logos/classic/dallas-mavericks-2011-alpha-v3.png',
    'classic-det-1989':'assets/team-logos/classic/detroit-pistons-1989-alpha-v3.png',
    'classic-det-1999':'assets/team-logos/classic/detroit-pistons-1999-v1.png',
    'classic-det-2004':'assets/team-logos/classic/detroit-pistons-2004-alpha-v3.png',
    'classic-hou-1995':'assets/team-logos/classic/houston-rockets-1995-alpha-v5.png',
    'classic-hou-2009':'assets/team-logos/classic/houston-rockets-2009-v1.png',
    'classic-ind-2000':'assets/team-logos/classic/indiana-pacers-2000-alpha-v5.png',
    'classic-lac-2014':'assets/team-logos/classic/los-angeles-clippers-2014.png',
    'classic-lal-1987':'assets/team-logos/classic/los-angeles-lakers-1987-alpha-v3.png',
    'classic-lal-2002':'assets/team-logos/classic/los-angeles-lakers-2002-alpha-v3.png',
    'classic-mia-2013':'assets/team-logos/classic/miami-heat-2013-alpha-v3.png',
    'classic-nyk-1994':'assets/team-logos/classic/new-york-knicks-1994.png',
    'classic-nyk-2012':'https://content.sportslogos.net/logos/6/216/full/new_york_knicks_logo_primary_20129558.png',
    'classic-okc-2012':'assets/team-logos/classic/oklahoma-city-thunder-2012-v1.png',
    'classic-orl-1995':'assets/team-logos/classic/orlando-magic-1995.png',
    'classic-orl-2009':'https://content.sportslogos.net/logos/6/217/full/orlando_magic_logo_primary_20017625.png',
    'classic-phi-2001':'https://flyclipart.com/thumb2/philadelphia-logo-141042.png',
    'classic-phx-1993':'assets/team-logos/classic/phoenix-suns-1993-v1.png',
    'classic-phx-2007':'assets/team-logos/classic/phoenix-suns-2007-alpha-v3.png',
    'classic-sac-2002':'assets/team-logos/classic/sacramento-kings-2002-alpha-v5.png',
    'classic-sas-1999':'https://content.sportslogos.net/logos/6/233/full/e04ylwkfdofkr2ctlerjov26s.png',
    'classic-sas-2005':'assets/team-logos/classic/san-antonio-spurs-2005-alpha-v5.png',
    'classic-sea-1996':'assets/team-logos/classic/seattle-supersonics-1996-alpha-v3.png',
    'classic-tor-2003':'assets/team-logos/classic/toronto-raptors-2003-alpha-v3.png',
    'classic-uta-1997':'assets/team-logos/classic/utah-jazz-1997-alpha-v3.png',
    'classic-van-1997':'assets/team-logos/classic/vancouver-grizzlies-1997-alpha-v3.png',
    'classic-atl-1993':'assets/team-logos/classic/atlanta-hawks-1993.png',
    'classic-cha-2007':'assets/team-logos/classic/charlotte-bobcats-2007.png'
  };

  const EXPECTED_NEW_ROSTERS={
    'classic-phi-2001':[['Eric Snow','PG'],['Allen Iverson','SG'],['George Lynch','SF'],['Tyrone Hill','PF'],['Dikembe Mutombo','C']],
    'classic-nyk-2012':[['Jeremy Lin','PG'],['Landry Fields','SG'],['Carmelo Anthony','SF'],["Amar'e Stoudemire",'PF'],['Tyson Chandler','C']],
    'classic-cle-2004':[['Jeff McInnis','PG'],['LeBron James','SG'],['Eric Williams','SF'],['Carlos Boozer','PF'],['Zydrunas Ilgauskas','C']]
  };

  const playerPools=()=>{
    const pools=[];
    try{if(Array.isArray(players))pools.push(players)}catch{}
    for(const k of ['COURTSIDE_CLASSIC_PLAYERS','COURTSIDE_FOUNDATION_PLAYERS'])if(Array.isArray(window[k]))pools.push(window[k]);
    return pools;
  };
  const allPlayers=()=>{
    const seen=new Set(),out=[];
    for(const pool of playerPools())for(const p of pool||[]){if(!p||seen.has(p))continue;seen.add(p);out.push(p)}
    return out;
  };
  const teams=()=>Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)?window.COURTSIDE_CLASSIC_TEAMS:[];
  const canonical=id=>PERIOD_LOGOS[id]||window.STARTING5_CLASSIC_LOGOS?.[id]||'';

  function syncData(){
    for(const t of teams()){
      const src=canonical(t?.id);if(src)t.logo=src;
    }
    for(const p of allPlayers()){
      if(!p?.classicTeam&&!String(p?.teamId||'').startsWith('classic-'))continue;
      const src=canonical(p.teamId);if(src)p.classicLogo=src;
    }
  }

  const oldLogo=window.logoUrl;
  const lockedLogo=p=>canonical(p?.teamId)||(typeof oldLogo==='function'?oldLogo(p):(p?.classicLogo||''));
  window.logoUrl=lockedLogo;try{logoUrl=lockedLogo}catch{}

  function teamIdForCard(card){
    const id=card?.dataset?.id;
    if(id){const p=allPlayers().find(x=>String(x.id)===String(id));if(p?.teamId)return p.teamId;}
    const slug=card?.dataset?.artSlug;
    if(slug){const p=allPlayers().find(x=>x.artSlug===slug);if(p?.teamId)return p.teamId;}
    return '';
  }

  function setSrc(img,src){
    if(!img||!src)return;
    if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    img.dataset.starting5PeriodLogo='1';
  }

  function fixCard(card){
    const teamId=teamIdForCard(card),src=canonical(teamId);
    if(!src)return;
    card.classList.add('classic-team-card');
    const plaque=card.querySelector('.foundation-team-logo,.team-logo,.team-mark img');
    setSrc(plaque,src);
    let bg=card.querySelector('.foundation-bg-team-logo');
    if(!bg){bg=document.createElement('img');bg.className='foundation-bg-team-logo';bg.alt='';bg.setAttribute('aria-hidden','true');card.appendChild(bg)}
    setSrc(bg,src);
    bg.dataset.starting5SameLogoBackground='1';
  }

  function fixKnownSurface(img){
    if(!img)return;
    const box=img.closest('[data-team-id],[data-team],.classic-team-selector,.catalogue-team-focus,.score-side,.final-card');
    const explicit=box?.dataset?.teamId||box?.dataset?.team||'';
    let id=PERIOD_LOGOS[explicit]?explicit:'';
    if(!id){
      const text=((box?.textContent||'')+' '+(img.alt||'')).toLowerCase();
      const t=teams().find(x=>PERIOD_LOGOS[x.id]&&[x.team,x.short,x.name].filter(Boolean).some(v=>text.includes(String(v).toLowerCase())));
      id=t?.id||'';
    }
    const src=canonical(id);if(src)setSrc(img,src);
  }

  function verifyNewRosters(){
    const ps=allPlayers();
    const failures=[];
    for(const [teamId,expected] of Object.entries(EXPECTED_NEW_ROSTERS)){
      const actual=ps.filter(p=>p.teamId===teamId).map(p=>[p.name,p.position]);
      const expectedKey=JSON.stringify(expected),actualKey=JSON.stringify(actual);
      if(actualKey!==expectedKey)failures.push({teamId,expected,actual});
    }
    window.STARTING5_CLASSIC_ROSTER_AUDIT={ok:failures.length===0,failures};
  }

  function scan(root=document){
    syncData();
    if(root?.matches?.('.foundation-card,.player-card'))fixCard(root);
    root?.querySelectorAll?.('.foundation-card,.player-card').forEach(fixCard);
    root?.querySelectorAll?.('.classic-team-selector img,#catalogueTeamLogo,#foundationInspectBack img,#game .score-side img,#final img').forEach(fixKnownSurface);
    verifyNewRosters();
  }

  function start(){
    scan();
    new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes||[]){if(n.nodeType===1)scan(n)}
    }).observe(document.body,{childList:true,subtree:true});
    window.STARTING5_CLASSIC_PRESENTATION_AUDIT={periodLogoCount:Object.keys(PERIOD_LOGOS).length,rosters:EXPECTED_NEW_ROSTERS,run:()=>scan()};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
