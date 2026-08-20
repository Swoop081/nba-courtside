import { superstars } from "./superstars.js?v=0.13.72";

export const CHAMPIONSHIP_ROAD_LENGTH = 24;
export const CHAMPIONSHIP_SET_ID = "summerslam-series-1";
export const WORLD_CHAMPIONS = ["cm-punk", "roman-reigns"];
export const CHAMPIONSHIP_DIFFICULTY_ORDER = ["easy", "normal", "hard", "hardcore"];
export const CHAMPIONSHIP_DIFFICULTIES = Object.freeze({
  easy: { id: "easy", label: "Easy", hpModifier: -5, description: "Opponents start with 5 less HP." },
  normal: { id: "normal", label: "Normal", hpModifier: 0, description: "Opponents use their normal HP." },
  hard: { id: "hard", label: "Hard", hpModifier: 5, description: "Opponents start with 5 extra HP." },
  hardcore: { id: "hardcore", label: "Hardcore", hpModifier: 10, description: "Opponents start with 10 extra HP." }
});

export const CHAMPIONSHIP_ROAD_SECTIONS = Object.freeze([
  { id: "golden-era", label: "Golden Era", start: 1, end: 4, accent: "gold", setId: "hall-of-fame-series-1" },
  { id: "summerslam-a", label: "SummerSlam · Part I", start: 5, end: 8, accent: "blue", setId: "summerslam-series-1" },
  { id: "evolution-a", label: "Evolution · Part I", start: 9, end: 12, accent: "violet", setId: "evolution-series-1" },
  { id: "attitude-era", label: "Attitude Era", start: 13, end: 16, accent: "red", setId: "hall-of-fame-series-1" },
  { id: "summerslam-b", label: "SummerSlam · Part II", start: 17, end: 20, accent: "blue", setId: "summerslam-series-1" },
  { id: "evolution-b", label: "Evolution · Part II", start: 21, end: 24, accent: "violet", setId: "evolution-series-1" }
]);

export const CHAMPIONSHIP_ROAD_OPPONENTS = Object.freeze([
  "hulk-hogan", "andre-the-giant", "randy-savage", "ultimate-warrior",
  "cm-punk", "seth-rollins", "roman-reigns", "kevin-owens",
  "iyo-sky", "bayley", "paige", "stephanie-vaquer",
  "mankind", "kane", "the-undertaker", "stone-cold-steve-austin",
  "cody-rhodes", "oba-femi", "brock-lesnar", "gunther",
  "charlotte-flair", "rhea-ripley", "liv-morgan", "becky-lynch"
]);

// Retained as a compatibility export for older source/tests. Championship Road
// is now one continuous 24-match map rather than four selectable branches.
export const CHAMPIONSHIP_BRANCHES = Object.freeze({
  season1: { id: "season1", label: "Season 1 Road", setId: CHAMPIONSHIP_SET_ID, finals: ["rhea-ripley", "liv-morgan"] }
});
export const CHAMPIONSHIP_STAGES = Object.freeze(CHAMPIONSHIP_ROAD_OPPONENTS.map((_, i) => `Match ${i + 1}`));

function blankSuperstarRoad() {
  return {
    activeRun: null,
    clears: 0,
    bestStage: 0,
    clearsByDifficulty: {},
    bestStageByDifficulty: {},
    completedByDifficulty: {},
    unlockedDifficulties: ["easy"],
    selectedDifficulty: "easy"
  };
}

function normalizeRoad(road) {
  road ??= blankSuperstarRoad();
  road.activeRun ??= null;
  road.clears ??= 0;
  road.bestStage ??= 0;
  road.clearsByDifficulty ??= {};
  road.bestStageByDifficulty ??= {};
  road.completedByDifficulty ??= {};
  road.unlockedDifficulties ??= ["easy"];
  road.selectedDifficulty ??= "easy";
  if (road.activeRun && (!Array.isArray(road.activeRun.opponents) || road.activeRun.opponents.length !== CHAMPIONSHIP_ROAD_LENGTH)) road.activeRun = null;
  road.unlockedDifficulties = CHAMPIONSHIP_DIFFICULTY_ORDER.filter(id => id === "easy" || road.unlockedDifficulties.includes(id));
  if (!road.unlockedDifficulties.includes("easy")) road.unlockedDifficulties.unshift("easy");
  return road;
}

