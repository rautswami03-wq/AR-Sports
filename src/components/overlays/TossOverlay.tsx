import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

export const TossOverlay: React.FC = () => {
  const { matchDetails, tournamentId } = useBroadcastStore();

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const accentColor = theme.primaryAccent || '#facc15';

  return (
    <LowerThirdBase
      title="OFFICIAL MATCH TOSS RESULT"
      subtitle={matchDetails.venue}
      category="TOSS UPDATE"
      primaryColor={accentColor}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase block opacity-75">TOSS WINNER</span>
          <span className="font-black text-2xl uppercase tracking-wide" style={{ color: accentColor }}>
            {matchDetails.tossWinner}
          </span>
        </div>
        <div
          className="px-4 py-2 rounded-lg text-right border shadow-sm"
          style={{ borderColor: accentColor }}
        >
          <span className="text-xs font-bold uppercase block opacity-75">DECISION</span>
          <span className="font-black text-lg uppercase">ELECTED TO {matchDetails.tossDecision.toUpperCase()} FIRST</span>
        </div>
      </div>
    </LowerThirdBase>
  );
};
