import { Job, ExecutiveState, SubordinateNPC, LeverageDossier, EmergencyIncident, PressConference, ExecutiveArchetype, DepartmentBudget } from '../types';

/**
  * Check if a given job corresponds to an Executive / Supervisor / Chief authority role
  */
export function isExecutiveRole(job: Job | null): boolean {
  if (!job) return false;
  const title = job.title.toLowerCase();
  const company = job.company.toLowerCase();
  const category = job.category;

  const executiveKeywords = [
    'chief', 'commissioner', 'director', 'managing partner', 'presiding judge',
    'ceo', 'cto', 'cfo', 'president', 'general', 'admiral', 'superintendent',
    'chancellor', 'governor', 'commander', 'superintendent', 'district attorney'
  ];

  const hasKey = executiveKeywords.some(k => title.includes(k) || company.includes(k));
  const isTierTop = (job.currentTierIndex ?? 0) >= 4;

  return hasKey || (category === 'Executive') || (isTierTop && (category === 'Public Service' || category === 'Medical' || category === 'Legal' || category === 'Military' || category === 'Corporate' || category === 'Tech'));
}

/**
  * Calculates the Executive Archetype based on integrity (low scandal/vulnerability) and authority
  */
export function calculateArchetype(
  scandalRisk: number,
  vulnerabilityIndex: number,
  boardCouncilTrust: number,
  publicApproval: number
): ExecutiveArchetype {
  const isCorrupt = scandalRisk > 45 || vulnerabilityIndex > 40;
  const isHighAuthority = boardCouncilTrust > 60 || publicApproval > 60;

  if (!isCorrupt && isHighAuthority) return 'Untouchable Reformer';
  if (isCorrupt && isHighAuthority) return 'Shadow Syndicate Chief';
  if (isCorrupt && !isHighAuthority) return 'Teflon Puppet';
  return 'Civic Statesman';
}

/**
  * Create default ExecutiveState if character reaches top chief status
  */
export function initializeExecutiveState(job: Job): ExecutiveState {
  const category = job.category || 'Public Service';
  const title = job.title || 'Chief Officer';

  let baseBudget = 3500000;
  if (job.salary > 200000) baseBudget = 10000000;
  if (job.salary > 500000) baseBudget = 25000000;

  const initialSubordinates: SubordinateNPC[] = [
    {
      id: 'sub_1',
      name: 'Capt. Marcus Vance',
      role: 'Deputy Division Commander',
      gender: 'Male',
      avatarIcon: '👮‍♂️',
      competence: 84,
      loyalty: 88,
      corruption: 15,
      trait: 'Negotiator',
      salary: 110000,
      status: 'Active'
    },
    {
      id: 'sub_2',
      name: 'Lt. Sarah Jenkins',
      role: 'Tactical Unit Lead',
      gender: 'Female',
      avatarIcon: '🕵️‍♀️',
      competence: 92,
      loyalty: 62,
      corruption: 35,
      trait: 'Trigger-Happy',
      salary: 95000,
      status: 'Active'
    },
    {
      id: 'sub_3',
      name: 'Det. Viktor Kroll',
      role: 'Special Operations Lead',
      gender: 'Male',
      avatarIcon: '👤',
      competence: 76,
      loyalty: 95,
      corruption: 82,
      trait: 'Corrupt',
      salary: 88000,
      status: 'Active'
    },
    {
      id: 'sub_4',
      name: 'Dr. Elena Rostova',
      role: 'Chief Compliance & Operations',
      gender: 'Female',
      avatarIcon: '👩‍⚕️',
      competence: 89,
      loyalty: 70,
      corruption: 10,
      trait: 'Whistleblower-Prone',
      salary: 125000,
      status: 'Active'
    }
  ];

  const initialDossiers: LeverageDossier[] = [
    {
      id: 'dos_1',
      npcName: 'Mayor Richard Sterling',
      npcRole: 'Mayor',
      relationship: 65,
      dirtDiscovered: ['Offshore Real Estate Holdings', 'Campaign Finance Irregularities'],
      leveragePoints: 40,
      hasDirtOnPlayer: false,
      playerTapped: true
    },
    {
      id: 'dos_2',
      npcName: 'Councilwoman Diane Hayes',
      npcRole: 'City Council Chair',
      relationship: 50,
      dirtDiscovered: ['Secret Meeting with Municipal Bidders'],
      leveragePoints: 25,
      hasDirtOnPlayer: false,
      playerTapped: false
    },
    {
      id: 'dos_3',
      npcName: 'Director Thomas Blake',
      npcRole: 'IA Director',
      relationship: 40,
      dirtDiscovered: [],
      leveragePoints: 0,
      hasDirtOnPlayer: false,
      playerTapped: false
    },
    {
      id: 'dos_4',
      npcName: 'Samantha Cruz',
      npcRole: 'Lead Reporter',
      relationship: 45,
      dirtDiscovered: ['Unpublished Draft on Department Misconduct'],
      leveragePoints: 15,
      hasDirtOnPlayer: true,
      playerTapped: false
    }
  ];

  const initialIncident: EmergencyIncident = {
    id: 'inc_101',
    title: 'High-Stakes Downtown Bank Standoff',
    category: category,
    description: 'Multiple suspects barricaded inside central metropolitan vault with 14 civilian hostages. Local media broadcasting live.',
    severity: 'Code Red',
    status: 'Active'
  };

  return {
    isExecutive: true,
    chiefTitle: title,
    category: category,
    archetype: 'Civic Statesman',
    publicApproval: 78,
    boardCouncilTrust: 82,
    departmentMorale: 75,
    scandalRisk: 15,
    vulnerabilityIndex: 10,
    investigationLevel: 'None',
    budget: {
      totalBudget: baseBudget,
      allocations: {
        wages: 50,      // 50%
        operations: 30, // 30%
        oversight: 15,  // 15%
        slushFund: 5    // 5%
      },
      siphonedAccumulated: 0
    },
    subordinates: initialSubordinates,
    dossiers: initialDossiers,
    activeIncident: initialIncident,
    activePressConference: null,
    yearsAsChief: 1,
    historicAccomplishments: [`Appointed ${title} with supreme executive authority.`]
  };
}

