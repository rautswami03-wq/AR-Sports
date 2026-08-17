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
      glowColor: '#db2777',
      accentColor: '#fde047',
      icon: '🚀',
    },
    FOUR: {
      title: 'CRUNCHING FOUR!',
      subtitle: 'RACED TO THE BOUNDARY • 4 RUNS',
      bgGradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #38bdf8 100%)',
      glowColor: '#2563eb',
      accentColor: '#38bdf8',
      icon: '⚡',
    },
    WICKET: {
      title: 'OUT! WICKET!',
      subtitle: 'BIG BREAKTHROUGH FOR THE BOWLER',
      bgGradient: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #f97316 100%)',
      glowColor: '#dc2626',
      accentColor: '#fef08a',
      icon: '☝️',
    },
    WIDE: {
      title: 'WIDE BALL',
      subtitle: 'EXTRA RUN ADDED TO TOTAL',
      bgGradient: 'linear-gradient(135deg, #047857 0%, #10b981 50%, #34d399 100%)',
      glowColor: '#10b981',
      accentColor: '#ffffff',
      icon: '↔️',
    },
    NO_BALL: {
      title: 'NO BALL! ⚠️',
      subtitle: 'FREE HIT ON THE NEXT BALL',
      bgGradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)',
      glowColor: '#ea580c',
      accentColor: '#fef08a',
      icon: '🛑',
    },
    FREE_HIT: {
      title: 'FREE HIT! 🔥',
      subtitle: 'NO RISK • SWING FOR THE FENCES',
      bgGradient: 'linear-gradient(135deg, #b91c1c 0%, #e11d48 50%, #facc15 100%)',
      glowColor: '#e11d48',
      accentColor: '#fef08a',
      icon: '💥',
    },
    FIFTY: {
      title: 'HALF CENTURY 50!',
      subtitle: 'SPLENDID FIFTY FOR THE BATTER',
      bgGradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fef08a 100%)',
      glowColor: '#f59e0b',
      accentColor: '#ffffff',
      icon: '👏',
    },
    CENTURY: {
      title: 'MAGNIFICENT 100!',
      subtitle: 'TON UP! INCREDIBLE HUNDRED',
      bgGradient: 'linear-gradient(135deg, #854d0e 0%, #eab308 50%, #fef08a 100%)',
      glowColor: '#eab308',
      accentColor: '#ffffff',
      icon: '👑',
    },
    HAT_TRICK: {
      title: 'HAT-TRICK! 🎩',
      subtitle: '3 WICKETS IN 3 CONSECUTIVE BALLS',
      bgGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c084fc 100%)',
      glowColor: '#7c3aed',
      accentColor: '#fef08a',
      icon: '🎩',
    },
    POWERPLAY: {
      title: 'POWERPLAY 1',
      subtitle: 'FIELDING RESTRICTIONS ACTIVE',
      bgGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)',
      glowColor: '#0284c7',
      accentColor: '#ffffff',
      icon: '⚡',
    },
    STRATEGIC_TIMEOUT: {
      title: 'STRATEGIC TIMEOUT',
      subtitle: '2 MIN 30 SEC BROADCAST BREAK',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
      glowColor: '#0369a1',
      accentColor: '#38bdf8',
      icon: '⏱️',
    },
    DRINKS_BREAK: {
      title: 'DRINKS BREAK',
      subtitle: 'OFFICIAL PLAY REFRESHMENT BREAK',
      bgGradient: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #4ade80 100%)',
      glowColor: '#16a34a',
      accentColor: '#ffffff',
      icon: '🥤',
    },
    END_OF_INNINGS: {
      title: 'END OF INNINGS',
      subtitle: `TARGET SET: ${(matchDetails.targetRuns || activeTeam.score + 1)} RUNS`,
      bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #a855f7 100%)',
      glowColor: '#4338ca',
      accentColor: '#fde047',
      icon: '🎯',
    },
    MATCH_WINNER: {
      title: 'MATCH WINNER!',
      subtitle: `${activeTeam.fullName} WINS THE MATCH!`,
      bgGradient: 'linear-gradient(135deg, #854d0e 0%, #eab308 50%, #fef08a 100%)',
      glowColor: '#eab308',
      accentColor: '#ffffff',
      icon: '🏆',
    },
    TOUR_BOUNDARIES: {
      title: 'BOUNDARY STATS',
      subtitle: 'TOTAL 4s & 6s HIT IN MATCH',
      bgGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)',
      glowColor: '#64748b',
      accentColor: '#38bdf8',
      icon: '📊',
    },
  };

  const config = configMap[activeAnimation] || {
    title: `${activeAnimation}`,
    subtitle: `${activeTeam.fullName} INNINGS`,
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)',
    glowColor: '#6366f1',
    accentColor: '#facc15',
    icon: '✨',
  };

  // 60 FPS Optimized 3D Card Animation
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-[100] overflow-hidden transform-gpu"
    >
      {/* Shockwave Burst */}
      <motion.div
        initial={{ scale: 0.2, opacity: 1 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute w-96 h-96 rounded-full border-4 border-white/60 transform-gpu"
        style={{ borderColor: config.glowColor }}
      />

      {/* Main High-Performance GPU Card */}
      <motion.div
        initial={{ scale: 0.3, y: 100, skewX: -12 }}
        animate={{ scale: 1.05, y: 0, skewX: -12 }}
        exit={{ scale: 0.4, y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="relative z-20 px-10 md:px-16 py-7 rounded-3xl border-4 border-white/90 shadow-2xl overflow-hidden bg-slate-950/95 transform-gpu"
        style={{
          background: config.bgGradient,
          boxShadow: `0 15px 35px rgba(0,0,0,0.7), 0 0 30px ${config.glowColor}`,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-md inline-block"
            style={{ backgroundColor: activeTeam.primaryColor }}
          />
          <span className="text-xs md:text-sm font-black tracking-widest uppercase text-white/90">
            {activeTeam.fullName}
          </span>
        </div>

        <h1
          className="text-4xl md:text-7xl font-black italic tracking-tighter text-white uppercase text-center drop-shadow-lg"
          style={{
            textShadow: '0 4px 12px rgba(0,0,0,0.9)',
          }}
        >
          {config.icon} {config.title}
        </h1>

        <p
          className="text-sm md:text-xl font-black tracking-widest text-center uppercase mt-1.5 drop-shadow"
          style={{ color: config.accentColor }}
        >
          {config.subtitle}
        </p>

        <div className="mt-3 pt-2.5 border-t border-white/20 flex justify-between items-center text-xs md:text-sm text-white/90 font-bold uppercase tracking-wider">
          <span>SCORE: {activeTeam.score}/{activeTeam.wickets}</span>
          <span>OVERS: {activeTeam.overs}.{activeTeam.balls}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
