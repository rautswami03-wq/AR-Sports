import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

export const BowlingScorecard: React.FC = () => {
  const { teamA, teamB, bowlingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = bowlingTeamId === teamA.id || bowlingTeamId === teamA.shortName || bowlingTeamId === 'teamA' || bowlingTeamId === teamA.fullName;
  const bowlingTeam = isTeamA ? teamA : teamB;
  const battingTeam = isTeamA ? teamB : teamA;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const accentColor = theme.primaryAccent || '#facc15';

  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
  const totalExtras = battingTeam.extras || 0;
  const fowList = battingTeam.fallOfWickets || [];

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
          <span className="text-2xl font-black uppercase tracking-wider">{battingTeam.fullName}</span>
          <div className="text-center font-extrabold text-xs uppercase tracking-widest text-slate-300">
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'BOWLING CARD'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80">{bowlingTeam.fullName}</span>
        </div>

        {/* Table Header */}
        <div className="px-8 py-2 bg-purple-900 text-white flex items-center justify-between text-xs font-black uppercase tracking-wider border-b border-purple-700">
          <span className="w-48">BOWLER</span>
          <div className="grid grid-cols-5 gap-6 text-center w-[500px]">
            <span>DOT BALLS</span>
            <span>OVERS</span>
            <span>RUNS</span>
            <span>WICKETS</span>
            <span>ECONOMY</span>
          </div>
        </div>

        {/* Bowlers Table */}
        <div className="p-4 bg-slate-900 space-y-1.5 min-h-[220px]">
          {bowlingTeam.bowlers.map((bw) => {
            const eco = bw.overs > 0 ? (bw.runsConceded / bw.overs).toFixed(2) : '0.00';
            const dotBalls = Math.max(0, bw.overs * 6 - Math.floor(bw.runsConceded / 2));
            return (
              <div
                key={bw.id}
                className="bg-white px-6 py-2.5 rounded flex items-center justify-between font-black text-sm text-slate-950 shadow-sm border border-slate-200"
              >
                <span className="uppercase tracking-wide w-48 truncate font-extrabold">{bw.name}</span>
                <div className="grid grid-cols-5 gap-6 text-center w-[500px] font-black text-sm text-slate-950">
                  <span>{dotBalls}</span>
                  <span>{bw.overs}.{bw.ballsInCurrentOver}</span>
                  <span>{bw.runsConceded}</span>
                  <span className="text-rose-600 font-black">{bw.wickets}</span>
                  <span>{eco}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fall of Wickets Dynamic Section */}
        <div className="bg-slate-950 p-4 border-t border-purple-800/60 space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-rose-600 text-white px-4 py-1 rounded text-xs font-black uppercase w-44 text-center shadow">
              FALL OF WICKETS
            </span>
            {fowList.length > 0 ? (
              fowList.map((fow: { score: number }, idx: number) => (
                <span key={idx} className="bg-slate-800 text-white px-3 py-1 rounded text-xs font-black">
                  {idx + 1} ({fow.score})
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs font-bold italic">No wickets fallen</span>
            )}
          </div>
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
