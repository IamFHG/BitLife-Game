import React from 'react';
import { DeceasedRecord } from '../types';
import { formatMoney } from '../utils/gameUtils';
import { Skull, X, Trophy, Award } from 'lucide-react';

interface GraveyardModalProps {
  graveyard: DeceasedRecord[];
  onClose: () => void;
  onClearGraveyard: () => void;
}

export const GraveyardModal: React.FC<GraveyardModalProps> = ({ graveyard, onClose, onClearGraveyard }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full max-w-[350px] rounded-2xl shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-4 py-3 text-white flex items-center justify-between border-b-2 border-slate-600">
          <div className="flex items-center gap-2">
            <Skull className="w-6 h-6 text-slate-300" />
            <h2 className="text-xl font-black italic tracking-wide text-amber-300 drop-shadow">
              Graveyard & Ancestry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {graveyard.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-medium space-y-1">
              <div className="text-4xl">🪦</div>
              <p>The graveyard is currently empty.</p>
              <p className="text-xs text-slate-400">Completed lives will be remembered here eternally.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {graveyard.map(record => (
                <div
                  key={record.id}
                  className="bg-white p-4 rounded-xl border-2 border-slate-300 shadow-sm space-y-2 relative overflow-hidden"
                >
                  {/* Top Ribbon Badge */}
                  <div className="absolute top-2 right-2 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm border border-amber-300">
                    <Award className="w-3 h-3" />
                    <span>{record.ribbon}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-4xl bg-slate-100 p-2 rounded-2xl border border-slate-200">
                      {record.avatarIcon || '🪦'}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{record.name}</h3>
                      <div className="text-xs text-slate-500 font-semibold">
                        Lived {record.ageAtDeath} years • {record.city}, {record.country}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed font-medium">
                    <p><strong>Cause of Death:</strong> {record.causeOfDeath}</p>
                    <p><strong>Net Worth:</strong> {formatMoney(record.netWorth)}</p>
                    <p><strong>Career:</strong> {record.primaryCareer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {graveyard.length > 0 && (
          <div className="p-3 bg-slate-100 border-t border-slate-200 text-right">
            <button
              onClick={onClearGraveyard}
              className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider"
            >
              Clear All Graveyard Records
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
