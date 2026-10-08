import { DecisionEvent } from '../types';

export const RANDOM_EVENTS_DATABASE: DecisionEvent[] = [
  // CHILDHOOD (Ages 3-12)
  {
    id: 'child_1',
    title: 'Playground Bully',
    description: 'A kid named Timmy in your class pushes you off the swings and demands your lunch money!',
    category: 'school',
    minAge: 5,
    maxAge: 12,
    options: [
      {
        text: 'Report him to the teacher',
        resultText: 'The teacher scolded Timmy and sent him to detention. You got your swing back!',
        statChanges: { happiness: 10, karma: 5 }
      },
      {
        text: 'Stand up and fight back',
        resultText: 'You shoved Timmy into the sandbox! You gained respect among classmates, but got a scraped elbow.',
        statChanges: { happiness: 15, health: -5, looks: -2 }
      },
      {
        text: 'Hand over your lunch money',
        resultText: 'Timmy took your $2 and laughed as he ran away. You went hungry at lunch.',
        statChanges: { happiness: -15, health: -5 }
      }
    ]
  },
  {
    id: 'child_2',
    title: 'Stray Kitten',
    description: 'You find a tiny shivering kitten sitting behind your house in a cardboard box.',
    category: 'random',
    minAge: 4,
    maxAge: 14,
    options: [
      {
        text: 'Beg your parents to adopt it',
        resultText: 'Your parents agreed! The kitten purred softly as you brought it indoors.',
        statChanges: { happiness: 20, karma: 10 }
      },
      {
        text: 'Feed it some milk and leave it be',
        resultText: 'The kitten drank the milk happily and eventually wandered to a neighbor.',
        statChanges: { happiness: 5, karma: 5 }
      },
      {
        text: 'Ignore it',
        resultText: 'You walked away. You felt a slight pang of guilt later that evening.',
        statChanges: { happiness: -5, karma: -5 }
      }
    ]
  },
  {
    id: 'child_3',
    title: 'Found $50 Bill',
    description: 'While walking home from school, you notice a crisp $50 bill tucked near a bush!',
    category: 'wealth',
    minAge: 6,
    maxAge: 16,
    options: [
      {
        text: 'Keep it for candy and video games',
        resultText: 'You bought a bunch of comic books and bubblegum! Pure joy.',
        statChanges: { happiness: 15 },
        moneyChange: 50
      },
      {
        text: 'Turn it in to the police station',
        resultText: 'The police officer praised your honesty and gave you an official badge sticker.',
        statChanges: { happiness: 10, karma: 20, smarts: 5 }
      },
      {
        text: 'Put it in your piggy bank',
        resultText: 'You saved the money for the future. Wise move!',
        statChanges: { smarts: 10 },
        moneyChange: 50
      }
    ]
  },

  // TEEN YEARS (Ages 13-18)
  {
    id: 'teen_1',
    title: 'High School Party Temptation',
    description: 'The popular crowd invited you to a wild Friday night house party. There will be alcohol and reckless fun.',
    category: 'school',
    minAge: 14,
    maxAge: 18,
    options: [
      {
        text: 'Go and party wild!',
        resultText: 'You danced all night and gained tons of popularity! You woke up with a headache though.',
        statChanges: { happiness: 20, looks: 5, health: -10, smarts: -5 }
      },
      {
        text: 'Go, but stick to soft drinks',
        resultText: 'You had fun chatting with everyone without making a fool of yourself. Perfect balance.',
        statChanges: { happiness: 10, smarts: 5 }
      },
      {
        text: 'Stay home and study for finals',
        resultText: 'Your test scores soared! Your parents were super proud.',
        statChanges: { smarts: 15, happiness: -5, karma: 5 }
      }
    ]
  },
  {
    id: 'teen_2',
    title: 'Driving Test',
    description: 'It is the day of your official road test to get your driver license!',
    category: 'school',
    minAge: 16,
    maxAge: 17,
    options: [
      {
        text: 'Drive carefully and observe all stop signs',
        resultText: 'The instructor smiled and handed you a PASS certificate! Freedom on 4 wheels.',
        statChanges: { happiness: 25, smarts: 5 }
      },
      {
        text: 'Show off your drift speed moves',
        resultText: 'You hit a curb and failed immediately! The instructor was terrified.',
        statChanges: { happiness: -20, smarts: -10 }
      }
    ]
  },
  {
    id: 'teen_3',
    title: 'Prom Proposal',
    description: 'A attractive classmate approaches you with a bouquet of flowers asking you to be their Prom date!',
    category: 'relationship',
    minAge: 17,
    maxAge: 18,
    options: [
      {
        text: 'Enthusiastically say YES!',
        resultText: 'You had the time of your life at Prom! You were voted best-dressed couple.',
        statChanges: { happiness: 25, looks: 10 }
      },
      {
        text: 'Politely decline',
        resultText: 'They looked heartbroken, but understood. You went to Prom with your close group of friends instead.',
        statChanges: { happiness: 5 }
      }
    ]
  },

  // ADULT YEARS (Ages 18-50)
  {
    id: 'adult_1',
    title: 'Corporate Bribe',
    description: 'A sketchy supplier offers you $10,000 cash under the table if you award them the company procurement contract.',
    category: 'work',
    minAge: 21,
    maxAge: 60,
    allowedJobCategories: ['Corporate', 'Tech', 'Executive', 'Service', 'Trade'],
    excludedJobCategories: ['Military', 'Public Service', 'Legal', 'Medical'],
    excludedJobKeywords: ['soldier', 'army', 'sergeant', 'corporal', 'lieutenant', 'captain', 'colonel', 'general', 'governor', 'officer', 'police', 'doctor', 'nurse', 'judge', 'prosecutor', 'magistrate'],
    options: [
      {
        text: 'Accept the illegal $10,000 cash',
        resultText: 'You pocketed the cash! But you constantly look over your shoulder fearing an audit.',
        statChanges: { happiness: -5, karma: -30 },
        moneyChange: 10000
      },
      {
        text: 'Reject and report them to HR/Police',
        resultText: 'Your company CEO praised your ethical integrity and awarded you a $2,500 bonus!',
        statChanges: { happiness: 15, karma: 20, smarts: 5 },
        moneyChange: 2500,
        jobPerformanceChange: 20
      },
      {
        text: 'Politely refuse without reporting',
        resultText: 'The supplier left in a hurry. You kept your hands clean.',
        statChanges: { karma: 5 }
      }
    ]
  },
  {
    id: 'adult_military_audit',
    title: 'Military Surplus Inspection',
    description: 'During a quartermaster base inspection, you discover an unrecorded crate of tactical equipment.',
    category: 'work',
    minAge: 18,
    maxAge: 65,
    allowedJobCategories: ['Military'],
    options: [
      {
        text: 'Log and register equipment with Base Ordnance',
        resultText: 'Base Command praised your attention to military regulation and commended your unit.',
        statChanges: { karma: 15, smarts: 5 },
        jobPerformanceChange: 15
      },
      {
        text: 'Distribute gear directly to your squad mates',
        resultText: 'Your squad appreciated the upgraded optics, boosting unit morale.',
        statChanges: { happiness: 10, karma: 5 },
        jobPerformanceChange: 5
      }
    ]
  },
  {
    id: 'adult_police_tipoff',
    title: 'Informant Intel Offer',
    description: 'A confidential street informant offers crucial evidence on an active burglary ring in exchange for dropping a traffic fine.',
    category: 'work',
    minAge: 21,
    maxAge: 65,
    allowedJobCategories: ['Public Service'],
    allowedJobKeywords: ['police', 'detective', 'cop', 'sheriff', 'officer', 'constable'],
    options: [
      {
        text: 'Accept intel and issue a formal police warning',
        resultText: 'The intel led directly to the arrest of three syndicate suspects! Your precinct chief commended you.',
        statChanges: { karma: 15, fame: 5 },
        jobPerformanceChange: 20
      },
      {
        text: 'Refuse bargain and enforce full citation',
        resultText: 'You followed strict procedure, though lost the informant’s trust.',
        statChanges: { karma: 5 },
        jobPerformanceChange: 5
      }
    ]
  },
  {
    id: 'adult_2',
    title: 'Cryptocurrency Pitch',
    description: 'Your eccentric friend pitches a new coin called "DogeRocket" and urges you to invest $5,000.',
    category: 'wealth',
    minAge: 20,
    maxAge: 65,
    options: [
      {
        text: 'Invest $5,000 into DogeRocket',
        resultText: 'DogeRocket went viral on social media! Your investment 5x-ed to $25,000 before you cashed out!',
        statChanges: { happiness: 30, smarts: 5 },
        moneyChange: 20000
      },
      {
        text: 'Pass on the risky offer',
        resultText: 'You saved your hard-earned cash. The coin crashed a month later anyway.',
        statChanges: { smarts: 5 }
      }
    ]
  },
  {
    id: 'adult_3',
    title: 'Celebrity Talent Scout',
    description: 'While sipping coffee at a beachside cafe, a talent agent hands you a business card for a national commercial casting call!',
    category: 'fame',
    minAge: 18,
    maxAge: 45,
    options: [
      {
        text: 'Audition for the commercial',
        resultText: 'You nailed the monologue! You were featured in a prime-time TV spot, boosting your fame and earning $15,000!',
        statChanges: { happiness: 25, fame: 20, looks: 5 },
        moneyChange: 15000
      },
      {
        text: 'Ignore the card',
        resultText: 'You threw the card away. Life continued as normal.',
        statChanges: { happiness: -5 }
      }
    ]
  },
  {
    id: 'adult_4',
    title: 'Street Mugging Encounter',
    description: 'Late at night in an alleyway, a shadowy figure pulls out a pocketknife and demands your wallet and watch!',
    category: 'crime',
    minAge: 18,
    maxAge: 75,
    options: [
      {
        text: 'Hand over your wallet ($500 value)',
        resultText: 'The mugger grabbed the wallet and fled. You escaped unharmed, though shaken.',
        statChanges: { happiness: -15, health: 0 },
        moneyChange: -500
      },
      {
        text: 'Attempt a surprise Karate Kick!',
        resultText: 'Your kick landed squarely on his chin! The mugger dropped his knife and ran off. Epic self-defense!',
        statChanges: { happiness: 25, health: 5, looks: 5 }
      },
      {
        text: 'Scream for help at the top of your lungs',
        resultText: 'A nearby police patrol car flashed its sirens! The mugger panicked and bolted away.',
        statChanges: { happiness: 10, karma: 5 }
      }
    ]
  },
  {
    id: 'adult_5',
    title: 'Mystery Inheritance',
    description: 'A lawyer contacts you regarding an eccentric distant relative who left you an unexpected bequest in their will!',
    category: 'wealth',
    minAge: 25,
    maxAge: 80,
    options: [
      {
        text: 'Accept the inheritance ($150,000)',
        resultText: 'After taxes and legal fees, $150,000 was deposited straight into your bank account!',
        statChanges: { happiness: 35, karma: 10 },
        moneyChange: 150000
      }
    ]
  },
  {
    id: 'adult_6',
    title: 'Unexpected Medical Diagnosis',
    description: 'During your routine health checkup, the doctor notices concerning blood test results and recommends immediate treatment.',
    category: 'health',
    minAge: 30,
    maxAge: 90,
    options: [
      {
        text: 'Pay $5,000 for top specialist treatment',
        resultText: 'The specialist cured the illness completely! You feel rejuvenated and healthy.',
        statChanges: { happiness: 15, health: 30 },
        moneyChange: -5000
      },
      {
        text: 'Try home remedies and rest',
        resultText: 'The symptoms lingered and your energy dropped over the year.',
        statChanges: { happiness: -15, health: -20 }
      }
    ]
  },

  // SENIOR YEARS (Ages 60+)
  {
    id: 'senior_1',
    title: 'Grandchild Advice',
    description: 'Your grandchild asks if they should drop out of college to pursue a full-time esports streaming career.',
    category: 'relationship',
    minAge: 55,
    maxAge: 100,
    options: [
      {
        text: 'Encourage them to follow their passion!',
        resultText: 'They launched their stream and hit 100k subscribers! They sent you a loving thank-you letter.',
        statChanges: { happiness: 20, karma: 10 }
      },
      {
        text: 'Advise them to complete their degree first',
        resultText: 'They listened and finished their computer science degree with honors.',
        statChanges: { happiness: 10, smarts: 5, karma: 10 }
      }
    ]
  },
  {
    id: 'senior_2',
    title: 'Golden Years Cruise Proposal',
    description: 'A travel club invites you on a luxury 60-day round-the-world ocean cruise for $20,000.',
    category: 'random',
    minAge: 60,
    maxAge: 100,
    options: [
      {
        text: 'Book the first class suite ($20,000)',
        resultText: 'You drank champagne under sunsets in the Pacific, Mediterranean, and Caribbean! Unforgettable luxury.',
        statChanges: { happiness: 40, health: 15 },
        moneyChange: -20000
      },
      {
        text: 'Pass and stay home tending your garden',
        resultText: 'You spent quiet peaceful months reading books and gardening.',
        statChanges: { happiness: 5, health: 5 }
      }
    ]
  }
];
