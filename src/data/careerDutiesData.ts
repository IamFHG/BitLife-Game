export interface CareerDutyOption {
  text: string;
  resultTitle: string;
  resultText: string;
  statChanges?: {
    happiness?: number;
    health?: number;
    smarts?: number;
    looks?: number;
    fame?: number;
    karma?: number;
  };
  jobPerformanceChange?: number;
  moneyChange?: number;
  specialEffect?: 'martial_law_governance' | 'supreme_court_immunity' | 'impeachment' | 'court_martial' | 'promoted';
}

export interface CareerDutyScenario {
  id: string;
  category: 'Legal' | 'Military' | 'Medical' | 'Tech' | 'Corporate' | 'Executive' | 'Public Service' | 'Creative' | 'General';
  title: string;
  subtitle?: string;
  roleKeywords?: string[];
  minRankLevel?: number; // 1 = Entry, 2 = Mid, 3 = Senior/Director, 4 = Supreme/Pinnacle
  maxRankLevel?: number;
  icon: string;
  description: string;
  detailsBox?: {
    label: string;
    items: { key: string; value: string }[];
  };
  options: CareerDutyOption[];
}

export const CAREER_DUTIES_DATABASE: CareerDutyScenario[] = [
  // ==================== LEGAL & JUDICIARY ====================
  // Rank 1: Entry / Magistrate / Clerk / Junior Attorney
  {
    id: 'legal_rank1_traffic_dispute',
    category: 'Legal',
    title: 'Municipal Traffic Court Hearing',
    subtitle: 'Speeding Ticket Appeal & Evidence Check',
    roleKeywords: ['Magistrate', 'Clerk', 'Attorney', 'Lawyer', 'Prosecutor', 'Legal Assistant'],
    minRankLevel: 1,
    maxRankLevel: 1,
    icon: '⚖️',
    description: 'A local citizen contests a $450 traffic violation ticket, presenting dashcam footage that suggests the speed calibration radar was faulty.',
    detailsBox: {
      label: 'Court Docket #104',
      items: [
        { key: 'Plaintiff', value: 'City Traffic Bureau' },
        { key: 'Defendant', value: 'Evelyn Miller' },
        { key: 'Claimed Speed', value: '62 mph in 35 mph zone' },
        { key: 'Defense Evidence', value: 'Dashcam GPS Speed Log' }
      ]
    },
    options: [
      {
        text: 'Dismiss Ticket (Acknowledge Calibration Fault)',
        resultTitle: 'Case Dismissed!',
        resultText: 'You reviewed the dashcam GPS telemetry and dismissed the ticket. The motorist thanked you for fair municipal justice.',
        statChanges: { karma: 10, happiness: 5 },
        jobPerformanceChange: 10
      },
      {
        text: 'Reduce Fine to $50 Warning (Equitable Compromise)',
        resultTitle: 'Compromise Reached',
        resultText: 'You reduced the fine significantly. Both parties accepted the ruling without further appeal.',
        statChanges: { karma: 5 },
        jobPerformanceChange: 10
      },
      {
        text: 'Uphold Full $450 Fine (Strict Revenue Enforcement)',
        resultTitle: 'Fine Upheld',
        resultText: 'You upheld the ticket based on official police radar logs. The city clerk commended your firm stance.',
        statChanges: { karma: -5 },
        jobPerformanceChange: 5
      }
    ]
  },

  // Rank 2-3: District / Circuit / Senior Attorney
  {
    id: 'legal_rank2_corporate_fraud',
    category: 'Legal',
    title: 'District Court Securities Fraud Trial',
    subtitle: 'State v. Sterling Securities',
    roleKeywords: ['Judge', 'District Judge', 'Attorney', 'Prosecutor', 'Lawyer', 'Partner'],
    minRankLevel: 2,
    maxRankLevel: 3,
    icon: '🏛️',
    description: 'A hedge fund CEO faces charges of insider trading. Defense counsel requests suppression of FBI wiretap evidence citing technical warrant defects.',
    detailsBox: {
      label: 'Case Dossier',
      items: [
        { key: 'Defendant', value: 'Marcus Sterling (Hedge Fund CEO)' },
        { key: 'Charge', value: '$180M Securities Fraud' },
        { key: 'Contested Evidence', value: 'Encrypted Audio Wiretaps' }
      ]
    },
    options: [
      {
        text: 'Overrule Defense Motion: Wiretaps Admitted',
        resultTitle: 'Guilty Verdict Returned!',
        resultText: 'You admitted the wiretaps. The jury convicted the defendant, and the press praised your judicial integrity.',
        statChanges: { karma: 10, fame: 10, happiness: 10 },
        jobPerformanceChange: 15
      },
      {
        text: 'Sustain Defense Motion: Wiretaps Excluded',
        resultTitle: 'Wiretaps Suppressed',
        resultText: 'You ruled the warrant defective under Fourth Amendment protections. Legal scholars lauded your constitutional strictness.',
        statChanges: { karma: 15, smarts: 5 },
        jobPerformanceChange: 10
      },
      {
        text: 'Accept Confidential Bribe in Chambers',
        resultTitle: 'Mistrial Declared',
        resultText: 'You declared a mistrial due to procedural flaws after receiving a offshore transfer. You got rich, but rumors circulate.',
        statChanges: { karma: -30 },
        moneyChange: 200000,
        jobPerformanceChange: -20
      }
    ]
  },

  // Rank 4: Supreme Court / Chief Justice / Legal Pinnacle
  {
    id: 'legal_rank4_supreme_ruling',
    category: 'Legal',
    title: 'Supreme Court Landmark Constitutional Ruling',
    subtitle: 'National AI Regulation & Free Expression Case',
    roleKeywords: ['Chief Justice', 'Supreme Court', 'Justice', 'Appellate Judge', 'Attorney General'],
    minRankLevel: 4,
    maxRankLevel: 5,
    icon: '⚖️',
    description: 'You are issuing the deciding opinion in a historic Supreme Court constitutional case evaluating state powers over synthetic speech and algorithmic transparency.',
    detailsBox: {
      label: 'Supreme Court Docket',
      items: [
        { key: 'Issue', value: 'First Amendment Rights vs. Algorithmic Regulation' },
        { key: 'Amicus Briefs', value: '140+ International Tech & Civil Rights Coalitions' },
        { key: 'Public Stake', value: 'National Precedent for Digital Era' }
      ]
    },
    options: [
      {
        text: 'Author Majority Opinion: Uphold Transparency Standards',
        resultTitle: 'Historic Precedent Set!',
        resultText: 'Your opinion created a landmark legal framework published globally. You were recognized as one of the century’s legal giants.',
        statChanges: { smarts: 10, fame: 25, karma: 15 },
        jobPerformanceChange: 25,
        specialEffect: 'supreme_court_immunity'
      },
      {
        text: 'Hold Live Press Conference to Explain Opinion to Nation',
        resultTitle: 'National Address Executed',
        resultText: 'You addressed federal court correspondents live on national television, articulating constitutional jurisprudence with absolute clarity.',
        statChanges: { fame: 30, smarts: 5 },
        jobPerformanceChange: 20
      },
      {
        text: 'Dissent & Accuse Colleagues of Judicial Overreach',
        resultTitle: 'Firebrand Dissent Published',
        resultText: 'Your blistering dissent sparked intense national debate, turning you into a revered legal figurehead.',
        statChanges: { fame: 20, karma: -5 },
        jobPerformanceChange: 10
      }
    ]
  },

  // ==================== MILITARY & DEFENSE ====================
  // Rank 1: Private / Corporal / Cadet
  {
    id: 'military_rank1_perimeter_patrol',
    category: 'Military',
    title: 'Outpost Perimeter Recon Patrol',
    subtitle: 'Sector 4 Night Patrol',
    roleKeywords: ['Private', 'Corporal', 'Cadet', 'Infantry', 'Soldier', 'Seaman', 'Airman'],
    minRankLevel: 1,
    maxRankLevel: 1,
    icon: '🪖',
    description: 'While on night perimeter watch, motion sensors detect unauthorized movement in the tree line 200 meters outside the military compound.',
    detailsBox: {
      label: 'Patrol Log',
      items: [
        { key: 'Location', value: 'Forward Outpost Alpha' },
        { key: 'Thermal Signature', value: '3 Unidentified Contacts' },
        { key: 'Protocol', value: 'Halt & Identify' }
      ]
    },
    options: [
      {
        text: 'Challenge Contacts via Radio & Flares',
        resultTitle: 'Infiltrators Detained!',
        resultText: 'You illuminated the grid with flares. The contacts surrendered — they were enemy scouts carrying maps. Your squad commander commended your vigilance.',
        statChanges: { karma: 10, fame: 5 },
        jobPerformanceChange: 15
      },
      {
        text: 'Perform Tactical Sweep with Squad',
        resultTitle: 'Perimeter Secured',
        resultText: 'You led a tactical flank, apprehending the intruders without firing a shot.',
        statChanges: { health: -5, smarts: 5 },
        jobPerformanceChange: 10
      },
      {
        text: 'Ignore Ping as Animal False Alarm',
        resultTitle: 'Reprimanded by Sergeant',
        resultText: 'The ping was an enemy drone scout. Your squad sergeant issued a stern written warning.',
        statChanges: { karma: -5 },
        jobPerformanceChange: -15
      }
    ]
  },

  // Rank 2-3: Lieutenant / Captain / Major / Colonel
  {
    id: 'military_rank2_tactical_strike',
    category: 'Military',
    title: 'Forward Operations Tactical Strike',
    subtitle: 'Operation Desert Shield',
    roleKeywords: ['Captain', 'Major', 'Colonel', 'Lieutenant', 'Commander', 'Sergeant'],
    minRankLevel: 2,
    maxRankLevel: 3,
    icon: '🎖️',
    description: 'An hostile armored convoy is moving toward an allied communications depot. Satellite intel confirms heavy armor and electronic jamming gear.',
    detailsBox: {
      label: 'Tactical Briefing',
      items: [
        { key: 'Threat Level', value: 'HIGH - Imminent Assault' },
        { key: 'Assets Available', value: 'Laser-Guided Air Strike, Mobile Artillery' }
      ]
    },
    options: [
      {
        text: 'Order Precision Laser Air Strike',
        resultTitle: 'Convoy Neutralized!',
        resultText: 'The precision strike destroyed the armor before they reached firing range. Base Command awarded you the Commendation Medal.',
        statChanges: { fame: 15, karma: 10 },
        jobPerformanceChange: 20
      },
      {
        text: 'Deploy Ground Infantry & Anti-Tank Squads',
        resultTitle: 'Hard-Fought Ground Victory',
        resultText: 'Your troops held the line through heavy fighting, securing enemy tactical gear.',
        statChanges: { health: -10, fame: 10 },
        jobPerformanceChange: 15
      },
      {
        text: 'Retreat & Consolidate Base Defenses',
        resultTitle: 'Strategic Withdrawal',
        resultText: 'You minimized casualties, though senior officers questioned your combat aggressiveness.',
        statChanges: { karma: -5 },
        jobPerformanceChange: -10
      }
    ]
  },

  // Rank 4: General / Army Chief of Staff / Admiral
  {
    id: 'military_rank4_martial_law',
    category: 'Military',
    title: 'National Crisis & High Command Emergency Power',
    subtitle: 'Pentagon Directive 01-ALPHA',
    roleKeywords: ['General', 'Army Chief of Staff', 'Chief of Staff', 'Admiral', 'Supreme Commander'],
    minRankLevel: 4,
    maxRankLevel: 5,
    icon: '🚨',
    description: 'A major national cyber collapse and widespread civil riots threaten critical infrastructure. Civil authorities request high command military emergency intervention.',
    detailsBox: {
      label: 'Joint Chiefs Command',
      items: [
        { key: 'Crisis', value: 'Power Grid Failure & Urban Anarchy' },
        { key: 'Proposed Order', value: 'Enact State Readiness / Martial Law Authority' }
      ]
    },
    options: [
      {
        text: 'Declare Martial Law & Take Supreme Governance Control',
        resultTitle: 'Provisional Military Rule Established!',
        resultText: 'You assumed supreme authority as Provisional Military Governor! Order was restored instantly, your salary doubled, and you wielded total state power.',
        statChanges: { fame: 35, karma: -15, happiness: 20 },
        moneyChange: 100000,
        jobPerformanceChange: 25,
        specialEffect: 'martial_law_governance'
      },
      {
        text: 'Deploy National Guard Corps for Infrastructure & Relief',
        resultTitle: 'National Hero!',
        resultText: 'You deployed army engineers to restore power substations and distribute rations. Citizens celebrated you as the defender of the nation.',
        statChanges: { fame: 30, karma: 25, happiness: 15 },
        jobPerformanceChange: 25
      },
      {
        text: 'Refuse Civil Intervention (Preserve Strict Civilian Supremacy)',
        resultTitle: 'Constitutional Principle Upheld',
        resultText: 'You kept troops in barracks, insisting civil police handle domestic order. Constitutional scholars praised your restraint.',
        statChanges: { karma: 20, smarts: 10 },
        jobPerformanceChange: 10
      }
    ]
  },

  // ==================== MEDICAL ====================
  // Rank 1: Resident / ER Doctor / Nurse
  {
    id: 'medical_rank1_er_triage',
    category: 'Medical',
    title: 'Emergency Room Night Triage',
    subtitle: 'Metropolitan Hospital ER',
    roleKeywords: ['Resident', 'Intern', 'Nurse', 'Physician Assistant', 'Doctor'],
    minRankLevel: 1,
    maxRankLevel: 1,
    icon: '🩺',
    description: 'A sudden multi-vehicle crash brings 6 trauma patients into the ER simultaneously. You must rapidly prioritize care assignments.',
    detailsBox: {
      label: 'ER Triage Board',
      items: [
        { key: 'Patient 1', value: 'Severe head trauma (Critical)' },
        { key: 'Patient 2', value: 'Fractured femur & bleeding (Urgent)' },
        { key: 'Staff Available', value: '2 Attending Physicians, 3 Nurses' }
      ]
    },
    options: [
      {
        text: 'Execute Fast Triage Protocol & Stabilize Critical First',
        resultTitle: 'All Patients Stabilized!',
        resultText: 'Your swift triage allowed trauma surgeons to operate immediately. Attending doctors praised your composure under intense pressure.',
        statChanges: { karma: 15, smarts: 5, happiness: 10 },
        jobPerformanceChange: 15
      },
      {
        text: 'Administer Emergency Clotting Agents Yourself',
        resultTitle: 'Hands-On Life Saved',
        resultText: 'You stopped severe femoral arterial bleeding manually before surgery.',
        statChanges: { smarts: 5, karma: 10 },
        jobPerformanceChange: 10
      },
      {
        text: 'Freeze Under Pressure & Call Senior Supervisor',
        resultTitle: 'Delayed Response',
        resultText: 'Senior doctors took over command. You were advised to practice high-stress emergency drills.',
        statChanges: { karma: -5 },
        jobPerformanceChange: -10
      }
    ]
  },

  // Rank 2-3: Surgeon / Attending Physician / Specialist
  {
    id: 'medical_rank2_open_heart',
    category: 'Medical',
    title: 'Emergency Open-Heart Surgery',
    subtitle: 'Operating Room 3',
    roleKeywords: ['Surgeon', 'Attending Physician', 'Specialist', 'Chief Resident'],
    minRankLevel: 2,
    maxRankLevel: 3,
    icon: '🏥',
    description: 'A patient arrives with acute aortic rupture. Heart rate is spiking and internal bleeding threatens immediate cardiac arrest.',
    detailsBox: {
      label: 'Surgical Monitor',
      items: [
        { key: 'Diagnosis', value: 'Type A Aortic Dissection' },
        { key: 'Vitals', value: 'BP 70/40, HR 148 BPM' },
        { key: 'Window', value: '< 10 Minutes' }
      ]
    },
    options: [
      {
        text: 'Perform Rapid Synthetic Grafting & Clamp',
        resultTitle: 'Miraculous Surgical Repair!',
        resultText: 'Your precision clamped the vessel and placed the synthetic graft seamlessly. The patient survived with full recovery expected.',
        statChanges: { smarts: 5, karma: 20, happiness: 15, fame: 10 },
        jobPerformanceChange: 20
      },
      {
        text: 'Use Experimental Endovascular Scope Procedure',
        resultTitle: 'Innovative Success Published!',
        resultText: 'The minimally invasive procedure succeeded without opening the chest cavity. The case was published in the New England Journal of Medicine.',
        statChanges: { smarts: 10, fame: 15 },
        jobPerformanceChange: 15
      },
      {
        text: 'Guide Senior Resident Through the Operation',
        resultTitle: 'Teaching Masterclass',
        resultText: 'You coached the resident through the bypass clamp step-by-step, building surgical confidence.',
        statChanges: { karma: 10 },
        jobPerformanceChange: 10
      }
    ]
  },

  // Rank 4: Chief of Surgery / Hospital Director
  {
    id: 'medical_rank4_epidemic_protocol',
    category: 'Medical',
    title: 'Hospital Board Epidemic Containment Emergency',
    subtitle: 'Regional Health Command Directive',
    roleKeywords: ['Chief of Surgery', 'Hospital Director', 'Medical Director', 'Chief Medical Officer'],
    minRankLevel: 4,
    maxRankLevel: 5,
    icon: '🧬',
    description: 'An aggressive drug-resistant viral strain breaks out in the city. As Chief Medical Officer, you must decide emergency containment procedures for the healthcare system.',
    detailsBox: {
      label: 'Epidemic Command Center',
      items: [
        { key: 'Infection Rate', value: '+350% Daily Increase' },
        { key: 'Bed Capacity', value: '92% Full' },
        { key: 'Proposed Action', value: 'Convert Ward to Isolation Unit & Reallocate ICU' }
      ]
    },
    options: [
      {
        text: 'Enact Total Isolation Protocol & Convert Hospital Wings',
        resultTitle: 'Epidemic Contained Nationally!',
        resultText: 'Your swift containment strategy prevented a nationwide health crisis. The WHO awarded you the Global Health Leadership Medal.',
        statChanges: { fame: 25, karma: 20, smarts: 10 },
        jobPerformanceChange: 25
      },
      {
        text: 'Fast-Track Experimental Antiviral Clinical Trial',
        resultTitle: 'Medical Breakthrough Discovered!',
        resultText: 'The experimental trial yielded a 98% cure rate, generating millions in medical research grants for your hospital.',
        statChanges: { smarts: 10, fame: 20 },
        moneyChange: 50000,
        jobPerformanceChange: 20
      },
      {
        text: 'Appeals to Government for Emergency Military Field Hospitals',
        resultTitle: 'Federal Emergency Aid Arrives',
        resultText: 'Army medical units constructed field wards within 24 hours, easing hospital pressure.',
        statChanges: { fame: 15, karma: 10 },
        jobPerformanceChange: 15
      }
    ]
  },

  // ==================== TECH & ENGINEERING ====================
  // Rank 1: Junior Developer / QA Engineer
  {
    id: 'tech_rank1_bug_fix',
    category: 'Tech',
    title: 'Critical Production Code Bug',
    subtitle: 'Payment Gateway Crash Issue',
    roleKeywords: ['Junior Developer', 'Software Engineer', 'QA Engineer', 'Analyst', 'Programmer'],
    minRankLevel: 1,
    maxRankLevel: 1,
    icon: '💻',
    description: 'A null pointer exception in the checkout codebase causes 15% of mobile app transactions to fail during Black Friday sales.',
    detailsBox: {
      label: 'System Alert',
      items: [
        { key: 'Error', value: 'HTTP 500 Null Pointer Exception' },
        { key: 'Financial Impact', value: '$12,000 / Minute Lost Sales' }
      ]
    },
    options: [
      {
        text: 'Hotfix Code Patch & Write Automated Regression Tests',
        resultTitle: 'Bug Patched in 10 Minutes!',
        resultText: 'You identified the unhandled null edge case, deployed a hotfix, and saved the company over $200k in sales.',
        statChanges: { smarts: 5, karma: 10, happiness: 10 },
        jobPerformanceChange: 15
      },
      {
        text: 'Rollback Deployment to Previous Stable Release',
        resultTitle: 'System Restored',
        resultText: 'Rolling back restored checkout functionality immediately, giving engineers time to investigate safely.',
        statChanges: { smarts: 5 },
        jobPerformanceChange: 10
      },
      {
        text: 'Pass Ticket to Senior Developer on Duty',
        resultTitle: 'Escalated to Senior',
        resultText: 'The senior engineer fixed the issue, though suggested you practice debugging concurrency logs.',
        statChanges: { karma: 0 },
        jobPerformanceChange: 0
      }
    ]
  },

  // Rank 2-3: Senior Developer / Software Architect / Lead
  {
    id: 'tech_rank2_cyber_ransomware',
    category: 'Tech',
    title: 'Zero-Day Ransomware Attack Response',
    subtitle: 'Cyber Incident Command',
    roleKeywords: ['Senior Engineer', 'Lead Engineer', 'Architect', 'Engineering Manager', 'Director'],
    minRankLevel: 2,
    maxRankLevel: 3,
    icon: '⚡',
    description: 'Ransomware hackers exploit a zero-day vulnerability in database servers, encrypting customer data and demanding $10M in Bitcoin.',
    detailsBox: {
      label: 'Cyber Incident Threat',
      items: [
        { key: 'Target', value: 'Production User Database' },
        { key: 'Demand', value: '200 BTC ($10,000,000)' },
        { key: 'Time Limit', value: '45 Minutes' }
      ]
    },
    options: [
      {
        text: 'Reverse-Engineer Exploit & Deploy Air-Gapped Cold Backup Restore',
        resultTitle: 'Hackers Defeated & Systems Restored!',
        resultText: 'You isolated the malware vector and restored full production state from cold backups without paying a dime.',
        statChanges: { smarts: 10, fame: 15, happiness: 15 },
        jobPerformanceChange: 25
      },
      {
        text: 'Isolate Infrastructure & Coordinate FBI Cyber Taskforce',
        resultTitle: 'Federal Cyber Unit Neutralizes Hacker Group',
        resultText: 'Federal cyber agents traced the command server, seizing the decryption keys.',
        statChanges: { fame: 10, smarts: 5 },
        jobPerformanceChange: 15
      },
      {
        text: 'Pay Ransom Demand from Emergency Corporate Reserve',
        resultTitle: 'Data Decrypted at Heavy Financial Loss',
        resultText: 'Data was restored, but board directors criticized the steep financial payout.',
        statChanges: { karma: -10 },
        jobPerformanceChange: -15
      }
    ]
  },

  // Rank 4: CTO / Tech Titan / VP Engineering
  {
    id: 'tech_rank4_ai_infrastructure',
    category: 'Tech',
    title: 'Global Autonomous Network Rollout',
    subtitle: 'Enterprise AI Core Launch',
    roleKeywords: ['CTO', 'VP Engineering', 'Chief Technology Officer', 'Tech Titan', 'Founder'],
    minRankLevel: 4,
    maxRankLevel: 5,
    icon: '🌐',
    description: 'As CTO, you are supervising the global activation of a multi-region autonomous server grid powering 500 million devices worldwide.',
    detailsBox: {
      label: 'Global Launch Grid',
      items: [
        { key: 'Scale', value: '500,000,000 Active Devices' },
        { key: 'Infrastructure', value: '12 Global Quantum Data Centers' }
      ]
    },
    options: [
      {
        text: 'Execute Seamless Global Activation Sequence',
        resultTitle: 'Tech Revolution Achieved!',
        resultText: 'The network launched with 99.999% uptime. Company stock skyrocketed, making you an icon in Tech Crunch and Forbes.',
        statChanges: { fame: 30, smarts: 10, happiness: 20 },
        moneyChange: 100000,
        jobPerformanceChange: 25
      },
      {
        text: 'Conduct Keynote Presentation at Silicon Valley Summit',
        resultTitle: 'Keynote Standing Ovation',
        resultText: 'Your live keynote speech went viral globally, cementing your authority as a visionary tech executive.',
        statChanges: { fame: 35 },
        jobPerformanceChange: 20
      },
      {
        text: 'Delay Launch 1 Month for Rigorous Security Audit',
        resultTitle: 'Flawless Security Standard',
        resultText: 'The delay uncovered 3 critical vulnerabilities before launch, earning institutional investor trust.',
        statChanges: { smarts: 5, karma: 10 },
        jobPerformanceChange: 15
      }
    ]
  },

  // ==================== POLICE & PUBLIC SERVICE ====================
  // Rank 1: Police Officer / Detective
  {
    id: 'police_rank1_chase',
    category: 'Public Service',
    title: 'High-Speed Vehicle Pursuit & Arrest',
    subtitle: 'Sector 9 Patrol',
    roleKeywords: ['Police Officer', 'Officer', 'Patrol', 'Deputy', 'Firefighter'],
    minRankLevel: 1,
    maxRankLevel: 1,
    icon: '🚔',
    description: 'A stolen sports car flees a traffic stop at high speed through a crowded downtown shopping precinct.',
    detailsBox: {
      label: 'Dispatch Audio',
      items: [
        { key: 'Suspect', value: 'Armed Felony Robbery Suspect' },
        { key: 'Speed', value: '95 MPH in 30 MPH Zone' }
      ]
    },
    options: [
      {
        text: 'Deploy Precision Spike Strip at Intersecting Avenue',
        resultTitle: 'Suspect Arrested Without Injury!',
        resultText: 'The spike strip safely deflated the tires. The suspect surrendered immediately. Police Chief awarded you a Commendation.',
        statChanges: { karma: 10, fame: 10 },
        jobPerformanceChange: 15
      },
      {
        text: 'Execute PIT Maneuver in Empty Industrial Zone',
        resultTitle: 'Tactical Stop Executed',
        resultText: 'You spun out the suspect car cleanly in an empty alleyway.',
        statChanges: { smarts: 5 },
        jobPerformanceChange: 10
      },
      {
        text: 'Call Off Pursuit Due to High Civilian Hazard',
        resultTitle: 'Safety Prioritized',
        resultText: 'You aborted the pursuit to prevent civilian danger. Traffic cameras captured the suspect later.',
        statChanges: { karma: 5 },
        jobPerformanceChange: 5
      }
    ]
  },

  // Rank 2-3: Police Captain / Detective Commander / Deputy Chief
  {
    id: 'police_rank2_hostage_crisis',
    category: 'Public Service',
    title: 'Downtown Bank Hostage Standoff',
    subtitle: 'Crisis Negotiation Command',
    roleKeywords: ['Detective', 'Captain', 'Lieutenant', 'Commander', 'Chief Inspector'],
    minRankLevel: 2,
    maxRankLevel: 3,
    icon: '🚨',
    description: 'Armed suspects take 12 bank tellers hostage during an attempted heist, demanding $2M and a helicopter.',
    detailsBox: {
      label: 'Hostage Standoff',
      items: [
        { key: 'Hostages', value: '12 Civilians' },
        { key: 'Perimeter', value: 'SWAT Snipers in position' }
      ]
    },
    options: [
      {
        text: 'Negotiate Safe Release of Hostages (De-escalation)',
        resultTitle: 'All Hostages Rescued Safely!',
        resultText: 'After 3 hours of expert negotiation, suspects laid down arms and freed all hostages without firing a shot.',
        statChanges: { karma: 20, fame: 15, happiness: 15 },
        jobPerformanceChange: 20
      },
      {
        text: 'Order Flashbang SWAT Tactical Breach',
        resultTitle: 'SWAT Breach Successful',
        resultText: 'SWAT units breached through back exits, disorienting suspects and securing the hostages in 25 seconds.',
        statChanges: { fame: 15, smarts: 5 },
        jobPerformanceChange: 15
      },
      {
        text: 'Hold Live Press Conference Out Front to Reassure Public',
        resultTitle: 'Public Reassured',
        resultText: 'Your calm press briefing calmed civic unrest while tactical officers resolved the crisis.',
        statChanges: { fame: 20 },
        jobPerformanceChange: 10
      }
    ]
  },

  // Rank 4: Police Chief / Mayor / Governor / President
  {
    id: 'politics_rank4_presidential_crisis',
    category: 'Public Service',
    title: 'Executive Emergency State Directive',
    subtitle: 'National Security Command',
    roleKeywords: ['Police Chief', 'Mayor', 'Governor', 'President', 'Prime Minister', 'Chancellor'],
    minRankLevel: 4,
    maxRankLevel: 5,
    icon: '🏛️',
    description: 'As high executive authority, an international economic summit faces security threats requiring immediate presidential emergency decrees.',
    detailsBox: {
      label: 'Executive Cabinet Briefing',
      items: [
        { key: 'Delegates', value: '25 World Leaders Present' },
        { key: 'Security Threat', value: 'Coordinated Cyber & Foreign Sabotage' }
      ]
    },
    options: [
      {
        text: 'Issue Executive Security Order & Coordinate Global Allies',
        resultTitle: 'International Treaty Signed & Security Flawless!',
        resultText: 'Your leadership secured an historic global peace agreement. You received a standing ovation at the UN Assembly.',
        statChanges: { fame: 40, karma: 25, happiness: 20 },
        jobPerformanceChange: 25
      },
      {
        text: 'Address the Nation in Live Prime-Time Broadcast',
        resultTitle: 'National Support Soars to 88%!',
        resultText: 'Your speech inspired national confidence, boosting approval ratings across all demographics.',
        statChanges: { fame: 35, karma: 15 },
        jobPerformanceChange: 20
      },
      {
        text: 'Pass Emergency Infrastructure Relief Bill',
        resultTitle: 'Bipartisan Legislation Passed',
        resultText: 'You passed $50 Billion in infrastructure funding, creating thousands of state jobs.',
        statChanges: { fame: 25, karma: 20 },
        jobPerformanceChange: 15
      }
    ]
  }
];