function ensure(profile) {
  profile.championshipRoad ??= { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, completedBy: [] };
  const state = profile.championshipRoad;
  state.clearsByDifficulty ??= {};
  state.bestStageByDifficulty ??= {};
  state.completedByDifficulty ??= {};
  state.unlockedDifficulties ??= ["easy"];
  state.selectedDifficulty ??= "easy";
  state.championshipPackCreditsBySet ??= {};
  state.championshipPackQueue ??= [];
  state.completedBy ??= [];
  state.roadsBySuperstar ??= {};
  state.selectedSuperstarId ??= null;

  // Lazy one-time migration from the older single global run. Historical global
  // totals/rewards remain untouched; only the per-Superstar career view is split.
  if (!state.perSuperstarRoadsMigrated) {
    if (state.activeRun && Array.isArray(state.activeRun.opponents) && state.activeRun.opponents.length === CHAMPIONSHIP_ROAD_LENGTH && state.activeRun.superstarId) {
      const id = state.activeRun.superstarId;
      const road = normalizeRoad(state.roadsBySuperstar[id] ?? blankSuperstarRoad());
      road.activeRun = { ...state.activeRun, opponents: [...state.activeRun.opponents] };
      road.bestStage = Math.max(road.bestStage, Number(state.bestStage ?? state.activeRun.stage ?? 0));
      road.clearsByDifficulty = { ...(state.clearsByDifficulty ?? {}) };
      road.bestStageByDifficulty = { ...(state.bestStageByDifficulty ?? {}) };
      road.completedByDifficulty = Object.fromEntries(Object.entries(state.completedByDifficulty ?? {}).map(([key, value]) => [key, [...value]]));
      road.unlockedDifficulties = [...(state.unlockedDifficulties ?? ["easy"] )];
      road.selectedDifficulty = state.selectedDifficulty ?? state.activeRun.difficultyId ?? "easy";
      state.roadsBySuperstar[id] = road;
      state.selectedSuperstarId = id;
    }
    for (const id of state.completedBy ?? []) {
      const road = normalizeRoad(state.roadsBySuperstar[id] ?? blankSuperstarRoad());
      road.clears = Math.max(road.clears, 1);
      road.bestStage = Math.max(road.bestStage, CHAMPIONSHIP_ROAD_LENGTH);
      road.clearsByDifficulty.easy = Math.max(road.clearsByDifficulty.easy ?? 0, 1);
      road.bestStageByDifficulty.easy = Math.max(road.bestStageByDifficulty.easy ?? 0, CHAMPIONSHIP_ROAD_LENGTH);
      road.completedByDifficulty.easy ??= [];
      if (!road.completedByDifficulty.easy.includes(id)) road.completedByDifficulty.easy.push(id);
      if (!road.unlockedDifficulties.includes("normal")) road.unlockedDifficulties.push("normal");
      state.roadsBySuperstar[id] = road;
    }
    state.perSuperstarRoadsMigrated = true;
  }

  for (const [id, road] of Object.entries(state.roadsBySuperstar)) state.roadsBySuperstar[id] = normalizeRoad(road);
  return state;
}

function difficultyIndex(id) { return CHAMPIONSHIP_DIFFICULTY_ORDER.indexOf(id); }

export function championshipRoadForSuperstar(profile, superstarId) {
  const state = ensure(profile);
  if (!superstarId) return null;
  state.roadsBySuperstar[superstarId] = normalizeRoad(state.roadsBySuperstar[superstarId] ?? blankSuperstarRoad());
  return state.roadsBySuperstar[superstarId];
}

