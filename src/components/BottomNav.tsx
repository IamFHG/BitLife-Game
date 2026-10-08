import React from 'react';
import { Briefcase, Coins, Heart, MoreHorizontal, Plus, Minus, ShoppingCart } from 'lucide-react';

interface BottomNavProps {
  onOpenTab: (tabName: 'jobs' | 'assets' | 'relationships' | 'activities' | 'education') => void;
  onAgeUp: () => void;
  onAgeDown?: () => void;
  isDead?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenTab, onAgeUp, onAgeDown, isDead }) => {
  return (
    <div className="relative bg-[#0070bb] text-white border-t border-[#005a96] shadow-2xl z-20 shrink-0">
      {/* Community / Sale Action Pill Bar above Bottom Nav */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 bg-gradient-to-b from-transparent to-[#006bb3]">
        <button className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-red-400/50">
          <span className="text-xs">💊</span>
          <span>BitLife Community...</span>
        </button>

        <button className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[11px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-emerald-400/50 uppercase tracking-tight">
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>SALE!</span>
        </button>
      </div>

      {/* Floating Center Age Button */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center z-30 pointer-events-auto">
        <div className="relative">
          {/* Big Green + Age Button with thick white border */}
          <button
            onClick={onAgeUp}
            disabled={isDead}
            className={`w-20 h-20 rounded-full bg-[#16a34a] border-[5px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center transition-transform active:scale-95 group hover:bg-[#15803d] ${
              isDead ? 'opacity-50 grayscale cursor-not-allowed' : ''
            }`}
            title="Age 1 Year"
          >
            <Plus className="w-9 h-9 stroke-[4] text-white drop-shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-white font-black text-[11px] uppercase tracking-tight -mt-1 drop-shadow-sm">
              Age
            </span>
          </button>

          {/* Small Red - Age Button */}
          {onAgeDown && !isDead && (
            <button
              onClick={onAgeDown}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-600 border-2 border-white text-white flex items-center justify-center shadow-md active:scale-90 transition hover:bg-red-700"
              title="Age Rewind"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Navigation Row */}
      <div className="grid grid-cols-5 items-center text-center pt-1 pb-2 px-1 text-xs font-extrabold">
        {/* Occupation */}
        <button
          onClick={() => onOpenTab('jobs')}
          disabled={isDead}
          className="flex flex-col items-center justify-center gap-1 py-1 hover:bg-white/10 rounded-lg transition active:scale-95 disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-full bg-[#f97316] flex items-center justify-center shadow-md border-2 border-white/80">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-white drop-shadow-sm text-[11px]">Occupation</span>
        </button>

        {/* Assets */}
        <button
          onClick={() => onOpenTab('assets')}
          disabled={isDead}
          className="flex flex-col items-center justify-center gap-1 py-1 hover:bg-white/10 rounded-lg transition active:scale-95 disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-full bg-[#06b6d4] flex items-center justify-center shadow-md border-2 border-white/80">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-white drop-shadow-sm text-[11px]">Assets</span>
        </button>

        {/* Spacer for center floating button */}
        <div className="h-10" />

        {/* Relationships */}
        <button
          onClick={() => onOpenTab('relationships')}
          disabled={isDead}
          className="flex flex-col items-center justify-center gap-1 py-1 hover:bg-white/10 rounded-lg transition active:scale-95 disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-full bg-[#06b6d4] flex items-center justify-center shadow-md border-2 border-white/80">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-white drop-shadow-sm text-[11px]">Relationships</span>
        </button>

        {/* Activities */}
        <button
          onClick={() => onOpenTab('activities')}
          disabled={isDead}
          className="flex flex-col items-center justify-center gap-1 py-1 hover:bg-white/10 rounded-lg transition active:scale-95 disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-full bg-[#06b6d4] flex items-center justify-center shadow-md border-2 border-white/80">
            <MoreHorizontal className="w-6 h-6 text-white stroke-[3]" />
          </div>
          <span className="text-white drop-shadow-sm text-[11px]">Activities</span>
        </button>
      </div>
    </div>
  );
};

