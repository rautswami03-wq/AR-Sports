import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const CurrentBowlerOverlay: React.FC = () => {
  const { teamA, teamB, bowlingTeamId } = useBroadcastStore();
  const bowlingTeam = bowlingTeamId === teamA.id ? teamA : teamB;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 22, stiffness: 200 }}
      className="absolute top-12 right-12 w-[600px] z-40 shadow-[0_0_50px_rgba(249,115,22,0.8)] rounded-xl overflow-hidden border-4 border-orange-500 bg-[#090d16] font-sans text-white"
    >
      {/* Dark Orange Pattern Header */}
      <div className="bg-slate-950 border-b-2 border-orange-500 px-6 py-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-x-4 top-1 bottom-1 border-y border-orange-500/40 pointer-events-none" />
        <h2 className="text-2xl font-black uppercase tracking-widest text-center text-white">
          {bowlingTeam.fullName}
        </h2>
      </div>

      {/* Table Header */}
      <div className="px-6 py-2 bg-slate-900 border-b border-white/10 flex items-center justify-end text-xs font-black text-slate-300 uppercase tracking-wider">
        <div className="grid grid-cols-5 gap-4 text-center w-[300px]">
          <span>DOTS</span>
          <span>OVR</span>
          <span>RUNS</span>
          <span>WKT</span>
          <span>ECO</span>
        </div>
      </div>

      {/* Bowlers Rows (Red Gradient Highlight Rows) */}
      <div className="p-4 space-y-2">
        {bowlingTeam.bowlers.map((bw) => (
          <div
            key={bw.id}
            className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-5 py-3 rounded-lg flex items-center justify-between font-black text-sm shadow-md border border-red-400/40"
          >
            <span className="uppercase tracking-wide">{bw.name}</span>
            <div className="grid grid-cols-5 gap-4 text-center w-[300px]">
              <span>{Math.max(0, bw.overs * 6 - bw.runsConceded / 2)}</span>
              <span>{bw.overs}</span>
              <span>{bw.runsConceded}</span>
              <span className="text-amber-300 font-extrabold">{bw.wickets}</span>
              <span>{bw.economy.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
