import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';

export const TargetOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails, battingTeamId, tournamentId } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const chasingTeam = isTeamA ? teamA : teamB;
  const defendingTeam = isTeamA ? teamB : teamA;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const target = matchDetails.targetRuns || 20;
  const runsNeed = Math.max(0, target - chasingTeam.score);
  const totalMaxBalls = (matchDetails.totalOvers || 20) * 6;
  const ballsBowled = chasingTeam.overs * 6 + chasingTeam.balls;
  const ballsRemaining = Math.max(0, totalMaxBalls - ballsBowled);
  const reqRrr = (target / (matchDetails.totalOvers || 20)).toFixed(2);

  if (layoutStyle === 't20-asia-cup') {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center font-sans pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="flex flex-col items-center gap-8 pointer-events-auto"
        >
          {/* Dual Cards */}
          <div className="flex items-center gap-12">
            {/* Left Card: NEED X RUNS */}
            <div className="w-72 h-80 bg-[#000865] rounded-3xl flex flex-col justify-between items-center shadow-2xl border-2 border-white/20 p-2">
              <div className="w-full bg-[#ffc72c] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider">
                NEED
              </div>
              <div className="text-white font-black text-8xl tracking-tight my-auto">
                {runsNeed}
              </div>
              <div className="w-full bg-[#ffc72c] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider">
                RUNS
              </div>
            </div>

            {/* Right Card: FROM Y BALLS */}
            <div className="w-72 h-80 bg-[#000865] rounded-3xl flex flex-col justify-between items-center shadow-2xl border-2 border-white/20 p-2">
              <div className="w-full bg-[#00b4d8] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider">
                FROM
              </div>
              <div className="text-white font-black text-8xl tracking-tight my-auto">
                {ballsRemaining}
              </div>
              <div className="w-full bg-[#00b4d8] text-slate-950 font-black text-2xl py-2 rounded-2xl text-center uppercase tracking-wider">
                BALLS
              </div>
            </div>
          </div>

          {/* Bottom Split Team Bar */}
          <div className="w-[1080px] h-16 rounded-md overflow-hidden flex items-stretch shadow-2xl">
            <div className="flex-1 bg-[#00b4d8] text-slate-950 font-black text-2xl uppercase flex items-center justify-center tracking-wide">
              {chasingTeam.fullName || chasingTeam.shortName}
            </div>
            <div className="w-20 bg-white flex items-center justify-center font-black text-2xl text-blue-600 shadow-inner">
              ⚡VS
            </div>
            <div className="flex-1 bg-[#ffc72c] text-slate-950 font-black text-2xl uppercase flex items-center justify-center tracking-wide">
              {defendingTeam.fullName || defendingTeam.shortName}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <FullCardBase
      title="TARGET SET FOR 2ND INNINGS"
      subtitle={`${chasingTeam.fullName} NEED ${target} RUNS`}
      tournament={matchDetails.tournament}
    >
      <div className="flex flex-col items-center py-6">
        <TeamBadge shortName={chasingTeam.shortName} primaryColor={chasingTeam.primaryColor} size="xl" />
        <h3 className="text-white text-3xl font-black mt-4 uppercase">{chasingTeam.fullName}</h3>
        <div className="mt-4 bg-amber-500/20 border border-amber-400 px-8 py-3 rounded-2xl text-center">
          <span className="text-amber-300 font-extrabold text-5xl tracking-tight block">{target} RUNS</span>
          <span className="text-slate-300 text-xs font-bold uppercase tracking-widest mt-1 block">
            REQUIRED RUN RATE: {reqRrr} RPO (20 OVERS)
          </span>
        </div>
      </div>
    </FullCardBase>
  );
};

