import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("v0.12.56 Amazing Entrance is universal and visible under active Superstar filters in Card Art Studio",()=>{
  const dataSource=fs.readFileSync(new URL("../js/tools/card-art-studio-data.js",import.meta.url),"utf8");
  const match=dataSource.match(/const STUDIO_CARDS = (\[.*\]);\nconst STUDIO_SUPERSTARS/s);
  assert.ok(match,"Studio dataset must be readable");
  const cards=JSON.parse(match[1]);
  const card=cards.find(c=>c.id==="entrance-amazing");
  assert.ok(card,"Amazing Entrance must be present in Card Art Studio data");
  assert.equal(card.cardCode,"SS1-140");
  assert.equal(card.kind,"entrance");
  assert.equal(card.setId,"summerslam-series-1");
  assert.equal(card.universalSuperstarCard,true,"Amazing Entrance must be marked universal for Studio filtering");

  const filter=(star,focus)=>cards.filter(c=>{
    const ids=focus==="deck"?c.deckSuperstarIds:c.specificSuperstarIds;
    if(star!=="all"&&!c.universalSuperstarCard&&!ids?.includes(star))return false;
    return c.kind==="entrance";
  });
  for(const star of ["roman-reigns","cm-punk","goldberg"]){
    assert.ok(filter(star,"specific").some(c=>c.id==="entrance-amazing"),`${star} specific filter must show Amazing Entrance`);
    assert.ok(filter(star,"deck").some(c=>c.id==="entrance-amazing"),`${star} deck filter must show Amazing Entrance`);
  }

  const studioSource=fs.readFileSync(new URL("../js/tools/card-art-studio.js",import.meta.url),"utf8");
  assert.match(studioSource,/!c\.universalSuperstarCard&&!ids\?\.includes\(star\)/,"Studio filter must preserve universal cards");
});
