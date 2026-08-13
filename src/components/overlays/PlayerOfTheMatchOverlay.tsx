import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { resolveThemeFromUrlOrStore } from '../../theme/presetThemes';

export const PlayerOfTheMatchOverlay: React.FC = () => {
  const { matchDetails, tournamentId } = useBroadcastStore();
  const potm = matchDetails.playerOfTheMatch;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const accentColor = theme.primaryAccent || '#facc15';

  if (!potm) return null;

  return (
    <FullCardBase
      title="PLAYER OF THE MATCH"
      subtitle={matchDetails.stage}
      tournament={matchDetails.tournament}
    >
      <div className="flex flex-col items-center py-6">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center font-black text-3xl text-slate-950 shadow-2xl border-4 border-white/20 mb-4"
          style={{ backgroundColor: accentColor }}
        >
          MVP
        </div>
        <span className="text-sm font-extrabold uppercase tracking-widest block opacity-90" style={{ color: accentColor }}>
          {potm.team}
        </span>
        <h2 className="text-4xl font-black uppercase tracking-wide mt-1 drop-shadow-md">
          {potm.name}
        </h2>
        <div
          className="mt-4 px-6 py-2 border rounded-xl text-center shadow-md"
          style={{ borderColor: accentColor }}
        >
          <span className="font-extrabold text-lg">{potm.stats}</span>
        </div>
      </div>
    </FullCardBase>
  );
};
