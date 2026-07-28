import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const FiftyAnimation: React.FC = () => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];

  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute inset-x-0 bottom-24 z-50 overflow-hidden font-sans shadow-2xl"
    >
      <div className="w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-500 py-4 border-y-4 border-white flex items-center justify-center relative shadow-[0_0_50px_rgba(251,191,36,0.8)]">
        {/* Animated Marquee Glow Ticker */}
        <div className="absolute inset-0 bg-white/10 animate-pulse" />

        <div className="relative z-10 flex items-center gap-6 text-slate-950">
          <div className="w-14 h-14 rounded-full bg-slate-950 text-amber-400 font-black text-2xl border-2 border-white flex items-center justify-center shadow-lg">
            50
          </div>
          <div>
            <span className="text-xs font-black tracking-widest uppercase block text-slate-900 opacity-90">
              HALF CENTURY CELEBRATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight drop-shadow">
              {striker?.name || 'ROHIT SHARMA'} &bull; 50 RUNS!
            </h2>
          </div>
          <div className="text-right hidden sm:block pl-6 border-l-2 border-slate-950/20 text-xs font-extrabold uppercase">
            <div>FOURS: {striker?.fours || 0}</div>
            <div>SIXES: {striker?.sixes || 0}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
