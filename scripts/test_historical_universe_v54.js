const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),noop=()=>{};
function dummy(){return {innerHTML:'',textContent:'',classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},onclick:null,style:{},dataset:{},disabled:false,appendChild:noop,insertAdjacentHTML:noop,setAttribute:noop,querySelector:()=>dummy(),querySelectorAll:()=>[]}}
const store={};
const sandbox={console,structuredClone,Date,Math,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:()=>{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{documentElement:{style:{setProperty:noop}},head:{appendChild:noop},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild(){}}},location:{reload(){},search:''},navigator:{}};sandbox.window=sandbox;
vm.createContext(sandbox);
for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js','data/historical-universes-v0.54.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),sandbox,{filename:f});
let code=fs.readFileSync(root+'/app-v0.54.js','utf8');
code=code.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`renderView=()=>{};setTop=()=>{};toast=()=>{};persist=()=>{};closeSheet=()=>{};
// Current mode remains unchanged.
const current=newState();if(current.seasonYear!==2026||current.scheduleMode!=='official_2026'||current.historicalUniverseV54)throw new Error('current universe constructor changed');
// Historical state constructor.
state=createHistoricalStateV54();userTeam='CLE';state.userTeam='CLE';rebuildPlayerIndex();refreshSeasonConfig();ensureCbaState();
if(!historicalV54()||state.seasonYear!==2025||state.date!=='2026-04-13'||!state.seasonComplete)throw new Error('historical state metadata wrong');
if(games.length!==1230||Object.keys(state.results).length!==1230)throw new Error('historical results not fully seeded');
for(const t of teams){const r=record(t.abbr);if(r.w+r.l!==82)throw new Error(t.abbr+' historical record not 82');}
if(players.length<590)throw new Error('historical player pool too small '+players.length);
const incomingBase=basePlayers.filter(p=>p.career_status==='rookie_2026_projected');if(incomingBase.some(p=>currentTeam(p)!=null||currentStatus(p)!=='retired'))throw new Error('future 2026 base rookies leaked into 2025 roster');
const beforeRec=record('OKC');if(beforeRec.w<50)throw new Error('historical standings reconstruction implausible');
// Complete alternate postseason with retained engine.
beginPostseason();let waves=0;while(state.phase!=='champion'&&waves++<160){reconcilePostseason();const pending=activePostseasonGames();if(!pending.length){reconcilePostseason();continue}const d=pending[0].date;for(const g of pending.filter(x=>x.date===d))simulatePostseasonGame(g);reconcilePostseason()}
if(state.phase!=='champion')throw new Error('historical postseason did not finish');
// Cross the existing GM-employment + v0.45 option gate into the 2026 draft year.
beginOffseason();if(state.phase==='gm_employment_review'){career46().pendingReview.outcome='retained';resumeOffseasonAfterEmploymentReviewV46('continue')}
if(state.phase!=='offseason_options')throw new Error('historical offseason option gate missing '+state.phase);
for(const [id] of pendingOptionsV45())resolveTeamOptionV45(id,'exercise');continueOffseasonV45();
if(state.phase!=='lottery'||state.seasonYear!==2026)throw new Error('historical universe did not advance to 2026 lottery');
const ids=state.draft.prospectIds||[],real=ids.map(id=>byId.get(id)).filter(Boolean);if(real.length!==60||real.some(p=>!p.id.startsWith('real-2026-')))throw new Error('real 2026 60-player class not generated');
if(real[0].name!=='AJ Dybantsa'||real[1].name!=='Darryn Peterson'||real[2].name!=='Cameron Boozer')throw new Error('real 2026 class identity/order mismatch');
if(!real.every(p=>p.historicalDraftV54?.realDraftYear===2026))throw new Error('historical draft metadata missing');
// Real-world destination is metadata, never forced. Put the real No.1 identity on another team and confirm alternate assignment.
state.draft.order[0]='BOS';state.draft.originOrder[0]='BOS';state.draft.pickIndex=0;state.draft.selections=[];const aj=real[0];signDraftPick(aj,'BOS',1);if(currentTeam(aj)!=='BOS'||aj.historicalDraftV54.officialHistoricalTeam==='BOS')throw new Error('real historical destination was not decoupled');
if(!state.historicalUniverseV54.sourceBoundary||state.historicalUniverseV54.futureGeneratedFrom!==2028)throw new Error('historical source boundary/pipeline cutoff missing');
console.log(JSON.stringify({historicalStart:state.historicalUniverseV54.startId,seededGames:1230,playerPool:players.length,postseasonChampion:state.postseason?.champion,advancedYear:state.seasonYear,realDraftProspects:real.length,topThree:real.slice(0,3).map(p=>p.name),alternateNo1Team:currentTeam(aj),historicalNo1Team:aj.historicalDraftV54.officialHistoricalTeam,realDraftThrough:state.historicalUniverseV54.realDraftThrough,futureGeneratedFrom:state.historicalUniverseV54.futureGeneratedFrom},null,2));
})();`);
vm.runInContext(code,sandbox,{filename:'app-v0.54-historical-test.js',timeout:220000});
