import React, { useEffect, useRef } from 'react';
import { LifeLog } from '../types';

interface LifeFeedProps {
  logs: LifeLog[];
}

export const LifeFeed: React.FC<LifeFeedProps> = ({ logs }) => {
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Group logs by Age
  const groupedLogs: { [age: number]: LifeLog[] } = {};
  logs.forEach(log => {
    if (!groupedLogs[log.age]) {
      groupedLogs[log.age] = [];
    }
    groupedLogs[log.age].push(log);
  });

  const sortedAges = Object.keys(groupedLogs)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white relative font-sans text-slate-800 selection:bg-yellow-200">
      <div className="relative z-10 max-w-xl mx-auto space-y-3">
        {sortedAges.map(age => (
          <div key={age} className="space-y-1 pb-2">
            {/* Age Header - Deep Blue bold heading */}
            <div className="text-[#025a9e] font-extrabold text-sm tracking-tight pt-1 flex items-center gap-1">
              <span>Age: {age} {age === 1 ? 'year' : 'years'}</span>
            </div>

            {/* Logs for this Age */}
            <div className="space-y-1 text-xs leading-relaxed font-normal">
              {groupedLogs[age].map(log => {
                let colorClass = 'text-slate-600';
                if (log.type === 'income' || log.text.includes('earned') || log.text.includes('bonus') || log.text.includes('Golden Neko')) {
                  colorClass = 'text-[#16a34a] font-medium';
                } else if (log.type === 'negative' || log.text.includes('died') || log.text.includes('failed') || log.text.includes('hospital')) {
                  colorClass = 'text-red-600 font-medium';
                } else if (log.type === 'major' || log.text.includes('graduated') || log.text.includes('promoted') || log.text.includes('married')) {
                  colorClass = 'text-[#025a9e] font-medium';
                }

                return (
                  <p key={log.id} className={`${colorClass} transition-all duration-300`}>
                    {log.text}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
};

