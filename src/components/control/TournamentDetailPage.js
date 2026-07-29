import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2, Edit3, Share2, Check } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
import { EditMatchModal } from './EditMatchModal';
import { useBroadcastStore } from '../../store/useBroadcastStore';
export const DEFAULT_MATCHES = [
    {
        id: 'match_001',
        tournamentId: '0d840fa0-a9f4-45c2-990c-a265c4cb4sda',
        teamA: 'ASHTAVINAYAK INDIANS',
        teamB: 'ASHTAVINAYAK SUPER KINGS',
        overs: 4,
        matchNo: 1,
        matchType: 'GROUP STAGE',
        groupNo: 1,
        tossText: 'ASHTAVINAYAK SUPER KINGS WIN TOSS AND CHOOSE TO BOWL',
        winner: 'ASHTAVINAYAK INDIANS',
        createdAt: '2026-07-24',
    },
    {
        id: 'match_002',
        tournamentId: '0d840fa0-a9f4-45c2-990c-a265c4cb4sda',
        teamA: 'ASHTAVINAYAK KINGS',
        teamB: 'ASHTAVINAYAK ROYALS CHALLENGERS',
        overs: 4,
        matchNo: 2,
        matchType: 'GROUP STAGE',
        groupNo: 1,
        tossText: 'ASHTAVINAYAK ROYALS CHALLENGERS WIN TOSS AND CHOOSE TO BOWL',
        winner: 'ASHTAVINAYAK KINGS',
        createdAt: '2026-07-24',
    },
    {
        id: 'match_003',
        tournamentId: '0d840fa0-a9f4-45c2-990c-a265c4cb4sda',
        teamA: 'ASHTAVINAYAK KINGS',
        teamB: 'ASHTAVINAYAK ROYALS',
        overs: 4,
        matchNo: 3,
        matchType: 'GROUP STAGE',
        groupNo: 1,
        tossText: 'ASHTAVINAYAK ROYALS WIN TOSS AND CHOOSE TO BOWL',
        winner: 'MATCH NOT FINISH YET',
        createdAt: '2026-07-24',
    },
    {
        id: 'match_004',
        tournamentId: '0d840fa0-a9f4-45c2-990c-a265c4cb4sda',
        teamA: 'ASHTAVINAYAK ROYALS CHALLENGERS',
        teamB: 'ASHTAVINAYAK SUPER KINGS',
        overs: 4,
        matchNo: 4,
        matchType: 'GROUP STAGE',
        groupNo: 1,
        tossText: 'ASHTAVINAYAK SUPER KINGS WIN TOSS AND CHOOSE TO BOWL',
        winner: 'ASHTAVINAYAK SUPER KINGS',
        createdAt: '2026-07-24',
    },
];
export const TournamentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('matches');
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('cricscorer_matches_v2');
                if (saved)
                    return JSON.parse(saved);
            }
            catch (e) {
                console.warn('Failed to load matches:', e);
            }
        }
        return DEFAULT_MATCHES;
    });
    const [tournamentName, setTournamentName] = useState('Asthavinayak Premier League');
    const [copiedId, setCopiedId] = useState(null);
    useEffect(() => {
        if (!id || typeof window === 'undefined')
            return;
        try {
            const savedTours = localStorage.getItem('cricscorer_tournaments_v1');
            if (savedTours) {
                const tours = JSON.parse(savedTours);
                const current = tours.find((t) => t.id === id);
                if (current)
                    setTournamentName(current.name);
            }
        }
        catch (e) { }
    }, [id]);
    const saveMatches = (items) => {
        setMatches(items);
        if (typeof window !== 'undefined') {
            localStorage.setItem('cricscorer_matches_v2', JSON.stringify(items));
        }
    };
    // Create Match Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [team1Name, setTeam1Name] = useState('');
    const [team2Name, setTeam2Name] = useState('');
    const [overs, setOvers] = useState(4);
    const [matchNo, setMatchNo] = useState(1);
    const [isTied, setIsTied] = useState(false);
    const [ballsPerOver, setBallsPerOver] = useState(6);
    const [matchType, setMatchType] = useState('Group Stage');
    const [groupNo, setGroupNo] = useState(1);
    // Edit Match Modal State
    const [editingMatch, setEditingMatch] = useState(null);
    const filteredMatches = matches.filter((m) => m.tournamentId === id || !id);
    const handleCreateMatch = (e) => {
        e.preventDefault();
        if (!team1Name.trim() || !team2Name.trim())
            return;
        const newMatch = {
            id: `match_${Date.now()}`,
            tournamentId: id || '0d840fa0-a9f4-45c2-990c-a265c4cb4sda',
            teamA: team1Name.toUpperCase(),
            teamB: team2Name.toUpperCase(),
            overs: Number(overs),
            matchNo: Number(matchNo),
            isTied,
            ballsPerOver: Number(ballsPerOver),
            matchType: matchType.toUpperCase(),
            groupNo: Number(groupNo),
            tossText: `${team2Name.toUpperCase()} WIN TOSS AND CHOOSE TO BOWL`,
            winner: 'MATCH NOT FINISH YET',
            createdAt: new Date().toISOString().split('T')[0],
        };
        const updated = [newMatch, ...matches];
        saveMatches(updated);
        setShowCreateModal(false);
        setTeam1Name('');
        setTeam2Name('');
        // Update broadcast store and launch match
        useBroadcastStore.getState().startNewMatchWithTeams(newMatch.teamA, newMatch.teamB, tournamentName);
        useBroadcastStore.getState().updateMatchSettings({
            totalOvers: newMatch.overs,
            matchNo: newMatch.matchNo,
            matchType: newMatch.matchType,
            groupNo: newMatch.groupNo,
        });
        navigate(`/tournament/${id || '0d840fa0-a9f4-45c2-990c-a265c4cb4sda'}/match/${newMatch.id}`);
    };
    const handleDeleteMatch = (matchId) => {
        saveMatches(matches.filter((m) => m.id !== matchId));
    };
    const handleCopyLink = (matchId) => {
        const shareUrl = `${window.location.origin}/#/tournament/${id}/match/${matchId}`;
        navigator.clipboard.writeText(shareUrl);
        setCopiedId(matchId);
        setTimeout(() => setCopiedId(null), 2000);
    };
    const handleLaunchMatch = (match) => {
        useBroadcastStore.getState().startNewMatchWithTeams(match.teamA, match.teamB, tournamentName);
        useBroadcastStore.getState().updateMatchSettings({
            totalOvers: match.overs,
            matchNo: match.matchNo,
            matchType: match.matchType,
            groupNo: match.groupNo,
        });
        navigate(`/tournament/${id || '0d840fa0-a9f4-45c2-990c-a265c4cb4sda'}/match/${match.id}`);
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#070b15] text-slate-100 font-sans pb-20", children: [_jsx(CricNavbar, {}), _jsxs("main", { className: "max-w-5xl mx-auto py-8 px-4 flex flex-col items-center", children: [_jsxs("div", { className: "w-full flex items-center justify-between mb-8", children: [_jsx(Link, { to: "/tournament", className: "text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1 text-sm uppercase", children: "\u2190 BACK TO TOURNAMENTS" }), _jsx("span", { className: "text-slate-400 font-bold text-sm uppercase", children: tournamentName })] }), _jsxs("div", { className: "flex items-center gap-12 mb-8 text-xl font-black uppercase tracking-wider", children: [_jsx("button", { onClick: () => setActiveTab('matches'), className: `pb-1 border-b-2 transition-all ${activeTab === 'matches'
                                    ? 'text-white border-cyan-400'
                                    : 'text-slate-400 border-transparent hover:text-slate-200'}`, children: "Matches" }), _jsx("button", { onClick: () => setActiveTab('details'), className: `pb-1 border-b-2 transition-all ${activeTab === 'details'
                                    ? 'text-white border-cyan-400'
                                    : 'text-slate-400 border-transparent hover:text-slate-200'}`, children: "Details" })] }), activeTab === 'matches' && (_jsxs("div", { className: "w-full flex flex-col items-center", children: [_jsx("button", { onClick: () => setShowCreateModal(true), className: "bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm px-10 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-300/40 uppercase tracking-widest transition-all transform hover:scale-105 mb-8", children: "CREATE MATCH" }), _jsx("div", { className: "w-full space-y-5", children: filteredMatches.map((match) => (_jsxs("div", { className: "relative overflow-hidden bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4", children: [_jsx("div", { className: "absolute right-6 bottom-2 opacity-15 pointer-events-none font-black text-4xl md:text-5xl uppercase tracking-widest text-white", children: match.matchType || 'GROUP STAGE' }), _jsxs("div", { className: "z-10 space-y-1", children: [_jsxs("h3", { className: "text-white text-lg md:text-xl font-black uppercase tracking-wide drop-shadow-md", children: [match.teamA, " ", _jsx("span", { className: "text-cyan-300", children: "vs" }), " ", match.teamB] }), _jsx("p", { className: "text-xs font-bold text-slate-200 uppercase tracking-wider opacity-90", children: match.tossText }), _jsxs("div", { className: "flex items-center gap-4 text-xs font-black uppercase text-amber-300 pt-1", children: [_jsxs("span", { children: ["OVERS : ", match.overs] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["WINNER : ", match.winner || 'MATCH NOT FINISH YET'] })] })] }), _jsxs("div", { className: "z-10 flex items-center gap-3 self-end md:self-center", children: [_jsx("button", { onClick: () => handleLaunchMatch(match), className: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg border border-pink-300/30 uppercase tracking-wider transition-all transform hover:scale-105", children: "MATCH PAGE" }), _jsx("button", { onClick: () => handleDeleteMatch(match.id), className: "p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow transition-all", title: "Delete Match", children: _jsx(Trash2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setEditingMatch(match), className: "p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-all", title: "Edit Match", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleCopyLink(match.id), className: "p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow transition-all", title: "Copy Share Link", children: copiedId === match.id ? _jsx(Check, { className: "w-4 h-4 text-emerald-300" }) : _jsx(Share2, { className: "w-4 h-4" }) })] })] }, match.id))) })] })), activeTab === 'details' && (_jsxs("div", { className: "w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4", children: [_jsx("h3", { className: "text-2xl font-black uppercase text-cyan-400", children: tournamentName }), _jsxs("p", { className: "text-slate-300 font-medium", children: ["Total Matches Created: ", filteredMatches.length] }), _jsx("p", { className: "text-slate-400 text-xs", children: "All matches in this tournament stream in real-time over Render WebSockets, ntfy.sh SSE, and Firebase RTDB." })] }))] }), showCreateModal && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto", children: _jsxs("div", { className: "w-full max-w-md bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-2xl shadow-2xl p-6 text-white border border-blue-400/40", children: [_jsx("h2", { className: "text-2xl font-black text-center tracking-wider uppercase mb-5", children: "CREATE MATCH" }), _jsxs("form", { onSubmit: handleCreateMatch, className: "space-y-4 text-center", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold uppercase mb-1", children: "Team 1 Name" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. ASHTAVINAYAK INDIANS", value: team1Name, onChange: (e) => setTeam1Name(e.target.value), className: "w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold uppercase mb-1", children: "Team 2 Name" }), _jsx("input", { type: "text", required: true, placeholder: "e.g. ASHTAVINAYAK SUPER KINGS", value: team2Name, onChange: (e) => setTeam2Name(e.target.value), className: "w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none" })] }), _jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-bold uppercase", children: "Overs" }), _jsx("input", { type: "number", value: overs, onChange: (e) => setOvers(Number(e.target.value)), className: "w-20 px-2 py-1 text-slate-900 font-bold bg-white rounded-md text-center" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-bold uppercase", children: "Match No." }), _jsx("input", { type: "number", value: matchNo, onChange: (e) => setMatchNo(Number(e.target.value)), className: "w-20 px-2 py-1 text-slate-900 font-bold bg-white rounded-md text-center" })] })] }), _jsxs("div", { className: "flex items-center justify-center gap-6 py-1", children: [_jsx("span", { className: "text-sm font-bold uppercase", children: "Match Tied?" }), _jsxs("label", { className: "flex items-center gap-1.5 font-bold cursor-pointer", children: [_jsx("input", { type: "radio", name: "isTiedCreate", checked: isTied === true, onChange: () => setIsTied(true), className: "w-4 h-4 accent-cyan-400" }), "Yes"] }), _jsxs("label", { className: "flex items-center gap-1.5 font-bold cursor-pointer", children: [_jsx("input", { type: "radio", name: "isTiedCreate", checked: isTied === false, onChange: () => setIsTied(false), className: "w-4 h-4 accent-cyan-400" }), "No"] })] }), _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("label", { className: "text-sm font-bold uppercase", children: "Balls Per Over :" }), _jsxs("select", { value: ballsPerOver, onChange: (e) => setBallsPerOver(Number(e.target.value)), className: "w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md", children: [_jsx("option", { value: 6, children: "6" }), _jsx("option", { value: 8, children: "8" }), _jsx("option", { value: 10, children: "10" }), _jsx("option", { value: 4, children: "4" })] })] }), _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("label", { className: "text-sm font-bold uppercase", children: "Match Type :" }), _jsxs("select", { value: matchType, onChange: (e) => setMatchType(e.target.value), className: "w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md", children: [_jsx("option", { value: "Group Stage", children: "Group Stage" }), _jsx("option", { value: "Quarter Final", children: "Quarter Final" }), _jsx("option", { value: "Semi Final", children: "Semi Final" }), _jsx("option", { value: "Final", children: "Final" }), _jsx("option", { value: "Knockout", children: "Knockout" }), _jsx("option", { value: "League Match", children: "League Match" })] })] }), _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("label", { className: "text-sm font-bold uppercase", children: "Group No. :" }), _jsxs("select", { value: groupNo, onChange: (e) => setGroupNo(Number(e.target.value)), className: "w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md", children: [_jsx("option", { value: 1, children: "1" }), _jsx("option", { value: 2, children: "2" }), _jsx("option", { value: 3, children: "3" }), _jsx("option", { value: 4, children: "4" }), _jsx("option", { value: 5, children: "5" })] })] }), _jsxs("div", { className: "flex items-center justify-center gap-4 pt-4", children: [_jsx("button", { type: "submit", className: "bg-green-600 hover:bg-green-500 text-white font-black px-6 py-2 rounded-lg shadow-lg uppercase transition-all", children: "Create & Launch" }), _jsx("button", { type: "button", onClick: () => setShowCreateModal(false), className: "bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2 rounded-lg shadow-lg uppercase transition-all", children: "Cancel" })] })] })] }) })), editingMatch && (_jsx(EditMatchModal, { isOpen: !!editingMatch, onClose: () => setEditingMatch(null) }))] }));
};
