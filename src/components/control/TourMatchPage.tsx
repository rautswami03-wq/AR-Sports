import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { PRESET_TOURNAMENTS } from '../../theme/presetThemes';
import {
  Send,
  Edit3,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Tv,
  Palette,
  Play,
  Square,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  Sliders,
  PlusCircle,
  RotateCcw,
  BarChart2,
  Target,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { OverlayType } from '../../types/cricket';
import { CricNavbar } from '../common/CricNavbar';
import { ChangeBowlerModal } from './ChangeBowlerModal';
import { WicketModal } from './WicketModal';
import { PlayerListModal } from './PlayerListModal';
import { TossMatchModal } from './TossMatchModal';
import { EditMatchModal } from './EditMatchModal';
import { OverlayStage } from './OverlayStage';

export const TourMatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    teamA,
    teamB,
    matchDetails,
    battingTeamId,
    activeOverlays,
    toggleOverlay,
    hideAllOverlays,
    triggerAnimation,
    addRuns,
    addExtra,
    addPenaltyRuns,
    addWicket,
    switchStrikers,
    retireBatter,
    changeBowler,
    undoLastBall,
    updateTeamColors,
    updateTeamDetails,
    updateMatchSettings,
    startNewMatchWithTeams,
    startSecondInnings,
    setDecision,
    setBattingTeam,
    setGraphType,
    resetMatchState,
    historyStack,
    clearAnimation,
    updateBatterStats,
    updateBowlerStats,
    setActivePairs,
    bulkAddPlayers,
    tournamentId,
    setTournamentId,
    startMatch,
    stopMatch,
  } = useBroadcastStore();

  const isMatchStarted = matchDetails.isMatchStarted ?? false;

  // Pre-Match Setup Form State
  const [setupOvers, setSetupOvers] = useState(matchDetails.totalOvers || 20);
  const [teamABulkText, setTeamABulkText] = useState('');
  const [teamBBulkText, setTeamBBulkText] = useState('');

  // Pre-populate textareas on load
  React.useEffect(() => {
    if (teamA.batters && !teamABulkText) {
      setTeamABulkText(teamA.batters.map(b => b.name).join('\n'));
    }
  }, [teamA.batters]);

  React.useEffect(() => {
    if (teamB.batters && !teamBBulkText) {
      setTeamBBulkText(teamB.batters.map(b => b.name).join('\n'));
    }
  }, [teamB.batters]);

  const applyBulkNames = (teamId: 'teamA' | 'teamB', text: string) => {
    const names = text.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    if (names.length === 0) return;
    const team = teamId === 'teamA' ? teamA : teamB;
    
    names.forEach((name, idx) => {
      if (idx < team.batters.length) {
        updateBatterStats(team.batters[idx].id, { name });
      }
    });

    if (names.length > team.batters.length) {
      const extraNames = names.slice(team.batters.length);
      bulkAddPlayers(teamId, extraNames);
    }
  };
  const [setupBallsPerOver, setSetupBallsPerOver] = useState(matchDetails.ballsPerOver || 6);
  const [setupMatchType, setSetupMatchType] = useState(matchDetails.matchType || 'Group Stage');
  const [setupMatchNo, setSetupMatchNo] = useState(matchDetails.matchNo || 1);
  const [setupVenue, setSetupVenue] = useState(matchDetails.venue || 'Stadium Ground');
  const [setupTossWinner, setSetupTossWinner] = useState(matchDetails.tossWinner || teamA.fullName);
  const [setupTossDecision, setSetupTossDecision] = useState<'bat' | 'bowl'>(matchDetails.tossDecision || 'bat');

  // Advanced Match Control Form State
  const [customAnimInputText, setCustomAnimInputText] = useState('');
  const [targetRunsInput, setTargetRunsInput] = useState<number>(matchDetails.targetRuns || 0);
  const [statusTextInput, setStatusTextInput] = useState<string>(matchDetails.matchStatusText || '');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const [extraWide, setExtraWide] = useState(false);
  const [extraNoBall, setExtraNoBall] = useState(false);
  const [extraByes, setExtraByes] = useState(false);
  const [extraLegByes, setExtraLegByes] = useState(false);
  const [extraWicket, setExtraWicket] = useState(false);

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showPlayerTeamId, setShowPlayerTeamId] = useState<'teamA' | 'teamB' | null>(null);
  const [showTossModal, setShowTossModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  const handleScoreClick = (runs: number) => {
    if (extraWicket) {
      addWicket();
      setExtraWicket(false);
      return;
    }

    if (extraWide) {
      addExtra('WIDE', runs + 1);
      setExtraWide(false);
    } else if (extraNoBall) {
      addExtra('NO_BALL', runs + 1);
      setExtraNoBall(false);
    } else if (extraByes) {
      addExtra('BYE', runs);
      setExtraByes(false);
    } else if (extraLegByes) {
      addExtra('LEG_BYE', runs);
      setExtraLegByes(false);
    } else {
      const isBoundary = runs === 4 || runs === 6;
      const boundaryType = runs === 4 ? 4 : runs === 6 ? 6 : undefined;
      addRuns(runs, isBoundary, boundaryType);
    }
  };

  const [editTeamA, setEditTeamA] = useState(teamA.fullName);
  const [editTeamAShort, setEditTeamAShort] = useState(teamA.shortName);
  const [editTeamB, setEditTeamB] = useState(teamB.fullName);
  const [editTeamBShort, setEditTeamBShort] = useState(teamB.shortName);
  const [editTourName, setEditTourName] = useState(matchDetails.tournament);
  const [editTotalOvers, setEditTotalOvers] = useState(matchDetails.totalOvers);

  React.useEffect(() => {
    if (!id || typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('ar_sports_tournaments_v1') || localStorage.getItem('cricscorer_tournaments_v1');
      if (saved) {
        const items = JSON.parse(saved);
        const tour = items.find((t: any) => t.id === id);
        if (tour) {
          if (teamA.fullName !== tour.teamA || teamB.fullName !== tour.teamB) {
            startNewMatchWithTeams(tour.teamA, tour.teamB, tour.name);
          }
          if (tour.tossText) setTossText(tour.tossText);
        }
      }
    } catch (e) {
      console.warn('Failed to sync tour match:', e);
    }
  }, [id]);

  const [tossText, setTossText] = useState(
    `${teamB.fullName.toUpperCase()} WON THE TOSS AND OPTED TO BOWL`
  );

  const [customInputText, setCustomInputText] = useState('Jagdish Pawar');
  const [selectedMOM, setSelectedMOM] = useState('nagesh chitia (ashtavinayak indians)');
  const [selectedTourPlayer, setSelectedTourPlayer] = useState('ajit khade (ashtavinayak indians)');
  const [showExtraController, setShowExtraController] = useState(false);

  // Color Pickers
  const [team1Color, setTeam1Color] = useState(teamA.primaryColor);
  const [team2Color, setTeam2Color] = useState(teamB.primaryColor);

  const [showSendToast, setShowSendToast] = useState(false);

  const handleSendUpdate = () => {
    useBroadcastStore.getState().toggleOverlay('scoreBug', true);
    setShowSendToast(true);
    setTimeout(() => setShowSendToast(false), 3500);
  };

  const handleChangeToss = () => {
    setShowTossModal(true);
  };

  const handleSaveTeamColors = () => {
    updateTeamColors('teamA', team1Color, teamA.secondaryColor);
    updateTeamColors('teamB', team2Color, teamB.secondaryColor);
  };

  // Start Match Action
  const handleStartMatchWorkflow = () => {
    // Apply bulk names
    if (teamABulkText) applyBulkNames('teamA', teamABulkText);
    if (teamBBulkText) applyBulkNames('teamB', teamBBulkText);

    const formattedToss = `${setupTossWinner.toUpperCase()} WON THE TOSS AND OPTED TO ${setupTossDecision.toUpperCase()}`;
    setTossText(formattedToss);

    updateMatchSettings({
      tournament: editTourName || matchDetails.tournament,
      totalOvers: Number(setupOvers),
      ballsPerOver: Number(setupBallsPerOver),
      matchType: setupMatchType,
      matchNo: Number(setupMatchNo),
      venue: setupVenue,
      tossWinner: setupTossWinner,
      tossDecision: setupTossDecision,
      matchStatusText: formattedToss,
    });

    updateTeamColors('teamA', team1Color, teamA.secondaryColor);
    updateTeamColors('teamB', team2Color, teamB.secondaryColor);
    updateTeamDetails('teamA', { fullName: editTeamA, shortName: editTeamAShort });
    updateTeamDetails('teamB', { fullName: editTeamB, shortName: editTeamBShort });

    startMatch();
  };

  const handlePauseMatchWorkflow = () => {
    stopMatch();
  };

  const displayButtons: { id: OverlayType; label: string; bg: string }[] = [
    { id: 'scoreBug', label: 'DEFAULT', bg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black' },
    { id: 'battingLowerThird', label: '11BAT', bg: 'bg-pink-600 hover:bg-pink-500 text-white font-black' },
    { id: 'bowlingLowerThird', label: '11BALL', bg: 'bg-pink-600 hover:bg-pink-500 text-white font-black' },
    { id: 'battingScorecard', label: '12BAT', bg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black' },
    { id: 'bowlingScorecard', label: '12BALL', bg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black' },
    { id: 'matchSummary', label: 'SUMMARY', bg: 'bg-purple-600 hover:bg-purple-500 text-white font-black' },
    { id: 'fallOfWickets', label: 'FOW', bg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black' },
    { id: 'currentBatters', label: 'B1', bg: 'bg-pink-600 hover:bg-pink-500 text-white font-black' },
    { id: 'currentBatters', label: 'B2', bg: 'bg-pink-600 hover:bg-pink-500 text-white font-black' },
    { id: 'currentBowler', label: 'BOWLER', bg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black' },
    { id: 'target', label: 'TARGET', bg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black' },
    { id: 'partnership', label: 'PARTNERSHIP', bg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black' },
    { id: 'playingXI', label: 'TEAMS PLAYERS', bg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black' },
    { id: 'pitchMap', label: 'PITCH MAP', bg: 'bg-amber-600 hover:bg-amber-500 text-white font-black' },
    { id: 'manhattan', label: 'MANHATTAN', bg: 'bg-indigo-600 hover:bg-indigo-500 text-white font-black' },
    { id: 'wagonWheel', label: 'WAGON WHEEL', bg: 'bg-emerald-600 hover:bg-emerald-500 text-white font-black' },
    { id: 'commentator', label: 'COMMENTATOR', bg: 'bg-purple-600 hover:bg-purple-500 text-white font-black' },
    { id: 'watermark', label: 'WATERMARK', bg: 'bg-sky-600 hover:bg-sky-500 text-white font-black' },
    { id: 'scoreBug', label: 'SCORE', bg: 'bg-blue-600 hover:bg-blue-500 text-white font-black' },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #020408 0%, #070c16 100%)", color: "#f1f5f9", fontFamily: "Inter, sans-serif", overflowY: "auto", paddingBottom: "80px" }}>
      <CricNavbar />

      {/* Floating OBS Broadcast Confirmation Toast Popup */}
      <AnimatePresence>
        {showSendToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            style={{ position: "fixed", top: "72px", left: "50%", transform: "translateX(-50%)", zIndex: 60, background: "linear-gradient(135deg, #059669, #10b981)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "12px", padding: "12px 24px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 8px 40px rgba(16,185,129,0.6)", color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            <CheckCircle2 className="w-6 h-6 text-slate-950 animate-pulse" />
            <span>⚡ OBS BROADCAST UPDATED! OVERLAY SYNC ACTIVE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ maxWidth: "920px", margin: "0 auto", padding: "28px 16px 60px", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        {/* Workflow Progress Breadcrumb Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl mb-8 flex flex-wrap items-center justify-between gap-3 text-xs font-black uppercase">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 1. TOURNAMENT
            </span>
            <span className="text-slate-600">➔</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Users className="w-4 h-4 text-cyan-400" /> 2. MATCH & TEAMS
            </span>
            <span className="text-slate-600">➔</span>
            <span className={isMatchStarted ? 'text-emerald-400' : 'text-amber-400'}>
              {isMatchStarted ? '3. MATCH LIVE' : '3. ENTER DETAILS & START'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isMatchStarted ? (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> OVERLAY LIVE
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> PRE-MATCH SETUP (OVERLAY HIDDEN)
              </span>
            )}
          </div>
        </div>

        {/* Live Broadcast Stage Preview (1920x1080) */}
        <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-2xl mb-8 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-sky-400" /> Live Stage Preview (1920×1080)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-mono">
              {isMatchStarted ? 'OBS Broadcast Active' : 'Overlay Hidden Until Match Starts'}
            </span>
          </div>

          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0f172a 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {!isMatchStarted && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-1">
                  MATCH NOT STARTED YET
                </h3>
                <p className="text-xs font-bold text-slate-400 max-w-md uppercase mb-4">
                  Enter match, overs & player details below, then click <span className="text-emerald-400 font-black">START MATCH & LAUNCH OVERLAY</span> to activate the broadcast graphics!
                </p>
              </div>
            )}

            <div className="transform scale-[0.34] sm:scale-[0.42] md:scale-[0.48] origin-center">
              <OverlayStage />
            </div>
          </div>
        </div>

        {/* Versus Match Banner */}
        <div style={{ background: "linear-gradient(145deg, #0c1220, #070c16)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px 22px", marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div className="flex items-center justify-between w-full gap-4">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight flex-1 truncate text-slate-950">
              {teamA.fullName}
            </h2>
            <div className="px-5 py-1.5 bg-slate-950 text-amber-400 font-black text-xl rounded-2xl border border-white/20 shadow">
              VS
            </div>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight flex-1 truncate text-slate-950">
              {teamB.fullName}
            </h2>
          </div>
          <div className="px-6 py-2 bg-slate-950/90 text-amber-300 rounded-2xl text-xs font-black uppercase tracking-wider border border-white/10 max-w-xl shadow-inner">
            {tossText}
          </div>
        </div>

        {/* WORKFLOW STEP: PRE-MATCH DETAILS ENTRY FORM (If Match Not Started) */}
        {!isMatchStarted ? (
          <div className="w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/50 p-6 rounded-3xl shadow-2xl mb-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">MATCH SETUP & DETAILS ENTRY</span>
                <h3 className="text-2xl font-black text-white uppercase flex items-center gap-2">
                  <Edit3 className="w-6 h-6 text-cyan-400" /> Enter Match, Overs & Players Details
                </h3>
              </div>
              <span className="px-4 py-1.5 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-xl text-xs font-black uppercase">
                Step 3 of 4
              </span>
            </div>

            {/* Section 1: Match & Overs Info */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider">1. Match & Overs Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Tournament Name</label>
                  <input
                    type="text"
                    value={editTourName}
                    onChange={(e) => setEditTourName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Total Overs</label>
                  <input
                    type="number"
                    value={setupOvers}
                    onChange={(e) => setSetupOvers(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Balls Per Over</label>
                  <select
                    value={setupBallsPerOver}
                    onChange={(e) => setSetupBallsPerOver(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400 uppercase"
                  >
                    <option value={6}>6 Balls</option>
                    <option value={8}>8 Balls</option>
                    <option value={4}>4 Balls</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Match Type</label>
                  <select
                    value={setupMatchType}
                    onChange={(e) => setSetupMatchType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400 uppercase"
                  >
                    <option value="Group Stage">Group Stage</option>
                    <option value="Quarter Final">Quarter Final</option>
                    <option value="Semi Final">Semi Final</option>
                    <option value="Final font-black">Final</option>
                    <option value="Knockout">Knockout</option>
                    <option value="League Match">League Match</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Match No.</label>
                  <input
                    type="number"
                    value={setupMatchNo}
                    onChange={(e) => setSetupMatchNo(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Venue / Stadium</label>
                  <input
                    type="text"
                    value={setupVenue}
                    onChange={(e) => setSetupVenue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Teams & Colors */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider">2. Team Names & Colors</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Team A */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-cyan-300 uppercase block">TEAM 1 / TEAM A</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Full Name</label>
                      <input
                        type="text"
                        value={editTeamA}
                        onChange={(e) => setEditTeamA(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Code</label>
                      <input
                        type="text"
                        value={editTeamAShort}
                        onChange={(e) => setEditTeamAShort(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-bold text-xs uppercase"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">Primary Color:</span>
                    <input
                      type="color"
                      value={team1Color}
                      onChange={(e) => setTeam1Color(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer border border-white"
                    />
                  </div>
                </div>

                {/* Team B */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-cyan-300 uppercase block">TEAM 2 / TEAM B</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Full Name</label>
                      <input
                        type="text"
                        value={editTeamB}
                        onChange={(e) => setEditTeamB(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase">Code</label>
                      <input
                        type="text"
                        value={editTeamBShort}
                        onChange={(e) => setEditTeamBShort(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-bold text-xs uppercase"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase">Primary Color:</span>
                    <input
                      type="color"
                      value={team2Color}
                      onChange={(e) => setTeam2Color(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer border border-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Players & Opening Lineup */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider">3. Players Lineup & Openers</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowPlayerTeamId('teamA')}
                  className="py-3 bg-slate-900 hover:bg-slate-850 text-cyan-400 font-black text-xs rounded-xl border border-cyan-500/40 uppercase flex items-center justify-center gap-2 shadow"
                >
                  <Users className="w-4 h-4 text-cyan-400" /> EDIT {editTeamAShort || teamA.shortName} PLAYERS LIST ({teamA.batters.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShowPlayerTeamId('teamB')}
                  className="py-3 bg-slate-900 hover:bg-slate-850 text-cyan-400 font-black text-xs rounded-xl border border-cyan-500/40 uppercase flex items-center justify-center gap-2 shadow"
                >
                  <Users className="w-4 h-4 text-cyan-400" /> EDIT {editTeamBShort || teamB.shortName} PLAYERS LIST ({teamB.batters.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-400 block uppercase">
                      Bulk Paste {editTeamAShort || teamA.shortName} Players
                    </label>
                    <button
                      type="button"
                      onClick={() => applyBulkNames('teamA', teamABulkText)}
                      className="text-[10px] font-bold text-cyan-400 uppercase hover:underline"
                    >
                      Save list
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={teamABulkText}
                    onChange={(e) => setTeamABulkText(e.target.value)}
                    placeholder="Enter one name per line..."
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-400 block uppercase">
                      Bulk Paste {editTeamBShort || teamB.shortName} Players
                    </label>
                    <button
                      type="button"
                      onClick={() => applyBulkNames('teamB', teamBBulkText)}
                      className="text-[10px] font-bold text-cyan-400 uppercase hover:underline"
                    >
                      Save list
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={teamBBulkText}
                    onChange={(e) => setTeamBBulkText(e.target.value)}
                    placeholder="Enter one name per line..."
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-amber-400 block mb-1 uppercase font-black">Opening Striker (*)</label>
                  <input
                    type="text"
                    value={striker?.name || ''}
                    onChange={(e) => striker && updateBatterStats(striker.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-black text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-cyan-400 block mb-1 uppercase font-black">Non-Striker</label>
                  <input
                    type="text"
                    value={nonStriker?.name || ''}
                    onChange={(e) => nonStriker && updateBatterStats(nonStriker.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-black text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-400 block mb-1 uppercase font-black">Opening Bowler</label>
                  <input
                    type="text"
                    value={currentBowler?.name || ''}
                    onChange={(e) => currentBowler && updateBowlerStats(currentBowler.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-black text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Toss Setup */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider">4. Toss Decision</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Toss Winner</label>
                  <select
                    value={setupTossWinner}
                    onChange={(e) => setSetupTossWinner(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value={editTeamA || teamA.fullName}>{editTeamA || teamA.fullName}</option>
                    <option value={editTeamB || teamB.fullName}>{editTeamB || teamB.fullName}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1 uppercase">Opted To</label>
                  <select
                    value={setupTossDecision}
                    onChange={(e) => setSetupTossDecision(e.target.value as 'bat' | 'bowl')}
                    className="w-full bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-cyan-400 uppercase"
                  >
                    <option value="bat">Bat First</option>
                    <option value="bowl">Bowl First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action START MATCH Button */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleStartMatchWorkflow}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xl px-14 py-4 rounded-2xl border-2 border-white shadow-[0_0_50px_rgba(16,185,129,0.9)] transform hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Play className="w-7 h-7 fill-slate-950" /> START MATCH & LAUNCH OVERLAY
              </button>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                ⚡ Overlay graphics will appear on screen & OBS stream immediately after clicking Start Match.
              </p>
            </div>
          </div>
        ) : (
          /* WORKFLOW STEP: MATCH LIVE SCORING CONTROLS (If Match Started) */
          <>
            {/* Live Match Control Header Bar */}
            <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> MATCH LIVE & OVERLAY ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-black text-xs rounded-xl border border-cyan-400/40 flex items-center gap-1.5 uppercase shadow"
                >
                  <Edit3 className="w-4 h-4 text-cyan-400" /> EDIT MATCH
                </button>
                <button
                  type="button"
                  onClick={handlePauseMatchWorkflow}
                  className="px-4 py-2 bg-rose-600/90 hover:bg-rose-500 text-white font-black text-xs rounded-xl border border-rose-300/40 flex items-center gap-1.5 uppercase shadow"
                >
                  <Square className="w-4 h-4 fill-white" /> PAUSE / PRE-MATCH SETUP
                </button>
              </div>
            </div>

            {/* Live Match Score Overview Card */}
            <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block">CURRENT INNINGS</span>
                  <h3 className="text-2xl font-black text-white uppercase">{battingTeam.fullName} BATTING</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-amber-400">
                    {battingTeam.score} - {battingTeam.wickets}
                  </span>
                  <span className="text-sm font-bold text-slate-400 block">
                    ({battingTeam.overs}.{battingTeam.balls} / {matchDetails.totalOvers} OVR)
                  </span>
                </div>
              </div>

              {/* Current Batters & Bowler Bar (Editable Player Names) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-cyan-400 block uppercase font-black mb-1">STRIKER (*)</span>
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={striker?.name || ''}
                      placeholder="Enter Striker Name"
                      onChange={(e) => striker && updateBatterStats(striker.id, { name: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-black text-sm focus:outline-none focus:border-amber-400"
                    />
                    <select
                      value={striker?.id || ''}
                      onChange={(e) => {
                        const selId = e.target.value;
                        if (selId && nonStriker) setActivePairs(selId, nonStriker.id);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 text-white font-black text-xs focus:outline-none focus:border-amber-400 max-w-[120px]"
                    >
                      <option value="">Roster...</option>
                      {battingTeam.batters.filter(b => !b.isOut && b.id !== nonStriker?.id).map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-amber-400 block font-bold">{striker?.runs || 0} ({striker?.balls || 0}b)</span>
                </div>
                <div>
                  <span className="text-cyan-400 block uppercase font-black mb-1">NON-STRIKER</span>
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={nonStriker?.name || ''}
                      placeholder="Enter Non-Striker Name"
                      onChange={(e) => nonStriker && updateBatterStats(nonStriker.id, { name: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-black text-sm focus:outline-none focus:border-cyan-400"
                    />
                    <select
                      value={nonStriker?.id || ''}
                      onChange={(e) => {
                        const selId = e.target.value;
                        if (selId && striker) setActivePairs(striker.id, selId);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 text-white font-black text-xs focus:outline-none focus:border-cyan-400 max-w-[120px]"
                    >
                      <option value="">Roster...</option>
                      {battingTeam.batters.filter(b => !b.isOut && b.id !== striker?.id).map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-slate-400 block font-bold">{nonStriker?.runs || 0} ({nonStriker?.balls || 0}b)</span>
                </div>
                <div>
                  <span className="text-cyan-400 block uppercase font-black mb-1">CURRENT BOWLER</span>
                  <div className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={currentBowler?.name || ''}
                      placeholder="Enter Bowler Name"
                      onChange={(e) => currentBowler && updateBowlerStats(currentBowler.id, { name: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-black text-sm focus:outline-none focus:border-emerald-400"
                    />
                    <select
                      value={currentBowler?.id || ''}
                      onChange={(e) => {
                        const selId = e.target.value;
                        if (selId) {
                          const target = bowlingTeam.batters.find(b => b.id === selId);
                          if (target) changeBowler(target.name);
                        }
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 text-white font-black text-xs focus:outline-none focus:border-emerald-400 max-w-[120px]"
                    >
                      <option value="">Roster...</option>
                      {bowlingTeam.batters.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-emerald-400 block font-bold">
                    {currentBowler?.wickets || 0}-{currentBowler?.runsConceded || 0} ({currentBowler?.overs || 0}.{currentBowler?.ballsInCurrentOver || 0})
                  </span>
                </div>
              </div>

              {/* Extras Checkbox Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs font-black uppercase">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <input type="checkbox" checked={extraWide} onChange={(e) => setExtraWide(e.target.checked)} className="w-4 h-4 accent-amber-400" />
                  <span className={extraWide ? 'text-amber-400' : 'text-slate-300'}>WIDE (+1)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <input type="checkbox" checked={extraNoBall} onChange={(e) => setExtraNoBall(e.target.checked)} className="w-4 h-4 accent-rose-500" />
                  <span className={extraNoBall ? 'text-rose-400' : 'text-slate-300'}>NO BALL (+1)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <input type="checkbox" checked={extraByes} onChange={(e) => setExtraByes(e.target.checked)} className="w-4 h-4 accent-sky-400" />
                  <span className={extraByes ? 'text-sky-400' : 'text-slate-300'}>BYES</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <input type="checkbox" checked={extraLegByes} onChange={(e) => setExtraLegByes(e.target.checked)} className="w-4 h-4 accent-purple-400" />
                  <span className={extraLegByes ? 'text-purple-400' : 'text-slate-300'}>LEG BYES</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-red-950/80 border border-red-500/50 px-3 py-1.5 rounded-lg">
                  <input type="checkbox" checked={extraWicket} onChange={(e) => setExtraWicket(e.target.checked)} className="w-4 h-4 accent-red-500" />
                  <span className="text-red-400">OUT / WICKET</span>
                </label>
              </div>

              {/* Run Buttons Matrix (0, 1, 2, 3, 4, 5, 6) */}
              <div className="grid grid-cols-7 gap-2 pt-2">
                {[0, 1, 2, 3, 4, 5, 6].map((runVal) => (
                  <button
                    key={runVal}
                    onClick={() => handleScoreClick(runVal)}
                    className={`py-4 rounded-2xl font-black text-xl shadow-lg transform active:scale-95 transition-all uppercase ${
                      runVal === 4
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        : runVal === 6
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    +{runVal}
                  </button>
                ))}
              </div>

              {/* Quick Match Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <button onClick={() => switchStrikers()} className="py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl uppercase">
                  ⇄ SWAP BATTER
                </button>
                <button onClick={() => retireBatter()} className="py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl uppercase">
                  RETIRE BATTER
                </button>
                <button onClick={() => setShowBowlerModal(true)} className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl uppercase">
                  CHANGE BOWLER
                </button>
                <button onClick={() => setShowWicketModal(true)} className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl uppercase">
                  WICKET / DISMISSAL
                </button>
              </div>

              {/* Player Management Roster Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowPlayerTeamId('teamA')}
                  className="py-2 bg-slate-950 hover:bg-slate-800 text-cyan-400 font-black text-xs rounded-xl border border-cyan-500/40 uppercase flex items-center justify-center gap-2"
                >
                  👤+ ADD / EDIT {teamA.shortName} PLAYERS
                </button>
                <button
                  onClick={() => setShowPlayerTeamId('teamB')}
                  className="py-2 bg-slate-950 hover:bg-slate-800 text-cyan-400 font-black text-xs rounded-xl border border-cyan-500/40 uppercase flex items-center justify-center gap-2"
                >
                  👤+ ADD / EDIT {teamB.shortName} PLAYERS
                </button>
              </div>
            </div>

            {/* SEND & EDIT Buttons Bar */}
            <div className="flex items-center gap-4 mb-10">
              <button
                onClick={handleSendUpdate}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xl px-12 py-3 rounded-2xl border-2 border-white shadow-[0_0_30px_rgba(251,191,36,0.8)] transform hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2"
              >
                <Send className="w-6 h-6" /> SEND
              </button>
              <button
                onClick={() => {
                  setEditTeamA(teamA.fullName);
                  setEditTeamAShort(teamA.shortName);
                  setEditTeamB(teamB.fullName);
                  setEditTeamBShort(teamB.shortName);
                  setEditTourName(matchDetails.tournament);
                  setEditTotalOvers(matchDetails.totalOvers);
                  setShowEditModal(true);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-lg px-8 py-3 rounded-2xl border-2 border-white shadow-[0_0_30px_rgba(6,182,212,0.8)] transform hover:scale-105 active:scale-95 transition-all uppercase tracking-wider flex items-center gap-2"
              >
                <Edit3 className="w-5 h-5" /> EDIT MATCH & TEAMS
              </button>
            </div>

            {/* Action Controls Button Matrix */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
              <button
                onClick={() => {
                  toggleOverlay('tournamentTitle', false);
                  toggleOverlay('scoreBug', true);
                }}
                className="py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
              >
                Default
              </button>
              <button
                onClick={() => hideAllOverlays()}
                className="py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
              >
                HIDE ALL
              </button>
              <button
                onClick={handleChangeToss}
                className="py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
              >
                Change Toss
              </button>
              <button
                onClick={() => {
                  toggleOverlay('scoreBug', false);
                  toggleOverlay('tournamentTitle', true);
                }}
                className="py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
              >
                Tour Name
              </button>
              <button
                onClick={() => undoLastBall()}
                className="py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider col-span-2 sm:col-span-1"
              >
                UNDO
              </button>
            </div>

            {/* DISPLAY CONTROLLER */}
            <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8 space-y-6">
              <h2 className="text-xl font-black text-center text-white uppercase tracking-widest border-b border-slate-800 pb-3">
                DISPLAY CONTROLLER
              </h2>

              {/* Overlays Buttons Bar */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {displayButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleOverlay(btn.id)}
                    className={`px-3 py-2 text-xs rounded-lg uppercase tracking-wider transition-all active:scale-95 ${btn.bg} ${
                      activeOverlays[btn.id] ? 'ring-2 ring-white shadow-lg' : ''
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* DRS Decision & Animations Rows */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs font-black uppercase">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-cyan-400">DRS Decision:</span>
                  <button onClick={() => { setDecision('PENDING'); toggleOverlay('decision', true); }} className="bg-yellow-400 text-slate-950 font-black px-3 py-1.5 rounded-md hover:bg-yellow-300">PENDING</button>
                  <button onClick={() => { setDecision('OUT'); toggleOverlay('decision', true); }} className="bg-red-600 text-white font-black px-3 py-1.5 rounded-md hover:bg-red-500">OUT</button>
                  <button onClick={() => { setDecision('NOT OUT'); toggleOverlay('decision', true); }} className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-md hover:bg-emerald-400">NOT OUT</button>
                  <button onClick={() => { setDecision(null); toggleOverlay('decision', false); }} className="bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-md hover:bg-slate-600">CLEAR</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-black">Stings:</span>
                  <button onClick={() => triggerAnimation('HAT_TRICK')} className="bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-md hover:bg-amber-300">HAT-TRICK BALL</button>
                  <button onClick={() => triggerAnimation('TOUR_BOUNDARIES')} className="bg-cyan-500 text-slate-950 font-black px-3 py-1.5 rounded-md hover:bg-cyan-400">TOUR BOUNDARY</button>
                </div>
              </div>

              {/* Custom Input */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-black text-cyan-400 uppercase w-28">Custom Input:</span>
                <input
                  type="text"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => updateMatchSettings({ customInputText })}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider"
                >
                  Display Input
                </button>
              </div>

              {/* League Theme Overlay Selector */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-black text-amber-400 uppercase w-36 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-purple-400" /> League Theme:
                </span>
                <select
                  value={tournamentId || 'IPL'}
                  onChange={(e) => {
                    const newThemeId = e.target.value;
                    const themeObj = PRESET_TOURNAMENTS[newThemeId];
                    setTournamentId(newThemeId);
                    if (themeObj) {
                      updateMatchSettings({ tournament: themeObj.name });
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-cyan-400 uppercase"
                >
                  {Object.values(PRESET_TOURNAMENTS).map((t) => (
                    <option key={t.id} value={t.id}>
                      🏆 {t.name} ({t.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select MOM Player */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
                <span className="text-xs font-black text-cyan-400 uppercase w-36">Select MOM Player:</span>
                <select
                  value={selectedMOM}
                  onChange={(e) => setSelectedMOM(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-white text-xs font-bold"
                >
                  <option value="nagesh chitia (ashtavinayak indians)">nagesh chitia (ashtavinayak indians)</option>
                  <option value="S. Yadav (India)">S. Yadav (India)</option>
                  <option value="J. Bumrah (India)">J. Bumrah (India)</option>
                </select>
                <button onClick={() => toggleOverlay('playerOfTheMatch')} className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-lg uppercase">Display MOM</button>
              </div>
            </div>

            {/* TOUR STATS CONTROLLER */}
            <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8 space-y-4">
              <h2 className="text-xl font-black text-center text-white uppercase tracking-widest border-b border-slate-800 pb-3">
                TOUR STATS CONTROLLER
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button onClick={() => toggleOverlay('pointsTable')} className="px-3 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg uppercase">POINTS TABLE</button>
                <button onClick={() => toggleOverlay('topBatters')} className="px-3 py-2 bg-fuchsia-600 text-white font-black text-xs rounded-lg uppercase">TOP BATTERS</button>
                <button onClick={() => toggleOverlay('topBowlers')} className="px-3 py-2 bg-fuchsia-600 text-white font-black text-xs rounded-lg uppercase">TOP BOWLERS</button>
                <button onClick={() => toggleOverlay('playerOfTheTournament')} className="px-3 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-lg uppercase font-black">TOP PLAYER OF SERIES</button>
              </div>
            </div>
          </>
        )}

        {/* Show Extra Controller Bar */}
        <button
          onClick={() => setShowExtraController(!showExtraController)}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider mb-8 flex items-center justify-between border shadow-2xl transition-all ${
            showExtraController
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-slate-950 border-amber-300 shadow-amber-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-700 hover:border-amber-400/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5" />
            <span>ADVANCED MATCH CONTROLLER & EXTRAS MATRIX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-950/40 uppercase">
              {showExtraController ? 'ACTIVE / OPEN' : 'CLICK TO EXPAND'}
            </span>
            {showExtraController ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showExtraController && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full bg-slate-900/95 backdrop-blur-xl border-2 border-amber-500/40 p-6 md:p-8 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.15)] mb-10 space-y-8"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> ADVANCED MATCH CONTROLS & EXTRAS
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  Direct Extra Runs Matrix, Target Adjustments, Innings Control, DRS & Broadcast Stings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowExtraController(false)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl uppercase border border-slate-700"
                >
                  Close Panel
                </button>
              </div>
            </div>

            {/* SECTION 1: EXTRAS MATRIX */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <PlusCircle className="w-4 h-4 text-cyan-400" /> EXTRAS DIRECT ACTION MATRIX
              </h4>

              {/* Wide Runs */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block">
                  WIDE RUNS (+1 EXTRA RUN + ACTION RUNS)
                </span>
                <div className="grid grid-cols-5 gap-2 text-xs font-black">
                  {[1, 2, 3, 4, 5].map((wRun) => (
                    <button
                      key={`wide_${wRun}`}
                      onClick={() => addExtra('WIDE', wRun)}
                      className="py-2.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                    >
                      WIDE +{wRun - 1} ({wRun})
                    </button>
                  ))}
                </div>
              </div>

              {/* No Ball Runs */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider block">
                  NO BALL RUNS (+1 EXTRA RUN + ACTION RUNS & FREE HIT)
                </span>
                <div className="grid grid-cols-6 gap-2 text-xs font-black">
                  {[1, 2, 3, 4, 6].map((nbRun) => (
                    <button
                      key={`nb_${nbRun}`}
                      onClick={() => addExtra('NO_BALL', nbRun)}
                      className="py-2.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                    >
                      NO BALL +{nbRun - 1} ({nbRun})
                    </button>
                  ))}
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
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block">
                  BYES (LEGAL BALL + NO BOWLER RUNS)
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs font-black">
                  {[1, 2, 3, 4].map((bRun) => (
                    <button
                      key={`bye_${bRun}`}
                      onClick={() => addExtra('BYE', bRun)}
                      className="py-2.5 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                    >
                      BYE (+{bRun})
                    </button>
                  ))}
                </div>
              </div>

              {/* Leg Bye Runs */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block">
                  LEG BYES (LEGAL BALL + NO BOWLER RUNS)
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs font-black">
                  {[1, 2, 3, 4].map((lbRun) => (
                    <button
                      key={`legbye_${lbRun}`}
                      onClick={() => addExtra('LEG_BYE', lbRun)}
                      className="py-2.5 bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/50 rounded-xl transition-all shadow active:scale-95 uppercase"
                    >
                      LEG BYE (+{lbRun})
                    </button>
                  ))}
                </div>
              </div>

              {/* Penalty Runs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block">
                  PENALTY RUNS AWARD (+5 RUNS)
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs font-black">
                  <button
                    onClick={() => addPenaltyRuns('batting', 5)}
                    className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg border border-emerald-400/40 uppercase"
                  >
                    🎁 +5 PENALTY RUNS TO {battingTeam.shortName} (BATTING)
                  </button>
                  <button
                    onClick={() => addPenaltyRuns('bowling', 5)}
                    className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg border border-indigo-400/40 uppercase"
                  >
                    🎁 +5 PENALTY RUNS TO {bowlingTeam.shortName} (BOWLING)
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: TARGET & DLS / OVERS ADJUSTMENT */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <Target className="w-4 h-4 text-amber-400" /> TARGET SCORE & DLS OVERS CONTROL
              </h4>

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
                    />
                    <button
                      onClick={() => updateMatchSettings({ targetRuns: targetRunsInput })}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg uppercase shadow"
                    >
                      Set Target
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
                    <button
                      onClick={() => {
                        updateMatchSettings({ targetRuns: undefined });
                        setTargetRunsInput(0);
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-md border border-slate-700"
                    >
                      Clear
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
                >
                  🚀 START 2ND INNINGS
                </button>

                <button
                  onClick={() => switchStrikers()}
                  className="py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-lg uppercase border border-sky-400/30"
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
                  onClick={() => undoLastBall()}
                  className="py-3 bg-rose-700 hover:bg-rose-600 text-white rounded-xl shadow-lg uppercase border border-rose-400/30"
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
                  onClick={() => retireBatter()}
                  className="py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-lg uppercase border border-orange-400/30"
                >
                  🤕 RETIRE BATTER
                </button>

                <button
                  onClick={() => setShowBowlerModal(true)}
                  className="py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg uppercase border border-cyan-400/30"
                >
                  🏏 CHANGE BOWLER
                </button>

                <button
                  onClick={() => setShowResetConfirmModal(true)}
                  className="py-3 bg-red-950 hover:bg-red-900 border border-red-500/60 text-red-300 rounded-xl shadow-lg uppercase"
                >
                  🚨 RESET MATCH STATE
                </button>
              </div>
            </div>

            {/* SECTION 4: BROADCAST STINGS & ANIMATIONS MATRIX */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <Sparkles className="w-4 h-4 text-rose-400" /> BROADCAST ANIMATIONS & STINGS MATRIX
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-black">
                <button
                  onClick={() => triggerAnimation('FREE_HIT')}
                  className="py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl shadow border border-yellow-300 uppercase"
                >
                  ⚡ FREE HIT
                </button>

                <button
                  onClick={() => triggerAnimation('POWERPLAY')}
                  className="py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow border border-cyan-400/40 uppercase"
                >
                  ⚡ POWERPLAY
                </button>

                <button
                  onClick={() => triggerAnimation('STRATEGIC_TIMEOUT')}
                  className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow border border-indigo-400/40 uppercase"
                >
                  ⏰ STRATEGIC TIMEOUT
                </button>

                <button
                  onClick={() => triggerAnimation('DRINKS_BREAK')}
                  className="py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow border border-sky-400/40 uppercase"
                >
                  🥤 DRINKS BREAK
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
                  🔥 TOUR BOUNDARY
                </button>

                <button
                  onClick={() => triggerAnimation('MATCH_WINNER')}
                  className="py-3 bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 rounded-xl shadow font-black border border-white/50 uppercase"
                >
                  🏆 MATCH WINNER
                </button>

                <button
                  onClick={() => clearAnimation()}
                  className="py-3 bg-red-800 hover:bg-red-700 text-white rounded-xl shadow border border-red-500 uppercase col-span-2 sm:col-span-1"
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
                    onClick={() => {
                      setDecision('PENDING');
                      toggleOverlay('decision', true);
                    }}
                    className="bg-yellow-400 text-slate-950 font-black px-4 py-2 rounded-lg hover:bg-yellow-300 uppercase shadow"
                  >
                    PENDING
                  </button>
                  <button
                    onClick={() => {
                      setDecision('OUT');
                      toggleOverlay('decision', true);
                    }}
                    className="bg-red-600 text-white font-black px-4 py-2 rounded-lg hover:bg-red-500 uppercase shadow"
                  >
                    OUT
                  </button>
                  <button
                    onClick={() => {
                      setDecision('NOT OUT');
                      toggleOverlay('decision', true);
                    }}
                    className="bg-emerald-500 text-slate-950 font-black px-4 py-2 rounded-lg hover:bg-emerald-400 uppercase shadow"
                  >
                    NOT OUT
                  </button>
                  <button
                    onClick={() => {
                      setDecision(null);
                      toggleOverlay('decision', false);
                    }}
                    className="bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg hover:bg-slate-600 uppercase shadow"
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
                >
                  📈 LINE CHART
                </button>
                <button
                  onClick={() => setGraphType('DOUBLE_BAR')}
                  className={`px-4 py-2 rounded-xl uppercase border transition-all ${
                    matchDetails.graphType === 'DOUBLE_BAR'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  📊 DOUBLE BAR CHART
                </button>
                <button
                  onClick={() => toggleOverlay('wagonWheel')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl uppercase border border-slate-700 shadow"
                >
                  🕸️ WAGON WHEEL
                </button>
                <button
                  onClick={() => toggleOverlay('pitchMap')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl uppercase border border-slate-700 shadow"
                >
                  🎯 PITCH MAP
                </button>
                <button
                  onClick={() => toggleOverlay('manhattan')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl uppercase border border-slate-700 shadow"
                >
                  🏙️ MANHATTAN
                </button>
                <button
                  onClick={() => toggleOverlay('partnership')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl uppercase border border-slate-700 shadow"
                >
                  🤝 PARTNERSHIP
                </button>
                <button
                  onClick={() => toggleOverlay('fallOfWickets')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-xl uppercase border border-slate-700 shadow"
                >
                  📉 FALL OF WICKETS
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Edit Match & Teams Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <Edit3 className="w-6 h-6 text-cyan-400" /> Customize Tournament Match
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-cyan-400 block mb-1">Team A Name</label>
                  <input
                    type="text"
                    value={editTeamA}
                    onChange={(e) => setEditTeamA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-cyan-400 block mb-1">Team A Short Code</label>
                  <input
                    type="text"
                    value={editTeamAShort}
                    onChange={(e) => setEditTeamAShort(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-cyan-400 block mb-1">Team B Name</label>
                  <input
                    type="text"
                    value={editTeamB}
                    onChange={(e) => setEditTeamB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-cyan-400 block mb-1">Team B Short Code</label>
                  <input
                    type="text"
                    value={editTeamBShort}
                    onChange={(e) => setEditTeamBShort(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-cyan-400 block mb-1">Tournament Title</label>
                  <input
                    type="text"
                    value={editTourName}
                    onChange={(e) => setEditTourName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-cyan-400 block mb-1">Total Overs</label>
                  <input
                    type="number"
                    value={editTotalOvers}
                    onChange={(e) => setEditTotalOvers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateTeamDetails('teamA', { fullName: editTeamA, shortName: editTeamAShort });
                  updateTeamDetails('teamB', { fullName: editTeamB, shortName: editTeamBShort });
                  updateMatchSettings({ tournament: editTourName, totalOvers: editTotalOvers });
                  setShowEditModal(false);
                }}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs uppercase shadow-lg"
              >
                Save & Apply to Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated CricScorer Modals */}
      <ChangeBowlerModal isOpen={showBowlerModal} onClose={() => setShowBowlerModal(false)} />
      <WicketModal isOpen={showWicketModal} onClose={() => setShowWicketModal(false)} />
      {showPlayerTeamId && (
        <PlayerListModal isOpen={!!showPlayerTeamId} teamId={showPlayerTeamId} onClose={() => setShowPlayerTeamId(null)} />
      )}
      <TossMatchModal isOpen={showTossModal} onClose={() => setShowTossModal(false)} />
      <EditMatchModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-black text-white uppercase">Reset Match State?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to reset all scores, wickets, overs, and match state back to default? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetMatchState();
                  setShowResetConfirmModal(false);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl uppercase shadow"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
