import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftCyanWings, AsiaCupRightYellowWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';

export const BattingLowerThird: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;
  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  if (!striker) return null;

  const sr = striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(2) : '0.00';
  const dots = striker.balls - (striker.fours + striker.sixes + Math.max(0, Math.floor((striker.runs - (striker.fours * 4 + striker.sixes * 6)) / 1.5)));

  if (layoutStyle === 't20-asia-cup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-8 left-12 right-12 z-40 h-24 bg-white rounded-xl shadow-2xl border-2 border-cyan-400 overflow-hidden flex items-stretch"
      >
        {/* Left Asia Cup Wing */}
        <div className="w-20 h-full flex-shrink-0">
          <AsiaCupLeftCyanWings className="w-full h-full" />
        </div>

        {/* Center Content */}
        <div className="flex-1 px-4 flex flex-col justify-center font-sans">
          {/* Top Row: Name + Runs + Team Badge */}
          <div className="flex items-center gap-4">
            <h2 className="text-[#000865] font-black text-2xl uppercase tracking-wide">
              {striker.name} <span className="ml-3 text-3xl font-black">{striker.runs}</span> <span className="text-xl font-bold opacity-85">({striker.balls})</span>
            </h2>
            <span className="bg-[#00b4d8] text-white text-xs font-black px-3 py-1 rounded shadow">
              {battingTeam.fullName || battingTeam.shortName}
            </span>
          </div>

          {/* Subtitle Dismissal / Info */}
          {striker.isOut && striker.dismissal ? (
            <div className="text-[#000865] font-bold text-sm">
              {striker.dismissal}
            </div>
          ) : null}

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-[#000865] text-xs font-black uppercase mt-1 tracking-wider">
            <span>FOURS {striker.fours}</span>
            <span>SIXES {striker.sixes}</span>
            <span>DOTS {Math.max(0, dots)}</span>
            <span>STRIKE RATE {sr}</span>
          </div>
        </div>

        {/* Right Section: Fall of Wicket (if out) & Right Wings */}
        {striker.isOut && (
          <div className="px-6 flex flex-col justify-center text-[#000865] font-black text-right border-l border-slate-100">
            <span className="text-xs opacity-75 uppercase">FALL OF WICKET</span>
            <span className="text-2xl">{battingTeam.score} - {battingTeam.wickets}</span>
          </div>
        )}

        <div className="w-20 h-full flex-shrink-0">
          <AsiaCupRightYellowWings className="w-full h-full" />
        </div>
      </motion.div>
    );
  }

  if (layoutStyle === 'super-fission') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-8 left-16 right-16 z-40 bg-[#09093b] rounded-2xl shadow-2xl border-2 border-[#00ff22]/50 p-4 text-white font-sans flex items-center justify-between"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black uppercase tracking-wide">{striker.name}</span>
            <span className="text-2xl font-black text-[#00ff22]">{striker.runs} <span className="text-lg text-white font-bold">({striker.balls})</span></span>
            {striker.isOut && striker.dismissal ? (
              <span className="bg-[#00ff22] text-[#09093b] font-black text-xs px-3 py-1 rounded-full uppercase">
                {striker.dismissal}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-6 text-xs font-black uppercase text-[#00ff22] tracking-wider">
            <span>STRIKE RATE {sr}</span>
            <span>FOURS {striker.fours}</span>
            <span>SIXES {striker.sixes}</span>
          </div>
        </div>

        {striker.isOut && (
          <div className="text-right font-black">
            <span className="text-xs text-slate-300 block uppercase">FALL OF WICKET</span>
            <span className="text-2xl text-[#00ff22]">{battingTeam.score} - {battingTeam.wickets}</span>
          </div>
        )}
      </motion.div>
    );
  }

  if (layoutStyle === 'icc-navarasa') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-8 left-12 right-12 z-40 h-24 bg-white rounded-xl shadow-2xl border-2 border-pink-500 overflow-hidden flex items-stretch font-sans"
      >
        <div className="w-5 h-full flex-shrink-0">
          <NavarasaVerticalRibbon className="w-full h-full" />
        </div>

        <div className="flex-1 px-6 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <h2 className="text-[#20003b] font-black text-2xl uppercase tracking-wide">
              {striker.name} <span className="ml-3 text-3xl font-black text-[#e91e63]">{striker.runs}</span> <span className="text-xl font-bold opacity-75 text-[#20003b]">({striker.balls})</span>
            </h2>
            <span className="bg-[#ffd700] text-slate-950 text-xs font-black px-3 py-1 rounded shadow">
              {battingTeam.fullName || battingTeam.shortName}
            </span>
          </div>
          <div className="flex items-center gap-6 text-[#20003b] text-xs font-black uppercase mt-1 tracking-wider">
            <span>FOURS {striker.fours}</span>
            <span>SIXES {striker.sixes}</span>
            <span>DOTS {Math.max(0, dots)}</span>
            <span>STRIKE RATE {sr}</span>
          </div>
        </div>

        <div className="w-5 h-full flex-shrink-0">
          <NavarasaVerticalRibbon className="w-full h-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed bottom-10 left-12 z-40 flex items-end gap-4">
      {striker.avatarUrl ? (
        <div className="relative z-10 -mr-6 -mb-2">
          <img
            src={striker.avatarUrl}
            alt={striker.name}
            className="w-32 h-36 object-cover object-top rounded-2xl border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.8)] bg-slate-900"
          />
        </div>
      ) : null}

      <div className="flex-1">
        <LowerThirdBase
          title={striker.name}
          subtitle={`${battingTeam.fullName} • BATTING`}
          category="BATTER PERFORMANCE"
          primaryColor={battingTeam.primaryColor}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-400">{striker.runs}</span>
              <span className="text-slate-400 font-bold text-sm">RUNS IN {striker.balls} BALLS</span>
            </div>
            <div className="flex items-center gap-3">
              <StatBadge label="4s" value={striker.fours} />
              <StatBadge label="6s" value={striker.sixes} />
              <StatBadge label="S/R" value={sr} highlight />
            </div>
          </div>
        </LowerThirdBase>
      </div>
    </div>
  );
};

