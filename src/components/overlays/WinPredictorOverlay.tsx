import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';

export const WinPredictorOverlay: React.FC = () => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();

  const isBattingA = battingTeamId === 'teamA' || battingTeamId === teamA.id;
  const battingTeam = isBattingA ? teamA : teamB;
  const bowlingTeam = isBattingA ? teamB : teamA;

  // Calculate live win probability algorithm
  let winProbA = 50;
  let winProbB = 50;

  if (matchDetails.currentInnings === 1) {
    const oversDone = battingTeam.overs + battingTeam.balls / 6;
    const crr = oversDone > 0 ? battingTeam.score / oversDone : 6.0;
    const projectedScore = Math.round(crr * matchDetails.totalOvers);
    const wicketsLost = battingTeam.wickets;

    // First innings win calculation base on projected vs benchmark (e.g. 160 T20)
    let scoreAdvantage = (projectedScore - 160) * 0.4;
    let wicketPenalty = wicketsLost * 4;
    let rawA = 50 + scoreAdvantage - wicketPenalty;

    winProbA = Math.min(95, Math.max(5, Math.round(rawA)));
    if (!isBattingA) {
      winProbA = 100 - winProbA;
    }
    winProbB = 100 - winProbA;
  } else {
    // Second innings chase calculation
    const target = matchDetails.targetRuns || 170;
    const runsNeeded = Math.max(0, target - battingTeam.score);
    const ballsRemaining = Math.max(0, matchDetails.totalOvers * 6 - (battingTeam.overs * 6 + battingTeam.balls));
    const wicketsRemaining = 10 - battingTeam.wickets;

    if (runsNeeded <= 0) {
      winProbA = isBattingA ? 100 : 0;
      winProbB = 100 - winProbA;
    } else if (ballsRemaining <= 0 || wicketsRemaining <= 0) {
      winProbA = isBattingA ? 0 : 100;
      winProbB = 100 - winProbA;
    } else {
      const rrr = (runsNeeded / ballsRemaining) * 6;
      let rawBattingWin = 50 + (wicketsRemaining * 4) - ((rrr - 7) * 7);
      let batWin = Math.min(98, Math.max(2, Math.round(rawBattingWin)));

      if (isBattingA) {
        winProbA = batWin;
        winProbB = 100 - batWin;
      } else {
        winProbB = batWin;
        winProbA = 100 - batWin;
      }
    }
  }

  return (
    <LowerThirdBase
      title="LIVE WIN PROBABILITY"
      subtitle={`${matchDetails.tournament} • ${matchDetails.stage}`}
      category="IPL / WORLD CUP ANALYTICS"
      primaryColor="#0f172a"
    >
      <div className="space-y-3 py-1">
        {/* Team Names and Percentages */}
        <div className="flex items-center justify-between text-sm font-extrabold tracking-wider">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block shadow-lg"
              style={{ backgroundColor: teamA.primaryColor }}
            />
            <span className="text-white text-base font-black">{teamA.shortName}</span>
            <span className="text-amber-400 font-black text-xl">{winProbA}%</span>
          </div>

          <div className="text-xs uppercase text-slate-400 font-semibold tracking-widest bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            MATCH PREDICTOR
          </div>

          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-black text-xl">{winProbB}%</span>
            <span className="text-white text-base font-black">{teamB.shortName}</span>
            <span
              className="w-3.5 h-3.5 rounded-full inline-block shadow-lg"
              style={{ backgroundColor: teamB.primaryColor }}
            />
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="relative h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner flex">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${winProbA}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${teamA.primaryColor}, ${teamA.secondaryColor || teamA.primaryColor})`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>

          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${winProbB}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full relative overflow-hidden"
            style={{
              background: `linear-gradient(to left, ${teamB.primaryColor}, ${teamB.secondaryColor || teamB.primaryColor})`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>

        {/* Status context */}
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>{teamA.fullName}</span>
          <span className="text-slate-300 font-semibold">
            {matchDetails.currentInnings === 2 ? `Target: ${matchDetails.targetRuns} Runs` : `1st Innings`}
          </span>
          <span>{teamB.fullName}</span>
        </div>
      </div>
    </LowerThirdBase>
  );
};
