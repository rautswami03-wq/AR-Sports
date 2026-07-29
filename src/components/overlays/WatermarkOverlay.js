import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const WatermarkOverlay = () => {
    const { matchDetails } = useBroadcastStore();
    return (_jsx("div", { className: "fixed top-8 right-8 z-40 font-sans pointer-events-none", children: _jsxs("div", { className: "flex items-center gap-2 bg-slate-950/80 backdrop-blur border border-white/10 px-4 py-2 rounded-xl shadow-2xl opacity-90", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-cyan-400 animate-pulse" }), _jsx("span", { className: "text-xs font-black uppercase text-cyan-300 tracking-wider", children: matchDetails.tournament || 'CRICSCORER PRO LIVE' })] }) }));
};
