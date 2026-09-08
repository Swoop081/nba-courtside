/* NBA Courtside v0.9.0 — 150-card Foundation + single-rating card front + inspect/flip */
(()=>{
const FOUNDATION_KEYS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
const FOUNDATION_LABELS={scoring:'Scoring',dunks:'Dunking',three:'3PT',rebounding:'Rebounding',passing:'Passing',blocks:'Blocks',steals:'Steals'};
const FD=[
['Atlanta Hawks','1610612737',[
['CJ McCollum','PG',[24,10,26,8,23,2,11]],['Nickeil Alexander-Walker','SG',[18,15,22,10,15,5,20]],['Dyson Daniels','SF',[18,22,16,22,24,10,30]],['Jalen Johnson','PF',[25,29,20,27,24,18,18]],['Onyeka Okongwu','C',[20,28,10,26,12,24,13]]]],
['Boston Celtics','1610612738',[
['Payton Pritchard','PG',[22,8,27,9,20,2,12]],['Derrick White','SG',[23,12,26,11,21,18,24]],['Paul George','SF',[24,21,25,18,20,14,23]],['Jayson Tatum','PF',[29,26,27,25,22,15,18]],['Neemias Queta','C',[15,27,3,25,6,23,8]]]],
['Brooklyn Nets','1610612751',[
['Egor Demin','PG',[18,16,19,13,25,6,14]],['Terance Mann','SG',[17,18,20,14,14,7,16]],['Michael Porter Jr.','SF',[26,24,28,23,12,8,10]],['Julius Randle','PF',[25,25,20,27,21,8,11]],['Day\'Ron Sharpe','C',[17,27,4,28,8,19,10]]]],
['Charlotte Hornets','1610612766',[
['Coby White','PG',[24,13,26,10,21,2,10]],['Brandon Miller','SG',[24,23,26,15,16,8,15]],['Kon Knueppel','SF',[21,15,27,15,17,5,12]],['Naz Reid','PF',[22,24,25,21,13,15,10]],['Moussa Diabaté','C',[14,27,2,27,7,22,12]]]],
['Chicago Bulls','1610612741',[
['Josh Giddey','PG',[23,16,18,24,27,7,13]],['Norman Powell','SG',[25,18,27,11,14,4,13]],['Matas Buzelis','SF',[20,27,18,18,13,16,10]],['Caleb Wilson','PF',[18,28,14,22,11,18,9]],['Nic Claxton','C',[17,28,2,26,10,27,13]]]],
['Cleveland Cavaliers','1610612739',[
['James Harden','PG',[27,10,28,16,29,3,12]],['Donovan Mitchell','SG',[28,26,27,12,23,4,18]],['Peyton Watson','SF',[17,26,17,17,9,24,16]],['Evan Mobley','PF',[23,27,17,28,19,29,15]],['Jarrett Allen','C',[20,28,2,27,9,26,12]]]],
['Dallas Mavericks','1610612742',[
['Kyrie Irving','PG',[28,16,29,9,24,2,15]],['Max Christie','SG',[18,17,23,12,12,7,14]],['Cooper Flagg','SF',[25,29,20,24,20,24,20]],['P.J. Washington','PF',[21,24,23,22,14,19,14]],['Daniel Gafford','C',[19,30,1,25,7,28,11]]]],
['Denver Nuggets','1610612743',[
['Jamal Murray','PG',[26,15,27,10,24,3,11]],['Christian Braun','SG',[20,27,21,16,14,8,17]],['Cameron Johnson','SF',[21,17,27,16,14,7,13]],['Aaron Gordon','PF',[21,29,17,22,16,16,12]],['Nikola Jokić','C',[29,19,25,30,30,13,17]]]],
['Detroit Pistons','1610612765',[
['Cade Cunningham','PG',[27,19,24,17,28,5,15]],['Duncan Robinson','SG',[19,5,29,7,11,2,8]],['Ausar Thompson','SF',[19,30,10,24,17,20,25]],['John Collins','PF',[22,28,20,24,11,17,10]],['Jalen Duren','C',[20,29,1,29,9,22,11]]]],
['Golden State Warriors','1610612744',[
['Stephen Curry','PG',[30,10,30,9,27,1,16]],['Brandin Podziemski','SG',[20,13,23,18,18,4,14]],['Jimmy Butler','SF',[25,22,16,22,22,9,24]],['Draymond Green','PF',[14,14,15,24,26,22,23]],['Kristaps Porziņģis','C',[23,24,26,24,12,28,9]]]],
['Houston Rockets','1610612745',[
['Fred VanVleet','PG',[21,5,25,8,26,2,21]],['Amen Thompson','SG',[22,30,10,26,22,21,27]],['Kevin Durant','SF',[29,23,29,21,21,15,13]],['Jabari Smith Jr.','PF',[20,24,24,23,10,19,12]],['Alperen Şengün','C',[25,23,12,28,25,14,13]]]],
['Indiana Pacers','1610612754',[
['Tyrese Haliburton','PG',[25,11,27,11,30,3,17]],['Andrew Nembhard','SG',[20,12,23,10,22,4,15]],['Aaron Nesmith','SF',[19,22,25,16,12,8,17]],['Pascal Siakam','PF',[26,25,18,24,19,12,15]],['Ivica Zubac','C',[20,27,2,29,8,24,10]]]],
['LA Clippers','1610612746',[
['Darius Garland','PG',[25,9,27,8,26,2,12]],['Keaton Wagler','SG',[17,16,20,10,16,5,13]],['Brandon Ingram','SF',[25,19,24,19,21,9,10]],['Rui Hachimura','PF',[20,24,22,18,10,8,8]],['Brook Lopez','C',[18,12,24,17,7,27,8]]]],
['Los Angeles Lakers','1610612747',[
['Luka Dončić','PG',[30,18,28,23,29,2,14]],['Austin Reaves','SG',[23,14,26,12,22,3,11]],['Ziaire Williams','SF',[17,23,20,15,10,8,13]],['Jarred Vanderbilt','PF',[12,22,8,24,12,15,22]],['Walker Kessler','C',[17,28,2,30,6,30,8]]]],
['Memphis Grizzlies','1610612763',[
['Jaylen Wells','PG',[18,16,23,13,16,5,15]],['Cedric Coward','SG',[18,24,20,15,13,8,14]],['Jerami Grant','SF',[23,25,22,17,13,18,10]],['Cameron Boozer','PF',[21,27,16,25,16,18,11]],['Zach Edey','C',[18,28,1,30,7,29,7]]]],
['Miami Heat','1610612748',[
['Davion Mitchell','PG',[17,7,20,7,22,3,26]],['Klay Thompson','SG',[22,8,29,9,12,5,10]],['Andrew Wiggins','SF',[22,26,22,18,12,17,15]],['Giannis Antetokounmpo','PF',[30,30,11,29,25,27,18]],['Bam Adebayo','C',[24,26,17,28,20,25,17]]]],
['Milwaukee Bucks','1610612749',[
['Ryan Rollins','PG',[18,11,22,8,20,3,18]],['Tyler Herro','SG',[26,12,28,12,21,3,9]],['Jaime Jaquez Jr.','SF',[19,21,17,18,15,7,14]],['Kyle Kuzma','PF',[21,23,20,21,15,11,10]],['Myles Turner','C',[21,20,26,23,8,29,10]]]],
['Minnesota Timberwolves','1610612750',[
['LaMelo Ball','PG',[25,15,27,19,29,2,18]],['Anthony Edwards','SG',[30,30,27,18,23,10,20]],['Jaden McDaniels','SF',[18,22,21,16,10,21,23]],['Jonathan Kuminga','PF',[22,29,16,20,12,12,11]],['Rudy Gobert','C',[16,28,1,30,6,30,10]]]],
['New Orleans Pelicans','1610612740',[
['Dejounte Murray','PG',[23,18,21,20,26,5,23]],['Jeremiah Fears','SG',[19,20,18,12,21,3,17]],['Trey Murphy III','SF',[24,27,28,19,13,10,14]],['Zion Williamson','PF',[28,30,8,25,20,11,11]],['Derik Queen','C',[20,22,12,25,14,18,8]]]],
['New York Knicks','1610612752',[
['Jalen Brunson','PG',[29,8,28,8,26,1,10]],['Mikal Bridges','SG',[23,21,26,15,15,11,22]],['Josh Hart','SF',[19,20,17,26,22,7,18]],['OG Anunoby','PF',[22,24,25,19,11,18,28]],['Karl-Anthony Towns','C',[27,24,28,27,17,15,8]]]],
['Oklahoma City Thunder','1610612760',[
['Shai Gilgeous-Alexander','PG',[30,22,25,14,26,8,25]],['Cason Wallace','SG',[18,13,23,10,15,6,27]],['Jalen Williams','SF',[26,25,24,18,22,12,21]],['Chet Holmgren','PF',[24,27,26,27,14,30,13]],['Isaiah Hartenstein','C',[18,21,3,28,16,21,12]]]],
['Orlando Magic','1610612753',[
['Jalen Suggs','PG',[21,20,22,13,20,9,28]],['Desmond Bane','SG',[24,15,28,14,18,5,14]],['Franz Wagner','SF',[26,25,20,19,21,8,14]],['Paolo Banchero','PF',[28,28,20,25,22,11,13]],['Wendell Carter Jr.','C',[19,22,19,25,10,19,9]]]],
['Philadelphia 76ers','1610612755',[
['Tyrese Maxey','PG',[28,17,28,9,24,2,13]],['VJ Edgecombe','SG',[22,28,20,17,16,13,20]],['Jaylen Brown','SF',[27,29,23,20,15,12,20]],['LeBron James','PF',[28,26,22,24,28,13,18]],['Joel Embiid','C',[29,24,24,28,19,27,10]]]],
['Phoenix Suns','1610612756',[
['Devin Booker','PG',[29,18,28,13,26,3,12]],['Jalen Green','SG',[26,29,24,12,17,7,12]],['Dillon Brooks','SF',[21,17,24,12,9,8,23]],['Miles Bridges','PF',[23,28,24,22,14,12,10]],['Mark Williams','C',[19,29,1,28,7,27,9]]]],
['Portland Trail Blazers','1610612757',[
['Ja Morant','PG',[28,30,20,11,27,5,17]],['Damian Lillard','SG',[28,13,30,10,26,1,10]],['Toumani Camara','SF',[18,23,20,20,11,17,25]],['Deni Avdija','PF',[23,22,20,24,21,8,14]],['Donovan Clingan','C',[16,27,2,29,7,28,8]]]],
['Sacramento Kings','1610612758',[
['Darius Acuff Jr.','PG',[19,17,21,8,23,2,12]],['Zach LaVine','SG',[25,29,27,11,16,4,10]],['Keegan Murray','SF',[21,21,26,18,10,10,15]],['De\'Andre Hunter','PF',[21,22,24,18,11,8,12]],['Domantas Sabonis','C',[25,21,16,30,27,10,13]]]],
['San Antonio Spurs','1610612759',[
['De\'Aaron Fox','PG',[27,28,22,11,25,3,23]],['Dylan Harper','SG',[24,25,21,18,23,8,17]],['Stephon Castle','SF',[24,28,19,22,23,15,24]],['Tobias Harris','PF',[20,19,23,19,12,9,9]],['Victor Wembanyama','C',[30,30,27,30,22,30,18]]]],
['Toronto Raptors','1610612761',[
['Immanuel Quickley','PG',[24,10,27,10,25,2,13]],['RJ Barrett','SG',[24,25,19,19,16,6,12]],['Kawhi Leonard','SF',[28,24,27,20,18,17,29]],['Scottie Barnes','PF',[24,25,19,26,25,21,21]],['Collin Murray-Boyles','C',[18,25,10,25,13,20,15]]]],
['Utah Jazz','1610612762',[
['Keyonte George','PG',[24,12,26,9,24,2,11]],['Darryn Peterson','SG',[23,25,23,14,20,8,16]],['Ace Bailey','SF',[22,28,22,19,13,17,14]],['Lauri Markkanen','PF',[26,26,28,24,12,11,8]],['Jaren Jackson Jr.','C',[24,24,25,22,9,30,12]]]],
['Washington Wizards','1610612764',[
['Trae Young','PG',[29,6,29,7,30,1,8]],['Tre Johnson','SG',[21,18,25,10,15,4,10]],['AJ Dybantsa','SF',[24,29,21,22,18,17,18]],['Anthony Davis','PF',[28,28,18,30,17,30,16]],['Alex Sarr','C',[21,25,20,25,10,29,11]]]]
];
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const shortName=n=>n.replace('Los Angeles ','').replace('Golden State ','').replace('Oklahoma City ','').replace('New Orleans ','').replace('Portland ','').replace('Philadelphia ','').replace('Minnesota ','').replace('Washington ','').replace('Cleveland ','').replace('Charlotte ','').replace('Milwaukee ','').replace('Sacramento ','').replace('San Antonio ','').replace('Toronto ','').replace('Atlanta ','').replace('Boston ','').replace('Brooklyn ','').replace('Chicago ','').replace('Dallas ','').replace('Denver ','').replace('Detroit ','').replace('Houston ','').replace('Indiana ','').replace('Memphis ','').replace('Miami ','').replace('New York ','').replace('Orlando ','').replace('Phoenix ','').replace('Utah ','').replace('LA ','');
const foundation=[];let ix=0;
FD.forEach(([team,tid,rows])=>rows.forEach(([name,position,r])=>{const t=TEAM_DATA[tid]||['Team','#445','#ddd','#111'];const stats={scoring:r[0],dunks:r[1],three:r[2],rebounding:r[3],passing:r[4],blocks:r[5],steals:r[6],freeThrows:1};foundation.push({id:'f'+(++ix),name,team,teamShort:TEAM_SHORT[tid]||shortName(team),season:'2026–27',teamId:tid,playerId:'foundation-'+slug(name),stats,position,artSlug:slug(name),art:{x:'50%',y:'100%',s:.78,r:0},theme:{a:t[1],b:t[2],c:t[3]},set:'2026–27 Foundation'});}));
players.splice(0,players.length,...foundation);
window.COURTSIDE_FOUNDATION_PLAYERS=foundation;
window.courtsideOverall=function(p){const vals=FOUNDATION_KEYS.map(k=>p.stats[k]),m=Math.min(...vals),copy=[...vals],i=copy.indexOf(m);copy.splice(i,1);return Math.ceil(copy.reduce((a,b)=>a+b,0)/copy.length);};
dealTeams=function(){const byPos={PG:[],SG:[],SF:[],PF:[],C:[]};players.forEach(p=>byPos[p.position].push(p));const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};const used=new Set(),build=()=>['PG','SG','SF','PF','C'].map(pos=>{const pick=shuffle(byPos[pos].filter(p=>!used.has(p.id)))[0];used.add(pick.id);return pick;});userTeam=build();cpuTeam=build();};
artUrl=function(p){const c=typeof artConfig==='function'?artConfig(p):{url:''};return c.url||`assets/player-art/${p.artSlug}.png?v=0.9.0`;};
})();
