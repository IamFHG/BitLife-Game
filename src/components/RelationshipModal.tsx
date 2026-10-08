import React, { useState } from 'react';
import { PersonRelationship, GameState } from '../types';
import { Heart, X, Gift, Smile, Frown, DollarSign, Gem, UserMinus, Sparkles } from 'lucide-react';
import { formatMoney } from '../utils/gameUtils';

interface RelationshipModalProps {
  state: GameState;
  onClose: () => void;
  onInteract: (person: PersonRelationship, action: string, extraData?: any) => void;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({ state, onClose, onInteract }) => {
  const [selectedPerson, setSelectedPerson] = useState<PersonRelationship | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const aliveRelationships = state.relationships.filter(r => r.isAlive);

  const handleDoAction = (person: PersonRelationship, action: string, extraData?: any) => {
    let msg = '';
    if (action === 'spend_time') {
      msg = `You spent a wonderful afternoon with your ${person.relation.toLowerCase()}, ${person.name}.`;
    } else if (action === 'compliment') {
      msg = `You gave ${person.name} a glowing compliment on their outfit!`;
    } else if (action === 'insult') {
      msg = `You insulted ${person.name}! Things got pretty heated.`;
    } else if (action === 'give_gift') {
      msg = `You gave ${person.name} a fancy gift worth $200.`;
    } else if (action === 'ask_money') {
      msg = `You asked ${person.name} for some pocket cash.`;
    } else if (action === 'propose') {
      msg = `You got down on one knee and proposed to ${person.name}!`;
    } else if (action === 'breakup') {
      msg = `You ended your relationship with ${person.name}.`;
    }

    setActionFeedback(msg);
    onInteract(person, action, extraData);
  };

  return (
    <div className="fixed inset-0 z-40 max-w-md mx-auto w-full h-full bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-150 select-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-700 px-4 py-3 text-white flex items-center justify-between border-b-2 border-pink-300">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 fill-white text-white" />
            <h2 className="text-xl font-black italic tracking-wide text-white drop-shadow">
              Relationships
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-pink-800/80 hover:bg-pink-900 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List or Selected Person View */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {actionFeedback && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-900 p-2.5 rounded-xl font-semibold text-xs flex items-center justify-between">
              <span>{actionFeedback}</span>
              <button
                onClick={() => setActionFeedback(null)}
                className="text-[10px] bg-emerald-200 hover:bg-emerald-300 px-2 py-0.5 rounded text-emerald-950 font-bold"
              >
                OK
              </button>
            </div>
          )}

          {!selectedPerson ? (
            /* Relationships List */
            aliveRelationships.length === 0 ? (
              <p className="text-center text-slate-500 py-8 font-medium text-xs">No active relationships.</p>
            ) : (
              <div className="space-y-1.5">
                {aliveRelationships.map(person => (
                  <div
                    key={person.id}
                    onClick={() => setSelectedPerson(person)}
                    className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-pink-400 transition cursor-pointer flex items-center justify-between active:scale-[0.99] gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="text-xl bg-pink-50 w-9 h-9 flex items-center justify-center rounded-lg border border-pink-100 shrink-0">
                        {person.avatarIcon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{person.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 shrink-0">
                            {person.relation}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                          Age: {person.age} • {person.occupation || 'Unemployed'}
                        </div>
                      </div>
                    </div>

                    {/* Relationship Meter */}
                    <div className="w-24 text-right shrink-0">
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Relation</div>
                      <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300 mt-0.5">
                        <div
                          className={`h-full ${person.relationshipBar > 50 ? 'bg-pink-500' : 'bg-amber-500'}`}
                          style={{ width: `${person.relationshipBar}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Person Details & Action Menu */
            <div className="space-y-2.5">
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-[11px] font-extrabold text-pink-700 hover:text-pink-900 bg-pink-100/80 px-2.5 py-1 rounded-md flex items-center gap-1 inline-block"
              >
                ← Back to Relationships
              </button>

              <div className="bg-white p-3 rounded-xl border border-pink-200 shadow-2xs text-center space-y-1.5">
                <div className="text-4xl">{selectedPerson.avatarIcon}</div>
                <h3 className="text-base font-black text-slate-800">{selectedPerson.name}</h3>
                <div className="text-[10px] text-slate-500 font-medium">
                  {selectedPerson.relation} • Age {selectedPerson.age} • {selectedPerson.occupation || 'N/A'}
                </div>

                {/* Relationship Bar */}
                <div className="max-w-xs mx-auto pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                    <span>Relationship Meter</span>
                    <span>{selectedPerson.relationshipBar}%</span>
                  </div>
                  <div className="bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                    <div
                      className="bg-pink-500 h-full transition-all duration-300"
                      style={{ width: `${selectedPerson.relationshipBar}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDoAction(selectedPerson, 'spend_time')}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-2.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center justify-center gap-1.5 text-xs"
                >
                  <Smile className="w-3.5 h-3.5" /> Spend Time
                </button>

                <button
                  onClick={() => handleDoAction(selectedPerson, 'compliment')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-2.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center justify-center gap-1.5 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Compliment
                </button>

                <button
                  onClick={() => handleDoAction(selectedPerson, 'insult')}
                  className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-2.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center justify-center gap-1.5 text-xs"
                >
                  <Frown className="w-3.5 h-3.5" /> Insult
                </button>

                <button
                  onClick={() => handleDoAction(selectedPerson, 'give_gift')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-2.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center justify-center gap-1.5 text-xs"
                >
                  <Gift className="w-3.5 h-3.5" /> Give Gift ($200)
                </button>

                <button
                  onClick={() => handleDoAction(selectedPerson, 'ask_money')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center justify-center gap-1.5 text-xs"
                >
                  <DollarSign className="w-3.5 h-3.5" /> Ask for Money
                </button>

                {['Boyfriend', 'Girlfriend', 'Fiancé'].includes(selectedPerson.relation) && (
                  <button
                    onClick={() => handleDoAction(selectedPerson, 'propose')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-2.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center justify-center gap-1.5 text-xs col-span-2"
                  >
                    <Gem className="w-3.5 h-3.5" /> Propose Marriage!
                  </button>
                )}

                {['Boyfriend', 'Girlfriend', 'Husband', 'Wife'].includes(selectedPerson.relation) && (
                  <button
                    onClick={() => handleDoAction(selectedPerson, 'breakup')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2.5 rounded-lg shadow-2xs transition active:scale-95 flex items-center justify-center gap-1.5 text-xs col-span-2"
                  >
                    <UserMinus className="w-3.5 h-3.5" /> Break Up / Divorce
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
    </div>
  );
};
