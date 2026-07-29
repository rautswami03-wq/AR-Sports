import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';

export const PlayingXIOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  return (
    <FullCardBase
      title="OFFICIAL PLAYING XI SQUAD"
      subtitle={matchDetails.stage}
      tournament={matchDetails.tournament}
    >
      <div className="grid grid-cols-2 gap-8">
        {/* Team A Lineup */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
            <TeamBadge shortName={teamA.shortName} primaryColor={teamA.primaryColor} size="md" />
            <h3 className="text-white font-extrabold text-lg uppercase">{teamA.fullName}</h3>
          </div>
          <ol className="space-y-1 text-xs font-semibold divide-y divide-white/5">
            {teamA.batters.map((player, idx) => (
              <li key={idx} className="py-1.5 flex items-center justify-between gap-2">
                <span className="text-slate-400 font-bold w-6">{idx + 1}.</span>
                {player.avatarUrl ? (
                  <img src={player.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-amber-400" />
                ) : null}
                <span className="text-white flex-1 font-bold">{player.name}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Team B Lineup */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-3">
            <TeamBadge shortName={teamB.shortName} primaryColor={teamB.primaryColor} size="md" />
            <h3 className="text-white font-extrabold text-lg uppercase">{teamB.fullName}</h3>
          </div>
          <ol className="space-y-1 text-xs font-semibold divide-y divide-white/5">
            {teamB.batters.map((player, idx) => (
              <li key={idx} className="py-1.5 flex items-center justify-between gap-2">
                <span className="text-slate-400 font-bold w-6">{idx + 1}.</span>
                {player.avatarUrl ? (
                  <img src={player.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-amber-400" />
                ) : null}
                <span className="text-white flex-1 font-bold">{player.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </FullCardBase>
  );
};
