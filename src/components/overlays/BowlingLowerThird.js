import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { LowerThirdBase } from '../common/LowerThirdBase';
import { StatBadge } from '../common/StatBadge';
export const BowlingLowerThird = () => {
    const { teamA, teamB, bowlingTeamId } = useBroadcastStore();
    const bowlingTeam = bowlingTeamId === teamA.id ? teamA : teamB;
    const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];
    if (!currentBowler)
        return null;
    return (_jsx(LowerThirdBase, { title: currentBowler.name, subtitle: `${bowlingTeam.fullName} • BOWLING SPELL`, category: "BOWLER FIGURES", primaryColor: bowlingTeam.primaryColor, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsxs("span", { className: "text-4xl font-black text-sky-400", children: [currentBowler.wickets, "-", currentBowler.runsConceded] }), _jsxs("span", { className: "text-slate-400 font-bold text-sm", children: ["IN ", currentBowler.overs, ".", currentBowler.ballsInCurrentOver, " OVERS"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(StatBadge, { label: "MAIDENS", value: currentBowler.maidens }), _jsx(StatBadge, { label: "ECON", value: currentBowler.economy.toFixed(2), highlight: true })] })] }) }));
};
