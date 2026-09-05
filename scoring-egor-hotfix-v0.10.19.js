/* NBA Courtside v0.10.19 — Egor Demin scoring audit correction. */
(()=>{
  if(window.__courtsideEgorScoringV01019)return;
  window.__courtsideEgorScoringV01019=true;
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  (players||[]).forEach(p=>{if(norm(p.name)==='egor demin')p.stats.scoring=10;});
})();
