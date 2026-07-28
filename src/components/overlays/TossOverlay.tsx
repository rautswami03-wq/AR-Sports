import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';

export const TossOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();

  return (
    <LowerThirdBase
      title="OFFICIAL MATCH TOSS RESULT"
      subtitle={matchDetails.venue}
      category="TOSS UPDATE"
      primaryColor="#f59e0b"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-slate-400 text-xs font-semibold uppercase block">TOSS WINNER</span>
          <span className="text-amber-400 font-black text-2xl uppercase">{matchDetails.tossWinner}</span>
        </div>
        <div className="bg-amber-500/20 border border-amber-400/50 px-4 py-2 rounded-lg text-right">
          <span className="text-slate-300 text-xs font-bold uppercase block">DECISION</span>
          <span className="text-white font-black text-lg uppercase">ELECTED TO {matchDetails.tossDecision.toUpperCase()} FIRST</span>
        </div>
      </div>
    </LowerThirdBase>
  );
};
