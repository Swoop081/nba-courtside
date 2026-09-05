/* NBA Courtside v0.9.11 — Detroit foundation position correction */
(()=>{
  const duncan=players.find(p=>p.name==='Duncan Robinson'&&p.teamId==='1610612765');
  const ausar=players.find(p=>p.name==='Ausar Thompson'&&p.teamId==='1610612765');
  if(duncan)duncan.position='SF';
  if(ausar)ausar.position='SG';
})();
