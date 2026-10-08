import React from 'react';
import { Menu, Star } from 'lucide-react';
import { GameState } from '../types';
import { formatMoney } from '../utils/gameUtils';

interface TopHeaderProps {
  state: GameState;
  onOpenMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ state, onOpenMenu }) => {
  const { character } = state;
  const isDead = !character.isAlive;

  return (
    <header className="bg-red-600 text-white shadow-md relative z-20 shrink-0">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-red-700 relative">
        {/* Menu Button */}
        <button
          onClick={onOpenMenu}
          className="w-8 h-8 rounded-full border-2 border-white/80 bg-red-700 hover:bg-red-800 flex items-center justify-center text-white transition active:scale-95 shadow-sm"
          title="Open Game Menu"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Game Logo */}
        <div className="flex items-center gap-1.5">
          <div className="bg-white/20 p-1 rounded-full flex items-center justify-center">
            <span className="text-base leading-none">👶</span>
          </div>
          <h1 className="text-2xl font-black italic tracking-tight text-yellow-300 drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.8)] font-sans">
            BitLife
          </h1>
        </div>

        {/* Badges / Version */}
        <div className="flex items-center gap-1.5">
          <div className="bg-yellow-400 text-red-950 px-2 py-0.5 rounded-full font-black text-[11px] flex items-center gap-0.5 shadow-sm border border-yellow-200">
            <Star className="w-3 h-3 fill-red-950 stroke-none" />
            <span>1</span>
          </div>
          <div className="bg-yellow-400 text-red-900 px-1.5 py-0.5 rounded text-[9px] font-black tracking-tight uppercase border border-yellow-200 shadow-sm flex items-center gap-0.5">
            <span>BITIZEN</span>
          </div>
          <span className="text-[9px] text-red-200 font-mono hidden sm:inline">v3.22a</span>
        </div>
      </div>

      {/* Character Profile Sub-header with Cream Background & Star Watermark */}
      <div className="bg-[#fdf8d8] text-slate-900 px-3 py-2 flex items-center justify-between border-b border-amber-200 shadow-sm relative overflow-hidden">
        {/* Faint Star Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#fde047_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-35 pointer-events-none" />

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="text-3xl leading-none relative">
            <span>{character.avatarIcon}</span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs">
                {character.country === 'United States' ? '🇺🇸' :
                 character.country === 'France' ? '🇫🇷' :
                 character.country === 'United Kingdom' ? '🇬🇧' :
                 character.country === 'Japan' ? '🇯🇵' : '🌐'}
              </span>
              <span className="font-extrabold text-[#025a9e] text-base tracking-tight leading-snug">
                {character.firstName} {character.lastName}
              </span>
              <span className="text-xs">💅</span>
            </div>
            <div className="text-[11px] font-semibold text-[#025a9e]/80 truncate max-w-[170px]">
              {isDead ? (
                <span className="text-red-600 font-bold">Deceased</span>
              ) : character.currentJob ? (
                `${character.currentJob.title} in '${character.currentJob.company}'`
              ) : character.age < 5 ? (
                'Infant'
              ) : character.age < 18 ? (
                `${character.education.level} Student`
              ) : (
                'Unemployed'
              )}
            </div>
          </div>
        </div>

        {/* Bank Balance Display */}
        <div className="text-right relative z-10">
          <div className="text-[10px] font-bold text-[#025a9e] leading-tight">
            Bank Balance
          </div>
          <div className={`text-base sm:text-lg font-extrabold ${character.bankBalance >= 0 ? 'text-[#15803d]' : 'text-red-600'}`}>
            {formatMoney(character.bankBalance)}
          </div>
        </div>
      </div>
    </header>
  );
};

