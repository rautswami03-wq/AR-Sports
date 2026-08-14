import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { FullCardBase } from '../common/FullCardBase';

export const TopBowlersOverlay: React.FC = () => {
  const { matchDetails, tournamentId } = useBroadcastStore();

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const bowlers = matchDetails.topBowlers || [
    { name: 'Mohammed Shami', team: 'IND', matches: 7, wickets: 24, economy: 5.26, best: '7/57' },
    { name: 'Adam Zampa', team: 'AUS', matches: 9, wickets: 22, economy: 5.35, best: '4/8' },
    { name: 'Dilshan Madushanka', team: 'SL', matches: 9, wickets: 21, economy: 6.70, best: '5/80' },
    { name: 'Jasprit Bumrah', team: 'IND', matches: 9, wickets: 18, economy: 3.65, best: '4/39' },
    { name: 'Gerald Coetzee', team: 'SA', matches: 7, wickets: 18, economy: 6.23, best: '4/44' },
    { name: 'Shaheen Afridi', team: 'PAK', matches: 9, wickets: 18, economy: 5.93, best: '5/54' },
    { name: 'Marco Jansen', team: 'SA', matches: 8, wickets: 17, economy: 6.41, best: '3/31' },
    { name: 'Ravindra Jadeja', team: 'IND', matches: 9, wickets: 16, economy: 3.97, best: '5/33' },
    { name: 'Josh Hazlewood', team: 'AUS', matches: 9, wickets: 14, economy: 5.03, best: '3/38' },
    { name: 'Mitchell Santner', team: 'NZ', matches: 9, wickets: 14, economy: 4.84, best: '5/59' }
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
                <h2 className="text-2xl font-black uppercase tracking-wide">Top Bowlers</h2>
                <p className="text-xs font-bold text-slate-300 uppercase mt-0.5 tracking-wider">
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div className="text-[#ffc72c] text-2xl font-black">🔥</div>
            </div>

            <div className="p-4 space-y-1.5 flex-1 bg-slate-50">
              {bowlers.slice(0, 10).map((bw, idx) => (
                <div
                  key={idx}
                  className="px-5 py-2 rounded text-white flex items-center justify-between font-black text-sm shadow-sm"
                  style={{ backgroundColor: rowColors[idx % rowColors.length] }}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center text-base">{idx + 1}</span>
                    <span className="uppercase text-base">{bw.name}</span>
                  </div>
                  <div className="flex items-center gap-12 text-base">
                    <span className="opacity-90">{bw.team}</span>
                    <span className="w-16 text-right font-black text-xl">{bw.wickets}</span>
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
    <FullCardBase title="TOURNAMENT TOP WICKET TAKERS" subtitle="PURPLE CAP LEADERBOARD">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-white/10 uppercase text-xs">
            <th className="py-2.5 px-3">Bowler</th>
            <th className="py-2.5 px-3">Team</th>
            <th className="py-2.5 px-3 text-right">Matches</th>
            <th className="py-2.5 px-3 text-right">Wickets</th>
            <th className="py-2.5 px-3 text-right">Economy</th>
            <th className="py-2.5 px-3 text-right">Best</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-semibold">
          {bowlers.map((bw, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                <span className="text-purple-400 font-extrabold">{idx + 1}.</span> {bw.name}
              </td>
              <td className="py-3 px-3 text-slate-300">{bw.team}</td>
              <td className="py-3 px-3 text-right text-slate-300">{bw.matches}</td>
              <td className="py-3 px-3 text-right font-black text-purple-400 text-base">{bw.wickets}</td>
              <td className="py-3 px-3 text-right text-slate-300">{bw.economy}</td>
              <td className="py-3 px-3 text-right text-amber-400">{bw.best}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FullCardBase>
  );
};

