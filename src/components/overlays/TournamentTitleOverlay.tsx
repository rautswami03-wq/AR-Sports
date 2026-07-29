import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const TournamentTitleOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-4xl bg-slate-950/90 backdrop-blur-md rounded-3xl border-2 border-cyan-400/60 shadow-[0_0_60px_rgba(6,182,212,0.6)] overflow-hidden text-center p-8 relative"
      >
        {/* Glowing Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-600 animate-pulse" />

        {/* Tournament Name */}
        <span className="text-xs md:text-sm font-black uppercase text-amber-400 tracking-widest block mb-2">
          🏆 OFFICIAL TOURNAMENT
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-wide drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)] mb-4">
          {matchDetails.tournament || 'ASTHAVINAYAK PREMIER LEAGUE'}
        </h1>

        {/* Matchup Teams Banner */}
        <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 py-3.5 px-8 rounded-2xl border border-cyan-300/40 shadow-xl flex items-center justify-between gap-4 max-w-2xl mx-auto my-4">
          <h2 className="text-lg md:text-2xl font-black uppercase text-slate-950 truncate flex-1 text-left">
            {teamA.fullName}
          </h2>
          <span className="bg-slate-950 text-amber-300 text-sm font-black px-4 py-1 rounded-xl border border-white/20">
            VS
          </span>
          <h2 className="text-lg md:text-2xl font-black uppercase text-slate-950 truncate flex-1 text-right">
            {teamB.fullName}
          </h2>
        </div>

        {/* Subtitle Details */}
        <div className="flex items-center justify-center gap-6 text-xs md:text-sm font-black uppercase text-slate-300 tracking-wider pt-2">
          <span>MATCH #{matchDetails.matchNo || 1}</span>
          <span>•</span>
          <span>{matchDetails.matchType || 'GROUP STAGE'}</span>
          <span>•</span>
          <span>{matchDetails.totalOvers || 20} OVERS MATCH</span>
        </div>
      </motion.div>
    </div>
  );
};
