import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { hexToRgba, getContrastTextColor } from '../../theme/presetThemes';

export const TargetOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails, battingTeamId } = useBroadcastStore();
  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA' ||
    battingTeamId === teamA.fullName;
  const chasingTeam = isTeamA ? teamA : teamB;
  const defendingTeam = isTeamA ? teamB : teamA;

  const target = matchDetails.targetRuns || 20;
  const runsNeed = Math.max(0, target - chasingTeam.score);
  const totalMaxBalls = (matchDetails.totalOvers || 20) * 6;
  const ballsBowled = chasingTeam.overs * 6 + chasingTeam.balls;
  const ballsRemaining = Math.max(0, totalMaxBalls - ballsBowled);
  const reqRrr = (target / (matchDetails.totalOvers || 20)).toFixed(2);

  const primaryColor = chasingTeam.primaryColor || '#00529B';
  const contrastText = getContrastTextColor(primaryColor);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 font-sans pointer-events-none select-none bg-black/60 backdrop-blur-md"
      data-overlay="target-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-cyan-400/40 pointer-events-auto flex flex-col filter drop-shadow-2xl"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between w-full px-8 py-2.5 bg-slate-950/90 border-b border-cyan-400/30 text-xs font-black uppercase tracking-widest text-cyan-300 font-headers">
          <span>{matchDetails.tournament || 'TATA IPL 2025'}</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            2ND INNINGS TARGET
          </span>
          <span>{defendingTeam.shortName || 'DEF'} DEFENDING</span>
        </div>

        {/* ── TOP HALF: Deep Black/Blue Gradient (TARGET + Coral Yellow Number) ── */}
        <div
          className="relative z-20 flex flex-col items-center justify-center pt-8 pb-14 px-8 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #020617 0%, #060e26 50%, #0a1638 100%)',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), 50% 100%, 0% calc(100% - 24px))',
          }}
        >
          {/* Subtle radial stadium lighting glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(5, 112, 240, 0.45) 0%, transparent 70%)',
            }}
          />

          {/* Glowing TARGET title */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.25em] text-white drop-shadow-[0_0_24px_rgba(0,242,254,0.7)] font-headers leading-none"
          >
            TARGET
          </h2>

          {/* Target number in Coral Yellow (#FFDC35) */}
          <div
            className="text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tight leading-none text-[#FFDC35] drop-shadow-[0_0_35px_rgba(255,220,53,0.65)] font-numbers mt-2"
          >
            {target}
          </div>

          {/* Overs & Required Run Rate info */}
          <div className="flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-widest text-slate-300 mt-2 bg-black/50 px-5 py-1 rounded-full border border-white/10 font-headers shadow-inner">
            <span>{matchDetails.totalOvers || 20} OVERS</span>
            <span className="text-cyan-400 font-black">•</span>
            <span>
              REQ RR: <strong className="text-[#00F2FE] font-black font-numbers">{reqRrr}</strong> RPO
            </span>
          </div>

          {/* Glowing Cyan Accent Line along bottom kite divider */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-6 pointer-events-none z-30 overflow-visible"
            viewBox="0 0 100 24"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,0 50,24 100,0"
              fill="none"
              stroke="#00F2FE"
              strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 8px #00F2FE) drop-shadow(0 0 3px #0570F0)' }}
            />
          </svg>
        </div>

        {/* ── BOTTOM HALF: Team Colors (Chasing team name + current score) ── */}
        <div
          className="relative z-10 -mt-6 pt-10 pb-6 px-8 flex flex-col items-center justify-center text-center"
          style={{
            clipPath: 'polygon(0% 24px, 50% 0%, 100% 24px, 100% 100%, 0% 100%)',
            background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.95)} 0%, ${hexToRgba(primaryColor, 0.82)} 65%, rgba(10, 15, 30, 0.95) 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-black px-3 py-1 rounded uppercase tracking-wider font-headers border border-white/20 shadow-sm"
              style={{ background: 'rgba(0,0,0,0.4)', color: '#FFFFFF' }}
            >
              {chasingTeam.shortName || 'CHASE'}
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-headers drop-shadow-md">
              {chasingTeam.fullName || chasingTeam.shortName}
            </h3>
          </div>

          {/* Current Score & Overs */}
          <div className="flex items-baseline gap-2 mt-2 font-numbers">
            <span className="text-slate-200 text-xs md:text-sm font-bold uppercase tracking-widest font-headers">
              CURRENT SCORE:
            </span>
            <span className="text-5xl md:text-6xl font-black text-white drop-shadow-lg tracking-tight">
              {chasingTeam.score}-{chasingTeam.wickets}
            </span>
            <span className="text-xl md:text-2xl font-bold text-slate-300">
              ({chasingTeam.overs}.{chasingTeam.balls} ov)
            </span>
          </div>
        </div>

        {/* ── TICKER AT VERY BOTTOM: NEED X RUNS FROM Y BALLS ── */}
        <div
          className="w-full py-3.5 px-6 flex items-center justify-center gap-2 md:gap-3 text-center uppercase tracking-wider font-numbers font-black text-xl md:text-2xl border-t border-white/20 shadow-lg"
          style={{
            background: primaryColor,
            color: contrastText === '#000000' ? '#000000' : '#FFFFFF',
          }}
        >
          <span className="font-headers tracking-widest text-sm md:text-base opacity-95">
            NEED
          </span>
          <span className="text-3xl md:text-4xl text-[#FFDC35] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-black leading-none">
            {runsNeed}
          </span>
          <span className="font-headers tracking-widest text-sm md:text-base opacity-95">
            RUNS FROM
          </span>
          <span className="text-3xl md:text-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-black leading-none">
            {ballsRemaining}
          </span>
          <span className="font-headers tracking-widest text-sm md:text-base opacity-95">
            BALLS
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default TargetOverlay;
