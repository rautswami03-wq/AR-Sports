import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const ReplayLowerThird = () => {
    return (_jsxs(motion.div, { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 }, className: "absolute top-12 left-16 z-50 flex items-center gap-3 bg-red-600/90 text-white px-5 py-2 rounded-lg font-black text-sm uppercase tracking-widest border border-red-400 shadow-2xl animate-pulse", children: [_jsx("span", { className: "w-3 h-3 rounded-full bg-white animate-ping" }), "ACTION REPLAY"] }));
};
