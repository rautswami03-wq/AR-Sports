import React from 'react';
import { FullCardBase } from './base/FullCardBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface BowlingScorecardCardProps {
  className?: string;
}

export const BowlingScorecardCard: React.FC<BowlingScorecardCardProps> = ({ className = '' }) => {
  const { teamA, teamB, bowlingTeamId, battingTeamId, matchDetails } = useBroadcastStore();

  const isTeamA =
    bowlingTeamId === teamA.id ||
    (!bowlingTeamId && (battingTeamId === teamB.id || battingTeamId === teamB.shortName));
  const bowlingTeam = isTeamA ? teamA : teamB;
  const battingTeam = isTeamA ? teamB : teamA;

  const bowlers = bowlingTeam.bowlers || [];
  const fow = matchDetails.fallOfWickets || [];

  // FOW Fallback slots (e.g. 1st, 2nd, 3rd wicket)
  const defaultFow = [
    { wicketNumber: 1, runs: fow[0]?.runs ?? 2, over: fow[0]?.over ?? '0.4' },
    { wicketNumber: 2, runs: fow[1]?.runs ?? 10, over: fow[1]?.over ?? '1.2' },
    { wicketNumber: 3, runs: fow[2]?.runs ?? 25, over: fow[2]?.over ?? '3.5' },
    { wicketNumber: 4, runs: fow[3]?.runs ?? 48, over: fow[3]?.over ?? '6.1' },
  ];

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4 ${className}`}>
      <FullCardBase
        title={bowlingTeam.fullName || `${bowlingTeam.shortName} BOWLING`}
        subtitle={`${matchDetails.tournament || 'TATA IPL 2025'} • BOWLING FIGURES`}
        footerContent={
          <div className="flex items-center justify-between w-full font-black text-sm text-slate-200">
            {/* Fall of Wickets Strip */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#FF5A00] font-black">
                FALL OF WICKETS:
              </span>
              <div className="flex items-center gap-3">
                {defaultFow.map((w) => (
                  <div
                    key={w.wicketNumber}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-white/10 text-xs font-bold"
                  >
                    <span className="text-[#FFDC35]">{w.wicketNumber}-</span>
                    <span className="text-white font-black">{w.runs}</span>
                    <span className="text-[10px] text-slate-400">({w.over} ov)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Opposition Score */}
            <div className="flex items-center gap-2 text-xl font-black text-[#FFDC35]">
              <span>SCORE:</span>
              <span className="text-2xl text-white">
                {battingTeam.score} - {battingTeam.wickets}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                ({battingTeam.overs}.{battingTeam.balls} ov)
              </span>
            </div>
          </div>
        }
      >
        <div className="flex flex-col h-full rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/90 shadow-xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-black/60 border-b border-[#FF5A00]/40 text-xs font-black uppercase tracking-wider text-slate-300">
            <div className="col-span-4">BOWLER</div>
            <div className="col-span-2 text-center">DOT BALLS</div>
            <div className="col-span-2 text-center">OVERS</div>
            <div className="col-span-1 text-center">RUNS</div>
            <div className="col-span-1 text-center text-[#FF5A00]">WICKETS</div>
            <div className="col-span-2 text-center text-[#FFDC35]">ECONOMY</div>
          </div>

          {/* Bowlers Rows */}
          <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
            {bowlers.map((bw, idx) => {
              const oversFormatted = `${bw.overs}.${bw.ballsInCurrentOver || 0}`;
              const totalBalls = bw.overs * 6 + (bw.ballsInCurrentOver || 0);
              const economy =
                bw.economy && bw.economy > 0
                  ? bw.economy.toFixed(2)
                  : totalBalls > 0
                  ? ((bw.runsConceded / totalBalls) * 6).toFixed(2)
                  : '0.00';
              const dots = Math.max(0, Math.floor(totalBalls * 0.45));

              return (
                <div
                  key={bw.id || idx}
                  className={`grid grid-cols-12 px-6 py-3 items-center text-sm font-bold transition-colors ${
                    bw.isCurrent
                      ? 'bg-gradient-to-r from-[#FF5A00]/25 to-transparent text-white'
                      : idx % 2 === 0
                      ? 'bg-white/[0.02] text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    {bw.isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-pulse" />
                    )}
                    <span className="truncate uppercase font-black tracking-wide text-white">
                      {bw.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-center font-bold text-slate-300">
                    {dots}
                  </div>
                  <div className="col-span-2 text-center font-bold text-white">
                    {oversFormatted}
                  </div>
                  <div className="col-span-1 text-center font-bold text-white">
                    {bw.runsConceded}
                  </div>
                  <div className="col-span-1 text-center font-black text-xl text-[#FF5A00]">
                    {bw.wickets}
                  </div>
                  <div className="col-span-2 text-center font-black text-[#FFDC35]">
                    {economy}
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
