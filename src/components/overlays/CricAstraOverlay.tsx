import React, { useState, useEffect, useMemo } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface CricAstraOverlayProps {
  className?: string;
}

export const CricAstraOverlay: React.FC<CricAstraOverlayProps> = ({ className = '' }) => {
  const { teamA, teamB, battingTeamId, matchDetails, activeAnimation } = useBroadcastStore();

  // Load Russo One Font dynamically
  useEffect(() => {
    const existing = document.querySelector('link[data-cricastra-font="true"]');
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Russo+One&display=swap';
      link.dataset.cricastraFont = 'true';
      document.head.appendChild(link);
    }
  }, []);

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

  // Team colors
  const battingColor = battingTeam.primaryColor || '#008bff';
  const bowlingColor = bowlingTeam.primaryColor || '#e51970';

  // Ticker Slides
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const totalFours = useMemo(
    () => battingTeam.batters.reduce((acc, b) => acc + (b.fours || 0), 0),
    [battingTeam.batters]
  );
  const totalSixes = useMemo(
    () => battingTeam.batters.reduce((acc, b) => acc + (b.sixes || 0), 0),
    [battingTeam.batters]
  );

  const tickerSlides = useMemo(() => {
    const slides: string[] = [];
    if (isSecondInnings && target > 0) {
      slides.push(`NEED ${runsNeeded} FROM ${ballsRemaining} BALLS`);
      slides.push(`CRR ${crr}  |  RRR ${rrr}`);
      slides.push(`TARGET: ${target}`);
    } else {
      slides.push(`RUN RATE ${crr}`);
      if (matchDetails.tossWinner) {
        slides.push(`TOSS: ${matchDetails.tossWinner} (${matchDetails.tossDecision || 'BAT'})`);
      }
      slides.push(`BOUNDARIES: 4s [${totalFours}]  6s [${totalSixes}]`);
      if (battingTeam.overs >= 2) {
        const proj = Math.round(Number(crr) * (matchDetails.totalOvers || 20));
        slides.push(`PROJECTED SCORE: ${proj}`);
      }
    }
    if (matchDetails.matchNo) {
      slides.push(`MATCH NO. ${matchDetails.matchNo}`);
    }
    return slides.length > 0 ? slides : [`RUN RATE ${crr}`];
  }, [isSecondInnings, target, runsNeeded, ballsRemaining, crr, rrr, matchDetails, totalFours, totalSixes, battingTeam.overs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % tickerSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerSlides.length]);

  // Current over balls (pad to 6)
  const recentBalls = matchDetails.recentBalls || [];
  const currentOverBalls = recentBalls.slice(-6);
  const ballsPerOver = matchDetails.ballsPerOver || 6;
  const paddedBalls: (string | null)[] = [...currentOverBalls];
  while (paddedBalls.length < ballsPerOver) {
    paddedBalls.push(null);
  }

  // Active Celebration Overlay
  const isCelebration = Boolean(activeAnimation);

  return (
    <div
      className={`cricastra-container relative select-none font-['Russo_One',sans-serif] ${className}`}
      style={{
        width: '1920px',
        minWidth: '1920px',
        transformOrigin: 'bottom center',
        // CSS variables corresponding to CricAstra Theme 18
        ['--batting-color' as any]: battingColor,
        ['--bowling-color' as any]: bowlingColor,
        ['--edge' as any]: `color-mix(in srgb, ${battingColor} 65%, white)`,
        ['--glow' as any]: battingColor,
        ['--scoreboard-height' as any]: '120px',
      }}
    >
      {/* Celebration Takeover */}
      {isCelebration && (
        <div className="absolute -top-32 inset-x-0 flex justify-center z-50 animate-bounce">
          <div
            className="px-12 py-3 rounded-xl border-2 flex items-center gap-6 shadow-2xl backdrop-blur-md"
            style={{
              background: 'linear-gradient(145deg, #030b19, rgba(0, 123, 255, 0.4))',
              borderColor: battingColor,
              boxShadow: `0 0 30px ${battingColor}`,
            }}
          >
            <span className="text-4xl text-white font-black tracking-widest uppercase">
              {activeAnimation === 'FOUR'
                ? 'FOUR! 4 RUNS'
                : activeAnimation === 'SIX'
                ? 'MAXIMUM! 6 RUNS'
                : activeAnimation === 'WICKET'
                ? 'WICKET TAKEN!'
                : String(activeAnimation).replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid Scoreboard */}
      <div
        className="grid items-center gap-1 w-full text-white uppercase"
        style={{
          gridTemplateColumns: '410px 280px 280px 260px minmax(0, 1fr)',
          height: '140px',
          padding: '10px 6px',
          boxSizing: 'border-box',
          filter: `drop-shadow(0 0 4px var(--edge)) drop-shadow(0 0 10px var(--glow))`,
        }}
      >
        {/* PANEL 1: Batting Team & Score */}
        <div
          className="relative flex items-center h-[120px] px-4 overflow-hidden"
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
            background: `linear-gradient(160deg, color-mix(in srgb, ${battingColor} 45%, #020710) 0%, color-mix(in srgb, ${battingColor} 18%, #020710) 48%, #01050b 100%)`,
            borderLeft: `4px solid ${battingColor}`,
            boxShadow: `inset 0 0 12px color-mix(in srgb, ${battingColor} 70%, transparent)`,
          }}
        >
          {/* Outer glow stroke effect */}
          <div
            className="absolute inset-0 pointer-events-none -z-10"
            style={{
              clipPath:
                'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
              background: `linear-gradient(135deg, #fff 0%, var(--edge) 12%, var(--glow) 45%, var(--edge) 78%, #fff 100%)`,
            }}
          />

          {/* Team Logo / Badge */}
          <div className="flex items-center justify-center w-24 h-24 shrink-0 mr-3">
            {battingTeam.logoUrl ? (
              <img
                src={battingTeam.logoUrl}
                alt={battingTeam.shortName}
                className="w-20 h-20 object-contain drop-shadow"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-lg flex items-center justify-center font-black text-2xl tracking-wider border-2"
                style={{
                  background: `linear-gradient(135deg, ${battingColor}, #020710)`,
                  borderColor: battingColor,
                }}
              >
                {battingTeam.shortName || battingTeam.fullName.slice(0, 3)}
              </div>
            )}
          </div>

          {/* Score & Overs */}
          <div className="flex-1 min-w-0 text-center leading-none">
            <strong className="block text-[68px] font-black tracking-tight text-white drop-shadow-md">
              {battingTeam.score}-{battingTeam.wickets}
            </strong>
            <span className="block text-[22px] font-bold text-gray-200 mt-1 tracking-wider">
              {oversFormatted} / {matchDetails.totalOvers || 20} OVR
            </span>
          </div>

          {/* Powerplay Indicator */}
          <div className="absolute top-2 right-3 text-[#ffe54d] text-sm font-black px-2 py-0.5 rounded bg-black/60 border border-[#ffe54d]/40">
            P1
          </div>
        </div>

        {/* PANEL 2: Striker */}
        <div
          className={`relative flex items-center h-[120px] px-3 overflow-hidden ${
            striker.isOut ? 'opacity-50' : ''
          }`}
          style={{
            clipPath:
              'polygon(14px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 14px)',
            background: `linear-gradient(160deg, color-mix(in srgb, ${battingColor} 30%, #020710) 0%, #01050b 100%)`,
            boxShadow: `inset 0 0 8px color-mix(in srgb, ${battingColor} 40%, transparent)`,
          }}
        >
          <div className="flex flex-col justify-between h-full w-full py-2 z-10">
            <div className="flex items-center justify-between text-[22px] font-bold tracking-wide truncate">
              <span className="truncate">{striker.name}</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              {/* Bat Icon */}
              <span className="inline-flex items-center justify-center w-5 h-6 text-[#00f2ff]">
                <svg viewBox="0 0 24 32" className="w-5 h-6" fill="currentColor">
                  <g transform="rotate(28 12 16)">
                    <rect x="10.5" y="1" width="3" height="10" rx="1" />
                    <path d="M8 11h8v16a4 4 0 0 1-8 0z" />
                  </g>
                </svg>
              </span>
              <strong className="text-[52px] font-black text-white leading-none">
                {striker.runs}
              </strong>
              <span className="text-[26px] font-normal text-gray-300">({striker.balls})</span>
            </div>
          </div>
        </div>

        {/* PANEL 3: Non-Striker */}
        <div
          className={`relative flex items-center h-[120px] px-3 overflow-hidden ${
            nonStriker.isOut ? 'opacity-50' : ''
          }`}
          style={{
            clipPath:
              'polygon(14px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 14px)',
            background: `linear-gradient(160deg, color-mix(in srgb, ${battingColor} 30%, #020710) 0%, #01050b 100%)`,
            boxShadow: `inset 0 0 8px color-mix(in srgb, ${battingColor} 40%, transparent)`,
          }}
        >
          <div className="flex flex-col justify-between h-full w-full py-2 z-10">
            <div className="flex items-center justify-between text-[22px] font-bold tracking-wide truncate">
              <span className="truncate">{nonStriker.name}</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <strong className="text-[52px] font-black text-white leading-none">
                {nonStriker.runs}
              </strong>
              <span className="text-[26px] font-normal text-gray-300">({nonStriker.balls})</span>
            </div>
          </div>
        </div>

        {/* PANEL 4: Animated Ticker / Message */}
        <div
          className="relative flex items-center justify-center h-[120px] px-4 overflow-hidden text-center"
          style={{
            clipPath:
              'polygon(14px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 14px)',
            background: 'linear-gradient(155deg, #101724, #000000 70%)',
            borderTop: `2px solid color-mix(in srgb, ${battingColor} 70%, white)`,
            borderBottom: `2px solid color-mix(in srgb, ${bowlingColor} 70%, white)`,
          }}
        >
          <div className="w-full">
            <span className="text-[20px] font-black tracking-wide text-cyan-300 transition-all duration-500 block leading-tight">
              {tickerSlides[currentSlideIndex] || `RUN RATE ${crr}`}
            </span>
          </div>
        </div>

        {/* PANEL 5: Current Bowler & Over Track */}
        <div
          className="relative flex items-center h-[120px] px-4 overflow-hidden gap-4"
          style={{
            clipPath:
              'polygon(14px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 14px)',
            background: `linear-gradient(160deg, color-mix(in srgb, ${bowlingColor} 45%, #08030a), color-mix(in srgb, ${bowlingColor} 24%, #08030a) 60%, #08030a)`,
            boxShadow: `inset 0 0 10px color-mix(in srgb, ${bowlingColor} 50%, transparent)`,
            borderRight: `4px solid ${bowlingColor}`,
          }}
        >
          {/* Bowler Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-around h-full py-1">
            <div className="flex items-baseline justify-between">
              <span className="text-[24px] font-bold tracking-wide truncate max-w-[220px]">
                {currentBowler.name}
              </span>
              <div className="text-[28px] font-black tracking-wider text-pink-300">
                <span>
                  {currentBowler.wickets}-{currentBowler.runsConceded}
                </span>
                <span className="text-[20px] text-gray-300 ml-1 font-normal">
                  ({currentBowler.overs}.{currentBowler.ballsInCurrentOver})
                </span>
              </div>
            </div>

            {/* Over Track Horizontal Strip */}
            <div className="flex items-center gap-1.5 overflow-hidden py-1">
              {paddedBalls.map((ball, idx) => {
                if (!ball) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="w-9 h-9 rounded flex items-center justify-center border-2 border-white/20 bg-black/40"
                    />
                  );
                }

                const isDot = ball === '0' || ball === '.';
                const isFour = ball === '4';
                const isSix = ball === '6';
                const isWicket = ball.toUpperCase().includes('W') && !ball.toUpperCase().includes('WD');
                const isWide = ball.toUpperCase().includes('WD');
                const isNoBall = ball.toUpperCase().includes('NB');

                return (
                  <div
                    key={`ball-${idx}`}
                    className={`w-9 h-9 rounded flex items-center justify-center font-black text-lg border-2 ${
                      isDot
                        ? 'bg-white text-black border-white'
                        : isFour
                        ? 'text-white border-cyan-400 bg-gradient-to-r from-emerald-400 to-blue-600'
                        : isSix
                        ? 'text-white border-yellow-300 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500'
                        : isWicket
                        ? 'text-white border-red-500 bg-red-600'
                        : isWide || isNoBall
                        ? 'bg-white text-black border-pink-500 text-xs flex flex-col leading-none font-bold'
                        : 'bg-white text-black border-white'
                    }`}
                  >
                    {isDot ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-black" />
                    ) : (
                      <span>{ball}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bowling Team Logo */}
          <div className="flex items-center justify-center w-20 h-20 shrink-0">
            {bowlingTeam.logoUrl ? (
              <img
                src={bowlingTeam.logoUrl}
                alt={bowlingTeam.shortName}
                className="w-16 h-16 object-contain drop-shadow"
              />
            ) : (
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center font-black text-xl tracking-wider border-2"
                style={{
                  background: `linear-gradient(135deg, ${bowlingColor}, #020710)`,
                  borderColor: bowlingColor,
                }}
              >
                {bowlingTeam.shortName || bowlingTeam.fullName.slice(0, 3)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
