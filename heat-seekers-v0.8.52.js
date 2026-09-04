/* NBA Courtside v0.8.52 — Heat Seekers */
const HEAT_SEEKERS=[
['Jayson Tatum','Boston Celtics','1610612738','2022–23','jayson-tatum',[30.1,8.8,4.6,1.1,.7,3.2,.350],26],
['Kenyon Martin','Brooklyn Nets','1610612751','2003–04','kenyon-martin',[16.7,9.5,2.5,1.5,1.3,.1,.280],29],
['Jalen Brunson','New York Knicks','1610612752','2023–24','jalen-brunson',[28.7,3.6,6.7,.9,.2,2.7,.401],18],
['Allen Iverson','Philadelphia 76ers','1610612755','2005–06','allen-iverson',[33.0,3.2,7.4,1.9,.1,1.0,.323],25],
['RJ Barrett','Toronto Raptors','1610612761','2024–25','rj-barrett',[21.1,6.3,5.4,.8,.4,1.6,.350],22],
['Joakim Noah','Chicago Bulls','1610612741','2013–14','joakim-noah',[12.6,11.3,5.4,1.2,1.5,0,0],25],
['Donovan Mitchell','Cleveland Cavaliers','1610612739','2022–23','donovan-mitchell',[28.3,4.3,4.4,1.5,.4,3.6,.386],29],
['Tayshaun Prince','Detroit Pistons','1610612765','2004–05','tayshaun-prince',[14.7,5.3,3.0,.7,.9,1.0,.341],22],
['Danny Granger','Indiana Pacers','1610612754','2008–09','danny-granger',[25.7,5.1,2.7,1.0,1.4,2.7,.404],24],
['Giannis Antetokounmpo','Milwaukee Bucks','1610612749','2022–23','giannis-antetokounmpo',[31.1,11.8,5.7,.8,.8,.7,.275],30],
['Josh Smith','Atlanta Hawks','1610612737','2011–12','josh-smith',[18.8,9.6,3.9,1.4,1.7,.4,.257],30],
['Brandon Miller','Charlotte Hornets','1610612766','2024–25','brandon-miller',[21.0,4.9,3.6,1.1,.7,3.9,.355],24],
['Alonzo Mourning','Miami Heat','1610612748','1998–99','alonzo-mourning',[20.1,11.0,1.6,.7,3.9,0,0],28],
['Nick Anderson','Orlando Magic','1610612753','1992–93','nick-anderson',[19.9,6.0,3.4,1.6,.7,1.3,.353],24],
['John Wall','Washington Wizards','1610612764','2016–17','john-wall',[23.1,4.2,10.7,2.0,.6,1.1,.327],27],
['Jamal Murray','Denver Nuggets','1610612743','2023–24','jamal-murray',[21.2,4.1,6.5,1.0,.7,2.5,.425],20],
['Anthony Edwards','Minnesota Timberwolves','1610612750','2024–25','anthony-edwards',[27.6,5.7,4.5,1.2,.6,4.1,.395],30],
['Jalen Williams','Oklahoma City Thunder','1610612760','2024–25','jalen-williams',[21.6,5.3,5.1,1.6,.7,1.8,.365],26],
['Shaedon Sharpe','Portland Trail Blazers','1610612757','2024–25','shaedon-sharpe',[18.5,4.5,2.8,.8,.2,1.9,.311],30],
['Andrei Kirilenko','Utah Jazz','1610612762','2003–04','andrei-kirilenko',[16.5,8.1,3.1,1.9,2.8,.7,.338],25],
['Stephen Curry','Golden State Warriors','1610612744','2015–16','steph-curry',[30.1,5.4,6.7,2.1,.2,5.1,.454],15],
['Jamal Crawford','LA Clippers','1610612746','2013–14','jamal-crawford',[18.6,2.3,3.2,.9,.2,2.3,.361],23],
['Lamar Odom','Los Angeles Lakers','1610612747','2005–06','lamar-odom',[14.8,9.2,5.5,.9,.8,.6,.372],27],
['Kevin Durant','Phoenix Suns','1610612756','2023–24','kevin-durant',[27.1,6.6,5.0,.9,1.2,2.2,.413],25],
['Malik Monk','Sacramento Kings','1610612758','2024–25','malik-monk',[17.2,3.8,5.6,.9,.6,2.3,.325],27],
['Jamal Mashburn','Dallas Mavericks','1610612742','1994–95','jamal-mashburn',[24.1,4.1,3.7,1.0,.2,1.8,.375],23],
['Robert Horry','Houston Rockets','1610612745','1995–96','robert-horry',[12.0,5.8,4.0,1.6,1.5,2.0,.366],25],
['Jason Williams','Memphis Grizzlies','1610612763','2001–02','jason-williams',[14.8,3.0,8.0,1.7,.1,1.9,.295],15],
['Brandon Ingram','New Orleans Pelicans','1610612740','2019–20','brandon-ingram',[23.8,6.1,4.2,1.0,.6,2.4,.391],24],
['DeMar DeRozan','San Antonio Spurs','1610612759','2020–21','demar-derozan',[21.6,4.2,6.9,.9,.2,.5,.257],28]
];

