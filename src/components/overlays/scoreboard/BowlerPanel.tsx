import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreboardTheme } from '../../../theme/scoreboardThemes';

// ─────────────────────────────────────────────────────────────────────────────
// BowlerPanel — bowling statistics panel
// ─────────────────────────────────────────────────────────────────────────────

interface Bowler {
  id: string;
  name: string;
  overs: number;
  ballsInCurrentOver: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  isCurrent?: boolean;
}

interface BowlerPanelProps {
  theme: ScoreboardTheme;
  currentBowler?: Bowler;
  previousBowler?: Bowler;
  flashType?: 'four' | 'six' | 'wicket' | 'extra' | null;
}

function getEconomyColor(economy: number): string {
  if (economy <= 0) return 'var(--sb-text-muted)';
  if (economy < 7)  return '#22c55e';
  if (economy < 9)  return '#eab308';
  return '#ef4444';
}

function formatOvers(overs: number, balls: number): string {
  return `${overs}.${balls}`;
}

export const BowlerPanel: React.FC<BowlerPanelProps> = ({
  theme,
  currentBowler,
  previousBowler,
  flashType,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 200, delay: 0.08 }}
      className="w-full overflow-hidden"
      style={{
        background: theme.bgSecondary,
        borderRadius: theme.borderRadius,
        border: `1px solid var(--sb-border-color)`,
        fontFamily: 'var(--sb-font-primary)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center px-4 py-1.5 border-b"
        style={{ borderColor: 'var(--sb-border-color)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="flex-1 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
          BOWLER
        </span>
        {['O', 'M', 'R', 'W', 'ECO'].map(h => (
          <span
            key={h}
            className="text-[10px] font-black uppercase tracking-wider w-10 text-right"
            style={{ color: 'var(--sb-text-muted)' }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Current Bowler */}
      <AnimatePresence mode="wait">
        {currentBowler && (
          <motion.div
            key={currentBowler.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="flex items-center px-4 py-2.5 relative"
            style={{
              background: 'rgba(255,255,255,0.04)',
              borderLeft: `3px solid var(--sb-accent-primary)`,
            }}
          >
            <span className="flex-1 text-sm font-black uppercase truncate" style={{ color: 'var(--sb-text-primary)' }}>
              {currentBowler.name}
            </span>
            {/* Overs */}
            <span className="w-10 text-right text-sm font-bold" style={{ color: 'var(--sb-text-secondary)' }}>
              {formatOvers(currentBowler.overs, currentBowler.ballsInCurrentOver)}
            </span>
            {/* Maidens */}
            <span className="w-10 text-right text-sm font-bold" style={{ color: 'var(--sb-text-secondary)' }}>
              {currentBowler.maidens}
            </span>
            {/* Runs conceded */}
            <span className="w-10 text-right text-sm font-bold" style={{ color: 'var(--sb-text-secondary)' }}>
              {currentBowler.runsConceded}
            </span>
            {/* Wickets — highlighted */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={currentBowler.wickets}
                initial={{ y: '60%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-60%', opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="w-10 text-right text-base font-black"
                style={{
                  color: currentBowler.wickets > 0 ? 'var(--sb-accent-primary)' : 'var(--sb-text-secondary)',
                  display: 'inline-block',
                }}
              >
                {currentBowler.wickets}
              </motion.span>
            </AnimatePresence>
            {/* Economy */}
            <span
              className="w-10 text-right text-sm font-bold"
              style={{ color: getEconomyColor(currentBowler.economy) }}
            >
              {currentBowler.economy > 0
                ? ((currentBowler.runsConceded / Math.max(1, currentBowler.overs + currentBowler.ballsInCurrentOver / 6)) * 1).toFixed(1)
                : '—'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previous Bowler (faded row) */}
      {previousBowler && previousBowler.id !== currentBowler?.id && (
        <div
          className="flex items-center px-4 py-2 border-t opacity-55"
          style={{ borderColor: 'var(--sb-border-color)' }}
        >
          <span className="flex-1 text-xs font-bold uppercase truncate" style={{ color: 'var(--sb-text-secondary)' }}>
            {previousBowler.name}
          </span>
          <span className="w-10 text-right text-xs font-bold" style={{ color: 'var(--sb-text-muted)' }}>
            {formatOvers(previousBowler.overs, 0)}
          </span>
          <span className="w-10 text-right text-xs font-bold" style={{ color: 'var(--sb-text-muted)' }}>
            {previousBowler.maidens}
          </span>
          <span className="w-10 text-right text-xs font-bold" style={{ color: 'var(--sb-text-muted)' }}>
            {previousBowler.runsConceded}
          </span>
          <span className="w-10 text-right text-xs font-bold" style={{ color: previousBowler.wickets > 0 ? 'var(--sb-text-accent)' : 'var(--sb-text-muted)' }}>
            {previousBowler.wickets}
          </span>
          <span className="w-10 text-right text-xs font-bold" style={{ color: getEconomyColor(previousBowler.economy) }}>
            {previousBowler.economy.toFixed(1)}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default BowlerPanel;
