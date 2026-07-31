import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, Link as LinkIcon, Share2, Check } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
import { EditMatchModal } from './EditMatchModal';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface MatchItem {
  id: string;
  tournamentId: string;
  teamA: string;
  teamB: string;
  teamAShort?: string;
  teamBShort?: string;
  overs: number;
  matchNo: number;
  matchType: string;
  groupNo: number;
  isTied?: boolean;
  ballsPerOver?: number;
  tossText: string;
  winner?: string;
  createdAt: string;
}

export const DEFAULT_MATCHES: MatchItem[] = [
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

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'matches' | 'details'>('matches');
  const [matches, setMatches] = useState<MatchItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cricscorer_matches_v2');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load matches:', e);
      }
    }
    return DEFAULT_MATCHES;
  });

  const [tournamentName, setTournamentName] = useState('Asthavinayak Premier League');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof window === 'undefined') return;
    try {
      const savedTours = localStorage.getItem('cricscorer_tournaments_v1');
      if (savedTours) {
        const tours = JSON.parse(savedTours);
        const current = tours.find((t: any) => t.id === id);
        if (current) {
          setTournamentName(current.name);
          // If no match exists for this tournament, create an initial match from tournament details
          const existingForTour = matches.filter((m) => m.tournamentId === id);
          if (existingForTour.length === 0 && current.teamA && current.teamB) {
            const initMatch: MatchItem = {
              id: `match_${Date.now()}`,
              tournamentId: id,
              teamA: current.teamA,
              teamB: current.teamB,
              overs: 4,
              matchNo: 1,
              matchType: 'GROUP STAGE',
              groupNo: 1,
              tossText: current.tossText || `${current.teamB} WIN TOSS AND CHOOSE TO BOWL`,
              winner: 'MATCH NOT FINISH YET',
              createdAt: current.createdAt || new Date().toISOString().split('T')[0],
            };
            const updated = [initMatch, ...matches];
            saveMatches(updated);
          }
        }
      }
    } catch (e) {}
  }, [id]);

  const saveMatches = (items: MatchItem[]) => {
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
  const [editingMatch, setEditingMatch] = useState<MatchItem | null>(null);

  const filteredMatches = matches.filter((m) => m.tournamentId === id);

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1Name.trim() || !team2Name.trim()) return;

    const newMatch: MatchItem = {
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

  const handleDeleteMatch = (matchId: string) => {
    saveMatches(matches.filter((m) => m.id !== matchId));
  };

  const handleCopyLink = (matchId: string) => {
    const baseUrl = window.location.href.split('#')[0].replace(/\/$/, '');
    const shareUrl = `${baseUrl}/#/tournament/${id}/match/${matchId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(matchId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLaunchMatch = (match: MatchItem) => {
    useBroadcastStore.getState().startNewMatchWithTeams(match.teamA, match.teamB, tournamentName);
    useBroadcastStore.getState().updateMatchSettings({
      totalOvers: match.overs,
      matchNo: match.matchNo,
      matchType: match.matchType,
      groupNo: match.groupNo,
    });
    navigate(`/tournament/${id || '0d840fa0-a9f4-45c2-990c-a265c4cb4sda'}/match/${match.id}`);
  };

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans pb-20">
      <CricNavbar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto py-8 px-4 flex flex-col items-center">
        {/* Breadcrumb Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <Link to="/tournament" className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1 text-sm uppercase">
            ← BACK TO TOURNAMENTS
          </Link>
          <span className="text-slate-400 font-bold text-sm uppercase">{tournamentName}</span>
        </div>

        {/* Tab Navigation: Matches | Details */}
        <div className="flex items-center gap-12 mb-8 text-xl font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-1 border-b-2 transition-all ${
              activeTab === 'matches'
                ? 'text-white border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-1 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'text-white border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Details
          </button>
        </div>

        {activeTab === 'matches' && (
          <div className="w-full flex flex-col items-center">
            {/* Teal Glow CREATE MATCH Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm px-10 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-300/40 uppercase tracking-widest transition-all transform hover:scale-105 mb-8"
            >
              CREATE MATCH
            </button>

            {/* List of Matches Cards */}
            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 px-6 bg-slate-900/60 border border-slate-800 rounded-3xl w-full max-w-lg space-y-4">
                <p className="text-slate-400 font-bold text-sm uppercase">No matches created for this tournament yet.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl uppercase text-xs shadow-lg"
                >
                  + CREATE FIRST MATCH
                </button>
              </div>
            ) : (
              <div className="w-full space-y-5">
                {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Watermark Tag (e.g. GROUP STAGE) */}
                  <div className="absolute right-6 bottom-2 opacity-15 pointer-events-none font-black text-4xl md:text-5xl uppercase tracking-widest text-white">
                    {match.matchType || 'GROUP STAGE'}
                  </div>

                  {/* Left Info Section */}
                  <div className="z-10 space-y-1">
                    <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-wide drop-shadow-md">
                      {match.teamA} <span className="text-cyan-300">vs</span> {match.teamB}
                    </h3>
                    <p className="text-xs font-bold text-slate-200 uppercase tracking-wider opacity-90">
                      {match.tossText}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-black uppercase text-amber-300 pt-1">
                      <span>OVERS : {match.overs}</span>
                      <span>•</span>
                      <span>WINNER : {match.winner || 'MATCH NOT FINISH YET'}</span>
                    </div>
                  </div>

                  {/* Right Action Buttons Section */}
                  <div className="z-10 flex items-center gap-3 self-end md:self-center">
                    {/* Pink Glow MATCH PAGE Button */}
                    <button
                      onClick={() => handleLaunchMatch(match)}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg border border-pink-300/30 uppercase tracking-wider transition-all transform hover:scale-105"
                    >
                      MATCH PAGE
                    </button>

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow transition-all"
                      title="Delete Match"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Edit Icon */}
                    <button
                      onClick={() => setEditingMatch(match)}
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-all"
                      title="Edit Match"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Share / Copy Link Icon */}
                    <button
                      onClick={() => handleCopyLink(match.id)}
                      className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow transition-all"
                      title="Copy Share Link"
                    >
                      {copiedId === match.id ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {activeTab === 'details' && (
          <div className="w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-2xl font-black uppercase text-cyan-400">{tournamentName}</h3>
            <p className="text-slate-300 font-medium">Total Matches Created: {filteredMatches.length}</p>
            <p className="text-slate-400 text-xs">All matches in this tournament stream in real-time over Render WebSockets, ntfy.sh SSE, and Firebase RTDB.</p>
          </div>
        )}
      </main>

      {/* CREATE MATCH Modal (Screenshot 2 Styling) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-2xl shadow-2xl p-6 text-white border border-blue-400/40">
            <h2 className="text-2xl font-black text-center tracking-wider uppercase mb-5">
              CREATE MATCH
            </h2>

            <form onSubmit={handleCreateMatch} className="space-y-4 text-center">
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Team 1 Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASHTAVINAYAK INDIANS"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-1">Team 2 Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASHTAVINAYAK SUPER KINGS"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold uppercase">Overs</label>
                  <input
                    type="number"
                    value={overs}
                    onChange={(e) => setOvers(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-slate-900 font-bold bg-white rounded-md text-center"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-bold uppercase">Match No.</label>
                  <input
                    type="number"
                    value={matchNo}
                    onChange={(e) => setMatchNo(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-slate-900 font-bold bg-white rounded-md text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 py-1">
                <span className="text-sm font-bold uppercase">Match Tied?</span>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="isTiedCreate"
                    checked={isTied === true}
                    onChange={() => setIsTied(true)}
                    className="w-4 h-4 accent-cyan-400"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="isTiedCreate"
                    checked={isTied === false}
                    onChange={() => setIsTied(false)}
                    className="w-4 h-4 accent-cyan-400"
                  />
                  No
                </label>
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-bold uppercase">Balls Per Over :</label>
                <select
                  value={ballsPerOver}
                  onChange={(e) => setBallsPerOver(Number(e.target.value))}
                  className="w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md"
                >
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={4}>4</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-bold uppercase">Match Type :</label>
                <select
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value)}
                  className="w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md"
                >
                  <option value="Group Stage">Group Stage</option>
                  <option value="Quarter Final">Quarter Final</option>
                  <option value="Semi Final">Semi Final</option>
                  <option value="Final">Final</option>
                  <option value="Knockout">Knockout</option>
                  <option value="League Match">League Match</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-bold uppercase">Group No. :</label>
                <select
                  value={groupNo}
                  onChange={(e) => setGroupNo(Number(e.target.value))}
                  className="w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white font-black px-6 py-2 rounded-lg shadow-lg uppercase transition-all"
                >
                  Create & Launch
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2 rounded-lg shadow-lg uppercase transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Match Modal */}
      {editingMatch && (
        <EditMatchModal
          isOpen={!!editingMatch}
          onClose={() => setEditingMatch(null)}
        />
      )}
    </div>
  );
};
