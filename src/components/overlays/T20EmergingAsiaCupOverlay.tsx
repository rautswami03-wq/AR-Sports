import React, { useState, useEffect, useMemo } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

// -----------------------------------------------------------------------------
// SVG Isometric Grid Pattern from CricScorer Theme 9
// -----------------------------------------------------------------------------
const SVG_HEX_PATTERN = `data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='86.602' height='50' patternTransform='scale(2.5) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M-.15 6.75 21.5-5.75M-.15.238l21.65-12.5M0 6.75l-21.65-12.5M0 .238l-21.65-12.5M0 12.5v-25L21.65-25M0 12.5-21.65 0v-25L0-37.5 21.65-25V0zm86.452 44.25 21.65-12.5m-21.65 5.988 21.65-12.5m-21.65 5.988 21.65-12.5m-21.5 25.524-21.65-12.5m21.65 5.988-21.65-12.5m21.65 5.988-21.65-12.5m21.65 6.274L64.952 25m21.65 37.5v-25l21.65-12.5m-43.3 25V25l21.65-12.5 21.65 12.5v25l-21.65 12.5Zm21.5-43.25 21.65-12.5M86.452.238l21.65-12.5M86.602 6.75l-21.65-12.5M86.601.238l-21.65-12.5M86.601 12.5v-25l21.65-12.5m-21.65 37.5L64.952 0v-25l21.65-12.5 21.65 12.5V0zM43.15 31.75l21.651-12.5m-21.65 5.988 21.65-12.5m-21.65 5.988 21.65-12.5m-21.5 25.524-21.65-12.5m21.65 5.988-21.65-12.5m21.65 5.988-21.65-12.5M43.3 12.5 21.651 0M43.3 37.5v-25L64.951 0m0 25-21.65 12.5L21.651 25V0L43.3-12.5 64.951 0zm-21.65 37.5L21.651 50M43.3 87.5v-25L64.951 50m0 0v25l-21.65 12.5L21.651 75V50L43.3 37.5ZM-.15 56.75 21.5 44.25M-.15 50.238l21.65-12.5M-.15 43.726l21.65-12.5M0 56.75l-21.65-12.5M0 50.238l-21.65-12.5M0 43.726l-21.65-12.5M0 37.5-21.65 25M0 62.5v-25L21.65 25m0 0v25L0 62.5-21.65 50V25L0 12.5z' stroke-linejoin='round' stroke-linecap='round' stroke-width='1' stroke='hsla(259, 0%, 100%, 0.65)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>`;

// Luminance check
function isBright(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 160;
}

// Color shade adjustment
function adjustColor(color: string, amount: number): string {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (i) =>
        ('0' + Math.min(255, Math.max(0, parseInt(i, 16) + amount)).toString(16)).slice(-2)
      )
  );
}

export interface T20EmergingAsiaCupOverlayProps {
  className?: string;
}

