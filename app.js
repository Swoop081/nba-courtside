const img = id => `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`;

// Temporary prototype inputs. These are intentionally lightweight so the match engine can be tuned
// before the full NBA.com season-data pipeline is built.
const userTemplate = [
  { id:'lal-dlo', name:'D’Angelo Russell', short:'Russell', pid:1626156, pos:'PG', rating:85, usage:23, threeRate:.48, twoPct:.545, threePct:.415, ftPct:.828, ast:6.3, reb:3.1, tov:2.1, stl:.9, blk:.5, def:68, orb:.4 },
  { id:'lal-ar', name:'Austin Reaves', short:'Reaves', pid:1630559, pos:'SG', rating:84, usage:20, threeRate:.41, twoPct:.566, threePct:.367, ftPct:.853, ast:5.5, reb:4.3, tov:2.1, stl:.8, blk:.3, def:70, orb:.7 },
  { id:'lal-lbj', name:'LeBron James', short:'LeBron', pid:2544, pos:'SF', rating:94, usage:29, threeRate:.29, twoPct:.593, threePct:.410, ftPct:.750, ast:8.3, reb:7.3, tov:3.5, stl:1.3, blk:.5, def:79, orb:.9 },
  { id:'lal-rui', name:'Rui Hachimura', short:'Hachimura', pid:1629060, pos:'PF', rating:81, usage:18, threeRate:.31, twoPct:.590, threePct:.422, ftPct:.739, ast:1.2, reb:4.3, tov:.7, stl:.6, blk:.4, def:71, orb:1.0 },
  { id:'lal-ad', name:'Anthony Davis', short:'Davis', pid:203076, pos:'C', rating:95, usage:27, threeRate:.08, twoPct:.581, threePct:.271, ftPct:.816, ast:3.5, reb:12.6, tov:2.1, stl:1.2, blk:2.3, def:94, orb:3.1 },
  { id:'lal-prince', name:'Taurean Prince', short:'Prince', pid:1627752, pos:'F', rating:77, usage:14, threeRate:.58, twoPct:.500, threePct:.396, ftPct:.735, ast:1.5, reb:2.9, tov:.9, stl:.7, blk:.4, def:72, orb:.5 },
  { id:'lal-vincent', name:'Gabe Vincent', short:'Vincent', pid:1629216, pos:'G', rating:74, usage:16, threeRate:.53, twoPct:.420, threePct:.107, ftPct:.500, ast:1.9, reb:.9, tov:.5, stl:.8, blk:.0, def:72, orb:.2 },
  { id:'lal-hayes', name:'Jaxson Hayes', short:'Hayes', pid:1629637, pos:'C', rating:75, usage:11, threeRate:.01, twoPct:.727, threePct:.000, ftPct:.622, ast:.5, reb:3.0, tov:.6, stl:.5, blk:.4, def:72, orb:1.1 }
];

