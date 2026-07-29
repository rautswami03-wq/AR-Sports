import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { OverlayStage } from './OverlayStage';
import { EditMatchModal } from './EditMatchModal';
import { TossMatchModal } from './TossMatchModal';
import { OverlayType, EventAnimationType } from '../../types/cricket';
import { PRESET_TEAMS } from '../../theme/presetThemes';
import { Radio, Tv, Zap, Palette, Layers, RefreshCw, Copy, Check, RotateCcw, Settings, Users, PlusCircle } from 'lucide-react';
import { CricNavbar } from '../common/CricNavbar';

export const ControlStudio: React.FC = () => {
  const {
    teamA,
    teamB,
    matchDetails,
    battingTeamId,
    activeOverlays,
    isWsConnected,
    historyStack,
    toggleOverlay,
    triggerAnimation,
    clearAnimation,
    addRuns,
    addExtra,
    addWicket,
    undoLastBall,
    switchStrikers,
    retireBatter,
    changeBowler,
    bulkAddPlayers,
    setDecision,
    setGraphType,
    updateTeamColors,
    resetMatchState,
  } = useBroadcastStore();

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'scorer' | 'overlays' | 'animations' | 'theme' | 'tourStats'>('scorer');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTossModal, setShowTossModal] = useState(false);

  // Form states for custom inputs & bowler changes
  const [bowlerInput, setBowlerInput] = useState('');
  const [customAnimInput, setCustomAnimInput] = useState('');
  const [customDisplayInput, setCustomDisplayInput] = useState('');
  const [team1BulkText, setTeam1BulkText] = useState('');
  const [team2BulkText, setTeam2BulkText] = useState('');

  // Scoring extras checkboxes
  const [extraWide, setExtraWide] = useState(false);
  const [extraNoBall, setExtraNoBall] = useState(false);
  const [extraByes, setExtraByes] = useState(false);
  const [extraLegByes, setExtraLegByes] = useState(false);
  const [extraWicket, setExtraWicket] = useState(false);

  const battingTeam = battingTeamId === teamA.id ? teamA : teamB;
  const bowlingTeam = battingTeamId === teamA.id ? teamB : teamA;
  const obsUrl = `${window.location.origin}/#/overlay`;

  const copyObsUrl = () => {
    navigator.clipboard.writeText(obsUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

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

  const overlayList: { id: OverlayType; label: string }[] = [
    { id: 'scoreBug', label: 'Live Score Bug' },
    { id: 'battingLowerThird', label: 'Batting Lower Third' },
    { id: 'bowlingLowerThird', label: 'Bowling Lower Third' },
    { id: 'battingScorecard', label: 'Batting Scorecard' },
    { id: 'bowlingScorecard', label: 'Bowling Scorecard' },
    { id: 'matchSummary', label: 'Match Summary' },
    { id: 'partnership', label: 'Partnership' },
    { id: 'currentBatters', label: 'Current Batters' },
    { id: 'currentBowler', label: 'Current Bowler' },
    { id: 'requiredRunRate', label: 'Required Run Rate' },
    { id: 'currentRunRate', label: 'Current Run Rate' },
    { id: 'fallOfWickets', label: 'Fall of Wickets' },
    { id: 'target', label: 'Target Splash' },
    { id: 'winnerScreen', label: 'Winner Screen' },
    { id: 'playingXI', label: 'Playing XI Lineup' },
    { id: 'toss', label: 'Toss Result' },
    { id: 'playerStatistics', label: 'Player Statistics' },
    { id: 'bowlerStatistics', label: 'Bowler Statistics' },
    { id: 'playerOfTheMatch', label: 'Player of Match' },
    { id: 'playerOfTheTournament', label: 'Player of Tournament' },
    { id: 'topBatters', label: 'Top Batters' },
    { id: 'topBowlers', label: 'Top Bowlers' },
    { id: 'pointsTable', label: 'Points Table' },
    { id: 'sponsorGraphics', label: 'Sponsor Banner' },
    { id: 'countdown', label: 'Match Countdown' },
    { id: 'replayLowerThird', label: 'Replay Banner' },
    { id: 'superOver', label: 'Super Over Special' },
    { id: 'wagonWheel', label: 'Wagon Wheel Radar' },
    { id: 'manOfTheMatchCard', label: 'MOM Trophy Full Card' },
  ];

  const animationList: { id: EventAnimationType; label: string; color: string }[] = [
    { id: 'FREE_HIT', label: 'FREE HIT', color: 'bg-emerald-600 text-white' },
    { id: 'NO_BALL', label: 'NO BALL', color: 'bg-rose-700 text-white' },
    { id: 'WIDE', label: 'WIDE', color: 'bg-yellow-500 text-slate-950' },
    { id: 'FOUR', label: 'FOUR (4)', color: 'bg-amber-500 text-slate-950' },
    { id: 'SIX', label: 'SIX (6)', color: 'bg-purple-600 text-white' },
    { id: 'WICKET', label: 'WICKET', color: 'bg-red-600 text-white' },
    { id: 'FIFTY', label: 'HALF CENTURY (50)', color: 'bg-amber-400 text-slate-950' },
    { id: 'CENTURY', label: 'CENTURY (100)', color: 'bg-yellow-300 text-slate-950' },
    { id: 'POWERPLAY', label: 'POWERPLAY', color: 'bg-orange-500 text-white' },
    { id: 'STRATEGIC_TIMEOUT', label: 'TIMEOUT', color: 'bg-slate-700 text-white' },
    { id: 'DRINKS_BREAK', label: 'DRINKS', color: 'bg-sky-600 text-white' },
    { id: 'END_OF_INNINGS', label: 'INNINGS BREAK', color: 'bg-indigo-600 text-white' },
    { id: 'MATCH_WINNER', label: 'MATCH WINNER', color: 'bg-amber-400 text-slate-950' },
  ];

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const nonStriker = battingTeam.batters.find((b) => !b.isOut && !b.isStriker) || battingTeam.batters[1];
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <CricNavbar />

      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg text-slate-950 font-black flex items-center gap-1.5 shadow-lg">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="text-sm tracking-wider uppercase">CricScorer PRO</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isWsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className={isWsConnected ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {isWsConnected ? 'WS LIVE' : 'WS OFFLINE'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-1.5 shadow-md"
          >
            <Settings className="w-4 h-4 text-amber-300" />
            Edit Match Details
          </button>
          <Link
            to="/theme_links"
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            Theme Links
          </Link>
          <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
            <Tv className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400 font-mono hidden sm:inline">{obsUrl}</span>
            <button
              onClick={copyObsUrl}
              className="bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedUrl ? 'Copied!' : 'Copy OBS Source'}
            </button>
          </div>
          <button
            onClick={resetMatchState}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
            title="Reset Match Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left Column: Stage Preview + Quick Live Header */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Tv className="w-4 h-4" /> Live Broadcast Stage Preview (1920×1080)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                OBS / vMix Ready
              </span>
            </div>

            <div className="relative w-full aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0f172a 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="transform scale-[0.38] md:scale-[0.42] xl:scale-[0.48] origin-center">
                <OverlayStage />
              </div>
            </div>
          </div>

          {/* Quick Score Live Header Widget matching Screenshot 2026-04-13 204512 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="bg-cyan-600 text-white font-black text-xs px-2.5 py-1 rounded tracking-wider">
                TARGET - {matchDetails.targetRuns || 0}
              </span>
              <span className="text-xs font-extrabold text-amber-400 uppercase">
                {matchDetails.tournament || 'CRICSCORER PREMIER LEAGUE'}
              </span>
              <span className="text-xs font-extrabold text-slate-300">
                NEED {matchDetails.targetRuns ? matchDetails.targetRuns - battingTeam.score : 0} RUNS FROM {((matchDetails.totalOvers || 20) * 6) - (battingTeam.overs * 6 + battingTeam.balls)} BALLS
              </span>
            </div>

            {/* Striker / Non-Striker & Score */}
            <div className="grid grid-cols-3 gap-2 items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-left font-bold text-xs">
                <div className="text-amber-400 font-black text-sm flex items-center gap-1">
                  ▶ {striker?.name || 'BATTER 1'} <span className="text-white text-xs">{striker?.runs || 0} ({striker?.balls || 0})</span>
                </div>
                <div className="text-slate-400 font-semibold text-xs pl-4">
                  {nonStriker?.name || 'BATTER 2'} <span className="text-white text-xs">{nonStriker?.runs || 0} ({nonStriker?.balls || 0})</span>
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white tracking-wider">
                  {battingTeam.score} - {battingTeam.wickets}
                </div>
                <div className="text-xs font-bold text-cyan-400">
                  {battingTeam.overs}.{battingTeam.balls} / {matchDetails.totalOvers || 20} OVR
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-cyan-300 font-extrabold uppercase truncate">
                  {currentBowler?.name || 'BOWLER'}
                </div>
                <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                  {currentBowler?.wickets || 0}-{currentBowler?.runsConceded || 0} ({currentBowler?.overs || 0}.{currentBowler?.ballsInCurrentOver || 0})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Operator Controller Studio */}
        <div className="lg:col-span-6 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Controller Tabs Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-950">
            <button
              onClick={() => setSelectedTab('scorer')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                selectedTab === 'scorer'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4" /> Controller
            </button>
            <button
              onClick={() => setSelectedTab('overlays')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                selectedTab === 'overlays'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Displays ({Object.values(activeOverlays).filter(Boolean).length})
            </button>
            <button
              onClick={() => setSelectedTab('animations')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                selectedTab === 'animations'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" /> Stings
            </button>
            <button
              onClick={() => setSelectedTab('tourStats')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                selectedTab === 'tourStats'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Tour Stats
            </button>
            <button
              onClick={() => setSelectedTab('theme')}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                selectedTab === 'theme'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" /> Colors
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 flex-1 overflow-y-auto max-h-[620px] space-y-6">
            {/* 1. SCORER / CONTROLLER TAB */}
            {selectedTab === 'scorer' && (
              <div className="space-y-5">
                {/* Controller Quick Action Row matching Screenshot 2026-04-13 204512 */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowTossModal(true)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded shadow uppercase tracking-wider flex items-center gap-1 border border-white/40 animate-pulse"
                  >
                    🪙 WHO WON TOSS
                  </button>
                  <button
                    onClick={switchStrikers}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded shadow"
                  >
                    SWAP BATTER
                  </button>
                  <button
                    onClick={retireBatter}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded shadow"
                  >
                    RETIRE BATTER
                  </button>
                  <button
                    onClick={() => {
                      if (bowlerInput) {
                        changeBowler(bowlerInput);
                        setBowlerInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded shadow"
                  >
                    CHANGE BOWLER
                  </button>
                  <input
                    type="text"
                    placeholder="New Bowler..."
                    value={bowlerInput}
                    onChange={(e) => setBowlerInput(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-slate-950 text-white border border-slate-700 rounded w-28 focus:outline-none"
                  />
                  <button
                    onClick={() => toggleOverlay('scoreBug', true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded shadow"
                  >
                    Default
                  </button>
                  <button
                    onClick={() => toggleOverlay('scoreBug')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded shadow"
                  >
                    Mini Score
                  </button>
                  <button
                    onClick={() => toggleOverlay('playingXI')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded shadow"
                  >
                    IP
                  </button>
                  <button
                    onClick={() => toggleOverlay('matchSummary')}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded shadow"
                  >
                    Tour Name
                  </button>
                  <button
                    onClick={() => toggleOverlay('battingLowerThird')}
                    className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded shadow"
                  >
                    S1
                  </button>
                  <button
                    onClick={() => toggleOverlay('bowlingLowerThird')}
                    className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs rounded shadow"
                  >
                    S2
                  </button>
                  <button
                    onClick={() => toggleOverlay('currentBowler')}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded shadow"
                  >
                    Bowler
                  </button>
                  <button
                    onClick={() => toggleOverlay('battingScorecard')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded shadow"
                  >
                    Batting
                  </button>
                  <button
                    onClick={() => toggleOverlay('bowlingScorecard')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded shadow"
                  >
                    Bowling
                  </button>
                  <button
                    onClick={() => triggerAnimation('POWERPLAY')}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded shadow"
                  >
                    PP+
                  </button>
                  <button
                    onClick={() => triggerAnimation('END_OF_INNINGS')}
                    className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs rounded shadow"
                  >
                    END Inning 2
                  </button>
                  <button
                    onClick={undoLastBall}
                    disabled={historyStack.length === 0}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded shadow disabled:opacity-50"
                  >
                    UNDO
                  </button>
                </div>

                {/* Checkboxes Row */}
                <div className="flex items-center gap-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={extraWide}
                      onChange={(e) => setExtraWide(e.target.checked)}
                      className="w-4 h-4 accent-amber-400"
                    />
                    Wide
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={extraNoBall}
                      onChange={(e) => setExtraNoBall(e.target.checked)}
                      className="w-4 h-4 accent-rose-400"
                    />
                    No Ball
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={extraByes}
                      onChange={(e) => setExtraByes(e.target.checked)}
                      className="w-4 h-4 accent-sky-400"
                    />
                    Byes
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={extraLegByes}
                      onChange={(e) => setExtraLegByes(e.target.checked)}
                      className="w-4 h-4 accent-indigo-400"
                    />
                    Leg Byes
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                    <input
                      type="checkbox"
                      checked={extraWicket}
                      onChange={(e) => setExtraWicket(e.target.checked)}
                      className="w-4 h-4 accent-red-600"
                    />
                    Wicket 🔴
                  </label>
                </div>

                {/* Keypad Runs Grid */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    SCORING MATRIX NUMBERS
                  </span>
                  <div className="grid grid-cols-7 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleScoreClick(num)}
                        className={`py-3.5 rounded-lg font-black text-xl shadow-md transition-all active:scale-95 border ${
                          num === 4
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300'
                            : num === 6
                            ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Team Player Bulk Add Section */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black uppercase text-amber-400 block">
                    BULK PLAYER NAMES UPLOAD
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block mb-1">
                        {teamA.fullName} Players (Comma Separated)
                      </span>
                      <textarea
                        rows={2}
                        value={team1BulkText}
                        onChange={(e) => setTeam1BulkText(e.target.value)}
                        placeholder="Player 1, Player 2, Player 3..."
                        className="w-full p-2 text-xs bg-slate-900 text-white rounded border border-slate-700 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (team1BulkText) {
                            bulkAddPlayers('teamA', team1BulkText.split(','));
                            setTeam1BulkText('');
                          }
                        }}
                        className="mt-1.5 w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded uppercase"
                      >
                        ADD TO {teamA.shortName}
                      </button>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block mb-1">
                        {teamB.fullName} Players (Comma Separated)
                      </span>
                      <textarea
                        rows={2}
                        value={team2BulkText}
                        onChange={(e) => setTeam2BulkText(e.target.value)}
                        placeholder="Player 1, Player 2, Player 3..."
                        className="w-full p-2 text-xs bg-slate-900 text-white rounded border border-slate-700 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (team2BulkText) {
                            bulkAddPlayers('teamB', team2BulkText.split(','));
                            setTeam2BulkText('');
                          }
                        }}
                        className="mt-1.5 w-full py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded uppercase"
                      >
                        ADD TO {teamB.shortName}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. OVERLAYS / DISPLAY CONTROLLER TAB */}
            {selectedTab === 'overlays' && (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wider block mb-2">
                    DISPLAY CONTROLLER OVERLAYS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {overlayList.map((item) => {
                      const isActive = activeOverlays[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleOverlay(item.id)}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all uppercase shadow ${
                            isActive
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Decision Panel */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
                    DECISION OVERLAY CONTROL:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDecision('PENDING')}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs rounded uppercase shadow"
                    >
                      PENDING
                    </button>
                    <button
                      onClick={() => setDecision('OUT')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded uppercase shadow"
                    >
                      OUT
                    </button>
                    <button
                      onClick={() => setDecision('NOT OUT')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded uppercase shadow"
                    >
                      NOT OUT
                    </button>
                    <button
                      onClick={() => setDecision(null)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Graphs Control Panel */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
                    GRAPHS OVERLAY CONTROL:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGraphType('BAR')}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded uppercase shadow"
                    >
                      BAR GRAPH
                    </button>
                    <button
                      onClick={() => setGraphType('LINE')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded uppercase shadow"
                    >
                      LINE GRAPH
                    </button>
                    <button
                      onClick={() => setGraphType('DOUBLE_BAR')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded uppercase shadow"
                    >
                      DOUBLE BAR
                    </button>
                    <button
                      onClick={() => setGraphType(null)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-xs rounded"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Custom Input Field */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Custom Input text for overlay..."
                    value={customDisplayInput}
                    onChange={(e) => setCustomDisplayInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 text-white text-xs border border-slate-700 rounded focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      useBroadcastStore.getState().updateMatchSettings({ customInputText: customDisplayInput });
                      toggleOverlay('sponsorGraphics', true);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded uppercase shadow"
                  >
                    Display Input
                  </button>
                </div>
              </div>
            )}

            {/* 3. STINGS & ANIMATIONS TAB */}
            {selectedTab === 'animations' && (
              <div className="space-y-4">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-2">
                  ANIMATIONS & STINGS TRIGGER PANEL
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {animationList.map((anim) => (
                    <button
                      key={anim.id}
                      onClick={() => triggerAnimation(anim.id)}
                      className={`p-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 ${anim.color}`}
                    >
                      {anim.label}
                    </button>
                  ))}
                  <button
                    onClick={clearAnimation}
                    className="p-3 bg-red-700 hover:bg-red-600 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md active:scale-95 col-span-2"
                  >
                    STOP ANIMATIONS
                  </button>
                </div>

                {/* Custom Animation Text */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Custom Animation Text..."
                    value={customAnimInput}
                    onChange={(e) => setCustomAnimInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 text-white text-xs border border-slate-700 rounded focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      useBroadcastStore.getState().updateMatchSettings({ customAnimationText: customAnimInput });
                      triggerAnimation('FOUR');
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded uppercase shadow"
                  >
                    Display Animation
                  </button>
                </div>
              </div>
            )}

            {/* 4. TOUR STATS TAB */}
            {selectedTab === 'tourStats' && (
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider block mb-2">
                  TOUR STATS & POINTS TABLE CONTROLLER
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleOverlay('pointsTable')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded uppercase shadow"
                  >
                    POINTS TABLE
                  </button>
                  <button
                    onClick={() => toggleOverlay('topBowlers')}
                    className="px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded uppercase shadow"
                  >
                    TOP BOWLERS
                  </button>
                  <button
                    onClick={() => toggleOverlay('topBatters')}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded uppercase shadow"
                  >
                    TOP 4/6 STRIKERS
                  </button>
                  <button
                    onClick={() => toggleOverlay('playerOfTheTournament')}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded uppercase shadow"
                  >
                    TOP PLAYER OF SERIES
                  </button>
                </div>

                {/* Group PT Buttons 1 through 8 */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
                    GROUP POINTS TABLES:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => toggleOverlay(`groupPt${num}` as OverlayType)}
                        className="py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded uppercase shadow"
                      >
                        GROUP PT {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. THEME / COLORS TAB */}
            {selectedTab === 'theme' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  TEAM PRESET THEMES & COLORS
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(PRESET_TEAMS).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() =>
                        updateTeamColors('teamA', preset.primaryColor, preset.secondaryColor, preset.accentColor)
                      }
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left flex items-center gap-3 transition-all"
                    >
                      <div
                        className="w-8 h-8 rounded-full border border-white/20 shadow-md flex items-center justify-center font-bold text-xs"
                        style={{
                          background: `linear-gradient(135deg, ${preset.primaryColor} 0%, ${preset.secondaryColor} 100%)`,
                        }}
                      >
                        {preset.shortName}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{preset.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{preset.primaryColor}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit & Toss Match Modals */}
      <EditMatchModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
      <TossMatchModal isOpen={showTossModal} onClose={() => setShowTossModal(false)} />
    </div>
  );
};
