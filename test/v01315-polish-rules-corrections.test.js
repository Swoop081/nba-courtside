import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js?v=0.13.72";
import { canPlayAction, counterEligibility } from "../js/engine/rules.js?v=0.13.72";

const player=id=>({superstar:{id},momentum:{strength:10,strike:10,technical:10,agility:10,attitude:10},adrenaline:10,events:{},turn:{actionPlayed:0},posture:"standing",hand:[],specialUsed:false,controlMoveCount:0});

test("v0.13.15 Once Too Often is reactive only and cannot be played in a normal Action window",()=>{
 const card=allGameplayCards.find(c=>c.id==="once-too-often");
 const state={phase:"ACTION",playerInControl:"p1",turnNumber:4,players:{p1:player("roman-reigns"),p2:player("seth-rollins")}};
 assert.equal(canPlayAction(state,"p1",card),false);
});

test("v0.13.15 Jawbreaker mirror lock survives copied/renamed object identity",()=>{
 const base=allGameplayCards.find(c=>c.id==="jawbreaker");
 const incoming={...base,id:"copied-jawbreaker",name:"Jawbreaker"};
 const counter={...base,id:"another-jawbreaker",name:"Jawbreaker"};
 const state={phase:"COUNTER",playerInControl:"p1",turnNumber:4,proposedMove:{attackerId:"p1",defenderId:"p2",card:incoming,isCounterAttack:false},players:{p1:player("a"),p2:player("b")}};
 assert.equal(counterEligibility(state,"p2",incoming,counter).legal,false);
});

test("v0.13.15 Pedigree is Seth Rollins-exclusive Rare Trademark",()=>{
 const card=allGameplayCards.find(c=>c.id==="pedigree");
 assert.equal(card.superstarId,"seth-rollins"); assert.equal(card.rarity,3); assert.equal(card.trademark,true);
 assert.match(card.rulesText,/Seth Rollins-exclusive Trademark/);
});

test("v0.13.15 Season countdown is removed and Championship result CTA is coloured",()=>{
 const app=fs.readFileSync(new URL("../js/ui/app.js",import.meta.url),"utf8");
 const css=fs.readFileSync(new URL("../css/game.css",import.meta.url),"utf8");
 const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
 assert.doesNotMatch(app,/data-season-countdown/); assert.match(app,/homeHubSplitTitle\("SEASON", "ONE"\)/);
 assert.match(html,/gamebar-season-title/); assert.match(css,/championship-result-cta/);
 assert.match(css,/body\[data-screen="championship"\].*mode-run-hero.*feature-art/s);
});
