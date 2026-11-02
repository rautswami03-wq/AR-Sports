import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, Edit3, Link as LinkIcon, Share2, Check, Trophy, BarChart2 } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
import { EditMatchModal } from './EditMatchModal';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { useTournamentStore, TournamentTeamStanding, calculatePointsTable, MatchRecordInput } from '../../store/useTournamentStore';

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
  teamAScore?: number;
  teamAWickets?: number;
  teamAOvers?: number;
  teamABalls?: number;
  teamBScore?: number;
  teamBWickets?: number;
  teamBOvers?: number;
  teamBBalls?: number;
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
    teamAScore: 48,
    teamAWickets: 2,
    teamAOvers: 4,
    teamABalls: 0,
    teamBScore: 36,
    teamBWickets: 4,
    teamBOvers: 4,
    teamBBalls: 0,
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
    teamAScore: 52,
    teamAWickets: 1,
    teamAOvers: 4,
    teamABalls: 0,
    teamBScore: 40,
    teamBWickets: 3,
    teamBOvers: 4,
    teamBBalls: 0,
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
    teamAScore: 32,
    teamAWickets: 4,
    teamAOvers: 4,
    teamABalls: 0,
    teamBScore: 33,
    teamBWickets: 1,
    teamBOvers: 3,
    teamBBalls: 2,
  },
];

export interface TournamentDetailPageProps {
  isPublicView?: boolean;
}