export function selectChampionshipRoadSuperstar(profile, superstarId) {
  const state = ensure(profile);
  if (!Object.values(superstars).some(star => star.id === superstarId)) throw new Error("Choose a valid Superstar for Championship Road");
  state.selectedSuperstarId = superstarId;
  const road = championshipRoadForSuperstar(profile, superstarId);
  state.activeRun = road.activeRun;
  state.selectedDifficulty = road.selectedDifficulty;
  state.unlockedDifficulties = [...road.unlockedDifficulties];
  return road;
}

export function championshipDifficultyUnlocked(profile, difficultyId, superstarId = null) {
  const state = ensure(profile), idx = difficultyIndex(difficultyId);
  if (idx <= 0) return difficultyId === "easy";
  const id = superstarId ?? state.selectedSuperstarId ?? state.activeRun?.superstarId;
  const road = id ? championshipRoadForSuperstar(profile, id) : null;
  const previous = CHAMPIONSHIP_DIFFICULTY_ORDER[idx - 1];
  return (road?.clearsByDifficulty?.[previous] ?? 0) > 0;
}

export function championshipRoadState(profile) {
  const state = ensure(profile);
  const id = state.selectedSuperstarId ?? state.activeRun?.superstarId ?? null;
  if (id) {
    const road = championshipRoadForSuperstar(profile, id);
    for (const difficultyId of CHAMPIONSHIP_DIFFICULTY_ORDER) {
      if (championshipDifficultyUnlocked(profile, difficultyId, id) && !road.unlockedDifficulties.includes(difficultyId)) road.unlockedDifficulties.push(difficultyId);
    }
    state.activeRun = road.activeRun;
    state.selectedDifficulty = road.selectedDifficulty;
    state.unlockedDifficulties = [...road.unlockedDifficulties];
  }
  return state;
}

export function championshipRoadDifficultyModifier(difficultyId = "easy") {
  const difficulty = CHAMPIONSHIP_DIFFICULTIES[difficultyId] ?? CHAMPIONSHIP_DIFFICULTIES.easy;
  const modifier = { name: `Championship Road · ${difficulty.label}`, ruleText: difficulty.description };
  if (difficulty.hpModifier < 0) modifier.startingHpLoss = { p2: Math.abs(difficulty.hpModifier) };
  if (difficulty.hpModifier > 0) modifier.startingHpBonus = { p2: difficulty.hpModifier };
  return modifier;
}

export function championshipRoadSectionForStage(stage = 0) {
  const match = Math.max(1, Math.min(CHAMPIONSHIP_ROAD_LENGTH, Number(stage) + 1));
  return CHAMPIONSHIP_ROAD_SECTIONS.find(section => match >= section.start && match <= section.end) ?? CHAMPIONSHIP_ROAD_SECTIONS[0];
}

export function startChampionshipRoad(profile, superstarId, _opponentIds = [], _rng = Math.random, difficultyId = "easy") {
  const state = ensure(profile);
  if (!Object.values(superstars).some(star => star.id === superstarId)) throw new Error("Choose a valid Superstar for Championship Road");
  if (!CHAMPIONSHIP_DIFFICULTIES[difficultyId]) throw new Error("Unknown Championship Road difficulty");
  selectChampionshipRoadSuperstar(profile, superstarId);
  if (!championshipDifficultyUnlocked(profile, difficultyId, superstarId)) throw new Error(`Complete ${CHAMPIONSHIP_DIFFICULTIES[CHAMPIONSHIP_DIFFICULTY_ORDER[difficultyIndex(difficultyId)-1]]?.label ?? "the previous difficulty"} first`);
  const road = championshipRoadForSuperstar(profile, superstarId);
  road.selectedDifficulty = difficultyId;
  road.activeRun = {
    superstarId,
    difficultyId,
    branchId: "season1",
    setId: CHAMPIONSHIP_SET_ID,
    opponents: [...CHAMPIONSHIP_ROAD_OPPONENTS],
    stage: 0,
    status: "active",
    startedAt: new Date().toISOString()
  };
  state.selectedDifficulty = difficultyId;
  state.activeRun = road.activeRun;
  return road.activeRun;
}

