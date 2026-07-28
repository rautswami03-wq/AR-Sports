import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';

export const SponsorGraphicsOverlay: React.FC = () => {
  const { matchDetails } = useBroadcastStore();

  return (
    <LowerThirdBase
      title="OFFICIAL BROADCAST SPONSORS"
      subtitle="POWERED BY"
      category="SPONSORS"
      primaryColor="#eab308"
    >
      <div className="flex items-center justify-around py-2">
        {matchDetails.sponsors?.map((s, idx) => (
          <div key={idx} className="bg-slate-900/90 px-6 py-2 rounded-xl border border-white/10 text-white font-black tracking-widest text-sm uppercase shadow-md">
            {s.name}
          </div>
        ))}
      </div>
    </LowerThirdBase>
  );
};
