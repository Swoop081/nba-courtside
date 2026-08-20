import { isUnreleasedSetId, isPlayerVisibleSuperstar } from "./release.js?v=0.13.72";
import { superstars } from "./superstars.js?v=0.13.72";

export const LIVE_EVENT_LENGTH = 5;
export const LIVE_EVENT_WIN_UP = 0;
export const LIVE_EVENT_CLEAR_BOOSTERS = 1;

const LIVE_REWARD_FALLBACKS = Object.freeze([
  "summerslam-series-1",
  "hall-of-fame-series-1",
  "evolution-series-1"
]);

function releasedRewardSet(setId, fallbackIndex = 0, now = new Date()) {
  if (setId && !isUnreleasedSetId(setId, now)) return setId;
  return LIVE_REWARD_FALLBACKS[Math.max(0, Math.min(LIVE_REWARD_FALLBACKS.length - 1, fallbackIndex))];
}

// The daily slot keeps the branded RAW/NXT/SmackDown rhythm, with original
// WWE Legacy event identities on the other four days.
export const DAILY_LIVE_EVENTS = Object.freeze({
  1: {
    id: "raw-live",
    dayLabel: "MONDAY",
    name: "RAW",
    kicker: "MONDAY NIGHT",
    description: "Five escalating fights under the bright lights of Monday Night RAW.",
    method: "strike",
    heroId: "cm-punk",
    rewardSetId: "raw-series-1",
    logoMode: "raw",
    opponentPool: ["seth-rollins", "gunther", "kevin-owens", "cody-rhodes", "roman-reigns", "cm-punk", "brock-lesnar", "bayley"]
  },
  2: {
    id: "powerhouse-collision",
    dayLabel: "TUESDAY",
    name: "Powerhouse Collision",
    kicker: "STRENGTH TAKES CENTRE STAGE",
    description: "Five escalating fights against WWE's heavy hitters.",
    method: "strength",
    heroId: "brock-lesnar",
    rewardSetId: "summerslam-series-1",
    logoMode: "legacy",
    opponentPool: ["andre-the-giant", "hulk-hogan", "roman-reigns", "kevin-owens", "kane", "the-undertaker", "ultimate-warrior", "rhea-ripley", "oba-femi", "brock-lesnar", "gunther"]
  },
  3: {
    id: "nxt-rising",
    dayLabel: "WEDNESDAY",
    name: "NXT",
    kicker: "WEDNESDAY NIGHT",
    description: "A five-match showcase built around tomorrow's standouts and breakout threats.",
    method: "agility",
    heroId: "oba-femi",
    rewardSetId: "summerslam-series-1",
    logoMode: "nxt",
    opponentPool: ["oba-femi", "stephanie-vaquer", "chelsea-green", "damian-priest", "tiffany-stratton", "finn-balor", "bron-breakker", "paige", "liv-morgan", "seth-rollins"]
  },
  4: {
    id: "technical-showcase",
    dayLabel: "THURSDAY",
    name: "Technical Showcase",
    kicker: "OUTWRESTLE THE BEST",
    description: "Five matches where ring IQ matters as much as damage.",
    method: "technical",
    heroId: "cm-punk",
    rewardSetId: "hall-of-fame-series-1",
    logoMode: "legacy",
    opponentPool: ["cm-punk", "bayley", "paige", "stephanie-vaquer", "charlotte-flair", "cody-rhodes", "liv-morgan", "gunther", "becky-lynch", "randy-savage"]
  },
  5: {
    id: "strike-zone",
    dayLabel: "FRIDAY",
    name: "Strike Zone",
    kicker: "HANDS UP · CHIN DOWN",
    description: "A daily tower built around WWE's hardest strikers.",
    method: "strike",
    heroId: "mankind",
    rewardSetId: "hall-of-fame-series-1",
    logoMode: "legacy",
    opponentPool: ["mankind", "bayley", "cm-punk", "paige", "seth-rollins", "randy-savage", "stephanie-vaquer", "stone-cold-steve-austin", "gunther", "becky-lynch"]
  },
  6: {
    id: "smackdown-showcase",
    dayLabel: "SATURDAY",
    name: "SmackDown",
    kicker: "SATURDAY NIGHT",
    description: "Five escalating fights from the world of SmackDown.",
    method: "strength",
    heroId: "roman-reigns",
    rewardSetId: "smackdown-series-1",
    logoMode: "smackdown",
    opponentPool: ["roman-reigns", "cody-rhodes", "la-knight", "randy-orton", "charlotte-flair", "solo-sikoa", "kevin-owens", "the-rock"]
  },
  0: {
    id: "evolution-night",
    dayLabel: "SUNDAY",
    name: "Evolution Night",
    kicker: "THE WOMEN'S DIVISION TAKES OVER",
    description: "Five fights through the women's division spotlight.",
    method: "technical",
    heroId: "rhea-ripley",
    rewardSetId: "evolution-series-1",
    logoMode: "legacy",
    opponentPool: ["iyo-sky", "bayley", "paige", "stephanie-vaquer", "charlotte-flair", "rhea-ripley", "liv-morgan", "becky-lynch"]
  }
});

