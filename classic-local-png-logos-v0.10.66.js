/* NBA Starting5 v0.10.67 — verified era-specific Classic Team logo resolver */
(()=>{
  if(window.__starting5ClassicEraV01067)return;
  window.__starting5ClassicEraV01067=true;

  const LOGOS={
    'classic-bos-1986':'https://content.sportslogos.net/logos/6/213/full/boston_celtics_logo_primary_19759952.png',
    'classic-bos-2008':'https://content.sportslogos.net/logos/6/213/full/boston_celtics_logo_primary_19979720.png',
    'classic-cha-1993':'https://content.sportslogos.net/logos/6/256/full/charlotte_hornets_logo_primary_19896932.png',
    'classic-chi-1998':'https://content.sportslogos.net/logos/6/221/full/chicago_bulls_logo_primary_19672598.png',
    'classic-dal-1995':'https://content.sportslogos.net/logos/6/228/full/dallas_mavericks_logo_primary_19945760.png',
    'classic-dal-2011':'https://content.sportslogos.net/logos/6/228/full/ifk08eam05rwxr3yhol3whdcm.png',
    'classic-det-1989':'https://content.sportslogos.net/logos/6/223/full/lgv5ssjmmchyoe66kkvh0tlzd.png',
    'classic-det-2004':'https://content.sportslogos.net/logos/6/223/full/detroit_pistons_logo_primary_20029975.png',
    'classic-hou-1995':'https://www.nicepng.com/png/detail/140-1408322_houston-rockets-logo-1995-houston-rockets-90s-logo.png',
    'classic-ind-2000':'https://content.sportslogos.net/logos/6/224/full/oj83q73haoquhxqfiurpfhsgf.png',
    'classic-lal-1987':'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'classic-lal-2002':'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'classic-mia-2013':'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
    'classic-phx-2007':'https://content.sportslogos.net/logos/6/238/full/phoenix_suns_logo_primary_20016802.png',
    'classic-sac-2002':'https://content.sportslogos.net/logos/6/240/full/832.png',
    'classic-sas-2005':'https://content.sportslogos.net/logos/6/233/full/827.gif',
    'classic-sea-1996':'https://content.sportslogos.net/logos/6/241/full/seattle_supersonics_logo_primary_19967583.png',
    'classic-tor-2003':'https://content.sportslogos.net/logos/6/227/full/toronto_raptors_logo_primary_19961665.png',
    'classic-uta-1997':'https://content.sportslogos.net/logos/6/234/full/utah_jazz_logo_primary_19973688.png',
    'classic-van-1997':'https://content.sportslogos.net/logos/6/257/full/7hc558rh9vls8j6fam4hly46n.gif'
  };

  const pools=()=>{const out=[];try{if(Array.isArray(players))out.push(players)}catch{};if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);return out;};
  const allPlayers=()=>{const seen=new Set(),out=[];pools().forEach(pool=>pool.forEach(p=>{if(p&&!seen.has(p)){seen.add(p);out.push(p)}}));return out;};
  const teams=()=>Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)?window.COURTSIDE_CLASSIC_TEAMS:[];
  const playerById=id=>allPlayers().find(p=>String(p.id)===String(id));
  const setImg=(img,src)=>{if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src);};
  const findTeamByText=txt=>{const s=String(txt||'').toLowerCase();return teams().find(t=>s.includes(String(t.short||'').toLowerCase())||s.includes(String(t.team||'').toLowerCase())||s.includes(String(t.name||'').toLowerCase()));};

  const syncData=()=>{allPlayers().forEach(p=>{if(LOGOS[p.teamId])p.classicLogo=LOGOS[p.teamId];});teams().forEach(t=>{if(LOGOS[t.id])t.logo=LOGOS[t.id];});};
  const prior=window.logoUrl;
  const resolver=p=>LOGOS[p?.teamId]||(typeof prior==='function'?prior(p):p?.classicLogo||'');
  try{logoUrl=resolver}catch{};window.logoUrl=resolver;window.STARTING5_CLASSIC_ERA_LOGOS={...LOGOS};

  const fixCard=card=>{const p=playerById(card?.dataset?.id);if(!p||!LOGOS[p.teamId])return;card.querySelectorAll('.foundation-team-logo,.foundation-bg-team-logo,.team-logo,.team-mark img').forEach(img=>setImg(img,LOGOS[p.teamId]));};
  const fixCatalogueHeader=()=>{const img=document.getElementById('catalogueTeamLogo'),name=document.getElementById('catalogueTeamName');if(!img)return;const team=findTeamByText((name?.textContent||'')+' '+(img.alt||''));if(team&&LOGOS[team.id])setImg(img,LOGOS[team.id]);};
  const fixTeamImage=img=>{const box=img.closest('[data-team-id],[data-team],.classic-team-selector,.classic-team-header,.team-card,.score-side,section,article,div');const explicit=box?.dataset?.teamId||box?.dataset?.team||'';let team=teams().find(t=>t.id===explicit);if(!team)team=findTeamByText(box?.textContent||img.alt||'');if(team&&LOGOS[team.id])setImg(img,LOGOS[team.id]);};
  const syncDom=()=>{syncData();document.querySelectorAll('.foundation-card,.player-card').forEach(fixCard);fixCatalogueHeader();document.querySelectorAll('#foundationInspectBack img,#catalogueTeamLogo,.classic-team-selector img,.classic-team-header img,.team-card img,#game .score-side img,#final img').forEach(fixTeamImage);};
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;syncDom();});};
  const start=()=>{syncDom();new MutationObserver(queue).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
