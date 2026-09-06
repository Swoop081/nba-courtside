/* NBA Courtside v0.10.56 — era-accurate Classic Team primary-logo resolver */
(()=>{
  if(window.__courtsideClassicEraLogosV01054)return;
  window.__courtsideClassicEraLogosV01054=true;

  const ERA={
    'classic-tor-2003':'https://content.sportslogos.net/logos/6/227/full/toronto_raptors_logo_primary_19961665.png',
    'classic-sas-2005':'assets/team-logos/classic/san-antonio-spurs-2005.svg',
    'classic-chi-1998':'https://content.sportslogos.net/logos/6/221/full/chicago_bulls_logo_primary_19672598.png',
    'classic-lal-1987':'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'classic-lal-2002':'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'classic-hou-1995':'assets/team-logos/classic/houston-rockets-1995.svg',
    'classic-det-2004':'https://content.sportslogos.net/logos/6/223/full/detroit_pistons_logo_primary_20029975.png',
    'classic-phx-2007':'https://content.sportslogos.net/logos/6/238/full/phoenix_suns_logo_primary_20016802.png',
    'classic-dal-1995':'https://content.sportslogos.net/logos/6/228/full/dallas_mavericks_logo_primary_19945760.png',
    'classic-dal-2011':'https://content.sportslogos.net/logos/6/228/full/ifk08eam05rwxr3yhol3whdcm.png',
    'classic-bos-1986':'https://content.sportslogos.net/logos/6/213/full/boston_celtics_logo_primary_19759952.png',
    'classic-cha-1993':'https://content.sportslogos.net/logos/6/256/full/charlotte_hornets_logo_primary_19896932.png',
    'classic-uta-1997':'https://content.sportslogos.net/logos/6/234/full/utah_jazz_logo_primary_19973688.png',
    'classic-mia-2013':'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
    'classic-sea-1996':'https://content.sportslogos.net/logos/6/241/full/seattle_supersonics_logo_primary_19967583.png',
    'classic-van-1997':'https://content.sportslogos.net/logos/6/257/full/7hc558rh9vls8j6fam4hly46n.gif',
    'classic-sac-2002':'https://content.sportslogos.net/logos/6/240/full/832.png',
    'classic-ind-2000':'https://content.sportslogos.net/logos/6/224/full/oj83q73haoquhxqfiurpfhsgf.png'
  };

  const allPlayers=()=>{
    try{return Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS)?window.COURTSIDE_FOUNDATION_PLAYERS:players||[];}catch{return window.COURTSIDE_FOUNDATION_PLAYERS||[];}
  };
  const playerById=id=>allPlayers().find(p=>String(p.id)===String(id));
  const eraFor=p=>p&&ERA[p.teamId]||'';

  allPlayers().forEach(p=>{const u=eraFor(p);if(u)p.classicLogo=u;});
  if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS))window.COURTSIDE_CLASSIC_TEAMS.forEach(t=>{if(ERA[t.id])t.logo=ERA[t.id];});

  const prev=window.logoUrl;
  const resolver=p=>eraFor(p)||(typeof prev==='function'?prev(p):p?.classicLogo||'');
  try{logoUrl=resolver;}catch{}
  window.logoUrl=resolver;
  window.COURTSIDE_CLASSIC_ERA_LOGOS={...ERA};

  function repairCard(card){
    const p=playerById(card?.dataset?.id);const u=eraFor(p);if(!u)return;
    card.querySelectorAll('.foundation-team-logo,.foundation-bg-team-logo,.team-logo,.team-mark img').forEach(img=>{if(img.getAttribute('src')!==u)img.src=u;});
  }
  function repairClassicHeader(){
    const teams=window.COURTSIDE_CLASSIC_TEAMS||[];
    teams.forEach(t=>{
      const u=ERA[t.id];if(!u)return;
      document.querySelectorAll('img').forEach(img=>{
        const box=img.closest('section,article,div');
        const txt=(box?.textContent||'').replace(/\s+/g,' ').trim();
        if((txt.includes(t.short)||txt.includes(t.team)) && img.width<220 && img.height<220){
          if(img.getAttribute('src')!==u)img.src=u;
        }
      });
    });
  }
  function repairScoreboard(){
    document.querySelectorAll('#game .score-side').forEach(side=>{
      const name=(side.textContent||'').toLowerCase();
      const team=(window.COURTSIDE_CLASSIC_TEAMS||[]).find(t=>name.includes(String(t.short||'').toLowerCase())||name.includes(String(t.team||'').toLowerCase()));
      if(!team||!ERA[team.id])return;
      side.querySelectorAll('img').forEach(img=>img.src=ERA[team.id]);
    });
  }
  function repairFinal(){
    document.querySelectorAll('#final img').forEach(img=>{
      const parent=img.closest('div,section,article');const txt=(parent?.textContent||'').toLowerCase();
      const team=(window.COURTSIDE_CLASSIC_TEAMS||[]).find(t=>txt.includes(String(t.short||'').toLowerCase())||txt.includes(String(t.team||'').toLowerCase()));
      if(team&&ERA[team.id])img.src=ERA[team.id];
    });
  }
  const sync=()=>{
    document.querySelectorAll('.foundation-card,.player-card').forEach(repairCard);
    repairClassicHeader();repairScoreboard();repairFinal();
  };
  const start=()=>{
    sync();
    new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','src']});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
