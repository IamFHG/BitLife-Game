import { GameState } from '../types';

/**
 * Clean and deduplicate list of completed degrees.
 * Eliminates redundant bare school names (e.g., "Pharmacy School") if a specific degree (e.g. "Pharmacy School Degree in Pharm.D...") exists.
 */
export function sanitizeCompletedDegrees(degrees: string[]): string[] {
  if (!degrees || !Array.isArray(degrees)) return [];

  const genericSchoolTypes = [
    'High School', 'University', 'Community College', 'Graduate School', 
    'Medical School', 'Law School', 'Business School', 'Dental School', 
    'Pharmacy School', 'Nursing School', 'Veterinary School', 'Trade School'
  ];

  const cleaned: string[] = [];

  for (const raw of degrees) {
    if (!raw || typeof raw !== 'string') continue;
    const item = raw.trim();
    if (!item) continue;

    // Skip if exact match exists
    if (cleaned.includes(item)) continue;

    // If it's a bare generic name like "Pharmacy School", check if a more detailed degree exists
    if (genericSchoolTypes.includes(item)) {
      const hasDetailed = degrees.some(d => d !== item && d.includes(item));
      if (hasDetailed) continue; // Skip generic fallback
    }

    // If adding a detailed degree, remove any previously added bare generic match
    const genericMatch = genericSchoolTypes.find(g => item.includes(g) && item !== g);
    if (genericMatch) {
      const existingIdx = cleaned.indexOf(genericMatch);
      if (existingIdx !== -1) {
        cleaned.splice(existingIdx, 1);
      }
    }

    if (!cleaned.includes(item)) {
      cleaned.push(item);
    }
  }

  return cleaned;
}

/**
 * Format long degree strings into clean, concise badge titles.
 */
export function formatShortDegreeTitle(degreeStr: string): string {
  if (!degreeStr) return '';
  let str = degreeStr.trim();

  // Extract major/title if in "School Degree in Major" format
  if (str.includes(' Degree in ')) {
    const parts = str.split(' Degree in ');
    str = parts[1] || parts[0];
  } else if (str.includes(' Diploma')) {
    str = str.replace(' Diploma', '');
  }

  // Common replacements
  str = str
    .replace('Master of Business Administration', 'MBA')
    .replace('Juris Doctor', 'J.D.')
    .replace('Doctor of Medicine', 'M.D.')
    .replace('Doctor of Dental Medicine', 'D.M.D.')
    .replace('Doctor of Pharmacy', 'Pharm.D.')
    .replace('Registered Nursing', 'RN / BSN')
    .replace('Bachelor of Science in ', 'B.S. ')
    .replace('Bachelor of Arts in ', 'B.A. ')
    .replace('Master of Science in ', 'M.S. ');

  // Clean double parens or artifacts
  str = str.replace(/\(J\.D\.\s*/g, '(').replace(/\(MBA\s*/g, '(');

  return str.trim();
}

/**
 * Get appropriate emoji icon for degree category.
 */
export function getDegreeIcon(degreeStr: string): string {
  const lower = (degreeStr || '').toLowerCase();
  if (lower.includes('law') || lower.includes('j.d.')) return '⚖️';
  if (lower.includes('med') || lower.includes('m.d.') || lower.includes('surgeon')) return '🩺';
  if (lower.includes('pharm') || lower.includes('drug')) return '💊';
  if (lower.includes('nurs') || lower.includes('bsn')) return '🩺';
  if (lower.includes('biz') || lower.includes('mba') || lower.includes('business')) return '💼';
  if (lower.includes('trade') || lower.includes('vocational')) return '🛠️';
  if (lower.includes('high school') || lower.includes('ged')) return '📜';
  return '🎓';
}

/**
 * Checks whether character satisfies an educational requirement.
 */
export function checkEducationQualification(character: GameState['character'], reqDegree?: string): {
  qualified: boolean;
  reason?: string;
} {
  if (!reqDegree || reqDegree === 'None') {
    return { qualified: true };
  }

  const { education, age } = character;
  const highest = education.details?.highestCompleted || '';
  const completedDegrees = education.details?.completedDegrees || [];
  const level = education.level;
  const hasGed = education.details?.hasGed || false;
  const graduated = education.graduated || false;

  const allEduStrings = [
    highest,
    ...completedDegrees,
    level !== 'None' ? level : ''
  ].join(' | ');

  // High School level requirement
  if (reqDegree === 'High School') {
    const hasHs = 
      hasGed || 
      allEduStrings.includes('High School') || 
      allEduStrings.includes('GED') || 
      allEduStrings.includes('Degree') || 
      allEduStrings.includes('College') || 
      allEduStrings.includes('University') ||
      allEduStrings.includes('School') ||
      (level === 'None' && age >= 18 && graduated);

    if (hasHs) return { qualified: true };
    return {
      qualified: false,
      reason: 'High School Diploma or GED Certificate required.'
    };
  }

  // University / College Degree requirement
  if (reqDegree === 'University' || reqDegree === 'College') {
    const hasCollege = 
      allEduStrings.includes('University') || 
      allEduStrings.includes('Community College') || 
      allEduStrings.includes('Graduate School') || 
      allEduStrings.includes('Medical School') || 
      allEduStrings.includes('Law School') || 
      allEduStrings.includes('Business School') ||
      allEduStrings.includes('Dental School') ||
      allEduStrings.includes('Pharmacy School') ||
      allEduStrings.includes('Nursing School') ||
      allEduStrings.includes('Veterinary School');

    if (hasCollege) return { qualified: true };
    return {
      qualified: false,
      reason: 'University or College Degree required.'
    };
  }

  // Law School Degree requirement
  if (reqDegree === 'Law School') {
    const hasLaw = allEduStrings.includes('Law School') || allEduStrings.includes('Juris Doctor');
    if (hasLaw) return { qualified: true };
    return {
      qualified: false,
      reason: 'Law School Degree (J.D.) required.'
    };
  }

  // Medical School Degree requirement
  if (reqDegree === 'Medical School') {
    const hasMed = allEduStrings.includes('Medical School') || allEduStrings.includes('Doctor of Medicine');
    if (hasMed) return { qualified: true };
    return {
      qualified: false,
      reason: 'Medical School Degree (M.D.) required.'
    };
  }

  // Nursing School requirement
  if (reqDegree === 'Nursing School') {
    const hasNursing = allEduStrings.includes('Nursing School') || allEduStrings.includes('Registered Nursing') || allEduStrings.includes('BSN');
    if (hasNursing) return { qualified: true };
    return {
      qualified: false,
      reason: 'Nursing School Degree (RN/BSN) required.'
    };
  }

  // Business School requirement
  if (reqDegree === 'Business School') {
    const hasBiz = allEduStrings.includes('Business School') || allEduStrings.includes('MBA');
    if (hasBiz) return { qualified: true };
    return {
      qualified: false,
      reason: 'Business School Degree (MBA) required.'
    };
  }

  // Trade School requirement
  if (reqDegree === 'Trade School') {
    const hasTrade = allEduStrings.includes('Trade School') || allEduStrings.includes('Vocational');
    if (hasTrade) return { qualified: true };
    return {
      qualified: false,
      reason: 'Trade School Vocational Degree required.'
    };
  }

  return { qualified: true };
}
