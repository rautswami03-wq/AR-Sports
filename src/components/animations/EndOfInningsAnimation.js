import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const EndOfInningsAnimation = () => {
    return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "absolute inset-0 flex items-center justify-center pointer-events-none z-50", children: _jsxs("div", { className: "bg-slate-950/95 border-4 border-sky-400 p-10 rounded-3xl text-center shadow-[0_0_100px_rgba(56,189,248,0.8)]", children: [_jsx("h2", { className: "text-sky-400 text-6xl font-black italic uppercase tracking-wider mb-2", children: "END OF INNINGS" }), _jsx("span", { className: "text-white text-xl font-bold uppercase tracking-widest", children: "INNINGS BREAK IN PROGRESS" })] }) }));
};
