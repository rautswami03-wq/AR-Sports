import React, { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { UserCheck, Plus, CheckCircle, Shield, AlertCircle, X } from 'lucide-react';

interface ChangeBowlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOverEnd?: boolean;
}

export const ChangeBowlerModal: React.FC<ChangeBowlerModalProps> = ({
  isOpen,
  onClose,
  isOverEnd = false,
}) => {
  const { teamA, teamB, battingTeamId, changeBowler } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const [newBowlerName, setNewBowlerName] = useState('');
  const [selectedBowlerName, setSelectedBowlerName] = useState('');

  if (!isOpen) return null;

  const currentBowler = bowlingTeam.bowlers.find((b) => b.isCurrent) || bowlingTeam.bowlers[0];

  const handleSelectAndSave = (name: string) => {
    if (!name.trim()) return;
    changeBowler(name.trim());
    setNewBowlerName('');
    setSelectedBowlerName('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBowlerName.trim()) {
      handleSelectAndSave(newBowlerName.trim());
    } else if (selectedBowlerName) {
      handleSelectAndSave(selectedBowlerName);
    }
  };

  // Combine unique player list from bowling team's bowlers and batters
  const allSquadPlayers = Array.from(
    new Set([
      ...bowlingTeam.bowlers.map((b) => b.name),
      ...bowlingTeam.batters.map((b) => b.name),
    ])
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-100">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-5 text-center relative shadow-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2 shadow">
            <Shield className="w-3.5 h-3.5" />
            {isOverEnd ? 'OVER FINISHED' : 'BOWLER CHANGE'}
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow">
            {isOverEnd ? `Over ${battingTeam.overs} Completed!` : 'Change Active Bowler'}
          </h2>
          <p className="text-cyan-100 text-xs mt-1 font-medium">
            Select bowler for Bowling Team: <span className="font-black text-amber-300 uppercase">{bowlingTeam.fullName}</span>
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          
          {/* Current Bowler Info Card */}
          {currentBowler && (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">
                  Last / Current Bowler
                </span>
                <span className="text-base font-black text-white">{currentBowler.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-400 font-mono">
                  {currentBowler.wickets}-{currentBowler.runsConceded}
                </span>
                <span className="text-xs text-slate-400 font-semibold block">
                  ({currentBowler.overs}.{currentBowler.ballsInCurrentOver} Ov &bull; Econ {currentBowler.economy})
                </span>
              </div>
            </div>
          )}

          {/* Quick Select Grid from Squad */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>Select from {bowlingTeam.shortName || 'Bowling'} Squad:</span>
              <span className="text-[10px] text-cyan-400 font-normal">Click to switch instantly</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {allSquadPlayers.map((name) => {
                const bwStats = bowlingTeam.bowlers.find((b) => b.name.toLowerCase() === name.toLowerCase());
                const isCurrent = bwStats?.isCurrent || currentBowler?.name.toLowerCase() === name.toLowerCase();

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelectAndSave(name)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400'
                        : 'bg-slate-800/50 hover:bg-slate-700/70 border-slate-700/60 text-slate-200 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold truncate">{name}</span>
                      {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {bwStats ? `${bwStats.wickets}-${bwStats.runsConceded} (${bwStats.overs}.${bwStats.ballsInCurrentOver})` : '0-0 (0.0)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-black text-slate-500 uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* New Bowler Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                Add & Set New Bowler:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new bowler name..."
                  value={newBowlerName}
                  onChange={(e) => setNewBowlerName(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-slate-100 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-400 text-sm font-semibold shadow-inner placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!newBowlerName.trim()}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all border border-slate-700"
              >
                Skip / Close
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
