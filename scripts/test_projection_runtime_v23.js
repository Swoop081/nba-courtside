const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),ctx={window:{},console};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'data/data.js'),'utf8'),ctx,{filename:'data.js'});
vm.runInContext(fs.readFileSync(path.join(root,'data/source-certification.js'),'utf8'),ctx,{filename:'source-certification.js'});
const P=ctx.NBA_COURTSIDE_DATA.players,SC=ctx.NBA_COURTSIDE_SOURCE_CERT; const assert=(x,m)=>{if(!x)throw new Error(m)};
const proj=P.filter(p=>p.rating_source==='projection_translation_model_v0.23'), fin=P.filter(p=>p.stat_source_status==='season_complete_verified');
assert(P.length===442,'442 players'); assert(fin.length===393,'393 final NBA after v0.24 Yanic repair'); assert(proj.length===49,'49 projections after v0.24 Yanic repair');
for(const p of proj){assert(p.stats_2025_26==null,p.name+' historical NBA stats must remain null');assert(p.ratings&&p.simulation_profile&&p.projection_2026_27,p.name+' projection runtime');assert(p.projection_confidence>=.5&&p.projection_confidence<=.9,p.name+' confidence');}
const by=id=>P.find(p=>p.id===id);
assert(by('tyrese-haliburton').projection_2026_27.source_type==='prior_nba_2024_25','Haliburton prior NBA source');
assert(by('aj-dybantsa').projection_2026_27.source_type==='ncaa_2025_26','Dybantsa NCAA source');
assert(by('mario-hezonja').projection_2026_27.source_type==='international_2025_26','Hezonja international source');
assert(SC.version==='v0.24'&&SC.projection_model.source_backed_players===49,'source certification v0.24');assert(by('yanic-niederhauser').stats_2025_26?.gp===41,'Yanic final NBA repair');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');assert(app.includes('rookie_2026_projected'),'rookie status recognized');assert(app.includes('projection_2026_27?.projected_mpg'),'projection minute prior wired');assert(app.includes('SOURCE-BACKED PROJECTION'),'projection source UI');
const gd=fs.readFileSync(path.join(root,'gameday.js'),'utf8');assert(gd.includes('projection_2026_27?.projected_mpg'),'Game Day projection minute prior wired');
console.log(JSON.stringify({status:'PASS',players:P.length,final_nba:fin.length,source_backed_projection:proj.length,source_cert:SC.version},null,2));
