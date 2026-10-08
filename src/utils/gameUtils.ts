import { GameState, PersonRelationship, LifeLog, DecisionEvent, Gender, SpecialTalent } from '../types';
import { RANDOM_EVENTS_DATABASE } from '../data/eventDatabase';
import { COUNTRIES_CITIES } from '../data/initialData';

export function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)} Trillion`;
  }
  if (Math.abs(amount) >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)} Billion`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)} Million`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FIRST_NAMES_MALE = ['Leo', 'Alexander', 'Marcus', 'Julian', 'Filippo', 'David', 'Lucas', 'Oliver', 'Arthur', 'Mateo'];
const FIRST_NAMES_FEMALE = ['Adele', 'Sophia', 'Chloe', 'Elena', 'Victoria', 'Amelia', 'Mia', 'Isabella', 'Charlotte', 'Zara'];
const LAST_NAMES = ['Dubois', 'Hartmann', 'Smith', 'Vance', 'Sterling', 'Chen', 'Kim', 'Garcia', 'Moreau', 'Rossi'];

export function generateRandomName(gender: Gender): { firstName: string; lastName: string } {
  const firstName = gender === 'Male' ? getRandomElement(FIRST_NAMES_MALE) : getRandomElement(FIRST_NAMES_FEMALE);
  const lastName = getRandomElement(LAST_NAMES);
  return { firstName, lastName };
}

export function generateInitialRelationships(lastName: string): PersonRelationship[] {
  const rels: PersonRelationship[] = [];

  // Mother
  rels.push({
    id: 'mom_' + Date.now(),
    name: `${getRandomElement(FIRST_NAMES_FEMALE)} ${lastName}`,
    relation: 'Mother',
    age: getRandomInt(22, 38),
    relationshipBar: getRandomInt(70, 98),
    occupation: getRandomElement(['Teacher', 'Nurse', 'Manager', 'Artist', 'Lawyer', 'Homemaker']),
    gender: 'Female',
    isAlive: true,
    avatarIcon: '👩',
    crazyLevel: getRandomInt(10, 60),
    generosityLevel: getRandomInt(50, 95)
  });

  // Father
  rels.push({
    id: 'dad_' + Date.now(),
    name: `${getRandomElement(FIRST_NAMES_MALE)} ${lastName}`,
    relation: 'Father',
    age: getRandomInt(24, 42),
    relationshipBar: getRandomInt(65, 95),
    occupation: getRandomElement(['Engineer', 'Architect', 'Business Owner', 'Chef', 'Pilot', 'Doctor']),
    gender: 'Male',
    isAlive: true,
    avatarIcon: '👨',
    crazyLevel: getRandomInt(10, 60),
    generosityLevel: getRandomInt(50, 95)
  });

  // Optional Sibling (50% chance)
  if (Math.random() > 0.5) {
    const sibGender: Gender = Math.random() > 0.5 ? 'Male' : 'Female';
    rels.push({
      id: 'sib_' + Date.now(),
      name: `${sibGender === 'Male' ? getRandomElement(FIRST_NAMES_MALE) : getRandomElement(FIRST_NAMES_FEMALE)} ${lastName}`,
      relation: sibGender === 'Male' ? 'Brother' : 'Sister',
      age: getRandomInt(1, 5),
      relationshipBar: getRandomInt(60, 90),
      gender: sibGender,
      isAlive: true,
      avatarIcon: sibGender === 'Male' ? '👦' : '👧',
      crazyLevel: getRandomInt(20, 80),
      generosityLevel: getRandomInt(40, 80)
    });
  }

  return rels;
}

export function createNewLife(customName?: { firstName: string; lastName: string }, customGender?: Gender, customTalent?: SpecialTalent): GameState {
  const gender: Gender = customGender || (Math.random() > 0.5 ? 'Male' : 'Female');
  const name = customName || generateRandomName(gender);
  const location = getRandomElement(COUNTRIES_CITIES);

  const initialTalent = customTalent || getRandomElement(['None', 'Acting', 'Music', 'Athletics', 'Crime', 'Business', 'Smarts'] as SpecialTalent[]);

  const avatar = gender === 'Male' ? '👦' : '👧';

  const initialStats = {
    happiness: getRandomInt(60, 95),
    health: getRandomInt(80, 100),
    smarts: getRandomInt(50, 95),
    looks: getRandomInt(50, 95),
    karma: getRandomInt(50, 80)
  };

  const initialLog: LifeLog = {
    id: 'log_0',
    age: 0,
    text: `I was born in ${location.city}, ${location.country} ${location.flag}. My parents named me ${name.firstName}.`,
    type: 'major'
  };

  return {
    character: {
      id: 'char_' + Date.now(),
      firstName: name.firstName,
      lastName: name.lastName,
      gender,
      age: 0,
      country: location.country,
      city: location.city,
      avatarIcon: avatar,
      specialTalent: initialTalent,
      stats: initialStats,
      bankBalance: 0,
      debt: 0,
      currentJob: null,
      education: { level: 'None', grades: 80, graduated: false },
      isAlive: true
    },
    relationships: generateInitialRelationships(name.lastName),
    assets: [],
    stocks: [],
    lifeLogs: [initialLog],
    graveyard: JSON.parse(localStorage.getItem('lifesim_graveyard') || '[]'),
    activeModal: 'none',
    currentEvent: null,
    eventResultText: null,
    selectedPerson: null
  };
}

export function calculateRibbon(state: GameState): string {
  const { age, stats, bankBalance, currentJob } = state.character;
  if (bankBalance >= 10_000_000) return 'Mogul 💰';
  if (stats.fame && stats.fame >= 80) return 'Superstar ⭐';
  if (age >= 100) return 'Centenarian 🎂';
  if ((stats.karma || 50) >= 85) return 'Model Citizen 😇';
  if ((stats.karma || 50) <= 20) return 'Scandalous 😈';
  if (currentJob && currentJob.salary >= 200000) return 'High Flyer 💼';
  return 'Mediocre 😐';
}
