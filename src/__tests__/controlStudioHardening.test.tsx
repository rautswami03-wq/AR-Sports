import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { ControlStudio } from '../components/control/ControlStudio';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('ControlStudio Hardening Suite', () => {
  beforeEach(() => {
    useBroadcastStore.getState().resetMatchState();
  });

  it('1. Tab-switching state loss: preserves team names, bulk paste, and rosters in store', () => {
    // Set Team Names and Bulk Paste text directly in store
    useBroadcastStore.getState().setTeamAName('Chennai Super Kings');
    useBroadcastStore.getState().setTeamBName('Gujarat Titans');
    useBroadcastStore.getState().setTeamABulkPaste('Ruturaj Gaikwad, Devon Conway, MS Dhoni');
    useBroadcastStore.getState().setTeamBBulkPaste('Shubman Gill, Rashid Khan, Sai Sudharsan');

    render(
      <MemoryRouter>
        <ControlStudio />
      </MemoryRouter>
    );

    // Initial values loaded from store
    expect(screen.getByDisplayValue('Chennai Super Kings')).toBeDefined();
    expect(screen.getByDisplayValue('Gujarat Titans')).toBeDefined();
    expect(screen.getByDisplayValue('Ruturaj Gaikwad, Devon Conway, MS Dhoni')).toBeDefined();

    // Switch to "Colors" (Theme) tab
    const themeTabBtn = screen.getByRole('button', { name: /Colors/i });
    fireEvent.click(themeTabBtn);

    expect(screen.getByText(/LEAGUE OVERLAY THEME/i)).toBeDefined();

    // Switch back to "Controller" tab
    const controllerTabBtn = screen.getByRole('button', { name: /Controller/i });
    fireEvent.click(controllerTabBtn);

    // Verify inputs retain their values from the Zustand store
    const storeState = useBroadcastStore.getState();
    expect(storeState.teamAName).toBe('Chennai Super Kings');
    expect(storeState.teamBName).toBe('Gujarat Titans');
    expect(storeState.teamABulkPaste).toBe('Ruturaj Gaikwad, Devon Conway, MS Dhoni');
    expect(storeState.teamBBulkPaste).toBe('Shubman Gill, Rashid Khan, Sai Sudharsan');

    expect(screen.getByDisplayValue('Chennai Super Kings')).toBeDefined();
    expect(screen.getByDisplayValue('Gujarat Titans')).toBeDefined();
    expect(screen.getByDisplayValue('Ruturaj Gaikwad, Devon Conway, MS Dhoni')).toBeDefined();
  });

  it('2. Hotkeys e.repeat guard: ignores held-down key repeat events to prevent double scoring', () => {
    render(
      <MemoryRouter>
        <ControlStudio />
      </MemoryRouter>
    );
    const initialScore = useBroadcastStore.getState().teamA.score;

    // Dispatch a non-repeat keydown for "1"
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', repeat: false }));
    expect(useBroadcastStore.getState().teamA.score).toBe(initialScore + 1);

    // Dispatch a repeat keydown for "1" (holding down key)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', repeat: true }));
    // Score should NOT increase again
    expect(useBroadcastStore.getState().teamA.score).toBe(initialScore + 1);

    // Dispatch keydown with repeat for "4"
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '4', repeat: true }));
    expect(useBroadcastStore.getState().teamA.score).toBe(initialScore + 1);

    // Dispatch keydown with repeat for "6"
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '6', repeat: true }));
    expect(useBroadcastStore.getState().teamA.score).toBe(initialScore + 1);

    // Dispatch keydown with repeat for "w"
    const initialWickets = useBroadcastStore.getState().teamA.wickets;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w', repeat: true }));
    expect(useBroadcastStore.getState().teamA.wickets).toBe(initialWickets);
  });

  it('3. Match Started Lock: shows warning modal when user attempts to edit team name mid-match', () => {
    // Start match and log runs to make it mid-match
    useBroadcastStore.getState().updateMatchSettings({ isMatchStarted: true });
    useBroadcastStore.getState().addRuns(4, true, 4);

    render(
      <MemoryRouter>
        <ControlStudio />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Locked \(In Match\)/i).length).toBeGreaterThan(0);

    // Click the locked Team 1 input
    const team1Input = screen.getByDisplayValue('Team 1');
    fireEvent.click(team1Input);

    // Expect warning modal to be visible
    expect(screen.getByText(/Match In Progress — Name Edit Lock/i)).toBeDefined();
    expect(screen.getByText(/Changing team names mid-match/i)).toBeDefined();

    // Clicking "Cancel" dismisses modal
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText(/Match In Progress — Name Edit Lock/i)).toBeNull();
  });

  it('4. Active Bowler dropdown: maps over bowlingTeam.bowlers and not batters', () => {
    // Set distinct bowlers for bowling team (Team B)
    useBroadcastStore.setState((state) => ({
      ...state,
      battingTeamId: 'teamA',
      teamB: {
        ...state.teamB,
        bowlers: [
          { id: 'bw_bumrah', name: 'Jasprit Bumrah', overs: 2, ballsInCurrentOver: 0, maidens: 1, runsConceded: 10, wickets: 2, economy: 5.0, isCurrent: true },
          { id: 'bw_shami', name: 'Mohammed Shami', overs: 1, ballsInCurrentOver: 0, maidens: 0, runsConceded: 8, wickets: 1, economy: 8.0, isCurrent: false },
        ],
        batters: [
          { id: 'b_kohli', name: 'Virat Kohli', runs: 50, balls: 30, fours: 5, sixes: 2, isOut: false, isStriker: false },
        ],
      },
    }));

    render(
      <MemoryRouter>
        <ControlStudio />
      </MemoryRouter>
    );

    const bowlerSelect = screen.getByRole('combobox', { name: /Active Bowler/i }) as HTMLSelectElement;
    expect(bowlerSelect).toBeDefined();

    // Check options contain bowlers, NOT batters
    const optionTexts = Array.from(bowlerSelect.options).map((opt) => opt.text);
    expect(optionTexts.some((txt) => txt.includes('Jasprit Bumrah'))).toBe(true);
    expect(optionTexts.some((txt) => txt.includes('Mohammed Shami'))).toBe(true);
    expect(optionTexts.some((txt) => txt.includes('Virat Kohli'))).toBe(false);
  });
});
