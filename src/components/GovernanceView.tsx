import React, { useState } from 'react';
import { GameState, GovernanceState, CabinetOfficial } from '../types';
import { formatMoney } from '../utils/gameUtils';
import { 
  Building2, ShieldAlert, Award, Landmark, Users, DollarSign, 
  Radio, Scale, Flame, RefreshCw, CheckCircle2, AlertTriangle, UserCheck, UserX, X
} from 'lucide-react';

interface GovernanceViewProps {
  state: GameState;
  onUpdateGovernance: (updater: (prev: GovernanceState) => GovernanceState) => void;
  onStepDown: () => void;
  onBrowseCareers?: () => void;
  onClose: () => void;
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({
  state,
  onUpdateGovernance,
  onStepDown,
  onBrowseCareers,
  onClose
}) => {
  const { character } = state;
  const { firstName, lastName, avatarIcon } = character;

  const gov = state.governanceState || {
    isGovernor: true,
    regimeTitle: 'Provisional Military Governor',
    stability: 85,
    approval: 65,
    treasury: 25000000,
    taxRate: 25,
    curfewActive: false,
    martialLawLevel: 'Strict' as const,
    cabinet: [
      { id: 'cab_1', title: 'Chief of Defense Staff', name: 'Gen. Arthur Sterling', avatarIcon: '🪖', loyalty: 85, competence: 90, status: 'Active' },
      { id: 'cab_2', title: 'Chief Justice', name: 'Hon. Marcus Vance', avatarIcon: '⚖️', loyalty: 65, competence: 95, status: 'Active' },
      { id: 'cab_3', title: 'Minister of Finance', name: 'Dr. Elena Rostova', avatarIcon: '💰', loyalty: 80, competence: 85, status: 'Active' },
      { id: 'cab_4', title: 'Chief of Intelligence', name: 'Col. Viktor Kroll', avatarIcon: '🕵️', loyalty: 90, competence: 92, status: 'Active' },
      { id: 'cab_5', title: 'Director of State Media', name: 'Sarah Jenkins', avatarIcon: '📺', loyalty: 75, competence: 70, status: 'Active' }
    ],
    yearsInPower: state.character.currentJob?.yearsInRole || 1
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'decrees'>('overview');
  const [selectedOfficialForReplacement, setSelectedOfficialForReplacement] = useState<CabinetOfficial | null>(null);
  const [candidateList, setCandidateList] = useState<{ name: string; loyalty: number; competence: number }[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Compute coup threat
  const coupThreatLevel = 
    gov.stability < 30 ? 'CRITICAL' :
    gov.stability < 50 ? 'HIGH' :
    gov.stability < 70 ? 'MEDIUM' : 'LOW';

  const coupBadgeColor = 
    coupThreatLevel === 'CRITICAL' ? 'bg-red-600 text-white' :
    coupThreatLevel === 'HIGH' ? 'bg-amber-500 text-white' :
    coupThreatLevel === 'MEDIUM' ? 'bg-yellow-400 text-slate-900' : 'bg-emerald-600 text-white';

  const showFeedback = (text: string) => {
    setActionFeedback(text);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Open official replacement modal with 3 nominees
  const handleOpenReplacement = (official: CabinetOfficial) => {
    setSelectedOfficialForReplacement(official);
    const firstNames = ['Alexander', 'Dominic', 'Valerie', 'Garrison', 'Maximilian', 'Sophia', 'Julian'];
    const lastNames = ['Vane', 'Mercer', 'Kavanagh', 'Thorne', 'Cross', 'Steele', 'Blackwood'];
    
    const candidates = [1, 2, 3].map(() => ({
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      loyalty: Math.floor(Math.random() * 35) + 65,
      competence: Math.floor(Math.random() * 40) + 60
    }));
    setCandidateList(candidates);
  };

  const handleAppointCandidate = (candidate: { name: string; loyalty: number; competence: number }) => {
    if (!selectedOfficialForReplacement) return;
    
    onUpdateGovernance(prev => ({
      ...prev,
      cabinet: prev.cabinet.map(c => 
        c.id === selectedOfficialForReplacement.id 
          ? { ...c, name: candidate.name, loyalty: candidate.loyalty, competence: candidate.competence, status: 'Active' }
          : c
      ),
      stability: Math.min(100, prev.stability + 5)
    }));

    showFeedback(`Appointed ${candidate.name} as new ${selectedOfficialForReplacement.title}!`);
    setSelectedOfficialForReplacement(null);
  };

  const handlePurgeOfficial = (official: CabinetOfficial) => {
    onUpdateGovernance(prev => ({
      ...prev,
      cabinet: prev.cabinet.map(c => c.id === official.id ? { ...c, status: 'Purged', loyalty: 0 } : c),
      stability: Math.min(100, prev.stability + 15),
      approval: Math.max(0, prev.approval - 10)
    }));
    showFeedback(`Purged ${official.name} from state council! Regime stability strengthened (+15%).`);
  };

  // Issue Security Decrees
  const handleExecuteDecree = (type: 'curfew' | 'deploy_guard' | 'broadcast') => {
    if (type === 'curfew') {
      onUpdateGovernance(prev => ({
        ...prev,
        curfewActive: !prev.curfewActive,
        stability: Math.min(100, prev.stability + 10),
        approval: Math.max(0, prev.approval - 5)
      }));
      showFeedback('State Curfew Order Issued! Streets cleared, stability increased.');
    } else if (type === 'deploy_guard') {
      if (gov.treasury < 1000000) {
        showFeedback('Insufficient State Treasury funds ($1M required)!');
        return;
      }
      onUpdateGovernance(prev => ({
        ...prev,
        treasury: prev.treasury - 1000000,
        stability: Math.min(100, prev.stability + 15),
        approval: Math.min(100, prev.approval + 5)
      }));
      showFeedback('Armed Forces Mobilized! Patrols reinforced in all cities.');
    } else if (type === 'broadcast') {
      onUpdateGovernance(prev => ({
        ...prev,
        approval: Math.min(100, prev.approval + 12),
        stability: Math.min(100, prev.stability + 5)
      }));
      showFeedback('National Televised Speech Broadcasted! Public morale boosted (+12%).');
    }
  };

  const handleTaxChange = (rate: number) => {
    onUpdateGovernance(prev => ({
      ...prev,
      taxRate: rate,
      approval: rate > 30 ? Math.max(0, prev.approval - 10) : Math.min(100, prev.approval + 10)
    }));
    showFeedback(`State Tax Levy adjusted to ${rate}%!`);
  };

  return (
    <div className="flex flex-col h-full bg-[#eef2f5] text-slate-800 select-none">
      
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-4 py-3 text-white flex items-center justify-between shadow-md shrink-0 relative z-10">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black italic tracking-wide text-white uppercase drop-shadow">
          STATE GOVERNANCE
        </h2>

        <span className="text-[10px] text-red-200 font-bold uppercase tracking-wider">
          State Council
        </span>
      </div>

      {/* Character Sub-Header Bar */}
      <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between text-slate-800 text-xs shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">{avatarIcon || '👤'}</span>
          <div>
            <div className="font-extrabold text-slate-900 flex items-center gap-1">
              <span>🇺🇸</span>
              <span>{firstName} {lastName}</span>
              <span>🎖️</span>
            </div>
            <div className="text-[11px] text-red-700 font-extrabold flex items-center gap-1">
              <span>🏛️</span>
              <span>Provisional Military Governor</span>
            </div>
          </div>
        </div>
      </div>

      {/* State Metrics Grid Banner */}
      <div className="bg-white p-3 border-b border-slate-200 shadow-2xs space-y-2 shrink-0">
        <div className="text-[10px] font-black text-red-700 uppercase tracking-wider flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5" />
          <span>SUPREME STATE AUTHORITY • YEAR {gov.yearsInPower} IN POWER</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[9px] font-extrabold text-slate-500 uppercase">Stability</div>
            <div className="text-sm font-black text-emerald-600 mt-0.5">{gov.stability}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${gov.stability}%` }} />
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[9px] font-extrabold text-slate-500 uppercase">Approval</div>
            <div className="text-sm font-black text-sky-600 mt-0.5">{gov.approval}%</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${gov.approval}%` }} />
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[9px] font-extrabold text-slate-500 uppercase">Treasury</div>
            <div className="text-sm font-black text-amber-600 mt-0.5 truncate">{formatMoney(gov.treasury)}</div>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-center">
            <div className="text-[9px] font-extrabold text-slate-500 uppercase">Coup Threat</div>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md mt-0.5 uppercase tracking-wider ${coupBadgeColor}`}>
              {coupThreatLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-200/80 p-1 mx-3 mt-3 rounded-xl flex gap-1 font-extrabold text-[11px] shrink-0 border border-slate-300/60">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            activeTab === 'overview' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          🏛️ Overview
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            activeTab === 'appointments' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          👑 Appointments
        </button>

        <button
          onClick={() => setActiveTab('decrees')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            activeTab === 'decrees' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/60'
          }`}
        >
          📜 Decrees
        </button>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="bg-emerald-600 text-white text-[11px] font-bold p-2 text-center animate-in fade-in duration-150 flex items-center justify-center gap-1.5 shadow-2xs my-1 mx-3 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Tab Main Content */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="text-[10px] font-black text-red-700 uppercase tracking-widest flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                <span>State Power Declaration</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                You are currently exercising emergency state authority as <strong>Provisional Military Governor</strong>. Standard civil employment and corporate institutions are suspended under Martial Law decrees.
              </p>
            </div>

            {/* Supreme Career Appointment Privilege */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-50 p-3.5 rounded-2xl border-2 border-amber-400 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>Supreme Career & Rank Mandate</span>
                </div>
                <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                  God Mode Active
                </span>
              </div>
              <p className="text-[11px] text-amber-900 font-semibold leading-relaxed">
                As Provisional Governor, you possess supreme authority to assume <strong>any civilian or military job at any rank level</strong> without age, degree, or progression barriers.
              </p>
              {onBrowseCareers && (
                <button
                  onClick={onBrowseCareers}
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-amber-300 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
                >
                  <span>👑 Browse & Assume Any Position</span>
                  <span>→</span>
                </button>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleExecuteDecree('broadcast')}
                className="bg-white hover:bg-red-50/50 p-3 rounded-2xl border border-slate-200 hover:border-red-300 text-left transition flex items-center gap-3 shadow-2xs group active:scale-95 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-xl shrink-0">
                  📺
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 group-hover:text-red-700">TV Broadcast</div>
                  <div className="text-[10px] text-slate-500 font-bold">+12% Approval</div>
                </div>
              </button>

              <button
                onClick={() => handleExecuteDecree('deploy_guard')}
                className="bg-white hover:bg-red-50/50 p-3 rounded-2xl border border-slate-200 hover:border-red-300 text-left transition flex items-center gap-3 shadow-2xs group active:scale-95 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                  🪖
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 group-hover:text-red-700">Deploy Forces</div>
                  <div className="text-[10px] text-slate-500 font-bold">-$1M Treasury • +15% Stability</div>
                </div>
              </button>
            </div>

            {/* Step Down / Restore Democracy */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
                Democracy Transition
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-snug">
                Optionally dissolve military council and restore constitutional civilian elections. You will retire with an official State Elder Pension ($250k/year).
              </p>
              <button
                onClick={onStepDown}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🗳️ Restore Democracy & Step Down
              </button>
            </div>

          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-2.5">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-xs text-slate-600 font-medium">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                <Users className="w-4 h-4 text-red-700" />
                <span>Executive Council & Cabinet Appointments</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                As Governor, you hold supreme authority to appoint, replace, or purge key state officials based on Loyalty and Competence.
              </p>
            </div>

            {/* List of Cabinet Officials */}
            <div className="space-y-2">
              {gov.cabinet.map((official) => (
                <div 
                  key={official.id}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                        {official.avatarIcon}
                      </span>
                      <div>
                        <div className="text-[10px] font-black text-red-700 uppercase tracking-wider">
                          {official.title}
                        </div>
                        <div className="font-extrabold text-xs text-slate-900">
                          {official.name}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      official.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {official.status}
                    </span>
                  </div>

                  {/* Loyalty / Competence Bars */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>Loyalty</span>
                        <span className="text-emerald-600 font-black">{official.loyalty}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${official.loyalty}%` }} />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>Competence</span>
                        <span className="text-sky-600 font-black">{official.competence}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${official.competence}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-0.5">
                    <button
                      onClick={() => handleOpenReplacement(official)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 px-3 rounded-xl text-[11px] uppercase transition active:scale-95 shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Reassign / Appoint</span>
                    </button>

                    <button
                      onClick={() => handlePurgeOfficial(official)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold py-2 px-3 rounded-xl text-[11px] uppercase transition active:scale-95 flex items-center gap-1 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Purge</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* STATE DECREES TAB */}
        {activeTab === 'decrees' && (
          <div className="space-y-2.5">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-xs text-slate-600">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-700" />
                <span>Executive Decrees & Emergency Orders</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enact high-authority decrees to adjust tax levies, maintain order, and enforce military emergency directives.
              </p>
            </div>

            {/* Tax Rates */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-900">State Tax Levy Rate</span>
                <span className="font-black text-amber-600 text-sm">{gov.taxRate}%</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-[10px]">
                {[15, 25, 40, 50].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleTaxChange(rate)}
                    className={`py-2 rounded-xl font-extrabold border transition cursor-pointer ${
                      gov.taxRate === rate
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-2xs font-black'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {rate}% Levy
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Decrees */}
            <div className="space-y-2">
              <button
                onClick={() => handleExecuteDecree('curfew')}
                className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between group active:scale-95 shadow-2xs cursor-pointer ${
                  gov.curfewActive
                    ? 'bg-red-50 border-red-300 text-red-950'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    {gov.curfewActive ? '🚨 Nationwide Curfew Active' : '🌙 Enforce City Curfews'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {gov.curfewActive ? 'Click to Lift Curfew Order' : '+10% Stability • -5% Public Approval'}
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-red-700">
                  {gov.curfewActive ? 'Active' : 'Enact Order →'}
                </span>
              </button>

              <button
                onClick={() => handleExecuteDecree('broadcast')}
                className="w-full bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left transition flex items-center justify-between group active:scale-95 shadow-2xs cursor-pointer"
              >
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    📺 Deliver State Address on Live TV
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Boost Public Morale & Approval (+12%)
                  </div>
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-sky-600">
                  Broadcast →
                </span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* APPOINTMENT SELECTION MODAL */}
      {selectedOfficialForReplacement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-4 space-y-3 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <div className="text-[10px] font-black text-red-700 uppercase tracking-widest">
                  Appoint Official
                </div>
                <h3 className="font-extrabold text-xs text-slate-900">
                  Select Candidate for {selectedOfficialForReplacement.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOfficialForReplacement(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {candidateList.map((cand, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAppointCandidate(cand)}
                  className="bg-slate-50 hover:bg-red-50 p-3 rounded-xl border border-slate-200 hover:border-red-300 cursor-pointer transition flex items-center justify-between group active:scale-95 shadow-2xs"
                >
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-red-700">
                      {cand.name}
                    </div>
                    <div className="flex gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span>Loyalty: <strong className="text-emerald-600">{cand.loyalty}%</strong></span>
                      <span>Competence: <strong className="text-sky-600">{cand.competence}%</strong></span>
                    </div>
                  </div>

                  <span className="text-[10px] font-black text-red-700 uppercase">
                    Appoint →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
