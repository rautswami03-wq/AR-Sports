import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const CenturyAnimation: React.FC = () => {
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
      <div className="w-full bg-gradient-to-r from-purple-700 via-yellow-400 to-amber-500 py-5 border-y-4 border-amber-300 flex items-center justify-center relative shadow-[0_0_60px_rgba(234,179,8,0.9)]">
        {/* Animated Marquee Glow Ticker */}
        <div className="absolute inset-0 bg-white/20 animate-pulse" />

        <div className="relative z-10 flex items-center gap-6 text-slate-950">
          <div className="w-16 h-16 rounded-full bg-slate-950 text-amber-300 font-black text-3xl border-4 border-amber-300 flex items-center justify-center shadow-xl">
            100
          </div>
          <div>
            <span className="text-xs font-black tracking-widest uppercase block text-slate-950 opacity-90">
              👑 MAGNIFICENT CENTURY CELEBRATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight drop-shadow">
              {striker?.name || 'VIRAT KOHLI'} &bull; 100 RUNS!
            </h2>
          </div>
          <div className="text-right hidden sm:block pl-6 border-l-2 border-slate-950/30 text-xs font-black uppercase">
            <div>FOURS: {striker?.fours || 0}</div>
            <div>SIXES: {striker?.sixes || 0}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
