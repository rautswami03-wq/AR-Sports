import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { AsiaCupLeftCyanWings, AsiaCupRightYellowWings } from '../theme-graphics/AsiaCupGraphics';

import { hexToRgba, getContrastTextColor } from '../../theme/presetThemes';

export interface BatterLowerThirdData {
  name?: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  dots?: number;
  strikeRate?: string | number;
  team?: string;
  teamColor?: string;
  isOut?: boolean;
  dismissal?: string;
}

export interface BowlerLowerThirdData {
  name?: string;
  dots?: number;
  overs?: string | number;
  runs?: number;
  wickets?: number;
  economy?: string | number;
  team?: string;
  teamColor?: string;
}

export interface PartnershipLowerThirdData {
  batter1Name?: string;
  batter1Runs?: number;
  batter1Balls?: number;
  partnershipRuns?: number;
  partnershipBalls?: number;
  batter2Name?: string;
  batter2Runs?: number;
  batter2Balls?: number;
}

export interface TargetLowerThirdData {
  needRuns?: number;
  fromBalls?: number;
  teamA?: string;
  teamB?: string;
  teamAColor?: string;
  teamBColor?: string;
}

export interface LowerThirdProps {
  type: 'batter' | 'bowler' | 'partnership' | 'target';
  data?: BatterLowerThirdData | BowlerLowerThirdData | PartnershipLowerThirdData | TargetLowerThirdData;
}

