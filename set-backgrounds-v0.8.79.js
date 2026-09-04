/* NBA Courtside v0.8.79 — supplied set background artwork */
(()=>{
  if(document.getElementById('courtside-set-backgrounds-v0879'))return;
  const style=document.createElement('style');
  style.id='courtside-set-backgrounds-v0879';
  style.textContent=`
    /* Thunder & Lightning — supplied blue lightning background */
    .player-card.thunder-lightning .card-backdrop{
      background-image:
        linear-gradient(90deg,rgba(3,8,20,.48) 0%,rgba(3,8,20,.15) 35%,rgba(3,8,20,.08) 64%,rgba(3,8,20,.28) 100%),
        linear-gradient(0deg,rgba(2,6,15,.55) 0%,transparent 38%),
        url('assets/player-art/thunder-&-lightning.JPG')!important;
      background-size:cover!important;
      background-position:center center!important;
      background-repeat:no-repeat!important;
    }
    .player-card.thunder-lightning .holo-grid,
    .player-card.thunder-lightning .rarity-burst{opacity:.10!important}
    .player-card.thunder-lightning .storm-lightning{opacity:.20!important}
    .player-card.thunder-lightning .foil-field{opacity:.24!important}

    /* Heat Seekers — supplied fire/blue-flame background */
    .player-card.heat-seekers .card-backdrop{
      background-image:
        linear-gradient(90deg,rgba(18,3,2,.42) 0%,rgba(8,4,8,.10) 43%,rgba(1,8,15,.18) 72%,rgba(1,4,9,.30) 100%),
        linear-gradient(0deg,rgba(10,2,2,.56) 0%,transparent 40%),
        url('assets/player-art/heat-seekers.JPG')!important;
      background-size:cover!important;
      background-position:center center!important;
      background-repeat:no-repeat!important;
    }
    .player-card.heat-seekers .holo-grid,
    .player-card.heat-seekers .rarity-burst{opacity:.08!important}
    .player-card.heat-seekers .heat-fire{opacity:.16!important}
    .player-card.heat-seekers .foil-field{opacity:.22!important}
  `;
  document.head.appendChild(style);
})();
