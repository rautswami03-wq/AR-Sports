import React, { useState } from 'react';
import { useBroadcastStore } from '../../store/useBroadcastStore';

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditMatchModal: React.FC<EditMatchModalProps> = ({ isOpen, onClose }) => {
  const { teamA, teamB, matchDetails, updateMatchSettings, updateTeamDetails } = useBroadcastStore();

  const [team1Name, setTeam1Name] = useState(teamA.fullName || '');
  const [team2Name, setTeam2Name] = useState(teamB.fullName || '');
  const [overs, setOvers] = useState(matchDetails.totalOvers || 20);
  const [matchNo, setMatchNo] = useState(matchDetails.matchNo || 1);
  const [isTied, setIsTied] = useState(matchDetails.isTied || false);
  const [ballsPerOver, setBallsPerOver] = useState(matchDetails.ballsPerOver || 6);
  const [matchType, setMatchType] = useState(matchDetails.matchType || 'Group Stage');
  const [groupNo, setGroupNo] = useState(matchDetails.groupNo || 1);

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-2xl shadow-2xl p-6 text-white border border-blue-400/40">
        <h2 className="text-2xl font-black text-center tracking-wider uppercase mb-5">
          EDIT MATCH
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4 text-center">
          {/* Team 1 Name */}
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Team 1 Name</label>
            <input
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Team 2 Name */}
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Team 2 Name</label>
            <input
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 font-bold bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Overs & Match No. */}
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

          {/* Match Tied? */}
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

          {/* Balls Per Over */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-bold uppercase">Balls Per Over :</label>
            <select
              value={ballsPerOver}
              onChange={(e) => setBallsPerOver(Number(e.target.value))}
              className="w-48 px-3 py-1.5 text-slate-900 font-bold bg-slate-100 rounded-md focus:outline-none"
            >
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={4}>4</option>
            </select>
          </div>

          {/* Match Type */}
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

          {/* Group No. */}
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

          {/* Actions */}
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