/**
  * Process an incident tactical resolution
  */
export function resolveIncident(
  exec: ExecutiveState,
  subordinateId: string,
  directive: 'DeEscalate' | 'AggressiveBreach' | 'CovertPayoff'
): { updatedExec: ExecutiveState; logText: string; feedbackType: 'success' | 'error' | 'info' } {
  const sub = exec.subordinates.find(s => s.id === subordinateId);
  if (!sub) {
    return { updatedExec: exec, logText: 'No subordinate selected for dispatch.', feedbackType: 'error' };
  }

  let approvalChange = 0;
  let moraleChange = 0;
  let scandalChange = 0;
  let outcomeMessage = '';

  if (directive === 'DeEscalate') {
    if (sub.trait === 'Negotiator' || sub.competence > 80) {
      approvalChange = +10;
      moraleChange = +8;
      outcomeMessage = `SUCCESS: ${sub.name} negotiated a peaceful resolution! All hostages secured safely. Public approval boosted.`;
    } else if (sub.trait === 'Trigger-Happy') {
      approvalChange = -8;
      scandalChange = +12;
      outcomeMessage = `BLUNDER: ${sub.name} broke protocol and engaged prematurely during de-escalation, triggering media panic!`;
    } else {
      approvalChange = +4;
      outcomeMessage = `${sub.name} de-escalated the situation with minor delays.`;
    }
  } else if (directive === 'AggressiveBreach') {
    if (sub.trait === 'Trigger-Happy' || sub.competence > 85) {
      approvalChange = +12;
      moraleChange = +10;
      outcomeMessage = `TACTICAL DOMINANCE: ${sub.name} led a swift, high-intensity assault! Threat neutralized in minutes.`;
    } else {
      approvalChange = -12;
      scandalChange = +18;
      moraleChange = -10;
      outcomeMessage = `DISASTER: Aggressive breach led by ${sub.name} resulted in collateral damage and intense public outcry!`;
    }
  } else {
    // Covert Payoff
    if (sub.trait === 'Corrupt' || sub.loyalty > 80) {
      scandalChange = +8;
      outcomeMessage = `QUIET DEAL: ${sub.name} paid off key actors discreetly. Crisis dissipated from headline news.`;
    } else {
      scandalChange = +25;
      approvalChange = -15;
      outcomeMessage = `LEAKED! ${sub.name} attempted a covert payoff, but a whistleblower leaked the hush money transaction to reporters!`;
    }
  }

  const newApproval = Math.min(100, Math.max(0, exec.publicApproval + approvalChange));
  const newMorale = Math.min(100, Math.max(0, exec.departmentMorale + moraleChange));
  const newScandal = Math.min(100, Math.max(0, exec.scandalRisk + scandalChange));

  // Spawn press conference for media briefing
  const newPressConf: PressConference = {
    id: `press_${Date.now()}`,
    headline: `BREAKING: Executive Briefing on ${exec.activeIncident?.title || 'Department Crisis'}`,
    incidentContext: outcomeMessage,
    journalistQuestion: `"Chief, the public is demanding answers regarding the command decisions made during this critical operation. How do you respond to allegations of departmental liability?"`,
    resolved: false
  };

  const updatedExec: ExecutiveState = {
    ...exec,
    publicApproval: newApproval,
    departmentMorale: newMorale,
    scandalRisk: newScandal,
    activeIncident: null,
    activePressConference: newPressConf,
    archetype: calculateArchetype(newScandal, exec.vulnerabilityIndex, exec.boardCouncilTrust, newApproval)
  };

  return { updatedExec, logText: outcomeMessage, feedbackType: scandalChange > 15 ? 'error' : 'success' };
}

