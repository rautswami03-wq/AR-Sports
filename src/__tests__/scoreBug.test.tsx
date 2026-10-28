import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBug } from '../components/overlays/ScoreBug';
import { OverlayStage } from '../components/control/OverlayStage';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('ScoreBug Component & OverlayStage Mounting Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'CSK',
        fullName: 'Chennai Super Kings',
        primaryColor: '#FFFF00',
        secondaryColor: '#0081E9',
        accentColor: '#F9CD05',
        score: 178,
        wickets: 4,
        overs: 18,
        balls: 2,
        extras: 6,
        playingXI: ['MS Dhoni', 'Ruturaj Gaikwad'],
        batters: [
          { id: 'b1', name: 'MS Dhoni', runs: 28, balls: 11, fours: 2, sixes: 3, isOut: false, isStriker: true },
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
          { id: 'bw1', name: 'Jasprit Bumrah', overs: 3, ballsInCurrentOver: 2, maidens: 0, runsConceded: 22, wickets: 2, economy: 6.6, isCurrent: true },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      matchDetails: {
        title: 'IPL 2025',
        tournament: 'TATA IPL 2025',
        stage: 'FINAL',
        venue: 'CHENNAI',
        tossWinner: 'CSK',
        tossDecision: 'bat',
        targetRuns: 0,
        currentInnings: 1,
        totalOvers: 20,
        recentBalls: ['1', '4', '0', '6'],
        partnership: {
          runs: 45,
          balls: 20,
          batter1Name: 'MS Dhoni',
          batter1Runs: 28,
          batter1Balls: 11,
          batter2Name: 'Ruturaj Gaikwad',
          batter2Runs: 17,
          batter2Balls: 9,
        },
        fallOfWickets: [],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
      },
      activeOverlays: {
        scoreBug: true,
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

  it('renders ScoreBug with IPL 2025 Kite metrics directly', () => {
    render(<ScoreBug />);
    expect(screen.getByText('CSK')).toBeDefined();
    expect(screen.getByText('178')).toBeDefined();
    expect(screen.getByText('-4')).toBeDefined();
    expect(screen.getByText(/18\.2/)).toBeDefined();
    expect(screen.getByText('MS Dhoni')).toBeDefined();
  });

  it('renders ScoreBug in OverlayStage when activeOverlays.scoreBug is true', () => {
    render(<OverlayStage />);
    expect(screen.getByText('CSK')).toBeDefined();
    expect(screen.getByText('178')).toBeDefined();
    expect(screen.getByText(/18\.2/)).toBeDefined();
  });
});
