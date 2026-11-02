import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { OverChartData, useMatchChartData } from './chartDataHelper';

export interface DoubleBarChartProps {
  data?: OverChartData[];
  teamAColor?: string;
  teamBColor?: string;
  teamAName?: string;
  teamBName?: string;
  height?: number | string;
  className?: string;
  showAxes?: boolean;
}

export const DoubleBarChart: React.FC<DoubleBarChartProps> = ({
  data: propData,
  teamAColor: propColorA,
  teamBColor: propColorB,
  teamAName: propTeamAName,
  teamBName: propTeamBName,
  height = 320,
  className = '',
  showAxes = true,
}) => {
  const { chartData, teamA, teamB } = useMatchChartData(propData);

  const teamALabel = propTeamAName || teamA.shortName || 'Team A';
  const teamBLabel = propTeamBName || teamB.shortName || 'Team B';

  const colorA = propColorA || teamA.primaryColor || '#E63946';
  const colorB = propColorB || teamB.primaryColor || '#0077B6';

  return (
    <div
      className={`w-full flex flex-col font-sans select-none ${className}`}
      data-testid="double-bar-chart"
    >
      {/* Top Chart Header / Subtitle */}
      <div className="flex items-center justify-between mb-2 px-2 text-xs font-bold text-slate-300">
        <span className="uppercase tracking-widest text-[#FFDC35]">
          RUNS PER OVER COMPARISON
        </span>
        <div className="flex items-center gap-5 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm border border-white/30 inline-block shadow-sm"
              style={{ backgroundColor: colorA }}
            />
            <span className="text-white font-bold">{teamALabel}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm border border-white/30 inline-block shadow-sm"
              style={{ backgroundColor: colorB }}
            />
            <span className="text-white font-bold">{teamBLabel}</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
                        OVER {d.over}
                      </p>
                      <div className="flex items-center justify-between gap-4 font-bold">
                        <span style={{ color: colorA }}>{teamALabel}:</span>
                        <span>{d.teamARuns} runs</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 font-bold">
                        <span style={{ color: colorB }}>{teamBLabel}:</span>
                        <span>{d.teamBRuns} runs</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="teamARuns"
              name={teamALabel}
              fill={colorA}
              radius={[3, 3, 0, 0]}
              maxBarSize={22}
              isAnimationActive={false}
            />

            <Bar
              dataKey="teamBRuns"
              name={teamBLabel}
              fill={colorB}
              radius={[3, 3, 0, 0]}
              maxBarSize={22}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

