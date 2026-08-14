import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { LowerThirdBase } from '../common/LowerThirdBase';

export const PartnershipOverlay: React.FC = () => {
  const { matchDetails, teamA, teamB, battingTeamId, tournamentId } = useBroadcastStore();
  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const p = matchDetails.partnership;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const totalRuns = p.runs || 1;
  const pct1 = Math.round((p.batter1Runs / totalRuns) * 100);
  const pct2 = 100 - pct1;

  if (layoutStyle === 't20-asia-cup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-8 left-16 right-16 z-40 h-20 bg-[#00b4d8] text-white rounded-md shadow-2xl flex items-center justify-between px-12 font-sans border-t-2 border-b-2 border-white/50"
      >
        <div className="font-black text-2xl uppercase tracking-wide">
          {p.batter1Name || 'BATTER 1'}
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs font-black tracking-widest uppercase opacity-90">PARTNERSHIP</span>
          <span className="text-3xl font-black">{p.runs} <span className="text-xl font-bold opacity-80">({p.balls})</span></span>
        </div>
        <div className="font-black text-2xl uppercase tracking-wide">
          {p.batter2Name || 'BATTER 2'}
        </div>
      </motion.div>
    );
  }

  return (
    <LowerThirdBase
      title="CURRENT PARTNERSHIP"
      subtitle={`${p.runs} RUNS IN ${p.balls} BALLS`}
      category="PARTNERSHIP"
      primaryColor={battingTeam.primaryColor}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between font-extrabold text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white">{p.batter1Name}</span>
            <span className="text-amber-400 font-black">{p.batter1Runs} <span className="text-slate-400 text-xs font-normal">({p.batter1Balls})</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-black">{p.batter2Runs} <span className="text-slate-400 text-xs font-normal">({p.batter2Balls})</span></span>
            <span className="text-white">{p.batter2Name}</span>
          </div>
        </div>

        {/* Dynamic Percentage Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-white/10">
          <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${pct1}%` }} />
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${pct2}%` }} />
        </div>
      </div>
    </LowerThirdBase>
  );
};

