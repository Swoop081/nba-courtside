/* NBA Starting5 v0.11.27 — period-accurate Classic Team logo authority + background parity */
(()=>{
  if(window.__starting5ClassicLogoExpansionAuthorityV01127)return;
  window.__starting5ClassicLogoExpansionAuthorityV01127=true;

  const LOGOS={
    'classic-nyk-1994':'assets/team-logos/classic/new-york-knicks-1994.png',
    'classic-atl-1993':'assets/team-logos/classic/atlanta-hawks-1993.png',
    'classic-phi-2001':'https://flyclipart.com/thumb2/philadelphia-logo-141042.png',
    'classic-nyk-2012':'https://content.sportslogos.net/logos/6/216/full/new_york_knicks_logo_primary_20129558.png',
    'classic-cle-2004':'https://content.sportslogos.net/logos/6/222/full/cleveland_cavaliers_logo_primary_20046125.png'
  };
  window.STARTING5_CLASSIC_LOGOS={...(window.STARTING5_CLASSIC_LOGOS||{}),...LOGOS};

  const pools=()=>{const out=[];try{if(Array.isArray(players))out.push(players)}catch{};if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);return out};
  const allPlayers=()=>{const seen=new Set(),out=[];for(const pool of pools())for(const p of pool||[])if(p&&!seen.has(p)){seen.add(p);out.push(p)}return out};
  const teams=()=>Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)?window.COURTSIDE_CLASSIC_TEAMS:[];
  const logoFor=p=>p&&((window.STARTING5_CLASSIC_LOGOS||{})[p.teamId]||p.classicLogo||'');
  const sync=()=>{const map=window.STARTING5_CLASSIC_LOGOS||{};for(const p of allPlayers()){const src=map[p.teamId];if(src)p.classicLogo=src}for(const t of teams()){const src=map[t.id];if(src)t.logo=src}};
  const prior=window.logoUrl;const resolver=p=>logoFor(p)||(typeof prior==='function'?prior(p):'');try{logoUrl=resolver}catch{}window.logoUrl=resolver;

  const norm=s=>String(s||'').trim().toLowerCase();
  const findTeam=text=>{const s=norm(text),map=window.STARTING5_CLASSIC_LOGOS||{};return teams().find(t=>map[t.id]&&[t.team,t.short,t.name].filter(Boolean).some(v=>s.includes(norm(v))))||null};
  const playerFor=card=>{const id=card?.dataset?.id,slug=card?.dataset?.artSlug,ps=allPlayers();if(id){const p=ps.find(x=>String(x.id)===String(id));if(p)return p}if(slug){const p=ps.find(x=>x.artSlug===slug);if(p)return p}const n=norm(card?.querySelector?.('.identity h3,.foundation-name,.player-name')?.textContent);return n?ps.find(x=>norm(x.name)===n&&logoFor(x))||null:null};
  const set=(img,src)=>{if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src)};
  const fixCard=card=>{const p=playerFor(card),src=logoFor(p);if(!src)return;card.classList.add('classic-team-card');set(card.querySelector('.foundation-team-logo,.team-logo,.team-mark img'),src);const bg=card.querySelector('.foundation-bg-team-logo');set(bg,src);if(bg)bg.dataset.classicLogoAuthority='1'};

  const fix=()=>{
    sync();
    document.querySelectorAll('.foundation-card,.player-card').forEach(fixCard);
    const hi=document.getElementById('catalogueTeamLogo');
    if(hi){const t=findTeam((document.getElementById('catalogueTeamName')?.textContent||'')+' '+(hi.alt||''));if(t)set(hi,(window.STARTING5_CLASSIC_LOGOS||{})[t.id])}
    document.querySelectorAll('.classic-team-selector img,.classic-team-header img,#foundationInspectBack img,#game .score-side img,#final img').forEach(img=>{
      const box=img.closest('[data-team-id],[data-team],.score-side,section,article,div');const explicit=box?.dataset?.teamId||box?.dataset?.team||'';
      const t=teams().find(x=>x.id===explicit)||findTeam((box?.textContent||'')+' '+(img.alt||''));if(t)set(img,(window.STARTING5_CLASSIC_LOGOS||{})[t.id]);
    });
  };

  const start=()=>{fix();new MutationObserver(ms=>{let run=false;for(const m of ms)if(m.addedNodes?.length){run=true;break}if(run)requestAnimationFrame(fix)}).observe(document.body,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
