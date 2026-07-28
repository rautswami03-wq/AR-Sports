import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const FourAnimation = () => {
    return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.5, y: 100 }, animate: { opacity: 1, scale: 1.1, y: 0 }, exit: { opacity: 0, scale: 1.3, y: -100 }, transition: { type: 'spring', damping: 15, stiffness: 200 }, className: "absolute inset-0 flex items-center justify-center pointer-events-none z-50", children: _jsxs("div", { className: "bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 px-24 py-8 rounded-3xl border-4 border-white shadow-[0_0_80px_rgba(245,158,11,0.8)] transform skew-x-[-12deg] text-center", children: [_jsx("h1", { className: "text-8xl font-black italic uppercase tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]", children: "FOUR!" }), _jsx("span", { className: "text-xl font-extrabold uppercase tracking-widest text-slate-900 block mt-1", children: "BOUNDARY \u2022 4 RUNS" })] }) }));
};
