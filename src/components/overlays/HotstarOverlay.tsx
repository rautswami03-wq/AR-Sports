import React, { useState, useEffect, useMemo } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface HotstarOverlayProps {
  className?: string;
}

export const HotstarOverlay: React.FC<HotstarOverlayProps> = ({ className = '' }) => {
  const { teamA, teamB, battingTeamId, matchDetails, activeAnimation } = useBroadcastStore();

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0] || {
    id: 'b1',
    name: 'Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
  };

  const nonStriker =
    battingTeam.batters.find((b) => !b.isOut && !b.isStriker) ||
    battingTeam.batters[1] || {
      id: 'b2',
      name: 'Non-Striker',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
    };

  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0] || {
    id: 'bw1',
    name: 'Bowler',
    overs: 0,
    ballsInCurrentOver: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    economy: 0,
  };

  const oversFormatted = `${battingTeam.overs}.${battingTeam.balls}`;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const totalMaxBalls = (matchDetails.totalOvers || 20) * 6;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';

  const isSecondInnings = matchDetails.currentInnings === 2 || Boolean(matchDetails.targetRuns);
  const target = matchDetails.targetRuns || 0;
  const runsNeeded = Math.max(0, target - battingTeam.score);
  const ballsRemaining = Math.max(0, totalMaxBalls - totalBalls);
  const rrr =
    isSecondInnings && target > 0 && ballsRemaining > 0
      ? ((runsNeeded / ballsRemaining) * 6).toFixed(2)
      : '0.00';

  const battingColor = battingTeam.primaryColor || '#004BA0';
  const bowlingColor = bowlingTeam.primaryColor || '#D1AB3E';

  // Over track
  const recentBalls = matchDetails.recentBalls || [];
  const currentOverBalls = recentBalls.slice(-6);
  const ballsPerOver = matchDetails.ballsPerOver || 6;
  const paddedBalls: (string | null)[] = [...currentOverBalls];
  while (paddedBalls.length < ballsPerOver) {
    paddedBalls.push(null);
  }

  // Ticker text
  const [toggleTicker, setToggleTicker] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setToggleTicker((prev) => !prev), 4000);
    return () => clearInterval(timer);
  }, []);

  const isCelebration = Boolean(activeAnimation);

  return (
    <div
      className={`hotstar-overlay select-none relative font-sans ${className}`}
      style={{
        width: '1920px',
        minWidth: '1920px',
        height: '120px',
        color: '#ffffff',
        transformOrigin: 'bottom center',
      }}
    >
      {/* Celebration Takeover */}
      {isCelebration && (
        <div className="absolute -top-32 inset-x-0 flex justify-center z-50">
          <div className="px-16 py-4 bg-[#0a003e] text-white font-black text-5xl tracking-widest uppercase rounded-2xl border-4 border-[#ff009d] shadow-[0_0_50px_#ff009d] flex items-center gap-6 animate-pulse">
            <span className="text-yellow-400">★</span>
            <span>
              {activeAnimation === 'FOUR'
                ? 'FOUR'
                : activeAnimation === 'SIX'
                ? 'SIX'
                : activeAnimation === 'WICKET'
                ? 'WICKET'
                : String(activeAnimation).replace('_', ' ')}
            </span>
            <span className="text-yellow-400">★</span>
          </div>
        </div>
      )}

      {/* Main Scoreboard Bar */}
      <div className="flex items-center w-full h-[120px] bg-[#0c1222]/95 backdrop-blur-md border-t-2 border-b-2 border-white/20 shadow-2xl overflow-hidden">
        {/* Left Section: Team Badge & Score Box */}
        <div
          className="flex items-center h-full min-w-[430px] max-w-[430px] relative px-4 z-10"
          style={{
            background: `linear-gradient(135deg, ${battingColor} 0%, #030814 100%)`,
          }}
        >
          {/* Team Logo / Badge */}
          <div className="flex items-center justify-center w-24 h-24 shrink-0">
            {battingTeam.logoUrl ? (
              <img
                src={battingTeam.logoUrl}
                alt={battingTeam.shortName}
                className="w-20 h-20 object-contain drop-shadow"
              />
            ) : (
              <span className="text-3xl font-black tracking-widest text-white drop-shadow">
                {battingTeam.shortName || battingTeam.fullName.slice(0, 3)}
              </span>
            )}
          </div>

          {/* White High-Contrast Score Box */}
          <div className="flex items-center justify-center h-[90%] w-[230px] ml-auto bg-white rounded-lg shadow-xl px-3 relative overflow-hidden">
            {/* Pink Accent Line */}
            <div className="absolute left-0 inset-y-0 w-2 bg-[#ff009d]" />

            {/* Powerplay Badge */}
            <div className="absolute top-1 right-2 bg-[#05006b] text-[#00f2ff] text-xs font-black px-1.5 py-0.5 rounded">
              P1
            </div>

            <div className="flex flex-col items-center justify-center w-full pl-2">
              <span className="text-[54px] font-black leading-none text-black tracking-tight">
                {battingTeam.score}-{battingTeam.wickets}
              </span>
              <span className="text-[22px] font-extrabold text-[#dc005f] leading-none mt-1 tracking-normal">
                {oversFormatted} / {matchDetails.totalOvers || 20}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Section: Batters (Striker & Non-Striker) */}
        <div className="flex items-center justify-around h-full min-w-[580px] max-w-[580px] px-4 bg-gradient-to-r from-[#0c1222] via-[#141d33] to-[#0c1222]">
          {/* Striker */}
          <div className="flex items-center gap-3 w-1/2 pr-2">
            {/* White Strike Bat Circle */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-black -rotate-45" fill="currentColor">
                <path d="M7 2v10l2 2 8-8-2-2L7 2z" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[20px] font-bold text-gray-100 truncate uppercase">
                {striker.name}
              </span>
              <div className="flex items-baseline gap-1">
                <strong className="text-[28px] font-black text-white">{striker.runs}</strong>
                <span className="text-[18px] text-gray-400">({striker.balls})</span>
              </div>
            </div>
          </div>

          <div className="w-px h-16 bg-white/20" />

          {/* Non-Striker */}
          <div className="flex items-center gap-3 w-1/2 pl-4">
            <div className="flex flex-col min-w-0">
              <span className="text-[20px] font-bold text-gray-300 truncate uppercase">
                {nonStriker.name}
              </span>
              <div className="flex items-baseline gap-1">
                <strong className="text-[28px] font-black text-gray-200">{nonStriker.runs}</strong>
                <span className="text-[18px] text-gray-400">({nonStriker.balls})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Target / RRR Box */}
        <div className="flex items-center justify-center h-full min-w-[320px] max-w-[320px] px-3 bg-black">
          {isSecondInnings && target > 0 ? (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                {toggleTicker ? 'TARGET' : 'TO WIN'}
              </span>
              <strong className="text-2xl font-black text-white tracking-wide">
                {toggleTicker
                  ? `${target} RUNS`
                  : `${runsNeeded} FROM ${ballsRemaining} B`}
              </strong>
              <span className="text-xs font-semibold text-cyan-400 mt-0.5">
                REQ. RR {rrr}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                CURRENT RUN RATE
              </span>
              <strong className="text-3xl font-black text-white tracking-wide">
                {crr}
              </strong>
              <span className="text-xs font-semibold text-amber-400 mt-0.5">
                {matchDetails.tossWinner ? `TOSS: ${matchDetails.tossWinner}` : 'LIVE'}
              </span>
            </div>
          )}
        </div>

        {/* Right Section: Bowler & Over Track */}
        <div className="flex items-center justify-between h-full flex-1 px-6 bg-gradient-to-r from-[#141d33] to-[#0c1222]">
          <div className="flex flex-col justify-center gap-1 min-w-[200px]">
            <span className="text-[22px] font-bold uppercase text-white truncate max-w-[180px]">
              {currentBowler.name}
            </span>
            <div className="text-[26px] font-black text-cyan-300">
              <span>
                {currentBowler.wickets}-{currentBowler.runsConceded}
              </span>
              <span className="text-[18px] text-gray-300 font-normal ml-1">
                ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})
              </span>
            </div>
          </div>

          {/* Over Track (Circles / Rounded Rects) */}
          <div className="flex items-center gap-2">
            {paddedBalls.map((ball, idx) => {
              if (!ball) {
                return (
                  <div
                    key={`hotstar-empty-${idx}`}
                    className="w-9 h-9 rounded-full border-2 border-white/20 bg-black/40"
                  />
                );
              }

              const isDot = ball === '0' || ball === '.';
              const isFour = ball === '4';
              const isSix = ball === '6';
              const isWicket = ball.toUpperCase().includes('W') && !ball.toUpperCase().includes('WD');

              return (
                <div
                  key={`hotstar-ball-${idx}`}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 ${
                    isDot
                      ? 'bg-white text-black border-white'
                      : isFour
                      ? 'bg-blue-600 text-white border-blue-400'
                      : isSix
                      ? 'bg-purple-600 text-white border-purple-400'
                      : isWicket
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-white text-black border-white'
                  }`}
                >
                  {isDot ? <span className="w-2.5 h-2.5 rounded-full bg-black" /> : ball}
                </div>
              );
            })}
          </div>

          {/* Bowling Team Badge */}
          <div className="flex items-center justify-center w-16 h-16 ml-4 shrink-0">
            {bowlingTeam.logoUrl ? (
              <img
                src={bowlingTeam.logoUrl}
                alt={bowlingTeam.shortName}
                className="w-14 h-14 object-contain drop-shadow"
              />
            ) : (
              <span className="text-xl font-black text-white/80">
                {bowlingTeam.shortName || bowlingTeam.fullName.slice(0, 3)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
