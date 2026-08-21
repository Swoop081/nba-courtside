window.NBA_COURTSIDE_CONTRACT_MARKET_39 = {
  version: 39,
  simulation_boundary: "Agent identities, priorities, negotiation behavior, preferences, counters and generated comments are NBA Courtside gameplay simulation, not factual representations or real quotes.",
  agencies: [
    {name:"Apex Basketball Group", short:"APEX", archetype:"MONEY FIRST"},
    {name:"Northstar Athlete Management", short:"NORTHSTAR", archetype:"SECURITY FIRST"},
    {name:"Summit Sports Collective", short:"SUMMIT", archetype:"WINNING FIRST"},
    {name:"Crown Court Management", short:"CROWN", archetype:"ROLE FIRST"},
    {name:"Baseline Partners", short:"BASELINE", archetype:"FLEXIBLE"},
    {name:"Prime Arc Sports", short:"PRIME ARC", archetype:"MARKET MAKER"}
  ],
  agents: [
    "Marcus Vale","Tessa Grant","Jordan Price","Nina Cole","Andre Mercer","Sofia Bennett",
    "Caleb Monroe","Maya Ellis","Darius Lane","Avery Brooks","Miles Warren","Naomi Hart"
  ],
  archetypes: {
    "MONEY FIRST": {money:0.12, stability:0.02, winning:-0.02, role:0.00},
    "SECURITY FIRST": {money:0.03, stability:0.13, winning:0.00, role:0.01},
    "WINNING FIRST": {money:-0.01, stability:0.01, winning:0.13, role:0.02},
    "ROLE FIRST": {money:0.00, stability:0.01, winning:0.01, role:0.13},
    "FLEXIBLE": {money:0.03, stability:0.03, winning:0.03, role:0.03},
    "MARKET MAKER": {money:0.08, stability:0.05, winning:0.02, role:0.03}
  }
};
