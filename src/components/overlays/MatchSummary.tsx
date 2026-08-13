import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

export const MatchSummary: React.FC = () => {
  const { teamA, teamB, matchDetails, tournamentId } = useBroadcastStore();

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const accentColor = theme.primaryAccent || '#facc15';

  const getWinnerMessage = () => {
    if (matchDetails.winnerMargin) return matchDetails.winnerMargin;
    if (teamA.score > teamB.score) {
      return `${teamA.fullName.toUpperCase()} WON BY ${teamA.score - teamB.score} RUNS`;
    } else if (teamB.score > teamA.score) {
      return `${teamB.fullName.toUpperCase()} WON BY ${10 - teamB.wickets} WICKETS`;
    }
    return `${teamA.fullName.toUpperCase()} vs ${teamB.fullName.toUpperCase()}`;
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-[1100px] shadow-2xl rounded-xl overflow-hidden border-2 bg-slate-950 font-sans text-slate-100"
        style={{ borderColor: accentColor }}
      >
        {/* Top Header Banner */}
        <div
          className="py-2.5 px-6 flex items-center justify-center relative shadow-inner"
          style={{ background: theme.headerGradient || 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <span
            className="text-slate-950 px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            {matchDetails.tournament || theme.name}
          </span>
        </div>

        <div
          className="text-white px-8 py-3.5 flex items-center justify-between border-b-2 border-white/20"
          style={{ background: theme.badgeBg || '#0f172a' }}
        >
          <span className="text-2xl font-black uppercase tracking-wider">{teamA.fullName}</span>
          <div className="text-center font-extrabold text-xs uppercase tracking-widest text-slate-300">
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'SUMMARY'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80">{teamB.fullName}</span>
        </div>

        {/* Dynamic Teams Summary Grid */}
        <div className="p-6 bg-slate-900 grid grid-cols-2 gap-6 min-h-[300px]">
          {/* Team A Block */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow flex flex-col justify-between">
            <div>
              <div className="bg-cyan-500 text-slate-950 px-4 py-2 rounded flex items-center justify-between font-black text-lg uppercase mb-4 shadow">
                <span>{teamA.fullName}</span>
                <span className="text-xl font-black">{teamA.score} - {teamA.wickets}</span>
              </div>

              <div className="space-y-2 text-xs font-black text-slate-900">
                {teamA.batters.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                    <span className="text-rose-600 font-extrabold text-sm">{b.runs} <span className="text-slate-500 text-xs">{b.balls}</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase block mb-1">BOWLING</span>
              <div className="space-y-1 text-xs font-black text-slate-900">
                {teamB.bowlers.slice(0, 2).map((bw) => (
                  <div key={bw.id} className="flex justify-between items-center">
                    <span className="uppercase truncate max-w-[130px]">{bw.name}</span>
                    <span className="text-cyan-700 font-extrabold">{bw.wickets} - {bw.runsConceded} <span className="text-slate-500 text-[11px]">({bw.overs}.{bw.ballsInCurrentOver})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team B Block */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow flex flex-col justify-between">
            <div>
              <div className="bg-cyan-500 text-slate-950 px-4 py-2 rounded flex items-center justify-between font-black text-lg uppercase mb-4 shadow">
                <span>{teamB.fullName}</span>
                <span className="text-xl font-black">{teamB.score} - {teamB.wickets}</span>
              </div>

              <div className="space-y-2 text-xs font-black text-slate-900">
                {teamB.batters.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                    <span className="text-rose-600 font-extrabold text-sm">{b.runs} <span className="text-slate-500 text-xs">{b.balls}</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase block mb-1">BOWLING</span>
              <div className="space-y-1 text-xs font-black text-slate-900">
                {teamA.bowlers.slice(0, 2).map((bw) => (
                  <div key={bw.id} className="flex justify-between items-center">
                    <span className="uppercase truncate max-w-[130px]">{bw.name}</span>
                    <span className="text-cyan-700 font-extrabold">{bw.wickets} - {bw.runsConceded} <span className="text-slate-500 text-[11px]">({bw.overs}.{bw.ballsInCurrentOver})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result Banner */}
        <div className="bg-gradient-to-r from-purple-400 via-cyan-400 to-sky-400 px-8 py-3.5 text-center font-black text-slate-950 text-xl uppercase tracking-widest shadow-lg">
          {getWinnerMessage()}
        </div>
      </motion.div>
    </div>
  );
};
