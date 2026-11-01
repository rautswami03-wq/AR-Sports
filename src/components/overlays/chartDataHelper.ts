import { useMemo } from 'react';
import { useBroadcastStore, BallLogEntry } from '../../store/useBroadcastStore';

export interface OverChartData {
  over: number;
  label: string;
  runs: number;
  hasWicket: boolean;
  wickets: number;
  cumulativeRuns: number;
  teamARuns: number;
  teamBRuns: number;
  teamACumulative: number;
  teamBCumulative: number;
  teamAWicket: boolean;
  teamBWicket: boolean;
}

export function useMatchChartData(customData?: OverChartData[]) {
  const { teamA, teamB, matchDetails, battingTeamId, ballLog } = useBroadcastStore();

  const isTeamABatting =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const currentBattingTeam = isTeamABatting ? teamA : teamB;

  const chartData = useMemo<OverChartData[]>(() => {
    if (customData && customData.length > 0) return customData;

    const totalOvers = matchDetails.totalOvers || 20;

    // Split ballLog by INNINGS_END marker if present
    const inningsEndIdx = ballLog.findIndex((e) => e.event === 'INNINGS_END');
    const innings1Entries = inningsEndIdx >= 0 ? ballLog.slice(0, inningsEndIdx) : ballLog;
    const innings2Entries = inningsEndIdx >= 0 ? ballLog.slice(inningsEndIdx + 1) : [];

    const isTeamAFirst = matchDetails.currentInnings === 2 ? !isTeamABatting : isTeamABatting;
    const teamAEntries = isTeamAFirst ? innings1Entries : innings2Entries;
    const teamBEntries = isTeamAFirst ? innings2Entries : innings1Entries;

    const aggregateTeamOvers = (entries: BallLogEntry[]) => {
      const map = new Map<number, { runs: number; wickets: number }>();
      for (const e of entries) {
        if (e.event === 'INNINGS_END') continue;
        const ov = (typeof e.over === 'number' ? e.over : 0) + 1;
        const curr = map.get(ov) || { runs: 0, wickets: 0 };
        curr.runs += Number(e.runs || 0);
        if (e.wicket) curr.wickets += 1;
        map.set(ov, curr);
      }
      return map;
    };

    const teamAMap = aggregateTeamOvers(teamAEntries);
    const teamBMap = aggregateTeamOvers(teamBEntries);
    const hasRealData = teamAMap.size > 0 || teamBMap.size > 0;

    // Realistic IPL seed progression if ballLog is empty
    const seedA = [9, 12, 6, 14, 8, 16, 10, 7, 15, 11, 13, 8, 16, 12, 9, 14, 19, 11, 15, 17];
    const seedB = [7, 10, 11, 8, 13, 12, 14, 9, 11, 14, 8, 10, 15, 11, 16, 12, 11, 18, 13, 12];
    const seedWicketsA = [3, 7, 13, 18];
    const seedWicketsB = [4, 9, 15];

    let cumA = 0;
    let cumB = 0;
    const result: OverChartData[] = [];

    const effectiveOvers = hasRealData
      ? Math.max(totalOvers, Math.max(...Array.from(teamAMap.keys()), ...Array.from(teamBMap.keys()), 1))
      : Math.min(totalOvers, 20);

    for (let ov = 1; ov <= effectiveOvers; ov++) {
      let rA: number;
      let rB: number;
      let wA: boolean;
      let wB: boolean;
      let wCountA = 0;
      let wCountB = 0;

      if (hasRealData) {
        const statsA = teamAMap.get(ov);
        const statsB = teamBMap.get(ov);
        rA = statsA ? statsA.runs : 0;
        rB = statsB ? statsB.runs : 0;
        wCountA = statsA ? statsA.wickets : 0;
        wCountB = statsB ? statsB.wickets : 0;
        wA = wCountA > 0;
        wB = wCountB > 0;
      } else {
        rA = seedA[(ov - 1) % seedA.length];
        rB = seedB[(ov - 1) % seedB.length];
        wA = seedWicketsA.includes(ov);
        wB = seedWicketsB.includes(ov);
        wCountA = wA ? 1 : 0;
        wCountB = wB ? 1 : 0;
      }

      cumA += rA;
      cumB += rB;

      const activeRuns = isTeamABatting ? rA : rB;
      const activeCumulative = isTeamABatting ? cumA : cumB;
      const activeWicket = isTeamABatting ? wA : wB;
      const activeWicketsCount = isTeamABatting ? wCountA : wCountB;

      result.push({
        over: ov,
        label: `Ov ${ov}`,
        runs: activeRuns,
        hasWicket: activeWicket,
        wickets: activeWicketsCount,
        cumulativeRuns: activeCumulative,
        teamARuns: rA,
        teamBRuns: rB,
        teamACumulative: cumA,
        teamBCumulative: cumB,
        teamAWicket: wA,
        teamBWicket: wB,
      });
    }

    return result;
  }, [customData, ballLog, matchDetails.totalOvers, matchDetails.currentInnings, isTeamABatting]);

  return {
    chartData,
    teamA,
    teamB,
    currentBattingTeam,
    isTeamABatting,
    battingTeamColor: currentBattingTeam.primaryColor || '#004BA0',
    teamAColor: teamA.primaryColor || '#E63946',
    teamBColor: teamB.primaryColor || '#0077B6',
  };
}
