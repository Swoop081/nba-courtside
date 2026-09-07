/* NBA Starting5 v0.13.0-dev.4 — final screen + Player of the Week + restart Season. */
(()=>{
  if(window.__starting5FinalUiV01304)return;
  window.__starting5FinalUiV01304=true;

  if(!document.querySelector('script[data-s5-potw]')){const s=document.createElement('script');s.dataset.s5Potw='1';s.src='season-player-of-week-v0.11.23.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());document.head.appendChild(s)}
  const SAVE_KEY='nbaStarting5SeasonV2';
  const SEASON_SESSION_KEYS=['nbaStarting5SeasonGameUiV1','nbaStarting5SeasonPendingGameV1'];

  function ensureRestartSeason(){
    const hub=document.getElementById('seasonHub'),head=hub?.querySelector('.s5-season-head');if(!hub||!head||document.getElementById('s5RestartSeasonBtn'))return;
    const home=head.querySelector('[data-season-home]'),actions=document.createElement('div'),restart=document.createElement('button');actions.className='s5-season-head-actions';restart.id='s5RestartSeasonBtn';restart.className='ghost-btn s5-restart-season';restart.type='button';restart.textContent='New Season';
    if(home){home.parentNode.insertBefore(actions,home);actions.appendChild(restart);actions.appendChild(home)}else{head.appendChild(actions);actions.appendChild(restart)}
    restart.addEventListener('click',()=>{if(!confirm('Start a new 82-game season? Your current season record, standings and weekly awards will be erased.'))return;try{localStorage.removeItem(SAVE_KEY)}catch{}try{SEASON_SESSION_KEYS.forEach(k=>sessionStorage.removeItem(k))}catch{}const seasonBtn=document.getElementById('seasonModeBtn');if(seasonBtn)seasonBtn.click();window.scrollTo({top:0,behavior:'instant'})});
  }
  function enhanceFinal(){
    const final=document.getElementById('final');if(!final?.classList.contains('active'))return;const card=final.querySelector('.compact-final-card');
    if(card){const old=card.querySelector('h2'),text=(old?.textContent||'').trim().replace(/!+$/,'').toUpperCase();if(text){let banner=final.querySelector('.s5-final-winner-banner');if(!banner){banner=document.createElement('div');banner.className='s5-final-winner-banner';final.insertBefore(banner,card)}banner.textContent=text;old?.classList.add('s5-final-old-winner')}}
    else{const result=document.getElementById('finalResult');if(result){const text=(result.textContent||'').trim();if(text)result.textContent=text.toUpperCase();if(result.parentElement!==final)final.insertBefore(result,final.firstChild);result.classList.add('s5-final-winner-headline')}}
  }
  const goMenu=()=>{const intro=document.getElementById('intro');try{showScreen('intro')}catch{}if(intro&&!intro.classList.contains('active')){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));intro.classList.add('active')}window.scrollTo({top:0,behavior:'instant'})};

  const style=document.createElement('style');style.textContent=`#final>.s5-final-winner-banner,#final>.s5-final-winner-headline{display:block!important;width:100%!important;box-sizing:border-box!important;margin:0 0 10px!important;padding:0 12px!important;text-align:center!important;font-size:58px!important;line-height:.92!important;font-weight:1000!important;letter-spacing:-.035em!important;text-transform:uppercase!important;color:#fff!important}#final .compact-final-card>h2.s5-final-old-winner,#final .final-card>#finalResult{display:none!important}#final .compact-final-scoreboard{margin-bottom:26px!important}#final .compact-final-scoreboard + h2.s5-final-old-winner + .potg-label,#final .compact-final-scoreboard + .potg-label{margin-top:0!important}#seasonHub .s5-season-head-actions{display:flex;align-items:center;gap:7px;flex:0 0 auto}#seasonHub .s5-restart-season{white-space:nowrap;color:#f7b928!important;border-color:rgba(247,185,40,.35)!important}@media(max-width:430px){#final>.s5-final-winner-banner,#final>.s5-final-winner-headline{font-size:56px!important;margin-bottom:9px!important}#final .compact-final-scoreboard{margin-bottom:24px!important}#seasonHub .s5-season-head-actions{gap:5px}#seasonHub .s5-season-head-actions .ghost-btn{padding-left:9px!important;padding-right:9px!important;font-size:10px!important}}@media(max-width:370px){#final>.s5-final-winner-banner,#final>.s5-final-winner-headline{font-size:50px!important}}`;document.head.appendChild(style);

  window.addEventListener('s5:game-finished',()=>requestAnimationFrame(enhanceFinal));
  document.addEventListener('click',e=>{if(e.target.closest('#seasonModeBtn'))requestAnimationFrame(ensureRestartSeason);const final=document.getElementById('final');if(!final?.classList.contains('active'))return;const btn=e.target.closest('button');if(!btn)return;const isMenu=btn.id==='compactMenu'||((btn.textContent||'').trim().toUpperCase()==='MENU'&&btn.id!=='newGameBtn');if(!isMenu)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();goMenu()},true);
  const start=()=>{ensureRestartSeason();enhanceFinal()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();