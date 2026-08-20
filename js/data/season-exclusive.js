// Season-exclusive Superstar registry. These rewards live outside normal set boosters.
// Season 1's final boss is The Rock; Season 2's prestige chase reward is WCW-streak Goldberg.
// Each full 60-card package is reserved for its Season completion flow and future post-season Store availability.
export const seasonExclusiveSuperstars = {
  "the-rock": {
    id: "the-rock",
    name: "The Rock",
    nickname: "The Final Boss",
    seasonId: "season-1",
    unlock: "tier-100-completion",
    postSeasonAvailability: "store-in-game-currency",
    boosterEligible: false,
    fullDeckReward: true
  },
  "goldberg": {
    id: "goldberg",
    name: "Goldberg",
    nickname: "Who’s Next?",
    persona: "WCW undefeated-streak era",
    seasonId: "season-2",
    unlock: "tier-100-completion",
    postSeasonAvailability: "store-in-game-currency",
    boosterEligible: false,
    fullDeckReward: true
  }
};
