import React, { useState } from 'react';
import { GameState, ClassmateNPC, EducationLevel } from '../types';
import { 
  UNIVERSITY_MAJORS, 
  HIGHER_ED_PROGRAMS, 
  SCHOOL_CLUBS, 
  SCHOOL_CLIQUES, 
  GREEK_TRIVIA_QUESTIONS
} from '../data/educationData';
import { formatMoney } from '../utils/gameUtils';
import { sanitizeCompletedDegrees, formatShortDegreeTitle, getDegreeIcon } from '../utils/qualificationUtils';
import { 
  X, ChevronRight, GraduationCap, Users, Sparkles, 
  MoreHorizontal, ArrowLeft, Heart, MessageSquare, ShieldAlert,
  Search, CheckCircle2, Award, DollarSign, BookOpen
} from 'lucide-react';

interface EducationModalProps {
  state: GameState;
  onClose: () => void;
  onUpdateEducation: (updatedEd: Partial<GameState['character']['education']['details']>, logMsg?: string) => void;
  onAddRelationship?: (newRel: any) => void;
  onEnrollSchool: (level: EducationLevel, major?: string, schoolName?: string, totalYears?: number, tuitionCost?: number, fundingMethod?: string) => void;
}

type ActiveView = 
  | 'main' 
  | 'school_info' 
  | 'class' 
  | 'faculty' 
  | 'clubs' 
  | 'cliques' 
  | 'greek' 
  | 'private_school_popup' 
  | 'drop_out_confirm' 
  | 'higher_ed_wizard'
  | 'change_major_popup';

