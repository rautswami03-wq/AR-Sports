import React from 'react';
import { LowerThirdBase } from './base/LowerThirdBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface BatterLowerThirdProps {
  className?: string;
  batterId?: string;
}

export const BatterLowerThird: React.FC<BatterLowerThirdProps> = ({
  className = '',
  batterId,
}) => {
  const { teamA, teamB, battingTeamId } = useBroadcastStore();

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;

  const batter =
    (batterId ? battingTeam.batters.find((b) => b.id === batterId) : null) ||
    battingTeam.batters.find((b) => b.isStriker) ||
    battingTeam.batters[0] || {
      id: 'b1',
      name: 'BATTER',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
    };

  const runs = batter.runs || 0;
  const balls = batter.balls || 0;
  const fours = batter.fours || 0;
  const sixes = batter.sixes || 0;

  // Approximate dots if not explicitly provided
  const dots = Math.max(0, balls - (fours + sixes + Math.max(0, Math.floor((runs - (fours * 4 + sixes * 6)) / 1))));
  const strikeRate = balls > 0 ? ((runs / balls) * 100).toFixed(2) : '0.00';

  const teamColor = battingTeam.primaryColor || '#004BA0';

  return (
    <LowerThirdBase
      teamColor={teamColor}
      teamLogo={battingTeam.logoUrl}
      teamName={battingTeam.fullName || battingTeam.shortName}
      playerName={batter.name}
      playerRole="BATTER"
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

          {/* FOURS Block (Blue) */}
          <div className="flex flex-col items-center justify-center min-w-[85px] px-3 py-1.5 bg-[#0077B6] text-white rounded-lg shadow-md border border-cyan-400">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90">
              FOURS
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{fours}</span>
          </div>

          {/* SIXES Block (Blue) */}
          <div className="flex flex-col items-center justify-center min-w-[85px] px-3 py-1.5 bg-[#0077B6] text-white rounded-lg shadow-md border border-cyan-400">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90">
              SIXES
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{sixes}</span>
          </div>

          {/* STRIKE RATE Block (Yellow) */}
          <div className="flex flex-col items-center justify-center min-w-[110px] px-3 py-1.5 bg-[#FFDC35] text-slate-950 rounded-lg shadow-md border border-amber-300">
            <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-80">
              STRIKE RATE
            </span>
            <span className="text-xl font-black leading-none mt-0.5">{strikeRate}</span>
          </div>
        </div>
      }
    >
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-2xl font-black text-[#FFDC35] leading-none">
          {runs}
        </span>
        <span className="text-sm font-semibold text-slate-300">
          ({balls} BALLS)
        </span>
      </div>
    </LowerThirdBase>
  );
};

