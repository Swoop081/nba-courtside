/* NBA Starting5 v0.10.82 — logo authority for Phoenix '93, OKC '12, Houston '09, Detroit '99 */
(()=>{
  if(window.__starting5ClassicExpansionLogoAuthorityV01082)return;
  window.__starting5ClassicExpansionLogoAuthorityV01082=true;

  const LOGOS={
    'classic-phx-1993':'assets/team-logos/classic/phoenix-suns-1993-v1.png',
    'classic-okc-2012':'assets/team-logos/classic/oklahoma-city-thunder-2012-v1.png',
    'classic-hou-2009':'assets/team-logos/classic/houston-rockets-2009-v1.png',
    'classic-det-1999':'assets/team-logos/classic/detroit-pistons-1999-v1.png'
  };
  window.STARTING5_CLASSIC_LOGOS={...(window.STARTING5_CLASSIC_LOGOS||{}),...LOGOS};

  const pools=()=>{
    const out=[];
    try{if(Array.isArray(players))out.push(players)}catch{}
    if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);
    if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);
    return out;
  };
  const allPlayers=()=>{const seen=new Set(),out=[];for(const pool of pools())for(const p of pool||[])if(p&&!seen.has(p)){seen.add(p);out.push(p)}return out;};
  const teams=()=>Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)?window.COURTSIDE_CLASSIC_TEAMS:[];
  const norm=s=>String(s||'').trim().toLowerCase();
  const logoFor=p=>p&&LOGOS[p.teamId]||'';
  const prior=window.logoUrl;
  const resolver=p=>logoFor(p)||(typeof prior==='function'?prior(p):p?.classicLogo||'');
  try{logoUrl=resolver}catch{}
  window.logoUrl=resolver;

  const syncData=()=>{
    for(const p of allPlayers()){const src=logoFor(p);if(src)p.classicLogo=src;}
    for(const t of teams()){const src=LOGOS[t.id];if(src)t.logo=src;}
  };
  const playerForCard=card=>{
    const ps=allPlayers(), id=card?.dataset?.id, slug=card?.dataset?.artSlug;
    if(id){const p=ps.find(x=>String(x.id)===String(id));if(p)return p;}
    if(slug){const p=ps.find(x=>x.artSlug===slug);if(p)return p;}
    const name=norm(card?.querySelector?.('.identity h3,.foundation-name,.player-name')?.textContent);
    return name?ps.find(x=>norm(x.name)===name&&LOGOS[x.teamId])||null:null;
  };
  const setSrc=(img,src)=>{if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src);};
  const fixCard=card=>{
    const p=playerForCard(card),src=logoFor(p);if(!src)return;
    card.classList.add('classic-team-card');
    setSrc(card.querySelector('.foundation-team-logo,.team-logo,.team-mark img'),src);
    const bg=card.querySelector('.foundation-bg-team-logo');setSrc(bg,src);if(bg)bg.dataset.classicLogoAuthority='1';
  };
  const findTeam=text=>{
    const s=norm(text);if(!s)return null;
    return teams().find(t=>LOGOS[t.id]&&[t.short,t.team,t.name].filter(Boolean).some(v=>s.includes(norm(v))))||null;
  };
  const fixHeader=()=>{
    const img=document.getElementById('catalogueTeamLogo');if(!img)return;
    const t=findTeam((document.getElementById('catalogueTeamName')?.textContent||'')+' '+(img.alt||''));
    if(t)setSrc(img,LOGOS[t.id]);
  };
  const scan=root=>{
    syncData();
    if(root?.matches?.('.foundation-card,.player-card'))fixCard(root);
    root?.querySelectorAll?.('.foundation-card,.player-card').forEach(fixCard);
    fixHeader();
  };
  const start=()=>{
    scan(document);
    new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n.nodeType===1)scan(n);fixHeader();}).observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
