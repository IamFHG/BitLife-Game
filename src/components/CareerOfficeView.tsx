import React, { useState } from 'react';
import { GameState, Job, ExecutiveState } from '../types';
import { formatMoney } from '../utils/gameUtils';
import { 
  Building2, Award, Shield, Zap, TrendingUp, Users, Crown, 
  Scale, Stethoscope, AlertTriangle, Cpu, Radio, Briefcase, 
  Wrench, Sparkles, CheckCircle2, ChevronRight, Activity, Flame,
  FileText, Play, RefreshCw
} from 'lucide-react';
import { getEffectiveJobRank } from '../data/careerDutiesData';
import { isExecutiveRole } from '../utils/executiveEngine';
import { ExecutiveOfficeView } from './ExecutiveOfficeView';

interface CareerOfficeViewProps {
  state: GameState;
  onJobAction: (action: 'work_hard' | 'ask_raise' | 'ask_promotion' | 'quit') => void;
  onOpenDuties: () => void;
  onOpenCoworkers: () => void;
  onOpenEducation: () => void;
  onOpenExploreJobs: () => void;
  onUpdateJobState: (updatedJob: Job) => void;
  onShowFeedback: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onUpdateExecutiveState?: (execState: ExecutiveState) => void;
  onGrantPersonalCash?: (amount: number) => void;
}

