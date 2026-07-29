import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';
export const BattingLowerThird = () => {
    const { teamA, teamB, battingTeamId } = useBroadcastStore();
    const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
    const battingTeam = isTeamA ? teamA : teamB;
    const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
    if (!striker)
        return null;
    const sr = striker.balls > 0 ? ((striker.runs / striker.balls) * 100).toFixed(1) : '0.0';
    return (_jsxs("div", { className: "fixed bottom-10 left-12 z-40 flex items-end gap-4", children: [striker.avatarUrl ? (_jsx("div", { className: "relative z-10 -mr-6 -mb-2", children: _jsx("img", { src: striker.avatarUrl, alt: striker.name, className: "w-32 h-36 object-cover object-top rounded-2xl border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.8)] bg-slate-900" }) })) : null, _jsx("div", { className: "flex-1", children: _jsx(LowerThirdBase, { title: striker.name, subtitle: `${battingTeam.fullName} • BATTING`, category: "BATTER PERFORMANCE", primaryColor: battingTeam.primaryColor, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-4xl font-black text-amber-400", children: striker.runs }), _jsxs("span", { className: "text-slate-400 font-bold text-sm", children: ["RUNS IN ", striker.balls, " BALLS"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(StatBadge, { label: "4s", value: striker.fours }), _jsx(StatBadge, { label: "6s", value: striker.sixes }), _jsx(StatBadge, { label: "S/R", value: sr, highlight: true })] })] }) }) })] }));
};
