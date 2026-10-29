import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IPL25Overlay } from '../components/overlays/IPL25Overlay';
import { OverlayStage } from '../components/control/OverlayStage';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('IPL25Overlay Suite', () => {
  beforeEach(() => {
    const currentState = useBroadcastStore.getState();
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'CSK',
        fullName: 'Chennai Super Kings',
        primaryColor: '#F9CD05',
        secondaryColor: '#0081E9',
        accentColor: '#F9CD05',
        score: 198,
        wickets: 4,
        overs: 18,
        balls: 2,
        extras: 10,
        playingXI: ['Ruturaj Gaikwad', 'MS Dhoni'],
        batters: [
          { id: 'b1', name: 'Ruturaj Gaikwad', runs: 78, balls: 46, fours: 7, sixes: 3, isOut: false, isStriker: true },
          { id: 'b2', name: 'MS Dhoni', runs: 28, balls: 11, fours: 2, sixes: 3, isOut: false, isStriker: false },
        ],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'MI',
        fullName: 'Mumbai Indians',
        primaryColor: '#004BA0',
        secondaryColor: '#D1AB3E',
        accentColor: '#004BA0',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Jasprit Bumrah'],
        batters: [],
        bowlers: [
          { id: 'bw1', name: 'Jasprit Bumrah', overs: 3.2, ballsInCurrentOver: 2, maidens: 0, runsConceded: 24, wickets: 2, economy: 7.2, isCurrent: true },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      tournamentId: 'ipl25',
      matchDetails: {
        ...currentState.matchDetails,
        title: 'TATA IPL 2025',
        tournament: 'IPL 2025',
        currentInnings: 1,
        totalOvers: 20,
        targetRuns: 0,
        tossWinner: 'CSK',
        tossDecision: 'bat',
        recentBalls: ['0', '4', '1', '6', 'WD', 'W'],
        customInputText: '',
        decision: undefined,
      },
      activeOverlays: {
        ...currentState.activeOverlays,
        scoreBug: true,
      },
      activeAnimation: null,
    });
  });

  it('renders striker and non-striker names and scores', () => {
    render(<IPL25Overlay />);

    expect(screen.getByText('Ruturaj Gaikwad')).toBeDefined();
    expect(screen.getByText('78')).toBeDefined();
    expect(screen.getByText('(46)')).toBeDefined();

    expect(screen.getByText('MS Dhoni')).toBeDefined();
    expect(screen.getByText('28')).toBeDefined();
    expect(screen.getByText('(11)')).toBeDefined();
  });

  it('renders batting team short name, score, wickets, and overs', () => {
    render(<IPL25Overlay />);

    expect(screen.getByText('CSK')).toBeDefined();
    expect(screen.getByText('198')).toBeDefined();
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getByText('18.2')).toBeDefined();
    expect(screen.getByText('/20')).toBeDefined();
    expect(screen.getByText('1ST INNINGS')).toBeDefined();
  });

  it('renders bowler figures and bowling team medallion', () => {
    render(<IPL25Overlay />);

    expect(screen.getByText('Jasprit Bumrah')).toBeDefined();
    expect(screen.getByText('24-2')).toBeDefined();
    expect(screen.getByText('MI')).toBeDefined();
  });

  it('renders over progress badges including dot balls, boundaries, and wickets', () => {
    render(<IPL25Overlay />);

    expect(screen.getByTitle('Dot Ball')).toBeDefined();
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getByText('6')).toBeDefined();
    expect(screen.getByText('W')).toBeDefined();
    expect(screen.getByText('WD')).toBeDefined();
  });

  it('renders celebration takeover for animations', () => {
    useBroadcastStore.setState({ activeAnimation: 'FOUR' as any });
    render(<IPL25Overlay />);

    expect(screen.getAllByText('FOUR').length).toBeGreaterThan(0);
  });

  it('mounts IPL25Overlay in OverlayStage when tournamentId is ipl25', () => {
    render(<OverlayStage />);

    expect(screen.getByText('CSK')).toBeDefined();
    expect(screen.getByText('Ruturaj Gaikwad')).toBeDefined();
    expect(screen.getByText('Jasprit Bumrah')).toBeDefined();
  });
});
