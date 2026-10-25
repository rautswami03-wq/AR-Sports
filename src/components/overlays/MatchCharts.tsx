import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useBroadcastStore, BallLogEntry } from '../../store/useBroadcastStore';

export type ChartViewType = 'bar' | 'line' | 'double_bar';

export interface MatchChartsProps {
  view?: ChartViewType;
  title?: string;
  subtitle?: string;
}

interface OverDataPoint {
  over: number;
  label: string;
  teamARuns: number;
  teamBRuns: number;
  teamACumulative: number;
  teamBCumulative: number;
  teamAWicket: boolean;
  teamBWicket: boolean;
  activeRuns: number;
  activeCumulative: number;
  activeWicket: boolean;
}

export const MatchCharts: React.FC<MatchChartsProps> = ({
  view: propView,
  title: propTitle,
  subtitle: propSubtitle,
}) => {
  const {
    teamA,
    teamB,
    matchDetails,
    battingTeamId,
    ballLog,
  } = useBroadcastStore();

  const activeView: ChartViewType = useMemo(() => {
    if (propView) return propView;
    if (matchDetails.graphType === 'LINE') return 'line';
    if (matchDetails.graphType === 'DOUBLE_BAR') return 'double_bar';
    return 'bar';
  }, [propView, matchDetails.graphType]);

  const isTeamABatting =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const currentBattingTeam = isTeamABatting ? teamA : teamB;

  // Primary Theme Colors (Cyan for Team A, Red/Yellow for Team B)
  const teamAColor = teamA.primaryColor && teamA.primaryColor !== '#000080' ? teamA.primaryColor : '#00e5ff';
  const teamBColor = teamB.primaryColor && teamB.primaryColor !== '#000080' ? teamB.primaryColor : '#ffd700';
  const teamBWormColor = '#ff3366';

  // ─────────────────────────────────────────────────────────────────────────────
  // Parse ballLog into OverDataPoints
  // ─────────────────────────────────────────────────────────────────────────────
  const chartData = useMemo<OverDataPoint[]>(() => {
    const totalOvers = matchDetails.totalOvers || 20;

    // Split ballLog by INNINGS_END marker if present
    const inningsEndIdx = ballLog.findIndex((e) => e.event === 'INNINGS_END');
    const innings1Entries = inningsEndIdx >= 0 ? ballLog.slice(0, inningsEndIdx) : ballLog;
    const innings2Entries = inningsEndIdx >= 0 ? ballLog.slice(inningsEndIdx + 1) : [];

    // Map which team batted in which innings
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

    // Seed realistic fallback data when match is just starting or ballLog has no balls yet
    const seedA = [8, 12, 6, 14, 9, 18, 11, 7, 15, 10, 13, 8, 16, 12, 9, 14, 20, 11, 15, 17];
    const seedB = [6, 10, 11, 8, 13, 12, 14, 9, 11, 15, 8, 10, 14, 11, 16, 13, 12, 18, 14, 12];
    const seedWicketsA = [3, 6, 12, 18];
    const seedWicketsB = [4, 9, 15];

    let cumA = 0;
    let cumB = 0;
    const result: OverDataPoint[] = [];

    const effectiveOvers = hasRealData
      ? Math.max(totalOvers, Math.max(...Array.from(teamAMap.keys()), ...Array.from(teamBMap.keys()), 1))
      : Math.min(totalOvers, 20);

    for (let ov = 1; ov <= effectiveOvers; ov++) {
      let rA: number;
      let rB: number;
      let wA: boolean;
      let wB: boolean;

      if (hasRealData) {
        const statsA = teamAMap.get(ov);
        const statsB = teamBMap.get(ov);
        rA = statsA ? statsA.runs : 0;
        rB = statsB ? statsB.runs : 0;
        wA = statsA ? statsA.wickets > 0 : false;
        wB = statsB ? statsB.wickets > 0 : false;
      } else {
        rA = seedA[(ov - 1) % seedA.length];
        rB = seedB[(ov - 1) % seedB.length];
        wA = seedWicketsA.includes(ov);
        wB = seedWicketsB.includes(ov);
      }

      cumA += rA;
      cumB += rB;

      const activeRuns = isTeamABatting ? rA : rB;
      const activeCumulative = isTeamABatting ? cumA : cumB;
      const activeWicket = isTeamABatting ? wA : wB;

      result.push({
        over: ov,
        label: `Ov ${ov}`,
        teamARuns: rA,
        teamBRuns: rB,
        teamACumulative: cumA,
        teamBCumulative: cumB,
        teamAWicket: wA,
        teamBWicket: wB,
        activeRuns,
        activeCumulative,
        activeWicket,
      });
    }

    return result;
  }, [ballLog, matchDetails.totalOvers, matchDetails.currentInnings, isTeamABatting]);

  // Dynamic Titles
  const defaultTitle =
    activeView === 'bar'
      ? 'MANHATTAN CHART'
      : activeView === 'line'
      ? 'WORM CHART'
      : 'COMPARISON CHART';

  const defaultSubtitle =
    activeView === 'bar'
      ? `${currentBattingTeam.fullName} — RUNS PER OVER`
      : activeView === 'line'
      ? `${teamA.shortName} vs ${teamB.shortName} — CUMULATIVE RUNS`
      : `${teamA.shortName} vs ${teamB.shortName} — OVER-BY-OVER PROGRESSION`;

  const displayTitle = propTitle || defaultTitle;
  const displaySubtitle = propSubtitle || defaultSubtitle;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans"
      data-overlay="match-charts"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-[1140px] rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl flex flex-col font-sans"
        style={{ background: 'rgba(11, 27, 61, 0.96)' }}
      >
        {/* Top Header Strip */}
        <div className="bg-[#000865]/95 px-8 py-4 text-white flex items-center justify-between border-b-2 border-cyan-400/40">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider font-headers">
              {displayTitle}
            </h2>
            <p className="text-xs font-bold text-slate-300 uppercase mt-0.5 tracking-widest font-headers">
              {matchDetails.tournament || 'CRICSCORER TOURNAMENT'}: {displaySubtitle}
            </p>
          </div>

          {/* View Badges */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
                activeView === 'bar'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              BARS
            </span>
            <span
              className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
                activeView === 'line'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              WORM
            </span>
            <span
              className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider ${
                activeView === 'double_bar'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              DUAL
            </span>
          </div>
        </div>

        {/* Chart Canvas Area with Transparent Background */}
        <div className="p-6 flex-1 min-h-[340px] flex flex-col justify-between" style={{ background: 'transparent' }}>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              {activeView === 'bar' ? (
                /* ── VIEW 1: BAR CHART (Manhattan - Runs Per Over) ── */
                <BarChart
                  data={chartData}
                  margin={{ top: 15, right: 10, left: 10, bottom: 0 }}
                  style={{ background: 'transparent' }}
                >
                  <CartesianGrid
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <Bar
                    dataKey="activeRuns"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                    isAnimationActive={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.activeWicket ? '#ef4444' : teamAColor}
                        stroke={entry.activeWicket ? '#f87171' : 'rgba(255,255,255,0.4)'}
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : activeView === 'line' ? (
                /* ── VIEW 2: LINE CHART (Worm - Cumulative Runs) ── */
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 10, left: 10, bottom: 0 }}
                  style={{ background: 'transparent' }}
                >
                  <CartesianGrid
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  {/* Team A Worm */}
                  <Line
                    type="monotone"
                    dataKey="teamACumulative"
                    stroke={teamAColor}
                    strokeWidth={4}
                    dot={{ r: 4, fill: teamAColor, stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                  {/* Team B Worm */}
                  <Line
                    type="monotone"
                    dataKey="teamBCumulative"
                    stroke={teamBWormColor}
                    strokeWidth={4}
                    dot={{ r: 4, fill: teamBWormColor, stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              ) : (
                /* ── VIEW 3: DOUBLE BAR CHART (Comparison) ── */
                <BarChart
                  data={chartData}
                  margin={{ top: 15, right: 10, left: 10, bottom: 0 }}
                  style={{ background: 'transparent' }}
                >
                  <CartesianGrid
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <Bar
                    dataKey="teamARuns"
                    fill={teamAColor}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="teamBRuns"
                    fill={teamBColor}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                    isAnimationActive={false}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Over Numbers Label Strip Below Grid */}
          <div className="flex items-center justify-between px-2 pt-2 border-t border-white/10 text-xs font-bold text-slate-400 font-numbers">
            {chartData.map((d) => (
              <span key={d.over} className="flex-1 text-center">
                {d.over}
              </span>
            ))}
          </div>

          {/* Legend Footer */}
          <div className="flex items-center justify-center gap-8 pt-4 text-xs font-bold uppercase tracking-wider font-headers">
            {activeView === 'line' || activeView === 'double_bar' ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ background: teamAColor }} />
                  <span className="text-white">
                    {teamA.shortName || teamA.fullName} ({teamA.score}/{teamA.wickets})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: activeView === 'line' ? teamBWormColor : teamBColor }}
                  />
                  <span className="text-white">
                    {teamB.shortName || teamB.fullName} ({teamB.score}/{teamB.wickets})
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ background: teamAColor }} />
                  <span className="text-white">RUNS SCORED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#ef4444]" />
                  <span className="text-rose-400">WICKET FALLEN</span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
