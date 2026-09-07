/* NBA Starting5 v0.11.82 — compact Rising Stars intro + normal scoreboard conference branding with red Western Conference scheme. */
(()=>{
  if(window.__starting5RisingStarsScoreboardBrandV01176)return;
  window.__starting5RisingStarsScoreboardBrandV01176=true;

  const EAST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Eastern_Conference.png';
  const WEST_LOGO='https://mediacentral.nba.com/wp-content/uploads/logos/nba/Western_Conference.png';
  const CONF={
    EAST:{name:'EAST',alt:'Eastern Conference',logo:EAST_LOGO,primary:'#0878bd',secondary:'#ffffff',dark:'#064a79'},
    WEST:{name:'WEST',alt:'Western Conference',logo:WEST_LOGO,primary:'#c8102e',secondary:'#ffffff',dark:'#7a0b1d'}
  };
  let active=false,userConf='EAST',cpuConf='WEST';

  const score=which=>{
    try{return Number(which==='user'?state?.userScore:state?.cpuScore)||0}catch{return 0}
  };

  const sideMarkup=(conf,which,away=false)=>`<div class="score-team${away?' away-team':''}">
    ${away?`<div class="score-number"><strong id="cpuScore">${score('cpu')}</strong></div><div class="score-logo-wrap"><img src="${conf.logo}" alt="${conf.alt}"></div>`:`<div class="score-logo-wrap"><img src="${conf.logo}" alt="${conf.alt}"></div><div class="score-number"><strong id="userScore">${score('user')}</strong></div>`}
    <div class="score-name">${conf.name}</div>
  </div>`;

  const paint=()=>{
    const game=document.getElementById('game');
    if(!active||!game?.classList.contains('active'))return;
    game.classList.add('s5-rising-stars-game');
    const sides=[...game.querySelectorAll('.scoreboard .score-side')];
    if(sides.length<2)return;
    const left=CONF[userConf]||CONF.EAST,right=CONF[cpuConf]||CONF.WEST;
    const applyTheme=(side,conf)=>{
      side.style.setProperty('--score-primary',conf.primary);
      side.style.setProperty('--score-secondary',conf.secondary);
      side.style.setProperty('--score-dark',conf.dark);
      side.style.setProperty('background',`linear-gradient(180deg,${conf.primary},${conf.dark})`,'important');
      side.style.setProperty('border-color','rgba(255,255,255,.14)','important');
    };
    applyTheme(sides[0],left);applyTheme(sides[1],right);
    sides[0].innerHTML=sideMarkup(left,'user',false);
    sides[1].innerHTML=sideMarkup(right,'cpu',true);
  };

  const schedulePaint=()=>{setTimeout(paint,0);setTimeout(paint,50);setTimeout(paint,160)};

  const compactIntro=()=>{
    const screen=document.getElementById('seasonRisingStars');
    const host=screen?.querySelector('#s5RisingStarsContent');
    const hero=host?.querySelector('.s5-rs-hero');
    const button=host?.querySelector('[data-rs-start]');
    if(!hero||!button)return;
    hero.querySelectorAll('p').forEach(p=>p.remove());
    if(button.parentElement!==hero)hero.appendChild(button);
    hero.classList.add('s5-rs-hero-compact');
  };

  const wrapIntro=()=>{
    const api=window.STARTING5_RISING_STARS;
    const original=api?.openIntro;
    if(typeof original!=='function'||original.__s5CompactIntroWrapped)return;
    const wrapped=function(){
      const out=original.apply(this,arguments);
      compactIntro();
      requestAnimationFrame(compactIntro);
      setTimeout(compactIntro,60);
      return out;
    };
    wrapped.__s5CompactIntroWrapped=true;
    api.openIntro=wrapped;
  };

  const clear=()=>{
    active=false;
    document.getElementById('game')?.classList.remove('s5-rising-stars-game');
  };

  document.addEventListener('click',e=>{
    if(e.target.closest('#seasonRisingStars [data-rs-start]')){
      const s=(()=>{try{return JSON.parse(localStorage.getItem('nbaStarting5SeasonV2')||'null')}catch{return null}})();
      const EAST_TEAMS=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
      const controlsEast=!!s&&EAST_TEAMS.has(String(s.teamId));
      userConf=controlsEast?'EAST':'WEST';cpuConf=controlsEast?'WEST':'EAST';
      active=true;
      schedulePaint();
      return;
    }
    if(active&&e.target.closest('#final #compactPlayAgain,#final #playAgainBtn,#seasonHub [data-season-home],#newGameBtn'))clear();
  },true);

  const wrap=name=>{
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5RsScoreboardWrapped)return;
    const wrapped=function(){const out=fn.apply(this,arguments);if(active)schedulePaint();return out};
    wrapped.__s5RsScoreboardWrapped=true;
    window[name]=wrapped;
    try{eval(`${name}=window[name]`)}catch{}
  };
  ['beginQuarter','playQuarter','startOvertime'].forEach(wrap);

  const style=document.createElement('style');
  style.textContent=`
    #seasonRisingStars .s5-rs-hero.s5-rs-hero-compact{padding-bottom:18px!important}
    #seasonRisingStars .s5-rs-hero.s5-rs-hero-compact h2{margin-bottom:0!important}
    #seasonRisingStars .s5-rs-hero.s5-rs-hero-compact .s5-rs-play{margin-top:16px!important;margin-bottom:0!important}
    #game.s5-rising-stars-game .scoreboard{grid-template-columns:1fr 1fr!important}
    #game.s5-rising-stars-game .quarter-badge{display:none!important}
    #game.s5-rising-stars-game .score-side{display:block!important;min-height:112px!important;padding:0!important;overflow:hidden!important}
    #game.s5-rising-stars-game .score-team{display:grid!important;grid-template-columns:92px 1fr!important;grid-template-rows:76px 36px!important;width:100%!important;height:112px!important;align-items:center!important}
    #game.s5-rising-stars-game .score-team.away-team{grid-template-columns:1fr 92px!important}
    #game.s5-rising-stars-game .score-logo-wrap{height:76px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:transparent!important}
    #game.s5-rising-stars-game .score-logo-wrap img{width:78px!important;height:72px!important;object-fit:contain!important;filter:drop-shadow(0 0 2px rgba(255,255,255,1)) drop-shadow(0 0 7px rgba(255,255,255,.78)) drop-shadow(0 4px 9px rgba(0,0,0,.28))!important}
    #game.s5-rising-stars-game .score-number{height:76px!important;display:flex!important;align-items:center!important;justify-content:center!important}
    #game.s5-rising-stars-game .score-number strong{font-size:54px!important;line-height:1!important;letter-spacing:-.055em!important;color:#fff!important;text-shadow:0 3px 9px rgba(0,0,0,.38)!important}
    #game.s5-rising-stars-game .score-name{grid-column:1/-1!important;height:36px!important;display:flex!important;align-items:center!important;justify-content:center!important;border-top:3px solid var(--score-secondary)!important;background:rgba(0,0,0,.10)!important;color:#fff!important;font-size:13px!important;font-weight:950!important;letter-spacing:.06em!important;text-transform:uppercase!important}
    #game.s5-rising-stars-game .score-team.away-team .score-number{grid-column:1!important;grid-row:1!important}
    #game.s5-rising-stars-game .score-team.away-team .score-logo-wrap{grid-column:2!important;grid-row:1!important}
    @media(max-width:430px){
      #game.s5-rising-stars-game .score-side{min-height:100px!important}
      #game.s5-rising-stars-game .score-team{grid-template-columns:78px 1fr!important;grid-template-rows:67px 33px!important;height:100px!important}
      #game.s5-rising-stars-game .score-team.away-team{grid-template-columns:1fr 78px!important}
      #game.s5-rising-stars-game .score-logo-wrap{height:67px!important}
      #game.s5-rising-stars-game .score-logo-wrap img{width:67px!important;height:62px!important}
      #game.s5-rising-stars-game .score-number{height:67px!important}
      #game.s5-rising-stars-game .score-number strong{font-size:48px!important}
      #game.s5-rising-stars-game .score-name{height:33px!important;font-size:10px!important;border-top-width:2px!important}
    }
  `;
  document.head.appendChild(style);

  const start=()=>{wrapIntro();compactIntro()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  setTimeout(wrapIntro,0);setTimeout(wrapIntro,120);

  const introPatch=document.createElement('script');
  introPatch.src='rising-stars-intro-layout-v0.11.80.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
  document.head.appendChild(introPatch);
})();
