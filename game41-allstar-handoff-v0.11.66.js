/* NBA Starting5 v0.11.68 — hard-route Game 41 season continuation directly into All-Star Weekend + readable used CPU rail. */
(()=>{
  if(window.__s5Game41AllStarHandoffV01166)return;
  window.__s5Game41AllStarHandoffV01166=true;
  const SAVE_KEY='nbaStarting5SeasonV2';
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return Number(r.w||0)+Number(r.l||0)};
  const needsWeekend=s=>!!s&&played(s)===41&&!s?.allStarWeekend?.risingStars?.complete;

  const openWeekend=()=>{
    const s=read();if(!needsWeekend(s))return false;
    try{
      const api=window.STARTING5_RISING_STARS;
      if(api&&typeof api.openIntro==='function'){
        api.openIntro();
        return !!document.getElementById('seasonRisingStars')?.classList.contains('active');
      }
    }catch(err){console.error('[Starting5 All-Star handoff]',err)}
    return false;
  };

  const routeWeekend=()=>{
    if(openWeekend())return;
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(openWeekend()||tries>=10)clearInterval(timer);
    },80);
  };

  // Game 41 final: Continue goes straight to Rising Stars.
  document.addEventListener('click',e=>{
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const btn=e.target.closest('button');if(!btn)return;
    if((btn.textContent||'').trim().toUpperCase()!=='CONTINUE')return;
    if(!needsWeekend(read()))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    requestAnimationFrame(routeWeekend);
  },true);

  // Menu: at the exact 41-game breakpoint, Continue Season must NOT enter the
  // normal Season hub first. That route is what is crashing on the saved Game 41
  // state. Bypass it completely and enter Rising Stars directly.
  document.addEventListener('click',e=>{
    const btn=e.target.closest('button');if(!btn)return;
    const text=(btn.textContent||'').trim().toUpperCase();
    const isSeason=btn.id==='seasonModeBtn'||text==='CONTINUE SEASON';
    if(!isSeason||!needsWeekend(read()))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    requestAnimationFrame(routeWeekend);
  },true);

  const style=document.createElement('style');
  style.textContent=`
    #s5CpuChoiceStage .s5-cpu-history-card.previous{
      opacity:.52!important;
      filter:grayscale(.38) saturate(.68) brightness(.82)!important;
    }
  `;
  document.head.appendChild(style);
})();
