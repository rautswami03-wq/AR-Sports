import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CricAstraOverlay } from '../components/overlays/CricAstraOverlay';
import { OverlayStage } from '../components/control/OverlayStage';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('CricAstraOverlay Suite', () => {
  beforeEach(() => {
    const currentState = useBroadcastStore.getState();
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'IND',
        fullName: 'India',
        primaryColor: '#008bff',
        secondaryColor: '#ffffff',
        accentColor: '#008bff',
        score: 185,
        wickets: 3,
        overs: 17,
        balls: 4,
        extras: 8,
        playingXI: ['Virat Kohli', 'Rohit Sharma'],
        batters: [
          { id: 'b1', name: 'Virat Kohli', runs: 82, balls: 51, fours: 6, sixes: 4, isOut: false, isStriker: true },
          { id: 'b2', name: 'Rohit Sharma', runs: 55, balls: 32, fours: 5, sixes: 3, isOut: false, isStriker: false },
        ],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'AUS',
        fullName: 'Australia',
        primaryColor: '#e51970',
        secondaryColor: '#ffffff',
        accentColor: '#e51970',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Mitchell Starc'],
        batters: [],
        bowlers: [
          { id: 'bw1', name: 'Mitchell Starc', overs: 3, ballsInCurrentOver: 4, maidens: 0, runsConceded: 31, wickets: 2, economy: 8.5, isCurrent: true },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      tournamentId: 'cricastra',
      matchDetails: {
        ...currentState.matchDetails,
        title: 'CricAstra Cup 2025',
        tournament: 'CricAstra Cup',
        currentInnings: 1,
        totalOvers: 20,
        targetRuns: 0,
        tossWinner: 'India',
        tossDecision: 'bat',
        recentBalls: ['1', '4', '0', '6'],
      },
      activeOverlays: {
        ...currentState.activeOverlays,
        scoreBug: true,
      },
    });
  });

  it('renders CricAstra scorebug with team badge and score', () => {
    render(<CricAstraOverlay />);
    expect(screen.getByText('IND')).toBeDefined();
    expect(screen.getByText('185-3')).toBeDefined();
    expect(screen.getByText(/17\.4 \/ 20 OVR/)).toBeDefined();
  });

  it('renders striker and non-striker player statistics', () => {
    render(<CricAstraOverlay />);
    expect(screen.getByText('Virat Kohli')).toBeDefined();
    expect(screen.getByText('82')).toBeDefined();
    expect(screen.getByText('(51)')).toBeDefined();

    expect(screen.getByText('Rohit Sharma')).toBeDefined();
    expect(screen.getByText('55')).toBeDefined();
    expect(screen.getByText('(32)')).toBeDefined();
  });

  it('renders bowler figures and recent ball badges', () => {
    render(<CricAstraOverlay />);
    expect(screen.getByText('Mitchell Starc')).toBeDefined();
    expect(screen.getByText('2-31')).toBeDefined();
    expect(screen.getByText('(3.4)')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
  });

  it('calculates target chase metrics in second innings', () => {
    useBroadcastStore.setState({
      matchDetails: {
        ...useBroadcastStore.getState().matchDetails,
        currentInnings: 2,
        targetRuns: 195,
      },
      teamA: {
        ...useBroadcastStore.getState().teamA,
        score: 160,
        overs: 16,
        balls: 0,
      },
    });
    render(<CricAstraOverlay />);
    // Need 35 runs from 24 balls
    expect(screen.getByText(/NEED 35 FROM 24 BALLS/)).toBeDefined();
  });

  it('mounts inside OverlayStage when tournamentId is cricastra', () => {
    useBroadcastStore.setState({ tournamentId: 'cricastra' });
    render(<OverlayStage />);
    expect(screen.getByText('IND')).toBeDefined();
    expect(screen.getByText('185-3')).toBeDefined();
  });
});
