import { create } from 'zustand';
import { EventAnimationType, MatchDetails, OverlayType, Team } from '../types/cricket';
import { PRESET_TEAMS } from '../theme/presetThemes';
import { publishLiveMatchState } from '../services/firebase';

export interface HistorySnapshot {
  teamA: Team;
  teamB: Team;
  matchDetails: MatchDetails;
  battingTeamId: string;
  bowlingTeamId: string;
}

export interface BroadcastStoreState {
  teamA: Team;
  teamB: Team;
  matchDetails: MatchDetails;
  battingTeamId: string;
  bowlingTeamId: string;
  activeOverlays: Record<OverlayType, boolean>;
  activeAnimation: EventAnimationType;
  animationTimeoutId: any;
  tournamentId: string;
  isWsConnected: boolean;
  historyStack: HistorySnapshot[];

  // Actions
  toggleOverlay: (type: OverlayType, forceState?: boolean) => void;
  triggerAnimation: (type: EventAnimationType, durationMs?: number) => void;
  clearAnimation: () => void;
  addRuns: (runs: number, isBoundary?: boolean, boundaryType?: 4 | 6) => void;
  addExtra: (type: 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE', runs?: number) => void;
  addWicket: (dismissalType?: string) => void;
  undoLastBall: () => void;
  switchStrikers: () => void;
  setBattingTeam: (teamId: string) => void;
  updateMatchSettings: (settings: Partial<MatchDetails>) => void;
  updateTeamDetails: (teamId: 'teamA' | 'teamB', details: { fullName?: string; shortName?: string; logoUrl?: string }) => void;
  setDecision: (decision: 'PENDING' | 'OUT' | 'NOT OUT' | null) => void;
  setGraphType: (type: 'BAR' | 'LINE' | 'DOUBLE_BAR' | null) => void;
  retireBatter: () => void;
  changeBowler: (name: string) => void;
  bulkAddPlayers: (teamId: 'teamA' | 'teamB', playerNames: string[]) => void;
  updateBatterStats: (batterId: string, updates: Partial<Team['batters'][0]>) => void;
  updateBowlerStats: (bowlerId: string, updates: Partial<Team['bowlers'][0]>) => void;
  updateTeamColors: (teamId: 'teamA' | 'teamB', primary: string, secondary: string, accent?: string) => void;
  setTournament: (tournamentId: string) => void;
  setTournamentId: (tournamentId: string) => void;
  resetMatchState: () => void;
  applyExternalState: (newState: Partial<BroadcastStoreState>) => void;
  setWsConnected: (connected: boolean) => void;
}

const STORAGE_KEY = 'cricscorer_match_state_v2';

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('cricscorer_overlay_channel_v2')
  : null;

let isReceivingBroadcast = false;
let socket: WebSocket | null = null;

function postStateSync(state: any) {
  if (isReceivingBroadcast) return;
  const syncPayload = {
    teamA: state.teamA,
    teamB: state.teamB,
    matchDetails: state.matchDetails,
    battingTeamId: state.battingTeamId,
    bowlingTeamId: state.bowlingTeamId,
    activeOverlays: state.activeOverlays,
    activeAnimation: state.activeAnimation,
    tournamentId: state.tournamentId,
  };

  // 1. Save to LocalStorage & Dispatch Local Event
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncPayload));
      window.dispatchEvent(new CustomEvent('cricscorer_local_update', { detail: syncPayload }));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }

  // 2. Post to BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'CRICSCORER_STATE_SYNC',
        payload: syncPayload,
      });
    } catch (e) {
      console.warn('BroadcastChannel sync warning:', e);
    }
  }

  // 3. Post to WebSocket Server
  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      socket.send(JSON.stringify({
        type: 'STATE_SYNC',
        matchId: 'match_live_001',
        payload: syncPayload,
      }));
    } catch (e) {
      console.warn('WebSocket send warning:', e);
    }
  }

  // 4. Post to Firebase Cloud Firestore
  try {
    publishLiveMatchState('live_match_default', syncPayload);
  } catch (e) {
    console.warn('Firebase publish notice:', e);
  }
}

