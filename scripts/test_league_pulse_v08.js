const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-League-Pulse-v0.8';
const dataJs=fs.readFileSync(root+'/data/data.js','utf8');
const schedJs=fs.readFileSync(root+'/data/schedule.js','utf8');
let src=fs.readFileSync(root+'/app.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m, `window.__test={
 getState:()=>state,getGames:()=>games,ensureAllRotations,startSeason,simulateGame,
 completedGameCount,leaders,leaderDisplay,liveAwards,buildStories,teamForm,
 leaguePulseView,leadersView,awardsRaceView,homePulse,statValue
};\n})();`);
src=src.replace(/function setTop\(\)\{[^\n]*\}/,'function setTop(){}');
src=src.replace(/function renderView\(\)\{[^\n]*\}/,'function renderView(){}');
src=src.replace(/function toast\(text\)\{[^\n]*\}/,'function toast(){}');
const store={nbaCourtsideSaveV07:JSON.stringify({version:7,userTeam:'TOR',seasonYear:2026,date:'2026-08-19',seasonStarted:false,seasonComplete:false})};
const noop=()=>{};
const ctx={console,structuredClone,Date,setTimeout:(f)=>f(),confirm:()=>true,scrollTo:noop,location:{reload:noop},window:{},document:{documentElement:{style:{setProperty:noop}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({classList:{add:noop,remove:noop}}),body:{appendChild:noop,style:{}}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}},Math};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(src,ctx);
const t=ctx.__test;if(!t)throw new Error('hooks missing');
t.ensureAllRotations();t.startSeason();
// Simulate the first 120 league games directly to build a meaningful early-season sample.
for(const g of t.getGames().slice(0,120))t.simulateGame(g);
if(t.completedGameCount()!==120)throw new Error('game count');
for(const key of ['pts','reb','ast','stl','blk']){const l=t.leaders(key,10);if(l.length<5)throw new Error('leaders '+key);if(t.statValue(l[0],key)<t.statValue(l.at(-1),key))throw new Error('leader order '+key)}
const aw=t.liveAwards();if(!aw.mvp.length||!aw.dpoy.length||!aw.roy.length)throw new Error('award race missing');
const stories=t.buildStories();if(stories.length<2)throw new Error('stories too thin');
const f=t.teamForm('TOR');if(f.gp<1)throw new Error('team form missing');
const pulse=t.leaguePulseView(),leaders=t.leadersView(),awards=t.awardsRaceView(),home=t.homePulse();
for(const [name,html,needle] of [['pulse',pulse,'Awards Race'],['leaders',leaders,'NBA LEADER'],['awards',awards,'LIVE RACE'],['home',home,'storyCard']])if(!html.includes(needle))throw new Error(name+' UI missing '+needle);
console.log(JSON.stringify({games:t.completedGameCount(),scoringLeader:t.leaders('pts',1)[0].name,scoringPPG:t.leaderDisplay(t.leaders('pts',1)[0],'pts'),mvpLeader:aw.mvp[0].name,rookieLeader:aw.roy[0].name,stories:stories.map(s=>s.headline),torontoForm:f},null,2));
