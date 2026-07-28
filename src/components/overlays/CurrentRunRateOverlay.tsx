import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';

export const CurrentRunRateOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
  const projectedScore = (parseFloat(crr) * 20).toFixed(0);

  return (
    <LowerThirdBase
      title="RUN RATE & PROJECTED SCORE"
      subtitle={battingTeam.fullName}
      category="RUN RATE"
      primaryColor={battingTeam.primaryColor}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">CURRENT RUN RATE</span>
            <span className="text-sky-400 font-black text-3xl">{crr}</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">PROJECTED (20 OVERS)</span>
            <span className="text-amber-400 font-black text-3xl">{projectedScore} RUNS</span>
          </div>
        </div>
      </div>
    </LowerThirdBase>
  );
};
