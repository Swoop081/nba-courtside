export const COUNTER_STATES = Object.freeze([
  'arm-extended',
  'leg-extended',
  'running-aerial',
  'diving-aerial',
  'body-elevated',
  'torso-trapped',
  'front-control',
  'rear-control',
]);

export const COUNTER_STATE_LABELS = Object.freeze({
  'arm-extended': 'Arm Extended',
  'leg-extended': 'Leg Extended',
  'running-aerial': 'Running Aerial',
  'diving-aerial': 'Diving Aerial',
  'body-elevated': 'Body Elevated',
  'torso-trapped': 'Torso Trapped',
  'front-control': 'Front Control',
  'rear-control': 'Rear Control',
});

export const SUBMISSION_TARGETS = Object.freeze(['arms','legs','back','neck-head']);
export const SUBMISSION_TARGET_LABELS = Object.freeze({
  arms: 'Arm',
  legs: 'Leg',
  back: 'Back',
  'neck-head': 'Neck / Head',
});

const textOf = card => `${card?.id ?? ''} ${card?.name ?? ''}`.toLowerCase();
const has = (text, words) => words.some(word => text.includes(word));

const explicitStateById = Object.freeze({
  // Existing tactical/exact cases and moves whose physical setup is clearer than their printed family.
  'enzuigiri': 'leg-extended',
  'short-arm-clothesline': 'arm-extended',
  'big-boot': 'leg-extended',
  'hogans-big-boot': 'leg-extended',
  'running-big-boot': 'leg-extended',
  'roman-reigns-spear': 'torso-trapped',
  'bron-breakker-breakkers-spear': 'torso-trapped',
  'goldberg-spear': 'torso-trapped',
  'spear': 'torso-trapped',
  'shoulder-tackle': 'torso-trapped',
  'shoulder-block': 'torso-trapped',
  'stone-cold-steve-austin-lou-thesz-press': 'torso-trapped',
  'drop-toe-hold': 'front-control',
  'dragon-screw': 'front-control',
  'arm-drag': 'front-control',
  'hip-toss': 'front-control',
  'back-elbow': 'arm-extended',
  'hurricanrana': 'body-elevated',
  'chain-wrestling': 'front-control',
  'sidestep': 'running-aerial',
  'duck': 'arm-extended',
  'no-sell': 'torso-trapped',
  'leapfrog': 'running-aerial',
  'knees-up': 'diving-aerial',
  'dodge': 'arm-extended',
  'block': 'arm-extended',
  'up-and-over': 'running-aerial',
  'standing-switch': 'rear-control',
  'rollover-counter': 'front-control',
  'backflip-counter': 'diving-aerial',
  'catch-the-foot': 'leg-extended',
  'arm-drag-counter': 'front-control',
  'jawbreaker': 'front-control',
  // Manual physical-state audit corrections for moves whose legacy moveType/name can mislead heuristics.
  '619': 'leg-extended',
  'ultimate-warrior-diving-shoulder-block': 'diving-aerial',
  'blockbuster': 'diving-aerial',
  'the-undertaker-old-school': 'diving-aerial',
  'cody-rhodes-cody-cutter': 'running-aerial',
  'sol-ruca-sol-snatcher': 'running-aerial',
  'middle-rope-stunner': 'diving-aerial',
  'becky-lynch-diamond-dust': 'diving-aerial',
  'liv-morgan-jersey-codebreaker': 'leg-extended',
  'iyo-sky-bullet-train-attack': 'leg-extended',
  'nia-jax-annihilator': 'diving-aerial',
  'standing-moonsault': 'diving-aerial',
  'standing-shooting-star-press': 'diving-aerial',
  'forearm-smash': 'arm-extended',
  'running-forearm': 'arm-extended',
  'dropkick-to-the-back': 'leg-extended',
  'elbow-to-back-of-head': 'arm-extended',
  'reverse-elbow': 'arm-extended',
  'steel-chair-to-back': 'arm-extended',
  'cannonball': 'running-aerial',
  'senton': 'diving-aerial',
});

