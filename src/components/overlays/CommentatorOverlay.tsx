import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export const CommentatorOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();
  const customText = matchDetails.customInputText || 'COMMENTATOR: RAKIB HOSSAIN & HARSHA BHOGLE';

  return (
    <div className="fixed bottom-12 left-12 z-30 font-sans">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/60 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white flex items-center gap-4 min-w-[360px]">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xl shadow">
          🎙️
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block">
            LIVE BROADCAST COMMENTARY
          </span>
          <h4 className="text-sm font-black uppercase text-white tracking-wide">{customText}</h4>
        </div>
      </div>
    </div>
  );
};
