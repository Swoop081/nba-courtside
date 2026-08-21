/* NBA Courtside v0.38 — Staff Careers + Coaching Market
   Gameplay-only career/ratings framework. Current real staff identities continue to come from organizations-v0.38.js.
   Ratings, schemes, contract bands, job security and generated candidate personalities are SIMULATED and are not factual claims. */
window.NBA_COURTSIDE_STAFF_CAREERS_V038={
  version:'0.38',
  frozen_as_of:'2026-08-21',
  coach_rating_keys:['offense','defense','development','rotations','young_trust','game_management','leadership'],
  executive_rating_keys:['trading','drafting','cap_management','scouting','contracts','roster_building','leadership'],
  coach_schemes:[
    {id:'pace_space',label:'PACE + SPACE',offense:'FIVE-OUT',defense:'MIXED',pace:'FAST',three:'HIGH',rim:'BALANCED'},
    {id:'rim_pressure',label:'RIM PRESSURE',offense:'DRIVE + KICK',defense:'DROP',pace:'MEDIUM',three:'MEDIUM',rim:'HIGH'},
    {id:'half_court',label:'HALF-COURT CONTROL',offense:'HALF-COURT',defense:'SWITCH',pace:'SLOW',three:'MEDIUM',rim:'MEDIUM'},
    {id:'defense_first',label:'DEFENSE FIRST',offense:'BALANCED',defense:'PRESSURE',pace:'MEDIUM',three:'MEDIUM',rim:'MEDIUM'},
    {id:'motion',label:'MOTION OFFENSE',offense:'MOTION',defense:'MIXED',pace:'FAST',three:'HIGH',rim:'MEDIUM'},
    {id:'balanced',label:'BALANCED',offense:'BALANCED',defense:'MIXED',pace:'MEDIUM',three:'MEDIUM',rim:'MEDIUM'}
  ],
  fictional_first:['Marcus','Darius','Andre','Julian','Trevor','Nolan','Elliot','Calvin','Miles','Wesley','Jordan','Devon','Isaiah','Cameron','Malcolm','Theo','Adrian','Grant','Reggie','Victor'],
  fictional_last:['Mercer','Holloway','Benton','Kincaid','Rivers','Langley','Sutton','Carver','Madden','Prescott','Monroe','Walsh','Dawson','Hale','Vaughn','Caldwell','Griffin','Morrow','Ellison','Porter'],
  disclaimer:'All staff ratings, schemes, job-security values, simulated comments and generated career decisions are NBA Courtside gameplay models, not factual assessments or quotes.'
};
