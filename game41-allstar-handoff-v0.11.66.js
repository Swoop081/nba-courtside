/* NBA Starting5 v0.11.69 — Season hub owns the Game 41 -> Rising Stars -> All-Star Game -> Game 42 sequence. */
(()=>{
  if(window.__s5Game41AllStarHandoffV01169)return;
  window.__s5Game41AllStarHandoffV01169=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return Number(r.w||0)+Number(r.l||0)};
  const atBreak=s=>!!s&&played(s)===41;
  const risingDone=s=>!!s?.allStarWeekend?.risingStars?.complete;
  const allStarDone=s=>!!s?.allStarWeekend?.allStar?.complete;

  let savedNext=null;
  const nextCard=()=>document.querySelector('#seasonHub .s5-next');
  const rememberNormal=card=>{
    if(!card||savedNext)return;
    const label=card.querySelector('.s5-next-label'),matchup=card.querySelector('.s5-matchup'),btn=card.querySelector('#s5PlaySeasonGame,.s5-play');
    if(!label||!matchup||!btn)return;
    savedNext={card,labelHtml:label.innerHTML,matchupHtml:matchup.innerHTML,buttonText:btn.textContent};
  };
  const restoreNormal=()=>{
    const card=nextCard();if(!card||!savedNext)return;
    const label=card.querySelector('.s5-next-label'),matchup=card.querySelector('.s5-matchup'),btn=card.querySelector('#s5PlaySeasonGame,.s5-play');
    if(label)label.innerHTML=savedNext.labelHtml;
    if(matchup)matchup.innerHTML=savedNext.matchupHtml;
    if(btn)btn.textContent=savedNext.buttonText;
    card.removeAttribute('data-s5-allstar-stage');
    savedNext=null;
  };

  const eventMatchup=(title,sub)=>`<div class="s5-side"><strong>${title}</strong><span style="display:block;margin-top:5px;font-size:9px;color:#8e98a7;font-weight:900">${sub}</span></div><div class="s5-vs">VS</div><div class="s5-side"><strong>WEST</strong><span style="display:block;margin-top:5px;font-size:9px;color:#8e98a7;font-weight:900">ALL-STAR WEEKEND</span></div>`;

  const paintHub=()=>{
    const s=read(),hub=document.getElementById('seasonHub'),card=nextCard();
    if(!hub||!card)return;
    rememberNormal(card);
    if(!atBreak(s)||allStarDone(s)){restoreNormal();return;}

    const label=card.querySelector('.s5-next-label'),matchup=card.querySelector('.s5-matchup'),btn=card.querySelector('#s5PlaySeasonGame,.s5-play');
    if(!label||!matchup||!btn)return;

    if(!risingDone(s)){
      card.dataset.s5AllstarStage='rising';
      label.textContent='ALL-STAR WEEKEND · BETWEEN GAMES 41 & 42';
      matchup.innerHTML=eventMatchup('EAST','RISING STARS');
      btn.textContent='Play Rising Stars';
    }else{
      card.dataset.s5AllstarStage='allstar';
      label.textContent='ALL-STAR WEEKEND · BETWEEN GAMES 41 & 42';
      matchup.innerHTML=eventMatchup('EAST','ALL-STAR GAME');
      btn.textContent='Play All-Star Game';
    }
  };

  const openStage=stage=>{
    try{
      if(stage==='rising'&&typeof window.STARTING5_RISING_STARS?.openIntro==='function'){
        window.STARTING5_RISING_STARS.openIntro();return true;
      }
      if(stage==='allstar'&&typeof window.STARTING5_ALLSTAR_WEEKEND?.openChampions==='function'){
        window.STARTING5_ALLSTAR_WEEKEND.openChampions();return true;
      }
    }catch(err){console.error('[Starting5 All-Star Weekend]',err)}
    return false;
  };

  // The Season hub button becomes the event button during the break. The normal
  // Game 42 click handler is blocked until both showcase games are complete.
  document.addEventListener('click',e=>{
    const btn=e.target.closest('#s5PlaySeasonGame');if(!btn)return;
    const card=btn.closest('.s5-next'),stage=card?.dataset.s5AllstarStage;
    if(!stage)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    openStage(stage);
  },true);

  // Game 41 final Continue should return to the Season hub normally. No direct
  // jump into Rising Stars: the hub itself now presents the weekend as Next Up.

  const style=document.createElement('style');
  style.textContent=`
    #s5CpuChoiceStage .s5-cpu-history-card.previous{opacity:.52!important;filter:grayscale(.38) saturate(.68) brightness(.82)!important}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-matchup{grid-template-columns:1fr 42px 1fr}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-side{min-height:72px;display:flex;flex-direction:column;align-items:center;justify-content:center}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-side strong{font-size:18px;letter-spacing:.06em}
  `;
  document.head.appendChild(style);

  const tick=()=>paintHub();
  const timer=setInterval(tick,200);
  const start=()=>{paintHub();const hub=document.getElementById('seasonHub');if(hub)new MutationObserver(()=>requestAnimationFrame(paintHub)).observe(hub,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)paintHub()});
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();
