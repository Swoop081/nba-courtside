/* NBA Starting5 v0.11.85 — All-Star Game runs through the standard Starting5 matchup screen. */
(()=>{
  if(window.__starting5AllStarStandardV01185)return;
  window.__starting5AllStarStandardV01185=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const EAST_TEAMS=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const EAST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png';
  const WEST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png';
  const CONF={
    EAST:{name:'EAST',alt:'Eastern Conference',logo:EAST_LOGO,primary:'#0878bd',dark:'#064a79'},
    WEST:{name:'WEST',alt:'Western Conference',logo:WEST_LOGO,primary:'#c8102e',dark:'#7a0b1d'}
  };
  let active=null;

  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const activate=id=>{document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');window.scrollTo(0,0)};

  const score=which=>{try{return Number(which==='user'?state?.userScore:state?.cpuScore)||0}catch{return 0}};
  const sideMarkup=(conf,away=false)=>`<div class="score-team${away?' away-team':''}">${away?`<div class="score-number"><strong id="cpuScore">${score('cpu')}</strong></div><div class="score-logo-wrap"><img src="${conf.logo}" alt="${conf.alt}"></div>`:`<div class="score-logo-wrap"><img src="${conf.logo}" alt="${conf.alt}"></div><div class="score-number"><strong id="userScore">${score('user')}</strong></div>`}<div class="score-name">${conf.name}</div></div>`;

  const paintScoreboard=()=>{
    if(!active)return;
    const game=document.getElementById('game');
    if(!game?.classList.contains('active'))return;
    game.classList.add('s5-all-star-standard-game');
    const sides=[...game.querySelectorAll('.scoreboard .score-side')];
    if(sides.length<2)return;
    const left=CONF[active.userName],right=CONF[active.cpuName];
    [[sides[0],left],[sides[1],right]].forEach(([side,conf])=>{
      side.style.setProperty('--score-primary',conf.primary);
      side.style.setProperty('--score-secondary','#fff');
      side.style.setProperty('--score-dark',conf.dark);
      side.style.setProperty('background',`linear-gradient(180deg,${conf.primary},${conf.dark})`,'important');
    });
    sides[0].innerHTML=sideMarkup(left,false);
    sides[1].innerHTML=sideMarkup(right,true);
  };
  const repaint=()=>{setTimeout(paintScoreboard,0);setTimeout(paintScoreboard,60);setTimeout(paintScoreboard,180)};

  function normalizeHistory(){
    const out=[];
    try{for(const h of state?.history||[]){if(!h?.user||!h?.cpu)continue;const uv=Number(h.userPts)||0,cv=Number(h.cpuPts)||0,d=uv-cv;out.push({round:h.quarter==='OT'?5:Number(h.quarter)||out.length+1,position:h.user.position||'',category:h.category,user:h.user.name,userKey:key(h.user),userTeamId:String(h.user.teamId||''),cpu:h.cpu.name,cpuKey:key(h.cpu),cpuTeamId:String(h.cpu.teamId||''),uv,cv,userDiff:d,cpuDiff:-d});}}catch{}
    return out;
  }
  function mvp(history){let best=null;for(const h of history){for(const p of [{name:h.user,key:h.userKey,teamId:h.userTeamId,diff:h.userDiff},{name:h.cpu,key:h.cpuKey,teamId:h.cpuTeamId,diff:h.cpuDiff}])if(p.diff>0&&(!best||p.diff>best.diff))best=p}return best||{name:history[0]?.user||'—',teamId:history[0]?.userTeamId||'',diff:0}}
  function saveResult(){
    if(!active||active.finished)return;
    const s=read();if(!s)return;
    const history=normalizeHistory(),award=mvp(history),u=Number(state?.userScore)||0,c=Number(state?.cpuScore)||0;
    const winner=u===c?'TIE':u>c?active.userName:active.cpuName;
    s.allStarWeekend=s.allStarWeekend||{};
    s.allStarWeekend.allStarGame={complete:true,winner,score:`${u}-${c}`,mvp:award,history,completedAt:new Date().toISOString(),engine:'standard-starting5'};
    write(s);active.finished=true;
  }

  function startStandard(){
    const s=read(),api=window.STARTING5_ALLSTAR_WEEKEND;if(!s||!api?.selectAllStars)return;
    const r=api.selectAllStars(s),userEast=EAST_TEAMS.has(String(s.teamId));
    const user=(userEast?r.east:r.west).map(x=>x.p),cpu=(userEast?r.west:r.east).map(x=>x.p);
    if(user.length!==5||cpu.length!==5){alert('All-Star Game needs a PG, SG, SF, PF and C from each conference.');return}
    active={userName:userEast?'EAST':'WEST',cpuName:userEast?'WEST':'EAST',finished:false};
    userTeam=user;cpuTeam=cpu;
    state={quarter:1,userScore:0,cpuScore:0,usedUser:new Set(),usedCpu:new Set(),category:null,history:[],overtime:false};
    showScreen('game');beginQuarter();repaint();window.scrollTo(0,0);
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('#seasonAllStarWeekend [data-as-start]')){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();startStandard();return;
    }
    if(!active)return;
    const btn=e.target.closest('#final #compactPlayAgain,#final #playAgainBtn');
    if(btn&&active.finished){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      active=null;document.getElementById('game')?.classList.remove('s5-all-star-standard-game');activate('seasonHub');
      const seasonBtn=document.getElementById('s5PlaySeasonGame');if(seasonBtn)setTimeout(()=>seasonBtn.click(),0);
    }
  },true);

  let baseFinish=null;try{baseFinish=window.finishGame||finishGame}catch{}
  if(typeof baseFinish==='function'){
    const wrapped=function(){
      if(!active)return baseFinish.apply(this,arguments);
      saveResult();const out=baseFinish.apply(this,arguments);
      setTimeout(()=>{
        const kicker=document.querySelector('#final .compact-final-kicker');if(kicker)kicker.textContent='ALL-STAR GAME FINAL';
        const btn=document.querySelector('#final #compactPlayAgain,#final #playAgainBtn');if(btn)btn.textContent='Continue Season';
      },0);
      return out;
    };
    window.finishGame=wrapped;try{finishGame=wrapped}catch{}
  }

  const wrap=name=>{let fn=null;try{fn=window[name]||eval(name)}catch{}if(typeof fn!=='function'||fn.__s5AllStarStd)return;const w=function(){const out=fn.apply(this,arguments);if(active)repaint();return out};w.__s5AllStarStd=true;window[name]=w;try{eval(`${name}=window[name]`)}catch{}};
  ['beginQuarter','playQuarter','startOvertime'].forEach(wrap);

  const style=document.createElement('style');style.textContent=`
    #game.s5-all-star-standard-game .scoreboard{grid-template-columns:1fr 1fr!important}
    #game.s5-all-star-standard-game .quarter-badge{display:none!important}
    #game.s5-all-star-standard-game .score-side{display:block!important;min-height:112px!important;padding:0!important;overflow:hidden!important}
    #game.s5-all-star-standard-game .score-team{display:grid!important;grid-template-columns:92px 1fr!important;grid-template-rows:76px 36px!important;width:100%!important;height:112px!important;align-items:center!important}
    #game.s5-all-star-standard-game .score-team.away-team{grid-template-columns:1fr 92px!important}
    #game.s5-all-star-standard-game .score-logo-wrap{height:76px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:transparent!important}
    #game.s5-all-star-standard-game .score-logo-wrap img{width:78px!important;height:72px!important;object-fit:contain!important;filter:drop-shadow(0 0 2px rgba(255,255,255,1)) drop-shadow(0 0 7px rgba(255,255,255,.78)) drop-shadow(0 4px 9px rgba(0,0,0,.28))!important}
    #game.s5-all-star-standard-game .score-number{height:76px!important;display:flex!important;align-items:center!important;justify-content:center!important}
    #game.s5-all-star-standard-game .score-number strong{font-size:54px!important;line-height:1!important;color:#fff!important}
    #game.s5-all-star-standard-game .score-name{grid-column:1/-1!important;height:36px!important;display:flex!important;align-items:center!important;justify-content:center!important;border-top:3px solid #fff!important;background:rgba(0,0,0,.10)!important;color:#fff!important;font-size:13px!important;font-weight:950!important;letter-spacing:.06em!important}
    #game.s5-all-star-standard-game .score-team.away-team .score-number{grid-column:1!important;grid-row:1!important}#game.s5-all-star-standard-game .score-team.away-team .score-logo-wrap{grid-column:2!important;grid-row:1!important}
    @media(max-width:430px){#game.s5-all-star-standard-game .score-side{min-height:100px!important}#game.s5-all-star-standard-game .score-team{grid-template-columns:78px 1fr!important;grid-template-rows:67px 33px!important;height:100px!important}#game.s5-all-star-standard-game .score-team.away-team{grid-template-columns:1fr 78px!important}#game.s5-all-star-standard-game .score-logo-wrap{height:67px!important}#game.s5-all-star-standard-game .score-logo-wrap img{width:67px!important;height:62px!important}#game.s5-all-star-standard-game .score-number{height:67px!important}#game.s5-all-star-standard-game .score-number strong{font-size:48px!important}#game.s5-all-star-standard-game .score-name{height:33px!important;font-size:10px!important;border-top-width:2px!important}}
  `;document.head.appendChild(style);
})();
