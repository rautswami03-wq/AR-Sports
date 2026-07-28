import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const MatchWinnerAnimation = () => {
    return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.2 }, className: "absolute inset-0 flex items-center justify-center pointer-events-none z-50", children: _jsxs("div", { className: "bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-slate-950 px-24 py-10 rounded-3xl border-4 border-white shadow-[0_0_120px_rgba(245,158,11,1)] text-center transform skew-x-[-12deg]", children: [_jsx("h1", { className: "text-8xl font-black italic uppercase tracking-tighter drop-shadow-md", children: "VICTORY CELEBRATION!" }), _jsx("span", { className: "text-2xl font-black uppercase tracking-widest text-slate-900 block mt-2", children: "MATCH WINNER DECLARED" })] }) }));
};
