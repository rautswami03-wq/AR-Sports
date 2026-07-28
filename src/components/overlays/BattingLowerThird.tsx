import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';

export const BattingLowerThird: React.FC = () => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];

  if (!striker) return null;

  const sr = striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.0';

  return (
    <LowerThirdBase
      title={striker.name}
      subtitle={`${battingTeam.fullName} • BATTING`}
      category="BATTER PERFORMANCE"
      primaryColor={battingTeam.primaryColor}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-amber-400">{striker.runs}</span>
          <span className="text-slate-400 font-bold text-sm">RUNS IN {striker.balls} BALLS</span>
        </div>
        <div className="flex items-center gap-3">
          <StatBadge label="4s" value={striker.fours} />
          <StatBadge label="6s" value={striker.sixes} />
          <StatBadge label="S/R" value={sr} highlight />
        </div>
      </div>
    </LowerThirdBase>
  );
};