export const T20EmergingAsiaCupOverlay: React.FC<T20EmergingAsiaCupOverlayProps> = ({
  className = '',
}) => {
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

  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) ||
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
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(1) : '0.0';

  const isSecondInnings = matchDetails.currentInnings === 2 || Boolean(matchDetails.targetRuns);
  const target = matchDetails.targetRuns || 0;
  const runsNeeded = Math.max(0, target - battingTeam.score);
  const ballsRemaining = Math.max(0, totalMaxBalls - totalBalls);
  const rrr =
    isSecondInnings && target > 0 && ballsRemaining > 0
      ? ((runsNeeded / ballsRemaining) * 6).toFixed(2)
      : '0.00';

  // Team Colors
  const team1Color = battingTeam?.primaryColor || '#00529B';
  const team2Color = bowlingTeam?.primaryColor || '#046A38';
  const c1Shaded = adjustColor(team1Color, 40);
  const c2Shaded = adjustColor(team2Color, 40);
  const text1Color = isBright(team1Color) ? '#000000' : '#FFFFFF';
  const text2Color = isBright(team2Color) ? '#000000' : '#FFFFFF';

  // Ticker items
  const tickerItems = useMemo(() => {
    const items: string[] = [];
    items.push(`RUN RATE: ${crr}`);
    if (isSecondInnings && target > 0) {
      items.push(`NEED ${runsNeeded} RUNS IN ${ballsRemaining} BALLS (RRR ${rrr})`);
    } else {
      const proj = Math.round(parseFloat(crr) * (matchDetails.totalOvers || 20));
      if (proj > 0) items.push(`PROJECTED SCORE: ${proj}`);
    }
    const partnershipRuns = (striker.runs || 0) + (nonStriker.runs || 0);
    const partnershipBalls = (striker.balls || 0) + (nonStriker.balls || 0);
    if (partnershipRuns > 0 || partnershipBalls > 0) {
      items.push(`PARTNERSHIP: ${partnershipRuns} (${partnershipBalls})`);
    }
    if (matchDetails.tossWinner && matchDetails.tossDecision) {
      items.push(`${matchDetails.tossWinner.toUpperCase()} CHOSE TO ${matchDetails.tossDecision.toUpperCase()}`);
    }
    if (matchDetails.tournament) {
      items.push(matchDetails.tournament.toUpperCase());
    }
    return items;
  }, [
    crr,
    isSecondInnings,
    target,
    runsNeeded,
    ballsRemaining,
    rrr,
    matchDetails.totalOvers,
    matchDetails.tossWinner,
    matchDetails.tossDecision,
    matchDetails.tournament,
    striker.runs,
    striker.balls,
    nonStriker.runs,
    nonStriker.balls,
  ]);

  const [tickerIndex, setTickerIndex] = useState(0);
  useEffect(() => {
    if (tickerItems.length <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  // Current over balls
  const recentBalls = matchDetails.recentBalls || [];
  const currentOverBalls = recentBalls.slice(-6);

  // Active Celebration Banner
  const celebrationText = useMemo(() => {
    if (activeAnimation) {
      const map: Record<string, string> = {
        FOUR: 'FOUR !',
        SIX: 'SIX !',
        WICKET: 'WICKET !',
        WIDE: 'WIDE BALL',
        NO_BALL: 'NO BALL',
        FREE_HIT: 'FREE HIT',
        FIFTY: '50 MILESTONE !',
        CENTURY: '100 CENTURY !',
      };
      return map[activeAnimation] || String(activeAnimation).replace('_', ' ');
    }
    return null;
  }, [activeAnimation]);

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: '100%',
        maxWidth: '1720px',
        height: '120px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#320073',
        fontFamily: '"Barlow Semi Condensed", "Arial Narrow", sans-serif',
        fontWeight: 700,
        textTransform: 'uppercase',
        fontSize: '24px',
        whiteSpace: 'nowrap',
        overflow: 'visible',
      }}
    >
      {/* ── Left Wing: Batters Panel ────────────────────────────────────── */}
      <div
        style={{
          width: '50%',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(120deg, #daff00 0.1%, #00ffff 50.79%)',
          borderRadius: '75px 0 0 75px',
          padding: '0 8px',
        }}
      >
        <div
          style={{
            width: '65%',
            height: '110%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            fontSize: '28px',
            borderRadius: '75px 0 0 75px',
            boxShadow: '-1px 0px 5px 1px black',
            background: '#0a003e',
            color: '#FFFFFF',
            backgroundImage: `url("${SVG_HEX_PATTERN}")`,
            paddingLeft: '2.5rem',
            paddingRight: '1rem',
          }}
        >
          {/* Striker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '50%',
            }}
          >
            <span style={{ color: '#00ffff', marginRight: '6px', fontSize: '18px' }}>▶</span>
            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 800,
                color: '#FFFFFF',
              }}
            >
              {striker.name}
            </span>
            <span style={{ fontWeight: 800, color: '#00ffff', marginLeft: '8px' }}>
              {striker.runs}
              <span style={{ fontSize: '18px', color: '#FFFFFF', opacity: 0.8, marginLeft: '4px' }}>
                ({striker.balls})
              </span>
            </span>
          </div>

          {/* Non-Striker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '50%',
              opacity: 0.65,
            }}
          >
            <span style={{ opacity: 0, marginRight: '6px', fontSize: '18px' }}>▶</span>
            <span
              style={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#FFFFFF',
              }}
            >
              {nonStriker.name}
            </span>
            <span style={{ fontWeight: 800, color: '#FFFFFF', marginLeft: '8px' }}>
              {nonStriker.runs}
              <span style={{ fontSize: '18px', opacity: 0.8, marginLeft: '4px' }}>
                ({nonStriker.balls})
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Center Score Pod (CricScorer Fixed Rounded Pill) ─────────────── */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '520px',
          height: '120px',
          padding: '4px 14px',
          color: '#FFFFFF',
          borderRadius: '75px',
          boxShadow: '1px 1px 8px 2px rgba(0,0,0,0.8)',
          zIndex: 20,
          overflow: 'hidden',
          backgroundImage: `linear-gradient(to right, ${c1Shaded} 35%, ${c2Shaded} 65%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Floating Target Badge Pill above score pod */}
        {isSecondInnings && target > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-45px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#FFFFFF',
              padding: '2px 24px',
              border: '2px solid #00ffff',
              borderRadius: '75px',
              background: '#0a003e',
              fontSize: '20px',
              fontWeight: 900,
              boxShadow: '0 0 10px rgba(0,255,255,0.7)',
              zIndex: 30,
              letterSpacing: '1px',
            }}
          >
            TARGET {target}
          </div>
        )}

        {/* Celebration Takeover */}
        {celebrationText ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '75px',
              background: '#0a003e',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 40,
              boxShadow: '0 0 12px 2px #00ffff',
              color: '#00ffff',
              fontSize: '56px',
              fontWeight: 900,
              letterSpacing: '2px',
              animation: 'pulse 1s infinite alternate',
            }}
          >
            {celebrationText}
          </div>
        ) : (
          <>
            {/* Top Score Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'baseline',
                width: '100%',
                height: '55%',
                paddingTop: '6px',
              }}
            >
              {/* Team Short Name */}
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: text1Color,
                  letterSpacing: '1px',
                }}
              >
                {battingTeam.shortName || 'BAT'}
              </div>

              {/* Score - Wickets */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '52px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                }}
              >
                <span>{battingTeam.score}</span>
                <span style={{ margin: '0 6px', opacity: 0.7 }}>-</span>
                <span>{battingTeam.wickets}</span>
              </div>

              {/* Overs */}
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: text2Color,
                }}
              >
                {oversFormatted}
                <span style={{ fontSize: '18px', opacity: 0.85, marginLeft: '2px' }}>
                  ({matchDetails.totalOvers || 20})
                </span>
              </div>
            </div>

            {/* Bottom Slider Ticker */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '40%',
                color: '#0a003e',
                fontSize: '20px',
                fontWeight: 800,
                background: 'rgba(255,255,255,0.85)',
                borderRadius: '0 0 35px 35px',
                margin: '0 -14px -4px -14px',
                padding: '2px 14px',
                letterSpacing: '0.5px',
              }}
            >
              <span>{tickerItems[tickerIndex] || `RUN RATE: ${crr}`}</span>
            </div>
          </>
        )}
      </div>

      {/* ── Right Wing: Bowler & Over Balls Panel ───────────────────────── */}
      <div
        style={{
          width: '50%',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: 'linear-gradient(290deg, #daff00 0.1%, #00ffff 50.79%)',
          borderRadius: '0 75px 75px 0',
          padding: '0 8px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '110%',
            fontSize: '28px',
            borderRadius: '0 75px 75px 0',
            boxShadow: '1px 0px 5px 1px black',
            background: '#0a003e',
            color: '#FFFFFF',
            backgroundImage: `url("${SVG_HEX_PATTERN}")`,
            paddingLeft: '280px',
            paddingRight: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Bowler Details */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '50%',
            }}
          >
            <span
              style={{
                fontWeight: 800,
                color: '#FFFFFF',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentBowler.name}
            </span>
            <span style={{ fontWeight: 800, color: '#00ffff' }}>
              {currentBowler.runsConceded}-{currentBowler.wickets}
              <span style={{ fontSize: '18px', color: '#FFFFFF', opacity: 0.8, marginLeft: '4px' }}>
                ({currentBowler.overs})
              </span>
            </span>
          </div>

          {/* Over Details Balls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              height: '50%',
              gap: '6px',
            }}
          >
            {currentOverBalls.map((b, idx) => {
              const val = String(b).toUpperCase();
              if (val === '0' || val === '.') {
                return (
                  <div
                    key={idx}
                    title="Dot Ball"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '2px solid #00ffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#00ffff',
                      }}
                    />
                  </div>
                );
              }
              if (val === '4' || val === '6') {
                return (
                  <div
                    key={idx}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '2px solid #ffd700',
                      background: val === '6' ? '#b22cff' : '#ffd700',
                      color: val === '6' ? '#FFFFFF' : '#000000',
                      fontSize: '18px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {val}
                  </div>
                );
              }
              if (val === 'W') {
                return (
                  <div
                    key={idx}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '2px solid #ff2222',
                      background: '#ff2222',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    W
                  </div>
                );
              }
              if (val.includes('WD') || val.includes('NB')) {
                return (
                  <div
                    key={idx}
                    style={{
                      minWidth: '28px',
                      height: '28px',
                      padding: '0 4px',
                      borderRadius: '50px',
                      border: '2px solid #00ffff',
                      background: '#0a003e',
                      color: '#00ffff',
                      fontSize: '12px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {val}
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '2px solid #FFFFFF',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
