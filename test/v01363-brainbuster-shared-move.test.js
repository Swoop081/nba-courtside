import test from "node:test";
import assert from "node:assert/strict";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";

const brainbuster=allGameplayCards.find(c=>c.id==="brainbuster");

test("v0.13.63 Brainbuster gameplay profile remains approved after later collector relocation",()=>{
  assert.ok(brainbuster);
  assert.deepEqual({
    name:brainbuster.name,cost:brainbuster.cost,damage:brainbuster.damage,rarity:brainbuster.rarity,
    method:brainbuster.method,requirements:brainbuster.requirements,moveType:brainbuster.moveType,counter:brainbuster.counterState,
    ground:brainbuster.groundOpponent,boosterOnly:brainbuster.boosterOnly,effects:brainbuster.effects
  },{
    name:"Brainbuster",cost:6,damage:10,rarity:2,
    method:"technical",requirements:{technical:2},moveType:"grapple",counter:"body-elevated",
    ground:true,boosterOnly:true,effects:[]
  });
  assert.equal(brainbuster.superstarId,null);
  assert.equal(brainbuster.rulesText,"Shared. Grounds opponent.");
});
