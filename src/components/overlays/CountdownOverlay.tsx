import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const CountdownOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();

  return (
    <FullCardBase title="MATCH START COUNTDOWN" subtitle="LIVE TELECAST" tournament={matchDetails.tournament}>
      <div className="flex flex-col items-center py-8">
        <span className="text-slate-400 font-bold uppercase text-xs tracking-widest block mb-2">MATCH BEGINS IN</span>
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-white/10 text-center">
            <span className="text-amber-400 font-black text-5xl block">00</span>
            <span className="text-slate-400 text-[10px] uppercase font-bold">HOURS</span>
          </div>
          <span className="text-white font-black text-3xl">:</span>
          <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-white/10 text-center">
            <span className="text-amber-400 font-black text-5xl block">12</span>
            <span className="text-slate-400 text-[10px] uppercase font-bold">MINUTES</span>
          </div>
          <span className="text-white font-black text-3xl">:</span>
          <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-white/10 text-center">
            <span className="text-amber-400 font-black text-5xl block">45</span>
            <span className="text-slate-400 text-[10px] uppercase font-bold">SECONDS</span>
          </div>
        </div>
      </div>
    </FullCardBase>
  );
};