const cpuTemplate = [
  { id:'bos-jrue', name:'Jrue Holiday', short:'Holiday', pid:201950, pos:'PG', rating:87, usage:16, threeRate:.48, twoPct:.517, threePct:.429, ftPct:.833, ast:4.8, reb:5.4, tov:1.8, stl:.9, blk:.8, def:90, orb:1.2 },
  { id:'bos-white', name:'Derrick White', short:'White', pid:1628401, pos:'SG', rating:88, usage:19, threeRate:.54, twoPct:.539, threePct:.396, ftPct:.901, ast:5.2, reb:4.2, tov:1.5, stl:1.0, blk:1.2, def:88, orb:.7 },
  { id:'bos-brown', name:'Jaylen Brown', short:'Brown', pid:1627759, pos:'SF', rating:91, usage:28, threeRate:.34, twoPct:.572, threePct:.354, ftPct:.703, ast:3.6, reb:5.5, tov:2.4, stl:1.2, blk:.5, def:84, orb:1.2 },
  { id:'bos-tatum', name:'Jayson Tatum', short:'Tatum', pid:1628369, pos:'PF', rating:95, usage:30, threeRate:.44, twoPct:.542, threePct:.376, ftPct:.833, ast:4.9, reb:8.1, tov:2.5, stl:1.0, blk:.6, def:86, orb:.9 },
  { id:'bos-kp', name:'Kristaps Porziņģis', short:'Porziņģis', pid:204001, pos:'C', rating:90, usage:24, threeRate:.38, twoPct:.603, threePct:.375, ftPct:.858, ast:2.0, reb:7.2, tov:1.6, stl:.7, blk:1.9, def:90, orb:1.5 },
  { id:'bos-horford', name:'Al Horford', short:'Horford', pid:201143, pos:'F/C', rating:82, usage:12, threeRate:.62, twoPct:.621, threePct:.419, ftPct:.867, ast:2.6, reb:6.4, tov:.7, stl:.6, blk:1.0, def:85, orb:1.4 },
  { id:'bos-pp', name:'Payton Pritchard', short:'Pritchard', pid:1630202, pos:'G', rating:80, usage:17, threeRate:.57, twoPct:.582, threePct:.385, ftPct:.821, ast:3.4, reb:3.2, tov:.7, stl:.5, blk:.1, def:70, orb:.9 },
  { id:'bos-hauser', name:'Sam Hauser', short:'Hauser', pid:1630573, pos:'F', rating:79, usage:14, threeRate:.75, twoPct:.606, threePct:.424, ftPct:.895, ast:1.0, reb:3.5, tov:.5, stl:.5, blk:.3, def:73, orb:.6 }
];

const el = id => document.getElementById(id);
const deepPlayers = template => template.map(p => ({
  ...p,
  image: img(p.pid),
  energy: 100,
  seconds: 0,
  onCourt: false,
  box: { pts:0, fgm:0, fga:0, tpm:0, tpa:0, ftm:0, fta:0, reb:0, ast:0, stl:0, blk:0, tov:0, pf:0 }
}));

let state;
let autoTimer = null;
let boxTeam = 'user';

function freshState() {
  const user = deepPlayers(userTemplate);
  const cpu = deepPlayers(cpuTemplate);
  user.slice(0,5).forEach(p => p.onCourt = true);
  cpu.slice(0,5).forEach(p => p.onCourt = true);
  return {
    user, cpu,
    score:{ user:0, cpu:0 },
    quarter:1,
    clock:720,
    possession: Math.random() < .5 ? 'user' : 'cpu',
    over:false,
    feed:[],
    tactics:{ offense:'balanced', defense:'balanced', pace:'normal', rotation:'balanced' },
    cpuTactics:{ offense:'balanced', defense:'balanced', pace:'normal', rotation:'balanced' },
    run:{ team:null, points:0 },
    lastScore:{user:0,cpu:0},
    pauseReason:null,
    overtime:0,
    simTicks:0
  };
}

function init() {
  state = freshState();
  renderPregameRosters();
  renderGame();
  wireControls();
  showScreen('pregameScreen');
}

function wireControls() {
  el('tipoffBtn').onclick = () => { showScreen('gameScreen'); pushFeed('Tip off', 'The exhibition is underway.', null); highlight(null,'TIP OFF','COURTSIDE','Set your tactics and start the simulation.'); renderGame(); };
  el('resetBtn').onclick = resetAll;
  el('againBtn').onclick = resetAll;
  el('possessionBtn').onclick = () => simulatePossession({manual:true});
  el('minuteBtn').onclick = () => {
    const q = state.quarter;
    const target = Math.max(0, state.clock - 60);
    simUntil(() => state.over || state.quarter !== q || state.clock <= target);
  };
  el('quarterBtn').onclick = () => {
    const q = state.quarter;
    simUntil(() => state.over || state.quarter !== q);
  };
  el('autoBtn').onclick = toggleAuto;
  el('forceSubsBtn').onclick = () => { rotateTeam('user', true); renderGame(); };
  el('boxBtn').onclick = openBox;
  el('finalBoxBtn').onclick = openBox;
  el('closeBoxBtn').onclick = () => el('boxDialog').close();
  el('labBtn').onclick = runLab;

  document.querySelectorAll('.box-tabs button').forEach(btn => btn.onclick = () => {
    boxTeam = btn.dataset.team;
    document.querySelectorAll('.box-tabs button').forEach(b=>b.classList.toggle('active', b===btn));
    renderBox();
  });

  bindSegment('offenseControls','offense');
  bindSegment('defenseControls','defense');
  bindSegment('paceControls','pace');
  bindSegment('rotationControls','rotation');
}

