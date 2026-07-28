import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';

export const BowlingLowerThird: React.FC = () => {
  const { teamA, teamB, bowlingTeamId } = useBroadcastStore();
  const bowlingTeam = bowlingTeamId === teamA.id ? teamA : teamB;
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  if (!currentBowler) return null;

  return (
    <LowerThirdBase
      title={currentBowler.name}
      subtitle={`${bowlingTeam.fullName} • BOWLING SPELL`}
      category="BOWLER FIGURES"
      primaryColor={bowlingTeam.primaryColor}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-sky-400">
            {currentBowler.wickets}-{currentBowler.runsConceded}
          </span>
          <span className="text-slate-400 font-bold text-sm">
            IN {currentBowler.overs}.{currentBowler.ballsInCurrentOver} OVERS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <StatBadge label="MAIDENS" value={currentBowler.maidens} />
          <StatBadge label="ECON" value={currentBowler.economy.toFixed(2)} highlight />
        </div>
      </div>
    </LowerThirdBase>
  );
};