const DEFAULT_TEAM_A: Team = {
  id: 'IND',
  shortName: 'IND',
  fullName: 'India',
  primaryColor: PRESET_TEAMS.IND.primaryColor,
  secondaryColor: PRESET_TEAMS.IND.secondaryColor,
  accentColor: PRESET_TEAMS.IND.accentColor,
  score: 184,
  wickets: 4,
  overs: 18,
  balls: 4,
  playingXI: [
    'R. Sharma (C)', 'Y. Jaiswal', 'V. Kohli', 'S. Yadav',
    'R. Pant (WK)', 'H. Pandya', 'R. Jadeja', 'A. Patel',
    'K. Yadav', 'J. Bumrah', 'A. Singh'
  ],
  batters: [
    { id: 'b1', name: 'S. Yadav', runs: 68, balls: 34, fours: 5, sixes: 4, isOut: false, isStriker: true },
    { id: 'b2', name: 'H. Pandya', runs: 29, balls: 14, fours: 2, sixes: 2, isOut: false, isStriker: false },
    { id: 'b3', name: 'R. Sharma', runs: 42, balls: 22, fours: 4, sixes: 3, isOut: true, dismissal: 'c Smith b Starc' },
    { id: 'b4', name: 'V. Kohli', runs: 24, balls: 18, fours: 2, sixes: 0, isOut: true, dismissal: 'b Cummins' },
    { id: 'b5', name: 'R. Pant', runs: 15, balls: 10, fours: 1, sixes: 1, isOut: true, dismissal: 'lbw b Zampa' },
  ],
  bowlers: [
    { id: 'bw1', name: 'J. Bumrah', overs: 3, ballsInCurrentOver: 4, maidens: 0, runsConceded: 18, wickets: 2, economy: 4.90, isCurrent: true },
    { id: 'bw2', name: 'A. Singh', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 32, wickets: 1, economy: 8.00 },
  ],
};

const DEFAULT_TEAM_B: Team = {
  id: 'AUS',
  shortName: 'AUS',
  fullName: 'Australia',
  primaryColor: PRESET_TEAMS.AUS.primaryColor,
  secondaryColor: PRESET_TEAMS.AUS.secondaryColor,
  accentColor: PRESET_TEAMS.AUS.accentColor,
  score: 162,
  wickets: 6,
  overs: 20,
  balls: 0,
  playingXI: [
    'T. Head', 'M. Short', 'M. Marsh (C)', 'G. Maxwell',
    'M. Stoinis', 'T. David', 'J. Inglis (WK)', 'P. Cummins',
    'M. Starc', 'A. Zampa', 'J. Hazlewood'
  ],
  batters: [
    { id: 'ab1', name: 'T. Head', runs: 54, balls: 31, fours: 6, sixes: 3, isOut: true, dismissal: 'c Pant b Bumrah' },
    { id: 'ab2', name: 'M. Marsh', runs: 38, balls: 24, fours: 3, sixes: 2, isOut: true, dismissal: 'c Kohli b Axar' },
  ],
  bowlers: [
    { id: 'abw1', name: 'P. Cummins', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 36, wickets: 2, economy: 9.00 },
    { id: 'abw2', name: 'M. Starc', overs: 3, ballsInCurrentOver: 4, maidens: 0, runsConceded: 42, wickets: 1, economy: 11.45, isCurrent: true },
    { id: 'abw3', name: 'A. Zampa', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 28, wickets: 1, economy: 7.00 },
    { id: 'abw4', name: 'J. Hazlewood', overs: 4, ballsInCurrentOver: 0, maidens: 0, runsConceded: 31, wickets: 0, economy: 7.75 },
  ],
};

