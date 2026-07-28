// ============================================================================
// AR Sports Studio Pro — Core Type Definitions
// ============================================================================

// ----------------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------------

export enum MatchFormat {
  T20 = 'T20',
  ODI = 'ODI',
  TEST = 'TEST',
  CUSTOM = 'CUSTOM',
}

export enum MatchStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  INNINGS_BREAK = 'INNINGS_BREAK',
  RAIN_DELAY = 'RAIN_DELAY',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
  SUPER_OVER = 'SUPER_OVER',
}

export enum InningsStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DECLARED = 'DECLARED',
}

export enum BallEventType {
  DOT = 'DOT',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  WIDE = 'WIDE',
  NO_BALL = 'NO_BALL',
  BYE = 'BYE',
  LEG_BYE = 'LEG_BYE',
  PENALTY = 'PENALTY',
  WICKET = 'WICKET',
  DEAD_BALL = 'DEAD_BALL',
}

export enum WicketType {
  BOWLED = 'BOWLED',
  CAUGHT = 'CAUGHT',
  LBW = 'LBW',
  RUN_OUT = 'RUN_OUT',
  STUMPED = 'STUMPED',
  HIT_WICKET = 'HIT_WICKET',
  CAUGHT_BEHIND = 'CAUGHT_BEHIND',
  OBSTRUCTING_FIELD = 'OBSTRUCTING_FIELD',
  HANDLED_BALL = 'HANDLED_BALL',
  TIMED_OUT = 'TIMED_OUT',
  RETIRED_HURT = 'RETIRED_HURT',
}

export enum TossDecision {
  BAT = 'BAT',
  BOWL = 'BOWL',
}

export enum TournamentType {
  LEAGUE = 'LEAGUE',
  KNOCKOUT = 'KNOCKOUT',
  ROUND_ROBIN = 'ROUND_ROBIN',
  HYBRID = 'HYBRID',
}

export enum PlayerRole {
  BATSMAN = 'BATSMAN',
  BOWLER = 'BOWLER',
  ALL_ROUNDER = 'ALL_ROUNDER',
  WICKET_KEEPER = 'WICKET_KEEPER',
}

