import { create } from 'zustand';
import { MatchArchive } from './useBroadcastStore';

export interface TournamentTeamStanding {
  teamId: string;
  teamName: string;
  shortName: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  runsScored: number;
  oversFaced: number; // Decimal overs, e.g. 19.5 overs
  runsConceded: number;
  oversBowled: number;
  nrr: number; // Float Net Run Rate
  nrrFormatted: string; // e.g. "+0.450" or "-1.200"
}

export interface MatchRecordInput {
  id?: string;
  tournamentId?: string;
  teamA: string;
  teamB: string;
  teamAShort?: string;
  teamBShort?: string;
  overs: number; // Match quota overs (e.g., 20 or 4)
  teamAScore?: number;
  teamAWickets?: number;
  teamAOvers?: number;
  teamABalls?: number;
  teamBScore?: number;
  teamBWickets?: number;
  teamBOvers?: number;
  teamBBalls?: number;
  winner?: string;
  isTied?: boolean;
}

const STANDINGS_STORAGE_KEY = 'ar_sports_tournament_standings_v1';

/**
 * Converts overs and balls into exact decimal overs.
 * E.g. 19 overs, 3 balls = 19 + 3/6 = 19.5 overs.
 * Note: If a team is bowled out, the full quota of overs must be used.
 */
export function calculateExactOvers(
  overs: number,
  balls: number,
  isBowledOut: boolean,
  quotaOvers: number
): number {
  if (isBowledOut) {
    return Math.max(1, quotaOvers);
  }
  const fullOvers = Math.max(0, overs);
  const remainingBalls = Math.max(0, Math.min(5, balls));
  return fullOvers + remainingBalls / 6;
}

/**
 * Computes official ICC/IPL Net Run Rate (NRR):
 * (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
 */
export function calculateNRR(
  runsScored: number,
  oversFaced: number,
  runsConceded: number,
  oversBowled: number
): { nrr: number; nrrFormatted: string } {
  const rrFor = oversFaced > 0 ? runsScored / oversFaced : 0;
  const rrAgainst = oversBowled > 0 ? runsConceded / oversBowled : 0;
  const nrr = Number((rrFor - rrAgainst).toFixed(3));
  const nrrFormatted = nrr > 0 ? `+${nrr.toFixed(3)}` : nrr.toFixed(3);
  return { nrr, nrrFormatted };
}

/**
 * Sorts Points Table according to Official Tournament Rules:
 * 1st: Points (Descending)
 * 2nd: Net Run Rate (Descending)
 * 3rd: Most Wins (Descending)
 */
export function sortPointsTable(table: TournamentTeamStanding[]): TournamentTeamStanding[] {
  return [...table].sort((a, b) => {
    // 1st Priority: Points (Descending)
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // 2nd Priority: Net Run Rate (Descending)
    if (b.nrr !== a.nrr) {
      return b.nrr - a.nrr;
    }
    // 3rd Priority: Wins (Descending)
    return b.won - a.won;
  });
}

/**
 * Calculates full standings and sorted Points Table from completed match records.
 */
export function calculatePointsTable(
  matches: MatchRecordInput[],
  defaultQuotaOvers = 20
): TournamentTeamStanding[] {
  const teamsMap = new Map<string, {
    teamName: string;
    shortName: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    runsScored: number;
    oversFaced: number;
    runsConceded: number;
    oversBowled: number;
  }>();

  const getOrCreate = (name: string, short?: string) => {
    const key = name.trim().toUpperCase();
    if (!teamsMap.has(key)) {
      teamsMap.set(key, {
        teamName: name.trim().toUpperCase(),
        shortName: short?.trim().toUpperCase() || name.substring(0, 3).toUpperCase(),
        played: 0,
        won: 0,
        lost: 0,
        tied: 0,
        noResult: 0,
        points: 0,
        runsScored: 0,
        oversFaced: 0,
        runsConceded: 0,
        oversBowled: 0,
      });
    }
    return teamsMap.get(key)!;
  };

  matches.forEach((match) => {
    const quota = match.overs || defaultQuotaOvers;
    const teamA = getOrCreate(match.teamA, match.teamAShort);
    const teamB = getOrCreate(match.teamB, match.teamBShort);

    // If match is still pending and has no scores, skip
    if (
      match.teamAScore === undefined &&
      match.teamBScore === undefined &&
      match.winner === 'MATCH NOT FINISH YET'
    ) {
      return;
    }

    const rA = match.teamAScore ?? 0;
    const wA = match.teamAWickets ?? 0;
    const ovA = match.teamAOvers ?? 0;
    const bA = match.teamABalls ?? 0;

    const rB = match.teamBScore ?? 0;
    const wB = match.teamBWickets ?? 0;
    const ovB = match.teamBOvers ?? 0;
    const bB = match.teamBBalls ?? 0;

    // Check if team was bowled out (wickets >= 10)
    const aBowledOut = wA >= 10;
    const bBowledOut = wB >= 10;

    const oversFacedA = calculateExactOvers(ovA, bA, aBowledOut, quota);
    const oversFacedB = calculateExactOvers(ovB, bB, bBowledOut, quota);

    teamA.played += 1;
    teamB.played += 1;

    teamA.runsScored += rA;
    teamA.oversFaced += oversFacedA;
    teamA.runsConceded += rB;
    teamA.oversBowled += oversFacedB;

    teamB.runsScored += rB;
    teamB.oversFaced += oversFacedB;
    teamB.runsConceded += rA;
    teamB.oversBowled += oversFacedA;

    // Determine winner & points (2 for win, 1 for tie, 0 for loss)
    const isWinnerA = match.winner === match.teamA.toUpperCase() || (match.winner && match.winner.includes(match.teamA.toUpperCase()));
    const isWinnerB = match.winner === match.teamB.toUpperCase() || (match.winner && match.winner.includes(match.teamB.toUpperCase()));

    if (match.isTied || (rA > 0 && rA === rB && match.winner?.includes('TIED'))) {
      teamA.tied += 1;
      teamB.tied += 1;
      teamA.points += 1;
      teamB.points += 1;
    } else if (isWinnerA || (!isWinnerB && rA > rB)) {
      teamA.won += 1;
      teamA.points += 2;
      teamB.lost += 1;
    } else if (isWinnerB || (!isWinnerA && rB > rA)) {
      teamB.won += 1;
      teamB.points += 2;
      teamA.lost += 1;
    } else {
      teamA.noResult += 1;
      teamB.noResult += 1;
      teamA.points += 1;
      teamB.points += 1;
    }
  });

  const rawTable: TournamentTeamStanding[] = Array.from(teamsMap.values()).map((t) => {
    const { nrr, nrrFormatted } = calculateNRR(
      t.runsScored,
      t.oversFaced,
      t.runsConceded,
      t.oversBowled
    );
    return {
      teamId: `team_${t.shortName.toLowerCase()}`,
      teamName: t.teamName,
      shortName: t.shortName,
      played: t.played,
      won: t.won,
      lost: t.lost,
      tied: t.tied,
      noResult: t.noResult,
      points: t.points,
      runsScored: t.runsScored,
      oversFaced: Number(t.oversFaced.toFixed(3)),
      runsConceded: t.runsConceded,
      oversBowled: Number(t.oversBowled.toFixed(3)),
      nrr,
      nrrFormatted,
    };
  });

  return sortPointsTable(rawTable);
}

