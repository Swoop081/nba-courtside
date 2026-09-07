/* NBA Starting5 v0.11.66 — Game 41 final -> All-Star Weekend handoff + readable used CPU rail. */
(()=>{
  if(window.__s5Game41AllStarHandoffV01166)return;
  window.__s5Game41AllStarHandoffV01166=true;
  const SAVE_KEY='nbaStarting5SeasonV2';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return Number(r.w||0)+Number(r.l||0)};
  const needsWeekend=s=>!!s&&played(s)===41&&!s?.allStarWeekend?.risingStars?.complete;
  const openWeekend=()=>{
    const s=read();if(!needsWeekend(s))return false;
    if(window.STARTING5_RISING_STARS?.openIntro){window.STARTING5_RISING_STARS.openIntro();return true;}
    return false;
  };

  document.addEventListener('click',e=>{
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const btn=e.target.closest('button');if(!btn)return;
    const text=(btn.textContent||'').trim().toUpperCase();
    if(text!=='CONTINUE')return;
    const s=read();if(!needsWeekend(s))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(openWeekend())return;
    let tries=0;const timer=setInterval(()=>{tries++;if(openWeekend()||tries>=20)clearInterval(timer)},100);
  },true);

  // In case the normal final-screen continuation already tried to return to the hub,
  // automatically route the exact 41-game breakpoint into Rising Stars.
  const tick=()=>{
    const s=read();if(!needsWeekend(s))return;
    const final=document.getElementById('final');
    const hub=document.getElementById('seasonHub');
    if(final?.classList.contains('active'))return;
    if(hub?.classList.contains('active'))openWeekend();
  };
  const timer=setInterval(tick,250);
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});

  const style=document.createElement('style');
  style.textContent=`
    #s5CpuChoiceStage .s5-cpu-history-card.previous{
      opacity:.52!important;
      filter:grayscale(.38) saturate(.68) brightness(.82)!important;
    }
  `;
  document.head.appendChild(style);
})();
