import React, { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditMatchModal: React.FC<EditMatchModalProps> = ({ isOpen, onClose }) => {
  const { teamA, teamB, matchDetails, battingTeamId, updateMatchSettings, updateTeamDetails, updatePlayerAvatar } = useBroadcastStore();

  const isTeamA = battingTeamId === teamA.id || battingTeamId === teamA.shortName || battingTeamId === 'teamA';
  const battingTeam = isTeamA ? teamA : teamB;
  const bowlingTeam = isTeamA ? teamB : teamA;
  const battingTeamKey = isTeamA ? 'teamA' : 'teamB';
  const bowlingTeamKey = isTeamA ? 'teamB' : 'teamA';

  const striker = battingTeam.batters.find((b) => b.isStriker) || battingTeam.batters[0];
  const currentBowler = bowlingTeam.bowlers.find((bw) => bw.isCurrent) || bowlingTeam.bowlers[0];

  const [team1Name, setTeam1Name] = useState(teamA.fullName || '');
  const [team2Name, setTeam2Name] = useState(teamB.fullName || '');
  const [overs, setOvers] = useState(matchDetails.totalOvers || 20);
  const [matchNo, setMatchNo] = useState(matchDetails.matchNo || 1);
  const [isTied, setIsTied] = useState(matchDetails.isTied || false);
  const [ballsPerOver, setBallsPerOver] = useState(matchDetails.ballsPerOver || 6);
  const [matchType, setMatchType] = useState(matchDetails.matchType || 'Group Stage');
  const [groupNo, setGroupNo] = useState(matchDetails.groupNo || 1);
  const [strikerPhoto, setStrikerPhoto] = useState(striker?.avatarUrl || '');
  const [bowlerPhoto, setBowlerPhoto] = useState(currentBowler?.avatarUrl || '');

  if (!isOpen) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeamDetails('teamA', { fullName: team1Name });
    updateTeamDetails('teamB', { fullName: team2Name });
    updateMatchSettings({
      totalOvers: Number(overs),
      matchNo: Number(matchNo),
      isTied,
      ballsPerOver: Number(ballsPerOver),
      matchType,
      groupNo: Number(groupNo),
    });

    if (striker && strikerPhoto) {
      updatePlayerAvatar(battingTeamKey, 'batter', striker.id, strikerPhoto);
    }
    if (currentBowler && bowlerPhoto) {
      updatePlayerAvatar(bowlingTeamKey, 'bowler', currentBowler.id, bowlerPhoto);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-2xl shadow-2xl p-6 text-white border border-blue-400/40 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black text-center tracking-wider uppercase mb-5">
          EDIT MATCH
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4 text-center">

          <div>
            <label className="block text-sm font-bold uppercase mb-1">Team 1 Name</label>
            <input
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>


          <div>
            <label className="block text-sm font-bold uppercase mb-1">Team 2 Name</label>
            <input
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>


          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold uppercase">Overs</label>
              <input
                type="number"
                value={overs}
                onChange={(e) => setOvers(Number(e.target.value))}
                className="w-20 px-2 py-1 text-slate-900 font-bold bg-white rounded-md text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold uppercase">Match No.</label>
              <input
                type="number"
                value={matchNo}
                onChange={(e) => setMatchNo(Number(e.target.value))}
                className="w-20 px-2 py-1 text-slate-900 font-bold bg-white rounded-md text-center"
              />
            </div>
          </div>


          <div className="flex items-center justify-center gap-6 py-1">
            <span className="text-sm font-bold uppercase">Match Tied?</span>
            <label className="flex items-center gap-1.5 font-bold cursor-pointer">
              <input
                type="radio"
                name="isTied"
                checked={isTied === true}
                onChange={() => setIsTied(true)}
                className="w-4 h-4 accent-cyan-400"
              />
              Yes
            </label>
            <label className="flex items-center gap-1.5 font-bold cursor-pointer">
              <input
                type="radio"
                name="isTied"
                checked={isTied === false}
                onChange={() => setIsTied(false)}
                className="w-4 h-4 accent-cyan-400"
              />
              No
            </label>
          </div>


          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-bold uppercase">Cricket Format :</label>
            <select
              value={
                overs === 5 ? 'T5' : overs === 10 ? 'T10' : overs === 20 ? 'T20' : overs === 50 ? 'ODI' : overs === 1 ? 'Super Over' : 'Custom'
              }
              onChange={(e) => {
                const fmt = e.target.value;
                if (fmt === 'T5') { setOvers(5); setBallsPerOver(6); }
                else if (fmt === 'T10') { setOvers(10); setBallsPerOver(6); }
                else if (fmt === 'T20') { setOvers(20); setBallsPerOver(6); }
                else if (fmt === 'ODI') { setOvers(50); setBallsPerOver(6); }
                else if (fmt === 'The Hundred') { setOvers(17); setBallsPerOver(5); }
                else if (fmt === 'Super Over') { setOvers(1); setBallsPerOver(6); }
              }}
              className="w-48 px-3 py-1.5 text-slate-900 font-bold bg-amber-400 rounded-md focus:outline-none"
            >
              <option value="T20">T20 (20 Overs)</option>
              <option value="T10">T10 (10 Overs)</option>
              <option value="T5">T5 (5 Overs)</option>
              <option value="ODI">ODI (50 Overs)</option>
              <option value="The Hundred">The Hundred (100 Balls)</option>
              <option value="Super Over">Super Over (1 Over)</option>
              <option value="Custom">Custom Format</option>
            </select>
          </div>


          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-bold uppercase">Match Type :</label>
            <select
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
              className="w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md focus:outline-none"
            >
              <option value="Group Stage">Group Stage</option>
              <option value="Quarter Final">Quarter Final</option>
              <option value="Semi Final">Semi Final</option>
              <option value="Final">Final</option>
              <option value="Knockout">Knockout</option>
              <option value="League Match">League Match</option>
            </select>
          </div>


          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-bold uppercase">Group No. :</label>
            <select
              value={groupNo}
              onChange={(e) => setGroupNo(Number(e.target.value))}
              className="w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md focus:outline-none"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>


          <div className="pt-3 border-t border-blue-400/40 space-y-2 text-left">
            <p className="text-xs font-black uppercase text-amber-400 text-center tracking-wider">Player Photos</p>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-cyan-300">Striker Photo URL ({striker?.name})</label>
              <input
                type="text"
                placeholder="https://example.com/player.png or file path"
                value={strikerPhoto}
                onChange={(e) => setStrikerPhoto(e.target.value)}
                className="w-full px-3 py-1.5 text-xs text-slate-900 font-bold bg-white rounded-md focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1 text-cyan-300">Bowler Photo URL ({currentBowler?.name})</label>
              <input
                type="text"
                placeholder="https://example.com/bowler.png or file path"
                value={bowlerPhoto}
                onChange={(e) => setBowlerPhoto(e.target.value)}
                className="w-full px-3 py-1.5 text-xs text-slate-900 font-bold bg-white rounded-md focus:outline-none"
              />
            </div>
          </div>


          <div className="flex items-center justify-center gap-4 pt-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white font-black px-6 py-2 rounded-lg shadow-lg uppercase transition-all"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-2 rounded-lg shadow-lg uppercase transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
