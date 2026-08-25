import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScoreboardTheme } from '../../../theme/scoreboardThemes';
import { injectGlobalKeyframes } from './AnimationEngine';

// ─────────────────────────────────────────────────────────────────────────────
// Ball Chip — single colored ball dot
// ─────────────────────────────────────────────────────────────────────────────

interface BallChipProps {
  ball: string;
  isNew?: boolean;
}

function getBallStyle(ball: string): { bg: string; label: string } {
  switch (ball) {
    case '6':  return { bg: 'var(--sb-ball-dot-6)', label: '6' };
    case '4':  return { bg: 'var(--sb-ball-dot-4)', label: '4' };
    case 'W':  return { bg: 'var(--sb-ball-dot-w)', label: 'W' };
    case 'WD': return { bg: 'var(--sb-ball-dot-wd)', label: 'Wd' };
    case 'NB': return { bg: 'var(--sb-ball-dot-nb)', label: 'Nb' };
    case '0':  return { bg: 'var(--sb-ball-dot-0)', label: '•' };
    default:   return { bg: 'var(--sb-ball-dot-1)', label: ball };
  }
}

const BallChip: React.FC<BallChipProps> = ({ ball, isNew = false }) => {
  const { bg, label } = getBallStyle(ball);

  return (
    <motion.span
      initial={isNew ? { x: 40, scale: 0.6, opacity: 0 } : false}
      animate={{ x: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
      style={{ background: bg, boxShadow: `0 0 6px ${bg}55` }}
    >
      {label}
    </motion.span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Slot Machine Score Digit
// ─────────────────────────────────────────────────────────────────────────────

interface SlotDigitProps {
  value: string;
  className?: string;
}

const SlotDigit: React.FC<SlotDigitProps> = ({ value, className = '' }) => {
  return (
    <span
      className={`sb-slot-digit inline-block overflow-hidden leading-none relative ${className}`}
      style={{ display: 'inline-block' }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260, duration: 0.3 }}
          style={{ display: 'block', lineHeight: 'inherit' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Animated Score — wraps each character in SlotDigit
// ─────────────────────────────────────────────────────────────────────────────

interface AnimatedScoreProps {
  score: number;
  wickets: number;
  className?: string;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({ score, wickets, className = '' }) => {
  const scoreStr = String(score);
  const wicketsStr = String(wickets);

  return (
    <span className={`flex items-center ${className}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {scoreStr.split('').map((ch, i) => (
        <SlotDigit key={`s-${i}`} value={ch} />
      ))}
      <span className="opacity-70 mx-0.5">/</span>
      {wicketsStr.split('').map((ch, i) => (
        <SlotDigit key={`w-${i}`} value={ch} />
      ))}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hundred Balls Counter — The Hundred layout specific
// ─────────────────────────────────────────────────────────────────────────────

interface HundredBallsProps {
  ballsBowled: number;
  maxBalls?: number;
}

const HundredBalls: React.FC<HundredBallsProps> = ({ ballsBowled, maxBalls = 100 }) => {
  const remaining = Math.max(0, maxBalls - ballsBowled);

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <motion.span
        key={remaining}
        initial={{ scale: 1.4, color: 'var(--sb-accent-primary)' }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
        className="font-black text-3xl leading-none"
        
      >
        {remaining}
      </motion.span>
      <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-0.5">
        BALLS LEFT
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ScoreStrip — main horizontal score bar component
// ─────────────────────────────────────────────────────────────────────────────

interface ScoreStripProps {
  theme: ScoreboardTheme;
  battingTeamName: string;
  battingTeamShort: string;
  battingTeamLogo?: string;
  battingTeamColor?: string;
  bowlingTeamName: string;
  bowlingTeamShort: string;
  bowlingTeamLogo?: string;
  bowlingTeamColor?: string;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  totalOvers: number;
  crr: string;
  rrr?: string;
  targetRuns?: number;
  recentBalls: string[];
  partnershipRuns?: number;
  partnershipBalls?: number;
  strikerName?: string;
  nonStrikerName?: string;
  strikerRuns?: number;
  strikerBalls?: number;
  nonStrikerRuns?: number;
  nonStrikerBalls?: number;
  flashType?: 'four' | 'six' | 'wicket' | 'extra' | null;
}

export const ScoreStrip: React.FC<ScoreStripProps> = ({
  theme,
  battingTeamName,
  battingTeamShort,
  battingTeamLogo,
  battingTeamColor,
  bowlingTeamName,
  bowlingTeamShort,
  bowlingTeamLogo,
  bowlingTeamColor,
  score,
  wickets,
  overs,
  balls,
  totalOvers,
  crr,
  rrr,
  targetRuns,
  recentBalls,
  partnershipRuns,
  partnershipBalls,
  strikerName,
  nonStrikerName,
  strikerRuns,
  strikerBalls,
  nonStrikerRuns,
  nonStrikerBalls,
  flashType,
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const oversFormatted = `${overs}.${balls}`;
  const prevBallsRef = useRef<string[]>([]);

  useEffect(() => {
    injectGlobalKeyframes();
  }, []);

  // Track which ball is new for chip animation
  const prevBalls = prevBallsRef.current;
  const newBallCount = recentBalls.length - prevBalls.length;
  prevBallsRef.current = recentBalls;

  // Flash animation CSS
  const flashClass = flashType
    ? `data-[data-flash=${flashType}]:animate-pulse`
    : '';

  const isHundred = theme.layoutVariant === 'hundred';
  const isPill = theme.layoutVariant === 'pill';

  // ── PILL LAYOUT ────────────────────────────────────────────────────────────
  if (isPill) {
    return (
      <motion.div
        ref={stripRef}
        data-flash={flashType ?? undefined}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="relative flex items-center gap-0 overflow-hidden"
        style={{
          borderRadius: theme.borderRadius,
          height: theme.stripHeight,
          background: theme.bgPrimary,
          border: `1.5px solid var(--sb-border-color)`,
          boxShadow: `var(--sb-glow-strength) var(--sb-glow-color)`,
          backdropFilter: theme.backdropBlur ? `blur(${theme.backdropBlur})` : undefined,
          WebkitBackdropFilter: theme.backdropBlur ? `blur(${theme.backdropBlur})` : undefined,
          fontFamily: 'var(--sb-font-primary)',
        }}
      >
        {/* Team A badge */}
        <TeamBadge
          name={battingTeamShort}
          logo={battingTeamLogo}
          color={battingTeamColor}
          theme={theme}
          side="left"
        />

        {/* Center score */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <AnimatedScore
            score={score}
            wickets={wickets}
            className="font-black text-3xl"
            
          />
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-bold opacity-70">{oversFormatted}/{totalOvers} OVERS</span>
            {targetRuns && (
              <span className="text-[11px] font-bold" style={{ color: 'var(--sb-accent-primary)' }}>
                RRR: {rrr}
              </span>
            )}
          </div>
        </div>

        {/* Team B badge */}
        <TeamBadge
          name={bowlingTeamShort}
          logo={bowlingTeamLogo}
          color={bowlingTeamColor}
          theme={theme}
          side="right"
        />

        {/* Flash overlay */}
        <FlashOverlay flashType={flashType} />
      </motion.div>
    );
  }

  // ── HUNDRED LAYOUT ─────────────────────────────────────────────────────────
  if (isHundred) {
    const totalBalls = overs * 6 + balls;

    return (
      <motion.div
        ref={stripRef}
        data-flash={flashType ?? undefined}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="relative flex items-stretch overflow-hidden w-full"
        style={{
          height: theme.stripHeight,
          background: 'var(--sb-bg-primary)',
          fontFamily: 'var(--sb-font-primary)',
        }}
      >
        {/* Left: batting team */}
        <div className="flex items-center px-5 min-w-[160px]" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <span className="font-black text-xl uppercase tracking-tight" style={{ color: 'var(--sb-text-primary)' }}>
            {battingTeamShort}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center justify-center px-6 min-w-[140px]"
          style={{ background: 'var(--sb-bg-accent)', color: 'var(--sb-text-accent)' }}
        >
          <AnimatedScore score={score} wickets={wickets} className="font-black text-3xl" />
        </div>

        {/* Balls remaining */}
        <HundredBalls ballsBowled={totalBalls} />

        {/* Recent balls */}
        <div className="flex-1 flex items-center gap-1 px-4">
          {recentBalls.slice(-5).map((b, i) => (
            <BallChip key={i} ball={b} isNew={i >= recentBalls.length - 5 - newBallCount} />
          ))}
        </div>

        {/* Right: bowling team */}
        <div className="flex items-center px-5 min-w-[140px]" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <span className="font-black text-lg uppercase" style={{ color: 'var(--sb-text-secondary)' }}>
            {bowlingTeamShort}
          </span>
        </div>

        <FlashOverlay flashType={flashType} />
      </motion.div>
    );
  }

  // ── STANDARD LAYOUT (default for most themes) ──────────────────────────────
  return (
    <motion.div
      ref={stripRef}
      data-flash={flashType ?? undefined}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 200 }}
      className="relative flex items-stretch overflow-hidden w-full"
      style={{
        borderRadius: theme.borderRadius,
        minHeight: theme.stripHeight,
        background: theme.bgPrimary,
        border: `1.5px solid var(--sb-border-color)`,
        boxShadow: `0 4px 32px rgba(0,0,0,0.5), var(--sb-glow-strength) var(--sb-glow-color)`,
        fontFamily: 'var(--sb-font-primary)',
      }}
    >
      {/* Left Team Badge */}
      <TeamBadge
        name={battingTeamShort}
        fullName={battingTeamName}
        logo={battingTeamLogo}
        color={battingTeamColor}
        theme={theme}
        side="left"
        label="BATTING"
      />

      {/* Score Box */}
      <div
        className="flex flex-col items-center justify-center px-5 shrink-0 min-w-[150px]"
        style={{ background: 'var(--sb-bg-accent)' }}
      >
        <AnimatedScore
          score={score}
          wickets={wickets}
          className="font-black text-3xl leading-none"
          
        />
        <div className="text-[11px] font-bold mt-1 opacity-80" >
          {targetRuns ? `TGT ${targetRuns}` : `${oversFormatted} OVS`}
        </div>
      </div>

      {/* Center Info: CRR / RRR / Partnership */}
      <div
        className="flex flex-col items-center justify-center px-4 min-w-[120px] shrink-0 border-r"
        style={{ borderColor: 'var(--sb-border-color)', background: 'var(--sb-bg-secondary)' }}
      >
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase opacity-50" style={{ color: 'var(--sb-text-secondary)' }}>CRR</span>
            <span className="text-sm font-black" style={{ color: 'var(--sb-text-primary)' }}>{crr}</span>
          </div>
          {rrr && targetRuns && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase opacity-50" style={{ color: 'var(--sb-text-secondary)' }}>RRR</span>
              <span className="text-sm font-black" style={{ color: 'var(--sb-accent-primary)' }}>{rrr}</span>
            </div>
          )}
        </div>
        {partnershipRuns !== undefined && (
          <div className="text-[10px] font-bold opacity-60 mt-1" style={{ color: 'var(--sb-text-muted)' }}>
            P: {partnershipRuns}({partnershipBalls})
          </div>
        )}
      </div>

      {/* Batters Quick View */}
      <div className="flex-1 flex flex-col justify-center px-4 min-w-[200px]"
        style={{ background: 'var(--sb-bg-secondary)' }}
      >
        {strikerName && (
          <motion.div
            key={`striker-${strikerName}`}
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between text-sm font-bold mb-0.5"
          >
            <span className="flex items-center gap-1.5 uppercase truncate font-black" style={{ color: 'var(--sb-text-primary)' }}>
              <span style={{ color: 'var(--sb-accent-primary)' }}>▶</span>
              {strikerName}
            </span>
            <span className="font-black ml-2" >
              {strikerRuns}
              <span className="text-xs font-medium opacity-60 ml-1">({strikerBalls})</span>
            </span>
          </motion.div>
        )}
        {nonStrikerName && (
          <div className="flex items-center justify-between text-xs font-bold opacity-70 pl-4"
            style={{ color: 'var(--sb-text-secondary)' }}
          >
            <span className="uppercase truncate">{nonStrikerName}</span>
            <span className="ml-2">{nonStrikerRuns} ({nonStrikerBalls})</span>
          </div>
        )}
      </div>

      {/* Over Ball Chips */}
      <div
        className="flex items-center gap-1 px-4 shrink-0 border-l"
        style={{ borderColor: 'var(--sb-border-color)', background: 'var(--sb-bg-secondary)' }}
      >
        <AnimatePresence>
          {recentBalls.slice(-6).map((ball, i) => (
            <BallChip
              key={`${ball}-${i}-${recentBalls.length}`}
              ball={ball}
              isNew={i === recentBalls.slice(-6).length - 1 && newBallCount > 0}
            />
          ))}
        </AnimatePresence>
        {/* Empty placeholders */}
        {Array.from({ length: Math.max(0, 6 - recentBalls.slice(-6).length) }).map((_, i) => (
          <span
            key={`empty-${i}`}
            className="w-6 h-6 rounded-full border shrink-0"
            style={{ borderColor: 'var(--sb-border-color)' }}
          />
        ))}
      </div>

      {/* Right Team Badge */}
      <TeamBadge
        name={bowlingTeamShort}
        fullName={bowlingTeamName}
        logo={bowlingTeamLogo}
        color={bowlingTeamColor}
        theme={theme}
        side="right"
        label="BOWLING"
      />

      {/* Flash overlay */}
      <FlashOverlay flashType={flashType} />
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TeamBadge — left/right team identity badge
// ─────────────────────────────────────────────────────────────────────────────

interface TeamBadgeProps {
  name: string;
  fullName?: string;
  logo?: string;
  color?: string;
  theme: ScoreboardTheme;
  side: 'left' | 'right';
  label?: string;
}

const TeamBadge: React.FC<TeamBadgeProps> = ({ name, fullName, logo, color, theme, side, label }) => {
  const bg = color ?? 'var(--sb-bg-accent)';

  return (
    <div
      className={`flex flex-col items-center justify-center px-4 shrink-0 min-w-[130px] ${
        theme.teamBadgeStyle === 'angled' ? (side === 'left' ? '-skew-x-6' : 'skew-x-6') : ''
      }`}
      style={{ background: bg, color: 'var(--sb-text-accent)' }}
    >
      {logo ? (
        <img src={logo} alt={name} className="w-8 h-8 object-contain mb-1" />
      ) : null}
      <span
        className={`font-black uppercase leading-tight text-center ${
          theme.teamBadgeStyle === 'angled'
            ? side === 'left' ? 'skew-x-6' : '-skew-x-6'
            : ''
        }`}
        style={{
          fontSize: name.length > 5 ? '14px' : '18px',
          letterSpacing: '0.05em',
        }}
      >
        {name}
      </span>
      {label && (
        <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-0.5">{label}</span>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FlashOverlay — pulsing color tint during events
// ─────────────────────────────────────────────────────────────────────────────

const FLASH_STYLES: Record<string, React.CSSProperties> = {
  four:   { backgroundColor: 'var(--sb-flash-four)',   opacity: 0.18, animation: 'sb-pulse-four 0.56s ease-in-out 2' },
  six:    { backgroundColor: 'var(--sb-flash-six)',    opacity: 0.2,  animation: 'sb-pulse-six 0.52s ease-in-out 3' },
  wicket: { backgroundColor: 'var(--sb-flash-wicket)', opacity: 0.25, animation: 'sb-pulse-wicket 0.4s ease-in-out 4' },
  extra:  { backgroundColor: 'var(--sb-flash-extra)',  opacity: 0.15, animation: 'sb-pulse-extra 0.8s ease-in-out 1' },
};

const FlashOverlay: React.FC<{ flashType?: 'four' | 'six' | 'wicket' | 'extra' | null }> = ({ flashType }) => {
  if (!flashType) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={flashType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={FLASH_STYLES[flashType]}
      />
    </AnimatePresence>
  );
};

// Re-export AnimatedScore for use in other panels
export { AnimatedScore, BallChip, SlotDigit };
