import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from "../js/data/card-number-manifest.js?v=0.13.72";

const brainbuster=allGameplayCards.find(c=>c.id==="brainbuster");
const sideKick=allGameplayCards.find(c=>c.id==="side-kick");

test("v0.13.64 relocates Brainbuster to Money in the Bank without changing gameplay",()=>{
  assert.ok(brainbuster);
  assert.equal(brainbuster.setId,"money-in-the-bank-series-1");
  assert.equal(CARD_NUMBER_BY_ID.brainbuster.cardCode,"MITB1-038");
  assert.equal(CARD_NUMBER_BY_ID.brainbuster.cardNumber,38);
  assert.equal(CARD_IDS_BY_SET["money-in-the-bank-series-1"].length,38);
  assert.equal(CARD_IDS_BY_SET["money-in-the-bank-series-1"].at(-1),"brainbuster");
  assert.equal(CARD_IDS_BY_SET["new-generation-series-1"].length,28);
  assert.equal(CARD_IDS_BY_SET["new-generation-series-1"].at(-1),"superstar-diesel");
});

test("v0.13.64 adds Side Kick as RAW1-071 shared Common",()=>{
  assert.ok(sideKick);
  assert.deepEqual({
    name:sideKick.name,set:sideKick.setId,cost:sideKick.cost,damage:sideKick.damage,rarity:sideKick.rarity,
    method:sideKick.method,requirements:sideKick.requirements,moveType:sideKick.moveType,counter:sideKick.counterState,
    ground:sideKick.groundOpponent,groundedOnly:sideKick.groundedOnly,boosterOnly:sideKick.boosterOnly,effects:sideKick.effects
  },{
    name:"Side Kick",set:"raw-series-1",cost:3,damage:5,rarity:1,
    method:"strike",requirements:{strike:1},moveType:"strike",counter:"leg-extended",
    ground:false,groundedOnly:false,boosterOnly:true,effects:[]
  });
  assert.equal(sideKick.superstarId,null);
  assert.equal(sideKick.rulesText,"Shared.");
  assert.equal(CARD_NUMBER_BY_ID["side-kick"].cardCode,"RAW1-071");
  assert.equal(CARD_NUMBER_BY_ID["side-kick"].cardNumber,71);
  assert.equal(CARD_IDS_BY_SET["raw-series-1"].length,71);
  assert.equal(CARD_IDS_BY_SET["raw-series-1"].at(-1),"side-kick");
});

test("v0.13.64 Card Studio exposes Brainbuster under MITB and Side Kick under RAW",()=>{
  const studio=fs.readFileSync(new URL("../js/tools/card-art-studio-data.js",import.meta.url),"utf8");
  assert.match(studio,/"id":"brainbuster","name":"Brainbuster","kind":"move","setId":"money-in-the-bank-series-1","cardNumber":38,"cardCode":"MITB1-038"/);
  assert.match(studio,/"id":"side-kick","name":"Side Kick","kind":"move","setId":"raw-series-1","cardNumber":71,"cardCode":"RAW1-071"/);
});
