import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { isPlayerReleasedSetId } from "../js/data/release.js";
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { decisionOwner, cpuDecision, executeCpuDecision } from "../js/ai/WrestlingAI.js";

const stars = Object.values(superstars).filter(star => isPlayerReleasedSetId(star.setId));
if (stars.length !== 25) throw new Error(`Expected 25 currently released Superstars, found ${stars.length}`);

function seededRng(seed) {
  let x = seed >>> 0;
  return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
}

const stats = Object.fromEntries(stars.map(star => [star.id, { id: star.id, name: star.name, wins: 0, losses: 0, draws: 0, turns: 0 }]));
const finishes = {};
let matches = 0, stalls = 0, totalTurns = 0;

for (let i = 0; i < stars.length; i++) {
  for (let j = i + 1; j < stars.length; j++) {
    for (let gameIndex = 0; gameIndex < 20; gameIndex++) {
      const flip = gameIndex % 2 === 1;
      const p1 = flip ? stars[j] : stars[i];
      const p2 = flip ? stars[i] : stars[j];
      const engine = new MatchEngine({
        p1, p2, decks,
        rng: seededRng(1300000 + i * 100003 + j * 1009 + gameIndex * 37)
      });
      let steps = 0;
      while (engine.state().phase !== "MATCH_OVER" && steps++ < 2000) {
        const pid = decisionOwner(engine.state());
        const decision = cpuDecision(engine, pid);
        if (!decision || !executeCpuDecision(engine, decision, pid)) break;
      }
      const state = engine.state();
      matches++;
      totalTurns += state.turnNumber;
      stats[p1.id].turns += state.turnNumber;
      stats[p2.id].turns += state.turnNumber;
      if (state.phase !== "MATCH_OVER") { stalls++; continue; }
      const finish = state.finish?.type ?? "unknown";
      finishes[finish] = (finishes[finish] ?? 0) + 1;
      if (!state.winner) { stats[p1.id].draws++; stats[p2.id].draws++; continue; }
      const winnerId = state.players[state.winner].superstar.id;
      const loserPid = state.winner === "p1" ? "p2" : "p1";
      const loserId = state.players[loserPid].superstar.id;
      stats[winnerId].wins++;
      stats[loserId].losses++;
    }
  }
}

const rows = Object.values(stats).map(row => {
  const played = row.wins + row.losses + row.draws;
  return {
    ...row,
    played,
    winRate: Number((100 * row.wins / Math.max(1, played)).toFixed(1)),
    avgTurns: Number((row.turns / Math.max(1, played)).toFixed(1))
  };
}).sort((a, b) => b.winRate - a.winRate || a.name.localeCompare(b.name));

console.log(JSON.stringify({
  releasedSuperstars: stars.length,
  matches,
  stalls,
  averageTurns: Number((totalTurns / Math.max(1, matches)).toFixed(2)),
  finishes,
  rows
}, null, 2));
if (stalls) process.exitCode = 1;
