const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-Injuries-v0.9';
const dataJs=fs.readFileSync(root+'/data/data.js','utf8');
const schedJs=fs.readFileSync(root+'/data/schedule.js','utf8');
let src=fs.readFileSync(root+'/app.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m, `window.__test={
 getState:()=>state,getGames:()=>games,getPlayers:()=>players,ensureAllRotations,startSeason,simulateGame,
 createInjury,processMedicalDay,activeTeamInjuries,rotationPlayers,ensureRotation,injuryFor,medicalReport,leagueInjuriesView,
 completedGameCount,leaders,liveAwards,buildStories,teamForm,homeView,rosterView
};\n})();`);
src=src.replace(/function setTop\(\)\{[^\n]*\}/,'function setTop(){}');
src=src.replace(/function renderView\(\)\{[^\n]*\}/,'function renderView(){}');
src=src.replace(/function toast\(text\)\{[^\n]*\}/,'function toast(){}');
const store={nbaCourtsideSaveV08:JSON.stringify({version:8,userTeam:'TOR',seasonYear:2026,date:'2026-08-19',seasonStarted:false,seasonComplete:false,assignments:{},statusOverrides:{},salaryOverrides:{},results:{},seasonStats:{},gameLogs:{},rotations:{},generatedPlayers:[],playerOverrides:{},rng:20260819})};
const noop=()=>{};
const ctx={console,structuredClone,Date,setTimeout:(f)=>f(),confirm:()=>true,scrollTo:noop,location:{reload:noop},window:{},document:{documentElement:{style:{setProperty:noop}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({classList:{add:noop,remove:noop}}),body:{appendChild:noop,style:{}}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}},Math};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(src,ctx);
const t=ctx.__test;if(!t)throw new Error('hooks missing');
const st=t.getState();if(st.version!==9)throw new Error('migration failed '+st.version);
// Ensure baseline assignments exist after migration merge. Missing assignment keys fall back to base team, fine.
t.ensureAllRotations();t.startSeason();
const tor=t.getPlayers().filter(p=>(st.assignments[p.id]??p.team)==='TOR' && (st.statusOverrides[p.id]||p.roster_status)==='active').sort((a,b)=>(b.ratings?.overall||0)-(a.ratings?.overall||0));
const victim=tor[0];if(!victim)throw new Error('no TOR victim');
const before=t.ensureRotation('TOR');const beforeStarter=Object.values(before.starters).includes(victim.id);
const inj=t.createInjury(victim,'2026-10-20','test',{name:'Test ankle sprain',severity:'minor',min:5,max:5,w:1});
if(!inj||!t.injuryFor(victim))throw new Error('injury not created');
if(t.activeTeamInjuries('TOR').length!==1)throw new Error('active injury count');
const rot=t.ensureRotation('TOR');const total=t.rotationPlayers('TOR').reduce((s,x)=>s+x.min,0);if(total!==240)throw new Error('injured rotation not 240');
if(t.rotationPlayers('TOR').some(x=>x.p.id===victim.id))throw new Error('injured player still in rotation');
if(!t.medicalReport('TOR').includes(victim.name))throw new Error('medical report missing player');
if(!t.leagueInjuriesView().includes(victim.name))throw new Error('league injuries missing player');
// Clear on return date and verify availability/rotation recovers.
st.date=inj.return_date;t.processMedicalDay(inj.return_date);if(t.injuryFor(victim))throw new Error('injury did not clear');
const after=t.ensureRotation('TOR');const total2=t.rotationPlayers('TOR').reduce((s,x)=>s+x.min,0);if(total2!==240)throw new Error('returned rotation not 240');
if(beforeStarter && !Object.values(after.starters).includes(victim.id))throw new Error('preferred rotation not restored');
// Simulate enough games to exercise organic injuries and league systems.
for(const g of t.getGames().slice(0,260)){st.date=g.date;t.simulateGame(g)}
if(t.completedGameCount()!==260)throw new Error('game count');
if((st.injuryHistory||[]).length<2)throw new Error('organic injury history too thin');
const aw=t.liveAwards();if(!aw.mvp.length||!aw.dpoy.length||!aw.roy.length)throw new Error('award race missing');
const stories=t.buildStories();if(stories.length<2)throw new Error('stories thin');
const torForm=t.teamForm('TOR');if(!torForm.gp)throw new Error('team form missing');
// User-facing views should render without undefined helpers.
if(!t.homeView().includes('Next Game')&&!t.homeView().includes('Medical Report'))throw new Error('home render failed');
if(!t.rosterView().includes('Depth Chart'))throw new Error('roster render failed');
console.log(JSON.stringify({version:st.version,forcedVictim:victim.name,forcedInjury:inj.name,organicMedicalEvents:st.injuryHistory.length,activeLeagueInjuries:Object.keys(st.injuries||{}).length,rotationMinutes:total2,games:t.completedGameCount(),mvp:aw.mvp[0]?.name,stories:stories.map(x=>x.headline).slice(0,4)},null,2));