const slideAnimation = {
  initial: { opacity: 0, y: 80 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 80 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const LowerThird: React.FC<LowerThirdProps> = ({ type, data }) => {
  const store = useBroadcastStore();
  const { teamA, teamB, battingTeamId, matchDetails } = store;

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. BATTER LOWER THIRD (IPL 2025 Kite Shard Framing)
  // ─────────────────────────────────────────────────────────────────────────────
  if (type === 'batter') {
    const d = (data as BatterLowerThirdData) || {};
    const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];

    const name = d.name ?? striker?.name ?? 'BATTER';
    const runs = d.runs ?? striker?.runs ?? 0;
    const balls = d.balls ?? striker?.balls ?? 0;
    const fours = d.fours ?? striker?.fours ?? 0;
    const sixes = d.sixes ?? striker?.sixes ?? 0;
    const dots = d.dots ?? Math.max(0, balls - (fours + sixes));
    const strikeRate = d.strikeRate ?? (balls > 0 ? ((runs / balls) * 100).toFixed(2) : '0.00');
    const team = d.team ?? (battingTeam.fullName || battingTeam.shortName || 'BAT');
    const isOut = d.isOut ?? striker?.isOut ?? false;
    const dismissal = d.dismissal ?? striker?.dismissal;

    const primaryColor = d.teamColor || battingTeam.primaryColor || '#00529B';
    const secondaryColor = battingTeam.secondaryColor || '#FFDC35';
    const contrastText = getContrastTextColor(primaryColor);

    return (
      <motion.div
        {...slideAnimation}
        className="fixed bottom-8 left-6 right-6 lg:left-12 lg:right-12 z-40 flex items-center justify-center font-sans animate-slide-in-bottom select-none"
        data-overlay="lower-third-batter"
      >
        <div
          className="flex items-stretch max-w-6xl w-full h-24 filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {/* Left Shard (Primary color kite): Name & Striker indicator */}
          <div
            className="relative z-20 flex-shrink-0 flex items-center pl-7 pr-12 h-full overflow-hidden"
            style={{
              clipPath: 'polygon(0% 0%, calc(100% - 28px) 0%, 100% 50%, calc(100% - 28px) 100%, 0% 100%, 14px 50%)',
              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.94)} 0%, ${hexToRgba(primaryColor, 0.82)} 65%, rgba(8, 14, 32, 0.92) 100%)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              minWidth: '340px',
            }}
          >
            {/* Top edge glowing accent */}
            <div
              className="absolute top-0 left-3 right-7 h-[2px] pointer-events-none opacity-80"
              style={{ background: 'linear-gradient(90deg, #00F2FE 0%, #FFDC35 60%, transparent 100%)' }}
            />

            <div className="flex flex-col justify-center gap-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider font-headers border border-white/20 shadow-sm"
                  style={{ background: 'rgba(0, 0, 0, 0.4)', color: '#FFFFFF' }}
                >
                  {team}
                </span>
                {!isOut && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest bg-black/45 text-cyan-300 border border-cyan-400/50 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00F2FE]" />
                    STRIKER
                  </span>
                )}
              </div>

              <h2
                className="font-black text-2xl lg:text-3xl uppercase tracking-wide leading-none font-headers drop-shadow-md"
                style={{ color: contrastText === '#000000' ? '#FFFFFF' : contrastText }}
              >
                {name}
              </h2>

              {isOut && dismissal ? (
                <div className="text-rose-400 font-bold text-xs uppercase tracking-wider font-sans leading-none">
                  {dismissal}
                </div>
              ) : null}
            </div>

            {/* Glowing Accent Chevron Line at right edge */}
            <svg
              className="absolute right-0 top-0 bottom-0 h-full w-7 z-30 pointer-events-none overflow-visible"
              viewBox="0 0 28 100"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,0 28,50 0,100"
                fill="none"
                stroke="#00F2FE"
                strokeWidth="4"
                style={{ filter: 'drop-shadow(0 0 8px #00F2FE) drop-shadow(0 0 3px #FFDC35)' }}
              />
            </svg>
          </div>

          {/* Bold Cyan / Team Secondary Accent Line between shards */}
          <div
            className="w-[3px] -ml-[3px] z-30 self-stretch my-1 rounded-full pointer-events-none shadow-[0_0_12px_#00F2FE]"
            style={{
              background: `linear-gradient(180deg, #00F2FE 0%, ${secondaryColor} 50%, #00F2FE 100%)`,
            }}
          />

          {/* Right Shard (Darker shade / translucent black kite): Runs (Balls), 4s, 6s, SR */}
          <div
            className="relative z-10 flex-1 -ml-6 flex items-center justify-between pl-12 pr-8 h-full"
            style={{
              clipPath: 'polygon(28px 0%, 100% 0%, calc(100% - 16px) 50%, 100% 100%, 0% 100%, 28px 50%)',
              background: 'linear-gradient(135deg, rgba(8, 14, 32, 0.90) 0%, rgba(15, 23, 42, 0.85) 60%, rgba(10, 16, 36, 0.92) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Top edge subtle glow */}
            <div
              className="absolute top-0 left-7 right-4 h-[1px] pointer-events-none opacity-60"
              style={{ background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.8) 0%, transparent 80%)' }}
            />

            {/* Runs & Balls */}
            <div className="flex items-baseline gap-1.5 pr-8 border-r border-white/10 font-numbers">
              <span className="text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-md">
                {runs}
              </span>
              <span className="text-lg lg:text-xl font-bold text-slate-400">
                ({balls})
              </span>
            </div>

            {/* Stats: Fours, Sixes, Dots, Strike Rate */}
            <div className="flex-1 flex items-center justify-around px-4 font-numbers">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 tracking-widest font-headers font-bold uppercase">FOURS</span>
                <span className="text-lg lg:text-xl font-black text-amber-400">{fours}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 tracking-widest font-headers font-bold uppercase">SIXES</span>
                <span className="text-lg lg:text-xl font-black text-purple-400">{sixes}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 tracking-widest font-headers font-bold uppercase">DOTS</span>
                <span className="text-lg lg:text-xl font-black text-slate-300">{dots}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-cyan-400 tracking-widest font-headers font-bold uppercase">STRIKE RATE</span>
                <span className="text-lg lg:text-xl font-black text-cyan-300">{strikeRate}</span>
              </div>
            </div>

            {/* Fall of Wicket if out */}
            {isOut && (
              <div className="pl-6 border-l border-white/10 flex flex-col justify-center text-right font-numbers">
                <span className="text-[9px] text-rose-400 tracking-widest font-headers uppercase font-bold">
                  FALL OF WICKET
                </span>
                <span className="text-xl lg:text-2xl font-black text-white">
                  {battingTeam.score} - {battingTeam.wickets}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. BOWLER LOWER THIRD (IPL 2025 Reversed Shard Framing)
  // ─────────────────────────────────────────────────────────────────────────────
  if (type === 'bowler') {
    const d = (data as BowlerLowerThirdData) || {};
    const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

    const name = d.name ?? currentBowler?.name ?? 'BOWLER';
    const overs = d.overs ?? `${currentBowler?.overs ?? 0}.${currentBowler?.ballsInCurrentOver ?? 0}`;
    const runs = d.runs ?? currentBowler?.runsConceded ?? 0;
    const wickets = d.wickets ?? currentBowler?.wickets ?? 0;
    const maidens = currentBowler?.maidens ?? 0;
    const totalBalls = (currentBowler?.overs ?? 0) * 6 + (currentBowler?.ballsInCurrentOver ?? 0);
    const dots = d.dots ?? Math.max(0, totalBalls - Math.floor(runs / 2));
    const economy = d.economy ?? (totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00');
    const team = d.team ?? (bowlingTeam.fullName || bowlingTeam.shortName || 'BOWL');

    const primaryColor = d.teamColor || bowlingTeam.primaryColor || '#FFD700';
    const secondaryColor = bowlingTeam.secondaryColor || '#00F2FE';
    const contrastText = getContrastTextColor(primaryColor);

    return (
      <motion.div
        {...slideAnimation}
        className="fixed bottom-8 left-6 right-6 lg:left-12 lg:right-12 z-40 flex items-center justify-center font-sans animate-slide-in-bottom select-none"
        data-overlay="lower-third-bowler"
      >
        <div
          className="flex items-stretch max-w-6xl w-full h-24 filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {/* Left Shard (Bowling team primary color): Bowler's Name */}
          <div
            className="relative z-20 flex-shrink-0 flex items-center pl-7 pr-12 h-full overflow-hidden"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, calc(100% - 28px) 50%, 100% 100%, 0% 100%, 14px 50%)',
              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.94)} 0%, ${hexToRgba(primaryColor, 0.82)} 65%, rgba(8, 14, 32, 0.92) 100%)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              minWidth: '340px',
            }}
          >
            {/* Top edge glowing accent */}
            <div
              className="absolute top-0 left-3 right-7 h-[2px] pointer-events-none opacity-80"
              style={{ background: 'linear-gradient(90deg, #FFDC35 0%, #00F2FE 60%, transparent 100%)' }}
            />

            <div className="flex flex-col justify-center gap-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider font-headers border border-white/20 shadow-sm"
                  style={{ background: 'rgba(0, 0, 0, 0.4)', color: '#FFFFFF' }}
                >
                  {team}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest bg-black/45 text-amber-300 border border-amber-400/50 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#FFDC35]" />
                  BOWLER
                </span>
              </div>

              <h2
                className="font-black text-2xl lg:text-3xl uppercase tracking-wide leading-none font-headers drop-shadow-md"
                style={{ color: contrastText === '#000000' ? '#FFFFFF' : contrastText }}
              >
                {name}
              </h2>
            </div>

            {/* Glowing Accent Chevron Line at right edge (Reversed inward chevron) */}
            <svg
              className="absolute right-0 top-0 bottom-0 h-full w-7 z-30 pointer-events-none overflow-visible"
              viewBox="0 0 28 100"
              preserveAspectRatio="none"
            >
              <polyline
                points="28,0 0,50 28,100"
                fill="none"
                stroke="#00F2FE"
                strokeWidth="4"
                style={{ filter: 'drop-shadow(0 0 8px #00F2FE) drop-shadow(0 0 3px #FFDC35)' }}
              />
            </svg>
          </div>

          {/* Bold Cyan / Gold Accent Line between shards */}
          <div
            className="w-[3px] -ml-[3px] z-30 self-stretch my-1 rounded-full pointer-events-none shadow-[0_0_12px_#00F2FE]"
            style={{
              background: `linear-gradient(180deg, #00F2FE 0%, ${secondaryColor || '#FFDC35'} 50%, #00F2FE 100%)`,
            }}
          />

          {/* Right Shard (Bowling team tinted background): Figures (O-M-R-W), Economy, Dots */}
          <div
            className="relative z-10 flex-1 -ml-6 flex items-center justify-around pl-12 pr-8 h-full"
            style={{
              clipPath: 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 28px 50%)',
              background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.38)} 0%, rgba(8, 14, 32, 0.90) 50%, rgba(15, 23, 42, 0.86) 100%)`,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Top edge subtle glow */}
            <div
              className="absolute top-0 left-7 right-4 h-[1px] pointer-events-none opacity-60"
              style={{ background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.8) 0%, transparent 80%)' }}
            />

            {/* Figures: Dots, Overs, Maidens, Runs, Wickets, Economy */}
            <div className="flex flex-col items-center font-numbers">
              <span className="text-[10px] text-slate-400 tracking-widest font-headers font-bold uppercase">DOT BALLS</span>
              <span className="text-lg lg:text-xl font-black text-slate-200">{dots}</span>
            </div>

            <div className="flex flex-col items-center font-numbers">
              <span className="text-[10px] text-sky-400 tracking-widest font-headers font-bold uppercase">OVERS</span>
              <span className="text-lg lg:text-xl font-black text-sky-300">{overs}</span>
            </div>

            <div className="flex flex-col items-center font-numbers">
              <span className="text-[10px] text-slate-400 tracking-widest font-headers font-bold uppercase">MAIDENS</span>
              <span className="text-lg lg:text-xl font-black text-slate-300">{maidens}</span>
            </div>

            <div className="flex flex-col items-center font-numbers">
              <span className="text-[10px] text-amber-400 tracking-widest font-headers font-bold uppercase">RUNS</span>
              <span className="text-lg lg:text-xl font-black text-amber-300">{runs}</span>
            </div>

            <div className="flex flex-col items-center font-numbers">
              <span className="text-[10px] text-rose-400 tracking-widest font-headers font-bold uppercase">WICKETS</span>
              <span className="text-2xl lg:text-3xl font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">{wickets}</span>
            </div>

            <div className="flex flex-col items-center font-numbers">
              <span className="text-[10px] text-emerald-400 tracking-widest font-headers font-bold uppercase">ECONOMY</span>
              <span className="text-lg lg:text-xl font-black text-emerald-400">{economy}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PARTNERSHIP LOWER THIRD (Cyan theme)
  // ─────────────────────────────────────────────────────────────────────────────
  if (type === 'partnership') {
    const d = (data as PartnershipLowerThirdData) || {};
    const p = matchDetails.partnership;
    const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
    const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];

    const batter1Name = d.batter1Name ?? p?.batter1Name ?? striker?.name ?? 'BATTER 1';
    const batter2Name = d.batter2Name ?? p?.batter2Name ?? nonStriker?.name ?? 'BATTER 2';
    const partnershipRuns = d.partnershipRuns ?? p?.runs ?? (striker?.runs ?? 0) + (nonStriker?.runs ?? 0);
    const partnershipBalls = d.partnershipBalls ?? p?.balls ?? (striker?.balls ?? 0) + (nonStriker?.balls ?? 0);

    return (
      <motion.div
        {...slideAnimation}
        className="fixed bottom-8 left-16 right-16 z-40 h-20 text-white rounded-xl shadow-2xl flex items-center justify-between px-12 font-sans border-t-2 border-b-2 border-white/50 animate-slide-in-bottom backdrop-blur-md"
        style={{ background: 'rgba(0, 180, 216, 0.95)' }}
        data-overlay="lower-third-partnership"
      >
        {/* Left Batter */}
        <div className="font-black text-2xl uppercase tracking-wide text-white drop-shadow font-headers">
          {batter1Name}
        </div>

        {/* Center Partnership Capsule */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs font-black tracking-widest uppercase opacity-90 font-headers">
            PARTNERSHIP
          </span>
          <span className="text-3xl font-black font-numbers tracking-tight">
            {partnershipRuns} <span className="text-xl font-bold opacity-80">({partnershipBalls})</span>
          </span>
        </div>

        {/* Right Batter */}
        <div className="font-black text-2xl uppercase tracking-wide text-white drop-shadow font-headers">
          {batter2Name}
        </div>
      </motion.div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. TARGET LOWER THIRD (Dual-box: Yellow "NEED", Cyan "FROM", VS in middle)
  // ─────────────────────────────────────────────────────────────────────────────
  if (type === 'target') {
    const d = (data as TargetLowerThirdData) || {};
    const chasingTeam = isTeamA ? teamA : teamB;
    const defendingTeam = isTeamA ? teamB : teamA;

    const targetRuns = matchDetails.targetRuns || 20;
    const needRuns = d.needRuns ?? Math.max(0, targetRuns - chasingTeam.score);
    const totalMaxBalls = (matchDetails.totalOvers || 20) * 6;
    const ballsBowled = chasingTeam.overs * 6 + chasingTeam.balls;
    const fromBalls = d.fromBalls ?? Math.max(0, totalMaxBalls - ballsBowled);

    const teamAName = d.teamA ?? (chasingTeam.fullName || chasingTeam.shortName || 'TEAM A');
    const teamBName = d.teamB ?? (defendingTeam.fullName || defendingTeam.shortName || 'TEAM B');
    const teamAColor = d.teamAColor ?? chasingTeam.primaryColor ?? '#00b4d8';
    const teamBColor = d.teamBColor ?? defendingTeam.primaryColor ?? '#ffc72c';

    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center font-sans pointer-events-none" data-overlay="lower-third-target">
        <motion.div
          {...slideAnimation}
          className="flex flex-col items-center gap-8 pointer-events-auto animate-slide-in-bottom"
        >
          {/* Dual Cards */}
          <div className="flex items-center gap-12">
            {/* Left Card: Yellow "NEED" */}
            <div className="w-72 h-80 rounded-3xl flex flex-col justify-between items-center shadow-2xl border-2 border-white/20 p-2" style={{ background: 'rgba(0, 8, 101, 0.95)' }}>
              <div className="w-full bg-[#ffc72c] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider font-headers">
                NEED
              </div>
              <div className="text-white font-black text-8xl tracking-tight my-auto font-numbers">
                {needRuns}
              </div>
              <div className="w-full bg-[#ffc72c] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider font-headers">
                RUNS
              </div>
            </div>

            {/* Right Card: Cyan "FROM" */}
            <div className="w-72 h-80 rounded-3xl flex flex-col justify-between items-center shadow-2xl border-2 border-white/20 p-2" style={{ background: 'rgba(0, 8, 101, 0.95)' }}>
              <div className="w-full bg-[#00b4d8] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider font-headers">
                FROM
              </div>
              <div className="text-white font-black text-8xl tracking-tight my-auto font-numbers">
                {fromBalls}
              </div>
              <div className="w-full bg-[#00b4d8] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider font-headers">
                BALLS
              </div>
            </div>
          </div>

          {/* Bottom Split Team Bar with VS Logo */}
          <div className="w-[1080px] h-16 rounded-md overflow-hidden flex items-stretch shadow-2xl">
            <div
              className="flex-1 text-slate-950 font-black text-2xl uppercase flex items-center justify-center tracking-wide font-headers"
              style={{ background: teamAColor }}
            >
              {teamAName}
            </div>
            <div className="w-24 bg-white flex items-center justify-center font-black text-2xl text-blue-600 shadow-inner font-headers">
              ⚡VS
            </div>
            <div
              className="flex-1 text-slate-950 font-black text-2xl uppercase flex items-center justify-center tracking-wide font-headers"
              style={{ background: teamBColor }}
            >
              {teamBName}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};
