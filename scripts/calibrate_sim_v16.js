const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const dataJs=fs.readFileSync(path.join(root,'data/data.js'),'utf8');
const schedJs=fs.readFileSync(path.join(root,'data/schedule.js'),'utf8');
let src=fs.readFileSync(path.join(root,'app.js'),'utf8');
src=src.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`window.__cal={getState:()=>state,getGames:()=>games,getPlayers:()=>players,getTeams:()=>teams,refreshSeasonConfig,ensureAllRotations,simulateStandaloneGame,generateLines,overall,currentTeam,rotationPlayers,metrics};\n})();`);
src=src.replace(/function setTop\(\)\{[^\n]*\}/,'function setTop(){}').replace(/function renderView\(\)\{[^\n]*\}/,'function renderView(){}').replace(/function toast\(text\)\{[^\n]*\}/,'function toast(){}');
const store={nbaCourtsideTeam:'TOR'},noop=()=>{};
const ctx={console,structuredClone,Date,setTimeout:(f)=>f(),confirm:()=>true,scrollTo:noop,location:{reload:noop},window:{},document:{documentElement:{style:{setProperty:noop}},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({classList:{add:noop,remove:noop}}),body:{appendChild:noop,style:{}}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},Math};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(dataJs,ctx);vm.runInContext(schedJs,ctx);vm.runInContext(fs.readFileSync(path.join(root,'cba.js'),'utf8'),ctx);vm.runInContext(src,ctx);
const T=ctx.__cal,st=T.getState();st.userTeam='TOR';st.seasonYear=2026;st.assignments=Object.fromEntries(T.getPlayers().map(p=>[p.id,p.roster_status==='restricted_free_agent_unsigned'?null:p.team]));st.statusOverrides={};st.injuries={};st.rotations={};T.refreshSeasonConfig();T.ensureAllRotations();
const seasons=10,seasonRows=[],leaderAggregate=[];let totalTeamPts=0,totalTeamGames=0,totalMargin=0,homeWins=0,boxErrors=0,minuteErrors=0;
for(let s=0;s<seasons;s++){
  st.rng=(20260819+s*104729)>>>0;const rec=Object.fromEntries(T.getTeams().map(t=>[t.abbr,{w:0,l:0,pf:0,pa:0}]));const pTotals={};
  for(const g of T.getGames()){
    const score=T.simulateStandaloneGame(g.home,g.away),homeLines=T.generateLines(g.home,score.home_score),awayLines=T.generateLines(g.away,score.away_score);const hw=score.home_score>score.away_score;
    rec[g.home][hw?'w':'l']++;rec[g.away][hw?'l':'w']++;rec[g.home].pf+=score.home_score;rec[g.home].pa+=score.away_score;rec[g.away].pf+=score.away_score;rec[g.away].pa+=score.home_score;
    totalTeamPts+=score.home_score+score.away_score;totalTeamGames+=2;totalMargin+=Math.abs(score.home_score-score.away_score);if(hw)homeWins++;
    for(const [lines,expected] of [[homeLines,score.home_score],[awayLines,score.away_score]]){if(lines.reduce((a,x)=>a+x.pts,0)!==expected)boxErrors++;if(Math.abs(lines.reduce((a,x)=>a+x.min,0)-240)>.2)minuteErrors++;for(const l of lines){const p=pTotals[l.player_id]||(pTotals[l.player_id]={gp:0,min:0,pts:0,reb:0,ast:0,stl:0,blk:0});p.gp++;for(const k of ['min','pts','reb','ast','stl','blk'])p[k]+=l[k]||0;}}
  }
  const rows=Object.entries(rec).map(([team,r])=>({team,...r,pct:r.w/82,ppg:r.pf/82,diff:(r.pf-r.pa)/82})).sort((a,b)=>b.w-a.w||b.diff-a.diff);
  const leaders=Object.entries(pTotals).map(([id,x])=>({id,...x,ppg:x.pts/x.gp,rpg:x.reb/x.gp,apg:x.ast/x.gp,spg:x.stl/x.gp,bpg:x.blk/x.gp}));
  seasonRows.push({seed:s,best:rows[0],worst:rows.at(-1),teamPpgMin:Math.min(...rows.map(x=>x.ppg)),teamPpgMax:Math.max(...rows.map(x=>x.ppg))});leaderAggregate.push({scoring:[...leaders].sort((a,b)=>b.ppg-a.ppg).slice(0,5),assists:[...leaders].sort((a,b)=>b.apg-a.apg)[0],rebounds:[...leaders].sort((a,b)=>b.rpg-a.rpg)[0],blocks:[...leaders].sort((a,b)=>b.bpg-a.bpg)[0]});
}
const avg=(a,k)=>a.reduce((s,x)=>s+x[k],0)/a.length;
const firstLeader=leaderAggregate[0],byId=new Map(T.getPlayers().map(p=>[p.id,p.name]));
const out={version:'v0.16',kind:'quick_sim_core',seasons,team_games:totalTeamGames,metrics:{team_ppg:totalTeamPts/totalTeamGames,home_win_pct:homeWins/(totalTeamGames/2),average_margin:totalMargin/(totalTeamGames/2),average_best_wins:avg(seasonRows.map(x=>({v:x.best.w})),'v'),average_worst_wins:avg(seasonRows.map(x=>({v:x.worst.w})),'v'),average_team_ppg_low:avg(seasonRows.map(x=>({v:x.teamPpgMin})),'v'),average_team_ppg_high:avg(seasonRows.map(x=>({v:x.teamPpgMax})),'v'),box_score_point_errors:boxErrors,rotation_minute_errors:minuteErrors},sample_leaders:{scoring:firstLeader.scoring.map(x=>({name:byId.get(x.id)||x.id,ppg:+x.ppg.toFixed(1)})),assists:{name:byId.get(firstLeader.assists.id)||firstLeader.assists.id,apg:+firstLeader.assists.apg.toFixed(1)},rebounds:{name:byId.get(firstLeader.rebounds.id)||firstLeader.rebounds.id,rpg:+firstLeader.rebounds.rpg.toFixed(1)},blocks:{name:byId.get(firstLeader.blocks.id)||firstLeader.blocks.id,bpg:+firstLeader.blocks.bpg.toFixed(1)}}};
fs.writeFileSync(path.join(root,'data/simulation-calibration-v0.16.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