const HEAT_ART={
'jayson-tatum':[50,100,.78],'kenyon-martin':[50,100,.80],'jalen-brunson':[50,100,.80],'allen-iverson':[50,100,.80],'rj-barrett':[50,100,.79],'joakim-noah':[50,100,.78],'donovan-mitchell':[50,100,.80],'tayshaun-prince':[50,100,.79],'danny-granger':[50,100,.79],'giannis-antetokounmpo':[50,100,.77],'josh-smith':[50,100,.79],'brandon-miller':[50,100,.79],'alonzo-mourning':[50,100,.78],'nick-anderson':[50,100,.80],'john-wall':[50,100,.80],'jamal-murray':[50,100,.80],'anthony-edwards':[50,100,.80],'jalen-williams':[50,100,.80],'shaedon-sharpe':[50,100,.79],'andrei-kirilenko':[50,100,.78],'steph-curry':[50,100,.80],'jamal-crawford':[50,100,.80],'lamar-odom':[50,100,.79],'kevin-durant':[50,100,.78],'malik-monk':[50,100,.80],'jamal-mashburn':[50,100,.79],'robert-horry':[50,100,.79],'jason-williams':[50,100,.80],'brandon-ingram':[50,100,.79],'demar-derozan':[50,100,.80]};

HEAT_SEEKERS.forEach((r,i)=>{const[name,team,tid,season,slug,line,dunk]=r,[pts,reb,ast,stl,blk,tm,tp]=line,t=HEAT_ART[slug]||[50,100,.79];players.push({id:'p'+(60+i),name,team,teamShort:TEAM_SHORT[tid]||team,season,teamId:tid,playerId:'heat-'+slug,stats:{scoring:historicScale(pts,33.5),dunks:dunk,three:historicThree(tm,tp),freeThrows:1,rebounding:historicScale(reb,13.8),passing:historicScale(ast,10.7),blocks:historicScale(blk,3.9),steals:historicScale(stl,2.9)},artSlug:slug,art:{x:t[0]+'%',y:t[1]+'%',s:t[2],r:0},theme:{a:'#ff4a0a',b:'#ffb21a',c:'#4b0804'},set:'Heat Seekers'});});

const originalCardMarkupHeat=cardMarkup;
cardMarkup=function(p,o={}){let html=originalCardMarkupHeat(p,o);if(p.set!=='Heat Seekers')return html;html=html.replace('player-card ','player-card heat-seekers ');html=html.replace('<div class="team-mark">','<div class="heat-fire" aria-hidden="true"><i class="flame flame-a"></i><i class="flame flame-b"></i><i class="flame flame-c"></i><i class="ember ember-a"></i><i class="ember ember-b"></i><i class="ember ember-c"></i></div><div class="team-mark">');return html;};

