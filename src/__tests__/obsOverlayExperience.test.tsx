import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OverlayStage } from '../components/control/OverlayStage';
import { ScoreBug } from '../components/overlays/ScoreBug';
import { LowerThird } from '../components/overlays/LowerThird';
import { EventSting } from '../components/overlays/EventSting';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('OBS Overlay Experience Perfection Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'CSK',
        fullName: 'Chennai Super Kings',
        primaryColor: '#FFFF00',
        secondaryColor: '#0081E9',
        accentColor: '#F9CD05',
        score: 184,
        wickets: 3,
        overs: 17,
        balls: 4,
        extras: 5,
        playingXI: ['Ruturaj Gaikwad', 'MS Dhoni'],
        batters: [
          { id: 'b1', name: 'Ruturaj Gaikwad', runs: 78, balls: 45, fours: 7, sixes: 3, isOut: false, isStriker: true },
          { id: 'b2', name: 'MS Dhoni', runs: 32, balls: 14, fours: 2, sixes: 3, isOut: false, isStriker: false },
        ],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'MI',
        fullName: 'Mumbai Indians',
        primaryColor: '#004BA0',
        secondaryColor: '#D1AB3E',
        accentColor: '#FFF',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Jasprit Bumrah'],
        batters: [],
        bowlers: [
          { id: 'bw1', name: 'Jasprit Bumrah', overs: 3, ballsInCurrentOver: 4, maidens: 0, runsConceded: 24, wickets: 2, economy: 6.55, isCurrent: true },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      tournamentId: 'default',
      activeAnimation: null,
      matchDetails: {
        title: 'IPL 2025',
        tournament: 'TATA IPL 2025',
        stage: 'FINAL',
        venue: 'AHMEDABAD',
        tossWinner: 'CSK',
        tossDecision: 'bat',
        targetRuns: 0,
        currentInnings: 1,
        totalOvers: 20,
        recentBalls: ['1', '4', '6', '0'],
        partnership: {
          runs: 62,
          balls: 35,
          batter1Name: 'Ruturaj Gaikwad',
          batter1Runs: 38,
          batter1Balls: 22,
          batter2Name: 'MS Dhoni',
          batter2Runs: 24,
          batter2Balls: 13,
        },
        fallOfWickets: [],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
      },
      activeOverlays: {
        scoreBug: false,
        battingLowerThird: false,
        bowlingLowerThird: false,
        battingScorecard: false,
        bowlingScorecard: false,
        matchSummary: false,
        partnership: false,
        currentBatters: false,
        currentBowler: false,
        requiredRunRate: false,
        currentRunRate: false,
        fallOfWickets: false,
        target: false,
        winnerScreen: false,
        playingXI: false,
        toss: false,
        playerStatistics: false,
        bowlerStatistics: false,
        playerOfTheMatch: false,
        playerOfTheTournament: false,
        topBatters: false,
        topBowlers: false,
        topStrikers: false,
        topPlayerOfSeries: false,
        pointsTable: false,
        sponsorGraphics: false,
        countdown: false,
        replayLowerThird: false,
        decision: false,
        graph: false,
        groupPt1: false,
        groupPt2: false,
        groupPt3: false,
        groupPt4: false,
        groupPt5: false,
        groupPt6: false,
        groupPt7: false,
        groupPt8: false,
        superOver: false,
        wagonWheel: false,
        pitchMap: false,
        manhattan: false,
        commentator: false,
        watermark: false,
        manOfTheMatchCard: false,
        tournamentTitle: false,
        winPredictor: false,
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. OverlayStage: strict conditional checks prevent overlays from bleeding into each other', () => {
    // When all activeOverlays are false, nothing is rendered
    const { unmount } = render(<OverlayStage />);
    expect(screen.queryByText('CSK')).toBeNull();
    expect(screen.queryByText('Ruturaj Gaikwad')).toBeNull();
    unmount();

    // Activate only scoreBug
    act(() => {
      useBroadcastStore.setState((s) => ({
        ...s,
        activeOverlays: { ...s.activeOverlays, scoreBug: true },
      }));
    });
    const { unmount: unmount2 } = render(<OverlayStage />);
    expect(screen.getByText('CSK')).toBeDefined();
    expect(screen.getByText('184')).toBeDefined();
    // LowerThird should NOT bleed in
    expect(screen.queryByText('FOURS')).toBeNull();
    unmount2();

    // Now activate battingScorecard (Full Card) while scoreBug is also true in activeOverlays
    act(() => {
      useBroadcastStore.setState((s) => ({
        ...s,
        activeOverlays: { ...s.activeOverlays, scoreBug: true, battingScorecard: true },
      }));
    });
    render(<OverlayStage />);
    // Batting scorecard table should render
    expect(screen.getByText(/BATTING SCORECARD/i)).toBeDefined();
    // ScoreBug is suppressed by isVisible and does not bleed
    expect(screen.queryByText('-3')).toBeNull();
  });

  it('2. ScoreBug: renders with IPL-style smooth fade gradient and metallic accents', () => {
    const { container } = render(<ScoreBug />);
    expect(screen.getByText('CSK')).toBeDefined();
    expect(screen.getByText('184')).toBeDefined();
    expect(screen.getByText('-3')).toBeDefined();
    expect(screen.getByText(/17\.4/)).toBeDefined();
    expect(screen.getByText('Ruturaj Gaikwad')).toBeDefined();

    // Check presence of smooth fade gradient in HTML
    const html = container.innerHTML;
    expect(html).toContain('linear-gradient(105deg');
    expect(html).toContain('linear-gradient(90deg, rgb(255, 90, 0) 0%, rgb(255, 183, 3) 20%');
  });

  it('3. LowerThird: slides in and auto-hides after exactly 5 seconds', () => {
    vi.useFakeTimers();
    act(() => {
      useBroadcastStore.setState((s) => ({
        ...s,
        activeOverlays: { ...s.activeOverlays, battingLowerThird: true },
      }));
    });

    render(<LowerThird type="batter" />);
    expect(screen.getByText('Ruturaj Gaikwad')).toBeDefined();
    expect(screen.getByText('78')).toBeDefined();
    expect(screen.getByText('FOURS')).toBeDefined();

    // Fast-forward 4.9 seconds - should still be active
    act(() => {
      vi.advanceTimersByTime(4900);
    });
    expect(useBroadcastStore.getState().activeOverlays.battingLowerThird).toBe(true);

    // Fast-forward past 5.0 seconds - should be auto-hidden
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(useBroadcastStore.getState().activeOverlays.battingLowerThird).toBe(false);
    vi.useRealTimers();
  });

  it('4. EventSting: renders FOUR, SIX, WICKET with Framer Motion and holds for 3 seconds', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    // Render FOUR sting
    const { unmount } = render(<EventSting type="FOUR" onComplete={onComplete} />);
    const stingEl = screen.getByTestId('event-sting');
    expect(stingEl).toBeDefined();
    expect(screen.getByText('FOUR')).toBeDefined();
    expect(screen.getByText('BOUNDARY')).toBeDefined();

    // Advance 2.9 seconds - onComplete not called yet
    act(() => {
      vi.advanceTimersByTime(2900);
    });
    expect(onComplete).not.toHaveBeenCalled();

    // Advance to 3.0 seconds - onComplete should be called and animation cleared
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);

    unmount();

    // Render WICKET sting
    render(<EventSting type="WICKET" />);
    expect(screen.getByText('WICKET')).toBeDefined();
    expect(screen.getByText('DISMISSAL')).toBeDefined();

    // Render SIX sting
    render(<EventSting type="SIX" />);
    expect(screen.getByText('MAXIMUM SIX')).toBeDefined();
    expect(screen.getByText('SUPER MAXIMUM')).toBeDefined();
    vi.useRealTimers();
  });
});
