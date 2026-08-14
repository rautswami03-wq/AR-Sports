import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftCyanWings, AsiaCupRightYellowWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';

export const BowlingLowerThird: React.FC = () => {
  const { teamA, teamB, bowlingTeamId, matchDetails, tournamentId } = useBroadcastStore();
  const isTeamA = bowlingTeamId === teamA.id || bowlingTeamId === teamA.shortName || bowlingTeamId === 'teamA' || bowlingTeamId === teamA.fullName;
  const bowlingTeam = isTeamA ? teamA : teamB;
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  if (!currentBowler) return null;

  const totalBalls = currentBowler.overs * 6 + currentBowler.ballsInCurrentOver;
  const dotBalls = Math.max(0, totalBalls - Math.floor(currentBowler.runsConceded / 2));
  const econ = totalBalls > 0 ? ((currentBowler.runsConceded / totalBalls) * 6).toFixed(2) : '0.00';

  if (layoutStyle === 't20-asia-cup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-8 left-12 right-12 z-40 h-24 bg-white rounded-xl shadow-2xl border-2 border-[#ffc72c] overflow-hidden flex items-stretch font-sans"
      >
        {/* Left Asia Cup Yellow Wing */}
        <div className="w-20 h-full flex-shrink-0">
          <AsiaCupRightYellowWings className="w-full h-full rotate-180" />
        </div>

        {/* Center Content */}
        <div className="flex-1 px-4 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <span className="text-[#000865] text-xl font-black">⚾</span>
            <h2 className="text-[#000865] font-black text-2xl uppercase tracking-wide">
              {currentBowler.name}
            </h2>
            <span className="bg-[#ffc72c] text-slate-950 text-xs font-black px-3 py-1 rounded shadow">
              {bowlingTeam.fullName || bowlingTeam.shortName}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-[#000865] text-xs font-black uppercase mt-1 tracking-wider pr-12">
            <div className="flex flex-col items-center">
              <span className="text-[11px] opacity-75">DOT BALLS</span>
              <span className="text-base font-black">{dotBalls}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] opacity-75">OVERS</span>
              <span className="text-base font-black">{currentBowler.overs}.{currentBowler.ballsInCurrentOver}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] opacity-75">RUNS</span>
              <span className="text-base font-black">{currentBowler.runsConceded}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] opacity-75">WICKETS</span>
              <span className="text-base font-black">{currentBowler.wickets}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] opacity-75">ECONOMY</span>
              <span className="text-base font-black">{econ}</span>
            </div>
          </div>
        </div>

        {/* Right Asia Cup Yellow Wing */}
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
            <span className="text-[#00ff22] text-xl">⚾</span>
            <span className="text-2xl font-black uppercase tracking-wide">{currentBowler.name}</span>
            <span className="bg-[#00ff22] text-[#09093b] font-black text-xs px-3 py-1 rounded-full uppercase">
              {bowlingTeam.fullName || bowlingTeam.shortName}
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs font-black uppercase text-[#00ff22] tracking-wider">
            <span>FIGURES: {currentBowler.wickets}-{currentBowler.runsConceded}</span>
            <span>OVERS: {currentBowler.overs}.{currentBowler.ballsInCurrentOver}</span>
            <span>ECON: {econ}</span>
          </div>
        </div>
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
              {currentBowler.name}
            </h2>
            <span className="bg-[#00529b] text-white text-xs font-black px-3 py-1 rounded shadow">
              {bowlingTeam.fullName || bowlingTeam.shortName}
            </span>
          </div>
          <div className="flex items-center gap-8 text-[#20003b] text-xs font-black uppercase mt-1 tracking-wider">
            <span>OVERS: {currentBowler.overs}.{currentBowler.ballsInCurrentOver}</span>
            <span>RUNS: {currentBowler.runsConceded}</span>
            <span>WICKETS: {currentBowler.wickets}</span>
            <span>ECONOMY: {econ}</span>
          </div>
        </div>

        <div className="w-5 h-full flex-shrink-0">
          <NavarasaVerticalRibbon className="w-full h-full" />
        </div>
      </motion.div>
    );
  }

  return (
    <LowerThirdBase
      title={currentBowler.name}
      subtitle={`${bowlingTeam.fullName} • BOWLING SPELL`}
      category="BOWLER FIGURES"
      primaryColor={bowlingTeam.primaryColor}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-sky-400">
            {currentBowler.wickets}-{currentBowler.runsConceded}
          </span>
          <span className="text-slate-400 font-bold text-sm">
            IN {currentBowler.overs}.{currentBowler.ballsInCurrentOver} OVERS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <StatBadge label="MAIDENS" value={currentBowler.maidens} />
          <StatBadge label="ECON" value={currentBowler.economy.toFixed(2)} highlight />
        </div>
      </div>
    </LowerThirdBase>
  );
};

