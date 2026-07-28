import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';

export const TargetOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails, battingTeamId } = useBroadcastStore();
  const chasingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const target = matchDetails.targetRuns || 186;
  const reqRrr = (target / 20).toFixed(2);

  return (
    <FullCardBase
      title="TARGET SET FOR 2ND INNINGS"
      subtitle={`${chasingTeam.fullName} NEED ${target} RUNS`}
      tournament={matchDetails.tournament}
    >
      <div className="flex flex-col items-center py-6">
        <TeamBadge shortName={chasingTeam.shortName} primaryColor={chasingTeam.primaryColor} size="xl" />
        <h3 className="text-white text-3xl font-black mt-4 uppercase">{chasingTeam.fullName}</h3>
        <div className="mt-4 bg-amber-500/20 border border-amber-400 px-8 py-3 rounded-2xl text-center">
          <span className="text-amber-300 font-extrabold text-5xl tracking-tight block">{target} RUNS</span>
          <span className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-1 block">
            REQUIRED RUN RATE: {reqRrr} RPO (20 OVERS)
          </span>
        </div>
      </div>
    </FullCardBase>
  );
};
