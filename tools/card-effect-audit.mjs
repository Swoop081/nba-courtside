import fs from "node:fs";
import { allGameplayCards } from "../js/data/content.js";
import { superstars } from "../js/data/superstars.js";
import { isInternalTestSetId, PRE_RELEASE_TEST_SET_IDS } from "../js/data/release.js";

const engineSource = ["../js/engine/MatchEngine.js", "../js/engine/rules.js"]
  .map(path => fs.readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");
const cards = allGameplayCards.filter(card => isInternalTestSetId(card.setId));
const stars = Object.values(superstars).filter(star => isInternalTestSetId(star.setId));
const allNames = new Set(allGameplayCards.map(card => normalize(card.name)));
const issues = [];
const checked = new Set();

const handledMoveEffects = new Set([
  "gainAdrenaline", "gainAdrenalineIfBehind", "loseOpponentAdrenaline", "loseOpponentAdrenalineIfStreak",
  "gainStreak", "discardOpponent", "search", "searchChoice", "buffNextByName", "discountNextByName",
  "discountNextMethod", "drawSelf", "drawThenDiscardSelf", "bodyPressure"
]);
const handledUtilityEffects = new Set([
  "discountNext", "buffNext", "gainAdrenaline", "healSelf", "buffNextMethod", "romanOohAhh",
  "fightForever", "drawThenDiscardSelf", "topDeckTutor", "searchChoice", "onceTooOften",
  "crowdSupport", "peopleChampionship", "what", "paulHeymanManager", "paulHeymanPromo", "visionManager"
]);
const handledSpecialTypes = new Set([
  "brassKnuckles", "cancelOpponentUtility", "counterChooseDiscount", "counterDiscountMethod", "counterDiscountNamed",
  "counterDrainActionLock", "counterDrawControl", "counterKeepSequence", "counterTutorNamed", "counterTutorStrike", "counterUncounterableMethod",
  "flairChopWooo", "headbuttDiscount", "hulkUp", "ignoreStun", "kickoutControlAdrenaline", "lowHpTutor",
  "moveCounteredDrawDrain", "nextStrengthUncounterable", "noWipeout", "nobodySlams", "paulHeyman", "pinEscape",
  "austinTheoryAllDay", "angeloDawkinsRunIn", "luchaLibreLegend", "hammerInBoot", "fearlessAssault", "steelPlate", "lolaFistsDontLie",
  "reduceIncomingBig", "regainAfterLoseControl", "retainOnCounter", "shakeRopes", "socko", "joeBelieve", "roxanneProdigy", "dragonLuchaLegacy", "vikingoElOjoProtection", "iguanaLaYesca", "hbkShowstopper", "exclusiveTrademarkTutor"
]);
const handledAbilityTypes = new Set([
  "agilityAfterStrike", "agilityAfterTechnical", "agilityRequirement", "codyUndeniable", "connectDamage",
  "connectMethodCost", "connectMethodDamage", "connectNamed", "counterDraw", "differentMethod", "firstCounterMomentum",
  "gableOlympicPedigree", "loganViralAthlete", "momentumBuff", "moveCountered", "raquelUnmatchedPower", "reduceIncoming",
  "secondMoveInControl", "solDaredevil", "strengthReqDrain", "strikeDamageDiscountTechnical", "strikeDiscountStrength",
  "strikeDiscountTechnical", "surviveAtOne", "takeDamage", "technicalDiscountAgility", "joeCrowdBelieves", "theoryFutureIsNow", "montezTakeFlight",
  "reyUltimateUnderdog", "dominikNuclearHeat", "pentaZeroFearZeroMercy", "lolaCounterStriker", "dragonHybridAthlete", "vikingoJineteDelAire", "iguanaPlayDead"
]);
const engineBackedTopLevelFields = [
  "bodyDamage", "discountAfterCounter", "discountIfNamedConnectedThisControl", "kickoutRetainControl",
  "kickoutRetainControlDraw", "opponentAdrenalineOnConnect", "playCondition", "playableAfterTurn",
  "priorConnectedMethodBonus", "priorMoveBonusDamage", "searchOnConnectName", "selfStunIfCountered", "counterAdrenalineOnConnect"
];

function normalize(value) {
  return String(value ?? "").toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}
function problem(card, code, detail) { issues.push(`${card.id}: ${code}${detail ? ` — ${detail}` : ""}`); }
function includesName(text, name) { return normalize(text).includes(normalize(name)); }
function hasNumberLess(text, amount) {
  const n = Number(amount);
  return new RegExp(`(?:costs?|gets?)\\s+${n}\\s+less|${n}\\s+less`).test(normalize(text));
}

for (const field of engineBackedTopLevelFields) {
  if (cards.some(card => card[field] != null) && !engineSource.includes(field)) issues.push(`ENGINE: field ${field} is authored but has no runtime reference`);
}
for (const type of handledMoveEffects) if (cards.some(c => (c.effects ?? []).some(e => e.type === type)) && !engineSource.includes(type)) issues.push(`ENGINE: Move effect ${type} has no runtime reference`);

for (const card of cards) {
  const rules = normalize(card.rulesText);
  const effects = card.effects ?? [];
  if (card.groundOpponent && !card.groundedOnly) {
    checked.add(card.id);
    if (!rules.includes("ground")) problem(card, "GROUND_TEXT", "groundOpponent is true but the back does not say the opponent is grounded");
  }
  if ((card.stun ?? 0) > 0) {
    checked.add(card.id);
    if (!rules.includes("stun")) problem(card, "STUN_TEXT", `Stun ${card.stun} is missing from rules text`);
  }
  if ((card.selfStunIfCountered ?? 0) > 0) {
    checked.add(card.id);
    if (!(rules.includes("counter") && rules.includes("stun"))) problem(card, "COUNTER_SELF_STUN_TEXT", "self-Stun on Counter is not disclosed");
  }
  if (card.submission) {
    checked.add(card.id);
    const match = rules.match(/\+(\d+)[^.!]*damage/);
    if (!match) problem(card, "SUBMISSION_TEXT", "persistent pressure amount is missing");
    else if (Number(match[1]) !== Number(card.submission.pressure)) problem(card, "SUBMISSION_PRESSURE", `text +${match[1]} vs data +${card.submission.pressure}`);
  }
  if (card.bodyDamage?.bodyPart) {
    checked.add(card.id);
    if (!(rules.includes("damage") && rules.includes(normalize(card.bodyDamage.bodyPart).replace(/s$/, "")))) problem(card, "BODY_DAMAGE_TEXT", "persistent body-part damage is not fully disclosed");
  }
  if (card.searchOnConnectName) {
    checked.add(card.id);
    if (!allNames.has(normalize(card.searchOnConnectName))) problem(card, "SEARCH_TARGET", `missing ${card.searchOnConnectName}`);
    if (!includesName(rules, card.searchOnConnectName)) problem(card, "SEARCH_TEXT", `does not name ${card.searchOnConnectName}`);
    if ((card.searchOnConnectDiscount ?? 0) > 0 && !hasNumberLess(rules, card.searchOnConnectDiscount)) problem(card, "SEARCH_DISCOUNT_TEXT", `expected ${card.searchOnConnectDiscount} less`);
  }
  if ((card.opponentAdrenalineOnConnect ?? 0) !== 0) {
    checked.add(card.id);
    if (!rules.includes("adrenaline")) problem(card, "ADRENALINE_TEXT", "opponent Adrenaline effect is not disclosed");
  }
  if (card.kickoutRetainControl || card.kickoutRetainControlDraw) {
    checked.add(card.id);
    if (!(rules.includes("kick") && rules.includes("control"))) problem(card, "KICKOUT_CONTROL_TEXT", "kickout Control exception is not disclosed");
    if ((card.kickoutRetainControlDraw ?? 0) > 0 && !rules.includes("draw")) problem(card, "KICKOUT_DRAW_TEXT", "kickout draw is not disclosed");
  }
  if (card.priorConnectedMethodBonus) {
    checked.add(card.id);
    if (!(rules.includes(normalize(card.priorConnectedMethodBonus.method)) && rules.includes(`+${card.priorConnectedMethodBonus.damage}`))) problem(card, "METHOD_CHAIN_TEXT", "prior-Method damage bonus is incomplete");
  }
  if (card.discountAfterCounter) {
    checked.add(card.id);
    if (!(rules.includes("counter") && hasNumberLess(rules, card.discountAfterCounter))) problem(card, "COUNTER_DISCOUNT_TEXT", "Counter discount is incomplete");
  }
  if (card.discountIfNamedConnectedThisControl) {
    checked.add(card.id);
    const e = card.discountIfNamedConnectedThisControl;
    if (!(includesName(rules, e.name) && hasNumberLess(rules, e.amount))) problem(card, "NAMED_DISCOUNT_TEXT", "named-chain discount is incomplete");
  }

  for (const effect of effects) {
    checked.add(card.id);
    if (!handledMoveEffects.has(effect.type)) problem(card, "UNHANDLED_MOVE_EFFECT", effect.type);
    if (effect.type === "search") {
      if (!allNames.has(normalize(effect.name))) problem(card, "SEARCH_TARGET", `missing ${effect.name}`);
      if (!includesName(rules, effect.name)) problem(card, "SEARCH_TEXT", `does not name ${effect.name}`);
      if ((effect.discount ?? 0) > 0 && !hasNumberLess(rules, effect.discount)) problem(card, "SEARCH_DISCOUNT_TEXT", `expected ${effect.discount} less`);
    }
    if (effect.type === "discardOpponent" && !rules.includes("ditch")) problem(card, "DITCH_TEXT", "opponent discard is not disclosed");
    if (effect.type === "drawSelf" && !rules.includes("draw")) problem(card, "DRAW_TEXT", "draw effect is not disclosed");
    if (effect.type === "drawThenDiscardSelf" && !(rules.includes("draw") && rules.includes("ditch"))) problem(card, "DRAW_DITCH_TEXT", "draw/ditch effect is incomplete");
    if (effect.type === "gainAdrenaline" && !(rules.includes("adrenaline") || rules.includes("attitude"))) problem(card, "GAIN_ADRENALINE_TEXT", "gain is not disclosed");
    if (effect.type === "loseOpponentAdrenaline" && !(rules.includes("adrenaline") || rules.includes("attitude"))) problem(card, "LOSE_ADRENALINE_TEXT", "drain is not disclosed");
    if (effect.type === "bodyPressure") {
      const part = normalize(effect.bodyPart).replace(/s$/, "");
      if (!(rules.includes("damage") && rules.includes(part) && rules.includes(`+${effect.amount}`))) problem(card, "BODY_PRESSURE_TEXT", "persistent pressure is incomplete");
    }
    if (effect.type === "buffNextByName" && !(includesName(rules, effect.name) && rules.includes(`+${effect.damage}`) && rules.includes("damage"))) problem(card, "NAMED_DAMAGE_TEXT", "named damage buff is incomplete");
    if (effect.type === "discountNextByName" && !(includesName(rules, effect.name) && hasNumberLess(rules, effect.amount))) problem(card, "NAMED_DISCOUNT_TEXT", "named discount is incomplete");
    if (effect.type === "discountNextMethod" && !(rules.includes(normalize(effect.method)) && hasNumberLess(rules, effect.amount ?? 1))) problem(card, "METHOD_DISCOUNT_TEXT", "Method discount is incomplete");
  }

  if (card.effect) {
    checked.add(card.id);
    if (!handledUtilityEffects.has(card.effect.type)) problem(card, "UNHANDLED_UTILITY_EFFECT", card.effect.type);
    if (card.effect.type === "drawThenDiscardSelf" && !(rules.includes("draw") && rules.includes("ditch"))) problem(card, "ACTION_DRAW_DITCH_TEXT", "Action draw/ditch effect is incomplete");
    if (card.effect.type === "searchChoice") for (const name of card.effect.names ?? []) if (!includesName(rules, name)) problem(card, "ACTION_SEARCH_TEXT", `does not name ${name}`);
    if (card.effect.type === "topDeckTutor" && !(rules.includes("top") && rules.includes(String(card.effect.look ?? 4)))) problem(card, "TOP_DECK_TEXT", "top-deck look count is incomplete");
  }
  if (card.special?.type) {
    checked.add(card.id);
    if (!handledSpecialTypes.has(card.special.type)) problem(card, "UNHANDLED_SPECIAL", card.special.type);
    if (!rules) problem(card, "SPECIAL_TEXT", "Triggered Action rules text is empty");
  }
}

// Prevent the same named chain from being authored on both the setup card and
// the target card, which would silently stack the discount twice.
for (const source of cards) {
  for (const effect of source.effects ?? []) {
    if (effect.type !== "discountNextByName") continue;
    const target = cards.find(card => normalize(card.name) === normalize(effect.name));
    const targetRule = target?.discountIfNamedConnectedThisControl;
    if (targetRule && normalize(targetRule.name) === normalize(source.name)) {
      issues.push(`${source.id}: DOUBLE_NAMED_DISCOUNT — ${source.name} and ${target.id} both author the same ${effect.amount ?? 0}-cost chain`);
    }
  }
}

for (const star of stars) {
  const type = star.ability?.trigger?.type;
  if (!type) continue;
  if (!handledAbilityTypes.has(type)) issues.push(`${star.id}: UNHANDLED_ABILITY — ${type}`);
}

const summary = {
  scopeSets: [...new Set(cards.map(card => card.setId))],
  preReleaseTestSets: [...PRE_RELEASE_TEST_SET_IDS],
  superstars: stars.length,
  gameplayCards: cards.length,
  effectBearingCardsChecked: checked.size,
  issues
};
console.log(JSON.stringify(summary, null, 2));
if (issues.length) process.exit(1);
