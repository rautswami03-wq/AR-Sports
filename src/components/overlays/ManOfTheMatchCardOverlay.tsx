import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const ManOfTheMatchCardOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();
  const starPlayer = teamA.batters[0] || teamB.batters[0];

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-xl bg-gradient-to-b from-amber-600 via-amber-800 to-slate-950 text-white rounded-3xl border-4 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.6)] overflow-hidden font-sans p-8 text-center"
    >
      {/* Trophy Header Banner */}
      <div className="inline-flex items-center gap-2 bg-black/60 px-6 py-2 rounded-full border border-amber-300/40 text-amber-300 text-xs font-black uppercase tracking-widest mb-6">
        🏆 PLAYER OF THE MATCH AWARD
      </div>

      {/* Player Photo Avatar Circle */}
      <div className="w-36 h-36 mx-auto rounded-full bg-slate-900 border-4 border-amber-300 shadow-2xl flex items-center justify-center font-black text-4xl text-amber-400 mb-6 overflow-hidden">
        {starPlayer?.name ? starPlayer.name.substring(0, 2).toUpperCase() : 'MOM'}
      </div>

      {/* Name & Team */}
      <h2 className="text-4xl font-black text-white uppercase tracking-tight drop-shadow">
        {starPlayer?.name || 'SURAYAKUMAR YADAV'}
      </h2>
      <span className="text-base font-bold text-amber-300 uppercase block mt-1">
        ({teamA.fullName.toUpperCase()})
      </span>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/20">
        <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
          <span className="text-[10px] font-black text-amber-300 uppercase block">RUNS</span>
          <span className="text-2xl font-black text-white">{starPlayer?.runs || 84}</span>
        </div>
        <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
          <span className="text-[10px] font-black text-amber-300 uppercase block">BALLS</span>
          <span className="text-2xl font-black text-white">{starPlayer?.balls || 38}</span>
        </div>
        <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
          <span className="text-[10px] font-black text-amber-300 uppercase block">FOURS</span>
          <span className="text-2xl font-black text-cyan-300">{starPlayer?.fours || 8}</span>
        </div>
        <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
          <span className="text-[10px] font-black text-amber-300 uppercase block">SIXES</span>
          <span className="text-2xl font-black text-purple-400">{starPlayer?.sixes || 6}</span>
        </div>
      </div>
    </motion.div>
  );
};
