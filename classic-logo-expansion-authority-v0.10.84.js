/* NBA Starting5 v0.10.84 — logo authority for Knicks 1994 + Hawks 1993 */
(()=>{
  if(window.__starting5ClassicLogoExpansionAuthorityV01084)return;
  window.__starting5ClassicLogoExpansionAuthorityV01084=true;
  const LOGOS={
    'classic-nyk-1994':'assets/team-logos/classic/new-york-knicks-1994.png',
    'classic-atl-1993':'assets/team-logos/classic/atlanta-hawks-1993.png'
  };
  window.STARTING5_CLASSIC_LOGOS={...(window.STARTING5_CLASSIC_LOGOS||{}),...LOGOS};
  const pools=()=>{const out=[];try{if(Array.isArray(players))out.push(players)}catch{};if(Array.isArray(window.COURTSIDE_CLASSIC_PLAYERS))out.push(window.COURTSIDE_CLASSIC_PLAYERS);if(Array.isArray(window.COURTSIDE_FOUNDATION_PLAYERS))out.push(window.COURTSIDE_FOUNDATION_PLAYERS);return out};
  const allPlayers=()=>{const seen=new Set(),out=[];for(const pool of pools())for(const p of pool||[])if(p&&!seen.has(p)){seen.add(p);out.push(p)}return out};
  const teams=()=>Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)?window.COURTSIDE_CLASSIC_TEAMS:[];
  const logoFor=p=>p&&LOGOS[p.teamId]||'';
  const sync=()=>{for(const p of allPlayers()){const s=logoFor(p);if(s)p.classicLogo=s}for(const t of teams()){if(LOGOS[t.id])t.logo=LOGOS[t.id]}};
  const prior=window.logoUrl;const resolver=p=>logoFor(p)||(typeof prior==='function'?prior(p):p?.classicLogo||'');try{logoUrl=resolver}catch{}window.logoUrl=resolver;
  const norm=s=>String(s||'').trim().toLowerCase();
  const findTeam=text=>{const s=norm(text);return teams().find(t=>LOGOS[t.id]&&[t.team,t.short,t.name].filter(Boolean).some(v=>s.includes(norm(v))))||null};
  const playerFor=card=>{const id=card?.dataset?.id,slug=card?.dataset?.artSlug,ps=allPlayers();if(id){const p=ps.find(x=>String(x.id)===String(id));if(p)return p}if(slug){const p=ps.find(x=>x.artSlug===slug);if(p)return p}const n=norm(card?.querySelector?.('.identity h3,.foundation-name,.player-name')?.textContent);return n?ps.find(x=>norm(x.name)===n&&LOGOS[x.teamId])||null:null};
  const set=(img,src)=>{if(img&&src&&img.getAttribute('src')!==src)img.setAttribute('src',src)};
  const fix=()=>{sync();document.querySelectorAll('.foundation-card,.player-card').forEach(card=>{const p=playerFor(card),src=logoFor(p);if(!src)return;set(card.querySelector('.foundation-team-logo,.team-logo,.team-mark img'),src);set(card.querySelector('.foundation-bg-team-logo'),src)});const hi=document.getElementById('catalogueTeamLogo');if(hi){const t=findTeam((document.getElementById('catalogueTeamName')?.textContent||'')+' '+(hi.alt||''));if(t)set(hi,LOGOS[t.id])}document.querySelectorAll('.classic-team-selector img,.classic-team-header img,#foundationInspectBack img,#game .score-side img,#final img').forEach(img=>{const box=img.closest('[data-team-id],[data-team],.score-side,section,article,div');const t=teams().find(x=>x.id===(box?.dataset?.teamId||box?.dataset?.team))||findTeam((box?.textContent||'')+' '+(img.alt||''));if(t&&LOGOS[t.id])set(img,LOGOS[t.id])})};
  const start=()=>{fix();new MutationObserver(()=>fix()).observe(document.body,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
