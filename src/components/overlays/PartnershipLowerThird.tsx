import React, { useEffect } from 'react';
import { LowerThirdBase } from './base/LowerThirdBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface PartnershipLowerThirdProps {
  className?: string;
  autoHide?: boolean;
  durationMs?: number;
}

export const PartnershipLowerThird: React.FC<PartnershipLowerThirdProps> = ({
  className = '',
  autoHide = true,
  durationMs = 5000,
}) => {
  const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();

  useEffect(() => {
    if (!autoHide) return;
    const timer = setTimeout(() => {
      useBroadcastStore.getState().toggleOverlay('partnership', false);
    }, durationMs);
    return () => clearTimeout(timer);
  }, [autoHide, durationMs]);

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];

  const partnershipData = matchDetails.partnership || {
    runs: (striker?.runs || 0) + (nonStriker?.runs || 0),
    balls: (striker?.balls || 0) + (nonStriker?.balls || 0),
    batter1Name: striker?.name || 'Striker',
    batter1Runs: striker?.runs || 0,
    batter1Balls: striker?.balls || 0,
    batter2Name: nonStriker?.name || 'Non-Striker',
    batter2Runs: nonStriker?.runs || 0,
    batter2Balls: nonStriker?.balls || 0,
  };

  const teamColor = battingTeam.primaryColor || '#004BA0';

  return (
    <LowerThirdBase
      teamColor={teamColor}
      teamLogo={battingTeam.logoUrl}
      teamName={battingTeam.fullName || battingTeam.shortName}
      playerName="PARTNERSHIP"
      playerRole="CURRENT STAND"
      className={className}
      rightContent={
        <div className="flex items-center gap-4">
          {/* Batter 1 Pod */}
          <div className="flex flex-col items-end">
            <span className="text-sm font-black uppercase text-white truncate max-w-[160px]">
              {partnershipData.batter1Name}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#FFDC35] leading-none">
                {partnershipData.batter1Runs}
              </span>
              <span className="text-xs text-slate-300">
                ({partnershipData.batter1Balls}b)
              </span>
            </div>
          </div>

          {/* Center Partnership Badge */}
          <div className="flex flex-col items-center justify-center px-4 py-1.5 bg-[#0077B6] text-white rounded-xl shadow-md border-2 border-cyan-400">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFDC35]">
              RUNS (BALLS)
            </span>
            <span className="text-2xl font-black leading-none mt-0.5 drop-shadow">
              {partnershipData.runs}{' '}
              <span className="text-sm font-semibold opacity-90">
                ({partnershipData.balls})
              </span>
            </span>
          </div>

          {/* Batter 2 Pod */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-black uppercase text-white truncate max-w-[160px]">
              {partnershipData.batter2Name}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-[#FFDC35] leading-none">
                {partnershipData.batter2Runs}
              </span>
              <span className="text-xs text-slate-300">
                ({partnershipData.batter2Balls}b)
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold text-slate-300">
        <span>RUNS: <strong className="text-white">{partnershipData.runs}</strong></span>
        <span>•</span>
        <span>BALLS: <strong className="text-white">{partnershipData.balls}</strong></span>
      </div>
    </LowerThirdBase>
  );
};

