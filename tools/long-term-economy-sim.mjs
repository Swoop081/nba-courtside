import { createProfile } from '../js/data/profile.js';
import { grantBooster, grantVictoryBooster, grantSuperPack, openBooster, openSuperPack, finalizePackUniversePoints, boosterCreditsFor, superPackCreditsFor, boosterEligible } from '../js/data/boosters.js';
import { activeLiveEventTowers } from '../js/data/live-events.js';
import { awardMatchSeasonXp, awardSeasonXp, claimAllSeasonTiers, claimFreeSeasonBooster, seasonTier } from '../js/data/seasons.js';
import { STORE_SET_ROTATION, STORE_SUPERSTAR_PRICE, storeRotation, storeSuperstars, purchaseStoreSuperstar } from '../js/data/store.js';
import { collectionCards } from '../js/data/collection.js';

const DAY=86400000;
// v0.13.36 victory-pack economy model. Future Season 1 subsets enter the
// live economy automatically on their canonical release dates via the same
// release helpers used by player-facing systems.
const START=new Date(2026,7,18,12,0,0);
const HORIZONS=new Set([7,30,60,90]);
const styles={
 casual:{active:.43,dailyClear:.60,threeDay:.30,weekly:.30,birthday:.30,dailyChallenges:1,weeklyChallenges:1,otherMatches:1,winRate:.52},
 regular:{active:.86,dailyClear:.85,threeDay:.80,weekly:.85,birthday:.75,dailyChallenges:2,weeklyChallenges:2,otherMatches:2,winRate:.55},
 heavy:{active:1,dailyClear:1,threeDay:1,weekly:1,birthday:1,dailyChallenges:3,weeklyChallenges:3,otherMatches:3,winRate:.58},
};
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function openAll(p,r,stats,now){
 const setIds=[...new Set([...STORE_SET_ROTATION,...Object.keys(p.boosterCreditsBySet??{}),...Object.keys(p.superPackCreditsBySet??{})])];
 for(const setId of setIds){
  while(boosterCreditsFor(p,setId)>0){
   const beforeStars=p.unlockedSuperstars.length; const pack=openBooster(p,r,setId,now); stats.packs++;
   const dup=finalizePackUniversePoints(p,pack); stats.dupUp+=dup; stats.totalUpEarned+=dup;
   stats.packStarUnlocks += Math.max(0,p.unlockedSuperstars.length-beforeStars);
  }
  while(superPackCreditsFor(p,setId)>0){
   const beforeStars=p.unlockedSuperstars.length; const pack=openSuperPack(p,r,setId,now); stats.packs++; stats.superPacks++;
   const dup=finalizePackUniversePoints(p,pack); stats.dupUp+=dup; stats.totalUpEarned+=dup;
   stats.packStarUnlocks += Math.max(0,p.unlockedSuperstars.length-beforeStars);
  }
 }
}
function snapshot(p,stats,now){
 const releasedCards=collectionCards.filter(c=>boosterEligible(c,now));
 let capped=0; for(const c of releasedCards){ const own=p.ownedCards?.[c.id]; const n=(own?.normal||0)+(own?.foil||0); const cap=(c.kind==='superstar'||c.kind==='entrance'||c.kind==='manager')?1:(c.kind==='momentum'?15:(c.maxCopies??5)); if(n>=cap)capped++; }
 return {balance:p.universePoints,earned:stats.totalUpEarned,directLive:stats.liveUp,duplicate:stats.dupUp,season:stats.seasonUp,spentStars:stats.starSpend,storeStars:stats.storeStars,packStarUnlocks:stats.packStarUnlocks,unlocked:p.unlockedSuperstars.length,packs:stats.packs,superPacks:stats.superPacks,tier:seasonTier(p),cappedPct:+(100*capped/Math.max(1,releasedCards.length)).toFixed(1)};
}
function simulate(kind,seed){
 const cfg=styles[kind],r=rng(seed),p=createProfile('cm-punk');
 const stats={packs:0,superPacks:0,dupUp:0,totalUpEarned:0,liveUp:0,seasonUp:0,starSpend:0,storeStars:0,packStarUnlocks:0};
 const seenTowerKeys=new Set(); const out={};
 for(let di=1;di<=90;di++){
  const now=new Date(START.getTime()+(di-1)*DAY); const active=r()<cfg.active;
  if(active){
   // Daily free booster.
   claimFreeSeasonBooster(p,r,now);
   // Daily challenges.
   for(let i=0;i<cfg.dailyChallenges;i++){grantBooster(p,1,'summerslam-series-1'); awardSeasonXp(p,25,'challenge');}
   // Other matches.
   for(let i=0;i<cfg.otherMatches;i++){const result=r()<cfg.winRate?'win':'loss'; awardMatchSeasonXp(p,result); grantVictoryBooster(p,result,'summerslam-series-1');}
   // Active tower participation. A rotating tower is attempted only once per key.
   for(const tower of activeLiveEventTowers(now)){
    if(seenTowerKeys.has(tower.key)) continue;
    let prob=tower.cadence==='daily'?cfg.dailyClear:tower.cadence==='three-day'?cfg.threeDay:tower.cadence==='weekly'?cfg.weekly:cfg.birthday;
    // For non-daily towers, defer the decision until an active day but only mark seen after decision.
    if(r()<prob){
      for(let m=0;m<5;m++){p.universePoints+=tower.winUp; stats.liveUp+=tower.winUp; stats.totalUpEarned+=tower.winUp; awardMatchSeasonXp(p,'win'); if(m<4) grantVictoryBooster(p,'win',tower.event.rewardSetId);}
      // The fifth win completes the tower: Super Pack only, no extra normal victory booster.
      grantSuperPack(p,1,tower.event.rewardSetId);
    }
    seenTowerKeys.add(tower.key);
   }
  }
  // Weekly challenge bundle on Sunday if player was active at least in the modeled style.
  if(now.getDay()===0 && r()<cfg.active){
    for(let i=0;i<cfg.weeklyChallenges;i++){grantBooster(p,2,'summerslam-series-1'); awardSeasonXp(p,100,'challenge');}
  }
  // Claim all newly reached Season tiers; track only direct season UP here.
  const before=p.universePoints; claimAllSeasonTiers(p,now); const seasonGain=p.universePoints-before; stats.seasonUp+=seasonGain; stats.totalUpEarned+=seasonGain;
  // Open every earned pack and convert any excess duplicates.
  openAll(p,r,stats,now);
  // Buy any available unowned Store Superstars whenever enough UP exists.
  const rot=storeRotation(now); let guard=0;
  while(p.universePoints>=STORE_SUPERSTAR_PRICE && guard++<8){const candidate=storeSuperstars(rot.setId,now).find(s=>!p.unlockedSuperstars.includes(s.id)); if(!candidate)break; purchaseStoreSuperstar(p,candidate.id,now); stats.starSpend+=STORE_SUPERSTAR_PRICE; stats.storeStars++;}
  if(HORIZONS.has(di)) out[di]=snapshot(p,stats,now);
 }
 return out;
}
function q(arr,p){const s=[...arr].sort((a,b)=>a-b);return s[Math.floor((s.length-1)*p)];}
for(const kind of Object.keys(styles)){
 const reps=[]; for(let i=0;i<80;i++)reps.push(simulate(kind,1000+i*7919+kind.length*17));
 console.log('\n'+kind.toUpperCase());
 for(const d of [7,30,60,90]){
  const fields=['balance','earned','directLive','duplicate','season','spentStars','storeStars','packStarUnlocks','unlocked','packs','superPacks','tier','cappedPct'];
  const row={day:d}; for(const f of fields){const a=reps.map(x=>x[d][f]); row[f]={mean:+(a.reduce((s,v)=>s+v,0)/a.length).toFixed(1),p10:q(a,.1),p90:q(a,.9)};} console.log(JSON.stringify(row));
 }
}
