import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore, hexToRgba, getContrastTextColor } from '../../theme/presetThemes';
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

  const teamColor = battingTeam.primaryColor || '#00529B';
  const headerTextColor = getContrastTextColor(teamColor);

  if (layoutStyle === 't20-asia-cup') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans" data-overlay="batting-scorecard">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1160px] shadow-2xl rounded-2xl overflow-hidden border-2 border-cyan-400/60 flex items-stretch"
          style={{ background: 'rgba(11, 27, 61, 0.95)' }}
        >
          {/* Left Asia Cup Wings */}
          <div className="w-32 flex-shrink-0 bg-[#000865]/90">
            <AsiaCupLeftFullWings className="w-full h-full" />
          </div>

          {/* Main Scorecard Content */}
          <div className="flex-1 flex flex-col" style={{ background: 'rgba(7, 16, 38, 0.92)' }}>
            {/* Header dynamically uses battingTeam.primaryColor */}
            <div
              className="px-8 py-4 flex items-center justify-between border-b-2 shadow-md transition-colors"
              style={{
                backgroundColor: teamColor,
                borderColor: battingTeam.accentColor || '#ffc72c',
                color: headerTextColor,
              }}
            >
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wide font-headers" style={{ color: headerTextColor }}>
                  {battingTeam.fullName || battingTeam.shortName}
                </h2>
                <p
                  className="text-sm font-bold uppercase mt-0.5 tracking-wider font-headers"
                  style={{ color: headerTextColor === '#000000' ? '#334155' : '#cbd5e1' }}
                >
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div
                className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider font-headers shadow"
                style={{
                  backgroundColor: headerTextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
                  color: headerTextColor,
                }}
              >
                1ST INNINGS
              </div>
            </div>

            {/* Batter Rows dynamically using 10% opacity of battingTeam.primaryColor */}
            <div className="p-4 space-y-1.5 flex-1 min-h-[360px]" style={{ background: 'rgba(4, 10, 24, 0.90)' }}>
              {battingTeam.batters.map((b, idx) => {
                const isCurrent = b.isStriker || (!b.isOut && !b.dismissal);
                const rowBg = hexToRgba(teamColor, idx % 2 === 0 ? 0.10 : 0.15);
                return (
                  <div
                    key={b.id}
                    className="px-6 py-2.5 rounded-sm flex items-center justify-between font-black text-sm shadow-sm transition-all"
                    style={{
                      backgroundColor: isCurrent ? (battingTeam.accentColor || '#ffc72c') : rowBg,
                      color: isCurrent ? getContrastTextColor(battingTeam.accentColor || '#ffc72c') : '#ffffff',
                      borderLeft: `4px solid ${teamColor}`,
                    }}
                  >
                    <span className="w-64 uppercase truncate text-base font-headers">{b.name}</span>
                    <span className="flex-1 text-center font-bold text-xs opacity-90 px-4 truncate">
                      {b.isOut ? (b.dismissal || 'c & b Bowler') : isCurrent ? 'NOT OUT *' : ''}
                    </span>
                    <div className="flex items-center gap-10 font-black text-lg w-32 justify-end font-numbers">
                      <span className="text-xl">{b.runs}</span>
                      <span className="text-sm font-bold opacity-80">({b.balls})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Footer Bar */}
            <div className="bg-[#dc2626]/95 text-white px-8 py-3 flex items-center justify-between font-black text-xl uppercase tracking-wider font-numbers">
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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans" data-overlay="batting-scorecard">
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
              backgroundColor: teamColor,
              color: headerTextColor,
            }}
          >
            {matchDetails.tournament || 'ICC WORLD CUP'} — BATTING SCORECARD
          </div>

          <div className="flex-1 flex items-stretch">
            {/* Left Navarasa Ribbon */}
            <div className="w-6 flex-shrink-0">
              <NavarasaVerticalRibbon className="w-full h-full" />
            </div>

            <div className="flex-1 flex flex-col" style={{ background: 'rgba(7, 16, 38, 0.92)' }}>
              {/* Teams & Match Subtitle */}
              <div
                className="px-8 py-3 flex items-center justify-between border-b-2 shadow-md transition-colors"
                style={{
                  backgroundColor: hexToRgba(teamColor, 0.92),
                  borderColor: battingTeam.accentColor || '#ec4899',
                  color: headerTextColor,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏏</span>
                  <span className="text-2xl font-black uppercase font-headers" style={{ color: headerTextColor }}>
                    {battingTeam.fullName || battingTeam.shortName}
                  </span>
                </div>
                <div
                  className="text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider font-headers"
                  style={{
                    backgroundColor: battingTeam.accentColor || '#e91e63',
                    color: getContrastTextColor(battingTeam.accentColor || '#e91e63'),
                  }}
                >
                  {matchDetails.stage || 'MATCH NO- 1'} | NORMAL
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black uppercase opacity-90 font-headers" style={{ color: headerTextColor }}>
                    {bowlingTeam.fullName || bowlingTeam.shortName}
                  </span>
                  <span className="text-xl">⚾</span>
                </div>
              </div>

              {/* Rows */}
              <div className="p-4 space-y-1.5 flex-1 min-h-[340px]" style={{ background: 'rgba(4, 10, 24, 0.90)' }}>
                {battingTeam.batters.map((b, idx) => {
                  const isCurrent = b.isStriker || (!b.isOut && !b.dismissal);
                  const rowBg = hexToRgba(teamColor, idx % 2 === 0 ? 0.10 : 0.15);
                  return (
                    <div
                      key={b.id}
                      className="px-6 py-2.5 rounded-sm flex items-center justify-between font-black text-sm shadow-sm transition-all"
                      style={{
                        backgroundColor: isCurrent ? (battingTeam.accentColor || '#e91e63') : rowBg,
                        color: isCurrent ? getContrastTextColor(battingTeam.accentColor || '#e91e63') : '#ffffff',
                        borderLeft: `4px solid ${teamColor}`,
                      }}
                    >
                      <span className="w-64 uppercase truncate text-base font-headers">{b.name}</span>
                      <span className="flex-1 text-center font-bold text-xs opacity-90 px-4 truncate">
                        {b.isOut ? (b.dismissal || 'c & b Bowler') : isCurrent ? 'NOT OUT *' : ''}
                      </span>
                      <div className="flex items-center gap-10 font-black text-lg w-32 justify-end font-numbers">
                        <span className="text-xl">{b.runs}</span>
                        <span className="text-sm font-bold opacity-80">({b.balls})</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Footer with Chevron Score */}
              <div className="bg-gradient-to-r from-pink-400 via-sky-400 to-[#ffd700] p-0.5 flex items-stretch">
                <div className="bg-pink-500/95 text-white px-6 py-2 font-black text-sm uppercase flex items-center font-numbers">
                  EXTRAS {totalExtras}
                </div>
                <div className="bg-sky-600/95 text-white px-8 py-2 font-black text-sm uppercase flex-1 flex items-center justify-center font-numbers">
                  OVERS {battingTeam.overs}.{battingTeam.balls}
                </div>
                <div className="bg-[#ffd700] text-slate-950 px-10 py-2 font-black text-2xl uppercase flex items-center shadow-md font-numbers">
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
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/50 backdrop-blur-md" data-overlay="batting-scorecard">
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
            backgroundColor: teamColor,
            color: headerTextColor,
          }}
        >
          <span
            className="px-5 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-md font-headers"
            style={{
              backgroundColor: headerTextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
              color: headerTextColor,
            }}
          >
            {matchDetails.tournament || theme.name}
          </span>
          <h2 className="text-xl font-black uppercase tracking-wider font-headers" style={{ color: headerTextColor }}>
            BATTING SCORECARD
          </h2>
          <span
            className="text-xs font-bold uppercase tracking-wider font-headers"
            style={{ color: headerTextColor === '#000000' ? '#334155' : '#e2e8f0' }}
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
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'INNINGS 1'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80 font-headers">{bowlingTeam.fullName}</span>
        </div>

        {/* Batters Table with 10% opacity of battingTeam.primaryColor */}
        <div className="p-4 space-y-1.5 min-h-[300px]" style={{ background: 'rgba(7, 16, 38, 0.90)' }}>
          {battingTeam.batters.map((b, idx) => {
            const isCurrentBatter = b.isStriker || (!b.isOut && !b.dismissal);
            const rowBg = hexToRgba(teamColor, idx % 2 === 0 ? 0.10 : 0.15);
            return (
              <div
                key={b.id}
                className="px-5 py-2.5 rounded flex items-center justify-between font-black text-sm shadow-sm transition-all"
                style={{
                  backgroundColor: isCurrentBatter ? (battingTeam.accentColor || '#e11d48') : rowBg,
                  color: isCurrentBatter ? getContrastTextColor(battingTeam.accentColor || '#e11d48') : '#ffffff',
                  borderLeft: `4px solid ${teamColor}`,
                }}
              >
                <span className="uppercase tracking-wide w-56 truncate font-headers text-base">{b.name}</span>
                <span className="text-xs font-bold flex-1 text-center truncate px-4 opacity-90">
                  {b.isOut ? (b.dismissal || 'c & b Bowler') : isCurrentBatter ? 'NOT OUT *' : ''}
                </span>
                <div className="flex items-center gap-8 font-black text-base w-28 justify-end font-numbers">
                  <span className={isCurrentBatter ? 'text-amber-300 font-black text-lg' : 'text-amber-400 font-bold'}>{b.runs}</span>
                  <span className="text-xs text-slate-300">({b.balls})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Score Summary */}
        <div
          className="px-8 py-3 flex items-center justify-between font-black border-t-2 border-white/20 font-numbers"
          style={{ background: theme.badgeBg || 'rgba(15, 23, 42, 0.95)' }}
        >
          <div className="flex items-center gap-8 text-sm uppercase">
            <span>EXTRAS: <span className="text-amber-400 font-extrabold">{totalExtras}</span></span>
            <span>OVERS: <span className="text-sky-400 font-extrabold">{battingTeam.overs}.{battingTeam.balls}</span></span>
            <span>CRR: <span className="text-emerald-400 font-extrabold">{crr}</span></span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase text-slate-400 font-headers">TOTAL:</span>
            <span className="text-3xl font-black tracking-tight" style={{ color: theme.primaryAccent || '#facc15' }}>
              {battingTeam.score}-{battingTeam.wickets}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
