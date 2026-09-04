/* NBA Courtside v0.8.39 — Tip-Off 27 + Thunder & Lightning historical identity pass */
const artUrlBeforeV088=artUrl;
artUrl=function(p){return `assets/player-art/${p.artSlug}.png?v=0.8.39`;};

const COURTSIDE_2025_26={"derrick-white":[16.5,4.4,5.4,1.1,1.3,2.7,.327],"michael-porter-jr":[24.2,7.1,3,1.1,.3,3.4,.363],"josh-hart":[12,7.4,4.8,1.1,.3,1.5,.413],"vj-edgecombe":[16,5.6,4.2,1.4,.5,2,.354],"jakobe-walter":[7.5,2.6,1.2,1,.2,1.5,.409],"josh-giddey":[17,8.3,9.1,1,.5,1.9,.364],"jarrett-allen":[15.4,8.5,1.8,1,.8,0,.1],"cade-cunningham":[23.9,5.5,9.9,1.4,.8,2,.342],"obi-toppin":[11.6,4.4,2.3,.5,0,1.5,.352],"kyle-kuzma":[13,4.5,2.7,.7,.4,1.2,.347],"jalen-johnson":[22.5,10.3,7.9,1.24,.43,1.67,.352],"kon-knueppel":[18.5,5.3,3.4,.7,.2,3.4,.425],"bam-adebayo":[20.1,10,3.2,1.2,.7,1.7,.318],"jalen-suggs":[13.8,3.9,5.5,1.8,.7,2.1,.339],"bub-carrington":[10.7,3.4,4.6,.6,.2,2.1,.408],"nikola-jokic":[27.7,12.9,10.7,1.4,.8,1.7,.38],"rudy-gobert":[10.9,11.5,1.7,.8,1.6,0,0],"shai-gilgeous-alexander":[31.1,4.3,6.6,1.4,.8,1.7,.386],"scoot-henderson":[14.2,2.7,3.7,.9,.3,1.9,.352],"keyonte-george":[23.6,3.7,6.1,1.1,.3,2.5,.371],"brandin-podziemski":[13.8,5.1,3.7,1.1,.2,1.9,.371],"brook-lopez":[8.5,3.6,1.3,.6,1.2,1.5,.36],"luka-doncic":[33.5,7.7,8.3,1.6,.5,4,.366],"dillon-brooks":[20.2,3.6,1.8,1,.2,2.3,.344],"zach-lavine":[19.2,2.8,2.3,.7,.3,2.5,.39],"cooper-flagg":[21,6.7,4.5,1.2,.9,1,.295],"reed-sheppard":[13.5,2.9,3.4,1.5,.7,2.8,.394],"gg-jackson":[12.5,4.3,1.5,.6,.8,1.2,.332],"jeremiah-fears":[14.3,3.7,3.4,1.2,.4,1.2,.33],"victor-wembanyama":[25,11.5,3.1,1,3.1,1.9,.349]};
const COURTSIDE_DUNK_REPUTATION={"derrick-white":10,"michael-porter-jr":22,"josh-hart":18,"vj-edgecombe":26,"jakobe-walter":17,"josh-giddey":14,"jarrett-allen":27,"cade-cunningham":18,"obi-toppin":30,"kyle-kuzma":20,"jalen-johnson":29,"kon-knueppel":15,"bam-adebayo":25,"jalen-suggs":19,"bub-carrington":13,"nikola-jokic":18,"rudy-gobert":27,"shai-gilgeous-alexander":20,"scoot-henderson":22,"keyonte-george":13,"brandin-podziemski":12,"brook-lopez":14,"luka-doncic":16,"dillon-brooks":15,"zach-lavine":28,"cooper-flagg":28,"reed-sheppard":12,"gg-jackson":25,"jeremiah-fears":18,"victor-wembanyama":29};
const courtsideScale=(v,l)=>Math.max(1,Math.min(30,Math.round(30*v/l)));
const COURTSIDE_3PT_LEADER=4*Math.sqrt(.366/.360);
const courtsideThreeRating=(m,p)=>m<=0?1:Math.max(1,Math.min(30,Math.round(30*(m*Math.sqrt((p||0)/.360))/COURTSIDE_3PT_LEADER)));
players.forEach(p=>{const s=COURTSIDE_2025_26[p.artSlug];if(!s)return;const[pts,reb,ast,stl,blk,tm,tp]=s;p.season='2025–26';p.stats.scoring=courtsideScale(pts,33.5);p.stats.three=courtsideThreeRating(tm,tp);p.stats.rebounding=courtsideScale(reb,12.9);p.stats.passing=courtsideScale(ast,10.7);p.stats.blocks=courtsideScale(blk,3.1);p.stats.steals=courtsideScale(stl,2);if(Number.isFinite(COURTSIDE_DUNK_REPUTATION[p.artSlug]))p.stats.dunks=COURTSIDE_DUNK_REPUTATION[p.artSlug];});