export enum BattingHand {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export enum BowlingHand {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export enum BowlingStyle {
  FAST = 'FAST',
  FAST_MEDIUM = 'FAST_MEDIUM',
  MEDIUM = 'MEDIUM',
  MEDIUM_SLOW = 'MEDIUM_SLOW',
  SLOW_LEFT_ARM = 'SLOW_LEFT_ARM',
  LEG_BREAK = 'LEG_BREAK',
  OFF_BREAK = 'OFF_BREAK',
  CHINAMAN = 'CHINAMAN',
}

export enum OverlaySceneType {
  SCORE_BUG = 'SCORE_BUG',
  BATTING_CARD = 'BATTING_CARD',
  BOWLING_CARD = 'BOWLING_CARD',
  FOUR = 'FOUR',
  SIX = 'SIX',
  WICKET = 'WICKET',
  FREE_HIT = 'FREE_HIT',
  NO_BALL = 'NO_BALL',
  POWERPLAY = 'POWERPLAY',
  MATCH_WON = 'MATCH_WON',
  PLAYER_OF_MATCH = 'PLAYER_OF_MATCH',
  PLAYER_OF_TOURNAMENT = 'PLAYER_OF_TOURNAMENT',
  TOURNAMENT_WINNER = 'TOURNAMENT_WINNER',
  TOSS = 'TOSS',
  PLAYING_XI = 'PLAYING_XI',
  STATS = 'STATS',
  COUNTDOWN = 'COUNTDOWN',
  SPONSOR = 'SPONSOR',
  ADVERTISEMENT = 'ADVERTISEMENT',
  DRINKS_BREAK = 'DRINKS_BREAK',
  STRATEGIC_TIMEOUT = 'STRATEGIC_TIMEOUT',
  REPLAY = 'REPLAY',
}

export enum WebSocketMessageType {
  STATE_UPDATE = 'STATE_UPDATE',
  SCENE_CHANGE = 'SCENE_CHANGE',
  GRAPHIC_TRIGGER = 'GRAPHIC_TRIGGER',
  THEME_UPDATE = 'THEME_UPDATE',
  CONNECTION = 'CONNECTION',
}

export enum ThemeMode {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  CUSTOM = 'CUSTOM',
}

// ----------------------------------------------------------------------------
// Core Entities
// ----------------------------------------------------------------------------

export interface Player {
  id: string;
  name: string;
  displayName: string;
  photo?: string;
  role: PlayerRole;
  battingHand: BattingHand;
  bowlingHand: BowlingHand;
  bowlingStyle?: BowlingStyle;
  dateOfBirth?: string;
  nationality?: string;
  jerseyNumber?: number;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  players: string[]; // player IDs
  captainId?: string;
  coach?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  type: TournamentType;
  startDate: string;
  endDate?: string;
  venue?: string;
  teamIds: string[];
  matchIds: string[];
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// Match Entities
// ----------------------------------------------------------------------------

export interface WicketDetails {
  type: WicketType;
  batsmanId: string;
  bowlerId?: string;
  fielderIds?: string[];
  isStrikeBatsman: boolean;
}

export interface BallEvent {
  id: string;
  matchId: string;
  inningsId: string;
  overNumber: number;
  ballNumber: number; // within the over (1-6 for legal deliveries)
  type: BallEventType;
  runsScored: number; // runs off the bat
  extras: number; // extra runs (wides, byes, etc.)
  totalRuns: number; // total runs including extras
  batsmanId: string; // striker
  nonStrikerId: string;
  bowlerId: string;
  wicketDetails?: WicketDetails;
  isFreeHit?: boolean;
  isLegalDelivery: boolean; // false for wides, no-balls
  timestamp: string;
  commentary?: string;
}

export interface OverSummary {
  overNumber: number;
  balls: BallEvent[];
  runsScored: number;
  wicketsTaken: number;
  extras: number;
  maiden: boolean;
}

export interface BatterInnings {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  isOnStrike: boolean;
  dismissal?: string; // e.g., "c Smith b Johnson"
  wicketType?: WicketType;
  fielderIds?: string[];
  bowlerId?: string;
  minutes?: number;
}

export interface BowlerInnings {
  playerId: string;
  overs: number;
  balls: number; // total legal balls bowled
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  wides: number;
  noBalls: number;
  dotBalls: number;
}

export interface Innings {
  id: string;
  matchId: string;
  inningsNumber: number;
  battingTeamId: string;
  bowlingTeamId: string;
  status: InningsStatus;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  totalBalls: number; // total legal balls
  extras: number;
  extrasBreakdown: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalties: number;
  };
  currentRunRate: number;
  batters: BatterInnings[];
  bowlers: BowlerInnings[];
  overs: OverSummary[];
  fallOfWickets: Array<{
    wicketNumber: number;
    score: number;
    overs: number;
    batsmanId: string;
  }>;
  partnership: {
    runs: number;
    balls: number;
    batter1Id: string;
    batter2Id: string;
  };
}

export interface TossResult {
  winningTeamId: string;
  decision: TossDecision;
}

export interface Match {
  id: string;
  tournamentId?: string;
  matchNumber?: number;
  team1Id: string;
  team2Id: string;
  venue?: string;
  date: string;
  format: MatchFormat;
  totalOvers: number;
  status: MatchStatus;
  toss?: TossResult;
  innings: Innings[];
  currentInningsIndex: number;
  result?: MatchResult;
  playerOfMatch?: string; // player ID
  isSuperOver: boolean;
  isDayNight?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  winningTeamId?: string; // undefined for tie/no-result
  margin?: string; // e.g., "5 wickets", "23 runs"
  isTie: boolean;
  isNoResult: boolean;
  method?: 'NORMAL' | 'DLS';
  summary: string;
}

// ----------------------------------------------------------------------------
// Live Score State (real-time)
// ----------------------------------------------------------------------------

export interface LiveBatter {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOnStrike: boolean;
}

export interface LiveBowler {
  playerId: string;
  name: string;
  overs: string; // e.g., "3.2"
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface ScoreState {
  matchId: string;
  matchStatus: MatchStatus;
  inningsNumber: number;
  battingTeam: {
    id: string;
    name: string;
    shortName: string;
    primaryColor: string;
    secondaryColor: string;
  };
  bowlingTeam: {
    id: string;
    name: string;
    shortName: string;
    primaryColor: string;
    secondaryColor: string;
  };
  totalRuns: number;
  totalWickets: number;
  totalOvers: string; // e.g., "12.4"
  currentRunRate: number;
  requiredRunRate?: number;
  target?: number;
  partnership: {
    runs: number;
    balls: number;
  };
  currentBatters: [LiveBatter, LiveBatter];
  currentBowler: LiveBowler;
  lastSixBalls: Array<{
    type: BallEventType;
    runs: number;
    isWicket: boolean;
  }>;
  isPowerplay: boolean;
  isFreeHit: boolean;
  matchInfo: {
    format: MatchFormat;
    totalOvers: number;
    venue?: string;
  };
  previousInnings?: {
    teamId: string;
    teamName: string;
    totalRuns: number;
    totalWickets: number;
    totalOvers: string;
  };
}

// ----------------------------------------------------------------------------
// Overlay System
// ----------------------------------------------------------------------------

export interface OverlayConfig {
  scene: OverlaySceneType;
  visible: boolean;
  position: {
    x: number;
    y: number;
  };
  scale: number;
  opacity: number;
  zIndex: number;
  animationDuration: number;
  theme?: Partial<DesignTokens>;
}

export interface OverlayState {
  activeScene: OverlaySceneType | null;
  configs: Record<string, OverlayConfig>;
  connected: boolean;
  scoreState: ScoreState | null;
  triggerAnimation: string | null; // animation ID to play
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: unknown;
  timestamp: string;
}

// ----------------------------------------------------------------------------
// Design System
// ----------------------------------------------------------------------------

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
    // Broadcast-specific
    live: string;
    wicket: string;
    four: string;
    six: string;
    gold: string;
  };
  typography: {
    fontFamily: string;
    fontFamilyDisplay: string;
    fontFamilyMono: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      score: string;
      overlay: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    px: string;
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
  };
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
    overlay: string;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
      broadcast: number;
    };
    easing: {
      standard: string;
      decelerate: string;
      accelerate: string;
      broadcast: string;
    };
  };
  blur: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// ----------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------

export interface AppSettings {
  theme: ThemeMode;
  customTheme?: Partial<DesignTokens>;
  animationSpeed: number; // multiplier (0.5, 1.0, 1.5, 2.0)
  overlayScale: number;
  overlayPort: number;
  wsPort: number;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  autoSave: boolean;
}

// ----------------------------------------------------------------------------
// Statistics
// ----------------------------------------------------------------------------

export interface BattingStats {
  playerId: string;
  matches: number;
  innings: number;
  runs: number;
  balls: number;
  highestScore: number;
  notOuts: number;
  average: number;
  strikeRate: number;
  fours: number;
  sixes: number;
  fifties: number;
  hundreds: number;
  ducks: number;
}

export interface BowlingStats {
  playerId: string;
  matches: number;
  innings: number;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  average: number;
  economy: number;
  strikeRate: number;
  wides: number;
  noBalls: number;
  maidens: number;
  bestFigures?: { wickets: number; runs: number };
  fourWickets: number;
  fiveWickets: number;
}

export interface FieldingStats {
  playerId: string;
  matches: number;
  catches: number;
  runOuts: number;
  stumpings: number;
}

// ----------------------------------------------------------------------------
// Utility types
// ----------------------------------------------------------------------------

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Identifiable = { id: string };

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
