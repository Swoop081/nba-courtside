export const superstars = {
  "iyoSky": {
    "id": "iyo-sky",
    "name": "IYO SKY",
    "nickname": "The Genius of the Sky",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-iyo-sky",
    "entranceId": "entrance-iyo-sky",
    "specialId": "special-iyo-sky",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "dropkick",
      "hurricanrana",
      "running-forearm"
    ],
    "signatures": [
      "iyo-sky-bullet-train-attack",
      "iyo-sky-over-the-moonsault"
    ],
    "archetype": "reviewed-starter",
    "hp": 57,
    "methodLimits": {
      "agility": null,
      "strength": 2,
      "strike": 1,
      "technical": 2
    },
    "starterMomentum": {
      "agility": 8,
      "strength": 1,
      "strike": 1,
      "technical": 2
    },
    "ability": {
      "name": "Genius of the Sky",
      "text": "The first 2 times IYO connects with a Move requiring Agility 2+, gain +1 Adrenaline and draw 1 page.",
      "trigger": {
        "type": "agilityRequirement",
        "minRequirement": 2,
        "maxUses": 2,
        "adrenaline": 1,
        "draw": 1
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-iyo-sky",
      "name": "Tokyo Shock",
      "kind": "entrance",
      "setId": "evolution-series-1",
      "rarity": 4,
      "superstarId": "iyo-sky",
      "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Agility Momentum.",
      "preMatchMomentum": {
        "strength": 1,
        "agility": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "counterUncounterableMethod",
      "method": "agility"
    }
  },
  "mankind": {
    "id": "mankind",
    "name": "Mankind",
    "nickname": "The Deranged One",
    "setId": "hall-of-fame-series-1",
    "era": "attitude-era",
    "seasonExclusive": false,
    "cardId": "superstar-mankind",
    "entranceId": "entrance-mankind",
    "specialId": "special-mankind",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "punch",
      "headbutt",
      "ddt"
    ],
    "signatures": [
      "mankind-clothesline",
      "mankind-cactus-elbow",
      "mankind-double-arm-ddt",
      "mankind-mandible-claw",
      "mankind-have-a-nice-day"
    ],
    "archetype": "reviewed-starter",
    "hp": 67,
    "methodLimits": {
      "agility": 0,
      "strength": 2,
      "strike": null,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 2,
      "strike": 10
    },
    "ability": {
      "name": "Deranged Resilience",
      "text": "The first 3 times Mankind would take 7+ damage from one Move, reduce that damage by 3.",
      "trigger": {
        "type": "reduceIncoming",
        "minDamage": 7,
        "maxUses": 3,
        "reduce": 3
      },
      "maxUses": 3
    },
    "entrance": {
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
    "special": {
      "type": "socko"
    }
  },
  "theRock": {
    "id": "the-rock",
    "name": "The Rock",
    "nickname": "The Final Boss",
    "setId": "season-1-final-boss",
    "era": "final-boss",
    "seasonExclusive": true,
    "cardId": "superstar-the-rock",
    "entranceId": "entrance-the-rock",
    "specialId": "special-the-rock",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "clothesline",
      "body-slam"
    ],
    "signatures": [
      "belly-to-belly-suplex",
      "the-rock-rock-bottom",
      "the-rock-people-s-elbow"
    ],
    "archetype": "prestige-final-boss",
    "hp": 67,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 6
    },
    "ability": {
      "name": "I Want Your Soul",
      "text": "The first time Rock connects with a Move dealing 7+ damage, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "connectDamage",
        "minDamage": 6,
        "maxUses": 1,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 1
    },
    "entrance": {
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
    "special": {
      "type": "retainOnCounter",
      "draw": 1,
      "opponentAdrenaline": -1
    }
  },
  "hulkHogan": {
    "id": "hulk-hogan",
    "name": "Hulk Hogan",
    "nickname": "Hulkster",
    "setId": "hall-of-fame-series-1",
    "era": "golden-era",
    "seasonExclusive": false,
    "cardId": "superstar-hulk-hogan",
    "entranceId": "entrance-hulk-hogan",
    "specialId": "special-hulk-hogan",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "shoulder-tackle",
      "body-slam"
    ],
    "signatures": [
      "hulk-hogan-atomic-leg-drop",
      "hulk-hogan-whatcha-gonna-do"
    ],
    "archetype": "reviewed-starter",
    "hp": 69,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 6
    },
    "ability": {
      "name": "Hulkamania",
      "text": "The first 2 times Hogan connects with a Strength Move dealing 5+ damage, gain +1 Adrenaline and draw 1 page.",
      "trigger": {
        "type": "connectMethodDamage",
        "method": "strength",
        "minDamage": 5,
        "maxUses": 2,
        "adrenaline": 1,
        "draw": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "hulkUp",
      "adrenaline": 3,
      "draw": 2
    }
  },
  "bayley": {
    "id": "bayley",
    "name": "Bayley",
    "nickname": "The Role Model",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-bayley",
    "entranceId": "entrance-bayley",
    "specialId": "special-bayley",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strike",
      "punch",
      "running-forearm",
      "arm-drag"
    ],
    "signatures": [
      "bayley-to-belly",
      "bayley-diving-elbow",
      "bayley-rose-plant",
      "bayley-ding-dong-hello"
    ],
    "archetype": "reviewed-starter",
    "hp": 63,
    "methodLimits": {
      "agility": 2,
      "strength": 2,
      "strike": null,
      "technical": null
    },
    "starterMomentum": {
      "agility": 2,
      "strength": 2,
      "strike": 4,
      "technical": 4
    },
    "ability": {
      "name": "The Role Model",
      "text": "The first 3 times Bayley connects with a Move using a different Method than the previous Move she connected with, gain +2 Adrenaline, draw 1 page, and her next Move deals +3 Damage.",
      "trigger": {
        "type": "differentMethod",
        "maxUses": 3,
        "adrenaline": 2,
        "draw": 1,
        "damage": 3
      },
      "maxUses": 3
    },
    "entrance": {
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
    "special": {
      "type": "counterDrawControl",
      "draw": 3
    }
  },
  "cmPunk": {
    "id": "cm-punk",
    "name": "CM Punk",
    "nickname": "The Best in the World",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-cm-punk",
    "entranceId": "entrance-cm-punk",
    "specialId": "special-cm-punk",
    "leadOffIds": [
      "momentum-strike",
      "momentum-technical",
      "punch",
      "dropkick",
      "running-forearm"
    ],
    "signatures": [
      "cm-punk-anaconda-vise",
      "cm-punk-g-t-s"
    ],
    "archetype": "reviewed-starter",
    "hp": 64,
    "methodLimits": {
      "agility": 2,
      "strength": 0,
      "strike": null,
      "technical": null
    },
    "starterMomentum": {
      "agility": 2,
      "strike": 6,
      "technical": 4
    },
    "ability": {
      "name": "Pipe Bomb",
      "text": "The first 3 times Punk successfully Counters a Move, gain +1 Technical Momentum, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "firstCounterMomentum",
        "method": "technical",
        "maxUses": 3,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 3
    },
    "entrance": {
      "id": "entrance-cm-punk",
      "name": "It’s Clobbering Time!",
      "kind": "entrance",
      "setId": "summerslam-series-1",
      "rarity": 4,
      "superstarId": "cm-punk",
      "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Strike Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "technical": 1,
        "strike": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "pinEscape"
    }
  },
  "paige": {
    "id": "paige",
    "name": "Paige",
    "nickname": "The Anti-Diva",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-paige",
    "entranceId": "entrance-paige",
    "specialId": "special-paige",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strike",
      "punch",
      "running-forearm",
      "ddt"
    ],
    "signatures": [
      "paige-pto",
      "paige-ram-paige",
      "paige-superkick",
      "paige-paige-turner"
    ],
    "archetype": "reviewed-starter",
    "hp": 64,
    "methodLimits": {
      "agility": 0,
      "strength": 1,
      "strike": null,
      "technical": null
    },
    "starterMomentum": {
      "strike": 6,
      "technical": 6
    },
    "ability": {
      "name": "The Anti-Diva",
      "text": "The first 3 times Paige connects with a Strike Move dealing 5+ damage, draw 1 page and her next Technical Move during that Control sequence costs 2 less.",
      "trigger": {
        "type": "strikeDamageDiscountTechnical",
        "minDamage": 5,
        "maxUses": 3,
        "discount": 2,
        "draw": 1
      },
      "maxUses": 3
    },
    "entrance": {
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
  "sethRollins": {
    "id": "seth-rollins",
    "name": "Seth Rollins",
    "nickname": "The Visionary",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-seth-rollins",
    "entranceId": "entrance-seth-rollins",
    "specialId": "special-seth-rollins",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "dropkick",
      "running-forearm",
      "sling-blade"
    ],
    "signatures": [
      "seth-rollins-buckle-bomb",
      "seth-rollins-curb-stomp"
    ],
    "archetype": "reviewed-starter",
    "hp": 64,
    "methodLimits": {
      "agility": null,
      "strength": 0,
      "strike": null,
      "technical": null
    },
    "starterMomentum": {
      "agility": 5,
      "strike": 3,
      "technical": 4
    },
    "ability": {
      "name": "The Architect",
      "text": "The first 2 times Seth plays a Momentum page, his next Move this turn gets +3 Damage.",
      "trigger": {
        "type": "momentumBuff",
        "maxUses": 2,
        "damage": 3
      },
      "maxUses": 2
    },
    "entrance": {
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
      "preMatchAdrenaline": 0,
      "delayedTurn5": true
    },
    "special": {
      "type": "counterKeepSequence"
    }
  },
  "andreTheGiant": {
    "id": "andre-the-giant",
    "name": "André the Giant",
    "nickname": "The Eighth Wonder of the World",
    "setId": "hall-of-fame-series-1",
    "era": "golden-era",
    "seasonExclusive": false,
    "cardId": "superstar-andre-the-giant",
    "entranceId": "entrance-andre-the-giant",
    "specialId": "special-andre-the-giant",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "headbutt",
      "chop",
      "body-slam"
    ],
    "signatures": [
      "andre-the-giant-double-underhook-suplex",
      "andre-the-giant-sitdown-splash",
      "andre-the-giant-headbutt"
    ],
    "archetype": "reviewed-starter",
    "hp": 72,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": 2,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 10,
      "strike": 2
    },
    "ability": {
      "name": "Giant’s Reach",
      "text": "The first 2 times André connects with a Strike Move, his next Strength Move during that Control sequence costs 2 less, deals +3 Damage, and André gains +1 Adrenaline.",
      "trigger": {
        "type": "strikeDiscountStrength",
        "maxUses": 2,
        "discount": 2,
        "damage": 3,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "nobodySlams"
    }
  },
  "stephanieVaquer": {
    "id": "stephanie-vaquer",
    "name": "Stephanie Vaquer",
    "nickname": "La Primera",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-stephanie-vaquer",
    "entranceId": "entrance-stephanie-vaquer",
    "specialId": "special-stephanie-vaquer",
    "leadOffIds": [
      "momentum-technical",
      "momentum-agility",
      "punch",
      "stephanie-vaquer-dragon-screw",
      "dropkick"
    ],
    "signatures": [
      "stephanie-vaquer-devils-kiss",
      "stephanie-vaquer-vaquer-inferno",
      "stephanie-vaquer-dragon-screw"
    ],
    "archetype": "reviewed-starter",
    "hp": 63,
    "methodLimits": {
      "agility": null,
      "strength": 0,
      "strike": 2,
      "technical": null
    },
    "starterMomentum": {
      "agility": 5,
      "strike": 2,
      "technical": 5
    },
    "ability": {
      "name": "La Primera",
      "text": "The first 3 times Vaquer connects with an Agility Move immediately after a Technical Move in the same Control sequence, gain +1 Adrenaline and draw 1 page.",
      "trigger": {
        "type": "agilityAfterTechnical",
        "maxUses": 3,
        "adrenaline": 1,
        "draw": 1
      },
      "maxUses": 3
    },
    "entrance": {
      "id": "entrance-stephanie-vaquer",
      "name": "The Dark Angel",
      "kind": "entrance",
      "setId": "evolution-series-1",
      "rarity": 4,
      "superstarId": "stephanie-vaquer",
      "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Agility Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "technical": 1,
        "agility": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "counterUncounterableMethod",
      "method": "technical",
      "draw": 2,
      "adrenaline": 1
    }
  },
  "randySavage": {
    "id": "randy-savage",
    "name": "Randy Savage",
    "nickname": "Macho Man",
    "setId": "hall-of-fame-series-1",
    "era": "golden-era",
    "seasonExclusive": false,
    "cardId": "superstar-randy-savage",
    "entranceId": "entrance-randy-savage",
    "specialId": "special-randy-savage",
    "leadOffIds": [
      "momentum-strike",
      "momentum-agility",
      "punch",
      "back-elbow",
      "knee-drop"
    ],
    "signatures": [
      "randy-savage-flying-elbow-drop",
      "randy-savage-cream-of-the-crop"
    ],
    "archetype": "reviewed-starter",
    "hp": 64,
    "methodLimits": {
      "agility": null,
      "strength": 0,
      "strike": null,
      "technical": 1
    },
    "starterMomentum": {
      "agility": 6,
      "strike": 6
    },
    "ability": {
      "name": "Macho Madness",
      "text": "The first 2 times Savage connects with an Agility Move after he has connected with a Strike Move earlier in the same Control sequence, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "agilityAfterStrike",
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "counterDiscountMethod",
      "method": "agility",
      "amount": 2
    }
  },
  "romanReigns": {
    "id": "roman-reigns",
    "name": "Roman Reigns",
    "nickname": "The OTC",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-roman-reigns",
    "entranceId": "entrance-roman-reigns",
    "specialId": "special-roman-reigns",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "shoulder-tackle",
      "throat-thrust"
    ],
    "signatures": [
      "roman-reigns-superman-punch",
      "roman-reigns-spear"
    ],
    "archetype": "reviewed-starter",
    "hp": 67,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 6
    },
    "ability": {
      "name": "Head of the Table",
      "text": "The first time Roman connects with a Move dealing 7+ damage, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "connectDamage",
        "minDamage": 7,
        "maxUses": 1,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 1
    },
    "entrance": {
      "id": "entrance-roman-reigns",
      "name": "Acknowledge Me",
      "kind": "entrance",
      "setId": "summerslam-series-1",
      "rarity": 4,
      "superstarId": "roman-reigns",
      "rulesText": "Pre-Match: Begin with +1 Strength Momentum. The first Strike Move Roman connects with gains +1 Strike Momentum. At the start of Turn 6, gain +1 Adrenaline.",
      "preMatchMomentum": {
        "strength": 1
      },
      "preMatchAdrenaline": 0,
      "delayedTurn5": false,
      "firstStrikeMomentum": 1
    },
    "special": {
      "type": "regainAfterLoseControl"
    }
  },
  "charlotteFlair": {
    "id": "charlotte-flair",
    "name": "Charlotte Flair",
    "nickname": "The Queen",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-charlotte-flair",
    "entranceId": "entrance-charlotte-flair",
    "specialId": "special-charlotte-flair",
    "leadOffIds": [
      "momentum-technical",
      "momentum-agility",
      "punch",
      "flair-chop",
      "arm-drag"
    ],
    "signatures": [
      "flair-chop",
      "spear",
      "charlotte-flair-natural-selection",
      "charlotte-flair-figure-eight-leglock",
      "charlotte-flair-spear"
    ],
    "archetype": "reviewed-starter",
    "hp": 65,
    "methodLimits": {
      "agility": null,
      "strength": 2,
      "strike": 1,
      "technical": null
    },
    "starterMomentum": {
      "agility": 4,
      "strength": 2,
      "strike": 1,
      "technical": 5
    },
    "ability": {
      "name": "Genetically Superior",
      "text": "The first 2 times Charlotte connects with a Technical Move, draw 1 page and her next Agility Move during that Control sequence costs 2 less.",
      "trigger": {
        "type": "technicalDiscountAgility",
        "maxUses": 2,
        "discount": 2,
        "draw": 1
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-charlotte-flair",
      "name": "All Hail the Queen",
      "kind": "entrance",
      "setId": "evolution-series-1",
      "rarity": 4,
      "superstarId": "charlotte-flair",
      "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Agility Momentum, +1 Strength Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "technical": 1,
        "agility": 1,
        "strength": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "flairChopWooo",
      "afterName": "Flair Chop",
      "draw": 1,
      "adrenaline": 2
    }
  },
  "kevinOwens": {
    "id": "kevin-owens",
    "name": "Kevin Owens",
    "nickname": "KO",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-kevin-owens",
    "entranceId": "entrance-kevin-owens",
    "specialId": "special-kevin-owens",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "punch",
      "running-forearm",
      "senton"
    ],
    "signatures": [
      "kevin-owens-stunner"
    ],
    "archetype": "reviewed-starter",
    "hp": 66,
    "methodLimits": {
      "agility": 2,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "agility": 2,
      "strength": 4,
      "strike": 6
    },
    "ability": {
      "name": "The Prize Fighter",
      "text": "The first 2 times Kevin takes 6+ damage from a single Move, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "takeDamage",
        "minDamage": 6,
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-kevin-owens",
      "name": "Fight Owens Fight",
      "kind": "entrance",
      "setId": "summerslam-series-1",
      "rarity": 4,
      "superstarId": "kevin-owens",
      "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "strength": 1,
        "strike": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "cancelOpponentUtility"
    }
  },
  "kane": {
    "id": "kane",
    "name": "Kane",
    "nickname": "The Big Red Machine",
    "setId": "hall-of-fame-series-1",
    "era": "attitude-era",
    "seasonExclusive": false,
    "cardId": "superstar-kane",
    "entranceId": "entrance-kane",
    "specialId": "special-kane",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "uppercut",
      "body-slam"
    ],
    "signatures": [
      "kane-chokeslam-from-hell",
      "tombstone-piledriver",
      "kane-flying-clothesline"
    ],
    "archetype": "reviewed-starter",
    "hp": 69,
    "methodLimits": {
      "agility": 1,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 7,
      "strike": 5
    },
    "ability": {
      "name": "Big Red Machine",
      "text": "The first 2 times Kane connects with a Move dealing 8+ damage, gain +1 Adrenaline.",
      "trigger": {
        "type": "connectDamage",
        "minDamage": 8,
        "maxUses": 2,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-kane",
      "name": "Hellfire and Brimstone",
      "kind": "entrance",
      "setId": "hall-of-fame-series-1",
      "rarity": 4,
      "superstarId": "kane",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "agility": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "ignoreStun",
      "adrenaline": 1
    }
  },
  "undertaker": {
    "id": "the-undertaker",
    "name": "The Undertaker",
    "nickname": "The Deadman",
    "setId": "hall-of-fame-series-1",
    "era": "attitude-era",
    "seasonExclusive": false,
    "cardId": "superstar-the-undertaker",
    "entranceId": "entrance-the-undertaker",
    "specialId": "special-the-undertaker",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "throat-thrust",
      "body-slam"
    ],
    "signatures": [
      "the-undertaker-old-school",
      "tombstone-piledriver",
      "the-undertaker-running-big-boot",
      "the-undertaker-snake-eyes"
    ],
    "archetype": "reviewed-starter",
    "hp": 68,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": null,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 5,
      "technical": 1
    },
    "ability": {
      "name": "Dead Man Walking",
      "text": "Once per match, when a Move would reduce Undertaker to 0 HP, he remains at 1 HP and draws 1 page.",
      "trigger": {
        "type": "surviveAtOne",
        "maxUses": 1,
        "draw": 1
      },
      "maxUses": 1
    },
    "entrance": {
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
    "special": {
      "type": "kickoutControlAdrenaline",
      "amount": 1
    }
  },
  "ultimateWarrior": {
    "id": "ultimate-warrior",
    "name": "Ultimate Warrior",
    "nickname": "The Ultimate Warrior",
    "setId": "hall-of-fame-series-1",
    "era": "golden-era",
    "seasonExclusive": false,
    "cardId": "superstar-ultimate-warrior",
    "entranceId": "entrance-ultimate-warrior",
    "specialId": "special-ultimate-warrior",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "shoulder-tackle",
      "ultimate-warrior-clothesline"
    ],
    "signatures": [
      "ultimate-warrior-gorilla-press-slam",
      "ultimate-warrior-warrior-splash",
      "ultimate-warrior-clothesline"
    ],
    "archetype": "reviewed-starter",
    "hp": 68,
    "methodLimits": {
      "agility": 1,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 7,
      "strike": 5
    },
    "ability": {
      "name": "Feel the Power",
      "text": "The first 2 times Warrior connects with two Moves during the same Control sequence, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "secondMoveInControl",
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "shakeRopes"
    }
  },
  "rheaRipley": {
    "id": "rhea-ripley",
    "name": "Rhea Ripley",
    "nickname": "Mami",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-rhea-ripley",
    "entranceId": "entrance-rhea-ripley",
    "specialId": "special-rhea-ripley",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "headbutt",
      "body-slam"
    ],
    "signatures": [
      "rhea-ripley-prism-trap",
      "rhea-ripley-riptide",
      "rhea-ripley-mamis-always-on-top"
    ],
    "archetype": "reviewed-starter",
    "hp": 66,
    "methodLimits": {
      "agility": 2,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "agility": 2,
      "strength": 5,
      "strike": 5
    },
    "ability": {
      "name": "The Eradicator",
      "text": "The first 2 times Rhea connects with a Strength Move requiring Strength 2+, draw 1 page and the opponent loses 1 Adrenaline.",
      "trigger": {
        "type": "strengthReqDrain",
        "minRequirement": 2,
        "maxUses": 2,
        "opponentAdrenaline": -1,
        "draw": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "headbuttDiscount",
      "name": "Riptide",
      "amount": 2
    }
  },
  "codyRhodes": {
    "id": "cody-rhodes",
    "name": "Cody Rhodes",
    "nickname": "The American Nightmare",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-cody-rhodes",
    "entranceId": "entrance-cody-rhodes",
    "specialId": "special-cody-rhodes",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strike",
      "cody-rhodes-dropdown-uppercut",
      "dropkick",
      "snap-powerslam"
    ],
    "signatures": [
      "cody-rhodes-cody-cutter",
      "cody-rhodes-cross-rhodes",
      "cody-rhodes-what-do-you-want-to-talk-about"
    ],
    "archetype": "reviewed-starter",
    "hp": 64,
    "methodLimits": {
      "agility": null,
      "strength": 0,
      "strike": null,
      "technical": null
    },
    "starterMomentum": {
      "agility": 4,
      "strike": 3,
      "technical": 5
    },
    "ability": {
      "name": "Undeniable",
      "text": "The first 3 times Cody connects with a Move Type he has not previously connected with this match, draw 1 page.",
      "trigger": {
        "type": "codyUndeniable",
        "maxUses": 3
      },
      "maxUses": 3
    },
    "entrance": {
      "id": "entrance-cody-rhodes",
      "name": "Adrenaline in My Soul",
      "kind": "entrance",
      "setId": "summerslam-series-1",
      "rarity": 4,
      "superstarId": "cody-rhodes",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline. At the start of Turn 5, gain +1 Technical Momentum.",
      "preMatchMomentum": {
        "agility": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": true
    },
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
  "obaFemi": {
    "id": "oba-femi",
    "name": "Oba Femi",
    "nickname": "The Ruler",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-oba-femi",
    "entranceId": "entrance-oba-femi",
    "specialId": "special-oba-femi",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "shoulder-tackle",
      "biel-toss"
    ],
    "signatures": [
      "gorilla-press-slam",
      "oba-femi-one-handed-backbreaker",
      "oba-femi-fall-from-grace",
      "oba-femi-running-elbow"
    ],
    "archetype": "reviewed-starter",
    "hp": 68,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 7,
      "strike": 5
    },
    "ability": {
      "name": "The Ruler",
      "text": "The first time Oba connects with a C6+ Strength Move, draw 1 page.",
      "trigger": {
        "type": "connectMethodCost",
        "method": "strength",
        "minCost": 6,
        "maxUses": 1,
        "draw": 1
      },
      "maxUses": 1
    },
    "entrance": {
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
    "special": {
      "type": "nextStrengthUncounterable"
    }
  },
  "stoneCold": {
    "id": "stone-cold-steve-austin",
    "name": "Stone Cold Steve Austin",
    "nickname": "Stone Cold",
    "setId": "hall-of-fame-series-1",
    "era": "attitude-era",
    "seasonExclusive": false,
    "cardId": "superstar-stone-cold-steve-austin",
    "entranceId": "entrance-stone-cold-steve-austin",
    "specialId": "special-stone-cold-steve-austin",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "punch",
      "kick-to-the-gut",
      "headbutt"
    ],
    "signatures": [
      "stone-cold-steve-austin-lou-thesz-press",
      "stone-cold-steve-austin-stone-cold-stunner",
      "stone-cold-give-me-a-hell-yeah"
    ],
    "archetype": "reviewed-starter",
    "hp": 66,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 5,
      "strike": 7
    },
    "ability": {
      "name": "And That’s the Bottom Line",
      "text": "The first 2 times one of Austin’s Moves is Countered, gain +1 Adrenaline and draw 1 page.",
      "trigger": {
        "type": "moveCountered",
        "maxUses": 2,
        "adrenaline": 1,
        "draw": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "counterTutorStrike",
      "maxCost": 5
    }
  },
  "livMorgan": {
    "id": "liv-morgan",
    "name": "Liv Morgan",
    "nickname": "Watch Me",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-liv-morgan",
    "entranceId": "entrance-liv-morgan",
    "specialId": "special-liv-morgan",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "punch",
      "running-forearm",
      "dropkick"
    ],
    "signatures": [
      "liv-morgan-jersey-codebreaker",
      "liv-morgan-oblivion"
    ],
    "archetype": "reviewed-starter",
    "hp": 64,
    "methodLimits": {
      "agility": null,
      "strength": 0,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "agility": 6,
      "strike": 6
    },
    "ability": {
      "name": "Liv Forever",
      "text": "The first 2 times Liv successfully Counters a Move, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "counterDraw",
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "counterDiscountNamed",
      "name": "Jersey Codebreaker",
      "amount": 3,
      "draw": 1,
      "adrenaline": 1
    }
  },
  "brockLesnar": {
    "id": "brock-lesnar",
    "name": "Brock Lesnar",
    "nickname": "The Beast Incarnate",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-brock-lesnar",
    "entranceId": "entrance-brock-lesnar",
    "specialId": "special-brock-lesnar",
    "leadOffIds": [
      "momentum-strength",
      "momentum-technical",
      "double-leg-takedown",
      "punch",
      "shoulder-tackle"
    ],
    "signatures": [
      "brock-lesnar-brocks-german",
      "belly-to-belly-suplex",
      "brock-lesnar-kimura-lock",
      "brock-lesnar-f-5",
      "brock-lesnar-eat-sleep-conquer-repeat"
    ],
    "archetype": "reviewed-starter",
    "hp": 70,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": 2,
      "technical": null
    },
    "starterMomentum": {
      "strength": 7,
      "strike": 2,
      "technical": 3
    },
    "ability": {
      "name": "Suplex City",
      "text": "The first 2 times Brock connects with a Move that counts as German Suplex, gain +2 Adrenaline.",
      "trigger": {
        "type": "connectNamed",
        "name": "German Suplex",
        "maxUses": 2,
        "adrenaline": 2
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-brock-lesnar",
      "name": "Here Comes the Pain",
      "kind": "entrance",
      "setId": "summerslam-series-1",
      "rarity": 4,
      "superstarId": "brock-lesnar",
      "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "strength": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 8,
      "reduce": 5,
      "methodMomentum": "strength"
    }
  },
  "gunther": {
    "id": "gunther",
    "name": "Gunther",
    "nickname": "The Ring General",
    "setId": "summerslam-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-gunther",
    "entranceId": "entrance-gunther",
    "specialId": "special-gunther",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "stomp",
      "gunther-gunther-s-chop",
      "body-slam"
    ],
    "signatures": [
      "gunther-folding-powerbomb",
      "last-symphony"
    ],
    "archetype": "reviewed-starter",
    "hp": 68,
    "methodLimits": {
      "agility": 0,
      "strength": null,
      "strike": null,
      "technical": 2
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 4,
      "technical": 2
    },
    "ability": {
      "name": "Ring General",
      "text": "The first 2 times Gunther connects with a Strike Move dealing 5+ damage, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "connectMethodDamage",
        "method": "strike",
        "minDamage": 5,
        "maxUses": 2,
        "adrenaline": 1,
        "draw": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "counterDrainActionLock",
      "amount": 2
    }
  },
  "beckyLynch": {
    "id": "becky-lynch",
    "name": "Becky Lynch",
    "nickname": "The Man",
    "setId": "evolution-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-becky-lynch",
    "entranceId": "entrance-becky-lynch",
    "specialId": "special-becky-lynch",
    "leadOffIds": [
      "momentum-strike",
      "momentum-technical",
      "punch",
      "running-forearm",
      "arm-drag"
    ],
    "signatures": [
      "becky-lynch-dis-arm-her",
      "becky-lynch-manhandle-slam",
      "becky-lynch-bexploder"
    ],
    "archetype": "reviewed-starter",
    "hp": 64,
    "methodLimits": {
      "agility": 1,
      "strength": 2,
      "strike": null,
      "technical": null
    },
    "starterMomentum": {
      "strength": 2,
      "strike": 5,
      "technical": 5
    },
    "ability": {
      "name": "The Man",
      "text": "The first 3 times Becky connects with a Strike Move, draw 1 page, gain +1 Adrenaline, and her next Technical Move during that Control sequence costs 2 less.",
      "trigger": {
        "type": "strikeDiscountTechnical",
        "maxUses": 3,
        "discount": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 3
    },
    "entrance": {
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
    "special": {
      "type": "counterTutorNamed",
      "name": "Dis-arm-her",
      "amount": 3
    }
  },
  "loganPaul": {
    "id": "logan-paul",
    "name": "Logan Paul",
    "nickname": "The Maverick",
    "setId": "raw-series-1",
    "factionTags": ["vision"],
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-logan-paul",
    "entranceId": "entrance-logan-paul",
    "specialId": "special-logan-paul",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "punch",
      "diving-crossbody",
      "blockbuster"
    ],
    "signatures": [
      "logan-paul-knockout-punch",
      "logan-paul-paulverizer"
    ],
    "archetype": "strike-agility-showman",
    "hp": 62,
    "methodLimits": {
      "agility": null,
      "strength": 2,
      "strike": 4,
      "technical": 0
    },
    "starterMomentum": {
      "agility": 8,
      "strike": 4
    },
    "ability": {
      "name": "Viral Athlete",
      "text": "The first time Logan connects with a Strike Move, gain +1 Strength Momentum. Once per match, if he then connects with an Agility Move in the same Control sequence, draw 1 page.",
      "trigger": {
        "type": "loganViralAthlete",
        "strengthOnFirstStrike": 1,
        "drawAfterStrikeAgility": 1,
        "drawUses": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "brassKnuckles",
      "bonusDamage": 1,
      "stun": 0,
      "requireMethod": "strike",
      "endControl": true
    }
  },
  "solRuca": {
    "id": "sol-ruca",
    "name": "Sol Ruca",
    "nickname": "The Surfer",
    "setId": "raw-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-sol-ruca",
    "entranceId": "entrance-sol-ruca",
    "specialId": "special-sol-ruca",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strength",
      "dropkick",
      "hurricanrana",
      "diving-crossbody"
    ],
    "signatures": [
      "sol-ruca-springboard-splash",
      "sol-ruca-avalanche-x-factor",
      "sol-ruca-sol-snatcher"
    ],
    "archetype": "agility-counter-daredevil",
    "hp": 58,
    "methodLimits": {
      "agility": null,
      "strength": 2,
      "strike": 1,
      "technical": 2
    },
    "starterMomentum": {
      "agility": 8,
      "technical": 2,
      "strength": 2
    },
    "ability": {
      "name": "Daredevil Instincts",
      "text": "The first 3 times each match Sol successfully Counters an opponent's Move, draw 1 page. If the card used to Counter was an Agility Move, it deals +3 Damage.",
      "trigger": {
        "type": "solDaredevil",
        "maxUses": 3,
        "draw": 1,
        "agilityCounterDamage": 3
      },
      "maxUses": 3
    },
    "entrance": {
      "id": "entrance-sol-ruca",
      "name": "Good Vibes",
      "kind": "entrance",
      "setId": "raw-series-1",
      "rarity": 4,
      "superstarId": "sol-ruca",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "agility": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "noWipeout",
      "draw": 1,
      "method": "agility"
    }
  },
  "chadGable": {
    "id": "chad-gable",
    "name": "Chad Gable",
    "nickname": "Master Gable",
    "setId": "raw-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-chad-gable",
    "entranceId": "entrance-chad-gable",
    "specialId": "special-chad-gable",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strength",
      "double-leg-takedown",
      "arm-drag",
      "back-suplex"
    ],
    "signatures": [
      "chad-gable-moonsault",
      "chad-gable-chaos-theory",
      "chad-gable-ankle-lock"
    ],
    "archetype": "technical-strength-olympian",
    "hp": 64,
    "methodLimits": {
      "agility": 2,
      "strength": 4,
      "strike": 0,
      "technical": null
    },
    "starterMomentum": {
      "technical": 7,
      "strength": 5
    },
    "ability": {
      "name": "Olympic Pedigree",
      "text": "The first time Chad connects with a Technical Move, gain +1 Agility Momentum. The first time each match Chad connects with a Technical Move immediately after a Strength Move in the same Control sequence, draw 1 page.",
      "trigger": {
        "type": "gableOlympicPedigree",
        "agilityOnFirstTechnical": 1,
        "drawAfterStrengthTechnical": 1,
        "drawUses": 2
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "moveCounteredDrawDrain",
      "draw": 2,
      "opponentAdrenaline": -1
    }
  },
  "raquelRodriguez": {
    "id": "raquel-rodriguez",
    "name": "Raquel Rodriguez",
    "nickname": "Big Mami Cool",
    "setId": "raw-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-raquel-rodriguez",
    "entranceId": "entrance-raquel-rodriguez",
    "specialId": "special-raquel-rodriguez",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "shoulder-tackle",
      "fallaway-slam",
      "big-boot"
    ],
    "signatures": [
      "raquel-rodriguez-big-boot",
      "raquel-rodriguez-corkscrew-splash",
      "raquel-rodriguez-tejana-bomb"
    ],
    "archetype": "strength-strike-powerhouse",
    "hp": 65,
    "methodLimits": {
      "agility": 1,
      "strength": null,
      "strike": 3,
      "technical": 0
    },
    "starterMomentum": {
      "strength": 8,
      "strike": 4
    },
    "ability": {
      "name": "Unmatched Power",
      "text": "The first time each match Raquel connects with a Strength Move dealing 8+ printed Damage, that Move deals +1 Damage.",
      "trigger": {
        "type": "raquelUnmatchedPower",
        "minPrintedDamage": 8,
        "bonusDamage": 1,
        "maxUses": 1
      },
      "maxUses": 1
    },
    "entrance": {
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
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 10,
      "reduce": 1
    }
  },
  "reyMysterio": {
    "id": "rey-mysterio",
    "name": "Rey Mysterio",
    "nickname": "The Ultimate Underdog",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-rey-mysterio",
    "entranceId": "entrance-rey-mysterio",
    "specialId": "special-rey-mysterio",
    "leadOffIds": [
      "momentum-agility",
      "momentum-technical",
      "dropkick",
      "hurricanrana",
      "arm-drag"
    ],
    "signatures": [
      "619",
      "rey-mysterio-mysterio-express",
      "rey-mysterio-west-coast-pop"
    ],
    "archetype": "agility-technical-lucha-underdog",
    "hp": 57,
    "methodLimits": {
      "agility": null,
      "strength": 0,
      "strike": 2,
      "technical": 3
    },
    "starterMomentum": {
      "agility": 8,
      "technical": 2,
      "strike": 2
    },
    "ability": {
      "name": "The Ultimate Underdog",
      "text": "The first time each match Rey successfully kicks out of a Pin, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "reyUltimateUnderdog",
        "maxUses": 1,
        "draw": 1,
        "firstAdrenaline": 1
      },
      "maxUses": 1
    },
    "entrance": {
      "id": "entrance-rey-mysterio",
      "name": "Booyaka 619",
      "kind": "entrance",
      "setId": "worlds-collide-series-1",
      "rarity": 4,
      "superstarId": "rey-mysterio",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "agility": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "luchaLibreLegend",
      "method": "agility",
      "bonusDamage": 2,
      "retainControl": true
    }
  },
  "dominikMysterio": {
    "id": "dominik-mysterio",
    "name": "Dominik Mysterio",
    "nickname": "Dirty Dom",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-dominik-mysterio",
    "entranceId": "entrance-dominik-mysterio",
    "specialId": "special-dominik-mysterio",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "dropkick",
      "vertical-suplex",
      "hurricanrana"
    ],
    "signatures": [
      "three-amigos",
      "619",
      "dominik-mysterio-frog-splash"
    ],
    "archetype": "agility-strike-technical-heel-lucha",
    "hp": 61,
    "methodLimits": {
      "agility": null,
      "strength": 1,
      "strike": 3,
      "technical": 3
    },
    "starterMomentum": {
      "agility": 7,
      "strike": 3,
      "technical": 2
    },
    "ability": {
      "name": "Nuclear Heat",
      "text": "The first 2 times each match an opponent kicks out of one of Dominik’s Pin attempts, that opponent loses 1 Adrenaline. The first time this happens, draw 1 page.",
      "trigger": {
        "type": "dominikNuclearHeat",
        "maxUses": 2,
        "opponentAdrenaline": -1,
        "firstDraw": 1
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-dominik-mysterio",
      "name": "Dirty Dom",
      "kind": "entrance",
      "setId": "worlds-collide-series-1",
      "rarity": 4,
      "superstarId": "dominik-mysterio",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "agility": 1,
        "strength": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "hammerInBoot",
      "opponentAdrenaline": -2,
      "regainControl": true
    }
  },
  "penta": {
    "id": "penta",
    "name": "Penta",
    "nickname": "Cero Miedo",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-penta",
    "entranceId": "entrance-penta",
    "specialId": "special-penta",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "dropkick",
      "chop",
      "arm-drag"
    ],
    "signatures": [
      "penta-the-sacrifice",
      "penta-driver",
      "penta-mexican-destroyer"
    ],
    "archetype": "agility-strike-technical-hybrid-lucha",
    "hp": 65,
    "methodLimits": {
      "agility": null,
      "strength": 1,
      "strike": 4,
      "technical": 3
    },
    "starterMomentum": {
      "agility": 6,
      "strike": 4,
      "technical": 2
    },
    "ability": {
      "name": "Zero Fear, Zero Mercy",
      "text": "The first 2 times each match Penta connects with a Strike Move immediately after a Technical Move in the same Control sequence, that Strike deals +2 Damage and Penta gains +1 Adrenaline.",
      "trigger": {
        "type": "pentaZeroFearZeroMercy",
        "maxUses": 2,
        "bonusDamage": 2,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-penta",
      "name": "Cero Miedo",
      "kind": "entrance",
      "setId": "worlds-collide-series-1",
      "rarity": 4,
      "superstarId": "penta",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "agility": 1,
        "strength": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "fearlessAssault",
      "afterMethod": "agility",
      "nextMethod": "strike",
      "discount": 2,
      "bonusDamage": 2
    }
  },
  "elGrandeAmericano": {
    "id": "el-grande-americano",
    "name": "El Grande Americano",
    "nickname": "El Grande Americano",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-el-grande-americano",
    "entranceId": "entrance-el-grande-americano",
    "specialId": "special-el-grande-americano",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strike",
      "headbutt",
      "german-suplex",
      "dropkick"
    ],
    "signatures": [
      "el-grande-americano-jumping-headbutt",
      "el-grande-americano-loaded-mask-headbutt"
    ],
    "archetype": "four-method-lucha-opportunist",
    "hp": 64,
    "methodLimits": {
      "agility": 3,
      "strength": 4,
      "strike": 3,
      "technical": null
    },
    "starterMomentum": {
      "technical": 4,
      "strength": 3,
      "agility": 3,
      "strike": 2
    },
    "ability": {
      "name": "Masked Opportunist",
      "text": "The first 2 times each match El Grande Americano connects with a Move whose Method differs from the immediately previous Move he connected with during the same Control sequence, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "differentMethod",
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 3
    },
    "entrance": {
      "id": "entrance-el-grande-americano",
      "name": "Los Americanos",
      "kind": "entrance",
      "setId": "worlds-collide-series-1",
      "rarity": 4,
      "superstarId": "el-grande-americano",
      "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Strength Momentum, +1 Agility Momentum and +1 Strike Momentum, plus +1 Adrenaline.",
      "preMatchMomentum": {
        "technical": 1,
        "strength": 1,
        "agility": 1,
        "strike": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "steelPlate",
      "afterNames": [
        "Headbutt",
        "Jumping Headbutt"
      ],
      "searchName": "Loaded Mask Headbutt",
      "discount": 3
    }
  },
  "jeyUso": {
    "id": "jey-uso",
    "name": "Jey Uso",
    "nickname": "Main Event Jey",
    "setId": "money-in-the-bank-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-jey-uso",
    "entranceId": "entrance-jey-uso",
    "specialId": "special-jey-uso",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "punch",
      "superkick",
      "samoan-drop"
    ],
    "signatures": [
      "spear",
      "uso-splash"
    ],
    "archetype": "strike-strength-main-event",
    "hp": 64,
    "methodLimits": {
      "agility": 2,
      "strength": 4,
      "strike": null,
      "technical": 0
    },
    "starterMomentum": {
      "strike": 6,
      "strength": 4,
      "agility": 2
    },
    "ability": {
      "name": "Main Event Momentum",
      "text": "The first 2 times each match Jey connects with a Strike Move, his next Strength Move during the same Control sequence costs 1 less. If that Strength Move connects, gain +1 Adrenaline.",
      "trigger": {
        "type": "strikeDiscountStrength",
        "maxUses": 2,
        "discount": 1,
        "adrenalineOnStrength": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "yeetTutor",
      "afterName": "Spear",
      "searchName": "Uso Splash",
      "discount": 3
    }
  },
  "laKnight": {
    "id": "la-knight",
    "name": "LA Knight",
    "nickname": "The Megastar",
    "setId": "money-in-the-bank-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-la-knight",
    "entranceId": "entrance-la-knight",
    "specialId": "special-la-knight",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "punch",
      "shoulder-tackle",
      "clothesline"
    ],
    "signatures": [
      "diving-elbow-drop",
      "la-knight-bft"
    ],
    "archetype": "crowd-powered-all-rounder",
    "hp": 64,
    "methodLimits": {
      "agility": 2,
      "strength": 4,
      "strike": null,
      "technical": 3
    },
    "starterMomentum": {
      "strike": 5,
      "strength": 3,
      "technical": 2,
      "agility": 2
    },
    "ability": {
      "name": "The Megastar",
      "text": "The first 2 times each match LA Knight connects with a Move dealing 7+ printed Damage, gain +1 Adrenaline and draw 1 page.",
      "trigger": {
        "type": "laKnightMegastar",
        "maxUses": 2,
        "minPrintedDamage": 7,
        "adrenaline": 1,
        "drawThreshold": 0,
        "draw": 1
      },
      "maxUses": 2
    },
    "entrance": {
      "id": "entrance-la-knight",
      "name": "Let Me Talk to Ya!",
      "kind": "entrance",
      "setId": "money-in-the-bank-series-1",
      "rarity": 4,
      "superstarId": "la-knight",
      "rulesText": "Pre-Match: Begin with +1 Strike Momentum, +1 Strength Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "strike": 1,
        "strength": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
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
  "alexaBliss": {
    "id": "alexa-bliss",
    "name": "Alexa Bliss",
    "nickname": "Five Feet of Fury",
    "setId": "money-in-the-bank-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-alexa-bliss",
    "entranceId": "entrance-alexa-bliss",
    "specialId": "special-alexa-bliss",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "punch",
      "dropkick",
      "forearm-smash"
    ],
    "signatures": [
      "alexa-bliss-sister-abigail",
      "alexa-bliss-twisted-bliss"
    ],
    "archetype": "stun-setup-resource-control",
    "hp": 62,
    "methodLimits": {
      "agility": null,
      "strength": 0,
      "strike": 3,
      "technical": 3
    },
    "starterMomentum": {
      "agility": 6,
      "strike": 3,
      "technical": 3
    },
    "ability": {
      "name": "Five Feet of Fury",
      "text": "The first 2 times each match Alexa connects with a Move while the opponent is already Stunned, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "alexaFiveFeetFury",
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "mindGames",
      "drawOnKickout": 1,
      "adrenalineOnKickout": 1
    }
  },
  "finnBalor": {
    "id": "finn-balor",
    "name": "Finn Bálor",
    "nickname": "The Prince",
    "setId": "money-in-the-bank-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-finn-balor",
    "entranceId": "entrance-finn-balor",
    "specialId": "special-finn-balor",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "dropkick",
      "enzuigiri",
      "sling-blade"
    ],
    "signatures": [
      "finn-balor-1916",
      "finn-balor-coup-de-grace"
    ],
    "archetype": "relentless-control-pace",
    "hp": 64,
    "methodLimits": {
      "agility": null,
      "strength": 1,
      "strike": 4,
      "technical": 3
    },
    "starterMomentum": {
      "agility": 6,
      "strike": 4,
      "technical": 2
    },
    "ability": {
      "name": "Relentless Pace",
      "text": "The first 2 times each match Finn connects with his second or later Move during the same Control sequence, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "secondMoveInControl",
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "balorClubTutor",
      "afterName": "Sling Blade",
      "searchName": "Shotgun Dropkick",
      "discount": 3
    }
  },
  "danhausen": {
    "id": "danhausen",
    "name": "Danhausen",
    "nickname": "Very Nice, Very Evil",
    "setId": "smackdown-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-danhausen",
    "entranceId": "entrance-danhausen",
    "specialId": "special-danhausen",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strike",
      "ddt",
      "punch",
      "big-boot"
    ],
    "signatures": [
      "danhausen-very-nice-knee-vil",
      "danhausen-triple-d"
    ],
    "archetype": "curse-disruption-trickster",
    "hp": 61,
    "methodLimits": {
      "agility": 0,
      "strength": 2,
      "strike": 4,
      "technical": null
    },
    "starterMomentum": {
      "technical": 6,
      "strike": 4,
      "strength": 2
    },
    "ability": {
      "name": "You Are Cursed!",
      "text": "The first 3 times each match an opponent gains Control from Danhausen, their first Move during that Control sequence costs 1 additional Adrenaline. If that Move is successfully Countered, they lose 1 additional Adrenaline.",
      "trigger": {
        "type": "danhausenCurseControl",
        "maxUses": 3,
        "adrenalineCost": 1,
        "counterDrain": 1
      },
      "maxUses": 3
    },
    "entrance": {
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
    "special": {
      "type": "jarOfTeeth",
      "ditchOpponent": 1,
      "opponentAdrenaline": -1,
      "draw": 1
    }
  },
  "tiffanyStratton": {
    "id": "tiffany-stratton",
    "name": "Tiffany Stratton",
    "nickname": "The Center of the Universe",
    "setId": "smackdown-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-tiffany-stratton",
    "entranceId": "entrance-tiffany-stratton",
    "specialId": "special-tiffany-stratton",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strength",
      "dropkick",
      "body-slam",
      "standing-moonsault"
    ],
    "signatures": [
      "tiffany-stratton-handspring-back-elbow",
      "tiffany-stratton-prettiest-moonsault-ever"
    ],
    "archetype": "strength-to-agility-showstopper",
    "hp": 62,
    "methodLimits": {
      "agility": null,
      "strength": 4,
      "technical": 1,
      "strike": 1
    },
    "starterMomentum": {
      "agility": 7,
      "strength": 4,
      "technical": 1
    },
    "ability": {
      "name": "Tiffy Time",
      "text": "Once per Control sequence, after Tiffany connects with a Strength Move that grounds the opponent, her next Agility Move costs 1 less.",
      "trigger": {
        "type": "tiffanyStrengthGroundAgilityDiscount",
        "discount": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "tiffanyEpiphany",
      "methods": [
        "strength",
        "agility"
      ]
    }
  },
  "chelseaGreen": {
    "id": "chelsea-green",
    "name": "Chelsea Green",
    "nickname": "The Hot Mess",
    "setId": "smackdown-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-chelsea-green",
    "entranceId": "entrance-chelsea-green",
    "specialId": "special-chelsea-green",
    "leadOffIds": [
      "momentum-technical",
      "momentum-agility",
      "chain-wrestling",
      "sidestep",
      "ddt"
    ],
    "signatures": [
      "chelsea-green-im-prettier",
      "chelsea-green-green-with-envy"
    ],
    "archetype": "counter-control-opportunist",
    "hp": 61,
    "methodLimits": {
      "agility": 3,
      "strength": 1,
      "strike": 2,
      "technical": null
    },
    "starterMomentum": {
      "technical": 7,
      "agility": 3,
      "strike": 2
    },
    "ability": {
      "name": "The Complaints Department",
      "text": "Once per Control sequence, when Chelsea successfully Counters an opponent’s Move, that opponent loses 1 Adrenaline and Chelsea draws 1 page.",
      "trigger": {
        "type": "chelseaComplaints",
        "opponentAdrenaline": -1,
        "draw": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "fileComplaint",
      "counterDiscount": 1
    }
  },
  "damianPriest": {
    "id": "damian-priest",
    "name": "Damian Priest",
    "nickname": "The Punisher",
    "setId": "smackdown-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-damian-priest",
    "entranceId": "entrance-damian-priest",
    "specialId": "special-damian-priest",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "body-slam",
      "clothesline"
    ],
    "signatures": [
      "damian-priest-south-of-heaven",
      "damian-priest-razors-edge",
      "damian-priest-hit-the-lights"
    ],
    "archetype": "counter-punishment-heavy-hitter",
    "hp": 66,
    "methodLimits": {
      "strength": null,
      "strike": 4,
      "agility": 2,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 7,
      "strike": 4,
      "agility": 1
    },
    "ability": {
      "name": "The Punishment",
      "text": "Once per Control sequence, after Damian successfully Counters a Move, his next Strength or Strike Move deals +3 damage.",
      "trigger": {
        "type": "priestPunishment",
        "damage": 3
      }
    },
    "entrance": {
      "id": "entrance-damian-priest",
      "name": "Rise of the Punisher",
      "kind": "entrance",
      "setId": "smackdown-series-1",
      "rarity": 4,
      "superstarId": "damian-priest",
      "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "strength": 1,
        "strike": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "lastRites",
      "strengthDiscount": 2
    }
  },
  "bronBreakker": {
    "id": "bron-breakker",
    "name": "Bron Breakker",
    "nickname": "The Dog-Faced Gremlin",
    "setId": "survivor-series-series-1",
    "factionTags": ["vision"],
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-bron-breakker",
    "entranceId": "entrance-bron-breakker",
    "specialId": "special-bron-breakker",
    "leadOffIds": [
      "momentum-strength",
      "momentum-agility",
      "punch",
      "dropkick",
      "hurricanrana"
    ],
    "signatures": [
      "bron-breakker-gorilla-press-powerslam",
      "bron-breakker-breakkers-spear",
      "bron-breakker-steiner-recliner"
    ],
    "archetype": "agility-to-strength-acceleration",
    "hp": 68,
    "methodLimits": {
      "strength": null,
      "agility": 4,
      "strike": 3,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 7,
      "agility": 3,
      "strike": 2
    },
    "ability": {
      "name": "Dog-Faced Gremlin",
      "text": "Once per Control sequence, after Bron connects with an Agility Move, his next Strength Move costs 1 less.",
      "trigger": {
        "type": "bronAgilityToStrength",
        "discount": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "fullSpeed",
      "damage": 2,
      "agilityDraw": 1
    }
  },
  "drewMcintyre": {
    "id": "drew-mcintyre",
    "name": "Drew McIntyre",
    "nickname": "The Scottish Warrior",
    "setId": "survivor-series-series-1",
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-drew-mcintyre",
    "entranceId": "entrance-drew-mcintyre",
    "specialId": "special-drew-mcintyre",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "big-boot",
      "clothesline"
    ],
    "signatures": [
      "drew-mcintyre-glasgow-kiss",
      "drew-mcintyre-future-shock-ddt",
      "drew-mcintyre-claymore"
    ],
    "archetype": "precision-heavyweight-claymore-sequencing",
    "hp": 68,
    "methodLimits": {
      "strength": null,
      "strike": 5,
      "technical": 2,
      "agility": 1
    },
    "starterMomentum": {
      "strength": 7,
      "strike": 4,
      "technical": 1
    },
    "ability": {
      "name": "Pick Your Shot",
      "text": "Once per Control sequence, after Drew connects with a Strength Move dealing 6+ Damage, his next Strike Move costs 1 less.",
      "trigger": {
        "type": "drewPickYourShot",
        "minDamage": 6,
        "discount": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "claymoreCountdown",
      "name": "Claymore",
      "discount": 2
    }
  },
  "randyOrton": {
    "id": "randy-orton",
    "name": "Randy Orton",
    "nickname": "The Viper",
    "setId": "survivor-series-series-1",
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-randy-orton",
    "entranceId": "entrance-randy-orton",
    "specialId": "special-randy-orton",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strike",
      "punch",
      "snap-powerslam",
      "ddt"
    ],
    "signatures": [
      "randy-orton-draping-ddt",
      "randy-orton-rko",
      "randy-orton-punt-kick"
    ],
    "archetype": "technical-control-sudden-finish",
    "hp": 65,
    "methodLimits": {
      "technical": null,
      "strength": 4,
      "strike": 4,
      "agility": 2
    },
    "starterMomentum": {
      "technical": 5,
      "strength": 3,
      "strike": 3,
      "agility": 1
    },
    "ability": {
      "name": "Apex Predator",
      "text": "Once per Control sequence, after Randy connects with a Technical Move, his next Move this Control sequence costs 2 less.",
      "trigger": {
        "type": "randyApexPredator",
        "discount": 2
      }
    },
    "entrance": {
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
    "special": {
      "type": "outtaNowhere",
      "name": "RKO",
      "discount": 5
    }
  },
  "samiZayn": {
    "id": "sami-zayn",
    "name": "Sami Zayn",
    "nickname": "The Underdog from the Underground",
    "setId": "survivor-series-series-1",
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-sami-zayn",
    "entranceId": "entrance-sami-zayn",
    "specialId": "special-sami-zayn",
    "leadOffIds": [
      "momentum-technical",
      "momentum-agility",
      "punch",
      "dropkick",
      "arm-drag"
    ],
    "signatures": [
      "sami-zayn-exploder-turnbuckle",
      "sami-zayn-blue-thunder-bomb",
      "sami-zayn-helluva-kick"
    ],
    "archetype": "underdog-comeback-sequencer",
    "hp": 64,
    "methodLimits": {
      "technical": null,
      "agility": 5,
      "strike": 3,
      "strength": 2
    },
    "starterMomentum": {
      "technical": 5,
      "agility": 4,
      "strike": 2,
      "strength": 1
    },
    "ability": {
      "name": "Underdog From the Underground",
      "text": "While Sami has less HP than his opponent, the first Move he plays each Control sequence costs 2 less and deals +4 Damage.",
      "trigger": {
        "type": "samiUnderdog",
        "discount": 2,
        "damage": 4
      }
    },
    "entrance": {
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
    "special": {
      "type": "neverSayDie",
      "hpPct": 0.4,
      "draw": 3,
      "adrenaline": 2
    }
  },
  "jacobFatu": {
    "id": "jacob-fatu",
    "name": "Jacob Fatu",
    "nickname": "The Samoan Werewolf",
    "setId": "survivor-series-series-1",
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-jacob-fatu",
    "entranceId": "entrance-jacob-fatu",
    "specialId": "special-jacob-fatu",
    "leadOffIds": [
      "momentum-strength",
      "momentum-agility",
      "punch",
      "superkick",
      "samoan-drop"
    ],
    "signatures": [
      "jacob-fatu-pop-up-samoan-drop",
      "jacob-fatu-moonsault",
      "jacob-fatu-tongan-death-grip"
    ],
    "archetype": "strength-to-agility-explosive-heavyweight",
    "hp": 68,
    "methodLimits": {
      "strength": null,
      "strike": 5,
      "agility": 4,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 3,
      "agility": 3
    },
    "ability": {
      "name": "All Gas, No Brakes",
      "text": "Once per Control sequence, after Jacob connects with a Strength Move dealing 6+ Damage, his next Agility Move costs 1 less.",
      "trigger": {
        "type": "jacobAllGas",
        "minDamage": 6,
        "discount": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "builtDifferent",
      "minDamage": 8,
      "draw": 0,
      "adrenaline": 1
    }
  },
  "soloSikoa": {
    "id": "solo-sikoa",
    "name": "Solo Sikoa",
    "nickname": "The Street Champion",
    "setId": "survivor-series-series-1",
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-solo-sikoa",
    "entranceId": "entrance-solo-sikoa",
    "specialId": "special-solo-sikoa",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "punch",
      "headbutt",
      "superkick"
    ],
    "signatures": [
      "solo-sikoa-spinning-solo",
      "solo-sikoa-samoan-spike"
    ],
    "archetype": "strike-pressure-samoan-spike",
    "hp": 66,
    "methodLimits": {
      "strike": null,
      "strength": 5,
      "agility": 2,
      "technical": 1
    },
    "starterMomentum": {
      "strike": 6,
      "strength": 5,
      "agility": 1
    },
    "ability": {
      "name": "Street Champion",
      "text": "Once per Control sequence, the first time Solo connects with a Strike Move dealing 5+ Damage, the opponent loses 1 Adrenaline.",
      "trigger": {
        "type": "soloStreetChampion",
        "minDamage": 5,
        "opponentAdrenaline": -1
      }
    },
    "entrance": {
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
    "special": {
      "type": "soleSurvivor",
      "draw": 2,
      "adrenaline": 1
    }
  },
  "jadeCargill": {
    "id": "jade-cargill",
    "name": "Jade Cargill",
    "nickname": "The Storm",
    "setId": "survivor-series-series-1",
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-jade-cargill",
    "entranceId": "entrance-jade-cargill",
    "specialId": "special-jade-cargill",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "shoulder-block",
      "superkick"
    ],
    "signatures": [
      "pump-kick",
      "jade-cargill-jaded"
    ],
    "archetype": "dominant-power-athlete-jaded-sequencing",
    "hp": 67,
    "methodLimits": {
      "strength": null,
      "strike": 5,
      "agility": 3,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 4,
      "agility": 2
    },
    "ability": {
      "name": "Believe the Hype",
      "text": "Once per Control sequence, the first time Jade connects with a Move dealing 7+ Damage, gain +1 Adrenaline.",
      "trigger": {
        "type": "jadeBelieveHype",
        "minDamage": 7,
        "adrenaline": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "superhuman",
      "afterMethod": "strength",
      "draw": 1,
      "bonusDamage": 2
    }
  },
  "niaJax": {
    "id": "nia-jax",
    "name": "Nia Jax",
    "nickname": "The Irresistible Force",
    "setId": "survivor-series-series-1",
    "era": null,
    "seasonExclusive": false,
    "developmentOnly": true,
    "cardId": "superstar-nia-jax",
    "entranceId": "entrance-nia-jax",
    "specialId": "special-nia-jax",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "shoulder-block",
      "body-slam"
    ],
    "signatures": [
      "nia-jax-avalanche-samoan-drop",
      "nia-jax-annihilator"
    ],
    "archetype": "durable-grounded-powerhouse-annihilator",
    "hp": 69,
    "methodLimits": {
      "strength": null,
      "strike": 4,
      "agility": 2,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 7,
      "strike": 4,
      "agility": 1
    },
    "ability": {
      "name": "Crushing Weight",
      "text": "Once per Control sequence, after Nia connects with a Strength Move that grounds the opponent, her next Move against a grounded opponent costs 1 less.",
      "trigger": {
        "type": "niaCrushingWeight",
        "discount": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 10,
      "reduce": 4,
      "adrenaline": 1
    }
  },
  "goldberg": {
    "id": "goldberg",
    "name": "Goldberg",
    "nickname": "Who’s Next?",
    "setId": "season-2-whos-next",
    "era": "wcw-streak",
    "seasonExclusive": true,
    "developmentOnly": true,
    "cardId": "superstar-goldberg",
    "entranceId": "entrance-goldberg",
    "specialId": "special-goldberg",
    "leadOffIds": [
      "momentum-strength",
      "momentum-strike",
      "punch",
      "shoulder-block",
      "body-slam"
    ],
    "signatures": [
      "goldberg-military-press-powerslam",
      "goldberg-spear",
      "goldberg-jackhammer"
    ],
    "archetype": "prestige-streak-snowball",
    "hp": 69,
    "methodLimits": {
      "strength": null,
      "strike": null,
      "agility": 2,
      "technical": 1
    },
    "starterMomentum": {
      "strength": 6,
      "strike": 6
    },
    "ability": {
      "name": "The Streak",
      "text": "Whenever Goldberg connects with a Move dealing 5+ Damage, gain 1 Streak counter, maximum 3. Each Streak counter reduces the cost of Goldberg’s Trademarks and Finishers by 1 while he keeps Control. Lose all Streak counters when Goldberg loses Control.",
      "trigger": {
        "type": "goldbergStreak",
        "minDamage": 5,
        "maxStreak": 3,
        "discountPerStreak": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "goldberg173",
      "adrenaline": 1,
      "draw": 1,
      "retainControl": true,
      "preserveStreak": true
    }
  },
  "joeHendry": {
    "id": "joe-hendry",
    "name": "Joe Hendry",
    "nickname": "The Crowd Believes",
    "setId": "raw-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-joe-hendry",
    "entranceId": "entrance-joe-hendry",
    "specialId": "special-joe-hendry",
    "leadOffIds": [
      "momentum-strength",
      "momentum-technical",
      "test-of-strength",
      "double-leg-takedown",
      "body-slam"
    ],
    "signatures": [
      "joe-hendry-freak-of-nature",
      "joe-hendry-hendry-slam",
      "joe-hendry-hendry-lock",
      "joe-hendry-standing-ovation"
    ],
    "archetype": "strength-technical-showman",
    "hp": 63,
    "methodLimits": {
      "strength": null,
      "technical": 4,
      "strike": 2,
      "agility": 1
    },
    "starterMomentum": {
      "strength": 7,
      "technical": 4,
      "strike": 1
    },
    "ability": {
      "name": "The Crowd Believes",
      "text": "Once per Control sequence, after Joe connects with a shared Move, his next Joe Hendry-exclusive Move costs 1 less this Control sequence.",
      "trigger": {
        "type": "joeCrowdBelieves",
        "discount": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "joeBelieve",
      "discount": 1
    }
  },
  "roxannePerez": {
    "id": "roxanne-perez",
    "name": "Roxanne Perez",
    "nickname": "The Prodigy",
    "setId": "raw-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-roxanne-perez",
    "entranceId": "entrance-roxanne-perez",
    "specialId": "special-roxanne-perez",
    "leadOffIds": [
      "momentum-agility",
      "momentum-technical",
      "dropkick",
      "arm-drag",
      "russian-leg-sweep"
    ],
    "signatures": [
      "roxanne-perez-russian-leg-sweep",
      "roxanne-perez-meteora",
      "roxanne-perez-rok-lock",
      "roxanne-perez-pop-rox"
    ],
    "archetype": "agility-technical-prodigy",
    "hp": 57,
    "methodLimits": {
      "agility": null,
      "technical": 4,
      "strike": 3,
      "strength": 0
    },
    "starterMomentum": {
      "agility": 6,
      "technical": 4,
      "strike": 2
    },
    "ability": {
      "name": "Prodigy Instinct",
      "text": "The first 2 times each match Roxanne connects with an Agility Move immediately after a Technical Move in the same Control sequence, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "agilityAfterTechnical",
        "maxUses": 2,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 2
    },
    "entrance": {
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
    "special": {
      "type": "roxanneProdigy",
      "maxCost": 4,
      "methods": ["agility", "technical"],
      "discount": 1
    }
  }
  ,
  "austinTheory": {
    "id": "austin-theory",
    "name": "Austin Theory",
    "nickname": "The Future Is Now",
    "setId": "raw-series-1",
    "factionTags": ["vision"],
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-austin-theory",
    "entranceId": "entrance-austin-theory",
    "specialId": "special-austin-theory",
    "leadOffIds": [
      "momentum-strike",
      "momentum-strength",
      "dropkick",
      "firemans-carry",
      "superkick"
    ],
    "signatures": [
      "austin-theory-ataxia",
      "austin-theory-rolling-thunder-blockbuster",
      "austin-theory-patella-brainbuster",
      "austin-theory-a-town-down"
    ],
    "archetype": "strike-grapple-future-now",
    "hp": 61,
    "methodLimits": {
      "strike": null,
      "strength": 4,
      "agility": 3,
      "technical": 2
    },
    "starterMomentum": {
      "strike": 6,
      "strength": 2,
      "agility": 2,
      "technical": 2
    },
    "ability": {
      "name": "The Future Is Now",
      "text": "Once per Control sequence, after Theory connects with a Strike Move, his next Grapple Move costs 1 less this Control sequence.",
      "trigger": {
        "type": "theoryFutureIsNow",
        "discount": 1
      }
    },
    "entrance": {
      "id": "entrance-austin-theory",
      "name": "This Is Me",
      "kind": "entrance",
      "setId": "raw-series-1",
      "rarity": 4,
      "superstarId": "austin-theory",
      "rulesText": "Pre-Match: Begin with +1 Strike Momentum, +1 Strength Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "strike": 1,
        "strength": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "austinTheoryAllDay",
      "drawOnConnect": 1
    }
  }  ,
  "montezFord": {
    "id": "montez-ford",
    "name": "Montez Ford",
    "nickname": "The Street Profits",
    "setId": "raw-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-montez-ford",
    "entranceId": "entrance-montez-ford",
    "specialId": "special-angelo-dawkins",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "dropkick",
      "running-forearm",
      "hurricanrana"
    ],
    "signatures": [
      "montez-ford-spinebuster",
      "montez-ford-blockbuster",
      "montez-ford-450-splash",
      "montez-ford-from-the-heavens"
    ],
    "archetype": "agility-strike-take-flight",
    "hp": 60,
    "methodLimits": {
      "agility": null,
      "strike": 4,
      "strength": 3,
      "technical": 2
    },
    "starterMomentum": {
      "agility": 6,
      "strike": 3,
      "strength": 2,
      "technical": 1
    },
    "ability": {
      "name": "Take Flight",
      "text": "Once per Control sequence, after Montez connects with a non-Aerial Move, his next Aerial Move costs 1 less this Control sequence.",
      "trigger": {
        "type": "montezTakeFlight",
        "discount": 1
      }
    },
    "entrance": {
      "id": "entrance-montez-ford",
      "name": "We Want The Smoke",
      "kind": "entrance",
      "setId": "raw-series-1",
      "rarity": 4,
      "superstarId": "montez-ford",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strike Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "agility": 1,
        "strike": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "angeloDawkinsRunIn",
      "linkedCardId": "linked-street-profits-revelation"
    }
  }  ,
  "lolaVice": {
    "id": "lola-vice",
    "name": "Lola Vice",
    "nickname": "The Latina Heat",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-lola-vice",
    "entranceId": "entrance-lola-vice",
    "specialId": "special-lola-vice",
    "leadOffIds": [
      "momentum-strike",
      "momentum-technical",
      "punch",
      "leg-kick",
      "spinning-back-kick"
    ],
    "signatures": [
      "lola-vice-running-hip-attack",
      "lola-vice-spinning-heel-kick",
      "lola-vice-triangle-choke",
      "lola-vice-305"
    ],
    "archetype": "strike-technical-mma-counter-striker",
    "hp": 59,
    "methodLimits": {
      "strike": null,
      "technical": 4,
      "agility": 2,
      "strength": 1
    },
    "starterMomentum": {
      "strike": 7,
      "technical": 4,
      "agility": 1
    },
    "ability": {
      "name": "Counter Striker",
      "text": "Once per Control sequence, after Lola successfully Counters an opponent’s Move, her next Strike Move costs 1 less and deals +1 Damage this Control sequence.",
      "trigger": {
        "type": "lolaCounterStriker",
        "discount": 1,
        "damage": 1
      }
    },
    "entrance": {
      "id": "entrance-lola-vice",
      "name": "Te Lo Rompo",
      "kind": "entrance",
      "setId": "worlds-collide-series-1",
      "rarity": 4,
      "superstarId": "lola-vice",
      "rulesText": "Pre-Match: Begin with +1 Strike Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "strike": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "lolaFistsDontLie",
      "opponentAdrenaline": -2,
      "drawIfZero": 1
    }
  }
  ,
  "dragonLee": {
    "id": "dragon-lee",
    "name": "Dragon Lee",
    "nickname": "The Boy Wonder",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-dragon-lee",
    "entranceId": "entrance-dragon-lee",
    "specialId": "special-dragon-lee",
    "leadOffIds": [
      "momentum-agility",
      "momentum-technical",
      "hurricanrana",
      "tilt-a-whirl-headscissors",
      "arm-drag"
    ],
    "signatures": [
      "dragon-lee-operation-dragon",
      "dragon-lee-incinerator",
      "dragon-lee-double-foot-stomp",
      "dragon-lee-dragon-driver"
    ],
    "archetype": "agility-technical-hybrid",
    "hp": 58,
    "methodLimits": {
      "agility": null,
      "technical": 4,
      "strike": 3,
      "strength": 2
    },
    "starterMomentum": {
      "agility": 6,
      "technical": 3,
      "strike": 2,
      "strength": 1
    },
    "ability": {
      "name": "Hybrid Athlete",
      "text": "Once per Control sequence, after Dragon Lee connects with an Aerial Move, his next Technical Move costs 1 less this Control sequence; or after he connects with a Technical Move, his next Aerial Move costs 1 less this Control sequence. Only the first qualifying transition triggers each Control sequence.",
      "trigger": {
        "type": "dragonHybridAthlete",
        "discount": 1
      }
    },
    "entrance": {
      "id": "entrance-dragon-lee",
      "name": "Control the Empire",
      "kind": "entrance",
      "setId": "worlds-collide-series-1",
      "rarity": 4,
      "superstarId": "dragon-lee",
      "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
      "preMatchMomentum": {
        "agility": 1,
        "technical": 1
      },
      "preMatchAdrenaline": 1,
      "delayedTurn5": false
    },
    "special": {
      "type": "dragonLuchaLegacy",
      "maxCost": 5,
      "methods": ["agility", "technical"],
      "discount": 1
    }
  }

  ,
  "hijoDelVikingo": {
    "id": "hijo-del-vikingo",
    "name": "Hijo del Vikingo",
    "nickname": "El Hijo del Vikingo",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-hijo-del-vikingo",
    "entranceId": "entrance-hijo-del-vikingo",
    "specialId": "special-hijo-del-vikingo",
    "leadOffIds": [
      "momentum-agility",
      "momentum-technical",
      "springboard-crossbody",
      "hurricanrana",
      "dropkick"
    ],
    "signatures": [
      "vikingo-mexican-destroyer",
      "vikingo-twisting-450-splash",
      "vikingo-top-rope-poison-rana",
      "vikingo-el-cuerno-del-vikingo"
    ],
    "archetype": "agility-aerial-specialist",
    "hp": 57,
    "methodLimits": {
      "agility": null,
      "technical": 3,
      "strike": 2,
      "strength": 1
    },
    "starterMomentum": {
      "agility": 8,
      "technical": 2,
      "strike": 2
    },
    "ability": {
      "name": "Jinete del Aire",
      "text": "Once per Control sequence, after Vikingo connects with a Running Aerial Move, his next Diving Aerial Move costs 2 less this Control sequence.",
      "trigger": {
        "type": "vikingoJineteDelAire",
        "discount": 2
      }
    },
    "entrance": {
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
    "special": {
      "type": "vikingoElOjoProtection",
      "adrenaline": 1,
      "draw": 1
    }
  }


  ,
  "mrIguana": {
    "id": "mr-iguana",
    "name": "Mr. Iguana",
    "nickname": "Mr. Iguana",
    "setId": "worlds-collide-series-1",
    "era": null,
    "seasonExclusive": false,
    "cardId": "superstar-mr-iguana",
    "entranceId": "entrance-mr-iguana",
    "specialId": "special-mr-iguana",
    "leadOffIds": [
      "momentum-agility",
      "momentum-technical",
      "hurricanrana",
      "arm-drag",
      "dropkick"
    ],
    "signatures": [
      "mr-iguana-iguanarana",
      "mr-iguana-pongase-verde",
      "mr-iguana-muta-lock",
      "mr-iguana-chalino-driver"
    ],
    "archetype": "agility-technical-trickster",
    "hp": 58,
    "methodLimits": {
      "agility": null,
      "technical": 4,
      "strike": 2,
      "strength": 1
    },
    "starterMomentum": {
      "agility": 7,
      "technical": 3,
      "strike": 2
    },
    "ability": {
      "name": "Play Dead",
      "text": "Once per match, after an opponent connects with a Move that grounds Mr. Iguana, you may draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "iguanaPlayDead",
        "maxUses": 1,
        "draw": 1,
        "adrenaline": 1
      }
    },
    "entrance": {
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
    "special": {
      "type": "iguanaLaYesca",
      "discount": 1,
      "opponentAdrenaline": -1
    }
  }


  ,
  "bretHart": {
    "id": "bret-hart",
    "name": "Bret Hart",
    "nickname": "The Hit Man",
    "setId": "new-generation-series-1",
    "era": "1993–1995 New Generation",
    "developmentOnly": true,
    "seasonExclusive": false,
    "cardId": "superstar-bret-hart",
    "entranceId": "entrance-bret-hart",
    "specialId": "special-bret-hart",
    "leadOffIds": [
      "momentum-technical",
      "momentum-strength",
      "russian-leg-sweep",
      "snap-suplex",
      "european-uppercut"
    ],
    "signatures": [
      "bret-hart-inverted-atomic-drop",
      "bret-hart-pendulum-backbreaker",
      "bret-hart-second-rope-elbow-drop",
      "bret-hart-sharpshooter"
    ],
    "archetype": "technical-three-method-sequencer",
    "hp": 64,
    "methodLimits": {
      "technical": null,
      "strength": 3,
      "strike": 3,
      "agility": 2
    },
    "starterMomentum": {
      "technical": 6,
      "strength": 3,
      "strike": 3
    },
    "ability": {
      "name": "Excellence of Execution",
      "text": "The first 3 times each match Bret connects with a Move whose Method differs from the immediately previous Move he connected with, draw 2 pages.",
      "trigger": {
        "type": "differentMethod",
        "maxUses": 3,
        "draw": 2
      },
      "maxUses": 3
    },
    "entrance": {
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
    "special": {
      "type": "counterTutorNamed",
      "name": "Sharpshooter",
      "amount": 2
    }
  },
  "shawnMichaels": {
    "id": "shawn-michaels",
    "name": "Shawn Michaels",
    "nickname": "The Heartbreak Kid",
    "setId": "new-generation-series-1",
    "era": "1993–1995 New Generation",
    "developmentOnly": true,
    "seasonExclusive": false,
    "cardId": "superstar-shawn-michaels",
    "entranceId": "entrance-shawn-michaels",
    "specialId": "special-shawn-michaels",
    "leadOffIds": [
      "momentum-agility",
      "momentum-strike",
      "dropkick",
      "running-forearm",
      "hurricanrana"
    ],
    "signatures": [
      "shawn-michaels-flying-forearm",
      "shawn-michaels-teardrop-suplex",
      "shawn-michaels-top-rope-elbow-drop",
      "shawn-michaels-sweet-chin-music"
    ],
    "archetype": "agility-strike-showstopper",
    "hp": 61,
    "methodLimits": {
      "agility": null,
      "strike": 4,
      "technical": 3,
      "strength": 1
    },
    "starterMomentum": {
      "agility": 6,
      "strike": 4,
      "technical": 2
    },
    "ability": {
      "name": "Heartbreak Kid",
      "text": "The first 3 times each match Shawn connects with an Agility Move after connecting with a Strike Move in the same Control sequence, draw 1 page and gain +1 Adrenaline.",
      "trigger": {
        "type": "agilityAfterStrike",
        "maxUses": 3,
        "draw": 1,
        "adrenaline": 1
      },
      "maxUses": 3
    },
    "entrance": {
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
    "special": {
      "type": "hbkShowstopper",
      "discount": 1
    }
  }


  ,
  "razorRamon": {
    "id": "razor-ramon",
    "name": "Razor Ramon",
    "nickname": "The Bad Guy",
    "setId": "new-generation-series-1",
    "era": "1993–1995 New Generation",
    "developmentOnly": true,
    "seasonExclusive": false,
    "cardId": "superstar-razor-ramon",
    "entranceId": "entrance-razor-ramon",
    "specialId": "special-razor-ramon",
    "leadOffIds": ["momentum-strength","momentum-strike","fallaway-slam","punch","running-powerslam"],
    "signatures": ["razor-ramon-fallaway-slam","razor-ramon-running-powerslam","razor-ramon-chokeslam","razor-ramon-razors-edge"],
    "archetype": "strength-strike-bad-guy",
    "hp": 64,
    "methodLimits": {"strength": null,"strike": 4,"technical": 3,"agility": 1},
    "starterMomentum": {"strength": 6,"strike": 4,"technical": 2},
    "ability": {
      "name": "Oozing Machismo",
      "text": "Once per match, when Razor connects with a Strength Move costing 5 or more, gain +1 Adrenaline.",
      "trigger": {"type": "connectMethodCost","method": "strength","minCost": 5,"maxUses": 1,"adrenaline": 1},
      "maxUses": 1
    },
    "entrance": {
      "id": "entrance-razor-ramon","name": "The Bad Guy","kind": "entrance","setId": "new-generation-series-1","rarity": 4,"superstarId": "razor-ramon",
      "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
      "preMatchMomentum": {"strength": 1,"strike": 1},"preMatchAdrenaline": 1,"delayedTurn5": false
    },
    "special": {"type": "exclusiveTrademarkTutor","discount": 1}
  }


  ,
  "diesel": {
    "id": "diesel",
    "name": "Diesel",
    "nickname": "Big Daddy Cool",
    "setId": "new-generation-series-1",
    "era": "1993–1995 New Generation",
    "developmentOnly": true,
    "seasonExclusive": false,
    "cardId": "superstar-diesel",
    "entranceId": "entrance-diesel",
    "specialId": "special-diesel",
    "leadOffIds": ["momentum-strength","momentum-strike","big-boot","sidewalk-slam","punch"],
    "signatures": ["diesel-snake-eyes","diesel-big-boot","diesel-sidewalk-slam","diesel-jackknife-powerbomb"],
    "archetype": "strength-strike-big-daddy-cool",
    "hp": 69,
    "methodLimits": {"strength": null,"strike": 4,"technical": 2,"agility": 1},
    "starterMomentum": {"strength": 7,"strike": 4,"technical": 1},
    "ability": {
      "name": "Big Daddy Cool",
      "text": "Once per match, after Diesel takes 8+ Damage from a connected Move, gain +1 Adrenaline.",
      "trigger": {"type": "takeDamage","minDamage": 8,"maxUses": 1,"adrenaline": 1},
      "maxUses": 1
    },
    "entrance": {
      "id": "entrance-diesel","name": "Diesel Power","kind": "entrance","setId": "new-generation-series-1","rarity": 4,"superstarId": "diesel",
      "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
      "preMatchMomentum": {"strength": 1,"strike": 1},"preMatchAdrenaline": 1,"delayedTurn5": false
    },
    "special": {"type": "exclusiveTrademarkTutor","discount": 1}
  }


};
