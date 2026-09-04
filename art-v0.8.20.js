/* NBA Courtside v0.8.34 — 2025-26 statistical rating engine + curated dunk reputation + local Tip-Off 27 artwork authority */
const artUrlBeforeV088=artUrl;
artUrl=function(p){
  return `assets/player-art/${p.artSlug}.png?v=0.8.34`;
};

/*
  2025-26 regular-season source line.
  Fields: PTS, TRB, AST, STL, BLK, 3PM, 3P%.
  Ratings are generated mathematically rather than hand-authored:
    Scoring    = 30 * PTS / 33.5 (Luka Doncic, league leader)
    Rebounding = 30 * TRB / 12.9 (Nikola Jokic, league leader)
    Passing    = 30 * AST / 10.7 (Nikola Jokic, league leader)
    Blocks     = 30 * BLK / 3.1 (Victor Wembanyama, league leader)
    Steals     = 30 * STL / 2.0 (2025-26 league-leading rate)
    3PT impact = 3PM * sqrt(3P% / .360), normalized to Luka Doncic's 4.0 3PM at .366.
  All results are rounded to the nearest integer and clamped to 1–30.
  Dunking is the one curated category: it represents reputation for in-game dunking,
  explosiveness and above-the-rim finishing rather than a box-score average.
*/
const COURTSIDE_2025_26={
  'derrick-white':[16.5,4.4,5.4,1.1,1.3,2.7,.327],
  'michael-porter-jr':[24.2,7.1,3.0,1.1,.3,3.4,.363],
  'josh-hart':[12.0,7.4,4.8,1.1,.3,1.5,.413],
  'vj-edgecombe':[16.0,5.6,4.2,1.4,.5,2.0,.354],
  'jakobe-walter':[7.5,2.6,1.2,1.0,.2,1.5,.409],
  'josh-giddey':[17.0,8.3,9.1,1.0,.5,1.9,.364],
  'jarrett-allen':[15.4,8.5,1.8,1.0,.8,0,.100],
  'cade-cunningham':[23.9,5.5,9.9,1.4,.8,2.0,.342],
  'obi-toppin':[11.6,4.4,2.3,.5,0,1.5,.352],
  'kyle-kuzma':[13.0,4.5,2.7,.7,.4,1.2,.347],
  'jalen-johnson':[22.5,10.3,7.9,1.24,.43,1.67,.352],
  'kon-knueppel':[18.5,5.3,3.4,.7,.2,3.4,.425],
  'bam-adebayo':[20.1,10.0,3.2,1.2,.7,1.7,.318],
  'jalen-suggs':[13.8,3.9,5.5,1.8,.7,2.1,.339],
  'bub-carrington':[10.7,3.4,4.6,.6,.2,2.1,.408],
  'nikola-jokic':[27.7,12.9,10.7,1.4,.8,1.7,.380],
  'rudy-gobert':[10.9,11.5,1.7,.8,1.6,0,0],
  'shai-gilgeous-alexander':[31.1,4.3,6.6,1.4,.8,1.7,.386],
  'scoot-henderson':[14.2,2.7,3.7,.9,.3,1.9,.352],
  'keyonte-george':[23.6,3.7,6.1,1.1,.3,2.5,.371],
  'brandin-podziemski':[13.8,5.1,3.7,1.1,.2,1.9,.371],
  'brook-lopez':[8.5,3.6,1.3,.6,1.2,1.5,.360],
  'luka-doncic':[33.5,7.7,8.3,1.6,.5,4.0,.366],
  'dillon-brooks':[20.2,3.6,1.8,1.0,.2,2.3,.344],
  'zach-lavine':[19.2,2.8,2.3,.7,.3,2.5,.390],
  'cooper-flagg':[21.0,6.7,4.5,1.2,.9,1.0,.295],
  'reed-sheppard':[13.5,2.9,3.4,1.5,.7,2.8,.394],
  'gg-jackson':[12.5,4.3,1.5,.6,.8,1.2,.332],
  'jeremiah-fears':[14.3,3.7,3.4,1.2,.4,1.2,.330],
  'victor-wembanyama':[25.0,11.5,3.1,1.0,3.1,1.9,.349]
};

