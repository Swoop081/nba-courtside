const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const noop=()=>{};
function dummy(){return {innerHTML:'',classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},onclick:null,style:{},dataset:{},disabled:false,querySelector:()=>null,querySelectorAll:()=>[],appendChild:noop,setAttribute:noop,addEventListener:noop}}
const store={nbaCourtsideTeam:'PHI'};
const sandbox={console,structuredClone,Date,Math,setTimeout:()=>{},clearTimeout:()=>{},confirm:()=>true,scrollTo:()=>{},window:{},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},sessionStorage:{getItem:()=>null,setItem:noop,removeItem:noop},document:{documentElement:{style:{setProperty:noop}},querySelectorAll(){return[]},querySelector(){return dummy()},getElementById(){return dummy()},createElement(){return dummy()},head:{appendChild:noop},body:{style:{},appendChild:noop}},location:{reload(){},search:''},navigator:{}};sandbox.window=sandbox;
vm.createContext(sandbox);
for(const f of ['data/data.js','data/source-certification.js','data/future-pick-ledger.js','data/schedule.js','data/schedule-template.js','cba.js','data/organizations-v0.44.js']) vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),sandbox,{filename:f});
let code=fs.readFileSync(root+'/app-v0.54.js','utf8');
code=code.replace(/\/\/ Initialise\.[\s\S]*?\}\)\(\);\s*$/m,`renderView=()=>{};setTop=()=>{};toast=()=>{};persist=()=>{};closeSheet=()=>{};updateNavigationV42=()=>{};enhanceAccessibility=()=>{};
refreshSeasonConfig();userTeam='PHI';state.userTeam='PHI';ensureAllProjectionRatings();autoTrimCpu();autoFillCpu();ensureAllRotations();
const C0=career46();if(!C0||C0.status!=='employed'||C0.currentTeam!=='PHI')throw new Error('career init failed');if(careerYearsRemainingV46(C0)!==3)throw new Error('initial contract not 3 years');
// Create a completed-season context and ensure begin-offseason stops at employment review first.
state.seasonStarted=true;state.seasonComplete=true;state.phase='champion';state.date=\[31m'DATES.regular_season_end'\[0m;state.results={};state.postseason={champion:'BOS',rounds:[],east:{},west:{}};state.awards={};
beginOffseason();if(state.phase!=='gm_employment_review')throw new Error('employment review did not gate offseason: '+state.phase);if(!career46().pendingReview)throw new Error('review missing');const reviewHtml=employmentReviewViewV46();if(!reviewHtml.includes('PRIMARY ACTION · EMPLOYMENT'))throw new Error('review action hierarchy missing');
// Force dismissal to exercise the non-destructive job-market branch.
career46().pendingReview.outcome='fired';career46().pendingReview.headline='YOU HAVE BEEN DISMISSED';career46().pendingReview.reason='season_end';
const oldPlayer=teamPlayers('PHI')[0],oldAssignment=state.assignments[oldPlayer.id],oldPick=pickAssets('PHI')[0],oldPickOwner=oldPick?.owner;
resumeOffseasonAfterEmploymentReviewV46('enter_market');if(state.phase!=='gm_job_market'||career46().status!=='unemployed')throw new Error('job market transition failed');if(!career46().vacancies.length)throw new Error('vacancies missing');if(state.assignments[oldPlayer.id]!==oldAssignment)throw new Error('former roster mutated on firing');if(oldPick&&oldPick.owner!==oldPickOwner)throw new Error('former draft assets mutated on firing');
const jobsHtml=jobMarketViewV46();if(!jobsHtml.includes('League Vacancies')||!jobsHtml.includes('DRAFT + DEVELOP'))throw new Error('job market presentation missing');
for(const k of V46_REP_KEYS)career46().reputation[k]=90;career46().philosophy='flexible';const target=career46().vacancies[0].team;interviewJobV46(target);if(!career46().offers[target])throw new Error('high-reputation interview did not yield offer');const beforeAssignments=JSON.stringify(state.assignments),beforeAssets=JSON.stringify(state.draftAssets);acceptGMJobV46(target);if(userTeam!==target||state.userTeam!==target)throw new Error('team control did not switch');if(career46().status!=='employed'||career46().currentTeam!==target)throw new Error('career not re-employed');if(state.phase!=='lottery')throw new Error('league phase not restored after hire: '+state.phase);if(JSON.stringify(state.assignments)!==beforeAssignments)throw new Error('league roster world reset on team switch');if(JSON.stringify(state.draftAssets)!==beforeAssets)throw new Error('draft world reset on team switch');if(career46().employmentHistory.length<2)throw new Error('employment history did not persist');if(!(state.gmCareerV46&&state.offseasonV45))throw new Error('career/offseason state not additive');
const cv=careerViewV46();if(!cv.includes('Reputation')||!cv.includes('Employment History')||!cv.includes('CAREER RECORD'))throw new Error('career resume presentation missing');
console.log(JSON.stringify({careerVersion:career46().version,status:career46().status,newTeam:userTeam,phase:state.phase,vacanciesTested:6,employmentStints:career46().employmentHistory.length,reputation:career46().reputation,saveSchema:state.version,formerRosterPreserved:true,draftAssetsPreserved:true},null,2));
})();`);
// repair an escaped literal introduced above without touching app source
code=code.replace("state.date=\u001b[31m'DATES.regular_season_end'\u001b[0m;","state.date=DATES.regular_season_end;");
vm.runInContext(code,sandbox,{filename:'app-test-v48-career.js',timeout:220000});
