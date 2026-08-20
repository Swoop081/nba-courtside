import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';

const card=id=>allGameplayCards.find(c=>c.id===id);

test('v0.13.32 RAW Leg Lariat remains locked; the later RAW Double Foot Stomp duplicate is superseded by v0.13.33',()=>{
  const lariat=card('leg-lariat');
  assert.deepEqual({set:lariat.setId,cost:lariat.cost,damage:lariat.damage,rarity:lariat.rarity,method:lariat.method,req:lariat.requirements.strike,counter:lariat.counterState,ground:lariat.groundOpponent,boosterOnly:lariat.boosterOnly},
    {set:'raw-series-1',cost:4,damage:7,rarity:2,method:'strike',req:2,counter:'running-aerial',ground:true,boosterOnly:true});
  assert.equal(CARD_NUMBER_BY_ID[lariat.id].cardCode,'RAW1-040');
});

test('v0.13.32 Worlds Collide and SmackDown shared additions keep their approved limb/submission roles',()=>{
  const arm=card('stomp-to-the-arm'), splash=card('top-rope-splash'), kick=card('kick-to-the-back'), chin=card('reverse-chin-lock');
  assert.deepEqual({set:arm.setId,cost:arm.cost,damage:arm.damage,rarity:arm.rarity,method:arm.method,req:arm.requirements.strike,counter:arm.counterState,groundedOnly:arm.groundedOnly,body:arm.bodyDamage},
    {set:'worlds-collide-series-1',cost:2,damage:3,rarity:1,method:'strike',req:1,counter:'leg-extended',groundedOnly:true,body:{bodyPart:'arms',pressure:1}});
  assert.deepEqual({set:splash.setId,cost:splash.cost,damage:splash.damage,rarity:splash.rarity,method:splash.method,req:splash.requirements.agility,counter:splash.counterState,groundedOnly:splash.groundedOnly},
    {set:'worlds-collide-series-1',cost:5,damage:8,rarity:2,method:'agility',req:2,counter:'diving-aerial',groundedOnly:true});
  assert.deepEqual({set:kick.setId,cost:kick.cost,damage:kick.damage,rarity:kick.rarity,method:kick.method,req:kick.requirements.strike,counter:kick.counterState,groundedOnly:kick.groundedOnly},
    {set:'smackdown-series-1',cost:2,damage:4,rarity:1,method:'strike',req:1,counter:'rear-control',groundedOnly:true});
  assert.deepEqual({set:chin.setId,cost:chin.cost,damage:chin.damage,rarity:chin.rarity,method:chin.method,req:chin.requirements.technical,counter:chin.counterState,groundedOnly:chin.groundedOnly,submission:chin.submission,target:chin.submissionTarget},
    {set:'smackdown-series-1',cost:3,damage:0,rarity:1,method:'technical',req:1,counter:'rear-control',groundedOnly:true,submission:{bodyPart:'head',pressure:3},target:'neck-head'});
  assert.equal(CARD_NUMBER_BY_ID[arm.id].cardCode,'WC1-035');
  assert.equal(CARD_NUMBER_BY_ID[splash.id].cardCode,'WC1-036');
  assert.equal(CARD_NUMBER_BY_ID[kick.id].cardCode,'SD1-036');
  assert.equal(CARD_NUMBER_BY_ID[chin.id].cardCode,'SD1-037');
});

test('v0.13.32 Survivor Series gains Death Valley Driver and Leg Kick at stable collector slots',()=>{
  const dvd=card('death-valley-driver'), kick=card('leg-kick');
  assert.deepEqual({set:dvd.setId,cost:dvd.cost,damage:dvd.damage,rarity:dvd.rarity,method:dvd.method,req:dvd.requirements.strength,counter:dvd.counterState,ground:dvd.groundOpponent,boosterOnly:dvd.boosterOnly},
    {set:'survivor-series-series-1',cost:7,damage:10,rarity:3,method:'strength',req:2,counter:'body-elevated',ground:true,boosterOnly:true});
  assert.deepEqual({set:kick.setId,cost:kick.cost,damage:kick.damage,rarity:kick.rarity,method:kick.method,req:kick.requirements.strike,counter:kick.counterState,body:kick.bodyDamage,boosterOnly:kick.boosterOnly},
    {set:'survivor-series-series-1',cost:2,damage:3,rarity:1,method:'strike',req:1,counter:'leg-extended',body:{bodyPart:'legs',pressure:1},boosterOnly:true});
  assert.equal(CARD_NUMBER_BY_ID[dvd.id].cardCode,'SVS1-051');
  assert.equal(CARD_NUMBER_BY_ID[kick.id].cardCode,'SVS1-052');
});
