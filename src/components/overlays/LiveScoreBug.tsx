import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { PRESET_TOURNAMENTS, resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

export const LiveScoreBug: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  // Resolve active theme deterministically from URL parameters, route path, or active store
  const theme = resolveThemeFromUrlOrStore(tournamentId);




  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  const oversFormatted = `${battingTeam.overs}/${battingTeam.balls}`;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(1) : '0.0';

  if (theme.id === 't20_asia24' || theme.id === 'asia_cup') {
    return (
      <div className="absolute bottom-4 inset-x-4 z-40 flex flex-col items-center">
        {matchDetails.decision && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`px-8 py-1.5 font-black text-lg tracking-widest uppercase rounded-t-lg shadow-2xl border-t border-x border-white/30 mb-1 ${
              matchDetails.decision === 'OUT'
                ? 'bg-red-600 text-white'
                : matchDetails.decision === 'NOT OUT'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-yellow-400 text-slate-950'
            }`}
          >
            {matchDetails.decision}
          </motion.div>
        )}

        {/* Main T20 Emerging Asia Cup Score Bug */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex items-stretch h-[76px] shadow-2xl rounded-2xl overflow-hidden border-2 border-amber-400 font-sans text-slate-900 bg-[#000080]"
        >
          {/* 1. Left Team Block */}
          <div className="bg-white px-5 flex items-center justify-center border-r border-slate-300 font-black text-slate-950 text-xl tracking-tight uppercase w-[200px] shrink-0">
            {battingTeam.fullName}
          </div>

          {/* 2. Center Navy Score Badge */}
          <div className="relative bg-[#000080] text-white px-6 flex flex-col justify-center items-center w-[220px] shrink-0 border-r border-slate-300">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black tracking-tight">{battingTeam.score} - {battingTeam.wickets}</span>
              <span className="text-sm font-extrabold text-cyan-300">{oversFormatted}</span>
            </div>
            <div className="bg-[#00a8ff] text-slate-950 px-4 py-0.5 rounded-full text-[11px] font-black uppercase mt-0.5 tracking-wider shadow">
              {matchDetails.targetRuns ? `TARGET - ${matchDetails.targetRuns}` : `CRR: ${crr}`}
            </div>
          </div>

          {/* 3. Batting Section */}
          <div className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/40 px-5 flex flex-col justify-center border-r border-slate-300 text-xs font-black text-slate-950 min-w-[220px]">
            {striker && (
              <div className="flex items-center justify-between text-slate-950">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-amber-500 font-black">●</span>
                  <span className="truncate uppercase">{striker.name}</span>
                </span>
                <span className="font-extrabold text-sm ml-2">
                  {striker.runs} <span className="text-xs opacity-70 font-bold">{striker.balls}</span>
                </span>
              </div>
            )}
            {nonStriker && (
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span className="truncate uppercase pl-3">{nonStriker.name}</span>
                <span className="text-xs ml-2">
                  {nonStriker.runs} <span className="opacity-70 text-[11px]">{nonStriker.balls}</span>
                </span>
              </div>
            )}
          </div>

          {/* 4. Bowler Section (Canary Yellow #ffcc00) */}
          <div className="flex-1 bg-[#ffcc00] px-5 flex flex-col justify-center border-r border-slate-300 text-slate-950 min-w-[240px]">
            {currentBowler && (
              <div className="flex items-center justify-between font-black text-xs uppercase mb-1">
                <span className="truncate">{currentBowler.name}</span>
                <span className="font-black text-sm">
                  {currentBowler.wickets}-{currentBowler.runsConceded} <span className="text-xs font-bold opacity-80">({currentBowler.overs}.{currentBowler.ballsInCurrentOver})</span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase">
              <span className="text-slate-800 font-extrabold mr-1">OVER</span>
              {matchDetails.recentBalls.slice(0, 6).map((ball, idx) => (
                <span
                  key={idx}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${
                    ball === 'W'
                      ? 'bg-red-600 text-white'
                      : ball === '6' || ball === '4'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-amber-300'
                  }`}
                >
                  {ball}
                </span>
              ))}
            </div>
          </div>

          {/* 5. Right Team Block (Far Right End) */}
          <div className="bg-white px-5 flex items-center justify-center font-black text-slate-950 text-xl tracking-tight uppercase w-[200px] shrink-0">
            {bowlingTeam.fullName}
          </div>
        </motion.div>

        {/* 6. Bottom Ticker Ribbon */}
        <div className="w-full bg-[#000080] text-white px-6 py-1 flex items-center justify-between text-xs font-bold border-t border-cyan-400/40 rounded-b-xl shadow-lg mt-0.5">
          <span className="text-cyan-300 font-extrabold uppercase">
            {matchDetails.tournament || "ACC MEN'S T20 EMERGING ASIA CUP 2024"}
          </span>
          <div className="flex items-center gap-6">
            <span>Fours: <strong className="text-amber-400 font-black">{striker?.fours || 0}</strong></span>
            <span>Sixes: <strong className="text-amber-400 font-black">{striker?.sixes || 0}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 inset-x-4 z-40 flex flex-col items-end">

      {matchDetails.decision && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className={`px-8 py-1.5 font-black text-lg tracking-widest uppercase rounded-t-lg shadow-2xl border-t border-x border-white/30 mr-12 ${
            matchDetails.decision === 'OUT'
              ? 'bg-gradient-to-r from-red-600 to-black text-white'
              : matchDetails.decision === 'NOT OUT'
              ? 'bg-gradient-to-r from-emerald-600 to-black text-white'
              : 'bg-gradient-to-r from-yellow-500 to-black text-slate-950'
          }`}
        >
          {matchDetails.decision}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-full flex items-stretch h-[80px] shadow-2xl rounded-xl overflow-hidden border border-white/30 font-sans text-slate-900"
      >


      <div className={`${theme.scoreBugMainBg || 'bg-cyan-400'} px-5 flex items-center gap-3 border-r border-slate-900 min-w-[200px]`}>
        <div className="w-12 h-12 rounded-full bg-slate-950/20 border-2 border-white/40 flex items-center justify-center font-black text-white text-base shadow-md">
          {battingTeam.shortName}
        </div>
        <div className="flex flex-col leading-tight">
          <span className={`font-black text-sm uppercase tracking-tight ${theme.scoreBugTextColor || 'text-slate-950'}`}>
            {battingTeam.fullName}
          </span>
          <span className="font-bold opacity-80 text-[11px]">
            v {bowlingTeam.shortName}
          </span>
        </div>
      </div>


      <div className={`${theme.scoreBugMainBg || 'bg-cyan-400'} px-4 flex flex-col justify-center border-r border-slate-900 min-w-[130px]`}>
        <div className={`font-black text-3xl tracking-tight leading-none ${theme.scoreBugTextColor || 'text-slate-950'}`}>
          {battingTeam.score}-{battingTeam.wickets}
        </div>
        <div className="flex items-center justify-between text-[11px] font-extrabold opacity-80 mt-1">
          <span>{oversFormatted}</span>
          <span>{matchDetails.targetRuns ? `TARGET - ${matchDetails.targetRuns}` : '1st INN'}</span>
        </div>
      </div>


      <div className={`${theme.scoreBugMainBg || 'bg-cyan-300'} brightness-95 px-4 flex flex-col justify-center border-r border-slate-900 min-w-[260px] text-xs font-black`}>
        {striker && (
          <div className="flex items-center justify-between opacity-95 mb-0.5">
            <span className="truncate flex items-center gap-1.5">
              {striker.avatarUrl ? (
                <img src={striker.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-white/50" />
              ) : (
                <span className="font-black text-sm text-amber-400">&gt;</span>
              )}
              <span className="truncate">{striker.name.toUpperCase()}</span>
            </span>
            <span className="font-black text-sm ml-2">
              {striker.runs} <span className="opacity-75 font-bold text-xs">{striker.balls}</span>
            </span>
          </div>
        )}
        {nonStriker && (
          <div className="flex items-center justify-between opacity-80 font-bold">
            <span className="truncate max-w-[170px] flex items-center gap-1.5 pl-1">
              {nonStriker.avatarUrl && (
                <img src={nonStriker.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-white/30" />
              )}
              <span className="truncate">{nonStriker.name.toUpperCase()}</span>
            </span>
            <span className="text-xs ml-2">
              {nonStriker.runs} <span className="opacity-75 font-bold text-xs">{nonStriker.balls}</span>
            </span>
          </div>
        )}
      </div>


      <div
        className="flex-1 px-4 flex items-center justify-center border-r border-slate-900 text-center shadow-inner"
        style={{ background: theme.headerGradient }}
      >
        <span className="text-white font-black text-lg tracking-wider uppercase drop-shadow">
          {matchDetails.customInputText || matchDetails.winnerMargin || theme.name || `${battingTeam.fullName.toUpperCase()} OPTED TO BAT`}
        </span>
      </div>


      <div className={`${theme.scoreBugAccentBg || 'bg-red-600'} px-4 flex flex-col justify-center border-r border-slate-900 min-w-[240px] text-xs font-black text-white`}>
        {currentBowler && (
          <div className="flex items-center justify-between mb-1">
            <span className="truncate uppercase max-w-[130px]">{currentBowler.name}</span>
            <span className="text-amber-300 font-black text-sm">
              {currentBowler.wickets} - {currentBowler.runsConceded} <span className="text-white/80 text-xs">{currentBowler.overs}.{currentBowler.ballsInCurrentOver}</span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {matchDetails.recentBalls.slice(0, 7).map((ball, idx) => (
            <span
              key={idx}
              className={`w-5 h-5 rounded flex items-center justify-center font-black text-[11px] shadow-sm ${
                ball === '6'
                  ? 'bg-purple-600 text-white'
                  : ball === '4'
                  ? 'bg-blue-600 text-white'
                  : ball === 'W'
                  ? 'bg-amber-400 text-slate-950'
                  : ball.includes('WD') || ball.includes('NB')
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-white text-slate-950'
              }`}
            >
              {ball}
            </span>
          ))}
        </div>
      </div>


      <div className={`${theme.scoreBugAccentBg || 'bg-red-600'} px-5 flex items-center justify-end gap-3 min-w-[200px] text-white`}>
        <div className="flex flex-col text-right leading-tight">
          <span className="font-black text-sm uppercase tracking-tight">
            {bowlingTeam.fullName}
          </span>
          <span className="font-bold text-white/70 text-[11px]">
            BOWLING
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-950/20 border-2 border-white/40 flex items-center justify-center font-black text-white text-base shadow-md">
          {bowlingTeam.shortName}
        </div>
      </div>
    </motion.div>
  </div>

  );
};
