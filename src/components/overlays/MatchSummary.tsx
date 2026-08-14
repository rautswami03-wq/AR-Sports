import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';

export const MatchSummary: React.FC = () => {
  const { teamA, teamB, matchDetails, tournamentId } = useBroadcastStore();

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const getWinnerMessage = () => {
    if (matchDetails.winnerMargin) return matchDetails.winnerMargin;
    if (teamA.score > teamB.score) {
      return `${teamA.fullName.toUpperCase()} WON BY ${teamA.score - teamB.score} RUNS`;
    } else if (teamB.score > teamA.score) {
      return `${teamB.fullName.toUpperCase()} WON BY ${10 - teamB.wickets} WICKETS`;
    }
    return `${teamA.fullName.toUpperCase()} vs ${teamB.fullName.toUpperCase()}`;
  };

  if (layoutStyle === 't20-asia-cup') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1160px] shadow-2xl rounded-2xl overflow-hidden bg-white border-2 border-cyan-400 flex items-stretch"
        >
          <div className="w-32 flex-shrink-0 bg-[#000865]">
            <AsiaCupLeftFullWings className="w-full h-full" />
          </div>

          <div className="flex-1 flex flex-col bg-white">
            <div className="bg-[#000865] px-8 py-4 text-white flex items-center justify-between border-b-2 border-[#ffc72c]">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wide">{teamA.fullName || teamA.shortName} vs {teamB.fullName || teamB.shortName}</h2>
                <p className="text-sm font-bold text-slate-300 uppercase mt-0.5 tracking-wider">
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div className="text-[#ffc72c] text-3xl font-black">🔥</div>
            </div>

            <div className="p-6 bg-slate-50 grid grid-cols-2 gap-6 flex-1 min-h-[340px]">
              <div className="bg-white rounded-lg border border-slate-200 shadow overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-[#ffc72c] text-slate-950 px-4 py-2 flex items-center justify-between font-black text-lg uppercase">
                    <span>{teamA.fullName}</span>
                    <span>{teamA.score} - {teamA.wickets} ({teamA.overs}.{teamA.balls})</span>
                  </div>
                  <div className="p-4 space-y-2 text-xs font-black text-[#000865]">
                    {teamA.batters.slice(0, 4).map((b) => (
                      <div key={b.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                        <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                        <span className="text-base font-black">{b.runs} <span className="text-slate-500 text-xs font-normal">({b.balls})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 pt-2 border-t border-slate-100 text-xs font-black text-[#000865]">
                  <span className="text-[10px] text-slate-500 block mb-1">BOWLING</span>
                  {teamB.bowlers.slice(0, 2).map((bw) => (
                    <div key={bw.id} className="flex justify-between items-center">
                      <span className="uppercase truncate max-w-[130px]">{bw.name}</span>
                      <span>{bw.wickets} - {bw.runsConceded} ({bw.overs}.{bw.ballsInCurrentOver})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 shadow overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-[#00b4d8] text-slate-950 px-4 py-2 flex items-center justify-between font-black text-lg uppercase">
                    <span>{teamB.fullName}</span>
                    <span>{teamB.score} - {teamB.wickets} ({teamB.overs}.{teamB.balls})</span>
                  </div>
                  <div className="p-4 space-y-2 text-xs font-black text-[#000865]">
                    {teamB.batters.slice(0, 4).map((b) => (
                      <div key={b.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                        <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                        <span className="text-base font-black">{b.runs} <span className="text-slate-500 text-xs font-normal">({b.balls})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 pt-2 border-t border-slate-100 text-xs font-black text-[#000865]">
                  <span className="text-[10px] text-slate-500 block mb-1">BOWLING</span>
                  {teamA.bowlers.slice(0, 2).map((bw) => (
                    <div key={bw.id} className="flex justify-between items-center">
                      <span className="uppercase truncate max-w-[130px]">{bw.name}</span>
                      <span>{bw.wickets} - {bw.runsConceded} ({bw.overs}.{bw.ballsInCurrentOver})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#dc2626] text-white px-8 py-3 text-center font-black text-xl uppercase tracking-wider">
              {getWinnerMessage()}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (layoutStyle === 'icc-navarasa') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1140px] shadow-2xl rounded-2xl overflow-hidden bg-white border-2 border-pink-500 flex flex-col relative"
        >
          <div className="bg-[#00d4ff] text-[#20003b] font-black text-sm py-1 text-center uppercase tracking-widest">
            ICC WORLD CUP
          </div>
          <div className="flex-1 flex items-stretch">
            <div className="w-6 flex-shrink-0"><NavarasaVerticalRibbon className="w-full h-full" /></div>
            <div className="flex-1 flex flex-col">
              <div className="bg-[#20003b] text-white px-8 py-2.5 flex items-center justify-between border-b-2 border-pink-500">
                <span className="text-2xl font-black uppercase">{teamA.fullName || teamA.shortName}</span>
                <span className="text-xs font-black bg-[#e91e63] px-4 py-1 rounded-full uppercase tracking-wider">MATCH SUMMARY</span>
                <span className="text-2xl font-black uppercase opacity-90">{teamB.fullName || teamB.shortName}</span>
              </div>

              <div className="p-6 bg-slate-50 grid grid-cols-2 gap-6 flex-1 min-h-[320px]">
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow flex flex-col justify-between">
                  <div>
                    <div className="bg-[#ffd700] text-slate-950 px-4 py-1.5 rounded flex justify-between font-black uppercase mb-3">
                      <span>{teamA.fullName}</span>
                      <span>{teamA.score} - {teamA.wickets}</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-black text-[#20003b]">
                      {teamA.batters.slice(0, 4).map((b) => (
                        <div key={b.id} className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="uppercase">{b.name}</span>
                          <span className="text-rose-600">{b.runs} ({b.balls})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-black text-[#20003b]">
                    {teamB.bowlers.slice(0, 2).map((bw) => (
                      <div key={bw.id} className="flex justify-between">
                        <span className="uppercase">{bw.name}</span>
                        <span>{bw.wickets} - {bw.runsConceded}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow flex flex-col justify-between">
                  <div>
                    <div className="bg-[#00529b] text-white px-4 py-1.5 rounded flex justify-between font-black uppercase mb-3">
                      <span>{teamB.fullName}</span>
                      <span>{teamB.score} - {teamB.wickets}</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-black text-[#20003b]">
                      {teamB.batters.slice(0, 4).map((b) => (
                        <div key={b.id} className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="uppercase">{b.name}</span>
                          <span className="text-rose-600">{b.runs} ({b.balls})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-black text-[#20003b]">
                    {teamA.bowlers.slice(0, 2).map((bw) => (
                      <div key={bw.id} className="flex justify-between">
                        <span className="uppercase">{bw.name}</span>
                        <span>{bw.wickets} - {bw.runsConceded}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#00d4ff] text-[#20003b] py-2.5 text-center font-black text-xl uppercase tracking-wider">
                {getWinnerMessage()}
              </div>
            </div>
            <div className="w-6 flex-shrink-0"><NavarasaVerticalRibbon className="w-full h-full" /></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-[1100px] shadow-2xl rounded-xl overflow-hidden border-2 bg-slate-950 font-sans text-slate-100"
        style={{ borderColor: theme.primaryAccent || '#facc15' }}
      >
        <div
          className="py-2.5 px-6 flex items-center justify-center relative shadow-inner"
          style={{ background: theme.headerGradient || 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}
        >
          <span
            className="text-slate-950 px-6 py-1 rounded-full font-black text-sm uppercase tracking-widest shadow-md"
            style={{ backgroundColor: theme.primaryAccent || '#facc15' }}
          >
            {matchDetails.tournament || theme.name}
          </span>
        </div>

        <div
          className="text-white px-8 py-3.5 flex items-center justify-between border-b-2 border-white/20"
          style={{ background: theme.badgeBg || '#0f172a' }}
        >
          <span className="text-2xl font-black uppercase tracking-wider">{teamA.fullName}</span>
          <div className="text-center font-extrabold text-xs uppercase tracking-widest text-slate-300">
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'SUMMARY'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80">{teamB.fullName}</span>
        </div>

        <div className="p-6 bg-slate-900 grid grid-cols-2 gap-6 min-h-[300px]">
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow flex flex-col justify-between">
            <div>
              <div className="bg-cyan-500 text-slate-950 px-4 py-2 rounded flex items-center justify-between font-black text-lg uppercase mb-4 shadow">
                <span>{teamA.fullName}</span>
                <span className="text-xl font-black">{teamA.score} - {teamA.wickets}</span>
              </div>
              <div className="space-y-2 text-xs font-black text-slate-900">
                {teamA.batters.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                    <span className="text-rose-600 font-extrabold text-sm">{b.runs} <span className="text-slate-500 text-xs">{b.balls}</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase block mb-1">BOWLING</span>
              <div className="space-y-1 text-xs font-black text-slate-900">
                {teamB.bowlers.slice(0, 2).map((bw) => (
                  <div key={bw.id} className="flex justify-between items-center">
                    <span className="uppercase truncate max-w-[130px]">{bw.name}</span>
                    <span className="text-cyan-700 font-extrabold">{bw.wickets} - {bw.runsConceded} <span className="text-slate-500 text-[11px]">({bw.overs}.{bw.ballsInCurrentOver})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow flex flex-col justify-between">
            <div>
              <div className="bg-amber-400 text-slate-950 px-4 py-2 rounded flex items-center justify-between font-black text-lg uppercase mb-4 shadow">
                <span>{teamB.fullName}</span>
                <span className="text-xl font-black">{teamB.score} - {teamB.wickets}</span>
              </div>
              <div className="space-y-2 text-xs font-black text-slate-900">
                {teamB.batters.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                    <span className="text-rose-600 font-extrabold text-sm">{b.runs} <span className="text-slate-500 text-xs">{b.balls}</span></span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase block mb-1">BOWLING</span>
              <div className="space-y-1 text-xs font-black text-slate-900">
                {teamA.bowlers.slice(0, 2).map((bw) => (
                  <div key={bw.id} className="flex justify-between items-center">
                    <span className="uppercase truncate max-w-[130px]">{bw.name}</span>
                    <span className="text-amber-700 font-extrabold">{bw.wickets} - {bw.runsConceded} <span className="text-slate-500 text-[11px]">({bw.overs}.{bw.ballsInCurrentOver})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950 px-8 py-3 text-center border-t-2 border-purple-800">
          <span className="text-amber-300 font-black text-lg tracking-wider uppercase">
            {getWinnerMessage()}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
