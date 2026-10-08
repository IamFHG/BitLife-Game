import React from 'react';
import { CharacterStats } from '../types';

interface StatsBarProps {
  stats: CharacterStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const renderStatRow = (label: string, emoji: string, value: number, colorBg: string) => {
    const clampedValue = Math.max(0, Math.min(100, Math.round(value)));

    return (
      <div className="flex items-center gap-2 text-xs font-black text-[#025a9e] my-0.5">
        {/* Label & Emoji */}
        <div className="w-24 flex items-center justify-between shrink-0">
          <span>{label}</span>
          <span className="text-sm leading-none">{emoji}</span>
        </div>

        {/* Bar */}
        <div className="flex-1 bg-slate-200/90 h-3.5 rounded-full overflow-hidden border border-slate-300 shadow-inner p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colorBg}`}
            style={{ width: `${clampedValue}%` }}
          />
        </div>

        {/* Percentage Badge */}
        <div className="w-10 text-right font-black text-[#025a9e]">
          {clampedValue}%
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#fdf8d8] border-t border-amber-200 px-4 py-2 shadow-inner z-10 relative overflow-hidden">
      {/* Faint Star Watermark Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#fde047_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-35 pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-0.5 relative z-10">
        {renderStatRow('Happiness', '😆', stats.happiness, 'bg-[#16a34a]')}
        {renderStatRow('Health', '❤️', stats.health, stats.health > 40 ? 'bg-[#16a34a]' : 'bg-red-500')}
        {renderStatRow('Smarts', '💡', stats.smarts, 'bg-[#16a34a]')}
        {renderStatRow('Looks', '🔥', stats.looks, 'bg-[#16a34a]')}
        {stats.fame !== undefined && stats.fame > 0 && renderStatRow('Fame', '⭐', stats.fame, 'bg-amber-400')}
      </div>
    </div>
  );
};