/**
  * Resolve dynamic Press Conference Spin Strategy
  */
export function resolvePressConference(
  exec: ExecutiveState,
  spin: 'Transparency' | 'Scapegoat' | 'BlameMayor' | 'GagOrder'
): { updatedExec: ExecutiveState; logText: string; feedbackType: 'success' | 'error' | 'info' } {
  if (!exec.activePressConference) {
    return { updatedExec: exec, logText: 'No press conference active.', feedbackType: 'error' };
  }

  let approvalChange = 0;
  let councilChange = 0;
  let scandalChange = 0;
  let outcome = '';

  if (spin === 'Transparency') {
    approvalChange = +12;
    councilChange = -5;
    scandalChange = -10;
    outcome = 'Press praised your full transparency and direct accountability. Public trust increased.';
  } else if (spin === 'Scapegoat') {
    approvalChange = +4;
    scandalChange = -15;
    // Lower morale of subordinates
    outcome = 'You publicly shifted blame onto a division deputy. You shielded yourself, but department morale plummeted.';
  } else if (spin === 'BlameMayor') {
    approvalChange = +15;
    councilChange = -25;
    outcome = 'You aggressively called out political leadership for underfunding and interference! The public loved your defiance, but the Mayor is furious.';
  } else {
    // Gag Order
    approvalChange = -10;
    scandalChange = +20;
    outcome = 'You enforced an aggressive press gag order. Reporters expressed outrage, driving up scandal speculation.';
  }

  const updatedExec: ExecutiveState = {
    ...exec,
    publicApproval: Math.min(100, Math.max(0, exec.publicApproval + approvalChange)),
    boardCouncilTrust: Math.min(100, Math.max(0, exec.boardCouncilTrust + councilChange)),
    scandalRisk: Math.min(100, Math.max(0, exec.scandalRisk + scandalChange)),
    activePressConference: null
  };

  return { updatedExec, logText: outcome, feedbackType: spin === 'GagOrder' ? 'error' : 'success' };
}

/**
  * Siphon off-book Slush Fund into personal bank balance
  */
export function siphonSlushFund(
  exec: ExecutiveState,
  amount: number
): { updatedExec: ExecutiveState; siphonedCash: number; logText: string } {
  const slushPercent = exec.budget.allocations.slushFund;
  const maxSiphon = Math.round((exec.budget.totalBudget * (slushPercent / 100)) * 0.5);
  const actualSiphon = Math.min(amount, maxSiphon);

  const vulnerabilityIncrease = Math.round((actualSiphon / 100000) * 8);
  const scandalIncrease = Math.round((actualSiphon / 100000) * 5);

  const updatedBudget: DepartmentBudget = {
    ...exec.budget,
    siphonedAccumulated: exec.budget.siphonedAccumulated + actualSiphon
  };

  const updatedExec: ExecutiveState = {
    ...exec,
    budget: updatedBudget,
    vulnerabilityIndex: Math.min(100, exec.vulnerabilityIndex + vulnerabilityIncrease),
    scandalRisk: Math.min(100, exec.scandalRisk + scandalIncrease)
  };

  return {
    updatedExec,
    siphonedCash: actualSiphon,
    logText: `Siphoned $${actualSiphon.toLocaleString()} off-book into personal offshore vault. (+${vulnerabilityIncrease}% Legal Vulnerability)`
  };
}

/**
  * Execute Blackmail using Shadow Network Leverage
  */
export function executeBlackmail(
  exec: ExecutiveState,
  dossierId: string,
  targetGoal: 'DemandBudget' | 'QuashAudit' | 'SilenceStory'
): { updatedExec: ExecutiveState; logText: string; feedbackType: 'success' | 'error' | 'info' } {
  const dossier = exec.dossiers.find(d => d.id === dossierId);
  if (!dossier || dossier.dirtDiscovered.length === 0) {
    return { updatedExec: exec, logText: 'No viable dirt discovered on target yet.', feedbackType: 'error' };
  }

  let outcomeText = '';
  let updatedExec = { ...exec };

  if (targetGoal === 'DemandBudget') {
    const bonus = 1500000;
    updatedExec.budget.totalBudget += bonus;
    updatedExec.boardCouncilTrust = Math.max(0, updatedExec.boardCouncilTrust - 15);
    outcomeText = `BLACKMAIL SUCCESS: Used recorded dossiers against ${dossier.npcName}! Secured an emergency $1.5M budget bump.`;
  } else if (targetGoal === 'QuashAudit') {
    updatedExec.investigationLevel = 'None';
    updatedExec.vulnerabilityIndex = Math.max(0, updatedExec.vulnerabilityIndex - 25);
    outcomeText = `BLACKMAIL SUCCESS: Pressured ${dossier.npcName} to quietly shut down the internal corruption audit!`;
  } else {
    // Silence Story
    updatedExec.scandalRisk = Math.max(0, updatedExec.scandalRisk - 30);
    outcomeText = `BLACKMAIL SUCCESS: Forced ${dossier.npcName} to kill the investigative expose! Scandal risk suppressed.`;
  }

  // Reduce leverage points after usage
  updatedExec.dossiers = updatedExec.dossiers.map(d => d.id === dossierId ? { ...d, leveragePoints: Math.max(0, d.leveragePoints - 40) } : d);

  return { updatedExec, logText: outcomeText, feedbackType: 'success' };
}

