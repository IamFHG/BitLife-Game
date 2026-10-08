import React, { useState } from 'react';
import { GameState } from '../types';
import { Wand2, X, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { formatMoney } from '../utils/gameUtils';

interface CustomAiActionModalProps {
  state: GameState;
  onClose: () => void;
  onApplyCustomResult: (result: {
    resultText: string;
    statChanges?: any;
    moneyChange?: number;
    jailYears?: number;
  }) => void;
}

export const CustomAiActionModal: React.FC<CustomAiActionModalProps> = ({
  state,
  onClose,
  onApplyCustomResult
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    resultText: string;
    statChanges?: any;
    moneyChange?: number;
    jailYears?: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExecutePrompt = async () => {
    if (!promptInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/custom-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: state.character,
          customActionPrompt: promptInput.trim()
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        setAiResult(data.result);
      } else {
        setErrorMessage(data.error || 'Failed to process AI scenario action.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Network error connecting to Gemini AI server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (aiResult) {
      onApplyCustomResult(aiResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full max-w-[350px] rounded-2xl shadow-2xl border-4 border-purple-500 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 px-4 py-3 text-white flex items-center justify-between border-b-2 border-yellow-300">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 text-purple-950 p-1.5 rounded-xl font-black">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-wide text-yellow-300 drop-shadow">
                Gemini AI Custom Action
              </h2>
              <p className="text-[10px] text-purple-100 font-medium">
                Type ANY action you want your character to attempt!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-900/80 hover:bg-purple-950 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-slate-800">
          {!aiResult ? (
            <>
              <div>
                <label className="block text-xs font-black uppercase text-purple-900 mb-1.5 tracking-wider">
                  Describe what you want to do:
                </label>
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder='e.g. "I try to convince a famous director to give me a cameo in his sci-fi movie", "I start a backyard wrestling league", "I try to tame a stray hawk"'
                  className="w-full p-3 bg-white border-2 border-purple-200 focus:border-purple-600 rounded-xl font-medium text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-inner"
                />
              </div>

              {/* Preset suggestion chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Or pick a quick prompt:</span>
                <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                  <button
                    onClick={() => setPromptInput("I want to enter a spicy chili eating contest for a cash prize.")}
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition"
                  >
                    🌶️ Chili Contest
                  </button>
                  <button
                    onClick={() => setPromptInput("I try to start a viral TikTok food review channel.")}
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition"
                  >
                    📱 Viral TikTok
                  </button>
                  <button
                    onClick={() => setPromptInput("I challenge the town mayor to an arm wrestling match.")}
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition"
                  >
                    💪 Arm Wrestle Mayor
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-xl text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleExecutePrompt}
                disabled={isLoading || !promptInput.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-black py-3.5 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 text-base uppercase tracking-wider disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gemini Narrating Outcome...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>Execute Choice with AI</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Result Screen */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-xl shadow-inner space-y-2">
                <div className="text-purple-900 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" /> AI Evaluation Outcome
                </div>
                <p className="text-base font-semibold leading-relaxed text-slate-800">
                  {aiResult.resultText}
                </p>

                {/* Consequences summary */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-black">
                  {aiResult.moneyChange !== undefined && aiResult.moneyChange !== 0 && (
                    <span className={`px-2 py-1 rounded ${aiResult.moneyChange > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {aiResult.moneyChange > 0 ? '+' : ''}{formatMoney(aiResult.moneyChange)}
                    </span>
                  )}
                  {aiResult.statChanges?.happiness && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                      Happiness {aiResult.statChanges.happiness > 0 ? '+' : ''}{aiResult.statChanges.happiness}%
                    </span>
                  )}
                  {aiResult.statChanges?.health && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      Health {aiResult.statChanges.health > 0 ? '+' : ''}{aiResult.statChanges.health}%
                    </span>
                  )}
                  {aiResult.statChanges?.smarts && (
                    <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded">
                      Smarts {aiResult.statChanges.smarts > 0 ? '+' : ''}{aiResult.statChanges.smarts}%
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-3.5 rounded-xl shadow-lg transition active:scale-[0.98] text-base uppercase tracking-wider"
              >
                Apply Consequences & Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
