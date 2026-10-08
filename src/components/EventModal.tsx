import React, { useState } from 'react';
import { DecisionEvent, ChoiceOption } from '../types';
import { Sparkles } from 'lucide-react';

interface EventModalProps {
  event: DecisionEvent;
  onSelectOption: (option: ChoiceOption) => void;
  onClose?: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onSelectOption }) => {
  const [selectedResult, setSelectedResult] = useState<{ resultText: string; option: ChoiceOption } | null>(null);

  const handleChoose = (opt: ChoiceOption) => {
    setSelectedResult({ resultText: opt.resultText, option: opt });
  };

  const handleConfirmResult = () => {
    if (selectedResult) {
      onSelectOption(selectedResult.option);
    }
  };

  const handleSurpriseMe = () => {
    if (event.options && event.options.length > 0) {
      const randomOpt = event.options[Math.floor(Math.random() * event.options.length)];
      handleChoose(randomOpt);
    }
  };

  // Determine category tag for top right header banner
  const titleLower = event.title.toLowerCase();
  const categoryTag = titleLower.includes('school') ? 'School' :
                      titleLower.includes('job') || titleLower.includes('work') ? 'Work' :
                      titleLower.includes('argum') || titleLower.includes('relat') || titleLower.includes('friend') || titleLower.includes('mom') || titleLower.includes('dad') ? 'Social' :
                      titleLower.includes('crime') ? 'Crime' :
                      titleLower.includes('health') || titleLower.includes('doctor') ? 'Health' : 'Scenario';

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-[340px] rounded-2xl shadow-2xl border-[3px] border-red-500 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Red Header Bar matching BitLife reference */}
        <div className="bg-red-600 px-4 py-1 flex items-center justify-end border-b border-red-700">
          <span className="text-white font-black italic text-[11px] uppercase tracking-wider drop-shadow">
            {categoryTag}
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 text-slate-800 text-center">
          {!selectedResult ? (
            <>
              {/* Event Title with Emoji */}
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                  {event.title}
                </h3>
              </div>

              {/* Event Description */}
              <p className="text-xs font-medium text-slate-700 leading-relaxed px-1">
                {event.description}
              </p>

              {/* Decision Prompt */}
              <div className="text-xs font-black text-slate-900 pt-0.5">
                What will you do?
              </div>

              {/* Blue Choice Buttons */}
              <div className="space-y-2 pt-1">
                {event.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoose(opt)}
                    className="w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl shadow-sm transition active:scale-[0.98] text-xs leading-snug"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {/* Surprise Me Button */}
              <div className="pt-0.5">
                <button
                  onClick={handleSurpriseMe}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-800 transition active:scale-95"
                >
                  <span>🎲</span>
                  <span className="underline decoration-sky-300">Surprise me!</span>
                </button>
              </div>
            </>
          ) : (
            /* Result / Outcome Screen */
            <div className="space-y-3.5 py-1 animate-in zoom-in-95 duration-150">
              <div className="space-y-1">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Outcome
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-slate-800 text-xs font-semibold leading-relaxed">
                {selectedResult.resultText}
              </div>

              <button
                onClick={handleConfirmResult}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-2.5 px-4 rounded-xl shadow-sm transition active:scale-98 text-xs uppercase tracking-wider"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
