import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  Match,
  Innings,
  BallEvent,
  ScoreState,
  LiveBatter,
  LiveBowler,
  BatterInnings,
  BowlerInnings,
  MatchResult,
} from '@ar-sports/types';
import {
  BallEventType,
  WicketType,
  MatchStatus,
  MatchFormat,
} from '@ar-sports/types';
import { generateId, formatOvers, calculateRunRate } from '@ar-sports/utils';

// ============================================================================
// Match Store — Live match state
// ============================================================================

interface MatchState {
  currentMatch: Match | null;
  matches: Match[];

  // Actions
  createMatch: (params: {
    team1Id: string;
    team2Id: string;
    format: MatchFormat;
    totalOvers: number;
    venue?: string;
  }) => Match;
  setMatch: (match: Match) => void;
  setMatchStatus: (status: MatchStatus) => void;
  startInnings: (battingTeamId: string, bowlingTeamId: string) => void;
  swapInnings: () => void;
  getCurrentInnings: () => Innings | null;
  endMatch: (result: MatchResult) => void;
}

export const useMatchStore = create<MatchState>()(
  immer((set, get) => ({
    currentMatch: null,
    matches: [],

    createMatch: (params) => {
      const match: Match = {
        id: generateId(),
        team1Id: params.team1Id,
        team2Id: params.team2Id,
        venue: params.venue,
        date: new Date().toISOString(),
        format: params.format,
        totalOvers: params.totalOvers,
        status: MatchStatus.UPCOMING,
        innings: [],
        currentInningsIndex: 0,
        isSuperOver: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => {
        state.currentMatch = match;
        state.matches.push(match);
      });
      return match;
    },

    setMatch: (match) => {
      set((state) => {
        state.currentMatch = match;
      });
    },

    setMatchStatus: (status) => {
      set((state) => {
        if (state.currentMatch) {
          state.currentMatch.status = status;
          state.currentMatch.updatedAt = new Date().toISOString();
        }
      });
    },

    startInnings: (battingTeamId, bowlingTeamId) => {
      const match = get().currentMatch;
      if (!match) return;

      const innings: Innings = {
        id: generateId(),
        matchId: match.id,
        inningsNumber: match.innings.length + 1,
        battingTeamId,
        bowlingTeamId,
        status: 'IN_PROGRESS' as any,
        totalRuns: 0,
        totalWickets: 0,
        totalOvers: 0,
        totalBalls: 0,
        extras: 0,
        extrasBreakdown: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0 },
        currentRunRate: 0,
        batters: [],
        bowlers: [],
        overs: [],
        fallOfWickets: [],
        partnership: { runs: 0, balls: 0, batter1Id: '', batter2Id: '' },
      };

      set((state) => {
        if (state.currentMatch) {
          state.currentMatch.innings.push(innings);
          state.currentMatch.currentInningsIndex = state.currentMatch.innings.length - 1;
          state.currentMatch.status = MatchStatus.LIVE;
          state.currentMatch.updatedAt = new Date().toISOString();
        }
      });
    },

    swapInnings: () => {
      const match = get().currentMatch;
      if (!match) return;
      set((state) => {
        if (state.currentMatch) {
          state.currentMatch.currentInningsIndex = 1;
          state.currentMatch.status = MatchStatus.LIVE;
          state.currentMatch.updatedAt = new Date().toISOString();
        }
      });
    },

    getCurrentInnings: () => {
      const match = get().currentMatch;
      if (!match) return null;
      return match.innings[match.currentInningsIndex] ?? null;
    },

    endMatch: (result) => {
      set((state) => {
        if (state.currentMatch) {
          state.currentMatch.status = MatchStatus.COMPLETED;
          state.currentMatch.result = result;
          state.currentMatch.updatedAt = new Date().toISOString();
        }
      });
    },
  })),
);

// ============================================================================
// Scoring Store — Ball-by-ball scoring with undo/redo
// ============================================================================

interface ScoringHistoryEntry {
  match: Match;
  timestamp: string;
}

interface ScoringState {
  // Undo/redo
  undoStack: ScoringHistoryEntry[];
  redoStack: ScoringHistoryEntry[];

