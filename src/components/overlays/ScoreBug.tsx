import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { hexToRgba } from '../../theme/presetThemes';
import { SustainabilityTreeIcon } from './OverProgressDots';

export interface ScoreBugProps {
  className?: string;
}

export const ScoreBug: React.FC<ScoreBugProps> = ({ className = '' }) => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  const oversFormatted = `${battingTeam.overs}.${battingTeam.balls}`;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(1) : '0.0';
  const rrr = matchDetails.targetRuns && totalBalls < 120
    ? Math.max(0, (matchDetails.targetRuns - battingTeam.score) / Math.max(1, (120 - totalBalls) / 6)).toFixed(2)
    : '0.00';

  const primaryColor = battingTeam?.primaryColor || teamA.primaryColor || '#00529B';

  return (
    <motion.div
      initial={{ scale: 0.84, opacity: 0, y: 30, filter: 'brightness(2.6) drop-shadow(0 0 35px #0570F0)' }}
      animate={{ scale: 1, opacity: 1, y: 0, filter: 'brightness(1) drop-shadow(0 8px 24px rgba(5, 112, 240, 0.45))' }}
      exit={{ scale: 0.88, opacity: 0, filter: 'brightness(0.6)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto relative select-none font-condensed ${className}`}
      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
    >
      {/* Outer container with glow */}
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
            background: `linear-gradient(110deg, ${primaryColor} 0%, ${hexToRgba(primaryColor, 0.65)} 35%, rgba(6, 12, 28, 0.92) 70%, rgba(3, 7, 18, 0.98) 100%)`,
          }}
        >
          {/* Subtle angled ignition sheen texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'repeating-linear-gradient(120deg, transparent, transparent 15px, rgba(255,255,255,0.08) 15px, rgba(255,255,255,0.08) 17px)',
            }}
          />

          {/* Horizontal elements layout: Team Shortname, Score, Overs, and CRR */}
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

            {/* 5. Striker & Bowler Details */}
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

            {/* 6. Recent Balls Tracker with Sustainability Dot Ball */}
            {matchDetails.recentBalls && matchDetails.recentBalls.length > 0 && (
              <>
                <div className="hidden lg:block w-[1.5px] h-9 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent skew-x-[-15deg] shrink-0" />
                <div className="hidden lg:flex flex-col justify-center shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    THIS OVER
                  </span>
                  <div className="flex items-center gap-1">
                    {matchDetails.recentBalls.slice(-6).map((ball, idx) => {
                      const isDot = ball === '0' || ball === '.';
                      const is4 = ball === '4';
                      const is6 = ball === '6';
                      const isW = ball.toUpperCase().includes('W') && !ball.toUpperCase().includes('WD');
                      const bg = is6
                        ? 'bg-[#FF207C] text-white shadow-[0_0_8px_rgba(255,32,124,0.6)]'
                        : is4
                        ? 'bg-[#FFDC35] text-slate-950 font-black shadow-[0_0_8px_rgba(255,220,53,0.5)]'
                        : isW
                        ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]'
                        : isDot
                        ? 'bg-[#0a1f12] text-[#27E64B] border border-[#27E64B]/50 shadow-[0_0_6px_rgba(39,230,75,0.4)]'
                        : 'bg-slate-800 text-slate-200';

                      return (
                        <span
                          key={idx}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${bg}`}
                        >
                          {isDot ? <SustainabilityTreeIcon size={12} color="#27E64B" /> : ball}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreBug;
