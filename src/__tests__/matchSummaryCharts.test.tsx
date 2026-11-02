import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ManhattanChart } from '../components/overlays/ManhattanChart';
import { WormChart } from '../components/overlays/WormChart';
import { DoubleBarChart } from '../components/overlays/DoubleBarChart';
import { MatchSummaryCard } from '../components/overlays/MatchSummaryCard';
import { useBroadcastStore, BallLogEntry } from '../store/useBroadcastStore';
import { OverChartData } from '../components/overlays/chartDataHelper';

describe('IPL 2025 Match Summary Charts Suite', () => {
  const mockChartData: OverChartData[] = [
    {
      over: 1,
      label: 'Ov 1',
      runs: 10,
      hasWicket: false,
      wickets: 0,
      cumulativeRuns: 10,
      teamARuns: 10,
      teamBRuns: 8,
      teamACumulative: 10,
      teamBCumulative: 8,
      teamAWicket: false,
      teamBWicket: false,
    },
    {
      over: 2,
      label: 'Ov 2',
      runs: 6,
      hasWicket: true, // Wicket fell in over 2
      wickets: 1,
      cumulativeRuns: 16,
      teamARuns: 6,
      teamBRuns: 12,
      teamACumulative: 16,
      teamBCumulative: 20,
      teamAWicket: true,
      teamBWicket: false,
    },
    {
      over: 3,
      label: 'Ov 3',
      runs: 14,
      hasWicket: false,
      wickets: 0,
      cumulativeRuns: 30,
      teamARuns: 14,
      teamBRuns: 9,
      teamACumulative: 30,
      teamBCumulative: 29,
      teamAWicket: false,
      teamBWicket: true,
    },
  ];

  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: {
        id: 'teamA',
        shortName: 'MI',
        fullName: 'MUMBAI INDIANS',
        primaryColor: '#004BA0',
        secondaryColor: '#FF5A00',
        accentColor: '#FFDC35',
        score: 185,
        wickets: 3,
        overs: 20,
        balls: 0,
        extras: 4,
        playingXI: ['Rohit Sharma', 'Hardik Pandya'],
        batters: [
          { id: 'b1', name: 'ROHIT SHARMA', runs: 65, balls: 40, fours: 7, sixes: 3, isStriker: false, isOut: true },
          { id: 'b2', name: 'HARDIK PANDYA', runs: 45, balls: 22, fours: 3, sixes: 4, isStriker: true, isOut: false },
        ],
        bowlers: [
          { id: 'bw1', name: 'JASPRIT BUMRAH', overs: 4, ballsInCurrentOver: 0, maidens: 1, runsConceded: 18, wickets: 3, economy: 4.5 },
        ],
      },
      teamB: {
        id: 'teamB',
        shortName: 'CSK',
        fullName: 'CHENNAI SUPER KINGS',
        primaryColor: '#FFFF00',
        secondaryColor: '#0081E9',
        accentColor: '#F9CD05',
        score: 170,
        wickets: 7,
        overs: 20,
        balls: 0,
        extras: 6,
        playingXI: ['Ruturaj Gaikwad', 'Ravindra Jadeja'],
        batters: [
          { id: 'b3', name: 'RUTURAJ GAIKWAD', runs: 55, balls: 38, fours: 5, sixes: 2, isStriker: false, isOut: true },
        ],
        bowlers: [
          { id: 'bw2', name: 'RAVINDRA JADEJA', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 32, wickets: 1, economy: 8.0 },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      ballLog: [],
      matchDetails: {
        title: 'IPL Final 2025',
        tournament: 'TATA IPL 2025',
        stage: 'FINAL',
        venue: 'AHMEDABAD',
        tossWinner: 'MI',
        tossDecision: 'bat',
        targetRuns: 186,
        totalOvers: 20,
        currentInnings: 2,
        recentBalls: ['1', '4', 'W'],
        partnership: { runs: 50, balls: 25, batter1Name: 'ROHIT SHARMA', batter1Runs: 25, batter1Balls: 12, batter2Name: 'HARDIK PANDYA', batter2Runs: 25, batter2Balls: 13 },
        fallOfWickets: [],
        matchStatusText: 'MATCH OVER',
        isMatchStarted: true,
        winnerTeamId: 'teamA',
        winnerMargin: '15 RUNS',
      },
    });
  });

  it('renders ManhattanChart with overs on X-axis, runs on Y-axis, batting team colors, and wicket indicators', () => {
    render(
      <ManhattanChart
        data={mockChartData}
        battingTeamColor="#004BA0"
        teamName="MUMBAI INDIANS"
      />
    );

    expect(screen.getByTestId('manhattan-chart')).toBeDefined();
    expect(screen.getByText(/MUMBAI INDIANS — RUNS PER OVER/)).toBeDefined();
    expect(screen.getByText('RUNS')).toBeDefined();
    expect(screen.getByText('WICKET FALLEN')).toBeDefined();
  });

  it('renders WormChart with cumulative runs on Y-axis and Team A (Red) & Team B (Blue) lines', () => {
    render(
      <WormChart
        data={mockChartData}
        teamAName="MI"
        teamBName="CSK"
      />
    );

    expect(screen.getByTestId('worm-chart')).toBeDefined();
    expect(screen.getByText('WORM — CUMULATIVE RUN PROGRESSION')).toBeDefined();
    expect(screen.getByText(/MI \(Red\)/)).toBeDefined();
    expect(screen.getByText(/CSK \(Blue\)/)).toBeDefined();
  });

  it('renders DoubleBarChart comparing runs per over for both teams side-by-side', () => {
    render(
      <DoubleBarChart
        data={mockChartData}
        teamAName="MI"
        teamBName="CSK"
      />
    );

    expect(screen.getByTestId('double-bar-chart')).toBeDefined();
    expect(screen.getByText('RUNS PER OVER COMPARISON')).toBeDefined();
    expect(screen.getAllByText('MI').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CSK').length).toBeGreaterThan(0);
  });

  it('integrates into MatchSummaryCard allowing user to toggle between "Table", "Bar Chart", and "Worm Chart"', () => {
    render(<MatchSummaryCard />);

    // Toggle Buttons rendered
    const tableBtn = screen.getByRole('button', { name: /Table/i });
    const barBtn = screen.getByRole('button', { name: /Bar Chart/i });
    const wormBtn = screen.getByRole('button', { name: /Worm Chart/i });

    expect(tableBtn).toBeDefined();
    expect(barBtn).toBeDefined();
    expect(wormBtn).toBeDefined();

    // Default view: Table
    expect(screen.getByTestId('summary-table-view')).toBeDefined();

    // Toggle to "Bar Chart"
    fireEvent.click(barBtn);
    expect(screen.getByTestId('summary-bar-view')).toBeDefined();
    expect(screen.getByTestId('manhattan-chart')).toBeDefined();

    // Toggle to "Worm Chart"
    fireEvent.click(wormBtn);
    expect(screen.getByTestId('summary-worm-view')).toBeDefined();
    expect(screen.getByTestId('worm-chart')).toBeDefined();

    // Toggle back to "Table"
    fireEvent.click(tableBtn);
    expect(screen.getByTestId('summary-table-view')).toBeDefined();
  });
});

