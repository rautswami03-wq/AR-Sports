import React, { useState, useEffect } from 'react';
import { X, HelpCircle, Check, AlertTriangle } from 'lucide-react';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { getResourcesRemaining, calculateDLSTarget } from '../../utils/dls';

interface DLSCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DLSCalculatorModal: React.FC<DLSCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { matchDetails, teamA, teamB, battingTeamId, updateMatchSettings } = useBroadcastStore();

  const isTeamA = battingTeamId === 'teamA' || battingTeamId === teamA.id;
  const team1 = isTeamA ? teamA : teamB;
  const team2 = isTeamA ? teamB : teamA;

  // Configuration options
  const [matchFormatOvers, setMatchFormatOvers] = useState<number>(matchDetails.totalOvers || 20);
  const [team1Score, setTeam1Score] = useState<number>(team1.score || 150);
  const [team1IsAllOut, setTeam1IsAllOut] = useState<boolean>(team1.wickets === 10);
  const [team1OversBatted, setTeam1OversBatted] = useState<number>(parseFloat(`${team1.overs}.${team1.balls}`) || 20);
  const [team1WicketsLost, setTeam1WicketsLost] = useState<number>(team1.wickets || 0);

  // Scenario
  const [interruptionScenario, setInterruptionScenario] = useState<'BEFORE_T2' | 'DURING_T2'>('BEFORE_T2');

  // Team 2 Settings (Before starts)
  const [t2RevisedTotalOvers, setT2RevisedTotalOvers] = useState<number>(matchDetails.totalOvers || 20);

  // Team 2 Settings (During chase interruption)
  const [t2OversFacedAtStoppage, setT2OversFacedAtStoppage] = useState<number>(10);
  const [t2WicketsLostAtStoppage, setT2WicketsLostAtStoppage] = useState<number>(3);
  const [t2RevisedTotalOversDuring, setT2RevisedTotalOversDuring] = useState<number>(15);

  // Calculation outputs
  const [r1, setR1] = useState<number>(100);
  const [r2, setR2] = useState<number>(100);
  const [calculatedTarget, setCalculatedTarget] = useState<number>(151);
  const [calculatedPar, setCalculatedPar] = useState<number>(150);

  useEffect(() => {
    // 1. Calculate Team 1 Resources (R1)
    let resources1 = 100;
    if (team1IsAllOut) {
      // If all out, they consumed 100% of whatever overs they were allocated
      resources1 = getResourcesRemaining(matchFormatOvers, 0);
    } else {
      // If not all out, calculate if they faced less overs than starting quota
      if (team1OversBatted < matchFormatOvers) {
        // Interrupted innings
        const startingResources = getResourcesRemaining(matchFormatOvers, 0);
        const remainingResources = getResourcesRemaining(matchFormatOvers - team1OversBatted, team1WicketsLost);
        resources1 = startingResources - remainingResources;
      } else {
        resources1 = getResourcesRemaining(matchFormatOvers, 0);
      }
    }
    setR1(resources1);

    // 2. Calculate Team 2 Resources (R2)
    let resources2 = 100;
    if (interruptionScenario === 'BEFORE_T2') {
      resources2 = getResourcesRemaining(t2RevisedTotalOvers, 0);
    } else {
      // Interrupted during chase
      const startingResources = getResourcesRemaining(matchFormatOvers, 0);
      const remainingBefore = getResourcesRemaining(matchFormatOvers - t2OversFacedAtStoppage, t2WicketsLostAtStoppage);
      const remainingAfter = getResourcesRemaining(t2RevisedTotalOversDuring - t2OversFacedAtStoppage, t2WicketsLostAtStoppage);
      resources2 = startingResources - (remainingBefore - remainingAfter);
    }
    setR2(resources2);

    // 3. Calculate target
    // Auto-detect average 50-over score parameter (G50): 245 for T20/100-ball, 225 for longer
    const g50 = matchFormatOvers <= 20 ? 245 : 225;
    const { target, parScore } = calculateDLSTarget(team1Score, resources1, resources2, g50);
    setCalculatedTarget(target);
    setCalculatedPar(parScore);
  }, [
    matchFormatOvers,
    team1Score,
    team1IsAllOut,
    team1OversBatted,
    team1WicketsLost,
    interruptionScenario,
    t2RevisedTotalOvers,
    t2OversFacedAtStoppage,
    t2WicketsLostAtStoppage,
    t2RevisedTotalOversDuring
  ]);

  if (!isOpen) return null;

  const handleApplyTarget = () => {
    updateMatchSettings({
      targetRuns: calculatedTarget,
      totalOvers: interruptionScenario === 'BEFORE_T2' ? t2RevisedTotalOvers : t2RevisedTotalOversDuring
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full inline-block"></span>
              Automated DLS Target Calculator
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              Duckworth-Lewis-Stern Standard Edition Target Revisions
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* TEAM 1 (FIRST INNINGS) METRICS */}
          <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block border-b border-slate-900 pb-1">
              Team 1: {team1.fullName}
            </span>
            
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-300">
              <div>
                <label className="block mb-1 text-[10px] uppercase text-slate-400">Match Format (Overs)</label>
                <input
                  type="number"
                  value={matchFormatOvers}
                  onChange={(e) => setMatchFormatOvers(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-black"
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase text-slate-400">Final Innings Score</label>
                <input
                  type="number"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-black"
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase text-slate-400">Overs Batted</label>
                <input
                  type="number"
                  step="0.1"
                  value={team1OversBatted}
                  onChange={(e) => setTeam1OversBatted(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-black"
                />
              </div>
              <div>
                <label className="block mb-1 text-[10px] uppercase text-slate-400">Wickets Lost</label>
                <input
                  type="number"
                  value={team1WicketsLost}
                  onChange={(e) => setTeam1WicketsLost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-black"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="t1AllOut"
                checked={team1IsAllOut}
                onChange={(e) => setTeam1IsAllOut(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-800"
              />
              <label htmlFor="t1AllOut" className="text-xs font-bold text-slate-300 uppercase cursor-pointer select-none">
                Team 1 was All Out
              </label>
            </div>
          </div>

          {/* INTERRUPTION SCENARIO OPTIONS */}
          <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-black text-rose-400 uppercase tracking-widest block border-b border-slate-900 pb-1">
              Interruption Stage
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInterruptionScenario('BEFORE_T2')}
                className={`flex-1 py-2 px-3 text-xs font-black rounded-xl border transition-all uppercase ${
                  interruptionScenario === 'BEFORE_T2'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Before Innings 2 Starts
              </button>
              <button
                type="button"
                onClick={() => setInterruptionScenario('DURING_T2')}
                className={`flex-1 py-2 px-3 text-xs font-black rounded-xl border transition-all uppercase ${
                  interruptionScenario === 'DURING_T2'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                During Chase
              </button>
            </div>

            {/* Scenario Fields */}
            {interruptionScenario === 'BEFORE_T2' ? (
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-400">Team 2 Revised Overs Quota</label>
                <input
                  type="number"
                  value={t2RevisedTotalOvers}
                  onChange={(e) => setT2RevisedTotalOvers(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-white font-black text-sm"
                />
                <p className="text-[9px] text-slate-500 font-bold uppercase pt-1">
                  Adjust this value to match the shortened overs set for Team 2 prior to their chase.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-300">
                <div className="col-span-2">
                  <label className="block mb-1 text-[10px] uppercase text-slate-400">Revised Match Overs for Chase</label>
                  <input
                    type="number"
                    value={t2RevisedTotalOversDuring}
                    onChange={(e) => setT2RevisedTotalOversDuring(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[10px] uppercase text-slate-400">Overs Played at Stoppage</label>
                  <input
                    type="number"
                    step="0.1"
                    value={t2OversFacedAtStoppage}
                    onChange={(e) => setT2OversFacedAtStoppage(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[10px] uppercase text-slate-400">Wickets Lost at Stoppage</label>
                  <input
                    type="number"
                    value={t2WicketsLostAtStoppage}
                    onChange={(e) => setT2WicketsLostAtStoppage(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white font-black text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Calculations Overlay */}
        <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block border-b border-slate-900 pb-1">
            Calculated DLS Resources & Targets
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Team 1 Resources (R1)</span>
              <span className="text-lg font-black text-cyan-400">{r1.toFixed(1)}%</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Team 2 Resources (R2)</span>
              <span className="text-lg font-black text-rose-400">{r2.toFixed(1)}%</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <span className="text-[9px] font-black uppercase text-slate-400 block">Par Score</span>
              <span className="text-lg font-black text-white">{calculatedPar} Runs</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-2xl border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <span className="text-[9px] font-black uppercase text-amber-400 block">Revised Target (To Win)</span>
              <span className="text-xl font-black text-amber-400">{calculatedTarget} Runs</span>
            </div>
          </div>

          <div className="flex gap-2.5 items-start p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              {r2 <= r1 ? (
                <span>
                  Team 2 has **fewer resources** than Team 1 ({r2.toFixed(1)}% vs {r1.toFixed(1)}%). 
                  The target is reduced proportionally: target = (Team 1 Score * {r2.toFixed(1)} / {r1.toFixed(1)}) + 1.
                </span>
              ) : (
                <span>
                  Team 2 has **more resources** than Team 1 ({r2.toFixed(1)}% vs {r1.toFixed(1)}%). 
                  The target is increased using average 50-over score scaling: target = Team 1 Score + (Average Score * (R2 - R1) / 100) + 1.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyTarget}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl uppercase flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:scale-105 active:scale-95"
          >
            <Check className="w-4 h-4 font-black" /> Apply Revised Target to Broadcast
          </button>
        </div>

      </div>
    </div>
  );
};
