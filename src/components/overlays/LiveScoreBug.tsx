import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { OverProgressDots } from './OverProgressDots';
import { TargetProgressBar } from './TargetProgressBar';

export const LiveScoreBug: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  // Resolve active theme deterministically from URL parameters, route path, active store, or league title
  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  const oversFormatted = `${battingTeam.overs}.${battingTeam.balls}`;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(1) : '0.0';

  // Last ball event detection for boundary glow animations
  const lastBall = matchDetails.recentBalls.length > 0 ? matchDetails.recentBalls[matchDetails.recentBalls.length - 1] : '';
  const isFour = lastBall === '4' || matchDetails.customInputText?.includes('FOUR');
  const isSix = lastBall === '6' || matchDetails.customInputText?.includes('SIX');
  const isWicket = lastBall === 'W' || matchDetails.decision === 'OUT' || matchDetails.customInputText?.includes('WICKET');

  const layoutStyle = theme.layoutStyle || 'pill';

  return (
    <div className="absolute bottom-4 inset-x-4 z-40 flex flex-col items-center gap-1.5 pointer-events-none">
      
      {/* 1. Boundary 4/6 Explosive Flash Banner */}
      <AnimatePresence>
        {(isFour || isSix || isWicket) && (
          <motion.div
            initial={{ scale: 0.5, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300 }}
            className={`px-8 py-2 font-black text-2xl tracking-widest uppercase rounded-2xl shadow-2xl border-2 backdrop-blur-md pointer-events-auto ${
              isWicket
                ? 'bg-gradient-to-r from-red-700 via-rose-600 to-red-900 text-white border-red-400 shadow-red-600/60'
                : isSix
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 border-yellow-200 shadow-amber-500/60'
                : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white border-cyan-300 shadow-cyan-500/60'
            }`}
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block"
            >
              {isWicket ? '⚡ WICKET ⚡' : isSix ? '🔥 MAXIMUM 6 🔥' : '🚀 FOUR 4 🚀'}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Target Progress Bar Header (if chasing second innings) */}
      {theme.showTargetBar && matchDetails.targetRuns && (
        <div className="w-full max-w-[1080px] pointer-events-auto">
          <TargetProgressBar
            targetRuns={matchDetails.targetRuns}
            currentRuns={battingTeam.score}
            remainingBalls={120 - totalBalls}
            requiredRunRate={totalBalls < 120 ? (((matchDetails.targetRuns - battingTeam.score) / ((120 - totalBalls) / 6))).toFixed(1) : '0.0'}
            primaryAccent={theme.primaryAccent}
          />
        </div>
      )}

      {/* 3. Main Scorebug (Dynamic Layout Renderer) */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        className={`w-full max-w-[1180px] flex items-stretch h-[78px] shadow-2xl overflow-hidden font-sans pointer-events-auto transition-all duration-300 ${
          layoutStyle === 'dual-capsule'
            ? 'rounded-3xl border-2 border-amber-400/80 bg-slate-950 text-white p-1 gap-1'
            : layoutStyle === 'glass-box'
            ? 'rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur-xl text-white shadow-cyan-500/20'
            : layoutStyle === 'chevron'
            ? 'rounded-xl border-l-8 border-r-8 border-emerald-400 bg-slate-950 text-white'
            : layoutStyle === 'flat-bar'
            ? 'rounded-lg border-t-4 border-orange-500 bg-neutral-900 text-white'
            : 'rounded-2xl border border-white/30 bg-slate-900 text-white'
        }`}
      >
        {/* Batting Team Badge */}
        <div
          className="px-5 flex items-center gap-3 shrink-0 border-r border-white/10"
          style={{ background: battingTeam.primaryColor || theme.badgeBg }}
        >
          <div className="w-12 h-12 rounded-full bg-black/40 border-2 border-white/60 flex items-center justify-center font-black text-white text-base shadow-md">
            {battingTeam.shortName}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm uppercase tracking-tight text-white drop-shadow">
              {battingTeam.fullName}
            </span>
            <span className="font-bold text-slate-300 text-[11px]">
              v {bowlingTeam.shortName}
            </span>
          </div>
        </div>

        {/* Score Block */}
        <div className="px-5 flex flex-col justify-center border-r border-white/10 shrink-0 bg-black/40">
          <div className="font-black text-3xl tracking-tight leading-none text-white flex items-baseline gap-1">
            <span>{battingTeam.score}</span>
            <span className="text-amber-400 text-2xl">-{battingTeam.wickets}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-black text-slate-300 mt-1 gap-2">
            <span className="text-cyan-400">{oversFormatted} OVS</span>
            <span>CRR: {crr}</span>
          </div>
        </div>

        {/* Batters Stats */}
        <div className="flex-1 px-4 flex flex-col justify-center border-r border-white/10 min-w-[240px] bg-slate-900/60 text-xs font-black">
          {striker && (
            <div className="flex items-center justify-between text-white mb-0.5">
              <span className="truncate flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate uppercase font-black">{striker.name}</span>
              </span>
              <span className="font-black text-sm text-amber-400 ml-2">
                {striker.runs} <span className="text-xs font-bold text-slate-400">({striker.balls})</span>
              </span>
            </div>
          )}
          {nonStriker && (
            <div className="flex items-center justify-between text-slate-400 font-bold">
              <span className="truncate uppercase pl-3.5">{nonStriker.name}</span>
              <span className="text-xs ml-2">
                {nonStriker.runs} <span className="text-[11px] opacity-75">({nonStriker.balls})</span>
              </span>
            </div>
          )}
        </div>

        {/* Center Event Banner / Tournament Title */}
        <div
          className="flex-1 px-4 flex items-center justify-center border-r border-white/10 text-center shadow-inner"
          style={{ background: theme.headerGradient }}
        >
          <span className="text-white font-black text-base tracking-wider uppercase drop-shadow">
            {matchDetails.customInputText || matchDetails.winnerMargin || theme.name}
          </span>
        </div>

        {/* Bowler Stats & Over-Ball Progress Dots */}
        <div className="px-4 flex flex-col justify-center border-r border-white/10 shrink-0 min-w-[240px] bg-black/40 text-xs font-black text-white">
          {currentBowler && (
            <div className="flex items-center justify-between mb-1">
              <span className="truncate uppercase text-slate-300">{currentBowler.name}</span>
              <span className="text-amber-400 font-black text-sm">
                {currentBowler.wickets}-{currentBowler.runsConceded} <span className="text-slate-400 text-xs">({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
              </span>
            </div>
          )}
          {theme.showOverDots ? (
            <OverProgressDots recentBalls={matchDetails.recentBalls} accentColor={theme.primaryAccent} />
          ) : (
            <div className="flex items-center gap-1">
              {matchDetails.recentBalls.slice(0, 6).map((ball, idx) => (
                <span key={idx} className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-black text-[10px] text-white">
                  {ball}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bowling Team Badge */}
        <div
          className="px-5 flex items-center justify-end gap-3 shrink-0 border-l border-white/10"
          style={{ background: bowlingTeam.primaryColor || theme.badgeBg }}
        >
          <div className="flex flex-col text-right leading-tight">
            <span className="font-black text-sm uppercase tracking-tight text-white drop-shadow">
              {bowlingTeam.fullName}
            </span>
            <span className="font-bold text-slate-300 text-[11px]">BOWLING</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-black/40 border-2 border-white/60 flex items-center justify-center font-black text-white text-base shadow-md">
            {bowlingTeam.shortName}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

