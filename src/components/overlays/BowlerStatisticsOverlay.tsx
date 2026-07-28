import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const BowlerStatisticsOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();
  const bowlingTeam = battingTeamId === teamA.id ? teamB : teamA;
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 240 }}
      className="absolute right-6 top-16 z-40 w-72 bg-gradient-to-b from-red-700 via-red-800 to-red-950 rounded-2xl shadow-2xl border-2 border-white/30 overflow-hidden font-sans text-white"
    >
      {/* Top Banner */}
      <div className="bg-black/40 py-2 text-center border-b border-white/20">
        <span className="text-[11px] font-black tracking-widest uppercase text-amber-300">
          THIS TOURNAMENT
        </span>
        <h2 className="text-xl font-black uppercase text-white tracking-wide">
          {currentBowler?.name || 'M STARC'}
        </h2>
        <span className="text-xs font-bold opacity-80 uppercase">
          ({bowlingTeam.shortName})
        </span>
      </div>

      {/* Bowler Avatar */}
      <div className="flex justify-center my-3">
        <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-white/40 flex items-center justify-center font-black text-2xl text-cyan-300 shadow-xl overflow-hidden">
          {currentBowler?.name ? currentBowler.name.substring(0, 2).toUpperCase() : 'MS'}
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="p-3 bg-black/30 space-y-1.5 text-xs font-extrabold border-t border-white/10">
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">MATCHES</span>
          <span>1</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">WICKETS</span>
          <span className="text-amber-300">{currentBowler?.wickets || 0}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">OVERS BOWLED</span>
          <span>{currentBowler?.overs || 0}.{currentBowler?.ballsInCurrentOver || 0}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">RUNS CONCEDED</span>
          <span>{currentBowler?.runsConceded || 0}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">ECONOMY</span>
          <span className="text-cyan-300">
            {currentBowler?.overs ? (currentBowler.runsConceded / currentBowler.overs).toFixed(2) : '0.00'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-80">BEST</span>
          <span>{currentBowler?.wickets || 0}/{currentBowler?.runsConceded || 0}</span>
        </div>
      </div>
    </motion.div>
  );
};
