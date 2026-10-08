import React from 'react';
import { X, UserPlus, Skull, Save, RotateCcw, HelpCircle, Star } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewLife: () => void;
  onOpenGraveyard: () => void;
  onSaveGame: () => void;
  onResetGame: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onNewLife,
  onOpenGraveyard,
  onSaveGame,
  onResetGame
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex justify-start animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white w-80 max-w-[85vw] h-full shadow-2xl flex flex-col border-r border-slate-700 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-between border-b border-red-500">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👶</span>
            <h2 className="text-xl font-black italic tracking-wider text-yellow-300 font-sans">
              BitLife Menu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-900/80 hover:bg-red-950 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button
            onClick={() => {
              onClose();
              onNewLife();
            }}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 text-white font-black p-3.5 rounded-xl transition flex items-center gap-3 border border-slate-700 active:scale-95"
          >
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <span>Start New Custom Life</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenGraveyard();
            }}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 text-white font-black p-3.5 rounded-xl transition flex items-center gap-3 border border-slate-700 active:scale-95"
          >
            <Skull className="w-5 h-5 text-amber-400" />
            <span>Hall of Fame & Graveyard</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onSaveGame();
            }}
            className="w-full text-left bg-slate-800 hover:bg-slate-700 text-white font-black p-3.5 rounded-xl transition flex items-center gap-3 border border-slate-700 active:scale-95"
          >
            <Save className="w-5 h-5 text-sky-400" />
            <span>Save Game Progress</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (confirm('Are you sure you want to abandon this current character and restart?')) {
                onResetGame();
              }
            }}
            className="w-full text-left bg-slate-800 hover:bg-red-900/40 text-red-400 font-black p-3.5 rounded-xl transition flex items-center gap-3 border border-slate-700 active:scale-95"
          >
            <RotateCcw className="w-5 h-5 text-red-400" />
            <span>Abandon Current Life</span>
          </button>

          {/* Info Card */}
          <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1 font-bold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>BitLife Simulator v3.22a</span>
            </div>
            <p>
              Features dynamic resource management, career paths, real estate, relationship meters, random decision events, and Gemini AI narrative choices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
