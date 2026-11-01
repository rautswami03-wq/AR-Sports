import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface WicketStingProps {
  className?: string;
  batterName?: string;
  bowlerName?: string;
}

export const WicketSting: React.FC<WicketStingProps> = ({
  className = '',
  batterName,
  bowlerName,
}) => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const currentBowler = bowlerName || bowlingTeam.bowlers.find((b) => b.isCurrent)?.name || bowlingTeam.bowlers[0]?.name || teamA.bowlers.find((b) => b.isCurrent)?.name || teamB.bowlers.find((b) => b.isCurrent)?.name;
  const lastOutBatter =
    batterName ||
    battingTeam.batters.filter((b) => b.isOut).slice(-1)[0]?.name ||
    bowlingTeam.batters.filter((b) => b.isOut).slice(-1)[0]?.name ||
    teamA.batters.filter((b) => b.isOut).slice(-1)[0]?.name ||
    teamB.batters.filter((b) => b.isOut).slice(-1)[0]?.name;

  return (
    <div
      className={`fixed top-1/2 left-0 w-full -translate-y-1/2 z-[100] select-none font-sans overflow-hidden flex items-center justify-center pointer-events-none ${className}`}
      data-overlay="wicket-sting"
    >
      {/* ── LEFT PANEL: Slides in from Left (-100% -> 0) ── */}
      <motion.div
        initial={{ x: '-100%', skewX: -12 }}
        animate={{ x: '0%', skewX: -12 }}
        exit={{ x: '-100%', skewX: -12 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="absolute left-0 top-0 bottom-0 w-[55%] bg-gradient-to-r from-[#370000] via-[#990000] to-[#E63946] border-y-4 border-[#FF5A00] shadow-[0_0_50px_rgba(230,57,70,0.85)] overflow-hidden"
      >
        {/* Repeating text watermark background */}
        <div className="absolute inset-0 flex items-center opacity-25 whitespace-nowrap overflow-hidden select-none">
          <span className="text-7xl font-black italic tracking-widest text-white uppercase pr-8">
            WICKET WICKET WICKET WICKET WICKET WICKET WICKET
          </span>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL: Slides in from Right (100% -> 0) ── */}
      <motion.div
        initial={{ x: '100%', skewX: -12 }}
        animate={{ x: '0%', skewX: -12 }}
        exit={{ x: '100%', skewX: -12 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="absolute right-0 top-0 bottom-0 w-[55%] bg-gradient-to-l from-[#370000] via-[#990000] to-[#E63946] border-y-4 border-[#FF5A00] shadow-[0_0_50px_rgba(230,57,70,0.85)] overflow-hidden"
      >
        {/* Repeating text watermark background */}
        <div className="absolute inset-0 flex items-center justify-end opacity-25 whitespace-nowrap overflow-hidden select-none">
          <span className="text-7xl font-black italic tracking-widest text-white uppercase pl-8">
            WICKET WICKET WICKET WICKET WICKET WICKET WICKET
          </span>
        </div>
      </motion.div>

      {/* ── CENTER BROADCAST CONTENT (Zooms & Glows in Center) ── */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.75, 1.08, 1], opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-20 flex flex-col items-center justify-center py-6 md:py-8 px-12 text-center"
      >
        {/* Top Mini Pill */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-black/70 border border-red-400 text-xs font-black uppercase tracking-[0.25em] text-[#FFDC35] mb-2 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>OUT! DISMISSAL</span>
        </div>

        {/* Massive Central Title */}
        <h1
          className="text-7xl md:text-9xl lg:text-[10rem] font-black italic uppercase tracking-wider text-transparent bg-clip-text leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]"
          style={{
            backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFB703 45%, #E63946 100%)',
            WebkitTextStroke: '3px rgba(0, 0, 0, 0.75)',
            textShadow: '0 0 45px rgba(230, 57, 70, 0.95), 0 0 90px rgba(255, 90, 0, 0.7)',
          }}
        >
          WICKET
        </h1>

        {/* Bottom Subtitle / Dismissal Details */}
        <p className="mt-2 text-sm md:text-lg font-black uppercase tracking-[0.3em] text-white drop-shadow-md bg-black/60 px-6 py-1 rounded-md border border-white/20">
          {lastOutBatter ? (
            <>
              <span className="text-[#FFDC35]">{lastOutBatter}</span>
              {currentBowler && <span> • b {currentBowler}</span>}
            </>
          ) : (
            'BIG BREAKTHROUGH FOR THE BOWLING SIDE'
          )}
        </p>
      </motion.div>
    </div>
  );
};
