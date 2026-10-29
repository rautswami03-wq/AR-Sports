import React, { useState, useEffect, useCallback } from 'react';
import './Overlay.css';

/**
 * Pixel-Perfect Cricket Live Scorer Overlay
 * Extracted & Reconstructed from cricket-live-scorer.netlify.app architecture.
 */
export default function Overlay({
  initialState = null,
  readOnly = false,
  onStateChange = null
}) {
  // Scoreboard State
  const [matchState, setMatchState] = useState(() => {
    if (initialState) return initialState;
    return {
      tournament: "T20 CHAMPIONS TROPHY",
      matchType: "Group Stage",
      team1: {
        name: "INDIA",
        shortName: "IND",
        runs: 168,
        wickets: 4,
        overs: 17,
        balls: 4
      },
      team2: {
        name: "AUSTRALIA",
        shortName: "AUS",
        target: 195
      },
      currentInnings: 1,
      striker: { name: "V. Kohli", runs: 64, balls: 41, fours: 5, sixes: 2 },
      nonStriker: { name: "H. Pandya", runs: 28, balls: 14, fours: 2, sixes: 2 },
      currentBowler: { name: "P. Cummins", overs: "3.4", maidens: 0, runs: 32, wickets: 2 },
      extras: { wides: 4, noBalls: 1, byes: 2, legByes: 0, total: 7 },
      recentBalls: [
        { text: "1", type: "run" },
        { text: "4", type: "four" },
        { text: "0", type: "dot" },
        { text: "6", type: "six" },
        { text: "W", type: "wicket" },
        { text: "1", type: "run" }
      ]
    };
  });

  // History stack for Undo
  const [history, setHistory] = useState([]);

  // Notify parent on change
  useEffect(() => {
    if (onStateChange) {
      onStateChange(matchState);
    }
  }, [matchState, onStateChange]);

  // Scoring Mutation Core
  const pushState = useCallback((updater) => {
    setHistory((prev) => [...prev, matchState]);
    setMatchState((current) => updater(current));
  }, [matchState]);

  const handleAddRuns = (runs) => {
    pushState((state) => {
      const isOdd = runs % 2 !== 0;
      const nextBalls = (state.team1.balls + 1) % 6;
      const nextOvers = nextBalls === 0 ? state.team1.overs + 1 : state.team1.overs;
      const overComplete = nextBalls === 0;

      // Swap striker on odd runs, and also at end of over
      let nextStriker = {
        ...state.striker,
        runs: state.striker.runs + runs,
        balls: state.striker.balls + 1,
        fours: runs === 4 ? state.striker.fours + 1 : state.striker.fours,
        sixes: runs === 6 ? state.striker.sixes + 1 : state.striker.sixes
      };
      let nextNonStriker = { ...state.nonStriker };

      const shouldSwap = (isOdd && !overComplete) || (!isOdd && overComplete);
      if (shouldSwap) {
        const temp = nextStriker;
        nextStriker = nextNonStriker;
        nextNonStriker = temp;
      }

      let ballType = "run";
      if (runs === 0) ballType = "dot";
      else if (runs === 4) ballType = "four";
      else if (runs === 6) ballType = "six";

      return {
        ...state,
        team1: {
          ...state.team1,
          runs: state.team1.runs + runs,
          overs: nextOvers,
          balls: nextBalls
        },
        striker: nextStriker,
        nonStriker: nextNonStriker,
        currentBowler: {
          ...state.currentBowler,
          runs: state.currentBowler.runs + runs
        },
        recentBalls: [...state.recentBalls.slice(1), { text: runs.toString(), type: ballType }]
      };
    });
  };

  const handleAddWicket = () => {
    pushState((state) => {
      const nextBalls = (state.team1.balls + 1) % 6;
      const nextOvers = nextBalls === 0 ? state.team1.overs + 1 : state.team1.overs;

      return {
        ...state,
        team1: {
          ...state.team1,
          wickets: Math.min(10, state.team1.wickets + 1),
          overs: nextOvers,
          balls: nextBalls
        },
        striker: { name: "New Batter", runs: 0, balls: 0, fours: 0, sixes: 0 },
        currentBowler: {
          ...state.currentBowler,
          wickets: state.currentBowler.wickets + 1
        },
        recentBalls: [...state.recentBalls.slice(1), { text: "W", type: "wicket" }]
      };
    });
  };

  const handleAddExtra = (type) => {
    pushState((state) => {
      const isWideOrNoBall = type === "WD" || type === "NB";
      const nextBalls = isWideOrNoBall ? state.team1.balls : (state.team1.balls + 1) % 6;
      const nextOvers = !isWideOrNoBall && nextBalls === 0 ? state.team1.overs + 1 : state.team1.overs;

      return {
        ...state,
        team1: {
          ...state.team1,
          runs: state.team1.runs + 1,
          overs: nextOvers,
          balls: nextBalls
        },
        extras: {
          ...state.extras,
          total: state.extras.total + 1,
          wides: type === "WD" ? state.extras.wides + 1 : state.extras.wides,
          noBalls: type === "NB" ? state.extras.noBalls + 1 : state.extras.noBalls
        },
        currentBowler: {
          ...state.currentBowler,
          runs: state.currentBowler.runs + 1
        },
        recentBalls: [...state.recentBalls.slice(1), { text: type, type: "extra" }]
      };
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setMatchState(previous);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (readOnly) return;
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (['0', '1', '2', '3', '4', '6'].includes(e.key)) {
        handleAddRuns(parseInt(e.key, 10));
      } else if (e.key.toLowerCase() === 'w') {
        handleAddWicket();
      } else if (e.key.toLowerCase() === 'u') {
        handleUndo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [readOnly, handleAddRuns, handleAddWicket, handleUndo]);

  const totalBallsBowled = matchState.team1.overs * 6 + matchState.team1.balls;
  const currentRunRate = totalBallsBowled > 0 ? ((matchState.team1.runs / totalBallsBowled) * 6).toFixed(2) : "0.00";
  const requiredRunRate = matchState.team2.target
    ? (((matchState.team2.target - matchState.team1.runs) / Math.max(1, 120 - totalBallsBowled)) * 6).toFixed(2)
    : null;

  return (
    <div className="displayModule">
      <div className="scoreboard-card">
        {/* Top Header Bar */}
        <div className="match-topbar">
          <div className="tournament-title">{matchState.tournament} • {matchState.matchType}</div>
          <div className="match-status-badge">
            <span className="live-indicator">
              <span className="live-dot"></span> LIVE
            </span>
          </div>
        </div>

        {/* Main Teams & Score Display */}
        <div className="scoreboard-main">
          {/* Team 1 (Left) */}
          <div className="team-section left">
            <div className="team-title Team1Text">{matchState.team1.name}</div>
            <div className="team-sub">Batting • {matchState.team1.shortName}</div>
          </div>

          {/* Primary Center Score */}
          <div className="primary-score-box">
            <div className="runs-wickets-display">
              <span className="runs-num">{matchState.team1.runs}</span>
              <span className="slash">/</span>
              <span className="wickets-num">{matchState.team1.wickets}</span>
            </div>
            <div className="overs-counter">
              OVERS {matchState.team1.overs}.{matchState.team1.balls} (20)
            </div>
          </div>

          {/* Team 2 (Right) */}
          <div className="team-section right">
            <div className="team-title Team2Text">{matchState.team2.name}</div>
            <div className="team-sub">
              {matchState.team2.target ? `Target: ${matchState.team2.target}` : 'Bowling'} • {matchState.team2.shortName}
            </div>
          </div>
        </div>

        {/* Secondary Match Stats */}
        <div className="stats-strip">
          <div className="stat-cell">
            <span className="label">Current RR</span>
            <span className="value">{currentRunRate}</span>
          </div>
          {requiredRunRate && (
            <div className="stat-cell">
              <span className="label">Req RR</span>
              <span className="value">{requiredRunRate}</span>
            </div>
          )}
          <div className="stat-cell">
            <span className="label">Extras</span>
            <span className="value">{matchState.extras.total} (w {matchState.extras.wides}, nb {matchState.extras.noBalls})</span>
          </div>
          <div className="stat-cell">
            <span className="label">Partnership</span>
            <span className="value">{matchState.striker.runs + matchState.nonStriker.runs} runs</span>
          </div>
        </div>

        {/* Batting & Bowling Breakdown */}
        <div className="active-players-grid">
          <div className="batters-box">
            <div className="player-row">
              <span className="player-name">
                <span className="striker-star">★</span> {matchState.striker.name}
              </span>
              <span className="player-figures">
                {matchState.striker.runs}* ({matchState.striker.balls}) [{matchState.striker.fours}x4, {matchState.striker.sixes}x6]
              </span>
            </div>
            <div className="player-row">
              <span className="player-name">
                &nbsp;&nbsp;{matchState.nonStriker.name}
              </span>
              <span className="player-figures">
                {matchState.nonStriker.runs} ({matchState.nonStriker.balls}) [{matchState.nonStriker.fours}x4, {matchState.nonStriker.sixes}x6]
              </span>
            </div>
          </div>

          <div className="bowler-box">
            <span className="bowler-label">Current Bowler</span>
            <span className="bowler-name">{matchState.currentBowler.name}</span>
            <span className="bowler-stat">
              {matchState.currentBowler.wickets}/{matchState.currentBowler.runs} ({matchState.currentBowler.overs} ov)
            </span>
          </div>
        </div>

        {/* Timeline of Recent Balls */}
        <div className="balls-strip">
          <span className="balls-label">Recent Deliveries:</span>
          <div className="balls-list">
            {matchState.recentBalls.map((b, idx) => (
              <div key={idx} className={`ball-circle ${b.type}`}>
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Controls (Disabled in read-only overlay mode) */}
        {!readOnly && (
          <div className="control-actions">
            <button className="btn-scoring" onClick={() => handleAddRuns(0)}>• Dot (0)</button>
            <button className="btn-scoring highlight-run" onClick={() => handleAddRuns(1)}>+1 Run</button>
            <button className="btn-scoring highlight-run" onClick={() => handleAddRuns(2)}>+2 Runs</button>
            <button className="btn-scoring highlight-run" onClick={() => handleAddRuns(3)}>+3 Runs</button>
            <button className="btn-scoring highlight-boundary" onClick={() => handleAddRuns(4)}>+4 FOUR</button>
            <button className="btn-scoring highlight-boundary" onClick={() => handleAddRuns(6)}>+6 SIX</button>
            <button className="btn-scoring highlight-wicket" onClick={handleAddWicket}>WICKET</button>
            <button className="btn-scoring" onClick={() => handleAddExtra("WD")}>Wide (WD)</button>
            <button className="btn-scoring" onClick={() => handleAddExtra("NB")}>No Ball (NB)</button>
            <button className="btn-scoring undo" onClick={handleUndo}>↺ Undo</button>
          </div>
        )}
      </div>
    </div>
  );
}

