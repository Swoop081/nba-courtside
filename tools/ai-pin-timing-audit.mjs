import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner,cpuDecision,executeCpuDecision } from '../js/ai/WrestlingAI.js';
import { healthOnlyPinChance } from '../js/engine/health.js';
function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const stars=Object.values(superstars);let attempts=0,escapes=0;const bands={'0-9':{a:0,e:0},'10-19':{a:0,e:0},'20-29':{a:0,e:0},'30-39':{a:0,e:0},'40+':{a:0,e:0}};let escapeChanceTotal=0,lowEscape=0;
const by={};for(const s of stars)by[s.id]={esc:0,low:0,avg:0};
function band(c){return c<10?'0-9':c<20?'10-19':c<30?'20-29':c<40?'30-39':'40+';}
for(let i=0;i<stars.length;i++)for(let j=0;j<stars.length;j++)if(i!==j){const g=new MatchEngine({p1:stars[i],p2:stars[j],decks,rng:rng(63117+i*397+j*19)});let z=0;while(g.state().phase!=='MATCH_OVER'&&z++<1800){const s=g.state(),pid=decisionOwner(s);if(!pid)break;const d=cpuDecision(g,pid);if(!d)break;if(s.phase==='ACTION'&&d.type==='pin'){const def=s.players[pid==='p1'?'p2':'p1'];const c=healthOnlyPinChance(def);attempts++;bands[band(c)].a++;}if(s.phase==='PIN_RESPONSE'){const c=healthOnlyPinChance(s.players[pid]);if(d.type==='pinEscape'){escapes++;escapeChanceTotal+=c;bands[band(c)].e++;by[s.players[pid].superstar.id].esc++;by[s.players[pid].superstar.id].avg+=c;if(c<20){lowEscape++;by[s.players[pid].superstar.id].low++;}}}if(!executeCpuDecision(g,d,pid))break;}}
const top=Object.entries(by).filter(([,x])=>x.esc).map(([id,x])=>({id,esc:x.esc,low:x.low,lowPct:+(100*x.low/x.esc).toFixed(1),avgChance:+(x.avg/x.esc).toFixed(1)})).sort((a,b)=>b.lowPct-a.lowPct).slice(0,15);
console.log(JSON.stringify({attempts,escapes,avgEscapeChance:+(escapeChanceTotal/Math.max(1,escapes)).toFixed(1),lowEscape,lowEscapePct:+(100*lowEscape/Math.max(1,escapes)).toFixed(1),bands,top},null,2));