export const THREE_DAY_TOWERS = Object.freeze([
  {
    id: "submission-specialists",
    name: "Submission Specialists",
    kicker: "ESCAPE OR TAP",
    description: "A three-day technical tower built around persistent submission pressure.",
    method: "technical",
    heroId: "rhea-ripley",
    rewardSetId: "evolution-series-1",
    logoMode: "legacy",
    opponentPool: ["rhea-ripley", "becky-lynch", "charlotte-flair", "bayley", "paige", "cm-punk", "gunther", "chad-gable"]
  },
  {
    id: "high-risk-showcase",
    name: "High Risk Showcase",
    kicker: "TAKE TO THE AIR",
    description: "Three days of speed, aerial counters and high-risk offense.",
    method: "agility",
    heroId: "iyo-sky",
    rewardSetId: "summerslam-series-1",
    logoMode: "legacy",
    opponentPool: ["iyo-sky", "seth-rollins", "rey-mysterio", "sol-ruca", "logan-paul", "randy-savage", "liv-morgan", "penta"]
  },
  {
    id: "fight-night",
    name: "Fight Night",
    kicker: "STRIKE FIRST",
    description: "A three-day brawl against WWE's toughest punchers and strikers.",
    method: "strike",
    heroId: "stone-cold-steve-austin",
    rewardSetId: "hall-of-fame-series-1",
    logoMode: "legacy",
    opponentPool: ["stone-cold-steve-austin", "mankind", "cm-punk", "seth-rollins", "becky-lynch", "gunther", "kevin-owens", "roman-reigns"]
  },
  {
    id: "giants-and-monsters",
    name: "Giants & Monsters",
    kicker: "SURVIVE THE HEAVYWEIGHTS",
    description: "Three days against the biggest power threats in WWE Legacy.",
    method: "strength",
    heroId: "kane",
    rewardSetId: "hall-of-fame-series-1",
    logoMode: "legacy",
    opponentPool: ["kane", "andre-the-giant", "brock-lesnar", "ultimate-warrior", "rhea-ripley", "roman-reigns", "gunther", "oba-femi"]
  }
]);

export const WEEKLY_TOWERS = Object.freeze([
  {
    id: "legends-collide",
    name: "Legends Collide",
    kicker: "SEVEN DAYS · ONE GAUNTLET",
    description: "A weekly tower against Hall of Fame icons and all-time greats.",
    method: "strength",
    heroId: "the-undertaker",
    rewardSetId: "hall-of-fame-series-1",
    logoMode: "legacy",
    opponentPool: ["the-undertaker", "stone-cold-steve-austin", "hulk-hogan", "andre-the-giant", "randy-savage", "mankind", "ultimate-warrior", "the-rock"]
  },
  {
    id: "champions-clash",
    name: "Champions Clash",
    kicker: "THE BEST OF THE BEST",
    description: "A seven-day tower stacked with championship-level opponents.",
    method: "strength",
    heroId: "roman-reigns",
    rewardSetId: "summerslam-series-1",
    logoMode: "legacy",
    opponentPool: ["roman-reigns", "cody-rhodes", "gunther", "cm-punk", "rhea-ripley", "seth-rollins", "brock-lesnar", "charlotte-flair"]
  },
  {
    id: "method-masterclass",
    name: "Method Masterclass",
    kicker: "ADAPT OR FALL",
    description: "A weekly tower that tests every Method across five escalating fights.",
    method: "technical",
    heroId: "cm-punk",
    rewardSetId: "summerslam-series-1",
    logoMode: "legacy",
    opponentPool: ["cm-punk", "bayley", "seth-rollins", "gunther", "rhea-ripley", "cody-rhodes", "becky-lynch", "roman-reigns"]
  },
  {
    id: "evolution-showcase",
    name: "Evolution Showcase",
    kicker: "WOMEN'S DIVISION WEEK",
    description: "Seven days to survive the deepest women's division tower.",
    method: "technical",
    heroId: "becky-lynch",
    rewardSetId: "evolution-series-1",
    logoMode: "legacy",
    opponentPool: ["becky-lynch", "rhea-ripley", "charlotte-flair", "iyo-sky", "bayley", "paige", "liv-morgan", "stephanie-vaquer"]
  }
]);

