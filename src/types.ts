export type Gender = 'Male' | 'Female' | 'Non-Binary';

export type SpecialTalent = 'None' | 'Acting' | 'Music' | 'Athletics' | 'Crime' | 'Business' | 'Smarts';

export interface CharacterStats {
  happiness: number; // 0 - 100
  health: number;    // 0 - 100
  smarts: number;    // 0 - 100
  looks: number;     // 0 - 100
  fame?: number;     // 0 - 100 (optional)
  karma?: number;    // 0 - 100
}

export type RelationshipType = 
  | 'Mother'
  | 'Father'
  | 'Brother'
  | 'Sister'
  | 'Friend'
  | 'Boyfriend'
  | 'Girlfriend'
  | 'Fiancé'
  | 'Husband'
  | 'Wife'
  | 'Son'
  | 'Daughter'
  | 'Co-Worker'
  | 'Boss'
  | 'Ex-Partner';

export interface PersonRelationship {
  id: string;
  name: string;
  relation: RelationshipType;
  age: number;
  relationshipBar: number; // 0 - 100
  occupation?: string;
  gender: Gender;
  isAlive: boolean;
  avatarIcon: string;
  crazyLevel: number; // 0 - 100
  generosityLevel: number; // 0 - 100
}

export type AssetType = 'RealEstate' | 'Vehicle' | 'Pet' | 'Jewelry' | 'Relic' | 'Business';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  purchasePrice: number;
  currentValue: number;
  annualCost: number; // maintenance / tax / food
  icon: string;
  condition?: number; // 0 - 100
  yearPurchased: number;
  details?: string;
  monthlyRevenue?: number; // for businesses/rentals
}

export interface JobCoworker {
  id: string;
  name: string;
  role: string;
  relationship: number; // 0 - 100
  isBoss?: boolean;
  gender: Gender;
  avatarIcon: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: number;
  reqSmarts: number;
  reqLooks?: number;
  reqDegree?: string;
  category: 'Corporate' | 'Tech' | 'Medical' | 'Creative' | 'Service' | 'Executive' | 'Crime' | 'Trade' | 'Military' | 'Legal' | 'Public Service';
  performance: number; // 0 - 100
  yearsInRole: number;
  yearsInCareer?: number;
  hoursPerWeek?: number; // e.g. 40
  stress?: number; // 0 - 100
  isSpecialFame?: boolean;
  careerPathId?: string;
  currentTierIndex?: number;
  supervisor?: JobCoworker;
  coworkers?: JobCoworker[];
  isRetired?: boolean;
  pensionAmount?: number;
}

export type EducationLevel = 
  | 'None' 
  | 'Elementary' 
  | 'Middle School' 
  | 'High School' 
  | 'GED' 
  | 'Community College' 
  | 'Trade School' 
  | 'University' 
  | 'Graduate School' 
  | 'Business School' 
  | 'Dental School' 
  | 'Law School' 
  | 'Medical School' 
  | 'Nursing School' 
  | 'Pharmacy School' 
  | 'Veterinary School';

export interface EducationState {
  level: EducationLevel;
  schoolName?: string;
  major?: string;
  yearsCompleted: number;
  totalYears: number;
  grades: number; // 0 - 100
  popularity: number; // 0 - 100
  athleticism: number; // 0 - 100
  clique?: string;
  clubs: string[];
  isFraternityMember?: boolean;
  fraternityName?: string;
  droppedOut?: boolean;
  expelled?: boolean;
  hasGed?: boolean;
  highestCompleted?: string;
  completedDegrees?: string[];
  schoolCount?: number;
}

export interface ClassmateNPC {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  popularity: number;
  smarts: number;
  looks: number;
  relationship: number; // 0 - 100
  isBully?: boolean;
  isTroublemaker?: boolean;
  avatarIcon: string;
}

export interface Education {
  level: EducationLevel;
  major?: string;
  grades: number; // 0 - 100
  graduated: boolean;
  scholarship?: boolean;
  details?: EducationState;
}

export interface LifeLog {
  id: string;
  age: number;
  text: string;
  type: 'neutral' | 'positive' | 'negative' | 'major' | 'income' | 'death';
}

export interface ChoiceOption {
  text: string;
  resultText: string;
  statChanges?: Partial<CharacterStats>;
  moneyChange?: number;
  relationshipChanges?: { id?: string; relationType?: RelationshipType; change: number }[];
  jobPerformanceChange?: number;
  specialEffect?: 'jail' | 'cured' | 'injured' | 'fame_boost' | 'death' | 'pregnancy' | 'promote';
}

export interface DecisionEvent {
  id: string;
  title: string;
  description: string;
  category: 'school' | 'work' | 'relationship' | 'random' | 'health' | 'crime' | 'fame' | 'wealth';
  allowedJobCategories?: string[];
  excludedJobCategories?: string[];
  allowedJobKeywords?: string[];
  excludedJobKeywords?: string[];
  minAge?: number;
  maxAge?: number;
  options: ChoiceOption[];
}

export interface DeceasedRecord {
  id: string;
  name: string;
  gender: Gender;
  ageAtDeath: number;
  causeOfDeath: string;
  netWorth: number;
  primaryCareer: string;
  childrenCount: number;
  ribbon: string; // e.g. "Mogul", "Superstar", "Model Citizen", "Wicked", "Hero", "Unlucky", "Mediocre"
  yearOfDeath: number;
  avatarIcon: string;
  country: string;
  city: string;
}

