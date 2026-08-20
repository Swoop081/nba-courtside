import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { moveEligibility } from '../js/engine/rules.js?v=0.13.72';
import { createProfile, grantSuperstarUnlockPackage, totalOwnedCopies } from '../js/data/profile.js?v=0.13.72';

const card=id=>allGameplayCards.find(c=>c.id===id);
const star=id=>Object.values(superstars).find(s=>s.id===id);
const count=(arr,id)=>arr.filter(c=>c.id===id).length;
const rng=()=>0.42;
function ready(){
  const ko=star('kevin-owens'), roman=star('roman-reigns');
  const g=new MatchEngine({p1:ko,p2:roman,decks:{[ko.id]:decks[ko.id],[roman.id]:decks[roman.id]},rng});
  const s=g.state(),p=s.players.p1,d=s.players.p2;
  p.momentum.strength=12;p.momentum.strike=12;p.momentum.agility=12;p.momentum.technical=12;
  d.hand=[];s.phase='ACTION';s.playerInControl='p1';
  return {g,s,p,d};
}

test('v0.13.30 approved Kevin Owens Rare Trademarks are locked and authored into his recommended deck',()=>{
  const avalanche=card('kevin-owens-avalanche-fishermans-buster');
  const swanton=card('kevin-owens-swanton-bomb');
  assert.deepEqual({cost:avalanche.cost,damage:avalanche.damage,method:avalanche.method,req:avalanche.requirements.strength,rarity:avalanche.rarity,trademark:avalanche.trademark,counter:avalanche.counterState},
    {cost:9,damage:14,method:'strength',req:3,rarity:3,trademark:true,counter:'body-elevated'});
  assert.deepEqual(avalanche.discountIfMethodConnectedThisControl,{method:'strike',amount:2});
  assert.deepEqual({cost:swanton.cost,damage:swanton.damage,method:swanton.method,req:swanton.requirements.agility,rarity:swanton.rarity,trademark:swanton.trademark,counter:swanton.counterState,groundedOnly:swanton.groundedOnly},
    {cost:7,damage:11,method:'agility',req:2,rarity:3,trademark:true,counter:'diving-aerial',groundedOnly:true});
  assert.deepEqual(swanton.bonusDamageIfMethodConnectedThisControl,{method:'strength',damage:2});
  assert.equal(count(decks['kevin-owens'],avalanche.id),2);
  assert.equal(count(decks['kevin-owens'],swanton.id),2);
});

test('v0.13.30 Kevin lean secondary unlock still grants Pop-Up Powerbomb as the single Trademark',()=>{
  const p=createProfile('roman-reigns');
  const unlock=grantSuperstarUnlockPackage(p,'kevin-owens',{celebrate:false});
  assert.ok(unlock.rewardCards.includes('pop-up-powerbomb'));
  assert.equal(totalOwnedCopies(p,'pop-up-powerbomb'),1);
  assert.equal(totalOwnedCopies(p,'kevin-owens-avalanche-fishermans-buster'),0);
  assert.equal(totalOwnedCopies(p,'kevin-owens-swanton-bomb'),0);
});

test('v0.13.30 Avalanche Fisherman’s Buster costs 2 less after a Strike earlier in the Control sequence',()=>{
  const {s,p}=ready(), avalanche=card('kevin-owens-avalanche-fishermans-buster');
  assert.equal(moveEligibility(s,'p1',avalanche).effectiveCost,9);
  p.events.connectedMethodsThisControl.strike=true;
  assert.equal(moveEligibility(s,'p1',avalanche).effectiveCost,7);
});

test('v0.13.30 KO’s Swanton Bomb gains +2 Damage after any Strength Move earlier in the Control sequence',()=>{
  const {g,s,p,d}=ready(), swanton=card('kevin-owens-swanton-bomb');
  d.posture='on-mat';p.events.connectedMethodsThisControl.strength=true;
  const before=d.hp;
  s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:swanton};
  g._connect();
  assert.equal(before-d.hp,13);
});

test('v0.13.30 Money in the Bank shared weapon package and Splash are locked at stable future collector slots',()=>{
  const trash=card('trash-can-to-the-back'),chair=card('chair-to-the-gut'),splash=card('splash');
  assert.deepEqual({cost:trash.cost,damage:trash.damage,rarity:trash.rarity,method:trash.method,req:trash.requirements.strike,counter:trash.counterState,weapon:trash.weapon,boosterOnly:trash.boosterOnly},
    {cost:4,damage:6,rarity:2,method:'strike',req:1,counter:'arm-extended',weapon:true,boosterOnly:true});
  assert.deepEqual(trash.bodyDamage,{bodyPart:'back',pressure:1});
  assert.deepEqual({cost:chair.cost,damage:chair.damage,rarity:chair.rarity,method:chair.method,req:chair.requirements.strike,counter:chair.counterState,weapon:chair.weapon,boosterOnly:chair.boosterOnly},
    {cost:4,damage:5,rarity:2,method:'strike',req:1,counter:'arm-extended',weapon:true,boosterOnly:true});
  assert.deepEqual(chair.effects,[{type:'discountNextMoveType',moveType:'grapple',amount:1}]);
  assert.deepEqual({cost:splash.cost,damage:splash.damage,rarity:splash.rarity,method:splash.method,req:splash.requirements.strength,counter:splash.counterState,boosterOnly:splash.boosterOnly},
    {cost:3,damage:5,rarity:1,method:'strength',req:1,counter:'running-aerial',boosterOnly:true});
  assert.equal(trash.setId,'money-in-the-bank-series-1');assert.equal(chair.setId,'money-in-the-bank-series-1');assert.equal(splash.setId,'money-in-the-bank-series-1');
  assert.equal(CARD_NUMBER_BY_ID[trash.id].cardCode,'MITB1-035');
  assert.equal(CARD_NUMBER_BY_ID[chair.id].cardCode,'MITB1-036');
  assert.equal(CARD_NUMBER_BY_ID[splash.id].cardCode,'MITB1-037');
  assert.equal(CARD_NUMBER_BY_ID['kevin-owens-avalanche-fishermans-buster'].cardCode,'SS1-146');
  assert.equal(CARD_NUMBER_BY_ID['kevin-owens-swanton-bomb'].cardCode,'SS1-147');
});

test('v0.13.30 Trash Can persistent Back damage and Chair Grapple setup resolve in-engine',()=>{
  const {g,s,p,d}=ready(),trash=card('trash-can-to-the-back'),chair=card('chair-to-the-gut'),grapple=card('body-slam');
  s.phase='RESOLVE_MOVE';s.proposedMove={attackerId:'p1',defenderId:'p2',card:trash};g._connect();
  assert.equal(d.submissionDamage.back,1);
  s.phase='RESOLVE_MOVE';s.playerInControl='p1';s.proposedMove={attackerId:'p1',defenderId:'p2',card:chair};g._connect();
  assert.equal(p.moveTypeDiscount.grapple,1);
  s.phase='ACTION';s.playerInControl='p1';
  assert.equal(moveEligibility(s,'p1',grapple).effectiveCost,Math.max(0,grapple.cost-1));
});