export const CareerOfficeView: React.FC<CareerOfficeViewProps> = ({
  state,
  onJobAction,
  onOpenDuties,
  onOpenCoworkers,
  onOpenEducation,
  onOpenExploreJobs,
  onUpdateJobState,
  onShowFeedback,
  onUpdateExecutiveState,
  onGrantPersonalCash
}) => {
  const { character } = state;
  const currentJob = character.currentJob;

  if (!currentJob) return null;

  const category = currentJob.category || 'Corporate';
  const jobTitleLower = currentJob.title.toLowerCase();

  // Check if character is retired / receiving pension
  const isRetired = currentJob.isRetired || 
                    jobTitleLower.includes('(retired)') || 
                    currentJob.company.toLowerCase().includes('pension') || 
                    currentJob.title.toLowerCase().includes('retired');

  // Dynamic state for interactive office rooms
  const [activeSubView, setActiveSubView] = useState<'main' | 'duties' | 'coworkers'>('main');
  const [executiveViewMode, setExecutiveViewMode] = useState<'executive_suite' | 'sector_floor'>('executive_suite');

  // Check for Executive Authority (Chief, Commissioner, Director, CEO, Managing Partner, General)
  const isChiefExecutive = isExecutiveRole(currentJob) || Boolean(state.executiveState && state.executiveState.isExecutive);

  const handlePromoteToExecutive = () => {
    let topTitle = 'Chief Executive Officer';
    if (category === 'Public Service') topTitle = 'Police Commissioner & Chief';
    else if (category === 'Medical') topTitle = 'Chief Medical Director & Surgeon General';
    else if (category === 'Legal') topTitle = 'Presiding Chief Justice & Managing Partner';
    else if (category === 'Military') topTitle = '4-Star General & Joint Chief';
    else if (category === 'Tech') topTitle = 'Chief Technology Officer & VP Engineering';
    else if (category === 'Corporate') topTitle = 'Chief Executive Officer (CEO)';

    const updatedJob: Job = {
      ...currentJob,
      title: topTitle,
      salary: Math.max(currentJob.salary * 1.5, 320000),
      currentTierIndex: 4,
      performance: 95
    };
    onUpdateJobState(updatedJob);
    onShowFeedback(`👑 Appointed to Supreme Executive Authority: ${topTitle}!`, 'success');
    setExecutiveViewMode('executive_suite');
  };

  if (isChiefExecutive && !isRetired && executiveViewMode === 'executive_suite') {
    return (
      <div className="space-y-2">
        {/* Quick View Switcher Bar */}
        <div className="bg-slate-900/90 p-1.5 mx-3 mt-2 rounded-xl flex gap-1 font-black text-[11px] border border-slate-700/80 shadow-md">
          <button
            onClick={() => setExecutiveViewMode('executive_suite')}
            className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>👑 Executive Command Suite</span>
          </button>
          <button
            onClick={() => setExecutiveViewMode('sector_floor')}
            className="flex-1 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <span>🏢 Sector Floor Operations</span>
          </button>
        </div>

        <ExecutiveOfficeView
          state={state}
          onUpdateJobState={onUpdateJobState}
          onShowFeedback={onShowFeedback}
          onUpdateExecutiveState={onUpdateExecutiveState}
          onGrantPersonalCash={onGrantPersonalCash}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE FOR JUDICIAL / COURTROOM ROOM
  // -------------------------------------------------------------
  const [courtCases, setCourtCases] = useState([
    { id: 'c1', title: 'State vs. Marcus Vance', type: 'Criminal Felony', status: 'In Deliberation', charge: 'Armed Robbery & Conspiracy', severity: 'High' },
    { id: 'c2', title: 'TechCorp vs. BioGen Systems', type: 'Civil IP Dispute', status: 'Pending Injunction', charge: '$14M Patent Infringement', severity: 'Medium' },
    { id: 'c3', title: 'City Appeals: Eminent Domain', type: 'Constitutional', status: 'Brief Submitted', charge: 'Land Acquisition Appeal', severity: 'Low' }
  ]);

  // -------------------------------------------------------------
  // STATE FOR MEDICAL / HOSPITAL ROOM
  // -------------------------------------------------------------
  const [hospitalBeds, setHospitalBeds] = useState([
    { id: 'b1', bed: 'Bed 104', name: 'Sarah Jenkins', condition: 'Acute Trauma / Fracture', vitals: 'BP 115/78 • HR 82', status: 'Pre-Op' },
    { id: 'b2', bed: 'Bed 108', name: 'Arthur Pendelton', condition: 'Post-Op Cardiac Bypass', vitals: 'BP 120/80 • HR 70', status: 'Stable' },
    { id: 'b3', bed: 'Bed 212', name: 'David Miller', condition: 'Severe Respiratory Distress', vitals: 'BP 140/92 • HR 105', status: 'Critical ICU' }
  ]);

  // -------------------------------------------------------------
  // STATE FOR POLICE / PRECINCT ROOM
  // -------------------------------------------------------------
  const [policeIncidents, setPoliceIncidents] = useState([
    { id: 'p1', code: 'Code 3', location: '104 Main Street Bank', title: 'Armed Robbery in Progress', status: 'Active 911 Call' },
    { id: 'p2', code: 'File 88', location: 'Interrogation Room B', title: 'Suspect Viktor Kroll (Syndicate)', status: 'In Custody' },
    { id: 'p3', code: 'Case 409', location: 'District 4 Warehouse', title: 'Illicit Contraband Safehouse', status: 'Warrant Pending' }
  ]);

  // -------------------------------------------------------------
  // STATE FOR MILITARY COMMAND POST
  // -------------------------------------------------------------
  const [militarySectors, setMilitarySectors] = useState([
    { id: 'm1', sector: 'Sector Alpha', unit: '1st Battalion Infantry', readiness: '98%', mission: 'Perimeter Defense & Guard' },
    { id: 'm2', sector: 'Sector Bravo', unit: 'Heavy Armory & Artillery', readiness: '92%', mission: 'Munitions Maintenance' },
    { id: 'm3', sector: 'Sector Charlie', unit: 'Air Recon Squadron', readiness: '100%', mission: 'Aerial Surveillance Fleet' }
  ]);

  // -------------------------------------------------------------
  // STATE FOR TECH / SILICON LAB
  // -------------------------------------------------------------
  const [techServices, setTechServices] = useState([
    { id: 't1', service: 'Auth Gateway v2', status: 'Healthy', load: '12ms latency', reqs: '14,200 req/sec' },
    { id: 't2', service: 'AI Inference Cluster', status: 'High Traffic', load: '48ms latency', reqs: '8,900 req/sec' },
    { id: 't3', service: 'Payment & Billing API', status: 'Healthy', load: '8ms latency', reqs: '3,100 req/sec' }
  ]);

  // -------------------------------------------------------------
  // STATE FOR CORPORATE BOARDROOM
  // -------------------------------------------------------------
  const [corpDivisions, setCorpDivisions] = useState([
    { id: 'd1', name: 'Enterprise Cloud Sales', revenue: '$28.5M', margin: '34%', status: 'Target Exceeded' },
    { id: 'd2', name: 'Global Supply Chain', revenue: '$19.2M', margin: '22%', status: 'Optimization Needed' },
    { id: 'd3', name: 'R&D Innovation Lab', revenue: '$6.8M', margin: '45%', status: 'Venture Phase' }
  ]);

  // -------------------------------------------------------------
  // STATE FOR CREATIVE SOUNDSTAGE
  // -------------------------------------------------------------
  const [creativeProjects, setCreativeProjects] = useState([
    { id: 'cr1', title: 'Studio Feature Film / Album', phase: 'Post-Production', rating: '94% Metacritic', status: 'In Review' },
    { id: 'cr2', title: 'World Arena Live Tour', phase: '32 City Dates', rating: 'Sold Out', status: 'Active Tour' },
    { id: 'cr3', title: 'International Press Junket', phase: 'Media Blitz', rating: '12M Reach', status: 'Scheduled' }
  ]);

  // -------------------------------------------------------------
  // STATE FOR TRADES / WORKSHOP
  // -------------------------------------------------------------
  const [workOrders, setWorkOrders] = useState([
    { id: 'w1', idNum: 'WO-804', client: 'Commercial Plaza', task: 'Industrial HVAC Overhaul', status: 'In Progress' },
    { id: 'w2', idNum: 'WO-812', client: 'Transit Corp Fleet', task: 'Diesel Engine Calibration', status: 'Queued' },
    { id: 'w3', idNum: 'WO-819', client: 'Highrise Residential', task: 'Electrical Grid Audit', status: 'Ready for Signoff' }
  ]);

  // RENDER CLEAN RETIRED PENSIONER CARD
  if (isRetired) {
    return (
      <div className="space-y-3 p-3">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-2xl text-white shadow-md space-y-3 border border-slate-700">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl p-2 bg-white/10 rounded-xl border border-white/20 shrink-0">
                🏛️
              </span>
              <div className="min-w-0">
                <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest truncate">
                  State Pensioner • {currentJob.yearsInRole} Yr{currentJob.yearsInRole === 1 ? '' : 's'} Retired
                </div>
                <h3 className="font-extrabold text-sm text-white leading-tight truncate">{currentJob.title}</h3>
                <div className="text-xs text-slate-300 truncate">{currentJob.company}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-black text-emerald-400">{formatMoney(currentJob.salary)}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Annual Pension</div>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenExploreJobs}
          className="w-full bg-[#0c52a1] hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <span>🔍</span>
          <span>Browse Job Catalog / Re-enter Workforce</span>
        </button>
      </div>
    );
  }

  const effectiveRank = getEffectiveJobRank(currentJob.title, currentJob.currentTierIndex ?? 0);

  // Category Flags
  const isMilitary = category === 'Military' || jobTitleLower.includes('soldier') || jobTitleLower.includes('army') || jobTitleLower.includes('colonel') || jobTitleLower.includes('general') || jobTitleLower.includes('private');
  const isMedical = category === 'Medical' || category === 'Healthcare' || jobTitleLower.includes('doctor') || jobTitleLower.includes('surgeon') || jobTitleLower.includes('nurse') || jobTitleLower.includes('resident');
  const isLegal = category === 'Legal' || jobTitleLower.includes('lawyer') || jobTitleLower.includes('attorney') || jobTitleLower.includes('judge') || jobTitleLower.includes('prosecutor');
  const isTech = category === 'Tech' || jobTitleLower.includes('software') || jobTitleLower.includes('developer') || jobTitleLower.includes('engineer') || jobTitleLower.includes('cto');
  const isPolice = (category === 'Public Service' || category === 'Service') && (jobTitleLower.includes('police') || jobTitleLower.includes('cop') || jobTitleLower.includes('detective') || jobTitleLower.includes('sheriff') || jobTitleLower.includes('marshal'));
  const isCreative = category === 'Creative' || jobTitleLower.includes('actor') || jobTitleLower.includes('musician') || jobTitleLower.includes('singer') || jobTitleLower.includes('artist') || jobTitleLower.includes('director') || jobTitleLower.includes('producer');
  const isTrade = category === 'Trade' || jobTitleLower.includes('mechanic') || jobTitleLower.includes('electrician') || jobTitleLower.includes('plumber') || jobTitleLower.includes('carpenter') || jobTitleLower.includes('technician');

  // Performance Booster Helper
  const boostPerformance = (amount: number, msg: string) => {
    const updatedPerf = Math.min(100, currentJob.performance + amount);
    onUpdateJobState({
      ...currentJob,
      performance: updatedPerf
    });
    onShowFeedback(msg, 'success');
  };

  // Top bar if executive is viewing sector floor
  const renderExecutiveTopBar = () => {
    if (!isChiefExecutive) return null;
    return (
      <div className="bg-slate-900/90 p-1.5 rounded-xl flex gap-1 font-black text-[11px] border border-slate-700/80 shadow-md mb-2">
        <button
          onClick={() => setExecutiveViewMode('executive_suite')}
          className="flex-1 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
        >
          <span>👑 Executive Command Suite</span>
        </button>
        <button
          onClick={() => setExecutiveViewMode('sector_floor')}
          className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>🏢 Sector Floor Operations</span>
        </button>
      </div>
    );
  };

  const renderExecutiveCard = () => {
    if (isChiefExecutive) {
      return (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-3.5 rounded-2xl text-white border border-amber-500/40 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-300">
              👑
            </span>
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wide">Supreme Chief Authority Active</div>
              <div className="text-[11px] text-slate-300">Department Slush Fund, Wiretaps, Deputy Roster & Standoff Sandbox ready.</div>
            </div>
          </div>
          <button
            onClick={() => setExecutiveViewMode('executive_suite')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm shrink-0 active:scale-95"
          >
            Open Suite →
          </button>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-2xl text-white border border-indigo-500/30 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-300">
              👑
            </span>
            <div>
              <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider">Executive Track & Leadership Aspirations</h4>
              <p className="text-[11px] text-slate-300">Rise to Chief / Director / CEO to unlock supreme command authority & sandbox.</p>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/40">
            {currentJob.performance >= 70 ? 'Eligible for Appointment' : 'Tenure Building'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handlePromoteToExecutive}
            className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>👑 Petition Board for Executive Appointment (Assume Command)</span>
          </button>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 1. ⚖️ JUDICIAL COURTROOM & BENCH VIEW
  // =========================================================================
  if (isLegal) {
    const handleRuleCase = (id: string, action: string) => {
      setCourtCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
      boostPerformance(12, `🔨 Case ${id.toUpperCase()}: Issued ${action}! Docket updated & court record filed.`);
    };

    return (
      <div className="space-y-4 p-3">
        {renderExecutiveTopBar()}

        {/* Court Bench Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 p-4 rounded-2xl text-white shadow-md border border-amber-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                ⚖️
              </span>
              <div>
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  State District Court • Judicial Bench
                </div>
                <h3 className="font-extrabold text-base text-white leading-tight">{currentJob.title}</h3>
                <div className="text-xs text-amber-200/80">{currentJob.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-400">{formatMoney(currentJob.salary)}/yr</div>
              <div className="text-[9px] text-amber-300 font-bold uppercase">Performance: {currentJob.performance}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-amber-900/40 text-center">
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Docket Clearance</div>
              <div className="text-xs font-black text-white">92.4%</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Bench Decorum</div>
              <div className="text-xs font-black text-emerald-400">Strict</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Appeals Upheld</div>
              <div className="text-xs font-black text-amber-300">98%</div>
            </div>
          </div>
        </div>

        {/* Courtroom Docket Case List */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-800" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Active Court Docket & Trials</h4>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
              {courtCases.filter(c => c.status !== 'Resolved').length} Pending
            </span>
          </div>

          <div className="space-y-2">
            {courtCases.map(c => (
              <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{c.title}</span>
                      <span className="text-[9px] bg-stone-200 text-stone-800 font-bold px-1.5 py-0.5 rounded">
                        {c.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{c.charge}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {c.status}
                  </span>
                </div>

                {c.status !== 'Resolved' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleRuleCase(c.id, 'Verdict & Sentence')}
                      className="flex-1 bg-amber-900 hover:bg-amber-950 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>🔨 Hand Down Verdict</span>
                    </button>
                    <button
                      onClick={() => handleRuleCase(c.id, 'Bench Warrant')}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>📜 Issue Warrant</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Judicial Bench Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => boostPerformance(10, '📜 Motion for Summary Judgment granted! Docket backlog cleared.')}
            className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🔨 Rule on Motions</div>
            <div className="text-xs font-extrabold text-amber-950">Grant Summary Judgment</div>
            <div className="text-[10px] text-amber-800">+10% Performance</div>
          </button>

          <button
            onClick={() => boostPerformance(12, '🏛️ Courtroom Session Adjourned cleanly after high-profile trial.')}
            className="p-3 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🏛️ Adjourn Session</div>
            <div className="text-xs font-extrabold text-stone-900">Judicial Chambers Recess</div>
            <div className="text-[10px] text-stone-700">+12% Performance</div>
          </button>
        </div>

        {/* Executive Authority / Leadership Track Card */}
        {renderExecutiveCard()}
      </div>
    );
  }

  // =========================================================================
  // 2. 🏥 MEDICAL / HOSPITAL WARD VIEW
  // =========================================================================
  if (isMedical) {
    const handleTreatPatient = (id: string, procedure: string) => {
      setHospitalBeds(prev => prev.map(b => b.id === id ? { ...b, status: 'Recovering (Stable)' } : b));
      boostPerformance(12, `🩺 ${procedure} executed successfully! Patient vitals stabilized.`);
    };

    return (
      <div className="space-y-4 p-3">
        {renderExecutiveTopBar()}

        {/* Hospital Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 p-4 rounded-2xl text-white shadow-md border border-teal-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 bg-teal-500/20 rounded-xl border border-teal-500/30">
                🩺
              </span>
              <div>
                <div className="text-[10px] font-black text-teal-300 uppercase tracking-widest">
                  St. Jude Memorial Hospital • Clinical Ward
                </div>
                <h3 className="font-extrabold text-base text-white leading-tight">{currentJob.title}</h3>
                <div className="text-xs text-teal-200/80">{currentJob.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-400">{formatMoney(currentJob.salary)}/yr</div>
              <div className="text-[9px] text-teal-300 font-bold uppercase">Performance: {currentJob.performance}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-teal-900/40 text-center">
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-teal-300/80 font-bold uppercase">Surgical Success</div>
              <div className="text-xs font-black text-emerald-400">98.6%</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-teal-300/80 font-bold uppercase">ICU Beds</div>
              <div className="text-xs font-black text-sky-300">12 / 15 Used</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-teal-300/80 font-bold uppercase">Triage Speed</div>
              <div className="text-xs font-black text-amber-300">Optimum</div>
            </div>
          </div>
        </div>

        {/* Hospital Ward Patient Monitor */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-700" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Active Patient Ward Monitor</h4>
            </div>
            <span className="text-[10px] bg-teal-100 text-teal-900 font-extrabold px-2 py-0.5 rounded-full">
              {hospitalBeds.filter(b => !b.status.includes('Recovering')).length} Needing Care
            </span>
          </div>

          <div className="space-y-2">
            {hospitalBeds.map(b => (
              <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{b.bed}: {b.name}</span>
                    </div>
                    <p className="text-[11px] text-teal-800 font-extrabold mt-0.5">{b.condition}</p>
                    <div className="text-[10px] text-slate-500">{b.vitals}</div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    b.status.includes('Recovering') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {b.status}
                  </span>
                </div>

                {!b.status.includes('Recovering') && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleTreatPatient(b.id, 'Emergency Surgical Intervention')}
                      className="flex-1 bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>🔪 Emergency Surgery</span>
                    </button>
                    <button
                      onClick={() => handleTreatPatient(b.id, 'Medication & ICU Dosing')}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>💉 Administer Treatment</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => boostPerformance(10, '📋 Patient Ward Rounds completed with Chief Resident praising your care.')}
            className="p-3 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🩺 Lead Ward Rounds</div>
            <div className="text-xs font-extrabold text-teal-950">Patient Chart Audit</div>
            <div className="text-[10px] text-teal-800">+10% Performance</div>
          </button>

          <button
            onClick={() => boostPerformance(12, '🔬 Comprehensive Diagnostic MRI Scan performed with flawless detection.')}
            className="p-3 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🔬 Diagnostic MRI</div>
            <div className="text-xs font-extrabold text-sky-950">Run Full Body Scan</div>
            <div className="text-[10px] text-sky-800">+12% Performance</div>
          </button>
        </div>

        {/* Executive Authority / Leadership Track Card */}
        {renderExecutiveCard()}
      </div>
    );
  }

  // =========================================================================
  // 3. 🚔 LAW ENFORCEMENT PRECINCT VIEW
  // =========================================================================
  if (isPolice) {
    const handleResolveIncident = (id: string, action: string) => {
      setPoliceIncidents(prev => prev.map(p => p.id === id ? { ...p, status: 'Resolved' } : p));
      boostPerformance(12, `🚨 Incident ${id.toUpperCase()}: ${action} executed! Precinct crime board updated.`);
    };

    return (
      <div className="space-y-4 p-3">
        {renderExecutiveTopBar()}

        {/* Police Precinct Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-4 rounded-2xl text-white shadow-md border border-blue-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
                🚔
              </span>
              <div>
                <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest">
                  9th Precinct • Law Enforcement HQ
                </div>
                <h3 className="font-extrabold text-base text-white leading-tight">{currentJob.title}</h3>
                <div className="text-xs text-blue-200/80">{currentJob.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-400">{formatMoney(currentJob.salary)}/yr</div>
              <div className="text-[9px] text-blue-300 font-bold uppercase">Performance: {currentJob.performance}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-blue-900/40 text-center">
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-blue-300/80 font-bold uppercase">Case Clearance</div>
              <div className="text-xs font-black text-emerald-400">89.2%</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-blue-300/80 font-bold uppercase">Response Time</div>
              <div className="text-xs font-black text-sky-300">3.2 Minutes</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-blue-300/80 font-bold uppercase">Public Trust</div>
              <div className="text-xs font-black text-amber-300">Grade A</div>
            </div>
          </div>
        </div>

        {/* Precinct Incident & Evidence Board */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-800" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Active 911 Calls & Case Files</h4>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded-full">
              {policeIncidents.filter(p => p.status !== 'Resolved').length} Active
            </span>
          </div>

          <div className="space-y-2">
            {policeIncidents.map(p => (
              <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{p.title}</span>
                      <span className="text-[9px] bg-blue-100 text-blue-900 font-bold px-1.5 py-0.5 rounded">
                        {p.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{p.location}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    p.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {p.status}
                  </span>
                </div>

                {p.status !== 'Resolved' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleResolveIncident(p.id, 'SWAT & Patrol Dispatch')}
                      className="flex-1 bg-blue-900 hover:bg-blue-950 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>🚨 Dispatch Units</span>
                    </button>
                    <button
                      onClick={() => handleResolveIncident(p.id, 'Interrogation & Arrest')}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                    >
                      <span>🔍 Interrogate Suspect</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Police Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => boostPerformance(10, '🚔 Precinct High-Speed Sector Patrol completed. Crime deterred.')}
            className="p-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🚔 City Patrol</div>
            <div className="text-xs font-extrabold text-blue-950">High-Speed Sector Sweep</div>
            <div className="text-[10px] text-blue-800">+10% Performance</div>
          </button>

          <button
            onClick={() => boostPerformance(12, '📜 Search Warrant executed; critical crime syndicate contraband seized.')}
            className="p-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">📜 Execute Warrant</div>
            <div className="text-xs font-extrabold text-slate-900">Raid Contraband Depot</div>
            <div className="text-[10px] text-slate-700">+12% Performance</div>
          </button>
        </div>

        {/* Executive Authority / Leadership Track Card */}
        {renderExecutiveCard()}
      </div>
    );
  }

  // =========================================================================
  // 4. 🪖 MILITARY BASE COMMAND VIEW
  // =========================================================================
  if (isMilitary) {
    const handleDrillSector = (id: string) => {
      setMilitarySectors(prev => prev.map(m => m.id === id ? { ...m, readiness: '100%' } : m));
      boostPerformance(12, `🪖 ${id.toUpperCase()}: Tactical Live-Fire Drill completed! Combat readiness maxed.`);
    };

    return (
      <div className="space-y-4 p-3">
        {renderExecutiveTopBar()}

        {/* Military Command Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-4 rounded-2xl text-white shadow-md border border-amber-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                🪖
              </span>
              <div>
                <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
                  Fort Sterling • Strategic Command Post
                </div>
                <h3 className="font-extrabold text-base text-white leading-tight">{currentJob.title}</h3>
                <div className="text-xs text-amber-200/80">{currentJob.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-400">{formatMoney(currentJob.salary)}/yr</div>
              <div className="text-[9px] text-amber-300 font-bold uppercase">Performance: {currentJob.performance}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-amber-900/40 text-center">
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">DEFCON Status</div>
              <div className="text-xs font-black text-amber-400">DEFCON 3</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Force Readiness</div>
              <div className="text-xs font-black text-emerald-400">96.8%</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Air Supremacy</div>
              <div className="text-xs font-black text-sky-300">Dominant</div>
            </div>
          </div>
        </div>

        {/* Sector Defense Status */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-800" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Sector Readiness & Tactical Units</h4>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
              3 Sectors Operational
            </span>
          </div>

          <div className="space-y-2">
            {militarySectors.map(m => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{m.sector}: {m.unit}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{m.mission}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    Readiness: {m.readiness}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleDrillSector(m.id)}
                    className="flex-1 bg-amber-900 hover:bg-amber-950 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                  >
                    <span>🎯 Tactical Drill</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Military Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => boostPerformance(10, '📦 Armory & Heavy Munitions Depot audited with zero discrepancies.')}
            className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">📦 Armory Inspection</div>
            <div className="text-xs font-extrabold text-amber-950">Supply Readiness Audit</div>
            <div className="text-[10px] text-amber-800">+10% Performance</div>
          </button>

          <button
            onClick={() => boostPerformance(12, '🚁 Air Recon Flight completed; strategic perimeter intelligence mapped.')}
            className="p-3 bg-stone-100 hover:bg-stone-200/80 border border-stone-300 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🚁 Recon Flight</div>
            <div className="text-xs font-extrabold text-stone-900">Aerial Surveillance</div>
            <div className="text-[10px] text-stone-700">+12% Performance</div>
          </button>
        </div>

        {/* Executive Authority / Leadership Track Card */}
        {renderExecutiveCard()}
      </div>
    );
  }

  // =========================================================================
  // 5. 💻 TECH & SILICON LAB VIEW
  // =========================================================================
  if (isTech) {
    const handleOptimizeService = (id: string) => {
      setTechServices(prev => prev.map(t => t.id === id ? { ...t, status: 'Healthy', load: '4ms latency' } : t));
      boostPerformance(12, `⚡ Service ${id.toUpperCase()}: Refactored & deployed to cloud! Server latency cut to 4ms.`);
    };

    return (
      <div className="space-y-4 p-3">
        {renderExecutiveTopBar()}

        {/* Tech Terminal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 p-4 rounded-2xl text-white shadow-md border border-sky-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 bg-sky-500/20 rounded-xl border border-sky-500/30">
                💻
              </span>
              <div>
                <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
                  Silicon Command • Microservice Architecture
                </div>
                <h3 className="font-extrabold text-base text-white leading-tight">{currentJob.title}</h3>
                <div className="text-xs text-sky-200/80">{currentJob.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-400">{formatMoney(currentJob.salary)}/yr</div>
              <div className="text-[9px] text-sky-300 font-bold uppercase">Performance: {currentJob.performance}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-sky-900/40 text-center">
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-sky-300/80 font-bold uppercase">Server Uptime</div>
              <div className="text-xs font-black text-emerald-400">99.99%</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-sky-300/80 font-bold uppercase">System Latency</div>
              <div className="text-xs font-black text-sky-300">8ms Avg</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-sky-300/80 font-bold uppercase">Code Coverage</div>
              <div className="text-xs font-black text-amber-300">95%</div>
            </div>
          </div>
        </div>

        {/* Cloud Microservices Cluster */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-700" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Production Microservices Cluster</h4>
            </div>
            <span className="text-[10px] bg-sky-100 text-sky-900 font-extrabold px-2 py-0.5 rounded-full">
              3 Live Services
            </span>
          </div>

          <div className="space-y-2">
            {techServices.map(t => (
              <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{t.service}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{t.load} • {t.reqs}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    t.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleOptimizeService(t.id)}
                    className="flex-1 bg-sky-900 hover:bg-sky-950 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                  >
                    <span>⚡ Refactor & Optimize</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => boostPerformance(10, '🐛 Critical Production Bug patched & hotfixed to live servers!')}
            className="p-3 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🐛 Deploy Hotfix</div>
            <div className="text-xs font-extrabold text-sky-950">Patch Production Bug</div>
            <div className="text-[10px] text-sky-800">+10% Performance</div>
          </button>

          <button
            onClick={() => boostPerformance(12, '🚀 CI/CD Test suite executed (1,200 tests passing green).')}
            className="p-3 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🚀 Run CI/CD Pipeline</div>
            <div className="text-xs font-extrabold text-indigo-950">Automated Integration Tests</div>
            <div className="text-[10px] text-indigo-800">+12% Performance</div>
          </button>
        </div>

        {/* Executive Authority / Leadership Track Card */}
        {renderExecutiveCard()}
      </div>
    );
  }

  // =========================================================================
  // 6. 🏢 CORPORATE EXECUTIVE BOARDROOM VIEW
  // =========================================================================
  if (effectiveRank >= 2 || category === 'Corporate') {
    const handleExpandDivision = (id: string) => {
      setCorpDivisions(prev => prev.map(d => d.id === id ? { ...d, status: 'Target Exceeded' } : d));
      boostPerformance(12, `📈 Division ${id.toUpperCase()}: Capital allocation approved! Divisional profit margin expanded.`);
    };

    return (
      <div className="space-y-4 p-3">
        {renderExecutiveTopBar()}

        {/* Executive Boardroom Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-4 rounded-2xl text-white shadow-md border border-amber-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                🏢
              </span>
              <div>
                <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
                  38th Floor Penthouse • Executive Boardroom
                </div>
                <h3 className="font-extrabold text-base text-white leading-tight">{currentJob.title}</h3>
                <div className="text-xs text-amber-200/80">{currentJob.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-emerald-400">{formatMoney(currentJob.salary)}/yr</div>
              <div className="text-[9px] text-amber-300 font-bold uppercase">Performance: {currentJob.performance}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-amber-900/40 text-center">
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Enterprise Val.</div>
              <div className="text-xs font-black text-emerald-400">$1.2 Billion</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Stock Price</div>
              <div className="text-xs font-black text-sky-300">$142.80 (+5.1%)</div>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <div className="text-[9px] text-amber-300/80 font-bold uppercase">Board Approval</div>
              <div className="text-xs font-black text-amber-300">96%</div>
            </div>
          </div>
        </div>

        {/* Corporate Divisions Portfolio */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-800" />
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Corporate Divisions Portfolio</h4>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
              3 Active Divisions
            </span>
          </div>

          <div className="space-y-2">
            {corpDivisions.map(d => (
              <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{d.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Annual Rev: {d.revenue} • Margin: {d.margin}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    d.status === 'Target Exceeded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {d.status}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleExpandDivision(d.id)}
                    className="flex-1 bg-amber-900 hover:bg-amber-950 text-white text-[11px] font-extrabold py-1.5 rounded-lg transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                  >
                    <span>📈 Authorize Capital Investment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Governance Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => boostPerformance(12, '🤝 $40M M&A Competitor Acquisition deal finalized!')}
            className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">🤝 $40M M&A Acquisition</div>
            <div className="text-xs font-extrabold text-amber-950">Buyout Regional Competitor</div>
            <div className="text-[10px] text-amber-800">+12% Performance</div>
          </button>

          <button
            onClick={() => boostPerformance(10, '📊 Quarterly Shareholder Board Briefing concluded with standing ovation.')}
            className="p-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">📊 Host Board Briefing</div>
            <div className="text-xs font-extrabold text-slate-900">Present Earnings to Investors</div>
            <div className="text-[10px] text-slate-700">+10% Performance</div>
          </button>
        </div>

        {/* Executive Authority / Leadership Track Card */}
        {renderExecutiveCard()}
      </div>
    );
  }

  // =========================================================================
  // 7. DEFAULT GENERAL WORKSPACE
  // =========================================================================
  return (
    <div className="space-y-4 p-3">
      {renderExecutiveTopBar()}

      {/* General Office Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-2xl text-white shadow-md border border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 bg-white/10 rounded-xl border border-white/20">
              🏢
            </span>
            <div>
              <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
                Office Command Center • Rank {effectiveRank}
              </div>
              <h3 className="font-extrabold text-base text-white leading-tight">{currentJob.title}</h3>
              <div className="text-xs text-slate-300">{currentJob.company}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-black text-emerald-400">{formatMoney(currentJob.salary)}/yr</div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">Performance: {currentJob.performance}%</div>
          </div>
        </div>
      </div>

      {/* Workplace Duties & Operations */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-3">
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Career Operations & Duties</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => boostPerformance(10, '⚡ Worked Hard! Performance boosted.')}
            className="p-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">⚡ Work Hard</div>
            <div className="text-xs font-extrabold text-blue-950">Execute Daily Duties</div>
            <div className="text-[10px] text-blue-800">+10% Performance</div>
          </button>

          <button
            onClick={onOpenDuties}
            className="p-3 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left space-y-1 transition cursor-pointer active:scale-95"
          >
            <div className="text-base">📋 Role Scenario</div>
            <div className="text-xs font-extrabold text-amber-950">Handle On-Job Event</div>
            <div className="text-[10px] text-amber-800">Dynamic Decision</div>
          </button>
        </div>
      </div>

      {/* Executive Authority / Leadership Track Card */}
      {renderExecutiveCard()}
    </div>
  );
};
