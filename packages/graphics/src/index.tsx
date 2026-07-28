import React from 'react';
import { motion } from 'framer-motion';
import { scoreBugEnter, slideInRight, slideInLeft, slideInBottom, staggerContainer, staggerItem } from '@ar-sports/animations';
import type { ScoreState, LiveBatter, LiveBowler } from '@ar-sports/types';
import { cn } from '@ar-sports/utils';

// ============================================================================
// ScoreBug — Persistent score display (bottom of screen)
// ============================================================================

interface ScoreBugProps {
  scoreState: ScoreState;
  className?: string;
}

export const ScoreBug: React.FC<ScoreBugProps> = ({ scoreState, className }) => {
  const { battingTeam, totalRuns, totalWickets, totalOvers } = scoreState;
  const striker = scoreState.currentBatters.find((b) => b.isOnStrike);
  const nonStriker = scoreState.currentBatters.find((b) => !b.isOnStrike);

  return (
    <motion.div
      variants={scoreBugEnter}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn('flex items-stretch gap-0 rounded-xl overflow-hidden shadow-overlay', className)}
      style={{ backdropFilter: 'blur(16px)' }}
    >
      {/* Team + Score section */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ background: `linear-gradient(135deg, ${battingTeam.primaryColor}cc, ${battingTeam.secondaryColor}99)` }}
      >
        <span className="text-display text-white text-lg font-bold tracking-wide">
          {battingTeam.shortName}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-white text-3xl font-extrabold font-mono">{totalRuns}</span>
          <span className="text-white/70 text-lg font-mono">/{totalWickets}</span>
        </div>
        <span className="text-white/70 text-sm font-mono">({totalOvers})</span>
      </div>

      {/* Batters section */}
      <div className="flex items-center gap-4 px-4 py-2 bg-black/60">
        {striker && <BatterDisplay batter={striker} isOnStrike />}
        <span className="text-white/30 text-xs">|</span>
        {nonStriker && <BatterDisplay batter={nonStriker} />}
      </div>

      {/* Bowler section */}
      <div className="flex items-center gap-2 px-4 py-2 bg-black/40">
        <BowlerDisplay bowler={scoreState.currentBowler} />
      </div>

      {/* Run rate / extras section */}
      <div className="flex items-center gap-3 px-4 py-2 bg-black/30">
        <div className="text-center">
          <div className="text-[10px] text-white/50 uppercase tracking-wider">CRR</div>
          <div className="text-sm font-mono font-bold text-white">{scoreState.currentRunRate}</div>
        </div>
        {scoreState.requiredRunRate !== undefined && (
          <div className="text-center">
            <div className="text-[10px] text-white/50 uppercase tracking-wider">RRR</div>
            <div className="text-sm font-mono font-bold text-amber-400">{scoreState.requiredRunRate}</div>
          </div>
        )}
        {scoreState.target && (
          <div className="text-center">
            <div className="text-[10px] text-white/50 uppercase tracking-wider">TGT</div>
            <div className="text-sm font-mono font-bold text-white">{scoreState.target}</div>
          </div>
        )}
      </div>

      {/* Last 6 balls */}
      <div className="flex items-center gap-1 px-3 py-2 bg-black/20">
        {scoreState.lastSixBalls.map((ball, i) => (
          <div
            key={i}
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
              ball.isWicket && 'bg-red-500 text-white',
              !ball.isWicket && ball.runs === 0 && 'bg-white/20 text-white/70',
              !ball.isWicket && ball.runs === 4 && 'bg-blue-500 text-white',
              !ball.isWicket && ball.runs === 6 && 'bg-purple-500 text-white',
              !ball.isWicket && ball.runs > 0 && ball.runs !== 4 && ball.runs !== 6 && 'bg-white/30 text-white',
            )}
          >
            {ball.isWicket ? 'W' : ball.runs}
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center px-3 bg-red-600">
        <span className="text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">LIVE</span>
      </div>
    </motion.div>
  );
};

// Helper components
const BatterDisplay: React.FC<{ batter: LiveBatter; isOnStrike?: boolean }> = ({ batter, isOnStrike }) => (
  <div className="flex items-center gap-2">
    <span className={cn('text-sm font-semibold', isOnStrike ? 'text-white' : 'text-white/60')}>
      {batter.name || 'Batter'}
      {isOnStrike && <span className="text-amber-400 ml-1">*</span>}
    </span>
    <span className="text-sm font-mono font-bold text-white">
      {batter.runs}<span className="text-white/40 text-xs ml-0.5">({batter.balls})</span>
    </span>
  </div>
);

