import { ClassmateNPC } from '../types';

export const UNIVERSITY_MAJORS = [
  'Accounting',
  'Anthropology',
  'Archaeology',
  'Architecture',
  'Art History',
  'Biology',
  'Chemistry',
  'Communications',
  'Computer Science',
  'Criminal Justice',
  'Dance',
  'Economics',
  'Education',
  'Engineering',
  'English',
  'Finance',
  'Graphic Design',
  'History',
  'Information Systems',
  'Journalism',
  'Marketing',
  'Mathematics',
  'Music',
  'Nursing',
  'Philosophy',
  'Physics',
  'Political Science',
  'Psychology',
  'Religious Studies'
];

export interface HigherEdProgram {
  id: string;
  name: string;
  durationYears: number;
  costPerYear: number;
  acceptedMajors: string[];
  reqSmarts: number;
  careerTitle: string;
}

export const HIGHER_ED_PROGRAMS: HigherEdProgram[] = [
  {
    id: 'grad_school',
    name: 'Graduate School',
    durationYears: 2,
    costPerYear: 18000,
    reqSmarts: 65,
    careerTitle: 'Master Degree Holder',
    acceptedMajors: [
      'Accounting', 'Anthropology', 'Archaeology', 'Biology', 'Chemistry',
      'Computer Science', 'Criminal Justice', 'Economics', 'Education',
      'Engineering', 'English', 'Finance', 'History', 'Information Systems',
      'Journalism', 'Marketing', 'Mathematics', 'Music', 'Philosophy',
      'Physics', 'Political Science', 'Psychology'
    ]
  },
  {
    id: 'business_school',
    name: 'Business School',
    durationYears: 2,
    costPerYear: 28000,
    reqSmarts: 70,
    careerTitle: 'MBA / Corporate Executive',
    acceptedMajors: [
      'Accounting', 'Economics', 'English', 'Finance', 'Information Systems',
      'Marketing', 'Mathematics'
    ]
  },
  {
    id: 'dental_school',
    name: 'Dental School',
    durationYears: 4,
    costPerYear: 35000,
    reqSmarts: 80,
    careerTitle: 'Dentist (Dr.)',
    acceptedMajors: ['Biology', 'Chemistry', 'Physics', 'Nursing']
  },
  {
    id: 'law_school',
    name: 'Law School',
    durationYears: 4,
    costPerYear: 32000,
    reqSmarts: 75,
    careerTitle: 'Lawyer / Magistrate',
    acceptedMajors: [
      'Criminal Justice', 'English', 'Finance', 'Philosophy', 'Political Science'
    ]
  },
  {
    id: 'medical_school',
    name: 'Medical School',
    durationYears: 7,
    costPerYear: 42000,
    reqSmarts: 85,
    careerTitle: 'Doctor (Dr.)',
    acceptedMajors: ['Biology', 'Chemistry', 'Nursing', 'Psychology', 'Physics']
  },
  {
    id: 'nursing_school',
    name: 'Nursing School',
    durationYears: 2,
    costPerYear: 15000,
    reqSmarts: 60,
    careerTitle: 'Registered Nurse',
    acceptedMajors: ['Nursing']
  },
  {
    id: 'pharmacy_school',
    name: 'Pharmacy School',
    durationYears: 4,
    costPerYear: 26000,
    reqSmarts: 75,
    careerTitle: 'Pharmacist',
    acceptedMajors: ['Biology', 'Chemistry', 'Physics']
  },
  {
    id: 'veterinary_school',
    name: 'Veterinary School',
    durationYears: 4,
    costPerYear: 28000,
    reqSmarts: 78,
    careerTitle: 'Veterinarian',
    acceptedMajors: ['Biology', 'Chemistry', 'Physics']
  }
];

export interface SchoolClub {
  name: string;
  category: 'Academic' | 'Arts' | 'Tech' | 'Sports' | 'Social' | 'Other';
  reqType: 'Smarts' | 'Athleticism' | 'Looks' | 'None';
  minStat: number;
}