function bindSegment(containerId, key) {
  el(containerId).querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      state.tactics[key] = btn.dataset.value;
      el(containerId).querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
    };
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  el(id).classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
}

function resetAll() {
  stopAuto();
  state = freshState();
  el('labResult').classList.add('hidden');
  renderPregameRosters();
  renderGame();
  showScreen('pregameScreen');
}

function playerCard(p, mini=false) {
  return `<div class="player-card ${p.onCourt ? '' : 'bench'}">
    <div class="pc-rating">${p.rating}</div>
    ${mini ? `<div class="energy-bar"><span style="width:${Math.max(2,p.energy)}%"></span></div>`:''}
    <img src="${p.image}" alt="${p.name}" onerror="this.style.opacity=.15" />
    <div class="pc-copy">
      <div class="pc-name">${p.short}</div>
      <div class="pc-meta">${p.pos} · ${mini ? Math.round(p.energy)+'% ENERGY' : 'SIM '+p.rating}</div>
    </div>
  </div>`;
}

function renderPregameRosters() {
  el('userRoster').innerHTML = state.user.map(p=>playerCard(p)).join('');
  el('cpuRoster').innerHTML = state.cpu.map(p=>playerCard(p)).join('');
}

function renderGame() {
  el('userScore').textContent = state.score.user;
  el('cpuScore').textContent = state.score.cpu;
  el('quarterLabel').textContent = qLabel();
  el('clockLabel').textContent = formatClock(state.clock);
  el('possessionLabel').textContent = `${state.possession === 'user' ? 'LAL' : 'BOS'} BALL`;
  el('dialogScore').textContent = `LAL ${state.score.user} — ${state.score.cpu} BOS`;
  el('onCourtStrip').innerHTML = state.user.filter(p=>p.onCourt).map(p=>playerCard(p,true)).join('');
  el('gameFeed').innerHTML = state.feed.slice(0,14).map(item => `<div class="feed-item">
    ${item.player ? `<img src="${item.player.image}" alt="${item.player.short}" />` : `<div></div>`}
    <div><strong>${item.title}</strong><span>${item.sub}</span></div>
    <span class="feed-score">${item.score}</span>
  </div>`).join('') || `<div class="prototype-note">Game events will appear here.</div>`;
  el('runBadge').textContent = state.run.team ? `${state.run.team === 'user' ? 'LAL' : 'BOS'} RUN ${state.run.points}–0` : 'RUN 0–0';
  renderBox();
}

function qLabel() {
  if (state.quarter <= 4) return ['1ST','2ND','3RD','4TH'][state.quarter-1];
  return `OT${state.quarter-4 > 1 ? state.quarter-4 : ''}`;
}
function formatClock(sec) {
  sec = Math.max(0, Math.round(sec));
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}


function line(team) { return state[team].filter(p=>p.onCourt); }
function bench(team) { return state[team].filter(p=>!p.onCourt); }

function weightedChoice(items, weightFn) {
  const weights = items.map(x => Math.max(.001, weightFn(x)));
  const sum = weights.reduce((a,b)=>a+b,0);
  let r = Math.random()*sum;
  for (let i=0;i<items.length;i++) { r -= weights[i]; if (r <= 0) return items[i]; }
  return items[items.length-1];
}

function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function chance(p){ return Math.random() < clamp(p,0,1); }

