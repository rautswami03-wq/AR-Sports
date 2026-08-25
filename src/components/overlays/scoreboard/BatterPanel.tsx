import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreboardTheme } from '../../../theme/scoreboardThemes';

// ─────────────────────────────────────────────────────────────────────────────
// BatterPanel — batting statistics panel
// Shows striker (highlighted + glow) and non-striker stats
// ─────────────────────────────────────────────────────────────────────────────

interface Batter {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isStriker: boolean;
  isOut?: boolean;
}

interface BatterPanelProps {
  theme: ScoreboardTheme;
  striker?: Batter;
  nonStriker?: Batter;
  flashType?: 'four' | 'six' | 'wicket' | 'extra' | null;
  showMilestone?: boolean;
  milestonePlayer?: string;
  milestoneValue?: number;
}

function calcSR(runs: number, balls: number): string {
  if (balls === 0) return '0.00';
  return ((runs / balls) * 100).toFixed(1);
}

export const BatterPanel: React.FC<BatterPanelProps> = ({
  theme,
  striker,
  nonStriker,
  flashType,
  showMilestone,
  milestonePlayer,
  milestoneValue,
}) => {
  const isWicket = flashType === 'wicket';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 200, delay: 0.05 }}
      className="w-full overflow-hidden"
      style={{
        background: theme.bgSecondary,
        borderRadius: theme.borderRadius,
        border: `1px solid var(--sb-border-color)`,
        fontFamily: 'var(--sb-font-primary)',
      }}
    >
      {/* Header row */}
      <div
        className="flex items-center px-4 py-1.5 border-b"
        style={{ borderColor: 'var(--sb-border-color)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="flex-1 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
          BATTER
        </span>
        {['R', 'B', '4s', '6s', 'SR'].map(h => (
          <span
            key={h}
            className="text-[10px] font-black uppercase tracking-wider w-10 text-right"
            style={{ color: 'var(--sb-text-muted)' }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Striker row — breathing glow animation */}
      <AnimatePresence mode="wait">
        {striker && (
          <motion.div
            key={striker.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center px-4 py-2.5 relative overflow-hidden"
            style={{
              background: isWicket
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(255,255,255,0.04)',
              animation: !isWicket ? 'sb-breathing-glow 2s ease-in-out infinite' : undefined,
              boxShadow: !isWicket ? `inset 0 0 0 1px var(--sb-accent-primary)33` : 'inset 0 0 0 1px rgba(239,68,68,0.4)',
            }}
          >
            {/* Strike indicator */}
            <span
              className="text-xs font-black mr-2 shrink-0"
              style={{ color: 'var(--sb-accent-primary)' }}
            >
              ▶
            </span>
            <span
              className="flex-1 text-sm font-black uppercase truncate"
              style={{ color: 'var(--sb-text-primary)' }}
            >
              {striker.name}
            </span>
            <StatCell
              value={striker.runs}
              highlight
              style={{ color: 'var(--sb-text-accent)', fontSize: '16px', fontWeight: 900 }}
            />
            <StatCell value={striker.balls} />
            <StatCell value={striker.fours} />
            <StatCell value={striker.sixes} />
            <StatCell value={calcSR(striker.runs, striker.balls)} />

            {/* Milestone badge */}
            {showMilestone && milestonePlayer === striker.name && milestoneValue && (
              <MilestoneBadge value={milestoneValue} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Non-striker row */}
      <AnimatePresence mode="wait">
        {nonStriker && (
          <motion.div
            key={nonStriker.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center px-4 py-2 border-t"
            style={{ borderColor: 'var(--sb-border-color)', opacity: 0.8 }}
          >
            <span className="text-xs font-bold mr-2 opacity-0">▶</span>
            <span
              className="flex-1 text-sm font-bold uppercase truncate"
              style={{ color: 'var(--sb-text-secondary)' }}
            >
              {nonStriker.name}
            </span>
            <StatCell value={nonStriker.runs} />
            <StatCell value={nonStriker.balls} />
            <StatCell value={nonStriker.fours} />
            <StatCell value={nonStriker.sixes} />
            <StatCell value={calcSR(nonStriker.runs, nonStriker.balls)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// StatCell — right-aligned stat column cell
// ─────────────────────────────────────────────────────────────────────────────

interface StatCellProps {
  value: number | string;
  highlight?: boolean;
  style?: React.CSSProperties;
}

const StatCell: React.FC<StatCellProps> = ({ value, highlight, style }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={String(value)}
      initial={highlight ? { y: '60%', opacity: 0 } : false}
      animate={{ y: '0%', opacity: 1 }}
      exit={{ y: '-60%', opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="w-10 text-right text-sm font-bold shrink-0"
      style={{
        color: 'var(--sb-text-secondary)',
        display: 'inline-block',
        overflow: 'hidden',
        ...style,
      }}
    >
      {value}
    </motion.span>
  </AnimatePresence>
);

// ─────────────────────────────────────────────────────────────────────────────
// MilestoneBadge — flies in when batter hits 50, 100, etc.
// ─────────────────────────────────────────────────────────────────────────────

const MilestoneBadge: React.FC<{ value: number }> = ({ value }) => (
  <motion.div
    initial={{ scale: 0, rotate: -20, opacity: 0 }}
    animate={{ scale: 1, rotate: 0, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: 'spring', damping: 10, stiffness: 200 }}
    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center px-3 py-1 rounded-full font-black text-sm shadow-lg"
    style={{
      background: 'var(--sb-accent-gold, var(--sb-accent-primary))',
      color: '#000',
      zIndex: 10,
    }}
  >
    🏆 {value === 100 ? 'CENTURY!' : value === 50 ? 'FIFTY!' : `${value}!`}
  </motion.div>
);

export default BatterPanel;
