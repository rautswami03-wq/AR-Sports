import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';
export const WinnerScreenOverlay = () => {
    const { teamA, teamB, matchDetails } = useBroadcastStore();
    const winnerTeam = matchDetails.winnerTeamId === teamB.id ? teamB : teamA;
    return (_jsx(FullCardBase, { title: "MATCH WINNER CHAMPIONS", subtitle: matchDetails.stage, tournament: matchDetails.tournament, children: _jsxs("div", { className: "flex flex-col items-center py-8", children: [_jsx("div", { className: "animate-bounce mb-3", children: _jsx(TeamBadge, { shortName: winnerTeam.shortName, primaryColor: winnerTeam.primaryColor, size: "xl" }) }), _jsx("h2", { className: "text-amber-400 text-4xl font-black uppercase tracking-widest text-broadcast-gold", children: winnerTeam.fullName }), _jsx("div", { className: "mt-4 px-6 py-2 bg-gradient-to-r from-amber-500/30 via-amber-400/40 to-amber-500/30 border border-amber-400/60 rounded-xl", children: _jsx("span", { className: "text-white text-xl font-bold uppercase tracking-wide", children: matchDetails.winnerMargin || `${winnerTeam.fullName} WINS THE MATCH!` }) })] }) }));
};
