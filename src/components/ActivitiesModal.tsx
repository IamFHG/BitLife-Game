import React, { useState } from 'react';
import { GameState } from '../types';
import { PLASTIC_SURGERIES, CRIMES_LIST } from '../data/initialData';
import { formatMoney } from '../utils/gameUtils';
import { MoreHorizontal, X, Stethoscope, Dumbbell, ShieldAlert, Heart, Ticket, Plane, Sparkles, Wand2, GraduationCap } from 'lucide-react';

interface ActivitiesModalProps {
  state: GameState;
  onClose: () => void;
  onDoActivity: (activityType: string, payload?: any) => void;
  onOpenAiCustomModal: () => void;
  onOpenEducation?: () => void;
}

export const ActivitiesModal: React.FC<ActivitiesModalProps> = ({
  state,
  onClose,
  onDoActivity,
  onOpenAiCustomModal,
  onOpenEducation
}) => {
  const [activeCategory, setActiveCategory] = useState<'main' | 'fitness' | 'doctor' | 'crime' | 'casino' | 'dating' | 'travel'>('main');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleActivityClick = (type: string, payload?: any) => {
    let msg = '';
    if (type === 'gym') msg = 'You worked out at the gym! Health and looks increased.';
    else if (type === 'meditate') msg = 'You meditated quietly for an hour. Happiness boost!';
    else if (type === 'read_book') msg = 'You finished reading a literature classic. Smarts increased!';
    else if (type === 'doctor_visit') msg = 'The doctor examined you and gave you a clean bill of health!';
    else if (type === 'lottery') msg = payload?.won ? `HOLY COW! You won ${formatMoney(payload.amount)} on the lottery ticket!` : 'You bought a $10 scratch ticket... Better luck next time!';
    else if (type === 'dating_app') msg = 'You matched with a attractive date on BitMatch!';
    else if (type === 'plastic_surgery') msg = `You underwent ${payload.name}! Your looks boosted by +${payload.looksBoost}%.`;
    else if (type === 'crime') msg = payload?.success ? `Crime successful! You got away with ${formatMoney(payload.moneyReward)}.` : 'BUSTED BY THE POLICE!';

    setFeedback(msg);
    onDoActivity(type, payload);
  };

  return (
    <div className="fixed inset-0 z-40 max-w-md mx-auto w-full h-full bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-150 select-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 px-4 py-3 text-white flex items-center justify-between border-b-2 border-teal-300">
          <div className="flex items-center gap-2">
            <MoreHorizontal className="w-6 h-6 text-white stroke-[3]" />
            <h2 className="text-xl font-black italic tracking-wide text-white drop-shadow">
              Activities & Life Choice
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-teal-800/80 hover:bg-teal-900 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="bg-teal-100 border-b border-teal-300 text-teal-950 p-3 font-bold text-sm flex items-center justify-between">
            <span>{feedback}</span>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs bg-teal-200 hover:bg-teal-300 px-2 py-1 rounded text-teal-950"
            >
              OK
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {activeCategory !== 'main' && (
            <button
              onClick={() => setActiveCategory('main')}
              className="text-[11px] font-extrabold text-teal-700 hover:text-teal-900 bg-teal-100/80 px-2.5 py-1 rounded-md mb-1 inline-block"
            >
              ← Back to Main Activities
            </button>
          )}

          {/* MAIN CATEGORIES LIST */}
          {activeCategory === 'main' && (
            <div className="space-y-2">
              {/* SPECIAL AI CUSTOM ACTION BANNER */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAiCustomModal();
                }}
                className="w-full text-left bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black p-3 rounded-xl shadow-sm border border-yellow-300/80 transition active:scale-[0.98] flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="bg-yellow-400 text-purple-950 p-2 rounded-lg shadow-2xs shrink-0">
                    <Wand2 className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black italic text-yellow-300 flex items-center gap-1.5 flex-wrap">
                      <span>Custom AI Scenario / Action</span>
                      <span className="bg-yellow-400 text-purple-950 text-[8px] uppercase font-black px-1.5 py-0.2 rounded">Gemini AI</span>
                    </div>
                    <div className="text-[10px] text-purple-100 font-medium truncate mt-0.5">
                      Type ANYTHING you want to do (e.g. "Try to launch a viral comedy show")
                    </div>
                  </div>
                </div>
                <span className="text-yellow-300 text-sm font-bold group-hover:translate-x-1 transition-transform ml-2 shrink-0">➔</span>
              </button>

              {/* Activity Categories Grid */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {onOpenEducation && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenEducation();
                    }}
                    className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-red-400 transition flex items-center gap-2.5 active:scale-95 col-span-2"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0 border border-red-100">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 flex-wrap">
                        <span>School & Education</span>
                        <span className="bg-red-100 text-red-700 text-[8px] uppercase font-black px-1.5 py-0.2 rounded">
                          {state.character.education.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">Classmates, Clubs, Cliques & Higher Ed</div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => setActiveCategory('fitness')}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-400 transition flex items-center gap-2.5 active:scale-95"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 border border-teal-100">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs truncate">Mind & Body</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">Gym, Meditate, Library</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveCategory('doctor')}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-400 transition flex items-center gap-2.5 active:scale-95"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0 border border-red-100">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs truncate">Doctor & Surgery</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">Checkups & Plastic Surgery</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveCategory('crime')}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-400 transition flex items-center gap-2.5 active:scale-95"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 border border-slate-200">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs truncate">Crime & Mischief</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">Heists, Pickpocket, GTA</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveCategory('dating')}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-400 transition flex items-center gap-2.5 active:scale-95"
                >
                  <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 shrink-0 border border-pink-100">
                    <Heart className="w-5 h-5 fill-pink-500" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs truncate">Nightlife & Romance</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">Dating App & Hookups</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveCategory('casino')}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-400 transition flex items-center gap-2.5 active:scale-95"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs truncate">Lottery & Casino</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">Scratchers & Gambling</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveCategory('travel')}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-400 transition flex items-center gap-2.5 active:scale-95"
                >
                  <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 border border-sky-100">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs truncate">Vacation & Travel</div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">Cruises & Emigration</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* FITNESS / MIND & BODY */}
          {activeCategory === 'fitness' && (
            <div className="space-y-1.5">
              <button
                onClick={() => handleActivityClick('gym')}
                className="w-full text-left bg-white p-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-800 hover:border-teal-400 flex items-center justify-between text-xs shadow-2xs"
              >
                <span>🏋️ Go to Gym (Free)</span>
                <span className="text-[10px] text-emerald-600 font-bold">+Health, +Looks</span>
              </button>

              <button
                onClick={() => handleActivityClick('meditate')}
                className="w-full text-left bg-white p-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-800 hover:border-teal-400 flex items-center justify-between text-xs shadow-2xs"
              >
                <span>🧘 Meditate (Free)</span>
                <span className="text-[10px] text-emerald-600 font-bold">+Happiness, +Karma</span>
              </button>

              <button
                onClick={() => handleActivityClick('read_book')}
                className="w-full text-left bg-white p-2.5 rounded-xl border border-slate-200 font-extrabold text-slate-800 hover:border-teal-400 flex items-center justify-between text-xs shadow-2xs"
              >
                <span>📚 Read Library Book (Free)</span>
                <span className="text-[10px] text-sky-600 font-bold">+Smarts</span>
              </button>
            </div>
          )}

          {/* DOCTOR & PLASTIC SURGERY */}
          {activeCategory === 'doctor' && (
            <div className="space-y-2">
              <button
                onClick={() => handleActivityClick('doctor_visit')}
                className="w-full text-left bg-white p-2.5 rounded-xl border border-emerald-300 font-extrabold text-slate-800 hover:border-emerald-500 flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="text-xs font-black">🩺 Doctor Examination</div>
                  <div className="text-[10px] text-slate-500 font-medium">Treat illnesses & check health ($200)</div>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md">Visit</span>
              </button>

              <div className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider pt-1">
                Plastic Surgery Clinic
              </div>

              {PLASTIC_SURGERIES.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-pink-300 shadow-2xs"
                >
                  <div>
                    <div className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                      <span>{s.icon}</span>
                      <span>{s.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">+{s.looksBoost}% Looks boost</div>
                  </div>

                  <button
                    onClick={() => handleActivityClick('plastic_surgery', s)}
                    className="bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md active:scale-95 transition"
                  >
                    Pay {formatMoney(s.cost)}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CRIME & MISCHIEF */}
          {activeCategory === 'crime' && (
            <div className="space-y-1.5">
              {CRIMES_LIST.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-slate-400 shadow-2xs"
                >
                  <div>
                    <div className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase ${c.risk === 'Low' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        Risk: {c.risk}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Reward: ~{formatMoney(c.moneyReward)} • Jail: {c.jailTime} yrs
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const success = Math.random() > (c.risk === 'Low' ? 0.3 : c.risk === 'Medium' ? 0.5 : 0.7);
                      handleActivityClick('crime', { success, moneyReward: c.moneyReward, jailTime: c.jailTime });
                    }}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-md active:scale-95 transition"
                  >
                    Attempt
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* CASINO & LOTTERY */}
          {activeCategory === 'casino' && (
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-xl border border-amber-300 shadow-2xs space-y-1.5">
                <div className="font-extrabold text-slate-800 text-xs">🎟️ Buy Lottery Ticket ($10)</div>
                <div className="text-[10px] text-slate-500 font-medium">1 in 50 chance to win a jackpot of $1,000,000!</div>
                <button
                  onClick={() => {
                    const won = Math.random() < 0.05;
                    handleActivityClick('lottery', { won, amount: 1000000 });
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider w-full shadow-2xs active:scale-95"
                >
                  Buy Scratch Ticket
                </button>
              </div>
            </div>
          )}

          {/* NIGHTLIFE & DATING */}
          {activeCategory === 'dating' && (
            <div className="space-y-1.5">
              <button
                onClick={() => handleActivityClick('dating_app')}
                className="w-full text-left bg-gradient-to-r from-pink-500 to-rose-600 text-white p-3 rounded-xl font-black text-xs shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black">🔥 Open BitMatch Dating App</div>
                  <div className="text-[10px] text-pink-100 font-medium">Search for new lovers & potential partners</div>
                </div>
                <span className="text-lg">➔</span>
              </button>
            </div>
          )}

          {/* TRAVEL */}
          {activeCategory === 'travel' && (
            <div className="space-y-1.5">
              <button
                onClick={() => handleActivityClick('gym')}
                className="w-full text-left bg-sky-600 text-white p-3 rounded-xl font-black text-xs shadow-2xs flex items-center justify-between"
              >
                <span>✈️ Book Luxury Beach Vacation ($3,000)</span>
                <span className="text-[10px] text-sky-100 font-medium">+Happiness, +Health</span>
              </button>
            </div>
          )}
        </div>
    </div>
  );
};
