const fs=require('fs'),vm=require('vm');
const root='/mnt/data/NBA-Courtside-Official-Schedule-Cup-v0.17';
const dataJs=fs.readFileSync(root+'/data/data.js','utf8');
const schedJs=fs.readFileSync(root+'/data/schedule.js','utf8');
const templateJs=fs.readFileSync(root+'/data/schedule-template.js','utf8');
let src=fs.readFileSync(root+'/app.js','utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__test={
 getState:()=>state,getGames:()=>games,getBaseGames:()=>baseGames,getCup:()=>state.nbaCup,
 ensureAllRotations,simulateGame,ensureNBAProgress,refreshSeasonConfig,v17SimCpuCupFinal,
 seasonGamesFor,v17CupStandings,v17ConferenceCupOrder,processMedicalDay
};\n})();`)
.replace(/function setTop\(\)\{[^\n]*\}/,'function setTop(){}')
.replace(/function renderView\(\)\{[^\n]*\}/,'function renderView(){}')
.replace(/function toast\(text\)\{[^\n]*\}/,'function toast(){}')
.replace(/function processGameInjuries\([^\n]*\}\n/,'function processGameInjuries(){return []}\n');
const store={nbaCourtsideTeam:'NOPE'},noop=()=>{};
const ctx={console,structuredClone,Date,URLSearchParams,setTimeout:(f)=>f(),confirm:()=>true,scrollTo:noop,location:{reload:noop},window:{},document:{documentElement:{style:{setProperty:noop}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({classList:{add:noop,remove:noop}}),body:{appendChild:noop,style:{}}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},Math};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(templateJs,ctx);vm.runInContext(fs.readFileSync(root+'/cba.js','utf8'),ctx);vm.runInContext(src,ctx);
const t=ctx.__test;if(!t)throw new Error('test hooks missing');const st=t.getState();
st.userTeam='NOPE';st.seasonYear=2026;st.date='2026-10-20';st.phase='regular_season';st.seasonStarted=true;st.seasonComplete=false;st.scheduleMode='official_2026';st.results={};st.seasonStats={};st.gameLogs={};st.rotations={};st.nbaCup=null;st.dynamicGames=[];st.cupHistory=[];st.injuries={};st.injuryHistory=[];
t.refreshSeasonConfig();t.ensureAllRotations();
function addDays(s,n=1){const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
for(let d='2026-10-20';d<='2027-04-11';d=addDays(d)){
  st.date=d;t.refreshSeasonConfig();
  for(const g of t.getGames().filter(g=>g.date===d && !st.results[g.id]))t.simulateGame(g);
  t.ensureNBAProgress();t.refreshSeasonConfig();
  // Cup phase materialization can add another regular-season game to a later date only.
  if(st.nbaCup?.championshipGame?.date===d&&!st.nbaCup.championshipResult)t.v17SimCpuCupFinal();
}
t.ensureNBAProgress();t.refreshSeasonConfig();
const games=t.getGames(),dynamic=st.dynamicGames||[],cup=st.nbaCup;
if(games.length!==1230)throw new Error('expected 1230 regular-season games, got '+games.length);
if(Object.keys(st.results).length!==1230)throw new Error('expected 1230 results, got '+Object.keys(st.results).length);
if(dynamic.length!==30)throw new Error('expected 30 dynamic games, got '+dynamic.length);
const stages=dynamic.reduce((o,g)=>(o[g.cup_stage]=(o[g.cup_stage]||0)+1,o),{});
for(const [k,n] of Object.entries({quarterfinal:4,non_qualifier:22,semifinal:2,quarterfinal_loser:2}))if(stages[k]!==n)throw new Error(k+' expected '+n+' got '+stages[k]);
const allTeams=[...new Set(t.getBaseGames().flatMap(g=>[g.home,g.away]))];
for(const a of allTeams){const gs=games.filter(g=>g.home===a||g.away===a);if(gs.length!==82)throw new Error(a+' games '+gs.length);const rs=gs.filter(g=>st.results[g.id]);if(rs.length!==82)throw new Error(a+' results '+rs.length)}
if(!cup?.championshipGame||!cup?.championshipResult||!cup?.champion)throw new Error('Cup championship not completed');
if(st.results[cup.championshipGame.id])throw new Error('Cup Final incorrectly counted as regular-season result');
if(!(st.cupHistory||[]).some(x=>x.year===2026&&x.champion===cup.champion))throw new Error('Cup history missing');
const group=t.getBaseGames().filter(g=>g.nba_cup_group);const cupCompetitionGames=group.length+stages.quarterfinal+stages.semifinal+1;if(cupCompetitionGames!==67)throw new Error('Cup competition games '+cupCompetitionGames);
for(const a of allTeams){const gp=group.filter(g=>g.home===a||g.away===a);if(gp.length!==4)throw new Error(a+' Cup group games '+gp.length)}
// The championship is excluded from NBA regular-season player totals, so no player can reach 83 GP solely from the Cup final.
const maxGp=Math.max(...Object.values(st.seasonStats).map(x=>x.gp||0));if(maxGp>82)throw new Error('regular-season player GP exceeds 82: '+maxGp);
console.log(JSON.stringify({assigned:t.getBaseGames().length,dynamicRegularSeason:dynamic.length,totalRegularSeason:games.length,results:Object.keys(st.results).length,dynamicStages:stages,cupCompetitionGames,cupChampion:cup.champion,cupFinal:`${cup.championshipGame.away} ${cup.championshipResult.away_score}-${cup.championshipResult.home_score} ${cup.championshipGame.home}`,maxPlayerGP:maxGp},null,2));
