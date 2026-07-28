import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const BowlingScorecard: React.FC = () => {
  const { teamA, teamB, bowlingTeamId, matchDetails } = useBroadcastStore();
  const bowlingTeam = bowlingTeamId === teamA.id ? teamA : teamB;
  const battingTeam = bowlingTeamId === teamA.id ? teamB : teamA;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className="w-[1000px] pointer-events-auto shadow-[0_0_60px_rgba(249,115,22,0.8)] rounded-xl overflow-hidden border-4 border-orange-500 bg-[#090d16] font-sans text-white"
      >
        {/* Dark Orange Pattern Header */}
        <div className="bg-slate-950 border-b-2 border-orange-500 px-6 py-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-x-4 top-1 bottom-1 border-y border-orange-500/40 pointer-events-none" />
          <h2 className="text-3xl font-black uppercase tracking-widest text-center text-white">
            {bowlingTeam.fullName}
          </h2>
        </div>

        {/* Subheader */}
        <div className="bg-slate-900 border-b border-white/10 px-6 py-2 text-center text-xs font-black uppercase tracking-widest text-slate-300">
          {matchDetails.stage} | {matchDetails.title}
        </div>

        {/* Table Header */}
        <div className="px-8 py-2 bg-slate-950/80 border-b border-white/10 flex items-center justify-end text-xs font-black text-slate-300 uppercase tracking-wider">
          <div className="grid grid-cols-5 gap-6 text-center w-[450px]">
            <span>DOT BALLS</span>
            <span>OVERS</span>
            <span>RUNS</span>
            <span>WICKETS</span>
            <span>ECONOMY</span>
          </div>
        </div>

        {/* Bowlers Table (Cyan Gradient Highlight Rows) */}
        <div className="p-6 space-y-2.5">
          {bowlingTeam.bowlers.map((bw) => (
            <div
              key={bw.id}
              className="bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 px-6 py-3 rounded-lg flex items-center justify-between font-black text-sm text-slate-950 shadow-md border border-cyan-300/40"
            >
              <span className="uppercase tracking-wide text-white font-extrabold">{bw.name}</span>
              <div className="grid grid-cols-5 gap-6 text-center w-[450px] font-black text-base text-slate-950">
                <span>{Math.max(0, bw.overs * 6 - bw.runsConceded / 2)}</span>
                <span>{bw.overs}</span>
                <span>{bw.runsConceded}</span>
                <span className="text-slate-950 font-black">{bw.wickets}</span>
                <span>{bw.economy.toFixed(2)}</span>
              </div>
            </div>
          ))}

          {/* Fall of Wickets Mini Table (Screenshot 5) */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5 text-xs font-black">
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 text-slate-950 px-4 py-1.5 rounded uppercase w-44 text-center">FALL OF WICKETS</span>
              <span className="bg-sky-500 text-slate-950 px-4 py-1.5 rounded">1</span>
              <span className="bg-sky-500 text-slate-950 px-4 py-1.5 rounded">2</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-cyan-500 text-slate-950 px-4 py-1.5 rounded uppercase w-44 text-center">SCORE</span>
              <span className="bg-red-600 text-white px-4 py-1.5 rounded">2</span>
              <span className="bg-red-600 text-white px-4 py-1.5 rounded">10</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats Footer (Screenshot 5) */}
        <div className="bg-slate-950 border-t-2 border-orange-500 px-8 py-4 flex items-center justify-between text-base font-black uppercase">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-slate-400 text-xs font-bold block">RUN-RATE</span>
              <span className="text-white text-xl">{crr}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs font-bold block">EXTRAS</span>
              <span className="text-white text-xl">0</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs font-bold block">OVERS</span>
              <span className="text-white text-xl">{battingTeam.overs}</span>
            </div>
          </div>

          <div className="text-right text-3xl font-black tracking-tight text-white">
            {battingTeam.score} - {battingTeam.wickets}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
