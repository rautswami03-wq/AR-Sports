import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchCharts } from '../components/overlays/MatchCharts';
import { useBroadcastStore, BallLogEntry } from '../store/useBroadcastStore';

describe('MatchCharts Component Suite', () => {
  beforeEach(() => {
    const sampleBallLog: BallLogEntry[] = [
      // Innings 1 (Team A)
      { over: 0, ball: 1, batter: 'V Kohli', bowler: 'M Starc', runs: 4, timestamp: 1000 },
      { over: 0, ball: 2, batter: 'V Kohli', bowler: 'M Starc', runs: 6, timestamp: 1010 },
      { over: 0, ball: 3, batter: 'V Kohli', bowler: 'M Starc', runs: 0, timestamp: 1020 },
      { over: 0, ball: 4, batter: 'V Kohli', bowler: 'M Starc', runs: 1, timestamp: 1030 },
      { over: 0, ball: 5, batter: 'R Sharma', bowler: 'M Starc', runs: 0, timestamp: 1040 },
      { over: 0, ball: 6, batter: 'R Sharma', bowler: 'M Starc', runs: 2, timestamp: 1050 }, // Over 1: 13 runs
      { over: 1, ball: 1, batter: 'V Kohli', bowler: 'P Cummins', runs: 4, timestamp: 1060 },
      { over: 1, ball: 2, batter: 'V Kohli', bowler: 'P Cummins', runs: 0, wicket: 'bowled', timestamp: 1070 }, // Over 2: 4 runs, 1 wicket
      // Marker for innings break
      { over: 20, ball: 0, batter: '', bowler: '', runs: 0, event: 'INNINGS_END', timestamp: 2000 },
      // Innings 2 (Team B)
      { over: 0, ball: 1, batter: 'D Warner', bowler: 'J Bumrah', runs: 6, timestamp: 2010 },
      { over: 0, ball: 2, batter: 'D Warner', bowler: 'J Bumrah', runs: 4, timestamp: 2020 },
      { over: 1, ball: 1, batter: 'T Head', bowler: 'M Shami', runs: 1, timestamp: 2030 },
    ];

    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'IND',
        fullName: 'India',
        primaryColor: '#00e5ff',
        secondaryColor: '#FF9933',
        accentColor: '#00D2FF',
        score: 17,
        wickets: 1,
        overs: 2,
        balls: 0,
        extras: 0,
        playingXI: ['V Kohli', 'R Sharma'],
        batters: [],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'AUS',
        fullName: 'Australia',
        primaryColor: '#ffd700',
        secondaryColor: '#006400',
        accentColor: '#FFF',
        score: 11,
        wickets: 0,
        overs: 1,
        balls: 1,
        extras: 0,
        playingXI: ['D Warner', 'T Head'],
        batters: [],
        bowlers: [],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      ballLog: sampleBallLog,
      matchDetails: {
        title: 'T20 CHAMPIONSHIP',
        tournament: 'ICC WORLD CUP',
        stage: 'SUPER 8',
        venue: 'MUMBAI',
        tossWinner: 'India',
        tossDecision: 'bat',
        targetRuns: 180,
        currentInnings: 1,
        totalOvers: 20,
        recentBalls: [],
        partnership: { runs: 0, balls: 0, batter1Name: '', batter1Runs: 0, batter1Balls: 0, batter2Name: '', batter2Runs: 0, batter2Balls: 0 },
        fallOfWickets: [],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
        graphType: 'BAR',
      },
    });
  });

  it('renders Manhattan Bar Chart view by default', () => {
    render(<MatchCharts view="bar" />);
    expect(screen.getByText('MANHATTAN CHART')).toBeDefined();
    expect(screen.getByText(/RUNS SCORED/)).toBeDefined();
    expect(screen.getByText(/WICKET FALLEN/)).toBeDefined();
  });

  it('renders Worm Line Chart view with cumulative progression', () => {
    render(<MatchCharts view="line" />);
    expect(screen.getByText('WORM CHART')).toBeDefined();
    expect(screen.getByText(/IND \(17\/1\)/)).toBeDefined();
    expect(screen.getByText(/AUS \(11\/0\)/)).toBeDefined();
  });

  it('renders Double Bar Chart comparison view', () => {
    render(<MatchCharts view="double_bar" />);
    expect(screen.getByText('COMPARISON CHART')).toBeDefined();
    expect(screen.getByText(/IND \(17\/1\)/)).toBeDefined();
    expect(screen.getByText(/AUS \(11\/0\)/)).toBeDefined();
  });

  it('reads graphType from store when view prop is omitted', () => {
    useBroadcastStore.setState({
      matchDetails: {
        ...useBroadcastStore.getState().matchDetails,
        graphType: 'LINE',
      },
    });
    render(<MatchCharts />);
    expect(screen.getByText('WORM CHART')).toBeDefined();
  });
});
