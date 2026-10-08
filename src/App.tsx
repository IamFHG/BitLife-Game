import React, { useState, useEffect } from 'react';
import { GameState, DecisionEvent, ChoiceOption, PersonRelationship, Job, Asset, DeceasedRecord, EducationLevel, GovernanceState, ExecutiveState } from './types';
import { createNewLife, calculateRibbon, formatMoney, getRandomInt, getRandomElement } from './utils/gameUtils';
import { RANDOM_EVENTS_DATABASE } from './data/eventDatabase';
import { INITIAL_STOCKS } from './data/initialData';
import { isExecutiveRole, processYearEndExecutive, initializeExecutiveState } from './utils/executiveEngine';

import { TopHeader } from './components/TopHeader';
import { LifeFeed } from './components/LifeFeed';
import { StatsBar } from './components/StatsBar';
import { BottomNav } from './components/BottomNav';
import { EventModal } from './components/EventModal';
import { RelationshipModal } from './components/RelationshipModal';
import { JobsModal } from './components/JobsModal';
import { AssetsModal } from './components/AssetsModal';
import { ActivitiesModal } from './components/ActivitiesModal';
import { CustomAiActionModal } from './components/CustomAiActionModal';
import { NewLifeModal } from './components/NewLifeModal';
import { GraveyardModal } from './components/GraveyardModal';
import { ReverseAgeModal } from './components/ReverseAgeModal';
import { MenuDrawer } from './components/MenuDrawer';
import { EducationModal } from './components/EducationModal';
import { sanitizeCompletedDegrees } from './utils/qualificationUtils';
import { getDutiesForJob, CareerDutyScenario, CareerDutyOption } from './data/careerDutiesData';
import { Skull, Sparkles, UserPlus, Trophy } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('lifesim_bitlife_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return createNewLife({ firstName: 'Leo', lastName: 'Dubois' }, 'Male', 'Acting');
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-save game state to localStorage
  useEffect(() => {
    localStorage.setItem('lifesim_bitlife_state', JSON.stringify(gameState));
  }, [gameState]);

  // Turn Aging Handler (+ Age button)
  const handleAgeUp = async () => {
    if (!gameState.character.isAlive) return;

    setGameState(prevState => {
      const char = { ...prevState.character };
      const currentAge = char.age;
      const newAge = currentAge + 1;

      // Save history snapshot of prevState at current age for perfect time travel / age rewind
      const currentSnapshot = {
        character: JSON.parse(JSON.stringify(char)),
        relationships: JSON.parse(JSON.stringify(prevState.relationships)),
        assets: JSON.parse(JSON.stringify(prevState.assets)),
        stocks: JSON.parse(JSON.stringify(prevState.stocks)),
        lifeLogs: JSON.parse(JSON.stringify(prevState.lifeLogs)),
        governanceState: prevState.governanceState ? JSON.parse(JSON.stringify(prevState.governanceState)) : undefined
      };

      const updatedHistory = {
        ...(prevState.historySnapshots || {}),
        [currentAge]: currentSnapshot
      };

      // Process Governance State progression if Provisional Military Governor
      let updatedGovState = prevState.governanceState;
      if (updatedGovState && updatedGovState.isGovernor) {
        const taxYield = Math.round(15000000 * (updatedGovState.taxRate / 100) * (updatedGovState.approval / 100));
        updatedGovState = {
          ...updatedGovState,
          treasury: updatedGovState.treasury + taxYield,
          yearsInPower: updatedGovState.yearsInPower + 1
        };
      }

      // Calculate annual income and expenses
      let annualIncome = char.currentJob ? char.currentJob.salary : 0;
      let totalAssetExpenses = 0;

      prevState.assets.forEach(a => {
        totalAssetExpenses += a.annualCost;
      });

      // Relics passive boost (e.g., Golden Neko Lucky Statue +$2M/yr)
      let relicIncome = 0;
      const hasGoldenNeko = prevState.assets.some(a => a.name.includes('Golden Neko'));
      if (hasGoldenNeko) {
        relicIncome = 2000000;
      }

      const netCashflow = annualIncome + relicIncome - totalAssetExpenses;
      let newBankBalance = char.bankBalance + netCashflow;

      // Update Health & Stats naturally
      let healthDelta = 0;
      if (newAge > 70) {
        healthDelta = -getRandomInt(2, 6);
      }

      const updatedHealth = Math.max(0, Math.min(100, char.stats.health + healthDelta));
      const isDead = updatedHealth <= 0 || (newAge >= 105 && Math.random() > 0.3);

      // Create logs for the new year
      const logs = [...prevState.lifeLogs];

      if (relicIncome > 0) {
        logs.push({
          id: 'log_' + Date.now() + '_relic',
          age: newAge,
          text: `I earned an extra ${formatMoney(relicIncome)} due to my Golden Neko Statue.`,
          type: 'income'
        });
      }

      if (char.currentJob) {
        logs.push({
          id: 'log_' + Date.now() + '_job',
          age: newAge,
          text: `I earned ${formatMoney(char.currentJob.salary)} working as ${char.currentJob.title} at ${char.currentJob.company}.`,
          type: 'income'
        });
      }

      // Aging relationships
      const updatedRels = prevState.relationships.map(rel => {
        if (!rel.isAlive) return rel;
        const updatedRelAge = rel.age + 1;
        const relPassesAway = updatedRelAge > 80 && Math.random() < 0.15;

        if (relPassesAway) {
          logs.push({
            id: 'log_rel_death_' + Date.now(),
            age: newAge,
            text: `My ${rel.relation.toLowerCase()}, ${rel.name}, passed away at age ${updatedRelAge}.`,
            type: 'negative'
          });
          return { ...rel, age: updatedRelAge, isAlive: false };
        }
        return { ...rel, age: updatedRelAge };
      });

      // School progression automatic tracking
      let edInfo = { ...char.education };
      let edDetails = edInfo.details ? { ...edInfo.details } : {
        level: edInfo.level || 'None',
        schoolName: edInfo.level === 'High School' ? 'Public High School' : edInfo.level === 'Middle School' ? 'Public Middle School' : edInfo.level === 'Elementary' ? 'Aiden McQueen Elementary School' : 'School',
        yearsCompleted: 0,
        totalYears: edInfo.level === 'Elementary' ? 6 : edInfo.level === 'Middle School' ? 3 : edInfo.level === 'High School' ? 4 : 4,
        grades: edInfo.grades || 75,
        popularity: 50,
        athleticism: 50,
        clubs: [],
        schoolCount: 0
      };

      if (newAge === 5 && edInfo.level === 'None' && !edDetails.droppedOut) {
        edInfo.level = 'Elementary';
        edDetails = {
          ...edDetails,
          level: 'Elementary',
          schoolName: edDetails.schoolName || 'Aiden McQueen Elementary School',
          yearsCompleted: 0,
          totalYears: 6,
          grades: 80,
          schoolCount: (edDetails.schoolCount || 0) + 1
        };
        logs.push({
          id: 'log_elem_' + Date.now(),
          age: newAge,
          text: `I started elementary school today at ${edDetails.schoolName}!`,
          type: 'major'
        });
      } else if (newAge === 11 && edInfo.level === 'Elementary') {
        edInfo.level = 'Middle School';
        edDetails = {
          ...edDetails,
          level: 'Middle School',
          schoolName: 'Public Middle School',
          yearsCompleted: 0,
          totalYears: 3,
          grades: 78,
          highestCompleted: 'Elementary School Diploma',
          schoolCount: (edDetails.schoolCount || 0) + 1
        };
        logs.push({
          id: 'log_middle_' + Date.now(),
          age: newAge,
          text: '🎓 I graduated elementary school and enrolled in Middle School!',
          type: 'major'
        });
      } else if (newAge === 14 && (edInfo.level === 'Middle School' || edInfo.level === 'Elementary')) {
        edInfo.level = 'High School';
        edDetails = {
          ...edDetails,
          level: 'High School',
          schoolName: 'Public High School',
          yearsCompleted: 0,
          totalYears: 4,
          grades: 75,
          highestCompleted: 'Middle School Certificate',
          schoolCount: (edDetails.schoolCount || 0) + 1
        };
        logs.push({
          id: 'log_high_' + Date.now(),
          age: newAge,
          text: '🎓 I graduated middle school and enrolled in High School!',
          type: 'major'
        });
      } else if (edInfo.level !== 'None' && !edDetails.droppedOut) {
        const nextYears = edDetails.yearsCompleted + 1;
        edDetails.yearsCompleted = nextYears;

        if (nextYears >= edDetails.totalYears) {
          // Graduated current school level!
          const completedName = edDetails.major 
            ? `${edDetails.level} Degree in ${edDetails.major}` 
            : `${edDetails.level} Diploma`;

          logs.push({
            id: 'log_grad_' + Date.now(),
            age: newAge,
            text: `🎓 I officially graduated from ${edDetails.schoolName || edDetails.level}! (${completedName})`,
            type: 'major'
          });

          const wasHighSchool = edDetails.level === 'High School';

          const prevCompleted = edDetails.completedDegrees || [];
          if (!prevCompleted.includes(completedName)) {
            prevCompleted.push(completedName);
          }
          edDetails.completedDegrees = sanitizeCompletedDegrees(prevCompleted);
          edDetails.highestCompleted = completedName;
          edDetails.level = 'None';
          edInfo.level = 'None';
          edInfo.graduated = true;
          edDetails.yearsCompleted = 0;

          if (wasHighSchool) {
            setTimeout(() => {
              setGameState(s => ({ ...s, activeModal: 'education' }));
            }, 300);
          }
        }
      }

      edInfo.details = edDetails;

      // Ensure at least one log entry exists for this new age so every year appears sequentially year-by-year
      const logsForThisAge = logs.filter(l => l.age === newAge);
      if (logsForThisAge.length === 0) {
        let defaultText = `I turned ${newAge} year${newAge === 1 ? '' : 's'} old.`;
        if (newAge < 5) {
          defaultText = getRandomElement([
            `I turned ${newAge} year${newAge === 1 ? '' : 's'} old.`,
            `I spent the year napping, playing with toys, and babbling.`,
            `I spent time with my parents and learned new things.`,
            `I celebrated my ${newAge}${newAge === 1 ? 'st' : newAge === 2 ? 'nd' : newAge === 3 ? 'rd' : 'th'} birthday!`
          ]);
        } else if (newAge < 18) {
          defaultText = getRandomElement([
            `I turned ${newAge} years old.`,
            `Another year passed smoothly.`,
            `I spent the year focusing on growing up and school.`,
            `I celebrated my ${newAge}th birthday with my family!`
          ]);
        } else {
          defaultText = getRandomElement([
            `I turned ${newAge} years old.`,
            `Another quiet year passed by.`,
            `I spent another year managing my life.`,
            `I celebrated turning ${newAge} years old!`
          ]);
        }

        logs.push({
          id: 'log_default_' + Date.now() + '_' + newAge,
          age: newAge,
          text: defaultText,
          type: 'neutral'
        });
      }

      // Stock Price fluctuation each year
      const updatedStocks = (prevState.stocks.length > 0 ? prevState.stocks : INITIAL_STOCKS).map(stock => {
        const change = (Math.random() - 0.48) * 0.15;
        const newPrice = Math.max(1, Math.round(stock.price * (1 + change)));
        return {
          ...stock,
          price: newPrice,
          changePercent: Math.round(change * 100)
        };
      });

      // If character dies
      if (isDead) {
        const cause = updatedHealth <= 0 ? 'Failing health and severe illness' : 'Old age peacefully in sleep';
        logs.push({
          id: 'log_death_' + Date.now(),
          age: newAge,
          text: `I passed away at age ${newAge} due to ${cause}.`,
          type: 'death'
        });

        // Add record to graveyard
        const ribbon = calculateRibbon(prevState);
        const deceasedRecord: DeceasedRecord = {
          id: 'grave_' + Date.now(),
          name: `${char.firstName} ${char.lastName}`,
          gender: char.gender,
          ageAtDeath: newAge,
          causeOfDeath: cause,
          netWorth: newBankBalance,
          primaryCareer: char.currentJob ? char.currentJob.title : 'Unemployed',
          childrenCount: prevState.relationships.filter(r => r.relation === 'Son' || r.relation === 'Daughter').length,
          ribbon,
          yearOfDeath: new Date().getFullYear(),
          avatarIcon: char.avatarIcon,
          country: char.country,
          city: char.city
        };

        const newGraveyard = [deceasedRecord, ...prevState.graveyard];
        localStorage.setItem('lifesim_graveyard', JSON.stringify(newGraveyard));

        return {
          ...prevState,
          character: {
            ...char,
            age: newAge,
            bankBalance: newBankBalance,
            stats: { ...char.stats, health: 0 },
            isAlive: false,
            causeOfDeath: cause
          },
          relationships: updatedRels,
          stocks: updatedStocks,
          lifeLogs: logs,
          graveyard: newGraveyard
        };
      }

      let updatedCareerHistory = { ...(char.careerHistory || {}) };
      if (char.currentJob && !char.currentJob.isRetired) {
        const titleKey = char.currentJob.title;
        const categoryKey = char.currentJob.category;
        updatedCareerHistory[titleKey] = (updatedCareerHistory[titleKey] || 0) + 1;
        if (categoryKey) {
          updatedCareerHistory[categoryKey] = (updatedCareerHistory[categoryKey] || 0) + 1;
        }
      }

      const updatedCurrentJob = char.currentJob ? {
        ...char.currentJob,
        yearsInRole: (char.currentJob.yearsInRole || 0) + 1
      } : null;

      // Process Executive Authority continuity step if character is a Chief/Executive
      let updatedExecState = prevState.executiveState;
      if (char.currentJob && !char.currentJob.isRetired && (isExecutiveRole(char.currentJob) || (updatedExecState && updatedExecState.isExecutive))) {
        const execToProcess = updatedExecState || initializeExecutiveState(char.currentJob);
        const execRes = processYearEndExecutive(execToProcess, newAge);
        updatedExecState = execRes.updatedExec;

        if (execRes.annualLogs && execRes.annualLogs.length > 0) {
          execRes.annualLogs.forEach(execLog => {
            logs.push({
              id: 'log_exec_' + Date.now() + '_' + Math.random(),
              age: newAge,
              text: execLog,
              type: execLog.includes('SUBPOENA') || execLog.includes('ULTIMATUM') || execLog.includes('LEAK') ? 'negative' : 'income'
            });
          });
        }

        if (execRes.personalMoneyGranted > 0) {
          newBankBalance += execRes.personalMoneyGranted;
        }
      }

      return {
        ...prevState,
        character: {
          ...char,
          age: newAge,
          bankBalance: newBankBalance,
          stats: { ...char.stats, health: updatedHealth },
          currentJob: updatedCurrentJob,
          education: edInfo,
          careerHistory: updatedCareerHistory
        },
        relationships: updatedRels,
        stocks: updatedStocks,
        lifeLogs: logs,
        governanceState: updatedGovState,
        executiveState: updatedExecState,
        historySnapshots: updatedHistory
      };
    });

    // Check for Random Event Trigger after aging
    setTimeout(() => {
      setGameState(latest => {
        if (latest.activeModal === 'none' && latest.currentEvent === null && latest.character.isAlive) {
          triggerRandomTurnEvent();
        }
        return latest;
      });
    }, 200);
  };

  // Trigger Turn Decision Event
  const triggerRandomTurnEvent = async () => {
    if (!gameState.character.isAlive || gameState.activeModal !== 'none' || gameState.currentEvent !== null) return;

    const currentAge = gameState.character.age;
    const currentJob = gameState.character.currentJob;
    const hasJob = !!(currentJob && currentJob.title !== 'Unemployed');
    const isStudent = !!(gameState.character.education && (
      currentAge < 18 || 
      (gameState.character.education.details && gameState.character.education.details.level !== 'None' && !gameState.character.education.details.droppedOut)
    ));

    // Role-Specific Career Duty Storyline Event Trigger (30% chance if employed)
    if (hasJob && currentJob && Math.random() < 0.35) {
      const dutyScenarios = getDutiesForJob(currentJob.title, currentJob.category, currentJob.currentTierIndex ?? 0);
      
      if (dutyScenarios.length > 0) {
        const selectedDuty = getRandomElement(dutyScenarios);
        
        // Convert to DecisionEvent model
        const careerEvent: DecisionEvent = {
          id: 'duty_' + selectedDuty.id + '_' + Date.now(),
          title: `${selectedDuty.icon} ${selectedDuty.title}`,
          description: `${selectedDuty.description}${selectedDuty.subtitle ? ` (${selectedDuty.subtitle})` : ''}`,
          category: 'work',
          options: selectedDuty.options.map(opt => ({
            text: opt.text,
            resultText: `[Official Ruling] ${opt.resultTitle}: ${opt.resultText}`,
            statChanges: opt.statChanges,
            jobPerformanceChange: opt.jobPerformanceChange,
            moneyChange: opt.moneyChange
          }))
        };

        setGameState(prev => {
          if (prev.activeModal !== 'none' || prev.currentEvent !== null) return prev;
          return {
            ...prev,
            currentEvent: careerEvent,
            activeModal: 'event'
          };
        });
        return;
      }
    }

    // 5% chance to attempt dynamic AI Scenario (uses server circuit breaker if rate-limited)
    if (Math.random() < 0.05) {
      try {
        const res = await fetch('/api/ai/scenario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            character: gameState.character,
            recentLog: gameState.lifeLogs[gameState.lifeLogs.length - 1]?.text
          })
        });
        const data = await res.json();
        if (data.success && data.event) {
          // Reject workplace events if character has no job
          if (data.event.category === 'work' && !hasJob) {
            // Skip
          } else if (data.event.category === 'school' && !isStudent) {
            // Skip
          } else {
            setGameState(prev => {
              if (prev.activeModal !== 'none' || prev.currentEvent !== null) return prev;
              return {
                ...prev,
                currentEvent: { ...data.event, id: 'ai_' + Date.now() },
                activeModal: 'event'
              };
            });
            return;
          }
        }
      } catch {
        // Silently fall through to preset database
      }
    }

    // Otherwise pick from preset event database (25% chance per year to keep pop-ups well-paced)
    const matchingEvents = RANDOM_EVENTS_DATABASE.filter(e => {
      const min = e.minAge || 0;
      const max = e.maxAge || 100;
      if (currentAge < min || currentAge > max) return false;

      // Filter work events if character is unemployed
      if (e.category === 'work' && !hasJob) return false;

      // Filter school events if character is not in school
      if (e.category === 'school' && !isStudent) return false;

      // Detailed Job Category & Keyword Gating for Work Events
      if (e.category === 'work' && currentJob) {
        const jobCat = currentJob.category || '';
        const jobTitleLower = currentJob.title.toLowerCase();

        // If allowedJobCategories specified, must include current job's category
        if (e.allowedJobCategories && e.allowedJobCategories.length > 0) {
          if (!e.allowedJobCategories.includes(jobCat)) return false;
        }

        // If excludedJobCategories specified, must NOT include current job's category
        if (e.excludedJobCategories && e.excludedJobCategories.length > 0) {
          if (e.excludedJobCategories.includes(jobCat)) return false;
        }

        // If allowedJobKeywords specified, at least one keyword must match job title
        if (e.allowedJobKeywords && e.allowedJobKeywords.length > 0) {
          const matches = e.allowedJobKeywords.some(kw => jobTitleLower.includes(kw.toLowerCase()));
          if (!matches) return false;
        }

        // If excludedJobKeywords specified, no keyword must match job title
        if (e.excludedJobKeywords && e.excludedJobKeywords.length > 0) {
          const matches = e.excludedJobKeywords.some(kw => jobTitleLower.includes(kw.toLowerCase()));
          if (matches) return false;
        }

        // Strict Gate: Non-corporate careers (Military, Public Service, Healthcare, Legal, Governor) must never receive Corporate/Office events
        const isNonCorporateCareer = jobCat === 'Military' || jobCat === 'Public Service' || jobCat === 'Medical' || jobCat === 'Legal' || jobTitleLower.includes('governor') || jobTitleLower.includes('army') || jobTitleLower.includes('soldier');
        if (isNonCorporateCareer) {
          if (e.id === 'adult_1' || e.title.toLowerCase().includes('corporate') || e.description.toLowerCase().includes('company procurement')) {
            return false;
          }
        }
      }

      return true;
    });

    if (matchingEvents.length > 0 && Math.random() < 0.25) {
      const selectedEvent = getRandomElement(matchingEvents);
      setGameState(prev => {
        if (prev.activeModal !== 'none' || prev.currentEvent !== null) return prev;
        return {
          ...prev,
          currentEvent: selectedEvent,
          activeModal: 'event'
        };
      });
    }
  };

  // Official Career Duty outcome handler
  const handleApplyDutyOutcome = (scenario: CareerDutyScenario, option: CareerDutyOption) => {
    setGameState(prev => {
      const char = { ...prev.character };
      const stats = { ...char.stats };

      if (option.statChanges) {
        if (option.statChanges.happiness !== undefined) stats.happiness = Math.max(0, Math.min(100, stats.happiness + option.statChanges.happiness));
        if (option.statChanges.health !== undefined) stats.health = Math.max(0, Math.min(100, stats.health + option.statChanges.health));
        if (option.statChanges.smarts !== undefined) stats.smarts = Math.max(0, Math.min(100, stats.smarts + option.statChanges.smarts));
        if (option.statChanges.looks !== undefined) stats.looks = Math.max(0, Math.min(100, stats.looks + option.statChanges.looks));
        if (option.statChanges.fame !== undefined) stats.fame = Math.max(0, Math.min(100, (stats.fame || 0) + option.statChanges.fame));
        if (option.statChanges.karma !== undefined) stats.karma = Math.max(0, Math.min(100, (stats.karma || 50) + option.statChanges.karma));
      }

      let initializedGovState = prev.governanceState;
      let currentJob = char.currentJob;
      if (currentJob) {
        let perf = currentJob.performance;
        if (option.jobPerformanceChange) {
          perf = Math.max(0, Math.min(100, perf + option.jobPerformanceChange));
        }

        let jobTitle = currentJob.title;
        let jobSalary = currentJob.salary;

        // High-impact governance special effects
        if (option.specialEffect === 'martial_law_governance') {
          jobTitle = 'Provisional Military Governor';
          jobSalary = 1500000;
          stats.fame = 95;
          perf = 100;
          initializedGovState = {
            isGovernor: true,
            regimeTitle: 'Provisional Military Governor',
            stability: 85,
            approval: 65,
            treasury: 25000000,
            taxRate: 25,
            curfewActive: false,
            martialLawLevel: 'Strict',
            cabinet: [
              { id: 'cab_1', title: 'Chief of Defense Staff', name: 'Gen. Arthur Sterling', avatarIcon: '🪖', loyalty: 85, competence: 90, status: 'Active' },
              { id: 'cab_2', title: 'Chief Justice', name: 'Hon. Marcus Vance', avatarIcon: '⚖️', loyalty: 65, competence: 95, status: 'Active' },
              { id: 'cab_3', title: 'Minister of Finance', name: 'Dr. Elena Rostova', avatarIcon: '💰', loyalty: 80, competence: 85, status: 'Active' },
              { id: 'cab_4', title: 'Chief of Intelligence', name: 'Col. Viktor Kroll', avatarIcon: '🕵️', loyalty: 90, competence: 92, status: 'Active' },
              { id: 'cab_5', title: 'Director of State Media', name: 'Sarah Jenkins', avatarIcon: '📺', loyalty: 75, competence: 70, status: 'Active' }
            ],
            yearsInPower: 1
          };
        } else if (option.specialEffect === 'supreme_court_immunity') {
          stats.fame = 85;
          stats.karma = 95;
          perf = 100;
        }

        currentJob = {
          ...currentJob,
          title: jobTitle,
          salary: jobSalary,
          performance: perf
        };
      }

      const balance = char.bankBalance + (option.moneyChange || 0);
      const prevCompleted = (char as any).completedDutyIds || [];
      const updatedCompletedDutyIds = Array.from(new Set([...prevCompleted, scenario.id]));

      const logText = `${scenario.icon} [Official Duty: ${scenario.title}] ${option.resultTitle}: ${option.resultText}`;

      return {
        ...prev,
        character: {
          ...char,
          bankBalance: balance,
          stats,
          currentJob,
          completedDutyIds: updatedCompletedDutyIds
        } as any,
        governanceState: initializedGovState,
        activeModal: option.specialEffect === 'martial_law_governance' ? 'jobs' : prev.activeModal,
        lifeLogs: [
          ...prev.lifeLogs,
          {
            id: 'log_duty_' + Date.now(),
            age: char.age,
            text: logText,
            type: (option.moneyChange || 0) > 0 ? 'income' : (option.jobPerformanceChange || 0) > 0 ? 'major' : 'neutral'
          }
        ]
      };
    });
  };

  // Option selected in Decision Event Modal
  const handleSelectEventOption = (option: ChoiceOption) => {
    setGameState(prev => {
      const char = { ...prev.character };
      const newStats = { ...char.stats };

      if (option.statChanges) {
        if (option.statChanges.happiness !== undefined) {
          newStats.happiness = Math.max(0, Math.min(100, newStats.happiness + option.statChanges.happiness));
        }
        if (option.statChanges.health !== undefined) {
          newStats.health = Math.max(0, Math.min(100, newStats.health + option.statChanges.health));
        }
        if (option.statChanges.smarts !== undefined) {
          newStats.smarts = Math.max(0, Math.min(100, newStats.smarts + option.statChanges.smarts));
        }
        if (option.statChanges.looks !== undefined) {
          newStats.looks = Math.max(0, Math.min(100, newStats.looks + option.statChanges.looks));
        }
      }

      let currentJob = char.currentJob;
      if (option.jobPerformanceChange && currentJob) {
        currentJob = {
          ...currentJob,
          performance: Math.max(0, Math.min(100, currentJob.performance + option.jobPerformanceChange))
        };
      }

      const newBalance = char.bankBalance + (option.moneyChange || 0);

      const logs = [
        ...prev.lifeLogs,
        {
          id: 'log_' + Date.now(),
          age: char.age,
          text: option.resultText,
          type: (option.moneyChange || 0) > 0 ? 'income' : (option.moneyChange || 0) < 0 ? 'negative' : 'neutral' as const
        }
      ];

      return {
        ...prev,
        character: {
          ...char,
          bankBalance: newBalance,
          stats: newStats,
          currentJob
        },
        lifeLogs: logs,
        activeModal: 'none',
        currentEvent: null
      };
    });
  };

  // Relationship Interactions
  const handleInteractRelationship = (person: PersonRelationship, action: string) => {
    setGameState(prev => {
      const updatedRels = prev.relationships.map(r => {
        if (r.id === person.id) {
          let delta = 5;
          if (action === 'insult') delta = -20;
          if (action === 'spend_time') delta = 10;
          if (action === 'give_gift') delta = 25;
          if (action === 'propose') delta = 30;

          const newBar = Math.max(0, Math.min(100, r.relationshipBar + delta));
          let newRelation = r.relation;
          if (action === 'propose' && newBar > 70) {
            newRelation = 'Fiancé';
          }
          return { ...r, relationshipBar: newBar, relation: newRelation };
        }
        return r;
      });

      const logs = [
        ...prev.lifeLogs,
        {
          id: 'log_' + Date.now(),
          age: prev.character.age,
          text: action === 'spend_time' ? `I spent time with my ${person.relation.toLowerCase()}, ${person.name}.` :
                action === 'compliment' ? `I complimented ${person.name}.` :
                action === 'insult' ? `I got into an argument with ${person.name}.` :
                action === 'give_gift' ? `I gave ${person.name} a lovely gift!` :
                `I interacted with ${person.name}.`,
          type: 'neutral' as const
        }
      ];

      return {
        ...prev,
        relationships: updatedRels,
        lifeLogs: logs
      };
    });
  };

  // Job Actions
  const handleApplyJob = (job: Job) => {
    setGameState(prev => ({
      ...prev,
      character: {
        ...prev.character,
        currentJob: job
      },
      lifeLogs: [
        ...prev.lifeLogs,
        {
          id: 'log_' + Date.now(),
          age: prev.character.age,
          text: `I started a new job as ${job.title} at ${job.company} making ${formatMoney(job.salary)}/year!`,
          type: 'major'
        }
      ]
    }));
  };

  const handleJobAction = (action: 'work_hard' | 'ask_raise' | 'ask_promotion' | 'quit') => {
    setGameState(prev => {
      const char = { ...prev.character };
      if (!char.currentJob) return prev;

      let job = { ...char.currentJob };
      let logs = [...prev.lifeLogs];

      if (action === 'work_hard') {
        job.performance = Math.min(100, job.performance + 15);
        logs.push({
          id: 'log_' + Date.now(),
          age: char.age,
          text: `I worked hard at ${job.company}. My performance increased!`,
          type: 'neutral'
        });
      } else if (action === 'ask_raise') {
        if (job.performance > 70) {
          job.salary = Math.round(job.salary * 1.15);
          logs.push({
            id: 'log_' + Date.now(),
            age: char.age,
            text: `My raise request was approved! My new salary is ${formatMoney(job.salary)}/year.`,
            type: 'income'
          });
        } else {
          logs.push({
            id: 'log_' + Date.now(),
            age: char.age,
            text: 'My manager denied my raise request.',
            type: 'negative'
          });
        }
      } else if (action === 'quit') {
        logs.push({
          id: 'log_' + Date.now(),
          age: char.age,
          text: `I resigned from my job as ${job.title}.`,
          type: 'neutral'
        });
        return {
          ...prev,
          character: { ...char, currentJob: null },
          lifeLogs: logs
        };
      }

      return {
        ...prev,
        character: { ...char, currentJob: job },
        lifeLogs: logs
      };
    });
  };

  // Asset Actions
  const handleBuyAsset = (asset: Asset) => {
    setGameState(prev => ({
      ...prev,
      character: {
        ...prev.character,
        bankBalance: prev.character.bankBalance - asset.purchasePrice
      },
      assets: [...prev.assets, asset],
      lifeLogs: [
        ...prev.lifeLogs,
        {
          id: 'log_' + Date.now(),
          age: prev.character.age,
          text: `I purchased ${asset.name} for ${formatMoney(asset.purchasePrice)}.`,
          type: 'income'
        }
      ]
    }));
  };

  const handleSellAsset = (assetId: string) => {
    setGameState(prev => {
      const target = prev.assets.find(a => a.id === assetId);
      if (!target) return prev;

      return {
        ...prev,
        character: {
          ...prev.character,
          bankBalance: prev.character.bankBalance + target.currentValue
        },
        assets: prev.assets.filter(a => a.id !== assetId),
        lifeLogs: [
          ...prev.lifeLogs,
          {
            id: 'log_' + Date.now(),
            age: prev.character.age,
            text: `I sold ${target.name} for ${formatMoney(target.currentValue)}.`,
            type: 'income'
          }
        ]
      };
    });
  };

  // Stock trading
  const handleTradeStock = (symbol: string, deltaShares: number) => {
    setGameState(prev => {
      const stocks = (prev.stocks.length > 0 ? prev.stocks : INITIAL_STOCKS).map(s => {
        if (s.symbol === symbol) {
          const cost = s.price * Math.abs(deltaShares);
          if (deltaShares > 0 && prev.character.bankBalance < cost) return s;
          if (deltaShares < 0 && s.sharesOwned < Math.abs(deltaShares)) return s;

          return { ...s, sharesOwned: s.sharesOwned + deltaShares };
        }
        return s;
      });

      const targetStock = stocks.find(s => s.symbol === symbol);
      const price = targetStock ? targetStock.price : 100;
      const cashDelta = deltaShares > 0 ? -(price * deltaShares) : (price * Math.abs(deltaShares));

      return {
        ...prev,
        character: {
          ...prev.character,
          bankBalance: prev.character.bankBalance + cashDelta
        },
        stocks
      };
    });
  };

  // Activity Actions
  const handleDoActivity = (type: string, payload?: any) => {
    setGameState(prev => {
      const char = { ...prev.character };
      const stats = { ...char.stats };
      let balance = char.bankBalance;
      let logs = [...prev.lifeLogs];

      if (type === 'gym') {
        stats.health = Math.min(100, stats.health + 5);
        stats.looks = Math.min(100, stats.looks + 3);
        logs.push({ id: 'log_' + Date.now(), age: char.age, text: 'I worked out at the gym.', type: 'neutral' });
      } else if (type === 'meditate') {
        stats.happiness = Math.min(100, stats.happiness + 8);
        logs.push({ id: 'log_' + Date.now(), age: char.age, text: 'I spent an hour meditating.', type: 'neutral' });
      } else if (type === 'read_book') {
        stats.smarts = Math.min(100, stats.smarts + 5);
        logs.push({ id: 'log_' + Date.now(), age: char.age, text: 'I finished reading a literature book.', type: 'neutral' });
      } else if (type === 'plastic_surgery' && payload) {
        if (balance >= payload.cost) {
          balance -= payload.cost;
          stats.looks = Math.min(100, stats.looks + payload.looksBoost);
          logs.push({ id: 'log_' + Date.now(), age: char.age, text: `I underwent ${payload.name} plastic surgery!`, type: 'income' });
        }
      } else if (type === 'lottery' && payload) {
        balance -= 10;
        if (payload.won) {
          balance += payload.amount;
          stats.happiness = 100;
          logs.push({ id: 'log_' + Date.now(), age: char.age, text: `I WON THE ${formatMoney(payload.amount)} LOTTERY JACKPOT!`, type: 'income' });
        } else {
          logs.push({ id: 'log_' + Date.now(), age: char.age, text: 'I bought a $10 lottery scratch ticket.', type: 'neutral' });
        }
      } else if (type === 'crime' && payload) {
        if (payload.success) {
          balance += payload.moneyReward;
          stats.happiness = Math.min(100, stats.happiness + 10);
          logs.push({ id: 'log_' + Date.now(), age: char.age, text: `I successfully committed a crime and stole ${formatMoney(payload.moneyReward)}!`, type: 'income' });
        } else {
          stats.happiness = Math.max(0, stats.happiness - 20);
          logs.push({ id: 'log_' + Date.now(), age: char.age, text: 'I attempted a crime but narrowly escaped the police!', type: 'negative' });
        }
      }

      return {
        ...prev,
        character: {
          ...char,
          bankBalance: balance,
          stats
        },
        lifeLogs: logs
      };
    });
  };

  // Education Handlers
  const handleUpdateEducation = (
    updatedEd: Partial<GameState['character']['education']['details']>,
    logMsg?: string
  ) => {
    setGameState(prev => {
      const char = { ...prev.character };
      const currentEdDetails = char.education.details || {
        level: char.education.level || 'None',
        schoolName: 'School',
        yearsCompleted: 0,
        totalYears: 4,
        grades: 75,
        popularity: 50,
        athleticism: 50,
        clubs: []
      };

      const mergedDetails = { ...currentEdDetails, ...updatedEd };
      const newEdLevel = (updatedEd.level !== undefined ? updatedEd.level : char.education.level) as EducationLevel;

      const logs = [...prev.lifeLogs];
      if (logMsg) {
        logs.push({
          id: 'log_ed_' + Date.now(),
          age: char.age,
          text: logMsg,
          type: 'neutral'
        });
      }

      return {
        ...prev,
        character: {
          ...char,
          education: {
            ...char.education,
            level: newEdLevel,
            major: updatedEd.major || char.education.major,
            grades: mergedDetails.grades || char.education.grades,
            details: mergedDetails
          }
        },
        lifeLogs: logs
      };
    });
  };

  const handleAddRelationship = (newRel: PersonRelationship) => {
    setGameState(prev => ({
      ...prev,
      relationships: [...prev.relationships, newRel],
      lifeLogs: [
        ...prev.lifeLogs,
        {
          id: 'log_rel_' + Date.now(),
          age: prev.character.age,
          text: `I started dating ${newRel.name}!`,
          type: 'major'
        }
      ]
    }));
  };

  const handleEnrollSchool = (
    level: EducationLevel,
    major?: string,
    schoolName?: string,
    totalYears: number = 4,
    tuitionCost: number = 0,
    fundingMethod: string = 'scholarship'
  ) => {
    setGameState(prev => {
      const char = { ...prev.character };
      let balance = char.bankBalance;
      let logs = [...prev.lifeLogs];

      if (fundingMethod === 'cash') {
        balance -= tuitionCost;
      }

      let fundingText = 'on a scholarship';
      if (fundingMethod === 'parents') fundingText = 'funded by parents';
      if (fundingMethod === 'loan') fundingText = 'via student loans';
      if (fundingMethod === 'cash') fundingText = `paying ${formatMoney(tuitionCost)} in cash`;

      const logText = major 
        ? `🎓 I enrolled in ${schoolName || level} majoring in ${major} (${fundingText})!` 
        : `🎓 I enrolled in ${schoolName || level} (${fundingText})!`;

      logs.push({
        id: 'log_enroll_' + Date.now(),
        age: char.age,
        text: logText,
        type: 'major'
      });

      const currentEdDetails = char.education.details || {
        level,
        schoolName,
        major,
        yearsCompleted: 0,
        totalYears,
        grades: 80,
        popularity: 50,
        athleticism: 50,
        clubs: [],
        schoolCount: 0
      };

      const updatedEdDetails = {
        ...currentEdDetails,
        level,
        schoolName,
        major,
        yearsCompleted: 0,
        totalYears,
        grades: 80,
        droppedOut: false,
        expelled: false,
        schoolCount: (currentEdDetails.schoolCount || 0) + 1
      };

      return {
        ...prev,
        character: {
          ...char,
          bankBalance: balance,
          education: {
            level,
            major,
            grades: 80,
            graduated: false,
            scholarship: fundingMethod === 'scholarship',
            details: updatedEdDetails
          }
        },
        lifeLogs: logs
      };
    });
  };

  // Custom AI Action result applied
  const handleApplyCustomAiResult = (result: {
    resultText: string;
    statChanges?: any;
    moneyChange?: number;
  }) => {
    setGameState(prev => {
      const char = { ...prev.character };
      const stats = { ...char.stats };

      if (result.statChanges) {
        if (result.statChanges.happiness) stats.happiness = Math.max(0, Math.min(100, stats.happiness + result.statChanges.happiness));
        if (result.statChanges.health) stats.health = Math.max(0, Math.min(100, stats.health + result.statChanges.health));
        if (result.statChanges.smarts) stats.smarts = Math.max(0, Math.min(100, stats.smarts + result.statChanges.smarts));
        if (result.statChanges.looks) stats.looks = Math.max(0, Math.min(100, stats.looks + result.statChanges.looks));
      }

      const balance = char.bankBalance + (result.moneyChange || 0);

      return {
        ...prev,
        character: { ...char, bankBalance: balance, stats },
        lifeLogs: [
          ...prev.lifeLogs,
          {
            id: 'log_' + Date.now(),
            age: char.age,
            text: result.resultText,
            type: (result.moneyChange || 0) > 0 ? 'income' : 'neutral'
          }
        ]
      };
    });
  };

  // Create new life
  const handleStartNewLife = (name: { firstName: string; lastName: string }, gender: any, talent: any) => {
    const freshState = createNewLife(name, gender, talent);
    setGameState(freshState);
  };

  // Reverse Age Time Machine Handler
  const handleReverseAge = (yearsBack: number | 'birth') => {
    if (!gameState.character.isAlive) return;

    setGameState(prev => {
      let targetAge = 0;
      if (yearsBack === 'birth') {
        targetAge = 0;
      } else {
        targetAge = Math.max(0, prev.character.age - yearsBack);
      }

      if (prev.historySnapshots && prev.historySnapshots[targetAge]) {
        const snap = prev.historySnapshots[targetAge];
        const updatedSnapshots = { ...prev.historySnapshots };
        Object.keys(updatedSnapshots).forEach(k => {
          if (Number(k) > targetAge) delete updatedSnapshots[Number(k)];
        });

        return {
          ...prev,
          character: JSON.parse(JSON.stringify(snap.character)),
          relationships: JSON.parse(JSON.stringify(snap.relationships)),
          assets: JSON.parse(JSON.stringify(snap.assets)),
          stocks: JSON.parse(JSON.stringify(snap.stocks)),
          lifeLogs: snap.lifeLogs.filter(l => l.age <= targetAge),
          governanceState: snap.governanceState ? JSON.parse(JSON.stringify(snap.governanceState)) : undefined,
          historySnapshots: updatedSnapshots,
          activeModal: 'none',
          currentEvent: null
        };
      }

      const newAge = targetAge;
      const filteredLogs = prev.lifeLogs.filter(l => l.age <= newAge);
      const updatedSnapshots = { ...(prev.historySnapshots || {}) };
      Object.keys(updatedSnapshots).forEach(k => {
        if (Number(k) > newAge) delete updatedSnapshots[Number(k)];
      });

      return {
        ...prev,
        character: {
          ...prev.character,
          age: newAge,
          currentJob: newAge < 18 ? null : prev.character.currentJob
        },
        lifeLogs: filteredLogs,
        historySnapshots: updatedSnapshots,
        activeModal: 'none',
        currentEvent: null
      };
    });
  };

  // State Governance Handlers
  const handleUpdateGovernanceState = (updater: (prev: GovernanceState) => GovernanceState) => {
    setGameState(prev => {
      const currentGov = prev.governanceState || {
        isGovernor: true,
        regimeTitle: 'Provisional Military Governor',
        stability: 85,
        approval: 65,
        treasury: 25000000,
        taxRate: 25,
        curfewActive: false,
        martialLawLevel: 'Strict' as const,
        cabinet: [],
        yearsInPower: 1
      };
      return {
        ...prev,
        governanceState: updater(currentGov)
      };
    });
  };

  const handleStepDownGovernance = () => {
    setGameState(prev => {
      const char = { ...prev.character };
      const logs = [
        ...prev.lifeLogs,
        {
          id: 'log_gov_stepdown_' + Date.now(),
          age: char.age,
          text: '🏛️ [RESTORATION DECREE] I officially dissolved the Provisional Military Council, restored civilian democracy, and retired with a $250,000/year State Elder pension.',
          type: 'major' as const
        }
      ];

      return {
        ...prev,
        character: {
          ...char,
          currentJob: {
            id: 'job_pension_' + Date.now(),
            title: 'Former State Governor (Retired)',
            company: 'Republic State Pension Fund',
            salary: 250000,
            reqSmarts: 0,
            category: 'Public Service',
            performance: 100,
            yearsInRole: 1
          }
        },
        governanceState: undefined,
        activeModal: 'none',
        lifeLogs: logs
      };
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 border-x border-slate-700 font-sans relative overflow-hidden select-none">
      {/* Top BitLife Header */}
      <TopHeader
        state={gameState}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Main Content Stream (Year-by-year life feed) */}
      <LifeFeed logs={gameState.lifeLogs} />

      {/* Stats Bar */}
      <StatsBar stats={gameState.character.stats} />

      {/* Bottom Nav Bar */}
      <BottomNav
        onOpenTab={(tab) => setGameState(prev => ({ ...prev, activeModal: tab }))}
        onAgeUp={handleAgeUp}
        onAgeDown={() => setGameState(prev => ({ ...prev, activeModal: 'reverseAge' }))}
        isDead={!gameState.character.isAlive}
      />

      {/* DEATH CARD SCREEN */}
      {!gameState.character.isAlive && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border-4 border-amber-500 rounded-3xl p-6 text-center text-white space-y-4 max-w-sm w-full shadow-2xl">
            <div className="text-5xl">🪦</div>
            <div className="space-y-1">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                Ribbon Earned: {calculateRibbon(gameState)}
              </span>
              <h2 className="text-2xl font-black text-amber-300 pt-2">
                {gameState.character.firstName} {gameState.character.lastName}
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                Lived {gameState.character.age} years in {gameState.character.city}, {gameState.character.country}
              </p>
            </div>

            <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-1.5 text-left font-medium">
              <p><strong>Cause of Death:</strong> {gameState.character.causeOfDeath || 'Old Age'}</p>
              <p><strong>Highest Education:</strong> {gameState.character.education.details?.highestCompleted || gameState.character.education.level || 'None'}</p>
              <p><strong>Net Worth:</strong> {formatMoney(gameState.character.bankBalance)}</p>
              <p><strong>Final Occupation:</strong> {gameState.character.currentJob ? gameState.character.currentJob.title : 'Unemployed'}</p>
            </div>

            <button
              onClick={() => setGameState(prev => ({ ...prev, activeModal: 'newLife' }))}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-2xl shadow-lg transition active:scale-95 text-base uppercase tracking-wider border border-emerald-300 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Start New Custom Life</span>
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      {gameState.activeModal === 'event' && gameState.currentEvent && (
        <EventModal
          event={gameState.currentEvent}
          onSelectOption={handleSelectEventOption}
        />
      )}

      {gameState.activeModal === 'reverseAge' && (
        <ReverseAgeModal
          currentAge={gameState.character.age}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onReverseAge={handleReverseAge}
        />
      )}

      {gameState.activeModal === 'relationships' && (
        <RelationshipModal
          state={gameState}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onInteract={handleInteractRelationship}
        />
      )}

      {gameState.activeModal === 'jobs' && (
        <JobsModal
          state={gameState}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onApplyJob={handleApplyJob}
          onJobAction={handleJobAction}
          onOpenEducation={() => setGameState(prev => ({ ...prev, activeModal: 'education' }))}
          onApplyDutyOutcome={handleApplyDutyOutcome}
          onUpdateGovernanceState={handleUpdateGovernanceState}
          onStepDownGovernance={handleStepDownGovernance}
          onUpdateExecutiveState={(execState) => setGameState(prev => ({ ...prev, executiveState: execState }))}
          onGrantPersonalCash={(amount) => setGameState(prev => ({
            ...prev,
            character: {
              ...prev.character,
              bankBalance: prev.character.bankBalance + amount
            }
          }))}
        />
      )}

      {gameState.activeModal === 'education' && (
        <EducationModal
          state={gameState}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onUpdateEducation={handleUpdateEducation}
          onAddRelationship={handleAddRelationship}
          onEnrollSchool={handleEnrollSchool}
        />
      )}

      {gameState.activeModal === 'assets' && (
        <AssetsModal
          state={gameState}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onBuyAsset={handleBuyAsset}
          onSellAsset={handleSellAsset}
          onTradeStock={handleTradeStock}
        />
      )}

      {gameState.activeModal === 'activities' && (
        <ActivitiesModal
          state={gameState}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onDoActivity={handleDoActivity}
          onOpenAiCustomModal={() => setGameState(prev => ({ ...prev, activeModal: 'aiCustom' }))}
          onOpenEducation={() => setGameState(prev => ({ ...prev, activeModal: 'education' }))}
        />
      )}

      {gameState.activeModal === 'aiCustom' && (
        <CustomAiActionModal
          state={gameState}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onApplyCustomResult={handleApplyCustomAiResult}
        />
      )}

      {gameState.activeModal === 'newLife' && (
        <NewLifeModal
          onStartNewLife={(name, gender, talent) => {
            handleStartNewLife(name, gender, talent);
            setGameState(prev => ({ ...prev, activeModal: 'none' }));
          }}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          canCancel={gameState.character.isAlive}
        />
      )}

      {gameState.activeModal === 'graveyard' && (
        <GraveyardModal
          graveyard={gameState.graveyard}
          onClose={() => setGameState(prev => ({ ...prev, activeModal: 'none' }))}
          onClearGraveyard={() => {
            localStorage.removeItem('lifesim_graveyard');
            setGameState(prev => ({ ...prev, graveyard: [] }));
          }}
        />
      )}

      {/* Side Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNewLife={() => setGameState(prev => ({ ...prev, activeModal: 'newLife' }))}
        onOpenGraveyard={() => setGameState(prev => ({ ...prev, activeModal: 'graveyard' }))}
        onSaveGame={() => {
          localStorage.setItem('lifesim_bitlife_state', JSON.stringify(gameState));
          alert('Game progress saved successfully!');
        }}
        onResetGame={() => {
          const fresh = createNewLife();
          setGameState(fresh);
        }}
      />
    </div>
  );
}