/**
  * Process annual year-end continuity step for Executive Authority
  */
export function processYearEndExecutive(
  exec: ExecutiveState,
  currentAge: number
): {
  updatedExec: ExecutiveState;
  annualLogs: string[];
  personalMoneyGranted: number;
  specialOutcome?: 'GrandJuryIndictment' | 'MayorUltimatum' | 'WhistleblowerLeak';
} {
  const logs: string[] = [];
  let personalCash = 0;
  let specialOutcome: 'GrandJuryIndictment' | 'MayorUltimatum' | 'WhistleblowerLeak' | undefined;

  // 1. Slush Fund Yield
  const slushFundYield = Math.round((exec.budget.totalBudget * (exec.budget.allocations.slushFund / 100)) * 0.2);
  if (slushFundYield > 0) {
    personalCash += slushFundYield;
    logs.push(`💵 Executive Discretionary Slush Yield: +$${slushFundYield.toLocaleString()} deposited into private accounts.`);
  }

  // 2. Oversight vs Vulnerability
  const oversightPower = exec.budget.allocations.oversight;
  let vulnerabilityDelta = 0;
  if (oversightPower < 10) {
    vulnerabilityDelta += 6;
    logs.push(`⚠️ Low Internal Oversight allocation caused rogue activity in department divisions (+6% Legal Vulnerability).`);
  } else if (oversightPower >= 20) {
    vulnerabilityDelta -= 4;
    logs.push(`🛡️ High Oversight budget suppressed corruption across deputy rosters.`);
  }

  let newVulnerability = Math.min(100, Math.max(0, exec.vulnerabilityIndex + vulnerabilityDelta));
  let newScandal = Math.min(100, Math.max(0, exec.scandalRisk + (exec.subordinates.some(s => s.corruption > 75) ? 8 : 0)));
  let newInvestigation = exec.investigationLevel;

  // 3. Trigger High-Stakes Escalations
  if (newVulnerability > 75 && newInvestigation === 'None') {
    newInvestigation = 'Grand Jury Subpoena';
    specialOutcome = 'GrandJuryIndictment';
    logs.push(`🚨 STATE GRAND JURY SUBPOENA ISSUED! Federal prosecutors have opened a criminal inquiry into your executive administration.`);
  } else if (exec.boardCouncilTrust < 30) {
    specialOutcome = 'MayorUltimatum';
    logs.push(`⚡ MAYORAL ULTIMATUM: The City Council and Mayor issued a vote of no confidence! Turn around metrics or face immediate dismissal.`);
  } else if (exec.subordinates.some(s => s.trait === 'Whistleblower-Prone' && s.loyalty < 40)) {
    specialOutcome = 'WhistleblowerLeak';
    newScandal = Math.min(100, newScandal + 35);
    logs.push(`📢 WHISTLEBLOWER LEAK! A disgruntled deputy lead leaked secret internal documents directly to the press!`);
  }

  // 4. Generate next year's incident
  const nextIncident: EmergencyIncident = {
    id: `inc_${currentAge + 1}`,
    title: `Year ${currentAge + 1} High-Impact Operational Crisis`,
    category: exec.category,
    description: `A major structural scandal and operational emergency has broken out requiring swift executive command.`,
    severity: 'High',
    status: 'Active'
  };

  const updatedExec: ExecutiveState = {
    ...exec,
    yearsAsChief: exec.yearsAsChief + 1,
    vulnerabilityIndex: newVulnerability,
    scandalRisk: newScandal,
    investigationLevel: newInvestigation,
    activeIncident: nextIncident,
    archetype: calculateArchetype(newScandal, newVulnerability, exec.boardCouncilTrust, exec.publicApproval)
  };

  return {
    updatedExec,
    annualLogs: logs,
    personalMoneyGranted: personalCash,
    specialOutcome
  };
}
