/* NBA Starting5 v0.11.3 — authoritative Season scoreboard + Continue flow, no polling */
(()=>{
  if(window.__starting5SeasonCoreUiV0113)return;
  window.__starting5SeasonCoreUiV0113=true;
  const SAVE_KEY='nbaStarting5SeasonV2', ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const SHORT={
    '1610612737':'Hawks','1610612738':'Celtics','1610612751':'Nets','1610612766':'Hornets','1610612741':'Bulls','1610612739':'Cavaliers','1610612742':'Mavericks','1610612743':'Nuggets','1610612765':'Pistons','1610612744':'Warriors','1610612745':'Rockets','1610612754':'Pacers','1610612746':'Clippers','1610612747':'Lakers','1610612763':'Grizzlies','1610612748':'Heat','1610612749':'Bucks','1610612750':'Timberwolves','1610612740':'Pelicans','1610612752':'Knicks','1610612760':'Thunder','1610612753':'Magic','1610612755':'76ers','1610612756':'Suns','1610612757':'Trail Blazers','1610612758':'Kings','1610612759':'Spurs','1610612761':'Raptors','1610612762':'Jazz','1610612764':'Wizards'
  };
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const activeLineups=()=>{
    if(sessionStorage.getItem(ACTIVE_KEY)!=='1')return null;
    let u=null,c=null;
    try{u=Array.isArray(userTeam)&&userTeam[0]?userTeam[0]:null;c=Array.isArray(cpuTeam)&&cpuTeam[0]?cpuTeam[0]:null}catch{}
    if(!u?.teamId||!c?.teamId)return null;
    return {userId:String(u.teamId),cpuId:String(c.teamId)};
  };

  function paintScoreboard(){
    const ids=activeLineups(),game=document.getElementById('game');
    if(!ids||!game?.classList.contains('active'))return;
    const sides=[...game.querySelectorAll('.score-side')];
    if(sides.length<2)return;
    let us=0,cs=0;try{us=Number(state?.userScore)||0;cs=Number(state?.cpuScore)||0}catch{}
    const paint=(el,id,score,scoreId,away=false)=>{
      const name=SHORT[id]||'Team';
      const expected=id+'|'+(away?'A':'H');
      const shown=el.dataset.s5SeasonScoreboard;
      const shownName=(el.querySelector('.score-name')?.textContent||'').trim();
      const shownLogo=el.querySelector('img')?.getAttribute('src')||'';
      if(shown===expected&&shownName===name&&shownLogo.includes('/'+id+'/')){
        const n=el.querySelector('#'+scoreId);if(n)n.textContent=String(score);return;
      }
      el.dataset.s5SeasonScoreboard=expected;
      el.innerHTML=away
        ?`<div class="score-team away-team"><div class="score-number"><strong id="${scoreId}">${score}</strong></div><div class="score-logo-wrap"><img src="${logo(id)}" alt="${name}"></div><div class="score-name">${name}</div></div>`
        :`<div class="score-team"><div class="score-logo-wrap"><img src="${logo(id)}" alt="${name}"></div><div class="score-number"><strong id="${scoreId}">${score}</strong></div><div class="score-name">${name}</div></div>`;
    };
    paint(sides[0],ids.userId,us,'userScore',false);
    paint(sides[1],ids.cpuId,cs,'cpuScore',true);
  }

  function paintFinalContinue(){
    if(sessionStorage.getItem(ACTIVE_KEY)!=='1')return;
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const s=read(),label=s?.complete?'View Final Standings':'Continue';
    const a=document.getElementById('playAgainBtn'),b=document.getElementById('compactPlayAgain');
    if(a)a.textContent=label;if(b)b.textContent=label;
  }

  function goSeasonHub(e){
    if(sessionStorage.getItem(ACTIVE_KEY)!=='1')return;
    const btn=e.target?.closest?.('#playAgainBtn,#compactPlayAgain');if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    sessionStorage.removeItem(ACTIVE_KEY);
    try{if(typeof renderHub==='function')renderHub()}catch{}
    try{if(typeof showScreen==='function')showScreen('seasonHub')}catch{}
    window.scrollTo({top:0,behavior:'instant'});
  }
  window.addEventListener('click',goSeasonHub,true);

  document.addEventListener('click',e=>{
    if(e.target.closest('#s5PlaySeasonGame')){
      sessionStorage.setItem(ACTIVE_KEY,'1');
      requestAnimationFrame(()=>requestAnimationFrame(paintScoreboard));
    }
  },false);

  const wrap=name=>{
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5SeasonScoreWrapped)return;
    const wrapped=function(){const r=fn.apply(this,arguments);requestAnimationFrame(paintScoreboard);return r;};
    wrapped.__s5SeasonScoreWrapped=true;window[name]=wrapped;
    try{eval(`${name}=window[name]`)}catch{}
  };

  function start(){
    ['beginQuarter','playQuarter','nextQuarter','startOvertime'].forEach(wrap);
    const board=document.querySelector('#game .scoreboard');
    if(board)new MutationObserver(()=>{if(sessionStorage.getItem(ACTIVE_KEY)==='1')requestAnimationFrame(paintScoreboard)}).observe(board,{childList:true,subtree:true});
    const final=document.getElementById('final');
    if(final)new MutationObserver(()=>{if(final.classList.contains('active'))paintFinalContinue()}).observe(final,{attributes:true,attributeFilter:['class'],childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
