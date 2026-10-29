import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { T20EmergingAsiaCupOverlay } from '../components/overlays/T20EmergingAsiaCupOverlay';
import { OverlayStage } from '../components/control/OverlayStage';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('T20EmergingAsiaCupOverlay Suite', () => {
  beforeEach(() => {
    const currentState = useBroadcastStore.getState();
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'IND',
        fullName: 'India A',
        primaryColor: '#00529B',
        secondaryColor: '#FF9933',
        accentColor: '#00D2FF',
        score: 184,
        wickets: 3,
        overs: 17,
        balls: 4,
        extras: 8,
        playingXI: ['Abhishek Sharma', 'Tilak Varma'],
        batters: [
          { id: 'b1', name: 'Tilak Varma', runs: 64, balls: 38, fours: 5, sixes: 4, isOut: false, isStriker: true },
          { id: 'b2', name: 'Abhishek Sharma', runs: 35, balls: 22, fours: 3, sixes: 2, isOut: false, isStriker: false },
        ],
        bowlers: [],
      },
      teamB: {
        id: 'teamB',
        shortName: 'PAK',
        fullName: 'Pakistan A',
        primaryColor: '#01411C',
        secondaryColor: '#808000',
        accentColor: '#00FF66',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Sufiyan Muqeem'],
        batters: [],
        bowlers: [
          { id: 'bw1', name: 'Sufiyan Muqeem', overs: 3, ballsInCurrentOver: 4, maidens: 0, runsConceded: 26, wickets: 2, economy: 7.09, isCurrent: true },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      tournamentId: 't20_asia24',
      matchDetails: {
        ...currentState.matchDetails,
        title: 'ACC Men’s T20 Emerging Teams Asia Cup 2024',
        tournament: 'T20 EMERGING ASIA CUP 2024',
        currentInnings: 1,
        totalOvers: 20,
        targetRuns: 0,
        tossWinner: 'India A',
        tossDecision: 'bat',
        recentBalls: ['0', '1', '4', 'WD', '6', 'W'],
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

  it('renders striker and non-striker details with scores', () => {
    render(<T20EmergingAsiaCupOverlay />);

    expect(screen.getByText('Tilak Varma')).toBeDefined();
    expect(screen.getByText('64')).toBeDefined();
    expect(screen.getByText('(38)')).toBeDefined();

    expect(screen.getByText('Abhishek Sharma')).toBeDefined();
    expect(screen.getByText('35')).toBeDefined();
    expect(screen.getByText('(22)')).toBeDefined();
  });

  it('renders batting team score, wickets, and overs', () => {
    render(<T20EmergingAsiaCupOverlay />);

    expect(screen.getByText('IND')).toBeDefined();
    expect(screen.getByText('184')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('17.4')).toBeDefined();
    expect(screen.getByText('(20)')).toBeDefined();
  });

  it('renders bowler name and figures', () => {
    render(<T20EmergingAsiaCupOverlay />);

    expect(screen.getByText('Sufiyan Muqeem')).toBeDefined();
    expect(screen.getByText('26-2')).toBeDefined();
  });

  it('renders over progress ball indicators', () => {
    render(<T20EmergingAsiaCupOverlay />);

    expect(screen.getByTitle('Dot Ball')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('6')).toBeDefined();
    expect(screen.getByText('W')).toBeDefined();
    expect(screen.getByText('WD')).toBeDefined();
  });

  it('renders celebration takeover when activeAnimation is set', () => {
    useBroadcastStore.setState({ activeAnimation: 'SIX' as any });
    render(<T20EmergingAsiaCupOverlay />);

    expect(screen.getByText('SIX !')).toBeDefined();
  });

  it('mounts T20EmergingAsiaCupOverlay inside OverlayStage when tournamentId is t20_asia24', () => {
    render(<OverlayStage />);

    expect(screen.getByText('IND')).toBeDefined();
    expect(screen.getByText('Tilak Varma')).toBeDefined();
    expect(screen.getByText('Sufiyan Muqeem')).toBeDefined();
  });
});
