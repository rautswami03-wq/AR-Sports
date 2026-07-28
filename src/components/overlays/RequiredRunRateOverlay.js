import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
export const RequiredRunRateOverlay = () => {
    const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();
    const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
    const target = matchDetails.targetRuns || 186;
    const runsNeeded = Math.max(0, target - battingTeam.score);
    const totalRemainingBalls = Math.max(0, matchDetails.totalOvers * 6 - (battingTeam.overs * 6 + battingTeam.balls));
    const rrr = totalRemainingBalls > 0 ? ((runsNeeded / totalRemainingBalls) * 6).toFixed(2) : '0.00';
    return (_jsx(LowerThirdBase, { title: "REQUIRED RUN RATE EQUATION", subtitle: `${battingTeam.fullName} INNINGS 2`, category: "TARGET EQUATION", primaryColor: battingTeam.primaryColor, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400 text-xs font-semibold block", children: "NEED FOR VICTORY" }), _jsxs("span", { className: "text-amber-400 font-black text-3xl", children: [runsNeeded, " RUNS"] }), _jsxs("span", { className: "text-white text-sm font-bold ml-2", children: ["FROM ", totalRemainingBalls, " BALLS"] })] }), _jsxs("div", { className: "bg-slate-900 px-5 py-2.5 rounded-xl border border-white/10 text-right", children: [_jsx("span", { className: "text-slate-400 text-[10px] uppercase font-bold block", children: "REQ RUN RATE" }), _jsx("span", { className: "text-amber-300 font-black text-2xl", children: rrr })] })] }) }));
};
