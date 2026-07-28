import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const TopBattersOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();

  return (
    <FullCardBase title="TOURNAMENT TOP RUN SCORERS" subtitle="ORANGE CAP LEADERBOARD">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-white/10 uppercase text-xs">
            <th className="py-2.5 px-3">Batter</th>
            <th className="py-2.5 px-3">Team</th>
            <th className="py-2.5 px-3 text-right">Matches</th>
            <th className="py-2.5 px-3 text-right">Runs</th>
            <th className="py-2.5 px-3 text-right">Average</th>
            <th className="py-2.5 px-3 text-right">S/R</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-semibold">
          {matchDetails.topBatters?.map((b, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-extrabold">{idx + 1}.</span> {b.name}
              </td>
              <td className="py-3 px-3 text-slate-300">{b.team}</td>
              <td className="py-3 px-3 text-right text-slate-300">{b.matches}</td>
              <td className="py-3 px-3 text-right font-black text-amber-400 text-base">{b.runs}</td>
              <td className="py-3 px-3 text-right text-slate-300">{b.average}</td>
              <td className="py-3 px-3 text-right text-sky-400">{b.strikeRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FullCardBase>
  );
};
