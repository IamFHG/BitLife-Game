import React, { useState } from 'react';
import { Gender, SpecialTalent } from '../types';
import { COUNTRIES_CITIES } from '../data/initialData';
import { generateRandomName, getRandomElement } from '../utils/gameUtils';
import { Sparkles, Dices, UserPlus, X } from 'lucide-react';

interface NewLifeModalProps {
  onStartNewLife: (name: { firstName: string; lastName: string }, gender: Gender, talent: SpecialTalent) => void;
  onClose?: () => void;
  canCancel?: boolean;
}

export const NewLifeModal: React.FC<NewLifeModalProps> = ({ onStartNewLife, onClose, canCancel = false }) => {
  const [gender, setGender] = useState<Gender>('Male');
  const [name, setName] = useState(() => generateRandomName('Male'));
  const [talent, setTalent] = useState<SpecialTalent>('Acting');

  const handleRandomize = () => {
    const newGender: Gender = Math.random() > 0.5 ? 'Male' : 'Female';
    setGender(newGender);
    setName(generateRandomName(newGender));
    setTalent(getRandomElement(['None', 'Acting', 'Music', 'Athletics', 'Crime', 'Business', 'Smarts'] as SpecialTalent[]));
  };

  const handleStart = () => {
    if (!name.firstName.trim() || !name.lastName.trim()) return;
    onStartNewLife(name, gender, talent);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full max-w-[350px] rounded-2xl shadow-2xl border-4 border-red-500 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 px-4 py-3 text-white flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-white" />
            <h2 className="text-xl font-black italic tracking-wide text-yellow-300 drop-shadow">
              Create Custom Life
            </h2>
          </div>
          {canCancel && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-red-800/80 hover:bg-red-900 flex items-center justify-center text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-slate-800">
          {/* Randomizer Button */}
          <button
            onClick={handleRandomize}
            className="w-full bg-amber-400 hover:bg-amber-500 text-red-950 font-black py-2.5 px-4 rounded-xl shadow transition active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider border border-amber-300"
          >
            <Dices className="w-5 h-5" />
            <span>Randomize Character</span>
          </button>

          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-slate-600 mb-1">First Name</label>
              <input
                type="text"
                value={name.firstName}
                onChange={(e) => setName({ ...name, firstName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-300 focus:border-red-500 rounded-xl font-bold text-sm text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-600 mb-1">Last Name</label>
              <input
                type="text"
                value={name.lastName}
                onChange={(e) => setName({ ...name, lastName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-300 focus:border-red-500 rounded-xl font-bold text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Male', 'Female', 'Non-Binary'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-2 px-2 rounded-xl font-bold text-xs transition border ${
                    gender === g ? 'bg-red-600 text-white border-red-700 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g === 'Male' ? '👦 Male' : g === 'Female' ? '👧 Female' : '✨ Non-Binary'}
                </button>
              ))}
            </div>
          </div>

          {/* Special Talent */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-1">Special Talent / Affinity</label>
            <select
              value={talent}
              onChange={(e) => setTalent(e.target.value as SpecialTalent)}
              className="w-full p-2.5 bg-white border border-slate-300 focus:border-red-500 rounded-xl font-bold text-sm text-slate-800 focus:outline-none"
            >
              <option value="None">None (Standard)</option>
              <option value="Acting">🎭 Acting & Hollywood Fame</option>
              <option value="Music">🎵 Music & Popstar</option>
              <option value="Athletics">⚽ Athletics & Sports</option>
              <option value="Business">💼 Business & Entrepreneurship</option>
              <option value="Smarts">🧠 Academic Genius</option>
              <option value="Crime">🥷 Criminal Mastermind</option>
            </select>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 hover:from-emerald-600 hover:to-teal-800 text-white font-black py-3.5 rounded-xl shadow-lg transition active:scale-[0.98] text-lg uppercase tracking-wider border border-emerald-300 flex items-center justify-center gap-2 mt-2"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>Start Life</span>
          </button>
        </div>
      </div>
    </div>
  );
};
