import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const BattingScorecard: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
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
            {battingTeam.fullName}
          </h2>
        </div>

        {/* Subheader */}
        <div className="bg-slate-900 border-b border-white/10 px-6 py-2 text-center text-xs font-black uppercase tracking-widest text-slate-300">
          {matchDetails.stage} | {matchDetails.title}
        </div>

        {/* Batters Table */}
        <div className="p-6 space-y-2.5">
          {battingTeam.batters.map((b) => (
            <div
              key={b.id}
              className={`px-5 py-3 rounded-lg flex items-center justify-between font-black text-sm border shadow ${
                !b.isOut
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white border-red-400/50'
                  : 'bg-slate-950/80 text-slate-200 border-white/10'
              }`}
            >
              <span className="uppercase tracking-wide w-64">{b.name}</span>
              <span className="text-xs font-semibold text-slate-300 flex-1 text-center truncate px-4">
                {b.isOut ? b.dismissal || 'out' : 'NOT OUT'}
              </span>
              <div className="flex items-center gap-6 font-black text-base">
                <span className="text-amber-300">{b.runs}</span>
                <span className="text-slate-300 text-xs">{b.balls}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats Footer (Screenshot 4) */}
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
