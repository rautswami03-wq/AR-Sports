import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreboardTheme } from '../../../theme/scoreboardThemes';

// ─────────────────────────────────────────────────────────────────────────────
// ScoreTicker — animated bottom ticker with digit roll and ball color coding
// ─────────────────────────────────────────────────────────────────────────────

interface ScoreTickerProps {
  theme: ScoreboardTheme;
  battingTeamName: string;
  bowlingTeamName: string;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  totalOvers: number;
  recentBalls: string[];
  crr: string;
  rrr?: string;
  targetRuns?: number;
  strikerName?: string;
  strikerRuns?: number;
  strikerBalls?: number;
  nonStrikerName?: string;
  nonStrikerRuns?: number;
  nonStrikerBalls?: number;
  bowlerName?: string;
  bowlerFigures?: string; // "2-24"
  customText?: string;
  flashType?: 'four' | 'six' | 'wicket' | 'extra' | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated ticker digit (slot machine for individual digits)
// ─────────────────────────────────────────────────────────────────────────────

const TickerDigit: React.FC<{ value: string }> = ({ value }) => (
  <span style={{ display: 'inline-block', overflow: 'hidden', height: '1em', lineHeight: '1em', verticalAlign: 'bottom' }}>
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280, duration: 0.28 }}
        style={{ display: 'block' }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </span>
);

