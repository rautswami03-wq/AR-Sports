import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const WagonWheelOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 220 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-96 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl border-2 border-emerald-500/50 shadow-2xl p-5 font-sans"
    >
      {/* Header */}
      <div className="text-center border-b border-emerald-500/30 pb-3 mb-4">
        <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase block">
          360° BOUNDARY RADAR &bull; SHOT DIRECTION
        </span>
        <h3 className="text-xl font-black uppercase text-white">
          {striker?.name || 'ROHIT SHARMA'}
        </h3>
        <span className="text-xs font-bold text-emerald-400 uppercase">
          WAGON WHEEL ({battingTeam.shortName})
        </span>
      </div>

      {/* Field Radar Ground Circle */}
      <div className="relative w-64 h-64 mx-auto rounded-full border-4 border-emerald-500/60 bg-emerald-900/40 flex items-center justify-center overflow-hidden shadow-inner">
        {/* Inner Pitch Lines */}
        <div className="w-6 h-16 bg-amber-700/80 border border-amber-300 rounded-sm z-10" />
        <div className="absolute inset-0 rounded-full border border-emerald-400/20" />
        <div className="absolute inset-4 rounded-full border border-emerald-400/30 border-dashed" />

        {/* Shot Vectors (Fours & Sixes Visualization) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Cover Drive */}
          <div className="absolute top-12 left-12 w-28 h-0.5 bg-cyan-400 transform -rotate-45 shadow-[0_0_8px_#22d3ee]" />
          {/* Long On Six */}
          <div className="absolute top-4 left-32 w-28 h-1 bg-purple-500 transform -rotate-90 shadow-[0_0_10px_#a855f7]" />
          {/* Square Cut */}
          <div className="absolute top-28 left-6 w-28 h-0.5 bg-cyan-400 transform rotate-180 shadow-[0_0_8px_#22d3ee]" />
          {/* Mid Wicket Six */}
          <div className="absolute top-12 right-12 w-28 h-1 bg-purple-500 transform rotate-45 shadow-[0_0_10px_#a855f7]" />
          {/* Fine Leg Four */}
          <div className="absolute bottom-12 right-12 w-28 h-0.5 bg-cyan-400 transform -rotate-45 shadow-[0_0_8px_#22d3ee]" />
        </div>
      </div>

      {/* Legend & Stats Breakdown */}
      <div className="mt-4 flex items-center justify-between text-xs font-black uppercase pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-sm" /> FOURS ({striker?.fours || 0})
        </div>
        <div className="flex items-center gap-1.5 text-purple-400">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shadow-sm" /> SIXES ({striker?.sixes || 0})
        </div>
      </div>
    </motion.div>
  );
};
