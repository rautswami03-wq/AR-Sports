import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
import { StatBadge } from '../common/StatBadge';
export const BowlerStatisticsOverlay = () => {
    const { teamA } = useBroadcastStore();
    const bowler = teamA.bowlers[0];
    return (_jsx(FullCardBase, { title: "BOWLER CAREER STATISTICS", subtitle: "BOWLER SPOTLIGHT", children: _jsxs("div", { className: "flex items-center gap-8 py-4", children: [_jsx("div", { className: "w-32 h-32 rounded-2xl bg-gradient-to-tr from-purple-600 to-slate-800 flex items-center justify-center font-black text-4xl text-white shadow-xl border-2 border-white/20", children: bowler.name.substring(0, 2).toUpperCase() }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-sky-400 font-bold text-xs uppercase tracking-widest block", children: "RIGHT ARM FAST" }), _jsx("h2", { className: "text-white text-3xl font-black", children: bowler.name })] }), _jsxs("div", { className: "grid grid-cols-4 gap-3", children: [_jsx(StatBadge, { label: "MATCHES", value: "52" }), _jsx(StatBadge, { label: "WICKETS", value: "89", highlight: true }), _jsx(StatBadge, { label: "ECONOMY", value: "6.42" }), _jsx(StatBadge, { label: "BEST FIGURES", value: "4/14", highlight: true })] })] })] }) }));
};
