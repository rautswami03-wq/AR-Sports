import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';

export const PitchMapOverlay: React.FC = () => {
  const { matchDetails, teamA, teamB, battingTeamId } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const bowlingTeam = isTeamA ? teamB : teamA;
  const currentBowler = bowlingTeam.bowlers.find((b) => b.isCurrent) || bowlingTeam.bowlers[0];

  return (
    <FullCardBase
      title="PITCH LENGTH MAP"
      subtitle={`${currentBowler?.name || 'BOWLER'} — DELIVERIES DISPERSION`}
      tournament={matchDetails.tournament}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
        {/* Cricket Pitch Length Graphic */}
        <div className="relative w-48 h-80 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-xl border-4 border-amber-600 shadow-2xl p-2 flex flex-col justify-between items-center overflow-hidden">
          {/* Stumps Top */}
          <div className="flex gap-2">
            <div className="w-1.5 h-6 bg-amber-200"></div>
            <div className="w-1.5 h-6 bg-amber-200"></div>
            <div className="w-1.5 h-6 bg-amber-200"></div>
          </div>

          {/* Pitch Length Zones */}
          <div className="w-full flex-1 flex flex-col justify-between my-2 border-y border-amber-500/40 relative">
            <div className="text-[10px] font-black text-rose-300 text-center uppercase tracking-widest py-1 bg-rose-950/40">
              YORKER / FULL
            </div>
            <div className="text-[10px] font-black text-emerald-300 text-center uppercase tracking-widest py-1 bg-emerald-950/40 border-t border-amber-500/20">
              GOOD LENGTH
            </div>
            <div className="text-[10px] font-black text-amber-300 text-center uppercase tracking-widest py-1 bg-amber-950/40 border-t border-amber-500/20">
              SHORT / BOUNCER
            </div>

            {/* Pitch Delivery Dots Sample */}
            <div className="absolute top-4 left-10 w-3.5 h-3.5 bg-rose-500 rounded-full border border-white shadow-lg animate-ping"></div>
            <div className="absolute top-6 left-24 w-3 h-3 bg-rose-400 rounded-full border border-white shadow"></div>
            <div className="absolute top-16 left-16 w-3 h-3 bg-emerald-400 rounded-full border border-white shadow"></div>
            <div className="absolute top-20 left-8 w-3 h-3 bg-emerald-400 rounded-full border border-white shadow"></div>
            <div className="absolute top-24 left-28 w-3 h-3 bg-emerald-400 rounded-full border border-white shadow"></div>
            <div className="absolute top-40 left-20 w-3 h-3 bg-amber-400 rounded-full border border-white shadow"></div>
          </div>

          {/* Stumps Bottom */}
          <div className="flex gap-2">
            <div className="w-1.5 h-6 bg-amber-200"></div>
            <div className="w-1.5 h-6 bg-amber-200"></div>
            <div className="w-1.5 h-6 bg-amber-200"></div>
          </div>
        </div>

        {/* Length Summary Legend */}
        <div className="space-y-3 font-sans">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-8 min-w-[240px]">
            <span className="text-xs font-black text-rose-400 uppercase">Yorker / Full</span>
            <span className="text-lg font-black text-white">35%</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-8 min-w-[240px]">
            <span className="text-xs font-black text-emerald-400 uppercase">Good Length</span>
            <span className="text-lg font-black text-white">50%</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-8 min-w-[240px]">
            <span className="text-xs font-black text-amber-400 uppercase">Short Pitch</span>
            <span className="text-lg font-black text-white">15%</span>
          </div>
        </div>
      </div>
    </FullCardBase>
  );
};
