import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { TeamBadge } from '../common/TeamBadge';
export const TargetOverlay = () => {
    const { teamA, teamB, matchDetails, battingTeamId } = useBroadcastStore();
    const chasingTeam = battingTeamId === teamA.id ? teamA : teamB;
    const target = matchDetails.targetRuns || 186;
    const reqRrr = (target / 20).toFixed(2);
    return (_jsx(FullCardBase, { title: "TARGET SET FOR 2ND INNINGS", subtitle: `${chasingTeam.fullName} NEED ${target} RUNS`, tournament: matchDetails.tournament, children: _jsxs("div", { className: "flex flex-col items-center py-6", children: [_jsx(TeamBadge, { shortName: chasingTeam.shortName, primaryColor: chasingTeam.primaryColor, size: "xl" }), _jsx("h3", { className: "text-white text-3xl font-black mt-4 uppercase", children: chasingTeam.fullName }), _jsxs("div", { className: "mt-4 bg-amber-500/20 border border-amber-400 px-8 py-3 rounded-2xl text-center", children: [_jsxs("span", { className: "text-amber-300 font-extrabold text-5xl tracking-tight block", children: [target, " RUNS"] }), _jsxs("span", { className: "text-slate-300 text-xs font-bold uppercase tracking-widest mt-1 block", children: ["REQUIRED RUN RATE: ", reqRrr, " RPO (20 OVERS)"] })] })] }) }));
};
