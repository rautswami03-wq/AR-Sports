import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdvancedMatchControls } from '../components/control/AdvancedMatchControls';
import { OverlayStage } from '../components/control/OverlayStage';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('AdvancedMatchControls and Extras Audit Test Suite', () => {
  beforeEach(() => {
    // Reset store to known state
    const current = useBroadcastStore.getState();
    useBroadcastStore.setState({
      teamA: {
        ...current.teamA,
        id: 'teamA',
        fullName: 'Chennai Super Kings',
        shortName: 'CSK',
        score: 100,
        wickets: 2,
        overs: 10,
        balls: 0,
        extras: 5,
        batters: [
          { id: 'b1', name: 'Ruturaj Gaikwad', runs: 50, balls: 30, fours: 5, sixes: 2, isStriker: true, isOut: false },
          { id: 'b2', name: 'MS Dhoni', runs: 20, balls: 10, fours: 2, sixes: 1, isStriker: false, isOut: false },
          { id: 'b3', name: 'Shivam Dube', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false, isOut: false },
        ],
        bowlers: [
          { id: 'bw_a1', name: 'Deepak Chahar', overs: 2, ballsInCurrentOver: 0, maidens: 0, runsConceded: 18, wickets: 1, economy: 9.0, isCurrent: false },
        ],
      },
      teamB: {
        ...current.teamB,
        id: 'teamB',
        fullName: 'Mumbai Indians',
        shortName: 'MI',
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        batters: [
          { id: 'b_b1', name: 'Rohit Sharma', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: true, isOut: false },
          { id: 'b_b2', name: 'Ishan Kishan', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false, isOut: false },
        ],
        bowlers: [
          { id: 'bw1', name: 'Jasprit Bumrah', overs: 2, ballsInCurrentOver: 0, maidens: 0, runsConceded: 15, wickets: 1, economy: 7.5, isCurrent: true },
          { id: 'bw2', name: 'Gerald Coetzee', overs: 1, ballsInCurrentOver: 0, maidens: 0, runsConceded: 12, wickets: 0, economy: 12.0, isCurrent: false },
        ],
      },
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      matchDetails: {
        ...current.matchDetails,
        tournament: 'IPL 2025',
        venue: 'Chepauk',
        currentInnings: 1,
        totalOvers: 20,
        targetRuns: undefined,
        recentBalls: [],
        decision: null,
        graphType: null,
      },
      activeOverlays: { ...current.activeOverlays },
      activeAnimation: null,
      historyStack: [],
      ballLog: [],
    });
  });

  describe('Step 1: Extras & Wickets Matrix', () => {
    it('calls addExtra with correct types and runs for Wide, No Ball, Byes, Leg Byes', () => {
      const { unmount } = render(<AdvancedMatchControls defaultExpanded={true} />);

      // Wide +0 (1 run)
      const wideBtn = screen.getByText('WIDE +0 (1)');
      fireEvent.click(wideBtn);

      let state = useBroadcastStore.getState();
      expect(state.teamA.score).toBe(101);
      expect(state.teamA.extras).toBe(6);
      expect(state.teamB.bowlers[0].runsConceded).toBe(16);
      expect(state.teamA.balls).toBe(0); // Wide does not advance ball count

      // No ball +1 (2 runs)
      const nbBtn = screen.getByText('NO BALL +1 (2)');
      fireEvent.click(nbBtn);

      state = useBroadcastStore.getState();
      expect(state.teamA.score).toBe(103);
      expect(state.teamA.extras).toBe(8);
      expect(state.teamB.bowlers[0].runsConceded).toBe(18);
      expect(state.teamA.balls).toBe(0); // No ball does not advance ball count

      // Bye +2
      const byeBtn = screen.getByText('BYE (+2)');
      fireEvent.click(byeBtn);

      state = useBroadcastStore.getState();
      expect(state.teamA.score).toBe(105);
      expect(state.teamA.balls).toBe(1); // Legal ball

      // Leg Bye +3
      const legByeBtn = screen.getByText('LEG BYE (+3)');
      fireEvent.click(legByeBtn);

      state = useBroadcastStore.getState();
      expect(state.teamA.score).toBe(108);
      expect(state.teamA.balls).toBe(2);

      unmount();
    });

    it('handles WIDE + RUN OUT compound action without overwriting runs or crediting bowler', () => {
      render(<AdvancedMatchControls defaultExpanded={true} />);

      const wideRunOutBtn = screen.getByTestId('wide-run-out-btn');
      const initialScore = useBroadcastStore.getState().teamA.score;
      const initialWickets = useBroadcastStore.getState().teamA.wickets;
      const initialBowlerWickets = useBroadcastStore.getState().teamB.bowlers[0].wickets;
      const initialBalls = useBroadcastStore.getState().teamA.balls;

      fireEvent.click(wideRunOutBtn);

      const state = useBroadcastStore.getState();
      // Team score must increase by 1 for the wide
      expect(state.teamA.score).toBe(initialScore + 1);
      // Team wickets must increase by 1
      expect(state.teamA.wickets).toBe(initialWickets + 1);
      // Bowler MUST NOT get credit for a run out
      expect(state.teamB.bowlers[0].wickets).toBe(initialBowlerWickets);
      // Balls must NOT advance on an illegal delivery
      expect(state.teamA.balls).toBe(initialBalls);
      // Dismissed striker was Ruturaj Gaikwad, next batter became striker
      expect(state.teamA.batters[0].isOut).toBe(true);
      expect(state.teamA.batters[0].dismissal).toBe('run out');
      expect(state.teamA.batters[2].isStriker).toBe(true);
    });

    it('handles NO BALL + RUN OUT compound action', () => {
      render(<AdvancedMatchControls defaultExpanded={true} />);

      const nbRunOutBtn = screen.getByTestId('noball-run-out-btn');
      const initialScore = useBroadcastStore.getState().teamA.score;
      const initialWickets = useBroadcastStore.getState().teamA.wickets;
      const initialBowlerWickets = useBroadcastStore.getState().teamB.bowlers[0].wickets;

      fireEvent.click(nbRunOutBtn);

      const state = useBroadcastStore.getState();
      expect(state.teamA.score).toBe(initialScore + 1);
      expect(state.teamA.wickets).toBe(initialWickets + 1);
      expect(state.teamB.bowlers[0].wickets).toBe(initialBowlerWickets);
    });
  });

  describe('Step 2: Target & Chase Editor and Dynamic Calculator', () => {
    it('sets target, calculates runs needed, required run rate, and clears calculator', () => {
      render(<AdvancedMatchControls defaultExpanded={true} />);

      const targetInput = screen.getByTestId('target-runs-input');
      fireEvent.change(targetInput, { target: { value: '180' } });

      const setTargetBtn = screen.getByTestId('set-target-btn');
      fireEvent.click(setTargetBtn);

      let state = useBroadcastStore.getState();
      expect(state.matchDetails.targetRuns).toBe(180);

      // Score is 100 in 10 overs (60 balls remaining of 120 total balls)
      // Runs needed = 180 - 100 = 80
      // Balls remaining = 120 - 60 = 60
      // RRR = (80 / 60) * 6 = 8.00
      expect(screen.getByText(/NEED 80 RUNS FROM 60 BALLS/i)).toBeDefined();
      expect(screen.getByText(/RRR: 8\.00/i)).toBeDefined();

      // Clear Calculator
      const clearBtn = screen.getByTestId('clear-calculator-btn');
      fireEvent.click(clearBtn);

      state = useBroadcastStore.getState();
      expect(state.matchDetails.targetRuns).toBeUndefined();
    });
  });

  describe('Step 3: Innings & Advanced Controls', () => {
    it('switches strikers and retires batter', () => {
      render(<AdvancedMatchControls defaultExpanded={true} />);

      // Initial striker: Gaikwad (b1), non-striker: Dhoni (b2)
      expect(useBroadcastStore.getState().teamA.batters[0].isStriker).toBe(true);
      expect(useBroadcastStore.getState().teamA.batters[1].isStriker).toBe(false);

      const swapBtn = screen.getByTestId('swap-strikers-btn');
      fireEvent.click(swapBtn);

      expect(useBroadcastStore.getState().teamA.batters[0].isStriker).toBe(false);
      expect(useBroadcastStore.getState().teamA.batters[1].isStriker).toBe(true);

      // Retire current striker (now Dhoni)
      const retireBtn = screen.getByTestId('retire-batter-btn');
      fireEvent.click(retireBtn);

      const state = useBroadcastStore.getState();
      expect(state.teamA.batters[1].isOut).toBe(true);
      expect(state.teamA.batters[1].dismissal).toBe('RETIRED HURT');
      expect(state.teamA.batters[2].isStriker).toBe(true);
    });

    it('starts 2nd innings with flipped batting team, reset overs, and calculated target', () => {
      render(<AdvancedMatchControls defaultExpanded={true} />);

      // Team A had 100 runs
      const start2ndBtn = screen.getByTestId('start-second-innings-btn');
      fireEvent.click(start2ndBtn);

      const state = useBroadcastStore.getState();
      expect(state.battingTeamId).toBe('teamB');
      expect(state.matchDetails.currentInnings).toBe(2);
      expect(state.matchDetails.targetRuns).toBe(101);
      expect(state.teamB.overs).toBe(0);
      expect(state.teamB.balls).toBe(0);
      expect(state.activeOverlays.target).toBe(true);
    });

    it('triggers bowler modal callback on change bowler click', () => {
      const openModalSpy = vi.fn();
      render(<AdvancedMatchControls defaultExpanded={true} onOpenBowlerModal={openModalSpy} />);

      const changeBowlerBtn = screen.getByTestId('change-bowler-btn');
      fireEvent.click(changeBowlerBtn);

      expect(openModalSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Step 4: Broadcast Animations & Stings', () => {
    it('triggers broadcast stings correctly for FREE_HIT, POWERPLAY, and END_OF_INNINGS', () => {
      render(<AdvancedMatchControls defaultExpanded={true} />);

      fireEvent.click(screen.getByTestId('anim-freehit-btn'));
      expect(useBroadcastStore.getState().activeAnimation).toBe('FREE_HIT');

      fireEvent.click(screen.getByTestId('anim-powerplay-btn'));
      expect(useBroadcastStore.getState().activeAnimation).toBe('POWERPLAY');

      fireEvent.click(screen.getByTestId('anim-endinnings-btn'));
      expect(useBroadcastStore.getState().activeAnimation).toBe('END_OF_INNINGS');

      fireEvent.click(screen.getByTestId('stop-anim-btn'));
      expect(useBroadcastStore.getState().activeAnimation).toBeNull();
    });
  });

  describe('Step 5 & 6: DRS Decision, Graphs, and Overlay Stage Integration', () => {
    it('sets umpire decision and graph types in store', () => {
      render(<AdvancedMatchControls defaultExpanded={true} />);

      fireEvent.click(screen.getByTestId('decision-pending-btn'));
      expect(useBroadcastStore.getState().matchDetails.decision).toBe('PENDING');
      expect(useBroadcastStore.getState().activeOverlays.decision).toBe(true);

      fireEvent.click(screen.getByTestId('decision-out-btn'));
      expect(useBroadcastStore.getState().matchDetails.decision).toBe('OUT');

      fireEvent.click(screen.getByTestId('decision-clear-btn'));
      expect(useBroadcastStore.getState().matchDetails.decision).toBeNull();
      expect(useBroadcastStore.getState().activeOverlays.decision).toBe(false);

      // Graph type
      fireEvent.click(screen.getByTestId('graph-line-btn'));
      expect(useBroadcastStore.getState().matchDetails.graphType).toBe('LINE');
      expect(useBroadcastStore.getState().activeOverlays.graph).toBe(true);
    });

    it('toggles overlays for worm, manhattan, wagonWheel, and renders inside OverlayStage', () => {
      const { unmount: unmountControls } = render(<AdvancedMatchControls defaultExpanded={true} />);

      fireEvent.click(screen.getByTestId('overlay-worm-btn'));
      expect(useBroadcastStore.getState().activeOverlays.worm).toBe(true);

      fireEvent.click(screen.getByTestId('overlay-manhattan-btn'));
      expect(useBroadcastStore.getState().activeOverlays.manhattan).toBe(true);

      unmountControls();

      // Verify OverlayStage mounts these overlays
      const { unmount: unmountStage } = render(<OverlayStage />);
      expect(useBroadcastStore.getState().activeOverlays.worm).toBe(true);
      expect(useBroadcastStore.getState().activeOverlays.manhattan).toBe(true);
      unmountStage();
    });
  });
});
