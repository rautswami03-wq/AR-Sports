import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { PRESET_TOURNAMENTS, getThemeByLeagueName } from '../../theme/presetThemes';
import { Send, Edit3, Image, Radio, ChevronDown, ChevronUp, CheckCircle2, Tv, Palette } from 'lucide-react';
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
    triggerAnimation,
    addRuns,
    addExtra,
    addWicket,
    switchStrikers,
    retireBatter,
    changeBowler,
    undoLastBall,
    updateTeamColors,
    updateTeamDetails,
    updateMatchSettings,
    resetMatchState,
    startNewMatchWithTeams,
    startSecondInnings,
    setDecision,
    updatePlayerAvatar,
    updateBatterStats,
    updateBowlerStats,
    tournamentId,
    setTournamentId,
  } = useBroadcastStore();

  const [extraWide, setExtraWide] = useState(false);
  const [extraNoBall, setExtraNoBall] = useState(false);
  const [extraByes, setExtraByes] = useState(false);
  const [extraLegByes, setExtraLegByes] = useState(false);
  const [extraWicket, setExtraWicket] = useState(false);

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showPlayerTeamId, setShowPlayerTeamId] = useState<'teamA' | 'teamB' | null>(null);
  const [showTossModal, setShowTossModal] = useState(false);

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

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTeamA, setEditTeamA] = useState(teamA.fullName);
  const [editTeamAShort, setEditTeamAShort] = useState(teamA.shortName);
  const [editTeamB, setEditTeamB] = useState(teamB.fullName);
  const [editTeamBShort, setEditTeamBShort] = useState(teamB.shortName);
  const [editTourName, setEditTourName] = useState(matchDetails.tournament);
  const [editTotalOvers, setEditTotalOvers] = useState(matchDetails.totalOvers);

  React.useEffect(() => {
    if (!id || typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('cricscorer_tournaments_v1');
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
  const [currentInningsText, setCurrentInningsText] = useState('Start 1st Inning');
  const [editingShortNames, setEditingShortNames] = useState(false);
  const [teamAShort, setTeamAShort] = useState(teamA.shortName);
  const [teamBShort, setTeamBShort] = useState(teamB.shortName);


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

  const toggleInnings = () => {
    if (matchDetails.currentInnings === 1) {
      setShowTossModal(true);
    } else {
      startSecondInnings();
    }
  };

  const handleSaveTeamColors = () => {
    updateTeamColors('teamA', team1Color, teamA.secondaryColor);
    updateTeamColors('teamB', team2Color, teamB.secondaryColor);
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
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans pb-32 overflow-y-auto w-full">
      <CricNavbar />

      {/* Floating OBS Broadcast Confirmation Toast Popup */}
      <AnimatePresence>
        {showSendToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-20 z-50 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 px-8 py-3.5 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.9)] border-2 border-white font-black text-sm uppercase tracking-wider flex items-center gap-3 drop-shadow-2xl"
          >
            <CheckCircle2 className="w-6 h-6 text-slate-950 animate-pulse" />
            <span>⚡ OBS BROADCAST UPDATED! OVERLAY SYNC ACTIVE</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4 flex flex-col items-center">
        {/* Navigation Breadcrumb Links */}
        <div className="flex flex-wrap items-center justify-between w-full mb-8 text-xl font-black uppercase tracking-wider gap-4">
          <div className="flex items-center gap-8">
            <span className="text-white border-b-2 border-cyan-400 pb-1">Match Scoreboard</span>
            <Link to="/theme_links" className="text-cyan-400 hover:text-cyan-300 border-b-2 border-cyan-400 pb-1">
              SCOREBOARD LINKS
            </Link>
          </div>
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
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white text-xs font-black rounded-xl border border-blue-400/50 shadow-lg flex items-center gap-2 uppercase tracking-wider transition-all transform hover:scale-105"
          >
            <Edit3 className="w-4 h-4 text-cyan-300" /> EDIT MATCH
          </button>
        </div>

        {/* Live Broadcast Stage Preview (1920x1080) */}
        <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-2xl mb-8 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-sky-400" /> Live Stage Preview (1920×1080)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-mono">
              OBS Browser Source Ready
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
            <div className="transform scale-[0.34] sm:scale-[0.42] md:scale-[0.48] origin-center">
              <OverlayStage />
            </div>
          </div>
        </div>

        {/* Versus Match Banner (Responsive Layout) */}
        <div className="w-full bg-gradient-to-r from-cyan-500 via-sky-600 to-cyan-500 text-slate-950 p-6 rounded-3xl border-4 border-cyan-300 shadow-[0_0_50px_rgba(6,182,212,0.6)] flex flex-col items-center gap-4 mb-8 text-center">

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
              <input
                type="text"
                value={striker?.name || ''}
                placeholder="Enter Striker Name"
                onChange={(e) => striker && updateBatterStats(striker.id, { name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-black text-sm focus:outline-none focus:border-amber-400 mb-1"
              />
              <span className="text-amber-400 block font-bold">{striker?.runs || 0} ({striker?.balls || 0}b)</span>
            </div>
            <div>
              <span className="text-cyan-400 block uppercase font-black mb-1">NON-STRIKER</span>
              <input
                type="text"
                value={nonStriker?.name || ''}
                placeholder="Enter Non-Striker Name"
                onChange={(e) => nonStriker && updateBatterStats(nonStriker.id, { name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-black text-sm focus:outline-none focus:border-cyan-400 mb-1"
              />
              <span className="text-slate-400 block font-bold">{nonStriker?.runs || 0} ({nonStriker?.balls || 0}b)</span>
            </div>
            <div>
              <span className="text-cyan-400 block uppercase font-black mb-1">CURRENT BOWLER</span>
              <input
                type="text"
                value={currentBowler?.name || ''}
                placeholder="Enter Bowler Name"
                onChange={(e) => currentBowler && updateBowlerStats(currentBowler.id, { name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-white font-black text-sm focus:outline-none focus:border-emerald-400 mb-1"
              />
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
            onClick={handleChangeToss}
            className="py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
          >
            Change Toss
          </button>
          <button
            onClick={() => {
              toggleOverlay('tournamentTitle', false);
              toggleOverlay('scoreBug', true);
              toggleInnings();
            }}
            className="py-3.5 bg-slate-900 border-2 border-red-500 hover:border-red-400 text-white font-black text-base rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 transition-all uppercase tracking-wider"
          >
            {matchDetails.currentInnings === 1 ? 'START 1ST INNINGS' : '2ND INNINGS ACTIVE'}
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
              <span className="text-cyan-400">Stings:</span>
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
            <button onClick={() => toggleOverlay('playerOfTheMatch')} className="bg-pink-600 text-white font-black text-xs px-3 py-2 rounded-lg uppercase">MVP_M1</button>
            <button onClick={() => toggleOverlay('playerOfTheMatch')} className="bg-pink-600 text-white font-black text-xs px-3 py-2 rounded-lg uppercase">MVP_M2</button>
          </div>

          {/* Tournament Stats Player */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
            <span className="text-xs font-black text-cyan-400 uppercase w-36">Tournament Stats Player:</span>
            <select
              value={selectedTourPlayer}
              onChange={(e) => setSelectedTourPlayer(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 px-4 py-2 rounded-xl text-white text-xs font-bold"
            >
              <option value="ajit khade (ashtavinayak indians)">ajit khade (ashtavinayak indians)</option>
              <option value="R. Sharma (India)">R. Sharma (India)</option>
              <option value="V. Kohli (India)">V. Kohli (India)</option>
            </select>
            <button onClick={() => toggleOverlay('playerStatistics')} className="bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-lg uppercase">Display Player Stats</button>
            <button onClick={() => toggleOverlay('playerOfTheTournament')} className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-2 rounded-lg uppercase">MVP_T1</button>
            <button onClick={() => toggleOverlay('playerOfTheTournament')} className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-2 rounded-lg uppercase">MVP_T2</button>
          </div>
        </div>


        <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8 space-y-4">
          <h2 className="text-xl font-black text-center text-white uppercase tracking-widest border-b border-slate-800 pb-3">
            TOUR STATS CONTROLLER
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => toggleOverlay('pointsTable')} className="px-3 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg uppercase">POINTS TABLE</button>
            <button onClick={() => toggleOverlay('pointsTable')} className="px-3 py-2 bg-pink-600 text-white font-black text-xs rounded-lg uppercase">PT (TIED POINT +1)</button>
            <button onClick={() => toggleOverlay('topBatters')} className="px-3 py-2 bg-fuchsia-600 text-white font-black text-xs rounded-lg uppercase">TOP BATTERS</button>
            <button onClick={() => toggleOverlay('topBowlers')} className="px-3 py-2 bg-fuchsia-600 text-white font-black text-xs rounded-lg uppercase">TOP BOWLERS</button>
            <button onClick={() => toggleOverlay('topBatters')} className="px-3 py-2 bg-cyan-500 text-slate-950 font-black text-xs rounded-lg uppercase">TOP 4/6 STRIKERS</button>
            <button onClick={() => toggleOverlay('playerOfTheTournament')} className="px-3 py-2 bg-fuchsia-600 text-white font-black text-xs rounded-lg uppercase">TOP PLAYER OF SERIES</button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button key={num} onClick={() => toggleOverlay('pointsTable')} className="px-3 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-lg uppercase">
                Group PT {num}
              </button>
            ))}
          </div>
        </div>


        <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8 space-y-4">
          <h2 className="text-xl font-black text-center text-white uppercase tracking-widest border-b border-slate-800 pb-3">
            SELECT TEAM COLOR
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 rounded-2xl border border-white/20">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-white font-black uppercase text-base">{teamA.shortName.toLowerCase()}</span>
              <input
                type="color"
                value={team1Color}
                onChange={(e) => setTeam1Color(e.target.value)}
                className="w-12 h-12 rounded-full cursor-pointer border-2 border-white"
              />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-white font-black uppercase text-base">{teamB.shortName.toLowerCase()}</span>
              <input
                type="color"
                value={team2Color}
                onChange={(e) => setTeam2Color(e.target.value)}
                className="w-12 h-12 rounded-full cursor-pointer border-2 border-white"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSaveTeamColors}
              className="bg-slate-950 hover:bg-slate-800 text-white font-black text-xs px-8 py-2.5 rounded-xl uppercase tracking-widest border border-slate-700 shadow-lg"
            >
              SAVE
            </button>
          </div>
        </div>

        {/* Show Extra Controller Bar */}
        <button
          onClick={() => setShowExtraController(!showExtraController)}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-base rounded-2xl shadow-xl uppercase tracking-wider mb-10 flex items-center justify-center gap-2"
        >
          {showExtraController ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          {showExtraController ? 'Hide Extra Controller' : 'Show Extra Controller'}
        </button>

        {showExtraController && (
          <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8 space-y-4">
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest text-center">ADVANCED MATCH CONTROLS</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-black">
              <button onClick={() => addExtra('BYE', 1)} className="py-2.5 bg-slate-800 text-white rounded-xl">BYE (+1)</button>
              <button onClick={() => addExtra('LEG_BYE', 1)} className="py-2.5 bg-slate-800 text-white rounded-xl">LEG BYE (+1)</button>
              <button onClick={() => triggerAnimation('DRINKS_BREAK')} className="py-2.5 bg-sky-600 text-white rounded-xl">DRINKS BREAK</button>
              <button onClick={() => triggerAnimation('STRATEGIC_TIMEOUT')} className="py-2.5 bg-slate-700 text-white rounded-xl">STRATEGIC TIMEOUT</button>
            </div>
          </div>
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
    </div>
  );
};