const THUNDER_LIGHTNING=[
['Antoine Walker','Boston Celtics','1610612738','2000–01','antoine-walker',[23.4,8.9,5.5,1.7,.6,2.7,.367],23],
['Kenny Anderson','Brooklyn Nets','1610612751','1993–94','kenny-anderson',[18.8,3.9,9.6,1.9,.2,.8,.315],18],
['Nate Robinson','New York Knicks','1610612752','2008–09','nate-robinson',[17.2,3.9,4.1,1.3,.1,1.7,.325],30],
['Julius Erving','Philadelphia 76ers','1610612755','1980–81','julius-erving',[24.6,8,4.4,2.1,1.8,.1,.222],30],
['Vince Carter','Toronto Raptors','1610612761','2000–01','vince-carter',[27.6,5.5,3.9,1.5,1.1,2.2,.408],30],
['Michael Jordan','Chicago Bulls','1610612741','1988–89','michael-jordan',[32.5,8,8,2.9,.8,.3,.276],30],
['Bob Sura','Cleveland Cavaliers','1610612739','1999–00','bob-sura',[13.8,3.9,3.9,1.2,.3,1.1,.346],24],
['Grant Hill','Detroit Pistons','1610612765','1996–97','grant-hill',[21.4,9,7.3,1.8,.6,.2,.303],29],
['Jamaal Tinsley','Indiana Pacers','1610612754','2004–05','jamaal-tinsley',[15.4,4,6.4,2,.3,1,.372],17],
['T.J. Ford','Milwaukee Bucks','1610612749','2005–06','tj-ford',[12.2,4.3,6.6,1.4,.1,.1,.337],25],
['Doc Rivers','Atlanta Hawks','1610612737','1986–87','doc-rivers',[12.8,3.6,10,2.1,.4,.2,.19],17],
['Kendall Gill','Charlotte Hornets','1610612766','1990–91','kendall-gill',[20.5,5,4.2,1.9,.6,.3,.284],27],
['Harold Miner','Miami Heat','1610612748','1994–95','harold-miner',[10.5,2.6,1.5,.8,.2,.2,.286],30],
["Shaquille O'Neal",'Orlando Magic','1610612753','1994–95','shaquille-oneal',[29.3,11.4,2.7,.9,2.4,0,0],30],
['Caron Butler','Washington Wizards','1610612764','2007–08','caron-butler',[20.3,6.7,4.9,2.2,.3,1.1,.357],25],
['LaPhonso Ellis','Denver Nuggets','1610612743','1996–97','laphonso-ellis',[21.9,7,2.4,.8,.9,1.1,.36],28],
['Isaiah Rider','Minnesota Timberwolves','1610612750','1994–95','jr-rider',[20.4,3.3,3.3,1,.2,1.9,.352],30],
['Serge Ibaka','Oklahoma City Thunder','1610612760','2012–13','serge-ibaka',[13.2,7.7,.5,.4,3,0,.351],27],
['Arvydas Sabonis','Portland Trail Blazers','1610612757','1997–98','arvydas-sabonis',[16,10,3,.9,1.1,.3,.313],21],
['Jeff Hornacek','Utah Jazz','1610612762','1995–96','jeff-hornacek',[15.2,2.5,4.1,1.3,.2,1.7,.466],16],
['Jason Richardson','Golden State Warriors','1610612744','2005–06','jason-richardson',[23.2,5.8,3.1,1.3,.5,2.4,.384],30],
['DeAndre Jordan','LA Clippers','1610612746','2015–16','deandre-jordan',[12.7,13.8,1.2,.7,2.3,0,0],30],
['Lonzo Ball','Los Angeles Lakers','1610612747','2017–18','lonzo-ball',[10.2,6.9,7.2,1.7,.8,1.7,.305],22],
['Dan Majerle','Phoenix Suns','1610612756','1992–93','dan-majerle',[16.9,4.7,3.8,1.7,.4,2.1,.381],25],
["De'Aaron Fox",'Sacramento Kings','1610612758','2023–24','deaaron-fox',[26.6,4.6,5.6,2,.4,2.9,.369],29],
['Jason Kidd','Dallas Mavericks','1610612742','1995–96','jason-kidd',[16.6,6.8,9.7,2.2,.3,1.6,.336],20],
['Kenny Smith','Houston Rockets','1610612745','1990–91','kenny-smith',[17.3,2.1,7.1,1.4,.1,.9,.363],22],
['Shareef Abdur-Rahim','Memphis Grizzlies','1610612763','1999–00','shareef-abdur-rahim',[20.3,10.1,3.3,1.1,1.1,.3,.302],27],
['Zion Williamson','New Orleans Pelicans','1610612740','2020–21','zion-williamson',[27,7.2,3.7,.9,.6,.2,.294],30],
['Tony Parker','San Antonio Spurs','1610612759','2008–09','tony-parker',[22,3.1,6.9,.9,.1,.3,.292],24]
];
const HISTORIC_LOGO={
'antoine-walker':['BOS',2001],'kenny-anderson':['NJN',1994],'nate-robinson':['NYK',2009],'julius-erving':['PHI',1981],'vince-carter':['TOR',2001],'michael-jordan':['CHI',1989],'bob-sura':['CLE',2000],'grant-hill':['DET',1997],'jamaal-tinsley':['IND',2005],'tj-ford':['MIL',2006],'doc-rivers':['ATL',1987],'kendall-gill':['CHH',1991],'harold-miner':['MIA',1995],'shaquille-oneal':['ORL',1995],'caron-butler':['WAS',2008],'laphonso-ellis':['DEN',1997],'jr-rider':['MIN',1995],'serge-ibaka':['OKC',2013],'arvydas-sabonis':['POR',1998],'jeff-hornacek':['UTA',1996],'jason-richardson':['GSW',2006],'deandre-jordan':['LAC',2016],'lonzo-ball':['LAL',2018],'dan-majerle':['PHO',1993],'deaaron-fox':['SAC',2024],'jason-kidd':['DAL',1996],'kenny-smith':['HOU',1991],'shareef-abdur-rahim':['VAN',2000],'zion-williamson':['NOP',2021],'tony-parker':['SAS',2009]};
const THUNDER_ART={
'antoine-walker':[50,100,.74],'kenny-anderson':[50,100,.82],'nate-robinson':[50,101,.73],'julius-erving':[50,100,.72],'vince-carter':[50,100,.80],'michael-jordan':[50,100,.76],'bob-sura':[50,100,.80],'grant-hill':[50,100,.78],'jamaal-tinsley':[50,100,.78],'tj-ford':[50,100,.80],'doc-rivers':[50,100,.76],'kendall-gill':[50,100,.78],'harold-miner':[50,100,.80],'shaquille-oneal':[50,100,.76],'caron-butler':[50,100,.78],'laphonso-ellis':[50,100,.80],'jr-rider':[50,100,.78],'serge-ibaka':[50,100,.77],'arvydas-sabonis':[50,100,.74],'jeff-hornacek':[50,100,.78],'jason-richardson':[50,100,.80],'deandre-jordan':[50,100,.76],'lonzo-ball':[50,100,.73],'dan-majerle':[50,100,.78],'deaaron-fox':[50,100,.74],'jason-kidd':[50,100,.78],'kenny-smith':[50,100,.78],'shareef-abdur-rahim':[50,100,.78],'zion-williamson':[50,100,.74],'tony-parker':[50,100,.77]};
THUNDER_LIGHTNING.forEach((r,i)=>{const[name,team,tid,season,slug,line,dunk]=r,[pts,reb,ast,stl,blk,tm,tp]=line,t=THUNDER_ART[slug]||[50,100,.76];players.push({id:'p'+(30+i),name,team,teamShort:TEAM_SHORT[tid]||team,season,teamId:tid,playerId:'legacy-'+slug,stats:{scoring:courtsideScale(pts,33.5),dunks:dunk,three:courtsideThreeRating(tm,tp),freeThrows:1,rebounding:courtsideScale(reb,12.9),passing:courtsideScale(ast,10.7),blocks:courtsideScale(blk,3.1),steals:courtsideScale(stl,2)},artSlug:slug,art:{x:t[0]+'%',y:t[1]+'%',s:t[2],r:0},theme:{a:'#164b8f',b:'#ffd93d',c:'#07182f'},set:'Thunder & Lightning'});});

