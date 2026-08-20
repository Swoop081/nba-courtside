import { superstars } from "../js/data/superstars.js";
import { createProfile,unlockSuperstar } from "../js/data/profile.js";
import { grantBooster,openBooster } from "../js/data/boosters.js";
import { sets } from "../js/data/sets.js";
import { cardsForSet } from "../js/data/collection.js";
import { isLaunchLiveSetId } from "../js/data/release.js";

const stars=Object.values(superstars);
const starter=stars.find(s=>['cm-punk','roman-reigns'].includes(s.id))?.id;
if(!starter)throw new Error('No valid starter Superstar in build');
const p=createProfile(starter);
for(const s of stars)unlockSuperstar(p,s.id);
let packs=0,cards=0,entrances=0,duplicateEntrances=0,foilFirstFailures=0;
const seenEntrances=new Set();
for(const setId of Object.keys(sets).filter(id=>isLaunchLiveSetId(id)&&cardsForSet(id).some(c=>c.kind!=='entrance'))){
  for(let i=0;i<20;i++){
    grantBooster(p,1,setId);
    const pack=openBooster(p,setId);
    if(!pack.length)break;
    packs++;cards+=pack.length;
    for(const pull of pack.filter(c=>c.card?.kind==='entrance')){
      entrances++;
      if(seenEntrances.has(pull.card.id))duplicateEntrances++;
      seenEntrances.add(pull.card.id);
      if(!pull.foil)throw new Error(`${pull.card.id} Entrance was not Foil`);
    }
    if(!pack[0].foil)foilFirstFailures++;
  }
}
console.log(JSON.stringify({packs,cards,entrancesInBoosters:entrances,duplicateEntrancePulls:duplicateEntrances,foilFirstFailures},null,2));
if(duplicateEntrances||foilFirstFailures)process.exit(1);
