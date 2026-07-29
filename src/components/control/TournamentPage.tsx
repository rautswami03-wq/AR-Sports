import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Link as LinkIcon, Info } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface TournamentItem {
  id: string;
  name: string;
  teamA: string;
  teamB: string;
  tossText: string;
  createdAt: string;
}

const DEFAULT_TOURNAMENTS: TournamentItem[] = [
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

export const TournamentPage: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<TournamentItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cricscorer_tournaments_v1');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load tournaments:', e);
      }
    }
    return DEFAULT_TOURNAMENTS;
  });

  const saveTournaments = (items: TournamentItem[]) => {
    setTournaments(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cricscorer_tournaments_v1', JSON.stringify(items));
    }
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTourName, setNewTourName] = useState('');
  const [newTeamA, setNewTeamA] = useState('');
  const [newTeamB, setNewTeamB] = useState('');
  const [newOvers, setNewOvers] = useState(20);
  const [newMatchNo, setNewMatchNo] = useState(1);
  const [newMatchType, setNewMatchType] = useState('Group Stage');
  const [newGroupNo, setNewGroupNo] = useState(1);

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTourName.trim()) return;

    const newItem: TournamentItem = {
      id: `tourn_${Date.now()}`,
      name: newTourName,
      teamA: newTeamA || 'TEAM A',
      teamB: newTeamB || 'TEAM B',
      tossText: `${newTeamA || 'TEAM A'} WON THE TOSS AND OPTED TO BAT`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newItem, ...tournaments];
    saveTournaments(updatedList);

    useBroadcastStore.getState().startNewMatchWithTeams(
      newTeamA || 'TEAM A',
      newTeamB || 'TEAM B',
      newTourName
    );
    useBroadcastStore.getState().updateMatchSettings({
      totalOvers: Number(newOvers),
      matchNo: Number(newMatchNo),
      matchType: newMatchType,
      groupNo: Number(newGroupNo),
    });

    setShowCreateModal(false);
    setNewTourName('');
    setNewTeamA('');
    setNewTeamB('');

    navigate(`/tournament/${newItem.id}`);
  };

  const handleDelete = (id: string) => {
    saveTournaments(tournaments.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans">
      <CricNavbar />

      <main className="max-w-5xl mx-auto py-10 px-4 flex flex-col items-center">
        <div className="flex items-center gap-12 mb-10 text-xl font-black uppercase tracking-wider">
          <Link
            to="/theme_links"
            className="text-cyan-400 hover:text-cyan-300 border-b-2 border-cyan-400 pb-1 flex items-center gap-2"
          >
            SCOREBOARD LINKS
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-emerald-400 hover:text-emerald-300 border-b-2 border-emerald-400 pb-1 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> CREATE TOURNAMENT
          </button>
        </div>

        <h1 className="text-5xl font-black uppercase text-red-600 drop-shadow-[0_2px_10px_rgba(239,68,68,0.6)] mb-8">
          Tournament
        </h1>

        <div className="w-full space-y-4">
          {tournaments.map((tour) => (
            <div
              key={tour.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                  🏆
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">
                    {tour.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    {tour.teamA} <span className="text-cyan-400">VS</span> {tour.teamB}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {tour.tossText}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to={`/tournament/${tour.id}`}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" /> LAUNCH MATCH CONTROL
                </Link>
                <button
                  onClick={() => handleDelete(tour.id)}
                  className="p-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all border border-slate-700"
                  title="Delete Tournament"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-white uppercase mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-emerald-400" /> Create New Tournament
            </h2>
            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Tournament Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premier League 2026"
                  value={newTourName}
                  onChange={(e) => setNewTourName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Team A Name</label>
                <input
                  type="text"
                  placeholder="e.g. SUPER KINGS"
                  value={newTeamA}
                  onChange={(e) => setNewTeamA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Team B Name</label>
                <input
                  type="text"
                  placeholder="e.g. INDIANS"
                  value={newTeamB}
                  onChange={(e) => setNewTeamB(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Overs</label>
                  <input
                    type="number"
                    value={newOvers}
                    onChange={(e) => setNewOvers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Match No.</label>
                  <input
                    type="number"
                    value={newMatchNo}
                    onChange={(e) => setNewMatchNo(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Match Type</label>
                  <select
                    value={newMatchType}
                    onChange={(e) => setNewMatchType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="Group Stage">Group Stage</option>
                    <option value="Quarter Final">Quarter Final</option>
                    <option value="Semi Final">Semi Final</option>
                    <option value="Final">Final</option>
                    <option value="League Match">League Match</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Group No.</label>
                  <select
                    value={newGroupNo}
                    onChange={(e) => setNewGroupNo(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl"
                >
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
