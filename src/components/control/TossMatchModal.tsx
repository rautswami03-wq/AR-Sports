import React, { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface TossMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TossMatchModal: React.FC<TossMatchModalProps> = ({ isOpen, onClose }) => {
  const { teamA, teamB, matchDetails, updateMatchSettings, updateTeamDetails, updateBatterStats, updateBowlerStats, startNewMatchWithTeams } = useBroadcastStore();

  const [tossWinner, setTossWinner] = useState<'teamA' | 'teamB'>('teamA');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');
  const [totalOvers, setTotalOvers] = useState(matchDetails.totalOvers || 20);
  const [strikerName, setStrikerName] = useState(teamA.batters[0]?.name || 'Striker 1');
  const [nonStrikerName, setNonStrikerName] = useState(teamA.batters[1]?.name || 'Striker 2');
  const [bowlerName, setBowlerName] = useState(teamB.bowlers[0]?.name || 'Bowler 1');

  if (!isOpen) return null;

  const handleStartMatch = (e: React.FormEvent) => {
    e.preventDefault();

    const store = useBroadcastStore.getState();
    const freshTeamA = store.teamA;
    const freshTeamB = store.teamB;

    const winnerName = tossWinner === 'teamA' ? freshTeamA.fullName : freshTeamB.fullName;
    const decisionText = tossDecision === 'bat' ? 'OPTED TO BAT' : 'OPTED TO BOWL';
    const tossText = `${winnerName.toUpperCase()} WON THE TOSS AND ${decisionText}`;

    let battingTeamId = tossWinner === 'teamA' ? freshTeamA.id : freshTeamB.id;
    let bowlingTeamId = tossWinner === 'teamA' ? freshTeamB.id : freshTeamA.id;

    if (tossDecision === 'bowl') {
      battingTeamId = tossWinner === 'teamA' ? freshTeamB.id : freshTeamA.id;
      bowlingTeamId = tossWinner === 'teamA' ? freshTeamA.id : freshTeamB.id;
    }

    useBroadcastStore.setState({
      battingTeamId,
      bowlingTeamId,
    });

    updateMatchSettings({
      tossWinner: winnerName,
      tossDecision,
      matchStatusText: tossText,
      totalOvers,
      currentInnings: 1,
    });

    const freshStore = useBroadcastStore.getState();
    const isBattingA = battingTeamId === freshTeamA.id || battingTeamId === 'teamA';
    const battingTeam = isBattingA ? freshStore.teamA : freshStore.teamB;
    const bowlingTeam = isBattingA ? freshStore.teamB : freshStore.teamA;

    if (battingTeam.batters[0]) updateBatterStats(battingTeam.batters[0].id, { name: strikerName, isStriker: true });
    if (battingTeam.batters[1]) updateBatterStats(battingTeam.batters[1].id, { name: nonStrikerName, isStriker: false });
    if (bowlingTeam.bowlers[0]) updateBowlerStats(bowlingTeam.bowlers[0].id, { name: bowlerName, isCurrent: true });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-gradient-to-b from-cyan-600 via-sky-700 to-blue-900 border-2 border-cyan-300 rounded-3xl shadow-2xl p-6 text-white font-sans max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black uppercase text-center mb-6 tracking-wide drop-shadow text-amber-300">
          🪙 TOSS & MATCH INITIALIZATION
        </h2>

        <form onSubmit={handleStartMatch} className="space-y-4">
          {/* Who Won The Toss */}
          <div>
            <label className="block text-xs font-black uppercase mb-1 text-cyan-100">
              Who Won The Toss?
            </label>
            <select
              value={tossWinner}
              onChange={(e) => setTossWinner(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-cyan-400 rounded-xl text-white font-black text-sm focus:outline-none"
            >
              <option value="teamA">{teamA.fullName} ({teamA.shortName})</option>
              <option value="teamB">{teamB.fullName} ({teamB.shortName})</option>
            </select>
          </div>

          {/* Toss Decision */}
          <div>
            <label className="block text-xs font-black uppercase mb-1 text-cyan-100">
              Toss Decision:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTossDecision('bat')}
                className={`py-2.5 rounded-xl font-black text-xs uppercase border transition-all ${
                  tossDecision === 'bat'
                    ? 'bg-amber-400 text-slate-950 border-white shadow-lg'
                    : 'bg-slate-950 text-slate-300 border-slate-700'
                }`}
              >
                🏏 OPTED TO BAT
              </button>
              <button
                type="button"
                onClick={() => setTossDecision('bowl')}
                className={`py-2.5 rounded-xl font-black text-xs uppercase border transition-all ${
                  tossDecision === 'bowl'
                    ? 'bg-amber-400 text-slate-950 border-white shadow-lg'
                    : 'bg-slate-950 text-slate-300 border-slate-700'
                }`}
              >
                ⚾ OPTED TO BOWL
              </button>
            </div>
          </div>

          {/* Total Overs */}
          <div>
            <label className="block text-xs font-black uppercase mb-1 text-cyan-100">
              Total Overs:
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={totalOvers}
              onChange={(e) => setTotalOvers(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-950 border border-cyan-400 rounded-xl text-white font-black text-sm focus:outline-none"
            />
          </div>

          {/* Opening Batters & Bowler */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-cyan-400/30">
            <div>
              <label className="block text-[10px] font-black uppercase mb-1 text-cyan-200">Striker (*)</label>
              <input
                type="text"
                value={strikerName}
                onChange={(e) => setStrikerName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase mb-1 text-cyan-200">Non-Striker</label>
              <input
                type="text"
                value={nonStrikerName}
                onChange={(e) => setNonStrikerName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase mb-1 text-cyan-200">Bowler</label>
              <input
                type="text"
                value={bowlerName}
                onChange={(e) => setBowlerName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-3 rounded-xl shadow-xl uppercase tracking-wider text-xs active:scale-95 transition-all"
            >
              START 1ST INNINGS
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-3 rounded-xl shadow-lg uppercase tracking-wider text-xs active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
