import React, { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface PlayerListModalProps {
  isOpen: boolean;
  teamId: 'teamA' | 'teamB';
  onClose: () => void;
}

export const PlayerListModal: React.FC<PlayerListModalProps> = ({ isOpen, teamId, onClose }) => {
  const { teamA, teamB, updateBatterStats, bulkAddPlayers } = useBroadcastStore();
  const targetTeam = teamId === 'teamA' ? teamA : teamB;

  const [newPlayerName, setNewPlayerName] = useState('');

  if (!isOpen) return null;

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      bulkAddPlayers(teamId, [newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 text-white space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-black uppercase text-cyan-400">
            {targetTeam.fullName} — PLAYERS LIST
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        {/* Add New Player Form */}
        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <input
            type="text"
            placeholder="Add player name..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs uppercase"
          >
            Add Player
          </button>
        </form>

        {/* Player Roster List */}
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {targetTeam.batters.map((b, idx) => (
            <div key={b.id} className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
              
              {/* Photo Avatar Preview & Upload */}
              <div className="flex items-center gap-2">
                {b.avatarUrl ? (
                  <img src={b.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-amber-400" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    📷
                  </div>
                )}
                <label className="cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] px-2 py-1 rounded uppercase tracking-wider">
                  + Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          if (result) {
                            updateBatterStats(b.id, { avatarUrl: result });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <input
                type="text"
                value={b.name}
                onChange={(e) => updateBatterStats(b.id, { name: e.target.value })}
                className="flex-1 bg-transparent text-white font-black text-xs px-2 py-1 rounded focus:bg-slate-800 focus:outline-none"
              />
              <span className="text-[10px] font-bold text-amber-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {b.runs}r ({b.balls}b)
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-2 rounded-xl text-xs uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