export const SCHOOL_CLUBS: SchoolClub[] = [
  // Academic
  { name: 'Academic Decathlon 🧠', category: 'Academic', reqType: 'Smarts', minStat: 70 },
  { name: 'Chess Club ♟️', category: 'Academic', reqType: 'Smarts', minStat: 50 },
  { name: 'Computer Science Club 🖥️', category: 'Academic', reqType: 'Smarts', minStat: 60 },
  { name: 'History Club 🗺️', category: 'Academic', reqType: 'None', minStat: 0 },
  { name: 'Math Club ➗', category: 'Academic', reqType: 'Smarts', minStat: 65 },
  { name: 'Science Club 🧬', category: 'Academic', reqType: 'Smarts', minStat: 60 },
  { name: 'Tutoring Club 👩‍🏫', category: 'Academic', reqType: 'Smarts', minStat: 75 },
  { name: 'Honor Society 🎓', category: 'Academic', reqType: 'Smarts', minStat: 85 },
  { name: 'Robotics Club 🤖', category: 'Academic', reqType: 'Smarts', minStat: 65 },
  { name: 'Speech & Debate 💬', category: 'Academic', reqType: 'Smarts', minStat: 60 },

  // Arts & Creative
  { name: 'Art Club 🎨', category: 'Arts', reqType: 'None', minStat: 0 },
  { name: 'Choir 🎶', category: 'Arts', reqType: 'None', minStat: 0 },
  { name: 'Concert Band 🎺', category: 'Arts', reqType: 'None', minStat: 0 },
  { name: 'Creative Writing Club ⌨️', category: 'Arts', reqType: 'Smarts', minStat: 50 },
  { name: 'Dance Club 💃', category: 'Arts', reqType: 'Athleticism', minStat: 40 },
  { name: 'Drama Club 🎭', category: 'Arts', reqType: 'Looks', minStat: 40 },
  { name: 'Film Club 🎥', category: 'Arts', reqType: 'None', minStat: 0 },
  { name: 'Orchestra 🎻', category: 'Arts', reqType: 'Smarts', minStat: 50 },
  { name: 'Photography Club 📷', category: 'Arts', reqType: 'None', minStat: 0 },

  // Tech & Gaming
  { name: 'Audio-Visual Club 🎛️', category: 'Tech', reqType: 'None', minStat: 0 },
  { name: 'Video Games Club 🎮', category: 'Tech', reqType: 'None', minStat: 0 },
  { name: 'Web Design Club 💻', category: 'Tech', reqType: 'Smarts', minStat: 50 },
  { name: 'Dungeons & Dragons 🐲', category: 'Tech', reqType: 'None', minStat: 0 },
  { name: 'Anime Club 🎎', category: 'Tech', reqType: 'None', minStat: 0 },

  // Sports
  { name: 'Basketball Team 🏀', category: 'Sports', reqType: 'Athleticism', minStat: 65 },
  { name: 'Soccer Team ⚽', category: 'Sports', reqType: 'Athleticism', minStat: 60 },
  { name: 'Swim Team 🏊‍♂️', category: 'Sports', reqType: 'Athleticism', minStat: 55 },
  { name: 'Track Team 🥇', category: 'Sports', reqType: 'Athleticism', minStat: 50 },
  { name: 'Football Team 🏈', category: 'Sports', reqType: 'Athleticism', minStat: 70 },
  { name: 'Cheerleading Team 📣', category: 'Sports', reqType: 'Athleticism', minStat: 60 },
  { name: 'Tennis Team 🎾', category: 'Sports', reqType: 'Athleticism', minStat: 50 },
  { name: 'Volleyball Team 🏐', category: 'Sports', reqType: 'Athleticism', minStat: 55 },
  { name: 'Baseball Team ⚾', category: 'Sports', reqType: 'Athleticism', minStat: 60 },

  // Social & Community
  { name: 'Student Council 🗣️', category: 'Social', reqType: 'Looks', minStat: 50 },
  { name: 'Environment Club 🌳', category: 'Social', reqType: 'None', minStat: 0 },
  { name: 'Key Club 🤝', category: 'Social', reqType: 'None', minStat: 0 },
  { name: 'Red Cross Club 🏥', category: 'Social', reqType: 'None', minStat: 0 },
  { name: 'Foreign Language Club 🗣️', category: 'Social', reqType: 'Smarts', minStat: 40 }
];

export interface CliqueInfo {
  name: string;
  emoji: string;
  description: string;
  reqText: string;
  checkEligible: (smarts: number, looks: number, popularity: number, athleticism: number, grades: number) => boolean;
}

