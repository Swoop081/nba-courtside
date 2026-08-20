import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.72';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.13.72';
import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.72';
import { moveEligibility, canPlayAction } from '../js/engine/rules.js?v=0.13.72';
import { evaluateDeckHealth } from '../js/data/deck-health.js?v=0.13.72';

const cards = new Map(allGameplayCards.map(c => [c.id, c]));
const stars = new Map(Object.values(superstars).map(s => [s.id, s]));
const card = id => cards.get(id);
const star = id => stars.get(id);

const NEW_SIGNATURE_IDS = [
  'mankind-have-a-nice-day','hulk-hogan-whatcha-gonna-do','andre-the-giant-headbutt','randy-savage-cream-of-the-crop',
  'kane-flying-clothesline','the-undertaker-running-big-boot','ultimate-warrior-clothesline','stone-cold-give-me-a-hell-yeah',
  'bayley-ding-dong-hello','paige-superkick','stephanie-vaquer-dragon-screw','charlotte-flair-spear',
  'rhea-ripley-mamis-always-on-top','becky-lynch-bexploder','cody-rhodes-what-do-you-want-to-talk-about',
  'oba-femi-running-elbow','brock-lesnar-eat-sleep-conquer-repeat'
];

const EXPECTED_CODES = {
  'mankind-have-a-nice-day':'HOF1-082','hulk-hogan-whatcha-gonna-do':'HOF1-083','andre-the-giant-headbutt':'HOF1-084',
  'randy-savage-cream-of-the-crop':'HOF1-085','kane-flying-clothesline':'HOF1-086','the-undertaker-running-big-boot':'HOF1-087',
  'ultimate-warrior-clothesline':'HOF1-088','stone-cold-give-me-a-hell-yeah':'HOF1-089','bayley-ding-dong-hello':'EVO1-067',
  'paige-superkick':'EVO1-068','stephanie-vaquer-dragon-screw':'EVO1-069','charlotte-flair-spear':'EVO1-070',
  'rhea-ripley-mamis-always-on-top':'EVO1-071','becky-lynch-bexploder':'EVO1-072',
  'cody-rhodes-what-do-you-want-to-talk-about':'SS1-142','oba-femi-running-elbow':'SS1-143','brock-lesnar-eat-sleep-conquer-repeat':'SS1-144'
};

test('v0.13.0 adds the approved 17 released-roster identity cards at stable collector slots', () => {
  assert.equal(NEW_SIGNATURE_IDS.length, 17);
  for (const id of NEW_SIGNATURE_IDS) {
    const c = card(id);
    assert.ok(c, id);
    assert.ok(c.superstarId, `${id} must be Superstar-exclusive`);
    assert.ok(c.rarity >= 3, `${id} must respect the exclusive-card Rare+ policy`);
    assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode, EXPECTED_CODES[id], id);
  }
});

test('v0.13.0 Last Symphony is the corrected Gunther Rare Trademark and its Chop chain is functional', () => {
  const last = card('last-symphony');
  assert.equal(last.superstarId, 'gunther');
  assert.equal(last.rarity, 3);
  assert.equal(last.trademark, true);
  assert.equal(last.cost, 7);
  assert.equal(last.damage, 12);
  assert.deepEqual(last.discountIfNamedConnectedThisControl, { name: "Gunther's Chop", amount: 1 });
  const g = new MatchEngine({ p1: star('gunther'), p2: star('cm-punk'), decks, rng: () => .42 });
  const p = g.state().players.p1;
  p.momentum.strength = 6; p.momentum.strike = 0; p.momentum.technical = 0; p.momentum.agility = 0; p.momentum.attitude = 0; p.adrenaline = 0;
  assert.equal(moveEligibility(g.state(), 'p1', last).legal, false, 'C7 is not legal at six total resources before the Chop chain');
  p.events.connectedCardNamesThisControl["Gunther's Chop"] = true;
  const eligible = moveEligibility(g.state(), 'p1', last);
  assert.equal(eligible.legal, true);
  assert.equal(eligible.effectiveCost, 6);
});

test('v0.13.0 approved first-25 balance values are locked', () => {
  const rock = star('the-rock'), andre = star('andre-the-giant'), ko = star('kevin-owens'), oba = star('oba-femi');
  assert.equal(rock.entrance.preMatchAdrenaline, 1);
  assert.equal(rock.ability.trigger.maxUses, 1);
  assert.equal(andre.entrance.preMatchAdrenaline, 1);
  assert.equal(andre.ability.trigger.maxUses, 2);
  assert.equal(andre.ability.trigger.damage, 3);
  assert.equal(ko.ability.trigger.draw, 1);
  assert.equal(oba.hp, 68);
  assert.equal(oba.ability.trigger.maxUses, 1);
  assert.equal(oba.ability.trigger.draw, 1);
  assert.equal(oba.ability.trigger.adrenaline ?? 0, 0);

  const taker = star('the-undertaker');
  assert.equal(taker.ability.trigger.draw, 1);
  assert.equal(card('special-the-undertaker').special.amount, 1);

  assert.deepEqual(star('bayley').entrance.preMatchMomentum, { technical: 1, strength: 1 });
  assert.equal(star('rhea-ripley').ability.trigger.draw, 1);
  assert.equal(star('gunther').ability.trigger.draw, 1);
  assert.equal(star('liv-morgan').hp, 64);
  assert.equal(card('special-liv-morgan').special.adrenaline, 1);
  assert.equal(star('paige').hp, 64);
  assert.equal(decks.paige.filter(c => c.id === 'paige-superkick').length, 2);
  assert.equal(card('paige-paige-turner').trademark, true);
  assert.ok(star('stephanie-vaquer').leadOffIds.includes('stephanie-vaquer-dragon-screw'));
  assert.ok(star('ultimate-warrior').leadOffIds.includes('ultimate-warrior-clothesline'));
  assert.equal(star('becky-lynch').ability.trigger.adrenaline, 1);

  const charlotte = star('charlotte-flair');
  assert.equal(charlotte.ability.trigger.maxUses, 2);
  assert.equal(charlotte.ability.trigger.discount, 2);
  assert.equal(card('charlotte-flair-figure-eight-leglock').cost, 9);
  assert.deepEqual(card('charlotte-flair-spear').effects, [{ type:'search', name:'Natural Selection', discount:2 }]);
  assert.deepEqual(card('charlotte-flair-natural-selection').effects, [{ type:'search', name:'Figure-Eight Leglock', discount:2 }]);
});