const DEFAULT_MATCH_DETAILS: MatchDetails = {
  title: 'FINAL - T20 WORLD TROPHY 2026',
  tournament: 'T20 WORLD TROPHY 2026',
  stage: 'CHAMPIONSHIP FINAL',
  venue: 'MELBOURNE CRICKET GROUND',
  tossWinner: 'Australia',
  tossDecision: 'bowl',
  targetRuns: 186,
  currentInnings: 1,
  totalOvers: 20,
  recentBalls: ['1', '4', '0', '6', 'W', '2'],
  partnership: {
    runs: 74,
    balls: 38,
    batter1Name: 'S. Yadav',
    batter1Runs: 46,
    batter1Balls: 22,
    batter2Name: 'H. Pandya',
    batter2Runs: 28,
    batter2Balls: 16,
  },
  fallOfWickets: [
    { wicketNumber: 1, runs: 48, over: '4.5', batterName: 'R. Sharma' },
    { wicketNumber: 2, runs: 79, over: '8.2', batterName: 'V. Kohli' },
    { wicketNumber: 3, runs: 110, over: '12.1', batterName: 'R. Pant' },
  ],
  matchStatusText: 'IND NEED 2 Runs IN 8 BALLS',
  winnerTeamId: 'IND',
  winnerMargin: 'India won by 7 wickets',
  playerOfTheMatch: {
    name: 'S. Yadav',
    team: 'IND',
    stats: '68* (34) | 5x4, 4x6',
  },
  playerOfTheTournament: {
    name: 'J. Bumrah',
    team: 'IND',
    stats: '15 Wickets | Econ 4.25',
  },
  pointsTable: [
    { teamId: 'IND', shortName: 'IND', played: 5, won: 5, lost: 0, nrr: '+2.14', points: 10 },
    { teamId: 'AUS', shortName: 'AUS', played: 5, won: 4, lost: 1, nrr: '+1.45', points: 8 },
    { teamId: 'ENG', shortName: 'ENG', played: 5, won: 3, lost: 2, nrr: '+0.82', points: 6 },
    { teamId: 'SA', shortName: 'SA', played: 5, won: 2, lost: 3, nrr: '-0.12', points: 4 },
  ],
  topBatters: [
    { name: 'S. Yadav', team: 'IND', matches: 6, runs: 284, average: '56.80', strikeRate: '168.4' },
    { name: 'T. Head', team: 'AUS', matches: 6, runs: 265, average: '44.16', strikeRate: '154.2' },
  ],
  topBowlers: [
    { name: 'J. Bumrah', team: 'IND', matches: 6, wickets: 15, economy: '4.85', best: '4/14' },
    { name: 'A. Zampa', team: 'AUS', matches: 6, wickets: 12, economy: '6.90', best: '3/18' },
  ],
  sponsors: [
    { name: 'APEX SPORTS' },
    { name: 'NEXTGEN TECH' },
    { name: 'VELOCITY ENERGY' },
  ],
};

const INITIAL_OVERLAYS: Record<OverlayType, boolean> = {
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
};

// Initial state loader from LocalStorage
function loadInitialState() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          teamA: parsed.teamA || DEFAULT_TEAM_A,
          teamB: parsed.teamB || DEFAULT_TEAM_B,
          matchDetails: parsed.matchDetails || DEFAULT_MATCH_DETAILS,
          battingTeamId: parsed.battingTeamId || 'IND',
          bowlingTeamId: parsed.bowlingTeamId || 'AUS',
          activeOverlays: parsed.activeOverlays || INITIAL_OVERLAYS,
          activeAnimation: parsed.activeAnimation || null,
          tournamentId: parsed.tournamentId || 'ipl25',
        };
      }
    } catch (e) {
      console.warn('LocalStorage load warning:', e);
    }
  }
  return {
    teamA: DEFAULT_TEAM_A,
    teamB: DEFAULT_TEAM_B,
    matchDetails: DEFAULT_MATCH_DETAILS,
    battingTeamId: 'IND',
    bowlingTeamId: 'AUS',
    activeOverlays: INITIAL_OVERLAYS,
    activeAnimation: null,
    tournamentId: 'ipl25',
  };
}

const loadedState = loadInitialState();

