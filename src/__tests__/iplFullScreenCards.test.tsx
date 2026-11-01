import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamsLineupCard } from '../components/overlays/TeamsLineupCard';
import { BattingScorecardCard } from '../components/overlays/BattingScorecardCard';
import { BowlingScorecardCard } from '../components/overlays/BowlingScorecardCard';
import { MatchSummaryCard } from '../components/overlays/MatchSummaryCard';
import { PlayerProfileCard } from '../components/overlays/PlayerProfileCard';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('IPL 2025 Full-Screen Cards Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'CSK',
        fullName: 'CHENNAI SUPER KINGS',
        primaryColor: '#FFFF00',
        secondaryColor: '#0081E9',
        accentColor: '#F9CD05',
        score: 175,
        wickets: 4,
        overs: 20,
        balls: 0,
        extras: 6,
        playingXI: ['Ruturaj Gaikwad', 'Devon Conway', 'Shivam Dube', 'MS Dhoni'],
        batters: [
          { id: 'b1', name: 'RUTURAJ GAIKWAD', runs: 58, balls: 36, fours: 6, sixes: 2, isOut: true, dismissal: 'b J BUMRAH' },
          { id: 'b2', name: 'DEVON CONWAY', runs: 44, balls: 32, fours: 5, sixes: 1, isOut: true, dismissal: 'c R SHARMA b D CHAHAR' },
          { id: 'b3', name: 'SHIVAM DUBE', runs: 42, balls: 24, fours: 2, sixes: 4, isOut: false, isStriker: true },
          { id: 'b4', name: 'MS DHONI', runs: 25, balls: 10, fours: 2, sixes: 2, isOut: false, isStriker: false },
        ],
        bowlers: [
          { id: 'bw1', name: 'M PATHIRANA', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.0 },
        ],
      },
      teamB: {
        id: 'teamB',
        shortName: 'MI',
        fullName: 'MUMBAI INDIANS',
        primaryColor: '#004BA0',
        secondaryColor: '#D1AB3E',
        accentColor: '#FFF',
        score: 178,
        wickets: 2,
        overs: 18,
        balls: 2,
        extras: 4,
        playingXI: ['Rohit Sharma', 'Ishan Kishan', 'Suryakumar Yadav', 'Hardik Pandya'],
        batters: [
          { id: 'b21', name: 'ROHIT SHARMA', runs: 82, balls: 50, fours: 8, sixes: 4, isOut: false, isStriker: true },
          { id: 'b22', name: 'HARDIK PANDYA', runs: 34, balls: 18, fours: 3, sixes: 2, isOut: false, isStriker: false },
        ],
        bowlers: [
          { id: 'bw21', name: 'JASPRIT BUMRAH', overs: 4, ballsInCurrentOver: 0, maidens: 1, runsConceded: 18, wickets: 2, economy: 4.5, isCurrent: true },
          { id: 'bw22', name: 'DEEPAK CHAHAR', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 32, wickets: 1, economy: 8.0 },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      tournamentId: 'ipl25',
      matchDetails: {
        title: 'IPL 2025 FINAL',
        tournament: 'TATA IPL 2025',
        stage: 'FINAL',
        venue: 'WANKHEDE STADIUM',
        tossWinner: 'CSK',
        tossDecision: 'bat',
        targetRuns: 176,
        currentInnings: 2,
        totalOvers: 20,
        recentBalls: ['1', '4', '6', '1'],
        partnership: {
          runs: 55,
          balls: 28,
          batter1Name: 'ROHIT SHARMA',
          batter1Runs: 32,
          batter1Balls: 16,
          batter2Name: 'HARDIK PANDYA',
          batter2Runs: 23,
          batter2Balls: 12,
        },
        fallOfWickets: [
          { wicketNumber: 1, runs: 28, over: '3.2', batterName: 'ISHAN KISHAN' },
          { wicketNumber: 2, runs: 123, over: '12.4', batterName: 'SURYAKUMAR YADAV' },
        ],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
        winnerTeamId: 'teamB',
        winnerMargin: '8 WICKETS',
      },
    });
  });

  it('renders TeamsLineupCard with columns for Team A and Team B and captain highlights', () => {
    render(<TeamsLineupCard />);
    expect(screen.getByText('PLAYING XI LINEUP')).toBeDefined();
    expect(screen.getAllByText('CHENNAI SUPER KINGS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('MUMBAI INDIANS').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CAPTAIN \(C\)/).length).toBe(2);
  });

  it('renders BattingScorecardCard with batter dismissals, runs, balls, and total summary', () => {
    render(<BattingScorecardCard />);
    expect(screen.getAllByText('CHENNAI SUPER KINGS').length).toBeGreaterThan(0);
    expect(screen.getByText('RUTURAJ GAIKWAD')).toBeDefined();
    expect(screen.getByText('b J BUMRAH')).toBeDefined();
    expect(screen.getByText('175 - 4')).toBeDefined();
  });

  it('renders BowlingScorecardCard with bowler economy, dots, overs, and fall of wickets', () => {
    render(<BowlingScorecardCard />);
    expect(screen.getAllByText('MUMBAI INDIANS').length).toBeGreaterThan(0);
    expect(screen.getByText('JASPRIT BUMRAH')).toBeDefined();
    expect(screen.getByText('FALL OF WICKETS:')).toBeDefined();
  });

  it('renders MatchSummaryCard with split team innings and winner banner', () => {
    render(<MatchSummaryCard />);
    expect(screen.getByText('MATCH SUMMARY')).toBeDefined();
    expect(screen.getByText(/MUMBAI INDIANS WON BY 8 WICKETS/)).toBeDefined();
  });

  it('renders PlayerProfileCard with batting and bowling career stats', () => {
    render(<PlayerProfileCard />);
    expect(screen.getByText('PLAYER PROFILE')).toBeDefined();
    expect(screen.getByText('BATTING STATS')).toBeDefined();
    expect(screen.getByText('BOWLING STATS')).toBeDefined();
  });
});

