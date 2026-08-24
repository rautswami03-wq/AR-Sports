import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';

export const BattingScorecard: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
  const totalExtras = battingTeam.extras || 0;

  if (layoutStyle === 't20-asia-cup') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1160px] shadow-2xl rounded-2xl overflow-hidden bg-white border-2 border-cyan-400 flex items-stretch"
        >
          {/* Left Asia Cup Wings */}
          <div className="w-32 flex-shrink-0 bg-[#000865]">
            <AsiaCupLeftFullWings className="w-full h-full" />
          </div>

          {/* Main Scorecard Content */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="bg-[#000865] px-8 py-4 text-white flex items-center justify-between border-b-2 border-[#ffc72c]">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wide">{battingTeam.fullName || battingTeam.shortName}</h2>
                <p className="text-sm font-bold text-slate-300 uppercase mt-0.5 tracking-wider">
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div className="text-[#ffc72c] text-3xl font-black">
                🔥
              </div>
            </div>

            {/* Batter Rows */}
            <div className="p-4 space-y-1.5 flex-1 bg-gradient-to-b from-slate-50 to-slate-100 min-h-[360px]">
              {battingTeam.batters.map((b) => {
                const isCurrent = b.isStriker || (!b.isOut && !b.dismissal);
                return (
                  <div
                    key={b.id}
                    className={`px-6 py-2.5 rounded-sm flex items-center justify-between font-black text-sm shadow-sm ${
                      isCurrent
                        ? 'bg-[#ffc72c] text-slate-950 border border-amber-400'
                        : 'bg-white text-[#000865] border border-slate-200'
                    }`}
                  >
                    <span className="w-64 uppercase truncate text-base">{b.name}</span>
                    <span className="flex-1 text-center font-bold text-xs opacity-90 px-4 truncate">
                      {b.isOut ? (b.dismissal || 'c & b Bowler') : isCurrent ? 'NOT OUT *' : ''}
                    </span>
                    <div className="flex items-center gap-10 font-black text-lg w-32 justify-end">
                      <span className="text-xl">{b.runs}</span>
                      <span className="text-sm font-bold opacity-80">{b.balls}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Red Footer Bar */}
            <div className="bg-[#dc2626] text-white px-8 py-3 flex items-center justify-between font-black text-xl uppercase tracking-wider">
              <span>Run Rate {crr}</span>
              <span>Extras {totalExtras}</span>
              <span>Overs {battingTeam.overs}.{battingTeam.balls}</span>
              <span className="text-3xl font-black">{battingTeam.score} - {battingTeam.wickets}</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (layoutStyle === 'icc-navarasa' || layoutStyle === 'crickpro-elite') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1140px] shadow-2xl rounded-2xl overflow-hidden bg-white border-2 border-pink-500 flex flex-col relative"
        >
          {/* Top Cyan Header Tab */}
          <div className="bg-[#00d4ff] text-[#20003b] font-black text-sm py-1 text-center uppercase tracking-widest">
            ICC WORLD CUP
          </div>

          <div className="flex-1 flex items-stretch">
            {/* Left Navarasa Ribbon */}
            <div className="w-6 flex-shrink-0">
              <NavarasaVerticalRibbon className="w-full h-full" />
            </div>

            <div className="flex-1 flex flex-col">
              {/* Teams & Match Subtitle */}
              <div className="bg-[#20003b] text-white px-8 py-2.5 flex items-center justify-between border-b-2 border-pink-500">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏏</span>
                  <span className="text-2xl font-black uppercase">{battingTeam.fullName || battingTeam.shortName}</span>
                </div>
                <div className="bg-[#e91e63] text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                  {matchDetails.stage || 'MATCH NO- 1'} | NORMAL
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black uppercase opacity-90">{bowlingTeam.fullName || bowlingTeam.shortName}</span>
                  <span className="text-xl">⚾</span>
                </div>
              </div>

              {/* Rows */}
              <div className="p-4 space-y-1.5 flex-1 bg-white min-h-[340px]">
                {battingTeam.batters.map((b) => {
                  const isCurrent = b.isStriker || (!b.isOut && !b.dismissal);
                  return (
                    <div
                      key={b.id}
                      className={`px-6 py-2.5 rounded-sm flex items-center justify-between font-black text-sm shadow-sm ${
                        isCurrent
                          ? 'bg-[#e91e63] text-white'
                          : 'bg-white text-[#20003b] border-b border-slate-100'
                      }`}
                    >
                      <span className="w-64 uppercase truncate text-base">{b.name}</span>
                      <span className="flex-1 text-center font-bold text-xs opacity-90 px-4 truncate">
                        {b.isOut ? (b.dismissal || 'c & b Bowler') : isCurrent ? 'NOT OUT *' : ''}
                      </span>
                      <div className="flex items-center gap-10 font-black text-lg w-32 justify-end">
                        <span className="text-xl">{b.runs}</span>
                        <span className="text-sm font-bold opacity-80">{b.balls}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Footer with Chevron Score */}
              <div className="bg-gradient-to-r from-pink-400 via-sky-400 to-[#ffd700] p-0.5 flex items-stretch">
                <div className="bg-pink-500 text-white px-6 py-2 font-black text-sm uppercase flex items-center">
                  EXTRAS {totalExtras}
                </div>
                <div className="bg-sky-600 text-white px-8 py-2 font-black text-sm uppercase flex-1 flex items-center justify-center">
                  OVERS {battingTeam.overs}.{battingTeam.balls}
                </div>
                <div className="bg-[#ffd700] text-slate-950 px-10 py-2 font-black text-2xl uppercase flex items-center shadow-md">
                  {battingTeam.score} - {battingTeam.wickets}
                </div>
              </div>
            </div>

            {/* Right Navarasa Ribbon */}
            <div className="w-6 flex-shrink-0">
              <NavarasaVerticalRibbon className="w-full h-full" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-[1100px] shadow-2xl rounded-xl overflow-hidden border-2 bg-slate-950 font-sans text-slate-100"
        style={{ borderColor: theme.primaryAccent || '#facc15' }}
      >
        {/* Top Header Banner */}
        <div
          className="py-2.5 px-6 flex items-center justify-center relative shadow-inner"
          style={{ background: theme.headerGradient || 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <span
            className="text-slate-950 px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow-md"
            style={{ backgroundColor: theme.primaryAccent || '#facc15' }}
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
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'INNINGS 1'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80">{bowlingTeam.fullName}</span>
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

        {/* Footer Score Summary */}
        <div
          className="px-8 py-3 flex items-center justify-between font-black border-t-2 border-white/20"
          style={{ background: theme.badgeBg || '#0f172a' }}
        >
          <div className="flex items-center gap-8 text-sm uppercase">
            <span>EXTRAS: <span className="text-amber-400 font-extrabold">{totalExtras}</span></span>
            <span>OVERS: <span className="text-sky-400 font-extrabold">{battingTeam.overs}.{battingTeam.balls}</span></span>
            <span>CRR: <span className="text-emerald-400 font-extrabold">{crr}</span></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase text-slate-400">TOTAL:</span>
            <span className="text-3xl font-black tracking-tight" style={{ color: theme.primaryAccent || '#facc15' }}>
              {battingTeam.score}-{battingTeam.wickets}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
