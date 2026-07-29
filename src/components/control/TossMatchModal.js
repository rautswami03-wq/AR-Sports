import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const TossMatchModal = ({ isOpen, onClose }) => {
    const { teamA, teamB, matchDetails, updateMatchSettings, updateTeamDetails, updateBatterStats, updateBowlerStats, startNewMatchWithTeams } = useBroadcastStore();
    const [tossWinner, setTossWinner] = useState('teamA');
    const [tossDecision, setTossDecision] = useState('bat');
    const [totalOvers, setTotalOvers] = useState(matchDetails.totalOvers || 20);
    const [strikerName, setStrikerName] = useState(teamA.batters[0]?.name || 'Striker 1');
    const [nonStrikerName, setNonStrikerName] = useState(teamA.batters[1]?.name || 'Striker 2');
    const [bowlerName, setBowlerName] = useState(teamB.bowlers[0]?.name || 'Bowler 1');
    if (!isOpen)
        return null;
    const handleStartMatch = (e) => {
        e.preventDefault();
        const winnerName = tossWinner === 'teamA' ? teamA.fullName : teamB.fullName;
        const decisionText = tossDecision === 'bat' ? 'OPTED TO BAT' : 'OPTED TO BOWL';
        const tossText = `${winnerName.toUpperCase()} WON THE TOSS AND ${decisionText}`;
        // Determine batting & bowling team based on toss winner & decision
        let battingTeamId = tossWinner;
        let bowlingTeamId = tossWinner === 'teamA' ? 'teamB' : 'teamA';
        if (tossDecision === 'bowl') {
            battingTeamId = tossWinner === 'teamA' ? 'teamB' : 'teamA';
            bowlingTeamId = tossWinner;
        }
        useBroadcastStore.setState({
            battingTeamId,
            bowlingTeamId,
        });
        updateMatchSettings({
            tossWinner: winnerName,
            tossDecision,
            matchStatusText: tossText,
            totalOvers,
            currentInnings: 1,
        });
        const battingTeam = battingTeamId === 'teamA' ? teamA : teamB;
        const bowlingTeam = bowlingTeamId === 'teamA' ? teamA : teamB;
        if (battingTeam.batters[0])
            updateBatterStats(battingTeam.batters[0].id, { name: strikerName, isStriker: true });
        if (battingTeam.batters[1])
            updateBatterStats(battingTeam.batters[1].id, { name: nonStrikerName, isStriker: false });
        if (bowlingTeam.bowlers[0])
            updateBowlerStats(bowlingTeam.bowlers[0].id, { name: bowlerName, isCurrent: true });
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-lg bg-gradient-to-b from-cyan-600 via-sky-700 to-blue-900 border-2 border-cyan-300 rounded-3xl shadow-2xl p-6 text-white font-sans", children: [_jsx("h2", { className: "text-2xl font-black uppercase text-center mb-6 tracking-wide drop-shadow text-amber-300", children: "\uD83E\uDE99 TOSS & MATCH INITIALIZATION" }), _jsxs("form", { onSubmit: handleStartMatch, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-cyan-100", children: "Who Won The Toss?" }), _jsxs("select", { value: tossWinner, onChange: (e) => setTossWinner(e.target.value), className: "w-full px-4 py-2.5 bg-slate-950 border border-cyan-400 rounded-xl text-white font-black text-sm focus:outline-none", children: [_jsxs("option", { value: "teamA", children: [teamA.fullName, " (", teamA.shortName, ")"] }), _jsxs("option", { value: "teamB", children: [teamB.fullName, " (", teamB.shortName, ")"] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-cyan-100", children: "Toss Decision:" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("button", { type: "button", onClick: () => setTossDecision('bat'), className: `py-2.5 rounded-xl font-black text-xs uppercase border transition-all ${tossDecision === 'bat'
                                                ? 'bg-amber-400 text-slate-950 border-white shadow-lg'
                                                : 'bg-slate-950 text-slate-300 border-slate-700'}`, children: "\uD83C\uDFCF OPTED TO BAT" }), _jsx("button", { type: "button", onClick: () => setTossDecision('bowl'), className: `py-2.5 rounded-xl font-black text-xs uppercase border transition-all ${tossDecision === 'bowl'
                                                ? 'bg-amber-400 text-slate-950 border-white shadow-lg'
                                                : 'bg-slate-950 text-slate-300 border-slate-700'}`, children: "\u26BE OPTED TO BOWL" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-cyan-100", children: "Total Overs:" }), _jsx("input", { type: "number", min: "1", max: "50", value: totalOvers, onChange: (e) => setTotalOvers(Number(e.target.value)), className: "w-full px-4 py-2 bg-slate-950 border border-cyan-400 rounded-xl text-white font-black text-sm focus:outline-none" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-cyan-400/30", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-black uppercase mb-1 text-cyan-200", children: "Striker (*)" }), _jsx("input", { type: "text", value: strikerName, onChange: (e) => setStrikerName(e.target.value), className: "w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-black uppercase mb-1 text-cyan-200", children: "Non-Striker" }), _jsx("input", { type: "text", value: nonStrikerName, onChange: (e) => setNonStrikerName(e.target.value), className: "w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-black uppercase mb-1 text-cyan-200", children: "Bowler" }), _jsx("input", { type: "text", value: bowlerName, onChange: (e) => setBowlerName(e.target.value), className: "w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs" })] })] }), _jsxs("div", { className: "flex items-center justify-center gap-4 pt-4", children: [_jsx("button", { type: "submit", className: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3 rounded-xl shadow-xl uppercase tracking-wider text-xs active:scale-95 transition-all", children: "START 1ST INNINGS" }), _jsx("button", { type: "button", onClick: onClose, className: "bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-3 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all", children: "Cancel" })] })] })] }) }));
};