function simulatePossession({manual=false, silent=false}={}) {
  if (state.over) return;
  maybeCpuStrategy();
  const offenseTeam = state.possession;
  const defenseTeam = offenseTeam === 'user' ? 'cpu' : 'user';
  const tactics = offenseTeam === 'user' ? state.tactics : state.cpuTactics;
  const defTactics = defenseTeam === 'user' ? state.tactics : state.cpuTactics;
  const offense = line(offenseTeam);
  const defense = line(defenseTeam);
  if (offense.length !== 5 || defense.length !== 5) return;

  const elapsed = possessionSeconds(tactics.pace);
  applyFatigue(elapsed);
  state.clock = Math.max(0, state.clock - elapsed);
  state.simTicks++;

  let shooter = chooseShooter(offense, tactics.offense);
  const avgDef = defense.reduce((s,p)=>s+p.def,0)/5;
  const avgEnergyDef = defense.reduce((s,p)=>s+p.energy,0)/5;
  const paceTov = tactics.pace === 'fast' ? .012 : tactics.pace === 'slow' ? -.009 : 0;
  const ballSecurity = clamp((shooter.tov / Math.max(1, shooter.ast + shooter.tov)), .10, .48);
  let tovChance = .075 + ballSecurity*.085 + paceTov + (avgDef-77)*.00125;
  if (tactics.offense === 'pnr') tovChance += .005;
  if (defTactics.defense === 'perimeter') tovChance += .008;

  if (chance(tovChance)) {
    shooter.box.tov++;
    const thief = weightedChoice(defense, p=>.4+p.stl);
    if (chance(.56)) thief.box.stl++;
    event(offenseTeam, shooter, 'TURNOVER', `${shooter.short} loses the possession.`, 0, silent);
    switchPossession();
    endPossession(elapsed, silent);
    return;
  }

  let threeRate = shooter.threeRate;
  if (tactics.offense === 'three') threeRate += .22;
  if (tactics.offense === 'rim') threeRate -= .18;
  if (tactics.offense === 'pnr') threeRate -= .04;
  if (defTactics.defense === 'paint') threeRate += .10;
  if (defTactics.defense === 'perimeter') threeRate -= .10;
  threeRate = clamp(threeRate,.03,.86);
  const isThree = chance(threeRate);

  let base = isThree ? shooter.threePct : shooter.twoPct;
  let contest = (avgDef - 76) * (isThree ? .0012 : .0015);
  contest += (100-avgEnergyDef)*.00045;
  if (defTactics.defense === 'paint') contest += isThree ? -.012 : .023;
  if (defTactics.defense === 'perimeter') contest += isThree ? .026 : -.014;
  if (defTactics.defense === 'switch') contest += isThree ? .012 : .006;
  if (tactics.offense === 'pnr') base += .012;
  if (tactics.offense === 'star' && shooter.rating >= 90) base += .008;
  if (tactics.offense === 'rim' && !isThree) base += .012;
  if (tactics.offense === 'three' && isThree) base -= .006;
  base -= (100-shooter.energy)*.00115;

  shooter.box.fga++;
  if (isThree) shooter.box.tpa++;

  const blockChance = !isThree ? clamp(defense.reduce((s,p)=>s+p.blk,0)*.0045 + (avgDef-78)*.0008, .015, .11) : .008;
  if (chance(blockChance)) {
    const blocker = weightedChoice(defense, p=>.25+p.blk);
    blocker.box.blk++;
    event(offenseTeam, shooter, 'BLOCKED', `${blocker.short} sends ${shooter.short}'s shot back.`, 0, silent, blocker);
    reboundAfterMiss(offenseTeam, defenseTeam, shooter, silent);
    endPossession(elapsed, silent);
    return;
  }

  const made = chance(clamp(base - contest, isThree ? .24 : .34, isThree ? .56 : .72));
  const foulRate = isThree ? .022 : .105;
  const fouled = chance(foulRate * (tactics.offense === 'rim' ? 1.28 : 1));

  if (made) {
    shooter.box.fgm++;
    if (isThree) shooter.box.tpm++;
    const points = isThree ? 3 : 2;
    addPoints(offenseTeam, shooter, points);
    maybeAssist(offense, shooter);
    if (fouled) {
      const defender = weightedChoice(defense,p=>1+(100-p.def)*.01); defender.box.pf++;
      const ft = shootFreeThrows(shooter,1);
      addPoints(offenseTeam, shooter, ft, true);
      event(offenseTeam, shooter, ft ? 'AND-ONE' : (isThree ? 'THREE' : 'BUCKET'), `${shooter.short} scores${ft ? ' and converts the free throw.' : '.'}`, points+ft, silent);
    } else {
      event(offenseTeam, shooter, isThree ? 'FROM DEEP' : 'BUCKET', `${shooter.short} knocks it down.`, points, silent);
    }
    switchPossession();
  } else if (fouled) {
    const defender = weightedChoice(defense,p=>1+(100-p.def)*.01); defender.box.pf++;
    const attempts = isThree ? 3 : 2;
    const ft = shootFreeThrows(shooter, attempts);
    addPoints(offenseTeam, shooter, ft, true);
    event(offenseTeam, shooter, 'AT THE LINE', `${shooter.short} hits ${ft} of ${attempts} free throws.`, ft, silent);
    switchPossession();
  } else {
    event(offenseTeam, shooter, 'MISS', `${shooter.short} can't finish the possession.`, 0, silent);
    reboundAfterMiss(offenseTeam, defenseTeam, shooter, silent);
  }

  endPossession(elapsed, silent);
}

