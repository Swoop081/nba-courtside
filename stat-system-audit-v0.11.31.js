/* NBA Starting5 v0.11.65 — 330-card stat-system audit + direct smooth rebounding authority loader. */
(()=>{
  if(window.__starting5StatSystemAuditV01131)return;
  window.__starting5StatSystemAuditV01131=true;

  if(!window.__s5ReboundingSmoothLoadV01165){
    window.__s5ReboundingSmoothLoadV01165=true;
    const s=document.createElement('script');
    s.src='rebounding-smooth-v0.11.65.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());
    s.async=false;
    document.head.appendChild(s);
  }

  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const num=v=>Number.isFinite(Number(v))?Number(v):null;
  const round=(v,d=2)=>Number.isFinite(v)?Number(v.toFixed(d)):null;
  const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
  const median=a=>{if(!a.length)return null;const x=[...a].sort((a,b)=>a-b),m=Math.floor(x.length/2);return x.length%2?x[m]:(x[m-1]+x[m])/2};
  const stdev=a=>{if(a.length<2)return 0;const m=mean(a);return Math.sqrt(mean(a.map(v=>(v-m)**2)))};
  const stat=(p,k)=>{
    if(p?.stats&&typeof p.stats==='object'&&!Array.isArray(p.stats))return num(p.stats[k]);
    if(p?.ratings&&typeof p.ratings==='object')return num(p.ratings[k]);
    if(Array.isArray(p?.stats)){const i=CATS.indexOf(k);return i>=0?num(p.stats[i]):null;}
    return num(p?.[k]);
  };
  const overall=p=>{try{const v=window.courtsideOverall?.(p);if(Number.isFinite(Number(v)))return Number(v)}catch{}return num(p?.overall)};
  const collect=()=>{
    const pools=[];
    try{if(Array.isArray(players))pools.push(players)}catch{}
    ['COURTSIDE_CLASSIC_PLAYERS','COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers'].forEach(k=>{if(Array.isArray(window[k]))pools.push(window[k])});
    const out=[],seen=new Set();
    for(const pool of pools)for(const p of pool||[]){
      if(!p||!p.name)continue;
      const key=String(p.id||`${p.teamId||p.team||''}|${p.name}|${p.season||'current'}|${p.position||''}`);
      if(seen.has(key))continue;seen.add(key);out.push(p);
    }
    return out;
  };
  const build=()=>{
    const ps=collect();
    if(!ps.length)return null;
    const rows=ps.map(p=>{
      const stats=Object.fromEntries(CATS.map(k=>[k,stat(p,k)]));
      const vals=CATS.map(k=>stats[k]).filter(Number.isFinite);
      const ov=overall(p);
      const avg=mean(vals),med=median(vals),mx=vals.length?Math.max(...vals):null,mn=vals.length?Math.min(...vals):null;
      return {
        id:p.id||null,name:p.name,team:p.team||p.teamShort||null,teamId:p.teamId||null,season:p.season||'current',position:p.position||null,
        classic:!!p.classicTeam,overall:ov,stats,categoryAverage:round(avg),categoryMedian:round(med),max:mx,min:mn,
        thirties:vals.filter(v=>v===30).length,invalid:CATS.filter(k=>!Number.isFinite(stats[k])||stats[k]<0||stats[k]>30),
        spread:(mx!=null&&mn!=null)?mx-mn:null,
        overallVsMean:(Number.isFinite(ov)&&Number.isFinite(avg))?round(ov-avg):null
      };
    });
    const categories={};
    for(const k of CATS){
      const vals=rows.map(r=>r.stats[k]).filter(Number.isFinite);
      categories[k]={count:vals.length,mean:round(mean(vals)),median:round(median(vals)),stdev:round(stdev(vals)),min:vals.length?Math.min(...vals):null,max:vals.length?Math.max(...vals):null,zero:vals.filter(v=>v===0).length,thirty:vals.filter(v=>v===30).length,low5:vals.filter(v=>v<=5).length,high28:vals.filter(v=>v>=28).length};
    }
    const byTeam=new Map();
    rows.forEach(r=>{const k=r.teamId||r.team||'Unknown';if(!byTeam.has(k))byTeam.set(k,{teamId:r.teamId,team:r.team,classic:r.classic,players:[]});byTeam.get(k).players.push(r)});
    const teams=[...byTeam.values()].map(t=>{const ovs=t.players.map(p=>p.overall).filter(Number.isFinite);return {...t,count:t.players.length,averageOverall:round(mean(ovs)),minOverall:ovs.length?Math.min(...ovs):null,maxOverall:ovs.length?Math.max(...ovs):null}}).sort((a,b)=>(b.averageOverall??-1)-(a.averageOverall??-1));
    const modern=rows.filter(r=>!r.classic),classic=rows.filter(r=>r.classic);
    const flags={
      invalidRatings:rows.filter(r=>r.invalid.length),
      heavySaturation:rows.filter(r=>r.thirties>=2).sort((a,b)=>b.thirties-a.thirties),
      extremeSpecialists:rows.filter(r=>r.spread>=22),
      overallMismatch:rows.filter(r=>Math.abs(r.overallVsMean??0)>=7).sort((a,b)=>Math.abs(b.overallVsMean)-Math.abs(a.overallVsMean)),
      veryLowOverall:rows.filter(r=>Number.isFinite(r.overall)&&r.overall<=15).sort((a,b)=>a.overall-b.overall),
      veryHighOverall:rows.filter(r=>r.overall>=29).sort((a,b)=>b.overall-a.overall)
    };
    const report={
      version:'0.11.65',mode:'AUDIT_ONLY',generatedAt:new Date().toISOString(),
      counts:{players:rows.length,teams:teams.length,modernPlayers:modern.length,classicPlayers:classic.length,modernTeams:teams.filter(t=>!t.classic).length,classicTeams:teams.filter(t=>t.classic).length},
      legacyAuthority:{overallRuntimeDeclaredCount:Number(window.COURTSIDE_OVERALL_RATINGS_COUNT)||null,note:'Direct category authorities are active; the unified post-curve is retired.'},
      categories,teams,players:rows,flags,
      methodologyV2:{
        scoring:'Production + efficiency; retain 30 ceiling but stop treating raw PPG as the entire rating.',
        three:'Blend makes/volume, percentage and era context.',
        rebounding:'Direct RPG authority with a smoother mid-range so small RPG differences do not create exaggerated rating gaps.',
        passing:'Assists plus creation responsibility, with role context.',
        blocks:'BPG foundation with minutes/position context.',
        steals:'SPG foundation with minutes/role context.',
        dunks:'Formal dunk-threat model: frequency first, then athleticism/power/reputation.',
        overall:'Broad quality indicator only; preserve specialists. Recompute after seven categories are approved.'
      },
      anchors:{30:'historic/league-leading elite',25:'All-Star calibre strength',20:'clearly above average',15:'roughly average NBA starter/rotation ability',10:'below average',5:'major weakness/rare skill expression',0:'effectively absent'}
    };
    window.STARTING5_STAT_AUDIT_V2=report;
    return report;
  };
  window.runStarting5StatAudit=build;
  const run=()=>{try{build()}catch(e){console.warn('[Starting5 stat audit]',e)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0),{once:true});else setTimeout(run,0);
  setTimeout(run,300);setTimeout(run,1200);
})();
