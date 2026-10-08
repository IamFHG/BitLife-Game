import React, { useState } from 'react';
import { GameState, Job, JobCoworker, GovernanceState, ExecutiveState } from '../types';
import { CAREER_PATHS, CareerPath, CareerTier } from '../data/careerData';
import { formatMoney } from '../utils/gameUtils';
import { checkEducationQualification, sanitizeCompletedDegrees, formatShortDegreeTitle, getDegreeIcon } from '../utils/qualificationUtils';
import { 
  generateCoworkers, checkCareerPromotionEligibility, checkJobApplicationEligibility, getEmployerForCity, findCareerPathByJobTitle, hasSupremeJobPrivilege 
} from '../utils/jobUtils';
import { CareerDutyModal } from './CareerDutyModal';
import { GovernanceView } from './GovernanceView';
import { CareerOfficeView } from './CareerOfficeView';
import { CareerDutyScenario, CareerDutyOption } from '../data/careerDutiesData';
import { isExecutiveRole } from '../utils/executiveEngine';
import { ExecutiveOfficeView } from './ExecutiveOfficeView';
import { 
  X, ChevronRight, CheckCircle2, ArrowLeft, Lock, Crown
} from 'lucide-react';

interface JobsModalProps {
  state: GameState;
  onClose: () => void;
  onApplyJob: (job: Job) => void;
  onJobAction: (action: 'work_hard' | 'ask_raise' | 'ask_promotion' | 'quit') => void;
  onOpenEducation: () => void;
  onApplyDutyOutcome?: (scenario: CareerDutyScenario, option: CareerDutyOption) => void;
  onUpdateGovernanceState?: (updater: (prev: GovernanceState) => GovernanceState) => void;
  onStepDownGovernance?: () => void;
  onUpdateExecutiveState?: (execState: ExecutiveState) => void;
  onGrantPersonalCash?: (amount: number) => void;
}

type SubView = 
  | 'main' 
  | 'executive_suite'
  | 'jobs_catalog' 
  | 'career_path_view' 
  | 'job_details'
  | 'current_job_activities' 
  | 'coworkers_view' 
  | 'freelance' 
  | 'part_time' 
  | 'military' 
  | 'special';

