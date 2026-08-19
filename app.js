const img = id => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`;
const el = id => document.getElementById(id);
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
const chance = p => Math.random() < clamp(p,0,1);
const rand = (min,max) => Math.random()*(max-min)+min;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];

// Temporary exhibition inputs. Final historical card ratings can later be generated from the full stats model.
const userTemplate = [
  { id:'lal-dlo', name:'D’Angelo Russell', short:'Russell', pid:1626156, pos:'PG', rating:85, usage:23, threeRate:.48, twoPct:.545, threePct:.415, ftPct:.828, ast:6.3, reb:3.1, tov:2.1, stl:.9, blk:.5, def:68, orb:.4, post:55, handle:87 },
  { id:'lal-ar', name:'Austin Reaves', short:'Reaves', pid:1630559, pos:'SG', rating:84, usage:20, threeRate:.41, twoPct:.566, threePct:.367, ftPct:.853, ast:5.5, reb:4.3, tov:2.1, stl:.8, blk:.3, def:70, orb:.7, post:54, handle:84 },
  { id:'lal-lbj', name:'LeBron James', short:'LeBron', pid:2544, pos:'SF', rating:94, usage:29, threeRate:.29, twoPct:.593, threePct:.410, ftPct:.750, ast:8.3, reb:7.3, tov:3.5, stl:1.3, blk:.5, def:79, orb:.9, post:91, handle:93 },
  { id:'lal-rui', name:'Rui Hachimura', short:'Hachimura', pid:1629060, pos:'PF', rating:81, usage:18, threeRate:.31, twoPct:.590, threePct:.422, ftPct:.739, ast:1.2, reb:4.3, tov:.7, stl:.6, blk:.4, def:71, orb:1.0, post:76, handle:72 },
  { id:'lal-ad', name:'Anthony Davis', short:'Davis', pid:203076, pos:'C', rating:95, usage:27, threeRate:.08, twoPct:.581, threePct:.271, ftPct:.816, ast:3.5, reb:12.6, tov:2.1, stl:1.2, blk:2.3, def:94, orb:3.1, post:94, handle:76 },
  { id:'lal-prince', name:'Taurean Prince', short:'Prince', pid:1627752, pos:'F', rating:77, usage:14, threeRate:.58, twoPct:.500, threePct:.396, ftPct:.735, ast:1.5, reb:2.9, tov:.9, stl:.7, blk:.4, def:72, orb:.5, post:55, handle:70 },
  { id:'lal-vincent', name:'Gabe Vincent', short:'Vincent', pid:1629216, pos:'G', rating:74, usage:16, threeRate:.53, twoPct:.420, threePct:.300, ftPct:.800, ast:1.9, reb:.9, tov:.5, stl:.8, blk:.0, def:72, orb:.2, post:42, handle:79 },
  { id:'lal-hayes', name:'Jaxson Hayes', short:'Hayes', pid:1629637, pos:'C', rating:75, usage:11, threeRate:.01, twoPct:.727, threePct:.000, ftPct:.622, ast:.5, reb:3.0, tov:.6, stl:.5, blk:.4, def:72, orb:1.1, post:72, handle:48 }
];

const cpuTemplate = [
  { id:'bos-jrue', name:'Jrue Holiday', short:'Holiday', pid:201950, pos:'PG', rating:87, usage:16, threeRate:.48, twoPct:.517, threePct:.429, ftPct:.833, ast:4.8, reb:5.4, tov:1.8, stl:.9, blk:.8, def:90, orb:1.2, post:67, handle:87 },
  { id:'bos-white', name:'Derrick White', short:'White', pid:1628401, pos:'SG', rating:88, usage:19, threeRate:.54, twoPct:.539, threePct:.396, ftPct:.901, ast:5.2, reb:4.2, tov:1.5, stl:1.0, blk:1.2, def:88, orb:.7, post:52, handle:86 },
  { id:'bos-brown', name:'Jaylen Brown', short:'Brown', pid:1627759, pos:'SF', rating:91, usage:28, threeRate:.34, twoPct:.572, threePct:.354, ftPct:.703, ast:3.6, reb:5.5, tov:2.4, stl:1.2, blk:.5, def:84, orb:1.2, post:78, handle:86 },
  { id:'bos-tatum', name:'Jayson Tatum', short:'Tatum', pid:1628369, pos:'PF', rating:95, usage:30, threeRate:.44, twoPct:.542, threePct:.376, ftPct:.833, ast:4.9, reb:8.1, tov:2.5, stl:1.0, blk:.6, def:86, orb:.9, post:88, handle:91 },
  { id:'bos-kp', name:'Kristaps Porziņģis', short:'Porziņģis', pid:204001, pos:'C', rating:90, usage:24, threeRate:.38, twoPct:.603, threePct:.375, ftPct:.858, ast:2.0, reb:7.2, tov:1.6, stl:.7, blk:1.9, def:90, orb:1.5, post:88, handle:69 },
  { id:'bos-horford', name:'Al Horford', short:'Horford', pid:201143, pos:'F/C', rating:82, usage:12, threeRate:.62, twoPct:.621, threePct:.419, ftPct:.867, ast:2.6, reb:6.4, tov:.7, stl:.6, blk:1.0, def:85, orb:1.4, post:75, handle:64 },
  { id:'bos-pp', name:'Payton Pritchard', short:'Pritchard', pid:1630202, pos:'G', rating:80, usage:17, threeRate:.57, twoPct:.582, threePct:.385, ftPct:.821, ast:3.4, reb:3.2, tov:.7, stl:.5, blk:.1, def:70, orb:.9, post:44, handle:84 },
  { id:'bos-hauser', name:'Sam Hauser', short:'Hauser', pid:1630573, pos:'F', rating:79, usage:14, threeRate:.75, twoPct:.606, threePct:.424, ftPct:.895, ast:1.0, reb:3.5, tov:.5, stl:.5, blk:.3, def:73, orb:.6, post:49, handle:62 }
];

const zones = {
  top:'top of the arc', lwing:'left wing', rwing:'right wing', lcorner:'left corner', rcorner:'right corner',
  lelbow:'left elbow', relbow:'right elbow', lblock:'left block', rblock:'right block', paint:'paint', rim:'rim'
};
const perimeterZones = new Set(['top','lwing','rwing','lcorner','rcorner']);
const postZones = new Set(['lblock','rblock']);

function deepPlayers(template){
  return template.map((p,i)=>({
    ...p,image:img(p.pid),energy:100,onCourt:i<5,zone:'top',box:{pts:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,reb:0,ast:0,stl:0,blk:0,tov:0}
  }));
}

let state;
let autoTimer = null;
let boxTeam = 'user';

function freshState(){
  return {
    user:deepPlayers(userTemplate),cpu:deepPlayers(cpuTemplate),score:{user:0,cpu:0},quarter:1,clock:720,
    possession:'user',shotClock:24,controlMode:'both',autopilot:false,selectedId:null,targetMode:null,over:false,
    feed:[],started:false,sequence:{advantage:0,screen:false,postBoost:0,openPlayer:null,lastPasser:null,lastPassAge:99,defense:null},
    situation:'Tip off. Lakers possession.',secondary:'Tap any Lakers player to choose an action.',pendingAutoAdvance:false
  };
}

function init(){
  state=freshState();
  assignHalfCourt('user');assignHalfCourt('cpu');
  wire();renderPregame();renderGame();showScreen('pregameScreen');
}

function wire(){
  el('tipoffBtn').onclick=startGame; el('resetBtn').onclick=resetAll; el('againBtn').onclick=resetAll;
  el('simPossBtn').onclick=()=>simCurrentPossession(false);
  el('simMinuteBtn').onclick=()=>simTime(60);
  el('simQuarterBtn').onclick=()=>simToQuarter();
  el('autoBtn').onclick=toggleAutopilot;
  el('autoSubBtn').onclick=()=>{rotateTeam('user',true);renderGame();};
  el('boxBtn').onclick=openBox; el('finalBoxBtn').onclick=openBox; el('closeBoxBtn').onclick=()=>el('boxDialog').close();
  el('modeChip').onclick=()=>cycleControlMode();
  document.querySelectorAll('[data-mode]').forEach(btn=>btn.onclick=()=>setControlMode(btn.dataset.mode));
  document.querySelectorAll('.box-tabs button').forEach(btn=>btn.onclick=()=>{
    boxTeam=btn.dataset.team; document.querySelectorAll('.box-tabs button').forEach(b=>b.classList.toggle('active',b===btn));renderBox();
  });
}

function startGame(){
  state.started=true;
  state.possession = Math.random()<.5?'user':'cpu';
  beginPossession(state.possession,true);
  showScreen('gameScreen');
  pushFeed(null,'TIP OFF','The exhibition is underway.');
  renderGame();
  scheduleIfUncontrolled();
}
function resetAll(){stopAutopilot();state=freshState();assignHalfCourt('user');assignHalfCourt('cpu');renderPregame();renderGame();showScreen('pregameScreen');}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));el(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}

function setControlMode(mode){
  state.controlMode=mode;
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  if(!state.autopilot) scheduleIfUncontrolled();
  renderGame();
}
function cycleControlMode(){const order=['both','offense','defense'];setControlMode(order[(order.indexOf(state.controlMode)+1)%order.length]);}
function manualEligible(){
  if(state.autopilot||state.over)return false;
  if(state.controlMode==='both')return true;
  if(state.controlMode==='offense')return state.possession==='user';
  return state.possession==='cpu';
}
function modeLabel(){return state.controlMode==='both'?'PLAY BOTH':state.controlMode==='offense'?'OFFENSE ONLY':'DEFENSE ONLY';}

function line(team){return state[team].filter(p=>p.onCourt);}
function bench(team){return state[team].filter(p=>!p.onCourt);}
function findPlayer(team,id){return state[team].find(p=>p.id===id);}
function opponent(team){return team==='user'?'cpu':'user';}
function teamCode(team){return team==='user'?'LAL':'BOS';}
function weightedChoice(items,fn){let total=0;const ws=items.map(x=>{const w=Math.max(.001,fn(x));total+=w;return w;});let r=Math.random()*total;for(let i=0;i<items.length;i++){r-=ws[i];if(r<=0)return items[i];}return items[items.length-1];}

function assignHalfCourt(team){
  const five=line(team); if(five.length<5)return;
  const base=['top','rwing','lwing','rcorner','lblock'];
  five.forEach((p,i)=>p.zone=base[i]);
  const big=five.reduce((a,b)=>((b.post+b.reb*2)>(a.post+a.reb*2)?b:a),five[0]); big.zone='lblock';
  const handler=bestInitialHandler(five); handler.zone='top';
  const remaining=five.filter(p=>p!==handler&&p!==big);
  ['rwing','lwing','rcorner'].forEach((z,i)=>{if(remaining[i])remaining[i].zone=z;});
}
function bestInitialHandler(five){return weightedChoice(five,p=>p.handle+p.ast*4+p.usage*1.2);}
function currentBallhandler(team=state.possession){return findPlayer(team,state.ballhandlerId);}
function matchupIndex(team,p){return Math.max(0,line(team).findIndex(x=>x.id===p.id));}
function matchedDefender(offTeam,p){const d=line(opponent(offTeam));return d[clamp(matchupIndex(offTeam,p),0,d.length-1)]||d[0];}

function beginPossession(team,keepClock=false){
  state.possession=team;state.shotClock=24;state.selectedId=null;state.targetMode=null;
  state.sequence={advantage:0,screen:false,postBoost:0,openPlayer:null,lastPasser:null,lastPassAge:99,defense:null};
  assignHalfCourt(team); assignHalfCourt(opponent(team));
  const h=bestInitialHandler(line(team));state.ballhandlerId=h.id;h.zone='top';
  state.situation=`${h.short} has it at ${zones[h.zone]}.`;
  state.secondary=team==='user'?'Tap the ball handler or shape the possession off-ball.':`${matchedDefender(team,h).short} has the primary matchup.`;
  renderGame();
}

function renderPregame(){
  el('pregameUserRoster').innerHTML=state.user.map(miniPlayer).join('');
  el('pregameCpuRoster').innerHTML=state.cpu.map(miniPlayer).join('');
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.controlMode));
}
function miniPlayer(p){return `<div class="mini-player"><div class="mini-face"><img src="${p.image}" alt="${p.name}" onerror="this.style.opacity=.12"></div><span>${p.short}</span></div>`;}

function renderGame(){
  if(!state)return;
  el('userScore').textContent=state.score.user;el('cpuScore').textContent=state.score.cpu;
  el('quarterLabel').textContent=qLabel();el('clockLabel').textContent=formatClock(state.clock);el('possessionLabel').textContent=`${teamCode(state.possession)} BALL`;
  el('shotClock').textContent=Math.max(0,Math.ceil(state.shotClock));
  el('shotClock').classList.toggle('warning',state.shotClock<=8&&state.shotClock>4);el('shotClock').classList.toggle('urgent',state.shotClock<=4);
  el('situationLine').textContent=state.situation;el('secondaryLine').textContent=state.secondary;
  el('modeChip').textContent=modeLabel();
  const phase=el('phaseChip');
  const offense=state.possession==='user';
  phase.textContent=state.autopilot?'AUTOPILOT':offense?'OFFENSE':'DEFENSE';phase.className=`phase-chip ${state.autopilot?'auto':offense?'offense':'defense'}`;
  el('fiveEyebrow').textContent=`YOUR FIVE — ${offense?'OFFENSE':'DEFENSE'}`;
  el('fiveTitle').textContent=state.autopilot?'Watching the possession':manualEligible()?'Make the next decision':`CPU is handling ${offense?'offense':'defense'}`;
  el('possessionArrow').textContent=offense?'DEFENDING':'ON OFFENSE';
  renderFive();renderOpponentFive();renderActions();renderBench();renderFeed();renderBox();renderAuto();
}
function qLabel(){if(state.quarter<=4)return ['1ST','2ND','3RD','4TH'][state.quarter-1];return `OT${state.quarter===5?'':state.quarter-4}`;}
function formatClock(sec){sec=Math.max(0,Math.ceil(sec));return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}

function renderFive(){
  const five=line('user');const offense=state.possession==='user';const cpuHandler=currentBallhandler('cpu');
  let guarding=null;if(!offense&&cpuHandler)guarding=line('user')[matchupIndex('cpu',cpuHandler)];
  el('onCourtFive').innerHTML=five.map(p=>{
    const isBall=offense&&p.id===state.ballhandlerId;const isGuard=!offense&&guarding&&p.id===guarding.id;const sel=p.id===state.selectedId;
    return `<button class="court-player ${isBall?'ball':''} ${isGuard?'guard':''} ${sel?'selected':''}" data-player="${p.id}">
      <img src="${p.image}" alt="${p.name}" onerror="this.style.opacity=.12">
      <div class="rating-bubble">${p.rating}</div>${isBall?'<div class="ball-bubble">●</div>':''}${isGuard?'<div class="guard-bubble">ON BALL</div>':''}
      <div class="court-copy"><div class="court-name">${p.short}</div><div class="court-meta">${p.pos} · ${Math.round(p.energy)}%</div><div class="court-location">${offense?zones[p.zone].toUpperCase():(isGuard?'PRIMARY MATCHUP':'HELP SIDE')}</div><div class="energy-line"><span style="width:${p.energy}%"></span></div></div>
    </button>`;
  }).join('');
  el('onCourtFive').querySelectorAll('[data-player]').forEach(btn=>btn.onclick=()=>selectPlayer(btn.dataset.player));
  el('actionHint').textContent=offense?'Orange = ball handler · tap anyone':'Red = on-ball defender · tap anyone';
}
function renderOpponentFive(){
  const five=line('cpu');
  el('opponentFive').innerHTML=five.map(p=>`<div class="opp-player ${state.possession==='cpu'&&p.id===state.ballhandlerId?'ball':''}"><div class="opp-face"><img src="${p.image}" alt="${p.name}" onerror="this.style.opacity=.12"></div><span>${p.short}</span></div>`).join('');
  const h=state.possession==='cpu'?currentBallhandler('cpu'):null;
  el('opponentTitle').textContent=h?`${h.short} has the ball`:'Matchups';
  const threat=el('cpuThreat');
  if(h){threat.classList.remove('hidden');threat.innerHTML=`<img src="${h.image}" alt="${h.name}"><span><strong>${h.short}</strong> · ${zones[h.zone]}</span>`;}else threat.classList.add('hidden');
}
function renderBench(){el('benchStrip').innerHTML=bench('user').map(p=>`<div class="bench-card"><img src="${p.image}" alt="${p.name}" onerror="this.style.opacity=.12"><div>${p.short}<span>${p.pos} · ${Math.round(p.energy)}% ENERGY</span></div></div>`).join('');}
function renderFeed(){
  el('gameFeed').innerHTML=state.feed.slice(0,8).map(f=>`<div class="feed-item">${f.player?`<img src="${f.player.image}" alt="${f.player.short}">`:'<div class="feed-placeholder"></div>'}<div><strong>${f.title}</strong><span>${f.sub}</span></div><span class="feed-score">${f.score}</span></div>`).join('')||'<div class="prototype-note">Game events will appear here.</div>';
}

function selectPlayer(id){
  if(!manualEligible()){state.secondary=state.autopilot?'Stop Autopilot to take control.':`Current control mode is ${modeLabel()}.`;renderGame();return;}
  if(state.possession==='user'){
    if(state.targetMode==='pass')return completePass(id);
    state.selectedId=id;state.targetMode=null;
  }else state.selectedId=id;
  renderGame();
}

function renderActions(){
  const av=el('selectedAvatar'),grid=el('actionButtons');grid.innerHTML='';
  if(!manualEligible()){
    av.innerHTML='';el('actionKicker').textContent=state.autopilot?'AUTOPILOT RUNNING':'CPU CONTROL';el('actionTitle').textContent=state.autopilot?'Watch or take over':'Waiting for your side';
    el('actionSub').textContent=state.autopilot?'The possession is advancing automatically. You can stop it whenever your control mode allows.':'The game will hand control back at the next eligible possession.';return;
  }
  if(state.targetMode==='pass'){
    const h=currentBallhandler('user');av.innerHTML=`<img src="${h.image}" alt="${h.name}">`;el('actionKicker').textContent='PASS';el('actionTitle').textContent='Choose the receiver';el('actionSub').textContent='Tap one of the other four portraits.';return;
  }
  if(!state.selectedId){av.innerHTML='';el('actionKicker').textContent='SELECT A PLAYER';el('actionTitle').textContent='Tap one of your five';el('actionSub').textContent=state.possession==='user'?'Ball-handler and off-ball players have different options.':'Choose the defender you want to influence.';return;}
  const p=findPlayer('user',state.selectedId);av.innerHTML=`<img src="${p.image}" alt="${p.name}">`;
  const actions=state.possession==='user'?offenseActions(p):defenseActions(p);
  el('actionKicker').textContent=state.possession==='user'?(p.id===state.ballhandlerId?'BALL HANDLER':'OFF BALL'):(isOnBallDefender(p)?'ON-BALL DEFENSE':'OFF-BALL DEFENSE');
  el('actionTitle').textContent=p.short;el('actionSub').textContent=state.possession==='user'?`${zones[p.zone]} · choose an action`:'Your choice shapes Boston’s next read.';
  grid.innerHTML=actions.map((a,i)=>`<button class="action-btn ${state.possession==='user'?(i===0?'primary-action':''):'def-action'}" data-action="${a.key}"><strong>${a.label}</strong><span>${a.desc}</span></button>`).join('');
  grid.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=()=>performAction(btn.dataset.action,p));
}

function offenseActions(p){
  const ball=p.id===state.ballhandlerId;
  if(!ball){
    if(p.post>=78)return [A('postup','POST UP','5 sec · establish position'),A('screen','SET SCREEN','4 sec · free the handler'),A('cut','CUT','3 sec · attack the lane'),A('space','CREATE SPACE','4 sec · relocate to shooting space')];
    return [A('cut','CUT','3 sec · attack open space'),A('space','CREATE SPACE','4 sec · find a better spot'),A('screen','SET SCREEN','4 sec · help the ball handler'),A('callball','CALL FOR BALL','3 sec · ask for the pass')];
  }
  if(postZones.has(p.zone))return [A('backdown','BACK DOWN','4 sec · improve post position'),A('hook','HOOK','2 sec · shoot over the shoulder'),A('fade','FADE','3 sec · create separation'),A('pass','PASS','2 sec · choose a teammate')];
  if(p.zone==='rim'||p.zone==='paint')return [A('finish','FINISH','2 sec · attack the rim'),A('floater','FLOATER','2 sec · touch shot in traffic'),A('kickout','KICK OUT','2 sec · find a shooter'),A('reset','RESET','4 sec · pull it back outside')];
  if(p.zone==='lelbow'||p.zone==='relbow')return [A('pullup','PULL-UP','2 sec · midrange jumper'),A('drive','DRIVE','4 sec · get downhill'),A('pass','PASS','2 sec · choose a teammate'),A('reset','RESET','3 sec · return to the top')];
  return [A('drive','DRIVE','4 sec · attack the paint'),A('shoot3','SHOOT 3','2 sec · take the jumper'),A('pass','PASS','2 sec · choose a teammate'),A('callscreen','CALL SCREEN','4 sec · create an advantage')];
}
function defenseActions(p){
  return isOnBallDefender(p)
    ? [A('pressure','PRESSURE','4 sec · crowd the ball'),A('sag','SAG OFF','4 sec · protect the drive'),A('forceleft','FORCE LEFT','4 sec · shade the handler'),A('double','DOUBLE','4 sec · send help now')]
    : [A('deny','DENY','4 sec · take away the pass'),A('help','HELP','4 sec · shrink the floor'),A('stayhome','STAY HOME','4 sec · protect your shooter'),A('boxout','BOX OUT','4 sec · prepare for the miss')];
}
function A(key,label,desc){return {key,label,desc};}
function isOnBallDefender(p){if(state.possession!=='cpu')return false;const h=currentBallhandler('cpu');return h&&line('user')[matchupIndex('cpu',h)]?.id===p.id;}

function performAction(action,p){
  if(state.over||!manualEligible())return;
  if(state.possession==='user')performOffenseAction(action,p);else performDefenseAction(action,p);
}

function performOffenseAction(action,p){
  const ball=p.id===state.ballhandlerId;
  if(action==='pass'){state.targetMode='pass';state.secondary='Tap the teammate you want to receive the pass.';renderGame();return;}
  if(!ball){offBallAction(action,p);return;}
  if(action==='drive'){
    if(!advanceClocks(4,false))return;const d=matchedDefender('user',p);const beat=(p.handle-d.def+state.sequence.advantage*100)/100;
    if(chance(.07+Math.max(0,-beat)*.08)){turnover('user',p,`${d.short} strips ${p.short} on the drive.`);return;}
    p.zone=chance(.56+beat*.12)?'paint':pick(['lelbow','relbow']);state.sequence.advantage=clamp(state.sequence.advantage+.035+beat*.04,-.03,.12);
    state.situation=`${p.short} gets downhill into the ${zones[p.zone]}.`;state.secondary=state.sequence.advantage>.06?'The defense is collapsing.':'Boston stays attached.';
  } else if(action==='shoot3'){resolveShot('user',p,'three',2);return;
  } else if(action==='callscreen'){
    if(!advanceClocks(4,false))return;const screener=weightedChoice(line('user').filter(x=>x.id!==p.id),x=>x.post+x.reb*2);screener.zone='top';state.sequence.screen=true;state.sequence.advantage=clamp(state.sequence.advantage+.055,0,.12);
    state.situation=`${screener.short} comes up to screen for ${p.short}.`;state.secondary='Boston has to navigate the pick.';
  } else if(action==='backdown'){
    if(!advanceClocks(4,false))return;state.sequence.postBoost=clamp(state.sequence.postBoost+.06,0,.14);state.situation=`${p.short} backs his defender deeper toward the rim.`;state.secondary='Help is starting to lean toward the post.';
  } else if(action==='hook'){resolveShot('user',p,'hook',2);return;
  } else if(action==='fade'){resolveShot('user',p,'fade',3);return;
  } else if(action==='finish'){resolveShot('user',p,'rim',2);return;
  } else if(action==='floater'){resolveShot('user',p,'floater',2);return;
  } else if(action==='kickout'){autoKickout(p);return;
  } else if(action==='reset'){
    if(!advanceClocks(action==='reset'?3:4,false))return;p.zone='top';state.sequence.advantage=Math.max(0,state.sequence.advantage-.02);state.situation=`${p.short} pulls it back to the top of the arc.`;state.secondary='The floor resets with less time to work.';
  } else if(action==='pullup'){resolveShot('user',p,'mid',2);return;}
  state.selectedId=null;state.sequence.lastPassAge+=4;renderGame();
}

function offBallAction(action,p){
  const h=currentBallhandler('user');
  const time={postup:5,screen:4,cut:3,space:4,callball:3}[action]||4;if(!advanceClocks(time,false))return;
  if(action==='postup'){
    p.zone=chance(.5)?'lblock':'rblock';state.sequence.openPlayer=p.id;state.situation=`${p.short} establishes position on the ${zones[p.zone]}.`;
    if(chance(passSuccess(h,p)*.66)){moveBall(p,h);state.secondary=`${h.short} feeds the post. ${p.short} has it.`;}else{maybeCpuSwing(h,p);state.secondary='The passing lane is crowded, so the ball stays outside.';}
  } else if(action==='screen'){
    p.zone='top';state.sequence.screen=true;state.sequence.advantage=clamp(state.sequence.advantage+.045,0,.12);state.situation=`${p.short} sets a screen for ${h.short}.`;state.secondary='The defense has to choose how to cover it.';
  } else if(action==='cut'){
    p.zone=chance(.55)?'rim':'paint';state.situation=`${p.short} cuts hard toward the ${zones[p.zone]}.`;
    if(chance(passSuccess(h,p)*.72)){moveBall(p,h);state.sequence.advantage=.075;state.secondary=`${h.short} finds the cutter. ${p.short} catches in scoring range.`;}else{state.secondary='Boston takes away the window and the ball stays outside.';maybeCpuSwing(h,p);}
  } else if(action==='space'){
    p.zone=bestSpacingZone();state.sequence.openPlayer=p.id;state.situation=`${p.short} relocates to the ${zones[p.zone]}.`;state.secondary='The floor stretches and a new passing angle opens.';
    if(chance(passSuccess(h,p)*.34)){moveBall(p,h);state.sequence.advantage=.045;state.secondary=`${h.short} swings it over. ${p.short} catches with space.`;}
  } else if(action==='callball'){
    state.situation=`${p.short} calls for the ball at the ${zones[p.zone]}.`;
    if(chance(passSuccess(h,p)*.78)){moveBall(p,h);state.secondary=`${h.short} gives it up. ${p.short} now controls the possession.`;}else{state.secondary='The defender denies the pass. The ball stays where it is.';}
  }
  state.selectedId=null;state.sequence.lastPassAge+=time;renderGame();
}
function bestSpacingZone(){const occupied=new Set(line('user').map(p=>p.zone));const options=['lcorner','rcorner','lwing','rwing','top'].filter(z=>!occupied.has(z));return options.length?pick(options):pick(['lcorner','rcorner','lwing','rwing']);}
function maybeCpuSwing(h,excluded){if(chance(.24)){const opts=line('user').filter(x=>x.id!==h.id&&x.id!==excluded.id&&perimeterZones.has(x.zone));if(opts.length){const t=weightedChoice(opts,x=>x.threePct*100+x.ast);moveBall(t,h);state.secondary=`${h.short} swings it to ${t.short} instead.`;}}}
function passSuccess(from,to){const d=matchedDefender('user',to);return clamp(.55+(from.ast-3)*.025+(from.handle-78)*.006-(d.def-78)*.004, .32,.9);}
function moveBall(to,from){state.sequence.lastPasser=from?.id||null;state.sequence.lastPassAge=0;state.ballhandlerId=to.id;state.selectedId=null;}
function completePass(targetId){
  const h=currentBallhandler('user');const t=findPlayer('user',targetId);if(!t||t.id===h.id){state.secondary='Choose one of the other four players.';renderGame();return;}
  if(!advanceClocks(2,false))return;const d=matchedDefender('user',t);
  if(chance(clamp(.045+(d.def-75)*.002-(h.ast-4)*.006,.02,.15))){turnover('user',h,`${d.short} jumps the passing lane.`);return;}
  moveBall(t,h);state.targetMode=null;state.situation=`${t.short} receives it at the ${zones[t.zone]}.`;state.secondary=`${h.short} moves it on with ${state.shotClock} on the shot clock.`;renderGame();
}
function autoKickout(from){
  if(!advanceClocks(2,false))return;const targets=line('user').filter(x=>x.id!==from.id&&perimeterZones.has(x.zone));const t=targets.length?weightedChoice(targets,x=>x.threePct*100+(state.sequence.openPlayer===x.id?12:0)):line('user').find(x=>x.id!==from.id);
  moveBall(t,from);state.sequence.advantage=clamp(state.sequence.advantage+.04,0,.12);state.situation=`${from.short} kicks it out to ${t.short} at the ${zones[t.zone]}.`;state.secondary='Boston is rotating out to the shooter.';renderGame();
}

function performDefenseAction(action,p){
  const buzzerAction=state.shotClock<=4;
  if(!advanceClocks(4,buzzerAction))return;
  state.sequence.defense={action,defenderId:p.id};
  const labels={pressure:`${p.short} crowds the ball.`,sag:`${p.short} drops a step toward the paint.`,forceleft:`${p.short} shades the handler left.`,double:`${p.short} commits to the double team.`,deny:`${p.short} denies his matchup.`,help:`${p.short} sinks into help position.`,stayhome:`${p.short} stays glued to his shooter.`,boxout:`${p.short} prepares to box out.`};
  state.situation=labels[action]||'The Lakers adjust defensively.';state.secondary='Boston reads the coverage.';state.selectedId=null;
  cpuOffensiveRead(action,p);renderGame();
}

function cpuOffensiveRead(defAction,defender){
  if(state.over||state.possession!=='cpu')return;
  const h=currentBallhandler('cpu');if(!h)return;
  const lowClock=state.shotClock<=8;
  if(state.shotClock<=0){const type=chooseCpuShotType(h,defAction,isOnBallDefender(defender));resolveShot('cpu',h,type,0,{clockAlreadySpent:true,defAction,defender});return;}
  const onBall=isOnBallDefender(defender);
  let turnoverP=.035+(h.tov/Math.max(1,h.ast+h.tov))*.06;
  if(defAction==='pressure'&&onBall)turnoverP+=.045;if(defAction==='double')turnoverP+=.055;if(defAction==='forceleft'&&onBall)turnoverP+=.02;
  if(chance(turnoverP)){const thief=defender||matchedDefender('cpu',h);if(chance(.55))thief.box.stl++;turnover('cpu',h,`${teamCode('user')} forces ${h.short} into a turnover.`);return;}
  if(defAction==='double'&&onBall&&state.shotClock>5){
    const opts=line('cpu').filter(x=>x.id!==h.id);const t=weightedChoice(opts,x=>x.threePct*90+x.rating+(defAction==='deny'?-10:0));moveCpuBall(t,h);state.sequence.advantage=.055;state.situation=`${h.short} beats the double with a pass to ${t.short}.`;state.secondary=`${t.short} catches at ${zones[t.zone]}.`;return;
  }
  const shootUrgency=lowClock?.76:.27+(h.usage-18)*.008;
  if(chance(shootUrgency)){
    const type=chooseCpuShotType(h,defAction,onBall);resolveShot('cpu',h,type,0,{clockAlreadySpent:true,defAction,defender});return;
  }
  if(chance(.46)){
    const opts=line('cpu').filter(x=>x.id!==h.id);let t=weightedChoice(opts,x=>x.ast*3+x.usage+x.rating*.35);
    if(defAction==='deny'&&!onBall&&matchedOffensivePlayer(defender)?.id===t.id){t=opts.find(x=>x.id!==t.id)||t;}
    moveCpuBall(t,h);state.situation=`${h.short} moves it to ${t.short} at the ${zones[t.zone]}.`;state.secondary='Boston keeps the possession moving.';
  }else{
    h.zone=chance(.55)?'paint':pick(['lelbow','relbow']);state.sequence.advantage=defAction==='sag'?-0.02:.025;state.situation=`${h.short} probes into the ${zones[h.zone]}.`;state.secondary='The defense has another decision to make.';
  }
}
function matchedOffensivePlayer(defender){const idx=matchupIndex('user',defender);return line('cpu')[idx]||null;}
function moveCpuBall(to,from){state.sequence.lastPasser=from?.id||null;state.sequence.lastPassAge=0;state.ballhandlerId=to.id;}
function chooseCpuShotType(p,defAction,onBall){
  if(p.zone==='paint'||p.zone==='rim')return 'rim';if(postZones.has(p.zone)&&p.post>=76)return chance(.5)?'hook':'fade';
  let r=p.threeRate;if(defAction==='sag'&&onBall)r+=.22;if(defAction==='pressure'&&onBall)r-=.12;return chance(clamp(r,.12,.8))?'three':'mid';
}

function resolveShot(team,p,type,time=2,opts={}){
  if(!opts.clockAlreadySpent&&!advanceClocks(time,true))return;
  const d=opts.defender||matchedDefender(team,p);const fatigue=(100-p.energy)*.0011;
  let base,points=2,label='JUMPER';
  if(type==='three'){base=p.threePct;points=3;label='THREE';p.box.tpa++;}
  else if(type==='rim'){base=clamp(p.twoPct+.035+(p.rating-82)*.002, .42,.77);label=p.post>=82?'AT THE RIM':'DRIVE';}
  else if(type==='hook'){base=clamp(p.twoPct-.045+(p.post-75)*.003+state.sequence.postBoost,.34,.72);label='HOOK';}
  else if(type==='fade'){base=clamp(.39+(p.post-70)*.0035+state.sequence.postBoost*.65,.34,.61);label='FADE';}
  else if(type==='floater'){base=clamp(p.twoPct-.065+(p.handle-75)*.0015,.33,.62);label='FLOATER';}
  else {base=clamp(p.twoPct-.07+(p.rating-80)*.0017,.33,.59);label='PULL-UP';}
  let contest=(d.def-76)*(type==='three'?0.0016:0.0018)+fatigue;
  contest-=state.sequence.advantage; if(state.sequence.openPlayer===p.id)contest-=.035;if(state.sequence.screen)contest-=.018;
  const defAction=opts.defAction||state.sequence.defense?.action;
  if(team==='cpu'){
    if(defAction==='pressure')contest+=.035;if(defAction==='sag'&&type==='three')contest-=.04;if(defAction==='sag'&&type==='rim')contest+=.02;
    if(defAction==='double')contest+=.07;if(defAction==='help'&&type==='rim')contest+=.045;if(defAction==='stayhome'&&type==='three')contest+=.025;
  }
  p.box.fga++;
  const blockChance=type==='rim'||type==='hook'?clamp(.018+d.blk*.018+(d.def-78)*.001,.01,.13):.006;
  if(chance(blockChance)){
    d.box.blk++;pushFeed(d,'BLOCK',`${d.short} rejects ${p.short}.`);state.situation=`${d.short} blocks ${p.short} at the rim.`;state.secondary='The ball is loose under the basket.';handleRebound(team,p,opts);return;
  }
  const made=chance(clamp(base-contest,type==='three'?.19:.28,type==='three'?.58:.78));
  if(made){p.box.fgm++;if(type==='three')p.box.tpm++;score(team,p,points);maybeAssist(team,p);pushFeed(p,label,`${p.short} scores from ${zones[p.zone]}.`);state.situation=`${p.short} knocks it down from the ${zones[p.zone]}.`;state.secondary=`${teamCode(team)} scores ${points}.`;
    if((type==='rim'||type==='hook')&&chance(.075)){const ft=chance(p.ftPct)?1:0;p.box.fta++;if(ft){p.box.ftm++;score(team,p,1,true);}state.secondary=ft?'And-one. Free throw good.':'And-one chance, but the free throw misses.';}
    switchPossession();
  }else{pushFeed(p,'MISS',`${p.short} misses from the ${zones[p.zone]}.`);state.situation=`${p.short} misses from the ${zones[p.zone]}.`;state.secondary='Rebound in play.';handleRebound(team,p,opts);}
  renderGame();
}
function maybeAssist(team,shooter){if(!state.sequence.lastPasser||state.sequence.lastPassAge>8)return;const passer=findPlayer(team,state.sequence.lastPasser);if(passer&&passer.id!==shooter.id&&chance(.78))passer.box.ast++;}
function score(team,p,pts,free=false){state.score[team]+=pts;p.box.pts+=pts;}
function handleRebound(offTeam,shooter,opts={}){
  if(state.clock<=0){state.situation='The horn sounds at the end of the period.';state.secondary='Quarter complete.';endQuarter();return;}
  const off=line(offTeam),def=line(opponent(offTeam));let offRate=.22+(off.reduce((s,p)=>s+p.orb,0)-def.reduce((s,p)=>s+p.reb*.18,0))*.006;
  if(state.sequence.defense?.action==='boxout'&&offTeam==='cpu')offRate-=.08;offRate=clamp(offRate,.11,.36);
  if(chance(offRate)){
    const r=weightedChoice(off,p=>.2+p.orb);r.box.reb++;state.ballhandlerId=r.id;r.zone='paint';state.shotClock=Math.min(14,state.clock);state.sequence.advantage=.025;state.sequence.lastPasser=null;state.situation=`${r.short} grabs the offensive rebound.`;state.secondary=`Shot clock resets to ${Math.ceil(state.shotClock)}.`;pushFeed(r,'OFFENSIVE BOARD',`${teamCode(offTeam)} keeps the possession.`);
  }else{
    const r=weightedChoice(def,p=>.5+p.reb);r.box.reb++;pushFeed(r,'REBOUND',`${r.short} ends the possession.`);switchPossession();
  }
}
function turnover(team,p,text){p.box.tov++;pushFeed(p,'TURNOVER',text);state.situation=text;state.secondary=`${teamCode(opponent(team))} takes possession.`;switchPossession();renderGame();}
function shotClockViolation(){const h=currentBallhandler(state.possession);if(h)h.box.tov++;pushFeed(h,'24 SECONDS','Shot clock violation.');state.situation='Shot clock violation.';state.secondary=`${teamCode(opponent(state.possession))} ball.`;switchPossession();}

function advanceClocks(seconds,shotAttempt){
  if(state.over)return false;const actual=Math.min(seconds,state.clock);state.clock=Math.max(0,state.clock-actual);state.shotClock=Math.max(0,state.shotClock-actual);applyFatigue(actual);state.sequence.lastPassAge+=actual;
  if(!shotAttempt&&state.shotClock<=0){shotClockViolation();return false;}
  if(state.clock<=0&&!shotAttempt){endQuarter();return false;}
  return true;
}
function applyFatigue(sec){
  ['user','cpu'].forEach(team=>{state[team].forEach(p=>{if(p.onCourt)p.energy=clamp(p.energy-sec*.032,36,100);else p.energy=clamp(p.energy+sec*.018,36,100);});});
}
function switchPossession(){
  if(state.clock<=0){endQuarter();return;}
  rotateTeam('user');rotateTeam('cpu');beginPossession(opponent(state.possession));scheduleIfUncontrolled();
}
function endQuarter(){
  state.selectedId=null;state.targetMode=null;
  if(state.quarter>=4&&state.score.user!==state.score.cpu){finishGame();return;}
  state.quarter++;state.clock=state.quarter<=4?720:300;const next=state.quarter%2===0?'cpu':'user';beginPossession(next);
  pushFeed(null,state.quarter<=4?`${qLabel()} QUARTER`:'OVERTIME','A new period begins.');
}
function finishGame(){state.over=true;stopAutopilot(false);renderGame();const u=state.score.user,c=state.score.cpu;el('finalScore').textContent=`LAL ${u} — ${c} BOS`;el('finalSummary').textContent=u>c?'Los Angeles wins the exhibition.':'Boston wins the exhibition.';renderLeaders();showScreen('finalScreen');}

function rotateTeam(team,force=false){
  const on=line(team),off=bench(team);if(!off.length)return;let tired=on.slice().sort((a,b)=>a.energy-b.energy)[0];
  if(!force&&tired.energy>62)return;const replacement=off.slice().sort((a,b)=>(b.energy+b.rating*.1)-(a.energy+a.rating*.1))[0];if(!replacement)return;
  tired.onCourt=false;replacement.onCourt=true;replacement.zone=tired.zone;pushFeed(replacement,'SUBSTITUTION',`${replacement.short} checks in for ${tired.short}.`);
  if(state.ballhandlerId===tired.id){state.ballhandlerId=replacement.id;replacement.zone='top';}
}

function simCurrentPossession(silent=true){
  if(state.over)return;const startTeam=state.possession;let guard=0;while(!state.over&&state.possession===startTeam&&guard++<12)autoBeat(true);renderGame();scheduleIfUncontrolled();
}
function simTime(seconds){
  if(state.over)return;stopAutopilot(false);const q=state.quarter,target=Math.max(0,state.clock-seconds);let guard=0;while(!state.over&&state.quarter===q&&state.clock>target&&guard++<60)simCurrentPossession(true);renderGame();scheduleIfUncontrolled();
}
function simToQuarter(){if(state.over)return;stopAutopilot(false);const q=state.quarter;let guard=0;while(!state.over&&state.quarter===q&&guard++<140)simCurrentPossession(true);renderGame();scheduleIfUncontrolled();}

function autoBeat(silent=false){
  if(state.over)return;const team=state.possession,h=currentBallhandler(team);if(!h)return;
  const preClock=state.shotClock;
  const intentToShoot=preClock<=8||chance(.34+(h.usage-20)*.007);
  const time=Math.min(Math.ceil(rand(3,6)),Math.max(1,state.shotClock),Math.max(1,state.clock));
  if(!advanceClocks(time,intentToShoot))return;
  const turnoverP=.025+h.tov*.008+(100-h.energy)*.0005;
  if(!intentToShoot&&chance(turnoverP)){turnover(team,h,`${h.short} turns it over under pressure.`);return;}
  if(intentToShoot||state.shotClock<=0){
    let type;if(h.zone==='paint'||h.zone==='rim')type='rim';else if(postZones.has(h.zone)&&h.post>78)type=chance(.48)?'hook':'fade';else type=chance(h.threeRate)?'three':'mid';resolveShot(team,h,type,0,{clockAlreadySpent:true});return;
  }
  if(chance(.53)){
    const opts=line(team).filter(x=>x.id!==h.id);const t=weightedChoice(opts,x=>x.usage+x.ast*2+x.rating*.25);if(team==='user')moveBall(t,h);else moveCpuBall(t,h);
    if(chance(.28))t.zone=bestTeamSpacingZone(team,t);
    state.situation=`${h.short} swings it to ${t.short} at the ${zones[t.zone]}.`;state.secondary=`${Math.ceil(state.shotClock)} on the shot clock.`;
  }else{
    h.zone=chance(.58)?'paint':pick(['lelbow','relbow']);state.sequence.advantage=clamp(state.sequence.advantage+.02,0,.08);state.situation=`${h.short} probes into the ${zones[h.zone]}.`;state.secondary='The defense shifts toward the ball.';
  }
  if(!silent)renderGame();
}
function bestTeamSpacingZone(team,p){const occupied=new Set(line(team).filter(x=>x.id!==p.id).map(x=>x.zone));const opts=['lcorner','rcorner','lwing','rwing','top'].filter(z=>!occupied.has(z));return opts.length?pick(opts):p.zone;}

function toggleAutopilot(){
  if(state.autopilot){stopAutopilot(true);return;}
  state.autopilot=true;state.selectedId=null;state.targetMode=null;el('autoBtn').textContent='TAKE CONTROL';el('autoBtn').classList.add('running');el('autoStatus').classList.remove('hidden');el('autoStatus').textContent='Autopilot is running. Stop it whenever you want.';renderGame();
  autoTimer=setInterval(()=>{if(state.over){stopAutopilot(false);return;}autoBeat(false);},620);
}
function stopAutopilot(userInitiated=true){
  if(autoTimer){clearInterval(autoTimer);autoTimer=null;}state.autopilot=false;
  if(el('autoBtn')){el('autoBtn').textContent='START AUTOPILOT';el('autoBtn').classList.remove('running');}
  if(el('autoStatus'))el('autoStatus').classList.add('hidden');
  if(userInitiated){
    if(manualEligible()){state.secondary='You have control of the current possession.';}
    else{state.secondary=`${modeLabel()} will hand control back at the next eligible possession.`;scheduleIfUncontrolled();}
    renderGame();
  }
}
function renderAuto(){
  el('autoBtn').textContent=state.autopilot?'TAKE CONTROL':'START AUTOPILOT';el('autoBtn').classList.toggle('running',state.autopilot);
  el('autoStatus').classList.toggle('hidden',!state.autopilot);if(state.autopilot)el('autoStatus').textContent='Autopilot is playing both teams. Tap TAKE CONTROL whenever you want.';
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.controlMode));
}
function scheduleIfUncontrolled(){
  if(!state.started||state.over||state.autopilot||manualEligible()||state.pendingAutoAdvance)return;
  state.pendingAutoAdvance=true;setTimeout(()=>{state.pendingAutoAdvance=false;if(!state.over&&!state.autopilot&&!manualEligible()){simCurrentPossession(true);}renderGame();},380);
}

function pushFeed(player,title,sub){state.feed.unshift({player,title,sub,score:`${state.score.user}-${state.score.cpu}`});if(state.feed.length>30)state.feed.length=30;}
function openBox(){renderBox();if(typeof el('boxDialog').showModal==='function')el('boxDialog').showModal();else el('boxDialog').setAttribute('open','');}
function renderBox(){
  if(!state||!el('boxTable'))return;el('dialogScore').textContent=`LAL ${state.score.user} — ${state.score.cpu} BOS`;
  const team=state[boxTeam];el('boxTable').innerHTML=`<div class="box-row header"><div>PLAYER</div><div>PTS</div><div>REB</div><div>AST</div><div>FG</div><div>3PT</div><div>TO</div></div>`+team.map(p=>`<div class="box-row"><div class="box-name"><img src="${p.image}" alt="${p.short}"><strong>${p.short}</strong></div><div>${p.box.pts}</div><div>${p.box.reb}</div><div>${p.box.ast}</div><div>${p.box.fgm}/${p.box.fga}</div><div>${p.box.tpm}/${p.box.tpa}</div><div>${p.box.tov}</div></div>`).join('');
}
function renderLeaders(){
  const all=[...state.user.map(p=>({...p,team:'LAL'})),...state.cpu.map(p=>({...p,team:'BOS'}))].sort((a,b)=>b.box.pts-a.box.pts).slice(0,4);
  el('leaders').innerHTML=all.map(p=>`<div class="leader-card"><img src="${p.image}" alt="${p.name}"><strong>${p.short}</strong><span>${p.team} · ${p.box.pts} PTS · ${p.box.reb} REB · ${p.box.ast} AST</span></div>`).join('');
}

init();
