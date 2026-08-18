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

  if (layoutStyle === 'local-match-pro') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="absolute left-8 top-16 z-40 w-[380px] bg-[#00b4d8] rounded-xl shadow-2xl border-4 border-[#ff5500] overflow-hidden font-sans text-slate-950"
      >
        {/* Header Title */}
        <div className="bg-[#0b0c26] text-white p-3 text-center border-b-2 border-slate-950">
          <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase block">THIS TOURNAMENT</span>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
            <span>🏏</span> {striker.name}
          </h2>
          <span className="text-xs font-bold text-cyan-400 uppercase block mt-0.5">
            ({battingTeam.fullName || battingTeam.shortName})
          </span>
        </div>

        {/* Stats Table Tiles Matching Screenshot 2 */}
        <div className="p-3 space-y-1.5 text-center font-black">
          <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-900 uppercase block">MATCHES</span>
            <span className="text-xl text-slate-950 font-black">4</span>
          </div>
          <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-900 uppercase block">RUNS</span>
            <span className="text-2xl text-slate-950 font-black">{striker.runs}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
              <span className="text-[11px] text-slate-900 uppercase block">FOURS {striker.fours}</span>
            </div>
            <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
              <span className="text-[11px] text-slate-900 uppercase block">SIXES {striker.sixes}</span>
            </div>
          </div>
          <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-900 uppercase block">STRIKE RATE</span>
            <span className="text-2xl text-slate-950 font-black">{sr}</span>
          </div>
          <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-900 uppercase block">BATTING BEST</span>
            <span className="text-xl text-slate-950 font-black">{striker.runs} ({striker.balls})</span>
          </div>
          <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-900 uppercase block">WICKETS</span>
            <span className="text-xl text-slate-950 font-black">2</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
              <span className="text-[10px] text-slate-900 uppercase block">OVERS BOWLED 2</span>
            </div>
            <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
              <span className="text-[10px] text-slate-900 uppercase block">ECONOMY 14.00</span>
            </div>
          </div>
          <div className="bg-[#00d2ff] p-2 rounded border border-slate-900 shadow-sm">
            <span className="text-[11px] text-slate-900 uppercase block">BOWLING BEST</span>
            <span className="text-xl text-slate-950 font-black">1 - 13 (1)</span>
          </div>
        </div>
      </motion.div>
    );
  }

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
