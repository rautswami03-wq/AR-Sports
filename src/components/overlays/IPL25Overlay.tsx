import React, { useState, useEffect, useMemo } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

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

export interface IPL25OverlayProps {
  className?: string;
}

export const IPL25Overlay: React.FC<IPL25OverlayProps> = ({ className = '' }) => {
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
  const team1Color = battingTeam?.primaryColor || '#004BA0';
  const team2Color = bowlingTeam?.primaryColor || '#D1AB3E';
  const text1Color = isBright(team1Color) ? '#000000' : '#FFFFFF';
  const text2Color = isBright(team2Color) ? '#000000' : '#FFFFFF';
  const scoreAccent = text1Color === '#FFFFFF' ? '#FFD700' : '#002B5B';

  // Ticker items
  const tickerItems = useMemo(() => {
    const items: string[] = [];
    items.push(`CRR: ${crr}`);
    if (isSecondInnings && target > 0) {
      items.push(`NEED ${runsNeeded} RUNS IN ${ballsRemaining} BALLS (RRR ${rrr})`);
    } else {
      const proj = Math.round(parseFloat(crr) * (matchDetails.totalOvers || 20));
      if (proj > 0) items.push(`PROJECTED: ${proj}`);
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
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  // Current over balls
  const recentBalls = matchDetails.recentBalls || [];
  const currentOverBalls = recentBalls.slice(-6);

  // Active Celebration Banner
  const celebrationText = useMemo(() => {
    if (activeAnimation) {
      const map: Record<string, string> = {
        FOUR: 'FOUR',
        SIX: 'SIX',
        WICKET: 'WICKET',
        WIDE: 'WIDE BALL',
        NO_BALL: 'NO BALL',
        FREE_HIT: 'FREE HIT',
        FIFTY: '50 MILESTONE',
        CENTURY: '100 CENTURY',
      };
      return map[activeAnimation] || String(activeAnimation).replace('_', ' ');
    }
    return null;
  }, [activeAnimation]);

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1920px',
        height: '120px',
        borderStyle: 'none',
        color: 'white',
        fontSize: '26px',
        fontWeight: 600,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        fontFamily: '"Roboto Condensed Variable", "Barlow Condensed", sans-serif',
        background: '#070b15',
        boxShadow: '0 8px 30px rgba(0,0,0,0.85)',
      }}
    >
      <style>{`
        @keyframes ipl25WaveLine {
          0% { transform: translateY(125px); opacity: 1; }
          100% { transform: translateY(-125px); opacity: 1; }
        }
        @keyframes ipl25TextGlow {
          0% { text-shadow: 0 0 10px #ffffff, 0 0 20px #00ffff; }
          100% { text-shadow: 0 0 25px #ffffff, 0 0 45px #00ffff; }
        }
      `}</style>

      {/* ── Celebration Overlay Takeover ─────────────────────────────────── */}
      {celebrationText ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            width: '100%',
            height: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '78px',
            color: 'white',
            fontWeight: 900,
            overflow: 'hidden',
            background: 'linear-gradient(90deg, #0a003e 0%, #150050 50%, #0a003e 100%)',
            borderTop: '3px solid #FFD700',
            borderBottom: '3px solid #FFD700',
          }}
        >
          {/* Background Watermark Text */}
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              fontSize: '180px',
              color: 'rgba(255, 255, 255, 0.06)',
              fontWeight: 900,
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              letterSpacing: '10px',
            }}
          >
            {celebrationText} &bull; {celebrationText}
          </div>

          {/* Center Glowing Banner */}
          <div
            style={{
              zIndex: 10,
              color: '#FFFFFF',
              textAlign: 'center',
              letterSpacing: '4px',
              animation: 'ipl25TextGlow 1s infinite alternate',
            }}
          >
            {celebrationText}
          </div>
        </div>
      ) : null}

      {/* ── Left Section: Batting Team & Score Pod ───────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '34%',
          minWidth: '560px',
          maxWidth: '560px',
          height: '100%',
          display: 'flex',
          zIndex: 10,
          background: team1Color,
          color: text1Color,
          boxSizing: 'border-box',
          overflow: 'hidden',
          boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Animated Light Sweep Overlay */}
        <div
          style={{
            width: '550px',
            height: '120px',
            position: 'absolute',
            left: 0,
            clipPath: 'polygon(0% 0%, 100.1% 100.3%, 100.1% 100.3%, 0% 20.3%)',
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 140%)',
            animation: 'ipl25WaveLine 40s linear infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Team 1 Medallion / Short Name Badge */}
        <div
          style={{
            position: 'absolute',
            zIndex: 20,
            left: 0,
            top: 0,
            width: '190px',
            height: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '38px',
            fontWeight: 900,
            textAlign: 'center',
            color: text1Color,
            borderRight: '2px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.15)',
            letterSpacing: '1px',
          }}
        >
          <span>{battingTeam.shortName || 'BAT'}</span>
        </div>

        {/* Score & Wickets & Overs Container */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
            minWidth: '370px',
            maxWidth: '370px',
            height: '100%',
            marginLeft: '190px',
            zIndex: 25,
            padding: '6px 10px',
          }}
        >
          {/* Powerplay Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '80px',
            }}
          >
            {/* Score - Wickets */}
            <div
              style={{
                fontSize: '68px',
                fontWeight: 800,
                color: scoreAccent,
                textShadow: '2px 2px 4px rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-1px',
              }}
            >
              <span>{battingTeam.score}</span>
              <span style={{ margin: '0 4px', opacity: 0.8 }}>-</span>
              <span>{battingTeam.wickets}</span>
            </div>

            {/* Overs */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '34px',
                fontWeight: 800,
                color: text1Color,
                letterSpacing: '-1px',
                lineHeight: 1.1,
              }}
            >
              <span>{oversFormatted}</span>
              <span style={{ fontSize: '20px', opacity: 0.8 }}>/{matchDetails.totalOvers || 20}</span>
            </div>
          </div>

          {/* Subtitle / Innings Indicator */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '1px',
              opacity: 0.9,
              color: text1Color,
              textTransform: 'uppercase',
            }}
          >
            {isSecondInnings && target > 0 ? `TARGET ${target}` : '1ST INNINGS'}
          </div>
        </div>
      </div>

      {/* ── Center Section: Batters & Match Ticker Pod ───────────────────── */}
      <div
        style={{
          width: '33%',
          minWidth: '715px',
          maxWidth: '715px',
          height: '100%',
          color: 'white',
          borderStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          zIndex: 11,
          background: '#0c1427',
          borderLeft: '2px solid rgba(255,255,255,0.15)',
          borderRight: '2px solid rgba(255,255,255,0.15)',
        }}
      >
        {/* Batters Box */}
        <div
          style={{
            width: '100%',
            minWidth: '424px',
            maxWidth: '424px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            textTransform: 'uppercase',
            boxSizing: 'border-box',
            padding: '8px 14px',
            borderRight: '2px solid rgba(255,255,255,0.1)',
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
            <div
              style={{
                width: '12px',
                height: '12px',
                background: '#FFD700',
                transform: 'rotate(45deg)',
                marginRight: '12px',
                boxShadow: '0 0 6px #FFD700',
              }}
            />
            <div
              style={{
                flex: 1,
                fontSize: '30px',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                color: '#FFFFFF',
              }}
            >
              {striker.name}
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#FFD700',
                marginLeft: '10px',
              }}
            >
              {striker.runs}
              <span style={{ fontSize: '20px', color: '#FFFFFF', opacity: 0.75, marginLeft: '4px' }}>
                ({striker.balls})
              </span>
            </div>
          </div>

          {/* Non-Striker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '50%',
              opacity: 0.55,
            }}
          >
            <div style={{ width: '12px', height: '12px', marginRight: '12px', opacity: 0 }} />
            <div
              style={{
                flex: 1,
                fontSize: '28px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                color: '#FFFFFF',
              }}
            >
              {nonStriker.name}
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginLeft: '10px',
              }}
            >
              {nonStriker.runs}
              <span style={{ fontSize: '20px', opacity: 0.75, marginLeft: '4px' }}>
                ({nonStriker.balls})
              </span>
            </div>
          </div>
        </div>

        {/* Ticker / Target Box */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '290px',
            minWidth: '290px',
            maxWidth: '290px',
            height: '100%',
            color: 'white',
            boxSizing: 'border-box',
            padding: '10px 16px',
            background: 'linear-gradient(180deg, #101c38 0%, #070e1f 100%)',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              color: '#00ffff',
              lineHeight: 1.25,
            }}
          >
            {tickerItems[tickerIndex] || `CRR: ${crr}`}
          </span>
        </div>
      </div>

      {/* ── Right Section: Bowler, Over Balls & Opponent Badge ───────────── */}
      <div
        style={{
          position: 'relative',
          width: '40%',
          minWidth: '645px',
          maxWidth: '645px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          color: text2Color,
          zIndex: 10,
          background: team2Color,
          boxSizing: 'border-box',
          overflow: 'hidden',
          boxShadow: 'inset 2px 0 10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Animated Light Sweep Overlay */}
        <div
          style={{
            width: '450px',
            height: '120px',
            position: 'absolute',
            right: 0,
            clipPath: 'polygon(0% 100.3%, 100.1% 0%, 100.1% 24.8%, 0% 100.3%)',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 140%)',
            animation: 'ipl25WaveLine 40s linear 10s infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Bowler Details & Balls */}
        <div
          style={{
            minWidth: '470px',
            maxWidth: '470px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '8px 16px',
            boxSizing: 'border-box',
            zIndex: 20,
          }}
        >
          {/* Bowler Name & Figures */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '50%',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: text2Color,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                maxWidth: '280px',
              }}
            >
              {currentBowler.name}
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: text2Color === '#FFFFFF' ? '#FFD700' : '#000000',
                whiteSpace: 'nowrap',
              }}
            >
              {currentBowler.runsConceded}-{currentBowler.wickets}
              <span style={{ fontSize: '20px', opacity: 0.8, marginLeft: '4px' }}>
                ({currentBowler.overs})
              </span>
            </div>
          </div>

          {/* Over Details Badges */}
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
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '2px solid rgba(0,0,0,0.3)',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#070b15',
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
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      border: '2px solid #FFD700',
                      background: val === '6' ? '#8A2BE2' : '#FFD700',
                      color: val === '6' ? '#FFFFFF' : '#000000',
                      fontSize: '24px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
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
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      border: '2px solid #ff2222',
                      background: '#ff2222',
                      color: '#FFFFFF',
                      fontSize: '22px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
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
                      minWidth: '38px',
                      height: '38px',
                      padding: '0 4px',
                      borderRadius: '6px',
                      border: '2px solid #00ffff',
                      background: '#0c1427',
                      color: '#00ffff',
                      fontSize: '14px',
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
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.4)',
                    background: '#FFFFFF',
                    color: '#000000',
                    fontSize: '22px',
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

        {/* Bowling Team Medallion / Short Name Badge */}
        <div
          style={{
            position: 'absolute',
            zIndex: 20,
            right: 0,
            top: 0,
            width: '175px',
            height: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '38px',
            fontWeight: 900,
            textAlign: 'center',
            color: text2Color,
            borderLeft: '2px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.15)',
            letterSpacing: '1px',
          }}
        >
          <span>{bowlingTeam.shortName || 'BOWL'}</span>
        </div>
      </div>
    </div>
  );
};

