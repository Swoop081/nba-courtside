/* NBA Starting5 v0.11.25 — manual overtime card selection + clean quarter transition */
(()=>{
  if(window.__s5OvertimeManualPickV01125)return;
  window.__s5OvertimeManualPickV01125=true;

  const labels={scoring:'Scoring',dunks:'Dunking',three:'3PT',freeThrows:'Free Throws',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
  const manualBegin=function(){
    if(typeof state==='undefined'||!state)return;
    state.category=(window.STAT_KEYS||['scoring','dunks','three','freeThrows','rebounding','passing','blocks','steals'])[Math.floor(Math.random()*8)];
    const q=document.getElementById('quarterLabel'),c=document.getElementById('categoryLabel'),us=document.getElementById('userScore'),cs=document.getElementById('cpuScore'),ins=document.getElementById('instruction'),panel=document.getElementById('revealPanel');
    if(q)q.textContent=state.overtime?'OT':'Q'+state.quarter;
    if(c)c.textContent=(labels[state.category]||state.category).toUpperCase();
    if(us)us.textContent=state.userScore;if(cs)cs.textContent=state.cpuScore;
    if(ins)ins.textContent=state.overtime?'Overtime — tap your final card when ready':('Choose one unused player for '+(labels[state.category]||state.category));
    panel?.classList.add('hidden');
    if(typeof renderLineup==='function')renderLineup();
  };
  window.beginQuarter=manualBegin;try{beginQuarter=manualBegin}catch{}

  const style=document.createElement('style');
  style.textContent=`body.s5-quarter-transitioning #revealPanel{display:none!important}body.s5-quarter-transitioning #lineup.result-open{pointer-events:none}`;
  document.head.appendChild(style);

  const start=()=>{
    const t=document.getElementById('quarterTransition');if(!t)return;
    const sync=()=>document.body.classList.toggle('s5-quarter-transitioning',!t.classList.contains('hidden'));
    new MutationObserver(sync).observe(t,{attributes:true,attributeFilter:['class']});sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
