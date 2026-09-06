/* NBA Starting5 v0.11.13 — team-colour scoreboard authority */
(()=>{
  if(window.__s5ScoreboardTeamColorsV01113)return;
  window.__s5ScoreboardTeamColorsV01113=true;

  const board=()=>document.querySelector('#game .scoreboard');
  const pickColor=(p,fallback)=>p?.theme?.a||p?.theme?.b||fallback;
  const pickAccent=(p,fallback)=>p?.theme?.b||p?.theme?.a||fallback;
  const pickDark=(p,fallback)=>p?.theme?.c||'#07111d'||fallback;

  function paintSide(el,p,isAway){
    if(!el||!p)return;
    const a=pickColor(p,isAway?'#1f2937':'#0f3d66');
    const b=pickAccent(p,'#ffffff');
    const c=pickDark(p,'#07111d');
    el.style.setProperty('--s5-team-a',a);
    el.style.setProperty('--s5-team-b',b);
    el.style.setProperty('--s5-team-c',c);
    el.style.setProperty('background',`linear-gradient(135deg, ${a} 0%, ${a} 52%, ${c} 100%)`,'important');
    el.style.setProperty('border-color',b,'important');
  }

  function sync(){
    const sb=board();
    if(!sb)return;
    let home=null,away=null;
    const scoreSides=[...sb.querySelectorAll('.score-side')];
    if(scoreSides.length>=2){home=scoreSides[0];away=scoreSides[scoreSides.length-1];}
    if(!home||!away){
      const direct=[...sb.children].filter(el=>!el.classList.contains('quarter-badge'));
      if(direct.length>=2){home=home||direct[0];away=away||direct[direct.length-1];}
    }
    let u=null,c=null;
    try{u=Array.isArray(userTeam)&&userTeam.length?userTeam[0]:null}catch{}
    try{c=Array.isArray(cpuTeam)&&cpuTeam.length?cpuTeam[0]:null}catch{}
    paintSide(home,u,false);
    paintSide(away,c,true);
  }

  const wrap=name=>{
    let fn=null;try{fn=window[name]||eval(name)}catch{}
    if(typeof fn!=='function'||fn.__s5ScoreColorsWrapped)return;
    const wrapped=function(){const r=fn.apply(this,arguments);requestAnimationFrame(sync);return r};
    wrapped.__s5ScoreColorsWrapped=true;
    window[name]=wrapped;
    try{eval(`${name}=window[name]`)}catch{}
  };

  const start=()=>{
    ['resetGame','beginQuarter','playQuarter'].forEach(wrap);
    const sb=board();
    if(sb)new MutationObserver(()=>requestAnimationFrame(sync)).observe(sb,{childList:true,subtree:true});
    sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
