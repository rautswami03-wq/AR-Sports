import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
export const PartnershipOverlay = () => {
    const { matchDetails, teamA, teamB, battingTeamId } = useBroadcastStore();
    const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
    const p = matchDetails.partnership;
    const totalRuns = p.runs || 1;
    const pct1 = Math.round((p.batter1Runs / totalRuns) * 100);
    const pct2 = 100 - pct1;
    return (_jsx(LowerThirdBase, { title: "CURRENT PARTNERSHIP", subtitle: `${p.runs} RUNS IN ${p.balls} BALLS`, category: "PARTNERSHIP", primaryColor: battingTeam.primaryColor, children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between font-extrabold text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-white", children: p.batter1Name }), _jsxs("span", { className: "text-amber-400 font-black", children: [p.batter1Runs, " ", _jsxs("span", { className: "text-slate-400 text-xs font-normal", children: ["(", p.batter1Balls, ")"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-amber-400 font-black", children: [p.batter2Runs, " ", _jsxs("span", { className: "text-slate-400 text-xs font-normal", children: ["(", p.batter2Balls, ")"] })] }), _jsx("span", { className: "text-white", children: p.batter2Name })] })] }), _jsxs("div", { className: "w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-white/10", children: [_jsx("div", { className: "h-full bg-sky-500 transition-all duration-500", style: { width: `${pct1}%` } }), _jsx("div", { className: "h-full bg-amber-500 transition-all duration-500", style: { width: `${pct2}%` } })] })] }) }));
};
