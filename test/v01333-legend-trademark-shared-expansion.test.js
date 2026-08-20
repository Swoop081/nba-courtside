import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';
import { deckIds } from '../js/data/decks.js?v=0.13.72';

const card=id=>allGameplayCards.find(c=>c.id===id);
const count=(ids,id)=>ids.filter(x=>x===id).length;

test('v0.13.33 removes the RAW duplicate and renames EVO1-034 without changing its identity or mechanics',()=>{
  assert.equal(card('double-foot-stomp'),undefined);
  assert.equal(CARD_NUMBER_BY_ID['double-foot-stomp'],undefined);
  const evo=card('double-stomp');
  assert.deepEqual({name:evo.name,set:evo.setId,cost:evo.cost,damage:evo.damage,rarity:evo.rarity,method:evo.method,req:evo.requirements.agility,counter:evo.counterState,effects:evo.effects},
    {name:'Double Foot Stomp',set:'evolution-series-1',cost:5,damage:8,rarity:2,method:'agility',req:2,counter:'leg-extended',effects:[{type:'loseOpponentAdrenaline',amount:1}]});
  assert.equal(CARD_NUMBER_BY_ID[evo.id].cardCode,'EVO1-034');
});

test('v0.13.33 locks Wheelbarrow Suplex and Test of Strength as approved shared moves',()=>{
  const wheel=card('wheelbarrow-suplex'), testStrength=card('test-of-strength');
  assert.deepEqual({set:wheel.setId,cost:wheel.cost,damage:wheel.damage,rarity:wheel.rarity,method:wheel.method,req:wheel.requirements.technical,counter:wheel.counterState,ground:wheel.groundOpponent},
    {set:'survivor-series-series-1',cost:5,damage:8,rarity:2,method:'technical',req:2,counter:'body-elevated',ground:true});
  assert.equal(CARD_NUMBER_BY_ID[wheel.id].cardCode,'SVS1-053');
  assert.deepEqual({set:testStrength.setId,cost:testStrength.cost,damage:testStrength.damage,rarity:testStrength.rarity,method:testStrength.method,req:testStrength.requirements.strength,counter:testStrength.counterState,effects:testStrength.effects},
    {set:'hall-of-fame-series-1',cost:2,damage:3,rarity:1,method:'strength',req:1,counter:'front-control',effects:[]});
  assert.equal(CARD_NUMBER_BY_ID[testStrength.id].cardCode,'HOF1-092');
});

test('v0.13.33 adds Andre Choke and Bear Hug trademarks and installs two copies of each in his authored deck',()=>{
  const choke=card('andre-the-giant-choke'), hug=card('andre-the-giant-bear-hug');
  assert.deepEqual({cost:choke.cost,damage:choke.damage,rarity:choke.rarity,method:choke.method,req:choke.requirements.strength,counter:choke.counterState,trademark:choke.trademark,effects:choke.effects},
    {cost:6,damage:10,rarity:3,method:'strength',req:2,counter:'torso-trapped',trademark:true,effects:[{type:'loseOpponentAdrenaline',amount:1},{type:'search',name:'André’s Bear Hug',discount:0}]});
  assert.deepEqual({cost:hug.cost,damage:hug.damage,rarity:hug.rarity,method:hug.method,req:hug.requirements.strength,counter:hug.counterState,trademark:hug.trademark,standingOnly:hug.standingOnly,submission:hug.submission},
    {cost:7,damage:0,rarity:3,method:'strength',req:2,counter:'torso-trapped',trademark:true,standingOnly:true,submission:{bodyPart:'chest',pressure:6}});
  assert.equal(CARD_NUMBER_BY_ID[choke.id].cardCode,'HOF1-090');
  assert.equal(CARD_NUMBER_BY_ID[hug.id].cardCode,'HOF1-091');
  const deck=deckIds['andre-the-giant'];
  assert.equal(deck.length,60);
  assert.equal(count(deck,'andre-the-giant-choke'),2);
  assert.equal(count(deck,'andre-the-giant-bear-hug'),2);
  assert.equal(count(deck,'bearhug'),0);
  assert.equal(count(deck,'corner-avalanche'),1);
});

test('v0.13.33 moves the Savage rider from generic Double Axe Handle onto Macho’s rare trademark',()=>{
  const generic=card('double-axe-handle'), macho=card('randy-savage-machos-double-axe-handle');
  assert.deepEqual({cost:generic.cost,damage:generic.damage,rules:generic.rulesText,effects:generic.effects,ground:generic.groundOpponent},
    {cost:4,damage:6,rules:'Grounds opponent.',effects:[],ground:true});
  assert.deepEqual({cost:macho.cost,damage:macho.damage,rarity:macho.rarity,method:macho.method,req:macho.requirements.agility,moveType:macho.moveType,counter:macho.counterState,ground:macho.groundOpponent,trademark:macho.trademark,effects:macho.effects},
    {cost:5,damage:9,rarity:3,method:'agility',req:2,moveType:'aerial',counter:'diving-aerial',ground:true,trademark:true,effects:[{type:'gainAdrenaline',amount:1},{type:'search',name:'Flying Elbow Drop',discount:3}]});
  assert.equal(CARD_NUMBER_BY_ID[macho.id].cardCode,'HOF1-093');
  const deck=deckIds['randy-savage'];
  assert.equal(deck.length,60);
  assert.equal(count(deck,'randy-savage-machos-double-axe-handle'),3);
  assert.equal(count(deck,'double-axe-handle'),1);
});
