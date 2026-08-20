export const sets = {
  "new-generation-series-1": {
    id: "new-generation-series-1", name: "New Generation", series: 1, type: "era-subset",
    displayName: "New Generation — Series 1", shortCode: "NG1", lifecycleDefault: "future",
    developmentOnly: true, eraWindow: "1993-1995",
    plannedSuperstarIds: ["bret-hart", "shawn-michaels", "diesel", "razor-ramon"],
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "season-2-whos-next": {
    id: "season-2-whos-next", name: "Season 2", series: 2, type: "season-exclusive",
    displayName: "Season 2 — Who’s Next?", shortCode: "S2WN", lifecycleDefault: "exclusive",
    developmentOnly: true, season: 2,
    lifecycleLabels: { exclusive: "Season Exclusive" }
  },
  "survivor-series-series-1": {
    id: "survivor-series-series-1", name: "Survivor Series", series: 1, type: "season-2-launch",
    displayName: "Survivor Series — Series 1", shortCode: "SVS1", lifecycleDefault: "future",
    releaseDate: "2026-11-28", developmentOnly: true, season: 2,
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "smackdown-series-1": {
    id: "smackdown-series-1", name: "SmackDown", series: 1, type: "brand-subset",
    displayName: "SmackDown — Series 1", shortCode: "SD1", lifecycleDefault: "future",
    releaseDate: "2026-10-31", developmentOnly: true,
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "money-in-the-bank-series-1": {
    id: "money-in-the-bank-series-1", name: "Money in the Bank", series: 1, type: "event-subset",
    displayName: "Money in the Bank — Series 1", shortCode: "MITB1", lifecycleDefault: "future",
    releaseDate: "2026-10-10", developmentOnly: true,
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "worlds-collide-series-1": {
    id: "worlds-collide-series-1", name: "Worlds Collide", series: 1, type: "event-subset",
    displayName: "Worlds Collide — Series 1", shortCode: "WC1", lifecycleDefault: "future",
    releaseDate: "2026-09-26", developmentOnly: true,
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "raw-series-1": {
    id: "raw-series-1", name: "Raw", series: 1, type: "brand-subset",
    displayName: "Raw — Series 1", shortCode: "RAW1", lifecycleDefault: "future",
    releaseDate: "2026-09-05", developmentOnly: true,
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "season-1-final-boss": { id: "season-1-final-boss", name: "Season 1", series: 1, type: "season-exclusive", displayName: "Season 1 — Final Boss", shortCode: "S1FB", lifecycleDefault: "exclusive", lifecycleLabels: { exclusive: "Season Exclusive" } },
  "summerslam-series-1": {
    id: "summerslam-series-1", name: "SummerSlam", series: 1, type: "ple", eventYear: 2026,
    displayName: "SummerSlam — Series 1", shortCode: "SS1", lifecycleDefault: "featured",
    lifecycleLabels: { featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "hall-of-fame-series-1": {
    id: "hall-of-fame-series-1", name: "Hall of Fame", series: 1, type: "hall-of-fame",
    displayName: "Hall of Fame — Series 1", shortCode: "HOF1", lifecycleDefault: "featured",
    branches: ["golden-era", "attitude-era"],
    lifecycleLabels: { featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "evolution-series-1": {
    id: "evolution-series-1", name: "Evolution", series: 1, type: "evolution",
    displayName: "Evolution — Series 1", shortCode: "EVO1", lifecycleDefault: "featured",
    branches: ["evolution"],
    lifecycleLabels: { featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  }
};
