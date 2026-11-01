import React from 'react';
import { FullCardBase } from './base/FullCardBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface TeamsLineupCardProps {
  className?: string;
}

export const TeamsLineupCard: React.FC<TeamsLineupCardProps> = ({ className = '' }) => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  const getCaptainName = (teamName: string) => {
    if (matchDetails.tossWinner && matchDetails.tossWinner.toLowerCase().includes(teamName.toLowerCase())) {
      // If toss winner mentioned, or default to first playingXI
    }
    return null;
  };

  const teamAPlayers =
    teamA.playingXI && teamA.playingXI.length > 0
      ? teamA.playingXI
      : teamA.batters.map((b) => b.name).concat(teamA.bowlers.map((bw) => bw.name));

  const teamBPlayers =
    teamB.playingXI && teamB.playingXI.length > 0
      ? teamB.playingXI
      : teamB.batters.map((b) => b.name).concat(teamB.bowlers.map((bw) => bw.name));

  // Fallback to 11 slots if list is shorter
  const listA = Array.from({ length: 11 }, (_, i) => teamAPlayers[i] || `Player ${i + 1}`);
  const listB = Array.from({ length: 11 }, (_, i) => teamBPlayers[i] || `Player ${i + 1}`);

  const captainA = listA[0];
  const captainB = listB[0];

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4 ${className}`}>
      <FullCardBase
        title="PLAYING XI LINEUP"
        subtitle={matchDetails.tournament || `${teamA.shortName} VS ${teamB.shortName}`}
        footerContent={
          <div className="flex items-center gap-6">
            <span>VENUE: <strong className="text-white">{matchDetails.venue || 'MATCH ARENA'}</strong></span>
            <span>•</span>
            <span>TOSS: <strong className="text-[#FFDC35]">{matchDetails.tossWinner || teamA.shortName} ({matchDetails.tossDecision || 'BAT'})</strong></span>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-8 h-full">
          {/* TEAM A COLUMN */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/80 shadow-inner">
            {/* Team A Header */}
            <div
              className="px-4 py-3 flex items-center justify-between shadow-md"
              style={{ backgroundColor: teamA.primaryColor || '#004BA0' }}
            >
              <div className="flex items-center gap-2.5">
                {teamA.logoUrl && (
                  <img src={teamA.logoUrl} alt={teamA.shortName} className="w-7 h-7 object-contain drop-shadow" />
                )}
                <span className="text-lg font-black uppercase tracking-wider text-white drop-shadow">
                  {teamA.fullName || teamA.shortName}
                </span>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-black/40 text-white uppercase tracking-widest">
                XI
              </span>
            </div>

            {/* Players List */}
            <div className="p-3.5 space-y-1.5 flex-1 overflow-y-auto">
              {listA.map((p, idx) => {
                const isCaptain = p === captainA;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      isCaptain
                        ? 'bg-gradient-to-r from-[#FF5A00]/30 to-transparent border-l-4 border-[#FF5A00] text-white shadow-sm'
                        : 'text-slate-200 hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xs font-black text-slate-400 w-5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate">{p}</span>
                    </div>
                    {isCaptain && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF5A00] text-black tracking-wider shadow">
                        CAPTAIN (C)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TEAM B COLUMN */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/80 shadow-inner">
            {/* Team B Header */}
            <div
              className="px-4 py-3 flex items-center justify-between shadow-md"
              style={{ backgroundColor: teamB.primaryColor || '#FFFF00' }}
            >
              <div className="flex items-center gap-2.5">
                {teamB.logoUrl && (
                  <img src={teamB.logoUrl} alt={teamB.shortName} className="w-7 h-7 object-contain drop-shadow" />
                )}
                <span className="text-lg font-black uppercase tracking-wider text-slate-950 drop-shadow">
                  {teamB.fullName || teamB.shortName}
                </span>
              </div>
              <span className="text-xs font-black px-2 py-0.5 rounded bg-black/20 text-slate-950 uppercase tracking-widest">
                XI
              </span>
            </div>

            {/* Players List */}
            <div className="p-3.5 space-y-1.5 flex-1 overflow-y-auto">
              {listB.map((p, idx) => {
                const isCaptain = p === captainB;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      isCaptain
                        ? 'bg-gradient-to-r from-[#FF5A00]/30 to-transparent border-l-4 border-[#FF5A00] text-white shadow-sm'
                        : 'text-slate-200 hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xs font-black text-slate-400 w-5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate">{p}</span>
                    </div>
                    {isCaptain && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF5A00] text-black tracking-wider shadow">
                        CAPTAIN (C)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </FullCardBase>
    </div>
  );
};

