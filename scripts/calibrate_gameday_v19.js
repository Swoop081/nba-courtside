const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const dataJs=fs.readFileSync(path.join(root,'data/data.js'),'utf8'),schedJs=fs.readFileSync(path.join(root,'data/schedule.js'),'utf8');
const pre={console,structuredClone,Date,URLSearchParams};pre.window=pre;vm.createContext(pre);vm.runInContext(dataJs,pre);vm.runInContext(schedJs,pre);
const D=pre.NBA_COURTSIDE_DATA,S=pre.NBA_COURTSIDE_SCHEDULE,cert=JSON.parse(fs.readFileSync(path.join(root,'data/certification-v0.19.json'),'utf8'));
const assignments={};for(const p of D.players)assignments[p.id]=p.roster_status==='restricted_free_agent_unsigned'?null:p.team;
const sample=S.games.filter((_,i)=>i%11===0).slice(0,96);
let totals={pts:0,reb:0,ast:0,stl:0,blk:0,tov:0,fgm:0,fga:0,three_pm:0,three_pa:0,ftm:0,fta:0,pf:0},teamGames=0,poss=0,boxErrors=0,minuteErrors=0;
function simulate(gameDef,n){
 const save={version:16,userTeam:gameDef.home,seasonYear:2026,date:gameDef.date,phase:'regular_season',seasonStarted:true,seasonComplete:false,assignments:{...assignments},statusOverrides:{},salaryOverrides:{},results:{},seasonStats:{},gameLogs:{},rotations:{},generatedPlayers:[],playerOverrides:{},injuries:{},injuryHistory:[],injuryRotationBackups:{},transactions:[],rng:(20260819+n*7919)>>>0};
 const store={nbaCourtsideSaveV16:JSON.stringify(save)};
 let src=fs.readFileSync(path.join(root,'gameday.js'),'utf8');
 src=src.replace(/function render\(scrollTop=false\)\{[^\n]*\}/,'function render(){}').replace(/function bind\(\)\{[^\n]*\}/,'function bind(){}').replace(/function maybeLiveInjury\(\)\{[^\n]*\}/,'function maybeLiveInjury(){}').replace(/window\.addEventListener\('beforeunload',stopLive\);[\s\S]*?\}\)\(\);$/m,`window.__cal={startGame,simGame,getGame:()=>game,getSave:()=>save,getRotations:()=>rotations};\n})();`);
 const ctx={console,structuredClone,Date,URLSearchParams,setInterval:()=>0,clearInterval:()=>{},setTimeout:(f)=>f(),window:{},location:{search:'?game='+gameDef.id+'&mode=watch'},document:{documentElement:{style:{setProperty(){}}},querySelector(){return null},querySelectorAll(){return[]}},localStorage:{getItem(k){return store[k]||null},setItem(k,v){store[k]=v}},Math};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(src,ctx);ctx.__cal.startGame(false);ctx.__cal.simGame();return {r:ctx.__cal.getSave().results[gameDef.id],game:ctx.__cal.getGame(),rot:ctx.__cal.getRotations()};
}
for(let i=0;i<sample.length;i++){
 const {r,game,rot}=simulate(sample[i],i);if(!r)throw new Error('missing result '+sample[i].id);poss+=r.possessions;
 for(const side of ['home','away']){teamGames++;const lines=r.box[side],expected=side==='home'?r.home_score:r.away_score;if(lines.reduce((a,x)=>a+x.pts,0)!==expected)boxErrors++;const expectedMinutes=game.period>4?240+(game.period-4)*25:240,rawMinutes=rot[side].players.reduce((sum,p)=>sum+(game.stats[p.id]?.min||0),0);if(Math.abs(rawMinutes-expectedMinutes)>.15)minuteErrors++;for(const l of lines){totals.pts+=l.pts||0;totals.reb+=l.reb||0;totals.ast+=l.ast||0;totals.stl+=l.stl||0;totals.blk+=l.blk||0;totals.tov+=l.tov||0;totals.fgm+=l.fgm||0;totals.fga+=l.fga||0;totals.three_pm+=l.tpm||0;totals.three_pa+=l.tpa||0;totals.ftm+=l.ftm||0;totals.fta+=l.fta||0;totals.pf+=l.pf||0;}}
}
const perTeam=Object.fromEntries(Object.entries(totals).map(([k,v])=>[k,v/teamGames])),target=cert.final_2025_26_team_targets,comparison={};
for(const [k,v] of Object.entries(perTeam)){if(target[k]!=null)comparison[k]={sim:+v.toFixed(3),target:+target[k].toFixed(3),delta_pct:+(((v-target[k])/target[k])*100).toFixed(2)}}
const out={version:'v0.19',kind:'detailed_gameday_engine',sample_games:sample.length,team_games:teamGames,possessions_per_game:poss/sample.length,per_team:Object.fromEntries(Object.entries(perTeam).map(([k,v])=>[k,+v.toFixed(3)])),comparison_to_final_2025_26:comparison,box_score_point_errors:boxErrors,rotation_minute_errors:minuteErrors,note:'Injuries disabled only for calibration isolation; same possession engine and rotation scheduler otherwise used.'};
fs.writeFileSync(path.join(root,'data/gameday-calibration-v0.19.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
