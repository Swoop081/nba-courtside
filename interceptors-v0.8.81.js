/* NBA Courtside v0.8.81 — Interceptors */
(()=>{
  if(window.__COURTSIDE_INTERCEPTORS_V081)return;
  window.__COURTSIDE_INTERCEPTORS_V081=true;

  const INTERCEPTORS=[
    ['Al Horford','Boston Celtics','1610612738','2017–18','al-horford','C',[18,18,18,23,17,17,16]],
    ['Yi Jianlian','Brooklyn Nets','1610612751','2008–09','yi-jianlian','PF',[18,20,15,20,12,14,12]],
    ['Patrick Ewing','New York Knicks','1610612752','1989–90','patrick-ewing','C',[27,28,5,28,10,26,12]],
    ['Moses Malone','Philadelphia 76ers','1610612755','1982–83','moses-malone','C',[28,29,1,30,8,16,12]],
    ['Marc Gasol','Toronto Raptors','1610612761','2018–19','marc-gasol','C',[22,15,18,28,23,25,17]],
    ['Dennis Rodman','Chicago Bulls','1610612741','1995–96','dennis-rodman','PF',[10,25,1,30,14,18,20]],
    ['LeBron James','Cleveland Cavaliers','1610612739','2008–09','lebron-james','SF',[30,30,22,24,28,17,24]],
    ['Jalen Duren','Detroit Pistons','1610612765','2024–25','jalen-duren','C',[18,28,5,27,11,16,10]],
    ['Rik Smits','Indiana Pacers','1610612754','1997–98','rik-smits','C',[24,20,8,21,12,22,9]],
    ['Glenn Robinson','Milwaukee Bucks','1610612749','2000–01','glenn-robinson','SF',[25,26,17,21,16,13,14]],
    ['Steve Smith','Atlanta Hawks','1610612737','1997–98','steve-smith','SG',[24,20,24,15,18,9,14]],
    ['Larry Johnson','Charlotte Hornets','1610612766','1992–93','larry-johnson','PF',[25,28,15,25,18,15,15]],
    ['Udonis Haslem','Miami Heat','1610612748','2004–05','udonis-haslem','PF',[16,20,8,24,10,13,10]],
    ['Jameer Nelson','Orlando Magic','1610612753','2008–09','jameer-nelson','PG',[20,12,22,10,24,5,16]],
    ['Rod Strickland','Washington Wizards','1610612764','1997–98','rod-strickland','PG',[22,16,10,12,28,5,22]],
    ['Dikembe Mutombo','Denver Nuggets','1610612743','1994–95','dikembe-mutombo','C',[18,24,1,30,8,30,13]],
    ['Kevin Garnett','Minnesota Timberwolves','1610612750','2003–04','kevin-garnett','PF',[27,28,10,30,22,28,22]],
    ['Alex Caruso','Oklahoma City Thunder','1610612760','2024–25','alex-caruso','SG',[14,20,19,12,19,10,29]],
    ['Brandon Roy','Portland Trail Blazers','1610612757','2008–09','brandon-roy','SG',[27,24,20,18,22,8,15]],
    ['Lauri Markkanen','Utah Jazz','1610612762','2022–23','lauri-markkanen','PF',[26,24,27,24,12,13,9]],
    ['Draymond Green','Golden State Warriors','1610612744','2015–16','draymond-green','PF',[16,18,11,25,24,20,22]],
    ['Chris Paul','LA Clippers','1610612746','2013–14','chris-paul','PG',[24,10,25,13,30,4,28]],
    ['Metta World Peace','Los Angeles Lakers','1610612747','2009–10','metta-world-peace','SF',[22,21,18,19,15,12,25]],
    ['Shawn Marion','Phoenix Suns','1610612756','2005–06','shawn-marion','SF',[24,28,15,27,13,24,24]],
    ['Chris Webber','Sacramento Kings','1610612758','2000–01','chris-webber','PF',[27,29,8,28,21,19,18]],
    ['Jason Terry','Dallas Mavericks','1610612742','2008–09','jason-terry','SG',[24,16,25,10,23,4,18]],
    ['Hakeem Olajuwon','Houston Rockets','1610612745','1993–94','hakeem-olajuwon','C',[29,28,1,30,13,30,24]],
    ['Shane Battier','Memphis Grizzlies','1610612763','2005–06','shane-battier','SF',[16,14,21,17,14,16,20]],
    ['Derik Queen','New Orleans Pelicans','1610612740','2025–26','derik-queen','C',[18,24,8,23,11,17,10]],
    ['Bruce Bowen','San Antonio Spurs','1610612759','2004–05','bruce-bowen','SF',[14,12,24,13,12,9,25]]
  ];

  INTERCEPTORS.forEach((r,i)=>{
    const[name,team,tid,season,slug,position,v]=r;
    const[scoring,dunks,three,rebounding,passing,blocks,steals]=v;
    players.push({
      id:'p'+(90+i),name,team,teamShort:TEAM_SHORT[tid]||team,season,teamId:tid,
      playerId:'interceptors-'+slug,
      stats:{scoring,dunks,three,freeThrows:1,rebounding,passing,blocks,steals},
      artSlug:slug,art:{x:'50%',y:'100%',s:.8,r:0},position,
      theme:{a:'#6f7781',b:'#d4a84e',c:'#171b20'},set:'Interceptors'
    });
  });

  const before=cardMarkup;
  cardMarkup=function(p,o={}){
    let html=before(p,o);
    if(p.set!=='Interceptors')return html;
    html=html.replace('player-card ','player-card interceptors ');
    html=html.replace('<div class="team-mark">','<div class="interceptor-machinery" aria-hidden="true"><i class="gear gear-a"></i><i class="gear gear-b"></i><i class="gear gear-c"></i><i class="gear gear-d"></i><i class="mechanical-rail rail-a"></i><i class="mechanical-rail rail-b"></i></div><div class="team-mark">');
    return html;
  };

  const style=document.createElement('style');
  style.id='interceptors-set-style-v081';
  style.textContent=`
    .player-card.interceptors{background:linear-gradient(160deg,#20262d 0%,#3a4148 48%,#11151a 100%)!important}
    .player-card.interceptors .card-backdrop{
      background-image:linear-gradient(90deg,rgba(8,11,14,.54),rgba(8,11,14,.10) 38%,rgba(8,11,14,.22) 100%),linear-gradient(0deg,rgba(5,8,11,.58),transparent 42%),url('assets/player-art/interceptors.JPG')!important;
      background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important
    }
    .player-card.interceptors .holo-grid{opacity:.05!important}
    .player-card.interceptors .rarity-burst{opacity:.05!important}
    .player-card.interceptors .beam{display:none!important}
    .player-card.interceptors .foil-field{opacity:.18!important;background:linear-gradient(120deg,transparent 0 35%,rgba(219,181,94,.16) 44%,transparent 53%),radial-gradient(circle at 78% 20%,rgba(210,220,230,.13),transparent 28%)!important}
    .player-card.interceptors .interceptor-machinery{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none;opacity:.38}
    .player-card.interceptors .gear{position:absolute;border:5px dashed rgba(224,191,111,.62);border-radius:50%;box-shadow:inset 0 0 0 5px rgba(40,47,54,.62),0 0 12px rgba(0,0,0,.55)}
    .player-card.interceptors .gear:after{content:'';position:absolute;inset:25%;border:3px solid rgba(225,231,236,.42);border-radius:50%}
    .player-card.interceptors .gear-a{width:70px;height:70px;right:-22px;top:58px;transform:rotate(17deg)}
    .player-card.interceptors .gear-b{width:46px;height:46px;right:34px;top:16px;transform:rotate(-11deg)}
    .player-card.interceptors .gear-c{width:62px;height:62px;left:-28px;bottom:78px;transform:rotate(24deg)}
    .player-card.interceptors .gear-d{width:34px;height:34px;left:28px;bottom:138px;transform:rotate(-18deg)}
    .player-card.interceptors .mechanical-rail{position:absolute;height:2px;background:linear-gradient(90deg,transparent,#dfbd68,rgba(226,232,237,.68),transparent);box-shadow:0 0 5px rgba(208,170,82,.45)}
    .player-card.interceptors .rail-a{left:22%;right:6%;top:18%;transform:rotate(-13deg)}
    .player-card.interceptors .rail-b{left:8%;right:28%;bottom:31%;transform:rotate(11deg)}
    .player-card.interceptors .art-stage{z-index:12!important}
    .player-card.interceptors .identity{background:linear-gradient(90deg,#171b20 0%,#343b42 42%,#76633b 74%,#1b2025 100%)!important;border-top:1px solid #d7b45e!important;box-shadow:inset 0 4px 12px rgba(218,184,99,.18),0 -2px 8px rgba(0,0,0,.45)!important}
    .player-card.interceptors .identity h3{color:#fff!important;text-shadow:0 1px 4px #000!important}
    .player-card.interceptors .identity p{color:#d8dce0!important}
    .player-card.interceptors .frame-outer{border-color:#d7b45e!important;box-shadow:inset 0 0 12px rgba(207,171,85,.35),0 0 12px rgba(0,0,0,.5)!important}
    .player-card.interceptors .edge-glow{box-shadow:inset 0 0 12px rgba(226,197,124,.28)!important}
    .catalogue-set-logo.interceptors-set-logo{background:radial-gradient(circle at 50% 50%,#555f68 0 18%,#22282e 19% 51%,#9b7b3d 52% 58%,#12161a 59% 100%)!important;border-color:#d7b45e!important;box-shadow:0 0 0 3px #2d3339,0 10px 24px rgba(0,0,0,.55)!important}
    .catalogue-set-logo.interceptors-set-logo strong{font-size:14px!important;color:#f4f5f6!important;letter-spacing:.08em!important}
    .catalogue-set-logo.interceptors-set-logo b{font-size:10px!important;color:#d7b45e!important;letter-spacing:.12em!important}
    .catalogue-set-logo.interceptors-set-logo span{color:#cfd5da!important}
  `;
  document.head.appendChild(style);

  const syncSetLogo=()=>{
    const n=document.getElementById('catalogueTeamName'),b=document.querySelector('.catalogue-set-logo');
    if(!n||!b)return;
    if(n.textContent==='Interceptors'){
      b.className='catalogue-set-logo interceptors-set-logo';
      b.innerHTML='<span>NBA</span><strong>INTERCEPTORS</strong><b>MECHANICAL SERIES</b>';
    }
  };
  window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{
    const n=document.getElementById('catalogueTeamName');
    if(n)new MutationObserver(syncSetLogo).observe(n,{childList:true,subtree:true,characterData:true});
    syncSetLogo();
  },120));
})();
