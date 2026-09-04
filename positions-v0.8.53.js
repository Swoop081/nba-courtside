/* NBA Courtside v0.8.78 — positions + premium stats + baked art layout + normalized Card Art Editor sync */
(()=>{
  const token=window.COURTSIDE_ASSET_TOKEN||Date.now();
  const load=(src,done)=>{const s=document.createElement('script');s.src=src+'?t='+token;s.async=false;s.onload=()=>done&&done();document.head.appendChild(s);};
  const loadCss=(href)=>{const l=document.createElement('link');l.rel='stylesheet';l.href=href+'?t='+token;document.head.appendChild(l);};
  loadCss('layout-v0.8.75.css');
  load('positions-core-v0.8.63.js',()=>load('premium-stats-v0.8.68.js',()=>load('art-layout-v0.8.70.js',()=>load('art-editor-v0.8.64.js',()=>load('art-editor-match-v0.8.74.js',()=>load('art-authority-v0.8.78.js'))))));
})();
