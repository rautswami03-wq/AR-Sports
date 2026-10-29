import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CricketOverlay.css';

/**
 * Cricket Scoreboard Overlay Component
 * Cloned from cricket-live-scorer.netlify.app patterns
 * Features: Live score updates, animations, responsive design
 */
const CricketOverlay = ({
  matchData,
  isVisible = true,
  onClose,
  theme = 'dark',
  position = 'top-center',
  animationDuration = 300
}) => {
  const [currentOver, setCurrentOver] = useState(matchData?.currentOver || 0);
  const [currentBall, setCurrentBall] = useState(matchData?.currentBall || 0);
  const [runs, setRuns] = useState(matchData?.runs || 0);
  const [wickets, setWickets] = useState(matchData?.wickets || 0);
  const [extras, setExtras] = useState(matchData?.extras || 0);
  const [runRate, setRunRate] = useState(matchData?.runRate || 0);
  const [recentBalls, setRecentBalls] = useState(matchData?.recentBalls || []);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  
  const overlayRef = useRef(null);
  const scoreRef = useRef(null);
  const wicketRef = useRef(null);

  // Animation keyframes for score updates
  const triggerScoreAnimation = useCallback((type = 'runs') => {
    setIsAnimating(true);
    const ref = type === 'wicket' ? wicketRef.current : scoreRef.current;
    if (ref) {
      ref.classList.add('animate-score-update');
      setTimeout(() => {
        ref.classList.remove('animate-score-update');
        setIsAnimating(false);
      }, animationDuration);
    }
  }, [animationDuration]);

  // Handle new ball event
  const handleNewBall = useCallback((ballData) => {
    const { runs: ballRuns, isWicket, extras: ballExtras, commentary } = ballData;
    
    // Update recent balls with animation
    setRecentBalls(prev => {
      const newBalls = [
        { runs: ballRuns, isWicket, extras: ballExtras, commentary, timestamp: Date.now() },
        ...prev.slice(0, 5)
      ];
      return newBalls;
    });

    // Update score with animation
    if (ballRuns > 0 || ballExtras > 0) {
      setRuns(prev => prev + ballRuns + ballExtras);
      triggerScoreAnimation('runs');
      setLastEvent({ type: 'runs', value: ballRuns + ballExtras });
    }

    if (isWicket) {
      setWickets(prev => prev + 1);
      triggerScoreAnimation('wicket');
      setLastEvent({ type: 'wicket', value: 1 });
    }

    // Update over/ball count
    setCurrentBall(prev => {
      const nextBall = prev + 1;
      if (nextBall >= 6) {
        setCurrentOver(prev => prev + 1);
        return 0;
      }
      return nextBall;
    });

    // Recalculate run rate
    const totalBalls = (currentOver * 6) + currentBall + 1;
    if (totalBalls > 0) {
      setRunRate(((runs + ballRuns + ballExtras) / totalBalls) * 6);
    }
  }, [currentOver, currentBall, runs, triggerScoreAnimation]);

  // Keyboard shortcuts for testing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;
      
      switch(e.key) {
        case '1': case '2': case '3': case '4': case '6':
          handleNewBall({ runs: parseInt(e.key), isWicket: false, extras: 0, commentary: `${e.key} runs` });
          break;
        case 'w':
        case 'W':
          handleNewBall({ runs: 0, isWicket: true, extras: 0, commentary: 'Wicket!' });
          break;
        case '0':
          handleNewBall({ runs: 0, isWicket: false, extras: 0, commentary: 'Dot ball' });
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleNewBall, onClose]);

  // Sync with external match data
  useEffect(() => {
    if (matchData) {
      setCurrentOver(matchData.currentOver || 0);
      setCurrentBall(matchData.currentBall || 0);
      setRuns(matchData.runs || 0);
      setWickets(matchData.wickets || 0);
      setExtras(matchData.extras || 0);
      setRunRate(matchData.runRate || 0);
      setRecentBalls(matchData.recentBalls || []);
    }
  }, [matchData]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-center': 'overlay-top-center',
    'top-left': 'overlay-top-left',
    'top-right': 'overlay-top-right',
    'bottom-center': 'overlay-bottom-center',
    'bottom-left': 'overlay-bottom-left',
    'bottom-right': 'overlay-bottom-right'
  };

  return (
    <div 
      ref={overlayRef}
      className={`cricket-overlay ${theme} ${positionClasses[position]} ${isAnimating ? 'animating' : ''}`}
      role="region"
      aria-label="Cricket live score overlay"
      aria-live="polite"
    >
      <div className="overlay-background">
        <div className="overlay-glow"></div>
      </div>
      
      <div className="overlay-content">
        {/* Team Header */}
        <div className="team-header">
          <div className="team-info batting">
            <span className="team-name">{matchData?.battingTeam?.name || 'Team A'}</span>
            <span className="team-short">{matchData?.battingTeam?.shortName || 'TMA'}</span>
          </div>
          
          <div className="score-display">
            <div className="main-score">
              <span 
                ref={scoreRef}
                className="runs-value"
                aria-label={`Runs: ${runs}`}
              >
                {runs.toString().padStart(3, '0')}
              </span>
              <span className="score-separator">/</span>
              <span 
                ref={wicketRef}
                className="wickets-value"
                aria-label={`Wickets: ${wickets}`}
              >
                {wickets.toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="overs-display">
              <span className="overs-label">Overs</span>
              <span className="overs-value">
                {currentOver}.{currentBall}
              </span>
            </div>
          </div>
          
          <div className="team-info bowling">
            <span className="team-name">{matchData?.bowlingTeam?.name || 'Team B'}</span>
            <span className="team-short">{matchData?.bowlingTeam?.shortName || 'TMB'}</span>
          </div>
        </div>

        {/* Run Rate & Extras */}
        <div className="match-stats">
          <div className="stat-item run-rate">
            <span className="stat-label">Run Rate</span>
            <span className="stat-value">{runRate.toFixed(2)}</span>
          </div>
          
          <div className="stat-item extras">
            <span className="stat-label">Extras</span>
            <span className="stat-value">{extras}</span>
          </div>
          
          <div className="stat-item target">
            <span className="stat-label">Target</span>
            <span className="stat-value">
              {matchData?.target ? `${matchData.target}` : '---'}
            </span>
          </div>
          
          <div className="stat-item required">
            <span className="stat-label">Required</span>
            <span className="stat-value">
              {matchData?.requiredRunRate ? `${matchData.requiredRunRate.toFixed(2)}` : '---'}
            </span>
          </div>
        </div>

        {/* Recent Balls Timeline */}
        <div className="recent-balls-timeline" aria-label="Recent balls">
          <div className="timeline-header">
            <span className="timeline-title">Recent Overs</span>
            <span className="timeline-indicator" aria-hidden="true">
              <span className="pulse-dot"></span> LIVE
            </span>
          </div>
          
          <div className="balls-container">
            {recentBalls.map((ball, index) => (
              <div 
                key={`${ball.timestamp}-${index}`}
                className={`ball-item ${ball.isWicket ? 'wicket' : ''} ${ball.extras > 0 ? 'extra' : ''} ${ball.runs >= 4 ? 'boundary' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="ball-runs" aria-label={ball.commentary}>
                  {ball.isWicket ? 'W' : ball.extras > 0 ? `+${ball.extras}` : ball.runs}
                </span>
                {ball.isWicket && <span className="wicket-icon" aria-hidden="true">🏏</span>}
              </div>
            ))}
            
            {/* Empty placeholders for initial state */}
            {recentBalls.length === 0 && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ball-item empty">
                <span className="ball-runs">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Batter Info */}
        <div className="batter-info">
          <div className="batter striker">
            <span className="batter-label">Striker</span>
            <div className="batter-details">
              <span className="batter-name">{matchData?.striker?.name || 'Player 1'}</span>
              <span className="batter-score">
                {matchData?.striker?.runs || 0} ({matchData?.striker?.balls || 0}b)
              </span>
            </div>
            <div className="striker-indicator" aria-hidden="true">▶</div>
          </div>
          
          <div className="batter non-striker">
            <span className="batter-label">Non-Striker</span>
            <div className="batter-details">
              <span className="batter-name">{matchData?.nonStriker?.name || 'Player 2'}</span>
              <span className="batter-score">
                {matchData?.nonStriker?.runs || 0} ({matchData?.nonStriker?.balls || 0}b)
              </span>
            </div>
          </div>
          
          <div className="current-bowler">
            <span className="bowler-label">Bowler</span>
            <div className="bowler-details">
              <span className="bowler-name">{matchData?.currentBowler?.name || 'Bowler 1'}</span>
              <span className="bowler-figures">
                {matchData?.currentBowler?.overs || 0}-{matchData?.currentBowler?.maidens || 0}-
                {matchData?.currentBowler?.runs || 0}-{matchData?.currentBowler?.wickets || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Live Event Notification */}
        {lastEvent && (
          <div className={`live-event-notification ${lastEvent.type}`} role="status" aria-live="assertive">
            <span className="event-icon">
              {lastEvent.type === 'wicket' ? '🏏' : lastEvent.type === 'boundary' ? '💥' : '🏃'}
            </span>
            <span className="event-text">
              {lastEvent.type === 'wicket' ? 'WICKET!' : 
               lastEvent.type === 'boundary' ? `${lastEvent.value} RUNS!` : 
               `${lastEvent.value} RUN${lastEvent.value > 1 ? 'S' : ''}`}
            </span>
          </div>
        )}

        {/* Close Button */}
        {onClose && (
          <button 
            className="overlay-close-btn"
            onClick={onClose}
            aria-label="Close overlay"
            title="Close overlay (Esc)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CricketOverlay;