function getSnapshot(state: { teamA: Team; teamB: Team; matchDetails: MatchDetails; battingTeamId: string; bowlingTeamId: string; }): HistorySnapshot {
  return JSON.parse(JSON.stringify({
    teamA: state.teamA,
    teamB: state.teamB,
    matchDetails: state.matchDetails,
    battingTeamId: state.battingTeamId,
    bowlingTeamId: state.bowlingTeamId,
  }));
}

export const useBroadcastStore = create<BroadcastStoreState>((set, get) => ({
  teamA: loadedState.teamA,
  teamB: loadedState.teamB,
  matchDetails: loadedState.matchDetails,
  battingTeamId: loadedState.battingTeamId,
  bowlingTeamId: loadedState.bowlingTeamId,
  activeOverlays: loadedState.activeOverlays,
  activeAnimation: loadedState.activeAnimation,
  animationTimeoutId: null,
  tournamentId: loadedState.tournamentId,
  isWsConnected: false,
  historyStack: [],

  setWsConnected: (connected) => set({ isWsConnected: connected }),

  applyExternalState: (newState) => {
    isReceivingBroadcast = true;
    set((state) => ({ ...state, ...newState }));
    isReceivingBroadcast = false;
  },

  toggleOverlay: (type, forceState) => {
    set((state) => {
      const updated = {
        ...state.activeOverlays,
        [type]: forceState !== undefined ? forceState : !state.activeOverlays[type],
      };
      const nextState = { ...state, activeOverlays: updated };
      postStateSync(nextState);
      return { activeOverlays: updated };
    });
  },

  triggerAnimation: (type, durationMs = 4000) => {
    const { animationTimeoutId } = get();
    if (animationTimeoutId) clearTimeout(animationTimeoutId);

    const newTimeout = setTimeout(() => {
      set({ activeAnimation: null, animationTimeoutId: null });
      postStateSync({ ...get(), activeAnimation: null });
    }, durationMs);

    set({ activeAnimation: type, animationTimeoutId: newTimeout });
    postStateSync({ ...get(), activeAnimation: type });
  },

  clearAnimation: () => {
    const { animationTimeoutId } = get();
    if (animationTimeoutId) clearTimeout(animationTimeoutId);
    set({ activeAnimation: null, animationTimeoutId: null });
    postStateSync({ ...get(), activeAnimation: null });
  },

  addRuns: (runs, isBoundary = false, boundaryType) => {
    set((state) => {
      const snapshot = getSnapshot(state);
      const newHistory = [...state.historyStack, snapshot].slice(-30);

      const isTeamA = state.battingTeamId === state.teamA.id;
      const team = isTeamA ? { ...state.teamA } : { ...state.teamB };

      let balls = team.balls + 1;
      let overs = team.overs;
      if (balls >= 6) {
        overs += 1;
        balls = 0;
      }
      team.balls = balls;
      team.overs = overs;
      team.score += runs;

      const batters = [...team.batters];
      const strikerIndex = batters.findIndex((b) => b.isStriker);
      if (strikerIndex !== -1) {
        const striker = { ...batters[strikerIndex] };
        striker.runs += runs;
        striker.balls += 1;
        if (boundaryType === 4) striker.fours += 1;
        if (boundaryType === 6) striker.sixes += 1;

        if (runs % 2 !== 0) {
          const nonStrikerIndex = batters.findIndex((b) => !b.isOut && !b.isStriker);
          if (nonStrikerIndex !== -1) {
            striker.isStriker = false;
            batters[nonStrikerIndex] = { ...batters[nonStrikerIndex], isStriker: true };
          }
        }
        batters[strikerIndex] = striker;
      }
      team.batters = batters;

      const symbol = isBoundary ? (boundaryType === 6 ? '6' : '4') : runs.toString();
      const recent = [symbol, ...state.matchDetails.recentBalls.slice(0, 5)];

      const nextState = {
        [isTeamA ? 'teamA' : 'teamB']: team,
        matchDetails: { ...state.matchDetails, recentBalls: recent },
        historyStack: newHistory,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });

    if (boundaryType === 4) get().triggerAnimation('FOUR', 3500);
    if (boundaryType === 6) get().triggerAnimation('SIX', 4500);
  },

  addExtra: (extraType, extraRuns = 1) => {
    set((state) => {
      const snapshot = getSnapshot(state);
      const newHistory = [...state.historyStack, snapshot].slice(-30);

      const isTeamA = state.battingTeamId === state.teamA.id;
      const team = isTeamA ? { ...state.teamA } : { ...state.teamB };
      team.score += extraRuns;

      const symbol = extraType === 'WIDE' ? `${extraRuns}WD` : `${extraRuns}NB`;
      const recent = [symbol, ...state.matchDetails.recentBalls.slice(0, 5)];

      const nextState = {
        [isTeamA ? 'teamA' : 'teamB']: team,
        matchDetails: { ...state.matchDetails, recentBalls: recent },
        historyStack: newHistory,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });

    if (extraType === 'WIDE') get().triggerAnimation('WIDE', 3000);
    if (extraType === 'NO_BALL') get().triggerAnimation('NO_BALL', 3000);
  },

  addWicket: (dismissalType = 'c & b Bowler') => {
    set((state) => {
      const snapshot = getSnapshot(state);
      const newHistory = [...state.historyStack, snapshot].slice(-30);

      const isTeamA = state.battingTeamId === state.teamA.id;
      const team = isTeamA ? { ...state.teamA } : { ...state.teamB };

      team.wickets += 1;
      let balls = team.balls + 1;
      let overs = team.overs;
      if (balls >= 6) {
        overs += 1;
        balls = 0;
      }
      team.balls = balls;
      team.overs = overs;

      const batters = [...team.batters];
      const strikerIndex = batters.findIndex((b) => b.isStriker);
      if (strikerIndex !== -1) {
        batters[strikerIndex] = {
          ...batters[strikerIndex],
          isOut: true,
          isStriker: false,
          dismissal: dismissalType,
        };
      }
      const nextBatterIndex = batters.findIndex((b) => !b.isOut && !b.isStriker);
      if (nextBatterIndex !== -1) {
        batters[nextBatterIndex] = {
          ...batters[nextBatterIndex],
          isStriker: true,
        };
      }
      team.batters = batters;

      const recent = ['W', ...state.matchDetails.recentBalls.slice(0, 5)];

      const nextState = {
        [isTeamA ? 'teamA' : 'teamB']: team,
        matchDetails: { ...state.matchDetails, recentBalls: recent },
        historyStack: newHistory,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });

    get().triggerAnimation('WICKET', 4500);
  },

  undoLastBall: () => {
    set((state) => {
      if (state.historyStack.length === 0) return state;
      const history = [...state.historyStack];
      const lastSnapshot = history.pop();
      if (!lastSnapshot) return state;

      const nextState = {
        teamA: lastSnapshot.teamA,
        teamB: lastSnapshot.teamB,
        matchDetails: lastSnapshot.matchDetails,
        battingTeamId: lastSnapshot.battingTeamId,
        bowlingTeamId: lastSnapshot.bowlingTeamId,
        historyStack: history,
        activeAnimation: null,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });

    // Also notify backend server if connected
    if (typeof window !== 'undefined') {
      fetch('http://localhost:4000/api/matches/match_live_001/undo', { method: 'POST' }).catch(() => {});
    }
  },

  switchStrikers: () => {
    set((state) => {
      const isTeamA = state.battingTeamId === state.teamA.id;
      const team = isTeamA ? { ...state.teamA } : { ...state.teamB };
      const batters = team.batters.map((b) => {
        if (!b.isOut) return { ...b, isStriker: !b.isStriker };
        return b;
      });
      team.batters = batters;
      const nextState = { [isTeamA ? 'teamA' : 'teamB']: team };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  setBattingTeam: (teamId) => {
    set((state) => {
      const nextState = {
        battingTeamId: teamId,
        bowlingTeamId: teamId === state.teamA.id ? state.teamB.id : state.teamA.id,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  updateMatchSettings: (settings) => {
    set((state) => {
      const nextMatchDetails = { ...state.matchDetails, ...settings };
      postStateSync({ ...state, matchDetails: nextMatchDetails });
      return { matchDetails: nextMatchDetails };
    });
  },

  updateTeamDetails: (targetTeam, details) => {
    set((state) => {
      const newFullName = details.fullName !== undefined ? details.fullName : state[targetTeam].fullName;
      let newShortName = details.shortName !== undefined ? details.shortName : state[targetTeam].shortName;
      if (details.fullName && (!details.shortName || details.shortName === state[targetTeam].shortName)) {
        newShortName = newFullName.split(' ').map((word) => word[0]).join('').substring(0, 4).toUpperCase() || newFullName.substring(0, 3).toUpperCase();
      }
      const updatedTeam = {
        ...state[targetTeam],
        fullName: newFullName,
        shortName: newShortName,
        logoUrl: details.logoUrl !== undefined ? details.logoUrl : state[targetTeam].logoUrl,
      };
      const nextState = { [targetTeam]: updatedTeam };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  setDecision: (decision) => {
    set((state) => {
      const nextMatchDetails = { ...state.matchDetails, decision };
      const nextOverlays = { ...state.activeOverlays, decision: !!decision };
      postStateSync({ ...state, matchDetails: nextMatchDetails, activeOverlays: nextOverlays });
      return { matchDetails: nextMatchDetails, activeOverlays: nextOverlays };
    });
  },

  setGraphType: (graphType) => {
    set((state) => {
      const nextMatchDetails = { ...state.matchDetails, graphType };
      const nextOverlays = { ...state.activeOverlays, graph: !!graphType };
      postStateSync({ ...state, matchDetails: nextMatchDetails, activeOverlays: nextOverlays });
      return { matchDetails: nextMatchDetails, activeOverlays: nextOverlays };
    });
  },

  retireBatter: () => {
    set((state) => {
      const isTeamA = state.battingTeamId === state.teamA.id;
      const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
      const team = state[battingTeamKey];
      const strikerIndex = team.batters.findIndex((b) => b.isStriker);
      if (strikerIndex < 0) return {};
      const updatedBatters = [...team.batters];
      updatedBatters[strikerIndex] = { ...updatedBatters[strikerIndex], isOut: true, dismissal: 'RETIRED HURT', isStriker: false };
      const nextBatter = updatedBatters.find((b) => !b.isOut && !b.isStriker);
      if (nextBatter) {
        const nextIndex = updatedBatters.findIndex((b) => b.id === nextBatter.id);
        updatedBatters[nextIndex] = { ...updatedBatters[nextIndex], isStriker: true };
      }
      const nextTeam = { ...team, batters: updatedBatters };
      const nextState = { [battingTeamKey]: nextTeam };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  changeBowler: (name) => {
    set((state) => {
      const isTeamA = state.battingTeamId === state.teamA.id;
      const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';
      const team = state[bowlingTeamKey];
      const existingBowlerIndex = team.bowlers.findIndex((bw) => bw.name.toLowerCase() === name.toLowerCase());
      let updatedBowlers = team.bowlers.map((bw) => ({ ...bw, isCurrent: false }));
      if (existingBowlerIndex >= 0) {
        updatedBowlers[existingBowlerIndex] = { ...updatedBowlers[existingBowlerIndex], isCurrent: true };
      } else {
        const newBowler = {
          id: `bw_${Date.now()}`,
          name,
          overs: 0,
          ballsInCurrentOver: 0,
          maidens: 0,
          runsConceded: 0,
          wickets: 0,
          economy: 0.0,
          isCurrent: true,
        };
        updatedBowlers.push(newBowler);
      }
      const nextTeam = { ...team, bowlers: updatedBowlers };
      const nextState = { [bowlingTeamKey]: nextTeam };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  bulkAddPlayers: (targetTeam, playerNames) => {
    set((state) => {
      const team = state[targetTeam];
      const newBatters = playerNames.map((name, i) => ({
        id: `p_${Date.now()}_${i}`,
        name: name.trim(),
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        isStriker: false,
      }));
      const updatedTeam = {
        ...team,
        playingXI: playerNames.map((p) => p.trim()),
        batters: [...team.batters, ...newBatters],
      };
      const nextState = { [targetTeam]: updatedTeam };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  updateBatterStats: (batterId, updates) => {
    set((state) => {
      const updateTeam = (team: Team) => ({
        ...team,
        batters: team.batters.map((b) => (b.id === batterId ? { ...b, ...updates } : b)),
      });
      const nextState = {
        teamA: updateTeam(state.teamA),
        teamB: updateTeam(state.teamB),
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  updateBowlerStats: (bowlerId, updates) => {
    set((state) => {
      const updateTeam = (team: Team) => ({
        ...team,
        bowlers: team.bowlers.map((bw) => (bw.id === bowlerId ? { ...bw, ...updates } : bw)),
      });
      const nextState = {
        teamA: updateTeam(state.teamA),
        teamB: updateTeam(state.teamB),
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  updateTeamColors: (targetTeam, primary, secondary, accent) => {
    set((state) => {
      const nextState = {
        [targetTeam]: {
          ...state[targetTeam],
          primaryColor: primary,
          secondaryColor: secondary,
          accentColor: accent || state[targetTeam].accentColor,
        },
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  setTournament: (tournamentId) => {
    set((state) => {
      postStateSync({ ...state, tournamentId });
      return { tournamentId };
    });
  },

  setTournamentId: (tournamentId) => {
    set((state) => {
      postStateSync({ ...state, tournamentId });
      return { tournamentId };
    });
  },

  resetMatchState: () => {
    const defaultState = {
      teamA: DEFAULT_TEAM_A,
      teamB: DEFAULT_TEAM_B,
      matchDetails: DEFAULT_MATCH_DETAILS,
      activeOverlays: INITIAL_OVERLAYS,
      activeAnimation: null,
      historyStack: [],
    };
    set(defaultState);
    postStateSync(defaultState);
  },
}));

// Auto-reconnecting WebSocket Gateway Client
function initWebSocketClient() {
  if (typeof window === 'undefined') return;

  function connect() {
    try {
      socket = new WebSocket('ws://localhost:4000');

      socket.onopen = () => {
        console.log('⚡ Connected to CricScorer WebSocket Backend');
        useBroadcastStore.getState().setWsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INITIAL_STATE' || data.type === 'MATCH_UPDATE' || data.type === 'STATE_SYNC') {
            if (data.payload) {
              useBroadcastStore.getState().applyExternalState(data.payload);
            }
          } else if (data.type === 'OVERLAY_TOGGLE' && data.payload) {
            useBroadcastStore.getState().toggleOverlay(data.payload.overlayId, data.payload.visible);
          } else if (data.type === 'ANIMATION_TRIGGER' && data.payload) {
            useBroadcastStore.getState().triggerAnimation(data.payload.animation, data.payload.durationMs);
          }
        } catch (err) {
          console.warn('WS Message parsing error:', err);
        }
      };

      socket.onclose = () => {
        useBroadcastStore.getState().setWsConnected(false);
        setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        useBroadcastStore.getState().setWsConnected(false);
      };
    } catch (err) {
      console.warn('WebSocket init exception:', err);
      setTimeout(connect, 3000);
    }
  }

  connect();
}

initWebSocketClient();

// Setup BroadcastChannel Listener
if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    if (event.data?.type === 'CRICSCORER_STATE_SYNC' && event.data.payload) {
      useBroadcastStore.getState().applyExternalState(event.data.payload);
    }
  };
}

// Setup Window Storage Event Listener (Guarantees OBS Studio Sync!)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        useBroadcastStore.getState().applyExternalState(parsed);
      } catch (err) {
        console.warn('Storage event sync warning:', err);
      }
    }
  });
}