export const SCHOOL_CLIQUES: CliqueInfo[] = [
  {
    name: 'Artsy Kids',
    emoji: '🖼️',
    description: 'Creative and artistically inclined students.',
    reqText: 'Looks >= 40 or Smarts >= 50',
    checkEligible: (s, l) => l >= 40 || s >= 50
  },
  {
    name: 'Band Geeks',
    emoji: '🎺',
    description: 'Students interested in musical instruments and band culture.',
    reqText: 'Smarts >= 40',
    checkEligible: (s) => s >= 40
  },
  {
    name: 'Brainy Kids',
    emoji: '🧠',
    description: 'Requires high Smarts and outstanding grades.',
    reqText: 'Smarts >= 80 & Grades >= 80',
    checkEligible: (s, l, p, a, g) => s >= 80 && g >= 80
  },
  {
    name: 'Drama Kids',
    emoji: '🎭',
    description: 'Students interested in theatre and performing arts.',
    reqText: 'Looks >= 50',
    checkEligible: (s, l) => l >= 50
  },
  {
    name: 'Gamers',
    emoji: '🎮',
    description: 'Students heavily interested in gaming and gamer culture.',
    reqText: 'Smarts >= 50',
    checkEligible: (s) => s >= 50
  },
  {
    name: 'Goths',
    emoji: '👨‍🎤',
    description: 'Students interested in gothic fashion and dark aesthetics.',
    reqText: 'No strict requirement',
    checkEligible: () => true
  },
  {
    name: 'Jocks',
    emoji: '💪',
    description: 'Athletic students focused heavily on sports teams.',
    reqText: 'Athleticism >= 70',
    checkEligible: (s, l, p, a) => a >= 70
  },
  {
    name: 'Loners',
    emoji: '🚶‍♂️',
    description: 'Unpopular students who keep to themselves.',
    reqText: 'Popularity < 40',
    checkEligible: (s, l, p) => p < 40
  },
  {
    name: 'Mean Girls',
    emoji: '🙎‍♀️',
    description: 'Socially ambitious students focused on popularity and gossip.',
    reqText: 'Popularity >= 60',
    checkEligible: (s, l, p) => p >= 60
  },
  {
    name: 'Nerds',
    emoji: '🤓',
    description: 'Highly intellectual or introverted students.',
    reqText: 'Smarts >= 60',
    checkEligible: (s) => s >= 60
  },
  {
    name: 'Normals',
    emoji: '🙂',
    description: 'Average students without strong association with another clique.',
    reqText: 'Open to everyone',
    checkEligible: () => true
  },
  {
    name: 'Popular Kids',
    emoji: '😎',
    description: 'The elite, most popular students in school.',
    reqText: 'Popularity >= 80',
    checkEligible: (s, l, p) => p >= 80
  },
  {
    name: 'Skaters',
    emoji: '🛹',
    description: 'Students dedicated to skateboarding culture.',
    reqText: 'Athleticism >= 50',
    checkEligible: (s, l, p, a) => a >= 50
  },
  {
    name: 'Social Floaters',
    emoji: '🎈',
    description: 'Students who move comfortably between different groups.',
    reqText: 'Popularity >= 50',
    checkEligible: (s, l, p) => p >= 50
  },
  {
    name: 'Talented Kids',
    emoji: '💯',
    description: 'Highly talented students with top Smarts and Looks.',
    reqText: 'Smarts >= 75 & Looks >= 75',
    checkEligible: (s, l) => s >= 75 && l >= 75
  },
  {
    name: 'Troublemakers',
    emoji: '😼',
    description: 'Students frequently involved in school misconduct.',
    reqText: 'Smarts < 70',
    checkEligible: (s) => s < 70
  },
  {
    name: 'Weebs',
    emoji: '🎎',
    description: 'Students heavily interested in Japanese culture and anime.',
    reqText: 'Smarts >= 40',
    checkEligible: (s) => s >= 40
  }
];

export interface GreekTrivia {
  question: string;
  options: string[];
  correctIndex: number;
}

export const GREEK_TRIVIA_QUESTIONS: GreekTrivia[] = [
  {
    question: 'Who is the king of the Olympian gods in Greek mythology?',
    options: ['Apollo', 'Zeus', 'Poseidon', 'Ares'],
    correctIndex: 1
  },
  {
    question: 'Which Greek god rules the underworld and the realm of the dead?',
    options: ['Hades', 'Hermes', 'Dionysus', 'Hephaestus'],
    correctIndex: 0
  },
  {
    question: 'Who is the Greek goddess of wisdom, courage, and strategic warfare?',
    options: ['Aphrodite', 'Hera', 'Athena', 'Artemis'],
    correctIndex: 2
  },
  {
    question: 'Which legendary hero completed the Twelve Labors in Greek mythology?',
    options: ['Achilles', 'Perseus', 'Theseus', 'Hercules'],
    correctIndex: 3
  }
];

// Classmate Generator Helper
const FIRST_NAMES_MALE = ['Ethan', 'Lucas', 'Noah', 'Oliver', 'Mason', 'Liam', 'Jacob', 'Elijah', 'Aiden', 'James'];
const FIRST_NAMES_FEMALE = ['Sophia', 'Emma', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Harper', 'Amelia', 'Evelyn', 'Abigail'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

export function generateClassmates(count: number, age: number): ClassmateNPC[] {
  const classmates: ClassmateNPC[] = [];
  const iconsMale = ['👦', '🧑', '👨', '👦🏽', '👦🏼', '🧑🏻'];
  const iconsFemale = ['👧', '🧑‍🦰', '👩', '👧🏽', '👧🏼', '👩🏻'];

  for (let i = 0; i < count; i++) {
    const isMale = Math.random() < 0.5;
    const gender = isMale ? 'Male' : 'Female';
    const firstName = isMale 
      ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
      : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const avatarIcon = isMale 
      ? iconsMale[Math.floor(Math.random() * iconsMale.length)]
      : iconsFemale[Math.floor(Math.random() * iconsFemale.length)];

    classmates.push({
      id: 'classmate_' + Date.now() + '_' + i,
      name: `${firstName} ${lastName}`,
      gender,
      age: Math.max(5, age + Math.floor(Math.random() * 3) - 1),
      popularity: Math.floor(Math.random() * 70) + 20,
      smarts: Math.floor(Math.random() * 70) + 20,
      looks: Math.floor(Math.random() * 70) + 20,
      relationship: Math.floor(Math.random() * 40) + 20,
      isBully: Math.random() < 0.2,
      isTroublemaker: Math.random() < 0.15,
      avatarIcon
    });
  }

  return classmates;
}
