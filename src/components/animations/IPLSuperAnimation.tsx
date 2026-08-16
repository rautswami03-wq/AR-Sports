import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const IPLSuperAnimation: React.FC = () => {
  const { activeAnimation, teamA, teamB, battingTeamId } = useBroadcastStore();

  const isBattingA = battingTeamId === 'teamA' || battingTeamId === teamA.id;
  const activeTeam = isBattingA ? teamA : teamB;

  if (!activeAnimation) return null;

  // Configuration map for IPL Animation types
  const configMap: Record<string, { title: string; subtitle: string; bgGradient: string; glowColor: string; accentColor: string }> = {
    SIX: {
      title: 'MAXIMUM SIX!',
      subtitle: 'OVER THE ROPES • 6 RUNS',
      bgGradient: 'linear-gradient(135deg, #7e22ce 0%, #db2777 50%, #eab308 100%)',
      glowColor: 'rgba(219, 39, 119, 0.9)',
      accentColor: '#fde047',
    },
    FOUR: {
      title: 'CRUNCHING FOUR!',
      subtitle: 'RACED TO THE BOUNDARY • 4 RUNS',
      bgGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #38bdf8 100%)',
      glowColor: 'rgba(37, 99, 235, 0.9)',
      accentColor: '#38bdf8',
    },
    WICKET: {
      title: 'OUT! WICKET!',
      subtitle: 'BIG BREAKTHROUGH FOR THE BOWLER',
      bgGradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #f97316 100%)',
      glowColor: 'rgba(220, 38, 38, 0.95)',
      accentColor: '#fef08a',
    },
    FIFTY: {
      title: 'HALF CENTURY 50!',
      subtitle: 'SPLENDID FIFTY FOR THE BATTER',
      bgGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fef08a 100%)',
      glowColor: 'rgba(245, 158, 11, 0.9)',
      accentColor: '#ffffff',
    },
    CENTURY: {
      title: 'MAGNIFICENT 100!',
      subtitle: 'TON UP! INCREDIBLE HUNDRED',
      bgGradient: 'linear-gradient(135deg, #854d0e 0%, #eab308 50%, #fef08a 100%)',
      glowColor: 'rgba(234, 179, 8, 0.95)',
      accentColor: '#ffffff',
    },
    FREE_HIT: {
      title: 'FREE HIT! 🔥',
      subtitle: 'NO RISK • SWING HARD',
      bgGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #facc15 100%)',
      glowColor: 'rgba(249, 115, 22, 0.9)',
      accentColor: '#ffffff',
    },
    STRATEGIC_TIMEOUT: {
      title: 'STRATEGIC TIMEOUT',
      subtitle: '2 MIN 30 SEC BROADCAST BREAK',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
      glowColor: 'rgba(3, 105, 161, 0.8)',
      accentColor: '#38bdf8',
    },
  };

  const config = configMap[activeAnimation] || {
    title: `${activeAnimation}`,
    subtitle: `${activeTeam.fullName} INNINGS`,
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)',
    glowColor: 'rgba(99, 102, 241, 0.8)',
    accentColor: '#facc15',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-[100] overflow-hidden"
    >
      {/* Background Energy Rays */}
      <motion.div
        initial={{ scale: 0.5, rotate: 0 }}
        animate={{ scale: [1, 1.4, 1.2], rotate: 180 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
        className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: config.bgGradient }}
      />

      {/* Shockwave Rings */}
      <motion.div
        initial={{ scale: 0.2, opacity: 1 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute w-96 h-96 rounded-full border-8 border-white/80"
        style={{ boxShadow: `0 0 60px ${config.glowColor}` }}
      />

      {/* Main 3D Skewed IPL Graphic Card */}
      <motion.div
        initial={{ scale: 0.2, y: 150, rotateX: 45, skewX: -15 }}
        animate={{ scale: 1.1, y: 0, rotateX: 0, skewX: -12 }}
        exit={{ scale: 0.3, y: -150, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="relative z-20 px-12 md:px-20 py-8 rounded-3xl border-4 border-white/90 shadow-2xl overflow-hidden backdrop-blur-md"
        style={{
          background: config.bgGradient,
          boxShadow: `0 0 100px ${config.glowColor}, 0 20px 40px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Shimmer Gloss Sheen */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
        />

        {/* Dynamic Team Ribbon Tag */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span
            className="w-4 h-4 rounded-full border border-white/60 shadow-md"
            style={{ backgroundColor: activeTeam.primaryColor }}
          />
          <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white/90 drop-shadow">
            {activeTeam.fullName}
          </span>
        </div>

        {/* Metallic 3D Title */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase text-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
          style={{
            WebkitTextStroke: '2px rgba(255,255,255,0.4)',
            textShadow: '0 6px 20px rgba(0,0,0,0.9), 0 0 30px rgba(255,255,255,0.5)',
          }}
        >
          {config.title}
        </motion.h1>

        {/* Subtitle Banner */}
        <p
          className="text-base md:text-2xl font-black tracking-widest text-center uppercase mt-2 drop-shadow-md"
          style={{ color: config.accentColor }}
        >
          {config.subtitle}
        </p>

        {/* Dynamic Score Ribbon */}
        <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs md:text-sm text-white/80 font-bold uppercase tracking-wider">
          <span>SCORE: {activeTeam.score}/{activeTeam.wickets}</span>
          <span>OVERS: {activeTeam.overs}.{activeTeam.balls}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
