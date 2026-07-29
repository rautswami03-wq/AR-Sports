import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const DecisionOverlay = () => {
    const { matchDetails } = useBroadcastStore();
    const decision = matchDetails.decision;
    if (!decision)
        return null;
    const getConfig = () => {
        switch (decision) {
            case 'PENDING':
                return {
                    title: 'DECISION PENDING',
                    bg: 'from-amber-600 via-yellow-500 to-amber-600',
                    border: 'border-yellow-200',
                    shadow: 'shadow-[0_0_50px_rgba(234,179,8,0.9)]',
                    badgeBg: 'bg-amber-950/90 text-yellow-300',
                    icon: '⏳',
                    animatePulse: true,
                };
            case 'OUT':
                return {
                    title: 'OUT',
                    bg: 'from-red-700 via-rose-600 to-red-700',
                    border: 'border-rose-200',
                    shadow: 'shadow-[0_0_60px_rgba(225,29,72,1)]',
                    badgeBg: 'bg-red-950/90 text-rose-300',
                    icon: '☝️',
                    animatePulse: false,
                };
            case 'NOT OUT':
                return {
                    title: 'NOT OUT',
                    bg: 'from-emerald-600 via-green-500 to-emerald-600',
                    border: 'border-emerald-200',
                    shadow: 'shadow-[0_0_60px_rgba(16,185,129,1)]',
                    badgeBg: 'bg-emerald-950/90 text-green-300',
                    icon: '👍',
                    animatePulse: false,
                };
            default:
                return null;
        }
    };
    const config = getConfig();
    if (!config)
        return null;
    return (_jsx(motion.div, { initial: { opacity: 0, y: 100, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 100, scale: 0.9 }, transition: { type: 'spring', damping: 20, stiffness: 220 }, className: `fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center p-4 bg-gradient-to-r ${config.bg} border-4 ${config.border} rounded-3xl ${config.shadow} min-w-[500px] font-sans`, children: _jsxs("div", { className: `px-12 py-4 rounded-2xl ${config.badgeBg} border border-white/20 flex items-center gap-6 transform skew-x-[-8deg] shadow-2xl`, children: [_jsx("span", { className: "text-4xl animate-bounce", children: config.icon }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-xs font-black uppercase tracking-widest text-slate-300", children: "DRS THIRD UMPIRE" }), _jsx("h2", { className: `text-4xl font-black italic uppercase tracking-wider drop-shadow-md ${config.animatePulse ? 'animate-pulse' : ''}`, children: config.title })] })] }) }));
};
