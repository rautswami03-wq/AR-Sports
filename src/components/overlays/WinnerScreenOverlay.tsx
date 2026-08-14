import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';

export const WinnerScreenOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails, tournamentId } = useBroadcastStore();
  const winnerTeam = matchDetails.winnerTeamId === teamB.id ? teamB : teamA;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  if (layoutStyle === 'super-fission') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/70 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-[900px] bg-[#09093b] rounded-3xl border-2 border-[#00ff22] shadow-2xl p-8 text-center text-white"
        >
          <div className="bg-[#00ff22] text-[#09093b] font-black text-xl py-2 px-8 rounded-full inline-block uppercase tracking-wider mb-6">
            SUPER FISSION | {matchDetails.stage || 'FINAL'} | {matchDetails.title || 'MATCH 1'}
          </div>

          <div className="flex items-center justify-around my-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black uppercase text-[#00ff22]">{teamA.fullName}</span>
              <span className="text-5xl font-black text-white mt-2">{teamA.score} - {teamA.wickets}</span>
              <span className="text-sm text-slate-300 font-bold mt-1">({teamA.overs}.{teamA.balls} OVERS)</span>
            </div>
            <span className="text-4xl font-black text-[#00ff22]">VS</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black uppercase text-[#00ff22]">{teamB.fullName}</span>
              <span className="text-5xl font-black text-white mt-2">{teamB.score} - {teamB.wickets}</span>
              <span className="text-sm text-slate-300 font-bold mt-1">({teamB.overs}.{teamB.balls} OVERS)</span>
            </div>
          </div>

          <div className="bg-[#00ff22] text-[#09093b] font-black text-2xl py-4 rounded-2xl uppercase tracking-widest shadow-xl">
            {matchDetails.winnerMargin || `${winnerTeam.fullName.toUpperCase()} WON THE MATCH!`}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <FullCardBase
      title="MATCH WINNER CHAMPIONS"
      subtitle={matchDetails.stage}
      tournament={matchDetails.tournament}
    >
      <div className="flex flex-col items-center py-8">
        <div className="animate-bounce mb-3">
          <TeamBadge shortName={winnerTeam.shortName} primaryColor={winnerTeam.primaryColor} size="xl" />
        </div>
        <h2 className="text-amber-400 text-4xl font-black uppercase tracking-widest text-broadcast-gold">
          {winnerTeam.fullName}
        </h2>
        <div className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500/30 via-amber-400/40 to-amber-500/30 border border-amber-400/60 rounded-xl">
          <span className="text-white text-xl font-bold uppercase tracking-wide">
            {matchDetails.winnerMargin || `${winnerTeam.fullName} WINS THE MATCH!`}
          </span>
        </div>
      </div>
    </FullCardBase>
  );
};

