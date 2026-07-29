import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Link as LinkIcon, Info } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
const DEFAULT_TOURNAMENTS = [
    {
        id: '0d840fa0-a9f4-45c2-990c-a265c4cb4sda',
        name: 'Asthavinayak Premier League',
        teamA: 'ASHTAVINAYAK SUPER KINGS',
        teamB: 'ASHTAVINAYAK INDIANS',
        tossText: 'ASHTAVINAYAK INDIANS WON THE TOSS AND OPTED TO BOWL',
        createdAt: '2026-07-24',
    },
    {
        id: 'tourn_ipl_2026',
        name: 'T20 World Trophy Final 2026',
        teamA: 'INDIA',
        teamB: 'AUSTRALIA',
        tossText: 'AUSTRALIA WON THE TOSS AND OPTED TO BOWL',
        createdAt: '2026-07-24',
    },
];
export const TournamentPage = () => {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('cricscorer_tournaments_v1');
                if (saved)
                    return JSON.parse(saved);
            }
            catch (e) {
                console.warn('Failed to load tournaments:', e);
            }
        }
        return DEFAULT_TOURNAMENTS;
    });
    const saveTournaments = (items) => {
        setTournaments(items);
        if (typeof window !== 'undefined') {
            localStorage.setItem('cricscorer_tournaments_v1', JSON.stringify(items));
        }
    };
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTourName, setNewTourName] = useState('');
    const handleCreateTournament = (e) => {
        e.preventDefault();
        if (!newTourName.trim())
            return;
        const newItem = {
            id: `tourn_${Date.now()}`,
            name: newTourName,
            teamA: 'TEAM 1',
            teamB: 'TEAM 2',
            tossText: 'TOSS PENDING',
            createdAt: new Date().toISOString().split('T')[0],
        };
        const updatedList = [newItem, ...tournaments];
        saveTournaments(updatedList);
        setShowCreateModal(false);
        setNewTourName('');
        navigate(`/tournament/${newItem.id}`);
    };
    const handleDelete = (id) => {
        saveTournaments(tournaments.filter((t) => t.id !== id));
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#070b15] text-slate-100 font-sans pb-20", children: [_jsx(CricNavbar, {}), _jsxs("main", { className: "max-w-4xl mx-auto py-10 px-4 flex flex-col items-center", children: [_jsxs("div", { className: "flex items-center gap-12 mb-10 text-xl font-black uppercase tracking-wider", children: [_jsx(Link, { to: "/theme_links", className: "text-cyan-400 hover:text-cyan-300 border-b-2 border-cyan-400 pb-1 flex items-center gap-2", children: "SCOREBOARD LINKS" }), _jsx("span", { className: "text-cyan-400 border-b-2 border-cyan-400 pb-1", children: "ALL DELETED TOURNAMENTS" })] }), _jsx("h1", { className: "text-5xl font-black uppercase text-red-600 drop-shadow-[0_2px_10px_rgba(239,68,68,0.6)] mb-8", children: "Tournament" }), _jsx("button", { onClick: () => setShowCreateModal(true), className: "bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-sm px-10 py-3 rounded-2xl shadow-[0_0_35px_rgba(16,185,129,0.7)] border border-emerald-300/40 uppercase tracking-widest transition-all transform hover:scale-105 mb-12", children: "CREATE TOURNAMENT" }), _jsx("div", { className: "w-full space-y-5", children: tournaments.map((tour) => (_jsxs("div", { className: "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-6 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-white text-xl md:text-2xl font-black uppercase tracking-wide drop-shadow-md", children: tour.name }), _jsx("p", { className: "text-[11px] font-bold text-slate-200 mt-1 uppercase tracking-wider opacity-80", children: "Click TOUR PAGE to view & create matches" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { to: `/tournament/${tour.id}`, className: "bg-purple-900/90 hover:bg-purple-800 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg border border-purple-300/30 uppercase tracking-wider transition-all transform hover:scale-105", children: "TOUR PAGE" }), _jsx("button", { onClick: () => {
                                                const shareUrl = `${window.location.origin}/#/tournament/${tour.id}`;
                                                navigator.clipboard.writeText(shareUrl);
                                                alert('Tournament Link copied!');
                                            }, className: "p-2.5 bg-purple-900/80 hover:bg-purple-800 text-white rounded-xl border border-purple-400/40 shadow transition-all", title: "Copy Tournament Link", children: _jsx(LinkIcon, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDelete(tour.id), className: "p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl border border-red-400/40 shadow transition-all", title: "Delete Tournament", children: _jsx(Trash2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => alert(`Tournament: ${tour.name}`), className: "p-2.5 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full border border-white/20 transition-all", title: "Tournament Info", children: _jsx(Info, { className: "w-4 h-4 text-slate-300" }) })] })] }, tour.id))) })] }), showCreateModal && (_jsx("div", { className: "fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl", children: [_jsxs("h2", { className: "text-2xl font-black text-white uppercase mb-6 flex items-center gap-2", children: [_jsx(Plus, { className: "w-6 h-6 text-emerald-400" }), " Create New Tournament"] }), _jsxs("form", { onSubmit: handleCreateTournament, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold uppercase text-slate-400 block mb-1", children: "Tournament Name" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. Premier League 2026", value: newTourName, onChange: (e) => setNewTourName(e.target.value), className: "w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-cyan-400" })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { type: "button", onClick: () => setShowCreateModal(false), className: "px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 text-xs uppercase", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase shadow-lg", children: "Create & Launch" })] })] })] }) }))] }));
};
