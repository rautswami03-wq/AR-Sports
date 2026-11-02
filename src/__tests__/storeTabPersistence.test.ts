import { describe, it, expect, beforeEach } from 'vitest';
import { useBroadcastStore } from '../store/useBroadcastStore';

describe('Store Tab Persistence & Theme Switching', () => {
  beforeEach(() => {
    useBroadcastStore.getState().resetMatchState();
  });

  it('initializes and updates teamABulkPaste, teamBBulkPaste, teamAName, and teamBName in store', () => {
    const store = useBroadcastStore.getState();
    expect(store.teamABulkPaste).toBe('');
    expect(store.teamBBulkPaste).toBe('');

    store.setTeamAName('Mumbai Indians');
    store.setTeamBName('Chennai Super Kings');
    store.setTeamABulkPaste('Rohit Sharma, Suryakumar Yadav, Jasprit Bumrah');
    store.setTeamBBulkPaste('MS Dhoni, Ruturaj Gaikwad, Ravindra Jadeja');

    const updated = useBroadcastStore.getState();
    expect(updated.teamAName).toBe('Mumbai Indians');
    expect(updated.teamBName).toBe('Chennai Super Kings');
    expect(updated.teamA.fullName).toBe('Mumbai Indians');
    expect(updated.teamB.fullName).toBe('Chennai Super Kings');
    expect(updated.teamABulkPaste).toBe('Rohit Sharma, Suryakumar Yadav, Jasprit Bumrah');
    expect(updated.teamBBulkPaste).toBe('MS Dhoni, Ruturaj Gaikwad, Ravindra Jadeja');
  });

  it('switching tournament/theme does NOT wipe out team names, player rosters, or bulk paste state', () => {
    const store = useBroadcastStore.getState();

    store.setTeamAName('Royal Challengers Bengaluru');
    store.setTeamBName('Kolkata Knight Riders');
    store.setTeamABulkPaste('Virat Kohli, Faf du Plessis, Glenn Maxwell');
    store.setTeamBBulkPaste('Shreyas Iyer, Andre Russell, Sunil Narine');

    // Add players to Team A
    store.bulkAddPlayers('teamA', ['Virat Kohli', 'Faf du Plessis', 'Glenn Maxwell']);
    // Add players to Team B
    store.bulkAddPlayers('teamB', ['Shreyas Iyer', 'Andre Russell', 'Sunil Narine']);

    // Switch theme to ipl25, t20_asia24, hotstar, cricastra
    store.setTournamentId('t20_asia24');

    let stateAfterTheme = useBroadcastStore.getState();
    expect(stateAfterTheme.tournamentId).toBe('t20_asia24');
    expect(stateAfterTheme.teamAName).toBe('Royal Challengers Bengaluru');
    expect(stateAfterTheme.teamBName).toBe('Kolkata Knight Riders');
    expect(stateAfterTheme.teamA.fullName).toBe('Royal Challengers Bengaluru');
    expect(stateAfterTheme.teamB.fullName).toBe('Kolkata Knight Riders');
    expect(stateAfterTheme.teamABulkPaste).toBe('Virat Kohli, Faf du Plessis, Glenn Maxwell');
    expect(stateAfterTheme.teamBBulkPaste).toBe('Shreyas Iyer, Andre Russell, Sunil Narine');
    expect(stateAfterTheme.teamA.batters.some((b) => b.name === 'Virat Kohli')).toBe(true);
    expect(stateAfterTheme.teamB.batters.some((b) => b.name === 'Andre Russell')).toBe(true);

    // Switch using setTournament
    store.setTournament('hotstar');

    stateAfterTheme = useBroadcastStore.getState();
    expect(stateAfterTheme.tournamentId).toBe('hotstar');
    expect(stateAfterTheme.teamA.fullName).toBe('Royal Challengers Bengaluru');
    expect(stateAfterTheme.teamB.fullName).toBe('Kolkata Knight Riders');
    expect(stateAfterTheme.teamABulkPaste).toBe('Virat Kohli, Faf du Plessis, Glenn Maxwell');
    expect(stateAfterTheme.teamBBulkPaste).toBe('Shreyas Iyer, Andre Russell, Sunil Narine');
    expect(stateAfterTheme.teamA.batters.some((b) => b.name === 'Virat Kohli')).toBe(true);
  });

  it('bulkAddPlayers supports both newline and comma separation and updates playingXI', () => {
    const store = useBroadcastStore.getState();

    const commaInput = 'Player A, Player B, Player C';
    const names = commaInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    store.bulkAddPlayers('teamA', names);

    let state = useBroadcastStore.getState();
    expect(state.teamA.playingXI).toContain('Player A');
    expect(state.teamA.playingXI).toContain('Player B');
    expect(state.teamA.playingXI).toContain('Player C');
    expect(state.teamA.batters.some((b) => b.name === 'Player A')).toBe(true);

    const newlineInput = 'Player D\nPlayer E';
    const moreNames = newlineInput.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    store.bulkAddPlayers('teamA', moreNames);

    state = useBroadcastStore.getState();
    expect(state.teamA.playingXI).toContain('Player D');
    expect(state.teamA.playingXI).toContain('Player E');
  });
});

