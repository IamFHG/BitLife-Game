import React, { useState } from 'react';
import { GameState, Job, ExecutiveState, SubordinateNPC, LeverageDossier } from '../types';
import { formatMoney } from '../utils/gameUtils';
import { 
  initializeExecutiveState, 
  resolveIncident, 
  resolvePressConference, 
  siphonSlushFund, 
  executeBlackmail 
} from '../utils/executiveEngine';
import { 
  Crown, Shield, DollarSign, Users, Radio, AlertTriangle, 
  Scale, FileText, Lock, ChevronRight, Sparkles, Flame, Eye,
  Building, CheckCircle2, XCircle, Zap, Megaphone, UserPlus
} from 'lucide-react';

interface ExecutiveOfficeViewProps {
  state: GameState;
  onUpdateJobState: (updatedJob: Job) => void;
  onShowFeedback: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onUpdateExecutiveState?: (execState: ExecutiveState) => void;
  onGrantPersonalCash?: (amount: number) => void;
}

export const ExecutiveOfficeView: React.FC<ExecutiveOfficeViewProps> = ({
  state,
  onUpdateJobState,
  onShowFeedback,
  onUpdateExecutiveState,
  onGrantPersonalCash
}) => {
  const currentJob = state.character.currentJob;
  if (!currentJob) return null;

  // Lazily initialize executive state if not present
  const [execState, setExecState] = useState<ExecutiveState>(() => {
    if (state.executiveState && state.executiveState.isExecutive) {
      return state.executiveState;
    }
    return initializeExecutiveState(currentJob);
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'roster' | 'shadow' | 'press' | 'incidents'>('overview');
  const [selectedSubordinateId, setSelectedSubordinateId] = useState<string>('');
  const [selectedDossierId, setSelectedDossierId] = useState<string>('');

  // Sync state upward whenever execState updates
  const updateExec = (newExec: ExecutiveState) => {
    setExecState(newExec);
    if (onUpdateExecutiveState) {
      onUpdateExecutiveState(newExec);
    }
  };

  // Helper to boost job performance
  const addPerformance = (amount: number) => {
    const updatedPerf = Math.min(100, currentJob.performance + amount);
    onUpdateJobState({ ...currentJob, performance: updatedPerf });
  };

  // Archetype Badge styling
  const getArchetypeBadge = (arch: string) => {
    switch (arch) {
      case 'Untouchable Reformer':
        return { label: '🛡️ Untouchable Reformer', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Whistleblower immunity & high public backing.' };
      case 'Shadow Syndicate Chief':
        return { label: '👑 Shadow Syndicate Chief', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Use off-book syndicate leverage to silence threats.' };
      case 'Teflon Puppet':
        return { label: '♟️ Teflon Puppet', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', desc: 'Shift legal liability onto deputies automatically.' };
      default:
        return { label: '🏛️ Civic Statesman', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', desc: 'Fast-track transition directly into a Mayoral campaign.' };
    }
  };

  const archInfo = getArchetypeBadge(execState.archetype);

  // 1. Budget Allocation Handlers
  const handleUpdateAllocation = (key: 'wages' | 'operations' | 'oversight' | 'slushFund', val: number) => {
    const currentAlloc = { ...execState.budget.allocations };
    currentAlloc[key] = Math.max(0, Math.min(100, val));

    // Normalize other keys to ensure 100% total sum
    const otherKeys = (['wages', 'operations', 'oversight', 'slushFund'] as const).filter(k => k !== key);
    const remaining = 100 - currentAlloc[key];
    const otherSum = otherKeys.reduce((acc, k) => acc + currentAlloc[k], 0) || 1;

    otherKeys.forEach(k => {
      currentAlloc[k] = Math.round((currentAlloc[k] / otherSum) * remaining);
    });

    const newExec = {
      ...execState,
      budget: {
        ...execState.budget,
        allocations: currentAlloc
      }
    };
    updateExec(newExec);
    onShowFeedback('Department budget allocations adjusted.', 'info');
  };

  const handleSiphonMoney = (amount: number) => {
    const res = siphonSlushFund(execState, amount);
    updateExec(res.updatedExec);
    if (onGrantPersonalCash) {
      onGrantPersonalCash(res.siphonedCash);
    }
    onShowFeedback(res.logText, 'success');
    addPerformance(5);
  };

  // 2. Subordinate Actions
  const handleSubordinateAction = (subId: string, action: 'promote' | 'investigate' | 'cover' | 'fire') => {
    const sub = execState.subordinates.find(s => s.id === subId);
    if (!sub) return;

    let updatedSubordinates = [...execState.subordinates];
    let newScandal = execState.scandalRisk;
    let newVuln = execState.vulnerabilityIndex;
    let msg = '';

    if (action === 'promote') {
      updatedSubordinates = updatedSubordinates.map(s => s.id === subId ? { ...s, loyalty: Math.min(100, s.loyalty + 20), role: `Senior ${s.role}` } : s);
      msg = `🌟 Promoted ${sub.name}! Loyalty increased to ${Math.min(100, sub.loyalty + 20)}%.`;
    } else if (action === 'investigate') {
      updatedSubordinates = updatedSubordinates.map(s => s.id === subId ? { ...s, status: 'Investigated' } : s);
      msg = `🔍 Audit complete on ${sub.name}: Trait: [${sub.trait}] | Corruption Index: ${sub.corruption}%.`;
    } else if (action === 'cover') {
      newVuln = Math.min(100, newVuln + 15);
      updatedSubordinates = updatedSubordinates.map(s => s.id === subId ? { ...s, loyalty: 100 } : s);
      msg = `🛡️ Covered up misconduct for ${sub.name}. Loyalty maxed (100%), but Legal Vulnerability increased (+15%).`;
    } else {
      // Fire
      updatedSubordinates = updatedSubordinates.filter(s => s.id !== subId);
      msg = `❌ Dismissed ${sub.name} from executive service. Deputy post vacant.`;
    }

    updateExec({
      ...execState,
      subordinates: updatedSubordinates,
      scandalRisk: newScandal,
      vulnerabilityIndex: newVuln
    });
    onShowFeedback(msg, action === 'cover' ? 'info' : 'success');
  };

  // 3. Shadow Network & Blackmail Handlers
  const handleOrderSurveillance = (dosId: string) => {
    const updatedDossiers = execState.dossiers.map(d => {
      if (d.id === dosId) {
        const newDirt = [...d.dirtDiscovered, 'Recorded Unencrypted Phone Calls & Offshore Wire Receipts'];
        return { ...d, playerTapped: true, dirtDiscovered: newDirt, leveragePoints: Math.min(100, d.leveragePoints + 35) };
      }
      return d;
    });

    updateExec({ ...execState, dossiers: updatedDossiers });
    onShowFeedback('📡 Surveillance active. Wiretaps captured compromising audio logs & financial receipts.', 'success');
  };

  const handleBlackmail = (dosId: string, goal: 'DemandBudget' | 'QuashAudit' | 'SilenceStory') => {
    const res = executeBlackmail(execState, dosId, goal);
    updateExec(res.updatedExec);
    onShowFeedback(res.logText, res.feedbackType);
  };

  // 4. Incident Tactical Sandbox
  const handleDispatchIncident = (directive: 'DeEscalate' | 'AggressiveBreach' | 'CovertPayoff') => {
    if (!selectedSubordinateId) {
      onShowFeedback('Select a Subordinate Deputy Lead to command the operation.', 'error');
      return;
    }
    const res = resolveIncident(execState, selectedSubordinateId, directive);
    updateExec(res.updatedExec);
    onShowFeedback(res.logText, res.feedbackType);
    addPerformance(15);
  };

  // 5. Press Conference
  const handleSpinPress = (spin: 'Transparency' | 'Scapegoat' | 'BlameMayor' | 'GagOrder') => {
    const res = resolvePressConference(execState, spin);
    updateExec(res.updatedExec);
    onShowFeedback(res.logText, res.feedbackType);
  };

  return (
    <div className="space-y-4 p-3 max-w-4xl mx-auto">
      {/* EXECUTIVE HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 rounded-2xl text-white shadow-xl border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 text-amber-300 shrink-0">
              👑
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>Supreme Executive Authority</span>
                <span>•</span>
                <span>Yr {execState.yearsAsChief} in Command</span>
              </div>
              <h3 className="font-extrabold text-lg text-white leading-tight truncate">{execState.chiefTitle}</h3>
              <div className="text-xs text-slate-300 truncate">{currentJob.company}</div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm font-black text-emerald-400">{formatMoney(execState.budget.totalBudget)}</div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Annual Dept Budget</div>
          </div>
        </div>

        {/* Executive Archetype Pill */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-bold ${archInfo.bg}`}>
          <div>
            <div className="font-extrabold">{archInfo.label}</div>
            <div className="text-[10px] opacity-90">{archInfo.desc}</div>
          </div>
          <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md uppercase font-black shrink-0">
            Alignment Mode
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-800 text-center text-xs">
          <div className="bg-black/40 p-2 rounded-xl border border-white/5">
            <div className="text-[9px] text-slate-400 font-bold uppercase">Public Approval</div>
            <div className={`font-black ${execState.publicApproval > 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {execState.publicApproval}%
            </div>
          </div>

          <div className="bg-black/40 p-2 rounded-xl border border-white/5">
            <div className="text-[9px] text-slate-400 font-bold uppercase">Council Trust</div>
            <div className={`font-black ${execState.boardCouncilTrust > 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {execState.boardCouncilTrust}%
            </div>
          </div>

          <div className="bg-black/40 p-2 rounded-xl border border-white/5">
            <div className="text-[9px] text-slate-400 font-bold uppercase">Dept Morale</div>
            <div className="font-black text-sky-400">{execState.departmentMorale}%</div>
          </div>

          <div className="bg-black/40 p-2 rounded-xl border border-white/5">
            <div className="text-[9px] text-slate-400 font-bold uppercase">Scandal Risk</div>
            <div className={`font-black ${execState.scandalRisk > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {execState.scandalRisk}%
            </div>
          </div>

          <div className="bg-black/40 p-2 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
            <div className="text-[9px] text-slate-400 font-bold uppercase">Legal Vuln</div>
            <div className={`font-black ${execState.vulnerabilityIndex > 50 ? 'text-rose-400' : 'text-slate-200'}`}>
              {execState.vulnerabilityIndex}%
            </div>
          </div>
        </div>
      </div>

      {/* COMMAND CENTER TAB NAVIGATION */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'overview', label: '📊 Overview', badge: null },
          { id: 'budget', label: '💵 Budget & Slush', badge: `$${(execState.budget.totalBudget / 1000000).toFixed(1)}M` },
          { id: 'roster', label: '👥 Roster', badge: execState.subordinates.length > 0 ? String(execState.subordinates.length) : null },
          { id: 'shadow', label: '🤫 Shadow Net', badge: execState.dossiers.length > 0 ? String(execState.dossiers.length) : null },
          { id: 'press', label: '🎙️ Press Room', badge: execState.activePressConference ? '1 LIVE' : null },
          { id: 'incidents', label: '⚠️ Emergency Standoff', badge: execState.activeIncident ? '1 ACTIVE' : null }
        ].map(tab => {
          const badgeStr = tab.badge != null ? String(tab.badge) : null;
          const isUrgent = badgeStr ? (badgeStr.includes('LIVE') || badgeStr.includes('ACTIVE')) : false;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl font-black text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-amber-400 shadow-md border border-slate-700' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {badgeStr && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                  isUrgent 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {badgeStr}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW & METRICS */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Executive Command Status & Governance Summary</span>
            </h4>

            {execState.investigationLevel !== 'None' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                <div className="font-black text-sm flex items-center gap-1.5 text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>SPECIAL LEGAL STATUS: {execState.investigationLevel}</span>
                </div>
                <p>State prosecutors or grand jury council are actively scrutinizing department ledgers and executive wire logs.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-slate-900 mb-1">🏛️ Department Governance</div>
                <p className="text-slate-600">Your decisions hold full authority over division hiring, operational SWAT deployment, and annual budget distribution.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-extrabold text-slate-900 mb-1">⚖️ Legal Vulnerability Index ({execState.vulnerabilityIndex}%)</div>
                <p className="text-slate-600">Siphoning slush funds or covering up deputy misconduct increases your risk of federal grand jury subpoenas.</p>
              </div>
            </div>

            {/* Historic Accomplishments Log */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Executive Directives Archive</div>
              <div className="space-y-1">
                {execState.historicAccomplishments.map((acc, idx) => (
                  <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-amber-500">▪</span>
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: DEPARTMENT BUDGET & SLUSH FUND SIPHON */}
      {/* ===================================================================== */}
      {activeTab === 'budget' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">💵 Annual Departmental Budget Allocation</h4>
                <div className="text-xs text-slate-500">Total Approved Pool: {formatMoney(execState.budget.totalBudget)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-emerald-600">Siphoned to Date</div>
                <div className="text-sm font-black text-slate-900">{formatMoney(execState.budget.siphonedAccumulated)}</div>
              </div>
            </div>

            {/* Allocations Sliders */}
            <div className="space-y-3">
              {[
                { key: 'wages', label: '👥 Personnel & Wages', desc: 'Sustains officer morale, prevents labor strikes, attracts elite talent.', color: 'emerald' },
                { key: 'operations', label: '⚙️ Operations & Equipment', desc: 'SWAT readiness, ICU tech, forensic systems success in crises.', color: 'blue' },
                { key: 'oversight', label: '🔍 Internal Oversight & Ethics', desc: 'Suppresses corruption, quashes leaks, reduces legal vulnerability.', color: 'purple' },
                { key: 'slushFund', label: '💰 Off-Book Discretionary Slush Fund', desc: 'Allows secret payoffs, wiretaps, and siphoning into personal accounts.', color: 'amber' }
              ].map(sec => {
                const val = execState.budget.allocations[sec.key as keyof typeof execState.budget.allocations];
                const dollarVal = Math.round(execState.budget.totalBudget * (val / 100));

                return (
                  <div key={sec.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-black text-slate-900">
                      <span>{sec.label}</span>
                      <span className="text-emerald-700 font-extrabold">{val}% ({formatMoney(dollarVal)})</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{sec.desc}</p>
                    <input 
                      type="range" 
                      min="0" 
                      max="80" 
                      value={val}
                      onChange={e => handleUpdateAllocation(sec.key as any, parseInt(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* SIPHON SLUSH FUND ACTION PANEL */}
            <div className="p-3.5 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 rounded-xl text-white border border-amber-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Siphon Off-Book Slush Fund into Personal Account</span>
                </div>
                <span className="text-[10px] bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold">
                  ⚠️ Risk of Grand Jury Inquiry
                </span>
              </div>
              <p className="text-[11px] text-amber-100/80">
                Transfer discretionary departmental funds directly into your character's private offshore vault. This increases personal net worth but adds to your Legal Vulnerability Index.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleSiphonMoney(50000)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-2 rounded-lg text-xs transition cursor-pointer shadow-md"
                >
                  Siphon $50,000
                </button>
                <button
                  onClick={() => handleSiphonMoney(150000)}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold py-2 rounded-lg text-xs transition cursor-pointer shadow-md"
                >
                  Siphon $150,000
                </button>
                <button
                  onClick={() => handleSiphonMoney(500000)}
                  className="bg-amber-800 hover:bg-amber-900 text-white font-extrabold py-2 rounded-lg text-xs transition cursor-pointer shadow-md"
                >
                  Siphon $500,000
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: SUBORDINATE ROSTER & APPOINTMENTS */}
      {/* ===================================================================== */}
      {activeTab === 'roster' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">👥 Deputy Command Roster & Division Leads</h4>
                <div className="text-xs text-slate-500">Full authority to appoint, promote, investigate, cover up, or dismiss staff.</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {execState.subordinates.map(sub => (
                <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-white rounded-xl border border-slate-200 shrink-0">
                      {sub.avatarIcon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900">{sub.name}</span>
                        <span className="text-[9px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded">
                          {sub.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                        <span>Comp: <strong className="text-slate-900">{sub.competence}%</strong></span>
                        <span>Loyalty: <strong className="text-emerald-700">{sub.loyalty}%</strong></span>
                        <span>Trait: <strong className="text-amber-800">{sub.trait}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:shrink-0">
                    <button
                      onClick={() => handleSubordinateAction(sub.id, 'promote')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      🌟 Promote
                    </button>
                    <button
                      onClick={() => handleSubordinateAction(sub.id, 'investigate')}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      🔍 IA Audit
                    </button>
                    <button
                      onClick={() => handleSubordinateAction(sub.id, 'cover')}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      🛡️ Cover Misconduct
                    </button>
                    <button
                      onClick={() => handleSubordinateAction(sub.id, 'fire')}
                      className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      ❌ Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: SHADOW NETWORK & LEVERAGE DOSSIERS */}
      {/* ===================================================================== */}
      {activeTab === 'shadow' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-700" />
                <span>🤫 Shadow Network & Leverage Dossiers</span>
              </h4>
              <div className="text-xs text-slate-500">Order discreet surveillance, collect wiretap dirt, and leverage political figures.</div>
            </div>

            <div className="space-y-3">
              {execState.dossiers.map(dos => (
                <div key={dos.id} className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-black text-xs text-amber-300">{dos.npcName}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{dos.npcRole}</div>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-black">
                      Leverage: {dos.leveragePoints} Points
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1 bg-black/40 p-2 rounded-lg border border-white/5">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Discovered Dirt & Wiretaps:</div>
                    {dos.dirtDiscovered.length > 0 ? (
                      dos.dirtDiscovered.map((dirt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-amber-200">
                          <span>🕵️</span>
                          <span>{dirt}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">No dirt discovered yet. Wiretap pending.</div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleOrderSurveillance(dos.id)}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      <span>📡 Order Wiretap</span>
                    </button>
                    {dos.dirtDiscovered.length > 0 && (
                      <>
                        <button
                          onClick={() => handleBlackmail(dos.id, 'DemandBudget')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          💵 Demand $1.5M Budget
                        </button>
                        <button
                          onClick={() => handleBlackmail(dos.id, 'QuashAudit')}
                          className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          ⚖️ Quash Grand Jury Audit
                        </button>
                        <button
                          onClick={() => handleBlackmail(dos.id, 'SilenceStory')}
                          className="bg-slate-700 hover:bg-slate-800 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          📰 Kill Expose Story
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: MEDIA & PRESS ROOM */}
      {/* ===================================================================== */}
      {activeTab === 'press' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-700" />
                <span>🎙️ Live Press Conference & Media Briefing</span>
              </h4>
            </div>

            {execState.activePressConference ? (
              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  {execState.activePressConference.headline}
                </div>
                <p className="text-xs text-slate-300 italic bg-black/40 p-3 rounded-xl border border-white/5">
                  {execState.activePressConference.journalistQuestion}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase">Choose Media Spin Strategy:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSpinPress('Transparency')}
                      className="p-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 rounded-xl text-left transition cursor-pointer space-y-1"
                    >
                      <div className="font-extrabold text-xs text-emerald-300">🏛️ Full Transparency</div>
                      <div className="text-[10px] text-emerald-200/80">+12% Public Approval, -10% Scandal Risk.</div>
                    </button>

                    <button
                      onClick={() => handleSpinPress('Scapegoat')}
                      className="p-3 bg-amber-950/80 hover:bg-amber-900 border border-amber-700 rounded-xl text-left transition cursor-pointer space-y-1"
                    >
                      <div className="font-extrabold text-xs text-amber-300">👥 Shift Blame to Deputy Scapegoat</div>
                      <div className="text-[10px] text-amber-200/80">Protects you directly, -15% Dept Morale.</div>
                    </button>

                    <button
                      onClick={() => handleSpinPress('BlameMayor')}
                      className="p-3 bg-blue-950/80 hover:bg-blue-900 border border-blue-700 rounded-xl text-left transition cursor-pointer space-y-1"
                    >
                      <div className="font-extrabold text-xs text-blue-300">⚡ Blame Mayor & Political Bosses</div>
                      <div className="text-[10px] text-blue-200/80">+15% Populist Support, -25% Council Trust.</div>
                    </button>

                    <button
                      onClick={() => handleSpinPress('GagOrder')}
                      className="p-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-xl text-left transition cursor-pointer space-y-1"
                    >
                      <div className="font-extrabold text-xs text-rose-300">🤐 Enforce Media Gag Order</div>
                      <div className="text-[10px] text-rose-200/80">Suppresses story now, +20% Scandal Risk later.</div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                No active press briefing required. The media pool is currently quiet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: EMERGENCY INCIDENT STANDOFF SANDBOX */}
      {/* ===================================================================== */}
      {activeTab === 'incidents' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>⚠️ Emergency Operational Standoff Sandbox</span>
              </h4>
            </div>

            {execState.activeIncident ? (
              <div className="p-4 bg-slate-950 text-white rounded-2xl border border-rose-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-rose-400">{execState.activeIncident.title}</span>
                  <span className="text-[10px] bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase animate-pulse">
                    {execState.activeIncident.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{execState.activeIncident.description}</p>

                {/* Subordinate Dispatch Selection */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-black text-amber-300 uppercase">1. Assign Deputy Lead to Field Command:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {execState.subordinates.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubordinateId(sub.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          selectedSubordinateId === sub.id 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/80 font-bold' 
                            : 'bg-black/40 text-slate-300 border-white/10 hover:bg-black/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{sub.avatarIcon}</span>
                          <div>
                            <div className="font-bold">{sub.name}</div>
                            <div className="text-[10px] opacity-80">{sub.role} • Trait: [{sub.trait}]</div>
                          </div>
                        </div>
                        {selectedSubordinateId === sub.id && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tactical Directives */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-black text-amber-300 uppercase">2. Issue Executive Directive:</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleDispatchIncident('DeEscalate')}
                      className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                    >
                      🤝 De-Escalate
                    </button>
                    <button
                      onClick={() => handleDispatchIncident('AggressiveBreach')}
                      className="bg-rose-700 hover:bg-rose-800 text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                    >
                      ⚡ Full Breach
                    </button>
                    <button
                      onClick={() => handleDispatchIncident('CovertPayoff')}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                    >
                      💵 Covert Payoff
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                No active tactical emergencies reported. Precinct and sector monitors are clear.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
