import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

export const PlayerStatisticsOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;
  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  if (!striker) return null;

  const sr = striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(2) : '0.00';

  if (layoutStyle === 't20-asia-cup') {
    return (
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="absolute left-10 top-20 z-40 w-80 bg-gradient-to-b from-[#bae6fd] to-[#7dd3fc] rounded-2xl shadow-2xl border-2 border-white/60 overflow-hidden font-sans text-slate-900"
      >
        {/* Red Top Banner */}
        <div className="bg-[#dc2626] text-white py-3 text-center shadow">
          <h2 className="text-2xl font-black uppercase tracking-wide">
            {striker.name}
          </h2>
          <span className="text-xs font-bold opacity-90 uppercase">
            {battingTeam.fullName || battingTeam.shortName}
          </span>
        </div>

        {/* Stats Grid of Clean White Tiles */}
        <div className="p-4 grid grid-cols-2 gap-2 text-xs font-black">
          <div className="bg-white p-2.5 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-[11px] text-slate-500 uppercase">Matches</span>
            <span className="text-lg font-black text-[#000865]">1</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-[11px] text-slate-500 uppercase">Runs</span>
            <span className="text-lg font-black text-[#000865]">{striker.runs}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-[11px] text-slate-500 uppercase">Fours</span>
            <span className="text-lg font-black text-[#000865]">{striker.fours}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm flex flex-col items-center">
            <span className="text-[11px] text-slate-500 uppercase">Sixes</span>
            <span className="text-lg font-black text-[#000865]">{striker.sixes}</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm flex flex-col items-center col-span-2">
            <span className="text-[11px] text-slate-500 uppercase">Strike Rate</span>
            <span className="text-xl font-black text-rose-600">{sr}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 240 }}
      className="absolute left-6 top-16 z-40 w-72 bg-gradient-to-b from-red-700 via-red-800 to-red-950 rounded-2xl shadow-2xl border-2 border-white/30 overflow-hidden font-sans text-white"
    >
      {/* Top Banner */}
      <div className="bg-black/40 py-2 text-center border-b border-white/20">
        <span className="text-[11px] font-black tracking-widest uppercase text-amber-300">
          THIS TOURNAMENT
        </span>
        <h2 className="text-xl font-black uppercase text-white tracking-wide">
          {striker?.name || 'ROHIT SHARMA'}
        </h2>
        <span className="text-xs font-bold opacity-80 uppercase">
          ({battingTeam.shortName})
        </span>
      </div>

      {/* Player Avatar */}
      <div className="flex justify-center my-3">
        <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-white/40 flex items-center justify-center font-black text-2xl text-amber-300 shadow-xl overflow-hidden">
          {striker?.name ? striker.name.substring(0, 2).toUpperCase() : 'RS'}
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="p-3 bg-black/30 space-y-1.5 text-xs font-extrabold border-t border-white/10">
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">MATCHES</span>
          <span>1</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">RUNS</span>
          <span className="text-amber-300">{striker?.runs || 0}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">FOURS</span>
          <span>{striker?.fours || 0}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">SIXES</span>
          <span>{striker?.sixes || 0}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-1">
          <span className="opacity-80">STRIKE RATE</span>
          <span className="text-cyan-300">
            {sr}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-80">BEST</span>
          <span>{striker?.runs || 0} ({striker?.balls || 0})</span>
        </div>
      </div>
    </motion.div>
  );
};