(function installHeatSeekersVisuals(){const style=document.createElement('style');style.id='heat-seekers-set-style-v0852';style.textContent=`
.player-card.heat-seekers{background:linear-gradient(160deg,#ff7a08 0%,#b82707 40%,#3d0704 100%)!important}
.player-card.heat-seekers .card-backdrop{background:radial-gradient(circle at 22% 20%,rgba(255,214,80,.7),transparent 22%),radial-gradient(circle at 75% 38%,rgba(255,89,15,.65),transparent 30%),linear-gradient(180deg,#d73b08 0%,#7d1608 46%,#230505 100%)!important}
.player-card.heat-seekers .holo-grid{background:repeating-radial-gradient(ellipse at 50% 115%,rgba(255,185,37,.19) 0 4%,rgba(255,67,8,.08) 5% 8%,transparent 9% 15%)!important;opacity:.78!important;mix-blend-mode:screen}
.player-card.heat-seekers .beam{display:none!important}.player-card.heat-seekers .rarity-burst{opacity:.18!important;background:repeating-conic-gradient(from 180deg at 50% 105%,rgba(255,204,54,.34) 0 2deg,transparent 2deg 15deg)!important}
.player-card.heat-seekers .heat-fire{position:absolute;inset:0;z-index:4;overflow:hidden;pointer-events:none}.player-card.heat-seekers .art-stage{z-index:12!important}.player-card.heat-seekers .team-mark{z-index:5!important}
.player-card.heat-seekers .flame{position:absolute;display:block;bottom:31%;width:25%;height:48%;background:linear-gradient(180deg,rgba(255,241,140,.92),#ffb119 38%,#ff4b08 70%,rgba(118,13,5,.2));clip-path:polygon(50% 0,67% 25%,81% 12%,84% 45%,100% 64%,78% 100%,22% 100%,0 65%,18% 42%,25% 16%,38% 35%);filter:blur(.2px) drop-shadow(0 0 7px rgba(255,112,13,.85));opacity:.82;mix-blend-mode:screen}.player-card.heat-seekers .flame-a{left:-3%;transform:rotate(-10deg) scale(.95)}.player-card.heat-seekers .flame-b{left:38%;height:58%;width:28%;bottom:28%;opacity:.68}.player-card.heat-seekers .flame-c{right:-5%;height:44%;transform:rotate(12deg);opacity:.74}
.player-card.heat-seekers .ember{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffd75b;box-shadow:0 0 8px #ff6a0b,0 0 16px #ff2f00}.player-card.heat-seekers .ember-a{left:22%;top:18%}.player-card.heat-seekers .ember-b{left:73%;top:25%;width:3px;height:3px}.player-card.heat-seekers .ember-c{left:55%;top:11%;width:5px;height:5px}
.player-card.heat-seekers .foil-field{background:radial-gradient(ellipse at 72% 20%,rgba(255,212,70,.23),transparent 30%),radial-gradient(ellipse at 25% 60%,rgba(255,61,7,.18),transparent 42%)!important;opacity:.72!important}
.player-card.heat-seekers .identity{background:linear-gradient(90deg,#7d1007 0%,#d63208 43%,#ff650d 78%,#8a1505 100%)!important;border-top:1px solid #ffbc3c!important;box-shadow:inset 0 5px 14px rgba(255,173,33,.24),0 -2px 9px rgba(255,64,8,.28)!important}.player-card.heat-seekers .identity h3{color:#fff!important;text-shadow:0 0 8px rgba(255,123,20,.95),0 2px 5px #410500!important}.player-card.heat-seekers .identity p{color:#ffe2bb!important}.player-card.heat-seekers .frame-outer{border-color:#ffb52d!important;box-shadow:inset 0 0 14px rgba(255,83,10,.55),0 0 13px rgba(255,91,9,.5)!important}.player-card.heat-seekers .edge-glow{box-shadow:inset 0 0 15px rgba(255,170,30,.55),0 0 10px rgba(255,71,5,.36)!important}
.catalogue-set-logo.heat-set-logo{background:radial-gradient(circle at 50% 74%,#ffdb4e 0 7%,#ff6a0b 8% 31%,#b61d08 32% 58%,#3b0705 59% 100%)!important;border-color:#ff9d18!important;box-shadow:0 0 0 3px #4a0a05,0 10px 24px rgba(0,0,0,.55),0 0 24px rgba(255,74,8,.5)!important}.catalogue-set-logo.heat-set-logo strong{font-size:15px!important;color:#fff!important;text-shadow:0 0 6px #ff7a0a}.catalogue-set-logo.heat-set-logo b{font-size:11px!important;color:#ffd65a!important}.catalogue-set-logo.heat-set-logo span{color:#ffbd31!important}
`;document.head.appendChild(style);})();

window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const sync=()=>{const n=document.getElementById('catalogueTeamName'),b=document.querySelector('.catalogue-set-logo');if(!n||!b)return;if(n.textContent==='Heat Seekers'){b.className='catalogue-set-logo heat-set-logo';b.innerHTML='<span>NBA</span><strong>HEAT</strong><b>SEEKERS</b>';}else if(n.textContent==='Thunder & Lightning'){b.className='catalogue-set-logo thunder-set-logo';b.innerHTML='<span>NBA</span><strong>THUNDER</strong><b>& LIGHTNING</b>';}else if(n.textContent==='NBA Tip-Off 27'){b.className='catalogue-set-logo';b.innerHTML='<span>NBA</span><strong>TIP-OFF</strong><b>27</b>';}};const n=document.getElementById('catalogueTeamName');if(n)new MutationObserver(sync).observe(n,{childList:true,subtree:true,characterData:true});sync();},120));

/* Load the position layer after all three sets have been registered. */
(()=>{const s=document.createElement('script');s.src='positions-v0.8.53.js?t='+(window.COURTSIDE_ASSET_TOKEN||Date.now());s.async=false;document.head.appendChild(s);})();