test('v0.13.0 Charlotte and Becky signature routes apply their approved search discounts', () => {
  const charlotteGame = new MatchEngine({ p1: star('charlotte-flair'), p2: star('bayley'), decks, rng: () => .42 });
  const cp = charlotteGame.state().players.p1;
  cp.hand = [];
  cp.deck = [card('charlotte-flair-natural-selection'), card('charlotte-flair-figure-eight-leglock')];
  charlotteGame._effects('p1', card('charlotte-flair-spear'), {});
  assert.equal(cp.hand[0]?.id, 'charlotte-flair-natural-selection');
  assert.equal(cp.namedDiscount['Natural Selection'], 2);
  charlotteGame._effects('p1', cp.hand[0], {});
  assert.ok(cp.hand.some(c => c.id === 'charlotte-flair-figure-eight-leglock'));
  assert.equal(cp.namedDiscount['Figure-Eight Leglock'], 2);

  const beckyGame = new MatchEngine({ p1: star('becky-lynch'), p2: star('bayley'), decks, rng: () => .42 });
  const bp = beckyGame.state().players.p1;
  bp.hand = [];
  bp.deck = [card('becky-lynch-dis-arm-her')];
  beckyGame._effects('p1', card('becky-lynch-bexploder'), {});
  assert.equal(bp.hand[0]?.id, 'becky-lynch-dis-arm-her');
  assert.equal(bp.namedDiscount['Dis-arm-her'], 2);
});

test('v0.13.0 new Action conditions remember the whole current Control sequence', () => {
  const brockGame = new MatchEngine({ p1: star('brock-lesnar'), p2: star('cm-punk'), decks, rng: () => .42 });
  const bp = brockGame.state().players.p1;
  const brockAction = card('brock-lesnar-eat-sleep-conquer-repeat');
  bp.events.connectedCardNamesThisControl['Brock’s German'] = true;
  bp.lastConnectedCardName = 'Punch';
  assert.equal(canPlayAction(brockGame.state(), 'p1', brockAction), true);

  const austinGame = new MatchEngine({ p1: star('stone-cold-steve-austin'), p2: star('cm-punk'), decks, rng: () => .42 });
  const ap = austinGame.state().players.p1;
  const austinAction = card('stone-cold-give-me-a-hell-yeah');
  ap.events.connectedMethodsThisControl.strike = true;
  ap.lastConnectedMethod = 'technical';
  assert.equal(canPlayAction(austinGame.state(), 'p1', austinAction), true);
});

test('v0.13.0 existing printed move effects now match runtime data', () => {
  assert.ok(card('cm-punk-corner-running-knee').effects.some(e => e.type === 'search' && e.name === 'Bulldog'));
  assert.ok(card('stone-cold-steve-austin-mudhole-stomps').effects.some(e => e.type === 'loseOpponentAdrenaline' && e.amount === 1));
  assert.ok(card('roman-reigns-corner-clotheslines').effects.some(e => e.type === 'gainAdrenaline' && e.amount === 1));
  for (const id of ['snap-powerslam','sling-blade','swinging-neckbreaker']) {
    assert.ok(card(id).effects.some(e => e.type === 'drawSelf' && e.amount === 1), id);
  }
});

test('v0.13.0 every authored roster deck remains a legal 60-page deck after signature substitutions', () => {
  for (const s of Object.values(superstars)) {
    const result = evaluateDeckHealth(decks[s.id]);
    assert.equal(result.healthy, true, `${s.id}: ${result.violations.join('; ')}`);
    assert.equal(decks[s.id].length, 60, s.id);
  }
});

test('v0.13.20 player-facing taxonomy has one Action card type for normal and triggered Actions', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  const builder = fs.readFileSync(new URL('../js/data/deck-builder.js', import.meta.url), 'utf8');
  const content = fs.readFileSync(new URL('../js/data/content.js', import.meta.url), 'utf8');
  const rules = fs.readFileSync(new URL('../js/data/game-rules.js', import.meta.url), 'utf8');
  assert.doesNotMatch(content, /"kind": "special"/);
  assert.match(app, /PLAY ACTION/);
  assert.match(app, /Action trigger not available/);
  assert.doesNotMatch(app, /Actions\/Specials|PLAY SPECIAL|kind === "special"/);
  assert.match(builder, /\{ id: "utility", label: "Actions" \}/);
  assert.doesNotMatch(rules, /\["Specials"/);
  assert.match(rules, /reactive or one-use Actions/);
});
