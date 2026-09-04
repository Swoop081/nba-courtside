/* NBA Courtside v0.8.68 — positions + premium stats + Card Art Editor bootstrap */
(()=>{
  const token=window.COURTSIDE_ASSET_TOKEN||Date.now();
  const load=(src,done)=>{const s=document.createElement('script');s.src=src+'?t='+token;s.async=false;s.onload=()=>done&&done();document.head.appendChild(s);};
  load('positions-core-v0.8.63.js',()=>load('premium-stats-v0.8.68.js',()=>load('art-editor-v0.8.64.js')));
})();
