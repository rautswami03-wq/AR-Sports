import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreboardTheme } from '../../../theme/scoreboardThemes';

// ─────────────────────────────────────────────────────────────────────────────
// PartnershipBar — current partnership display with animated progress
// ─────────────────────────────────────────────────────────────────────────────

interface PartnershipBarProps {
  theme: ScoreboardTheme;
  runs: number;
  balls: number;
  striker?: string;
  nonStriker?: string;
  strikerContribution?: number;
  nonStrikerContribution?: number;
  teamScore?: number;
  targetRuns?: number;
}

export const PartnershipBar: React.FC<PartnershipBarProps> = ({
  theme,
  runs,
  balls,
  striker,
  nonStriker,
  strikerContribution = 0,
  nonStrikerContribution = 0,
  teamScore = 0,
  targetRuns,
}) => {
  const runRate = balls > 0 ? ((runs / balls) * 6).toFixed(1) : '0.0';

  // Progress bar width: partnership as % of total team score (or target)
  const progressDenominator = targetRuns ?? teamScore;
  const progressPct = progressDenominator > 0
    ? Math.min(100, (runs / progressDenominator) * 100)
    : 0;

  // Contribution split
  const totalContrib = strikerContribution + nonStrikerContribution;
  const strikerPct = totalContrib > 0 ? (strikerContribution / totalContrib) * 100 : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 200, delay: 0.1 }}
      className="w-full overflow-hidden"
      style={{
        background: theme.bgSecondary,
        borderRadius: theme.borderRadius,
        border: `1px solid var(--sb-border-color)`,
        fontFamily: 'var(--sb-font-primary)',
      }}
    >
      <div className="flex items-center px-4 py-2">
        {/* Label */}
        <div className="flex flex-col mr-4 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
            PARTNERSHIP
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={runs}
                initial={{ y: '50%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-50%', opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="text-xl font-black"
                style={{ color: 'var(--sb-text-accent)' }}
              >
                {runs}
              </motion.span>
            </AnimatePresence>
            <span className="text-xs font-bold opacity-60" style={{ color: 'var(--sb-text-secondary)' }}>
              ({balls})
            </span>
          </div>
        </div>

        {/* Progress bar with contribution split */}
        <div className="flex-1 flex flex-col gap-1.5">
          {/* Player names on each side */}
          <div className="flex justify-between text-[10px] font-bold uppercase" style={{ color: 'var(--sb-text-muted)' }}>
            <span>{striker || '—'}</span>
            <span>{nonStriker || '—'}</span>
          </div>

          {/* Contribution split bar */}
          <div
            className="h-4 rounded-full overflow-hidden flex"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--sb-border-color)' }}
          >
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: `${strikerPct}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="h-full flex items-center justify-end pr-1"
              style={{ background: 'var(--sb-accent-primary)' }}
            >
              {strikerPct > 15 && (
                <span className="text-[9px] font-black text-black">{strikerContribution}</span>
              )}
            </motion.div>
            <motion.div
              className="h-full flex items-center justify-start pl-1"
              style={{ background: 'var(--sb-accent-secondary)', flex: 1 }}
            >
              {(100 - strikerPct) > 15 && (
                <span className="text-[9px] font-black text-white">{nonStrikerContribution}</span>
              )}
            </motion.div>
          </div>

          {/* Overall progress bar */}
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
              style={{ background: 'var(--sb-accent-primary)' }}
            />
          </div>
        </div>

        {/* Run rate */}
        <div className="ml-4 flex flex-col items-center shrink-0">
          <span className="text-[10px] font-black uppercase opacity-50" style={{ color: 'var(--sb-text-muted)' }}>P/RR</span>
          <span className="text-sm font-black" style={{ color: 'var(--sb-text-primary)' }}>{runRate}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PartnershipBar;