const currentLogoUrl=logoUrl;
logoUrl=function(p){if(p?.set==='Thunder & Lightning'&&HISTORIC_LOGO[p.artSlug]){const[a,y]=HISTORIC_LOGO[p.artSlug];return `https://cdn.ssref.net/req/202106291/tlogo/bbr/${a}-${y}.png`;}return currentLogoUrl(p);};

const originalCardMarkupThunder=cardMarkup;
cardMarkup=function(p,o={}){let html=originalCardMarkupThunder(p,o);if(p.set!=='Thunder & Lightning')return html;html=html.replace('player-card ','player-card thunder-lightning ');html=html.replace('<div class="team-mark">','<div class="storm-lightning" aria-hidden="true"><i class="bolt bolt-a"></i><i class="bolt bolt-b"></i><i class="bolt bolt-c"></i><i class="storm-flash flash-a"></i><i class="storm-flash flash-b"></i></div><div class="team-mark">');return html;};

(function installThunderLightningVisuals(){const style=document.createElement('style');style.id='thunder-lightning-set-style-v0839';style.textContent=`
.player-card.thunder-lightning{background:linear-gradient(155deg,#102c55 0%,#07172f 45%,#020811 100%)!important}
.player-card.thunder-lightning .card-backdrop{background:radial-gradient(ellipse at 15% 18%,rgba(78,112,154,.72) 0 8%,transparent 30%),radial-gradient(ellipse at 83% 14%,rgba(34,69,111,.86) 0 13%,transparent 39%),radial-gradient(ellipse at 49% 48%,rgba(9,25,48,.96) 0 31%,transparent 67%),linear-gradient(168deg,#173b6b 0%,#0a1c36 46%,#02070e 100%)!important}
.player-card.thunder-lightning .holo-grid{background:radial-gradient(ellipse at 12% 26%,rgba(200,220,245,.13),transparent 28%),radial-gradient(ellipse at 78% 20%,rgba(119,157,204,.13),transparent 31%),radial-gradient(ellipse at 48% 66%,rgba(36,76,128,.18),transparent 44%)!important;opacity:1!important;mix-blend-mode:screen}
.player-card.thunder-lightning .beam{display:none!important}
.player-card.thunder-lightning .rarity-burst{opacity:.2!important;background:repeating-conic-gradient(from 10deg,rgba(72,149,255,.15) 0 1deg,transparent 1deg 18deg)!important}
.player-card.thunder-lightning .storm-lightning{position:absolute;inset:0;z-index:8;overflow:hidden;pointer-events:none}
.player-card.thunder-lightning .bolt{position:absolute;display:block;width:10%;height:64%;background:linear-gradient(180deg,#fff 0%,#fffac4 16%,#ffe029 49%,#62b2ff 78%,rgba(80,169,255,.1) 100%);clip-path:polygon(48% 0,70% 0,57% 19%,82% 19%,47% 50%,65% 50%,25% 100%,39% 61%,17% 61%,42% 31%,24% 31%);filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 8px #ffe440) drop-shadow(0 0 13px #398cff);opacity:.94;mix-blend-mode:screen}
.player-card.thunder-lightning .bolt-a{left:58%;top:-7%;transform:rotate(9deg) scaleX(.82)}
.player-card.thunder-lightning .bolt-b{left:25%;top:7%;height:50%;width:7%;transform:rotate(-19deg);opacity:.67}
.player-card.thunder-lightning .bolt-c{right:5%;top:29%;height:46%;width:6%;transform:rotate(23deg);opacity:.58}
.player-card.thunder-lightning .storm-flash{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.34),rgba(255,226,66,.12) 28%,transparent 70%);filter:blur(4px)}
.player-card.thunder-lightning .flash-a{width:58%;height:28%;left:33%;top:4%}.player-card.thunder-lightning .flash-b{width:42%;height:23%;left:2%;top:24%;background:radial-gradient(circle,rgba(111,180,255,.3),transparent 68%)}
.player-card.thunder-lightning .foil-field{background:radial-gradient(ellipse at 70% 18%,rgba(255,223,63,.13),transparent 29%),radial-gradient(ellipse at 26% 51%,rgba(62,142,255,.16),transparent 38%)!important;opacity:.75!important}
.player-card.thunder-lightning .edge-glow{box-shadow:inset 0 0 14px rgba(62,147,255,.82),inset 0 0 3px #ffe14d,0 0 14px rgba(255,215,40,.42)!important}
.player-card.thunder-lightning .identity{background:radial-gradient(ellipse at 22% 15%,rgba(84,113,153,.42),transparent 38%),linear-gradient(90deg,#122e51 0%,#0b203d 58%,#07162c 100%)!important;border-top:1px solid rgba(255,224,68,.74)!important;box-shadow:inset 0 6px 16px rgba(62,121,184,.18)!important}
.player-card.thunder-lightning .identity h3{color:#fff!important;text-shadow:0 0 7px rgba(62,151,255,.7),0 2px 5px #000!important}.player-card.thunder-lightning .identity p{color:#d7e7ff!important}.player-card.thunder-lightning .frame-outer{border-color:#ffe04f!important;box-shadow:inset 0 0 14px rgba(63,144,255,.33),0 0 12px rgba(255,218,54,.48)!important}
.player-card.thunder-lightning .team-mark img{filter:drop-shadow(0 2px 5px rgba(0,0,0,.8))}.player-card.thunder-lightning .team-logo{filter:drop-shadow(0 1px 3px rgba(0,0,0,.7))}
`;document.head.appendChild(style);})();