/*
  Curated Dunking scale:
  27–30 = elite / identity-level dunker
  23–26 = strong frequent dunker
  18–22 = capable occasional dunker
  13–17 = limited dunker
   1–12 = rarely known for dunking
*/
const COURTSIDE_DUNK_REPUTATION={
  'derrick-white':10,
  'michael-porter-jr':22,
  'josh-hart':18,
  'vj-edgecombe':26,
  'jakobe-walter':17,
  'josh-giddey':14,
  'jarrett-allen':27,
  'cade-cunningham':18,
  'obi-toppin':30,
  'kyle-kuzma':20,
  'jalen-johnson':29,
  'kon-knueppel':15,
  'bam-adebayo':25,
  'jalen-suggs':19,
  'bub-carrington':13,
  'nikola-jokic':18,
  'rudy-gobert':27,
  'shai-gilgeous-alexander':20,
  'scoot-henderson':22,
  'keyonte-george':13,
  'brandin-podziemski':12,
  'brook-lopez':14,
  'luka-doncic':16,
  'dillon-brooks':15,
  'zach-lavine':28,
  'cooper-flagg':28,
  'reed-sheppard':12,
  'gg-jackson':25,
  'jeremiah-fears':18,
  'victor-wembanyama':29
};

const courtsideScale=(value,leader)=>Math.max(1,Math.min(30,Math.round(30*value/leader)));
const COURTSIDE_3PT_LEADER=4.0*Math.sqrt(.366/.360);
const courtsideThreeRating=(made,pct)=>made<=0?1:Math.max(1,Math.min(30,Math.round(30*(made*Math.sqrt(pct/.360))/COURTSIDE_3PT_LEADER)));
players.forEach(p=>{
  const s=COURTSIDE_2025_26[p.artSlug];
  if(!s)return;
  const [pts,reb,ast,stl,blk,threeMade,threePct]=s;
  p.season='2025–26';
  p.stats.scoring=courtsideScale(pts,33.5);
  p.stats.three=courtsideThreeRating(threeMade,threePct);
  p.stats.rebounding=courtsideScale(reb,12.9);
  p.stats.passing=courtsideScale(ast,10.7);
  p.stats.blocks=courtsideScale(blk,3.1);
  p.stats.steals=courtsideScale(stl,2.0);
  if(Number.isFinite(COURTSIDE_DUNK_REPUTATION[p.artSlug]))p.stats.dunks=COURTSIDE_DUNK_REPUTATION[p.artSlug];
});

/* Free Throws retired: gameplay now draws from seven categories only. */
const COURTSIDE_STAT_KEYS_7=['scoring','dunks','three','rebounding','passing','blocks','steals'];
beginQuarter=function(){
  state.category=COURTSIDE_STAT_KEYS_7[Math.floor(Math.random()*COURTSIDE_STAT_KEYS_7.length)];
  $('#quarterLabel').textContent=state.overtime?'OT':'Q'+state.quarter;
  $('#categoryLabel').textContent=STAT_LABELS[state.category].toUpperCase();
  $('#userScore').textContent=state.userScore;
  $('#cpuScore').textContent=state.cpuScore;
  $('#instruction').textContent=state.overtime?'Overtime — your final player is in':('Choose one unused player for '+STAT_LABELS[state.category]);
  $('#revealPanel').classList.add('hidden');
  renderLineup();
  if(state.overtime){
    const uP=userTeam.find(p=>!state.usedUser.has(p.id));
    if(uP)setTimeout(()=>playQuarter(uP.id),350);
  }
};

/* Exactly seven equal-height stat rows from the top of the rail to the bottom. */
(function applySevenStatCardLayout(){
  const style=document.createElement('style');
  style.id='courtside-seven-stat-layout';
  style.textContent=`
    .player-card .stats .stat:nth-child(4){display:none!important}
    .player-card .stats{
      display:grid!important;
      grid-template-rows:repeat(7,minmax(0,1fr))!important;
      align-items:center!important;
      justify-content:stretch!important;
      gap:0!important;
    }
    .player-card .stats .stat{
      min-height:0!important;
      align-self:center!important;
    }
  `;
  document.head.appendChild(style);
})();

if(typeof renderStarterFive==='function') renderStarterFive();
