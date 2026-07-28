import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Link as LinkIcon, Info } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';

export interface TournamentItem {
  id: string;
  name: string;
  teamA: string;
  teamB: string;
  tossText: string;
  createdAt: string;
}

export const TournamentPage: React.FC = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<TournamentItem[]>([
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
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTourName, setNewTourName] = useState('');
  const [newTeamA, setNewTeamA] = useState('');
  const [newTeamB, setNewTeamB] = useState('');

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

    setTournaments([newItem, ...tournaments]);
    setShowCreateModal(false);
    setNewTourName('');
    setNewTeamA('');
    setNewTeamB('');

    navigate(`/tournament/${newItem.id}`);
  };

  const handleDelete = (id: string) => {
    setTournaments(tournaments.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans">
      <CricNavbar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto py-10 px-4 flex flex-col items-center">
        {/* Quick Nav Links */}
        <div className="flex items-center gap-12 mb-10 text-xl font-black uppercase tracking-wider">
          <Link
            to="/theme_links"
            className="text-cyan-400 hover:text-cyan-300 border-b-2 border-cyan-400 pb-1 flex items-center gap-2"
          >
            SCOREBOARD LINKS
          </Link>
          <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer border-b-2 border-cyan-400 pb-1">
            ALL DELETED TOURNAMENTS
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-5xl font-black uppercase text-red-600 drop-shadow-[0_2px_10px_rgba(239,68,68,0.6)] mb-8">
          Tournament
        </h1>

        {/* CREATE TOURNAMENT Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-lg px-12 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-emerald-300/40 transform hover:scale-105 active:scale-95 transition-all mb-12 uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> CREATE TOURNAMENT
        </button>

        {/* Tournaments List Cards */}
        <div className="w-full space-y-6">
          {tournaments.map((tour) => (
            <div
              key={tour.id}
              className="bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-5 rounded-3xl border border-white/20 shadow-2xl flex flex-wrap items-center justify-between gap-4"
            >
              <h3 className="text-white text-2xl font-black uppercase tracking-wide drop-shadow-md">
                {tour.name}
              </h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/tournament/${tour.id}`)}
                  className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl border border-rose-300/30 shadow-lg transition-all"
                >
                  TOUR PAGE
                </button>

                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/#/tournament/${tour.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('Tournament URL copied to clipboard!');
                  }}
                  className="bg-purple-900/80 hover:bg-purple-800 text-white p-2.5 rounded-xl border border-purple-400/40 shadow transition-all"
                  title="Copy Tournament Share Link"
                >
                  <LinkIcon className="w-4 h-4 text-purple-300" />
                </button>

                <button
                  onClick={() => handleDelete(tour.id)}
                  className="bg-red-600 hover:bg-red-500 text-white p-2.5 rounded-xl border border-red-400/40 shadow transition-all"
                  title="Delete Tournament"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={() => alert(`Tournament Details:\nName: ${tour.name}\nTeam A: ${tour.teamA}\nTeam B: ${tour.teamB}`)}
                  className="bg-slate-900/60 hover:bg-slate-900 text-white p-2.5 rounded-full border border-white/20 transition-all"
                  title="Tournament Info"
                >
                  <Info className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Tournament Modal */}
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
