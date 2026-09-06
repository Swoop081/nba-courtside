/* NBA Starting5 v0.11.16 — Season matchup records + full standings columns */
(()=>{
  if(window.__starting5SeasonHubStandingsV01116)return;
  window.__starting5SeasonHubStandingsV01116=true;

  const SAVE_KEY='nbaStarting5SeasonV2';
  const IDS=['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612742','1610612743','1610612765','1610612744','1610612745','1610612754','1610612746','1610612747','1610612763','1610612748','1610612749','1610612750','1610612740','1610612752','1610612760','1610612753','1610612755','1610612756','1610612757','1610612758','1610612759','1610612761','1610612762','1610612764'];
  const EAST=new Set(['1610612737','1610612738','1610612751','1610612766','1610612741','1610612739','1610612765','1610612754','1610612748','1610612749','1610612752','1610612753','1610612755','1610612761','1610612764']);
  const POS={PG:0,SG:1,SF:2,PF:3,C:4};
  let queued=false;

  const read=()=>{try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch{return null}};
  const pool=()=>{try{return Array.isArray(players)?players:[]}catch{return []}};
  const teamPlayers=id=>pool().filter(p=>String(p.teamId)===String(id)&&!p.classicTeam).sort((a,b)=>(POS[a.position]??9)-(POS[b.position]??9));
  const short=id=>{try{return window.TEAM_SHORT?.[id]||TEAM_SHORT?.[id]||teamPlayers(id)[0]?.teamShort||'Team'}catch{return teamPlayers(id)[0]?.teamShort||'Team'}};
  const full=id=>teamPlayers(id)[0]?.team||short(id);
  const logo=id=>`https://cdn.nba.com/logos/nba/${id}/global/L/logo.svg`;
  const record=(s,id)=>s?.records?.[id]||{w:0,l:0};
  const pct=r=>{const n=(r.w||0)+(r.l||0);return n?((r.w||0)/n).toFixed(3).replace(/^0/,''):'.000'};
  const standings=(s,ids)=>ids.map(id=>({id,...record(s,id)})).sort((a,b)=>b.w-a.w||a.l-b.l||full(a.id).localeCompare(full(b.id)));
  const gb=(leader,r)=>{const n=((leader.w-r.w)+(r.l-leader.l))/2;return n===0?'—':Number.isInteger(n)?String(n):n.toFixed(1)};

  function matchupUpgrade(s){
    const matchup=document.querySelector('#seasonHub .s5-matchup');
    if(!matchup||!s)return;
    const sides=[...matchup.querySelectorAll('.s5-side')];
    if(sides.length<2)return;
    const game=s.schedule?.[s.roundIndex]?.find(g=>g.home===s.teamId||g.away===s.teamId);
    if(!game)return;
    const opp=game.home===s.teamId?game.away:game.home;
    const data=[s.teamId,opp];
    sides.forEach((side,i)=>{
      const id=data[i],r=record(s,id);
      const name=side.querySelector('strong');
      if(name)name.textContent=full(id);
      let rec=side.querySelector('.s5-matchup-record');
      if(!rec){rec=document.createElement('div');rec.className='s5-matchup-record';side.appendChild(rec);}
      rec.textContent=`${r.w}-${r.l}`;
    });
  }

  function table(title,rows,s){
    const leader=rows[0]||{w:0,l:0};
    return `<section class="s5-table s5-table-v01116"><h3>${title}</h3><div class="s5-standings-head"><span>#</span><span>TEAM</span><span>W</span><span>L</span><span>PCT</span><span>GB</span></div>${rows.map((r,i)=>`<div class="s5-row-v01116 ${r.id===s.teamId?'user':''}"><span>${i+1}</span><span class="s5-team-cell"><img src="${logo(r.id)}" alt=""><b>${full(r.id)}</b></span><span>${r.w}</span><span>${r.l}</span><span>${pct(r)}</span><span>${gb(leader,r)}</span></div>`).join('')}</section>`;
  }

  function standingsUpgrade(s){
    const host=document.querySelector('#seasonHub .s5-standings');
    if(!host||!s)return;
    const east=standings(s,IDS.filter(id=>EAST.has(id)));
    const west=standings(s,IDS.filter(id=>!EAST.has(id)));
    const marker=`${s.roundIndex}|${s.teamId}|${JSON.stringify(s.records)}`;
    if(host.dataset.v01116===marker)return;
    host.dataset.v01116=marker;
    host.innerHTML=table('Eastern Conference',east,s)+table('Western Conference',west,s);
  }

  function apply(){queued=false;const hub=document.getElementById('seasonHub');if(!hub?.classList.contains('active'))return;const s=read();if(!s)return;matchupUpgrade(s);standingsUpgrade(s);}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(apply);}

  const style=document.createElement('style');
  style.textContent=`
    #seasonHub .s5-matchup-record{margin-top:4px;color:#f7b928;font-size:12px;font-weight:1000;letter-spacing:.04em}
    #seasonHub .s5-matchup .s5-side strong{font-size:11px;line-height:1.15;min-height:25px;display:flex;align-items:center;justify-content:center}
    #seasonHub .s5-table-v01116 h3{margin:0;padding:10px;background:#141b25;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
    #seasonHub .s5-standings-head,#seasonHub .s5-row-v01116{display:grid;grid-template-columns:22px minmax(0,1fr) 28px 28px 42px 34px;gap:4px;align-items:center}
    #seasonHub .s5-standings-head{padding:7px 8px;background:rgba(255,255,255,.045);font-size:8px;font-weight:1000;color:#8f99a8;letter-spacing:.08em}
    #seasonHub .s5-row-v01116{padding:7px 8px;border-top:1px solid rgba(255,255,255,.06);font-size:9px;min-height:28px}
    #seasonHub .s5-row-v01116.user{background:rgba(247,185,40,.12)}
    #seasonHub .s5-row-v01116>span:not(.s5-team-cell),#seasonHub .s5-standings-head>span:not(:nth-child(2)){text-align:center}
    #seasonHub .s5-team-cell{display:flex;align-items:center;gap:5px;min-width:0}
    #seasonHub .s5-team-cell img{width:18px;height:18px;object-fit:contain;flex:0 0 18px}
    #seasonHub .s5-team-cell b{font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    @media(max-width:430px){#seasonHub .s5-standings-head,#seasonHub .s5-row-v01116{grid-template-columns:20px minmax(0,1fr) 25px 25px 40px 31px;padding-left:7px;padding-right:7px}#seasonHub .s5-team-cell b{font-size:8.5px}}
  `;
  document.head.appendChild(style);

  const start=()=>{
    const hub=document.getElementById('seasonHub');
    if(!hub)return;
    new MutationObserver(queue).observe(hub,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('click',e=>{if(e.target.closest('#seasonModeBtn,#s5PlaySeasonGame,#playAgainBtn,#compactPlayAgain'))setTimeout(queue,0)},true);
    queue();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
