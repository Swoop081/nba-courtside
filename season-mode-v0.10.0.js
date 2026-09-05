/* NBA Courtside v0.10.0 — full Season Mode: 30 current teams, official 2026-27 schedule, standings, playoffs, history, championship credits */
(()=>{
  if(window.__courtsideSeasonModeV0100)return;
  window.__courtsideSeasonModeV0100=true;

  const SAVE_KEY='nbaCourtsideSeasonModeV1';
  const LEAGUE_KEY='nbaCourtsideLeagueHistoryV1';
  const SEASON='2026-27';
  const CURRENT_IDS=['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744','1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752','1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'];
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const WEST=new Set(CURRENT_IDS.filter(id=>!EAST.has(id)));
  const SCHEDULE_URLS=['https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json','https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json'];
  const POS_ORDER={PG:0,SG:1,SF:2,PF:3,C:4};
  let seasonGame=null;
  let currentTab='overview';
  let championshipTimer=null;

  const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
  const readSave=()=>readJSON(SAVE_KEY,null);
  const saveSeason=s=>localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  const readLeague=()=>readJSON(LEAGUE_KEY,[]);
  const saveLeague=v=>localStorage.setItem(LEAGUE_KEY,JSON.stringify(v));
  const roster=()=>players.filter(p=>CURRENT_IDS.includes(String(p.teamId))&&!p.classicTeam);
  const teamPlayers=id=>roster().filter(p=>String(p.teamId)===String(id)).sort((a,b)=>(POS_ORDER[a.position]??9)-(POS_ORDER[b.position]??9));
  const teamName=id=>teamPlayers(id)[0]?.team||TEAM_SHORT[id]||'NBA Team';
  const teamShort=id=>TEAM_SHORT[id]||teamPlayers(id)[0]?.teamShort||teamName(id);
  const teamLogo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const overall=p=>typeof window.courtsideOverall==='function'?window.courtsideOverall(p):Math.round(['scoring','dunks','three','rebounding','passing','blocks','steals'].reduce((a,k)=>a+(p.stats[k]||0),0)/7);
  const strength=id=>{const r=teamPlayers(id);return r.length?r.reduce((a,p)=>a+overall(p),0)/r.length:20};
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmtDate=s=>{try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric'}).format(new Date(`${s}T12:00:00`))}catch{return s}};
  const confFor=id=>EAST.has(String(id))?'East':'West';

  const css=`
  .season-launch-btn{width:100%;min-height:52px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:linear-gradient(180deg,#202a3a,#0d121a);color:#fff;font-size:16px;font-weight:1000;letter-spacing:.03em;margin-top:8px;box-shadow:0 8px 22px rgba(0,0,0,.28)}
  .season-screen{padding-bottom:34px}.season-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.season-kicker{color:#f7b928;font-size:11px;font-weight:1000;letter-spacing:.18em;text-transform:uppercase}.season-title{margin:3px 0 0;font-size:25px;line-height:1}.season-back{min-height:42px}
  .season-team-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.season-team-pick{display:grid;grid-template-columns:52px 1fr;align-items:center;gap:10px;text-align:left;min-height:72px;padding:9px 10px;border-radius:15px;border:1px solid rgba(255,255,255,.12);background:#101720;color:#fff}.season-team-pick img{width:48px;height:48px;object-fit:contain}.season-team-pick strong{font-size:13px}.season-team-pick small{display:block;color:#8f99a8;margin-top:3px;font-size:9px;text-transform:uppercase;letter-spacing:.08em}
  .season-loading{padding:30px 16px;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:#0e141d}.season-loading strong{display:block;font-size:18px}.season-loading small{display:block;color:#9ca6b5;line-height:1.45;margin-top:8px}
  .season-hero{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:linear-gradient(140deg,var(--sa,#172233),#080b10 65%);padding:16px;margin-bottom:12px}.season-hero-logo{position:absolute;width:160px;height:160px;object-fit:contain;right:-38px;top:-42px;opacity:.16;filter:saturate(.8)}.season-hero-top{display:flex;align-items:center;gap:12px;position:relative}.season-hero-top>img{width:66px;height:66px;object-fit:contain}.season-hero h2{margin:0;font-size:25px}.season-record{font-size:13px;color:#c8d0dc;font-weight:900;margin-top:4px}.season-progress{height:7px;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:14px}.season-progress i{display:block;height:100%;background:#f7b928;border-radius:inherit}.season-progress-label{display:flex;justify-content:space-between;color:#9ca6b4;font-size:9px;font-weight:900;margin-top:5px;text-transform:uppercase;letter-spacing:.06em}
  .season-tabs{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;margin:0 0 12px}.season-tab{white-space:nowrap;border-radius:999px;border:1px solid rgba(255,255,255,.13);background:#10161f;color:#aab3c1;padding:9px 12px;font-size:10px;font-weight:1000}.season-tab.active{background:#f7b928;color:#090b0f;border-color:#f7b928}
  .season-panel{display:grid;gap:10px}.season-next{border:1px solid rgba(255,255,255,.12);border-radius:20px;background:linear-gradient(180deg,#121923,#090d13);padding:15px}.season-next-label{font-size:9px;font-weight:1000;letter-spacing:.16em;color:#f7b928;text-transform:uppercase}.season-matchup{display:grid;grid-template-columns:1fr 54px 1fr;align-items:center;gap:8px;margin:12px 0}.season-matchup-side{text-align:center}.season-matchup-side img{display:block;width:68px;height:68px;object-fit:contain;margin:auto}.season-matchup-side strong{display:block;font-size:12px;margin-top:6px}.season-vs{text-align:center;font-weight:1000;font-size:17px;color:#8f99a8}.season-date{text-align:center;color:#aab3c0;font-size:11px;font-weight:800;margin:-3px 0 12px}.season-play-btn{width:100%;min-height:52px;border:0;border-radius:14px;background:linear-gradient(180deg,#ffd85e,#f7b928);color:#090b0e;font-size:15px;font-weight:1000}.season-note{font-size:10px;color:#8f99a8;line-height:1.45;margin-top:8px;text-align:center}
  .season-cards{display:grid;grid-template-columns:1fr 1fr;gap:8px}.season-stat-card{padding:13px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:#0d131b}.season-stat-card span{display:block;color:#8f99a8;font-size:9px;font-weight:1000;text-transform:uppercase;letter-spacing:.08em}.season-stat-card strong{display:block;font-size:23px;margin-top:4px}
  .standings-section{border:1px solid rgba(255,255,255,.1);border-radius:18px;background:#0c1118;overflow:hidden}.standings-section h3{margin:0;padding:12px 13px;background:#121923;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.standing-row{display:grid;grid-template-columns:26px 1fr 36px 36px 40px;align-items:center;gap:5px;padding:8px 10px;border-top:1px solid rgba(255,255,255,.07);font-size:10px}.standing-row.user{background:rgba(247,185,40,.12)}.standing-team{display:flex;align-items:center;gap:7px;min-width:0}.standing-team img{width:24px;height:24px;object-fit:contain}.standing-team b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.standing-row>span,.standing-row>strong{text-align:center}.standing-head{color:#7f8998;font-size:8px;font-weight:1000;text-transform:uppercase}
  .schedule-list,.history-list{display:grid;gap:7px}.schedule-game,.history-event{display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:9px;padding:10px;border:1px solid rgba(255,255,255,.09);border-radius:13px;background:#0d131b}.schedule-game img{width:40px;height:40px;object-fit:contain}.schedule-game strong,.history-event strong{font-size:11px}.schedule-game small,.history-event small{display:block;color:#8f99a8;font-size:9px;margin-top:3px}.schedule-result{font-size:11px;font-weight:1000}.schedule-result.win{color:#73e39a}.schedule-result.loss{color:#ff7b85}.schedule-result.next{color:#f7b928}
  .season-danger{width:100%;min-height:44px;border-radius:13px;border:1px solid rgba(255,90,100,.28);background:rgba(120,20,28,.16);color:#ff9ca4;font-weight:900;margin-top:8px}
  .season-bracket-card{padding:13px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:#0d131b}.season-bracket-card h3{margin:0 0 7px;font-size:14px}.series-score{display:flex;justify-content:space-between;align-items:center;font-size:11px}.series-score b{font-size:18px;color:#f7b928}
  .season-championship{position:fixed;inset:0;z-index:20000;overflow:hidden;background:radial-gradient(circle at 50% 18%,#47320a 0,#110e08 35%,#030405 75%);display:flex;align-items:center;justify-content:center;padding:calc(20px + env(safe-area-inset-top)) 18px calc(20px + env(safe-area-inset-bottom));color:#fff}.season-championship.hidden{display:none}.champ-confetti{position:absolute;top:-12%;width:7px;height:18px;background:linear-gradient(#fff0a5,#d7a51e);animation:champFall var(--d) linear infinite;animation-delay:var(--delay);left:var(--x);transform:rotate(var(--r))}.champ-confetti:nth-child(3n){width:10px;height:10px;border-radius:50%}.champ-confetti:nth-child(4n){background:#fff7cc}@keyframes champFall{to{transform:translateY(125vh) rotate(720deg)}}
  .champ-shell{position:relative;z-index:2;width:min(88vw,390px);text-align:center}.champ-kicker{font-size:11px;font-weight:1000;letter-spacing:.24em;color:#ffd85e}.champ-shell h1{font-size:34px;line-height:.92;margin:8px 0 4px;text-transform:uppercase}.champ-team{font-size:14px;font-weight:900;color:#e8d9a6}.champ-trophy{position:relative;width:108px;height:132px;margin:14px auto 4px}.champ-trophy .bowl{position:absolute;left:18px;top:0;width:72px;height:60px;border-radius:10px 10px 38px 38px;background:linear-gradient(110deg,#a66b08,#fff0a4 46%,#c78c15 70%,#774506);box-shadow:0 0 28px rgba(255,202,62,.48)}.champ-trophy .bowl:before,.champ-trophy .bowl:after{content:'';position:absolute;top:10px;width:26px;height:35px;border:7px solid #d6a02b;border-radius:50%;z-index:-1}.champ-trophy .bowl:before{left:-22px}.champ-trophy .bowl:after{right:-22px}.champ-trophy .stem{position:absolute;left:48px;top:54px;width:12px;height:50px;background:linear-gradient(90deg,#9b650b,#ffe687,#9b650b)}.champ-trophy .base{position:absolute;left:27px;bottom:4px;width:54px;height:19px;border-radius:5px 5px 8px 8px;background:linear-gradient(90deg,#764504,#ffd65d,#8f5808)}
  .champ-player-label{font-size:11px;font-weight:1000;letter-spacing:.12em;color:#f7c63f;text-transform:uppercase;margin:6px 0 9px}.champ-card-wrap{width:min(58vw,230px);margin:auto}.champ-card-wrap .player-card{width:100%!important}.champ-credits{color:#bcae82;font-size:9px;line-height:1.45;margin-top:9px}.champ-finish{margin-top:12px;width:100%;min-height:46px;border:1px solid rgba(255,220,100,.5);border-radius:14px;background:linear-gradient(180deg,#f7c94e,#b57a0a);color:#110d05;font-weight:1000}.champ-finish.hidden{visibility:hidden}
  @media(max-width:430px){.season-team-grid{grid-template-columns:1fr 1fr}.season-team-pick{grid-template-columns:42px 1fr;min-height:62px}.season-team-pick img{width:40px;height:40px}.season-matchup-side img{width:60px;height:60px}.standing-row{grid-template-columns:22px 1fr 31px 31px 37px;padding-left:7px;padding-right:7px}}
  `;
  const style=document.createElement('style');style.id='season-mode-style-v0100';style.textContent=css;document.head.appendChild(style);

  function ensureScreens(){
    const shell=document.querySelector('.app-shell');if(!shell||document.getElementById('seasonHub'))return;
    const pick=document.createElement('section');pick.id='seasonTeamSelect';pick.className='screen season-screen';pick.innerHTML=`<div class="season-head"><div><div class="season-kicker">Season Mode</div><h2 class="season-title">Choose Your Team</h2></div><button type="button" class="ghost-btn season-back" data-season-back>← Back</button></div><div id="seasonTeamGrid" class="season-team-grid"></div><div id="seasonCreateStatus" style="margin-top:12px"></div>`;shell.appendChild(pick);
    const hub=document.createElement('section');hub.id='seasonHub';hub.className='screen season-screen';hub.innerHTML=`<div class="season-head"><div><div class="season-kicker">2026–27 NBA Season</div><h2 class="season-title">Season Mode</h2></div><button type="button" class="ghost-btn season-back" data-season-home>Menu</button></div><div id="seasonHero"></div><div id="seasonTabs" class="season-tabs"></div><div id="seasonContent"></div>`;shell.appendChild(hub);
    const champ=document.createElement('section');champ.id='seasonChampionship';champ.className='season-championship hidden';document.body.appendChild(champ);
    pick.querySelector('[data-season-back]').onclick=()=>showScreen('intro');
    hub.querySelector('[data-season-home]').onclick=()=>showScreen('intro');
  }

  function installLaunch(){
    ensureScreens();
    const actions=document.querySelector('#intro .brand-launch-actions');if(!actions||document.getElementById('seasonModeBtn'))return;
    const btn=document.createElement('button');btn.id='seasonModeBtn';btn.type='button';btn.className='season-launch-btn';btn.textContent=readSave()?'Continue Season':'Season Mode';
    const catalogue=document.getElementById('catalogueBtn');if(catalogue)catalogue.insertAdjacentElement('beforebegin',btn);else actions.prepend(btn);
    btn.onclick=()=>{const s=readSave();if(s){renderSeasonHub();showScreen('seasonHub')}else openTeamSelect()};
  }

  function openTeamSelect(){
    ensureScreens();
    const grid=document.getElementById('seasonTeamGrid');
    const ids=[...CURRENT_IDS].sort((a,b)=>teamName(a).localeCompare(teamName(b)));
    grid.innerHTML=ids.map(id=>`<button type="button" class="season-team-pick" data-team="${id}"><img src="${teamLogo(id)}" alt=""><span><strong>${esc(teamName(id))}</strong><small>${confFor(id)} · 2026–27</small></span></button>`).join('');
    grid.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>createNewSeason(b.dataset.team));
    document.getElementById('seasonCreateStatus').innerHTML='';showScreen('seasonTeamSelect');window.scrollTo({top:0});
  }

  function normalizeDate(raw){
    if(!raw)return'';const s=String(raw);let m=s.match(/(20\d\d)-(\d\d)-(\d\d)/);if(m)return`${m[1]}-${m[2]}-${m[3]}`;m=s.match(/(\d{1,2})\/(\d{1,2})\/(20\d\d)/);if(m)return`${m[3]}-${String(m[1]).padStart(2,'0')}-${String(m[2]).padStart(2,'0')}`;return'';
  }

  async function fetchOfficialSchedule(){
    let lastErr=null;
    for(const url of SCHEDULE_URLS){
      try{
        const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`NBA schedule ${r.status}`);const data=await r.json();
        const dates=data?.leagueSchedule?.gameDates||data?.gameDates||[];const out=[],seen=new Set();
        dates.forEach(block=>(block.games||[]).forEach(g=>{
          const date=normalizeDate(g.gameDateEst||g.gameDateTimeEst||g.gameDate||block.gameDate);if(!date||date<'2026-10-20'||date>'2027-04-11')return;
          const home=String(g.homeTeam?.teamId||g.homeTeamId||''),away=String(g.awayTeam?.teamId||g.awayTeamId||'');if(!CURRENT_IDS.includes(home)||!CURRENT_IDS.includes(away)||home===away)return;
          const label=`${g.gameLabel||''} ${g.gameSubLabel||''} ${g.seriesText||''}`.toLowerCase();if(label.includes('preseason')||label.includes('cup championship')||label.includes('nba cup final'))return;
          const id=String(g.gameId||`${date}-${away}-${home}`),key=`${date}-${away}-${home}`;if(seen.has(id)||seen.has(key))return;seen.add(id);seen.add(key);
          out.push({id,date,home,away,official:true,cupTbd:false});
        }));
        if(out.length<1000)throw new Error('NBA schedule feed did not contain the regular season');
        out.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
        return completeCupSlots(out);
      }catch(e){lastErr=e;}
    }
    throw lastErr||new Error('Unable to load official NBA schedule');
  }

  function completeCupSlots(base){
    const counts=Object.fromEntries(CURRENT_IDS.map(id=>[id,0]));base.forEach(g=>{counts[g.home]++;counts[g.away]++});
    const need=CURRENT_IDS.reduce((n,id)=>n+Math.max(0,82-counts[id]),0);
    if(!need)return base;
    const allNeedTwo=CURRENT_IDS.every(id=>counts[id]===80);
    if(allNeedTwo){
      let arr=[...CURRENT_IDS];const extras=[];
      for(let round=0;round<2;round++){
        for(let i=0;i<arr.length/2;i++){
          const a=arr[i],b=arr[arr.length-1-i],home=(round+i)%2?a:b,away=home===a?b:a;
          extras.push({id:`cup-tbd-${round+1}-${i+1}`,date:round===0?'2026-12-05':'2026-12-09',home,away,official:false,cupTbd:true});
        }
        arr=[arr[0],arr[arr.length-1],...arr.slice(1,-1)];
      }
      return [...base,...extras].sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
    }
    const games=[...base];const deficits=Object.fromEntries(CURRENT_IDS.map(id=>[id,Math.max(0,82-counts[id])]));let serial=1;
    while(Object.values(deficits).some(v=>v>0)){
      const pool=CURRENT_IDS.filter(id=>deficits[id]>0).sort((a,b)=>deficits[b]-deficits[a]);if(pool.length<2)break;
      const a=pool[0],b=pool.find(id=>id!==a);if(!b)break;const home=serial%2?a:b,away=home===a?b:a;
      games.push({id:`cup-tbd-x-${serial}`,date:serial%2?'2026-12-05':'2026-12-09',home,away,official:false,cupTbd:true});deficits[a]--;deficits[b]--;serial++;
    }
    return games.sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  }

  function initRecords(){return Object.fromEntries(CURRENT_IDS.map(id=>[id,{w:0,l:0}]));}
  function addHistory(s,type,text,meta={}){s.history.unshift({at:new Date().toISOString(),type,text,...meta});if(s.history.length>500)s.history.length=500;}

  async function createNewSeason(teamId){
    const status=document.getElementById('seasonCreateStatus');status.innerHTML='<div class="season-loading"><strong>Loading the official 2026–27 NBA schedule…</strong><small>Season Mode uses the NBA schedule feed and builds the complete league calendar before your first game.</small></div>';
    document.querySelectorAll('.season-team-pick').forEach(b=>b.disabled=true);
    try{
      const schedule=await fetchOfficialSchedule();
      const userGames=schedule.filter(g=>g.home===teamId||g.away===teamId);
      if(userGames.length!==82)throw new Error(`Schedule produced ${userGames.length} games for ${teamName(teamId)}, not 82.`);
      const s={version:1,season:SEASON,teamId,createdAt:new Date().toISOString(),phase:'regular',schedule,records:initRecords(),results:{},history:[],champion:null,completed:false,post:null,scheduleSource:schedule.some(g=>g.cupTbd)?'NBA official 80 + NBA Cup-determined slots simulated':'NBA official 82'};
      addHistory(s,'season',`${teamName(teamId)} began the 2026–27 season.`);saveSeason(s);document.getElementById('seasonModeBtn').textContent='Continue Season';renderSeasonHub();showScreen('seasonHub');window.scrollTo({top:0});
    }catch(e){status.innerHTML=`<div class="season-loading"><strong>Couldn’t load the NBA schedule.</strong><small>${esc(e.message||e)}<br><br>Season creation has not started. Tap your team again to retry.</small></div>`;document.querySelectorAll('.season-team-pick').forEach(b=>b.disabled=false);}
  }

  function teamGames(s){return s.schedule.filter(g=>g.home===s.teamId||g.away===s.teamId).sort((a,b)=>a.date.localeCompare(b.date));}
  function nextRegularGame(s){return teamGames(s).find(g=>!s.results[g.id])||null;}
  function teamRecord(s,id){return s.records[id]||{w:0,l:0};}
  function pct(r){const n=r.w+r.l;return n?r.w/n:0;}
  function standings(s,set){return [...set].map(id=>({id,...teamRecord(s,id)})).sort((a,b)=>pct(b)-pct(a)||b.w-a.w||strength(b.id)-strength(a.id));}

  function renderSeasonHero(s){
    const r=teamRecord(s,s.teamId),played=r.w+r.l,total=s.phase==='regular'?82:Math.max(82,played),p=Math.min(100,Math.round(played/82*100));const t=TEAM_DATA[s.teamId]||[];
    document.getElementById('seasonHero').innerHTML=`<div class="season-hero" style="--sa:${t[1]||'#28364b'}"><img class="season-hero-logo" src="${teamLogo(s.teamId)}" alt=""><div class="season-hero-top"><img src="${teamLogo(s.teamId)}" alt=""><div><h2>${esc(teamShort(s.teamId))}</h2><div class="season-record">${r.w}–${r.l} · ${esc(s.phase==='regular'?'Regular Season':s.completed?'Season Complete':'Postseason')}</div></div></div><div class="season-progress"><i style="width:${p}%"></i></div><div class="season-progress-label"><span>${played} games played</span><span>${s.phase==='regular'?`${Math.max(0,82-played)} remaining`:'Playoffs'}</span></div></div>`;
  }

  function renderSeasonHub(){
    ensureScreens();const s=readSave();if(!s){openTeamSelect();return}renderSeasonHero(s);
    const tabs=['overview','standings','schedule','history'];document.getElementById('seasonTabs').innerHTML=tabs.map(t=>`<button type="button" class="season-tab ${currentTab===t?'active':''}" data-tab="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('');document.querySelectorAll('#seasonTabs [data-tab]').forEach(b=>b.onclick=()=>{currentTab=b.dataset.tab;renderSeasonHub()});
    const c=document.getElementById('seasonContent');if(currentTab==='standings')c.innerHTML=standingsMarkup(s);else if(currentTab==='schedule')c.innerHTML=scheduleMarkup(s);else if(currentTab==='history')c.innerHTML=historyMarkup(s);else c.innerHTML=overviewMarkup(s);
    bindHubActions(s);window.scrollTo({top:0});
  }

  function nextPostGame(s){return s.post?.pending||s.post?.userSeries?seriesGameDescriptor(s):null;}
  function overviewMarkup(s){
    const next=s.phase==='regular'?nextRegularGame(s):nextPostGame(s);const r=teamRecord(s,s.teamId);let nextHtml='';
    if(next){const opp=next.home===s.teamId?next.away:next.home;nextHtml=`<div class="season-next"><div class="season-next-label">${s.phase==='regular'?`Game ${r.w+r.l+1} of 82`:esc(next.label||'Postseason')}</div><div class="season-matchup"><div class="season-matchup-side"><img src="${teamLogo(s.teamId)}" alt=""><strong>${esc(teamShort(s.teamId))}</strong></div><div class="season-vs">${next.home===s.teamId?'VS':'@'}</div><div class="season-matchup-side"><img src="${teamLogo(opp)}" alt=""><strong>${esc(teamShort(opp))}</strong></div></div><div class="season-date">${next.date?fmtDate(next.date):esc(next.label||'Postseason')}</div><button class="season-play-btn" type="button" data-play-season>Play Game</button>${next.cupTbd?'<div class="season-note">NBA Cup-determined schedule slot. The NBA has not assigned these two league games yet; this matchup is resolved inside this Season Mode save.</div>':''}</div>`;
    }else if(s.completed){nextHtml=`<div class="season-next"><div class="season-next-label">Season Complete</div><div style="text-align:center;padding:16px 5px"><img src="${teamLogo(s.champion)}" style="width:88px;height:88px;object-fit:contain" alt=""><h3 style="margin:7px 0 3px">${esc(teamName(s.champion))}</h3><div style="color:#f7b928;font-weight:1000">2027 NBA CHAMPIONS</div></div></div>`}
    else nextHtml='<div class="season-loading"><strong>Postseason setup</strong><small>The playoff field is being prepared from the final standings.</small></div>';
    const east=standings(s,EAST),west=standings(s,WEST),rank=(conf=>conf.findIndex(x=>x.id===s.teamId)+1)(EAST.has(s.teamId)?east:west);
    return `<div class="season-panel">${nextHtml}<div class="season-cards"><div class="season-stat-card"><span>Conference Seed</span><strong>#${rank||'—'}</strong></div><div class="season-stat-card"><span>Win Percentage</span><strong>${(pct(r)*100).toFixed(1)}%</strong></div></div>${s.post?.userSeries?`<div class="season-bracket-card"><h3>${esc(s.post.userSeries.label)}</h3><div class="series-score"><span>${esc(teamShort(s.teamId))}</span><b>${s.post.userSeries.userWins}–${s.post.userSeries.oppWins}</b><span>${esc(teamShort(s.post.userSeries.opp))}</span></div></div>`:''}<button type="button" class="season-danger" data-new-season>Start a New Season</button></div>`;
  }

  function standingsMarkup(s){
    const section=(title,set)=>{const rows=standings(s,set);return `<div class="standings-section"><h3>${title}</h3><div class="standing-row standing-head"><span>#</span><span>Team</span><span>W</span><span>L</span><span>PCT</span></div>${rows.map((x,i)=>`<div class="standing-row ${x.id===s.teamId?'user':''}"><strong>${i+1}</strong><div class="standing-team"><img src="${teamLogo(x.id)}" alt=""><b>${esc(teamShort(x.id))}</b></div><span>${x.w}</span><span>${x.l}</span><span>${pct(x).toFixed(3).replace(/^0/,'')}</span></div>`).join('')}</div>`};
    return `<div class="season-panel">${section('Eastern Conference',EAST)}${section('Western Conference',WEST)}</div>`;
  }

  function scheduleMarkup(s){
    const list=teamGames(s);const next=nextRegularGame(s);return `<div class="schedule-list">${list.map((g,i)=>{const opp=g.home===s.teamId?g.away:g.home,res=s.results[g.id];let rs=res?(res.winner===s.teamId?'W':'L'):(next?.id===g.id?'NEXT':'—'),cl=res?(res.winner===s.teamId?'win':'loss'):(next?.id===g.id?'next':'');return `<div class="schedule-game"><img src="${teamLogo(opp)}" alt=""><div><strong>${i+1}. ${g.home===s.teamId?'vs':'@'} ${esc(teamName(opp))}</strong><small>${fmtDate(g.date)}${g.cupTbd?' · NBA Cup-determined':''}</small></div><span class="schedule-result ${cl}">${rs}${res?.cardScore?` ${res.cardScore}`:''}</span></div>`}).join('')}</div>`;
  }

  function historyMarkup(s){
    const archived=readLeague();const current=`<div class="history-list">${s.history.length?s.history.map(e=>`<div class="history-event"><div style="font-size:20px">${e.type==='champion'?'🏆':e.type==='playoffs'?'★':'•'}</div><div><strong>${esc(e.text)}</strong><small>${new Date(e.at).toLocaleString()}</small></div><span></span></div>`).join(''):'<div class="season-loading"><strong>No events yet</strong><small>Your season history will build as you play.</small></div>'}</div>`;
    const past=archived.length?`<div class="standings-section" style="margin-top:12px"><h3>League Archive</h3>${archived.map(x=>`<div class="history-event" style="border:0;border-top:1px solid rgba(255,255,255,.07);border-radius:0"><img src="${teamLogo(x.champion)}" style="width:38px;height:38px;object-fit:contain" alt=""><div><strong>${esc(x.season)} · ${esc(teamName(x.champion))} NBA Champions</strong><small>Your team: ${esc(teamName(x.userTeam))} · ${x.record}</small></div><span>🏆</span></div>`).join('')}</div>`:'';
    return current+past;
  }

  function bindHubActions(s){
    document.querySelector('[data-play-season]')?.addEventListener('click',()=>startSeasonGame());
    document.querySelector('[data-new-season]')?.addEventListener('click',()=>{if(confirm('Start a new Season Mode save? Your current season will be replaced, but completed seasons remain in League History.')){localStorage.removeItem(SAVE_KEY);document.getElementById('seasonModeBtn').textContent='Season Mode';openTeamSelect()}});
  }

  function simWinner(home,away){const hs=strength(home)+1.8,as=strength(away),p=Math.max(.18,Math.min(.82,.5+(hs-as)/38));return Math.random()<p?home:away;}
  function applyLeagueResult(s,g,winner,extra={}){if(s.results[g.id])return;s.results[g.id]={winner,loser:winner===g.home?g.away:g.home,...extra};s.records[winner].w++;s.records[s.results[g.id].loser].l++;}
  function simulateCpuGame(s,g){const winner=simWinner(g.home,g.away),loser=winner===g.home?g.away:g.home,base=96+Math.floor(Math.random()*22),margin=1+Math.floor(Math.random()*17);applyLeagueResult(s,g,winner,{score:winner===g.home?`${base+margin}-${base}`:`${base}-${base+margin}`,simulated:true});return {winner,loser};}
  function simulateThrough(s,date,exclude){s.schedule.filter(g=>g.date<=date&&!s.results[g.id]&&g.id!==exclude&&g.home!==s.teamId&&g.away!==s.teamId).forEach(g=>simulateCpuGame(s,g));}

  function setGameLabels(home,away){const sides=document.querySelectorAll('#game .score-side span');if(sides[0])sides[0].textContent=teamShort(seasonGame.userId);if(sides[1])sides[1].textContent=teamShort(seasonGame.oppId);const q=document.getElementById('quarterLabel');if(q&&seasonGame.label)q.title=seasonGame.label;}
  function startSeasonGame(){
    const s=readSave();if(!s)return;const g=s.phase==='regular'?nextRegularGame(s):nextPostGame(s);if(!g)return;
    const opp=g.home===s.teamId?g.away:g.home;seasonGame={mode:'season',phase:s.phase,gameId:g.id||`post-${Date.now()}`,date:g.date||'',home:g.home,away:g.away,userId:s.teamId,oppId:opp,label:g.label||'',postKind:g.kind||null};
    userTeam=teamPlayers(s.teamId);cpuTeam=teamPlayers(opp);state={quarter:1,userScore:0,cpuScore:0,usedUser:new Set(),usedCpu:new Set(),category:null,history:[],overtime:false};showScreen('game');setGameLabels(g.home,g.away);beginQuarter();window.scrollTo({top:0});
  }

  const baseFinish=finishGame;
  finishGame=function(){
    if(!seasonGame)return baseFinish();
    if(state.userScore===state.cpuScore){const bonus=strength(seasonGame.userId)>=strength(seasonGame.oppId)?'user':'cpu';if(bonus==='user')state.userScore++;else state.cpuScore++;state.history.push({quarter:'SD',category:'scoring',user:userTeam[0],cpu:cpuTeam[0],userPts:bonus==='user'?1:0,cpuPts:bonus==='cpu'?1:0});}
    const won=state.userScore>state.cpuScore,s=readSave();if(!s){seasonGame=null;return baseFinish()}
    if(seasonGame.phase==='regular'){
      const g=s.schedule.find(x=>x.id===seasonGame.gameId);simulateThrough(s,g.date,g.id);applyLeagueResult(s,g,won?s.teamId:seasonGame.oppId,{cardScore:`${state.userScore}-${state.cpuScore}`,userPlayed:true});
      const rec=teamRecord(s,s.teamId);addHistory(s,'game',`${won?'Win':'Loss'} ${g.home===s.teamId?'vs':'at'} ${teamName(seasonGame.oppId)}, ${state.userScore}–${state.cpuScore}.`,{gameId:g.id});
      if(rec.w+rec.l===82){simulateThrough(s,'2027-04-11',null);setupPostseason(s);}
    }else handlePostResult(s,won);
    saveSeason(s);baseFinish();document.getElementById('finalResult').textContent=won?`${teamShort(s.teamId)} Win!`:`${teamShort(s.teamId)} Lose`;document.getElementById('playAgainBtn').textContent=s.completed&&s.champion===s.teamId?'Championship Celebration':'Back to Season';document.querySelectorAll('#final .final-score span').forEach((n,i)=>n.textContent=i===0?teamShort(s.teamId):teamShort(seasonGame.oppId));seasonGame={...seasonGame,returnReady:true,championJustWon:s.completed&&s.champion===s.teamId};
  };

  document.getElementById('playAgainBtn')?.addEventListener('click',e=>{if(!seasonGame?.returnReady)return;e.preventDefault();e.stopImmediatePropagation();const champ=seasonGame.championJustWon;seasonGame=null;if(champ)showChampionship();else{renderSeasonHub();showScreen('seasonHub')}},true);

  function setupPostseason(s){
    const east=standings(s,EAST),west=standings(s,WEST),conf=EAST.has(s.teamId)?east:west,other=EAST.has(s.teamId)?west:east,userSeed=conf.findIndex(x=>x.id===s.teamId)+1;s.phase='postseason';s.post={userSeed,userConf:EAST.has(s.teamId)?'East':'West',otherChampion:simulateConference(playInCpu(other.map(x=>x.id),null).seeds,s),pending:null,userSeries:null,roundNo:0,roundWinners:null,confEntries:null};addHistory(s,'playoffs',`Regular season complete: ${teamRecord(s,s.teamId).w}–${teamRecord(s,s.teamId).l}, ${s.post.userConf} #${userSeed}.`);
    const confIds=conf.map(x=>x.id);const pi=prepareUserPlayIn(confIds,s.teamId,userSeed,s);if(pi.pending){s.post.pending=pi.pending;s.post.playIn=pi;return}if(!pi.qualified){addHistory(s,'playoffs',`${teamName(s.teamId)} missed the playoffs.`);finishCpuSeason(s,confIds,other.map(x=>x.id));return}s.post.userSeed=pi.seed;startUserConference(s,pi.seeds);
  }

  function playInCpu(ids,userId){
    const top6=ids.slice(0,6),s7=ids[6],s8=ids[7],s9=ids[8],s10=ids[9];const a=simWinner(s7,s8),aLoser=a===s7?s8:s7,b=simWinner(s9,s10),c=simWinner(aLoser,b);return {seeds:[...top6,a,c],seed7:a,seed8:c};
  }
  function prepareUserPlayIn(ids,userId,seed,s){
    if(seed<=6)return {qualified:true,seed,seeds:playInCpu(ids,null).seeds.map((id,i)=>i<6?ids[i]:id)};
    if(seed>10)return {qualified:false,seeds:playInCpu(ids,null).seeds};
    const s7=ids[6],s8=ids[7],s9=ids[8],s10=ids[9];
    if(seed===7||seed===8){const opp=seed===7?s8:s7;const otherWinner=simWinner(s9,s10);return {qualified:null,seed,ids,otherWinner,step:'A',pending:{id:'playin-a-user',kind:'playinA',label:'Play-In · 7/8 Game',home:s7,away:s8}}}
    const opp=seed===9?s10:s9;const aWinner=simWinner(s7,s8),aLoser=aWinner===s7?s8:s7;return {qualified:null,seed,ids,aWinner,aLoser,step:'B',pending:{id:'playin-b-user',kind:'playinB',label:'Play-In · 9/10 Game',home:s9,away:s10}};
  }

  function handlePlayInResult(s,won){
    const pi=s.post.playIn,p=s.post.pending;const user=s.teamId;
    if(p.kind==='playinA'){
      const opp=p.home===user?p.away:p.home;if(won){const seed7=user,seed8=simWinner(opp,pi.otherWinner);const seeds=[...pi.ids.slice(0,6),seed7,seed8];s.post.pending=null;s.post.userSeed=7;addHistory(s,'playoffs',`${teamName(user)} won the 7/8 Play-In game and claimed the #7 seed.`);startUserConference(s,seeds);return}
      s.post.pending={id:'playin-c-user',kind:'playinC',label:'Play-In · Final Chance',home:opp,away:pi.otherWinner};pi.finalOpp=pi.otherWinner;addHistory(s,'playoffs',`${teamName(user)} lost the 7/8 Play-In game and moved to the final Play-In game.`);return;
    }
    if(p.kind==='playinB'){
      if(!won){s.post.pending=null;addHistory(s,'playoffs',`${teamName(user)} was eliminated in the Play-In Tournament.`);finishCpuSeason(s,pi.ids,null);return}
      s.post.pending={id:'playin-c-user',kind:'playinC',label:'Play-In · Final Chance',home:pi.aLoser,away:user};pi.finalOpp=pi.aLoser;addHistory(s,'playoffs',`${teamName(user)} advanced to the final Play-In game.`);return;
    }
    if(p.kind==='playinC'){
      if(!won){s.post.pending=null;addHistory(s,'playoffs',`${teamName(user)} was eliminated in the final Play-In game.`);finishCpuSeason(s,pi.ids,null);return}
      let cpu=playInCpu(pi.ids,null).seeds;cpu=cpu.filter(id=>id!==user);const seeds=[...pi.ids.slice(0,6),cpu.find(id=>id===pi.aWinner)||pi.aWinner,user];s.post.pending=null;s.post.userSeed=8;addHistory(s,'playoffs',`${teamName(user)} won the final Play-In game and claimed the #8 seed.`);startUserConference(s,seeds);
    }
  }

  function startUserConference(s,seeds){s.post.confEntries=seeds;s.post.roundNo=1;prepareConferenceRound(s);}
  function pairEntries(entries,round){if(round===1)return [[entries[0],entries[7]],[entries[3],entries[4]],[entries[2],entries[5]],[entries[1],entries[6]]];if(round===2)return [[entries[0],entries[1]],[entries[2],entries[3]]];return [[entries[0],entries[1]]];}
  function prepareConferenceRound(s){
    const round=s.post.roundNo,entries=s.post.confEntries,pairs=pairEntries(entries,round),labels={1:'First Round',2:'Conference Semifinals',3:'Conference Finals'},winners=[];let userPair=null;
    pairs.forEach((pair,i)=>{if(pair.includes(s.teamId)){userPair={pair,i};winners[i]=null}else winners[i]=simulateSeries(pair[0],pair[1],4,s,labels[round]).winner});
    s.post.roundWinners=winners;
    if(!userPair){const champ=simulateConference(entries,s);finishAgainstOther(s,champ);return}
    const opp=userPair.pair.find(id=>id!==s.teamId);s.post.userSeries={kind:'series',label:labels[round],round,opp,userWins:0,oppWins:0,slot:userPair.i,gameNo:1,homeCourt:betterRecord(s,s.teamId,opp)};addHistory(s,'playoffs',`${labels[round]}: ${teamName(s.teamId)} vs ${teamName(opp)}.`);
  }
  function betterRecord(s,a,b){const ra=teamRecord(s,a),rb=teamRecord(s,b);return ra.w>rb.w?a:ra.w<rb.w?b:strength(a)>=strength(b)?a:b;}
  function seriesGameDescriptor(s){const ser=s.post?.userSeries;if(!ser)return s.post?.pending||null;const pattern=[true,true,false,false,true,false,true],hc=ser.homeCourt,home=pattern[(ser.gameNo-1)%7]?hc:(hc===s.teamId?ser.opp:s.teamId),away=home===s.teamId?ser.opp:s.teamId;return {id:`post-${ser.round||'f'}-${ser.gameNo}`,kind:'series',label:`${ser.label} · Game ${ser.gameNo}`,home,away,date:''};}
  function handlePostResult(s,won){
    if(s.post?.pending){handlePlayInResult(s,won);return}const ser=s.post?.userSeries;if(!ser)return;if(won)ser.userWins++;else ser.oppWins++;addHistory(s,'playoffs',`${ser.label} Game ${ser.gameNo}: ${won?'Win':'Loss'} vs ${teamName(ser.opp)}, ${state.userScore}–${state.cpuScore}.`);ser.gameNo++;
    if(ser.userWins<4&&ser.oppWins<4)return;
    if(ser.oppWins===4){addHistory(s,'playoffs',`${teamName(s.teamId)} was eliminated by ${teamName(ser.opp)} in ${ser.label}, ${ser.userWins}–${ser.oppWins}.`);if(ser.label==='NBA Finals')completeSeason(s,ser.opp,false);else finishAfterElimination(s,ser.opp);return}
    addHistory(s,'playoffs',`${teamName(s.teamId)} won ${ser.label}, ${ser.userWins}–${ser.oppWins}.`);
    if(ser.label==='NBA Finals'){completeSeason(s,s.teamId,true);return}
    s.post.roundWinners[ser.slot]=s.teamId;s.post.confEntries=s.post.roundWinners;s.post.roundNo++;s.post.userSeries=null;
    if(s.post.roundNo<=3)prepareConferenceRound(s);else startFinals(s);
  }

  function simulateSeries(a,b,target,s,label){let wa=0,wb=0,game=0;while(wa<target&&wb<target&&game<15){const home=game%4<2?a:b,w=simWinner(home,home===a?b:a);if(w===a)wa++;else wb++;game++;}const winner=wa>wb?a:b;addHistory(s,'playoffs',`${label||'Playoffs'}: ${teamName(winner)} defeated ${teamName(winner===a?b:a)} ${Math.max(wa,wb)}–${Math.min(wa,wb)}.`);return {winner,wa,wb};}
  function simulateConference(seeds,s){let entries=[...seeds],round=1;while(entries.length>1){const pairs=pairEntries(entries,round),wins=pairs.map(p=>simulateSeries(p[0],p[1],4,s,{1:'First Round',2:'Conference Semifinals',3:'Conference Finals'}[round]).winner);entries=wins;round++;}return entries[0];}
  function startFinals(s){const opp=s.post.otherChampion;s.post.userSeries={kind:'series',label:'NBA Finals',round:'finals',opp,userWins:0,oppWins:0,slot:0,gameNo:1,homeCourt:betterRecord(s,s.teamId,opp)};addHistory(s,'playoffs',`NBA Finals: ${teamName(s.teamId)} vs ${teamName(opp)}.`);}
  function finishAfterElimination(s,eliminator){let confChamp=eliminator;if(s.post.roundNo<3){const next=[...s.post.roundWinners];next[s.post.userSeries.slot]=eliminator;let round=s.post.roundNo+1,entries=next;while(entries.length>1){entries=pairEntries(entries,round).map(p=>simulateSeries(p[0],p[1],4,s,{2:'Conference Semifinals',3:'Conference Finals'}[round]).winner);round++;}confChamp=entries[0]}const finals=simulateSeries(confChamp,s.post.otherChampion,4,s,'NBA Finals');completeSeason(s,finals.winner,false);}
  function finishAgainstOther(s,confChamp){const finals=simulateSeries(confChamp,s.post.otherChampion,4,s,'NBA Finals');completeSeason(s,finals.winner,false);}
  function finishCpuSeason(s,confIds,otherIds){const a=simulateConference(playInCpu(confIds||standings(s,EAST).map(x=>x.id),null).seeds,s),b=otherIds?simulateConference(playInCpu(otherIds,null).seeds,s):s.post.otherChampion;const f=simulateSeries(a,b,4,s,'NBA Finals');completeSeason(s,f.winner,false);}

  function completeSeason(s,champion,userChampion){s.champion=champion;s.completed=true;s.phase='complete';s.post.pending=null;s.post.userSeries=null;addHistory(s,'champion',`${teamName(champion)} are the 2027 NBA Champions.`);const rec=teamRecord(s,s.teamId),archive=readLeague();archive.unshift({season:SEASON,champion,userTeam:s.teamId,record:`${rec.w}-${rec.l}`,userChampion,completedAt:new Date().toISOString(),events:s.history.slice(0,120)});if(archive.length>20)archive.length=20;saveLeague(archive);}

  function showChampionship(){
    const s=readSave();if(!s||s.champion!==s.teamId)return renderSeasonHub();const el=document.getElementById('seasonChampionship');const cards=teamPlayers(s.teamId);let index=0;if(championshipTimer)clearInterval(championshipTimer);
    const confetti=Array.from({length:90},(_,i)=>`<i class="champ-confetti" style="--x:${Math.random()*100}%;--d:${4+Math.random()*4}s;--delay:${-Math.random()*8}s;--r:${Math.random()*180}deg"></i>`).join('');
    el.innerHTML=confetti+`<div class="champ-shell"><div class="champ-kicker">NBA COURTSIDE · SEASON MODE</div><h1>2027 NBA Champions</h1><div class="champ-team">${esc(teamName(s.teamId))}</div><div class="champ-trophy"><div class="bowl"></div><div class="stem"></div><div class="base"></div></div><div id="champPlayerLabel" class="champ-player-label"></div><div id="champCardWrap" class="champ-card-wrap"></div><div class="champ-credits">82 games. Four playoff rounds. One champion.<br>Your championship roster.</div><button id="champFinish" class="champ-finish hidden" type="button">League History</button></div>`;
    const paint=()=>{const p=cards[index];document.getElementById('champPlayerLabel').textContent=`CHAMPION ${index+1} OF ${cards.length} · ${p.position} · ${p.name}`;document.getElementById('champCardWrap').innerHTML=cardMarkup(p,{eager:true});if(index===cards.length-1)document.getElementById('champFinish').classList.remove('hidden')};paint();
    championshipTimer=setInterval(()=>{if(index<cards.length-1){index++;paint()}else{clearInterval(championshipTimer);championshipTimer=null}},2600);
    document.getElementById('champFinish').onclick=()=>{if(championshipTimer)clearInterval(championshipTimer);championshipTimer=null;el.classList.add('hidden');currentTab='history';renderSeasonHub();showScreen('seasonHub')};el.classList.remove('hidden');
  }

  const start=()=>{installLaunch();const s=readSave();if(s&&document.getElementById('seasonModeBtn'))document.getElementById('seasonModeBtn').textContent='Continue Season'};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(start,120),{once:true});else setTimeout(start,120);
})();
