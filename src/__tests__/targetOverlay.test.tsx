import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TargetOverlay } from '../components/overlays/TargetOverlay';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('TargetOverlay IPL Split-Screen Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'IND',
        fullName: 'India',
        primaryColor: '#00529B',
        secondaryColor: '#FF9933',
        accentColor: '#00D2FF',
        score: 110,
        wickets: 3,
        overs: 12,
        balls: 4,
        extras: 4,
        playingXI: [],
        batters: [],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'AUS',
        fullName: 'Australia',
        primaryColor: '#FFD700',
        secondaryColor: '#006400',
        accentColor: '#FFF',
        score: 184,
        wickets: 5,
        overs: 20,
        balls: 0,
        extras: 6,
        playingXI: [],
        batters: [],
        bowlers: [],
      },
      battingTeamId: 'teamA',
      matchDetails: {
        title: 'IPL 2025',
        tournament: 'TATA IPL 2025',
        stage: 'FINAL',
        venue: 'AHMEDABAD',
        tossWinner: 'Australia',
        tossDecision: 'bat',
        targetRuns: 185,
        currentInnings: 2,
        totalOvers: 20,
        recentBalls: ['1', '4', '0', 'W'],
        partnership: {
          runs: 35,
          balls: 22,
          batter1Name: 'Batter 1',
          batter1Runs: 20,
          batter1Balls: 12,
          batter2Name: 'Batter 2',
          batter2Runs: 15,
          batter2Balls: 10,
        },
        fallOfWickets: [],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
      },
    });
  });

  it('renders TARGET heading and Coral Yellow target number in top half', () => {
    render(<TargetOverlay />);
    expect(screen.getByText('TARGET')).toBeDefined();
    expect(screen.getByText('185')).toBeDefined();
  });

  it('renders chasing team name and current score in bottom half', () => {
    render(<TargetOverlay />);
    expect(screen.getByText('India')).toBeDefined();
    expect(screen.getByText(/CURRENT SCORE:/)).toBeDefined();
    expect(screen.getByText('110-3')).toBeDefined();
    expect(screen.getByText('(12.4 ov)')).toBeDefined();
  });

  it('renders NEED X RUNS FROM Y BALLS ticker at bottom', () => {
    render(<TargetOverlay />);
    // Target 185 - score 110 = 75 runs needed
    // 20 overs * 6 = 120 max balls - (12*6 + 4 = 76 bowled) = 44 balls remaining
    expect(screen.getByText('NEED')).toBeDefined();
    expect(screen.getByText('75')).toBeDefined();
    expect(screen.getByText('RUNS FROM')).toBeDefined();
    expect(screen.getByText('44')).toBeDefined();
    expect(screen.getByText('BALLS')).toBeDefined();
  });
});
