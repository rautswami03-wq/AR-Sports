import React, { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface ChangeBowlerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeBowlerModal: React.FC<ChangeBowlerModalProps> = ({ isOpen, onClose }) => {
  const { teamA, teamB, battingTeamId, changeBowler, updateBowlerStats } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const bowlingTeam = isTeamA ? teamB : teamA;

  const [newBowlerName, setNewBowlerName] = useState('');
  const [selectedBowlerId, setSelectedBowlerId] = useState('');

  if (!isOpen) return null;

  const handleSetBowler = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBowlerName.trim()) {
      changeBowler(newBowlerName.trim());
    } else if (selectedBowlerId) {
      const targetBowler = bowlingTeam.bowlers.find((bw) => bw.id === selectedBowlerId);
      if (targetBowler) {
        changeBowler(targetBowler.name);
      }
    }
    setNewBowlerName('');
    setSelectedBowlerId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 rounded-3xl shadow-2xl p-6 text-white border-2 border-cyan-200 text-center font-sans">
        <h2 className="text-xl font-black uppercase tracking-wider mb-4 drop-shadow text-slate-950">
          SELECT BOWLER
        </h2>

        <form onSubmit={handleSetBowler} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1 text-slate-950">
              Add New Bowler:
            </label>
            <input
              type="text"
              placeholder="Enter new bowler name"
              value={newBowlerName}
              onChange={(e) => setNewBowlerName(e.target.value)}
              className="w-full px-4 py-2.5 text-slate-950 font-black bg-white rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
            />
          </div>

          <p className="text-xs font-black uppercase text-slate-950 tracking-widest my-1">OR</p>

          <div>
            <label className="block text-xs font-black uppercase mb-1 text-slate-950">
              Available Bowler:
            </label>
            <select
              value={selectedBowlerId}
              onChange={(e) => setSelectedBowlerId(e.target.value)}
              className="w-full px-4 py-2.5 text-slate-950 font-bold bg-white rounded-xl focus:outline-none text-sm"
            >
              <option value="">Choose Bowler</option>
              {bowlingTeam.bowlers.map((bw) => (
                <option key={bw.id} value={bw.id}>
                  {bw.name} — {bw.wickets}-{bw.runsConceded} ({bw.overs}.{bw.ballsInCurrentOver})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all"
            >
              Set Bowler
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all"
            >
              Cancle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
