import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface EventStingProps {
  type?: 'FOUR' | 'SIX' | 'WICKET' | string;
  text?: string;
  subText?: string;
  onComplete?: () => void;
  className?: string;
}

interface StingThemeConfig {
  title: string;
  badge: string;
  subText: string;
  bgGradient: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  watermark: string;
}

const STING_THEMES: Record<string, StingThemeConfig> = {
  FOUR: {
    title: 'FOUR',
    badge: 'BOUNDARY',
    subText: 'CRUNCHED TO THE FENCE • 4 RUNS',
    bgGradient:
      'linear-gradient(90deg, #070B19 0%, #003087 25%, #00529B 50%, #0077B6 75%, #070B19 100%)',
    accentColor: '#FFDC35',
    glowColor: 'rgba(0, 119, 182, 0.85)',
    borderColor: '#00F2FE',
    watermark: 'FOUR • FOUR • FOUR • FOUR',
  },
  SIX: {
    title: 'MAXIMUM SIX',
    badge: 'SUPER MAXIMUM',
    subText: 'MASSIVE HIT INTO THE STANDS • 6 RUNS',
    bgGradient:
      'linear-gradient(90deg, #0A001F 0%, #4A0E4E 25%, #7209B7 50%, #F72585 75%, #0A001F 100%)',
    accentColor: '#FFFFFF',
    glowColor: 'rgba(247, 37, 133, 0.85)',
    borderColor: '#FFB703',
    watermark: 'SIX • SIX • SIX • SIX',
  },
  WICKET: {
    title: 'WICKET',
    badge: 'DISMISSAL',
    subText: 'BIG BREAKTHROUGH • BATTER OUT',
    bgGradient:
      'linear-gradient(90deg, #1A0000 0%, #660000 25%, #990000 50%, #D90429 75%, #1A0000 100%)',
    accentColor: '#FFDC35',
    glowColor: 'rgba(217, 4, 41, 0.9)',
    borderColor: '#FF5A00',
    watermark: 'WICKET • WICKET • WICKET • WICKET',
  },
};

export const EventSting: React.FC<EventStingProps> = ({
  type = 'FOUR',
  text,
  subText,
  onComplete,
  className = '',
}) => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const lastOutBatter = battingTeam.batters.filter((b) => b.isOut).slice(-1)[0];
  const currentBowler = bowlingTeam.bowlers.find((b) => b.isCurrent) || bowlingTeam.bowlers[0];

  const themeKey = type.toUpperCase();
  const theme = STING_THEMES[themeKey] || {
    title: type.toUpperCase(),
    badge: 'EVENT',
    subText: 'MATCH MOMENT',
    bgGradient:
      'linear-gradient(90deg, #070B19 0%, #1A237E 50%, #070B19 100%)',
    accentColor: '#FFDC35',
    glowColor: 'rgba(26, 35, 126, 0.85)',
    borderColor: '#FFB703',
    watermark: 'CRICKET • BROADCAST',
  };

  const displayTitle = text || theme.title;

  // Derive dynamic context subtext for broadcast fidelity
  let dynamicSubText = subText || theme.subText;
  if (!subText) {
    if (themeKey === 'WICKET' && lastOutBatter) {
      dynamicSubText = `${lastOutBatter.name.toUpperCase()} ${lastOutBatter.dismissal || 'OUT'} • ${battingTeam.score}/${battingTeam.wickets}`;
    } else if (themeKey === 'FOUR' && striker) {
      dynamicSubText = `${striker.name.toUpperCase()} • ${striker.runs} (${striker.balls}b) • ${battingTeam.score}/${battingTeam.wickets}`;
    } else if (themeKey === 'SIX' && striker) {
      dynamicSubText = `${striker.name.toUpperCase()} • MAXIMUM OVER THE ROPES • ${battingTeam.score}/${battingTeam.wickets}`;
    }
  }

  // Hold for exactly 3 seconds, then trigger exit & clearAnimation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
      useBroadcastStore.getState().clearAnimation();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed top-1/2 left-0 w-full -translate-y-1/2 z-[100] select-none font-sans overflow-hidden flex items-center justify-center pointer-events-none drop-shadow-2xl ${className}`}
      data-testid="event-sting"
      data-event-type={themeKey}
      style={{ fontFamily: "'Barlow Condensed', 'Roboto Condensed', sans-serif" }}
    >
      {/* ── Outer Aggressive High-Speed Motion Container ── */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-[150px] md:h-[180px] flex items-center justify-center overflow-hidden"
        style={{
          background: theme.bgGradient,
          boxShadow: `0 0 50px ${theme.glowColor}, 0 20px 60px rgba(0,0,0,0.95)`,
          borderTop: `4px solid ${theme.borderColor}`,
          borderBottom: `4px solid ${theme.borderColor}`,
        }}
      >
        {/* Subtle Diagonal Shimmer Sheen (Broadcast television laser grade) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,0.2) 35px, rgba(255,255,255,0.2) 70px)',
          }}
        />

        {/* Top Glowing Trim Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #FFFFFF 50%, transparent 100%)',
            boxShadow: `0 0 12px ${theme.borderColor}`,
          }}
        />

        {/* Bottom Glowing Trim Line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #FFFFFF 50%, transparent 100%)',
            boxShadow: `0 0 12px ${theme.borderColor}`,
          }}
        />

        {/* Low-Opacity Watermark in Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 whitespace-nowrap overflow-hidden pointer-events-none select-none">
          <span className="text-8xl md:text-9xl font-black italic tracking-[0.2em] text-white uppercase">
            {theme.watermark}
          </span>
        </div>

        {/* ── Central High-Impact Broadcast Typography ── */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          {/* Executive Pill Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="flex items-center gap-2 px-4 py-0.5 rounded-full bg-black/60 border border-white/20 text-[11px] md:text-xs font-black uppercase tracking-[0.25em] text-white mb-1 shadow-md"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: theme.accentColor,
                boxShadow: `0 0 8px ${theme.accentColor}`,
              }}
            />
            <span>{theme.badge}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">{battingTeam.shortName || 'TATA IPL'}</span>
          </motion.div>

          {/* Massive Event Title */}
          <motion.h1
            initial={{ scale: 0.75, letterSpacing: '0.04em' }}
            animate={{
              scale: [0.85, 1.04, 1],
              letterSpacing: ['0.04em', '0.12em', '0.08em'],
            }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-wider leading-none text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
            style={{
              color: theme.accentColor,
              WebkitTextStroke: '2px rgba(0, 0, 0, 0.55)',
              textShadow: `0 4px 18px rgba(0,0,0,0.9), 0 0 35px ${theme.glowColor}`,
            }}
          >
            {displayTitle}
          </motion.h1>

          {/* Context Subtitle Bar */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.28 }}
            className="text-xs md:text-base font-extrabold tracking-[0.2em] uppercase text-white/95 mt-1 bg-black/50 px-5 py-0.5 rounded border border-white/10 shadow-sm"
          >
            {dynamicSubText}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

