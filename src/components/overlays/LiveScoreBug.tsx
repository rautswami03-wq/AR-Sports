import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { OverProgressDots } from './OverProgressDots';
import { TargetProgressBar } from './TargetProgressBar';
import { AsiaCupLeftCyanWings, AsiaCupRightYellowWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';

// ---------------------------------------------------------------------------
// ColoredBallDots — broadcast-accurate colored ball indicators
// ---------------------------------------------------------------------------
interface BallDotProps { balls: string[]; size?: 'sm' | 'md' }
const ColoredBallDots: React.FC<BallDotProps> = ({ balls, size = 'md' }) => {
  const dim = size === 'sm' ? 'w-4 h-4 text-[9px]' : 'w-[22px] h-[22px] text-[10px]';

  const getStyle = (ball: string): { bg: string; color: string; label: string } => {
    switch (ball) {
      case '6':  return { bg: '#16a34a', color: '#fff', label: '6' };
      case '4':  return { bg: '#ca8a04', color: '#fff', label: '4' };
      case 'W':  return { bg: '#dc2626', color: '#fff', label: 'W' };
      case 'WD': return { bg: '#7c3aed', color: '#fff', label: 'WD' };
      case 'NB': return { bg: '#ea580c', color: '#fff', label: 'NB' };
      case '0':  return { bg: '#1e293b', color: '#475569', label: '●' };
      default:   return { bg: '#1e293b', color: '#e2e8f0', label: ball };
    }
  };

  const recent = balls.slice(-6);
  const empties = Math.max(0, 6 - recent.length);

  return (
    <div className="flex items-center gap-1">
      {recent.map((ball, idx) => {
        const s = getStyle(ball);
        return (
          <span
            key={idx}
            className={`${dim} rounded-full flex items-center justify-center font-black shrink-0`}
            style={{ background: s.bg, color: s.color }}
          >
            {s.label}
          </span>
        );
      })}
      {Array.from({ length: empties }).map((_, idx) => (
        <span
          key={`e-${idx}`}
          className={`${dim} rounded-full border border-white/25 shrink-0`}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// LiveScoreBug — main scorebug overlay component
// ---------------------------------------------------------------------------
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
  const rrr = matchDetails.targetRuns && totalBalls < 120
    ? Math.max(0, (matchDetails.targetRuns - battingTeam.score) / Math.max(1, (120 - totalBalls) / 6)).toFixed(2)
    : '0.00';

  // ── TIMED FLASH BANNER — auto-dismisses after 3 seconds ──────────────────
  const [flashType, setFlashType] = useState<'four' | 'six' | 'wicket' | null>(null);
  const prevLastBall   = useRef('');
  const prevCustomText = useRef('');
  const flashTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFlash = (type: 'four' | 'six' | 'wicket') => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlashType(type);
    flashTimer.current = setTimeout(() => setFlashType(null), 3000);
  };

  const lastBall = matchDetails.recentBalls.length > 0
    ? matchDetails.recentBalls[matchDetails.recentBalls.length - 1]
    : '';

  // Trigger on new ball added to recentBalls
  useEffect(() => {
    if (!lastBall || lastBall === prevLastBall.current) return;
    prevLastBall.current = lastBall;
    if (lastBall === 'W') triggerFlash('wicket');
    else if (lastBall === '6') triggerFlash('six');
    else if (lastBall === '4') triggerFlash('four');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastBall]);

  // Trigger on manual customInputText events
  useEffect(() => {
    const text = matchDetails.customInputText || '';
    if (!text || text === prevCustomText.current) return;
    prevCustomText.current = text;
    if (text.includes('WICKET') || matchDetails.decision === 'OUT') triggerFlash('wicket');
    else if (text.includes('SIX') || text.includes('MAXIMUM'))     triggerFlash('six');
    else if (text.includes('FOUR'))                                  triggerFlash('four');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDetails.customInputText, matchDetails.decision]);

  // Cleanup on unmount
  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  const isFour   = flashType === 'four';
  const isSix    = flashType === 'six';
  const isWicket = flashType === 'wicket';

  const layoutStyle = theme.layoutStyle || 'broadcast-full';
  const totalFours = battingTeam.batters.reduce((acc, b) => acc + (b.fours || 0), 0);
  const totalSixes = battingTeam.batters.reduce((acc, b) => acc + (b.sixes || 0), 0);

  // Theme-derived color helpers — use explicit overrides or fall back to theme defaults
  const teamLabelBg    = theme.teamLabelBg    ?? theme.badgeBg  ?? '#0f172a';
  const teamLabelColor = theme.teamLabelColor ?? '#ffffff';
  const scoreColor     = theme.scoreColor     ?? theme.primaryAccent ?? '#ffffff';
  const scoreBoxBg     = theme.scoreBoxBg     ?? (theme.badgeBg ? `${theme.badgeBg}ee` : 'rgba(15,23,42,0.9)');
  const battersBg      = theme.battersBg      ?? 'rgba(15,23,42,0.92)';
  const centerBoxBg    = theme.centerBoxBg    ?? (theme.badgeBg ?? '#0f172a');
  const bowlerBg       = theme.bowlerBg       ?? (theme.badgeBg ? `${theme.badgeBg}dd` : 'rgba(15,23,42,0.85)');

  // Derived text color for batters section — white on dark, dark on light
  const battersBgIsDark = !theme.battersBg || theme.battersBg.startsWith('rgba(255') || theme.cardBg === '#ffffff';
  const battersTextColor  = battersBgIsDark ? '#ffffff' : '#0f172a';
  const battersText2Color = battersBgIsDark ? '#94a3b8' : '#475569';

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
      {theme.showTargetBar && matchDetails.targetRuns && layoutStyle !== 't20-asia-cup' && layoutStyle !== 'icc-navarasa' && layoutStyle !== 'centered-pill' && layoutStyle !== 'minimal-center' && (
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

      {/* ------------------------------------------------------------------ */}
      {/* 30. LOCAL MATCH STREAM PRO (1-to-1 Exact Screenshot Match)         */}
      {/* ------------------------------------------------------------------ */}
      {layoutStyle === 'local-match-pro' ? (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1280px] flex flex-col font-sans pointer-events-auto shadow-2xl relative overflow-hidden"
        >
          <div className="h-[74px] flex items-stretch border-2 border-slate-900 bg-black">
            {/* Left Team Cyan Box */}
            <div className="bg-[#00d2ff] text-slate-950 px-5 flex flex-col justify-center min-w-[170px] shrink-0 relative overflow-hidden">
              <span className="font-black text-xl uppercase tracking-tighter leading-none">
                {battingTeam.fullName || battingTeam.shortName}
              </span>
              <span className="text-[11px] font-extrabold opacity-80 mt-1 uppercase">
                v {bowlingTeam.shortName}
              </span>
            </div>

            {/* Cyan Score Box */}
            <div className="bg-[#00b4d8] text-[#000080] px-6 flex flex-col items-center justify-center min-w-[140px] shrink-0 border-r-2 border-slate-950">
              <span className="font-black text-3xl leading-none tracking-tight">
                {battingTeam.score}-{battingTeam.wickets}
              </span>
              <span className="text-[11px] font-bold text-slate-950 mt-0.5">
                {matchDetails.targetRuns ? `TARGET - ${matchDetails.targetRuns}` : `${oversFormatted} OVERS`}
              </span>
            </div>

            {/* Dark Navy Batters Box */}
            <div className="bg-[#000080] text-white flex-1 px-6 flex flex-col justify-center border-r-2 border-slate-950">
              {striker && (
                <div className="flex items-center justify-between text-base font-black uppercase py-0.5">
                  <span className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">&gt;</span>
                    {striker.name}
                  </span>
                  <span className="text-cyan-300 font-black text-lg">
                    {striker.runs} <span className="text-xs text-white/70 font-normal">{striker.balls}</span>
                  </span>
                </div>
              )}
              {nonStriker && (
                <div className="flex items-center justify-between text-xs font-bold uppercase opacity-75 py-0.5 pl-4">
                  <span>{nonStriker.name}</span>
                  <span>
                    {nonStriker.runs} <span className="opacity-60">{nonStriker.balls}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Red Bowler Box */}
            <div className="bg-[#ff003c] text-white px-6 flex flex-col justify-center min-w-[260px] shrink-0 border-r-2 border-slate-950">
              {currentBowler && (
                <div className="flex items-center justify-between text-sm font-black uppercase mb-1">
                  <span>{currentBowler.name}</span>
                  <span className="text-yellow-300">
                    {currentBowler.wickets} - {currentBowler.runsConceded} <span className="text-xs text-white font-normal">({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1">
                {matchDetails.recentBalls.slice(-6).map((ball, idx) => (
                  <span key={idx} className="w-5 h-5 rounded bg-white text-slate-950 font-black text-[11px] flex items-center justify-center border border-slate-900 shadow">
                    {ball}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Team Red Box */}
            <div className="bg-[#ff003c] text-white px-5 flex flex-col justify-center items-end min-w-[170px] shrink-0">
              <span className="font-black text-xl uppercase tracking-tighter leading-none text-right">
                {bowlingTeam.fullName || bowlingTeam.shortName}
              </span>
              <span className="text-[10px] font-extrabold text-yellow-300 uppercase mt-1">
                BOWLING
              </span>
            </div>
          </div>

          {/* Bottom Ticker */}
          <div className="h-6 bg-[#000080] text-white text-xs font-black uppercase tracking-widest flex items-center justify-between px-6 border-t border-cyan-400">
            <span>{battingTeam.fullName} INNINGS</span>
            <span>{matchDetails.winnerMargin || matchDetails.customInputText || `1st Innings • Target Set`}</span>
            <span>OVERS: {oversFormatted}</span>
          </div>
        </motion.div>
      ) : layoutStyle === 't20-asia-cup' ? (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1260px] flex flex-col font-sans pointer-events-auto shadow-2xl overflow-hidden rounded-md"
        >
          {/* Main Top White Bar */}
          <div className="h-[74px] bg-white flex items-stretch relative border-t-2 border-b-2 border-cyan-400">
            {/* Left Asia Cup Wings */}
            <div className="w-16 h-full flex-shrink-0 flex items-center">
              <AsiaCupLeftCyanWings className="w-full h-full" />
            </div>

            {/* Left Batting Team Name */}
            <div className="px-4 flex items-center justify-center flex-shrink-0 min-w-[150px]">
              <span className="font-black text-xl tracking-tight text-slate-950 uppercase">
                {battingTeam.fullName || battingTeam.shortName}
              </span>
            </div>

            {/* Center Dark Navy Shield Score Container */}
            <div className="flex-shrink-0 relative flex flex-col items-center justify-center bg-[#000865] px-6 text-white min-w-[210px] rounded-b-2xl shadow-xl border-x border-[#ffc72c]">
              <div className="font-black text-3xl tracking-tight leading-none flex items-baseline gap-2">
                <span>{battingTeam.score} - {battingTeam.wickets}</span>
                <span className="text-sm font-bold opacity-90 text-slate-200">{oversFormatted} ({matchDetails.totalOvers || 20})</span>
              </div>
              <div className="bg-[#00b4d8] text-slate-950 text-[11px] font-black px-4 py-0.5 rounded-full mt-1 uppercase tracking-wider">
                {matchDetails.targetRuns ? `TARGET - ${matchDetails.targetRuns}` : `CRR: ${crr}`}
              </div>
            </div>

            {/* Batters Information */}
            <div className="flex-1 px-4 flex flex-col justify-center text-slate-950 font-bold min-w-[180px]">
              {nonStriker && (
                <div className="flex items-center justify-between text-sm py-0.5">
                  <span className="truncate uppercase">{nonStriker.name}</span>
                  <span className="font-black text-sm ml-2">{nonStriker.runs} <span className="font-medium opacity-75">{nonStriker.balls}</span></span>
                </div>
              )}
              {striker && (
                <div className="flex items-center justify-between text-sm py-0.5">
                  <span className="truncate uppercase flex items-center gap-1.5 font-black">
                    <span className="text-black text-xs">●</span>
                    {striker.name}
                  </span>
                  <span className="font-black text-sm ml-2">{striker.runs} <span className="font-medium opacity-75">{striker.balls}</span></span>
                </div>
              )}
            </div>

            {/* Bowler & Over Balls Block (Yellow Background) */}
            <div className="bg-[#ffc72c] px-4 flex flex-col justify-center flex-shrink-0 min-w-[230px] border-l-4 border-cyan-400 text-slate-950">
              {currentBowler && (
                <div className="flex items-center justify-between font-black text-sm mb-0.5">
                  <span className="truncate uppercase">{currentBowler.name}</span>
                  <span className="ml-2 font-black">{currentBowler.wickets}-{currentBowler.runsConceded} <span className="text-xs font-bold opacity-80">({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span></span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs font-black">
                <span className="uppercase tracking-wider text-[11px]">OVER</span>
                <div className="flex items-center gap-1">
                  {matchDetails.recentBalls.length > 0 ? (
                    matchDetails.recentBalls.slice(-6).map((ball, idx) => (
                      <span key={idx} className="w-5 h-5 rounded-full border border-slate-900 flex items-center justify-center font-black text-[10px] bg-white">
                        {ball === '0' ? '●' : ball}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs opacity-75">0 0 0 0 0 0</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Bowling Team Name */}
            <div className="px-4 flex items-center justify-center flex-shrink-0 min-w-[150px]">
              <span className="font-black text-xl tracking-tight text-slate-950 uppercase">
                {bowlingTeam.fullName || bowlingTeam.shortName}
              </span>
            </div>

            {/* Right Asia Cup Yellow Wings */}
            <div className="w-16 h-full flex-shrink-0 flex items-center">
              <AsiaCupRightYellowWings className="w-full h-full" />
            </div>
          </div>

          {/* Bottom Deep Blue Ticker */}
          <div className="h-6 bg-gradient-to-r from-[#000865] via-[#00127a] to-[#000865] flex items-center justify-center text-white text-xs font-black uppercase tracking-widest px-4">
            <span>{matchDetails.customInputText || matchDetails.winnerMargin || `Fours ${totalFours}   Sixes ${totalSixes}`}</span>
          </div>
        </motion.div>
      ) : layoutStyle === 'icc-navarasa' ? (
        /* ------------------------------------------------------------------ */
        /* 3B. ICC CRICKET WORLD CUP NAVARASA (Exact Replica)                 */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1240px] flex flex-col font-sans pointer-events-auto shadow-2xl relative"
        >
          {/* Top Target Pill (if target exists) */}
          {matchDetails.targetRuns && (
            <div className="self-center -mb-2 z-10">
              <div className="bg-[#20003b] text-white text-xs font-black px-6 py-1 rounded-t-lg tracking-wider uppercase border-t border-x border-pink-500 shadow-md">
                TARGET - {matchDetails.targetRuns}
              </div>
            </div>
          )}

          <div className="h-[74px] bg-white flex items-stretch relative rounded-xl overflow-hidden shadow-2xl border border-white/40">
            {/* Left Bowling / Batting Team Chevron Yellow */}
            <div className="bg-[#ffd700] text-slate-950 font-black text-lg uppercase px-6 flex items-center justify-center min-w-[160px] shadow-md">
              {battingTeam.fullName || battingTeam.shortName}
            </div>

            {/* Batters Box */}
            <div className="px-4 flex flex-col justify-center text-[#20003b] font-black min-w-[180px] bg-white border-r border-slate-200">
              {striker && (
                <div className="flex items-center justify-between text-sm py-0.5">
                  <span className="truncate uppercase flex items-center gap-1.5 text-[#e91e63]">
                    <span>▶</span>
                    <span className="text-[#20003b]">{striker.name}</span>
                  </span>
                  <span className="ml-2 font-black">{striker.runs} <span className="text-xs opacity-75 font-semibold">{striker.balls}</span></span>
                </div>
              )}
              {nonStriker && (
                <div className="flex items-center justify-between text-sm py-0.5 pl-3.5 opacity-85">
                  <span className="truncate uppercase">{nonStriker.name}</span>
                  <span className="ml-2 font-black">{nonStriker.runs} <span className="text-xs opacity-75 font-semibold">{nonStriker.balls}</span></span>
                </div>
              )}
            </div>

            {/* Center Purple Navarasa Match Status Shield */}
            <div className="bg-[#20003b] text-white px-6 flex flex-col items-center justify-center min-w-[280px] shadow-inner relative">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-wider">{battingTeam.shortName} v {bowlingTeam.shortName}</span>
                <span className="bg-[#e91e63] text-white font-black text-base px-2.5 py-0.5 rounded-md shadow-md">
                  {battingTeam.score}-{battingTeam.wickets}
                </span>
                <span className="bg-[#ffd700] text-slate-950 font-black text-xs px-1.5 py-0.5 rounded">P</span>
                <span className="font-black text-sm">{oversFormatted}({matchDetails.totalOvers || 20})</span>
              </div>
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide mt-1">
                {matchDetails.winnerMargin || matchDetails.customInputText || `${battingTeam.shortName} INNINGS`}
              </div>
            </div>

            {/* Bowler Section */}
            <div className="flex-1 px-4 flex flex-col justify-center text-[#20003b] font-black bg-white min-w-[220px]">
              {currentBowler && (
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="truncate uppercase font-black">{currentBowler.name}</span>
                  <span className="ml-2">{currentBowler.wickets} - {currentBowler.runsConceded} <span className="text-xs font-semibold opacity-75">{currentBowler.overs}</span></span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                {matchDetails.recentBalls.length > 0 ? (
                  matchDetails.recentBalls.slice(-6).map((ball, idx) => {
                    const isBoundary = ball === '4' || ball === '6';
                    const isW = ball === 'W';
                    return (
                      <span
                        key={idx}
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] text-white shadow-sm ${
                          isBoundary ? 'bg-[#e91e63]' : isW ? 'bg-red-600' : ball === '0' ? 'bg-slate-950' : 'bg-[#20003b]'
                        }`}
                      >
                        {ball === '0' ? '●' : ball}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs opacity-75 font-semibold">0 0 0 0 0 0</span>
                )}
              </div>
            </div>

            {/* Right Bowling Team Blue Chevron */}
            <div className="bg-[#00529b] text-white font-black text-lg uppercase px-6 flex items-center justify-center min-w-[160px] shadow-md">
              {bowlingTeam.fullName || bowlingTeam.shortName}
            </div>

            {/* Navarasa Vertical Ribbon border on right */}
            <div className="w-5 h-full flex-shrink-0">
              <NavarasaVerticalRibbon className="w-full h-full" />
            </div>
          </div>
        </motion.div>
      ) : layoutStyle === 'super-fission' ? (
        /* ------------------------------------------------------------------ */
        /* 3C. SUPER FISSION NEON GREEN & MIDNIGHT THEME                      */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1200px] flex flex-col font-sans pointer-events-auto shadow-2xl relative"
        >
          {matchDetails.targetRuns && (
            <div className="self-start ml-28 -mb-2 z-10">
              <div className="bg-[#09093b] text-[#00ff22] text-xs font-black px-5 py-1 rounded-t-lg tracking-wider uppercase border-t border-x border-[#00ff22]/50">
                TARGET - {matchDetails.targetRuns}
              </div>
            </div>
          )}

          <div className="h-[68px] flex items-stretch gap-2 bg-transparent">
            {/* Left Neon Green Pill */}
            <div className="bg-[#00ff22] text-[#09093b] font-black text-lg uppercase px-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              {battingTeam.fullName || battingTeam.shortName}
            </div>

            {/* Center Capsule */}
            <div className="flex-1 bg-[#09093b] text-white rounded-full px-6 flex items-center justify-between border-2 border-white/20 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-[#00ff22] font-black text-sm uppercase">{battingTeam.shortName} V {bowlingTeam.shortName}</span>
                <span className="bg-white text-[#09093b] font-black text-xl px-4 py-0.5 rounded-full shadow-inner">
                  {battingTeam.score}-{battingTeam.wickets}
                </span>
                <span className="text-[#00ff22] font-black text-sm">{oversFormatted}/{matchDetails.totalOvers || 20} OVERS</span>
              </div>

              <div className="font-black text-sm tracking-wide text-white uppercase text-center truncate max-w-[320px]">
                {matchDetails.winnerMargin || matchDetails.customInputText || `${battingTeam.fullName} BATTING`}
              </div>
            </div>

            {/* Right Neon Green Pill */}
            <div className="bg-[#00ff22] text-[#09093b] font-black text-lg uppercase px-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              {bowlingTeam.fullName || bowlingTeam.shortName}
            </div>
          </div>
        </motion.div>
      ) : layoutStyle === 'centered-pill' ? (
        /* ------------------------------------------------------------------ */
        /* 3D. CENTERED PILL — CT2025 Champions Trophy compact oval           */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="flex flex-col items-center gap-1 pointer-events-auto"
        >
          {matchDetails.targetRuns && (
            <div
              className="text-white text-[11px] font-black px-8 py-1 rounded-t-xl tracking-widest uppercase border-t border-x border-white/30 shadow-md"
              style={{ background: teamLabelBg }}
            >
              TARGET — {matchDetails.targetRuns}
            </div>
          )}
          {/* Main Pill */}
          <div
            className="flex items-center gap-0 rounded-full overflow-hidden shadow-2xl border border-white/20"
            style={{ background: teamLabelBg }}
          >
            {/* Batting team name */}
            <div
              className="px-6 h-[64px] flex items-center font-black text-base uppercase tracking-tight"
              style={{ color: theme.primaryAccent ?? '#84cc16' }}
            >
              {battingTeam.shortName}
            </div>
            {/* vs separator */}
            <div className="text-white/50 font-bold text-xs px-1">V</div>
            {/* Bowling team name */}
            <div
              className="px-3 h-[64px] flex items-center font-black text-base uppercase tracking-tight"
              style={{ color: theme.primaryAccent ?? '#84cc16' }}
            >
              {bowlingTeam.shortName}
            </div>
            {/* Score box — white inset */}
            <div
              className="h-[64px] px-6 flex flex-col items-center justify-center shadow-inner mx-1 rounded-full"
              style={{ background: theme.scoreBoxBg ?? '#ffffff', color: teamLabelBg }}
            >
              <span className="font-black text-2xl leading-none">{battingTeam.score}-{battingTeam.wickets}</span>
              <span className="text-[11px] font-bold opacity-60 mt-0.5">{oversFormatted} OVERS</span>
            </div>
            {/* Status / CRR */}
            {matchDetails.targetRuns ? (
              <div className="px-5 h-[64px] flex flex-col items-center justify-center border-l border-white/10">
                <span className="text-[11px] text-white/60 font-bold">CRR: {crr}</span>
                <span className="text-sm font-black" style={{ color: theme.primaryAccent }}>RRR: {rrr}</span>
              </div>
            ) : null}
          </div>
          {(matchDetails.winnerMargin || matchDetails.customInputText) && (
            <div className="text-white text-xs font-black mt-0.5 text-center uppercase tracking-widest drop-shadow">
              {matchDetails.winnerMargin || matchDetails.customInputText}
            </div>
          )}
        </motion.div>
      ) : layoutStyle === 'minimal-center' ? (
        /* ------------------------------------------------------------------ */
        /* 3E. MINIMAL CENTER — BBL Star Sports compact center box            */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="flex flex-col items-center pointer-events-auto"
        >
          <div
            className="flex items-center gap-0 overflow-hidden shadow-2xl border border-white/10 rounded-xl"
            style={{ background: scoreBoxBg }}
          >
            {/* Team abbreviation */}
            <div
              className="px-6 h-[72px] flex items-center font-black text-xl uppercase"
              style={{ color: '#ffffff', background: teamLabelBg }}
            >
              {battingTeam.shortName}
            </div>
            {/* Score highlight box */}
            <div
              className="px-6 h-[72px] flex flex-col items-center justify-center"
              style={{ background: '#000000' }}
            >
              <span className="font-black text-3xl leading-none" style={{ color: scoreColor }}>
                {battingTeam.wickets}/{battingTeam.score}
              </span>
            </div>
            {/* Overs + CRR/RRR */}
            <div
              className="px-5 h-[72px] flex flex-col justify-center"
              style={{ background: teamLabelBg, borderLeft: `2px solid ${scoreColor}` }}
            >
              <span className="font-black text-sm text-white">{oversFormatted} OVERS</span>
              <span className="text-[11px] font-bold mt-0.5" style={{ color: scoreColor }}>
                CRR: {crr}
                {matchDetails.targetRuns ? `  RRR: ${rrr}` : ''}
              </span>
            </div>
          </div>
          {/* Accent underline */}
          <div className="h-[3px] w-full rounded-b-sm" style={{ background: scoreColor }} />
        </motion.div>
      ) : (
        /* ------------------------------------------------------------------ */
        /* 3F. BROADCAST FULL — Standard full-width flat scorebug             */
        /*     Matches IPL 2025, CWC19, WT20 2024, JIO Cinema, SA20, etc.    */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1280px] flex items-stretch h-[76px] shadow-2xl overflow-hidden font-sans pointer-events-auto"
          style={{ boxShadow: `0 16px 40px -8px ${theme.badgeBg || '#000000'}99` }}
        >
          {/* ── LEFT: BATTING TEAM LABEL ── */}
          <div
            className="px-5 flex flex-col items-center justify-center shrink-0 min-w-[155px] border-r border-white/10"
            style={{ background: teamLabelBg }}
          >
            <span
              className="font-black text-sm uppercase tracking-tight leading-tight text-center line-clamp-2"
              style={{ color: teamLabelColor }}
            >
              {battingTeam.fullName || battingTeam.shortName}
            </span>
            <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider" style={{ color: teamLabelColor }}>
              BATTING
            </span>
          </div>

          {/* ── SCORE BOX ── */}
          <div
            className="flex flex-col justify-center items-center px-4 shrink-0 border-r border-white/10 min-w-[135px]"
            style={{ background: scoreBoxBg }}
          >
            {matchDetails.targetRuns && (
              <div
                className="text-[10px] font-black uppercase tracking-wider mb-0.5"
                style={{ color: scoreColor }}
              >
                TGT {matchDetails.targetRuns}
              </div>
            )}
            <div className="font-black text-2xl leading-none flex items-baseline gap-0.5">
              <span style={{ color: scoreColor }}>{battingTeam.score}</span>
              <span className="text-white/80 text-lg">-{battingTeam.wickets}</span>
            </div>
            <div className="text-[11px] font-bold mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {oversFormatted} OVS
            </div>
          </div>

          {/* ── BATTERS ── */}
          <div
            className="flex-1 px-4 flex flex-col justify-center border-r border-white/10 min-w-[200px]"
            style={{ background: battersBg }}
          >
            {/* Striker */}
            {striker && (
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className="flex items-center gap-1.5 text-sm font-black truncate min-w-0 uppercase"
                  style={{ color: battersTextColor }}
                >
                  <span className="text-xs shrink-0" style={{ color: scoreColor }}>✏</span>
                  <span className="truncate">{striker.name}</span>
                </span>
                <span className="font-black text-sm shrink-0 ml-2" style={{ color: scoreColor }}>
                  {striker.runs} <span className="font-bold text-[11px] opacity-75">({striker.balls})</span>
                </span>
              </div>
            )}
            {/* Non-striker */}
            {nonStriker && (
              <div className="flex items-center justify-between">
                <span
                  className="flex items-center gap-1.5 text-xs font-bold truncate min-w-0 uppercase pl-4"
                  style={{ color: battersText2Color }}
                >
                  <span className="shrink-0">●</span>
                  <span className="truncate">{nonStriker.name}</span>
                </span>
                <span className="text-xs shrink-0 ml-2 font-bold" style={{ color: battersText2Color }}>
                  {nonStriker.runs} <span className="opacity-75">({nonStriker.balls})</span>
                </span>
              </div>
            )}
          </div>

          {/* ── CENTER: CRR / RRR or match status ── */}
          <div
            className="px-4 flex flex-col justify-center items-center border-r border-white/10 shrink-0 min-w-[130px]"
            style={{ background: centerBoxBg }}
          >
            {matchDetails.winnerMargin || matchDetails.customInputText ? (
              <span className="text-white font-black text-[11px] text-center uppercase tracking-wide truncate max-w-[125px]">
                {matchDetails.winnerMargin || matchDetails.customInputText}
              </span>
            ) : matchDetails.targetRuns ? (
              <>
                <div className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>CRR: {crr}</div>
                <div className="font-black text-sm mt-0.5" style={{ color: scoreColor }}>
                  RRR: {rrr}
                </div>
              </>
            ) : (
              <>
                <div className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>CRR</div>
                <div className="font-black text-lg" style={{ color: scoreColor }}>{crr}</div>
              </>
            )}
          </div>

          {/* ── BOWLER + BALL DOTS ── */}
          <div
            className="px-4 flex flex-col justify-center border-r border-white/10 shrink-0 min-w-[215px]"
            style={{ background: bowlerBg }}
          >
            {currentBowler && (
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase truncate max-w-[105px]" style={{ color: '#ffffff' }}>
                  {currentBowler.name}
                </span>
                <span className="font-black text-xs shrink-0 ml-1" style={{ color: scoreColor }}>
                  {currentBowler.wickets}-{currentBowler.runsConceded}
                  <span className="text-[10px] opacity-75 font-bold"> ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
                </span>
              </div>
            )}
            <ColoredBallDots balls={matchDetails.recentBalls} />
          </div>

          {/* ── RIGHT: BOWLING TEAM LABEL ── */}
          <div
            className="px-5 flex flex-col items-center justify-center shrink-0 min-w-[155px]"
            style={{ background: teamLabelBg }}
          >
            <span
              className="font-black text-sm uppercase tracking-tight leading-tight text-center line-clamp-2"
              style={{ color: teamLabelColor }}
            >
              {bowlingTeam.fullName || bowlingTeam.shortName}
            </span>
            <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider" style={{ color: teamLabelColor }}>
              BOWLING
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
