import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const NoBallAnimation = () => {
    return (_jsx(motion.div, { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -50 }, className: "absolute top-24 inset-x-0 flex justify-center pointer-events-none z-50", children: _jsx("div", { className: "bg-red-600 text-white px-16 py-4 rounded-2xl border-2 border-white shadow-2xl font-black text-4xl uppercase tracking-wider animate-pulse", children: "NO BALL (+1 RUN)" }) }));
};
