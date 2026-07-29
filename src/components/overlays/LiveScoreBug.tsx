import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { PRESET_TOURNAMENTS } from '../../theme/presetThemes';

export const LiveScoreBug: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  // Resolve active theme from URL query or store
  const hashQuery = typeof window !== 'undefined' ? (window.location.hash.split('?')[1] || window.location.search) : '';
  const params = new URLSearchParams(hashQuery);
  const themeKey = params.get('theme') || tournamentId || 'IPL';
  const theme = PRESET_TOURNAMENTS[themeKey] || PRESET_TOURNAMENTS['IPL'];

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  const oversFormatted = `${battingTeam.overs}/${battingTeam.balls}`;
  const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
  const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(1) : '0.0';

  return (
    <div className="absolute bottom-4 inset-x-4 z-40 flex flex-col items-end">
      {/* Event/Decision Popups above Score Bug */}
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

      {/* 1. Left Team Badge Block */}
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

      {/* 2. Score & Target Box */}
      <div className={`${theme.scoreBugMainBg || 'bg-cyan-400'} px-4 flex flex-col justify-center border-r border-slate-900 min-w-[130px]`}>
        <div className={`font-black text-3xl tracking-tight leading-none ${theme.scoreBugTextColor || 'text-slate-950'}`}>
          {battingTeam.score}-{battingTeam.wickets}
        </div>
        <div className="flex items-center justify-between text-[11px] font-extrabold opacity-80 mt-1">
          <span>{oversFormatted}</span>
          <span>{matchDetails.targetRuns ? `TARGET - ${matchDetails.targetRuns}` : '1st INN'}</span>
        </div>
      </div>

      {/* 3. Batters Box */}
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

      {/* 4. Center Match Status / Result Ticker */}
      <div
        className="flex-1 px-4 flex items-center justify-center border-r border-slate-900 text-center shadow-inner"
        style={{ background: theme.headerGradient }}
      >
        <span className="text-white font-black text-lg tracking-wider uppercase drop-shadow">
          {matchDetails.customInputText || matchDetails.winnerMargin || theme.name || `${battingTeam.fullName.toUpperCase()} OPTED TO BAT`}
        </span>
      </div>

      {/* 5. Bowler Spell Box */}
      <div className={`${theme.scoreBugAccentBg || 'bg-red-600'} px-4 flex flex-col justify-center border-r border-slate-900 min-w-[240px] text-xs font-black text-white`}>
        {currentBowler && (
          <div className="flex items-center justify-between mb-1">
            <span className="truncate uppercase max-w-[130px]">{currentBowler.name}</span>
            <span className="text-amber-300 font-black text-sm">
              {currentBowler.wickets} - {currentBowler.runsConceded} <span className="text-white/80 text-xs">{currentBowler.overs}.{currentBowler.ballsInCurrentOver}</span>
            </span>
          </div>
        )}
        {/* Colored Ball Badges */}
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

      {/* 6. Right Team Badge Block */}
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
