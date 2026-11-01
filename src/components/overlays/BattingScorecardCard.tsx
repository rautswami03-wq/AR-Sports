import React from 'react';
import { FullCardBase } from './base/FullCardBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface BattingScorecardCardProps {
  className?: string;
}

export const BattingScorecardCard: React.FC<BattingScorecardCardProps> = ({ className = '' }) => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const batters = battingTeam.batters || [];

  const oversFormatted = `${battingTeam.overs}.${battingTeam.balls}`;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const runRate = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
  const extras = battingTeam.extras || 0;

  // Provide at least 8 rows for scorecard consistency
  const filledBatters = Array.from({ length: Math.max(8, batters.length) }, (_, i) => {
    const existing = batters[i];
    if (existing) return existing;
    return {
      id: `empty_${i}`,
      name: `Batter ${i + 1}`,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      dismissal: '',
    };
  });

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4 ${className}`}>
      <FullCardBase
        title={battingTeam.fullName || `${battingTeam.shortName} INNINGS`}
        subtitle={`${matchDetails.tournament || 'TATA IPL 2025'} • INNINGS ${matchDetails.currentInnings || 1}`}
        footerContent={
          <div className="flex items-center justify-between w-full font-black text-sm text-slate-200">
            <div className="flex items-center gap-6">
              <span>
                RUN-RATE: <strong className="text-white text-base">{runRate}</strong>
              </span>
              <span>•</span>
              <span>
                EXTRAS: <strong className="text-[#FFDC35] text-base">{extras}</strong>
              </span>
              <span>•</span>
              <span>
                OVERS: <strong className="text-white text-base">{oversFormatted} ({matchDetails.totalOvers || 20})</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-2xl font-black text-[#FF5A00] drop-shadow">
              <span>TOTAL:</span>
              <span className="text-3xl text-white">
                {battingTeam.score} - {battingTeam.wickets}
              </span>
            </div>
          </div>
        }
      >
        <div className="flex flex-col h-full rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/90 shadow-xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-black/60 border-b border-[#FF5A00]/40 text-xs font-black uppercase tracking-wider text-slate-300">
            <div className="col-span-4">BATTER</div>
            <div className="col-span-5 text-left">DISMISSAL</div>
            <div className="col-span-1 text-center">RUNS</div>
            <div className="col-span-1 text-center">BALLS</div>
            <div className="col-span-1 text-center text-[#FFDC35]">SR</div>
          </div>

          {/* Batters Rows */}
          <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
            {filledBatters.map((b, idx) => {
              const isReal = idx < batters.length;
              const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '-';
              const dismissalText = !isReal
                ? '-'
                : b.isOut
                ? b.dismissal || 'c & b Bowler'
                : b.isStriker
                ? 'NOT OUT *'
                : 'NOT OUT';

              return (
                <div
                  key={b.id || idx}
                  className={`grid grid-cols-12 px-6 py-2.5 items-center text-sm font-bold transition-colors ${
                    isReal && !b.isOut
                      ? 'bg-gradient-to-r from-[#FF5A00]/20 via-[#FF5A00]/10 to-transparent text-white'
                      : idx % 2 === 0
                      ? 'bg-white/[0.02] text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    {isReal && !b.isOut && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
                    )}
                    <span className="truncate uppercase font-black tracking-wide text-white">
                      {b.name}
                    </span>
                  </div>
                  <div className="col-span-5 truncate text-xs text-slate-400 font-medium">
                    {dismissalText}
                  </div>
                  <div className="col-span-1 text-center font-black text-white text-base">
                    {isReal ? b.runs : '-'}
                  </div>
                  <div className="col-span-1 text-center text-slate-400">
                    {isReal ? b.balls : '-'}
                  </div>
                  <div className="col-span-1 text-center font-bold text-[#FFDC35] text-xs">
                    {sr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FullCardBase>
    </div>
  );
};

