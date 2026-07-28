import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const SuperOverOverlay = () => {
    const { teamA, teamB, battingTeamId, matchDetails } = useBroadcastStore();
    const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
    const bowlingTeam = battingTeamId === teamA.id ? teamB : teamA;
    return (_jsxs(motion.div, { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 50, opacity: 0 }, transition: { type: 'spring', damping: 22, stiffness: 220 }, className: "absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl bg-gradient-to-r from-red-950 via-slate-950 to-red-950 text-white rounded-2xl border-2 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.5)] overflow-hidden font-sans", children: [_jsx("div", { className: "bg-gradient-to-r from-red-600 via-amber-500 to-red-600 py-1.5 px-4 text-center font-black text-xs uppercase tracking-widest text-slate-950 shadow-md", children: "\uD83D\uDD25 SUPER OVER TIE-BREAKER \u2022 6 BALL DECIDER" }), _jsxs("div", { className: "p-4 flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-red-600 border-2 border-white flex items-center justify-center font-black text-lg text-white shadow-md", children: battingTeam.shortName }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-bold text-slate-400 uppercase block", children: battingTeam.fullName }), _jsxs("div", { className: "text-3xl font-black text-amber-400 tracking-tight", children: [battingTeam.score, " - ", battingTeam.wickets, ' ', _jsxs("span", { className: "text-xs font-bold text-white opacity-80", children: ["(", battingTeam.overs, ".", battingTeam.balls, " / 1.0 OVR)"] })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 bg-black/60 px-4 py-2 rounded-xl border border-white/10", children: [_jsx("span", { className: "text-[10px] font-black text-slate-400 uppercase mr-1", children: "BALLS:" }), [0, 1, 2, 3, 4, 5].map((ballIdx) => {
                                const ballVal = matchDetails.recentBalls[5 - ballIdx];
                                return (_jsx("div", { className: `w-7 h-7 rounded-lg border flex items-center justify-center font-black text-xs shadow ${ballVal === '6'
                                        ? 'bg-purple-600 text-white border-purple-400'
                                        : ballVal === '4'
                                            ? 'bg-blue-600 text-white border-blue-400'
                                            : ballVal === 'W'
                                                ? 'bg-red-600 text-white border-red-400'
                                                : ballVal
                                                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                                                    : 'bg-slate-900 text-slate-600 border-slate-800'}`, children: ballVal || '-' }, ballIdx));
                            })] }), _jsxs("div", { className: "text-right border-l border-white/10 pl-4", children: [_jsx("span", { className: "text-[10px] font-black text-cyan-400 uppercase block", children: "NEED FOR VICTORY" }), _jsx("div", { className: "text-xl font-black text-white", children: matchDetails.targetRuns ? `${matchDetails.targetRuns - battingTeam.score} RUNS` : 'MAXIMIZE RUNS' }), _jsxs("span", { className: "text-[10px] font-bold text-slate-400 uppercase", children: ["VS ", bowlingTeam.fullName] })] })] })] }));
};
