/* NBA Starting5 — initial 30-player Season free-agent pool
   Ratings order: scoring, dunks, three, rebounding, passing, blocks, steals.
   Veterans are calibrated to 2025-26 production and the existing Foundation 0-30 scale.
   Unproven players use conservative projections. One primary position only. */
(()=>{
  const KEYS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const RAW=[
    ['Atlanta Hawks','Luguentz Dort','SF',[15,18,22,16,10,8,22]],
    ['Boston Celtics','Mitchell Robinson','C',[13,29,1,30,5,27,14]],
    ['Brooklyn Nets','Noah Clowney','PF',[17,23,20,23,9,22,11]],
    ['Charlotte Hornets','Grayson Allen','SG',[20,8,28,10,16,3,11]],
    ['Chicago Bulls','Rob Dillingham','PG',[20,13,23,7,20,2,10]],
    ['Cleveland Cavaliers','Jaylon Tyson','SF',[19,20,19,18,14,7,13]],
    ['Dallas Mavericks','Dereck Lively II','C',[16,29,1,27,9,27,10]],
    ['Denver Nuggets','Cameron Johnson','SF',[22,15,27,15,14,6,12]],
    ['Detroit Pistons','Ron Holland II','SF',[18,27,14,19,12,12,18]],
    ['Golden State Warriors','Yaxel Lendeborg','PF',[17,25,15,23,14,20,16]],
    ['Houston Rockets','Reed Sheppard','SG',[22,10,28,10,20,6,20]],
    ['Indiana Pacers','Obi Toppin','PF',[20,29,22,19,11,10,9]],
    ['LA Clippers','Kris Dunn','PG',[14,14,17,15,20,8,28]],
    ['Los Angeles Lakers','Collin Sexton','PG',[24,21,22,9,21,3,12]],
    ['Memphis Grizzlies','D’Angelo Russell','PG',[21,7,25,8,25,2,11]],
    ['Miami Heat','Tim Hardaway Jr.','SG',[21,12,27,9,12,3,9]],
    ['Milwaukee Bucks','Kel’el Ware','C',[18,28,10,27,8,27,9]],
    ['Minnesota Timberwolves','Ayo Dosunmu','SG',[20,23,21,12,18,7,18]],
    ['New Orleans Pelicans','Bennedict Mathurin','SG',[24,27,20,15,14,5,10]],
    ['New York Knicks','Andre Drummond','C',[14,24,1,30,7,20,12]],
    ['Oklahoma City Thunder','Alex Caruso','SG',[15,13,22,13,19,10,30]],
    ['Orlando Magic','Nikola Vučević','C',[23,13,23,27,18,13,9]],
    ['Philadelphia 76ers','Anfernee Simons','SG',[24,18,28,9,23,2,9]],
    ['Phoenix Suns','Khaman Maluach','C',[15,28,3,25,7,25,8]],
    ['Portland Trail Blazers','Jrue Holiday','PG',[20,16,23,14,24,10,25]],
    ['Sacramento Kings','Malik Monk','SG',[24,25,27,10,23,3,11]],
    ['San Antonio Spurs','Devin Vassell','SG',[23,22,26,13,18,9,15]],
    ['Toronto Raptors','Jakob Poeltl','C',[18,25,1,28,16,25,10]],
    ['Utah Jazz','Isaiah Collier','PG',[18,23,12,13,24,4,15]],
    ['Washington Wizards','Deandre Ayton','C',[21,27,3,29,10,20,8]]
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
