import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleSystem } from './ParticleSystem';

// ─────────────────────────────────────────────────────────────────────────────
// CelebrationOverlay — three celebration modes
// 1. ticker-takeover — handled inside ScoreTicker
// 2. page-center — full viewport overlay (this component)
// 3. batter-bar — expansion handled inside BatterPanel
// ─────────────────────────────────────────────────────────────────────────────

export type CelebrationEventType = 'four' | 'six' | 'wicket';

interface CelebrationOverlayProps {
  active: boolean;
  type?: CelebrationEventType;
  mode: 'ticker-takeover' | 'page-center' | 'batter-bar';
  batter?: string;
  milestone?: number;
  score?: number;
}

// Configs per event type
const CELEBRATION_CONFIGS = {
  four: {
    emoji: '🚀',
    label: 'FOUR!',
    sublabel: 'BOUNDARY',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
    textColor: '#000',
  },
  six: {
    emoji: '🔥',
    label: 'MAXIMUM!',
    sublabel: 'SIX',
    gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #00f5ff 100%)',
    textColor: '#fff',
  },
  wicket: {
    emoji: '⚡',
    label: 'WICKET!',
    sublabel: 'OUT',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f97316 100%)',
    textColor: '#fff',
  },
} as const;

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  active,
  type = 'four',
  mode,
  batter,
  milestone,
}) => {
  const config = CELEBRATION_CONFIGS[type];

  // ── Page Center Mode ────────────────────────────────────────────────────────
  if (mode === 'page-center') {
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.35)' }}
          >
            {/* Particle burst */}
            <div className="absolute inset-0">
              <ParticleSystem active={active} type={type} count={90} />
            </div>

            {/* Center celebration card */}
            <motion.div
              initial={{ scale: 0.3, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 180 }}
              className="relative flex flex-col items-center justify-center px-16 py-10 rounded-3xl shadow-2xl text-center z-10"
              style={{
                background: config.gradient,
                border: '4px solid rgba(255,255,255,0.3)',
                boxShadow: '0 0 80px rgba(0,0,0,0.6), 0 0 40px rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Emoji */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                className="text-7xl mb-4"
              >
                {config.emoji}
              </motion.div>

              {/* Main label */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', damping: 14 }}
                className="font-black tracking-widest uppercase"
                style={{
                  fontSize: '72px',
                  lineHeight: 1,
                  color: config.textColor,
                  textShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  fontFamily: 'var(--sb-font-primary, Inter, sans-serif)',
                }}
              >
                {config.label}
              </motion.div>

              {/* Sublabel */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="font-bold uppercase tracking-[0.4em] mt-2 text-lg"
                style={{ color: config.textColor, opacity: 0.75 }}
              >
                {config.sublabel}
              </motion.div>

              {/* Batter name */}
              {batter && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="font-black text-2xl uppercase mt-3"
                  style={{ color: config.textColor, opacity: 0.9 }}
                >
                  {batter}
                </motion.div>
              )}

              {/* Milestone badge */}
              {milestone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.45, type: 'spring', damping: 8 }}
                  className="mt-4 px-6 py-2 rounded-full font-black text-xl"
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    color: config.textColor,
                    border: '2px solid rgba(255,255,255,0.5)',
                  }}
                >
                  🏆 {milestone === 100 ? 'CENTURY!' : `${milestone}!`}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── Batter Bar Mode ─────────────────────────────────────────────────────────
  if (mode === 'batter-bar') {
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 200 }}
            className="w-full overflow-hidden"
            style={{
              background: config.gradient,
              zIndex: 20,
            }}
          >
            <div
              className="flex items-center justify-center gap-4 py-3 px-8"
              style={{ color: config.textColor }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="text-3xl"
              >
                {config.emoji}
              </motion.span>
              <div className="flex flex-col items-center">
                <span className="font-black text-3xl uppercase tracking-widest">{config.label}</span>
                {batter && (
                  <span className="font-bold text-sm uppercase opacity-80 tracking-wide">{batter}</span>
                )}
              </div>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.7, delay: 0.35 }}
                className="text-3xl"
              >
                {config.emoji}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── Ticker Takeover (handled inside ScoreTicker, this is a no-op here) ─────
  return null;
};

export default CelebrationOverlay;
