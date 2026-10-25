import React from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';
import { hexToRgba, getContrastTextColor } from '../../theme/presetThemes';

export const PlayingXIOverlay: React.FC = () => {
  const { teamA, teamB, matchDetails, battingTeamId } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA?.id || battingTeamId === teamA?.shortName || battingTeamId === 'teamA' || battingTeamId === teamA?.fullName;
  const battingTeam = isTeamA ? teamA : teamB;

  const teamAColor = teamA.primaryColor || '#00529B';
  const teamBColor = teamB.primaryColor || '#FFD700';

  const teamATextColor = getContrastTextColor(teamAColor);
  const teamBTextColor = getContrastTextColor(teamBColor);

  const getPlayers = (team: typeof teamA) => {
    if (team.playingXI && team.playingXI.length > 0) {
      return team.playingXI.map((name, idx) => {
        const found = team.batters?.find((b) => b.name === name);
        return {
          id: found?.id || `p-${idx}`,
          name,
          avatarUrl: found?.avatarUrl,
          isStriker: found?.isStriker,
        };
      });
    }
    return team.batters || [];
  };

  const playersA = getPlayers(teamA);
  const playersB = getPlayers(teamB);

  return (
    <FullCardBase
      title="OFFICIAL PLAYING XI SQUAD"
      subtitle={matchDetails.stage}
      tournament={matchDetails.tournament}
      headerBg={battingTeam.primaryColor}
    >
      <div className="grid grid-cols-2 gap-8 font-sans">
        {/* Team A Lineup (Left side uses Team A primary color) */}
        <div
          className="rounded-xl overflow-hidden border shadow-xl flex flex-col"
          style={{
            borderColor: hexToRgba(teamAColor, 0.4),
            backgroundColor: hexToRgba(teamAColor, 0.06),
          }}
        >
          {/* Team A Header */}
          <div
            className="px-5 py-3 flex items-center justify-between shadow-md transition-colors"
            style={{
              backgroundColor: teamAColor,
              color: teamATextColor,
            }}
          >
            <div className="flex items-center gap-3">
              <TeamBadge shortName={teamA.shortName} primaryColor={teamA.secondaryColor || teamAColor} size="md" />
              <h3
                className="font-black text-xl uppercase tracking-wide font-headers"
                style={{ color: teamATextColor }}
              >
                {teamA.fullName || teamA.shortName}
              </h3>
            </div>
            <span
              className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider font-headers"
              style={{
                backgroundColor: teamATextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
                color: teamATextColor,
              }}
            >
              PLAYING XI
            </span>
          </div>

          {/* Team A Player Rows */}
          <div className="p-3.5 space-y-1.5 flex-1 min-h-[360px]">
            {playersA.map((player, idx) => {
              const rowBg = hexToRgba(teamAColor, idx % 2 === 0 ? 0.10 : 0.15);
              return (
                <div
                  key={player.id || idx}
                  className="px-4 py-2 rounded flex items-center justify-between font-bold text-sm shadow-sm transition-all"
                  style={{
                    backgroundColor: rowBg,
                    borderLeft: `4px solid ${teamAColor}`,
                    color: '#ffffff',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-black w-6 text-sm font-numbers"
                      style={{ color: teamA.accentColor || teamAColor }}
                    >
                      {idx + 1}.
                    </span>
                    {player.avatarUrl ? (
                      <img
                        src={player.avatarUrl}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-amber-400"
                      />
                    ) : null}
                    <span className="font-black uppercase tracking-wide truncate max-w-[240px]">
                      {player.name}
                    </span>
                  </div>
                  {player.isStriker ? (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      ON CREASE
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Team B Lineup (Right side uses Team B primary color) */}
        <div
          className="rounded-xl overflow-hidden border shadow-xl flex flex-col"
          style={{
            borderColor: hexToRgba(teamBColor, 0.4),
            backgroundColor: hexToRgba(teamBColor, 0.06),
          }}
        >
          {/* Team B Header */}
          <div
            className="px-5 py-3 flex items-center justify-between shadow-md transition-colors"
            style={{
              backgroundColor: teamBColor,
              color: teamBTextColor,
            }}
          >
            <div className="flex items-center gap-3">
              <TeamBadge shortName={teamB.shortName} primaryColor={teamB.secondaryColor || teamBColor} size="md" />
              <h3
                className="font-black text-xl uppercase tracking-wide font-headers"
                style={{ color: teamBTextColor }}
              >
                {teamB.fullName || teamB.shortName}
              </h3>
            </div>
            <span
              className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider font-headers"
              style={{
                backgroundColor: teamBTextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
                color: teamBTextColor,
              }}
            >
              PLAYING XI
            </span>
          </div>

          {/* Team B Player Rows */}
          <div className="p-3.5 space-y-1.5 flex-1 min-h-[360px]">
            {playersB.map((player, idx) => {
              const rowBg = hexToRgba(teamBColor, idx % 2 === 0 ? 0.10 : 0.15);
              return (
                <div
                  key={player.id || idx}
                  className="px-4 py-2 rounded flex items-center justify-between font-bold text-sm shadow-sm transition-all"
                  style={{
                    backgroundColor: rowBg,
                    borderLeft: `4px solid ${teamBColor}`,
                    color: '#ffffff',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-black w-6 text-sm font-numbers"
                      style={{ color: teamB.accentColor || teamBColor }}
                    >
                      {idx + 1}.
                    </span>
                    {player.avatarUrl ? (
                      <img
                        src={player.avatarUrl}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-amber-400"
                      />
                    ) : null}
                    <span className="font-black uppercase tracking-wide truncate max-w-[240px]">
                      {player.name}
                    </span>
                  </div>
                  {player.isStriker ? (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      ON CREASE
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FullCardBase>
  );
};
