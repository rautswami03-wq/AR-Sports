import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';

export const BowlingScorecard: React.FC = () => {
  const { teamA, teamB, bowlingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = bowlingTeamId === teamA.id || bowlingTeamId === teamA.shortName || bowlingTeamId === 'teamA' || bowlingTeamId === teamA.fullName;
  const bowlingTeam = isTeamA ? teamA : teamB;
  const battingTeam = isTeamA ? teamB : teamA;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
  const totalExtras = battingTeam.extras || 0;
  const fowList = battingTeam.fallOfWickets || [];

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
                <h2 className="text-3xl font-black uppercase tracking-wide">{bowlingTeam.fullName || bowlingTeam.shortName}</h2>
                <p className="text-sm font-bold text-slate-300 uppercase mt-0.5 tracking-wider">
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div className="text-[#ffc72c] text-3xl font-black">🔥</div>
            </div>
            <div className="px-8 py-2 bg-[#ffc72c] text-slate-950 flex items-center justify-between text-sm font-black uppercase tracking-wider">
              <span className="w-48">BOWLER</span>
              <div className="grid grid-cols-5 gap-6 text-center w-[500px]">
                <span>Dot Balls</span>
                <span>Overs</span>
                <span>Runs</span>
                <span>Wickets</span>
                <span>Economy</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 space-y-1.5 flex-1 min-h-[200px]">
              {bowlingTeam.bowlers.map((bw) => {
                const totalBwBalls = bw.overs * 6 + bw.ballsInCurrentOver;
                const eco = totalBwBalls > 0 ? ((bw.runsConceded / totalBwBalls) * 6).toFixed(2) : '0.00';
                const dotBalls = Math.max(0, totalBwBalls - Math.floor(bw.runsConceded / 2));
                return (
                  <div key={bw.id} className="bg-white px-6 py-2.5 rounded-sm flex items-center justify-between font-black text-sm text-[#000865] shadow-sm border border-slate-200">
                    <span className="uppercase tracking-wide w-48 truncate font-black text-base">{bw.name}</span>
                    <div className="grid grid-cols-5 gap-6 text-center w-[500px] font-black text-base">
                      <span>{dotBalls}</span>
                      <span>{bw.overs}.{bw.ballsInCurrentOver}</span>
                      <span>{bw.runsConceded}</span>
                      <span className="text-rose-600 font-black">{bw.wickets}</span>
                      <span>{eco}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-200">
              <div className="bg-[#00b4d8] text-slate-950 px-8 py-1 flex items-center gap-8 text-xs font-black uppercase">
                <span className="w-24">WICKETS</span>
                <div className="flex items-center gap-12 font-black">
                  {[1, 2, 3, 4, 5, 6].map((w) => <span key={w}>{w}</span>)}
                </div>
              </div>
              <div className="bg-[#ffc72c] text-slate-950 px-8 py-1.5 flex items-center gap-8 text-sm font-black uppercase">
                <span className="w-24">RUNS</span>
                <div className="flex items-center gap-12 font-black">
                  {fowList.length > 0 ? (
                    fowList.slice(0, 6).map((fow, idx) => <span key={idx}>{fow.score}</span>)
                  ) : (
                    <span>{battingTeam.score}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-[#dc2626] text-white px-8 py-3 flex items-center justify-between font-black text-xl uppercase tracking-wider">
              <span>Run Rate {crr}</span>
              <span>Extras {totalExtras}</span>
              <span>Overs {battingTeam.overs}.{battingTeam.balls}</span>
              <span className="text-3xl font-black">{battingTeam.score} - {battingTeam.wickets}</span>
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
          <div className="bg-[#00d4ff] text-[#20003b] font-black text-sm py-1 text-center uppercase tracking-widest">ICC WORLD CUP</div>
          <div className="flex-1 flex items-stretch">
            <div className="w-6 flex-shrink-0"><NavarasaVerticalRibbon className="w-full h-full" /></div>
            <div className="flex-1 flex flex-col">
              <div className="bg-[#20003b] text-white px-8 py-2.5 flex items-center justify-between border-b-2 border-pink-500">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏏</span>
                  <span className="text-2xl font-black uppercase">{battingTeam.fullName || battingTeam.shortName}</span>
                </div>
                <div className="bg-[#e91e63] text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">{matchDetails.stage || 'MATCH NO- 1'} | NORMAL</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black uppercase opacity-90">{bowlingTeam.fullName || bowlingTeam.shortName}</span>
                  <span className="text-xl">⚾</span>
                </div>
              </div>
              <div className="px-8 py-2 bg-[#e91e63] text-white flex items-center justify-between text-xs font-black uppercase tracking-wider">
                <span className="w-48">BOWLER</span>
                <div className="grid grid-cols-5 gap-6 text-center w-[500px]">
                  <span>DOT BALLS</span>
                  <span>OVERS</span>
                  <span>RUNS</span>
                  <span>WICKETS</span>
                  <span>ECONOMY</span>
                </div>
              </div>
              <div className="p-4 space-y-1.5 flex-1 bg-white min-h-[220px]">
                {bowlingTeam.bowlers.map((bw) => {
                  const totalBwBalls = bw.overs * 6 + bw.ballsInCurrentOver;
                  const eco = totalBwBalls > 0 ? ((bw.runsConceded / totalBwBalls) * 6).toFixed(2) : '0.00';
                  const dotBalls = Math.max(0, totalBwBalls - Math.floor(bw.runsConceded / 2));
                  return (
                    <div key={bw.id} className="bg-white px-6 py-2.5 rounded-sm flex items-center justify-between font-black text-sm text-[#20003b] shadow-sm border-b border-slate-100">
                      <span className="uppercase tracking-wide w-48 truncate font-black text-base">{bw.name}</span>
                      <div className="grid grid-cols-5 gap-6 text-center w-[500px] font-black text-base">
                        <span>{dotBalls}</span>
                        <span>{bw.overs}.{bw.ballsInCurrentOver}</span>
                        <span>{bw.runsConceded}</span>
                        <span className="text-rose-600 font-black">{bw.wickets}</span>
                        <span>{eco}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-[#e91e63] text-white px-8 py-1.5 flex items-center gap-8 text-xs font-black uppercase">
                <span className="w-36">FALL OF WICKETS</span>
                <div className="flex items-center gap-10 font-black">
                  {[1, 2, 3, 4, 5].map((w) => <span key={w}>{w}</span>)}
                </div>
              </div>
              <div className="bg-slate-100 text-[#20003b] px-8 py-1.5 flex items-center gap-8 text-sm font-black uppercase">
                <span className="w-36">SCORE</span>
                <div className="flex items-center gap-10 font-black">
                  {fowList.length > 0 ? (
                    fowList.slice(0, 5).map((fow, idx) => <span key={idx}>{fow.score}</span>)
                  ) : (
                    <span>{battingTeam.score}</span>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-400 via-sky-400 to-[#ffd700] p-0.5 flex items-stretch">
                <div className="bg-pink-500 text-white px-6 py-2 font-black text-sm uppercase flex items-center">EXTRAS {totalExtras}</div>
                <div className="bg-sky-600 text-white px-8 py-2 font-black text-sm uppercase flex-1 flex items-center justify-center">OVERS {battingTeam.overs}.{battingTeam.balls}</div>
                <div className="bg-[#ffd700] text-slate-950 px-10 py-2 font-black text-2xl uppercase flex items-center shadow-md">{battingTeam.score} - {battingTeam.wickets}</div>
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
          <span className="text-2xl font-black uppercase tracking-wider">{battingTeam.fullName}</span>
          <div className="text-center font-extrabold text-xs uppercase tracking-widest text-slate-300">
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'BOWLING CARD'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80">{bowlingTeam.fullName}</span>
        </div>
        <div className="px-8 py-2 bg-purple-900 text-white flex items-center justify-between text-xs font-black uppercase tracking-wider border-b border-purple-700">
          <span className="w-48">BOWLER</span>
          <div className="grid grid-cols-5 gap-6 text-center w-[500px]">
            <span>DOT BALLS</span>
            <span>OVERS</span>
            <span>RUNS</span>
            <span>WICKETS</span>
            <span>ECONOMY</span>
          </div>
        </div>
        <div className="p-4 bg-slate-900 space-y-1.5 min-h-[220px]">
          {bowlingTeam.bowlers.map((bw) => {
            const eco = bw.overs > 0 ? (bw.runsConceded / bw.overs).toFixed(2) : '0.00';
            const dotBalls = Math.max(0, bw.overs * 6 - Math.floor(bw.runsConceded / 2));
            return (
              <div
                key={bw.id}
                className="bg-white px-6 py-2.5 rounded flex items-center justify-between font-black text-sm text-slate-950 shadow-sm border border-slate-200"
              >
                <span className="uppercase tracking-wide w-48 truncate font-extrabold">{bw.name}</span>
                <div className="grid grid-cols-5 gap-6 text-center w-[500px] font-black text-sm text-slate-950">
                  <span>{dotBalls}</span>
                  <span>{bw.overs}.{bw.ballsInCurrentOver}</span>
                  <span>{bw.runsConceded}</span>
                  <span className="text-rose-600 font-black">{bw.wickets}</span>
                  <span>{eco}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-slate-950 p-4 border-t border-purple-800/60 space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-rose-600 text-white px-4 py-1 rounded text-xs font-black uppercase w-44 text-center shadow">
              FALL OF WICKETS
            </span>
            {fowList.length > 0 ? (
              fowList.map((fow: { score: number }, idx: number) => (
                <span key={idx} className="bg-slate-800 text-white px-3 py-1 rounded text-xs font-black">
                  {idx + 1} ({fow.score})
                </span>
              ))
            ) : (
              <span className="text-slate-400 text-xs font-bold italic">No wickets fallen</span>
            )}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="bg-gradient-to-r from-purple-400 via-cyan-400 to-sky-400 px-8 py-3 flex items-center justify-between font-black text-slate-950 text-sm uppercase">
          <div className="flex items-center gap-8">
            <span>EXTRAS: <strong className="text-purple-950 text-lg ml-1">{totalExtras}</strong></span>
            <span>OVERS: <strong className="text-purple-950 text-lg ml-1">{battingTeam.overs}.{battingTeam.balls}</strong></span>
            <span>CRR: <strong className="text-purple-950 text-lg ml-1">{crr}</strong></span>
          </div>

          <div className="bg-amber-400 text-slate-950 px-8 py-1.5 rounded-lg text-2xl font-black tracking-tight shadow-lg border border-amber-300">
            {battingTeam.score} - {battingTeam.wickets}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
