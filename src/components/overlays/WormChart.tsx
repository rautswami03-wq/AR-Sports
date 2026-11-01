import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { OverChartData, useMatchChartData } from './chartDataHelper';

export interface WormChartProps {
  data?: OverChartData[];
  teamAName?: string;
  teamBName?: string;
  height?: number | string;
  className?: string;
  showAxes?: boolean;
}

export const WormChart: React.FC<WormChartProps> = ({
  data: propData,
  teamAName: propTeamAName,
  teamBName: propTeamBName,
  height = 320,
  className = '',
  showAxes = true,
}) => {
  const { chartData, teamA, teamB } = useMatchChartData(propData);

  const teamALabel = propTeamAName || teamA.shortName || 'Team A';
  const teamBLabel = propTeamBName || teamB.shortName || 'Team B';

  // Requirements: Two lines: Team A (Red) and Team B (Blue)
  const teamAColor = '#E63946'; // Red
  const teamBColor = '#0077B6'; // Blue

  // Custom Dot for Team A Wickets
  const renderDotA = (props: any) => {
    const { cx, cy, index } = props;
    const entry = chartData[index];
    if (!entry) return null;

    if (entry.teamAWicket) {
      return (
        <g key={`dot-a-${index}`}>
          <circle cx={cx} cy={cy} r={5.5} fill="#FFFFFF" stroke={teamAColor} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={2.5} fill={teamAColor} />
        </g>
      );
    }
    return <circle key={`dot-a-${index}`} cx={cx} cy={cy} r={3} fill={teamAColor} />;
  };

  // Custom Dot for Team B Wickets
  const renderDotB = (props: any) => {
    const { cx, cy, index } = props;
    const entry = chartData[index];
    if (!entry) return null;

    if (entry.teamBWicket) {
      return (
        <g key={`dot-b-${index}`}>
          <circle cx={cx} cy={cy} r={5.5} fill="#FFFFFF" stroke={teamBColor} strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={2.5} fill={teamBColor} />
        </g>
      );
    }
    return <circle key={`dot-b-${index}`} cx={cx} cy={cy} r={3} fill={teamBColor} />;
  };

  return (
    <div
      className={`w-full flex flex-col font-sans select-none ${className}`}
      data-testid="worm-chart"
    >
      {/* Top Chart Header / Subtitle */}
      <div className="flex items-center justify-between mb-2 px-2 text-xs font-bold text-slate-300">
        <span className="uppercase tracking-widest text-[#FFDC35]">
          WORM — CUMULATIVE RUN PROGRESSION
        </span>
        <div className="flex items-center gap-5 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-1 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: teamAColor }}
            />
            <span className="text-white font-bold">{teamALabel} (Red)</span>
            <span className="text-xs text-slate-400">
              [{teamA.score}/{teamA.wickets}]
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-1 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: teamBColor }}
            />
            <span className="text-white font-bold">{teamBLabel} (Blue)</span>
            <span className="text-xs text-slate-400">
              [{teamB.score}/{teamB.wickets}]
            </span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 15, left: showAxes ? -15 : 5, bottom: showAxes ? 5 : 0 }}
          >
            <CartesianGrid
              stroke="rgba(255, 255, 255, 0.1)"
              strokeDasharray="3 3"
              vertical={false}
            />

            {showAxes && (
              <XAxis
                dataKey="over"
                stroke="rgba(255, 255, 255, 0.5)"
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 'bold' }}
                dy={4}
              />
            )}

            {showAxes && (
              <YAxis
                stroke="rgba(255, 255, 255, 0.5)"
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 'bold' }}
                allowDecimals={false}
              />
            )}

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as OverChartData;
                  return (
                    <div className="bg-[#0B132B]/95 border border-[#FF5A00]/60 p-2.5 rounded-lg shadow-2xl text-xs text-white space-y-1">
                      <p className="font-black text-[#FFDC35] uppercase">
                        AFTER OVER {d.over}
                      </p>
                      <div className="flex items-center justify-between gap-4 font-bold">
                        <span className="text-[#E63946]">{teamALabel}:</span>
                        <span>{d.teamACumulative} runs</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-bold">
                        <span className="text-[#0077B6]">{teamBLabel}:</span>
                        <span>{d.teamBCumulative} runs</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Team A Red Line */}
            <Line
              type="monotone"
              dataKey="teamACumulative"
              name={teamALabel}
              stroke={teamAColor}
              strokeWidth={3.5}
              dot={renderDotA}
              activeDot={{ r: 6, fill: teamAColor, stroke: '#FFFFFF', strokeWidth: 2 }}
              isAnimationActive={false}
            />

            {/* Team B Blue Line */}
            <Line
              type="monotone"
              dataKey="teamBCumulative"
              name={teamBLabel}
              stroke={teamBColor}
              strokeWidth={3.5}
              dot={renderDotB}
              activeDot={{ r: 6, fill: teamBColor, stroke: '#FFFFFF', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
