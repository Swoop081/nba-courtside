const fs=require('fs'), vm=require('vm');
const dataJs=fs.readFileSync('/mnt/data/NBA-Courtside-Game-Day-v0.7/data/data.js','utf8');
let src=fs.readFileSync('/mnt/data/NBA-Courtside-Game-Day-v0.7/exhibition.js','utf8');
// Neutralize DOM rendering and expose internals for a deterministic smoke test.
src=src.replace(/function render\(scrollTop=false\)\{[^\n]*\}/, 'function render(){}');
src=src.replace(/window\.addEventListener\('beforeunload',stopLive\);\nrender\(\);\n\}\)\(\);/, `window.__test={
  buildRotation, startingFive, setMatch:(a,h)=>{awayTeam=a;homeTeam=h;setColors();rotations={home:buildRotation(homeTeam,'balanced'),away:buildRotation(awayTeam,'balanced')};},
  startGame, simGame, possessionEvent, getGame:()=>game, getRotations:()=>rotations, teamPlayers, overall
};\n})();`);
let seed=6062026; const seededMath=Object.create(Math); seededMath.random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
const ctx={console,structuredClone,Math:seededMath,setInterval:()=>0,clearInterval:()=>{},window:{},document:{documentElement:{style:{setProperty(){}}},querySelector(){return null},querySelectorAll(){return[]}},localStorage:{getItem(){return null}},location:{},confirm(){return true}};
ctx.window=ctx; vm.createContext(ctx); vm.runInContext(dataJs,ctx); vm.runInContext(src,ctx);
const t=ctx.__test;
if(!t) throw new Error('test hooks missing');
const teams=ctx.NBA_COURTSIDE_DATA.league.teams.map(x=>x.abbr);
for(const ab of teams){for(const mode of ['tight','balanced','deep']){const r=t.buildRotation(ab,mode);const sum=[...r.targets.values()].reduce((a,b)=>a+b,0);if(sum!==240)throw new Error(`${ab} ${mode} target minutes ${sum}`);if(r.starters.length!==5)throw new Error(`${ab} starters ${r.starters.length}`);if(r.players.length<8)throw new Error(`${ab} rotation too short`);if(r.schedule.length!==48)throw new Error(`${ab} schedule ${r.schedule.length}`);for(const m of r.schedule)if(m.length!==5||new Set(m.map(x=>x.id)).size!==5)throw new Error(`${ab} invalid lineup`)}}
let totals=[];
for(let i=0;i<30;i++){
 const a=teams[(i*7)%teams.length],h=teams[(i*11+3)%teams.length]; if(a===h) continue;
 t.setMatch(a,h); t.startGame(); t.simGame(); const g=t.getGame();
 if(!g.final)throw new Error('game did not finish');
 if(g.homeScore===g.awayScore)throw new Error('tie final');
 const rh=t.getRotations();
 for(const side of ['home','away']){const sum=rh[side].players.reduce((s,p)=>s+g.stats[p.id].min,0);const expected=g.period>4?240+(g.period-4)*25:240;if(Math.abs(sum-expected)>0.1)throw new Error(`${side} minute sum ${sum} expected ${expected}`)}
 totals.push([g.awayScore,g.homeScore,g.possessions,g.period]);
}
const avg=totals.reduce((s,x)=>s+x[0]+x[1],0)/(totals.length*2);const poss=totals.reduce((s,x)=>s+x[2],0)/totals.length;
console.log(JSON.stringify({teams:teams.length,games:totals.length,avgScore:+avg.toFixed(1),avgTotalPossessions:+poss.toFixed(1),sample:totals.slice(0,5)},null,2));
