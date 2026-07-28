import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const SuperOverOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const bowlingTeam = battingTeamId === teamA.id ? teamB : teamA;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 220 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl bg-gradient-to-r from-red-950 via-slate-950 to-red-950 text-white rounded-2xl border-2 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.5)] overflow-hidden font-sans"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 py-1.5 px-4 text-center font-black text-xs uppercase tracking-widest text-slate-950 shadow-md">
        🔥 SUPER OVER TIE-BREAKER &bull; 6 BALL DECIDER
      </div>

      <div className="p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Team Score & Wickets */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-600 border-2 border-white flex items-center justify-center font-black text-lg text-white shadow-md">
            {battingTeam.shortName}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block">
              {battingTeam.fullName}
            </span>
            <div className="text-3xl font-black text-amber-400 tracking-tight">
              {battingTeam.score} - {battingTeam.wickets}{' '}
              <span className="text-xs font-bold text-white opacity-80">
                ({battingTeam.overs}.{battingTeam.balls} / 1.0 OVR)
              </span>
            </div>
          </div>
        </div>

        {/* 6-Ball Tracker Dots */}
        <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-xl border border-white/10">
          <span className="text-[10px] font-black text-slate-400 uppercase mr-1">BALLS:</span>
          {[0, 1, 2, 3, 4, 5].map((ballIdx) => {
            const ballVal = matchDetails.recentBalls[5 - ballIdx];
            return (
              <div
                key={ballIdx}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center font-black text-xs shadow ${
                  ballVal === '6'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : ballVal === '4'
                    ? 'bg-blue-600 text-white border-blue-400'
                    : ballVal === 'W'
                    ? 'bg-red-600 text-white border-red-400'
                    : ballVal
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}
              >
                {ballVal || '-'}
              </div>
            );
          })}
        </div>

        {/* Target Requirement / Opponent */}
        <div className="text-right border-l border-white/10 pl-4">
          <span className="text-[10px] font-black text-cyan-400 uppercase block">
            NEED FOR VICTORY
          </span>
          <div className="text-xl font-black text-white">
            {matchDetails.targetRuns ? `${matchDetails.targetRuns - battingTeam.score} RUNS` : 'MAXIMIZE RUNS'}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            VS {bowlingTeam.fullName}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
