/* NBA Starting5 v0.13.0-dev.2 — actual/simulated matchup +/- ledger for season awards and All-Star selections. Event-driven; no global Storage patch. */
(()=>{
  if(window.__starting5MatchupLedgerV01302)return;
  window.__starting5MatchupLedgerV01302=true;
  const SAVE_KEY='nbaStarting5SeasonV2';
  const ACTIVE_KEY='nbaStarting5SeasonGameUiV1';
  const CATS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const DEF=new Set(['blocks','steals']);
  const POS=['PG','SG','SF','PF','C'];
  const pool=()=>{try{return Array.isArray(players)?players.filter(p=>!p.classicTeam):[]}catch{return []}};
  const key=p=>String(p?.id||p?.playerId||`${p?.teamId}|${p?.name}|${p?.position}`);
  const stat=(p,c)=>Number(p?.stats?.[c]??0)||0;
  const teamPlayers=id=>pool().filter(p=>String(p.teamId)===String(id)).slice(0,5);
  const gameMap=s=>{const m=new Map();for(const round of s?.schedule||[])for(const g of round||[])m.set(g.id,g);return m};
  const playerBy=(k,name,teamId)=>pool().find(p=>key(p)===String(k))||pool().find(p=>p.name===name&&String(p.teamId)===String(teamId))||null;
  function hash(str){let h=2166136261>>>0;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function bestUnused(roster,used,cat){const a=roster.filter(p=>!used.has(key(p)));if(!a.length)return null;return a.reduce((best,p)=>stat(p,cat)>stat(best,cat)?p:best)}
  function entry(cat,a,b){const av=stat(a,cat),bv=stat(b,cat),d=av-bv;return{category:cat,a:{key:key(a),name:a.name,teamId:String(a.teamId),value:av,diff:d},b:{key:key(b),name:b.name,teamId:String(b.teamId),value:bv,diff:-d}}}
  function simulateGame(g){
    const home=teamPlayers(g.home),away=teamPlayers(g.away);if(home.length<5||away.length<5)return[];
    const r=rng(hash(g.id)),hu=new Set(),au=new Set(),out=[];let hs=0,as=0;
    const play=()=>{const cat=CATS[Math.floor(r()*CATS.length)],h=bestUnused(home,hu,cat),a=bestUnused(away,au,cat);if(!h||!a)return;hu.add(key(h));au.add(key(a));const e=entry(cat,h,a);out.push(e);if(e.a.diff>0)hs++;else if(e.a.diff<0)as++};
    for(let i=0;i<4;i++)play();if(hs===as)play();return out;
  }
  function actualHistory(s,g){
    try{
      if(sessionStorage.getItem(ACTIVE_KEY)!=='1'||typeof state==='undefined'||!Array.isArray(state?.history)||!state.history.length)return null;
      const opp=String(g.home)===String(s.teamId)?String(g.away):String(g.home),out=[];
      for(const h of state.history){if(!h?.user||!h?.cpu||!CATS.includes(h.category))continue;const up=h.user,cp=h.cpu,uv=Number(h.userPts??stat(up,h.category))||0,cv=Number(h.cpuPts??stat(cp,h.category))||0,d=uv-cv;out.push({category:h.category,a:{key:key(up),name:up.name,teamId:String(s.teamId),value:uv,diff:d},b:{key:key(cp),name:cp.name,teamId:opp,value:cv,diff:-d}})}return out.length?out:null;
    }catch{return null}
  }
  function enrich(s){
    if(!s?.results)return false;const gm=gameMap(s);let changed=false;
    for(const [id,res] of Object.entries(s.results)){if(Array.isArray(res.matchups)&&res.matchups.length)continue;const g=gm.get(id);if(!g)continue;const actual=res.userPlayed?actualHistory(s,g):null;res.matchups=actual||simulateGame(g);res.matchupLedgerSource=actual?'actual':'simulated';if(res.userPlayed&&!actual)res.matchupLedgerSource='legacy-simulated';changed=true}
    if(changed)s.matchupLedgerVersion=2;return changed;
  }
  function rowsFrom(s,ids=null){
    enrich(s);const rows=new Map(),gm=gameMap(s),seenGames=new Map();
    const ensure=side=>{const p=playerBy(side.key,side.name,side.teamId);if(!p)return null;const k=key(p);if(!rows.has(k))rows.set(k,{key:k,name:p.name,teamId:String(p.teamId),position:p.position||'',p,plus:0,defPlus:0,games:0,categoryPlus:Object.fromEntries(CATS.map(c=>[c,0]))});return rows.get(k)};
    for(const [id,res] of Object.entries(s?.results||{})){if(ids&&!ids.has(id))continue;if(!gm.has(id))continue;for(const m of res.matchups||[]){if(!CATS.includes(m.category)||!m.a||!m.b)continue;for(const side of [m.a,m.b]){const r=ensure(side);if(!r)continue;const d=Number(side.diff)||0;r.plus+=d;r.categoryPlus[m.category]+=d;if(DEF.has(m.category))r.defPlus+=d;let set=seenGames.get(r.key);if(!set){set=new Set();seenGames.set(r.key,set)}if(!set.has(id)){set.add(id);r.games++}}}}
    return[...rows.values()];
  }
  function calculate(s){const arr=rowsFrom(s),mvp=[...arr].sort((a,b)=>b.plus-a.plus||b.games-a.games||a.name.localeCompare(b.name)),dpoy=[...arr].sort((a,b)=>b.defPlus-a.defPlus||b.games-a.games||a.name.localeCompare(b.name)),allNBA={first:[],second:[],third:[]};for(const pos of POS){const q=arr.filter(r=>r.position===pos).sort((a,b)=>b.plus-a.plus||b.games-a.games);if(q[0])allNBA.first.push(q[0]);if(q[1])allNBA.second.push(q[1]);if(q[2])allNBA.third.push(q[2])}return{players:arr,mvp,dpoy,allNBA,completedGames:Object.keys(s?.results||{}).length}}
  function categoryRows(s){const ids=new Set();for(let i=0;i<Math.min(41,s?.schedule?.length||0);i++)for(const g of s.schedule[i]||[])if(s.results?.[g.id])ids.add(g.id);return rowsFrom(s,ids).map(r=>({key:r.key,p:r.p,plus:{...r.categoryPlus},total:r.plus,games:r.games}))}
  function persistEnriched(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s&&enrich(s))localStorage.setItem(SAVE_KEY,JSON.stringify(s))}catch{}}

  window.STARTING5_MATCHUP_PLUS={calculate,categoryRows,enrich,simulateGame};
  if(window.STARTING5_SEASON_AWARDS)window.STARTING5_SEASON_AWARDS.calculate=calculate;
  window.addEventListener('s5:game-finished',()=>setTimeout(persistEnriched,0));
  persistEnriched();
})();