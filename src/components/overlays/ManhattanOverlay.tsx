import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const ManhattanOverlay: React.FC = () => {
  const { matchDetails, teamA, teamB, battingTeamId } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;

  // Sample Manhattan runs per over
  const sampleOvers = [
    { over: 1, runs: 8, wicket: false },
    { over: 2, runs: 12, wicket: false },
    { over: 3, runs: 4, wicket: true },
    { over: 4, runs: 16, wicket: false },
    { over: 5, runs: 6, wicket: false },
    { over: 6, runs: 14, wicket: true },
    { over: 7, runs: 9, wicket: false },
    { over: 8, runs: 18, wicket: false },
  ];

  return (
    <FullCardBase
      title="MANHATTAN CHART"
      subtitle={`${battingTeam.fullName} — RUNS PER OVER ANALYSIS`}
      tournament={matchDetails.tournament}
    >
      <div className="py-4 space-y-6">
        {/* Manhattan Bars */}
        <div className="flex items-end justify-between gap-3 h-52 px-4 border-b-2 border-slate-700 pb-2">
          {sampleOvers.map((item) => (
            <div key={item.over} className="flex-1 flex flex-col items-center gap-1 group">
              <span className="text-[10px] font-black text-amber-400 opacity-80">{item.runs}</span>
              <div
                style={{ height: `${(item.runs / 20) * 100}%` }}
                className={`w-full max-w-[28px] rounded-t-lg shadow-lg relative transition-all ${
                  item.wicket
                    ? 'bg-gradient-to-t from-red-600 to-rose-500 border-t-2 border-rose-300'
                    : 'bg-gradient-to-t from-cyan-600 to-sky-400 border-t-2 border-cyan-200'
                }`}
              >
                {item.wicket && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-black text-white bg-red-600 px-1 rounded-full">
                    W
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1">Ov {item.over}</span>
            </div>
          ))}
        </div>

        {/* Legend Footer */}
        <div className="flex items-center justify-center gap-6 text-xs font-bold">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span className="text-slate-300">Runs Scored</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span className="text-slate-300">Wicket Lost in Over</span>
          </div>
        </div>
      </div>
    </FullCardBase>
  );
};
