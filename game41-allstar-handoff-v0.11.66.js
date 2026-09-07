/* NBA Starting5 v0.11.70 — event-aware Season hub without render loops. */
(()=>{
  if(window.__s5Game41AllStarHandoffV01170)return;
  window.__s5Game41AllStarHandoffV01170=true;
  const SAVE_KEY='nbaStarting5SeasonV2';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return Number(r.w||0)+Number(r.l||0)};
  const atBreak=s=>!!s&&played(s)===41;
  const risingDone=s=>!!s?.allStarWeekend?.risingStars?.complete;
  const allStarDone=s=>!!s?.allStarWeekend?.allStar?.complete;
  const nextCard=()=>document.querySelector('#seasonHub .s5-next');

  function paintHub(){
    const s=read(),hub=document.getElementById('seasonHub'),card=nextCard();
    if(!s||!hub||!card||!atBreak(s)||allStarDone(s))return;
    const stage=risingDone(s)?'allstar':'rising';
    if(card.dataset.s5AllstarStage===stage)return;
    card.dataset.s5AllstarStage=stage;
    const label=card.querySelector('.s5-next-label');
    const matchup=card.querySelector('.s5-matchup');
    const btn=card.querySelector('#s5PlaySeasonGame,.s5-play');
    if(label)label.textContent='ALL-STAR WEEKEND · BETWEEN GAMES 41 & 42';
    if(matchup)matchup.innerHTML=`<div class="s5-side"><strong>EAST</strong><span>ALL-STAR WEEKEND</span></div><div class="s5-vs">VS</div><div class="s5-side"><strong>WEST</strong><span>${stage==='rising'?'RISING STARS':'ALL-STAR GAME'}</span></div>`;
    if(btn)btn.textContent=stage==='rising'?'Play Rising Stars':'Play All-Star Game';
  }

  function openStage(stage){
    try{
      if(stage==='rising'&&typeof window.STARTING5_RISING_STARS?.openIntro==='function'){window.STARTING5_RISING_STARS.openIntro();return true}
      if(stage==='allstar'&&typeof window.STARTING5_ALLSTAR_WEEKEND?.openChampions==='function'){window.STARTING5_ALLSTAR_WEEKEND.openChampions();return true}
    }catch(err){console.error('[Starting5 All-Star Weekend]',err)}
    return false;
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#s5PlaySeasonGame');if(!btn)return;
    const s=read();if(!atBreak(s)||allStarDone(s))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    openStage(risingDone(s)?'allstar':'rising');
  },true);

  // Paint only after navigation/render settles. No interval and no subtree
  // MutationObserver: those fought the standings enhancer over the same matchup
  // DOM and caused the v0.11.69 main-thread freeze.
  const schedulePaint=()=>{setTimeout(paintHub,80);setTimeout(paintHub,260)};
  document.addEventListener('click',e=>{if(e.target.closest('#seasonModeBtn,#playAgainBtn,#compactPlayAgain'))schedulePaint()},false);
  window.addEventListener('pageshow',schedulePaint);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedulePaint()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedulePaint,{once:true});else schedulePaint();

  const style=document.createElement('style');
  style.textContent=`
    #s5CpuChoiceStage .s5-cpu-history-card.previous{opacity:.52!important;filter:grayscale(.38) saturate(.68) brightness(.82)!important}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-matchup{grid-template-columns:1fr 42px 1fr}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-side{min-height:72px;display:flex;flex-direction:column;align-items:center;justify-content:center}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-side strong{font-size:18px;letter-spacing:.06em;min-height:0}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-side span{display:block;margin-top:5px;font-size:9px;color:#8e98a7;font-weight:900}
  `;
  document.head.appendChild(style);
})();