export function getEffectiveJobRank(jobTitle: string, currentTierIndex: number = 0): number {
  const t = jobTitle.toLowerCase();

  // Explicit Low Rank Titles (Always Rank 1 or 2, Never 4/5)
  if (
    t.includes('private') ||
    t.includes('corporal') ||
    t.includes('cadet') ||
    t.includes('recruit') ||
    t.includes('airman') ||
    t.includes('seaman') ||
    t.includes('apprentice') ||
    t.includes('intern') ||
    t.includes('assistant') ||
    t.includes('junior')
  ) {
    return 1;
  }

  if (
    t.includes('sergeant') || // Covers Sergeant, Staff Sergeant, Gunnery Sergeant, Master Sergeant
    t.includes('detective') ||
    t.includes('deputy') ||
    t.includes('specialist') ||
    t.includes('technician') ||
    t.includes('associate') ||
    t.includes('qa engineer') ||
    t.includes('constable')
  ) {
    return 2;
  }

  // Explicit Supreme High Command Rank Titles
  if (
    t.includes('general') ||
    t.includes('admiral') ||
    t.includes('chief of staff') ||
    t.includes('supreme commander') ||
    t.includes('chief justice') ||
    t.includes('police chief') ||
    t.includes('president') ||
    t.includes('prime minister') ||
    t.includes('governor') ||
    t.includes('provisional military governor') ||
    t.includes('dictator') ||
    t.includes('chancellor') ||
    t.includes('chief medical officer') ||
    t.includes('chief of surgery') ||
    t.includes('hospital director') ||
    t.includes('cto') ||
    t.includes('ceo')
  ) {
    return 4; // Supreme / High Command
  }

  if (
    t.includes('colonel') ||
    t.includes('brigadier') ||
    t.includes('commander') ||
    t.includes('major') ||
    t.includes('captain') ||
    t.includes('lieutenant') ||
    t.includes('director') ||
    t.includes('vice president') ||
    t.includes('vp') ||
    t.includes('appellate judge') ||
    t.includes('judge')
  ) {
    return 3;
  }

  // Fallback mapped tier
  return Math.max(1, Math.min(4, currentTierIndex + 1));
}

