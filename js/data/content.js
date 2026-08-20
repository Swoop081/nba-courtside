import { enrichCounterState } from "./counter-states.js?v=0.13.72";
export const allGameplayCards = [
  {
    "id": "cody-rhodes-dropdown-uppercut",
    "name": "Dropdown Uppercut",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 1,
    "damage": 3,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cody-rhodes",
    "rarity": 3,
    "rulesText": "Cody-exclusive. Fast opening strike.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "dropkick",
    "name": "Dropkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "agility": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Opponent becomes grounded. May Counter a Running Aerial Move.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended",
    "counterStates": [
      "running-aerial"
    ]
  },
  {
    "id": "knee-drop",
    "name": "Knee Drop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only. Opponent ditches 1.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ],
    "tacticalType": "standing-above",
    "counterState": "leg-extended"
  },
  {
    "id": "russian-leg-sweep",
    "name": "Russian Leg Sweep",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent; opponent ditches 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "cody-rhodes-bionic-elbow",
    "name": "Bionic Elbow",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cody-rhodes",
    "rarity": 3,
    "rulesText": "Gain +1 additional Attitude on connect.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "vertical-suplex",
    "name": "Vertical Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "diving-crossbody",
    "name": "Diving Crossbody",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "agility": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "snap-powerslam",
    "name": "Snap Powerslam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent; draw 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "bulldog",
    "name": "Bulldog",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent; opponent ditches 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "gourdbuster",
    "name": "Gourdbuster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "suicide-dive",
    "name": "Suicide Dive",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Cody takes 2 damage after it connects.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 2,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "cody-rhodes-disaster-kick",
    "name": "Disaster Kick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cody-rhodes",
    "rarity": 3,
    "rulesText": "Cody-exclusive. Gain +1 additional Attitude.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "alabama-slam",
    "name": "Alabama Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "missile-dropkick",
    "name": "Missile Dropkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds and Stuns opponent for 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "figure-four-leglock",
    "name": "Figure-Four Leglock",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Submission. +5 persistent Leg damage per successful turn.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 5
    },
    "effects": [],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "moonsault",
    "name": "Moonsault",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "superplex",
    "name": "Superplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 2,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds/Stuns opponent; Cody takes 3 damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 3,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "cody-rhodes-cody-cutter",
    "name": "Cody Cutter",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 1,
      "agility": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "cody-rhodes",
    "rarity": 3,
    "rulesText": "Cody-exclusive Trademark. Grounds opponent; search/draw Cross Rhodes and it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Cross Rhodes",
        "discount": 3
      }
    ],
    "counterState": "running-aerial"
  },
  {
    "id": "cody-rhodes-cross-rhodes",
    "name": "Cross Rhodes",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "cody-rhodes",
    "rarity": 4,
    "rulesText": "Cody-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "punch",
    "name": "Punch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 1,
    "damage": 3,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared fundamental. May Counter an Arm Extended Move. If used as a Counter, another Punch or Elbow may Counter it.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended",
    "counterStates": [
      "arm-extended"
    ],
    "counterExchangeKey": "punch-elbow"
  },
  {
    "id": "headbutt",
    "name": "Headbutt",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared. May Counter a Torso Trapped Move or a Neck / Head-targeting Submission attempt.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended",
    "counterStates": [
      "torso-trapped"
    ],
    "counterSubmissionTargets": [
      "neck-head"
    ]
  },
  {
    "id": "shoulder-tackle",
    "name": "Shoulder Tackle",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "throat-thrust",
    "name": "Throat Thrust",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; simple quick strike",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "big-boot",
    "name": "Big Boot",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "leaping-clothesline",
    "name": "Leaping Clothesline",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "roman-reigns-corner-clotheslines",
    "name": "Corner Clotheslines",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "roman-reigns",
    "rarity": 3,
    "rulesText": "Roman-exclusive Trademark. On Connect: gain +1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "arm-extended",
    "trademark": true
  },
  {
    "id": "roman-reigns-drive-by",
    "name": "Drive-By",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "roman-reigns",
    "rarity": 3,
    "rulesText": "Roman exclusive; grounded opponent only; Stun 1",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "samoan-drop",
    "name": "Samoan Drop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "uranage",
    "name": "Uranage",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "spinebuster",
    "name": "Spinebuster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "powerbomb",
    "name": "Powerbomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; Stun 1",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "exploder-suplex",
    "name": "Exploder Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "tilt-a-whirl-slam",
    "name": "Tilt-a-Whirl Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "roman-reigns-ooh-ahh",
    "name": "Ooh Ahh!!",
    "kind": "action",
    "setId": "summerslam-series-1",
    "cost": 2,
    "rarity": 3,
    "superstarId": "roman-reigns",
    "maxCopies": 1,
    "rulesText": "Roman Reigns-exclusive Action. Search/draw Roman’s Spear. If Roman’s Spear is already in hand, gain +1 Adrenaline instead. Roman’s next Spear this Control sequence costs 1 less.",
    "effect": {
      "type": "romanOohAhh",
      "name": "Roman's Spear",
      "discount": 1,
      "adrenalineIfInHand": 1
    }
  },
  {
    "id": "roman-reigns-guillotine",
    "name": "Guillotine",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "roman-reigns",
    "rarity": 3,
    "rulesText": "Roman exclusive; strong Head submission. On connect, lock in a persistent Head hold for +3 damage each successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 3
    },
    "effects": [],
    "counterState": "body-elevated",
    "submissionTarget": "neck-head"
  },
  {
    "id": "roman-reigns-superman-punch",
    "name": "Superman Punch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "strike": 3
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "roman-reigns",
    "rarity": 3,
    "rulesText": "Roman exclusive Trademark; ground opponent; search Roman's Spear",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Roman's Spear"
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "roman-reigns-spear",
    "name": "Roman's Spear",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "roman-reigns",
    "rarity": 4,
    "rulesText": "Roman-exclusive Finisher. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "running-forearm",
    "name": "Running Forearm",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Gain +1 Adrenaline on connect.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "sling-blade",
    "name": "Sling Blade",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "agility": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent; draw 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "enzuigiri",
    "name": "Enzuigiri",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Clean shared strike. Counters Short-Arm Clothesline and may Counter a Leg-targeting Submission attempt.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "tacticalType": "leg-extended",
    "countersCardIds": [
      "short-arm-clothesline"
    ],
    "counterState": "leg-extended",
    "counterSubmissionTargets": [
      "legs"
    ]
  },
  {
    "id": "superkick",
    "name": "Superkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent. This becomes the one canonical Superkick.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "seth-rollins-turnbuckle-sto",
    "name": "Turnbuckle STO",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "seth-rollins",
    "rarity": 3,
    "rulesText": "Seth-exclusive; ground opponent and Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "seth-rollins-springboard-knee",
    "name": "Springboard Knee",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "seth-rollins",
    "rarity": 3,
    "rulesText": "Ground opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "ripcord-knee",
    "name": "Ripcord Knee",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Stun 1.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "standing-shooting-star-press",
    "name": "Standing Shooting Star Press",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "blockbuster",
    "name": "Blockbuster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Aerial impact Move. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "falcon-arrow",
    "name": "Falcon Arrow",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "frog-splash",
    "name": "Frog Splash",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "seth-rollins-buckle-bomb",
    "name": "Buckle Bomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "seth-rollins",
    "rarity": 3,
    "rulesText": "Seth Rollins-exclusive Trademark. Grounds opponent. On Connect: search/draw Curb Stomp; it costs 4 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Curb Stomp",
        "discount": 4
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "pedigree",
    "name": "Pedigree",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "seth-rollins",
    "rarity": 3,
    "rulesText": "Seth Rollins-exclusive Trademark. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "seth-rollins-phoenix-splash",
    "name": "Phoenix Splash",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 8,
    "damage": 12,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "seth-rollins",
    "rarity": 3,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "seth-rollins-curb-stomp",
    "name": "Curb Stomp",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "seth-rollins",
    "rarity": 4,
    "rulesText": "Seth-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "roundhouse-kick",
    "name": "Roundhouse Kick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared canonical card",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "swinging-neckbreaker",
    "name": "Swinging Neckbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent; draw 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "double-underhook-backbreaker",
    "name": "Double Underhook Backbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "New shared card; +3 Back damage",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "springboard-clothesline",
    "name": "Springboard Clothesline",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "koji-clutch",
    "name": "Koji Clutch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Submission. +4 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "diving-elbow-drop",
    "name": "Diving Elbow Drop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "cm-punk-corner-running-knee",
    "name": "Corner Running Knee",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cm-punk",
    "rarity": 3,
    "rulesText": "Punk-exclusive Trademark. Stun 1. On Connect: search/draw Bulldog.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Bulldog",
        "discount": 0
      }
    ],
    "counterState": "leg-extended",
    "trademark": true
  },
  {
    "id": "cm-punk-anaconda-vise",
    "name": "Anaconda Vise",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "technical": 3
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "cm-punk",
    "rarity": 3,
    "rulesText": "Punk-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Head damage per successful turn. On connect, draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 5
    },
    "trademark": true,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ],
    "counterState": "front-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "cm-punk-g-t-s",
    "name": "G.T.S.",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "cm-punk",
    "rarity": 4,
    "rulesText": "Punk-exclusive Finisher. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "stomp",
    "name": "Stomp",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "tacticalType": "standing-above",
    "counterState": "leg-extended"
  },
  {
    "id": "body-slam",
    "name": "Body Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "biel-toss",
    "name": "Biel Toss",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "front-dropkick",
    "name": "Front Dropkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "back-suplex",
    "name": "Back Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "rear-control"
  },
  {
    "id": "gunther-gunther-s-chop",
    "name": "Gunther's Chop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "gunther",
    "rarity": 3,
    "rulesText": "Gunther-exclusive. On Connect: deal +2 persistent Chest damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "bodyPressure",
        "bodyPart": "chest",
        "amount": 2
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "german-suplex",
    "name": "German Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "copyFamily": "german-suplex",
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "rear-control"
  },
  {
    "id": "brock-lesnar-brocks-german",
    "name": "Brock’s German",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "brock-lesnar",
    "rarity": 3,
    "rulesText": "Brock-exclusive. On connect, draw 1 Brock’s German from your Playbook if one remains. Counts as German Suplex for card effects. German Suplex and Brock’s German share a combined 5-copy deck limit.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "searchOnConnectName": "Brock’s German",
    "countsAs": [
      "German Suplex"
    ],
    "copyFamily": "german-suplex",
    "maxCopies": 5,
    "effects": [],
    "counterState": "rear-control"
  },
  {
    "id": "butterfly-suplex",
    "name": "Butterfly Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "gunther-burning-lariat",
    "name": "Burning Lariat",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "gunther",
    "rarity": 3,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "boston-crab",
    "name": "Boston Crab",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Submission. +4 persistent Leg damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 4
    },
    "effects": [],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "last-symphony",
    "name": "Last Symphony",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "gunther",
    "rarity": 3,
    "rulesText": "Gunther-exclusive Trademark. If Gunther's Chop connected earlier this Control sequence, Last Symphony costs 1 less.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated",
    "trademark": true,
    "discountIfNamedConnectedThisControl": { "name": "Gunther's Chop", "amount": 1 }
  },
  {
    "id": "gunther-folding-powerbomb",
    "name": "Folding Powerbomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 11,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "gunther",
    "rarity": 3,
    "rulesText": "Gunther-exclusive Trademark. On Connect: search/draw Gojira Clutch; it costs 2 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Gojira Clutch",
        "discount": 2
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "gunther-gojira-clutch",
    "name": "Gojira Clutch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 0,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "gunther",
    "rarity": 4,
    "rulesText": "Gunther-exclusive Finisher. No Method requirement. Submission. +6 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 6
    },
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "neck-head",
    "finisher": true
  },
  {
    "id": "double-leg-takedown",
    "name": "Double Leg Takedown",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "knee-strike",
    "name": "Knee Strike",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "corner-shoulder-thrusts",
    "name": "Corner Shoulder Thrusts",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "strike",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "ground-and-pound",
    "name": "Ground-and-Pound",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "belly-to-belly-suplex",
    "name": "Belly-to-Belly Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "overhead-belly-to-belly-suplex",
    "name": "Overhead Belly-to-Belly Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Distinct from regular belly-to-belly",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "lariat",
    "name": "Lariat",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "brock-lesnar-kimura-lock",
    "name": "Kimura Lock",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "technical": 3
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "brock-lesnar",
    "rarity": 3,
    "rulesText": "Brock-exclusive Trademark. Grounded opponent only. Submission. +6 persistent Arm damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 6
    },
    "trademark": true,
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "arms"
  },
  {
    "id": "brock-lesnar-f-5",
    "name": "F-5",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "brock-lesnar",
    "rarity": 4,
    "rulesText": "Brock-exclusive Finisher. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "senton",
    "name": "Senton",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "agility": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "cannonball",
    "name": "Cannonball",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New canonical; grounds",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "fisherman-buster",
    "name": "Fisherman Buster",
    "boosterOnly": true,
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "spinning-torture-rack-neckbreaker",
    "name": "Spinning Torture Rack Neckbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "New canonical; ground + Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "swanton-bomb",
    "name": "Swanton Bomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "pop-up-powerbomb",
    "name": "Pop-Up Powerbomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kevin-owens",
    "rarity": 3,
    "rulesText": "Kevin Owens-exclusive Trademark. Ground your opponent. On connect, search/draw Stunner; it costs 4 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Stunner",
        "discount": 4
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "kevin-owens-package-piledriver",
    "name": "Package Piledriver",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 8,
    "damage": 13,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kevin-owens",
    "rarity": 3,
    "rulesText": "Ground + Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "kevin-owens-stunner",
    "name": "Stunner",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "kevin-owens",
    "rarity": 4,
    "rulesText": "Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "reverse-elbow",
    "name": "Reverse Elbow",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared. May Counter a Rear Control Move or a Neck / Head-targeting Submission attempt.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended",
    "counterStates": [
      "rear-control"
    ],
    "counterSubmissionTargets": [
      "neck-head"
    ]
  },
  {
    "id": "running-uppercut",
    "name": "Running Uppercut",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared. May Counter a Rear Control Move or a Neck / Head-targeting Submission attempt.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "chokeslam",
    "name": "Chokeslam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared canonical Chokeslam. Grounds opponent. If played by The Undertaker, on Connect search/draw Tombstone Piledriver; it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Tombstone Piledriver",
        "discount": 3,
        "ifSuperstarIds": [
          "the-undertaker"
        ]
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "gorilla-press-slam",
    "name": "Gorilla Press Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "oba-femi-one-handed-backbreaker",
    "name": "One-Handed Backbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "oba-femi",
    "rarity": 3,
    "rulesText": "Oba-exclusive Trademark; +3 Back pressure",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "oba-femi-fall-from-grace",
    "name": "Fall From Grace",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "oba-femi",
    "rarity": 4,
    "rulesText": "Oba-exclusive Finisher.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "kick-to-the-gut",
    "name": "Kick to the Gut",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "If Austin connects with this, Stone Cold Stunner cannot be Countered as his immediately following Move.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "back-body-drop",
    "name": "Back Body Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New canonical shared card; grounds opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated",
    "counterStates": [
      "running-aerial"
    ]
  },
  {
    "id": "clothesline",
    "name": "Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "stone-cold-steve-austin-pointed-elbow-drop",
    "name": "Pointed Elbow Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "stone-cold-steve-austin",
    "rarity": 3,
    "rulesText": "Austin-exclusive; grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "mounted-punches",
    "name": "Mounted Punches",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared card; grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "stone-cold-steve-austin-mudhole-stomps",
    "name": "Mudhole Stomps",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "stone-cold-steve-austin",
    "rarity": 3,
    "rulesText": "Austin-exclusive Trademark. Ground opponent. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "leg-extended",
    "trademark": true
  },
  {
    "id": "stone-cold-steve-austin-lou-thesz-press",
    "name": "Lou Thesz Press",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "stone-cold-steve-austin",
    "rarity": 3,
    "rulesText": "Austin-exclusive Trademark; ground opponent; search Mounted Punches",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Mounted Punches"
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "stone-cold-steve-austin-stone-cold-stunner",
    "name": "Stone Cold Stunner",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "stone-cold-steve-austin",
    "rarity": 4,
    "rulesText": "Austin-exclusive Finisher. Grounds opponent. Stun 1. If Austin connected with Kick to the Gut as his immediately previous Move, this cannot be Countered.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "running-big-boot",
    "name": "Running Big Boot",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "sidewalk-slam",
    "name": "Sidewalk Slam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "front-backbreaker",
    "name": "Front Backbreaker",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "the-undertaker-snake-eyes",
    "name": "Snake Eyes",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "the-undertaker",
    "rarity": 3,
    "rulesText": "Undertaker-exclusive Trademark. On Connect: Undertaker’s Running Big Boot gets +2 Damage this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "buffNextByName",
        "name": "Undertaker’s Running Big Boot",
        "damage": 2
      }
    ],
    "counterState": "body-elevated",
    "trademark": true
  },
  {
    "id": "the-undertaker-old-school",
    "name": "Old School",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "strike": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "the-undertaker",
    "rarity": 3,
    "rulesText": "Undertaker-exclusive Trademark; grounds opponent; opponent ditches 1 page; on Connect search/draw Chokeslam and it costs 2 less this Control sequence",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      },
      {
        "type": "search",
        "name": "Chokeslam",
        "discount": 2
      }
    ],
    "counterState": "diving-aerial"
  },
  {
    "id": "tombstone-piledriver",
    "name": "Tombstone Piledriver",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": null,
    "allowedSuperstarIds": [
      "the-undertaker",
      "kane"
    ],
    "rarity": 4,
    "rulesText": "The Undertaker / Kane Finisher; ground opponent; Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "uppercut",
    "name": "Uppercut",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "short-arm-clothesline",
    "name": "Short-Arm Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "countersCardIds": [
      "big-boot"
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "powerslam",
    "name": "Powerslam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "backbreaker",
    "name": "Backbreaker",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "kane-two-handed-choke-lift",
    "name": "Two-Handed Choke Lift",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kane",
    "rarity": 3,
    "rulesText": "Kane-exclusive. On Connect: Chokeslam From Hell gets +1 Damage this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "buffNextByName",
        "name": "Chokeslam From Hell",
        "damage": 1
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "flying-clothesline",
    "name": "Flying Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1,
      "strike": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Kane signature treatment",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "kane-chokeslam-from-hell",
    "name": "Chokeslam From Hell",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kane",
    "rarity": 3,
    "rulesText": "Kane-exclusive Trademark. On Connect: search/draw Tombstone Piledriver; it costs 3 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Tombstone Piledriver",
        "discount": 3
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "forearm-smash",
    "name": "Forearm Smash",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "ddt",
    "name": "DDT",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; grounds",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "neckbreaker",
    "name": "Neckbreaker",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; grounds",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "piledriver",
    "name": "Piledriver",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground + Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "mankind-cactus-elbow",
    "name": "Mankind’s Elbow Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "mankind",
    "rarity": 3,
    "rulesText": "Mankind-exclusive. Diving Elbow Drop.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "mankind-clothesline",
    "name": "Mankind’s Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "mankind",
    "rarity": 3,
    "rulesText": "Mankind-exclusive Trademark. Grounds opponent. On Connect: search/draw Mankind’s Elbow Drop; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Mankind’s Elbow Drop",
        "discount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "mankind-double-arm-ddt",
    "name": "Double-Arm DDT",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "mankind",
    "rarity": 3,
    "rulesText": "Mankind-exclusive Trademark",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "mankind-mandible-claw",
    "name": "Mandible Claw",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 0,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "mankind",
    "rarity": 4,
    "rulesText": "Mankind-exclusive Finisher. Submission. +5 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 5
    },
    "finisher": true,
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "elbow-drop",
    "name": "Elbow Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "tacticalType": "standing-above",
    "counterState": "arm-extended"
  },
  {
    "id": "atomic-drop",
    "name": "Atomic Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "bearhug",
    "name": "Bearhug",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 0,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Standing opponent only. Submission. +4 persistent Chest damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "chest",
      "pressure": 4
    },
    "effects": [],
    "counterState": "torso-trapped",
    "submissionTarget": "back",
    "standingOnly": true
  },
  {
    "id": "military-press-slam",
    "name": "Military Press Slam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "hogans-big-boot",
    "name": "Hogan’s Big Boot",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "hulk-hogan",
    "rarity": 3,
    "rulesText": "Hogan-exclusive Trademark. Grounds opponent. On Connect: search/draw Atomic Leg Drop; it costs 4 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Atomic Leg Drop",
        "discount": 4
      }
    ],
    "trademark": true,
    "counterState": "leg-extended"
  },
  {
    "id": "hulk-hogan-atomic-leg-drop",
    "name": "Atomic Leg Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "hulk-hogan",
    "rarity": 4,
    "rulesText": "Hogan-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "double-axe-handle",
    "name": "Double Axe Handle",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "ultimate-warrior-diving-shoulder-block",
    "name": "Warrior's Shoulder Block",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "aerial",
    "method": "strike",
    "superstarId": "ultimate-warrior",
    "rarity": 3,
    "rulesText": "Ultimate Warrior-exclusive aerial impact Move.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "ultimate-warrior-gorilla-press-slam",
    "name": "Warrior's Gorilla Press Slam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "ultimate-warrior",
    "rarity": 3,
    "rulesText": "Warrior-exclusive Trademark. Ground opponent. On connect: search your Playbook for Warrior Splash and draw it.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Warrior Splash"
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "ultimate-warrior-warrior-splash",
    "name": "Warrior Splash",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "ultimate-warrior",
    "rarity": 4,
    "rulesText": "Warrior-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "back-elbow",
    "name": "Back Elbow",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "May Counter a Rear Control Move or a Neck / Head-targeting Submission attempt.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended",
    "counterStates": [
      "rear-control"
    ],
    "counterSubmissionTargets": [
      "neck-head"
    ]
  },
  {
    "id": "running-knee",
    "name": "Running Knee",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "hotshot",
    "name": "Hotshot",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "leaping-rope-clothesline",
    "name": "Leaping Rope Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "diving-body-press",
    "name": "Diving Body Press",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "randy-savage-flying-elbow-drop",
    "name": "Flying Elbow Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "randy-savage",
    "rarity": 4,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "chop",
    "name": "Chop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "corner-avalanche",
    "name": "Corner Avalanche",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "andre-the-giant-double-underhook-suplex",
    "name": "Double Underhook Suplex",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 14,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "andre-the-giant",
    "rarity": 3,
    "rulesText": "André-exclusive Trademark. On Connect: search your Playbook for Sitdown Splash and draw it. André’s next Sitdown Splash this Control sequence costs 3 less.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Sitdown Splash",
        "amount": 3
      },
      {
        "type": "search",
        "name": "Sitdown Splash",
        "discount": 0
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "andre-the-giant-sitdown-splash",
    "name": "Sitdown Splash",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 11,
    "damage": 18,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "andre-the-giant",
    "rarity": 4,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "northern-lights-suplex",
    "name": "Northern Lights Suplex",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "rhea-ripley-electric-chair-facebuster",
    "name": "Electric Chair Drop",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "rhea-ripley",
    "rarity": 3,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "rhea-ripley-reverse-alabama-slam",
    "name": "Reverse Alabama Slam",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "rhea-ripley",
    "rarity": 3,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "razor-s-edge",
    "name": "Rhea’s Crucifix Powerbomb",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "rhea-ripley-prism-trap",
    "name": "Prism Trap",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": "rhea-ripley",
    "rarity": 3,
    "rulesText": "Rhea Ripley-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Leg damage per successful turn. On Connect: search/draw Riptide; it costs 2 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 5
    },
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Riptide",
        "discount": 2
      }
    ],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "rhea-ripley-riptide",
    "name": "Riptide",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "rhea-ripley",
    "rarity": 4,
    "rulesText": "Rhea Ripley-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "arm-drag",
    "name": "Arm Drag",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared. May Counter a Front Control Move or an Arm-targeting Submission attempt.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control",
    "counterStates": [
      "front-control"
    ],
    "counterSubmissionTargets": [
      "arms"
    ]
  },
  {
    "id": "becky-lynch-diamond-dust",
    "name": "Diamond Dust",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "becky-lynch",
    "rarity": 3,
    "rulesText": "New shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "becky-lynch-diving-leg-drop",
    "name": "Diving Leg Drop",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "becky-lynch",
    "rarity": 3,
    "rulesText": "New shared; grounded only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "becky-lynch-dis-arm-her",
    "name": "Dis-arm-her",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "becky-lynch",
    "rarity": 3,
    "rulesText": "Becky-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Arm damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 5
    },
    "trademark": true,
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "arms"
  },
  {
    "id": "becky-lynch-manhandle-slam",
    "name": "Manhandle Slam",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "becky-lynch",
    "rarity": 4,
    "rulesText": "Becky-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "hurricanrana",
    "name": "Hurricanrana",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "agility": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "May Counter a Body Elevated Move.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated",
    "counterStates": [
      "body-elevated"
    ]
  },
  {
    "id": "liv-morgan-jersey-codebreaker",
    "name": "Jersey Codebreaker",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "liv-morgan",
    "rarity": 3,
    "rulesText": "Liv Morgan-exclusive Trademark. Grounds opponent. Stun 1. On Connect: search/draw Oblivion; it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Oblivion",
        "discount": 3
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "liv-morgan-oblivion",
    "name": "Oblivion",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "liv-morgan",
    "rarity": 4,
    "rulesText": "Liv Morgan-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "sunset-flip-powerbomb",
    "name": "Sunset Flip Powerbomb",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "crossface",
    "name": "Crossface",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Submission. +4 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "bayley-rose-plant",
    "name": "Rose Plant",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "bayley",
    "rarity": 4,
    "rulesText": "Bayley-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "running-knee-strike",
    "name": "Running Knee Strike",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "middle-rope-stunner",
    "name": "Middle-Rope Stunner",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared/new",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "fallaway-slam",
    "name": "Fallaway Slam",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "spear",
    "name": "Spear",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 4,
    "rulesText": "Shared Spear. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "charlotte-flair-natural-selection",
    "name": "Natural Selection",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 11,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "charlotte-flair",
    "rarity": 3,
    "rulesText": "Charlotte-exclusive Trademark. On Connect: search/draw Figure-Eight Leglock; it costs 2 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Figure-Eight Leglock",
        "discount": 2
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "charlotte-flair-figure-eight-leglock",
    "name": "Figure-Eight Leglock",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 0,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "charlotte-flair",
    "rarity": 4,
    "rulesText": "Charlotte-exclusive Finisher. Grounded opponent only. Submission. +6 persistent Leg damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 6
    },
    "finisher": true,
    "effects": [],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "paige-rope-hung-knee-strikes",
    "name": "Rope-Hung Knee Strikes",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "paige",
    "rarity": 3,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "paige-paige-turner",
    "name": "Paige Turner",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "paige",
    "rarity": 3,
    "rulesText": "Paige-exclusive Trademark.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control",
    "trademark": true
  },
  {
    "id": "paige-pto",
    "name": "PTO",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "paige",
    "rarity": 3,
    "rulesText": "Paige-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Arm damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 5
    },
    "trademark": true,
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "arms"
  },
  {
    "id": "paige-ram-paige",
    "name": "Ram-Paige",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "paige",
    "rarity": 4,
    "rulesText": "Paige-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "dragon-screw",
    "name": "Dragon Screw",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "May Counter a Leg Extended Move or a Leg-targeting Submission attempt.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control",
    "counterStates": [
      "leg-extended"
    ],
    "counterSubmissionTargets": [
      "legs"
    ]
  },
  {
    "id": "reverse-suplex",
    "name": "Reverse Suplex",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "rear-control"
  },
  {
    "id": "stephanie-vaquer-svb",
    "name": "SVB",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strike": 1,
      "technical": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "stephanie-vaquer",
    "rarity": 3,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "stephanie-vaquer-devils-kiss",
    "name": "Devil’s Kiss",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "stephanie-vaquer",
    "rarity": 3,
    "rulesText": "Stephanie Vaquer-exclusive Trademark. Grounds opponent. On Connect: search/draw Vaquer Inferno; it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Vaquer Inferno",
        "discount": 3
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "stephanie-vaquer-vaquer-inferno",
    "name": "Vaquer Inferno",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "stephanie-vaquer",
    "rarity": 4,
    "rulesText": "Stephanie Vaquer-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "meteora",
    "name": "Meteora",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "double-stomp",
    "name": "Double Foot Stomp",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "iyo-sky-bullet-train-attack",
    "name": "Bullet Train Attack",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 1,
      "agility": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "iyo-sky",
    "rarity": 3,
    "rulesText": "IYO SKY-exclusive Trademark. Grounds opponent. On Connect: search/draw Over the Moonsault; it costs 2 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Over the Moonsault",
        "discount": 2
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "iyo-sky-over-the-moonsault",
    "name": "Over the Moonsault",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "iyo-sky",
    "rarity": 4,
    "rulesText": "IYO SKY-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "the-rock-lay-the-smack-down",
    "name": "Lay The Smack Down",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "the-rock",
    "rarity": 3,
    "rulesText": "The Rock-exclusive. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "the-rock-belt-whip",
    "name": "Belt Whip",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "the-rock",
    "rarity": 3,
    "rulesText": "Final Boss-exclusive weapon attack. On connect, deal +1 persistent Back damage; opponent loses 1 Adrenaline and ditches 1 page.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      },
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "arm-extended",
    "bodyDamage": {
      "bodyPart": "back",
      "pressure": 1
    },
    "weapon": true
  },
  {
    "id": "the-rock-rock-bottom",
    "name": "Rock Bottom",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 8,
    "damage": 14,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "the-rock",
    "rarity": 3,
    "rulesText": "The Rock-exclusive Trademark. Grounds opponent. On Connect: search/draw People's Elbow; it costs 2 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "People's Elbow",
        "discount": 2
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "the-rock-people-s-elbow",
    "name": "People's Elbow",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 11,
    "damage": 18,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "the-rock",
    "rarity": 4,
    "rulesText": "The Rock-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "chain-wrestling",
    "name": "Chain Wrestling",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 2,
    "damage": 0,
    "requirements": {
      "technical": 1
    },
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "grapple",
      "submission"
    ],
    "rulesText": "Counter a Grapple or Submission Move.",
    "counterState": "front-control",
    "counterStates": [
      "front-control",
      "rear-control"
    ],
    "counterSubmissionTargets": [
      "arms",
      "legs",
      "back",
      "neck-head"
    ]
  },
  {
    "id": "sidestep",
    "name": "Sidestep",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 2,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "grapple",
      "aerial"
    ],
    "rulesText": "Counter a Running Aerial or Diving Aerial Move.",
    "counterState": "running-aerial",
    "counterStates": [
      "running-aerial",
      "diving-aerial"
    ]
  },
  {
    "id": "duck",
    "name": "Duck",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "strike"
    ],
    "rulesText": "Counter an Arm Extended or Leg Extended Move.",
    "counterState": "arm-extended",
    "counterStates": [
      "arm-extended",
      "leg-extended"
    ]
  },
  {
    "id": "no-sell",
    "name": "No Sell",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 3,
    "damage": 0,
    "requirements": {
      "strength": 1
    },
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "strike",
      "grapple"
    ],
    "rulesText": "Counter a Body Elevated or Torso Trapped Move dealing 7+ printed Damage.",
    "counterState": "torso-trapped",
    "counterStates": [
      "body-elevated",
      "torso-trapped"
    ]
  },
  {
    "id": "shoulder-up",
    "name": "Shoulder Up",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "pinEscape": true,
    "rulesText": "Stop one Pin attempt and take Control."
  },
  {
    "id": "game-plan",
    "name": "Game Plan",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Your next Move this Control sequence costs 2 less.",
    "effect": {
      "type": "discountNext",
      "amount": 2
    }
  },
  {
    "id": "got-all-of-it",
    "name": "Got All of It",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Your next Move this Control sequence gets +2 damage.",
    "effect": {
      "type": "buffNext",
      "damage": 2
    }
  },
  {
    "id": "fire-up",
    "name": "Fire Up",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Gain +1 Adrenaline.",
    "effect": {
      "type": "gainAdrenaline",
      "amount": 1
    }
  },
  {
    "id": "crowd-support",
    "name": "Crowd Support",
    "kind": "support",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Once per Control sequence after you connect with a Move, gain +1 Adrenaline.",
    "effect": {
      "type": "crowdSupport"
    }
  },
  {
    "id": "open-can",
    "name": "Open Up a Can of Whoop-Ass",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Austin’s next Strike Move gets +2 damage.",
    "effect": {
      "type": "buffNextMethod",
      "method": "strike",
      "damage": 2
    }
  },
  {
    "id": "what",
    "name": "What?",
    "kind": "support",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Once per match after the opponent plays an Action, they lose 1 Adrenaline.",
    "effect": {
      "type": "what"
    }
  },
  {
    "id": "people-championship",
    "name": "People's Championship",
    "kind": "support",
    "setId": "season-1-final-boss",
    "rarity": 4,
    "superstarId": "the-rock",
    "rulesText": "Once per match below 50% HP: gain +2 Adrenaline and draw 1.",
    "effect": {
      "type": "peopleChampionship"
    }
  },
  {
    "id": "manager-paul-bearer",
    "name": "Paul Bearer",
    "kind": "manager",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "the-undertaker",
    "rulesText": "Undertaker only. Once per match below 50% HP, recover a page from discard or gain +1 Strength Momentum."
  },
  {
    "id": "manager-bobby-heenan",
    "name": "Bobby Heenan",
    "kind": "manager",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "andre-the-giant",
    "rulesText": "André only. Once per match when an important André Move is Countered, protect it from being discarded and return it to hand."
  },
  {
    "id": "manager-miss-elizabeth",
    "name": "Miss Elizabeth",
    "kind": "manager",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "randy-savage",
    "rulesText": "Savage only. Once per match below 50% HP, draw 2 then put 1 page on the bottom of the Playbook."
  },
  {
    "id": "momentum-strength",
    "name": "Strength Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "strength",
    "amount": 1,
    "rulesText": "+1 permanent Strength Momentum."
  },
  {
    "id": "momentum-strike",
    "name": "Strike Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "strike",
    "amount": 1,
    "rulesText": "+1 permanent Strike Momentum."
  },
  {
    "id": "momentum-technical",
    "name": "Technical Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "technical",
    "amount": 1,
    "rulesText": "+1 permanent Technical Momentum."
  },
  {
    "id": "momentum-agility",
    "name": "Agility Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "agility",
    "amount": 1,
    "rulesText": "+1 permanent Agility Momentum."
  },
  {
    "id": "entrance-amazing",
    "name": "Amazing Entrance",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": null,
    "rulesText": "Pre-Match: Begin with +1 Adrenaline.",
    "preMatchMomentum": {},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false,
    "boosterEligible": false
  },
  {
    "id": "entrance-cody-rhodes",
    "name": "Adrenaline in My Soul",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "cody-rhodes",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline. At the start of Turn 5, gain +1 Technical Momentum.",
    "preMatchMomentum": {
      "technical": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": true
  },
  {
    "id": "entrance-roman-reigns",
    "name": "Acknowledge Me",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "roman-reigns",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum. The first Strike Move Roman connects with gains +1 Strike Momentum. At the start of Turn 6, gain +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-seth-rollins",
    "name": "Burn It Down",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "seth-rollins",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum. At the start of Turn 5, draw 1 page and gain +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": true
  },
  {
    "id": "entrance-cm-punk",
    "name": "It’s Clobbering Time!",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "cm-punk",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-gunther",
    "name": "Action Over Words",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "gunther",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-brock-lesnar",
    "name": "Here Comes the Pain",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "brock-lesnar",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-kevin-owens",
    "name": "Fight Owens Fight",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "kevin-owens",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-oba-femi",
    "name": "The Ruler Has Arrived",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "oba-femi",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-stone-cold-steve-austin",
    "name": "Glass Shatters",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-the-undertaker",
    "name": "Rest in Peace",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "the-undertaker",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-kane",
    "name": "Hellfire and Brimstone",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "kane",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-mankind",
    "name": "Boiler Room Dweller",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "mankind",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-hulk-hogan",
    "name": "Real American",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "hulk-hogan",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +2 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 2,
    "delayedTurn5": false
  },
  {
    "id": "entrance-ultimate-warrior",
    "name": "Warrior’s Charge",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "ultimate-warrior",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-randy-savage",
    "name": "Pomp and Circumstance",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "randy-savage",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-andre-the-giant",
    "name": "The Eighth Wonder",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "andre-the-giant",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-rhea-ripley",
    "name": "This Is My Brutality",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "rhea-ripley",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-becky-lynch",
    "name": "Straight Fire",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "becky-lynch",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-liv-morgan",
    "name": "Watch Me",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "liv-morgan",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-bayley",
    "name": "Role Model",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "bayley",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-charlotte-flair",
    "name": "All Hail the Queen",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "charlotte-flair",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-paige",
    "name": "Anti-Diva",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "paige",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-stephanie-vaquer",
    "name": "The Dark Angel",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "stephanie-vaquer",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-iyo-sky",
    "name": "Tokyo Shock",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "iyo-sky",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-the-rock",
    "name": "Final Boss",
    "kind": "entrance",
    "setId": "season-1-final-boss",
    "rarity": 4,
    "superstarId": "the-rock",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-cody-rhodes",
    "name": "Finish the Story",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "cody-rhodes",
    "rulesText": "Once per match when Cody gains Control at 40% HP or less: draw 2, gain +1 Adrenaline, then search Cody Cutter or Cross Rhodes.",
    "special": {
      "type": "lowHpTutor",
      "hpPct": 0.4,
      "draw": 2,
      "adrenaline": 1,
      "names": [
        "Cody Cutter",
        "Cross Rhodes"
      ]
    }
  },
  {
    "id": "special-roman-reigns",
    "name": "Tribal Chief",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "roman-reigns",
    "rulesText": "Once per match after Roman loses Control: you may play this to regain Control.",
    "special": {
      "type": "regainAfterLoseControl"
    }
  },
  {
    "id": "special-seth-rollins",
    "name": "The Visionary",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "seth-rollins",
    "rulesText": "Once per match after Seth successfully Counters a Move, immediately begin an offensive Control window without advancing the turn.",
    "special": {
      "type": "counterKeepSequence"
    }
  },
  {
    "id": "special-cm-punk",
    "name": "Best in the World",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "cm-punk",
    "rulesText": "Once per match when Punk is being pinned: stop the Pin and take Control.",
    "special": {
      "type": "pinEscape"
    }
  },
  {
    "id": "special-gunther",
    "name": "The Mat Is Sacred",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "gunther",
    "rulesText": "Once per match after Gunther successfully Counters: opponent loses 2 Adrenaline and cannot play an Action until committing another Move.",
    "special": {
      "type": "counterDrainActionLock",
      "amount": 2
    }
  },
  {
    "id": "special-brock-lesnar",
    "name": "The Beast Incarnate",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "brock-lesnar",
    "rulesText": "Reactive Action — once per match, automatically when Brock would take 10+ damage from a single Move: reduce it by 5 and gain +1 Strength Momentum.",
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 10,
      "reduce": 5,
      "methodMomentum": "strength"
    }
  },
  {
    "id": "special-brock-lesnar-paul-heyman",
    "name": "The Advocate’s Plan",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "brock-lesnar",
    "rulesText": "Once per match. Play after Brock connects with Brock’s German during this Control sequence. Search your Playbook for F-5 if it is not already in your hand; either way, Brock’s next F-5 this Control costs 2 less.",
    "special": {
      "type": "paulHeyman",
      "afterName": "Brock’s German",
      "searchName": "F-5",
      "discount": 2
    }
  },
  {
    "id": "special-kevin-owens",
    "name": "Welcome to the KO Show",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "kevin-owens",
    "rulesText": "Once per match when the opponent plays an Action or Support: cancel it and take Control.",
    "special": {
      "type": "cancelOpponentUtility"
    }
  },
  {
    "id": "special-oba-femi",
    "name": "The Destroyer",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "oba-femi",
    "rulesText": "Once per match after Oba connects with a Strength Move, his next non-Finisher Strength Move in that Control sequence cannot be Countered.",
    "special": {
      "type": "nextStrengthUncounterable"
    }
  },
  {
    "id": "special-stone-cold-steve-austin",
    "name": "Austin 3:16",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Once per match after Austin successfully Counters a Move, search your Playbook for a Strike Move costing C5 or less.",
    "special": {
      "type": "counterTutorStrike",
      "maxCost": 5
    }
  },
  {
    "id": "special-the-undertaker",
    "name": "The Deadman Rises",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "the-undertaker",
    "rulesText": "Once per match after Undertaker successfully kicks out: gain +1 Adrenaline and take Control.",
    "special": {
      "type": "kickoutControlAdrenaline",
      "amount": 1
    }
  },
  {
    "id": "special-kane",
    "name": "Rise From the Flames",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "kane",
    "rulesText": "Once per match when Kane would become Stunned, ignore that Stun and gain +1 Adrenaline.",
    "special": {
      "type": "ignoreStun",
      "adrenaline": 1
    }
  },
  {
    "id": "special-mankind",
    "name": "Mr. Socko",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "mankind",
    "rulesText": "Once per match when Mankind gains Control while the opponent is grounded, activate Mr. Socko; Mandible Claw gains +2 pressure this Control sequence.",
    "special": {
      "type": "socko"
    }
  },
  {
    "id": "special-hulk-hogan",
    "name": "Hulk Up",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "hulk-hogan",
    "rulesText": "Once per match when Hogan gains Control at 50% HP or less: clear Stun, gain +3 Adrenaline, draw 2 pages, and his next Hogan’s Big Boot this Control cannot be Countered by a Move.",
    "special": {
      "type": "hulkUp",
      "adrenaline": 3,
      "draw": 2
    }
  },
  {
    "id": "special-ultimate-warrior",
    "name": "Shake the Ropes",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "ultimate-warrior",
    "rulesText": "Once per match after Warrior loses Control at 50% HP or less, gain +2 Adrenaline; the next time he gains Control, clear Stun.",
    "special": {
      "type": "shakeRopes"
    }
  },
  {
    "id": "special-randy-savage",
    "name": "Oh Yeah!",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "randy-savage",
    "rulesText": "Once per match after Savage successfully Counters, his next Agility Move this Control sequence costs 2 less.",
    "special": {
      "type": "counterDiscountMethod",
      "method": "agility",
      "amount": 2
    }
  },
  {
    "id": "special-andre-the-giant",
    "name": "Nobody Slams André",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "andre-the-giant",
    "rulesText": "Once per match when an opponent Strength Move would ground André: he remains standing and gains +1 Adrenaline.",
    "special": {
      "type": "nobodySlams"
    }
  },
  {
    "id": "special-rhea-ripley",
    "name": "Brutality",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "rhea-ripley",
    "rulesText": "Once per match after Rhea connects with Headbutt, her next Riptide this Control sequence costs 2 less.",
    "special": {
      "type": "headbuttDiscount",
      "name": "Riptide",
      "amount": 2
    }
  },
  {
    "id": "special-becky-lynch",
    "name": "Tap or Snap",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "becky-lynch",
    "rulesText": "Once per match after Becky successfully Counters, her next Dis-arm-her this Control sequence costs 2 less.",
    "special": {
      "type": "counterDiscountNamed",
      "name": "Dis-arm-her",
      "amount": 2
    }
  },
  {
    "id": "special-liv-morgan",
    "name": "Revenge Tour",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "liv-morgan",
    "rulesText": "Once per match after Liv successfully Counters, draw 1 page and gain +1 Adrenaline; her next Jersey Codebreaker this Control sequence costs 3 less.",
    "special": {
      "type": "counterDiscountNamed",
      "name": "Jersey Codebreaker",
      "amount": 3,
      "draw": 1,
      "adrenaline": 1
    }
  },
  {
    "id": "special-bayley",
    "name": "Veteran Instincts",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "bayley",
    "rulesText": "Once per match after Bayley successfully Counters, draw 3 pages and immediately take Control.",
    "special": {
      "type": "counterDrawControl",
      "draw": 3
    }
  },
  {
    "id": "special-charlotte-flair",
    "name": "Wooo!",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "charlotte-flair",
    "rulesText": "Once per match after Charlotte connects with Flair Chop, draw 1 page and gain +2 Adrenaline.",
    "special": {
      "type": "flairChopWooo",
      "afterName": "Flair Chop",
      "draw": 1,
      "adrenaline": 2
    }
  },
  {
    "id": "special-paige",
    "name": "This Is My House",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "paige",
    "rulesText": "Once per match after Paige successfully Counters, draw 1 page, gain +1 Adrenaline, then choose Paige Turner or PTO; the chosen Move costs 3 less this Control sequence.",
    "special": {
      "type": "counterChooseDiscount",
      "names": [
        "Paige Turner",
        "PTO"
      ],
      "amount": 3,
      "draw": 1,
      "adrenaline": 1
    }
  },
  {
    "id": "special-stephanie-vaquer",
    "name": "Sin Piedad",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "stephanie-vaquer",
    "rulesText": "Once per match after Vaquer successfully Counters, draw 2 pages, gain +1 Adrenaline, and her next Technical Move this Control sequence cannot be Countered.",
    "special": {
      "type": "counterUncounterableMethod",
      "method": "technical",
      "draw": 2,
      "adrenaline": 1
    }
  },
  {
    "id": "special-iyo-sky",
    "name": "Take Flight",
    "kind": "action",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "iyo-sky",
    "rulesText": "Once per match after IYO successfully Counters, her next non-Finisher Agility Move this Control sequence cannot be Countered by a Move.",
    "special": {
      "type": "counterUncounterableMethod",
      "method": "agility"
    }
  },
  {
    "id": "special-the-rock",
    "name": "Bloodline Rules",
    "kind": "action",
    "setId": "season-1-final-boss",
    "rarity": 4,
    "superstarId": "the-rock",
    "rulesText": "Once per match after one of Rock’s non-Finisher Moves is Countered: the Counter resolves, but Rock retains Control, draws 1 and the opponent loses 1 Adrenaline.",
    "special": {
      "type": "retainOnCounter",
      "draw": 1,
      "opponentAdrenaline": -1
    }
  },
  {
    "id": "running-powerslam",
    "name": "Running Powerslam",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "standing-moonsault",
    "name": "Standing Moonsault",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 6,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. If the opponent kicks out, remain in Control and draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "kickoutRetainControlDraw": 1,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "flipping-lariat",
    "name": "Flipping Lariat",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1,
      "strike": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. If another Move already connected this Control sequence, +2 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "priorMoveBonusDamage": 2,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "450-splash",
    "name": "450 Splash",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounded opponent only. If Countered, you are Stunned for 1.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "asai-moonsault",
    "name": "Asai Moonsault",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Opponent ditches 1 page. If Countered, you are Stunned for 1.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ],
    "counterState": "running-aerial"
  },
  {
    "id": "springboard-crossbody",
    "name": "Springboard Crossbody",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. If it connects after a Strike Move in the same Control sequence, draw 2 pages, then ditch 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawThenDiscardSelf",
        "draw": 2,
        "discard": 1,
        "ifAfterMethod": "strike"
      }
    ],
    "counterState": "running-aerial"
  },
  {
    "id": "logan-paul-knockout-punch",
    "name": "One Lucky Punch",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "logan-paul",
    "rarity": 3,
    "rulesText": "Logan Paul-exclusive Trademark. Stun 1. On Connect, search/draw Paulverizer; it costs 2 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Paulverizer",
        "discount": 2
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "logan-paul-paulverizer",
    "name": "Paulverizer",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 11,
    "damage": 13,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "logan-paul",
    "rarity": 4,
    "rulesText": "Logan Paul-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "entrance-logan-paul",
    "name": "The Maverick",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "logan-paul",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-logan-paul",
    "name": "Brass Knuckles",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "logan-paul",
    "rulesText": "Once per match, after Logan connects with a Strike Move, play this card. That Move deals +2 Damage, gains Stun 1 and deals +1 persistent Head damage. After it resolves, end the current Control sequence.",
    "special": {
      "type": "brassKnuckles",
      "bonusDamage": 2,
      "stun": 1,
      "requireMethod": "strike",
      "endControl": true,
      "bodyDamage": {
        "bodyPart": "head",
        "pressure": 1
      }
    },
    "weapon": true
  },
  {
    "id": "stf",
    "name": "STF",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Submission. +4 persistent Leg damage per successful turn. On connect, opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 4
    },
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "sol-ruca-avalanche-x-factor",
    "name": "Avalanche X-Factor",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 11,
    "requirements": {
      "agility": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": "sol-ruca",
    "rarity": 3,
    "rulesText": "Sol Ruca-exclusive Trademark. Grounds opponent. Stun 1. If Sol connected with an Agility Move immediately before this card in the same Control sequence, +2 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "priorConnectedMethodBonus": {
      "method": "agility",
      "damage": 2
    },
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "sol-ruca-sol-snatcher",
    "name": "Sol Snatcher",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "sol-ruca",
    "rarity": 4,
    "rulesText": "Sol Ruca-exclusive Finisher. No Method requirement. Grounds opponent. If Sol successfully Countered a Move earlier during this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "discountAfterCounter": 2,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "entrance-sol-ruca",
    "name": "Good Vibes",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "sol-ruca",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-sol-ruca",
    "name": "No Wipeout",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "sol-ruca",
    "rulesText": "Once per match, when one of Sol's Agility Moves is Countered, prevent any Stun applied to Sol by that card's if-Countered effect and draw 1 page.",
    "special": {
      "type": "noWipeout",
      "draw": 1,
      "method": "agility"
    }
  },
  {
    "id": "chad-gable-chaos-theory",
    "name": "Chaos Theory",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "chad-gable",
    "rarity": 3,
    "rulesText": "Chad Gable-exclusive Trademark. Grounds opponent. If the opponent kicks out, remain in Control.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "kickoutRetainControl": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "chad-gable-ankle-lock",
    "name": "Ankle Lock",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 0,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "chad-gable",
    "rarity": 4,
    "rulesText": "Chad Gable-exclusive Finisher. No Method requirement. Grounded opponent only. Submission. +6 persistent Leg damage per successful turn. On connect, opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "submission": {
      "bodyPart": "legs",
      "pressure": 6
    },
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "entrance-chad-gable",
    "name": "Ready, Willing and Gable",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "chad-gable",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-chad-gable",
    "name": "Shoosh!",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "chad-gable",
    "rulesText": "Once per match, after one of Chad’s Moves is successfully Countered, draw 2 pages and your opponent loses 1 Adrenaline.",
    "special": {
      "type": "moveCounteredDrawDrain",
      "draw": 2,
      "opponentAdrenaline": -1
    }
  },
  {
    "id": "raquel-rodriguez-corkscrew-splash",
    "name": "Corkscrew Splash",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 8,
    "damage": 11,
    "requirements": {
      "strength": 2,
      "agility": 1
    },
    "moveType": "aerial",
    "method": "strength",
    "superstarId": "raquel-rodriguez",
    "rarity": 3,
    "rulesText": "Raquel Rodriguez-exclusive Trademark. Grounded opponent only. If Countered, Raquel is Stunned 1. On Connect: search/draw Tejana Bomb; it costs 1 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Tejana Bomb",
        "discount": 1
      }
    ],
    "counterState": "diving-aerial"
  },
  {
    "id": "raquel-rodriguez-tejana-bomb",
    "name": "Tejana Bomb",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 11,
    "damage": 13,
    "requirements": {},
    "moveType": "powerbomb",
    "method": null,
    "superstarId": "raquel-rodriguez",
    "rarity": 4,
    "rulesText": "Raquel Rodriguez-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-raquel-rodriguez",
    "name": "Big Mami Cool",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "raquel-rodriguez",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Agility Momentum.",
    "preMatchMomentum": {
      "strength": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 0,
    "delayedTurn5": false
  },
  {
    "id": "special-raquel-rodriguez",
    "name": "Judgment Day Backup",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "raquel-rodriguez",
    "rulesText": "Once per match, when Raquel would take 8+ Damage from a Move, reduce that Damage by 1.",
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 8,
      "reduce": 1
    }
  },
  {
    "id": "sol-ruca-springboard-splash",
    "name": "Sol’s Springboard Splash",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "sol-ruca",
    "rarity": 3,
    "rulesText": "Sol Ruca-exclusive Trademark. Grounds opponent. If Sol successfully Countered a Move earlier this Control sequence, draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1,
        "ifCounteredThisControl": true
      }
    ],
    "counterState": "running-aerial"
  },
  {
    "id": "chad-gable-moonsault",
    "name": "Gable’s Moonsault",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "chad-gable",
    "rarity": 3,
    "rulesText": "Chad Gable-exclusive Trademark. Grounded opponent only. On Connect, search/draw Chaos Theory; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Chaos Theory",
        "discount": 1
      }
    ],
    "counterState": "diving-aerial"
  },
  {
    "id": "raquel-rodriguez-big-boot",
    "name": "Raquel’s Big Boot",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "raquel-rodriguez",
    "rarity": 3,
    "rulesText": "Raquel Rodriguez-exclusive Trademark. Grounds opponent. On Connect, opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "tilt-a-whirl-headscissors",
    "name": "Tilt-a-Whirl Headscissors",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "agility": 1,
      "technical": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. May Counter a Body Elevated Move. If used to successfully Counter it, draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "grapple"
    ],
    "drawOnCounterTypes": [
      "grapple"
    ],
    "drawOnCounter": 1,
    "effects": [],
    "counterState": "running-aerial",
    "counterStates": [
      "body-elevated"
    ]
  },
  {
    "id": "619",
    "name": "619",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 9,
    "requirements": {
      "agility": 2,
      "strike": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "allowedSuperstarIds": [
      "rey-mysterio",
      "dominik-mysterio"
    ],
    "rarity": 3,
    "rulesText": "Mysterio family only (Rey Mysterio or Dominik Mysterio). Grounded opponent only. Stun 1. When Rey connects, search/draw West Coast Pop and it costs 1 less this Control sequence. When Dominik connects, search/draw Dominik’s Frog Splash and it costs 1 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "West Coast Pop",
        "discount": 1,
        "ifSuperstarIds": [
          "rey-mysterio"
        ]
      },
      {
        "type": "search",
        "name": "Dominik’s Frog Splash",
        "discount": 1,
        "ifSuperstarIds": [
          "dominik-mysterio"
        ]
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "rey-mysterio-mysterio-express",
    "name": "Mysterio Express",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 8,
    "requirements": {
      "agility": 2,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": "rey-mysterio",
    "rarity": 3,
    "rulesText": "Rey Mysterio-exclusive Trademark. Grounds opponent. If the opponent kicks out, remain in Control.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "kickoutRetainControl": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "rey-mysterio-west-coast-pop",
    "name": "West Coast Pop",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "rey-mysterio",
    "rarity": 4,
    "rulesText": "Rey Mysterio-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after 619 in the same Control sequence, +1 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "619",
      "damage": 1
    },
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-rey-mysterio",
    "name": "Booyaka 619",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "rey-mysterio",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-rey-mysterio",
    "name": "Lucha Libre Legend",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "rey-mysterio",
    "rulesText": "Once per match, after Rey successfully Counters an opponent's Move with an Agility counter-attack, that counter-attack deals +2 Damage and Rey retains Control after it resolves.",
    "special": {
      "type": "luchaLibreLegend",
      "method": "agility",
      "bonusDamage": 2,
      "retainControl": true
    }
  },
  {
    "id": "drop-toe-hold",
    "name": "Drop Toe Hold",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent. May Counter a Leg Extended Move or a Leg-targeting Submission attempt.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control",
    "counterStates": [
      "leg-extended"
    ],
    "counterSubmissionTargets": [
      "legs"
    ]
  },
  {
    "id": "low-blow",
    "name": "Low Blow",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 4,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Stun 1. Opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "three-amigos",
    "name": "Three Amigos",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounds opponent. On connect, gain +2 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 2
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "dominik-mysterio-frog-splash",
    "name": "Dominik’s Frog Splash",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "dominik-mysterio",
    "rarity": 4,
    "rulesText": "Dominik Mysterio-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after 619 in the same Control sequence, +1 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "619",
      "damage": 1
    },
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-dominik-mysterio",
    "name": "Dirty Dom",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "dominik-mysterio",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-dominik-mysterio",
    "name": "Hammer in the Boot",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "dominik-mysterio",
    "rulesText": "Once per match, after one of Dominik’s Moves is successfully Countered, use the hidden hammer: opponent loses 2 Adrenaline and takes +1 persistent Head damage. After that Counter resolves, Dominik regains Control.",
    "special": {
      "type": "hammerInBoot",
      "opponentAdrenaline": -2,
      "regainControl": true,
      "bodyDamage": {
        "bodyPart": "head",
        "pressure": 1
      }
    },
    "weapon": true
  },
  {
    "id": "backstabber",
    "name": "Backstabber",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. May Counter a Diving Aerial Move. When used as a successful Counter, +2 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "aerial"
    ],
    "counterBonusDamage": 2,
    "effects": [],
    "counterState": "rear-control",
    "counterStates": [
      "diving-aerial"
    ]
  },
  {
    "id": "tope-con-hilo",
    "name": "Tope con Hilo",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Playable in-ring. Draw 1 page on connect. If Countered, attacker is Stunned 1.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ],
    "counterState": "running-aerial"
  },
  {
    "id": "penta-the-sacrifice",
    "name": "The Sacrifice",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "penta",
    "rarity": 3,
    "rulesText": "Penta-exclusive. Stun 1. Opponent loses 1 Adrenaline. On connect, search/draw Penta Driver; that searched Penta Driver costs 1 less during this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      },
      {
        "type": "search",
        "name": "Penta Driver",
        "discount": 1
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "penta-driver",
    "name": "Penta Driver",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "penta",
    "rarity": 3,
    "rulesText": "Penta-exclusive Trademark. Grounds opponent. On Connect: search/draw Mexican Destroyer; it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Mexican Destroyer",
        "discount": 3
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "penta-mexican-destroyer",
    "name": "Mexican Destroyer",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "penta",
    "rarity": 4,
    "rulesText": "Penta-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-penta",
    "name": "Cero Miedo",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "penta",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-penta",
    "name": "Fearless Assault",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "penta",
    "rulesText": "Once per match, after Penta connects with an Agility Move, his next Move this Control sequence, if it is a Strike, costs 2 less and deals +2 Damage.",
    "special": {
      "type": "fearlessAssault",
      "afterMethod": "agility",
      "nextMethod": "strike",
      "discount": 2,
      "bonusDamage": 2
    }
  },
  {
    "id": "el-grande-americano-jumping-headbutt",
    "name": "Jumping Headbutt",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strike": 2,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "el-grande-americano",
    "rarity": 3,
    "rulesText": "El Grande Americano-exclusive Trademark. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "el-grande-americano-loaded-mask-headbutt",
    "name": "Loaded Mask Headbutt",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "el-grande-americano",
    "rarity": 4,
    "rulesText": "El Grande Americano-exclusive Finisher. No Method requirement. Grounds opponent. Stun 1. The loaded mask deals +1 persistent Head damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "arm-extended",
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "weapon": true
  },
  {
    "id": "entrance-el-grande-americano",
    "name": "Los Americanos",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "el-grande-americano",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-el-grande-americano",
    "name": "Steel Plate",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "el-grande-americano",
    "rulesText": "Once per match, after El Grande Americano connects with Headbutt or Jumping Headbutt, search/draw Loaded Mask Headbutt. That searched Loaded Mask Headbutt costs 2 less during the current Control sequence.",
    "special": {
      "type": "steelPlate",
      "afterNames": [
        "Headbutt",
        "Jumping Headbutt"
      ],
      "searchName": "Loaded Mask Headbutt",
      "discount": 2
    },
    "weaponSetup": true
  },
  {
    "id": "running-hip-attack",
    "name": "Running Hip Attack",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "uso-splash",
    "name": "Uso Splash",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": null,
    "allowedSuperstarIds": [
      "jey-uso"
    ],
    "rarity": 4,
    "rulesText": "Uso-family Finisher. Currently playable by Jey Uso; Jimmy Uso may share this card when added. No Method requirement. Grounded opponent only. If played immediately after Spear in the same Control sequence, +1 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Spear",
      "damage": 1
    },
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-jey-uso",
    "name": "Main Event Jey",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "jey-uso",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-jey-uso",
    "name": "YEET!",
    "kind": "action",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "jey-uso",
    "rulesText": "Once per match, after Jey connects with Spear, search/draw Uso Splash. That searched Uso Splash costs 3 less during the current Control sequence.",
    "special": {
      "type": "yeetTutor",
      "afterName": "Spear",
      "searchName": "Uso Splash",
      "discount": 3
    }
  },
  {
    "id": "jumping-neckbreaker",
    "name": "Jumping Neckbreaker",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. If played immediately after a Strike Move in the same Control sequence, draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1,
        "ifAfterMethod": "strike"
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "burning-hammer",
    "name": "Burning Hammer",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 2,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "la-knight-bft",
    "name": "BFT",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "la-knight",
    "rarity": 4,
    "rulesText": "LA Knight-exclusive Finisher. No Method requirement. Grounds opponent. If played immediately after Diving Elbow Drop in the same Control sequence, +1 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Diving Elbow Drop",
      "damage": 1
    },
    "counterState": "front-control"
  },
  {
    "id": "entrance-la-knight",
    "name": "Let Me Talk to Ya!",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "la-knight",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-la-knight",
    "name": "YEAH!",
    "kind": "action",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "la-knight",
    "rulesText": "Once per match after LA Knight connects with Diving Elbow Drop: search/draw BFT; it costs 4 less this Control sequence and deals +2 Damage. Draw 2 pages and gain +1 Adrenaline.",
    "special": {
      "type": "yeahTutor",
      "afterName": "Diving Elbow Drop",
      "searchName": "BFT",
      "discount": 4,
      "draw": 2,
      "adrenaline": 1,
      "bonusDamage": 2
    }
  },
  {
    "id": "double-knees",
    "name": "Double Knees",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Stun 1.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "code-red",
    "name": "Code Red",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "alexa-bliss-sister-abigail",
    "name": "Sister Abigail",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2,
      "strike": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "alexa-bliss",
    "rarity": 3,
    "rulesText": "Alexa Bliss-exclusive Trademark. Grounds opponent. Stun 1. On connect, search/draw Twisted Bliss; that searched Twisted Bliss costs 3 less during the current Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Twisted Bliss",
        "discount": 3
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "alexa-bliss-twisted-bliss",
    "name": "Twisted Bliss",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 8,
    "damage": 15,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "alexa-bliss",
    "rarity": 4,
    "rulesText": "Alexa Bliss-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after Sister Abigail in the same Control sequence, +2 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Sister Abigail",
      "damage": 2
    },
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-alexa-bliss",
    "name": "The Goddess",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "alexa-bliss",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-alexa-bliss",
    "name": "Mind Games",
    "kind": "action",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "alexa-bliss",
    "rulesText": "Once per match, after Alexa successfully kicks out of a Pin, draw 1 page and gain +1 Adrenaline.",
    "special": {
      "type": "mindGames",
      "drawOnKickout": 1,
      "adrenalineOnKickout": 1
    }
  },
  {
    "id": "shotgun-dropkick",
    "name": "Shotgun Dropkick",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1. When played by Finn Bálor, on connect search/draw Coup de Grâce; that searched Coup de Grâce costs 1 less during the current Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Coup de Grâce",
        "discount": 3,
        "ifSuperstarIds": [
          "finn-balor"
        ]
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "finn-balor-1916",
    "name": "1916",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "finn-balor",
    "rarity": 3,
    "rulesText": "Finn Bálor-exclusive Trademark. Grounds opponent. On Connect: search/draw Coup de Grâce; it costs 2 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Coup de Grâce",
        "discount": 2
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "finn-balor-coup-de-grace",
    "name": "Coup de Grâce",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "finn-balor",
    "rarity": 4,
    "rulesText": "Finn Bálor-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after Shotgun Dropkick in the same Control sequence, +1 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Shotgun Dropkick",
      "damage": 1
    },
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-finn-balor",
    "name": "The Prince",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "finn-balor",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-finn-balor",
    "name": "Bálor Club",
    "kind": "action",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "finn-balor",
    "rulesText": "Once per match after Finn connects with Sling Blade: search/draw Shotgun Dropkick; it costs 3 less this Control sequence.",
    "special": {
      "type": "balorClubTutor",
      "afterName": "Sling Blade",
      "searchName": "Shotgun Dropkick",
      "discount": 3
    }
  },
  {
    "id": "pump-kick",
    "name": "Pump Kick",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounds opponent. Jade Cargill: On connect, search/draw Jaded and Jade’s next Jaded this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Jaded",
        "ifSuperstarIds": [
          "jade-cargill"
        ]
      },
      {
        "type": "discountNextByName",
        "name": "Jaded",
        "amount": 2,
        "ifSuperstarIds": [
          "jade-cargill"
        ]
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "inverted-ddt",
    "name": "Inverted DDT",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "technical": 1,
      "strike": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [],
    "counterState": "rear-control"
  },
  {
    "id": "octopus-hold",
    "name": "Octopus Hold",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Standing opponent only. Submission. +4 persistent Arm damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 4
    },
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "arms",
    "standingOnly": true
  },
  {
    "id": "danhausen-very-nice-knee-vil",
    "name": "Very Nice, Very Knee-vil",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strike": 2,
      "strength": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "danhausen",
    "rarity": 3,
    "rulesText": "Danhausen-exclusive Trademark. Grounds opponent. Stun 1. On connect: search your Playbook for Triple D and draw it; that Triple D costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Triple D",
        "discount": 3
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "danhausen-triple-d",
    "name": "Triple D",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "danhausen",
    "rarity": 4,
    "rulesText": "Danhausen-exclusive Finisher. No Method requirement. Grounds opponent. +1 Damage if the opponent was already Stunned when this Move connected.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageIfOpponentStunned": 1,
    "counterState": "front-control"
  },
  {
    "id": "entrance-danhausen",
    "name": "Very Nice, Very Evil",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "danhausen",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-danhausen",
    "name": "Jar of Teeth",
    "kind": "action",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "danhausen",
    "rulesText": "Once per match, after Danhausen connects with a Move that grounds the opponent, use the Jar of Teeth: opponent ditches 1 page, loses 1 Adrenaline and takes +1 persistent Head damage; Danhausen draws 1 page. Continue the Control sequence normally.",
    "special": {
      "type": "jarOfTeeth",
      "ditchOpponent": 1,
      "opponentAdrenaline": -1,
      "draw": 1,
      "bodyDamage": {
        "bodyPart": "head",
        "pressure": 1
      }
    },
    "weapon": true
  },
  {
    "id": "cutter",
    "name": "Cutter",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "front-kick",
    "name": "Front Kick",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "agility": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "A fast front kick used to create space and start an athletic offensive sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "snap-suplex",
    "name": "Snap Suplex",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "finlay-roll",
    "name": "Finlay Roll",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "tiffany-stratton-handspring-back-elbow",
    "name": "Handspring Back Elbow",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": "tiffany-stratton",
    "rarity": 3,
    "rulesText": "Tiffany Stratton-exclusive Trademark. Grounds opponent. On Connect: search/draw Prettiest Moonsault Ever; it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "searchOnConnectName": "Prettiest Moonsault Ever",
    "searchOnConnectDiscount": 3,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "tiffany-stratton-prettiest-moonsault-ever",
    "name": "Prettiest Moonsault Ever",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "tiffany-stratton",
    "rarity": 4,
    "rulesText": "Tiffany Stratton-exclusive Finisher. No Method requirement. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-tiffany-stratton",
    "name": "It’s Tiffy Time",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "tiffany-stratton",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-tiffany-stratton",
    "name": "Tiffany Epiphany",
    "kind": "action",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "tiffany-stratton",
    "rulesText": "Once per match during your Control sequence, search your deck for one Strength Move and one Agility Move. Draw the one that best fits the current position and shuffle the other back.",
    "special": {
      "type": "tiffanyEpiphany",
      "methods": [
        "strength",
        "agility"
      ]
    }
  },
  {
    "id": "chelsea-green-im-prettier",
    "name": "I’m Prettier",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "chelsea-green",
    "rarity": 3,
    "rulesText": "Chelsea Green-exclusive Trademark. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Green With Envy",
        "discount": 2
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "chelsea-green-green-with-envy",
    "name": "Green With Envy",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "chelsea-green",
    "rarity": 4,
    "rulesText": "Chelsea Green-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "entrance-chelsea-green",
    "name": "Hot Mess",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "chelsea-green",
    "rulesText": "Pre-Match: Begin with +2 Adrenaline. Your first Counter this match costs 1 less.",
    "preMatchMomentum": {},
    "preMatchAdrenaline": 2,
    "preMatchCounterDiscount": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-chelsea-green",
    "name": "File a Complaint",
    "kind": "action",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "chelsea-green",
    "rulesText": "Once per match during your Control sequence: search/draw a Counter. Your next Counter costs 1 less.",
    "special": {
      "type": "fileComplaint",
      "counterDiscount": 1
    }
  },
  {
    "id": "damian-priest-south-of-heaven",
    "name": "South of Heaven",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "damian-priest",
    "rarity": 3,
    "rulesText": "Damian Priest-exclusive Trademark. Grounds opponent. On Connect: search/draw Hit the Lights; your next Finisher this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "nextFinisherDiscountOnConnect": 2,
    "searchOnConnectName": "Hit the Lights",
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "damian-priest-razors-edge",
    "name": "Priest’s Crucifix Powerbomb",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 8,
    "damage": 13,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "damian-priest",
    "rarity": 3,
    "rulesText": "Damian Priest-exclusive Trademark. Grounds opponent. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "opponentAdrenalineOnConnect": -1,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "damian-priest-hit-the-lights",
    "name": "Hit the Lights",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "damian-priest",
    "rarity": 4,
    "rulesText": "Damian Priest-exclusive Finisher. No Method requirement. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-damian-priest",
    "name": "Rise of the Punisher",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "damian-priest",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-damian-priest",
    "name": "Last Rites",
    "kind": "action",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "damian-priest",
    "rulesText": "Once per match during your Control sequence: search/draw a Trademark or Finisher. Your next Strength Move this Control sequence costs 1 less.",
    "special": {
      "type": "lastRites",
      "strengthDiscount": 1
    }
  },
  {
    "id": "mexican-surfboard",
    "name": "Mexican Surfboard",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only. Submission. +4 persistent Back damage per successful turn.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "back",
      "pressure": 4
    },
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "back"
  },
  {
    "id": "firemans-carry",
    "name": "Fireman’s Carry",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared fundamental takedown.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "leapfrog",
    "name": "Leapfrog",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 2,
    "damage": 0,
    "requirements": {
      "agility": 1
    },
    "moveType": "counter",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "counters": [],
    "rulesText": "Counter a Running Aerial Move. On success, gain Control.",
    "counterState": "running-aerial",
    "counterStates": [
      "running-aerial"
    ]
  },
  {
    "id": "abdominal-stretch",
    "name": "Abdominal Stretch",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 0,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. Submission. +3 persistent Chest damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "chest",
      "pressure": 3
    },
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "back",
    "standingOnly": true
  },
  {
    "id": "punches-in-the-corner",
    "name": "Punches in the Corner",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "opponentAdrenalineOnConnect": -1,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "running-clothesline",
    "name": "Running Clothesline",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared running strike.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "clothesline-over-the-top-rope",
    "name": "Clothesline Over the Top Rope",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Playable in the ring. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "opponentAdrenalineOnConnect": -1,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "bron-breakker-gorilla-press-powerslam",
    "name": "Gorilla Press Powerslam",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "bron-breakker",
    "rarity": 3,
    "rulesText": "Bron Breakker-exclusive Trademark. Grounds opponent. On Connect: search/draw Breakker’s Spear.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "searchOnConnectName": "Breakker’s Spear",
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "bron-breakker-breakkers-spear",
    "name": "Breakker’s Spear",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "bron-breakker",
    "rarity": 4,
    "rulesText": "Bron Breakker-exclusive Finisher. If Bron connected with an Agility Move earlier in this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "discountIfPriorAgility": 2,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "bron-breakker-steiner-recliner",
    "name": "Steiner Recliner",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": "bron-breakker",
    "rarity": 3,
    "rulesText": "Bron Breakker-exclusive. Grounded opponent only. Submission. +6 persistent Back damage per successful turn.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "back",
      "pressure": 6
    },
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "back"
  },
  {
    "id": "entrance-bron-breakker",
    "name": "Breakker Unleashed",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "bron-breakker",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Agility Momentum.",
    "preMatchMomentum": {
      "strength": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 0,
    "delayedTurn5": false
  },
  {
    "id": "special-bron-breakker",
    "name": "Full Speed",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "bron-breakker",
    "rulesText": "Once per match during your Control sequence: your next connected Move this Control sequence deals +2 Damage; if it is an Agility Move, draw 1 page.",
    "special": {
      "type": "fullSpeed",
      "damage": 2,
      "agilityDraw": 1
    }
  },
  {
    "id": "penta-handstand-dropkick",
    "name": "Penta’s Handstand Dropkick",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": "penta",
    "rarity": 3,
    "rulesText": "Penta-exclusive. Grounds opponent. If Penta connected with another Agility Move earlier in this Control sequence, +1 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "priorConnectedMethodBonus": {
      "method": "agility",
      "damage": 1
    },
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "apron-german-suplex",
    "name": "Apron German Suplex",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Opponent loses 1 Adrenaline. Counts as German Suplex for card effects and synergies.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "opponentAdrenalineOnConnect": -1,
    "countsAs": [
      "German Suplex"
    ],
    "effects": [],
    "counterState": "rear-control"
  },
  {
    "id": "corner-clothesline",
    "name": "Corner Clothesline",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "dropkick-to-the-back",
    "name": "Dropkick to the Back",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "agility": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "elbow",
    "name": "Elbow",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. May Counter an Arm Extended Move. If used as a Counter, another Elbow or Punch may Counter it.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "strike"
    ],
    "effects": [],
    "counterState": "arm-extended",
    "counterStates": [
      "arm-extended"
    ],
    "counterExchangeKey": "punch-elbow"
  },
  {
    "id": "running-knees-to-the-back",
    "name": "Running Knees to the Back",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "agility": 1,
      "strike": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "fight-forever",
    "name": "Fight Forever",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "boosterOnly": true,
    "rulesText": "Playable only after Turn 10. Restore 10 HP to both Superstars, up to their starting HP.",
    "playableAfterTurn": 10,
    "effect": {
      "type": "fightForever",
      "healEach": 10
    }
  },
  {
    "id": "flapjack",
    "name": "Flapjack",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "torso-trapped"
  },
  {
    "id": "side-headlock",
    "name": "Side Headlock",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 3,
    "damage": 0,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Submission. +3 persistent Head damage per successful turn.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 3
    },
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "wristlock",
    "name": "Wristlock",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 2,
    "damage": 0,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Submission. +2 persistent Arm damage per successful turn.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 2
    },
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "arms"
  },
  {
    "id": "catch-your-breath",
    "name": "Catch Your Breath",
    "kind": "action",
    "setId": "money-in-the-bank-series-1",
    "rarity": 3,
    "boosterOnly": true,
    "rulesText": "Restore 5 HP to your Superstar, up to starting HP.",
    "effect": {
      "type": "healSelf",
      "amount": 5
    }
  },
  {
    "id": "knee-to-the-gut",
    "name": "Knee to the Gut",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. May Counter a Torso Trapped Move.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "grapple"
    ],
    "effects": [],
    "counterState": "leg-extended",
    "counterStates": [
      "torso-trapped"
    ]
  },
  {
    "id": "throw-into-steel-steps",
    "name": "Throw Into Steel Steps",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "On connect, deal +1 persistent Back damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "back",
      "pressure": 1
    },
    "effects": [],
    "counterState": "body-elevated",
    "weapon": true
  },
  {
    "id": "sleeper-hold",
    "name": "Sleeper Hold",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 4,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Submission. +4 persistent Head damage per successful turn.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "scissors-kick",
    "name": "Scissors Kick",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "senton-splash",
    "name": "Senton Splash",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "spinning-back-kick",
    "name": "Spinning Back Kick",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "throw-into-ringpost",
    "name": "Throw Into Ringpost",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "On connect, deal +1 persistent Head damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "effects": [],
    "counterState": "body-elevated",
    "weapon": true
  },
  {
    "id": "corner-barrage",
    "name": "Corner Barrage",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. If you connected with a Strike earlier in this Control sequence, +2 Damage.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bonusDamageIfStrikeEarlierThisControl": 2,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "drew-mcintyre-glasgow-kiss",
    "name": "Glasgow Kiss",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "drew-mcintyre",
    "rarity": 3,
    "rulesText": "Drew McIntyre-exclusive. On Connect: deal +1 Head body-part damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "counterState": "arm-extended"
  },
  {
    "id": "drew-mcintyre-future-shock-ddt",
    "name": "Future Shock DDT",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 2,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "drew-mcintyre",
    "rarity": 3,
    "rulesText": "Drew McIntyre-exclusive Trademark. Grounds opponent. On Connect: search/draw Claymore; it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "trademark": true,
    "searchOnConnectName": "Claymore",
    "counterState": "front-control",
    "searchOnConnectDiscount": 3
  },
  {
    "id": "drew-mcintyre-claymore",
    "name": "Claymore",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "drew-mcintyre",
    "rarity": 4,
    "rulesText": "Drew McIntyre-exclusive Finisher. Standing opponent only. Grounds opponent. Costs 2 less if the opponent already has Head body-part damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true,
    "discountIfOpponentBodyDamage": {
      "bodyPart": "head",
      "min": 1,
      "amount": 2
    },
    "counterState": "leg-extended"
  },
  {
    "id": "entrance-drew-mcintyre",
    "name": "Scottish Warrior",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "drew-mcintyre",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-drew-mcintyre",
    "name": "Claymore Countdown",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "drew-mcintyre",
    "rulesText": "Once per match during your Control sequence: search/draw Claymore. Your next Claymore this Control sequence costs 2 less.",
    "special": {
      "type": "claymoreCountdown",
      "name": "Claymore",
      "discount": 2
    }
  },
  {
    "id": "randy-orton-draping-ddt",
    "name": "Draping DDT",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "randy-orton",
    "rarity": 3,
    "rulesText": "Randy Orton-exclusive Trademark. Grounds opponent. On Connect: search/draw RKO, it costs 3 less this Control sequence, and deal +1 Head body-part damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "trademark": true,
    "searchOnConnectName": "RKO",
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "counterState": "front-control",
    "searchOnConnectDiscount": 3
  },
  {
    "id": "randy-orton-rko",
    "name": "RKO",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 9,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "randy-orton",
    "rarity": 4,
    "rulesText": "Randy Orton-exclusive Finisher. Standing opponent only. Grounds opponent. If Randy connected with a Technical Move earlier this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true,
    "discountIfMethodConnectedThisControl": {
      "method": "technical",
      "amount": 2
    },
    "counterState": "front-control"
  },
  {
    "id": "randy-orton-punt-kick",
    "name": "Punt Kick",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 8,
    "damage": 13,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "randy-orton",
    "rarity": 4,
    "rulesText": "Randy Orton-exclusive Finisher. Grounded opponent only. On Connect: deal +1 Head body-part damage and opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "opponentAdrenalineOnConnect": -1,
    "counterState": "leg-extended"
  },
  {
    "id": "entrance-randy-orton",
    "name": "Voices",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "randy-orton",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-randy-orton",
    "name": "Outta Nowhere",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "randy-orton",
    "rulesText": "Once per match, when the opponent attempts a Move: Randy may play RKO from hand as a Counter. If he does, RKO costs 5 less.",
    "special": {
      "type": "outtaNowhere",
      "name": "RKO",
      "discount": 5
    }
  },
  {
    "id": "sami-zayn-exploder-turnbuckle",
    "name": "Exploder Suplex Into Turnbuckle",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "sami-zayn",
    "rarity": 3,
    "rulesText": "Sami Zayn-exclusive setup. Grounds opponent. On Connect: search/draw Helluva Kick; it costs 4 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Helluva Kick",
        "discount": 4
      }
    ],
    "standingOnly": true,
    "counterState": "torso-trapped"
  },
  {
    "id": "sami-zayn-blue-thunder-bomb",
    "name": "Blue Thunder Bomb",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 6,
    "damage": 11,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "sami-zayn",
    "rarity": 3,
    "rulesText": "Sami Zayn-exclusive Trademark. Standing opponent only. Grounds opponent. On Connect: draw 1. If Sami has less HP than his opponent, also gain +1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      },
      {
        "type": "gainAdrenalineIfBehind",
        "amount": 1
      }
    ],
    "trademark": true,
    "standingOnly": true,
    "counterState": "body-elevated"
  },
  {
    "id": "sami-zayn-helluva-kick",
    "name": "Helluva Kick",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 8,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "sami-zayn",
    "rarity": 4,
    "rulesText": "Sami Zayn-exclusive Finisher. Standing opponent only. Grounds opponent. If Exploder Suplex Into Turnbuckle connected earlier this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true,
    "counterState": "leg-extended"
  },
  {
    "id": "entrance-sami-zayn",
    "name": "Worlds Apart",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "sami-zayn",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-sami-zayn",
    "name": "Never Say Die",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "sami-zayn",
    "rulesText": "Once per match when Sami falls to 40% HP or less: draw 3 pages and gain +2 Adrenaline.",
    "special": {
      "type": "neverSayDie",
      "hpPct": 0.4,
      "draw": 3,
      "adrenaline": 2
    }
  },
  {
    "id": "jacob-fatu-pop-up-samoan-drop",
    "name": "Pop-Up Samoan Drop",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "jacob-fatu",
    "rarity": 3,
    "rulesText": "Jacob Fatu-exclusive Trademark. Standing opponent only. Grounds opponent. On Connect: search/draw Moonsault; Jacob’s next Moonsault this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Moonsault",
        "amount": 2
      }
    ],
    "trademark": true,
    "standingOnly": true,
    "searchOnConnectName": "Moonsault",
    "counterState": "torso-trapped"
  },
  {
    "id": "jacob-fatu-moonsault",
    "name": "Moonsault",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "jacob-fatu",
    "rarity": 4,
    "rulesText": "Jacob Fatu-exclusive Finisher. Grounded opponent only. If Pop-Up Samoan Drop connected earlier this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "counterState": "diving-aerial"
  },
  {
    "id": "jacob-fatu-tongan-death-grip",
    "name": "Tongan Death Grip",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 8,
    "damage": 0,
    "requirements": {},
    "moveType": "submission",
    "method": "strength",
    "superstarId": "jacob-fatu",
    "rarity": 4,
    "rulesText": "Jacob Fatu-exclusive Submission Finisher. Standing opponent only. +5 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true,
    "submission": {
      "bodyPart": "head",
      "pressure": 5
    },
    "counterState": "rear-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "entrance-jacob-fatu",
    "name": "Samoan Werewolf",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "jacob-fatu",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-jacob-fatu",
    "name": "Built Different",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "jacob-fatu",
    "rulesText": "Once per match, after Jacob takes 8 or more Damage from a single Move: gain +1 Adrenaline.",
    "special": {
      "type": "builtDifferent",
      "minDamage": 8,
      "draw": 0,
      "adrenaline": 1
    }
  },
  {
    "id": "solo-sikoa-spinning-solo",
    "name": "Spinning Solo",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "solo-sikoa",
    "rarity": 3,
    "rulesText": "Solo Sikoa-exclusive Trademark. Standing opponent only. Grounds opponent. On Connect: search/draw Samoan Spike; Solo’s next Samoan Spike this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "standingOnly": true,
    "searchOnConnectName": "Samoan Spike",
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Samoan Spike",
        "amount": 2
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "solo-sikoa-samoan-spike",
    "name": "Samoan Spike",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "solo-sikoa",
    "rarity": 4,
    "rulesText": "Solo Sikoa-exclusive Finisher. Standing opponent only. Grounds opponent. On Connect: deal +1 Head body-part damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "standingOnly": true,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "entrance-solo-sikoa",
    "name": "Taking Over",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "solo-sikoa",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-solo-sikoa",
    "name": "Sole Survivor",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "solo-sikoa",
    "rulesText": "Once per match, after Solo loses Control: draw 2 cards and gain +1 Adrenaline.",
    "special": {
      "type": "soleSurvivor",
      "draw": 2,
      "adrenaline": 1
    }
  },
  {
    "id": "jade-cargill-jaded",
    "name": "Jaded",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "jade-cargill",
    "rarity": 4,
    "rulesText": "Jade Cargill-exclusive Finisher. Standing opponent only. Grounds opponent. Pump Kick can reduce this Move’s cost by 2 during the same Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "standingOnly": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-jade-cargill",
    "name": "A Storm Is Coming",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "jade-cargill",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-jade-cargill",
    "name": "Superhuman",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "jade-cargill",
    "rulesText": "Once per match, after Jade connects with a Strength Move: draw 1 card and her next Move this Control sequence deals +2 Damage.",
    "special": {
      "type": "superhuman",
      "afterMethod": "strength",
      "draw": 1,
      "bonusDamage": 2
    }
  },
  {
    "id": "nia-jax-avalanche-samoan-drop",
    "name": "Avalanche Samoan Drop",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "nia-jax",
    "rarity": 3,
    "rulesText": "Nia Jax-exclusive Trademark. Standing opponent only. Grounds opponent. On Connect: search/draw Annihilator; Nia’s next Annihilator this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "standingOnly": true,
    "searchOnConnectName": "Annihilator",
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Annihilator",
        "amount": 2
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "nia-jax-annihilator",
    "name": "Annihilator",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "strike",
    "method": "strength",
    "superstarId": "nia-jax",
    "rarity": 4,
    "rulesText": "Nia Jax-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-nia-jax",
    "name": "Irresistible Force",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "nia-jax",
    "rulesText": "Pre-Match: Begin with +2 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 2
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-nia-jax",
    "name": "Not Like Most",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "nia-jax",
    "rulesText": "Once per match, when Nia would take 10 or more Damage from a single Move: reduce that Damage by 4 and gain +1 Adrenaline.",
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 10,
      "reduce": 4,
      "adrenaline": 1
    }
  },
  {
    "id": "shoulder-block",
    "name": "Shoulder Block",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "strength": 1
    },
    "moveType": "strike",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "standingOnly": true,
    "counterState": "torso-trapped"
  },
  {
    "id": "shining-wizard",
    "name": "Shining Wizard",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. On connect, deal +1 Head body-part damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "effects": [],
    "boosterOnly": true,
    "counterState": "leg-extended"
  },
  {
    "id": "double-underhook-facebuster",
    "name": "Double Underhook Facebuster",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "standingOnly": true,
    "counterState": "front-control"
  },
  {
    "id": "steel-chair-to-the-back",
    "name": "Steel Chair to the Back",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. On connect, deal +1 persistent Back damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "back",
      "pressure": 1
    },
    "effects": [],
    "boosterOnly": true,
    "counterState": "arm-extended",
    "weapon": true
  },
  {
    "id": "spanish-fly",
    "name": "Spanish Fly",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "standingOnly": true,
    "counterState": "running-aerial"
  },
  {
    "id": "second-rope-leg-drop",
    "name": "2nd Rope Leg Drop",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "counterState": "diving-aerial"
  },
  {
    "id": "flair-chop",
    "name": "Flair Chop",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "allowedSuperstarIds": [
      "charlotte-flair"
    ],
    "rarity": 3,
    "rulesText": "Flair Family Trademark. Currently playable by Charlotte Flair. On connect, deal +1 Chest body-part damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "bodyDamage": {
      "bodyPart": "chest",
      "pressure": 1
    },
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "elbow-to-back-of-head",
    "name": "Elbow to the Back of the Head",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. On connect, deal +1 Head body-part damage. This impact damage is one-shot and cannot be maintained as a hold.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "effects": [],
    "boosterOnly": true,
    "counterState": "arm-extended"
  },
  {
    "id": "hip-toss",
    "name": "Hip Toss",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 2,
    "damage": 2,
    "requirements": {},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. May Counter a Front Control Move or a Back-targeting Submission attempt. Grounds opponent.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "grapple"
    ],
    "effects": [],
    "boosterOnly": true,
    "counterState": "front-control",
    "counterStates": [
      "front-control"
    ],
    "counterSubmissionTargets": [
      "back"
    ]
  },
  {
    "id": "leg-drop",
    "name": "Leg Drop",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "agility": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "counterState": "leg-extended"
  },
  {
    "id": "choke-on-the-ropes",
    "name": "Choke on the Ropes",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 3,
    "damage": 0,
    "requirements": {
      "strike": 1
    },
    "moveType": "submission",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. Submission. +3 persistent Head damage per successful turn.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 3
    },
    "effects": [],
    "boosterOnly": true,
    "counterState": "front-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "chops-in-the-corner",
    "name": "Chops in the Corner",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 4,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Standing opponent only. On connect, deal +1 Chest body-part damage. This impact damage is one-shot and cannot be maintained as a hold.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "chest",
      "pressure": 1
    },
    "effects": [],
    "boosterOnly": true,
    "counterState": "arm-extended"
  },
  {
    "id": "goldberg-military-press-powerslam",
    "name": "Military Press Powerslam",
    "kind": "move",
    "setId": "season-2-whos-next",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "goldberg",
    "rarity": 3,
    "rulesText": "Goldberg-exclusive Trademark. Standing opponent only. Grounds opponent. On connect, gain 1 additional Streak counter (maximum 3), then search/draw Goldberg’s Spear; it costs 2 less this Control sequence.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "gainStreak",
        "amount": 1,
        "max": 3
      },
      {
        "type": "search",
        "name": "Goldberg’s Spear",
        "discount": 2
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "goldberg-spear",
    "name": "Goldberg’s Spear",
    "kind": "move",
    "setId": "season-2-whos-next",
    "cost": 8,
    "damage": 13,
    "requirements": {
      "strength": 2,
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "goldberg",
    "rarity": 3,
    "rulesText": "Goldberg-exclusive Trademark. Standing opponent only. Grounds opponent. On connect, search/draw Jackhammer and it costs 3 less this Control sequence. If Goldberg had 2+ Streak counters before playing this Move, the opponent loses 1 Adrenaline.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Jackhammer",
        "discount": 3
      },
      {
        "type": "loseOpponentAdrenalineIfStreak",
        "min": 2,
        "amount": 1
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "goldberg-jackhammer",
    "name": "Jackhammer",
    "kind": "move",
    "setId": "season-2-whos-next",
    "cost": 12,
    "damage": 19,
    "requirements": {},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "goldberg",
    "rarity": 4,
    "rulesText": "Goldberg-exclusive Finisher. Standing opponent only. Grounds opponent. If Goldberg connected with Goldberg’s Spear earlier in this Control sequence, Jackhammer costs 3 less.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-goldberg",
    "name": "Who’s Next?",
    "kind": "entrance",
    "setId": "season-2-whos-next",
    "rarity": 4,
    "superstarId": "goldberg",
    "rulesText": "Pre-Match: Begin with +2 Strength Momentum, +2 Strike Momentum and +2 Adrenaline.",
    "preMatchMomentum": {
      "strength": 2,
      "strike": 2
    },
    "preMatchAdrenaline": 2,
    "delayedTurn5": false
  },
  {
    "id": "special-goldberg",
    "name": "173–0",
    "kind": "action",
    "setId": "season-2-whos-next",
    "rarity": 4,
    "superstarId": "goldberg",
    "rulesText": "Once per match, when one of Goldberg’s Moves is Countered and he would lose Control: the Counter still resolves normally, Goldberg retains Control, keeps all Streak counters, gains +1 Adrenaline and draws 1 page.",
    "special": {
      "type": "goldberg173",
      "adrenaline": 1,
      "draw": 1,
      "retainControl": true,
      "preserveStreak": true
    }
  },
  {
    "id": "knees-up",
    "name": "Knees Up",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter a Diving Aerial Move.",
    "effects": [],
    "counterState": "diving-aerial",
    "counterStates": [
      "diving-aerial"
    ]
  },
  {
    "id": "dodge",
    "name": "Dodge",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": null,
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter an Arm Extended, Leg Extended, Running Aerial or Diving Aerial Move.",
    "effects": [],
    "counterState": "arm-extended",
    "counterStates": [
      "arm-extended",
      "leg-extended",
      "running-aerial",
      "diving-aerial"
    ]
  },
  {
    "id": "block",
    "name": "Block",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": null,
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter an Arm Extended or Leg Extended Move.",
    "effects": [],
    "counterState": "arm-extended",
    "counterStates": [
      "arm-extended",
      "leg-extended"
    ]
  },
  {
    "id": "up-and-over",
    "name": "Up and Over",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": null,
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter a Running Aerial Move.",
    "effects": [],
    "counterState": "running-aerial",
    "counterStates": [
      "running-aerial"
    ]
  },
  {
    "id": "tornado-ddt",
    "name": "Tornado DDT",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Deals +1 persistent Head damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control",
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    }
  },
  {
    "id": "standing-switch",
    "name": "Standing Switch",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": null,
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter a Rear Control or Torso Trapped Move. Can also counter a Back-targeting Submission attempt.",
    "effects": [],
    "counterState": "rear-control",
    "counterStates": [
      "torso-trapped",
      "rear-control"
    ],
    "counterSubmissionTargets": [
      "back"
    ]
  },
  {
    "id": "rollover-counter",
    "name": "Rollover Counter",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": null,
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter a Body Elevated or Front Control Move. Can also counter Arm-, Leg- or Back-targeting Submission attempts.",
    "effects": [],
    "counterState": "front-control",
    "counterStates": [
      "body-elevated",
      "front-control"
    ],
    "counterSubmissionTargets": [
      "arms",
      "legs",
      "back"
    ]
  },
  {
    "id": "backflip-counter",
    "name": "Backflip Counter",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": null,
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter a Diving Aerial or Body Elevated Move.",
    "effects": [],
    "counterState": "diving-aerial",
    "counterStates": [
      "diving-aerial",
      "body-elevated"
    ]
  },
  {
    "id": "catch-the-foot",
    "name": "Catch the Foot",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 1,
    "damage": 0,
    "requirements": {},
    "moveType": "counter",
    "method": null,
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "rulesText": "Counter a Leg Extended Move or a Leg-targeting Submission attempt.",
    "effects": [],
    "counterState": "leg-extended",
    "counterStates": [
      "leg-extended"
    ],
    "counterSubmissionTargets": [
      "legs"
    ]
  },
  {
    "id": "arm-drag-counter",
    "name": "Arm Drag Counter",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Counter a Front Control Move or an Arm-targeting Submission attempt. If used as a Counter, this becomes a counter-attack and grounds the opponent on Connect.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control",
    "counterStates": [
      "front-control"
    ],
    "counterSubmissionTargets": [
      "arms"
    ]
  },
  {
    "id": "jawbreaker",
    "name": "Jawbreaker",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Counter a Front Control or Rear Control Move, or a Neck / Head-targeting Submission attempt. If used as a Counter, this becomes a counter-attack.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control",
    "counterStates": [
      "front-control",
      "rear-control"
    ],
    "counterSubmissionTargets": [
      "neck-head"
    ]
  },
  {
    "id": "bayley-diving-elbow",
    "name": "Bayley’s Diving Elbow",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "bayley",
    "rarity": 3,
    "rulesText": "Bayley-exclusive. Grounded opponent only. On Connect, draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ],
    "counterState": "diving-aerial"
  },
  {
    "id": "bayley-to-belly",
    "name": "Bayley-to-Belly",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "bayley",
    "rarity": 3,
    "rulesText": "Bayley-exclusive. Ground opponent. On Connect, search/draw Rose Plant; it costs 4 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Rose Plant",
        "discount": 4
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "mankind-have-a-nice-day",
    "name": "Have a Nice Day!",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "cost": 0,
    "superstarId": "mankind",
    "rarity": 3,
    "rulesText": "Mankind-exclusive Action. Play while Mankind is at 50% HP or less. Draw 2 pages, then ditch 1.",
    "playCondition": {
      "selfHpAtOrBelowPct": 0.5
    },
    "effect": {
      "type": "drawThenDiscardSelf",
      "draw": 2,
      "discard": 1
    }
  },
  {
    "id": "hulk-hogan-whatcha-gonna-do",
    "name": "Whatcha Gonna Do?",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "cost": 0,
    "superstarId": "hulk-hogan",
    "rarity": 3,
    "rulesText": "Hogan-exclusive Action. Play while Hogan is at 50% HP or less. Look at the top 5 pages of your Playbook; take a Hogan Move into hand and put the rest on the bottom.",
    "playCondition": {
      "selfHpAtOrBelowPct": 0.5
    },
    "effect": {
      "type": "topDeckTutor",
      "look": 5,
      "superstarMove": true
    }
  },
  {
    "id": "andre-the-giant-headbutt",
    "name": "André’s Headbutt",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "andre-the-giant",
    "rarity": 3,
    "rulesText": "André-exclusive Trademark. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "randy-savage-cream-of-the-crop",
    "name": "Cream of the Crop",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "cost": 0,
    "superstarId": "randy-savage",
    "rarity": 3,
    "rulesText": "Savage-exclusive Action. Look at the top 5 pages of your Playbook; take an Agility Move into hand and put the rest on the bottom.",
    "effect": {
      "type": "topDeckTutor",
      "look": 5,
      "method": "agility"
    }
  },
  {
    "id": "kane-flying-clothesline",
    "name": "Kane’s Flying Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "aerial",
    "method": "strike",
    "superstarId": "kane",
    "rarity": 3,
    "rulesText": "Kane-exclusive Trademark. Grounds opponent. On Connect: search/draw Chokeslam From Hell; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Chokeslam From Hell",
        "discount": 1
      }
    ],
    "counterState": "running-aerial"
  },
  {
    "id": "the-undertaker-running-big-boot",
    "name": "Undertaker’s Running Big Boot",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "the-undertaker",
    "rarity": 3,
    "rulesText": "Undertaker-exclusive Trademark. Ground opponent. Snake Eyes can give this Move +2 Damage this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "ultimate-warrior-clothesline",
    "name": "Warrior’s Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "ultimate-warrior",
    "rarity": 3,
    "rulesText": "Warrior-exclusive Trademark. Ground opponent. On Connect: Warrior's Gorilla Press Slam costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Warrior's Gorilla Press Slam",
        "amount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "stone-cold-give-me-a-hell-yeah",
    "name": "Give Me a Hell Yeah!",
    "kind": "action",
    "setId": "hall-of-fame-series-1",
    "cost": 0,
    "superstarId": "stone-cold-steve-austin",
    "rarity": 3,
    "rulesText": "Austin-exclusive Action. Play after Austin connected with a Strike Move this Control sequence. Draw 1 page, then ditch 1.",
    "playCondition": {
      "afterConnectedMethod": "strike"
    },
    "effect": {
      "type": "drawThenDiscardSelf",
      "draw": 1,
      "discard": 1
    }
  },
  {
    "id": "bayley-ding-dong-hello",
    "name": "Ding Dong! Hello!",
    "kind": "action",
    "setId": "evolution-series-1",
    "cost": 0,
    "superstarId": "bayley",
    "rarity": 3,
    "rulesText": "Bayley-exclusive Action. Search/draw Bayley-to-Belly or Bayley’s Diving Elbow; the chosen Move costs 1 less this Control sequence.",
    "effect": {
      "type": "searchChoice",
      "names": [
        "Bayley-to-Belly",
        "Bayley’s Diving Elbow"
      ],
      "discount": 1
    }
  },
  {
    "id": "paige-superkick",
    "name": "Paige’s Superkick",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "paige",
    "rarity": 3,
    "rulesText": "Paige-exclusive Trademark. Ground opponent. On Connect: Paige Turner costs 2 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Paige Turner",
        "amount": 2
      }
    ],
    "counterState": "leg-extended"
  },
  {
    "id": "stephanie-vaquer-dragon-screw",
    "name": "Stephanie’s Dragon Screw",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "stephanie-vaquer",
    "rarity": 3,
    "rulesText": "Vaquer-exclusive Trademark. On Connect: her next Technical Move costs 1 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discountNextMethod",
        "method": "technical",
        "amount": 1
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "charlotte-flair-spear",
    "name": "Charlotte’s Spear",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "charlotte-flair",
    "rarity": 3,
    "rulesText": "Charlotte-exclusive Trademark. Ground opponent. On Connect: search/draw Natural Selection; it costs 2 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Natural Selection",
        "discount": 2
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "rhea-ripley-mamis-always-on-top",
    "name": "Mami’s Always on Top",
    "kind": "action",
    "setId": "evolution-series-1",
    "cost": 0,
    "superstarId": "rhea-ripley",
    "rarity": 3,
    "rulesText": "Rhea-exclusive Action. Play while the opponent is grounded. Search/draw Electric Chair Drop or Prism Trap.",
    "playCondition": {
      "opponentGrounded": true
    },
    "effect": {
      "type": "searchChoice",
      "names": [
        "Prism Trap",
        "Electric Chair Drop"
      ],
      "discount": 0
    }
  },
  {
    "id": "becky-lynch-bexploder",
    "name": "Bexploder",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "becky-lynch",
    "rarity": 3,
    "rulesText": "Becky-exclusive Trademark. Ground opponent. On Connect: search/draw Dis-arm-her; it costs 2 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Dis-arm-her",
        "discount": 2
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "cody-rhodes-what-do-you-want-to-talk-about",
    "name": "What Do You Want to Talk About?",
    "kind": "action",
    "setId": "summerslam-series-1",
    "cost": 0,
    "superstarId": "cody-rhodes",
    "rarity": 3,
    "rulesText": "Cody-exclusive Action. Look at the top 4 pages of your Playbook; take a Cody-exclusive card into hand and put the rest on the bottom.",
    "effect": {
      "type": "topDeckTutor",
      "look": 4,
      "exclusiveSuperstar": true
    }
  },
  {
    "id": "oba-femi-running-elbow",
    "name": "Oba’s Running Elbow",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "oba-femi",
    "rarity": 3,
    "rulesText": "Oba Femi-exclusive Trademark. A crushing running elbow.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "brock-lesnar-eat-sleep-conquer-repeat",
    "name": "Eat. Sleep. Conquer. Repeat.",
    "kind": "action",
    "setId": "summerslam-series-1",
    "cost": 0,
    "superstarId": "brock-lesnar",
    "rarity": 3,
    "rulesText": "Brock-exclusive Action. Play after Brock’s German connected this Control sequence. Draw 1 page, then choose 1 page from your hand to ditch.",
    "playCondition": {
      "afterConnectedCard": "Brock’s German"
    },
    "effect": {
      "type": "drawThenDiscardSelf",
      "draw": 1,
      "discard": 1
    }
  },
  {
    "id": "once-too-often",
    "name": "Once Too Often",
    "kind": "action",
    "setId": "summerslam-series-1",
    "cost": 0,
    "rarity": 2,
    "universalBooster": true,
    "defensiveOnly": true,
    "oneUse": true,
    "rulesText": "Reactive one-use Action. When your opponent plays a Move they have already connected with earlier this match, play this in the Counter window. Reverse that repeated Move and gain Control. This copy stays out of play after use.",
    "effect": {
      "type": "onceTooOften"
    }
  },
  {
    "id": "manager-paul-heyman",
    "name": "Paul Heyman",
    "kind": "manager",
    "setId": "raw-series-1",
    "rarity": 4,
    "boosterOnly": true,
    "allowedSuperstarIds": [
      "brock-lesnar",
      "roman-reigns"
    ],
    "rulesText": "Brock Lesnar or Roman Reigns only. When Paul Heyman enters play, search/draw 1 non-Finisher Superstar-exclusive Move. Once per match, after one of your Superstar-exclusive Moves is successfully Countered, draw 1 page.",
    "effect": {
      "type": "paulHeymanManager",
      "counteredExclusiveDraw": 1
    }
  },
  {
    "id": "my-name-is-paul-heyman",
    "name": "My Name Is Paul Heyman",
    "kind": "action",
    "setId": "survivor-series-series-1",
    "cost": 2,
    "rarity": 3,
    "boosterOnly": true,
    "oneUse": true,
    "rulesText": "One-use Action. Look at the top 5 pages of your Playbook. Put 1 Move or Action from among them into your hand and put the rest on the bottom. If the card taken is Superstar-exclusive to your Superstar, gain +1 Adrenaline.",
    "effect": {
      "type": "paulHeymanPromo",
      "look": 5,
      "exclusiveAdrenaline": 1
    }
  },

  {
    "id": "kevin-owens-avalanche-fishermans-buster",
    "name": "Avalanche Fisherman’s Buster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 14,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kevin-owens",
    "rarity": 3,
    "rulesText": "Kevin Owens-exclusive Trademark. Grounds opponent. If Kevin connected with a Strike earlier this Control sequence, this costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "discountIfMethodConnectedThisControl": {
      "method": "strike",
      "amount": 2
    },
    "counterState": "body-elevated"
  },
  {
    "id": "kevin-owens-swanton-bomb",
    "name": "KO’s Swanton Bomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "kevin-owens",
    "rarity": 3,
    "rulesText": "Kevin Owens-exclusive Trademark. Grounded opponent only. If a Strength Move connected earlier this Control sequence, this deals +2 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "bonusDamageIfMethodConnectedThisControl": {
      "method": "strength",
      "damage": 2
    },
    "counterState": "diving-aerial"
  },
  {
    "id": "trash-can-to-the-back",
    "name": "Trash Can to the Back",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "weapon": true,
    "rulesText": "Shared Weapon. On connect, deal +1 persistent Back damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "bodyDamage": {
      "bodyPart": "back",
      "pressure": 1
    },
    "counterState": "arm-extended"
  },
  {
    "id": "chair-to-the-gut",
    "name": "Chair to the Gut",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "weapon": true,
    "rulesText": "Shared Weapon. On connect, your next Grapple this Control sequence costs 1 less.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discountNextMoveType",
        "moveType": "grapple",
        "amount": 1
      }
    ],
    "counterState": "arm-extended"
  },
  {
    "id": "splash",
    "name": "Splash",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "aerial",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },

  {
    "id": "leg-lariat",
    "name": "Leg Lariat",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Shared. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  },
  {
    "id": "stomp-to-the-arm",
    "name": "Stomp to the Arm",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared. Grounded opponent only. On connect, deal +1 persistent Arm damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "arms",
      "pressure": 1
    },
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "top-rope-splash",
    "name": "Top Rope Splash",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Shared. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "kick-to-the-back",
    "name": "Kick to the Back",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "rear-control"
  },
  {
    "id": "reverse-chin-lock",
    "name": "Reverse Chin Lock",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 3,
    "damage": 0,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared. Grounded opponent only. Submission. +3 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 3
    },
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "neck-head"
  },
  {
    "id": "death-valley-driver",
    "name": "Death Valley Driver",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 3,
    "boosterOnly": true,
    "rulesText": "Shared. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "leg-kick",
    "name": "Leg Kick",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared. On connect, deal +1 persistent Leg damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "legs",
      "pressure": 1
    },
    "effects": [],
    "counterState": "leg-extended"
  },

  {
    "id": "wheelbarrow-suplex",
    "name": "Wheelbarrow Suplex",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Shared. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "hangman-armbar",
    "name": "Hangman Armbar",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 3,
    "damage": 0,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared. Standing opponent only. Submission. +3 persistent Arm damage per successful turn.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 3
    },
    "effects": [],
    "counterState": "arm-extended",
    "submissionTarget": "arms"
  },
  {
    "id": "andre-the-giant-choke",
    "name": "André’s Choke",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "andre-the-giant",
    "rarity": 3,
    "rulesText": "André-exclusive Trademark. On Connect: opponent loses 1 Adrenaline, then search/draw André’s Bear Hug.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      },
      {
        "type": "search",
        "name": "André’s Bear Hug",
        "discount": 0
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "andre-the-giant-bear-hug",
    "name": "André’s Bear Hug",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 7,
    "damage": 0,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": "andre-the-giant",
    "rarity": 3,
    "rulesText": "André-exclusive Trademark. Standing opponent only. Submission. +6 persistent Chest damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "submission": {
      "bodyPart": "chest",
      "pressure": 6
    },
    "effects": [],
    "counterState": "torso-trapped",
    "submissionTarget": "back",
    "standingOnly": true
  },
  {
    "id": "test-of-strength",
    "name": "Test of Strength",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "randy-savage-machos-double-axe-handle",
    "name": "Macho’s Double Axe Handle",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "randy-savage",
    "rarity": 3,
    "rulesText": "Savage-exclusive Trademark. Grounds opponent. On Connect: gain +1 Adrenaline, then search/draw Flying Elbow Drop; it costs 3 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 1
      },
      {
        "type": "search",
        "name": "Flying Elbow Drop",
        "discount": 3
      }
    ],
    "counterState": "diving-aerial"
  },

  {
    "id": "european-uppercut",
    "name": "European Uppercut",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "No additional effect.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "front-control"
  },
  {
    "id": "joe-hendry-freak-of-nature",
    "name": "Freak of Nature",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "joe-hendry",
    "rarity": 3,
    "rulesText": "Joe Hendry-exclusive Trademark. Grounds opponent. On Connect: search/draw Standing Ovation; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Standing Ovation",
        "discount": 1
      }
    ],
    "counterState": "torso-trapped"
  },
  {
    "id": "joe-hendry-hendry-slam",
    "name": "Hendry Slam",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "joe-hendry",
    "rarity": 3,
    "rulesText": "Joe Hendry-exclusive Trademark. Grounds opponent. On Connect: draw 1 page, then ditch 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "drawThenDiscardSelf",
        "draw": 1,
        "discard": 1
      }
    ],
    "counterState": "body-elevated"
  },
  {
    "id": "joe-hendry-hendry-lock",
    "name": "Hendry Lock",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "joe-hendry",
    "rarity": 3,
    "rulesText": "Joe Hendry-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Leg damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "submission": {
      "bodyPart": "legs",
      "pressure": 5
    },
    "effects": [],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "joe-hendry-standing-ovation",
    "name": "Standing Ovation",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "joe-hendry",
    "rarity": 4,
    "rulesText": "Joe Hendry-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-joe-hendry",
    "name": "Say His Name",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "joe-hendry",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-joe-hendry",
    "name": "I Believe in Joe Hendry",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "joe-hendry",
    "rulesText": "Once per match during your Control sequence: search/draw one Joe Hendry-exclusive Trademark; it costs 1 less this Control sequence.",
    "special": {
      "type": "joeBelieve",
      "discount": 1
    }
  },
  {
    "id": "roxanne-perez-russian-leg-sweep",
    "name": "Roxanne’s Russian Leg Sweep",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "roxanne-perez",
    "rarity": 3,
    "rulesText": "Roxanne Perez-exclusive Trademark. Grounds opponent. On Connect: search/draw Rok-Lock; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Rok-Lock",
        "discount": 1
      }
    ],
    "counterState": "front-control"
  },
  {
    "id": "roxanne-perez-meteora",
    "name": "Roxanne’s Meteora",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "roxanne-perez",
    "rarity": 3,
    "rulesText": "Roxanne Perez-exclusive Trademark. Grounds opponent. On Connect: search/draw Pop Rox; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Pop Rox",
        "discount": 1
      }
    ],
    "counterState": "running-aerial"
  },
  {
    "id": "roxanne-perez-rok-lock",
    "name": "Rok-Lock",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "roxanne-perez",
    "rarity": 3,
    "rulesText": "Roxanne Perez-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "submission": {
      "bodyPart": "head",
      "pressure": 5
    },
    "effects": [],
    "counterState": "front-control",
    "submissionTarget": "head"
  },
  {
    "id": "roxanne-perez-pop-rox",
    "name": "Pop Rox",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "roxanne-perez",
    "rarity": 4,
    "rulesText": "Roxanne Perez-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-roxanne-perez",
    "name": "All Fall Down",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "roxanne-perez",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-roxanne-perez",
    "name": "The Prodigy",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "roxanne-perez",
    "rulesText": "Once per match during your Control sequence: search/draw one shared Agility or Technical Move with printed Cost 4 or less; it costs 1 less this Control sequence.",
    "special": {
      "type": "roxanneProdigy",
      "maxCost": 4,
      "methods": ["agility", "technical"],
      "discount": 1
    }
  },

  {
    "id": "austin-theory-ataxia",
    "name": "Ataxia",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"strength": 2},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "austin-theory",
    "rarity": 3,
    "rulesText": "Austin Theory-exclusive Trademark. Grounds opponent. On Connect: search/draw A-Town Down; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "A-Town Down", "discount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "austin-theory-rolling-thunder-blockbuster",
    "name": "Rolling Thunder Blockbuster",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"agility": 2},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "austin-theory",
    "rarity": 3,
    "rulesText": "Austin Theory-exclusive Trademark. Grounds opponent. On Connect: gain +1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "gainAdrenaline", "amount": 1}],
    "counterState": "running-aerial"
  },
  {
    "id": "austin-theory-patella-brainbuster",
    "name": "Patella Brainbuster",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {"technical": 2},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "austin-theory",
    "rarity": 3,
    "rulesText": "Austin Theory-exclusive Trademark. Grounds opponent. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "loseOpponentAdrenaline", "amount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "austin-theory-a-town-down",
    "name": "A-Town Down",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "austin-theory",
    "rarity": 4,
    "rulesText": "Austin Theory-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-austin-theory",
    "name": "This Is Me",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "austin-theory",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"strike": 1, "strength": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-austin-theory",
    "name": "All Day",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "austin-theory",
    "rulesText": "Once per match during your Control sequence: your next Strike Move this Control sequence cannot be Auto Countered. If it Connects, draw 1 page.",
    "special": {"type": "austinTheoryAllDay", "drawOnConnect": 1}
  },
  {
    "id": "manager-maxxine-dupri",
    "name": "Maxxine Dupri",
    "kind": "manager",
    "setId": "raw-series-1",
    "rarity": 3,
    "allowedFactionTags": ["vision"],
    "rulesText": "The Vision members only. When Maxxine enters play, search/draw one shared Strike Move with printed Cost 4 or less. Once per match, after one of your Moves is successfully Countered, opponent loses 1 Adrenaline.",
    "effect": {
      "type": "visionManager",
      "enterSearchMethod": "strike",
      "enterSearchMaxCost": 4,
      "counteredMoveOpponentAdrenaline": -1
    }
  },
  {
    "id": "montez-ford-spinebuster",
    "name": "Montez’s Spinebuster",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"strength": 2},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "montez-ford",
    "rarity": 3,
    "rulesText": "Montez Ford-exclusive Trademark. Grounds opponent. On Connect: gain +1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "gainAdrenaline", "amount": 1}],
    "counterState": "torso-trapped"
  },
  {
    "id": "montez-ford-blockbuster",
    "name": "Montez’s Blockbuster",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {"agility": 2},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "montez-ford",
    "rarity": 3,
    "rulesText": "Montez Ford-exclusive Trademark. Grounds opponent. On Connect: draw 1 page, then ditch 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "drawThenDiscardSelf", "draw": 1, "discard": 1}],
    "counterState": "diving-aerial"
  },
  {
    "id": "montez-ford-450-splash",
    "name": "Montez’s 450 Splash",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {"agility": 3},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "montez-ford",
    "rarity": 3,
    "rulesText": "Montez Ford-exclusive Trademark. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "montez-ford-from-the-heavens",
    "name": "From the Heavens",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "montez-ford",
    "rarity": 4,
    "rulesText": "Montez Ford-exclusive Finisher. No Method requirement. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "special-angelo-dawkins",
    "name": "Angelo Dawkins",
    "kind": "action",
    "setId": "raw-series-1",
    "cost": 10,
    "rarity": 4,
    "superstarId": "montez-ford",
    "rulesText": "Montez Ford only. Once per match during your Control sequence, Angelo Dawkins runs in: create/draw the linked Revelation Finisher. Revelation costs 10, has no Method requirement, and is not collectible.",
    "special": {
      "type": "angeloDawkinsRunIn",
      "linkedCardId": "linked-street-profits-revelation"
    }
  },
  {
    "id": "entrance-montez-ford",
    "name": "We Want The Smoke",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "montez-ford",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"agility": 1, "strike": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "spinning-heel-kick",
    "name": "Spinning Heel Kick",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {"strike": 1},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Shared. On Connect: gain +1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [{"type": "gainAdrenaline", "amount": 1}],
    "counterState": "leg-extended"
  },
  {
    "id": "triangle-choke",
    "name": "Triangle Choke",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 0,
    "requirements": {"technical": 1},
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Shared. Grounded opponent only. Submission. +3 persistent Head damage per successful turn. When applied, opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {"bodyPart": "head", "pressure": 3},
    "opponentAdrenalineOnConnect": -1,
    "effects": [],
    "counterState": "torso-trapped",
    "submissionTarget": "head"
  },
  {
    "id": "lola-vice-running-hip-attack",
    "name": "Lola’s Running Hip Attack",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"strike": 2},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "lola-vice",
    "rarity": 3,
    "rulesText": "Lola Vice-exclusive Trademark. Grounds opponent. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "loseOpponentAdrenaline", "amount": 1}],
    "counterState": "torso-trapped"
  },
  {
    "id": "lola-vice-spinning-heel-kick",
    "name": "Lola’s Spinning Heel Kick",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {"strike": 2},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "lola-vice",
    "rarity": 3,
    "rulesText": "Lola Vice-exclusive Trademark. Grounds opponent. On Connect: search/draw 305; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "305", "discount": 1}],
    "counterState": "leg-extended"
  },
  {
    "id": "lola-vice-triangle-choke",
    "name": "Lola’s Triangle Choke",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {"technical": 2},
    "moveType": "submission",
    "method": "technical",
    "superstarId": "lola-vice",
    "rarity": 3,
    "rulesText": "Lola Vice-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Head damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "submission": {"bodyPart": "head", "pressure": 5},
    "effects": [],
    "counterState": "torso-trapped",
    "submissionTarget": "head"
  },
  {
    "id": "lola-vice-305",
    "name": "305",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "lola-vice",
    "rarity": 4,
    "rulesText": "Lola Vice-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "arm-extended"
  },
  {
    "id": "entrance-lola-vice",
    "name": "Te Lo Rompo",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "lola-vice",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"strike": 1, "technical": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-lola-vice",
    "name": "My Fists Don’t Lie",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "lola-vice",
    "rulesText": "Once per match during your Control sequence: arm your next connected Strike this Control sequence. On Connect, opponent loses 2 additional Adrenaline; if they are at 0 after that loss, draw 1 page.",
    "special": {"type": "lolaFistsDontLie", "opponentAdrenaline": -2, "drawIfZero": 1}
  }
  ,
  {
    "id": "dragon-lee-operation-dragon",
    "name": "Operation Dragon",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"agility": 2},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "dragon-lee",
    "rarity": 3,
    "rulesText": "Dragon Lee-exclusive Trademark. Grounds opponent. On Connect: search/draw Dragon Driver; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "Dragon Driver", "discount": 1}],
    "counterState": "running-aerial"
  },
  {
    "id": "dragon-lee-incinerator",
    "name": "Incinerator",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {"strike": 2},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "dragon-lee",
    "rarity": 3,
    "rulesText": "Dragon Lee-exclusive Trademark. Grounds opponent. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "loseOpponentAdrenaline", "amount": 1}],
    "counterState": "leg-extended"
  },
  {
    "id": "dragon-lee-double-foot-stomp",
    "name": "Dragon’s Double Foot Stomp",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"agility": 2},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "dragon-lee",
    "rarity": 3,
    "rulesText": "Dragon Lee-exclusive Trademark. Grounded opponent only. On Connect: draw 1 page, then ditch 1 page.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "drawThenDiscardSelf", "draw": 1, "discard": 1}],
    "counterState": "diving-aerial"
  },
  {
    "id": "dragon-lee-dragon-driver",
    "name": "Dragon Driver",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "dragon-lee",
    "rarity": 4,
    "rulesText": "Dragon Lee-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-dragon-lee",
    "name": "Control the Empire",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "dragon-lee",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"agility": 1, "technical": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-dragon-lee",
    "name": "Lucha Legacy",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "dragon-lee",
    "rulesText": "Once per match during your Control sequence: search/draw one shared Agility or Technical Move with printed Cost 5 or less; it costs 1 less this Control sequence.",
    "special": {"type": "dragonLuchaLegacy", "maxCost": 5, "methods": ["agility", "technical"], "discount": 1}
  }

  ,
  {
    "id": "vikingo-mexican-destroyer",
    "name": "Vikingo’s Mexican Destroyer",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"technical": 2},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "hijo-del-vikingo",
    "rarity": 3,
    "rulesText": "Hijo del Vikingo-exclusive Trademark. Grounds opponent. On Connect: gain +1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "gainAdrenaline", "amount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "vikingo-twisting-450-splash",
    "name": "Vikingo’s Twisting 450 Splash",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {"agility": 3},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "hijo-del-vikingo",
    "rarity": 3,
    "rulesText": "Hijo del Vikingo-exclusive Trademark. Grounded opponent only. On Connect: search/draw El Cuerno del Vikingo; it costs 2 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "El Cuerno del Vikingo", "discount": 2}],
    "counterState": "diving-aerial"
  },
  {
    "id": "vikingo-top-rope-poison-rana",
    "name": "Vikingo’s Top-Rope Poison Rana",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"technical": 2},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "hijo-del-vikingo",
    "rarity": 3,
    "rulesText": "Hijo del Vikingo-exclusive Trademark. Grounds opponent. On Connect: opponent ditches 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discardOpponent", "amount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "vikingo-el-cuerno-del-vikingo",
    "name": "El Cuerno del Vikingo",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "hijo-del-vikingo",
    "rarity": 4,
    "rulesText": "Hijo del Vikingo-exclusive Finisher. No Method requirement. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "entrance-hijo-del-vikingo",
    "name": "Alas de Oro",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "hijo-del-vikingo",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"agility": 1, "technical": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-hijo-del-vikingo",
    "name": "El Ojo’s Protection",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "hijo-del-vikingo",
    "rulesText": "Once per match, after one of Vikingo’s Aerial Moves is successfully Countered: you may play this card. Prevent any self-Stun printed on that countered Aerial Move; gain +1 Adrenaline and draw 1 page.",
    "special": {"type": "vikingoElOjoProtection", "adrenaline": 1, "draw": 1}
  }


  ,
  {
    "id": "mr-iguana-iguanarana",
    "name": "Iguanarana",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"agility": 2},
    "moveType": "grapple",
    "method": "agility",
    "superstarId": "mr-iguana",
    "rarity": 3,
    "rulesText": "Mr. Iguana-exclusive Trademark. May Counter a Body Elevated Move. Grounds opponent. If used as a Counter and it Connects: gain +1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [],
    "counterState": "body-elevated",
    "counterStates": ["body-elevated"],
    "counterAdrenalineOnConnect": 1
  },
  {
    "id": "mr-iguana-pongase-verde",
    "name": "Póngase Verde",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"technical": 2},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "mr-iguana",
    "rarity": 3,
    "rulesText": "Mr. Iguana-exclusive Trademark. Grounds opponent. On Connect: search/draw Chalino Driver; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "Chalino Driver", "discount": 1}],
    "counterState": "rear-control"
  },
  {
    "id": "mr-iguana-muta-lock",
    "name": "Muta Lock",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {"technical": 2},
    "moveType": "submission",
    "method": "technical",
    "superstarId": "mr-iguana",
    "rarity": 3,
    "rulesText": "Mr. Iguana-exclusive Trademark. Grounded opponent only. Submission. +5 persistent Back damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "submission": {"bodyPart": "back", "pressure": 5},
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "back"
  },
  {
    "id": "mr-iguana-chalino-driver",
    "name": "Chalino Driver",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "mr-iguana",
    "rarity": 4,
    "rulesText": "Mr. Iguana-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-mr-iguana",
    "name": "Verde Desde 1988",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "mr-iguana",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"agility": 1, "technical": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-mr-iguana",
    "name": "La Yesca",
    "kind": "action",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "mr-iguana",
    "rulesText": "Once per match during Mr. Iguana’s Control sequence: search/draw one Mr. Iguana-exclusive Trademark; it costs 1 less this Control sequence. Then the opponent loses 1 Adrenaline.",
    "special": {"type": "iguanaLaYesca", "discount": 1, "opponentAdrenaline": -1}
  }


  ,
  {
    "id": "bret-hart-inverted-atomic-drop",
    "name": "Inverted Atomic Drop",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {"strength": 1},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "bret-hart",
    "rarity": 3,
    "rulesText": "Bret Hart-exclusive Trademark. On Connect: your next Russian Leg Sweep costs 1 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Russian Leg Sweep", "amount": 1}],
    "counterState": "torso-trapped"
  },
  {
    "id": "bret-hart-pendulum-backbreaker",
    "name": "Pendulum Backbreaker",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"technical": 2},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "bret-hart",
    "rarity": 3,
    "rulesText": "Bret Hart-exclusive Trademark. Grounds opponent. On Connect: your next Second-Rope Elbow Drop costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Second-Rope Elbow Drop", "amount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "bret-hart-second-rope-elbow-drop",
    "name": "Second-Rope Elbow Drop",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"strike": 2},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "bret-hart",
    "rarity": 3,
    "rulesText": "Bret Hart-exclusive Trademark. Grounded opponent only. Diving Aerial. On Connect: search/draw Sharpshooter; it costs 1 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "Sharpshooter", "discount": 1}],
    "counterState": "diving-aerial"
  },
  {
    "id": "bret-hart-sharpshooter",
    "name": "Sharpshooter",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 9,
    "damage": 0,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "bret-hart",
    "rarity": 4,
    "rulesText": "Bret Hart-exclusive Finisher. No Method requirement. Grounded opponent only. Submission. +6 persistent Leg damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "submission": {"bodyPart": "legs", "pressure": 6},
    "effects": [],
    "counterState": "leg-extended",
    "submissionTarget": "legs"
  },
  {
    "id": "entrance-bret-hart",
    "name": "The Hit Man",
    "kind": "entrance",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "bret-hart",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"technical": 1, "strength": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-bret-hart",
    "name": "The Best There Is...",
    "kind": "action",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "bret-hart",
    "rulesText": "Once per match after Bret successfully Counters a Move: search/draw Sharpshooter; it costs 2 less this Control sequence.",
    "special": {"type": "counterTutorNamed", "name": "Sharpshooter", "amount": 2}
  },
  {
    "id": "shawn-michaels-flying-forearm",
    "name": "Flying Forearm",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {"strike": 1},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "shawn-michaels",
    "rarity": 3,
    "rulesText": "Shawn Michaels-exclusive Trademark. Running Aerial. Grounds opponent. On Connect: your next Teardrop Suplex costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Teardrop Suplex", "amount": 1}],
    "counterState": "running-aerial"
  },
  {
    "id": "shawn-michaels-teardrop-suplex",
    "name": "Teardrop Suplex",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"technical": 2},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "shawn-michaels",
    "rarity": 3,
    "rulesText": "Shawn Michaels-exclusive Trademark. Grounds opponent. On Connect: your next Top-Rope Elbow Drop costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Top-Rope Elbow Drop", "amount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "shawn-michaels-top-rope-elbow-drop",
    "name": "Top-Rope Elbow Drop",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"agility": 2},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "shawn-michaels",
    "rarity": 3,
    "rulesText": "Shawn Michaels-exclusive Trademark. Grounded opponent only. Diving Aerial. On Connect: search/draw Sweet Chin Music; it costs 1 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "Sweet Chin Music", "discount": 1}],
    "counterState": "diving-aerial"
  },
  {
    "id": "shawn-michaels-sweet-chin-music",
    "name": "Sweet Chin Music",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "shawn-michaels",
    "rarity": 4,
    "rulesText": "Shawn Michaels-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "entrance-shawn-michaels",
    "name": "Sexy Boy",
    "kind": "entrance",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "shawn-michaels",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"agility": 1, "strike": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-shawn-michaels",
    "name": "The Showstopper",
    "kind": "action",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "shawn-michaels",
    "rulesText": "Once per match during Shawn Michaels’ Control sequence: search/draw one Shawn Michaels-exclusive Trademark; it costs 1 less this Control sequence.",
    "special": {"type": "hbkShowstopper", "discount": 1}
  }


  ,
  {
    "id": "razor-ramon-fallaway-slam",
    "name": "Razor’s Fallaway Slam",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {"strength": 1},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "razor-ramon",
    "rarity": 3,
    "rulesText": "Razor Ramon-exclusive Trademark. Grounds opponent. On Connect: your next Razor’s Running Powerslam costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Razor’s Running Powerslam", "amount": 1}],
    "counterState": "torso-trapped"
  },
  {
    "id": "razor-ramon-running-powerslam",
    "name": "Razor’s Running Powerslam",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {"strength": 2},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "razor-ramon",
    "rarity": 3,
    "rulesText": "Razor Ramon-exclusive Trademark. Grounds opponent. On Connect: your next Razor’s Chokeslam costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Razor’s Chokeslam", "amount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "razor-ramon-chokeslam",
    "name": "Razor’s Chokeslam",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"strength": 2},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "razor-ramon",
    "rarity": 3,
    "rulesText": "Razor Ramon-exclusive Trademark. Grounds opponent. On Connect: search/draw The Razor’s Edge; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "The Razor’s Edge", "discount": 1}],
    "counterState": "front-control"
  },
  {
    "id": "razor-ramon-razors-edge",
    "name": "The Razor’s Edge",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "razor-ramon",
    "rarity": 4,
    "rulesText": "Razor Ramon-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-razor-ramon",
    "name": "The Bad Guy",
    "kind": "entrance",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "razor-ramon",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"strength": 1, "strike": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-razor-ramon",
    "name": "Say Hello to the Bad Guy",
    "kind": "action",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "razor-ramon",
    "rulesText": "Once per match during Razor Ramon’s Control sequence: search/draw one Razor Ramon-exclusive Trademark; it costs 1 less this Control sequence.",
    "special": {"type": "exclusiveTrademarkTutor", "discount": 1}
  }


  ,
  {
    "id": "diesel-snake-eyes",
    "name": "Diesel’s Snake Eyes",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"strength": 1},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "diesel",
    "rarity": 3,
    "rulesText": "Diesel-exclusive Trademark. Grounds opponent. On Connect: your next Diesel’s Big Boot costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Diesel’s Big Boot", "amount": 1}],
    "counterState": "body-elevated"
  },
  {
    "id": "diesel-big-boot",
    "name": "Diesel’s Big Boot",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {"strike": 2},
    "moveType": "strike",
    "method": "strike",
    "superstarId": "diesel",
    "rarity": 3,
    "rulesText": "Diesel-exclusive Trademark. Grounds opponent. On Connect: your next Diesel’s Sidewalk Slam costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "discountNextByName", "name": "Diesel’s Sidewalk Slam", "amount": 1}],
    "counterState": "leg-extended"
  },
  {
    "id": "diesel-sidewalk-slam",
    "name": "Diesel’s Sidewalk Slam",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"strength": 2},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "diesel",
    "rarity": 3,
    "rulesText": "Diesel-exclusive Trademark. Grounds opponent. On Connect: search/draw Jackknife Powerbomb; it costs 1 less this Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [{"type": "search", "name": "Jackknife Powerbomb", "discount": 1}],
    "counterState": "torso-trapped"
  },
  {
    "id": "diesel-jackknife-powerbomb",
    "name": "Jackknife Powerbomb",
    "kind": "move",
    "setId": "new-generation-series-1",
    "cost": 11,
    "damage": 18,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "diesel",
    "rarity": 4,
    "rulesText": "Diesel-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "entrance-diesel",
    "name": "Diesel Power",
    "kind": "entrance",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "diesel",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {"strength": 1, "strike": 1},
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-diesel",
    "name": "Two Dudes with Attitudes",
    "kind": "action",
    "setId": "new-generation-series-1",
    "rarity": 4,
    "superstarId": "diesel",
    "rulesText": "Once per match during Diesel’s Control sequence: search/draw one Diesel-exclusive Trademark; it costs 1 less this Control sequence.",
    "special": {"type": "exclusiveTrademarkTutor", "discount": 1}
  },
  {
    "id": "brainbuster",
    "name": "Brainbuster",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {"technical": 2},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Shared. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "body-elevated"
  },
  {
    "id": "side-kick",
    "name": "Side Kick",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {"strike": 1},
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "leg-extended"
  },
  {
    "id": "vertical-boston-crab",
    "name": "Vertical Boston Crab",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 0,
    "requirements": {"technical": 2},
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Shared. Grounded opponent only. Submission. +4 persistent Back damage per successful turn.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {"bodyPart": "back", "pressure": 4},
    "effects": [],
    "counterState": "rear-control",
    "submissionTarget": "back"
  },
  {
    "id": "diving-shoulder-block",
    "name": "Diving Shoulder Block",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {"agility": 1},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Shared. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "diving-aerial"
  },
  {
    "id": "springboard-roundhouse-kick",
    "name": "Springboard Roundhouse Kick",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {"agility": 2, "strike": 1},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 3,
    "boosterOnly": true,
    "rulesText": "Shared. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "counterState": "running-aerial"
  }


];

allGameplayCards.forEach(enrichCounterState);

// Linked/generated gameplay cards are intentionally outside allGameplayCards and the
// canonical collector manifest. They can exist in a match only when an authored
// effect creates them, so they never enter boosters, catalogue completion, normal
// deck construction, starting hands, or generic deck searches.
export const linkedGameplayCards = [
  {
    "id": "linked-street-profits-revelation",
    "artKey": "street-profits-revelation",
    "name": "Revelation",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "montez-ford",
    "rarity": 4,
    "rulesText": "Linked Street Profits Finisher. Created only by Angelo Dawkins. No Method requirement. Grounds opponent. Not collectible.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "oneUse": true,
    "linkedOnly": true,
    "effects": [],
    "counterState": "body-elevated"
  }
];
linkedGameplayCards.forEach(enrichCounterState);
