# LifeSim BitLife — Master Game Architecture, Mechanics & AI Agent Manual

> **Purpose of this Document**: This manual is the definitive, exhaustive guide to **LifeSim BitLife**. It details every concept, system, state machine, formula, data schema, edge case, and architectural constraint in the codebase. Any AI coding assistant or software engineer reading this file will understand the entire simulator down to its tiniest operational details, enabling immediate, precise modification and expansion without breaking existing gameplay.

---

## Table of Contents
1. [Core Concept, Tone & Design Philosophy](#1-core-concept-tone--design-philosophy)
2. [Technology Stack, Environment & Directory Map](#2-technology-stack-environment--directory-map)
3. [Global State Architecture & Data Schemas (`src/types.ts`)](#3-global-state-architecture--data-schemas)
4. [The Turn-Based Life Loop (`handleAgeUp` Tick-by-Tick)](#4-the-turn-based-life-loop)
5. [The Vitality & Character Stat Systems](#5-the-vitality--character-stat-systems)
6. [Careers, Promotion Engine & Workplace Mechanics](#6-careers-promotion-engine--workplace-mechanics)
7. [The Supreme Privilege System ("God Mode")](#7-the-supreme-privilege-system-god-mode)
8. [Military Command, Coups & Martial Law Governance](#8-military-command-coups--martial-law-governance)
9. [Executive C-Suite Command Engine](#9-executive-c-suite-command-engine)
10. [Academic Progression, Degrees & Qualification Engine](#10-academic-progression-degrees--qualification-engine)
11. [Kinship, Romance & Social Dynamics](#11-kinship-romance--social-dynamics)
12. [Economy, Real Estate, Vehicles & Stock Market](#12-economy-real-estate-vehicles--stock-market)
13. [Activities, Crime, Prison, Health & Emigration](#13-activities-crime-prison-health--emigration)
14. [Dual-Layer Event Engine & Gemini AI Integration](#14-dual-layer-event-engine--gemini-ai-integration)
15. [Graveyard, Commemorative Ribbons & Succession](#15-graveyard-commemorative-ribbons--succession)
16. [Time-Machine Reverse Aging System](#16-time-machine-reverse-aging-system)
17. [Golden Rules & Coding Guardrails for AI Agents](#17-golden-rules--coding-guardrails-for-ai-agents)

---

## 1. Core Concept, Tone & Design Philosophy

### The Vision
**LifeSim BitLife** is an expansive, modern text-and-modal life simulator inspired by classic text life sims (BitLife, Alter Ego) but engineered with **high-agency, "larger than life" endgame systems**. Where conventional simulators restrict players to standard 9-to-5 routines, LifeSim BitLife enables players to:
- Climb from an underprivileged childhood in Sher Garh or Chicago to the pinnacle of global corporate or state power.
- Wield executive authority over municipal and corporate bureaucracies (slush funds, wiretaps, leverage dossiers, emergency standoffs, live press conferences).
- Command armed forces divisions, declare martial law, stage coups, dissolve civilian councils, and rule as **Provisional Military Governor**.
- Exercise **Supreme Job Privilege ("God Mode")**, stepping directly into any top-tier civilian or military appointment without degree or age prerequisites.
- Roleplay freeform life choices using server-side **Google Gemini AI** (`/api/ai/custom-action`), with fail-safe circuit breaker protection.

### Tone & Narrative Style
- **Dry, Satirical Humor**: The game balances authentic life milestones with dark humor, absurd workplace politics, and unexpected random events.
- **Consequential Decisions**: Choices carry permanent statistical, legal, and relational consequences. High corruption unlocks quick wealth but guarantees grand jury subpoenas.
- **Fast, Responsive Mobile First Experience**: Designed as a vertical iOS/Android-style app shell centered on the viewport (`max-w-md mx-auto`), utilizing clean high-contrast cards, smooth Lucide icons, and tactile button animations.

---

## 2. Technology Stack, Environment & Directory Map

### Runtime & Libraries
- **Frontend Framework**: React 19 (Hooks, Functional Components).
- **Language**: TypeScript (strict mode, full type coverage in `src/types.ts`).
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`), zero separate CSS files, clean utility classes.
- **Icons**: `lucide-react`.
- **Animations**: `motion/react` and Tailwind CSS v4 animation utilities.
- **Server**: Node.js + Express (`server.ts`) hosting REST endpoints and mounting Vite middleware for instant hot development.
- **AI SDK**: `@google/genai` (utilizing `gemini-2.5-flash` or `gemini-3.6-flash`).
- **Network Port**: Must always bind to `0.0.0.0:3000`.

### Directory Tree & Module Responsibilities
```
├── server.ts                       # Express server, /api/ai/scenario, /api/ai/custom-action, Vite dev server
├── metadata.json                   # App capabilities (MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API)
├── package.json                    # Scripts: "dev": "tsx server.ts", "build", "start"
├── AGENTS.md                       # This master reference document
├── index.html                      # HTML entry with viewport-fit=cover and mobile meta tags
├── src/
│   ├── main.tsx                    # React client entry point
│   ├── App.tsx                     # Main game controller: aging cycle, modal switcher, financial loop
│   ├── types.ts                    # Complete TypeScript definitions for all game objects
│   ├── index.css                   # Tailwind CSS v4 root stylesheet
│   ├── components/
│   │   ├── ActivitiesModal.tsx     # Mind/Body, Doctor/Surgery, Crime, Nightlife, Travel, Lottery
│   │   ├── AssetsModal.tsx         # Real Estate, Supercars, Yachts, Aircraft, Stocks & Cryptos
│   │   ├── BottomNav.tsx           # 5-button tab navigation: Jobs, School, AGE +1, Assets, Rel/Act
│   │   ├── CareerDutyModal.tsx     # Interactive tactical duties with choice trees & coup triggers
│   │   ├── CareerOfficeView.tsx    # Standard workplace hub: coworkers, boss, overtime, promotions
│   │   ├── CustomAiActionModal.tsx # Freeform prompt modal ("What if I try to...")
│   │   ├── EducationModal.tsx      # School roster, study button, cliques, university majors, grad school
│   │   ├── EventModal.tsx          # Full-screen annual choice cards with outcome alerts
│   │   ├── ExecutiveOfficeView.tsx # C-Suite command: Budget, Slush, Subordinates, Dossiers, Press
│   │   ├── GovernanceView.tsx      # Military junta, decrees, stability, cabinet, state treasury
│   │   ├── GraveyardModal.tsx      # Archive of deceased lives with commemorative ribbons
│   │   ├── JobsModal.tsx           # Full career catalog, military branches, God Mode appointments
│   │   ├── LifeFeed.tsx            # Scrollable chronicle of life logs with age headers & icons
│   │   ├── MenuDrawer.tsx          # Save/Load slots, sound toggle, reset life, version info
│   │   ├── NewLifeModal.tsx        # Character generator: custom name, country, city, special talent
│   │   ├── RelationshipModal.tsx   # NPC interactions: spend time, chat, gift, insult, date, marriage
│   │   ├── ReverseAgeModal.tsx     # Time-machine de-aging tool using historical state snapshots
│   │   ├── StatsBar.tsx            # Four primary gauges (Happiness, Health, Smarts, Looks)
│   │   └── TopHeader.tsx           # Name, age, net worth, bank balance, quick menu button
│   ├── data/
│   │   ├── careerData.ts           # 70+ careers, 6 tiers each, salaries, requirements, employers
│   │   ├── careerDutiesData.ts     # Tactical duty choice trees (Legal, Military, Medical, Tech, etc.)
│   │   ├── educationData.ts        # School types, tuition costs, admission criteria, 10+ majors
│   │   ├── eventDatabase.ts        # Static random events categorized with strict age/job filters
│   │   └── initialData.ts          # Country/city catalog, starting names, plastic surgeries, crimes
│   └── utils/
│       ├── executiveEngine.ts      # C-Suite engine: slush fund, vulnerability, dossiers, press spin
│       ├── gameUtils.ts            # Currency formatting, ribbon calculation, name & relationship generators
│       ├── jobUtils.ts             # Promotions, Supreme Privilege verification, coworkers generation
│       └── qualificationUtils.ts   # Degree sanitization, short badge formatting, educational checks
```

---

## 3. Global State Architecture & Data Schemas

The central game state is defined in `src/types.ts` and managed in `src/App.tsx`.

### The Master `GameState` Object
```typescript
interface GameState {
  character: Character;
  relationships: PersonRelationship[];
  assets: Asset[];
  stocks: StockAsset[];
  lifeLogs: LifeLog[];
  graveyard: DeceasedRecord[];
  activeModal: ModalType;
  currentEvent: DecisionEvent | null;
  eventResultText: string | null;
  selectedPerson: PersonRelationship | null;
  historySnapshots?: HistorySnapshot[];
  executiveState?: ExecutiveState;
  governanceState?: GovernanceState;
}
```

### Key Models

#### `Character`
- `id`: Unique identifier (`char_<timestamp>`).
- `firstName`, `lastName`, `gender` ('Male' | 'Female').
- `age`: Number (0 to 120+).
- `country`, `city`: Starting or immigrated location.
- `avatarIcon`: Emoji representation (scales from baby/child to adult).
- `specialTalent`: 'Acting' | 'Music' | 'Athletics' | 'Crime' | 'Business' | 'Smarts' | 'None'.
- `stats`: `CharacterStats` (Happiness, Health, Smarts, Looks, Karma, Fame).
- `bankBalance`: Liquid cash (can be negative due to debt/loans).
- `debt`: Total outstanding liability.
- `currentJob`: Active `Job` or `null`.
- `education`: Active `Education` record with nested `details`.
- `isAlive`: Boolean (false triggers game over / graveyard flow).
- `careerHistory`: `Record<string, number>` tracking lifetime years served per job title and category.
- `completedDutyIds`: Array of finished tactical duties (e.g. `military_rank4_martial_law`).

#### `Job` & `CareerTier`
- `id`, `title`, `company`, `salary`.
- `performance`: 0–100% (determines promotions, raises, and firings).
- `yearsInRole`: Years served in current appointment.
- `category`: 'Tech' | 'Corporate' | 'Medical' | 'Legal' | 'Creative' | 'Trade' | 'Public Service' | 'Military' | 'Special' | 'Executive'.
- `supervisor`: `JobCoworker` (with relationship score and `isBoss: true`).
- `coworkers`: Array of `JobCoworker`.
- `currentTierIndex`: Number (0 = Entry level, up to 5 = Supreme pinnacle).

#### `ExecutiveState`
- `isExecutive`: Boolean.
- `chiefTitle`, `category`, `yearsAsChief`.
- `archetype`: 'Untouchable Reformer' | 'Shadow Syndicate Chief' | 'Teflon Puppet' | 'Civic Statesman'.
- `publicApproval`, `boardCouncilTrust`, `departmentMorale`: 0–100%.
- `scandalRisk`, `vulnerabilityIndex`: 0–100%.
- `investigationLevel`: 'None' | 'Internal Affairs' | 'State Ethics Probe' | 'Grand Jury Subpoena' | 'Federal Indictment'.
- `budget`: `DepartmentBudget` (Total budget, allocations for wages, operations, oversight, slush fund, siphoned cash).
- `subordinates`: Array of `SubordinateNPC` (competence, loyalty, corruption, traits).
- `dossiers`: Array of `LeverageDossier` (dirt discovered, leverage points, wiretap status).
- `activeIncident`: `EmergencyIncident` | null.
- `activePressConference`: `PressConference` | null.

#### `GovernanceState`
- `isGovernor`: Boolean (controls active martial law regime).
- `regimeTitle`: e.g. "Provisional Military Governor", "Supreme Dictator".
- `stability`: 0–100% (Civilian and military control).
- `approval`: 0–100% (Popular public support).
- `treasury`: Liquid state funds ($25,000,000+).
- `taxRate`: Number (15%, 25%, 40%, 50%).
- `curfewActive`: Boolean.
- `martialLawLevel`: 'Relaxed' | 'Moderate' | 'Strict' | 'Totalitarian'.
- `cabinet`: Array of `CabinetOfficial` (Chief of Defense, Chief Justice, Finance Minister, Intel Director, State Media).
- `yearsInPower`: Cumulative years holding state command.

---

## 4. The Turn-Based Life Loop

The entire engine runs on an annual progression cycle triggered by the **"Age + 1"** button (`App.tsx: handleAgeUp`).

```
[User clicks "Age + 1"]
        │
        ▼
[1. Snapshot State] ──> Store in historySnapshots (Max 10 for Reverse Age)
        │
        ▼
[2. Advance Age] ──> Character age += 1; All alive NPCs age += 1
        │
        ▼
[3. NPC Mortality Roll] ──> Check each relationship (Probability scales with age > 70)
        │
        ▼
[4. Player Mortality Check]
        ├── If age > 65 or health <= 0:
        │     Roll mortality curve based on Health, Happiness, and Age.
        │     If dead ──> Generate cause, calculate Ribbon, save to Graveyard, trigger Death Modal.
        │
        ▼
[5. Academic Progression Check]
        ├── If age == 5: Auto-enroll Elementary School (6 years)
        ├── If age == 11: Graduate Elementary ──> Auto-enroll Middle School (3 years)
        ├── If age == 14: Graduate Middle ──> Auto-enroll High School (4 years)
        └── If enrolled in University/Grad School:
              yearsCompleted += 1
              If yearsCompleted >= totalYears ──> Graduate, award degree, sanitize degree list
        │
        ▼
[6. Financial Balance Sheet Calculation]
        ├── Add: Gross Salary + Pension Yield + Slush Fund Passive Yield
        ├── Subtract: Income Taxes (calculated by bracket)
        ├── Subtract: Real estate mortgages & property taxes
        ├── Subtract: Vehicle maintenance & registration fees
        ├── Subtract: Pet upkeep & child support
        └── Net cash delta applied to `bankBalance`.
              If bankBalance < 0: Interest penalty applied; risk of repo.
        │
        ▼
[7. Asset Value Updates]
        ├── Real Estate: Appreciates (random market swing between -2% and +6%)
        └── Vehicles & Aircraft: Depreciates (5% to 12% annual drop in resale value)
        │
        ▼
[8. Career & History Tracking]
        ├── If employed: Increment yearsInRole += 1
        ├── Cumulative career history updated: careerHistory[title] += 1
        └── Performance drift evaluated (slight decay if hours low, boost if hard worker)
        │
        ▼
[9. Executive State Tick (if C-Suite)]
        ├── Calculate annual slush yield into player bank account
        ├── Oversight allocation vs. Legal Vulnerability delta
        ├── Scandal risk accumulation from corrupt subordinates
        ├── Check for high-stakes triggers: Grand Jury Subpoena, Mayoral Ultimatum, Whistleblower Leak
        └── Spawn next year's operational incident
        │
        ▼
[10. Turn Event Trigger (3-Tier Roll)]
        ├── Tier 1 (35% if employed): Role-Specific Tactical Career Duty (from careerDutiesData.ts)
        ├── Tier 2 (5% chance): Dynamic Contextual Gemini AI Scenario (via /api/ai/scenario)
        └── Tier 3 (25% chance): Contextually Gated Static Event (from eventDatabase.ts)
```

---

## 5. The Vitality & Character Stat Systems

### Primary Stats (0–100%)
- **Happiness**:
  - Drops on: Deaths of loved ones, failed relationships, demotions, debt, prison, low health.
  - Boosted by: Vacations, gym workouts, meditation, buying luxury assets, getting married, promotions.
  - Critical Threshold: Below 10% triggers depression logs and increases mortality risk.
- **Health**:
  - Drops on: Aging (accelerates after age 50), dangerous crimes, working excessive overtime (>50 hrs/wk), botch plastic surgeries.
  - Boosted by: Annual doctor visits, fitness gym, Mediterranean diet, colon hydrotherapy.
  - Critical Threshold: Hits 0% = immediate mortality trigger.
- **Smarts**:
  - Determines: University admission, scholarship awards, graduate school eligibility, IQ tests, corporate promotion velocity.
  - Boosted by: Reading library books, visiting the public library, studying harder in school, documentary films.
- **Looks**:
  - Determines: Dating app matches, spouse attractiveness, modeling/acting agency acceptance, public approval ratings.
  - Boosted by: Plastic surgery (rhinoplasty, liposuction, botox), personal trainer gym workouts, salon visits.

### Secondary & Hidden Stats
- **Karma (0–100%)**:
  - Hidden morality index initialized between 50 and 80.
  - Decreased by: Crimes, cheating on partners, insulting parents, siphoning slush funds, staging coups.
  - Increased by: Giving gifts, forgiving transgressions, donating to charity, adopting shelter pets.
  - Effect: High karma prevents catastrophic event outcomes and ensures light prison sentencing.
- **Fame (0–100%)**:
  - Unlocked in public-facing careers (Entertainment, Sports, Top Military, Executive, Politics).
  - Enables high-paying endorsements, book publishing, and commercial shoots.
- **Vulnerability Index & Scandal Risk (0–100%)**:
  - Tracked in the Executive C-Suite engine.
  - Vulnerability > 75% triggers a **Federal Grand Jury Subpoena**.
  - High scandal risk destroys public approval and triggers mayoral firing ultimatums.
- **Stability & Coup Threat (0–100%)**:
  - Tracked in the Military Governance engine.
  - Stability < 30% = **CRITICAL Coup Threat** (immediate risk of military mutiny or civil overthrow).

---

## 6. Careers, Promotion Engine & Workplace Mechanics

### Career Catalog Overview (`src/data/careerData.ts`)
The simulator features over 70 structured career paths across 10 streams:
1. **Corporate & Finance**: Business Analyst -> Senior Analyst -> Finance Director -> VP of Finance -> CFO -> Chief Executive Officer (CEO).
2. **Tech & Software**: Junior Developer -> Software Engineer -> Lead Architect -> VP of Engineering -> Chief Technology Officer (CTO).
3. **Judiciary & Legal**: Court Clerk -> Associate Attorney -> Senior Partner -> Magistrate -> District Judge -> Presiding Supreme Justice.
4. **Healthcare & Medical**: Medical Resident -> Staff Physician -> Attending Surgeon -> Department Head -> Chief of Surgery -> Hospital Director.
5. **Armed Forces (Army, Navy, Air Force, Marines, Coast Guard)**: Recruit -> Sergeant -> Lieutenant -> Captain -> Major -> Colonel -> General / Admiral.
6. **Public Safety**: Patrol Officer -> Detective -> Sergeant -> Precinct Captain -> Deputy Commissioner -> Police Commissioner / Chief.
7. **Fire & Rescue**: Probationary Firefighter -> Firefighter -> Lieutenant -> Battalion Chief -> Fire Commissioner.
8. **Creative & Entertainment**: Extra -> Voice Actor -> TV Actor -> Movie Star -> Blockbuster Lead -> Studio Head.
9. **Organized Crime Syndicate**: Associate -> Soldier -> Capo -> Underboss -> Godfather / Boss.
10. **Aviation**: Flight Cadet -> First Officer -> Commercial Captain -> Chief Flight Inspector -> Airline Director.

### The Promotion Algorithm (`src/utils/jobUtils.ts: checkCareerPromotionEligibility`)
To be promoted to the next tier, a character must pass 4 strict gates:
1. **Time in Role**: Must satisfy `reqYearsInPrevRank` (typically 1 to 3 years). Cumulative lifetime service in that role (from `character.careerHistory`) is credited.
2. **Performance**: Must achieve `performance >= 70%`.
3. **Smarts Gate**: Higher tiers enforce minimum smarts (e.g. 75%+ for Executive/Director).
4. **Supervisor Relationship**: The direct supervisor must hold a relationship of at least **45%**. Hostile bosses block promotion.

---

## 7. The Supreme Privilege System ("God Mode")

### Who Qualifies? (`hasSupremeJobPrivilege` in `src/utils/jobUtils.ts`)
A character automatically activates Supreme Job Privilege if **any** of these criteria are met:
1. **Active Provisional Military Governor**: `governanceState.isGovernor === true` or active job title contains "Governor", "Dictator", "Provisional", or "Regime Leader".
2. **Military Flag Officer / Retired General**: Active or historical career title contains:
   - "General", "Admiral", "Chief of Staff", "Wing Commander", or "Supreme Commander".
3. **Duty Medal Holder**: Completed the Rank 4 military high command duty: `military_rank4_martial_law`.

### Supreme Privilege Powers
- **Degree Waivers**: All educational prerequisites (High School, B.S., M.D., J.D., MBA) are completely waived. A general can become Chief of Surgery or Supreme Court Judge immediately.
- **Age & Smarts Waivers**: Minimum age barriers and intelligence checks are bypassed.
- **Direct Tier Entry**: Unlocks instant appointment to **any rank (Rank 1 through Rank 6)** in any field in `JobsModal.tsx`.
- **Prestige Placement**: Starts with an immediate **85% job performance** rating and executive clearance.

---

## 8. Military Command, Coups & Martial Law Governance

### Staging the Coup & Declaring Martial Law
When a player reaches Rank 4 in the Military (General / Admiral / Chief of Staff), the tactical duty **"National Crisis & High Command Emergency Power"** (`military_rank4_martial_law`) appears:
- Choosing **"Declare Martial Law & Take Supreme Governance Control"** executes:
  - Establishes the player as **Provisional Military Governor**.
  - Doubles player salary and awards a $100,000 command bonus.
  - Unlocks the dedicated **State Governance View** (`GovernanceView.tsx`).
  - Sets initial state treasury to **$25,000,000**, stability to 85%, and approval to 65%.

### Governance Dashboard Controls
1. **Stability & Approval Management**:
   - **Curfew Decree**: Toggles nationwide curfews (+10% Stability, -5% Approval).
   - **Deploy Armed Forces**: Dispatches armor and infantry (-$1,000,000 Treasury, +15% Stability, +5% Approval).
   - **Televised State Address**: Delivers speeches across state media (+12% Approval, +5% Stability).
2. **Cabinet Administration**:
   - 5 Key Ministries: Chief of Defense Staff, Chief Justice, Minister of Finance, Chief of Intelligence, Director of State Media.
   - **Purge Minister**: Removes corrupt or disloyal ministers (+15% Stability, -10% Approval).
   - **Reassign / Appoint**: Replaces officials by evaluating 3 procedurally generated candidates on **Loyalty** and **Competence**.
3. **State Tax Levy**:
   - Adjust tax rates between **15%, 25%, 40%, and 50%**.
   - Higher taxes generate state revenue but degrade public approval.
4. **Democratic Transition (Step Down)**:
   - Allows the Governor to peacefully step down, restore elections, and retire with an official **$250,000/year State Elder Pension**.

---

## 9. Executive C-Suite Command Engine

### Unlocking the Executive Office
Any character reaching top leadership (CEO, CTO, CFO, Police Commissioner, Hospital Director, Managing Partner, Presiding Judge, or any Tier 5+ role in corporate/public sectors) automatically initializes an `ExecutiveState`.

### Core Executive Modules (`src/utils/executiveEngine.ts`)

#### 1. Department Budget & Discretionary Slush Fund
- Total budget scales based on role ($3.5M for municipal chiefs, up to $25M for Fortune 500 CEOs).
- Allocations must sum to 100%:
  - **Wages (Default 50%)**: Protects department morale.
  - **Operations (Default 30%)**: Sustains mission capability.
  - **Oversight (Default 15%)**: High oversight (>20%) suppresses internal leaks and reduces legal vulnerability. Low oversight (<10%) generates rogue activity (+6% vulnerability/yr).
  - **Slush Fund (Default 5%)**: Off-book discretionary pool.
- **Siphoning Cash**: Players can siphon up to 50% of the slush fund into their personal offshore bank balance. Each $100k siphoned adds **+8% Legal Vulnerability** and **+5% Scandal Risk**.
- **Passive Annual Slush Yield**: 20% of the allocated slush fund is quietly deposited into the player's personal bank account each year.

#### 2. Subordinate Roster & Traits
Subordinates carry dynamic traits that dictate crisis outcomes:
- `Negotiator`: High competence in de-escalating standoffs and settling labor disputes.
- `Trigger-Happy`: Aggressive in tactical breaches; causes collateral disaster if sent to negotiate.
- `Corrupt`: Will execute discreet hush-money payoffs without asking questions.
- `Whistleblower-Prone`: If loyalty drops below 40%, leaks internal documents to journalists, triggering instant scandals (+35% scandal risk).

#### 3. Emergency Incidents & Tactical Directives
When crises occur (e.g. Downtown Bank Standoff, Hospital Malpractice Outbreak), the executive selects a subordinate and issues one of 3 directives:
- `DeEscalate`: Relies on Negotiator trait or Competence > 80.
- `AggressiveBreach`: Relies on Trigger-Happy trait or Competence > 85.
- `CovertPayoff`: Uses hush money; leaks if the subordinate is not corrupt/loyal.

#### 4. Live Press Conferences & Media Spin
Incidents immediately spawn a press conference where the player faces hostile reporters:
- `Transparency`: +12% Public Approval, -5% Board Trust, -10% Scandal Risk.
- `Scapegoat`: Shields the player, -15% Scandal Risk, but crushes subordinate morale.
- `Blame Mayor`: Defiant populist move; +15% Public Approval, -25% Council Trust.
- `Gag Order`: Aggressive media blackout; -10% Public Approval, +20% Scandal Risk.

#### 5. Leverage Dossiers & Blackmail
The executive shadow network taps phones and uncovers blackmail material on:
- Mayor, City Council Chair, Internal Affairs Director, Lead Investigative Reporter.
- **Blackmail Actions**:
  - `DemandBudget`: Extorts officials for an emergency **+$1.5M budget increase**.
  - `QuashAudit`: Forces Internal Affairs to quietly kill pending corruption inquiries.
  - `SilenceStory`: Pressures media editors to spike investigative exposés.

---

## 10. Academic Progression, Degrees & Qualification Engine

### School Ladder & Auto-Enrollment
- **Elementary School (Ages 5–10)**: Auto-enrolled at age 5; 6 years to graduate.
- **Middle School (Ages 11–13)**: Auto-enrolled at age 11; 3 years to graduate.
- **High School (Ages 14–17)**: Auto-enrolled at age 14; 4 years to graduate.
- **Post-Secondary Options (Age 18+)**:
  - **Community College**: 2-year general associate degree.
  - **University**: 4-year bachelor's degree. Must select a specific major:
    - *Biology* (Required for Med/Dental/Vet School)
    - *Computer Science* (Required for Tech careers)
    - *Finance / Economics* (Required for Corporate & Investment Banking)
    - *Political Science / History* (Required for Law School)
    - *English / Communications* (Required for Journalism & Media)
    - *Nursing* (Required for RN / Hospital staff)
    - *Criminal Justice* (Required for Police & Federal Law Enforcement)
  - **Graduate & Professional Schools**:
    - *Medical School* (4 years -> M.D.)
    - *Law School* (3 years -> J.D.)
    - *Business School* (2 years -> MBA)
    - *Dental School* (4 years -> D.M.D.)
    - *Pharmacy School* (4 years -> Pharm.D.)
    - *Nursing School* (2 years -> BSN/RN)
    - *Veterinary School* (4 years -> D.V.M.)

### Degree Sanitization (`src/utils/qualificationUtils.ts`)
- The qualification engine prevents redundant duplicate badges (e.g. removes bare "Pharmacy School" if "Pharmacy School Degree in Pharm.D." exists).
- Automatically formats clean degree chips: `B.S. Computer Science`, `J.D. Law`, `M.D. Medicine`, `MBA Business`.

---

## 11. Kinship, Romance & Social Dynamics

### NPC Data Structure (`PersonRelationship`)
- `id`, `name`, `relation` ('Mother' | 'Father' | 'Brother' | 'Sister' | 'Spouse' | 'Partner' | 'Son' | 'Daughter' | 'Friend' | 'Coworker').
- `age`, `relationshipBar` (0–100%), `isAlive` (boolean).
- `crazyLevel` (0–100%): Governs unexpected arguments, spontaneous breakups, or violent reactions.
- `generosityLevel` (0–100%): Dictates gift values and will inheritance amounts.

### Interaction Catalog
- **Spend Time**: Boosts relationship by +5% to +15% and increases player happiness.
- **Have Conversation**: Shared dialogue; outcome rolls against NPC crazy level.
- **Compliment**: Boosts relationship; risk of backfiring if crazy level is high.
- **Give Gift**: Select from cheap trinkets to diamond jewelry; scales with recipient generosity.
- **Insult**: Drops relationship; may trigger a physical altercation.
- **Borrow Money**: Available if relationship > 70%; amount governed by generosity.
- **Dating & Romance**: Use the Dating App (BitMatch) to browse suitors filtered by age and net worth.
- **Proposals & Weddings**: Buy engagement rings; choose courthouse ($100), golf club ($5,000), or castle estate ($50,000).
- **Children & Fertility**: Try for a baby with partner; adoption center for orphans.
- **Estate Planning (Wills)**: Allocate inheritance to Spouse, split equally among children, or leave everything to charity.

---

## 12. Economy, Real Estate, Vehicles & Stock Market

### Real Estate
- Properties: Trailer Homes, Suburban Houses, Luxury Condos, Penthouses, Historic Mansions.
- Purchase Options: Full cash payment or 30-year fixed mortgages (requires 10% down payment).
- Financial Impact: Properties appreciate annually (+1% to +6%); owners pay annual property taxes.

### Vehicles, Yachts & Aircraft
- Categories: Used Sedans, Electric SUVs, Supercars (Ferrari, Bugatti), Luxury Yachts, Private Jets (Gulfstream).
- Upkeep: All vehicles depreciate annually (5%–12%) and incur annual registration and maintenance deductions during aging.

### Stock & Crypto Exchange (`StockAsset`)
- Real-time stock portfolio tracker.
- Annual price drift formula: `change = (Math.random() - 0.48) * 0.15`.
- Players can buy lots, hold equities, collect dividend yields, or liquidate holdings during economic downturns.

---

## 13. Activities, Crime, Prison, Health & Emigration

### Mind, Body & Health
- **Gym**: Free workout boosting Health and Looks.
- **Meditation**: Increases Happiness and raises Karma.
- **Library**: Boosts Smarts.
- **Doctor Checkups**: Diagnoses and cures diseases (common cold, flu, depression, high blood pressure).
- **Plastic Surgery**: Rhinoplasty, Liposuction, Botox, Hair Transplants. High-cost procedures with a 5% risk of surgical botch that craters Looks and Health.

### Crime & Prison System
- **Crimes**: Pickpocketing ($20–$100), Shoplifting ($50–$300), Burglary ($1k–$10k), Grand Theft Auto ($10k–$60k), Bank Robbery ($50k–$250k), Syndicate Assassinations.
- **Arrest & Trial**: Police arrest players who botch crimes. Players can hire public defenders or elite private attorneys to fight charges.
- **Serving Time**: Incarceration suspends jobs and normal activities. Prisoners can work out in the yard, incite riots, or attempt the maze escape minigame.

### Nightlife, Gambling & Travel
- **Lottery**: Buy $10 scratchers with a 1-in-500,000 chance to hit multi-million dollar jackpots.
- **Casino Blackjack**: Place bets up to $50,000 per hand against the house.
- **Vacations**: Economy trips, luxury resorts, world cruises.
- **Emigration**: Apply for official visas or illegally cross borders to dozens of countries with unique flags and cities.

---

## 14. Dual-Layer Event Engine & Gemini AI Integration

### Turn Event Selection Pipeline
Every turn, the simulator decides whether to present a decision card:
1. **Role-Specific Duty (35% probability if employed)**: Pulls directly from `careerDutiesData.ts` based on category and rank level.
2. **Dynamic AI Generation (5% probability)**: Sends a background request to `/api/ai/scenario`.
3. **Static Catalog (25% probability)**: Filters `RANDOM_EVENTS_DATABASE` matching:
   - `age >= minAge && age <= maxAge`
   - Job category restrictions (`allowedJobCategories`)
   - Role keyword restrictions (`allowedRoleKeywords`)
   - School enrollment gates

### Gemini Server Endpoints (`server.ts`)

#### 1. `POST /api/ai/scenario`
- Accepts `character` state and `recentLog`.
- Prompts Gemini to craft a 2-to-4 choice dilemma matching the character's exact lifestyle.
- Outputs structured JSON with numeric deltas for Health, Happiness, Smarts, Looks, and Cash.

#### 2. `POST /api/ai/custom-action`
- Handles player freeform inputs (*"What if I try to smuggle a tiger into the mayor's office?"*).
- Analyzes plausibility and risk; returns a vivid narrative outcome, stat adjustments, and optional jail terms.

#### 3. Automatic Quota Circuit Breaker
- If the Gemini API returns a rate limit (HTTP 429 / `RESOURCE_EXHAUSTED`), the server activates a **60-second cooldown** and automatically serves procedurally generated fallback scenarios from `generateFallbackScenario()`.
- **The client applet never crashes, hangs, or displays raw error popups**.

---

## 15. Graveyard, Commemorative Ribbons & Succession

### Actuarial Mortality Check
When `character.age > 65` or `character.stats.health <= 0`:
- Mortality probability scales exponentially:
  $$P(\text{death}) = \frac{\text{Age} - 60}{100} \times \left(1 - \frac{\text{Health} + \text{Happiness}}{200}\right)$$
- If the mortality roll succeeds or health reaches 0, the death flow executes.

### Commemorative Ribbons (`calculateRibbon` in `src/utils/gameUtils.ts`)
Every deceased character is archived in `localStorage` under `lifesim_graveyard` and awarded an exclusive ribbon:
- **Mogul 💰**: Net worth exceeds $10,000,000.
- **Superstar ⭐**: Fame rating reached 80%+.
- **Centenarian 🎂**: Survived to age 100 or older.
- **Model Citizen 😇**: Lifetime Karma rating maintained at 85%+.
- **Scandalous 😈**: Lifetime Karma rating dropped to 20% or lower.
- **High Flyer 💼**: Annual career salary exceeded $200,000.
- **Mediocre 😐**: Standard baseline ribbon for uneventful lives.

---

## 16. Time-Machine Reverse Aging System

### Snapshot Architecture (`ReverseAgeModal.tsx` & `App.tsx`)
- Before every single age increment, `App.tsx` captures a deep clone of the entire `GameState` into `historySnapshots`.
- Up to **10 snapshots** are retained in memory.
- Players can open the **Reverse Age Modal** from the Top Header and rewind time by 1, 3, or 5 years.
- Rewinding state fully restores bank balances, career rankings, relationships, and health stats exactly as they were at that age.

---

## 17. Golden Rules & Coding Guardrails for AI Agents

When editing or extending this codebase, any AI assistant **must strictly follow these rules**:

1. **Preserve Supreme Job Privilege ("God Mode")**:
   - Never remove or break `hasSupremeJobPrivilege()` in `src/utils/jobUtils.ts`.
   - Provisional Governors, Retired Generals, Admirals, and Martial Law Medal holders **must always** be allowed to apply for any job at any tier without educational or age requirements.
2. **Never Break the Offline Circuit Breaker**:
   - The game must function with 100% reliability offline or without an active `GEMINI_API_KEY`.
   - Never remove `generateFallbackScenario()` in `server.ts`.
3. **Maintain Single-Port 3000 Ingress**:
   - The Express server in `server.ts` must always bind to `0.0.0.0` on port `3000`.
   - Never configure arbitrary ports or secondary background servers.
4. **Tailwind CSS v4 Compliance**:
   - All styling must use standard Tailwind CSS classes.
   - Do not create secondary `.css` files. `src/index.css` is the sole stylesheet.
5. **Clean Type Contracts**:
   - Any new state property must be declared in `src/types.ts` first.
   - Never use `any` when defining game records, decisions, or NPC objects.
6. **Mobile App Shell Constraints**:
   - Maintain the `max-w-md mx-auto` layout container to preserve the authentic mobile life-sim aesthetic across desktop and mobile displays.
