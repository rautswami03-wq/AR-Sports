import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
export const ManhattanOverlay = () => {
    const { matchDetails, teamA, teamB, battingTeamId } = useBroadcastStore();
    const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
    const battingTeam = isTeamA ? teamA : teamB;
    // Sample Manhattan runs per over
    const sampleOvers = [
        { over: 1, runs: 8, wicket: false },
        { over: 2, runs: 12, wicket: false },
        { over: 3, runs: 4, wicket: true },
        { over: 4, runs: 16, wicket: false },
        { over: 5, runs: 6, wicket: false },
        { over: 6, runs: 14, wicket: true },
        { over: 7, runs: 9, wicket: false },
        { over: 8, runs: 18, wicket: false },
    ];
    return (_jsx(FullCardBase, { title: "MANHATTAN CHART", subtitle: `${battingTeam.fullName} — RUNS PER OVER ANALYSIS`, tournament: matchDetails.tournament, children: _jsxs("div", { className: "py-4 space-y-6", children: [_jsx("div", { className: "flex items-end justify-between gap-3 h-52 px-4 border-b-2 border-slate-700 pb-2", children: sampleOvers.map((item) => (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-1 group", children: [_jsx("span", { className: "text-[10px] font-black text-amber-400 opacity-80", children: item.runs }), _jsx("div", { style: { height: `${(item.runs / 20) * 100}%` }, className: `w-full max-w-[28px] rounded-t-lg shadow-lg relative transition-all ${item.wicket
                                    ? 'bg-gradient-to-t from-red-600 to-rose-500 border-t-2 border-rose-300'
                                    : 'bg-gradient-to-t from-cyan-600 to-sky-400 border-t-2 border-cyan-200'}`, children: item.wicket && (_jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-black text-white bg-red-600 px-1 rounded-full", children: "W" })) }), _jsxs("span", { className: "text-[10px] font-bold text-slate-400 mt-1", children: ["Ov ", item.over] })] }, item.over))) }), _jsxs("div", { className: "flex items-center justify-center gap-6 text-xs font-bold", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-cyan-500 rounded" }), _jsx("span", { className: "text-slate-300", children: "Runs Scored" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 bg-red-600 rounded" }), _jsx("span", { className: "text-slate-300", children: "Wicket Lost in Over" })] })] })] }) }));
};
