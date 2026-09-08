/* NBA Starting5 — initial 30-player Season free-agent pool
   Ratings order: scoring, dunks, three, rebounding, passing, blocks, steals.
   Ratings are role/production based against the existing Foundation scale: ordinary bench players
   sit mainly in the low/mid teens, strong reserves can reach the high teens/low 20s, and only
   genuine elite specialists receive mid/high-20 category ratings. One primary position only. */
(()=>{
  const KEYS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const RAW=[
    ['Atlanta Hawks','Luguentz Dort','SF',[11,15,23,20,14,22,22]],
    ['Boston Celtics','Mitchell Robinson','C',[10,23,11,30,12,28,27]],
    ['Brooklyn Nets','Noah Clowney','PF',[19,18,24,21,17,25,20]],
    ['Charlotte Hornets','Grayson Allen','SG',[23,5,29,16,23,19,27]],
    ['Chicago Bulls','Rob Dillingham','PG',[18,9,20,20,24,17,28]],
    ['Cleveland Cavaliers','Jaylon Tyson','SF',[19,16,23,23,20,21,20]],
    ['Dallas Mavericks','Dereck Lively II','C',[16,24,11,27,21,29,20]],
    ['Denver Nuggets','Cameron Johnson','SF',[18,11,23,18,19,21,19]],
    ['Detroit Pistons','Ron Holland II','SF',[18,22,18,22,18,21,25]],
    ['Golden State Warriors','Yaxel Lendeborg','PF',[22,19,20,24,20,24,22]],
    ['Houston Rockets','Reed Sheppard','SG',[20,7,28,8,23,25,29]],
    ['Indiana Pacers','Obi Toppin','PF',[23,24,25,24,21,21,21]],
    ['LA Clippers','Kris Dunn','PG',[8,10,19,18,23,17,28]],
    ['Los Angeles Lakers','Collin Sexton','PG',[24,17,23,15,23,17,28]],
    ['Memphis Grizzlies','D’Angelo Russell','PG',[21,4,23,17,27,19,21]],
    ['Miami Heat','Tim Hardaway Jr.','SG',[21,8,28,15,15,16,15]],
    ['Milwaukee Bucks','Kel’el Ware','C',[20,23,21,29,8,27,23]],
    ['Minnesota Timberwolves','Ayo Dosunmu','SG',[21,18,23,19,23,19,21]],
    ['New Orleans Pelicans','Bennedict Mathurin','SF',[23,22,20,22,19,18,20]],
    ['New York Knicks','Andre Drummond','C',[12,19,18,30,18,26,21]],
    ['Oklahoma City Thunder','Alex Caruso','SG',[15,9,22,21,21,23,29]],
    ['Orlando Magic','Nikola Vučević','C',[21,9,21,26,22,24,16]],
    ['Philadelphia 76ers','Anfernee Simons','SG',[23,14,29,15,20,16,15]],
    ['Phoenix Suns','Khaman Maluach','C',[17,21,17,27,16,27,15]],
    ['Portland Trail Blazers','Jrue Holiday','PG',[21,12,26,21,27,14,23]],
    ['Sacramento Kings','Malik Monk','SG',[23,20,27,10,23,23,20]],
    ['San Antonio Spurs','Devin Vassell','SF',[19,18,25,20,19,21,20]],
    ['Toronto Raptors','Jakob Poeltl','C',[18,20,11,26,19,25,23]],
    ['Utah Jazz','Isaiah Collier','PG',[19,18,18,15,29,21,27]],
    ['Washington Wizards','Deandre Ayton','C',[19,22,11,26,5,26,14]]
  ];
  const pool=RAW.map(([team,name,position,ratings],index)=>({
    id:`season-fa-${String(index+1).padStart(2,'0')}`,
    sourceTeam:team,name,position,ratings,
    stats:Object.fromEntries(KEYS.map((k,i)=>[k,ratings[i]])),
    freeAgent:true
  }));
  window.NBA_STARTING5_SEASON_FREE_AGENTS=pool;
  window.nbaStarting5SeasonFreeAgents=pool;
})();
