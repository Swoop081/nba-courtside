const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-Game-Day-v0.7';
const dataJs=fs.readFileSync(root+'/data/data.js','utf8');
const schedJs=fs.readFileSync(root+'/data/schedule.js','utf8');
let src=fs.readFileSync(root+'/app.js','utf8');
// Remove browser bootstrap; expose only the franchise/game-day integration pieces.
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m, `window.__test={
 getState:()=>state, getGames:()=>games, ensureAllRotations, ensureRotation, rotationPlayers,
 startSeason, nextGame, advanceTo, gameCard, homeView, simulateGame, record,
 setRotationMode, adjustRotationMinute, startingFive, playerSeasonLine
};\n})();`);
// UI side effects are irrelevant to this engine test.
src=src.replace(/function setTop\(\)\{[^\n]*\}/,'function setTop(){}');
src=src.replace(/function renderView\(\)\{[^\n]*\}/,'function renderView(){}');
src=src.replace(/function toast\(text\)\{[^\n]*\}/,'function toast(){}');
const store={nbaCourtsideSaveV05:JSON.stringify({version:5,userTeam:'TOR',seasonYear:2026,date:'2026-08-19',seasonStarted:false,seasonComplete:false})};
const noop=()=>{};
const ctx={console,structuredClone,Date,setTimeout:(f)=>f(),confirm:()=>true,scrollTo:noop,location:{reload:noop},window:{},document:{documentElement:{style:{setProperty:noop}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({classList:{add:noop,remove:noop}}),body:{appendChild:noop,style:{}}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}},Math};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(src,ctx);
const t=ctx.__test;if(!t)throw new Error('hooks missing');
t.ensureAllRotations();
for(const ab of ctx.NBA_COURTSIDE_DATA.league.teams.map(x=>x.abbr)){
 const r=t.ensureRotation(ab),ids=Object.keys(r.minutes).filter(id=>r.minutes[id]>0),sum=ids.reduce((s,id)=>s+r.minutes[id],0);
 if(sum!==240)throw new Error(ab+' target '+sum);
 if(new Set(Object.values(r.starters)).size!==5)throw new Error(ab+' starters');
 if(ids.length<8||ids.length>11)throw new Error(ab+' rotation size '+ids.length);
}
// User minute edits must remain a zero-sum 240-minute plan.
const before=t.ensureRotation('TOR');const pid=Object.keys(before.minutes)[0];t.adjustRotationMinute('TOR',pid,1);const after=t.ensureRotation('TOR');
if(Object.values(after.minutes).reduce((a,b)=>a+b,0)!==240)throw new Error('minute edit broke 240');

t.startSeason();const s=t.getState();if(!s.seasonStarted||s.phase!=='regular_season')throw new Error('season did not start');
const ng=t.nextGame('TOR');if(!ng)throw new Error('no TOR next game');
t.advanceTo(ng.date);
if(t.getState().results[ng.id])throw new Error('GM calendar silently simulated user Game Day');
if(t.getState().date!==ng.date)throw new Error('calendar did not stop on Game Day');
const card=t.gameCard(ng);if(!card.includes('gameday.html?game=')||!card.includes('WATCH GAME')||!card.includes('SIM GAME'))throw new Error('Game Day actions missing');
if(t.homeView().toUpperCase().includes('EXHIBITION'))throw new Error('standalone Exhibition leaked into GM UI');
// Background game simulation must create complete persistent stats.
const cpu=t.getGames().find(g=>g.date<=ng.date&&g.home!=='TOR'&&g.away!=='TOR'&&!t.getState().results[g.id]);
if(cpu){t.simulateGame(cpu);const r=t.getState().results[cpu.id];if(!r?.box?.home?.length||!r?.box?.away?.length)throw new Error('background box score missing');}
console.log(JSON.stringify({teams:30,rotationMinutes:240,nextGame:ng.id,date:ng.date,userGameGated:!t.getState().results[ng.id],resultsBeforeUserGame:Object.keys(t.getState().results).length,homeHasExhibition:false},null,2));
