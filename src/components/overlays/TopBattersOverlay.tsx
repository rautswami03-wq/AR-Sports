import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { FullCardBase } from '../common/FullCardBase';

export const TopBattersOverlay: React.FC = () => {
  const { matchDetails, tournamentId } = useBroadcastStore();

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const batters = matchDetails.topBatters || [
    { name: 'Virat Kohli', team: 'IND', matches: 9, runs: 765, average: 95.6, strikeRate: 90.3 },
    { name: 'Rohit Sharma', team: 'IND', matches: 9, runs: 597, average: 66.3, strikeRate: 125.4 },
    { name: 'Quinton de Kock', team: 'SA', matches: 9, runs: 591, average: 65.6, strikeRate: 107.0 },
    { name: 'Rachin Ravindra', team: 'NZ', matches: 9, runs: 565, average: 70.6, strikeRate: 108.4 },
    { name: 'Daryl Mitchell', team: 'NZ', matches: 9, runs: 552, average: 69.0, strikeRate: 111.0 },
    { name: 'David Warner', team: 'AUS', matches: 9, runs: 535, average: 53.5, strikeRate: 107.4 },
    { name: 'Shreyas Iyer', team: 'IND', matches: 9, runs: 530, average: 75.7, strikeRate: 113.2 },
    { name: 'KL Rahul', team: 'IND', matches: 9, runs: 452, average: 75.3, strikeRate: 90.8 },
    { name: 'Rassie van der Dussen', team: 'SA', matches: 9, runs: 448, average: 56.0, strikeRate: 84.5 },
    { name: 'Mitchell Marsh', team: 'AUS', matches: 9, runs: 441, average: 49.0, strikeRate: 107.8 }
  ];

  const rowColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'
  ];

  if (layoutStyle === 't20-asia-cup') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1140px] shadow-2xl rounded-2xl overflow-hidden bg-white border-2 border-cyan-400 flex items-stretch"
        >
          <div className="w-28 flex-shrink-0 bg-[#000865]">
            <AsiaCupLeftFullWings className="w-full h-full" />
          </div>

          <div className="flex-1 flex flex-col bg-white">
            <div className="bg-[#000865] px-8 py-3.5 text-white flex items-center justify-between border-b-2 border-[#ffc72c]">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wide">Top Batters</h2>
                <p className="text-xs font-bold text-slate-300 uppercase mt-0.5 tracking-wider">
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div className="text-[#ffc72c] text-2xl font-black">🔥</div>
            </div>

            <div className="p-4 space-y-1.5 flex-1 bg-slate-50">
              {batters.slice(0, 10).map((b, idx) => (
                <div
                  key={idx}
                  className="px-5 py-2 rounded text-white flex items-center justify-between font-black text-sm shadow-sm"
                  style={{ backgroundColor: rowColors[idx % rowColors.length] }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center text-base">{idx + 1}</span>
                    <span className="uppercase text-base">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-12 text-base">
                    <span className="opacity-90">{b.team}</span>
                    <span className="w-16 text-right font-black text-xl">{b.runs}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <FullCardBase title="TOURNAMENT TOP RUN SCORERS" subtitle="ORANGE CAP LEADERBOARD">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-white/10 uppercase text-xs">
            <th className="py-2.5 px-3">Batter</th>
            <th className="py-2.5 px-3">Team</th>
            <th className="py-2.5 px-3 text-right">Matches</th>
            <th className="py-2.5 px-3 text-right">Runs</th>
            <th className="py-2.5 px-3 text-right">Average</th>
            <th className="py-2.5 px-3 text-right">S/R</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-semibold">
          {batters.map((b, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-extrabold">{idx + 1}.</span> {b.name}
              </td>
              <td className="py-3 px-3 text-slate-300">{b.team}</td>
              <td className="py-3 px-3 text-right text-slate-300">{b.matches}</td>
              <td className="py-3 px-3 text-right font-black text-amber-400 text-base">{b.runs}</td>
              <td className="py-3 px-3 text-right text-slate-300">{b.average}</td>
              <td className="py-3 px-3 text-right text-sky-400">{b.strikeRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FullCardBase>
  );
};

