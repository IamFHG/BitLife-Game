import { Job, JobCoworker, Gender, CharacterStats } from '../types';
import { CAREER_PATHS, CareerPath, CareerTier } from '../data/careerData';
import { getRandomInt, getRandomElement } from './gameUtils';

const FIRST_NAMES_MALE = ['Matteo', 'Aaron', 'Lucas', 'Julian', 'Sebastian', 'Oliver', 'Ethan', 'Daniel', 'Liam', 'Henry'];
const FIRST_NAMES_FEMALE = ['Christelle', 'Sophia', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Harper', 'Amelia'];
const LAST_NAMES = ['Klum', 'Debussy', 'Lettiere', 'Vance', 'Sterling', 'Hardman', 'Mercer', 'Dupont', 'Kovacs', 'Sinclair'];

export function generateCoworkers(companyName: string, currentJobTitle: string): { supervisor: JobCoworker; coworkers: JobCoworker[] } {
  // Generate Supervisor
  const supGender: Gender = Math.random() > 0.5 ? 'Male' : 'Female';
  const supFirstName = getRandomElement(supGender === 'Male' ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
  const supLastName = getRandomElement(LAST_NAMES);

  const supervisor: JobCoworker = {
    id: 'boss_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: `${supFirstName} ${supLastName}`,
    role: `Supervisor (${companyName})`,
    relationship: getRandomInt(45, 75),
    isBoss: true,
    gender: supGender,
    avatarIcon: supGender === 'Male' ? '🧔' : '👩'
  };

  // Generate 2 to 4 Coworkers
  const coworkerCount = getRandomInt(2, 4);
  const coworkers: JobCoworker[] = [];

  for (let i = 0; i < coworkerCount; i++) {
    const gender: Gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const fName = getRandomElement(gender === 'Male' ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
    const lName = getRandomElement(LAST_NAMES);

    coworkers.push({
      id: 'coworker_' + Date.now() + '_' + i,
      name: `${fName} ${lName}`,
      role: `Team Member`,
      relationship: getRandomInt(40, 80),
      gender,
      avatarIcon: gender === 'Male' ? '👨' : '👩'
    });
  }

  return { supervisor, coworkers };
}

export function findCareerPathByJobTitle(title: string): { path: CareerPath; tierIndex: number } | null {
  for (const path of CAREER_PATHS) {
    const idx = path.tiers.findIndex(t => t.title.toLowerCase() === title.toLowerCase());
    if (idx !== -1) {
      return { path, tierIndex: idx };
    }
  }
  return null;
}

export function getEmployerForCity(path: CareerPath, city?: string): string {
  if (path.id === 'judiciary') {
    return `The City of ${city || 'Sher Garh'}`;
  }
  if (path.id === 'police' || path.id === 'firefighter') {
    return `${city || 'Metropolitan'} Public Safety`;
  }
  return path.defaultEmployer;
}

export interface PromotionCheckResult {
  eligible: boolean;
  nextTier: CareerTier | null;
  reason: string;
  progressPercent: number;
}

export function checkCareerPromotionEligibility(
  characterStats: CharacterStats,
  currentJob: Job,
  careerHistory?: Record<string, number>
): PromotionCheckResult {
  const match = currentJob.careerPathId 
    ? CAREER_PATHS.find(p => p.id === currentJob.careerPathId) 
    : findCareerPathByJobTitle(currentJob.title)?.path;

  if (!match) {
    // Generic job fallback
    if (currentJob.performance >= 80 && currentJob.yearsInRole >= 2) {
      return {
        eligible: true,
        nextTier: null,
        reason: 'You are eligible for a salary bump!',
        progressPercent: 100
      };
    }
    return {
      eligible: false,
      nextTier: null,
      reason: 'Work hard and gain more years of experience to qualify.',
      progressPercent: Math.min(100, Math.round((currentJob.performance / 80) * 50 + (currentJob.yearsInRole / 2) * 50))
    };
  }

  const currentTierIdx = currentJob.currentTierIndex ?? match.tiers.findIndex(t => t.title.toLowerCase() === currentJob.title.toLowerCase());
  if (currentTierIdx === -1 || currentTierIdx >= match.tiers.length - 1) {
    return {
      eligible: false,
      nextTier: null,
      reason: 'You have reached the absolute pinnacle of this career path! You hold the highest rank.',
      progressPercent: 100
    };
  }

  const nextTier = match.tiers[currentTierIdx + 1];
  const reqYears = nextTier.reqYearsInPrevRank || 2;
  const reqPerformance = 70;

  // Calculate cumulative years in this role across lifetime + current role
  const pastRoleYears = careerHistory ? (careerHistory[currentJob.title] || 0) : 0;
  const totalEffectiveYears = currentJob.yearsInRole + pastRoleYears;

  const yearsProgress = Math.min(100, (totalEffectiveYears / reqYears) * 100);
  const perfProgress = Math.min(100, (currentJob.performance / reqPerformance) * 100);
  const totalProgress = Math.round((yearsProgress + perfProgress) / 2);

  if (totalEffectiveYears < reqYears) {
    return {
      eligible: false,
      nextTier,
      reason: `You need at least ${reqYears} year(s) of experience in your position (You have ${totalEffectiveYears} year${totalEffectiveYears === 1 ? '' : 's'} cumulative service).`,
      progressPercent: totalProgress
    };
  }

  if (currentJob.performance < reqPerformance) {
    return {
      eligible: false,
      nextTier,
      reason: `Your job performance must be at least ${reqPerformance}% (Current: ${currentJob.performance}%).`,
      progressPercent: totalProgress
    };
  }

  if (nextTier.reqSmarts && characterStats.smarts < nextTier.reqSmarts) {
    return {
      eligible: false,
      nextTier,
      reason: `This rank requires at least ${nextTier.reqSmarts}% Smarts (You have ${characterStats.smarts}%).`,
      progressPercent: totalProgress
    };
  }

  if (currentJob.supervisor && currentJob.supervisor.relationship < 45) {
    return {
      eligible: false,
      nextTier,
      reason: `Your supervisor (${currentJob.supervisor.name}) holds a low opinion of you! Flatter them to improve your relationship.`,
      progressPercent: totalProgress
    };
  }

  return {
    eligible: true,
    nextTier,
    reason: `Congratulations! You meet all requirements to be promoted to ${nextTier.title}!`,
    progressPercent: 100
  };
}

export function hasSupremeJobPrivilege(
  character: {
    currentJob: Job | null;
    careerHistory?: Record<string, number>;
    completedDutyIds?: string[];
  },
  governanceState?: { isGovernor?: boolean; [key: string]: any }
): boolean {
  if (governanceState?.isGovernor) return true;

  const currentJob = character.currentJob;
  if (currentJob) {
    const titleLower = currentJob.title.toLowerCase();
    if (
      titleLower.includes('governor') ||
      titleLower.includes('provisional') ||
      titleLower.includes('dictator') ||
      titleLower.includes('regime leader') ||
      titleLower.includes('general') ||
      titleLower.includes('admiral') ||
      titleLower.includes('chief of staff') ||
      titleLower.includes('wing commander') ||
      titleLower.includes('supreme commander')
    ) {
      return true;
    }
  }

  const history = character.careerHistory || {};
  for (const role of Object.keys(history)) {
    const roleLower = role.toLowerCase();
    if (
      roleLower.includes('general') ||
      roleLower.includes('admiral') ||
      roleLower.includes('governor') ||
      roleLower.includes('provisional') ||
      roleLower.includes('chief of staff') ||
      roleLower.includes('supreme commander')
    ) {
      return true;
    }
  }

  if (character.completedDutyIds?.includes('military_rank4_martial_law')) {
    return true;
  }

  return false;
}

export function checkJobApplicationEligibility(
  path: CareerPath,
  tier: CareerTier,
  character: {
    age: number;
    stats: CharacterStats;
    currentJob: Job | null;
    careerHistory?: Record<string, number>;
    completedDutyIds?: string[];
  },
  governanceState?: { isGovernor?: boolean }
): { qualified: boolean; reason?: string } {
  if (hasSupremeJobPrivilege(character, governanceState)) {
    return { qualified: true };
  }

  const tierIdx = path.tiers.findIndex(t => t.title.toLowerCase() === tier.title.toLowerCase());
  if (tierIdx === -1) return { qualified: true };

  // Entry rank (rank 1) is always open to applicants if education/smarts pass
  if (tierIdx === 0) {
    return { qualified: true };
  }

  // If applying for higher rank (e.g. Magistrate Court Judge or re-entering at higher rank):
  const prevTier = path.tiers[tierIdx - 1];
  const reqYears = tier.reqYearsInPrevRank || 2;

  const history = character.careerHistory || {};
  const prevRankPastYears = history[prevTier.title] || 0;
  const currentRankPastYears = history[tier.title] || 0;

  const activeJobYearsInPrevRank = (character.currentJob && character.currentJob.title.toLowerCase() === prevTier.title.toLowerCase())
    ? character.currentJob.yearsInRole
    : 0;

  const totalExperienceInPrevRank = prevRankPastYears + activeJobYearsInPrevRank + currentRankPastYears;

  if (totalExperienceInPrevRank < reqYears) {
    return {
      qualified: false,
      reason: `Requires at least ${reqYears} year(s) of total cumulative service as ${prevTier.title} (You have ${totalExperienceInPrevRank} year(s) recorded in your career history).`
    };
  }

  return { qualified: true };
}
