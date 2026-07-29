import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const WicketModal = ({ isOpen, onClose }) => {
    const { teamA, teamB, battingTeamId, addWicket, updateBatterStats } = useBroadcastStore();
    const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
    const battingTeam = isTeamA ? teamA : teamB;
    const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
    const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];
    const [outBatterId, setOutBatterId] = useState(striker?.id || '');
    const [dismissalType, setDismissalType] = useState('BOWLED');
    const [nextBatterName, setNextBatterName] = useState('');
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        addWicket(dismissalType);
        if (nextBatterName.trim()) {
            const incomingBatter = battingTeam.batters.find((b) => b.isStriker);
            if (incomingBatter) {
                updateBatterStats(incomingBatter.id, { name: nextBatterName.trim() });
            }
        }
        setNextBatterName('');
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md bg-gradient-to-b from-rose-500 via-red-600 to-rose-800 rounded-3xl shadow-2xl p-6 text-white border-2 border-rose-200 text-center font-sans", children: [_jsx("h2", { className: "text-xl font-black uppercase tracking-wider mb-4 drop-shadow text-white", children: "WICKET / DISMISSAL" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-left", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-rose-100", children: "Out Batter:" }), _jsxs("select", { value: outBatterId, onChange: (e) => setOutBatterId(e.target.value), className: "w-full px-4 py-2 text-slate-950 font-bold bg-white rounded-xl text-sm", children: [striker && _jsxs("option", { value: striker.id, children: ["STRIKER: ", striker.name] }), nonStriker && _jsxs("option", { value: nonStriker.id, children: ["NON-STRIKER: ", nonStriker.name] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-rose-100", children: "Dismissal Type:" }), _jsxs("select", { value: dismissalType, onChange: (e) => setDismissalType(e.target.value), className: "w-full px-4 py-2 text-slate-950 font-bold bg-white rounded-xl text-sm", children: [_jsx("option", { value: "BOWLED", children: "Bowled" }), _jsx("option", { value: "CAUGHT", children: "Caught" }), _jsx("option", { value: "LBW", children: "LBW" }), _jsx("option", { value: "RUN_OUT", children: "Run Out" }), _jsx("option", { value: "STUMPED", children: "Stumped" }), _jsx("option", { value: "OTHER", children: "Other / Hit Wicket" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black uppercase mb-1 text-rose-100", children: "Next Incoming Batter Name:" }), _jsx("input", { type: "text", placeholder: "Enter new batter name", value: nextBatterName, onChange: (e) => setNextBatterName(e.target.value), className: "w-full px-4 py-2 text-slate-950 font-bold bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" })] }), _jsxs("div", { className: "flex items-center justify-center gap-4 pt-4", children: [_jsx("button", { type: "submit", className: "bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all", children: "Confirm Wicket" }), _jsx("button", { type: "button", onClick: onClose, className: "bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all", children: "Cancel" })] })] })] }) }));
};
