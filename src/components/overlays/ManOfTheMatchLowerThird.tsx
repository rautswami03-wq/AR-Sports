import React from 'react';
import { LowerThirdBase } from './base/LowerThirdBase';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface ManOfTheMatchLowerThirdProps {
  className?: string;
}

export const ManOfTheMatchLowerThird: React.FC<ManOfTheMatchLowerThirdProps> = ({
  className = '',
}) => {
  const { teamA, teamB, matchDetails } = useBroadcastStore();

  const momData = matchDetails.playerOfTheMatch;
  const selectedPlayerId = matchDetails.selectedMomPlayerId;

  // Resolve player if ID or fallback data exists
  let candidatePlayer: { name: string; teamName: string; teamColor: string; logoUrl?: string; batStats?: string; bowlStats?: string } | null = null;

  if (selectedPlayerId) {
    const pA = teamA.batters.find((b) => b.id === selectedPlayerId) || teamA.bowlers.find((bw) => bw.id === selectedPlayerId);
    if (pA) {
      const bat = teamA.batters.find((b) => b.id === selectedPlayerId);
      const bowl = teamA.bowlers.find((b) => b.id === selectedPlayerId);
      candidatePlayer = {
        name: pA.name,
        teamName: teamA.fullName || teamA.shortName,
        teamColor: teamA.primaryColor || '#004BA0',
        logoUrl: teamA.logoUrl,
        batStats: bat ? `${bat.runs} (${bat.balls}) [${bat.fours}x4, ${bat.sixes}x6]` : undefined,
        bowlStats: bowl ? `${bowl.wickets}/${bowl.runsConceded} (${bowl.overs} ov)` : undefined,
      };
    }
    const pB = teamB.batters.find((b) => b.id === selectedPlayerId) || teamB.bowlers.find((bw) => bw.id === selectedPlayerId);
    if (pB) {
      const bat = teamB.batters.find((b) => b.id === selectedPlayerId);
      const bowl = teamB.bowlers.find((b) => b.id === selectedPlayerId);
      candidatePlayer = {
        name: pB.name,
        teamName: teamB.fullName || teamB.shortName,
        teamColor: teamB.primaryColor || '#FFFF00',
        logoUrl: teamB.logoUrl,
        batStats: bat ? `${bat.runs} (${bat.balls}) [${bat.fours}x4, ${bat.sixes}x6]` : undefined,
        bowlStats: bowl ? `${bowl.wickets}/${bowl.runsConceded} (${bowl.overs} ov)` : undefined,
      };
    }
  }

  // Fallback to top striker or matchDetails
  const topStriker = teamA.batters[0] || teamB.batters[0];
  const topBowler = teamA.bowlers[0] || teamB.bowlers[0];

  const name = momData?.name || candidatePlayer?.name || topStriker?.name || 'PLAYER OF THE MATCH';
  const teamName = momData?.team || candidatePlayer?.teamName || teamA.shortName;
  const teamColor = candidatePlayer?.teamColor || teamA.primaryColor || '#004BA0';
  const batStats = candidatePlayer?.batStats || (topStriker ? `${topStriker.runs} Runs (${topStriker.balls}b)` : '45 Runs (22b)');
  const bowlStats = candidatePlayer?.bowlStats || (topBowler ? `${topBowler.wickets} Wkts / ${topBowler.runsConceded} Runs` : '3-18 (4.0)');

  return (
    <LowerThirdBase
      teamColor={teamColor}
      teamLogo={candidatePlayer?.logoUrl || teamA.logoUrl}
      teamName={teamName}
      playerName={name}
      playerRole="AWARD WINNER"
      className={className}
      rightContent={
        <div className="flex items-center gap-3">
          {/* Batting Performance Block (Blue) */}
          <div className="flex flex-col items-center justify-center min-w-[130px] px-3.5 py-1.5 bg-[#0077B6] text-white rounded-lg shadow-md border border-cyan-400">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FFDC35]">
              BATTING
            </span>
            <span className="text-base font-black leading-tight mt-0.5 whitespace-nowrap">
              {batStats}
            </span>
          </div>

          {/* Bowling Performance Block (Yellow) */}
          <div className="flex flex-col items-center justify-center min-w-[130px] px-3.5 py-1.5 bg-[#FFDC35] text-slate-950 rounded-lg shadow-md border border-amber-300">
            <span className="text-[10px] font-black uppercase tracking-wider opacity-85">
              BOWLING
            </span>
            <span className="text-base font-black leading-tight mt-0.5 whitespace-nowrap">
              {bowlStats}
            </span>
          </div>
        </div>
      }
    >
      {/* Glowing MAN OF THE MATCH text */}
      <div className="flex items-center gap-2 mt-0.5">
        <span
          className="text-xs font-black uppercase tracking-widest text-[#FF5A00] drop-shadow-[0_0_12px_#FF5A00]"
          style={{ textShadow: '0 0 10px #FF5A00, 0 0 20px #FFB703' }}
        >
          ★ MAN OF THE MATCH ★
        </span>
      </div>
    </LowerThirdBase>
  );
};