const BowlerDisplay: React.FC<{ bowler: LiveBowler }> = ({ bowler }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-white/60">
      {bowler.name || 'Bowler'}
    </span>
    <span className="text-sm font-mono text-white">
      {bowler.wickets}/{bowler.runs}
    </span>
    <span className="text-xs font-mono text-white/40">({bowler.overs})</span>
  </div>
);

// ============================================================================
// OverTracker — Ball-by-ball over display
// ============================================================================

interface OverTrackerProps {
  balls: Array<{ type: string; runs: number; isWicket: boolean }>;
  overNumber: number;
  className?: string;
}

export const OverTracker: React.FC<OverTrackerProps> = ({ balls, overNumber, className }) => (
  <motion.div
    variants={slideInBottom}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('glass-panel p-4 rounded-xl', className)}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
        Over {overNumber}
      </span>
      <span className="text-xs text-white/40 font-mono">
        {balls.reduce((sum, b) => sum + b.runs, 0)} runs
      </span>
    </div>
    <div className="flex items-center gap-2">
      {balls.map((ball, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2',
            ball.isWicket && 'bg-red-500/30 border-red-500 text-red-400',
            !ball.isWicket && ball.runs === 0 && 'bg-white/10 border-white/20 text-white/60',
            !ball.isWicket && ball.runs === 4 && 'bg-blue-500/30 border-blue-500 text-blue-400',
            !ball.isWicket && ball.runs === 6 && 'bg-purple-500/30 border-purple-500 text-purple-400',
            !ball.isWicket && ball.runs > 0 && ball.runs !== 4 && ball.runs !== 6 && 'bg-white/20 border-white/30 text-white',
          )}
        >
          {ball.isWicket ? 'W' : ball.runs === 0 ? '•' : ball.runs}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ============================================================================
// FourGraphic — FOUR boundary animation (full screen overlay)
// ============================================================================

interface EventGraphicProps {
  className?: string;
}

export const FourGraphic: React.FC<EventGraphicProps> = ({ className }) => (
  <motion.div
    variants={{ 
      hidden: { scale: 0.3, opacity: 0, rotate: -10 },
      visible: { scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
      exit: { scale: 1.2, opacity: 0, transition: { duration: 0.4 } }
    }}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('flex items-center justify-center', className)}
  >
    <div className="relative">
      <div className="text-[120px] font-display font-bold text-white leading-none drop-shadow-2xl"
        style={{ textShadow: '0 0 60px rgba(37, 99, 235, 0.8), 0 0 120px rgba(37, 99, 235, 0.4)' }}>
        FOUR!
      </div>
      <motion.div
        className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-3xl"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  </motion.div>
);

// ============================================================================
// SixGraphic — SIX animation
// ============================================================================

export const SixGraphic: React.FC<EventGraphicProps> = ({ className }) => (
  <motion.div
    variants={{
      hidden: { scale: 0, opacity: 0, y: 50 },
      visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] } },
      exit: { scale: 1.5, opacity: 0, y: -50, transition: { duration: 0.5 } }
    }}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('flex items-center justify-center', className)}
  >
    <div className="relative">
      <div className="text-[140px] font-display font-bold text-white leading-none drop-shadow-2xl"
        style={{ textShadow: '0 0 80px rgba(124, 58, 237, 0.9), 0 0 160px rgba(124, 58, 237, 0.4)' }}>
        SIX!
      </div>
      <motion.div
        className="absolute inset-0 bg-purple-500/30 rounded-3xl blur-3xl"
        animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </div>
  </motion.div>
);

// ============================================================================
// WicketGraphic — WICKET animation
// ============================================================================

export const WicketGraphic: React.FC<EventGraphicProps> = ({ className }) => (
  <motion.div
    variants={{
      hidden: { scale: 0.5, opacity: 0, rotate: 5 },
      visible: { scale: 1, opacity: 1, rotate: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
      exit: { scale: 0.8, opacity: 0, rotate: -5, transition: { duration: 0.4 } }
    }}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('flex items-center justify-center', className)}
  >
    <div className="relative">
      <div className="text-[120px] font-display font-bold text-white leading-none drop-shadow-2xl"
        style={{ textShadow: '0 0 60px rgba(220, 38, 38, 0.9), 0 0 120px rgba(220, 38, 38, 0.4)' }}>
        OUT!
      </div>
      <motion.div
        className="absolute inset-0 bg-red-600/30 rounded-3xl blur-3xl"
        animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  </motion.div>
);

// ============================================================================
// WinnerGraphic — Match winner screen
// ============================================================================

