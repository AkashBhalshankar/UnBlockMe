/**
 * Deterministic Combinatorial Grammar Matrix
 * Generates nuanced, grounded, emotionally resonant peace offerings
 * across 5 relational categories and 5 gravity levels without remote LLMs.
 */

export const RELATIONSHIPS = [
  {
    id: 'situationship',
    label: 'Situationship',
    icon: 'interests',
    tagline: 'Undefined, brittle tension',
    description: 'Ambiguous dating, slow fading, unspoken expectations, and missed signals.'
  },
  {
    id: 'best_friend',
    label: 'Best Friend',
    icon: 'groups',
    tagline: 'Shared history, deep trust',
    description: 'Longtime friends, canceled plans, delayed check-ins, and drifted momentum.'
  },
  {
    id: 'partner',
    label: 'Partner',
    icon: 'favorite',
    tagline: 'Daily intimacy & roots',
    description: 'Romantic partners, shared households, lovers, or long-term spouses.'
  },
  {
    id: 'sibling_family',
    label: 'Sibling / Family',
    icon: 'family_restroom',
    tagline: 'Lifelong instinctual reflex',
    description: 'Sibling rivalries, holiday friction, generational misunderstandings.'
  },
  {
    id: 'birthday_special',
    label: 'Birthday Olive Branch',
    icon: 'cake',
    tagline: 'Milestone peace offering',
    description: 'Stepping across silence specifically because a personal milestone matters more than ego.'
  },
  {
    id: 'coworker',
    label: 'Coworker',
    icon: 'badge',
    tagline: 'Professional, bound ego',
    description: 'Workplace tension, project disagreements, meeting defensiveness.'
  }
];

export const GRAVITY_LEVELS = {
  1: {
    level: 1,
    badge: 'Level 1',
    label: 'Silly / Low Stakes',
    title: 'Silly Minor Rift (Lighthearted banter)',
    subtitle: 'Harmless friction, stolen fries, inside jokes blown out of proportion.',
    description: 'A harmless slip or petty stubbornness. A playful, humorous gesture dissolves the friction immediately.',
    gateText: 'Unlocking requires a light spring padlock tap.'
  },
  2: {
    level: 2,
    badge: 'Level 2',
    label: 'Awkward Slip-up',
    title: 'Awkward Slip (Missed timing, flakey response)',
    subtitle: 'Neglected texts, cancelled coffee, accidental oversight.',
    description: 'Casual trust was lightly bruised by poor communication. An honest acknowledgment resets the baseline.',
    gateText: 'Unlocking requires a calibrated slide tension swipe.'
  },
  3: {
    level: 3,
    badge: 'Level 3',
    label: 'Mid Friction',
    title: 'Medium Friction (Unspoken tension)',
    subtitle: 'Passive standoff, defensive words, lingering chill.',
    description: 'Passive friction and slow fades. A polite, grounded bridge is required before bitterness calcifies.',
    gateText: 'Unlocking requires passing through the Shackle Friction Drag ritual.'
  },
  4: {
    level: 4,
    badge: 'Level 4',
    label: 'Heavy Slump',
    title: 'Cold Silence (Ghosting, defensiveness, unfair silence)',
    subtitle: 'High emotional guardrails, unaddressed hurt feelings.',
    description: 'A substantial emotional wall. Genuine remorse and zero justifications are necessary to re-open contact.',
    gateText: 'Unlocking requires deliberate tactile drag overcoming full friction resistance.'
  },
  5: {
    level: 5,
    badge: 'Level 5',
    label: 'Severed Bond',
    title: 'Severed Bond (Deep fracture requiring space & repair)',
    subtitle: 'Full accountability, profound apologies, no demands on recipient.',
    description: 'A profound fracture that threatened the entire relationship. Requires absolute sincerity and unhurried grace.',
    gateText: 'Unlocking requires unbreakable dual-step verification before letter reveal.'
  }
};

