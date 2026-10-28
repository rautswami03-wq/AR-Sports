import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore, hexToRgba } from '../../theme/presetThemes';
import { OverProgressDots, SustainabilityTreeIcon } from './OverProgressDots';
import { TargetProgressBar } from './TargetProgressBar';
import { AsiaCupLeftCyanWings, AsiaCupRightYellowWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';

// ---------------------------------------------------------------------------
// ColoredBallDots — broadcast-accurate colored ball indicators
// ---------------------------------------------------------------------------
interface BallDotProps { balls: string[]; size?: 'sm' | 'md' }
const ColoredBallDots: React.FC<BallDotProps> = ({ balls, size = 'md' }) => {
  const dim = size === 'sm' ? 'w-4 h-4 text-[9px]' : 'w-[22px] h-[22px] text-[10px]';
  const iconSize = size === 'sm' ? 10 : 13;

  const getStyle = (ball: string): { bg: string; color: string; label: string; isDot: boolean } => {
    switch (ball) {
      case '6':  return { bg: '#FF207C', color: '#fff', label: '6', isDot: false }; // Electric Pink
      case '4':  return { bg: '#FFDC35', color: '#000', label: '4', isDot: false }; // Coral Yellow
      case 'W':  return { bg: '#dc2626', color: '#fff', label: 'W', isDot: false };
      case 'WD': return { bg: '#7c3aed', color: '#fff', label: 'WD', isDot: false };
      case 'NB': return { bg: '#ea580c', color: '#fff', label: 'NB', isDot: false };
      case '0':
      case '.':
        return { bg: '#0a1f12', color: '#27E64B', label: '', isDot: true }; // Sustainability Tree Icon
      default:   return { bg: '#1e293b', color: '#e2e8f0', label: ball, isDot: false };
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
            className={`${dim} rounded-full flex items-center justify-center font-black shrink-0 ${
              s.isDot ? 'border border-[#27E64B]/40 shadow-[0_0_6px_rgba(39,230,75,0.4)]' : ''
            }`}
            style={{ background: s.bg, color: s.color }}
          >
            {s.isDot ? <SustainabilityTreeIcon size={iconSize} color="#27E64B" /> : s.label}
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

  const strikerContrib   = striker?.runs   ?? 0;
  const nonStrikerContrib = nonStriker?.runs ?? 0;
  const partnershipRuns  = strikerContrib + nonStrikerContrib;
  const partnershipBalls = (striker?.balls ?? 0) + (nonStriker?.balls ?? 0);

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
      {theme.showTargetBar && typeof matchDetails.targetRuns === 'number' && matchDetails.targetRuns > 0 && layoutStyle !== 't20-asia-cup' && layoutStyle !== 'icc-navarasa' && layoutStyle !== 'centered-pill' && layoutStyle !== 'minimal-center' ? (
        <div className="w-full max-w-[1080px] pointer-events-auto">
          <TargetProgressBar
            targetRuns={matchDetails.targetRuns}
            currentRuns={battingTeam.score}
            remainingBalls={120 - totalBalls}
            requiredRunRate={totalBalls < 120 ? (((matchDetails.targetRuns - battingTeam.score) / ((120 - totalBalls) / 6))).toFixed(1) : '0.0'}
            primaryAccent={theme.primaryAccent}
          />
        </div>
      ) : null}

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
      ) : layoutStyle === 'ar-sports-elite' ? (
        /* ------------------------------------------------------------------ */
        /* 3. AR SPORTS ELITE OFFICIAL LAYOUT                                  */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1340px] flex flex-col font-sans pointer-events-auto relative select-none"
        >
          {/* Target top tab overlay (centered over center section) */}
          {Boolean(matchDetails.targetRuns && matchDetails.targetRuns > 0) && (
            <div className="absolute left-[38%] top-[-26px] z-20">
              <div 
                className="bg-[#0a041f] text-white text-[11px] font-black px-6 py-1 rounded-t-lg tracking-widest uppercase border-t border-x border-white/20 shadow-md flex items-center justify-center gap-1.5"
                style={{ clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                TARGET - {matchDetails.targetRuns}
              </div>
            </div>
          )}

          {/* Main Ticker Block */}
          <div className="h-[76px] flex items-stretch border-2 border-slate-950 bg-[#160c30] shadow-2xl relative overflow-visible">
            
            {/* ── A. LEFT TEAM BADGE Flank ── */}
            <div 
              className="px-6 flex items-center justify-center shrink-0 min-w-[180px] text-slate-950 relative overflow-hidden"
              style={{
                background: battingTeam.primaryColor || '#ffd700',
                clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
              }}
            >
              <span className="font-black text-xl uppercase tracking-tighter text-center line-clamp-1">
                {battingTeam.shortName || battingTeam.fullName}
              </span>
              
              {/* Chevron chevron effect border */}
              <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center items-center gap-1.5 opacity-60">
                <span className="text-[8px] font-black">&gt;</span>
                <span className="text-[8px] font-black">&gt;</span>
                <span className="text-[8px] font-black">&gt;</span>
              </div>
            </div>

            {/* ── B. BATTERS BOX (White ground) ── */}
            <div className="bg-white text-[#160c30] flex-[1.2] px-6 flex flex-col justify-center border-r-2 border-slate-950 shadow-inner relative">
              {striker && (
                <div className="flex items-center justify-between text-[15px] font-black uppercase py-0.5">
                  <span className="flex items-center gap-1.5 text-[#160c30]">
                    <span className="text-rose-500 font-black text-xs shrink-0">▶</span>
                    <span className="truncate max-w-[150px]">{striker.name}</span>
                  </span>
                  <span className="font-black text-[16px] text-rose-600">
                    {striker.runs} <span className="text-[11px] font-normal text-slate-600 align-baseline">({striker.balls})</span>
                  </span>
                </div>
              )}
              {nonStriker && (
                <div className="flex items-center justify-between text-[13px] font-extrabold uppercase opacity-85 py-0.5 pl-4">
                  <span className="truncate max-w-[150px] text-slate-700">{nonStriker.name}</span>
                  <span className="font-bold text-[13px] text-slate-700">
                    {nonStriker.runs} <span className="text-[10px] font-normal text-slate-500 align-baseline">({nonStriker.balls})</span>
                  </span>
                </div>
              )}
            </div>

            {/* ── C. CENTER BRAND & SCORE BOX (Deep purple ground) ── */}
            <div 
              className="flex-[1.5] px-4 flex items-center justify-between relative"
              style={{
                background: '#160c30',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
            >
              {/* Left text: Match summary / Title */}
              <div className="flex flex-col justify-center text-left pl-2">
                <span className="text-[11px] text-slate-400 font-extrabold tracking-wider uppercase leading-none">
                  {battingTeam.shortName} V {bowlingTeam.shortName}
                </span>
                <span className="text-xs text-white font-black uppercase tracking-tight mt-1 line-clamp-1 max-w-[180px]">
                  {matchDetails.winnerMargin || matchDetails.customInputText || 'LIVE MATCH COVERAGE'}
                </span>
              </div>

              {/* Center: Angle Pink Score Box */}
              <div className="flex items-center gap-2">
                <div 
                  className="bg-gradient-to-r from-pink-600 to-rose-500 text-white font-black px-6 py-2 shadow-lg border border-pink-400/20 flex items-center justify-center min-w-[110px]"
                  style={{
                    clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
                  }}
                >
                  <span className="text-[26px] font-black tracking-tight leading-none font-numbers" data-stat="score">
                    {battingTeam.score}-{battingTeam.wickets}
                  </span>
                </div>

                {/* Powerplay / Free hit badge */}
                <div 
                  className="w-8 h-8 flex items-center justify-center font-black text-slate-950 text-xs shadow-md shrink-0"
                  style={{
                    background: '#ffd700',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  }}
                >
                  {battingTeam.overs < 6 ? 'P' : 'R'}
                </div>
              </div>

              {/* Right: Partnership Capsule */}
              <div 
                className="bg-[#241747] text-white px-4 py-1.5 flex flex-col items-center justify-center min-w-[70px] border border-white/5"
                style={{
                  clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                }}
              >
                <span className="text-[9px] font-extrabold opacity-60 uppercase tracking-widest leading-none">PART</span>
                <span className="text-[12px] font-black text-yellow-300 mt-0.5 leading-none font-numbers">
                  {partnershipRuns}({partnershipBalls})
                </span>
              </div>
            </div>

            {/* ── D. BOWLER BOX ── */}
            <div className="bg-white/95 text-[#160c30] flex-[1.4] px-6 flex flex-col justify-center border-l-2 border-r-2 border-slate-950">
              {currentBowler && (
                <div className="flex items-center justify-between text-[13px] font-black uppercase mb-1">
                  <span className="truncate max-w-[150px]">{currentBowler.name}</span>
                  <span className="text-rose-600 font-black font-numbers">
                    {currentBowler.wickets}-{currentBowler.runsConceded} 
                    <span className="text-[10px] font-normal text-slate-600 align-baseline font-numbers"> ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
                  </span>
                </div>
              )}
              
              {/* Ball Dots */}
              <div className="flex items-center gap-1.5 overflow-hidden">
                {matchDetails.recentBalls.slice(-6).map((ball, idx) => {
                  let dotColor = 'bg-slate-800 text-white';
                  let label = ball;
                  let isDot = false;
                  if (ball === '6') { dotColor = 'bg-[#FF207C] text-white shadow-[0_0_8px_rgba(255,32,124,0.6)]'; }
                  else if (ball === '4') { dotColor = 'bg-[#FFDC35] text-slate-950 font-black shadow-[0_0_8px_rgba(255,220,53,0.5)]'; }
                  else if (ball === 'W') { dotColor = 'bg-[#dc2626] text-white'; }
                  else if (ball === 'WD') { dotColor = 'bg-[#7c3aed] text-white'; label = 'Wd'; }
                  else if (ball === 'NB') { dotColor = 'bg-[#ea580c] text-white'; label = 'Nb'; }
                  else if (ball === '0' || ball === '.') {
                    dotColor = 'bg-[#0a1f12] text-[#27E64B] border border-[#27E64B]/40 shadow-[0_0_6px_rgba(39,230,75,0.4)]';
                    label = '';
                    isDot = true;
                  }

                  return (
                    <span 
                      key={idx} 
                      className={`w-[22px] h-[22px] rounded-full font-black text-[10px] flex items-center justify-center shadow-sm shrink-0 font-numbers ${dotColor}`}
                    >
                      {isDot ? <SustainabilityTreeIcon size={13} color="#27E64B" /> : label}
                    </span>
                  );
                })}
                {/* Pad empty balls */}
                {Array.from({ length: Math.max(0, 6 - matchDetails.recentBalls.length) }).map((_, idx) => (
                  <span 
                    key={`e-${idx}`} 
                    className="w-[22px] h-[22px] rounded-full border border-slate-300 shrink-0 bg-slate-50"
                  />
                ))}
              </div>
            </div>

            {/* ── E. RIGHT TEAM BADGE Flank ── */}
            <div 
              className="px-6 flex items-center justify-center shrink-0 min-w-[180px] text-slate-950 relative overflow-hidden"
              style={{
                background: bowlingTeam.primaryColor || '#00d2ff',
                clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%)',
              }}
            >
              {/* Chevron pattern separator on the left */}
              <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-center items-center gap-1.5 opacity-60">
                <span className="text-[8px] font-black">&lt;</span>
                <span className="text-[8px] font-black">&lt;</span>
                <span className="text-[8px] font-black">&lt;</span>
              </div>

              <span className="font-black text-xl uppercase tracking-tighter text-center line-clamp-1 pl-2 font-headers">
                {bowlingTeam.shortName || bowlingTeam.fullName}
              </span>
            </div>

          </div>

          {/* Bottom Running ticker strip */}
          <div className="h-6 bg-[#0a041f] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-between px-6 border-t-2 border-pink-500 shadow-md font-numbers">
            <span className="text-yellow-400 font-numbers" data-stat="runrate">CRR: {crr} {rrr ? ` | RRR: ${rrr}` : ''}</span>
            <span className="text-white/80">{matchDetails.customInputText || `${battingTeam.fullName} INNINGS OVER ${oversFormatted}`}</span>
            <span className="text-cyan-400 font-numbers" data-stat="overs">OVERS: {oversFormatted}</span>
          </div>

        </motion.div>
      ) : layoutStyle === 'jiocinema-magenta' ? (
        /* ------------------------------------------------------------------ */
        /* 3B. JIOCINEMA MAGENTA & GOLD BROADCAST BAR                         */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1260px] flex flex-col font-sans pointer-events-auto shadow-2xl relative rounded-2xl overflow-hidden border-2 border-rose-400"
        >
          <div className="h-[72px] flex items-stretch bg-[#4c0519]">
            <div className="bg-gradient-to-r from-rose-700 to-pink-600 text-white px-6 flex items-center justify-center font-black text-xl uppercase tracking-wider shrink-0 min-w-[170px] shadow-lg">
              {battingTeam.fullName || battingTeam.shortName}
            </div>
            <div className="bg-white text-rose-950 px-6 flex flex-col items-center justify-center min-w-[160px] shrink-0 border-r-2 border-rose-300">
              <span className="font-black text-3xl leading-none text-rose-700">{battingTeam.score}-{battingTeam.wickets}</span>
              <span className="text-xs font-bold text-slate-700 mt-0.5">{oversFormatted} OVERS</span>
            </div>
            <div className="bg-[#881337] text-white flex-1 px-6 flex flex-col justify-center">
              {striker && (
                <div className="flex items-center justify-between text-base font-black uppercase">
                  <span>★ {striker.name}</span>
                  <span className="text-amber-300 font-black text-xl">{striker.runs} <span className="text-xs text-white/80">({striker.balls})</span></span>
                </div>
              )}
              {nonStriker && (
                <div className="flex items-center justify-between text-xs font-bold uppercase opacity-80 mt-0.5">
                  <span>{nonStriker.name}</span>
                  <span>{nonStriker.runs} ({nonStriker.balls})</span>
                </div>
              )}
            </div>
            <div className="bg-[#4c0519] text-white px-6 flex flex-col justify-center min-w-[240px] shrink-0 border-l-2 border-rose-900">
              {currentBowler && (
                <div className="flex items-center justify-between text-sm font-black uppercase mb-1">
                  <span>{currentBowler.name}</span>
                  <span className="text-pink-400">{currentBowler.wickets}-{currentBowler.runsConceded} ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
                </div>
              )}
              <ColoredBallDots balls={matchDetails.recentBalls} />
            </div>
            <div className="bg-gradient-to-l from-rose-700 to-pink-600 text-white px-6 flex items-center justify-center font-black text-xl uppercase tracking-wider shrink-0 min-w-[170px] shadow-lg">
              {bowlingTeam.fullName || bowlingTeam.shortName}
            </div>
          </div>
        </motion.div>
      ) : layoutStyle === 'sa20-gold' ? (
        /* ------------------------------------------------------------------ */
        /* 3C. SA20 GREEN & GOLD DIAGONAL SLASH BAR                          */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1260px] flex items-stretch h-[76px] font-sans pointer-events-auto shadow-2xl rounded-xl overflow-hidden border-2 border-yellow-400 bg-[#052e16]"
        >
          <div className="bg-green-700 text-white px-6 flex items-center justify-center font-black text-xl uppercase tracking-wider shrink-0 -skew-x-12 min-w-[170px]">
            <span className="skew-x-12">{battingTeam.shortName}</span>
          </div>
          <div className="bg-slate-900 text-yellow-400 px-6 flex flex-col items-center justify-center min-w-[150px] shrink-0 border-x-2 border-yellow-400">
            <span className="font-black text-3xl leading-none">{battingTeam.score}-{battingTeam.wickets}</span>
            <span className="text-xs font-bold text-white mt-0.5">{oversFormatted} OVS</span>
          </div>
          <div className="bg-[#14532d] text-white flex-1 px-6 flex flex-col justify-center">
            {striker && (
              <div className="flex items-center justify-between text-base font-black uppercase">
                <span>&gt; {striker.name}</span>
                <span className="text-yellow-300 text-xl font-black">{striker.runs} <span className="text-xs text-white">({striker.balls})</span></span>
              </div>
            )}
            {nonStriker && (
              <div className="flex items-center justify-between text-xs font-bold uppercase opacity-80">
                <span>{nonStriker.name}</span>
                <span>{nonStriker.runs} ({nonStriker.balls})</span>
              </div>
            )}
          </div>
          <div className="bg-[#052e16] text-white px-6 flex flex-col justify-center min-w-[240px] shrink-0 border-l border-green-800">
            {currentBowler && (
              <div className="flex items-center justify-between text-sm font-black uppercase mb-1">
                <span>{currentBowler.name}</span>
                <span className="text-yellow-400">{currentBowler.wickets}-{currentBowler.runsConceded} ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
              </div>
            )}
            <ColoredBallDots balls={matchDetails.recentBalls} />
          </div>
          <div className="bg-green-700 text-white px-6 flex items-center justify-center font-black text-xl uppercase tracking-wider shrink-0 -skew-x-12 min-w-[170px]">
            <span className="skew-x-12">{bowlingTeam.shortName}</span>
          </div>
        </motion.div>
      ) : layoutStyle === 'bbl-black-carbon' ? (
        /* ------------------------------------------------------------------ */
        /* 3D. BBL CARBON FIBER BLACK & NEON LIME BAR                         */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1260px] flex items-stretch h-[76px] font-mono pointer-events-auto shadow-2xl rounded-none border-2 border-lime-400 bg-black"
        >
          <div className="bg-lime-400 text-black px-6 flex items-center justify-center font-black text-2xl uppercase tracking-tighter shrink-0 min-w-[170px]">
            {battingTeam.shortName}
          </div>
          <div className="bg-neutral-900 text-lime-400 px-6 flex flex-col items-center justify-center min-w-[160px] shrink-0 border-r-2 border-lime-400">
            <span className="font-black text-3xl leading-none">{battingTeam.score}-{battingTeam.wickets}</span>
            <span className="text-xs font-bold text-white mt-0.5">{oversFormatted} OVERS</span>
          </div>
          <div className="bg-neutral-950 text-white flex-1 px-6 flex flex-col justify-center border-r-2 border-neutral-800">
            {striker && (
              <div className="flex items-center justify-between text-base font-black uppercase">
                <span className="text-lime-400">&gt; {striker.name}</span>
                <span className="text-lime-400 font-black text-xl">{striker.runs} ({striker.balls})</span>
              </div>
            )}
            {nonStriker && (
              <div className="flex items-center justify-between text-xs font-bold uppercase text-neutral-400">
                <span>{nonStriker.name}</span>
                <span>{nonStriker.runs} ({nonStriker.balls})</span>
              </div>
            )}
          </div>
          <div className="bg-black text-white px-6 flex flex-col justify-center min-w-[240px] shrink-0 border-r-2 border-neutral-800">
            {currentBowler && (
              <div className="flex items-center justify-between text-sm font-black uppercase mb-1">
                <span className="text-lime-400">{currentBowler.name}</span>
                <span className="text-white">{currentBowler.wickets}-{currentBowler.runsConceded} ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
              </div>
            )}
            <ColoredBallDots balls={matchDetails.recentBalls} />
          </div>
          <div className="bg-lime-400 text-black px-6 flex items-center justify-center font-black text-2xl uppercase tracking-tighter shrink-0 min-w-[170px]">
            {bowlingTeam.shortName}
          </div>
        </motion.div>
      ) : layoutStyle === 'cricfusion-glass' ? (
        /* ------------------------------------------------------------------ */
        /* 3E. CRICFUSION FROSTED GLASSMORPHISM BOX                           */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          className="w-full max-w-[1260px] flex items-stretch h-[76px] font-sans pointer-events-auto backdrop-blur-xl bg-slate-950/80 rounded-2xl shadow-2xl border-2 border-pink-500 overflow-hidden"
        >
          <div className="bg-pink-600/40 text-white px-6 flex items-center justify-center font-black text-xl uppercase tracking-wider shrink-0 min-w-[170px] backdrop-blur-md">
            {battingTeam.fullName || battingTeam.shortName}
          </div>
          <div className="bg-white/90 text-pink-950 px-6 flex flex-col items-center justify-center min-w-[160px] shrink-0 border-r border-white/20">
            <span className="font-black text-3xl leading-none text-pink-600">{battingTeam.score}-{battingTeam.wickets}</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5">{oversFormatted} OVERS</span>
          </div>
          <div className="bg-slate-900/60 text-white flex-1 px-6 flex flex-col justify-center border-r border-white/10">
            {striker && (
              <div className="flex items-center justify-between text-base font-black uppercase">
                <span className="text-pink-400">✦ {striker.name}</span>
                <span className="text-pink-300 text-xl font-black">{striker.runs} <span className="text-xs text-white">({striker.balls})</span></span>
              </div>
            )}
            {nonStriker && (
              <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-300">
                <span>{nonStriker.name}</span>
                <span>{nonStriker.runs} ({nonStriker.balls})</span>
              </div>
            )}
          </div>
          <div className="bg-slate-950/70 text-white px-6 flex flex-col justify-center min-w-[240px] shrink-0">
            {currentBowler && (
              <div className="flex items-center justify-between text-sm font-black uppercase mb-1">
                <span>{currentBowler.name}</span>
                <span className="text-pink-400">{currentBowler.wickets}-{currentBowler.runsConceded} ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
              </div>
            )}
            <ColoredBallDots balls={matchDetails.recentBalls} />
          </div>
          <div className="bg-pink-600/40 text-white px-6 flex items-center justify-center font-black text-xl uppercase tracking-wider shrink-0 min-w-[170px] backdrop-blur-md">
            {bowlingTeam.fullName || bowlingTeam.shortName}
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
                    matchDetails.recentBalls.slice(-6).map((ball, idx) => {
                      const isDot = ball === '0' || ball === '.';
                      const is4 = ball === '4';
                      const is6 = ball === '6';
                      const isW = ball === 'W';
                      const bg = is6
                        ? 'bg-[#FF207C] text-white border-transparent'
                        : is4
                        ? 'bg-[#FFDC35] text-slate-950 font-black border-transparent'
                        : isW
                        ? 'bg-red-600 text-white border-transparent'
                        : isDot
                        ? 'bg-[#0a1f12] text-[#27E64B] border border-[#27E64B]/50'
                        : 'bg-white text-slate-900 border-slate-900';

                      return (
                        <span key={idx} className={`w-5 h-5 rounded-full border flex items-center justify-center font-black text-[10px] ${bg}`}>
                          {isDot ? <SustainabilityTreeIcon size={12} color="#27E64B" /> : ball}
                        </span>
                      );
                    })
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
          {Boolean(matchDetails.targetRuns && matchDetails.targetRuns > 0) && (
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
                    const isDot = ball === '0' || ball === '.';
                    const is4 = ball === '4';
                    const is6 = ball === '6';
                    const isW = ball === 'W';
                    return (
                      <span
                        key={idx}
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shadow-sm ${
                          is6
                            ? 'bg-[#FF207C] text-white'
                            : is4
                            ? 'bg-[#FFDC35] text-slate-950'
                            : isW
                            ? 'bg-red-600 text-white'
                            : isDot
                            ? 'bg-[#0a1f12] text-[#27E64B] border border-[#27E64B]/40'
                            : 'bg-[#20003b] text-white'
                        }`}
                      >
                        {isDot ? <SustainabilityTreeIcon size={12} color="#27E64B" /> : ball}
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
          {Boolean(matchDetails.targetRuns && matchDetails.targetRuns > 0) && (
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
          {Boolean(matchDetails.targetRuns && matchDetails.targetRuns > 0) && (
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
        /* 3F. IPL 2025 KITE-LIKE IGNITION SCOREBUG                           */
        /* ------------------------------------------------------------------ */
        <motion.div
          initial={{ scale: 0.84, opacity: 0, y: 30, filter: 'brightness(2.6) drop-shadow(0 0 35px #0570F0)' }}
          animate={{ scale: 1, opacity: 1, y: 0, filter: 'brightness(1) drop-shadow(0 8px 24px rgba(5, 112, 240, 0.45))' }}
          exit={{ scale: 0.88, opacity: 0, filter: 'brightness(0.6)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto relative select-none font-condensed"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {/* Outer glowing container with kite shape drop shadow */}
          <div
            className="relative"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(5, 112, 240, 0.8)) drop-shadow(0 4px 14px rgba(0,0,0,0.85))',
            }}
          >
            {/* 2px glowing Blue Fire (#0570F0) accent border along kite perimeter */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%)',
                background: 'linear-gradient(135deg, #0570F0 0%, #00F2FE 40%, rgba(5, 112, 240, 0.5) 75%, transparent 100%)',
              }}
            />

            {/* Glowing Accent Top Line (2px Blue Fire #0570F0) */}
            <div
              className="absolute top-0 left-0 right-[5%] h-[2px] z-20 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #0570F0 0%, #00F2FE 45%, #0570F0 80%, transparent 100%)',
                boxShadow: '0 0 10px #0570F0, 0 0 4px #00F2FE',
              }}
            />

            {/* Glowing Accent Left Edge (2px Blue Fire #0570F0) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                clipPath: 'polygon(0% 0%, 5% 50%, 0% 100%, 1.8% 100%, 6.8% 50%, 1.8% 0%)',
                background: '#0570F0',
                boxShadow: '0 0 12px #0570F0',
              }}
            />

            {/* Main body of the kite shape with dynamic team color linear gradient */}
            <div
              className="relative flex items-center h-[76px] px-8 pl-12 pr-14 overflow-hidden"
              style={{
                clipPath: 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%)',
                background: `linear-gradient(110deg, ${battingTeam.primaryColor || teamA.primaryColor || '#00529B'} 0%, ${hexToRgba(battingTeam.primaryColor || teamA.primaryColor || '#00529B', 0.65)} 35%, rgba(6, 12, 28, 0.92) 70%, rgba(3, 7, 18, 0.98) 100%)`,
              }}
            >
              {/* Subtle angled ignition sheen texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(120deg, transparent, transparent 15px, rgba(255,255,255,0.08) 15px, rgba(255,255,255,0.08) 17px)',
                }}
              />

              {/* Horizontal elements layout */}
              <div className="relative z-10 flex items-center gap-6 sm:gap-8 h-full">
                {/* 1. Team Shortname */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {battingTeam.logoUrl && (
                    <img
                      src={battingTeam.logoUrl}
                      alt={battingTeam.shortName}
                      className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    />
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="font-black text-3xl uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-none">
                      {battingTeam.shortName || 'BAT'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00F2FE] drop-shadow leading-none mt-1">
                      v {bowlingTeam.shortName || 'BOWL'}
                    </span>
                  </div>
                </div>

                {/* Angled Divider */}
                <div className="w-[1.5px] h-9 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent skew-x-[-15deg] shrink-0" />

                {/* 2. Score (Runs-Wickets) — LARGEST and BRIGHTEST element, colored #FFFFFF */}
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="font-black text-5xl text-[#FFFFFF] drop-shadow-[0_2px_14px_rgba(255,255,255,0.7)] tracking-tight leading-none">
                    {battingTeam.score}
                  </span>
                  <span className="font-black text-3xl text-white/70 leading-none">
                    -{battingTeam.wickets}
                  </span>
                </div>

                {/* Angled Divider */}
                <div className="w-[1.5px] h-9 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent skew-x-[-15deg] shrink-0" />

                {/* 3. Overs */}
                <div className="flex flex-col justify-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    OVERS
                  </span>
                  <span className="font-black text-2xl text-white tracking-wide leading-none mt-0.5">
                    {oversFormatted}
                    <span className="text-xs font-semibold text-slate-400 ml-1">
                      /{matchDetails.totalOvers || 20}
                    </span>
                  </span>
                </div>

                {/* Angled Divider */}
                <div className="w-[1.5px] h-9 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent skew-x-[-15deg] shrink-0" />

                {/* 4. CRR (and RRR if target is set) */}
                <div className="flex flex-col justify-center min-w-[70px] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                      CRR
                    </span>
                    <span className="font-black text-xl text-[#00F2FE] drop-shadow leading-none">
                      {crr}
                    </span>
                  </div>
                  {Boolean(matchDetails.targetRuns && matchDetails.targetRuns > 0) && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider leading-none">
                        RRR
                      </span>
                      <span className="font-black text-sm text-amber-300 leading-none">
                        {rrr}
                      </span>
                    </div>
                  )}
                </div>

                {/* 5. Striker & Bowler Live Details */}
                {(striker || currentBowler) && (
                  <>
                    <div className="hidden md:block w-[1.5px] h-9 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent skew-x-[-15deg] shrink-0" />
                    <div className="hidden md:flex items-center gap-4 text-xs">
                      {striker && (
                        <div className="flex flex-col justify-center">
                          <span className="text-slate-300 font-bold uppercase truncate max-w-[120px] flex items-center gap-1 text-[11px] leading-tight">
                            <span className="text-[#0570F0] font-black">▶</span> {striker.name}
                          </span>
                          <span className="font-black text-sm text-white leading-tight">
                            {striker.runs}{' '}
                            <span className="text-[10px] font-normal text-slate-400">({striker.balls}b)</span>
                          </span>
                        </div>
                      )}
                      {currentBowler && (
                        <div className="flex flex-col justify-center">
                          <span className="text-slate-300 font-bold uppercase truncate max-w-[120px] text-[11px] leading-tight">
                            {currentBowler.name}
                          </span>
                          <span className="font-black text-sm text-[#00F2FE] leading-tight">
                            {currentBowler.wickets}-{currentBowler.runsConceded}{' '}
                            <span className="text-[10px] font-normal text-slate-400">
                              ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