function possessionSeconds(pace) {
  if (pace === 'fast') return 8 + Math.floor(Math.random()*9);
  if (pace === 'slow') return 14 + Math.floor(Math.random()*9);
  return 10 + Math.floor(Math.random()*9);
}

function chooseShooter(offense, scheme) {
  return weightedChoice(offense, p => {
    let w = p.usage * (.72 + p.energy/360);
    if (scheme === 'star') w *= p.rating >= 90 ? 1.55 : .84;
    if (scheme === 'three') w *= .72 + p.threeRate*1.08;
    if (scheme === 'rim') w *= 1.15 - p.threeRate*.45;
    if (scheme === 'pnr') w *= (p.ast >= 4 || p.pos.includes('C')) ? 1.28 : .88;
    return w;
  });
}

function maybeAssist(offense, shooter) {
  const others = offense.filter(p=>p!==shooter);
  if (!others.length) return;
  const passer = weightedChoice(others,p=>.4+p.ast);
  const teamAst = others.reduce((s,p)=>s+p.ast,0);
  const astChance = clamp(.41 + teamAst*.012, .45, .76);
  if (chance(astChance)) passer.box.ast++;
}

function shootFreeThrows(shooter, attempts) {
  let made=0;
  for(let i=0;i<attempts;i++){ shooter.box.fta++; if(chance(shooter.ftPct)){ shooter.box.ftm++; made++; } }
  return made;
}

function reboundAfterMiss(offTeam, defTeam, shooter, silent) {
  const off = line(offTeam), def = line(defTeam);
  const offRebStrength = off.reduce((s,p)=>s+p.orb,0);
  const defRebStrength = def.reduce((s,p)=>s+p.reb,0);
  const oChance = clamp(.17 + offRebStrength*.009 - defRebStrength*.0024, .13, .34);
  if (chance(oChance)) {
    const rebounder = weightedChoice(off,p=>.2+p.orb);
    rebounder.box.reb++;
    event(offTeam, rebounder, 'OFFENSIVE BOARD', `${rebounder.short} keeps the possession alive.`, 0, silent);
    state.possession = offTeam;
  } else {
    const rebounder = weightedChoice(def,p=>.4+p.reb);
    rebounder.box.reb++;
    state.possession = defTeam;
  }
}

function addPoints(team, player, points, alreadyBox=false) {
  if (points <= 0) return;
  state.score[team] += points;
  if (!alreadyBox) player.box.pts += points;
  else player.box.pts += points;
  updateRun(team, points);
}

function updateRun(team, points) {
  if (!points) return;
  if (state.run.team === team) state.run.points += points;
  else state.run = {team, points};
}

function switchPossession(){ state.possession = state.possession === 'user' ? 'cpu' : 'user'; }

function applyFatigue(sec) {
  ['user','cpu'].forEach(team=>{
    state[team].forEach(p=>{
      if(p.onCourt){ p.seconds += sec; p.energy = clamp(p.energy - sec*.0105, 42, 100); }
      else { p.energy = clamp(p.energy + sec*.015, 42, 100); }
    });
  });
}

function endPossession(elapsed, silent) {
  maybeRotate(false);
  if (state.clock <= 0) endPeriod(silent);
  if (!silent) renderGame();
}

