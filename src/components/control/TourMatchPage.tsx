import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBroadcastStore } from '../../store/useBroadcastStore';
import { Send, Edit3, Image, Radio, ChevronDown, ChevronUp } from 'lucide-react';
import { OverlayType } from '../../types/cricket';
import { CricNavbar } from '../common/CricNavbar';

export const TourMatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    teamA,
    teamB,
    matchDetails,
    activeOverlays,
    toggleOverlay,
    triggerAnimation,
    addRuns,
    addExtra,
    addWicket,
    switchStrikers,
    updateTeamColors,
    resetMatchState,
  } = useBroadcastStore();

  const [tossText, setTossText] = useState(
    `${teamB.fullName.toUpperCase()} WON THE TOSS AND OPTED TO BOWL`
  );
  const [currentInningsText, setCurrentInningsText] = useState('Start 1st Inning');
  const [editingShortNames, setEditingShortNames] = useState(false);
  const [teamAShort, setTeamAShort] = useState(teamA.shortName);
  const [teamBShort, setTeamBShort] = useState(teamB.shortName);

  // Custom Input & MOM / Tournament Player Selectors (Screenshot 1 & 2)
  const [customInputText, setCustomInputText] = useState('Jagdish Pawar');
  const [selectedMOM, setSelectedMOM] = useState('nagesh chitia (ashtavinayak indians)');
  const [selectedTourPlayer, setSelectedTourPlayer] = useState('ajit khade (ashtavinayak indians)');
  const [showExtraController, setShowExtraController] = useState(false);

  // Color Pickers
  const [team1Color, setTeam1Color] = useState(teamA.primaryColor);
  const [team2Color, setTeam2Color] = useState(teamB.primaryColor);

  const handleSendUpdate = () => {
    alert('Broadcast match update sent to OBS Studio!');
  };

  const handleChangeToss = () => {
    const choices = ['BAT', 'BOWL'];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    const newToss = `${teamA.fullName.toUpperCase()} WON THE TOSS AND OPTED TO ${randomChoice}`;
    setTossText(newToss);
  };

  const toggleInnings = () => {
    if (currentInningsText === 'Start 1st Inning') {
      setCurrentInningsText('Start 2nd Inning');
    } else {
      setCurrentInningsText('Start 1st Inning');
    }
  };

  const handleSaveTeamColors = () => {
    updateTeamColors('teamA', team1Color, teamA.secondaryColor);
    updateTeamColors('teamB', team2Color, teamB.secondaryColor);
    alert('Team colors saved!');
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
    { id: 'scoreBug', label: 'SCORE', bg: 'bg-blue-600 hover:bg-blue-500 text-white font-black' },
  ];

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans pb-16">
      <CricNavbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4 flex flex-col items-center">
        {/* Navigation Breadcrumb Links */}
        <div className="flex items-center gap-12 mb-8 text-xl font-black uppercase tracking-wider">
          <span className="text-white border-b-2 border-cyan-400 pb-1">Match Scoreboard</span>
          <Link to="/theme_links" className="text-cyan-400 hover:text-cyan-300 border-b-2 border-cyan-400 pb-1">
            SCOREBOARD LINKS
          </Link>
        </div>

        {/* Versus Match Pill Banner (CricScorer PRO Design) */}
        <div className="w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-cyan-400 text-slate-950 p-6 rounded-full border-4 border-cyan-300 shadow-[0_0_50px_rgba(6,182,212,0.6)] flex items-center justify-between text-center mb-8 relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex-1">
            {teamA.fullName.toUpperCase()}
          </h2>
          <div className="px-6 py-2 bg-slate-950/80 text-white rounded-2xl max-w-xs border border-white/20 shadow-inner">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
              {tossText}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex-1">
            {teamB.fullName.toUpperCase()}
          </h2>
        </div>

        {/* SEND Button */}
        <button
          onClick={handleSendUpdate}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xl px-12 py-3 rounded-2xl border-2 border-white shadow-[0_0_30px_rgba(251,191,36,0.8)] transform hover:scale-105 active:scale-95 transition-all mb-10 uppercase tracking-widest flex items-center gap-2"
        >
          <Send className="w-6 h-6" /> SEND
        </button>

        {/* Action Controls Button Matrix */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          <button
            onClick={() => resetMatchState()}
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
            onClick={toggleInnings}
            className="py-3.5 bg-slate-900 border-2 border-red-500 hover:border-red-400 text-white font-black text-base rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95 transition-all uppercase tracking-wider"
          >
            {currentInningsText}
          </button>
          <button
            onClick={() => alert(`Tournament Name: ${matchDetails.tournament}`)}
            className="py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider"
          >
            Tour Name
          </button>
          <button
            onClick={() => resetMatchState()}
            className="py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider col-span-2 sm:col-span-1"
          >
            UNDO
          </button>
        </div>

        {/* 1. DISPLAY CONTROLLER SECTION (Exact CricScorer PRO Screenshot 1 & 2) */}
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

          {/* Decision & Graphs Rows */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs font-black uppercase">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">Decision:</span>
              <button onClick={() => triggerAnimation('POWERPLAY')} className="bg-yellow-400 text-slate-950 px-3 py-1.5 rounded-md">PENDING</button>
              <button onClick={() => triggerAnimation('WICKET')} className="bg-red-600 text-white px-3 py-1.5 rounded-md">OUT</button>
              <button onClick={() => triggerAnimation('FREE_HIT')} className="bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-md">NOT OUT</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">Graphs:</span>
              <button onClick={() => toggleOverlay('currentRunRate')} className="bg-purple-600 text-white px-3 py-1.5 rounded-md">BAR</button>
              <button onClick={() => toggleOverlay('currentRunRate')} className="bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-md">LINE</button>
              <button onClick={() => toggleOverlay('currentRunRate')} className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-md">DOUBLE BAR</button>
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
              onClick={() => alert(`Displayed Custom Banner: ${customInputText}`)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider"
            >
              Display Input
            </button>
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

        {/* 2. TOUR STATS CONTROLLER SECTION (Exact CricScorer PRO Screenshot 2) */}
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

        {/* 3. SELECT TEAM COLOR SECTION (Exact CricScorer PRO Screenshot 2) */}
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
    </div>
  );
};
