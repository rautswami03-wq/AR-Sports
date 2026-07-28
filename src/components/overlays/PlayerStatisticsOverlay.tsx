import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { StatBadge } from '../common/StatBadge';

export const PlayerStatisticsOverlay: React.FC = () => {
  const { teamA, battingTeamId } = useBroadcastStore();
  const player = teamA.batters[0];

  return (
    <FullCardBase title="PLAYER CAREER STATISTICS" subtitle="BATTER SPOTLIGHT">
      <div className="flex items-center gap-8 py-4">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-800 flex items-center justify-center font-black text-4xl text-white shadow-xl border-2 border-white/20">
          {player.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block">RIGHT HAND BATTER</span>
            <h2 className="text-white text-3xl font-black">{player.name}</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <StatBadge label="MATCHES" value="48" />
            <StatBadge label="RUNS" value="1840" highlight />
            <StatBadge label="AVERAGE" value="46.0" />
            <StatBadge label="STRIKE RATE" value="158.4" highlight />
          </div>
        </div>
      </div>
    </FullCardBase>
  );
};
