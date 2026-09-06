/* NBA Starting5 v0.11.1 — clean Season scoreboard + Continue flow, no polling */
(()=>{
  if(window.__starting5SeasonCoreUiV0111)return;
  window.__starting5SeasonCoreUiV0111=true;
  const SAVE_KEY='nbaStarting5SeasonV2', ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const SHORT={
    '1610612737':'Hawks','1610612738':'Celtics','1610612751':'Nets','1610612766':'Hornets','1610612741':'Bulls','1610612739':'Cavaliers','1610612742':'Mavericks','1610612743':'Nuggets','1610612765':'Pistons','1610612744':'Warriors','1610612745':'Rockets','1610612754':'Pacers','1610612746':'Clippers','1610612747':'Lakers','1610612763':'Grizzlies','1610612748':'Heat','1610612749':'Bucks','1610612750':'Timberwolves','1610612740':'Pelicans','1610612752':'Knicks','1610612760':'Thunder','1610612753':'Magic','1610612755':'76ers','1610612756':'Suns','1610612757':'Trail Blazers','1610612758':'Kings','1610612759':'Spurs','1610612761':'Raptors','1610612762':'Jazz','1610612764':'Wizards'
  };
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const currentGame=s=>s?.schedule?.[s.roundIndex]?.find(g=>g.home===s.teamId||g.away===s.teamId)||null;

  function paintScoreboard(){
    const s=read(),g=currentGame(s),game=document.getElementById('game');
    if(!s||!g||!game?.classList.contains('active'))return;
    const opp=g.home===s.teamId?g.away:g.home;
    const sides=[...game.querySelectorAll('.score-side')];
    if(sides.length<2)return;
    const side=(el,id,scoreId,away=false)=>{
      const key=id+'|'+(away?'A':'H');
      if(el.dataset.s5SeasonScoreboard===key)return;
      el.dataset.s5SeasonScoreboard=key;
      el.innerHTML=away
        ?`<div class="score-team away-team"><div class="score-number"><strong id="${scoreId}">0</strong></div><div class="score-logo-wrap"><img src="${logo(id)}" alt="${SHORT[id]||'Team'}"></div><div class="score-name">${SHORT[id]||'Team'}</div></div>`
        :`<div class="score-team"><div class="score-logo-wrap"><img src="${logo(id)}" alt="${SHORT[id]||'Team'}"></div><div class="score-number"><strong id="${scoreId}">0</strong></div><div class="score-name">${SHORT[id]||'Team'}</div></div>`;
    };
    side(sides[0],s.teamId,'userScore',false);
    side(sides[1],opp,'cpuScore',true);
  }

  function paintFinalContinue(){
    if(sessionStorage.getItem(ACTIVE_KEY)!=='1')return;
    const final=document.getElementById('final');
    if(!final?.classList.contains('active'))return;
    const s=read(),label=s?.complete?'View Final Standings':'Continue';
    const a=document.getElementById('playAgainBtn'),b=document.getElementById('compactPlayAgain');
    if(a)a.textContent=label;
    if(b)b.textContent=label;
  }

  // Season-only state is set once when a new season game is launched.
  document.addEventListener('click',e=>{
    if(e.target.closest('#s5PlaySeasonGame')){
      sessionStorage.setItem(ACTIVE_KEY,'1');
      requestAnimationFrame(()=>requestAnimationFrame(paintScoreboard));
    }
    const cont=e.target.closest('#playAgainBtn,#compactPlayAgain');
    if(cont&&sessionStorage.getItem(ACTIVE_KEY)==='1'){
      // The clean Season engine owns navigation; this only clears our presentation flag after it has handled the tap.
      setTimeout(()=>sessionStorage.removeItem(ACTIVE_KEY),0);
    }
  },false);

  // Observe only the final screen's active-state transition. No subtree or interval polling.
  function start(){
    const final=document.getElementById('final');
    if(final)new MutationObserver(()=>{if(final.classList.contains('active'))paintFinalContinue();}).observe(final,{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
