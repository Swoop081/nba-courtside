/* NBA Starting5 v0.13.0-dev.3 — All-Star skill champions presentation, event-driven. */
(()=>{
  if(window.__starting5AllStarChampionsPotwV01303)return;
  window.__starting5AllStarChampionsPotwV01303=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const pool=()=>{try{return Array.isArray(players)?players:[]}catch{return []}};
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId||''}|${p?.name||'Player'}`);
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const teamName=id=>{const p=pool().find(x=>String(x.teamId)===String(id)&&!x.classicTeam);return p?.team||p?.teamShort||'Team'};
  const findPlayer=row=>pool().find(p=>key(p)===String(row?.playerKey))||pool().find(p=>p?.name===row?.name&&String(p?.teamId)===String(row?.teamId))||null;

  function awardCard(row,title,metric){
    const p=findPlayer(row);let card='';try{if(p&&typeof cardMarkup==='function')card=cardMarkup(p,{eager:true})}catch{}
    return `<article class="s5-asw-potw-player"><div class="s5-asw-potw-conf">${title}</div><div class="s5-asw-potw-card">${card}</div><div class="s5-asw-potw-name">${row?.name||'—'}</div><div class="s5-asw-potw-team"><img src="${logo(row?.teamId||'')}" alt="">${teamName(row?.teamId)}</div><div class="s5-asw-potw-score"><strong>${Number(row?.plus||0)>=0?'+':''}${Number(row?.plus||0)}</strong><span>${metric}</span></div></article>`;
  }
  function apply(){
    const screen=document.getElementById('seasonAllStarWeekend'),host=document.getElementById('s5AllStarWeekendContent');if(!screen||!host||!screen.classList.contains('active'))return;
    const s=read(),ch=s?.allStarWeekend?.skillChampions;if(!ch?.complete||!ch?.threePoint||!ch?.slamDunk)return;
    host.innerHTML=`<div class="s5-asw-potw-kicker">FIRST-HALF STAT LEADERS</div><h2 class="s5-asw-potw-title">ALL-STAR WEEKEND</h2><div class="s5-asw-potw-sub">THROUGH GAME 41</div><div class="s5-asw-potw-grid">${awardCard(ch.threePoint,'3PT CHAMPION','3PT MATCHUP DIFFERENTIAL')}${awardCard(ch.slamDunk,'DUNK CHAMPION','DUNKING MATCHUP DIFFERENTIAL')}</div><button type="button" class="primary-btn s5-asw-potw-continue" data-as-next>Continue to All-Star Game</button>`;
    host.querySelector('[data-as-next]')?.addEventListener('click',()=>window.STARTING5_ALLSTAR_WEEKEND?.openAllStarIntro?.());
    try{if(typeof window.__courtsideFoundationRatingApply==='function')requestAnimationFrame(window.__courtsideFoundationRatingApply)}catch{}
  }

  const style=document.createElement('style');style.textContent=`#seasonAllStarWeekend #s5AllStarWeekendContent{text-align:center}#seasonAllStarWeekend .s5-asw-potw-kicker{color:#f7b928;font-size:10px;font-weight:1000;letter-spacing:.18em;margin-top:4px}#seasonAllStarWeekend .s5-asw-potw-title{margin:5px 0 3px;font-size:28px;line-height:1;font-weight:1000}#seasonAllStarWeekend .s5-asw-potw-sub{color:#8f99a8;font-size:10px;font-weight:900;letter-spacing:.09em;margin-bottom:12px}#seasonAllStarWeekend .s5-asw-potw-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}#seasonAllStarWeekend .s5-asw-potw-player{min-width:0;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:linear-gradient(180deg,#121925,#090d13);padding:9px 7px 10px;overflow:hidden}#seasonAllStarWeekend .s5-asw-potw-conf{font-size:8px;font-weight:1000;letter-spacing:.08em;color:#f7b928;margin-bottom:7px}#seasonAllStarWeekend .s5-asw-potw-card{width:100%;display:flex;justify-content:center;overflow:hidden}#seasonAllStarWeekend .s5-asw-potw-card>.player-card{width:100%!important;max-width:154px!important;min-width:0!important;pointer-events:none!important}#seasonAllStarWeekend .s5-asw-potw-name{font-size:12px;font-weight:1000;line-height:1.05;margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#seasonAllStarWeekend .s5-asw-potw-team{display:flex;align-items:center;justify-content:center;gap:4px;color:#aab3c0;font-size:8px;font-weight:900;margin-top:4px;white-space:nowrap;overflow:hidden}#seasonAllStarWeekend .s5-asw-potw-team img{width:17px;height:17px;object-fit:contain}#seasonAllStarWeekend .s5-asw-potw-score{margin-top:7px;padding-top:7px;border-top:1px solid rgba(255,255,255,.08)}#seasonAllStarWeekend .s5-asw-potw-score strong{display:block;font-size:24px;line-height:1;color:#fff}#seasonAllStarWeekend .s5-asw-potw-score span{display:block;margin-top:2px;font-size:7px;font-weight:1000;letter-spacing:.09em;color:#8f99a8;line-height:1.25}#seasonAllStarWeekend .s5-asw-potw-continue{width:100%;min-height:54px;margin-top:12px;font-size:18px!important;font-weight:1000!important}@media(max-width:390px){#seasonAllStarWeekend .s5-asw-potw-grid{gap:7px}#seasonAllStarWeekend .s5-asw-potw-player{padding-left:5px;padding-right:5px}#seasonAllStarWeekend .s5-asw-potw-card>.player-card{max-width:145px!important}#seasonAllStarWeekend .s5-asw-potw-title{font-size:25px}}`;document.head.appendChild(style);

  window.addEventListener('s5:allstar-champions-open',apply);
})();