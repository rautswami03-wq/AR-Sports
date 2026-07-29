import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const ChangeBowlerModal = ({ isOpen, onClose }) => {
    const { teamA, teamB, battingTeamId, changeBowler, updateBowlerStats } = useBroadcastStore();
    const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
    const bowlingTeam = isTeamA ? teamB : teamA;
    const [newBowlerName, setNewBowlerName] = useState('');
    const [selectedBowlerId, setSelectedBowlerId] = useState('');
    if (!isOpen)
        return null;
    const handleSetBowler = (e) => {
        e.preventDefault();
        if (newBowlerName.trim()) {
            changeBowler(newBowlerName.trim());
        }
        else if (selectedBowlerId) {
            const targetBowler = bowlingTeam.bowlers.find((bw) => bw.id === selectedBowlerId);
            if (targetBowler) {
                changeBowler(targetBowler.name);
            }
        }
        setNewBowlerName('');
        setSelectedBowlerId('');
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 rounded-3xl shadow-2xl p-6 text-white border-2 border-cyan-200 text-center font-sans", children: [_jsx("h2", { className: "text-xl font-black uppercase tracking-wider mb-4 drop-shadow text-slate-950", children: "SELECT BOWLER" }), _jsxs("form", { onSubmit: handleSetBowler, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-slate-950", children: "Add New Bowler:" }), _jsx("input", { type: "text", placeholder: "Enter new bowler name", value: newBowlerName, onChange: (e) => setNewBowlerName(e.target.value), className: "w-full px-4 py-2.5 text-slate-950 font-black bg-white rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm" })] }), _jsx("p", { className: "text-xs font-black uppercase text-slate-950 tracking-widest my-1", children: "OR" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-slate-950", children: "Available Bowler:" }), _jsxs("select", { value: selectedBowlerId, onChange: (e) => setSelectedBowlerId(e.target.value), className: "w-full px-4 py-2.5 text-slate-950 font-bold bg-white rounded-xl focus:outline-none text-sm", children: [_jsx("option", { value: "", children: "Choose Bowler" }), bowlingTeam.bowlers.map((bw) => (_jsxs("option", { value: bw.id, children: [bw.name, " \u2014 ", bw.wickets, "-", bw.runsConceded, " (", bw.overs, ".", bw.ballsInCurrentOver, ")"] }, bw.id)))] })] }), _jsxs("div", { className: "flex items-center justify-center gap-4 pt-4", children: [_jsx("button", { type: "submit", className: "bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all", children: "Set Bowler" }), _jsx("button", { type: "button", onClick: onClose, className: "bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all", children: "Cancle" })] })] })] }) }));
};
