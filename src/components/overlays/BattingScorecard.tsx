import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const BattingScorecard: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
  const totalExtras = battingTeam.extras || 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-[1100px] shadow-2xl rounded-xl overflow-hidden border-2 border-purple-600 bg-slate-950 font-sans text-slate-900"
      >
        {/* Top Header Banner */}
        <div className="bg-[#4c0519] text-white py-2 px-6 flex items-center justify-center relative">
          <span className="bg-cyan-500 text-slate-950 px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow">
            {matchDetails.tournament || 'ICC WORLD CUP'}
          </span>
        </div>

        <div className="bg-purple-950 text-white px-8 py-3 flex items-center justify-between border-b-2 border-purple-500">
          <span className="text-2xl font-black uppercase tracking-wider">{battingTeam.fullName}</span>
          <div className="text-center font-extrabold text-xs text-purple-200 uppercase tracking-widest">
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'NORMAL'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider text-purple-300">{bowlingTeam.fullName}</span>
        </div>

        {/* Batters Table */}
        <div className="p-4 bg-slate-900 space-y-1.5 min-h-[300px]">
          {battingTeam.batters.map((b) => {
            const isCurrentBatter = b.isStriker || (!b.isOut && !b.dismissal);
            return (
              <div
                key={b.id}
                className={`px-5 py-2.5 rounded flex items-center justify-between font-black text-sm border shadow-sm ${
                  isCurrentBatter
                    ? 'bg-rose-600 text-white border-rose-400'
                    : b.isOut
                    ? 'bg-white text-slate-950 border-slate-200'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                <span className="uppercase tracking-wide w-56 truncate">{b.name}</span>
                <span className="text-xs font-bold flex-1 text-center truncate px-4 opacity-90">
                  {b.isOut ? (b.dismissal || 'c & b Bowler') : isCurrentBatter ? 'NOT OUT *' : ''}
                </span>
                <div className="flex items-center gap-8 font-black text-base w-28 justify-end">
                  <span className={isCurrentBatter ? 'text-amber-300' : 'text-slate-950'}>{b.runs}</span>
                  <span className={`text-xs ${isCurrentBatter ? 'text-white/80' : 'text-slate-600'}`}>{b.balls}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Footer Bar */}
        <div className="bg-gradient-to-r from-purple-400 via-cyan-400 to-sky-400 px-8 py-3 flex items-center justify-between font-black text-slate-950 text-sm uppercase">
          <div className="flex items-center gap-8">
            <span>EXTRAS: <strong className="text-purple-950 text-lg ml-1">{totalExtras}</strong></span>
            <span>OVERS: <strong className="text-purple-950 text-lg ml-1">{battingTeam.overs}.{battingTeam.balls}</strong></span>
            <span>CRR: <strong className="text-purple-950 text-lg ml-1">{crr}</strong></span>
          </div>

          <div className="bg-amber-400 text-slate-950 px-8 py-1.5 rounded-lg text-2xl font-black tracking-tight shadow-lg border border-amber-300">
            {battingTeam.score} - {battingTeam.wickets}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