// v0.12.98 — 24-hour Birthday Bash towers for the currently released launch roster only.
// Future authored Superstars are deliberately omitted until their sets are promoted live.
export const RELEASED_BIRTHDAY_ROSTER_IDS = Object.freeze([
  "iyo-sky", "mankind", "hulk-hogan", "bayley", "cm-punk", "paige",
  "seth-rollins", "andre-the-giant", "stephanie-vaquer", "randy-savage",
  "roman-reigns", "charlotte-flair", "kevin-owens", "kane", "the-undertaker",
  "ultimate-warrior", "rhea-ripley", "cody-rhodes", "oba-femi",
  "stone-cold-steve-austin", "liv-morgan", "brock-lesnar", "gunther", "becky-lynch"
]);

const BIRTHDAY_PROFILES = Object.freeze([
  ["becky-lynch", "Becky Lynch", 1, 30, "technical", "evolution-series-1"],
  ["the-undertaker", "The Undertaker", 3, 24, "strike", "hall-of-fame-series-1"],
  ["stephanie-vaquer", "Stephanie Vaquer", 3, 29, "technical", "evolution-series-1"],
  ["charlotte-flair", "Charlotte Flair", 4, 5, "technical", "evolution-series-1"],
  ["oba-femi", "Oba Femi", 4, 22, "strength", "summerslam-series-1"],
  ["kane", "Kane", 4, 26, "strength", "hall-of-fame-series-1"],
  ["kevin-owens", "Kevin Owens", 5, 7, "strength", "summerslam-series-1"],
  ["iyo-sky", "IYO SKY", 5, 8, "agility", "evolution-series-1"],
  ["andre-the-giant", "André the Giant", 5, 19, "strength", "hall-of-fame-series-1"],
  ["roman-reigns", "Roman Reigns", 5, 25, "strength", "summerslam-series-1"],
  ["seth-rollins", "Seth Rollins", 5, 28, "strike", "summerslam-series-1"],
  ["mankind", "Mankind", 6, 7, "strike", "hall-of-fame-series-1"],
  ["liv-morgan", "Liv Morgan", 6, 8, "agility", "evolution-series-1"],
  ["bayley", "Bayley", 6, 15, "technical", "evolution-series-1"],
  ["ultimate-warrior", "Ultimate Warrior", 6, 16, "strength", "hall-of-fame-series-1"],
  ["cody-rhodes", "Cody Rhodes", 6, 30, "technical", "summerslam-series-1"],
  ["brock-lesnar", "Brock Lesnar", 7, 12, "strength", "summerslam-series-1"],
  ["hulk-hogan", "Hulk Hogan", 8, 11, "strength", "hall-of-fame-series-1"],
  ["paige", "Paige", 8, 17, "strike", "evolution-series-1"],
  ["gunther", "Gunther", 8, 20, "strength", "summerslam-series-1"],
  ["rhea-ripley", "Rhea Ripley", 10, 11, "strength", "evolution-series-1"],
  ["cm-punk", "CM Punk", 10, 26, "technical", "summerslam-series-1"],
  ["randy-savage", "Randy Savage", 11, 15, "agility", "hall-of-fame-series-1"],
  ["stone-cold-steve-austin", "Stone Cold Steve Austin", 12, 18, "strike", "hall-of-fame-series-1"]
]);

const BIRTHDAY_MONTH_NAMES = Object.freeze(["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"]);

export const BIRTHDAY_TOWERS = Object.freeze(BIRTHDAY_PROFILES.map(([id, name, month, day, method, rewardSetId]) => Object.freeze({
  id: `${id}-birthday-bash`,
  month,
  day,
  name: `${name} Birthday Bash`,
  kicker: `24 HOURS ONLY · ${BIRTHDAY_MONTH_NAMES[month - 1]} ${day}`,
  description: `Celebrate ${name} with a one-day five-match Birthday Bash. ${name} is Challenger 5.`,
  method,
  heroId: id,
  bossId: id,
  rewardSetId,
  logoMode: "legacy",
  opponentPool: RELEASED_BIRTHDAY_ROSTER_IDS
})));

