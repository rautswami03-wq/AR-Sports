import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';
export const BattingLowerThird = () => {
    const { teamA, teamB, battingTeamId } = useBroadcastStore();
    const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
    const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
    if (!striker)
        return null;
    const sr = striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.0';
    return (_jsx(LowerThirdBase, { title: striker.name, subtitle: `${battingTeam.fullName} • BATTING`, category: "BATTER PERFORMANCE", primaryColor: battingTeam.primaryColor, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-4xl font-black text-amber-400", children: striker.runs }), _jsxs("span", { className: "text-slate-400 font-bold text-sm", children: ["RUNS IN ", striker.balls, " BALLS"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(StatBadge, { label: "4s", value: striker.fours }), _jsx(StatBadge, { label: "6s", value: striker.sixes }), _jsx(StatBadge, { label: "S/R", value: sr, highlight: true })] })] }) }));
};