const rearWords = [
  'german suplex','back suplex','reverse suplex','inverted ddt','backstabber','waistlock',
  'reverse ddt','sleeper','octopus','abdominal stretch','mexican surfboard','steiner recliner',
];
const frontControlWords = [
  'ddt','cutter','neckbreaker','bulldog','headlock','wristlock','arm drag','hip toss','drop toe hold','dragon screw',
  'russian leg sweep','stunner','rko','cross rhodes','bft','pedigree','code red','facebuster','turner','rose plant',
  '1916','sister abigail','sol snatcher','triple d','natural selection','green with envy','i’m prettier','im-prettier',
  'paulverizer','penta driver','sacrifice','middle-rope stunner','stone cold stunner','cody cutter','diamond dust',
  'mysterio express','west coast pop','619','devil’s kiss','svb','vaquer inferno','oblivion',
];
const elevatedWords = [
  'powerbomb','press','piledriver','jackhammer','f-5','f5','razor','burning hammer','fireman','torture rack','chokeslam',
  'alabama slam','falcon arrow','fisherman buster','military press','gorilla press','tejana bomb','package piledriver',
  'electric chair','avalanche samoan','avalanche x-factor','superplex','vertical suplex','butterfly suplex','double underhook suplex',
  'fall from grace','one-handed backbreaker','front backbreaker','backbreaker','gourdbuster','blue thunder bomb','buckle bomb',
];
const torsoWords = [
  'belly-to-belly','belly to belly','powerslam','spinebuster','uranage','samoan drop','body slam','sidewalk slam','fallaway slam',
  'running powerslam','snap powerslam','exploder','flapjack','atomic drop','body press','body slam','spear','shoulder tackle',
  'shoulder block','lou thesz','bearhug','choke lift','corner avalanche','cannonball','running hip attack','senton',
];
const legStrikeWords = [
  'kick','knee','stomp','boot','leg drop','dropkick','double stomp','meteora','scissors','curb stomp','drive-by','drive by',
  '619','claymore','shining wizard','punt','foot','coup de grâce','coup de grace','annihilator','warrior splash',
];
const armStrikeWords = [
  'punch','elbow','forearm','chop','clothesline','lariat','uppercut','slap','throat thrust','headbutt','axe handle',
  'barrage','ground-and-pound','ground and pound','spike','low blow','belt whip','steel chair',
];
const runningAerialWords = [
  'springboard','suicide dive','tope con hilo','asai','flying clothesline','spanish fly','standing moonsault',
  'standing shooting star','handstand','handspring','tilt-a-whirl headscissors','leaping rope','running knees',
];
const divingAerialWords = [
  'diving','splash','moonsault','frog','swanton','phoenix','missile dropkick','second rope','2nd rope','top rope','corkscrew splash',
  'over the moonsault','twisted bliss','west coast pop','uso splash','flying elbow','450','sitdown splash',
];

export function normalizeSubmissionTarget(card = {}) {
  const raw = String(card.submissionTarget ?? card.bodyPart ?? card.submission?.bodyPart ?? '').toLowerCase();
  if (raw.includes('arm')) return 'arms';
  if (raw.includes('leg') || raw.includes('ankle')) return 'legs';
  if (raw.includes('back') || raw.includes('body')) return 'back';
  return 'neck-head';
}

export function inferCounterState(card = {}) {
  if (explicitStateById[card.id]) return explicitStateById[card.id];
  const text = textOf(card);

  if (card.moveType === 'submission') {
    const target = normalizeSubmissionTarget(card);
    if (target === 'legs') return 'leg-extended';
    if (target === 'arms') return 'front-control';
    if (target === 'back') return has(text, rearWords) ? 'rear-control' : 'torso-trapped';
    if (has(text, ['sleeper','mandible','rear naked','tongan death grip','gojira'])) return 'rear-control';
    if (has(text, ['bearhug'])) return 'torso-trapped';
    return 'front-control';
  }

  if (card.moveType === 'aerial' || has(text, ['aerial'])) {
    if (has(text, runningAerialWords)) return 'running-aerial';
    return 'diving-aerial';
  }

  if (has(text, runningAerialWords)) return 'running-aerial';
  if (has(text, divingAerialWords) && !has(text, ['leg drop','elbow drop','knee drop'])) return 'diving-aerial';

  if (has(text, rearWords)) return 'rear-control';
  if (has(text, frontControlWords)) return 'front-control';
  if (has(text, elevatedWords)) return 'body-elevated';
  if (has(text, torsoWords)) return 'torso-trapped';

  if (card.moveType === 'strike' || card.method === 'strike') {
    if (has(text, legStrikeWords)) return 'leg-extended';
    if (has(text, armStrikeWords)) return 'arm-extended';
    return 'arm-extended';
  }

  if (card.moveType === 'grapple' || ['strength','technical'].includes(card.method)) {
    // Physical fallback for uncaught grapples: technical setups are usually control positions;
    // power setups usually secure/elevate the torso.
    return card.method === 'technical' ? 'front-control' : 'body-elevated';
  }

  if (card.method === 'agility') return 'running-aerial';
  return 'front-control';
}

