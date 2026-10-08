import { EducationLevel } from '../types';

export interface CareerTier {
  rankLevel: number; // 1, 2, 3, 4, 5...
  title: string;
  salary: number;
  reqYearsInPrevRank?: number;
  reqSmarts?: number;
  reqLooks?: number;
  reqDegree?: EducationLevel | string;
  description?: string;
  icon?: string;
}

export interface CareerPath {
  id: string;
  name: string;
  category: 'Corporate' | 'Tech' | 'Medical' | 'Creative' | 'Service' | 'Executive' | 'Trade' | 'Military' | 'Legal' | 'Public Service';
  icon: string;
  defaultEmployer: string;
  minAge?: number;
  isSpecialFame?: boolean;
  tiers: CareerTier[];
}

export const CAREER_PATHS: CareerPath[] = [
  // 1. JUDICIARY & LEGAL PATH (Magistrate -> Chief Justice example requested by user)
  {
    id: 'judiciary',
    name: 'Judiciary & Courts',
    category: 'Legal',
    icon: '⚖️',
    defaultEmployer: 'The City of Sher Garh',
    minAge: 22,
    tiers: [
      {
        rankLevel: 1,
        title: 'Magistrate',
        salary: 223932,
        reqDegree: 'Law School',
        reqSmarts: 65,
        description: 'Entry-level judicial officer presiding over minor offenses and preliminary court hearings.',
        icon: '⚖️'
      },
      {
        rankLevel: 2,
        title: 'Magistrate Court Judge',
        salary: 231329,
        reqYearsInPrevRank: 3,
        reqSmarts: 70,
        description: 'Judge presiding over magistrate court trials, misdemeanor hearings, and warrants.',
        icon: '👨‍⚖️'
      },
      {
        rankLevel: 3,
        title: 'District Court Judge',
        salary: 238724,
        reqYearsInPrevRank: 3,
        reqSmarts: 75,
        description: 'Presides over civil lawsuits and major criminal trials in federal or state district court.',
        icon: '🏛️'
      },
      {
        rankLevel: 4,
        title: 'Associate Chief Justice',
        salary: 246119,
        reqYearsInPrevRank: 4,
        reqSmarts: 80,
        description: 'Senior appellate judge reviewing constitutional appeals and guiding supreme judicial policy.',
        icon: '📜'
      },
      {
        rankLevel: 5,
        title: 'Chief Justice',
        salary: 253515,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'The highest judicial authority in the realm, presiding over the Supreme Bench and state judiciary.',
        icon: '👑'
      }
    ]
  },

  // 2. LAW FIRM ATTORNEY PATH
  {
    id: 'law_firm',
    name: 'Law Firm & Advocacy',
    category: 'Legal',
    icon: '💼',
    defaultEmployer: 'Pearson Specter & Associates',
    minAge: 21,
    tiers: [
      {
        rankLevel: 1,
        title: 'Law Clerk',
        salary: 68000,
        reqDegree: 'Law School',
        reqSmarts: 60,
        description: 'Conducts legal research and drafts briefs for firm partners.',
        icon: '📄'
      },
      {
        rankLevel: 2,
        title: 'Junior Associate',
        salary: 115000,
        reqYearsInPrevRank: 2,
        reqDegree: 'Law School',
        reqSmarts: 65,
        description: 'Litigates client cases and manages trial discovery.',
        icon: '👔'
      },
      {
        rankLevel: 3,
        title: 'Senior Associate',
        salary: 155000,
        reqYearsInPrevRank: 3,
        reqSmarts: 70,
        description: 'Leads complex litigation teams and manages key corporate accounts.',
        icon: '⚖️'
      },
      {
        rankLevel: 4,
        title: 'Junior Partner',
        salary: 210000,
        reqYearsInPrevRank: 4,
        reqSmarts: 75,
        description: 'Shares firm equity and supervises associate legal divisions.',
        icon: '🏙️'
      },
      {
        rankLevel: 5,
        title: 'Senior Partner',
        salary: 320000,
        reqYearsInPrevRank: 4,
        reqSmarts: 80,
        description: 'Earning partner directing high-stakes corporate disputes.',
        icon: '💼'
      },
      {
        rankLevel: 6,
        title: 'Managing Partner',
        salary: 580000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Executive head of the entire international law firm partnership.',
        icon: '🏛️'
      }
    ]
  },

  // 3. MILITARY - ARMY PATH
  {
    id: 'military_army',
    name: 'Military (U.S. Army)',
    category: 'Military',
    icon: '🎖️',
    defaultEmployer: 'U.S. Army',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Private Recruit',
        salary: 34000,
        reqDegree: 'High School',
        reqSmarts: 20,
        description: 'Basic combat enlistee undergoing foundational drill training.',
        icon: '🪖'
      },
      {
        rankLevel: 2,
        title: 'Corporal',
        salary: 44000,
        reqYearsInPrevRank: 2,
        reqSmarts: 30,
        description: 'Junior non-commissioned officer leading squad tactical operations.',
        icon: '🎖️'
      },
      {
        rankLevel: 3,
        title: 'Sergeant',
        salary: 58000,
        reqYearsInPrevRank: 2,
        reqSmarts: 40,
        description: 'Experienced NCO responsible for discipline and section command.',
        icon: '🛡️'
      },
      {
        rankLevel: 4,
        title: 'Staff Sergeant',
        salary: 72000,
        reqYearsInPrevRank: 3,
        reqSmarts: 50,
        description: 'Platoon leader directing field operations and weapon systems.',
        icon: '⚔️'
      },
      {
        rankLevel: 5,
        title: 'Warrant Officer',
        salary: 92000,
        reqYearsInPrevRank: 3,
        reqSmarts: 60,
        description: 'Technical specialist commanding specialized tactical units.',
        icon: '🦅'
      },
      {
        rankLevel: 6,
        title: 'Captain',
        salary: 125000,
        reqYearsInPrevRank: 3,
        reqSmarts: 65,
        description: 'Commissioned officer commanding an entire Army infantry company.',
        icon: '⭐'
      },
      {
        rankLevel: 7,
        title: 'Colonel',
        salary: 175000,
        reqYearsInPrevRank: 4,
        reqSmarts: 75,
        description: 'Brigade commander orchestrating theater-wide tactical logistics.',
        icon: '🌟'
      },
      {
        rankLevel: 8,
        title: 'General',
        salary: 260000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Four-star flag officer serving on the Joint Chiefs of Staff.',
        icon: '🎖️'
      }
    ]
  },

  // 4. MILITARY - NAVY PATH
  {
    id: 'military_navy',
    name: 'Military (U.S. Navy)',
    category: 'Military',
    icon: '⚓',
    defaultEmployer: 'U.S. Navy Fleet Command',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Seaman Apprentice',
        salary: 34000,
        reqDegree: 'High School',
        reqSmarts: 20,
        description: 'Deckhand recruit serving aboard naval combat vessels.',
        icon: '⚓'
      },
      {
        rankLevel: 2,
        title: 'Petty Officer',
        salary: 46000,
        reqYearsInPrevRank: 2,
        reqSmarts: 35,
        description: 'Supervises naval technical operations and vessel maintenance.',
        icon: '🌊'
      },
      {
        rankLevel: 3,
        title: 'Chief Petty Officer',
        salary: 62000,
        reqYearsInPrevRank: 3,
        reqSmarts: 45,
        description: 'Senior enlisted leader maintaining vessel combat readiness.',
        icon: '🛡️'
      },
      {
        rankLevel: 4,
        title: 'Lieutenant Commander',
        salary: 95000,
        reqYearsInPrevRank: 3,
        reqDegree: 'University',
        reqSmarts: 60,
        description: 'Executive officer commanding department divisions on destroyers.',
        icon: '⛵'
      },
      {
        rankLevel: 5,
        title: 'Naval Captain',
        salary: 145000,
        reqYearsInPrevRank: 4,
        reqSmarts: 75,
        description: 'Commands a guided missile cruiser or aircraft carrier strike group.',
        icon: '🚢'
      },
      {
        rankLevel: 6,
        title: 'Admiral',
        salary: 275000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Commander-in-Chief of Fleet Operations directing naval strategy.',
        icon: '⭐'
      }
    ]
  },

  // 5. MILITARY - AIR FORCE PATH
  {
    id: 'military_airforce',
    name: 'Military (U.S. Air Force)',
    category: 'Military',
    icon: '✈️',
    defaultEmployer: 'U.S. Air Force Global Command',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Airman Basic',
        salary: 35000,
        reqDegree: 'High School',
        reqSmarts: 25,
        description: 'Entry airman training in aviation technology and base security.',
        icon: '✈️'
      },
      {
        rankLevel: 2,
        title: 'Senior Airman',
        salary: 47000,
        reqYearsInPrevRank: 2,
        reqSmarts: 35,
        description: 'Specialist technician managing flightline aircraft repair.',
        icon: '🛠️'
      },
      {
        rankLevel: 3,
        title: 'Technical Sergeant',
        salary: 64000,
        reqYearsInPrevRank: 3,
        reqSmarts: 45,
        description: 'Flight section sergeant managing squad avionics maintenance.',
        icon: '⚡'
      },
      {
        rankLevel: 4,
        title: 'Flight Captain Pilot',
        salary: 110000,
        reqYearsInPrevRank: 3,
        reqDegree: 'University',
        reqSmarts: 65,
        description: 'Commissioned jet fighter pilot conducting tactical aerial sorties.',
        icon: '🛩️'
      },
      {
        rankLevel: 5,
        title: 'Wing Commander',
        salary: 165000,
        reqYearsInPrevRank: 4,
        reqSmarts: 75,
        description: 'Commands an entire air base wing fleet of combat bombers.',
        icon: '🦅'
      },
      {
        rankLevel: 6,
        title: 'Air Force General',
        salary: 280000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Chief of Staff directing national air defense operations.',
        icon: '⭐'
      }
    ]
  },

  // 6. MILITARY - MARINE CORPS PATH
  {
    id: 'military_marines',
    name: 'Military (U.S. Marine Corps)',
    category: 'Military',
    icon: '🪖',
    defaultEmployer: 'U.S. Marine Corps Amphibious Force',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Marine Recruit',
        salary: 34000,
        reqDegree: 'High School',
        reqSmarts: 20,
        description: 'Rifleman recruit completing elite amphibious infantry bootcamp.',
        icon: '🪖'
      },
      {
        rankLevel: 2,
        title: 'Lance Corporal',
        salary: 45000,
        reqYearsInPrevRank: 2,
        reqSmarts: 30,
        description: 'Squad combat specialist operating heavy weapon systems.',
        icon: '💥'
      },
      {
        rankLevel: 3,
        title: 'Gunnery Sergeant',
        salary: 65000,
        reqYearsInPrevRank: 3,
        reqSmarts: 45,
        description: 'Senior NCO coordinating tactical battalion logistics and fire.',
        icon: '🎯'
      },
      {
        rankLevel: 4,
        title: 'Marine Major',
        salary: 118000,
        reqYearsInPrevRank: 3,
        reqDegree: 'University',
        reqSmarts: 65,
        description: 'Field officer leading expeditionary Marine assault battalions.',
        icon: '🎖️'
      },
      {
        rankLevel: 5,
        title: 'Marine General',
        salary: 270000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Commandant of the Marine Corps orchestrating rapid response.',
        icon: '⭐'
      }
    ]
  },

  // 7. MILITARY - COAST GUARD PATH
  {
    id: 'military_coastguard',
    name: 'Military (U.S. Coast Guard)',
    category: 'Military',
    icon: '🛥️',
    defaultEmployer: 'U.S. Coast Guard Rescue Command',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Seaman Recruit',
        salary: 33000,
        reqDegree: 'High School',
        reqSmarts: 20,
        description: 'Coastal maritime security recruit in maritime rescue ops.',
        icon: '🛥️'
      },
      {
        rankLevel: 2,
        title: 'Rescue Swimmer',
        salary: 52000,
        reqYearsInPrevRank: 2,
        reqSmarts: 40,
        description: 'Elite helicopter swimmer performing open-ocean storm rescues.',
        icon: '🛟'
      },
      {
        rankLevel: 3,
        title: 'Cutter Commander',
        salary: 105000,
        reqYearsInPrevRank: 3,
        reqDegree: 'University',
        reqSmarts: 60,
        description: 'Captains high-endurance offshore patrol vessels on drug interdictions.',
        icon: '🚢'
      },
      {
        rankLevel: 4,
        title: 'Coast Guard Admiral',
        salary: 250000,
        reqYearsInPrevRank: 5,
        reqSmarts: 80,
        description: 'Commandant directing national maritime safety and port security.',
        icon: '⭐'
      }
    ]
  },

  // 5. MEDICAL PRACTICE & SURGERY PATH
  {
    id: 'medical_doctor',
    name: 'Medicine & Surgery',
    category: 'Medical',
    icon: '🩺',
    defaultEmployer: 'St. Jude Metropolitan Hospital',
    minAge: 25,
    tiers: [
      {
        rankLevel: 1,
        title: 'Medical Resident',
        salary: 68000,
        reqDegree: 'Medical School',
        reqSmarts: 75,
        description: 'Trainee physician completing intensive hospital residency rounds.',
        icon: '🩺'
      },
      {
        rankLevel: 2,
        title: 'Attending Physician',
        salary: 185000,
        reqYearsInPrevRank: 3,
        reqSmarts: 80,
        description: 'Licensed doctor managing patient diagnosis and clinical medicine.',
        icon: '👨‍⚕️'
      },
      {
        rankLevel: 3,
        title: 'Senior Surgeon',
        salary: 295000,
        reqYearsInPrevRank: 3,
        reqSmarts: 85,
        description: 'Specialist performing high-complexity surgical operations.',
        icon: '😷'
      },
      {
        rankLevel: 4,
        title: 'Chief of Surgery',
        salary: 420000,
        reqYearsInPrevRank: 4,
        reqSmarts: 90,
        description: 'Head administrator overseeing hospital surgical departments.',
        icon: '💉'
      },
      {
        rankLevel: 5,
        title: 'Hospital Medical Director',
        salary: 650000,
        reqYearsInPrevRank: 5,
        reqSmarts: 92,
        description: 'Top executive directing healthcare policy and hospital network.',
        icon: '🏥'
      }
    ]
  },

  // 6. TECH & SOFTWARE ENGINEERING
  {
    id: 'tech_engineer',
    name: 'Technology & Software',
    category: 'Tech',
    icon: '💻',
    defaultEmployer: 'GooGleTech Inc.',
    minAge: 21,
    tiers: [
      {
        rankLevel: 1,
        title: 'Junior Software Engineer',
        salary: 82000,
        reqDegree: 'University',
        reqSmarts: 65,
        description: 'Fixes bugs, writes feature code, and conducts automated test suites.',
        icon: '💻'
      },
      {
        rankLevel: 2,
        title: 'Software Engineer II',
        salary: 118000,
        reqYearsInPrevRank: 2,
        reqSmarts: 70,
        description: 'Builds core application services and scales backend infrastructure.',
        icon: '🖥️'
      },
      {
        rankLevel: 3,
        title: 'Senior Software Engineer',
        salary: 168000,
        reqYearsInPrevRank: 3,
        reqSmarts: 75,
        description: 'Architects microservices, mentors engineers, and leads sprints.',
        icon: '⚡'
      },
      {
        rankLevel: 4,
        title: 'Staff Software Architect',
        salary: 235000,
        reqYearsInPrevRank: 3,
        reqSmarts: 80,
        description: 'Sets technology roadmap for mission-critical enterprise systems.',
        icon: '🌐'
      },
      {
        rankLevel: 5,
        title: 'Principal Director of Engineering',
        salary: 380000,
        reqYearsInPrevRank: 4,
        reqSmarts: 85,
        description: 'Manages multi-national engineering divisions and cloud budgets.',
        icon: '🏢'
      },
      {
        rankLevel: 6,
        title: 'Chief Technology Officer (CTO)',
        salary: 850000,
        reqYearsInPrevRank: 5,
        reqSmarts: 90,
        description: 'C-suite executive shaping corporate innovation and AI vision.',
        icon: '🚀'
      }
    ]
  },

  // 7. CORPORATE FINANCE & EXECUTIVE PATH
  {
    id: 'corporate_finance',
    name: 'Corporate & Investment Banking',
    category: 'Corporate',
    icon: '📊',
    defaultEmployer: 'Goldman Wall St Financial',
    minAge: 21,
    tiers: [
      {
        rankLevel: 1,
        title: 'Financial Analyst',
        salary: 92000,
        reqDegree: 'University',
        reqSmarts: 70,
        description: 'Analyzes market assets, company balance sheets, and equity models.',
        icon: '📈'
      },
      {
        rankLevel: 2,
        title: 'Senior Strategy Consultant',
        salary: 138000,
        reqYearsInPrevRank: 3,
        reqSmarts: 75,
        description: 'Advises fortune 500 executives on mergers and capital structure.',
        icon: '📊'
      },
      {
        rankLevel: 3,
        title: 'Assistant Vice President',
        salary: 210000,
        reqYearsInPrevRank: 3,
        reqDegree: 'Business School',
        reqSmarts: 80,
        description: 'Manages hedge fund portfolios and investment risk metrics.',
        icon: '💼'
      },
      {
        rankLevel: 4,
        title: 'Vice President of Operations',
        salary: 380000,
        reqYearsInPrevRank: 4,
        reqSmarts: 85,
        description: 'Directs regional banking operations and institutional trading.',
        icon: '🏦'
      },
      {
        rankLevel: 5,
        title: 'Managing Director',
        salary: 750000,
        reqYearsInPrevRank: 4,
        reqSmarts: 88,
        description: 'Oversees multi-billion dollar investment banking divisions.',
        icon: '💎'
      },
      {
        rankLevel: 6,
        title: 'Chief Executive Officer (CEO)',
        salary: 2200000,
        reqYearsInPrevRank: 5,
        reqSmarts: 90,
        description: 'Top corporate chief leading public market strategy and shareholders.',
        icon: '👑'
      }
    ]
  },

  // 8. HOLLYWOOD & STARDOM (SPECIAL CAREER)
  {
    id: 'creative_actor',
    name: 'Acting & Stardom',
    category: 'Creative',
    icon: '🎬',
    defaultEmployer: 'Hollywood Paramount Studios',
    minAge: 18,
    isSpecialFame: true,
    tiers: [
      {
        rankLevel: 1,
        title: 'Background Extra Actor',
        salary: 38000,
        reqDegree: 'High School',
        reqLooks: 50,
        description: 'Appears in crowd scenes for television shows and films.',
        icon: '🎭'
      },
      {
        rankLevel: 2,
        title: 'Supporting TV Actor',
        salary: 92000,
        reqYearsInPrevRank: 2,
        reqLooks: 60,
        description: 'Plays recurring roles in popular primetime network dramas.',
        icon: '📺'
      },
      {
        rankLevel: 3,
        title: 'Lead Series Actor',
        salary: 280000,
        reqYearsInPrevRank: 3,
        reqLooks: 70,
        description: 'Stars as the titular protagonist in major streaming television series.',
        icon: '🌟'
      },
      {
        rankLevel: 4,
        title: 'Movie Star',
        salary: 1400000,
        reqYearsInPrevRank: 4,
        reqLooks: 75,
        description: 'Headline actor starring in blockbuster theatrical feature films.',
        icon: '🎬'
      },
      {
        rankLevel: 5,
        title: 'A-List Hollywood Legend',
        salary: 6500000,
        reqYearsInPrevRank: 5,
        reqLooks: 80,
        description: 'Global icon and Oscar-winning celebrity revered worldwide.',
        icon: '🏆'
      }
    ]
  },

  // 9. POLICE & LAW ENFORCEMENT
  {
    id: 'police',
    name: 'Police & Law Enforcement',
    category: 'Public Service',
    icon: '🚓',
    defaultEmployer: 'Metropolitan Police Department',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Police Cadet',
        salary: 45000,
        reqDegree: 'High School',
        reqSmarts: 30,
        description: 'Trainee learning physical tactics and criminal law at the academy.',
        icon: '🚔'
      },
      {
        rankLevel: 2,
        title: 'Police Officer',
        salary: 62000,
        reqYearsInPrevRank: 2,
        reqSmarts: 40,
        description: 'Patrol officer enforcing traffic, answering emergency calls, and arresting suspects.',
        icon: '👮'
      },
      {
        rankLevel: 3,
        title: 'Police Detective',
        salary: 84000,
        reqYearsInPrevRank: 3,
        reqSmarts: 55,
        description: 'Investigates major felony cases, homicide, and organized crime units.',
        icon: '🕵️'
      },
      {
        rankLevel: 4,
        title: 'Police Lieutenant',
        salary: 115000,
        reqYearsInPrevRank: 3,
        reqSmarts: 65,
        description: 'Commands shift operations and precinct field personnel.',
        icon: '🛡️'
      },
      {
        rankLevel: 5,
        title: 'Police Captain',
        salary: 150000,
        reqYearsInPrevRank: 4,
        reqSmarts: 75,
        description: 'Precision administrator commanding full precinct police divisions.',
        icon: '⭐'
      },
      {
        rankLevel: 6,
        title: 'Chief of Police',
        salary: 220000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Top executive leading city-wide law enforcement strategy.',
        icon: '👑'
      }
    ]
  },

  // 10. FIRE DEPARTMENT & RESCUE
  {
    id: 'firefighter',
    name: 'Fire Department & Rescue',
    category: 'Public Service',
    icon: '👩‍🚒',
    defaultEmployer: 'City Fire & Emergency Station',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Probationary Firefighter',
        salary: 42000,
        reqDegree: 'High School',
        reqSmarts: 25,
        description: 'Rookie responder handling hose lines, ladder trucks, and rescue gear.',
        icon: '🚒'
      },
      {
        rankLevel: 2,
        title: 'Firefighter / EMT',
        salary: 62000,
        reqYearsInPrevRank: 2,
        reqSmarts: 35,
        description: 'Responds to structural blazes, hazardous spills, and medical emergencies.',
        icon: '👨‍🚒'
      },
      {
        rankLevel: 3,
        title: 'Fire Lieutenant',
        salary: 82000,
        reqYearsInPrevRank: 3,
        reqSmarts: 50,
        description: 'Directs fire engine companies and on-scene rescue tactics.',
        icon: '🔥'
      },
      {
        rankLevel: 4,
        title: 'Fire Captain',
        salary: 108000,
        reqYearsInPrevRank: 4,
        reqSmarts: 65,
        description: 'Station house commander directing major incident response.',
        icon: '🛡️'
      },
      {
        rankLevel: 5,
        title: 'Fire Chief',
        salary: 165000,
        reqYearsInPrevRank: 5,
        reqSmarts: 75,
        description: 'Executive head of the entire municipal fire protection bureau.',
        icon: '👑'
      }
    ]
  },

  // 11. AVIATION & AIRLINE PILOT
  {
    id: 'aviation_pilot',
    name: 'Aviation & Airlines',
    category: 'Service',
    icon: '✈️',
    defaultEmployer: 'Global Skylines Airlines',
    minAge: 20,
    tiers: [
      {
        rankLevel: 1,
        title: 'Flight Instructor',
        salary: 44000,
        reqDegree: 'Trade School',
        reqSmarts: 50,
        description: 'Teaches aviation students flight maneuvers and instrument flight rules.',
        icon: '🛩️'
      },
      {
        rankLevel: 2,
        title: 'First Officer (Co-Pilot)',
        salary: 88000,
        reqYearsInPrevRank: 2,
        reqSmarts: 60,
        description: 'Assists airline captain on regional passenger jets.',
        icon: '🛫'
      },
      {
        rankLevel: 3,
        title: 'Commercial Airline Captain',
        salary: 195000,
        reqYearsInPrevRank: 4,
        reqSmarts: 75,
        description: 'Commands widebody trans-oceanic international airliners.',
        icon: '✈️'
      },
      {
        rankLevel: 4,
        title: 'Chief Pilot & Fleet Director',
        salary: 280000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Oversees safety compliance, pilot training, and global flight routes.',
        icon: '🌟'
      }
    ]
  },

  // 12. CULINARY & RESTAURANT
  {
    id: 'hospitality_chef',
    name: 'Culinary Arts & Restaurants',
    category: 'Service',
    icon: '👨‍🍳',
    defaultEmployer: 'Le Petit Bistro Fine Dining',
    minAge: 16,
    tiers: [
      {
        rankLevel: 1,
        title: 'Apprentice Line Cook',
        salary: 32000,
        reqDegree: 'High School',
        reqSmarts: 15,
        description: 'Prepares ingredients and cooks station dishes during dinner service.',
        icon: '🍳'
      },
      {
        rankLevel: 2,
        title: 'Sous Chef',
        salary: 54000,
        reqYearsInPrevRank: 2,
        reqSmarts: 35,
        description: 'Second-in-command supervising kitchen staff and food prep.',
        icon: '🍲'
      },
      {
        rankLevel: 3,
        title: 'Executive Head Chef',
        salary: 98000,
        reqYearsInPrevRank: 3,
        reqSmarts: 55,
        description: 'Designs gourmet seasonal menus and manages kitchen operations.',
        icon: '👨‍🍳'
      },
      {
        rankLevel: 4,
        title: 'Michelin Star Restaurateur',
        salary: 380000,
        reqYearsInPrevRank: 4,
        reqSmarts: 70,
        description: 'World-renowned celebrity chef owning international luxury restaurants.',
        icon: '⭐'
      }
    ]
  },

  // 13. TRADES - ELECTRICIAN & POWER
  {
    id: 'trade_electrician',
    name: 'Trades & Electrical Engineering',
    category: 'Trade',
    icon: '⚡',
    defaultEmployer: 'Volt & Power Electric Co.',
    minAge: 18,
    tiers: [
      {
        rankLevel: 1,
        title: 'Apprentice Electrician',
        salary: 42000,
        reqDegree: 'High School',
        reqSmarts: 25,
        description: 'Assists master electricians wiring commercial power distribution.',
        icon: '🔧'
      },
      {
        rankLevel: 2,
        title: 'Journeyman Electrician',
        salary: 68000,
        reqYearsInPrevRank: 2,
        reqSmarts: 40,
        description: 'Installs transformer grids and troubleshoots high-voltage circuits.',
        icon: '⚡'
      },
      {
        rankLevel: 3,
        title: 'Master Electrician',
        salary: 98000,
        reqYearsInPrevRank: 3,
        reqSmarts: 55,
        description: 'Certifies industrial power blueprints and inspects complex installations.',
        icon: '💡'
      },
      {
        rankLevel: 4,
        title: 'Electrical Contractor Owner',
        salary: 240000,
        reqYearsInPrevRank: 4,
        reqSmarts: 70,
        description: 'Runs a private contracting business supplying power infrastructure.',
        icon: '🏭'
      }
    ]
  },

  // 14. EDUCATION & ACADEMIA
  {
    id: 'education',
    name: 'Education & Academia',
    category: 'Public Service',
    icon: '🧑‍🏫',
    defaultEmployer: 'State University Faculty',
    minAge: 21,
    tiers: [
      {
        rankLevel: 1,
        title: 'Teaching Assistant',
        salary: 35000,
        reqDegree: 'University',
        reqSmarts: 50,
        description: 'Grades undergraduate exams and assists professors during lectures.',
        icon: '📝'
      },
      {
        rankLevel: 2,
        title: 'High School Instructor',
        salary: 55000,
        reqDegree: 'University',
        reqSmarts: 60,
        description: 'Teaches curriculum subjects to secondary school students.',
        icon: '📚'
      },
      {
        rankLevel: 3,
        title: 'Assistant Professor',
        salary: 82000,
        reqDegree: 'Graduate School',
        reqSmarts: 70,
        description: 'Conducts academic research and lectures university courses.',
        icon: '🎓'
      },
      {
        rankLevel: 4,
        title: 'Tenured Professor',
        salary: 135000,
        reqYearsInPrevRank: 4,
        reqSmarts: 80,
        description: 'Holds permanent faculty chair publishing scholarly literature.',
        icon: '🏛️'
      },
      {
        rankLevel: 5,
        title: 'University Dean',
        salary: 225000,
        reqYearsInPrevRank: 5,
        reqSmarts: 85,
        description: 'Top academic administrator leading college faculties and research funds.',
        icon: '👑'
      }
    ]
  }
];
