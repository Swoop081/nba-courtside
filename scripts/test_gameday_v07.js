const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-Game-Day-v0.7';
const dataJs=fs.readFileSync(root+'/data/data.js','utf8');
const schedJs=fs.readFileSync(root+'/data/schedule.js','utf8');
const pre={console,structuredClone,Date,URLSearchParams};pre.window=pre;vm.createContext(pre);vm.runInContext(dataJs,pre);vm.runInContext(schedJs,pre);
const D=pre.NBA_COURTSIDE_DATA;
const assignments={};for(const p of D.players)assignments[p.id]=p.roster_status==='restricted_free_agent_unsigned'?null:p.team;
const save={version:7,userTeam:'TOR',seasonYear:2026,date:'2026-10-20',phase:'regular_season',seasonStarted:true,seasonComplete:false,assignments,statusOverrides:{},salaryOverrides:{},results:{},seasonStats:{},gameLogs:{},rotations:{},generatedPlayers:[],playerOverrides:{},rng:20260819};
const store={'nbaCourtsideSaveV07':JSON.stringify(save),'nbaCourtsideTeam':'TOR'};
let src=fs.readFileSync(root+'/gameday.js','utf8');
// Replace rendering/bind with no-ops and expose internals before bootstrap.
src=src.replace(/function render\(scrollTop=false\)\{[^\n]*\}/,'function render(){}');
src=src.replace(/function bind\(\)\{[^\n]*\}/,'function bind(){}');
src=src.replace(/window\.addEventListener\('beforeunload',stopLive\);[\s\S]*?\}\)\(\);$/m,`window.__test={startGame,simGame,getGame:()=>game,getRotations:()=>rotations,getSave:()=>save,runtimeRotation,profile};\n})();`);
const ctx={console,structuredClone,Date,URLSearchParams,setInterval:()=>0,clearInterval:()=>{},setTimeout:(f)=>f(),window:{},location:{search:'?game=G0002&mode=watch'},document:{documentElement:{style:{setProperty(){}}},querySelector(){return null},querySelectorAll(){return[]}},localStorage:{getItem(k){return store[k]||null},setItem(k,v){store[k]=v}},Math};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(src,ctx);
const t=ctx.__test;if(!t)throw new Error('hooks missing');
for(const ab of ['TOR','MIA']){const r=t.runtimeRotation(ab);const total=[...r.targets.values()].reduce((a,b)=>a+b,0);if(total!==240)throw new Error(ab+' rotation target '+total);if(r.starters.length!==5)throw new Error(ab+' starters');if(r.schedule.length!==48)throw new Error(ab+' schedule');for(const line of r.schedule)if(line.length!==5||new Set(line.map(x=>x.id)).size!==5)throw new Error(ab+' invalid scheduled five')}
t.startGame(false);t.simGame();const g=t.getGame(),sv=t.getSave();if(!g.final)throw new Error('game not final');if(g.homeScore===g.awayScore)throw new Error('tie');if(!sv.results.G0002)throw new Error('result not committed');if(sv.results.G0002.engine!=='courtside_v07_possession')throw new Error('wrong engine');if(!sv.results.G0002.box?.home?.length||!sv.results.G0002.box?.away?.length)throw new Error('box missing');
for(const side of ['home','away']){const r=t.getRotations()[side],sum=r.players.reduce((s,p)=>s+g.stats[p.id].min,0),expected=g.period>4?240+(g.period-4)*25:240;if(Math.abs(sum-expected)>.12)throw new Error(side+' minutes '+sum+' expected '+expected)}
const gp=Object.values(sv.seasonStats).reduce((s,x)=>s+(x.gp||0),0);if(gp<16)throw new Error('season stats not accumulated');
const logs=Object.values(sv.gameLogs).reduce((s,a)=>s+a.length,0);if(logs<16)throw new Error('game logs not accumulated');
console.log(JSON.stringify({score:`${g.awayScore}-${g.homeScore}`,periods:g.period,possessions:g.possessions,homePlayers:sv.results.G0002.box.home.length,awayPlayers:sv.results.G0002.box.away.length,seasonPlayerGames:gp,gameLogs:logs},null,2));
