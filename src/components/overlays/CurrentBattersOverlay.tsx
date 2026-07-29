import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';

export const CurrentBattersOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;
  const activeBatters = battingTeam.batters.filter((b) => !b.isOut).slice(0, 2);

  return (
    <LowerThirdBase
      title="CURRENT BATTERS AT THE CREASE"
      subtitle={battingTeam.fullName}
      category="BATTERS"
      primaryColor={battingTeam.primaryColor}
    >
      <div className="grid grid-cols-2 gap-4">
        {activeBatters.map((b) => {
          const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0';
          return (
            <div key={b.id} className="bg-slate-900/90 p-3 rounded-lg border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-sm flex items-center gap-1">
                  {b.isStriker && <span className="text-amber-400">★</span>} {b.name}
                </span>
                <span className="text-amber-400 font-black text-xl block">{b.runs} <span className="text-slate-400 text-xs">({b.balls}b)</span></span>
              </div>
              <div className="flex gap-1.5">
                <StatBadge label="4s" value={b.fours} />
                <StatBadge label="6s" value={b.sixes} />
                <StatBadge label="S/R" value={sr} highlight />
              </div>
            </div>
          );
        })}
      </div>
    </LowerThirdBase>
  );
};
