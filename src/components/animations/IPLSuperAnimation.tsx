import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

export const IPLSuperAnimation: React.FC = () => {
  const { activeAnimation, teamA, teamB, battingTeamId, tournamentId, matchDetails } = useBroadcastStore();

  if (!activeAnimation) return null;

  const isBattingA = battingTeamId === 'teamA' || battingTeamId === teamA.id;
  const activeTeam = isBattingA ? teamA : teamB;
  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const variant = theme.animationVariant || 'explosive-gold';

  // Comprehensive configuration map for all cricket event types
  const configMap: Record<string, { title: string; subtitle: string; bgGradient: string; glowColor: string; accentColor: string; icon?: string }> = {
    SIX: {
      title: 'MAXIMUM SIX!',
      subtitle: 'OVER THE ROPES • 6 RUNS',
      bgGradient: 'linear-gradient(135deg, #7e22ce 0%, #db2777 50%, #eab308 100%)',
      glowColor: 'rgba(219, 39, 119, 0.9)',
      accentColor: '#fde047',
      icon: '🚀',
    },
    FOUR: {
      title: 'CRUNCHING FOUR!',
      subtitle: 'RACED TO THE BOUNDARY • 4 RUNS',
      bgGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #38bdf8 100%)',
      glowColor: 'rgba(37, 99, 235, 0.9)',
      accentColor: '#38bdf8',
      icon: '⚡',
    },
    WICKET: {
      title: 'OUT! WICKET!',
      subtitle: 'BIG BREAKTHROUGH FOR THE BOWLER',
      bgGradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #f97316 100%)',
      glowColor: 'rgba(220, 38, 38, 0.95)',
      accentColor: '#fef08a',
      icon: '☝️',
    },
    WIDE: {
      title: 'WIDE BALL',
      subtitle: 'EXTRA RUN ADDED TO TOTAL',
      bgGradient: 'linear-gradient(135deg, #047857 0%, #10b981 50%, #34d399 100%)',
      glowColor: 'rgba(16, 185, 129, 0.9)',
      accentColor: '#ffffff',
      icon: '↔️',
    },
    NO_BALL: {
      title: 'NO BALL! ⚠️',
      subtitle: 'FREE HIT ON THE NEXT BALL',
      bgGradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)',
      glowColor: 'rgba(234, 88, 12, 0.9)',
      accentColor: '#fef08a',
      icon: '🛑',
    },
    FREE_HIT: {
      title: 'FREE HIT! 🔥',
      subtitle: 'NO RISK • SWING FOR THE FENCES',
      bgGradient: 'linear-gradient(135deg, #b91c1c 0%, #e11d48 50%, #facc15 100%)',
      glowColor: 'rgba(225, 29, 72, 0.95)',
      accentColor: '#fef08a',
      icon: '💥',
    },
    FIFTY: {
      title: 'HALF CENTURY 50!',
      subtitle: 'SPLENDID FIFTY FOR THE BATTER',
      bgGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fef08a 100%)',
      glowColor: 'rgba(245, 158, 11, 0.9)',
      accentColor: '#ffffff',
      icon: '👏',
    },
    CENTURY: {
      title: 'MAGNIFICENT 100!',
      subtitle: 'TON UP! INCREDIBLE HUNDRED',
      bgGradient: 'linear-gradient(135deg, #854d0e 0%, #eab308 50%, #fef08a 100%)',
      glowColor: 'rgba(234, 179, 8, 0.95)',
      accentColor: '#ffffff',
      icon: '👑',
    },
    HAT_TRICK: {
      title: 'HAT-TRICK! 🎩',
      subtitle: '3 WICKETS IN 3 CONSECUTIVE BALLS',
      bgGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c084fc 100%)',
      glowColor: 'rgba(124, 58, 237, 0.95)',
      accentColor: '#fef08a',
      icon: '🎩',
    },
    POWERPLAY: {
      title: 'POWERPLAY 1',
      subtitle: 'FIELDING RESTRICTIONS ACTIVE',
      bgGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)',
      glowColor: 'rgba(2, 132, 199, 0.85)',
      accentColor: '#ffffff',
      icon: '⚡',
    },
    STRATEGIC_TIMEOUT: {
      title: 'STRATEGIC TIMEOUT',
      subtitle: '2 MIN 30 SEC BROADCAST BREAK',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
      glowColor: 'rgba(3, 105, 161, 0.8)',
      accentColor: '#38bdf8',
      icon: '⏱️',
    },
    DRINKS_BREAK: {
      title: 'DRINKS BREAK',
      subtitle: 'OFFICIAL PLAY REFRESHMENT BREAK',
      bgGradient: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #4ade80 100%)',
      glowColor: 'rgba(22, 163, 74, 0.8)',
      accentColor: '#ffffff',
      icon: '🥤',
    },
    END_OF_INNINGS: {
      title: 'END OF INNINGS',
      subtitle: `TARGET SET: ${(matchDetails.targetRuns || activeTeam.score + 1)} RUNS`,
      bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #a855f7 100%)',
      glowColor: 'rgba(67, 56, 202, 0.9)',
      accentColor: '#fde047',
      icon: '🎯',
    },
    MATCH_WINNER: {
      title: 'MATCH WINNER!',
      subtitle: `${activeTeam.fullName} WINS THE MATCH!`,
      bgGradient: 'linear-gradient(135deg, #854d0e 0%, #eab308 50%, #fef08a 100%)',
      glowColor: 'rgba(234, 179, 8, 0.95)',
      accentColor: '#ffffff',
      icon: '🏆',
    },
    TOUR_BOUNDARIES: {
      title: 'BOUNDARY STATS',
      subtitle: 'TOTAL 4s & 6s HIT IN MATCH',
      bgGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)',
      glowColor: 'rgba(100, 116, 139, 0.8)',
      accentColor: '#38bdf8',
      icon: '📊',
    },
  };

  const config = configMap[activeAnimation] || {
    title: `${activeAnimation}`,
    subtitle: `${activeTeam.fullName} INNINGS`,
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)',
    glowColor: 'rgba(99, 102, 241, 0.8)',
    accentColor: '#facc15',
    icon: '✨',
  };

  // Render VARIETY 1: Explosive Gold (3D Metallic Skewed IPL Card)
  if (variant === 'explosive-gold' || variant === 'neon-pulse') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-[100] overflow-hidden"
      >
        {/* Energy Rays & Shockwave */}
        <motion.div
          initial={{ scale: 0.5, rotate: 0 }}
          animate={{ scale: [1, 1.4, 1.2], rotate: 180 }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{ background: config.bgGradient }}
        />
        <motion.div
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute w-96 h-96 rounded-full border-8 border-white/80"
          style={{ boxShadow: `0 0 60px ${config.glowColor}` }}
        />

        {/* 3D Card */}
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
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg]"
          />
          <div className="flex items-center justify-center gap-3 mb-2">
            <span
              className="w-4 h-4 rounded-full border border-white/60 shadow-md"
              style={{ backgroundColor: activeTeam.primaryColor }}
            />
            <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white/90 drop-shadow">
              {activeTeam.fullName}
            </span>
          </div>

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
            {config.icon} {config.title}
          </motion.h1>

          <p
            className="text-base md:text-2xl font-black tracking-widest text-center uppercase mt-2 drop-shadow-md"
            style={{ color: config.accentColor }}
          >
            {config.subtitle}
          </p>

          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs md:text-sm text-white/80 font-bold uppercase tracking-wider">
            <span>SCORE: {activeTeam.score}/{activeTeam.wickets}</span>
            <span>OVERS: {activeTeam.overs}.{activeTeam.balls}</span>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Render VARIETY 2: Glass Fade / Minimal Pop (Frosted Glassmorphism Banner)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -50 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-[100]"
    >
      <div
        className="relative px-12 py-6 rounded-2xl border-2 border-white/40 shadow-2xl backdrop-blur-xl max-w-2xl text-center overflow-hidden"
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          boxShadow: `0 0 50px ${config.glowColor}`,
        }}
      >
        <div className="text-xs font-black tracking-widest uppercase text-amber-400 mb-1">
          {activeTeam.fullName} • LIVE EVENT
        </div>
        <h2 className="text-4xl md:text-6xl font-black italic tracking-tight text-white uppercase drop-shadow-lg">
          {config.icon} {config.title}
        </h2>
        <p className="text-sm md:text-lg font-bold tracking-wider text-slate-300 uppercase mt-1">
          {config.subtitle}
        </p>
      </div>
    </motion.div>
  );
};