const AnimatedNumber: React.FC<{ value: number | string; className?: string; style?: React.CSSProperties }> = ({
  value,
  className = '',
  style,
}) => {
  const str = String(value);
  return (
    <span className={className} style={style}>
      {str.split('').map((ch, i) => (
        <TickerDigit key={i} value={ch} />
      ))}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ball dot chip inside ticker
// ─────────────────────────────────────────────────────────────────────────────

function getTickerBallColor(ball: string): string {
  switch (ball) {
    case '6':  return 'var(--sb-ball-dot-6)';
    case '4':  return 'var(--sb-ball-dot-4)';
    case 'W':  return 'var(--sb-ball-dot-w)';
    case 'WD': return 'var(--sb-ball-dot-wd)';
    case 'NB': return 'var(--sb-ball-dot-nb)';
    case '0':  return 'var(--sb-ball-dot-0)';
    default:   return 'var(--sb-ball-dot-1)';
  }
}

const TickerBall: React.FC<{ ball: string; isNew: boolean }> = ({ ball, isNew }) => (
  <motion.span
    initial={isNew ? { x: 32, scale: 0.6, opacity: 0 } : false}
    animate={{ x: 0, scale: 1, opacity: 1 }}
    transition={{ type: 'spring', damping: 12, stiffness: 220 }}
    className="inline-flex items-center justify-center rounded-full font-black text-[9px] text-white shrink-0"
    style={{
      width: 18,
      height: 18,
      background: getTickerBallColor(ball),
      boxShadow: `0 0 4px ${getTickerBallColor(ball)}99`,
    }}
  >
    {ball === '0' ? '•' : ball.length > 2 ? ball.slice(0, 2) : ball}
  </motion.span>
);

// ─────────────────────────────────────────────────────────────────────────────
// Separator
// ─────────────────────────────────────────────────────────────────────────────

const Sep: React.FC = () => (
  <span className="opacity-25 mx-2 font-light" style={{ color: 'var(--sb-text-muted)' }}>│</span>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main ScoreTicker
// ─────────────────────────────────────────────────────────────────────────────

export const ScoreTicker: React.FC<ScoreTickerProps> = ({
  theme,
  battingTeamName,
  bowlingTeamName,
  score,
  wickets,
  overs,
  balls,
  totalOvers,
  recentBalls,
  crr,
  rrr,
  targetRuns,
  strikerName,
  strikerRuns,
  strikerBalls,
  nonStrikerName,
  nonStrikerRuns,
  nonStrikerBalls,
  bowlerName,
  bowlerFigures,
  customText,
  flashType,
}) => {
  const prevBallCount = useRef(0);
  const newBallsCount = recentBalls.length - prevBallCount.current;
  prevBallCount.current = recentBalls.length;

  // Flash state for ticker background
  const flashBg = flashType === 'wicket'
    ? 'var(--sb-flash-wicket)'
    : flashType === 'six'
    ? 'var(--sb-flash-six)'
    : flashType === 'four'
    ? 'var(--sb-flash-four)'
    : flashType === 'extra'
    ? 'var(--sb-flash-extra)'
    : undefined;

  const flashLabel = flashType === 'wicket'
    ? '⚡ WICKET!'
    : flashType === 'six'
    ? '🔥 MAXIMUM SIX!'
    : flashType === 'four'
    ? '🚀 FOUR!'
    : flashType === 'extra'
    ? 'EXTRA'
    : null;

  return (
    <div
      className="relative w-full flex items-center overflow-hidden"
      style={{
        height: '36px',
        background: 'var(--sb-bg-ticker)',
        borderTop: `1px solid var(--sb-border-color)`,
        fontFamily: 'var(--sb-font-primary)',
      }}
    >
      {/* Flash banner — slides over ticker */}
      <AnimatePresence>
        {flashType && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="absolute inset-0 flex items-center justify-center font-black text-base uppercase tracking-widest z-10"
            style={{
              background: flashBg,
              color: flashType === 'six' ? '#000' : '#fff',
              letterSpacing: '0.15em',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
            >
              {flashLabel}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Normal ticker content */}
      <div className="flex items-center gap-0 w-full px-3 text-xs font-bold" style={{ color: 'var(--sb-text-primary)' }}>

        {/* Team name + score */}
        <span className="font-black uppercase mr-2 shrink-0" style={{ color: 'var(--sb-accent-primary)' }}>
          {battingTeamName.length > 12 ? battingTeamName.substring(0, 12) : battingTeamName}
        </span>
        <AnimatedNumber
          value={score}
          className="font-black text-sm"
          style={{ color: 'var(--sb-text-accent)' }}
        />
        <span className="font-black text-sm mx-0.5" style={{ color: 'var(--sb-text-muted)' }}>/</span>
        <AnimatedNumber
          value={wickets}
          className="font-black text-sm"
          style={{ color: 'var(--sb-text-accent)' }}
        />

        <Sep />

        {/* Overs */}
        <span className="opacity-70 shrink-0">
          {overs}.{balls}/{totalOvers}
        </span>

        <Sep />

        {/* CRR / RRR */}
        <span className="shrink-0">CRR <span style={{ color: 'var(--sb-accent-primary)' }}>{crr}</span></span>
        {rrr && targetRuns && (
          <>
            <span className="mx-1 opacity-30">·</span>
            <span className="shrink-0">RRR <span style={{ color: '#f87171' }}>{rrr}</span></span>
          </>
        )}

        {targetRuns && (
          <>
            <Sep />
            <span className="shrink-0 font-black" style={{ color: 'var(--sb-flash-four)' }}>
              TGT {targetRuns}
            </span>
          </>
        )}

        <Sep />

        {/* Striker */}
        {strikerName && (
          <span className="shrink-0">
            <span style={{ color: 'var(--sb-accent-primary)' }}>▶ </span>
            {strikerName} <span className="font-black">{strikerRuns}*</span>
            <span className="opacity-60"> ({strikerBalls})</span>
          </span>
        )}

        {nonStrikerName && (
          <>
            <span className="mx-1 opacity-30">·</span>
            <span className="shrink-0 opacity-75">
              {nonStrikerName} {nonStrikerRuns} ({nonStrikerBalls})
            </span>
          </>
        )}

        <Sep />

        {/* Bowler */}
        {bowlerName && (
          <span className="shrink-0 opacity-80">
            {bowlerName}
            {bowlerFigures && <span className="font-black ml-1">{bowlerFigures}</span>}
          </span>
        )}

        <Sep />

        {/* Recent balls */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] uppercase tracking-wider opacity-50 mr-1">THIS OVER</span>
          {recentBalls.slice(-6).map((ball, i, arr) => (
            <TickerBall
              key={`${ball}-${i}-${recentBalls.length}`}
              ball={ball}
              isNew={i === arr.length - 1 && newBallsCount > 0}
            />
          ))}
        </div>

        {/* Custom text (scrolling if long) */}
        {customText && (
          <>
            <Sep />
            <span
              className="font-black uppercase tracking-wide shrink-0"
              style={{ color: 'var(--sb-accent-primary)' }}
            >
              {customText}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ScoreTicker;
