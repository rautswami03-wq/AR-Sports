import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const CommentatorOverlay = () => {
    const { matchDetails } = useBroadcastStore();
    const customText = matchDetails.customInputText || 'COMMENTATOR: RAKIB HOSSAIN & HARSHA BHOGLE';
    return (_jsx("div", { className: "fixed bottom-12 left-12 z-30 font-sans", children: _jsxs("div", { className: "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/60 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white flex items-center gap-4 min-w-[360px]", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-xl shadow", children: "\uD83C\uDF99\uFE0F" }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-black uppercase text-indigo-400 tracking-widest block", children: "LIVE BROADCAST COMMENTARY" }), _jsx("h4", { className: "text-sm font-black uppercase text-white tracking-wide", children: customText })] })] }) }));
};
