/* NBA Courtside v0.8.63 — single-position cards + balanced teams + compact finals + corrected Thunder image framing */
(() => {
  const POSITION_BY_SLUG={
    'derrick-white':'SG','michael-porter-jr':'SF','josh-hart':'SF','vj-edgecombe':'SG','jakobe-walter':'SG','josh-giddey':'PG','jarrett-allen':'C','cade-cunningham':'PG','obi-toppin':'PF','kyle-kuzma':'PF','jalen-johnson':'PF','kon-knueppel':'SG','bam-adebayo':'C','jalen-suggs':'PG','bub-carrington':'PG','nikola-jokic':'C','rudy-gobert':'C','shai-gilgeous-alexander':'PG','scoot-henderson':'PG','keyonte-george':'PG','brandin-podziemski':'SG','brook-lopez':'C','luka-doncic':'PG','dillon-brooks':'SF','zach-lavine':'SG','cooper-flagg':'PF','reed-sheppard':'SG','gg-jackson':'PF','jeremiah-fears':'PG','victor-wembanyama':'C',
    'antoine-walker':'PF','kenny-anderson':'PG','nate-robinson':'PG','julius-erving':'SF','vince-carter':'SG','michael-jordan':'SG','bob-sura':'SG','grant-hill':'SF','jamaal-tinsley':'PG','tj-ford':'PG','doc-rivers':'PG','kendall-gill':'SG','harold-miner':'SG','shaquille-oneal':'C','caron-butler':'SF','laphonso-ellis':'PF','jr-rider':'SG','serge-ibaka':'PF','arvydas-sabonis':'C','jeff-hornacek':'SG','jason-richardson':'SG','deandre-jordan':'C','lonzo-ball':'PG','dan-majerle':'SG','deaaron-fox':'PG','jason-kidd':'PG','kenny-smith':'PG','shareef-abdur-rahim':'PF','zion-williamson':'PF','tony-parker':'PG',
    'jayson-tatum':'SF','kenyon-martin':'PF','jalen-brunson':'PG','allen-iverson':'SG','rj-barrett':'SF','joakim-noah':'C','donovan-mitchell':'SG','tayshaun-prince':'SF','danny-granger':'SF','giannis-antetokounmpo':'PF','josh-smith':'PF','brandon-miller':'SF','alonzo-mourning':'C','nick-anderson':'SG','john-wall':'PG','jamal-murray':'PG','anthony-edwards':'SG','jalen-williams':'SF','shaedon-sharpe':'SG','andrei-kirilenko':'SF','steph-curry':'PG','jamal-crawford':'SG','lamar-odom':'PF','kevin-durant':'SF','malik-monk':'SG','jamal-mashburn':'SF','robert-horry':'PF','jason-williams':'PG','brandon-ingram':'SF','demar-derozan':'SF'
  };
  const POSITIONS=['PG','SG','SF','PF','C'];
  players.forEach(p=>{p.position=POSITION_BY_SLUG[p.artSlug]||'SF';});

  const THUNDER_FRAME={
    'kenny-anderson':{shift:8,scale:1.16},
    'julius-erving':{shift:10,scale:1.22},
    'michael-jordan':{shift:10,scale:1.22},
    'lonzo-ball':{shift:10,scale:1.20},
    'deaaron-fox':{shift:10,scale:1.20}
  };

  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
  dealTeams=function(){
    const used=new Set();
    const build=()=>POSITIONS.map(pos=>{
      const eligible=shuffle(players.filter(p=>p.position===pos&&!used.has(p.id)));
      const pick=eligible[0];
      if(pick)used.add(pick.id);
      return pick;
    }).filter(Boolean);
    userTeam=build();
    cpuTeam=build();
  };

  const before=cardMarkup;
  cardMarkup=function(p,o={}){
    let html=before(p,o);
    if(p.position)html=html.replace('<div class="team-mark">',`<div class="card-position">${p.position}</div><div class="team-mark">`);
    if(THUNDER_FRAME[p.artSlug])html=html.replace('class="player-card ',`class="player-card thunder-frame-${p.artSlug} `);
    return html;
  };

  const style=document.createElement('style');
  style.id='courtside-position-style-v0863';
  style.textContent=`
    .player-card .card-position{position:absolute;top:12px;right:13px;z-index:39;color:#fff;font-size:15px;line-height:1;font-weight:1000;letter-spacing:.045em;text-shadow:0 2px 5px rgba(0,0,0,.9),0 0 8px rgba(0,0,0,.7);pointer-events:none}
    .catalogue-grid .player-card .card-position{top:7px;right:8px;font-size:8px;letter-spacing:.03em}

    /* Keep the art stage in its normal card bounds. Only reposition the player cutout itself,
       so there is no artificial horizontal crop through the torso. */
    .player-card.thunder-frame-kenny-anderson .cutout-art{top:6px!important;left:56%!important;transform:translateX(-50%) translateY(8%) scale(1.16)!important;transform-origin:center top!important}
    .player-card.thunder-frame-julius-erving .cutout-art{top:6px!important;left:56%!important;transform:translateX(-50%) translateY(10%) scale(1.22)!important;transform-origin:center top!important}
    .player-card.thunder-frame-michael-jordan .cutout-art{top:6px!important;left:56%!important;transform:translateX(-50%) translateY(10%) scale(1.22)!important;transform-origin:center top!important}
    .player-card.thunder-frame-lonzo-ball .cutout-art{top:6px!important;left:56%!important;transform:translateX(-50%) translateY(10%) scale(1.20)!important;transform-origin:center top!important}
    .player-card.thunder-frame-deaaron-fox .cutout-art{top:6px!important;left:56%!important;transform:translateX(-50%) translateY(10%) scale(1.20)!important;transform-origin:center top!important}

    #final .final-team strong.final-score-three{font-size:54px!important;letter-spacing:-.075em!important}
    @media(max-width:430px){
      .player-card .card-position{top:10px;right:11px;font-size:13px}.catalogue-grid .player-card .card-position{top:6px;right:7px;font-size:7.5px}
      #final .final-card{padding:8px 8px 8px!important;gap:5px!important}
      #final .story-summary{gap:4px!important;margin-top:0!important}
      #final .story-row{padding:8px 10px!important;gap:9px!important}
      #final .story-row small{margin-top:3px!important}
      #final .final-winner{margin:0 0 2px!important}
      #final .final-team strong.final-score-three{font-size:47px!important;letter-spacing:-.075em!important}
    }
  `;
  document.head.appendChild(style);

  if(typeof dealTeams==='function'){dealTeams();if(typeof renderStarterFive==='function')renderStarterFive();}
})();

/* Final-screen tie copy and three-digit score fitting. */
window.addEventListener('load',()=>setTimeout(()=>{
  if(typeof finishGame!=='function'||window.__courtsideFinalPolishInstalled)return;
  window.__courtsideFinalPolishInstalled=true;
  const beforeFinish=finishGame;
  finishGame=function(){
    beforeFinish();
    requestAnimationFrame(()=>{
      if(state?.history){
        const rows=[...document.querySelectorAll('#final .story-row')];
        state.history.forEach((h,i)=>{
          if(h.userPts!==h.cpuPts)return;
          const strong=rows[i]?.querySelector('strong');
          if(strong)strong.textContent=`${h.user.name} and ${h.cpu.name} went head to head`;
        });
      }
      document.querySelectorAll('#final .final-team strong').forEach(el=>{
        el.classList.toggle('final-score-three',(el.textContent||'').trim().length>=3);
      });
    });
  };
},0));
