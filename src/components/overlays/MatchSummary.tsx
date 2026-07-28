import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';

export const MatchSummary: React.FC = () => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  // Simulated per-over data matching broadcast bar chart in Screenshot 2026-04-17 192723.png
  const overData = [
    { over: 1, runs: 7, wickets: 1 },
    { over: 2, runs: 15, wickets: 0 },
    { over: 3, runs: 12, wickets: 0 },
    { over: 4, runs: 18, wickets: 1 },
  ];

  return (
    <FullCardBase
      title="MATCH SUMMARY"
      subtitle={`${matchDetails.matchType || 'SUPER FISSION'} - ${matchDetails.stage || 'FINAL'} | MATCH ${matchDetails.matchNo || 1}`}
      tournament={matchDetails.tournament}
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Team A Summary */}
        <div className="bg-gradient-to-r from-red-950/90 to-red-900/40 p-5 rounded-xl border border-red-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <TeamBadge shortName={teamA.shortName} primaryColor={teamA.primaryColor} size="md" />
              <h3 className="text-lg font-black uppercase text-white tracking-wider">{teamA.fullName}</h3>
            </div>
            <div className="text-right">
              <span className="text-white font-extrabold text-xs block opacity-80">OVERS {teamA.overs}</span>
              <span className="text-amber-300 font-black text-2xl">{teamA.score} - {teamA.wickets}</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-extrabold">
            <div className="space-y-1">
              {teamA.batters.slice(0, 4).map((b) => (
                <div key={b.id} className="flex justify-between items-center text-white">
                  <span className="truncate max-w-[120px]">{b.name}</span>
                  <span className="text-amber-300">{b.runs}{b.isStriker || !b.isOut ? '*' : ''} <span className="text-white/60 font-semibold">{b.balls}</span></span>
                </div>
              ))}
            </div>
            <div className="space-y-1 border-l border-white/10 pl-3">
              {teamA.bowlers.slice(0, 2).map((bw) => (
                <div key={bw.id} className="flex justify-between items-center text-white">
                  <span className="truncate max-w-[100px]">{bw.name}</span>
                  <span className="text-cyan-300">{bw.wickets}-{bw.runsConceded} <span className="text-white/60 font-semibold">{bw.overs}.0</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team B Summary */}
        <div className="bg-gradient-to-r from-cyan-950/90 to-cyan-900/40 p-5 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <TeamBadge shortName={teamB.shortName} primaryColor={teamB.primaryColor} size="md" />
              <h3 className="text-lg font-black uppercase text-white tracking-wider">{teamB.fullName}</h3>
            </div>
            <div className="text-right">
              <span className="text-white font-extrabold text-xs block opacity-80">OVERS {teamB.overs}</span>
              <span className="text-amber-300 font-black text-2xl">{teamB.score} - {teamB.wickets}</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-extrabold">
            <div className="space-y-1">
              {teamB.batters.slice(0, 4).map((b) => (
                <div key={b.id} className="flex justify-between items-center text-white">
                  <span className="truncate max-w-[120px]">{b.name}</span>
                  <span className="text-amber-300">{b.runs}{b.isStriker || !b.isOut ? '*' : ''} <span className="text-white/60 font-semibold">{b.balls}</span></span>
                </div>
              ))}
            </div>
            <div className="space-y-1 border-l border-white/10 pl-3">
              {teamB.bowlers.slice(0, 2).map((bw) => (
                <div key={bw.id} className="flex justify-between items-center text-white">
                  <span className="truncate max-w-[100px]">{bw.name}</span>
                  <span className="text-cyan-300">{bw.wickets}-{bw.runsConceded} <span className="text-white/60 font-semibold">{bw.overs}.0</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Per Over Runs Bar Chart Visualizer matching Screenshot 2026-04-17 192723.png */}
      <div className="mt-5 p-4 bg-slate-950/80 rounded-xl border border-white/10">
        <span className="text-xs font-black uppercase text-slate-300 tracking-wider block mb-3">
          PER OVER RUN COMPARISON GRAPH
        </span>
        <div className="h-32 flex items-end justify-around border-b border-l border-white/20 pb-2 px-4 gap-6">
          {overData.map((d) => (
            <div key={d.over} className="flex flex-col items-center flex-1 h-full justify-end relative">
              {d.wickets > 0 && (
                <div className="absolute -top-3 w-6 h-6 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center shadow-lg border border-white/40 z-10">
                  {d.wickets}W
                </div>
              )}
              <div
                className="w-full bg-cyan-400 rounded-t shadow-md transition-all duration-500"
                style={{ height: `${(d.runs / 20) * 100}%` }}
              />
              <span className="text-[10px] font-bold text-slate-400 mt-1">OV {d.over}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Match Result Banner */}
      <div className="mt-4 p-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 border border-cyan-300/40 rounded-xl text-center shadow-lg">
        <span className="text-white font-black text-xl uppercase tracking-widest drop-shadow">
          {matchDetails.winnerMargin || `${teamA.fullName.toUpperCase()} WON BY 9 WICKETS`}
        </span>
      </div>
    </FullCardBase>
  );
};
