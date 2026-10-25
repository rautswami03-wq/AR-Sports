import { describe, it, expect, beforeEach } from 'vitest';
import { useBroadcastStore, clientId, getSponsorLog, generateSponsorLogCsv } from '../store/useBroadcastStore';
import { Team } from '../types/cricket';

function createSeededTeam(id: string, name: string): Team {
  return {
    id,
    shortName: id === 'teamA' ? 'T1' : 'T2',
    fullName: name,
    primaryColor: '#000080',
    secondaryColor: '#ffffff',
    accentColor: '#ffcc00',
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    extras: 0,
    playingXI: ['Striker 1', 'Striker 2', 'Batter 3', 'Bowler 1'],
    batters: [
      { id: `${id}_b1`, name: 'Striker 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: true },
      { id: `${id}_b2`, name: 'Striker 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: false },
      { id: `${id}_b3`, name: 'Batter 3', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: false },
    ],
    bowlers: [
      { id: `${id}_bw1`, name: 'Bowler 1', overs: 0, ballsInCurrentOver: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, isCurrent: true },
    ],
  };
}

describe('Scoring Engine — Vitest Regression Suite', () => {
  beforeEach(() => {
    useBroadcastStore.setState({
      teamA: createSeededTeam('teamA', 'Team 1'),
      teamB: createSeededTeam('teamB', 'Team 2'),
      battingTeamId: 'teamA',
      bowlingTeamId: 'teamB',
      historyStack: [],
      syncErrorCount: 0,
      ballLog: [],
      matchId: 'test_match_001',
      matchArchive: [],
      matchDetails: {
        title: 'CRICKET MATCH',
        tournament: 'TOURNAMENT NAME',
        stage: 'MATCH 1',
        venue: 'STADIUM VENUE',
        tossWinner: 'Team 1',
        tossDecision: 'bat',
        targetRuns: 0,
        currentInnings: 1,
        totalOvers: 20,
        recentBalls: [],
        partnership: {
          runs: 0,
          balls: 0,
          batter1Name: 'Striker 1',
          batter1Runs: 0,
          batter1Balls: 0,
          batter2Name: 'Striker 2',
          batter2Runs: 0,
          batter2Balls: 0,
        },
        fallOfWickets: [],
        matchStatusText: 'LIVE',
        isMatchStarted: true,
      },
    });
  });

  describe('addRuns — standard runs & boundaries', () => {
    it('records a dot ball (0 runs): increments balls, bowler balls, no strike rotation', () => {
      useBroadcastStore.getState().addRuns(0);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.balls).toBe(1);
      expect(state.teamA.overs).toBe(0);

      const striker = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      expect(striker?.runs).toBe(0);
      expect(striker?.balls).toBe(1);
      expect(striker?.isStriker).toBe(true);

      const bowler = state.teamB.bowlers.find((bw) => bw.id === 'teamB_bw1');
      expect(bowler?.runsConceded).toBe(0);
      expect(bowler?.ballsInCurrentOver).toBe(1);
      expect(state.matchDetails.recentBalls[0]).toBe('0');
    });

    it('records a single (1 run): increments score, rotates strike to non-striker', () => {
      useBroadcastStore.getState().addRuns(1);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(1);
      expect(state.teamA.balls).toBe(1);

      const batter1 = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      const batter2 = state.teamA.batters.find((b) => b.id === 'teamA_b2');

      expect(batter1?.runs).toBe(1);
      expect(batter1?.balls).toBe(1);
      expect(batter1?.isStriker).toBe(false);
      expect(batter2?.isStriker).toBe(true);

      const bowler = state.teamB.bowlers.find((bw) => bw.id === 'teamB_bw1');
      expect(bowler?.runsConceded).toBe(1);
      expect(bowler?.ballsInCurrentOver).toBe(1);
      expect(state.matchDetails.recentBalls[0]).toBe('1');
    });

    it('records a four (4 runs): updates score, boundary count, strike does not rotate', () => {
      useBroadcastStore.getState().addRuns(4, true, 4);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(4);
      expect(state.teamA.balls).toBe(1);

      const striker = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      expect(striker?.runs).toBe(4);
      expect(striker?.fours).toBe(1);
      expect(striker?.isStriker).toBe(true);
      expect(state.matchDetails.recentBalls[0]).toBe('4');
    });

    it('records a six (6 runs): updates score, sixes count, strike does not rotate', () => {
      useBroadcastStore.getState().addRuns(6, true, 6);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(6);
      expect(state.teamA.balls).toBe(1);

      const striker = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      expect(striker?.runs).toBe(6);
      expect(striker?.sixes).toBe(1);
      expect(striker?.isStriker).toBe(true);
      expect(state.matchDetails.recentBalls[0]).toBe('6');
    });

    it('handles over completion: advances over count and rotates strike on 6th ball', () => {
      // Bowl 5 dot balls
      for (let i = 0; i < 5; i++) {
        useBroadcastStore.getState().addRuns(0);
      }
      expect(useBroadcastStore.getState().teamA.balls).toBe(5);
      expect(useBroadcastStore.getState().teamA.overs).toBe(0);

      // 6th ball (dot ball) completes the over
      useBroadcastStore.getState().addRuns(0);
      const state = useBroadcastStore.getState();

      expect(state.teamA.overs).toBe(1);
      expect(state.teamA.balls).toBe(0);

      // Strike must rotate at end of over
      const batter1 = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      const batter2 = state.teamA.batters.find((b) => b.id === 'teamA_b2');
      expect(batter1?.isStriker).toBe(false);
      expect(batter2?.isStriker).toBe(true);
    });
  });

  describe('addExtra — extras (wides, no-balls, byes, leg-byes)', () => {
    it('records a wide (1 extra): does NOT increment legal balls, charges bowler runs', () => {
      useBroadcastStore.getState().addExtra('WIDE', 1);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(1);
      expect(state.teamA.extras).toBe(1);
      expect(state.teamA.balls).toBe(0); // Not a legal ball

      const striker = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      expect(striker?.balls).toBe(0); // Striker does not face a wide delivery
      expect(striker?.isStriker).toBe(true);

      const bowler = state.teamB.bowlers.find((bw) => bw.id === 'teamB_bw1');
      expect(bowler?.runsConceded).toBe(1);
      expect(bowler?.ballsInCurrentOver).toBe(0);
      expect(state.matchDetails.recentBalls[0]).toBe('1WD');
    });

    it('records a no-ball (1 extra): does NOT increment legal balls, charges bowler runs', () => {
      useBroadcastStore.getState().addExtra('NO_BALL', 1);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(1);
      expect(state.teamA.extras).toBe(1);
      expect(state.teamA.balls).toBe(0);

      const bowler = state.teamB.bowlers.find((bw) => bw.id === 'teamB_bw1');
      expect(bowler?.runsConceded).toBe(1);
      expect(bowler?.ballsInCurrentOver).toBe(0);
      expect(state.matchDetails.recentBalls[0]).toBe('1NB');
    });

    it('records a bye (1 bye): increments legal balls, striker faces ball, does NOT charge bowler runs', () => {
      useBroadcastStore.getState().addExtra('BYE', 1);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(1);
      expect(state.teamA.extras).toBe(1);
      expect(state.teamA.balls).toBe(1);

      const striker = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      expect(striker?.balls).toBe(1);
      // Odd runs rotated strike
      expect(striker?.isStriker).toBe(false);

      const bowler = state.teamB.bowlers.find((bw) => bw.id === 'teamB_bw1');
      expect(bowler?.runsConceded).toBe(0); // Byes are NOT charged to bowler
      expect(bowler?.ballsInCurrentOver).toBe(1);
      expect(state.matchDetails.recentBalls[0]).toBe('1B');
    });

    it('records a leg-bye (1 leg-bye): increments legal balls, does NOT charge bowler runs', () => {
      useBroadcastStore.getState().addExtra('LEG_BYE', 1);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(1);
      expect(state.teamA.extras).toBe(1);
      expect(state.teamA.balls).toBe(1);

      const bowler = state.teamB.bowlers.find((bw) => bw.id === 'teamB_bw1');
      expect(bowler?.runsConceded).toBe(0);
      expect(bowler?.ballsInCurrentOver).toBe(1);
      expect(state.matchDetails.recentBalls[0]).toBe('1LB');
    });
  });

  describe('addWicket — dismissals', () => {
    it('records a standard wicket: increments wickets and balls, dismisses striker, brings in new batter', () => {
      useBroadcastStore.getState().addWicket('bowled');
      const state = useBroadcastStore.getState();

      expect(state.teamA.wickets).toBe(1);
      expect(state.teamA.balls).toBe(1);

      const dismissed = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      expect(dismissed?.isOut).toBe(true);
      expect(dismissed?.dismissal).toBe('bowled');
      expect(dismissed?.isStriker).toBe(false);

      // Next batter (b3) should now be active striker
      const newBatter = state.teamA.batters.find((b) => b.id === 'teamA_b3');
      expect(newBatter?.isStriker).toBe(true);

      const bowler = state.teamB.bowlers.find((bw) => bw.id === 'teamB_bw1');
      expect(bowler?.wickets).toBe(1);
      expect(bowler?.ballsInCurrentOver).toBe(1);
      expect(state.matchDetails.recentBalls[0]).toBe('W');
    });
  });

  describe('co-existing events — Wicket + Extras (Cricket Law Edge Cases)', () => {
    it('stumping off a wide (Wicket + Wide): must score extra run and wicket, but MUST NOT increment legal balls', () => {
      // In cricket, a wide delivery that results in a stumping is NOT a legal delivery.
      // Legal ball count must remain 0.
      useBroadcastStore.getState().addExtra('WIDE', 1);
      useBroadcastStore.getState().addWicket('stumped');
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(1);
      expect(state.teamA.extras).toBe(1);
      expect(state.teamA.wickets).toBe(1);

      // CRITICAL CRICKET LAW ASSERTION:
      // A wide is never a legal delivery, even if a wicket falls.
      expect(state.teamA.balls).toBe(0);
      expect(state.teamB.bowlers[0].ballsInCurrentOver).toBe(0);
    });

    it('run out off a no-ball (Wicket + No-ball): must score extra run and wicket, but MUST NOT increment legal balls', () => {
      // In cricket, a no-ball with a run out is NOT a legal delivery.
      useBroadcastStore.getState().addExtra('NO_BALL', 1);
      useBroadcastStore.getState().addWicket('run out');
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(1);
      expect(state.teamA.extras).toBe(1);
      expect(state.teamA.wickets).toBe(1);

      // CRITICAL CRICKET LAW ASSERTION:
      // A no-ball is never a legal delivery.
      expect(state.teamA.balls).toBe(0);
      expect(state.teamB.bowlers[0].ballsInCurrentOver).toBe(0);
    });
  });

  describe('undoLastBall — undoing every scoring mutation', () => {
    it('undoes dot ball cleanly', () => {
      useBroadcastStore.getState().addRuns(0);
      expect(useBroadcastStore.getState().teamA.balls).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.balls).toBe(0);
      expect(state.teamA.batters[0].balls).toBe(0);
      expect(state.teamB.bowlers[0].ballsInCurrentOver).toBe(0);
    });

    it('undoes single: reverts score, balls, and restores striker strike status', () => {
      useBroadcastStore.getState().addRuns(1);
      expect(useBroadcastStore.getState().teamA.batters[0].isStriker).toBe(false);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.balls).toBe(0);
      expect(state.teamA.batters[0].runs).toBe(0);
      expect(state.teamA.batters[0].isStriker).toBe(true);
      expect(state.teamA.batters[1].isStriker).toBe(false);
    });

    it('undoes four: reverts score and fours count', () => {
      useBroadcastStore.getState().addRuns(4, true, 4);
      expect(useBroadcastStore.getState().teamA.batters[0].fours).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.balls).toBe(0);
      expect(state.teamA.batters[0].fours).toBe(0);
      expect(state.teamA.batters[0].runs).toBe(0);
    });

    it('undoes six: reverts score and sixes count', () => {
      useBroadcastStore.getState().addRuns(6, true, 6);
      expect(useBroadcastStore.getState().teamA.batters[0].sixes).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.balls).toBe(0);
      expect(state.teamA.batters[0].sixes).toBe(0);
    });

    it('undoes wide: reverts extras, score, bowler runsConceded', () => {
      useBroadcastStore.getState().addExtra('WIDE', 1);
      expect(useBroadcastStore.getState().teamA.extras).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.extras).toBe(0);
      expect(state.teamB.bowlers[0].runsConceded).toBe(0);
    });

    it('undoes no-ball: reverts extras, score, bowler runsConceded', () => {
      useBroadcastStore.getState().addExtra('NO_BALL', 1);
      expect(useBroadcastStore.getState().teamA.extras).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.extras).toBe(0);
      expect(state.teamB.bowlers[0].runsConceded).toBe(0);
    });

    it('undoes bye: reverts extras, balls, bowler balls', () => {
      useBroadcastStore.getState().addExtra('BYE', 1);
      expect(useBroadcastStore.getState().teamA.balls).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.extras).toBe(0);
      expect(state.teamA.balls).toBe(0);
      expect(state.teamA.batters[0].isStriker).toBe(true);
    });

    it('undoes leg-bye: reverts extras and balls', () => {
      useBroadcastStore.getState().addExtra('LEG_BYE', 1);
      expect(useBroadcastStore.getState().teamA.balls).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.extras).toBe(0);
      expect(state.teamA.balls).toBe(0);
    });

    it('undoes wicket: reverts wickets count, restores dismissed batter as active striker', () => {
      useBroadcastStore.getState().addWicket('bowled');
      expect(useBroadcastStore.getState().teamA.wickets).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.wickets).toBe(0);
      expect(state.teamA.balls).toBe(0);

      const batter1 = state.teamA.batters.find((b) => b.id === 'teamA_b1');
      expect(batter1?.isOut).toBe(false);
      expect(batter1?.isStriker).toBe(true);

      const batter3 = state.teamA.batters.find((b) => b.id === 'teamA_b3');
      expect(batter3?.isStriker).toBe(false);

      expect(state.teamB.bowlers[0].wickets).toBe(0);
    });

    it('single delivery undo of Wicket + Wide: 1 undo call must restore entire delivery back to 0 score/extras/wickets', () => {
      // A stumping off a wide is ONE delivery from the bowler.
      // Undoing that delivery should revert both the wicket and the wide in one logical undo step.
      useBroadcastStore.getState().addExtra('WIDE', 1);
      useBroadcastStore.getState().addWicket('stumped');

      // Calling undo once should restore the pre-delivery match state
      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.extras).toBe(0);
      expect(state.teamA.wickets).toBe(0);
    });

    it('single delivery undo of Wicket + No-ball: 1 undo call must restore entire delivery back to 0 score/extras/wickets', () => {
      useBroadcastStore.getState().addExtra('NO_BALL', 1);
      useBroadcastStore.getState().addWicket('run out');

      useBroadcastStore.getState().undoLastBall();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.extras).toBe(0);
      expect(state.teamA.wickets).toBe(0);
    });
  });

  describe('auditable ball-by-ball log (ballLog)', () => {
    it('appends log entry after scoring 4 with pre-mutation over and ball', () => {
      useBroadcastStore.getState().addRuns(4, true, 4);
      const state = useBroadcastStore.getState();

      expect(state.ballLog).toHaveLength(1);
      const entry = state.ballLog[0];
      expect(entry.over).toBe(0);
      expect(entry.ball).toBe(0);
      expect(entry.batter).toBe('Striker 1');
      expect(entry.bowler).toBe('Bowler 1');
      expect(entry.runs).toBe(4);
      expect(entry.extra).toBeUndefined();
      expect(entry.wicket).toBeUndefined();
      expect(typeof entry.timestamp).toBe('number');
    });

    it('appends log entry after wide with extra type and 1 run', () => {
      useBroadcastStore.getState().addExtra('WIDE', 1);
      const state = useBroadcastStore.getState();

      expect(state.ballLog).toHaveLength(1);
      const entry = state.ballLog[0];
      expect(entry.over).toBe(0);
      expect(entry.ball).toBe(0);
      expect(entry.extra).toBe('WIDE');
      expect(entry.runs).toBe(1);
      expect(entry.batter).toBe('Striker 1');
      expect(entry.bowler).toBe('Bowler 1');
    });

    it('appends log entries for wicket + wide (stumping off wide)', () => {
      useBroadcastStore.getState().addExtra('WIDE', 1);
      useBroadcastStore.getState().addWicket('stumped');
      const state = useBroadcastStore.getState();

      expect(state.ballLog).toHaveLength(2);
      expect(state.ballLog[0].extra).toBe('WIDE');
      expect(state.ballLog[0].runs).toBe(1);
      expect(state.ballLog[0].over).toBe(0);
      expect(state.ballLog[0].ball).toBe(0);

      expect(state.ballLog[1].wicket).toBe('stumped');
      expect(state.ballLog[1].runs).toBe(0);
      expect(state.ballLog[1].over).toBe(0);
      expect(state.ballLog[1].ball).toBe(0);
    });

    it('undo removes the correct last log entry', () => {
      useBroadcastStore.getState().addRuns(4, true, 4);
      useBroadcastStore.getState().addRuns(1);
      let state = useBroadcastStore.getState();

      expect(state.ballLog).toHaveLength(2);
      expect(state.ballLog[0].runs).toBe(4);
      expect(state.ballLog[1].runs).toBe(1);

      useBroadcastStore.getState().undoLastBall();
      state = useBroadcastStore.getState();

      expect(state.ballLog).toHaveLength(1);
      expect(state.ballLog[0].runs).toBe(4);

      useBroadcastStore.getState().undoLastBall();
      state = useBroadcastStore.getState();

      expect(state.ballLog).toHaveLength(0);
    });
  });

  describe('applyExternalState — deduplication and liveness', () => {
    it('ignores a self-echo where originId === clientId', () => {
      const initialScore = useBroadcastStore.getState().teamA.score;
      useBroadcastStore.getState().applyExternalState({
        originId: clientId,
        seq: 999,
        teamA: { ...useBroadcastStore.getState().teamA, score: initialScore + 100 },
      });

      expect(useBroadcastStore.getState().teamA.score).toBe(initialScore);
    });

    it('accepts a newer remote payload from another originId', () => {
      const initialScore = useBroadcastStore.getState().teamA.score;
      const remoteOrigin = 'remote_tab_test_01';

      useBroadcastStore.getState().applyExternalState({
        originId: remoteOrigin,
        seq: 1,
        teamA: { ...useBroadcastStore.getState().teamA, score: initialScore + 15 },
      });

      expect(useBroadcastStore.getState().teamA.score).toBe(initialScore + 15);

      // Stale or duplicate seq from same remote origin is ignored
      useBroadcastStore.getState().applyExternalState({
        originId: remoteOrigin,
        seq: 1,
        teamA: { ...useBroadcastStore.getState().teamA, score: initialScore + 50 },
      });
      expect(useBroadcastStore.getState().teamA.score).toBe(initialScore + 15);

      // Newer seq is accepted
      useBroadcastStore.getState().applyExternalState({
        originId: remoteOrigin,
        seq: 2,
        teamA: { ...useBroadcastStore.getState().teamA, score: initialScore + 20 },
      });
      expect(useBroadcastStore.getState().teamA.score).toBe(initialScore + 20);
    });

    it('updates overlayAckAt on setOverlayAck and incoming external ack', () => {
      const now = Date.now();
      useBroadcastStore.getState().setOverlayAck(now);
      expect(useBroadcastStore.getState().overlayAckAt).toBe(now);

      const externalAck = now + 1000;
      useBroadcastStore.getState().applyExternalState({
        originId: 'remote_overlay_tab',
        overlayAckAt: externalAck,
      });
      expect(useBroadcastStore.getState().overlayAckAt).toBe(externalAck);
    });
  });

  describe('archive lifecycle — archiveAndReset & loadArchiveAsNewMatch', () => {
    it('archive preserves data: snapshot, ballLog, and computes result', () => {
      useBroadcastStore.getState().addRuns(4, true, 4);
      useBroadcastStore.getState().addRuns(6, true, 6);
      const stateBefore = useBroadcastStore.getState();
      const currentMatchId = stateBefore.matchId;

      expect(stateBefore.teamA.score).toBe(10);
      expect(stateBefore.ballLog).toHaveLength(2);

      useBroadcastStore.getState().archiveAndReset();
      const stateAfter = useBroadcastStore.getState();

      expect(stateAfter.matchArchive.length).toBeGreaterThanOrEqual(1);
      const archived = stateAfter.matchArchive[0];
      expect(archived.matchId).toBe(currentMatchId);
      expect(archived.teamA.score).toBe(10);
      expect(archived.ballLog).toHaveLength(2);
      expect(archived.ballLog[0].runs).toBe(4);
      expect(archived.ballLog[1].runs).toBe(6);
      expect(typeof archived.result).toBe('string');
      expect(archived.result.length).toBeGreaterThan(0);
    });

    it('archiveAndReset clears active state', () => {
      useBroadcastStore.getState().addRuns(4);
      useBroadcastStore.getState().addExtra('WIDE', 1);
      const oldMatchId = useBroadcastStore.getState().matchId;

      useBroadcastStore.getState().archiveAndReset();
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.wickets).toBe(0);
      expect(state.teamA.overs).toBe(0);
      expect(state.teamA.balls).toBe(0);
      expect(state.teamA.extras).toBe(0);
      expect(state.teamB.score).toBe(0);
      expect(state.ballLog).toHaveLength(0);
      expect(state.historyStack).toHaveLength(0);
      expect(state.matchId).not.toBe(oldMatchId);
    });

    it('load-as-new clears scores but keeps players and team theme', () => {
      const customTeamA = createSeededTeam('teamA', 'Mumbai Champions');
      customTeamA.primaryColor = '#004ba0';
      customTeamA.batters[0].name = 'Rohit Sharma';
      customTeamA.batters[1].name = 'Suryakumar Yadav';

      const customTeamB = createSeededTeam('teamB', 'Chennai Kings');
      customTeamB.primaryColor = '#ffff00';
      customTeamB.bowlers[0].name = 'Jasprit Bumrah';

      useBroadcastStore.setState({
        teamA: customTeamA,
        teamB: customTeamB,
        matchId: 'match_rohit_vs_bumrah',
      });

      useBroadcastStore.getState().addRuns(4, true, 4);
      useBroadcastStore.getState().addRuns(1);
      useBroadcastStore.getState().addWicket('bowled');

      useBroadcastStore.getState().archiveAndReset();
      const archivedId = 'match_rohit_vs_bumrah';

      useBroadcastStore.getState().loadArchiveAsNewMatch(archivedId);
      const state = useBroadcastStore.getState();

      expect(state.teamA.score).toBe(0);
      expect(state.teamA.wickets).toBe(0);
      expect(state.teamA.overs).toBe(0);
      expect(state.teamA.balls).toBe(0);
      expect(state.ballLog).toHaveLength(0);
      expect(state.historyStack).toHaveLength(0);

      expect(state.teamA.fullName).toBe('Mumbai Champions');
      expect(state.teamA.primaryColor).toBe('#004ba0');
      expect(state.teamA.batters[0].name).toBe('Rohit Sharma');
      expect(state.teamA.batters[0].runs).toBe(0);
      expect(state.teamA.batters[0].balls).toBe(0);
      expect(state.teamA.batters[0].isOut).toBe(false);
      expect(state.teamA.batters[1].name).toBe('Suryakumar Yadav');

      expect(state.teamB.fullName).toBe('Chennai Kings');
      expect(state.teamB.primaryColor).toBe('#ffff00');
      expect(state.teamB.bowlers[0].name).toBe('Jasprit Bumrah');
      expect(state.teamB.bowlers[0].wickets).toBe(0);
      expect(state.teamB.bowlers[0].runsConceded).toBe(0);

      expect(state.matchId).not.toBe(archivedId);
    });
  });

  describe('compliance sponsor logging', () => {
    beforeEach(() => {
      localStorage.removeItem('ar_sports_sponsor_log');
      useBroadcastStore.setState({
        activeOverlays: {
          ...useBroadcastStore.getState().activeOverlays,
          sponsorGraphics: false,
        },
      });
    });

    it('two opens produce two entries', () => {
      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', true);
      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', false);

      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', true);
      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', false);

      const log = getSponsorLog();
      expect(log).toHaveLength(2);
      expect(log[0].overlayId).toBe('sponsorGraphics');
      expect(log[1].overlayId).toBe('sponsorGraphics');
      expect(log[0].offAirAt).toBeDefined();
      expect(log[1].offAirAt).toBeDefined();
    });

    it('close updates correctly with offAirAt and durationSeconds, respecting structured sponsor id', () => {
      useBroadcastStore.getState().updateMatchSettings({
        sponsors: [{ id: 'sponsor_nike_01', name: 'Nike Corp' }],
      });

      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', true);
      let log = getSponsorLog();
      expect(log).toHaveLength(1);
      expect(log[0].sponsorId).toBe('sponsor_nike_01');
      expect(log[0].overlayId).toBe('sponsorGraphics');
      expect(typeof log[0].onAirAt).toBe('number');
      expect(log[0].offAirAt).toBeUndefined();

      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', false);
      log = getSponsorLog();
      expect(log).toHaveLength(1);
      expect(typeof log[0].offAirAt).toBe('number');
      expect(log[0].offAirAt).toBeGreaterThanOrEqual(log[0].onAirAt);
      expect(typeof log[0].durationSeconds).toBe('number');
    });

    it('falls back to "unlabeled" if sponsors lack structured { id, name }', () => {
      useBroadcastStore.getState().updateMatchSettings({
        sponsors: [{ name: 'Brand Without ID' }] as any,
      });

      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', true);
      useBroadcastStore.getState().toggleOverlay('sponsorGraphics', false);

      const log = getSponsorLog();
      expect(log[0].sponsorId).toBe('unlabeled');
    });

    it('export produces valid CSV', () => {
      const mockLog = [
        {
          sponsorId: 'sp_coke',
          overlayId: 'sponsorGraphics' as const,
          onAirAt: 1700000000000,
          offAirAt: 1700000030000,
          durationSeconds: 30,
        },
      ];

      const csv = generateSponsorLogCsv(mockLog);
      const lines = csv.split('\n');

      expect(lines[0]).toBe('sponsorId,overlayId,onAirAt,offAirAt,durationSeconds');
      expect(lines[1]).toBe('sp_coke,sponsorGraphics,1700000000000,1700000030000,30');
    });
  });
});