export const EducationModal: React.FC<EducationModalProps> = ({
  state,
  onClose,
  onUpdateEducation,
  onAddRelationship,
  onEnrollSchool
}) => {
  const { character } = state;
  const { firstName, lastName, age, avatarIcon, bankBalance, education } = character;

  const edState = education.details || {
    level: education.level || 'None',
    schoolName: education.level === 'High School' ? 'Public High School' : education.level === 'Middle School' ? 'Public Middle School' : education.level === 'Elementary' ? 'Aiden McQueen Elementary School' : 'State University',
    yearsCompleted: 0,
    totalYears: education.level === 'Elementary' ? 6 : education.level === 'Middle School' ? 3 : education.level === 'High School' ? 4 : 4,
    grades: education.grades || 80,
    popularity: 40,
    athleticism: 50,
    clubs: [],
    droppedOut: false,
    expelled: false
  };

  const [activeView, setActiveView] = useState<ActiveView>('main');

  // Higher Ed Wizard Multi-step Popup State
  const [wizardStep, setWizardStep] = useState<number>(1); // 1: School Level, 2: Funding Method, 3: Major Selection, 4: Confirmation
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('University');
  const [selectedSchoolName, setSelectedSchoolName] = useState<string>('State University');
  const [selectedTotalYears, setSelectedTotalYears] = useState<number>(4);
  const [selectedTuition, setSelectedTuition] = useState<number>(12000);
  const [selectedFunding, setSelectedFunding] = useState<'scholarship' | 'parents' | 'loan' | 'cash'>('scholarship');
  const [selectedMajor, setSelectedMajor] = useState<string>('Computer Science');
  const [majorSearchQuery, setMajorSearchQuery] = useState<string>('');

  // Popup result message state
  const [popupMsg, setPopupMsg] = useState<{ title: string; message: string; onOk?: () => void } | null>(null);

  // Classmates state
  const [classmates, setClassmates] = useState<ClassmateNPC[]>(() => [
    { id: 'c0', name: 'Mrs. Duffy', gender: 'Female', age: 38, popularity: 80, smarts: 90, looks: 60, relationship: 65, avatarIcon: '👩‍🏫' },
    { id: 'c1', name: 'Aisha Bone', gender: 'Female', age: character.age, popularity: 60, smarts: 75, looks: 70, relationship: 55, avatarIcon: '👧🏽' },
    { id: 'c2', name: 'Angelica Bright', gender: 'Female', age: character.age, popularity: 85, smarts: 80, looks: 90, relationship: 70, avatarIcon: '👧🏼' },
    { id: 'c3', name: 'Ariana Grabber', gender: 'Female', age: character.age, popularity: 40, smarts: 60, looks: 50, relationship: 45, avatarIcon: '👧🏾' },
    { id: 'c4', name: 'Ashley Pickles', gender: 'Female', age: character.age, popularity: 65, smarts: 70, looks: 65, relationship: 68, avatarIcon: '👧🏻' },
    { id: 'c5', name: 'Bogoljub Milic', gender: 'Male', age: character.age, popularity: 50, smarts: 85, looks: 60, relationship: 62, avatarIcon: '👦🏼' },
    { id: 'c6', name: 'Chester Price', gender: 'Male', age: character.age, popularity: 45, smarts: 55, looks: 50, relationship: 42, avatarIcon: '👦🏽' },
    { id: 'c7', name: 'Daniel Espinoza', gender: 'Male', age: character.age, popularity: 55, smarts: 65, looks: 60, relationship: 58, avatarIcon: '👦🏽' },
    { id: 'c8', name: 'Hosni Mubarak', gender: 'Male', age: character.age, popularity: 70, smarts: 80, looks: 75, relationship: 65, avatarIcon: '👦🏽' },
    { id: 'c9', name: 'Ignacio Green', gender: 'Male', age: character.age, popularity: 60, smarts: 60, looks: 65, relationship: 60, avatarIcon: '👦🏾' },
    { id: 'c10', name: 'Kyrie Doolittle', gender: 'Male', age: character.age, popularity: 75, smarts: 70, looks: 80, relationship: 85, avatarIcon: '👦🏽' }
  ]);

  const [selectedClassmate, setSelectedClassmate] = useState<ClassmateNPC | null>(null);

  // Faculty list
  const facultyList = [
    { name: 'Mrs. Duffy', role: 'Teacher', relationship: 65, avatarIcon: '👩🏽' },
    { name: 'Mr. Egbert', role: 'Principal', relationship: 58, avatarIcon: '👴🏾' },
    { name: 'Mr. Holyfield', role: 'PE Teacher', relationship: 72, avatarIcon: '👨🏽' },
    { name: 'Mrs. Tang', role: 'Music Teacher', relationship: 60, avatarIcon: '👩🏼' }
  ];

  // Helper for dynamic level label
  const getDisplayLevelName = (lvl: EducationLevel) => {
    if (lvl === 'Elementary') return 'Elementary School';
    if (lvl === 'Middle School') return 'Middle School';
    if (lvl === 'High School') return 'High School';
    if (lvl === 'University') return `University (${edState.major || 'Undergraduate'})`;
    if (lvl === 'Community College') return `Community College (${edState.major || 'Associate'})`;
    if (lvl === 'Trade School') return `Trade School (${edState.major || 'Vocational'})`;
    if (lvl === 'Law School') return `Law School (${edState.major || 'J.D.'})`;
    if (lvl === 'Medical School') return `Medical School (${edState.major || 'M.D.'})`;
    if (lvl === 'Nursing School') return `Nursing School (${edState.major || 'Registered Nursing'})`;
    if (lvl === 'Business School') return `Business School (${edState.major || 'MBA'})`;
    if (lvl === 'Graduate School') return `Graduate School (${edState.major || 'Master / PhD'})`;
    if (lvl === 'Dental School') return `Dental School (${edState.major || 'D.D.S.'})`;
    if (lvl === 'Pharmacy School') return `Pharmacy School (${edState.major || 'Pharm.D.'})`;
    if (lvl === 'Veterinary School') return `Veterinary School (${edState.major || 'D.V.M.'})`;
    return lvl;
  };

  // Get list of offered majors tailored to institution level
  const getOfferedMajorsForLevel = (lvl: EducationLevel) => {
    if (lvl === 'Community College') {
      return [
        'General Studies & Liberal Arts',
        'Business Management & Administration',
        'Computer Information Technology',
        'Paralegal Studies & Legal Assisting',
        'Culinary Arts & Hospitality Management',
        'Early Childhood Education',
        'Dental Hygiene & Nursing Assistant',
        'Graphic Technology & Digital Media'
      ];
    }
    if (lvl === 'Trade School') {
      return [
        'Electrical Technology & Wiring',
        'Automotive Mechanics & Diesel Diagnostics',
        'Residential & Commercial Plumbing',
        'Precision Welding & Metal Fabrication',
        'HVAC & Climate Control Systems',
        'Carpentry & Building Construction',
        'Heavy Equipment & Crane Operation',
        'Cosmetology & Barbering Science'
      ];
    }
    if (lvl === 'Nursing School') {
      return [
        'Registered Nursing (RN / BSN)',
        'Critical Care & Emergency Nursing',
        'Pediatric & Maternal Health Nursing',
        'Surgical & Perioperative Nursing',
        'Psychiatric & Mental Health Nursing',
        'Nurse Practitioner & Clinical Practice',
        'Anesthetic & Surgical Nursing (CRNA)'
      ];
    }
    if (lvl === 'Business School') {
      return [
        'Master of Business Administration (MBA Executive)',
        'MBA Finance & Financial Engineering',
        'MBA Tech Entrepreneurship & Innovation',
        'MBA Marketing & Brand Strategy',
        'MBA Global Supply Chain & Logistics',
        'MBA Healthcare Administration'
      ];
    }
    if (lvl === 'Medical School') {
      return [
        'Doctor of Medicine (M.D. General Practice)',
        'Doctor of Medicine (M.D. General Surgery)',
        'Doctor of Medicine (M.D. Pediatrics)',
        'Doctor of Medicine (M.D. Neurology)',
        'Doctor of Medicine (M.D. Cardiology)',
        'Doctor of Medicine (M.D. Anesthesiology)'
      ];
    }
    if (lvl === 'Law School') {
      return [
        'Juris Doctor (J.D. Corporate Law)',
        'Juris Doctor (J.D. Criminal Defense)',
        'Juris Doctor (J.D. Constitutional Law)',
        'Juris Doctor (J.D. Intellectual Property)',
        'Juris Doctor (J.D. Tax Law)'
      ];
    }
    if (lvl === 'Dental School') {
      return [
        'Doctor of Dental Surgery (D.D.S. General Dentistry)',
        'Orthodontics & Dentofacial Orthopedics',
        'Oral & Maxillofacial Surgery'
      ];
    }
    if (lvl === 'Pharmacy School') {
      return [
        'Doctor of Pharmacy (Pharm.D. Clinical Practice)',
        'Pharm.D. Pharmaceutical Research & Development'
      ];
    }
    if (lvl === 'Veterinary School') {
      return [
        'Doctor of Veterinary Medicine (D.V.M. Small Animal)',
        'D.V.M. Equine & Large Animal Surgery'
      ];
    }
    if (lvl === 'Graduate School') {
      return [
        'Master of Computer Science (AI Specialization)',
        'Master of Science in Mechanical Engineering',
        'Master of Arts in Clinical Psychology',
        'Master of Science in Financial Risk',
        'Master of Public Health (MPH)'
      ];
    }
    
    // Default University Majors (Bachelor's)
    return UNIVERSITY_MAJORS;
  };

  // Study harder action handler
  const handleStudyHarder = () => {
    const newGrades = Math.min(100, edState.grades + Math.floor(Math.random() * 8) + 5);
    onUpdateEducation({ grades: newGrades }, `I studied harder for ${edState.level.toLowerCase()}.`);
    setPopupMsg({
      title: 'Study Harder',
      message: `You spent extra hours studying! Your grades improved to ${newGrades}%.`
    });
  };

  // Visit nurse action handler
  const handleVisitNurse = () => {
    setPopupMsg({
      title: 'School Nurse Visit',
      message: 'The school nurse examined you, checked your vitals, and gave you a clean bill of health!'
    });
  };

  // Drop out confirm handler
  const handleConfirmDropOut = () => {
    if (age < 16) {
      setPopupMsg({
        title: 'Cannot Drop Out!',
        message: 'Compulsory education laws require you to stay in school until at least age 16!'
      });
      return;
    }
    onUpdateEducation(
      { level: 'None', droppedOut: true, schoolName: undefined },
      `I dropped out of ${edState.level.toLowerCase()} school.`
    );
    setPopupMsg({
      title: 'Dropped Out',
      message: 'You officially dropped out of school.',
      onOk: () => onClose()
    });
  };

  // Switch to Private School handler
  const handleDoSwitchPrivate = () => {
    onUpdateEducation(
      { schoolName: 'Casey Dalton Private Academy', grades: Math.min(100, edState.grades + 10) },
      `My parents agreed to send me to Casey Dalton Private Academy!`
    );
    setPopupMsg({
      title: 'Switched Schools!',
      message: 'Your parents paid tuition and enrolled you into Casey Dalton Private Academy!'
    });
    setActiveView('main');
  };

  // Interact with Classmate / Teacher
  const handleInteractClassmate = (action: string) => {
    if (!selectedClassmate) return;
    let msg = '';
    let relChange = 10;

    if (action === 'befriend') {
      msg = `You hung out with ${selectedClassmate.name} after school!`;
      relChange = 15;
    } else if (action === 'compliment') {
      msg = `You gave ${selectedClassmate.name} a nice compliment!`;
      relChange = 10;
    } else if (action === 'ask_out') {
      if (selectedClassmate.relationship >= 50) {
        msg = `${selectedClassmate.name} accepted your request to go out!`;
        relChange = 30;
      } else {
        msg = `${selectedClassmate.name} turned you down.`;
        relChange = -10;
      }
    } else if (action === 'insult') {
      msg = `You got into an argument with ${selectedClassmate.name}!`;
      relChange = -20;
    }

    setClassmates(prev => prev.map(c => c.id === selectedClassmate.id ? { ...c, relationship: Math.max(0, Math.min(100, c.relationship + relChange)) } : c));
    setSelectedClassmate(null);
    setPopupMsg({
      title: 'Interaction',
      message: msg
    });
  };

  // Take GED test
  const handleTakeGED = () => {
    if (age < 16) {
      setPopupMsg({ title: 'GED Requirement', message: 'You must be at least 16 years old to take the GED test.' });
      return;
    }
    if (character.stats.smarts >= 50) {
      onUpdateEducation({ level: 'None', hasGed: true, highestCompleted: 'GED Certificate' }, 'I passed the GED test and earned my High School Equivalency Certificate!');
      setPopupMsg({ title: 'Passed GED!', message: 'Congratulations! You passed the GED test and earned your High School Equivalency Certificate!' });
    } else {
      setPopupMsg({ title: 'Failed GED', message: 'You failed the GED test. Try studying harder to raise your Smarts!' });
    }
  };

  // Start Higher Ed Wizard
  const startHigherEdWizard = (lvl: EducationLevel = 'University', schoolName = 'State University', years = 4, tuition = 12000, defaultMajor = 'Computer Science') => {
    setSelectedLevel(lvl);
    setSelectedSchoolName(schoolName);
    setSelectedTotalYears(years);
    setSelectedTuition(tuition);
    const majors = getOfferedMajorsForLevel(lvl);
    setSelectedMajor(defaultMajor || majors[0]);
    setSelectedFunding('scholarship');
    setWizardStep(1);
    setActiveView('higher_ed_wizard');
  };

  // Handle Wizard Funding Step validation
  const handleWizardNextToMajor = () => {
    if (selectedFunding === 'scholarship') {
      if (character.stats.smarts < 65 && edState.grades < 75) {
        setPopupMsg({
          title: 'Scholarship Rejected',
          message: 'Your grades and smarts were not high enough to qualify for a full academic scholarship! Please select another funding method (Student Loan, Cash, or Ask Parents).'
        });
        return;
      }
    } else if (selectedFunding === 'cash') {
      if (bankBalance < selectedTuition) {
        setPopupMsg({
          title: 'Insufficient Funds',
          message: `You do not have enough cash (${formatMoney(bankBalance)}) to pay the annual tuition of ${formatMoney(selectedTuition)}. Try applying for a Student Loan or Scholarship!`
        });
        return;
      }
    }
    setWizardStep(3);
  };

  // Final Confirmation Enrollment
  const handleConfirmWizardEnrollment = () => {
    onEnrollSchool(selectedLevel, selectedMajor, selectedSchoolName, selectedTotalYears, selectedTuition, selectedFunding);
    setPopupMsg({
      title: '🎓 Official Enrollment Complete!',
      message: `Congratulations! You have officially enrolled at ${selectedSchoolName} majoring in ${selectedMajor}!`,
      onOk: () => {
        setActiveView('main');
        onClose();
      }
    });
  };

  // Handle changing major when already enrolled
  const handleChangeCurrentMajor = (newMajor: string) => {
    onUpdateEducation({ major: newMajor }, `I officially changed my academic major to ${newMajor}!`);
    setPopupMsg({
      title: 'Major Updated!',
      message: `Your major at ${edState.schoolName || edState.level} has been changed to ${newMajor}.`
    });
    setActiveView('main');
  };

  return (
    <div className="fixed inset-0 z-40 max-w-md mx-auto w-full h-full bg-[#eef2f5] flex flex-col overflow-hidden animate-in fade-in duration-150 select-none">
        
        {/* Top Header Bar */}
        <div className="bg-[#0c52a1] px-4 py-3 text-white flex items-center justify-between shadow-md shrink-0">
          {activeView !== 'main' ? (
            <button
              onClick={() => setActiveView('main')}
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
            {activeView === 'faculty' ? 'FACULTY' : activeView === 'class' ? 'CLASS' : activeView === 'clubs' ? 'CLUBS' : activeView === 'cliques' ? 'CLIQUES' : activeView === 'higher_ed_wizard' ? 'ADMISSIONS' : 'SCHOOL'}
          </h2>

          <span className="text-[10px] text-blue-200 font-bold">v3.25</span>
        </div>

        {/* Character Sub-Header */}
        <div className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between text-slate-800 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{avatarIcon || '👤'}</span>
            <div>
              <div className="font-extrabold text-slate-900 flex items-center gap-1">
                <span>🇺🇸</span>
                <span>{firstName} {lastName}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                <span className="text-red-500">🎓</span>
                <span>{edState.level !== 'None' ? getDisplayLevelName(edState.level) : edState.highestCompleted || 'Unenrolled'}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-black text-emerald-600">{formatMoney(bankBalance)}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Bank Balance</div>
          </div>
        </div>

        {/* Main Body Content */}
        <div className="flex-1 overflow-y-auto">

          {/* MAIN SCHOOL VIEW */}
          {activeView === 'main' && (
            <div>
              {/* SECTION: CURRENT EDUCATION */}
              <div className="bg-[#6f7e8e] text-white text-xs font-extrabold uppercase py-1 px-4 text-center tracking-wider">
                Current Education Status
              </div>

              {/* Current School Card */}
              {edState.level !== 'None' ? (
                <div
                  onClick={() => setActiveView('school_info')}
                  className="p-3.5 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center justify-between border-b border-slate-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🏫</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {edState.schoolName || getDisplayLevelName(edState.level)}
                      </div>
                      {edState.major && (
                        <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Major: {edState.major}</span>
                        </div>
                      )}
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-slate-600">Grades</span>
                        <div className="w-24 bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                          <div className="bg-emerald-500 h-full" style={{ width: `${edState.grades}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <MoreHorizontal className="w-5 h-5 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white text-center text-slate-600 text-xs font-bold space-y-2 border-b border-slate-200">
                  <p className="italic text-slate-500">You are not currently enrolled in school.</p>
                </div>
              )}

              {/* SECTION: COMPLETED DEGREES & QUALIFICATIONS */}
              {(() => {
                const rawList = edState.completedDegrees || (
                  edState.highestCompleted ? [edState.highestCompleted] : []
                );
                const completedList = sanitizeCompletedDegrees(rawList);
                if (completedList.length === 0) return null;

                return (
                  <div className="bg-emerald-50/80 p-3.5 border-b border-emerald-200/80 space-y-2">
                    <div className="font-extrabold text-xs text-slate-800 uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-900">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Earned Qualifications & Degrees</span>
                      </span>
                      <span className="bg-emerald-200/80 text-emerald-900 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-300">
                        {completedList.length} Earned
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {completedList.map((degree, idx) => (
                        <div key={idx} className="bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-extrabold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                          <span className="text-sm">{getDegreeIcon(degree)}</span>
                          <span>{formatShortDegreeTitle(degree)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* SECTION: ACTIVITIES */}
              {edState.level !== 'None' && (
                <>
                  <div className="bg-[#6f7e8e] text-white text-xs font-extrabold uppercase py-1 px-4 text-center tracking-wider">
                    School Activities
                  </div>

                  <div className="divide-y divide-slate-200 bg-white">
                    {/* Change Major option if in College/University/Trade */}
                    {(edState.level === 'University' || edState.level === 'Community College' || edState.level === 'Trade School' || edState.level.includes('School')) && (
                      <div
                        onClick={() => setActiveView('change_major_popup')}
                        className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📑</span>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">Change Major / Field</div>
                            <div className="text-xs text-slate-500 font-medium">Switch your subject specialization</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}

                    {/* Change Schools */}
                    {edState.level === 'High School' && (
                      <div
                        onClick={() => setActiveView('private_school_popup')}
                        className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📓</span>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">Change Schools</div>
                            <div className="text-xs text-slate-500 font-medium">Ask to go to private academy</div>
                          </div>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                      </div>
                    )}

                    {/* Classmates & Class */}
                    <div
                      onClick={() => setActiveView('class')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✏️</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span>Classmates & Class</span>
                            <div className="text-[10px] text-slate-500 font-normal flex items-center gap-1">
                              <span>Popularity</span>
                              <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full" style={{ width: `${edState.popularity}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Clubs */}
                    <div
                      onClick={() => setActiveView('clubs')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎨</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">Extracurricular Clubs</div>
                          <div className="text-xs text-slate-500 font-medium">Robotics, Drama, Debate, Athletics</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Cliques */}
                    <div
                      onClick={() => setActiveView('cliques')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎈</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">School Cliques</div>
                          <div className="text-xs text-slate-500 font-medium">Jocks, Brainy Kids, Nerds, Populars</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Faculty */}
                    <div
                      onClick={() => setActiveView('faculty')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👓</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">Faculty</div>
                          <div className="text-xs text-slate-500 font-medium">Professors, Teachers & Principal</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Nurse */}
                    <div
                      onClick={handleVisitNurse}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👩‍⚕️</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">Nurse / Health Center</div>
                          <div className="text-xs text-slate-500 font-medium">Check vitals & health</div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </div>

                    {/* Study Harder */}
                    <div
                      onClick={handleStudyHarder}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📚</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">Study Harder</div>
                          <div className="text-xs text-slate-500 font-medium">Put in extra effort for better grades</div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </div>

                    {/* Drop Out */}
                    <div
                      onClick={() => setActiveView('drop_out_confirm')}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👏</span>
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">Drop Out</div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </>
              )}

              {/* Higher Ed Admission Button */}
              {(age >= 17 || edState.level === 'None') && (
                <div className="p-3 space-y-2">
                  <button
                    onClick={() => startHigherEdWizard('University', 'State University', 4, 12000, 'Computer Science')}
                    className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white font-black py-3 rounded-xl shadow-lg border border-red-400 flex items-center justify-center gap-2 text-xs uppercase active:scale-95 transition"
                  >
                    <GraduationCap className="w-5 h-5 text-yellow-300" />
                    <span>Apply for Higher Education & Majors ➔</span>
                  </button>

                  {/* GED button if dropped out and >= 16 */}
                  {age >= 16 && !edState.highestCompleted?.includes('High School') && edState.level === 'None' && (
                    <button
                      onClick={handleTakeGED}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl border border-slate-600 text-xs flex items-center justify-center gap-2"
                    >
                      <span>📄 Take GED Test (High School Equivalency)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CLASS SCREEN */}
          {activeView === 'class' && (
            <div className="divide-y divide-slate-200 bg-white">
              {classmates.map((person) => (
                <div
                  key={person.id}
                  onClick={() => setSelectedClassmate(person)}
                  className="p-3 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{person.avatarIcon}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                        <span>{person.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                        <span>Relationship</span>
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${person.relationship > 60 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                            style={{ width: `${person.relationship}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* FACULTY SCREEN */}
          {activeView === 'faculty' && (
            <div className="divide-y divide-slate-200 bg-white">
              {facultyList.map((fac, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setPopupMsg({
                      title: fac.name,
                      message: `Interacted with ${fac.name} (${fac.role}).`
                    });
                  }}
                  className="p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{fac.avatarIcon}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                        <span>{fac.name}</span>
                        <span className="text-slate-500 font-semibold">({fac.role})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                        <span>Relationship</span>
                        <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${fac.relationship}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* CLUBS SCREEN */}
          {activeView === 'clubs' && (
            <div className="p-3 space-y-2 bg-white">
              <h3 className="font-black text-slate-900 text-xs uppercase pb-1 border-b border-slate-200">School Clubs</h3>
              <div className="divide-y divide-slate-100">
                {SCHOOL_CLUBS.map((club, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{club.name}</div>
                      <div className="text-[10px] text-slate-500">{club.category} • Req: {club.reqType} ({club.minStat})</div>
                    </div>
                    <button
                      onClick={() => {
                        setPopupMsg({
                          title: 'Club Joined!',
                          message: `You successfully joined the ${club.name} club!`
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] px-2.5 py-1 rounded-lg"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLIQUES SCREEN */}
          {activeView === 'cliques' && (
            <div className="p-3 space-y-2 bg-white">
              <h3 className="font-black text-slate-900 text-xs uppercase pb-1 border-b border-slate-200">School Cliques</h3>
              <div className="divide-y divide-slate-100">
                {SCHOOL_CLIQUES.map((cli, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cli.emoji}</span>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">{cli.name}</div>
                        <div className="text-[10px] text-slate-500">{cli.description}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPopupMsg({
                          title: 'Clique Hangout',
                          message: `You hung out with the ${cli.name}!`
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-2.5 py-1 rounded-lg shrink-0"
                    >
                      Hang Out
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      {/* POPUP: HIGHER ED ADMISSIONS STEP-BY-STEP WIZARD */}
      {activeView === 'higher_ed_wizard' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[360px] rounded-2xl shadow-2xl overflow-hidden border-2 border-red-600 flex flex-col max-h-[88vh] relative">
            
            {/* Wizard Header Banner */}
            <div className="bg-gradient-to-r from-red-700 via-orange-600 to-red-700 px-4 py-3 text-white flex items-center justify-between shadow">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-yellow-300" />
                <div>
                  <div className="font-black italic text-xs tracking-wider uppercase text-white">Higher Education Admissions</div>
                  <div className="text-[10px] text-yellow-200 font-bold">Step {wizardStep} of 4</div>
                </div>
              </div>

              <button
                onClick={() => setActiveView('main')}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-black text-xs"
              >
                ✕
              </button>
            </div>

            {/* Wizard Steps Content */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-slate-800">

              {/* STEP 1: SELECT INSTITUTION & PROGRAM TYPE */}
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div className="text-center space-y-1">
                    <h3 className="font-black text-sm text-slate-900 uppercase">Step 1: Choose School Level</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Select where you would like to apply for higher education:</p>
                  </div>

                  <div className="space-y-2">
                    {/* 1. University */}
                    <div
                      onClick={() => {
                        setSelectedLevel('University');
                        setSelectedSchoolName('State University');
                        setSelectedTotalYears(4);
                        setSelectedTuition(12000);
                        setSelectedMajor('Computer Science');
                      }}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedLevel === 'University' ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🎓</span>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">University (Bachelor's Degree)</div>
                          <div className="text-[10px] text-slate-500">4 Years • {formatMoney(12000)}/year tuition</div>
                        </div>
                      </div>
                      {selectedLevel === 'University' && <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />}
                    </div>

                    {/* 2. Community College */}
                    <div
                      onClick={() => {
                        setSelectedLevel('Community College');
                        setSelectedSchoolName('City Community College');
                        setSelectedTotalYears(2);
                        setSelectedTuition(4500);
                        setSelectedMajor('General Studies & Liberal Arts');
                      }}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedLevel === 'Community College' ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🏫</span>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">Community College (Associate)</div>
                          <div className="text-[10px] text-slate-500">2 Years • {formatMoney(4500)}/year tuition</div>
                        </div>
                      </div>
                      {selectedLevel === 'Community College' && <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />}
                    </div>

                    {/* 3. Trade & Vocational School */}
                    <div
                      onClick={() => {
                        setSelectedLevel('Trade School');
                        setSelectedSchoolName('Apex Vocational Institute');
                        setSelectedTotalYears(2);
                        setSelectedTuition(6000);
                        setSelectedMajor('Electrical Technology & Wiring');
                      }}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedLevel === 'Trade School' ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🔧</span>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">Trade & Vocational School</div>
                          <div className="text-[10px] text-slate-500">2 Years • {formatMoney(6000)}/year tuition</div>
                        </div>
                      </div>
                      {selectedLevel === 'Trade School' && <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />}
                    </div>

                    {/* 4. Advanced Graduate / Law / Med Programs */}
                    <div className="pt-2">
                      <div className="text-[10px] font-extrabold uppercase text-slate-500 mb-1">Graduate & Professional Schools</div>
                      <div className="space-y-1.5">
                        {HIGHER_ED_PROGRAMS.map((prog) => {
                          let defaultSchoolName = prog.name;
                          let icon = '🎓';
                          if (prog.id === 'nursing_school') { defaultSchoolName = 'St. Jude Nursing School'; icon = '🩺'; }
                          else if (prog.id === 'business_school') { defaultSchoolName = 'Wharton Business School'; icon = '💼'; }
                          else if (prog.id === 'law_school') { defaultSchoolName = 'Harvard Law School'; icon = '⚖️'; }
                          else if (prog.id === 'medical_school') { defaultSchoolName = 'Johns Hopkins School of Medicine'; icon = '🏥'; }
                          else if (prog.id === 'dental_school') { defaultSchoolName = 'Columbia Dental School'; icon = '🦷'; }
                          else if (prog.id === 'pharmacy_school') { defaultSchoolName = 'University Pharmacy School'; icon = '💊'; }
                          else if (prog.id === 'veterinary_school') { defaultSchoolName = 'Cornell Veterinary School'; icon = '🐾'; }
                          else if (prog.id === 'grad_school') { defaultSchoolName = 'State Graduate School'; icon = '🎓'; }

                          return (
                            <div
                              key={prog.id}
                              onClick={() => {
                                setSelectedLevel(prog.name as EducationLevel);
                                setSelectedSchoolName(defaultSchoolName);
                                setSelectedTotalYears(prog.durationYears);
                                setSelectedTuition(prog.costPerYear);
                                const majors = getOfferedMajorsForLevel(prog.name as EducationLevel);
                                setSelectedMajor(majors[0]);
                              }}
                              className={`p-2.5 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedLevel === prog.name ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{icon}</span>
                                <div>
                                  <div className="font-extrabold text-xs text-slate-900">{prog.name}</div>
                                  <div className="text-[10px] text-slate-500">{prog.durationYears} Yrs • {formatMoney(prog.costPerYear)}/yr</div>
                                </div>
                              </div>
                              {selectedLevel === prog.name && <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow text-xs uppercase flex items-center justify-center gap-1 active:scale-95 transition"
                  >
                    <span>Next: Select Funding Method</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: SELECT FUNDING METHOD */}
              {wizardStep === 2 && (
                <div className="space-y-3">
                  <div className="text-center space-y-1">
                    <h3 className="font-black text-sm text-slate-900 uppercase">Step 2: Choose Funding</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Tuition for {selectedSchoolName} is <span className="font-extrabold text-slate-900">{formatMoney(selectedTuition)}/year</span>. How will you pay?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* Funding 1: Scholarship */}
                    <div
                      onClick={() => setSelectedFunding('scholarship')}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedFunding === 'scholarship' ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="w-6 h-6 text-yellow-600 shrink-0" />
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">🎓 Academic Scholarship</div>
                          <div className="text-[10px] text-emerald-700 font-bold">100% Free Tuition (Requires High Grades/Smarts)</div>
                        </div>
                      </div>
                      {selectedFunding === 'scholarship' && <CheckCircle2 className="w-5 h-5 text-red-600" />}
                    </div>

                    {/* Funding 2: Ask Parents */}
                    <div
                      onClick={() => setSelectedFunding('parents')}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedFunding === 'parents' ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">👨‍👩‍👦</span>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">Ask Parents to Pay</div>
                          <div className="text-[10px] text-slate-500">Parents pay tuition if relationship is good</div>
                        </div>
                      </div>
                      {selectedFunding === 'parents' && <CheckCircle2 className="w-5 h-5 text-red-600" />}
                    </div>

                    {/* Funding 3: Student Loan */}
                    <div
                      onClick={() => setSelectedFunding('loan')}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedFunding === 'loan' ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <DollarSign className="w-6 h-6 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">🏦 Student Loan</div>
                          <div className="text-[10px] text-slate-500">Finance education via low-interest student loans</div>
                        </div>
                      </div>
                      {selectedFunding === 'loan' && <CheckCircle2 className="w-5 h-5 text-red-600" />}
                    </div>

                    {/* Funding 4: Pay Cash */}
                    <div
                      onClick={() => setSelectedFunding('cash')}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${selectedFunding === 'cash' ? 'border-red-600 bg-red-50/60 shadow' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">💵</span>
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">Pay Cash Out of Pocket</div>
                          <div className="text-[10px] text-slate-500">Current Balance: {formatMoney(bankBalance)}</div>
                        </div>
                      </div>
                      {selectedFunding === 'cash' && <CheckCircle2 className="w-5 h-5 text-red-600" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl text-xs uppercase"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleWizardNextToMajor}
                      className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow text-xs uppercase flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <span>Next: Select Major ➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CHOOSE OFFERED MAJOR / SUBJECT */}
              {wizardStep === 3 && (
                <div className="space-y-3">
                  <div className="text-center space-y-1">
                    <h3 className="font-black text-sm text-slate-900 uppercase">Step 3: Select Your Major</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Select your field of study for {selectedSchoolName}:</p>
                  </div>

                  {/* Major Search Box */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search offered majors & subjects..."
                      value={majorSearchQuery}
                      onChange={(e) => setMajorSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* List of offered majors */}
                  <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200">
                    {getOfferedMajorsForLevel(selectedLevel)
                      .filter(m => m.toLowerCase().includes(majorSearchQuery.toLowerCase()))
                      .map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedMajor(m)}
                          className={`p-2.5 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between text-xs font-extrabold ${selectedMajor === m ? 'bg-red-50 text-red-700' : 'text-slate-800'}`}
                        >
                          <span>{m}</span>
                          {selectedMajor === m && <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />}
                        </div>
                      ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl text-xs uppercase"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setWizardStep(4)}
                      className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow text-xs uppercase flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <span>Review & Apply ➔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: ADMISSION ACCEPTANCE CERTIFICATE & ENROLLMENT */}
              {wizardStep === 4 && (
                <div className="space-y-3 text-center">
                  <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-400 p-4 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
                    <div className="text-3xl">🎓</div>
                    <div className="text-xs font-black uppercase text-amber-800 tracking-widest">OFFICIAL ADMISSION ACCEPTANCE</div>
                    <h3 className="text-base font-black text-slate-900">{selectedSchoolName}</h3>
                    
                    <div className="py-2 text-xs text-slate-700 font-medium leading-relaxed border-t border-b border-amber-200 my-2 space-y-1 text-left">
                      <div><span className="font-extrabold text-slate-900">Student:</span> {firstName} {lastName}</div>
                      <div><span className="font-extrabold text-slate-900">Program:</span> {selectedLevel} ({selectedTotalYears} Years)</div>
                      <div><span className="font-extrabold text-slate-900">Major / Field:</span> <span className="text-red-700 font-extrabold">{selectedMajor}</span></div>
                      <div><span className="font-extrabold text-slate-900">Tuition:</span> {formatMoney(selectedTuition)} / Year</div>
                      <div><span className="font-extrabold text-slate-900">Funding Method:</span> <span className="capitalize font-bold text-emerald-700">{selectedFunding}</span></div>
                    </div>

                    <p className="text-[10px] text-slate-500 italic">By clicking below, you officially enroll as a full-time student.</p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setWizardStep(3)}
                      className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl text-xs uppercase"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmWizardEnrollment}
                      className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow-lg text-xs uppercase active:scale-95 transition"
                    >
                      🎓 Confirm Enrollment
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* POPUP: CHANGE MAJOR WHEN ENROLLED */}
      {activeView === 'change_major_popup' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl overflow-hidden border-2 border-red-600 p-4 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-black text-sm text-slate-900 uppercase">Change Major / Field</h3>
              <button onClick={() => setActiveView('main')} className="text-slate-400 font-bold text-xs">✕</button>
            </div>

            <p className="text-xs text-slate-600 font-medium">Select a new major for {edState.schoolName || edState.level}:</p>

            <div className="max-h-[200px] overflow-y-auto divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200">
              {getOfferedMajorsForLevel(edState.level).map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => handleChangeCurrentMajor(m)}
                  className={`p-2.5 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between text-xs font-bold ${edState.major === m ? 'text-red-600 bg-red-50' : 'text-slate-800'}`}
                >
                  <span>{m}</span>
                  {edState.major === m && <CheckCircle2 className="w-4 h-4 text-red-600" />}
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveView('main')}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs uppercase"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* POPUP 1: SCHOOL INFO DIALOG */}
      {activeView === 'school_info' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#f2f2f2] w-full max-w-[320px] rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500 relative">
            <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 px-3 py-2 text-white flex items-center justify-between border-b-2 border-red-800">
              <button
                onClick={() => setActiveView('main')}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-black text-xs"
              >
                ✕
              </button>
              <div className="flex items-center gap-1 text-xs font-bold">
                <span className="text-base">{avatarIcon || '👤'}</span>
                <span>{firstName} {lastName}</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-center gap-2 text-red-700 font-black text-lg">
                <span className="text-2xl">🏫</span>
                <span>{getDisplayLevelName(edState.level)}</span>
              </div>

              <div className="bg-white rounded-xl border border-slate-300 divide-y divide-slate-200 text-xs overflow-hidden">
                <div className="p-2.5 flex justify-between bg-slate-50">
                  <span className="font-extrabold text-slate-700">School:</span>
                  <span className="font-semibold text-slate-900">{edState.schoolName || 'Public School'}</span>
                </div>
                {edState.major && (
                  <div className="p-2.5 flex justify-between bg-white">
                    <span className="font-extrabold text-slate-700">Major / Subject:</span>
                    <span className="font-bold text-red-600">{edState.major}</span>
                  </div>
                )}
                <div className="p-2.5 flex justify-between bg-slate-50">
                  <span className="font-extrabold text-slate-700">Years Completed:</span>
                  <span className="font-semibold text-slate-900">{edState.yearsCompleted} / {edState.totalYears}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveView('main')}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-2 rounded-xl text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: PRIVATE SCHOOL MODAL */}
      {activeView === 'private_school_popup' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[320px] rounded-2xl shadow-2xl overflow-hidden border-2 border-red-500 relative">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-3 py-2 text-white flex items-center justify-between">
              <button
                onClick={() => setActiveView('main')}
                className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-black text-xs"
              >
                ✕
              </button>
              <span className="font-black italic text-sm text-white">Private School</span>
            </div>

            <div className="p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 font-black text-lg text-slate-900">
                <span className="text-2xl">💰</span>
                <span>Private School Request</span>
              </div>

              <p className="text-xs font-semibold text-slate-700">
                Ask your parents if you can switch to a private school today!
              </p>

              <button
                onClick={handleDoSwitchPrivate}
                className="w-full bg-[#007aff] hover:bg-blue-600 text-white font-black py-2.5 rounded-xl text-xs uppercase shadow transition active:scale-95"
              >
                Do it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 3: DROP OUT CONFIRM DIALOG */}
      {activeView === 'drop_out_confirm' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[280px] rounded-2xl shadow-2xl p-5 text-center space-y-4 border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Confirm Drop Out</h3>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              Are you sure you want to drop out of {edState.level.toLowerCase()} school?
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={handleConfirmDropOut}
                className="w-full bg-[#007aff] hover:bg-blue-600 text-white font-extrabold py-2 rounded-xl text-xs transition active:scale-95"
              >
                Yes
              </button>
              <button
                onClick={() => setActiveView('main')}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold py-2 rounded-xl text-xs transition active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLASSMATE INTERACTION MODAL */}
      {selectedClassmate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[300px] rounded-2xl shadow-2xl p-4 text-center space-y-3 border border-slate-200">
            <div className="text-4xl">{selectedClassmate.avatarIcon}</div>
            <h3 className="text-sm font-black text-slate-900">{selectedClassmate.name}</h3>
            <p className="text-xs text-slate-500 font-medium">Classmate • Rel: {selectedClassmate.relationship}%</p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleInteractClassmate('befriend')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2 rounded-xl text-xs shadow"
              >
                🤝 Befriend
              </button>
              <button
                onClick={() => handleInteractClassmate('compliment')}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-2 rounded-xl text-xs shadow"
              >
                💬 Compliment
              </button>
              <button
                onClick={() => handleInteractClassmate('ask_out')}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-2 rounded-xl text-xs shadow"
              >
                ❤️ Ask Out
              </button>
              <button
                onClick={() => handleInteractClassmate('insult')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded-xl text-xs shadow"
              >
                🗣️ Insult
              </button>
            </div>

            <button
              onClick={() => setSelectedClassmate(null)}
              className="w-full mt-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-1.5 rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* GENERIC RESULT POPUP */}
      {popupMsg && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#f7f9fa] w-full max-w-[290px] rounded-2xl shadow-2xl border border-slate-300 p-5 text-center space-y-3">
            <h3 className="text-base font-black text-[#0050a0]">
              {popupMsg.title}
            </h3>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {popupMsg.message}
            </p>
            <button
              onClick={() => {
                if (popupMsg.onOk) popupMsg.onOk();
                setPopupMsg(null);
              }}
              className="w-full bg-[#007aff] hover:bg-blue-600 text-white font-black py-2 rounded-xl text-xs uppercase shadow transition active:scale-95"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
