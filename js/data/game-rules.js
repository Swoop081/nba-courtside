export const PIN_CHANCE_TABLE = Object.freeze([
  ["0–4 HP", "75%"], ["5 HP", "70%"], ["6 HP", "60%"], ["7 HP", "55%"], ["8 HP", "50%"],
  ["9 HP", "48%"], ["10 HP", "45%"], ["11 HP", "40%"], ["12 HP", "35%"], ["13 HP", "30%"],
  ["14 HP", "25%"], ["15 HP", "20%"], ["16+ HP", "5%"]
]);

export const LIVE_EVENT_WEEK = Object.freeze([
  ["Monday", "RAW"], ["Tuesday", "Original WWE Legacy event"], ["Wednesday", "NXT"],
  ["Thursday", "Original WWE Legacy event"], ["Friday", "Original WWE Legacy event"],
  ["Saturday", "SmackDown"], ["Sunday", "Original WWE Legacy event"]
]);

export const GAME_RULE_SECTIONS = Object.freeze([
  {
    id: "match-basics", group: "MATCH", title: "Winning & Match Basics",
    summary: "Control the match, damage your opponent and finish by pinfall or submission.",
    items: [
      ["The objective", "Win the match by successful pinfall or by forcing a submission. There is no referee-decision finish for Playbook exhaustion."],
      ["Superstar HP", "Every Superstar has printed maximum HP. Damage reduces current HP but does not change printed maximum HP."],
      ["Health zones", "Green is 65% or more of maximum HP. Amber is 25%–64%. Red is below 25%. These zones matter for pin legality and presentation."],
      ["Card text", "Specific card, Superstar, Entrance and Action text can create exceptions. When an authored card explicitly overrides a general rule, that card text wins for that interaction."]
    ]
  },
  {
    id: "turns-control", group: "MATCH", title: "Turns, Control & Drawing",
    summary: "Only the Superstar in Control takes normal actions.",
    items: [
      ["Lead Off 5", "Each match begins with the authored or saved Lead Off 5. There is no normal Turn 1 draw."],
      ["Control", "The Superstar in Control may play legal cards, make Moves, pass, and use available post-Move options."],
      ["Keeping Control", "A connected non-Submission Move normally keeps Control. After it connects, the defender draws 1 page; the attacker does not receive an automatic replacement draw."],
      ["Recycling the Playbook", "Played Moves and normal reusable Actions go to your recycle pile. When your Playbook empties and you need to draw or search, shuffle that recycle pile to create a new Playbook. Pages explicitly ditched, one-use cards and committed Momentum do not recycle."],
      ["Losing Control", "Control normally changes on a pass, a successful Counter, or a failed pin / kick out. Some Superstar or Action effects can explicitly retain or regain Control."],
      ["Unlimited match clock", "Matches do not end because a turn limit or an empty Playbook is reached. When a draw or search needs a page and your Playbook is empty, shuffle your recyclable used pages to form a new Playbook. If you have no recyclable pages, that draw or search simply finds nothing."]
    ]
  },
  {
    id: "resources", group: "MATCH", title: "Momentum & Adrenaline",
    summary: "Build permanent Method Momentum and use Adrenaline as flexible numeric Cost power.",
    items: [
      ["Four Methods", "Strength is orange, Strike is red, Technical is green and Agility is blue."],
      ["Playing Momentum", "You may normally play 1 Momentum page per turn while in Control. Method Momentum is permanent for the match and is not spent when you play normal cards."],
      ["Numeric Cost", "A card's numeric Cost checks your total Method Momentum plus current Adrenaline. These resources are thresholds, not a payment that is normally consumed."],
      ["Method requirements", "Printed Method requirements check the named Method totals separately. Finishers have no Method Momentum requirement unless an explicit card effect says otherwise."],
      ["Adrenaline shift", "Each connected Move or Submission gives the attacker +1 Adrenaline and removes 1 Adrenaline from the defender, to a minimum of 0."],
      ["Entrance Adrenaline", "Entrance Adrenaline that is tied to gaining Control is awarded only on that Superstar's first gain of Control."],
      ["Superstar Method Limits", "Each Superstar has Method Limits. Deck Lab prevents cards whose printed Method requirements exceed that Superstar's legal limits."]
    ]
  },
  {
    id: "card-types", group: "CARDS", title: "Card Types & Timing",
    summary: "Every card type has a different job and timing window.",
    items: [
      ["Moves", "Moves are the main offensive and defensive wrestling cards. They can be Strikes, Grapples, Aerials, Counters, Submissions, Trademarks or Finishers and may carry grounding, stun, search or other effects."],
      ["Momentum", "Momentum pages add +1 of their printed Method and are discarded after being played; the Momentum they granted remains for the match."],
      ["Actions", "Actions are utility and character cards. You may include multiple different Actions in a deck. Normal Actions use your Action window and the normal limit is 1 per turn; reactive or one-use Actions instead follow the specific timing printed on the card."],
      ["Triggered Actions", "When a one-use or reactive card becomes eligible because its trigger occurs, the human player is offered a clear choice to use it or decline. Declining does not consume the card or its once-per-match use; the card remains available for a later valid trigger. Mandatory effects from a card already played still resolve automatically."],
      ["Supports", "Supports use their authored effect and the normal limit is 1 Support per turn."],
      ["Managers", "A Manager occupies the active Manager slot and follows the timing and effect printed on that card."],
      ["Entrances", "Entrances sit outside the 60-page deck. Your selected Entrance resolves automatically at its authored pre-match or first-Control timing; Entrances are not played from the hand."],
      ["Superstar cards", "The Superstar identity card defines HP, Method Limits, ability and associated deck identity. It is not one of the 60 deck pages."]
    ]
  },
  {
    id: "move-legality", group: "CARDS", title: "Playing Moves",
    summary: "A Move must satisfy Cost, Method, position and Superstar restrictions before it can be declared.",
    items: [
      ["Cost check", "Your total Method Momentum plus Adrenaline must meet the Move's effective numeric Cost after any legal discounts."],
      ["Method check", "Non-Finishers must also meet every printed Method requirement. Finishers ignore generic Method requirements."],
      ["Position", "Grounded-only Moves need the opponent on the mat. Standing-only Submissions need the opponent standing. Other card text can impose additional position requirements."],
      ["Exclusivity", "A Superstar-exclusive card can only be played by its named Superstar. Cards with an allowed-Superstar family restriction are legal only for that listed family."],
      ["Printed Damage", "The Normal card Damage number is the authored baseline. A Foil Move with positive Damage displays and deals +1 Damage; authored abilities and card effects may then add or reduce Damage during resolution."]
    ]
  },
  {
    id: "counters", group: "MATCH", title: "Counters & Auto Counter",
    summary: "Counters answer the physical state of an incoming Move.",
    items: [
      ["Eight Counter States", "Arm Extended, Leg Extended, Running Aerial, Diving Aerial, Body Elevated, Torso Trapped, Front Control and Rear Control."],
      ["Matching a Counter", "A legal Counter must match the incoming card's Counter State, explicit counter-card relationship, or an applicable Submission body target."],
      ["Counter-attacks", "An offensive Counter becomes a counter-attack. Counter-attacks are terminal by default and resolve without opening another generic Counter window."],
      ["Punch / Elbow exchange", "Punch and Elbow are the explicit exchange family that may answer each other and continue the exchange when legal."],
      ["Mirror locks", "Jawbreaker cannot answer Jawbreaker, and Arm Drag Counter does not recursively counter itself in the same exchange."],
      ["Once Too Often", "Once Too Often is a reactive Action. If the opponent plays the exact same Move card they already connected with earlier in this match, you may play Once Too Often during that Counter window to reverse the repeat and gain Control. It can answer a repeated Finisher, but not a counter-attack."],
      ["Auto Counter", "Auto Counter is the fallback when you do not use a matching reversal. Its discard Cost is 5 pages the first time, then 6, 7, 8 and so on. You must still have at least 2 pages left in hand afterward."],
      ["Auto Counter limits", "Auto Counter cannot answer a Finisher or a counter-attack. The CPU prefers a real matching Counter and only considers Auto Counter in its authored decision rules."]
    ]
  },
  {
    id: "damage-state", group: "MATCH", title: "Damage, Grounding & Stun",
    summary: "Moves can change HP, body position and short-term match state.",
    items: [
      ["Damage", "Connected Moves reduce current HP by their resolved Damage, to a minimum of 0."],
      ["Grounding", "Cards that ground the opponent put them on the mat. Grounded status matters for many Finishers, Aerials and Submissions."],
      ["Stun", "Stun is an authored temporary state used by certain Moves and Actions. Stun duration and any prevention or bonus interactions follow the relevant card text."],
      ["Body-part damage", "Some attacks mark persistent damage to Head, Arms, Legs, Back or Chest. Submission pressure on that body part adds to the same persistent total."],
      ["Persistent injury", "Body-part damage remains after a Submission is released. Later holds can continue working the same damaged area."]
    ]
  },
  {
    id: "pins", group: "FINISH", title: "Pins & Kick Outs",
    summary: "Pins are only legal against an opponent already in Amber or Red health.",
    items: [
      ["Pin window", "A pin attempt is available after you connected a Move and retained Control, before playing Momentum or an Action in that fresh post-Move Action window."],
      ["Health gate", "Green-health opponents cannot be pinned. The defender must be in Amber or Red before the pin chance table is consulted."],
      ["Referee count", "A legal cover uses the referee count presentation. The defender may use a legal Pin Escape card when available."],
      ["Failed pin", "If the pin does not succeed, the defender kicks out and gains Control."],
      ["Pin probability", "Once the pin is legal, success chance is based on the defender's actual current HP, using the table shown in this Rulebook."]
    ]
  },
  {
    id: "submissions", group: "FINISH", title: "Submissions & Body Damage",
    summary: "Submission pressure is persistent and the tap threshold is the defender's current HP.",
    items: [
      ["Applying a hold", "A connected Submission adds its first pressure tick to the targeted body part. If that tick does not already meet the tap threshold, the defender receives a visible response window before any further pressure can resolve."],
      ["Defender response", "When you are trapped in a CPU Submission, the match pauses on an In the Hold response. Press Pass · Continue Hold to resolve the next pressure step. If the CPU maintains again, you receive another response window before another tick."],
      ["Tap threshold", "The defender taps whenever accumulated damage on the targeted body part is greater than or equal to the defender's current HP at a Submission damage tick."],
      ["Maintaining", "Maintaining a Submission ditches 1 page from the attacker's hand and adds the hold's pressure again."],
      ["Releasing", "The attacker may release instead of maintaining. The existing body-part damage stays in place and the attacker normally retains Control."],
      ["Worked body parts", "Repeated holds on an already-damaged body part become increasingly dangerous because prior damage is never reset simply by releasing the hold."]
    ]
  },
  {
    id: "deck-building", group: "DECK LAB", title: "Deck Building",
    summary: "Every playable Superstar deck is exactly 60 pages plus a separate Entrance.",
    items: [
      ["Deck size", "A legal deck contains exactly 60 pages."],
      ["Lead Off 5", "The first 5 pages are your opening hand. Lead Off may contain only Moves and Momentum, and must contain at least 1 Move and at least 1 Momentum page."],
      ["Copy caps", "Normal deck cards have a default maximum of 5 copies. Momentum cards may use up to 12 copies of the same Momentum card. A card-specific lower maxCopies value overrides those defaults."],
      ["Copy families", "Cards that share a copyFamily have a combined family cap of 5 copies."],
      ["Ownership", "You can only save copies you actually own. Standard five-copy cards may be owned as up to 5 Normal plus 5 Foil copies, while deck legality still allows at most 5 total copies of that card identity."],
      ["Superstar legality", "Deck Lab enforces Superstar-exclusive cards, allowed-Superstar families, Method Limits and any card-specific restrictions."],
      ["Entrance", "A legal deck also needs one owned compatible Entrance selected outside the 60 pages."],
      ["Recommended decks", "Your first Superstar receives the complete authored 60-page onboarding deck. Later Superstar unlocks grant only the Superstar identity plus at most one authored Finisher, one Trademark and one Action; they do not grant a complete deck, shared filler, or the Superstar-specific Entrance. Deck Lab compares your Collection against the authored 60-page recommended build, uses owned recommended cards first, fills gaps only with legal shared cards you already own, and recommends missing authored cards and the Superstar-specific Entrance as you collect them. Every authored deck starts with 1 Once Too Often; players may collect additional copies and run up to the normal 5-copy cap."]
    ]
  },
  {
    id: "collection-rarity", group: "COLLECTION", title: "Rarity, Ownership & Foils",
    summary: "Rarity controls collectibility; Foils are premium chase finishes with a small Damage edge.",
    items: [
      ["Rarity", "1★ Common, 2★ Uncommon, 3★ Rare and 4★ Very Rare."],
      ["Exclusive rarity policy", "Cards exclusive to one wrestler must be Rare or Very Rare. Wrestler-exclusive Trademarks are generally Rare; Finishers and wrestler one-use/reactive Actions are Very Rare."],
      ["Ownership caps", "Standard playable cards can be owned as up to 5 Normal plus 5 Foil copies. Deck construction still caps that card identity at 5 total copies. Momentum keeps its project cap; Superstar, Entrance and Manager identities cap at 1."],
      ["Foils", "Foil is the premium chase finish. A Foil Move with positive Damage gets +1 Damage. Cost, Method requirements, Counter states and card text are otherwise unchanged. Cards with no positive Damage do not gain a Damage bonus."],
      ["Foil deck use", "Deck Lab and Deck Assistance prefer owned Foil copies. The +1 Damage is shown on the live card plate and is part of the Foil card’s gameplay value; it is not a hidden modifier."],
      ["Collection milestones", "Foil ownership still contributes to Foil collection progress and other collector-facing milestones where shown."]
    ]
  },
  {
    id: "boosters", group: "COLLECTION", title: "Boosters, Duplicates & Deck Assistance",
    summary: "Five-card boosters build the collection while ownership caps protect the economy.",
    items: [
      ["Pack size", "A standard booster contains 5 pulls."],
      ["Rarity weights", "Ordinary slots roll from the current available pool using 50% Common, 30% Uncommon, 15% Rare and 5% Very Rare weighting until a Very Rare has been hit."],
      ["Very Rare ceiling", "A standard five-card booster can contain at most 1 Very Rare total. A Superstar chase consumes that one Very Rare slot. Super Packs are the explicit exception and can contain up to 2 Very Rares."],
      ["Guaranteed Foil", "The first pull is Foil. Entrances are also presented as Foil. Positive-Damage Foil Moves deal +1 Damage, making the guaranteed Foil a real gameplay chase."],
      ["Super Packs", "Clearing a full mode or tournament awards a five-card Super Pack. It guarantees a Foil Rare-or-better first pull and uses boosted 25% Common, 40% Uncommon, 27% Rare and 8% Very Rare weighting, with up to 2 Very Rares."],
      ["Superstar chase", "Eligible Superstar identities use a separate 2% pack-level chase with a 100-pack hard pity for an available unowned Superstar in that set."],
      ["Duplicate conversion", "Standard five-copy cards track Normal and Foil ownership separately: up to 5 Normal and 5 Foil. A pull converts to Universe Points only when that finish is already at its cap. Unique cards and Momentum retain their existing caps. Overflow value remains rarity-based: Common 1 UP, Uncommon 2 UP, Rare 3 UP and Very Rare 4 UP."],
      ["Released sets only", "Only currently released player-facing sets can be opened or awarded from live reward pools. Future subset boosters remain unavailable until their release pass goes live."],
      ["Universal booster cards", "A small number of shared WWE Legacy staples may appear in any currently released set booster while retaining one collector identity. Once Too Often is the first universal booster card."],
      ["Deck Assistance", "Deck Assistance can suggest safe restoration toward a Superstar's authored recommended build when a newly-owned card makes that possible. When a Foil copy is owned, recommendations prefer that finish; positive-Damage Foil Moves are a genuine +1 Damage upgrade."]
    ]
  },
  {
    id: "modes", group: "PLAY", title: "Game Modes",
    summary: "The same core match engine powers Exhibition, Live Events, King of the Ring, Money in the Bank and Championship Road.",
    items: [
      ["Exhibition", "Choose an owned Superstar and play a standard one-off match against an eligible CPU opponent."],
      ["Live Events", "Live Events is a 24-hour rotating tower hub. Every standard tower refreshes together at local midnight, and the same named theme cannot return on the immediately following day. Limited 24-hour birthday towers can also appear on a Superstar's real birthday."],
      ["Daily brand schedule", "The Daily Tower uses RAW branding on Monday, NXT on Wednesday and SmackDown on Saturday; Tuesday, Thursday, Friday and Sunday use original WWE Legacy event identities."],
      ["Tower rotation", "The Live Events header communicates the shared daily reset. Individual tower cards focus on theme, progress, reward and action instead of repeating countdown timers. Progress belongs to that day's tower and expires at local midnight."],
      ["Match rewards", "Every non-final match victory awards 1 normal booster. A loss awards no match reward. The final victory that clears a full structured mode or tournament awards only its Super Pack with boosted rarity odds and at least one Rare-or-better card; it does not also award a normal victory booster or direct UP."],
      ["King of the Ring", "An 8-Superstar single-elimination tournament. Your Superstar must win a Quarterfinal, Semifinal and Final in succession. One loss eliminates you. Each victory awards a normal booster. Winning the Final crowns your Superstar King of the Ring, then offers three different released-set Super Packs; choose exactly one."],
      ["Money in the Bank", "Money in the Bank lives inside Live Events as a daily 8-opponent tower. You have 3 lives for the run. A loss costs one life; losing all 3 restarts the tower from Level 1 against the same daily field. Clearing all 8 levels awards the daily completion reward, and a fresh random tower arrives at local midnight."],
      ["Championship Road", "Every unlocked Superstar has a separate persistent 24-match Season 1 road split into six four-match themed regions. Progress, current match and difficulty unlocks are saved independently for each Superstar. Win to unlock the next numbered matchup; a loss retries the current node. Each Superstar begins on Easy, where opponents start at -5 HP. Completing that Superstar’s full road unlocks Normal (standard HP), then Hard (+5 opponent HP), then Hardcore (+10 opponent HP). The player Superstar receives no HP modifier."],
      ["Career records", "Completed matches feed My Legacy's overall W/L, W/L by unlocked Superstar and W/L by mode."]
    ]
  },
  {
    id: "season-challenges", group: "PROGRESSION", title: "Season, Challenges & Rewards",
    summary: "Matches, challenges and rewards feed the 100-tier Season 1 road.",
    items: [
      ["Season 1", "Season 1 contains 100 tiers at 100 XP per tier, for 10,000 XP total. Tier 100 awards the Foil The Rock — Final Boss Superstar identity."],
      ["Match XP", "A match win awards 15 Season XP and a loss awards 0 Season XP."],
      ["Daily challenges", "Three Daily Challenges rotate each local day. Each completed Daily Challenge awards its shown booster reward plus 25 Season XP."],
      ["Weekly challenges", "Three Weekly Challenges rotate each week. Each completed Weekly Challenge awards its shown booster reward plus 100 Season XP."],
      ["Daily free booster", "The Season page provides one free booster on a 24-hour timer. Claiming it opens the booster immediately."],
      ["Season reward gating", "Season booster tiers can only resolve to sets that are actually released at that time; future subsets cannot appear early."],
      ["Final Boss road", "The Rock's cards are earned one at a time across the road, mixed with UP and released-set boosters, culminating in his Foil Superstar card at Tier 100."]
    ]
  },
  {
    id: "legacy-records", group: "MY LEGACY", title: "Records, Achievements & Save Data",
    summary: "My Legacy is the permanent career record for this local profile.",
    items: [
      ["Overall record", "My Legacy stores total wins and losses from the career-record tracking build onward."],
      ["Superstar record", "Every unlocked Superstar has their own W/L record."],
      ["Mode record", "Exhibition, Live Event, King of the Ring, Money in the Bank and Championship Road each keep their own W/L totals."],
      ["Achievements", "Achievements are persistent career milestones for wins, modes, finish methods and roster use. Previously stored clear counters can legitimately satisfy matching achievements."],
      ["Local profile", "Progress, collection, decks, Season state, records and achievements are stored in the local WWE Legacy profile on this device / browser."],
      ["Reset Progress", "Reset Progress in My Legacy permanently clears the local profile when confirmed."]
    ]
  },
  {
    id: "glossary", group: "REFERENCE", title: "Quick Glossary",
    summary: "The short version of the terms used throughout WWE Legacy.",
    items: [
      ["Control", "The right to take normal offensive actions."],
      ["Control sequence", "The uninterrupted stretch during which one Superstar keeps Control. Many bonuses check what happened earlier in the same sequence."],
      ["Printed", "The number or rule physically authored on the card before temporary match effects modify it."],
      ["Trademark", "A signature wrestler move, generally Rare when exclusive."],
      ["Finisher", "A top-tier finishing Move. Finishers ignore generic Method requirements and wrestler-exclusive Finishers are Very Rare."],
      ["Counter State", "The physical state an incoming Move exposes for reversal matching."],
      ["UP", "Universe Points, the store currency also earned from duplicate overflow and selected game rewards."],
      ["Foil", "The premium chase finish. A Foil Move with positive Damage displays and deals +1 Damage; other values and rules stay the same."],
      ["REWARD pack", "A special completion-pack wrapper used for Money in the Bank and Championship-style completion rewards; its underlying set still determines the cards inside."]
    ]
  }
]);
