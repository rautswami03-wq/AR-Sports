import React, { useState } from 'react';
import { X, UserX } from 'lucide-react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WicketModal: React.FC<WicketModalProps> = ({ isOpen, onClose }) => {
  const { teamA, teamB, battingTeamId, addWicket, bulkAddPlayers } = useBroadcastStore();
  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA' || battingTeamId === teamA.fullName;
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const currentStriker = battingTeam.batters.find((b) => b.isStriker);
  const currentNonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker);

  const [outBatterId, setOutBatterId] = useState<string>(currentStriker?.id || '');
  const [dismissalType, setDismissalType] = useState<string>('Caught');
  const [fielderName, setFielderName] = useState<string>('');
  const [newBatterName, setNewBatterName] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirmWicket = () => {
    let dismissalText = dismissalType;
    if (dismissalType === 'Caught') {
      dismissalText = fielderName ? `c ${fielderName}` : 'c Fielder';
    } else if (dismissalType === 'Bowled') {
      dismissalText = 'b Bowler';
    } else if (dismissalType === 'Run Out') {
      dismissalText = fielderName ? `run out (${fielderName})` : 'run out';
    } else if (dismissalType === 'LBW') {
      dismissalText = 'lbw';
    } else if (dismissalType === 'Stumped') {
      dismissalText = fielderName ? `st ${fielderName}` : 'st Keeper';
    }

    addWicket(dismissalText);

    if (newBatterName.trim()) {
      bulkAddPlayers(isTeamA ? 'teamA' : 'teamB', [newBatterName.trim()]);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-lg w-full shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserX className="w-6 h-6 text-rose-500" />
            <h3 className="text-xl font-black text-white uppercase tracking-wide">Wicket / Dismissal</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Batter Out Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Batter Out</label>
          <div className="grid grid-cols-2 gap-2">
            {currentStriker && (
              <button
                type="button"
                onClick={() => setOutBatterId(currentStriker.id)}
                className={`p-3 rounded-xl border text-left font-black text-xs uppercase ${
                  outBatterId === currentStriker.id
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div>{currentStriker.name} (Striker *)</div>
                <div className="text-[11px] opacity-75 font-normal">{currentStriker.runs} ({currentStriker.balls})</div>
              </button>
            )}
            {currentNonStriker && (
              <button
                type="button"
                onClick={() => setOutBatterId(currentNonStriker.id)}
                className={`p-3 rounded-xl border text-left font-black text-xs uppercase ${
                  outBatterId === currentNonStriker.id
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div>{currentNonStriker.name} (Non-Striker)</div>
                <div className="text-[11px] opacity-75 font-normal">{currentNonStriker.runs} ({currentNonStriker.balls})</div>
              </button>
            )}
          </div>
        </div>

        {/* Dismissal Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase">How Out?</label>
          <div className="grid grid-cols-3 gap-2">
            {['Caught', 'Bowled', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDismissalType(type)}
                className={`py-2 px-3 rounded-xl text-xs font-black uppercase border ${
                  dismissalType === type
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Fielder / Catcher Input */}
        {(dismissalType === 'Caught' || dismissalType === 'Run Out' || dismissalType === 'Stumped') && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase">Fielder / Catcher / Keeper Name</label>
            <input
              type="text"
              placeholder="e.g. Jadeja"
              value={fielderName}
              onChange={(e) => setFielderName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        {/* Next Incoming Batter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase">Next Batter Name (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Hardik Pandya"
            value={newBatterName}
            onChange={(e) => setNewBatterName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmWicket}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl uppercase shadow-lg shadow-rose-600/30"
          >
            Confirm Out
          </button>
        </div>
      </div>
    </div>
  );
};
