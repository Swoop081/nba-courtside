/* NBA Starting5 v0.11.7 — stable update check: no reload when current, mask real reload */
(()=>{
  if(window.__starting5UpdateCheckV0117)return;
  window.__starting5UpdateCheckV0117=true;
  const RUNNING_VERSION='0.11.7';
  const btn=document.getElementById('checkUpdatesBtn');
  const label=document.querySelector('.brand-version');
  if(!btn)return;

  const showCurrent=version=>{
    btn.disabled=true;
    btn.textContent='Up to Date';
    if(label&&version){label.textContent='v'+version;label.dataset.buildVersion=version;}
    setTimeout(()=>{btn.textContent='Check for Updates';btn.disabled=false;},1100);
  };

  const showMask=version=>{
    let mask=document.getElementById('s5UpdateMask');
    if(mask)return mask;
    mask=document.createElement('div');
    mask.id='s5UpdateMask';
    mask.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#05070b;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;color:#fff;font-family:inherit;text-align:center;padding:24px';
    mask.innerHTML='<div style="font-size:18px;font-weight:1000;letter-spacing:.02em">NBA STARTING5</div><div style="font-size:12px;color:#aeb6c3">Updating to v'+String(version||'latest')+'…</div>';
    document.body.appendChild(mask);
    return mask;
  };

  window.addEventListener('click',async e=>{
    const target=e.target?.closest?.('#checkUpdatesBtn');
    if(!target)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(btn.disabled)return;
    btn.disabled=true;btn.textContent='Checking…';
    let b=null;
    try{
      const r=await fetch('build.json?t='+Date.now(),{cache:'no-store'});
      if(r.ok)b=await r.json();
    }catch{}
    if(!b?.version){btn.textContent='Retry Update Check';btn.disabled=false;return;}
    if(String(b.version)===RUNNING_VERSION){showCurrent(b.version);return;}
    btn.textContent='Updating…';
    showMask(b.version);
    try{sessionStorage.setItem('starting5PendingVersion',b.version)}catch{}
    try{
      if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()));}
      if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));}
    }catch{}
    location.replace('/nba-courtside/?release='+encodeURIComponent(b.commit||b.version)+'&t='+Date.now());
  },true);
})();
