import { create } from 'zustand';
import { EventAnimationType, MatchDetails, OverlayType, Team } from '../types/cricket';
import { PRESET_TEAMS } from '../theme/presetThemes';
import { publishLiveMatchState } from '../services/firebase';

export interface BallLogEntry {
  over: number;
  ball: number;
  batter: string;
  bowler: string;
  runs: number;
  extra?: 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE';
  wicket?: string;
  timestamp: number;
  event?: string;
}

export interface HistorySnapshot {
  teamA: Team;
  teamB: Team;
  matchDetails: MatchDetails;
  battingTeamId: string;
  bowlingTeamId: string;
  ballLog?: BallLogEntry[];
}

export interface MatchArchive {
  matchId: string;
  date: number;
  teamA: Team;
  teamB: Team;
  matchDetails: MatchDetails;
  ballLog: BallLogEntry[];
  result: string;
}

import { BlitzCustomSettings, DEFAULT_BLITZ_SETTINGS } from '../types/blitzSettings';

export interface BroadcastStoreState {
  matchId: string;
  matchArchive: MatchArchive[];
  lastUpdated?: number;
  originId?: string;
  seq?: number;
  heartbeatAt?: number;
  overlayAckAt?: number;
  syncErrorCount: number;
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
  blitzSettings: BlitzCustomSettings;
  ballLog: BallLogEntry[];
  // Actions
  incrementSyncError?: () => void;
  setOverlayAck: (at: number) => void;
  setOverlayAckAt?: (timestamp: number) => void;
  toggleOverlay: (type: OverlayType, forceState?: boolean) => void;
  hideAllOverlays: () => void;
  triggerAnimation: (type: EventAnimationType, durationMs?: number) => void;
  clearAnimation: () => void;
  addRuns: (runs: number, isBoundary?: boolean, boundaryType?: 4 | 6) => void;
  addExtra: (type: 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE', runs?: number) => void;
  addPenaltyRuns: (targetTeam: 'batting' | 'bowling' | 'teamA' | 'teamB', runs: number) => void;
  addWicket: (dismissalType?: string) => void;
  undoLastBall: () => void;
  switchStrikers: () => void;
  setBattingTeam: (teamId: string) => void;
  updateMatchSettings: (settings: Partial<MatchDetails>) => void;
  updateTeamDetails: (teamId: 'teamA' | 'teamB', details: { fullName?: string; shortName?: string; logoUrl?: string }) => void;
  setActivePairs: (strikerId: string, nonStrikerId: string) => void;
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
  archiveAndReset: () => void;
  loadArchiveAsNewMatch: (archiveMatchId: string) => void;
  resetMatchState: () => void;
  startMatch: () => void;
  stopMatch: () => void;
  startNewMatchWithTeams: (teamAName: string, teamBName: string, tournamentName?: string) => void;
  startSecondInnings: () => void;
  updatePlayerAvatar: (teamId: 'teamA' | 'teamB', playerType: 'batter' | 'bowler', playerId: string, avatarUrl: string) => void;
  applyExternalState: (newState: Partial<BroadcastStoreState>) => void;
  setWsConnected: (connected: boolean) => void;
  updateBlitzSettings: (settings: Partial<BlitzCustomSettings>) => void;
}

const STORAGE_KEY = 'ar_sports_match_state_v2';
const LEGACY_STORAGE_KEY = 'cricscorer_match_state_v2';
const ARCHIVE_STORAGE_KEY = 'ar_sports_archive';

export function generateMatchId() {
  return `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function loadMatchArchive(): MatchArchive[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMatchArchive(archive: MatchArchive[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archive));
  } catch {}
}

export const SPONSOR_LOG_KEY = 'ar_sports_sponsor_log';

export interface SponsorLogEntry {
  sponsorId: string;
  overlayId: 'sponsorGraphics';
  onAirAt: number;
  offAirAt?: number;
  durationSeconds?: number;
}

export function getSponsorLog(): SponsorLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SPONSOR_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSponsorLog(log: SponsorLogEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SPONSOR_LOG_KEY, JSON.stringify(log));
  } catch {}
}

export function getActiveSponsorId(sponsors?: Array<any>): string {
  if (Array.isArray(sponsors) && sponsors.length > 0) {
    const s = sponsors[0];
    if (s && typeof s === 'object' && s.id && s.name) {
      return String(s.id);
    }
  }
  return 'unlabeled';
}

export function recordSponsorOnAir(sponsorId: string): SponsorLogEntry {
  const log = getSponsorLog();
  const entry: SponsorLogEntry = {
    sponsorId: sponsorId || 'unlabeled',
    overlayId: 'sponsorGraphics',
    onAirAt: Date.now(),
  };
  log.push(entry);
  saveSponsorLog(log);
  return entry;
}

export function recordSponsorOffAir(timestamp?: number): SponsorLogEntry | null {
  const log = getSponsorLog();
  if (log.length === 0) return null;

  const now = timestamp || Date.now();
  for (let i = log.length - 1; i >= 0; i--) {
    if (!log[i].offAirAt) {
      log[i].offAirAt = now;
      log[i].durationSeconds = Math.max(0, Math.round((now - log[i].onAirAt) / 1000));
      saveSponsorLog(log);
      return log[i];
    }
  }
  return null;
}

export function generateSponsorLogCsv(log: SponsorLogEntry[]): string {
  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headers = ['sponsorId', 'overlayId', 'onAirAt', 'offAirAt', 'durationSeconds'];
  const rows = log.map((entry) => [
    escapeCsv(entry.sponsorId),
    escapeCsv(entry.overlayId),
    escapeCsv(entry.onAirAt),
    escapeCsv(entry.offAirAt ?? ''),
    escapeCsv(entry.durationSeconds ?? (entry.offAirAt ? Math.round((entry.offAirAt - entry.onAirAt) / 1000) : '')),
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('ar_sports_overlay_channel_v2')
  : null;

export const clientId = (() => {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    let id = sessionStorage.getItem('ar_client_id');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      try { sessionStorage.setItem('ar_client_id', id); } catch {}
    }
    return id;
  }
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
})();

let localSeq = 0;
export const lastSeenSeqByOrigin = new Map<string, number>();

let isReceivingBroadcast = false;
let socket: WebSocket | null = null;

function buildCompactSyncPayload(state: any) {
  localSeq += 1;
  return {
    matchId: state.matchId,
    originId: clientId,
    seq: localSeq,
    lastUpdated: state.lastUpdated || Date.now(),
    heartbeatAt: Date.now(),
    teamA: {
      id: state.teamA?.id || 'teamA',
      shortName: state.teamA?.shortName || 'T1',
      fullName: state.teamA?.fullName || 'Team A',
      primaryColor: state.teamA?.primaryColor || '#000080',
      secondaryColor: state.teamA?.secondaryColor || '#ffffff',
      accentColor: state.teamA?.accentColor || '#ffcc00',
      logoUrl: state.teamA?.logoUrl,
      score: state.teamA?.score || 0,
      wickets: state.teamA?.wickets || 0,
      overs: state.teamA?.overs || 0,
      balls: state.teamA?.balls || 0,
      extras: state.teamA?.extras || 0,
      fallOfWickets: state.teamA?.fallOfWickets || [],
      batters: (state.teamA?.batters || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        runs: b.runs,
        balls: b.balls,
        fours: b.fours,
        sixes: b.sixes,
        isOut: b.isOut,
        dismissal: b.dismissal,
        isStriker: b.isStriker,
      })),
      bowlers: (state.teamA?.bowlers || []).map((bw: any) => ({
        id: bw.id,
        name: bw.name,
        overs: bw.overs,
        ballsInCurrentOver: bw.ballsInCurrentOver,
        maidens: bw.maidens,
        runsConceded: bw.runsConceded,
        wickets: bw.wickets,
        economy: bw.economy,
        isCurrent: bw.isCurrent,
      })),
    },
    teamB: {
      id: state.teamB?.id || 'teamB',
      shortName: state.teamB?.shortName || 'T2',
      fullName: state.teamB?.fullName || 'Team B',
      primaryColor: state.teamB?.primaryColor || '#000080',
      secondaryColor: state.teamB?.secondaryColor || '#ffffff',
      accentColor: state.teamB?.accentColor || '#ffcc00',
      logoUrl: state.teamB?.logoUrl,
      score: state.teamB?.score || 0,
      wickets: state.teamB?.wickets || 0,
      overs: state.teamB?.overs || 0,
      balls: state.teamB?.balls || 0,
      extras: state.teamB?.extras || 0,
      fallOfWickets: state.teamB?.fallOfWickets || [],
      batters: (state.teamB?.batters || []).map((b: any) => ({
        id: b.id,
        name: b.name,
        runs: b.runs,
        balls: b.balls,
        fours: b.fours,
        sixes: b.sixes,
        isOut: b.isOut,
        dismissal: b.dismissal,
        isStriker: b.isStriker,
      })),
      bowlers: (state.teamB?.bowlers || []).map((bw: any) => ({
        id: bw.id,
        name: bw.name,
        overs: bw.overs,
        ballsInCurrentOver: bw.ballsInCurrentOver,
        maidens: bw.maidens,
        runsConceded: bw.runsConceded,
        wickets: bw.wickets,
        economy: bw.economy,
        isCurrent: bw.isCurrent,
      })),
    },
    matchDetails: state.matchDetails,
    battingTeamId: state.battingTeamId,
    bowlingTeamId: state.bowlingTeamId,
    activeOverlays: state.activeOverlays,
    activeAnimation: state.activeAnimation,
    tournamentId: state.tournamentId,
    ballLog: state.ballLog || [],
  };
}

function postStateSync(state: any) {
  if (isReceivingBroadcast) return;
  const now = Date.now();
  state.lastUpdated = now;
  state.heartbeatAt = now;

  const syncPayload = buildCompactSyncPayload(state);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncPayload));
      window.dispatchEvent(new CustomEvent('ar_sports_local_update', { detail: syncPayload }));
    } catch {}
  }

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'AR_SPORTS_STATE_SYNC',
        payload: syncPayload,
      });
    } catch {}
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      socket.send(JSON.stringify({
        type: 'STATE_SYNC',
        matchId: state.matchId || 'match_live_001',
        payload: syncPayload,
      }));
    } catch {}
  }

  try {
    publishLiveMatchState(state.matchId || 'live_match_default', syncPayload);
  } catch {
    useBroadcastStore.getState().incrementSyncError?.();
  }
}

const DEFAULT_TEAM_A: Team = {
  id: 'teamA',
  shortName: 'T1',
  fullName: 'Team 1',
  primaryColor: PRESET_TEAMS.IND.primaryColor,
  secondaryColor: PRESET_TEAMS.IND.secondaryColor,
  accentColor: PRESET_TEAMS.IND.accentColor,
  score: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  extras: 0,
  playingXI: ['Striker 1', 'Striker 2', 'Bowler 1'],
  batters: [
    { id: 'b1', name: 'Striker 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: true },
    { id: 'b2', name: 'Striker 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: false },
  ],
  bowlers: [
    { id: 'bw1', name: 'Bowler 1', overs: 0, ballsInCurrentOver: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, isCurrent: true },
  ],
};

const DEFAULT_TEAM_B: Team = {
  id: 'teamB',
  shortName: 'T2',
  fullName: 'Team 2',
  primaryColor: PRESET_TEAMS.AUS.primaryColor,
  secondaryColor: PRESET_TEAMS.AUS.secondaryColor,
  accentColor: PRESET_TEAMS.AUS.accentColor,
  score: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  extras: 0,
  playingXI: ['Striker 1', 'Striker 2', 'Bowler 1'],
  batters: [
    { id: 'b1', name: 'Striker 1', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: true },
    { id: 'b2', name: 'Striker 2', runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, isStriker: false },
  ],
  bowlers: [
    { id: 'bw1', name: 'Bowler 1', overs: 0, ballsInCurrentOver: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, isCurrent: true },
  ],
};

const DEFAULT_MATCH_DETAILS: MatchDetails = {
  title: 'IPL 2025',
  tournament: 'TATA IPL 2025',
  stage: 'MATCH 1',
  venue: 'STADIUM VENUE',
  tossWinner: 'Team 1',
  tossDecision: 'bat',
  targetRuns: 0,
  currentInnings: 1,
  totalOvers: 20,
  recentBalls: ['0', '0', '0', '0', '0', '0'],
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
  pointsTable: [],
  topBatters: [],
  topBowlers: [],
  sponsors: [],
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
  superOver: false,
  wagonWheel: false,
  pitchMap: false,
  manhattan: false,
  commentator: false,
  watermark: false,
  manOfTheMatchCard: false,
  tournamentTitle: false,
  winPredictor: false,
};

function loadInitialState() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          matchId: parsed.matchId || generateMatchId(),
          matchArchive: loadMatchArchive(),
          teamA: parsed.teamA || DEFAULT_TEAM_A,
          teamB: parsed.teamB || DEFAULT_TEAM_B,
          matchDetails: {
            ...DEFAULT_MATCH_DETAILS,
            ...(parsed.matchDetails || {}),
            isMatchStarted: parsed.matchDetails?.isMatchStarted === true,
          },
          battingTeamId: parsed.battingTeamId || 'teamA',
          bowlingTeamId: parsed.bowlingTeamId || 'teamB',
          activeOverlays: parsed.activeOverlays || INITIAL_OVERLAYS,
          activeAnimation: parsed.activeAnimation || null,
          tournamentId: parsed.tournamentId || 'ipl25',
          blitzSettings: (() => { try { const s = localStorage.getItem('ar_blitz_settings'); return s ? JSON.parse(s) : DEFAULT_BLITZ_SETTINGS; } catch { return DEFAULT_BLITZ_SETTINGS; } })(),
          ballLog: parsed.ballLog || [],
        };
      }
    } catch {}
  }
  return {
    matchId: generateMatchId(),
    matchArchive: loadMatchArchive(),
    teamA: DEFAULT_TEAM_A,
    teamB: DEFAULT_TEAM_B,
    matchDetails: DEFAULT_MATCH_DETAILS,
    battingTeamId: 'teamA',
    bowlingTeamId: 'teamB',
    activeOverlays: INITIAL_OVERLAYS,
    activeAnimation: null,
    tournamentId: 'ipl25',
    blitzSettings: DEFAULT_BLITZ_SETTINGS,
    ballLog: [],
  };
}

const loadedState = loadInitialState();

function getSnapshot(state: { teamA: Team; teamB: Team; matchDetails: MatchDetails; battingTeamId: string; bowlingTeamId: string; ballLog?: BallLogEntry[]; }): HistorySnapshot {
  return JSON.parse(JSON.stringify({
    teamA: state.teamA,
    teamB: state.teamB,
    matchDetails: state.matchDetails,
    battingTeamId: state.battingTeamId,
    bowlingTeamId: state.bowlingTeamId,
    ballLog: state.ballLog || [],
  }));
}

const isBattingTeamA = (state: any) => {
  if (!state || !state.battingTeamId) return true;
  return (
    state.battingTeamId === 'teamA' ||
    state.battingTeamId === state.teamA?.id
  );
};

function calcEconomy(runsConceded: number, overs: number, balls: number): number {
  const totalBalls = (overs || 0) * 6 + (balls || 0);
  const runs = runsConceded || 0;
  if (totalBalls <= 0 || isNaN(runs) || isNaN(totalBalls)) return 0;
  const econ = Number(((runs / totalBalls) * 6).toFixed(2));
  return isNaN(econ) ? 0 : econ;
}

const FULL_CARD_OVERLAYS: OverlayType[] = [
  'battingScorecard',
  'bowlingScorecard',
  'matchSummary',
  'playingXI',
  'toss',
  'pointsTable',
  'wagonWheel',
  'pitchMap',
  'manhattan',
  'winPredictor',
  'winnerScreen',
  'manOfTheMatchCard',
  'playerStatistics',
  'bowlerStatistics',
  'playerOfTheMatch',
  'playerOfTheTournament',
  'topBatters',
  'topBowlers',
];

export function computeMatchResult(state: {
  teamA: Team;
  teamB: Team;
  matchDetails: MatchDetails;
  battingTeamId: string;
  bowlingTeamId: string;
}): string {
  const { teamA, teamB, matchDetails } = state;

  if (matchDetails.winnerMargin) {
    const winnerName =
      matchDetails.winnerTeamId === teamA.id
        ? teamA.fullName
        : matchDetails.winnerTeamId === teamB.id
        ? teamB.fullName
        : '';
    return winnerName ? `${winnerName} won by ${matchDetails.winnerMargin}` : matchDetails.winnerMargin;
  }

  if (!matchDetails.isMatchStarted && teamA.overs === 0 && teamA.balls === 0 && teamB.overs === 0 && teamB.balls === 0) {
    return 'Abandoned';
  }

  const isAFirst = matchDetails.currentInnings === 2
    ? (state.battingTeamId === teamB.id || state.battingTeamId === 'teamB')
    : (state.battingTeamId === teamA.id || state.battingTeamId === 'teamA');

  const firstTeam = isAFirst ? teamA : teamB;
  const chasingTeam = isAFirst ? teamB : teamA;

  if (matchDetails.currentInnings === 2) {
    const target = matchDetails.targetRuns || (firstTeam.score + 1);
    if (chasingTeam.score >= target) {
      const wicketsLeft = 10 - chasingTeam.wickets;
      return `${chasingTeam.fullName} won by ${wicketsLeft} wicket${wicketsLeft === 1 ? '' : 's'} (Chase completed / Target met)`;
    }

    const maxBalls = (matchDetails.totalOvers || 20) * 6;
    const chasingBalls = chasingTeam.overs * 6 + chasingTeam.balls;

    if (chasingTeam.wickets >= 10 || chasingBalls >= maxBalls) {
      if (chasingTeam.score === target - 1) {
        return 'Match Drawn / Tied';
      }
      const runDiff = firstTeam.score - chasingTeam.score;
      return `${firstTeam.fullName} won by ${runDiff} run${runDiff === 1 ? '' : 's'}`;
    }

    return `In Progress — ${chasingTeam.fullName} needs ${target - chasingTeam.score} runs`;
  }

  if (teamA.score === teamB.score && (teamA.overs > 0 || teamB.overs > 0)) {
    return 'Match Drawn / Tied';
  }

  return 'Abandoned';
}

export const useBroadcastStore = create<BroadcastStoreState>((set, get) => ({
  matchId: loadedState.matchId,
  matchArchive: loadedState.matchArchive || [],
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
  blitzSettings: DEFAULT_BLITZ_SETTINGS,
  overlayAckAt: 0,
  syncErrorCount: 0,
  ballLog: loadedState.ballLog || [],

  incrementSyncError: () => set((state) => ({ syncErrorCount: (state.syncErrorCount || 0) + 1 })),
  setOverlayAck: (at) => set({ overlayAckAt: at }),
  setOverlayAckAt: (timestamp) => set({ overlayAckAt: timestamp }),
  setWsConnected: (connected) => set({ isWsConnected: connected }),

  updateBlitzSettings: (settings) => {
    set((state) => {
      const next = { blitzSettings: { ...state.blitzSettings, ...settings } };
      try { localStorage.setItem('ar_blitz_settings', JSON.stringify(next.blitzSettings)); } catch {}
      return next;
    });
  },

  applyExternalState: (newState) => {
    if (!newState || typeof newState !== 'object') return;

    // Guard 1: Ignore updates originating from this tab
    if (newState.originId && newState.originId === clientId) {
      return;
    }

    // Guard 2: Ignore payloads where seq is not greater than the last known seq for that originId
    if (newState.originId && typeof newState.seq === 'number') {
      const lastSeq = lastSeenSeqByOrigin.get(newState.originId) ?? -1;
      if (newState.seq <= lastSeq) {
        return;
      }
      lastSeenSeqByOrigin.set(newState.originId, newState.seq);
    }

    // Guard 3: Ignore stale external updates older than current local state
    const currentLastUpdated = get().lastUpdated || 0;
    if (newState.lastUpdated && newState.lastUpdated < currentLastUpdated) {
      return;
    }

    isReceivingBroadcast = true;
    set((state) => ({
      ...state,
      matchId: newState.matchId || state.matchId,
      lastUpdated: newState.lastUpdated || Date.now(),
      originId: newState.originId || state.originId,
      seq: newState.seq !== undefined ? newState.seq : state.seq,
      heartbeatAt: newState.heartbeatAt || state.heartbeatAt,
      overlayAckAt: newState.overlayAckAt !== undefined ? newState.overlayAckAt : state.overlayAckAt,
      ...(newState.teamA ? { teamA: { ...state.teamA, ...newState.teamA } } : {}),
      ...(newState.teamB ? { teamB: { ...state.teamB, ...newState.teamB } } : {}),
      ...(newState.matchDetails ? { matchDetails: { ...state.matchDetails, ...newState.matchDetails } } : {}),
      ...(newState.battingTeamId ? { battingTeamId: newState.battingTeamId } : {}),
      ...(newState.bowlingTeamId ? { bowlingTeamId: newState.bowlingTeamId } : {}),
      ...(newState.activeOverlays ? { activeOverlays: { ...state.activeOverlays, ...newState.activeOverlays } } : {}),
      ...(newState.activeAnimation !== undefined ? { activeAnimation: newState.activeAnimation } : {}),
      ...(newState.tournamentId ? { tournamentId: newState.tournamentId } : {}),
      ...(newState.ballLog !== undefined ? { ballLog: newState.ballLog } : {}),
      ...(newState.matchArchive !== undefined ? { matchArchive: newState.matchArchive } : {}),
    }));
    isReceivingBroadcast = false;
  },

  toggleOverlay: (type, forceState) => {
    set((state) => {
      const willBeActive = forceState !== undefined ? forceState : !state.activeOverlays[type];
      const updated = { ...state.activeOverlays };

      // Exclusive Full-Card Mode: Auto-close other full cards so overlays never stack on top of each other!
      if (willBeActive && FULL_CARD_OVERLAYS.includes(type)) {
        FULL_CARD_OVERLAYS.forEach((cardKey) => {
          if (cardKey !== type) {
            updated[cardKey] = false;
          }
        });
      }

      // Sponsor compliance logging
      if (type === 'sponsorGraphics') {
        const currentlyActive = Boolean(state.activeOverlays?.sponsorGraphics);
        if (willBeActive && !currentlyActive) {
          const sponsorId = getActiveSponsorId(state.matchDetails?.sponsors);
          recordSponsorOnAir(sponsorId);
        } else if (!willBeActive && currentlyActive) {
          recordSponsorOffAir();
        }
      }

      updated[type] = willBeActive;
      const nextState = { ...state, activeOverlays: updated };
      postStateSync(nextState);
      return { activeOverlays: updated };
    });
  },

  hideAllOverlays: () => {
    set((state) => {
      if (state.activeOverlays?.sponsorGraphics) {
        recordSponsorOffAir();
      }
      const resetOverlays = (Object.keys(state.activeOverlays) as OverlayType[]).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<OverlayType, boolean>);
      const nextState = { ...state, activeOverlays: resetOverlays };
      postStateSync(nextState);
      return { activeOverlays: resetOverlays };
    });
  },

  triggerAnimation: (type, durationMs = 3500) => {
    const { animationTimeoutId, activeAnimation } = get();
    if (animationTimeoutId) clearTimeout(animationTimeoutId);

    // Toggle off if clicking the same active animation
    if (activeAnimation === type) {
      set({ activeAnimation: null, animationTimeoutId: null });
      postStateSync({ ...get(), activeAnimation: null });
      return;
    }

    const newTimeout = setTimeout(() => {
      set({ activeAnimation: null, animationTimeoutId: null });
      const currentState = get();
      postStateSync({ ...currentState, activeAnimation: null });
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

      const isTeamA = isBattingTeamA(state);
      const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
      const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';

      const preOver = state[battingTeamKey].overs;
      const preBall = state[battingTeamKey].balls;
      const batterName = state[battingTeamKey].batters.find((b) => b.isStriker)?.name || 'Striker';
      const bowlerName = state[bowlingTeamKey].bowlers.find((bw) => bw.isCurrent)?.name || 'Bowler';

      const logEntry: BallLogEntry = {
        over: preOver,
        ball: preBall,
        batter: batterName,
        bowler: bowlerName,
        runs,
        timestamp: Date.now(),
      };

      const team = { ...state[battingTeamKey] };
      const bowlingTeam = { ...state[bowlingTeamKey] };

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
        
        if (runs === 4) {
          setTimeout(() => get().triggerAnimation('FOUR'), 50);
          striker.fours = (striker.fours || 0) + 1;
        } else if (runs === 6) {
          setTimeout(() => get().triggerAnimation('SIX'), 50);
          striker.sixes = (striker.sixes || 0) + 1;
        }
        if (boundaryType === 6 && runs !== 6) striker.sixes = (striker.sixes || 0) + 1;
        if (boundaryType === 4 && runs !== 4) striker.fours = (striker.fours || 0) + 1;

        if (runs % 2 !== 0) {
          const nonStrikerIndex = batters.findIndex((b) => !b.isOut && !b.isStriker);
          if (nonStrikerIndex !== -1) {
            striker.isStriker = false;
            batters[nonStrikerIndex] = { ...batters[nonStrikerIndex], isStriker: true };
          }
        }
        batters[strikerIndex] = striker;
      }
      
      // Rotate strike at end of over (if balls === 0 after adding this ball)
      if (balls === 0) {
        const activeStrikerIdx = batters.findIndex((b) => b.isStriker);
        const activeNonStrikerIdx = batters.findIndex((b) => !b.isOut && !b.isStriker);
        if (activeStrikerIdx !== -1 && activeNonStrikerIdx !== -1) {
          batters[activeStrikerIdx].isStriker = false;
          batters[activeNonStrikerIdx].isStriker = true;
        }
      }
      
      team.batters = batters;


      const bowlers = [...bowlingTeam.bowlers];
      const activeBowlerIndex = bowlers.findIndex((bw) => bw.isCurrent) !== -1
        ? bowlers.findIndex((bw) => bw.isCurrent)
        : 0;

      if (bowlers[activeBowlerIndex]) {
        const bw = { ...bowlers[activeBowlerIndex] };
        bw.runsConceded += runs;
        let bwBalls = bw.ballsInCurrentOver + 1;
        let bwOvers = bw.overs;
        if (bwBalls >= 6) {
          bwOvers += 1;
          bwBalls = 0;
        }
        bw.ballsInCurrentOver = bwBalls;
        bw.overs = bwOvers;
        bw.economy = calcEconomy(bw.runsConceded, bwOvers, bwBalls);
        bowlers[activeBowlerIndex] = bw;
        bowlingTeam.bowlers = bowlers;
      }

      const symbol = isBoundary ? (boundaryType === 6 ? '6' : '4') : runs.toString();
      const recent = [symbol, ...state.matchDetails.recentBalls.slice(0, 5)];

      const nextState = {
        [battingTeamKey]: team,
        [bowlingTeamKey]: bowlingTeam,
        matchDetails: { ...state.matchDetails, recentBalls: recent },
        historyStack: newHistory,
        ballLog: [...(state.ballLog || []), logEntry],
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });

    let milestoneReached: 'FIFTY' | 'CENTURY' | null = null;
    const currentBatters = (isBattingTeamA(get()) ? get().teamA : get().teamB).batters;
    const currentStriker = currentBatters.find((b) => b.isStriker);
    const prevRuns = currentStriker?.runs || 0;
    const newRuns = prevRuns + runs;

    if (prevRuns < 50 && newRuns >= 50 && newRuns < 100) milestoneReached = 'FIFTY';
    if (prevRuns < 100 && newRuns >= 100) milestoneReached = 'CENTURY';

    if (milestoneReached) {
      get().triggerAnimation(milestoneReached, 5000);
    } else {
      if (boundaryType === 4) get().triggerAnimation('FOUR', 3500);
      if (boundaryType === 6) get().triggerAnimation('SIX', 4500);
    }
  },

  addExtra: (extraType, extraRuns = 1) => {
    set((state) => {
      const snapshot = getSnapshot(state);
      const newHistory = [...state.historyStack, snapshot].slice(-30);

      const isTeamA = isBattingTeamA(state);
      const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
      const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';

      const preOver = state[battingTeamKey].overs;
      const preBall = state[battingTeamKey].balls;
      const batterName = state[battingTeamKey].batters.find((b) => b.isStriker)?.name || 'Striker';
      const bowlerName = state[bowlingTeamKey].bowlers.find((bw) => bw.isCurrent)?.name || 'Bowler';

      const logEntry: BallLogEntry = {
        over: preOver,
        ball: preBall,
        batter: batterName,
        bowler: bowlerName,
        runs: extraRuns,
        extra: extraType,
        timestamp: Date.now(),
      };

      const team = { ...state[battingTeamKey] };
      const bowlingTeam = { ...state[bowlingTeamKey] };
      team.score += extraRuns;
      team.extras = (team.extras || 0) + extraRuns;

      const bowlers = [...bowlingTeam.bowlers];
      const activeBowlerIndex = bowlers.findIndex((bw) => bw.isCurrent) !== -1
        ? bowlers.findIndex((bw) => bw.isCurrent)
        : 0;

      if (extraType === 'WIDE' || extraType === 'NO_BALL') {
        if (bowlers[activeBowlerIndex]) {
          const bw = { ...bowlers[activeBowlerIndex] };
          bw.runsConceded += extraRuns;
          bw.economy = calcEconomy(bw.runsConceded, bw.overs, bw.ballsInCurrentOver);
          bowlers[activeBowlerIndex] = bw;
          bowlingTeam.bowlers = bowlers;
        }
      } else {
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
          const striker = { ...batters[strikerIndex] };
          striker.balls += 1;
          
          // Rotate strike on odd Byes/Leg-byes
          if ((extraType === 'BYE' || extraType === 'LEG_BYE') && extraRuns % 2 !== 0) {
            const nonStrikerIndex = batters.findIndex((b) => !b.isOut && !b.isStriker);
            if (nonStrikerIndex !== -1) {
              striker.isStriker = false;
              batters[nonStrikerIndex] = { ...batters[nonStrikerIndex], isStriker: true };
            }
          }
          batters[strikerIndex] = striker;
        }
        
        // Rotate strike at end of over
        if (balls === 0) {
          const activeStrikerIdx = batters.findIndex((b) => b.isStriker);
          const activeNonStrikerIdx = batters.findIndex((b) => !b.isOut && !b.isStriker);
          if (activeStrikerIdx !== -1 && activeNonStrikerIdx !== -1) {
            batters[activeStrikerIdx].isStriker = false;
            batters[activeNonStrikerIdx].isStriker = true;
          }
        }
        
        team.batters = batters;

        if (bowlers[activeBowlerIndex]) {
          const bw = { ...bowlers[activeBowlerIndex] };
          let bwBalls = bw.ballsInCurrentOver + 1;
          let bwOvers = bw.overs;
          if (bwBalls >= 6) {
            bwOvers += 1;
            bwBalls = 0;
          }
          bw.ballsInCurrentOver = bwBalls;
          bw.overs = bwOvers;
          bw.economy = calcEconomy(bw.runsConceded, bwOvers, bwBalls);
          bowlers[activeBowlerIndex] = bw;
          bowlingTeam.bowlers = bowlers;
        }
      }

      const symbol = extraType === 'WIDE' ? `${extraRuns}WD`
        : extraType === 'NO_BALL' ? `${extraRuns}NB`
        : extraType === 'BYE' ? `${extraRuns}B`
        : `${extraRuns}LB`;
      const recent = [symbol, ...state.matchDetails.recentBalls.slice(0, 5)];

      const nextState = {
        [battingTeamKey]: team,
        [bowlingTeamKey]: bowlingTeam,
        matchDetails: { ...state.matchDetails, recentBalls: recent },
        historyStack: newHistory,
        ballLog: [...(state.ballLog || []), logEntry],
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });

    if (extraType === 'WIDE') get().triggerAnimation('WIDE', 3000);
    if (extraType === 'NO_BALL') get().triggerAnimation('NO_BALL', 3000);
  },

  addPenaltyRuns: (targetTeam, runs) => {
    set((state) => {
      const snapshot = getSnapshot(state);
      const newHistory = [...state.historyStack, snapshot].slice(-30);
      const isTeamA = isBattingTeamA(state);
      let key: 'teamA' | 'teamB' = 'teamA';
      if (targetTeam === 'batting') key = isTeamA ? 'teamA' : 'teamB';
      else if (targetTeam === 'bowling') key = isTeamA ? 'teamB' : 'teamA';
      else key = targetTeam;

      const team = { ...state[key], score: state[key].score + runs, extras: (state[key].extras || 0) + runs };
      const recent = [`+${runs}PEN`, ...state.matchDetails.recentBalls.slice(0, 5)];
      const nextState = {
        [key]: team,
        matchDetails: { ...state.matchDetails, recentBalls: recent },
        historyStack: newHistory,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  addWicket: (dismissalType = 'c & b Bowler') => {
    set((state) => {
      const isTeamA = isBattingTeamA(state);
      const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
      const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';

      const preOver = state[battingTeamKey].overs;
      const preBall = state[battingTeamKey].balls;
      const batterName = state[battingTeamKey].batters.find((b) => b.isStriker)?.name || 'Striker';
      const bowlerName = state[bowlingTeamKey].bowlers.find((bw) => bw.isCurrent)?.name || 'Bowler';

      const lastLog = state.ballLog && state.ballLog.length > 0 ? state.ballLog[state.ballLog.length - 1] : null;
      const isOffIllegalDelivery = Boolean(
        lastLog &&
        (lastLog.extra === 'WIDE' || lastLog.extra === 'NO_BALL') &&
        lastLog.over === preOver &&
        lastLog.ball === preBall
      );

      const snapshot = getSnapshot(state);
      const newHistory = isOffIllegalDelivery
        ? state.historyStack
        : [...state.historyStack, snapshot].slice(-30);

      const logEntry: BallLogEntry = {
        over: preOver,
        ball: preBall,
        batter: batterName,
        bowler: bowlerName,
        runs: 0,
        wicket: dismissalType,
        timestamp: Date.now(),
      };

      const team = { ...state[battingTeamKey] };
      const bowlingTeam = { ...state[bowlingTeamKey] };

      team.wickets += 1;
      let balls = team.balls;
      let overs = team.overs;
      if (!isOffIllegalDelivery) {
        balls = team.balls + 1;
        if (balls >= 6) {
          overs += 1;
          balls = 0;
        }
      }
      team.balls = balls;
      team.overs = overs;

      const batters = [...team.batters];
      const strikerIndex = batters.findIndex((b) => b.isStriker);
      const nonStrikerBefore = batters.find((b) => !b.isOut && !b.isStriker);
      
      if (strikerIndex !== -1) {
        batters[strikerIndex] = {
          ...batters[strikerIndex],
          isOut: true,
          isStriker: false,
          dismissal: dismissalType,
        };
      }
      
      // Find the next available batter in the order who is NOT the non-striker and NOT the dismissed striker
      const nextBatterIndex = batters.findIndex(
        (b) => !b.isOut && b.id !== nonStrikerBefore?.id && b.id !== batters[strikerIndex]?.id
      );
      
      if (nextBatterIndex !== -1) {
        batters[nextBatterIndex] = {
          ...batters[nextBatterIndex],
          isStriker: true,
        };
      }
      
      // Also handle strike rotation if this wicket falls on the last ball of the over
      if (!isOffIllegalDelivery && balls === 0) {
        const activeStrikerIdx = batters.findIndex((b) => b.isStriker);
        const activeNonStrikerIdx = batters.findIndex((b) => !b.isOut && !b.isStriker);
        if (activeStrikerIdx !== -1 && activeNonStrikerIdx !== -1) {
          batters[activeStrikerIdx].isStriker = false;
          batters[activeNonStrikerIdx].isStriker = true;
        }
      }
      
      team.batters = batters;


      const bowlers = [...bowlingTeam.bowlers];
      const activeBowlerIndex = bowlers.findIndex((bw) => bw.isCurrent) !== -1
        ? bowlers.findIndex((bw) => bw.isCurrent)
        : 0;

      if (bowlers[activeBowlerIndex]) {
        const bw = { ...bowlers[activeBowlerIndex] };
        bw.wickets += 1;
        if (!isOffIllegalDelivery) {
          let bwBalls = bw.ballsInCurrentOver + 1;
          let bwOvers = bw.overs;
          if (bwBalls >= 6) {
            bwOvers += 1;
            bwBalls = 0;
          }
          bw.ballsInCurrentOver = bwBalls;
          bw.overs = bwOvers;
          bw.economy = calcEconomy(bw.runsConceded, bwOvers, bwBalls);
        }
        bowlers[activeBowlerIndex] = bw;
        bowlingTeam.bowlers = bowlers;
      }

      const recent = ['W', ...state.matchDetails.recentBalls.slice(0, 5)];

      const nextState = {
        [battingTeamKey]: team,
        [bowlingTeamKey]: bowlingTeam,
        matchDetails: { ...state.matchDetails, recentBalls: recent },
        historyStack: newHistory,
        ballLog: [...(state.ballLog || []), logEntry],
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

      const nextBallLog = lastSnapshot.ballLog !== undefined
        ? lastSnapshot.ballLog
        : (state.ballLog && state.ballLog.length > 0 ? state.ballLog.slice(0, -1) : []);

      const nextState = {
        teamA: lastSnapshot.teamA,
        teamB: lastSnapshot.teamB,
        matchDetails: lastSnapshot.matchDetails,
        battingTeamId: lastSnapshot.battingTeamId,
        bowlingTeamId: lastSnapshot.bowlingTeamId,
        historyStack: history,
        activeAnimation: null,
        ballLog: nextBallLog,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });

    if (typeof window !== 'undefined') {
      fetch('http://localhost:3001/api/matches/match_live_001/undo', { method: 'POST' }).catch(() => {});
    }
  },

  switchStrikers: () => {
    set((state) => {
      const isTeamA = isBattingTeamA(state);
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

  setActivePairs: (strikerId, nonStrikerId) => {
    set((state) => {
      const isTeamA = isBattingTeamA(state);
      const teamKey = isTeamA ? 'teamA' : 'teamB';
      const team = { ...state[teamKey] };
      
      const sIdLower = (strikerId || '').trim().toLowerCase();
      const nsIdLower = (nonStrikerId || '').trim().toLowerCase();

      let updatedBatters = team.batters.map((b) => {
        const matchesStriker = b.id === strikerId || (b.name && b.name.trim().toLowerCase() === sIdLower);
        const matchesNonStriker = b.id === nonStrikerId || (b.name && b.name.trim().toLowerCase() === nsIdLower);
        if (matchesStriker) {
          return { ...b, isStriker: true, isOut: false };
        }
        if (matchesNonStriker) {
          return { ...b, isStriker: false, isOut: false };
        }
        return { ...b, isStriker: false };
      });

      // If either striker or non-striker wasn't in team.batters yet, create and add them
      const hasStriker = updatedBatters.some(b => b.id === strikerId || (b.name && b.name.trim().toLowerCase() === sIdLower));
      if (!hasStriker && strikerId && strikerId.trim().length > 0) {
        updatedBatters.push({
          id: `p_${Date.now()}_s`,
          name: strikerId.trim(),
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isStriker: true,
          isOut: false,
        });
      }

      const hasNonStriker = updatedBatters.some(b => b.id === nonStrikerId || (b.name && b.name.trim().toLowerCase() === nsIdLower));
      if (!hasNonStriker && nonStrikerId && nonStrikerId.trim().length > 0 && sIdLower !== nsIdLower) {
        updatedBatters.push({
          id: `p_${Date.now()}_ns`,
          name: nonStrikerId.trim(),
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isStriker: false,
          isOut: false,
        });
      }

      const strikerObj = updatedBatters.find(b => b.id === strikerId || (b.name && b.name.trim().toLowerCase() === sIdLower));
      const nonStrikerObj = updatedBatters.find(b => b.id === nonStrikerId || (b.name && b.name.trim().toLowerCase() === nsIdLower));

      if (strikerObj && nonStrikerObj) {
        const otherBatters = updatedBatters.filter(b => b.id !== strikerObj.id && b.id !== nonStrikerObj.id);
        team.batters = [strikerObj, nonStrikerObj, ...otherBatters];
      } else if (strikerObj) {
        const otherBatters = updatedBatters.filter(b => b.id !== strikerObj.id);
        team.batters = [strikerObj, ...otherBatters];
      } else {
        team.batters = updatedBatters;
      }

      const nextState = { [teamKey]: team };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  setBattingTeam: (teamId) => {
    set((state) => {
      const canonicalId = teamId === state.teamA.id || teamId === state.teamA.shortName || teamId === 'teamA' ? 'teamA' : 'teamB';
      const nextState = {
        battingTeamId: canonicalId,
        bowlingTeamId: canonicalId === 'teamA' ? 'teamB' : 'teamA',
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
      const isTeamA = isBattingTeamA(state);
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
      const isTeamA = isBattingTeamA(state);
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

  archiveAndReset: () => {
    const state = get();
    const result = computeMatchResult(state);
    const archiveEntry: MatchArchive = {
      matchId: state.matchId || generateMatchId(),
      date: Date.now(),
      teamA: JSON.parse(JSON.stringify(state.teamA)),
      teamB: JSON.parse(JSON.stringify(state.teamB)),
      matchDetails: JSON.parse(JSON.stringify(state.matchDetails)),
      ballLog: JSON.parse(JSON.stringify(state.ballLog || [])),
      result,
    };

    const updatedArchive = [archiveEntry, ...(state.matchArchive || [])];
    saveMatchArchive(updatedArchive);

    const newMatchId = generateMatchId();
    const defaultState = {
      matchId: newMatchId,
      teamA: DEFAULT_TEAM_A,
      teamB: DEFAULT_TEAM_B,
      matchDetails: DEFAULT_MATCH_DETAILS,
      activeOverlays: INITIAL_OVERLAYS,
      activeAnimation: null,
      historyStack: [],
      ballLog: [],
      matchArchive: updatedArchive,
    };
    set(defaultState);
    postStateSync(defaultState);
  },

  resetMatchState: () => {
    get().archiveAndReset();
  },

  loadArchiveAsNewMatch: (archiveMatchId: string) => {
    set((state) => {
      const archived = (state.matchArchive || []).find((m) => m.matchId === archiveMatchId);
      if (!archived) return state;

      const resetArchivedTeam = (sourceTeam: Team): Team => ({
        ...sourceTeam,
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        extras: 0,
        fallOfWickets: [],
        batters: (sourceTeam.batters || []).map((b, idx) => ({
          ...b,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          isOut: false,
          dismissal: undefined,
          isStriker: idx === 0,
        })),
        bowlers: (sourceTeam.bowlers || []).map((bw, idx) => ({
          ...bw,
          overs: 0,
          ballsInCurrentOver: 0,
          maidens: 0,
          runsConceded: 0,
          wickets: 0,
          economy: 0.0,
          isCurrent: idx === 0,
        })),
      });

      const newMatchId = generateMatchId();
      const nextState = {
        matchId: newMatchId,
        teamA: resetArchivedTeam(archived.teamA),
        teamB: resetArchivedTeam(archived.teamB),
        battingTeamId: 'teamA',
        bowlingTeamId: 'teamB',
        matchDetails: {
          ...DEFAULT_MATCH_DETAILS,
          tournament: archived.matchDetails?.tournament || DEFAULT_MATCH_DETAILS.tournament,
          stage: archived.matchDetails?.stage || DEFAULT_MATCH_DETAILS.stage,
          venue: archived.matchDetails?.venue || DEFAULT_MATCH_DETAILS.venue,
          totalOvers: archived.matchDetails?.totalOvers || 20,
          isMatchStarted: false,
          matchStatusText: 'MATCH NOT STARTED YET',
          recentBalls: [],
          decision: null,
          winnerMargin: undefined,
          winnerTeamId: undefined,
        },
        activeAnimation: null,
        activeOverlays: INITIAL_OVERLAYS,
        historyStack: [],
        ballLog: [],
      };

      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  startMatch: () => {
    set((state) => {
      const nextState = {
        matchDetails: {
          ...state.matchDetails,
          isMatchStarted: true,
          matchStatusText: 'LIVE',
        },
        activeOverlays: {
          ...state.activeOverlays,
          scoreBug: true,
        },
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  stopMatch: () => {
    set((state) => {
      const nextState = {
        matchDetails: {
          ...state.matchDetails,
          isMatchStarted: false,
          matchStatusText: 'UPCOMING',
        },
        activeOverlays: INITIAL_OVERLAYS,
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  startNewMatchWithTeams: (teamAName, teamBName, tournamentName) => {
    const deriveShort = (name: string) =>
      name.split(' ').map((w) => w[0]).join('').substring(0, 4).toUpperCase() || name.substring(0, 3).toUpperCase();

    const shortA = deriveShort(teamAName);
    const shortB = deriveShort(teamBName);

    const resetTeam = (baseTeam: Team, fullName: string, shortName: string): Team => ({
      ...baseTeam,
      fullName,
      shortName,
      score: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: 0,
      batters: Array.from({ length: 11 }, (_, idx) => ({
        id: `${shortName}_b${idx + 1}`,
        name: idx === 0 ? 'Striker 1' : idx === 1 ? 'Striker 2' : `Batter ${idx + 1}`,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        isStriker: idx === 0,
      })),
      bowlers: Array.from({ length: 6 }, (_, idx) => ({
        id: `${shortName}_bw${idx + 1}`,
        name: `Bowler ${idx + 1}`,
        overs: 0,
        ballsInCurrentOver: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0,
        economy: 0.0,
        isCurrent: idx === 0,
      })),
    });

    set((state) => {
      const nextState = {
        matchId: generateMatchId(),
        teamA: resetTeam(state.teamA, teamAName, shortA),
        teamB: resetTeam(state.teamB, teamBName, shortB),
        battingTeamId: 'teamA',
        bowlingTeamId: 'teamB',
        matchDetails: {
          ...state.matchDetails,
          tournament: tournamentName || state.matchDetails.tournament,
          isMatchStarted: false,
          matchStatusText: 'MATCH NOT STARTED YET',
          recentBalls: [],
          winnerMargin: undefined,
          customInputText: undefined,
          decision: null,
        },
        activeAnimation: null,
        activeOverlays: {
          ...INITIAL_OVERLAYS,
          scoreBug: false,
          tournamentTitle: false,
        },
        historyStack: [],
        ballLog: [],
      };
      postStateSync(nextState);
      return nextState;
    });
  },

  startSecondInnings: () => {
    set((state) => {
      const isAFirst = state.battingTeamId === 'teamA' || state.battingTeamId === state.teamA.id;
      const firstInningsBattingTeam = isAFirst ? state.teamA : state.teamB;
      const targetRuns = firstInningsBattingTeam.score + 1;

      const newBattingTeamId = isAFirst ? 'teamB' : 'teamA';
      const newBowlingTeamId = isAFirst ? 'teamA' : 'teamB';

      const markerEntry: BallLogEntry = {
        over: firstInningsBattingTeam.overs,
        ball: firstInningsBattingTeam.balls,
        batter: '',
        bowler: '',
        runs: 0,
        event: 'INNINGS_END',
        timestamp: Date.now(),
      };

      const nextState = {
        battingTeamId: newBattingTeamId,
        bowlingTeamId: newBowlingTeamId,
        matchDetails: {
          ...state.matchDetails,
          currentInnings: 2 as const,
          targetRuns: targetRuns,
          recentBalls: [],
          matchStatusText: `2ND INNINGS | TARGET: ${targetRuns}`,
        },
        ballLog: [...(state.ballLog || []), markerEntry],
      };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },

  updatePlayerAvatar: (teamId: 'teamA' | 'teamB', playerType: 'batter' | 'bowler', playerId: string, avatarUrl: string) => {
    set((state) => {
      const targetTeamKey = teamId === 'teamA' ? 'teamA' : 'teamB';
      const currentTeam = state[targetTeamKey];
      let updatedTeam: Team;

      if (playerType === 'batter') {
        updatedTeam = {
          ...currentTeam,
          batters: currentTeam.batters.map((b) => (b.id === playerId ? { ...b, avatarUrl } : b)),
        };
      } else {
        updatedTeam = {
          ...currentTeam,
          bowlers: currentTeam.bowlers.map((b) => (b.id === playerId ? { ...b, avatarUrl } : b)),
        };
      }

      const nextState = { [targetTeamKey]: updatedTeam };
      postStateSync({ ...state, ...nextState });
      return nextState;
    });
  },
}));

function initWebSocketClient() {
  if (typeof window === 'undefined') return;

  const RENDER_WS_URL = 'wss://websocket-36f4.onrender.com';
  const RENDER_HTTP_URL = 'https://websocket-36f4.onrender.com';
  const LOCAL_WS_URL = 'ws://localhost:3001';
  const wsUrl = import.meta.env.VITE_WS_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? LOCAL_WS_URL : RENDER_WS_URL);

  // keepalive ping
  const pingRenderHost = () => {
    try {
      fetch(RENDER_HTTP_URL, { mode: 'no-cors' }).catch(() => {});
    } catch (e) {}
  };

  pingRenderHost();
  setInterval(pingRenderHost, 30000);

  function connect() {
    try {
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return;
      }

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log(`ws connected: ${wsUrl}`);
        useBroadcastStore.getState().setWsConnected(true);

        if (socket && socket.readyState === WebSocket.OPEN) {
          const state = useBroadcastStore.getState();
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
          socket.send(JSON.stringify({
            type: 'STATE_SYNC',
            matchId: 'match_live_001',
            payload: syncPayload,
          }));
        }
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
        } catch {
        }
      };

      socket.onclose = () => {
        useBroadcastStore.getState().setWsConnected(false);
        setTimeout(connect, 2000);
      };

      socket.onerror = () => {
        useBroadcastStore.getState().setWsConnected(false);
      };
    } catch {
      setTimeout(connect, 2000);
    }
  }

  connect();
}

initWebSocketClient();


if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    if (event.data?.overlayAckAt) {
      useBroadcastStore.getState().setOverlayAck(event.data.overlayAckAt);
    } else if (event.data?.payload?.overlayAckAt) {
      useBroadcastStore.getState().setOverlayAck(event.data.payload.overlayAckAt);
    }
    if ((event.data?.type === 'AR_SPORTS_STATE_SYNC' || event.data?.type === 'CRICSCORER_STATE_SYNC') && event.data.payload) {
      useBroadcastStore.getState().applyExternalState(event.data.payload);
    }
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    recordSponsorOffAir();
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'ar_sports_overlay_ack' && e.newValue) {
      const ack = Number(e.newValue);
      if (ack) useBroadcastStore.setState({ overlayAckAt: ack });
    }
    if ((e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        useBroadcastStore.getState().applyExternalState(parsed);
      } catch {}
    }
  });
}
