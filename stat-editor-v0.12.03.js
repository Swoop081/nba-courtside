/* NBA Starting5 v0.12.03 — base-stat editor with set/team/stat filters, sorting and JSON export. */
(()=>{
  if(window.__starting5StatEditorV01203)return;
  window.__starting5StatEditorV01203=true;

  const KEY='nbaStarting5StatEditorV1';
  const STAT_KEYS=['scoring','dunks','three','freeThrows','rebounding','passing','blocks','steals'];
  const STAT_LABELS_LOCAL={scoring:'Scoring',dunks:'Dunking',three:'3PT',freeThrows:'Free Throws',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
  const clamp=n=>Math.max(1,Math.min(30,Math.round(Number(n)||1)));
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}};
  const playerKey=p=>String(p?.playerId||p?.id||`${p?.teamId||''}|${p?.artSlug||p?.name||'Player'}`);
  const teamKey=p=>String(p?.teamId||p?.classicTeam||p?.teamShort||p?.team||'Unknown');
  const teamLabel=p=>String(p?.teamShort||p?.team||'Unknown Team');
  const setLabel=p=>String(p?.set||'Classic Teams');

  function pool(){
    const src=[];
    try{if(typeof players!=='undefined'&&Array.isArray(players))src.push(...players)}catch{}
    for(const k of ['COURTSIDE_FOUNDATION_PLAYERS','FOUNDATION_PLAYERS','foundationPlayers','COURTSIDE_CLASSIC_PLAYERS'])if(Array.isArray(window[k]))src.push(...window[k]);
    const out=[],seen=new Set();
    for(const p of src){
      if(!p?.stats)continue;
      const k=playerKey(p);if(seen.has(k))continue;seen.add(k);out.push(p);
    }
    return out;
  }

  const BASE=new Map();
  function captureBase(all){
    for(const p of all){
      const k=playerKey(p);if(BASE.has(k))continue;
      const row={};for(const s of STAT_KEYS)row[s]=clamp(p?.stats?.[s]);BASE.set(k,row);
    }
  }
  function editedValue(p,s){const store=read(),row=store[playerKey(p)];return row&&Number.isFinite(+row[s])?clamp(row[s]):BASE.get(playerKey(p))?.[s]??clamp(p?.stats?.[s]);}
  function applyEdits(all){
    captureBase(all);const store=read();
    for(const p of all){const row=store[playerKey(p)];if(!row)continue;for(const s of STAT_KEYS)if(Number.isFinite(+row[s]))p.stats[s]=clamp(row[s]);}
  }

  function ensureStyle(){
    if(document.getElementById('s5-stat-editor-style-v01203'))return;
    const st=document.createElement('style');st.id='s5-stat-editor-style-v01203';st.textContent=`
      .stat-editor-launch{width:100%;margin-top:10px;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:#101720;color:#fff;font-size:15px;font-weight:950}
      .s5-stat-editor{position:fixed;inset:0;z-index:10020;background:#07090d;color:#fff;overflow:auto;padding:max(14px,env(safe-area-inset-top)) 12px calc(26px + env(safe-area-inset-bottom))}.s5-stat-editor.hidden{display:none!important}.s5-stat-editor-body{max-width:620px;margin:0 auto}.s5-stat-editor-head{position:sticky;top:0;z-index:5;background:#07090d;display:flex;align-items:center;justify-content:space-between;padding:4px 0 12px}.s5-stat-editor-head h2{margin:0;font-size:21px}.s5-stat-editor-close{min-width:54px;height:44px}
      .s5-stat-filters{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}.s5-stat-filters select,.s5-stat-sort{min-height:44px;width:100%;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:#151b25;color:#fff;padding:0 10px;font-weight:850}.s5-stat-filter-stat{grid-column:1/-1}.s5-stat-sort{grid-column:1/-1;background:#101720}.s5-stat-meta{font-size:11px;color:#9da6b4;text-align:center;margin:8px 0 10px}
      .s5-stat-list{display:grid;gap:8px}.s5-stat-row{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:10px;align-items:center;background:linear-gradient(180deg,#121925,#0a0e14);border:1px solid rgba(255,255,255,.1);border-radius:15px;padding:8px}.s5-stat-thumb{width:52px;height:68px;overflow:hidden;border-radius:9px}.s5-stat-thumb .player-card{width:150px!important;transform:scale(.347);transform-origin:top left;pointer-events:none!important}.s5-stat-copy{min-width:0}.s5-stat-name{font-size:14px;font-weight:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.s5-stat-sub{margin-top:3px;font-size:9px;color:#929cab;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.s5-stat-stepper{display:grid;grid-template-columns:38px 42px 38px;align-items:center}.s5-stat-stepper button{height:40px;border:1px solid rgba(255,255,255,.15);background:#171e29;color:#fff;font-size:23px;font-weight:1000}.s5-stat-minus{border-radius:11px 0 0 11px!important}.s5-stat-plus{border-radius:0 11px 11px 0!important}.s5-stat-value{height:40px;display:grid;place-items:center;background:#080b10;border-top:1px solid rgba(255,255,255,.15);border-bottom:1px solid rgba(255,255,255,.15);font-size:18px;font-weight:1000;color:#f7b928}.s5-stat-row.edited{border-color:rgba(247,185,40,.5)}
      .s5-stat-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.s5-stat-actions button{min-height:46px;border-radius:13px;border:1px solid rgba(255,255,255,.16);background:#171e29;color:#fff;font-weight:900}.s5-stat-actions .primary{background:#f7b928;color:#080a0d;border-color:#f7b928}.s5-stat-note{font-size:10px;line-height:1.45;color:#9da6b4;text-align:center;margin:11px 4px 0}
      @media(max-width:390px){.s5-stat-row{grid-template-columns:44px minmax(0,1fr) auto;gap:7px}.s5-stat-thumb{width:44px;height:59px}.s5-stat-thumb .player-card{transform:scale(.295)}.s5-stat-stepper{grid-template-columns:34px 38px 34px}.s5-stat-stepper button,.s5-stat-value{height:38px}.s5-stat-name{font-size:12px}}
    `;document.head.appendChild(st);
  }

  function boot(){
    const all=pool();if(!all.length||typeof cardMarkup!=='function')return false;
    captureBase(all);applyEdits(all);ensureStyle();
    const options=document.querySelector('.options-card');if(!options)return false;
    let launch=document.getElementById('statEditorBtn');
    if(!launch){launch=document.createElement('button');launch.id='statEditorBtn';launch.type='button';launch.className='stat-editor-launch';launch.textContent='Stat Editor';options.appendChild(launch);}

    let ed=document.getElementById('starting5StatEditor');
    if(!ed){
      ed=document.createElement('section');ed.id='starting5StatEditor';ed.className='s5-stat-editor hidden';ed.innerHTML=`<div class="s5-stat-editor-body"><div class="s5-stat-editor-head"><h2>Stat Editor</h2><button id="statEditorClose" class="ghost-btn s5-stat-editor-close" type="button">Done</button></div><div class="s5-stat-filters"><select id="statEditorSet"></select><select id="statEditorTeam"></select><select id="statEditorStat" class="s5-stat-filter-stat"></select><button id="statEditorSort" class="s5-stat-sort" type="button">Highest → Lowest</button></div><div id="statEditorMeta" class="s5-stat-meta"></div><div id="statEditorList" class="s5-stat-list"></div><div class="s5-stat-actions"><button id="statEditorResetFilter" type="button">Reset Current Filter</button><button id="statEditorResetAll" type="button">Reset All Edits</button><button id="statEditorCopy" type="button">Copy JSON</button><button id="statEditorExport" class="primary" type="button">Export JSON</button></div><p class="s5-stat-note">This edits baseline ratings only. Season hot/cold modifiers remain separate. Export the JSON and send it back to update the permanent base game.</p></div>`;document.body.appendChild(ed);

      const setSel=ed.querySelector('#statEditorSet'),teamSel=ed.querySelector('#statEditorTeam'),statSel=ed.querySelector('#statEditorStat'),sortBtn=ed.querySelector('#statEditorSort'),list=ed.querySelector('#statEditorList'),meta=ed.querySelector('#statEditorMeta');
      let descending=true;
      setSel.innerHTML=['All Sets',...new Set(all.map(setLabel))].map(x=>`<option value="${x}">${x}</option>`).join('');
      statSel.innerHTML=STAT_KEYS.map(s=>`<option value="${s}">${STAT_LABELS_LOCAL[s]}</option>`).join('');

      const setPool=()=>setSel.value==='All Sets'?all:all.filter(p=>setLabel(p)===setSel.value);
      const rebuildTeams=()=>{const m=new Map();for(const p of setPool())m.set(teamKey(p),teamLabel(p));const old=teamSel.value;teamSel.innerHTML='<option value="All Teams">All Teams</option>'+[...m].sort((a,b)=>a[1].localeCompare(b[1])).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');if([...teamSel.options].some(o=>o.value===old))teamSel.value=old;};
      const filtered=()=>{let a=setPool();if(teamSel.value!=='All Teams')a=a.filter(p=>teamKey(p)===teamSel.value);const s=statSel.value;a=[...a].sort((x,y)=>{const d=editedValue(x,s)-editedValue(y,s);return descending?-d:d||String(x.name).localeCompare(String(y.name));});return a;};
      const editedFor=(p,s)=>{const row=read()[playerKey(p)];return !!(row&&Number.isFinite(+row[s]));};
      const saveValue=(p,s,v)=>{const store=read(),k=playerKey(p);store[k]=store[k]||{};store[k][s]=clamp(v);write(store);p.stats[s]=clamp(v);if(p.__s5DynamicBaseStats)p.__s5DynamicBaseStats[s]=clamp(v);};
      const render=()=>{const rows=filtered(),s=statSel.value;meta.textContent=`${rows.length} players · ${STAT_LABELS_LOCAL[s]} · ${Object.keys(read()).length} players edited`;list.innerHTML=rows.map(p=>{let thumb='';try{thumb=cardMarkup(p,{eager:false})}catch{}const v=editedValue(p,s);return `<div class="s5-stat-row ${editedFor(p,s)?'edited':''}" data-player="${playerKey(p)}"><div class="s5-stat-thumb">${thumb}</div><div class="s5-stat-copy"><div class="s5-stat-name">${p.name}</div><div class="s5-stat-sub">${teamLabel(p)} · ${setLabel(p)}</div></div><div class="s5-stat-stepper"><button class="s5-stat-minus" type="button">−</button><div class="s5-stat-value">${v}</div><button class="s5-stat-plus" type="button">+</button></div></div>`;}).join('');};

      list.addEventListener('click',e=>{const row=e.target.closest('.s5-stat-row');if(!row)return;const p=all.find(x=>playerKey(x)===row.dataset.player);if(!p)return;const s=statSel.value,v=editedValue(p,s);if(e.target.closest('.s5-stat-minus'))saveValue(p,s,v-1);else if(e.target.closest('.s5-stat-plus'))saveValue(p,s,v+1);else return;render();});
      setSel.onchange=()=>{rebuildTeams();render();};teamSel.onchange=render;statSel.onchange=render;sortBtn.onclick=()=>{descending=!descending;sortBtn.textContent=descending?'Highest → Lowest':'Lowest → Highest';render();};

      const exportData=()=>{const store=read(),out={};for(const p of all){const row=store[playerKey(p)];if(!row)continue;const stats={};for(const s of STAT_KEYS)if(Number.isFinite(+row[s]))stats[s]=clamp(row[s]);if(Object.keys(stats).length)out[playerKey(p)]={name:p.name,teamId:String(p.teamId||''),team:teamLabel(p),set:setLabel(p),artSlug:p.artSlug||'',stats};}return {format:'NBA Starting5 Base Stat Edits',version:1,gameVersion:'0.12.03',exportedAt:new Date().toISOString(),players:out};};
      ed.querySelector('#statEditorCopy').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(exportData(),null,2));meta.textContent='JSON copied to clipboard';}catch{meta.textContent='Clipboard copy unavailable';}};
      ed.querySelector('#statEditorExport').onclick=()=>{const blob=new Blob([JSON.stringify(exportData(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nba-starting5-stat-edits.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
      ed.querySelector('#statEditorResetFilter').onclick=()=>{const rows=filtered(),s=statSel.value,store=read();for(const p of rows){const k=playerKey(p);if(!store[k])continue;delete store[k][s];if(!Object.keys(store[k]).length)delete store[k];const base=BASE.get(k)?.[s];if(Number.isFinite(base))p.stats[s]=base;if(p.__s5DynamicBaseStats&&Number.isFinite(base))p.__s5DynamicBaseStats[s]=base;}write(store);render();};
      ed.querySelector('#statEditorResetAll').onclick=()=>{if(!confirm('Reset every Stat Editor change on this device?'))return;localStorage.removeItem(KEY);for(const p of all){const base=BASE.get(playerKey(p));if(!base)continue;for(const s of STAT_KEYS){p.stats[s]=base[s];if(p.__s5DynamicBaseStats)p.__s5DynamicBaseStats[s]=base[s];}}render();};
      ed.querySelector('#statEditorClose').onclick=()=>ed.classList.add('hidden');
      rebuildTeams();render();
    }
    launch.onclick=()=>{document.getElementById('optionsSheet')?.classList.add('hidden');ed.classList.remove('hidden');};
    window.openStarting5StatEditor=()=>ed.classList.remove('hidden');
    return true;
  }

  let tries=0;const start=()=>{if(boot()||++tries>100)return;setTimeout(start,100)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
