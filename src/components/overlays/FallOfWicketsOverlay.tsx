import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const FallOfWicketsOverlay: React.FC = () => {
  const { matchDetails, teamA, teamB, battingTeamId } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;

  return (
    <FullCardBase
      title={`${battingTeam.fullName} - FALL OF WICKETS`}
      subtitle={`TOTAL WICKETS: ${battingTeam.wickets}`}
      tournament={matchDetails.tournament}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-white/10 uppercase text-xs">
              <th className="py-2.5 px-4">Wicket</th>
              <th className="py-2.5 px-4">Score</th>
              <th className="py-2.5 px-4">Over</th>
              <th className="py-2.5 px-4">Dismissed Batter</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-semibold">
            {matchDetails.fallOfWickets.map((fow) => (
              <tr key={fow.wicketNumber} className="hover:bg-white/5">
                <td className="py-3 px-4 text-red-400 font-bold">{fow.wicketNumber}th Wicket</td>
                <td className="py-3 px-4 font-black text-amber-300">{fow.runs}</td>
                <td className="py-3 px-4 text-slate-300">{fow.over} OV</td>
                <td className="py-3 px-4 text-white font-bold">{fow.batterName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FullCardBase>
  );
};