export const WEEKLY_LIVE_EVENTS = Object.freeze(Object.values(DAILY_LIVE_EVENTS));

const METHOD_LABELS = Object.freeze({ strength: "Strength", strike: "Strike", technical: "Technical", agility: "Agility" });
const DAY_MS = 24 * 60 * 60 * 1000;
const ROTATION_EPOCH = new Date(2026, 7, 17, 0, 0, 0);

function localDayStart(now = new Date()) {
  const d = now instanceof Date ? new Date(now.getTime()) : new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}
function localMondayStart(now = new Date()) {
  const d = localDayStart(now);
  const day = d.getDay();
  d.setDate(d.getDate() - ((day + 6) % 7));
  return d;
}
function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function superstarRecord(id) {
  return superstars[id] ?? Object.values(superstars).find(star => star.id === id) ?? null;
}
export function releasedLiveEventOpponentIds(event, profile = null, now = new Date()) {
  return [...new Set(event?.opponentPool ?? [])].filter(id => isPlayerVisibleSuperstar(superstarRecord(id), profile, now));
}
function dailyCopy(template) {
  if (!template) return template;
  const scrub = value => String(value ?? "")
    .replace(/three-day/gi, "daily")
    .replace(/three days/gi, "one day")
    .replace(/seven-day/gi, "daily")
    .replace(/seven days/gi, "one day")
    .replace(/weekly/gi, "daily");
  return { ...template, kicker: scrub(template.kicker), description: scrub(template.description) };
}
function cloneEvent(template, rewardSetId, now = new Date()) {
  const daily = dailyCopy(template);
  return { ...daily, rewardSetId, opponentPool: releasedLiveEventOpponentIds(daily, null, now) };
}
function towerDescriptor({ key, event, startsAt, nextAt, cadence = "daily", cadenceLabel = "DAILY TOWER", winUp, clearBoosters = 1 }) {
  return {
    key,
    event,
    startsAt,
    nextAt,
    cadence,
    cadenceLabel,
    winUp,
    clearBoosters,
    length: LIVE_EVENT_LENGTH,
    msRemaining: Math.max(0, nextAt.getTime() - Date.now())
  };
}
function descriptorRemaining(descriptor, now = new Date()) {
  return { ...descriptor, msRemaining: Math.max(0, descriptor.nextAt.getTime() - (now instanceof Date ? now.getTime() : new Date(now).getTime())) };
}
function daySerial(now = new Date()) {
  const start = localDayStart(now);
  const epoch = localDayStart(ROTATION_EPOCH);
  return Math.max(0, Math.floor((start.getTime() - epoch.getTime()) / DAY_MS));
}

// The lead slot keeps the branded weekday rhythm (RAW Monday, NXT Wednesday,
// SmackDown Saturday). The other two slots rotate every local day from distinct
// theme pools. Because each pool has multiple names and advances every day, an
// exact event name cannot repeat on consecutive days.
export function liveEventRotation(now = new Date()) {
  const start = localDayStart(now);
  const source = DAILY_LIVE_EVENTS[start.getDay()] ?? DAILY_LIVE_EVENTS[1];
  const nextAt = new Date(start.getTime());
  nextAt.setDate(nextAt.getDate() + 1);
  const event = cloneEvent(source, releasedRewardSet(source.rewardSetId, start.getDay() % LIVE_REWARD_FALLBACKS.length, now), now);
  const dayKey = dateKey(start);
  return {
    weekKey: dayKey,
    dayKey,
    dayIndex: start.getDay(),
    event,
    startsAt: start,
    nextAt,
    msRemaining: Math.max(0, nextAt.getTime() - (now instanceof Date ? now.getTime() : new Date(now).getTime()))
  };
}

