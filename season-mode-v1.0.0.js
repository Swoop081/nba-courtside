/* NBA Starting5 v0.13.0-dev.3 — authentic 82-game Season adapter with no gameplay-function wrapping. */
(()=>{
  if(window.__starting5SeasonV100)return;
  window.__starting5SeasonV100=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const PENDING_KEY='nbaStarting5SeasonPendingGameV1';
  const TEMPLATE_CACHE_KEY='nbaStarting5ScheduleTemplate2022_23';
  const TEMPLATE_URL='https://raw.githubusercontent.com/mdahlman/nba-schedule/main/data/nba-full-schedule-2022-2023.csv';
  const OLD_KEYS=['nbaCourtsideSeasonModeV1','nbaCourtsideSeasonReturnPendingV1','nbaCourtsideSeasonGameActiveV1','nbaCourtsideAllStarActiveV1'];
  const IDS=['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744','1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752','1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'];
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const POS={PG:0,SG:1,SF:2,PF:3,C:4};
  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const ABBR={ATL:'1610612737',BOS:'1610612738',BKN:'1610612751',CHA:'1610612766',CHI:'1610612741',CLE:'1610612739',DAL:'1610612742',DEN:'1610612743',DET:'1610612765',GSW:'1610612744',HOU:'1610612745',IND:'1610612754',LAC:'1610612746',LAL:'1610612747',MEM:'1610612763',MIA:'1610612748',MIL:'1610612749',MIN:'1610612750',NOP:'1610612740',NYK:'1610612752',OKC:'1610612760',ORL:'1610612753',PHI:'1610612755',PHX:'1610612756',POR:'1610612757',SAC:'1610612758',SAS:'1610612759',TOR:'1610612761',UTA:'1610612762',WAS:'1610612764'};
  let templatePromise=null;

  OLD_KEYS.forEach(k=>{try{localStorage.removeItem(k);sessionStorage.removeItem(k)}catch{}});

  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const write=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  const readPending=()=>{try{return JSON.parse(sessionStorage.getItem(PENDING_KEY)||'null')}catch{return null}};
  const short=id=>window.TEAM_SHORT?.[id]||TEAM_SHORT?.[id]||teamPlayers(id)[0]?.teamShort||'Team';
  const full=id=>teamPlayers(id)[0]?.team||short(id);
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const teamPlayers=id=>{let pool=[];try{pool=Array.isArray(players)?players:[]}catch{}return pool.filter(p=>String(p.teamId)===String(id)&&!p.classicTeam).sort((a,b)=>(POS[a.position]??9)-(POS[b.position]??9)).slice(0,5)};
  const overall=p=>{try{return typeof window.courtsideOverall==='function'?window.courtsideOverall(p):Math.round(CATS.reduce((n,k)=>n+(+p.stats?.[k]||0),0)/CATS.length)}catch{return 20}};
  const strength=id=>{const r=teamPlayers(id);return r.length?r.reduce((n,p)=>n+overall(p),0)/r.length:20};

  function parseTemplate(csv){
    const lines=String(csv||'').trim().split(/\r?\n/);if(lines.length<1200)throw new Error('Incomplete 2022-23 schedule');
    const games=[];
    for(let i=1;i<lines.length;i++){
      const c=lines[i].split(',');if(c.length<6)continue;
      const away=ABBR[c[4]],home=ABBR[c[5]];if(!away||!home)continue;
      games.push({id:`NBA22-${c[1]}`,date:c[2],away,home,sourceGameId:c[1]});
    }
    if(games.length!==1230)throw new Error(`Expected 1230 games, found ${games.length}`);
    return games;
  }
  async function loadTemplate(){
    if(templatePromise)return templatePromise;
    templatePromise=(async()=>{
      try{const cached=localStorage.getItem(TEMPLATE_CACHE_KEY);if(cached){const g=JSON.parse(cached);if(Array.isArray(g)&&g.length===1230)return g}}catch{}
      const res=await fetch(TEMPLATE_URL,{cache:'force-cache'});if(!res.ok)throw new Error(`Schedule fetch ${res.status}`);
      const games=parseTemplate(await res.text());
      try{localStorage.setItem(TEMPLATE_CACHE_KEY,JSON.stringify(games))}catch{}
      return games;
    })().catch(e=>{templatePromise=null;throw e});
    return templatePromise;
  }
  function buildScheduleForTeam(teamId,games){
    const tid=String(teamId),userIdx=[];
    games.forEach((g,i)=>{if(g.home===tid||g.away===tid)userIdx.push(i)});
    if(userIdx.length!==82)throw new Error(`${short(tid)} schedule has ${userIdx.length} games, expected 82`);
    const rounds=[];let start=0;
    userIdx.forEach((idx,n)=>{const end=n===81?games.length-1:idx;rounds.push(games.slice(start,end+1).map(g=>({...g,round:n+1})));start=end+1});
    return rounds;
  }
  const emptyRecords=()=>Object.fromEntries(IDS.map(id=>[id,{w:0,l:0}]));
  async function createSeason(teamId){const games=await loadTemplate(),schedule=buildScheduleForTeam(teamId,games);return{version:2,scheduleTemplate:'NBA_2022_23',teamId:String(teamId),roundIndex:0,schedule,records:emptyRecords(),results:{},complete:false,createdAt:new Date().toISOString()}}
  const userGame=s=>s.schedule[s.roundIndex]?.find(g=>g.home===s.teamId||g.away===s.teamId)||null;
  function simWinner(a,b){const sa=strength(a),sb=strength(b),p=Math.max(.2,Math.min(.8,.5+(sa-sb)/35));return Math.random()<p?a:b}
  function applyResult(s,g,winner,userPlayed=false,score=''){if(!g||s.results[g.id])return;const loser=winner===g.home?g.away:g.home;s.results[g.id]={winner,loser,userPlayed,score};s.records[winner]=s.records[winner]||{w:0,l:0};s.records[loser]=s.records[loser]||{w:0,l:0};s.records[winner].w++;s.records[loser].l++}
  function simulateRestOfRound(s,round,userGameId){for(const g of round){if(g.id===userGameId||s.results[g.id])continue;applyResult(s,g,simWinner(g.home,g.away),false)}}
  const standings=(s,ids)=>ids.map(id=>({id,...s.records[id]})).sort((a,b)=>b.w-a.w||a.l-b.l||strength(b.id)-strength(a.id));

  const css=document.createElement('style');css.id='starting5-season-v100-style';css.textContent=`
    .s5-season-launch{width:100%;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(180deg,#1a2230,#0b0f15);color:#fff;font-weight:1000;font-size:15px;margin-top:8px}
    .s5-season-screen{padding-bottom:30px}.s5-season-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.s5-season-head h2{margin:0;font-size:24px}.s5-season-kicker{font-size:10px;font-weight:1000;letter-spacing:.16em;color:#f7b928;text-transform:uppercase;margin-bottom:4px}
    .s5-team-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.s5-team-pick{border:1px solid rgba(255,255,255,.1);background:#0d131b;border-radius:15px;min-height:88px;padding:9px 5px;color:#fff;display:grid;place-items:center;gap:3px}.s5-team-pick img{width:58px;height:58px;object-fit:contain}.s5-team-pick span{font-size:8px;font-weight:1000;text-align:center;line-height:1.1}.s5-team-pick:disabled{opacity:.45}
    .s5-season-hero{border:1px solid rgba(255,255,255,.11);border-radius:20px;background:linear-gradient(180deg,#141c27,#090d13);padding:15px;margin-bottom:11px}.s5-team-line{display:flex;align-items:center;gap:12px}.s5-team-line img{width:64px;height:64px;object-fit:contain}.s5-team-line h3{font-size:21px;margin:0}.s5-record{color:#f7b928;font-size:13px;font-weight:1000;margin-top:4px}.s5-progress{height:7px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden;margin-top:13px}.s5-progress i{display:block;height:100%;background:#f7b928}.s5-progress-label{display:flex;justify-content:space-between;font-size:9px;color:#8e98a7;margin-top:5px;font-weight:900}
    .s5-next{border:1px solid rgba(255,255,255,.11);border-radius:18px;background:#0d131b;padding:15px;margin-bottom:11px}.s5-next-label{font-size:10px;color:#f7b928;font-weight:1000;letter-spacing:.13em;text-transform:uppercase}.s5-matchup{display:grid;grid-template-columns:1fr 42px 1fr;align-items:center;margin:12px 0}.s5-side{text-align:center}.s5-side img{display:block;width:68px;height:68px;object-fit:contain;margin:auto}.s5-side strong{display:block;font-size:12px;margin-top:5px}.s5-vs{text-align:center;font-size:15px;font-weight:1000;color:#7f8998}.s5-play{width:100%;min-height:50px;border:0;border-radius:13px;background:#f7b928;color:#090b0f;font-size:15px;font-weight:1000}
    .s5-standings{display:grid;grid-template-columns:1fr 1fr;gap:9px}.s5-table{border:1px solid rgba(255,255,255,.09);border-radius:16px;background:#0c1118;overflow:hidden}.s5-table h3{margin:0;padding:10px;background:#141b25;font-size:11px;text-transform:uppercase;letter-spacing:.08em}.s5-row{display:grid;grid-template-columns:20px 1fr 26px 26px;gap:4px;align-items:center;padding:7px 8px;border-top:1px solid rgba(255,255,255,.06);font-size:9px}.s5-row.user{background:rgba(247,185,40,.12)}.s5-row img{width:20px;height:20px;object-fit:contain}.s5-row b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.s5-row span{text-align:center}.s5-done{text-align:center;padding:24px 10px}.s5-done h3{font-size:24px;margin:0 0 8px}.s5-done p{color:#9ba5b4;font-size:12px}
    @media(max-width:430px){.s5-team-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.s5-team-pick{min-height:80px}.s5-team-pick img{width:52px;height:52px}.s5-standings{grid-template-columns:1fr}}
  `;document.head.appendChild(css);

  function ensureUI(){
    const intro=document.getElementById('intro'),actions=intro?.querySelector('.brand-launch-actions');
    if(actions&&!document.getElementById('seasonModeBtn')){const b=document.createElement('button');b.id='seasonModeBtn';b.className='s5-season-launch';b.type='button';b.textContent='Season Mode';actions.insertBefore(b,document.getElementById('checkUpdatesBtn'));b.addEventListener('click',openSeason)}
    const shell=document.querySelector('.app-shell');if(!shell||document.getElementById('seasonTeamSelect'))return;
    const pick=document.createElement('section');pick.id='seasonTeamSelect';pick.className='screen s5-season-screen';pick.innerHTML=`<div class="s5-season-head"><div><div class="s5-season-kicker">Season Mode</div><h2>Choose Your Team</h2></div><button class="ghost-btn" data-season-back>← Back</button></div><div id="s5SeasonTeamGrid" class="s5-team-grid"></div>`;shell.appendChild(pick);
    const hub=document.createElement('section');hub.id='seasonHub';hub.className='screen s5-season-screen';hub.innerHTML=`<div class="s5-season-head"><div><div class="s5-season-kicker">82-Game Season</div><h2>Season</h2></div><button class="ghost-btn" data-season-home>Home</button></div><div id="s5SeasonContent"></div>`;shell.appendChild(hub);
    pick.querySelector('[data-season-back]').addEventListener('click',()=>showScreen('intro'));hub.querySelector('[data-season-home]').addEventListener('click',()=>showScreen('intro'));
  }
  function renderTeamPicker(){
    const grid=document.getElementById('s5SeasonTeamGrid');if(!grid)return;
    grid.innerHTML=IDS.map(id=>`<button class="s5-team-pick" type="button" data-team="${id}"><img src="${logo(id)}" alt=""><span>${short(id)}</span></button>`).join('');
    grid.querySelectorAll('[data-team]').forEach(b=>b.addEventListener('click',async()=>{if(b.disabled)return;grid.querySelectorAll('button').forEach(x=>x.disabled=true);const old=b.querySelector('span')?.textContent;if(b.querySelector('span'))b.querySelector('span').textContent='Loading…';try{const s=await createSeason(b.dataset.team);write(s);renderHub();showScreen('seasonHub');window.scrollTo(0,0)}catch(e){console.error('[Starting5 schedule]',e);alert('Could not load the 2022–23 NBA schedule. Check your connection and try again.');grid.querySelectorAll('button').forEach(x=>x.disabled=false);if(b.querySelector('span'))b.querySelector('span').textContent=old}}));
    loadTemplate().catch(()=>{});
  }
  function openSeason(){ensureUI();const s=read();if(s){renderHub();showScreen('seasonHub')}else{renderTeamPicker();showScreen('seasonTeamSelect')}window.scrollTo(0,0)}
  function tableMarkup(title,rows,s){return `<section class="s5-table"><h3>${title}</h3>${rows.map((r,i)=>`<div class="s5-row ${r.id===s.teamId?'user':''}"><span>${i+1}</span><b>${short(r.id)}</b><span>${r.w}</span><span>${r.l}</span></div>`).join('')}</section>`}
  function renderHub(){
    const s=read(),c=document.getElementById('s5SeasonContent');if(!s||!c)return;
    const rec=s.records[s.teamId],played=rec.w+rec.l,g=userGame(s),east=standings(s,IDS.filter(id=>EAST.has(id))),west=standings(s,IDS.filter(id=>!EAST.has(id)));
    const hero=`<section class="s5-season-hero"><div class="s5-team-line"><img src="${logo(s.teamId)}"><div><h3>${full(s.teamId)}</h3><div class="s5-record">${rec.w}-${rec.l}</div></div></div><div class="s5-progress"><i style="width:${Math.min(100,played/82*100)}%"></i></div><div class="s5-progress-label"><span>${played} PLAYED</span><span>82 GAMES</span></div></section>`;
    if(s.complete||!g){c.innerHTML=hero+`<section class="s5-next s5-done"><h3>Regular Season Complete</h3><p>Final record: ${rec.w}-${rec.l}</p></section><div class="s5-standings">${tableMarkup('Eastern Conference',east,s)}${tableMarkup('Western Conference',west,s)}</div>`;return}
    const opp=g.home===s.teamId?g.away:g.home;
    const next=`<section class="s5-next"><div class="s5-next-label">Game ${played+1} of 82</div><div class="s5-matchup"><div class="s5-side"><img src="${logo(s.teamId)}"><strong>${short(s.teamId)}</strong></div><div class="s5-vs">VS</div><div class="s5-side"><img src="${logo(opp)}"><strong>${short(opp)}</strong></div></div><button id="s5PlaySeasonGame" class="s5-play" type="button">Play Game ${played+1}</button></section>`;
    c.innerHTML=hero+next+`<div class="s5-standings">${tableMarkup('Eastern Conference',east,s)}${tableMarkup('Western Conference',west,s)}</div>`;document.getElementById('s5PlaySeasonGame')?.addEventListener('click',startGame);
  }
  function startGame(){
    const s=read(),g=s&&userGame(s);if(!s||!g)return;
    const opp=g.home===s.teamId?g.away:g.home,ut=teamPlayers(s.teamId),ct=teamPlayers(opp);if(ut.length<5||ct.length<5){alert('This team does not yet have a complete Starting 5.');return}
    userTeam=ut;cpuTeam=ct;state={quarter:1,userScore:0,cpuScore:0,usedUser:new Set(),usedCpu:new Set(),category:null,history:[],overtime:false};showScreen('game');
    try{window.dispatchEvent(new CustomEvent('s5:game-start',{detail:{state,userTeam,cpuTeam,mode:'season'}}))}catch{}
    beginQuarter();window.scrollTo(0,0);
  }

  window.addEventListener('s5:game-finished',e=>{
    try{if(sessionStorage.getItem(ACTIVE_KEY)!=='1')return}catch{return}
    const p=readPending(),s=read();if(!p||!s||s.results?.[p.gameId])return;
    const round=s.schedule?.[p.roundIndex]||[],g=round.find(x=>x.id===p.gameId);if(!g)return;
    const us=Number(e.detail?.userScore??state?.userScore)||0,cs=Number(e.detail?.cpuScore??state?.cpuScore)||0;
    let winner=us>cs?p.userId:p.oppId;if(us===cs)winner=Math.random()<.5?p.userId:p.oppId;
    applyResult(s,g,winner,true,`${us}-${cs}`);simulateRestOfRound(s,round,g.id);s.roundIndex=Math.max(Number(s.roundIndex)||0,p.roundIndex+1);if(s.roundIndex>=82)s.complete=true;write(s);
  });

  function start(){ensureUI();renderTeamPicker();const b=document.getElementById('seasonModeBtn');if(b&&read())b.textContent='Continue Season';loadTemplate().catch(()=>{})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.STARTING5_SEASON_MODE={openSeason,renderHub,teamPlayers};
})();