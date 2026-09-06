/* NBA Starting5 v0.11.49 — Egor scoring correction + Denver DeMar DeRozan roster update. */
(()=>{
  if(window.__courtsideEgorScoringV01019)return;
  window.__courtsideEgorScoringV01019=true;
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  const pools=[];
  try{if(Array.isArray(players))pools.push(players)}catch{}
  ['COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
  const seen=new WeakSet();
  for(const pool of pools)for(const p of pool||[]){
    if(!p||typeof p!=='object'||seen.has(p))continue;seen.add(p);
    const n=norm(p.name);
    if(n==='egor demin'&&p.stats)p.stats.scoring=10;
    if(n==='cameron johnson'&&String(p.teamId)==='1610612743'){
      p.name='DeMar DeRozan';
      p.position='SF';
      p.playerId='foundation-demar-derozan';
      p.artSlug='demar-derozan';
      p.season='2026–27';
      p.stats={scoring:18,dunks:10,three:12,rebounding:10,passing:15,blocks:7,steals:20,freeThrows:1};
      p.art={x:'50%',y:'100%',s:.78,r:0};
    }
  }
  window.STARTING5_DENVER_DEROZAN_V01149={team:'Denver Nuggets',position:'SF',replaces:'Cameron Johnson',sourceSeason:'2025-26',sourceStats:{ppg:18.4,rpg:2.9,apg:4.1,spg:1.0,bpg:0.3,threePct:32.0},baseRatings:{scoring:18,dunks:10,three:12,rebounding:10,passing:15,blocks:7,steals:20}};
})();