function primaryDailyTower(now) {
  const rotation = liveEventRotation(now);
  return towerDescriptor({
    key: `daily:${rotation.dayKey}:lead:${rotation.event.id}`,
    event: rotation.event,
    startsAt: rotation.startsAt,
    nextAt: rotation.nextAt,
    winUp: LIVE_EVENT_WIN_UP,
    clearBoosters: LIVE_EVENT_CLEAR_BOOSTERS
  });
}
function themedDailyTower(now, slot, templates, offset = 0) {
  const start = localDayStart(now);
  const nextAt = new Date(start.getTime());
  nextAt.setDate(nextAt.getDate() + 1);
  const serial = daySerial(now);
  const template = templates[(serial + offset) % templates.length];
  const event = cloneEvent(template, releasedRewardSet(template.rewardSetId, (serial + offset) % LIVE_REWARD_FALLBACKS.length, now), now);
  return towerDescriptor({
    key: `daily:${dateKey(start)}:${slot}:${event.id}`,
    event,
    startsAt: start,
    nextAt,
    winUp: 0,
    clearBoosters: 1
  });
}
function birthdayTowers(now) {
  const start = localDayStart(now);
  const month = start.getMonth() + 1;
  const day = start.getDate();
  return BIRTHDAY_TOWERS.filter(template => {
    if (template.month !== month || template.day !== day) return false;
    const star = superstars[template.heroId] ?? Object.values(superstars).find(item => item.id === template.heroId);
    return !!star && !isUnreleasedSetId(star.setId, now);
  }).map(template => {
    const nextAt = new Date(start.getTime());
    nextAt.setDate(nextAt.getDate() + 1);
    const event = cloneEvent(template, releasedRewardSet(template.rewardSetId, 0, now), now);
    return towerDescriptor({ key: `birthday:${dateKey(start)}:${event.id}`, event, startsAt: start, nextAt, cadence: "birthday", cadenceLabel: "24 HOURS ONLY", winUp: 0, clearBoosters: 1 });
  });
}

export function activeLiveEventTowers(now = new Date()) {
  return [
    primaryDailyTower(now),
    themedDailyTower(now, "feature-a", THREE_DAY_TOWERS, 0),
    themedDailyTower(now, "feature-b", WEEKLY_TOWERS, 1),
    ...birthdayTowers(now)
  ].map(tower => descriptorRemaining(tower, now));
}
export function liveEventTowerByKey(towerKey, now = new Date()) {
  return activeLiveEventTowers(now).find(tower => tower.key === towerKey) ?? null;
}

function ensureTowerStore(profile, now = new Date()) {
  profile.liveEventTowers ??= { states: {}, totalClears: profile.weeklyLiveEvents?.totalClears ?? 0, completedKeys: [] };
  const store = profile.liveEventTowers;
  store.states ??= {};
  store.totalClears ??= profile.weeklyLiveEvents?.totalClears ?? 0;
  store.completedKeys ??= [];
  profile.weeklyLiveEvents ??= { weekKey: null, eventId: null, activeRun: null, clearedThisWeek: false, totalClears: store.totalClears, bestStage: 0, completedWeeks: [] };
  profile.weeklyLiveEvents.totalClears = Math.max(profile.weeklyLiveEvents.totalClears ?? 0, store.totalClears ?? 0);

  // One-time compatibility migration for an in-progress/cleared v0.12.95 daily event.
  const daily = primaryDailyTower(now);
  const legacy = profile.weeklyLiveEvents;
  if (!store.states[daily.key] && legacy.eventId === daily.event.id && legacy.weekKey === liveEventRotation(now).weekKey && (legacy.activeRun || legacy.clearedThisWeek)) {
    store.states[daily.key] = {
      towerKey: daily.key,
      eventId: daily.event.id,
      activeRun: legacy.activeRun ? { ...legacy.activeRun, towerKey: daily.key } : null,
      cleared: !!legacy.clearedThisWeek,
      bestStage: legacy.bestStage ?? legacy.activeRun?.stage ?? 0
    };
  }
  return store;
}

function stateForTower(profile, tower, now = new Date()) {
  const store = ensureTowerStore(profile, now);
  store.states[tower.key] ??= { towerKey: tower.key, eventId: tower.event.id, activeRun: null, cleared: false, bestStage: 0 };
  return store.states[tower.key];
}

