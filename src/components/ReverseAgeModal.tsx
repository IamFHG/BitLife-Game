import React from 'react';
import { X, RotateCcw, Sparkles, FastForward, Baby } from 'lucide-react';

interface ReverseAgeModalProps {
  currentAge: number;
  onClose: () => void;
  onReverseAge: (yearsBack: number | 'birth') => void;
}

export const ReverseAgeModal: React.FC<ReverseAgeModalProps> = ({
  currentAge,
  onClose,
  onReverseAge
}) => {
  const rewindOptions: { label: string; sublabel: string; years: number | 'birth'; icon: string; disabled: boolean }[] = [
    {
      label: 'Rewind 1 Year',
      sublabel: currentAge > 0 ? `Return to Age ${currentAge - 1}` : 'Already at Age 0',
      years: 1,
      icon: '⏪',
      disabled: currentAge < 1
    },
    {
      label: 'Rewind 3 Years',
      sublabel: currentAge >= 3 ? `Return to Age ${currentAge - 3}` : `Only ${currentAge} years old`,
      years: 3,
      icon: '🕒',
      disabled: currentAge < 3
    },
    {
      label: 'Rewind 5 Years',
      sublabel: currentAge >= 5 ? `Return to Age ${currentAge - 5}` : `Only ${currentAge} years old`,
      years: 5,
      icon: '⏳',
      disabled: currentAge < 5
    },
    {
      label: 'Rewind 10 Years',
      sublabel: currentAge >= 10 ? `Return to Age ${currentAge - 10}` : `Only ${currentAge} years old`,
      years: 10,
      icon: '🚀',
      disabled: currentAge < 10
    },
    {
      label: 'To Birth Year',
      sublabel: 'Reset completely back to Age 0 (New Memories)',
      years: 'birth',
      icon: '👶',
      disabled: currentAge === 0
    }
  ];

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto w-full h-full bg-slate-950/75 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-3 animate-in fade-in duration-150 select-none">
      <div className="bg-white border-t sm:border border-slate-200 sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl text-slate-800">
        
        {/* Header */}
        <div className="bg-red-600 p-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-wider text-red-200">
                Time Machine • Reverse Age
              </div>
              <h2 className="text-xs font-black text-white">
                Current Age: {currentAge} Years Old
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-3 space-y-2">
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[10px] font-semibold leading-tight">
              Select how many years to reverse time. State, bank balance, and events will revert to that exact age!
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            {rewindOptions.map((opt, idx) => (
              <button
                key={idx}
                disabled={opt.disabled}
                onClick={() => {
                  onReverseAge(opt.years);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl border transition flex items-center justify-between text-left group active:scale-[0.99] shadow-2xs ${
                  opt.disabled
                    ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                    : opt.years === 'birth'
                    ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400'
                    : 'bg-white hover:bg-red-50/80 border-slate-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0 p-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    {opt.icon}
                  </span>
                  <div>
                    <div className={`font-black text-xs ${opt.years === 'birth' ? 'text-purple-900' : 'text-slate-800'}`}>
                      {opt.label}
                    </div>
                    <div className="text-[9px] font-semibold text-slate-500">
                      {opt.sublabel}
                    </div>
                  </div>
                </div>

                {!opt.disabled && (
                  <span className="text-[10px] font-black text-red-600 group-hover:translate-x-0.5 transition">
                    Rewind →
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cancel Button */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold py-2 rounded-xl text-xs uppercase transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
