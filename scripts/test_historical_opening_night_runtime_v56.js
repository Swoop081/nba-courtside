const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),noop=()=>{};
function dummy(){return {innerHTML:'',textContent:'',classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},onclick:null,style:{},dataset:{},disabled:false,appendChild:noop,insertAdjacentHTML:noop,setAttribute:noop,querySelector:()=>dummy(),querySelectorAll:()=>[],addEventListener:noop}}
const store={};
const sandbox={console,structuredClone,Date,Math,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:()=>{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{documentElement:{style:{setProperty:noop}},head:{appendChild:noop},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild(){},addEventListener:noop},addEventListener:noop},location:{reload(){},search:''},navigator:{},URLSearchParams};sandbox.window=sandbox;
vm.createContext(sandbox);
for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js','data/historical-universes-v0.56.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),sandbox,{filename:f});
let code=fs.readFileSync(root+'/app-v0.56.js','utf8');
code=code.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`renderView=()=>{};setTop=()=>{};toast=()=>{};persist=()=>{};closeSheet=()=>{};
const current=newState();if(current.seasonYear!==2026||current.scheduleMode!=='official_2026'||current.historicalUniverseV54)throw new Error('current universe constructor changed');
state=createHistoricalStateV54('historical-2018-19-opening-night');userTeam='MEM';state.userTeam='MEM';rebuildPlayerIndex();refreshSeasonConfig();ensureCbaState();ensureFuturePickHorizon();ensureAllRotations();
if(!historicalV54()||state.seasonYear!==2018||state.date!=='2018-10-16'||state.seasonComplete)throw new Error('2018 opening state metadata wrong');
if(games.length!==1230||Object.keys(state.results).length!==0)throw new Error('2018 schedule/results state wrong');
if(DATES.trade_deadline!=='2019-02-07'||DATES.regular_season_end!=='2019-04-10')throw new Error('historical season dates wrong '+JSON.stringify(DATES));
if(CAP.salary_cap!==101869000||CAP.modern_second_apron!==false)throw new Error('historical cap state wrong');
const histPlayers=players.filter(p=>String(p.id).startsWith('hist-2018-'));if(histPlayers.length!==494)throw new Error('opening roster pool wrong '+histPlayers.length);
for(const [name,tm] of [['LeBron James','LAL'],['Luka Doncic','DAL'],['Kawhi Leonard','TOR'],['DeMar DeRozan','SAS']]){const p=histPlayers.find(x=>x.name===name);if(!p||currentTeam(p)!==tm)throw new Error(name+' opening team mismatch');}
// Simulate every historical regular-season matchup through the retained real game engine.
const dates=[...new Set(games.map(g=>g.date))].sort();for(const d of dates){state.date=d;processMedicalDay(d);for(const g of games.filter(x=>x.date===d&&!state.results[x.id]))simulateGame(g);}
if(Object.keys(state.results).length!==1230)throw new Error('not all 1230 historical games simulated');const completedRegularSeasonGames=Object.keys(state.results).length;
for(const t of teams){const r=record(t.abbr);if(r.w+r.l!==82)throw new Error(t.abbr+' simulated record not 82');}
state.date=DATES.regular_season_end;state.seasonComplete=true;state.phase='regular_season';generateAwards();
// Complete alternate postseason with the retained postseason engine.
beginPostseason();let waves=0;while(state.phase!=='champion'&&waves++<180){reconcilePostseason();const pending=activePostseasonGames();if(!pending.length){reconcilePostseason();continue}const d=pending[0].date;state.date=d;for(const g of pending.filter(x=>x.date===d))simulatePostseasonGame(g);reconcilePostseason()}
if(state.phase!=='champion')throw new Error('2018-19 alternate postseason did not finish');
const champion=state.postseason?.champion;
// Cross employment/options into 2019 lottery, where the real class must appear.
beginOffseason();if(state.phase==='gm_employment_review'){career46().pendingReview.outcome='retained';resumeOffseasonAfterEmploymentReviewV46('continue')}
if(state.phase!=='offseason_options')throw new Error('2019 offseason option gate missing '+state.phase);
for(const [id] of pendingOptionsV45())resolveTeamOptionV45(id,'exercise');continueOffseasonV45();
if(state.phase!=='lottery'||state.seasonYear!==2019)throw new Error('historical universe did not reach 2019 lottery '+state.phase+' '+state.seasonYear);
const ids=state.draft.prospectIds||[],real=ids.map(id=>byId.get(id)).filter(Boolean);if(real.length!==60||real.some(p=>!p.id.startsWith('real-2019-')))throw new Error('real 2019 60-player class not generated');
if(real[0].name!=='Zion Williamson'||real[1].name!=='Ja Morant'||real[2].name!=='RJ Barrett')throw new Error('real 2019 class order mismatch');
if(real[0].historicalDraftV54?.officialHistoricalTeam!=='NOP')throw new Error('Zion historical destination metadata missing');
// Alternate history: send Zion to Boston while preserving New Orleans as historical metadata.
state.draft.order[0]='BOS';state.draft.originOrder[0]='BOS';state.draft.pickIndex=0;state.draft.selections=[];const zion=real[0];signDraftPick(zion,'BOS',1);if(currentTeam(zion)!=='BOS'||zion.historicalDraftV54.officialHistoricalTeam!=='NOP')throw new Error('historical destination was forced instead of metadata');
console.log(JSON.stringify({start:state.historicalUniverseV54.startId,openingPlayers:histPlayers.length,regularSeasonGames:completedRegularSeasonGames,alternateChampion:champion,advancedYear:state.seasonYear,real2019Prospects:real.length,topThree:real.slice(0,3).map(p=>p.name),alternateZionTeam:currentTeam(zion),historicalZionTeam:zion.historicalDraftV54.officialHistoricalTeam,cap2019:CAP.salary_cap},null,2));
})();`);
vm.runInContext(code,sandbox,{filename:'app-v0.56-historical-opening-runtime.js',timeout:220000});