const counterStateLinks = Object.freeze({
  // Eight canonical anchor relationships. These remain one-to-one.
  punch: ['arm-extended'],
  'drop-toe-hold': ['leg-extended'],
  dropkick: ['running-aerial'],
  'knees-up': ['diving-aerial'],
  hurricanrana: ['body-elevated'],
  headbutt: ['torso-trapped'],
  'arm-drag': ['front-control'],
  'back-elbow': ['rear-control'],

  // Additional state-specific reversals. These expand choice; they do not replace the anchors.
  duck: ['arm-extended','leg-extended'],
  elbow: ['arm-extended'],
  dodge: ['arm-extended','leg-extended','running-aerial','diving-aerial'],
  block: ['arm-extended','leg-extended'],

  'dragon-screw': ['leg-extended'],
  'catch-the-foot': ['leg-extended'],

  'back-body-drop': ['running-aerial'],
  sidestep: ['running-aerial','diving-aerial'],
  leapfrog: ['running-aerial'],
  'up-and-over': ['running-aerial'],

  backstabber: ['diving-aerial'],
  'backflip-counter': ['diving-aerial','body-elevated'],

  'no-sell': ['body-elevated','torso-trapped'],
  'tilt-a-whirl-headscissors': ['body-elevated'],
  'rollover-counter': ['body-elevated','front-control'],

  'knee-to-the-gut': ['torso-trapped'],
  'standing-switch': ['torso-trapped','rear-control'],

  'arm-drag-counter': ['front-control'],
  'hip-toss': ['front-control'],
  'chain-wrestling': ['front-control','rear-control'],
  jawbreaker: ['front-control','rear-control'],

  'reverse-elbow': ['rear-control'],
});

const counterExchangeKeys = Object.freeze({
  // Counter-attacks are normally terminal. Punches and Elbows are the deliberate
  // wrestling-style strike exchange family and may answer each other.
  punch: 'punch-elbow',
  elbow: 'punch-elbow',
});

const submissionCounterLinks = Object.freeze({
  // Arm-targeting holds: turn the captured arm/control back on the attacker.
  'arm-drag': ['arms'],
  'arm-drag-counter': ['arms'],
  'rollover-counter': ['arms'],
  'chain-wrestling': ['arms','legs','back','neck-head'],

  // Leg-targeting holds: attack/escape the captured leg or kick free.
  'drop-toe-hold': ['legs'],
  'dragon-screw': ['legs'],
  'catch-the-foot': ['legs'],
  enzuigiri: ['legs'],

  // Back-targeting holds: change position, roll through or throw out of the hold.
  'standing-switch': ['back'],
  'rollover-counter': ['arms','legs','back'],
  'hip-toss': ['back'],

  // Neck / head holds: create separation with a direct head/upper-body escape.
  jawbreaker: ['neck-head'],
  'back-elbow': ['neck-head'],
  'reverse-elbow': ['neck-head'],
  headbutt: ['neck-head'],
});

const NO_METHOD_REQUIREMENT_COUNTERS = new Set([
  // Of the original eight anchors, only Dropkick and Hurricanrana keep Agility 1.
  // The other six anchors remain normal offensive Methods but have no printed Method Momentum gate.
  'punch','drop-toe-hold','knees-up','headbutt','arm-drag','back-elbow',
  // Universal/basic reversals should remain usable even for 0-limit Methods.
  'duck','dodge','block','up-and-over','standing-switch','rollover-counter','backflip-counter',
  'catch-the-foot','arm-drag-counter','jawbreaker','sidestep','elbow','reverse-elbow','knee-to-the-gut','hip-toss',
]);

export function enrichCounterState(card) {
  if (!card || card.kind !== 'move') return card;
  if (NO_METHOD_REQUIREMENT_COUNTERS.has(card.id)) card.requirements = {};
  card.counterState = card.counterState ?? inferCounterState(card);
  if (card.moveType === 'submission') card.submissionTarget = normalizeSubmissionTarget(card);
  if (counterStateLinks[card.id]) card.counterStates = [...new Set([...(card.counterStates ?? []), ...counterStateLinks[card.id]])];
  if (submissionCounterLinks[card.id]) card.counterSubmissionTargets = [...new Set([...(card.counterSubmissionTargets ?? []), ...submissionCounterLinks[card.id]])];
  if (counterExchangeKeys[card.id]) card.counterExchangeKey = counterExchangeKeys[card.id];
  return card;
}
