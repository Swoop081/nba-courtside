const fs=require('fs'),vm=require('vm');
const root=require('path').resolve(__dirname,'..');
const noop=()=>{};const dummy=()=>({innerHTML:'',classList:{add:noop,remove:noop,toggle:noop},onclick:null,style:{},dataset:{},disabled:false});
const store={nbaCourtsideTeam:'PHI'};
const sandbox={console,structuredClone,Date,Math,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:()=>{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},document:{documentElement:{style:{setProperty:noop}},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},body:{style:{},appendChild(){}}},location:{reload(){},search:''},navigator:{}};sandbox.window=sandbox;
vm.createContext(sandbox);
for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),sandbox,{filename:f});
let code=fs.readFileSync(root+'/app.js','utf8');
code=code.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`renderView=()=>{};setTop=()=>{};toast=()=>{};persist=()=>{};closeSheet=()=>{};
refreshSeasonConfig();userTeam='PHI';state.userTeam='PHI';ensureAllProjectionRatings();autoTrimCpu();autoFillCpu();ensureAllRotations();
// Complete one regular season and postseason so the real offseason bridge is exercised.
state.seasonStarted=true;state.phase='regular_season';state.date=DATES.opening_day;state.results={};state.seasonStats={};for(const g of games)simulateGame(g);state.seasonComplete=true;generateAwards();beginPostseason();let waves=0;while(state.phase!=='champion'&&waves++<140){reconcilePostseason();const pending=activePostseasonGames();if(!pending.length){reconcilePostseason();continue}const d=pending[0].date;for(const g of pending.filter(x=>x.date===d))simulatePostseasonGame(g);reconcilePostseason()}
if(state.phase!=='champion')throw new Error('postseason did not finish');
beginOffseason();if(state.phase!=='lottery')throw new Error('expected lottery phase, got '+state.phase);if((state.draft?.prospectIds||[]).length!==60)throw new Error('draft class is not 60');
lotteryRevealAll();if(!state.draftExperience.lotteryComplete)throw new Error('lottery did not reveal');startScoutingHub();if(state.phase!=='scouting')throw new Error('scouting phase missing');
const first=byId.get(state.draft.prospectIds[0]),before=state.draftExperience.scoutingPoints;scoutProspect(first.id);workoutProspect(first.id);if((state.draftExperience.reports[first.id]?.level||0)<2)throw new Error('scouting did not deepen');if(state.draftExperience.scoutingPoints>=before)throw new Error('scouting points did not spend');
const b0=state.draftExperience.board[0],b1=state.draftExperience.board[1];moveBoard(b1,-1);if(state.draftExperience.board[0]!==b1)throw new Error('board reorder failed');moveBoard(b1,1);if(state.draftExperience.board[0]!==b0)throw new Error('board reorder restore failed');
startDraftNight();if(state.phase!=='draft')throw new Error('draft night phase missing');
let userSelections=0;while(state.draft.pickIndex<60){if(currentDraftTeam()===userTeam){const p=userBoardAvailable()[0]||draftAvailable()[0];userDraftPlayer(p.id);userSelections++}else cpuDraftOne()}
if(state.draft.selections.length!==60)throw new Error('draft selections '+state.draft.selections.length);const rookies=draftedByUser();if(rookies.length!==userSelections)throw new Error('user draft count mismatch');for(const x of rookies){if(contractYears(x.p).length!==4)throw new Error('rookie contract not 4 years for '+x.p.name)}
finishDraft();if(state.phase!=='free_agency')throw new Error('free agency did not open');for(let i=0;i<8&&state.freeAgency&&!state.freeAgency.complete;i++)advanceFreeAgencyDay();if(!state.freeAgency.complete)throw new Error('free agency incomplete');
enterTrainingCamp();if(state.phase!=='training_camp')throw new Error('training camp missing');while(signedCount(userTeam)>15){const cut=teamPlayers(userTeam).sort((a,b)=>assetScore(a)-assetScore(b))[0];waivePlayer(cut,userTeam,{cpu:true})}while(signedCount(userTeam)<15){const p=freeAgents().sort((a,b)=>overall(b)-overall(a))[0];if(!p)throw new Error('cannot fill roster');state.assignments[p.id]=userTeam;state.statusOverrides[p.id]='active'}
startNextSeason();if(state.phase!=='regular_season'||!state.seasonStarted)throw new Error('next season did not start');if(signedCount(userTeam)!==15)throw new Error('opening roster not 15');
console.log(JSON.stringify({version:state.version,champion:state.history.at(-1)?.champion,lotterySlots:16,prospects:60,scoutingSpent:before-state.draftExperience?.scoutingPoints||'reset',draftSelections:60,userSelections,freeAgencyComplete:true,trainingCamp:true,nextSeason:CAP.season,openingRoster:signedCount(userTeam),rotationMinutes:Object.values(ensureRotation(userTeam).minutes).reduce((a,b)=>a+(+b||0),0)},null,2));
})();`);
vm.runInContext(code,sandbox,{filename:'app-test-v16-offseason.js',timeout:220000});
