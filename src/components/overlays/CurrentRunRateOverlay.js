import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
export const CurrentRunRateOverlay = () => {
    const { teamA, teamB, battingTeamId } = useBroadcastStore();
    const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
    const totalBalls = battingTeam.overs * 6 + battingTeam.balls;
    const crr = totalBalls > 0 ? ((battingTeam.score / totalBalls) * 6).toFixed(2) : '0.00';
    const projectedScore = (parseFloat(crr) * 20).toFixed(0);
    return (_jsx(LowerThirdBase, { title: "RUN RATE & PROJECTED SCORE", subtitle: battingTeam.fullName, category: "RUN RATE", primaryColor: battingTeam.primaryColor, children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { children: [_jsx("span", { className: "text-slate-400 text-xs font-semibold block uppercase", children: "CURRENT RUN RATE" }), _jsx("span", { className: "text-sky-400 font-black text-3xl", children: crr })] }), _jsx("div", { className: "h-10 w-[1px] bg-white/10" }), _jsxs("div", { children: [_jsx("span", { className: "text-slate-400 text-xs font-semibold block uppercase", children: "PROJECTED (20 OVERS)" }), _jsxs("span", { className: "text-amber-400 font-black text-3xl", children: [projectedScore, " RUNS"] })] })] }) }) }));
};
