import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { allGameplayCards } from "../js/data/content.js";
const stars=Object.values(superstars),used=new Set();let issues=[];
for(const [sid,d] of Object.entries(decks)){if(d.length!==60)issues.push(`${sid}: ${d.length} pages`);if(d.filter(c=>c.kind==='momentum').length!==12)issues.push(`${sid}: Momentum != 12`);for(const c of d)used.add(c.id);const n={};for(const c of d)if(c.kind!=='momentum')n[c.id]=(n[c.id]||0)+1;for(const [id,k] of Object.entries(n))if(k>5)issues.push(`${sid}: ${id} x${k}`);}
const orphans=allGameplayCards.filter(c=>c.kind!=='entrance'&&!c.boosterOnly&&!used.has(c.id));if(orphans.length)issues.push(`orphan gameplay cards: ${orphans.map(c=>c.id).join(', ')}`);const finisherReqs=allGameplayCards.filter(c=>c.finisher&&Object.keys(c.requirements??{}).length);if(finisherReqs.length)issues.push(`finishers with Method requirements: ${finisherReqs.map(c=>c.id).join(', ')}`);
const summary={superstars:stars.length,decks:Object.keys(decks).length,gameplayCards:allGameplayCards.length,orphans:orphans.length,issues};console.log(JSON.stringify(summary,null,2));if(issues.length)process.exit(1);
