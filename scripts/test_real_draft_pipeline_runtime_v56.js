const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),noop=()=>{};
function dummy(){return {innerHTML:'',textContent:'',classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},onclick:null,style:{},dataset:{},disabled:false,appendChild:noop,insertAdjacentHTML:noop,setAttribute:noop,querySelector:()=>dummy(),querySelectorAll:()=>[],addEventListener:noop}}
const store={};
const sandbox={console,structuredClone,Date,Math,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:()=>{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{documentElement:{style:{setProperty:noop}},head:{appendChild:noop},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild(){},addEventListener:noop},addEventListener:noop},location:{reload(){},search:''},navigator:{},URLSearchParams};sandbox.window=sandbox;
vm.createContext(sandbox);
for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js','data/historical-universes-v0.56.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),sandbox,{filename:f});
let code=fs.readFileSync(root+'/app-v0.56.js','utf8');
code=code.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`renderView=()=>{};setTop=()=>{};toast=()=>{};persist=()=>{};closeSheet=()=>{};
state=createHistoricalStateV54('historical-2018-19-opening-night');userTeam='MEM';state.userTeam='MEM';rebuildPlayerIndex();refreshSeasonConfig();ensureCbaState();
const expected={2019:['Zion Williamson',60],2020:['Anthony Edwards',60],2021:['Cade Cunningham',60],2022:['Paolo Banchero',60],2023:['Victor Wembanyama',60],2024:['Zaccharie Risacher',60],2025:['Cooper Flagg',60],2026:['AJ Dybantsa',60]};
const report=[];
for(const year of Object.keys(expected).map(Number)){
  // Isolate each generation while retaining the historical universe and base/historical player pool.
  state.seasonYear=year;
  state.draft={generated:false,prospectIds:[],order:[],originOrder:[],pickIndex:0,selections:[]};
  state.generatedPlayers=(state.generatedPlayers||[]).filter(p=>!String(p.id||'').startsWith('real-'));
  rebuildPlayerIndex();
  generateDraftClass();
  const ids=state.draft.prospectIds||[], ps=ids.map(id=>byId.get(id)).filter(Boolean);
  if(ps.length!==60)throw new Error(year+' class size '+ps.length);
  if(ps[0].name!==expected[year][0])throw new Error(year+' first identity '+ps[0].name);
  if(ps.some(p=>p.historicalDraftV54?.realDraftYear!==year))throw new Error(year+' missing historical metadata');
  if(ps.some(p=>!String(p.id).startsWith('real-'+year+'-')))throw new Error(year+' id namespace');
  const raw=realDraftClassV54(year), und=ps.filter(p=>p.historicalDraftV54?.entryType==='undrafted');
  if(und.length!==(raw.undraftedEntrantCount||0))throw new Error(year+' undrafted count '+und.length);
  if(und.some(p=>p.historicalDraftV54.officialHistoricalPick!==null||p.historicalDraftV54.officialHistoricalTeam!==null))throw new Error(year+' undrafted metadata not null');
  report.push({year,count:ps.length,first:ps[0].name,last:ps[59].name,undrafted:und.map(p=>p.name),firstHistoricalTeam:ps[0].historicalDraftV54.officialHistoricalTeam});
}
// Confirm historical destination is metadata only on a new class, not just 2019/2026.
state.seasonYear=2023;state.draft={generated:false,prospectIds:[],order:[],originOrder:[],pickIndex:0,selections:[]};state.generatedPlayers=(state.generatedPlayers||[]).filter(p=>!String(p.id||'').startsWith('real-'));rebuildPlayerIndex();generateDraftClass();const w=byId.get(state.draft.prospectIds[0]);state.draft.order[0]='BOS';state.draft.originOrder[0]='BOS';signDraftPick(w,'BOS',1);if(currentTeam(w)!=='BOS'||w.historicalDraftV54.officialHistoricalTeam!=='SAS')throw new Error('2023 alternate destination coupling');
console.log(JSON.stringify({classes:report,alternateTest:{player:w.name,alternateTeam:currentTeam(w),historicalTeam:w.historicalDraftV54.officialHistoricalTeam},realDraftYears:state.historicalUniverseV54.realDraftYears},null,2));
})();`);
vm.runInContext(code,sandbox,{filename:'app-v0.56-real-pipeline-runtime.js',timeout:120000});