function endPeriod(silent=false) {
  if (state.quarter < 4) {
    state.quarter++;
    state.clock = 720;
    state.run = {team:null,points:0};
    restoreBetweenPeriods();
    rotateTeam('user', true); rotateTeam('cpu', true);
    if(!silent){ stopAuto(); pushFeed('Quarter break', `${qLabel()} quarter is next.`, null); showMoment('QUARTER BREAK — ADJUST YOUR GAME PLAN'); }
    return;
  }
  if (state.quarter >= 4 && state.score.user === state.score.cpu) {
    state.quarter++;
    state.overtime++;
    state.clock = 300;
    restoreBetweenPeriods(.18);
    if(!silent){ stopAuto(); pushFeed('Overtime', 'Five more minutes.', null); showMoment('OVERTIME'); }
    return;
  }
  finishGame(silent);
}

function restoreBetweenPeriods(scale=.25){ ['user','cpu'].forEach(t=>state[t].forEach(p=>p.energy=clamp(p.energy+(100-p.energy)*scale,42,100))); }

function maybeRotate(force=false) {
  if (state.simTicks % 5 !== 0 && !force) return;
  rotateTeam('cpu', force);
  rotateTeam('user', force);
}

function rotateTeam(team, force=false) {
  const mode = team==='user' ? state.tactics.rotation : state.cpuTactics.rotation;
  const on = line(team).slice().sort((a,b)=>a.energy-b.energy);
  const off = bench(team).slice().sort((a,b)=>b.energy-a.energy);
  if (!off.length) return;
  const threshold = mode==='star' ? 59 : mode==='fresh' ? 76 : 68;
  const candidateOut = on.find(p => p.energy < threshold || force);
  if (!candidateOut) return;
  const candidateIn = off.find(p => p.energy > candidateOut.energy + (force ? -2 : 7));
  if (!candidateIn) return;
  candidateOut.onCourt=false;
  candidateIn.onCourt=true;
  if (team==='user' && force) pushFeed('Substitution', `${candidateIn.short} checks in for ${candidateOut.short}.`, candidateIn);
}

function maybeCpuStrategy() {
  const margin = state.score.cpu - state.score.user;
  if (state.quarter >= 4 && state.clock < 360) {
    if (margin < -8) { state.cpuTactics.pace='fast'; state.cpuTactics.offense='three'; state.cpuTactics.defense='perimeter'; }
    else if (margin > 10) { state.cpuTactics.pace='slow'; state.cpuTactics.offense='balanced'; }
    else { state.cpuTactics.pace='normal'; state.cpuTactics.offense='star'; }
  } else {
    state.cpuTactics.pace='normal';
    state.cpuTactics.offense = state.score.cpu + 6 < state.score.user ? 'pnr' : 'balanced';
    state.cpuTactics.defense = state.user.filter(p=>p.onCourt).reduce((s,p)=>s+p.threeRate,0)/5 > .44 ? 'perimeter' : 'balanced';
  }
}

function event(team, player, title, sub, points, silent=false, featurePlayer=null) {
  const featured = featurePlayer || player;
  if (!silent) {
    pushFeed(title, sub, featured);
    if (title !== 'MISS' && title !== 'TURNOVER') highlight(featured, team==='user'?'LOS ANGELES':'BOSTON', title, sub);
    if (state.run.points >= 8) {
      showMoment(`${state.run.team==='user'?'LAKERS':'CELTICS'} ON A ${state.run.points}–0 RUN`);
      if (state.run.team === 'cpu' && autoTimer) stopAuto();
    } else if (state.quarter >= 4 && state.clock <= 120 && Math.abs(state.score.user-state.score.cpu) <= 8) {
      showMoment(`CLUTCH MODE — ${formatClock(state.clock)} LEFT`);
      if (autoTimer) stopAuto();
    } else {
      el('momentBanner').classList.add('hidden');
    }
  }
}

function pushFeed(title, sub, player) {
  state.feed.unshift({ title, sub, player, score:`${state.score.user}–${state.score.cpu}` });
  state.feed = state.feed.slice(0,30);
}

