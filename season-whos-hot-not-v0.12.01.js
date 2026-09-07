/* NBA Starting5 v0.12.01 — WHO'S HOT / WHO'S NOT season form screen after Game 6, then every 4 games. */
(()=>{
  if(window.__starting5WhosHotNotV01201)return;
  window.__starting5WhosHotNotV01201=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const PENDING_GAME_KEY='nbaStarting5SeasonPendingGameV1';
  const STATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];

  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}};
  const pool=()=>{try{return Array.isArray(players)?players.filter(p=>!p.classicTeam):[]}catch{return []}};
  const key=p=>String(p?.playerId||p?.id||`${p?.name||''}|${p?.teamId||''}`);
  const find=k=>pool().find(p=>key(p)===String(k))||null;
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const teamName=p=>p?.team||p?.teamFull||p?.teamName||p?.teamShort||'Team';
  const api=()=>window.STARTING5_DYNAMIC_RATINGS||null;
  const overall=p=>{
    const a=api();
    const vals=STATS.map(s=>Number(a?.getBaseStat?.(p,s)??p?.stats?.[s]??0)||0);
    return vals.length?vals.reduce((x,y)=>x+y,0)/vals.length:0;
  };
  const delta=p=>Number(api()?.getDelta?.(p)??p?.__s5DynamicRatingDelta??0)||0;

  function due(completed){return completed>=6&&((completed-6)%4===0)}
  function chooseHotNot(){
    const all=pool().map(p=>({p,d:delta(p),ovr:overall(p)}));
    const hotPool=all.filter(x=>x.d>0).sort((a,b)=>b.d-a.d||b.ovr-a.ovr||String(a.p.name).localeCompare(String(b.p.name)));
    const notPool=all.filter(x=>x.d<0).sort((a,b)=>a.d-b.d||b.ovr-a.ovr||String(a.p.name).localeCompare(String(b.p.name)));
    let hot=hotPool[0]||[...all].sort((a,b)=>b.ovr-a.ovr)[0]||null;
    let cold=notPool[0]||[...all].filter(x=>!hot||key(x.p)!==key(hot.p)).sort((a,b)=>a.ovr-b.ovr)[0]||null;
    return {hot,cold};
  }
  function ensurePending(){
    const s=read();if(!s)return false;
    const completed=Math.max(0,Number(s.roundIndex)||0);if(!due(completed))return false;
    s.whosHotNot=s.whosHotNot||{};
    if(Number(s.whosHotNot.lastRound)===completed||s.whosHotNot.pending?.round===completed)return !!s.whosHotNot.pending;
    const pick=chooseHotNot();if(!pick.hot||!pick.cold)return false;
    s.whosHotNot.pending={
      round:completed,
      hot:{playerKey:key(pick.hot.p),name:pick.hot.p.name,teamId:String(pick.hot.p.teamId||''),delta:pick.hot.d,overall:pick.hot.ovr},
      cold:{playerKey:key(pick.cold.p),name:pick.cold.p.name,teamId:String(pick.cold.p.teamId||''),delta:pick.cold.d,overall:pick.cold.ovr}
    };
    s.whosHotNot.lastRound=completed;
    write(s);return true;
  }

  function ensureScreen(){
    let screen=document.getElementById('seasonWhosHotNot');if(screen)return screen;
    const shell=document.querySelector('.app-shell');if(!shell)return null;
    screen=document.createElement('section');screen.id='seasonWhosHotNot';screen.className='screen s5-hotnot-screen';
    screen.innerHTML='<div class="s5-hotnot-kicker">NBA STARTING5</div><h2>WHO\'S HOT / WHO\'S NOT</h2><div class="s5-hotnot-week"></div><div class="s5-hotnot-grid"></div><button type="button" class="primary-btn s5-hotnot-continue">Continue Season</button>';
    shell.appendChild(screen);
    screen.querySelector('.s5-hotnot-continue')?.addEventListener('click',()=>{
      const s=read();if(s?.whosHotNot){s.whosHotNot.pending=null;write(s)}
      try{sessionStorage.removeItem(ACTIVE_KEY);sessionStorage.removeItem(PENDING_GAME_KEY)}catch{}
      const seasonBtn=document.getElementById('seasonModeBtn');
      if(seasonBtn)seasonBtn.click();else try{showScreen('seasonHub')}catch{}
      window.scrollTo({top:0,behavior:'instant'});
    });
    return screen;
  }

  function playerBlock(row,type){
    const p=find(row.playerKey);let card='';
    try{if(p&&typeof cardMarkup==='function')card=cardMarkup(p,{eager:true})}catch{}
    const d=Number(row.delta)||0;
    const dir=type==='hot'?'up':'down';
    const level=Math.max(0,Math.min(3,Math.abs(d)));
    const badge=level?`<div class="s5-hotnot-badge ${dir}" style="background-image:url('assets/ui/dynamic-rating-${dir}-${level}.svg?v=1201')"></div>`:'';
    if(card&&badge)card=card.replace(/(<article\b[^>]*class="[^"]*player-card[^"]*"[^>]*>)/i,`$1${badge}`);
    const label=type==='hot'?"WHO'S HOT":"WHO'S NOT";
    const score=d===0?'0':`${d>0?'+':''}${d}`;
    return `<article class="s5-hotnot-player ${type}">
      <div class="s5-hotnot-label">${label}</div>
      <div class="s5-hotnot-card">${card}</div>
      <div class="s5-hotnot-name">${row.name}</div>
      <div class="s5-hotnot-team"><img src="${logo(row.teamId)}" alt="">${teamName(p)}</div>
      <div class="s5-hotnot-score"><strong>${score}</strong><span>ALL STATS</span></div>
    </article>`;
  }

  function showScreenNow(){
    const s=read(),a=s?.whosHotNot?.pending;if(!a)return false;
    const screen=ensureScreen();if(!screen)return false;
    screen.querySelector('.s5-hotnot-week').textContent=`FORM WATCH · AFTER GAME ${a.round}`;
    screen.querySelector('.s5-hotnot-grid').innerHTML=playerBlock(a.hot,'hot')+playerBlock(a.cold,'cold');
    document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));screen.classList.add('active');
    window.scrollTo({top:0,behavior:'instant'});return true;
  }

  const style=document.createElement('style');
  style.textContent=`
    .s5-hotnot-screen{padding:8px 14px 26px!important;text-align:center}.s5-hotnot-kicker{color:#f7b928;font-size:10px;font-weight:1000;letter-spacing:.18em;margin-top:4px}.s5-hotnot-screen h2{margin:5px 0 3px;font-size:28px;line-height:1;font-weight:1000}.s5-hotnot-week{color:#8f99a8;font-size:10px;font-weight:900;letter-spacing:.09em;margin-bottom:12px}.s5-hotnot-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start}.s5-hotnot-player{min-width:0;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:linear-gradient(180deg,#121925,#090d13);padding:9px 7px 10px;overflow:hidden}.s5-hotnot-label{font-size:8px;font-weight:1000;letter-spacing:.08em;color:#f7b928;margin-bottom:7px}.s5-hotnot-card{width:100%;display:flex;justify-content:center;overflow:hidden}.s5-hotnot-card>.player-card{width:100%!important;max-width:154px!important;min-width:0!important;pointer-events:none!important;position:relative!important}.s5-hotnot-badge{position:absolute;top:7px;right:7px;width:32px;height:43px;background-repeat:no-repeat;background-position:center;background-size:contain;z-index:40;pointer-events:none;filter:drop-shadow(0 2px 2px rgba(0,0,0,.55))}.s5-hotnot-name{font-size:12px;font-weight:1000;line-height:1.05;margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.s5-hotnot-team{display:flex;align-items:center;justify-content:center;gap:4px;color:#aab3c0;font-size:8px;font-weight:900;margin-top:4px;white-space:nowrap;overflow:hidden}.s5-hotnot-team img{width:17px;height:17px;object-fit:contain}.s5-hotnot-score{margin-top:7px;padding-top:7px;border-top:1px solid rgba(255,255,255,.08)}.s5-hotnot-score strong{display:block;font-size:24px;line-height:1;color:#fff}.s5-hotnot-score span{display:block;margin-top:2px;font-size:7px;font-weight:1000;letter-spacing:.09em;color:#8f99a8}.s5-hotnot-continue{width:100%;min-height:54px;margin-top:12px;font-size:18px!important;font-weight:1000!important}
    @media(max-width:390px){.s5-hotnot-screen{padding-left:10px!important;padding-right:10px!important}.s5-hotnot-grid{gap:7px}.s5-hotnot-player{padding-left:5px;padding-right:5px}.s5-hotnot-card>.player-card{max-width:145px!important}.s5-hotnot-screen h2{font-size:25px}}
  `;
  document.head.appendChild(style);

  window.addEventListener('click',e=>{
    const btn=e.target?.closest?.('#playAgainBtn,#compactPlayAgain');if(!btn)return;
    if(sessionStorage.getItem(ACTIVE_KEY)!=='1')return;
    if(!ensurePending())return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showScreenNow();
  },true);

  document.addEventListener('click',e=>{
    const btn=e.target?.closest?.('#seasonModeBtn');if(!btn)return;
    const s=read();
    if(!s?.whosHotNot?.pending&&!ensurePending())return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showScreenNow();
  },true);

  const start=()=>{
    ensureScreen();
    const final=document.getElementById('final');
    if(final)new MutationObserver(()=>{if(final.classList.contains('active'))setTimeout(ensurePending,20)}).observe(final,{attributes:true,attributeFilter:['class'],childList:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
