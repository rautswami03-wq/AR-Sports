import React from 'react';
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { resolveThemeFromUrlOrStore, hexToRgba, getContrastTextColor } from '../../theme/presetThemes';
import { AsiaCupLeftFullWings } from '../theme-graphics/AsiaCupGraphics';
import { NavarasaVerticalRibbon } from '../theme-graphics/NavarasaGraphics';

export const MatchSummary: React.FC = () => {
  const { teamA, teamB, matchDetails, tournamentId, battingTeamId } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;

  const theme = resolveThemeFromUrlOrStore(tournamentId, matchDetails.tournament);
  const layoutStyle = theme.layoutStyle || 'pill';

  const battingColor = battingTeam.primaryColor || '#00529B';
  const headerTextColor = getContrastTextColor(battingColor);

  const teamAColor = teamA.primaryColor || '#00529B';
  const teamBColor = teamB.primaryColor || '#FFD700';

  const teamATextColor = getContrastTextColor(teamAColor);
  const teamBTextColor = getContrastTextColor(teamBColor);

  const getWinnerMessage = () => {
    if (matchDetails.winnerMargin) return matchDetails.winnerMargin;
    if (teamA.score > teamB.score) {
      return `${teamA.fullName.toUpperCase()} WON BY ${teamA.score - teamB.score} RUNS`;
    } else if (teamB.score > teamA.score) {
      return `${teamB.fullName.toUpperCase()} WON BY ${10 - teamB.wickets} WICKETS`;
    }
    return `${teamA.fullName.toUpperCase()} vs ${teamB.fullName.toUpperCase()}`;
  };

  if (layoutStyle === 't20-asia-cup') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1160px] shadow-2xl rounded-2xl overflow-hidden bg-white border-2 border-cyan-400 flex items-stretch"
        >
          <div className="w-32 flex-shrink-0 bg-[#000865]">
            <AsiaCupLeftFullWings className="w-full h-full" />
          </div>

          <div className="flex-1 flex flex-col bg-slate-950">
            {/* Top header bar dynamically using battingTeam.primaryColor */}
            <div
              className="px-8 py-4 flex items-center justify-between border-b-2 shadow-md transition-colors"
              style={{
                backgroundColor: battingColor,
                borderColor: battingTeam.accentColor || '#ffc72c',
                color: headerTextColor,
              }}
            >
              <div>
                <h2 className="text-3xl font-black uppercase tracking-wide font-headers" style={{ color: headerTextColor }}>
                  {teamA.fullName || teamA.shortName} vs {teamB.fullName || teamB.shortName}
                </h2>
                <p
                  className="text-sm font-bold uppercase mt-0.5 tracking-wider font-headers"
                  style={{ color: headerTextColor === '#000000' ? '#334155' : '#cbd5e1' }}
                >
                  {matchDetails.tournament || 'CRICSCORER WORLD CUP'}: {matchDetails.stage || 'MATCH 2, GROUP STAGE'}
                </p>
              </div>
              <div
                className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider font-headers shadow"
                style={{
                  backgroundColor: headerTextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
                  color: headerTextColor,
                }}
              >
                MATCH SUMMARY
              </div>
            </div>

            <div className="p-6 bg-slate-900 grid grid-cols-2 gap-6 flex-1 min-h-[340px]">
              {/* Team A Card */}
              <div
                className="rounded-lg border shadow overflow-hidden flex flex-col justify-between"
                style={{
                  borderColor: hexToRgba(teamAColor, 0.4),
                  backgroundColor: hexToRgba(teamAColor, 0.05),
                }}
              >
                <div>
                  <div
                    className="px-4 py-2.5 flex items-center justify-between font-black text-lg uppercase font-headers shadow"
                    style={{
                      backgroundColor: teamAColor,
                      color: teamATextColor,
                    }}
                  >
                    <span>{teamA.fullName}</span>
                    <span className="font-numbers">{teamA.score} - {teamA.wickets} ({teamA.overs}.{teamA.balls})</span>
                  </div>
                  <div className="p-4 space-y-1.5 text-xs font-black">
                    {teamA.batters.slice(0, 4).map((b, idx) => (
                      <div
                        key={b.id}
                        className="px-3 py-2 rounded flex justify-between items-center text-white font-headers shadow-sm"
                        style={{
                          backgroundColor: hexToRgba(teamAColor, idx % 2 === 0 ? 0.10 : 0.15),
                          borderLeft: `4px solid ${teamAColor}`,
                        }}
                      >
                        <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                        <span className="text-base font-black font-numbers">
                          {b.runs} <span className="text-slate-400 text-xs font-normal">({b.balls})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 pt-2 border-t border-white/10 text-xs font-black space-y-1">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase font-headers">OPPOSITION BOWLING</span>
                  {teamB.bowlers.slice(0, 2).map((bw, idx) => (
                    <div
                      key={bw.id}
                      className="px-3 py-1.5 rounded flex justify-between items-center text-white shadow-sm"
                      style={{
                        backgroundColor: hexToRgba(teamBColor, idx % 2 === 0 ? 0.10 : 0.15),
                        borderLeft: `4px solid ${teamBColor}`,
                      }}
                    >
                      <span className="uppercase truncate max-w-[130px] font-headers">{bw.name}</span>
                      <span className="font-numbers">{bw.wickets} - {bw.runsConceded} ({bw.overs}.{bw.ballsInCurrentOver})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team B Card */}
              <div
                className="rounded-lg border shadow overflow-hidden flex flex-col justify-between"
                style={{
                  borderColor: hexToRgba(teamBColor, 0.4),
                  backgroundColor: hexToRgba(teamBColor, 0.05),
                }}
              >
                <div>
                  <div
                    className="px-4 py-2.5 flex items-center justify-between font-black text-lg uppercase font-headers shadow"
                    style={{
                      backgroundColor: teamBColor,
                      color: teamBTextColor,
                    }}
                  >
                    <span>{teamB.fullName}</span>
                    <span className="font-numbers">{teamB.score} - {teamB.wickets} ({teamB.overs}.{teamB.balls})</span>
                  </div>
                  <div className="p-4 space-y-1.5 text-xs font-black">
                    {teamB.batters.slice(0, 4).map((b, idx) => (
                      <div
                        key={b.id}
                        className="px-3 py-2 rounded flex justify-between items-center text-white font-headers shadow-sm"
                        style={{
                          backgroundColor: hexToRgba(teamBColor, idx % 2 === 0 ? 0.10 : 0.15),
                          borderLeft: `4px solid ${teamBColor}`,
                        }}
                      >
                        <span className="uppercase truncate max-w-[150px]">{b.name}</span>
                        <span className="text-base font-black font-numbers">
                          {b.runs} <span className="text-slate-400 text-xs font-normal">({b.balls})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 pt-2 border-t border-white/10 text-xs font-black space-y-1">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase font-headers">OPPOSITION BOWLING</span>
                  {teamA.bowlers.slice(0, 2).map((bw, idx) => (
                    <div
                      key={bw.id}
                      className="px-3 py-1.5 rounded flex justify-between items-center text-white shadow-sm"
                      style={{
                        backgroundColor: hexToRgba(teamAColor, idx % 2 === 0 ? 0.10 : 0.15),
                        borderLeft: `4px solid ${teamAColor}`,
                      }}
                    >
                      <span className="uppercase truncate max-w-[130px] font-headers">{bw.name}</span>
                      <span className="font-numbers">{bw.wickets} - {bw.runsConceded} ({bw.overs}.{bw.ballsInCurrentOver})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#00d4ff] text-[#20003b] py-2.5 text-center font-black text-xl uppercase tracking-wider font-headers">
              {getWinnerMessage()}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (layoutStyle === 'icc-navarasa' || layoutStyle === 'crickpro-elite') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/60 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="w-[1140px] shadow-2xl rounded-2xl overflow-hidden border-2 border-pink-500/70 flex flex-col relative"
          style={{ background: 'rgba(11, 27, 61, 0.95)' }}
        >
          {/* Top Header Tab dynamically using battingTeam.primaryColor */}
          <div
            className="font-black text-sm py-1.5 text-center uppercase tracking-widest font-headers transition-colors"
            style={{
              backgroundColor: battingColor,
              color: headerTextColor,
            }}
          >
            {matchDetails.tournament || 'ICC WORLD CUP'} — MATCH SUMMARY
          </div>

          <div className="flex-1 flex items-stretch">
            <div className="w-6 flex-shrink-0"><NavarasaVerticalRibbon className="w-full h-full" /></div>
            <div className="flex-1 flex flex-col" style={{ background: 'rgba(7, 16, 38, 0.92)' }}>
              <div
                className="px-8 py-3 flex items-center justify-between border-b-2 shadow-md transition-colors"
                style={{
                  backgroundColor: hexToRgba(battingColor, 0.92),
                  borderColor: battingTeam.accentColor || '#ec4899',
                  color: headerTextColor,
                }}
              >
                <span className="text-2xl font-black uppercase font-headers">{teamA.fullName}</span>
                <span className="text-xs font-black uppercase px-4 py-1 rounded-full bg-pink-600 text-white font-headers">
                  {matchDetails.stage || 'FINAL MATCH'}
                </span>
                <span className="text-2xl font-black uppercase font-headers opacity-90">{teamB.fullName}</span>
              </div>

              <div className="p-6 grid grid-cols-2 gap-6 flex-1 min-h-[320px]">
                {/* Team A */}
                <div
                  className="rounded-lg border p-4 shadow flex flex-col justify-between"
                  style={{
                    borderColor: hexToRgba(teamAColor, 0.4),
                    backgroundColor: hexToRgba(teamAColor, 0.05),
                  }}
                >
                  <div>
                    <div
                      className="px-4 py-2 rounded flex justify-between font-black uppercase mb-3 font-headers shadow"
                      style={{
                        backgroundColor: teamAColor,
                        color: teamATextColor,
                      }}
                    >
                      <span>{teamA.fullName}</span>
                      <span className="font-numbers">{teamA.score} - {teamA.wickets}</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-black">
                      {teamA.batters.slice(0, 4).map((b, idx) => (
                        <div
                          key={b.id}
                          className="px-3 py-1.5 rounded flex justify-between text-white shadow-sm"
                          style={{
                            backgroundColor: hexToRgba(teamAColor, idx % 2 === 0 ? 0.10 : 0.15),
                            borderLeft: `4px solid ${teamAColor}`,
                          }}
                        >
                          <span className="uppercase font-headers">{b.name}</span>
                          <span className="font-numbers text-amber-300">{b.runs} ({b.balls})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-xs font-black space-y-1">
                    {teamB.bowlers.slice(0, 2).map((bw, idx) => (
                      <div
                        key={bw.id}
                        className="px-3 py-1 rounded flex justify-between text-white shadow-sm"
                        style={{
                          backgroundColor: hexToRgba(teamBColor, idx % 2 === 0 ? 0.10 : 0.15),
                          borderLeft: `4px solid ${teamBColor}`,
                        }}
                      >
                        <span className="uppercase font-headers">{bw.name}</span>
                        <span className="font-numbers">{bw.wickets} - {bw.runsConceded}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team B */}
                <div
                  className="rounded-lg border p-4 shadow flex flex-col justify-between"
                  style={{
                    borderColor: hexToRgba(teamBColor, 0.4),
                    backgroundColor: hexToRgba(teamBColor, 0.05),
                  }}
                >
                  <div>
                    <div
                      className="px-4 py-2 rounded flex justify-between font-black uppercase mb-3 font-headers shadow"
                      style={{
                        backgroundColor: teamBColor,
                        color: teamBTextColor,
                      }}
                    >
                      <span>{teamB.fullName}</span>
                      <span className="font-numbers">{teamB.score} - {teamB.wickets}</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-black">
                      {teamB.batters.slice(0, 4).map((b, idx) => (
                        <div
                          key={b.id}
                          className="px-3 py-1.5 rounded flex justify-between text-white shadow-sm"
                          style={{
                            backgroundColor: hexToRgba(teamBColor, idx % 2 === 0 ? 0.10 : 0.15),
                            borderLeft: `4px solid ${teamBColor}`,
                          }}
                        >
                          <span className="uppercase font-headers">{b.name}</span>
                          <span className="font-numbers text-amber-300">{b.runs} ({b.balls})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-xs font-black space-y-1">
                    {teamA.bowlers.slice(0, 2).map((bw, idx) => (
                      <div
                        key={bw.id}
                        className="px-3 py-1 rounded flex justify-between text-white shadow-sm"
                        style={{
                          backgroundColor: hexToRgba(teamAColor, idx % 2 === 0 ? 0.10 : 0.15),
                          borderLeft: `4px solid ${teamAColor}`,
                        }}
                      >
                        <span className="uppercase font-headers">{bw.name}</span>
                        <span className="font-numbers">{bw.wickets} - {bw.runsConceded}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#00d4ff] text-[#20003b] py-2.5 text-center font-black text-xl uppercase tracking-wider font-headers">
                {getWinnerMessage()}
              </div>
            </div>
            <div className="w-6 flex-shrink-0"><NavarasaVerticalRibbon className="w-full h-full" /></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-40 p-6 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="w-[1100px] shadow-2xl rounded-xl overflow-hidden border-2 bg-slate-950 font-sans text-slate-100"
        style={{ borderColor: theme.primaryAccent || '#facc15' }}
      >
        {/* Top Header Banner dynamically uses battingTeam.primaryColor */}
        <div
          className="py-3 px-6 flex items-center justify-between relative shadow-inner transition-colors"
          style={{
            backgroundColor: battingColor,
            color: headerTextColor,
          }}
        >
          <span
            className="px-5 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-md font-headers"
            style={{
              backgroundColor: headerTextColor === '#000000' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.22)',
              color: headerTextColor,
            }}
          >
            {matchDetails.tournament || theme.name}
          </span>
          <h2 className="text-xl font-black uppercase tracking-wider font-headers" style={{ color: headerTextColor }}>
            MATCH SUMMARY
          </h2>
          <span
            className="text-xs font-bold uppercase tracking-wider font-headers"
            style={{ color: headerTextColor === '#000000' ? '#334155' : '#e2e8f0' }}
          >
            {matchDetails.stage || 'MATCH NO- 1'}
          </span>
        </div>

        <div
          className="text-white px-8 py-3.5 flex items-center justify-between border-b-2 border-white/20"
          style={{ background: theme.badgeBg || '#0f172a' }}
        >
          <span className="text-2xl font-black uppercase tracking-wider font-headers">{teamA.fullName}</span>
          <div className="text-center font-extrabold text-xs uppercase tracking-widest text-slate-300 font-headers">
            {matchDetails.stage || 'MATCH NO- 1'} | {matchDetails.title || 'SUMMARY'}
          </div>
          <span className="text-2xl font-black uppercase tracking-wider opacity-80 font-headers">{teamB.fullName}</span>
        </div>

        <div className="p-6 bg-slate-900 grid grid-cols-2 gap-6 min-h-[300px]">
          {/* Team A Column */}
          <div
            className="rounded-lg p-5 border shadow flex flex-col justify-between"
            style={{
              borderColor: hexToRgba(teamAColor, 0.4),
              backgroundColor: hexToRgba(teamAColor, 0.05),
            }}
          >
            <div>
              <div
                className="px-4 py-2.5 rounded flex items-center justify-between font-black text-lg uppercase mb-4 shadow font-headers"
                style={{
                  backgroundColor: teamAColor,
                  color: teamATextColor,
                }}
              >
                <span>{teamA.fullName}</span>
                <span className="text-xl font-black font-numbers">{teamA.score} - {teamA.wickets}</span>
              </div>
              <div className="space-y-2 text-xs font-black">
                {teamA.batters.slice(0, 4).map((b, idx) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center px-3 py-2 rounded text-white shadow-sm"
                    style={{
                      backgroundColor: hexToRgba(teamAColor, idx % 2 === 0 ? 0.10 : 0.15),
                      borderLeft: `4px solid ${teamAColor}`,
                    }}
                  >
                    <span className="uppercase truncate max-w-[150px] font-headers">{b.name}</span>
                    <span className="font-extrabold text-sm font-numbers">
                      {b.runs} <span className="text-slate-400 text-xs">({b.balls})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase block mb-1 font-headers">
                OPPOSITION BOWLING
              </span>
              <div className="space-y-1.5 text-xs font-black">
                {teamB.bowlers.slice(0, 2).map((bw, idx) => (
                  <div
                    key={bw.id}
                    className="flex justify-between items-center px-3 py-1.5 rounded text-white shadow-sm"
                    style={{
                      backgroundColor: hexToRgba(teamBColor, idx % 2 === 0 ? 0.10 : 0.15),
                      borderLeft: `4px solid ${teamBColor}`,
                    }}
                  >
                    <span className="uppercase truncate max-w-[130px] font-headers">{bw.name}</span>
                    <span className="font-extrabold font-numbers">
                      {bw.wickets} - {bw.runsConceded} <span className="text-slate-400 text-[11px]">({bw.overs}.{bw.ballsInCurrentOver})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team B Column */}
          <div
            className="rounded-lg p-5 border shadow flex flex-col justify-between"
            style={{
              borderColor: hexToRgba(teamBColor, 0.4),
              backgroundColor: hexToRgba(teamBColor, 0.05),
            }}
          >
            <div>
              <div
                className="px-4 py-2.5 rounded flex items-center justify-between font-black text-lg uppercase mb-4 shadow font-headers"
                style={{
                  backgroundColor: teamBColor,
                  color: teamBTextColor,
                }}
              >
                <span>{teamB.fullName}</span>
                <span className="text-xl font-black font-numbers">{teamB.score} - {teamB.wickets}</span>
              </div>
              <div className="space-y-2 text-xs font-black">
                {teamB.batters.slice(0, 4).map((b, idx) => (
                  <div
                    key={b.id}
                    className="flex justify-between items-center px-3 py-2 rounded text-white shadow-sm"
                    style={{
                      backgroundColor: hexToRgba(teamBColor, idx % 2 === 0 ? 0.10 : 0.15),
                      borderLeft: `4px solid ${teamBColor}`,
                    }}
                  >
                    <span className="uppercase truncate max-w-[150px] font-headers">{b.name}</span>
                    <span className="font-extrabold text-sm font-numbers">
                      {b.runs} <span className="text-slate-400 text-xs">({b.balls})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase block mb-1 font-headers">
                OPPOSITION BOWLING
              </span>
              <div className="space-y-1.5 text-xs font-black">
                {teamA.bowlers.slice(0, 2).map((bw, idx) => (
                  <div
                    key={bw.id}
                    className="flex justify-between items-center px-3 py-1.5 rounded text-white shadow-sm"
                    style={{
                      backgroundColor: hexToRgba(teamAColor, idx % 2 === 0 ? 0.10 : 0.15),
                      borderLeft: `4px solid ${teamAColor}`,
                    }}
                  >
                    <span className="uppercase truncate max-w-[130px] font-headers">{bw.name}</span>
                    <span className="font-extrabold font-numbers">
                      {bw.wickets} - {bw.runsConceded} <span className="text-slate-400 text-[11px]">({bw.overs}.{bw.ballsInCurrentOver})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-950 px-8 py-3 text-center border-t-2 border-purple-800 font-headers">
          <span className="text-amber-300 font-black text-lg tracking-wider uppercase">
            {getWinnerMessage()}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
