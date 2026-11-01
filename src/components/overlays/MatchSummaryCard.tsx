import React from 'react';
import { FullCardBase } from './base/FullCardBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface MatchSummaryCardProps {
  className?: string;
}

export const MatchSummaryCard: React.FC<MatchSummaryCardProps> = ({ className = '' }) => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  const isTeamAWinner = matchDetails.winnerTeamId === teamA.id;
  const winnerTeam = isTeamAWinner ? teamA : teamB;
  const loserTeam = isTeamAWinner ? teamB : teamA;
  const marginText = matchDetails.winnerMargin || '9 WICKETS';
  const winnerBannerText = `${winnerTeam.fullName || winnerTeam.shortName} WON BY ${marginText}`.toUpperCase();

  const teamABatters = teamA.batters.slice(0, 4);
  const teamABowlers = teamB.bowlers.slice(0, 2);

  const teamBBatters = teamB.batters.slice(0, 4);
  const teamBBowlers = teamA.bowlers.slice(0, 2);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4 ${className}`}>
      <FullCardBase
        title="MATCH SUMMARY"
        subtitle={`${matchDetails.tournament || 'TATA IPL 2025'} • FINAL RESULT`}
        footerContent={
          <div className="w-full flex items-center justify-center py-1">
            {/* Banner: TEAM X WON BY Y WICKETS */}
            <div className="relative px-8 py-2 rounded-xl bg-gradient-to-r from-red-600 via-[#FF5A00] to-red-600 text-white font-black text-xl md:text-2xl uppercase tracking-widest shadow-[0_0_20px_#FF5A00] flex items-center gap-3">
              <span className="text-[#FFDC35] text-2xl">★</span>
              <span>{winnerBannerText}</span>
              <span className="text-[#FFDC35] text-2xl">★</span>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-5 h-full">
          {/* TOP HALF: TEAM A INNINGS */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/85 shadow-lg">
            {/* Team A Header */}
            <div
              className="px-5 py-2.5 flex items-center justify-between shadow-md"
              style={{ backgroundColor: teamA.primaryColor || '#004BA0' }}
            >
              <div className="flex items-center gap-3">
                {teamA.logoUrl && (
                  <img src={teamA.logoUrl} alt={teamA.shortName} className="w-6 h-6 object-contain" />
                )}
                <span className="text-base font-black uppercase tracking-wider text-white">
                  {teamA.fullName || teamA.shortName}
                </span>
              </div>
              <div className="flex items-baseline gap-2 text-white">
                <span className="text-xs uppercase opacity-80">OVERS {teamA.overs}.{teamA.balls}</span>
                <span className="text-xl font-black">{teamA.score} - {teamA.wickets}</span>
              </div>
            </div>

            {/* Split Batters / Bowlers */}
            <div className="grid grid-cols-2 divide-x divide-white/10 p-3 text-xs font-bold">
              {/* Batters */}
              <div className="space-y-1.5 pr-3">
                {teamABatters.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-200">
                    <span className="truncate">{b.name} {b.isStriker ? '*' : ''}</span>
                    <span className="text-white font-black">{b.runs} <span className="text-[10px] text-slate-400 font-normal">({b.balls})</span></span>
                  </div>
                ))}
              </div>
              {/* Bowlers */}
              <div className="space-y-1.5 pl-3">
                {teamABowlers.map((bw, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-200">
                    <span className="truncate">{bw.name}</span>
                    <span className="text-white font-black">{bw.wickets}-{bw.runsConceded} <span className="text-[10px] text-slate-400 font-normal">({bw.overs})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM HALF: TEAM B INNINGS */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/85 shadow-lg">
            {/* Team B Header */}
            <div
              className="px-5 py-2.5 flex items-center justify-between shadow-md"
              style={{ backgroundColor: teamB.primaryColor || '#FFFF00' }}
            >
              <div className="flex items-center gap-3">
                {teamB.logoUrl && (
                  <img src={teamB.logoUrl} alt={teamB.shortName} className="w-6 h-6 object-contain" />
                )}
                <span className="text-base font-black uppercase tracking-wider text-slate-950">
                  {teamB.fullName || teamB.shortName}
                </span>
              </div>
              <div className="flex items-baseline gap-2 text-slate-950">
                <span className="text-xs uppercase opacity-85">OVERS {teamB.overs}.{teamB.balls}</span>
                <span className="text-xl font-black">{teamB.score} - {teamB.wickets}</span>
              </div>
            </div>

            {/* Split Batters / Bowlers */}
            <div className="grid grid-cols-2 divide-x divide-white/10 p-3 text-xs font-bold">
              {/* Batters */}
              <div className="space-y-1.5 pr-3">
                {teamBBatters.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-200">
                    <span className="truncate">{b.name} {b.isStriker ? '*' : ''}</span>
                    <span className="text-white font-black">{b.runs} <span className="text-[10px] text-slate-400 font-normal">({b.balls})</span></span>
                  </div>
                ))}
              </div>
              {/* Bowlers */}
              <div className="space-y-1.5 pl-3">
                {teamBBowlers.map((bw, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-200">
                    <span className="truncate">{bw.name}</span>
                    <span className="text-white font-black">{bw.wickets}-{bw.runsConceded} <span className="text-[10px] text-slate-400 font-normal">({bw.overs})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FullCardBase>
    </div>
  );
};
