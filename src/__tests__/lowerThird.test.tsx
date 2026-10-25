import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LowerThird } from '../components/overlays/LowerThird';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('LowerThird Component Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'IND',
        fullName: 'India',
        primaryColor: '#00529B',
        secondaryColor: '#FF9933',
        accentColor: '#00D2FF',
        score: 145,
        wickets: 2,
        overs: 16,
        balls: 4,
        extras: 8,
        playingXI: ['Virat Kohli', 'Rohit Sharma'],
        batters: [
          { id: 'b1', name: 'Virat Kohli', runs: 72, balls: 48, fours: 6, sixes: 2, isOut: false, isStriker: true },
          { id: 'b2', name: 'Rohit Sharma', runs: 65, balls: 42, fours: 7, sixes: 3, isOut: false, isStriker: false },
        ],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'AUS',
        fullName: 'Australia',
        primaryColor: '#FFD700',
        secondaryColor: '#006400',
        accentColor: '#FFF',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Mitchell Starc'],
        batters: [],
        bowlers: [
          { id: 'bw1', name: 'Mitchell Starc', overs: 3, ballsInCurrentOver: 4, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.64, isCurrent: true },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      matchDetails: {
        title: 'T20 WORLD CUP',
        tournament: 'ICC T20 WORLD CUP',
        stage: 'FINAL',
        venue: 'MELBOURNE',
        tossWinner: 'India',
        tossDecision: 'bat',
        targetRuns: 180,
        currentInnings: 2,
        totalOvers: 20,
        recentBalls: ['1', '4', '0', '6'],
        partnership: {
          runs: 88,
          balls: 54,
          batter1Name: 'Virat Kohli',
          batter1Runs: 45,
          batter1Balls: 28,
          batter2Name: 'Rohit Sharma',
          batter2Runs: 43,
          batter2Balls: 26,
        },
        fallOfWickets: [],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
      },
    });
  });

  it('renders batter lower third with store fallback data', () => {
    render(<LowerThird type="batter" />);
    expect(screen.getByText('Virat Kohli')).toBeDefined();
    expect(screen.getByText('72')).toBeDefined();
    expect(screen.getByText('(48)')).toBeDefined();
    expect(screen.getByText('FOURS')).toBeDefined();
    expect(screen.getByText('SIXES')).toBeDefined();
  });

  it('renders batter lower third with custom props override', () => {
    render(
      <LowerThird
        type="batter"
        data={{
          name: 'Hardik Pandya',
          runs: 45,
          balls: 20,
          fours: 3,
          sixes: 4,
          strikeRate: '225.00',
          team: 'IND',
        }}
      />
    );
    expect(screen.getByText('Hardik Pandya')).toBeDefined();
    expect(screen.getByText('45')).toBeDefined();
    expect(screen.getByText('(20)')).toBeDefined();
    expect(screen.getByText('225.00')).toBeDefined();
  });

  it('renders bowler lower third with yellow/white theme metrics', () => {
    render(<LowerThird type="bowler" />);
    expect(screen.getByText('Mitchell Starc')).toBeDefined();
    expect(screen.getByText('DOT BALLS')).toBeDefined();
    expect(screen.getByText('OVERS')).toBeDefined();
    expect(screen.getByText('3.4')).toBeDefined();
    expect(screen.getByText('28')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('renders partnership lower third with cyan theme and both batters', () => {
    render(<LowerThird type="partnership" />);
    expect(screen.getByText('PARTNERSHIP')).toBeDefined();
    expect(screen.getByText(/88/)).toBeDefined();
    expect(screen.getByText('Virat Kohli')).toBeDefined();
    expect(screen.getByText('Rohit Sharma')).toBeDefined();
  });

  it('renders target lower third with dual-box NEED/FROM and VS logo', () => {
    render(<LowerThird type="target" />);
    expect(screen.getByText('NEED')).toBeDefined();
    expect(screen.getByText('FROM')).toBeDefined();
    expect(screen.getByText('RUNS')).toBeDefined();
    expect(screen.getByText('BALLS')).toBeDefined();
    expect(screen.getByText('⚡VS')).toBeDefined();
  });
});
