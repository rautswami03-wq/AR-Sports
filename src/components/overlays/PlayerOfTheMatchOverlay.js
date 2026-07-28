import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { FullCardBase } from '../common/FullCardBase';
export const PlayerOfTheMatchOverlay = () => {
    const { matchDetails } = useBroadcastStore();
    const potm = matchDetails.playerOfTheMatch;
    if (!potm)
        return null;
    return (_jsx(FullCardBase, { title: "PLAYER OF THE MATCH", subtitle: matchDetails.stage, tournament: matchDetails.tournament, children: _jsxs("div", { className: "flex flex-col items-center py-6", children: [_jsx("div", { className: "w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-black text-3xl text-slate-950 shadow-2xl border-4 border-white/20 mb-4", children: "MVP" }), _jsx("span", { className: "text-amber-400 text-sm font-extrabold uppercase tracking-widest block", children: potm.team }), _jsx("h2", { className: "text-white text-4xl font-black uppercase text-broadcast-gold mt-1", children: potm.name }), _jsx("div", { className: "mt-4 px-6 py-2 bg-slate-900 border border-white/10 rounded-xl text-center", children: _jsx("span", { className: "text-slate-300 font-extrabold text-lg", children: potm.stats }) })] }) }));
};
