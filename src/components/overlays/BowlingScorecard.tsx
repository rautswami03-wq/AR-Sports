import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore, hexToRgba, getContrastTextColor } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';

export const BowlingScorecard: React.FC = () => {
  const { teamA, teamB, bowlingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = bowlingTeamId === teamA.id || bowlingTeamId === teamA.shortName || bowlingTeamId === 'teamA' || bowlingTeamId === teamA.fullName;
  const bowlingTeam = isTeamA ? teamA : teamB;
  const battingTeam = isTeamA ? teamB : teamA;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
  const totalExtras = battingTeam.extras || 0;
  const fowList = battingTeam.fallOfWickets || [];

  const battingColor = battingTeam.primaryColor || '#00529B';
  const bowlingColor = bowlingTeam.primaryColor || '#FFD700';

  const battingHeaderTextColor = getContrastTextColor(battingColor);
  const bowlingHeaderTextColor = getContrastTextColor(bowlingColor);

  if (layoutStyle === 't20-asia-cup') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans" data-overlay="bowling-scorecard">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1160px] shadow-2xl rounded-2xl overflow-hidden border-2 border-cyan-400/60 flex items-stretch"
          style={{ background: 'rgba(11, 27, 61, 0.95)' }}
        >
          <div className="w-32 flex-shrink-0 bg-[#000865]/90">
            <AsiaCupLeftFullWings className="w-full h-full" />
          </div>
          <div className="flex-1 flex flex-col" style={{ background: 'rgba(7, 16, 38, 0.92)' }}>
            {/* Top header bar dynamically using battingTeam.primaryColor */}
            <div
              className="px-8 py-4 flex items-center justify-between border-b-2 shadow-md transition-colors"
              style={{
                backgroundColor: battingColor,
                borderColor: bowlingColor,
                color: battingHeaderTextColor,
              }}
            >
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wide font-headers" style={{ color: battingHeaderTextColor }}>
                  {bowlingTeam.fullName || bowlingTeam.shortName}
                </h2>
                <p
                  className="text-sm font-bold uppercase mt-0.5 tracking-wider font-headers"
                  style={{ color: battingHeaderTextColor === '#000000' ? '#334155' : '#cbd5e1' }}
                >
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div
                className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider font-headers shadow"
                style={{
                  backgroundColor: battingHeaderTextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
                  color: battingHeaderTextColor,
                }}
              >
                BOWLING ATTACK
              </div>
            </div>

            {/* Sub-header using bowling team primary color */}
            <div
              className="px-8 py-2 flex items-center justify-between text-sm font-black uppercase tracking-wider font-headers shadow"
              style={{
                backgroundColor: bowlingColor,
                color: bowlingHeaderTextColor,
              }}
            >
              <span className="w-48">BOWLER</span>
              <div className="grid grid-cols-5 gap-6 text-center w-[500px]">
                <span>Dot Balls</span>
                <span>Overs</span>
                <span>Runs</span>
                <span>Wickets</span>
                <span>Economy</span>
              </div>
            </div>

            {/* Bowler Rows dynamically using 10% opacity of bowlingTeam.primaryColor */}
            <div className="p-4 space-y-1.5 flex-1 min-h-[200px]" style={{ background: 'rgba(4, 10, 24, 0.90)' }}>
              {bowlingTeam.bowlers.map((bw, idx) => {
                const totalBwBalls = bw.overs * 6 + bw.ballsInCurrentOver;
                const eco = totalBwBalls > 0 ? ((bw.runsConceded / totalBwBalls) * 6).toFixed(2) : '0.00';
                const dotBalls = Math.max(0, totalBwBalls - Math.floor(bw.runsConceded / 2));
                const rowBg = hexToRgba(bowlingColor, idx % 2 === 0 ? 0.10 : 0.15);
                return (
                  <div
                    key={bw.id}
                    className="px-6 py-2.5 rounded-sm flex items-center justify-between font-black text-sm text-white shadow-sm transition-all"
                    style={{
                      backgroundColor: rowBg,
                      borderLeft: `4px solid ${bowlingColor}`,
                    }}
                  >
                    <span className="uppercase tracking-wide w-48 truncate font-black text-base font-headers">{bw.name}</span>
                    <div className="grid grid-cols-5 gap-6 text-center w-[500px] font-black text-base font-numbers">
                      <span className="text-slate-300">{dotBalls}</span>
                      <span className="text-sky-300">{bw.overs}.{bw.ballsInCurrentOver}</span>
                      <span className="text-amber-300">{bw.runsConceded}</span>
                      <span className="text-rose-400 font-black text-lg">{bw.wickets}</span>
                      <span className="text-emerald-300">{eco}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fall of Wickets */}
            <div className="border-t border-white/10">
              <div className="bg-[#00b4d8]/90 text-slate-950 px-8 py-1 flex items-center gap-8 text-xs font-black uppercase font-numbers">
                <span className="w-24">WICKETS</span>
                <div className="flex items-center gap-12 font-black">
                  {[1, 2, 3, 4, 5, 6].map((w) => <span key={w}>{w}</span>)}
                </div>
              </div>
              <div className="bg-[#ffc72c] text-slate-950 px-8 py-1.5 flex items-center gap-8 text-sm font-black uppercase font-numbers">
                <span className="w-24">RUNS</span>
                <div className="flex items-center gap-12 font-black">
                  {fowList.length > 0 ? (
                    fowList.slice(0, 6).map((fow, idx) => <span key={idx}>{fow.score}</span>)
                  ) : (
                    <span>{battingTeam.score}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (layoutStyle === 'icc-navarasa' || layoutStyle === 'crickpro-elite') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans" data-overlay="bowling-scorecard">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1140px] shadow-2xl rounded-2xl overflow-hidden border-2 border-pink-500/70 flex flex-col relative"
          style={{ background: 'rgba(11, 27, 61, 0.95)' }}
        >
          {/* Top Header Tab */}
          <div
            className="font-black text-sm py-1.5 text-center uppercase tracking-widest font-headers transition-colors"
            style={{
              backgroundColor: battingColor,
              color: battingHeaderTextColor,
            }}
          >
            {matchDetails.tournament || 'ICC WORLD CUP'} — BOWLING SCORECARD
          </div>

          <div className="flex-1 flex items-stretch">
            <div className="w-6 flex-shrink-0">
              <NavarasaVerticalRibbon className="w-full h-full" />
            </div>

            <div className="flex-1 flex flex-col" style={{ background: 'rgba(7, 16, 38, 0.92)' }}>
              {/* Teams & Match Subtitle */}
              <div
                className="px-8 py-3 flex items-center justify-between border-b-2 shadow-md transition-colors"
                style={{
                  backgroundColor: hexToRgba(battingColor, 0.92),
                  borderColor: bowlingColor,
                  color: battingHeaderTextColor,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚾</span>
                  <span className="text-2xl font-black uppercase font-headers" style={{ color: battingHeaderTextColor }}>
                    {bowlingTeam.fullName || bowlingTeam.shortName}
                  </span>
                </div>
                <div
                  className="text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider font-headers"
                  style={{
                    backgroundColor: bowlingColor,
                    color: bowlingHeaderTextColor,
                  }}
                >
                  {matchDetails.stage || 'MATCH NO- 1'} | NORMAL
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black uppercase opacity-90 font-headers" style={{ color: battingHeaderTextColor }}>
                    {battingTeam.fullName || battingTeam.shortName}
                  </span>
                  <span className="text-xl">🏏</span>
                </div>
              </div>

              {/* Sub-header using bowling team color */}
              <div
                className="px-8 py-2 flex items-center justify-between text-xs font-black uppercase tracking-wider font-headers"
                style={{
                  backgroundColor: bowlingColor,
                  color: bowlingHeaderTextColor,
                }}
              >
                <span className="w-48">BOWLER</span>
                <div className="grid grid-cols-5 gap-6 text-center w-[500px]">
                  <span>DOT BALLS</span>
                  <span>OVERS</span>
                  <span>RUNS</span>
                  <span>WICKETS</span>
                  <span>ECONOMY</span>
                </div>
              </div>

              {/* Bowler Rows */}
              <div className="p-4 space-y-1.5 flex-1 min-h-[220px]" style={{ background: 'rgba(4, 10, 24, 0.90)' }}>
                {bowlingTeam.bowlers.map((bw, idx) => {
                  const eco = bw.overs > 0 ? (bw.runsConceded / bw.overs).toFixed(2) : '0.00';
                  const dotBalls = Math.max(0, bw.overs * 6 - Math.floor(bw.runsConceded / 2));
                  const rowBg = hexToRgba(bowlingColor, idx % 2 === 0 ? 0.10 : 0.15);
                  return (
                    <div
                      key={bw.id}
                      className="px-6 py-2.5 rounded flex items-center justify-between font-black text-sm text-white shadow-sm transition-all"
                      style={{
                        backgroundColor: rowBg,
                        borderLeft: `4px solid ${bowlingColor}`,
                      }}
                    >
                      <span className="uppercase tracking-wide w-48 truncate font-extrabold font-headers">{bw.name}</span>
                      <div className="grid grid-cols-5 gap-6 text-center w-[500px] font-black text-sm font-numbers">
                        <span className="text-slate-300">{dotBalls}</span>
                        <span className="text-sky-300">{bw.overs}.{bw.ballsInCurrentOver}</span>
                        <span className="text-amber-300">{bw.runsConceded}</span>
                        <span className="text-rose-400 font-black text-base">{bw.wickets}</span>
                        <span className="text-emerald-300">{eco}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-purple-400 via-cyan-400 to-sky-400 px-8 py-3 flex items-center justify-between font-black text-slate-950 text-sm uppercase font-numbers">
                <div className="flex items-center gap-8">
                  <span>EXTRAS: <strong className="text-purple-950 text-lg ml-1">{totalExtras}</strong></span>
                  <span>OVERS: <strong className="text-purple-950 text-lg ml-1">{battingTeam.overs}.{battingTeam.balls}</strong></span>
                  <span>CRR: <strong className="text-purple-950 text-lg ml-1">{crr}</strong></span>
                </div>
                <div className="bg-amber-400 text-slate-950 px-8 py-1.5 rounded-lg text-2xl font-black tracking-tight shadow-lg border border-amber-300">
                  {battingTeam.score} - {battingTeam.wickets}
                </div>
              </div>
            </div>

            <div className="w-6 flex-shrink-0">
              <NavarasaVerticalRibbon className="w-full h-full" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/50 backdrop-blur-md" data-overlay="bowling-scorecard">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-[1100px] shadow-2xl rounded-xl overflow-hidden border-2 font-sans text-slate-100"
        style={{
          borderColor: theme.primaryAccent || '#facc15',
          background: 'rgba(11, 27, 61, 0.95)',
        }}
      >
        {/* Top Header Banner dynamically uses battingTeam.primaryColor */}
        <div
          className="py-3 px-6 flex items-center justify-between relative shadow-inner transition-colors"
          style={{
            backgroundColor: battingColor,
            color: battingHeaderTextColor,
          }}
        >
          <span
            className="px-5 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-md font-headers"
            style={{
              backgroundColor: battingHeaderTextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
              color: battingHeaderTextColor,
            }}
          >
            {matchDetails.tournament || theme.name}
          </span>
          <h2 className="text-xl font-black uppercase tracking-wider font-headers" style={{ color: battingHeaderTextColor }}>
            BOWLING SCORECARD
          </h2>
          <span
            className="text-xs font-bold uppercase tracking-wider font-headers"
            style={{ color: battingHeaderTextColor === '#000000' ? '#334155' : '#e2e8f0' }}
          >
            {matchDetails.stage || 'MATCH NO- 1'}
          </span>
        </div>

        <div
          className="text-white px-8 py-3.5 flex items-center justify-between border-b-2 border-white/20"
          style={{ background: theme.badgeBg || 'rgba(15, 23, 42, 0.95)' }}
        >
          <span className="text-2xl font-black uppercase tracking-wider font-headers">{battingTeam.fullName}</span>
          <div className="text-center font-extrabold text-xs uppercase tracking-widest text-slate-300 font-headers">
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'BOWLING CARD'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80 font-headers">{bowlingTeam.fullName}</span>
        </div>

        {/* Sub-header using bowlingTeam.primaryColor */}
        <div
          className="px-8 py-2 flex items-center justify-between text-xs font-black uppercase tracking-wider border-b border-white/10 font-headers shadow"
          style={{
            backgroundColor: bowlingColor,
            color: bowlingHeaderTextColor,
          }}
        >
          <span className="w-48">BOWLER</span>
          <div className="grid grid-cols-5 gap-6 text-center w-[500px]">
            <span>DOT BALLS</span>
            <span>OVERS</span>
            <span>RUNS</span>
            <span>WICKETS</span>
            <span>ECONOMY</span>
          </div>
        </div>

        {/* Bowler Rows with 10% opacity of bowlingTeam.primaryColor */}
        <div className="p-4 space-y-1.5 min-h-[220px]" style={{ background: 'rgba(7, 16, 38, 0.90)' }}>
          {bowlingTeam.bowlers.map((bw, idx) => {
            const eco = bw.overs > 0 ? (bw.runsConceded / bw.overs).toFixed(2) : '0.00';
            const dotBalls = Math.max(0, bw.overs * 6 - Math.floor(bw.runsConceded / 2));
            const rowBg = hexToRgba(bowlingColor, idx % 2 === 0 ? 0.10 : 0.15);
            return (
              <div
                key={bw.id}
                className="px-6 py-2.5 rounded flex items-center justify-between font-black text-sm text-white shadow-sm transition-all"
                style={{
                  backgroundColor: rowBg,
                  borderLeft: `4px solid ${bowlingColor}`,
                }}
              >
                <span className="uppercase tracking-wide w-48 truncate font-extrabold font-headers text-base">{bw.name}</span>
                <div className="grid grid-cols-5 gap-6 text-center w-[500px] font-black text-sm font-numbers">
                  <span className="text-slate-300">{dotBalls}</span>
                  <span className="text-sky-300">{bw.overs}.{bw.ballsInCurrentOver}</span>
                  <span className="text-amber-300">{bw.runsConceded}</span>
                  <span className="text-rose-400 font-black text-base">{bw.wickets}</span>
                  <span className="text-emerald-300">{eco}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-purple-800/60 space-y-2" style={{ background: 'rgba(4, 10, 24, 0.95)' }}>
          <div className="flex items-center gap-3">
            <span className="bg-rose-600 text-white px-4 py-1 rounded text-xs font-black uppercase w-44 text-center shadow font-headers">
              FALL OF WICKETS
            </span>
            {fowList.length > 0 ? (
              fowList.map((fow: { score: number }, idx: number) => (
                <span key={idx} className="bg-slate-800 text-white px-3 py-1 rounded text-xs font-black font-numbers">
                  {idx + 1} ({fow.score})
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs font-bold italic">No wickets fallen</span>
            )}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="bg-gradient-to-r from-purple-400 via-cyan-400 to-sky-400 px-8 py-3 flex items-center justify-between font-black text-slate-950 text-sm uppercase font-numbers">
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
