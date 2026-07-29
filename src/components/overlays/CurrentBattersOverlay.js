import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';
export const CurrentBattersOverlay = () => {
    const { teamA, teamB, battingTeamId } = useBroadcastStore();
    const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
    const battingTeam = isTeamA ? teamA : teamB;
    const activeBatters = battingTeam.batters.filter((b) => !b.isOut).slice(0, 2);
    return (_jsx(LowerThirdBase, { title: "CURRENT BATTERS AT THE CREASE", subtitle: battingTeam.fullName, category: "BATTERS", primaryColor: battingTeam.primaryColor, children: _jsx("div", { className: "grid grid-cols-2 gap-4", children: activeBatters.map((b) => {
                const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0';
                return (_jsxs("div", { className: "bg-slate-900/90 p-3 rounded-lg border border-white/10 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-white font-bold text-sm flex items-center gap-1", children: [b.isStriker && _jsx("span", { className: "text-amber-400", children: "\u2605" }), " ", b.name] }), _jsxs("span", { className: "text-amber-400 font-black text-xl block", children: [b.runs, " ", _jsxs("span", { className: "text-slate-400 text-xs", children: ["(", b.balls, "b)"] })] })] }), _jsxs("div", { className: "flex gap-1.5", children: [_jsx(StatBadge, { label: "4s", value: b.fours }), _jsx(StatBadge, { label: "6s", value: b.sixes }), _jsx(StatBadge, { label: "S/R", value: sr, highlight: true })] })] }, b.id));
            }) }) }));
};