window.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const sync=()=>{const n=document.getElementById('catalogueTeamName'),b=document.querySelector('.catalogue-set-logo');if(!n||!b)return;if(n.textContent==='Thunder & Lightning'){b.classList.add('thunder-set-logo');b.innerHTML='<span>NBA</span><strong>THUNDER</strong><b>& LIGHTNING</b>';}else if(n.textContent==='NBA Tip-Off 27'){b.classList.remove('thunder-set-logo');b.innerHTML='<span>NBA</span><strong>TIP-OFF</strong><b>27</b>';}};const s=document.createElement('style');s.textContent='.catalogue-set-logo.thunder-set-logo{background:radial-gradient(circle at 35% 25%,#fff 0 3%,#ffe853 4% 20%,#164b8f 21% 58%,#07182f 59% 100%)!important;border-color:#ffe24f!important;box-shadow:0 0 0 3px #0a2142,0 10px 24px rgba(0,0,0,.55),0 0 22px rgba(73,154,255,.35)!important}.catalogue-set-logo.thunder-set-logo strong{font-size:14px!important;color:#fff}.catalogue-set-logo.thunder-set-logo b{font-size:10px!important;color:#ffe24f!important}';document.head.appendChild(s);const n=document.getElementById('catalogueTeamName');if(n)new MutationObserver(sync).observe(n,{childList:true,subtree:true,characterData:true});sync();const v=document.querySelector('.brand-version');if(v){v.textContent='v0.8.39';v.dataset.buildVersion='0.8.39';}},80));