export function currentChampionshipOpponent(profile, superstarId = null) {
  const state = ensure(profile);
  const id = superstarId ?? state.selectedSuperstarId ?? state.activeRun?.superstarId;
  const run = id ? championshipRoadForSuperstar(profile, id)?.activeRun : null;
  return !run || run.status !== "active" ? null : run.opponents[run.stage] ?? null;
}

export function recordChampionshipMatch(profile, result) {
  const state = ensure(profile);
  const superstarId = state.selectedSuperstarId ?? state.activeRun?.superstarId;
  const road = superstarId ? championshipRoadForSuperstar(profile, superstarId) : null;
  const run = road?.activeRun;
  if (!run || run.status !== "active") throw new Error("No active Championship Road run");
  if (result === "loss") return { status: "retry", run };
  if (result !== "win") throw new Error("Invalid Championship Road result");
  run.stage += 1;
  road.bestStage = Math.max(road.bestStage ?? 0, run.stage);
  road.bestStageByDifficulty[run.difficultyId] = Math.max(road.bestStageByDifficulty[run.difficultyId] ?? 0, run.stage);
  state.bestStage = Math.max(state.bestStage ?? 0, run.stage);
  state.bestStageByDifficulty[run.difficultyId] = Math.max(state.bestStageByDifficulty[run.difficultyId] ?? 0, run.stage);
  const completedSection = run.stage % 4 === 0 ? CHAMPIONSHIP_ROAD_SECTIONS.find(section => section.end === run.stage) ?? null : null;
  if (run.stage >= run.opponents.length) {
    run.status = "cleared";
    road.clears = (road.clears ?? 0) + 1;
    road.clearsByDifficulty[run.difficultyId] = (road.clearsByDifficulty[run.difficultyId] ?? 0) + 1;
    road.completedByDifficulty[run.difficultyId] ??= [];
    if (!road.completedByDifficulty[run.difficultyId].includes(run.superstarId)) road.completedByDifficulty[run.difficultyId].push(run.superstarId);
    state.clears = (state.clears ?? 0) + 1;
    state.clearsByDifficulty[run.difficultyId] = (state.clearsByDifficulty[run.difficultyId] ?? 0) + 1;
    state.completedByDifficulty[run.difficultyId] ??= [];
    if (!state.completedByDifficulty[run.difficultyId].includes(run.superstarId)) state.completedByDifficulty[run.difficultyId].push(run.superstarId);
    const firstWithSuperstar = !state.completedBy.includes(run.superstarId);
    if (firstWithSuperstar) state.completedBy.push(run.superstarId);
    const idx = difficultyIndex(run.difficultyId), next = CHAMPIONSHIP_DIFFICULTY_ORDER[idx + 1];
    if (next && !road.unlockedDifficulties.includes(next)) road.unlockedDifficulties.push(next);
    state.unlockedDifficulties = [...road.unlockedDifficulties];
    const superPackSetId = completedSection?.setId ?? CHAMPIONSHIP_SET_ID;
    profile.superPackCreditsBySet ??= {};
    profile.superPackCreditsBySet[superPackSetId] = (profile.superPackCreditsBySet[superPackSetId] ?? 0) + 1;
    return { status: "cleared", run, championshipPackAwarded: false, superPackAwarded: true, superPackSetId, firstWithSuperstar, unlockedDifficulty: next ?? null, sectionCleared: completedSection };
  }
  state.activeRun = run;
  return { status: "advance", run, sectionCleared: completedSection };
}

export function resetChampionshipRoad(profile, superstarId = null) {
  const state = ensure(profile);
  const id = superstarId ?? state.selectedSuperstarId ?? state.activeRun?.superstarId;
  if (id) championshipRoadForSuperstar(profile, id).activeRun = null;
  state.activeRun = null;
  return state;
}
