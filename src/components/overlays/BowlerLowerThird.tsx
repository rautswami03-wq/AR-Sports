import React from 'react';
import { LowerThirdBase } from './base/LowerThirdBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface BowlerLowerThirdProps {
  className?: string;
  bowlerId?: string;
}

export const BowlerLowerThird: React.FC<BowlerLowerThirdProps> = ({
  className = '',
  bowlerId,
}) => {
  const { teamA, teamB, bowlingTeamId, battingTeamId } = useBroadcastStore();

  const isTeamA =
    bowlingTeamId === teamA.id ||
    (!bowlingTeamId && (battingTeamId === teamB.id || battingTeamId === teamB.shortName));
  const bowlingTeam = isTeamA ? teamA : teamB;

  const bowler =
    (bowlerId ? bowlingTeam.bowlers.find((bw) => bw.id === bowlerId) : null) ||
    bowlingTeam.bowlers.find((bw) => bw.isCurrent) ||
    bowlingTeam.bowlers[0] || {
      id: 'bw1',
      name: 'BOWLER',
      overs: 0,
      ballsInCurrentOver: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
    };

  const oversFormatted = `${bowler.overs}.${bowler.ballsInCurrentOver || 0}`;
  const runs = bowler.runsConceded || 0;
  const wickets = bowler.wickets || 0;
  const totalBalls = bowler.overs * 6 + (bowler.ballsInCurrentOver || 0);
  const economy =
    bowler.economy && bowler.economy > 0
      ? bowler.economy.toFixed(2)
      : totalBalls > 0
        ? ((runs / totalBalls) * 6).toFixed(2)
        : '0.00';

  // Approximate dot balls
  const dots = Math.max(0, Math.floor(totalBalls * 0.45));

  const teamColor = bowlingTeam.primaryColor || '#004BA0';

  return (
    <LowerThirdBase
      teamColor={teamColor}
      teamLogo={bowlingTeam.logoUrl}
      teamName={bowlingTeam.fullName || bowlingTeam.shortName}
      playerName={bowler.name}
      playerRole="BOWLER"
      className={className}
      rightContent={
        <div className="flex items-center gap-2">
          {/* DOTS Block (Yellow) */}
          <div className="flex flex-col items-center justify-center min-w-[85px] px-3 py-1.5 bg-[#FFDC35] text-slate-950 rounded-lg shadow-md border border-amber-300">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-80">
              DOTS
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{dots}</span>
          </div>

          {/* OVERS Block (Blue) */}
          <div className="flex flex-col items-center justify-center min-w-[85px] px-3 py-1.5 bg-[#0077B6] text-white rounded-lg shadow-md border border-cyan-400">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90">
              OVERS
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{oversFormatted}</span>
          </div>

          {/* RUNS Block (Yellow) */}
          <div className="flex flex-col items-center justify-center min-w-[85px] px-3 py-1.5 bg-[#FFDC35] text-slate-950 rounded-lg shadow-md border border-amber-300">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-80">
              RUNS
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{runs}</span>
          </div>

          {/* WICKETS Block (Blue) */}
          <div className="flex flex-col items-center justify-center min-w-[85px] px-3 py-1.5 bg-[#0077B6] text-white rounded-lg shadow-md border border-cyan-400">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90">
              WICKETS
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{wickets}</span>
          </div>

          {/* ECONOMY Block (Yellow) */}
          <div className="flex flex-col items-center justify-center min-w-[95px] px-3 py-1.5 bg-[#FFDC35] text-slate-950 rounded-lg shadow-md border border-amber-300">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-80">
              ECONOMY
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{economy}</span>
          </div>
        </div>
      }
    >
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-2xl font-black text-[#FFDC35] leading-none">
          {wickets}-{runs}
        </span>
        <span className="text-sm font-semibold text-slate-300">
          ({oversFormatted} OVERS)
        </span>
      </div>
    </LowerThirdBase>
  );
};

