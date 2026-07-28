import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { StatBadge } from '../common/StatBadge';

export const BowlerStatisticsOverlay: React.FC = () => {
  const { teamA } = useBroadcastStore();
  const bowler = teamA.bowlers[0];

  return (
    <FullCardBase title="BOWLER CAREER STATISTICS" subtitle="BOWLER SPOTLIGHT">
      <div className="flex items-center gap-8 py-4">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-purple-600 to-slate-800 flex items-center justify-center font-black text-4xl text-white shadow-xl border-2 border-white/20">
          {bowler.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <span className="text-sky-400 font-bold text-xs uppercase tracking-widest block">RIGHT ARM FAST</span>
            <h2 className="text-white text-3xl font-black">{bowler.name}</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <StatBadge label="MATCHES" value="52" />
            <StatBadge label="WICKETS" value="89" highlight />
            <StatBadge label="ECONOMY" value="6.42" />
            <StatBadge label="BEST FIGURES" value="4/14" highlight />
          </div>
        </div>
      </div>
    </FullCardBase>
  );
};
