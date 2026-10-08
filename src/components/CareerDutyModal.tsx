import React, { useState, useMemo } from 'react';
import { GameState } from '../types';
import { CareerDutyScenario, CareerDutyOption, getDutiesForJob, getEffectiveJobRank, CAREER_DUTIES_DATABASE } from '../data/careerDutiesData';
import { formatMoney } from '../utils/gameUtils';
import { X, CheckCircle2, ChevronRight, Sparkles, Scale, Crosshair, Stethoscope, Laptop, Siren, Award, RefreshCw, AlertCircle } from 'lucide-react';

interface CareerDutyModalProps {
  state: GameState;
  onClose: () => void;
  onApplyDutyOutcome: (
    scenario: CareerDutyScenario,
    option: CareerDutyOption
  ) => void;
  completedDutyIds?: string[];
}

export const CareerDutyModal: React.FC<CareerDutyModalProps> = ({
  state,
  onClose,
  onApplyDutyOutcome,
  completedDutyIds = []
}) => {
  const { currentJob } = state.character;

  if (!currentJob) return null;

  const calculatedRank = getEffectiveJobRank(currentJob.title, currentJob.currentTierIndex ?? 0);

  // Filter scenarios strictly by job title, category AND current rank
  const allEligibleScenarios = useMemo(() => {
    const list = getDutiesForJob(currentJob.title, currentJob.category, currentJob.currentTierIndex ?? 0);
    if (list.length > 0) return list;

    // Safe fallback strictly within calculatedRank limits
    return CAREER_DUTIES_DATABASE.filter(s => 
      (s.minRankLevel ?? 1) <= calculatedRank && 
      (s.maxRankLevel ?? 5) >= calculatedRank &&
      (s.category === currentJob.category || s.category === 'General')
    );
  }, [currentJob.title, currentJob.category, currentJob.currentTierIndex, calculatedRank]);

  // Exclude already completed scenarios unless all available for rank have been completed
  const uncompletedScenarios = useMemo(() => {
    const fresh = allEligibleScenarios.filter(s => !completedDutyIds.includes(s.id));
    return fresh.length > 0 ? fresh : allEligibleScenarios; // Reset cycle if all completed
  }, [allEligibleScenarios, completedDutyIds]);

  // Pick 2-3 random active duty scenarios per session
  const [activeScenarios] = useState<CareerDutyScenario[]>(() => {
    const shuffled = [...uncompletedScenarios].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, shuffled.length));
  });

  const [selectedDuty, setSelectedDuty] = useState<CareerDutyScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<CareerDutyOption | null>(null);
  const [outcomeApplied, setOutcomeApplied] = useState(false);

  const handleChooseOption = (option: CareerDutyOption) => {
    setSelectedOption(option);
    setOutcomeApplied(true);
    if (selectedDuty) {
      onApplyDutyOutcome(selectedDuty, option);
    }
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Legal':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Military':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Medical':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Tech':
      case 'Corporate':
      case 'Executive':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Public Service':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto w-full h-full bg-slate-950/70 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-3 animate-in fade-in duration-150 select-none">
      <div className="bg-white border-t sm:border border-slate-200 sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl text-slate-800">
        
        {/* Header Bar - Light Consistent Theme */}
        <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-lg shrink-0">
              {currentJob.category === 'Legal' ? '⚖️' : currentJob.category === 'Military' ? '🎖️' : currentJob.category === 'Medical' ? '🩺' : '💼'}
            </div>
            <div>
              <div className="text-[9px] font-black text-blue-600 uppercase tracking-wider">
                Official Duties • Rank {calculatedRank}
              </div>
              <h2 className="text-xs font-black text-slate-800 truncate max-w-[200px]">
                {currentJob.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-3 overflow-y-auto flex-1 space-y-3">
          
          {/* STEP 1: SELECT ACTIVE DUTY SCENARIO */}
          {!selectedDuty && (
            <div className="space-y-2.5">
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-0.5">
                <div className="font-extrabold flex items-center gap-1 text-xs text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Available Duty Assignments</span>
                </div>
                <p className="text-[10px] text-amber-800 font-medium leading-tight">
                  Randomly selected for your current rank (<strong className="text-amber-950">{currentJob.title}</strong>). Choose an assignment to execute.
                </p>
              </div>

              {activeScenarios.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs font-medium space-y-1">
                  <p>No active duty scenarios available for this rank right now.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeScenarios.map((duty) => (
                    <div
                      key={duty.id}
                      onClick={() => setSelectedDuty(duty)}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 transition cursor-pointer flex items-center justify-between gap-2.5 group active:scale-[0.99] shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                          {duty.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-slate-800 text-xs truncate">{duty.title}</span>
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border ${getCategoryBadgeStyle(duty.category)}`}>
                              {duty.category}
                            </span>
                          </div>
                          {duty.subtitle && (
                            <div className="text-[9px] text-slate-500 font-semibold truncate">
                              {duty.subtitle}
                            </div>
                          )}
                          <div className="text-[9px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {duty.description}
                          </div>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DUTY SCENARIO IN PROGRESS / OUTCOME */}
          {selectedDuty && (
            <div className="space-y-2.5 animate-in fade-in duration-150">
              
              {!outcomeApplied && (
                <button
                  onClick={() => setSelectedDuty(null)}
                  className="text-[10px] font-extrabold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1 inline-block"
                >
                  ← Back to Assignments
                </button>
              )}

              {/* Scenario Card */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    {selectedDuty.icon}
                  </span>
                  <div>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border uppercase ${getCategoryBadgeStyle(selectedDuty.category)}`}>
                      {selectedDuty.category} Duty
                    </span>
                    <h3 className="font-black text-slate-800 text-xs mt-0.5">{selectedDuty.title}</h3>
                    {selectedDuty.subtitle && (
                      <div className="text-[10px] font-bold text-slate-500">{selectedDuty.subtitle}</div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 font-medium leading-snug bg-white p-2.5 rounded-lg border border-slate-200">
                  {selectedDuty.description}
                </p>

                {/* Details Box */}
                {selectedDuty.detailsBox && (
                  <div className="bg-slate-100/80 rounded-lg p-2 border border-slate-200 space-y-1">
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-wider">
                      {selectedDuty.detailsBox.label}
                    </div>
                    <div className="grid grid-cols-1 gap-0.5 text-[10px]">
                      {selectedDuty.detailsBox.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-500 font-medium">{item.key}:</span>
                          <span className="font-bold text-slate-800 text-right">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* OUTCOME DISPLAY */}
              {outcomeApplied && selectedOption && (
                <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-300 shadow-2xs space-y-2 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{selectedOption.resultTitle}</span>
                  </div>

                  <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                    {selectedOption.resultText}
                  </p>

                  {/* Impact Badges */}
                  <div className="bg-white p-2 rounded-lg border border-emerald-200 text-[10px] space-y-1">
                    <div className="font-black text-slate-400 uppercase tracking-wider text-[8px]">Outcome Impact</div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedOption.jobPerformanceChange && (
                        <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                          selectedOption.jobPerformanceChange > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          Performance: {selectedOption.jobPerformanceChange > 0 ? '+' : ''}{selectedOption.jobPerformanceChange}%
                        </span>
                      )}
                      {selectedOption.moneyChange && (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-1.5 py-0.2 rounded text-[9px]">
                          Income: +{formatMoney(selectedOption.moneyChange)}
                        </span>
                      )}
                      {selectedOption.statChanges?.fame && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 font-bold px-1.5 py-0.2 rounded text-[9px]">
                          Fame: +{selectedOption.statChanges.fame}%
                        </span>
                      )}
                      {selectedOption.statChanges?.karma && (
                        <span className="bg-sky-100 text-sky-800 border border-sky-200 font-bold px-1.5 py-0.2 rounded text-[9px]">
                          Karma: {selectedOption.statChanges.karma > 0 ? '+' : ''}{selectedOption.statChanges.karma}%
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 rounded-lg shadow-2xs transition active:scale-95 text-xs uppercase"
                  >
                    Complete Official Duty
                  </button>
                </div>
              )}

              {/* OPTIONS LIST */}
              {!outcomeApplied && (
                <div className="space-y-1.5">
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Select Ruling / Action:
                  </div>

                  {selectedDuty.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChooseOption(option)}
                      className="w-full text-left bg-white hover:bg-blue-50/80 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 transition flex items-center justify-between gap-2 group active:scale-[0.99] shadow-2xs"
                    >
                      <div className="font-bold text-slate-800 text-xs group-hover:text-blue-900 transition min-w-0 flex-1">
                        {option.text}
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
