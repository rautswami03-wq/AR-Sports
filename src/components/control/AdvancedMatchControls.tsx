import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  PlusCircle,
  Target,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

export interface AdvancedMatchControlsProps {
  onOpenBowlerModal?: () => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const AdvancedMatchControls: React.FC<AdvancedMatchControlsProps> = ({
  onOpenBowlerModal,
  className = '',
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [customAnimInputText, setCustomAnimInputText] = useState('');
  const [statusTextInput, setStatusTextInput] = useState('');

  const {
    teamA,
    teamB,
    battingTeamId,
    matchDetails,
    activeOverlays,
    historyStack,
    addExtra,
    addWicket,
    addPenaltyRuns,
    updateMatchSettings,
    switchStrikers,
    retireBatter,
    startSecondInnings,
    endMatch,
    undoLastBall,
    setBattingTeam,
    triggerAnimation,
    clearAnimation,
    setDecision,
    setGraphType,
    toggleOverlay,
  } = useBroadcastStore();

  const isTeamA =
    battingTeamId === teamA.id ||
    battingTeamId === teamA.shortName ||
    battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const [targetRunsInput, setTargetRunsInput] = useState<number>(matchDetails.targetRuns || 0);
  const [setupOvers, setSetupOvers] = useState<number>(matchDetails.totalOvers || 20);

  // Dynamic Chase Calculator logic
  const totalBallsQuota = (matchDetails.totalOvers || 20) * 6;
  const ballsBowledSoFar = battingTeam.overs * 6 + battingTeam.balls;
  const ballsRemaining = Math.max(0, totalBallsQuota - ballsBowledSoFar);
  const runsNeeded = matchDetails.targetRuns
    ? Math.max(0, matchDetails.targetRuns - battingTeam.score)
    : 0;
  const requiredRunRate =
    ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';
  const currentRunRate =
    ballsBowledSoFar > 0
      ? (battingTeam.score / (ballsBowledSoFar / 6)).toFixed(2)
      : '0.00';

  return (
    <div className={`w-full ${className}`}>
      {/* Collapsible Trigger Bar */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 bg-slate-900 border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl text-amber-400 font-black text-sm uppercase tracking-widest shadow-xl transition-all"
        data-testid="toggle-advanced-controls-btn"
      >
        <span className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>ADVANCED MATCH CONTROLS & EXTRAS</span>
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-bold">{isExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="w-full bg-slate-900/95 backdrop-blur-xl border-2 border-amber-500/40 p-6 md:p-8 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.15)] mt-4 space-y-8"
          data-testid="advanced-controls-panel"
        >
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> ADVANCED MATCH CONTROLS & EXTRAS
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                Direct Extra Runs Matrix, Target & Chase Calculator, Innings Control, DRS & Broadcast Stings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl uppercase border border-slate-700"
              >
                Close Panel
              </button>
            </div>
          </div>

          {/* SECTION 1: EXTRAS & WICKETS MATRIX */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <PlusCircle className="w-4 h-4 text-cyan-400" /> EXTRAS DIRECT ACTION MATRIX
            </h4>

            {/* Wide Runs */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">
                WIDE RUNS (+1 EXTRA RUN + ACTION RUNS & RUN OUT VARIANTS)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-2 text-xs font-black">
                {[1, 2, 3, 4, 5].map((wRun) => (
                  <button
                    key={`wide_${wRun}`}
                    onClick={() => addExtra('WIDE', wRun)}
                    className="py-2.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                  >
                    WIDE +{wRun - 1} ({wRun})
                  </button>
                ))}
                {/* Critical WIDE + RUN OUT variant */}
                <button
                  onClick={() => {
                    addExtra('WIDE', 1);
                    addWicket('run out');
                  }}
                  className="py-2.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500 rounded-xl transition-all shadow active:scale-95 uppercase font-black"
                  title="1 wide run + Batter run out"
                  data-testid="wide-run-out-btn"
                >
                  WIDE + RUN OUT
                </button>
                <button
                  onClick={() => {
                    addExtra('WIDE', 2);
                    addWicket('run out');
                  }}
                  className="py-2.5 bg-rose-700/40 hover:bg-rose-700 text-rose-200 hover:text-white border border-rose-500/70 rounded-xl transition-all shadow active:scale-95 uppercase font-black"
                  title="2 wide runs + Batter run out"
                >
                  WIDE + 1 + RUN OUT
                </button>
              </div>
            </div>

            {/* No Ball Runs */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider block">
                NO BALL RUNS (+1 EXTRA RUN + ACTION RUNS & FREE HIT)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs font-black">
                {[1, 2, 3, 4, 6].map((nbRun) => (
                  <button
                    key={`nb_${nbRun}`}
                    onClick={() => addExtra('NO_BALL', nbRun)}
                    className="py-2.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                  >
                    NO BALL +{nbRun - 1} ({nbRun})
                  </button>
                ))}
                {/* Critical NO BALL + RUN OUT variant */}
                <button
                  onClick={() => {
                    addExtra('NO_BALL', 1);
                    addWicket('run out');
                  }}
                  className="py-2.5 bg-rose-700/40 hover:bg-rose-700 text-rose-200 hover:text-white border border-rose-500/70 rounded-xl transition-all shadow active:scale-95 uppercase font-black"
                  title="1 no ball run + Batter run out"
                  data-testid="noball-run-out-btn"
                >
                  NO BALL + RUN OUT
                </button>
                <button
                  onClick={() => {
                    addExtra('NO_BALL', 1);
                    triggerAnimation('FREE_HIT');
                  }}
                  className="py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow active:scale-95 uppercase border border-yellow-300"
                >
                  ⚡ FREE HIT
                </button>
              </div>
            </div>

            {/* Bye Runs */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block">
                BYES (LEGAL BALL + NO BOWLER RUNS)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-black">
                {[1, 2, 3, 4].map((bRun) => (
                  <button
                    key={`bye_${bRun}`}
                    onClick={() => addExtra('BYE', bRun)}
                    className="py-2.5 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                  >
                    BYE (+{bRun})
                  </button>
                ))}
                <button
                  onClick={() => {
                    addExtra('BYE', 1);
                    addWicket('run out');
                  }}
                  className="py-2.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500 rounded-xl transition-all shadow active:scale-95 uppercase font-black"
                >
                  BYE + RUN OUT
                </button>
              </div>
            </div>

            {/* Leg Bye Runs */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block">
                LEG BYES (LEGAL BALL + NO BOWLER RUNS)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-black">
                {[1, 2, 3, 4].map((lbRun) => (
                  <button
                    key={`legbye_${lbRun}`}
                    onClick={() => addExtra('LEG_BYE', lbRun)}
                    className="py-2.5 bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                  >
                    LEG BYE (+{lbRun})
                  </button>
                ))}
                <button
                  onClick={() => {
                    addExtra('LEG_BYE', 1);
                    addWicket('run out');
                  }}
                  className="py-2.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500 rounded-xl transition-all shadow active:scale-95 uppercase font-black"
                >
                  LEG BYE + RUN OUT
                </button>
              </div>
            </div>

            {/* Penalty Runs */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block">
                PENALTY RUNS AWARD (+5 RUNS)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-black">
                <button
                  onClick={() => addPenaltyRuns('batting', 5)}
                  className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg border border-emerald-400/40 uppercase"
                >
                  🎁 +5 PENALTY RUNS TO {battingTeam.shortName || 'BATTING'}
                </button>
                <button
                  onClick={() => addPenaltyRuns('bowling', 5)}
                  className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg border border-indigo-400/40 uppercase"
                >
                  🎁 +5 PENALTY RUNS TO {bowlingTeam.shortName || 'BOWLING'}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: TARGET & DLS / OVERS ADJUSTMENT & CHASE CALCULATOR */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Target className="w-4 h-4 text-amber-400" /> TARGET & CHASE CALCULATOR EDITOR
            </h4>

            {/* Dynamic Chase Calculator Header */}
            <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-black">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded tracking-wider uppercase font-black">
                  TARGET: {matchDetails.targetRuns ? matchDetails.targetRuns : 'NOT SET'}
                </span>
                <span className="text-cyan-400 uppercase">
                  SCORE: {battingTeam.score}/{battingTeam.wickets} ({battingTeam.overs}.{battingTeam.balls} ov)
                </span>
              </div>
              <div className="text-right">
                <span className="text-amber-300 font-extrabold uppercase">
                  NEED {runsNeeded} RUNS FROM {ballsRemaining} BALLS
                </span>
                <span className="text-slate-400 ml-2 font-mono">
                  (RRR: {requiredRunRate} • CRR: {currentRunRate})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target adjustment */}
              <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase block">
                  Target Score: <span className="text-amber-400 font-black">{matchDetails.targetRuns || 'Not Set'}</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Target Runs"
                    value={targetRunsInput || ''}
                    onChange={(e) => setTargetRunsInput(Number(e.target.value))}
                    className="w-28 bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white font-black text-sm focus:outline-none focus:border-amber-400"
                    data-testid="target-runs-input"
                  />
                  <button
                    onClick={() => updateMatchSettings({ targetRuns: targetRunsInput, totalOvers: setupOvers })}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg uppercase shadow"
                    data-testid="set-target-btn"
                  >
                    Set Target
                  </button>
                  <button
                    onClick={() => {
                      updateMatchSettings({ targetRuns: undefined });
                      setTargetRunsInput(0);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs rounded-lg uppercase border border-slate-700"
                    data-testid="clear-calculator-btn"
                  >
                    Clear Calculator
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-black pt-1">
                  <button
                    onClick={() => {
                      const newT = (matchDetails.targetRuns || 0) + 1;
                      setTargetRunsInput(newT);
                      updateMatchSettings({ targetRuns: newT });
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-md border border-slate-700"
                  >
                    +1 Target
                  </button>
                  <button
                    onClick={() => {
                      const newT = Math.max(0, (matchDetails.targetRuns || 0) - 1);
                      setTargetRunsInput(newT);
                      updateMatchSettings({ targetRuns: newT });
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-md border border-slate-700"
                  >
                    -1 Target
                  </button>
                  <button
                    onClick={() => {
                      const newT = (matchDetails.targetRuns || 0) + 5;
                      setTargetRunsInput(newT);
                      updateMatchSettings({ targetRuns: newT });
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-md border border-slate-700"
                  >
                    +5 Target
                  </button>
                </div>
              </div>

              {/* Overs adjustment */}
              <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase block">
                  Total Match Overs: <span className="text-cyan-400 font-black">{matchDetails.totalOvers} Overs</span>
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={setupOvers}
                    onChange={(e) => setSetupOvers(Number(e.target.value))}
                    className="w-28 bg-slate-950 border border-slate-700 px-3 py-2 rounded-lg text-white font-black text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => updateMatchSettings({ totalOvers: setupOvers })}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-lg uppercase shadow"
                  >
                    Update Overs
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-black pt-1">
                  {[5, 10, 15, 20, 50].map((ov) => (
                    <button
                      key={`ov_${ov}`}
                      onClick={() => {
                        setSetupOvers(ov);
                        updateMatchSettings({ totalOvers: ov });
                      }}
                      className={`px-2.5 py-1 rounded-md border text-xs ${
                        matchDetails.totalOvers === ov
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {ov} Ov
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: INNINGS & ADVANCED CONTROL OPERATIONS */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <RotateCcw className="w-4 h-4 text-purple-400" /> INNINGS & ADVANCED CONTROL OPERATIONS
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-black">
              <button
                onClick={() => {
                  startSecondInnings();
                  toggleOverlay('target', true);
                }}
                className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg uppercase border border-emerald-400/30"
                data-testid="start-second-innings-btn"
              >
                🚀 START 2ND INNINGS
              </button>

              <button
                onClick={switchStrikers}
                className="py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-lg uppercase border border-sky-400/30"
                data-testid="swap-strikers-btn"
              >
                ⇄ SWAP STRIKERS
              </button>

              <button
                onClick={() => {
                  const currentIsA = battingTeamId === 'teamA' || battingTeamId === teamA.id;
                  setBattingTeam(currentIsA ? 'teamB' : 'teamA');
                }}
                className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg uppercase border border-purple-400/30"
              >
                ⇄ SWAP BATTING TEAM
              </button>

              <button
                onClick={undoLastBall}
                className="py-3 bg-rose-700 hover:bg-rose-600 text-white rounded-xl shadow-lg uppercase border border-rose-400/30"
                data-testid="undo-btn"
              >
                ↩ UNDO LAST BALL ({historyStack.length})
              </button>

              <button
                onClick={() => toggleOverlay('superOver')}
                className="py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-lg uppercase border border-amber-300"
              >
                ⚡ SUPER OVER GRAPHIC
              </button>

              <button
                onClick={retireBatter}
                className="py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-lg uppercase border border-orange-400/30"
                data-testid="retire-batter-btn"
              >
                🤕 RETIRE BATTER
              </button>

              <button
                onClick={() => onOpenBowlerModal?.()}
                className="py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg uppercase border border-cyan-400/30"
                data-testid="change-bowler-btn"
              >
                🏏 CHANGE BOWLER
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.confirm('Are you sure you want to end and archive this match?')) {
                    endMatch();
                  }
                }}
                className="py-3 bg-red-950 hover:bg-red-900 border border-red-500/60 text-red-300 rounded-xl shadow-lg uppercase font-black"
                data-testid="end-match-btn"
              >
                🚨 END & ARCHIVE MATCH
              </button>
            </div>
          </div>

          {/* SECTION 4: BROADCAST STINGS & ANIMATIONS MATRIX */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Sparkles className="w-4 h-4 text-rose-400" /> BROADCAST ANIMATIONS & STINGS MATRIX
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 text-xs font-black">
              <button
                onClick={() => triggerAnimation('FREE_HIT')}
                className="py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl shadow border border-yellow-300 uppercase"
                data-testid="anim-freehit-btn"
              >
                ⚡ FREE HIT
              </button>

              <button
                onClick={() => triggerAnimation('POWERPLAY')}
                className="py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow border border-cyan-400/40 uppercase"
                data-testid="anim-powerplay-btn"
              >
                ⚡ POWERPLAY
              </button>

              <button
                onClick={() => triggerAnimation('STRATEGIC_TIMEOUT')}
                className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow border border-indigo-400/40 uppercase"
              >
                ⏰ TIMEOUT
              </button>

              <button
                onClick={() => triggerAnimation('DRINKS_BREAK')}
                className="py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow border border-sky-400/40 uppercase"
              >
                🥤 DRINKS
              </button>

              <button
                onClick={() => triggerAnimation('FIFTY')}
                className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow border border-emerald-400/40 uppercase"
              >
                🏏 FIFTY (50)
              </button>

              <button
                onClick={() => triggerAnimation('CENTURY')}
                className="py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl shadow border border-fuchsia-400/40 uppercase"
              >
                💯 CENTURY (100)
              </button>

              <button
                onClick={() => triggerAnimation('HAT_TRICK')}
                className="py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow border border-amber-300 uppercase"
              >
                🎩 HAT-TRICK
              </button>

              <button
                onClick={() => triggerAnimation('TOUR_BOUNDARIES')}
                className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow border border-purple-400/40 uppercase"
              >
                🔥 TOUR 4/6s
              </button>

              <button
                onClick={() => triggerAnimation('MATCH_WINNER')}
                className="py-3 bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 rounded-xl shadow font-black border border-white/50 uppercase"
              >
                🏆 WINNER
              </button>

              <button
                onClick={() => triggerAnimation('END_OF_INNINGS')}
                className="py-3 bg-purple-800 hover:bg-purple-700 text-white rounded-xl shadow border border-purple-500 uppercase"
                data-testid="anim-endinnings-btn"
              >
                🏁 END INNINGS
              </button>

              <button
                onClick={clearAnimation}
                className="py-3 bg-red-800 hover:bg-red-700 text-white rounded-xl shadow border border-red-500 uppercase col-span-2"
                data-testid="stop-anim-btn"
              >
                ⛔ STOP ANIMATION
              </button>
            </div>

            {/* Custom Animation Text Input */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-black text-rose-400 uppercase w-36">Custom Anim Banner:</span>
              <input
                type="text"
                placeholder="e.g. SUPER OVER DRAMA! or HAT-TRICK ON THE CARDS!"
                value={customAnimInputText}
                onChange={(e) => setCustomAnimInputText(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-rose-400"
              />
              <button
                onClick={() => {
                  updateMatchSettings({ customAnimationText: customAnimInputText });
                  triggerAnimation('FOUR');
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider shadow"
              >
                Trigger Banner
              </button>
            </div>
          </div>

          {/* SECTION 5: DRS DECISION & MATCH STATUS BANNER */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <ShieldCheck className="w-4 h-4 text-yellow-400" /> DRS DECISION & MATCH STATUS TEXT
            </h4>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-black">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-cyan-400 uppercase">DRS Decision:</span>
                <button
                  onClick={() => setDecision('PENDING')}
                  className="bg-yellow-400 text-slate-950 font-black px-4 py-2 rounded-lg hover:bg-yellow-300 uppercase shadow"
                  data-testid="decision-pending-btn"
                >
                  PENDING
                </button>
                <button
                  onClick={() => setDecision('OUT')}
                  className="bg-red-600 text-white font-black px-4 py-2 rounded-lg hover:bg-red-500 uppercase shadow"
                  data-testid="decision-out-btn"
                >
                  OUT
                </button>
                <button
                  onClick={() => setDecision('NOT OUT')}
                  className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-lg hover:bg-emerald-400 uppercase shadow"
                  data-testid="decision-notout-btn"
                >
                  NOT OUT
                </button>
                <button
                  onClick={() => setDecision(null)}
                  className="bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg hover:bg-slate-600 uppercase shadow"
                  data-testid="decision-clear-btn"
                >
                  CLEAR
                </button>
              </div>
            </div>

            {/* Status Text Custom Input */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-black text-yellow-400 uppercase w-36">Match Status Banner:</span>
              <input
                type="text"
                placeholder="e.g. INNINGS BREAK or IN NEED OF 14 RUNS IN 6 BALLS"
                value={statusTextInput}
                onChange={(e) => setStatusTextInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={() => updateMatchSettings({ matchStatusText: statusTextInput })}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider shadow"
              >
                Update Status
              </button>
            </div>
          </div>

          {/* SECTION 6: ANALYTICS & GRAPH GRAPHICS */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" /> ADVANCED ANALYTICS & GRAPH OVERLAYS
            </h4>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-black">
              <button
                onClick={() => setGraphType('BAR')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all ${
                  matchDetails.graphType === 'BAR'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
                data-testid="graph-bar-btn"
              >
                📊 BAR CHART
              </button>
              <button
                onClick={() => setGraphType('LINE')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all ${
                  matchDetails.graphType === 'LINE'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
                data-testid="graph-line-btn"
              >
                📈 LINE GRAPH
              </button>
              <button
                onClick={() => setGraphType('DOUBLE_BAR')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all ${
                  matchDetails.graphType === 'DOUBLE_BAR'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
                data-testid="graph-doublebar-btn"
              >
                📊 DOUBLE BAR CHART
              </button>
              <button
                onClick={() => toggleOverlay('wagonWheel')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all shadow ${
                  activeOverlays.wagonWheel
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border-slate-700'
                }`}
                data-testid="overlay-wagonwheel-btn"
              >
                🕸️ WAGON WHEEL
              </button>
              <button
                onClick={() => toggleOverlay('worm')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all shadow ${
                  activeOverlays.worm
                    ? 'bg-sky-600 text-white border-sky-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                }`}
                data-testid="overlay-worm-btn"
              >
                🐛 RUN WORM
              </button>
              <button
                onClick={() => toggleOverlay('pitchMap')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all shadow ${
                  activeOverlays.pitchMap
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700'
                }`}
                data-testid="overlay-pitchmap-btn"
              >
                🎯 PITCH MAP
              </button>
              <button
                onClick={() => toggleOverlay('manhattan')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all shadow ${
                  activeOverlays.manhattan
                    ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                }`}
                data-testid="overlay-manhattan-btn"
              >
                🏙️ MANHATTAN
              </button>
              <button
                onClick={() => toggleOverlay('partnership')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all shadow ${
                  activeOverlays.partnership
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                }`}
              >
                🤝 PARTNERSHIP
              </button>
              <button
                onClick={() => toggleOverlay('fallOfWickets')}
                className={`px-4 py-2 rounded-xl uppercase border transition-all shadow ${
                  activeOverlays.fallOfWickets
                    ? 'bg-rose-600 text-white border-rose-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-slate-700'
                }`}
              >
                📉 FALL OF WICKETS
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