export interface TournamentStoreState {
  standingsByTournament: Record<string, TournamentTeamStanding[]>;
  recalculatePointsTable: (
    tournamentId: string,
    matches?: MatchRecordInput[]
  ) => TournamentTeamStanding[];
  recordArchivedMatch: (archive: MatchArchive) => void;
  getStandings: (tournamentId: string) => TournamentTeamStanding[];
}

export const useTournamentStore = create<TournamentStoreState>((set, get) => ({
  standingsByTournament: (() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STANDINGS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return {};
  })(),

  getStandings: (tournamentId: string) => {
    return get().standingsByTournament[tournamentId] || [];
  },

  recalculatePointsTable: (tournamentId: string, matches?: MatchRecordInput[]) => {
    let matchList: MatchRecordInput[] = matches || [];

    // If matches not passed, load from localStorage
    if (!matches || matches.length === 0) {
      if (typeof window !== 'undefined') {
        try {
          const rawMatches = localStorage.getItem('ar_sports_matches_v2') || localStorage.getItem('cricscorer_matches_v2');
          if (rawMatches) {
            const parsed = JSON.parse(rawMatches);
            matchList = parsed.filter((m: any) => !tournamentId || m.tournamentId === tournamentId);
          }
        } catch {}
      }
    }

    const computed = calculatePointsTable(matchList);

    set((state) => {
      const updated = {
        ...state.standingsByTournament,
        [tournamentId]: computed,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STANDINGS_STORAGE_KEY, JSON.stringify(updated));
      }
      return { standingsByTournament: updated };
    });

    return computed;
  },

  recordArchivedMatch: (archive: MatchArchive) => {
    const tournamentId = archive.matchDetails.tournamentId || archive.matchDetails.tournament || 'default_tournament';
    const quota = archive.matchDetails.totalOvers || 20;

    const matchInput: MatchRecordInput = {
      id: archive.matchId,
      tournamentId,
      teamA: archive.teamA.fullName || archive.teamA.shortName,
      teamB: archive.teamB.fullName || archive.teamB.shortName,
      teamAShort: archive.teamA.shortName,
      teamBShort: archive.teamB.shortName,
      overs: quota,
      teamAScore: archive.teamA.score,
      teamAWickets: archive.teamA.wickets,
      teamAOvers: archive.teamA.overs,
      teamABalls: archive.teamA.balls,
      teamBScore: archive.teamB.score,
      teamBWickets: archive.teamB.wickets,
      teamBOvers: archive.teamB.overs,
      teamBBalls: archive.teamB.balls,
      winner: archive.result,
      isTied: archive.result.toLowerCase().includes('tied') || archive.teamA.score === archive.teamB.score,
    };

    // Load existing matches
    let allMatches: MatchRecordInput[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('ar_sports_matches_v2') || localStorage.getItem('cricscorer_matches_v2');
        if (raw) allMatches = JSON.parse(raw);
      } catch {}
    }

    // Merge or append archived match
    const existingIdx = allMatches.findIndex((m) => m.id === matchInput.id);
    if (existingIdx >= 0) {
      allMatches[existingIdx] = { ...allMatches[existingIdx], ...matchInput };
    } else {
      allMatches.push(matchInput);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('ar_sports_matches_v2', JSON.stringify(allMatches));
    }

    // Recalculate Points Table instantly
    get().recalculatePointsTable(tournamentId, allMatches.filter((m) => m.tournamentId === tournamentId));
  },
}));

