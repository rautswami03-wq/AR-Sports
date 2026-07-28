import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';

export const PartnershipOverlay: React.FC = () => {
  const { matchDetails, teamA, teamB, battingTeamId } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const p = matchDetails.partnership;

  const totalRuns = p.runs || 1;
  const pct1 = Math.round((p.batter1Runs / totalRuns) * 100);
  const pct2 = 100 - pct1;

  return (
    <LowerThirdBase
      title="CURRENT PARTNERSHIP"
      subtitle={`${p.runs} RUNS IN ${p.balls} BALLS`}
      category="PARTNERSHIP"
      primaryColor={battingTeam.primaryColor}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between font-extrabold text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white">{p.batter1Name}</span>
            <span className="text-amber-400 font-black">{p.batter1Runs} <span className="text-slate-400 text-xs font-normal">({p.batter1Balls})</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-black">{p.batter2Runs} <span className="text-slate-400 text-xs font-normal">({p.batter2Balls})</span></span>
            <span className="text-white">{p.batter2Name}</span>
          </div>
        </div>

        {/* Dynamic Percentage Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-white/10">
          <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${pct1}%` }} />
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${pct2}%` }} />
        </div>
      </div>
    </LowerThirdBase>
  );
};
