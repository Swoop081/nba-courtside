/* NBA Courtside v0.10.20 — Approved 175-player 3PT ratings runtime */
(()=>{
  if(window.__courtsideThreePointRatingsV01020)return;
  window.__courtsideThreePointRatingsV01020=true;
  const apply=()=>{
    const audit=window.__COURTSIDE_THREE_POINT_AUDIT__;
    if(!audit||!Array.isArray(audit.players))return false;
    const modern=new Map(), classic=new Map();
    audit.players.forEach(r=>{
      const k=String(r.name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,' ').trim().toLowerCase();
      (r.classic?classic:modern).set(k+(r.classic?'|'+r.season:''),Number(r.rating));
    });
    const patch=(p,season,isClassic)=>{
      if(!p)return;
      const name=String(p.name||p.player||'');
      const k=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,' ').trim().toLowerCase()+(isClassic?'|'+season:'');
      const rating=(isClassic?classic:modern).get(k);
      if(Number.isFinite(rating)){
        if(Array.isArray(p.stats))p.stats[2]=rating;
        if(p.ratings&&typeof p.ratings==='object')p.ratings.three=rating;
        if(p.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))p.stats.three=rating;
        p.three=rating; p.threePoint=rating;
      }
    };
    const walk=(x,season,isClassic,seen=new WeakSet())=>{
      if(!x||typeof x!=='object'||seen.has(x))return; seen.add(x);
      if(x.name||x.player)patch(x,season,isClassic);
      if(Array.isArray(x))x.forEach(v=>walk(v,season,isClassic,seen));
      else Object.values(x).forEach(v=>walk(v,season||x.season,isClassic||!!x.classic,seen));
    };
    ['FOUNDATION_PLAYERS','FOUNDATION_CARDS','FOUNDATION_TEAMS','foundationPlayers','foundationCards','foundationTeams'].forEach(k=>walk(window[k],null,false));
    ['CLASSIC_TEAMS','CLASSIC_CARDS','classicTeams','classicCards'].forEach(k=>walk(window[k],null,true));
    window.__courtsideThreePointRatingsApplied=true;
    return true;
  };
  window.__applyCourtsideThreePointRatings=apply;
  apply(); setTimeout(apply,0); setTimeout(apply,250);
})();
