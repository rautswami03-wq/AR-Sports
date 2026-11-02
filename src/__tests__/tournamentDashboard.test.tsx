import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  calculateExactOvers,
  calculateNRR,
  calculatePointsTable,
  sortPointsTable,
  useTournamentStore,
  TournamentTeamStanding,
  MatchRecordInput,
} from '../store/useTournamentStore';
import { TournamentDetailPage } from '../components/control/TournamentDetailPage';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('Web Dashboard & Tournament Points Table Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    useTournamentStore.setState({ standingsByTournament: {} });
    useBroadcastStore.getState().resetMatchState();
  });

  it('1. Points Table sorts automatically: 1st Points (DESC), 2nd Net Run Rate (DESC)', () => {
    const mockStandings: TournamentTeamStanding[] = [
      {
        teamId: 'team_csk',
        teamName: 'CHENNAI SUPER KINGS',
        shortName: 'CSK',
        played: 3,
        won: 2,
        lost: 1,
        tied: 0,
        noResult: 0,
        points: 4,
        runsScored: 520,
        oversFaced: 60,
        runsConceded: 480,
        oversBowled: 60,
        nrr: 0.667,
        nrrFormatted: '+0.667',
      },
      {
        teamId: 'team_mi',
        teamName: 'MUMBAI INDIANS',
        shortName: 'MI',
        played: 3,
        won: 3,
        lost: 0,
        tied: 0,
        noResult: 0,
        points: 6,
        runsScored: 580,
        oversFaced: 60,
        runsConceded: 500,
        oversBowled: 60,
        nrr: 1.333,
        nrrFormatted: '+1.333',
      },
      {
        teamId: 'team_rcb',
        teamName: 'ROYAL CHALLENGERS',
        shortName: 'RCB',
        played: 3,
        won: 2,
        lost: 1,
        tied: 0,
        noResult: 0,
        points: 4,
        runsScored: 550,
        oversFaced: 60,
        runsConceded: 460,
        oversBowled: 60,
        nrr: 1.500,
        nrrFormatted: '+1.500',
      },
      {
        teamId: 'team_kkr',
        teamName: 'KOLKATA KNIGHT RIDERS',
        shortName: 'KKR',
        played: 3,
        won: 0,
        lost: 3,
        tied: 0,
        noResult: 0,
        points: 0,
        runsScored: 420,
        oversFaced: 60,
        runsConceded: 630,
        oversBowled: 60,
        nrr: -3.500,
        nrrFormatted: '-3.500',
      },
    ];

    const sorted = sortPointsTable(mockStandings);

    // 1st place: MI (6 points)
    expect(sorted[0].shortName).toBe('MI');
    expect(sorted[0].points).toBe(6);

    // 2nd place: RCB (4 points, NRR +1.500) beats CSK (4 points, NRR +0.667)
    expect(sorted[1].shortName).toBe('RCB');
    expect(sorted[1].points).toBe(4);
    expect(sorted[1].nrr).toBe(1.5);

    // 3rd place: CSK (4 points, NRR +0.667)
    expect(sorted[2].shortName).toBe('CSK');
    expect(sorted[2].points).toBe(4);
    expect(sorted[2].nrr).toBe(0.667);

    // 4th place: KKR (0 points)
    expect(sorted[3].shortName).toBe('KKR');
    expect(sorted[3].points).toBe(0);
  });

  it('2. NRR Calculation logic: (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled), using full quota if bowled out', () => {
    // Case A: Team not bowled out: 19 overs, 3 balls -> 19 + 3/6 = 19.5 overs
    const normalOvers = calculateExactOvers(19, 3, false, 20);
    expect(normalOvers).toBeCloseTo(19.5, 3);

    // Case B: Team bowled out at 14.2 overs in a 20-over match -> Full quota (20 overs) MUST be used
    const bowledOutOvers = calculateExactOvers(14, 2, true, 20);
    expect(bowledOutOvers).toBe(20);

    // Match scenario:
    // Team A: 160 all out (10 wickets) in 18.2 overs -> credited 20.0 overs faced
    // Team B: chases 161/4 in 17.3 overs -> credited 17.5 overs faced (not bowled out)
    const matches: MatchRecordInput[] = [
      {
        teamA: 'TEAM A',
        teamB: 'TEAM B',
        overs: 20,
        teamAScore: 160,
        teamAWickets: 10, // Bowled out
        teamAOvers: 18,
        teamABalls: 2,
        teamBScore: 161,
        teamBWickets: 4, // Not bowled out
        teamBOvers: 17,
        teamBBalls: 3, // 17.5 overs
        winner: 'TEAM B',
      },
    ];

    const standings = calculatePointsTable(matches, 20);

    const teamBStanding = standings.find((s) => s.teamName === 'TEAM B')!;
    const teamAStanding = standings.find((s) => s.teamName === 'TEAM A')!;

    // Team B won -> 2 points
    expect(teamBStanding.points).toBe(2);
    expect(teamBStanding.won).toBe(1);

    // Team B Run Rate For: 161 runs / 17.5 overs = 9.200
    // Team B Run Rate Against: 160 runs conceded / 20.0 overs bowled (since Team A was bowled out) = 8.000
    // Team B NRR = 9.200 - 8.000 = +1.200
    expect(teamBStanding.nrr).toBeCloseTo(1.2, 2);
    expect(teamBStanding.nrrFormatted).toBe('+1.200');

    // Team A Run Rate For: 160 runs / 20.0 overs faced = 8.000
    // Team A Run Rate Against: 161 runs conceded / 17.5 overs bowled = 9.200
    // Team A NRR = 8.000 - 9.200 = -1.200
    expect(teamAStanding.nrr).toBeCloseTo(-1.2, 2);
    expect(teamAStanding.nrrFormatted).toBe('-1.200');
  });

  it('3. Archiving or ending a match in useBroadcastStore updates useTournamentStore Points Table instantly', () => {
    const store = useBroadcastStore.getState();

    // Setup an in-progress match in the broadcast store
    store.updateTeamDetails('teamA', { fullName: 'TITANS', shortName: 'GT' });
    store.updateTeamDetails('teamB', { fullName: 'WARRIORS', shortName: 'WAR' });
    store.updateMatchSettings({
      tournamentId: 'tourn_championship_2026',
      tournament: 'National Championship',
      totalOvers: 20,
    });

    // Score 200 runs for Team A
    useBroadcastStore.setState((state) => ({
      ...state,
      teamA: {
        ...state.teamA,
        fullName: 'TITANS',
        shortName: 'GT',
        score: 200,
        wickets: 5,
        overs: 20,
        balls: 0,
      },
      teamB: {
        ...state.teamB,
        fullName: 'WARRIORS',
        shortName: 'WAR',
        score: 180,
        wickets: 8,
        overs: 20,
        balls: 0,
      },
    }));

    // Archive and end match
    act(() => {
      useBroadcastStore.getState().archiveAndReset();
    });

    // Verify useTournamentStore was instantly updated
    const tournamentStandings = useTournamentStore.getState().getStandings('tourn_championship_2026');
    expect(tournamentStandings.length).toBeGreaterThanOrEqual(2);

    const winnerStanding = tournamentStandings[0];
    expect(winnerStanding.teamName).toBe('TITANS');
    expect(winnerStanding.points).toBe(2);
    expect(winnerStanding.won).toBe(1);
    expect(winnerStanding.nrr).toBeGreaterThan(0);

    const loserStanding = tournamentStandings[1];
    expect(loserStanding.teamName).toBe('WARRIORS');
    expect(loserStanding.points).toBe(0);
    expect(loserStanding.lost).toBe(1);
    expect(loserStanding.nrr).toBeLessThan(0);
  });

  it('4. Share Dashboard button copies public URL to clipboard', () => {
    // Mock clipboard
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <MemoryRouter initialEntries={['/tournament/tour_sample_123']}>
        <Routes>
          <Route path="/tournament/:id" element={<TournamentDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const shareBtn = screen.getByTestId('share-dashboard-btn');
    expect(shareBtn).toBeDefined();

    fireEvent.click(shareBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock.mock.calls[0][0]).toContain('/public/tournament/tour_sample_123');

    // Button should display feedback
    expect(screen.getByText(/Dashboard Link Copied!/i)).toBeDefined();

    // Switch to Points Table tab
    const pointsTableTab = screen.getByTestId('points-table-tab');
    fireEvent.click(pointsTableTab);

    // Verify Points Table heading & columns
    expect(screen.getByText(/Official Points Table & Standings/i)).toBeDefined();
    expect(screen.getByTestId('points-table')).toBeDefined();
  });
});

