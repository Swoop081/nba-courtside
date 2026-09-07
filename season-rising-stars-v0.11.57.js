/* NBA Starting5 v0.11.57 — All-Star Weekend Rising Stars between Games 41 and 42. */
(()=>{
  if(window.__starting5RisingStarsV01157)return;
  window.__starting5RisingStarsV01157=true;
  const SAVE_KEY='nbaStarting5SeasonV2';
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const POS_ORDER={PG:0,SG:1,SF:2,PF:3,C:4};
  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const CAT_LABEL={scoring:'Scoring',dunks:'Dunking',three:'3PT',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
  const DRAFT_YEAR=new Map(Object.entries({
    'AJ Dybantsa':2026,'Darryn Peterson':2026,'Cameron Boozer':2026,'Caleb Wilson':2026,'Keaton Wagler':2026,'Mikel Brown Jr.':2026,'Darius Acuff Jr.':2026,'Nate Ament':2026,'Koa Peat':2026,
    'Cooper Flagg':2025,'Dylan Harper':2025,'VJ Edgecombe':2025,'Kon Knueppel':2025,'Ace Bailey':2025,'Tre Johnson':2025,'Jeremiah Fears':2025,'Egor Demin':2025,'Collin Murray-Boyles':2025,'Khaman Maluach':2025,'Cedric Coward':2025,'Carter Bryant':2025,'Derik Queen':2025,'Noa Essengue':2025,
    'Zaccharie Risacher':2024,'Alex Sarr':2024,'Alexandre Sarr':2024,'Reed Sheppard':2024,'Stephon Castle':2024,'Ron Holland II':2024,'Ronald Holland II':2024,'Tidjane Salaun':2024,'Tidjane Salaün':2024,'Donovan Clingan':2024,'Rob Dillingham':2024,'Zach Edey':2024,'Cody Williams':2024,'Matas Buzelis':2024,'Bub Carrington':2024,"Kel'el Ware":2024,'Jared McCain':2024,'Dalton Knecht':2024,"Ja'Kobe Walter":2024,'JaKobe Walter':2024,'Yves Missi':2024,'Ryan Dunn':2024,'Oso Ighodaro':2024,'Devin Carter':2024,'Nikola Topic':2024,'Nikola Topić':2024,'Adem Bona':2024,'Jamal Shead':2024
  }));
  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  const pool=()=>{try{return Array.isArray(players)?players.filter(p=>!p.classicTeam):[]}catch{return []}};
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const stat=(p,k)=>Number(p?.stats?.[k]??0)||0;
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const short=id=>{try{return window.TEAM_SHORT?.[id]||TEAM_SHORT?.[id]||pool().find(p=>String(p.teamId)===String(id))?.teamShort||'Team'}catch{return 'Team'}};
  const played=s=>{const r=s?.records?.[s?.teamId]||{w:0,l:0};return (r.w||0)+(r.l||0)};
  const complete=s=>!!s?.allStarWeekend?.risingStars?.complete;
  const eligible=p=>{const y=DRAFT_YEAR.get(p?.name);return y===2024||y===2025||y===2026};
  const experience=p=>2027-(DRAFT_YEAR.get(p?.name)||2027);
  const expLabel=p=>experience(p)===1?'Rookie':experience(p)===2?'Sophomore':'3rd Year';
  const activate=id=>{document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');window.scrollTo(0,0)};

  function awardRows(s){
    const calc=window.STARTING5_SEASON_AWARDS?.calculate?.(s);if(calc?.players?.length)return calc.players;
    return pool().map(p=>({key:key(p),name:p.name,teamId:String(p.teamId),position:p.position,plus:0,games:0}));
  }
  function selectRosters(s){
    const rows=awardRows(s),byKey=new Map(rows.map(r=>[r.key,r]));
    const candidates=pool().filter(eligible).map(p=>({p,row:byKey.get(key(p))||rows.find(r=>r.name===p.name&&String(r.teamId)===String(p.teamId))||{plus:0,games:0}}));
    const choose=east=>candidates.filter(x=>EAST.has(String(x.p.teamId))===east).sort((a,b)=>(b.row.plus||0)-(a.row.plus||0)||(b.row.games||0)-(a.row.games||0)||a.p.name.localeCompare(b.p.name)).slice(0,5).sort((a,b)=>(POS_ORDER[a.p.position]??9)-(POS_ORDER[b.p.position]??9));
    return {east:choose(true),west:choose(false)};
  }

  const css=document.createElement('style');css.id='s5-rising-stars-style';css.textContent=`
    #seasonRisingStars{padding-bottom:34px}.s5-rs-hero{border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(180deg,#172131,#090d13);padding:18px;margin-bottom:12px}.s5-rs-kicker{font-size:10px;color:#f7b928;font-weight:1000;letter-spacing:.16em;text-transform:uppercase}.s5-rs-hero h2{font-size:28px;margin:5px 0}.s5-rs-hero p{margin:0;color:#9aa5b4;font-size:11px;line-height:1.4}.s5-rs-rosters{display:grid;grid-template-columns:1fr 1fr;gap:10px}.s5-rs-team{border:1px solid rgba(255,255,255,.1);border-radius:18px;background:#0d131b;padding:12px}.s5-rs-team h3{margin:0 0 8px;font-size:15px}.s5-rs-row{display:grid;grid-template-columns:26px 1fr auto;gap:7px;align-items:center;padding:7px 0;border-top:1px solid rgba(255,255,255,.06)}.s5-rs-row:first-of-type{border-top:0}.s5-rs-row img{width:24px;height:24px;object-fit:contain}.s5-rs-row b{display:block;font-size:10px}.s5-rs-row small{display:block;color:#7f8998;font-size:7.5px;margin-top:2px}.s5-rs-plus{color:#f7b928;font-size:10px;font-weight:1000}.s5-rs-play{width:100%;min-height:50px;border:0;border-radius:14px;background:#f7b928;color:#090b0f;font-weight:1000;font-size:15px;margin-top:12px}
    .s5-rs-gamehead{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.11);border-radius:18px;background:#0c121a;padding:12px;margin-bottom:10px}.s5-rs-score{text-align:center}.s5-rs-score strong{display:block;font-size:28px}.s5-rs-score span{font-size:8px;color:#8f99a8;font-weight:1000;text-transform:uppercase}.s5-rs-cat{text-align:center}.s5-rs-cat b{display:block;color:#f7b928;font-size:14px}.s5-rs-cat span{font-size:8px;color:#8f99a8}.s5-rs-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.s5-rs-card{min-width:0;cursor:pointer}.s5-rs-card .player-card{width:100%!important;margin:0!important;max-width:none!important}.s5-rs-card.used{opacity:.35;pointer-events:none}.s5-rs-result{margin-top:10px;border:1px solid rgba(255,255,255,.09);border-radius:15px;background:#0d131b;padding:12px;text-align:center;font-size:11px}.s5-rs-final{text-align:center;border:1px solid rgba(247,185,40,.35);border-radius:20px;background:linear-gradient(180deg,#171f2b,#090d13);padding:24px 16px}.s5-rs-final h2{font-size:28px;margin:5px 0}.s5-rs-final p{color:#9aa5b4;font-size:11px}.s5-rs-final button{margin-top:12px}
    @media(max-width:430px){.s5-rs-rosters{grid-template-columns:1fr}.s5-rs-cards{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}}
  `;document.head.appendChild(css);

  function ensureScreen(){
    let s=document.getElementById('seasonRisingStars');if(s)return s;const shell=document.querySelector('.app-shell');if(!shell)return null;
    s=document.createElement('section');s.id='seasonRisingStars';s.className='screen s5-season-screen';s.innerHTML='<div class="s5-season-head"><div><div class="s5-season-kicker">All-Star Weekend</div><h2>Rising Stars</h2></div><button class="ghost-btn" data-rs-back>← Season</button></div><div id="s5RisingStarsContent"></div>';shell.appendChild(s);s.querySelector('[data-rs-back]').addEventListener('click',()=>activate('seasonHub'));return s;
  }
  const rosterMarkup=(title,list)=>`<section class="s5-rs-team"><h3>${title}</h3>${list.map(x=>`<div class="s5-rs-row"><img src="${logo(x.p.teamId)}" alt=""><div><b>${x.p.name}</b><small>${x.p.position} · ${short(x.p.teamId)} · ${expLabel(x.p)}</small></div><span class="s5-rs-plus">${(x.row.plus||0)>=0?'+':''}${x.row.plus||0}</span></div>`).join('')}</section>`;
  function openIntro(){
    const s=read(),screen=ensureScreen();if(!s||!screen)return;const r=selectRosters(s),host=screen.querySelector('#s5RisingStarsContent');
    host.innerHTML=`<section class="s5-rs-hero"><div class="s5-rs-kicker">Between Games 41 & 42</div><h2>East vs West</h2><p>The five highest cumulative + players in each conference who are in their first, second or third NBA season qualify. Selection is positionless; cards are only ordered PG → SG → SF → PF → C after selection.</p></section><div class="s5-rs-rosters">${rosterMarkup('Eastern Conference',r.east)}${rosterMarkup('Western Conference',r.west)}</div><button class="s5-rs-play" data-rs-start>Play Rising Stars</button>`;
    host.querySelector('[data-rs-start]')?.addEventListener('click',()=>startGame(r));activate('seasonRisingStars');
  }

  let game=null;
  function startGame(rosters){
    const s=read();if(!s)return;const userEast=EAST.has(String(s.teamId)),user=(userEast?rosters.east:rosters.west).map(x=>x.p),cpu=(userEast?rosters.west:rosters.east).map(x=>x.p);
    game={user,cpu,userName:userEast?'EAST':'WEST',cpuName:userEast?'WEST':'EAST',u:0,c:0,usedU:new Set(),usedC:new Set(),round:1,category:null,history:[]};nextRound();
  }
  function nextRound(){if(!game)return;if(game.round>5){finish();return}const available=CATS;game.category=available[Math.floor(Math.random()*available.length)];renderGame();}
  function renderGame(){
    const screen=ensureScreen(),host=screen.querySelector('#s5RisingStarsContent'),cat=game.category;
    host.innerHTML=`<div class="s5-rs-gamehead"><div class="s5-rs-score"><span>${game.userName}</span><strong>${game.u}</strong></div><div class="s5-rs-cat"><span>Matchup ${game.round} of 5</span><b>${CAT_LABEL[cat]}</b></div><div class="s5-rs-score"><span>${game.cpuName}</span><strong>${game.c}</strong></div></div><div class="s5-rs-cards">${game.user.map(p=>`<div class="s5-rs-card ${game.usedU.has(key(p))?'used':''}" data-rs-player="${key(p)}">${typeof cardMarkup==='function'?cardMarkup(p,{activeStat:cat,eager:true}):`<div>${p.name}</div>`}</div>`).join('')}</div><div class="s5-rs-result">Choose any unused player. There is no position lock in this Rising Stars game.</div>`;
    host.querySelectorAll('[data-rs-player]').forEach(el=>el.addEventListener('click',()=>play(el.dataset.rsPlayer)));activate('seasonRisingStars');
  }
  function play(k){
    const u=game.user.find(p=>key(p)===k);if(!u||game.usedU.has(k))return;const avail=game.cpu.filter(p=>!game.usedC.has(key(p)));if(!avail.length)return;const c=avail.reduce((a,b)=>stat(b,game.category)>stat(a,game.category)?b:a);const uv=stat(u,game.category),cv=stat(c,game.category);game.usedU.add(key(u));game.usedC.add(key(c));if(uv>cv)game.u++;else if(cv>uv)game.c++;game.history.push({round:game.round,category:game.category,user:u.name,cpu:c.name,uv,cv});
    const host=document.getElementById('s5RisingStarsContent'),res=host?.querySelector('.s5-rs-result');if(res)res.innerHTML=`<b>${u.name} ${uv} — ${cv} ${c.name}</b><br>${uv>cv?game.userName+' wins the matchup':cv>uv?game.cpuName+' wins the matchup':'Tie matchup'}`;host?.querySelectorAll('.s5-rs-card').forEach(x=>x.style.pointerEvents='none');setTimeout(()=>{game.round++;nextRound()},900);
  }
  function finish(){
    const s=read();if(!s)return;const winner=game.u===game.c?'TIE':game.u>game.c?game.userName:game.cpuName;s.allStarWeekend=s.allStarWeekend||{};s.allStarWeekend.risingStars={complete:true,winner,score:`${game.u}-${game.c}`,playedAfterGame:41,completedAt:new Date().toISOString(),history:game.history};write(s);
    const host=document.getElementById('s5RisingStarsContent');if(host)host.innerHTML=`<section class="s5-rs-final"><div class="s5-rs-kicker">Rising Stars Final</div><h2>${winner==='TIE'?'Rising Stars ends tied':winner+' wins'}</h2><p>${game.userName} ${game.u} — ${game.c} ${game.cpuName}</p><button class="s5-rs-play" data-rs-continue>Continue All-Star Weekend</button></section>`;host?.querySelector('[data-rs-continue]')?.addEventListener('click',()=>activate('seasonHub'));refreshHubButton();
  }

  function refreshHubButton(){
    const s=read(),btn=document.getElementById('s5PlaySeasonGame');if(!s||!btn)return;const p=played(s);if(p===41&&!complete(s)){btn.textContent='All-Star Weekend — Rising Stars';const label=btn.closest('.s5-next')?.querySelector('.s5-next-label');if(label)label.textContent='ALL-STAR WEEKEND · BETWEEN GAMES 41 & 42'}
  }
  document.addEventListener('click',e=>{const btn=e.target.closest('#s5PlaySeasonGame');if(!btn)return;const s=read();if(s&&played(s)===41&&!complete(s)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openIntro()}},true);
  const obs=new MutationObserver(()=>refreshHubButton());const start=()=>{const host=document.getElementById('s5SeasonContent');if(host)obs.observe(host,{childList:true,subtree:true});refreshHubButton()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.STARTING5_RISING_STARS={selectRosters,openIntro,eligible,DRAFT_YEAR};
})();
