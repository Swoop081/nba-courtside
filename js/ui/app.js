import { assetUrl, BUILD_VERSION } from "../config/build.js?v=0.13.72";
import { fetchLatestBuild, isNewerBuild, updateNavigationUrl } from "../config/update.js?v=0.13.72";
import { superstars } from "../data/superstars.js?v=0.13.72";
import { decks } from "../data/decks.js?v=0.13.72";
import { sets } from "../data/sets.js?v=0.13.72";
import { playerReleasedCollectibleSetIds, isPlayerReleasedSetId, isPlayerVisibleSuperstar } from "../data/release.js?v=0.13.72";
import { collectionCards, setCollection, setCollections, cardsForSet } from "../data/collection.js?v=0.13.72";
import { artworkFor, superstarArtwork, menuSuperstarPhotoFor, finalBossRockMenuArtwork, superstarCardArtFor, superstarHeadshotFor, finishedCardArtFor, legacyFinishedCardArtFor, layeredCardArtFor } from "../data/artwork.js?v=0.13.72";
import { superstarNameplateStyleFor, superstarNameplateStyleVars } from "../data/superstar-nameplate-styles.js?v=0.13.72";
import { STARTER_CHOICES, createProfile, hasSuperstar, loadProfile, saveProfile, resetProfile, setDeckAssistance, ownedCount } from "../data/profile.js?v=0.13.72";
import { openBooster, openSuperPack, openLadderCompletionPack, openChampionshipPack, grantBooster, grantVictoryBooster, boosterCreditsFor, superPackCreditsFor, finalizePackUniversePoints } from "../data/boosters.js?v=0.13.72";
import { STORE_BOOSTER_PRICE, STORE_SUPERSTAR_PRICE, storeRotation, storeSuperstars, storeLeadOffCards, purchaseStoreBooster, purchaseStoreSuperstar } from "../data/store.js?v=0.13.72";
import { randomExhibitionOpponent } from "../data/matchmaking.js?v=0.13.72";
import { buildPlayableDeck, findPackUpgrades, applyUpgrade } from "../data/deck-assistant.js?v=0.13.72";
import { applyFoilGameplay, foilDamageBonusFor } from "../data/foil.js?v=0.13.72";
import { MatchEngine } from "../engine/MatchEngine.js?v=0.13.72";
import { canPlayMomentum, canPlayEntrance, canPlayAction, canPlaySupport, canPlayManager, canPlaySpecial, effectiveTotalMomentum, moveEligibility, canCounter, counterEligibility, autoCounterEligibility, autoCounterCost, canAttemptPin, canPlayPinEscape, submissionThreshold, canReturnToRing, canFollowOutside } from "../engine/rules.js?v=0.13.72";
import { totalMomentum } from "../engine/utils.js?v=0.13.72";
import { healthZone } from "../engine/health.js?v=0.13.72";
import { decisionOwner } from "../ai/WrestlingAI.js?v=0.13.72";
import { advanceCpuUntilHuman } from "./turn-driver.js?v=0.13.72";
import { reconstructCurrentPlayPile } from "./play-pile.js?v=0.13.72";
import { LADDER_LIVES, LADDER_LENGTH, ladderState, startLadderRun, currentLadderOpponent, recordLadderMatch } from "../data/ladder.js?v=0.13.72";
import { KING_OF_THE_RING_ROUNDS, kingOfTheRingState, startKingOfTheRing, currentKingOfTheRingOpponent, recordKingOfTheRingMatch, prepareKingOfTheRingReward, markKingOfTheRingCoronationSeen, claimKingOfTheRingReward, resetKingOfTheRing } from "../data/king-of-the-ring.js?v=0.13.72";
import { CHAMPIONSHIP_ROAD_LENGTH, CHAMPIONSHIP_STAGES, CHAMPIONSHIP_DIFFICULTY_ORDER, CHAMPIONSHIP_DIFFICULTIES, CHAMPIONSHIP_ROAD_SECTIONS, CHAMPIONSHIP_ROAD_OPPONENTS, championshipRoadState, championshipRoadForSuperstar, selectChampionshipRoadSuperstar, championshipDifficultyUnlocked, championshipRoadDifficultyModifier, championshipRoadSectionForStage, startChampionshipRoad, currentChampionshipOpponent, recordChampionshipMatch, resetChampionshipRoad } from "../data/championship-road.js?v=0.13.72";
import { LIVE_EVENT_LENGTH, LIVE_EVENT_WIN_UP, LIVE_EVENT_CLEAR_BOOSTERS, activeLiveEventTowers, liveEventTowerByKey, liveEventTowerState, startLiveEventTower, currentLiveEventTowerOpponent, currentLiveEventTowerStage, recordLiveEventTowerMatch, liveEventRotation, liveEventStage, weeklyLiveEventState } from "../data/live-events.js?v=0.13.72";
import { challengeState, claimChallenge, recordCompletedMatchChallenges } from "../data/challenges.js?v=0.13.72";
import { CAREER_MODES, careerRecord, achievementProgress, recordCareerMatch, refreshCareerAchievements } from "../data/career.js?v=0.13.72";
import { COLLECTION_MILESTONES, FOIL_MILESTONES, setProgressState, collectionProgress, availableMilestoneRewards, claimMilestone } from "../data/set-progression.js?v=0.13.72";
import { MOVE_TYPE_LABELS } from "../data/move-types.js?v=0.13.72";
import { COUNTER_STATE_LABELS, SUBMISSION_TARGET_LABELS } from "../data/counter-states.js?v=0.13.72";
import { CATALOGUE_PAGE_SIZE, defaultCatalogueFilters, catalogueOptions, filterAndSortCatalogue, superstarIdsForCard, isSharedCard } from "../data/catalogue.js?v=0.13.72";
import { DECK_LAB_CATEGORIES, createDeckDraft, recommendedDeckDraft, optimizeDeck, aggregateDeck, eligibleOwnedCards, allOwnedEntrances, ownedCardsForCategory, addCardToDraft, removeCardFromDraft, replaceLeadOffSlot, validateDeckDraft, materializeDraft, leadOffIds, buildOwnedRecommendedDraft, buildBestOwnedRecommendedDraft, recommendedDeckComparison, recommendedEntranceId, recommendedDeckMissingCount, autoFillOwnedDraft, recommendedCategoryCounts, currentCategoryCounts, cardEligibilityForSuperstar, entranceEligibilityForSuperstar, selectedEntranceId, setSelectedEntrance, ownedTotal, categoryForCard } from "../data/deck-builder.js?v=0.13.72";
import { RECOMMENDED_DECK_SHAPE } from "../data/deck-health.js?v=0.13.72";
import { SEASON_1, SEASON_TIER_COUNT, XP_PER_TIER, MATCH_XP, seasonState, seasonTier, seasonLevelProgress, seasonTimeRemaining, nextRoadmapNode, roadmapNodeStatus, awardMatchSeasonXp, tierReward, claimSeasonTier, claimAllSeasonTiers, freePackStatus, claimFreeSeasonBooster } from "../data/seasons.js?v=0.13.72";
import { GAME_RULE_SECTIONS, PIN_CHANCE_TABLE, LIVE_EVENT_WEEK } from "../data/game-rules.js?v=0.13.72";
import { SAVE_FILENAME, exportSaveToFiles, readSaveFile, saveImportRollback, loadImportRollback, clearImportRollback, backupMetadata } from "../data/save-backup.js?v=0.13.72";

const HUMAN = "p1";
const CPU = "p2";
let game = null;
let message = "";
let profile = loadProfile();
let screen = "splash";
let selection = { p1: profile?.starterId ?? "cm-punk", p2: profile?.starterId === "roman-reigns" ? "cm-punk" : "roman-reigns" };
let lastMatchup = { ...selection };
let collectionFilter = { kind: "all", rarity: "all", search: "" };
let collectionSort = "newest";
let collectionView = "owned";
let collectionRenderLimit = 48;
let catalogueFilter = defaultCatalogueFilters();
let cataloguePage = 1;
let catalogueFiltersOpen = false;
let collectionFiltersOpen = false;
let flippedCatalogueCards = new Set();
let lastPack = null;
let pendingUpgrades = [];
let appliedPackUpgrades = [];
let packStage = "idle";
let revealedPackCards = new Set();
let boosterFocusIndex = 0;
let packFinalized = false;
let matchRewarded = false;
let activeMode = "exhibition";
let currentPackType = "standard";
let deckBuilderStarId = profile?.starterId ?? "cm-punk";
let deckDraft = null;
let deckBuilderFilter = "";
let deckLabStage = "roster";
let deckLabPicker = null;
let deckLabOnlyValid = false;
let deckLabEntranceId = null;
let deckLabInspectCardId = null;
let deckLabInspectFlipped = false;
let activeCollectionSetId = "all";
let activeBoosterSetId = "summerslam-series-1";
let unlockCelebration = null;
let unlockCelebrationIndex = 0;
let unlockCelebrationReturnScreen = null;
let optionsResetArmed = false;
let pendingSaveImport = null;
let championshipDifficultyId = "easy";
let liveEventNow = null;
let selectedLiveEventKey = null;
let activeLiveEventTowerKey = null;
let flippedHandCards = new Set();
let autoCounterSelecting = false;
let autoCounterSelection = new Set();
let flippedCollectionCards = new Set();
let playPileFlipped = false;
let playPileCardKey = null;
let boosterRulesFlipped = new Set();
let boosterInspectIndex = null;
let boosterInspectFlipped = false;
let convertedPackCards = new Set();
let duplicateConversionTimer = null;
let lastChromeScreen = null;
let exhibitionConfirmed = { p1: false, p2: true };
let selectDetailKeys = new Set();
let pendingMatch = null;
let matchPresentationSetId = null;
let entranceIntroPlayerId = null;
let entranceIntroFlipped = false;
let entranceIntroRevealed = false;
let entranceRevealTimer = null;
let boosterReturnScreen = null;
let superstarOverlayId = null;
let superstarOverlayFlipped = false;
let handOverlayCard = null;
let handOverlayFlipped = false;
let pendingDeckBuildSuperstarId = null;
let pendingDeckBuildStep = null;
let seasonStickyScrollHandler = null;
let pendingTierUps = [];
let appUpdateState = { checking: false, latest: BUILD_VERSION, available: false, error: "", deferred: false };

function activeMatchBlocksUpdate() {
  return screen === "match" && !!game && game.state?.().phase !== "MATCH_OVER";
}

function applyAppUpdate(version = appUpdateState.latest) {
  if (!isNewerBuild(version, BUILD_VERSION) || !globalThis.location?.href) return false;
  globalThis.location.replace(updateNavigationUrl(globalThis.location.href, version));
  return true;
}

async function checkForAppUpdate({ manual = false, autoApply = true } = {}) {
  if (appUpdateState.checking) return appUpdateState;
  appUpdateState = { ...appUpdateState, checking: true, error: "" };
  try {
    const latest = await fetchLatestBuild();
    const available = isNewerBuild(latest, BUILD_VERSION);
    const blocked = available && activeMatchBlocksUpdate();
    appUpdateState = { checking: false, latest, available, error: "", deferred: blocked };
    if (available && autoApply && !blocked) {
      applyAppUpdate(latest);
      return appUpdateState;
    }
    if (manual) message = available ? (blocked ? `v${latest} is ready and will wait until this match is finished.` : `WWE Legacy v${latest} is ready to install.`) : `WWE Legacy v${BUILD_VERSION} is up to date.`;
  } catch (error) {
    appUpdateState = { ...appUpdateState, checking: false, error: error?.message ?? "Update check failed." };
    if (manual) message = `Update check failed. Your current build and save are unchanged.`;
  }
  if (manual && screen === "profile") renderProfile();
  return appUpdateState;
}

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function scrollNewScreenToTop() {
  if (lastChromeScreen === screen) return;
  lastChromeScreen = screen;
  const reset = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  };
  // Reset immediately, then again after the newly rendered screen has been
  // painted. The second pass prevents mobile Safari from restoring the old
  // page's scroll offset after a large DOM replacement.
  reset();
  requestAnimationFrame(() => {
    reset();
    requestAnimationFrame(reset);
  });
}

const CURRENT_PLAYER_SET_IDS = playerReleasedCollectibleSetIds(new Date());
const roster = Object.values(superstars).filter(star => !star.developmentOnly && isPlayerReleasedSetId(star.setId));
const superstarById = Object.fromEntries(Object.values(superstars).filter(star => !star.developmentOnly && isPlayerReleasedSetId(star.setId)).map(star => [star.id, star]));
const launchCollectionCards = collectionCards.filter(card => CURRENT_PLAYER_SET_IDS.includes(card.setId));
const launchSetCollections = Object.fromEntries(Object.entries(setCollections).filter(([setId]) => CURRENT_PLAYER_SET_IDS.includes(setId)));
function playerFacingCollectionCards() {
  const rewardCards = collectionCards.filter(card => card.setId === "season-1-final-boss" && (ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil") > 0));
  return [...launchCollectionCards, ...rewardCards];
}
function playerFacingSetCollections() {
  const out = { ...launchSetCollections };
  if (playerFacingCollectionCards().some(card => card.setId === "season-1-final-boss")) out["season-1-final-boss"] = setCollections["season-1-final-boss"];
  return out;
}
const collectionById = new Map(collectionCards.map(card => [card.id, card]));
function onboardingMarkup() {
  if (!profile?.onboarding || profile.onboarding.complete || !game) return "";
  const st=game.state();
  let text="Play a Momentum page first. Momentum stays with you all match and helps meet Method requirements and costs.";
  const human=st?.players?.[HUMAN];
  const momentumTotal=Object.values(human?.momentum??{}).reduce((sum,v)=>sum+(Number(v)||0),0);
  if (momentumTotal>0) text="Now play a legal Move. Control lets you keep attacking until the sequence ends.";
  if ((st?.turnNumber??1)>2) text="Wear the opponent down, then PIN after a connected Move or work a body part with Submissions.";
  return `<aside class="onboarding-coach" role="dialog" aria-label="First match guide"><span>FIRST MATCH</span><b>${text}</b><button id="skip-onboarding" type="button">Got it</button></aside>`;
}
const rosterForBranch = (branch) => roster.filter(star => star.setId === branch.setId && (!branch.era || star.era === branch.era));
const $ = selector => document.querySelector(selector);
const nameFor = id => id ? game.state().players[id]?.superstar.name ?? id : "No one";
const cardNameFor = id => id ? collectionById.get(id)?.name ?? id : "";
const superstarVisualMarkup = (id, name, cls = "") => {
  const cardArt = superstarCardArtFor(id);
  const portrait = superstarArtwork[id] ?? null;
  const placeholder = assetUrl("assets/cards/art/temp/superstar-placeholder.svg");
  if (cardArt) {
    const fallback = portrait || placeholder;
    return `<img class="${cls} superstar-card-visual ccg-load-guard" src="${cardArt}" alt="${name}" data-superstar-card-art="${id}" onload="this.classList.add('is-art-ready');" onerror="this.classList.remove('is-art-ready');this.onerror=null;this.dataset.artFallback='portrait';this.src='${fallback}';">`;
  }
  if (portrait && !portrait.includes('superstar-placeholder.svg')) return `<img class="${cls} superstar-card-visual ccg-load-guard" src="${portrait}" alt="${name}" onload="this.classList.add('is-art-ready');" onerror="this.classList.remove('is-art-ready');this.onerror=null;this.dataset.artFallback='placeholder';this.src='${placeholder}';">`;
  return `<img class="${cls} superstar-card-visual is-placeholder-art" src="${placeholder}" alt="${name} artwork pending">`;
};
const menuSuperstarPhotoMarkup = (id, name, cls = "") => {
  const portrait = menuSuperstarPhotoFor(id) ?? superstarArtwork[id] ?? superstarHeadshotFor(id) ?? assetUrl("assets/cards/art/temp/superstar-placeholder.svg");
  return `<img class="${cls} superstar-render-visual official-menu-superstar-photo" src="${portrait}" alt="${name}" data-menu-superstar-photo="${id}" onerror="this.onerror=null;this.src='${superstarArtwork[id] ?? assetUrl("assets/cards/art/temp/superstar-placeholder.svg")}';">`;
};
const finalBossRockMarkup = (cls = "") => `<img class="${cls} superstar-render-visual final-boss-rock-menu-art" src="${finalBossRockMenuArtwork}" alt="The Rock — Final Boss">`;
const portraitMarkup = menuSuperstarPhotoMarkup;
const superstarRenderMarkup = menuSuperstarPhotoMarkup;
const GENERIC_SUPERSTAR_PLACEHOLDER = assetUrl("assets/cards/art/temp/superstar-placeholder.svg");

const SET_LOGO_ASSETS = {
  "survivor-series-series-1": assetUrl("assets/branding/survivor-series-series-1/survivor-series-wargames-houston-2026.png"),
  "summerslam-series-1": assetUrl("assets/art/summerslam-series-1/summerslam-2026-logo.png"),
  "hall-of-fame-series-1": assetUrl("assets/art/hall-of-fame-series-1/hall-of-fame-logo.png"),
  "evolution-series-1": assetUrl("assets/art/evolution-series-1/evolution-logo.png"),
  "season-1-final-boss": assetUrl("assets/art/season-1-final-boss/rewards-logo.png"),
  "season-2-whos-next": assetUrl("assets/art/season-1-final-boss/rewards-logo.png"),
  "raw-series-1": assetUrl("assets/branding/raw-series-1/raw-logo.webp"),
  "worlds-collide-series-1": assetUrl("assets/branding/worlds-collide-series-1/worlds-collide-logo.webp"),
  "money-in-the-bank-series-1": assetUrl("assets/branding/money-in-the-bank-series-1/money-in-the-bank-logo.webp"),
  "smackdown-series-1": assetUrl("assets/branding/smackdown-series-1/smackdown-logo-official.png")
};
function setLogoMarkup(setId, className = "") {
  const src = SET_LOGO_ASSETS[setId];
  if (!src) return "";
  const label = sets[setId]?.displayName ?? sets[setId]?.name ?? "WWE set";
  return `<img class="set-brand-logo ${className}" src="${src}" alt="${label}">`;
}

function physicalBoosterPackMarkup({ setId, title = "WWE LEGACY", series = "SERIES 1", subtitle = "5 CARDS · 1 GUARANTEED FOIL", extraClass = "", opening = false } = {}) {
  const hasSetLogo = Boolean(SET_LOGO_ASSETS[setId]);
  const logo = setLogoMarkup(setId, "pack-set-logo") || `<span class="pack-text-logo"><b>${String(title).toUpperCase()}</b><small>${series}</small></span>`;
  return `<span class="booster-pack physical-booster-pack pack-set-${setId} ${extraClass}">
    <span class="pack-crimp pack-crimp-top" aria-hidden="true"></span>
    <span class="pack-side-seam pack-side-seam-left" aria-hidden="true"></span>
    <span class="pack-side-seam pack-side-seam-right" aria-hidden="true"></span>
    <span class="pack-wrapper-face">
      <span class="pack-brand-lockup">${logo}</span>
      ${hasSetLogo ? "" : `<span class="pack-set-name">${String(title).toUpperCase()}</span>`}
      <b class="pack-series-name">${series}</b>
      <small class="pack-contents-line">${subtitle}</small>
    </span>
    <span class="pack-crimp pack-crimp-bottom" aria-hidden="true"></span>
    <span class="pack-tear-notch" aria-hidden="true"></span>
    <i class="pack-foil-sheen" aria-hidden="true"></i>
    ${opening ? '<span class="pack-tear" aria-hidden="true"></span>' : ''}
  </span>`;
}

function uiIcon(name, className = "ui-icon") {
  const icons = {
    bolt: '<path d="M13 2 4 14h7l-1 8 9-13h-7z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
    cards: '<rect x="6" y="4" width="13" height="16" rx="2"/><path d="M3 8V6a2 2 0 0 1 2-2h9M9 8h7M9 12h7M9 16h5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
    xp: '<circle cx="12" cy="12" r="9"/><path d="m8 9 8 6M16 9l-8 6"/>',
    points: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m8 12 3 3 5-6"/>',
    drop: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    gift: '<rect x="4" y="9" width="16" height="12" rx="2"/><path d="M12 9v12M3 9h18M7.5 9C5 9 4 7.5 4.8 6.2 6.2 4 9.5 7 12 9c2.5-2 5.8-5 7.2-2.8C20 7.5 19 9 16.5 9"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/>',
    pack: '<path d="M6 4h12l2 5-2 11H6L4 9z"/><path d="M4 9h16M9 4l1 5M15 4l-1 5"/>'
  };
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] ?? icons.star}</svg>`;
}

const MATCH_PRESENTATION_SETS = [...CURRENT_PLAYER_SET_IDS];
function randomMatchPresentationSet() {
  return MATCH_PRESENTATION_SETS[Math.floor(Math.random() * MATCH_PRESENTATION_SETS.length)] ?? "summerslam-series-1";
}
function presentationThemeClass(setId) { return `presentation-${setId ?? "summerslam-series-1"}`; }
function superstarCollectibleFor(starId) {
  const star = superstarById[starId];
  return collectionCards.find(card => card.kind === "superstar" && card.superstarId === starId)
    ?? (star?.cardId ? collectionById.get(star.cardId) : null);
}
function superstarNameplateLengthClass(name = "") {
  const length = String(name).length;
  return length > 22 ? "is-name-xl" : length > 16 ? "is-name-long" : "";
}
function superstarNameplateMarkup(starId, name, setId, extraClass = "") {
  const style = superstarNameplateStyleFor(starId, setId);
  const vars = superstarNameplateStyleVars(starId, setId);
  const lengthClass = superstarNameplateLengthClass(name);
  return `<span class="superstar-signature-nameplate ${lengthClass} ${extraClass}" data-superstar-nameplate="${starId}" data-nameplate-style="${style.label}" style="${vars}"><span class="superstar-signature-name-text">${name}</span><small>SUPERSTAR</small></span>`;
}
function entranceCollectibleFor(starId) {
  const star = superstarById[starId];
  return collectionCards.find(card => card.kind === "entrance" && card.superstarId === starId)
    ?? (star?.entranceId ? collectionById.get(star.entranceId) : null);
}
function superstarPreviewCardMarkup(starId, extraClass = "") {
  const star = superstarById[starId];
  const card = superstarCollectibleFor(starId);
  if (!star) return "";
  if (card && superstarCardArtFor(starId)) return collectibleCardMarkup(card,{extraClass,interactive:false});
  const rarity = Math.max(1, Math.min(4, Number(card?.rarity ?? 4)));
  const portrait = superstarArtwork[starId] ?? GENERIC_SUPERSTAR_PLACEHOLDER;
  return `<span class="generated-superstar-preview ${extraClass} set-${star.setId}">
    <span class="generated-superstar-art"><img src="${portrait}" alt="${star.name}" onerror="this.onerror=null;this.src='${GENERIC_SUPERSTAR_PLACEHOLDER}';"></span>
    <span class="generated-superstar-shade"></span>
    <span class="generated-superstar-stars">${Array.from({length:rarity},()=>"★").join("")}</span>
    <span class="generated-superstar-logo">${setLogoMarkup(star.setId,"generated-set-logo")}</span>
    ${superstarNameplateMarkup(star.id, star.name, star.setId, "generated-superstar-nameplate")}
  </span>`;
}
function configuredEntranceForStar(starId) {
  const star = superstarById[starId];
  if (!star) return null;
  const entranceId = selectedEntranceId(profile, starId) ?? star.entranceId;
  if (!entranceId || entranceId === star.entranceId) return star.entrance ?? collectionById.get(entranceId) ?? null;
  const card = collectionById.get(entranceId);
  return card ? { ...card, rulesText: card.rulesText ?? card.abilityText ?? card.effectText ?? "" } : star.entrance;
}
function superstarWithConfiguredEntrance(starId) {
  const star = superstarById[starId];
  if (!star) return null;
  const entrance = configuredEntranceForStar(starId);
  return { ...star, entranceId: entrance?.id ?? star.entranceId, entrance: entrance ?? star.entrance };
}
function entranceEffectCallouts(star) {
  const entrance = star?.entrance ?? {};
  const callouts = [];
  for (const [method, amount] of Object.entries(entrance.preMatchMomentum ?? {})) {
    if (amount) callouts.push(`+${amount} ${method.toUpperCase()}`);
  }
  if (entrance.preMatchAdrenaline) callouts.push(`+${entrance.preMatchAdrenaline} ADRENALINE`);
  if (entrance.firstStrikeMomentum) callouts.push(`FIRST STRIKE +${entrance.firstStrikeMomentum} STRIKE`);
  if (entrance.delayedTurn5) callouts.push("TURN 5 ENTRANCE EFFECT");
  return callouts;
}

function openablePackCount(p) {
  if (!p) return 0;
  const ladder = ladderState(p);
  const road = championshipRoadState(p);
  return CURRENT_PLAYER_SET_IDS.reduce((sum, setId) => {
    const standard = boosterCreditsFor(p, setId);
    const superPacks = superPackCreditsFor(p, setId);
    const ladderRewards = Math.max(0, Number(ladder.completionPackCreditsBySet?.[setId]) || 0);
    const championshipRewards = Math.max(0, Number(road.championshipPackCreditsBySet?.[setId]) || 0);
    return sum + standard + superPacks + ladderRewards + championshipRewards;
  }, 0);
}

function attentionState() {
  if (!profile) return { boosters: 0, challenges: 0, seasons: 0 };
  const boosters = openablePackCount(profile);
  const challengeData = challengeState(profile);
  const challengeGoals = [...(challengeData.daily ?? []), ...(challengeData.weekly ?? [])].filter(c => !c.claimed && (c.progress ?? 0) >= c.target).length;
  const milestoneClaims = Object.values(launchSetCollections).reduce((sum, set) => {
    const rewards = availableMilestoneRewards(profile, set.id);
    return sum + rewards.collection.length + rewards.foil.length;
  }, 0);
  const challenges = challengeGoals + milestoneClaims;
  const reached = seasonTier(profile);
  const claimed = new Set(seasonState(profile).claimedTiers ?? []);
  const seasons = Array.from({ length: reached }, (_, i) => i + 1).filter(tier => !claimed.has(tier)).length + (freePackStatus(profile).available ? 1 : 0);
  return { boosters, challenges, seasons };
}
function attentionBadge(key) { const count = attentionState()[key] ?? 0; return count > 0 ? `<i class="attention-badge">${count > 99 ? '99+' : count}</i>` : ''; }
function attentionClass(key) { return (attentionState()[key] ?? 0) > 0 ? 'has-attention' : ''; }
function syncMobileAttentionBadges() {
  const mobileNav = document.querySelector("#mobile-game-nav");
  if (!mobileNav || !profile) return;
  const notices = attentionState();
  mobileNav.querySelectorAll("[data-mobile-nav]").forEach(button => {
    const key = button.dataset.mobileNav === "boosters" ? "boosters" : button.dataset.mobileNav === "challenges" ? "challenges" : button.dataset.mobileNav === "seasons" ? "seasons" : null;
    const count = key ? notices[key] ?? 0 : 0;
    button.classList.toggle("has-attention", count > 0);
    let badge = button.querySelector(".nav-attention-badge");
    if (count > 0 && !badge) { badge = document.createElement("i"); badge.className = "nav-attention-badge"; button.appendChild(badge); }
    if (badge && count > 0) badge.textContent = count > 99 ? "99+" : String(count);
    if (badge && count < 1) badge.remove();
  });
}

function setChrome({ hideTopbar = false } = {}) {
  document.body.dataset.screen = screen;
  document.body.dataset.mode = activeMode ?? "";
  scrollNewScreenToTop();

  const bar = document.querySelector("#app-topbar");
  if (bar) {
    const chromeHiddenScreens = new Set(["splash", "starter", "match", "unlock-celebration"]);
    const showBar = !hideTopbar && !!profile && !chromeHiddenScreens.has(screen);
    bar.hidden = !showBar;
    bar.style.display = showBar ? "" : "none";
    bar.setAttribute("aria-hidden", showBar ? "false" : "true");
    if (showBar) {
      const progress = seasonLevelProgress(profile);
      const packCount = openablePackCount(profile);
      const tierLabel = progress.tier >= SEASON_TIER_COUNT ? `TIER ${SEASON_TIER_COUNT}` : `TIER ${Math.max(0, progress.tier)}`;
      const tierNode = bar.querySelector("[data-chrome-tier]");
      const tierBar = bar.querySelector("[data-chrome-tier-bar]");
      const packNode = bar.querySelector("[data-chrome-packs]");
      const upNode = bar.querySelector("[data-chrome-up]");
      if (tierNode) tierNode.textContent = tierLabel;
      if (tierBar) tierBar.style.width = `${Math.max(0, Math.min(100, progress.percent ?? 0))}%`;
      if (packNode) packNode.textContent = String(packCount);
      if (upNode) upNode.textContent = Number(profile.universePoints ?? 0).toLocaleString();
      bar.classList.toggle("has-season-reward", (attentionState().seasons ?? 0) > 0);
      bar.classList.toggle("has-pack-reward", packCount > 0);
    }
  }

  const mobileNav = document.querySelector("#mobile-game-nav");
  if (mobileNav) {
    const navScreens = new Set(["menu", "play-menu", "setup", "king-of-the-ring", "ladder", "championship", "collection", "catalogue", "boosters", "store", "challenges", "seasons", "deck-builder", "profile", "rules", "options"]);
    mobileNav.hidden = !profile || !navScreens.has(screen);
    const activeTarget = screen === "setup" || screen === "king-of-the-ring" || screen === "championship" ? "play-menu" : screen === "ladder" ? "challenges" : screen === "deck-builder" ? "deck-builder" : screen === "catalogue" ? "catalogue" : screen === "collection" ? "collection" : screen === "rules" ? "profile" : screen;
    const notices = attentionState();
    mobileNav.querySelectorAll("[data-mobile-nav]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.mobileNav === activeTarget);
      button.setAttribute("aria-current", button.dataset.mobileNav === activeTarget ? "page" : "false");
      const key = button.dataset.mobileNav === "boosters" ? "boosters" : button.dataset.mobileNav === "challenges" ? "challenges" : button.dataset.mobileNav === "seasons" ? "seasons" : null;
      const count = key ? notices[key] ?? 0 : 0;
      button.classList.toggle("has-attention", count > 0);
      let badge = button.querySelector(".nav-attention-badge");
      if (count > 0 && !badge) { badge = document.createElement("i"); badge.className = "nav-attention-badge"; button.appendChild(badge); }
      if (badge && count > 0) badge.textContent = count > 99 ? "99+" : String(count);
      if (badge && count < 1) badge.remove();
    });
  }
}

function showSplash() { screen = "splash"; message = ""; renderSplash(); }
function showMainMenu() {
  if (!profile) { screen = "starter"; message = ""; renderStarter(); return; }
  screen = "menu"; message = ""; renderMainMenu();
}
function showPlayMenu() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  screen = "play-menu"; message = ""; renderPlayMenu();
}
function showProfile() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  screen = "profile"; message = ""; renderProfile();
}
function showRules() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  screen = "rules"; message = ""; renderRules();
}

function startMatch(p1Id = selection.p1, p2Id = selection.p2, { mode = "exhibition", modifier = null, eventMeta = null } = {}) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  const p1Star = superstarWithConfiguredEntrance(p1Id), p2Star = superstarById[p2Id];
  if (!p1Star || !p2Star) { message = "That Superstar is not active in this build."; renderSetup(); return; }
  const p1Deck = buildPlayableDeck(profile, p1Id), p2Deck = decks[p2Id] ?? [];
  if (p1Deck.length !== 60 || p2Deck.length !== 60) { message = "One of these Superstar decks is not yet complete."; renderSetup(); return; }
  activeMode = mode;
  selection = { p1: p1Id, p2: p2Id };
  lastMatchup = { ...selection };
  matchRewarded = false;
  flippedHandCards = new Set();
  playPileFlipped = false;
  superstarOverlayId = null;
  superstarOverlayFlipped = false;
  matchPresentationSetId = eventMeta?.rewardSetId ?? randomMatchPresentationSet();
  pendingMatch = { p1Id, p2Id, mode, p1Star, p2Star, p1Deck, p2Deck, brandSetId: matchPresentationSetId, modifier, eventMeta };
  screen = "matchup";
  message = "";
  renderMatchupSplash();
}

function createPendingMatchEngine() {
  if (!pendingMatch) return false;
  const { p1Star, p2Star, p1Deck, p2Deck, modifier } = pendingMatch;
  game = new MatchEngine({ p1: p1Star, p2: p2Star, decks: { [p1Star.id]: p1Deck, [p2Star.id]: p2Deck } });
  if (modifier) game.applyMatchModifier(modifier);
  return true;
}

function renderMatchupSplash() {
  if (!pendingMatch) { showSetup(); return; }
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const { p1Star, p2Star, brandSetId, eventMeta } = pendingMatch;
  const p1Card = superstarCollectibleFor(p1Star.id);
  const p2Card = superstarCollectibleFor(p2Star.id);
  const prematchEyebrow = eventMeta ? ((eventMeta.logoMode && eventMeta.logoMode !== "legacy") ? "LIVE EVENT" : eventMeta.eventName.toUpperCase()) : "TONIGHT’S";
  root.innerHTML = `<section class="prematch-screen matchup-splash ${presentationThemeClass(brandSetId)}">
    <div class="prematch-brand">${setLogoMarkup(brandSetId, "prematch-show-logo")}</div>
    <div class="prematch-heading ${eventMeta ? "has-live-event-meta" : ""}"><span>${prematchEyebrow}</span><h2>${eventMeta ? `MATCH ${eventMeta.stageIndex + 1} OF ${LIVE_EVENT_LENGTH}` : "MAIN EVENT"}</h2></div>
    <div class="prematch-versus">
      <article class="prematch-side player-side"><span class="prematch-side-label">YOU</span><div class="prematch-superstar-card">${p1Card ? collectibleCardMarkup(p1Card,{extraClass:"matchup-superstar-card"}) : superstarVisualMarkup(p1Star.id,p1Star.name)}</div></article>
      <div class="prematch-vs">VS</div>
      <article class="prematch-side cpu-side"><span class="prematch-side-label">CPU</span><div class="prematch-superstar-card">${p2Card ? collectibleCardMarkup(p2Card,{extraClass:"matchup-superstar-card"}) : superstarVisualMarkup(p2Star.id,p2Star.name)}</div></article>
    </div>
    <button id="begin-entrances" class="start-match prematch-start">Start Match</button>
    ${eventMeta ? `<div class="prematch-live-event-rule prematch-live-event-rule-below"><span>${eventMeta.stageLabel}</span><strong>${eventMeta.ruleName}</strong><small>${eventMeta.ruleText}</small></div>` : ""}
  </section>`;
  $("#begin-entrances")?.addEventListener("click", () => {
    if (!createPendingMatchEngine()) return;
    entranceIntroPlayerId = HUMAN;
    entranceIntroFlipped = false;
    entranceIntroRevealed = false;
    screen = "entrance-intro";
    renderEntranceIntro();
  });
}

function renderEntranceIntro() {
  if (!game || !entranceIntroPlayerId) { renderMatchupSplash(); return; }
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const player = game.state().players[entranceIntroPlayerId];
  const star = player.superstar;
  const starCard = superstarCollectibleFor(star.id);
  const entranceCard = collectionById.get(star.entranceId) ?? entranceCollectibleFor(star.id);
  const isHuman = entranceIntroPlayerId === HUMAN;
  const callouts = entranceEffectCallouts(star);
  const brandSetId = pendingMatch?.brandSetId ?? matchPresentationSetId ?? star.setId;
  root.innerHTML = `<section class="prematch-screen entrance-intro-screen ${presentationThemeClass(brandSetId)}">
    <div class="entrance-hero-band">
      <div class="prematch-brand">${setLogoMarkup(brandSetId, "prematch-show-logo")}</div>
      <div class="entrance-crowd-chants ${entranceIntroRevealed ? "entrance-revealed" : ""}">${callouts.map((text,index)=>`<span class="entrance-callout callout-${index+1}">${text}</span>`).join("")}</div>
      <div class="entrance-intro-heading"><span>${isHuman ? "YOUR ENTRANCE" : "OPPONENT ENTRANCE"}</span><h2>${star.name}</h2></div>
    </div>
    <div class="entrance-stage ${entranceIntroRevealed ? "entrance-revealed" : ""}">
      <div class="entrance-card-transition intro-superstar-layer">${starCard ? collectibleCardMarkup(starCard,{extraClass:"intro-superstar-card"}) : superstarVisualMarkup(star.id,star.name)}</div>
      <div class="entrance-card-transition intro-entrance-layer">${entranceCard ? collectibleCardMarkup(entranceCard,{flipped:entranceIntroFlipped,extraClass:"intro-main-card",flipAttr:'data-flip-entrance="1"'}) : `<div class="entrance-card-fallback"><b>${star.entrance?.name ?? "Entrance"}</b><p>${star.entrance?.rulesText ?? ""}</p></div>`}</div>
    </div>
    <small class="entrance-tap-hint ${entranceIntroRevealed ? "is-visible" : ""}">Tap the Entrance card to ${entranceIntroFlipped ? "return to artwork" : "flip and view effects"}.</small>
    <button id="entrance-next" class="start-match prematch-start ${entranceIntroRevealed ? "is-visible" : ""}">Next</button>
  </section>`;
  if (!entranceIntroRevealed) {
    if (entranceRevealTimer) clearTimeout(entranceRevealTimer);
    const revealPlayerId = entranceIntroPlayerId;
    entranceRevealTimer = setTimeout(() => {
      if (screen !== "entrance-intro" || entranceIntroPlayerId !== revealPlayerId || entranceIntroRevealed) return;
      root.querySelector(".entrance-stage")?.classList.add("entrance-revealed");
      root.querySelector(".entrance-crowd-chants")?.classList.add("entrance-revealed");
      root.querySelector(".entrance-tap-hint")?.classList.add("is-visible");
      root.querySelector("#entrance-next")?.classList.add("is-visible");
      entranceIntroRevealed = true;
      entranceRevealTimer = null;
    }, 1750);
  }
  root.querySelectorAll("[data-flip-entrance]").forEach(btn => btn.addEventListener("click", () => { entranceIntroFlipped = !entranceIntroFlipped; renderEntranceIntro(); }));
  $("#entrance-next")?.addEventListener("click", () => {
    if (isHuman) { entranceIntroPlayerId = CPU; entranceIntroFlipped = false; entranceIntroRevealed = false; renderEntranceIntro(); return; }
    entranceIntroPlayerId = null;
    entranceIntroFlipped = false;
    entranceIntroRevealed = false;
    pendingMatch = null;
    screen = "match";
    advanceCpuUntilHuman(game, HUMAN, CPU);
    render();
  });
}

function restartMatch() { if (activeMode === "live-event") { startCurrentLiveEventMatch(activeLiveEventTowerKey); return; } if (activeMode === "king-of-the-ring") { startCurrentKingOfTheRingMatch(); return; } if (activeMode === "ladder") { startCurrentLadderMatch(); return; } startMatch(lastMatchup.p1, lastMatchup.p2, { mode: activeMode }); }
function showSetup() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  activeMode = "exhibition";
  screen = "setup";
  message = "";
  pendingMatch = null;
  game = null;
  exhibitionConfirmed = { p1: false, p2: true };
  selectDetailKeys = new Set();
  const owned = orderedUnlockedSuperstars();
  if (!owned.some(s => s.id === selection.p1)) selection.p1 = owned[0]?.id ?? profile.starterId;
  selection.p2 = null;
  renderSetup();
}
function showKingOfTheRing() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "king-of-the-ring"; message = ""; setChrome(); renderKingOfTheRing(); }
function showLadder() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "ladder"; message = ""; setChrome(); renderLadder(); }
function showChampionship() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "championship"; message = ""; setChrome(); renderChampionship(); }
function showLiveEvents() { if (!profile) { screen = "starter"; renderStarter(); return; } selectedLiveEventKey = null; screen = "live-events"; message = ""; setChrome(); renderLiveEvents(); }
function showLiveEventTower(towerKey) { if (!profile) { screen = "starter"; renderStarter(); return; } selectedLiveEventKey = towerKey; screen = "live-events"; message = ""; setChrome(); renderLiveEvents(); }
function showCollection() { showOwnedCollection(); }
function showOwnedCollection() {
  collectionView = "owned";
  collectionFiltersOpen = false;
  lastChromeScreen = null;
  activeCollectionSetId = "all";
  collectionFilter = { kind: "all", rarity: "all", search: "" };
  flippedCollectionCards = new Set();
  screen = "collection"; message = ""; setChrome(); renderCollection();
}
function showCardCatalogue() {
  collectionView = "catalogue";
  catalogueFiltersOpen = false;
  lastChromeScreen = null;
  catalogueFilter = defaultCatalogueFilters();
  cataloguePage = 1;
  flippedCatalogueCards = new Set();
  screen = "catalogue"; message = ""; setChrome(); renderCardCatalogue();
}
function entranceFor(starId) { const star=superstarById[starId]; return star?.entrance ?? null; }
function showBoosters() { screen = "boosters"; message = ""; setChrome(); renderBoosters(); }
function showStore() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "store"; message = ""; setChrome(); renderStore(); }
function showBoosterSet(setId) {
  activeBoosterSetId = setId;
  lastPack = null;
  pendingUpgrades = [];
  packStage = "idle";
  revealedPackCards = new Set();
  boosterRulesFlipped = new Set();
  boosterFocusIndex = 0;
  screen = "boosters";
  message = "";
  renderBoosters();
}
function showChallenges() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "challenges"; message = ""; setChrome(); renderChallenges(); }
function showSeasons() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "seasons"; message = ""; setChrome(); renderSeasons(); }
function showDeckBuilder(starId = null) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  const unlocked = profile.unlockedSuperstars ?? [];
  if (starId && unlocked.includes(starId)) {
    deckBuilderStarId = starId;
    deckDraft = createDeckDraft(profile, deckBuilderStarId);
    deckLabEntranceId = selectedEntranceId(profile, deckBuilderStarId);
    deckLabStage = "editor";
  } else if (unlocked.length === 1) {
    deckBuilderStarId = unlocked[0];
    deckDraft = createDeckDraft(profile, deckBuilderStarId);
    deckLabEntranceId = selectedEntranceId(profile, deckBuilderStarId);
    deckLabStage = "editor";
  } else {
    deckBuilderStarId = unlocked.includes(deckBuilderStarId) ? deckBuilderStarId : (unlocked[0] ?? profile.starterId);
    deckDraft = null;
    deckLabEntranceId = null;
    deckLabStage = "roster";
  }
  deckLabPicker = null;
  deckLabOnlyValid = false;
  deckBuilderFilter = "";
  deckLabInspectCardId = null;
  deckLabInspectFlipped = false;
  screen = "deck-builder";
  message = "";
  setChrome();
  renderDeckBuilder();
}

function cardById(id) { return collectionCards.find(card => card.id === id) ?? Object.values(decks).flat().find(card => card.id === id) ?? null; }
function beginUnlockCelebration(returnScreen = screen) {
  const queue = profile?.pendingUnlockCelebrations ?? [];
  if (!queue.length) return false;
  unlockCelebrationReturnScreen ??= returnScreen;
  unlockCelebration = queue[0];
  unlockCelebrationIndex = 0;
  screen = "unlock-celebration";
  renderUnlockCelebration();
  return true;
}
function renderUnlockCelebration() {
  setChrome({ hideTopbar: true });
  const root = $("#game"), event = unlockCelebration;
  if (!event) { showCollection(); return; }
  const star = superstarById[event.superstarId];
  const card = superstarCollectibleFor(event.superstarId) ?? cardById(`superstar-${event.superstarId}`);
  if (!star || !card) { finishUnlockCelebration(false); return; }
  const set = sets[star.setId];
  const rarity = Math.max(1, Math.min(4, Number(card.rarity ?? 4)));
  const savedUnlockDeck = profile?.savedDecks?.[event.superstarId];
  const deckReady = Array.isArray(savedUnlockDeck) && savedUnlockDeck.length === 60;
  const deckNeeds = Math.max(0, Number(profile?.deckNeedsCards?.[event.superstarId] ?? event.recommendedMissing ?? (deckReady ? 0 : 60)) || 0);
  const unlockCopy = deckReady
    ? `${star.nickname ? `${star.nickname} joins your WWE Legacy roster.` : `${star.name} joins your WWE Legacy roster.`} Your existing owned deck is ready.${deckNeeds ? ` Deck Lab is tracking ${deckNeeds} recommended upgrade slot${deckNeeds===1?'':'s'} as your Collection grows.` : ' You already own the complete recommended build.'}`
    : `${star.nickname ? `${star.nickname} joins your WWE Legacy roster.` : `${star.name} joins your WWE Legacy roster.`} Their core identity cards have been added to your Collection. Open Deck Lab to build toward the recommended deck using cards you already own.`;
  const deckStatus = deckReady ? 'READY TO PLAY' : 'BUILD FROM COLLECTION';
  const footnote = deckReady ? 'Superstar unlocked permanently · Recommended Build tracking active' : 'Superstar unlocked permanently · No filler cards granted · Build with your Collection';
  root.innerHTML = `<section class="superstar-unlock-showcase set-${star.setId}">
    <div class="superstar-unlock-effects" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
    <div class="superstar-unlock-watermark" aria-hidden="true">UNLOCKED</div>
    <section class="superstar-unlock-stage">
      <div class="superstar-unlock-copy">
        <span class="superstar-unlock-kicker">NEW SUPERSTAR</span>
        <strong class="superstar-unlock-headline">YOU'VE<br>UNLOCKED</strong>
        <h1>${star.name}</h1>
        <p>${unlockCopy}</p>
        <div class="superstar-unlock-meta"><span>${set?.displayName ?? set?.name ?? star.setId}</span><b>${'★'.repeat(rarity)}</b><em class="superstar-unlock-status ${deckReady ? 'ready' : 'needs-build'}">${deckStatus}</em></div>
      </div>
      <div class="superstar-unlock-card-shell">
        <div class="superstar-unlock-halo" aria-hidden="true"></div>
        ${superstarPreviewCardMarkup(star.id,"superstar-unlock-card")}
      </div>
      <div class="superstar-unlock-actions">
        <button id="unlock-deck-lab" class="start-match superstar-unlock-primary">OPEN IN DECK LAB</button>
        <button id="unlock-continue" class="nav-button superstar-unlock-secondary">CONTINUE</button>
      </div>
      <small class="superstar-unlock-footnote">${footnote}</small>
    </section>
  </section>`;
  $("#unlock-deck-lab")?.addEventListener("click",()=>finishUnlockCelebration(true));
  $("#unlock-continue")?.addEventListener("click",()=>finishUnlockCelebration(false));
}
function returnFromUnlockCelebration() {
  const target = unlockCelebrationReturnScreen;
  unlockCelebrationReturnScreen = null;
  if (target === "store") return showStore();
  if (target === "seasons") return showSeasons();
  if (target === "boosters") return showBoosters();
  if (target === "ladder") return showLadder();
  if (target === "championship") return showChampionship();
  if (target === "live-events") return showLiveEvents();
  if (target === "menu") return showMainMenu();
  return showCollection();
}
function finishUnlockCelebration(openDeckLab = false) {
  const starId = unlockCelebration?.superstarId;
  profile.pendingUnlockCelebrations ??= [];
  profile.pendingUnlockCelebrations.shift();
  saveProfile(profile);
  unlockCelebration = null;
  unlockCelebrationIndex = 0;
  if (openDeckLab && starId) {
    unlockCelebrationReturnScreen = null;
    showDeckBuilder(starId);
    return;
  }
  // Pack-pulled Superstar celebrations are tied to the reveal position that
  // actually produced them. Do not chain a later Superstar from the same pack
  // before its card is reached; return to the reveal and let that card trigger
  // its own celebration. Other unlock sources can still drain their queue.
  if (profile.pendingUnlockCelebrations.length && !(unlockCelebrationReturnScreen === "boosters" && packStage === "reveal")) {
    beginUnlockCelebration(unlockCelebrationReturnScreen ?? "collection");
    return;
  }
  returnFromUnlockCelebration();
}


function processPack(kind = "standard") {
  try {
    currentPackType = kind;
    lastPack = kind === "super" ? openSuperPack(profile, Math.random, activeBoosterSetId) : kind === "ladder" ? openLadderCompletionPack(profile, Math.random, activeBoosterSetId) : kind === "championship" ? openChampionshipPack(profile, Math.random, activeBoosterSetId) : openBooster(profile, Math.random, activeBoosterSetId);
    if (lastPack?.[0]?.card?.setId) activeBoosterSetId = lastPack[0].card.setId;
    pendingUpgrades = []; appliedPackUpgrades = []; revealedPackCards = new Set(); boosterRulesFlipped = new Set(); boosterInspectIndex = null; boosterInspectFlipped = false; convertedPackCards = new Set(); boosterFocusIndex = 0; packFinalized = false; packStage = "sealed";
    const setName = setCollections[activeBoosterSetId]?.displayName ?? activeBoosterSetId;
    message = `${setName} pack ready. Tap the pack to rip it open.`;
    saveProfile(profile); renderBoosters();
  } catch (error) { message = error.message; renderBoosters(); }
}

function scheduleFocusedDuplicateConversion() {
  if (duplicateConversionTimer) { clearTimeout(duplicateConversionTimer); duplicateConversionTimer = null; }
  if (packStage !== "reveal" || !lastPack?.[boosterFocusIndex]) return;
  const index = boosterFocusIndex, pull = lastPack[index];
  if (!pull.universePointsValue || pull.universePointsCredited || convertedPackCards.has(index)) return;
  duplicateConversionTimer = setTimeout(() => {
    duplicateConversionTimer = null;
    if (packStage !== "reveal" || lastPack?.[index] !== pull) return;
    finalizePackUniversePoints(profile, [pull]);
    convertedPackCards.add(index);
    saveProfile(profile);
    const up = document.querySelector('[data-chrome-up]');
    if (up) up.textContent = Number(profile.universePoints ?? 0).toLocaleString();
    up?.classList.add('up-conversion-pulse');
    renderBoosters();
    setTimeout(() => document.querySelector('[data-chrome-up]')?.classList.remove('up-conversion-pulse'), 650);
  }, 1050);
}

function maybeCelebrateFocusedSuperstarPull(delay = 260) {
  const pull = lastPack?.[boosterFocusIndex];
  const sid = pull?.superstarUnlocked ? pull.card?.superstarId : null;
  if (!sid) return false;
  const queued = profile?.pendingUnlockCelebrations?.some(event => event?.superstarId === sid);
  if (!queued) return false;
  saveProfile(profile);
  setTimeout(() => {
    if (screen !== "boosters" || packStage !== "reveal" || lastPack?.[boosterFocusIndex] !== pull) return;
    beginUnlockCelebration("boosters");
  }, delay);
  return true;
}

function ripOpenPack() {
  if (packStage !== "sealed" || !lastPack?.length) return;
  packStage = "opening";
  message = "RIPPING PACK…";
  renderBoosters();
  setTimeout(() => {
    if (screen !== "boosters" || packStage !== "opening") return;
    // Once the wrapper is open, the whole pack is face up. Browsing cards never
    // returns the next pull to a generic card back.
    revealedPackCards = new Set(lastPack.map((_, index) => index));
    packStage = "reveal";
    message = "Pack open — all five cards are face up.";
    renderBoosters();
    scheduleFocusedDuplicateConversion();
    maybeCelebrateFocusedSuperstarPull(300);
  }, 720);
}

function preparePackSummary() {
  if (!lastPack?.length || revealedPackCards.size !== lastPack.length) return;
  const converted = finalizePackUniversePoints(profile, lastPack);
  packStage = "summary";
  packFinalized = false;
  pendingUpgrades = [];
  message = converted ? `Pack complete — excess copies converted into +${converted} Universe Points.` : "Pack complete — review everything you acquired.";
  saveProfile(profile);
  renderBoosters();
}

function beginPackUpgradeReview() {
  if (!lastPack?.length) return;
  pendingUpgrades = findPackUpgrades(profile, lastPack);
  if (!pendingUpgrades.length) {
    packFinalized = true;
    finishPackFlow();
    return;
  }
  packFinalized = true;
  packStage = "upgrades";

  if (profile.deckAssistance === "auto") {
    let count = 0;
    appliedPackUpgrades = [];
    for (const upgrade of pendingUpgrades) { if (applyUpgrade(profile, upgrade)) { appliedPackUpgrades.push(upgrade); count += 1; } }
    pendingUpgrades = [];
    message = count ? `${count} safe roster/deck upgrade${count===1?"":"s"} applied automatically.` : "No safe roster/deck upgrades found from this pack.";
  } else if (profile.deckAssistance === "manual") {
    message = pendingUpgrades.length ? `${pendingUpgrades.length} safe deck suggestion${pendingUpgrades.length===1?"":"s"} found. Manual mode will not change the deck.` : "Deck Assistance is Manual. No safe deck suggestions were found from this pack.";
  } else {
    message = pendingUpgrades.length
      ? `${pendingUpgrades.length} roster/deck upgrade suggestion${pendingUpgrades.length===1?"":"s"} found from this pack.`
      : "No safe roster/deck upgrades found from this pack.";
  }
  saveProfile(profile);
  renderBoosters();
}

function nextBoosterCard() {
  if (!lastPack?.length || !revealedPackCards.has(boosterFocusIndex)) return;
  const current = lastPack[boosterFocusIndex];
  // Let the duplicate visibly dissolve into its UP reward before advancing.
  if (current?.universePointsValue && !current.universePointsCredited) return;
  if (boosterFocusIndex < lastPack.length - 1) {
    boosterFocusIndex += 1;
    boosterRulesFlipped.delete(boosterFocusIndex);
    renderBoosters();
    scheduleFocusedDuplicateConversion();
    maybeCelebrateFocusedSuperstarPull(240);
  } else {
    preparePackSummary();
  }
}

function acceptUpgrade(index) {
  const upgrade=pendingUpgrades[index];
  if(!upgrade)return;
  if (applyUpgrade(profile,upgrade)) {
    appliedPackUpgrades.push(upgrade);
    pendingUpgrades.splice(index,1);
    saveProfile(profile);
    message="Deck upgrade applied.";
  } else message="That upgrade is no longer available with the current deck.";
  renderBoosters();
}
function declineUpgrade(index) {
  pendingUpgrades.splice(index,1);
  message="Upgrade skipped. The card remains in your collection.";
  renderBoosters();
}

function finishPackFlow() {
  const returnScreen = boosterReturnScreen;
  boosterReturnScreen = null;
  lastPack=null; revealedPackCards=new Set(); boosterRulesFlipped=new Set(); boosterInspectIndex=null; boosterInspectFlipped=false; convertedPackCards=new Set(); boosterFocusIndex=0; pendingUpgrades=[]; appliedPackUpgrades=[]; packStage="idle"; currentPackType="standard"; message="";
  document.body.classList.remove("booster-modal-open");
  if (returnScreen === "seasons") { screen = "seasons"; renderSeasons(); } else { screen = "boosters"; renderBoosters(); }
  requestAnimationFrame(()=>window.scrollTo(0,0));
}

function boosterInspectOverlayMarkup(pulls = lastPack ?? []) {
  const pull = Number.isInteger(boosterInspectIndex) ? pulls[boosterInspectIndex] : null;
  if (!pull?.card || packStage === "idle" || packStage === "reveal") return "";
  const instruction = `Tap card to ${boosterInspectFlipped ? "show front" : "view effects"} · Tap outside to close`;
  return `<div class="superstar-card-modal deck-lab-card-modal booster-card-inspect-modal" data-booster-inspect-modal-backdrop="1"><div class="superstar-card-modal-inner deck-lab-card-modal-inner"><button type="button" class="deck-lab-card-modal-close" data-close-booster-inspect="1" aria-label="Close card inspector">×</button>${collectibleCardMarkup(pull.card,{flipped:boosterInspectFlipped,foil:pull.foil,extraClass:"hud-superstar-modal-card deck-lab-inspect-card booster-inspect-card",flipAttr:'data-flip-booster-inspect="1"'})}<small>${instruction}</small></div></div>`;
}

function renderBoosters() {
  const root=$("#game"), pulls=lastPack??[];
  const packInProgress = pulls.length > 0 && packStage !== "idle";
  const setInfo=setCollections[activeBoosterSetId]??setCollection;
  const standardCredits=boosterCreditsFor(profile,activeBoosterSetId);
  const ladder=ladderState(profile), road=championshipRoadState(profile);
  const superPacks=superPackCreditsFor(profile,activeBoosterSetId), ladderPacks=ladder.completionPackCreditsBySet?.[activeBoosterSetId]??0, championshipPacks=road.championshipPackCreditsBySet?.[activeBoosterSetId]??0;
  const packTitle=currentPackType==="super"?"SUPER PACK":currentPackType==="ladder"?"MONEY IN THE BANK":currentPackType==="championship"?"CHAMPIONSHIP ROAD":setInfo.name.toUpperCase();
  const packWrapperTitle=currentPackType==="standard"?"SERIES 1":"SUPER PACK";
  const packSubtitle=currentPackType==="super"?"BOOSTED ODDS · 1 FOIL · 1 RARE+":currentPackType==="ladder"?"LEGACY SUPER PACK · 1 FOIL · 1 RARE+":currentPackType==="championship"?"LEGACY SUPER PACK · 1 FOIL · 1 RARE+":"SERIES 1 · 5 CARDS · 1 GUARANTEED FOIL";
  const brand=setLogoMarkup(activeBoosterSetId,"pack-set-logo") || `<span class="pack-text-logo"><b>${setInfo.name.toUpperCase()}</b><small>SERIES 1</small></span>`;
  const packSetClass=`pack-set-${activeBoosterSetId}`;

  document.body.classList.toggle("booster-modal-open", packInProgress);
  const mobileNav=document.querySelector("#mobile-game-nav");
  if (mobileNav) mobileNav.hidden=packInProgress;

  const rarityName = pull => (setCollections[pull?.card?.setId]?.rarityLabels ?? setInfo.rarityLabels)?.[pull?.card?.rarity ?? 1] ?? "Common";
  const upRewardTile = (p, extraClass="", actionAttr="") => `<button type="button" class="up-card-replacement ${extraClass}" ${actionAttr} aria-label="${p.foil ? "Foil duplicate" : "Duplicate"} converted to ${p.universePointsValue} Universe Points"><span>${p.foil ? "FOIL DUPLICATE" : "DUPLICATE CONVERTED"}</span><strong>+${p.universePointsValue}</strong><b>UP</b><small>UNIVERSE POINTS</small></button>`;
  const summaryCard = (p,index,slotClass="") => `
    <article class="pack-summary-card actual-card-summary ${slotClass} rarity-${p.card.rarity} ${p.foil?'is-foil':''} ${p.universePointsValue?'is-up-converted':''}">
      <div class="pack-summary-actual-card">${p.universePointsValue ? upRewardTile(p,"summary-up-reward",`data-booster-inspect="${index}"`) : collectibleCardMarkup(p.card,{flipped:false,foil:p.foil,extraClass:"pack-summary-ccg",flipAttr:`data-booster-inspect="${index}"`})}</div>
      <div class="pack-summary-badges">${p.universePointsValue ? `<span class="up-conversion-badge">+${p.universePointsValue} UP</span>` : `<span class="summary-rarity-badge">${rarityName(p)}</span>${p.foil?'<span class="foil-summary-symbol">FOIL</span>':''}${p.isNewCard?'<span class="new-card-symbol">NEW</span>':''}${p.superstarUnlocked?'<span class="unlock-symbol">SUPERSTAR</span>':''}`}</div>
    </article>`;
  const summarySlots = ["summary-top-left","summary-top-right","summary-center","summary-bottom-left","summary-bottom-right"];
  const featuredSummaryIndex = pulls.reduce((bestIndex,p,index) => {
    if (bestIndex < 0) return index;
    const best = pulls[bestIndex];
    const rarityDelta = Number(p?.card?.rarity ?? 0) - Number(best?.card?.rarity ?? 0);
    if (rarityDelta !== 0) return rarityDelta > 0 ? index : bestIndex;
    const newDelta = Number(Boolean(p?.isNewCard)) - Number(Boolean(best?.isNewCard));
    if (newDelta !== 0) return newDelta > 0 ? index : bestIndex;
    const foilDelta = Number(Boolean(p?.foil)) - Number(Boolean(best?.foil));
    if (foilDelta !== 0) return foilDelta > 0 ? index : bestIndex;
    return bestIndex;
  }, -1);
  const outerSummaryEntries = pulls.map((p,index)=>({p,index})).filter(entry=>entry.index!==featuredSummaryIndex);
  const featuredSummaryEntry = featuredSummaryIndex >= 0 ? { p: pulls[featuredSummaryIndex], index: featuredSummaryIndex } : null;
  const summaryLayout = [
    outerSummaryEntries[0] ? {...outerSummaryEntries[0],slot:summarySlots[0]} : null,
    outerSummaryEntries[1] ? {...outerSummaryEntries[1],slot:summarySlots[1]} : null,
    featuredSummaryEntry ? {...featuredSummaryEntry,slot:summarySlots[2]} : null,
    outerSummaryEntries[2] ? {...outerSummaryEntries[2],slot:summarySlots[3]} : null,
    outerSummaryEntries[3] ? {...outerSummaryEntries[3],slot:summarySlots[4]} : null,
  ].filter(Boolean);
  const compactSummaryThumbs = summaryLayout.map(({p,index,slot})=>summaryCard(p,index,slot)).join("");

  let packArea = "";
  if (packStage === "sealed") {
    packArea=`<section class="pack-opening-stage sealed-pack-stage"><button type="button" id="rip-pack" class="sealed-pack-button" aria-label="Rip open ${setInfo.displayName} pack">${physicalBoosterPackMarkup({setId:activeBoosterSetId,title:packTitle,series:packWrapperTitle,subtitle:packSubtitle,extraClass:"sealed-pack"})}<strong>TAP TO RIP</strong><small>Open the pack and reveal all five cards</small></button></section>`;
  } else if (packStage === "opening") {
    packArea=`<section class="pack-opening-stage ripping-pack-stage"><div class="pack-rip-flash"></div>${physicalBoosterPackMarkup({setId:activeBoosterSetId,title:packTitle,series:packWrapperTitle,subtitle:packSubtitle,extraClass:"is-opening",opening:true})}<strong class="pack-rip-callout">RIP!</strong></section>`;
  } else if (packStage === "reveal" && pulls.length) {
    const p=pulls[boosterFocusIndex];
    const converted=convertedPackCards.has(boosterFocusIndex) || p.universePointsCredited;
    const converting=Boolean(p.universePointsValue && !converted);
    const cardMarkup = converted
      ? upRewardTile(p,"reveal-up-reward",`data-booster-next="${boosterFocusIndex}"`)
      : `<div class="booster-flip-card single-pack-card is-revealed is-current rarity-${p.card.rarity} ${p.foil?'is-foil':''} ${converting?'duplicate-disintegrating':''}">
          ${collectibleCardMarkup(p.card,{flipped:false,foil:p.foil,extraClass:"booster-ccg",flipAttr:`data-booster-next="${boosterFocusIndex}"`})}
          ${converting?`<div class="duplicate-conversion-overlay" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><strong>DUPLICATE</strong><span>CONVERTING TO UP</span></div>`:''}
        </div>`;
    const dots=pulls.map((_,i)=>`<i class="${i===boosterFocusIndex?'current':''} revealed ${pulls[i]?.universePointsValue?'converted':''}"></i>`).join("");
    packArea=`<section class="single-card-reveal-stage rarity-stage-${p.card.rarity} card-is-revealed ${p.foil ? 'foil-stage' : ''} ${converting?'duplicate-conversion-stage':''} ${converted?'up-reward-stage':''}">
      <div class="booster-reveal-atmosphere" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="booster-card-progress"><span>CARD ${boosterFocusIndex+1} OF ${pulls.length}</span><div>${dots}</div></div>
      <div class="single-card-slot"><div class="booster-card-halo">${cardMarkup}</div></div>
      <div class="booster-reveal-meta">${converted?`<strong class="booster-reveal-rarity up-rarity">+${p.universePointsValue} UP</strong><span class="booster-reveal-flags"><b>DUPLICATE CONVERTED</b></span>`:`<strong class="booster-reveal-rarity rarity-${p.card.rarity}">${rarityName(p).toUpperCase()}</strong><span class="booster-reveal-flags">${p.foil?'<b>FOIL</b>':''}${p.isNewCard?'<b class="is-new">NEW</b>':''}${p.superstarUnlocked?'<b>SUPERSTAR UNLOCK</b>':''}${converting?'<b>CONVERTING</b>':''}</span>`}</div>
      <p class="reveal-progress">${converting?'DUPLICATE · CONVERTING TO UNIVERSE POINTS':boosterFocusIndex===pulls.length-1?'TAP CARD · PACK SUMMARY':'TAP CARD · NEXT CARD'}</p>
    </section>`;
  } else if (packStage === "summary" && pulls.length) {
    const newCount=pulls.filter(p=>p.isNewCard).length;
    const convertedPulls=pulls.filter(p=>p.universePointsValue>0);
    const convertedUp=convertedPulls.reduce((sum,p)=>sum+(p.universePointsValue||0),0);
    packArea=`<section class="pack-summary-screen premium-pack-summary streamlined-pack-summary">
      <div class="pack-complete-hero"><span>PACK COMPLETE</span><h3>${newCount ? `${newCount} NEW CARD${newCount===1?'':'S'}` : 'COLLECTION UPDATED'}${convertedUp ? ` · +${convertedUp} UP` : ''}</h3><p>Your five pulls are below.</p></div>
      <div class="pack-summary-grid pack-summary-pyramid pack-summary-compact-grid">${compactSummaryThumbs}</div>
      <div class="pack-summary-key"><span><b class="new-card-symbol">NEW</b> First time owned</span><span>Tap any card to inspect it.</span></div>
      <div class="pack-summary-actions pack-summary-next-row"><button id="pack-summary-next" class="start-match pack-theme-next">NEXT</button></div>
    </section>`;
  } else if (packStage === "upgrades" && pulls.length) {
    const manual = profile.deckAssistance === "manual";
    const swapMarkup = (u, applied = false, index = -1) => {
      const incoming = u.pull?.card ?? cardById(u.cardId);
      const outgoing = cardById(u.removeId ?? u.cardId);
      const incomingFoil = u.type === 'foil-preference' || !!u.pull?.foil;
      const label = u.type === 'entrance' ? 'ENTRANCE UPGRADE' : u.type === 'foil-preference' ? 'FOIL UPGRADE' : incoming?.finisher ? 'FINISHER UPGRADE' : incoming?.trademark ? 'TRADEMARK UPGRADE' : incoming?.special ? 'SPECIAL UPGRADE' : 'RECOMMENDED BUILD';
      return `<article class="upgrade-row pack-upgrade-swap ${applied?'applied-upgrade-row':''}">
        <header><div><span>${label}</span><b>${superstarById[u.superstarId]?.name ?? 'SUPERSTAR'} DECK</b></div>${applied?'<em>APPLIED</em>':''}</header>
        <div class="upgrade-card-pair">
          <div class="upgrade-card-choice incoming"><small>NEW CARD</small>${incoming ? collectibleCardMarkup(incoming,{flipped:false,foil:incomingFoil,extraClass:'upgrade-swap-card'}) : ''}<strong>${u.addName}</strong></div>
          <div class="upgrade-swap-arrow" aria-hidden="true">→</div>
          <div class="upgrade-card-choice outgoing"><small>REPLACES</small>${outgoing ? collectibleCardMarkup(outgoing,{flipped:false,foil:false,extraClass:'upgrade-swap-card'}) : '<div class="upgrade-card-placeholder">CURRENT SLOT</div>'}<strong>${u.removeName}</strong></div>
        </div>
        <p>${u.reason}</p>
        ${applied || manual ? '' : `<div class="upgrade-choice-actions"><button data-accept-upgrade="${index}" class="primary">${u.type==='entrance'?'EQUIP':u.type==='foil-preference'?'USE FOIL':'APPLY UPGRADE'}</button><button data-decline-upgrade="${index}" class="secondary">KEEP AS-IS</button></div>`}
      </article>`;
    };
    packArea=`<section class="upgrade-panel booster-modal-upgrades focused-pack-upgrades">
      <div class="section-title"><div><span>DECK ASSISTANCE</span><h3>${pendingUpgrades.length ? `${pendingUpgrades.length} recommended replacement${pendingUpgrades.length===1?'':'s'}` : `${appliedPackUpgrades.length} upgrade${appliedPackUpgrades.length===1?'':'s'} applied`}</h3></div><span>${profile.deckAssistance==='auto'?'Auto-upgrade':manual?'Manual mode · suggestions only':'Choose what to change'}</span></div>
      ${appliedPackUpgrades.map((u)=>swapMarkup(u,true)).join('')}
      ${pendingUpgrades.map((u,i)=>swapMarkup(u,false,i)).join('')}
      <button id="finish-pack-review" class="start-match pack-theme-next">${boosterReturnScreen === "seasons" ? "RETURN TO SEASON" : "RETURN TO OPEN PACKS"}</button>
    </section>`;
  }

  const vaultSets = Object.values(launchSetCollections);
  const vaultBuckets = [];
  for (const vaultSet of vaultSets) {
    const standard = boosterCreditsFor(profile, vaultSet.id);
    const superCount = superPackCreditsFor(profile, vaultSet.id);
    const ladderCount = ladder.completionPackCreditsBySet?.[vaultSet.id] ?? 0;
    const championshipCount = road.championshipPackCreditsBySet?.[vaultSet.id] ?? 0;
    if (standard > 0) vaultBuckets.push({ setId:vaultSet.id, type:"standard", count:standard, label:"STANDARD BOOSTER", subtitle:"5 CARDS · 1 GUARANTEED FOIL" });
    if (superCount > 0) vaultBuckets.push({ setId:vaultSet.id, type:"super", count:superCount, label:"SUPER PACK", subtitle:"BOOSTED ODDS · 1 FOIL · 1 RARE+" });
    if (ladderCount > 0) vaultBuckets.push({ setId:vaultSet.id, type:"ladder", count:ladderCount, label:"LEGACY SUPER PACK", subtitle:"BOOSTED ODDS · 1 FOIL · 1 RARE+" });
    if (championshipCount > 0) vaultBuckets.push({ setId:vaultSet.id, type:"championship", count:championshipCount, label:"LEGACY SUPER PACK", subtitle:"BOOSTED ODDS · 1 FOIL · 1 RARE+" });
  }
  const totalVaultPacks = vaultBuckets.reduce((sum,b)=>sum+b.count,0);
  const vaultShelf = vaultBuckets.length ? `<section class="booster-vault-shelf ${vaultBuckets.length === 1 ? "single-pack" : ""}" aria-label="Openable booster packs">${vaultBuckets.map((bucket,index)=>{
    const info=setCollections[bucket.setId]??setCollection;
    const logo=setLogoMarkup(bucket.setId,"pack-set-logo") || `<span class="pack-text-logo"><b>${info.name.toUpperCase()}</b><small>SERIES 1</small></span>`;
    return `<button type="button" class="vault-pack-product pack-set-${bucket.setId}" data-open-vault-pack="${bucket.setId}:${bucket.type}" aria-label="Open ${info.displayName} ${bucket.label}">
      <span class="vault-pack-quantity">×${bucket.count}</span>
      ${physicalBoosterPackMarkup({setId:bucket.setId,title:info.name,series:bucket.type==='standard'?'SERIES 1':'SUPER PACK',subtitle:bucket.subtitle,extraClass:`vault-product-pack ${bucket.type==='super'?'is-super-pack':''}`})}
      <strong>${info.displayName}</strong><em>${bucket.label}</em><small>TAP PACK TO OPEN</small>
    </button>`;
  }).join('')}</section>` : `<section class="booster-empty-stage"><div class="booster-empty-state"><span>VAULT EMPTY</span><h3>No unopened packs right now</h3><p>Win matches for boosters. Win full modes and tournaments for Super Packs.</p><button id="booster-empty-home" class="nav-button">Back to Main Menu</button></div></section>`;

  // During an opening, the active set drives the modal theme. At idle the Vault is
  // intentionally set-agnostic: all openable packs live together on one shelf.
  document.body.dataset.set = packInProgress ? activeBoosterSetId : "all";

  const modal = packInProgress ? `<section class="booster-pack-modal ${setVisualClass(activeBoosterSetId)}" role="dialog" aria-modal="true" aria-label="${setInfo.name} pack opening">
    <div class="booster-pack-modal-shell">
      <div class="booster-pack-modal-head"><span>PACK OPENING</span><b>${setInfo.displayName}</b></div>
      ${message?`<p class="booster-modal-message">${message}</p>`:''}
      <div class="booster-pack-modal-body">${packArea}</div>
    </div>
  </section>` : "";

  root.innerHTML=`<section class="collection-screen booster-screen premium-screen booster-vault-all booster-compact-screen">
    ${premiumHubHeading("OPEN", "PACKS", `${totalVaultPacks} PACK${totalVaultPacks===1?'':'S'} READY`, "Rip · reveal · collect", "hub-packs")}
    ${message&&!packInProgress?`<p class="setup-message">${message}</p>`:''}
    ${vaultShelf}
    <section class="booster-vault-lower"><div class="set-stats booster-vault-stats"><div class="set-stat"><b>${totalVaultPacks}</b><span>Packs ready</span></div><div class="set-stat"><b>${Object.values(profile.packsOpenedBySet??{}).reduce((a,b)=>a+(Number(b)||0),0)}</b><span>Packs opened</span></div><div class="set-stat"><b>${profile.unlockedSuperstars?.length??0}</b><span>Superstars</span></div><div class="set-stat"><b>${profile.universePoints ?? 0}</b><span>UP</span></div></div><label class="booster-assistance">Deck Assistance <select id="deck-assistance" ${packInProgress?'disabled':''}><option value="ask" ${profile.deckAssistance==='ask'?'selected':''}>Ask me</option><option value="auto" ${profile.deckAssistance==='auto'?'selected':''}>Auto-upgrade</option><option value="manual" ${profile.deckAssistance==='manual'?'selected':''}>Manual</option></select></label></section>
  </section>${modal}${boosterInspectOverlayMarkup(pulls)}`;

  root.querySelectorAll('[data-open-vault-pack]').forEach(btn=>btn.addEventListener('click',()=>{
    const [setId,type] = btn.dataset.openVaultPack.split(':');
    activeBoosterSetId=setId; currentPackType=type; message=''; processPack(type);
  }));
  $("#deck-assistance")?.addEventListener("change",e=>{setDeckAssistance(profile,e.target.value);saveProfile(profile);message=`Deck Assistance set to ${e.target.options[e.target.selectedIndex].text}.`;renderBoosters();});
  $("#rip-pack")?.addEventListener("click", ripOpenPack);
  root.querySelectorAll('[data-booster-inspect]').forEach(btn=>btn.addEventListener('click',()=>{if(packStage==="reveal"){nextBoosterCard();return;}boosterInspectIndex=Number(btn.dataset.boosterInspect);boosterInspectFlipped=false;renderBoosters();}));
  root.querySelectorAll('[data-booster-next]').forEach(btn=>btn.addEventListener('click',()=>{ if (packStage === "reveal") nextBoosterCard(); }));
  root.querySelectorAll('[data-flip-booster-inspect]').forEach(btn=>btn.addEventListener('click',event=>{event.stopPropagation();boosterInspectFlipped=!boosterInspectFlipped;renderBoosters();}));
  root.querySelectorAll('[data-close-booster-inspect]').forEach(btn=>btn.addEventListener('click',()=>{boosterInspectIndex=null;boosterInspectFlipped=false;renderBoosters();}));
  root.querySelectorAll('[data-booster-inspect-modal-backdrop]').forEach(backdrop=>backdrop.addEventListener('click',event=>{if(event.target!==backdrop)return;boosterInspectIndex=null;boosterInspectFlipped=false;renderBoosters();}));
  $("#open-another-pack")?.addEventListener("click",()=>{const kind=currentPackType; lastPack=null; revealedPackCards=new Set(); boosterRulesFlipped=new Set(); boosterInspectIndex=null; boosterInspectFlipped=false; convertedPackCards=new Set(); boosterFocusIndex=0; pendingUpgrades=[]; appliedPackUpgrades=[]; packStage="idle"; message=""; processPack(kind);});
  $("#pack-summary-next")?.addEventListener("click", beginPackUpgradeReview);
  $("#finish-pack-review")?.addEventListener("click", finishPackFlow);
  $("#booster-empty-home")?.addEventListener("click", showMainMenu);
  root.querySelectorAll('[data-accept-upgrade]').forEach(btn=>btn.addEventListener('click',()=>acceptUpgrade(Number(btn.dataset.acceptUpgrade))));
  root.querySelectorAll('[data-decline-upgrade]').forEach(btn=>btn.addEventListener('click',()=>declineUpgrade(Number(btn.dataset.declineUpgrade))));
}


function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${days}d ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function formatDailyHoursMinutes(ms) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2,"0")}h ${String(minutes).padStart(2,"0")}m`;
}

function refreshSeasonClocks() {
  if (!profile) return;
  const free = freePackStatus(profile, new Date());
  const next = nextRoadmapNode(new Date());
  const nextMs = Math.max(0, new Date(next.date).getTime() - Date.now());
  document.querySelectorAll('[data-next-drop-countdown]').forEach(el => { el.textContent = nextMs <= 0 ? 'LIVE' : formatCountdown(nextMs); });
  const seasonRemaining = seasonTimeRemaining(new Date());
  document.querySelectorAll('[data-season-end-countdown]').forEach(el => { el.textContent = seasonRemaining.ended ? 'SEASON COMPLETE' : formatCountdown(seasonRemaining.ms); });
  const liveRotation = liveEventRotation(new Date());
  document.querySelectorAll('[data-live-event-countdown]').forEach(el => { el.textContent = formatCountdown(liveRotation.msRemaining); });
  document.querySelectorAll('[data-live-tower-expiry]').forEach(el => {
    const expiry = Number(el.dataset.liveTowerExpiry || 0);
    el.textContent = formatCountdown(Math.max(0, expiry - Date.now()));
  });
  const claim = document.querySelector('#claim-free-pack');
  if (claim) {
    claim.disabled = !free.available;
    const action = claim.querySelector('[data-free-pack-action]');
    if (action) action.textContent = free.available ? 'CLAIM FREE BOOSTER' : `NEXT FREE BOOSTER IN ${formatDailyHoursMinutes(free.msRemaining)}`;
  }
  const store = storeRotation(new Date());
  document.querySelectorAll('[data-store-countdown]').forEach(el => { el.textContent = formatStoreCountdown(store.msRemaining); });
  const storeScreen = document.querySelector('[data-store-set]');
  if (screen === "store" && storeScreen && storeScreen.dataset.storeSet !== store.setId) { message = "The Daily Store refreshed."; renderStore(); }
}


function formatStoreCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}


function recommendedOwnedStatus(starId) {
  const draft = buildOwnedRecommendedDraft(profile, starId);
  const total = recommendedDeckDraft(starId).length;
  return { draft, total, owned: draft.length, missing: Math.max(0,total-draft.length) };
}
function renderRecommendedDeckPrompt() {
  if (!pendingDeckBuildSuperstarId || !pendingDeckBuildStep) return "";
  const star = superstarById[pendingDeckBuildSuperstarId];
  if (!star) return "";
  const status = recommendedOwnedStatus(star.id);
  const stage = pendingDeckBuildStep;
  return `<div class="deck-build-prompt" role="dialog" aria-modal="true"><div class="deck-build-prompt-card">
    <span class="premium-kicker">SUPERSTAR UNLOCKED</span><h2>${star.name}</h2><p>${stage==="offer"?"Build toward the recommended deck from the cards you already own?":`Recommended cards found: <b>${status.owned}/${status.total}</b>. ${status.missing} slot${status.missing===1?"":"s"} still need filling.`}</p>
    ${stage==="offer"?`<div class="deck-build-actions"><button id="build-recommended-owned" class="start-match">YES — BUILD DECK</button><button id="skip-recommended-owned" class="nav-button">NOT NOW</button></div>`:`<div class="deck-build-meter"><span style="width:${status.total?Math.round(status.owned/status.total*100):0}%"></span></div><div class="deck-build-actions"><button id="auto-fill-recommended" class="start-match">AUTO FILL GAPS</button><button id="manual-fill-recommended" class="nav-button">FILL MANUALLY</button><button id="finish-partial-recommended" class="nav-button">KEEP PARTIAL DECK</button></div>`}
  </div></div>`;
}
function wireRecommendedDeckPrompt() {
  $("#build-recommended-owned")?.addEventListener("click",()=>{ const sid=pendingDeckBuildSuperstarId; profile.savedDecks ??= {}; profile.savedDecks[sid]=buildOwnedRecommendedDraft(profile,sid); saveProfile(profile); pendingDeckBuildStep="fill"; renderStore(); });
  $("#skip-recommended-owned")?.addEventListener("click",()=>{pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;renderStore();});
  $("#auto-fill-recommended")?.addEventListener("click",()=>{ const sid=pendingDeckBuildSuperstarId; profile.savedDecks[sid]=autoFillOwnedDraft(profile,sid,profile.savedDecks[sid]??[]); saveProfile(profile); const st=recommendedOwnedStatus(sid); message=st.missing?`Auto Fill used every legal owned option available. ${st.missing} recommended slots remain unavailable.`:`${superstarById[sid].name}'s deck is ready.`; pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;renderStore(); });
  $("#manual-fill-recommended")?.addEventListener("click",()=>{ const sid=pendingDeckBuildSuperstarId; pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;showDeckBuilder(sid); });
  $("#finish-partial-recommended")?.addEventListener("click",()=>{pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;renderStore();});
}

function premiumHubHeading(firstWord, accentWord, kicker, subtitle, theme = "hub-cyan") {
  return `<header class="premium-hub-heading ${theme}"><span class="premium-hub-kicker">${kicker}</span><h1><span>${firstWord}</span> <b>${accentWord}</b></h1><p>${subtitle}</p></header>`;
}

function homeHubSplitTitle(firstWord, accentWord) {
  return `<strong class="legacy-command-title"><span>${firstWord}</span> <b>${accentWord}</b></strong>`;
}

function renderStore() {
  setChrome();
  const root = $("#game");
  const now = new Date();
  const rotation = storeRotation(now);
  const setInfo = setCollections[rotation.setId] ?? sets[rotation.setId];
  const stars = storeSuperstars(rotation.setId);
  const balance = profile.universePoints ?? 0;
  const starRows = stars.map(star => {
    const owned = hasSuperstar(profile, star.id);
    return `<article class="store-booster-offer store-superstar-offer card-shop-counter premium-panel ${owned?'owned':''}">
      <div class="shop-pack-display store-superstar-product-art"><button type="button" class="store-superstar-art store-superstar-card-art" data-store-inspect-star="${star.id}">${superstarPreviewCardMarkup(star.id,"store-shelf-collectible")}</button></div>
      <div class="store-offer-copy"><span>${owned?'OWNED SUPERSTAR':'FEATURED SUPERSTAR'}</span><h3>${star.name}</h3>${star.nickname?`<small class="store-superstar-nickname">${star.nickname}</small>`:''}<div class="store-offer-price"><b>${STORE_SUPERSTAR_PRICE.toLocaleString()} <em>UP</em></b><button class="${owned?'nav-button':'start-match'}" data-buy-store-star="${star.id}" ${owned||balance<STORE_SUPERSTAR_PRICE?'disabled':''}>${owned?'OWNED':'UNLOCK SUPERSTAR'}</button></div></div>
    </article>`;
  }).join('');
  root.innerHTML=`<section class="store-screen premium-screen store-redesign" data-store-set="${rotation.setId}">
    ${premiumHubHeading("MY", "STORE", "DAILY ROTATION", "Boosters · Superstar unlocks", "hub-store")}
    ${message?`<p class="setup-message">${message}</p>`:''}
    <section class="store-booster-offer card-shop-counter premium-panel"><div class="shop-pack-display">${physicalBoosterPackMarkup({setId:rotation.setId,title:setInfo?.name ?? "WWE LEGACY",series:"SERIES 1",subtitle:"5 CARDS · 1 GUARANTEED FOIL",extraClass:"shop-pack"})}</div><div class="store-offer-copy"><span>FEATURED BOOSTER</span><h3>${setInfo?.displayName ?? setInfo?.name ?? rotation.setId}</h3><div class="store-offer-price"><b>${STORE_BOOSTER_PRICE.toLocaleString()} <em>UP</em></b><button id="buy-store-booster" class="start-match" ${balance<STORE_BOOSTER_PRICE?'disabled':''}>BUY PACK</button></div></div></section>
    <section class="store-roster-section"><div class="store-section-heading"><div><span>SUPERSTAR SHOP</span><h3>FEATURED SUPERSTARS</h3></div><strong>${STORE_SUPERSTAR_PRICE.toLocaleString()} <em>UP</em> EACH</strong></div><p class="store-roster-note">Unlock a Superstar. Their Entrance remains a Very Rare booster chase.</p><div class="store-superstar-shelf store-superstar-product-list">${starRows}</div></section>
  </section>${renderRecommendedDeckPrompt()}${renderSuperstarOverlay()}`;
  $("#buy-store-booster")?.addEventListener("click",()=>{ try { const result=purchaseStoreBooster(profile,rotation.setId,new Date()); saveProfile(profile); message=`${setInfo?.name ?? 'Featured'} booster purchased for ${result.price} UP. ${result.balance} UP remaining.`; } catch(e){message=e.message;} renderStore(); });
  root.querySelectorAll('[data-buy-store-star]').forEach(btn=>btn.addEventListener('click',()=>{ try { const star=superstarById[btn.dataset.buyStoreStar]; const result=purchaseStoreSuperstar(profile,btn.dataset.buyStoreStar,new Date()); saveProfile(profile); message=`${star.name} unlocked for ${result.price.toLocaleString()} UP.`; if (beginUnlockCelebration("store")) return; } catch(e){message=e.message;} renderStore(); }));
  root.querySelectorAll('[data-store-inspect-star]').forEach(btn=>btn.addEventListener('click',event=>{ event.stopPropagation(); superstarOverlayId=btn.dataset.storeInspectStar; superstarOverlayFlipped=false; renderStore(); }));
  root.querySelectorAll('[data-flip-superstar-modal]').forEach(btn=>btn.addEventListener('click',event=>{ event.stopPropagation(); superstarOverlayFlipped=!superstarOverlayFlipped; renderStore(); }));
  root.querySelectorAll('[data-superstar-modal-backdrop]').forEach(backdrop=>backdrop.addEventListener('click',event=>{ if(event.target!==backdrop)return; superstarOverlayId=null; superstarOverlayFlipped=false; renderStore(); }));
  wireRecommendedDeckPrompt();
  refreshSeasonClocks();
}

function renderSeasons() {
  setChrome();
  // iOS Safari can retain a stale document scroll offset across fixed-layout screen swaps.
  // The Season screen is viewport-fixed, but clearing the document origin also prevents that
  // stale offset from reappearing when leaving/re-entering the tab.
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  const root = $("#game");
  const state = seasonState(profile);
  const progress = seasonLevelProgress(profile);
  const free = freePackStatus(profile, new Date());
  const next = nextRoadmapNode(new Date());
  const remaining = seasonTimeRemaining(new Date());
  const claimable = Array.from({length: progress.tier}, (_,i)=>i+1).filter(t => !state.claimedTiers.includes(t));
  const seasonCountdown = remaining.ended ? 'SEASON COMPLETE' : formatCountdown(remaining.ms);
  const tierRoad = Array.from({length: SEASON_TIER_COUNT}, (_, i) => i + 1).map(tier => {
    const reward = tierReward(tier), reached = tier <= progress.tier, claimed = state.claimedTiers.includes(tier), current = tier === Math.max(1, Math.min(SEASON_TIER_COUNT, progress.tier));
    const setName = reward.kind === "booster" ? (sets[reward.setId]?.displayName ?? sets[reward.setId]?.name ?? reward.setId) : "";
    const isFinalBossCard = reward.kind === "final-boss-card";
    const finalBossRewardClass = isFinalBossCard ? `final-boss-${String(reward.rewardType ?? "reward").replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}` : "";
    const major = isFinalBossCard || tier % 10 === 0 || tier === 100;
    const rewardTitle = isFinalBossCard ? `${String(reward.name).toUpperCase()}${(reward.amount ?? 1) > 1 ? ` ×${reward.amount}` : ''}` : reward.kind === "universe-points" ? `${reward.amount} UP` : `${reward.amount}× BOOSTER`;
    const rewardSub = isFinalBossCard ? `${reward.label} · FINAL BOSS` : reward.kind === "universe-points" ? `UNIVERSE POINTS` : setName;
    const rewardIcon = isFinalBossCard ? (reward.rewardType === "superstar" ? "star" : "cards") : reward.kind === "universe-points" ? "points" : "pack";
    return `<article id="season-tier-${tier}" class="season-road-node ${tier%2?'road-left':'road-right'} ${reached?'reached':''} ${claimed?'claimed':''} ${current?'current':''} ${major?'major':''} ${isFinalBossCard?'final-boss-node':''} ${finalBossRewardClass}"${isFinalBossCard ? ` data-final-boss-reward="${reward.rewardType}"` : ""}>
      <span class="season-road-connector" aria-hidden="true"></span><div class="season-road-tier"><small>TIER</small><b>${tier}</b></div>
      <div class="season-road-reward"><span class="season-road-icon">${uiIcon(rewardIcon)}</span><div><strong>${rewardTitle}</strong><small>${rewardSub}</small></div>${claimed?'<em>✓ CLAIMED</em>':reached?`<button class="primary" data-claim-season-tier="${tier}">CLAIM</button>`:'<em>LOCKED</em>'}</div>
    </article>`;
  }).join('');
  const roadmap = SEASON_1.roadmap.map((node,index)=>{const status=roadmapNodeStatus(node,new Date());return `<article class="season-release-chip ${status}"><span>${node.dateLabel}</span><b>${node.title}</b><small>${node.kicker}</small></article>`;}).join('');
  root.innerHTML = `<section class="seasons-screen premium-screen season-road-redesign">
    <section class="season-anchor-shell">
      <header class="season-road-hero"><div class="season-road-hero-copy"><span>WWE LEGACY · SEASON 1</span><h1><b>SEASON</b> <em>ONE</em></h1><p>THE ROAD TO THE FINAL BOSS</p><div class="season-end-countdown"><small>SEASON ENDS IN</small><strong data-season-end-countdown>${seasonCountdown}</strong></div></div><div class="season-road-rock">${finalBossRockMarkup()}</div></header>
      <section class="season-road-command"><div><small>CURRENT TIER</small><strong>${progress.tier} / ${SEASON_TIER_COUNT}</strong><span>${progress.xp.toLocaleString()} / ${(SEASON_TIER_COUNT*XP_PER_TIER).toLocaleString()} XP</span></div><div><small>REWARDS READY</small><strong>${claimable.length}</strong><span>${progress.tier>=SEASON_TIER_COUNT?'ROAD COMPLETE':`NEXT · TIER ${progress.tier+1}`}</span></div><div><small>UNIVERSE POINTS</small><strong>${(profile.universePoints??0).toLocaleString()}</strong><span>UP</span></div></section>
      ${message ? `<p class="setup-message">${message}</p>` : ''}
      <section class="season-free-pack-cta season-free-pack-strip ${free.available ? 'ready' : 'waiting'}"><button id="claim-free-pack" class="season-free-pack-button" ${free.available?'':'disabled'}><strong data-free-pack-action>${free.available?'CLAIM FREE BOOSTER':`NEXT FREE BOOSTER IN ${formatDailyHoursMinutes(free.msRemaining)}`}</strong></button></section>
    </section>
    <section class="season-road-viewport">
      <div class="season-road-scroll" data-season-road-scroll>
        <section class="season-road-toolbar"><div><span>100-TIER REWARD ROAD</span><small>Scroll the tiers · current tier auto-focused</small></div>${claimable.length?'<button id="claim-all-season" class="primary season-claim-all">CLAIM ALL READY</button>':''}</section>
        <section class="season-reward-road" aria-label="100 Tier Season Road"><span class="season-road-spine" aria-hidden="true"></span>${tierRoad}</section>
        <section class="season-release-road"><div class="season-road-toolbar"><div><span>SEASON 1 RELEASES</span><small>Live and upcoming sets</small></div><b>NEXT · ${next.title}</b></div><div class="season-release-strip">${roadmap}</div></section>
      </div>
    </section>
  </section>`;
  $("#claim-free-pack")?.addEventListener("click", () => {
    try { const reward=claimFreeSeasonBooster(profile,Math.random,new Date());saveProfile(profile);activeBoosterSetId=reward.setId;boosterReturnScreen="seasons";screen="boosters";message="";processPack("standard"); }
    catch(e){message=e.message;renderSeasons();}
  });
  root.querySelectorAll('[data-claim-season-tier]').forEach(btn => btn.addEventListener('click', () => {
    try { const reward=claimSeasonTier(profile,Number(btn.dataset.claimSeasonTier));saveProfile(profile);message=reward.kind==='universe-points'?`Tier ${reward.tier} claimed: +${reward.amount} UP.`:reward.kind==='final-boss-card'?`Tier ${reward.tier} claimed: ${reward.name} unlocked.`:`Tier ${reward.tier} claimed: ${reward.amount} ${sets[reward.setId]?.name??reward.setId} booster${reward.amount===1?'':'s'}.`; }
    catch(e){message=e.message;}
    if(profile.pendingUnlockCelebrations?.length&&beginUnlockCelebration("seasons"))return;
    renderSeasons();
  }));
  $("#claim-all-season")?.addEventListener("click",()=>{try{const rewards=claimAllSeasonTiers(profile);saveProfile(profile);message=`${rewards.length} Season reward${rewards.length===1?'':'s'} claimed.`;}catch(e){message=e.message;}if(profile.pendingUnlockCelebrations?.length&&beginUnlockCelebration("seasons"))return;renderSeasons();});
  refreshSeasonClocks();
  if (seasonStickyScrollHandler) {
    window.removeEventListener('scroll', seasonStickyScrollHandler);
    seasonStickyScrollHandler = null;
  }
  const currentTier=Math.max(1,Math.min(SEASON_TIER_COUNT,progress.tier));
  setTimeout(()=>{
    const scroller=root.querySelector('[data-season-road-scroll]');
    const target=document.getElementById(`season-tier-${currentTier}`);
    if(!scroller||!target)return;
    const scrollerRect=scroller.getBoundingClientRect();
    const targetRect=target.getBoundingClientRect();
    const targetTop=scroller.scrollTop+(targetRect.top-scrollerRect.top);
    const focusOffset=Math.max(12,Math.min(72,scroller.clientHeight*.18));
    scroller.scrollTo({top:Math.max(0,targetTop-focusOffset),left:0,behavior:'auto'});
  },120);
}

function renderChallenges() {
  const root = $("#game");
  const challenges = challengeState(profile);
  const setRows = Object.values(launchSetCollections).map(set => {
    const progress = collectionProgress(profile, set.id);
    const state = setProgressState(profile, set.id);
    const rewards = availableMilestoneRewards(profile, set.id);
    return { set, progress, state, rewards };
  });
  const challengeCard = (c, group) => {
    const complete = (c.progress ?? 0) >= c.target;
    const xp = c.xpReward ?? (group === 'WEEKLY' ? 200 : 50);
    const icon = group === 'WEEKLY' ? 'calendar' : 'bolt';
    return `<article class="challenge-card premium-challenge-card challenge-${group.toLowerCase()} ${complete ? 'complete' : ''} ${c.claimed ? 'claimed' : ''}">
      <div class="challenge-card-head"><span class="challenge-type-icon">${uiIcon(icon)}</span><div><span>${group}</span><h3>${c.label}</h3></div><b>${c.progress ?? 0}/${c.target}</b></div>
      <div class="challenge-progress"><i style="width:${Math.min(100, ((c.progress??0)/c.target)*100)}%"></i></div>
      <div class="challenge-reward-chips"><span>${uiIcon('xp')} ${xp} XP</span><span>${uiIcon('pack')} ${c.reward} Booster${c.reward===1?'':'s'}</span></div>
      ${c.claimed ? '<button disabled>CLAIMED</button>' : complete ? `<button class="primary" data-claim-challenge="${c.id}">${uiIcon('gift')} CLAIM</button>` : '<button disabled>IN PROGRESS</button>'}
    </article>`;
  };
  const milestone = (setId, m, type, progress, state) => {
    const actual = type === 'foil' ? progress.foilPercent : progress.percent;
    const claimedList = type === 'foil' ? state.claimedFoil : state.claimedCollection;
    const claimed = claimedList.includes(m.percent);
    const ready = actual >= m.percent && !claimed;
    const toward = Math.max(0, Math.min(100, (actual / Math.max(1, m.percent)) * 100));
    return `<article class="milestone-row premium-milestone-row ${claimed?'claimed':ready?'ready':'locked'}">
      <span class="milestone-icon">${uiIcon(type === 'foil' ? 'star' : 'trophy')}</span>
      <div class="milestone-copy"><b>${type === 'foil' ? 'FOIL' : 'COLLECTION'} ${m.percent}%</b><span>${m.reward} booster${m.reward===1?'':'s'}</span><div class="milestone-progress-track" aria-label="${actual}% toward ${m.percent}%"><i style="width:${toward}%"></i></div><small>${Math.min(actual,m.percent)}% / ${m.percent}%</small></div>
      ${claimed?'<button disabled>CLAIMED</button>':ready?`<button class="primary" data-claim-milestone="${setId}:${type}:${m.percent}">CLAIM</button>`:'<button disabled>LOCKED</button>'}
    </article>`;
  };
  const milestoneSections = setRows.map(({set,progress,state}) => `<section class="challenge-section set-milestone-section ${setVisualClass(set.id)}"><div class="set-milestone-heading"><div class="set-milestone-logo">${setLogoMarkup(set.id,'challenge-set-logo')}</div><div><span>SET MILESTONES</span><h3>${set.displayName}</h3><small>${progress.ownedUnique}/${progress.total} UNIQUE · ${progress.foilUnique}/${progress.total} FOIL</small></div></div><div class="milestone-grid milestone-roadmap-grid">${[...COLLECTION_MILESTONES.map(m=>milestone(set.id,m,'collection',progress,state)),...FOIL_MILESTONES.map(m=>milestone(set.id,m,'foil',progress,state))].join('')}</div></section>`).join('');
  const challengeSetStats = setRows.map(({set,progress})=>{ const packs=boosterCreditsFor(profile,set.id); return `<article class="challenge-set-stat ${setVisualClass(set.id)}"><div class="challenge-set-logo">${setLogoMarkup(set.id,"challenge-mini-set-logo")}</div><div class="challenge-set-copy"><b>${Math.round((progress.ownedUnique/Math.max(1,progress.total))*100)}%</b><small>${progress.ownedUnique}/${progress.total} unique</small></div><span class="challenge-pack-count">${uiIcon('pack')} ${packs}</span></article>`; }).join('');
  const dailyReady = challenges.daily.filter(c=>!c.claimed && (c.progress??0)>=c.target).length;
  const weeklyReady = challenges.weekly.filter(c=>!c.claimed && (c.progress??0)>=c.target).length;
  const milestoneReady = setRows.reduce((n,row)=>n+row.rewards.collection.length+row.rewards.foil.length,0);
  root.innerHTML = `<section class="challenges-screen premium-screen challenges-premium challenges-compact-screen">
    ${premiumHubHeading("MY", "CHALLENGES", "DAILY · WEEKLY · COLLECTION", "Complete goals and build Season XP", "hub-challenges")}
    <section class="challenge-overview-strip"><span>${uiIcon('bolt')}<b>${dailyReady}</b><small>DAILY READY</small></span><span>${uiIcon('calendar')}<b>${weeklyReady}</b><small>WEEKLY READY</small></span><span>${uiIcon('trophy')}<b>${milestoneReady}</b><small>MILESTONES</small></span></section>
    ${message ? `<p class="setup-message">${message}</p>` : ''}
    <section class="challenge-command-panel compact-set-progress"><div class="challenge-command-title"><span>SET PROGRESS</span><small>Collection completion · reward packs</small></div><div class="challenge-set-stats">${challengeSetStats}</div></section>
    <section class="challenge-section premium-challenge-section challenge-daily-section"><div class="challenge-section-banner"><span>${uiIcon('bolt')}</span><div><small>QUICK ROTATING GOALS</small><h3>DAILY CHALLENGES</h3></div><b>${dailyReady ? `${dailyReady} READY` : '3 GOALS'}</b></div><div class="challenge-grid">${challenges.daily.map(c=>challengeCard(c,'DAILY')).join('')}</div></section>
    <section class="challenge-section premium-challenge-section challenge-weekly-section"><div class="challenge-section-banner"><span>${uiIcon('calendar')}</span><div><small>LARGER GOALS · BIGGER XP</small><h3>WEEKLY CHALLENGES</h3></div><b>${weeklyReady ? `${weeklyReady} READY` : '3 GOALS'}</b></div><div class="challenge-grid">${challenges.weekly.map(c=>challengeCard(c,'WEEKLY')).join('')}</div></section>
    ${milestoneSections}
  </section>`;
  root.querySelectorAll('[data-claim-challenge]').forEach(btn=>btn.addEventListener('click',()=>{ try { const xpBefore=seasonState(profile).xp; const tierBefore=seasonTier(profile); const reward=claimChallenge(profile,btn.dataset.claimChallenge); const xpAfter=seasonState(profile).xp; const tierAfter=seasonTier(profile); queueTierUps(tierBefore,tierAfter,xpBefore,xpAfter); saveProfile(profile); message=`Challenge claimed: +${reward} SummerSlam booster${reward===1?'':'s'} and Season XP.`; } catch(e){ message=e.message; } renderChallenges(); showTierUpCelebration(); }));
  root.querySelectorAll('[data-claim-milestone]').forEach(btn=>btn.addEventListener('click',()=>{ try { const [setId,type,pct]=btn.dataset.claimMilestone.split(':'); const reward=claimMilestone(profile,type,Number(pct),setId); saveProfile(profile); message=`${setCollections[setId]?.name??setId} ${type==='foil'?'Foil':'Collection'} milestone claimed: +${reward} booster${reward===1?'':'s'}.`; } catch(e){ message=e.message; } renderChallenges(); }));
  syncMobileAttentionBadges();
}

function beginLiveEventTower() {
  const towerKey = selectedLiveEventKey;
  const starId = selection.p1;
  if (!towerKey) { showLiveEvents(); return; }
  if (!hasSuperstar(profile, starId)) { message = "Choose an unlocked Superstar."; renderLiveEvents(); return; }
  try {
    startLiveEventTower(profile, towerKey, starId, roster.map(star => star.id), Math.random, new Date());
    saveProfile(profile);
    startCurrentLiveEventMatch(towerKey);
  } catch (error) {
    message = error.message;
    renderLiveEvents();
  }
}

function startCurrentLiveEventMatch(towerKey = selectedLiveEventKey ?? activeLiveEventTowerKey) {
  const now = new Date();
  const tower = liveEventTowerByKey(towerKey, now);
  const entry = tower ? liveEventTowerState(profile, towerKey, now) : null;
  const run = entry?.state?.activeRun;
  const opponentId = tower ? currentLiveEventTowerOpponent(profile, towerKey, now) : null;
  if (!tower || !run || run.status !== "active" || !opponentId) { showLiveEvents(); return; }
  const stage = currentLiveEventTowerStage(profile, towerKey, now);
  const modifier = stage.modifier ? { ...stage.modifier, name: stage.ruleName, ruleText: stage.ruleText } : null;
  activeLiveEventTowerKey = towerKey;
  selectedLiveEventKey = towerKey;
  startMatch(run.superstarId, opponentId, {
    mode: "live-event",
    modifier,
    eventMeta: {
      towerKey,
      cadenceLabel: tower.cadenceLabel,
      eventId: tower.event.id,
      eventName: tower.event.name,
      stageIndex: run.stage,
      stageLabel: stage.label,
      ruleName: stage.ruleName,
      ruleText: stage.ruleText,
      rewardSetId: tower.event.rewardSetId,
      logoMode: tower.event.logoMode
    }
  });
}

const LIVE_EVENT_ACCENT_ROTATION = Object.freeze(["cyan", "magenta", "orange", "purple", "teal", "red", "blue"]);
function liveEventAccentForTower(tower, now = new Date()) {
  const lineup = activeLiveEventTowers(now);
  const index = Math.max(0, lineup.findIndex(item => item.key === tower?.key));
  return LIVE_EVENT_ACCENT_ROTATION[index % LIVE_EVENT_ACCENT_ROTATION.length];
}

function renderLiveEventHub() {
  const root = $("#game");
  document.body.dataset.liveView = "hub";
  const now = new Date();
  const towers = activeLiveEventTowers(now);
  const splitTowerTitle = (title, accent) => {
    const parts=String(title).trim().split(/\s+/), first=parts.shift()??title, rest=parts.join(' ')||'EVENT';
    return `<h3 class="live-event-split-title title-${accent}"><span>${first}</span><b>${rest}</b></h3>`;
  };
  const cards = towers.map((tower, index) => {
    const entry = liveEventTowerState(profile, tower.key, now);
    const state = entry?.state;
    const run = state?.activeRun;
    const progress = state?.cleared ? LIVE_EVENT_LENGTH : Math.min(run?.stage ?? 0, LIVE_EVENT_LENGTH);
    const status = state?.cleared ? "COMPLETE" : run?.status === "active" ? `MATCH ${run.stage + 1}/${LIVE_EVENT_LENGTH}` : "AVAILABLE";
    const rewardSet = sets[tower.event.rewardSetId];
    const accent = liveEventAccentForTower(tower, now);
    return `<article class="live-tower-hub-card compact-live-choice ${accent}" data-open-live-tower="${tower.key}">
      <span class="legacy-mode-beams" aria-hidden="true"></span>
      <div class="live-tower-hub-copy">
        <span class="live-tower-cadence">${tower.cadenceLabel} · ${status}</span>
        ${splitTowerTitle(tower.event.name,accent)}
        <small class="live-choice-summary">${progress}/${LIVE_EVENT_LENGTH} MATCHES · SUPER PACK ON CLEAR</small>
        <div class="live-tower-hub-footer"><b class="live-tower-enter">${status === "COMPLETE" ? "VIEW COMPLETED TOWER" : status === "AVAILABLE" ? "PLAY" : `CONTINUE ${status}`} <i>›</i></b></div>
      </div>
    </article>`;
  }).join("");
  const mitb = ladderState(profile, now), mitbRun=mitb.activeRun, mitbActive=mitbRun?.status==='active';
  const mitbStatus = mitb.dailyCleared ? 'COMPLETE' : mitbActive ? `LEVEL ${mitbRun.rung+1}/${LADDER_LENGTH}` : 'AVAILABLE';
  const mitbProgress = mitbActive ? mitbRun.rung : mitb.dailyCleared ? LADDER_LENGTH : 0;
  const mitbCard = `<article class="live-tower-hub-card compact-live-choice mitb money-in-bank-live-card" id="open-money-in-bank" role="button" tabindex="0">
    <span class="legacy-mode-beams" aria-hidden="true"></span><div class="live-tower-hub-copy"><span class="live-tower-cadence">DAILY TOWER · THREE LIVES · ${mitbStatus}</span><h3 class="live-event-split-title title-mitb"><span>MONEY IN THE</span><b>BANK</b></h3><small class="live-choice-summary">${mitbProgress}/${LADDER_LENGTH} LEVELS · ${mitbActive?mitbRun.lives:LADDER_LIVES} LIVES · SUPER PACK ON CLEAR</small><div class="live-tower-hub-footer"><b class="live-tower-enter">${mitb.dailyCleared?'VIEW COMPLETED RUN':mitbActive?`CONTINUE ${mitbStatus}`:'ENTER MONEY IN THE BANK'} <i>›</i></b></div></div><div class="mitb-briefcase" aria-hidden="true">$</div>
  </article>`;
  root.innerHTML = `<section class="live-events-hub premium-screen">
    <header class="live-events-hub-heading">${modeLogoMarkup("live-event", false)}<p>Live Events reset daily at local midnight. New themes rotate every day.</p></header>
    <section class="live-tower-hub-grid">${mitbCard}${cards}</section>
  </section>`;
  $("#open-money-in-bank")?.addEventListener('click',showLadder);
  $("#open-money-in-bank")?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showLadder();}});
  root.querySelectorAll('[data-open-live-tower]').forEach(card => {
    const open = () => showLiveEventTower(card.dataset.openLiveTower);
    card.addEventListener('click', open);
    card.setAttribute('role','button'); card.setAttribute('tabindex','0');
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  refreshSeasonClocks();
}

function renderLiveEventTowerDetail(towerKey) {
  const root = $("#game");
  document.body.dataset.liveView = "detail";
  const now = new Date();
  const entry = liveEventTowerState(profile, towerKey, now);
  if (!entry) { selectedLiveEventKey = null; message = "That Live Event has expired. A new tower is now available."; renderLiveEventHub(); return; }
  const { tower, state, aggregate } = entry;
  const event = tower.event;
  const run = state.activeRun;
  const active = run?.status === "active";
  const cleared = !!state.cleared;
  const unlocked = orderedUnlockedSuperstars();
  const chosenId = run?.superstarId ?? (unlocked.some(star => star.id === selection.p1) ? selection.p1 : unlocked[0]?.id);
  if (chosenId) selection.p1 = chosenId;
  const chosenStar = superstarById[chosenId];
  const stage = active ? currentLiveEventTowerStage(profile, towerKey, now) : null;
  const rewardSet = sets[event.rewardSetId];
  const detailTitle = event.logoMode !== "legacy" ? "Today's Daily Tower" : event.name;
  const normalVictoryPackTarget = Math.max(0, LIVE_EVENT_LENGTH - 1);
  const earnedPacks = Math.min(run?.stage ?? 0, normalVictoryPackTarget);
  const stageNumber = active ? run.stage + 1 : 1;
  const focusOpponentId = active ? currentLiveEventTowerOpponent(profile, towerKey, now) : event.heroId;
  const focusOpponent = superstarById[focusOpponentId];
  const focusStage = active ? stage : liveEventStage(event, 0);
  const previewThemed = [...new Set(event.opponentPool.filter(id => id !== chosenId && superstarById[id]))];
  const previewFallback = roster.map(star => star.id).filter(id => id !== chosenId && !previewThemed.includes(id));
  const previewPool = [...previewThemed, ...previewFallback];
  const previewBossId = event.bossId && event.bossId !== chosenId && superstarById[event.bossId] ? event.bossId : null;
  const previewOpponents = previewBossId
    ? [...previewPool.filter(id => id !== previewBossId).slice(0, LIVE_EVENT_LENGTH - 1), previewBossId]
    : previewPool.slice(0, LIVE_EVENT_LENGTH);
  const opponentIds = active ? run.opponents.filter(id => superstarById[id]) : previewOpponents;
  const route = opponentIds.map((id,index) => {
    const star = superstarById[id];
    const eventStage = liveEventStage(event,index);
    const stateClass = active ? (index < run.stage ? 'cleared' : index === run.stage ? 'current' : 'waiting') : 'preview';
    const stateLabel = active ? (index < run.stage ? 'DEFEATED' : index === run.stage ? 'CURRENT' : index === LIVE_EVENT_LENGTH - 1 ? 'REWARD' : 'WAITING') : (index === LIVE_EVENT_LENGTH - 1 ? 'REWARD' : 'WAITING');
    return `<article class="live-tower-route-card ${stateClass}"><div class="live-tower-route-head"><span>${index+1}</span><em>${stateLabel}</em></div><div class="live-tower-route-superstar">${superstarPreviewCardMarkup(id,"live-tower-opponent-card")}</div><div class="live-tower-route-copy"><strong>${star?.name ?? id}</strong><small>${eventStage.label}</small></div></article>`;
  }).join('');
  const detailAccent = liveEventAccentForTower(tower, now);
  const command = active
    ? `<section class="live-tower-command"><div><span>MATCH ${stageNumber} OF ${LIVE_EVENT_LENGTH}</span><strong>${focusOpponent?.name ?? 'Opponent'}</strong><small>${focusStage.label} · ${focusStage.ruleName}</small><p>${focusStage.ruleText}</p></div><button id="continue-live-event" class="start-match">Fight Match ${stageNumber}</button></section>`
    : cleared
      ? `<section class="live-tower-command complete"><div><span>TOWER COMPLETE</span><strong>${event.name}</strong><small>${chosenStar?.name ?? 'Your Superstar'} cleared all ${LIVE_EVENT_LENGTH} matches.</small><p>${normalVictoryPackTarget} victory boosters earned · ${rewardSet?.displayName ?? 'Reward'} Super Pack awarded for the tower clear.</p></div><button id="back-live-events" class="nav-button">Back to Live Events</button></section>`
      : `<section class="live-tower-player horizontal-selector live-tower-selector-panel"><div class="mode-run-picker-head"><div><span>YOUR SUPERSTAR</span><h3>${chosenStar?.name ?? 'Choose your Superstar'}</h3></div><small>Locked for this tower once started</small></div>${selectionCarouselMarkup(unlocked,chosenId,'live-event-select')}<p class="live-tower-selector-note">Clear all ${LIVE_EVENT_LENGTH} matches before the timer expires.</p><button id="start-live-event" class="start-match select-confirm">START WITH ${(chosenStar?.name ?? 'SUPERSTAR').toUpperCase()}</button></section>`;
  root.innerHTML = `<section class="live-tower-detail cadence-${tower.cadence} accent-${detailAccent} event-${event.id} ${active?'is-active-tower':cleared?'is-cleared-tower':'is-setup-tower'}">
    <button id="live-events-back" class="live-tower-back">‹ All Live Events</button>
    <section class="live-tower-detail-hero compact-live-detail-hero">
      <div class="live-tower-detail-copy">${event.logoMode !== 'legacy' ? liveEventBrandMarkup(event) : modeLogoMarkup('live-event',true)}<span class="live-tower-detail-cadence">${tower.cadenceLabel} · ${event.dayLabel ?? 'LIMITED TIME'}</span><h2>${detailTitle}</h2><p>${event.description}</p></div>
      <div class="live-tower-detail-stats compact-live-detail-stats"><article><span>TIME LEFT</span><b data-live-tower-expiry="${tower.nextAt.getTime()}">${formatCountdown(tower.msRemaining)}</b></article><article><span>MATCHES</span><b>${Math.min(run?.stage ?? 0,LIVE_EVENT_LENGTH)}/${LIVE_EVENT_LENGTH}</b></article><article><span>VICTORY PACKS</span><b>${earnedPacks}/${normalVictoryPackTarget}</b></article></div>
    </section>
    ${message ? `<div class="live-event-message-banner"><span>${message}</span></div>` : ''}
    <section class="live-tower-detail-body">${command}<section class="live-tower-route"><div class="live-tower-section-head"><span>EVENT ROUTE</span><strong>${active ? `Current Opponent · ${focusOpponent?.name ?? 'Opponent'}` : `${LIVE_EVENT_LENGTH} opponents · Super Pack on clear`}</strong></div><div class="live-tower-route-strip">${route}</div></section></section>
  </section>`;
  wireSelectionCarousel('live-event-select', id => { selection.p1 = id; renderLiveEvents(); });
  $("#start-live-event")?.addEventListener("click", beginLiveEventTower);
  $("#continue-live-event")?.addEventListener("click", () => startCurrentLiveEventMatch(towerKey));
  $("#live-events-back")?.addEventListener("click", showLiveEvents);
  $("#back-live-events")?.addEventListener("click", showLiveEvents);
  refreshSeasonClocks();
}

function renderLiveEvents() {
  setChrome();
  if (selectedLiveEventKey) renderLiveEventTowerDetail(selectedLiveEventKey);
  else renderLiveEventHub();
}


function beginLadderRun() {
  const starId = selection.p1;
  if (!hasSuperstar(profile, starId)) { message = "Choose an unlocked Superstar."; renderLadder(); return; }
  try {
    startLadderRun(profile, starId, roster.map(s => s.id), Math.random, "daily", new Date());
    saveProfile(profile);
    startCurrentLadderMatch();
  } catch (error) { message = error.message; renderLadder(); }
}

function startCurrentLadderMatch() {
  const run = ladderState(profile, new Date()).activeRun;
  const opponentId = currentLadderOpponent(profile, new Date());
  if (!run || run.status !== "active" || !opponentId) { showLadder(); return; }
  startMatch(run.superstarId, opponentId, { mode: "ladder" });
}

function renderLadder() {
  setChrome();
  const root = $("#game"), ladder = ladderState(profile, new Date()), run = ladder.activeRun, active = run?.status === "active";
  const unlocked = orderedUnlockedSuperstars();
  const chosenId = active ? run.superstarId : (unlocked.some(s => s.id === selection.p1) ? selection.p1 : unlocked[0]?.id);
  if (chosenId) selection.p1 = chosenId;
  const chosenStar = superstarById[chosenId];
  const lives = run?.lives ?? LADDER_LIVES;
  const focusIndex = active ? Math.max(0, Math.min(LADDER_LENGTH - 1, run.rung)) : 0;
  const opponents = (run?.opponents ?? ladder.dailyOpponents ?? []).filter(id => superstarById[id]);
  const opponentRows = opponents.map((id,index) => {
    const star = superstarById[id];
    const state = run ? (index < run.rung ? "cleared" : index === focusIndex ? "current" : "upcoming") : (index === 0 ? "current" : "upcoming");
    const stateLabel = state === "cleared" ? "DEFEATED" : state === "current" ? (active ? "NEXT" : "LEVEL 1") : "UPCOMING";
    return `<article class="mitb-v2-opponent ${state}" data-mitb-v2-opponent-index="${index}">
      <div class="mitb-v2-level-badge">${index + 1}</div>
      <div class="mitb-v2-opponent-card">${superstarPreviewCardMarkup(id,"mitb-v2-superstar-card")}</div>
      <div class="mitb-v2-opponent-copy"><strong>${star?.name ?? id}</strong><span>${stateLabel}</span></div>
    </article>`;
  }).join("");

  const currentOpponent = active ? superstarById[currentLadderOpponent(profile, new Date())] : superstarById[opponents[0]];
  const notice = message ? `<div class="mitb-v2-notice">${message}</div>` : '';
  const summary = `<div class="mitb-v2-summary">
      <div><span>CAREER CLEARS</span><b>${ladder.clears ?? 0}</b></div>
      <div><span>BEST</span><b>${ladder.bestRung ?? 0}/${LADDER_LENGTH}</b></div>
      <div><span>LIVES</span><b class="mitb-v2-lives">${'●'.repeat(lives)}${'○'.repeat(LADDER_LIVES-lives)}</b></div>
      <div><span>RUN</span><b>${ladder.dailyCleared ? 'DONE' : active ? 'LIVE' : 'READY'}</b></div>
    </div>`;

  const commandMarkup = ladder.dailyCleared
    ? `<section class="mitb-v2-command complete"><div><span>RUN COMPLETE</span><h2>Money in the Bank Cleared</h2><p>Eight levels cleared. Your Super Pack has been awarded.</p></div><button id="ladder-back-live-events" class="mitb-v2-button secondary">BACK TO LIVE EVENTS</button></section>`
    : active
      ? `<section class="mitb-v2-command"><div class="mitb-v2-command-copy"><span>NEXT LEVEL · ${run.rung + 1}/${LADDER_LENGTH}</span><h2>${currentOpponent?.name ?? 'Opponent'}</h2><p>Playing as ${superstarById[run.superstarId]?.name ?? 'Superstar'} · ${'●'.repeat(lives)}${'○'.repeat(LADDER_LIVES-lives)} lives</p></div><button id="continue-ladder" class="mitb-v2-button">FIGHT LEVEL ${run.rung + 1}</button></section>`
      : `<section class="mitb-v2-setup"><div class="mitb-v2-setup-head"><span>CHOOSE YOUR SUPERSTAR</span><h2>${chosenStar?.name ?? 'Select a Superstar'}</h2><p>Your Superstar is locked for this run once Level 1 begins.</p></div>${selectionCarouselMarkup(unlocked, chosenId, 'ladder-select')}<button id="start-ladder" class="mitb-v2-button full">${run?.status === 'failed' ? 'RESTART AT LEVEL 1' : 'START MONEY IN THE BANK'}</button></section>`;

  root.innerHTML = `<section class="mitb-v2-screen premium-screen ${active ? 'is-active' : 'is-setup'}">
    <header class="mitb-v2-hero">
      <div class="mitb-v2-kicker">LIVE EVENT</div>
      <h1><span>MONEY IN THE</span><strong>BANK</strong></h1>
      <p>8 LEVELS · 3 LIVES · SUPER PACK ON CLEAR</p>
      ${summary}
    </header>
    ${notice}
    ${commandMarkup}
    <section class="mitb-v2-road" aria-label="Money in the Bank opponent road">
      <div class="mitb-v2-road-head"><span>TODAY'S OPPONENTS</span><b>${active ? `LEVEL ${run.rung + 1} OF ${LADDER_LENGTH}` : `${LADDER_LENGTH} LEVELS`}</b></div>
      <div class="mitb-v2-opponent-rail">${opponentRows}</div>
    </section>
    ${run?.status === 'failed' ? `<button id="new-ladder" class="mitb-v2-button full restart">RESTART MONEY IN THE BANK</button>` : ''}
  </section>`;

  wireSelectionCarousel('ladder-select', id => { selection.p1 = id; renderLadder(); });
  $("#start-ladder")?.addEventListener("click", beginLadderRun);
  $("#continue-ladder")?.addEventListener("click", startCurrentLadderMatch);
  $("#new-ladder")?.addEventListener("click", () => { ladder.activeRun = null; saveProfile(profile); renderLadder(); });
  $("#ladder-back-live-events")?.addEventListener("click", showLiveEvents);

  requestAnimationFrame(() => {
    const rail = root.querySelector('.mitb-v2-opponent-rail');
    const focus = rail?.querySelector(`[data-mitb-v2-opponent-index="${focusIndex}"]`);
    if (!rail || !focus) return;
    const left = Math.max(0, focus.offsetLeft - (rail.clientWidth - focus.offsetWidth) / 2);
    rail.scrollTo({ left, behavior: 'instant' });
  });
}

function beginKingOfTheRing() {
  const starId = selection.p1;
  if (!hasSuperstar(profile, starId)) { message = "Choose an unlocked Superstar."; renderKingOfTheRing(); return; }
  try {
    startKingOfTheRing(profile, starId, roster.map(s => s.id), Math.random);
    saveProfile(profile);
    startCurrentKingOfTheRingMatch();
  } catch (error) { message = error.message; renderKingOfTheRing(); }
}
function startCurrentKingOfTheRingMatch() {
  const run = kingOfTheRingState(profile).activeRun;
  const opponentId = currentKingOfTheRingOpponent(profile);
  if (!run || run.status !== "active" || !opponentId) { showKingOfTheRing(); return; }
  startMatch(run.superstarId, opponentId, { mode: "king-of-the-ring" });
}
function renderKingOfTheRing() {
  setChrome();
  const root = $("#game"), state = kingOfTheRingState(profile), run = state.activeRun, active = run?.status === "active";
  const unlocked = orderedUnlockedSuperstars();
  const chosenId = active || run?.status === "cleared" ? run.superstarId : (unlocked.some(s => s.id === selection.p1) ? selection.p1 : unlocked[0]?.id);
  if (chosenId) selection.p1 = chosenId;
  const chosenStar = superstarById[chosenId];
  const name = id => superstarById[id]?.name ?? id ?? "TBD";
  const field = run?.field ?? [];
  const qfPairs = field.length === 8 ? [[field[0],field[1]],[field[2],field[3]],[field[4],field[5]],[field[6],field[7]]] : [];
  const miniCard = (id, stateClass='') => id ? `<div class="kotr-bracket-superstar ${stateClass}">${superstarPreviewCardMarkup(id,'kotr-bracket-card')}<span>${name(id)}</span></div>` : `<div class="kotr-bracket-superstar tbd"><b>?</b><span>TBD</span></div>`;
  let bracket='';
  if (run && field.length === 8) {
    if (run.stage <= 0 && run.status !== 'cleared') {
      bracket = `<section class="kotr-visual-bracket quarterfinal-view" aria-label="King of the Ring Quarterfinal bracket"><div class="kotr-bracket-scroll"><div class="kotr-bracket-half left-half"><h3>QUARTERFINALS</h3><div class="kotr-qf-pair">${miniCard(qfPairs[0][0],'player')}${miniCard(qfPairs[0][1])}</div><div class="kotr-qf-pair">${miniCard(qfPairs[1][0])}${miniCard(qfPairs[1][1])}</div></div><div class="kotr-bracket-center"><span>SEMIFINAL</span><div class="kotr-connector crown">♛</div><b>FINAL</b><div class="kotr-connector crown">♛</div><span>SEMIFINAL</span></div><div class="kotr-bracket-half right-half"><h3>QUARTERFINALS</h3><div class="kotr-qf-pair">${miniCard(qfPairs[2][0])}${miniCard(qfPairs[2][1])}</div><div class="kotr-qf-pair">${miniCard(qfPairs[3][0])}${miniCard(qfPairs[3][1])}</div></div></div></section>`;
    } else if (run.stage === 1 && run.status !== 'cleared') {
      bracket = `<section class="kotr-visual-bracket semifinal-view" aria-label="King of the Ring Semifinal bracket"><div class="kotr-semi-side left">${miniCard(run.superstarId,'player current')}${miniCard(run.opponents?.[1])}</div><div class="kotr-semi-center"><span>SEMIFINALS</span><div class="kotr-bracket-crown">♛</div><b>FINAL</b></div><div class="kotr-semi-side right">${miniCard(run.cpuQuarterWinners?.[1])}${miniCard(run.cpuQuarterWinners?.[2])}</div></section>`;
    } else {
      const finalOpponentId=run.opponents?.[2] ?? run.cpuFinalist;
      bracket = `<section class="kotr-visual-bracket final-view ${run.status==='cleared'?'resolved':''}" aria-label="King of the Ring Final"><div class="kotr-finalist left">${miniCard(run.superstarId,run.status==='cleared'?'winner player':'player current')}</div><div class="kotr-final-crown"><span>KING OF THE RING</span><b>♛</b><small>${run.status==='cleared'?'CROWNED':'FINAL'}</small></div><div class="kotr-finalist right">${miniCard(finalOpponentId,run.status==='cleared'?'eliminated':'')}</div></section>`;
    }
  }


  if (run?.status === "cleared" && !run.coronationSeen && !run.rewardClaimedSetId) {
    root.innerHTML = `<section class="kotr-coronation-screen premium-screen"><div class="kotr-coronation-aura"></div><span class="kotr-coronation-kicker">KING OF THE RING · TOURNAMENT CHAMPION</span><div class="kotr-crown" aria-hidden="true">♛</div><div class="kotr-coronation-card-wrap">${superstarPreviewCardMarkup(run.superstarId,"kotr-coronation-card")}</div><h1>${name(run.superstarId)}</h1><h2>IS YOUR KING</h2><p>Three victories. One crown. ${name(run.superstarId)} stands alone as King of the Ring.</p>${bracket}<button id="claim-kotr-crown" class="start-match kotr-crown-button">CLAIM THE CROWN</button></section>`;
    $("#claim-kotr-crown")?.addEventListener("click",()=>{ markKingOfTheRingCoronationSeen(profile); saveProfile(profile); renderKingOfTheRing(); });
    return;
  }

  if (run?.status === "cleared" && run.coronationSeen && !run.rewardClaimedSetId) {
    const choices = Array.isArray(run.rewardChoices) ? run.rewardChoices : prepareKingOfTheRingReward(profile, playerReleasedCollectibleSetIds(new Date()), Math.random);
    saveProfile(profile);
    const choiceMarkup = choices.map(setId => `<button type="button" class="kotr-reward-choice" data-kotr-reward-set="${setId}">${physicalBoosterPackMarkup({setId,title:sets[setId]?.name ?? "WWE LEGACY",series:"SUPER PACK",subtitle:"BOOSTED ODDS · 1 RARE+",extraClass:"kotr-choice-pack"})}<strong>${sets[setId]?.displayName ?? sets[setId]?.name ?? setId}</strong><small>CHOOSE THIS SUPER PACK</small></button>`).join('');
    root.innerHTML = `<section class="kotr-reward-screen premium-screen"><header class="premium-hub-heading hub-kotr"><span class="premium-hub-kicker">CROWN CLAIMED</span><h1><span>CHOOSE YOUR</span> <b>REWARD</b></h1><p>Choose one boosted-odds Super Pack. The other two return to the vault.</p></header><section class="kotr-reward-king"><span>REIGNING KING</span><strong>${name(run.superstarId)}</strong><small>${state.clears} career crown${state.clears===1?'':'s'}</small></section><div class="kotr-reward-grid">${choiceMarkup}</div></section>`;
    root.querySelectorAll('[data-kotr-reward-set]').forEach(btn=>btn.addEventListener('click',()=>{
      try {
        const setId = claimKingOfTheRingReward(profile, btn.dataset.kotrRewardSet);
        saveProfile(profile);
        message = `${sets[setId]?.displayName ?? sets[setId]?.name ?? setId} Super Pack claimed. ${name(run.superstarId)} remains the reigning King of the Ring.`;
        renderKingOfTheRing();
      } catch (error) { message = error.message; renderKingOfTheRing(); }
    }));
    return;
  }

  if (run?.status === "cleared" && run.rewardClaimedSetId) {
    const claimedSet = run.rewardClaimedSetId === "legacy-auto-reward" ? null : run.rewardClaimedSetId;
    root.innerHTML = `<section class="ladder-screen kotr-screen premium-screen compact-mode-run premium-run-screen is-run-setup"><section class="feature-hero kotr-feature single-feature-hero mode-run-hero reigning-king-hero kotr-no-portrait-hero"><div class="feature-shade"></div><div class="feature-copy mode-run-hero-copy">${modeLogoMarkup("king-of-the-ring",true)}<span class="kotr-reigning-label">♛ REIGNING KING</span><h2>${name(run.superstarId)}</h2><p>${claimedSet ? `${sets[claimedSet]?.displayName ?? sets[claimedSet]?.name ?? claimedSet} Super Pack claimed.` : 'Tournament reward already claimed.'}</p></div><div class="ladder-summary mode-run-summary"><div><b>${state.clears}</b><span>Crowns</span></div><div><b>3/3</b><span>Winning Run</span></div><div><b>♛</b><span>Reigning</span></div><div><b>8</b><span>Field</span></div></div></section>${message?`<div class="mode-run-status has-message"><span>${message}</span></div>`:''}${bracket}<section class="kotr-post-crown-actions"><button id="kotr-open-packs" class="start-match kotr-open-packs">OPEN PACKS</button><button id="start-kotr" class="start-match">ENTER NEW TOURNAMENT</button></section></section>`;
    $("#kotr-open-packs")?.addEventListener("click", showBoosters);
    $("#start-kotr")?.addEventListener("click",()=>{ resetKingOfTheRing(profile); beginKingOfTheRing(); });
    return;
  }

  const statusText = run?.status === "eliminated" ? "Tournament over. One loss means elimination — enter a new bracket." : active ? `${KING_OF_THE_RING_ROUNDS[run.stage]} · ${name(currentKingOfTheRingOpponent(profile))}` : "Eight Superstars enter. Win three straight matches. One loss ends the tournament.";
  const command = active ? `<section class="mode-run-command kotr-run-command ${run.stage===2?'kotr-final-command':''}"><div class="mode-run-command-copy"><span>${KING_OF_THE_RING_ROUNDS[run.stage].toUpperCase()} · ${run.stage+1}/3</span><strong>${name(currentKingOfTheRingOpponent(profile))}</strong><small>${run.stage===2?'THE CROWN IS ON THE LINE':`${chosenStar?.name} · one loss = eliminated`}</small></div><button id="continue-kotr" class="start-match mode-run-primary">${run.stage===2?'FIGHT FOR THE CROWN':`Fight ${KING_OF_THE_RING_ROUNDS[run.stage]}`}</button></section>` : `<section class="ladder-picker horizontal-selector mode-run-picker"><div class="mode-run-picker-head"><div><span>YOUR SUPERSTAR</span><h3>${chosenStar?.name ?? 'Choose your Superstar'}</h3></div><small>Seven opponents are drawn randomly</small></div>${selectionCarouselMarkup(unlocked,chosenId,'kotr-select')}<button id="start-kotr" class="start-match mode-run-primary">${run ? 'Enter New Tournament' : 'Enter King of the Ring'}</button></section>`;
  root.innerHTML = `<section class="ladder-screen kotr-screen premium-screen compact-mode-run premium-run-screen ${active?'is-active-run':'is-run-setup'}"><section class="feature-hero kotr-feature single-feature-hero mode-run-hero kotr-no-portrait-hero"><div class="feature-shade"></div><div class="feature-copy mode-run-hero-copy">${modeLogoMarkup("king-of-the-ring",true)}<p>8-person single elimination · quarterfinal · semifinal · final.</p></div><div class="ladder-summary mode-run-summary"><div><b>${state.clears ?? 0}</b><span>Crowns</span></div><div><b>${state.bestRound ?? 0}/3</b><span>Best Run</span></div><div><b>1</b><span>Life</span></div><div><b>8</b><span>Field</span></div></div></section><div class="mode-run-status ${message?'has-message':''}"><span>${message || statusText}</span></div>${command}${bracket}</section>`;
  wireSelectionCarousel('kotr-select', id=>{ selection.p1=id; renderKingOfTheRing(); });
  $("#start-kotr")?.addEventListener("click", ()=>{ if (run) resetKingOfTheRing(profile); beginKingOfTheRing(); });
  $("#continue-kotr")?.addEventListener("click", startCurrentKingOfTheRingMatch);
}

function beginChampionshipRoad() {
  const starId = selection.p1;
  if (!hasSuperstar(profile, starId)) { message = "Choose an unlocked Superstar."; renderChampionship(); return; }
  try {
    selectChampionshipRoadSuperstar(profile, starId);
    startChampionshipRoad(profile, starId, [], Math.random, championshipDifficultyId);
    saveProfile(profile);
    startCurrentChampionshipMatch();
  } catch (error) { message = error.message; renderChampionship(); }
}
function startCurrentChampionshipMatch() {
  const state = championshipRoadState(profile);
  const starId = state.selectedSuperstarId ?? state.activeRun?.superstarId;
  const starRoad = starId ? championshipRoadForSuperstar(profile, starId) : null;
  const run = starRoad?.activeRun, opponentId = currentChampionshipOpponent(profile, starId);
  if (!run || run.status !== "active" || !opponentId) { showChampionship(); return; }
  startMatch(run.superstarId, opponentId, { mode: "championship", modifier: championshipRoadDifficultyModifier(run.difficultyId) });
}
function renderChampionship(){
  setChrome();
  const root = $("#game"), road = championshipRoadState(profile);
  const unlocked = orderedUnlockedSuperstars();
  const fallbackId = unlocked.some(s=>s.id===selection.p1) ? selection.p1 : unlocked[0]?.id;
  const chosenId = unlocked.some(s=>s.id===road.selectedSuperstarId) ? road.selectedSuperstarId : fallbackId;
  if (chosenId) { selection.p1 = chosenId; selectChampionshipRoadSuperstar(profile, chosenId); }
  const starRoad = chosenId ? championshipRoadForSuperstar(profile, chosenId) : null;
  const run = starRoad?.activeRun, active = run?.status === 'active';
  const chosenStar = superstarById[chosenId];
  if (!CHAMPIONSHIP_DIFFICULTIES[championshipDifficultyId] || !championshipDifficultyUnlocked(profile, championshipDifficultyId, chosenId)) championshipDifficultyId = starRoad?.selectedDifficulty && championshipDifficultyUnlocked(profile, starRoad.selectedDifficulty, chosenId) ? starRoad.selectedDifficulty : 'easy';
  const runDifficulty = run?.difficultyId ?? championshipDifficultyId;
  const difficulty = CHAMPIONSHIP_DIFFICULTIES[runDifficulty] ?? CHAMPIONSHIP_DIFFICULTIES.easy;
  const difficultyTabs = CHAMPIONSHIP_DIFFICULTY_ORDER.map((id)=>{
    const info=CHAMPIONSHIP_DIFFICULTIES[id], unlockedDifficulty=championshipDifficultyUnlocked(profile,id,chosenId), selected=id===runDifficulty;
    return `<button type="button" class="champ-difficulty ${selected?'active':''} ${unlockedDifficulty?'':'locked'}" data-champ-difficulty="${id}" ${active||!unlockedDifficulty?'disabled':''}><span>${info.label}</span><small>${info.hpModifier===0?'NORMAL HP':`${info.hpModifier>0?'+':''}${info.hpModifier} CPU HP`}</small>${!unlockedDifficulty?'<i>LOCKED</i>':''}</button>`;
  }).join('');
  const stage = active ? run.stage : (run?.status==='cleared' ? CHAMPIONSHIP_ROAD_LENGTH : Math.min(starRoad?.bestStageByDifficulty?.[runDifficulty]??starRoad?.bestStage??0,CHAMPIONSHIP_ROAD_LENGTH));

  /* v0.13.58 progress-aware replacement for selectionCarouselMarkup(unlocked,chosenId,'champ-select') */
  const roadSwitcher = unlocked.map(star=>{
    const career=championshipRoadForSuperstar(profile,star.id);
    const activeRun=career.activeRun;
    const progress=activeRun?.status==='cleared' ? CHAMPIONSHIP_ROAD_LENGTH : Math.min(activeRun?.stage ?? career.bestStage ?? 0,CHAMPIONSHIP_ROAD_LENGTH);
    const status=activeRun?.status==='active' ? `MATCH ${Math.min(activeRun.stage+1,CHAMPIONSHIP_ROAD_LENGTH)}` : activeRun?.status==='cleared' ? 'CLEARED' : progress>0 ? 'IN PROGRESS' : 'NEW ROAD';
    return `<button type="button" class="champ-superstar-road ${star.id===chosenId?'active':''}" data-champ-superstar="${star.id}"><strong>${star.name}</strong><span>${progress}/${CHAMPIONSHIP_ROAD_LENGTH}</span><small>${status}</small></button>`;
  }).join('');

  const roadNodes = CHAMPIONSHIP_ROAD_OPPONENTS.map((id,index)=>{
    const star=superstarById[id], nodeNumber=index+1, section=championshipRoadSectionForStage(index);
    const stateClass=index<stage?'cleared':active&&index===run.stage?'current':'locked';
    const sectionStart=CHAMPIONSHIP_ROAD_SECTIONS.find(s=>s.start===nodeNumber);
    return `${sectionStart ? `<div class="champ-road-theme theme-${sectionStart.accent}"><span>${sectionStart.label}</span>${setLogoMarkup(sectionStart.setId,'champ-road-set-logo')}<small>MATCHES ${sectionStart.start}–${sectionStart.end}</small></div>` : ''}<article class="champ-road-node ${stateClass} theme-${section.accent}" data-champ-node="${nodeNumber}"><span class="champ-road-line" aria-hidden="true"></span><button type="button" ${active&&index===run.stage?'id="continue-championship"':''} ${active&&index===run.stage?'':'disabled'}><b>${nodeNumber}</b><span class="champ-road-star">${superstarPreviewCardMarkup(id,"champ-road-superstar-card")}</span><span class="champ-road-copy"><small>${stateClass==='cleared'?'DEFEATED':stateClass==='current'?'NEXT MATCH':'LOCKED'}</small><strong>${star?.name??id}</strong><em>${section.label}</em></span><i class="champ-road-result-star">${stateClass==='cleared'?'✓':'★'}</i></button></article>`;
  }).join('');
  const nextOpponent = active ? superstarById[currentChampionshipOpponent(profile, chosenId)] : null;
  const command = active ? `<section class="champ-road-command"><div><span>${chosenStar?.name?.toUpperCase() ?? 'YOUR ROAD'} · MATCH ${run.stage+1} / ${CHAMPIONSHIP_ROAD_LENGTH}</span><strong>${nextOpponent?.name??'Opponent'}</strong><small>${difficulty.label.toUpperCase()} · ${difficulty.description}</small></div><button id="championship-fight-current" class="start-match">FIGHT MATCH ${run.stage+1}</button></section>` : run?.status==='cleared' ? `<section class="champ-road-command complete"><div><span>${chosenStar?.name?.toUpperCase() ?? 'ROAD'} COMPLETE</span><strong>${difficulty.label} conquered</strong><small>${starRoad?.unlockedDifficulties?.includes(CHAMPIONSHIP_DIFFICULTY_ORDER[CHAMPIONSHIP_DIFFICULTY_ORDER.indexOf(runDifficulty)+1]) ? `${CHAMPIONSHIP_DIFFICULTIES[CHAMPIONSHIP_DIFFICULTY_ORDER[CHAMPIONSHIP_DIFFICULTY_ORDER.indexOf(runDifficulty)+1]]?.label ?? 'Next difficulty'} is now unlocked for ${chosenStar?.name}.` : 'Championship Road complete.'}</small></div><button id="new-championship" class="start-match">START ANOTHER ROAD</button></section>` : `<section class="champ-road-player"><div><span>YOUR SUPERSTAR</span><strong>${chosenStar?.name??'Choose your Superstar'}</strong></div><button id="start-championship" class="start-match">START ${difficulty.label.toUpperCase()} ROAD</button></section>`;
  root.innerHTML=`<section class="championship-map-screen premium-screen">
    <header class="champ-road-header"><div>${modeLogoMarkup('championship',true)}</div><div class="champ-road-progress"><b>${Math.min(stage,CHAMPIONSHIP_ROAD_LENGTH)}/${CHAMPIONSHIP_ROAD_LENGTH}</b><span>${difficulty.label}</span></div></header>
    <section class="champ-superstar-roads"><div class="champ-superstar-roads-head"><span>YOUR CHAMPIONSHIP ROADS</span><small>Switch Superstar · progress is saved separately</small></div><div class="champ-superstar-road-strip">${roadSwitcher}</div></section>
    <nav class="champ-difficulty-rail" aria-label="Championship Road difficulty">${difficultyTabs}</nav>
    ${message?`<div class="mode-run-status has-message"><span>${message}</span></div>`:''}
    ${command}
    <section class="champ-road-map theme-${championshipRoadSectionForStage(Math.min(stage,CHAMPIONSHIP_ROAD_LENGTH-1)).accent}" aria-label="Championship Road map"><div class="champ-road-glow" aria-hidden="true"></div>${roadNodes}</section>
  </section>`;
  root.querySelectorAll('[data-champ-superstar]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.champSuperstar;
    selectChampionshipRoadSuperstar(profile,id);
    selection.p1=id;
    const career=championshipRoadForSuperstar(profile,id);
    championshipDifficultyId=career.activeRun?.difficultyId ?? career.selectedDifficulty ?? 'easy';
    saveProfile(profile); message=''; renderChampionship();
  }));
  root.querySelectorAll('[data-champ-difficulty]').forEach(btn=>btn.addEventListener('click',()=>{
    championshipDifficultyId=btn.dataset.champDifficulty;
    if (starRoad) starRoad.selectedDifficulty=championshipDifficultyId;
    saveProfile(profile);message='';renderChampionship();
  }));
  $("#start-championship")?.addEventListener("click",beginChampionshipRoad);
  $("#championship-fight-current")?.addEventListener("click",startCurrentChampionshipMatch);
  $("#continue-championship")?.addEventListener("click",startCurrentChampionshipMatch);
  $("#new-championship")?.addEventListener("click",()=>{
    resetChampionshipRoad(profile, chosenId);
    const idx=CHAMPIONSHIP_DIFFICULTY_ORDER.indexOf(runDifficulty), next=CHAMPIONSHIP_DIFFICULTY_ORDER[idx+1];
    if(next&&championshipDifficultyUnlocked(profile,next,chosenId))championshipDifficultyId=next;
    saveProfile(profile);renderChampionship();
  });
  if (active && run.stage > 1) requestAnimationFrame(()=>document.querySelector(`[data-champ-node="${run.stage+1}"]`)?.scrollIntoView({block:'center',behavior:'instant'}));
}
function legacyLogoMarkup(compact = false, showVersion = false) {
  return `<div class="legacy-logo ${compact ? "compact" : ""}" aria-label="WWE Legacy Collectible Card Game">
    <span class="legacy-wwe">WWE</span>
    <span class="legacy-word">LEGACY</span>
    <span class="legacy-subtitle">COLLECTIBLE CARD GAME</span>
    ${showVersion ? `<span class="legacy-version">v${BUILD_VERSION}</span>` : ""}
  </div>`;
}

function modeLogoMarkup(mode, compact = false) {
  const modes = {
    exhibition: { kicker: "ONE NIGHT · ONE MATCH", top: "EXHIBITION", bottom: "SHOWCASE" },
    ladder: { kicker: "DAILY · THREE LIVES", top: "MONEY IN THE", bottom: "BANK" },
    "king-of-the-ring": { kicker: "8 SUPERSTARS · ONE CROWN", top: "KING OF THE", bottom: "RING" },
    championship: { kicker: "24 MATCHES · FOUR DIFFICULTIES", top: "CHAMPIONSHIP", bottom: "ROAD" },
    "live-event": { kicker: "NEW EVENT EVERY DAY", top: "LIVE", bottom: "EVENTS" },
    seasons: { kicker: "LIVE CONTENT", top: "LEGACY", bottom: "SEASONS" },
    challenges: { kicker: "DAILY · WEEKLY · MILESTONES", top: "LIVE", bottom: "CHALLENGES" },
    collection: { kicker: `${playerFacingCollectionCards().length} CARDS · ${Object.keys(playerFacingSetCollections()).length} SETS`, top: "THE", bottom: "COLLECTION" },
    boosters: { kicker: "RIP · REVEAL · COLLECT", top: "BOOSTER", bottom: "VAULT" },
    decks: { kicker: "BUILD · TUNE · COMPETE", top: "DECK", bottom: "LAB" },
    profile: { kicker: "YOUR CAREER · YOUR CARDS", top: "MY", bottom: "LEGACY" }
  };
  const m = modes[mode] ?? modes.exhibition;
  return `<div class="mode-logo mode-logo-${mode} ${compact ? "compact" : ""}" aria-label="${m.top} ${m.bottom}"><small>${m.kicker}</small><span>${m.top}</span><strong>${m.bottom}</strong></div>`;
}

function liveEventBrandMarkup(event) {
  if (!event) return modeLogoMarkup("live-event", true);
  if (event.logoMode === "raw") return `<div class="event-brand-logo raw-brand" aria-label="RAW"><small>MONDAY NIGHT</small><span>RAW</span></div>`;
  if (event.logoMode === "nxt") return `<div class="event-brand-logo nxt-brand" aria-label="NXT"><small>WEDNESDAY NIGHT</small><span>NXT</span></div>`;
  if (event.logoMode === "smackdown") return `<div class="event-brand-logo smackdown-brand" aria-label="SMACKDOWN"><small>SATURDAY NIGHT</small><span>SMACKDOWN</span></div>`;
  return `${modeLogoMarkup("live-event", true)}<div class="event-name-lockup"><small>${event.dayLabel ?? "TODAY"}</small><span>${event.name}</span></div>`;
}

function modePortraits(ids = [], cls = "") {
  return `<div class="mode-portrait-stack ${cls}">${ids.filter(Boolean).map((id,index)=>`<div class="mode-portrait p${index+1}">${superstarRenderMarkup(id,superstarById[id]?.name ?? id)}</div>`).join("")}</div>`;
}

function orderedUnlockedSuperstars(excludeId = null) {
  const fav = new Set(profile?.favouriteSuperstars ?? []);
  return (profile?.unlockedSuperstars ?? []).map(id => superstarById[id]).filter(Boolean).filter(star => isPlayerVisibleSuperstar(star, profile)).filter(star => star.id !== excludeId).sort((a,b) => {
    const fd = Number(fav.has(b.id)) - Number(fav.has(a.id));
    return fd || a.name.localeCompare(b.name);
  });
}

function selectionCarouselMarkup(stars, selectedId, context, labelFor = null) {
  const fav = new Set(profile?.favouriteSuperstars ?? []);
  return `<div class="superstar-select-carousel" data-carousel="${context}">${stars.map(star => {
    const key = `${context}:${star.id}`;
    const flipped = selectDetailKeys.has(key);
    const selected = star.id === selectedId;
    return `<button type="button" class="select-superstar-card ${selected?'selected':''} ${flipped?'is-flipped':''}" data-select-context="${context}" data-select-star="${star.id}" aria-label="${star.name}. ${selected ? 'Tap again for details.' : 'Tap to select.'}"><span class="select-card-inner"><span class="select-card-face select-card-front"><span class="select-favourite">${fav.has(star.id)?'★':''}</span><span class="selection-owned-card">${superstarPreviewCardMarkup(star.id,"selection-owned-superstar-card")}</span></span><span class="select-card-face select-card-back"><strong>${star.name}</strong><span>${star.nickname}</span><b>${star.hp} HP</b><small>${star.archetype.replaceAll('-', ' ')}</small><em>${star.ability?.name ?? ''}</em><p>${star.ability?.text ?? ''}</p><i>TAP AGAIN FOR CARD</i></span></span></button>`;
  }).join('')}</div>`;
}

function wireSelectionCarousel(context, onPick) {
  document.querySelectorAll(`[data-select-context="${context}"]`).forEach(btn => btn.addEventListener('click', () => {
    const carousel = btn.closest(`.superstar-select-carousel[data-carousel="${context}"]`);
    const preservedScrollLeft = carousel?.scrollLeft ?? 0;
    const restoreScroll = () => requestAnimationFrame(() => {
      const replacement = document.querySelector(`.superstar-select-carousel[data-carousel="${context}"]`);
      if (replacement) replacement.scrollLeft = preservedScrollLeft;
    });
    const starId = btn.dataset.selectStar;
    const key = `${context}:${starId}`;
    const wasSelected = btn.classList.contains('selected');
    if (!wasSelected) {
      for (const existing of [...selectDetailKeys]) if (existing.startsWith(`${context}:`)) selectDetailKeys.delete(existing);
      onPick(starId);
      restoreScroll();
      return;
    }
    if (selectDetailKeys.has(key)) selectDetailKeys.delete(key); else selectDetailKeys.add(key);
    onPick(starId);
    restoreScroll();
  }));
}

function setVisualClass(setId) {
  if (setId === "hall-of-fame-series-1") return "theme-hof";
  if (setId === "evolution-series-1") return "theme-evolution";
  if (setId === "survivor-series-series-1") return "theme-survivor";
  return "theme-summerslam";
}

function setHeroSuperstars(setId) {
  if (setId === "hall-of-fame-series-1") return ["stone-cold-steve-austin", "the-undertaker", "hulk-hogan"];
  if (setId === "evolution-series-1") return ["rhea-ripley", "becky-lynch", "iyo-sky"];
  if (setId === "survivor-series-series-1") return ["bron-breakker", "drew-mcintyre", "randy-orton"];
  return ["cody-rhodes", "roman-reigns", "gunther"];
}

function renderSplash() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const returning = !!profile;
  const starter = returning ? superstarById[profile.starterId] : null;
  const launchUnlocked = (profile?.unlockedSuperstars ?? []).filter(id => roster.some(star => star.id === id)).length;
  root.innerHTML = `<section class="splash-screen premium-splash clean-launch-splash">
    <div class="splash-glow"></div>
    <div class="clean-splash-content">
      <div class="clean-splash-brand">${legacyLogoMarkup(false, true)}</div>
      <section class="season-one-ad" aria-label="Season 1 Final Boss promotion">
        <div class="season-ad-effects" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="season-ad-rock">${finalBossRockMarkup()}</div>
        <div class="season-ad-copy">
          <span class="season-ad-kicker">SEASON 1 · LEGACY BEGINS</span>
          <strong class="season-ad-title">THE FINAL<br>BOSS<br>AWAITS.</strong>
          <p>Climb the 100-tier Season Road to assemble <b>The Final Boss</b>. Exclusive moves, his Action, Finisher and Entrance unlock along the way. Tier 100 unlocks the Foil The Rock — Final Boss Superstar card.</p>
          <div class="season-ad-footer"><b>SEASON COMPLETION EXCLUSIVE</b><em>TIER 100</em></div>
        </div>
        <span class="season-ad-watermark" aria-hidden="true">SEASON 1</span>
      </section>
      <div class="clean-splash-profile">
        <span>${returning ? "WELCOME BACK" : "NEW PLAYER"}</span>
        <strong>${returning ? "Continue Your Legacy" : "Begin your WWE Legacy"}</strong>
        <small>${returning ? `${launchUnlocked}/${roster.length} available Superstars unlocked · Season progress saved locally` : "Choose your first World Champion, receive their full starter deck, then discover the live Season 1 booster sets."}</small>
      </div>
      <button id="enter-legacy" class="legacy-enter">${returning ? "ENTER WWE LEGACY" : "START NEW LEGACY"}</button>
      <small class="splash-local-note">Local single-player profile · no online account required</small>
    </div>
  </section>`;

  $("#enter-legacy")?.addEventListener("click", () => {
    if (profile) showMainMenu();
    else { screen = "starter"; renderStarter(); }
  });
}

function renderMainMenu() {
  setChrome();
  const root = $("#game");
  const starter = superstarById[profile.starterId];
  const allBoosterCredits = openablePackCount(profile);
  const seasonProgress = seasonLevelProgress(profile);
  const visibleCards = playerFacingCollectionCards();
  const ownedUnique = visibleCards.filter(card => ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil") > 0).length;
  const ownedCopies = visibleCards.reduce((sum, card) => sum + ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil"), 0);
  const launchUnlocked = (profile.unlockedSuperstars ?? []).filter(id => roster.some(star => star.id === id)).length;
  const nextSeasonTier = Math.min(SEASON_TIER_COUNT, seasonProgress.tier + 1);
  const tierXpRemaining = seasonProgress.tier >= SEASON_TIER_COUNT ? 0 : Math.max(0, seasonProgress.needed - seasonProgress.intoTier);
  const tierProgressLabel = seasonProgress.tier >= SEASON_TIER_COUNT
    ? `TIER ${SEASON_TIER_COUNT} COMPLETE`
    : seasonProgress.tier === 0 ? `START → TIER 1` : `TIER ${seasonProgress.tier} → TIER ${nextSeasonTier}`;
  const tierProgressDetail = seasonProgress.tier >= SEASON_TIER_COUNT ? `FINAL BOSS UNLOCKED` : `${tierXpRemaining} XP TO NEXT TIER`;

  root.innerHTML = `<section class="main-menu-screen premium-screen legacy-home-v3">
    <section class="legacy-home-stage" aria-label="WWE Legacy home">
      <div class="legacy-stage-grid" aria-hidden="true"></div>
      <span class="legacy-stage-wordmark">LEGACY</span>
      <div class="legacy-stage-superstar">${portraitMarkup(starter.id,starter.name)}</div>
      <div class="legacy-stage-copy">
        <span class="legacy-stage-kicker">WWE LEGACY · SEASON ONE</span>
        <h1>OWN THE<br><b>RING.</b></h1>
        <p><strong>${starter.name}</strong><span>${starter.nickname || starter.archetype.replaceAll('-', ' ')}</span></p>
        <button id="menu-play" class="legacy-stage-cta"><b>ENTER THE RING</b><i>›</i></button>
      </div>
      <div class="legacy-stage-stats">
        <span><small>SUPERSTARS</small><b>${launchUnlocked}/${roster.length}</b></span>
        <span><small>COLLECTION</small><b>${ownedUnique}/${visibleCards.length}</b></span>
        <span><small>SEASON</small><b>TIER ${seasonProgress.tier}</b></span>
      </div>
    </section>

    <button id="menu-season-overview" class="legacy-season-event ${attentionClass("seasons")}" aria-label="Open Season 1 hub">${attentionBadge("seasons")}
      <span class="legacy-season-rock">${finalBossRockMarkup()}</span>
      <span class="legacy-season-copy">
        <em><i></i> THE ROAD TO THE FINAL BOSS</em>
        ${homeHubSplitTitle("SEASON", "ONE")}
        <span><b>${tierProgressLabel}</b><small>${tierProgressDetail}</small></span>
        <span class="legacy-season-progress season-home-progress"><i style="width:${seasonProgress.percent}%"></i></span>
        <small class="legacy-season-foot">${seasonProgress.intoTier} / ${seasonProgress.needed} XP · TIER 100 · THE FINAL BOSS</small>
      </span>
    </button>

    ${message ? `<p class="menu-message legacy-home-message">${message}</p>` : ""}

    <section class="legacy-command-rack legacy-home-destinations" aria-label="WWE Legacy destinations">
      <button id="menu-decks" class="legacy-command-tile command-decks"><span class="legacy-command-photo">${menuSuperstarPhotoMarkup("seth-rollins","Seth Rollins")}</span><span class="legacy-command-glow"></span><span class="legacy-command-copy"><em>BUILD YOUR ROSTER</em>${homeHubSplitTitle("DECK", "LAB")}<small>Build · optimize · save</small><b>OPEN <i>›</i></b></span></button>
      <button id="menu-challenges" class="legacy-command-tile command-challenges ${attentionClass("challenges")}">${attentionBadge("challenges")}<span class="legacy-command-photo">${menuSuperstarPhotoMarkup("becky-lynch","Becky Lynch")}</span><span class="legacy-command-glow"></span><span class="legacy-command-copy"><em>EARN REWARDS</em>${homeHubSplitTitle("MY", "CHALLENGES")}<small>Daily · weekly · Season XP</small><b>OPEN <i>›</i></b></span></button>
      <button id="menu-boosters" class="legacy-command-tile command-packs ${attentionClass("boosters")}">${attentionBadge("boosters")}<span class="legacy-command-photo">${menuSuperstarPhotoMarkup("rhea-ripley","Rhea Ripley")}</span><span class="legacy-command-glow"></span><span class="legacy-command-copy"><em>${allBoosterCredits} AVAILABLE</em>${homeHubSplitTitle("OPEN", "PACKS")}<small>Rip · reveal · collect</small><b>OPEN <i>›</i></b></span></button>
      <button id="menu-store" class="legacy-command-tile command-store"><span class="legacy-command-photo">${menuSuperstarPhotoMarkup("stone-cold-steve-austin","Stone Cold Steve Austin")}</span><span class="legacy-command-glow"></span><span class="legacy-command-copy"><em>DAILY ROTATION</em>${homeHubSplitTitle("MY", "STORE")}<small>Boosters · Superstar unlocks</small><b>OPEN <i>›</i></b></span></button>
      <button id="menu-owned-collection" class="legacy-command-tile command-collection"><span class="legacy-command-photo">${menuSuperstarPhotoMarkup("liv-morgan","Liv Morgan")}</span><span class="legacy-command-glow"></span><span class="legacy-command-copy"><em>${ownedCopies} OWNED COPIES</em>${homeHubSplitTitle("MY", "COLLECTION")}<small>Owned cards · favourites · foils</small><b>OPEN <i>›</i></b></span></button>
      <button id="menu-profile" class="legacy-command-tile command-profile"><span class="legacy-command-photo">${menuSuperstarPhotoMarkup(starter.id,starter.name)}</span><span class="legacy-command-glow"></span><span class="legacy-command-copy"><em>YOUR CAREER</em>${homeHubSplitTitle("MY", "LEGACY")}<small>Progress · records · profile</small><b>OPEN <i>›</i></b></span></button>
    </section>
  </section>`;
  $("#menu-season-overview")?.addEventListener("click", showSeasons);
  $("#menu-owned-collection")?.addEventListener("click", showOwnedCollection);
  $("#menu-play")?.addEventListener("click", showPlayMenu);
  $("#menu-boosters")?.addEventListener("click", showBoosters);
  $("#menu-decks")?.addEventListener("click", () => showDeckBuilder());
  $("#menu-challenges")?.addEventListener("click", showChallenges);
  $("#menu-profile")?.addEventListener("click", showProfile);
  $("#menu-store")?.addEventListener("click", showStore);
  refreshSeasonClocks();
}

function renderPlayMenu() {
  setChrome();
  const root = $("#game");
  const now = new Date();
  const towers = activeLiveEventTowers(now);
  const dailyTower = towers.find(tower => tower.cadence === "daily") ?? towers[0];
  const dailyState = dailyTower ? liveEventTowerState(profile, dailyTower.key, now)?.state : null;
  const liveLabel = dailyState?.cleared ? "COMPLETE" : dailyState?.activeRun?.status === "active" ? `MATCH ${dailyState.activeRun.stage + 1}/${LIVE_EVENT_LENGTH}` : "LIVE NOW";
  const kotrHub = kingOfTheRingState(profile);
  const reigningKingId = kotrHub.reigningKingId && superstarById[kotrHub.reigningKingId] ? kotrHub.reigningKingId : null;
  const reigningKingName = reigningKingId ? superstarById[reigningKingId].name : null;
  const kotrDefaultPortrait = portraitMarkup("gunther","Gunther");
  root.innerHTML = `<section class="play-menu-screen premium-screen legacy-play-v3">
    <header class="legacy-play-heading"><span>PLAY</span><h2>CHOOSE YOUR PATH</h2><p>Four ways to build your WWE Legacy.</p></header>
    <div class="legacy-mode-stack">
      <article id="play-live-event" role="button" tabindex="0" class="legacy-mode-banner mode-live-event"><span class="legacy-mode-beams" aria-hidden="true"></span><span class="legacy-mode-superstar">${portraitMarkup(dailyTower?.event.heroId ?? "brock-lesnar", superstarById[dailyTower?.event.heroId]?.name ?? "Live Events")}</span><span class="legacy-mode-copy"><em>DAILY TOWER · ${liveLabel}</em>${modeLogoMarkup("live-event",true)}<small>${dailyTower?.event.name.toUpperCase() ?? "TODAY'S TOWER"} · ${LIVE_EVENT_LENGTH} FIGHTS · SUPER PACK ON CLEAR</small><b>ENTER LIVE EVENTS<i>›</i></b></span><span class="legacy-mode-number" aria-hidden="true">01</span></article>
      <article id="play-exhibition" role="button" tabindex="0" class="legacy-mode-banner mode-exhibition"><span class="legacy-mode-beams" aria-hidden="true"></span><span class="legacy-mode-superstar">${portraitMarkup("cody-rhodes","Cody Rhodes")}</span><span class="legacy-mode-copy"><em>ONE NIGHT · ONE MATCH</em>${modeLogoMarkup("exhibition",true)}<small>OWNED SUPERSTAR · RANDOM CPU FROM ${Math.max(0,roster.length-1)} RIVALS</small><b>PLAY EXHIBITION<i>›</i></b></span><span class="legacy-mode-number" aria-hidden="true">02</span></article>
      <article id="play-kotr" role="button" tabindex="0" class="legacy-mode-banner mode-kotr ${reigningKingId?'has-reigning-king':''}"><span class="legacy-mode-beams" aria-hidden="true"></span><span class="legacy-mode-superstar">${reigningKingId ? portraitMarkup(reigningKingId,reigningKingName) : kotrDefaultPortrait}</span><span class="legacy-mode-copy"><em>${reigningKingName ? `♛ REIGNING KING · ${reigningKingName.toUpperCase()}` : '8 SUPERSTARS · SINGLE ELIMINATION'}</em>${modeLogoMarkup("king-of-the-ring",true)}<small>QUARTERFINAL → SEMIFINAL → FINAL · ONE LOSS AND YOU'RE OUT</small><b>${reigningKingName?'RETURN TO THE THRONE':'ENTER THE TOURNAMENT'}<i>›</i></b></span><span class="legacy-mode-number" aria-hidden="true">03</span></article>
      <article id="play-championship" role="button" tabindex="0" class="legacy-mode-banner mode-championship"><span class="legacy-mode-beams" aria-hidden="true"></span><span class="legacy-mode-superstar">${portraitMarkup("roman-reigns","Roman Reigns")}</span><span class="legacy-mode-copy"><em>24 MATCHES · FOUR DIFFICULTIES</em>${modeLogoMarkup("championship",true)}<small>EASY → NORMAL → HARD → HARDCORE</small><b>START THE ROAD<i>›</i></b></span><span class="legacy-mode-number" aria-hidden="true">24</span></article>
    </div>
  </section>`;
  const wireModeCard = (selector, action) => { const el = $(selector); el?.addEventListener("click", action); el?.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); action(); } }); };
  wireModeCard("#play-live-event", showLiveEvents);
  wireModeCard("#play-exhibition", showSetup);
  wireModeCard("#play-kotr", showKingOfTheRing);
  wireModeCard("#play-championship", showChampionship);
}


function renderRules() {
  setChrome();
  const root = $("#game");
  const nav = GAME_RULE_SECTIONS.map(section => `<button type="button" class="rules-nav-chip" data-rule-jump="${section.id}"><span>${section.group}</span><strong>${section.title}</strong></button>`).join("");
  const pinTable = `<div class="rules-reference-table pin-reference-table">${PIN_CHANCE_TABLE.map(([hp,chance]) => `<span>${hp}</span><b>${chance}</b>`).join("")}</div>`;
  const liveSchedule = `<div class="rules-reference-table live-schedule-table">${LIVE_EVENT_WEEK.map(([day,event]) => `<span>${day}</span><b>${event}</b>`).join("")}</div>`;
  const sections = GAME_RULE_SECTIONS.map((section,index) => `<details class="rulebook-section" id="rule-${section.id}" ${index < 2 ? "open" : ""}>
    <summary><span>${section.group}</span><div><strong>${section.title}</strong><small>${section.summary}</small></div><i>+</i></summary>
    <div class="rulebook-section-body">
      ${section.items.map(([title,body]) => `<article class="rulebook-rule"><strong>${title}</strong><p>${body}</p></article>`).join("")}
      ${section.id === "pins" ? `<section class="rules-inline-reference"><div><span>PIN CHANCE</span><strong>Actual HP table</strong></div>${pinTable}</section>` : ""}
      ${section.id === "modes" ? `<section class="rules-inline-reference"><div><span>LIVE EVENTS</span><strong>Daily brand schedule</strong></div>${liveSchedule}</section>` : ""}
    </div>
  </details>`).join("");
  root.innerHTML = `<section class="rules-screen premium-screen">
    ${premiumHubHeading("GAME", "RULES", "OFFICIAL RULEBOOK", "Match flow · cards · modes · progression", "hub-legacy")}
    <section class="rules-hero">
      <div class="rules-hero-copy"><span>MY LEGACY · OFFICIAL RULEBOOK</span><h2>Rules & How to Play</h2><p>The live WWE Legacy rules in one place. Card text can create explicit exceptions, but Foils never change gameplay values.</p></div>
      <div class="rules-hero-stats"><span><b>60</b><small>DECK PAGES</small></span><span><b>5</b><small>LEAD OFF</small></span><span><b>4</b><small>METHODS</small></span><span><b>8</b><small>COUNTER STATES</small></span></div>
    </section>
    <section class="rules-jump-panel"><div class="section-title"><div><h3>Rulebook Menu</h3><small>Jump to a system, then expand any section for the full rule.</small></div><button id="rules-back" class="nav-button">Back to My Legacy</button></div><div class="rules-nav-grid">${nav}</div></section>
    <section class="rulebook-stack">${sections}</section>
    <section class="rules-footer-note"><strong>Rule precedence</strong><p>The Rulebook defines the general system. An authored Superstar, Entrance, Action or card effect may explicitly override a general rule for that interaction.</p></section>
  </section>`;
  $("#rules-back")?.addEventListener("click", showProfile);
  root.querySelectorAll("[data-rule-jump]").forEach(button => button.addEventListener("click", () => {
    const target = document.querySelector(`#rule-${button.dataset.ruleJump}`);
    if (target) { target.open = true; target.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }));
}

function careerWinPercentage(record) {
  const wins = Number(record?.wins ?? 0), losses = Number(record?.losses ?? 0), matches = wins + losses;
  return matches ? `${Math.round((wins / matches) * 100)}%` : "—";
}

function renderProfile() {
  setChrome();
  const root = $("#game");
  const starter = superstarById[profile.starterId];
  const ladder = ladderState(profile);
  const kotr = kingOfTheRingState(profile);
  const championship = championshipRoadState(profile);
  const liveEvents = weeklyLiveEventState(profile, new Date());
  const career = careerRecord(profile);
  const achievements = achievementProgress(profile);
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalMatches = career.total.wins + career.total.losses;
  const modeRecords = CAREER_MODES.map(mode => {
    const record = career.byMode[mode.id] ?? { wins: 0, losses: 0 };
    return `<article class="career-record-card"><span>${mode.label}</span><strong>${record.wins}–${record.losses}</strong><small>${careerWinPercentage(record)} WIN RATE</small></article>`;
  }).join("");
  const superstarRecords = orderedUnlockedSuperstars().map(star => {
    const record = career.bySuperstar[star.id] ?? { wins: 0, losses: 0 };
    return `<article class="career-superstar-record"><span class="career-record-headshot">${portraitMarkup(star.id,star.name)}</span><div><strong>${star.name}</strong><small>${star.nickname}</small></div><span class="career-record-score"><b>${record.wins}–${record.losses}</b><small>${careerWinPercentage(record)}</small></span></article>`;
  }).join("");
  const achievementCards = achievements.map(achievement => `<article class="career-achievement ${achievement.earned ? "earned" : "locked"}"><span class="career-achievement-medal">${achievement.earned ? "★" : "◇"}</span><div><strong>${achievement.name}</strong><p>${achievement.description}</p></div><b>${achievement.earned ? "EARNED" : "LOCKED"}</b></article>`).join("");
  root.innerHTML = `<section class="profile-screen premium-screen profile-premium profile-command-screen profile-compact-redesign">
    ${premiumHubHeading("MY", "LEGACY", "YOUR CAREER", "Records · Rulebook · save & backup", "hub-legacy")}
    <section class="profile-command-band profile-command-band-top">
      <div class="profile-command-identity"><span>CAREER RECORD</span><strong>${career.total.wins}–${career.total.losses}</strong><small>${totalMatches} matches · ${careerWinPercentage(career.total)} win rate</small></div>
      <div class="profile-compact-stats">
        <span><small>WINS</small><b>${career.total.wins}</b></span>
        <span><small>LOSSES</small><b>${career.total.losses}</b></span>
        <span><small>SUPERSTARS</small><b>${profile.unlockedSuperstars.length}/${roster.length}</b></span>
        <span><small>MITB</small><b>${ladder.clears ?? 0}</b></span>
        <span><small>TITLES</small><b>${championship.clears ?? 0}</b></span>
        <span><small>ACHIEVEMENTS</small><b>${earnedAchievements}/${achievements.length}</b></span>
      </div>
    </section>
    <section class="profile-rulebook-callout"><div><span>OFFICIAL RULEBOOK</span><strong>Rules & How to Play</strong><p>Match flow, Momentum, Counters, Pins, Submissions, Deck Lab, Foils, boosters, modes, Season progression and more.</p></div><button id="open-rulebook" class="start-match">OPEN RULEBOOK</button></section>
    <section class="premium-panel career-record-panel"><div class="section-title"><div><h3>Mode Records</h3><small>Every completed match is recorded by mode</small></div><span>${totalMatches} MATCHES</span></div><div class="career-mode-records">${modeRecords}</div></section>
    <section class="premium-panel kotr-career-panel"><div class="section-title"><div><h3>King of the Ring</h3><small>Tournament history</small></div><span>${kotr.clears ?? 0} CROWN${(kotr.clears ?? 0)===1?'':'S'}</span></div>${kotr.reigningKingId && superstarById[kotr.reigningKingId] ? `<div class="kotr-career-king"><span class="kotr-career-portrait">${portraitMarkup(kotr.reigningKingId,superstarById[kotr.reigningKingId].name)}</span><div><small>♛ REIGNING KING</small><strong>${superstarById[kotr.reigningKingId].name}</strong><span>${kotr.reigningKingAt ? `Crowned ${new Date(kotr.reigningKingAt).toLocaleDateString()}` : 'Tournament champion'}</span></div><b>${kotr.clears ?? 0}<small>CAREER CROWNS</small></b></div>` : `<div class="kotr-career-empty"><span>♛</span><div><strong>No King crowned yet</strong><small>Win three straight matches in King of the Ring.</small></div></div>`}</section>
    <section class="premium-panel career-record-panel"><div class="section-title"><div><h3>Superstar Records</h3><small>Wins and losses with every unlocked Superstar</small></div><span>${profile.unlockedSuperstars.length} UNLOCKED</span></div><div class="career-superstar-records">${superstarRecords}</div></section>
    <section class="premium-panel career-achievements-panel"><div class="section-title"><div><h3>Achievements</h3><small>Career milestones and mode accomplishments</small></div><span>${earnedAchievements}/${achievements.length} EARNED</span></div><div class="career-achievement-grid">${achievementCards}</div></section>
    <section class="legacy-settings premium-panel profile-tools-panel"><div class="section-title"><h3>Career Tools</h3><span>LOCAL SAVE</span></div><p class="career-tracking-note">Match record tracking began with WWE Legacy v${career.trackingSinceBuild ?? "0.12.78"}. Earlier wins and losses are not estimated.</p><div class="profile-actions"><a class="nav-button profile-tool-link" href="./tools/card-art-studio.html">Card Art Studio</a></div>
      ${(() => { const meta = backupMetadata(); const rollback = loadImportRollback(); const last = meta?.lastBackupAt ? new Date(meta.lastBackupAt).toLocaleString() : "No external backup yet"; return `<section class="save-backup-panel"><div class="save-backup-head"><div><span>SAVE & BACKUP</span><strong>Protect Your Legacy</strong><p>Your live profile saves automatically on this device. External backup uses one rolling file: <b>${SAVE_FILENAME}</b>. Back up again to the same Files location and replace that file instead of building a dated archive.</p></div><em>${last}</em></div><div class="save-backup-actions"><button id="export-save" class="start-match">BACK UP TO FILES</button><button id="import-save" class="nav-button">IMPORT FROM FILES</button>${rollback ? `<button id="restore-pre-import" class="nav-button save-rollback-button">UNDO LAST IMPORT</button>` : ""}</div>${pendingSaveImport ? `<div class="save-import-confirm"><span>BACKUP VALIDATED</span><strong>${pendingSaveImport.profile.unlockedSuperstars?.length ?? 0} Superstars · ${(pendingSaveImport.profile.universePoints ?? 0).toLocaleString()} UP</strong><p>${pendingSaveImport.sourceBuildVersion ? `Created by v${pendingSaveImport.sourceBuildVersion}` : "Legacy profile backup"}${pendingSaveImport.exportedAt ? ` · ${new Date(pendingSaveImport.exportedAt).toLocaleString()}` : ""}. Your current profile will be kept as a one-step rollback until the next import.</p><div><button id="cancel-import-save" class="nav-button">Cancel</button><button id="confirm-import-save" class="start-match">REPLACE CURRENT SAVE</button></div></div>` : ""}<small class="save-backup-note">On iPhone, the native share/file interface controls the final Files location. WWE Legacy always uses the same primary filename so you can replace the existing backup rather than create dated copies.</small></section>`; })()}
      <article class="option-row app-update-row"><div><strong>App Update</strong><p>${appUpdateState.available ? `Installed v${BUILD_VERSION} · Latest v${appUpdateState.latest}${appUpdateState.deferred ? " · waiting for match to finish" : ""}` : appUpdateState.error ? `Installed v${BUILD_VERSION} · latest version could not be checked` : `Installed v${BUILD_VERSION} · ${appUpdateState.checking ? "checking for update…" : "tap to verify the live build"}`}</p></div>${appUpdateState.available && !appUpdateState.deferred ? `<button id="apply-app-update" class="start-match">UPDATE NOW</button>` : `<button id="check-app-update" class="nav-button" ${appUpdateState.checking ? "disabled" : ""}>${appUpdateState.checking ? "CHECKING…" : "CHECK FOR UPDATE"}</button>`}</article>
      <article class="option-row danger-zone"><div><strong>Reset Progress</strong><p>Erase this device's WWE Legacy profile, collection, unlocked Superstars, Season progress, career record, achievements and saved decks.</p></div>${optionsResetArmed ? `<div class="reset-confirm-actions"><button id="cancel-reset-progress" class="nav-button">Cancel</button><button id="confirm-reset-progress" class="start-match danger">CONFIRM RESET</button></div>` : `<button id="reset-progress" class="nav-button danger">Reset Progress</button>`}</article>${optionsResetArmed ? `<p class="reset-warning"><b>Testing reset armed.</b> This cannot be undone on this device.</p>` : ""}<div class="option-row"><div><strong>Build</strong><p>WWE Legacy: Collectible Card Game v${BUILD_VERSION}</p></div></div></section>
  </section>`;
  $("#open-rulebook")?.addEventListener("click", showRules);
  $("#export-save")?.addEventListener("click", async () => {
    try {
      const result = await exportSaveToFiles(profile);
      message = result.method === "file-picker" ? `Backup saved to ${SAVE_FILENAME}.` : `Backup prepared as ${SAVE_FILENAME}. In Files, replace the existing file when prompted.`;
    } catch (error) {
      message = error?.name === "AbortError" ? "Backup cancelled." : `Backup failed: ${error?.message ?? "unknown error"}`;
    }
    renderProfile();
  });
  $("#import-save")?.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        pendingSaveImport = await readSaveFile(file);
        message = "Backup validated. Review it below before replacing your current save.";
      } catch (error) {
        pendingSaveImport = null;
        message = `Import rejected: ${error?.message ?? "invalid WWE Legacy save"}`;
      }
      renderProfile();
    }, { once: true });
    input.click();
  });
  $("#cancel-import-save")?.addEventListener("click", () => { pendingSaveImport = null; message = "Import cancelled. Your current save was not changed."; renderProfile(); });
  $("#confirm-import-save")?.addEventListener("click", () => {
    if (!pendingSaveImport?.profile) return;
    saveImportRollback(profile);
    profile = pendingSaveImport.profile;
    saveProfile(profile);
    pendingSaveImport = null;
    game = null;
    deckBuilderStarId = profile.starterId;
    deckDraft = null;
    selection = { p1: profile.starterId, p2: profile.starterId === "roman-reigns" ? "cm-punk" : "roman-reigns" };
    lastMatchup = { ...selection };
    message = "Backup restored successfully. Your previous local save is available as Undo Last Import.";
    renderProfile();
  });
  $("#restore-pre-import")?.addEventListener("click", () => {
    const rollback = loadImportRollback();
    if (!rollback?.profile) { message = "No pre-import rollback is available."; renderProfile(); return; }
    profile = rollback.profile;
    saveProfile(profile);
    clearImportRollback();
    pendingSaveImport = null;
    game = null;
    deckBuilderStarId = profile.starterId;
    deckDraft = null;
    selection = { p1: profile.starterId, p2: profile.starterId === "roman-reigns" ? "cm-punk" : "roman-reigns" };
    lastMatchup = { ...selection };
    message = "Previous local save restored.";
    renderProfile();
  });
  $("#check-app-update")?.addEventListener("click", () => { checkForAppUpdate({ manual: true, autoApply: false }); });
  $("#apply-app-update")?.addEventListener("click", () => { applyAppUpdate(); });
  $("#reset-progress")?.addEventListener("click",()=>{optionsResetArmed=true;message="Confirm the reset below to erase all local progress.";renderProfile();});
  $("#cancel-reset-progress")?.addEventListener("click",()=>{optionsResetArmed=false;message="Reset cancelled.";renderProfile();});
  $("#confirm-reset-progress")?.addEventListener("click",()=>{resetProfile();profile=null;game=null;optionsResetArmed=false;selection={p1:"cm-punk",p2:"roman-reigns"};lastMatchup={...selection};lastPack=null;pendingUpgrades=[];message="";showSplash();});
}


function chooseStarter(starId) {
  profile = createProfile(starId);
  saveProfile(profile);
  selection.p1 = starId;
  selection.p2 = starId === "roman-reigns" ? "cm-punk" : "roman-reigns";
  lastMatchup = { ...selection };
  screen = "menu";
  message = "";
  renderMainMenu();
}

function renderStarter() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const choices = STARTER_CHOICES.map(id => superstarById[id]).filter(Boolean);
  const titleFor = id => id === "cm-punk" ? "UNDISPUTED WWE CHAMPION" : "WORLD HEAVYWEIGHT CHAMPION";
  root.innerHTML = `<section class="starter-screen onboarding-screen">
    <div class="onboarding-brand">${legacyLogoMarkup(true)}</div>
    <div class="starter-hero"><span class="eyebrow">FIRST-TIME ONBOARDING</span><h2>Choose Your Champion</h2><p>Pick your starter Superstar.</p></div>
    <div class="starter-choice-grid champion-choice-grid">${choices.map(star => `<button class="starter-choice champion-starter" data-starter="${star.id}">
      <div class="starter-photo">${superstarVisualMarkup(star.id,star.name)}</div>
      <span class="champion-tag">${titleFor(star.id)}</span>
      <strong>${star.name}</strong><small>${star.nickname}</small>
      <b class="choose-starter-cta">CHOOSE ${star.name.toUpperCase()}</b>
    </button>`).join("")}</div>

  </section>`;
  root.querySelectorAll("[data-starter]").forEach(btn => btn.addEventListener("click", () => chooseStarter(btn.dataset.starter)));
}


function renderSetup() {
  setChrome();
  const root = $("#game");
  const unlocked = orderedUnlockedSuperstars();
  if (!unlocked.some(s => s.id === selection.p1)) selection.p1 = unlocked[0]?.id ?? profile.starterId;
  const p1 = superstarById[selection.p1];
  root.innerHTML = `<section class="setup-screen premium-screen exhibition-screen compact-match-select exhibition-select-redesign">
    <header class="exhibition-select-hero"><div>${modeLogoMarkup("exhibition")}</div><p>Choose your Superstar. Your opponent is drawn at random.</p></header>
    <section class="selector-panel horizontal-selector exhibition-selector-panel"><div class="selector-title"><span>YOUR SUPERSTAR</span><strong>${p1?.name ?? 'Choose Superstar'}</strong></div>${selectionCarouselMarkup(unlocked,selection.p1,'exhibition-p1')}<button id="confirm-p1" class="select-confirm">${`CONFIRM ${p1?.name?.toUpperCase() ?? 'SUPERSTAR'}`}</button></section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}
  </section>`;
  wireSelectionCarousel('exhibition-p1', id => {
    if (selection.p1 !== id) { selection.p1 = id; selection.p2 = null; exhibitionConfirmed.p1 = false; }
    renderSetup();
  });
  $("#confirm-p1")?.addEventListener('click', () => {
    const opponent = randomExhibitionOpponent(selection.p1);
    if (!opponent) { message = "No eligible Exhibition opponent deck is available."; renderSetup(); return; }
    exhibitionConfirmed.p1 = true;
    selection.p2 = opponent;
    startMatch(selection.p1, opponent, { mode: "exhibition" });
  });
}

function rarityStars(level) { return "★".repeat(Math.max(1, Math.min(4, Number(level) || 1))); }

function playerFacingRulesText(text = "") {
  return String(text)
    .replace(/cite[^]+/g, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/(?:WWE (?:has |specifically )?(?:documented|identifies|lists)[^.]*\.|Seth (?:has |continues to |used it as )[^.]*\.)/gi, "")
    .replace(/\b(?:Shared )?canonical(?: shared card| shared Chokeslam| move)?;?\s*/gi, "")
    .replace(/^New canonical(?: shared card| shared Chokeslam)?;?\s*/i, "")
    .replace(/^New canonical\s*/i, "")
    .replace(/\bgrounds opponent\b/gi, "Ground your opponent")
    .replace(/\bgrounds\b/gi, "Ground your opponent")
    .replace(/\bgrounded opponent,?\s*/gi, "Requires a grounded opponent. ")
    .replace(/\bground\s*\+\s*Stun\s*(\d+)/gi, "Ground your opponent. Stun $1")
    .replace(/\s*;\s*/g, ". ")
    .replace(/\s{2,}/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();
}

function cardRulesText(card) {
  if (card.kind === "move" && card.rulesText) return playerFacingRulesText(card.rulesText);
  if (card.kind === "superstar") { const star=superstarById[card.superstarId]; const a=star?.ability; return playerFacingRulesText(`${a?.name ?? card.abilityName ?? "Superstar Ability"}: ${a?.text ?? card.abilityText ?? "Ability details pending."}`); }
  if (card.kind === "entrance") { const star=superstarById[card.superstarId]; return playerFacingRulesText(card.rulesText ?? star?.entrance?.rulesText ?? "Entrance effect pending."); }
  if (card.kind === "momentum") return `Gain ${card.amount ?? 1} permanent ${(card.method ?? "Momentum")[0].toUpperCase() + (card.method ?? "momentum").slice(1)} Momentum. Momentum is not spent when a Move is played.`;
  if (["action", "support", "manager"].includes(card.kind)) return playerFacingRulesText(card.abilityText ?? card.effectText ?? card.rulesText ?? card.kind);
  return collectionText(card);
}

function cardFrontBottom(card) {
  if (card.kind === "move") return `<span><small>COST</small><b>${card.cost ?? 0}</b></span><span><small>DAMAGE</small><b>${card.damage ?? 0}</b></span>`;
  if (card.kind === "superstar") return `<span><small>HP</small><b>${card.hp ?? superstarById[card.superstarId]?.hp ?? "—"}</b></span><span><small>STARS</small><b class="rarity-stars">${rarityStars(card.rarity ?? 4)}</b></span>`;
  if (card.kind === "momentum") return `<span><small>METHOD</small><b>${(card.method ?? "MO").slice(0,2).toUpperCase()}</b></span><span><small>GAIN</small><b>+${card.amount ?? 1}</b></span>`;
  return `<span><small>TYPE</small><b>${card.kind.toUpperCase()}</b></span><span><small>STARS</small><b class="rarity-stars">${rarityStars(card.rarity ?? 1)}</b></span>`;
}

const MOMENTUM_FRONT_META = {
  strength: { short: "ST", icon: "M5 20h14M7 16h10M9 12h6M11 8h2" },
  strike: { short: "SR", icon: "M12 3l2.2 5.1L20 6l-3.1 4.6L22 13l-5.4 1.2L18 20l-5-3.1L9 22l-1.1-5.8L2 17l4-4-4-3 5.8-1L6 3l5 3.2z" },
  technical: { short: "TE", icon: "M4 8h16M4 16h16M8 4v16M16 4v16M6 6l12 12M18 6L6 18" },
  agility: { short: "AG", icon: "M4 17c4-1 7-4 9-8 1 4 3 6 7 8M5 12c3 0 5-2 7-5M8 20c4-2 7-5 9-9" }
};
function momentumMockupMarkup(card) {
  const method = String(card.method || "strength").toLowerCase();
  const label = method[0].toUpperCase() + method.slice(1);
  const meta = MOMENTUM_FRONT_META[method] ?? MOMENTUM_FRONT_META.strength;
  return `<span class="momentum-mock momentum-${method}">
    <span class="momentum-arena-lines" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="momentum-topline"><b>WWE LEGACY</b><em>MOMENTUM</em></span>
    <span class="momentum-method-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${meta.icon}"/></svg></span>
    <span class="momentum-value">+${card.amount ?? 1}</span>
    <span class="momentum-method"><b>${label}</b></span>
  </span>`;
}

function layeredFrontRequirementText(card) {
  if (!card || card.kind !== "move" || card.finisher) return "";
  return Object.entries(card.requirements ?? {})
    .filter(([, amount]) => Number(amount) > 0)
    .map(([method, amount]) => `◆ ${Number(amount)} ${String(method).toUpperCase()}`)
    .join("   •   ");
}

function layeredFrontOverlayMarkup(card) {
  if (!card) return "";
  const rarity = rarityStars(card.rarity ?? 1).split("").join("<br>");
  const nameLength = String(card.name ?? "").length;
  const nameClass = nameLength > 30 ? "is-name-xl" : nameLength > 22 ? "is-name-long" : "";
  const typeLabel = card.finisher ? "FINISHER" : card.trademark ? "TRADEMARK" : card.signature ? "SIGNATURE" : String(card.kind ?? "CARD").toUpperCase();
  if (card.kind === "superstar") {
    return `<span class="ccg-superstar-live-overlay" aria-hidden="true">
      <span class="ccg-superstar-live-rarity">${rarity}</span>
      ${superstarNameplateMarkup(card.superstarId, card.name, card.setId, "ccg-superstar-live-nameplate")}
    </span>`;
  }
  if (card.kind === "move") {
    const req = layeredFrontRequirementText(card);
    const moveType = String(card.moveType || card.method || "move").toUpperCase();
    return `<span class="ccg-live-front-data ccg-live-front-move" aria-hidden="true">
      <span class="ccg-live-rarity">${rarity}</span>
      <strong class="ccg-live-name ${nameClass}" data-card-name-marquee="1"><span class="ccg-live-name-text">${card.name}</span></strong>
      <span class="ccg-live-stat ccg-live-cost"><small>COST</small><b>${card.cost ?? 0}</b></span>
      <span class="ccg-live-stat ccg-live-damage"><small>DAMAGE</small><b>${card.damage ?? 0}</b></span>
      ${req ? `<span class="ccg-live-requirement">${req}</span>` : ""}
      <span class="ccg-live-type ${req ? "has-requirement" : ""}">MOVE • ${moveType}</span>
    </span>`;
  }
  return `<span class="ccg-live-front-data ccg-live-front-utility" aria-hidden="true">
    <span class="ccg-live-rarity">${rarity}</span>
    <strong class="ccg-live-name ${nameClass}" data-card-name-marquee="1"><span class="ccg-live-name-text">${card.name}</span></strong>
    <span class="ccg-live-type">${typeLabel}</span>
  </span>`;
}

function refreshCardNameMarquees(scope = document) {
  if (typeof document === "undefined") return;
  const hosts = scope.querySelectorAll?.('[data-card-name-marquee="1"]') ?? [];
  hosts.forEach(host => {
    const text = host.querySelector('.ccg-live-name-text');
    if (!text) return;
    host.classList.remove('is-marquee');
    host.style.removeProperty('--card-name-scroll');
    const overflow = Math.ceil(text.scrollWidth - host.clientWidth);
    if (overflow > 2) {
      host.style.setProperty('--card-name-scroll', `-${overflow}px`);
      host.classList.add('is-marquee');
    }
  });
}
let cardNameMarqueeFrame = 0;
function scheduleCardNameMarquees() {
  if (typeof document === "undefined" || typeof requestAnimationFrame === "undefined") return;
  if (cardNameMarqueeFrame) cancelAnimationFrame(cardNameMarqueeFrame);
  cardNameMarqueeFrame = requestAnimationFrame(() => { cardNameMarqueeFrame = 0; refreshCardNameMarquees(document); });
}
if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
  const cardNameMarqueeObserver = new MutationObserver(records => {
    if (records.some(record => record.addedNodes?.length)) scheduleCardNameMarquees();
  });
  cardNameMarqueeObserver.observe(document.documentElement, { childList: true, subtree: true });
  globalThis.addEventListener?.('resize', scheduleCardNameMarquees);
}

function cardArtFace(card, { eager = false } = {}) {
  const loading = eager ? "eager" : "lazy";
  const star = card.superstarId ? superstarById[card.superstarId] : null;
  const layered = layeredCardArtFor(card);
  if (layered) {
    const finished = finishedCardArtFor(card);
    const legacyFinished = legacyFinishedCardArtFor(card);
    const legacyCandidate = legacyFinished && legacyFinished !== finished ? legacyFinished : "";
    return `<img loading="${loading}" decoding="async" class="ccg-layered-card-plate ccg-load-guard" src="${layered}" alt="${card.name}" data-layered-candidate="1" data-flat-finished-art="${finished ?? ""}" data-legacy-finished-art="${legacyCandidate}" onload="this.classList.add('is-art-ready');if(this.dataset.layeredCandidate==='1'){this.closest('.ccg-card')?.classList.add('has-layered-asset');}" onerror="this.classList.remove('is-art-ready');const c=this.closest('.ccg-card');const o=c?.querySelector('.ccg-live-front-data');this.dataset.layeredCandidate='0';c?.classList.remove('is-layered-front','has-layered-asset');if(o)o.style.display='none';if(!this.dataset.flatTried&&this.dataset.flatFinishedArt){this.dataset.flatTried='1';this.src=this.dataset.flatFinishedArt;return;}if(!this.dataset.legacyTried&&this.dataset.legacyFinishedArt){this.dataset.legacyTried='1';this.src=this.dataset.legacyFinishedArt;return;}this.onerror=null;this.style.display='none';c?.classList.remove('is-full-art-finished','is-full-art-move');c?.classList.add('uses-rules-fallback','is-flipped');">`;
  }
  if (card.kind === "superstar" && card.superstarId) {
    return superstarVisualMarkup(card.superstarId, star?.name ?? card.name, "ccg-superstar-art-image");
  }
  if (card.kind === "momentum") {
    // Momentum is a live UI card family rather than a static exported front.
    // Rendering it from markup lets method colour and arena/set presentation stay vivid on mobile.
    return momentumMockupMarkup(card);
  }
  const art = artworkFor(card);
  const finished = finishedCardArtFor(card);
  const legacyFinished = legacyFinishedCardArtFor(card);
  if (finished) {
    const legacyCandidate = legacyFinished && legacyFinished !== finished ? legacyFinished : "";
    return `<img loading="${loading}" decoding="async" class="ccg-finished-card-art-image ccg-load-guard" src="${finished}" alt="${card.name}" data-finished-card-art="${card.id}" data-legacy-finished-art="${legacyCandidate}" onload="this.classList.add('is-art-ready');" onerror="this.classList.remove('is-art-ready');if(!this.dataset.legacyFinishedTried&&this.dataset.legacyFinishedArt){this.dataset.legacyFinishedTried='1';this.src=this.dataset.legacyFinishedArt;return;}this.onerror=null;this.style.display='none';const c=this.closest('.ccg-card');c?.classList.remove('is-full-art-finished','is-full-art-move');c?.classList.add('uses-rules-fallback','is-flipped');">`;
  }
  const fallback = card.name;
  return art
    ? `<img loading="${loading}" decoding="async" class="ccg-authored-card-art-image ccg-load-guard" src="${art}" alt="${card.name}" onload="this.classList.add('is-art-ready');" onerror="this.classList.remove('is-art-ready');this.onerror=null;this.style.display='none';const c=this.closest('.ccg-card');c?.classList.add('uses-rules-fallback','is-flipped');">`
    : `<span class="ccg-art-placeholder"><span class="pending-mark">WWE LEGACY</span><b>ARTWORK PENDING</b><small>${fallback}</small><em>${card.cardCode ?? card.id}</em></span>`;
}


function cardPlayRestrictionText(card) {
  if (!card) return "";
  if (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length) {
    const names = card.allowedSuperstarIds.map(id => superstarById[id]?.name ?? id);
    return `<span class="ccg-rules-restriction"><b>SUPERSTAR RESTRICTION</b> ${names.length === 1 ? `Only playable by ${names[0]}.` : `Only playable by: ${names.join(", ")}.`}</span>`;
  }
  if (Array.isArray(card.allowedFactionTags) && card.allowedFactionTags.length) {
    const names = card.allowedFactionTags.map(tag => tag === "vision" ? "The Vision" : tag.replace(/(^|[-_ ])\w/g, m => m.toUpperCase()));
    return `<span class="ccg-rules-restriction"><b>FACTION RESTRICTION</b> Only playable by ${names.join(" / ")} members.</span>`;
  }
  if (card.superstarId) {
    const name = superstarById[card.superstarId]?.name ?? card.superstarId;
    const label = card.kind === "entrance" ? "LINKED SUPERSTAR" : "SUPERSTAR RESTRICTION";
    const text = card.kind === "entrance" ? `${name}` : `Only playable by ${name}.`;
    return `<span class="ccg-rules-restriction"><b>${label}</b> ${text}</span>`;
  }
  return "";
}

function collectibleCardMarkup(card, { flipped = false, foil = false, extraClass = "", footer = "", flipAttr = "", interactive = true, eagerArt = false } = {}) {
  // Superstar and all Card Art Studio exports are premium full-art fronts.
  // Non-Superstar cards keep their generated legacy overlays only as a fallback
  // until the corresponding custom WebP exists on disk.
  const superstarFront = card.kind === "superstar";
  const moveFront = card.kind === "move";
  const layeredFront = Boolean(layeredCardArtFor(card));
  const finishedFront = !superstarFront && Boolean(finishedCardArtFor(card));
  // Until a custom front is exported, default the card to its rules/details face.
  // Momentum is a purpose-built live card face and Superstar cards have dedicated fronts.
  const authoredRawArt = Boolean(artworkFor(card));
  const missingCustomFront = !superstarFront && card.kind !== "momentum" && !finishedFront && !layeredFront && !authoredRawArt;
  const displayFlipped = missingCustomFront ? true : Boolean(flipped);
  const visualFoil = Boolean(foil || card.foil || card.kind === "entrance");
  card = applyFoilGameplay(card, visualFoil);
  const setClass = `set-${card.setId ?? "global"}`;
  const typeClass = `type-${card.kind}`;
  const finisherClass = card.finisher ? "is-finisher" : card.trademark ? "is-trademark" : card.signature ? "is-signature" : "";
  const foilClass = visualFoil ? "is-foil" : "";
  const ruleText = cardRulesText(card);
  const typeLabel = card.finisher ? "FINISHER" : card.trademark ? "TRADEMARK" : card.signature ? "SIGNATURE" : card.kind.toUpperCase();
  const subtitle = card.kind === "move"
    ? [card.method ? card.method.toUpperCase() : "", card.moveType ? (MOVE_TYPE_LABELS[card.moveType] ?? card.moveType).toUpperCase() : ""].filter(Boolean).join(" · ")
    : (card.subtitle ?? typeLabel);
  const frontMarkup = superstarFront
    ? `<span class="ccg-card-art ccg-superstar-full-art">${cardArtFace(card,{eager:eagerArt})}</span>${layeredFrontOverlayMarkup(card)}`
    : layeredFront
      ? `<span class="ccg-card-art ${moveFront ? "ccg-move-full-art" : ""}">${cardArtFace(card,{eager:eagerArt})}</span>${layeredFrontOverlayMarkup(card)}`
      : finishedFront
        ? `<span class="ccg-card-art ${moveFront ? "ccg-move-full-art" : ""}">${cardArtFace(card,{eager:eagerArt})}</span>`
        : `<span class="ccg-card-art ${moveFront ? "ccg-move-full-art" : ""}">${cardArtFace(card,{eager:eagerArt})}</span><span class="ccg-card-title"><small>${typeLabel}${visualFoil ? " · FOIL" : ""}</small><strong>${card.name}</strong></span><span class="ccg-card-stats">${cardFrontBottom(card)}</span>`;
  const rootTag = interactive ? "button" : "span";
  const rootAttrs = interactive ? `type="button" ${flipAttr} aria-label="${card.name}. ${missingCustomFront ? "Card details shown because custom front artwork is not installed." : `Tap to ${displayFlipped ? "view artwork" : "view effects"}.`}"` : `aria-hidden="true"`;
  return `<${rootTag} ${rootAttrs} class="ccg-card ${displayFlipped ? "is-flipped" : ""} ${missingCustomFront ? "uses-rules-fallback" : ""} ${setClass} ${typeClass} ${finisherClass} ${foilClass} ${superstarFront ? "is-full-art-superstar" : ""} ${finishedFront || layeredFront ? "is-full-art-finished" : ""} ${layeredFront ? "is-layered-front" : ""} ${moveFront && (finishedFront || layeredFront) ? "is-full-art-move" : ""} ${extraClass}">
    <span class="ccg-card-inner">
      <span class="ccg-card-face ccg-card-front">${frontMarkup}${visualFoil ? `<span class="ccg-foil-overlay" aria-hidden="true"></span>` : ""}</span>
      <span class="ccg-card-face ccg-card-rules ${setClass}">
        ${setLogoMarkup(card.setId,"ccg-rules-set-logo")}
        <span class="ccg-rules-head"><small>${typeLabel}</small><strong>${card.name}</strong><em>${subtitle}</em></span>
        ${card.kind === "move" ? `<span class="ccg-rules-statline"><span><small>COST</small><b>${card.cost ?? 0}</b></span><span><small>DAMAGE${visualFoil && foilDamageBonusFor(card) ? " · FOIL +1" : ""}</small><b>${card.damage ?? 0}</b></span></span>` : ""}
        <span class="ccg-rules-body"><b class="ccg-effect-label">${card.kind === "move" ? "EFFECT" : card.kind === "superstar" ? "SUPERSTAR ABILITY" : card.kind === "entrance" ? "ENTRANCE EFFECT" : "RULES"}</b><span>${ruleText}</span></span>
        ${card.kind === "superstar" ? (()=>{const star=superstarById[card.superstarId]; if(!star)return ""; const limits=Object.entries(star.methodLimits??{}).map(([m,v])=>`${m.slice(0,2).toUpperCase()} ${v==null?"∞":v}`).join(" · "); const starter=Object.entries(star.starterMomentum??{}).map(([m,v])=>`${m.slice(0,2).toUpperCase()} ×${v}`).join(" · "); return `<span class="ccg-rules-reference"><b>METHOD LIMITS</b>${limits}</span><span class="ccg-rules-reference"><b>STARTER MOMENTUM</b>${starter}</span>`;})() : ""}
        ${card.kind === "move" && !card.finisher && card.requirements && Object.keys(card.requirements).length ? `<span class="ccg-rules-requirements"><b>REQUIRES</b> ${Object.entries(card.requirements).map(([m,n])=>`${n} ${m}`).join(" · ")}</span>` : ""}
        ${card.kind === "move" && card.counterState ? `<span class="ccg-rules-requirements"><b>COUNTER STATE</b> ${COUNTER_STATE_LABELS[card.counterState] ?? card.counterState}</span>` : ""}
        ${card.kind === "move" && card.moveType === "submission" && card.submissionTarget ? `<span class="ccg-rules-requirements"><b>SUBMISSION TARGET</b> ${SUBMISSION_TARGET_LABELS[card.submissionTarget] ?? card.submissionTarget}</span>` : ""}
        ${card.kind === "move" && card.counters?.length ? `<span class="ccg-rules-requirements"><b>COUNTERS</b> ${card.counters.map(t=>MOVE_TYPE_LABELS[t] ?? t).join(", ")}</span>` : ""}
        ${card.kind === "move" && card.counterStates?.length ? `<span class="ccg-rules-requirements"><b>REVERSES</b> ${card.counterStates.map(t=>COUNTER_STATE_LABELS[t] ?? t).join(", ")}</span>` : ""}
        ${card.kind === "move" && card.counterSubmissionTargets?.length ? `<span class="ccg-rules-requirements"><b>SUBMISSION REVERSAL</b> ${card.counterSubmissionTargets.map(t=>SUBMISSION_TARGET_LABELS[t] ?? t).join(", ")}</span>` : ""}
        ${card.kind === "move" && card.counterMethods?.length ? `<span class="ccg-rules-requirements"><b>COUNTERS</b> Any ${card.counterMethods.map(m=>m[0].toUpperCase()+m.slice(1)).join(" / ")} Move</span>` : ""}
        ${cardPlayRestrictionText(card)}
        <span class="ccg-rules-foot"><span>${card.cardCode ?? card.setId ?? "WWE LEGACY"}</span><span class="rarity-stars">${rarityStars(card.rarity ?? 1)}</span></span>
      </span>
    </span>${footer}
  </${rootTag}>`;
}
function collectionText(card) {
  if (card.kind === "superstar") return `${card.hp} HP · ${card.abilityName}: ${card.abilityText}`;
  if (card.kind === "momentum") return `Gain 1 permanent ${card.method[0].toUpperCase() + card.method.slice(1)} Momentum. Move costs never spend Momentum.`;
  if (["entrance", "action", "support", "manager"].includes(card.kind)) return card.abilityText ?? card.kind;
  const req = Object.entries(card.finisher ? {} : (card.requirements ?? {})).map(([m,n]) => `${n} ${m}`).join(", ");
  const stateReq = [card.requiresPosture ? `opponent ${card.requiresPosture}` : "", card.requiresLocation ? card.requiresLocation : ""].filter(Boolean).join(" · ");
  const method = card.method ? `Method ${card.method[0].toUpperCase() + card.method.slice(1)}` : "";
  const moveType = card.moveType ? `Move Type ${MOVE_TYPE_LABELS[card.moveType] ?? card.moveType}` : "";
  const state = card.counterState ? `State ${COUNTER_STATE_LABELS[card.counterState] ?? card.counterState}` : "";
  const counters = [
    ...(card.counters?.map(t => MOVE_TYPE_LABELS[t] ?? t) ?? []),
    ...(card.counterStates?.map(t => COUNTER_STATE_LABELS[t] ?? t) ?? []),
    ...(card.counterSubmissionTargets?.map(t => `Submission ${SUBMISSION_TARGET_LABELS[t] ?? t}`) ?? [])
  ];
  const counterText = counters.length ? `Counters ${counters.join(", ")}` : "";
  const defense = card.defensiveOnly ? "Counter only" : "";
  return [`Cost ${card.cost ?? 0}`, `${card.damage ?? 0} damage`, method, moveType, state, counterText, req ? `Requires ${req}` : "", stateReq, defense, card.finisher ? "Finisher" : card.trademark ? "Trademark" : card.signature ? "Signature" : "", card.effectText ?? ""].filter(Boolean).join(" · ");
}
function renderCollection() {
  const root = $("#game");
  const allSets = activeCollectionSetId === "all";
  const rarityLabels = setCollection.rarityLabels;
  const visibleCards = playerFacingCollectionCards();
  const visibleSets = playerFacingSetCollections();
  const baseCards = allSets ? visibleCards : visibleCards.filter(card => card.setId === activeCollectionSetId);
  const isOwned = card => ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil") > 0;
  const scopedCards = collectionView === "owned" ? baseCards.filter(isOwned) : baseCards;
  const kinds = ["all","superstar","entrance","momentum","move","action","support","manager"];
  const query = collectionFilter.search.trim().toLowerCase();
  const acquisitionOrder = new Map(Object.keys(profile.ownedCards ?? {}).map((id, index) => [id, index]));
  const copiesOwned = card => ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil");
  const sortOwnedCards = cards => [...cards].sort((a, b) => {
    if (collectionSort === "alpha-asc") return a.name.localeCompare(b.name) || String(a.cardCode ?? "").localeCompare(String(b.cardCode ?? ""));
    if (collectionSort === "alpha-desc") return b.name.localeCompare(a.name) || String(b.cardCode ?? "").localeCompare(String(a.cardCode ?? ""));
    if (collectionSort === "rarity-desc") return (b.rarity ?? 0) - (a.rarity ?? 0) || a.name.localeCompare(b.name);
    if (collectionSort === "rarity-asc") return (a.rarity ?? 0) - (b.rarity ?? 0) || a.name.localeCompare(b.name);
    if (collectionSort === "copies-desc") return copiesOwned(b) - copiesOwned(a) || a.name.localeCompare(b.name);
    return (acquisitionOrder.get(b.id) ?? -1) - (acquisitionOrder.get(a.id) ?? -1) || a.name.localeCompare(b.name);
  });
  const visible = sortOwnedCards(scopedCards.filter(card => {
    if (collectionFilter.kind !== "all" && card.kind !== collectionFilter.kind) return false;
    if (collectionFilter.rarity !== "all" && String(card.rarity) !== collectionFilter.rarity) return false;
    if (query && !`${card.name} ${card.subtitle ?? ""} ${card.kind} ${card.cardCode ?? ""} ${sets[card.setId]?.displayName ?? ""} ${collectionText(card)}`.toLowerCase().includes(query)) return false;
    return true;
  }));
  const displayed = visible.slice(0, collectionRenderLimit);
  const hasMoreCollection = displayed.length < visible.length;
  const ownedUniqueAll = visibleCards.filter(isOwned).length;
  const ownedUniqueHere = baseCards.filter(isOwned).length;
  const starCards = baseCards.filter(c => c.kind === "superstar");
  const unlocked = starCards.filter(c => hasSuperstar(profile, c.superstarId)).length;
  const tabs = [`<button class="nav-button ${allSets ? 'active' : ''}" data-collection-set="all">All Sets</button>`, ...Object.values(visibleSets).map(set => `<button class="nav-button ${set.id === activeCollectionSetId ? 'active' : ''}" data-collection-set="${set.id}">${set.displayName}</button>`)].join('');
  const heroIds = allSets ? [profile.starterId, "stone-cold-steve-austin", "rhea-ripley"] : setHeroSuperstars(activeCollectionSetId);
  const setLogo = allSets ? "" : setLogoMarkup(activeCollectionSetId, "feature-set-logo");
  const title = collectionView === "owned" ? "MY COLLECTION" : "CARD CATALOGUE";
  const eyebrow = collectionView === "owned" ? "OWNED CARDS" : "EVERY ACTIVE CARD";
  const intro = collectionView === "owned"
    ? `Everything you currently own. Search ${ownedUniqueAll} unique cards across every set, or narrow the view below.`
    : `The live WWE Legacy card catalogue. Search and filter all ${visibleCards.length} currently available cards.`;
  const themeClass = allSets ? "theme-catalogue-all" : setVisualClass(activeCollectionSetId);
  document.body.dataset.set = activeCollectionSetId;
  root.innerHTML = `<section class="collection-screen premium-screen ${themeClass} collection-density-screen collection-compact-redesign">
    ${collectionView === "owned" ? premiumHubHeading("MY", "COLLECTION", "OWNED CARDS", "Your cards · favourites · Foils", "hub-collection") : premiumHubHeading("CARD", "CATALOGUE", "ALL ACTIVE CARDS", "Search · filter · inspect", "hub-catalogue")}
    <section class="collection-quickbar collection-quickbar-standalone"><div class="collection-quick-stats"><span><b>${ownedUniqueHere}</b><small>OWNED HERE</small></span><span><b>${unlocked}/${starCards.length}</b><small>SUPERSTARS</small></span><span><b>${ownedUniqueAll}</b><small>UNIQUE OWNED</small></span><span><b>${visibleCards.length}</b><small>CATALOGUE</small></span></div></section>
    <nav class="collection-set-rail" aria-label="Collection sets">${tabs}</nav>
    <section class="collection-tools collection-toolbar">
      <div class="collection-toolbar-head"><span class="collection-mode-label">${eyebrow}</span><span class="collection-count">Showing ${displayed.length} / ${visible.length}</span></div>
      <input id="collection-search" type="search" placeholder="Search cards…" value="${collectionFilter.search.replaceAll('"','&quot;')}">
      <details id="collection-filter-drawer" class="collection-filter-drawer" ${collectionFiltersOpen ? 'open' : ''}>
        <summary><span>FILTER & SORT</span><small>${collectionFilter.kind === 'all' ? 'All types' : collectionFilter.kind} · ${collectionFilter.rarity === 'all' ? 'All rarities' : `${collectionFilter.rarity}★`} · ${collectionSort.replaceAll('-',' ')}</small></summary>
        <div class="collection-filter-grid">
          <select id="collection-kind" aria-label="Card type">${kinds.map(k => `<option value="${k}" ${collectionFilter.kind === k ? 'selected' : ''}>${k === 'all' ? 'All card types' : k[0].toUpperCase()+k.slice(1)}</option>`).join('')}</select>
          <select id="collection-rarity" aria-label="Rarity"><option value="all">All rarities</option>${[1,2,3,4].map(r => `<option value="${r}" ${collectionFilter.rarity === String(r) ? 'selected' : ''}>${rarityStars(r)} ${rarityLabels[r]}</option>`).join('')}</select>
          <select id="collection-sort" aria-label="Sort My Collection"><option value="newest" ${collectionSort === 'newest' ? 'selected' : ''}>Newest Owned</option><option value="alpha-asc" ${collectionSort === 'alpha-asc' ? 'selected' : ''}>A–Z</option><option value="alpha-desc" ${collectionSort === 'alpha-desc' ? 'selected' : ''}>Z–A</option><option value="rarity-desc" ${collectionSort === 'rarity-desc' ? 'selected' : ''}>Rarity High → Low</option><option value="rarity-asc" ${collectionSort === 'rarity-asc' ? 'selected' : ''}>Rarity Low → High</option><option value="copies-desc" ${collectionSort === 'copies-desc' ? 'selected' : ''}>Most Copies</option></select>
        </div>
      </details>
    </section>
    <section class="catalogue-grid collectible-catalogue">${displayed.length ? displayed.map(card => {
      const cardSet = setCollections[card.setId] ?? setCollection;
      return `<article class="catalogue-collectible ${card.kind === 'superstar' && !hasSuperstar(profile, card.superstarId) ? 'collection-locked' : ''}">${collectibleCardMarkup(card,{flipped:flippedCollectionCards.has(card.id),foil:ownedCount(profile,card.id,'foil')>0,flipAttr:`data-flip-collection="${card.id}"`})}<div class="catalogue-under-card"><span>${card.cardCode}</span><b>${cardSet.rarityLabels[card.rarity]}</b><small>${card.kind === 'superstar' ? `Owned ${ownedCount(profile,card.id,'foil') ? 'FOIL' : '—'}` : card.kind === 'entrance' ? `Owned ${ownedCount(profile,card.id,'foil') ? 'FOIL' : ownedCount(profile,card.id,'normal') ? 'NORMAL' : '—'}` : `Owned ${ownedCount(profile,card.id,'normal')} · Foil ${ownedCount(profile,card.id,'foil')}`}</small>${card.kind==='superstar'&&hasSuperstar(profile,card.superstarId)?`<button type="button" class="favourite-star-button ${(profile.favouriteSuperstars??[]).includes(card.superstarId)?'active':''}" data-favourite-star="${card.superstarId}">${(profile.favouriteSuperstars??[]).includes(card.superstarId)?'★ FAVOURITE':'☆ ADD FAVOURITE'}</button>`:''}</div></article>`;
    }).join('') : `<div class="collection-empty">${collectionView === 'owned' ? 'No owned cards match these filters.' : 'No cards match these filters.'}</div>`}</section>${hasMoreCollection?`<div class="collection-load-more"><button id="collection-load-more" class="nav-button">Show ${Math.min(48,visible.length-displayed.length)} More Cards</button><small>${displayed.length} of ${visible.length} matching cards rendered</small></div>`:''}
  </section>`;
  root.querySelectorAll('[data-flip-collection]').forEach(btn => btn.addEventListener('click', () => { const id = btn.dataset.flipCollection; if (flippedCollectionCards.has(id)) flippedCollectionCards.delete(id); else flippedCollectionCards.add(id); renderCollection(); }));
  root.querySelectorAll('[data-collection-set]').forEach(btn => btn.addEventListener('click', () => { activeCollectionSetId = btn.dataset.collectionSet; collectionFilter = {kind:'all',rarity:'all',search:''}; collectionRenderLimit=48; flippedCollectionCards = new Set(); renderCollection(); }));
  $("#collection-filter-drawer")?.addEventListener("toggle", e => { collectionFiltersOpen = e.currentTarget.open; });
  $("#collection-search")?.addEventListener("input", e => { collectionFilter.search = e.target.value; collectionRenderLimit=48; renderCollection(); requestAnimationFrame(() => $("#collection-search")?.focus()); });
  $("#collection-kind")?.addEventListener("change", e => { collectionFiltersOpen = true; collectionFilter.kind = e.target.value; collectionRenderLimit=48; renderCollection(); });
  $("#collection-rarity")?.addEventListener("change", e => { collectionFiltersOpen = true; collectionFilter.rarity = e.target.value; collectionRenderLimit=48; renderCollection(); });
  $("#collection-sort")?.addEventListener("change", e => { collectionFiltersOpen = true; collectionSort = e.target.value; collectionRenderLimit=48; renderCollection(); });
  $("#collection-load-more")?.addEventListener("click",()=>{ collectionRenderLimit += 48; renderCollection(); });
  root.querySelectorAll('[data-favourite-star]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); const id=btn.dataset.favouriteStar; profile.favouriteSuperstars ??= []; profile.favouriteSuperstars = profile.favouriteSuperstars.includes(id) ? profile.favouriteSuperstars.filter(x=>x!==id) : [...profile.favouriteSuperstars,id]; saveProfile(profile); renderCollection(); }));
}


function catalogueOwned(card) {
  const normal = ownedCount(profile, card.id, "normal");
  const foil = ownedCount(profile, card.id, "foil");
  return { normal, foil, total: normal + foil };
}

function catalogueCardUsageLabel(card) {
  if (isSharedCard(card)) return "SHARED";
  const names = superstarIdsForCard(card).map(id => superstarById[id]?.name ?? id).sort((a,b) => a.localeCompare(b));
  if (!names.length) return "UNASSIGNED";
  return names.length <= 2 ? names.join(" · ") : `${names[0]} · +${names.length - 1}`;
}

function renderCardCatalogue() {
  const root = $("#game");
  const visibleCards = playerFacingCollectionCards();
  const visibleSets = playerFacingSetCollections();
  const options = catalogueOptions(visibleCards);
  const ownershipFor = card => catalogueOwned(card);
  const filtered = filterAndSortCatalogue(visibleCards, catalogueFilter, ownershipFor);
  const ownedUnique = visibleCards.filter(card => ownershipFor(card).total > 0).length;
  const pageCount = Math.max(1, Math.ceil(filtered.length / CATALOGUE_PAGE_SIZE));
  cataloguePage = Math.min(Math.max(1, cataloguePage), pageCount);
  const start = (cataloguePage - 1) * CATALOGUE_PAGE_SIZE;
  const pageCards = filtered.slice(start, start + CATALOGUE_PAGE_SIZE);
  const kinds = ["all","superstar","entrance","momentum","move","action","support","manager"];
  const select = (value, label, selected) => `<option value="${value}" ${String(selected) === String(value) ? "selected" : ""}>${label}</option>`;
  const requirementOptions = selected => [select("any","Any",selected), ...[0,1,2,3].map(n => select(String(n),`= ${n}`,selected))].join("");
  const comparatorOptions = selected => [
    select("any","Any",selected), select("eq","=",selected), select("lte","≤",selected), select("gte","≥",selected)
  ].join("");
  const sortOptions = [
    ["collector","Collector #"],["alpha","Alphabetical"],["set","Set"],["superstar","Superstar"],["kind","Card Type"],["rarity","Rarity"],
    ["cost","Cost"],["damage","Damage"],["strength","Strength Req"],["strike","Strike Req"],["technical","Technical Req"],["agility","Agility Req"],["owned","Owned Quantity"]
  ];
  const superstarOptions = [
    select("all","All Superstars",catalogueFilter.superstarId),
    select("shared","Shared / Generic",catalogueFilter.superstarId),
    ...options.superstars.map(star => select(star.id, star.name, catalogueFilter.superstarId))
  ].join("");
  const setOptions = [select("all","All Sets",catalogueFilter.setId), ...Object.values(visibleSets).map(set => select(set.id,set.displayName,catalogueFilter.setId))].join("");
  const moveTypeOptions = [select("all","All Move Types",catalogueFilter.moveType), ...options.moveTypes.map(type => select(type, MOVE_TYPE_LABELS[type] ?? type, catalogueFilter.moveType))].join("");
  const moveFamilyOptions = [select("all","All Move Families",catalogueFilter.moveFamily), ...options.moveFamilies.map(family => select(family, family.replaceAll("-"," ").replace(/\b\w/g,m=>m.toUpperCase()), catalogueFilter.moveFamily))].join("");
  const methodOptions = [select("all","All Methods",catalogueFilter.method), ...options.methods.map(method => select(method, method[0].toUpperCase()+method.slice(1), catalogueFilter.method))].join("");
  const pagination = `<div class="catalogue-pagination"><button class="nav-button" data-catalogue-page="prev" ${cataloguePage <= 1 ? "disabled" : ""}>← Previous</button><b>Page ${cataloguePage} / ${pageCount}</b><button class="nav-button" data-catalogue-page="next" ${cataloguePage >= pageCount ? "disabled" : ""}>Next →</button></div>`;
  const catalogueDefaults = defaultCatalogueFilters();
  const activeCatalogueFilters = Object.keys(catalogueDefaults).filter(key => !["search","sortBy","sortDir"].includes(key) && String(catalogueFilter[key]) !== String(catalogueDefaults[key])).length;

  root.innerHTML = `<section class="catalogue-screen premium-screen theme-catalogue-all catalogue-density-screen catalogue-compact-redesign">
    ${premiumHubHeading("CARD", "CATALOGUE", `${visibleCards.length} RELEASED CARDS`, "Search · filter · inspect", "hub-catalogue")}
    <section class="catalogue-quickbar catalogue-quickbar-standalone"><div class="catalogue-master-stats"><span><b>${visibleCards.length}</b><small>RELEASED</small></span><span><b>${ownedUnique}</b><small>OWNED</small></span><span><b>${filtered.length}</b><small>MATCHING</small></span></div></section>
    <section class="catalogue-command-bar">
      <input id="catalogue-search" type="search" placeholder="Search name, code, move, Superstar or effect…" value="${String(catalogueFilter.search).replaceAll("&","&amp;").replaceAll("\"","&quot;").replaceAll("<","&lt;")}">
      <span>${filtered.length} MATCHING</span>
    </section>

    <details id="catalogue-filter-drawer" class="catalogue-super-sort catalogue-filter-drawer" ${catalogueFiltersOpen ? "open" : ""}>
      <summary><span>FILTERS ${activeCatalogueFilters ? `<b>${activeCatalogueFilters}</b>` : ""}</span><small>Set · Superstar · ownership · type · rarity · sort</small></summary>
      <div class="catalogue-super-sort-body">
        <div class="catalogue-filter-grid catalogue-primary-filters">
          <label><span>Set</span><select data-catalogue-field="setId">${setOptions}</select></label>
          <label><span>Superstar</span><select data-catalogue-field="superstarId">${superstarOptions}</select></label>
          <label><span>Ownership</span><select data-catalogue-field="ownership">${select("all","Owned + Unowned",catalogueFilter.ownership)}${select("owned","Owned only",catalogueFilter.ownership)}${select("unowned","Unowned only",catalogueFilter.ownership)}</select></label>
          <label><span>Card type</span><select data-catalogue-field="kind">${kinds.map(kind=>select(kind,kind === "all" ? "All Card Types" : kind[0].toUpperCase()+kind.slice(1),catalogueFilter.kind)).join("")}</select></label>
          <label><span>Rarity</span><select data-catalogue-field="rarity">${select("all","All Rarities",catalogueFilter.rarity)}${[1,2,3,4].map(r=>select(String(r),`${rarityStars(r)} ${setCollection.rarityLabels[r]}`,catalogueFilter.rarity)).join("")}</select></label>
        </div>
        <div class="catalogue-sort-row catalogue-sort-compact">
          <label><span>Sort by</span><select data-catalogue-field="sortBy">${sortOptions.map(([value,label])=>select(value,label,catalogueFilter.sortBy)).join("")}</select></label>
          <label><span>Direction</span><select data-catalogue-field="sortDir">${select("asc","Ascending",catalogueFilter.sortDir)}${select("desc","Descending",catalogueFilter.sortDir)}</select></label>
          <button id="catalogue-reset" class="nav-button">Reset</button>
        </div>
        <details class="catalogue-advanced-filters">
          <summary>ADVANCED MOVE FILTERS</summary>
          <div class="catalogue-filter-grid catalogue-advanced-grid">
            <label><span>Superstar scope</span><select data-catalogue-field="superstarScope">${select("usage","Current deck + linked",catalogueFilter.superstarScope)}${select("exclusive","Exclusive only",catalogueFilter.superstarScope)}</select></label>
            <label><span>Method</span><select data-catalogue-field="method">${methodOptions}</select></label>
            <label><span>Move type</span><select data-catalogue-field="moveType">${moveTypeOptions}</select></label>
            <label><span>Move family</span><select data-catalogue-field="moveFamily">${moveFamilyOptions}</select></label>
            <label><span>Move class</span><select data-catalogue-field="moveClass">${select("all","All Move Classes",catalogueFilter.moveClass)}${select("standard","Standard",catalogueFilter.moveClass)}${select("signature","Signature",catalogueFilter.moveClass)}${select("trademark","Trademark",catalogueFilter.moveClass)}${select("finisher","Finisher",catalogueFilter.moveClass)}</select></label>
          </div>
          <div class="catalogue-number-grid">
            <label class="catalogue-number-filter"><span>Cost</span><select data-catalogue-field="costOp">${comparatorOptions(catalogueFilter.costOp)}</select><input data-catalogue-field="costValue" type="number" min="0" max="20" inputmode="numeric" value="${catalogueFilter.costValue}"></label>
            <label class="catalogue-number-filter"><span>Damage</span><select data-catalogue-field="damageOp">${comparatorOptions(catalogueFilter.damageOp)}</select><input data-catalogue-field="damageValue" type="number" min="0" max="30" inputmode="numeric" value="${catalogueFilter.damageValue}"></label>
            <label><span>Strength =</span><select data-catalogue-field="strengthReq">${requirementOptions(catalogueFilter.strengthReq)}</select></label>
            <label><span>Strike =</span><select data-catalogue-field="strikeReq">${requirementOptions(catalogueFilter.strikeReq)}</select></label>
            <label><span>Technical =</span><select data-catalogue-field="technicalReq">${requirementOptions(catalogueFilter.technicalReq)}</select></label>
            <label><span>Agility =</span><select data-catalogue-field="agilityReq">${requirementOptions(catalogueFilter.agilityReq)}</select></label>
          </div>
        </details>
      </div>
    </details>

    <section id="catalogue-results" class="catalogue-results-head"><div><span>${filtered.length} cards match</span><b>${filtered.length ? `${start + 1}–${Math.min(start + CATALOGUE_PAGE_SIZE, filtered.length)} shown` : "Nothing to show"}</b></div>${pagination}</section>
    <section class="catalogue-grid collectible-catalogue master-catalogue-grid">${pageCards.length ? pageCards.map(card => {
      const owned = ownershipFor(card);
      const cardSet = setCollections[card.setId] ?? setCollection;
      const unowned = owned.total === 0;
      return `<article class="catalogue-collectible master-catalogue-card ${unowned ? 'catalogue-unowned' : 'catalogue-owned'}">${collectibleCardMarkup(card,{flipped:flippedCatalogueCards.has(card.id),foil:owned.foil>0,flipAttr:`data-flip-catalogue="${card.id}"`})}<div class="catalogue-under-card master-catalogue-meta"><span>${card.cardCode}</span><b>${cardSet.rarityLabels[card.rarity]}</b><small class="catalogue-usage">${catalogueCardUsageLabel(card)}</small><strong class="catalogue-owned-count">${unowned ? "NOT OWNED" : `×${owned.total} OWNED`}</strong>${owned.foil ? `<em>${owned.normal} normal · ${owned.foil} foil</em>` : owned.normal ? `<em>${owned.normal} normal</em>` : ""}</div></article>`;
    }).join("") : `<div class="collection-empty catalogue-empty">No released cards match this filter combination.</div>`}</section>
    ${filtered.length ? `<div class="catalogue-pagination catalogue-pagination-bottom">${pagination}</div>` : ""}
  </section>`;

  $("#catalogue-filter-drawer")?.addEventListener("toggle", e => { catalogueFiltersOpen = e.currentTarget.open; });
  $("#catalogue-reset")?.addEventListener("click", () => { catalogueFilter = defaultCatalogueFilters(); catalogueFiltersOpen = false; cataloguePage = 1; flippedCatalogueCards = new Set(); renderCardCatalogue(); });
  $("#catalogue-search")?.addEventListener("input", e => { catalogueFilter.search = e.target.value; cataloguePage = 1; renderCardCatalogue(); requestAnimationFrame(() => { const input = $("#catalogue-search"); if (input) { input.focus(); input.setSelectionRange(input.value.length,input.value.length); } }); });
  root.querySelectorAll("[data-catalogue-field]").forEach(control => control.addEventListener("change", () => { catalogueFiltersOpen = true; catalogueFilter[control.dataset.catalogueField] = control.value; cataloguePage = 1; flippedCatalogueCards = new Set(); renderCardCatalogue(); }));
  root.querySelectorAll("[data-flip-catalogue]").forEach(btn => btn.addEventListener("click", () => { const id = btn.dataset.flipCatalogue; if (flippedCatalogueCards.has(id)) flippedCatalogueCards.delete(id); else flippedCatalogueCards.add(id); renderCardCatalogue(); }));
  root.querySelectorAll("[data-catalogue-page]").forEach(btn => btn.addEventListener("click", () => {
    cataloguePage += btn.dataset.cataloguePage === "next" ? 1 : -1;
    flippedCatalogueCards = new Set();
    renderCardCatalogue();
    requestAnimationFrame(() => $("#catalogue-results")?.scrollIntoView({block:"start"}));
  }));
}


function deckRole(card) {
  if (!card) return "Unknown";
  if (card.kind === "move") return card.finisher ? "Finisher" : card.trademark ? "Trademark" : (card.defensiveOnly || card.moveType === "counter") ? "Counter" : card.counters?.length ? "Move / Counter" : `Move · Cost ${card.cost ?? 0}`;
  return card.kind[0].toUpperCase() + card.kind.slice(1);
}

function deckLabCardHasFront(card) {
  return Boolean(card && (card.kind === "superstar" || card.kind === "momentum" || finishedCardArtFor(card) || artworkFor(card)));
}

function renderDeckLabInspectOverlay() {
  if (!deckLabInspectCardId) return "";
  const card = collectionById.get(deckLabInspectCardId);
  if (!card) return "";
  const canFlip = deckLabCardHasFront(card);
  const instruction = canFlip
    ? `Tap card to ${deckLabInspectFlipped ? "show front" : "view effects"} · Tap outside to close`
    : "Full card details · Tap outside to close";
  return `<div class="superstar-card-modal deck-lab-card-modal" data-deck-lab-modal-backdrop="1"><div class="superstar-card-modal-inner deck-lab-card-modal-inner"><button type="button" class="deck-lab-card-modal-close" data-close-deck-lab-modal="1" aria-label="Close card inspector">×</button>${collectibleCardMarkup(card,{flipped:deckLabInspectFlipped,extraClass:"hud-superstar-modal-card deck-lab-inspect-card",flipAttr:'data-flip-deck-lab-modal="1"'})}<small>${instruction}</small></div></div>`;
}

function bindDeckLabInspect(root) {
  const openCard = (trigger, event) => {
    event?.stopPropagation?.();
    deckLabInspectCardId = trigger.dataset.deckLabInspect;
    deckLabInspectFlipped = false;
    renderDeckBuilder();
  };
  root.querySelectorAll("[data-deck-lab-inspect]").forEach(trigger => {
    trigger.addEventListener("click", event => openCard(trigger, event));
  });
  root.querySelectorAll("[data-flip-deck-lab-modal]").forEach(btn => btn.addEventListener("click", event => {
    event.stopPropagation();
    const card = collectionById.get(deckLabInspectCardId);
    if (!deckLabCardHasFront(card)) return;
    deckLabInspectFlipped = !deckLabInspectFlipped;
    renderDeckBuilder();
  }));
  const closeInspect = () => { deckLabInspectCardId = null; deckLabInspectFlipped = false; renderDeckBuilder(); };
  root.querySelectorAll("[data-close-deck-lab-modal]").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); closeInspect(); }));
  root.querySelectorAll("[data-deck-lab-modal-backdrop]").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target !== backdrop) return; closeInspect(); }));
}

function renderDeckBuilder() {
  setChrome();
  const root = $("#game");
  if (!profile?.unlockedSuperstars?.length) { showSetup(); return; }
  const unlocked = orderedUnlockedSuperstars();

  if (deckLabStage === "roster") {
    if (!unlocked.some(star => star.id === deckBuilderStarId)) deckBuilderStarId = unlocked[0]?.id ?? profile.starterId;
    const selectedStar = superstarById[deckBuilderStarId];
    const selectedDraft = createDeckDraft(profile, deckBuilderStarId);
    const selectedCheck = validateDeckDraft(profile, deckBuilderStarId, selectedDraft, selectedEntranceId(profile, deckBuilderStarId));
    root.innerHTML = `<section class="deck-builder-screen deck-lab-screen premium-screen">
      ${premiumHubHeading("DECK", "LAB", "BUILD YOUR ROSTER", "Choose a Superstar · build · optimize · save", "hub-deck-lab")}
      <section class="selector-panel horizontal-selector deck-lab-roster-selector" aria-label="Unlocked Superstars"><div class="selector-title"><span>${selectedCheck.healthy ? 'READY' : 'NEEDS WORK'}</span><strong>${selectedStar?.name ?? 'Choose Superstar'}</strong><small>${selectedDraft.length}/60 · ${selectedStar?.nickname ?? ''}</small></div>${selectionCarouselMarkup(unlocked,deckBuilderStarId,'deck-lab-select')}<button id="confirm-deck-lab-star" class="select-confirm">EDIT ${(selectedStar?.name ?? 'SUPERSTAR').toUpperCase()} DECK</button></section>
    </section>`;
    wireSelectionCarousel('deck-lab-select', id => { deckBuilderStarId = id; renderDeckBuilder(); });
    $("#confirm-deck-lab-star")?.addEventListener("click", () => {
      deckDraft = createDeckDraft(profile, deckBuilderStarId);
      deckLabEntranceId = selectedEntranceId(profile, deckBuilderStarId);
      deckBuilderFilter = "";
      deckLabOnlyValid = false;
      deckLabPicker = null;
      deckLabStage = "editor";
      message = "";
      renderDeckBuilder();
    });
    return;
  }

  if (!profile.unlockedSuperstars.includes(deckBuilderStarId)) {
    deckLabStage = "roster";
    renderDeckBuilder();
    return;
  }
  if (!deckDraft) deckDraft = createDeckDraft(profile, deckBuilderStarId);
  deckLabEntranceId ??= selectedEntranceId(profile, deckBuilderStarId);

  const star = superstarById[deckBuilderStarId];
  const entranceCard = collectionById.get(deckLabEntranceId) ?? null;
  const health = validateDeckDraft(profile, deckBuilderStarId, deckDraft, deckLabEntranceId);
  const currentCounts = currentCategoryCounts(deckDraft);
  const recommendedCounts = recommendedCategoryCounts(deckBuilderStarId);
  const recommendedPlan = recommendedDeckComparison(profile, deckBuilderStarId, deckDraft, deckLabEntranceId);
  const recommendedEntrance = recommendedPlan.authoredEntranceId ? collectionById.get(recommendedPlan.authoredEntranceId) : null;
  const lead = deckDraft.slice(0, 5).map((entry, index) => ({ entry, index, card: collectionById.get(entry.id ?? entry) }));
  const deckCountClass = health.healthy ? "valid" : deckDraft.length === 60 ? "invalid" : "incomplete";

  if (deckLabPicker) {
    let title = "Choose Card", subtitle = "All owned cards are shown. Invalid choices stay visible but shaded.", cards = [], pickType = deckLabPicker.type;
    if (pickType === "entrance") {
      title = "Change Entrance";
      subtitle = "Owned Entrances appear here. Superstar-specific Entrances are Very Rare booster pulls; incompatible Entrances remain visible but shaded.";
      cards = allOwnedEntrances(profile).map(card => ({ card, eligibility: entranceEligibilityForSuperstar(star, card) }));
    } else if (pickType === "lead") {
      title = `Change Lead Off ${Number(deckLabPicker.slot) + 1}`;
      subtitle = "Choose any owned Move or Momentum page. Invalid Method or Superstar restrictions remain visible but shaded.";
      cards = playerFacingCollectionCards().filter(card => ["move", "momentum"].includes(card.kind) && ownedTotal(profile, card.id) > 0).map(card => ({ card, eligibility: cardEligibilityForSuperstar(star, card) }));
    } else {
      const category = DECK_LAB_CATEGORIES.find(c => c.id === deckLabPicker.category);
      title = category?.label ?? "Deck Cards";
      subtitle = `Current ${currentCounts[deckLabPicker.category] ?? 0} · Recommended ${recommendedCounts[deckLabPicker.category] ?? 0}. Recommendations are guidance only.`;
      cards = ownedCardsForCategory(profile, deckLabPicker.category).map(card => ({ card, eligibility: cardEligibilityForSuperstar(star, card) }));
    }
    const query = deckBuilderFilter.trim().toLowerCase();
    cards = cards.filter(row => !query || `${row.card.name} ${row.card.kind} ${row.card.moveType ?? ""} ${row.card.method ?? ""}`.toLowerCase().includes(query));
    if (deckLabOnlyValid) cards = cards.filter(row => row.eligibility.legal);
    cards.sort((a, b) => Number(b.eligibility.legal) - Number(a.eligibility.legal) || a.card.name.localeCompare(b.card.name));

    root.innerHTML = `<section class="deck-builder-screen deck-lab-screen premium-screen deck-lab-picker-screen">
      <header class="deck-lab-picker-head"><button id="deck-picker-back" type="button" class="ghost">← Deck</button><div><span>DECK LAB · ${star.name.toUpperCase()}</span><h2>${title}</h2><p>${subtitle}</p></div><strong class="deck-lab-counter ${deckCountClass}">${deckDraft.length}/60</strong></header>
      <div class="deck-lab-picker-tools"><input id="deck-search" type="search" placeholder="Search owned cards" value="${deckBuilderFilter.replaceAll('"','&quot;')}"><label class="valid-only-toggle"><input id="deck-valid-only" type="checkbox" ${deckLabOnlyValid ? 'checked' : ''}><span>Only Show Valid</span></label></div>
      <section class="deck-lab-card-picker deck-lab-card-grid">${cards.length ? cards.map(({card, eligibility}) => {
        const used = deckDraft.filter(e => (e.id ?? e) === card.id).length;
        const owned = ownedTotal(profile, card.id);
        const cap = card.kind === "momentum" ? 12 : 5;
        const canAdd = eligibility.legal && deckDraft.length < 60 && used < Math.min(cap, owned);
        const tailIndex = deckDraft.map(e => e.id ?? e).lastIndexOf(card.id);
        // Momentum distribution is part of deck construction, so a player must be
        // able to take a Method all the way to zero even when its final copy is
        // currently inside Lead Off 5. Removing a Lead Off Momentum page simply
        // promotes the next deck page into the opening five; Deck Validity still
        // guards the final saved opening hand.
        const canRemove = pickType === "category" && (tailIndex >= 5 || (card.kind === "momentum" && tailIndex >= 0));
        const action = pickType === "entrance"
          ? `<button data-pick-entrance="${card.id}" class="deck-card-change primary" ${eligibility.legal ? '' : 'disabled'}>${card.id === deckLabEntranceId ? 'SELECTED' : 'CHANGE'}</button>`
          : pickType === "lead"
            ? `<button data-pick-lead="${card.id}" class="deck-card-change primary" ${eligibility.legal ? '' : 'disabled'}>CHANGE</button>`
            : `<div class="deck-card-stepper"><button data-deck-remove-index="${tailIndex}" class="secondary" ${canRemove ? '' : 'disabled'} aria-label="Remove one ${card.name}">−</button><strong>${used}</strong><button data-add-deck="${card.id}" class="primary" ${canAdd ? '' : 'disabled'} aria-label="Add one ${card.name}">+</button></div>`;
        return `<article class="deck-lab-card-tile ${eligibility.legal ? 'is-valid' : 'is-invalid'}">
          <div class="deck-lab-full-card">${collectibleCardMarkup(card,{foil:ownedCount(profile,card.id,"foil")>0,extraClass:"deck-lab-picker-ccg",flipAttr:`data-deck-lab-inspect="${card.id}"`})}<span class="deck-card-owned-chip">${used}/${owned}</span>${eligibility.legal ? '' : `<span class="deck-card-invalid-chip">LOCKED</span>`}</div>
          ${eligibility.legal ? '' : `<div class="deck-card-invalid-reason">${eligibility.reason}</div>`}
          ${action}
        </article>`;
      }).join("") : `<div class="collection-empty">No owned cards match this filter.</div>`}</section>
    </section>${renderDeckLabInspectOverlay()}`;

    bindDeckLabInspect(root);
    $("#deck-picker-back")?.addEventListener("click", () => { deckLabPicker = null; deckBuilderFilter = ""; renderDeckBuilder(); });
    $("#deck-search")?.addEventListener("input", e => { deckBuilderFilter = e.target.value; renderDeckBuilder(); requestAnimationFrame(() => { const input = $("#deck-search"); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); }); });
    $("#deck-valid-only")?.addEventListener("change", e => { deckLabOnlyValid = e.target.checked; renderDeckBuilder(); });
    root.querySelectorAll("[data-pick-entrance]").forEach(btn => btn.addEventListener("click", () => { deckLabEntranceId = btn.dataset.pickEntrance; deckLabPicker = null; deckBuilderFilter = ""; message = `${collectionById.get(deckLabEntranceId)?.name ?? 'Entrance'} selected. Save the deck to keep this Entrance.`; renderDeckBuilder(); }));
    root.querySelectorAll("[data-pick-lead]").forEach(btn => btn.addEventListener("click", () => { const before = deckDraft; deckDraft = replaceLeadOffSlot(profile, deckBuilderStarId, deckDraft, deckLabPicker.slot, btn.dataset.pickLead); if (deckDraft === before) message = "That card cannot replace this Lead Off slot with your current ownership/copy limits."; else message = `Lead Off ${Number(deckLabPicker.slot)+1} changed.`; deckLabPicker = null; deckBuilderFilter = ""; renderDeckBuilder(); }));
    root.querySelectorAll("[data-add-deck]").forEach(btn => btn.addEventListener("click", () => { const before = deckDraft.length; deckDraft = addCardToDraft(profile, deckBuilderStarId, deckDraft, btn.dataset.addDeck); message = deckDraft.length > before ? "Card added." : "That card cannot be added."; renderDeckBuilder(); }));
    root.querySelectorAll("[data-deck-remove-index]").forEach(btn => btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.deckRemoveIndex);
      const removing = materializeDraft(deckDraft)[idx];
      const removable = idx >= 5 || (idx >= 0 && removing?.kind === "momentum");
      if (removable) {
        const wasLeadOff = idx < 5;
        deckDraft = removeCardFromDraft(profile, deckBuilderStarId, deckDraft, idx);
        message = wasLeadOff ? "Momentum removed from Lead Off. The next deck page moved into the opening five." : "Card removed.";
      }
      renderDeckBuilder();
    }));
    return;
  }

  const superstarCard = collectionById.get(star.cardId ?? `superstar-${star.id}`);
  const violations = health.violations.length
    ? `<div class="deck-validity-list">${health.violations.map(v => `<p>• ${v}</p>`).join("")}</div>`
    : `<p class="deck-validity-ok">✓ 60/60 · Deck is valid and ready to save.</p>`;

  root.innerHTML = `<section class="deck-builder-screen deck-lab-screen premium-screen">
    <header class="deck-lab-editor-head"><button id="deck-lab-roster-back" type="button" class="ghost">← Superstars</button><div><span>DECK LAB</span><h2>${star.name}</h2><p>Recommendations are guidance. Build your own legal 60-page deck.</p></div><strong class="deck-lab-counter ${deckCountClass}">${deckDraft.length}/60</strong></header>
    ${message ? `<p class="setup-message">${message}</p>` : ""}

    <section class="deck-identity-row">
      <article class="deck-identity-card"><span>SUPERSTAR</span><div class="deck-identity-visual">${superstarCard ? collectibleCardMarkup(superstarCard,{extraClass:"deck-lab-identity-card",flipAttr:`data-deck-lab-inspect="${superstarCard.id}"`}) : superstarVisualMarkup(star.id,star.name)}</div><strong>${star.name}</strong></article>
      <article class="deck-identity-card entrance-slot"><span>ENTRANCE</span><div class="deck-identity-visual">${entranceCard ? collectibleCardMarkup(entranceCard,{extraClass:"deck-lab-identity-card",flipAttr:`data-deck-lab-inspect="${entranceCard.id}"`}) : '<div class="portrait-placeholder">Entrance</div>'}</div><strong>${entranceCard?.name ?? star.entrance?.name ?? 'Entrance'}</strong><button id="change-entrance" type="button" class="nav-button">Change</button></article>
    </section>

    <section class="deck-recommended-plan">
      <div class="deck-recommended-head"><div><span>RECOMMENDED BUILD</span><h3>${recommendedPlan.matched}/60 MATCHED</h3><p>${recommendedPlan.missing ? `${recommendedPlan.missing} authored slot${recommendedPlan.missing===1?'':'s'} still use Collection replacements.` : 'Complete authored build achieved.'}</p></div><strong>${recommendedPlan.coverage}%</strong></div>
      <div class="deck-recommended-meter"><span style="width:${recommendedPlan.coverage}%"></span></div>
      ${recommendedPlan.entranceUpgradeReady && recommendedEntrance ? `<article class="deck-recommended-entrance"><div><em>ENTRANCE UPGRADE READY</em><b>${recommendedEntrance.name}</b><small>Recommended over ${entranceCard?.name ?? 'your current Entrance'} for ${star.name}.</small></div><button id="use-recommended-entrance" class="primary">USE ENTRANCE</button></article>` : ''}
      ${recommendedPlan.missingRows.length ? `<div class="deck-recommended-gaps">${recommendedPlan.missingRows.slice(0,6).map(row=>{const replacement=recommendedPlan.replacements.find(item=>item.targetId===row.id);return `<article><div><b>${row.card?.name ?? row.id}${row.count>1?` ×${row.count}`:''}</b><span>${row.ownedReady ? `${row.ownedReady} OWNED UPGRADE${row.ownedReady===1?'':'S'} READY` : `${row.toCollect} TO COLLECT`}</span></div><small>${replacement?.replacement ? `${replacement.replacement.name}${replacement.count>1?` ×${replacement.count}`:''} is filling ${replacement.count===1?'this slot':'these slots'} meanwhile.` : 'Deck Lab will suggest the closest legal owned replacement.'}</small></article>`;}).join('')}</div>` : ''}
    </section>

    <section class="deck-lead-off-panel"><div class="section-title"><h3>Lead Off 5</h3><span>Opening hand</span></div><div class="deck-lead-off-row">${lead.map(({card,index}) => `<article class="deck-lead-slot visual-lead-slot"><span class="lead-slot-label">LEAD ${index+1}</span>${card ? collectibleCardMarkup(card,{extraClass:"deck-lead-card",flipAttr:`data-deck-lab-inspect="${card.id}"`}) : '<span class="lead-empty">EMPTY</span>'}<button type="button" data-change-lead="${index}">Change</button></article>`).join("")}</div></section>

    <section class="deck-category-list deck-category-carousels"><div class="section-title"><h3>Deck Sections</h3><span>Swipe each section to browse your deck</span></div>${DECK_LAB_CATEGORIES.map(category => {
      const current = currentCounts[category.id] ?? 0, recommended = recommendedCounts[category.id] ?? 0;
      const categoryCards = materializeDraft(deckDraft).filter(card => categoryForCard(card) === category.id);
      return `<section class="deck-category-carousel"><header><div><em>${category.label.toUpperCase()}</em><span>${current} IN DECK · RECOMMENDED ${recommended}</span></div><button type="button" data-deck-category="${category.id}">EDIT</button></header><div class="deck-category-card-row">${categoryCards.length ? categoryCards.map((card,index) => `<article class="deck-category-card"><span class="deck-category-card-number">${index+1}</span>${collectibleCardMarkup(card,{extraClass:"deck-category-ccg",flipAttr:`data-deck-lab-inspect="${card.id}"`})}</article>`).join("") : '<span class="deck-category-empty">No cards in this section yet.</span>'}</div></section>`;
    }).join("")}</section>

    <section class="deck-validity-panel"><div class="section-title"><h3>Deck Validity</h3><span class="${health.healthy ? 'valid' : 'invalid'}">${health.healthy ? 'VALID' : 'CHECK REQUIRED'}</span></div>${violations}<div class="deck-builder-actions deck-builder-actions-simplified"><button id="auto-build-deck" class="nav-button">AUTO BUILD</button><button id="save-deck" class="start-match" ${health.healthy ? '' : 'disabled'}>Save Deck</button></div></section>
  </section>${renderDeckLabInspectOverlay()}`;

  bindDeckLabInspect(root);
  $("#deck-lab-roster-back")?.addEventListener("click", () => { deckLabStage = "roster"; deckLabPicker = null; deckDraft = null; deckLabEntranceId = null; deckLabInspectCardId = null; deckLabInspectFlipped = false; message = ""; renderDeckBuilder(); });
  $("#change-entrance")?.addEventListener("click", () => { deckLabPicker = { type: "entrance" }; deckLabOnlyValid = false; deckBuilderFilter = ""; renderDeckBuilder(); });
  $("#use-recommended-entrance")?.addEventListener("click", () => { const id = recommendedEntranceId(profile, deckBuilderStarId); if (id) { deckLabEntranceId = id; message = `${collectionById.get(id)?.name ?? 'Entrance'} selected as the recommended Entrance. Save the deck to keep it.`; } renderDeckBuilder(); });
  root.querySelectorAll("[data-change-lead]").forEach(btn => btn.addEventListener("click", () => { deckLabPicker = { type: "lead", slot: Number(btn.dataset.changeLead) }; deckLabOnlyValid = false; deckBuilderFilter = ""; renderDeckBuilder(); }));
  root.querySelectorAll("[data-deck-category]").forEach(btn => btn.addEventListener("click", () => { deckLabPicker = { type: "category", category: btn.dataset.deckCategory }; deckLabOnlyValid = false; deckBuilderFilter = ""; renderDeckBuilder(); }));
  $("#auto-build-deck")?.addEventListener("click", () => {
    deckDraft = buildBestOwnedRecommendedDraft(profile, deckBuilderStarId);
    deckLabEntranceId = recommendedEntranceId(profile, deckBuilderStarId);
    const matched = 60 - recommendedDeckMissingCount(deckBuilderStarId, deckDraft);
    message = deckDraft.length === 60
      ? `Auto Build created the best owned approximation of ${star.name}'s recommended starter blueprint (${matched}/60 authored slots matched). You can still change Methods, shared moves and every other legal choice.`
      : `Auto Build used every legal owned option available. ${60-deckDraft.length} slots still need cards.`;
    renderDeckBuilder();
  });
  $("#save-deck")?.addEventListener("click", () => {
    const check = validateDeckDraft(profile, deckBuilderStarId, deckDraft, deckLabEntranceId);
    if (!check.healthy) { message = "Deck is not valid yet. Review the checker below."; renderDeckBuilder(); return; }
    profile.savedDecks ??= {};
    profile.savedDecks[deckBuilderStarId] = deckDraft.map(entry => ({ ...entry }));
    profile.deckNeedsCards ??= {};
    profile.deckNeedsCards[deckBuilderStarId] = recommendedDeckMissingCount(deckBuilderStarId, deckDraft);
    if (!setSelectedEntrance(profile, deckBuilderStarId, deckLabEntranceId)) { message = "Selected Entrance is not legal or owned."; renderDeckBuilder(); return; }
    saveProfile(profile);
    message = `${star.name}'s deck and Entrance saved.`;
    deckLabStage = "roster";
    deckLabPicker = null;
    deckDraft = null;
    deckLabEntranceId = null;
    deckLabInspectCardId = null;
    deckLabInspectFlipped = false;
    renderDeckBuilder();
  });
}

function cardMeta(card) {
  if (card.kind === "momentum") return `${card.method.toUpperCase()} +${card.amount ?? 1}`;
  if (["entrance", "action", "support", "manager"].includes(card.kind)) return card.abilityText ?? card.kind;
  const req = Object.entries(card.finisher ? {} : (card.requirements ?? {})).map(([m, n]) => `${n} ${m}`).join(" · ");
  const position = [
    card.requiresPosture ? `Foe: ${card.requiresPosture}` : "",
    card.requiresLocation ? `Location: ${card.requiresLocation}` : ""
  ].filter(Boolean).join(" · ");
  const method = card.method ? `Method: ${card.method[0].toUpperCase() + card.method.slice(1)}` : "";
  const moveType = card.moveType ? `Type: ${MOVE_TYPE_LABELS[card.moveType] ?? card.moveType}` : "";
  const state = card.counterState ? `State: ${COUNTER_STATE_LABELS[card.counterState] ?? card.counterState}` : "";
  const counters = [
    ...(card.counters?.map(t => MOVE_TYPE_LABELS[t] ?? t) ?? []),
    ...(card.counterStates?.map(t => COUNTER_STATE_LABELS[t] ?? t) ?? []),
    ...(card.counterSubmissionTargets?.map(t => `Submission ${SUBMISSION_TARGET_LABELS[t] ?? t}`) ?? [])
  ];
  const counterText = counters.length ? `Counters: ${counters.join(", ")}` : "";
  return [`Cost ${card.cost ?? 0}`, `${card.damage ?? 0} dmg`, method, moveType, state, counterText, req, position, card.defensiveOnly ? "Counter only" : "", card.effectText ?? ""].filter(Boolean).join(" · ");
}

function cardLegal(playerId, card) {
  const state = game.state();
  if (playerId !== HUMAN) return false;
  if (state.pendingActionDiscard?.playerId === playerId) return false;
  if (state.phase === "ACTION") {
    if (card.kind === "momentum") return canPlayMomentum(state, playerId, card);
    if (card.kind === "entrance") return canPlayEntrance(state, playerId, card);
    if (card.kind === "action" && card.special) return canPlaySpecial(state, playerId, card);
    if (card.kind === "action") return canPlayAction(state, playerId, card);
    if (card.kind === "support") return canPlaySupport(state, playerId, card);
    if (card.kind === "manager") return canPlayManager(state, playerId, card);
    if (card.kind === "move") return moveEligibility(state, playerId, card).legal;
  }
  if (state.phase === "COUNTER" && state.proposedMove?.defenderId === playerId) return counterEligibility(state, playerId, state.proposedMove.card, card).legal;
  if (state.phase === "PIN_RESPONSE") return canPlayPinEscape(state, playerId, card);
  return false;
}

function cardReason(playerId, card) {
  const state = game.state();
  if (playerId === CPU) return "CPU controlled";
  if (state.phase === "MATCH_OVER") return "Match over";
  if (state.playerInControl !== playerId && state.phase === "ACTION") return "Not in Control";
  if (state.pendingActionDiscard?.playerId === playerId) return "Choose a page to ditch first";
  if (card.kind === "momentum") return (state.players[playerId].turn?.momentumPlayed ?? 0) >= (state.players[playerId].turn?.momentumPlayLimit ?? 1) ? "Momentum already played this turn — connect a Move or begin a new turn to refresh it" : "";
  if (card.kind === "entrance") return "Entrance resolves automatically pre-match";
  if (state.phase === "COUNTER" && card.kind === "action" && card.effect?.type === "onceTooOften") return counterEligibility(state, playerId, state.proposedMove?.card, card).reason ?? "Reverse repeated Move and gain Control";
  if (card.kind === "action" && card.special) {
    if (canPlaySpecial(state, playerId, card)) {
      if (card.special?.type === "paulHeyman") return "PLAY ACTION · FIND F-5 · -2 COST";
      return "PLAY ACTION";
    }
    if (card.special?.type === "reduceIncomingBig") return `REACTIVE · AUTO-TRIGGERS VS ${card.special.minDamage ?? 10}+ DAMAGE`;
    if (card.special?.type === "paulHeyman") return `Connect with ${card.special.afterName ?? "Brock’s German"} first`;
    return "Action trigger not available";
  }
  if (card.kind === "action" && card.pinEscape) return state.phase === "PIN_RESPONSE" ? "Escape pin" : "Pin-response Action only";
  if (card.kind === "action") { const p=state.players[playerId]; if (p.turn.actionPlayed >= 1) return "Action already played this turn"; if (p.actionLocked) return "Actions are currently locked"; const need=Math.max(0,card.cost??0),have=effectiveTotalMomentum(state,playerId); return have<need ? `Need ${need} Momentum + Attitude` : ""; }
  if (card.kind === "support") return state.players[playerId].turn.supportPlayed >= 1 ? "Support already played this turn" : "";
  if (card.kind === "manager") { const p = state.players[playerId]; if (p.activeManager) return "Manager already active"; if (card.superstarId && card.superstarId !== p.superstar?.id) return "Manager not compatible with this Superstar"; if (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length && !card.allowedSuperstarIds.includes(p.superstar?.id)) return "Manager not compatible with this Superstar"; return ""; }
  if (card.kind === "move" && state.phase === "ACTION") return moveEligibility(state, playerId, card).reason ?? "";
  if (state.phase === "COUNTER") return counterEligibility(state, playerId, state.proposedMove.card, card).reason ?? "Counter";
  if (state.phase === "PIN_RESPONSE") return canPlayPinEscape(state, playerId, card) ? "Escape pin" : "Not a pin response";
  return "";
}

function advanceCpu() {
  const { steps } = advanceCpuUntilHuman(game, CPU);
  if (game?.state().phase === "MATCH_OVER") message = game.state().winner ? `${nameFor(game.state().winner)} wins by ${game.state().finish.type.toUpperCase()}!` : `Match ends by ${game.state().finish.type.toUpperCase()}.`;
  else if (steps) message = `${nameFor(CPU)} completed its CPU decisions. Your response is ready.`;
}

function afterHumanAction(immediateEvents = []) {
  flippedHandCards = new Set();
  autoCounterSelecting = false;
  autoCounterSelection = new Set();
  const before = game.state().log.length;
  advanceCpu();
  const events = [...immediateEvents, ...game.state().log.slice(before)];
  const sequence = presentationFromEvents(events);
  if (sequence) spectacleSequence(sequence, () => render()); else render();
}

function playCard(playerId, index) {
  const state = game.state(), card = state.players[playerId].hand[index];
  if (!card || playerId !== HUMAN) return;
  const logBefore = state.log.length;
  try {
    let played = false;
    if (state.phase === "COUNTER") played = game.counter(playerId, card);
    else if (state.phase === "PIN_RESPONSE") played = game.playPinEscape(playerId, card);
    else if (card.kind === "momentum") played = game.playMomentum(playerId, card);
    else if (card.kind === "entrance") played = game.playEntrance(playerId, card);
    else if (card.kind === "action" && card.special) played = game.playSpecial(playerId, card);
    else if (card.kind === "action") played = game.playAction(playerId, card);
    else if (card.kind === "support") played = game.playSupport(playerId, card);
    else if (card.kind === "manager") played = game.playManager(playerId, card);
    else played = game.declareMove(playerId, card);
    if (!played) { message = `${card.name} cannot be played in this window.`; render(); return; }
    message = game.state().pendingActionDiscard?.playerId === playerId ? `${card.name}: choose ${game.state().pendingActionDiscard.count} page to ditch.` : `${nameFor(playerId)} played ${card.name}.`;
  } catch (error) { message = error.message; }
  afterHumanAction(game.state().log.slice(logBefore));
}

function beginAutoCounter() {
  const state = game.state(), eligibility = autoCounterEligibility(state, HUMAN, state.proposedMove?.card);
  if (!eligibility.legal) { message = eligibility.reason ?? "Auto Counter is not available."; autoCounterSelecting = false; autoCounterSelection = new Set(); render(); return; }
  autoCounterSelecting = true;
  autoCounterSelection = new Set();
  message = `Select exactly ${eligibility.cost} pages to ditch. At least 2 pages will remain in hand.`;
  render();
}
function cancelAutoCounter() { autoCounterSelecting = false; autoCounterSelection = new Set(); message = "Auto Counter cancelled."; render(); }
function toggleAutoCounterCard(index) {
  if (!autoCounterSelecting) return;
  const eligibility = autoCounterEligibility(game.state(), HUMAN, game.state().proposedMove?.card);
  if (!eligibility.legal) { cancelAutoCounter(); return; }
  if (autoCounterSelection.has(index)) autoCounterSelection.delete(index);
  else if (autoCounterSelection.size < eligibility.cost) autoCounterSelection.add(index);
  message = `${autoCounterSelection.size}/${eligibility.cost} pages selected to ditch.`;
  render();
}
function confirmAutoCounter() {
  const state = game.state(), eligibility = autoCounterEligibility(state, HUMAN, state.proposedMove?.card);
  if (!eligibility.legal || autoCounterSelection.size !== eligibility.cost) { message = eligibility.legal ? `Select exactly ${eligibility.cost} pages.` : eligibility.reason; render(); return; }
  const logBefore = state.log.length;
  try { game.autoCounter(HUMAN, [...autoCounterSelection]); message = `${nameFor(HUMAN)} Auto Countered ${state.proposedMove?.card?.name ?? "the Move"}.`; }
  catch (error) { message = error.message; }
  autoCounterSelecting = false; autoCounterSelection = new Set();
  afterHumanAction(game.state().log.slice(logBefore));
}

function passAction() {
  const state = game.state();
  const logBefore = state.log.length;
  try {
    if (decisionOwner(state) !== HUMAN) return;
    if (state.phase === "COUNTER") game.passCounter(HUMAN);
    else if (state.phase === "PIN_RESPONSE") game.passPinResponse(HUMAN);
    else if (state.phase === "SUBMISSION_RESPONSE") game.passSubmissionResponse(HUMAN);
    else if (state.phase === "ACTION") game.passTurn(HUMAN);
  } catch (error) { message = error.message; }
  const immediateEvents = game.state().log.slice(logBefore);
  if (immediateEvents.some(e => ["PIN_CHECK","KICK_OUT","MATCH_ENDED"].includes(e.type))) {
    flippedHandCards = new Set();
    const beforeCpu = game.state().log.length; advanceCpu();
    const sequence = presentationFromEvents([...immediateEvents,...game.state().log.slice(beforeCpu)]);
    if (sequence) spectacleSequence(sequence, () => render()); else render();
  } else afterHumanAction();
}

function attemptPin() { try { game.attemptPin(HUMAN); } catch (e) { message = e.message; } afterHumanAction(); }
function endPostMove() { try { game.endPostMove(HUMAN); } catch (e) { message = e.message; } afterHumanAction(); }
function followOutside() { try { game.followOutside(HUMAN); message = `${nameFor(HUMAN)} followed the opponent to ringside.`; } catch (e) { message = e.message; } afterHumanAction(); }
function returnToRing() { try { game.returnToRing(HUMAN); message = `${nameFor(HUMAN)} returned to the ring.`; } catch (e) { message = e.message; } afterHumanAction(); }
function releaseSubmission() { try { game.releaseSubmission(HUMAN); } catch (e) { message = e.message; } afterHumanAction(); }
function maintainSubmission(index) {
  try { const card = game.state().players[HUMAN].hand[index]; game.maintainSubmission(HUMAN, card); }
  catch (e) { message = e.message; }
  afterHumanAction();
}

function renderMomentum(player) {
  const resources = [
    ["agility","AG",player.momentum.agility ?? 0],
    ["strength","ST",player.momentum.strength ?? 0],
    ["strike","SR",player.momentum.strike ?? 0],
    ["technical","TE",player.momentum.technical ?? 0],
    ["adrenaline","AD",player.adrenaline ?? 0]
  ];
  return resources.map(([method,label,value]) => `<span class="hud-resource ${method}" title="${method}"><i>${label}</i><b>${value}</b></span>`).join("");
}

function abilityStatus(player) {
  const ability = player.superstar.ability;
  if (player.superstar?.id === "goldberg") return `${player.streakCounters ?? 0}/3 STREAK`;
  if (ability?.passive) return "PASSIVE";
  const max = ability?.maxUses ?? 1;
  if (max > 1) return `${player.abilityUses ?? 0}/${max}`;
  return player.abilityUsed ? "USED" : "READY";
}

function submissionHud(player) {
  const labels = { head: "HD", arms: "AR", legs: "LG", back: "BK", chest: "CH", arm: "AR", leg: "LG" };
  const threshold = submissionThreshold(player);
  return Object.entries(player.submissionDamage).map(([part, value]) => {
    const pct = Math.max(0, Math.min(100, (value / threshold) * 100));
    const stateClass = pct >= 75 ? "danger" : pct >= 45 ? "warning" : "";
    return `<span class="hud-body-part ${stateClass}" title="${part} persistent damage ${value}/${threshold}"><small>${labels[part] ?? part.slice(0,2).toUpperCase()}</small><b>${value}</b></span>`;
  }).join("");
}

function healthClass(player) {
  const zone = healthZone(player);
  return zone === "green" ? "healthy" : zone === "amber" ? "average" : "danger";
}

function renderWrestlerHud(playerId) {
  const state = game.state(), p = state.players[playerId], cpu = playerId === CPU;
  const control = state.playerInControl === playerId && state.phase !== "MATCH_OVER";
  const statusText = `${p.posture === "on-mat" ? "GROUNDED" : "STANDING"}${p.status.stunnedTurns ? ` · STUN ${p.status.stunnedTurns}` : ""}`;
  const headshot = superstarHeadshotFor(p.superstar.id);
  const fallback = GENERIC_SUPERSTAR_PLACEHOLDER;
  return `<article class="wrestler-hud premium-headshot-hud ${cpu ? "cpu" : "human"} ${control ? "in-control" : ""}">
    <div class="hud-primary-line">
      <button type="button" class="hud-headshot-trigger" data-open-superstar="${p.superstar.id}" aria-label="Open ${p.superstar.name} Superstar card">
        <img class="hud-headshot" src="${headshot}" alt="${p.superstar.name}" data-headshot-fallback="${fallback ?? ""}" onerror="if(this.dataset.headshotFallback&&this.src!==this.dataset.headshotFallback){this.src=this.dataset.headshotFallback;return;}this.onerror=null;this.closest('.hud-headshot-trigger')?.classList.add('art-pending');">
        <span class="hud-side-label">${cpu ? "CPU" : "YOU"}${control ? " · CONTROL" : ""}</span>
      </button>
      <div class="hud-hp-number ${healthClass(p)}"><b>${p.hp}</b><small>HP</small></div>
    </div>
    <strong class="hud-superstar-name">${p.superstar.name}</strong>
    <div class="hud-resource-row">${renderMomentum(p)}</div>
    <div class="hud-body-damage"><div>${submissionHud(p)}</div></div>
    <div class="cinematic-hud-status">${statusText}</div>
  </article>`;
}
let playPileOverlayCard = null, playPileOverlayFlipped = false;
let matchSpectacle = null, matchSpectacleTimer = null;

function renderSuperstarOverlay() {
  if (!superstarOverlayId) return "";
  const star = superstarById[superstarOverlayId];
  const card = superstarCollectibleFor(superstarOverlayId);
  if (!star || !card) return "";
  return `<div class="superstar-card-modal" data-superstar-modal-backdrop="1"><div class="superstar-card-modal-inner">${collectibleCardMarkup(card,{flipped:superstarOverlayFlipped,extraClass:"hud-superstar-modal-card",flipAttr:'data-flip-superstar-modal="1"'})}<small>Tap card to ${superstarOverlayFlipped ? "show front" : "flip"} · Tap outside to close</small></div></div>`;
}

function renderPlayPileOverlay() {
  if (!playPileOverlayCard) return "";
  return `<div class="superstar-card-modal play-pile-card-modal" data-play-pile-modal-backdrop="1"><div class="superstar-card-modal-inner play-pile-card-modal-inner">${collectibleCardMarkup(playPileOverlayCard,{flipped:playPileOverlayFlipped,extraClass:"hud-superstar-modal-card play-pile-modal-card",flipAttr:'data-flip-play-pile-modal="1"'})}<small>Tap card to ${playPileOverlayFlipped ? "show front" : "flip"} · Tap outside to close</small></div></div>`;
}

function renderHandOverlay() {
  if (!handOverlayCard) return "";
  return `<div class="superstar-card-modal hand-card-modal" data-hand-card-modal-backdrop="1"><div class="superstar-card-modal-inner hand-card-modal-inner">${collectibleCardMarkup(handOverlayCard,{flipped:handOverlayFlipped,extraClass:"hud-superstar-modal-card hand-modal-card",flipAttr:'data-flip-hand-modal="1"'})}<small>Tap card to ${handOverlayFlipped ? "show front" : "flip"} · Tap outside to close</small></div></div>`;
}

function renderMatchSpectacle() {
  if (!matchSpectacle) return "";
  const card = matchSpectacle.cardId ? collectionCards.find(c => c.id === matchSpectacle.cardId) : null;
  const spectacleCopy = matchSpectacle.kind === "submission-lock"
    ? "SUBMISSION<br>LOCKED IN"
    : matchSpectacle.text;
  return `<div class="match-spectacle ${matchSpectacle.kind ?? "pin"}" aria-live="assertive"><div class="match-spectacle-copy">${spectacleCopy}</div>${card ? `<div class="pin-escape-card-showcase">${collectibleCardMarkup(card,{flipped:false,interactive:false,extraClass:"pin-escape-action-card"})}<small>${matchSpectacle.detail ?? "This Action stopped the three-count."}</small></div>` : ""}</div>`;
}

function spectacleSequence(steps, done) {
  if (matchSpectacleTimer) clearTimeout(matchSpectacleTimer);
  let i = 0;
  const next = () => {
    if (i >= steps.length) { matchSpectacle = null; matchSpectacleTimer = null; done?.(); return; }
    matchSpectacle = steps[i++];
    render();
    matchSpectacleTimer = setTimeout(next, matchSpectacle.duration ?? 650);
  };
  next();
}

function presentationFromEvents(events) {
  if (!events?.length) return null;
  const ended = [...events].reverse().find(e => e.type === "MATCH_ENDED");
  const pinCheck = [...events].reverse().find(e => e.type === "PIN_CHECK");
  const pinEscape = [...events].reverse().find(e => e.type === "PIN_ESCAPED_SPECIAL");
  const kickoutEvent = [...events].reverse().find(e => e.type === "KICK_OUT");
  const kicked = !!kickoutEvent;
  const kickoutDefenderId = pinEscape?.defenderId ?? kickoutEvent?.defenderId ?? null;
  const greenHealthKickout = !!kickoutDefenderId && healthZone(game?.state()?.players?.[kickoutDefenderId]) === "green";
  const beastTrigger = [...events].reverse().find(e => e.type === "SPECIAL_EFFECT" && e.effect === "reduce-incoming-big" && e.cardId === "special-brock-lesnar");
  if (beastTrigger) return [{text:"THE BEAST INCARNATE",kind:"pin-escape",duration:1250,cardId:beastTrigger.cardId,detail:`Incoming damage reduced by ${beastTrigger.reducedBy ?? 5}. +1 Strength Momentum.`}];
  if (pinEscape) return greenHealthKickout
    ? [{text:"1!",kind:"pin",duration:560},{text:"SHOULDER UP!",kind:"pin-escape",duration:1450,cardId:pinEscape.cardId,detail:"Pin-escape Action activated — the count is broken."}]
    : [{text:"1!",kind:"pin",duration:520},{text:"2!!",kind:"pin",duration:620},{text:"SHOULDER UP!",kind:"pin-escape",duration:1450,cardId:pinEscape.cardId,detail:"Pin-escape Action activated — the three-count is broken."}];
  if (ended?.finishType === "submission") return [{text:"SUBMISSION LOCKED IN",kind:"submission-lock",duration:800},{text:"TAP OUT!",kind:"submission",duration:1150}];
  if (ended?.finishType === "i-quit" || ended?.finishType === "i quit") return [{text:"I QUIT!",kind:"submission",duration:1150}];
  if (pinCheck || ended?.finishType === "pin") {
    const success = ended?.finishType === "pin";
    return success
      ? [{text:"1!",kind:"pin",duration:620},{text:"2!!",kind:"pin",duration:760},{text:"3!!!",kind:"pin final",duration:1100}]
      : kicked ? (greenHealthKickout
        ? [{text:"1!",kind:"pin",duration:620},{text:"KICK OUT!",kind:"kickout",duration:1050}]
        : [{text:"1!",kind:"pin",duration:560},{text:"2!!",kind:"pin",duration:920},{text:"KICK OUT!",kind:"kickout",duration:950}]) : null;
  }
  return null;
}

function renderMatchHud() {
  return `<section class="match-hud-shell premium-match-hud">
    <div class="match-hud-grid">${renderWrestlerHud(HUMAN)}${renderWrestlerHud(CPU)}</div>
  </section>`;
}
function playedCardFromEvent(event) {
  if (!event) return null;
  let id = event.cardId ?? event.counterCardId ?? event.managerId ?? null;
  let playerId = event.playerId ?? event.attackerId ?? event.defenderId ?? null;
  if (event.type === "MOVE_COUNTERED") playerId = event.defenderId;
  if (event.type === "MOMENTUM_PLAYED") {
    const setId = game.state().players[event.playerId]?.superstar?.setId;
    id = collectionCards.find(c => c.kind === "momentum" && c.method === event.method && c.setId === setId)?.id
      ?? collectionCards.find(c => c.kind === "momentum" && c.method === event.method)?.id;
  }
  let card = id ? collectionById.get(id) : null;
  if (!card && event.type === "ENTRANCE_PREMATCH") {
    const starId = game.state().players[event.playerId]?.superstar?.id;
    card = collectionCards.find(c => c.kind === "entrance" && c.superstarId === starId && c.name === event.cardName)
      ?? collectionCards.find(c => c.kind === "entrance" && c.name === event.cardName);
  }
  return card ? { card, playerId, event } : null;
}

function currentPlayPile() {
  return reconstructCurrentPlayPile(game.state(), {
    cardById: collectionById,
    playedCardFromEvent,
    humanId: HUMAN,
    cpuId: CPU,
    limit: 8
  });
}

function shortCardMeta(card) {
  if (card.kind === "momentum") return `${card.method?.toUpperCase() ?? "MOMENTUM"} +${card.amount ?? 1}`;
  if (card.kind === "move") return [`COST ${card.cost ?? 0}`, `${card.damage ?? 0} DMG`, card.method?.toUpperCase(), MOVE_TYPE_LABELS[card.moveType]?.toUpperCase()].filter(Boolean).join(" · ");
  return (card.abilityText ?? card.effectText ?? card.rulesText ?? card.kind).replace(/^Support —\s*/i, "");
}

function handCardMeta(card) {
  if (card.kind === "momentum") return `${card.method?.toUpperCase() ?? "MOMENTUM"} +${card.amount ?? 1}`;
  if (card.kind === "move") return [`C${card.cost ?? 0}`, `${card.damage ?? 0} DMG`, card.method?.toUpperCase(), MOVE_TYPE_LABELS[card.moveType]?.toUpperCase()].filter(Boolean).join(" · ");
  return (card.abilityText ?? card.effectText ?? card.rulesText ?? card.kind).replace(/^Support —\s*/i, "");
}

function renderPlayPile() {
  const items = currentPlayPile();
  if (!items.length) return `<section class="play-pile premium-play-pile ${presentationThemeClass(pendingMatch?.brandSetId ?? matchPresentationSetId)}"><div class="play-pile-label"><span>PLAY PILE</span><small>Ring canvas</small></div><div class="ring-play-surface"><span class="ring-ropes"></span>${setLogoMarkup(matchPresentationSetId,"ring-centre-logo")}</div></section>`;
  const cards = items.map((item,index) => {
    const card=item.card, isHuman=item.playerId===HUMAN, latest=index===0;
    const owner=`${isHuman?"YOU":"CPU"} · ${item.playerId?nameFor(item.playerId):"MATCH"}`;
    const actionLabel=item.event?.type==="MOVE_COUNTERED"?"COUNTERED":item.event?.type==="MOVE_CONNECTED"?"CONNECTED":item.event?.type==="MOVE_DECLARED"?"DECLARED":"PLAYED";
    const key=`${card.id}:${item.event?.type??"played"}:${item.playerId??"match"}`;
    const flipped=latest&&playPileCardKey===key&&playPileFlipped;
    if(latest&&key!==playPileCardKey){playPileCardKey=key;playPileFlipped=false;}
    return `<div class="play-pile-item ${isHuman?"from-you":"from-cpu"} ${latest?"is-latest":""}"><div class="play-pile-context"><span>${owner}</span><b>${actionLabel}</b></div><div class="play-pile-card-trigger" data-open-play-pile="${card.id}" role="button" tabindex="0" aria-label="Inspect ${card.name}">${collectibleCardMarkup(card,{flipped:false,extraClass:"play-pile-ccg",eagerArt:true})}</div><small>${shortCardMeta(card)}</small></div>`;
  }).join("");
  return `<section class="play-pile premium-play-pile ${presentationThemeClass(matchPresentationSetId)}"><div class="play-pile-label"><span>PLAY PILE</span><small>${items.length} card${items.length===1?"":"s"} in current exchange</small></div><div class="ring-play-surface"><span class="ring-ropes"></span>${setLogoMarkup(matchPresentationSetId,"ring-centre-logo")}<div class="play-pile-track">${cards}</div></div></section>`;
}
function renderHumanHand() {
  const state = game.state(), p = state.players[HUMAN];
  const active = decisionOwner(state) === HUMAN && state.phase !== "MATCH_OVER";
  const momentumAvailable = (p.turn?.momentumPlayed ?? 0) < (p.turn?.momentumPlayLimit ?? 1);
  const actionDiscard = state.pendingActionDiscard?.playerId === HUMAN ? state.pendingActionDiscard : null;

  const entries = p.hand.map((card, index) => {
    const legal = active && cardLegal(HUMAN, card);
    let priority = 9, damageRank = 0;
    // Response windows always surface the valid answer first.
    if ((state.phase === "COUNTER" || state.phase === "PIN_RESPONSE") && legal) priority = 0;
    else if (state.phase === "ACTION" && card.kind === "momentum" && legal && momentumAvailable) priority = 1;
    // Utility must stay visible before the damage stack so Actions are not buried.
    else if (state.phase === "ACTION" && legal && ["action","special","support","manager"].includes(card.kind)) priority = 2;
    else if (state.phase === "ACTION" && legal && card.kind === "move") { priority = 3; damageRank = -(Number(card.damage) || 0); }
    else if (legal) priority = 4;
    else if (card.kind !== "momentum") priority = 5;
    else priority = 6;
    return { card, index, legal, priority, damageRank };
  }).sort((a,b) => a.priority - b.priority || a.damageRank - b.damageRank || a.index - b.index);

  const autoEligibility = state.phase === "COUNTER" ? autoCounterEligibility(state, HUMAN, state.proposedMove?.card) : null;
  const cards = entries.map(({card,index,legal}) => {
    const reason = legal ? (state.phase === "COUNTER" ? "COUNTER" : state.phase === "PIN_RESPONSE" ? "ESCAPE" : "PLAY") : cardReason(HUMAN, card);
    const autoSelected = autoCounterSelecting && autoCounterSelection.has(index);
    if (actionDiscard) return `<article class="hand-card-slot horizontal-hand-card auto-counter-ditch-card" data-action-ditch-index="${index}" data-original-hand-index="${index}">
      ${collectibleCardMarkup(card,{flipped:false,interactive:false,extraClass:"hand-ccg auto-ditch",eagerArt:true})}
      <div class="hand-card-action auto-counter-card-action"><span>CHOOSE PAGE TO DITCH</span><button type="button" data-action-ditch-index="${index}" class="primary">Ditch</button></div>
    </article>`;
    if (autoCounterSelecting) return `<article class="hand-card-slot horizontal-hand-card auto-counter-ditch-card ${autoSelected ? "is-auto-selected" : ""}" data-auto-ditch-index="${index}" data-original-hand-index="${index}">
      ${collectibleCardMarkup(card,{flipped:false,interactive:false,extraClass:`hand-ccg auto-ditch ${autoSelected ? "selected" : ""}`,eagerArt:true})}
      <div class="hand-card-action auto-counter-card-action"><span>${autoSelected ? "SELECTED TO DITCH" : "TAP CARD TO DITCH"}</span><button type="button" data-auto-ditch-index="${index}" class="${autoSelected ? "primary" : "secondary"}">${autoSelected ? "Selected" : "Select"}</button></div>
    </article>`;
    return `<article class="hand-card-slot horizontal-hand-card ${legal ? "is-playable" : "is-locked"}" data-original-hand-index="${index}">
      <div class="hand-card-inspect-trigger" data-open-hand-card="${index}" role="button" tabindex="0" aria-label="Inspect ${card.name}">${collectibleCardMarkup(card,{flipped:false,interactive:false,extraClass:`hand-ccg ${legal ? "playable" : "locked"}`,eagerArt:true})}</div>
      <div class="hand-card-action"><span>${reason || "Not playable now"}</span><button type="button" data-play-hand="${index}" class="${legal ? "primary" : "secondary"}" ${legal ? "" : "disabled"}>${state.phase === "COUNTER" ? "Counter" : state.phase === "PIN_RESPONSE" ? "Escape" : "Play"}</button></div>
    </article>`;
  }).join("");

  const sortHint = actionDiscard ? `${cardNameFor(actionDiscard.cardId)} · Choose ${actionDiscard.count} page${actionDiscard.count===1?"":"s"} to ditch` : autoCounterSelecting ? `AUTO COUNTER · Select ${autoCounterSelection.size}/${autoEligibility?.cost ?? autoCounterCost(state,HUMAN)} pages to ditch` : state.phase === "COUNTER" ? "Valid Counters first" : state.phase === "PIN_RESPONSE" ? "Pin escapes first" : momentumAvailable ? "Playable Momentum · Actions · Moves by highest damage" : "Actions · playable Moves by highest damage";
  return `<section class="player-hand-panel compact-hand-panel">
    <div class="player-hand-head"><div><span>YOUR HAND</span><h3>${p.superstar.name}</h3></div><div class="deck-counts"><b>${p.hand.length}</b> hand · <b>${p.deck.length}</b> playbook · <b>${p.discard.length}</b> recycle · <b>${p.outOfPlay?.length??0}</b> out</div></div>
    <p class="hand-instruction">${sortHint} · Swipe horizontally to browse.</p>
    <div class="hand collectible-hand horizontal-card-hand">${cards}</div>
  </section>`;
}

function renderCommandBar() {
  const state = game.state(), owner = decisionOwner(state);
  const actionDiscard = state.pendingActionDiscard?.playerId === HUMAN ? state.pendingActionDiscard : null;
  const triggered = state.pendingTriggeredSpecial?.playerId === HUMAN ? state.pendingTriggeredSpecial : null;
  const triggeredCard = triggered ? collectionById.get(triggered.cardId) : null;
  let prompt = state.phase === "MATCH_OVER" ? (state.winner ? `${nameFor(state.winner)} wins by ${state.finish.type.toUpperCase()}!` : `Match ends by ${state.finish.type.toUpperCase()}!`) : owner === CPU ? `${nameFor(CPU)} is thinking…` : actionDiscard ? `${cardNameFor(actionDiscard.cardId)} — choose ${actionDiscard.count} page${actionDiscard.count===1?"":"s"} to ditch.` : `Your turn — choose a page or action.`;
  const autoEligibility = state.phase === "COUNTER" && owner === HUMAN ? autoCounterEligibility(state, HUMAN, state.proposedMove?.card) : null;
  if (state.phase === "TRIGGER_RESPONSE" && owner === HUMAN && triggered) prompt = `${triggeredCard?.name ?? triggered?.abilityName ?? "Triggered Action"} is available ${triggered.reason ?? "now"} — use it or decline.`;
  if (state.phase === "COUNTER" && owner === HUMAN) prompt = autoCounterSelecting ? `AUTO COUNTER — select ${autoEligibility?.cost ?? autoCounterCost(state,HUMAN)} pages to ditch.` : `Counter ${state.proposedMove.card.name}${autoEligibility?.legal ? ", Auto Counter," : ""} or pass.`;
  if (state.phase === "PIN_RESPONSE" && owner === HUMAN) prompt = `You are being pinned — escape or pass to the pin check.`;
  if (state.phase === "SUBMISSION_RESPONSE" && owner === HUMAN) {
    const hold = state.submission;
    prompt = `You are in ${cardNameFor(hold?.cardId) || "a submission"} — pass to resolve the next pressure step.`;
  }
  if (state.phase === "SUBMISSION_MAINTAIN" && owner === HUMAN) prompt = `Maintain the submission or release it and keep Control.`;
  const pinCheck = state.phase === "ACTION" && owner === HUMAN ? canAttemptPin(state, HUMAN) : null;
  return `<section class="match-command ${state.phase === "MATCH_OVER" ? "match-over" : ""}">
    <div class="command-status"><span>TURN ${state.turnNumber}</span><b>${state.phase.replaceAll("_", " ")}</b></div>
    <div class="command-prompt"><strong>${prompt}</strong><small>${message}</small></div>
    <div class="command-actions">
      ${owner === HUMAN && state.phase === "TRIGGER_RESPONSE" && triggered ? `<button id="use-triggered-special" class="primary show-command-button">USE ${(triggeredCard?.name ?? triggered?.abilityName ?? "ACTION").toUpperCase()}</button><button id="decline-triggered-special" class="secondary show-command-button">DECLINE</button>` : ""}
      ${owner === HUMAN && state.phase === "COUNTER" && !autoCounterSelecting && autoEligibility?.legal ? `<button id="auto-counter-action" class="primary show-command-button">AUTO COUNTER · DITCH ${autoEligibility.cost}</button>` : ""}
      ${owner === HUMAN && state.phase === "COUNTER" && !autoCounterSelecting ? '<button id="pass-action" class="primary show-command-button">PASS</button>' : ""}
      ${owner === HUMAN && state.phase === "COUNTER" && autoCounterSelecting ? '<button id="cancel-auto-counter" class="secondary show-command-button">CANCEL</button>' : ""}
      ${owner === HUMAN && state.phase === "COUNTER" && autoCounterSelecting ? `<button id="confirm-auto-counter" class="primary show-command-button" ${autoCounterSelection.size === (autoEligibility?.cost ?? -1) ? "" : "disabled"}>CONFIRM · DITCH ${autoCounterSelection.size}/${autoEligibility?.cost ?? autoCounterCost(state,HUMAN)}</button>` : ""}
      ${owner === HUMAN && state.phase === "ACTION" && !actionDiscard && pinCheck?.legal ? `<button id="attempt-pin" class="primary pin-ready show-command-button single-context-action">PIN</button>` : ""}
      ${owner === HUMAN && state.phase === "ACTION" && !actionDiscard && !pinCheck?.legal && canReturnToRing(state, HUMAN) ? '<button id="return-ring" class="primary show-command-button single-context-action">RETURN TO RING</button>' : ""}
      ${owner === HUMAN && state.phase === "ACTION" && !actionDiscard && !pinCheck?.legal && !canReturnToRing(state, HUMAN) ? '<button id="pass-action" class="secondary show-command-button pass-control-button single-context-action">PASS</button>' : ""}
      ${owner === HUMAN && state.phase === "PIN_RESPONSE" ? '<button id="pass-action" class="primary show-command-button single-context-action">PASS</button>' : ""}
      ${owner === HUMAN && state.phase === "SUBMISSION_RESPONSE" ? '<button id="pass-action" class="primary submission-response-pass show-command-button single-context-action">PASS · CONTINUE HOLD</button>' : ""}
      ${owner === HUMAN && state.phase === "SUBMISSION_MAINTAIN" ? '<button id="release-submission" class="primary show-command-button">Release Hold</button>' : ""}
      ${state.phase === "MATCH_OVER" && activeMode === "ladder" ? '<button id="ladder-hub" class="primary">Return to Money in the Bank</button>' : ""}
      ${state.phase === "MATCH_OVER" && activeMode === "king-of-the-ring" ? '<button id="kotr-hub" class="primary">Return to King of the Ring</button>' : ""}
      ${state.phase === "MATCH_OVER" && activeMode === "championship" ? '<button id="championship-hub" class="primary">Return to Championship Road</button>' : ""}
      ${state.phase === "MATCH_OVER" && activeMode === "live-event" ? '<button id="live-event-hub" class="primary">Return to Live Event</button>' : ""}
    </div>
    <details class="match-menu"><summary>Match Menu</summary><div>
      ${!(state.phase === "MATCH_OVER" && (activeMode === "ladder" || activeMode === "king-of-the-ring" || activeMode === "championship" || activeMode === "live-event")) ? '<button id="reset-match" class="ghost">Restart</button>' : ""}
      <button id="change-matchup" class="ghost">${activeMode === "ladder" ? "Money in the Bank" : activeMode === "king-of-the-ring" ? "King of the Ring Hub" : activeMode === "championship" ? "Championship Hub" : activeMode === "live-event" ? "Live Event Hub" : "Change Matchup"}</button>
      <button id="browse-main-menu" class="ghost">Main Menu</button><button id="browse-collection" class="ghost">Collection</button><button id="browse-boosters" class="ghost">Boosters (${profile.boosterCredits ?? 0})</button><button id="browse-challenges" class="ghost">Challenges</button><button id="browse-decks" class="ghost">Deck Builder</button>
    </div></details>
  </section>`;
}

function logText(event) {
  const n = id => id ? game.state().players[id]?.superstar.name ?? id : "";
  const map = {
    PRE_MATCH_STARTED: () => `PRE-MATCH: both linked Entrance cards are revealed.`,
    ENTRANCE_PREMATCH: () => `${n(event.playerId)} revealed ${event.cardName}.`,
    ENTRANCE_EFFECT: () => `${event.cardName} triggered for ${n(event.playerId)}.`,
    BELL_RANG: () => `The bell rings! ${n(event.control)} has opening Control.`,
    MATCH_STARTED: () => `${n(event.control)} starts Turn 1 in Control.`, MATCH_MODIFIER_APPLIED: () => `${event.name}: ${event.ruleText || event.changes?.join(" · ") || "Live Event modifier applied."}`, MOMENTUM_PLAYED: () => `${n(event.playerId)} played ${event.method} Momentum.`,
    ENTRANCE_PLAYED: () => `${n(event.playerId)} played Entrance ${event.cardId}.`, ACTION_PLAYED: () => `${n(event.playerId)} played ${cardNameFor(event.cardId)}.`, HEALTH_RESTORED: () => `${cardNameFor(event.cardId)} restores ${event.amount} HP to ${n(event.playerId)}.`, FIGHT_FOREVER: () => `Fight Forever restores ${event.playerHeal} HP to ${n(event.playerId)} and ${event.opponentHeal} HP to ${n(event.opponentId)}.`, SUPPORT_PLAYED: () => `${n(event.playerId)} put ${cardNameFor(event.cardId)} into play.`, SUPPORT_REPLACED: () => `${n(event.playerId)} discarded ${cardNameFor(event.cardId)}.`, MANAGER_PLAYED: () => `${n(event.playerId)} brought ${event.managerName} to ringside.`, MANAGER_ABILITY: () => `${event.managerName} assisted ${n(event.playerId)}.`, MOVE_DECLARED: () => `${n(event.playerId)} declared ${cardNameFor(event.cardId)}.`,
    MOVE_COUNTERED: () => `${n(event.defenderId)} countered ${cardNameFor(event.incomingCardId)} with ${cardNameFor(event.counterCardId)}.`, AUTO_COUNTER: () => `${n(event.defenderId)} Auto Countered ${cardNameFor(event.incomingCardId)} by ditching ${event.cost} pages (use ${event.useNumber}); ${event.remaining} pages remained.`,
    COUNTER_PASSED: () => `${n(event.defenderId)} passed the counter window.`, MOVE_CONNECTED: () => `${cardNameFor(event.cardId)} connected for ${event.damage} damage${event.finisher ? " (FINISHER)" : ""}.`,
    CARDS_DRAWN: () => `${n(event.playerId)} drew ${event.cardIds.length} page${event.cardIds.length === 1 ? "" : "s"}.`, ACTION_DISCARD_RESOLVED: () => `${n(event.playerId)} ditched ${cardNameFor(event.cardId)} for ${cardNameFor(event.sourceCardId)}.`, SPECIAL_PLAYED: () => `${n(event.playerId)} triggered ${cardNameFor(event.cardId)}.`, SPECIAL_EFFECT: () => event.effect === "reduce-incoming-big" ? `${cardNameFor(event.cardId)} reduced the incoming Move by ${event.reducedBy ?? 0}.` : event.effect === "paul-heyman" ? `${cardNameFor(event.cardId)} found/armed F-5 with a -${event.discount ?? 0} Cost discount.` : `${cardNameFor(event.cardId)} resolved.`, CONTROL_PASSED: () => `${n(event.from)} passed Control to ${n(event.to)}.`, CONTROL_RETAINED: () => `${n(event.playerId)} connected and keeps Control.`, CRITICAL_EXHAUSTION: () => `${n(event.playerId)} is at 0 HP and cannot retain Control. Control passes to ${n(event.to)}.`,
    POST_MOVE_WINDOW: () => `${n(event.attackerId)} has a post-move finish window.`, PIN_ATTEMPTED: () => `${n(event.attackerId)} attempts pin #${event.attemptNumber}; ${event.chance}% prototype chance.`,
    PIN_ESCAPED_SPECIAL: () => `${n(event.defenderId)} used a pin-escape Action.`, PIN_CHECK: () => `Pin check: rolled ${event.roll} vs ${event.chance}%.`, KICK_OUT: () => `${n(event.defenderId)} kicks out and takes Control.`,
    BODY_PART_DAMAGE: () => `${cardNameFor(event.cardId)} deals +${event.amount} ${event.bodyPart} body-part damage (${event.total}/${event.threshold} current HP).`, SUBMISSION_DAMAGE: () => `${event.bodyPart} submission damage ${event.total}/${event.threshold} current HP.`, SUBMISSION_RESPONSE_READY: () => `${n(event.defenderId)} is trapped in ${cardNameFor(event.cardId)} and must respond before more pressure is applied.`, SUBMISSION_RESPONSE_PASSED: () => `${n(event.defenderId)} continues fighting the hold.`, SUBMISSION_MAINTAINED: () => `${n(event.attackerId)} maintained the hold.`, SUBMISSION_RELEASED: () => `${n(event.attackerId)} released the hold; body-part damage remains.`,
    SUPERSTAR_ABILITY: () => `${n(event.playerId)} triggered ${event.abilityName}${event.maxUses > 1 ? ` (${event.use}/${event.maxUses})` : ""}.`, SUPERSTAR_PASSIVE: () => `${n(event.playerId)}'s ${event.abilityName} prevented the Stun.`, SENT_TO_RINGSIDE: () => `${n(event.defenderId)} was sent to ringside.`, FOLLOWED_OUTSIDE: () => `${n(event.attackerId)} followed the fight to ringside.`, RETURNED_TO_RING: () => `${n(event.playerId)} returned to the ring.`, COUNT_OUT_TICK: () => `Referee count: ${event.count}/${game.state().countOut.limit}.`, COUNT_OUT_RESET: () => `Count-out reset after both wrestlers returned to the ring.`, MATCH_ENDED: () => event.winnerId ? `${n(event.winnerId)} wins by ${event.finishType.toUpperCase()}.` : `Match ends by ${event.finishType.toUpperCase()}.`
  };
  return map[event.type]?.() ?? event.type.replaceAll("_", " ").toLowerCase();
}

function renderMatchLog() {
  const entries = [...game.state().log].reverse();
  return `<details class="match-log compact-log"><summary><span>Match Log</span><b>${entries.length} actions</b></summary><div class="match-log-scroll">${entries.map(e=>`<p><b>T${e.turn}</b> ${logText(e)}</p>`).join("")}</div></details>`;
}

function renderSubmissionChooser() {
  const state = game.state();
  if (state.phase === "SUBMISSION_RESPONSE" && decisionOwner(state) === HUMAN) {
    const sub = state.submission, defender = state.players[HUMAN];
    const total = defender.submissionDamage[sub.bodyPart], threshold = submissionThreshold(defender), pct = threshold<=0?100:Math.min(100,(total/threshold)*100);
    return `<section class="submission-panel premium-submission submission-defense-panel"><div class="submission-lock-head"><span>YOU ARE IN THE HOLD</span><h3>${cardNameFor(sub.cardId)}</h3><small>${sub.bodyPart.toUpperCase()} DAMAGE · ${total}/${threshold} TO TAP</small></div><div class="submission-pressure"><div><b>${total}</b><span>/ ${threshold} HP TO TAP</span></div><i><em style="width:${pct}%"></em></i></div><p>The hold is locked in. Press <b>Pass · Continue Hold</b> to resolve the next pressure step. If the attacker maintains, another response window appears before any further pressure can resolve.</p></section>`;
  }
  if (state.phase !== "SUBMISSION_MAINTAIN" || decisionOwner(state) !== HUMAN) return "";
  const sub = state.submission, attacker = state.players[HUMAN], defender = state.players[sub.defenderId];
  const total = defender.submissionDamage[sub.bodyPart], threshold = submissionThreshold(defender), pct = threshold<=0?100:Math.min(100,(total/threshold)*100);
  return `<section class="submission-panel premium-submission"><div class="submission-lock-head"><span>${sub.finisher ? "SUBMISSION FINISHER" : sub.trademark ? "TRADEMARK HOLD" : "SUBMISSION LOCKED IN"}</span><h3>${cardNameFor(sub.cardId)}</h3><small>${sub.bodyPart.toUpperCase()} DAMAGE · PERSISTS</small></div><div class="submission-pressure"><div><b>${total}</b><span>/ ${threshold} HP TO TAP</span></div><i><em style="width:${pct}%"></em></i></div><p>Submission Turn <b>${sub.holdTurn ?? 1}</b>. Each successful turn adds <b>+${sub.damage}</b> ${sub.bodyPart} damage. Ditch one page to squeeze again. Body-part damage stays after release; the opponent taps as soon as this damage meets or exceeds their <b>current HP</b>.</p><div class="ditch-row">${attacker.hand.map((c,i)=>`<button data-ditch="${i}"><span>DITCH</span><b>${c.name}</b></button>`).join("")}</div></section>`;
}

function victoryBoosterSetId(state) {
  if (activeMode === "live-event") {
    const entry = activeLiveEventTowerKey ? liveEventTowerState(profile, activeLiveEventTowerKey, new Date()) : null;
    return entry?.state?.activeRun?.rewardSetId ?? entry?.tower?.event?.rewardSetId ?? "summerslam-series-1";
  }
  if (activeMode === "ladder") return ladderState(profile).activeRun?.setId ?? "summerslam-series-1";
  if (activeMode === "championship") {
    const run = championshipRoadState(profile).activeRun;
    return championshipRoadSectionForStage(run?.stage ?? 0)?.setId ?? "summerslam-series-1";
  }
  const starSet = state?.players?.[HUMAN]?.superstar?.setId;
  return isPlayerReleasedSetId(starSet) ? starSet : "summerslam-series-1";
}

function handleCompletedMatch() {
  const state = game.state();
  if (state.phase !== "MATCH_OVER" || matchRewarded) return;
  if (profile.onboarding && !profile.onboarding.complete) profile.onboarding.complete = true;
  matchRewarded = true;
  recordCompletedMatchChallenges(profile, state, HUMAN, activeMode);
  const result = state.winner === HUMAN ? "win" : "loss";
  recordCareerMatch(profile, { result, superstarId: state.players[HUMAN].superstar.id, mode: activeMode, finishType: state.finish?.type ?? "match" });
  const seasonXpReward = awardMatchSeasonXp(profile, result);
  queueTierUps(seasonXpReward.tierBefore, seasonXpReward.tierAfter, seasonXpReward.before, seasonXpReward.after);
  const seasonXpText = seasonXpReward.awarded ? ` +${seasonXpReward.awarded} Season XP.` : "";
  const victorySetId = victoryBoosterSetId(state);
  const awardNormalVictoryPack = (modeCompleted = false) => {
    if (modeCompleted) return "";
    const awarded = grantVictoryBooster(profile, result, victorySetId);
    return awarded ? ` +1 ${sets[victorySetId]?.displayName ?? victorySetId} victory booster.` : "";
  };

  if (activeMode === "king-of-the-ring") {
    const outcome = recordKingOfTheRingMatch(profile, result);
    const run = kingOfTheRingState(profile).activeRun;
    if (outcome.status === "advance") message = `${KING_OF_THE_RING_ROUNDS[run.stage - 1]} won! One step closer to the crown. Next: ${KING_OF_THE_RING_ROUNDS[run.stage]}.`;
    else if (outcome.status === "eliminated") message = `Eliminated from King of the Ring. One loss ends the tournament — enter a new bracket.`;
    else if (outcome.status === "cleared") {
      prepareKingOfTheRingReward(profile, playerReleasedCollectibleSetIds(new Date()), Math.random);
      message = `KING OF THE RING! ${state.players[HUMAN].superstar.name} won three straight matches. The coronation and choose-one Super Pack reward await.`;
    }
    message += awardNormalVictoryPack(outcome.status === "cleared") + seasonXpText;
    refreshCareerAchievements(profile);
    saveProfile(profile);
    return;
  }

  if (activeMode === "championship") {
    const outcome = recordChampionshipMatch(profile, result);
    const run = championshipRoadState(profile).activeRun;
    const checkpointSetId = outcome.sectionCleared?.setId ?? victorySetId;
    if (outcome.status === "advance") {
      const checkpointText = outcome.sectionCleared ? ` ${outcome.sectionCleared.label} complete.` : '';
      message = `${CHAMPIONSHIP_STAGES[run.stage - 1]} won!${checkpointText} Return to Championship Road for ${CHAMPIONSHIP_STAGES[run.stage]}.`;
    }
    else if (outcome.status === "retry" && result === "loss") message = `Defeat. Championship Road is still alive — retry ${CHAMPIONSHIP_STAGES[run.stage]}.`;
    else if (outcome.status === "cleared") {
      message = `CHAMPIONSHIP ROAD CLEARED on ${CHAMPIONSHIP_DIFFICULTIES[run.difficultyId]?.label ?? run.difficultyId}! Final region complete and a boosted-odds Super Pack has been awarded.${outcome.unlockedDifficulty ? ` ${CHAMPIONSHIP_DIFFICULTIES[outcome.unlockedDifficulty].label} is now unlocked.` : ''}`;
    }
    message += awardNormalVictoryPack(outcome.status === "cleared") + seasonXpText;
    refreshCareerAchievements(profile);
    saveProfile(profile);
    return;
  }

  if (activeMode === "live-event") {
    const now = new Date();
    const towerKey = activeLiveEventTowerKey;
    const entryBefore = towerKey ? liveEventTowerState(profile, towerKey, now) : null;
    const tower = entryBefore?.tower;
    const runBefore = entryBefore?.state?.activeRun;
    if (!tower || !runBefore) { message = `Live Event result recorded.${seasonXpText}`; saveProfile(profile); return; }
    const rewardSetId = runBefore.rewardSetId ?? tower.event.rewardSetId;
    const outcome = recordLiveEventTowerMatch(profile, towerKey, result, now);
    const entry = liveEventTowerState(profile, towerKey, now);
    const run = entry?.state?.activeRun;
    if (outcome.status === "advance") {
      const nextOpponent = superstarById[currentLiveEventTowerOpponent(profile, towerKey, now)]?.name ?? "next opponent";
      const nextStage = currentLiveEventTowerStage(profile, towerKey, now);
      message = `${tower.cadenceLabel} match cleared! Next: ${nextStage.label} vs ${nextOpponent}.`;
    } else if (outcome.status === "retry") {
      const currentOpponent = superstarById[currentLiveEventTowerOpponent(profile, towerKey, now)]?.name ?? "this opponent";
      message = `Defeat. No Live Event progress lost — retry Match ${(run?.stage ?? 0) + 1} against ${currentOpponent}.`;
    } else if (outcome.status === "cleared") {
      message = `${tower.cadenceLabel} CLEARED! A boosted-odds ${sets[rewardSetId]?.displayName ?? rewardSetId} Super Pack has been awarded.`;
    }
    message += awardNormalVictoryPack(outcome.status === "cleared") + seasonXpText;
    refreshCareerAchievements(profile);
    saveProfile(profile);
    return;
  }


  if (activeMode !== "ladder") {
    message += awardNormalVictoryPack(false) + seasonXpText;
    refreshCareerAchievements(profile);
    saveProfile(profile);
    return;
  }

  const outcome = recordLadderMatch(profile, result, new Date());
  const run = ladderState(profile).activeRun;
  if (outcome.status === "advance") message = `Level cleared! ${run.lives} lives remain. Return to Money in the Bank for Level ${run.rung + 1}.`;
  else if (outcome.status === "retry" && result === "loss") message = `Defeat. One life lost — ${run.lives} remaining. Return to Money in the Bank to retry this level.`;
  else if (outcome.status === "failed") message = `Run ended. All three lives are gone — start again from level 1.`;
  else if (outcome.status === "cleared") { message = `MONEY IN THE BANK CLEARED! Today’s 8-Superstar tower is complete and a boosted-odds Super Pack has been awarded.`; }
  message += awardNormalVictoryPack(outcome.status === "cleared") + seasonXpText;
  refreshCareerAchievements(profile);
  saveProfile(profile);
}

function queueTierUps(tierBefore, tierAfter, xpBefore = 0, xpAfter = 0) {
  if (tierAfter <= tierBefore) return;
  for (let tier = tierBefore + 1; tier <= tierAfter; tier += 1) {
    pendingTierUps.push({ tier, reward: tierReward(tier), xpBefore, xpAfter });
  }
}

function tierUpRewardMarkup(event) {
  const reward = event.reward;
  if (reward.kind === "booster") {
    const info = sets[reward.setId];
    return `<div class="tier-up-reward tier-up-booster-reward">${physicalBoosterPackMarkup({setId:reward.setId,title:info?.name ?? "SEASON REWARD",series:"SERIES 1",subtitle:"BOOSTER PACK",extraClass:"tier-up-reward-pack"})}<strong>${info?.displayName ?? reward.setId} Booster</strong><small>UNLOCKED · CLAIM IT FROM THE SEASON ROAD</small></div>`;
  }
  if (reward.kind === "universe-points") {
    return `<div class="tier-up-reward tier-up-up-reward"><div class="tier-up-up-coin"><b>${reward.amount}</b><span>UP</span></div><strong>${reward.amount} Universe Points</strong><small>UNLOCKED · CLAIM IT FROM THE SEASON ROAD</small></div>`;
  }
  const starCard = superstarCollectibleFor(reward.superstarId);
  return `<div class="tier-up-reward tier-up-superstar-reward">${starCard ? collectibleCardMarkup(starCard,{extraClass:"tier-up-superstar-card"}) : portraitMarkup(reward.superstarId,reward.name ?? "Season Reward")}<strong>THE ROCK — FINAL BOSS</strong><small>SEASON 1 COMPLETION REWARD UNLOCKED</small></div>`;
}

function tierUpMarkup(event) {
  const milestone = event.tier === 100 || event.tier % 10 === 0;
  return `<section class="tier-up-celebration ${milestone ? 'major-tier' : ''}" role="dialog" aria-modal="true" aria-label="Tier ${event.tier} reached"><div class="tier-up-pyro" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="tier-up-card"><span>SEASON 1 · LEVEL UP</span><h1>TIER UP</h1><div class="tier-up-number"><small>TIER</small><b>${event.tier}</b><em>REACHED</em></div><div class="tier-up-xp-slam"><i></i><strong>${event.xpAfter} XP</strong></div>${tierUpRewardMarkup(event)}<button id="tier-up-continue" type="button">${pendingTierUps.length > 1 ? 'NEXT TIER' : 'CONTINUE'}</button></div></section>`;
}

function showTierUpCelebration() {
  let layer = document.querySelector('#tier-up-layer');
  if (!pendingTierUps.length) {
    layer?.remove();
    document.body.classList.remove('tier-up-open');
    return;
  }
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'tier-up-layer';
    document.body.appendChild(layer);
  }
  document.body.classList.add('tier-up-open');
  layer.innerHTML = tierUpMarkup(pendingTierUps[0]);
  layer.querySelector('#tier-up-continue')?.addEventListener('click', () => {
    pendingTierUps.shift();
    if (pendingTierUps.length) showTierUpCelebration();
    else {
      layer.remove();
      document.body.classList.remove('tier-up-open');
    }
  });
}

function renderMatchResults() {
  const state = game.state();
  const humanWon = state.winner === HUMAN;
  const winnerName = state.winner ? nameFor(state.winner) : "NO RESULT";
  const loserId = state.winner === HUMAN ? CPU : HUMAN;
  const finish = (state.finish?.type ?? "match").replaceAll("_", " ").toUpperCase();
  const humanStar = state.players[HUMAN].superstar;
  const isLiveEvent = activeMode === "live-event";
  const isKingOfTheRing = activeMode === "king-of-the-ring";
  const isLadder = activeMode === "ladder";
  const isChampionship = activeMode === "championship";
  const liveEntry = isLiveEvent && activeLiveEventTowerKey ? liveEventTowerState(profile, activeLiveEventTowerKey, new Date()) : null;
  const liveTower = liveEntry?.tower ?? null;
  const liveRun = liveEntry?.state?.activeRun ?? null;
  const ladderRun = isLadder ? ladderState(profile,new Date()).activeRun : null;
  const champRun = isChampionship ? championshipRoadState(profile).activeRun : null;
  const championshipRewardStage = Math.max(0, (champRun?.stage ?? 1) - (humanWon ? 1 : 0));
  const rewardSetId = isLiveEvent
    ? (liveRun?.rewardSetId ?? liveTower?.event.rewardSetId ?? "summerslam-series-1")
    : isLadder
      ? (ladderRun?.setId ?? "summerslam-series-1")
      : isChampionship
        ? (championshipRoadSectionForStage(championshipRewardStage)?.setId ?? "summerslam-series-1")
        : (isPlayerReleasedSetId(humanStar.setId) ? humanStar.setId : "summerslam-series-1");
  const rewardName = sets[rewardSetId]?.displayName ?? rewardSetId;
  const liveFinalClear = isLiveEvent && humanWon && liveEntry?.state?.cleared && liveRun?.status === "cleared";
  const championshipCleared = isChampionship && humanWon && champRun?.status === "cleared";
  const ladderCleared = isLadder && humanWon && ladderRun?.status === "cleared";
  let rewardLine = humanWon ? `1 × ${rewardName} Victory Booster` : "NO REWARD";
  let rewardMarkup = humanWon
    ? `<div class="results-pack-reward">${physicalBoosterPackMarkup({setId:rewardSetId,title:sets[rewardSetId]?.name ?? "WWE LEGACY",series:"SERIES 1",subtitle:"VICTORY BOOSTER",extraClass:"results-booster"})}<strong>${rewardLine}</strong></div>`
    : `<strong>${rewardLine}</strong>`;
  let showRewardButton = humanWon;

  if (isKingOfTheRing) {
    const kotrRun = kingOfTheRingState(profile).activeRun;
    const tournamentWon = humanWon && kotrRun?.status === "cleared";
    if (tournamentWon) {
      rewardLine = `Super Pack choice after coronation`;
      rewardMarkup = `<div class="results-crown-reward"><span>♛</span><strong>${rewardLine}</strong><small>THE KING OF THE RING CORONATION IS NEXT</small></div>`;
      showRewardButton = false;
    } else if (humanWon) {
      rewardLine = `1 × ${rewardName} Victory Booster · ${KING_OF_THE_RING_ROUNDS[Math.max(0,(kotrRun?.stage ?? 1)-1)]} cleared`;
      rewardMarkup = `<strong>${rewardLine}</strong>`;
      showRewardButton = true;
    } else {
      rewardLine = "NO REWARD · Eliminated";
      rewardMarkup = `<strong>${rewardLine}</strong>`;
      showRewardButton = false;
    }
  } else if (isLadder) {
    if (ladderCleared) {
      rewardLine = `1 × Super Pack`;
      rewardMarkup = `<div class="results-pack-reward">${physicalBoosterPackMarkup({setId:rewardSetId,title:"SUPER PACK",series:"MONEY IN THE BANK",subtitle:"BOOSTED ODDS · 1 RARE+",extraClass:"results-booster is-super-pack"})}<strong>${rewardLine}</strong></div>`;
    } else if (humanWon) {
      rewardLine = `1 × ${rewardName} Victory Booster · Level ${ladderRun?.rung ?? 0}/${LADDER_LENGTH} cleared`;
      rewardMarkup = `<strong>${rewardLine}</strong>`;
    } else {
      rewardLine = `NO REWARD · ${ladderRun?.lives ?? 0} lives remaining`;
      rewardMarkup = `<strong>${rewardLine}</strong>`;
    }
    showRewardButton = humanWon;
  } else if (isChampionship) {
    if (championshipCleared) {
      rewardLine = `1 × Super Pack`;
      rewardMarkup = `<div class="results-pack-reward">${physicalBoosterPackMarkup({setId:rewardSetId,title:"SUPER PACK",series:"CHAMPIONSHIP ROAD",subtitle:"BOOSTED ODDS · 1 RARE+",extraClass:"results-booster is-super-pack"})}<strong>${rewardLine}</strong></div>`;
    } else if (humanWon) {
      rewardLine = `1 × ${rewardName} Victory Booster · Match ${champRun?.stage ?? 0}/${CHAMPIONSHIP_ROAD_LENGTH} cleared`;
      rewardMarkup = `<strong>${rewardLine}</strong>`;
    } else {
      rewardLine = "NO REWARD · Retry the current Championship Road match";
      rewardMarkup = `<strong>${rewardLine}</strong>`;
    }
    showRewardButton = humanWon;
  } else if (isLiveEvent) {
    if (humanWon && liveFinalClear) {
      rewardLine = `1 × Super Pack`;
      rewardMarkup = `<div class="results-pack-reward">${physicalBoosterPackMarkup({setId:rewardSetId,title:"SUPER PACK",series:liveTower?.cadenceLabel ?? "LIVE EVENT",subtitle:"BOOSTED ODDS · 1 RARE+",extraClass:"results-booster is-super-pack"})}<strong>${rewardLine}</strong></div>`;
      showRewardButton = true;
    } else if (humanWon) {
      rewardLine = `1 × ${rewardName} Victory Booster · Match ${Math.min(liveRun?.stage ?? 0, LIVE_EVENT_LENGTH)}/${LIVE_EVENT_LENGTH} cleared`;
      rewardMarkup = `<strong>${rewardLine}</strong>`;
      showRewardButton = true;
    } else {
      rewardLine = `NO REWARD · Retry Match ${Math.min((liveRun?.stage ?? 0) + 1, LIVE_EVENT_LENGTH)}`;
      rewardMarkup = `<strong>${rewardLine}</strong>`;
      showRewardButton = false;
    }
  }
  const continueLabel = activeMode === "ladder" ? "RETURN TO CHALLENGES" : activeMode === "king-of-the-ring" ? ((humanWon && kingOfTheRingState(profile).activeRun?.status === "cleared") ? "CORONATION" : "KING OF THE RING") : activeMode === "championship" ? "CHAMPIONSHIP ROAD" : isLiveEvent ? "RETURN TO TOWER" : "CONTINUE";
  return `<section class="match-results-screen ${humanWon ? "victory" : "defeat"}"><div class="results-aura"></div><span class="results-kicker">${isLiveEvent ? (liveTower?.cadenceLabel ?? "LIVE EVENT") : "MATCH COMPLETE"}</span><h1>${humanWon ? "VICTORY" : "DEFEAT"}</h1><div class="results-star results-winning-card">${(()=>{const sid=state.winner?state.players[state.winner].superstar.id:humanStar.id;const c=superstarCollectibleFor(sid);return c?collectibleCardMarkup(c,{extraClass:"results-superstar-card"}):portraitMarkup(sid,winnerName);})()}</div><h2>${winnerName}</h2>${state.winner ? `<p>def. ${nameFor(loserId)} · ${finish} · TURN ${state.turnNumber}</p>` : `<p>${finish} · TURN ${state.turnNumber}</p>`}<section class="results-rewards"><span>MATCH REWARDS</span>${rewardMarkup}<small>${message}</small></section><div class="results-actions">${appUpdateState.available ? `<button id="apply-app-update" class="start-match">UPDATE READY · v${appUpdateState.latest}</button>` : ""}${showRewardButton ? `<button id="results-reward" class="start-match">VIEW REWARDS</button>` : ""}<button id="results-continue" class="nav-button ${activeMode === "championship" ? "championship-result-cta" : ""}">${continueLabel}</button>${activeMode === "exhibition" ? '<button id="results-rematch" class="nav-button">REMATCH</button>' : ""}</div></section>`;
}

function render() {
  setChrome();
  if (screen === "setup" || !game) { renderSetup(); return; }
  const root = $("#game");
  // A successful pin/submission may already have resolved in the engine, but the
  // finish presentation must complete before Match Complete is allowed to render.
  if (game.state().phase === "MATCH_OVER" && matchSpectacle) {
    document.body.dataset.matchTheme = matchPresentationSetId ?? "summerslam-series-1";
    root.innerHTML = `<section class="match-experience ${presentationThemeClass(matchPresentationSetId)} match-finish-presentation">${renderMatchHud()}${renderPlayPile()}</section>${renderMatchSpectacle()}`;
    return;
  }
  handleCompletedMatch();
  if (game.state().phase === "MATCH_OVER") {
    root.innerHTML = renderMatchResults();
    showTierUpCelebration();
    $("#results-reward")?.addEventListener("click", showBoosters);
    $("#apply-app-update")?.addEventListener("click", () => applyAppUpdate());
    $("#results-continue")?.addEventListener("click", activeMode === "ladder" ? showLadder : activeMode === "king-of-the-ring" ? showKingOfTheRing : activeMode === "championship" ? showChampionship : activeMode === "live-event" ? (() => activeLiveEventTowerKey ? showLiveEventTower(activeLiveEventTowerKey) : showLiveEvents()) : showMainMenu);
    $("#results-rematch")?.addEventListener("click", restartMatch);
    return;
  }
  document.body.dataset.matchTheme = matchPresentationSetId ?? "summerslam-series-1";
  root.innerHTML = `<section class="match-experience ${presentationThemeClass(matchPresentationSetId)} ${(!profile?.onboarding || profile.onboarding.complete)?"":"has-onboarding"}">${onboardingMarkup()}${renderMatchHud()}${renderPlayPile()}${renderCommandBar()}${renderSubmissionChooser()}${renderHumanHand()}${renderMatchLog()}</section>${renderSuperstarOverlay()}${renderPlayPileOverlay()}${renderHandOverlay()}${renderMatchSpectacle()}`;
  $("#skip-onboarding")?.addEventListener("click",()=>{ profile.onboarding={complete:true,step:0}; saveProfile(profile); render(); });
  const openHandCard = (trigger, event) => { event?.stopPropagation?.(); const index=Number(trigger.dataset.openHandCard); handOverlayCard=game.state().players[HUMAN].hand[index] ?? null; handOverlayFlipped=false; render(); };
  root.querySelectorAll("[data-open-hand-card]").forEach(trigger => {
    trigger.addEventListener("click", event => openHandCard(trigger, event));
    trigger.addEventListener("keydown", event => { if(event.key!=="Enter"&&event.key!==" ") return; event.preventDefault(); openHandCard(trigger,event); });
  });
  root.querySelectorAll("[data-play-hand]").forEach(btn => btn.addEventListener("click", () => playCard(HUMAN, Number(btn.dataset.playHand))));
  root.querySelectorAll("[data-auto-ditch-index]").forEach(el => el.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); toggleAutoCounterCard(Number(el.dataset.autoDitchIndex)); }));
  root.querySelectorAll("[data-action-ditch-index]").forEach(el => el.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); const index=Number(el.dataset.actionDitchIndex); const before=game.state().log.length; if(game.resolveActionDiscard(HUMAN,index)){message=game.state().pendingActionDiscard ? `Choose ${game.state().pendingActionDiscard.count} more page to ditch.` : "Action resolved — continue your Control sequence."; afterHumanAction(game.state().log.slice(before));} }));
  const openPlayPileCard = (trigger, event) => { event?.stopPropagation?.(); playPileOverlayCard = collectionById.get(trigger.dataset.openPlayPile) ?? null; playPileOverlayFlipped = false; render(); };
  root.querySelectorAll("[data-open-play-pile]").forEach(trigger => {
    trigger.addEventListener("click", event => openPlayPileCard(trigger, event));
    trigger.addEventListener("keydown", event => { if (event.key !== "Enter" && event.key !== " ") return; event.preventDefault(); openPlayPileCard(trigger, event); });
  });
  root.querySelectorAll("[data-flip-play-pile-modal]").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); playPileOverlayFlipped = !playPileOverlayFlipped; render(); }));
  root.querySelectorAll("[data-play-pile-modal-backdrop]").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target !== backdrop) return; playPileOverlayCard = null; playPileOverlayFlipped = false; render(); }));
  root.querySelectorAll("[data-flip-hand-modal]").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); handOverlayFlipped=!handOverlayFlipped; render(); }));
  root.querySelectorAll("[data-hand-card-modal-backdrop]").forEach(backdrop => backdrop.addEventListener("click", event => { if(event.target!==backdrop)return; handOverlayCard=null; handOverlayFlipped=false; render(); }));
  root.querySelectorAll("[data-open-superstar]").forEach(btn => btn.addEventListener("click", () => { superstarOverlayId = btn.dataset.openSuperstar; superstarOverlayFlipped = false; render(); }));
  root.querySelectorAll("[data-flip-superstar-modal]").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); superstarOverlayFlipped = !superstarOverlayFlipped; render(); }));
  root.querySelectorAll("[data-superstar-modal-backdrop]").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target !== backdrop) return; superstarOverlayId = null; superstarOverlayFlipped = false; render(); }));
  $("#use-triggered-special")?.addEventListener("click", () => { const before=game.state().log.length; if(game.resolveTriggeredSpecial(HUMAN,true)){message="Triggered Action used.";afterHumanAction(game.state().log.slice(before));} });
  $("#decline-triggered-special")?.addEventListener("click", () => { const before=game.state().log.length; if(game.resolveTriggeredSpecial(HUMAN,false)){message="Triggered Action declined — it remains available for a later valid trigger.";afterHumanAction(game.state().log.slice(before));} });
  $("#pass-action")?.addEventListener("click", passAction); $("#attempt-pin")?.addEventListener("click", attemptPin);
  $("#auto-counter-action")?.addEventListener("click", beginAutoCounter); $("#cancel-auto-counter")?.addEventListener("click", cancelAutoCounter); $("#confirm-auto-counter")?.addEventListener("click", confirmAutoCounter);
  $("#return-ring")?.addEventListener("click", returnToRing); $("#follow-outside")?.addEventListener("click", followOutside);
  $("#reset-match")?.addEventListener("click", restartMatch); $("#change-matchup")?.addEventListener("click", activeMode === "ladder" ? showLadder : activeMode === "king-of-the-ring" ? showKingOfTheRing : activeMode === "championship" ? showChampionship : activeMode === "live-event" ? (() => activeLiveEventTowerKey ? showLiveEventTower(activeLiveEventTowerKey) : showLiveEvents()) : showSetup); $("#browse-main-menu")?.addEventListener("click", showMainMenu); $("#ladder-hub")?.addEventListener("click", showLadder); $("#kotr-hub")?.addEventListener("click", showKingOfTheRing); $("#championship-hub")?.addEventListener("click", showChampionship); $("#live-event-hub")?.addEventListener("click", showLiveEvents); $("#browse-collection")?.addEventListener("click", showCollection); $("#browse-boosters")?.addEventListener("click", showBoosters); $("#browse-challenges")?.addEventListener("click", showChallenges); $("#browse-decks")?.addEventListener("click", () => showDeckBuilder(selection.p1)); $("#release-submission")?.addEventListener("click", releaseSubmission);
  root.querySelectorAll("[data-ditch]").forEach(btn => btn.addEventListener("click", () => maintainSubmission(Number(btn.dataset.ditch))));
}

function applyTwoButtonRows(root = document) {
  root.querySelectorAll?.("div,section,footer,nav").forEach(parent => {
    const children = [...parent.children];
    const isAction = element => element?.matches?.("button, a.nav-button, a.start-match");
    if (children.length === 2 && children.every(isAction)) parent.classList.add("two-button-row");
    else if (parent.classList.contains("two-button-row") && !parent.matches(".pack-summary-actions,.pack-summary-top-actions")) parent.classList.remove("two-button-row");
  });
}

const pairedActionRoot = document.querySelector("#game") ?? document.body;
applyTwoButtonRows(pairedActionRoot);
if (globalThis.MutationObserver && pairedActionRoot) {
  const pairedActionObserver = new MutationObserver(() => applyTwoButtonRows(pairedActionRoot));
  pairedActionObserver.observe(pairedActionRoot, { childList: true, subtree: true });
}

document.querySelectorAll("[data-mobile-nav]").forEach(button => button.addEventListener("click", () => {
  const target = button.dataset.mobileNav;
  if (target === "menu") showMainMenu();
  else if (target === "play-menu") showPlayMenu();
  else if (target === "collection") showOwnedCollection();
  else if (target === "catalogue") showCardCatalogue();
  else if (target === "boosters") showBoosters();
  else if (target === "seasons") showSeasons();
  else if (target === "challenges") showChallenges();
  else if (target === "deck-builder") showDeckBuilder();
  else if (target === "store") showStore();
  else if (target === "profile") showProfile();
}));

document.querySelector("#chrome-home")?.addEventListener("click", showMainMenu);
document.querySelector("#chrome-season")?.addEventListener("click", showSeasons);
document.querySelector("#chrome-packs")?.addEventListener("click", showBoosters);

if (screen === "splash") renderSplash(); else if (screen === "starter") renderStarter(); else if (screen === "menu") renderMainMenu(); else if (screen === "play-menu") renderPlayMenu(); else if (screen === "profile") renderProfile(); else if (screen === "rules") renderRules(); else if (screen === "boosters") renderBoosters(); else if (screen === "store") renderStore(); else if (screen === "catalogue") renderCardCatalogue(); else if (screen === "king-of-the-ring") renderKingOfTheRing(); else if (screen === "ladder") renderLadder(); else if (screen === "championship") renderChampionship(); else if (screen === "live-events") renderLiveEvents(); else if (screen === "challenges") renderChallenges(); else if (screen === "seasons") renderSeasons(); else if (screen === "deck-builder") renderDeckBuilder(); else renderSetup();

globalThis.window?.addEventListener?.("pageshow", () => { checkForAppUpdate({ autoApply: true }); });
globalThis.document?.addEventListener?.("visibilitychange", () => {
  if (document.visibilityState === "visible") checkForAppUpdate({ autoApply: true });
});
if (globalThis.location?.href && typeof globalThis.fetch === "function") {
  setTimeout(() => { checkForAppUpdate({ autoApply: true }); }, 1200);
}

setInterval(refreshSeasonClocks, 1000);
