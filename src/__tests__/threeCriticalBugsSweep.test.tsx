import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ControlStudio } from '../components/control/ControlStudio';
import { OverlayStage } from '../components/control/OverlayStage';
import { EventSting } from '../components/overlays/EventSting';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('Three Critical Bugs Sweep Suite (UI Layout, Undo Logic, Animation Timing)', () => {
  beforeEach(() => {
    vi.useRealTimers();
    useBroadcastStore.getState().resetMatchState();
  });

  describe('Part 1: Active Players Selection UI in ControlStudio', () => {
    it('renders only select dropdowns for striker, non-striker, and bowler with stats underneath and bowler mapped over bowlingTeam.bowlers', () => {
      useBroadcastStore.setState((state) => ({
        ...state,
        teamA: {
          ...state.teamA,
          id: 'csk',
          shortName: 'CSK',
          batters: [
            { id: 'bat_1', name: 'Ruturaj Gaikwad', runs: 42, balls: 24, fours: 4, sixes: 2, isOut: false, isStriker: true },
            { id: 'bat_2', name: 'Shivam Dube', runs: 28, balls: 14, fours: 1, sixes: 3, isOut: false, isStriker: false },
          ],
          bowlers: [],
        },
        teamB: {
          ...state.teamB,
          id: 'mi',
          shortName: 'MI',
          batters: [
            { id: 'bat_b1', name: 'Rohit Sharma', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: false },
          ],
          bowlers: [
            { id: 'bw_1', name: 'Jasprit Bumrah', overs: 2, ballsInCurrentOver: 3, maidens: 0, runsConceded: 14, wickets: 2, economy: 5.6, isCurrent: true },
            { id: 'bw_2', name: 'Trent Boult', overs: 1, ballsInCurrentOver: 0, maidens: 0, runsConceded: 8, wickets: 0, economy: 8.0, isCurrent: false },
          ],
        },
        battingTeamId: 'csk',
        bowlingTeamId: 'mi',
      }));

      render(
        <MemoryRouter>
          <ControlStudio />
        </MemoryRouter>
      );

      // Verify Active Players Selection header
      expect(screen.getByText(/ACTIVE PLAYERS SELECTION/i)).toBeDefined();

      // Striker select exists and displays stats underneath
      const strikerSelect = screen.getByRole('combobox', { name: /^Striker/i }) as HTMLSelectElement;
      expect(strikerSelect).toBeDefined();
      expect(strikerSelect.value).toBe('bat_1');
      expect(screen.getByText('42 (24b)')).toBeDefined();

      // Non-striker select exists and displays stats underneath
      const nonStrikerSelect = screen.getByRole('combobox', { name: /^Non-Striker/i }) as HTMLSelectElement;
      expect(nonStrikerSelect).toBeDefined();
      expect(nonStrikerSelect.value).toBe('bat_2');
      expect(screen.getByText('28 (14b)')).toBeDefined();

      // Bowler select exists and displays stats underneath
      const bowlerSelect = screen.getByRole('combobox', { name: /Active Bowler/i }) as HTMLSelectElement;
      expect(bowlerSelect).toBeDefined();
      expect(bowlerSelect.value).toBe('Jasprit Bumrah');
      expect(screen.getAllByText('2-14 (2.3)').length).toBeGreaterThanOrEqual(1);

      // CRITICAL: Ensure Bowler dropdown maps over bowlingTeam.bowlers (Jasprit Bumrah, Trent Boult), NOT batters (Rohit Sharma)
      const bowlerOptionTexts = Array.from(bowlerSelect.options).map((opt) => opt.text);
      expect(bowlerOptionTexts.some((txt) => txt.includes('Jasprit Bumrah'))).toBe(true);
      expect(bowlerOptionTexts.some((txt) => txt.includes('Trent Boult'))).toBe(true);
      expect(bowlerOptionTexts.some((txt) => txt.includes('Rohit Sharma'))).toBe(false);

      // Verify redundant "New Bowler..." text input has been removed
      expect(screen.queryByPlaceholderText('New Bowler...')).toBeNull();
    });
  });

  describe('Part 2: Undo Logic in useBroadcastStore', () => {
    it('pops historyStack immutably via slice(0, -1), reverts teamA/teamB/matchDetails, and clears activeAnimation', () => {
      const store = useBroadcastStore.getState();

      // Initial state
      const initialScore = useBroadcastStore.getState().teamA.score;
      expect(useBroadcastStore.getState().historyStack.length).toBe(0);

      // Add a 4
      useBroadcastStore.getState().addRuns(4, true, 4);
      expect(useBroadcastStore.getState().historyStack.length).toBe(1);
      const afterFourScore = useBroadcastStore.getState().teamA.score;
      expect(afterFourScore).toBe(initialScore + 4);

      // Add a wicket
      useBroadcastStore.getState().addWicket('caught');
      expect(useBroadcastStore.getState().historyStack.length).toBe(2);
      expect(useBroadcastStore.getState().teamA.wickets).toBe(1);

      // Snapshot the historyStack array reference before undo
      const stackRefBefore = useBroadcastStore.getState().historyStack;

      // Perform undo of wicket
      act(() => {
        useBroadcastStore.getState().undoLastBall();
      });

      const stateAfterWicketUndo = useBroadcastStore.getState();
      expect(stateAfterWicketUndo.teamA.wickets).toBe(0);
      expect(stateAfterWicketUndo.teamA.score).toBe(afterFourScore);
      expect(stateAfterWicketUndo.activeAnimation).toBe(null);
      expect(stateAfterWicketUndo.historyStack.length).toBe(1);

      // Verify immutability: historyStack was NOT mutated in place
      expect(stackRefBefore.length).toBe(2);
      expect(stateAfterWicketUndo.historyStack).not.toBe(stackRefBefore);

      // Perform undo of four
      act(() => {
        useBroadcastStore.getState().undoLastBall();
      });

      const stateAfterFourUndo = useBroadcastStore.getState();
      expect(stateAfterFourUndo.teamA.score).toBe(initialScore);
      expect(stateAfterFourUndo.historyStack.length).toBe(0);
    });

    it('addExtra and addWicket push deep copies to historyStack', () => {
      const store = useBroadcastStore.getState();

      store.addExtra('WIDE', 1);
      const stackAfterWide = useBroadcastStore.getState().historyStack;
      expect(stackAfterWide.length).toBe(1);

      // Ensure snapshot in stack is independent deep copy
      const snapshot = stackAfterWide[0];
      expect(snapshot.teamA.score).toBe(0);

      store.addRuns(1);
      expect(snapshot.teamA.score).toBe(0); // Deep copy remains unchanged
    });
  });

  describe('Part 3: Animation Flash & Timing', () => {
    it('triggerAnimation timeout is exactly 3500ms', () => {
      vi.useFakeTimers();
      const store = useBroadcastStore.getState();

      act(() => {
        store.triggerAnimation('FOUR');
      });

      expect(useBroadcastStore.getState().activeAnimation).toBe('FOUR');

      // After 3400ms, animation should still be active
      act(() => {
        vi.advanceTimersByTime(3400);
      });
      expect(useBroadcastStore.getState().activeAnimation).toBe('FOUR');

      // After 3500ms, animation should clear
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(useBroadcastStore.getState().activeAnimation).toBe(null);

      vi.useRealTimers();
    });

    it('OverlayStage renders animations with z-50 and AnimatePresence', () => {
      useBroadcastStore.setState({
        activeAnimation: 'SIX',
        activeOverlays: {
          ...useBroadcastStore.getState().activeOverlays,
          scoreBug: true,
        },
      });

      const { container } = render(<OverlayStage />);

      // Find event sting container and check z-50
      const sting = screen.getByTestId('event-sting');
      expect(sting).toBeDefined();
      expect(screen.getByText('MAXIMUM SIX')).toBeDefined();

      const z50Container = container.querySelector('.z-50');
      expect(z50Container).not.toBeNull();
    });
  });
});
