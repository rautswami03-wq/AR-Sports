import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Cell,
} from 'recharts';
import { OverChartData, useMatchChartData } from './chartDataHelper';

export interface ManhattanChartProps {
  data?: OverChartData[];
  battingTeamColor?: string;
  teamName?: string;
  height?: number | string;
  className?: string;
  showAxes?: boolean;
}

export const ManhattanChart: React.FC<ManhattanChartProps> = ({
  data: propData,
  battingTeamColor: propColor,
  teamName: propTeamName,
  height = 320,
  className = '',
  showAxes = true,
}) => {
  const { chartData, currentBattingTeam, battingTeamColor } = useMatchChartData(propData);

  const teamColor = propColor || battingTeamColor || '#004BA0';
  const teamTitle = propTeamName || currentBattingTeam.fullName || currentBattingTeam.shortName;

  // Custom renderer for red circle above the bar when a wicket fell in that over
  const renderWicketCircle = (props: any) => {
    const { x, y, width, index } = props;
    const entry = chartData[index];
    if (!entry || !entry.hasWicket) return null;

    const cx = Number(x) + Number(width) / 2;
    const cy = Math.max(12, Number(y) - 12);

    return (
      <g key={`wicket-circle-${index}`}>
        {/* Outer Red Circle */}
        <circle
          cx={cx}
          cy={cy}
          r={7}
          fill="#E63946"
          stroke="#FFFFFF"
          strokeWidth={2}
          style={{ filter: 'drop-shadow(0 0 6px rgba(230, 57, 70, 0.9))' }}
        />
        {/* Center 'W' Glyph */}
        <text
          x={cx}
          y={cy + 3.5}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={8}
          fontWeight="900"
          fontFamily="sans-serif"
        >
          W
        </text>
      </g>
    );
  };

  return (
    <div
      className={`w-full flex flex-col font-sans select-none ${className}`}
      data-testid="manhattan-chart"
    >
      {/* Top Chart Header / Subtitle */}
      <div className="flex items-center justify-between mb-2 px-2 text-xs font-bold text-slate-300">
        <span className="uppercase tracking-widest text-[#FFDC35]">
          {teamTitle} — RUNS PER OVER
        </span>
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm border border-white/30 inline-block shadow-sm"
              style={{ backgroundColor: teamColor }}
            />
            <span>RUNS</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E63946] border border-white inline-block shadow-sm" />
            <span className="text-[#FF5A00]">WICKET FALLEN</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 25, right: 15, left: showAxes ? -15 : 5, bottom: showAxes ? 5 : 0 }}
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
                    <div className="bg-[#0B132B]/95 border border-[#FF5A00]/60 p-2.5 rounded-lg shadow-2xl text-xs text-white">
                      <p className="font-black text-[#FFDC35] uppercase mb-1">
                        OVER {d.over}
                      </p>
                      <p className="flex justify-between gap-4 font-bold">
                        <span className="text-slate-300">Runs Scored:</span>
                        <span className="text-white font-black">{d.runs}</span>
                      </p>
                      {d.hasWicket && (
                        <p className="flex justify-between gap-4 font-bold text-[#E63946] mt-1 pt-1 border-t border-white/10">
                          <span>Wicket Fallen:</span>
                          <span className="font-black">YES ({d.wickets})</span>
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="runs"
              fill={teamColor}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`bar-cell-${index}`}
                  fill={teamColor}
                  stroke={entry.hasWicket ? '#E63946' : 'rgba(255,255,255,0.25)'}
                  strokeWidth={entry.hasWicket ? 2 : 1}
                />
              ))}
              <LabelList dataKey="runs" content={renderWicketCircle} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