const COURTSIDE_STAT_KEYS_7=['scoring','dunks','three','rebounding','passing','blocks','steals'];
beginQuarter=function(){state.category=COURTSIDE_STAT_KEYS_7[Math.floor(Math.random()*COURTSIDE_STAT_KEYS_7.length)];$('#quarterLabel').textContent=state.overtime?'OT':'Q'+state.quarter;$('#categoryLabel').textContent=STAT_LABELS[state.category].toUpperCase();$('#userScore').textContent=state.userScore;$('#cpuScore').textContent=state.cpuScore;$('#instruction').textContent=state.overtime?'Overtime — your final player is in':('Choose one unused player for '+STAT_LABELS[state.category]);$('#revealPanel').classList.add('hidden');renderLineup();if(state.overtime){const uP=userTeam.find(p=>!state.usedUser.has(p.id));if(uP)setTimeout(()=>playQuarter(uP.id),350);}};
(function(){const style=document.createElement('style');style.id='courtside-seven-stat-layout';style.textContent='.player-card .stats .stat:nth-child(4){display:none!important}.player-card .stats{display:grid!important;grid-template-rows:repeat(7,minmax(0,1fr))!important;align-items:center!important;justify-content:stretch!important;gap:0!important}.player-card .stats .stat{min-height:0!important;align-self:center!important}';document.head.appendChild(style);})();
if(typeof renderStarterFive==='function')renderStarterFive();
