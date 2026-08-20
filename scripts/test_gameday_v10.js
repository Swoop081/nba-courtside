const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-Smart-Front-Offices-v0.11';
const dataJs=fs.readFileSync(root+'/data/data.js','utf8'),schedJs=fs.readFileSync(root+'/data/schedule.js','utf8');
const pre={console,structuredClone,Date,URLSearchParams};pre.window=pre;vm.createContext(pre);vm.runInContext(dataJs,pre);vm.runInContext(schedJs,pre);
const D=pre.NBA_COURTSIDE_DATA,assignments={};for(const p of D.players)assignments[p.id]=p.roster_status==='restricted_free_agent_unsigned'?null:p.team;
const save={version:10,userTeam:'TOR',seasonYear:2026,date:'2026-10-20',phase:'regular_season',seasonStarted:true,seasonComplete:false,assignments,statusOverrides:{},salaryOverrides:{},results:{},seasonStats:{},gameLogs:{},rotations:{},generatedPlayers:[],playerOverrides:{},injuries:{},injuryHistory:[],injuryRotationBackups:{},transactions:[],rng:20260819};
const store={'nbaCourtsideSaveV10':JSON.stringify(save),'nbaCourtsideTeam':'TOR'};
let src=fs.readFileSync(root+'/gameday.js','utf8');
src=src.replace(/function render\(scrollTop=false\)\{[^\n]*\}/,'function render(){}');
src=src.replace(/function bind\(\)\{[^\n]*\}/,'function bind(){}');
src=src.replace(/window\.addEventListener\('beforeunload',stopLive\);[\s\S]*?\}\)\(\);$/m,`window.__test={startGame,simGame,getGame:()=>game,getRotations:()=>rotations,getSave:()=>save,runtimeRotation,profile,makePendingInjury,availabilityPanel,unavailablePlayers};\n})();`);
const ctx={console,structuredClone,Date,URLSearchParams,setInterval:()=>0,clearInterval:()=>{},setTimeout:(f)=>f(),window:{},location:{search:'?game=G0002&mode=watch'},document:{documentElement:{style:{setProperty(){}}},querySelector(){return null},querySelectorAll(){return[]}},localStorage:{getItem(k){return store[k]||null},setItem(k,v){store[k]=v}},Math};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(src,ctx);
const t=ctx.__test;if(!t)throw new Error('hooks missing');
for(const ab of ['TOR','MIA']){const r=t.runtimeRotation(ab),total=[...r.targets.values()].reduce((a,b)=>a+b,0);if(total!==240)throw new Error(ab+' target '+total);if(r.starters.length!==5)throw new Error(ab+' starters')}
t.startGame(false);const rot=t.getRotations().home;const victim=rot.players[0];const pending=t.makePendingInjury(victim,'home');if(!pending)throw new Error('could not force game injury');t.simGame();const g=t.getGame(),sv=t.getSave();if(!g.final)throw new Error('not final');if(!sv.results.G0002)throw new Error('result missing');if(sv.results.G0002.engine!=='courtside_v10_possession')throw new Error('wrong engine '+sv.results.G0002.engine);if(!sv.injuries[victim.id])throw new Error('medical injury not persisted');if(!sv.results.G0002.injuries?.length)throw new Error('result injury missing');if(!sv.injuryHistory.length)throw new Error('injury history missing');
for(const side of ['home','away']){const r=t.getRotations()[side],sum=r.players.reduce((s,p)=>s+g.stats[p.id].min,0),expected=g.period>4?240+(g.period-4)*25:240;if(Math.abs(sum-expected)>.15)throw new Error(side+' minutes '+sum+' expected '+expected)}
const victimLine=sv.results.G0002.box.home.find(x=>x.player_id===victim.id);if(!victimLine)throw new Error('victim box missing');if(victimLine.min>=rot.targets.get(victim.id))throw new Error('injured player did not leave early');
if(!t.availabilityPanel('TOR').includes(victim.name))throw new Error('availability panel missing injury');
console.log(JSON.stringify({score:`${g.awayScore}-${g.homeScore}`,periods:g.period,possessions:g.possessions,injured:victim.name,injury:pending.name,minutesBeforeExit:victimLine.min,target:rot.targets.get(victim.id),medicalEvents:sv.injuryHistory.length},null,2));
