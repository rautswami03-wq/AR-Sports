import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BatterLowerThird } from '../components/overlays/BatterLowerThird';
import { BowlerLowerThird } from '../components/overlays/BowlerLowerThird';
import { PartnershipLowerThird } from '../components/overlays/PartnershipLowerThird';
import { ManOfTheMatchLowerThird } from '../components/overlays/ManOfTheMatchLowerThird';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('IPL 2025 Lower Thirds Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'MI',
        fullName: 'MUMBAI INDIANS',
        primaryColor: '#004BA0',
        secondaryColor: '#D1AB3E',
        accentColor: '#FFF',
        score: 185,
        wickets: 3,
        overs: 18,
        balls: 4,
        extras: 8,
        playingXI: ['Rohit Sharma', 'Hardik Pandya'],
        batters: [
          {
            id: 'b1',
            name: 'HARDIK PANDYA',
            runs: 48,
            balls: 22,
            fours: 4,
            sixes: 3,
            isOut: false,
            isStriker: true,
          },
          {
            id: 'b2',
            name: 'TILAK VARMA',
            runs: 35,
            balls: 20,
            fours: 3,
            sixes: 1,
            isOut: false,
            isStriker: false,
          },
        ],
        bowlers: [
          {
            id: 'bw1',
            name: 'JASPRIT BUMRAH',
            overs: 3,
            ballsInCurrentOver: 4,
            maidens: 1,
            runsConceded: 18,
            wickets: 3,
            economy: 4.9,
            isCurrent: true,
          },
        ],
      },
      teamB: {
        id: 'teamB',
        shortName: 'CSK',
        fullName: 'CHENNAI SUPER KINGS',
        primaryColor: '#FFFF00',
        secondaryColor: '#0081E9',
        accentColor: '#F9CD05',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        playingXI: ['Ravindra Jadeja'],
        batters: [],
        bowlers: [
          {
            id: 'bw2',
            name: 'RAVINDRA JADEJA',
            overs: 4,
            ballsInCurrentOver: 0,
            maidens: 0,
            runsConceded: 28,
            wickets: 2,
            economy: 7.0,
            isCurrent: true,
          },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      matchDetails: {
        title: 'IPL 2025',
        tournament: 'TATA IPL 2025',
        stage: 'FINAL',
        venue: 'MUMBAI',
        tossWinner: 'MI',
        tossDecision: 'bat',
        targetRuns: 0,
        currentInnings: 1,
        totalOvers: 20,
        recentBalls: ['1', '4', '6', 'W'],
        partnership: {
          runs: 62,
          balls: 31,
          batter1Name: 'HARDIK PANDYA',
          batter1Runs: 34,
          batter1Balls: 16,
          batter2Name: 'TILAK VARMA',
          batter2Runs: 28,
          batter2Balls: 15,
        },
        fallOfWickets: [],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
        playerOfTheMatch: {
          name: 'JASPRIT BUMRAH',
          team: 'MUMBAI INDIANS',
          stats: '3/18 (3.4 ov)',
        },
      },
    });
  });

  it('renders BatterLowerThird with name, runs, balls, and metric blocks', () => {
    render(<BatterLowerThird />);
    expect(screen.getAllByText('HARDIK PANDYA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('MUMBAI INDIANS').length).toBeGreaterThan(0);
    expect(screen.getByText('DOTS')).toBeDefined();
    expect(screen.getByText('FOURS')).toBeDefined();
    expect(screen.getByText('SIXES')).toBeDefined();
    expect(screen.getByText('STRIKE RATE')).toBeDefined();
  });

  it('renders BowlerLowerThird with overs, runs, wickets, and economy blocks', () => {
    render(<BowlerLowerThird />);
    expect(screen.getAllByText('RAVINDRA JADEJA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CHENNAI SUPER KINGS').length).toBeGreaterThan(0);
    expect(screen.getByText('OVERS')).toBeDefined();
    expect(screen.getByText('RUNS')).toBeDefined();
    expect(screen.getByText('WICKETS')).toBeDefined();
    expect(screen.getByText('ECONOMY')).toBeDefined();
  });

  it('renders PartnershipLowerThird with batter stands and total partnership metrics', () => {
    render(<PartnershipLowerThird />);
    expect(screen.getAllByText('PARTNERSHIP').length).toBeGreaterThan(0);
    expect(screen.getAllByText('HARDIK PANDYA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TILAK VARMA').length).toBeGreaterThan(0);
    expect(screen.getByText(/62/)).toBeDefined();
  });

  it('renders ManOfTheMatchLowerThird with award title, batting, and bowling summaries', () => {
    render(<ManOfTheMatchLowerThird />);
    expect(screen.getAllByText('JASPRIT BUMRAH').length).toBeGreaterThan(0);
    expect(screen.getByText('★ MAN OF THE MATCH ★')).toBeDefined();
    expect(screen.getByText('BATTING')).toBeDefined();
    expect(screen.getByText('BOWLING')).toBeDefined();
  });
});
