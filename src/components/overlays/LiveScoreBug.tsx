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
            ? 'rounded-3xl border-2 bg-slate-950 text-white p-1 gap-1'
            : layoutStyle === 'glass-box'
            ? 'rounded-2xl border border-white/30 bg-slate-900/85 backdrop-blur-2xl text-white'
            : layoutStyle === 'chevron'
            ? 'rounded-xl border-l-8 border-r-8 bg-slate-950 text-white'
            : layoutStyle === 'flat-bar'
            ? 'rounded-lg border-t-4 bg-neutral-900 text-white'
            : 'rounded-2xl border border-white/30 bg-slate-950 text-white'
        }`}
        style={{
          borderColor: theme.primaryAccent || 'rgba(255,255,255,0.3)',
          boxShadow: `0 20px 50px -10px ${theme.primaryAccent ? theme.primaryAccent + '40' : 'rgba(0,0,0,0.5)'}`
        }}
      >
        {/* Batting Team Badge */}
        <div
          className="px-5 flex items-center gap-3 shrink-0 border-r border-white/10 transition-colors max-w-[220px]"
          style={{ background: theme.badgeBg || '#0f172a' }}
        >
          <div
            className="w-11 h-11 rounded-full border-2 flex items-center justify-center font-black text-white text-base shadow-lg shrink-0"
            style={{
              borderColor: theme.primaryAccent || '#ffffff',
              backgroundColor: battingTeam.primaryColor || 'rgba(0,0,0,0.6)'
            }}
          >
            {battingTeam.shortName}
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span
              className="font-black text-sm uppercase tracking-tight drop-shadow truncate"
              style={{ color: theme.id === 'bbl_white' ? '#0f172a' : '#ffffff' }}
            >
              {battingTeam.fullName}
            </span>
            <span className="font-bold text-[11px] truncate" style={{ color: theme.primaryAccent }}>
              v {bowlingTeam.shortName}
            </span>
          </div>
        </div>

        {/* Score Block */}
        <div
          className="px-5 flex flex-col justify-center border-r border-white/10 shrink-0"
          style={{ background: theme.badgeBg ? `${theme.badgeBg}dd` : 'rgba(0,0,0,0.6)' }}
        >
          <div className="font-black text-3xl tracking-tight leading-none flex items-baseline gap-1">
            <span style={{ color: theme.primaryAccent || (theme.id === 'bbl_white' ? '#0f172a' : '#ffffff') }}>{battingTeam.score}</span>
            <span className="text-amber-400 text-2xl">-{battingTeam.wickets}</span>
          </div>
          <div
            className="flex items-center justify-between text-[11px] font-black mt-1 gap-2"
            style={{ color: theme.id === 'bbl_white' ? '#334155' : '#cbd5e1' }}
          >
            <span style={{ color: theme.primaryAccent || '#38bdf8' }}>{oversFormatted} OVS</span>
            <span>CRR: {crr}</span>
          </div>
        </div>

        {/* Batters Stats */}
        <div
          className="flex-1 px-4 flex flex-col justify-center border-r border-white/10 min-w-[200px] text-xs font-black"
          style={{ background: theme.cardBg || (theme.id === 'bbl_white' ? '#f8fafc' : 'rgba(15, 23, 42, 0.85)') }}
        >
          {striker && (
            <div className="flex items-center justify-between mb-0.5" style={{ color: theme.id === 'bbl_white' ? '#0f172a' : '#ffffff' }}>
              <span className="truncate flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: theme.primaryAccent || '#34d399' }} />
                <span className="truncate uppercase font-black">{striker.name}</span>
              </span>
              <span className="font-black text-sm ml-2 shrink-0" style={{ color: theme.primaryAccent || '#facc15' }}>
                {striker.runs} <span className="text-xs font-bold opacity-75">({striker.balls})</span>
              </span>
            </div>
          )}
          {nonStriker && (
            <div className="flex items-center justify-between opacity-75 font-bold" style={{ color: theme.id === 'bbl_white' ? '#475569' : '#94a3b8' }}>
              <span className="truncate uppercase pl-3.5 min-w-0">{nonStriker.name}</span>
              <span className="text-xs ml-2 shrink-0">
                {nonStriker.runs} <span className="text-[11px] opacity-75">({nonStriker.balls})</span>
              </span>
            </div>
          )}
        </div>

        {/* Center Event Banner / Tournament Title */}
        <div
          className="flex-1 px-4 flex items-center justify-center border-r border-white/10 text-center shadow-inner relative overflow-hidden min-w-[180px]"
          style={{ background: theme.headerGradient || 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <span className="text-white font-black text-sm tracking-wider uppercase drop-shadow-md z-10 whitespace-nowrap truncate max-w-[250px] px-1">
            {matchDetails.customInputText || matchDetails.winnerMargin || matchDetails.tournament || theme.name}
          </span>
        </div>

        {/* Bowler Stats & Over-Ball Progress Dots */}
        <div
          className="px-4 flex flex-col justify-center border-r border-white/10 shrink-0 min-w-[210px] text-xs font-black shadow-inner"
          style={{
            background: layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26'
              ? 'linear-gradient(180deg, #facc15 0%, #eab308 100%)'
              : theme.badgeBg ? `${theme.badgeBg}dd` : 'rgba(0,0,0,0.6)',
            color: (layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26' || theme.id === 'bbl_white') ? '#0f172a' : '#ffffff'
          }}
        >
          {currentBowler && (
            <div className="flex items-center justify-between mb-1">
              <span
                className="truncate uppercase font-black max-w-[110px]"
                style={{ color: (layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26' || theme.id === 'bbl_white') ? '#0f172a' : '#cbd5e1' }}
              >
                {currentBowler.name}
              </span>
              <span
                className="font-black text-sm shrink-0"
                style={{ color: (layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26') ? '#000000' : theme.primaryAccent || '#facc15' }}
              >
                {currentBowler.wickets}-{currentBowler.runsConceded} <span className="text-xs font-bold opacity-75">({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
              </span>
            </div>
          )}
          {theme.showOverDots ? (
            <OverProgressDots recentBalls={matchDetails.recentBalls} accentColor={(layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26') ? '#000000' : theme.primaryAccent} />
          ) : (
            <div className="flex items-center gap-1">
              {matchDetails.recentBalls.slice(0, 6).map((ball, idx) => (
                <span key={idx} className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center font-black text-[10px] text-white">
                  {ball}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bowling Team Badge */}
        <div
          className="px-5 flex items-center justify-end gap-3 shrink-0 border-l border-white/10 transition-colors max-w-[220px]"
          style={{
            background: layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26'
              ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
              : theme.badgeBg || '#0f172a'
          }}
        >
          <div className="flex flex-col text-right leading-tight min-w-0">
            <span
              className="font-black text-sm uppercase tracking-tight drop-shadow truncate"
              style={{ color: (layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26') ? '#0f172a' : '#ffffff' }}
            >
              {bowlingTeam.fullName}
            </span>
            <span
              className="font-bold text-[11px] truncate"
              style={{ color: (layoutStyle === 'cricscorer-broadcast' || theme.id === 'asl26') ? '#000000' : theme.primaryAccent }}
            >
              BOWLING
            </span>
          </div>
          <div
            className="w-11 h-11 rounded-full border-2 flex items-center justify-center font-black text-white text-base shadow-lg shrink-0"
            style={{
              borderColor: '#ffffff',
              backgroundColor: bowlingTeam.primaryColor || 'rgba(0,0,0,0.6)'
            }}
          >
            {bowlingTeam.shortName}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

