import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.15 Tier Up uses a body-level full-screen celebration and queues every crossed tier', () => {
  assert.match(app, /pendingTierUps = \[\]/);
  assert.match(app, /function queueTierUps\(/);
  assert.match(app, /document\.body\.appendChild\(layer\)/);
  assert.match(app, /showTierUpCelebration\(\)/);
  assert.match(app, /queueTierUps\(seasonXpReward\.tierBefore, seasonXpReward\.tierAfter/);
  assert.match(app, /queueTierUps\(tierBefore,tierAfter,xpBefore,xpAfter\)/);
  assert.match(css, /#tier-up-layer\{position:fixed;inset:0;z-index:20000/);
  assert.match(css, /height:100dvh!important/);
  assert.match(app, /TIER UP/);
  assert.match(app, /tier-up-reward/);
});

test('v0.12.15 match HP has one symmetric fixed-size lane per side', () => {
  assert.match(css, /premium-headshot-hud \.hud-primary-line\{[\s\S]*grid-template-columns:minmax\(0,1fr\) 66px!important/);
  assert.match(css, /premium-headshot-hud\.cpu \.hud-primary-line\{grid-template-columns:66px minmax\(0,1fr\)!important/);
  assert.match(css, /premium-headshot-hud \.hud-hp-number\{[\s\S]*height:78px!important/);
  assert.match(css, /premium-headshot-hud\.cpu \.hud-hp-number\{grid-column:1!important/);
});

test('v0.12.15 booster flow is sealed pack -> rip -> reveal -> summary', () => {
  assert.match(app, /packStage = "sealed"/);
  assert.match(app, /function ripOpenPack\(\)/);
  assert.match(app, /id="rip-pack"/);
  assert.match(app, /TAP TO RIP/);
  assert.match(app, /booster-reveal-atmosphere/);
  assert.match(app, /booster-reveal-meta/);
  assert.match(app, /id="pack-summary-next"[\s\S]*>NEXT<\/button>/);
  assert.match(css, /sealedPackFloat/);
  assert.match(css, /packRipSlam/);
  assert.match(css, /premiumCardReveal/);
});

test('v0.12.15 removes known 0.12.14 presentation misses', () => {
  assert.doesNotMatch(app, /function renderLaunchReleases/);
  assert.doesNotMatch(app, /class="deck-lab-star-status"/);
  assert.match(app, /function modePortraits[\s\S]*superstarRenderMarkup/);
  assert.match(css, /\.main-menu-tile \.attention-badge\{top:9px!important;right:9px!important;left:auto!important/);
  assert.match(css, /body\[data-screen="match"\] \.premium-play-pile\{overflow:visible!important/);
  assert.match(app, /ccg-rules-set-logo/);
});

import { superstars } from '../js/data/superstars.js?v=0.13.72';
import { decks } from '../js/data/decks.js?v=0.13.72';

function methodSupply(star) {
  const supply = { agility: 0, strength: 0, strike: 0, technical: 0 };
  for (const [method, amount] of Object.entries(star.starterMomentum ?? {})) supply[method] += Number(amount) || 0;
  for (const [method, amount] of Object.entries(star.entrance?.preMatchMomentum ?? {})) supply[method] += Number(amount) || 0;
  const trigger = star.ability?.trigger ?? {};
  if (trigger.strengthOnFirstStrike) supply.strength += Number(trigger.strengthOnFirstStrike) || 0;
  if (trigger.agilityOnFirstTechnical) supply.agility += Number(trigger.agilityOnFirstTechnical) || 0;
  if (star.entrance?.firstStrikeMomentum) supply.strike += Number(star.entrance.firstStrikeMomentum) || 0;
  return supply;
}

test('v0.12.15 recommended decks contain no method-impossible pages', () => {
  const issues = [];
  for (const star of Object.values(superstars)) {
    const supply = methodSupply(star);
    for (const card of decks[star.id] ?? []) {
      if (card.kind !== 'move') continue;
      for (const [method, amount] of Object.entries(card.requirements ?? {})) {
        const limit = star.methodLimits?.[method];
        if (limit !== null && limit !== undefined && amount > limit) issues.push(`${star.id}: ${card.id} requires ${amount} ${method}, limit ${limit}`);
        if (amount > (supply[method] ?? 0)) issues.push(`${star.id}: ${card.id} requires ${amount} ${method}, reachable supply ${(supply[method] ?? 0)}`);
      }
    }
  }
  assert.deepEqual(issues, []);
});
