/* NBA Starting5 v0.13.0-dev.3 — conference-branded special-game finals, event-driven. */
(()=>{
  if(window.__starting5SpecialFinalConferenceBrandV01303)return;
  window.__starting5SpecialFinalConferenceBrandV01303=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const RS_ACTIVE_KEY='nbaStarting5RisingStarsActiveV1';
  const EAST_TEAMS=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const CONF={EAST:{name:'EAST',full:'Eastern Conference',logo:'https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png'},WEST:{name:'WEST',full:'Western Conference',logo:'https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png'}};
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const risingActive=()=>{try{return sessionStorage.getItem(RS_ACTIVE_KEY)==='1'}catch{return false}};
  const allStarActive=()=>document.getElementById('game')?.classList.contains('s5-all-star-standard-game');
  const specialType=()=>risingActive()?'rising':allStarActive()?'allstar':null;
  const userConference=()=>{const s=read();return s&&EAST_TEAMS.has(String(s.teamId))?'EAST':'WEST'};
  const specialScoreboard=(left,right,u,c)=>`<div class="s5-special-final-team s5-special-final-left"><img src="${left.logo}" alt="${left.full}"><strong>${u}</strong><span>${left.name}</span></div><div class="s5-special-final-dash">–</div><div class="s5-special-final-team s5-special-final-right"><img src="${right.logo}" alt="${right.full}"><strong>${c}</strong><span>${right.name}</span></div>`;

  function decorate(detail={}){
    const type=specialType(),final=document.getElementById('final');if(!type||!final?.classList.contains('active'))return;
    const user=userConference(),cpu=user==='EAST'?'WEST':'EAST',left=CONF[user],right=CONF[cpu],u=Number(detail.userScore??state?.userScore)||0,c=Number(detail.cpuScore??state?.cpuScore)||0,winner=u===c?'TIE':u>c?user:cpu;
    const headline=final.querySelector('.s5-final-winner-banner')||final.querySelector('#finalResult')||final.querySelector('.compact-final-card h2');if(headline)headline.textContent=winner==='TIE'?'GAME TIED':`${winner} WINS`;
    const kicker=final.querySelector('.compact-final-kicker,.kicker');if(kicker)kicker.textContent=type==='rising'?'RISING STARS FINAL':'ALL-STAR GAME FINAL';
    const board=final.querySelector('.compact-final-scoreboard')||final.querySelector('.final-score');if(board){board.classList.add('s5-special-final-scoreboard');board.innerHTML=specialScoreboard(left,right,u,c)}
  }

  const style=document.createElement('style');style.textContent=`#final .s5-special-final-scoreboard{display:grid!important;grid-template-columns:minmax(0,1fr) 32px minmax(0,1fr)!important;align-items:center!important;gap:8px!important;width:100%!important;margin:0 auto 24px!important}#final .s5-special-final-team{display:grid!important;grid-template-rows:108px auto auto!important;justify-items:center!important;align-items:center!important;min-width:0!important}#final .s5-special-final-team img{width:116px!important;height:104px!important;object-fit:contain!important;filter:drop-shadow(0 0 2px rgba(255,255,255,.92)) drop-shadow(0 5px 12px rgba(0,0,0,.34))!important}#final .s5-special-final-team strong{font-size:50px!important;line-height:1!important;font-weight:500!important;letter-spacing:-.04em!important;color:#fff!important}#final .s5-special-final-team span{margin-top:5px!important;font-size:11px!important;line-height:1!important;font-weight:1000!important;letter-spacing:.12em!important;color:#fff!important;text-transform:uppercase!important}#final .s5-special-final-dash{font-size:42px!important;font-weight:900!important;color:#fff!important;text-align:center!important;margin-top:42px!important}@media(max-width:430px){#final .s5-special-final-scoreboard{grid-template-columns:minmax(0,1fr) 28px minmax(0,1fr)!important;gap:5px!important;margin-bottom:22px!important}#final .s5-special-final-team{grid-template-rows:94px auto auto!important}#final .s5-special-final-team img{width:98px!important;height:90px!important}#final .s5-special-final-team strong{font-size:46px!important}#final .s5-special-final-team span{font-size:10px!important}#final .s5-special-final-dash{font-size:38px!important;margin-top:38px!important}}`;document.head.appendChild(style);

  window.addEventListener('s5:game-finished',e=>requestAnimationFrame(()=>decorate(e.detail||{})));
})();