export interface StockAsset {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  sharesOwned: number;
  history: number[];
}

export interface CabinetOfficial {
  id: string;
  title: 'Chief of Defense Staff' | 'Chief Justice' | 'Minister of Finance' | 'Chief of Intelligence' | 'Director of State Media';
  name: string;
  avatarIcon: string;
  loyalty: number; // 0 - 100
  competence: number; // 0 - 100
  status: 'Active' | 'Dismissed' | 'Purged';
}

export interface GovernanceState {
  isGovernor: boolean;
  regimeTitle: string;
  stability: number; // 0 - 100
  approval: number;  // 0 - 100
  treasury: number;
  taxRate: number;   // 10 - 60%
  curfewActive: boolean;
  martialLawLevel: 'Emergency' | 'Strict' | 'Total Control';
  cabinet: CabinetOfficial[];
  yearsInPower: number;
}

export type SubordinateTrait = 'Trigger-Happy' | 'Negotiator' | 'Corrupt' | 'Media-Savvy' | 'Incompetent' | 'Loyalist' | 'Whistleblower-Prone';

export interface SubordinateNPC {
  id: string;
  name: string;
  role: string;
  gender: Gender;
  avatarIcon: string;
  competence: number; // 0 - 100
  loyalty: number;    // 0 - 100
  corruption: number; // 0 - 100
  trait: SubordinateTrait;
  salary: number;
  status: 'Active' | 'Investigated' | 'Suspended' | 'Fired' | 'Turned Whistleblower';
}

export interface DepartmentBudget {
  totalBudget: number;
  allocations: {
    wages: number;      // % 0-100
    operations: number; // % 0-100
    oversight: number;  // % 0-100
    slushFund: number;  // % 0-100 siphoned off-book
  };
  siphonedAccumulated: number; // $ total siphoned into personal funds
}

export interface LeverageDossier {
  id: string;
  npcName: string;
  npcRole: 'Mayor' | 'City Council Chair' | 'IA Director' | 'Lead Reporter' | 'Rival Executive' | 'Syndicate Boss' | 'Subordinate Lead';
  relationship: number; // 0 - 100
  dirtDiscovered: string[]; // e.g. ["Embezzlement Records", "Extramarital Scandal", "Syndicate Kickbacks"]
  leveragePoints: number; // 0 - 100
  hasDirtOnPlayer: boolean;
  playerTapped: boolean;
}

export interface EmergencyIncident {
  id: string;
  title: string;
  category: string;
  description: string;
  severity: 'Moderate' | 'High' | 'Code Red';
  assignedSubordinateId?: string;
  status: 'Active' | 'In Progress' | 'Press Conference Ready' | 'Resolved';
  resolutionOutcome?: string;
}

export interface PressConference {
  id: string;
  headline: string;
  incidentContext: string;
  journalistQuestion: string;
  resolved: boolean;
  chosenSpin?: 'Transparency' | 'Scapegoat' | 'BlameMayor' | 'GagOrder';
}

export type ExecutiveArchetype = 'Untouchable Reformer' | 'Shadow Syndicate Chief' | 'Teflon Puppet' | 'Civic Statesman';

export interface ExecutiveState {
  isExecutive: boolean;
  chiefTitle: string; // e.g. "Police Chief", "Hospital Director", "Managing Partner", "Chief Executive Officer"
  category: string;
  archetype: ExecutiveArchetype;
  publicApproval: number;      // 0 - 100
  boardCouncilTrust: number;   // 0 - 100
  departmentMorale: number;    // 0 - 100
  scandalRisk: number;         // 0 - 100
  vulnerabilityIndex: number;  // 0 - 100
  investigationLevel: 'None' | 'Internal Audit' | 'Grand Jury Subpoena' | 'Federal Indictment';
  budget: DepartmentBudget;
  subordinates: SubordinateNPC[];
  dossiers: LeverageDossier[];
  activeIncident: EmergencyIncident | null;
  activePressConference: PressConference | null;
  yearsAsChief: number;
  historicAccomplishments: string[];
}

export interface GameState {
  character: {
    id: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    age: number;
    country: string;
    city: string;
    avatarIcon: string;
    specialTalent: SpecialTalent;
    stats: CharacterStats;
    bankBalance: number;
    debt: number;
    currentJob: Job | null;
    education: Education;
    isAlive: boolean;
    causeOfDeath?: string;
    isJailed?: boolean;
    jailYearsLeft?: number;
    relicsBoostActive?: boolean; // Golden Neko Statue etc
    careerHistory?: Record<string, number>; // maps job title / category -> total cumulative years served
  };
  relationships: PersonRelationship[];
  assets: Asset[];
  stocks: StockAsset[];
  lifeLogs: LifeLog[];
  graveyard: DeceasedRecord[];
  activeModal: 'none' | 'event' | 'relationships' | 'jobs' | 'assets' | 'activities' | 'aiCustom' | 'newLife' | 'graveyard' | 'menu' | 'education' | 'reverseAge';
  currentEvent: DecisionEvent | null;
  eventResultText: string | null;
  selectedPerson: PersonRelationship | null;
  governanceState?: GovernanceState;
  executiveState?: ExecutiveState;
  historySnapshots?: Record<number, {
    character: any;
    relationships: PersonRelationship[];
    assets: Asset[];
    stocks: StockAsset[];
    lifeLogs: LifeLog[];
    governanceState?: GovernanceState;
    executiveState?: ExecutiveState;
  }>;
}
