import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const TopBowlersOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();

  return (
    <FullCardBase title="TOURNAMENT TOP WICKET TAKERS" subtitle="PURPLE CAP LEADERBOARD">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-white/10 uppercase text-xs">
            <th className="py-2.5 px-3">Bowler</th>
            <th className="py-2.5 px-3">Team</th>
            <th className="py-2.5 px-3 text-right">Matches</th>
            <th className="py-2.5 px-3 text-right">Wickets</th>
            <th className="py-2.5 px-3 text-right">Economy</th>
            <th className="py-2.5 px-3 text-right">Best</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-semibold">
          {matchDetails.topBowlers?.map((bw, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                <span className="text-purple-400 font-extrabold">{idx + 1}.</span> {bw.name}
              </td>
              <td className="py-3 px-3 text-slate-300">{bw.team}</td>
              <td className="py-3 px-3 text-right text-slate-300">{bw.matches}</td>
              <td className="py-3 px-3 text-right font-black text-purple-400 text-base">{bw.wickets}</td>
              <td className="py-3 px-3 text-right text-slate-300">{bw.economy}</td>
              <td className="py-3 px-3 text-right text-amber-400">{bw.best}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FullCardBase>
  );
};
