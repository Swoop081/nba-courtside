/* NBA Starting5 — initial 30-player Season free-agent pool
   Ratings order: scoring, dunks, three, rebounding, passing, blocks, steals.
   Ratings are role/production based against the existing Foundation scale: ordinary bench players
   sit mainly in the low/mid teens, strong reserves can reach the high teens/low 20s, and only
   genuine elite specialists receive mid/high-20 category ratings. One primary position only. */
(()=>{
  const KEYS=['scoring','dunks','three','rebounding','passing','blocks','steals'];
  const RAW=[
    ['Atlanta Hawks','Luguentz Dort','SF',[14,15,19,12,9,5,20]],
    ['Boston Celtics','Mitchell Robinson','C',[10,23,1,26,4,22,8]],
    ['Brooklyn Nets','Noah Clowney','PF',[13,18,16,18,7,17,8]],
    ['Charlotte Hornets','Grayson Allen','SG',[17,5,24,7,12,2,8]],
    ['Chicago Bulls','Rob Dillingham','PG',[16,9,19,5,17,1,7]],
    ['Cleveland Cavaliers','Jaylon Tyson','SF',[15,16,15,14,11,5,10]],
    ['Dallas Mavericks','Dereck Lively II','C',[12,24,1,22,7,22,7]],
    ['Denver Nuggets','Cameron Johnson','SF',[18,11,23,11,11,4,9]],
    ['Detroit Pistons','Ron Holland II','SF',[14,22,10,15,9,8,14]],
    ['Golden State Warriors','Yaxel Lendeborg','PF',[13,19,11,17,10,15,12]],
    ['Houston Rockets','Reed Sheppard','SG',[18,7,23,7,16,4,16]],
    ['Indiana Pacers','Obi Toppin','PF',[16,24,18,14,8,7,6]],
    ['LA Clippers','Kris Dunn','PG',[10,10,13,11,16,5,24]],
    ['Los Angeles Lakers','Collin Sexton','PG',[20,17,18,6,17,2,9]],
    ['Memphis Grizzlies','D’Angelo Russell','PG',[17,4,21,6,21,1,8]],
    ['Miami Heat','Tim Hardaway Jr.','SG',[17,8,23,6,9,2,6]],
    ['Milwaukee Bucks','Kel’el Ware','C',[14,23,7,22,6,22,6]],
    ['Minnesota Timberwolves','Ayo Dosunmu','SG',[16,18,17,9,14,4,14]],
    ['New Orleans Pelicans','Bennedict Mathurin','SF',[20,22,16,11,10,3,7]],
    ['New York Knicks','Andre Drummond','C',[10,19,1,26,5,16,8]],
    ['Oklahoma City Thunder','Alex Caruso','SG',[11,9,18,9,15,6,26]],
    ['Orlando Magic','Nikola Vučević','C',[19,9,19,23,14,9,6]],
    ['Philadelphia 76ers','Anfernee Simons','SG',[20,14,23,6,19,1,6]],
    ['Phoenix Suns','Khaman Maluach','C',[11,21,2,19,5,19,5]],
    ['Portland Trail Blazers','Jrue Holiday','PG',[16,12,19,10,20,6,21]],
    ['Sacramento Kings','Malik Monk','SG',[20,20,23,7,19,2,8]],
    ['San Antonio Spurs','Devin Vassell','SF',[19,18,22,9,14,6,11]],
    ['Toronto Raptors','Jakob Poeltl','C',[14,20,1,23,12,20,7]],
    ['Utah Jazz','Isaiah Collier','PG',[14,18,9,9,20,2,11]],
    ['Washington Wizards','Deandre Ayton','C',[17,22,2,24,7,16,5]]
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