function shuffle(values, rng = Math.random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function repairLiveEventRunReleaseGate(profile, tower, state, now = new Date()) {
  const run = state?.activeRun;
  if (!run || run.status !== "active") return;
  const released = Object.values(superstars).filter(star => isPlayerVisibleSuperstar(star, profile, now)).map(star => star.id);
  const releasedSet = new Set(released);
  const used = new Set([run.superstarId]);
  const themed = releasedLiveEventOpponentIds(tower.event, profile, now);
  const fallback = [...themed, ...released].filter(id => id !== run.superstarId);
  run.opponents = (run.opponents ?? []).map(id => {
    if (releasedSet.has(id) && id !== run.superstarId && !used.has(id)) { used.add(id); return id; }
    const replacement = fallback.find(candidate => !used.has(candidate));
    if (replacement) used.add(replacement);
    return replacement ?? id;
  }).slice(0, LIVE_EVENT_LENGTH);
  while (run.opponents.length < LIVE_EVENT_LENGTH) {
    const replacement = fallback.find(candidate => !used.has(candidate));
    if (!replacement) break;
    used.add(replacement);
    run.opponents.push(replacement);
  }
  const bossId = tower.event?.bossId;
  if (tower.cadence === "birthday" && bossId && bossId !== run.superstarId && releasedSet.has(bossId)) {
    run.opponents = run.opponents.filter(id => id !== bossId).slice(0, LIVE_EVENT_LENGTH - 1);
    while (run.opponents.length < LIVE_EVENT_LENGTH - 1) {
      const replacement = fallback.find(candidate => candidate !== bossId && !run.opponents.includes(candidate) && candidate !== run.superstarId);
      if (!replacement) break;
      run.opponents.push(replacement);
    }
    run.opponents.push(bossId);
  }
}

export function liveEventTowerState(profile, towerKey, now = new Date()) {
  const tower = liveEventTowerByKey(towerKey, now);
  if (!tower) return null;
  const state = stateForTower(profile, tower, now);
  repairLiveEventRunReleaseGate(profile, tower, state, now);
  return { tower, state, aggregate: ensureTowerStore(profile, now) };
}

export function liveEventStage(event, stageIndex) {
  const index = Math.max(0, Math.min(LIVE_EVENT_LENGTH - 1, Number(stageIndex) || 0));
  const method = event?.method ?? "strength";
  const methodLabel = METHOD_LABELS[method] ?? method;
  const stages = [
    { label: "Opening Bout", ruleName: "Standard Rules", ruleText: "No event modifier.", modifier: null },
    { label: "Hot Start", ruleName: `${methodLabel} Advantage`, ruleText: `Opponent begins with +1 ${methodLabel} Momentum.`, modifier: { startingMomentum: { p2: { [method]: 1 } } } },
    { label: "Main Event Pressure", ruleName: "Crowd Momentum", ruleText: "Opponent begins with +1 Adrenaline.", modifier: { startingAdrenaline: { p2: 1 } } },
    { label: "Against the Odds", ruleName: "Pre-Match Damage", ruleText: "You begin the match 4 HP down.", modifier: { startingHpLoss: { p1: 4 } } },
    { label: "Tower Final", ruleName: "Final Boss Pressure", ruleText: `Opponent begins with +1 ${methodLabel} Momentum and +1 Adrenaline.`, modifier: { startingMomentum: { p2: { [method]: 1 } }, startingAdrenaline: { p2: 1 } } }
  ];
  return { index, ...stages[index] };
}

function chooseOpponents(tower, superstarId, eligibleOpponentIds, rng = Math.random) {
  const eligible = new Set(eligibleOpponentIds ?? []);
  const pool = tower.event.opponentPool.filter(id => eligible.has(id) && id !== superstarId);
  const fallback = (eligibleOpponentIds ?? []).filter(id => id !== superstarId && !pool.includes(id));
  const bossId = tower.event.bossId && tower.event.bossId !== superstarId && eligible.has(tower.event.bossId) ? tower.event.bossId : null;
  const withoutBoss = pool.filter(id => id !== bossId);
  const opponents = [...shuffle(withoutBoss, rng), ...shuffle(fallback.filter(id => id !== bossId), rng)].slice(0, LIVE_EVENT_LENGTH - (bossId ? 1 : 0));
  if (bossId) opponents.push(bossId);
  return opponents.slice(0, LIVE_EVENT_LENGTH);
}

export function startLiveEventTower(profile, towerKey, superstarId, eligibleOpponentIds, rng = Math.random, now = new Date()) {
  const entry = liveEventTowerState(profile, towerKey, now);
  if (!entry) throw new Error("That Live Event has expired.");
  const { tower, state } = entry;
  if (state.cleared) throw new Error("This Live Event is already complete.");
  if (state.activeRun?.status === "active") return state.activeRun;
  const opponents = chooseOpponents(tower, superstarId, eligibleOpponentIds, rng);
  if (opponents.length !== LIVE_EVENT_LENGTH) throw new Error("Not enough eligible opponents for this Live Event.");
  state.activeRun = {
    towerKey,
    eventId: tower.event.id,
    superstarId,
    rewardSetId: tower.event.rewardSetId,
    opponents,
    stage: 0,
    status: "active",
    startedAt: new Date().toISOString()
  };
  return state.activeRun;
}

export function currentLiveEventTowerOpponent(profile, towerKey, now = new Date()) {
  const entry = liveEventTowerState(profile, towerKey, now);
  const run = entry?.state?.activeRun;
  return !run || run.status !== "active" ? null : run.opponents[run.stage] ?? null;
}
export function currentLiveEventTowerStage(profile, towerKey, now = new Date()) {
  const entry = liveEventTowerState(profile, towerKey, now);
  if (!entry) return null;
  return liveEventStage(entry.tower.event, entry.state.activeRun?.stage ?? 0);
}
export function recordLiveEventTowerMatch(profile, towerKey, result, now = new Date()) {
  const entry = liveEventTowerState(profile, towerKey, now);
  if (!entry) throw new Error("That Live Event has expired.");
  const { tower, state, aggregate } = entry;
  const run = state.activeRun;
  if (!run || run.status !== "active") throw new Error("No active Live Event run");
  if (result === "loss") return { status: "retry", run, tower, stage: liveEventStage(tower.event, run.stage) };
  if (result !== "win") throw new Error("Invalid Live Event result");
  run.stage += 1;
  state.bestStage = Math.max(state.bestStage ?? 0, run.stage);
  if (run.stage >= LIVE_EVENT_LENGTH) {
    run.status = "cleared";
    state.cleared = true;
    state.completedAt = new Date().toISOString();
    aggregate.totalClears = (aggregate.totalClears ?? 0) + 1;
    if (!aggregate.completedKeys.includes(tower.key)) aggregate.completedKeys.push(tower.key);
    profile.weeklyLiveEvents.totalClears = aggregate.totalClears;
    const superPackSetId = run.rewardSetId ?? tower.event.rewardSetId;
    profile.superPackCreditsBySet ??= {};
    profile.superPackCreditsBySet[superPackSetId] = (profile.superPackCreditsBySet[superPackSetId] ?? 0) + 1;
    return { status: "cleared", run, tower, event: tower.event, superPackAwarded: true, superPackSetId };
  }
  return { status: "advance", run, tower, stage: liveEventStage(tower.event, run.stage) };
}

// Compatibility wrappers retained for existing saves/tests and any older UI code.
export function weeklyLiveEventState(profile, now = new Date()) {
  const tower = primaryDailyTower(now);
  const entry = liveEventTowerState(profile, tower.key, now);
  const state = entry.state;
  const rotation = liveEventRotation(now);
  profile.weeklyLiveEvents.weekKey = rotation.weekKey;
  profile.weeklyLiveEvents.eventId = tower.event.id;
  profile.weeklyLiveEvents.activeRun = state.activeRun;
  profile.weeklyLiveEvents.clearedThisWeek = !!state.cleared;
  profile.weeklyLiveEvents.bestStage = Math.max(profile.weeklyLiveEvents.bestStage ?? 0, state.bestStage ?? 0);
  return profile.weeklyLiveEvents;
}
export function currentWeeklyLiveEvent(now = new Date()) { return liveEventRotation(now).event; }
export function startWeeklyLiveEvent(profile, superstarId, eligibleOpponentIds, rng = Math.random, now = new Date()) {
  const tower = primaryDailyTower(now);
  const run = startLiveEventTower(profile, tower.key, superstarId, eligibleOpponentIds, rng, now);
  weeklyLiveEventState(profile, now);
  return run;
}
export function currentWeeklyLiveEventOpponent(profile, now = new Date()) {
  const tower = primaryDailyTower(now);
  return currentLiveEventTowerOpponent(profile, tower.key, now);
}
export function currentWeeklyLiveEventStage(profile, now = new Date()) {
  const tower = primaryDailyTower(now);
  return currentLiveEventTowerStage(profile, tower.key, now);
}
export function recordWeeklyLiveEventMatch(profile, result, now = new Date()) {
  const tower = primaryDailyTower(now);
  const outcome = recordLiveEventTowerMatch(profile, tower.key, result, now);
  weeklyLiveEventState(profile, now);
  return outcome;
}