export const TournamentDetailPage: React.FC<TournamentDetailPageProps> = ({
  isPublicView: propIsPublicView,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicView = Boolean(
    propIsPublicView || (location && location.pathname.includes('/public/tournament'))
  );

  const [activeTab, setActiveTab] = useState<'matches' | 'table' | 'details'>('matches');
  const [matches, setMatches] = useState<MatchItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ar_sports_matches_v2') || localStorage.getItem('cricscorer_matches_v2');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load matches:', e);
      }
    }
    return DEFAULT_MATCHES;
  });

  const [tournamentName, setTournamentName] = useState('Asthavinayak Premier League');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dashboardCopied, setDashboardCopied] = useState(false);
  const [standings, setStandings] = useState<TournamentTeamStanding[]>([]);

  useEffect(() => {
    if (!id || typeof window === 'undefined') return;
    try {
      const savedTours = localStorage.getItem('ar_sports_tournaments_v1') || localStorage.getItem('cricscorer_tournaments_v1');
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
      localStorage.setItem('ar_sports_matches_v2', JSON.stringify(items));
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

  const handleShareDashboard = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const tourId = id || '0d840fa0-a9f4-45c2-990c-a265c4cb4sda';
    const shareUrl = `${origin}/#/public/tournament/${tourId}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setDashboardCopied(true);
      setTimeout(() => setDashboardCopied(false), 2500);
    }
  };

  useEffect(() => {
    const tourId = id || '0d840fa0-a9f4-45c2-990c-a265c4cb4sda';
    const matchInputs: MatchRecordInput[] = filteredMatches.map((m) => ({
      ...m,
      overs: m.overs || 4,
    }));
    const computed = useTournamentStore.getState().recalculatePointsTable(tourId, matchInputs);
    setStandings(computed);

    const handleSync = () => {
      const refreshed = useTournamentStore.getState().recalculatePointsTable(tourId);
      setStandings(refreshed);
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('ar_sports_tournament_update', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ar_sports_tournament_update', handleSync);
    };
  }, [id, matches]);

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
        {/* Breadcrumb & Top Actions Header */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {!isPublicView && (
              <Link to="/tournament" className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1 text-sm uppercase">
                ← BACK TO TOURNAMENTS
              </Link>
            )}
            <span className="text-slate-300 font-black text-sm uppercase">{tournamentName}</span>
            {isPublicView && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Public Fan View
              </span>
            )}
          </div>

          {/* Share Dashboard Button */}
          <button
            onClick={handleShareDashboard}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.45)] border border-blue-400/40 transition-all transform hover:scale-105 active:scale-95"
            data-testid="share-dashboard-btn"
          >
            {dashboardCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Dashboard Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Dashboard</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Navigation: Matches | Points Table | Details */}
        <div className="flex items-center gap-8 md:gap-12 mb-8 text-lg md:text-xl font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-1 border-b-2 transition-all ${
              activeTab === 'matches'
                ? 'text-white border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Matches ({filteredMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`pb-1 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'table'
                ? 'text-white border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            data-testid="points-table-tab"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
            Points Table
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
            {/* Teal Glow CREATE MATCH Button (Hidden in Public Spectator View) */}
            {!isPublicView && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm px-10 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-300/40 uppercase tracking-widest transition-all transform hover:scale-105 mb-8"
              >
                CREATE MATCH
              </button>
            )}

            {/* List of Matches Cards */}
            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 px-6 bg-slate-900/60 border border-slate-800 rounded-3xl w-full max-w-lg space-y-4">
                <p className="text-slate-400 font-bold text-sm uppercase">No matches created for this tournament yet.</p>
                {!isPublicView && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl uppercase text-xs shadow-lg"
                  >
                    + CREATE FIRST MATCH
                  </button>
                )}
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

                    {/* Delete Icon (Admin only) */}
                    {!isPublicView && (
                      <button
                        onClick={() => handleDeleteMatch(match.id)}
                        className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow transition-all"
                        title="Delete Match"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Edit Icon (Admin only) */}
                    {!isPublicView && (
                      <button
                        onClick={() => setEditingMatch(match)}
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition-all"
                        title="Edit Match"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

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

        {/* POINTS TABLE TAB */}
        {activeTab === 'table' && (
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <span>Official Points Table & Standings</span>
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Sorted by: 1st Points (PTS Descending) • 2nd Net Run Rate (NRR Descending)
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30">
                  Quota: {filteredMatches[0]?.overs || 4} Ov / Inngs
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" data-testid="points-table">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-black">
                    <th className="py-3 px-3 text-center w-12">POS</th>
                    <th className="py-3 px-4">TEAM</th>
                    <th className="py-3 px-3 text-center">P</th>
                    <th className="py-3 px-3 text-center text-emerald-400">W</th>
                    <th className="py-3 px-3 text-center text-rose-400">L</th>
                    <th className="py-3 px-3 text-center text-amber-300">T</th>
                    <th className="py-3 px-3 text-right">NRR</th>
                    <th className="py-3 px-4 text-right text-amber-400 font-black text-sm">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-sm">
                  {standings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400 font-bold uppercase text-xs">
                        No completed match results in this tournament yet. When matches are archived in ControlStudio, the Points Table updates instantly.
                      </td>
                    </tr>
                  ) : (
                    standings.map((team, idx) => {
                      const isQualified = idx < 2;
                      return (
                        <tr
                          key={team.teamId || team.teamName}
                          className={`transition-colors ${
                            isQualified ? 'bg-emerald-500/10 hover:bg-emerald-500/15' : 'hover:bg-white/5'
                          }`}
                          data-testid={`points-table-row-${team.teamName}`}
                        >
                          <td className="py-3.5 px-3 text-center font-black">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                                isQualified ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-black text-white">
                            <div className="flex items-center gap-2.5">
                              <span>{team.teamName}</span>
                              {isQualified && (
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                  QUALIFIED
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center text-slate-300">{team.played}</td>
                          <td className="py-3.5 px-3 text-center font-bold text-emerald-400">{team.won}</td>
                          <td className="py-3.5 px-3 text-center font-bold text-rose-400">{team.lost}</td>
                          <td className="py-3.5 px-3 text-center text-amber-300">{team.tied}</td>
                          <td
                            className={`py-3.5 px-3 text-right font-mono font-bold ${
                              team.nrr > 0 ? 'text-emerald-400' : team.nrr < 0 ? 'text-rose-400' : 'text-slate-300'
                            }`}
                          >
                            {team.nrrFormatted}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black text-amber-400 text-base">
                            {team.points}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Note footer */}
            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 font-medium gap-2">
              <span>• Net Run Rate (NRR) = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled)</span>
              <span>• Teams bowled out face the match's full quota of overs</span>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-2xl font-black uppercase text-cyan-400">{tournamentName}</h3>
            <p className="text-slate-300 font-medium">Total Matches Created: {filteredMatches.length}</p>
            <p className="text-slate-400 text-xs">All matches in this tournament stream in real-time over WebSockets, BroadcastChannel, and Firestore.</p>
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