  // Scoring actions
  addBallEvent: (event: Omit<BallEvent, 'id' | 'timestamp'>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Over management
  rotateOver: () => void;

  // Wicket handling
  addWicket: (params: {
    type: WicketType;
    batsmanId: string;
    bowlerId?: string;
    fielderIds?: string[];
    runsScored: number;
  }) => void;

  // Batter management
  addBatterToInnings: (playerId: string, playerName: string) => void;
  swapStrike: () => void;

  // Bowler management
  addBowlerToInnings: (playerId: string, playerName: string) => void;
  setCurrentBowler: (playerId: string) => void;

  // Get live score state
  getScoreState: (
    battingTeam: { id: string; name: string; shortName: string; primaryColor: string; secondaryColor: string },
    bowlingTeam: { id: string; name: string; shortName: string; primaryColor: string; secondaryColor: string },
  ) => ScoreState | null;
}

export const useScoringStore = create<ScoringState>()(
  immer((set, get) => {
    // Helper: save state for undo
    const saveForUndo = () => {
      const match = useMatchStore.getState().currentMatch;
      if (!match) return;
      set((state) => {
        state.undoStack.push({
          match: JSON.parse(JSON.stringify(match)),
          timestamp: new Date().toISOString(),
        });
        state.redoStack = [];
        // Keep max 50 undo entries
        if (state.undoStack.length > 50) state.undoStack.shift();
      });
    };

    return {
      undoStack: [],
      redoStack: [],

      addBallEvent: (eventData) => {
        saveForUndo();

        const event: BallEvent = {
          ...eventData,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };

        set((state) => {
          const match = useMatchStore.getState().currentMatch;
          if (!match) return;
          const innings = match.innings[match.currentInningsIndex];
          if (!innings) return;

          // Update innings totals
          innings.totalRuns += event.totalRuns;
          if (event.isLegalDelivery) {
            innings.totalBalls += 1;
            innings.totalOvers = Math.floor(innings.totalBalls / 6);
          }

          // Update extras
          if (!event.isLegalDelivery || event.type === 'BYE' || event.type === 'LEG_BYE') {
            innings.extras += event.extras;
          }

          // Track extras by type
          switch (event.type) {
            case 'WIDE':
              innings.extrasBreakdown.wides += event.extras;
              break;
            case 'NO_BALL':
              innings.extrasBreakdown.noBalls += event.extras;
              break;
            case 'BYE':
              innings.extrasBreakdown.byes += event.extras;
              break;
            case 'LEG_BYE':
              innings.extrasBreakdown.legByes += event.extras;
              break;
          }

          // Add to current over
          const currentOver = innings.overs[innings.overs.length - 1];
          if (currentOver) {
            currentOver.balls.push(event);
            currentOver.runsScored += event.totalRuns;
            if (!event.isLegalDelivery) {
              currentOver.extras += event.extras;
            }
          } else {
            innings.overs.push({
              overNumber: 0,
              balls: [event],
              runsScored: event.totalRuns,
              wicketsTaken: 0,
              extras: event.extras,
              maiden: false,
            });
          }

          // Update batter stats
          const striker = innings.batters.find(
            (b) => b.playerId === event.batsmanId && !b.isOut,
          );
          if (striker) {
            if (event.isLegalDelivery) striker.balls += 1;
            striker.runs += event.runsScored;
            if (event.type === 'FOUR') striker.fours += 1;
            if (event.type === 'SIX') striker.sixes += 1;
            striker.strikeRate =
              striker.balls > 0 ? Number(((striker.runs / striker.balls) * 100).toFixed(1)) : 0;
          }

          // Update bowler stats
          const bowler = innings.bowlers.find((b) => b.playerId === event.bowlerId);
          if (bowler) {
            if (event.isLegalDelivery) {
              bowler.balls += 1;
              bowler.overs = Number((bowler.balls / 6).toFixed(1));
            }
            bowler.runs += event.totalRuns;
            if (event.type === 'WIDE') bowler.wides += 1;
            if (event.type === 'NO_BALL') bowler.noBalls += 1;
            if (event.type === 'DOT') bowler.dotBalls += 1;
            bowler.economy =
              bowler.balls > 0 ? Number(((bowler.runs / bowler.balls) * 6).toFixed(1)) : 0;
          }

          // Update run rate
          innings.currentRunRate = calculateRunRate(innings.totalRuns, innings.totalBalls);

          // Update partnership
          innings.partnership.runs += event.totalRuns;
          innings.partnership.balls += event.isLegalDelivery ? 1 : 0;

          // Update match
          match.updatedAt = new Date().toISOString();
        });

        // Also update the match store
        useMatchStore.setState((state) => {
          if (state.currentMatch) {
            state.currentMatch.updatedAt = new Date().toISOString();
          }
        });
      },

      undo: () => {
        const { undoStack } = get();
        if (undoStack.length === 0) return;

        const currentMatch = useMatchStore.getState().currentMatch;
        if (!currentMatch) return;

        set((state) => {
          // Save current state to redo
          state.redoStack.push({
            match: JSON.parse(JSON.stringify(currentMatch)),
            timestamp: new Date().toISOString(),
          });

          // Restore previous state
          const entry = state.undoStack.pop();
          if (entry) {
            useMatchStore.setState({ currentMatch: entry.match });
          }
        });
      },

      redo: () => {
        const { redoStack } = get();
        if (redoStack.length === 0) return;

        const currentMatch = useMatchStore.getState().currentMatch;
        if (!currentMatch) return;

        set((state) => {
          state.undoStack.push({
            match: JSON.parse(JSON.stringify(currentMatch)),
            timestamp: new Date().toISOString(),
          });

          const entry = state.redoStack.pop();
          if (entry) {
            useMatchStore.setState({ currentMatch: entry.match });
          }
        });
      },

      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,

      rotateOver: () => {
        const match = useMatchStore.getState().currentMatch;
        if (!match) return;
        const innings = match.innings[match.currentInningsIndex];
        if (!innings) return;

        set((state) => {
          // Mark current over as maiden if applicable
          const currentOver = innings.overs[innings.overs.length - 1];
          if (currentOver) {
            const legalBalls = currentOver.balls.filter((b) => b.isLegalDelivery).length;
            currentOver.maiden = legalBalls === 6 && currentOver.runsScored === 0;
          }

          // Start new over
          innings.overs.push({
            overNumber: innings.overs.length,
            balls: [],
            runsScored: 0,
            wicketsTaken: 0,
            extras: 0,
            maiden: false,
          });

          // Swap strike at end of over
          const batters = innings.batters.filter((b) => !b.isOut);
          if (batters.length >= 2) {
            const temp = batters[0].isOnStrike;
            batters[0].isOnStrike = batters[1].isOnStrike;
            batters[1].isOnStrike = temp;
          }
        });
      },

      addWicket: (params) => {
        saveForUndo();

        const match = useMatchStore.getState().currentMatch;
        if (!match) return;
        const innings = match.innings[match.currentInningsIndex];
        if (!innings) return;

        set((state) => {
          // Increment wickets
          innings.totalWickets += 1;

          // Update batter
          const batter = innings.batters.find(
            (b) => b.playerId === params.batsmanId && !b.isOut,
          );
          if (batter) {
            batter.isOut = true;
            batter.wicketType = params.type;
            batter.bowlerId = params.bowlerId;
            batter.fielderIds = params.fielderIds;
          }

          // Update bowler wickets (not for run outs)
          if (params.type !== 'RUN_OUT' && params.bowlerId) {
            const bowler = innings.bowlers.find((b) => b.playerId === params.bowlerId);
            if (bowler) bowler.wickets += 1;
          }

          // Fall of wicket
          innings.fallOfWickets.push({
            wicketNumber: innings.totalWickets,
            score: innings.totalRuns,
            overs: innings.totalBalls,
            batsmanId: params.batsmanId,
          });

          // Reset partnership
          innings.partnership = {
            runs: 0,
            balls: 0,
            batter1Id: '',
            batter2Id: '',
          };

          // Update current over wicket count
          const currentOver = innings.overs[innings.overs.length - 1];
          if (currentOver) currentOver.wicketsTaken += 1;
        });
      },

      addBatterToInnings: (playerId, _playerName) => {
        const match = useMatchStore.getState().currentMatch;
        if (!match) return;
        const innings = match.innings[match.currentInningsIndex];
        if (!innings) return;

        set((state) => {
          const batter: BatterInnings = {
            playerId,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOut: false,
            isOnStrike: innings.batters.length === 0,
          };
          innings.batters.push(batter);

          // Update partnership
          const activeBatters = innings.batters.filter((b) => !b.isOut);
          if (activeBatters.length === 2) {
            innings.partnership.batter1Id = activeBatters[0].playerId;
            innings.partnership.batter2Id = activeBatters[1].playerId;
          }
        });
      },

      swapStrike: () => {
        const match = useMatchStore.getState().currentMatch;
        if (!match) return;
        const innings = match.innings[match.currentInningsIndex];
        if (!innings) return;

        set((state) => {
          const activeBatters = innings.batters.filter((b) => !b.isOut);
          if (activeBatters.length >= 2) {
            activeBatters.forEach((b) => (b.isOnStrike = !b.isOnStrike));
          }
        });
      },

      addBowlerToInnings: (playerId, _playerName) => {
        const match = useMatchStore.getState().currentMatch;
        if (!match) return;
        const innings = match.innings[match.currentInningsIndex];
        if (!innings) return;

        set((state) => {
          if (!innings.bowlers.find((b) => b.playerId === playerId)) {
            const bowler: BowlerInnings = {
              playerId,
              overs: 0,
              balls: 0,
              maidens: 0,
              runs: 0,
              wickets: 0,
              economy: 0,
              wides: 0,
              noBalls: 0,
              dotBalls: 0,
            };
            innings.bowlers.push(bowler);
          }
        });
      },

      setCurrentBowler: (_playerId) => {
        // Handled via addBowlerToInnings + UI state
      },

      getScoreState: (battingTeam, bowlingTeam) => {
        const match = useMatchStore.getState().currentMatch;
        if (!match) return null;
        const innings = match.innings[match.currentInningsIndex];
        if (!innings) return null;

        const activeBatters = innings.batters.filter((b) => !b.isOut);
        const striker = activeBatters.find((b) => b.isOnStrike);
        const nonStriker = activeBatters.find((b) => !b.isOnStrike);
        const currentBowler = innings.bowlers[innings.bowlers.length - 1];

        const lastOver = innings.overs[innings.overs.length - 1];
        const lastSixBalls = lastOver ? lastOver.balls.slice(-6) : [];

        // Target calculation for 2nd innings
        let target: number | undefined;
        let requiredRunRate: number | undefined;
        if (match.currentInningsIndex === 1 && match.innings.length > 1) {
          const firstInnings = match.innings[0];
          target = firstInnings.totalRuns + 1;
          const remainingRuns = target - innings.totalRuns;
          const totalMatchBalls = match.totalOvers * 6;
          const remainingBalls = totalMatchBalls - innings.totalBalls;
          requiredRunRate =
            remainingBalls > 0
              ? Number(((remainingRuns / remainingBalls) * 6).toFixed(2))
              : 0;
        }

        const isPowerplay =
          match.format === 'T20' ? innings.totalBalls <= 36 :
          match.format === 'ODI' ? innings.totalBalls <= 60 : false;

        return {
          matchId: match.id,
          matchStatus: match.status,
          inningsNumber: innings.inningsNumber,
          battingTeam,
          bowlingTeam,
          totalRuns: innings.totalRuns,
          totalWickets: innings.totalWickets,
          totalOvers: formatOvers(innings.totalBalls),
          currentRunRate: innings.currentRunRate,
          requiredRunRate,
          target,
          partnership: {
            runs: innings.partnership.runs,
            balls: innings.partnership.balls,
          },
          currentBatters: [
            striker
              ? {
                  playerId: striker.playerId,
                  name: '', // Will be filled from team data
                  runs: striker.runs,
                  balls: striker.balls,
                  fours: striker.fours,
                  sixes: striker.sixes,
                  strikeRate: striker.strikeRate,
                  isOnStrike: true,
                }
              : { playerId: '', name: '', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOnStrike: true },
            nonStriker
              ? {
                  playerId: nonStriker.playerId,
                  name: '',
                  runs: nonStriker.runs,
                  balls: nonStriker.balls,
                  fours: nonStriker.fours,
                  sixes: nonStriker.sixes,
                  strikeRate: nonStriker.strikeRate,
                  isOnStrike: false,
                }
              : { playerId: '', name: '', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOnStrike: false },
          ] as [LiveBatter, LiveBatter],
          currentBowler: currentBowler
            ? {
                playerId: currentBowler.playerId,
                name: '',
                overs: `${Math.floor(currentBowler.balls / 6)}.${currentBowler.balls % 6}`,
                maidens: currentBowler.maidens,
                runs: currentBowler.runs,
                wickets: currentBowler.wickets,
                economy: currentBowler.economy,
              }
            : { playerId: '', name: '', overs: '0.0', maidens: 0, runs: 0, wickets: 0, economy: 0 },
          lastSixBalls: lastSixBalls.map((b) => ({
            type: b.type,
            runs: b.totalRuns,
            isWicket: b.type === 'WICKET',
          })),
          isPowerplay,
          isFreeHit: false,
          matchInfo: {
            format: match.format,
            totalOvers: match.totalOvers,
            venue: match.venue,
          },
          previousInnings:
            match.innings.length > 1
              ? {
                  teamId: match.innings[0].battingTeamId,
                  teamName: '',
                  totalRuns: match.innings[0].totalRuns,
                  totalWickets: match.innings[0].totalWickets,
                  totalOvers: formatOvers(match.innings[0].totalBalls),
                }
              : undefined,
        };
      },
    };
  }),
);
