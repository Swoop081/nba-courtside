import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from "../js/data/card-number-manifest.js?v=0.13.72";

const byId=id=>allGameplayCards.find(c=>c.id===id);

test("v0.13.65 adds Vertical Boston Crab as EVO1-075 shared Uncommon submission",()=>{
  const c=byId("vertical-boston-crab");
  assert.ok(c);
  assert.deepEqual({
    name:c.name,set:c.setId,cost:c.cost,damage:c.damage,rarity:c.rarity,method:c.method,
    requirements:c.requirements,moveType:c.moveType,counter:c.counterState,target:c.submissionTarget,
    submission:c.submission,groundedOnly:c.groundedOnly,boosterOnly:c.boosterOnly,effects:c.effects
  },{
    name:"Vertical Boston Crab",set:"evolution-series-1",cost:6,damage:0,rarity:2,method:"technical",
    requirements:{technical:2},moveType:"submission",counter:"rear-control",target:"back",
    submission:{bodyPart:"back",pressure:4},groundedOnly:true,boosterOnly:true,effects:[]
  });
  assert.equal(c.superstarId,null);
  assert.equal(CARD_NUMBER_BY_ID[c.id].cardCode,"EVO1-075");
  assert.equal(CARD_IDS_BY_SET["evolution-series-1"].length,75);
  assert.equal(CARD_IDS_BY_SET["evolution-series-1"].at(-1),c.id);
});

test("v0.13.65 adds a generic common Diving Shoulder Block without replacing Warrior's exclusive card",()=>{
  const generic=byId("diving-shoulder-block");
  const warrior=byId("ultimate-warrior-diving-shoulder-block");
  assert.ok(generic); assert.ok(warrior);
  assert.deepEqual({
    set:generic.setId,cost:generic.cost,damage:generic.damage,rarity:generic.rarity,method:generic.method,
    requirements:generic.requirements,moveType:generic.moveType,counter:generic.counterState,
    ground:generic.groundOpponent,boosterOnly:generic.boosterOnly
  },{
    set:"hall-of-fame-series-1",cost:4,damage:6,rarity:1,method:"agility",
    requirements:{agility:1},moveType:"aerial",counter:"diving-aerial",ground:true,boosterOnly:true
  });
  assert.equal(generic.superstarId,null);
  assert.equal(warrior.superstarId,"ultimate-warrior");
  assert.equal(warrior.rarity,3);
  assert.notEqual(generic.id,warrior.id);
  assert.equal(CARD_NUMBER_BY_ID[generic.id].cardCode,"HOF1-094");
  assert.equal(CARD_IDS_BY_SET["hall-of-fame-series-1"].length,94);
  assert.equal(CARD_IDS_BY_SET["hall-of-fame-series-1"].at(-1),generic.id);
});

test("v0.13.65 adds Springboard Roundhouse Kick as SD1-038 shared Rare",()=>{
  const c=byId("springboard-roundhouse-kick");
  assert.ok(c);
  assert.deepEqual({
    name:c.name,set:c.setId,cost:c.cost,damage:c.damage,rarity:c.rarity,method:c.method,
    requirements:c.requirements,moveType:c.moveType,counter:c.counterState,ground:c.groundOpponent,
    groundedOnly:c.groundedOnly,boosterOnly:c.boosterOnly,effects:c.effects
  },{
    name:"Springboard Roundhouse Kick",set:"smackdown-series-1",cost:6,damage:9,rarity:3,method:"agility",
    requirements:{agility:2,strike:1},moveType:"aerial",counter:"running-aerial",ground:true,
    groundedOnly:false,boosterOnly:true,effects:[]
  });
  assert.equal(c.superstarId,null);
  assert.equal(CARD_NUMBER_BY_ID[c.id].cardCode,"SD1-038");
  assert.equal(CARD_IDS_BY_SET["smackdown-series-1"].length,38);
  assert.equal(CARD_IDS_BY_SET["smackdown-series-1"].at(-1),c.id);
});

test("v0.13.65 Card Studio exposes all three new collector placements",()=>{
  const studio=fs.readFileSync(new URL("../js/tools/card-art-studio-data.js",import.meta.url),"utf8");
  assert.match(studio,/"id":"vertical-boston-crab","name":"Vertical Boston Crab","kind":"move","setId":"evolution-series-1","cardNumber":75,"cardCode":"EVO1-075"/);
  assert.match(studio,/"id":"diving-shoulder-block","name":"Diving Shoulder Block","kind":"move","setId":"hall-of-fame-series-1","cardNumber":94,"cardCode":"HOF1-094"/);
  assert.match(studio,/"id":"springboard-roundhouse-kick","name":"Springboard Roundhouse Kick","kind":"move","setId":"smackdown-series-1","cardNumber":38,"cardCode":"SD1-038"/);
});
