import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { StatBadge } from '../common/StatBadge';
export const PlayerStatisticsOverlay = () => {
    const { teamA, battingTeamId } = useBroadcastStore();
    const player = teamA.batters[0];
    return (_jsx(FullCardBase, { title: "PLAYER CAREER STATISTICS", subtitle: "BATTER SPOTLIGHT", children: _jsxs("div", { className: "flex items-center gap-8 py-4", children: [_jsx("div", { className: "w-32 h-32 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-800 flex items-center justify-center font-black text-4xl text-white shadow-xl border-2 border-white/20", children: player.name.substring(0, 2).toUpperCase() }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-amber-400 font-bold text-xs uppercase tracking-widest block", children: "RIGHT HAND BATTER" }), _jsx("h2", { className: "text-white text-3xl font-black", children: player.name })] }), _jsxs("div", { className: "grid grid-cols-4 gap-3", children: [_jsx(StatBadge, { label: "MATCHES", value: "48" }), _jsx(StatBadge, { label: "RUNS", value: "1840", highlight: true }), _jsx(StatBadge, { label: "AVERAGE", value: "46.0" }), _jsx(StatBadge, { label: "STRIKE RATE", value: "158.4", highlight: true })] })] })] }) }));
};
