import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const PlayerOfTheMatchOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();
  const potm = matchDetails.playerOfTheMatch;

  if (!potm) return null;

  return (
    <FullCardBase
      title="PLAYER OF THE MATCH"
      subtitle={matchDetails.stage}
      tournament={matchDetails.tournament}
    >
      <div className="flex flex-col items-center py-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-black text-3xl text-slate-950 shadow-2xl border-4 border-white/20 mb-4">
          MVP
        </div>
        <span className="text-amber-400 text-sm font-extrabold uppercase tracking-widest block">{potm.team}</span>
        <h2 className="text-white text-4xl font-black uppercase text-broadcast-gold mt-1">{potm.name}</h2>
        <div className="mt-4 px-6 py-2 bg-slate-900 border border-white/10 rounded-xl text-center">
          <span className="text-slate-300 font-extrabold text-lg">{potm.stats}</span>
        </div>
      </div>
    </FullCardBase>
  );
};
