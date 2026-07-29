import React, { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WicketModal: React.FC<WicketModalProps> = ({ isOpen, onClose }) => {
  const { teamA, teamB, battingTeamId, addWicket, updateBatterStats } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];

  const [outBatterId, setOutBatterId] = useState(striker?.id || '');
  const [dismissalType, setDismissalType] = useState<'BOWLED' | 'CAUGHT' | 'LBW' | 'RUN_OUT' | 'STUMPED' | 'OTHER'>('BOWLED');
  const [nextBatterName, setNextBatterName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-rose-500 via-red-600 to-rose-800 rounded-3xl shadow-2xl p-6 text-white border-2 border-rose-200 text-center font-sans">
        <h2 className="text-xl font-black uppercase tracking-wider mb-4 drop-shadow text-white">
          WICKET / DISMISSAL
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-black uppercase mb-1 text-rose-100">
              Out Batter:
            </label>
            <select
              value={outBatterId}
              onChange={(e) => setOutBatterId(e.target.value)}
              className="w-full px-4 py-2 text-slate-950 font-bold bg-white rounded-xl text-sm"
            >
              {striker && <option value={striker.id}>STRIKER: {striker.name}</option>}
              {nonStriker && <option value={nonStriker.id}>NON-STRIKER: {nonStriker.name}</option>}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1 text-rose-100">
              Dismissal Type:
            </label>
            <select
              value={dismissalType}
              onChange={(e) => setDismissalType(e.target.value as any)}
              className="w-full px-4 py-2 text-slate-950 font-bold bg-white rounded-xl text-sm"
            >
              <option value="BOWLED">Bowled</option>
              <option value="CAUGHT">Caught</option>
              <option value="LBW">LBW</option>
              <option value="RUN_OUT">Run Out</option>
              <option value="STUMPED">Stumped</option>
              <option value="OTHER">Other / Hit Wicket</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1 text-rose-100">
              Next Incoming Batter Name:
            </label>
            <input
              type="text"
              placeholder="Enter new batter name"
              value={nextBatterName}
              onChange={(e) => setNextBatterName(e.target.value)}
              className="w-full px-4 py-2 text-slate-950 font-bold bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all"
            >
              Confirm Wicket
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-2.5 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
