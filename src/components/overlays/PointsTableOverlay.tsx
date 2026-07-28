import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const PointsTableOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();

  return (
    <FullCardBase title="LEAGUE POINTS TABLE & STANDINGS" subtitle="GROUP STAGE">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-white/10 uppercase text-xs">
            <th className="py-2.5 px-3">Team</th>
            <th className="py-2.5 px-3 text-right">Played</th>
            <th className="py-2.5 px-3 text-right">Won</th>
            <th className="py-2.5 px-3 text-right">Lost</th>
            <th className="py-2.5 px-3 text-right">NRR</th>
            <th className="py-2.5 px-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-semibold">
          {matchDetails.pointsTable?.map((pt, idx) => (
            <tr key={pt.teamId} className={idx < 2 ? 'bg-emerald-500/10 text-emerald-300' : 'hover:bg-white/5'}>
              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                <span className="text-slate-400 font-extrabold">{idx + 1}.</span> {pt.shortName}
              </td>
              <td className="py-3 px-3 text-right text-slate-300">{pt.played}</td>
              <td className="py-3 px-3 text-right text-emerald-400">{pt.won}</td>
              <td className="py-3 px-3 text-right text-rose-400">{pt.lost}</td>
              <td className="py-3 px-3 text-right text-slate-300">{pt.nrr}</td>
              <td className="py-3 px-3 text-right font-black text-amber-400 text-base">{pt.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FullCardBase>
  );
};
