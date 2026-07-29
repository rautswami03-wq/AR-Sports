import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const WatermarkOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();

  return (
    <div className="fixed top-8 right-8 z-40 font-sans pointer-events-none">
      <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur border border-white/10 px-4 py-2 rounded-xl shadow-2xl opacity-90">
        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
        <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">
          {matchDetails.tournament || 'CRICSCORER PRO LIVE'}
        </span>
      </div>
    </div>
  );
};
