import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';

export const WinnerScreenOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();
  const winnerTeam = matchDetails.winnerTeamId === teamB.id ? teamB : teamA;

  return (
    <FullCardBase
      title="MATCH WINNER CHAMPIONS"
      subtitle={matchDetails.stage}
      tournament={matchDetails.tournament}
    >
      <div className="flex flex-col items-center py-8">
        <div className="animate-bounce mb-3">
          <TeamBadge shortName={winnerTeam.shortName} primaryColor={winnerTeam.primaryColor} size="xl" />
        </div>
        <h2 className="text-amber-400 text-4xl font-black uppercase tracking-widest text-broadcast-gold">
          {winnerTeam.fullName}
        </h2>
        <div className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500/30 via-amber-400/40 to-amber-500/30 border border-amber-400/60 rounded-xl">
          <span className="text-white text-xl font-bold uppercase tracking-wide">
            {matchDetails.winnerMargin || `${winnerTeam.fullName} WINS THE MATCH!`}
          </span>
        </div>
      </div>
    </FullCardBase>
  );
};