export const TOKEN_BANKS = {
  trigger: {
    name: 'The Relational Catalyst',
    description: 'The specific moment or behavior that created distance',
    options: [
      'I ghosted when things got real',
      'I went radio-silent for days without an explanation',
      'I canceled our plans at the very last second',
      'I snapped defensively during that disagreement',
      'I brushed off your legitimate boundary as an overreaction',
      'I forgot a date that meant the world to you',
      'I let petty pride keep me from reaching out first',
      'I let cold silence drag out way longer than it should have'
    ],
    byCategory: {
      birthday_special: [
        "I let our silence stretch all the way to your birthday",
        "I almost let awkwardness stop me from wishing you happy birthday",
        "we haven't spoken in months despite this big milestone"
      ],
      sibling_family: [
        "I brought old family baggage into a harmless discussion",
        "I let stubborn sibling pride shut down our conversation",
        "I dismissed your perspective during our family dinner"
      ],
      partner: [
        "I snapped defensively when you were just expressing your need",
        "I shut down and walked away instead of listening with an open heart",
        "I let exhaustion turn into unnecessary sharpness towards you"
      ],
      best_friend: [
        "I became flakey and dropped off the face of the earth",
        "I canceled last minute when you were counting on me",
        "I failed to check in when I knew you were going through a tough stretch"
      ]
    }
  },
  fault: {
    name: 'The Self-Admitted Mechanism',
    description: 'The internal reflex or ego failure you take ownership for',
    options: [
      'let my defensiveness do the talking',
      'hid behind passive-aggressive sarcasm instead of being honest',
      'prioritized my bruised pride over our bond',
      'refused to acknowledge where you were hurting',
      'assumed the worst of your intentions instead of asking',
      'retreated into cowardice because vulnerability felt scary',
      'expected you to read my mind while giving you zero clarity',
      'acted stubborn just to avoid saying I made a mistake'
    ],
    byCategory: {
      birthday_special: [
        "realized that holding onto a silly rift on your special day is absurd",
        "knew that celebrating you matters ten times more than who was right",
        "refused to let another year tick by without telling you I miss you"
      ],
      sibling_family: [
        "fell back into our old teenage argumentative habits",
        "let silly family stubbornness get between us",
        "forgot that you are my family and that comes before any petty dispute"
      ],
      partner: [
        "let my insecurities build a fortress instead of an honest bridge",
        "forgot to treat your softness with the gentle respect it deserves",
        "reacted to my own fear instead of responding to your words"
      ]
    }
  },
  remedy: {
    name: 'The Truce Offering',
    description: 'The concrete peace offering and zero-pressure terms',
    options: [
      'dinner at your favorite spot, my bill, no excuses',
      'I admit without condition or asterisk that you were 100% right',
      'giving you full aux cord and venue custody for our next three outings',
      'a quiet coffee together with zero defensive rebuttals or lectures',
      'whatever quiet space and boundary you need, on your clock',
      'an unconditional pardon with fresh slate status starting now',
      'a walk in the park where I just listen while you speak freely',
      'a home-cooked meal and an open ear whenever you are ready'
    ],
    byCategory: {
      birthday_special: [
        "your favorite birthday cake or drink delivered, completely on me",
        "a zero-pressure birthday dinner on whatever day works for you",
        "an unconditional birthday peace treaty with no awkward rehashing"
      ],
      sibling_family: [
        "a truce over our favorite childhood takeout, zero past debates allowed",
        "I will take your shift on family duties this entire holiday season",
        "a quiet phone call just to catch up on life without politics or baggage"
      ],
      partner: [
        "an entire uninterrupted evening where I cook, clean, and listen",
        "an honest conversation with zero defensive counter-arguments",
        "a slow weekend together with our phones turned completely off"
      ]
    }
  }
};

export const QUICK_PRESETS = {
  ghosted: {
    label: 'Ghosted / Lukewarm',
    relationship: 'situationship',
    gravity: 4,
    tokens: {
      trigger: 'I ghosted when things got real',
      fault: 'let my defensiveness do the talking',
      remedy: 'a quiet coffee together with zero defensive rebuttals or lectures'
    }
  },
  canceled: {
    label: 'Canceled Plans',
    relationship: 'best_friend',
    gravity: 2,
    tokens: {
      trigger: 'I canceled our plans at the very last second',
      fault: 'refused to acknowledge where you were hurting',
      remedy: 'dinner at your favorite spot, my bill, no excuses'
    }
  },
  misunderstanding: {
    label: 'Heated Misunderstanding',
    relationship: 'partner',
    gravity: 3,
    tokens: {
      trigger: 'I snapped defensively during that disagreement',
      fault: 'prioritized my bruised pride over our bond',
      remedy: 'I admit without condition or asterisk that you were 100% right'
    }
  },
  silly: {
    label: 'Silly Minor Rift',
    relationship: 'sibling_family',
    gravity: 1,
    tokens: {
      trigger: 'I brushed off your legitimate boundary as an overreaction',
      fault: 'hid behind passive-aggressive sarcasm instead of being honest',
      remedy: 'giving you full aux cord and venue custody for our next three outings'
    }
  },
  birthday: {
    label: 'Birthday Olive Branch',
    relationship: 'birthday_special',
    gravity: 3,
    tokens: {
      trigger: 'I let our silence stretch all the way to your birthday',
      fault: 'knew that celebrating you matters ten times more than who was right',
      remedy: 'your favorite birthday cake or drink delivered, completely on me'
    }
  }
};

/**
 * Returns structured paragraphs tailored to relationship dynamic and gravity level.
 */
export function getLetterStructure(relationship, gravity, tokens) {
  const g = Number(gravity) || 3;
  const isBday = relationship === 'birthday_special';

  let opener = '';
  if (isBday) {
    opener = `First and foremost: Happy Birthday. I am stepping past my pride because celebrating your existence matters infinitely more to me than holding onto awkward silence. When `;
  } else if (g <= 2) {
    opener = `I am cutting through the hesitation because our connection is too valuable to let silly misunderstandings fester. Looking back to when `;
  } else if (g === 3) {
    opener = `I am stepping past my pride because this matters more to me than winning an argument. When `;
  } else {
    opener = `I am writing this because you deserved better than my silence or my justifications. When `;
  }

  const p1Suffix = `, I know it created an unnecessary distance between us.`;

  let p2 = '';
  if (isBday) {
    p2 = `Looking back honestly, I `;
  } else if (g <= 2) {
    p2 = `Honestly, I `;
  } else {
    p2 = `Looking back honestly, I `;
  }

  const p2Mid = ` instead of just being vulnerable and listening to where you were coming from. You didn’t deserve the cold shoulder or the confusion that followed.`;

  let p3Lead = `If you are open to clearing the air on your own terms, my offer is on the table: `;
  if (g >= 4) {
    p3Lead = `There are zero strings attached and zero expectations that you reply immediately, but my olive branch is open: `;
  }
  const p3Suffix = `. No lectures, no rehashing who said what first.`;

  return {
    opener,
    p1Suffix,
    p2,
    p2Mid,
    p3Lead,
    p3Suffix
  };
}

export function getRandomTokensFor(relationship) {
  const getRand = (bankKey) => {
    const bank = TOKEN_BANKS[bankKey];
    const catOptions = bank.byCategory?.[relationship];
    const pool = catOptions && catOptions.length ? [...bank.options, ...catOptions] : bank.options;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  return {
    trigger: getRand('trigger'),
    fault: getRand('fault'),
    remedy: getRand('remedy')
  };
}
