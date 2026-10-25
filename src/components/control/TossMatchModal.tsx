import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface TossMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TossMatchModal: React.FC<TossMatchModalProps> = ({ isOpen, onClose }) => {
  const {
    teamA,
    teamB,
    matchDetails,
    updateMatchSettings,
    updateTeamDetails,
    updateBatterStats,
    updateBowlerStats,
    setActivePairs,
    changeBowler,
    startNewMatchWithTeams,
  } = useBroadcastStore();

  const [tossWinner, setTossWinner] = useState<'teamA' | 'teamB'>('teamA');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');
  const [totalOvers, setTotalOvers] = useState(matchDetails.totalOvers || 20);

  const isBattingA = (tossWinner === 'teamA' && tossDecision === 'bat') || (tossWinner === 'teamB' && tossDecision === 'bowl');
  const battingTeam = isBattingA ? teamA : teamB;
  const bowlingTeam = isBattingA ? teamB : teamA;

  const battingBatters = battingTeam.batters.filter(b => b.name && b.name.trim().length > 0);
  const bowlingCandidates = React.useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const bw of bowlingTeam.bowlers) {
      const trimmed = bw.name?.trim();
      if (trimmed && !seen.has(trimmed.toLowerCase())) {
        seen.add(trimmed.toLowerCase());
        list.push(trimmed);
      }
    }
    for (const b of bowlingTeam.batters) {
      const trimmed = b.name?.trim();
      if (trimmed && !seen.has(trimmed.toLowerCase())) {
        seen.add(trimmed.toLowerCase());
        list.push(trimmed);
      }
    }
    return list;
  }, [bowlingTeam.bowlers, bowlingTeam.batters]);

  const [strikerName, setStrikerName] = useState(battingBatters[0]?.name || teamA.batters[0]?.name || '');
  const [nonStrikerName, setNonStrikerName] = useState(battingBatters[1]?.name || teamA.batters[1]?.name || '');
  const [bowlerName, setBowlerName] = useState(bowlingCandidates[0] || teamB.bowlers[0]?.name || '');

  React.useEffect(() => {
    if (battingBatters.length > 0) {
      setStrikerName(battingBatters[0]?.name || '');
      setNonStrikerName(battingBatters[1]?.name || battingBatters[0]?.name || '');
    }
    if (bowlingCandidates.length > 0) {
      setBowlerName(bowlingCandidates[0] || '');
    }
  }, [tossWinner, tossDecision, teamA.batters, teamB.batters]);

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
    const isBattingFreshA = battingTeamId === freshTeamA.id || battingTeamId === 'teamA';
    const activeBatting = isBattingFreshA ? freshStore.teamA : freshStore.teamB;

    const strikerObj = activeBatting.batters.find(b => b.name === strikerName) || activeBatting.batters[0];
    const nonStrikerObj = activeBatting.batters.find(b => b.name === nonStrikerName) || activeBatting.batters[1];

    if (strikerObj && nonStrikerObj) {
      setActivePairs(strikerObj.id, nonStrikerObj.id);
    } else if (strikerObj) {
      updateBatterStats(strikerObj.id, { isStriker: true });
    }

    if (bowlerName) {
      changeBowler(bowlerName);
    }

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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-black uppercase text-cyan-200">Striker (*)</label>
                <span className="text-[9px] text-cyan-300 font-bold uppercase">{battingTeam.shortName || 'BAT'}</span>
              </div>
              <div className="relative">
                <select
                  value={strikerName}
                  disabled={battingBatters.length === 0}
                  onChange={(e) => setStrikerName(e.target.value)}
                  className={`w-full px-3 py-2 pr-8 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer ${
                    battingBatters.length === 0 ? 'opacity-60 cursor-not-allowed text-slate-400' : ''
                  }`}
                >
                  {battingBatters.length === 0 ? (
                    <option value="" disabled>-- Paste players above first --</option>
                  ) : (
                    <>
                      <option value="">Select Opening Striker...</option>
                      {battingBatters.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-black uppercase text-cyan-200">Non-Striker</label>
                <span className="text-[9px] text-cyan-300 font-bold uppercase">{battingTeam.shortName || 'BAT'}</span>
              </div>
              <div className="relative">
                <select
                  value={nonStrikerName}
                  disabled={battingBatters.length === 0}
                  onChange={(e) => setNonStrikerName(e.target.value)}
                  className={`w-full px-3 py-2 pr-8 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer ${
                    battingBatters.length === 0 ? 'opacity-60 cursor-not-allowed text-slate-400' : ''
                  }`}
                >
                  {battingBatters.length === 0 ? (
                    <option value="" disabled>-- Paste players above first --</option>
                  ) : (
                    <>
                      <option value="">Select Non-Striker...</option>
                      {battingBatters.map((b) => (
                        <option key={b.id} value={b.name} disabled={b.name === strikerName}>
                          {b.name} {b.name === strikerName ? '(Striker)' : ''}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-black uppercase text-cyan-200">Bowler</label>
                <span className="text-[9px] text-cyan-300 font-bold uppercase">{bowlingTeam.shortName || 'BOWL'}</span>
              </div>
              <div className="relative">
                <select
                  value={bowlerName}
                  disabled={bowlingCandidates.length === 0}
                  onChange={(e) => setBowlerName(e.target.value)}
                  className={`w-full px-3 py-2 pr-8 bg-slate-950 border border-slate-700 rounded-lg text-white font-bold text-xs focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer ${
                    bowlingCandidates.length === 0 ? 'opacity-60 cursor-not-allowed text-slate-400' : ''
                  }`}
                >
                  {bowlingCandidates.length === 0 ? (
                    <option value="" disabled>-- Paste players above first --</option>
                  ) : (
                    <>
                      <option value="">Select Opening Bowler...</option>
                      {bowlingCandidates.map((name, idx) => (
                        <option key={idx} value={name}>
                          {name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
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
