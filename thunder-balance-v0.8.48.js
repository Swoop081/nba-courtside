/* NBA Courtside v0.8.48 — Thunder & Lightning compressed historical rating curve.
   Keeps the selected season line authoritative while avoiding unusable 1–4 ratings for
   meaningful non-zero production. True zero production remains 1. */
(()=>{
  const scale=(value,leader)=>{
    if(!(value>0))return 1;
    const ratio=Math.min(1,value/leader);
    return Math.max(5,Math.min(30,Math.round(5+25*Math.pow(ratio,.82))));
  };
  const three=(made,pct)=>{
    if(!(made>0))return 1;
    const adjusted=made*Math.sqrt(Math.max(0,pct||0)/.360);
    const ratio=Math.min(1,adjusted/4.05);
    return Math.max(5,Math.min(30,Math.round(5+25*Math.pow(ratio,.68))));
  };
  if(typeof THUNDER_LIGHTNING==='undefined'||!Array.isArray(THUNDER_LIGHTNING))return;
  THUNDER_LIGHTNING.forEach(row=>{
    const [name,team,tid,season,slug,line,dunk]=row;
    const [pts,reb,ast,stl,blk,tm,tp]=line;
    const p=players.find(x=>x.set==='Thunder & Lightning'&&x.artSlug===slug);
    if(!p)return;
    p.stats.scoring=scale(pts,33.5);
    p.stats.three=three(tm,tp);
    p.stats.rebounding=scale(reb,13.8);
    p.stats.passing=scale(ast,10.7);
    p.stats.blocks=scale(blk,3.1);
    p.stats.steals=scale(stl,2.9);
    p.stats.dunks=dunk;
  });
})();
