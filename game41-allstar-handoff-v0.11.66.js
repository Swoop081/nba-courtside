/* NBA Starting5 v0.11.72 — Season hub owns Game 41 -> Rising Stars -> All-Star Game -> Game 42; East/West conference branding. */
(()=>{
  if(window.__s5Game41AllStarHandoffV01172)return;
  window.__s5Game41AllStarHandoffV01172=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const EAST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png';
  const WEST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png';
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
    savedNext={labelHtml:label.innerHTML,matchupHtml:matchup.innerHTML,buttonText:btn.textContent};
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

  const eventSide=(side,logo,sub)=>`<div class="s5-side s5-allstar-conf-side"><img class="s5-allstar-conf-logo" src="${logo}" alt="${side} Conference"><strong>${side}</strong><span>${sub}</span></div>`;
  const eventMatchup=stage=>`${eventSide('EAST',EAST_LOGO,stage==='rising'?'RISING STARS':'ALL-STAR GAME')}<div class="s5-vs">VS</div>${eventSide('WEST',WEST_LOGO,'ALL-STAR WEEKEND')}`;

  const paintHub=()=>{
    const s=read(),hub=document.getElementById('seasonHub'),card=nextCard();
    if(!hub||!card)return;
    rememberNormal(card);
    if(!atBreak(s)||allStarDone(s)){restoreNormal();return;}

    const label=card.querySelector('.s5-next-label'),matchup=card.querySelector('.s5-matchup'),btn=card.querySelector('#s5PlaySeasonGame,.s5-play');
    if(!label||!matchup||!btn)return;
    const stage=!risingDone(s)?'rising':'allstar';
    card.dataset.s5AllstarStage=stage;
    const wantedLabel='ALL-STAR WEEKEND · BETWEEN GAMES 41 & 42';
    const wantedBtn=stage==='rising'?'Play Rising Stars':'Play All-Star Game';
    if(label.textContent!==wantedLabel)label.textContent=wantedLabel;
    if(btn.textContent!==wantedBtn)btn.textContent=wantedBtn;
    if(matchup.dataset.s5ConferenceStage!==stage){matchup.innerHTML=eventMatchup(stage);matchup.dataset.s5ConferenceStage=stage;}
  };

  const decorateConferenceHeaders=()=>{
    const specs=[
      ['#seasonRisingStars .s5-rs-team','Eastern Conference',EAST_LOGO,'EAST'],
      ['#seasonRisingStars .s5-rs-team','Western Conference',WEST_LOGO,'WEST'],
      ['#seasonAllStarWeekend .s5-as-team','Eastern Conference',EAST_LOGO,'EAST'],
      ['#seasonAllStarWeekend .s5-as-team','Western Conference',WEST_LOGO,'WEST']
    ];
    specs.forEach(([sel,title,src,side])=>{
      document.querySelectorAll(sel).forEach(box=>{
        const h=box.querySelector('h3');if(!h||!h.textContent.toLowerCase().includes(title.toLowerCase()))return;
        if(h.querySelector('.s5-event-conf-logo'))return;
        h.innerHTML=`<img class="s5-event-conf-logo" src="${src}" alt="${side} Conference"><span>${title}</span>`;
      });
    });
  };

  const openStage=stage=>{
    try{
      if(stage==='rising'&&typeof window.STARTING5_RISING_STARS?.openIntro==='function'){window.STARTING5_RISING_STARS.openIntro();setTimeout(decorateConferenceHeaders,0);return true;}
      if(stage==='allstar'&&typeof window.STARTING5_ALLSTAR_WEEKEND?.openChampions==='function'){window.STARTING5_ALLSTAR_WEEKEND.openChampions();setTimeout(decorateConferenceHeaders,0);return true;}
    }catch(err){console.error('[Starting5 All-Star Weekend]',err)}
    return false;
  };

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#s5PlaySeasonGame');if(btn){
      const card=btn.closest('.s5-next'),stage=card?.dataset.s5AllstarStage;
      if(stage){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openStage(stage);return;}
    }
    // The existing Season standings enhancer may repaint the regular matchup after
    // the hub appears. Re-assert the conference matchup only after real user actions,
    // with no polling or subtree observer.
    if(atBreak(read())){setTimeout(paintHub,30);setTimeout(paintHub,140);}
    setTimeout(decorateConferenceHeaders,0);
  },true);

  const style=document.createElement('style');
  style.textContent=`
    #s5CpuChoiceStage .s5-cpu-history-card.previous{opacity:.52!important;filter:grayscale(.38) saturate(.68) brightness(.82)!important}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-matchup{grid-template-columns:1fr 42px 1fr}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-allstar-conf-side{min-height:94px;display:flex;flex-direction:column;align-items:center;justify-content:center}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-allstar-conf-logo{width:92px;height:52px;object-fit:contain;margin:0 auto 3px;display:block}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-allstar-conf-side strong{font-size:18px!important;letter-spacing:.06em;min-height:0!important}
    #seasonHub .s5-next[data-s5-allstar-stage] .s5-allstar-conf-side span{display:block;margin-top:4px;font-size:9px;color:#8e98a7;font-weight:900;text-align:center}
    #seasonRisingStars .s5-rs-team>h3,#seasonAllStarWeekend .s5-as-team>h3{display:flex;align-items:center;gap:8px}
    .s5-event-conf-logo{width:52px;height:30px;object-fit:contain;flex:0 0 auto}
  `;
  document.head.appendChild(style);

  const start=()=>{paintHub();decorateConferenceHeaders()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('pageshow',()=>{setTimeout(paintHub,40);setTimeout(decorateConferenceHeaders,40)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){setTimeout(paintHub,40);setTimeout(decorateConferenceHeaders,40)}});
})();
