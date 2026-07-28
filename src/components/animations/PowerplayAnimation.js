import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const PowerplayAnimation = () => {
    return (_jsx(motion.div, { initial: { opacity: 0, x: 200 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -200 }, className: "absolute top-24 right-16 z-50 bg-gradient-to-r from-amber-500 to-red-600 text-white px-8 py-3 rounded-xl font-black text-2xl uppercase tracking-wider border-2 border-white shadow-2xl", children: "POWERPLAY 1 (OVERS 1-6)" }));
};