interface WinnerGraphicProps {
  teamName: string;
  teamColor: string;
  margin: string;
  className?: string;
}

export const WinnerGraphic: React.FC<WinnerGraphicProps> = ({
  teamName,
  teamColor,
  margin,
  className,
}) => (
  <motion.div
    variants={{
      hidden: { scale: 0.8, opacity: 0, y: 30 },
      visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
      exit: { scale: 0.9, opacity: 0, y: -30, transition: { duration: 0.5 } }
    }}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('flex flex-col items-center justify-center gap-6', className)}
  >
    <motion.div
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      className="text-8xl"
    >
      🏆
    </motion.div>
    <div
      className="text-[80px] font-display font-bold text-white leading-none"
      style={{ textShadow: `0 0 80px ${teamColor}cc` }}
    >
      {teamName}
    </div>
    <div className="text-3xl font-display text-white/80 uppercase tracking-widest">
      WON BY {margin}
    </div>
    <motion.div
      className="h-1 w-64 rounded-full"
      style={{ background: `linear-gradient(90deg, transparent, ${teamColor}, transparent)` }}
      animate={{ scaleX: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.div>
);

// ============================================================================
// PlayerOfMatchGraphic
// ============================================================================

interface PlayerOfMatchProps {
  playerName: string;
  teamName: string;
  teamColor: string;
  stats: string;
  className?: string;
}

export const PlayerOfMatchGraphic: React.FC<PlayerOfMatchProps> = ({
  playerName,
  teamName,
  teamColor,
  stats,
  className,
}) => (
  <motion.div
    variants={slideInRight}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('glass-panel-elevated rounded-2xl p-8 max-w-lg', className)}
  >
    <div className="text-sm font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: teamColor }}>
      Player of the Match
    </div>
    <div className="text-4xl font-display font-bold text-white mb-1">{playerName}</div>
    <div className="text-lg text-white/60 mb-4">{teamName}</div>
    <div className="text-xl font-mono text-white/80">{stats}</div>
  </motion.div>
);

// ============================================================================
// TossGraphic
// ============================================================================

interface TossGraphicProps {
  winningTeam: string;
  teamColor: string;
  decision: string;
  className?: string;
}

export const TossGraphic: React.FC<TossGraphicProps> = ({
  winningTeam,
  teamColor,
  decision,
  className,
}) => (
  <motion.div
    variants={slideInRight}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('glass-panel rounded-2xl p-8 max-w-lg', className)}
  >
    <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">Toss</div>
    <div className="text-3xl font-display font-bold text-white mb-2">{winningTeam}</div>
    <div className="text-xl text-white/70">
      Won the toss and elected to <span className="font-bold" style={{ color: teamColor }}>{decision}</span>
    </div>
  </motion.div>
);

// ============================================================================
// PlayingXIGraphic
// ============================================================================

interface PlayingXIProps {
  teamName: string;
  teamColor: string;
  players: Array<{ name: string; role: string; isCaptain?: boolean; isWK?: boolean }>;
  className?: string;
}

export const PlayingXIGraphic: React.FC<PlayingXIProps> = ({
  teamName,
  teamColor,
  players,
  className,
}) => (
  <motion.div
    variants={slideInLeft}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={cn('glass-panel rounded-2xl p-6 max-w-md', className)}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-3 h-8 rounded-full" style={{ backgroundColor: teamColor }} />
      <div>
        <div className="text-sm text-white/50 uppercase tracking-wider">Playing XI</div>
        <div className="text-xl font-display font-bold text-white">{teamName}</div>
      </div>
    </div>
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      {players.map((player, i) => (
        <motion.div
          key={i}
          variants={staggerItem}
          className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30 font-mono w-5">{i + 1}.</span>
            <span className="text-sm text-white font-medium">{player.name}</span>
            {player.isCaptain && (
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">C</span>
            )}
            {player.isWK && (
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">WK</span>
            )}
          </div>
          <span className="text-xs text-white/40">{player.role}</span>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

// ============================================================================
// CountdownGraphic
// ============================================================================

interface CountdownProps {
  seconds: number;
  label?: string;
  className?: string;
}

export const CountdownGraphic: React.FC<CountdownProps> = ({ seconds, label, className }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } }}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn('flex flex-col items-center gap-2', className)}
    >
      {label && <div className="text-lg text-white/60 uppercase tracking-widest font-display">{label}</div>}
      <div className="text-[100px] font-mono font-bold text-white leading-none"
        style={{ textShadow: '0 0 40px rgba(255, 184, 0, 0.5)' }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
    </motion.div>
  );
};
