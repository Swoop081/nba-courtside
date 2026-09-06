/* NBA Courtside v0.10.61 — compact Classic Team display years: 1997 -> '97, 2007 -> '07 */
(()=>{
  if(window.__courtsideClassicYearDisplayV01061)return;
  window.__courtsideClassicYearDisplayV01061=true;

  const compact=s=>String(s??'').replace(/\b(?:19|20)(\d{2})\b/g,"'$1");

  const apply=()=>{
    try{
      (players||[]).forEach(p=>{
        if(!String(p?.teamId||'').startsWith('classic-'))return;
        if(p.teamShort)p.teamShort=compact(p.teamShort);
        if(p.team)p.team=compact(p.team);
      });
    }catch{}
    if(Array.isArray(window.COURTSIDE_CLASSIC_TEAMS)){
      window.COURTSIDE_CLASSIC_TEAMS.forEach(t=>{
        if(t.short)t.short=compact(t.short);
        if(t.team)t.team=compact(t.team);
        if(t.name)t.name=compact(t.name);
      });
    }
  };

  apply();
  window.COURTSIDE_COMPACT_CLASSIC_YEAR=compact;
})();
