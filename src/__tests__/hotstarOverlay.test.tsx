import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HotstarOverlay } from '../components/overlays/HotstarOverlay';
import { OverlayStage } from '../components/control/OverlayStage';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('HotstarOverlay Suite', () => {
  beforeEach(() => {
    const currentState = useBroadcastStore.getState();
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'IND',
        fullName: 'India',
        primaryColor: '#00529B',
        secondaryColor: '#FF9933',
        accentColor: '#00D2FF',
        score: 172,
        wickets: 2,
        overs: 16,
        balls: 3,
        extras: 6,
        playingXI: ['Shubman Gill', 'Suryakumar Yadav'],
        batters: [
          { id: 'b1', name: 'Shubman Gill', runs: 64, balls: 40, fours: 7, sixes: 2, isOut: false, isStriker: true },
          { id: 'b2', name: 'Suryakumar Yadav', runs: 42, balls: 19, fours: 4, sixes: 3, isOut: false, isStriker: false },
        ],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'PAK',
        fullName: 'Pakistan',
        primaryColor: '#01411C',
        secondaryColor: '#808000',
        accentColor: '#00FF66',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Shaheen Afridi'],
        batters: [],
        bowlers: [
          { id: 'bw1', name: 'Shaheen Afridi', overs: 3, ballsInCurrentOver: 3, maidens: 0, runsConceded: 28, wickets: 1, economy: 8.0, isCurrent: true },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      tournamentId: 'hotstar',
      matchDetails: {
        ...currentState.matchDetails,
        title: 'Asia Cup Live Telecast',
        tournament: 'Asia Cup 2025',
        currentInnings: 1,
        totalOvers: 20,
        targetRuns: 0,
        tossWinner: 'IND',
        tossDecision: 'bat',
        recentBalls: ['1', '4', '6'],
      },
      activeOverlays: {
        ...currentState.activeOverlays,
        scoreBug: true,
      },
    });
  });

  it('renders Hotstar scorebug with team badge and score block', () => {
    render(<HotstarOverlay />);
    expect(screen.getByText('IND')).toBeDefined();
    expect(screen.getByText('172-2')).toBeDefined();
    expect(screen.getByText(/16\.3 \/ 20/)).toBeDefined();
  });

  it('renders striker and non-striker names and scores', () => {
    render(<HotstarOverlay />);
    expect(screen.getByText('Shubman Gill')).toBeDefined();
    expect(screen.getByText('64')).toBeDefined();
    expect(screen.getByText('(40)')).toBeDefined();

    expect(screen.getByText('Suryakumar Yadav')).toBeDefined();
    expect(screen.getByText('42')).toBeDefined();
    expect(screen.getByText('(19)')).toBeDefined();
  });

  it('renders bowler figures and over ball indicators', () => {
    render(<HotstarOverlay />);
    expect(screen.getByText('Shaheen Afridi')).toBeDefined();
    expect(screen.getByText('1-28')).toBeDefined();
    expect(screen.getByText('(3.3)')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
  });

  it('calculates second innings target in center box', () => {
    useBroadcastStore.setState({
      matchDetails: {
        ...useBroadcastStore.getState().matchDetails,
        currentInnings: 2,
        targetRuns: 190,
      },
      teamA: {
        ...useBroadcastStore.getState().teamA,
        score: 150,
        overs: 16,
        balls: 0,
      },
    });
    render(<HotstarOverlay />);
    // 40 needed from 24 balls
    expect(screen.getByText(/REQ\. RR 10\.00/)).toBeDefined();
  });

  it('mounts inside OverlayStage when tournamentId is hotstar', () => {
    useBroadcastStore.setState({ tournamentId: 'hotstar' });
    render(<OverlayStage />);
    expect(screen.getByText('IND')).toBeDefined();
    expect(screen.getByText('172-2')).toBeDefined();
  });
});
