/* NBA Starting5 v0.13.0-dev.4 — deterministic Game 41 -> All-Star Weekend hub adapter. */
(()=>{
  if(window.__s5Game41AllStarHandoffV01304)return;
  window.__s5Game41AllStarHandoffV01304=true;
  const SAVE_KEY='nbaStarting5SeasonV2';
  const EAST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png',WEST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return Number(r.w||0)+Number(r.l||0)};
  const nextCard=()=>document.querySelector('#seasonHub .s5-next');
  const eventSide=(side,logo,sub)=>`<div class="s5-event-side s5-allstar-conf-side"><img class="s5-allstar-conf-logo" src="${logo}" alt="${side} Conference"><div class="s5-conf-name">${side}</div><span>${sub}</span></div>`;
  const eventMatchup=stage=>`${eventSide('EAST',EAST_LOGO,stage==='rising'?'RISING STARS':'ALL-STAR GAME')}<div class="s5-vs">VS</div>${eventSide('WEST',WEST_LOGO,stage==='rising'?'RISING STARS':'ALL-STAR GAME')}`;
  function paintHub(){
    const s=read(),hub=document.getElementById('seasonHub'),card=nextCard();if(!s||!hub?.classList.contains('active')||!card||played(s)!==41||s?.allStarWeekend?.allStar?.complete)return;
    const stage=s?.allStarWeekend?.risingStars?.complete?'allstar':'rising',label=card.querySelector('.s5-next-label'),matchup=card.querySelector('.s5-matchup'),btn=card.querySelector('#s5PlaySeasonGame,.s5-play');if(!label||!matchup||!btn)return;
    card.dataset.s5AllstarStage=stage;label.textContent='ALL-STAR WEEKEND · BETWEEN GAMES 41 & 42';btn.textContent=stage==='rising'?'Play Rising Stars':'Play All-Star Game';matchup.innerHTML=eventMatchup(stage);matchup.dataset.s5ConferenceStage=stage;
  }
  function decorateConferenceHeaders(){
    const specs=[['#seasonRisingStars .s5-rs-team','Eastern Conference',EAST_LOGO,'EAST'],['#seasonRisingStars .s5-rs-team','Western Conference',WEST_LOGO,'WEST'],['#seasonAllStarWeekend .s5-as-team','Eastern Conference',EAST_LOGO,'EAST'],['#seasonAllStarWeekend .s5-as-team','Western Conference',WEST_LOGO,'WEST']];
    for(const [sel,title,src,side] of specs)document.querySelectorAll(sel).forEach(box=>{const h=box.querySelector('h3');if(!h||!h.textContent.toLowerCase().includes(title.toLowerCase())||h.querySelector('.s5-event-conf-logo'))return;h.innerHTML=`<img class="s5-event-conf-logo" src="${src}" alt="${side} Conference"><span>${title}</span>`});
  }
  function openStage(stage){if(stage==='rising')return !!window.STARTING5_RISING_STARS?.openIntro?.();if(stage==='allstar')return !!window.STARTING5_ALLSTAR_WEEKEND?.openChampions?.();return false}
  document.addEventListener('click',e=>{const btn=e.target.closest('#s5PlaySeasonGame'),stage=btn?.closest('.s5-next')?.dataset.s5AllstarStage;if(stage){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openStage(stage);requestAnimationFrame(decorateConferenceHeaders);return}if(e.target.closest('#seasonModeBtn,.s5-potw-continue,.s5-hotnot-continue'))requestAnimationFrame(()=>{paintHub();decorateConferenceHeaders()})},true);
  window.addEventListener('s5:game-finished',()=>requestAnimationFrame(paintHub));
  window.addEventListener('s5:allstar-champions-open',()=>requestAnimationFrame(decorateConferenceHeaders));
  window.addEventListener('s5:allstar-intro-open',()=>requestAnimationFrame(decorateConferenceHeaders));
  const style=document.createElement('style');style.textContent=`#s5CpuChoiceStage .s5-cpu-history-card.previous{opacity:.52!important;filter:grayscale(.38) saturate(.68) brightness(.82)!important}#seasonHub .s5-next[data-s5-allstar-stage] .s5-matchup{grid-template-columns:1fr 42px 1fr}#seasonHub .s5-next[data-s5-allstar-stage] .s5-allstar-conf-side{min-height:94px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}#seasonHub .s5-next[data-s5-allstar-stage] .s5-allstar-conf-logo{width:92px;height:52px;object-fit:contain;margin:0 auto 3px;display:block}#seasonHub .s5-next[data-s5-allstar-stage] .s5-conf-name{font-size:18px;font-weight:1000;letter-spacing:.06em;line-height:1.1;color:#fff}#seasonHub .s5-next[data-s5-allstar-stage] .s5-allstar-conf-side span{display:block;margin-top:4px;font-size:9px;color:#8e98a7;font-weight:900;text-align:center}#seasonRisingStars .s5-rs-team>h3,#seasonAllStarWeekend .s5-as-team>h3{display:flex;align-items:center;gap:8px}.s5-event-conf-logo{width:52px;height:30px;object-fit:contain;flex:0 0 auto}`;document.head.appendChild(style);
  const start=()=>requestAnimationFrame(()=>{paintHub();decorateConferenceHeaders()});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();