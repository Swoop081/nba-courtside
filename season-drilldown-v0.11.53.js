/* NBA Starting5 v0.11.55 — reliable season player card inspect + catalogue-style team overview. */
(()=>{
  if(window.__starting5SeasonDrilldownV01153)return;
  window.__starting5SeasonDrilldownV01153=true;
  const POS={PG:0,SG:1,SF:2,PF:3,C:4};
  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const LABEL={scoring:'Scoring',dunks:'Dunking',three:'3PT',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
  const SAVE_KEY='nbaStarting5SeasonV2';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
  const pool=()=>{try{return Array.isArray(players)?players:[]}catch{return []}};
  const pkey=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const teamPlayers=id=>pool().filter(p=>String(p.teamId)===String(id)&&!p.classicTeam).sort((a,b)=>(POS[a.position]??9)-(POS[b.position]??9));
  const teamName=id=>teamPlayers(id)[0]?.team||teamPlayers(id)[0]?.teamShort||'Team';
  const short=id=>{try{return window.TEAM_SHORT?.[id]||TEAM_SHORT?.[id]||teamPlayers(id)[0]?.teamShort||'Team'}catch{return teamPlayers(id)[0]?.teamShort||'Team'}};
  const readSeason=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const byName=(name,teamId)=>pool().find(p=>!p.classicTeam&&p.name===name&&(!teamId||String(p.teamId)===String(teamId)))||null;

  const css=document.createElement('style');css.id='s5-season-drilldown-style';css.textContent=`
    .s5-click-player,.s5-click-team{cursor:pointer}.s5-click-player:active,.s5-click-team:active{opacity:.72}
    #s5PlayerInspect{position:fixed;inset:0;z-index:10050;display:none;align-items:center;justify-content:center;padding:28px 18px;background:rgba(2,5,10,.84);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    #s5PlayerInspect.open{display:flex}.s5-inspect-stage{width:min(86vw,390px);aspect-ratio:2.5/3.5;perspective:1200px}.s5-inspect-flip{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform .34s ease}.s5-inspect-flip.flipped{transform:rotateY(180deg)}
    .s5-inspect-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:22px;overflow:hidden}.s5-inspect-front .player-card{width:100%!important;height:100%!important;max-width:none!important;transform:none!important;margin:0!important}.s5-inspect-front .stats{display:none!important}.s5-inspect-back{transform:rotateY(180deg);background:linear-gradient(180deg,#151d29,#080c12);border:1px solid rgba(255,255,255,.14);box-shadow:0 28px 80px rgba(0,0,0,.5);padding:20px;display:flex;flex-direction:column;color:#fff}
    .s5-inspect-backhead{display:flex;align-items:center;gap:12px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,.09)}.s5-inspect-backhead img{width:54px;height:54px;object-fit:contain}.s5-inspect-backhead h3{margin:0;font-size:22px;line-height:1.05}.s5-inspect-backhead p{margin:5px 0 0;color:#929dab;font-size:11px;font-weight:800}.s5-inspect-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.s5-inspect-stat{border:1px solid rgba(255,255,255,.08);border-radius:13px;background:rgba(255,255,255,.035);padding:11px}.s5-inspect-stat b{display:block;font-size:27px;color:#f7b928;line-height:1}.s5-inspect-stat span{display:block;font-size:9px;color:#9aa5b4;text-transform:uppercase;letter-spacing:.09em;font-weight:1000;margin-top:5px}.s5-inspect-hint{text-align:center;margin-top:auto;padding-top:13px;color:#7f8998;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}
    #seasonTeamOverview{padding-bottom:34px}.s5-team-overview-hero{border:1px solid rgba(255,255,255,.11);border-radius:22px;background:linear-gradient(180deg,#141c27,#090d13);padding:24px 18px;text-align:center;margin-bottom:14px}.s5-team-overview-hero img{width:105px;height:105px;object-fit:contain}.s5-team-overview-hero h2{margin:7px 0 3px;font-size:27px}.s5-team-overview-hero p{margin:0;color:#f7b928;font-size:12px;font-weight:1000}.s5-team-overview-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.s5-team-overview-card{min-width:0;cursor:pointer}.s5-team-overview-card .player-card{width:100%!important;max-width:none!important;margin:0!important}.s5-team-overview-pos{display:none}
    #seasonHub .s5-team-cell,#seasonHub .s5-matchup .s5-side{cursor:pointer}#s5AwardsContent .s5-race-row,#s5AwardsContent .s5-allnba-line{cursor:pointer}
    @media(max-width:430px){.s5-inspect-stage{width:min(88vw,360px)}.s5-team-overview-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.s5-team-overview-hero{padding:20px 14px}.s5-team-overview-hero img{width:92px;height:92px}}
  `;document.head.appendChild(css);

  function activateScreen(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active')}
  function ensurePlayerOverlay(){let el=document.getElementById('s5PlayerInspect');if(el)return el;el=document.createElement('div');el.id='s5PlayerInspect';el.innerHTML='<div class="s5-inspect-stage" role="dialog" aria-modal="true"><div class="s5-inspect-flip"></div></div>';document.body.appendChild(el);el.addEventListener('click',e=>{const stage=e.target.closest('.s5-inspect-stage');if(!stage){closePlayer();return}e.stopPropagation();el.querySelector('.s5-inspect-flip')?.classList.toggle('flipped')});return el}
  function openPlayer(p){if(!p)return;const el=ensurePlayerOverlay(),flip=el.querySelector('.s5-inspect-flip');const front=typeof cardMarkup==='function'?cardMarkup(p,{eager:true}):`<article class="player-card"><h3>${esc(p.name)}</h3></article>`;flip.classList.remove('flipped');flip.innerHTML=`<div class="s5-inspect-face s5-inspect-front">${front}</div><div class="s5-inspect-face s5-inspect-back"><div class="s5-inspect-backhead"><img src="${logo(p.teamId)}" alt=""><div><h3>${esc(p.name)}</h3><p>${esc(p.position||'')} · ${esc(teamName(p.teamId))}</p></div></div><div class="s5-inspect-stats">${CATS.map(k=>`<div class="s5-inspect-stat"><b>${Number(p.stats?.[k]??0)}</b><span>${LABEL[k]}</span></div>`).join('')}</div><div class="s5-inspect-hint">Tap card to flip back · tap outside to close</div></div>`;el.classList.add('open');document.body.style.overflow='hidden'}
  function closePlayer(){document.getElementById('s5PlayerInspect')?.classList.remove('open');document.body.style.overflow=''}

  function ensureTeamScreen(){let screen=document.getElementById('seasonTeamOverview');if(screen)return screen;const hub=document.getElementById('seasonHub'),shell=hub?.parentElement||document.querySelector('.app-shell');if(!shell)return null;screen=document.createElement('section');screen.id='seasonTeamOverview';screen.className='screen s5-season-screen';screen.innerHTML='<div class="s5-season-head"><div><div class="s5-season-kicker">Season Team Overview</div><h2>Team</h2></div><button class="ghost-btn" data-s5-team-back>← Back</button></div><div id="s5TeamOverviewContent"></div>';shell.appendChild(screen);screen.querySelector('[data-s5-team-back]').addEventListener('click',()=>{activateScreen('seasonHub');window.scrollTo(0,0)});return screen}
  function openTeam(id){const ps=teamPlayers(id),screen=ensureTeamScreen();if(!screen||!ps.length)return;const s=readSeason(),rec=s?.records?.[id];screen.querySelector('.s5-season-head h2').textContent=short(id);const c=screen.querySelector('#s5TeamOverviewContent');c.innerHTML=`<section class="s5-team-overview-hero"><img src="${logo(id)}" alt=""><h2>${esc(teamName(id))}</h2>${rec?`<p>${rec.w}-${rec.l}</p>`:''}</section><div class="s5-team-overview-grid">${ps.slice(0,5).map(p=>`<div class="s5-team-overview-card" data-s5-player-key="${esc(pkey(p))}">${typeof cardMarkup==='function'?cardMarkup(p,{eager:true}):`<div>${esc(p.name)}</div>`}</div>`).join('')}</div>`;activateScreen('seasonTeamOverview');window.scrollTo(0,0)}

  function playerFromAwardsRow(row){let name='';if(row.classList.contains('s5-allnba-line')){name=row.querySelector('span')?.textContent?.replace(/^\s*(PG|SG|SF|PF|C)\s*·\s*/,'').trim()||''}else{name=row.querySelector('b')?.textContent?.trim()||''}const src=row.querySelector('img')?.src||'',teamId=src.match(/\/nba\/(\d+)\//)?.[1];return byName(name,teamId)||byName(name)}
  function teamIdFromNode(node){const src=node?.querySelector('img')?.src||node?.closest('.s5-side')?.querySelector('img')?.src||'';return src.match(/\/nba\/(\d+)\//)?.[1]||null}

  document.addEventListener('click',e=>{
    const teamCard=e.target.closest('.s5-team-overview-card');if(teamCard){const p=pool().find(x=>pkey(x)===teamCard.dataset.s5PlayerKey);if(p){e.preventDefault();e.stopPropagation();openPlayer(p)}return}
    const awardRow=e.target.closest('#s5AwardsContent .s5-race-row,#s5AwardsContent .s5-allnba-line');if(awardRow){const p=playerFromAwardsRow(awardRow);if(p){e.preventDefault();e.stopPropagation();openPlayer(p)}return}
    const standings=e.target.closest('#seasonHub .s5-team-cell,#seasonHub .s5-row-v01120');if(standings){const id=teamIdFromNode(standings);if(id){e.preventDefault();e.stopPropagation();openTeam(id)}return}
    const matchup=e.target.closest('#seasonHub .s5-matchup .s5-side');if(matchup){const id=teamIdFromNode(matchup);if(id){e.preventDefault();e.stopPropagation();openTeam(id)}return}
  },true);

  window.STARTING5_SEASON_DRILLDOWN={openPlayer,openTeam,closePlayer};
})();
