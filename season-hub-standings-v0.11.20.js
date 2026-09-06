/* NBA Starting5 v0.11.20 — fast Season hub details with no subtree observer */
(()=>{
  if(window.__starting5SeasonHubStandingsV01120)return;
  window.__starting5SeasonHubStandingsV01120=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const IDS=['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744','1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752','1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'];
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const POS={PG:0,SG:1,SF:2,PF:3,C:4};
  let queued=false;

  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const pool=()=>{try{return Array.isArray(players)?players:[]}catch{return []}};
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const record=(s,id)=>s?.records?.[id]||{w:0,l:0};
  const pct=r=>{const n=(r.w||0)+(r.l||0);return n?((r.w||0)/n).toFixed(3).replace(/^0/,''):'.000'};
  const gb=(leader,r)=>{const n=((leader.w-r.w)+(r.l-leader.l))/2;return n===0?'—':Number.isInteger(n)?String(n):n.toFixed(1)};
  const setText=(el,value)=>{const v=String(value);if(el&&el.textContent!==v)el.textContent=v};

  function names(){
    const map=new Map();
    for(const p of pool()){
      if(p?.classicTeam)continue;
      const id=String(p?.teamId||'');
      if(!id||map.has(id))continue;
      map.set(id,p?.team||p?.teamShort||'Team');
    }
    return map;
  }
  function shortName(id){try{return window.TEAM_SHORT?.[id]||TEAM_SHORT?.[id]||'Team'}catch{return 'Team'}}
  function fullName(id,map){return map.get(String(id))||shortName(id)}
  function standings(s,ids,map){return ids.map(id=>({id,...record(s,id)})).sort((a,b)=>b.w-a.w||a.l-b.l||fullName(a.id,map).localeCompare(fullName(b.id,map)))}

  function streak(s,id){
    let type='',count=0;
    const last=Math.min((s?.roundIndex||0)-1,(s?.schedule?.length||0)-1);
    for(let ri=last;ri>=0;ri--){
      const game=s.schedule?.[ri]?.find(g=>String(g.home)===String(id)||String(g.away)===String(id));
      if(!game)continue;
      const result=s.results?.[game.id];
      if(!result)continue;
      const outcome=String(result.winner)===String(id)?'W':'L';
      if(!type){type=outcome;count=1;continue}
      if(outcome!==type)break;
      count++;
    }
    return type?`${type}${count}`:'—';
  }

  function matchupUpgrade(s,map){
    const matchup=document.querySelector('#seasonHub .s5-matchup');
    if(!matchup)return;
    const sides=[...matchup.querySelectorAll('.s5-side')];
    if(sides.length<2)return;
    const game=s.schedule?.[s.roundIndex]?.find(g=>String(g.home)===String(s.teamId)||String(g.away)===String(s.teamId));
    if(!game)return;
    const opp=String(game.home)===String(s.teamId)?game.away:game.home;
    [s.teamId,opp].forEach((id,i)=>{
      const side=sides[i],r=record(s,id);
      setText(side.querySelector('strong'),fullName(id,map));
      let rec=side.querySelector('.s5-matchup-record');
      if(!rec){rec=document.createElement('div');rec.className='s5-matchup-record';side.appendChild(rec)}
      setText(rec,`${r.w}-${r.l}`);
    });
  }

  function table(title,rows,s,map){
    const leader=rows[0]||{w:0,l:0};
    return `<section class="s5-table s5-table-v01120"><h3>${title}</h3><div class="s5-standings-head"><span>#</span><span>TEAM</span><span>W</span><span>L</span><span>PCT</span><span>GB</span><span>STREAK</span></div>${rows.map((r,i)=>`<div class="s5-row-v01120 ${String(r.id)===String(s.teamId)?'user':''}"><span>${i+1}</span><span class="s5-team-cell"><img src="${logo(r.id)}" alt=""><b>${fullName(r.id,map)}</b></span><span>${r.w}</span><span>${r.l}</span><span>${pct(r)}</span><span>${gb(leader,r)}</span><span>${streak(s,r.id)}</span></div>`).join('')}</section>`;
  }

  function apply(){
    queued=false;
    const hub=document.getElementById('seasonHub');
    if(!hub?.classList.contains('active'))return;
    const s=read();if(!s)return;
    const map=names();
    matchupUpgrade(s,map);
    const host=hub.querySelector('.s5-standings');
    if(!host)return;
    const marker=`${s.roundIndex}|${s.teamId}|${JSON.stringify(s.records)}|${JSON.stringify(s.results)}`;
    if(host.dataset.v01120===marker)return;
    const east=standings(s,IDS.filter(id=>EAST.has(id)),map);
    const west=standings(s,IDS.filter(id=>!EAST.has(id)),map);
    host.dataset.v01120=marker;
    host.innerHTML=table('Eastern Conference',east,s,map)+table('Western Conference',west,s,map);
  }
  function queue(delay=0){if(queued)return;queued=true;setTimeout(()=>requestAnimationFrame(apply),delay)}

  const style=document.createElement('style');
  style.textContent=`
    #seasonHub .s5-matchup-record{margin-top:4px;color:#f7b928;font-size:12px;font-weight:1000;letter-spacing:.04em}
    #seasonHub .s5-matchup .s5-side strong{font-size:11px;line-height:1.15;min-height:25px;display:flex;align-items:center;justify-content:center}
    #seasonHub .s5-table-v01120 h3{margin:0;padding:10px;background:#141b25;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
    #seasonHub .s5-standings-head,#seasonHub .s5-row-v01120{display:grid;grid-template-columns:20px minmax(0,1fr) 24px 24px 39px 30px 39px;gap:3px;align-items:center}
    #seasonHub .s5-standings-head{padding:7px;background:rgba(255,255,255,.045);font-size:7px;font-weight:1000;color:#8f99a8;letter-spacing:.055em}
    #seasonHub .s5-row-v01120{padding:7px;border-top:1px solid rgba(255,255,255,.06);font-size:8.5px;min-height:30px}
    #seasonHub .s5-row-v01120.user{background:rgba(247,185,40,.12)}
    #seasonHub .s5-row-v01120>span:not(.s5-team-cell),#seasonHub .s5-standings-head>span:not(:nth-child(2)){text-align:center}
    #seasonHub .s5-team-cell{display:flex;align-items:center;gap:5px;min-width:0}
    #seasonHub .s5-team-cell img{width:17px;height:17px;object-fit:contain;flex:0 0 17px}
    #seasonHub .s5-team-cell b{font-size:8.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    @media(max-width:430px){#seasonHub .s5-standings-head,#seasonHub .s5-row-v01120{grid-template-columns:18px minmax(0,1fr) 22px 22px 36px 28px 37px;gap:2px;padding-left:6px;padding-right:6px}#seasonHub .s5-team-cell{gap:4px}#seasonHub .s5-team-cell img{width:16px;height:16px;flex-basis:16px}#seasonHub .s5-team-cell b{font-size:8.2px}}
  `;
  document.head.appendChild(style);

  document.addEventListener('click',()=>queue(0),false);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue(0)});
  window.addEventListener('pageshow',()=>queue(0));
  queue(0);
})();
