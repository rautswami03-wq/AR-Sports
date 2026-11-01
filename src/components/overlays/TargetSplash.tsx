import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface TargetSplashProps {
  className?: string;
  onClose?: () => void;
}

export const TargetSplash: React.FC<TargetSplashProps> = ({
  className = '',
}) => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  // 1st innings defending score or fallback to '23 - 1 (2/2 OVERS)'
  const rawScore = bowlingTeam.score > 0 ? bowlingTeam.score : battingTeam.score > 0 ? battingTeam.score : 23;
  const rawWickets = bowlingTeam.wickets > 0 ? bowlingTeam.wickets : battingTeam.wickets > 0 ? battingTeam.wickets : 1;
  const rawOvers = bowlingTeam.overs > 0 || bowlingTeam.balls > 0
    ? `${bowlingTeam.overs}${bowlingTeam.balls > 0 ? `.${bowlingTeam.balls}` : ''}`
    : battingTeam.overs > 0 || battingTeam.balls > 0
    ? `${battingTeam.overs}${battingTeam.balls > 0 ? `.${battingTeam.balls}` : ''}`
    : '2';
  const totalOvers = matchDetails.totalOvers || 2;
  const targetRuns = matchDetails.targetRuns || 20;

  const scoreDisplay = `${rawScore} - ${rawWickets} (${rawOvers}/${totalOvers} OVERS)`;

  const team1 = teamA;
  const team2 = teamB;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 font-sans select-none bg-black/75 backdrop-blur-md ${className}`}
      data-overlay="target-splash"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl rounded-3xl overflow-hidden bg-[#0B132B] border-4 border-[#FF5A00] shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col relative"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between w-full px-6 py-2.5 bg-black/90 border-b-2 border-white/10 text-xs font-black uppercase tracking-widest text-[#FFDC35]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A00] animate-ping" />
            {matchDetails.tournament || 'TATA IPL 2025'}
          </span>
          <span className="text-white/80 tracking-widest">INNINGS BREAK / TARGET</span>
          <span className="text-cyan-400">{matchDetails.stage || 'MATCH DAY'}</span>
        </div>

        {/* ── TOP HALF: "23 - 1 (2/2 OVERS)" ── */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-8 pb-6 px-6 text-center border-b border-white/10 bg-gradient-to-b from-[#0B132B] via-[#0D1A3F] to-[#0B132B]">
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-slate-300 mb-1">
            FIRST INNINGS TOTAL
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-wider text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            {scoreDisplay}
          </h1>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5A00] mt-1">
            RUN RATE: {((rawScore / (Number(rawOvers) || 1))).toFixed(2)} RPO
          </span>
        </div>

        {/* ── MIDDLE: "2ND INNING", "TARGET - 20" ── */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 py-5 px-6 bg-black/40 border-b border-white/10">
          {/* 2ND INNING Badge */}
          <div className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 border-2 border-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-200 animate-pulse" />
            <span className="text-lg md:text-xl font-black uppercase tracking-widest text-white drop-shadow">
              2ND INNING
            </span>
          </div>

          {/* TARGET - 20 Badge */}
          <div className="flex items-center gap-2 px-8 py-2 rounded-xl bg-gradient-to-r from-[#FF5A00] to-[#FF8500] border-2 border-[#FFDC35] shadow-[0_0_25px_rgba(255,90,0,0.5)]">
            <span className="text-lg md:text-xl font-black uppercase tracking-widest text-white drop-shadow">
              TARGET - <span className="text-[#FFDC35] text-2xl font-black">{targetRuns}</span>
            </span>
          </div>
        </div>

        {/* ── BOTTOM: Team 1 vs Team 2 graphic ── */}
        <div className="relative z-10 flex items-center justify-between p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent">
          {/* Team 1 Block */}
          <div className="flex-1 flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl border-2 border-white/30"
              style={{ backgroundColor: team1.primaryColor || '#004BA0' }}
            >
              {team1.logoUrl ? (
                <img src={team1.logoUrl} alt={team1.shortName} className="w-12 h-12 object-contain" />
              ) : (
                team1.shortName.substring(0, 3)
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">
                {team1.fullName || team1.shortName}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                TEAM 1
              </span>
            </div>
          </div>

          {/* VS Center Graphic */}
          <div className="flex flex-col items-center justify-center px-6">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5A00] via-[#FFB703] to-[#FF5A00] border-2 border-white text-black font-black italic text-lg shadow-[0_0_20px_rgba(255,90,0,0.8)]">
              VS
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mt-1">
              MATCHUP
            </span>
          </div>

          {/* Team 2 Block */}
          <div className="flex-1 flex items-center justify-end gap-4 text-right">
            <div className="flex flex-col items-end">
              <span className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">
                {team2.fullName || team2.shortName}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                TEAM 2
              </span>
            </div>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl border-2 border-white/30"
              style={{ backgroundColor: team2.primaryColor || '#FFFF00' }}
            >
              {team2.logoUrl ? (
                <img src={team2.logoUrl} alt={team2.shortName} className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-black font-black">{team2.shortName.substring(0, 3)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FF5A00] via-[#FFDC35] to-[#0077B6]" />
      </motion.div>
    </div>
  );
};
