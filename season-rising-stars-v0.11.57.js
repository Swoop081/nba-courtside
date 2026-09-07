/* NBA Starting5 v0.11.75 — Rising Stars runs through the standard Starting5 gameplay engine. */
(()=>{
  if(window.__starting5RisingStarsV01157)return;
  window.__starting5RisingStarsV01157=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const POS_ORDER={PG:0,SG:1,SF:2,PF:3,C:4};
  const DRAFT_YEAR=new Map(Object.entries({
    'AJ Dybantsa':2026,'Darryn Peterson':2026,'Cameron Boozer':2026,'Caleb Wilson':2026,'Keaton Wagler':2026,'Mikel Brown Jr.':2026,'Darius Acuff Jr.':2026,'Nate Ament':2026,'Koa Peat':2026,
    'Cooper Flagg':2025,'Dylan Harper':2025,'VJ Edgecombe':2025,'Kon Knueppel':2025,'Ace Bailey':2025,'Tre Johnson':2025,'Jeremiah Fears':2025,'Egor Demin':2025,'Collin Murray-Boyles':2025,'Khaman Maluach':2025,'Cedric Coward':2025,'Carter Bryant':2025,'Derik Queen':2025,'Noa Essengue':2025,
    'Zaccharie Risacher':2024,'Alex Sarr':2024,'Alexandre Sarr':2024,'Reed Sheppard':2024,'Stephon Castle':2024,'Ron Holland II':2024,'Ronald Holland II':2024,'Tidjane Salaun':2024,'Tidjane Salaün':2024,'Donovan Clingan':2024,'Rob Dillingham':2024,'Zach Edey':2024,'Cody Williams':2024,'Matas Buzelis':2024,'Bub Carrington':2024,"Kel'el Ware":2024,'Jared McCain':2024,'Dalton Knecht':2024,"Ja'Kobe Walter":2024,'JaKobe Walter':2024,'Yves Missi':2024,'Ryan Dunn':2024,'Oso Ighodaro':2024,'Devin Carter':2024,'Nikola Topic':2024,'Nikola Topić':2024,'Adem Bona':2024,'Jamal Shead':2024
  }));

  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  const pool=()=>{try{return Array.isArray(players)?players.filter(p=>!p.classicTeam):[]}catch{return []}};
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const short=id=>{try{return window.TEAM_SHORT?.[id]||TEAM_SHORT?.[id]||pool().find(p=>String(p.teamId)===String(id))?.teamShort||'Team'}catch{return 'Team'}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return (r.w||0)+(r.l||0)};
  const complete=s=>!!s?.allStarWeekend?.risingStars?.complete;
  const eligible=p=>{const y=DRAFT_YEAR.get(p?.name);return y===2024||y===2025||y===2026};
  const experience=p=>2027-(DRAFT_YEAR.get(p?.name)||2027);
  const expLabel=p=>experience(p)===1?'Rookie':experience(p)===2?'Sophomore':'3rd Year';
  const activate=id=>{document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');window.scrollTo(0,0)};

  function awardRows(s){
    const calc=window.STARTING5_SEASON_AWARDS?.calculate?.(s);
    if(calc?.players?.length)return calc.players;
    return pool().map(p=>({key:key(p),name:p.name,teamId:String(p.teamId),position:p.position,plus:0,games:0}));
  }

  function selectRosters(s){
    const rows=awardRows(s),byKey=new Map(rows.map(r=>[r.key,r]));
    const candidates=pool().filter(eligible).map(p=>({p,row:byKey.get(key(p))||rows.find(r=>r.name===p.name&&String(r.teamId)===String(p.teamId))||{plus:0,games:0}}));
    const choose=east=>candidates
      .filter(x=>EAST.has(String(x.p.teamId))===east)
      .sort((a,b)=>(b.row.plus||0)-(a.row.plus||0)||(b.row.games||0)-(a.row.games||0)||a.p.name.localeCompare(b.p.name))
      .slice(0,5)
      .sort((a,b)=>(POS_ORDER[a.p.position]??9)-(POS_ORDER[b.p.position]??9));
    return {east:choose(true),west:choose(false)};
  }

  const css=document.createElement('style');
  css.id='s5-rising-stars-style';
  css.textContent=`
    #seasonRisingStars{padding-bottom:34px}.s5-rs-hero{border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(180deg,#172131,#090d13);padding:18px;margin-bottom:12px}.s5-rs-kicker{font-size:10px;color:#f7b928;font-weight:1000;letter-spacing:.16em;text-transform:uppercase}.s5-rs-hero h2{font-size:28px;margin:5px 0}.s5-rs-hero p{margin:0;color:#9aa5b4;font-size:11px;line-height:1.4}.s5-rs-rosters{display:grid;grid-template-columns:1fr 1fr;gap:10px}.s5-rs-team{border:1px solid rgba(255,255,255,.1);border-radius:18px;background:#0d131b;padding:12px}.s5-rs-team h3{margin:0 0 8px;font-size:15px}.s5-rs-row{display:grid;grid-template-columns:26px 1fr auto;gap:7px;align-items:center;padding:7px 0;border-top:1px solid rgba(255,255,255,.06)}.s5-rs-row:first-of-type{border-top:0}.s5-rs-row img{width:24px;height:24px;object-fit:contain}.s5-rs-row b{display:block;font-size:10px}.s5-rs-row small{display:block;color:#7f8998;font-size:7.5px;margin-top:2px}.s5-rs-plus{color:#f7b928;font-size:10px;font-weight:1000}.s5-rs-play{width:100%;min-height:50px;border:0;border-radius:14px;background:#f7b928;color:#090b0f;font-weight:1000;font-size:15px;margin-top:12px}
    @media(max-width:430px){.s5-rs-rosters{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  function ensureScreen(){
    let s=document.getElementById('seasonRisingStars');
    if(s)return s;
    const shell=document.querySelector('.app-shell');if(!shell)return null;
    s=document.createElement('section');s.id='seasonRisingStars';s.className='screen s5-season-screen';
    s.innerHTML='<div class="s5-season-head"><div><div class="s5-season-kicker">All-Star Weekend</div><h2>Rising Stars</h2></div><button class="ghost-btn" data-rs-back>← Season</button></div><div id="s5RisingStarsContent"></div>';
    shell.appendChild(s);
    s.querySelector('[data-rs-back]').addEventListener('click',()=>activate('seasonHub'));
    return s;
  }

  const rosterMarkup=(title,list)=>`<section class="s5-rs-team"><h3>${title}</h3>${list.map(x=>`<div class="s5-rs-row"><img src="${logo(x.p.teamId)}" alt=""><div><b>${x.p.name}</b><small>${x.p.position} · ${short(x.p.teamId)} · ${expLabel(x.p)}</small></div><span class="s5-rs-plus">${(x.row.plus||0)>=0?'+':''}${x.row.plus||0}</span></div>`).join('')}</section>`;

  function openIntro(){
    const s=read(),screen=ensureScreen();if(!s||!screen)return;
    const r=selectRosters(s),host=screen.querySelector('#s5RisingStarsContent');
    host.innerHTML=`<section class="s5-rs-hero"><div class="s5-rs-kicker">Between Games 41 & 42</div><h2>East vs West</h2><p>The five highest cumulative + players in each conference who are in their first, second or third NBA season qualify. Selection is positionless; cards are ordered PG → SG → SF → PF → C only for presentation. Gameplay uses the full Starting5 matchup system.</p></section><div class="s5-rs-rosters">${rosterMarkup('Eastern Conference',r.east)}${rosterMarkup('Western Conference',r.west)}</div><button class="s5-rs-play" data-rs-start>Play Rising Stars</button>`;
    host.querySelector('[data-rs-start]')?.addEventListener('click',()=>startGame(r));
    activate('seasonRisingStars');
  }

  let activeGame=null;

  function startGame(rosters){
    const s=read();if(!s)return;
    const userEast=EAST.has(String(s.teamId));
    const user=(userEast?rosters.east:rosters.west).map(x=>x.p);
    const cpu=(userEast?rosters.west:rosters.east).map(x=>x.p);
    if(user.length!==5||cpu.length!==5){alert('Rising Stars needs five eligible players from each conference.');return}
    activeGame={userName:userEast?'EAST':'WEST',cpuName:userEast?'WEST':'EAST',finished:false};
    try{
      userTeam=user;
      cpuTeam=cpu;
      state={quarter:1,userScore:0,cpuScore:0,usedUser:new Set(),usedCpu:new Set(),category:null,history:[],overtime:false};
      showScreen('game');
      beginQuarter();
      const sides=document.querySelectorAll('#game .score-side span');
      if(sides[0])sides[0].textContent=activeGame.userName;
      if(sides[1])sides[1].textContent=activeGame.cpuName;
      window.scrollTo(0,0);
    }catch(err){
      console.error('[Starting5 Rising Stars standard engine]',err);
      activeGame=null;
      alert('Rising Stars could not start. Reload the game and try again.');
    }
  }

  function normalizeHistory(){
    const out=[];
    try{
      for(const h of state?.history||[]){
        if(!h?.user||!h?.cpu)continue;
        const uv=Number(h.userPts)||0,cv=Number(h.cpuPts)||0,d=uv-cv;
        out.push({round:h.quarter==='OT'?5:Number(h.quarter)||out.length+1,category:h.category,user:h.user.name,userKey:key(h.user),userTeamId:String(h.user.teamId||''),cpu:h.cpu.name,cpuKey:key(h.cpu),cpuTeamId:String(h.cpu.teamId||''),uv,cv,userDiff:d,cpuDiff:-d});
      }
    }catch{}
    return out;
  }

  function mvpFromHistory(history){
    let best=null;
    for(const h of history){
      const a={name:h.user,key:h.userKey,teamId:h.userTeamId,diff:h.userDiff};
      const b={name:h.cpu,key:h.cpuKey,teamId:h.cpuTeamId,diff:h.cpuDiff};
      if(a.diff>0&&(!best||a.diff>best.diff))best=a;
      if(b.diff>0&&(!best||b.diff>best.diff))best=b;
    }
    return best||{name:history[0]?.user||'—',teamId:history[0]?.userTeamId||'',diff:0};
  }

  function saveStandardResult(){
    const s=read();if(!s||!activeGame)return null;
    const history=normalizeHistory(),mvp=mvpFromHistory(history);
    const userScore=Number(state?.userScore)||0,cpuScore=Number(state?.cpuScore)||0;
    const winner=userScore===cpuScore?'TIE':userScore>cpuScore?activeGame.userName:activeGame.cpuName;
    const result={complete:true,winner,score:`${userScore}-${cpuScore}`,mvp,playedAfterGame:41,completedAt:new Date().toISOString(),history,engine:'standard-starting5'};
    s.allStarWeekend=s.allStarWeekend||{};
    s.allStarWeekend.risingStars=result;
    write(s);
    activeGame.finished=true;
    activeGame.result=result;
    return result;
  }

  const baseFinish=(()=>{try{return typeof finishGame==='function'?finishGame:window.finishGame}catch{return window.finishGame}})();
  if(typeof baseFinish==='function'){
    const wrappedFinish=function(){
      if(!activeGame||activeGame.finished)return baseFinish.apply(this,arguments);
      saveStandardResult();
      const out=baseFinish.apply(this,arguments);
      setTimeout(()=>{
        const kicker=document.querySelector('#final .compact-final-kicker');if(kicker)kicker.textContent='RISING STARS FINAL';
        const btn=document.querySelector('#final #compactPlayAgain,#final #playAgainBtn');if(btn)btn.textContent='Continue All-Star Weekend';
      },0);
      refreshHubButton();
      return out;
    };
    try{finishGame=wrappedFinish}catch{}
    window.finishGame=wrappedFinish;
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#final #compactPlayAgain,#final #playAgainBtn');
    if(!btn||!activeGame?.finished)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    activeGame=null;
    if(window.STARTING5_ALLSTAR_WEEKEND?.openChampions)window.STARTING5_ALLSTAR_WEEKEND.openChampions();
    else activate('seasonHub');
  },true);

  function refreshHubButton(){
    const s=read(),btn=document.getElementById('s5PlaySeasonGame');if(!s||!btn)return;
    const p=played(s);if(p!==41||complete(s))return;
    const desiredBtn='All-Star Weekend — Rising Stars';
    if(btn.textContent!==desiredBtn)btn.textContent=desiredBtn;
    const label=btn.closest('.s5-next')?.querySelector('.s5-next-label');
    const desiredLabel='ALL-STAR WEEKEND · BETWEEN GAMES 41 & 42';
    if(label&&label.textContent!==desiredLabel)label.textContent=desiredLabel;
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('#s5PlaySeasonGame');if(!btn)return;
    const s=read();
    if(s&&played(s)===41&&!complete(s)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openIntro()}
  },true);

  const obs=new MutationObserver(()=>refreshHubButton());
  const start=()=>{const host=document.getElementById('s5SeasonContent');if(host)obs.observe(host,{childList:true,subtree:true});refreshHubButton()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.STARTING5_RISING_STARS={selectRosters,openIntro,eligible,DRAFT_YEAR};
})();
