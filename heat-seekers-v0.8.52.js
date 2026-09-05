/* NBA Courtside v0.9.3 — retired Heat Seekers entry point; load Foundation + rail + team matchups + Card Art Editor */
(()=>{
  const t=window.COURTSIDE_ASSET_TOKEN||Date.now();
  document.write('<link rel="stylesheet" href="layout-v0.8.75.css?t='+t+'">');
  document.write('<script src="foundation-v0.9.0.js?t='+t+'"><\/script>');
  document.write('<link rel="stylesheet" href="foundation-rail-v0.9.1.css?t='+t+'">');
  document.write('<script src="foundation-team-matchups-v0.9.2.js?t='+t+'"><\/script>');
  document.write('<script src="foundation-art-editor-compat-v0.9.3.js?t='+t+'"><\/script>');
  document.write('<script src="art-editor-v0.8.64.js?t='+t+'"><\/script>');
})();
