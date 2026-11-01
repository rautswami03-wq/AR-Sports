import React from 'react';
import { FullCardBase } from './base/FullCardBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface PlayerProfileCardProps {
  className?: string;
  playerId?: string;
}

export const PlayerProfileCard: React.FC<PlayerProfileCardProps> = ({
  className = '',
  playerId,
}) => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  const selectedId = playerId || matchDetails.selectedTournamentStatsPlayerId || matchDetails.selectedMomPlayerId;

  // Search across Team A & Team B
  let player =
    (selectedId ? teamA.batters.find((b) => b.id === selectedId) || teamA.bowlers.find((bw) => bw.id === selectedId) : null) ||
    (selectedId ? teamB.batters.find((b) => b.id === selectedId) || teamB.bowlers.find((bw) => bw.id === selectedId) : null) ||
    teamA.batters[0] || {
      id: 'p1',
      name: 'DEEPAK CHAHAR',
      runs: 14,
      balls: 8,
      fours: 1,
      sixes: 1,
    };

  const isTeamA =
    teamA.batters.some((b) => b.name === player.name) ||
    teamA.bowlers.some((bw) => bw.name === player.name);
  const team = isTeamA ? teamA : teamB;

  const bat = (isTeamA ? teamA : teamB).batters.find((b) => b.name === player.name);
  const bowl = (isTeamA ? teamA : teamB).bowlers.find((bw) => bw.name === player.name);

  // Derived or fallback stats
  const matches = 4;
  const runs = bat?.runs ?? 18;
  const balls = bat?.balls ?? 11;
  const fours = bat?.fours ?? 2;
  const sixes = bat?.sixes ?? 1;
  const sr = balls > 0 ? ((runs / balls) * 100).toFixed(2) : '150.00';

  const wickets = bowl?.wickets ?? 2;
  const overs = bowl?.overs ?? 3;
  const ballsInOver = bowl?.ballsInCurrentOver ?? 0;
  const runsConceded = bowl?.runsConceded ?? 24;
  const totalBowledBalls = overs * 6 + ballsInOver;
  const economy =
    bowl?.economy && bowl.economy > 0
      ? bowl.economy.toFixed(2)
      : totalBowledBalls > 0
      ? ((runsConceded / totalBowledBalls) * 6).toFixed(2)
      : '8.00';

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4 ${className}`}>
      <FullCardBase
        title="PLAYER PROFILE"
        subtitle={`${team.fullName || team.shortName} • TOURNAMENT INTEL`}
        badge={
          <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/20 border border-[#FF5A00]/50 px-3 py-0.5 rounded-full">
            THIS TOURNAMENT
          </span>
        }
        footerContent={
          <div className="flex items-center gap-6 font-bold text-sm text-slate-300">
            <span>TEAM: <strong className="text-white">{team.fullName || team.shortName}</strong></span>
            <span>•</span>
            <span>ROLE: <strong className="text-[#FFDC35]">{bat && bowl ? 'ALL ROUNDER' : bowl ? 'BOWLER' : 'BATTER'}</strong></span>
          </div>
        }
      >
        <div className="flex flex-col h-full gap-6">
          {/* Top Player Name & Team Banner */}
          <div className="flex items-center justify-between px-6 py-4 rounded-xl bg-[#060A17] border border-white/10 shadow-md">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-md"
                style={{ backgroundColor: team.primaryColor || '#004BA0' }}
              >
                {player.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
                  {player.name}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {team.fullName || team.shortName}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs uppercase font-extrabold text-slate-400">MATCHES PLAYED</span>
              <span className="text-3xl font-black text-[#FFDC35] leading-none mt-0.5">
                {matches}
              </span>
            </div>
          </div>

          {/* Stats Grid: Batting & Bowling */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Batting Card */}
            <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/80">
              <div className="px-4 py-2 bg-[#0077B6] text-white font-black text-xs uppercase tracking-wider flex items-center justify-between">
                <span>BATTING STATS</span>
                <span>🏏</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">RUNS</span>
                  <span className="text-2xl font-black text-white">{runs}</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">STRIKE RATE</span>
                  <span className="text-2xl font-black text-[#FFDC35]">{sr}</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">FOURS (4s)</span>
                  <span className="text-xl font-black text-white">{fours}</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">SIXES (6s)</span>
                  <span className="text-xl font-black text-white">{sixes}</span>
                </div>
              </div>
            </div>

            {/* Bowling Card */}
            <div className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#060A17]/80">
              <div className="px-4 py-2 bg-[#FF5A00] text-black font-black text-xs uppercase tracking-wider flex items-center justify-between">
                <span>BOWLING STATS</span>
                <span>⚾</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">WICKETS</span>
                  <span className="text-2xl font-black text-[#FF5A00]">{wickets}</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">ECONOMY</span>
                  <span className="text-2xl font-black text-[#FFDC35]">{economy}</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">OVERS BOWLED</span>
                  <span className="text-xl font-black text-white">{overs}</span>
                </div>
                <div className="p-2.5 rounded bg-white/5 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">RUNS CONCEDED</span>
                  <span className="text-xl font-black text-white">{runsConceded}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FullCardBase>
    </div>
  );
};