export const JobsModal: React.FC<JobsModalProps> = ({
  state,
  onClose,
  onApplyJob,
  onJobAction,
  onOpenEducation,
  onApplyDutyOutcome,
  onUpdateGovernanceState,
  onStepDownGovernance,
  onUpdateExecutiveState,
  onGrantPersonalCash
}) => {
  const { character } = state;
  const { currentJob, stats, age, education, bankBalance, firstName, lastName, avatarIcon, city } = character;

  const [governorBrowsingCareers, setGovernorBrowsingCareers] = useState(false);
  const [currentView, setCurrentView] = useState<SubView>('main');
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath | null>(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState<{ path: CareerPath; tier: CareerTier; employer: string } | null>(null);
  const [selectedCoworker, setSelectedCoworker] = useState<JobCoworker | null>(null);
  const [showWorkingHoursModal, setShowWorkingHoursModal] = useState(false);
  const [showRetirementModal, setShowRetirementModal] = useState(false);
  const [showHrModal, setShowHrModal] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);
  const [showDutiesModal, setShowDutiesModal] = useState(false);
  const [jobFilter, setJobFilter] = useState<'all' | 'qualified'>('all');
  const [alertModal, setAlertModal] = useState<{ title: string; message: string; type?: 'error' | 'success' | 'info' } | null>(null);

  const isRetiredJob = Boolean(currentJob && (
    currentJob.isRetired || 
    currentJob.title.toLowerCase().includes('(retired)') || 
    currentJob.title.toLowerCase().includes('retired') || 
    currentJob.company.toLowerCase().includes('pension')
  ));

  // Check if character has Supreme Job Clearance (Retired General, Provisional Governor, Flag Officer)
  const isPrivileged = hasSupremeJobPrivilege(character, state.governanceState);

  // Check if character is Provisional Military Governor
  const isProvisionalGovernor = 
    Boolean(state.governanceState?.isGovernor) || 
    Boolean(currentJob && (
      currentJob.title.includes('Provisional') || 
      currentJob.title.includes('Military Governor') || 
      currentJob.title.includes('Regime Leader') || 
      currentJob.title.includes('Dictator')
    ));

  if (isProvisionalGovernor && !governorBrowsingCareers) {
    return (
      <div className="fixed inset-0 z-40 max-w-md mx-auto w-full h-full bg-[#eef2f5] flex flex-col overflow-hidden animate-in fade-in duration-150 select-none">
        <GovernanceView
          state={state}
          onUpdateGovernance={(updater) => {
            if (onUpdateGovernanceState) {
              onUpdateGovernanceState(updater);
            }
          }}
          onStepDown={() => {
            if (onStepDownGovernance) {
              onStepDownGovernance();
            }
            onClose();
          }}
          onBrowseCareers={() => {
            setGovernorBrowsingCareers(true);
            setCurrentView('jobs_catalog');
          }}
          onClose={onClose}
        />
      </div>
    );
  }

  // Active School check
  const inSchool = education.level !== 'None' && !education.details?.droppedOut;
  const grades = education.details?.grades || education.grades || 75;

  // Handle Category click with age gating (bypassed if privileged)
  const handleCategoryClick = (category: SubView) => {
    if (isPrivileged) {
      setCurrentView(category);
      return;
    }

    if (category === 'freelance') {
      if (age < 12) {
        setAlertModal({ title: 'Too Young!', message: 'You must be at least 12 years old to do freelance gigs!', type: 'error' });
        return;
      }
      setCurrentView('freelance');
    } else if (category === 'part_time') {
      if (age < 14) {
        setAlertModal({ title: 'Too Young!', message: 'You must be at least 14 years old to work part-time jobs!', type: 'error' });
        return;
      }
      setCurrentView('part_time');
    } else if (category === 'jobs_catalog') {
      if (age < 18) {
        setAlertModal({ title: 'Too Young!', message: 'You must be at least 18 years old to apply for full-time career positions!', type: 'error' });
        return;
      }
      setCurrentView('jobs_catalog');
    } else if (category === 'military') {
      if (age < 18) {
        setAlertModal({ title: 'Too Young!', message: 'You must be at least 18 years old to enlist in the Military!', type: 'error' });
        return;
      }
      const hsCheck = checkEducationQualification(character, 'High School');
      if (!hsCheck.qualified) {
        setAlertModal({ title: 'Not Qualified!', message: 'The Military requires at least a High School Diploma or GED!', type: 'error' });
        return;
      }
      setCurrentView('military');
    } else if (category === 'special') {
      if (age < 18) {
        setAlertModal({ title: 'Too Young!', message: 'You must be at least 18 years old to pursue special careers!', type: 'error' });
        return;
      }
      setCurrentView('special');
    }
  };

  // Open Dedicated Job Details Tab View
  const openJobDetailsTab = (path: CareerPath, tier: CareerTier) => {
    const employer = getEmployerForCity(path, city);
    setSelectedJobDetail({ path, tier, employer });
    setCurrentView('job_details');
  };

  // Apply for Job Position from Dedicated Details Tab (Supreme Privilege Bypasses All Hurdles)
  const handleApplyJobPosition = () => {
    if (!selectedJobDetail) return;
    const { path, tier, employer } = selectedJobDetail;

    if (!isPrivileged) {
      // Age Check
      const minAgeRequired = path.minAge || 18;
      if (age < minAgeRequired) {
        setAlertModal({
          title: 'Application Rejected!',
          message: `You must be at least ${minAgeRequired} years old for this position!`,
          type: 'error'
        });
        return;
      }

      // Check Degree Requirement
      if (tier.reqDegree) {
        const qualCheck = checkEducationQualification(character, tier.reqDegree);
        if (!qualCheck.qualified) {
          setAlertModal({
            title: 'Application Rejected!',
            message: `Your application was rejected! Reason: ${qualCheck.reason}`,
            type: 'error'
          });
          return;
        }
      }

      // Check Smarts & Looks
      if (tier.reqSmarts && stats.smarts < tier.reqSmarts) {
        setAlertModal({
          title: 'Application Rejected!',
          message: `They rejected your application because they require at least ${tier.reqSmarts}% Smarts!`,
          type: 'error'
        });
        return;
      }

      if (tier.reqLooks && stats.looks < tier.reqLooks) {
        setAlertModal({
          title: 'Application Rejected!',
          message: `They rejected your application because they require at least ${tier.reqLooks}% Looks!`,
          type: 'error'
        });
        return;
      }

      // CAREER LADDER GATE: Check cumulative career history & eligibility
      const tierIndex = path.tiers.findIndex(t => t.title === tier.title);
      if (tierIndex > 0) {
        const eligibility = checkJobApplicationEligibility(path, tier, character, state.governanceState);
        if (!eligibility.qualified) {
          setAlertModal({
            title: 'Direct Entry Restricted!',
            message: eligibility.reason || `You cannot apply directly for ${tier.title} without required cumulative service in prior ranks!`,
            type: 'error'
          });
          return;
        }
      }
    }

    // Generate coworkers & supervisor
    const { supervisor, coworkers } = generateCoworkers(employer, tier.title);

    const newJob: Job = {
      id: 'job_' + Date.now(),
      title: tier.title,
      company: employer,
      salary: tier.salary,
      reqSmarts: tier.reqSmarts || 20,
      reqDegree: typeof tier.reqDegree === 'string' ? tier.reqDegree : undefined,
      category: path.category,
      performance: isPrivileged ? 85 : 50,
      yearsInRole: 0,
      yearsInCareer: 0,
      hoursPerWeek: 40,
      stress: 20,
      isSpecialFame: path.isSpecialFame,
      careerPathId: path.id,
      currentTierIndex: path.tiers.findIndex(t => t.title === tier.title),
      supervisor,
      coworkers
    };

    onApplyJob(newJob);
    setSelectedJobDetail(null);
    setAlertModal({
      title: isPrivileged ? '👑 Supreme Appointment Ratified!' : 'Hired!',
      message: isPrivileged
        ? `By executive privilege as a ${isProvisionalGovernor ? 'Provisional Governor' : 'Retired General / Flag Officer'}, you have assumed the office of ${newJob.title} (Rank ${tier.rankLevel}) at ${newJob.company} earning ${formatMoney(newJob.salary)}/year with instant clearance!`
        : `Congratulations! You were hired as ${newJob.title} at ${newJob.company} earning ${formatMoney(newJob.salary)}/year!`,
      type: 'success'
    });
    setCurrentView('main');
  };

  // Work Harder
  const handleWorkHarder = () => {
    onJobAction('work_hard');
    setAlertModal({
      title: 'All Work No Play',
      message: `You put in extra hours for ${currentJob?.company || 'your employer'}. Your performance increased!`,
      type: 'success'
    });
  };

  // Request Promotion Logic
  const handleRequestPromotion = () => {
    if (!currentJob) return;

    const promoCheck = checkCareerPromotionEligibility(stats, currentJob);
    if (!promoCheck.eligible || !promoCheck.nextTier) {
      setAlertModal({
        title: 'Promotion Denied!',
        message: promoCheck.reason,
        type: 'error'
      });
      return;
    }

    const nextTier = promoCheck.nextTier;

    const updatedJob: Job = {
      ...currentJob,
      title: nextTier.title,
      salary: nextTier.salary,
      currentTierIndex: (currentJob.currentTierIndex ?? 0) + 1,
      yearsInRole: 0,
      performance: 65
    };

    onApplyJob(updatedJob);
    setAlertModal({
      title: 'PROMOTED!',
      message: `Congratulations! Your supervisor promoted you to ${nextTier.title}! Your new salary is ${formatMoney(nextTier.salary)}/year!`,
      type: 'success'
    });
  };

  // Do Freelance
  const handleDoFreelance = (gigName: string, payout: number) => {
    setAlertModal({
      title: 'Gig Complete!',
      message: `You completed a ${gigName} gig and earned ${formatMoney(payout)}!`,
      type: 'success'
    });
  };

  // Interact with Coworker or Boss
  const handleInteractCoworker = (coworker: JobCoworker, action: 'compliment' | 'coffee' | 'work_together' | 'flatter') => {
    let delta = 10;
    let text = `You interacted with ${coworker.name}.`;

    if (action === 'compliment') {
      delta = 12;
      text = `You gave ${coworker.name} a glowing compliment about their recent work!`;
    } else if (action === 'coffee') {
      delta = 15;
      text = `You brought ${coworker.name} a fresh gourmet coffee from Starbeans!`;
    } else if (action === 'work_together') {
      delta = 10;
      text = `You collaborated smoothly with ${coworker.name} on a key workplace project!`;
    } else if (action === 'flatter') {
      delta = 20;
      text = `You shamelessly flattered ${coworker.name}. They loved it!`;
    }

    if (currentJob) {
      if (coworker.isBoss && currentJob.supervisor) {
        currentJob.supervisor.relationship = Math.min(100, currentJob.supervisor.relationship + delta);
      } else if (currentJob.coworkers) {
        const target = currentJob.coworkers.find(c => c.id === coworker.id);
        if (target) target.relationship = Math.min(100, target.relationship + delta);
      }
    }

    setSelectedCoworker(null);
    setAlertModal({ title: 'Workplace Reaction', message: text, type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-40 max-w-md mx-auto w-full h-full bg-[#eef2f5] flex flex-col overflow-hidden animate-in fade-in duration-150 select-none">
      
        {/* Top Header Bar */}
        <div className="bg-[#0c52a1] px-4 py-3 text-white flex items-center justify-between shadow-md shrink-0 relative z-10">
          {currentView !== 'main' ? (
            <button
              onClick={() => {
                if (currentView === 'job_details') {
                  if (selectedCareerPath) setCurrentView('career_path_view');
                  else setCurrentView('jobs_catalog');
                }
                else if (currentView === 'career_path_view') setCurrentView('jobs_catalog');
                else if (currentView === 'coworkers_view') setCurrentView('current_job_activities');
                else setCurrentView('main');
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <h2 className="text-xl font-black italic tracking-wide text-white uppercase drop-shadow">
            {currentView === 'current_job_activities' ? 'JOB' : currentView === 'job_details' ? 'POSITION DETAILS' : 'OCCUPATION'}
          </h2>

          <span className="text-[10px] text-blue-200 font-bold">v3.22a</span>
        </div>

        {/* Character Sub-Header */}
        <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between text-slate-800 text-xs shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">{avatarIcon || '👤'}</span>
            <div>
              <div className="font-extrabold text-slate-900 flex items-center gap-1">
                <span>🇺🇸</span>
                <span>{firstName} {lastName}</span>
                <span>🎭</span>
              </div>
              <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                <span className="text-red-500">🍎</span>
                <span>
                  {inSchool ? `${education.level} Student` : currentJob ? currentJob.title : 'Unemployed'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-black text-emerald-600">{formatMoney(bankBalance)}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Bank Balance</div>
          </div>
        </div>

        {/* Supreme Privilege Indicator Banner */}
        {isPrivileged && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 px-4 py-2 border-b border-amber-300 flex items-center justify-between text-xs shrink-0 z-10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 text-xs shadow-xs">
                👑
              </div>
              <div className="min-w-0">
                <div className="font-black text-amber-950 text-[11px] uppercase tracking-wide truncate">
                  {isProvisionalGovernor ? 'Provisional Governor Authority' : 'Retired General / Flag Officer Privilege'}
                </div>
                <div className="text-[10px] text-amber-800 font-semibold truncate">
                  Unrestricted Appointment to Any Career & Rank Granted
                </div>
              </div>
            </div>
            {isProvisionalGovernor && governorBrowsingCareers && (
              <button
                onClick={() => setGovernorBrowsingCareers(false)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-[10px] px-2.5 py-1 rounded-lg border border-amber-400/40 transition shrink-0 ml-2 cursor-pointer"
              >
                Council →
              </button>
            )}
          </div>
        )}

        {/* Navigation Sub-Header Bar (ONLY for Employed or Retired Characters) */}
        {currentJob && (() => {
          const isExec = isExecutiveRole(currentJob) || Boolean(state.executiveState && state.executiveState.isExecutive);

          return (
            <div className="bg-slate-200/80 p-1 mx-3 mt-2.5 rounded-xl flex gap-1 font-extrabold text-[11px] shrink-0 border border-slate-300/60 overflow-x-auto">
              {isExec && !isRetiredJob && (
                <button
                  onClick={() => setCurrentView('executive_suite')}
                  className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center justify-center gap-1 ${
                    currentView === 'executive_suite' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <span>👑 Executive</span>
                </button>
              )}

              <button
                onClick={() => setCurrentView('main')}
                className={`flex-1 py-1.5 rounded-lg transition whitespace-nowrap ${
                  currentView === 'main' ? 'bg-[#0c52a1] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
                }`}
              >
                {isRetiredJob ? '🏛️ Pension' : isExec ? '🏢 Sector Ops' : '🏢 My Office'}
              </button>

              {!isRetiredJob && (
                <button
                  onClick={() => setCurrentView('current_job_activities')}
                  className={`flex-1 py-1.5 rounded-lg transition whitespace-nowrap ${
                    currentView === 'current_job_activities' ? 'bg-[#0c52a1] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
                  }`}
                >
                  ⚡ Workplace
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenEducation();
                }}
                className="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-300/60 transition whitespace-nowrap"
              >
                🎓 Education
              </button>

              <button
                onClick={() => setCurrentView('jobs_catalog')}
                className={`flex-1 py-1.5 rounded-lg transition whitespace-nowrap ${
                  currentView === 'jobs_catalog' ? 'bg-[#0c52a1] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
                }`}
              >
                🔍 Explore
              </button>
            </div>
          );
        })()}

        {/* Main Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          
          {/* VIEW 0: EXECUTIVE COMMAND SUITE */}
          {currentView === 'executive_suite' && currentJob && (
            <div className="pb-4">
              <ExecutiveOfficeView
                state={state}
                onUpdateJobState={(updatedJob) => {
                  onApplyJob(updatedJob);
                }}
                onShowFeedback={(msg, type) => {
                  setAlertModal({
                    title: type === 'error' ? 'Notice' : 'Command Update',
                    message: msg,
                    type: type || 'success'
                  });
                }}
                onUpdateExecutiveState={onUpdateExecutiveState}
                onGrantPersonalCash={onGrantPersonalCash}
              />
            </div>
          )}

          {/* VIEW 1: MAIN OCCUPATION DASHBOARD */}
          {currentView === 'main' && (
            <div className="pb-4">
              {currentJob ? (
                /* Active employee or pensioner view ONLY - no bottom lists */
                <CareerOfficeView
                  state={state}
                  onJobAction={onJobAction}
                  onOpenDuties={() => setShowDutiesModal(true)}
                  onOpenCoworkers={() => setCurrentView('coworkers_view')}
                  onOpenEducation={() => {
                    onClose();
                    onOpenEducation();
                  }}
                  onOpenExploreJobs={() => setCurrentView('jobs_catalog')}
                  onUpdateJobState={(updatedJob) => {
                    onApplyJob(updatedJob);
                  }}
                  onShowFeedback={(msg, type) => {
                    setAlertModal({
                      title: type === 'error' ? 'Notice' : 'Command Update',
                      message: msg,
                      type: type || 'success'
                    });
                  }}
                  onUpdateExecutiveState={onUpdateExecutiveState}
                  onGrantPersonalCash={onGrantPersonalCash}
                />
              ) : (
                /* Unemployed View - Traditional All Occupations List (No Top Sub-Tabs) */
                <div className="space-y-3 pb-4">
                  <div className="divide-y divide-slate-200 bg-white">
                    {/* Active School Entry */}
                    {inSchool && (
                      <div
                        onClick={() => {
                          onClose();
                          onOpenEducation();
                        }}
                        className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🏫</span>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">Public {education.level} School</div>
                            <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                              <span className="font-bold text-slate-600">Grades</span>
                              <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                                <div className="bg-emerald-500 h-full" style={{ width: `${grades}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}

                    {/* Education & Completed Degrees Entry */}
                    {(() => {
                      const rawList = education.details?.completedDegrees || (
                        education.details?.highestCompleted ? [education.details.highestCompleted] : []
                      );
                      const completedList = sanitizeCompletedDegrees(rawList);
                      const highestDegree = completedList.length > 0 ? completedList[completedList.length - 1] : null;

                      return (
                        <div
                          onClick={() => {
                            onClose();
                            onOpenEducation();
                          }}
                          className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group bg-white border-b border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🎓</span>
                            <div>
                              <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                                <span>Education & Qualifications</span>
                                {completedList.length > 0 && (
                                  <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-indigo-200">
                                    {completedList.length} Degree{completedList.length > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                                {highestDegree ? (
                                  <span className="text-emerald-700 font-bold">
                                    Highest: {formatShortDegreeTitle(highestDegree)} • Tap to manage
                                  </span>
                                ) : (
                                  'No degrees earned • Tap to view higher education'
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      );
                    })()}
                  </div>

                  {/* ALL OCCUPATIONS LIST HEADER */}
                  <div className="bg-[#6f7e8e] text-white text-[11px] font-extrabold uppercase py-1 px-4 text-center tracking-wider">
                    All Occupations
                  </div>

                  <div className="divide-y divide-slate-200 bg-white">
                    {/* Freelance Gigs */}
                    <div
                      onClick={() => handleCategoryClick('freelance')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🧢</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">Freelance Gigs</div>
                          <div className="text-[11px] text-slate-500">Make some quick pocket money</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Jobs & Career Ladders */}
                    <div
                      onClick={() => handleCategoryClick('jobs_catalog')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💵</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">Jobs & Career Ladders</div>
                          <div className="text-[11px] text-slate-500">Browse full-time career listings & ranks</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Education & Higher Learning */}
                    <div
                      onClick={() => {
                        onClose();
                        onOpenEducation();
                      }}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎓</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">Education & Higher Learning</div>
                          <div className="text-[11px] text-slate-500">Apply for university, graduate, medical, or law school</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Military Service */}
                    <div
                      onClick={() => handleCategoryClick('military')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🛡️</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">Military Service</div>
                          <div className="text-[11px] text-slate-500">Enlist in the Army, Navy, Air Force, or Marines</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Part-Time Jobs */}
                    <div
                      onClick={() => handleCategoryClick('part_time')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🕒</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">Part-Time Jobs</div>
                          <div className="text-[11px] text-slate-500">Browse hourly student job listings</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Special Careers */}
                    <div
                      onClick={() => handleCategoryClick('special')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎩</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">Special Careers</div>
                          <div className="text-[11px] text-slate-500">Actor, Musician, Athlete, Politician</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: JOBS & CAREER LADDERS CATALOG */}
          {currentView === 'jobs_catalog' && (
            <div className="p-3 space-y-2.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-wide">Civilian Career Openings</h3>
                    <p className="text-[10px] text-slate-500">Select any career field to view details, apply, or inspect rank progression.</p>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    onClick={() => setJobFilter('all')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
                      jobFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Civilian Careers ({CAREER_PATHS.filter(p => p.category !== 'Military').length})
                  </button>
                  <button
                    onClick={() => setJobFilter('qualified')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                      jobFilter === 'qualified'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" /> Qualified Only
                  </button>
                </div>
              </div>

              {/* Career Paths List */}
              <div className="space-y-2">
                {CAREER_PATHS.filter(p => p.category !== 'Military').map((path) => {
                  const entryTier = path.tiers[0];
                  const topTier = path.tiers[path.tiers.length - 1];
                  const eduCheck = entryTier.reqDegree ? checkEducationQualification(character, entryTier.reqDegree) : { qualified: true };
                  const smartsOk = !entryTier.reqSmarts || stats.smarts >= entryTier.reqSmarts;
                  const isQualified = isPrivileged || (eduCheck.qualified && smartsOk);

                  if (jobFilter === 'qualified' && !isQualified) return null;

                  return (
                    <div
                      key={path.id}
                      className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-400 transition flex items-center justify-between gap-2.5"
                    >
                      {/* Left side: Icon + Title + Info */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 border border-slate-200/60 shadow-2xs">
                          {path.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-xs truncate">{path.name}</span>
                            {path.isSpecialFame && (
                              <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.2 rounded">FAME</span>
                            )}
                            {isPrivileged ? (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[8px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5 text-amber-700" /> Supreme Clearance
                              </span>
                            ) : isQualified ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Qualified
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-[8px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Locked
                              </span>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                            Entry: <span className="font-bold text-slate-800">{entryTier.title}</span> ({formatMoney(entryTier.salary)}/yr)
                            {entryTier.reqDegree && <span className="text-slate-400 ml-1">• {entryTier.reqDegree}</span>}
                          </div>

                          <div className="text-[9px] text-purple-700 font-bold truncate">
                            Top: {topTier.title} ({formatMoney(topTier.salary)}/yr)
                          </div>
                        </div>
                      </div>

                      {/* Right side: Action buttons */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => openJobDetailsTab(path, entryTier)}
                          className={`${
                            isPrivileged 
                              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black border border-amber-600' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white font-black'
                          } text-[10px] px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition text-center`}
                        >
                          {isPrivileged ? '👑 Appoint' : 'Apply'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCareerPath(path);
                            setCurrentView('career_path_view');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] px-2 py-0.5 rounded-md border border-slate-300 text-center"
                        >
                          Ladder ({path.tiers.length})
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 3: CAREER PATH LADDER VISUALIZATION */}
          {currentView === 'career_path_view' && selectedCareerPath && (
            <div className="p-3 space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center relative">
                <span className="text-3xl">{selectedCareerPath.icon}</span>
                <h3 className="font-black text-slate-900 text-sm uppercase mt-1">{selectedCareerPath.name}</h3>
                <p className="text-[10px] text-slate-500">Official Career Ladder & Progression Hierarchy</p>
                <div className="text-[10px] font-bold text-blue-600 mt-0.5">
                  Employer: {getEmployerForCity(selectedCareerPath, city)}
                </div>
              </div>

              {/* Ranks Ladder Steps */}
              <div className="space-y-2 relative">
                <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-blue-200 -z-0" />

                {selectedCareerPath.tiers.map((tier, idx) => {
                  const isCurrentJobRank = currentJob && currentJob.title === tier.title;
                  const isEntry = idx === 0;

                  return (
                    <div
                      key={idx}
                      className={`relative z-10 p-2.5 rounded-xl border transition ${
                        isCurrentJobRank
                          ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                          : 'bg-white border-slate-200 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow-2xs ${
                            isCurrentJobRank ? 'bg-emerald-600' : 'bg-blue-600'
                          }`}>
                            {tier.rankLevel}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 flex-wrap">
                              <span className="truncate">{tier.title}</span>
                              {isCurrentJobRank && (
                                <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">
                                  Current
                                </span>
                              )}
                              {isEntry ? (
                                <span className="bg-blue-100 text-blue-800 text-[8px] font-black px-1.5 py-0.2 rounded">
                                  Entry Rank
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 text-[8px] font-black px-1.5 py-0.2 rounded">
                                  Promotion
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] text-emerald-600 font-extrabold mt-0.5 flex items-center gap-2">
                              <span>{formatMoney(tier.salary)} / yr</span>
                              {tier.reqYearsInPrevRank && (
                                <span className="text-[9px] text-slate-400 font-semibold">
                                  • Req {tier.reqYearsInPrevRank} yrs experience
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => openJobDetailsTab(selectedCareerPath, tier)}
                          className={`${
                            isPrivileged 
                              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black border border-amber-600' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white font-black'
                          } text-[10px] px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition shrink-0 flex items-center gap-1`}
                        >
                          {isPrivileged && <Crown className="w-3 h-3 text-slate-950" />}
                          <span>{isPrivileged ? `Take Rank ${tier.rankLevel}` : 'Inspect'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 4: DEDICATED JOB DETAILS TAB VIEW (Replaces Popup Card) */}
          {currentView === 'job_details' && selectedJobDetail && (
            <div className="p-3 space-y-3">
              {/* Top Banner Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-3xl shadow-inner">
                  {selectedJobDetail.path.icon}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedJobDetail.tier.title}</h3>
                  <div className="text-xs font-extrabold text-blue-600">{selectedJobDetail.employer}</div>
                  <div className="text-xs font-black text-emerald-600 mt-1">{formatMoney(selectedJobDetail.tier.salary)} / year</div>
                </div>
              </div>

              {/* Requirement Qualification Status Badge */}
              {(() => {
                const tierIdx = selectedJobDetail.path.tiers.findIndex(t => t.title === selectedJobDetail.tier.title);
                const isEntryRole = tierIdx === 0;
                const eduQual = selectedJobDetail.tier.reqDegree 
                  ? checkEducationQualification(character, selectedJobDetail.tier.reqDegree)
                  : { qualified: true };
                const smartsQual = !selectedJobDetail.tier.reqSmarts || stats.smarts >= selectedJobDetail.tier.reqSmarts;
                const ageQual = age >= (selectedJobDetail.path.minAge || 18);
                const isCurrentlyInPath = currentJob && (currentJob.careerPathId === selectedJobDetail.path.id || currentJob.category === selectedJobDetail.path.category);
                const isLadderOk = isEntryRole || isCurrentlyInPath;
                const isAllQualified = isPrivileged || (eduQual.qualified && smartsQual && ageQual && isLadderOk);

                if (isPrivileged) {
                  return (
                    <div className="p-3 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-950 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs">
                          <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>SUPREME APPOINTMENT CLEARANCE</span>
                        </div>
                        <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                          No Limits
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
                        As a <strong>{isProvisionalGovernor ? 'Provisional Military Governor' : 'Retired General / Flag Officer'}</strong>, you possess absolute qualification clearance. You may assume <strong>{selectedJobDetail.tier.title} (Rank {selectedJobDetail.tier.rankLevel})</strong> at {selectedJobDetail.employer} directly without degree, age, smarts, or career ladder prerequisites.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className={`p-3 rounded-xl border text-xs font-semibold leading-relaxed ${
                    isAllQualified
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    {isAllQualified ? (
                      <div className="flex items-center gap-2 font-bold text-emerald-700">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>You meet all educational, age, and background requirements for this position!</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                          <Lock className="w-4 h-4 shrink-0" />
                          <span>Qualification & Ladder Notice:</span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] space-y-0.5">
                          {!isEntryRole && !isCurrentlyInPath && (
                            <li className="font-bold text-amber-800">
                              Ladder Gate: Cannot apply directly for Rank {selectedJobDetail.tier.rankLevel}. You must start at entry rank ({selectedJobDetail.path.tiers[0].title}) and earn promotions!
                            </li>
                          )}
                          {!eduQual.qualified && <li>Missing requirement: {selectedJobDetail.tier.reqDegree} degree</li>}
                          {!smartsQual && <li>Smarts too low (Requires {selectedJobDetail.tier.reqSmarts}% Smarts, you have {stats.smarts}%)</li>}
                          {!ageQual && <li>Must be at least {selectedJobDetail.path.minAge || 18} years old</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Data Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs font-semibold shadow-sm">
                <div className="flex items-center justify-between p-2.5 bg-slate-50">
                  <span className="font-extrabold text-slate-700">Job Title</span>
                  <span className="font-black text-slate-900">{selectedJobDetail.tier.title}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white">
                  <span className="font-extrabold text-slate-700">Career Field</span>
                  <span className="font-black text-slate-900">{selectedJobDetail.path.name}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50">
                  <span className="font-extrabold text-slate-700">Employer</span>
                  <span className="font-black text-slate-900 text-right">{selectedJobDetail.employer}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white">
                  <span className="font-extrabold text-slate-700">Salary</span>
                  <span className="font-black text-emerald-600">{formatMoney(selectedJobDetail.tier.salary)} / yr</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50">
                  <span className="font-extrabold text-slate-700">Experience Needed</span>
                  <span className="font-black text-slate-900">
                    {selectedJobDetail.tier.rankLevel > 1 ? `Rank ${selectedJobDetail.tier.rankLevel - 1} Rank Level` : 'Entry Level'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-white">
                  <span className="font-extrabold text-slate-700">Education Needed</span>
                  <span className="font-black text-slate-900">
                    {selectedJobDetail.tier.reqDegree || 'None'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedJobDetail.tier.description && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium leading-relaxed">
                  {selectedJobDetail.tier.description}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleApplyJobPosition}
                  className={`w-full ${
                    isPrivileged
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 border border-amber-400 font-black'
                      : 'bg-[#0c52a1] hover:bg-blue-700 text-white font-black'
                  } py-3 rounded-xl shadow transition active:scale-95 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer`}
                >
                  {isPrivileged && <Crown className="w-4 h-4 text-slate-950" />}
                  <span>{isPrivileged ? `👑 Appoint Self as ${selectedJobDetail.tier.title} (Instant Hire)` : 'Apply for this position'}</span>
                </button>

                <button
                  onClick={() => {
                    if (selectedCareerPath) setCurrentView('career_path_view');
                    else setCurrentView('jobs_catalog');
                  }}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl text-xs"
                >
                  Back to Careers
                </button>
              </div>
            </div>
          )}

          {/* VIEW 5: CURRENT JOB ACTIVITIES & MANAGEMENT */}
          {currentView === 'current_job_activities' && currentJob && (
            <div className="p-3 space-y-3">
              {/* Top Job Header Card */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-slate-100 rounded-xl">
                      {currentJob.category === 'Legal' ? '⚖️' : currentJob.category === 'Military' ? '🎖️' : currentJob.category === 'Medical' ? '🩺' : '💼'}
                    </span>
                    <div>
                      <div className="font-black text-slate-900 text-sm">{currentJob.title}</div>
                      <div className="text-xs text-slate-500 font-bold">{currentJob.company}</div>
                      <div className="text-xs text-emerald-600 font-extrabold">{formatMoney(currentJob.salary)}/year</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const match = findCareerPathByJobTitle(currentJob.title);
                      if (match) {
                        openJobDetailsTab(match.path, match.path.tiers[match.tierIndex]);
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-sm border border-slate-300"
                  >
                    ···
                  </button>
                </div>

                {/* Performance Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Performance</span>
                    <span className="text-emerald-600">{currentJob.performance}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${currentJob.performance}%` }} />
                  </div>
                </div>

                {/* Years in role */}
                <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between pt-0.5">
                  <span>Tenure: {currentJob.yearsInRole} year{currentJob.yearsInRole === 1 ? '' : 's'} in position</span>
                  <button
                    onClick={() => {
                      const match = findCareerPathByJobTitle(currentJob.title);
                      if (match) {
                        setSelectedCareerPath(match.path);
                        setCurrentView('career_path_view');
                      }
                    }}
                    className="text-blue-600 font-bold underline"
                  >
                    View Career Ladder
                  </button>
                </div>
              </div>

              {/* Section Header: Activities */}
              <div className="bg-[#6f7e8e] text-white text-[10px] font-extrabold uppercase py-1 px-3 text-center tracking-wider rounded-lg">
                Activities
              </div>

              {/* Activities List Options */}
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                {/* 0. Official Duties & Storylines */}
                <div
                  onClick={() => setShowDutiesModal(true)}
                  className="p-3.5 hover:bg-amber-50/80 transition cursor-pointer flex items-center justify-between group bg-amber-50/50 border-b border-amber-200/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-amber-100 rounded-xl border border-amber-200">
                      {currentJob.category === 'Legal' ? '⚖️' : currentJob.category === 'Military' ? '🎖️' : currentJob.category === 'Medical' ? '🩺' : currentJob.category === 'Tech' ? '💻' : '📜'}
                    </span>
                    <div>
                      <div className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                        <span>Perform Official Duties</span>
                        <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">
                          Storyline
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-800 font-medium">
                        {currentJob.category === 'Legal' ? 'Pass judgments, rule on motions & press conferences' :
                         currentJob.category === 'Military' ? 'Execute strategic orders, defense strikes & military readiness' :
                         currentJob.category === 'Medical' ? 'Perform trauma surgeries, ER crisis & clinical approvals' :
                         currentJob.category === 'Tech' ? 'Handle zero-day cyber attacks & server infrastructure' :
                         'Execute high-level official duties and role-specific actions'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* 1. Co-Workers */}
                <div
                  onClick={() => setCurrentView('coworkers_view')}
                  className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧑‍💼</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">Co-Workers</div>
                      <div className="text-[10px] text-slate-500">View team members and your supervisor</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* 2. Hours */}
                <div
                  onClick={() => setShowWorkingHoursModal(true)}
                  className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">Hours</div>
                      <div className="text-[10px] text-slate-500">Adjust your weekly working hours</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* 3. Human Resources */}
                <div
                  onClick={() => setShowHrModal(true)}
                  className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📢</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">Human Resources</div>
                      <div className="text-[10px] text-slate-500">Report someone to HR</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* 4. Resign (Non-Retired Only) */}
                {!isRetiredJob && (
                  <div
                    onClick={() => setShowResignModal(true)}
                    className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👏</span>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs text-red-600">Resign</div>
                        <div className="text-[10px] text-slate-500">Tender your resignation</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}

                {/* 5. Retire (Non-Retired Only) */}
                {!isRetiredJob && (
                  <div
                    onClick={() => setShowRetirementModal(true)}
                    className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚩</span>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">Retire</div>
                        <div className="text-[10px] text-slate-500">Consider pension & retirement</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}

                {/* 6. Work Harder */}
                <div
                  onClick={handleWorkHarder}
                  className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">Work Harder</div>
                      <div className="text-[10px] text-slate-500">Put in extra effort for performance</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                {/* 7. Request Promotion */}
                <div
                  onClick={handleRequestPromotion}
                  className="p-3 hover:bg-[#f0f9ff] transition cursor-pointer flex items-center justify-between group bg-sky-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📈</span>
                    <div>
                      <div className="font-extrabold text-blue-900 text-xs">Request Promotion</div>
                      <div className="text-[10px] text-blue-600 font-semibold">Ask supervisor to climb the career ladder</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: CO-WORKERS & SUPERVISOR */}
          {currentView === 'coworkers_view' && currentJob && (
            <div className="p-3 space-y-3">
              <div className="bg-[#0c52a1] text-white p-3 rounded-xl shadow-sm text-center">
                <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">WORKPLACE</div>
                <h3 className="font-black text-sm uppercase text-white mt-0.5">{currentJob.company}</h3>
              </div>

              {/* Section 1: Supervisor */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-1">
                  Supervisor
                </div>

                {currentJob.supervisor ? (
                  <div
                    onClick={() => setSelectedCoworker(currentJob.supervisor || null)}
                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentJob.supervisor.avatarIcon}</span>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{currentJob.supervisor.name}</span>
                          <span className="bg-purple-100 text-purple-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                            Supervisor
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">{currentJob.supervisor.role}</div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] text-slate-500 font-bold">Relationship</span>
                          <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                            <div className="bg-emerald-500 h-full" style={{ width: `${currentJob.supervisor.relationship}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-500 font-bold text-center">
                    No active supervisor assigned.
                  </div>
                )}
              </div>

              {/* Section 2: Team Members */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-1">
                  Team Members / Co-Workers
                </div>

                {currentJob.coworkers && currentJob.coworkers.length > 0 ? (
                  currentJob.coworkers.map((cw) => (
                    <div
                      key={cw.id}
                      onClick={() => setSelectedCoworker(cw)}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cw.avatarIcon}</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">{cw.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{cw.role}</div>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] text-slate-500 font-bold">Relationship</span>
                            <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                              <div className="bg-emerald-500 h-full" style={{ width: `${cw.relationship}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-500 font-bold text-center">
                    No co-workers in your immediate team.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-VIEW: FREELANCE GIGS */}
          {currentView === 'freelance' && (
            <div className="p-3 space-y-2">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-xs uppercase">Freelance Gigs (Age 12+)</h3>
                <p className="text-[10px] text-slate-500">Earn quick pocket cash immediately.</p>
              </div>

              {[
                { name: 'Dog Walker', pay: 20, icon: '🐕' },
                { name: 'Lawn Mower', pay: 35, icon: '🚜' },
                { name: 'Babysitter', pay: 25, icon: '👶' },
                { name: 'Tutor Student', pay: 40, icon: '📚' },
                { name: 'Newspaper Route', pay: 18, icon: '📰' }
              ].map((gig, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{gig.icon}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{gig.name}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">Earns {formatMoney(gig.pay)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDoFreelance(gig.name, gig.pay)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-3 py-1.5 rounded-lg shadow active:scale-95 transition"
                  >
                    Do It
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUB-VIEW: PART-TIME JOBS */}
          {currentView === 'part_time' && (
            <div className="p-3 space-y-2">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-xs uppercase">Part-Time Jobs (Age 14+)</h3>
                <p className="text-[10px] text-slate-500">Hourly jobs for students and youth.</p>
              </div>

              {[
                { title: 'Supermarket Cashier', rate: '$12/hr', pay: 6500, icon: '🛒' },
                { title: 'Café Barista Assistant', rate: '$14/hr', pay: 7200, icon: '☕' },
                { title: 'Restaurant Dishwasher', rate: '$11/hr', pay: 5800, icon: '🍽️' },
                { title: 'Library Assistant', rate: '$15/hr', pay: 8000, icon: '📖' }
              ].map((job, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{job.icon}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{job.title}</div>
                      <div className="text-[10px] text-slate-500">{job.rate} • Est. {formatMoney(job.pay)}/yr</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onApplyJob({
                        id: 'pt_' + Date.now(),
                        title: job.title,
                        company: 'Part-Time Co.',
                        salary: job.pay,
                        reqSmarts: 10,
                        category: 'Service',
                        performance: 50,
                        yearsInRole: 0
                      });
                      setAlertModal({
                        title: 'Part-Time Job Hired!',
                        message: `You were hired as a part-time ${job.title}!`,
                        type: 'success'
                      });
                      setCurrentView('main');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] px-3 py-1.5 rounded-lg shadow active:scale-95 transition"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUB-VIEW: MILITARY SERVICE */}
          {currentView === 'military' && (
            <div className="p-3 space-y-2">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-wide">Military Armed Forces Enlistment</h3>
                <p className="text-[10px] text-slate-500">Enlist in the Armed Forces to serve your nation and earn military rank promotions.</p>
              </div>

              {CAREER_PATHS.filter(p => p.category === 'Military').map((milPath) => {
                const entryRank = milPath.tiers[0];
                const topRank = milPath.tiers[milPath.tiers.length - 1];

                return (
                  <div key={milPath.id} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 transition flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 border border-slate-200/60 shadow-2xs">
                        {milPath.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-xs truncate">{milPath.name}</span>
                          {isPrivileged && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[8px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <Crown className="w-2.5 h-2.5 text-amber-700" /> Supreme Authority
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">
                          Entry: <span className="font-bold text-slate-800">{entryRank.title}</span> ({formatMoney(entryRank.salary)}/yr)
                        </div>
                        <div className="text-[9px] text-emerald-700 font-bold truncate">
                          Top Rank: {topRank.title} ({formatMoney(topRank.salary)}/yr)
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => openJobDetailsTab(milPath, entryRank)}
                        className={`${
                          isPrivileged
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-600 font-black'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white font-black'
                        } text-[10px] px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition text-center`}
                      >
                        {isPrivileged ? '👑 Enlist' : 'Enlist'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCareerPath(milPath);
                          setCurrentView('career_path_view');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] px-2 py-0.5 rounded-md border border-slate-300 text-center"
                      >
                        Ranks ({milPath.tiers.length})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SUB-VIEW: SPECIAL CAREERS */}
          {currentView === 'special' && (
            <div className="p-3 space-y-2">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-xs uppercase">Special Careers</h3>
                <p className="text-[10px] text-slate-500">Pursue fame, stardom, and fortune.</p>
              </div>

              {[
                { name: 'Hollywood Stardom & Acting', icon: '🎬', pathId: 'creative_actor' },
                { name: 'Musician / Pop Recording Artist', icon: '🎤', pathId: 'creative_actor' },
                { name: 'Professional Athlete', icon: '⚽', pathId: 'creative_actor' },
                { name: 'Politician / Political Office', icon: '🏛️', pathId: 'creative_actor' }
              ].map((spec, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{spec.icon}</span>
                    <div className="font-extrabold text-slate-900 text-xs">{spec.name}</div>
                  </div>

                  <button
                    onClick={() => {
                      const actorPath = CAREER_PATHS.find(p => p.id === 'creative_actor');
                      if (actorPath) openJobDetailsTab(actorPath, actorPath.tiers[0]);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] px-3 py-1.5 rounded-lg shadow active:scale-95 transition"
                  >
                    Audition
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      {/* POPUP 1: WORKING HOURS & OVERTIME MODAL */}
      {showWorkingHoursModal && currentJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-300 p-5 space-y-4 text-center">
            <span className="text-3xl">⏳</span>
            <h3 className="text-base font-black text-slate-900">Adjust Working Hours</h3>
            <p className="text-xs text-slate-600">Select weekly hours for {currentJob.title}:</p>

            <div className="grid grid-cols-2 gap-2">
              {[30, 40, 50, 60].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => {
                    const stressDelta = hrs === 30 ? 10 : hrs === 40 ? 25 : hrs === 50 ? 55 : 85;
                    currentJob.hoursPerWeek = hrs;
                    currentJob.stress = stressDelta;
                    setShowWorkingHoursModal(false);
                    setAlertModal({
                      title: 'Hours Updated',
                      message: `You set your schedule to ${hrs} hours per week. Calculated Stress: ${stressDelta}%.`,
                      type: 'info'
                    });
                  }}
                  className={`py-2.5 px-3 rounded-xl font-black text-xs border transition ${
                    (currentJob.hoursPerWeek || 40) === hrs
                      ? 'bg-blue-600 text-white border-blue-700 shadow'
                      : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {hrs} Hours/Wk
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowWorkingHoursModal(false)}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* POPUP 2: RESIGNATION CONFIRMATION */}
      {showResignModal && currentJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl border-2 border-red-500 p-5 space-y-4 text-center">
            <span className="text-4xl">👏</span>
            <h3 className="text-base font-black text-red-600">Tender Resignation</h3>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              Are you sure you want to resign from your position as <strong>{currentJob.title}</strong> for <strong>{currentJob.company}</strong>?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowResignModal(false);
                  onJobAction('quit');
                  setAlertModal({ title: 'Resigned', message: `You officially resigned from ${currentJob.company}.`, type: 'info' });
                  setCurrentView('main');
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow text-xs uppercase"
              >
                Yes, Resign Immediately
              </button>
              <button
                onClick={() => setShowResignModal(false)}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 3: RETIREMENT MODAL */}
      {showRetirementModal && currentJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl border-2 border-slate-300 p-5 space-y-3 text-center">
            <span className="text-4xl">🌴</span>
            <h3 className="text-base font-black text-slate-900">Consider Retirement</h3>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              {currentJob.yearsInRole >= 20 || age >= 65
                ? `You are eligible to retire with a lifetime pension of ${formatMoney(Math.round(currentJob.salary * 0.6))}/year!`
                : `You are not currently eligible for a full pension. Full pension requires at least 20 years with ${currentJob.company} or reaching age 65.`}
            </p>

            {(currentJob.yearsInRole >= 20 || age >= 65) && (
              <button
                onClick={() => {
                  setShowRetirementModal(false);
                  const pensionPay = Math.round(currentJob.salary * 0.6);
                  onApplyJob({
                    ...currentJob,
                    title: `${currentJob.title} (Retired)`,
                    company: `State & Corporate Pension Fund`,
                    salary: pensionPay,
                    isRetired: true,
                    pensionAmount: pensionPay,
                    performance: 100
                  });
                  setAlertModal({
                    title: 'Retired!',
                    message: `Congratulations on your retirement! You will now receive ${formatMoney(pensionPay)}/year in pension income.`,
                    type: 'success'
                  });
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase shadow transition active:scale-95"
              >
                🌴 Retire & Collect Pension
              </button>
            )}

            <button
              onClick={() => setShowRetirementModal(false)}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs"
            >
              Cancel / Stay Employed
            </button>
          </div>
        </div>
      )}

      {/* POPUP 4: HR REPORT MODAL */}
      {showHrModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl border-2 border-slate-300 p-5 space-y-4 text-center">
            <span className="text-4xl">📢</span>
            <h3 className="text-base font-black text-slate-900">Human Resources</h3>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              No luck: You can't come up with a legitimate reason to report anyone to HR right now.
            </p>
            <button
              onClick={() => setShowHrModal(false)}
              className="w-full bg-[#0c52a1] text-white font-black py-2 rounded-xl text-xs uppercase"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* POPUP 5: CO-WORKER INTERACTION MODAL */}
      {selectedCoworker && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[310px] rounded-2xl shadow-2xl border-2 border-slate-300 p-5 space-y-3 text-center">
            <span className="text-4xl">{selectedCoworker.avatarIcon}</span>
            <h3 className="text-sm font-black text-slate-900">{selectedCoworker.name}</h3>
            <p className="text-xs text-slate-500 font-bold">{selectedCoworker.role}</p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => handleInteractCoworker(selectedCoworker, 'compliment')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300"
              >
                <span>👏</span> Compliment
              </button>
              <button
                onClick={() => handleInteractCoworker(selectedCoworker, 'coffee')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300"
              >
                <span>☕</span> Bring Coffee
              </button>
              <button
                onClick={() => handleInteractCoworker(selectedCoworker, 'work_together')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300"
              >
                <span>🤝</span> Work Together
              </button>
              {selectedCoworker.isBoss && (
                <button
                  onClick={() => handleInteractCoworker(selectedCoworker, 'flatter')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                >
                  <span>👑</span> Flatter Boss
                </button>
              )}
              <button
                onClick={() => setSelectedCoworker(null)}
                className="w-full bg-slate-200 text-slate-700 font-bold py-1.5 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Career Duty Modal Overlay */}
      {showDutiesModal && (
        <CareerDutyModal
          state={state}
          completedDutyIds={(state.character as any).completedDutyIds || []}
          onClose={() => setShowDutiesModal(false)}
          onApplyDutyOutcome={(scenario, option) => {
            if (onApplyDutyOutcome) {
              onApplyDutyOutcome(scenario, option);
            }
          }}
        />
      )}

      {/* BitLife General Alert Pop-up Modal */}
      {alertModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[300px] rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-300 text-center p-5 space-y-3">
            <h3 className={`text-lg font-black ${alertModal.type === 'error' ? 'text-red-600' : alertModal.type === 'success' ? 'text-emerald-600' : 'text-blue-600'}`}>
              {alertModal.title}
            </h3>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {alertModal.message}
            </p>
            <button
              onClick={() => setAlertModal(null)}
              className="w-full bg-[#0c52a1] hover:bg-blue-700 text-white font-black py-2 rounded-xl shadow transition active:scale-95 text-xs uppercase"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
