/* NBA Starting5 v0.11.28 — complete Classic Team logo authority + resilient background parity */
(()=>{
  if(window.__starting5ClassicLogoAuthorityV01128)return;
  window.__starting5ClassicLogoAuthorityV01128=true;

  const CANDIDATES={
    'classic-bos-1986':['assets/team-logos/classic/boston-celtics-1986-alpha-v3.png','assets/team-logos/classic/boston-celtics-1986.png','assets/team-logos/classic/boston-celtics-1986.svg'],
    'classic-bos-2008':['assets/team-logos/classic/boston-celtics-2008-alpha-v3.png','assets/team-logos/classic/boston-celtics-2008.png'],
    'classic-cha-1993':['assets/team-logos/classic/charlotte-hornets-1993-alpha-v3.png','assets/team-logos/classic/charlotte-hornets-1993.png','assets/team-logos/classic/charlotte-hornets-1993.svg'],
    'classic-chi-1998':['assets/team-logos/classic/chicago-bulls-1998-alpha-v3.png','assets/team-logos/classic/chicago-bulls-1998.png','assets/team-logos/classic/chicago-bulls-1998.svg'],
    'classic-dal-1995':['assets/team-logos/classic/dallas-mavericks-1995-alpha-v3.png','assets/team-logos/classic/dallas-mavericks-1995.png','assets/team-logos/classic/dallas-mavericks-1995.svg'],
    'classic-dal-2011':['assets/team-logos/classic/dallas-mavericks-2011-alpha-v3.png','assets/team-logos/classic/dallas-mavericks-2011.png'],
    'classic-det-1989':['assets/team-logos/classic/detroit-pistons-1989-alpha-v3.png','assets/team-logos/classic/detroit-pistons-1989.png'],
    'classic-det-2004':['assets/team-logos/classic/detroit-pistons-2004-alpha-v3.png','assets/team-logos/classic/detroit-pistons-2004.png','assets/team-logos/classic/detroit-pistons-2004.svg'],
    'classic-hou-1995':['assets/team-logos/classic/houston-rockets-1995-alpha-v5.png','assets/team-logos/classic/houston-rockets-1995-alpha-v4.png','assets/team-logos/classic/houston-rockets-1995-alpha-v3.png','assets/team-logos/classic/houston-rockets-1995.png','assets/team-logos/classic/houston-rockets-1995.svg'],
    'classic-ind-2000':['assets/team-logos/classic/indiana-pacers-2000-alpha-v5.png','assets/team-logos/classic/indiana-pacers-2000-alpha-v4.png','assets/team-logos/classic/indiana-pacers-2000-alpha-v3.png','assets/team-logos/classic/indiana-pacers-2000.png'],
    'classic-lal-1987':['assets/team-logos/classic/los-angeles-lakers-1987-alpha-v3.png','assets/team-logos/classic/los-angeles-lakers-1987.png','assets/team-logos/classic/los-angeles-lakers-1987.svg'],
    'classic-lal-2002':['assets/team-logos/classic/los-angeles-lakers-2002-alpha-v3.png','assets/team-logos/classic/los-angeles-lakers-2002.png','assets/team-logos/classic/los-angeles-lakers-2002.svg'],
    'classic-mia-2013':['assets/team-logos/classic/miami-heat-2013-alpha-v3.png','assets/team-logos/classic/miami-heat-2013.png','assets/team-logos/classic/miami-heat-2013.svg'],
    'classic-phx-2007':['assets/team-logos/classic/phoenix-suns-2007-alpha-v3.png','assets/team-logos/classic/phoenix-suns-2007.png','assets/team-logos/classic/phoenix-suns-2007.svg'],
    'classic-sac-2002':['assets/team-logos/classic/sacramento-kings-2002-alpha-v5.png','assets/team-logos/classic/sacramento-kings-2002-alpha-v4.png','assets/team-logos/classic/sacramento-kings-2002-alpha-v3.png','assets/team-logos/classic/sacramento-kings-2002.png'],
    'classic-sas-2005':['assets/team-logos/classic/san-antonio-spurs-2005-alpha-v5.png','assets/team-logos/classic/san-antonio-spurs-2005-alpha-v4.png','assets/team-logos/classic/san-antonio-spurs-2005-alpha-v3.png','assets/team-logos/classic/san-antonio-spurs-2005.png','assets/team-logos/classic/san-antonio-spurs-2005.svg'],
    'classic-sea-1996':['assets/team-logos/classic/seattle-supersonics-1996-alpha-v3.png','assets/team-logos/classic/seattle-supersonics-1996.png','assets/team-logos/classic/seattle-supersonics-1996.svg'],
    'classic-tor-2003':['assets/team-logos/classic/toronto-raptors-2003-alpha-v3.png','assets/team-logos/classic/toronto-raptors-2003.png','assets/team-logos/classic/toronto-raptors-2003.svg'],
    'classic-uta-1997':['assets/team-logos/classic/utah-jazz-1997-alpha-v3.png','assets/team-logos/classic/utah-jazz-1997.png','assets/team-logos/classic/utah-jazz-1997.svg'],
    'classic-van-1997':['assets/team-logos/classic/vancouver-grizzlies-1997-alpha-v3.png','assets/team-logos/classic/vancouver-grizzlies-1997-transparent-v2.png','assets/team-logos/classic/vancouver-grizzlies-1997.png','assets/team-logos/classic/vancouver-grizzlies-1997.svg'],
    'classic-phx-1993':['assets/team-logos/classic/phoenix-suns-1993-v1.png'],
    'classic-okc-2012':['assets/team-logos/classic/oklahoma-city-thunder-2012-v1.png'],
    'classic-hou-2009':['assets/team-logos/classic/houston-rockets-2009-v1.png'],
    'classic-det-1999':['assets/team-logos/classic/detroit-pistons-1999-v1.png'],
    'classic-orl-1995':['assets/team-logos/classic/orlando-magic-1995.png'],
    'classic-cha-2007':['assets/team-logos/classic/charlotte-bobcats-2007.png'],
    'classic-lac-2014':['assets/team-logos/classic/los-angeles-clippers-2014.png'],
    'classic-nyk-1994':['assets/team-logos/classic/new-york-knicks-1994.png'],
    'classic-atl-1993':['assets/team-logos/classic/atlanta-hawks-1993.png'],
    'classic-phi-2001':['https://flyclipart.com/thumb2/philadelphia-logo-141042.png'],
    'classic-nyk-2012':['https://content.sportslogos.net/logos/6/216/full/new_york_knicks_logo_primary_20129558.png'],
    'classic-cle-2004':['https://content.sportslogos.net/logos/6/222/full/cleveland_cavaliers_logo_primary_20046125.png']
  };

  const firstMap=Object.fromEntries(Object.entries(CANDIDATES).map(([id,a])=>[id,a[0]]));
  window.STARTING5_CLASSIC_LOGOS={...(window.STARTING5_CLASSIC_LOGOS||{}),...firstMap};
  window.STARTING5_CLASSIC_LOGO_CANDIDATES=CANDIDATES;

  const pools=()=>{const out=[];try{if(Array.isArray(players))out.push(players)}catch{};if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);return out};
  const allPlayers=()=>{const seen=new Set(),out=[];for(const pool of pools())for(const p of pool||[])if(p&&!seen.has(p)){seen.add(p);out.push(p)}return out};
  const teams=()=>Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)?window.COURTSIDE_CLASSIC_TEAMS:[];
  const norm=s=>String(s||'').trim().toLowerCase();
  const primary=id=>CANDIDATES[id]?.[0]||'';

  const syncData=()=>{
    for(const p of allPlayers()){const src=primary(p?.teamId);if(src)p.classicLogo=src;}
    for(const t of teams()){const src=primary(t?.id);if(src)t.logo=src;}
  };

  const prior=window.logoUrl;
  const resolver=p=>primary(p?.teamId)||p?.classicLogo||(typeof prior==='function'?prior(p):'');
  try{logoUrl=resolver}catch{}
  window.logoUrl=resolver;

  const playerForCard=card=>{
    const ps=allPlayers(),id=card?.dataset?.id,slug=card?.dataset?.artSlug;
    if(id){const p=ps.find(x=>String(x.id)===String(id));if(p)return p;}
    if(slug){const p=ps.find(x=>x.artSlug===slug);if(p)return p;}
    const name=norm(card?.querySelector?.('.identity h3,.foundation-name,.player-name')?.textContent);
    if(!name)return null;
    const matches=ps.filter(x=>norm(x.name)===name&&CANDIDATES[x.teamId]);
    return matches.length===1?matches[0]:null;
  };

  const findTeam=text=>{
    const s=norm(text);if(!s)return null;
    return teams().find(t=>CANDIDATES[t.id]&&[t.team,t.short,t.name].filter(Boolean).some(v=>s.includes(norm(v))))||null;
  };

  function bindImage(img,teamId){
    const list=CANDIDATES[teamId];if(!img||!list?.length)return;
    let current=img.dataset.s5ClassicLogoIndex?+img.dataset.s5ClassicLogoIndex:0;
    if(!Number.isFinite(current)||current<0||current>=list.length)current=0;
    img.dataset.s5ClassicTeamId=teamId;
    img.dataset.s5ClassicLogoIndex=String(current);
    const wanted=list[current];
    if(img.getAttribute('src')!==wanted)img.setAttribute('src',wanted);
    if(img.dataset.s5ClassicFallbackBound==='1')return;
    img.dataset.s5ClassicFallbackBound='1';
    img.addEventListener('error',()=>{
      const id=img.dataset.s5ClassicTeamId,list2=CANDIDATES[id];if(!list2?.length)return;
      let i=(+img.dataset.s5ClassicLogoIndex||0)+1;
      if(i>=list2.length){img.dataset.s5ClassicLogoFailed='1';return;}
      img.dataset.s5ClassicLogoIndex=String(i);
      img.src=list2[i];
    });
  }

  function ensureBackground(card,teamId){
    let bg=card.querySelector('.foundation-bg-team-logo');
    if(!bg){
      bg=document.createElement('img');
      bg.className='foundation-bg-team-logo';bg.alt='';bg.setAttribute('aria-hidden','true');
      card.appendChild(bg);
    }
    bindImage(bg,teamId);bg.dataset.classicLogoAuthority='1';
  }

  function fixCard(card){
    const p=playerForCard(card),teamId=p?.teamId;if(!teamId||!CANDIDATES[teamId])return;
    card.classList.add('classic-team-card');
    const plaque=card.querySelector('.foundation-team-logo,.team-logo,.team-mark img');
    bindImage(plaque,teamId);ensureBackground(card,teamId);
  }

  function fixSurfaceImages(){
    document.querySelectorAll('.classic-team-selector img,.classic-team-header img,#foundationInspectBack img,#game .score-side img,#final img').forEach(img=>{
      const box=img.closest('[data-team-id],[data-team],.score-side,section,article,div');
      const explicit=box?.dataset?.teamId||box?.dataset?.team||'';
      const team=teams().find(t=>t.id===explicit)||findTeam((box?.textContent||'')+' '+(img.alt||''));
      if(team)bindImage(img,team.id);
    });
    const header=document.getElementById('catalogueTeamLogo');
    if(header){const team=findTeam((document.getElementById('catalogueTeamName')?.textContent||'')+' '+(header.alt||''));if(team)bindImage(header,team.id);}
  }

  function scan(root=document){
    syncData();
    if(root?.matches?.('.foundation-card,.player-card'))fixCard(root);
    root?.querySelectorAll?.('.foundation-card,.player-card').forEach(fixCard);
    fixSurfaceImages();
  }

  const start=()=>{
    scan();
    new MutationObserver(ms=>{
      let touched=false;
      for(const m of ms)for(const n of m.addedNodes||[])if(n.nodeType===1){scan(n);touched=true;}
      if(touched)fixSurfaceImages();
    }).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