export function getDutiesForJob(
  jobTitle: string,
  category: string,
  currentTierIndex: number = 0
): CareerDutyScenario[] {
  const lowerTitle = jobTitle.toLowerCase();
  const calculatedRank = getEffectiveJobRank(jobTitle, currentTierIndex);

  return CAREER_DUTIES_DATABASE.filter(scenario => {
    const minRank = scenario.minRankLevel ?? 1;
    const maxRank = scenario.maxRankLevel ?? 5;

    // Strict rank boundary
    if (calculatedRank < minRank || calculatedRank > maxRank) {
      return false;
    }

    // High rank scenarios (minRank >= 4) MUST require explicit roleKeyword match!
    if (minRank >= 4) {
      if (!scenario.roleKeywords || scenario.roleKeywords.length === 0) return false;
      const hasKeywordMatch = scenario.roleKeywords.some(kw => lowerTitle.includes(kw.toLowerCase()));
      if (!hasKeywordMatch) return false;
    }

    // Check category alignment
    let matchesRole = false;
    if (scenario.category === category) {
      matchesRole = true;
    } else if (scenario.roleKeywords && scenario.roleKeywords.length > 0) {
      if (scenario.roleKeywords.some(kw => lowerTitle.includes(kw.toLowerCase()))) {
        matchesRole = true;
      }
    } else if (scenario.category === 'General' && category !== 'Military' && category !== 'Medical' && category !== 'Legal') {
      matchesRole = true;
    }

    // Strict block against cross-category leaks
    if (scenario.category === 'Corporate' && (category === 'Military' || category === 'Medical' || category === 'Legal' || category === 'Public Service')) {
      return false;
    }
    if (scenario.category === 'Military' && category !== 'Military' && category !== 'Special Forces') {
      return false;
    }
    if (scenario.category === 'Medical' && category !== 'Medical' && category !== 'Healthcare') {
      return false;
    }
    if (scenario.category === 'Legal' && category !== 'Legal' && category !== 'Judiciary') {
      return false;
    }

    return matchesRole;
  });
}
