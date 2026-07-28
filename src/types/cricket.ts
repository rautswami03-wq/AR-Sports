export interface Batter {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissal?: string;
  isStriker?: boolean;
}

export interface Bowler {
  id: string;
  name: string;
  overs: number;
  ballsInCurrentOver: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  isCurrent?: boolean;
}

export interface Partnership {
  runs: number;
  balls: number;
  batter1Name: string;
  batter1Runs: number;
  batter1Balls: number;
  batter2Name: string;
  batter2Runs: number;
  batter2Balls: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  runs: number;
  over: string;
  batterName: string;
}

export interface Team {
  id: string;
  shortName: string;
  fullName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  batters: Batter[];
  bowlers: Bowler[];
  playingXI: string[];
}

export interface MatchDetails {
  title: string;
  tournament: string;
  stage: string;
  venue: string;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  targetRuns?: number;
  currentInnings: 1 | 2;
  totalOvers: number;
  recentBalls: string[];
  partnership: Partnership;
  fallOfWickets: FallOfWicket[];
  matchStatusText: string;
  winnerTeamId?: string;
  winnerMargin?: string;
  playerOfTheMatch?: {
    name: string;
    team: string;
    stats: string;
    image?: string;
  };
  playerOfTheTournament?: {
    name: string;
    team: string;
    stats: string;
    image?: string;
  };
  pointsTable?: Array<{
    teamId: string;
    shortName: string;
    played: number;
    won: number;
    lost: number;
    nrr: string;
    points: number;
  }>;
  topBatters?: Array<{
    name: string;
    team: string;
    matches: number;
    runs: number;
    average: string;
    strikeRate: string;
  }>;
  topBowlers?: Array<{
    name: string;
    team: string;
    matches: number;
    wickets: number;
    economy: string;
    best: string;
  }>;
  sponsors?: Array<{
    name: string;
    logoUrl?: string;
  }>;
  matchNo?: number;
  matchType?: string;
  groupNo?: number;
  ballsPerOver?: number;
  isTied?: boolean;
  decision?: 'PENDING' | 'OUT' | 'NOT OUT' | null;
  graphType?: 'BAR' | 'LINE' | 'DOUBLE_BAR' | null;
  customAnimationText?: string;
  customInputText?: string;
  selectedMomPlayerId?: string;
  selectedTournamentStatsPlayerId?: string;
}

export type OverlayType =
  | 'scoreBug'
  | 'battingLowerThird'
  | 'bowlingLowerThird'
  | 'battingScorecard'
  | 'bowlingScorecard'
  | 'matchSummary'
  | 'partnership'
  | 'currentBatters'
  | 'currentBowler'
  | 'requiredRunRate'
  | 'currentRunRate'
  | 'fallOfWickets'
  | 'target'
  | 'winnerScreen'
  | 'playingXI'
  | 'toss'
  | 'playerStatistics'
  | 'bowlerStatistics'
  | 'playerOfTheMatch'
  | 'playerOfTheTournament'
  | 'topBatters'
  | 'topBowlers'
  | 'topStrikers'
  | 'topPlayerOfSeries'
  | 'pointsTable'
  | 'sponsorGraphics'
  | 'countdown'
  | 'replayLowerThird'
  | 'decision'
  | 'graph'
  | 'groupPt1'
  | 'groupPt2'
  | 'groupPt3'
  | 'groupPt4'
  | 'groupPt5'
  | 'groupPt6'
  | 'groupPt7'
  | 'groupPt8'
  | 'superOver'
  | 'wagonWheel'
  | 'manOfTheMatchCard';

export type EventAnimationType =
  | 'FOUR'
  | 'SIX'
  | 'WICKET'
  | 'WIDE'
  | 'NO_BALL'
  | 'FREE_HIT'
  | 'POWERPLAY'
  | 'STRATEGIC_TIMEOUT'
  | 'DRINKS_BREAK'
  | 'END_OF_INNINGS'
  | 'MATCH_WINNER'
  | 'FIFTY'
  | 'CENTURY'
  | null;