function highlight(player,kicker,headline,sub) {
  if(player) el('highlightImage').src=player.image;
  el('highlightKicker').textContent=kicker;
  el('highlightHeadline').textContent=headline;
  el('highlightSub').textContent=sub;
}
function showMoment(text){ el('momentBanner').textContent=text; el('momentBanner').classList.remove('hidden'); }

function simUntil(stopFn) {
  if (state.over) return;
  stopAuto();
  let guard=0;
  while(!state.over && !stopFn() && guard<120){ simulatePossession({silent:true}); guard++; }
  renderGame();
}

function toggleAuto() {
  if (autoTimer) { stopAuto(); return; }
  if (state.over) return;
  el('autoBtn').textContent='PAUSE LIVE SIM';
  el('autoBtn').classList.add('running');
  autoTimer = setInterval(()=>{
    if(state.over){ stopAuto(); return; }
    simulatePossession();
  }, 340);
}
function stopAuto(){ if(autoTimer){ clearInterval(autoTimer); autoTimer=null; } el('autoBtn').textContent='START LIVE SIM'; el('autoBtn').classList.remove('running'); }

function finishGame(silent=false) {
  state.over=true;
  stopAuto();
  if (silent) return;
  renderGame();
  const winner = state.score.user > state.score.cpu ? 'LOS ANGELES WINS' : 'BOSTON WINS';
  el('finalScore').textContent = `LAL ${state.score.user} — ${state.score.cpu} BOS`;
  el('finalSummary').textContent = `${winner}. ${state.overtime ? `Decided in ${state.overtime>1?state.overtime+' overtimes':'overtime'}.` : 'Four quarters complete.'}`;
  renderLeaders();
  showScreen('finalScreen');
}

function renderLeaders() {
  const all=[...state.user,...state.cpu];
  const scorers=all.slice().sort((a,b)=>b.box.pts-a.box.pts).slice(0,3);
  el('leaders').innerHTML=scorers.map(p=>`<div class="leader-card"><img src="${p.image}" alt="${p.short}"><div><strong>${p.name}</strong><span>${p.pos} · ${p.box.reb} REB · ${p.box.ast} AST</span></div><div class="leader-stat">${p.box.pts}</div></div>`).join('');
}

function openBox(){ renderBox(); el('boxDialog').showModal(); }
function renderBox() {
  if (!state) return;
  const players=state[boxTeam];
  const header = `<div class="box-row header"><div>PLAYER</div><div>PTS</div><div>REB</div><div>AST</div><div>FG</div><div>3PT</div><div>FT</div><div>STL</div><div>BLK</div></div>`;
  const rows=players.map(p=>`<div class="box-row"><strong>${p.short}</strong><div>${p.box.pts}</div><div>${p.box.reb}</div><div>${p.box.ast}</div><div>${p.box.fgm}-${p.box.fga}</div><div>${p.box.tpm}-${p.box.tpa}</div><div>${p.box.ftm}-${p.box.fta}</div><div>${p.box.stl}</div><div>${p.box.blk}</div></div>`).join('');
  el('boxTable').innerHTML=header+rows;
}

function runLab() {
  stopAuto();
  const games=50;
  let userWins=0, cpuWins=0, userPts=0, cpuPts=0, ots=0;
  for(let g=0;g<games;g++){
    state=freshState();
    let guard=0;
    while(!state.over && guard<500){ simulatePossession({silent:true}); guard++; }
    userPts+=state.score.user; cpuPts+=state.score.cpu; ots+=state.overtime;
    if(state.score.user>state.score.cpu) userWins++; else cpuWins++;
  }
  const avgU=(userPts/games).toFixed(1), avgC=(cpuPts/games).toFixed(1);
  state=freshState(); renderPregameRosters(); renderGame();
  el('labResult').innerHTML=`<strong>50-GAME SIM LAB</strong><br>Lakers ${userWins} wins · Celtics ${cpuWins} wins<br>Average score: LAL ${avgU} — ${avgC} BOS<br>Overtime games: ${ots}<br><span style="color:#9b9bb2">Use this to judge whether scoring, pace and team strength feel plausible before we expand the game.</span>`;
  el('labResult').classList.remove('hidden');
}

init();
