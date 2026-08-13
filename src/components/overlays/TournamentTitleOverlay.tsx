import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const TournamentTitleOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 pointer-events-none z-40">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full bg-slate-950/95 backdrop-blur-md rounded-2xl border-2 border-cyan-400/60 shadow-[0_10px_50px_rgba(0,0,0,0.85)] overflow-hidden p-4 relative"
      >
        {/* Glowing Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-600 animate-pulse" />

        <div className="flex items-center justify-between gap-6">
          {/* Left Info Section */}
          <div className="text-left space-y-1 pl-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded tracking-widest">
                🏆 OFFICIAL TOURNAMENT
              </span>
            </div>
            <h1 className="text-2xl font-black uppercase text-white tracking-wide drop-shadow-md">
              {matchDetails.tournament || 'ASTHAVINAYAK PREMIER LEAGUE'}
            </h1>
            <div className="flex items-center gap-3 text-xs font-black uppercase text-slate-300 tracking-wider">
              <span>MATCH #{matchDetails.matchNo || 1}</span>
              <span>•</span>
              <span className="text-cyan-400">{matchDetails.matchType || 'GROUP STAGE'}</span>
              <span>•</span>
              <span>{matchDetails.totalOvers || 20} OVERS MATCH</span>
            </div>
          </div>

          {/* Right Teams VS Box */}
          <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 py-3 px-6 rounded-xl border border-cyan-300/40 shadow-xl flex items-center justify-between gap-4 min-w-[320px]">
            <span className="text-base font-black uppercase text-slate-950 truncate max-w-[120px]">
              {teamA.shortName || teamA.fullName}
            </span>
            <span className="bg-slate-950 text-amber-300 text-xs font-black px-3 py-1 rounded-lg border border-white/20 shadow">
              VS
            </span>
            <span className="text-base font-black uppercase text-slate-950 truncate max-w-[120px] text-right">
              {teamB.shortName || teamB.fullName}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
