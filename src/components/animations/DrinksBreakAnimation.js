import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const DrinksBreakAnimation = () => {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, className: "absolute bottom-28 inset-x-0 flex justify-center pointer-events-none z-50", children: _jsx("div", { className: "bg-sky-600 text-white px-12 py-3 rounded-xl border border-white font-black text-2xl uppercase tracking-widest shadow-2xl", children: "DRINKS BREAK" }) }));
};
